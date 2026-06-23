import type { FavoriteRef } from './artwork';

// Olivia's favorite artworks — one signature piece per artist, in her own list
// order. Historical artists only for now (living artists are deferred).
//
// Each entry resolves at build time from one of four sources (see artwork.ts):
//   met / aic   — public-domain works in those museums. Pin an exact `id` once
//                 you've confirmed the piece; otherwise `query` is searched and
//                 the first public-domain match with an image wins. The titles
//                 below are draft signature works — swap in your favorite.
//   wikipedia   — public-domain works the museums don't hold; `page` is the
//                 work's Wikipedia article (image comes from Wikimedia Commons).
//   local       — in-copyright works. Drop an image you have the rights to at
//                 the `image` path under /public and the entry appears; until
//                 then it's skipped. Expected files:
//                   /public/artwork/beksinski.jpg
//                   /public/artwork/escher-relativity.jpg
//                   /public/artwork/dali-persistence-of-memory.jpg
//                   /public/artwork/magritte-son-of-man.jpg

export const HISTORICAL: FavoriteRef[] = [
  { artist: 'Auguste Rodin', source: 'met', query: 'The Hand of God' },
  { artist: 'Maxfield Parrish', source: 'wikipedia', page: 'Daybreak (painting)', title: 'Daybreak', date: '1922' },
  { artist: 'Zdzisław Beksiński', source: 'local', image: '/artwork/beksinski.jpg', title: 'Untitled', date: '1984' },
  { artist: 'Gustav Klimt', source: 'met', query: 'Mäda Primavesi' },
  { artist: 'Pierre-Auguste Cot', source: 'met', query: 'The Storm' },
  { artist: 'Caspar David Friedrich', source: 'met', query: 'Two Men Contemplating the Moon' },
  { artist: 'Arnold Böcklin', source: 'met', query: 'Island of the Dead' },
  { artist: 'Albert Bierstadt', source: 'met', query: 'The Rocky Mountains, Lander’s Peak' },
  { artist: 'Alphonse Mucha', source: 'wikipedia', page: 'The Slav Epic', title: 'The Slav Epic', date: '1910–1928' },
  { artist: 'Ivan Aivazovsky', source: 'wikipedia', page: 'The Ninth Wave', title: 'The Ninth Wave', date: '1850' },
  { artist: 'Thomas Moran', source: 'wikipedia', page: 'Grand Canyon of the Yellowstone (Moran)', title: 'The Grand Canyon of the Yellowstone', date: '1872' },
  { artist: 'M.C. Escher', source: 'local', image: '/artwork/escher-relativity.jpg', title: 'Relativity', date: '1953' },
  { artist: 'Salvador Dalí', source: 'local', image: '/artwork/dali-persistence-of-memory.jpg', title: 'The Persistence of Memory', date: '1931' },
  { artist: 'René Magritte', source: 'local', image: '/artwork/magritte-son-of-man.jpg', title: 'The Son of Man', date: '1964' },
  { artist: 'Frederic Edwin Church', source: 'met', query: 'Heart of the Andes' },
  { artist: 'Thomas Cole', source: 'met', query: 'View from Mount Holyoke Northampton Massachusetts after a Thunderstorm The Oxbow' },
  { artist: 'Gian Lorenzo Bernini', source: 'met', query: 'Bacchanal: A Faun Teased by Children' },
  { artist: 'John Martin', source: 'wikipedia', page: 'The Great Day of His Wrath', title: 'The Great Day of His Wrath', date: '1851–1853' },
  { artist: 'Caravaggio', source: 'met', query: 'The Musicians' },
  { artist: 'Claude Monet', source: 'met', query: 'Bridge over a Pond of Water Lilies' },
  { artist: 'Ivan Shishkin', source: 'wikipedia', page: 'Morning in a Pine Forest', title: 'Morning in a Pine Forest', date: '1889' },
  { artist: 'Giovanni Strazza', source: 'wikipedia', page: 'The Veiled Virgin', title: 'The Veiled Virgin', date: 'c. 1850s' },
  { artist: 'Louis Rémy Mignot', source: 'met', query: 'Landscape in Ecuador' },
  { artist: 'Andreas Achenbach', source: 'met', query: 'Clearing Up—Coast of Sicily' },
  { artist: 'William-Adolphe Bouguereau', source: 'met', query: 'Breton Brother and Sister' },
];
