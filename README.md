# 🏛️ Param Desai's Portfolio

A premium, high-performance academic and engineering portfolio website built for **Param Desai**. The site is designed with a clean, responsive academic-aesthetic stylesheet, smooth micro-animations, and unified typography. It integrates Svelte 5 (runes-based reactivity), Tailwind CSS v4, MDSvex, and a Supabase backend for real-time guestbook interactions and live viewer tracking.

---

## 🚀 Technology Stack

*   **Framework**: [Svelte 5](https://svelte.dev/) (utilizing runes: `$state`, `$derived`, `$effect`, and Svelte 5 snippets) & [SvelteKit 2](https://svelte.dev/docs/kit)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom vanilla CSS custom properties design tokens for unified theme colors and typography
*   **Backend Database**: [Supabase](https://supabase.com/) (PostgreSQL & Realtime engine)
*   **Markdown Processing**: [MDSvex](https://mdsvex.pngwn.co/) (compiles Markdown documents into Svelte components with custom syntax highlighting)
*   **Icons**: [Lucide Svelte](https://lucide.dev/) & Brand SVGs via [Simple Icons](https://simpleicons.org/)
*   **Diagrams**: [Mermaid.js](https://mermaid.js.org/) (dynamically compiles inline Markdown block diagrams to responsive SVGs)
*   **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/) (client-side smooth scrolling interface)

---

## ✨ Features

### 1. Minimalist Landing Page
*   **Tagline**: Minimalist landing page showcasing Param's focus and core tagline: *"i do what i gotta do"*.
*   **Supabase Realtime Viewer Presence**: Near the guestbook section, the site tracks live viewers using Supabase Realtime Presence (`landing-page` channel). It displays an active viewer count and indicates your join order (e.g. `● you are the 4th viewer`).
*   **Anonymous Reviews Guestbook**: An interactive panel at the bottom of the landing page. Users can submit structured feedback (a comment with a name/alias and a 1-5 star rating) directly into a Supabase database. It displays reviews with relative time stamps and features optimistic UI state updates.

### 2. Workspace Layout
*   **Sidebar Navigation**: High-contrast, clean sidebar featuring profile photo, interactive social/email contact routes, and pages list. Contracted navigation translates to a drawer menu on mobile/phone screens.
*   **Unified Command Palette (`⌘K`)**: A keyboard-accessible overlay menu to search across pages, projects, and actions instantly. Operates seamlessly via Svelte stores.
*   **Sepia-Academic Theme & Toggle**: Curated light-dark color palette. The transition between light and dark modes uses custom buttery-smooth curves (450ms on desktop) and is optimized to run at a snappier `150ms` on phone viewports (`< 768px`) for immediate responsiveness.

### 3. Dynamic Publications & Research Overview (`/workspace/research`)
*   **Timeline Scrolling**: An autoscrolling horizontal timeline dynamically loops through peer-reviewed publications (venues like IEEE and Springer) at a specialized scroll rate optimized for mobile devices.
*   **Filterable Publications list (`/workspace/publications`)**: Filter papers by publication **Year** or **Research Area** with selected status pills colored in high-contrast theme charcoal/cream colors. Features click-to-expand abstracts.

### 4. Projects & MDSvex-compiled Architecture Diagrams (`/workspace/projects`)
*   **Engineering Showcase**: Lists active repositories and showcases with badges (`Live`, `Active`, `Prototype`) and first-hand achievements cards.
*   **Mermaid.js Dynamic Diagrams**: Markdown pages can embed raw ````mermaid` syntax blocks. Upon page render, the site parses these blocks, queries active CSS theme colors (e.g., page background `--color-bg`, borders `--color-border`), and compiles them into inline SVGs using Mermaid's `'base'` theme engine.
*   **Reactivity**: When toggling the dark-light theme, the markdown container remounts via a Svelte `{#key $theme}` block, automatically redrawing diagram boxes and text colors to maintain contrast.

### 5. TechLogo SVGs Integration
*   **Re-usable Component**: [TechLogo.svelte](file:///c:/Portfolio/src/lib/components/TechLogo.svelte) maps technology names to brand SVGs and hex colors, includes hover tooltips, and preserves screen reader accessibility. It falls back to clean monospaced text if the brand SVG is not found.
*   Used consistently across:
    *   Resume page (Skills lists)
    *   Experience and Projects lists (Cards tags)
    *   Project/Experience details page (Sidebar info blocks)

---

## 🛠️ Local Development

### 1. Prerequisites
Ensure you have **Node.js** installed (v18+ recommended) and `npm`.

### 2. Environment Setup
Create a `.env` file in the root of the project to configure your Supabase instance:
```env
PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

### 3. Install Dependencies
```sh
npm install
```

### 4. Running Dev Server
To start the local SvelteKit development server:
```sh
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Building for Production
To compile and build an optimized production bundle:
```sh
npm run build
```

---

## 📁 Repository Map

*   `src/app.html` — Base HTML template loading Google Fonts.
*   `src/app.css` — Global styling rules, Tailwind imports, and layout variables.
*   `src/routes/` — SvelteKit routing hierarchy (Landing page and Workspace pages).
*   `src/lib/components/` — Reusable components (Command Palette, Tech logos, Diagrams).
*   `src/lib/content/` — Markdown-based publications and projects data parsed by MDSvex.
*   `src/lib/stores/` — Svelte store definitions (Theme selection, Command Palette state).
*   `src/lib/supabase.ts` — Initialized Supabase client instance.
*   `svelte.config.js` — MDSvex compiler configurations and Mermaid renderer escapes.
*   `static/` — Static assets including `/avatar.png`.
