import type { PageLoad } from './$types';
import { getProjects } from '$lib/utils/content';

export const load: PageLoad = async () => {
  return {
    projects: await getProjects()
  };
};
