import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = '/VibeCodingWorkshop/';
const DIST = join(import.meta.dir, '..', 'dist');
// produced by later CI steps, so absent from a local site build
const BUILT_ELSEWHERE = [`${BASE}handout.pdf`, `${BASE}slides/`];
const APPS_BUILT_ELSEWHERE = [`${BASE}aftellen/`, `${BASE}familiequiz/`, `${BASE}bingokaarten/`, `${BASE}planten-water-geven/`, `${BASE}leesclub/`, `${BASE}reisdagboek/`];

const PAGES = ['wat-is-vibe-coding', 'zelf-gemaakt', 'bezin', 'slim-beginnen', 'vastgelopen', 'aan-de-slag', 'github-account', 'lovable-koppelen', 'lesgever-toegang'];

const html = (slug: string) => readFileSync(join(DIST, slug, 'index.html'), 'utf8');
const hrefs = (page: string) => [...page.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
const nav = (page: string) => page.match(/<aside[\s\S]*?<\/aside>/)![0];
const pager = (page: string) => page.match(/<nav class="pager"[\s\S]*?<\/nav>/)?.[0] ?? '';

describe('pages', () => {
	test.each(['', ...PAGES])('%s is built', slug => {
		expect(existsSync(join(DIST, slug, 'index.html'))).toBe(true);
	});

	test('404 is built', () => {
		expect(existsSync(join(DIST, '404.html'))).toBe(true);
	});

	test('woordzoeker app is built', () => {
		expect(html('woordzoeker')).toContain('<title>Woordzoeker-maker</title>');
	});
});

describe('sidebar', () => {
	test('lists every page in order', () => {
		const links = hrefs(nav(html(''))).filter(h => PAGES.some(p => h === `${BASE}${p}/`));
		expect(links).toEqual(PAGES.map(p => `${BASE}${p}/`));
	});

	test.each(PAGES)('marks %s as current', slug => {
		expect(nav(html(slug))).toMatch(new RegExp(`href="${BASE}${slug}/"[^>]*aria-current="page"`));
	});

	test('links the handout and the slides', () => {
		expect(hrefs(nav(html('')))).toEqual(expect.arrayContaining(BUILT_ELSEWHERE));
	});

	test.each(BUILT_ELSEWHERE)('opens %s in a new tab', href => {
		expect(nav(html(''))).toMatch(new RegExp(`href="${href}"[^>]*target="_blank"`));
	});
});

describe('pager', () => {
	test('first page goes back to the intro', () => {
		expect(hrefs(pager(html(PAGES[0])))).toEqual([BASE, `${BASE}${PAGES[1]}/`]);
	});

	test('middle pages link their neighbours', () => {
		expect(hrefs(pager(html(PAGES[2])))).toEqual([`${BASE}${PAGES[1]}/`, `${BASE}${PAGES[3]}/`]);
	});

	test('last page only links back', () => {
		expect(hrefs(pager(html(PAGES.at(-1)!)))).toEqual([`${BASE}${PAGES.at(-2)}/`]);
	});

	test('intro has no pager', () => {
		expect(pager(html(''))).toBe('');
	});
});

test.each(['', 'aan-de-slag'])('%s opens lovable.dev in a new tab', slug => {
	expect(html(slug)).toMatch(/<a[^>]*href="https:\/\/lovable\.dev"[^>]*target="_blank"/);
});

test('internal links resolve', () => {
	const broken = ['', ...PAGES].flatMap(slug =>
		hrefs(html(slug))
			.filter(h => h.startsWith(BASE) && ![...BUILT_ELSEWHERE, ...APPS_BUILT_ELSEWHERE].includes(h))
			.filter(h => !existsSync(join(DIST, h.slice(BASE.length), h.endsWith('/') ? 'index.html' : '')))
			.map(h => `${slug || 'intro'} → ${h}`));
	expect(broken).toEqual([]);
});

test.each(['', ...PAGES])('%s has no double-escaped entities', slug => {
	expect(html(slug)).not.toContain('&amp;amp;');
});

describe('zelf gemaakt', () => {
	const page = () => html('zelf-gemaakt');
	const visits = () => [...page().matchAll(/<a class="visit"[^>]*>/g)].map(m => m[0]);

	test('every website gets a "Nu bezoeken" button opening in a new tab', () => {
		expect(visits()).toHaveLength(5);
		for (const a of visits()) expect(a).toContain('target="_blank"');
	});

	test('shows how this workshop itself was made', () => {
		expect(page()).toContain('En dit?');
		expect(page()).toMatch(/<strong>128<\/strong>prompts/);
	});

	test('icons are no longer links', () => {
		expect(page()).not.toMatch(/<a class="card-icon"/);
	});

	test.each(['Woordzoeker-maker', 'Familiequiz', 'Cocktails', 'Aftellen', 'Leesclub', 'Reisdagboek'])('shows the idea %s', idea => {
		expect(page()).toContain(idea);
	});
});

describe('one-shot prompts', () => {
	const page = () => html('zelf-gemaakt');
	const popover = (id: string) => page().match(new RegExp(`<dialog[^>]*id="${id}"[\\s\\S]*?</dialog>`))?.[0] ?? '';
	const targets = () => [...page().matchAll(/class="oneshot"[^>]*popovertarget="([^"]+)"/g)].map(m => m[1]);

	test.each(['Woordzoeker-maker', 'Familiequiz', 'Aftellen', 'Leesclub', 'Reisdagboek', 'Planten water geven', 'Bingokaarten'])('%s has a one-shot prompt button', idea => {
		expect(targets()).toContain(`prompt-${idea.toLowerCase().replace(/[^a-z]+/g, '-')}`);
	});

	test('the button opens a popover holding the prompt', () => {
		const p = popover('prompt-woordzoeker-maker');
		expect(p).toContain('Maak een woordzoeker-maker in het Vlaams');
		expect(p).toContain('1 prompt');
		expect(p).toContain('class="copy"');
	});

	test('shows how long the build took', () => {
		expect(popover('prompt-planten-water-geven')).toContain('⏱️ 4 min');
	});

	test.each(['woordzoeker', 'familiequiz', 'aftellen', 'bingokaarten', 'planten-water-geven', 'leesclub', 'reisdagboek'])('links the %s app in a new tab', app => {
		expect(page()).toMatch(new RegExp(`<a class="open-app" href="${BASE}${app}/" target="_blank"`));
	});
});

describe('meenemen', () => {
	test.each([['github-account', 4], ['lovable-koppelen', 5]] as const)('%s walks through %d steps', (slug, count) => {
		const steps = html(slug).match(/<ol class="steps"[\s\S]*?<\/ol>/)?.[0] ?? '';
		expect(steps.match(/<li/g)).toHaveLength(count);
	});

	test.each(['github-account', 'lovable-koppelen'])('%s has a subtitle under its heading', slug => {
		expect(html(slug)).toMatch(/<\/h2>\s*<p class="subtitle"[^>]*>Blijf eigenaar van je app, ook na de workshop<\/p>/);
	});

	test('github-account opens the GitHub signup in a new tab', () => {
		expect(html('github-account')).toMatch(/<a[^>]*href="https:\/\/github\.com\/signup"[^>]*target="_blank"/);
	});

	test('lesgever-toegang walks through 4 steps and names the instructor', () => {
		const steps = html('lesgever-toegang').match(/<ol class="steps"[\s\S]*?<\/ol>/)?.[0] ?? '';
		expect(steps.match(/<li/g)).toHaveLength(4);
		expect(steps).toContain('Laoujin');
	});

	test('lovable-koppelen points back to the GitHub account page', () => {
		expect(hrefs(html('lovable-koppelen'))).toContain(`${BASE}github-account/`);
	});
});
