export interface ResearchArea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  publicationCount: number;
  projectCount: number;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  techStack: string[];
  researchThemes: string[];
  status?: 'live' | 'active' | 'prototype' | string;
  achievements?: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  order?: number;
}

export interface Publication {
  id: string;
  title: string;
  venue: string;
  year: number;
  researchArea?: string[]; // Backward compatibility with list view
  researchAreas: string[];  // MDX Schema
  status?: 'published' | 'presented' | 'in-progress' | string;
  note?: string;
  pdfUrl?: string;
  relatedProjects?: string[];
  order?: number;
  abstract: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location?: string;
  skills: string[];
  order: number;
  shortDescription: string;
}

