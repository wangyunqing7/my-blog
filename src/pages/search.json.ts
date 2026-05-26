import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const index = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    slug: post.id,
    tags: post.data.tags,
    date: post.data.date.toISOString().split('T')[0],
  }));
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
