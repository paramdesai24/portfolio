import type { PageLoad } from './$types';
import { getProjects } from '$lib/utils/content';
import { featuredProjectIds } from '$lib/content/featuredProjects';

export const load: PageLoad = async () => {
  const projects = await getProjects();
  return { projects: featuredProjectIds.flatMap(id => projects.filter(project => project.id === id)) };
};
