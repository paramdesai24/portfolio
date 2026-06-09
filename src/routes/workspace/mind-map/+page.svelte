<script lang="ts">
  import { onMount } from 'svelte';
  import { currentPageTitle } from '$lib/stores/workspace';
  import MindMap from '$lib/components/MindMap.svelte';
  import NodePanel from '$lib/components/NodePanel.svelte';

  onMount(() => {
    currentPageTitle.set('Mind Map');
  });

  // Reactive states
  let selectedNode = $state<any>(null);
  let selectedNodeId = $state<string | null>(null);

  function handleNodeSelect(nodeData: any) {
    selectedNode = nodeData;
  }

  function handlePanelClose() {
    selectedNode = null;
    selectedNodeId = null;
  }
</script>

<div class="flex flex-col w-full">
  <!-- Title section -->
  <div class="mb-6">
    <h1 class="font-serif text-3xl text-[--color-text] tracking-tight">Interactive Knowledge Map</h1>
    <p class="font-sans text-sm text-[--color-muted] mt-1.5">
      A visual representation of interconnected research areas, publications, academic environments, and active projects.
    </p>
  </div>

  <!-- Mind Map Container (Full Width) -->
  <div class="w-full">
    <MindMap bind:selectedNodeId={selectedNodeId} onNodeSelect={handleNodeSelect} />
  </div>
</div>

<!-- Slide-in Details Panel -->
<NodePanel nodeData={selectedNode} onClose={handlePanelClose} />
