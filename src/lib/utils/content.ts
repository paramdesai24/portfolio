import type { Component } from 'svelte';
import type { Project, Publication, ResearchIdea, ResearchArea } from '$lib/types';

// Dynamic glob modules of markdown content using Vite glob imports
const projectModules = import.meta.glob('/src/lib/content/projects/*.md');
const publicationModules = import.meta.glob('/src/lib/content/publications/*.md');
const researchAreaModules = import.meta.glob('/src/lib/content/research-areas/*.md');
const researchIdeaModules = import.meta.glob('/src/lib/content/research-ideas/*.md');

// Core helper to resolve multiple dynamic markdown modules and extract metadata
async function resolveModules<T>(modules: Record<string, () => Promise<any>>): Promise<T[]> {
  const results = await Promise.all(
    Object.entries(modules).map(async ([path, resolver]) => {
      const slug = path.split('/').pop()?.replace('.md', '') || '';
      const module = await resolver();
      
      // Map backward compatibility fields
      let metadata = { ...module.metadata };
      if (metadata.researchAreas && !metadata.researchArea) {
        metadata.researchArea = metadata.researchAreas;
      } else if (metadata.researchArea && !metadata.researchAreas) {
        metadata.researchAreas = metadata.researchArea;
      }
      
      return {
        id: slug,
        ...metadata
      } as T;
    })
  );
  return results;
}

// Get all projects sorted by featured descending, then order ascending
export async function getProjects(): Promise<Project[]> {
  const list = await resolveModules<Project>(projectModules);
  return list.sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    return (a.order || 0) - (b.order || 0);
  });
}

// Get single project including Svelte component
export async function getProject(slug: string): Promise<Project & { content: Component }> {
  const path = `/src/lib/content/projects/${slug}.md`;
  if (!projectModules[path]) {
    throw new Error(`Project "${slug}" not found`);
  }
  const resolver = projectModules[path] as () => Promise<any>;
  const module = await resolver();
  return {
    id: slug,
    content: module.default,
    ...module.metadata
  };
}

// Get all publications sorted by year descending, then order ascending
export async function getPublications(): Promise<Publication[]> {
  const list = await resolveModules<Publication>(publicationModules);
  return list.sort((a, b) => {
    if (b.year !== a.year) {
      return b.year - a.year;
    }
    return (a.order || 0) - (b.order || 0);
  });
}

// Get single publication including Svelte component
export async function getPublication(slug: string): Promise<Publication & { content: Component }> {
  // Translate URL slug mappings if needed (e.g. pub-icsc to ieee-icsc-2025)
  let filename = slug;
  if (slug === 'pub-icsc') {
    filename = 'ieee-icsc-2025';
  } else if (slug === 'pub-globecom') {
    filename = 'ieee-globecom-2025';
  } else if (slug === 'pub-vtc') {
    filename = 'ieee-vtc-2025';
  } else if (slug === 'pub-healthcom') {
    filename = 'ieee-healthcom-2025';
  } else if (slug === 'pub-cml') {
    filename = 'springer-cml-2025';
  } else if (slug === 'pub-tb') {
    filename = 'ai2m4ri-2026';
  }

  const path = `/src/lib/content/publications/${filename}.md`;
  if (!publicationModules[path]) {
    throw new Error(`Publication "${slug}" not found`);
  }
  const resolver = publicationModules[path] as () => Promise<any>;
  const module = await resolver();
  
  // Backward compatibility maps
  let metadata = { ...module.metadata };
  if (metadata.researchAreas && !metadata.researchArea) {
    metadata.researchArea = metadata.researchAreas;
  } else if (metadata.researchArea && !metadata.researchAreas) {
    metadata.researchAreas = metadata.researchArea;
  }

  return {
    id: slug,
    content: module.default,
    ...metadata
  };
}

// Get all research ideas sorted by active -> exploring -> on-radar
export async function getResearchIdeas(): Promise<ResearchIdea[]> {
  const list = await resolveModules<ResearchIdea>(researchIdeaModules);
  const statusPriority: Record<string, number> = {
    'active': 0,
    'active interest': 0,
    'exploring': 1,
    'on-radar': 2
  };
  return list.sort((a, b) => {
    const pA = statusPriority[a.status.toLowerCase()] ?? 99;
    const pB = statusPriority[b.status.toLowerCase()] ?? 99;
    return pA - pB;
  });
}

// Get all research areas sorted by publicationCount descending
export async function getResearchAreas(): Promise<ResearchArea[]> {
  return resolveModules<ResearchArea>(researchAreaModules);
}
