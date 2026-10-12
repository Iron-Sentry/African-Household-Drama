# African Household Drama — Project Review

Review date: 12 October 2026

> **Historical baseline:** the review below describes the original two-episode, no-build prototype, now preserved in `legacy/`. The current TypeScript/Ink vertical slice is summarised in the implementation update at the end of this document.

## Executive summary

African Household Drama is a polished, small, static browser-game prototype built with HTML, CSS, JavaScript, original SVG artwork, and an optional Three.js scene. It presents two short branching episodes set in Accra in 1998. The product is intentionally lightweight: it has no build step, backend, account system, saved game, or framework.

The core experience is coherent and the implementation is sound for a prototype. The story graph is complete, all local files resolve, the JavaScript parses, and the game remains playable when the remote Three.js module or WebGL is unavailable. The strongest engineering decision is the progressive-enhancement split between the accessible HTML controls, 2D SVG fallback scenery, and optional 3D atmosphere.

No release-blocking functional defect was found during static and local-server review. The highest-value improvements are to finish the modal and live-region accessibility behavior, respect reduced-motion preferences in JavaScript, pause/recover the WebGL renderer appropriately, and add lightweight automated tests for the branching story and score/rank rules.

## Product overview

The player moves through two episodes:

1. **The Kissing Scene** — the player reacts to an awkward television moment with their parents.
2. **The Neighbour's Biscuit** — the player interprets household etiquette while visiting Auntie Efua.

Choices modify three scores:

- **Approval**, initially 50
- **Street Smarts**, initially 20
- **Trouble**, initially 0

The run finishes with one of four ranks: **The Golden Child**, **Akola Bone!**, **The Little Strategist**, or **The Family Comedian**. There are 19 authored story nodes plus the generated ending state. The first decision has three branches; the second has three branches, with one of those opening a third three-way decision. Scores carry across the two episodes for the duration of a run.

## Repository inventory

| File | Responsibility | Notes |
| --- | --- | --- |
| `index.html` | Document structure, game UI, intro dialog, controls, and metadata | Semantic landmarks and real buttons are used. |
| `styles.css` | Visual system, layout, responsive rules, animation, and scene layering | Hand-authored but heavily compacted into very long lines. |
| `game.js` | Story data, state, scoring, rendering, keyboard controls, sound, and endings | Framework-free IIFE with a data-driven `STORY` object. |
| `three-scene.js` | Optional Three.js rooms, lighting, procedural TV texture, parallax, and animation loop | Three.js 0.180.0 is dynamically imported from jsDelivr. |
| `assets/*.svg` | Four character sprites, a second Mummy expression, and two fallback rooms | Seven local SVG assets; all are valid XML. |
| `README.md` | Setup, controls, architecture, customization, and deployment guidance | Accurate overall, with one wording issue noted below. |

The complete project is approximately 100 KB on disk before the remote Three.js library and web fonts are downloaded.

## Architecture and runtime flow

```text
index.html
├── styles.css
├── game.js
│   ├── STORY data
│   ├── in-memory state and scoring
│   ├── DOM rendering and input handling
│   └── synthesized opt-in sound
├── three-scene.js
│   ├── remote Three.js import
│   ├── two low-poly room groups
│   └── WebGL animation and pointer parallax
└── assets/
    ├── character SVGs
    └── room SVG fallbacks
```

On load, `game.js` initializes the first story state behind the intro dialog. Starting the game hides the dialog and advances through `STORY`. Each choice applies clamped score changes, records the choice in an in-memory history array, and renders the target node. The ending rank is calculated from final score thresholds.

Separately, `three-scene.js` attempts to import Three.js and initialize WebGL. Failure is deliberately non-fatal: the SVG room remains visible and the HTML game continues to work. The optional `window.AHD3D.setRoom()` bridge keeps the visual room synchronized with the story chapter regardless of which script becomes ready first.

## What is working well

### Product and content

- The concept is distinctive, culturally specific, and consistently expressed through copy, visual design, scoring, and interactions.
- The two episodes form a complete short playthrough with clear consequences and replay value.
- The tone is cohesive across dialogue, microcopy, feedback, sound, and art direction.
- The score thresholds are reachable. In particular, the best sequence can achieve the Golden Child ending.

### Engineering

- The story is data-driven, making copy and branch additions simpler than hard-coding every screen.
- `textContent` and programmatically created buttons are used for user-facing story content. The limited `innerHTML` assignments contain only trusted internal strings, so the current implementation has a low DOM-injection risk.
- Scores are clamped to 0–100, preventing invalid display values.
- Mouse, touch, number-key choices, and Enter-to-continue are supported.
- Sound is off by default and is generated locally through the Web Audio API; audio failures do not block play.
- Three.js is a progressive enhancement, not a hard dependency. The SVG fallback is present before the module loads and survives network or WebGL failure.
- The remote Three.js version is pinned rather than floating.
- Responsive breakpoints cover desktop, tablet, and phone layouts.
- CSS includes visible keyboard focus and a `prefers-reduced-motion` rule for CSS animation and transitions.
- No credentials, cookies, trackers, backend endpoints, or user-data collection were found.

### Deployment

- The README's static-hosting guidance is appropriate.
- No build step is required.
- A local HTTP server successfully returned status 200 for the document, both scripts, the stylesheet, and all seven referenced SVG assets.

## Findings and recommendations

### High priority

#### 1. The intro dialog is visually modal but not fully modal for keyboard or assistive-technology users

The intro uses `role="dialog"` and `aria-modal="true"`, but opening it does not move focus into it, focus is not trapped, the page behind it is not made inert, and closing it does not place focus on the newly relevant game control. Because the dialog appears after the rest of the document in DOM order, the first Tab press can reach background controls.

**Recommendation:** when opening, store the previously focused element, mark the application content `inert`, focus the Start button, and keep Tab/Shift+Tab within the dialog. When closing, remove `inert` and focus the first relevant game action. Restore focus appropriately when the brand reopens the dialog.

Relevant code: `index.html` lines 74–82 and `game.js` lines 266–269.

#### 2. Reduced-motion support does not cover the JavaScript animation

The CSS media query nearly disables CSS animations, but the Three.js `requestAnimationFrame` loop, fan rotation, TV noise, and pointer-driven camera movement continue. This is both an accessibility gap and unnecessary work for users who explicitly request less motion.

**Recommendation:** query `matchMedia('(prefers-reduced-motion: reduce)')`, render a static frame or sharply reduce updates when it matches, and respond to preference changes while the page is open.

Relevant code: `styles.css` reduced-motion media query and `three-scene.js` lines 210–222.

#### 3. Branching and rank logic have no automated safety net

The current graph is small and appears internally consistent, but story expansion can easily introduce missing targets, unreachable nodes, malformed score objects, or unreachable endings. The rank thresholds are also business rules with no tests.

**Recommendation:** separate story data and pure scoring/rank functions into importable modules, then add small tests that validate every `next` target, traverse every branch to an ending, confirm scores remain in range, and exercise each rank boundary.

Relevant code: `game.js` lines 20–147 and 236–246.

### Medium priority

#### 4. The WebGL loop runs continuously and lacks lifecycle recovery

Once initialized, rendering continues every animation frame even while the intro covers the game or the document is hidden. There is no pause on `visibilitychange`, no renderer disposal path, and no `webglcontextlost`/`webglcontextrestored` handling. If WebGL is lost after `.three-ready` hides the fallback, the scene can remain blank.

**Recommendation:** pause rendering while hidden, resume only when visible, handle context loss by showing the SVG fallback, and dispose resources if the scene is ever torn down. Consider rendering only on interaction plus a low-frequency update if continuous animation is not essential.

Relevant code: `three-scene.js` lines 200–224.

#### 5. Remote runtime dependencies reduce offline fidelity and complicate security policy

Three.js comes from jsDelivr at runtime and the two typefaces come from Google Fonts. The game remains functional without either, which is good, but offline users lose 3D and typography changes. The remote requests also matter for privacy, Content Security Policy, and supply-chain review. Dynamic `import()` does not provide the same straightforward integrity attribute used by a normal script tag.

**Recommendation:** for a production release, vendor the pinned Three.js module and self-host WOFF2 font files, or explicitly document and accept the network dependencies. Add a deployment-level Content Security Policy suited to the final hosting arrangement.

Relevant code: `styles.css` line 1 and `three-scene.js` line 12.

#### 6. Several small labels are difficult to read and some color pairs miss normal-text contrast

The visual system uses many 7–10 px uppercase labels. Calculated foreground/background contrast includes approximately 3.05:1 for `#98847a` on `#f5eddf`, 2.95:1 for `#aa826d` on `#f5eddf`, and 2.56:1 for `#b18f75` on `#f5eddf`. These are below the usual 4.5:1 target for normal-sized text, and the very small type compounds the issue.

**Recommendation:** raise utility text to roughly 11–12 px where space permits, darken the muted foreground tokens, and run an automated contrast scan plus a manual 200% zoom check.

Relevant code: the story-panel labels, choice headings, and panel footer in `styles.css`.

#### 7. Live-region scope is too broad and some controls lack state semantics

`aria-live="polite"` is placed on the entire story panel. Replacing dialogue, stats, buttons, and feedback together may create verbose or inconsistent announcements. The visual progress meter is not exposed as a progress bar, and the sound toggle does not expose an `aria-pressed` state.

**Recommendation:** put a focused live region around the dialogue/feedback message only, use `role="progressbar"` with `aria-valuemin`, `aria-valuemax`, and an updated `aria-valuenow`, and synchronize `aria-pressed` on the sound button. Give the statistics a suitable list or grouped structure rather than only an `aria-label` on a generic `div`.

Relevant code: `index.html` lines 25, 48–65, and `game.js` lines 195–231 and 270.

#### 8. Source formatting makes maintenance and review harder

The stylesheet is only 15 physical lines and contains lines several thousand characters long. `game.js` also packs many statements onto individual lines. Browsers handle this, but diffs, merge conflict resolution, line-level diagnostics, and onboarding suffer.

**Recommendation:** keep readable source files and minify only as a deployment step if size warrants it. Add a formatter configuration such as Prettier and a basic lint command.

#### 9. Game state is in-memory only, and README wording can imply otherwise

The README describes “persistent scores,” but scores persist only between chapters in the current run. Refreshing or closing the page discards progress, and replay intentionally resets it.

**Recommendation:** change the phrase to “scores carried across chapters,” or implement an explicit versioned `localStorage` save if cross-session continuity is desired. If storage is added, include a visible reset option and handle schema migration.

Relevant code: `README.md` architecture section and `game.js` lines 150–153 and 266–269.

### Lower priority

#### 10. Application boundaries are intentionally simple but will become limiting as content grows

Story data, state transitions, DOM rendering, audio, and input live in one IIFE, while 3D communication uses a global `window.AHD3D` object. This is reasonable at the current size, but additional chapters, localization, save state, or analytics would make the file increasingly difficult to change safely.

**Recommendation:** before substantial expansion, split story content, pure game rules, UI rendering, audio, and scene integration into ES modules with explicit interfaces.

#### 11. Some state is currently unused

`state.chapter` and `state.stepsSeen` are written but not used for behavior or reporting; history stores prompt and choice text but the ending only reads its length.

**Recommendation:** remove unused fields until needed, or use them for a meaningful recap, progress calculation, or analytics adapter.

Relevant code: `game.js` lines 153, 231, and 254.

#### 12. Production metadata is minimal

The page has a good title, description, viewport, language, and theme color, but no favicon, canonical URL, Open Graph/Twitter preview, web-app manifest, or share image.

**Recommendation:** add only the metadata required by the intended distribution channel. A social preview image and favicon would provide the most immediate benefit for a public launch.

## Accessibility assessment

Current strengths include real button elements, keyboard shortcuts, visible focus styling, useful labels on generated choices, decorative sprite images hidden from assistive technology, polite status messaging, and CSS reduced-motion handling.

The main accessibility work is:

1. Correct dialog focus/inert behavior.
2. JavaScript-aware reduced motion.
3. More legible utility typography and compliant contrast.
4. Narrower live-region announcements.
5. Programmatic progress and toggle states.
6. Manual testing with keyboard-only navigation and at least VoiceOver or NVDA.

## Security and privacy assessment

The attack surface is small because there is no backend, authentication, form submission, user-generated content, or dynamic HTML sourced from a user or API. No secrets or credentials were found. Current story strings are trusted local constants.

The main production considerations are the two remote origins, deployment headers, and future content handling. If future story content comes from a CMS or query string, continue assigning it through `textContent` and validate all navigation targets. A production host should add appropriate CSP, `Referrer-Policy`, and other standard security headers at the platform level.

## Performance assessment

Local payload size is excellent for a visual prototype. SVG fallbacks are small, there is no framework bundle, and the renderer caps device pixel ratio at 1.7. The heavier cost is the remote Three.js module plus continuous WebGL work. The two complete room graphs are built up front even though only one is visible, which is acceptable here but could be revisited if scenes become more complex.

Recommended performance order:

1. Pause animation when hidden or covered.
2. Respect reduced motion.
3. Measure on a lower-powered mobile device.
4. Lazy-create the second room only if future scene complexity materially grows.
5. Self-host and cache immutable dependencies for production.

## Maintainability and scaling path

The current structure is appropriate for a prototype. For a larger game, the safest next architecture would keep the static deployment model while introducing:

- `story-data.js` for validated content only;
- `game-rules.js` for pure score and rank calculations;
- `game-ui.js` for DOM updates and focus management;
- `audio.js` for sound state and effects;
- `scene-3d.js` behind a small scene interface;
- a minimal test suite for graph integrity and rules;
- optional versioned save data, added only when required.

Localization would require moving all visible strings—including headings, control labels, feedback, and scene metadata—out of HTML and rendering logic. Longer translated text should also be tested because the desktop story panel uses a constrained height and hidden overflow.

## Suggested delivery plan

### Before a public prototype release

- Fix dialog focus and background inert behavior.
- Add JavaScript reduced-motion and page-visibility handling.
- Improve small-text contrast and size.
- Add semantic progress/toggle states and refine live regions.
- Clarify the README's persistence wording.
- Add a small automated story-graph and rank test suite.

### Before expanding content

- Split content and pure rules out of the DOM controller.
- Add a documented story schema and validation.
- Decide whether cross-session saving and localization are product requirements.
- Format source consistently and add lightweight linting.

### Before a production launch

- Decide whether to self-host Three.js and fonts.
- Add host-level CSP and other security headers.
- Test keyboard, screen reader, zoom, reduced motion, touch, and low-powered mobile behavior.
- Add desired favicon/social-sharing metadata and a deployment smoke test.

## Vertical-slice implementation update — 12 October 2026

The original prototype has been expanded into a build-backed, three-episode vertical slice while retaining its visual identity and static-hosting model.

### Implemented

- Replaced the in-file story graph with a compiled Ink volume: three connected episodes, 33 discoverable moments, cross-episode callbacks, and four report-card ranks.
- Added a typed runtime split across narrative session, director, UI, character rig, scene registry, persistence, audio, flat stage, and lazy Three.js stage modules.
- Added the complete responsive visual system for desktop, phone portrait, and short phone landscape, including internal panel scrolling, 44 px choice targets, higher-contrast utility text, and reduced motion.
- Expanded the cast with a shared 18-expression face rig, character motion/emotes, and reaction-shot focus.
- Added the compound scene in both 3D and illustrated fallback form, including the kiosk, gate, and mango tree.
- Bundled Three.js and Fraunces/DM Sans/Space Mono locally. The application makes no external runtime requests.
- Added context-loss recovery, an explicit `?flat` mode, adaptive WebGL quality, visibility/dialog pausing, and reduced-motion handling for both CSS and JavaScript animation.
- Added synthesized opt-in audio, settings, versioned save/continue, v1 migration, episode checkpoints/replay, persistent discoveries/endings, and defensive storage failure behavior.
- Reworked dialogs around native `<dialog>`, focused live regions, semantic progress/toggle state, visible control focus, and keyboard shortcuts.
- Added a development story panel, Ink hot reload, tag validation, direct knot/variable preview, unit tests, 3,000-route story simulation, and a production Playwright suite with screenshots and performance measurements.
- Preserved the original prototype under `legacy/` and repaired its asset paths.
- Added authoring, publisher, cultural-review, and evidence-only test documentation.

### Verified in this implementation pass

- TypeScript and production build passed.
- Story validation reached every moment and all four ranks across 3,000 random routes.
- All 26 Vitest tests passed.
- A complete keyboard browser route reached its report card.
- Desktop 1440×900, portrait 390×844, and landscape 844×390 layouts had no page overflow in the automated checks.
- Flat mode, disabled WebGL, forced WebGL context loss/recovery, reduced motion, save/reload, console errors, and missing assets were exercised in the production browser suite.
- Seven final screenshots were visually inspected. Full measurements are recorded in `docs/TEST_RESULTS.md`.

### Remaining before a public release

- Complete the Ghanaian cultural and period review in `docs/CULTURAL_REVIEW.md` and revise the story/art from that review.
- Run manual VoiceOver or NVDA, 200% zoom, and representative physical touch-device testing.
- Profile representative lower-powered mobile hardware; the current measured performance is a local desktop result.
- Conduct audience playtests to validate comprehension, humour, pacing, duration, replay motivation, and score/rank balance.
- Decide hosting metadata and policy details such as canonical/social preview assets and deployment security headers.

“The Visitor From Abroad” is a proposed next episode teased by the report card; it is not implemented in this vertical slice.

## Original review validation performed

- Read every project source file and all SVG assets.
- Ran `node --check` successfully on `game.js` and `three-scene.js`.
- Ran XML validation successfully on every file in `assets/`.
- Served the project using the README's `python3 -m http.server` approach.
- Confirmed HTTP 200 responses for `index.html`, `styles.css`, both JavaScript files, and all seven SVG assets.
- Reviewed all authored story nodes and their `next` targets; no missing destination was found.
- Reviewed score changes and rank thresholds; all four ranks are reachable across the available choice combinations.
- Checked repository metadata; this folder is not currently a Git working tree.

## Review limitations

This review included source inspection, graph/rule reasoning, syntax/XML validation, contrast calculations, and a local HTTP asset smoke test. It did not include automated browser interaction, screenshots at multiple viewport sizes, a screen-reader session, a Lighthouse run, or physical-device/WebGL profiling. Those should be the next verification layer after the priority fixes above.
