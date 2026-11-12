# App prompts

One-shot prompts for the ideas on the "En jij?" slide that have no `href` yet, plus the remaining demo seeds from `IDEAS.md`. UI in Flemish Dutch, prompt in English (same as the Secret Santa prompt).

| App                 | Data                       | Best tool                     |
|---------------------|----------------------------|-------------------------------|
| Woordzoeker-maker   | none                       | Claude or Lovable             |
| Familiequiz         | in the browser             | Claude or Lovable             |
| Aftellen            | in the link                | Claude or Lovable             |
| Leesclub            | shared, multi-user         | Lovable (needs a database)    |
| Reisdagboek         | shared, photos             | Lovable (database + storage)  |
| Planten water geven | in the browser             | Claude or Lovable             |
| Receptenboek        | shared, photos             | Lovable (database + storage)  |
| Bingokaarten        | none                       | Claude or Lovable             |

"In the browser" means `localStorage`: survives a reload, but not another device. In Claude, "save in the browser" may be ignored in artifacts; Lovable handles it.

Follow-ups go one per message, as in the slides.

## 🔤 Woordzoeker-maker

> Make a word search puzzle maker in Flemish Dutch, for grandparents making puzzles for their grandchildren.
>
> On the left, a simple form: a title (e.g. "Lotte's dierenpuzzel"), a list of words (one per line, 5 to 20 words), a grid size (small 10×10, medium 12×12, large 15×15) and a difficulty: "Makkelijk" (words only left-to-right and top-to-bottom), "Gemiddeld" (also diagonal) and "Moeilijk" (also backwards). Accept accented letters but place them without accents, in capitals. Warn kindly if a word is too long for the grid.
>
> On the right, a live preview of the puzzle: the title, the letter grid in a clear rounded font with even spacing, and the word list underneath in two columns. A "Nieuwe puzzel" button reshuffles the same words. A "Toon oplossing" toggle highlights each word with a soft coloured marker band. A "Afdrukken" button prints only the puzzle on one A4 page (no form, no buttons), with an option to print the solution on a second page.
>
> Pre-fill an example with 10 animal words so the page is never empty. Playful but tidy look: cream background, one cheerful accent colour, large touch-friendly buttons, works on a tablet.

Follow-ups: a theme picture above the puzzle · a "Kies een thema" button with ready word lists (dieren, fruit, beroepen) · a timer for playing on screen.

## 🧠 Familiequiz

> Make a quiz app in Flemish Dutch for a family party, called "Wie kent oma het best?". It is played on one laptop connected to a TV, so everything must be readable from across the room.
>
> There are two parts. In "Quiz maken", I add questions: the question text, 4 answers, which one is right, and optionally a photo. I can reorder, edit and delete questions. Save everything in the browser so it survives a reload.
>
> In "Spelen", I first enter the players or teams (2 to 6 names, each gets its own colour). Then each question appears full screen, big and centred, with the 4 answers as large coloured tiles labelled A, B, C, D. For each team I tap which answer they chose; then "Toon antwoord" reveals the right one with a short celebration animation, and the scores update. Between questions, a small scoreboard bar. At the end, a podium with first, second and third place, confetti, and a "Opnieuw spelen" button.
>
> Start with 5 example questions about a fictional oma (favourite flower, birth town, first job, …) so I can try it immediately. Festive look: warm colours, rounded shapes, big friendly typography, no clutter.

Follow-ups: a 20-second countdown per question · a sound when the answer is revealed · export and import the questions as a file so another family member can play them.

## ⏳ Aftellen

> Make a countdown app in Flemish Dutch, called "Nog hoeveel nachtjes?", for children waiting for something fun.
>
> I enter what we are counting down to (e.g. "Vakantie naar Italië"), the date, and pick an emoji or one of 8 themes (zee, bergen, Sinterklaas, Kerstmis, verjaardag, Pasen, kamp, logeren). The main screen then shows, very large, the number of nights to go ("Nog 12 nachtjes slapen!"), and smaller underneath the days, hours, minutes and seconds ticking down. Below that, a row of little moons, one per night left, that fade one by one; if there are more than 60, show a progress bar instead.
>
> I can keep several countdowns; they appear as cards on a home screen, soonest first. When the day arrives, the screen celebrates with confetti and "Het is zover!". Each countdown has a "Deel" button that copies a link containing the title, date and theme, so the grandparents open exactly the same countdown on their own phone without an account.
>
> Look: a full-screen illustrated background matching the theme, soft gradients, a big rounded playful font, works well on a phone held upright.

Follow-ups: a "Wat gaan we doen?" checklist per countdown · a daily surprise fact revealed each morning · show it as a big clock for a TV in the living room.

## 📚 Leesclub

> Make an app in Flemish Dutch for our book club of about 10 people, "Leesclub De Bladwijzer". Members log in with their email (magic link, no password).
>
> The home page shows the next meeting prominently: date, time, address, the book (title, author, cover image), and who is hosting. Underneath, buttons to say "Ik kom", "Ik kom niet" or "Misschien", and a short list of who is coming. Each meeting has a "Wie brengt wat?" list (koffie, taart, koekjes, …) where members tick what they bring, so nothing is brought twice.
>
> A "Boekenkast" page lists all books we have read, newest first, with the cover, the meeting date, and each member's score out of 5 stars plus a one-line opinion; show the average score. A "Voorstellen" page lets members suggest books for later and vote on them with a thumbs up; the most popular suggestions rise to the top.
>
> One member is the organiser: only they can create and edit meetings and mark a suggestion as "volgende boek". Everyone else can only manage their own attendance, contributions, scores and suggestions.
>
> Fill in two past meetings and one upcoming one with real well-known books, so it never looks empty. Calm, bookish look: off-white paper background, a serif heading font, deep green accent, plenty of whitespace, comfortable on a phone.

Follow-ups: a reminder email two days before the meeting · discussion questions per book · an "add to calendar" button.

## 🧳 Reisdagboek

> Make a travel diary app in Flemish Dutch where I keep a day-by-day story of a trip and share it with family. I log in with my email (magic link, no password); visitors don't need to log in.
>
> I create a trip with a title, a country or region, start and end date, and a cover photo. The app automatically creates one page per day. Per day I can add a short title, a story (a few paragraphs, simple formatting), up to 10 photos, the place where we were, and a mood emoji. Photos are shrunk on upload so they load quickly.
>
> The trip page shows the cover photo large with the title, then a vertical timeline of the days: each day a card with its first photo, date, title and the first lines of the story. Clicking a day opens it with the full story and a photo gallery that opens photos full screen and lets you swipe through them. A small map at the top shows a pin for each day's place, connected by a dotted line in date order.
>
> Every trip has a "Deel" button that copies a read-only link for the family; visitors can leave a short reaction with their name under each day. Only I can add or edit content.
>
> Fill in an example trip of 4 days through Tuscany with placeholder photos, so the design is visible straight away. Look: like a nice paper scrapbook, warm cream background, photos with a slight white border and gentle rotation, a handwritten-style font for day titles and a clean readable font for the stories.

Follow-ups: download the whole trip as a PDF photo book · a "vandaag" quick-add button on the phone · several trips on a home page.

## 🌱 Planten water geven

> Make a plant watering app in Flemish Dutch, for someone with about 15 house plants who keeps forgetting which one needs water.
>
> Per plant: a name, an optional photo, the room it stands in, and every how many days it needs water. The home screen has three groups: "Vandaag water geven" at the top (highlighted), "Te laat" (in a soft warning colour, with how many days late), and "Binnenkort" with the days remaining. Each plant card has a big "Water gegeven 💧" button that resets its timer with a small splash animation; an undo appears for a few seconds.
>
> A second tab lists all plants grouped by room, where I can add, edit or delete plants. A small history per plant shows the last 10 times it got water. Save everything in the browser.
>
> Start with 6 common house plants (monstera, cactus, pothos, …) with realistic watering intervals, some due today. Calm green look, rounded cards, large text and buttons, works well on a phone.

Follow-ups: fertiliser reminders on a separate schedule · "op vakantie" mode that shows what to tell the neighbour · a weekly overview calendar.

## 🍲 Receptenboek

> Make a family recipe book in Flemish Dutch, to collect oma's recipes and share them with the whole family. Family members log in with their email (magic link, no password).
>
> Per recipe: a name, a photo, a category (soep, hoofdgerecht, dessert, gebak, …), the number of people, preparation time, ingredients (one per line) and the steps (numbered). Optionally: who the recipe comes from ("van oma Jeanne") and a short story or memory.
>
> The home page shows recipe cards with the photo, name and time, with a search box that searches names and ingredients, and category filters. A recipe page shows the photo large, the ingredients on the left with tick boxes for shopping or cooking, and the steps on the right in large text. A "Porties" control recalculates the ingredient amounts. A "Kookmodus" button shows one step at a time in huge text and keeps the screen awake. "Afdrukken" prints the recipe neatly on one page.
>
> Every family member can add recipes and mark recipes as favourites; only the author can edit their own recipe.
>
> Fill in 6 classic Flemish recipes (stoofvlees, vol-au-vent, rijstpap, wafels, …) with placeholder photos. Warm, old-fashioned kitchen look: cream and terracotta, a serif font for headings, like a well-used family cookbook.

Follow-ups: a shopping list combining several recipes · upload a photo of a handwritten recipe card next to the typed version.

## 🎱 Bingokaarten

> Make a bingo card generator in Flemish Dutch for a party or a class.
>
> I choose between "Getallen" (classic 1–75) and "Woorden" (I enter at least 24 words or short phrases, one per line, e.g. names of family members or things that will surely happen at the party). I choose a grid of 3×3, 4×4 or 5×5, whether the centre square is a free "★" square, a title for the card, and how many different cards to make (1 to 40).
>
> The app shows a preview of the cards and makes sure no two cards are the same. "Afdrukken" prints them two per A4 page, with crisp lines, the title on top and nothing else on the page. There is also a "Spelleider" screen for the host: a big button "Volgende" draws a random number or word, shows it huge on screen, and keeps a list of everything already drawn, so it can be shown on a TV.
>
> Start with an example word list for a family Christmas party. Cheerful look: bright but not childish colours, a clear bold font, large buttons.

Follow-ups: let players tick squares on their phone and shout "Bingo!" automatically · a theme picture in the free square.
