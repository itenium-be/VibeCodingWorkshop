import { sampleTrip } from './sample';
import type { Trip } from './trip';

const TRIPS = 'reisdagboek';
const OWNER = 'reisdagboek.eigenaar';
const PENDING = 'reisdagboek.link';

export const loadTrips = (s: Storage): Trip[] => {
  try {
    const trips: unknown = JSON.parse(s.getItem(TRIPS) ?? 'null');
    return Array.isArray(trips) ? (trips as Trip[]) : [sampleTrip];
  } catch {
    return [sampleTrip];
  }
};

/** Throws a QuotaExceededError once the photos fill the browser's ~5 MB. */
export const saveTrips = (s: Storage, trips: Trip[]) => s.setItem(TRIPS, JSON.stringify(trips));

export const owner = (s: Storage) => s.getItem(OWNER);

// Without a server no mail goes out: the app shows the link it would have sent.
export const requestLogin = (s: Storage, email: string) => {
  const token = crypto.randomUUID();
  s.setItem(PENDING, JSON.stringify({ email: email.trim().toLowerCase(), token }));
  return token;
};

export const confirmLogin = (s: Storage, token: string): string | null => {
  try {
    const pending = JSON.parse(s.getItem(PENDING) ?? 'null') as { email: string; token: string } | null;
    if (pending?.token !== token) return null;
    s.removeItem(PENDING);
    s.setItem(OWNER, pending.email);
    return pending.email;
  } catch {
    return null;
  }
};

export const signOut = (s: Storage) => s.removeItem(OWNER);
