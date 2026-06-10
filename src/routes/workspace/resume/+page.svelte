<script lang="ts">
  import { onMount } from 'svelte';
  import { currentPageTitle } from '$lib/stores/workspace';
  import { Mail, Download, ExternalLink } from '@lucide/svelte';
  import TechLogo from '$lib/components/TechLogo.svelte';

  onMount(() => {
    currentPageTitle.set('Resume');
  });

  interface SkillCategory {
    category: string;
    items: string[];
  }

  const skillGroups: SkillCategory[] = [
    {
      category: 'Frameworks',
      items: ['FastAPI', 'React', 'LangChain', 'LangGraph', 'Flask', 'Express.js', 'Vite']
    },
    {
      category: 'ML/AI',
      items: ['Monte Carlo (MC)', 'RAG', 'NLP', 'Prophet', 'SARIMA', 'SQLAlchemy', 'LightGBM']
    },
    {
      category: 'Tools',
      items: ['PostgreSQL', 'DynamoDB', 'Docker', 'Git', 'AWS ECR & Lambda', 'WebSockets', 'Supabase']
    },
    {
      category: 'Research Areas',
      items: ['XAI', 'Adversarial ML', 'Machine Unlearning', 'Quantum Security']
    }
  ];

  const publications = [
    {
      citation: "\"Machine Unlearning-based Privacy-First Medical Imaging Framework for TB Detection.\" In Proceedings of the Scientific Workshop on AI for Medicine (AI2M4RI 2026), 2026. (Accepted)"
    },
    {
      citation: "\"Quantum-Secured Explainable Machine Unlearning for Phishing Detection in IoT.\" In Proceedings of the IEEE GLOBECOM 2025, 2025. (Accepted)"
    },
    {
      citation: "\"Q-ShielD: CV-QKD Framework for Secure Autonomous Vehicle Communications.\" In Proceedings of the IEEE Vehicular Technology Conference (VTC Spring 2025), 2025."
    },
    {
      citation: "\"Quantum-Based Edge Intelligence Framework for IoT Healthcare Systems.\" In Proceedings of the IEEE HealthCom 2025, 2025."
    },
    {
      citation: "\"Deep Learning and Explainable AI Framework for False Data Injection Attack Detection in Autonomous Vehicles.\" Presented at the IEEE International Conference on Semantic Computing (ICSC 2025), Tampa, Florida, USA, 2025."
    },
    {
      citation: "\"Explainable AI and Quantum Security for Smart Homes Network Attack Classification.\" Springer Journal of Computational Machine Learning (CML 2025), 2025."
    }
  ];
</script>

<div class="resume-page flex flex-col items-center w-full min-h-screen py-4 select-text">
  <div class="w-full max-w-[760px] bg-[--color-surface] border border-[--color-border] rounded-xl shadow-card p-8 md:p-12 print-container">
    
    <!-- Top Header Block -->
    <header class="mb-10 text-center md:text-left border-b border-[--color-border] pb-8">
      <div class="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
        <div class="flex flex-col md:flex-row items-center md:items-start gap-5 flex-1 w-full">
          <!-- Profile Photo -->
          <img 
            src="/avatar.png" 
            alt="Param Desai" 
            class="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover border border-[--color-border] shadow-2xs shrink-0 select-none"
          />
          <div class="flex-1 w-full">
            <h1 class="font-serif text-[40px] text-[--color-text] leading-none tracking-tight font-medium">
              Param Desai
            </h1>
            <p class="font-sans text-xs md:text-sm text-[--color-muted] mt-3 font-medium">
              i do what i gotta do &bull; B.Tech CSE, Nirma University &bull; IIT Madras
            </p>
            
            <!-- Contact Row -->
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 mt-4 text-xs text-[--color-muted]">
              <a href="mailto:desaiparam24@gmail.com" class="flex items-center gap-1.5 hover:text-[--color-accent] transition-colors">
                <Mail size={13} />
                <span>desaiparam24@gmail.com</span>
              </a>
              <span class="hidden sm:inline opacity-40">&bull;</span>
              <a href="https://github.com/paramdesai24" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 hover:text-[--color-accent] transition-colors">
                <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                <span>github.com/paramdesai24</span>
              </a>
              <span class="hidden sm:inline opacity-40">&bull;</span>
              <a href="https://linkedin.com/in/paramdesai7" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 hover:text-[--color-accent] transition-colors">
                <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>linkedin.com/in/paramdesai7</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Download Button -->
        <a 
          href="https://efptwclmybikeaahtciz.supabase.co/storage/v1/object/public/Resume/PARAM_DESAI_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          class="no-print shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[--color-accent] text-[--color-surface] text-xs font-sans font-medium hover:bg-opacity-90 transition-all shadow-xs cursor-pointer select-none"
        >
          <Download size={14} />
          <span>Download PDF Resume</span>
        </a>
      </div>
    </header>

    <!-- Content Sections -->
    <div class="flex flex-col gap-9">
      
      <!-- EDUCATION -->
      <section id="education" class="resume-section">
        <h2 class="font-mono text-[11px] tracking-widest text-[--color-muted] font-bold uppercase mb-1.5 select-none">Education</h2>
        <div class="h-px bg-[--color-border] mb-4"></div>
        
        <div class="flex flex-col gap-6">
          <div class="flex flex-col sm:flex-row sm:justify-between items-start gap-1">
            <div>
              <h3 class="font-sans font-semibold text-sm text-[--color-text]">Nirma University, Institute of Technology</h3>
              <p class="font-sans text-xs text-[--color-muted] font-medium mt-0.5">B.Tech in Computer Science and Engineering</p>
              <p class="font-sans text-xs text-[--color-muted] leading-relaxed mt-2">
                <span class="font-medium text-[--color-text]">Courses:</span> OS, DSA, OOP, DBMS, Networks, DAA, SE, Distributed Computing, Cloud Computing, ML, Deep Learning, Full Stack, Compiler Design
              </p>
            </div>
            <span class="font-mono text-xs text-[--color-muted] shrink-0 mt-0.5 select-none">2023 &ndash; Present</span>
          </div>

          <div class="flex flex-col sm:flex-row sm:justify-between items-start gap-1">
            <div>
              <h3 class="font-sans font-semibold text-sm text-[--color-text]">Indian Institute of Technology Madras</h3>
              <p class="font-sans text-xs text-[--color-muted] font-medium mt-0.5">Diploma in Data Science <span class="font-normal italic">(In Progress) | Foundation & Programming Completed</span></p>
              <p class="font-sans text-xs text-[--color-muted] leading-relaxed mt-2">
                <span class="font-medium text-[--color-text]">Courses:</span> ML Foundations, ML Techniques, ML Practice, Business Analytics, Data Science Tools, MAD I & II, DBMS, DSA
              </p>
            </div>
            <span class="font-mono text-xs text-[--color-muted] shrink-0 mt-0.5 select-none">2023 &ndash; Present</span>
          </div>
        </div>
      </section>

      <!-- RESEARCH EXPERIENCE -->
      <section id="research" class="resume-section">
        <h2 class="font-mono text-[11px] tracking-widest text-[--color-muted] font-bold uppercase mb-1.5 select-none">Research Experience</h2>
        <div class="h-px bg-[--color-border] mb-4"></div>
        
        <div class="flex flex-col sm:flex-row sm:justify-between items-start gap-1">
          <div class="flex-1">
            <h3 class="font-sans font-semibold text-sm text-[--color-text]">Research Assistant</h3>
            <p class="font-sans text-xs text-[--color-accent] font-medium mt-0.5">Research Group of Prof. Sudeep Tanwar & Prof. Rajesh Gupta</p>
            <ul class="font-sans text-xs text-[--color-muted] space-y-1.5 list-disc pl-4 mt-3 leading-relaxed">
              <li>Undergraduate research focusing on Explainable AI (XAI), Adversarial Machine Learning, Cybersecurity, and IoT Systems.</li>
              <li>Designed and evaluated ML/DL-based intrusion and false data injection attack detection frameworks for connected vehicle environments.</li>
              <li>Applied model interpretability methods (SHAP, LIME) to analyze feature importances and audit decision metrics.</li>
              <li>Contributed to modeling, experiment validation, and publishing of 5 peer-reviewed papers at IEEE and Springer venues.</li>
            </ul>
          </div>
          <span class="font-mono text-xs text-[--color-muted] shrink-0 mt-0.5 select-none">Jan 2025 &ndash; Dec 2025</span>
        </div>
      </section>

      <!-- INDUSTRY EXPERIENCE -->
      <section id="experience" class="resume-section">
        <h2 class="font-mono text-[11px] tracking-widest text-[--color-muted] font-bold uppercase mb-1.5 select-none">Industry Experience</h2>
        <div class="h-px bg-[--color-border] mb-4"></div>
        
        <div class="flex flex-col sm:flex-row sm:justify-between items-start gap-1">
          <div class="flex-1">
            <h3 class="font-sans font-semibold text-sm text-[--color-text]">AI/ML Intern</h3>
            <p class="font-sans text-xs text-[--color-accent] font-medium mt-0.5">DYU Labs</p>
            <ul class="font-sans text-xs text-[--color-muted] space-y-1.5 list-disc pl-4 mt-3 leading-relaxed">
              <li>Built AI-powered renewable energy solutions focusing on predictive solar analytics.</li>
              <li>Developed conversational AI pipelines and natural language processing solutions leveraging LangGraph agent structures.</li>
              <li>Engineered statistical and deep learning-based forecasting models for time-series environmental data.</li>
              <li>Contributed to deployment of production AI modules serving institutional clients including ISRO, NTPC, Kohler, and Bata.</li>
            </ul>
          </div>
          <span class="font-mono text-xs text-[--color-muted] shrink-0 mt-0.5 select-none">May 2026 &ndash; Jul 2026</span>
        </div>
      </section>

      <!-- PUBLICATIONS -->
      <section id="publications" class="resume-section">
        <h2 class="font-mono text-[11px] tracking-widest text-[--color-muted] font-bold uppercase mb-1.5 select-none">Publications</h2>
        <div class="h-px bg-[--color-border] mb-4"></div>
        
        <ol class="font-sans text-[11px] md:text-xs text-[--color-muted] space-y-3 pl-4 list-decimal leading-relaxed">
          {#each publications as pub}
            <li class="pl-1 text-justify">
              {@html pub.citation.replace(
                /In Proceedings of the [^,]+/g, 
                (match) => `<em class='text-[--color-text]'>${match}</em>`
              ).replace(
                /Springer Journal of [^,]+/g, 
                (match) => `<em class='text-[--color-text]'>${match}</em>`
              )}
            </li>
          {/each}
        </ol>
      </section>

      <!-- PROJECTS -->
      <section id="projects" class="resume-section">
        <h2 class="font-mono text-[11px] tracking-widest text-[--color-muted] font-bold uppercase mb-1.5 select-none">Projects</h2>
        <div class="h-px bg-[--color-border] mb-4"></div>
        
        <ul class="font-sans text-xs text-[--color-muted] space-y-2.5 list-none pl-0 leading-relaxed">
          <li>
            <a href="/workspace/projects/bhoomi" class="font-semibold text-xs text-[--color-text] hover:text-[--color-accent] hover:underline inline-flex items-center gap-1">
              BHOOMI
              <ExternalLink size={10} class="opacity-60" />
            </a>
            <span class="text-[--color-muted]">&mdash; An environmental intelligence platform integrating satellite datasets with multi-horizon forecasting models for climate monitoring and AI-assisted municipal reporting.</span>
          </li>
          <li>
            <a href="/workspace/projects/fc-analytics" class="font-semibold text-xs text-[--color-text] hover:text-[--color-accent] hover:underline inline-flex items-center gap-1">
              FC Analytics
              <ExternalLink size={10} class="opacity-60" />
            </a>
            <span class="text-[--color-muted]">&mdash; A full-stack sports analytics platform featuring real-time match forecasting, Monte Carlo tournament simulations, and live multi-user auction systems.</span>
          </li>
          <li>
            <a href="/workspace/projects/petbot" class="font-semibold text-xs text-[--color-text] hover:text-[--color-accent] hover:underline inline-flex items-center gap-1">
              PetBot
              <ExternalLink size={10} class="opacity-60" />
            </a>
            <span class="text-[--color-muted]">&mdash; An LLM-powered RAG system with natural language to SQL capabilities, revenue analytics pipelines, and voice-assisted conversational workflows.</span>
          </li>
          <li>
            <a href="/workspace/projects/research-assistant" class="font-semibold text-xs text-[--color-text] hover:text-[--color-accent] hover:underline inline-flex items-center gap-1">
              Research Assistant
              <ExternalLink size={10} class="opacity-60" />
            </a>
            <span class="text-[--color-muted]">&mdash; An offline, local-first paper assistant that automatically extracts and processes PDFs to generate section-aware summaries, simplified drafts, PPT decks, and podcast audio.</span>
          </li>
          <li>
            <a href="/workspace/projects/portfolio-website" class="font-semibold text-xs text-[--color-text] hover:text-[--color-accent] hover:underline inline-flex items-center gap-1">
              Developer Portfolio
              <ExternalLink size={10} class="opacity-60" />
            </a>
            <span class="text-[--color-muted]">&mdash; An interactive, high-performance academic and engineering portfolio website featuring smooth dark mode transitions, Supabase realtime guestbook components, and reactive theme-based diagram rendering.</span>
          </li>
        </ul>
      </section>

      <!-- ACHIEVEMENTS -->
      <section id="achievements" class="resume-section">
        <h2 class="font-mono text-[11px] tracking-widest text-[--color-muted] font-bold uppercase mb-1.5 select-none">Achievements</h2>
        <div class="h-px bg-[--color-border] mb-4"></div>
        
        <ul class="font-sans text-xs text-[--color-muted] space-y-1.5 list-disc pl-4 leading-relaxed">
          <li>Runner-Up, HACKaMINeD 2026 (PetBot)</li>
          <li>Runner-Up, AETRIX 2026 (BHOOMI)</li>
          <li>Conference Presenter, IEEE ICSC 2025 &mdash; Tampa, Florida, USA</li>
          <li>Gold Medalist, SOF International Mathematics Olympiad (IMO)</li>
          <li>Silver Medalist, SOF National Science Olympiad (NSO)</li>
          <li>National-Level Representative, Spell Bee Examination</li>
          <li>Distinction in Communication Skills (Grades 1&ndash;3), Trinity College London</li>
          <li>Represented Ahmedabad International School at MatheGon, IIT Gandhinagar</li>
          <li>Representative at the PYP Exhibition</li>
          <li>Cleared A1 and A2 levels of French Language Examination</li>
        </ul>
      </section>

      <!-- LEADERSHIP -->
      <section id="leadership" class="resume-section">
        <h2 class="font-mono text-[11px] tracking-widest text-[--color-muted] font-bold uppercase mb-1.5 select-none">Leadership</h2>
        <div class="h-px bg-[--color-border] mb-4"></div>
        
        <div class="flex flex-col gap-4">
          <div class="flex flex-col sm:flex-row sm:justify-between items-start gap-1">
            <div>
              <h3 class="font-sans font-semibold text-sm text-[--color-text]">Treasurer, CSI Nirma University</h3>
              <ul class="font-sans text-xs text-[--color-muted] list-disc pl-4 mt-1 leading-relaxed">
                <li>Managed financial strategies and execution for HACKaMINeD 2026 (2500+ registrations, INR 4.5L prize pool, held in collaboration with SUNY Binghamton).</li>
              </ul>
            </div>
            <span class="font-mono text-xs text-[--color-muted] shrink-0 mt-0.5 select-none">Aug 2025 &ndash; Present</span>
          </div>

          <div class="flex flex-col sm:flex-row sm:justify-between items-start gap-1">
            <div>
              <h3 class="font-sans font-semibold text-sm text-[--color-text]">Core Committee Member, CSI</h3>
              <ul class="font-sans text-xs text-[--color-muted] list-disc pl-4 mt-1 leading-relaxed">
                <li>Organized national-level hackathons and tech symposiums including HackNUThon 6.0 and CUBIX 2025.</li>
              </ul>
            </div>
            <span class="font-mono text-xs text-[--color-muted] shrink-0 mt-0.5 select-none">Jan 2025 &ndash; Aug 2025</span>
          </div>
        </div>
      </section>

      <!-- SKILLS -->
      <section id="skills" class="resume-section">
        <h2 class="font-mono text-[11px] tracking-widest text-[--color-muted] font-bold uppercase mb-1.5 select-none">Skills</h2>
        <div class="h-px bg-[--color-border] mb-4"></div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {#each skillGroups as group}
            <div>
              <h3 class="font-sans font-semibold text-xs text-[--color-text] mb-2 uppercase tracking-wide select-none">
                {group.category}
              </h3>
              <div class="flex flex-wrap gap-1.5 max-w-[200px]">
                {#each group.items as item}
                  <span class="px-2 py-0.5 rounded-sm text-[10px] font-mono bg-[--color-accent-dim] text-[--color-accent] border border-transparent font-medium flex items-center gap-1.5 transition-transform duration-200 hover:scale-105">
                    <TechLogo tech={item} size={16} />
                  </span>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- COMMUNITY SERVICE -->
      <section id="additional-details" class="resume-section">
        <div>
          <h2 class="font-mono text-[11px] tracking-widest text-[--color-muted] font-bold uppercase mb-1.5 select-none">Community Service</h2>
          <div class="h-px bg-[--color-border] mb-4"></div>
          <ul class="font-sans text-xs text-[--color-muted] space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>Volunteered in teaching and mentoring underprivileged children.</li>
            <li>Participated in educational outreach and community engagement activities.</li>
          </ul>
        </div>
      </section>

    </div>

  </div>
</div>

<style>
  /* Academic Resume Formatting overrides */
  .resume-section {
    scroll-margin-top: 80px;
  }

  /* PRINT STYLESHEET */
  @media print {
    :global(aside), :global(header.lg\:hidden), :global(header.sticky), :global(footer), .no-print {
      display: none !important;
    }
    
    :global(body), :global(html), .resume-page {
      background: #ffffff !important;
      color: #000000 !important;
      padding: 0 !important;
      margin: 0 !important;
      font-size: 10pt !important;
      line-height: 1.4 !important;
    }

    :global(.lg\:pl-64) {
      padding-left: 0 !important;
    }

    :global(main) {
      padding: 0 !important;
      margin: 0 !important;
      max-width: 100% !important;
    }

    .print-container {
      border: none !important;
      box-shadow: none !important;
      padding: 0 !important;
      background: transparent !important;
      max-width: 100% !important;
    }

    .resume-section {
      page-break-inside: avoid;
      margin-bottom: 2rem !important;
    }

    h1 {
      font-size: 26pt !important;
    }

    h2 {
      font-size: 10pt !important;
      margin-bottom: 0.25rem !important;
    }

    h3 {
      font-size: 11pt !important;
    }
    
    li, p, span {
      font-size: 9.5pt !important;
      color: #000000 !important;
    }
  }
</style>
