import { tick } from 'svelte';

export type RevealMode = 'pixel' | 'shutter';

const pixelFrames = [
  { clipPath: 'polygon(0 0,0 0,0 24%,0 24%,0 52%,0 52%,0 100%,0 100%)' },
  { clipPath: 'polygon(0 0,62% 0,62% 24%,48% 24%,48% 52%,34% 52%,34% 100%,0 100%)', offset: .48 },
  { clipPath: 'polygon(0 0,100% 0,100% 24%,100% 24%,100% 52%,100% 52%,100% 100%,0 100%)' }
];

const shutterFrames = [
  { clipPath: 'polygon(0 0,0 0,0 100%,0 100%)' },
  { clipPath: 'polygon(0 0,145% 0,100% 100%,0 100%)' }
];

function resolvePixels(image: HTMLImageElement) {
  const parent = image.parentElement;
  if (!parent) return;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;

  canvas.className = 'portfolio-pixel-overlay';
  canvas.setAttribute('aria-hidden', 'true');
  let frame = 0;
  let started = false;
  let start: number | undefined;

  function draw(now: number) {
    start ??= now;
    const progress = (now - start) / 480;
    if (progress >= 1 || !image.isConnected) {
      canvas.remove();
      return;
    }
    const columns = Math.round(14 + progress ** 2 * 150);
    canvas.width = columns;
    canvas.height = Math.max(1, Math.round(columns * image.naturalHeight / image.naturalWidth));
    context!.drawImage(image, 0, 0, canvas.width, canvas.height);
    frame = requestAnimationFrame(draw);
  }

  function begin() {
    if (started || !image.naturalWidth) return;
    started = true;
    parent!.append(canvas);
    frame = requestAnimationFrame(draw);
  }

  if (image.complete) begin();
  else image.addEventListener('load', begin, { once: true });

  return () => {
    image.removeEventListener('load', begin);
    cancelAnimationFrame(frame);
    canvas.remove();
  };
}

export function scrollReveal(container: HTMLElement, options: { mode?: RevealMode; path: string }) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let observer: IntersectionObserver | undefined;
  let revision = 0;
  const animations = new Set<Animation>();
  const pixelCleanups = new Set<() => void>();

  function clear() {
    observer?.disconnect();
    for (const animation of animations) animation.cancel();
    for (const cleanup of pixelCleanups) cleanup();
    animations.clear();
    pixelCleanups.clear();
  }

  async function prepare(mode?: RevealMode) {
    const request = ++revision;
    clear();
    if (!mode || reducedMotion.matches || !('IntersectionObserver' in window)) return;
    await tick();
    if (request !== revision) return;

    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target as HTMLElement;
        observer?.unobserve(target);
        if (target.contains(document.activeElement)) continue;
        if (target instanceof HTMLImageElement) {
          const cleanup = resolvePixels(target);
          if (cleanup) pixelCleanups.add(cleanup);
        } else {
          const animation = target.animate(mode === 'pixel' ? pixelFrames : shutterFrames, {
            duration: mode === 'pixel' ? 420 : 600,
            easing: mode === 'pixel' ? 'steps(9, end)' : 'cubic-bezier(.2,.72,.2,1)'
          });
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
          target.addEventListener('focusin', () => animation.cancel(), { once: true, signal: focusListeners.signal });
        }
      }
    });
    const blocks = '[data-scroll-reveal], .prose-academic > h2, .prose-academic > h2 + p';
    const targets = container.querySelectorAll(mode === 'pixel' ? blocks + ', figure > img' : blocks);
    for (const target of targets) {
      if (target.getBoundingClientRect().top >= 0) observer.observe(target);
    }
  }

  const focusListeners = new AbortController();
  const motionChanged = () => void prepare(options.mode);
  reducedMotion.addEventListener('change', motionChanged);
  void prepare(options.mode);

  return {
    update(next: typeof options) {
      if (next.path === options.path && next.mode === options.mode) return;
      options = next;
      void prepare(options.mode);
    },
    destroy() {
      revision++;
      clear();
      focusListeners.abort();
      reducedMotion.removeEventListener('change', motionChanged);
    }
  };
}
