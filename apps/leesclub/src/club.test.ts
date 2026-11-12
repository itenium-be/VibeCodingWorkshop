import { describe, expect, test } from 'bun:test';
import {
  addBringItem,
  addProposal,
  averageStars,
  deleteProposal,
  markNext,
  pastMeetings,
  rankedProposals,
  rate,
  saveMeeting,
  setRsvp,
  signIn,
  toggleBring,
  toggleVote,
  upcomingMeeting,
  type MeetingDraft,
  type State,
} from './club';
import { seed, ORGANISER } from './seed';

const now = new Date('2026-11-12T10:00:00');
const fresh = (): State => seed(now);
const member = 'koen@debladwijzer.be';
const other = 'sofie@debladwijzer.be';

describe('seed', () => {
  test('has two past meetings and one upcoming', () => {
    const s = fresh();
    expect(pastMeetings(s, now)).toHaveLength(2);
    expect(upcomingMeeting(s, now)).toBeDefined();
  });

  test('has exactly one organiser', () => {
    expect(fresh().members.filter((m) => m.organiser).map((m) => m.email)).toEqual([ORGANISER]);
  });
});

describe('signIn', () => {
  test('normalises the e-mail and reuses an existing member', () => {
    const { state, member: m } = signIn(fresh(), '  Koen@DeBladwijzer.be ');
    expect(m.email).toBe(member);
    expect(state.members.filter((x) => x.email === member)).toHaveLength(1);
  });

  test('adds an unknown address as a regular member named after the mailbox', () => {
    const { state, member: m } = signIn(fresh(), 'nieuw.lid@example.be');
    expect(m).toEqual({ email: 'nieuw.lid@example.be', name: 'Nieuw Lid', organiser: false });
    expect(state.members).toContainEqual(m);
  });

  test('rejects something that is not an e-mail address', () => {
    expect(() => signIn(fresh(), 'koen')).toThrow();
  });
});

describe('meetings', () => {
  test('a meeting stays upcoming until a few hours after it starts', () => {
    const s = fresh();
    const next = upcomingMeeting(s, now)!;
    const evening = new Date(new Date(next.date).getTime() + 2 * 3600_000);
    expect(upcomingMeeting(s, evening)?.id).toBe(next.id);
    const nextDay = new Date(new Date(next.date).getTime() + 24 * 3600_000);
    expect(upcomingMeeting(s, nextDay)).toBeUndefined();
    expect(pastMeetings(s, nextDay)[0].id).toBe(next.id);
  });

  test('past meetings are newest first', () => {
    const [a, b] = pastMeetings(fresh(), now);
    expect(a.date > b.date).toBe(true);
  });

  const draft: MeetingDraft = {
    date: '2027-01-14T20:00',
    address: 'Kerkstraat 1, Gent',
    host: member,
    book: { title: 'Tirza', author: 'Arnon Grunberg', cover: '' },
  };

  test('only the organiser can create a meeting', () => {
    expect(() => saveMeeting(fresh(), member, draft)).toThrow();
    const s = saveMeeting(fresh(), ORGANISER, draft);
    const created = s.meetings.find((m) => m.book.title === 'Tirza')!;
    expect(created.bring.length).toBeGreaterThan(0);
    expect(created.rsvps).toEqual({});
  });

  test('editing keeps attendance, bring list and reviews', () => {
    const s0 = fresh();
    const id = upcomingMeeting(s0, now)!.id;
    const s1 = setRsvp(s0, id, member, 'ja');
    const s2 = saveMeeting(s1, ORGANISER, { ...draft, id });
    const m = s2.meetings.find((x) => x.id === id)!;
    expect(m.address).toBe('Kerkstraat 1, Gent');
    expect(m.rsvps[member]).toBe('ja');
  });
});

describe('attendance and bring list', () => {
  test('rsvp replaces the previous answer', () => {
    const s0 = fresh();
    const id = upcomingMeeting(s0, now)!.id;
    const s = setRsvp(setRsvp(s0, id, member, 'ja'), id, member, 'misschien');
    expect(s.meetings.find((m) => m.id === id)!.rsvps[member]).toBe('misschien');
  });

  test('an item can be claimed once and only released by whoever claimed it', () => {
    const s0 = fresh();
    const meeting = upcomingMeeting(s0, now)!;
    const free = meeting.bring.find((b) => b.by === null)!;
    const s1 = toggleBring(s0, meeting.id, free.id, member);
    const item = () => s1.meetings.find((m) => m.id === meeting.id)!.bring.find((b) => b.id === free.id)!;
    expect(item().by).toBe(member);
    expect(() => toggleBring(s1, meeting.id, free.id, other)).toThrow();
    const s2 = toggleBring(s1, meeting.id, free.id, member);
    expect(s2.meetings.find((m) => m.id === meeting.id)!.bring.find((b) => b.id === free.id)!.by).toBeNull();
  });

  test('a member can add an item they bring themselves', () => {
    const s0 = fresh();
    const id = upcomingMeeting(s0, now)!.id;
    const s = addBringItem(s0, id, '  Wijn ', member);
    expect(s.meetings.find((m) => m.id === id)!.bring.at(-1)).toMatchObject({ label: 'Wijn', by: member });
  });
});

describe('reviews', () => {
  test('rating stores stars and a single-line opinion', () => {
    const s0 = fresh();
    const id = pastMeetings(s0, now)[0].id;
    const s = rate(s0, id, member, 4, 'Mooi\ngeschreven ');
    expect(s.meetings.find((m) => m.id === id)!.reviews[member]).toEqual({ stars: 4, opinion: 'Mooi geschreven' });
  });

  test('stars must be 1 to 5', () => {
    const id = pastMeetings(fresh(), now)[0].id;
    expect(() => rate(fresh(), id, member, 0, '')).toThrow();
    expect(() => rate(fresh(), id, member, 6, '')).toThrow();
  });

  test('average is rounded to one decimal, undefined without reviews', () => {
    const base = pastMeetings(fresh(), now)[0];
    expect(averageStars({ ...base, reviews: {} })).toBeUndefined();
    expect(
      averageStars({ ...base, reviews: { a: { stars: 5, opinion: '' }, b: { stars: 4, opinion: '' }, c: { stars: 4, opinion: '' } } }),
    ).toBe(4.3);
  });
});

describe('proposals', () => {
  test('voting toggles and the most popular come first', () => {
    const s0 = addProposal(fresh(), member, 'Congo', 'David Van Reybrouck');
    const id = s0.proposals.find((p) => p.title === 'Congo')!.id;
    let s = s0;
    for (const m of s.members.slice(0, 9)) s = toggleVote(s, id, m.email);
    expect(rankedProposals(s)[0].id).toBe(id);
    const once = toggleVote(s, id, member);
    const twice = toggleVote(once, id, member);
    expect(twice.proposals.find((p) => p.id === id)!.votes).toEqual(s.proposals.find((p) => p.id === id)!.votes);
  });

  test('only the organiser marks the next book, and only one at a time', () => {
    const s0 = fresh();
    const [a, b] = s0.proposals;
    expect(() => markNext(s0, member, a.id)).toThrow();
    const s = markNext(markNext(s0, ORGANISER, a.id), ORGANISER, b.id);
    expect(s.proposals.filter((p) => p.next).map((p) => p.id)).toEqual([b.id]);
  });

  test('members delete only their own proposals', () => {
    const s0 = addProposal(fresh(), member, 'De avonden', 'Gerard Reve');
    const id = s0.proposals.find((p) => p.title === 'De avonden')!.id;
    expect(() => deleteProposal(s0, other, id)).toThrow();
    expect(deleteProposal(s0, member, id).proposals.some((p) => p.id === id)).toBe(false);
  });
});
