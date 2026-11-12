export interface Comment {
  id: string;
  name: string;
  text: string;
  at: string;
}

export interface Day {
  title: string;
  story: string;
  photos: string[];
  place: string;
  lat?: number;
  lng?: number;
  mood: string;
  comments: Comment[];
}

export interface Trip {
  id: string;
  title: string;
  region: string;
  start: string;
  end: string;
  cover: string;
  /** Keyed by ISO date, so changing the trip dates keeps what was written. */
  days: Record<string, Day>;
}

export const MAX_PHOTOS = 10;
export const MOODS = ['😍', '😊', '😎', '🤩', '😴', '🥵', '🌧️', '🍝', '🍷', '🥾'];

export const emptyDay = (): Day => ({ title: '', story: '', photos: [], place: '', mood: '', comments: [] });

export const dayOf = (trip: Trip, date: string): Day => trip.days[date] ?? emptyDay();

const DAY_MS = 86_400_000;

// UTC arithmetic: local-time Dates skip or repeat a day across DST changes.
export const tripDates = (start: string, end: string): string[] => {
  const from = Date.parse(`${start}T00:00:00Z`);
  const to = Date.parse(`${end}T00:00:00Z`);
  const dates: string[] = [];
  for (let t = from; t <= to; t += DAY_MS) dates.push(new Date(t).toISOString().slice(0, 10));
  return dates;
};

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const inline = (s: string) =>
  s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');

export const renderStory = (story: string): string =>
  story
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${inline(escape(p)).replace(/\n/g, '<br>')}</p>`)
    .join('');

export const excerpt = (story: string, max: number): string => {
  const plain = story.replace(/\*/g, '').replace(/\s+/g, ' ').trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
};

export interface Stop {
  date: string;
  number: number;
  lat: number;
  lng: number;
}

export const route = (trip: Trip): Stop[] =>
  tripDates(trip.start, trip.end).flatMap((date, i) => {
    const d = trip.days[date];
    return d?.lat != null && d.lng != null ? [{ date, number: i + 1, lat: d.lat, lng: d.lng }] : [];
  });

export const updateDay = (trip: Trip, date: string, change: Partial<Day>): Trip => ({
  ...trip,
  days: { ...trip.days, [date]: { ...dayOf(trip, date), ...change } },
});

export const addComment = (trip: Trip, date: string, name: string, text: string, at: string): Trip => {
  const comment = { id: crypto.randomUUID(), name: name.trim(), text: text.trim(), at };
  if (!comment.name || !comment.text) return trip;
  return updateDay(trip, date, { comments: [...dayOf(trip, date).comments, comment] });
};

export const fitWithin = (width: number, height: number, max: number) => {
  const scale = Math.min(1, max / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
};

const dateFormat = new Intl.DateTimeFormat('nl-BE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
const shortFormat = new Intl.DateTimeFormat('nl-BE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const formatDay = (date: string) => dateFormat.format(new Date(`${date}T00:00:00Z`));
export const formatDate = (date: string) => shortFormat.format(new Date(`${date}T00:00:00Z`));
