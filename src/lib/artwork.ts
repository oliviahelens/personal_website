// Favorite artworks, pulled at build time from open collections.
//
// This mirrors the Goodreads integration in goodreads.ts: we fetch on build and
// fail soft, so an upstream hiccup never breaks the page. The curated list lives
// in favorites.ts (artists, each with 1–4 works); this file turns each work into
// a displayable Artwork from one of these sources:
//
//   'commons'   — a Wikimedia Commons File: title, resolved via the Commons API
//                 to a sized thumbnail (so we never hot-link a 400MB original).
//   'met'/'aic' — a museum object, by id or search query (public domain).
//   'wikipedia' — a work's Wikipedia article lead image.
//   'direct'    — an exact image URL hosted elsewhere; nothing fetched at build.
//   'local'     — a self-hosted image under /public (in-copyright works); shown
//                 once the file exists.
//
// A work flagged `pending` (an unpinned Commons Category or a `resolve:` hint)
// is tracked in favorites.ts but skipped here until a concrete file is filled in.

import { existsSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';

export interface Artwork {
  title: string;
  artist: string;
  date: string;
  image: string;
  link: string; // page for the work; empty means render without a link
  source: string; // human label, e.g. "The Met"
  panels?: { image: string; title: string }[]; // multi-panel set → sub-grid
}

export type Source = 'commons' | 'met' | 'aic' | 'wikipedia' | 'direct' | 'local' | 'link';

export interface Panel {
  file: string; // Commons File: title
  title?: string;
}

export interface WorkRef {
  title: string;
  year?: string;
  source: Source;
  file?: string; // commons File: title
  search?: string; // commons file search — best-effort top hit, review on preview
  category?: string; // commons Category: for a multi-panel set
  id?: number; // met / aic object id
  query?: string; // met / aic search text
  page?: string; // wikipedia article title
  image?: string; // direct URL, or /public path for local
  panels?: Panel[]; // commons multi-panel set
  link?: string;
  note?: string; // curatorial note, not rendered
  pending?: boolean; // exact file not pinned yet — tracked but not rendered
}

export interface ArtistRef {
  name: string;
  works: WorkRef[];
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Wikimedia rate-limits bursts and wants a descriptive User-Agent, so we retry
// on 429/503 with backoff and keep build-time concurrency low (see mapPool).
async function getJson<T>(url: string, attempt = 0): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'oliviahelens-gallery/1.0 (https://oliviahelens.com)' },
      signal: AbortSignal.timeout(20000),
    });
    if ((res.status === 429 || res.status === 503) && attempt < 4) {
      await sleep(700 * 2 ** attempt);
      return getJson<T>(url, attempt + 1);
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    if (attempt < 2) {
      await sleep(500 * 2 ** attempt);
      return getJson<T>(url, attempt + 1);
    }
    console.warn(`[artwork] fetch failed for ${url}: ${err}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Wikimedia Commons — resolve a File: title to a sized thumbnail + its file page.
// https://commons.wikimedia.org/w/api.php
// ---------------------------------------------------------------------------

const COMMONS = 'https://commons.wikimedia.org/w/api.php';

interface ImageInfo {
  thumburl?: string;
  url?: string;
  descriptionurl?: string;
}

interface ImageInfoPage {
  index?: number; // generator queries add a rank
  imageinfo?: ImageInfo[];
}

type CommonsResp = { query?: { pages?: Record<string, ImageInfoPage> } };

// Pages come back keyed by id; sort by the generator `index` so the top hit wins.
function rankedPages(res: CommonsResp | null): ImageInfoPage[] {
  return Object.values(res?.query?.pages ?? {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
}

function firstImage(pages: ImageInfoPage[]): { image: string; link: string } | null {
  const info = pages[0]?.imageinfo?.[0];
  const image = info?.thumburl || info?.url;
  return image ? { image, link: info?.descriptionurl || '' } : null;
}

async function commonsThumb(file: string, width: number): Promise<{ image: string; link: string } | null> {
  const params = new URLSearchParams({
    action: 'query', format: 'json', redirects: '1',
    prop: 'imageinfo', iiprop: 'url', iiurlwidth: String(width),
    titles: file.startsWith('File:') ? file : `File:${file}`,
  });
  return firstImage(rankedPages(await getJson<CommonsResp>(`${COMMONS}?${params}`)));
}

// Best-effort: the top file-namespace search hit on Commons. For works whose
// exact file wasn't pinned — these should be eyeballed on the preview build.
async function commonsSearch(query: string, width: number): Promise<{ image: string; link: string } | null> {
  const params = new URLSearchParams({
    action: 'query', format: 'json',
    generator: 'search', gsrsearch: query, gsrnamespace: '6', gsrlimit: '1',
    prop: 'imageinfo', iiprop: 'url', iiurlwidth: String(width),
  });
  return firstImage(rankedPages(await getJson<CommonsResp>(`${COMMONS}?${params}`)));
}

// The file members of a Commons category, as panels for a multi-panel set.
async function commonsCategoryPanels(category: string, width: number): Promise<{ image: string; title: string }[]> {
  const params = new URLSearchParams({
    action: 'query', format: 'json',
    generator: 'categorymembers', gcmtype: 'file', gcmlimit: '8',
    gcmtitle: category.startsWith('Category:') ? category : `Category:${category}`,
    prop: 'imageinfo', iiprop: 'url', iiurlwidth: String(width),
  });
  return rankedPages(await getJson<CommonsResp>(`${COMMONS}?${params}`))
    .map((p) => p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url)
    .filter((img): img is string => !!img)
    .map((image) => ({ image, title: '' }));
}

async function resolveCommons(work: WorkRef, artist: string): Promise<Artwork | null> {
  const base = { title: work.title, artist, date: work.year || '', source: 'Wikimedia Commons' };

  // Multi-panel set — from a category, or from explicit panel files.
  if (work.category || work.panels?.length) {
    const panels = work.category
      ? await commonsCategoryPanels(work.category, 700)
      : (
          await Promise.all(
            (work.panels ?? []).map(async (p) => {
              const r = await commonsThumb(p.file, 700);
              return r ? { image: r.image, title: p.title || '' } : null;
            }),
          )
        ).filter((x): x is { image: string; title: string } => x !== null);
    if (!panels.length) return null;
    return { ...base, image: panels[0].image, link: work.link || '', panels };
  }

  // A single pinned file, else a best-effort search.
  const r = work.file
    ? await commonsThumb(work.file, 1000)
    : work.search
      ? await commonsSearch(work.search, 1000)
      : null;
  return r ? { ...base, image: r.image, link: work.link || r.link } : null;
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
  objectURL: string;
}

function metToArtwork(o: MetObject, work: WorkRef, artist: string): Artwork | null {
  const image = o.primaryImageSmall || o.primaryImage;
  if (!image) return null;
  return {
    title: o.title || work.title,
    artist: o.artistDisplayName || artist,
    date: o.objectDate || work.year || '',
    image,
    link: o.objectURL || `https://www.metmuseum.org/art/collection/search/${o.objectID}`,
    source: 'The Met',
  };
}

async function resolveMet(work: WorkRef, artist: string): Promise<Artwork | null> {
  if (work.id) {
    const o = await getJson<MetObject>(`${MET}/objects/${work.id}`);
    return o ? metToArtwork(o, work, artist) : null;
  }
  const q = encodeURIComponent([work.query, artist].filter(Boolean).join(' '));
  const search = await getJson<{ objectIDs: number[] | null }>(`${MET}/search?hasImages=true&q=${q}`);
  for (const id of (search?.objectIDs ?? []).slice(0, 5)) {
    const o = await getJson<MetObject>(`${MET}/objects/${id}`);
    if (o && o.isPublicDomain) {
      const art = metToArtwork(o, work, artist);
      if (art) return art;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// The Art Institute of Chicago — https://api.artic.edu/docs/
// ---------------------------------------------------------------------------

const AIC = 'https://api.artic.edu/api/v1/artworks';
const AIC_FIELDS = 'id,title,artist_title,date_display,image_id,is_public_domain';

interface AicArtwork {
  id: number;
  title: string;
  artist_title: string | null;
  date_display: string | null;
  image_id: string | null;
  is_public_domain: boolean;
}

function aicToArtwork(a: AicArtwork, work: WorkRef, artist: string): Artwork | null {
  if (!a.image_id) return null;
  return {
    title: a.title || work.title,
    artist: a.artist_title || artist,
    date: a.date_display || work.year || '',
    image: `https://www.artic.edu/iiif/2/${a.image_id}/full/1000,/0/default.jpg`,
    link: `https://www.artic.edu/artworks/${a.id}`,
    source: 'Art Institute of Chicago',
  };
}

async function resolveAic(work: WorkRef, artist: string): Promise<Artwork | null> {
  if (work.id) {
    const res = await getJson<{ data: AicArtwork }>(`${AIC}/${work.id}?fields=${AIC_FIELDS}`);
    return res?.data ? aicToArtwork(res.data, work, artist) : null;
  }
  const q = encodeURIComponent([work.query, artist].filter(Boolean).join(' '));
  const res = await getJson<{ data: AicArtwork[] }>(`${AIC}/search?q=${q}&fields=${AIC_FIELDS}&limit=5`);
  for (const a of res?.data ?? []) {
    if (a.is_public_domain && a.image_id) return aicToArtwork(a, work, artist);
  }
  return null;
}

// ---------------------------------------------------------------------------
// Wikipedia — lead image of a work's article (hosted on Wikimedia Commons).
// ---------------------------------------------------------------------------

const WIKI = 'https://en.wikipedia.org/w/api.php';

async function resolveWikipedia(work: WorkRef, artist: string): Promise<Artwork | null> {
  const article = work.page || work.query;
  if (!article) return null;
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    redirects: '1',
    prop: 'pageimages|info',
    inprop: 'url',
    piprop: 'thumbnail|original',
    pithumbsize: '1000',
    titles: article,
  });
  const res = await getJson<{
    query?: { pages?: Record<string, { title: string; fullurl?: string; thumbnail?: { source: string }; original?: { source: string } }> };
  }>(`${WIKI}?${params}`);
  const page = Object.values(res?.query?.pages ?? {})[0];
  const image = page?.thumbnail?.source || page?.original?.source;
  if (!image) return null;
  return {
    title: work.title || page?.title || article,
    artist,
    date: work.year || '',
    image,
    link: page?.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(article)}`,
    source: 'Wikimedia Commons',
  };
}

// ---------------------------------------------------------------------------
// Direct URL and local self-hosted file.
// ---------------------------------------------------------------------------

function resolveDirect(work: WorkRef, artist: string): Artwork | null {
  if (!work.image) return null;
  return {
    title: work.title,
    artist,
    date: work.year || '',
    image: work.image,
    link: work.link || '',
    source: '',
  };
}

function resolveLocal(work: WorkRef, artist: string): Artwork | null {
  if (!work.image) return null;
  const file = resolvePath(process.cwd(), 'public', work.image.replace(/^\/+/, ''));
  if (!existsSync(file)) {
    console.warn(`[artwork] local image not added yet, skipping: ${work.image} (${artist})`);
    return null;
  }
  return {
    title: work.title,
    artist,
    date: work.year || '',
    image: work.image,
    link: work.link || '',
    source: '',
  };
}

// Link-out — an in-copyright work we can't host. Show a card pointing to the
// work (defaults to a Wikipedia search that resolves to the article), with no
// embedded image. Swap to 'local' once a licensed image is added.
function resolveLink(work: WorkRef, artist: string): Artwork {
  const query = work.search || [work.title, artist].filter(Boolean).join(' ');
  const link =
    work.link || `https://en.wikipedia.org/wiki/Special:Search?go=Go&search=${encodeURIComponent(query)}`;
  return { title: work.title, artist, date: work.year || '', image: '', link, source: '' };
}

// ---------------------------------------------------------------------------

async function resolveWork(work: WorkRef, artist: string): Promise<Artwork | null> {
  if (work.pending) return null; // tracked in favorites.ts, not ready to show
  try {
    switch (work.source) {
      case 'commons':
        return await resolveCommons(work, artist);
      case 'met':
        return await resolveMet(work, artist);
      case 'aic':
        return await resolveAic(work, artist);
      case 'wikipedia':
        return await resolveWikipedia(work, artist);
      case 'direct':
        return resolveDirect(work, artist);
      case 'local':
        return resolveLocal(work, artist);
      case 'link':
        return resolveLink(work, artist);
    }
  } catch (err) {
    console.warn(`[artwork] could not resolve "${work.title}" (${artist}): ${err}`);
    return null;
  }
}

// Run `fn` over `items` with at most `limit` in flight at once, preserving order.
async function mapPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

// Resolve every work, drop the ones that didn't come back, and keep the curated
// order. Concurrency is capped so we don't burst the Commons API (which rate-
// limits and would otherwise fail the whole batch at once).
export async function fetchGallery(artists: ArtistRef[]): Promise<Artwork[]> {
  const jobs = artists.flatMap((artist) => artist.works.map((work) => ({ work, artist: artist.name })));
  const settled = await mapPool(jobs, 4, ({ work, artist }) => resolveWork(work, artist));
  return settled.filter((a): a is Artwork => a !== null);
}
