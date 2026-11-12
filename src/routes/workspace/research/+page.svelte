<script lang="ts">
  import PortfolioGuide from "$lib/components/home/PortfolioGuide.svelte";
  import { onMount } from 'svelte';
  import { currentPageTitle } from '$lib/stores/workspace';
  import { ArrowRight, BookOpen, Award, Layers } from '@lucide/svelte';

  let { data } = $props();
  const researchAreas = $derived(data.researchAreas
    .filter(area => area.id !== 'quantum-security')
    .map(area => area.id === 'cybersecurity' ? {
      ...area,
      title: 'Cybersecurity & Quantum Security',
      description: 'Securing IoT gateways and connected vehicles through intrusion detection, alongside research on quantum key distribution for connected systems.',
      tags: ['Intrusion Detection', 'V2X Security', 'Quantum Cryptography', 'CV-QKD']
    } : area));
  const publications = $derived(data.publications || []);

  let mounted = $state(false);

  // Set page title and trigger animations
  onMount(() => {
    currentPageTitle.set('Research');
    const timer = setTimeout(() => {
      mounted = true;
    }, 50);
    return () => clearTimeout(timer);
  });

  const publicationOrder = ['ai2m4ri-2026', 'fides-cits-2026', 'ieee-globecom-2025', 'ieee-healthcom-2025', 'ieee-vtc-2025', 'ieee-icsc-2025', 'springer-cml-2025'];
  const orderedPublications = $derived(publicationOrder.flatMap(id => publications.filter(pub => pub.id === id)));
  let timelinePaused = $state(false);
</script>

<svelte:head>
  <title>Research Overview</title>
  <meta name="description" content="Explore Param Desai's active research fields, papers, and current research focus." />
</svelte:head>

<div class="flex flex-col gap-16 w-full" class:animate-in={mounted}>
  <PortfolioGuide title="Research" description="Areas of inquiry, open questions, and ongoing investigations." message="What happens when we ask a model to show its work?" />

  <!-- Section 2: Research Activity Summary -->
  <section class="anim-item delay-200">
    <div class="flex items-center gap-4 text-xs font-mono text-[--color-muted] select-none border-b border-[--color-border] pb-6">
      <div class="flex items-center gap-1.5">
        <Award size={14} class="text-[--color-accent]" />
        <span>{publications.length} Publications</span>
      </div>
      <span class="w-[1px] h-3 bg-[--color-border]"></span>
      <div class="flex items-center gap-1.5">
        <BookOpen size={14} class="text-[--color-accent]" />
        <span>3 First-author papers</span>
      </div>
      <span class="w-[1px] h-3 bg-[--color-border]"></span>
      <div class="flex items-center gap-1.5">
        <Layers size={14} class="text-[--color-accent]" />
        <span>{researchAreas.length} Research Areas</span>
      </div>
    </div>
  </section>

  <!-- Section 3: Research Area Cards -->
  <section class="flex flex-col gap-6" data-guide-line="Four research areas, one question: how do we make intelligent systems more trustworthy?">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {#each researchAreas as area, idx}
        <div 
          data-scroll-reveal class="card research-card group flex flex-col justify-between anim-item"
          style="transition-delay: {100 + idx * 50}ms;"
        >
          <div>
            <h3 class="font-serif text-xl text-[--color-text] mb-3">{area.title}</h3>
            
            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 mb-4">
              {#each area.tags as tag}
                <span class="text-[10px] font-mono bg-[--color-accent-dim] text-[--color-accent] px-2 py-0.5 rounded">
                  {tag}
                </span>
              {/each}
            </div>

            <p class="text-sm text-[--color-muted] font-sans leading-relaxed mb-6">
              {area.description}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Section 4: Research Journey -->
  <section class="journey anim-item delay-800" data-guide-line="This started with smart-home security. The questions got bigger from there.">
    <div data-scroll-reveal>
    <h3 class="font-serif text-2xl text-[--color-text] border-b border-[--color-border] pb-3 mb-5">Research Journey</h3>
    <p class="font-sans text-sm text-[--color-muted] leading-[1.85] text-justify">
      As an undergraduate research assistant at ST Lab, I worked with Dr. Sudeep Tanwar and Dr. Rajesh Gupta, initially exploring how explainability tools like LIME could make intrusion detection systems legible. What started as a question about smart-home security quickly expanded: if you could explain a prediction, could you also diagnose a poisoned training set? That forensic inversion became a thread connecting papers across cybersecurity, autonomous vehicles, and healthcare AI. At IEEE ICSC in Tampa, presenting in person to a room of practitioners taught me something no peer review ever had — that correctness and deployability are different standards. I came back asking the deployment engineer's questions about every paper I write. This led to exploring quantum security primitives like Continuous-Variable Quantum Key Distribution (CV-QKD) to secure resource-constrained edge nodes, moving beyond computational assumptions to physical-law security guarantees. The unlearning verification problem and quantum-secured telemetry streams are where that thinking has landed for now. Seven published papers, three as first author, and the questions are still getting harder.
    </p>
    </div>
    <figure class="tampa" data-guide-line="That’s me in Tampa, talking about what happens when a vehicle’s sensors lie.">
    <img src="/screenshots/research-screenshot1.jpg" alt="Param presenting connected-vehicle security research in Tampa" width="1280" height="699" loading="lazy" />
    <figcaption>Presenting connected-vehicle security research at IEEE ICSC in Tampa, Florida.</figcaption>
    </figure>
  </section>

  <section data-scroll-reveal class="timeline" data-guide-line="Here's where those questions turned into papers.">
    <div class="timeline-heading">
      <h3>Publication Timeline</h3>
      <button type="button" class="timeline-control" aria-pressed={timelinePaused} onclick={() => timelinePaused = !timelinePaused}>
        {timelinePaused ? 'Resume timeline' : 'Pause timeline'}
      </button>
    </div>
    <div class="timeline-viewport">
      <div class="timeline-track" class:paused={timelinePaused}>
        {#each [false, true] as duplicate}
          <ul class="timeline-group" class:duplicate aria-hidden={duplicate ? 'true' : undefined}>
            {#each orderedPublications as pub (pub.id)}
              <li class="timeline-card">
                <span class="timeline-year">{pub.year}</span>
                <span class="timeline-venue">{pub.venue}</span>
                <p>{pub.title}</p>
              </li>
            {/each}
          </ul>
        {/each}
      </div>
    </div>
  </section>


</div>

<style>
  .timeline { min-width:0; }
  .timeline-heading { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:.6rem; padding-bottom:.7rem; margin-bottom:1rem; border-bottom:1px solid var(--color-border); }
  .timeline-heading h3 { margin:0; font-size:1.5rem; }
  .timeline-control { min-height:44px; padding:.4rem .8rem; border:1px solid #31516e; border-radius:99px; font-size:.8rem; cursor:pointer; }
  .timeline-viewport { overflow:hidden; }
  .timeline-track { display:flex; width:max-content; animation:publication-loop 40s linear infinite; }
  .timeline-viewport:hover .timeline-track,.timeline-track.paused { animation-play-state:paused; }
  .timeline-group { display:flex; gap:1rem; list-style:none; padding:0 1rem 0 0; margin:0; }
  .timeline-card { width:clamp(14rem,27vw,18rem); display:grid; align-content:start; gap:.65rem; background:var(--color-surface); border:1px solid var(--color-border); border-radius:.8rem; padding:1rem; }
  .timeline-year { font-weight:700; color:var(--color-accent); }
  .timeline-venue { font-size:.75rem; color:var(--color-muted); }
  .timeline-card p { font-size:.9rem; line-height:1.35; margin:0; }
  @keyframes publication-loop { to { transform:translateX(-50%); } }
  @media(prefers-reduced-motion:reduce) {
    .timeline-track { animation:none; }
    .timeline-control,.timeline-group.duplicate { display:none; }
    .timeline-viewport { overflow-x:auto; }
  }

  .journey { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:clamp(1.5rem,4vw,4rem); align-items:center; }
  .tampa { margin:0; }
  @media(max-width:760px) { .journey { grid-template-columns:1fr; } }
  .tampa img { width:100%; height:auto; border-radius:.85rem; }
  .tampa figcaption { margin-top:.6rem; font-size:.875rem; }
  /* Base animation settings */
  .anim-item {
    opacity: 0;
    transform: translateY(16px);
  }

  /* Transition triggers on mount */
  :global(.animate-in) .anim-item {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .delay-100 { transition-delay: 50ms; }
  .delay-200 { transition-delay: 100ms; }
  .delay-800 { transition-delay: 200ms; }
  .delay-900 { transition-delay: 250ms; }

  /* Custom Hover Effects for Cards */
  .research-card {
    border-left: 3px solid transparent;
    transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  }
  .research-card:hover {
    border-left-color: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.02);
  }

  /* Sticky note styling */
  .sticky-note {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  }

  @media (prefers-reduced-motion: reduce) {
    .anim-item {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
    .research-card {
      transform: none !important;
    }
  }
</style>
