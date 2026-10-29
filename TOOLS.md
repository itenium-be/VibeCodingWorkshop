# Tools

Prices and free tiers as of 2026-10; Lovable changed pricing twice in 2026, re-check before each session.

## Build tools

| Tool                            | Free tier                  | Good for                                   | Notes                                              |
|---------------------------------|----------------------------|--------------------------------------------|----------------------------------------------------|
| [Lovable][lovable]              | 5 credits/day, 30/month    | Full web apps with login + database        | Most polished; free tier gone within the hour      |
| [Bolt.new][bolt]                | Daily token cap            | Same niche as Lovable                      | Shows more code/terminal, scarier                  |
| [Base44][base44]                | Limited credits            | Apps with users/data, very guided          | Hides the most tech                                |
| [Google AI Studio – Build][ais] | Generous, effectively free | Quick apps and games                       | Best free fallback when Lovable credits run out    |
| [Gemini Canvas][gemini]         | Free                       | Single-page tools/games inside chat        | Only needs a Google account                        |
| [Claude.ai Artifacts][claude]   | Free (capped); Pro         | Calculators, quizzes, small games, sharing | Simplest mental model: "just chat"                 |
| [ChatGPT Canvas][chatgpt]       | Free (capped)              | Same as Artifacts                          | Many already have an account                       |
| [Replit][replit]                | Limited Agent credits      | Bigger apps, hosting included              | Too much UI for seniors                            |
| [Glide][glide]                  | Free tier                  | Mobile app on top of a Google Sheet        | For "I already track this in Excel" people         |

[lovable]: https://lovable.dev
[bolt]: https://bolt.new
[base44]: https://base44.com
[ais]: https://aistudio.google.com/apps
[gemini]: https://gemini.google.com
[claude]: https://claude.ai
[chatgpt]: https://chatgpt.com
[replit]: https://replit.com
[glide]: https://www.glideapps.com

## Claude Code (adventurous participants)

| Route                         | Needs                      | Friction                     |
|-------------------------------|----------------------------|------------------------------|
| Claude desktop app → Code tab | Pro/Max sub or API credits | Low, no terminal             |
| [claude.ai/code][cc-web]      | Pro/Max subscription       | Lowest, but needs GitHub     |
| CLI                           | Console API credits        | High for non-devs            |

[cc-web]: https://claude.ai/code

Console API credits don't work for the web route. A one-month Pro seat per person is more predictable than sharing an API key.

## Lovable budget (€300 per session)

| Plan     | Price      | Credits                 | Notes                              |
|----------|------------|-------------------------|------------------------------------|
| Free     | €0         | 5/day, max 30/month     | Public projects only               |
| Pro      | ~$25/month | 100/month + 5/day       | Private projects, custom domain    |
| Business | ~$50/month | As Pro                  | SSO/team features, not needed      |

A 2.5h session ≈ 20–40 credits per person (≈1 credit per prompt).

| Setup                                                  | Cost per session | 7 people (Erpe-Mere) |
|--------------------------------------------------------|------------------|----------------------|
| One Pro seat per participant, 1 month                  | ~€23 × N         | ~€160                |
| One workspace of mine, higher Pro tier, invite members | ~€50–100         | Fits                 |
| Everyone Free, fall back to AI Studio / Gemini         | €0               | Fits, frustrating    |

To verify on [lovable.dev/pricing](https://lovable.dev/pricing): whether Pro credits are shared across workspace members (the shared-workspace setup depends on it).

## Taking the app home

| Need          | How                                                                                                   |
|---------------|-------------------------------------------------------------------------------------------------------|
| Live link     | **Publish** → `name.lovable.app`; works on Free, stays up                                             |
| Ownership     | Participant needs their own Lovable account; projects in my workspace must be remixed/transferred     |
| Code          | Settings → GitHub sync to their own GitHub; reportedly on Free                                        |
| Other hosting | Import the GitHub repo in Vercel/Netlify; re-enter Lovable Cloud secrets as env vars                  |

For non-devs the take-home is the `lovable.app` link plus their own free Lovable account. GitHub/Vercel only for the adventurous. Apps using Lovable Cloud (database/login) stay dependent on Lovable.

Sources: [eesel.ai](https://eesel.ai/blog/lovable-pricing), [costbench](https://costbench.com/software/ai-coding-assistants/lovable/free-plan/), [banani](https://www.banani.co/blog/lovable-pricing-and-credits), [Vercel docs](https://vercel.com/docs/integrations/lovable), [vibefactory](https://vibefactory.ai/export-lovable-project), [RapidDev](https://www.rapidevelopers.com/md/lovable-issues/exporting-lovable-projects-for-manual-deployment).

## Logistics

- Participants create accounts beforehand, Google sign-in; signup + email verification eats the first 30 min.
- Free credits don't last a session: buy Pro seats or plan the switch to AI Studio / Gemini.
- Pair up: one types, one dictates. Voice input (mic button in ChatGPT/Gemini/Claude) helps slow typers.
- Dutch prompts work in all tools above; the generated app will be in Dutch.
- Ask the venue: wifi capacity, laptops (bring own vs library PCs), projector.

## Open decisions

- Main tool: Lovable vs free-only (AI Studio / Gemini / Claude Artifacts).
- Lovable billing: Pro seat per participant vs one shared workspace.
- Claude Code for the adventurous: yes/no, and Pro seats vs API credits.
