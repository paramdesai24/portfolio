<script lang="ts">
  import { tick } from 'svelte';
  import { 
    X, 
    ExternalLink, 
    FileText, 
    Play, 
    BookOpen, 
    Layers, 
    Award, 
    Landmark, 
    Building, 
    User 
  } from 'lucide-svelte';

  // Svelte 5 props
  let { nodeData, onClose }: { nodeData: any; onClose: () => void } = $props();

  interface NodeDetail {
    title: string;
    type: 'person' | 'research' | 'project' | 'institution' | 'industry' | 'publication';
    description: string;
    fullTitle?: string;
    note?: string;
    techStack?: string[];
    researchThemes?: string[];
    bullets?: string[];
    links?: {
      github?: string;
      pdf?: string;
      demo?: string;
    };
    relatedPublications?: string[];
    relatedProjects?: string[];
    researchAreas?: string[];
  }

  // Dictionary for all nodes
  const nodeDetailsMap: Record<string, NodeDetail> = {
    param: {
      title: "Param Desai",
      type: "person",
      description: "Undergraduate researcher at Sudeep Tanwar's Research Lab with a deep interest in Explainable AI, Adversarial Machine Learning, and IoT Security. Specialized in building transparent and robust deep learning models.",
      bullets: [
        "B.Tech CSE student at Nirma University",
        "Data Science scholar at IIT Madras",
        "AI/ML Intern at DYU Labs",
        "Author of 6 peer-reviewed papers in IEEE and Springer journals/conferences"
      ],
      links: {
        github: "https://github.com/paramdesai24",
        demo: "/workspace/resume"
      }
    },
    xai: {
      title: "Explainable AI",
      type: "research",
      description: "Developing interpretability methods to make ML models trustworthy in high-stakes applications. Work spans SHAP, LIME, and attention-based explanations for adversarial and IoT threat detection scenarios.",
      relatedPublications: ["IEEE ICSC 2025", "Springer CML 2025"],
      relatedProjects: ["BHOOMI", "PetBot"]
    },
    cybersec: {
      title: "Cybersecurity & Adversarial ML",
      type: "research",
      description: "Analyzing vulnerabilities of neural networks to adversarial attacks. Researching evasion techniques, poisoning strategies, and defense models for IoT nodes, connected autonomous vehicles, and smart grids.",
      relatedPublications: ["IEEE GLOBECOM 2025", "IEEE ICSC 2025"],
      relatedProjects: ["BHOOMI"]
    },
    unlearning: {
      title: "Machine Unlearning",
      type: "research",
      description: "Formulating methods to delete specific data subsets or user contributions from trained model weights without full retraining. Essential for upholding the 'right to be forgotten' and GDPR/CCPA compliance in production systems.",
      relatedPublications: ["IEEE VTC Spring 2025"]
    },
    quantum: {
      title: "Quantum Security",
      type: "research",
      description: "Exploring post-quantum security modeling, Quantum Key Distribution (QKD) channels, and secure quantum cryptographic routing protocols for high-security environments.",
      relatedPublications: ["IEEE GLOBECOM 2025"]
    },
    nlp: {
      title: "NLP & LLMs",
      type: "research",
      description: "Designing agentic LLM pipelines using multi-agent state machines, semantic index search, and closed-loop feedback systems for predictive reasoning and analysis.",
      relatedProjects: ["PetBot", "FC Analytics"]
    },
    bhoomi: {
      title: "BHOOMI",
      type: "project",
      description: "Satellite-Based Environmental Intelligence Platform. Integrates satellite datasets with SARIMA, Prophet, and LSTM models for multi-horizon environmental forecasting and AI-assisted municipal reporting.",
      techStack: ["Python", "FastAPI", "LSTM", "Prophet", "SARIMA"],
      researchThemes: ["Intelligent Systems", "Time Series Forecasting"],
      links: {
        github: "https://github.com/paramdesai24/bhoomi"
      }
    },
    fc: {
      title: "FC Analytics",
      type: "project",
      description: "Sports Play Breakdown and tracking tool. Processes sports broadcast feeds to map player coordinates and transforms trajectory data into text play-by-play breakdowns using custom LLM descriptors.",
      techStack: ["OpenCV", "YOLO", "PyTorch", "FastAPI"],
      researchThemes: ["Computer Vision", "NLP Pipelines"],
      links: {
        github: "https://github.com/paramdesai24/fc-analytics"
      }
    },
    petbot: {
      title: "PetBot",
      type: "project",
      description: "Conversational RAG assistant serving pet owners with veterinary and care information. Built with semantic vector indexing of vet manuals and research publications to prevent hallucinated advice.",
      techStack: ["FastAPI", "ChromaDB", "LlamaIndex", "Svelte"],
      researchThemes: ["RAG Pipelines", "Semantic Retrieval"],
      links: {
        github: "https://github.com/paramdesai24/petbot"
      }
    },
    nirma: {
      title: "Nirma University",
      type: "institution",
      description: "Conducting Bachelor of Technology studies in Computer Science. Active researcher under Prof. Sudeep Tanwar and Prof. Rajesh Gupta at the Sudeep Tanwar Research Lab, authoring multiple cybersecurity publications.",
      bullets: [
        "Specialization: Computer Science & Engineering",
        "GPA: 9.1 / 10.0",
        "Active research member of the Tanwar Lab"
      ]
    },
    iitm: {
      title: "IIT Madras",
      type: "institution",
      description: "Pursuing a Diploma in Data Science. Immersive training in database management systems, regression models, big data analysis pipelines, and predictive algorithms.",
      bullets: [
        "Rigorous coursework in statistical modeling and machine learning applications"
      ]
    },
    dyu: {
      title: "DYU Labs",
      type: "industry",
      description: "AI/ML Intern. Engineered LangGraph-based agentic workflows with iterative feedback loops for predicting renewable energy output and cleaning high-dimensional sensor data.",
      bullets: [
        "Built multi-agent text processors using OpenAI and LangGraph",
        "Optimized forecasting pipelines for solar datasets"
      ]
    },
    pub_globecom: {
      title: "IEEE GLOBECOM 2025",
      type: "publication",
      description: "Co-authored a paper detailing secure edge communication architectures. Designed defense systems protecting IoT nodes from malicious falsified readings and data injection.",
      fullTitle: "Robust Anomaly Detection and False Data Injection Defense in IoT-Enabled Edge Grids",
      note: "Presented at IEEE Global Communications Conference (GLOBECOM)",
      researchAreas: ["Cybersecurity", "Quantum Security"]
    },
    'pub-globecom': {
      title: "IEEE GLOBECOM 2025",
      type: "publication",
      description: "Co-authored a paper detailing secure edge communication architectures. Designed defense systems protecting IoT nodes from malicious falsified readings and data injection.",
      fullTitle: "Robust Anomaly Detection and False Data Injection Defense in IoT-Enabled Edge Grids",
      note: "Presented at IEEE Global Communications Conference (GLOBECOM)",
      researchAreas: ["Cybersecurity", "Quantum Security"]
    },
    pub_vtc: {
      title: "IEEE VTC Spring 2025",
      type: "publication",
      description: "Authored research proposing a privacy-compliant unlearning wrapper. Deployed on vehicular edge systems to cleanly delete vehicle trace histories from aggregated neural networks.",
      fullTitle: "Private and Efficient Machine Unlearning in Connected Edge Networks",
      note: "Presented at IEEE Vehicular Technology Conference (VTC Spring)",
      researchAreas: ["Machine Unlearning"]
    },
    'pub-vtc': {
      title: "IEEE VTC Spring 2025",
      type: "publication",
      description: "Authored research proposing a privacy-compliant unlearning wrapper. Deployed on vehicular edge systems to cleanly delete vehicle trace histories from aggregated neural networks.",
      fullTitle: "Private and Efficient Machine Unlearning in Connected Edge Networks",
      note: "Presented at IEEE Vehicular Technology Conference (VTC Spring)",
      researchAreas: ["Machine Unlearning"]
    },
    pub_icsc: {
      title: "IEEE ICSC 2025",
      type: "publication",
      description: "Deep Learning and Explainable AI Framework for False Data Injection Attack Detection in Autonomous Vehicles.",
      fullTitle: "Deep Learning and Explainable AI Framework for False Data Injection Attack Detection in Autonomous Vehicles",
      note: "Presented in person at Tampa, Florida, USA",
      researchAreas: ["XAI", "Cybersecurity"],
      links: {
        pdf: "https://arxiv.org/abs/example"
      }
    },
    'pub-icsc': {
      title: "IEEE ICSC 2025",
      type: "publication",
      description: "Deep Learning and Explainable AI Framework for False Data Injection Attack Detection in Autonomous Vehicles.",
      fullTitle: "Deep Learning and Explainable AI Framework for False Data Injection Attack Detection in Autonomous Vehicles",
      note: "Presented in person at Tampa, Florida, USA",
      researchAreas: ["XAI", "Cybersecurity"],
      links: {
        pdf: "https://arxiv.org/abs/example"
      }
    },
    pub_cml: {
      title: "Springer CML 2025",
      type: "publication",
      description: "Contributed a book chapter analyzing post-hoc model explanations for medical diagnostic pipelines, focusing on validating transformer attention maps.",
      fullTitle: "Attention-Based Diagnostics and Explainability in Cyber-Physical Medical Systems",
      note: "Book Chapter in Springer Cyber-Physical Systems and Machine Learning (CML)",
      researchAreas: ["XAI"]
    },
    'pub-cml': {
      title: "Springer CML 2025",
      type: "publication",
      description: "Contributed a book chapter analyzing post-hoc model explanations for medical diagnostic pipelines, focusing on validating transformer attention maps.",
      fullTitle: "Attention-Based Diagnostics and Explainability in Cyber-Physical Medical Systems",
      note: "Book Chapter in Springer Cyber-Physical Systems and Machine Learning (CML)",
      researchAreas: ["XAI"]
    }
  };

  // State management for transitions
  let activeData = $state<NodeDetail | null>(null);
  let show = $state(false);

  $effect(() => {
    if (nodeData) {
      const detailed = nodeDetailsMap[nodeData.id] || {
        title: nodeData.label || "Node Details",
        type: nodeData.type || "research",
        description: "No description available."
      };
      activeData = detailed;
      tick().then(() => {
        show = true;
      });
    } else {
      show = false;
      const timer = setTimeout(() => {
        activeData = null;
      }, 250);
      return () => clearTimeout(timer);
    }
  });

  function handleClose() {
    show = false;
    setTimeout(() => {
      onClose();
    }, 250);
  }

  // Accessibility focus trap action
  function focusTrap(el: HTMLElement) {
    const focusableSelectors = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const previousActive = document.activeElement as HTMLElement | null;

    function getFocusable() {
      return Array.from(el.querySelectorAll(focusableSelectors)) as HTMLElement[];
    }

    setTimeout(() => {
      const focusable = getFocusable();
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }, 50);

    function handleKeydown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const focusable = getFocusable();
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }

    el.addEventListener('keydown', handleKeydown);

    return {
      destroy() {
        el.removeEventListener('keydown', handleKeydown);
        if (previousActive && typeof previousActive.focus === 'function') {
          previousActive.focus();
        }
      }
    };
  }

  // Escape key handler
  function handleGlobalKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && activeData) {
      handleClose();
    }
  }

  // Category styles and icons mapping
  const badgeConfig = {
    person: { label: 'Researcher', bg: 'bg-[--color-accent-dim]', text: 'text-[--color-accent]', border: 'border-[--color-accent]', icon: User },
    research: { label: 'Research Area', bg: 'bg-[#FFFCF5]', text: 'text-[--color-text]', border: 'border-[--color-accent]', icon: BookOpen },
    project: { label: 'Project', bg: 'bg-[--color-accent-dim]', text: 'text-[--color-text]', border: 'border-[--color-accent]', icon: Layers },
    publication: { label: 'Publication', bg: 'bg-[#FFFCF5]', text: 'text-[--color-muted]', border: 'border-[--color-border]', icon: Award },
    institution: { label: 'Academy', bg: 'bg-[#F0ECE1]', text: 'text-[--color-muted]', border: 'border-[--color-border]', icon: Landmark },
    industry: { label: 'Industry', bg: 'bg-[#F0ECE1]', text: 'text-[--color-muted]', border: 'border-[--color-border]', icon: Building }
  };
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

{#if activeData}
  {@const config = badgeConfig[activeData.type]}
  <!-- Overlay Backdrop -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div 
    class="fixed inset-0 bg-black/10 z-40 backdrop-blur-xs transition-opacity duration-250 ease-out {show ? 'opacity-100' : 'opacity-0'}"
    onclick={handleClose}
    role="presentation"
  ></div>

  <!-- Details Panel -->
  <div 
    use:focusTrap
    class="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[320px] bg-[--color-surface] border-l border-[--color-border] shadow-[-4px_0_24px_rgba(0,0,0,0.08)] p-6 overflow-y-auto flex flex-col justify-between transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] {show ? 'translate-x-0' : 'translate-x-full'}"
    aria-modal="true"
    role="dialog"
    aria-label="{activeData.title} details"
  >
    <div class="flex flex-col">
      <!-- Header row -->
      <div class="flex items-center justify-between mb-4">
        <!-- Type Badge -->
        <div>
          {#if config}
            {@const IconComponent = config.icon}
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border uppercase tracking-wider font-semibold {config.bg} {config.text} {config.border}">
              <IconComponent size={10} />
              {config.label}
            </span>
          {/if}
        </div>

        <!-- × Close button -->
        <button 
          onclick={handleClose}
          class="p-1 text-[--color-muted] hover:text-[--color-text] hover:bg-[--color-accent-dim] rounded transition-colors focus:outline-hidden focus:ring-1 focus:ring-[--color-accent]"
          aria-label="Close panel"
        >
          <X size={18} />
        </button>
      </div>

      <!-- Title & Subtitle -->
      <h2 class="font-serif text-[22px] text-[--color-text] leading-snug">{activeData.title}</h2>
      {#if activeData.fullTitle && activeData.fullTitle !== activeData.title}
        <p class="font-sans text-[11px] text-[--color-muted] italic mt-1 leading-normal">{activeData.fullTitle}</p>
      {/if}
      {#if activeData.note}
        <p class="font-mono text-[9px] text-[--color-accent] mt-1.5 leading-normal">{activeData.note}</p>
      {/if}

      <div class="h-px bg-[--color-border] my-4"></div>

      <!-- Description -->
      <p class="font-sans text-xs text-[--color-text] leading-[1.7] text-justify">
        {activeData.description}
      </p>

      <!-- Bullets (for education/work/profile nodes) -->
      {#if activeData.bullets && activeData.bullets.length > 0}
        <ul class="mt-4 space-y-2.5">
          {#each activeData.bullets as bullet}
            <li class="flex items-start gap-2 text-xs font-sans text-[--color-muted] leading-normal">
              <span class="text-[--color-accent] mt-1 select-none">▪</span>
              <span>{bullet}</span>
            </li>
          {/each}
        </ul>
      {/if}

      <!-- Dynamic Related Sections -->
      <!-- Related Publications -->
      {#if activeData.relatedPublications && activeData.relatedPublications.length > 0}
        <div class="mt-5">
          <h3 class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] font-bold mb-2">Related Publications</h3>
          <div class="flex flex-wrap gap-1.5">
            {#each activeData.relatedPublications as pub}
              <span class="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-sans bg-[--color-bg] border border-[--color-border] text-[--color-text]">
                {pub}
              </span>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Related Projects -->
      {#if activeData.relatedProjects && activeData.relatedProjects.length > 0}
        <div class="mt-5">
          <h3 class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] font-bold mb-2">Related Projects</h3>
          <div class="flex flex-wrap gap-1.5">
            {#each activeData.relatedProjects as proj}
              <span class="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-sans bg-[--color-accent-dim] text-[--color-accent] font-medium border border-transparent">
                {proj}
              </span>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Research Areas -->
      {#if activeData.researchAreas && activeData.researchAreas.length > 0}
        <div class="mt-5">
          <h3 class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] font-bold mb-2">Research Areas</h3>
          <div class="flex flex-wrap gap-1.5">
            {#each activeData.researchAreas as area}
              <span class="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-sans bg-[--color-bg] border border-[--color-border] text-[--color-text] font-medium">
                {area}
              </span>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Tech Stack -->
      {#if activeData.techStack && activeData.techStack.length > 0}
        <div class="mt-5">
          <h3 class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] font-bold mb-2">Tech Stack</h3>
          <div class="flex flex-wrap gap-1.5">
            {#each activeData.techStack as tech}
              <span class="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-mono bg-[--color-bg] border border-[--color-border] text-[--color-muted]">
                {tech}
              </span>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Research Themes -->
      {#if activeData.researchThemes && activeData.researchThemes.length > 0}
        <div class="mt-5">
          <h3 class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] font-bold mb-2">Research Themes</h3>
          <div class="flex flex-wrap gap-1.5">
            {#each activeData.researchThemes as theme}
              <span class="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-sans bg-[--color-accent-dim] text-[--color-text] border border-transparent">
                {theme}
              </span>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Footer Row (External Links) -->
    {#if activeData.links && Object.keys(activeData.links).length > 0}
      <div class="mt-8 pt-4 border-t border-[--color-border] flex flex-col gap-2">
        {#if activeData.links.github}
          <a 
            href={activeData.links.github} 
            target="_blank" 
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg border border-[--color-border] bg-transparent text-xs font-sans font-medium text-[--color-text] hover:bg-[--color-accent-dim] hover:text-[--color-accent] transition-colors focus:outline-hidden focus:ring-1 focus:ring-[--color-accent]"
          >
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            <span>GitHub</span>
            <ExternalLink size={10} class="opacity-60" />
          </a>
        {/if}
        {#if activeData.links.pdf}
          <a 
            href={activeData.links.pdf} 
            target="_blank" 
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg border border-[--color-border] bg-transparent text-xs font-sans font-medium text-[--color-text] hover:bg-[--color-accent-dim] hover:text-[--color-accent] transition-colors focus:outline-hidden focus:ring-1 focus:ring-[--color-accent]"
          >
            <FileText size={12} />
            <span>PDF</span>
            <ExternalLink size={10} class="opacity-60" />
          </a>
        {/if}
        {#if activeData.links.demo}
          <a 
            href={activeData.links.demo} 
            class="inline-flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg border border-[--color-border] bg-transparent text-xs font-sans font-medium text-[--color-text] hover:bg-[--color-accent-dim] hover:text-[--color-accent] transition-colors focus:outline-hidden focus:ring-1 focus:ring-[--color-accent]"
          >
            <Play size={12} />
            <span>View Resume</span>
            <ExternalLink size={10} class="opacity-60" />
          </a>
        {/if}
      </div>
    {/if}
  </div>
{/if}
