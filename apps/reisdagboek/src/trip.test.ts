import { describe, expect, test } from 'bun:test';
import { addComment, emptyDay, excerpt, fitWithin, renderStory, route, tripDates, updateDay, type Trip } from './trip';

const trip: Trip = {
  id: 't',
  title: 'Toscane',
  region: 'Italië',
  start: '2026-05-10',
  end: '2026-05-12',
  cover: '',
  days: {},
};

describe('tripDates', () => {
  test('lists every day inclusive', () => {
    expect(tripDates('2026-05-10', '2026-05-12')).toEqual(['2026-05-10', '2026-05-11', '2026-05-12']);
  });

  test('crosses month and DST boundaries', () => {
    expect(tripDates('2026-03-28', '2026-04-01')).toEqual([
      '2026-03-28',
      '2026-03-29',
      '2026-03-30',
      '2026-03-31',
      '2026-04-01',
    ]);
  });

  test('is empty when the end lies before the start', () => {
    expect(tripDates('2026-05-12', '2026-05-10')).toEqual([]);
  });
});

describe('renderStory', () => {
  test('escapes html', () => {
    expect(renderStory('<b>&"')).toBe('<p>&lt;b&gt;&amp;&quot;</p>');
  });

  test('splits paragraphs on blank lines and keeps single line breaks', () => {
    expect(renderStory('een\ntwee\n\ndrie')).toBe('<p>een<br>twee</p><p>drie</p>');
  });

  test('supports bold and italic', () => {
    expect(renderStory('**vet** en *schuin*')).toBe('<p><strong>vet</strong> en <em>schuin</em></p>');
  });

  test('renders nothing for an empty story', () => {
    expect(renderStory('  \n ')).toBe('');
  });
});

describe('excerpt', () => {
  test('strips formatting and cuts on a word', () => {
    expect(excerpt('**Florence** is prachtig vandaag', 20)).toBe('Florence is…');
  });

  test('keeps short stories whole', () => {
    expect(excerpt('Kort *verhaal*', 50)).toBe('Kort verhaal');
  });
});

describe('route', () => {
  test('keeps days with a location, in date order', () => {
    const t: Trip = {
      ...trip,
      days: {
        '2026-05-12': { ...emptyDay(), lat: 3, lng: 3 },
        '2026-05-10': { ...emptyDay(), lat: 1, lng: 1 },
        '2026-05-11': emptyDay(),
      },
    };
    expect(route(t)).toEqual([
      { date: '2026-05-10', number: 1, lat: 1, lng: 1 },
      { date: '2026-05-12', number: 3, lat: 3, lng: 3 },
    ]);
  });

  test('ignores days outside the trip dates', () => {
    expect(route({ ...trip, days: { '2026-06-01': { ...emptyDay(), lat: 1, lng: 1 } } })).toEqual([]);
  });
});

describe('updateDay', () => {
  test('creates the day when missing and leaves the trip untouched', () => {
    const next = updateDay(trip, '2026-05-11', { title: 'Siena' });
    expect(next.days['2026-05-11'].title).toBe('Siena');
    expect(trip.days).toEqual({});
  });
});

describe('addComment', () => {
  test('appends a trimmed comment', () => {
    const next = addComment(trip, '2026-05-10', '  Oma ', ' Mooi! ', '2026-05-10T20:00:00Z');
    expect(next.days['2026-05-10'].comments).toEqual([
      { id: expect.any(String), name: 'Oma', text: 'Mooi!', at: '2026-05-10T20:00:00Z' },
    ]);
  });

  test('ignores a comment without name or text', () => {
    expect(addComment(trip, '2026-05-10', 'Oma', '  ', 'x')).toBe(trip);
    expect(addComment(trip, '2026-05-10', '', 'Hoi', 'x')).toBe(trip);
  });
});

describe('fitWithin', () => {
  test('scales the longest side down to the maximum', () => {
    expect(fitWithin(4000, 3000, 1200)).toEqual({ width: 1200, height: 900 });
    expect(fitWithin(3000, 4000, 1200)).toEqual({ width: 900, height: 1200 });
  });

  test('never scales up', () => {
    expect(fitWithin(800, 600, 1200)).toEqual({ width: 800, height: 600 });
  });
});
