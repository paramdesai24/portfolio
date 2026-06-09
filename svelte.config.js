import { mdsvex, escapeSvelte } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { createHighlighter } from 'shiki';

let highlighter;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	},
	preprocess: [
		mdsvex({
			extensions: ['.md'],
			remarkPlugins: [remarkGfm],
			rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
			highlight: {
				highlighter: async (code, lang) => {
					if (lang === 'mermaid') {
						const safeCode = escapeSvelte(code).replace(/`/g, '\\`').replace(/\$/g, '\\$');
						return `{@html \`<pre class="language-mermaid"><code class="language-mermaid">${safeCode}</code></pre>\`}`;
					}
					if (!highlighter) {
						highlighter = await createHighlighter({
							themes: ['github-light'],
							langs: ['javascript', 'bash']
						});
					}
					// Ensure language is loaded dynamically
					try {
						await highlighter.loadLanguage(lang || 'text');
					} catch (e) {
						// Fallback if language load fails
					}
					const html = escapeSvelte(
						highlighter.codeToHtml(code, {
							lang: lang || 'text',
							theme: 'github-light'
						})
					);
					return `{@html \`${html}\`}`;
				}
			}
		})
	],
	extensions: ['.svelte', '.md']
};

export default config;
