// Film & TV posters, pulled at build time from the iTunes Search API.
//
// Like artwork.ts and goodreads.ts, this fetches on build and fails soft: a
// title that doesn't resolve (or an upstream hiccup) simply renders without a
// cover instead of breaking the page. The iTunes Search API needs no key.
//
//   https://itunes.apple.com/search?term=<title>&media=movie&entity=movie&limit=1
//   https://itunes.apple.com/search?term=<title>&media=tvShow&entity=tvSeason&limit=1
//
// `artworkUrl100` comes back as a 100×100 bounding-box thumbnail; we swap in a
// larger box to get a crisp poster (iTunes preserves the aspect ratio).

const ITUNES = 'https://itunes.apple.com/search';

export type WatchMedia = 'movie' | 'tvShow';

export interface WatchItem {
  title: string;
  cover: string | null; // poster URL, or null when nothing resolved
}

interface ITunesResult {
  artworkUrl100?: string;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function getJson<T>(url: string, attempt = 0): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'oliviahelens-watching/1.0 (https://oliviahelens.com)' },
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
    console.warn(`[watching] fetch failed for ${url}: ${err}`);
    return null;
  }
}

// Upscale iTunes' 100×100 bounding-box thumbnail to a crisp poster. The size is
// a max box; iTunes preserves the poster's aspect ratio within it.
function upscale(artworkUrl100: string): string {
  return artworkUrl100.replace(/\/\d+x\d+bb\./, '/600x600bb.');
}

async function resolveCover(title: string, media: WatchMedia, entity: string): Promise<WatchItem> {
  const params = new URLSearchParams({
    term: title,
    media,
    entity,
    limit: '1',
    country: 'US',
  });
  const res = await getJson<{ results?: ITunesResult[] }>(`${ITUNES}?${params}`);
  const art = res?.results?.[0]?.artworkUrl100;
  return { title, cover: art ? upscale(art) : null };
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

interface Job {
  title: string;
  media: WatchMedia;
  entity: string;
}

// Resolve a poster for every film and TV title, capping concurrency and keeping
// the curated order. Titles that don't resolve come back with `cover: null`.
export async function fetchCovers(
  films: string[],
  television: string[],
): Promise<{ films: WatchItem[]; television: WatchItem[] }> {
  const jobs: Job[] = [
    ...films.map((title) => ({ title, media: 'movie' as const, entity: 'movie' })),
    ...television.map((title) => ({ title, media: 'tvShow' as const, entity: 'tvSeason' })),
  ];
  const settled = await mapPool(jobs, 4, (j) => resolveCover(j.title, j.media, j.entity));
  return {
    films: settled.slice(0, films.length),
    television: settled.slice(films.length),
  };
}
