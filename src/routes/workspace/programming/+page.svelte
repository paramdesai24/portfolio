<script lang="ts">
  import { onMount } from 'svelte';
  import { currentPageTitle } from '$lib/stores/workspace';
  import { PROGRAMMING_CONFIG } from '$lib/programming/config';
  import type { CalendarDay, StatCard } from '$lib/programming/types';
  import { ExternalLink, AlertCircle, RefreshCw } from '@lucide/svelte';

  let { data } = $props();

  const calendar: CalendarDay[] = $derived(data.calendar ?? []);
  const stats: StatCard[] = $derived(data.stats ?? []);
  const lastUpdated: string = $derived(data.lastUpdated ?? '');
  const errors: { github: string | null; leetcode: string | null; codeforces: string | null } =
    $derived(data.errors ?? { github: null, leetcode: null, codeforces: null });

  let mounted = $state(false);
  let tooltip = $state<{ day: CalendarDay; x: number; y: number } | null>(null);

  onMount(() => {
    currentPageTitle.set('Programming');
    setTimeout(() => {
      mounted = true;
    }, 50);
  });

  // ── Calendar helpers ──────────────────────────────────────────────────────

  /** Returns 0–4 intensity level for a combined total count */
  function getIntensity(total: number): 0 | 1 | 2 | 3 | 4 {
    if (total === 0) return 0;
    if (total <= 2) return 1;
    if (total <= 5) return 2;
    if (total <= 10) return 3;
    return 4;
  }

  interface MonthBlock {
    label: string;
    weeks: (CalendarDay | null)[][];
  }

  /** Groups calendar days by month into separate visual month blocks (like LeetCode) */
  function groupByMonths(days: CalendarDay[]): MonthBlock[] {
    if (!days || days.length === 0) return [];

    const byMonth: Record<string, CalendarDay[]> = {};
    for (const day of days) {
      if (!day || !day.date) continue;
      const monthKey = day.date.slice(0, 7); // e.g. "2026-01"
      if (!byMonth[monthKey]) byMonth[monthKey] = [];
      byMonth[monthKey].push(day);
    }

    const blocks: MonthBlock[] = [];
    for (const monthDays of Object.values(byMonth)) {
      if (monthDays.length === 0) continue;
      const firstDate = new Date(monthDays[0].date + 'T00:00:00Z');
      const label = firstDate.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
      const firstDow = firstDate.getUTCDay();

      const padded: (CalendarDay | null)[] = [
        ...Array(firstDow).fill(null),
        ...monthDays
      ];

      const weeks: (CalendarDay | null)[][] = [];
      for (let i = 0; i < padded.length; i += 7) {
        const week = padded.slice(i, i + 7);
        while (week.length < 7) week.push(null);
        weeks.push(week);
      }

      blocks.push({ label, weeks });
    }

    return blocks;
  }

  const monthBlocks = $derived(groupByMonths(calendar));

  /** Returns platform category for styling: 'empty' | 'gh' | 'lc' | 'cf' | 'overlap' */
  function getPlatformCategory(day: CalendarDay | null): 'empty' | 'gh' | 'lc' | 'cf' | 'overlap' {
    if (!day || day.total === 0) return 'empty';
    const activeCount = (day.github > 0 ? 1 : 0) + (day.leetcode > 0 ? 1 : 0) + (day.codeforces > 0 ? 1 : 0);
    if (activeCount > 1) return 'overlap';
    if (day.github > 0) return 'gh';
    if (day.leetcode > 0) return 'lc';
    if (day.codeforces > 0) return 'cf';
    return 'empty';
  }

  const CELL = 16;   // cell size px
  const GAP = 4;     // gap px
  const STEP = CELL + GAP;

  /** Format date for display */
  function formatDate(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00Z').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    });
  }

  /** Format a UTC ISO timestamp as a relative-ish date */
  function formatLastUpdated(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  }

  /** Aria label for a calendar cell */
  function cellAriaLabel(day: CalendarDay | null): string {
    if (!day || !day.date) return 'No data';
    return `${formatDate(day.date)}: ${day.total} total (GitHub ${day.github}, LeetCode ${day.leetcode}, Codeforces ${day.codeforces})`;
  }

  function handleCellPointerEnter(e: PointerEvent, day: CalendarDay | null) {
    if (!day || day.total === 0) { tooltip = null; return; }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    tooltip = { day, x: rect.left + rect.width / 2, y: rect.top };
  }
  function handleCellPointerLeave() { tooltip = null; }
  function handleCellFocus(e: FocusEvent, day: CalendarDay | null) {
    if (!day || day.total === 0) { tooltip = null; return; }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    tooltip = { day, x: rect.left + rect.width / 2, y: rect.top };
  }
  function handleCellBlur() { tooltip = null; }

  // Platform error list for inline notices
  const platformErrors = $derived(
    ([
      ['GitHub', errors.github],
      ['LeetCode', errors.leetcode],
      ['Codeforces', errors.codeforces]
    ] as [string, string | null][]).filter(([, e]) => e !== null)
  );

  // simple-icons SVG paths for brand logos (monochrome)
  const GITHUB_PATH =
    'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12';

  // LeetCode "L" monogram (simple-icons path)
  const LEETCODE_PATH =
    'M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z';

  // Codeforces "C" monogram
  const CODEFORCES_PATH =
    'M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5V19.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V4.5C9 3.672 9.672 3 10.5 3h3zm9 7.5c.828 0 1.5.672 1.5 1.5v9c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V11.5c0-.828.672-1.5 1.5-1.5h3z';
</script>

<svelte:head>
  <title>Programming | Param Desai</title>
  <meta
    name="description"
    content="Competitive programming and development activity across LeetCode, Codeforces, and GitHub — contribution heatmap, stats, and rankings."
  />
</svelte:head>

<!-- Tooltip (portal-like, fixed to viewport) -->
{#if tooltip}
  <div
    class="tooltip-card"
    style="left: {tooltip.x}px; top: {tooltip.y}px;"
    role="tooltip"
    aria-live="polite"
  >
    <span class="tooltip-date">{formatDate(tooltip.day.date)}</span>
    <div class="tooltip-rows">
      <span class="tooltip-row">
        <svg width="10" height="10" viewBox="0 0 24 24" class="tooltip-icon" aria-hidden="true">
          <path fill="currentColor" d={GITHUB_PATH} />
        </svg>
        GitHub
        <span class="tooltip-count">{tooltip.day.github}</span>
      </span>
      <span class="tooltip-row">
        <svg width="10" height="10" viewBox="0 0 24 24" class="tooltip-icon" aria-hidden="true">
          <path fill="currentColor" d={LEETCODE_PATH} />
        </svg>
        LeetCode
        <span class="tooltip-count">{tooltip.day.leetcode}</span>
      </span>
      <span class="tooltip-row">
        <svg width="10" height="10" viewBox="0 0 24 24" class="tooltip-icon" aria-hidden="true">
          <path fill="currentColor" d={CODEFORCES_PATH} />
        </svg>
        Codeforces
        <span class="tooltip-count">{tooltip.day.codeforces}</span>
      </span>
    </div>
    <div class="tooltip-total">Total: <strong>{tooltip.day.total}</strong></div>
  </div>
{/if}

<div class="flex flex-col w-full" class:animate-in={mounted}>

  <!-- ── Header ─────────────────────────────────────────────────────────── -->
  <section class="anim-item delay-100 mb-8">
    <h1 class="font-serif text-[32px] text-[--color-text] tracking-tight">Programming</h1>
    <p class="font-sans text-sm text-[--color-muted] mt-1.5 max-w-[520px] leading-relaxed">
      Competitive programming and development activity across LeetCode, Codeforces, and GitHub.
    </p>
    <!-- Platform links -->
    <div class="flex items-center gap-4 mt-4">
      <a
        href={PROGRAMMING_CONFIG.links.github}
        target="_blank"
        rel="noopener noreferrer"
        class="platform-link"
        title="GitHub profile"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d={GITHUB_PATH} />
        </svg>
        <span>paramdesai24</span>
        <ExternalLink size={10} />
      </a>
      <a
        href={PROGRAMMING_CONFIG.links.leetcode}
        target="_blank"
        rel="noopener noreferrer"
        class="platform-link"
        title="LeetCode profile"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d={LEETCODE_PATH} />
        </svg>
        <span>paramdesai7</span>
        <ExternalLink size={10} />
      </a>
      <a
        href={PROGRAMMING_CONFIG.links.codeforces}
        target="_blank"
        rel="noopener noreferrer"
        class="platform-link"
        title="Codeforces profile"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d={CODEFORCES_PATH} />
        </svg>
        <span>Perom_7</span>
        <ExternalLink size={10} />
      </a>
    </div>
  </section>

  <!-- ── Platform error notices ─────────────────────────────────────────── -->
  {#if platformErrors.length > 0}
    <div class="anim-item delay-150 flex flex-col gap-2 mb-6">
      {#each platformErrors as [platform, errMsg]}
        <div class="error-notice">
          <AlertCircle size={13} class="shrink-0 mt-0.5" />
          <span><strong>{platform}</strong> data temporarily unavailable — {errMsg}</span>
        </div>
      {/each}
    </div>
  {/if}

  <!-- ── Activity Heatmap ───────────────────────────────────────────────── -->
  <section class="anim-item delay-200 mb-10" aria-label="Activity heatmap">
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-mono text-[10px] uppercase tracking-widest text-[--color-muted] font-bold">
        Activity · Jan 2026 → Today · UTC
      </h2>
      {#if lastUpdated}
        <a
          href="?refresh=true"
          class="flex items-center gap-1 font-mono text-[9px] text-[--color-muted] opacity-70 hover:opacity-100 transition-opacity"
          title="Click to force-refresh live stats from profiles"
        >
          <RefreshCw size={9} />
          {formatLastUpdated(lastUpdated)}
        </a>
      {/if}
    </div>

    <!-- Scroll wrapper for mobile -->
    <div class="calendar-scroll-wrapper" role="region" aria-label="Contribution calendar" tabindex="-1">
      <div class="calendar-inner">
        {#each monthBlocks as block}
          <div class="month-block">
            <!-- Cell grid for this month -->
            <div class="cell-grid" style="width: {block.weeks.length * STEP - GAP}px; height: {7 * STEP - GAP}px;">
              {#each block.weeks as week, wi}
                {#each week as day, di}
                  {#if day && day.date}
                    {@const intensity = getIntensity(day.total)}
                    {@const platformCat = getPlatformCategory(day)}
                    <!-- svelte-ignore a11y_interactive_supports_focus -->
                    <div
                      class="cal-cell platform-{platformCat} intensity-{intensity}"
                      style="left: {wi * STEP}px; top: {di * STEP}px;"
                      role="button"
                      tabindex={0}
                      aria-label={cellAriaLabel(day)}
                      onpointerenter={(e) => handleCellPointerEnter(e, day)}
                      onpointerleave={handleCellPointerLeave}
                      onfocus={(e) => handleCellFocus(e, day)}
                      onblur={handleCellBlur}
                    ></div>
                  {/if}
                {/each}
              {/each}
            </div>
            <!-- Month label centered below this month block (LeetCode style) -->
            <div class="month-label">{block.label}</div>
          </div>
        {/each}
      </div>

      <!-- Legend -->
      <div class="calendar-legend" aria-label="Heatmap legend">
        <div class="legend-group">
          <span class="platform-dot gh" aria-label="GitHub"></span>
          <span class="legend-label">GitHub</span>
        </div>
        <div class="legend-group">
          <span class="platform-dot lc" aria-label="LeetCode"></span>
          <span class="legend-label">LeetCode</span>
        </div>
        <div class="legend-group">
          <span class="platform-dot cf" aria-label="Codeforces"></span>
          <span class="legend-label">Codeforces</span>
        </div>
        <div class="legend-group">
          <span class="platform-dot overlap" aria-label="Multiple Platforms"></span>
          <span class="legend-label">Overlap</span>
        </div>
        <span class="legend-sep" aria-hidden="true">·</span>
        <div class="legend-group">
          <span class="legend-label">Less</span>
          {#each [0, 1, 2, 3, 4] as level}
            <div class="legend-swatch intensity-{level}" title="Intensity {level}" aria-hidden="true"></div>
          {/each}
          <span class="legend-label">More</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Divider -->
  <div class="h-px bg-[--color-border] mb-8 anim-item delay-350"></div>

  <!-- ── Stat Cards ─────────────────────────────────────────────────────── -->
  <section class="anim-item delay-400" aria-label="Programming statistics">
    <h2 class="font-mono text-[10px] uppercase tracking-widest text-[--color-muted] font-bold mb-5">
      Statistics
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each stats as card}
        <div
          class="stat-card group"
          class:stat-card--error={card.error !== null}
          id="stat-{card.id}"
        >
          <span class="stat-label">{card.label}</span>
          {#if card.error !== null}
            <div class="stat-unavail">
              <AlertCircle size={14} class="shrink-0" />
              <span>Unavailable</span>
            </div>
          {:else}
            <span class="stat-value">{card.value}</span>
          {/if}
          <span class="stat-sublabel">{card.subLabel}</span>
        </div>
      {/each}
    </div>
  </section>

</div>

<style>
  /* ── Entrance animation ─────────────────────────────────────────────── */
  .anim-item {
    opacity: 0;
    transform: translateY(14px);
  }
  :global(.animate-in) .anim-item {
    opacity: 1;
    transform: translateY(0);
    transition:
      opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .delay-100  { transition-delay: 50ms; }
  .delay-150  { transition-delay: 75ms; }
  .delay-200  { transition-delay: 100ms; }
  .delay-350  { transition-delay: 175ms; }
  .delay-400  { transition-delay: 200ms; }

  /* ── Platform links ─────────────────────────────────────────────────── */
  .platform-link {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--color-muted);
    text-decoration: none;
    padding: 0.25rem 0.6rem;
    border-radius: 9999px;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    transition: all 150ms ease;
  }
  .platform-link:hover {
    color: var(--color-text);
    border-color: var(--color-accent);
    background: var(--color-accent-dim);
  }

  /* ── Error notice ───────────────────────────────────────────────────── */
  .error-notice {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-family: var(--font-sans);
    font-size: 11px;
    color: var(--color-muted);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
  }

  /* ── Calendar scroll wrapper ─────────────────────────────────────────── */
  .calendar-scroll-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 0.75rem;
    /* Affordance: visible scrollbar on mobile */
    scrollbar-width: thin;
    scrollbar-color: var(--color-border) transparent;
  }

  .calendar-inner {
    display: flex;
    align-items: flex-start;
    gap: 14px; /* Distinct visual gap between months (LeetCode style) */
    min-width: max-content;
  }

  .month-block {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .month-label {
    margin-top: 8px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--color-muted);
    opacity: 0.75;
    user-select: none;
  }

  /* Cell grid */
  .cell-grid {
    position: relative;
  }

  /* Individual calendar cell */
  .cal-cell {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 3px;
    cursor: default;
    outline: none;
    border: 1px solid rgba(0, 0, 0, 0.14); /* Crisp subtle border in Light Mode */
    transition:
      transform 120ms ease,
      outline 100ms ease;
  }
  :global(.dark) .cal-cell {
    border: 1px solid rgba(255, 255, 255, 0.08); /* Crisp subtle border in Dark Mode */
  }
  .cal-cell:not(.empty):focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 1px;
    z-index: 2;
  }
  .cal-cell:not(.empty):hover,
  .cal-cell:not(.empty):focus-visible {
    transform: scale(1.25);
    z-index: 2;
  }

  /* Empty / Inactive */
  .intensity-0, .platform-empty { background-color: var(--color-bg); border: 1px solid var(--color-border); }
  :global(.dark) .intensity-0, :global(.dark) .platform-empty { background-color: #221E1A; border: 1px solid #332D27; }

  /* ── 4 Distinct Platform Color Families (Green, Amber, Crimson, Purple) ──── */

  /* 1. GitHub (Emerald Green) */
  .platform-gh.intensity-1 { background-color: #A7F3D0; }
  .platform-gh.intensity-2 { background-color: #34D399; }
  .platform-gh.intensity-3 { background-color: #059669; }
  .platform-gh.intensity-4 { background-color: #064E3B; }

  :global(.dark) .platform-gh.intensity-1 { background-color: #064E3B; }
  :global(.dark) .platform-gh.intensity-2 { background-color: #059669; }
  :global(.dark) .platform-gh.intensity-3 { background-color: #34D399; }
  :global(.dark) .platform-gh.intensity-4 { background-color: #A7F3D0; }

  /* 2. LeetCode (Warm Amber Gold) */
  .platform-lc.intensity-1 { background-color: #FDE68A; }
  .platform-lc.intensity-2 { background-color: #F59E0B; }
  .platform-lc.intensity-3 { background-color: #D97706; }
  .platform-lc.intensity-4 { background-color: #78350F; }

  :global(.dark) .platform-lc.intensity-1 { background-color: #78350F; }
  :global(.dark) .platform-lc.intensity-2 { background-color: #D97706; }
  :global(.dark) .platform-lc.intensity-3 { background-color: #F59E0B; }
  :global(.dark) .platform-lc.intensity-4 { background-color: #FDE68A; }

  /* 3. Codeforces (Crimson Red) */
  .platform-cf.intensity-1 { background-color: #FECACA; }
  .platform-cf.intensity-2 { background-color: #F87171; }
  .platform-cf.intensity-3 { background-color: #DC2626; }
  .platform-cf.intensity-4 { background-color: #7F1D1D; }

  :global(.dark) .platform-cf.intensity-1 { background-color: #7F1D1D; }
  :global(.dark) .platform-cf.intensity-2 { background-color: #DC2626; }
  :global(.dark) .platform-cf.intensity-3 { background-color: #F87171; }
  :global(.dark) .platform-cf.intensity-4 { background-color: #FECACA; }

  /* 4. Overlap (Royal Purple / Violet) */
  .platform-overlap.intensity-1 { background-color: #DDD6FE; }
  .platform-overlap.intensity-2 { background-color: #A78BFA; }
  .platform-overlap.intensity-3 { background-color: #7C3AED; }
  .platform-overlap.intensity-4 { background-color: #4C1D95; }

  :global(.dark) .platform-overlap.intensity-1 { background-color: #4C1D95; }
  :global(.dark) .platform-overlap.intensity-2 { background-color: #7C3AED; }
  :global(.dark) .platform-overlap.intensity-3 { background-color: #A78BFA; }
  :global(.dark) .platform-overlap.intensity-4 { background-color: #DDD6FE; }

  /* Legend Swatches (Cumulative Intensity Scale 1 to 4) */
  .legend-swatch.intensity-1 { background-color: #D1D5DB; }
  .legend-swatch.intensity-2 { background-color: #9CA3AF; }
  .legend-swatch.intensity-3 { background-color: #4B5563; }
  .legend-swatch.intensity-4 { background-color: #111827; }

  :global(.dark) .legend-swatch.intensity-1 { background-color: #374151; }
  :global(.dark) .legend-swatch.intensity-2 { background-color: #6B7280; }
  :global(.dark) .legend-swatch.intensity-3 { background-color: #9CA3AF; }
  :global(.dark) .legend-swatch.intensity-4 { background-color: #F9FAFB; }

  /* Legend row */
  .calendar-legend {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 20px;
    flex-wrap: wrap;
  }
  .legend-group {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .legend-swatch {
    position: relative;
    width: 13px;
    height: 13px;
    border-radius: 2.5px;
    flex-shrink: 0;
  }
  .legend-label {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--color-muted);
    opacity: 0.85;
    user-select: none;
  }
  .legend-sep {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--color-muted);
    opacity: 0.4;
  }
  /* Platform dots */
  .platform-dot {
    display: inline-block;
    width: 9px;
    height: 9px;
    border-radius: 50%;
  }
  .gh      { background-color: #10B981; }
  .lc      { background-color: #F59E0B; }
  .cf      { background-color: #EF4444; }
  .overlap { background-color: #8B5CF6; }

  :global(.dark) .gh      { background-color: #34D399; }
  :global(.dark) .lc      { background-color: #FBBF24; }
  :global(.dark) .cf      { background-color: #F87171; }
  :global(.dark) .overlap { background-color: #A78BFA; }

  /* ── Tooltip ─────────────────────────────────────────────────────────── */
  .tooltip-card {
    position: fixed;
    transform: translate(-50%, calc(-100% - 8px));
    z-index: 999;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 8px 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    pointer-events: none;
    min-width: 160px;
    font-family: var(--font-sans);
  }
  .tooltip-date {
    display: block;
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--color-muted);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .tooltip-rows {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .tooltip-row {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: var(--color-muted);
    flex: 1;
  }
  .tooltip-icon {
    opacity: 0.7;
    flex-shrink: 0;
  }
  .tooltip-count {
    margin-left: auto;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-text);
    font-weight: 600;
  }
  .tooltip-total {
    margin-top: 6px;
    padding-top: 5px;
    border-top: 1px solid var(--color-border);
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--color-muted);
    text-align: right;
  }
  .tooltip-total strong {
    color: var(--color-text);
  }

  /* ── Stat cards ─────────────────────────────────────────────────────── */
  .stat-card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 0.75rem;
    box-shadow: var(--shadow-card);
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    transition:
      border-color 200ms ease,
      box-shadow 200ms ease,
      transform 200ms ease;
  }
  .stat-card:hover {
    border-color: var(--color-accent);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
  .stat-card--error {
    opacity: 0.65;
  }
  .stat-label {
    font-family: var(--font-mono);
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-muted);
    font-weight: 700;
  }
  .stat-value {
    font-family: var(--font-serif);
    font-size: 36px;
    color: var(--color-text);
    line-height: 1;
    margin: 0.1rem 0;
    letter-spacing: -0.02em;
  }
  .stat-sublabel {
    font-family: var(--font-sans);
    font-size: 11px;
    color: var(--color-muted);
    line-height: 1.4;
  }
  .stat-unavail {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-family: var(--font-sans);
    font-size: 12px;
    color: var(--color-muted);
    margin: 0.2rem 0;
  }

  /* ── Mobile refinements ──────────────────────────────────────────────── */
  @media (max-width: 640px) {
    .stat-value { font-size: 28px; }
    .platform-link span { display: none; }
  }
</style>
