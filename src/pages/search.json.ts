import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const gallery = await getCollection('gallery');

  const postIndex = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    slug: post.id,
    tags: post.data.tags,
    date: post.data.date.toISOString().split('T')[0],
    type: 'post',
  }));

  const galleryIndex = gallery.map((photo) => ({
    title: photo.data.title,
    description: photo.data.description || '',
    slug: '/gallery',
    tags: photo.data.tags,
    date: photo.data.date.toISOString().split('T')[0],
    type: 'gallery',
  }));

  const index = [...postIndex, ...galleryIndex].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
