# Academic & Engineering Portfolio

A premium, high-performance academic and engineering portfolio website built for **Param Desai**. The site is designed with a clean, responsive academic-aesthetic stylesheet, smooth micro-animations, and unified typography.

---

## 🚀 Technology Stack

- **Framework**: [Svelte 5](https://svelte.dev/) & [SvelteKit 2](https://svelte.dev/docs/kit)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with Vanilla CSS custom property design tokens
- **Compiler/Bundler**: [Vite](https://vite.dev/)
- **Markdown Processing**: [MDSvex](https://mdsvex.pngwn.co/) (compiles Markdown documents into Svelte components with custom syntax highlighting)
- **Icons**: [Lucide Svelte](https://lucide.dev/)
- **Diagrams**: [Mermaid.js](https://mermaid.js.org/) (flowcharts compiled as inline HTML diagrams)

---

## ✨ Key Features & Structure

### 1. Landing Page
- Minimalist introductory screen highlighting Param's focus and core tagline: *"i do what i gotta do"*.
- Smooth entrance animations and links to primary workspace sections.

### 2. Workspace Layout
- **Desktop Sidebar & Mobile Drawer**: High-contrast, clean navigation panel featuring a profile photo, links, and quick-action shortcuts.
- **Unified Command Palette (`⌘K`)**: Interactive, keyboard-accessible command menu to search across pages, projects, and actions instantly.
- **Typography System**: Standardized on Google Font's **Instrument Sans** (for clean, readable body text) and **Instrument Serif** (for elegant academic headings).

### 3. Research Overview (`/workspace/research`)
- Summarized descriptions of academic domains: *Explainable AI (XAI)*, *Cybersecurity*, *Machine Unlearning*, and *Quantum Security*.
- **Autoscrolling Publications Timeline**: Dynamically loops through peer-reviewed publications (cml, icsc, vtc, healthcom, globecom, ai2m4ri) at a high-speed pace (2x scroll rate) for previewing contributions.

### 4. Publications List (`/workspace/publications`)
- Filterable database of papers published at international venues (IEEE, Springer, etc.).
- **Smart Filter Pills**: Toggle papers by publication **Year** or **Research Area** with selected status pills colored in high-contrast theme charcoal/cream colors.
- Interactive abstracts with toggle expansions ("Read Abstract" / "Collapse Abstract") that render without server-side layout shifts.

### 5. Projects Portfolio (`/workspace/projects`)
- Showcases engineering projects (BHOOMI, FC Analytics, PetBot, Research Assistant).
- Categorized status badges (`Live`, `Active`, `Prototype`) and first-hand achievements highlight cards.
- **Architecture Diagrams**: Project details pages compile raw Markdown Mermaid blocks into visual SVG/HTML diagrams safely.

### 6. Professional Resume (`/workspace/resume`)
- Clean layout featuring profile photo, tagline, and details.
- Achievements list including cleared French language examinations (A1 and A2 levels) placed clearly at the bottom.
- Refactored core focus competencies list focusing on technical areas: **Monte Carlo (MC)**, **RAG (Retrieval-Augmented Generation)**, **NLP**, and time-series forecasting.

---

## 🛠️ Local Development

### 1. Prerequisites
Ensure you have **Node.js** installed (v18+ recommended).

### 2. Install Dependencies
```sh
npm install
```

### 3. Running Dev Server
To start a development server with Hot Module Replacement (HMR):
```sh
npm run dev
```

### 4. Building for Production
To compile a fully optimized production bundle:
```sh
npm run build
```

### 5. Previewing Production Build
To spin up a local preview server serving the production build on port `4173`:
```sh
npm run preview
```
*(Or specify `--port 4173 --host` to expose it to the local network)*

---

## 📁 Repository Map

- `src/app.html` — Base HTML template loading Google Fonts.
- `src/app.css` — Global styling rules, Tailwind imports, and layout variables.
- `src/routes/` — SvelteKit routing hierarchy (Landing page and Workspace pages).
- `src/lib/components/` — Reusable modules (Command Palette, Mermaid Diagrams).
- `src/lib/content/` — Markdown-based publications and projects data parsed by MDSvex.
- `svelte.config.js` — MDSvex compiler configurations and Mermaid renderer escapes.
- `static/` — Static assets including `/avatar.png`.
