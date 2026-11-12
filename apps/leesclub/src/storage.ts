import type { State } from './club';
import { seed } from './seed';

const DATA_KEY = 'bladwijzer.data';
const SESSION_KEY = 'bladwijzer.session';

// Private windows and blocked site data make localStorage throw; the app still works for that visit.
function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* see read() */
  }
}

export function loadState(now: Date): State {
  const raw = read(DATA_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as State;
    } catch {
      /* corrupt data: start over from the seed */
    }
  }
  return seed(now);
}

export const saveState = (s: State) => write(DATA_KEY, JSON.stringify(s));
export const loadSession = () => read(SESSION_KEY);
export const saveSession = (email: string | null) => write(SESSION_KEY, email);
