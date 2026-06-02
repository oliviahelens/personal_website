import { XMLParser } from 'fast-xml-parser';

export interface SubstackPost {
  title: string;
  link: string;
  date: Date;
  description: string;
}

const FEED_URL = 'https://oliviahelens.substack.com/feed';

// Substack sits behind Cloudflare and answers bot-like requests with a 403,
// so present as a normal browser (a plain custom UA gets blocked).
const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept:
    'application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.5',
  'Accept-Language': 'en-US,en;q=0.9',
};

const stripHtml = (s: string) =>
  s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch the feed, retrying a few times (handles transient 403s / rate limits).
async function fetchFeed(): Promise<string | null> {
  const attempts = 3;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(FEED_URL, {
        headers: BROWSER_HEADERS,
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      const last = i === attempts - 1;
      console.warn(
        `[substack] fetch attempt ${i + 1}/${attempts} failed${last ? '' : ', retrying'}: ${err}`,
      );
      if (last) return null;
      await sleep(1000 * (i + 1));
    }
  }
  return null;
}

export async function fetchSubstackPosts(): Promise<SubstackPost[]> {
  const xml = await fetchFeed();
  if (xml == null) return [];

  const parser = new XMLParser({ ignoreAttributes: false, cdataPropName: '__cdata' });
  const parsed = parser.parse(xml);
  const items = parsed?.rss?.channel?.item ?? [];
  const list = Array.isArray(items) ? items : [items];

  const posts: SubstackPost[] = list.map((item: any) => ({
    title: stripHtml(item.title?.__cdata ?? item.title ?? ''),
    link: item.link ?? '',
    date: new Date(item.pubDate ?? Date.now()),
    description: stripHtml(item.description?.__cdata ?? item.description ?? '').slice(0, 280),
  }));

  return posts.sort((a, b) => b.date.valueOf() - a.date.valueOf());
}
