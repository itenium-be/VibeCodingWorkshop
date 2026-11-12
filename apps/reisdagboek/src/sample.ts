import type { Trip } from './trip';

export const sampleTrip: Trip = {
  id: 'toscane',
  title: 'Op stap in Toscane',
  region: 'Toscane, Italië',
  start: '2026-05-14',
  end: '2026-05-17',
  cover: 'foto/val-dorcia.jpg',
  days: {
    '2026-05-14': {
      title: 'Ciao Firenze!',
      mood: '🤩',
      place: 'Firenze',
      lat: 43.7731,
      lng: 11.256,
      photos: ['foto/duomo.jpg', 'foto/ponte-vecchio.jpg'],
      story:
        "Om half zeven vertrokken in Zaventem, en om elf uur stonden we al met een cappuccino op een terrasje. De eerste blik op de **Duomo** was overweldigend: dat roze, groene en witte marmer lijkt wel van suikergoed.\n\nIn de namiddag over de *Ponte Vecchio* gewandeld, langs al die kleine juwelierswinkeltjes. Lotte wilde absoluut een gelato met drie bollen. Het werden er vier.\n\n's Avonds pasta met truffel in een trattoria waar enkel Italianen zaten. Goed teken!",
      comments: [
        { id: 'c1', name: 'Oma Jeanne', text: 'Wat een prachtige kerk! Steek je een kaarsje aan voor mij?', at: '2026-05-14T19:12:00Z' },
        { id: 'c2', name: 'Tom', text: 'Vier bollen 😂 typisch Lotte.', at: '2026-05-14T20:40:00Z' },
      ],
    },
    '2026-05-15': {
      title: 'Wijn en torens',
      mood: '🍷',
      place: 'San Gimignano',
      lat: 43.4677,
      lng: 11.0432,
      photos: ['foto/san-gimignano.jpg', 'foto/greve.jpg', 'foto/chianti.jpg'],
      story:
        "Met de huurauto door de **Chianti**-heuvels. Kronkelwegen, cipressen en overal wijngaarden. In Greve een marktje met pecorino en salami, en natuurlijk een fles Chianti in zo'n strooien mandje.\n\nDaarna door naar San Gimignano, het stadje met de middeleeuwse torens. Vroeger waren er meer dan zeventig, nu nog veertien. Vanaf de Torre Grossa zie je tot aan de horizon.",
      comments: [{ id: 'c3', name: 'Papa', text: 'Breng je zo een fles mee? 😉', at: '2026-05-15T18:05:00Z' }],
    },
    '2026-05-16': {
      title: 'Siena, rond de schelp',
      mood: '😊',
      place: 'Siena',
      lat: 43.3183,
      lng: 11.3314,
      photos: ['foto/siena.jpg', 'foto/campo.jpg'],
      story:
        "Siena is helemaal anders dan Firenze: rustiger, roder, en vol steile straatjes. De **Piazza del Campo** loopt schuin af als een schelp. Iedereen zit gewoon op de grond in de zon.\n\nTwee keer per jaar is hier de *Palio*, een paardenrace dwars over het plein. Lotte wil absoluut terugkomen in juli.\n\nVanavond ricciarelli gekocht, zachte amandelkoekjes. Er is er nog één over. Misschien.",
      comments: [],
    },
    '2026-05-17': {
      title: 'Cipressen in de Val d’Orcia',
      mood: '😍',
      place: 'Pienza',
      lat: 43.0766,
      lng: 11.679,
      photos: ['foto/val-dorcia.jpg', 'foto/pienza.jpg', 'foto/montepulciano.jpg'],
      story:
        "De mooiste dag van de reis. Bij zonsopgang naar de bekende rij **cipressen** gereden. Mist in de dalen, en wij helemaal alleen.\n\nIn Pienza smaakt alles naar pecorino, en de stadsmuur kijkt uit over de hele vallei. 's Middags nog een glaasje Vino Nobile in Montepulciano.\n\nMorgen terug naar huis. *Arrivederci, Toscana!*",
      comments: [{ id: 'c4', name: 'Oma Jeanne', text: 'Die foto met de bomen moet ingekaderd worden!', at: '2026-05-17T21:00:00Z' }],
    },
  },
};

export const credits = [
  ['val-dorcia.jpg', 'Carlo cattaneo fotografie', 'CC BY-SA 4.0', "I_cipressi_della_Val_D'Orcia.jpg"],
  ['duomo.jpg', 'Gary Campbell-Hall', 'CC BY 2.0', 'Cattedrale_di_Santa_Maria_del_Fiore_–_Il_Duomo_di_Firenze.jpg'],
  ['ponte-vecchio.jpg', 'Ingo Mehling', 'CC BY-SA 4.0', 'Ponte_Vecchio_from_Ponte_alle_Grazie.jpg'],
  ['san-gimignano.jpg', 'Chensiyuan', 'CC BY-SA 4.0', '1_Aerial_pano_san_gimignano_(2)a.jpg'],
  ['greve.jpg', 'Velvet', 'CC BY-SA 3.0', 'Greve_piazza.JPG'],
  ['chianti.jpg', 'giulio nepi', 'CC BY 2.0', 'Fiasco_di_vino_rosso_da_tavola_Monteriggioni.jpg'],
  ['siena.jpg', 'Zairon', 'CC BY 4.0', 'Siena_Cattedrale_nuova_Vista_su_la_Piazza_del_Campo_2.jpg'],
  ['campo.jpg', 'Ricardo André Frantz', 'CC BY-SA 3.0', 'Siena5.jpg'],
  ['pienza.jpg', 'sherseydc', 'CC BY-SA 2.0', 'Pienza_italy.jpg'],
  ['montepulciano.jpg', 'Chensiyuan', 'CC BY-SA 4.0', '1_montepulciano_aerial_2024.jpg'],
] as const;
