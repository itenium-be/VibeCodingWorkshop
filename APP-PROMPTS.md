# App-prompts

Eenmalige prompts voor de ideeën op de "En jij?"-slide die nog geen `href` hebben, plus de overige demo-ideeën uit `IDEAS.md`. Alles in het Vlaams: zowel de prompt als de app.

| App                 | Gegevens                     | Beste tool                         |
|---------------------|------------------------------|------------------------------------|
| Woordzoeker-maker   | geen                         | Claude of Lovable                  |
| Familiequiz         | in de browser                | Claude of Lovable                  |
| Aftellen            | in de link                   | Claude of Lovable                  |
| Leesclub            | gedeeld, meerdere gebruikers | Lovable (heeft een database nodig) |
| Reisdagboek         | gedeeld, foto's              | Lovable (database + opslag)        |
| Planten water geven | in de browser                | Claude of Lovable                  |
| Receptenboek        | gedeeld, foto's              | Lovable (database + opslag)        |
| Bingokaarten        | geen                         | Claude of Lovable                  |

"In de browser" betekent `localStorage`: blijft bewaard na herladen, maar niet op een ander toestel. In Claude kan "bewaar in de browser" genegeerd worden in artifacts; Lovable kan het wel.

Vervolgvragen: één per bericht, zoals in de slides.

## 🔤 Woordzoeker-maker

> Maak een woordzoeker-maker in het Vlaams, voor grootouders die puzzels maken voor hun kleinkinderen.
>
> Links een eenvoudig formulier: een titel (bv. "Lotte's dierenpuzzel"), een lijst woorden (één per regel, 5 tot 20 woorden), een rastergrootte (klein 10×10, middel 12×12, groot 15×15) en een moeilijkheid: "Makkelijk" (woorden enkel van links naar rechts en van boven naar onder), "Gemiddeld" (ook diagonaal) en "Moeilijk" (ook achterstevoren). Aanvaard letters met accenten, maar plaats ze zonder accenten, in hoofdletters. Waarschuw vriendelijk als een woord te lang is voor het raster.
>
> Rechts een live voorbeeld van de puzzel: de titel, het letterraster in een duidelijk, afgerond lettertype met gelijke tussenruimte, en de woordenlijst eronder in twee kolommen. Een knop "Nieuwe puzzel" schudt dezelfde woorden opnieuw door elkaar. Een schakelaar "Toon oplossing" markeert elk woord met een zachte gekleurde markeerstift-band. Een knop "Afdrukken" drukt enkel de puzzel af op één A4-pagina (geen formulier, geen knoppen), met de optie om de oplossing op een tweede pagina af te drukken.
>
> Vul vooraf een voorbeeld in met 10 dierennamen, zodat de pagina nooit leeg is. Speels maar netjes: crèmekleurige achtergrond, één vrolijke accentkleur, grote knoppen die makkelijk aan te tikken zijn, werkt op een tablet.

Vervolgvragen: een themaprent boven de puzzel · een knop "Kies een thema" met kant-en-klare woordenlijsten (dieren, fruit, beroepen) · een timer om op het scherm te spelen.

## 🧠 Familiequiz

> Maak een quiz-app in het Vlaams voor een familiefeest, met de naam "Wie kent oma het best?". Hij wordt gespeeld op één laptop die aan een tv hangt, dus alles moet leesbaar zijn van aan de andere kant van de kamer.
>
> Er zijn twee delen. In "Quiz maken" voeg ik vragen toe: de vraag, 4 antwoorden, welk antwoord juist is, en eventueel een foto. Ik kan vragen herschikken, aanpassen en verwijderen. Bewaar alles in de browser, zodat het een herlaadbeurt overleeft.
>
> In "Spelen" geef ik eerst de spelers of ploegen in (2 tot 6 namen, elk met een eigen kleur). Daarna verschijnt elke vraag schermvullend, groot en gecentreerd, met de 4 antwoorden als grote gekleurde tegels met de letters A, B, C, D. Per ploeg tik ik aan welk antwoord ze kozen; daarna toont "Toon antwoord" het juiste antwoord met een korte feestelijke animatie, en worden de scores bijgewerkt. Tussen de vragen een kleine scorebalk. Op het einde een podium met de eerste, tweede en derde plaats, confetti, en een knop "Opnieuw spelen".
>
> Begin met 5 voorbeeldvragen over een verzonnen oma (lievelingsbloem, geboortedorp, eerste job, …) zodat ik het meteen kan uitproberen. Feestelijke look: warme kleuren, afgeronde vormen, grote vriendelijke letters, niets overbodigs.

Vervolgvragen: een aftelling van 20 seconden per vraag · een geluidje als het antwoord getoond wordt · de vragen exporteren en importeren als bestand, zodat een ander familielid ze kan spelen.

## ⏳ Aftellen

> Maak een aftel-app in het Vlaams, met de naam "Nog hoeveel nachtjes?", voor kinderen die wachten op iets leuks.
>
> Ik geef in waarnaar we aftellen (bv. "Vakantie naar Italië"), de datum, en kies een emoji of een van 8 thema's (zee, bergen, Sinterklaas, Kerstmis, verjaardag, Pasen, kamp, logeren). Het hoofdscherm toont dan heel groot het aantal nachtjes dat nog rest ("Nog 12 nachtjes slapen!"), en kleiner daaronder de dagen, uren, minuten en seconden die aftellen. Daaronder een rij maantjes, één per resterend nachtje, die één voor één vervagen; zijn het er meer dan 60, toon dan een voortgangsbalk.
>
> Ik kan meerdere aftellingen bijhouden; ze verschijnen als kaarten op een startscherm, de eerstvolgende bovenaan. Als de dag aanbreekt, viert het scherm feest met confetti en "Het is zover!". Elke aftelling heeft een knop "Deel" die een link kopieert met de titel, datum en het thema, zodat de grootouders precies dezelfde aftelling openen op hun eigen gsm, zonder account.
>
> Look: een schermvullende geïllustreerde achtergrond die bij het thema past, zachte kleurverlopen, een groot afgerond speels lettertype, werkt goed op een rechtop gehouden gsm.

Vervolgvragen: een checklist "Wat gaan we doen?" per aftelling · elke ochtend een verrassend weetje · toon het als grote klok op een tv in de woonkamer.

## 📚 Leesclub

> Maak een app in het Vlaams voor onze leesclub van een tiental mensen, "Leesclub De Bladwijzer". Leden melden zich aan met hun e-mailadres (magische link, geen wachtwoord).
>
> De startpagina toont de volgende bijeenkomst prominent: datum, uur, adres, het boek (titel, auteur, kaft) en wie de gastheer of gastvrouw is. Daaronder knoppen om te zeggen "Ik kom", "Ik kom niet" of "Misschien", en een korte lijst van wie er komt. Elke bijeenkomst heeft een lijst "Wie brengt wat?" (koffie, taart, koekjes, …) waar leden aanvinken wat ze meebrengen, zodat niets dubbel meegebracht wordt.
>
> Een pagina "Boekenkast" toont alle boeken die we gelezen hebben, de nieuwste eerst, met de kaft, de datum van de bijeenkomst, en per lid een score op 5 sterren plus een mening van één regel; toon de gemiddelde score. Een pagina "Voorstellen" laat leden boeken voorstellen voor later en erop stemmen met een duimpje; de populairste voorstellen komen bovenaan.
>
> Eén lid is de organisator: enkel die kan bijeenkomsten aanmaken en aanpassen, en een voorstel markeren als "volgende boek". Alle anderen kunnen enkel hun eigen aanwezigheid, bijdragen, scores en voorstellen beheren.
>
> Vul twee voorbije bijeenkomsten en één komende in, met echte bekende boeken, zodat het nooit leeg oogt. Rustige, boekachtige look: gebroken witte papierachtergrond, een schreeflettertype voor de titels, diepgroene accentkleur, veel witruimte, aangenaam op een gsm.

Vervolgvragen: een herinneringsmail twee dagen voor de bijeenkomst · gespreksvragen per boek · een knop "toevoegen aan agenda".

## 🧳 Reisdagboek

> Maak een reisdagboek-app in het Vlaams waarin ik dag per dag het verhaal van een reis bijhoud en deel met de familie. Ik meld me aan met mijn e-mailadres (magische link, geen wachtwoord); bezoekers moeten zich niet aanmelden.
>
> Ik maak een reis aan met een titel, een land of streek, begin- en einddatum, en een omslagfoto. De app maakt automatisch één pagina per dag. Per dag kan ik een korte titel toevoegen, een verhaal (een paar alinea's, eenvoudige opmaak), tot 10 foto's, de plaats waar we waren, en een stemmings-emoji. Foto's worden bij het uploaden verkleind, zodat ze snel laden.
>
> De reispagina toont de omslagfoto groot met de titel, daarna een verticale tijdlijn van de dagen: elke dag een kaart met de eerste foto, datum, titel en de eerste regels van het verhaal. Een klik op een dag opent die met het volledige verhaal en een fotogalerij die foto's schermvullend opent en waarin je kan swipen. Een kleine kaart bovenaan toont een speld voor de plaats van elke dag, verbonden met een stippellijn in volgorde van datum.
>
> Elke reis heeft een knop "Deel" die een alleen-lezen-link kopieert voor de familie; bezoekers kunnen onder elke dag een korte reactie met hun naam achterlaten. Enkel ik kan inhoud toevoegen of aanpassen.
>
> Vul een voorbeeldreis in van 4 dagen door Toscane, met voorbeeldfoto's, zodat het ontwerp meteen zichtbaar is. Look: zoals een mooi papieren plakboek, warme crèmekleurige achtergrond, foto's met een smal wit randje en een lichte draaiing, een handgeschreven lettertype voor de dagtitels en een strak, leesbaar lettertype voor de verhalen.

Vervolgvragen: de hele reis downloaden als PDF-fotoboek · een snelknop "vandaag" op de gsm · meerdere reizen op een startpagina.

## 🌱 Planten water geven

> Maak een app in het Vlaams om planten water te geven, voor iemand met een vijftiental kamerplanten die steeds vergeet welke water nodig heeft.
>
> Per plant: een naam, een optionele foto, de kamer waar hij staat, en om de hoeveel dagen hij water nodig heeft. Het startscherm heeft drie groepen: "Vandaag water geven" bovenaan (in de kijker), "Te laat" (in een zachte waarschuwingskleur, met hoeveel dagen te laat), en "Binnenkort" met het aantal resterende dagen. Elke plantenkaart heeft een grote knop "Water gegeven 💧" die de teller herstart met een kleine plons-animatie; een paar seconden lang verschijnt een knop om dat ongedaan te maken.
>
> Een tweede tabblad toont alle planten gegroepeerd per kamer, waar ik planten kan toevoegen, aanpassen of verwijderen. Een kleine geschiedenis per plant toont de laatste 10 keer dat hij water kreeg. Bewaar alles in de browser.
>
> Begin met 6 gewone kamerplanten (monstera, cactus, pothos, …) met realistische intervallen, waarvan enkele vandaag water nodig hebben. Rustige groene look, afgeronde kaarten, grote tekst en knoppen, werkt goed op een gsm.

Vervolgvragen: herinneringen voor plantenvoeding met een apart schema · een modus "op vakantie" die toont wat je aan de buren moet zeggen · een weekoverzicht als kalender.

## 🍲 Receptenboek

> Maak een familiereceptenboek in het Vlaams, om oma's recepten te verzamelen en te delen met de hele familie. Familieleden melden zich aan met hun e-mailadres (magische link, geen wachtwoord).
>
> Per recept: een naam, een foto, een categorie (soep, hoofdgerecht, dessert, gebak, …), het aantal personen, de bereidingstijd, de ingrediënten (één per regel) en de stappen (genummerd). Optioneel: van wie het recept komt ("van oma Jeanne") en een kort verhaal of herinnering.
>
> De startpagina toont receptkaarten met de foto, naam en tijd, met een zoekvak dat zoekt in namen en ingrediënten, en filters per categorie. Een receptpagina toont de foto groot, de ingrediënten links met vinkjes voor het winkelen of koken, en de stappen rechts in grote letters. Een knop "Porties" herberekent de hoeveelheden. Een knop "Kookmodus" toont één stap tegelijk in heel grote letters en houdt het scherm aan. "Afdrukken" drukt het recept netjes af op één pagina.
>
> Elk familielid kan recepten toevoegen en recepten als favoriet markeren; enkel de auteur kan zijn of haar eigen recept aanpassen.
>
> Vul 6 klassieke Vlaamse recepten in (stoofvlees, vol-au-vent, rijstpap, wafels, …) met voorbeeldfoto's. Warme, ouderwetse keukenlook: crème en terracotta, een schreeflettertype voor de titels, zoals een veelgebruikt familiekookboek.

Vervolgvragen: een boodschappenlijst die meerdere recepten combineert · een foto van een handgeschreven receptkaart uploaden naast de getypte versie.

## 🎱 Bingokaarten

> Maak een generator voor bingokaarten in het Vlaams, voor een feest of een klas.
>
> Ik kies tussen "Getallen" (klassiek 1–75) en "Woorden" (ik geef minstens 24 woorden of korte zinnetjes in, één per regel, bv. namen van familieleden of dingen die zeker gaan gebeuren op het feest). Ik kies een raster van 3×3, 4×4 of 5×5, of het middelste vakje een gratis "★"-vakje is, een titel voor de kaart, en hoeveel verschillende kaarten er gemaakt moeten worden (1 tot 40).
>
> De app toont een voorbeeld van de kaarten en zorgt dat geen twee kaarten hetzelfde zijn. "Afdrukken" drukt ze af met twee per A4-pagina, met scherpe lijnen, de titel bovenaan en verder niets op de pagina. Er is ook een scherm "Spelleider" voor de presentator: een grote knop "Volgende" trekt een willekeurig getal of woord, toont het heel groot op het scherm, en houdt een lijst bij van alles wat al getrokken is, zodat het op een tv getoond kan worden.
>
> Begin met een voorbeeldlijst woorden voor een familiekerstfeest. Vrolijke look: felle maar niet kinderachtige kleuren, een duidelijk vet lettertype, grote knoppen.

Vervolgvragen: spelers vakjes laten aanvinken op hun gsm en automatisch "Bingo!" laten roepen · een themaprent in het gratis vakje.
