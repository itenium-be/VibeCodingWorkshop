# Participant guide site

Dutch reference site for workshop participants, linked from the deck/handout QR code.

URL: <https://dev.itenium.be/VibeCodingWorkshop/>

## Stack

- `site/`: Astro + Starlight, bun.
- Single `root` locale, `lang: nl`: Starlight UI strings in Dutch.
- Deploy: GitHub Actions → Pages on push to `main` touching `site/**`.
- Checks: `bun run check` = `astro check` + `astro build` with `starlight-links-validator`; zero warnings.

## Theme: "Zonnig", light-only

Source of truth: `slides/theme/styles/zonnig.css` (branch `slides-deck`).

| Token    | Value                                                          |
|----------|----------------------------------------------------------------|
| ink      | `#2b2140` text, borders, shadows; ink-soft `#5d5470`           |
| paper    | `#fff6e5` page background                                      |
| sun      | `#ffd56b` hero                                                 |
| rose     | `#ff7a8a` accent                                               |
| pastels  | mint `#bdeccb`, pink `#ffd1e0`, butter `#ffe7a8`, sky `#c9ddff`, peach `#ffc9b8`, lilac `#e2d4ff`; cycle over cards |
| fonts    | headings Baloo 2 800, body Nunito 400/700 (Google Fonts)       |
| shape    | 3px ink border, 20px radius, `6px 6px 0` ink shadow, no blur   |

- Dark mode disabled: `ThemeProvider` forces light, `ThemeSelect` renders nothing.
- Splash hero: ink pill kicker, rose blob with ✨.
- Emoji as card icons.
- "ZELF GEMAAKT" stamp on the take-home page.

## Pages

| Page                  | Content                                                                         |
|-----------------------|---------------------------------------------------------------------------------|
| Home (splash)         | Hero + 4 link cards                                                             |
| Aan de slag           | Steps: Lovable account, credits, recipe (wie/wat/hoe), first prompt             |
| Ideeën                | Idea sparkers + card grid of example apps with copy-paste prompts               |
| Vastgelopen?          | Describe, screenshot, "Try to fix", restore, small steps, out of credits        |
| Je app mee naar huis  | Publish link, own account, single HTML file → GitHub Pages, ask the instructor  |

## Out of scope

Screenshots (added later), sessions list/contact, instructor runbooks and scripts.
