<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import Download from '@lucide/svelte/icons/download';


  type Entry = { title: string; meta?: string; body: string; href?: string; link?: string };
  const chapters: { id: string; title: string; label: string; entries: Entry[] }[] = [
    { id:'engineering', title:'Applied AI at DYU Labs', label:'Engineering', entries:[
      { title:'aALoK', meta:'Applied AI Engineering Intern · May–Jul 2026', body:'Built a LangGraph assistant for solar plant operators.' },
      { title:'Per-inverter solar forecasting', body:'Forecasted output across 75+ inverters with 3.15% Clean MAPE.' }
    ] },
    { id:'research', title:'Trustworthy systems research', label:'Research', entries:[
      { title:'ST Lab', meta:'Undergraduate Research Assistant · Oct 2024–Dec 2025', body:'Researched explainable AI, machine unlearning, federated learning and quantum security.' },
      { title:'Seven published papers', meta:'Three first-author papers', body:'Covers smart homes, connected vehicles, healthcare and federated learning.', href:'/workspace/publications', link:'Browse publications' }
    ] },
    { id:'projects', title:'What I built', label:'Projects', entries:[
      { title:'Xeroww', body:'Indian equities research with market replay and portfolio analytics.', href:'/workspace/projects/xeroww', link:'Explore Xeroww' },
      { title:'FC Analytics', body:'Simulated the 48-team World Cup and built a live fantasy auction.', href:'/workspace/projects/fc-analytics', link:'Explore FC Analytics' }
    ] },
    { id:'education', title:'Education', label:'Education', entries:[
      { title:'Nirma University', meta:'B.Tech. Computer Science and Engineering · 2023–2027', body:'Applied Mathematics minor · CGPA 8.33/10.' }
    ] },
    { id:'community', title:'Leadership and service', label:'Community', entries:[
      { title:'Computer Society of India, Nirma University', meta:'Treasurer · Aug 2025–Sep 2026', body:'Organized HACKaMINeD and managed HackNUThon finances and logistics.' },
      { title:'Vidhyadaan Foundation', meta:'Volunteer Teacher · Jun–Jul 2024', body:'Taught mathematics, English and science to 50 children.' }
    ] },
    { id:'skills', title:'Tools I work with', label:'Skills', entries:[
      { title:'Languages', body:'Python, C++, C, TypeScript, JavaScript and SQL. English, French (academic), Hindi and Gujarati.' },
      { title:'AI and engineering', body:'PyTorch, LangGraph, NLP, machine unlearning, explainable AI, FastAPI, Flask, React, Apache Iceberg, Spark, Kafka, Prometheus, Grafana and Docker.' },
      { title:'Competitive programming', body:'300+ problems solved across platforms.', href:'/workspace/programming', link:'See programming activity' }
    ] }
  ];

  let active = $state(-1);
  let opened = $state(0);
  let walking = $state(false);
  let reaching = $state(false);
  let holding = $state(false);

  onMount(() => {
    active = chapters.length;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || location.hash) {
      opened = chapters.length;
      return;
    }
    active = -1;
    opened = 0;
    const timers = chapters.flatMap((_, index) => {
      const start = 1100 + index * 3300;
      return [
        setTimeout(() => { active = index; walking = true; holding = false; }, start),
        setTimeout(() => { walking = false; reaching = true; }, start + 800),
        setTimeout(() => { reaching = false; holding = true; }, start + 1500),
        setTimeout(() => { opened = Math.max(opened, index + 1); }, start + 2100)
      ];
    });
    const finish = 1100 + chapters.length * 3300;
    timers.push(setTimeout(() => { active = chapters.length; walking = true; holding = false; }, finish));
    timers.push(setTimeout(() => { walking = false; }, finish + 800));
    return () => timers.forEach(timer => clearTimeout(timer));
  });
</script>

<svelte:head>
  <title>Resume</title>
  <meta name="description" content="A guided résumé covering applied AI engineering, research, projects, education and community work." />
</svelte:head>

<main id="main-content" class="resume">
  <div class="layout">
    <header class="hero">
      <h1>Resume</h1>
      <a class="download" href={base + '/Param_Desai%20RESUME.pdf'} download="Param_Desai_Resume.pdf">Download PDF <Download size={17} /></a>
    </header>

    <div class="bookshelf" style:--count={chapters.length} style:--stop={active}>
      <div class="upper-shelf" aria-hidden="true">
        {#each Array(24) as _, index}
          <i style:--height={55 + (index * 19) % 42 + '%'} style:--width={14 + (index * 11) % 24 + 'px'}></i>
        {/each}
      </div>
      <div class="portrait" aria-hidden="true">
        <div class="walker" class:walking class:reaching class:holding>
          <img src="/pixel-param.png" alt="" width="64" height="64" />
          <span class="shirt"></span>
          <span class="leg"></span><span class="leg"></span>
          <span class="arm"></span>
          {#if holding}<span class="held-book"></span>{/if}
        </div>
      </div>
      <nav aria-label="Resume chapters">
        {#each chapters as chapter, index (chapter.id)}
          <div class="book-group">
            <i aria-hidden="true"></i>
            <a href={'#' + chapter.id} class:opened={index < opened} class:selected={index === active} class:pulling={index === active && reaching} class:removed={index === active && holding} onclick={() => { opened = Math.max(opened, index + 1); }}>{chapter.label}</a>
            <i aria-hidden="true"></i>
          </div>
        {/each}
      </nav>
    </div>

    <div class="story">
      <div class="open-books">
      {#each chapters as chapter, index (chapter.id)}
        {#if index < opened}
        <article id={chapter.id} aria-labelledby={chapter.id + '-heading'}>
          <div class="chapter-title"><h2 id={chapter.id + '-heading'}>{chapter.title}</h2></div>
          {#each chapter.entries as entry (entry.title)}
            <section class="entry">
              <h3>{entry.title}</h3>
              {#if entry.meta}<p class="meta">{entry.meta}</p>{/if}
              <p>{entry.body}</p>
              {#if entry.href}<a href={entry.href}>{entry.link}</a>{/if}
            </section>
          {/each}
        </article>
        {/if}
      {/each}
      </div>

      <footer><a href="https://github.com/paramdesai24">GitHub</a><a href="https://scholar.google.com/citations?user=qj1nZ4EAAAAJ">Google Scholar</a><a href="mailto:desaiparam2412@gmail.com">Email</a></footer>
    </div>
  </div>
</main>

<style>
  .resume { background:#eaf1ed; color:#102b35; font-family:"Instrument Sans",system-ui,sans-serif; }
  .layout { width:min(100%,1320px); margin:auto; padding:clamp(1rem,5vw,5rem); }
  .bookshelf { --sprite:52px; position:relative; padding:1rem 3.5rem 0; background:#173f50; border:6px solid #102b35; border-bottom:12px solid #102b35; border-radius:.6rem; margin-bottom:2rem; }
  .portrait { position:absolute; inset:auto 3.5rem 0; z-index:1; pointer-events:none; }
  .walker { position:absolute; bottom:0; left:clamp(-1.75rem,calc((var(--stop) + .5) * 100% / var(--count)),calc(100% + 1.75rem)); width:var(--sprite); aspect-ratio:.82; transform:translateX(-50%); transition:left 420ms ease-in-out, top 420ms ease-in-out; }
  .walker img { position:absolute; top:0; left:12%; z-index:2; width:76%; height:auto; image-rendering:pixelated; }
  .shirt { position:absolute; z-index:1; top:50%; left:21%; width:58%; height:27%; border-radius:25% 25% 8% 8%; background:linear-gradient(115deg,#628eaa,#284e70); }
  .leg { position:absolute; bottom:2%; left:32%; width:15%; height:27%; background:#24394b; border-bottom:4px solid #101d2a; transform-origin:top; transform:rotate(calc(var(--stride,0) * 34deg)); }
  .leg + .leg { left:53%; transform:rotate(calc(var(--stride,0) * -34deg)); }
  .walking .leg { animation:step .24s ease-in-out infinite alternate; }
  .walking .leg + .leg { animation-direction:alternate-reverse; }
  @keyframes step { from { transform:rotate(-28deg); } to { transform:rotate(28deg); } }
  .held-book { position:absolute; z-index:3; right:5%; bottom:22%; width:32%; height:31%; background:#d9eddd; border:2px solid #385c68; transform:rotate(14deg); }
  nav { display:grid; grid-template-columns:repeat(var(--count),minmax(0,1fr)); gap:0; }
  nav a { margin:0 auto; width:88%; min-height:8rem; padding:.65rem .3rem; text-align:center; color:#102b35; background:#a9c9cb; text-decoration:none; font-weight:700; border-radius:.3rem .45rem .12rem .12rem; border-left:6px solid #385c68; box-shadow:inset 0 -5px #ffffff70; }
  nav a:nth-child(even) { background:#c2d9bd; }
  nav a:is(:hover,.selected) { background:#f0dfa1; }
  nav a.opened { box-shadow:inset 0 -5px #ffffff70,inset 0 3px #f0dfa1; }
  .hero { display:flex; flex-wrap:wrap; align-items:flex-start; justify-content:space-between; gap:.75rem; padding:0 0 clamp(1.5rem,4vw,3rem); }
  .download { display:inline-flex; align-items:center; gap:.5rem; min-height:44px; margin-left:auto; padding:.55rem .85rem; border:1px solid #173f50; border-radius:99px; color:#173f50; text-decoration:none; font-weight:650; }
  .download:hover { background:#d9eddd; }
  h1 { font-size:clamp(3.5rem,10vw,9rem); font-weight:750; line-height:.88; letter-spacing:-.085em; margin:0 0 1.2rem; }
  footer { display:flex; flex-wrap:wrap; gap:.75rem 1rem; margin-top:1.5rem; }
  .open-books { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1.5rem; }
  article { padding:clamp(1rem,2.5vw,2rem); scroll-margin-top:7rem; border:1px solid #55707b70; border-bottom:5px double #8ba59e; border-radius:.9rem .9rem .4rem .4rem; background:linear-gradient(90deg,#f4faf4 47%,#dce8df 50%,#f4faf4 53%); box-shadow:0 4px #385c68; }
  .meta { color:#385c68; font-weight:650; }
  h2 { font-size:clamp(1.8rem,4vw,3.5rem); font-weight:720; letter-spacing:-.055em; line-height:1; margin:0 0 1rem; }
  .entry { padding:1rem 0; max-width:66ch; }
  .entry + .entry { border-top:1px solid #55707b36; }
  h3 { font-size:1.3rem; font-weight:700; margin:0 0 .3rem; }
  .entry p { margin:.35rem 0; line-height:1.6; }
  .entry a,footer a { color:#175773; text-decoration:underline; text-underline-offset:.2em; }
  footer { border-top:1px solid #55707b70; padding:1rem 0 2rem; }
  @media(max-width:740px) {
    .bookshelf { --row:3.4rem; --sprite:36px; padding:1.2rem .8rem 1.2rem 3.5rem; }
    .portrait { inset:1.2rem auto 1.2rem 1.6rem; }
    .walker { bottom:auto; left:0; top:clamp(-1.35rem,calc(var(--stop) * var(--row)),calc(100% - 1.65rem)); }
    nav { grid-template-columns:1fr; grid-auto-rows:var(--row); }
    nav a { width:100%; min-height:0; align-self:center; text-align:left; padding:.45rem .75rem; }
    .open-books { grid-template-columns:1fr; }
  }
  @media(prefers-reduced-motion:reduce) { .walker { transition:none; } .walking .leg { animation:none; } }
  .bookshelf { --sprite:76px; border-width:12px; border-bottom-width:20px; box-shadow:0 12px 24px #102b3538,inset 0 8px 22px #091d27; }
  .upper-shelf { height:clamp(105px,17vw,210px); display:flex; align-items:end; gap:4px; border-bottom:12px solid #385c68; margin:0 -3.5rem; padding:0 1.25rem; overflow:hidden; }
  .upper-shelf i,.book-group i { display:block; background:linear-gradient(90deg,#102b3540,transparent 30%),repeating-linear-gradient(0deg,transparent 0 10px,#f5e9bd65 11px 13px,transparent 14px 24px),#648994; border-radius:4px 4px 1px 1px; }
  .upper-shelf i { height:var(--height); flex:1 0 min(var(--width),3%); }
  .upper-shelf i:nth-child(3n),.book-group i:last-child { background-color:#a5bfa5; }
  .upper-shelf i:nth-child(4n) { background-color:#b49967; }
  .book-group { display:flex; align-items:end; justify-content:center; gap:3px; min-width:0; }
  .book-group i { width:12%; height:70%; }
  .book-group i:last-child { height:84%; }
  nav { padding-top:1rem; }
  nav a { width:70%; min-height:clamp(8rem,17vw,13rem); margin:0; overflow-wrap:anywhere; transition:transform .7s ease,opacity .2s; }
  nav a.pulling { transform:translate(12px,-14px) rotate(12deg); }
  nav a.removed { opacity:0; pointer-events:none; }
  .walker { transition-duration:800ms; }
  .arm { position:absolute; z-index:3; top:55%; left:57%; width:42%; height:10%; background:linear-gradient(90deg,#628eaa 70%,#dca17b 70%); transform-origin:left center; transform:rotate(65deg); transition:transform .4s; }
  .reaching .arm { transform:rotate(-38deg) scaleX(1.35); }
  .holding .arm { transform:rotate(14deg); }
  .held-book { right:-12%; bottom:29%; background:linear-gradient(90deg,#385c68 20%,#f0dfa1 20%); }
  article { position:relative; isolation:isolate; perspective:900px; }
  article::after { content:''; position:absolute; z-index:1; inset:0 0 0 50%; background:#a9c9cb; border:1px solid #385c68; border-radius:0 .75rem .3rem 0; transform-origin:left; pointer-events:none; animation:open-cover .85s ease-in-out both; }
  @keyframes open-cover { from { transform:rotateY(0); } 80% { opacity:1; } to { transform:rotateY(-180deg); opacity:0; } }
  @media(max-width:740px) {
    .bookshelf { --sprite:38px; --row:4rem; }
    .upper-shelf { height:90px; margin:0 -.8rem 0 -3.5rem; }
    .portrait { top:calc(1.2rem + 90px); }
    .book-group { align-items:center; }
    nav { padding:0; }
    nav a { width:80%; min-height:0; }
  }
  @media(prefers-reduced-motion:reduce) { article::after { display:none; } }
</style>
