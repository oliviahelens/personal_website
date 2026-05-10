import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { fetchSubstackPosts } from '../lib/substack';

export async function GET(context: APIContext) {
  const posts = await fetchSubstackPosts();
  return rss({
    title: 'Olivia Scharfman',
    description: 'Writing by Olivia Scharfman.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.title,
      link: post.link,
      pubDate: post.date,
      description: post.description,
    })),
  });
}
