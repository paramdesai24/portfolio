<script lang="ts">
  import { onMount } from 'svelte';
  import { ChevronDown, Mail, ArrowRight, Download, Sun, Moon } from '@lucide/svelte';
  import TechLogo from '$lib/components/TechLogo.svelte';
  import { supabase } from '$lib/supabase';
  import { theme } from '$lib/stores/theme';

  let mounted = $state(false);

  function toggleTheme() {
    theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  const phrases = [
    "I research quantum security.",
    "I build AI systems.",
    "I simulate the world with data.",
    "I ship full-stack products."
  ];

  let currentText = $state("");
  let phraseIdx = $state(0);
  let isDeleting = $state(false);

  // Visitor Count & Reviews States
  let visitorCount = $state<number | null>(null);

  interface Review {
    id: string;
    name: string | null;
    message: string;
    rating: number;
    created_at: string;
  }
  let reviews = $state<Review[]>([]);
  let newName = $state('');
  let newMessage = $state('');
  let newRating = $state(5);
  let isSubmitting = $state(false);
  let submitSuccess = $state(false);

  function getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }



  async function fetchReviews() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        reviews = data;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!newMessage.trim() || isSubmitting) return;
    isSubmitting = true;

    const newReview = {
      name: newName.trim() || null,
      message: newMessage.trim(),
      rating: newRating,
      created_at: new Date().toISOString()
    };

    const optimisticId = Math.random().toString(36).substring(2);
    reviews = [{ id: optimisticId, ...newReview }, ...reviews];

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([newReview])
        .select();

      isSubmitting = false;

      if (!error) {
        submitSuccess = true;
        newName = '';
        newMessage = '';
        newRating = 5;
        
        if (data && data[0]) {
          reviews = reviews.map(r => r.id === optimisticId ? data[0] : r);
        }
        
        setTimeout(() => {
          submitSuccess = false;
        }, 3000);
      } else {
        reviews = reviews.filter(r => r.id !== optimisticId);
        console.error('Failed to submit review:', error);
      }
    } catch (err) {
      isSubmitting = false;
      reviews = reviews.filter(r => r.id !== optimisticId);
      console.error(err);
    }
  }

  onMount(() => {
    // Fetch initial reviews
    fetchReviews();

    async function registerAndFetchViews() {
      try {
        await supabase.from('page_views').insert([{}]);
        const { count, error } = await supabase
          .from('page_views')
          .select('*', { count: 'exact', head: true });
        if (!error && count !== null) {
          visitorCount = count;
        }
      } catch (e) {
        console.error('Failed to log visitor view:', e);
      }
    }
    registerAndFetchViews();

    // Small delay to trigger the CSS transition cascade smoothly after mount
    const entryTimer = setTimeout(() => {
      mounted = true;
    }, 50);

    let typeTimer: any;
    const typeSpeed = 65;
    const deleteSpeed = 35;
    const pauseEnd = 1800;
    const pauseStart = 300;

    function tick() {
      const fullPhrase = phrases[phraseIdx];
      
      if (isDeleting) {
        currentText = fullPhrase.slice(0, currentText.length - 1);
        
        if (currentText.length === 0) {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          typeTimer = setTimeout(tick, pauseStart);
        } else {
          typeTimer = setTimeout(tick, deleteSpeed);
        }
      } else {
        currentText = fullPhrase.slice(0, currentText.length + 1);
        
        if (currentText === fullPhrase) {
          isDeleting = true;
          typeTimer = setTimeout(tick, pauseEnd);
        } else {
          typeTimer = setTimeout(tick, typeSpeed);
        }
      }
    }

    typeTimer = setTimeout(tick, typeSpeed);

    return () => {
      clearTimeout(entryTimer);
      clearTimeout(typeTimer);
    };
  });
</script>

<svelte:head>
  <title>Param Desai | AI & Full Stack Builder</title>
  <meta name="description" content="Research portfolio of Param Desai, B.Tech CSE student and researcher in Explainable AI, Cybersecurity, and Machine Unlearning." />
  <meta property="og:title" content="Param Desai | AI & Full Stack Builder" />
  <meta property="og:description" content="Research portfolio of Param Desai, B.Tech CSE student and researcher in Explainable AI, Cybersecurity, and Machine Unlearning." />
  <meta property="og:image" content="https://paramdesai24.me/avatar.png" />
  <meta property="og:url" content="https://paramdesai24.me" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Param Desai | AI & Full Stack Builder" />
  <meta name="twitter:image" content="https://paramdesai24.me/avatar.png" />
</svelte:head>

<div class="landing-container min-h-screen flex flex-col relative" class:animate-in={mounted}>
  <!-- Floating Theme Toggle in Top Right -->
  <div class="absolute top-6 right-6 z-50">
    <button 
      onclick={toggleTheme}
      class="p-2.5 rounded-lg bg-[--color-surface] border border-[--color-border] text-[--color-muted] hover:text-[--color-text] hover:bg-[--color-accent-dim] transition-all duration-200 cursor-pointer shadow-2xs focus:outline-hidden"
      aria-label="Toggle theme"
      title="Toggle Theme"
    >
      {#if $theme === 'dark'}
        <Sun size={18} />
      {:else}
        <Moon size={18} />
      {/if}
    </button>
  </div>

  <!-- Section 1: Hero Section -->
  <section class="min-h-screen flex flex-col justify-between py-12 relative">
    <!-- Empty top spacer for centering alignment -->
    <div></div>

    <div class="container-narrow w-full flex flex-col items-center md:items-start text-center md:text-left">
      <!-- Eyebrow -->
      <span class="anim-item text-xs font-mono uppercase tracking-wider text-[--color-accent] bg-[--color-accent-dim] px-3 py-1 rounded-full delay-100">
        B.Tech CSE &bull; Nirma University &bull; IIT Madras
      </span>

      <!-- Name -->
      <h1 class="anim-item font-serif text-5xl md:text-7xl font-normal tracking-tight text-[--color-text] mt-6 delay-200">
        Param Desai
      </h1>

      <!-- Tagline -->
      <p class="anim-item font-serif italic text-xl md:text-2xl text-[--color-muted] mt-3 delay-300 typewriter-container">
        {currentText}<span class="typewriter-cursor"></span>
      </p>

      <!-- Staggered Verb Phrase -->
      <h2 class="font-serif italic text-3xl md:text-5xl mt-8 leading-tight text-[--color-text] max-w-xl">
        <span class="anim-item inline-block delay-400">Building</span>
        <span class="anim-item inline-block delay-500">systems</span>
        <span class="anim-item inline-block delay-600">that</span>
        <br class="hidden md:inline" />
        <span class="anim-item inline-block text-[--color-accent] font-medium delay-700">predict,</span>
        <span class="anim-item inline-block text-[--color-accent] font-medium delay-800">simulate,</span>
        <span class="anim-item inline-block text-[--color-accent] font-medium delay-900">explain,</span>
        <span class="anim-item inline-block delay-1000">and</span>
        <span class="anim-item inline-block text-[--color-accent] font-medium delay-1100">adapt.</span>
      </h2>
      <!-- CTAs -->
      <div class="anim-item flex flex-row flex-wrap justify-center md:justify-start gap-4 mt-10 delay-1200">
        <a href="/workspace/research" class="px-5 py-2.5 bg-[--color-accent] text-[--color-surface] rounded-lg font-medium text-sm border border-[--color-accent] hover:bg-opacity-90 transition-all duration-200 shadow-sm">
          Explore Research
        </a>
        <a href="/workspace/projects" class="px-5 py-2.5 bg-[--color-surface] text-[--color-text] rounded-lg font-medium text-sm border border-[--color-border] hover:bg-[--color-accent-dim] transition-all duration-200 shadow-sm">
          Browse Projects
        </a>
        <a href="https://efptwclmybikeaahtciz.supabase.co/storage/v1/object/public/Resume/PARAM_DESAI_Resume.pdf" target="_blank" rel="noopener noreferrer" class="px-5 py-2.5 bg-[--color-surface] text-[--color-text] rounded-lg font-medium text-sm border border-[--color-border] hover:bg-[--color-accent-dim] transition-all duration-200 shadow-sm inline-flex items-center gap-2">
          <Download size={14} />
          <span>Download Resume</span>
        </a>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="anim-item flex justify-center w-full delay-1300">
      <button class="scroll-indicator flex flex-col items-center text-[--color-muted] hover:text-[--color-accent] transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none" onclick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
        <span class="text-xs font-mono mb-2 uppercase tracking-widest">Scroll</span>
        <div class="bounce-anim flex items-center justify-center">
          <ChevronDown size={20} />
        </div>
      </button>
    </div>
  </section>

  <!-- Main Workspace Sections -->
  <main class="container-wide w-full flex flex-col gap-24 py-16">
    <!-- Section 2: Research Snapshot -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 anim-item delay-1400">
      <!-- Card 1: Publications -->
      <div class="card hover:translate-y-[-2px] transition-transform duration-300 flex flex-col justify-between">
        <div>
          <span class="text-xs font-mono text-[--color-muted] uppercase tracking-wider">Academic Record</span>
          <h3 class="font-serif text-4xl text-[--color-accent] mt-3 mb-1">6 Publications</h3>
        </div>
        <p class="text-sm text-[--color-muted] font-sans mt-2">
          Peer-reviewed research featured in IEEE GLOBECOM, VTC Spring, HealthCom, ICSC, and Springer CML.
        </p>
      </div>

      <!-- Card 2: Projects -->
      <div class="card hover:translate-y-[-2px] transition-transform duration-300 flex flex-col justify-between">
        <div>
          <span class="text-xs font-mono text-[--color-muted] uppercase tracking-wider">Engineering</span>
          <h3 class="font-serif text-4xl text-[--color-accent] mt-3 mb-1">4 Projects</h3>
        </div>
        <p class="text-sm text-[--color-muted] font-sans mt-2">
          Applications across Climate AI (BHOOMI), Sports Analytics (FC Analytics), LLM/RAG (PetBot), and Local-first NLP (Research Assistant).
        </p>
      </div>

      <!-- Card 3: Institutions -->
      <div class="card hover:translate-y-[-2px] transition-transform duration-300 flex flex-col justify-between">
        <div>
          <span class="text-xs font-mono text-[--color-muted] uppercase tracking-wider">Background</span>
          <h3 class="font-serif text-4xl text-[--color-accent] mt-3 mb-1">2 Institutions</h3>
        </div>
        <p class="text-sm text-[--color-muted] font-sans mt-2">
          Combining B.Tech in Computer Science from Nirma University with Data Science training from IIT Madras.
        </p>
      </div>
    </section>

    <!-- Section 3: Research Areas -->
    <section class="flex flex-col gap-6 anim-item delay-1500">
      <div class="border-b border-[--color-border] pb-3">
        <h3 class="font-serif text-2xl text-[--color-text]">Research Domains & Interests</h3>
      </div>
      <div class="flex overflow-x-auto pb-2 md:pb-0 md:flex-wrap gap-2.5 scrollbar-none snap-x snap-mandatory">
        {#each ['Explainable AI', 'Cybersecurity', 'Machine Unlearning', 'Intelligent Systems', 'IoT Security', 'NLP'] as area}
          <span class="snap-align-start flex-shrink-0 px-4 py-2 bg-[--color-surface] border border-[--color-border] rounded-full text-sm font-sans hover:border-[--color-accent] hover:text-[--color-accent] transition-all duration-200 cursor-default shadow-sm">
            {area}
          </span>
        {/each}
      </div>
    </section>

    <!-- Section 4: Featured Work -->
    <section class="flex flex-col gap-8 anim-item delay-1600">
      <div class="border-b border-[--color-border] pb-3">
        <h3 class="font-serif text-2xl text-[--color-text]">Featured Work</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- BHOOMI Card -->
        <div class="card flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-300">
          <div>
            <div class="flex justify-between items-start mb-3">
              <h4 class="font-serif text-2xl text-[--color-text]">BHOOMI</h4>
              <span class="text-xs font-mono text-[--color-status-live-text] uppercase px-2 py-0.5 bg-[--color-status-live-bg] border border-[--color-status-live-border]/20 rounded">Live</span>
            </div>
            <p class="text-sm text-[--color-muted] mb-6 line-clamp-3">
              A satellite-based environmental intelligence platform providing real-time multi-spectral imagery analysis, climate indicator tracking, and ecological risk modeling.
            </p>
          </div>
          <div>
            <div class="flex flex-wrap gap-1.5 mb-6">
              {#each ['React', 'Leaflet', 'FastAPI', 'PyTorch'] as tech}
                <span class="text-[10px] font-mono bg-[--color-bg] text-[--color-muted] border border-[--color-border] px-2 py-0.5 rounded flex items-center gap-1">
                  <TechLogo tech={tech} size={14} />
                </span>
              {/each}
            </div>
            <a href="/workspace/projects/bhoomi" class="text-sm font-medium text-[--color-accent] hover:underline inline-flex items-center gap-1">
              Read case study <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <!-- FC Analytics Card -->
        <div class="card flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-300">
          <div>
            <div class="flex justify-between items-start mb-3">
              <h4 class="font-serif text-2xl text-[--color-text]">FC Analytics</h4>
              <span class="text-xs font-mono text-[--color-status-live-text] uppercase px-2 py-0.5 bg-[--color-status-live-bg] border border-[--color-status-live-border]/20 rounded">Live</span>
            </div>
            <p class="text-sm text-[--color-muted] mb-6 line-clamp-3">
              An advanced sports analytics and simulation platform tailored for the FIFA World Cup 2026, predicting matches and simulating team formations.
            </p>
          </div>
          <div>
            <div class="flex flex-wrap gap-1.5 mb-6">
              {#each ['React', 'FastAPI', 'WebSockets', 'Supabase', 'Monte Carlo'] as tech}
                <span class="text-[10px] font-mono bg-[--color-bg] text-[--color-muted] border border-[--color-border] px-2 py-0.5 rounded flex items-center gap-1">
                  <TechLogo tech={tech} size={14} />
                </span>
              {/each}
            </div>
            <a href="/workspace/projects/fc-analytics" class="text-sm font-medium text-[--color-accent] hover:underline inline-flex items-center gap-1">
              Read case study <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <!-- IEEE GLOBECOM 2025 Card -->
        <div class="card flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-300">
          <div>
            <div class="flex justify-between items-start mb-3">
              <h4 class="font-serif text-2xl text-[--color-text] line-clamp-1">Machine Unlearning for IoT</h4>
              <span class="text-xs font-mono text-[--color-status-active-text] uppercase px-2 py-0.5 bg-[--color-status-active-bg] border border-[--color-status-active-border]/20 rounded">Accepted</span>
            </div>
            <p class="text-sm text-[--color-muted] mb-6 line-clamp-3">
              Quantum-Secured Explainable Machine Unlearning for Phishing Detection in IoT: Selective data unlearning verified via SHAP.
            </p>
          </div>
          <div>
            <div class="flex flex-wrap gap-1.5 mb-6">
              {#each ['Machine Unlearning', 'CV-QKD', 'SHAP', 'IoT Security'] as tag}
                <span class="text-[10px] font-mono bg-[--color-bg] text-[--color-muted] border border-[--color-border] px-2 py-0.5 rounded">
                  {tag}
                </span>
              {/each}
            </div>
            <a href="/workspace/publications/pub-globecom" class="text-sm font-medium text-[--color-accent] hover:underline inline-flex items-center gap-1">
              Read paper details <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <!-- IEEE VTC Spring 2025 Card -->
        <div class="card flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-300">
          <div>
            <div class="flex justify-between items-start mb-3">
              <h4 class="font-serif text-2xl text-[--color-text] line-clamp-1">Q-ShielD V2X Communications</h4>
              <span class="text-xs font-mono text-[--color-status-live-text] uppercase px-2 py-0.5 bg-[--color-status-live-bg] border border-[--color-status-live-border]/20 rounded">Published</span>
            </div>
            <p class="text-sm text-[--color-muted] mb-6 line-clamp-3">
              Q-ShielD: CV-QKD Framework for Secure Autonomous Vehicle Communications against quantum-level adversarial attacks.
            </p>
          </div>
          <div>
            <div class="flex flex-wrap gap-1.5 mb-6">
              {#each ['V2X', 'CV-QKD', 'Quantum Security', 'NS-3'] as tag}
                <span class="text-[10px] font-mono bg-[--color-bg] text-[--color-muted] border border-[--color-border] px-2 py-0.5 rounded">
                  {tag}
                </span>
              {/each}
            </div>
            <a href="/workspace/publications/pub-vtc" class="text-sm font-medium text-[--color-accent] hover:underline inline-flex items-center gap-1">
              Read paper details <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
    <!-- Feature 2: Anonymous Reviews Panel -->
    <section class="flex flex-col gap-8 anim-item delay-1700 mt-16 border-t border-[--color-border] pt-16">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[--color-border]">
        <div class="flex flex-col gap-0.5">
          <h3 class="font-serif text-2xl text-[--color-text] m-0 leading-tight">Guestbook & Reviews</h3>
          <p class="text-xs text-[--color-muted] font-sans m-0 leading-normal">Leave an anonymous review or comment about my projects and research.</p>
        </div>
        
        <!-- Feature 1: Total Visitor Count Pill -->
        {#if visitorCount !== null}
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[--color-accent-dim] border border-[--color-border] text-[10px] font-mono text-[--color-accent] select-none shadow-2xs sm:self-center self-start">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>you are visitor #{visitorCount}</span>
          </div>
        {/if}
      </div>

      <!-- Reviews list -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#if reviews.length > 0}
          {#each reviews as review (review.id)}
            <div class="card flex flex-col justify-between hover:translate-y-[-1px] transition-transform duration-300">
              <div>
                <!-- Rating Stars -->
                <div class="flex items-center gap-0.5 text-amber-500 mb-2">
                  {#each Array.from({ length: review.rating }) as _}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  {/each}
                  {#each Array.from({ length: 5 - review.rating }) as _}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-3.5 h-3.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  {/each}
                </div>
                <!-- Review Message -->
                <p class="text-xs text-[--color-text] font-sans leading-relaxed text-justify mb-4">
                  {review.message}
                </p>
              </div>

              <!-- Author name & time metadata -->
              <div class="flex justify-between items-center text-[10px] text-[--color-muted] font-mono border-t border-[--color-border]/30 pt-3">
                <span class="font-bold text-[--color-accent]">{review.name || 'Anonymous'}</span>
                <span>{getRelativeTime(review.created_at)}</span>
              </div>
            </div>
          {/each}
        {:else}
          <div class="md:col-span-2 text-center py-12 text-xs text-[--color-muted] font-sans border border-dashed border-[--color-border] rounded-xl bg-[--color-surface]/50">
            No reviews yet. Be the first to share your thoughts!
          </div>
        {/if}
      </div>

      <!-- Submission Form -->
      <div class="w-full max-w-xl mx-auto mt-6 bg-[--color-surface] border border-[--color-border] rounded-xl p-6 shadow-2xs">
        <h4 class="font-serif text-lg text-[--color-text] mb-1 select-none">Write a Review</h4>
        <p class="text-[10px] text-[--color-muted] font-sans mb-4 select-none">Your email is not collected. Reviews are public.</p>
        
        <form onsubmit={handleSubmit} class="flex flex-col gap-4">
          <!-- Name field -->
          <div class="flex flex-col gap-1.5">
            <label for="review-name" class="text-[10px] font-mono uppercase tracking-wider text-[--color-muted] select-none">Name (Optional)</label>
            <input
              type="text"
              id="review-name"
              bind:value={newName}
              placeholder="Your name (optional)"
              class="w-full px-3 py-2 rounded-lg bg-[--color-bg] border border-[--color-border] text-xs font-sans text-[--color-text] focus:outline-hidden"
              maxlength="50"
            />
          </div>

          <!-- Message textarea -->
          <div class="flex flex-col gap-1.5">
            <label for="review-message" class="text-[10px] font-mono uppercase tracking-wider text-[--color-muted] select-none">Comment / Feedback</label>
            <textarea
              id="review-message"
              bind:value={newMessage}
              placeholder="Type your message here..."
              required
              rows="4"
              class="w-full px-3 py-2 rounded-lg bg-[--color-bg] border border-[--color-border] text-xs font-sans text-[--color-text] focus:outline-hidden resize-y"
              maxlength="1000"
            ></textarea>
          </div>

          <!-- Star Picker & Submit -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div class="flex items-center gap-3">
              <span class="text-[10px] font-mono uppercase tracking-wider text-[--color-muted] select-none">Rating:</span>
              <div class="flex items-center gap-1 select-none">
                {#each [1, 2, 3, 4, 5] as star}
                  <button
                    type="button"
                    onclick={() => newRating = star}
                    class="text-amber-500 hover:scale-110 transition-transform cursor-pointer bg-transparent border-none p-0 focus:outline-hidden"
                    aria-label="Rate {star} stars"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={star <= newRating ? "currentColor" : "none"}
                      stroke="currentColor"
                      stroke-width="1.5"
                      class="w-5 h-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                {/each}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              class="px-5 py-2 bg-[--color-accent] text-[--color-surface] rounded-lg font-medium text-xs border border-[--color-accent] hover:bg-opacity-90 transition-all cursor-pointer shadow-xs disabled:opacity-50 select-none"
            >
              {#if isSubmitting}
                Sending...
              {:else}
                {submitSuccess ? 'Sent ✓' : 'Submit Review'}
              {/if}
            </button>
          </div>
        </form>
      </div>
    </section>
  </main>

  <!-- Section 5: Footer -->
  <footer class="border-t border-[--color-border] py-12 mt-auto text-sm text-[--color-muted] font-sans anim-item delay-1700">
    <div class="container-wide flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="flex flex-col items-center md:items-start">
        <span class="font-serif italic text-lg text-[--color-text] font-medium">Param Desai</span>
        <span class="text-xs text-[--color-muted] mt-1 font-mono">Researcher & Developer</span>
      </div>
      
      <div class="flex flex-wrap justify-center gap-6 text-xs md:text-sm">
        <a href="mailto:desaiparam24@gmail.com" class="hover:text-[--color-accent] transition-colors flex items-center gap-1.5">
          <Mail size={15} /> desaiparam24@gmail.com
        </a>
        <a href="https://github.com/paramdesai24" target="_blank" rel="noopener noreferrer" class="hover:text-[--color-accent] transition-colors flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> GitHub
        </a>
        <a href="https://linkedin.com/in/paramdesai7" target="_blank" rel="noopener noreferrer" class="hover:text-[--color-accent] transition-colors flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> LinkedIn
        </a>
      </div>
    </div>
  </footer>
</div>

<style>
  /* Base animation settings */
  .anim-item {
    opacity: 0;
    transform: translateY(16px);
  }

  /* Entrance transitions triggered on parent class addition */
  :global(.animate-in) .anim-item {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Delay Cascade */
  .delay-100 { transition-delay: 100ms; }
  .delay-200 { transition-delay: 200ms; }
  .delay-300 { transition-delay: 300ms; }
  .delay-400 { transition-delay: 400ms; }
  .delay-500 { transition-delay: 500ms; }
  .delay-600 { transition-delay: 600ms; }
  .delay-700 { transition-delay: 700ms; }
  .delay-800 { transition-delay: 800ms; }
  .delay-900 { transition-delay: 900ms; }
  .delay-1000 { transition-delay: 1000ms; }
  .delay-1100 { transition-delay: 1100ms; }
  .delay-1200 { transition-delay: 1200ms; }
  .delay-1300 { transition-delay: 1300ms; }
  .delay-1400 { transition-delay: 1400ms; }
  .delay-1500 { transition-delay: 1500ms; }
  .delay-1600 { transition-delay: 1600ms; }
  .delay-1700 { transition-delay: 1700ms; }

  /* Bouncing arrow animation */
  .bounce-anim {
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-6px);
    }
    60% {
      transform: translateY(-3px);
    }
  }

  /* Scrollbar hider for research areas on mobile */
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-none {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

  /* Accessibility/prefers-reduced-motion fallback */
  @media (prefers-reduced-motion: reduce) {
    .anim-item {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
    .bounce-anim {
      animation: none !important;
    }
  }

  /* Typewriter specific classes */
  .typewriter-container {
    min-height: 1.6em;
    display: block;
  }
  .typewriter-cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background-color: currentColor;
    margin-left: 2px;
    vertical-align: middle;
    animation: blink 0.8s step-end infinite;
  }
  @keyframes blink {
    from, to { background-color: transparent }
    50% { background-color: currentColor }
  }
</style>
