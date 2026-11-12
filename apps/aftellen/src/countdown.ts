export const THEMES = [
  'zee',
  'bergen',
  'sinterklaas',
  'kerstmis',
  'verjaardag',
  'pasen',
  'kamp',
  'logeren',
] as const;
export type ThemeId = (typeof THEMES)[number];

/** Dates are local calendar days as `YYYY-MM-DD`: the countdown ends at midnight, wherever you are. */
export interface Countdown {
  id: string;
  title: string;
  date: string;
  created: string;
  theme: ThemeId | null;
  emoji: string | null;
}

export type SharedCountdown = Omit<Countdown, 'id'>;

const MAX_MOONS = 60;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const midnight = (date: string) => {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const dayNumber = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000;

export const toDateString = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const nightsBetween = (from: string, to: string) => dayNumber(midnight(to)) - dayNumber(midnight(from));

export const nightsLeft = (date: string, now: Date) => Math.max(0, dayNumber(midnight(date)) - dayNumber(now));

export const isToday = (date: string, now: Date) => toDateString(now) === date;

export const timeLeft = (date: string, now: Date) => {
  const total = Math.max(0, Math.floor((midnight(date).getTime() - now.getTime()) / 1000));
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor(total / 3600) % 24,
    minutes: Math.floor(total / 60) % 60,
    seconds: total % 60,
  };
};

const totalNights = (c: Countdown) => Math.max(0, nightsBetween(c.created, c.date));

export const moons = (c: Countdown, now: Date) => {
  const left = nightsLeft(c.date, now);
  if (left > MAX_MOONS) return null;
  const slept = Math.max(0, Math.min(totalNights(c) - left, MAX_MOONS - left));
  return { left, slept };
};

export const progress = (c: Countdown, now: Date) => {
  const total = totalNights(c);
  const left = nightsLeft(c.date, now);
  if (total === 0) return left === 0 ? 1 : 0;
  return Math.min(1, Math.max(0, (total - left) / total));
};

export const sortSoonestFirst = (list: Countdown[]) => [...list].sort((a, b) => a.date.localeCompare(b.date));

export const encodeShare = (c: Countdown) => {
  const p = new URLSearchParams({ t: c.title, d: c.date, c: c.created });
  if (c.theme) p.set('th', c.theme);
  else if (c.emoji) p.set('e', c.emoji);
  return `#/deel?${p}`;
};

export const decodeShare = (hash: string): SharedCountdown | null => {
  const p = new URLSearchParams(hash.split('?')[1] ?? '');
  const title = p.get('t')?.trim();
  const date = p.get('d') ?? '';
  if (!title || !DATE.test(date)) return null;
  const created = p.get('c') ?? '';
  const theme = p.get('th');
  return {
    title,
    date,
    created: DATE.test(created) ? created : toDateString(new Date()),
    theme: THEMES.includes(theme as ThemeId) ? (theme as ThemeId) : null,
    emoji: p.get('e') || null,
  };
};
