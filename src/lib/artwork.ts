// Favorite artworks, pulled at build time from open collections.
//
// This mirrors the Goodreads integration in goodreads.ts: we fetch on build and
// fail soft to an empty list, so an upstream hiccup never breaks the page. The
// curated list of pieces lives in favorites.ts; this file just knows how to turn
// a reference into a displayable Artwork from one of these sources:
//
//   'met'       — The Metropolitan Museum of Art Collection API (public domain)
//   'aic'       — The Art Institute of Chicago API (public domain)
//   'wikipedia' — a work's Wikipedia article, for public-domain pieces the two
//                 museums above don't hold (image is hosted on Wikimedia Commons)
//   'direct'    — an exact image URL hosted elsewhere (e.g. a Commons "Original
//                 file" link). The surest way to pin a specific piece or crop:
//                 nothing is fetched at build, the browser loads it at view time.
//   'local'     — a self-hosted image under /public, for in-copyright works we
//                 can't pull a free image for. Skipped until the file exists.

import { existsSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';

export interface Artwork {
  title: string;
  artist: string;
  date: string; // display date, e.g. "1859" or "1830/33"
  image: string; // display image URL
  link: string; // page for the work; empty means render without a link
  source: string; // human label, e.g. "The Met"
  medium: string;
  credit: string;
}

export type Source = 'met' | 'aic' | 'wikipedia' | 'direct' | 'local';

export interface FavoriteRef {
  artist: string; // display artist; also a search hint for the museum sources
  source: Source;

  // met / aic: pin an exact object with `id`, else resolve `query` by search.
  id?: number;
  query?: string;

  // wikipedia: the article title for the work (redirects are followed).
  page?: string;

  // direct: an absolute image URL. local: a path under /public, e.g.
  // '/artwork/escher-relativity.jpg'.
  image?: string;

  // display overrides — authoritative for wikipedia/local, fallback for museums.
  title?: string;
  date?: string;
  link?: string; // optional outbound link for local pieces

  note?: string; // curatorial note, not rendered
}

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
// The Metropolitan Museum of Art — https://metmuseum.github.io/
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
    title: o.title || ref.title || ref.query || 'Untitled',
    artist: o.artistDisplayName || ref.artist,
    date: o.objectDate || ref.date || '',
    image,
    link: o.objectURL || `https://www.metmuseum.org/art/collection/search/${o.objectID}`,
    source: 'The Met',
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
// The Art Institute of Chicago — https://api.artic.edu/docs/
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
    title: a.title || ref.title || ref.query || 'Untitled',
    artist: a.artist_title || ref.artist,
    date: a.date_display || ref.date || '',
    image: aicImage(a.image_id),
    link: `https://www.artic.edu/artworks/${a.id}`,
    source: 'Art Institute of Chicago',
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
// Wikipedia / Wikimedia Commons — for public-domain works not in the museums.
// We ask the MediaWiki API for the article's lead image (the work itself) at a
// grid-friendly size, and link back to the article.
// ---------------------------------------------------------------------------

const WIKI = 'https://en.wikipedia.org/w/api.php';

interface WikiPage {
  title: string;
  fullurl?: string;
  thumbnail?: { source: string };
  original?: { source: string };
}

async function resolveWikipedia(ref: FavoriteRef): Promise<Artwork | null> {
  const article = ref.page || ref.query;
  if (!article) return null;

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    redirects: '1',
    prop: 'pageimages|info',
    inprop: 'url',
    piprop: 'thumbnail|original',
    pithumbsize: '800',
    titles: article,
  });
  const res = await getJson<{ query?: { pages?: Record<string, WikiPage> } }>(
    `${WIKI}?${params}`,
  );
  const page = Object.values(res?.query?.pages ?? {})[0];
  const image = page?.thumbnail?.source || page?.original?.source;
  if (!image) return null;

  return {
    title: ref.title || page?.title || article,
    artist: ref.artist,
    date: ref.date || '',
    image,
    link: page?.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(article)}`,
    source: 'Wikimedia Commons',
    medium: '',
    credit: '',
  };
}

// ---------------------------------------------------------------------------
// Local — a self-hosted image under /public, for in-copyright works. The entry
// stays hidden until the file is actually added, so we can scaffold it now.
// ---------------------------------------------------------------------------

// Direct — an exact image URL hosted elsewhere (e.g. a Wikimedia Commons
// "Original file" link). Nothing to fetch at build; the browser loads it at view
// time, like the museum images. The most reliable way to pin a specific piece.
function resolveDirect(ref: FavoriteRef): Artwork | null {
  if (!ref.image) return null;
  return {
    title: ref.title || 'Untitled',
    artist: ref.artist,
    date: ref.date || '',
    image: ref.image,
    link: ref.link || '',
    source: '',
    medium: '',
    credit: '',
  };
}

function resolveLocal(ref: FavoriteRef): Artwork | null {
  if (!ref.image) return null;
  const file = resolvePath(process.cwd(), 'public', ref.image.replace(/^\/+/, ''));
  if (!existsSync(file)) {
    console.warn(`[artwork] local image not added yet, skipping: ${ref.image} (${ref.artist})`);
    return null;
  }
  return {
    title: ref.title || 'Untitled',
    artist: ref.artist,
    date: ref.date || '',
    image: ref.image,
    link: ref.link || '',
    source: '',
    medium: '',
    credit: '',
  };
}

// ---------------------------------------------------------------------------

async function resolve(ref: FavoriteRef): Promise<Artwork | null> {
  try {
    switch (ref.source) {
      case 'met':
        return await resolveMet(ref);
      case 'aic':
        return await resolveAic(ref);
      case 'wikipedia':
        return await resolveWikipedia(ref);
      case 'direct':
        return resolveDirect(ref);
      case 'local':
        return resolveLocal(ref);
    }
  } catch (err) {
    console.warn(`[artwork] could not resolve a piece for ${ref.artist}: ${err}`);
    return null;
  }
}

// Resolve every favorite in parallel, drop the ones that didn't come back, and
// keep the curated order. A piece that fails to resolve simply isn't shown.
export async function fetchGallery(refs: FavoriteRef[]): Promise<Artwork[]> {
  const settled = await Promise.all(refs.map(resolve));
  return settled.filter((a): a is Artwork => a !== null);
}
