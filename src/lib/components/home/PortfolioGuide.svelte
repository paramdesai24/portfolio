<script lang="ts">
  let { title, description, message, compact = false }: { title: string; description: string; message: string; compact?: boolean } = $props();
  let badge: HTMLButtonElement;
  let portrait: HTMLImageElement;
  let frame = 0;
  let scrollFrame = 0;
  let showSpeech = $state(true);
  let sectionMessage = $state('');

  function updateSection() {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      const marker = innerHeight * .52;
      const stops = Array.from(document.querySelectorAll<HTMLElement>('#main-content [data-guide-line], #main-content .prose-academic h2'));
      const stop = scrollY > 24 ? stops.findLast(element => element.getBoundingClientRect().top <= marker) : undefined;
      sectionMessage = stop?.dataset.guideLine ?? (stop?.textContent?.trim() ? `Next up: ${stop.textContent.trim()}.` : '');
    });
  }

  function follow(event: PointerEvent) {
    if (event.pointerType === 'touch' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      if (!badge || !portrait) return;
      const box = badge.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - box.left - box.width / 2) / 280));
      const y = Math.max(-1, Math.min(1, (event.clientY - box.top - box.height / 2) / 280));
      portrait.style.transform = `translate(${x * 7}px,${y * 5}px) rotate(${x * 9}deg)`;
    });
  }

  function reset() {
    cancelAnimationFrame(frame);
    if (portrait) portrait.style.transform = '';
  }

  $effect(() => {
    title;
    sectionMessage = '';
    updateSection();
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
    };
  });
</script>

<svelte:window onpointermove={follow} onblur={reset} onscroll={updateSection} onresize={updateSection} />

<section class="page-intro" class:compact>
  <h1>{title}<span>.</span></h1>
  <p>{description}</p>
</section>

  <div class="guide">
    {#if showSpeech}
      <div id="portfolio-guide-speech" class="speech" aria-live="polite">
        {#key sectionMessage || message}<p>{sectionMessage || message}</p>{/key}
      </div>
    {/if}
    <button type="button" class="badge" bind:this={badge} aria-label={showSpeech ? 'Hide avatar commentary' : 'Show avatar commentary'} aria-expanded={showSpeech} onclick={() => showSpeech = !showSpeech}>
      <div class="polo"><i></i></div>
      <img bind:this={portrait} src="/pixel-param.png" alt="" width="64" height="64" />
    </button>
  </div>

<style>
  .page-intro { margin:0 0 2rem; color:#fff; }
  h1 { font-family:"Instrument Sans",system-ui,sans-serif; font-size:clamp(3.5rem,8.5vw,9rem); line-height:.86; letter-spacing:-.085em; font-weight:700; overflow-wrap:anywhere; margin:0 0 .7rem; }
  h1 span { color:#c8e9f8; }
  .compact h1 { font-size:clamp(2.25rem,5.6vw,5.75rem); line-height:.98; letter-spacing:-.065em; max-width:24ch; }
  .page-intro > p { font-size:clamp(1.05rem,2vw,1.35rem); max-width:58ch; font-weight:650; }
  .guide { position:fixed; z-index:30; bottom:max(.8rem,env(safe-area-inset-bottom)); left:max(.8rem,env(safe-area-inset-left)); display:grid; justify-items:start; gap:.55rem; pointer-events:none; }
  .badge { position:relative; width:clamp(60px,6.5vw,94px); aspect-ratio:1; overflow:hidden; background:#f4faf4; border:2px solid #346ba4; border-radius:50%; cursor:pointer; pointer-events:auto; box-shadow:0 4px 14px #183d6b35; }
  .badge:focus-visible { outline:3px solid #183d6b; outline-offset:3px; }
  img { position:absolute; width:65%; height:auto; top:6%; left:17.5%; image-rendering:pixelated; transition:transform .12s ease-out; }
  .polo { position:absolute; width:83%; height:43%; bottom:-4%; left:8.5%; border-radius:40% 40% 0 0; background:linear-gradient(115deg,#648fb2,#3a628b 63%,#26486d 64%); }
  .polo::before { content:''; position:absolute; inset:0 22% 40%; background:#a9cce4; clip-path:polygon(0 0,100% 0,90% 76%,59% 43%,50% 100%,42% 44%,10% 76%); }
  .polo i { position:absolute; width:2px; height:28%; top:30%; left:49%; background:#c8e9f8; }
  .speech { max-width:min(27ch,calc(100vw - 2rem)); color:#101d2a; background:#f4faf4; border:1px solid #183d6b; border-radius:.85rem; padding:.55rem .75rem; font-size:.85rem; font-weight:650; box-shadow:2px 3px #183d6b; }
  .speech p { animation:arrive .2s ease-out; margin:0; }
  @keyframes arrive { from { opacity:.4; transform:translateY(3px); } }
  @media(prefers-reduced-motion:reduce) { img { transform:none !important; transition:none; } .speech p { animation:none; } }
</style>
