import type { FavoriteRef } from './artwork';

// Olivia's favorite artworks, one signature piece per artist.
//
// HOW THIS RESOLVES: each entry is matched against an open-access museum API at
// build time. Prefer an exact `id` once we've confirmed the piece (it's the most
// reliable); a `query` is searched and the first public-domain match with an
// image wins. Swap the `query` for your actual favorite piece per artist, or
// pin an `id` to lock the exact object.
//
// SCOPE: historical artists only for now (living artists are deferred). The
// auto-pull approach can only surface works a museum has digitized AND released
// to the public domain — see the DEFERRED block at the bottom for the artists
// from your list that can't come through this path and need a decision.

export const HISTORICAL: FavoriteRef[] = [
  { artist: 'Frederic Edwin Church', source: 'met', query: 'Heart of the Andes' },
  { artist: 'Albert Bierstadt', source: 'met', query: 'The Rocky Mountains, Lander’s Peak' },
  { artist: 'Thomas Cole', source: 'met', query: 'View from Mount Holyoke Northampton Massachusetts after a Thunderstorm The Oxbow' },
  { artist: 'Gustav Klimt', source: 'met', query: 'Mäda Primavesi' },
  { artist: 'Pierre-Auguste Cot', source: 'met', query: 'The Storm' },
  { artist: 'Caspar David Friedrich', source: 'met', query: 'Two Men Contemplating the Moon' },
  { artist: 'Arnold Böcklin', source: 'met', query: 'Island of the Dead' },
  { artist: 'Caravaggio', source: 'met', query: 'The Musicians' },
  { artist: 'Claude Monet', source: 'met', query: 'Bridge over a Pond of Water Lilies' },
  { artist: 'Gian Lorenzo Bernini', source: 'met', query: 'Bacchanal: A Faun Teased by Children' },
  { artist: 'Auguste Rodin', source: 'met', query: 'The Hand of God' },
  { artist: 'Louis Rémy Mignot', source: 'met', query: 'Landscape in Ecuador' },
  { artist: 'Andreas Achenbach', source: 'met', query: 'Clearing Up—Coast of Sicily' },
  { artist: 'William-Adolphe Bouguereau', source: 'met', query: 'Breton Brother and Sister' },
];

// ---------------------------------------------------------------------------
// DEFERRED — historical artists from your list that the open-access Met / AIC
// APIs probably can't serve. Grouped by reason so we can decide what to do.
//
// (A) Still under copyright — open museums legally can't release a free image.
//     Need a licensed/self-hosted image or an outbound link instead of an embed.
//       - Zdzisław Beksiński   (d. 2005)
//       - M.C. Escher           (d. 1972, rights tightly controlled)
//       - Salvador Dalí         (d. 1989)
//       - René Magritte         (d. 1967)
//
// (B) Public domain, but the signature work lives outside the Met / AIC, so
//     auto-pull finds nothing. Great candidates for a Wikimedia Commons source
//     (high-res PD scans) once we add that path.
//       - Ivan Aivazovsky       (e.g. The Ninth Wave — State Russian Museum)
//       - Ivan Shishkin         (mostly Tretyakov Gallery)
//       - Giovanni Strazza      (The Veiled Virgin — convent, Newfoundland)
//       - Maxfield Parrish      (limited open-access holdings)
//       - Alphonse Mucha        (posters; thin open-access coverage)
//       - John Martin           (apocalyptic paintings mostly at the Tate)
//       - Thomas Moran          (some at the Met — promote up if a query hits)
//       - Zdzisław Beksiński / others above also fail here, but for reason (A)
// ---------------------------------------------------------------------------
