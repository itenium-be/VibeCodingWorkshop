export type Difficulty = 'makkelijk' | 'gemiddeld' | 'moeilijk';
export type Direction = [dr: number, dc: number];

export interface Placement {
	display: string;
	word: string;
	row: number;
	col: number;
	dr: number;
	dc: number;
}

export interface Puzzle {
	grid: string[][];
	placed: Placement[];
	tooLong: string[];
	unplaced: string[];
}

const ATTEMPTS = 30;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const normalize = (word: string) =>
	word.normalize('NFD').toUpperCase().replace(/[^A-Z]/g, '');

export const parseWords = (text: string) =>
	text.split('\n').map(w => w.trim()).filter(Boolean);

export function directions(difficulty: Difficulty): Direction[] {
	const easy: Direction[] = [[0, 1], [1, 0]];
	if (difficulty === 'makkelijk') return easy;
	const medium: Direction[] = [...easy, [1, 1], [-1, 1]];
	if (difficulty === 'gemiddeld') return medium;
	return [...medium, ...medium.map(([dr, dc]): Direction => [-dr || 0, -dc || 0])];
}

function attempt(words: { display: string; word: string }[], size: number, dirs: Direction[], rng: () => number) {
	const grid: string[][] = Array.from({ length: size }, () => Array<string>(size).fill(''));
	const placed: Placement[] = [];
	const unplaced: string[] = [];
	const inside = (i: number) => i >= 0 && i < size;

	for (const { display, word } of words) {
		const options: Placement[] = [];
		for (const [dr, dc] of dirs)
			for (let row = 0; row < size; row++)
				for (let col = 0; col < size; col++) {
					if (!inside(row + dr * (word.length - 1)) || !inside(col + dc * (word.length - 1))) continue;
					if ([...word].every((ch, i) => [ch, ''].includes(grid[row + i * dr][col + i * dc])))
						options.push({ display, word, row, col, dr, dc });
				}
		if (!options.length) {
			unplaced.push(display);
			continue;
		}
		const p = options[Math.floor(rng() * options.length)];
		[...word].forEach((ch, i) => (grid[p.row + i * p.dr][p.col + i * p.dc] = ch));
		placed.push(p);
	}
	return { grid, placed, unplaced };
}

export function generate(words: string[], size: number, difficulty: Difficulty, rng: () => number = Math.random): Puzzle {
	const all = words.map(display => ({ display, word: normalize(display) })).filter(w => w.word);
	const tooLong = all.filter(w => w.word.length > size).map(w => w.display);
	const fitting = all.filter(w => w.word.length <= size).sort((a, b) => b.word.length - a.word.length);
	const dirs = directions(difficulty);

	let best = attempt(fitting, size, dirs, rng);
	for (let i = 1; i < ATTEMPTS && best.unplaced.length; i++) {
		const next = attempt(fitting, size, dirs, rng);
		if (next.unplaced.length < best.unplaced.length) best = next;
	}

	for (const row of best.grid)
		row.forEach((ch, c) => (row[c] = ch || ALPHABET[Math.floor(rng() * ALPHABET.length)]));
	return { ...best, tooLong };
}
