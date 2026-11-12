<script lang="ts">
  import { onMount } from 'svelte';
  import ArrowDown from '@lucide/svelte/icons/arrow-down';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import Map from '@lucide/svelte/icons/map';
  import Search from '@lucide/svelte/icons/search';
  import { supabase } from '$lib/supabase';
  import ChapterMedia from '$lib/components/home/ChapterMedia.svelte';

  const chapters = [
    {
      id: 'xeroww', title: 'Xeroww', type: 'Financial engineering', color: '#8dbbdf',
      description: 'A deterministic market research platform for Indian equities. Replay historical sessions candle by candle, document decisions with the evidence available at the time, and compare portfolio risk and performance against the NIFTY 50.',
      contribution: 'I built Xeroww to make market decisions auditable, from the first observation to the portfolio review.',
      viewLines: ["Let’s rewind the market. Sensex first.","Who climbed, and who slid?"],
      link: 'https://github.com/paramdesai24/Xeroww', action: 'View repository',
      images: [
        { label: 'Market overview', file: 'xeroww-screenshot1.png', alt: 'Xeroww market overview with an index chart and Indian market indices', width: 1534, height: 830 },
        { label: 'Market breadth', file: 'xeroww-screenshot2.png', alt: 'Xeroww markets screen with index summaries, gainers and losers', width: 1534, height: 833 }
      ]
    },
    {
      id: 'research', title: 'Research', type: 'Trustworthy AI', color: '#a4d9df',
      description: 'My research spans explainable AI, machine unlearning, federated learning, and security. I presented our work on false data injection detection for connected vehicles at IEEE ICSC 2025 in Tampa.',
      contribution: 'The paper’s diagram follows the pipeline from vehicle data through detection, explanation, and communication.',
      viewLines: ["From vehicle data to a Tampa stage.","What happens when a sensor lies?"],
      link: '/workspace/research', action: 'Explore research',
      images: [
        { label: 'Tampa presentation', file: 'research-screenshot1.jpg', alt: 'Param presenting connected vehicle security research at the University of Tampa', width: 1280, height: 699 },
        { label: 'Paper figure', file: 'research-screenshot2.png', alt: 'Paper diagram showing data capture, machine learning and quantum management, and communications', width: 1378, height: 418 }
      ]
    },
    {
      id: 'bhoomi', title: 'BHOOMI', type: 'Geospatial decision support', color: '#b7ddb0',
      description: 'BHOOMI uses satellite observations and grid-based maps to help planners compare local environmental conditions and examine potential interventions.',
      contribution: 'Our team built the environmental planning prototype and submitted a manuscript to ASME’s Journal of Computing and Information Science in Engineering.',
      viewLines: ["Where does Ahmedabad run hottest?","How green is this part of Ahmedabad?"],
      link: '/workspace/projects/bhoomi', action: 'Read case study',
      images: [
        { label: 'Surface temperature', file: 'bhoomi-screenshot1.png', alt: 'BHOOMI MODIS surface temperature map for Ahmedabad with a selected grid cell and time series', width: 1518, height: 862 },
        { label: 'Vegetation cover', file: 'bhoomi-screenshot2.png', alt: 'BHOOMI Sentinel-2 NDVI vegetation cover map for Ahmedabad with a selected grid cell and time series', width: 1514, height: 862 }
      ]
    },
    {
      id: 'fc-analytics', title: 'FC Analytics', type: 'Football modelling', color: '#dce5a0',
      description: 'A World Cup analytics platform for exploring simulated tournament outcomes, comparing teams, and running a mock draft auction.',
      contribution: 'The tournament view shows simulated outcomes. The auction view shows the draft workflow.',
      viewLines: ["What if we replayed the World Cup?","Who’s bidding, and who’s nearly broke?"],
      link: '/workspace/projects/fc-analytics', action: 'Read case study',
      images: [
        { label: 'Tournament simulation', file: 'fc-analytics-screenshot1.png', alt: 'FC Analytics tournament dashboard with simulated outcomes and group results', width: 1373, height: 862 },
        { label: 'Mock auction', file: 'fc-analytics-screenshot2.png', alt: 'FC Analytics mock auction room with a player on the block and team budgets', width: 1418, height: 862 }
      ]
    }
  ];

  const destinations = [
    ['Projects', '/workspace/projects'], ['Publications', '/workspace/publications'],
    ['About', '/workspace/resume']
  ];

  const contactLinks = [
    ['GitHub', 'https://github.com/paramdesai24'],
    ['ResearchGate', 'https://www.researchgate.net/profile/Param-Desai-2?ev=hdr_xprf'],
    ['LinkedIn', 'https://www.linkedin.com/in/paramdesai7/'],
    ['Email', 'mailto:desaiparam24@gmail.com']
  ];

  let active = $state('home');
  let chapterSelection = $state<Record<string, number>>({});
  let head = $state<HTMLDivElement>();
  let reaction = $state('');
  let expression = $state<'neutral' | 'tickle' | 'sneeze'>('neutral');
  let views = $state<number | null>(null);
  let timer: ReturnType<typeof setTimeout>;
  let lastTickle = -Infinity;
  let movements = 0;
  let lastMove = 0;

  function react(message: string, face: typeof expression = 'neutral', duration = 3600) {
    reaction = message;
    expression = face;
    clearTimeout(timer);
    timer = setTimeout(() => {
      reaction = '';
      expression = 'neutral';
    }, duration);
  }

  function tickle(event?: PointerEvent) {
    if (event) {
      if (event.pointerType === 'touch') return;
      if (performance.now() - lastMove > 350) movements = 0;
      lastMove = performance.now();
      if (++movements < 6) return;
    }
    if (performance.now() - lastTickle < 4800) return;
    lastTickle = performance.now();
    movements = 0;
    react('Hey, that tickles!', 'tickle');
  }

  onMount(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-home-section]'));
    const walks = Array.from(document.querySelectorAll<HTMLElement>('.chapter-walk'));
    const initial = { x: 0, y: 0 };
    let frame = 0;
    let hiddenAt = 0;
    let lastWelcome = -Infinity;
    let shown = false;
    let mounted = true;
    let idleTimer: ReturnType<typeof setTimeout>;

    function activity() {
      clearTimeout(idleTimer);
      if (document.hidden || motion.matches) return;
      idleTimer = setTimeout(() => {
        if (active === 'home' && !reaction) react('Achoo! Pixel dust.', 'sneeze', 2200);
      }, 12000);
    }

    async function registerView() {
      try {
        await supabase.from('page_views').insert([{}]);
        const { count, error } = await supabase.from('page_views').select('*', { count: 'exact', head: true });
        if (mounted && !error) views = count;
      } catch {
        // The tour is available when the counter is offline.
      }
    }
    void registerView();

    function update() {
      frame = 0;
      const marker = innerHeight * 0.46;
      active = sections.findLast((section) => section.getBoundingClientRect().top <= marker)?.id ?? 'home';
      if (!motion.matches) {
        for (const walk of walks) {
          const { top } = walk.getBoundingClientRect();
          const progress = Math.max(0, Math.min(1, (innerHeight * .72 - top) / (innerHeight * .42)));
          const stride = Math.sin(progress * Math.PI * 12);
          walk.style.setProperty('--progress', String(progress));
          walk.style.setProperty('--stride', String(stride));
          walk.style.setProperty('--lift', String(Math.abs(stride)));
          walk.style.setProperty('--costume', String(Math.max(0, Math.min(1, (progress - .44) / .12))));
        }
      }
      if (!head) return;
      const rect = head.getBoundingClientRect();
      const clamp = (value: number) => Math.max(-1, Math.min(1, value));
      const resting = motion.matches || !shown || active !== 'home';
      const x = resting ? 0 : clamp((initial.x - rect.left - rect.width / 2) / Math.max(100, innerWidth * .36));
      const y = resting ? 0 : clamp((initial.y - rect.top - rect.height / 2) / Math.max(100, innerHeight * .44));
      head.style.setProperty('--gaze-x', String(x));
      head.style.setProperty('--gaze-y', String(y));
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    function pointer(event: PointerEvent) {
      activity();
      if (event.pointerType === 'touch' || active !== 'home') return;
      shown = true;
      initial.x = event.clientX;
      initial.y = event.clientY;
      schedule();
    }

    function leave() {
      shown = false;
      schedule();
    }

    function visibility() {
      activity();
      if (document.hidden) {
        hiddenAt = performance.now();
        return;
      }
      const now = performance.now();
      if (hiddenAt && now - hiddenAt > 1400 && now - lastWelcome > 8000) {
        lastWelcome = now;
        react('Welcome back! Pick up wherever you left off.');
      }
      hiddenAt = 0;
    }

    function scroll() {
      activity();
      schedule();
    }

    update();
    activity();
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('keydown', activity);
    window.addEventListener('pointerdown', activity, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('pointermove', pointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', scroll);

    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      clearTimeout(idleTimer);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('keydown', activity);
      window.removeEventListener('pointerdown', activity);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('pointermove', pointer);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', scroll);
    };
  });
</script>

<svelte:head>
  <title>Param Desai's Portfolio</title>
  <meta name="description" content="Param Desai’s research in trustworthy AI and projects in markets, urban environmental planning, and football analytics." />
  <link rel="canonical" href="https://paramdesai24.me/" />
  <meta property="og:title" content="Param Desai's Portfolio" />
  <meta property="og:description" content="Explore Xeroww, published research, BHOOMI and FC Analytics." />
  <meta property="og:image" content="https://paramdesai24.me/avatar.png" />
  <meta property="og:url" content="https://paramdesai24.me/" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

{#snippet guide(id: string, walking = false)}
  <span class={'guide-figure outfit-' + id} aria-hidden="true">
    {#if id === 'xeroww' && !walking}
      <span class="market-board"><i></i><i></i><i></i><i></i><i></i></span>
    {/if}
    <span class="guide-outfit"></span>
    <span class="guide-photo"><img src="/pixel-param.png" alt="" width="64" height="64" loading="lazy" /></span>
    {#if id === 'bhoomi'}<span class="field-hat"></span>{/if}
    <span class="guide-arm"><span class="guide-hand"></span></span>
    {#if id === 'research'}
      <span class="held-prop magnifier"><Search size="100%" strokeWidth={2.1} /></span>
    {:else if id === 'bhoomi'}
      <span class="held-prop field-map"><Map size="100%" strokeWidth={1.5} /></span>
    {:else if id === 'fc-analytics'}
      <span class="held-prop football"><i></i><i></i><i></i><i></i><i></i></span>
    {/if}
  </span>
{/snippet}

<div class="portfolio">
  <main id="main-content">
    <section id="home" class="hero" style:--to={chapters[0].color} data-home-section>
      <div class="hero-content">
        <div class="intro">
          <p class="location">Ahmedabad, India</p>
          <h1>Param<br />Desai<span>.</span></h1>
          <p class="lead">I ask a lot of “what if?” questions. Some of them turn into websites.</p>
          <p class="bio">What if I could rewind the stock market? Replay the World Cup 10,000 times? Or tell when a car’s sensors are feeding it bad data? That’s what you’ll find below.</p>
          <a class="tour" href="#xeroww">Explore my projects <ArrowDown size={18} /></a>
        </div>
        <div class="character" class:reacting={expression === 'tickle'} class:sneezing={expression === 'sneeze'}>
          <p class="bubble" aria-live="polite">{active === 'home' && reaction ? reaction : 'Hey, I’m Param. Let me show you around.'}</p>
          <div class="figure">
            <div class="portrait" bind:this={head}>
              <img src="/pixel-param.png" alt="Pixel-art cartoon of Param Desai" width="64" height="64" fetchpriority="high" />
              {#if expression !== 'neutral'}
                <span class="closed-eye eye-left" aria-hidden="true"></span>
                <span class="closed-eye eye-right" aria-hidden="true"></span>
              {/if}
            </div>
            <div class="trousers" aria-hidden="true"><span></span><span></span></div>
            <button class="torso" onpointermove={tickle} onclick={() => tickle()} aria-label="Tickle Param’s character">
              <span aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>
    </section>

    {#each chapters as chapter, index}
      <section id={chapter.id} class="chapter" class:guide-right={index % 2 === 1} style:--chapter={chapter.color} style:--from={chapters[index - 1]?.color ?? 'var(--opening)'} style:--to={chapters[index + 1]?.color ?? 'var(--closing)'} data-home-section>
        {#if index > 0}
          <div class="chapter-walk" class:walk-left={index % 2 === 0} aria-hidden="true">
            <div class="walk-track">
              <div class="walker">
                <span class="walk-legs"><i></i><i></i></span>
                <div class="walk-costume previous">{@render guide(chapters[index - 1].id, true)}</div>
                <div class="walk-costume next">{@render guide(chapter.id, true)}</div>
              </div>
            </div>
          </div>
        {/if}
        <div class="chapter-inner">
          <div class="chapter-heading">
            <div><p class="category">{chapter.type}</p><h2>{chapter.title}</h2></div>
            <a class="chapter-link" href={chapter.link}>{chapter.action} <ArrowUpRight size={17} /></a>
          </div>
          <div class="chapter-body">
            <div class="chapter-copy">
              <p class="description">{chapter.description}</p>
              <p class="contribution">{chapter.contribution}</p>
              <div class="chapter-guide" class:current={active === chapter.id}>
                {@render guide(chapter.id)}
                <p aria-live="polite">{chapter.viewLines[chapterSelection[chapter.id] ?? 0]}</p>
              </div>
            </div>
            <div class="chapter-media">
              <ChapterMedia images={chapter.images} matte={chapter.id === 'research' ? '#fff' : undefined} onselect={(selection) => { chapterSelection[chapter.id] = selection; }} />
            </div>
          </div>
        </div>
      </section>
    {/each}

    <section class="more" id="explore" aria-labelledby="explore-title" style:--from={chapters.at(-1)?.color} data-home-section>
      <div class="more-inner" class:current={active === 'explore'}>
        <h2 id="explore-title">Explore<br />more<span>.</span></h2>
        <div class="more-links">
          <nav class="destinations" aria-label="More projects and information">
            {#each destinations as [label, href]}
              <a {href}>{label} <ArrowUpRight size={22} /></a>
            {/each}
          </nav>
          <nav class="contact-links" aria-label="Find me online">
            {#each contactLinks as [label, href]}
              <a {href}>{label} <ArrowUpRight size={14} /></a>
            {/each}
          </nav>
        </div>
        <div class="contact-guide">
          <p class="farewell-bubble">Bye for now. Come back anytime!</p>
          <div class="guide-figure" aria-hidden="true">
            <span class="guide-outfit"></span>
            <span class="guide-photo"><img src="/pixel-param.png" alt="" width="64" height="64" loading="lazy" /></span>
            <span class="guide-arm farewell-wave"><span class="wave-hand"></span></span>
            <span class="guide-arm farewell-point"><span class="guide-hand"></span></span>
          </div>
        </div>
      </div>
      {#if views !== null}<p class="view-count">{views.toLocaleString('en-IN')} views</p>{/if}
    </section>
  </main>
</div>

<style>
  .portfolio { --opening:#183d6b; --closing:#f3dc76; --ink:#101d2a; --accent:#c8e9f8; --grid:#ffffff1c; color:var(--ink); background:var(--opening); font-family:"Instrument Sans",system-ui,sans-serif; }
  .portfolio :is(a,button):focus-visible { outline:2px solid currentColor; outline-offset:5px; }
  [data-home-section] { scroll-margin-top:72px; }
  .hero h1 span { color:var(--accent); }
  .hero { box-sizing:border-box; min-height:calc(100svh - 72px); display:grid; align-items:center; padding:clamp(1rem,3svh,2.75rem) clamp(1rem,5vw,5.5rem); color:#fff; background:linear-gradient(to right,var(--grid) 1px,transparent 1px) 0 0 / 12.5% 100%, linear-gradient(in oklab,var(--opening) 35%,color-mix(in oklab,var(--opening),var(--to))); }
  .hero-content { width:100%; display:grid; grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr); gap:1.5rem; align-items:center; max-width:1550px; margin:auto; }
  .location,.category { font:650 .8rem/1.4 "Instrument Sans",system-ui,sans-serif; letter-spacing:.075em; text-transform:uppercase; }
  h1,h2,p { margin:0; }
  .hero h1,.chapter h2,.more h2 { font-family:"Instrument Sans",Arial,sans-serif; font-weight:700; letter-spacing:-.085em; line-height:.86; }
  .hero h1 { font-size:clamp(3.6rem,min(16vw,25svh),15.5rem); margin:.6rem 0 clamp(.85rem,2.4svh,1.6rem); }
  .lead { font-size:clamp(1.12rem,min(2vw,3.2svh),1.75rem); font-weight:660; max-width:29ch; line-height:1.23; }
  .bio { max-width:49ch; margin:.65rem 0 clamp(.8rem,2svh,1.4rem); opacity:1; }
  .tour,.chapter-link { display:inline-flex; align-items:center; justify-content:center; gap:.6rem; min-height:44px; border:1px solid; padding:.65rem 1.05rem; border-radius:99px; font-weight:680; text-decoration:none; }
  .tour { background:var(--accent); color:#171a0c; box-shadow:3px 4px 0 #171a0c; }
  .tour:hover,.chapter-link:hover { transform:translateY(-2px); }
  .character { align-self:stretch; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:1rem 0; }
  .bubble { position:relative; z-index:2; color:#181918; background:#fffef7; border:1px solid #242623; border-radius:1rem; box-shadow:4px 5px 0 #242623; width:min(25ch,100%); min-block-size:calc(3lh + 1.6rem + 2px); display:grid; align-items:center; padding:.8rem 1rem; font-weight:680; margin-bottom:1.2rem; }
  .figure { position:relative; width:min(100%,clamp(142px,min(31vw,53svh),480px)); aspect-ratio: .78; transform-origin:50% 80%; }
  .portrait { position:absolute; z-index:2; width:63%; aspect-ratio:1; left:18.5%; top:0; transform:translate(calc(var(--gaze-x,0) * 7%),calc(var(--gaze-y,0) * 6%)) rotate(calc(var(--gaze-x,0) * 12deg)); transition:transform .16s ease-out; pointer-events:none; }
  .portrait img,.guide-photo img { display:block; width:100%; height:100%; object-fit:contain; image-rendering:pixelated; filter:brightness(1.07) saturate(.91); }
  .torso { position:absolute; left:17%; right:17%; top:42%; height:38%; background:linear-gradient(115deg,#516789 0 18%,#425979 18% 34%,#344c6e 34% 58%,#283d59 58% 80%,#20334c 80%); clip-path:polygon(0 25%,3% 25%,3% 17%,8% 17%,8% 10%,16% 10%,16% 5%,27% 5%,27% 0,73% 0,73% 5%,84% 5%,84% 10%,92% 10%,92% 17%,97% 17%,97% 25%,100% 25%,100% 92%,96% 92%,96% 100%,4% 100%,4% 92%,0 92%); cursor:pointer; }
  .torso::before { content:''; position:absolute; inset:0; background:#7590ab44; clip-path:polygon(23% 1%,38% 0,53% 87%,23% 34%,29% 24%,20% 20%,79% 20%,71% 25%,77% 34%,53% 87%,65% 0,78% 1%); }
  .torso:focus-visible { filter:brightness(1.28); }
  .torso span { position:absolute; inset:0 32% 14%; background:linear-gradient(120deg,#e2f2fb,#91b4cc); clip-path:polygon(0 0,100% 0,53% 100%); }
  .trousers { position:absolute; top:75%; bottom:0; left:29%; right:29%; display:flex; gap:8%; }
  .trousers span { width:46%; border-bottom:12px solid #141a1d; border-radius:0 0 22% 22% / 0 0 12% 12%; background:linear-gradient(105deg,#505961 0 22%,#414951 22% 54%,#323940 54% 78%,#292f35 78%); }
  .closed-eye { position:absolute; top:49%; width:17%; height:10%; background:linear-gradient(#d3946a 0 45%,#eba67a 45% 78%,#c9825e 78%); clip-path:polygon(0 19%,14% 19%,14% 4%,83% 4%,83% 19%,100% 19%,100% 77%,84% 77%,84% 94%,12% 94%,12% 77%,0 77%); }
  .closed-eye::after { content:''; position:absolute; inset:31% 10% 26%; background:#54352d; clip-path:polygon(0 74%,18% 74%,18% 39%,36% 39%,36% 11%,64% 11%,64% 39%,82% 39%,82% 74%,100% 74%,100% 100%,71% 100%,71% 69%,52% 69%,52% 51%,46% 51%,46% 69%,28% 69%,28% 100%,0 100%); }
  .eye-left { left:23%; top:50.5%; }
  .eye-right { left:55%; top:47.7%; }
  .sneezing .figure { animation:sneeze .74s ease-in-out; }
  @keyframes sneeze { 24% { transform:translateY(-3%) rotate(-5deg); } 51% { transform:translateY(4%) rotate(7deg) scale(.99,.95); } 76% { transform:translateY(-1%); } }
  .reacting .figure { animation:recoil .55s ease-in-out 2; }
  @keyframes recoil { 25% { rotate:-4deg; } 70% { rotate:4deg; } }
  .chapter {
    --chapter-padding:clamp(3rem,7vw,7rem);
    position:relative;
    background:linear-gradient(in oklab,
      color-mix(in oklab,var(--from),var(--chapter)),
      var(--chapter) 50%,
      color-mix(in oklab,var(--chapter),var(--to))) var(--chapter);
    padding:var(--chapter-padding) clamp(1rem,5vw,5.5rem);
  }
  .chapter-inner { max-width:1550px; margin:auto; }
  .chapter-heading { display:flex; justify-content:space-between; align-items:end; flex-wrap:wrap; gap:1rem; padding-bottom:clamp(1.25rem,3vw,2.6rem); border-bottom:1px solid #262b2150; }
  .chapter h2,.more h2 { font-size:clamp(3.5rem,8.5vw,9rem); margin-top:.6rem; }
  .chapter-link { background:#fffef7; flex:none; }
  .chapter-body { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,2.35fr); grid-template-areas:"copy media"; gap:clamp(1rem,4vw,4rem); margin-top:clamp(1.4rem,3vw,3rem); }
  .guide-right .chapter-body { grid-template-columns:minmax(0,2.35fr) minmax(0,1fr); grid-template-areas:"media copy"; }
  .chapter-copy { grid-area:copy; }
  .chapter-media { grid-area:media; min-width:0; }
  .guide-right .chapter-guide .guide-figure { transform:scaleX(-1); }
  .chapter-walk { position:absolute; inset:0 0 auto; z-index:4; pointer-events:none; padding-inline:clamp(1rem,5vw,5.5rem); }
  .walk-track { position:relative; max-width:1550px; margin:auto; }
  .walker {
    --distance:var(--progress,0);
    --direction:1;
    position:absolute; top:50%; left:calc(12% + 76% * var(--distance));
    width:clamp(64px,9vw,130px); aspect-ratio:1;
    opacity:clamp(0,min(var(--progress,0),1 - var(--progress,0)) * 12,1);
    transform:translate(-50%,calc(-50% - var(--lift,0) * 5%)) scaleX(var(--direction));
  }
  .walk-left .walker { --distance:calc(1 - var(--progress,0)); --direction:-1; }
  .walk-costume { position:absolute; inset:0; }
  .walk-costume .guide-figure { width:100%; }
  .walk-costume .guide-arm { transform:rotate(calc(18deg - var(--stride,0) * 21deg)); }
  .walk-costume.previous { opacity:calc(1 - var(--costume,0)); }
  .walk-costume.next { opacity:var(--costume,0); }
  .walk-legs { position:absolute; inset:74% 37% 0 21%; display:flex; justify-content:space-between; }
  .walk-legs i { width:42%; background:#303740; border-bottom:5px solid #151a20; transform-origin:50% 0; transform:rotate(calc(var(--stride,0) * 33deg)); }
  .walk-legs i + i { background:#424b55; transform:rotate(calc(var(--stride,0) * -33deg)); }
  .description { font-size:clamp(1.14rem,1.8vw,1.55rem); font-weight:680; line-height:1.3; }
  .contribution { margin-top:1rem; max-width:40ch; }
  .chapter-guide { margin-top:1.55rem; display:grid; gap:.65rem; align-items:start; }
  .guide-figure { --skin:#dfaa83; position:relative; display:block; width:min(100%,260px); aspect-ratio:1.24; }
  .guide-photo { position:absolute; z-index:2; top:0; left:12%; width:57%; aspect-ratio:1; }
  .guide-outfit { position:absolute; z-index:1; top:56%; left:10%; width:64%; height:43%; background:linear-gradient(116deg,var(--light) 0 22%,var(--outfit) 22% 62%,var(--shade) 62%); clip-path:polygon(0 25%,4% 25%,4% 16%,11% 16%,11% 8%,23% 8%,23% 0,77% 0,77% 8%,89% 8%,89% 16%,96% 16%,96% 25%,100% 25%,100% 94%,94% 94%,94% 100%,6% 100%,6% 94%,0 94%); }
  .guide-arm { position:absolute; z-index:3; left:59%; top:69%; width:28%; height:14%; background:linear-gradient(0deg,var(--shade) 0 30%,var(--outfit) 30% 72%,var(--light) 72%); transform:rotate(-19deg); transform-origin:left center; border-radius:2px; }
  .guide-hand { position:absolute; right:-19%; top:9%; width:29%; height:80%; background:linear-gradient(0deg,#b87957 0 24%,var(--skin) 24%); clip-path:polygon(0 20%,17% 20%,17% 8%,58% 8%,58% 0,100% 0,100% 23%,74% 23%,74% 81%,60% 81%,60% 100%,0 100%); }
  .outfit-xeroww { --light:#4b6177; --outfit:#354a60; --shade:#233347; }
  .outfit-research { --light:#fffdf1; --outfit:#efedf6; --shade:#c6c2d8; }
  .outfit-bhoomi { --light:#a0a578; --outfit:#737a51; --shade:#48583e; }
  .outfit-fc-analytics { --light:#fa7892; --outfit:#e24f70; --shade:#a92649; }
  .guide-outfit::after { content:''; position:absolute; inset:6% 20% 8%; }
  .outfit-xeroww .guide-outfit::after { background:linear-gradient(90deg,#b2c37b,#778e47); clip-path:polygon(43% 0,57% 0,55% 18%,61% 82%,50% 100%,39% 82%,45% 18%); }
  .outfit-research .guide-outfit::after { background:#798ab1; clip-path:polygon(12% 0,36% 0,50% 67%,66% 0,88% 0,72% 37%,50% 83%,28% 37%,12% 0,0 100%,0 60%,24% 60%,24% 82%,0 82%); }
  .outfit-bhoomi .guide-outfit::after { background:#c3b88a; clip-path:polygon(0 42%,37% 42%,37% 78%,0 78%,0 42%,63% 42%,100% 42%,100% 78%,63% 78%,63% 42%); }
  .outfit-fc-analytics .guide-outfit::after { background:#272336; clip-path:polygon(22% 0,78% 0,66% 21%,50% 29%,34% 21%,22% 0,2% 100%,2% 48%,30% 48%,30% 74%,2% 74%); }
  .field-hat { position:absolute; z-index:3; top:4%; left:9%; width:62%; height:25%; background:linear-gradient(#c6bc8f 0 39%,#a69b70 39% 65%,#5d684d 65% 79%,#b3a77b 79%); clip-path:polygon(0 78%,15% 69%,22% 15%,29% 15%,29% 4%,74% 4%,74% 15%,81% 15%,87% 68%,100% 79%,100% 100%,0 100%); }
  .market-board { position:absolute; top:12%; right:0; width:49%; height:49%; display:flex; align-items:center; justify-content:space-evenly; background:repeating-linear-gradient(0deg,transparent 0 13px,#a9d4e123 13px 14px),#1b2c3c; border:3px solid #516678; border-radius:6px; box-shadow:3px 4px #1b2c3c38; transform:rotate(5deg); }
  .market-board i { position:relative; width:9%; height:32%; background:#83ddab; transform:translateY(25%); }
  .market-board i::before { content:''; position:absolute; left:calc(50% - 1px); top:-24%; width:2px; height:148%; background:inherit; }
  .market-board i:nth-child(2n) { background:#ea8b84; transform:translateY(11%); }
  .market-board i:nth-child(n+4) { transform:translateY(-41%); }
  .held-prop { position:absolute; z-index:4; display:grid; place-items:center; right:0; top:39%; width:32%; aspect-ratio:1; }
  .magnifier { color:#343955; background:#d8edfbba; border-radius:50% 50% 58% 48%; transform:rotate(17deg); }
  .field-map { color:#3f624a; background:linear-gradient(90deg,#c9d6a4 0 32%,#e9e2b7 32% 67%,#b7c497 67%); border:2px solid #556747; border-radius:2px; transform:rotate(-12deg); }
  .football { top:31%; right:1%; width:28%; display:block; overflow:hidden; border:2px solid #242b39; border-radius:50%; background:radial-gradient(circle at 32% 23%,#fffef6 12%,#f2f0e6 56%,#a5afbd 100%); box-shadow:2px 4px 0 #242b3929; }
  .football i { position:absolute; display:block; width:36%; aspect-ratio:1; background:#293343; clip-path:polygon(50% 0,100% 34%,81% 95%,19% 95%,0 34%); }
  .football i:nth-child(1) { top:31%; left:33%; }
  .football i:nth-child(2) { top:-6%; left:18%; rotate:28deg; }
  .football i:nth-child(3) { top:15%; right:-12%; rotate:-12deg; }
  .football i:nth-child(4) { bottom:-11%; right:12%; rotate:20deg; }
  .football i:nth-child(5) { bottom:7%; left:-10%; rotate:-16deg; }
  .football::before { content:''; position:absolute; inset:0; background:linear-gradient(68deg,transparent 44%,#75808e 45% 47%,transparent 48%) 0 0/65% 60% no-repeat, linear-gradient(153deg,transparent 47%,#75808e 48% 50%,transparent 51%) 100% 12%/52% 61% no-repeat,linear-gradient(72deg,transparent 45%,#75808e 46% 48%,transparent 49%) 97% 100%/58% 56% no-repeat,linear-gradient(151deg,transparent 45%,#75808e 46% 48%,transparent 49%) 0 100%/65% 49% no-repeat; }
  .chapter-guide.current .guide-arm { animation:point-in .42s ease-out; }
  .chapter-guide.current .outfit-fc-analytics .football { animation:toss-ball 3.4s infinite; }
  .chapter-guide.current .outfit-fc-analytics .guide-arm { animation:catch-ball 3.4s ease-in-out infinite; }
  .chapter-guide.current .outfit-research .magnifier { animation:inspect-figure 4.6s ease-in-out infinite; }
  .chapter-guide.current .outfit-research .guide-arm { animation:lift-prop 4.6s ease-in-out infinite; }
  .field-map { transform-origin:70% 85%; }
  .chapter-guide.current .outfit-bhoomi .field-map { animation:unfold-map 4.8s ease-in-out infinite; }
  .chapter-guide.current .outfit-bhoomi .guide-photo { animation:read-map 4.8s ease-in-out infinite; }
  @keyframes point-in { from { transform:rotate(10deg); } to { transform:rotate(-19deg); } }
  @keyframes toss-ball {
    0%,24%,78%,100% { transform:translate(0,0) rotate(0); }
    43% { transform:translate(-11%,-70%) rotate(47deg); animation-timing-function:cubic-bezier(.55,.03,.8,.43); }
    58% { transform:translate(-18%,-90%) rotate(94deg); animation-timing-function:cubic-bezier(.62,.08,.92,.47); }
    76% { transform:translate(0,4%) rotate(144deg); }
  }
  @keyframes catch-ball {
    0%,20%,81%,100% { transform:rotate(-19deg); }
    29% { transform:rotate(-38deg); }
    58% { transform:rotate(-23deg); }
    77% { transform:rotate(-10deg); }
  }
  @keyframes inspect-figure {
    0%,24%,79%,100% { transform:rotate(17deg); }
    40%,65% { transform:translate(-27%,-45%) rotate(-5deg) scale(1.07); }
  }
  @keyframes lift-prop {
    0%,24%,79%,100% { transform:rotate(-19deg); }
    40%,65% { transform:rotate(-37deg); }
  }
  @keyframes unfold-map {
    0%,20%,87%,100% { transform:rotate(-12deg) scaleX(.82); }
    40%,67% { transform:translate(-10%,9%) rotate(-5deg) scale(1.17,1.05); }
  }
  @keyframes read-map {
    0%,25%,85%,100% { transform:none; }
    43%,65% { transform:translate(2%,3%) rotate(7deg); }
  }
  .chapter-guide p { font-size:clamp(.9rem,1.15vw,1.06rem); max-width:37ch; min-block-size:calc(2lh + 1.5rem + 2px); display:grid; align-items:center; padding:.75rem .9rem; background:#fffef7; border:1px solid #262b21; border-radius:.85rem; }
  .more {
    --footer-rule:#101d2a45;
    --footer-padding:clamp(3.5rem,7vw,7rem);
    min-height:86svh; display:grid; align-content:center;
    background:linear-gradient(in oklab,color-mix(in oklab,var(--from),var(--closing)),var(--closing) 70%);
    padding:var(--footer-padding) clamp(1rem,5vw,5.5rem) 2rem;
  }
  .more-inner {
    width:100%; max-width:1550px; margin:auto; display:grid;
    grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);
    grid-template-areas:"title links" "guide links"; align-items:center;
    column-gap:clamp(1rem,5vw,6rem);
  }
  .more h2 { grid-area:title; font-size:clamp(4rem,10vw,11rem); margin:0; }
  .more h2 span { color:#655017; }
  .more-links { grid-area:links; }
  .destinations { border-top:1px solid var(--footer-rule); }
  .destinations a {
    display:flex; align-items:center; justify-content:space-between; gap:1rem;
    padding:.55em .15em; min-height:54px; border-bottom:1px solid var(--footer-rule);
    font-size:clamp(1.5rem,3.3vw,3.65rem); font-weight:650; letter-spacing:-.045em;
    line-height:1.12; text-decoration:none;
  }
  .more-links a:hover,.more-links a:focus-visible { color:#594612; }
  .more-links a:focus-visible { outline:2px solid currentColor; outline-offset:3px; }
  .more-links a :global(svg) { flex:none; transition:transform .2s ease; }
  .more-links a:is(:hover,:focus-visible) :global(svg) { transform:translate(3px,-3px); }
  .contact-links { display:flex; flex-wrap:wrap; gap:0 clamp(.85rem,2vw,2rem); margin-top:.65rem; }
  .contact-links a { display:inline-flex; align-items:center; gap:.25rem; min-height:44px; font-weight:600; text-decoration:none; }
  .contact-guide { grid-area:guide; justify-self:end; width:min(100%,370px); margin-top:1rem; }
  .contact-guide .guide-figure { --light:#89965e; --outfit:#637246; --shade:#425134; width:100%; transform-origin:48% 95%; }
  .farewell-bubble {
    position:relative; width:fit-content; max-width:100%; margin:0 auto .65rem;
    padding:.55rem .8rem; border-radius:.8rem; background:#f8f7f0;
    color:#171b15; font-size:.9rem; font-weight:680; text-align:center; opacity:0;
  }
  .farewell-bubble::after {
    content:''; position:absolute; top:100%; left:46%; width:.75rem; height:.5rem;
    background:inherit; clip-path:polygon(0 0,100% 0,30% 100%);
  }
  .contact-guide .guide-photo { transition:transform .28s ease-out; }
  .contact-guide .guide-arm { left:62%; width:29%; }
  .farewell-wave { transform:rotate(18deg); }
  .wave-hand {
    position:absolute; right:-35%; top:-15%; width:46%; height:115%;
    background:linear-gradient(0deg,#b87957 0 22%,var(--skin) 22%);
    clip-path:polygon(0 30%,31% 30%,31% 0,59% 0,59% 12%,87% 12%,87% 26%,100% 26%,100% 79%,77% 79%,77% 96%,0 96%);
  }
  .farewell-point { opacity:0; transform:rotate(22deg); transition:transform .28s ease-out,opacity .15s; }
  .current .farewell-wave { animation:farewell-wave 1.45s ease-in-out .2s both; }
  .current .farewell-bubble { animation:farewell-bubble 2.8s ease both; }
  .current .contact-guide .guide-figure { animation:farewell-sway 3.4s ease-in-out 1.65s infinite; }
  .more-inner:has(.more-links a:is(:hover,:focus-visible)) .farewell-wave { visibility:hidden; }
  .more-inner:has(.more-links a:is(:hover,:focus-visible)) .farewell-bubble { visibility:hidden; }
  .more-inner:has(.more-links a:is(:hover,:focus-visible)) .guide-figure { animation-play-state:paused; }
  .more-inner:has(.more-links a:is(:hover,:focus-visible)) .farewell-point { opacity:1; transform:rotate(-16deg); }
  .more-inner:has(.more-links a:is(:hover,:focus-visible)) .guide-photo { transform:translateX(3%) rotate(5deg); }
  @keyframes farewell-wave {
    0%,100% { transform:rotate(18deg); }
    20%,47%,73% { transform:rotate(-97deg); }
    34%,60% { transform:rotate(-53deg); }
  }
  @keyframes farewell-bubble {
    0%,100% { opacity:0; }
    8%,84% { opacity:1; }
  }
  @keyframes farewell-sway {
    0%,50%,100% { transform:translateX(0) rotate(0); }
    25% { transform:translateX(-2%) rotate(-3deg); }
    75% { transform:translateX(2%) rotate(3deg); }
  }
  .view-count { width:100%; max-width:1550px; margin:2rem auto 0; opacity:.75; font-size:.85rem; }
  @media (min-width:761px) and (max-height:760px) {
    .hero { padding-top:clamp(1rem,3svh,2rem); }
    .hero h1 { font-size:clamp(3.25rem,min(14.5vw,22.5svh),10.75rem); }
    .figure { width:min(100%,clamp(142px,min(31vw,50svh),450px)); }
    .character { padding:.5rem 0; }
    .bubble { margin-bottom:.65rem; }
  }
  @media (max-width:760px) {
    .hero-content { grid-template-columns:1fr; }
    .chapter-body,.guide-right .chapter-body { grid-template-columns:1fr; grid-template-areas:"copy" "media"; }
    .guide-right .chapter-guide { justify-items:end; }
    .more-inner { grid-template-columns:1fr; grid-template-areas:"title" "guide" "links"; row-gap:.65rem; }
    .more h2 { font-size:clamp(3.6rem,12vw,6rem); }
    .contact-guide { justify-self:center; width:min(58%,240px); margin:0; }
    .more-inner:has(.more-links a:is(:hover,:focus-visible)) .farewell-point { transform:rotate(46deg); }
    .hero h1 { font-size:clamp(3.4rem,min(18vw,15svh),7rem); }
    .character { padding:1rem 0 .2rem; }
    .figure { width:min(190px,35svh); }
    .chapter-guide { margin-top:1rem; }
  }
  @media (max-width:520px) {
  }
  @media (prefers-reduced-motion:reduce) {
    .chapter-walk { display:none; }
    .portrait { transition:none; transform:none; }
    .reacting .figure,.sneezing .figure,.current .farewell-wave,.chapter-guide.current :is(.guide-arm,.held-prop,.guide-photo) { animation:none !important; }
    .contact-guide .guide-photo,.farewell-point,.more-links a :global(svg) { transition:none; }
    .current .farewell-bubble,.current .contact-guide .guide-figure { animation:none; }
    .farewell-bubble { opacity:1; }
    .tour:hover,.chapter-link:hover { transform:none; }
  }
</style>
