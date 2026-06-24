import type { ArtistRef } from './artwork';

// Olivia's favorite artworks — 1–4 works per artist, 25 artists, in her order,
// built from the curated handoff manifest.
//
// How each work resolves at build time (see artwork.ts):
//   file:     a pinned Wikimedia Commons File: — exact and correct. ONLY these
//             (plus 'met' and 'link') render today.
//   met:      a Met object by id.
//   link:     an in-copyright work we can't host; renders a card linking to the
//             work. To self-host a licensed image, switch to 'local' + image.
//   search / category + `pending: true`: HIDDEN. Best-effort Commons search/
//             category lookups proved unreliable (they grabbed the wrong image),
//             so these are parked until pinned to an exact `file`. The search/
//             category text is kept as a hint. To turn one on: replace it with
//             `file: '<Commons File: title>'` and drop the `pending` flag.

export const ARTISTS: ArtistRef[] = [
  {
    name: 'Auguste Rodin',
    works: [
      { title: 'The Kiss', year: '1882', source: 'commons', file: 'The_Kiss.JPG' },
      { title: 'The Gates of Hell', year: '1880–1917', source: 'commons', file: 'Gates_of_Hell_sculpture_by_Rodin_surrounded_by_Adam_and_Eve.JPG', note: 'Stanford/Cantor cast' },
    ],
  },
  {
    name: 'Maxfield Parrish',
    works: [
      { title: 'Daybreak', year: '1922', source: 'commons', file: 'Daybreak_by_Parrish_(1922).jpg' },
      { title: 'Old White Birch', year: '~1937', source: 'commons', search: 'Old White Birch Maxfield Parrish', pending: true },
      { title: 'Stars', year: '1926', source: 'commons', search: 'Stars Maxfield Parrish', pending: true },
      { title: 'Ecstasy', year: '1929', source: 'commons', search: 'Ecstasy Maxfield Parrish', pending: true },
    ],
  },
  {
    name: 'Zdzisław Beksiński',
    works: [
      { title: 'Untitled — great tree over a red plain', source: 'link', search: 'Zdzisław Beksiński' },
      { title: 'Untitled — colossal head over a ruined city', source: 'link', search: 'Zdzisław Beksiński' },
      { title: 'Untitled — two shrouded figures in an ochre void', source: 'link', search: 'Zdzisław Beksiński' },
    ],
  },
  {
    name: 'Gustav Klimt',
    works: [
      { title: 'Mother and Child', year: '1905', source: 'commons', search: 'Gustav Klimt Mother and Child Three Ages of Woman', pending: true, note: 'wants the mother-and-child detail (crop of The Three Ages of Woman)' },
      { title: 'The Kiss', year: '1907–08', source: 'commons', file: 'The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg' },
      { title: 'Death and Life', year: '1908–1915', source: 'commons', file: 'Gustav_Klimt_-_Death_and_Life_-_Google_Art_Project.jpg', note: 'Google Art Project file, not the ~419MB scan' },
    ],
  },
  {
    name: 'Pierre-Auguste Cot',
    works: [
      { title: 'The Storm', year: '1880', source: 'commons', file: "Pierre_Auguste_Cot_-_L'Orage_(1880)_-_MET_Museum.jpg" },
      { title: 'Springtime', year: '1873', source: 'met', id: 438158 },
    ],
  },
  {
    name: 'Caspar David Friedrich',
    works: [
      { title: 'Wanderer above the Sea of Fog', year: '1818', source: 'commons', file: 'Caspar_David_Friedrich_-_Wanderer_above_the_Sea_of_Fog.jpeg' },
      { title: 'Reefs by the Seashore', year: '1824', source: 'commons', file: 'Caspar_David_Friedrich_-_Felsenriff_am_Meeresstrand_(1824).jpg' },
      { title: 'Ruins of the Oybin', year: '1835', source: 'commons', search: 'Caspar David Friedrich Oybin', pending: true },
      { title: 'Coastal Landscape with Cross and Statue', source: 'commons', search: 'Caspar David Friedrich coastal landscape cross statue', pending: true },
    ],
  },
  {
    name: 'Arnold Böcklin',
    works: [
      { title: 'Isle of the Dead', year: '1883', source: 'commons', file: 'Arnold_Böcklin_-_Die_Toteninsel_III_(Alte_Nationalgalerie,_Berlin).jpg', note: 'Berlin version' },
    ],
  },
  {
    name: 'Albert Bierstadt',
    works: [
      { title: 'Among the Sierra Nevada, California', year: '1868', source: 'commons', file: 'Albert_Bierstadt_-_Among_the_Sierra_Nevada,_California_-_Google_Art_Project.jpg' },
      { title: 'A Storm in the Rocky Mountains, Mt. Rosalie', year: '1866', source: 'commons', file: 'Albert_Bierstadt_-_A_Storm_in_the_Rocky_Mountains,_Mt._Rosalie_-_Google_Art_Project.jpg' },
      { title: 'The Storm in the Mountains', year: 'c. 1870', source: 'commons', search: 'The Storm in the Mountains Bierstadt', pending: true },
    ],
  },
  {
    name: 'Alphonse Mucha',
    works: [
      { title: 'The Seasons', year: '1896', source: 'commons', category: 'Category:The seasons - Alfons Mucha (1896)', pending: true, note: '4 panels' },
      { title: 'The Flowers', year: '1898', source: 'commons', category: 'Category:The flowers - Alfons Mucha (1898)', pending: true, note: '4 panels' },
    ],
  },
  {
    name: 'Ivan Aivazovsky',
    works: [
      { title: 'The Ninth Wave', year: '1850', source: 'commons', file: 'Aivazovsky,_Ivan_-_The_Ninth_Wave.jpg' },
      { title: 'The Black Sea', year: '1881', source: 'commons', search: 'The Black Sea Aivazovsky 1881', pending: true },
      { title: 'Storm at Sea on a Moonlit Night', year: '1849', source: 'commons', file: 'Storm_at_Sea_on_a_Moonlit_Night_(Aivazovsky).jpg' },
    ],
  },
  {
    name: 'Thomas Moran',
    works: [
      { title: 'Shoshone Falls, Snake River, Idaho', source: 'commons', file: 'Shoshone_Falls_Idaho_Thomas_Moran.jpeg', note: 'watercolor' },
      { title: 'Sunset at Sea', year: 'c. 1906', source: 'commons', file: 'Brooklyn_Museum_-_Sunset_at_Sea_-_Thomas_Moran_-_overall.jpg' },
      { title: 'Green River, Wyoming', year: '1883', source: 'commons', file: 'Green_River,_Wyoming_by_Thomas_Moran,_1883.jpg' },
    ],
  },
  {
    name: 'M.C. Escher',
    works: [
      { title: 'Waterfall', year: '1961', source: 'link' },
      { title: 'Relativity', year: '1953', source: 'link' },
      { title: 'Reptiles', year: '1943', source: 'link' },
    ],
  },
  {
    name: 'Salvador Dalí',
    works: [
      { title: 'The Persistence of Memory', year: '1931', source: 'link' },
      { title: 'Swans Reflecting Elephants', year: '1937', source: 'link' },
    ],
  },
  {
    name: 'René Magritte',
    works: [
      { title: 'The Lovers', year: '1928', source: 'link', search: 'The Lovers Magritte painting' },
      { title: 'The Empire of Light', year: '1953–54', source: 'link' },
    ],
  },
  {
    name: 'Frederic Edwin Church',
    works: [
      { title: 'Cotopaxi', year: '1862', source: 'commons', file: 'Frederic_Edwin_Church_-_Cotopaxi_-_Google_Art_Project.jpg' },
      { title: 'Niagara', year: '1857', source: 'commons', file: 'Frederic_Edwin_Church_-_The_Niagara_Falls_-_Google_Art_Project.jpg' },
    ],
  },
  {
    name: 'Thomas Cole',
    works: [
      { title: 'The Course of Empire', year: '1833–36', source: 'commons', category: 'Category:The Course of Empire', pending: true, note: '5 panels' },
      { title: 'The Voyage of Life', year: '1842', source: 'commons', category: 'Category:The Voyage of Life (Thomas Cole)', pending: true, note: '4 panels' },
    ],
  },
  {
    name: 'Gian Lorenzo Bernini',
    works: [
      { title: 'Apollo and Daphne', year: '1622–25', source: 'commons', search: 'Apollo and Daphne Bernini', pending: true },
      { title: 'The Rape of Proserpina', year: '1621–22', source: 'commons', search: 'Rape of Proserpina Bernini', pending: true },
    ],
  },
  {
    name: 'John Martin',
    works: [
      { title: 'The Great Day of His Wrath', year: '1851–53', source: 'commons', search: 'The Great Day of His Wrath John Martin', pending: true },
      { title: 'The Destruction of Pompeii and Herculaneum', year: '1822', source: 'commons', search: 'Destruction of Pompeii and Herculaneum John Martin', pending: true },
    ],
  },
  {
    name: 'Caravaggio',
    works: [
      { title: 'Judith Beheading Holofernes', year: 'c. 1598–1602', source: 'commons', file: 'Judith_Beheading_Holofernes_-_Caravaggio.jpg' },
      { title: 'The Incredulity of Saint Thomas', year: '1601–02', source: 'commons', search: 'Incredulity of Saint Thomas Caravaggio', pending: true },
      { title: 'David with the Head of Goliath', year: '1609–10', source: 'commons', search: 'David with the Head of Goliath Caravaggio Borghese', pending: true },
    ],
  },
  {
    name: 'Claude Monet',
    works: [
      { title: 'The Houses of Parliament, Sun Breaking Through the Fog', year: '1904', source: 'commons', search: 'Monet Houses of Parliament Sun Breaking Through the Fog Orsay', pending: true },
      { title: 'Meules', year: '1890', source: 'commons', search: 'Meules Monet 1890', pending: true },
    ],
  },
  {
    name: 'Ivan Shishkin',
    works: [
      { title: 'In the Wild North', year: '1891', source: 'commons', file: 'Шишкин_И._И._(1891)_На_севере_диком.jpg' },
      { title: 'Rye', year: '1878', source: 'commons', file: 'Rozh.jpg' },
      { title: 'Ship Grove (Mast-Tree Grove)', year: '1898', source: 'commons', search: 'Shishkin Mast Tree Grove', pending: true },
    ],
  },
  {
    name: 'Vilhelm Hammershøi',
    works: [
      { title: 'Interior with Woman at Piano, Strandgade 30', year: '1901', source: 'commons', file: 'Vilhelm_Hammershøi,_Stue_med_kvinde_ved_klaver,_Strandgade_30,_1901.jpg' },
      { title: 'Interior. With Piano and Woman in Black, Strandgade 30', year: '1901', source: 'commons', search: 'Hammershøi Interior Piano Woman in Black Strandgade', pending: true },
    ],
  },
  {
    name: 'Louis Rémy Mignot',
    works: [
      { title: 'Solitude', year: '1855', source: 'commons', file: 'Louis_Rémy_Mignot_Solitude.jpg', note: 'only modest res (1107×613)' },
      { title: 'Niagara', year: '1866', source: 'commons', search: 'Louis Rémy Mignot Niagara', pending: true },
    ],
  },
  {
    name: 'Andreas Achenbach',
    works: [
      { title: 'Clearing Up—Coast of Sicily', year: '1847', source: 'commons', file: 'Andreas_Achenbach_-_Clearing_Up—Coast_of_Sicily_-_Walters_37116.jpg' },
    ],
  },
  {
    name: 'William-Adolphe Bouguereau',
    works: [
      { title: 'Dante and Virgil in Hell', year: '1850', source: 'commons', file: 'William_Bouguereau_-_Dante_and_Virgile_-_Google_Art_Project_2.jpg' },
      { title: 'Première rêverie', year: '1889', source: 'commons', search: 'Bouguereau Première rêverie', pending: true },
    ],
  },
];

// HIDDEN (pending an exact Commons File: link) — paste an "Original file" URL
// for any of these and it renders correctly like Daybreak / The Kiss:
//   Parrish: Old White Birch, Stars, Ecstasy
//   Klimt: Mother and Child (cropped detail)
//   Friedrich: Ruins of the Oybin, Coastal Landscape with Cross and Statue
//   Bierstadt: The Storm in the Mountains
//   Mucha: The Seasons, The Flowers (4 panel files each)
//   Aivazovsky: The Black Sea
//   Cole: The Course of Empire (5), The Voyage of Life (4) panel files
//   Bernini: Apollo and Daphne, The Rape of Proserpina
//   John Martin: The Great Day of His Wrath, The Destruction of Pompeii
//   Caravaggio: The Incredulity of Saint Thomas, David with the Head of Goliath
//   Monet: Sun Breaking Through the Fog, Meules
//   Shishkin: Ship Grove
//   Hammershøi: Interior with Piano and Woman in Black
//   Mignot: Niagara
//   Bouguereau: Première rêverie
//
// Link-out (in copyright): Beksiński ×3, Escher ×3, Dalí ×2, Magritte ×2
