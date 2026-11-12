import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getProject } from '$lib/utils/content';
import { featuredProjectIds } from '$lib/content/featuredProjects';

export const load: PageLoad = async ({ params }) => {
  if (!featuredProjectIds.some(id => id === params.slug)) error(404, 'Project not found');
  try {
    const project = await getProject(params.slug);
    return {
      content: project.content,
      metadata: project
    };
  } catch (e) {
    console.error(`Error loading project ${params.slug}:`, e);
    throw error(404, {
      message: `Project "${params.slug}" not found`
    });
  }
};
