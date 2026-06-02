import { XMLParser } from 'fast-xml-parser';

export interface Book {
  title: string;
  author: string;
  link: string;
  cover: string;
  rating: number; // 0–5, 0 means unrated
  readAt: Date | null;
  dateAdded: Date | null;
}

// Goodreads user id, taken from the profile linked on the home page.
const USER_ID = '178728194';

// Goodreads retired its public API, but it still serves per-shelf RSS feeds.
// FEED_KEY is the read-only feed token from the RSS link at the bottom of a
// shelf page (https://www.goodreads.com/review/list_rss/178728194?key=...).
// It only exposes already-public shelf data and is shared across every shelf.
const FEED_KEY = 'JlI_XaSmRXCEneuhEgJTu93-lSW5ZfUgYJYgX6aXBFpGHLXq';

interface FeedOpts {
  perPage?: number;
  page?: number;
  sort?: string; // e.g. 'date_read', 'date_added'
  order?: 'a' | 'd';
}

const feedUrl = (shelf: string, opts: FeedOpts = {}) => {
  const params = new URLSearchParams({ shelf });
  if (opts.perPage) params.set('per_page', String(opts.perPage));
  if (opts.page) params.set('page', String(opts.page));
  if (opts.sort) params.set('sort', opts.sort);
  if (opts.order) params.set('order', opts.order);
  if (FEED_KEY) params.set('key', FEED_KEY);
  return `https://www.goodreads.com/review/list_rss/${USER_ID}?${params}`;
};

const parser = new XMLParser({ ignoreAttributes: false, cdataPropName: '__cdata' });

const text = (v: any): string => {
  if (v == null) return '';
  if (typeof v === 'object') return String(v.__cdata ?? v['#text'] ?? '').trim();
  return String(v).trim();
};

const toDate = (v: any): Date | null => {
  const s = text(v);
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.valueOf()) ? null : d;
};

// Largest cover Goodreads gives us, with fallbacks down to the thumbnail.
const pickCover = (item: any): string =>
  text(item.book_large_image_url) ||
  text(item.book_medium_image_url) ||
  text(item.book_image_url) ||
  text(item.book_small_image_url);

const toBook = (item: any): Book => {
  const bookId = text(item.book_id);
  return {
    title: text(item.title),
    author: text(item.author_name),
    link: bookId
      ? `https://www.goodreads.com/book/show/${bookId}`
      : text(item.link),
    cover: pickCover(item),
    rating: Number(text(item.user_rating)) || 0,
    readAt: toDate(item.user_read_at),
    dateAdded: toDate(item.user_date_added),
  };
};

export function parseShelf(xml: string): Book[] {
  const parsed = parser.parse(xml);
  const raw = parsed?.rss?.channel?.item ?? [];
  const items = Array.isArray(raw) ? raw : [raw];
  return items.filter((it) => it && (it.title || it.book_id)).map(toBook);
}

export async function fetchShelf(shelf: string, opts: FeedOpts = {}): Promise<Book[]> {
  let xml: string;
  try {
    const res = await fetch(feedUrl(shelf, opts), {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; oliviahelens.com/1.0)' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    xml = await res.text();
  } catch (err) {
    console.warn(`[goodreads] fetch failed for shelf "${shelf}", returning empty list: ${err}`);
    return [];
  }

  try {
    return parseShelf(xml);
  } catch (err) {
    console.warn(`[goodreads] parse failed for shelf "${shelf}": ${err}`);
    return [];
  }
}

const byReadDesc = (a: Book, b: Book) =>
  (b.readAt?.valueOf() ?? b.dateAdded?.valueOf() ?? 0) -
  (a.readAt?.valueOf() ?? a.dateAdded?.valueOf() ?? 0);

const byAddedDesc = (a: Book, b: Book) =>
  (b.dateAdded?.valueOf() ?? 0) - (a.dateAdded?.valueOf() ?? 0);

// Goodreads serves at most 100 items per RSS request, so walk the shelf page
// by page until a short (or empty) page, then stop. The early break also means
// a mid-walk fetch failure just ends the list rather than dropping everything.
const PER_PAGE = 100;
const MAX_PAGES = 20; // safety ceiling (~2000 books) against an endless loop

async function fetchShelfAll(
  shelf: string,
  opts: Omit<FeedOpts, 'perPage' | 'page'> = {},
): Promise<Book[]> {
  const all: Book[] = [];
  const seen = new Set<string>();
  for (let page = 1; page <= MAX_PAGES; page++) {
    const batch = await fetchShelf(shelf, { ...opts, perPage: PER_PAGE, page });
    for (const book of batch) {
      const key = book.link || `${book.title}|${book.author}`;
      if (seen.has(key)) continue; // guard against overlap across pages
      seen.add(key);
      all.push(book);
    }
    if (batch.length < PER_PAGE) break; // reached the last page
  }
  return all;
}

export interface ReadingShelves {
  currentlyReading: Book[];
  read: Book[];
  favorites: Book[];
}

export async function fetchReadingShelves(): Promise<ReadingShelves> {
  const [currentlyReading, read, favorites] = await Promise.all([
    fetchShelf('currently-reading', { perPage: 50, sort: 'date_added', order: 'd' }),
    fetchShelfAll('read', { sort: 'date_read', order: 'd' }),
    fetchShelf('favorites', { perPage: 100, sort: 'date_added', order: 'd' }),
  ]);

  return {
    currentlyReading: currentlyReading.sort(byAddedDesc),
    read: read.sort(byReadDesc),
    favorites: favorites.sort(byReadDesc),
  };
}
