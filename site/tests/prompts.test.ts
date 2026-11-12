import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parsePrompts } from '../src/prompts';

const prompts = parsePrompts(readFileSync(join(import.meta.dir, '..', '..', 'APP-PROMPTS.md'), 'utf8'));

test('reads every app', () => {
	expect(Object.keys(prompts)).toEqual(['Woordzoeker-maker', 'Familiequiz', 'Aftellen', 'Leesclub', 'Reisdagboek', 'Planten water geven', 'Receptenboek', 'Bingokaarten']);
});

test('splits the prompt into its paragraphs', () => {
	const { paragraphs } = prompts['Woordzoeker-maker'];
	expect(paragraphs).toHaveLength(4);
	expect(paragraphs[0]).toBe('Maak een woordzoeker-maker in het Vlaams, voor grootouders die puzzels maken voor hun kleinkinderen.');
});

test('leaves out the follow-ups', () => {
	expect(prompts['Woordzoeker-maker'].paragraphs.join(' ')).not.toContain('Vervolgvragen');
});

test('takes the best tool from the table', () => {
	expect(prompts['Leesclub'].tool).toBe('Lovable (heeft een database nodig)');
});
