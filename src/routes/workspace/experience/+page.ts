import type { PageLoad } from './$types';
import { getExperiences } from '$lib/utils/content';

export const load: PageLoad = async () => {
  return {
    experiences: await getExperiences()
  };
};
