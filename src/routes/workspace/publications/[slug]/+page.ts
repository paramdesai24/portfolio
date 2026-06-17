import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getPublication } from '$lib/utils/content';

export const load: PageLoad = async ({ params }) => {
  try {
    const pub = await getPublication(params.slug);

    // Dynamic mapping for prev/next timeline navigation
    const uniqueOrder = [
      { slug: 'pub-fides', title: 'CITS 2026' },
      { slug: 'pub-globecom', title: 'IEEE GLOBECOM 2025' },
      { slug: 'pub-vtc', title: 'IEEE VTC Spring 2025' },
      { slug: 'pub-healthcom', title: 'IEEE HealthCom 2025' },
      { slug: 'pub-icsc', title: 'IEEE ICSC 2025' },
      { slug: 'pub-cml', title: 'Springer CML 2025' },
      { slug: 'pub-tb', title: 'AI2M4RI 2026' }
    ];

    const currentIndex = uniqueOrder.findIndex(item => item.slug === params.slug);

    const prev = currentIndex > 0 ? {
      slug: uniqueOrder[currentIndex - 1].slug,
      title: uniqueOrder[currentIndex - 1].title
    } : null;
    
    const next = currentIndex < uniqueOrder.length - 1 && currentIndex !== -1 ? {
      slug: uniqueOrder[currentIndex + 1].slug,
      title: uniqueOrder[currentIndex + 1].title
    } : null;

    return {
      content: pub.content,
      metadata: pub,
      prev,
      next
    };
  } catch (e) {
    console.error(`Error loading publication ${params.slug}:`, e);
    throw error(404, {
      message: `Publication "${params.slug}" not found`
    });
  }
};
