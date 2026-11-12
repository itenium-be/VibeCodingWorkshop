import { describe, expect, test } from 'bun:test';
import type { Countdown } from './countdown';
import { addShared, load, save } from './store';

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

const kamp: Countdown = { id: 'k', title: 'Kamp', date: '2026-12-01', created: '2026-11-01', theme: 'kamp', emoji: null };

describe('store', () => {
  test('round-trips the list', () => {
    const s = memory();
    save(s, [kamp]);
    expect(load(s)).toEqual([kamp]);
  });

  test('starts empty on missing or broken data', () => {
    const s = memory();
    expect(load(s)).toEqual([]);
    s.setItem('nachtjes', '{oops');
    expect(load(s)).toEqual([]);
  });
});

describe('addShared', () => {
  const { id: _, ...shared } = kamp;

  test('adds an unknown countdown with a fresh id', () => {
    const { list, id } = addShared([], shared);
    expect(list).toHaveLength(1);
    expect(list[0]).toEqual({ ...shared, id });
  });

  test('reuses the same countdown when opened twice', () => {
    const { list, id } = addShared([kamp], shared);
    expect(list).toEqual([kamp]);
    expect(id).toBe('k');
  });
});
