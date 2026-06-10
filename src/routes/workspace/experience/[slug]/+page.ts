import type { PageLoad } from './$types';
import { getExperience, getExperiences } from '$lib/utils/content';

export const load: PageLoad = async ({ params }) => {
  const { slug } = params;
  const experiences = await getExperiences();
  
  const index = experiences.findIndex((e) => e.id === slug);
  const prev = index > 0 ? { slug: experiences[index - 1].id, title: experiences[index - 1].role } : null;
  const next = index < experiences.length - 1 ? { slug: experiences[index + 1].id, title: experiences[index + 1].role } : null;

  const experienceData = await getExperience(slug);

  return {
    metadata: {
      role: experienceData.role,
      company: experienceData.company,
      period: experienceData.period,
      location: experienceData.location,
      skills: experienceData.skills,
      shortDescription: experienceData.shortDescription
    },
    content: experienceData.content,
    prev,
    next
  };
};
