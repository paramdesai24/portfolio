<script lang="ts">
  import { onMount } from 'svelte';
  import ArrowDown from '@lucide/svelte/icons/arrow-down';
  import Download from '@lucide/svelte/icons/download';

  type Entry = { title: string; meta?: string; body: string; href?: string; link?: string };
  const chapters: { id: string; title: string; label: string; line: string; entries: Entry[] }[] = [
    { id:'engineering', title:'Applied AI at DYU Labs', label:'Engineering', line:'Two solar problems: answering operators’ questions and forecasting what each inverter would generate.', entries:[
      { title:'aALoK', meta:'Applied AI Engineering Intern · May–Jul 2026', body:'Built a conversational assistant for solar plant operators using LangGraph, retrieval, Whisper, pgvector and natural-language-to-SQL. End-to-end query latency was 2.5–5 seconds.' },
      { title:'Per-inverter solar forecasting', body:'Built LightGBM forecasts from Copernicus ERA5/ECMWF weather data, with drift monitoring, feedback-driven retraining and AWS deployment. The résumé reports 3.15% Clean MAPE across 75+ active inverters.' }
    ] },
    { id:'research', title:'Trustworthy systems research', label:'Research', line:'At ST Lab, I worked on making intelligent systems easier to explain, secure and verify.', entries:[
      { title:'ST Lab', meta:'Undergraduate Research Assistant · Oct 2024–Dec 2025', body:'Worked with Dr. Sudeep Tanwar and Dr. Rajesh Gupta on explainable AI, machine unlearning, federated learning, AI security, quantum key distribution and healthcare AI. Designed experiments and system architectures, implemented pipelines and authored manuscripts.' },
      { title:'Seven published papers', meta:'Three first-author papers', body:'FIDES, Q-PhishNet, the Springer smart-home security chapter, Q-TBNet, the ICSC connected-vehicle detection paper, Q-ShielD and the HealthCom wearable IoT paper.', href:'/workspace/publications', link:'Browse publications' },
      { title:'From Tampa to BHOOMI', body:'Presented the connected-vehicle research at IEEE ICSC 2025 in Tampa. Separately, submitted BHOOMI’s grid-based environmental forecasting and intervention-planning manuscript to ASME JCISE.' }
    ] },
    { id:'projects', title:'What I built', label:'Projects', line:'The projects answer very different questions, from replaying a market decision to simulating a World Cup.', entries:[
      { title:'Xeroww', body:'Built deterministic market analysis for Indian equities, a Decision Workbench that preserves evidence, a candle-by-candle Replay Lab and point-in-time portfolio analytics benchmarked against the NIFTY 50.', href:'/workspace/projects/xeroww', link:'Explore Xeroww' },
      { title:'FC Analytics', body:'Combined Poisson score modelling, Elo ratings and team-strength indicators with up to 10,000 simulations of the 48-team World Cup and a real-time fantasy auction.', href:'/workspace/projects/fc-analytics', link:'Explore FC Analytics' }
    ] },
    { id:'education', title:'Education', label:'Education', line:'Computer science is my foundation. Applied mathematics helps me ask better questions about the systems I build.', entries:[
      { title:'Nirma University', meta:'B.Tech. Computer Science and Engineering · 2023–2027', body:'Minor in Applied Mathematics. CGPA 8.33/10.' }
    ] },
    { id:'community', title:'Leadership and service', label:'Community', line:'Some of the work I’m proudest of happened away from the code editor.', entries:[
      { title:'Computer Society of India, Nirma University', meta:'Treasurer · Aug 2025–Sep 2026', body:'Helped organize HACKaMINeD 2026 with SUNY Binghamton University, with 2,000+ participants and 13 sponsors. Managed finance, logistics and organization for HackNUThon 6.0, which drew 1,200+ participants.' },
      { title:'Vidhyadaan Foundation', meta:'Volunteer Teacher · Jun–Jul 2024', body:'Taught mathematics, English and science to 50 children in structured classroom sessions.' }
    ] },
    { id:'skills', title:'Tools I work with', label:'Skills', line:'I reach for different tools depending on whether I’m building a model, a service or a data pipeline.', entries:[
      { title:'Languages', body:'Python, C++, C, TypeScript, JavaScript and SQL. English, French (academic), Hindi and Gujarati.' },
      { title:'AI and engineering', body:'PyTorch, LangGraph, NLP, machine unlearning, explainable AI, FastAPI, Flask, React, Apache Iceberg, Spark, Kafka, Prometheus, Grafana and Docker.' },
      { title:'Competitive programming', body:'300+ problems solved across platforms.', href:'/workspace/programming', link:'See programming activity' }
    ] }
  ];

  let active = $state(-1);
  let root: HTMLElement;
  let walkStage: HTMLDivElement;
  const pdf = '/Param_Desai%20RESUME.pdf';

  onMount(() => {
    const sections = Array.from(root.querySelectorAll('article'));
    let frame = 0;
    let previousScroll = scrollY;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    function update() {
      frame = 0;
      active = sections.findLastIndex(section => section.getBoundingClientRect().top <= innerHeight * .55);
      const bounds = root.getBoundingClientRect();
      const distance = Math.max(0, -bounds.top);
      const progress = Math.min(1, distance / Math.max(1, bounds.height - innerHeight));
      const stride = Math.sin(distance / 15);
      walkStage.style.setProperty('--travel', String(reducedMotion.matches ? 0 : progress));
      walkStage.style.setProperty('--stride', String(reducedMotion.matches ? 0 : stride));
      walkStage.style.setProperty('--bounce', String(reducedMotion.matches ? 0 : Math.abs(stride)));
      if (reducedMotion.matches) walkStage.style.removeProperty('--facing');
      else if (scrollY !== previousScroll) walkStage.style.setProperty('--facing', scrollY > previousScroll ? '1' : '-1');
      previousScroll = scrollY;
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    addEventListener('scroll', schedule, { passive:true });
    addEventListener('resize', schedule);
    reducedMotion.addEventListener('change', schedule);
    return () => {
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      reducedMotion.removeEventListener('change', schedule);
      cancelAnimationFrame(frame);
    };
  });
</script>

<svelte:head>
  <title>Resume</title>
  <meta name="description" content="A guided résumé covering applied AI engineering, research, projects, education and community work." />
</svelte:head>

<main id="main-content" class="resume" bind:this={root}>
  <div class="layout">
    <aside class="guide">
      <div class="portrait" bind:this={walkStage} aria-hidden="true">
        <div class="walker">
          <img src="/pixel-param.png" alt="" width="64" height="64" />
          <span class="shirt"></span>
          <span class="leg"></span><span class="leg"></span>
        </div>
      </div>
      <p aria-live="polite">{chapters[active]?.line ?? 'Hi! I’ll walk you through the work, research and people that shaped my profile.'}</p>
      <nav aria-label="Resume chapters">
        {#each chapters as chapter, index (chapter.id)}
          <a href={'#' + chapter.id} aria-current={active === index ? 'location' : undefined}>{chapter.label}</a>
        {/each}
      </nav>
    </aside>

    <div class="story">
      <header class="hero">
        <h1>Resume</h1>
        <p>Applied AI engineering, trustworthy systems research and the projects that connect them.</p>
        <div class="actions">
          <a href="#engineering">Start the walkthrough <ArrowDown size={17} /></a>
          <a href={pdf} download>Download PDF <Download size={17} /></a>
        </div>
      </header>

      {#each chapters as chapter, index (chapter.id)}
        <article id={chapter.id} aria-labelledby={chapter.id + '-heading'}>
          <div class="chapter-title"><span aria-hidden="true">{String(index + 1).padStart(2,'0')}</span><h2 id={chapter.id + '-heading'}>{chapter.title}</h2></div>
          {#each chapter.entries as entry (entry.title)}
            <section class="entry">
              <h3>{entry.title}</h3>
              {#if entry.meta}<p class="meta">{entry.meta}</p>{/if}
              <p>{entry.body}</p>
              {#if entry.href}<a href={entry.href}>{entry.link}</a>{/if}
            </section>
          {/each}
        </article>
      {/each}

      <footer><a href="https://github.com/paramdesai24">GitHub</a><a href="https://scholar.google.com/citations?user=qj1nZ4EAAAAJ">Google Scholar</a><a href="mailto:desaiparam2412@gmail.com">Email</a></footer>
    </div>
  </div>
</main>

<style>
  .resume { background:#eaf1ed; color:#102b35; font-family:"Instrument Sans",system-ui,sans-serif; }
  .layout { width:min(100%,1320px); margin:auto; display:grid; grid-template-columns:minmax(200px,.6fr) minmax(0,2fr); gap:clamp(2rem,7vw,7rem); padding:clamp(1rem,5vw,5rem); }
  .guide { position:sticky; top:6.5rem; align-self:start; background:#173f50; color:#fff; border-radius:1.25rem; padding:clamp(1rem,2.5vw,1.7rem); }
  .portrait { --sprite:64px; position:relative; height:94px; width:100%; border-radius:.75rem; background:#d9eddd; }
  .walker { position:absolute; bottom:9px; left:calc(4px + (100% - var(--sprite) - 8px) * var(--travel,0)); width:var(--sprite); aspect-ratio:.82; transform:translateY(calc(-4px * var(--bounce,0))) scaleX(var(--facing,1)); }
  .walker img { position:absolute; top:0; left:12%; z-index:2; width:76%; height:auto; image-rendering:pixelated; }
  .shirt { position:absolute; z-index:1; top:50%; left:21%; width:58%; height:27%; border-radius:25% 25% 8% 8%; background:linear-gradient(115deg,#628eaa,#284e70); }
  .leg { position:absolute; bottom:2%; left:32%; width:15%; height:27%; background:#24394b; border-bottom:4px solid #101d2a; transform-origin:top; transform:rotate(calc(var(--stride,0) * 34deg)); }
  .leg + .leg { left:53%; transform:rotate(calc(var(--stride,0) * -34deg)); }
  .guide p { margin:1rem 0; min-height:5lh; font-size:.95rem; line-height:1.45; }
  nav { display:grid; gap:.25rem; }
  nav a { padding:.5rem .6rem; min-height:44px; display:flex; align-items:center; text-decoration:none; border-radius:.4rem; }
  nav a:is(:hover,[aria-current]) { background:#d9eddd; color:#102b35; }
  .hero { padding:clamp(1rem,4vw,4rem) 0 clamp(3rem,8vw,7rem); }
  h1 { font-size:clamp(3.5rem,10vw,9rem); font-weight:750; line-height:.88; letter-spacing:-.085em; margin:0 0 1.2rem; }
  .hero p { font-size:clamp(1.2rem,2.5vw,1.7rem); max-width:34ch; }
  .actions,footer { display:flex; flex-wrap:wrap; gap:.75rem 1rem; margin-top:1.5rem; }
  .actions a { display:inline-flex; align-items:center; gap:.5rem; min-height:44px; padding:.55rem .85rem; border:1px solid #173f50; border-radius:99px; text-decoration:none; font-weight:650; }
  .actions a:first-child { background:#173f50; color:#fff; }
  article { border-top:1px solid #55707b70; padding:2rem 0 3rem; scroll-margin-top:7rem; }
  .chapter-title { display:flex; align-items:baseline; gap:.9rem; }
  .chapter-title span,.meta { color:#385c68; font-weight:650; }
  h2 { font-size:clamp(1.8rem,4vw,3.5rem); font-weight:720; letter-spacing:-.055em; line-height:1; margin:0 0 1rem; }
  .entry { padding:1rem 0; max-width:66ch; }
  .entry + .entry { border-top:1px solid #55707b36; }
  h3 { font-size:1.3rem; font-weight:700; margin:0 0 .3rem; }
  .entry p { margin:.35rem 0; line-height:1.6; }
  .entry a,footer a { color:#175773; text-decoration:underline; text-underline-offset:.2em; }
  footer { border-top:1px solid #55707b70; padding:1rem 0 2rem; }
  @media(max-width:740px) {
    .layout { display:flex; flex-direction:column; gap:1.5rem; }
    .guide { top:5.6rem; z-index:3; width:100%; display:grid; grid-template-columns:72px minmax(0,1fr); gap:.5rem .7rem; padding:.65rem; }
    .portrait { --sprite:38px; height:58px; }
    .guide p { margin:0; min-height:0; font-size:.83rem; align-self:center; }
    nav { grid-column:1 / -1; display:flex; overflow-x:auto; }
    nav a { white-space:nowrap; font-size:.83rem; }
    article { scroll-margin-top:15rem; }
  }
</style>
