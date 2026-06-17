import type { PageLoad } from './$types';
import { getBlogPosts } from '$lib/utils/content';

export const load: PageLoad = async () => {
  return {
    posts: await getBlogPosts()
  };
};
