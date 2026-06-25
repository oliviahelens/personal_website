// Film & TV posters, pulled at build time from The Movie Database (TMDB).
//
// Like artwork.ts and goodreads.ts, this fetches on build and fails soft: a
// title that doesn't resolve (or an upstream hiccup) simply renders without a
// cover instead of breaking the page.
//
// TMDB needs a free API token, read from the TMDB_READ_TOKEN env var (set as a
// GitHub Actions secret). TMDB returns search results ranked by popularity, so
// we prefer an exact-title match and otherwise take the most popular hit — that
// way "Invincible" resolves to the show, not a same-named anime, and "Top Gun"
// resolves to the 1986 film rather than "Top Gun: Maverick".
//
//   https://api.themoviedb.org/3/search/movie?query=<title>
//   https://api.themoviedb.org/3/search/tv?query=<title>
//
// `poster_path` is a relative path; prefix it with the image CDN and a size.

const TMDB = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/w500';
const TOKEN = process.env.TMDB_READ_TOKEN;

export type WatchMedia = 'movie' | 'tv';

export interface WatchItem {
  title: string;
  cover: string | null; // poster URL, or null when nothing resolved
}

interface TmdbResult {
  title?: string; // movies
  name?: string; // tv
  original_title?: string;
  original_name?: string;
  poster_path?: string | null;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function getJson<T>(url: string, attempt = 0): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/json',
        'User-Agent': 'oliviahelens-watching/1.0 (https://oliviahelens.com)',
      },
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

const norm = (s: string) => s.trim().toLowerCase();

// Pick the best result: an exact title match if one exists (TMDB already sorts
// by popularity, so the first exact match is the most popular one), otherwise
// fall back to the top hit.
function pick(results: TmdbResult[], title: string): TmdbResult | undefined {
  const want = norm(title);
  const exact = results.find((r) => {
    const names = [r.title, r.name, r.original_title, r.original_name].filter(Boolean) as string[];
    return names.some((n) => norm(n) === want);
  });
  return exact ?? results[0];
}

async function resolveCover(title: string, media: WatchMedia): Promise<WatchItem> {
  const url = `${TMDB}/search/${media}?query=${encodeURIComponent(title)}&include_adult=false`;
  const res = await getJson<{ results?: TmdbResult[] }>(url);
  const best = res?.results?.length ? pick(res.results, title) : undefined;
  const path = best?.poster_path;
  return { title, cover: path ? `${IMG}${path}` : null };
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
}

// Resolve a poster for every film and TV title, capping concurrency and keeping
// the curated order. Titles that don't resolve come back with `cover: null`.
export async function fetchCovers(
  films: string[],
  television: string[],
): Promise<{ films: WatchItem[]; television: WatchItem[] }> {
  if (!TOKEN) {
    console.warn('[watching] TMDB_READ_TOKEN not set — posters blank, titles still render');
    return {
      films: films.map((title) => ({ title, cover: null })),
      television: television.map((title) => ({ title, cover: null })),
    };
  }

  const jobs: Job[] = [
    ...films.map((title) => ({ title, media: 'movie' as const })),
    ...television.map((title) => ({ title, media: 'tv' as const })),
  ];
  const settled = await mapPool(jobs, 4, (j) => resolveCover(j.title, j.media));

  const misses = settled.filter((s) => !s.cover).map((s) => s.title);
  console.log(
    `[watching] resolved ${settled.length - misses.length}/${settled.length} posters` +
      (misses.length ? `; no match: ${misses.join(', ')}` : ''),
  );

  return {
    films: settled.slice(0, films.length),
    television: settled.slice(films.length),
  };
}
