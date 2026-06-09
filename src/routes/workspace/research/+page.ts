import type { PageLoad } from './$types';
import { getResearchAreas, getPublications } from '$lib/utils/content';

export const load: PageLoad = async () => {
  return {
    researchAreas: await getResearchAreas(),
    publications: await getPublications()
  };
};
