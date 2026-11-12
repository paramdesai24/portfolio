# Portfolio redesign reference

Recorded 12 November 2026. Status is research and design direction. Page implementation has not started in this pass.

## User brief

- Redesign the portfolio page by page using Sebastien Graf's website as the principal reference.
- Make the whole site distinctive, with special attention to the opening and homepage.
- Work with supplied screenshots of Xeroww, World Cup simulations, an auction project, BHOOMI, research figures, and conference photographs. Confirm the auction project's exact name and relationship to other projects when its material arrives.
- Use motion in the portfolio presentation. Live simulations, working market terminals, and embedded project backends are outside the requested direction.
- Preserve factual academic and engineering content. Verify claims and results against existing content or supplied evidence.
- Earlier desk and avatar concepts remain available. The latest screenshots support a spacious typography-and-character hero. Treat the desk as optional pending composition review.

## Reference analysis

Source https://www.sebg.ch/

The user's nine supplied screenshots show desktop hero expressions, an introduction, project showcases, the work archive, and contact. A live browser visit also inspected the homepage at a narrower viewport, project transitions, the trick control, the wardrobe-themed 404, and the Respawwwn detail page.

| Feature | Evidence and behavior | Adaptation for Param |
| --- | --- | --- |
| Hero composition | Supplied desktop screenshots show a huge left-aligned headline, blue ground, thin column rules, and a large monochrome dithered character on the right | Use a short factual headline, Param's own character, direct work/publication/CV access, and similarly deliberate scale |
| Character expressions | Supplied frames show neutral, waving, and ticklish poses with speech bubbles | A small set of supplied or purpose-made transparent poses can support greeting and contextual reactions |
| Returning greeting | Live browser showed a changed greeting after revisiting home | Optional local returning-visitor greeting, with the main content always immediately available |
| Scroll narration | Live scrolling showed different project dialogue and screenshots within colored sections | Map each project section to a short explanation and one or two real screenshots |
| Character placement | Desktop screenshots use a large side character. Narrow browser views place a smaller character around the lower corners | Use responsive scene layouts and ensure the character never obstructs content or controls |
| Project framing | Desktop uses overlapping browser and phone frames. Narrow layouts emphasize one frame. Actual project screenshots change during the tour | Use browser frames for desktop products. Add phone frames only when actual mobile screenshots exist |
| Surface style | Thin vertical rules, pill actions, light speech bubbles, patterned offset shadows, strong color changes | Establish a restrained shared set of these details with Param's own assets and palette |
| Image treatment | Supplied screenshots show dithered and full-color project images at different stages | A short image reveal is feasible. Keep screenshots and scientific figures fully legible at rest |
| Scratch game | Page content exposes a scratch prompt and progressive guesses. A complete scratch gesture was not verified | Optional presentation experiment only if useful. Core project evidence should remain directly accessible |
| Character dragging | Page content explicitly invites grabbing and holding the avatar. Full drag physics were not verified | Optional later enhancement after the basic portfolio is complete |
| Trick | Clicking the live control changed the dialogue to a sneeze setup. Page text lists dance, panic, fly, vanish, hiccup, peekaboo, selfie, dizzy, sneeze, sulk, and punching-bag actions | One small contextual reaction is enough for an initial implementation. Each extra action needs appropriate artwork |
| Dress me up | Live link opened a custom 404 with a character, floating clothing, and an outfit prompt | Consider a simple custom 404 after the main pages |
| Sound | Persistent sound toggle was visible and initially off. Audio output was not evaluated | Optional, lower priority |
| Work archive | Desktop screenshots show large varied image tiles, restrained project/year labels, and a compact character | Let project visuals carry the index while keeping titles and destinations clear |
| Detail page | Live Respawwwn page showed its theme color, large title, year, role, stack, work navigation, external link, large image, and compact character | Carry the project's visual theme into a readable case study with clear personal contribution |
| Contact | Supplied desktop screenshot shows a dark closing section, large email, social links, and waving character | Finish with research/engineering-appropriate contact copy and verified links |

Exact animation timing, complete gesture behavior, audio, and all responsive breakpoints remain unverified. Do not describe this as a complete functional audit.

## Design sources read

The core guidance files below were read through GitHub. These are design references, not installed personal skills or executed toolchains. Reload current relevant references before implementing a page, since upstream contents can change.

| Source | Read entry | Use in this portfolio |
| --- | --- | --- |
| Impeccable | https://github.com/pbakaus/impeccable/blob/main/skill/SKILL.src.md | Intentional hierarchy, surface-specific design, critique, accessibility, responsive review, polish. Homepage and gallery favor visual experience. Papers and articles favor reading |
| Taste | https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/SKILL.md | Actual imagery, disciplined edges, purposeful scale, consistent typography and controls, browser review across widths |
| UI UX Pro Max | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/SKILL.md | Accessibility, touch targets, responsive layouts, image performance, reduced motion, predictable navigation, Svelte-specific guidance when implementing |
| Anthropic frontend design | https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md | Subject-specific art direction, typography, one memorable focal point, concise copy, deliberate motion, visual self-review |

### Resolve source conflicts using the brief

- Taste's current blanket ban on captions does not fit scientific figures. Include captions explaining the experiment and result when needed.
- Its exact one-or-two-screen section heights should not constrain papers, articles, or mobile text. Use natural content height on those surfaces.
- Its generated palette and layout selection should yield to the user's explicit Seb reference and reviewed project assets.
- Its expectation of live software UI should yield to the user's screenshot-based scope.
- Retain real verified portfolio contact information and content. Generic placeholder-contact conventions do not apply to this existing personal site.
- Use the architecture and migration order in [PORTFOLIO_IMPLEMENTATION_PLAN.md](PORTFOLIO_IMPLEMENTATION_PLAN.md). Preserve working navigation and data integrations through the migration.

## Proposed visual direction

A spacious opening with oversized type and Param's own illustrated character, followed by full-width project chapters with generous screenshot space. The character introduces work with brief contextual text. Shared type, column alignment, button treatment, and image framing connect the pages.

The actual palette, font choice, hero wording, avatar treatment, and project order need a concrete page composition before being considered settled. Start by testing a bold sans-serif such as Bricolage Grotesque or Instrument Sans against the supplied reference. Use full-color screenshots and faithful paper figures. Avoid applying dithering to chart labels or hiding evidence behind an animation.

The homepage can use a coordinated opening entrance, a limited set of character pose changes, section-linked text/image changes, and clear hover/press feedback. Small screens should use ordinary vertical flow and smaller character placements. Reduced-motion mode should show complete content in a stable layout.

## Page-by-page sequence

This is a proposed implementation order, not an instruction to redesign every page in a single pass.

| Order | Current route | Page direction | Verification focus |
| --- | --- | --- | --- |
| 1 | `/` | Hero, concise personal introduction, selected visual project/research chapters, route links, contact closing | Strong first screen, direct CV/publication access, screenshot legibility, mobile composition |
| 2 | `/workspace/projects` | Large image-led gallery with featured hierarchy and compact metadata | Every project destination works, new project entries have verified content |
| 3 | `/workspace/projects/[slug]` | One case study first, then reuse its reading structure with each project's own imagery and accent | Role, problem, approach, evidence, limitations, repository links, readable enlarged images |
| 4 | `/workspace/research` | Conference photograph, research questions and themes, selected figures, linked papers | Accurate relationship between claims, figures, and publications |
| 5 | `/workspace/publications` | Scannable bibliography with selected visual highlights and existing filtering/search | Authors, venue, year, publication status, accessible filters and paper links |
| 6 | `/workspace/publications/[slug]` | Paper summary, actual figure, contribution, findings, citation and document access | Faithful plots, readable labels/captions, verified claims |
| 7 | `/workspace/experience` and detail routes | Clear chronology with actual work artifacts and personal contribution | Dates, role scope, evidence, readable long-form entries |
| 8 | `/workspace/resume` | About/CV composition with portrait, education, selected experience and skills | Resolve About/Resume naming and consistent CV destination during this page's work |
| 9 | `/workspace/programming` | Refined statistics and activity visualization within the shared visual identity | Preserve existing fetching, caching, data definitions, and independent error handling |
| 10 | `/workspace/blog` and detail routes | Distinctive article index and quiet, carefully typeset reading pages | Content width, code, headings, links, mobile reading |
| 11 | Shared navigation, footer, 404 | Final consistency and optional character details | Cross-page navigation, keyboard operation, mobile controls, reduced motion |

Shared tokens and the minimum shared components can be created while implementing the first page. Review each page in a browser before moving to the next. The homepage's featured order is provisional until the actual assets are reviewed.

## Asset planning

- Xeroww dashboard and one detail view, with the exact workflow each shows.
- BHOOMI map/dashboard images, preferably related views of the same area for meaningful comparisons.
- World Cup output and auction screenshots with their exact project names and measured/simulated meaning.
- Original conference photograph with event name confirmed from the source content.
- Paper figures at readable resolution, linked to their source paper and accompanied by the necessary interpretation.
- Param avatar artwork. A static portrait supports positioning and a small amount of motion. Waving, pointing, expressive faces, and outfit changes require additional artwork or an appropriately prepared model.

## Completion checks for each implemented page

Read its existing content and behavior. Build the chosen composition. Check desktop, tablet, and narrow mobile, including keyboard focus and reduced motion. Inspect real screenshots for overflow, clipping, illegible media, and obstructed controls. Verify links and data states. Run the repository's appropriate checks. Record what shipped and any unresolved limitation here.

## Repository state at research time

The current package and route list were checked. `src/routes/workspace/resume/+page.svelte` already had uncommitted edits. An earlier review reported invalid UTF-8 there. This research pass has not rerun that build or changed application source.
