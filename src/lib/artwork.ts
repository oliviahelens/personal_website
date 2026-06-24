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

export type Source = 'commons' | 'met' | 'aic' | 'wikipedia' | 'direct' | 'local';

export interface Panel {
  file: string; // Commons File: title
  title?: string;
}

export interface WorkRef {
  title: string;
  year?: string;
  source: Source;
  file?: string; // commons File: title
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
// Wikimedia Commons — resolve a File: title to a sized thumbnail + its file page.
// https://commons.wikimedia.org/w/api.php
// ---------------------------------------------------------------------------

const COMMONS = 'https://commons.wikimedia.org/w/api.php';

interface ImageInfo {
  thumburl?: string;
  url?: string;
  descriptionurl?: string;
}

async function commonsThumb(file: string, width: number): Promise<{ image: string; link: string } | null> {
  const title = file.startsWith('File:') ? file : `File:${file}`;
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    redirects: '1',
    prop: 'imageinfo',
    iiprop: 'url',
    iiurlwidth: String(width),
    titles: title,
  });
  const res = await getJson<{ query?: { pages?: Record<string, { imageinfo?: ImageInfo[] }> } }>(
    `${COMMONS}?${params}`,
  );
  const info = Object.values(res?.query?.pages ?? {})[0]?.imageinfo?.[0];
  const image = info?.thumburl || info?.url;
  if (!image) return null;
  return { image, link: info?.descriptionurl || '' };
}

async function resolveCommons(work: WorkRef, artist: string): Promise<Artwork | null> {
  // Multi-panel set: resolve each panel to its own thumbnail for a sub-grid.
  if (work.panels?.length) {
    const panels: { image: string; title: string }[] = [];
    for (const p of work.panels) {
      const r = await commonsThumb(p.file, 700);
      if (r) panels.push({ image: r.image, title: p.title || '' });
    }
    if (!panels.length) return null;
    return {
      title: work.title,
      artist,
      date: work.year || '',
      image: panels[0].image,
      link: work.link || '',
      source: 'Wikimedia Commons',
      panels,
    };
  }

  if (!work.file) return null;
  const r = await commonsThumb(work.file, 1000);
  if (!r) return null;
  return {
    title: work.title,
    artist,
    date: work.year || '',
    image: r.image,
    link: work.link || r.link,
    source: 'Wikimedia Commons',
  };
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
    }
  } catch (err) {
    console.warn(`[artwork] could not resolve "${work.title}" (${artist}): ${err}`);
    return null;
  }
}

// Resolve every work across every artist in parallel, drop the ones that didn't
// come back, and keep the curated order (artist order, works within each artist).
export async function fetchGallery(artists: ArtistRef[]): Promise<Artwork[]> {
  const jobs: Promise<Artwork | null>[] = [];
  for (const artist of artists) {
    for (const work of artist.works) jobs.push(resolveWork(work, artist.name));
  }
  const settled = await Promise.all(jobs);
  return settled.filter((a): a is Artwork => a !== null);
}
