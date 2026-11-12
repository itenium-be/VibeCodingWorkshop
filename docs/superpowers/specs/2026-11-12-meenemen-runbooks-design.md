# Meenemen runbooks

Step-by-step pages that help participants take their app home after the workshop. The first two pages cover GitHub. The other runbooks get their own specs: own laptop, own account, free hosting, custom domain, GitHub Pages.

## Constraints

- During the workshop, projects live in the instructor's Lovable workspace. Only a workspace owner or admin can add a GitHub connection, so participants first **Remix** their project into their own free workspace.
- Every participant has a personal Lovable workspace from their own Google login.
- Git sync works on Free. It always creates a **new** private repo and syncs both ways.
- UI labels below come from [docs.lovable.dev](https://docs.lovable.dev/integrations/github). The instructor checks them once in the live UI before the session.

## Navigation

- New `GROUPS` entry in `site/src/nav.ts`, `🎒 Meenemen`, after `🛠️ Zelf doen`.
- The pager runs on: `Aan de slag!` → `GitHub-account` → `Lovable koppelen` → `Lesgever toegang geven`.

| Slug               | Title                  | Icon |
|--------------------|------------------------|------|
| `github-account`   | GitHub-account         | 🐙   |
| `lovable-koppelen` | Lovable koppelen       | 🔗   |
| `lesgever-toegang` | Lesgever toegang geven | 🤝   |

## Layout: timeline (mockup B)

- `ol.steps`: a vertical list. Each step has a 3rem sun-coloured number circle and a dotted ink line down to the next step.
- Each step has an `h3` (emoji + title), a short line of instruction, and optionally a click path.
- Click path: a dashed white box holding button look-alikes separated by `→`.
- The page ends with the ribbon `🙋 Vast? Steek je hand op!`.
- Content max width is 46rem.

Components in `site/src/components/`:

| Component      | Props                                     | Renders                                             |
|----------------|-------------------------------------------|-----------------------------------------------------|
| `Steps.astro`  | none (slot)                               | `<ol class="steps">`                                |
| `Step.astro`   | `icon`, `title` (slot = body)             | `<li>` with `h3` + body                             |
| `Clicks.astro` | `path: string[]`, `look?: 'lovable' \| 'github'` | dashed box: one button look-alike per item, `→` between |

- `look: 'lovable'` reuses `.lovable-btn` (black). `look: 'github'` adds `.github-btn` (GitHub green, white text).
- CSS goes in `zonnig.css`.

## Content

### GitHub-account

1. **🌐 Ga naar GitHub**: link to [github.com/signup](https://github.com/signup), opening in a new tab.
2. **✍️ Vul je gegevens in**: title only.
3. **📧 Code uit je mail**: GitHub sends a code to your email; type it in.
4. **✅ Klaar**: log in. You may skip the questions that follow.


### Lovable koppelen

The page opens with a `note ask` at the top: "Eerst nodig: een GitHub-account ✔️", linking to `github-account`.

1. **📦 Neem je project mee naar je eigen account**: open the project. Clicks: `⋯` → `Remix project`. Pick your own name as **Target workspace**, switch **Include project history** on, then `Remix`.
2. **⚙️ Open de GitHub-instellingen**: in the new copy. Clicks: `Project settings` → `Git` → `GitHub` → `Add connection` → `Add account`.
3. **🐙 Geef GitHub toestemming**: a GitHub window opens; choose your account. Clicks (github): `All repositories` → `Install & Authorize`.
4. **🔗 Koppel je project**: Clicks: `Connect`. Lovable creates a private folder on GitHub with all your code.
5. **✅ Controleer**: go to github.com. Your project is there.

### Lesgever toegang geven

Subtitle: "Zodat de lesgever je verder kan helpen". Adds the instructor's GitHub account `Laoujin` as a collaborator on the repo.

1. **🐙 Open je project op GitHub**: github.com → click the project.
2. **⚙️ Ga naar de medewerkers**: Clicks (github): `Settings` → `Collaborators` → `Add people`. GitHub may ask for the password again.
3. **🔎 Zoek de lesgever**: type `Laoujin`, pick it. Clicks (github): `Add Laoujin to this repository`.
4. **✅ Klaar**: the instructor gets an email and can then work on the app.

## Tests (`site/tests/site.test.ts`)

- Add both slugs to `PAGES`. The existing "is built", sidebar order, current marker, pager and internal-link tests then cover them.
- `github-account` links `https://github.com/signup` in a new tab.
- `lovable-koppelen` links back to `github-account/`.
- Each page renders an `ol.steps` with 4 (`github-account`) and 5 (`lovable-koppelen`) `li`.
- `lesgever-toegang` renders 4 `li` and mentions `Laoujin`.
- `github-account` and `lovable-koppelen` carry the subtitle "Blijf eigenaar van je app, ook na de workshop".

## Out of scope

Screenshots, and the other runbooks.
