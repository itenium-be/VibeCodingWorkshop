---
theme: ./theme
title: Vibe coding
lang: nl
routerMode: hash
siteUrl: https://dev.itenium.be/VibeCodingWorkshop/
layout: cover
---

<span class="kicker">Bibliotheek Lede · 12 november</span>

# Vibe coding

Jij beschrijft, de AI bouwt.

<Stamp v-click>zelf gemaakt</Stamp>

---
class: big-cards
---

# Wat is vibe coding?

<div class="grid-3" style="margin-top: 2rem">
  <Card v-click icon="💬" title="Jij vertelt">wat je wil, in gewone taal. Gewoon in het Nederlands.</Card>
  <Card v-click icon="🤖" title="De AI bouwt">een echte app, in een paar minuten.</Card>
  <Card v-click icon="👀" title="Jij kijkt">en zegt wat beter kan. En nog eens. En nog eens.</Card>
</div>

<div v-click class="ribbon">✨ Programmeren hoef je niet te kunnen.<small>Typen kan je al.</small></div>

---

# Zelf gemaakt

<div class="grid-2">
  <Card v-click icon="🃏" title="Wiezen-scorebord" :prompts="120" :words="2420" time="9 uur" href="https://laoujin.github.io/WiezeScoren/">De punten voor wiezen bijhouden</Card>
  <Card v-click icon="🎁" title="Secret Santa" :prompts="2" :words="225" time="30 min" href="https://secret-santa.sangu.be/">Lootjes trekken, met een geheime link per persoon</Card>
  <Card v-click icon="💌" title="Uitnodigingen" :prompts="50" :words="876" time="4 uur" href="https://breibeest.github.io/guido-70/31-7/">Een website voor va zijn verjaardag, met QR-code</Card>
  <Card v-click icon="📄" title="PDF Workbench" :prompts="10" :words="455" time="1 uur" href="https://dev.itenium.be/PdfMerge/">PDF's samenvoegen, splitsen, pagina's herschikken</Card>
</div>

---

# En jij?

<div class="grid-3">
  <Card v-click icon="🔤" title="Woordzoeker-maker">Puzzels voor de (klein)kinderen, met hun eigen woorden</Card>
  <Card v-click icon="🧠" title="Familiequiz">Wie kent oma het best?</Card>
  <Card v-click icon="🍸" title="Cocktails" href="https://sangu.be/Sanguine-Spirits/">Je favoriete cocktailrecepten</Card>
  <Card v-click icon="⏳" title="Aftellen">Nog hoeveel nachtjes tot de vakantie?</Card>
  <Card v-click icon="📚" title="Leesclub">Wat lezen we, wanneer komen we samen, wie brengt koffie?</Card>
  <Card v-click icon="🧳" title="Reisdagboek">Foto's en verhaaltjes van je reis, per dag</Card>
</div>

---

# Ideeën vinden

<div class="grid-2" style="margin-top: 1.5rem">
  <Card v-click icon="😤" title="Ergernissenlijst">Wat doe je nu op papier, in Excel, of vergeet je steeds?</Card>
  <Card v-click icon="🫶" title="Voor één persoon">Voor je (klein)kind, je club, je tuin of gewoon jezelf.</Card>
  <Card v-click icon="🤖" title="Vraag het de AI">"Ik hou van tuinieren en kaarten. Geef me 10 ideeën voor een app."</Card>
  <Card v-click icon="🔁" title="Maak het simpeler">Een app die je al gebruikt, maar dan zoals jij het wil.</Card>
</div>


---
class: rules
---

# Bezin voor je begint

<div class="grid-3">
  <div class="col">
    <Card v-click icon="🔐" title="Geheimen">Wachtwoorden, pincodes, bankgegevens</Card>
    <div v-click class="rule"><Squiggle /><div class="note stop">Deel nooit geheimen met de AI</div></div>
  </div>
  <div class="col">
    <Card v-click icon="💳" title="Betalingen">Geld ontvangen of betalen via je app</Card>
    <div v-click class="rule"><Squiggle flip /><div class="note stop">Dit gaan we niet doen</div></div>
  </div>
  <div class="col">
    <Card v-click icon="🙈" title="Gegevens van anderen">Adressen, telefoonnummers</Card>
    <div v-click class="rule"><Squiggle /><div class="note ask">Niet zonder inloggen: vraag de lesgever</div></div>
  </div>
</div>

---

# Bezin voor je begint

<div class="chat">
  <div v-click class="chat-row"><span class="chat-who">🙋</span><div class="bubble ask">Kan iedereen mijn app zien?</div></div>
  <div v-click class="chat-row right"><div class="bubble">Ja: iedereen met de link kan je app openen 🔗</div><span class="chat-who">🤖</span></div>
</div>

<div class="postits">
  <div v-click class="postit"><b>💻 Tenzij…</b>het alleen op je eigen computer draait</div>
  <div v-click class="postit"><b>🔒 Tenzij…</b>je er een aanmeldscherm op zet</div>
</div>

---

# Slim beginnen

<div class="grid-2" style="margin-top: 1.5rem; gap: 1.4rem">
  <Card v-click icon="💬" :step="1" title="Brainstormen">Bespreek je idee met ChatGPT: "Stel me vragen tot mijn idee duidelijk is."</Card>
  <Card v-click icon="✍️" :step="2" title="Laat je bericht schrijven">"Schrijf nu één bericht dat ik in Lovable kan plakken."</Card>
  <Card v-click icon="🎨" :step="3" title="Vraag ontwerpen" hint="combineer de beste delen">In Lovable: "Maak 3 verschillende ontwerpen, dan kies ik er één."</Card>
  <Card v-click icon="🖼️" title="Tekeningen nodig?" hint="veel tekeningen nodig? Vraag de lesgever">Vraag het Lovable: "Zet een tekening van een vrolijke cactus bovenaan."</Card>
</div>

---
class: big-cards
---

# Vastgelopen?

<div class="grid-3" style="margin-top: 2rem">
  <Card v-click icon="📸" title="Plak een screenshot">Windows + Shift + S, daarna Ctrl + V in de chat</Card>
  <Card v-click icon="🗣️" title="Zeg wat je ziet">"Als ik op Opslaan klik, gebeurt er niets"</Card>
  <Card v-click icon="⏪" title="Ga terug">Klik bij een eerder bericht op Restore</Card>
</div>

<div v-click class="ribbon">🙋 En anders: steek je hand op!</div>

---

# Aan de slag!

<svg class="road" viewBox="0 0 980 416">
  <g v-click="2" class="road-seg">
    <mask id="road-1"><path class="road-draw" pathLength="1" d="M140 250 C 260 60, 380 60, 490 200" /></mask>
    <path class="road-dots" mask="url(#road-1)" d="M140 250 C 260 60, 380 60, 490 200" />
  </g>
  <g v-click="3" class="road-seg">
    <mask id="road-2"><path class="road-draw" pathLength="1" d="M490 200 C 600 340, 720 360, 840 160" /></mask>
    <path class="road-dots" mask="url(#road-2)" d="M490 200 C 600 340, 720 360, 840 160" />
  </g>
</svg>

<div v-click="1" class="station station-hinted" style="left: 2.5rem; top: 15rem; background: var(--z-sky)">
  <span class="station-tag">Beginnen</span>
  <div class="station-icon">🔑</div>
  <h3>Inloggen</h3>
  <span class="pill">lovable.dev</span>
  <span class="card-hint">💡 Hint: Google-adres nog niet doorgegeven? Geef het aan de lesgever.</span>
</div>

<div v-click="2" class="station after-road" style="left: 23.4rem; top: 8.4rem; background: var(--z-mint)">
  <span class="station-tag">Bouwen</span>
  <div class="station-icon">🛠️</div>
  <h3>Zoals besproken</h3>
  <p>Brainstormen → 1 bericht</p>
  <p>3 ontwerpen</p>
  <p>1 wijziging per keer</p>
</div>

<div v-click="3" class="station after-road" style="right: 2.5rem; top: 15rem; background: var(--z-pink)">
  <span class="station-tag">Mee naar huis</span>
  <div class="station-icon">🏠</div>
  <h3>Publish &amp; delen</h3>
  <div class="publish-flow">
    <LovableButton icon="globe">Publish</LovableButton>
    <Squiggle />
    <span class="pill">jouwnaam.lovable.app</span>
  </div>
</div>

---
layout: center
---

# Alles nog eens nalezen?

<QrCode />
