<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { goto } from '$app/navigation';
  import { paletteOpen } from '$lib/stores/commandPalette';
  import { 
    BookOpen, 
    FolderOpen, 
    FileText, 
    Lightbulb, 
    User, 
    Download, 
    Mail, 
    Search
  } from '@lucide/svelte';

  interface PaletteItem {
    id: string;
    label: string;
    category: 'Pages' | 'Research Areas' | 'Projects' | 'Publications' | 'Blog' | 'Actions';
    icon?: string;
    href?: string;
    download?: string;
  }

  const items: PaletteItem[] = [
    // Pages
    { id: "research",       label: "Research Overview",  category: "Pages", icon: "BookOpen",     href: "/workspace/research" },
    { id: "projects",       label: "Projects",           category: "Pages", icon: "FolderOpen",   href: "/workspace/projects" },
    { id: "publications",   label: "Publications",       category: "Pages", icon: "FileText",     href: "/workspace/publications" },
    { id: "blog",           label: "Blog",               category: "Pages", icon: "Lightbulb",   href: "/workspace/blog" },
    { id: "resume",         label: "Resume",             category: "Pages", icon: "User",         href: "/workspace/resume" },

    // Research Areas
    { id: "xai",        label: "Explainable AI",       category: "Research Areas", href: "/workspace/research" },
    { id: "cybersec",   label: "Cybersecurity",         category: "Research Areas", href: "/workspace/research" },
    { id: "unlearning", label: "Machine Unlearning",    category: "Research Areas", href: "/workspace/research" },
    { id: "quantum",    label: "Quantum Security",      category: "Research Areas", href: "/workspace/research" },

    // Projects
    { id: "bhoomi",             label: "BHOOMI",             category: "Projects", href: "/workspace/projects/bhoomi" },
    { id: "fc",                 label: "FC Analytics",       category: "Projects", href: "/workspace/projects/fc-analytics" },
    { id: "petbot",             label: "PetBot",             category: "Projects", href: "/workspace/projects/petbot" },
    { id: "research-assistant", label: "Research Assistant", category: "Projects", href: "/workspace/projects/research-assistant" },
    { id: "portfolio-website",  label: "Developer Portfolio", category: "Projects", href: "/workspace/projects/portfolio-website" },

    // Publications
    { id: "pub_fides",      label: "FIDES: Federated Intelligence and Detection with Quantum Security",              category: "Publications", href: "/workspace/publications/pub-fides" },
    { id: "pub_globecom",   label: "Quantum-Secured Explainable Machine Unlearning for Phishing Detection in IoT",  category: "Publications", href: "/workspace/publications/pub-globecom" },
    { id: "pub_vtc",        label: "Q-ShielD: CV-QKD Framework for Secure Autonomous Vehicle Communications",     category: "Publications", href: "/workspace/publications/pub-vtc" },
    { id: "pub_healthcom",  label: "Quantum-Based Edge Intelligence Framework for IoT Healthcare Systems",         category: "Publications", href: "/workspace/publications/pub-healthcom" },
    { id: "pub_icsc",       label: "Deep Learning and Explainable AI Framework for False Data Injection Attacks",  category: "Publications", href: "/workspace/publications/pub-icsc" },
    { id: "pub_cml",        label: "Explainable AI and Quantum Security for Smart Homes Network Attack Classification", category: "Publications", href: "/workspace/publications/pub-cml" },
    { id: "pub_tb",         label: "Machine Unlearning-based Privacy-First Medical Imaging Framework for TB Detection", category: "Publications", href: "/workspace/publications/pub-tb" },

    // Blog Posts
    { id: "blog_tampa",         label: "What happened when I presented at IEEE ICSC in Tampa",         category: "Blog", href: "/workspace/blog/tampa-icsc-2025" },
    { id: "blog_lime",          label: "What LIME actually explains — and what it hides",              category: "Blog", href: "/workspace/blog/what-lime-actually-explains" },
    { id: "blog_forensics",     label: "Why I started treating explainability as a forensic tool",    category: "Blog", href: "/workspace/blog/explainability-as-forensics" },
    { id: "blog_federated",     label: "Federated learning is not privacy-preserving by default",     category: "Blog", href: "/workspace/blog/federated-learning-not-private" },
    { id: "blog_unlearning",    label: "The machine unlearning verification problem",                 category: "Blog", href: "/workspace/blog/unlearning-verification-problem" },

    // Actions
    { id: "download-resume", label: "Download Resume", category: "Actions", icon: "Download", href: "https://efptwclmybikeaahtciz.supabase.co/storage/v1/object/public/Resume/PARAM_DESAI_Resume.pdf" },
    { id: "email",           label: "Send Email",      category: "Actions", icon: "Mail",     href: "mailto:desaiparam24@gmail.com" },
    { id: "github",          label: "GitHub Profile",  category: "Actions", icon: "Github",   href: "https://github.com/paramdesai24" }
  ];

  let searchQuery = $state('');
  let selectedIndex = $state(0);
  let inputElement = $state<HTMLInputElement | null>(null);
  let resultsContainer = $state<HTMLDivElement | null>(null);

  // Focus input on mount/render
  $effect(() => {
    if (inputElement) {
      inputElement.focus();
    }
  });

  // Fuzzy search scoring helper
  function scoreItem(label: string, query: string): number {
    const l = label.toLowerCase();
    const q = query.toLowerCase().trim();
    if (!q) return 0;
    
    // 1. Exact match
    if (l === q) return 100;
    
    // 2. Starts with
    if (l.startsWith(q)) return 80;
    
    // 3. Includes
    if (l.includes(q)) return 60;
    
    // 4. Acronym match (e.g. "xai" for "Explainable AI")
    const words = l.split(/[^a-z0-9]+/);
    const acronym = words.map(w => w[0]).join('');
    if (acronym.includes(q) && q.length >= 2) return 50;
    
    // Fuzzy fallback: character order check
    let queryIdx = 0;
    for (let char of l) {
      if (char === q[queryIdx]) {
        queryIdx++;
        if (queryIdx === q.length) {
          return 35; 
        }
      }
    }
    
    return 0;
  }

  // Derived filtered items list
  let filteredItems = $derived.by(() => {
    const query = searchQuery.trim();
    if (!query) {
      // Default: Pages and Actions
      return items.filter(item => item.category === 'Pages' || item.category === 'Actions');
    }

    const scored = items.map(item => ({
      item,
      score: scoreItem(item.label, query)
    }))
    .filter(res => res.score >= 30)
    .sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label));

    return scored.slice(0, 8).map(res => res.item);
  });

  // Reset selection index on search change
  $effect(() => {
    const _len = filteredItems.length;
    selectedIndex = 0;
  });

  // Category sorting order
  const categoryOrder: ('Pages' | 'Research Areas' | 'Projects' | 'Publications' | 'Blog' | 'Actions')[] = [
    'Pages',
    'Research Areas',
    'Projects',
    'Publications',
    'Blog',
    'Actions'
  ];

  // Derived grouped results
  let groupedResults = $derived.by(() => {
    const list = filteredItems;
    const groups: { category: string; items: PaletteItem[] }[] = [];
    
    for (const cat of categoryOrder) {
      const catItems = list.filter(item => item.category === cat);
      if (catItems.length > 0) {
        groups.push({
          category: cat,
          items: catItems
        });
      }
    }
    return groups;
  });

  // Scroll active item into view helper
  $effect(() => {
    if (resultsContainer && filteredItems.length > 0) {
      const activeEl = resultsContainer.querySelector('[aria-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  });

  function triggerItem(item: PaletteItem) {
    if (!item) return;
    
    paletteOpen.set(false);
    
    if (item.href) {
      if (item.href.startsWith('mailto:') || item.href.startsWith('http')) {
        window.open(item.href, '_blank');
      } else {
        goto(item.href);
      }
    } else if (item.id === 'download-resume') {
      const link = document.createElement('a');
      link.href = item.href || '/resume.pdf';
      link.download = item.download || 'Param_Desai_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      e.preventDefault(); 
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = filteredItems.length > 0 ? (selectedIndex + 1) % filteredItems.length : 0;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = filteredItems.length > 0 ? (selectedIndex - 1 + filteredItems.length) % filteredItems.length : 0;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        triggerItem(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      paletteOpen.set(false);
    }
  }

  // Close when clicking overlay backdrop
  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      paletteOpen.set(false);
    }
  }

  // Match text icon configurations
  function getIcon(iconName: string | undefined) {
    switch (iconName) {
      case 'BookOpen': return BookOpen;
      case 'FolderOpen': return FolderOpen;
      case 'FileText': return FileText;
      case 'Lightbulb': return Lightbulb;
      case 'User': return User;
      case 'Download': return Download;
      case 'Mail': return Mail;
      default: return null;
    }
  }
</script>

<!-- Backdrop Modal Overlay -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div 
  transition:fade={{ duration: 150 }}
  onclick={handleBackdropClick}
  class="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-start justify-center pt-[14vh] px-4 select-none"
  role="presentation"
>
  <!-- Main Dialog Panel -->
  <div 
    transition:scale={{ start: 0.95, duration: 150, easing: cubicOut }}
    class="bg-[--color-surface] border border-[--color-border] rounded-2xl shadow-xl max-w-[560px] w-full max-h-[480px] flex flex-col overflow-hidden"
    role="dialog"
    aria-modal="true"
    aria-label="Command Palette"
  >
    <!-- Top Search Bar -->
    <div class="flex items-center gap-3 px-4 py-3 border-b border-[--color-border]">
      <span class="text-[--color-muted] opacity-60 shrink-0">
        <Search size={16} />
      </span>
      <input 
        bind:this={inputElement}
        bind:value={searchQuery}
        onkeydown={handleKeydown}
        type="text" 
        placeholder="Search pages, projects, publications, actions..."
        class="w-full h-9 bg-transparent border-none outline-none font-sans text-[14px] text-[--color-text] placeholder:text-[--color-muted]/60 focus:ring-0 focus:outline-hidden"
        aria-autocomplete="list"
        aria-activedescendant={filteredItems[selectedIndex] ? `item-${filteredItems[selectedIndex].id}` : undefined}
      />
    </div>

    <!-- Middle Scrollable Results -->
    <div 
      bind:this={resultsContainer}
      class="flex-1 overflow-y-auto px-2 py-3 max-h-[360px]"
    >
      {#if filteredItems.length > 0}
        <div class="flex flex-col gap-3.5">
          {#each groupedResults as group}
            <div>
              <!-- Group Category Header -->
              <h3 class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] font-bold px-3.5 mb-1.5 select-none">
                {group.category}
              </h3>
              
              <!-- Group Items -->
              <div class="flex flex-col gap-0.5">
                {#each group.items as item}
                  {@const indexInFlat = filteredItems.findIndex(i => i.id === item.id)}
                  {@const isSelected = selectedIndex === indexInFlat}
                  {@const IconComponent = getIcon(item.icon)}

                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <div 
                    id="item-{item.id}"
                    role="option"
                    tabindex="-1"
                    aria-selected={isSelected}
                    onclick={() => triggerItem(item)}
                    class="group flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-sans cursor-pointer transition-all duration-150 border-l-2 border-transparent
                    {isSelected 
                      ? 'bg-[--color-accent-dim] text-[--color-accent] border-l-[--color-accent] font-medium' 
                      : 'text-[--color-text] hover:bg-[--color-accent-dim]/40'}"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <!-- Render Dynamic Icon or Custom SVG -->
                      <div class="shrink-0 flex items-center justify-center">
                        {#if IconComponent}
                          <IconComponent size={14} class={isSelected ? 'text-[--color-accent]' : 'text-[--color-muted] group-hover:text-[--color-text]'} />
                        {:else if item.icon === 'Github'}
                          <svg class="w-3.5 h-3.5 fill-current {isSelected ? 'text-[--color-accent]' : 'text-[--color-muted] group-hover:text-[--color-text]'}" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                          </svg>
                        {:else}
                          <div class="w-1.5 h-1.5 rounded-full bg-[--color-accent] opacity-60"></div>
                        {/if}
                      </div>
                      
                      <!-- Label -->
                      <span class="truncate pr-4">{item.label}</span>
                    </div>

                    <!-- Selected Indicator Hint -->
                    {#if isSelected}
                      <span class="font-mono text-[9px] text-[--color-accent] select-none shrink-0 opacity-70">
                        &crarr;
                      </span>
                    {/if}
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <!-- No Results State -->
        <div class="py-12 text-center select-none flex flex-col items-center justify-center gap-2">
          <p class="font-sans text-xs text-[--color-muted]">
            No results found for "<span class="text-[--color-text] font-medium">{searchQuery}</span>"
          </p>
          <p class="font-mono text-[9px] text-[--color-muted] opacity-60">
            Try searching for a different term
          </p>
        </div>
      {/if}
    </div>

    <!-- Bottom Instruction Hint Strip -->
    <div class="bg-[--color-bg]/60 border-t border-[--color-border] px-4 py-2.5 flex items-center justify-between select-none">
      <span class="font-mono text-[10px] text-[--color-muted] uppercase tracking-wide">
        Command Menu
      </span>
      <span class="font-mono text-[10px] text-[--color-muted]">
        &uarr;&darr; navigate &bull; &crarr; open &bull; esc close
      </span>
    </div>

  </div>
</div>

<style>
  /* Extra visual adjustments */
  input::-webkit-search-decoration,
  input::-webkit-search-cancel-button,
  input::-webkit-search-results-button,
  input::-webkit-search-results-decoration {
    display: none;
  }
</style>
