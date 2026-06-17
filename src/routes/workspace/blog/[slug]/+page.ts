import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getBlogPost, getBlogPosts } from '$lib/utils/content';

export const load: PageLoad = async ({ params }) => {
  try {
    const post = await getBlogPost(params.slug);

    // Build ordered list for prev/next navigation
    const allPosts = await getBlogPosts();
    const currentIndex = allPosts.findIndex(p => p.id === params.slug);

    const prev = currentIndex > 0 ? {
      slug: allPosts[currentIndex - 1].id,
      title: allPosts[currentIndex - 1].title
    } : null;

    const next = currentIndex < allPosts.length - 1 && currentIndex !== -1 ? {
      slug: allPosts[currentIndex + 1].id,
      title: allPosts[currentIndex + 1].title
    } : null;

    return {
      content: post.content,
      metadata: post,
      prev,
      next
    };
  } catch (e) {
    console.error(`Error loading blog post ${params.slug}:`, e);
    throw error(404, {
      message: `Blog post "${params.slug}" not found`
    });
  }
};
