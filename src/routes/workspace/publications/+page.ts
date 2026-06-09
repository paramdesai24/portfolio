import type { PageLoad } from './$types';
import { getPublications } from '$lib/utils/content';

export const load: PageLoad = async () => {
  return {
    publications: await getPublications()
  };
};
