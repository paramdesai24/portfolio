<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fade, fly, slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { currentPageTitle } from '$lib/stores/workspace';
  import { paletteOpen } from '$lib/stores/commandPalette';
  import { theme } from '$lib/stores/theme';
  import CommandPalette from '$lib/components/CommandPalette.svelte';
  import { 
    BookOpen, 
    Award, 
    Briefcase, 
    FileText, 
    ArrowLeft, 
    Menu, 
    X,
    ClipboardList,
    Sun,
    Moon
  } from '@lucide/svelte';

  // Svelte 5 snippet props
  let { children } = $props();

  let menuOpen = $state(false);

  // Close the mobile menu on route change
  $effect(() => {
    // Referencing $page.url.pathname creates a dependency so this effect runs on route changes
    const path = $page.url.pathname;
    menuOpen = false;
  });

  // Lock body scroll when mobile menu is open
  $effect(() => {
    if (menuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  });

  const navGroups = [
    {
      title: 'Research',
      items: [
        { name: 'Research Overview', href: '/workspace/research', icon: BookOpen },
        { name: 'Publications', href: '/workspace/publications', icon: Award }
      ]
    },
    {
      title: 'Work',
      items: [
        { name: 'Projects', href: '/workspace/projects', icon: Briefcase },
        { name: 'Experience', href: '/workspace/experience', icon: ClipboardList }
      ]
    },
    {
      title: 'About',
      items: [
        { name: 'Resume', href: '/workspace/resume', icon: FileText }
      ]
    }
  ];

  function isActive(currentPath: string, href: string): boolean {
    if (href === '/workspace/research') {
      return currentPath === '/workspace/research';
    }
    return currentPath.startsWith(href);
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }

  function toggleTheme() {
    theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  function handleWindowKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      paletteOpen.update(open => !open);
    }
  }
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<div class="min-h-screen bg-[--color-bg] text-[--color-text] flex flex-col md:flex-row relative">
  <!-- Skip to main content accessibility link -->
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[--color-accent] focus:text-[--color-surface] focus:border focus:border-[--color-border] focus:rounded-lg select-none">
    Skip to content
  </a>

  <!-- MOBILE HEADER -->
  <header class="md:hidden sticky top-0 w-full h-14 border-b border-[--color-border] flex items-center justify-between px-6 z-50 select-none shadow-2xs" style="background-color: var(--color-surface); opacity: 1;">
    <a href="/" class="flex items-center">
      <img src="/avatar.png" alt="Param Desai" class="w-6 h-6 rounded-full object-cover border border-[--color-border] select-none" />
    </a>
    <span class="font-sans text-sm font-semibold text-[--color-text] truncate px-4">{$currentPageTitle}</span>
    <div class="flex items-center gap-2">
      <!-- Dark Mode Toggle for Mobile Header -->
      <button 
        onclick={toggleTheme} 
        class="text-[--color-muted] hover:text-[--color-text] p-2 rounded-lg hover:bg-[--color-accent-dim] transition-all cursor-pointer focus:outline-hidden"
        aria-label="Toggle theme"
      >
        {#if $theme === 'dark'}
          <Sun size={18} />
        {:else}
          <Moon size={18} />
        {/if}
      </button>
      <!-- Hamburger Menu toggle -->
      <button 
        onclick={toggleMenu} 
        class="text-[--color-text] focus:outline-hidden p-2 rounded-lg hover:bg-[--color-accent-dim] transition-all cursor-pointer" 
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        {#if menuOpen}
          <X size={18} />
        {:else}
          <Menu size={18} />
        {/if}
      </button>
    </div>
  </header>

  <!-- MOBILE DROPDOWN MENU -->
  {#if menuOpen}
    <!-- Backdrop Overlay -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div 
      transition:fade={{ duration: 150 }}
      onclick={closeMenu}
      class="md:hidden fixed inset-0 top-14 bg-black/25 backdrop-blur-xs z-30"
      role="presentation"
    ></div>

    <div 
      transition:slide={{ duration: 220, easing: cubicOut }}
      class="md:hidden fixed top-14 left-0 right-0 border-b border-[--color-border] z-40 shadow-lg overflow-y-auto max-h-[calc(100vh-3.5rem)] select-none flex flex-col p-5 gap-6"
      style="background-color: var(--color-surface); opacity: 1;"
    >
      {#each navGroups as group}
        <div class="flex flex-col gap-1.5">
          <span class="px-3 text-[10px] font-mono uppercase tracking-wider text-[--color-muted] font-semibold">{group.title}</span>
          <div class="flex flex-col gap-0.5">
            {#each group.items as item}
              {@const Icon = item.icon}
              <a
                onclick={closeMenu}
                href={item.href}
                aria-current={isActive($page.url.pathname, item.href) ? 'page' : undefined}
                class="flex items-center h-[40px] px-3 rounded-lg text-sm font-sans gap-2.5 transition-all duration-150 border-l-2
                {isActive($page.url.pathname, item.href)
                  ? 'bg-[--color-accent-dim] text-[--color-accent] border-[--color-accent] font-medium'
                  : 'border-transparent text-[--color-muted] hover:bg-[--color-accent-dim] hover:text-[--color-text]'}"
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </a>
            {/each}
          </div>
        </div>
      {/each}

      <div class="pt-4 border-t border-[--color-border] flex flex-col gap-3">
        <a 
          href="/" 
          onclick={closeMenu}
          class="flex items-center text-xs font-sans text-[--color-muted] hover:text-[--color-text] transition-colors gap-1.5 py-1.5 px-3 rounded-lg hover:bg-[--color-accent-dim]"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </a>
        <button 
          onclick={() => { closeMenu(); paletteOpen.set(true); }}
          class="text-left font-mono text-[10px] text-[--color-muted] hover:text-[--color-text] opacity-75 px-3 cursor-pointer focus:outline-hidden"
        >
          <span>⌘K to search</span>
        </button>
      </div>
    </div>
  {/if}
  
  <!-- RESPONSIVE SIDEBAR (DESKTOP) -->
  <aside class="hidden md:flex flex-col w-16 lg:w-64 fixed inset-y-0 left-0 border-r border-[--color-border] z-50 select-none" style="background-color: var(--color-surface); box-shadow: 1px 0 0 var(--color-border);">
    <!-- Top profile section -->
    <div class="p-4 lg:p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-[--color-border]">
      <img src="/avatar.png" alt="Param Desai" class="w-8 h-8 rounded-full object-cover border border-[--color-border] select-none" />
      <div class="hidden lg:flex flex-col">
        <span class="font-sans text-sm font-semibold text-[--color-text] leading-tight">Param Desai</span>
        <span class="font-sans text-[11px] text-[--color-muted]">i do what i gotta do</span>
      </div>
    </div>

    <!-- Navigation Area -->
    <nav class="flex-1 overflow-y-auto px-2 lg:px-4 py-6 flex flex-col gap-6">
      {#each navGroups as group}
        <div class="flex flex-col gap-1.5">
          <span class="hidden lg:inline px-3 text-[10px] font-mono uppercase tracking-wider text-[--color-muted] font-semibold">{group.title}</span>
          <div class="flex flex-col gap-0.5">
            {#each group.items as item}
              {@const Icon = item.icon}
              <a
                href={item.href}
                aria-current={isActive($page.url.pathname, item.href) ? 'page' : undefined}
                class="flex items-center justify-center lg:justify-start h-[36px] px-3 rounded-lg text-sm font-sans gap-2.5 transition-all duration-150 group border-l-2
                {isActive($page.url.pathname, item.href)
                  ? 'bg-[--color-accent-dim] text-[--color-accent] border-[--color-accent] font-medium'
                  : 'border-transparent text-[--color-muted] hover:bg-[--color-accent-dim] hover:text-[--color-text]'}"
                title={item.name}
              >
                <Icon size={16} />
                <span class="hidden lg:inline">{item.name}</span>
              </a>
            {/each}
          </div>
        </div>
      {/each}
    </nav>

    <!-- Bottom Section -->
    <div class="p-4 lg:p-6 border-t border-[--color-border] flex flex-col items-center lg:items-stretch gap-3">
      <!-- Dark Mode Toggle for Desktop (Full Sidebar) -->
      <button 
        onclick={toggleTheme}
        class="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-sans text-[--color-muted] hover:text-[--color-accent] hover:bg-[--color-accent-dim] transition-all cursor-pointer focus:outline-hidden text-left"
        aria-label="Toggle theme"
      >
        {#if $theme === 'dark'}
          <Sun size={14} />
          <span>Light Mode</span>
        {:else}
          <Moon size={14} />
          <span>Dark Mode</span>
        {/if}
      </button>
      
      <!-- Dark Mode Toggle for Collapsed Sidebar (Tablet) -->
      <button 
        onclick={toggleTheme}
        class="lg:hidden flex items-center justify-center p-2 rounded-lg text-[--color-muted] hover:text-[--color-text] hover:bg-[--color-accent-dim] transition-all cursor-pointer focus:outline-hidden"
        title="Toggle Theme"
        aria-label="Toggle theme"
      >
        {#if $theme === 'dark'}
          <Sun size={16} />
        {:else}
          <Moon size={16} />
        {/if}
      </button>

      <a href="/" class="flex items-center justify-center lg:justify-start text-xs font-sans text-[--color-muted] hover:text-[--color-text] transition-colors gap-1.5 py-1 px-3 rounded-lg hover:bg-[--color-accent-dim]" title="Back to Home">
        <ArrowLeft size={14} />
        <span class="hidden lg:inline">Back to Home</span>
      </a>
      
      <button 
        onclick={() => paletteOpen.set(true)}
        class="text-center lg:text-left font-mono text-[10px] text-[--color-muted] hover:text-[--color-text] opacity-60 hover:opacity-100 transition-all cursor-pointer focus:outline-hidden lg:px-3"
        title="Search"
      >
        <span class="pulse-hint hidden lg:inline">⌘K to search</span>
        <span class="lg:hidden font-mono text-[10px]">⌘K</span>
      </button>
    </div>
  </aside>

  <!-- MAIN CONTENT AREA -->
  <div class="flex-1 pl-0 pt-0 md:pt-0 md:pl-16 lg:pl-64 flex flex-col min-h-screen min-w-0">
    {#key $page.url.pathname}
      <main 
        id="main-content"
        in:fly={{ y: 8, duration: 200, delay: 100, easing: cubicOut }} 
        class="flex-1 px-4 py-6 md:px-[48px] md:py-[40px] w-full max-w-5xl mx-auto flex flex-col"
      >
        {@render children()}
      </main>
    {/key}
  </div>

  {#if $paletteOpen}
    <CommandPalette />
  {/if}
</div>
