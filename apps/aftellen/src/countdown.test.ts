import { describe, expect, test } from 'bun:test';
import {
  type Countdown,
  decodeShare,
  encodeShare,
  moons,
  nightsLeft,
  progress,
  sortSoonestFirst,
  timeLeft,
} from './countdown';

const at = (iso: string) => new Date(iso);

const italy: Countdown = {
  id: 'a',
  title: 'Vakantie naar Italië',
  date: '2026-11-24',
  created: '2026-11-02',
  theme: 'zee',
  emoji: null,
};

describe('nightsLeft', () => {
  test('counts calendar nights until the date', () => {
    expect(nightsLeft('2026-11-24', at('2026-11-12T08:00'))).toBe(12);
    expect(nightsLeft('2026-11-24', at('2026-11-12T23:59'))).toBe(12);
  });

  test('is one on the evening before', () => {
    expect(nightsLeft('2026-11-13', at('2026-11-12T20:00'))).toBe(1);
  });

  test('is zero on the day itself and after', () => {
    expect(nightsLeft('2026-11-12', at('2026-11-12T00:00'))).toBe(0);
    expect(nightsLeft('2026-11-10', at('2026-11-12T10:00'))).toBe(0);
  });

  test('ignores the daylight saving switch', () => {
    expect(nightsLeft('2027-03-29', at('2027-03-27T12:00'))).toBe(2);
  });
});

describe('timeLeft', () => {
  test('splits the time until midnight of the date', () => {
    expect(timeLeft('2026-11-14', at('2026-11-12T22:58:30'))).toEqual({
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 30,
    });
  });

  test('is all zero once the day has come', () => {
    expect(timeLeft('2026-11-12', at('2026-11-12T09:00'))).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });
});

describe('moons', () => {
  test('one per night since creation, the slept ones faded', () => {
    expect(moons(italy, at('2026-11-12T10:00'))).toEqual({ left: 12, slept: 10 });
  });

  test('caps the row at 60 moons, keeping all nights left', () => {
    const c = { ...italy, created: '2026-01-01' };
    expect(moons(c, at('2026-11-12T10:00'))).toEqual({ left: 12, slept: 48 });
  });

  test('is null when more than 60 nights are left', () => {
    const c = { ...italy, date: '2027-02-01' };
    expect(moons(c, at('2026-11-12T10:00'))).toBeNull();
  });
});

describe('progress', () => {
  test('is the share of nights already slept', () => {
    expect(progress({ ...italy, created: '2026-11-04' }, at('2026-11-14T10:00'))).toBe(0.5);
  });

  test('is full on the day and never negative', () => {
    expect(progress(italy, at('2026-11-24T10:00'))).toBe(1);
    expect(progress({ ...italy, created: '2026-11-24' }, at('2026-11-20T10:00'))).toBe(0);
  });
});

describe('sortSoonestFirst', () => {
  test('orders by date', () => {
    const later = { ...italy, id: 'b', date: '2026-12-25' };
    const sooner = { ...italy, id: 'c', date: '2026-11-15' };
    expect(sortSoonestFirst([later, italy, sooner]).map((c) => c.id)).toEqual(['c', 'a', 'b']);
  });
});

describe('share link', () => {
  test('round-trips a themed countdown', () => {
    const hash = encodeShare(italy);
    expect(decodeShare(hash)).toEqual({
      title: 'Vakantie naar Italië',
      date: '2026-11-24',
      created: '2026-11-02',
      theme: 'zee',
      emoji: null,
    });
  });

  test('round-trips an emoji countdown', () => {
    const c = { ...italy, theme: null, emoji: '🦄' };
    expect(decodeShare(encodeShare(c))).toMatchObject({ theme: null, emoji: '🦄' });
  });

  test('rejects a link without a valid date', () => {
    expect(decodeShare('#/deel?t=Kamp&d=morgen&th=kamp')).toBeNull();
  });

  test('drops an unknown theme', () => {
    expect(decodeShare('#/deel?t=Kamp&d=2026-12-01&th=maan')).toMatchObject({ theme: null });
  });
});
