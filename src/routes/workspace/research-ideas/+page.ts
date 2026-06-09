import type { PageLoad } from './$types';
import { getResearchIdeas } from '$lib/utils/content';

export const load: PageLoad = async () => {
  return {
    ideas: await getResearchIdeas()
  };
};
