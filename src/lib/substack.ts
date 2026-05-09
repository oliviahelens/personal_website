import { XMLParser } from 'fast-xml-parser';

export interface SubstackPost {
  title: string;
  link: string;
  date: Date;
  description: string;
}

const FEED_URL = 'https://oliviahelens.substack.com/feed';

const stripHtml = (s: string) =>
  s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

export async function fetchSubstackPosts(): Promise<SubstackPost[]> {
  let xml: string;
  try {
    const res = await fetch(FEED_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; oliviahelens.com/1.0)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    xml = await res.text();
  } catch (err) {
    console.warn(`[substack] feed fetch failed, returning empty list: ${err}`);
    return [];
  }

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
