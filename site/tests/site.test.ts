import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = '/VibeCodingWorkshop/';
const DIST = join(import.meta.dir, '..', 'dist');
// produced by later CI steps, so absent from a local site build
const BUILT_ELSEWHERE = [`${BASE}handout.pdf`, `${BASE}slides/`];

const PAGES = ['wat-is-vibe-coding', 'zelf-gemaakt', 'bezin', 'slim-beginnen', 'vastgelopen', 'aan-de-slag'];

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
});

describe('pager', () => {
	test('first page goes back to the intro', () => {
		expect(hrefs(pager(html(PAGES[0])))).toEqual([BASE, `${BASE}${PAGES[1]}/`]);
	});

	test('middle pages link their neighbours', () => {
		expect(hrefs(pager(html(PAGES[2])))).toEqual([`${BASE}${PAGES[1]}/`, `${BASE}${PAGES[3]}/`]);
	});

	test('last page ends on the handout', () => {
		expect(hrefs(pager(html(PAGES.at(-1)!)))).toEqual([`${BASE}${PAGES.at(-2)}/`, `${BASE}handout.pdf`]);
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
			.filter(h => h.startsWith(BASE) && !BUILT_ELSEWHERE.includes(h))
			.filter(h => !existsSync(join(DIST, h.slice(BASE.length), h.endsWith('/') ? 'index.html' : '')))
			.map(h => `${slug || 'intro'} → ${h}`));
	expect(broken).toEqual([]);
});

test.each(['', ...PAGES])('%s has no double-escaped entities', slug => {
	expect(html(slug)).not.toContain('&amp;amp;');
});
