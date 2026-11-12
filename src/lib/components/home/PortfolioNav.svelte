<script lang="ts">
  import { page } from '$app/state';

  const links = [
    { label: 'Projects', href: '/workspace/projects' },
    { label: 'Research', href: '/workspace/research' },
    { label: 'Publications', href: '/workspace/publications' },
    { label: 'Experience', href: '/workspace/experience' },
    { label: 'Programming', href: '/workspace/programming' },
    { label: 'Writing', href: '/workspace/blog' },
    { label: 'Explore more', href: '/#explore' }
  ];
</script>

<header class="site-nav">
  <a class="skip" href="#main-content">Skip to content</a>
  <a class="mark" href="/" aria-label="Param Desai, home">PD<span>.</span></a>
  <nav aria-label="Portfolio">
    {#each links as link (link.href)}
      <a href={link.href} aria-current={page.url.pathname === link.href ? 'page' : page.url.pathname.startsWith(link.href + '/') ? 'location' : undefined}>{link.label}</a>
    {/each}
  </nav>
  <a class="cv" href="/workspace/resume" aria-current={page.url.pathname === "/workspace/resume" ? "page" : undefined}>Resume</a>
</header>

<style>
  .site-nav { position:sticky; top:0; z-index:20; display:flex; align-items:center; justify-content:space-between; gap:.75rem; min-height:72px; padding:0 clamp(1rem,5vw,5.5rem); background:#183d6b; color:white; border-bottom:1px solid #ffffff26; font-family:"Instrument Sans",system-ui,sans-serif; }
  a { text-decoration:none; white-space:nowrap; }
  nav { display:flex; align-items:center; gap:clamp(.7rem,2.5vw,2.2rem); font-weight:660; }
  nav a:is(:hover,[aria-current]) { text-decoration:underline; text-underline-offset:.3em; }
  .mark { font-size:1.65rem; font-weight:900; letter-spacing:-.09em; }
  .mark span { color:#c8e9f8; }
  .cv { display:inline-flex; align-items:center; gap:.25rem; }
  .skip { position:absolute; top:.5rem; left:1rem; padding:.6rem; background:#183d6b; transform:translateY(-150%); }
  .skip:focus { transform:none; }
  @media(max-width:1050px) {
    .site-nav { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:0 .75rem; padding-block:.35rem; font-size:.85rem; }
    nav { grid-column:1 / -1; grid-row:2; min-width:0; gap:1rem; overflow-x:auto; }
    nav a { display:inline-flex; align-items:center; min-height:36px; }
  }
</style>
