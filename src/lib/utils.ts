import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getSortedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function getReadingTime(content: string): number {
  const chineseChars = (content.match(/[一-鿿]/g) || []).length;
  const englishWords = content.replace(/[一-鿿]/g, '').split(/\s+/).filter(Boolean).length;
  const minutes = chineseChars / 300 + englishWords / 200;
  return Math.max(1, Math.ceil(minutes));
}

export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await getSortedPosts();
  const tagMap = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }
  return tagMap;
}
