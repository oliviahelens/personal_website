import type { ArtistRef } from './artwork';

// Olivia's favorite artworks — 1–4 works per artist, 25 artists, ordered for
// display flow (luminous landscapes lead; the decorative, sculptural, and more
// intense/violent pieces sit lower and broken up so they don't cluster).
//
// Source types (see artwork.ts):
//   file:     a pinned Wikimedia Commons File:, resolved to a sized thumbnail.
//   panels:   explicit Commons files shown as a sub-grid (Mucha, Cole sets).
//   met:      a Met object by id.
//   link:     an in-copyright work; renders a card linking to it (no image).
//   local:    a self-hosted image under /public/artwork.

export const ARTISTS: ArtistRef[] = [
  {
    name: 'Ivan Aivazovsky',
    works: [
      { title: 'The Ninth Wave', year: '1850', source: 'commons', file: 'Aivazovsky,_Ivan_-_The_Ninth_Wave.jpg' },
      { title: 'The Black Sea', year: '1881', source: 'commons', file: 'Иван_Константинович_Айвазовский_-_Черное_море_(на_Черном_море_начинает_разыгрываться_буря)_-_Google_Art_Project.jpg' },
      { title: 'Storm at Sea on a Moonlit Night', year: '1849', source: 'commons', file: 'Storm_at_Sea_on_a_Moonlit_Night_(Aivazovsky).jpg' },
    ],
  },
  {
    name: 'Frederic Edwin Church',
    works: [
      { title: 'Cotopaxi', year: '1855', source: 'local', image: '/artwork/church-cotopaxi', note: 'self-hosted — the pink/orange version, replacing the 1862 Detroit one' },
      { title: 'Niagara', year: '1857', source: 'local', image: '/artwork/church-niagara', note: 'self-hosted — Commons scan was washed out' },
    ],
  },
  {
    name: 'Arkhip Kuindzhi',
    works: [
      { title: 'Moonlit Night on the Dnieper', year: '1880', source: 'local', image: '/artwork/arkhip-dnieper' },
      { title: 'Red Sunset on the Dnieper', year: 'c. 1905–08', source: 'local', image: '/artwork/arkhip-red' },
      { title: 'After a Rain', year: '1879', source: 'local', image: '/artwork/arkhip-rain' },
    ],
  },
  {
    name: 'Maxfield Parrish',
    works: [
      { title: 'Daybreak', year: '1922', source: 'commons', file: 'Daybreak_by_Parrish_(1922).jpg' },
      { title: 'Old White Birch', year: '~1937', source: 'local', image: '/artwork/parrish-old-white-birch', note: 'self-hosted (not on Commons)' },
      { title: 'Stars', year: '1926', source: 'local', image: '/artwork/parrish-stars', note: 'self-hosted (not on Commons)' },
      { title: 'Ecstasy', year: '1929', source: 'local', image: '/artwork/parrish-ecstasy', note: 'self-hosted (not on Commons)' },
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
      { title: 'Ruins of the Oybin', year: '~1835', source: 'local', image: '/artwork/friedrich-ruins' },
      { title: 'Coastal Landscape with Cross and Statue', source: 'local', image: '/artwork/friedrich-coastal-landscape-cross-statue', note: 'self-hosted (not on Commons)' },
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
    name: 'Thomas Moran',
    works: [
      { title: 'Shoshone Falls, Snake River, Idaho', source: 'commons', file: 'Shoshone_Falls_Idaho_Thomas_Moran.jpeg', note: 'watercolor' },
      { title: 'Sunset at Sea', year: 'c. 1906', source: 'commons', file: 'Brooklyn_Museum_-_Sunset_at_Sea_-_Thomas_Moran_-_overall.jpg' },
      { title: 'Green River, Wyoming', year: '1883', source: 'commons', file: 'Green_River,_Wyoming_by_Thomas_Moran,_1883.jpg' },
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
    name: 'Louis Rémy Mignot',
    works: [
      { title: 'Solitude', year: '1855', source: 'commons', file: 'Louis_Rémy_Mignot_Solitude.jpg', note: 'only modest res (1107×613)' },
      { title: 'Niagara', year: '1866', source: 'local', image: '/artwork/mignot-niagara', note: 'self-hosted (not on Commons)' },
    ],
  },
  {
    name: 'Andreas Achenbach',
    works: [
      { title: 'Clearing Up—Coast of Sicily', year: '1847', source: 'commons', file: 'Andreas_Achenbach_-_Clearing_Up—Coast_of_Sicily_-_Walters_37116.jpg' },
    ],
  },
  {
    name: 'Vilhelm Hammershøi',
    works: [
      { title: 'Interior with Woman at Piano, Strandgade 30', year: '1901', source: 'commons', file: 'Vilhelm_Hammershøi,_Stue_med_kvinde_ved_klaver,_Strandgade_30,_1901.jpg' },
      { title: 'Interior with a Woman Seen from Behind', year: 'c. 1904', source: 'local', image: '/artwork/hammershoi-woman-from-behind', note: 'self-hosted' },
    ],
  },
  {
    name: 'Gustav Klimt',
    works: [
      { title: 'The Three Ages of Woman', year: '1905', source: 'commons', file: 'The_Three_Ages_of_Woman.jpg' },
      { title: 'The Kiss', year: '1907–08', source: 'commons', file: 'The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg' },
      { title: 'Death and Life', year: '1908–1915', source: 'commons', file: 'Gustav_Klimt_-_Death_and_Life_-_Google_Art_Project.jpg', note: 'Google Art Project file, not the ~419MB scan' },
    ],
  },
  {
    name: 'Thomas Cole',
    works: [
      {
        title: 'The Course of Empire', year: '1833–36', source: 'commons', link: 'https://en.wikipedia.org/wiki/The_Course_of_Empire_(paintings)',
        panels: [
          { file: 'Cole_Thomas_The_Course_of_Empire_The_Savage_State_1836.jpg', title: 'The Savage State' },
          { file: 'Cole_Thomas_The_Course_of_Empire_The_Arcadian_or_Pastoral_State_1836.jpg', title: 'The Arcadian or Pastoral State' },
          { file: 'Cole_Thomas_The_Consummation_The_Course_of_the_Empire_1836.jpg', title: 'The Consummation' },
          { file: 'Cole_Thomas_The_Course_of_Empire_Destruction_1836.jpg', title: 'Destruction' },
          { file: 'Cole_Thomas_The_Course_of_Empire_Desolation_1836.jpg', title: 'Desolation' },
        ],
      },
      {
        title: 'The Voyage of Life', year: '1842', source: 'commons', link: 'https://en.wikipedia.org/wiki/The_Voyage_of_Life',
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
    name: 'Auguste Rodin',
    works: [
      { title: 'The Kiss', year: '1882', source: 'commons', file: 'The_Kiss.JPG' },
      { title: 'The Gates of Hell', year: '1880–1917', source: 'commons', file: 'Gates_of_Hell_sculpture_by_Rodin_surrounded_by_Adam_and_Eve.JPG', note: 'Stanford/Cantor cast' },
    ],
  },
  {
    name: 'Salvador Dalí',
    works: [
      { title: 'The Persistence of Memory', year: '1931', source: 'link', image: '/artwork/dali-persistence-of-memory' },
      { title: 'Swans Reflecting Elephants', year: '1937', source: 'link', image: '/artwork/dali-swans-reflecting-elephants' },
    ],
  },
  {
    name: 'M.C. Escher',
    works: [
      { title: 'Waterfall', year: '1961', source: 'link', image: '/artwork/escher-waterfall' },
      { title: 'Relativity', year: '1953', source: 'link', image: '/artwork/escher-relativity' },
      { title: 'Reptiles', year: '1943', source: 'link', image: '/artwork/escher-reptiles' },
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
    name: 'René Magritte',
    works: [
      { title: 'The Lovers', year: '1928', source: 'link', search: 'The Lovers Magritte painting', image: '/artwork/magritte-the-lovers' },
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
    name: 'Arnold Böcklin',
    works: [
      { title: 'Isle of the Dead', year: '1883', source: 'commons', file: 'Arnold_Böcklin_-_Die_Toteninsel_III_(Alte_Nationalgalerie,_Berlin).jpg', note: 'Berlin version' },
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
    name: 'William-Adolphe Bouguereau',
    works: [
      { title: 'Dante and Virgil in Hell', year: '1850', source: 'commons', file: 'William_Bouguereau_-_Dante_and_Virgile_-_Google_Art_Project_2.jpg' },
      { title: "Les Murmures de l'Amour", year: '1889', source: 'local', image: '/artwork/bouguereau-murmures-de-l-amour', note: 'self-hosted (not on Commons)' },
      { title: 'Le Fardeau Agréable', year: '1895', source: 'commons', file: 'William-Adolphe_Bouguereau_(1825-1905)_-_Not_Too_Much_To_Carry_(1895).jpg' },
    ],
  },
  {
    name: 'Zdzisław Beksiński',
    works: [
      { title: 'Untitled — great tree over a red plain', source: 'link', search: 'Zdzisław Beksiński', image: '/artwork/beksinski-tree' },
      { title: 'Untitled — colossal head over a ruined city', source: 'link', search: 'Zdzisław Beksiński', image: '/artwork/beksinski-head' },
      { title: 'Untitled — two shrouded figures in an ochre void', source: 'link', search: 'Zdzisław Beksiński', image: '/artwork/beksinski-figures' },
      { title: 'Untitled — archway', source: 'link', search: 'Zdzisław Beksiński', image: '/artwork/beksinski-arch' },
      { title: 'Untitled — crouching figure', source: 'link', search: 'Zdzisław Beksiński', image: '/artwork/beksinski-crouching-figure' },
      { title: 'Untitled — rainbow', source: 'link', search: 'Zdzisław Beksiński', image: '/artwork/beksinski-rainbow' },
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
    ],
  },
  {
    name: 'Gustave Doré',
    works: [
      {
        title: 'The Rime of the Ancient Mariner', year: '1876', source: 'commons',
        link: 'https://commons.wikimedia.org/wiki/Category:The_Rime_of_the_Ancient_Mariner_by_Gustave_Dor%C3%A9',
        note: "Doré's wood engravings for Coleridge's poem; pinned plates from Commons. More exist in the category — add files here to show them.",
        panels: [
          { file: 'Rime_of_the_Ancient_Mariner-Albatross-Dore.jpg', title: 'The Albatross' },
          { file: 'Dore-I_Watched_the_Water-Snakes.jpg', title: 'I Watched the Water-Snakes' },
          { file: 'Gustave_Dore_Ancient_Mariner_Illustration.jpg', title: '' },
        ],
      },
    ],
  },
];

// SELF-HOSTED slots — drop a file with one of these base names (any of
// .jpg/.jpeg/.png/.webp) into public/artwork/ and it appears automatically.
// In-copyright works keep their link-out card until the file lands, then upgrade
// to the image; the others are simply hidden until added.
//   beksinski-tree, beksinski-head, beksinski-figures, beksinski-arch, beksinski-crouching-figure, beksinski-rainbow
//   escher-waterfall, escher-relativity, escher-reptiles
//   dali-persistence-of-memory, dali-swans-reflecting-elephants
//   magritte-the-lovers
//   parrish-old-white-birch, parrish-stars, parrish-ecstasy
//   friedrich-coastal-landscape-cross-statue, friedrich-ruins
//   church-niagara, church-cotopaxi
//   arkhip-dnieper, arkhip-red, arkhip-rain
//   hammershoi-woman-from-behind
//   mignot-niagara
//   bouguereau-murmures-de-l-amour
