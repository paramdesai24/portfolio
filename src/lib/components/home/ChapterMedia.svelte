<script lang="ts">
  import { onMount, tick } from 'svelte';

  type Capture = { label: string; file: string; alt: string; width: number; height: number };
  let { images, onselect, matte = '#1b1e19' }: { images: Capture[]; onselect: (index: number) => void; matte?: string } = $props();
  let selected = $state(0);
  let capture = $derived(images[selected]);
  let image: HTMLImageElement;
  let canvas: HTMLCanvasElement;
  let refresh = () => {};
  let selection = 0;
  let switchStarted = -Infinity;

  async function select(index: number) {
    const request = ++selection;
    if (index === selected) return;
    const next = new Image();
    next.src = '/screenshots/' + images[index].file;
    try { await next.decode(); } catch { /* The normal image element handles a failed load. */ }
    if (request !== selection) return;
    switchStarted = performance.now();
    selected = index;
    onselect(index);
    await tick();
    refresh();
  }

  onMount(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const ctx = canvas.getContext('2d');
    const sample = document.createElement('canvas');
    const sampleContext = sample.getContext('2d');
    if (!ctx || !sampleContext) return;

    let frame = 0;
    let nearby = false;
    let previousImage = '';
    let previousWidth = 0;
    let previousSample = 0;

    function draw(now: number) {
      frame = 0;
      const rect = image.getBoundingClientRect();
      const switching = now - switchStarted < 460;
      const progress = Math.max(0, Math.min(1, switching
        ? (now - switchStarted) / 460
        : (innerHeight - rect.top) / Math.min(rect.height * .72, innerHeight * .56)));
      if (reduced.matches || !nearby || progress >= 1 || !image.complete || !image.naturalWidth || rect.width < 1) {
        canvas.hidden = true;
        return;
      }

      const width = Math.round(Math.min(rect.width, 1200));
      const columns = Math.round(16 + progress ** 2 * 164);
      if (previousWidth !== width || previousSample !== columns || previousImage !== image.currentSrc) {
        canvas.width = width;
        canvas.height = Math.max(1, Math.round(width * rect.height / rect.width));
        sample.width = columns;
        sample.height = Math.max(1, Math.round(columns * rect.height / rect.width));
        const scale = Math.min(sample.width / image.naturalWidth, sample.height / image.naturalHeight);
        const fittedWidth = image.naturalWidth * scale;
        const fittedHeight = image.naturalHeight * scale;
        sampleContext!.fillStyle = matte;
        sampleContext!.fillRect(0, 0, sample.width, sample.height);
        sampleContext!.drawImage(image, (sample.width - fittedWidth) / 2, (sample.height - fittedHeight) / 2, fittedWidth, fittedHeight);
        ctx!.imageSmoothingEnabled = false;
        ctx!.drawImage(sample, 0, 0, canvas.width, canvas.height);
        previousWidth = width;
        previousSample = columns;
        previousImage = image.currentSrc;
      }
      canvas.hidden = false;
      if (switching) refresh();
    }

    refresh = () => {
      if (frame === 0 && nearby) frame = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      nearby = entry.isIntersecting;
      if (nearby) refresh();
      else canvas.hidden = true;
    }, { rootMargin: '120px 0px' });
    observer.observe(image);
    window.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('resize', refresh);
    reduced.addEventListener('change', refresh);

    return () => {
      observer.disconnect();
      selection++;
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', refresh);
      window.removeEventListener('resize', refresh);
      reduced.removeEventListener('change', refresh);
    };
  });
</script>

<figure>
  <div class="frame">
    <div class="frame-bar"><span aria-hidden="true">● ● ●</span><span>{capture.label}</span></div>
    <a class="image" style:aspect-ratio={images[0].width + ' / ' + images[0].height} style:background-color={matte} href={'/screenshots/' + capture.file} target="_blank" rel="noreferrer" aria-label={'Open full-size ' + capture.label + ' (new tab)'}>
      <img bind:this={image} src={'/screenshots/' + capture.file} alt={capture.alt} width={capture.width} height={capture.height} loading="lazy" decoding="async" onload={() => refresh()} />
      <canvas bind:this={canvas} hidden aria-hidden="true"></canvas>
    </a>
  </div>
  <figcaption>
    <div class="switcher" role="group" aria-label="Choose image">
      {#each images as item, index}
        <button type="button" aria-pressed={selected === index} onclick={() => select(index)}>{item.label}</button>
      {/each}
    </div>
  </figcaption>
</figure>

<style>
  figure { margin:0; min-width:0; }
  .frame { overflow:hidden; border:1px solid #242623; border-radius:13px; background:#f8f7f0; box-shadow:5px 6px 0 #20231d; }
  .frame-bar { display:flex; gap:1rem; align-items:center; min-height:34px; padding:.25rem .8rem; border-bottom:1px solid #242623; font:650 .72rem/1.4 ui-monospace,monospace; }
  .frame-bar span:first-child { letter-spacing:.06em; }
  .image { display:block; position:relative; }
  img { position:absolute; inset:0; display:block; width:100%; height:100%; object-fit:contain; }
  canvas { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
  figcaption { margin-top:1rem; }
  .switcher { display:flex; flex-wrap:wrap; gap:.35rem; }
  button { display:inline-flex; align-items:center; gap:.35rem; min-height:44px; font-size:.84rem; font-weight:650; }
  button { border:1px solid #242623; border-radius:99px; padding:.35rem .8rem; cursor:pointer; }
  button[aria-pressed='true'] { background:#20231d; color:#fffef7; }
</style>
