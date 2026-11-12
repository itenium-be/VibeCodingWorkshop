import { describe, expect, test } from 'bun:test';
import { confirmLogin, loadTrips, owner, requestLogin, saveTrips, signOut } from './store';
import { sampleTrip } from './sample';

const memory = (): Storage => {
  const m = new Map<string, string>();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => void m.set(k, v),
    removeItem: (k) => void m.delete(k),
    clear: () => m.clear(),
    key: () => null,
    get length() {
      return m.size;
    },
  };
};

describe('trips', () => {
  test('starts with the sample trip', () => {
    expect(loadTrips(memory())).toEqual([sampleTrip]);
  });

  test('round-trips saved trips', () => {
    const s = memory();
    const trips = [{ ...sampleTrip, title: 'Anders' }];
    saveTrips(s, trips);
    expect(loadTrips(s)).toEqual(trips);
  });

  test('falls back to the sample on broken data', () => {
    const s = memory();
    s.setItem('reisdagboek', '{oops');
    expect(loadTrips(s)).toEqual([sampleTrip]);
  });
});

describe('login', () => {
  test('a magic link signs the owner in', () => {
    const s = memory();
    const token = requestLogin(s, ' Wouter@Example.be ');
    expect(owner(s)).toBeNull();
    expect(confirmLogin(s, token)).toBe('wouter@example.be');
    expect(owner(s)).toBe('wouter@example.be');
  });

  test('a link works only once', () => {
    const s = memory();
    const token = requestLogin(s, 'a@b.be');
    confirmLogin(s, token);
    signOut(s);
    expect(confirmLogin(s, token)).toBeNull();
    expect(owner(s)).toBeNull();
  });

  test('a wrong token does nothing', () => {
    const s = memory();
    requestLogin(s, 'a@b.be');
    expect(confirmLogin(s, 'nep')).toBeNull();
  });
});
