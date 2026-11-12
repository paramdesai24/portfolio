<script lang="ts">
  import { page } from '$app/state';
  import PortfolioPage from '$lib/components/home/PortfolioPage.svelte';
  import PortfolioGuide from '$lib/components/home/PortfolioGuide.svelte';

  const notFound = $derived(page.status === 404);
</script>

<svelte:head>
  <title>{page.status} {notFound ? 'Page not found' : 'Page unavailable'}</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<PortfolioPage>
  <p class="status">Error {page.status}</p>
  <PortfolioGuide
    compact
    title={notFound ? 'Page not found' : 'Page unavailable'}
    description={notFound ? 'This link may be out of date. You can pick up from the homepage or browse the projects.' : 'Something went wrong loading this page. You can return home or browse the projects.'}
    message={notFound ? 'Looks like we took a wrong turn. I know the way back.' : 'Let’s get you back to the portfolio.'}
  />
  <div class="recovery">
    <a class="primary" href="/">Back home</a>
    <a href="/workspace/projects">Browse projects</a>
  </div>
</PortfolioPage>

<style>
  .status { margin:0 0 .9rem; color:#c8e9f8; font-size:.85rem; font-weight:700; letter-spacing:.065em; text-transform:uppercase; }
  .recovery { display:flex; flex-wrap:wrap; gap:.8rem; margin-top:1.5rem; }
  .recovery a { display:inline-flex; align-items:center; min-height:44px; padding:.55rem 1rem; border:1px solid #183d6b; border-radius:99px; color:#101d2a; background:#f4faf4; font-weight:650; text-decoration:none; }
  .recovery .primary { background:#c8e9f8; }
  .recovery a:is(:hover,:focus-visible) { background:white; }
</style>
