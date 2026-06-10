<script lang="ts">
  import * as icons from 'simple-icons';

  interface Props {
    tech: string;
    size?: number;
  }

  let { tech, size = 24 }: Props = $props();

  const normalized = $derived(tech.trim().toLowerCase());

  const iconData = $derived.by(() => {
    switch (normalized) {
      case 'react':
        return { path: icons.siReact.path, hex: icons.siReact.hex, title: 'React' };
      case 'svelte':
      case 'sveltekit':
        return { path: icons.siSvelte.path, hex: icons.siSvelte.hex, title: 'SvelteKit' };
      case 'vite':
        return { path: icons.siVite.path, hex: icons.siVite.hex, title: 'Vite' };
      case 'fastapi':
        return { path: icons.siFastapi.path, hex: icons.siFastapi.hex, title: 'FastAPI' };
      case 'flask':
        return { path: icons.siFlask.path, hex: icons.siFlask.hex, title: 'Flask' };
      case 'express':
      case 'express.js':
        return { path: icons.siExpress.path, hex: icons.siExpress.hex, title: 'Express.js' };
      case 'langchain':
        return { path: icons.siLangchain.path, hex: icons.siLangchain.hex, title: 'LangChain' };
      case 'langgraph':
        // Custom simple shape for LangGraph if missing or use langchain/generic graph
        return {
          path: icons.siLangchain.path,
          hex: '0052FF',
          title: 'LangGraph'
        };
      case 'postgresql':
        return { path: icons.siPostgresql.path, hex: icons.siPostgresql.hex, title: 'PostgreSQL' };
      case 'dynamodb':
        return { path: icons.siAmazondynamodb.path, hex: icons.siAmazondynamodb.hex, title: 'DynamoDB' };
      case 'docker':
        return { path: icons.siDocker.path, hex: icons.siDocker.hex, title: 'Docker' };
      case 'git':
        return { path: icons.siGit.path, hex: icons.siGit.hex, title: 'Git' };
      case 'aws':
      case 'aws ecr & lambda':
        return { path: icons.siAmazonwebservices.path, hex: icons.siAmazonwebservices.hex, title: 'AWS' };
      case 'redis':
        return { path: icons.siRedis.path, hex: icons.siRedis.hex, title: 'Redis' };
      case 'supabase':
        return { path: icons.siSupabase.path, hex: icons.siSupabase.hex, title: 'Supabase' };
      case 'pytorch':
        return { path: icons.siPytorch.path, hex: icons.siPytorch.hex, title: 'PyTorch' };
      case 'jupyter':
        return { path: icons.siJupyter.path, hex: icons.siJupyter.hex, title: 'Jupyter' };
      case 'streamlit':
        return { path: icons.siStreamlit.path, hex: icons.siStreamlit.hex, title: 'Streamlit' };
      case 'typescript':
        return { path: icons.siTypescript.path, hex: icons.siTypescript.hex, title: 'TypeScript' };
      case 'python':
        return { path: icons.siPython.path, hex: icons.siPython.hex, title: 'Python' };
      case 'javascript':
        return { path: icons.siJavascript.path, hex: icons.siJavascript.hex, title: 'JavaScript' };
      case 'tailwindcss':
        return { path: icons.siTailwindcss.path, hex: icons.siTailwindcss.hex, title: 'TailwindCSS' };
      case 'node.js':
      case 'nodejs':
        return { path: icons.siNodedotjs.path, hex: icons.siNodedotjs.hex, title: 'Node.js' };
      case 'lightgbm':
        return {
          path: 'M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.4l6 3.7v7.8l-6 3.7-6-3.7V8.1l6-3.7z M12 6a2 2 0 100 4 2 2 0 000-4zm-4 5a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z',
          hex: '0078D4',
          title: 'LightGBM'
        };
      case 'xgboost':
        return {
          path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5h-2v-2h2v2zm0-4.5h-2V7h2v6z',
          hex: 'EC5A29',
          title: 'XGBoost'
        };
      default:
        return null;
    }
  });
</script>

{#if iconData}
  <span class="group relative inline-flex items-center justify-center select-none align-middle mx-0.5" style="width: {size}px; height: {size}px;">
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="#{iconData.hex}"
      title={iconData.title}
      class="transition-transform duration-200 group-hover:scale-110"
    >
      <title>{iconData.title}</title>
      <path d={iconData.path} />
    </svg>
    <span class="sr-only">{tech}</span>
    
    <span 
      class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 scale-75 rounded px-2 py-1 text-[10px] font-sans font-medium opacity-0 shadow-md transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap"
      style="background-color: var(--color-accent); color: var(--color-surface);"
    >
      {iconData.title}
      <span 
        class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
        style="border-top-color: var(--color-accent);"
      ></span>
    </span>
  </span>
{:else}
  <span>{tech}</span>
{/if}
