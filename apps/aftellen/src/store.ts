import type { Countdown, SharedCountdown } from './countdown';

const KEY = 'nachtjes';

export const load = (s: Storage): Countdown[] => {
  try {
    const list: unknown = JSON.parse(s.getItem(KEY) ?? '[]');
    return Array.isArray(list) ? (list as Countdown[]) : [];
  } catch {
    return [];
  }
};

export const save = (s: Storage, list: Countdown[]) => s.setItem(KEY, JSON.stringify(list));

export const addShared = (list: Countdown[], shared: SharedCountdown) => {
  const existing = list.find((c) => c.title === shared.title && c.date === shared.date);
  if (existing) return { list, id: existing.id };
  const id = crypto.randomUUID();
  return { list: [...list, { ...shared, id }], id };
};
