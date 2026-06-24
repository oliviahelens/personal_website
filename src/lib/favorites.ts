import type { ArtistRef } from './artwork';

// Olivia's favorite artworks — 1–4 works per artist, 25 artists, in her order,
// built from the curated handoff manifest and pinned to exact Commons files.
//
// Source types (see artwork.ts):
//   file:     a pinned Wikimedia Commons File:, resolved to a sized thumbnail.
//   panels:   explicit Commons files shown as a sub-grid (Mucha, Cole sets).
//   met:      a Met object by id.
//   link:     an in-copyright work; renders a card linking to it (no image).
//   search + `pending: true`: HIDDEN — not on Commons / not yet located. Drop a
//             `file`/`image` in and remove `pending` to turn it on.

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
      { title: 'Old White Birch', year: '~1937', source: 'commons', pending: true, note: 'not on Commons (private collection) — self-host to enable' },
      { title: 'Stars', year: '1926', source: 'commons', pending: true, note: 'not on Commons (private collection) — self-host to enable' },
      { title: 'Ecstasy', year: '1929', source: 'commons', pending: true, note: 'not on Commons (private collection) — self-host to enable' },
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
      { title: 'Mother and Child', year: '1905', source: 'commons', file: 'The_Three_Ages_of_Woman.jpg', note: 'full painting — Commons has no isolated mother-and-child crop' },
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
      { title: 'Ruins of the Oybin', year: '~1835', source: 'commons', file: 'CD_Friedrich_Klosterruine_Oybin.jpg' },
      { title: 'Coastal Landscape with Cross and Statue', source: 'commons', pending: true, note: 'not located on Commons under this title' },
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
      { title: 'The Storm in the Mountains', year: 'c. 1870', source: 'commons', file: 'Albert_Bierstadt_-_Storm_in_the_Mountains_-_47.1257_-_Museum_of_Fine_Arts.jpg' },
    ],
  },
  {
    name: 'Alphonse Mucha',
    works: [
      {
        title: 'The Seasons', year: '1896', source: 'commons',
        panels: [
          { file: 'Alfons_Mucha_-_The_Seasons_-_Spring_(1896).jpg', title: 'Spring' },
          { file: 'Alfons_Mucha_-_The_Seasons_-_Summer_(1896).jpg', title: 'Summer' },
          { file: 'Alfons_Mucha_-_The_Seasons_-_Autumn_(1896).jpg', title: 'Autumn' },
          { file: 'Alfons_Mucha_-_The_Seasons_-_Winter_(1896).jpg', title: 'Winter' },
        ],
      },
      {
        title: 'The Flowers', year: '1898', source: 'commons',
        panels: [
          { file: 'Alfons_Mucha_-_La_Rose.jpg', title: 'Rose' },
          { file: "Alfons_Mucha_-_L'iris.jpg", title: 'Iris' },
          { file: "Alfons_Mucha_-_L'oeillet.jpg", title: 'Carnation' },
          { file: 'Alfons_Mucha_-_Le_Lys.jpg', title: 'Lily' },
        ],
      },
    ],
  },
  {
    name: 'Ivan Aivazovsky',
    works: [
      { title: 'The Ninth Wave', year: '1850', source: 'commons', file: 'Aivazovsky,_Ivan_-_The_Ninth_Wave.jpg' },
      { title: 'The Black Sea', year: '1881', source: 'commons', file: 'Иван_Константинович_Айвазовский_-_Черное_море_(на_Черном_море_начинает_разыгрываться_буря)_-_Google_Art_Project.jpg' },
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
      {
        title: 'The Course of Empire', year: '1833–36', source: 'commons',
        panels: [
          { file: 'Cole_Thomas_The_Course_of_Empire_The_Savage_State_1836.jpg', title: 'The Savage State' },
          { file: 'Cole_Thomas_The_Course_of_Empire_The_Arcadian_or_Pastoral_State_1836.jpg', title: 'The Arcadian or Pastoral State' },
          { file: 'Cole_Thomas_The_Consummation_The_Course_of_the_Empire_1836.jpg', title: 'The Consummation' },
          { file: 'Cole_Thomas_The_Course_of_Empire_Destruction_1836.jpg', title: 'Destruction' },
          { file: 'Cole_Thomas_The_Course_of_Empire_Desolation_1836.jpg', title: 'Desolation' },
        ],
      },
      {
        title: 'The Voyage of Life', year: '1842', source: 'commons',
        panels: [
          { file: 'Thomas_Cole_-_The_Voyage_of_Life_Childhood,_1842_(National_Gallery_of_Art).jpg', title: 'Childhood' },
          { file: 'Thomas_Cole_-_The_Voyage_of_Life_Youth,_1842_(National_Gallery_of_Art).jpg', title: 'Youth' },
          { file: 'Thomas_Cole_-_The_Voyage_of_Life_Manhood,_1842_(National_Gallery_of_Art).jpg', title: 'Manhood' },
          { file: 'Thomas_Cole_-_The_Voyage_of_Life_Old_Age,_1842_(National_Gallery_of_Art).jpg', title: 'Old Age' },
        ],
      },
    ],
  },
  {
    name: 'Gian Lorenzo Bernini',
    works: [
      { title: 'Apollo and Daphne', year: '1622–25', source: 'commons', file: 'Apollo_and_Daphne_by_Bernini_(Galleria_Borghese).jpg' },
      { title: 'The Rape of Proserpina', year: '1621–22', source: 'commons', file: 'The_Rape_of_Proserpina_by_Bernini,_Galleria_Borghese_(45779525174).jpg' },
    ],
  },
  {
    name: 'John Martin',
    works: [
      { title: 'The Great Day of His Wrath', year: '1851–53', source: 'commons', file: 'John_Martin_-_The_Great_Day_of_His_Wrath_-_Google_Art_Project.jpg' },
      { title: 'The Destruction of Pompeii and Herculaneum', year: '1822', source: 'commons', file: 'Destruction_of_Pompeii_and_Herculaneum.jpg' },
    ],
  },
  {
    name: 'Caravaggio',
    works: [
      { title: 'Judith Beheading Holofernes', year: 'c. 1598–1602', source: 'commons', file: 'Judith_Beheading_Holofernes_-_Caravaggio.jpg' },
      { title: 'The Incredulity of Saint Thomas', year: '1601–02', source: 'commons', file: 'Caravaggio_incredulity.jpg', note: 'huge source (42558×31589); Commons thumb may be slow' },
      { title: 'David with the Head of Goliath', year: '1609–10', source: 'commons', file: 'David_with_the_Head_of_Goliath-Caravaggio_(1610).jpg', note: 'Borghese version' },
    ],
  },
  {
    name: 'Claude Monet',
    works: [
      { title: 'The Houses of Parliament, Sun Breaking Through the Fog', year: '1904', source: 'commons', file: 'Londres,_le_Parlement._Trouée_de_soleil_dans_le_brouillard,_by_Claude_Monet_(35514322203).jpg' },
      { title: 'Meules', year: '1890', source: 'commons', file: 'Claude_Monet_-_Meules_(W_1273).jpg' },
    ],
  },
  {
    name: 'Ivan Shishkin',
    works: [
      { title: 'In the Wild North', year: '1891', source: 'commons', file: 'Шишкин_И._И._(1891)_На_севере_диком.jpg' },
      { title: 'Rye', year: '1878', source: 'commons', file: 'Rozh.jpg' },
      { title: 'Ship Grove (Mast-Tree Grove)', year: '1898', source: 'commons', file: 'Ivan_Shishkin_-_Mast-Tree_grove_-_Google_Art_Project.jpg' },
    ],
  },
  {
    name: 'Vilhelm Hammershøi',
    works: [
      { title: 'Interior with Woman at Piano, Strandgade 30', year: '1901', source: 'commons', file: 'Vilhelm_Hammershøi,_Stue_med_kvinde_ved_klaver,_Strandgade_30,_1901.jpg' },
      { title: 'Interior. With Piano and Woman in Black, Strandgade 30', year: '1901', source: 'commons', pending: true, note: 'Ordrupgaard version not confirmed on Commons' },
    ],
  },
  {
    name: 'Louis Rémy Mignot',
    works: [
      { title: 'Solitude', year: '1855', source: 'commons', file: 'Louis_Rémy_Mignot_Solitude.jpg', note: 'only modest res (1107×613)' },
      { title: 'Niagara', year: '1866', source: 'commons', pending: true, note: 'not on Commons; try Brooklyn Museum open-access' },
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
      { title: 'Première rêverie', year: '1889', source: 'commons', pending: true, note: 'not located on Commons under this title' },
    ],
  },
];

// Still HIDDEN (not on Commons — would need a self-hosted image):
//   Parrish: Old White Birch, Stars, Ecstasy
//   Friedrich: Coastal Landscape with Cross and Statue
//   Hammershøi: Interior with Piano and Woman in Black (Ordrupgaard)
//   Mignot: Niagara
//   Bouguereau: Première rêverie
//
// Note: Klimt "Mother and Child" shows the full "The Three Ages of Woman"
// (no isolated crop on Commons) — can CSS-crop or self-host a crop if wanted.
//
// Link-out (in copyright): Beksiński ×3, Escher ×3, Dalí ×2, Magritte ×2
