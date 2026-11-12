export type Rsvp = 'ja' | 'nee' | 'misschien';

export interface Member {
  email: string;
  name: string;
  organiser: boolean;
}

export interface Book {
  title: string;
  author: string;
  cover: string;
}

export interface Review {
  stars: number;
  opinion: string;
}

export interface BringItem {
  id: string;
  label: string;
  by: string | null;
}

export interface Meeting {
  id: string;
  date: string;
  address: string;
  host: string;
  book: Book;
  rsvps: Record<string, Rsvp>;
  bring: BringItem[];
  reviews: Record<string, Review>;
}

export interface Proposal {
  id: string;
  title: string;
  author: string;
  by: string;
  votes: string[];
  next: boolean;
}

export interface State {
  members: Member[];
  meetings: Meeting[];
  proposals: Proposal[];
}

export type MeetingDraft = Pick<Meeting, 'date' | 'address' | 'host' | 'book'> & { id?: string };

export const DEFAULT_BRING = ['Koffie', 'Thee', 'Taart', 'Koekjes', 'Fruit', 'Iets hartigs'];

// A meeting that started this evening should still be "the next one" on the home page.
const STILL_UPCOMING_MS = 4 * 3600_000;

const newId = () => crypto.randomUUID();

const mapMeeting = (s: State, id: string, f: (m: Meeting) => Meeting): State => ({
  ...s,
  meetings: s.meetings.map((m) => (m.id === id ? f(m) : m)),
});

const mapProposal = (s: State, id: string, f: (p: Proposal) => Proposal): State => ({
  ...s,
  proposals: s.proposals.map((p) => (p.id === id ? f(p) : p)),
});

const assertOrganiser = (s: State, email: string) => {
  if (!s.members.some((m) => m.email === email && m.organiser)) throw new Error('Enkel de organisator kan dit doen.');
};

const nameFromEmail = (email: string) =>
  email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

export function signIn(s: State, rawEmail: string): { state: State; member: Member } {
  const email = rawEmail.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Dat is geen geldig e-mailadres.');
  const existing = s.members.find((m) => m.email === email);
  if (existing) return { state: s, member: existing };
  const member: Member = { email, name: nameFromEmail(email), organiser: false };
  return { state: { ...s, members: [...s.members, member] }, member };
}

const isUpcoming = (m: Meeting, now: Date) => new Date(m.date).getTime() + STILL_UPCOMING_MS > now.getTime();

export const upcomingMeeting = (s: State, now: Date): Meeting | undefined =>
  s.meetings.filter((m) => isUpcoming(m, now)).sort((a, b) => a.date.localeCompare(b.date))[0];

export const pastMeetings = (s: State, now: Date): Meeting[] =>
  s.meetings.filter((m) => !isUpcoming(m, now)).sort((a, b) => b.date.localeCompare(a.date));

export function saveMeeting(s: State, actor: string, draft: MeetingDraft): State {
  assertOrganiser(s, actor);
  const { id, ...fields } = draft;
  if (id) return mapMeeting(s, id, (m) => ({ ...m, ...fields }));
  const meeting: Meeting = {
    ...fields,
    id: newId(),
    rsvps: {},
    reviews: {},
    bring: DEFAULT_BRING.map((label) => ({ id: newId(), label, by: null })),
  };
  return { ...s, meetings: [...s.meetings, meeting] };
}

export const setRsvp = (s: State, meetingId: string, email: string, rsvp: Rsvp): State =>
  mapMeeting(s, meetingId, (m) => ({ ...m, rsvps: { ...m.rsvps, [email]: rsvp } }));

export const toggleBring = (s: State, meetingId: string, itemId: string, email: string): State =>
  mapMeeting(s, meetingId, (m) => ({
    ...m,
    bring: m.bring.map((b) => {
      if (b.id !== itemId) return b;
      if (b.by === null) return { ...b, by: email };
      if (b.by === email) return { ...b, by: null };
      throw new Error('Iemand anders brengt dit al mee.');
    }),
  }));

export function addBringItem(s: State, meetingId: string, label: string, email: string): State {
  const clean = label.trim();
  if (!clean) return s;
  return mapMeeting(s, meetingId, (m) => ({ ...m, bring: [...m.bring, { id: newId(), label: clean, by: email }] }));
}

export function rate(s: State, meetingId: string, email: string, stars: number, opinion: string): State {
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) throw new Error('Kies 1 tot 5 sterren.');
  const review = { stars, opinion: opinion.replace(/\s+/g, ' ').trim() };
  return mapMeeting(s, meetingId, (m) => ({ ...m, reviews: { ...m.reviews, [email]: review } }));
}

export function averageStars(m: Meeting): number | undefined {
  const stars = Object.values(m.reviews).map((r) => r.stars);
  if (stars.length === 0) return undefined;
  return Math.round((stars.reduce((a, b) => a + b, 0) / stars.length) * 10) / 10;
}

export function addProposal(s: State, email: string, title: string, author: string): State {
  if (!title.trim()) return s;
  const proposal: Proposal = { id: newId(), title: title.trim(), author: author.trim(), by: email, votes: [email], next: false };
  return { ...s, proposals: [...s.proposals, proposal] };
}

export const toggleVote = (s: State, id: string, email: string): State =>
  mapProposal(s, id, (p) => ({
    ...p,
    votes: p.votes.includes(email) ? p.votes.filter((v) => v !== email) : [...p.votes, email],
  }));

export const rankedProposals = (s: State): Proposal[] =>
  [...s.proposals].sort((a, b) => b.votes.length - a.votes.length || a.title.localeCompare(b.title));

export function markNext(s: State, actor: string, id: string): State {
  assertOrganiser(s, actor);
  return { ...s, proposals: s.proposals.map((p) => ({ ...p, next: p.id === id ? !p.next : false })) };
}

export function deleteProposal(s: State, actor: string, id: string): State {
  const p = s.proposals.find((x) => x.id === id);
  if (p && p.by !== actor) throw new Error('Je kan enkel je eigen voorstellen verwijderen.');
  return { ...s, proposals: s.proposals.filter((x) => x.id !== id) };
}
