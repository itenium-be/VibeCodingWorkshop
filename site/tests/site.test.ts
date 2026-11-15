import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = '/VibeCodingWorkshop/';
const DIST = join(import.meta.dir, '..', 'dist');
// produced by later CI steps, so absent from a local site build
const BUILT_ELSEWHERE = [`${BASE}handout.pdf`, `${BASE}slides/`];
const APPS_BUILT_ELSEWHERE = [`${BASE}aftellen/`, `${BASE}familiequiz/`, `${BASE}bingokaarten/`, `${BASE}planten-water-geven/`, `${BASE}leesclub/`, `${BASE}reisdagboek/`];

const PAGES = ['wat-is-vibe-coding', 'zelf-gemaakt', 'bezin', 'lovable-account', 'aan-de-slag', 'vastgelopen', 'mijn-workspace', 'github-account', 'lovable-koppelen', 'lesgever-toegang'];

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

	const group = (label: string) => hrefs(nav(html('')).match(new RegExp(`<div class="grp">${label}<\\/div>[\\s\\S]*?(?=<div class="grp">|<\\/nav>)`))?.[0] ?? '');

	test('ends Wat with Bezin', () => {
		expect(group('✨ Wat').at(-1)).toBe(`${BASE}bezin/`);
	});

	test('puts the account, Aan de slag and Vastgelopen under one Zelf doen', () => {
		expect(group('🛠️ Zelf doen')).toEqual(['lovable-account', 'aan-de-slag', 'vastgelopen'].map(p => `${BASE}${p}/`));
		expect(nav(html(''))).not.toContain('Beginnen');
	});

	test('groups the GitHub runbooks under Geavanceerd', () => {
		const grp = nav(html('')).match(/<div class="grp">🧰 Geavanceerd<\/div>[\s\S]*?(?=<div class="grp">|<\/nav>)/)?.[0] ?? '';
		expect(hrefs(grp)).toEqual(['github-account', 'lovable-koppelen', 'lesgever-toegang'].map(p => `${BASE}${p}/`));
	});

	test('no longer builds Slim beginnen', () => {
		expect(existsSync(join(DIST, 'slim-beginnen'))).toBe(false);
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

test('bezin only covers what does not belong in your app', () => {
	expect(html('bezin')).not.toContain('Wie kan je app zien?');
});

describe('lovable-account', () => {
	const page = () => html('lovable-account');
	const slides = () => [...page().matchAll(/<section class="slide[^"]*"[\s\S]*?<\/section>/g)].map(m => m[0]);

	test('shows one screenshot per slide', () => {
		expect(slides()).toHaveLength(12);
		for (const s of slides()) expect(s.match(/<img /g)).toHaveLength(1);
	});

	test('walks through 6 steps', () => {
		expect(new Set(slides().map(s => s.match(/class="n">(\d+)</)![1]))).toEqual(new Set(['1', '2', '3', '4', '5', '6']));
	});

	test('only the first slide is shown at start', () => {
		expect(slides().map(s => s.startsWith('<section class="slide on"'))).toEqual([true, ...Array(11).fill(false)]);
	});

	test('marks where to click', () => {
		expect(slides().every(s => s.includes('class="ring"'))).toBe(true);
	});

	test('pages back and forth', () => {
		expect(page()).toMatch(/aria-label="Vorige"[^>]*>← <span class="slide-word">Vorige<\/span>/);
		expect(page()).toMatch(/aria-label="Volgende"[^>]*><span class="slide-word">Volgende<\/span> →/);
	});

	test('screenshots are built', () => {
		const srcs = [...page().matchAll(/<img [^>]*src="([^"]+)"/g)].map(m => m[1]);
		expect(srcs.filter(s => !existsSync(join(DIST, s.slice(BASE.length))))).toEqual([]);
	});

	test('aan-de-slag links to it from the login card', () => {
		expect(hrefs(html('aan-de-slag'))).toContain(`${BASE}lovable-account/`);
	});
});

describe('vastgelopen', () => {
	const page = () => html('vastgelopen');

	test('undoes with the arrow under the previous message', () => {
		expect(page()).toContain('Ongedaan maken');
	});

	test('no longer mentions Restore', () => {
		expect(page()).not.toContain('Restore');
	});

	test('no longer mentions Try to fix', () => {
		expect(page()).not.toContain('Try to fix');
	});
});

describe('aan de slag', () => {
	test.each(['Chat', 'Build', 'Plan'])('shows the %s mode', mode => {
		expect(html('aan-de-slag')).toMatch(new RegExp(`<b>[^<]*${mode}</b>`));
	});

	test('takes the app home with Remix and Publish', () => {
		expect(html('aan-de-slag')).toMatch(/Remix[\s\S]*Publish/);
	});

	test('shows how to send a prompt in the Lovable box', () => {
		expect(html('aan-de-slag')).toMatch(/class="lovable-box"[\s\S]*Typ je idee[\s\S]*Kies[\s\S]*Verstuur/);
	});

	test('points first-timers to account activation in a hint box', () => {
		expect(html('aan-de-slag')).toMatch(/<span class="card-hint">[^<]*Eerste keer\? <a href="[^"]*lovable-account\/">Account activeren<\/a><\/span>/);
	});

	test.each(['Toon de route op een kaart', 'Voeg een vraag toe bij de kerk', 'Geef een ster bij een goed antwoord'])('loops one change per message: %s', message => {
		expect(html('aan-de-slag')).toMatch(new RegExp(`class="change-loop"[\\s\\S]*${message}`));
	});

	test('sends the Remix to Mijn workspace', () => {
		const main = html('aan-de-slag').match(/<main[\s\S]*?<\/main>/)![0].replace(pager(html('aan-de-slag')), '');
		expect(hrefs(main)).toContain(`${BASE}mijn-workspace/`);
	});
});

describe('meenemen', () => {
	test.each([['github-account', 4], ['lovable-koppelen', 4]] as const)('%s walks through %d steps', (slug, count) => {
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

	test.each(['mijn-workspace', 'github-account'])('lovable-koppelen points back to %s', slug => {
		expect(hrefs(html('lovable-koppelen'))).toContain(`${BASE}${slug}/`);
	});

	test('lovable-koppelen leaves the Remix to Mijn workspace', () => {
		expect(html('lovable-koppelen')).not.toContain('Remix project');
	});

	test('mijn-workspace shows 5 screenshots over 3 steps', () => {
		const slides = [...html('mijn-workspace').matchAll(/<section class="slide[^"]*"[\s\S]*?<\/section>/g)].map(m => m[0]);
		expect(slides).toHaveLength(5);
		expect(new Set(slides.map(s => s.match(/class="n">(\d+)</)![1]))).toEqual(new Set(['1', '2', '3']));
		expect(slides.every(s => s.includes('class="ring"'))).toBe(true);
	});

	test('mijn-workspace remixes into your own workspace via Settings', () => {
		const page = html('mijn-workspace');
		expect(page).toMatch(/Settings[\s\S]*Remix project[\s\S]*Target workspace/);
	});
});
