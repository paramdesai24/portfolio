import type { Component } from 'svelte';
import type { Project, Publication, ResearchArea, Experience, BlogPost } from '$lib/types';

// Dynamic glob modules of markdown content using Vite glob imports
const projectModules = import.meta.glob('/src/lib/content/projects/*.md');
const publicationModules = import.meta.glob('/src/lib/content/publications/*.md');
const researchAreaModules = import.meta.glob('/src/lib/content/research-areas/*.md');
const experienceModules = import.meta.glob('/src/lib/content/experiences/*.md');
const blogModules = import.meta.glob('/src/lib/content/blog/*.md');

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
  } else if (slug === 'pub-fides') {
    filename = 'fides-cits-2026';
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



// Get all research areas sorted by publicationCount descending
export async function getResearchAreas(): Promise<ResearchArea[]> {
  return resolveModules<ResearchArea>(researchAreaModules);
}

// Get all experiences sorted by order ascending
export async function getExperiences(): Promise<Experience[]> {
  const list = await resolveModules<Experience>(experienceModules);
  const result: Experience[] = [];
  for (const exp of list) {
    if (exp.id === 'csi-student-chapter') {
      // Treasurer
      result.push({
        ...exp,
        role: "Treasurer",
        period: "Aug 2025 – Present",
        order: 3,
        shortDescription: "Managing financial operations, sponsorships, and budgeting for the Computer Society of India student chapter. Managed a budget pool of INR 4.5 Lakhs and sponsor relations for HACKaMINeD 2026. Handled operations and logistics serving 2500+ national student registrations."
      });
      // Core Committee
      result.push({
        ...exp,
        id: 'csi-student-chapter-core',
        role: "Core Committee Member",
        period: "Jan – Aug 2025",
        order: 4,
        shortDescription: "Co-organized national-level hackathons and technical symposiums like HackNUThon 6.0 and CUBIX 2025. Led a volunteer team of 30+ students handling participant onboarding and evaluation logistics. Structured competitive programming and algorithmic design events."
      });
    } else {
      result.push(exp);
    }
  }
  return result.sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Get all blog posts sorted by publishedDate descending
export async function getBlogPosts(): Promise<BlogPost[]> {
  const list = await resolveModules<BlogPost>(blogModules);
  return list.sort((a, b) => {
    const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
    const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
    return dateB - dateA;
  });
}

// Get single blog post including Svelte component
export async function getBlogPost(slug: string): Promise<BlogPost & { content: Component }> {
  const path = `/src/lib/content/blog/${slug}.md`;
  if (!blogModules[path]) {
    throw new Error(`Blog post "${slug}" not found`);
  }
  const resolver = blogModules[path] as () => Promise<any>;
  const module = await resolver();
  return {
    id: slug,
    content: module.default,
    ...module.metadata
  };
}

// Get single experience including Svelte component
export async function getExperience(slug: string): Promise<Experience & { content: Component }> {
  const realSlug = slug === 'csi-student-chapter-core' ? 'csi-student-chapter' : slug;
  const path = `/src/lib/content/experiences/${realSlug}.md`;
  if (!experienceModules[path]) {
    throw new Error(`Experience "${realSlug}" not found`);
  }
  const resolver = experienceModules[path] as () => Promise<any>;
  const module = await resolver();
  
  let metadata = { ...module.metadata };
  if (slug === 'csi-student-chapter') {
    metadata.role = "Treasurer";
    metadata.period = "Aug 2025 – Present";
    metadata.shortDescription = "Managing financial operations, sponsorships, and budgeting for the Computer Society of India student chapter. Managed a budget pool of INR 4.5 Lakhs and sponsor relations for HACKaMINeD 2026. Handled operations and logistics serving 2500+ national student registrations.";
  } else if (slug === 'csi-student-chapter-core') {
    metadata.role = "Core Committee Member";
    metadata.period = "Jan – Aug 2025";
    metadata.shortDescription = "Co-organized national-level hackathons and technical symposiums like HackNUThon 6.0 and CUBIX 2025. Led a volunteer team of 30+ students handling participant onboarding and evaluation logistics. Structured competitive programming and algorithmic design events.";
  }

  return {
    id: slug,
    content: module.default,
    ...metadata
  };
}
