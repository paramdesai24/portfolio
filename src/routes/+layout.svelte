<script lang="ts">
	import { page } from '$app/state';
	import '../app.css';
	import Lenis from 'lenis';
	import PortfolioNav from '$lib/components/home/PortfolioNav.svelte';

	let { children } = $props();

	$effect(() => {
		if (page.url.pathname === '/' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
			wheelMultiplier: 1.0,
			touchMultiplier: 4
		});

		let frame: number;
		function raf(time: number) {
			lenis.raf(time);
			frame = requestAnimationFrame(raf);
		}

		frame = requestAnimationFrame(raf);

		return () => {
			cancelAnimationFrame(frame);
			lenis.destroy();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href="/avatar.png" type="image/png" />
</svelte:head>
<PortfolioNav />
{@render children()}
