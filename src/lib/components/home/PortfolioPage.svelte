<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import { scrollReveal, type RevealMode } from '$lib/actions/scrollReveal';

  let { children, mode }: { children: Snippet; mode?: RevealMode } = $props();
</script>

<div class="portfolio-page">
  <main id="main-content" use:scrollReveal={{ mode, path: page.url.pathname }}>
    {@render children()}
  </main>
</div>

<style>
  .portfolio-page {
    --portfolio-font:"Instrument Sans",system-ui,sans-serif;
    --portfolio-label-size:.8rem;
    --font-serif:var(--portfolio-font);
    --font-sans:var(--portfolio-font);
    --font-mono:var(--portfolio-font);
    --default-mono-font-family:var(--portfolio-font);
    --color-text:#101d2a; --color-muted:#304b5d; --color-border:#31516e45;
    --color-surface:#f4faf4; --color-bg:#e0eff0; --color-accent:#1e5972;
    --color-accent-dim:#d4e8ed;
    color:var(--color-text); min-height:100vh;
    background:linear-gradient(in oklab,#183d6b 8rem,#8dbbdf 28rem,#a4d9df max(32rem,40%),#b7ddb0 max(40rem,72%),#f3dc76);
    font-family:var(--portfolio-font);
  }
  main { width:min(100%,1440px); margin:auto; padding:clamp(1.6rem,5vw,4rem) clamp(1rem,5vw,5rem) 8rem; }
  .portfolio-page :global(main :is(h2,h3,h4)) { font-family:var(--portfolio-font); font-weight:700; letter-spacing:-.045em; }
  .portfolio-page :global(:is(pre,code,kbd,samp)) { font-family:var(--portfolio-font); }
  .portfolio-page :global(figure:has(> .portfolio-pixel-overlay)) { position:relative; }
  .portfolio-page :global(.portfolio-pixel-overlay) { position:absolute; top:0; left:0; width:100%; height:auto; border-radius:.75rem; image-rendering:pixelated; pointer-events:none; }
</style>
