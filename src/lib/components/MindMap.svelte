<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import { browser } from '$app/environment';
  import { ZoomIn, ZoomOut, Maximize2, Minimize2, RefreshCw } from 'lucide-svelte';

  // Svelte 5 callback prop format & bindable selectedNodeId
  let { onNodeSelect, selectedNodeId = $bindable(null) }: { 
    onNodeSelect?: (nodeData: any) => void; 
    selectedNodeId?: string | null;
  } = $props();

  let containerElement = $state<HTMLDivElement | null>(null);
  let cy = $state<any>(null);
  let isFullscreen = $state(false);

  // Monitor selectedNodeId changes from parent to clear selection reactive-ly
  $effect(() => {
    if (selectedNodeId === null && cy) {
      cy.elements().removeClass('selected highlighted faded');
    }
  });

  // Tooltip state
  let tooltip = $state({
    show: false,
    x: 0,
    y: 0,
    label: '',
    subtitle: ''
  });

  const nodesData = [
    // Person
    { id: 'param', label: 'Param Desai', type: 'person', subtitle: 'AI Researcher' },
    
    // Research
    { id: 'xai', label: 'Explainable AI', type: 'research', subtitle: 'Interpretability & Trust' },
    { id: 'cybersec', label: 'Cybersecurity', type: 'research', subtitle: 'Adversarial ML & Defence' },
    { id: 'unlearning', label: 'Machine Unlearning', type: 'research', subtitle: 'Right to be Forgotten' },
    { id: 'quantum', label: 'Quantum Security', type: 'research', subtitle: 'Post-Quantum Networks' },
    { id: 'nlp', label: 'NLP & LLMs', type: 'research', subtitle: 'RAG & Agentic Systems' },
    
    // Projects
    { id: 'bhoomi', label: 'BHOOMI', type: 'project', subtitle: 'Environmental Intelligence' },
    { id: 'fc', label: 'FC Analytics', type: 'project', subtitle: 'Sports Data Analytics' },
    { id: 'petbot', label: 'PetBot', type: 'project', subtitle: 'LLM & RAG Assistant' },
    
    // Institutions
    { id: 'nirma', label: 'Nirma University', type: 'institution', subtitle: 'B.Tech CSE Student' },
    { id: 'iitm', label: 'IIT Madras', type: 'institution', subtitle: 'Data Science Scholar' },
    
    // Industry
    { id: 'dyu', label: 'DYU Labs', type: 'industry', subtitle: 'AI/ML Intern' },
    
    // Publications
    { id: 'pub_globecom', label: 'IEEE GLOBECOM', type: 'publication', subtitle: 'Conference Paper' },
    { id: 'pub_vtc', label: 'IEEE VTC Spring', type: 'publication', subtitle: 'Conference Paper' },
    { id: 'pub_icsc', label: 'IEEE ICSC', type: 'publication', subtitle: 'Presented in Tampa, FL' },
    { id: 'pub_cml', label: 'Springer CML', type: 'publication', subtitle: 'Book Chapter' }
  ];

  const edgesData = [
    // Research to Center
    { id: 'e1', source: 'param', target: 'xai' },
    { id: 'e2', source: 'param', target: 'cybersec' },
    { id: 'e3', source: 'param', target: 'unlearning' },
    { id: 'e4', source: 'param', target: 'quantum' },
    { id: 'e5', source: 'param', target: 'nlp' },

    // Projects to Research Areas
    { id: 'e6', source: 'bhoomi', target: 'xai' },
    { id: 'e7', source: 'fc', target: 'nlp' },
    { id: 'e8', source: 'petbot', target: 'nlp' },

    // Institutions to Center
    { id: 'e9', source: 'nirma', target: 'param' },
    { id: 'e10', source: 'iitm', target: 'param' },

    // Industry to Center & Research
    { id: 'e11', source: 'dyu', target: 'param' },
    { id: 'e12', source: 'dyu', target: 'nlp' },

    // Publications to Research Areas
    { id: 'e13', source: 'pub_globecom', target: 'cybersec' },
    { id: 'e14', source: 'pub_vtc', target: 'unlearning' },
    { id: 'e15', source: 'pub_icsc', target: 'xai' },
    { id: 'e16', source: 'pub_cml', target: 'xai' }
  ];

  const layoutOptions = {
    name: 'cose',
    animate: true,
    animationDuration: 550,
    refresh: 20,
    fit: true,
    padding: 50,
    randomize: false,
    componentSpacing: 100,
    nodeRepulsion: () => 180000,
    nodeOverlap: 20,
    idealEdgeLength: () => 80,
    edgeElasticity: () => 32,
    nestingFactor: 1.2,
    gravity: 1.1,
    numIter: 1000,
    initialTemp: 1000,
    coolingFactor: 0.99,
    minTemp: 1.0
  };

  onMount(async () => {
    if (!browser || !containerElement) return;

    try {
      const cytoscape = (await import('cytoscape')).default;
      
      const getCSSVar = (name: string, fallback: string) => {
        if (typeof window !== 'undefined') {
          return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
        }
        return fallback;
      };

      const accentColor = getCSSVar('--color-accent', '#6B7FA5');
      const accentDimColor = getCSSVar('--color-accent-dim', '#E8EDF5');
      const surfaceColor = getCSSVar('--color-surface', '#FFFCF5');
      const textColor = getCSSVar('--color-text', '#222222');
      const mutedColor = getCSSVar('--color-muted', '#6B6357');
      const borderColor = getCSSVar('--color-border', '#E8E2D6');

      const elements = [
        ...nodesData.map(n => ({ data: n })),
        ...edgesData.map(e => ({ data: e }))
      ];

      cy = cytoscape({
        container: containerElement,
        elements,
        style: [
          {
            selector: 'node',
            style: {
              'label': 'data(label)',
              'font-family': 'Inter, system-ui, sans-serif',
              'font-size': '11px',
              'text-valign': 'center',
              'text-halign': 'center',
              'text-wrap': 'wrap',
              'text-max-width': '90px',
              'transition-property': 'opacity, background-color, border-color, width, height, border-width',
              'transition-duration': 250
            }
          },
          {
            selector: 'node[type="person"]',
            style: {
              'background-color': accentColor,
              'color': surfaceColor,
              'shape': 'ellipse',
              'width': '65px',
              'height': '65px',
              'font-family': 'Instrument Serif, serif',
              'font-size': '14px',
              'font-weight': 'bold',
              'border-width': '0px'
            }
          },
          {
            selector: 'node[type="research"]',
            style: {
              'background-color': surfaceColor,
              'border-color': accentColor,
              'border-width': '1.5px',
              'color': textColor,
              'shape': 'round-rectangle',
              'width': '110px',
              'height': '38px',
              'font-weight': 'bold'
            }
          },
          {
            selector: 'node[type="project"]',
            style: {
              'background-color': accentDimColor,
              'border-color': accentColor,
              'border-width': '1.5px',
              'color': textColor,
              'shape': 'round-rectangle',
              'width': '95px',
              'height': '32px'
            }
          },
          {
            selector: 'node[type="institution"]',
            style: {
              'background-color': borderColor,
              'border-color': borderColor,
              'border-width': '1px',
              'color': mutedColor,
              'shape': 'ellipse',
              'width': '80px',
              'height': '40px'
            }
          },
          {
            selector: 'node[type="industry"]',
            style: {
              'background-color': borderColor,
              'border-color': borderColor,
              'border-width': '1px',
              'color': mutedColor,
              'shape': 'ellipse',
              'width': '80px',
              'height': '40px'
            }
          },
          {
            selector: 'node[type="publication"]',
            style: {
              'background-color': surfaceColor,
              'border-color': borderColor,
              'border-width': '1px',
              'color': mutedColor,
              'shape': 'round-rectangle',
              'width': '110px',
              'height': '30px'
            }
          },
          {
            selector: 'edge',
            style: {
              'line-color': borderColor,
              'width': '1.5px',
              'curve-style': 'bezier',
              'transition-property': 'line-color, width, opacity',
              'transition-duration': 250
            }
          },
          // Interaction styles
          {
            selector: '.highlighted',
            style: {
              'line-color': accentColor,
              'width': '2.5px',
              'opacity': 1.0
            }
          },
          {
            selector: 'node.highlighted',
            style: {
              'border-color': accentColor,
              'border-width': '2.5px'
            }
          },
          {
            selector: 'node[type="person"].selected',
            style: {
              'width': '85px',
              'height': '85px',
              'border-color': accentColor,
              'border-width': '3px'
            }
          },
          {
            selector: 'node[type="research"].selected',
            style: {
              'width': '143px',
              'height': '49px',
              'border-color': accentColor,
              'border-width': '3px'
            }
          },
          {
            selector: 'node[type="project"].selected',
            style: {
              'width': '123px',
              'height': '41px',
              'border-color': accentColor,
              'border-width': '3px'
            }
          },
          {
            selector: 'node[type="institution"].selected, node[type="industry"].selected',
            style: {
              'width': '104px',
              'height': '52px',
              'border-color': accentColor,
              'border-width': '3px'
            }
          },
          {
            selector: 'node[type="publication"].selected',
            style: {
              'width': '143px',
              'height': '39px',
              'border-color': accentColor,
              'border-width': '3px'
            }
          },
          {
            selector: '.faded',
            style: {
              'opacity': 0.18
            }
          }
        ],
        layout: layoutOptions,
        userZoomingEnabled: true,
        userPanningEnabled: true,
        boxSelectionEnabled: false
      });

      // Events
      cy.on('tap', 'node', (evt: any) => {
        const node = evt.target;
        const neighborhood = node.neighborhood();
        
        cy.elements().removeClass('selected highlighted faded');
        
        node.addClass('selected');
        neighborhood.nodes().addClass('highlighted');
        node.connectedEdges().addClass('highlighted');
        
        const activeElements = node.union(neighborhood).union(node.connectedEdges());
        cy.elements().difference(activeElements).addClass('faded');
        selectedNodeId = node.data('id');
        onNodeSelect?.(node.data());
      });

      cy.on('tap', (evt: any) => {
        if (evt.target === cy) {
          resetSelection();
        }
      });

      // Tooltips & hover pointer
      cy.on('mouseover', 'node', (evt: any) => {
        const node = evt.target;
        const container = cy.container();
        if (container) {
          container.style.cursor = 'pointer';
        }

        const renderedPos = node.renderedPosition();
        tooltip = {
          show: true,
          x: renderedPos.x,
          y: renderedPos.y - 45,
          label: node.data('label'),
          subtitle: node.data('subtitle') || ''
        };
      });

      cy.on('mouseout', 'node', () => {
        const container = cy.container();
        if (container) {
          container.style.cursor = 'default';
        }
        tooltip.show = false;
      });

      cy.on('pan zoom drag', () => {
        tooltip.show = false;
      });

    } catch (error) {
      console.error('Failed to initialize Cytoscape:', error);
    }
  });

  onDestroy(() => {
    if (cy) {
      cy.destroy();
    }
  });

  function resetSelection() {
    if (cy) {
      cy.elements().removeClass('selected highlighted faded');
    }
    selectedNodeId = null;
    onNodeSelect?.(null);
  }

  function handleZoomIn() {
    if (cy) {
      cy.zoom({
        level: cy.zoom() * 1.25,
        position: { x: cy.width() / 2, y: cy.height() / 2 }
      });
    }
  }

  function handleZoomOut() {
    if (cy) {
      cy.zoom({
        level: cy.zoom() / 1.25,
        position: { x: cy.width() / 2, y: cy.height() / 2 }
      });
    }
  }

  function handleFit() {
    if (cy) {
      cy.fit();
      cy.center();
    }
  }

  async function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    await tick();
    if (cy) {
      cy.resize();
      cy.fit();
    }
  }
</script>

<div 
  class="relative border border-[--color-border] rounded-xl bg-[--color-surface] overflow-hidden flex flex-col transition-all duration-300 select-none
  {isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen' : 'h-[520px] md:h-[600px] w-full'}"
>
  <!-- Control panel overlay -->
  <div class="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-[--color-surface] border border-[--color-border] rounded-lg p-1.5 shadow-xs">
    <button 
      onclick={handleZoomIn}
      class="p-1.5 hover:bg-[--color-accent-dim] text-[--color-muted] hover:text-[--color-accent] rounded transition-colors"
      title="Zoom In"
      aria-label="Zoom in"
    >
      <ZoomIn size={16} />
    </button>
    <button 
      onclick={handleZoomOut}
      class="p-1.5 hover:bg-[--color-accent-dim] text-[--color-muted] hover:text-[--color-accent] rounded transition-colors"
      title="Zoom Out"
      aria-label="Zoom out"
    >
      <ZoomOut size={16} />
    </button>
    <button 
      onclick={handleFit}
      class="p-1.5 hover:bg-[--color-accent-dim] text-[--color-muted] hover:text-[--color-accent] rounded transition-colors"
      title="Fit to Screen"
      aria-label="Fit to screen"
    >
      <RefreshCw size={14} />
    </button>
    <div class="h-4 w-px bg-[--color-border] mx-0.5"></div>
    <button 
      onclick={toggleFullscreen}
      class="p-1.5 hover:bg-[--color-accent-dim] text-[--color-muted] hover:text-[--color-accent] rounded transition-colors"
      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {#if isFullscreen}
        <Minimize2 size={16} />
      {:else}
        <Maximize2 size={16} />
      {/if}
    </button>
  </div>

  <!-- Instruction Label -->
  <div class="absolute bottom-4 left-4 z-10 pointer-events-none">
    <span class="font-mono text-[10px] text-[--color-muted] bg-[--color-surface]/80 px-2 py-1 border border-[--color-border] rounded shadow-2xs">
      Click a node to highlight connections
    </span>
  </div>

  <!-- Cytoscape Container -->
  <div 
    bind:this={containerElement} 
    class="w-full flex-1 bg-[--color-surface]"
  ></div>

  <!-- Tooltip Overlay -->
  {#if tooltip.show}
    <div 
      class="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-full flex flex-col bg-[--color-surface] border border-[--color-border] px-3 py-1.5 rounded-lg shadow-md max-w-xs"
      style="left: {tooltip.x}px; top: {tooltip.y}px;"
    >
      <span class="font-sans text-xs font-semibold text-[--color-text]">{tooltip.label}</span>
      {#if tooltip.subtitle}
        <span class="font-mono text-[9px] text-[--color-muted] mt-0.5">{tooltip.subtitle}</span>
      {/if}
    </div>
  {/if}
</div>

<style>
  /* Ensure cytoscape core has full height and layout wraps nicely */
  :global(.cy-panzoom) {
    display: none !important;
  }
</style>
