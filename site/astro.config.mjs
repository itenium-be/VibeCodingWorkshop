// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

export default defineConfig({
	site: 'https://itenium-be.github.io',
	base: '/VibeCodingWorkshop',
	integrations: [
		starlight({
			title: 'Vibe Coding',
			disable404Route: true,
			defaultLocale: 'root',
			locales: { root: { label: 'Nederlands', lang: 'nl' } },
			expressiveCode: { defaultProps: { wrap: true } },
			plugins: [starlightLinksValidator()],
			customCss: ['./src/styles/zonnig.css'],
			components: {
				ThemeProvider: './src/components/ThemeProvider.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
			},
			head: [
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Nunito:wght@400;700&display=swap',
					},
				},
			],
			sidebar: [
				{ label: 'Aan de slag', slug: 'aan-de-slag' },
				{ label: 'Ideeën', slug: 'ideeen' },
				{ label: 'Vastgelopen?', slug: 'vastgelopen' },
				{ label: 'Je app mee naar huis', slug: 'mee-naar-huis' },
			],
		}),
	],
});
