<script lang="ts">
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import PortfolioGuide from '$lib/components/home/PortfolioGuide.svelte';

  let { data } = $props();
  const descriptions: Record<string, string> = {
    xeroww: 'Analyze Indian equity market structure, practice decisions in the candle-by-candle Replay Lab, and save the evidence behind each decision. Portfolio Intelligence tracks performance, attribution, drawdown and risk against the NIFTY 50.',
    'fc-analytics': 'Compare match probabilities and simulate the 48-team World Cup up to 10,000 times. The same platform runs multiplayer draft auctions with live bids, player nominations, and budget limits.',
    bhoomi: 'A satellite-based planning tool that maps heat, vegetation, and other environmental indicators by area. It helps planners spot changes, compare neighborhoods, and explore where interventions might help.',
    petbot: 'A restaurant voice and revenue tool. Customers can place orders by phone, while operators can explore sales patterns and ask questions about menu performance using their transaction data.'
  };
  const commentary: Record<string, string> = {
    xeroww: 'What if you could rewind the market?',
    'fc-analytics': 'One World Cup, thousands of possible endings.',
    bhoomi: 'Same city, different story when you look from orbit.',
    petbot: 'What if ordering dinner was as easy as making a call?'
  };
</script>

<svelte:head>
  <title>Projects</title>
  <meta name="description" content="Four projects by Param Desai across financial engineering, football modelling, environmental intelligence, and restaurant tools." />
</svelte:head>

<PortfolioGuide title="Projects" description="Systems built at the intersection of research and engineering." message="Four projects, four very different what-ifs." />

<div class="project-list">
  {#each data.projects as project (project.id)}
    <a data-scroll-reveal class="project" href={'/workspace/projects/' + project.id} data-guide-line={commentary[project.id]}>
      <h2>{project.title}</h2>
      <ArrowUpRight size={24} aria-hidden="true" />
      <p>{descriptions[project.id] ?? project.shortDescription}</p>
    </a>
  {/each}
</div>

<style>
  .project-list { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); max-width:56rem; gap:1rem; margin:clamp(2rem,5vw,4rem) auto 0; }
  .project { display:grid; grid-template-columns:minmax(0,1fr) auto; align-content:start; align-items:start; gap:.65rem; padding:clamp(1rem,2vw,1.45rem); background:#f4faf4; border:1px solid #31516e70; border-radius:.85rem; color:#101d2a; text-decoration:none; }
  .project h2 { font-size:clamp(1.45rem,2.8vw,2.2rem); line-height:1; margin:0; }
  .project p { grid-column:1 / -1; max-width:48ch; line-height:1.45; margin:0; }
  .project:is(:hover,:focus-visible) { background:#fff; border-color:#183d6b; }
  .project:focus-visible { outline:2px solid #183d6b; outline-offset:3px; }
  @media(max-width:640px) { .project-list { grid-template-columns:1fr; } }
</style>
