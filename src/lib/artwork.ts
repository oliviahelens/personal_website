// Favorite artworks, pulled at build time from open-access museum collections.
//
// This mirrors the Goodreads integration in goodreads.ts: we fetch on build and
// fail soft to an empty list, so a museum API hiccup never breaks the page. The
// curated list of pieces lives in favorites.ts; this file just knows how to turn
// a reference (a museum + an id or search query) into a displayable Artwork.
//
// Two open-access sources are supported, both free and key-less:
//   - 'met' — The Metropolitan Museum of Art Collection API
//   - 'aic' — The Art Institute of Chicago API
// Both only expose works the museum has digitized and released to the public
// domain, which is why 20th-century / in-copyright artists can't come through
// here and need a different image source.

export interface Artwork {
  title: string;
  artist: string;
  date: string; // display date, e.g. "1859" or "1830/33"
  image: string; // display image URL, hot-linked from the museum CDN
  link: string; // museum object page
  source: string; // human label, e.g. "The Met"
  medium: string;
  credit: string;
}

export type Source = 'met' | 'aic';

export interface FavoriteRef {
  artist: string; // used for display fallback and as a search hint
  source: Source;
  id?: number; // exact museum object id — most reliable when known
  query?: string; // search text (usually a title) when no id is known
  note?: string; // optional curatorial note, not rendered
}

const SOURCE_LABEL: Record<Source, string> = {
  met: 'The Met',
  aic: 'Art Institute of Chicago',
};

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; oliviahelens.com/1.0)' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[artwork] fetch failed for ${url}: ${err}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// The Metropolitan Museum of Art
// https://metmuseum.github.io/
// ---------------------------------------------------------------------------

const MET = 'https://collectionapi.metmuseum.org/public/collection/v1';

interface MetObject {
  objectID: number;
  isPublicDomain: boolean;
  primaryImage: string;
  primaryImageSmall: string;
  title: string;
  artistDisplayName: string;
  objectDate: string;
  medium: string;
  creditLine: string;
  objectURL: string;
}

function metToArtwork(o: MetObject, ref: FavoriteRef): Artwork | null {
  const image = o.primaryImageSmall || o.primaryImage;
  if (!image) return null; // nothing to show
  return {
    title: o.title || ref.query || 'Untitled',
    artist: o.artistDisplayName || ref.artist,
    date: o.objectDate || '',
    image,
    link: o.objectURL || `https://www.metmuseum.org/art/collection/search/${o.objectID}`,
    source: SOURCE_LABEL.met,
    medium: o.medium || '',
    credit: o.creditLine || '',
  };
}

async function resolveMet(ref: FavoriteRef): Promise<Artwork | null> {
  if (ref.id) {
    const o = await getJson<MetObject>(`${MET}/objects/${ref.id}`);
    return o ? metToArtwork(o, ref) : null;
  }

  const q = encodeURIComponent([ref.query, ref.artist].filter(Boolean).join(' '));
  const search = await getJson<{ objectIDs: number[] | null }>(
    `${MET}/search?hasImages=true&q=${q}`,
  );
  const ids = (search?.objectIDs ?? []).slice(0, 5); // best few by relevance
  for (const id of ids) {
    const o = await getJson<MetObject>(`${MET}/objects/${id}`);
    // Prefer a public-domain object that actually has an image we can embed.
    if (o && o.isPublicDomain) {
      const art = metToArtwork(o, ref);
      if (art) return art;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// The Art Institute of Chicago
// https://api.artic.edu/docs/
// ---------------------------------------------------------------------------

const AIC = 'https://api.artic.edu/api/v1/artworks';
const AIC_FIELDS = 'id,title,artist_title,date_display,image_id,is_public_domain,medium_display,credit_line';

interface AicArtwork {
  id: number;
  title: string;
  artist_title: string | null;
  date_display: string | null;
  image_id: string | null;
  is_public_domain: boolean;
  medium_display: string | null;
  credit_line: string | null;
}

function aicImage(imageId: string): string {
  // IIIF endpoint; 600px wide is plenty for the grid and crisp on retina.
  return `https://www.artic.edu/iiif/2/${imageId}/full/600,/0/default.jpg`;
}

function aicToArtwork(a: AicArtwork, ref: FavoriteRef): Artwork | null {
  if (!a.image_id) return null;
  return {
    title: a.title || ref.query || 'Untitled',
    artist: a.artist_title || ref.artist,
    date: a.date_display || '',
    image: aicImage(a.image_id),
    link: `https://www.artic.edu/artworks/${a.id}`,
    source: SOURCE_LABEL.aic,
    medium: a.medium_display || '',
    credit: a.credit_line || '',
  };
}

async function resolveAic(ref: FavoriteRef): Promise<Artwork | null> {
  if (ref.id) {
    const res = await getJson<{ data: AicArtwork }>(`${AIC}/${ref.id}?fields=${AIC_FIELDS}`);
    return res?.data ? aicToArtwork(res.data, ref) : null;
  }

  const q = encodeURIComponent([ref.query, ref.artist].filter(Boolean).join(' '));
  // Search returns the requested fields inline, so one request resolves a query.
  const res = await getJson<{ data: AicArtwork[] }>(
    `${AIC}/search?q=${q}&fields=${AIC_FIELDS}&limit=5`,
  );
  for (const a of res?.data ?? []) {
    if (a.is_public_domain && a.image_id) return aicToArtwork(a, ref);
  }
  return null;
}

// ---------------------------------------------------------------------------

async function resolve(ref: FavoriteRef): Promise<Artwork | null> {
  try {
    return ref.source === 'met' ? await resolveMet(ref) : await resolveAic(ref);
  } catch (err) {
    console.warn(`[artwork] could not resolve "${ref.query ?? ref.id}" (${ref.artist}): ${err}`);
    return null;
  }
}

// Resolve every favorite in parallel, drop the ones that didn't come back, and
// keep the curated order. A piece that fails to resolve simply isn't shown.
export async function fetchGallery(refs: FavoriteRef[]): Promise<Artwork[]> {
  const settled = await Promise.all(refs.map(resolve));
  return settled.filter((a): a is Artwork => a !== null);
}
