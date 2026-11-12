export interface Page {
	slug: string;
	title: string;
	icon: string;
}

export const SPARKLE = 'sparkle';

export const GROUPS: { label: string; pages: Page[] }[] = [
	{
		label: '✨ Wat',
		pages: [
			{ slug: 'wat-is-vibe-coding', title: 'Wat is vibe coding?', icon: '💬' },
			{ slug: 'zelf-gemaakt', title: 'Zelf gemaakt', icon: SPARKLE },
		],
	},
	{
		label: '🔐 Veilig',
		pages: [{ slug: 'bezin', title: 'Bezin voor je begint', icon: '🔐' }],
	},
	{
		label: '🛠️ Zelf doen',
		pages: [
			{ slug: 'slim-beginnen', title: 'Slim beginnen', icon: '✍️' },
			{ slug: 'vastgelopen', title: 'Vastgelopen?', icon: '🧯' },
			{ slug: 'aan-de-slag', title: 'Aan de slag!', icon: '🚀' },
		],
	},
	{
		label: '🎒 Meenemen',
		pages: [
			{ slug: 'github-account', title: 'GitHub-account', icon: '🐙' },
			{ slug: 'lovable-koppelen', title: 'Lovable koppelen', icon: '🔗' },
			{ slug: 'github-pages', title: 'Online zetten', icon: '🌍' },
		],
	},
];

export const PAGES = GROUPS.flatMap(g => g.pages);

export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}${path}`;
export const pageUrl = (p: Page) => url(`${p.slug}/`);
