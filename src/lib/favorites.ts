import type { ArtistRef } from './artwork';

// Olivia's favorite artworks — 1–4 works per artist, 25 artists, in her order,
// built from the curated handoff manifest.
//
// Source types (see artwork.ts): 'commons' (a Wikimedia Commons File:, resolved
// to a sized thumbnail at build), 'met'/'aic' (a museum object), 'direct' (an
// exact image URL), 'local' (a self-hosted image under /public for in-copyright
// works — appears once the file is added).
//
// `pending: true` marks a work whose exact high-res file isn't pinned yet — a
// Commons Category or a `resolve:` hint. It's tracked here but not rendered
// until a concrete `file`/`image`/`panels` is filled in. Outstanding ones are
// summarized at the bottom of this file.

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
      { title: 'Old White Birch', year: '~1937', source: 'commons', pending: true, note: "resolve: Christie's lot page; best high-res source" },
      { title: 'Stars', year: '1926', source: 'commons', pending: true, note: "resolve: Commons search 'Stars Maxfield Parrish' or auction-house scan" },
      { title: 'Ecstasy', year: '1929', source: 'commons', pending: true, note: "resolve: Commons search 'Ecstasy Maxfield Parrish' or auction scan" },
    ],
  },
  {
    name: 'Zdzisław Beksiński',
    works: [
      { title: 'Untitled — great tree over a red plain', source: 'local', image: '/artwork/beksinski-tree.jpg', pending: true, note: 'in copyright — self-host; Sanok museum / DESA Unicum' },
      { title: 'Untitled — colossal head over a ruined city', source: 'local', image: '/artwork/beksinski-head.jpg', pending: true, note: 'in copyright — self-host' },
      { title: 'Untitled — two shrouded figures in an ochre void', source: 'local', image: '/artwork/beksinski-embrace.jpg', pending: true, note: 'in copyright — self-host' },
    ],
  },
  {
    name: 'Gustav Klimt',
    works: [
      { title: 'Mother and Child', year: '1905', source: 'commons', pending: true, note: 'crop the mother-and-child detail from The Three Ages of Woman' },
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
      { title: 'Ruins of the Oybin', year: '1835', source: 'commons', pending: true, note: "resolve: Commons Friedrich category, search 'Oybin'" },
      { title: 'Coastal Landscape with Cross and Statue', source: 'commons', pending: true, note: 'resolve: Commons Friedrich category or German title' },
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
      { title: 'The Storm in the Mountains', year: 'c. 1870', source: 'commons', pending: true, note: "resolve: MFA Boston open-access or Commons 'Storm in the Mountains Bierstadt'" },
    ],
  },
  {
    name: 'Alphonse Mucha',
    works: [
      { title: 'The Seasons', year: '1896', source: 'commons', panels: [], pending: true, note: 'resolve: 4 panels from Category:The_seasons_-_Alfons_Mucha_(1896) — Spring/Summer/Autumn/Winter' },
      { title: 'The Flowers', year: '1898', source: 'commons', panels: [], pending: true, note: 'resolve: 4 panels from Category:The_flowers_-_Alfons_Mucha_(1898) — Rose/Iris/Carnation/Lily' },
    ],
  },
  {
    name: 'Ivan Aivazovsky',
    works: [
      { title: 'The Ninth Wave', year: '1850', source: 'commons', file: 'Aivazovsky,_Ivan_-_The_Ninth_Wave.jpg' },
      { title: 'The Black Sea', year: '1881', source: 'commons', pending: true, note: 'resolve: file from Category:The_Black_Sea_by_Ivan_Aivazovsky (Google Art Project)' },
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
      { title: 'Waterfall', year: '1961', source: 'local', image: '/artwork/escher-waterfall.jpg', pending: true, note: 'in copyright — self-host; mcescher.com' },
      { title: 'Relativity', year: '1953', source: 'local', image: '/artwork/escher-relativity.jpg', pending: true, note: 'in copyright — self-host' },
      { title: 'Reptiles', year: '1943', source: 'local', image: '/artwork/escher-reptiles.jpg', pending: true, note: 'in copyright — self-host' },
    ],
  },
  {
    name: 'Salvador Dalí',
    works: [
      { title: 'The Persistence of Memory', year: '1931', source: 'local', image: '/artwork/dali-persistence-of-memory.jpg', pending: true, note: 'in copyright — self-host; MoMA' },
      { title: 'Swans Reflecting Elephants', year: '1937', source: 'local', image: '/artwork/dali-swans-reflecting-elephants.jpg', pending: true, note: 'in copyright — self-host' },
    ],
  },
  {
    name: 'René Magritte',
    works: [
      { title: 'The Lovers', year: '1928', source: 'local', image: '/artwork/magritte-the-lovers.jpg', pending: true, note: 'in copyright — self-host; MoMA' },
      { title: 'The Empire of Light', year: '1953–54', source: 'local', image: '/artwork/magritte-empire-of-light.jpg', pending: true, note: 'in copyright — self-host; pick version (MoMA / Guggenheim)' },
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
      { title: 'The Course of Empire', year: '1833–36', source: 'commons', panels: [], pending: true, note: 'resolve: 5 panels from Category:The_Course_of_Empire — Savage/Pastoral/Consummation/Destruction/Desolation' },
      { title: 'The Voyage of Life', year: '1842', source: 'commons', panels: [], pending: true, note: 'resolve: 4 panels from Category:The_Voyage_of_Life_(Thomas_Cole) — NGA 1842 set' },
    ],
  },
  {
    name: 'Gian Lorenzo Bernini',
    works: [
      { title: 'Apollo and Daphne', year: '1622–25', source: 'commons', pending: true, note: 'resolve: photo from Category:Apollo_and_Daphne_by_Bernini (Alvesgaspar)' },
      { title: 'The Rape of Proserpina', year: '1621–22', source: 'commons', pending: true, note: 'resolve: photo from Category:Ratto_di_Proserpina_(Bernini)' },
    ],
  },
  {
    name: 'John Martin',
    works: [
      { title: 'The Great Day of His Wrath', year: '1851–53', source: 'commons', pending: true, note: "resolve: Commons 'The Great Day of His Wrath' (Google Art Project)" },
      { title: 'The Destruction of Pompeii and Herculaneum', year: '1822', source: 'commons', pending: true, note: 'resolve: Category:John_Martin_(painter)' },
    ],
  },
  {
    name: 'Caravaggio',
    works: [
      { title: 'Judith Beheading Holofernes', year: 'c. 1598–1602', source: 'commons', file: 'Judith_Beheading_Holofernes_-_Caravaggio.jpg' },
      { title: 'The Incredulity of Saint Thomas', year: '1601–02', source: 'commons', pending: true, note: 'resolve: file from Category:Google_Art_Project_works_by_Caravaggio' },
      { title: 'David with the Head of Goliath', year: '1609–10', source: 'commons', pending: true, note: "resolve: Borghese version; Commons 'David with the Head of Goliath Caravaggio'" },
    ],
  },
  {
    name: 'Claude Monet',
    works: [
      { title: 'The Houses of Parliament, Sunlight Effect', year: '1903', source: 'commons', file: 'Claude_Monet_-_Houses_of_Parliament,_Sunlight_Effect_(Le_Parlement,_effet_de_soleil)_-_Google_Art_Project.jpg', note: 'Brooklyn Museum; confirm vs Orsay 1904 version' },
      { title: 'Meules', year: '1890', source: 'commons', pending: true, note: "resolve: private collection; Commons 'Meules Monet 1890'" },
    ],
  },
  {
    name: 'Ivan Shishkin',
    works: [
      { title: 'In the Wild North', year: '1891', source: 'commons', file: 'Шишкин_И._И._(1891)_На_севере_диком.jpg' },
      { title: 'Rye', year: '1878', source: 'commons', file: 'Rozh.jpg' },
      { title: 'Ship Grove (Mast-Tree Grove)', year: '1898', source: 'commons', pending: true, note: "resolve: Commons 'Korabelnaya roshcha Shishkin'" },
    ],
  },
  {
    name: 'Vilhelm Hammershøi',
    works: [
      { title: 'Interior with Woman at Piano, Strandgade 30', year: '1901', source: 'commons', file: 'Vilhelm_Hammershøi,_Stue_med_kvinde_ved_klaver,_Strandgade_30,_1901.jpg' },
      { title: 'Interior. With Piano and Woman in Black, Strandgade 30', year: '1901', source: 'commons', pending: true, note: "resolve: Ordrupgaard; Commons 'Hammershøi Piano Woman in Black Strandgade'" },
    ],
  },
  {
    name: 'Louis Rémy Mignot',
    works: [
      { title: 'Solitude', year: '1855', source: 'commons', file: 'Louis_Rémy_Mignot_Solitude.jpg', note: 'only modest res (1107×613)' },
      { title: 'Niagara', year: '1866', source: 'commons', pending: true, note: "resolve: Commons 'Mignot Niagara' or Brooklyn Museum open-access" },
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
      { title: 'Première rêverie', year: '1889', source: 'commons', pending: true, note: "resolve: Commons 'Bouguereau Première rêverie'" },
    ],
  },
];

// Outstanding `pending` works (need an exact high-res file pinned):
//   Parrish: Old White Birch, Stars, Ecstasy
//   Beksiński: all three (self-host — owner to supply images)
//   Klimt: Mother and Child detail crop
//   Friedrich: Ruins of the Oybin, Coastal Landscape with Cross and Statue
//   Bierstadt: The Storm in the Mountains
//   Mucha: The Seasons + The Flowers (4 panels each)
//   Aivazovsky: The Black Sea
//   Escher / Dalí / Magritte: all (self-host — owner to supply images)
//   Cole: The Course of Empire (5 panels) + The Voyage of Life (4 panels)
//   Bernini: Apollo and Daphne, The Rape of Proserpina
//   John Martin: both
//   Caravaggio: The Incredulity of Saint Thomas, David with the Head of Goliath
//   Monet: Meules
//   Shishkin: Ship Grove
//   Hammershøi: Interior with Piano and Woman in Black
//   Mignot: Niagara
//   Bouguereau: Première rêverie
