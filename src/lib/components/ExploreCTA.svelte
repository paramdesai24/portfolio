<script lang="ts">
  import { ArrowRight, Download } from '@lucide/svelte';
  import { goto } from '$app/navigation';

  interface Props {
    visitorCount?: number | null;
  }

  let { visitorCount = null }: Props = $props();

  let ctaIsTransitioning = $state(false);

  function handleExploreClick(e: MouseEvent) {
    // Allow normal click behaviors (e.g., cmd/ctrl + click to open in new tab)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    
    e.preventDefault();
    if (ctaIsTransitioning) return;
    ctaIsTransitioning = true;
    
    // Quick 100ms delay for visual press effect before instant client-side routing
    setTimeout(() => {
      goto('/workspace/resume');
    }, 100);
  }
</script>

<section
  class="flex flex-col items-center anim-item delay-1700 mt-16"
  aria-labelledby="cta-heading"
  aria-roledescription="call to action section"
>
  <div
    class="cta-card w-full max-w-2xl"
    class:cta-transitioning={ctaIsTransitioning}
    aria-busy={ctaIsTransitioning}
  >
    <!-- Decorative top accent line -->
    <div class="cta-accent-bar" aria-hidden="true"></div>

    <div class="cta-inner">
      <!-- Eyebrow label -->
      <span class="cta-eyebrow">Continue the Journey</span>

      <!-- Heading -->
      <h3 id="cta-heading" class="cta-heading font-serif">Ready to Explore More?</h3>

      <!-- Description -->
      <p class="cta-description">
        You've only seen a glimpse of my work.<br />
        Explore my complete interactive resume to learn more about my research journey,
        publications, projects, technical skills, leadership, achievements, coursework,
        and professional experience.
      </p>

      <!-- Visitor pill -->
      {#if visitorCount !== null}
        <div class="cta-visitor-pill" aria-label="Visitor count: #{visitorCount}">
          <span class="cta-visitor-dot" aria-hidden="true"></span>
          <span>you are visitor #{visitorCount}</span>
        </div>
      {/if}

      <!-- CTA Buttons -->
      <div class="cta-buttons" role="group" aria-label="Profile action buttons">
        <!-- Primary CTA -->
        <a
          id="cta-explore-profile"
          href="/workspace/resume"
          data-sveltekit-preload-data="hover"
          onclick={handleExploreClick}
          class="cta-primary focus-ring"
          class:cta-primary-fading={ctaIsTransitioning}
          aria-disabled={ctaIsTransitioning}
          aria-label="Explore My Complete Profile (interactive resume)"
        >
          <span>Explore My Complete Profile</span>
          <span class="cta-arrow" aria-hidden="true"><ArrowRight size={16} /></span>
        </a>

        <!-- Secondary CTA -->
        <a
          id="cta-download-resume"
          href="/PARAM_DESAI_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          class="cta-secondary focus-ring"
          aria-label="Download Resume PDF document"
        >
          <Download size={14} aria-hidden="true" />
          <span>Download Resume</span>
        </a>
      </div>
    </div>
  </div>
</section>

<style>
  .cta-card {
    position: relative;
    border-radius: 1.25rem;
    border: 1px solid var(--color-border);
    background:
      radial-gradient(
        ellipse 80% 60% at 50% 0%,
        var(--color-accent-dim) 0%,
        transparent 70%
      ),
      var(--color-surface);
    box-shadow:
      0 0 0 1px var(--color-border),
      0 8px 48px -8px color-mix(in srgb, var(--color-accent) 12%, transparent);
    overflow: hidden;
    transition:
      transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 0.3s ease;
    -webkit-tap-highlight-color: transparent;
  }

  .cta-card:hover {
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--color-accent) 40%, var(--color-border)),
      0 16px 64px -8px color-mix(in srgb, var(--color-accent) 20%, transparent);
  }

  .cta-card.cta-transitioning {
    transform: scale(1.008);
    opacity: 0.8;
  }

  .cta-accent-bar {
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--color-accent) 40%,
      color-mix(in srgb, var(--color-accent) 60%, transparent) 100%
    );
    opacity: 0.7;
  }

  .cta-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 2.5rem 1.5rem 2rem;
    gap: 1rem;
  }

  @media (min-width: 640px) {
    .cta-inner {
      padding: 3.5rem 2.5rem 3rem;
    }
  }

  .cta-eyebrow {
    font-family: var(--font-mono, monospace);
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-accent);
    background: var(--color-accent-dim);
    border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
    padding: 0.25rem 0.85rem;
    border-radius: 9999px;
  }

  .cta-heading {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 400;
    line-height: 1.2;
    color: var(--color-text);
    margin: 0.25rem 0 0;
    letter-spacing: -0.02em;
  }

  .cta-description {
    font-size: 0.9rem;
    line-height: 1.75;
    color: var(--color-muted);
    max-width: 48ch;
    margin: 0.25rem 0 0;
  }

  .cta-visitor-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.2rem 0.75rem;
    border-radius: 9999px;
    background: var(--color-accent-dim);
    border: 1px solid var(--color-border);
    font-family: var(--font-mono, monospace);
    font-size: 0.6rem;
    color: var(--color-accent);
    margin-top: 0.25rem;
  }

  .cta-visitor-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(0.85); }
  }

  .cta-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 0.85rem;
    margin-top: 1.25rem;
  }

  /* High contrast focus ring for keyboard navigation */
  .focus-ring:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
  }

  .cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 1.5rem;
    border-radius: 0.6rem;
    background: var(--color-accent);
    color: var(--color-surface);
    font-size: 0.875rem;
    font-weight: 600;
    font-family: inherit;
    border: 1px solid var(--color-accent);
    text-decoration: none;
    transition:
      opacity 0.2s ease,
      transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 0.25s ease;
    box-shadow: 0 2px 16px -4px color-mix(in srgb, var(--color-accent) 50%, transparent);
    cursor: pointer;
  }

  .cta-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px -4px color-mix(in srgb, var(--color-accent) 55%, transparent);
  }

  .cta-primary:active {
    transform: translateY(0);
  }

  .cta-primary .cta-arrow {
    display: inline-flex;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .cta-primary:hover .cta-arrow {
    transform: translateX(4px);
  }

  .cta-primary.cta-primary-fading {
    opacity: 0.7;
  }

  .cta-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.7rem 1.25rem;
    border-radius: 0.6rem;
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 0.875rem;
    font-weight: 500;
    font-family: inherit;
    border: 1px solid var(--color-border);
    text-decoration: none;
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .cta-secondary:hover {
    background: var(--color-accent-dim);
    border-color: color-mix(in srgb, var(--color-accent) 35%, var(--color-border));
    transform: translateY(-1px);
  }

  .cta-secondary:active {
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    .cta-card,
    .cta-primary,
    .cta-primary .cta-arrow,
    .cta-secondary {
      transition: none !important;
    }
    .cta-visitor-dot {
      animation: none !important;
    }
  }
</style>
