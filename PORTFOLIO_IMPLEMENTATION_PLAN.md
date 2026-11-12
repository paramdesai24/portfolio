# Portfolio implementation plan

Use [Param_Desai_Portfolio_Master_Context.md](Param_Desai_Portfolio_Master_Context.md) as the editorial input and [PORTFOLIO_REDESIGN.md](PORTFOLIO_REDESIGN.md) for the Sebastien Graf reference analysis. The master context covers the full profile. The public site gives each fact a home and selects the strongest evidence for the homepage.

## Full revamp direction

Build a new public portfolio with a character-led homepage, a visual project archive, and editorial research and writing pages. Replace the workspace sidebar as the primary navigation with a consistent header for Work, Research, Writing, and About, plus a direct CV link. Work leads to projects and experience. Research leads to themes, papers, and the full publication index. Programming remains accessible through Work or the footer. Each page should work as a direct entry point.

| UI direction | Reference | Decision |
| --- | --- | --- |
| Character-led tour | [Sebastien Graf](https://www.sebg.ch/) | Use the large opening statement, character cues, and full-width screenshot chapters on Home. Keep the research and CV links directly accessible. |
| Editorial reading | [Maggie Appleton](https://maggieappleton.com/) | Use topic and format as ways into the research and writing. Give figures and captions room to explain the evidence. |
| Compact professional index | [Brittany Chiang](https://brittanychiang.com/) | Apply the clear hierarchy and direct links to experience, About, and the CV. |
| Interaction details | [Rauno Freiberg](https://rauno.me/craft) | Use the interaction archive as a reference for focused details such as revealing an image crop or confirming a copied citation. |

Combine those patterns by page. Home uses large type, the illustrated avatar, and a small number of full-width features. Work pairs varied screenshot sizes with a consistent title and metadata grid. Research and Writing use a readable column, captions, and direct links between related entries. For the first visual review, compare a type-led opening with the avatar beside it against a desk-led opening using the existing illustration. Judge both on identity, legibility at narrow widths, and how quickly someone can reach the work or publications. Palette and type choices follow that review.

## Framework decision

Use **Astro with TypeScript, Astro components, CSS and Markdown content collections** as the target. Astro prerenders content pages by default, supports typed content collections, and can add JavaScript to individual interactions. Use CSS for visual transitions and small TypeScript modules for navigation, filters, image inspection and chapter cues. [Astro content collections](https://docs.astro.build/en/guides/content-collections/) · [Islands architecture](https://docs.astro.build/en/concepts/islands/)

SvelteKit remains a capable fallback with the lowest migration cost and existing server data flows. Next.js supports static exports and is viable if React becomes a project requirement. The current portfolio is mostly Markdown, images and links, so Astro's content model fits the proposed rebuild. [SvelteKit page options](https://svelte.dev/docs/kit/page-options) · [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)

Before migrating the full site, prove the approach on a separate branch with a homepage slice, one existing Markdown detail route, and the programming data contract. Verify Markdown rendering, slugs, image paths, output build, and the intended hosting adapter if live data is required. Keep the main site deployable throughout. Publish the replacement after route parity, redirects and rollback are verified.

## Foundation and data ownership

1. Record the baseline with `npm run check` and `npm run build`, capture the existing routes, and check the uncommitted About page. If the previously observed UTF-8 failure persists, repair the encoding in place while preserving the existing edits. Check the CV link on a clean build.
2. Migrate existing Markdown into Astro content collections with explicit schemas, keeping the existing slugs. Inventory MDSvex-specific markup and port embedded components only where used. Use frontmatter for title, description, role, status, featured order, and media references. Use a small typed profile record for shared identity, contact, and CV links. Derive counts from canonical records and explicit status criteria. Record old and new paths as each page is migrated.
3. Reconcile only the facts required by the page being built. Use the latest source identified in the master context and track unresolved claims in its reconciliation checklist. The key corrections are Xeroww's documented runtime versus roadmap, Q-TBNet publication status, formal author/venue metadata, the completed CSI term, and BHOOMI's submission status and evidence for adoption or impact. Treat the FC Analytics auction as part of that project unless later evidence identifies a separate product.
4. Set shared CSS tokens for page width, gutters, type scale, text and surface colors, focus, and motion. Prototype a single high-impact display face with a legible reading style, then settle the palette against the actual avatar, screenshots and figures. Use the homepage to establish the brand and propagate it through subsequent pages.

## Component map

Names below describe proposed Astro components. Extract shared components when the first real consumers justify them. Use slots for varying markup and keep route-specific compositions near their routes. Port existing diagram markup and behavior when an actual case study needs it.

| Build when | Components | Responsibility |
| --- | --- | --- |
| Home | `SiteHeader`, `SiteFooter`, `PageContainer`, `ActionLink` | Brand and route navigation, mobile menu, contact and social links, common gutters, accessible link styles. Use one route registry for shared nav and existing command palette destinations where practical. |
| Home | `HomeHero`, `AvatarGuide`, `SpeechBubble`, `FeatureChapter` | Oversized type, avatar and direct links to work, research and CV. Chapters pair one visual with context, a contribution and a real destination. The guide uses a neutral pose with optional supplied variants. |
| Home | `MediaFrame`, `ResponsiveImage` | Keep image dimensions reserved and use appropriate image sizes, aspect ratios and alt text. A browser frame suits genuine application screenshots. Preserve a clean unframed presentation for charts and photographs. |
| Projects | `ProjectTile`, `ProjectGallery`, `CaseStudyHeader`, `ProjectMetadata` | Featured/archive hierarchy and detail headers with scope, role, date, status and source links. Project accents come from the actual work. |
| First case study | `ReadingLayout`, `EvidenceFigure`, optional `ImageDialog` | Reuse article widths and heading styles. Figures support caption, credit and full-resolution link. Add an image dialog if repeated figure inspection benefits from it. Restore focus on close. Port version-accurate architecture diagrams where needed. |
| Research and publications | `ResearchTheme`, `PublicationRow`, `PublicationFilters`, `CitationActions` | Connect research themes to papers. Retain search and filters. Render authoritative author, venue, year and status data. Offer canonical paper and citation links, with feedback for copy actions if provided. |
| Experience and About | `TimelineEntry`, `EducationEntry`, `SkillGroup` | Show role progression, dates, outcomes and evidence links. Group skills by where they were used. Add a separate component only where the markup repeats. |
| Programming | `ActivityHeatmap`, `PlatformSummary`, `DataStatus` | Retain existing server fetching and cache behavior. Show source, date range and independent failure states. Provide a text summary for the heatmap. |
| Writing | `ArticleRow`, shared `ReadingLayout` and `EvidenceFigure` | Article index and long-form reading with code blocks, figures, accessible headings and reliable back navigation. |

### Homepage interaction specification

The first implementation is wired into the existing SvelteKit homepage so the new tour can use the current deployment and deep links. Astro remains the migration target. The supplied media supports paired captured views in each chapter. The guide uses an original pixel-art likeness of Param with his swept hair, glasses and smile. The shared head sprite supports pointer-driven head movement and a chest-triggered reaction. Chapter outfits use separate clothing and accessory layers. Independent eye articulation and full-body prop poses remain follow-up work.

The homepage is the sole redesign milestone for now. Its order is **Name and introduction → Xeroww → Research → BHOOMI → FC Analytics → Explore More and contact**. A top navigation link jumps to Explore More, which links out to the deeper sections. Use existing valid destinations until their redesigns are ready.

| Feature | Implementation and acceptance criteria |
| --- | --- |
| Full-body Param character | Prepare layered artwork for torso, head, eyes, brows, mouth and arms, with a clear torso hit area. Prototype a TypeScript controller for gaze and timed reactions. Use a Rive rig if the artwork requires richer deformation. A single flattened portrait requires additional artwork for articulated movement. |
| Follow the cursor | Map pointer coordinates to clamped eye and head offsets, interpolate smoothly, and ease back to neutral when the pointer leaves. Verify that movement from left to right visibly changes the gaze. |
| Ticklish reaction | Detect sustained pointer movement within the chest area. Trigger a recoil or laugh pose and original dialogue once per cooldown. Touch users can trigger the reaction with a tap and keyboard users with the same accessible control. |
| Tab return | Observe `visibilitychange`, pause animation while hidden, and greet once on return after a meaningful absence. Keep the current section and scroll position. An optional returning-visit greeting uses local state and is a separate trigger. |
| Greeting, blink and chapter cues | Play a short opening greeting or wave. Use intermittent blinks and restrained idle motion. Change pose or line when the active chapter changes. Give reactions priority over chapter dialogue and restore the relevant chapter line when the reaction finishes. |
| Additional character play | Prototype a bounded grab-and-release or a trick after the core avatar interactions work. Provide a simple button alternative for a drag interaction. Keep optional actions out of the essential navigation path. |
| Pixels resolve with scroll | Keep a real responsive image as the accessible base. Overlay a downsampled canvas with smoothing disabled, increase its sample resolution as the image enters the viewport, then remove the overlay to expose the exact original. Drive progress from viewport position so scrolling slowly or reversing before completion changes the effect. Observe only nearby media and cap canvas work. Try precomputed resolution layers if the canvas prototype is too expensive. |
| Responsive and reduced motion | Keep the character and speech clear of controls, keep screenshots sharp at rest, and keep all text immediately available. Disable tracking, idle motion and pixel animation under reduced motion. Maintain usable navigation, captions and images without JavaScript. |

### Chapter props and interactive media

Use the same face and body rig throughout the tour. Give each chapter its own prop layer, pose, dialogue, and accent. Place props on hand or neck anchors so they move with the body and respond to existing gaze, tickle and greeting states. Change props after the active chapter settles, using the same chapter state for the navigation highlight. Each chapter has a static pose and a short optional gesture.

| Chapter | Avatar change | Interactive feature |
| --- | --- | --- |
| Xeroww | Holds a market tape with a short candlestick strip and points to the selected candle | A stepper moves between two or three authentic captures from the same historical replay. Show the timestamp and explain what the visitor should notice at each step. |
| Research | Raises a magnifying glass toward a highlighted region | An Inspect figure control opens a readable crop of the real paper figure with its interpretation and paper link. Preserve axes and units. |
| BHOOMI | Holds a folded field map and points at a location | Compare heat and vegetation views of the same area using matched captures, a draggable divider, and labeled buttons. Use a simple toggle if the captures have different extents or resolutions. Keep each legend available. |
| FC Analytics | Wears a referee whistle on a lanyard and raises it to introduce the chapter | Switch among captured probability, bracket and auction views as the assets allow. Label simulated outputs and keep the auction identified as a distinct workflow. The whistle gesture is silent by default. |

Use the scroll-linked pixel reveal as the shared entrance for lead screenshots. Use chapter accents and an active chapter indicator to show where the visitor is. Keep the project controls deliberate and usable by touch and keyboard. Each chapter has a complete default view, with genuine captures and captions available in reduced-motion mode. Screenshot interactions run locally with supplied assets. Avoid fabricating intermediate market, map or simulation states.

Implement in this order within the homepage: complete content and navigation skeleton, shared avatar rig and chapter prop anchors, Xeroww pixel-reveal and replay prototype, remaining chapter gestures and media controls, desktop/mobile review. Verify fast and reverse scrolling, tab return, repeated chest gestures, touch, keyboard and reduced motion before starting another page.

## Implementation order

| Phase | Route | Deliverable and completion condition |
| --- | --- | --- |
| 0 | Baseline and Astro prototype | Verify the current build, route inventory, media and CV link. Build the Astro migration proof and two hero compositions. Decide how to support programming data on the chosen host. |
| 1 | `/` | Deliver the complete homepage interaction specification above. Build the dynamic character and scroll-driven pixel reveal alongside the fixed chapter order. Review the homepage before redesigning any other page. |
| 2 | `/workspace/projects` | Build the archive with selected visual anchors and the full project inventory supported by current evidence. Prepare canonical Xeroww and Regex records and expand other entries as evidence permits. Ensure every visible card leads to a complete existing destination. |
| 3 | `/workspace/projects/[slug]` | Implement Xeroww first as the reference case study, then BHOOMI, FC Analytics, PetBot and remaining entries individually. Show problem, personal contribution, design decisions, screenshots, validation and limits. Link FC's auction as a workflow within its case study. |
| 4 | `/workspace/research` | Build the research narrative around ST Lab, research questions and the Tampa photo. Link relevant papers from each theme. Use authentic figures where they help explain the work. |
| 5 | `/workspace/publications` | Reconcile all seven records, preserve search and filters, and render submitted work with its verified status. Confirm that counting and filtering match those records. |
| 6 | `/workspace/publications/[slug]` | Use one well-documented paper to establish the layout, then migrate the rest. Each page gives readers the formal citation, authorship, question, contribution, method, evidence and paper access. |
| 7 | `/workspace/experience` and `[slug]` | Redesign the index first and the entries individually. Group both DYU workstreams under one internship. Show CSI progression, ST Lab scope and community work where appropriate. |
| 8 | `/workspace/resume` | Complete the existing About direction with education, applied mathematics, IIT Madras pathway, leadership, service, and skills tied to work. Use the same CV destination throughout the site and keep the current route stable. |
| 9 | `/workspace/programming` | Redesign activity visualization with clear date ranges, source labels and partial failure handling. Verify existing data behavior at the route boundary. |
| 10 | `/workspace/blog` and `[slug]` | Refresh the index and article layout. Fact-check the Tampa piece against supported presentation details and review prose, links and code formatting. |
| 11 | Cross-site and cutover | Adopt the proposed clean URLs `/work`, `/work/[slug]`, `/research`, `/publications`, `/experience`, `/about`, `/programming` and `/writing` with corresponding detail paths. Verify a permanent redirect from every renamed `/workspace/...` URL, preserving detail slugs and meaningful query parameters. Check canonical URLs, sitemap, preview cards, 404 and production rollback. |

The table uses the existing route names for migration tracking. New links can target the clean routes as soon as their destinations exist in the Astro preview. Keep the current programming fetch, caching and partial-failure behavior behind an on-demand Astro route or endpoint with a supported adapter. Evaluate the homepage view counter separately and document its treatment before launch. Test that a failure of either integration leaves the main content available.

## How the four references affect the work

- **Impeccable** informs the page brief and critique. Judge the homepage as an experience, publications and blog as reading surfaces, and search/filter interactions as tasks. Check hierarchy and polish against rendered pages. [Core guidance](https://github.com/pbakaus/impeccable/blob/main/skill/SKILL.src.md)
- **Taste** informs screenshot selection, composition, spacing and review at multiple viewport widths. Use authentic product imagery and distinctive, restrained moments. Scientific figures retain explanatory captions and long pages grow with their content. [Core guidance](https://github.com/leonxlnx/taste-skill/blob/main/skills/taste-skill/SKILL.md)
- **UI UX Pro Max** informs the Astro implementation checks for navigation, contrast, touch controls, reduced motion, focus, and image performance. Review the page's actual controls and states. [Core guidance](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/SKILL.md)
- **Anthropic frontend design** informs typography, restrained motion, concise copy and a recognizable visual point of view. Give each page a subject-specific focal point, such as Param's avatar on Home, a working screen on a project page, or a real figure on a paper page. [Frontend design guidance](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)

## Page review and handoff

For each page, select source content and assets, implement the page, then check the rendered result at desktop, tablet and narrow mobile. Inspect hierarchy, screenshot labels, keyboard focus and order, touch controls, contrast and reduced motion. Verify back navigation, direct URLs, links and any data-specific empty or error states. Run the Astro type check and production build for source changes. Compare representative mobile page performance and layout shifts to the existing site. Advance to the next page after the current one is reviewable and its open asset or factual dependencies are explicit.

The first implementation unit is Phase 0 and the homepage. Its key inputs are the avatar artwork, screenshots showing actual project workflows, and a conference photo with a verified caption. Pick the lead images and final colors after reviewing them at their intended display sizes.
