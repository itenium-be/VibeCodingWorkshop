import { describe, expect, test } from 'bun:test';
import { directions, generate, normalize, parseWords, type Placement } from '../src/woordzoeker/puzzle';

const seeded = (seed: number) => () => {
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const ANIMALS = ['Olifant', 'Giraf', 'Leeuw', 'Zebra', 'Egel', 'Konijn', 'Vlinder', 'Schildpad', 'Pinguïn', 'Kangoeroe'];

const read = (grid: string[][], p: Placement) =>
	[...p.word].map((_, i) => grid[p.row + i * p.dr][p.col + i * p.dc]).join('');

describe('normalize', () => {
	test.each([
		['Égel', 'EGEL'],
		['pinguïn', 'PINGUIN'],
		['  zeeëend ', 'ZEEEEND'],
		["'t konijn-tje", 'TKONIJNTJE'],
	])('%s → %s', (input, expected) => {
		expect(normalize(input)).toBe(expected);
	});
});

describe('parseWords', () => {
	test('one word per line, blanks dropped', () => {
		expect(parseWords('Olifant\n\n  Giraf \r\nLeeuw\n')).toEqual(['Olifant', 'Giraf', 'Leeuw']);
	});
});

describe('directions', () => {
	test('makkelijk: left-to-right and top-to-bottom', () => {
		expect(directions('makkelijk')).toEqual([[0, 1], [1, 0]]);
	});

	test('gemiddeld adds the diagonals', () => {
		expect(directions('gemiddeld')).toEqual([[0, 1], [1, 0], [1, 1], [-1, 1]]);
	});

	test('moeilijk adds every backwards direction', () => {
		const d = directions('moeilijk');
		expect(d).toHaveLength(8);
		expect(d).toContainEqual([0, -1]);
		expect(d).toContainEqual([-1, -1]);
	});
});

describe('generate', () => {
	test.each([10, 12, 15])('fills a %i×%i grid with capitals', size => {
		const { grid } = generate(ANIMALS, size, 'moeilijk', seeded(1));
		expect(grid).toHaveLength(size);
		for (const row of grid) expect(row.join('')).toMatch(new RegExp(`^[A-Z]{${size}}$`));
	});

	test.each(['makkelijk', 'gemiddeld', 'moeilijk'] as const)('%s: places every word, readable in the grid', difficulty => {
		const { grid, placed, tooLong, unplaced } = generate(ANIMALS, 12, difficulty, seeded(2));
		expect(tooLong).toEqual([]);
		expect(unplaced).toEqual([]);
		expect(placed.map(p => p.display).sort()).toEqual([...ANIMALS].sort());
		for (const p of placed) {
			expect(read(grid, p)).toBe(p.word);
			expect(directions(difficulty)).toContainEqual([p.dr, p.dc]);
		}
	});

	test('places words without accents', () => {
		const { grid, placed } = generate(['Pinguïn'], 10, 'makkelijk', seeded(3));
		expect(placed[0].word).toBe('PINGUIN');
		expect(read(grid, placed[0])).toBe('PINGUIN');
	});

	test('reports words too long for the grid', () => {
		const { placed, tooLong } = generate(['Nijlpaard', 'Kangoeroebaby'], 10, 'makkelijk', seeded(4));
		expect(tooLong).toEqual(['Kangoeroebaby']);
		expect(placed.map(p => p.display)).toEqual(['Nijlpaard']);
	});

	test('reports words that do not fit anymore', () => {
		const words = Array.from({ length: 20 }, (_, i) => `ABCDEFGHI${String.fromCharCode(65 + i)}`);
		const { placed, unplaced } = generate(words, 10, 'makkelijk', seeded(5));
		expect(placed.length + unplaced.length).toBe(20);
		expect(unplaced.length).toBeGreaterThan(0);
	});

	test('same seed, same puzzle; other seed, other puzzle', () => {
		const a = generate(ANIMALS, 12, 'gemiddeld', seeded(6)).grid;
		expect(generate(ANIMALS, 12, 'gemiddeld', seeded(6)).grid).toEqual(a);
		expect(generate(ANIMALS, 12, 'gemiddeld', seeded(7)).grid).not.toEqual(a);
	});
});
