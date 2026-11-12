import { DEFAULT_BRING, type Meeting, type Member, type Review, type Rsvp, type State } from './club';

export const ORGANISER = 'els@debladwijzer.be';

const names = ['Els', 'Koen', 'Sofie', 'Pieter', 'An', 'Jan', 'Lien', 'Bart', 'Griet', 'Tom'];
const members: Member[] = names.map((name) => ({
  email: `${name.toLowerCase()}@debladwijzer.be`,
  name,
  organiser: name === 'Els',
}));
const e = (name: string) => `${name.toLowerCase()}@debladwijzer.be`;

const cover = (id: number) => `https://covers.openlibrary.org/b/id/${id}-M.jpg`;

const pad = (n: number) => String(n).padStart(2, '0');
// Local wall-clock time without a zone, so a meeting at 20:00 stays 20:00 for every member.
function at(now: Date, daysFromNow: number, hour: number): string {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysFromNow, hour);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(hour)}:00`;
}

const reviews = (entries: [string, number, string][]): Record<string, Review> =>
  Object.fromEntries(entries.map(([n, stars, opinion]) => [e(n), { stars, opinion }]));

const bring = (prefix: string, claimed: Record<string, string>) =>
  DEFAULT_BRING.map((label, i) => ({ id: `${prefix}-b${i}`, label, by: claimed[label] ? e(claimed[label]) : null }));

const rsvps = (entries: Record<string, Rsvp>): Record<string, Rsvp> =>
  Object.fromEntries(Object.entries(entries).map(([n, r]) => [e(n), r]));

// Dates are relative to the first visit so the club never looks stale.
export function seed(now: Date): State {
  const meetings: Meeting[] = [
    {
      id: 'm-helaasheid',
      date: at(now, -63, 20),
      address: 'Molenstraat 12, Gent',
      host: e('Griet'),
      book: { title: 'De helaasheid der dingen', author: 'Dimitri Verhulst', cover: cover(6292331) },
      rsvps: rsvps({ Els: 'ja', Koen: 'ja', Sofie: 'ja', Pieter: 'ja', An: 'ja', Griet: 'ja', Tom: 'ja', Lien: 'nee' }),
      bring: bring('m1', { Koffie: 'Griet', Taart: 'Sofie', Koekjes: 'Tom' }),
      reviews: reviews([
        ['Els', 5, 'Rauw, grappig en ontroerend tegelijk.'],
        ['Koen', 4, 'Ik heb luidop gelachen op de trein.'],
        ['Sofie', 3, 'Soms wat te plat naar mijn smaak.'],
        ['Pieter', 4, 'Herkenbaar Vlaams dorpsleven, met een krop in de keel.'],
        ['Griet', 5, 'Die nonkels vergeet ik nooit meer.'],
      ]),
    },
    {
      id: 'm-verdriet',
      date: at(now, -28, 20),
      address: 'Kortrijksesteenweg 88, Sint-Martens-Latem',
      host: e('Pieter'),
      book: { title: 'Het verdriet van België', author: 'Hugo Claus', cover: cover(5837325) },
      rsvps: rsvps({ Els: 'ja', Koen: 'ja', Pieter: 'ja', An: 'ja', Jan: 'ja', Lien: 'ja', Bart: 'misschien', Tom: 'nee' }),
      bring: bring('m2', { Koffie: 'Pieter', Thee: 'An', Taart: 'Lien', 'Iets hartigs': 'Jan' }),
      reviews: reviews([
        ['Els', 5, 'Een meesterwerk, al was het een hele klus.'],
        ['Koen', 3, 'Prachtige zinnen, maar te lang voor drie weken.'],
        ['An', 4, 'Louis gaat nog lang met me mee.'],
        ['Jan', 4, 'Na honderd bladzijden zat ik erin.'],
        ['Lien', 5, 'Ik begrijp mijn grootouders nu een beetje beter.'],
        ['Pieter', 4, 'Rijk, donker en verrassend geestig.'],
      ]),
    },
    {
      id: 'm-smelt',
      date: at(now, 14, 20),
      address: 'Lindenlaan 5, Gentbrugge',
      host: e('An'),
      book: { title: 'Het smelt', author: 'Lize Spit', cover: cover(13303384) },
      rsvps: rsvps({ Els: 'ja', An: 'ja', Koen: 'ja', Lien: 'misschien', Bart: 'ja', Tom: 'nee' }),
      bring: bring('m3', { Koffie: 'An', Taart: 'Bart' }),
      reviews: {},
    },
  ];

  return {
    members,
    meetings,
    proposals: [
      { id: 'p-aanslag', title: 'De aanslag', author: 'Harry Mulisch', by: e('Jan'), votes: [e('Jan'), e('Els'), e('Pieter'), e('Lien')], next: true },
      { id: 'p-congo', title: 'Congo', author: 'David Van Reybrouck', by: e('Lien'), votes: [e('Lien'), e('Koen'), e('Bart')], next: false },
      { id: 'p-tirza', title: 'Tirza', author: 'Arnon Grunberg', by: e('Sofie'), votes: [e('Sofie')], next: false },
    ],
  };
}
