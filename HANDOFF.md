# Handoff: finish the African Household Drama vertical slice

You are continuing a partly built project in `/Users/user/Downloads/african-household-drama-web`. The full original brief is long, so its requirements are summarised under "Brief requirements still to satisfy" below. Before you start, read `PROJECT_OVERVIEW.md` (the review of the original prototype). Do the work yourself: build, test and document. Do not stop at a plan.

## What the game is
A browser game: a playable family sitcom set in Accra, Ghana, in 1998. The tagline is *"In a Ghanaian household, even the smallest decision can become everybody's business."* It has three connected episodes:
1. The Kissing Scene
2. The Neighbour's Biscuit
3. The Errand

It tracks three scores (Approval, Street Smarts, Trouble) and ends on one of four ranks: The Golden Child, Akola Bone!, The Little Strategist, The Family Comedian. Visually it pairs expressive 2D SVG cut-out characters with Three.js rooms behind them, and falls back to illustrated 2D rooms.

## State of the repo (written by the previous agent)
**Verified working:**
- `story/*.ink` (`main.ink`, `ep1_kissing.ink`, `ep2_biscuit.ink`, `ep3_errand.ink`, `report.ink`) holds the complete story.
- `npm run story:check` passes: it compiles the story, validates all 934 tags, and in 3,000 random runs reaches all 33 moments and all four ranks. The distribution is roughly 37% Akola Bone!, 37% Family Comedian, 22% Little Strategist, 4% Golden Child.
- The rank logic is the ink function `rank()` in `main.ink`. Thresholds were raised on purpose from the original prototype: Golden needs approval ≥85, smarts ≥60 and trouble ≤15; Akola needs trouble ≥55; Strategist needs smarts ≥70.
- `scripts/ink.mjs` provides `compileInk`, `extractMeta`, `playthrough`, `rng` and `byText`. `scripts/story-check.mjs` is the CLI.
- `src/content/characters.ts` holds the character registry, the original SVG bodies with faces removed, and a generated expression rig with 18 expressions. It also provides `parseLine` (`"Mummy: text"` becomes speaker + text) and `characterSvg` / `faceSvg`. A contact sheet of every character × expression was rendered and looks right. Sister Akos and Kojo are new characters.
- `src/content/scenes.ts` defines the scenes `hall`, `auntie` and `compound`, each with camera shots (3D position plus a 2D fallback framing) and hotspots. `src/content/validate.ts` holds the tag vocabulary and the validator.

**Written but never compiled, type-checked or run (expect bugs):**
- `vite.config.ts`: an ink plugin that exposes the compiled story as `virtual:story`, exporting `storyJson` and `meta` (knots and moments), with a full page reload when an `.ink` file changes.
- `tsconfig.json` and `src/virtual.d.ts`.
- `src/narrative/session.ts`: the `Session` class wrapping inkjs. `next()` returns a line, choices or end beat. It also has `collectReport`, `jump` and `restore`. Note that `vars()` reads the private `variablesState._globalVariables`; check that this works in inkjs 2.4.0.
- `src/game/save.ts`: the versioned save format (v2) with v1 migration, plus a profile record (moments, endings, episode checkpoints, settings). All storage access is wrapped defensively.
- `src/ui/actors.ts`: the 2D cast, covering expressions, talking, emotes, animations and focus (reaction shots).
- `src/ui/ui.ts`: typewriter dialogue, choices, hotspot chips and markers, the timed-choice bar, stat deltas and feedback, the episode card, FX and announcements.
- `src/scene/flat.ts`: the 2D fallback stage, using CSS framing and a tint layer. `src/scene/stage3d.ts` and `src/scene/rooms.ts` are the Three.js stage: lighting presets, camera tweens, render-on-demand, pause on visibility change and when dialogs are open, adaptive quality tiers, and context-loss handling with `loseContext` / `restoreContext` test hooks.
- `src/audio/audio.ts`: fully synthesised WebAudio, off by default, with ambience beds, sound effects and a Karplus-Strong highlife motif.
- `src/main.ts`: the director. It covers cue dispatch, saving on every line, episode checkpoints, moment toasts, the report card, the title, settings and episodes dialogs (native `<dialog>` with `showModal`), keyboard input, lazy 3D loading, and the URL flags `?dev`, `?test`, `?flat`, `?knot=ep2.tray&set=antenna:foil`.
- `index.html` has been rewritten. Read it for the DOM ids and classes.

**Moves:**
- The original art moved to `public/assets/`.
- The original prototype was copied to `legacy/`. Its asset paths are now broken: fix them to `../public/assets/` or delete `legacy/`.

## Gotchas already discovered
- Ink tags cannot contain `|`. The project uses `/` as the separator, for example `#card:Kicker/Title/Meta` and `#moment:id/Title`.
- Choice tags must go inside the brackets: `* [Text #flavour:...]`.
- Stitch names must not clash with VAR names. This already bit `antenna` and `finale`.
- A tag-only line attaches to the next content line. Dynamic tags such as `#rank:{r}` work.
- Node 22.19 strips TypeScript types natively, so content files are imported with explicit `.ts` extensions and must use only erasable syntax (no enums, no parameter properties). The `tsconfig` sets `allowImportingTsExtensions` and `erasableSyntaxOnly`.
- For Playwright, `playwright-core` 1.64 is installed, but the cached browser is an older build. Pass `executablePath` explicitly:
  - `~/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-x64/chrome-headless-shell` (headless)
  - `~/Library/Caches/ms-playwright/chromium-1234/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing` (headed or WebGL)
- Write throwaway scripts in the session scratchpad and import packages there by absolute path.

## Remaining work, in order
1. **Write `src/styles.css`.** It does not exist yet and `main.ts` imports it. Keep the original visual identity: see `legacy/styles.css` for the palette (`#211b21` background, cream `#f5eddf` panel, gold `#eab565`, orange `#de815d`), Fraunces/DM Sans/Space Mono, the arched room window, and the noise texture. Tokenise colours. It must style every id and class in `index.html` and every class created in the TS files:
   - actors: `.actor`, `.adult`, `.child`, `.entering`, `.leaving`, `.dim`, `.talking` (hide `.mouth`, show `.mouth-talk`; `.mouth-talk` is hidden by default), `.eyes.blinks` (blink keyframes using `--blink-delay` and `transform-box: fill-box`), `.actor-body.anim-bounce|shake|jump|lean|slump`, `.emote.show`, `.actors.focusing` (scale around `--fx`/`--fy`), `.room-window.dof`
   - stage: `.three-ready` (show the canvas, hide `.flat`), `.flat`, `.flat.instant`, `.flat-bg`, `.light-tint`
   - hotspots: `.hotspot`, `.hotspot-ring`, `.hotspot-label` (positioned with `left`/`top` in %; the `.hotspots` layer must sit exactly over `.room-window` and above `.actors`)
   - choices: `.look-list`, `.look-chip`, `.choice-btn` and its parts, `.timer` with `@keyframes timer`
   - stats and feedback: `.stat`, `.stat-bar`, `.stat-delta.show.good|bad`, `.feedback.positive|negative`
   - dialogue: `.dialogue-text.tv-line|narration`, `.speaker-avatar`, `.speaker-avatar.tv`
   - overlays: `.episode-card`, `.episode-card.out`, `.fx-flash`, `.fx-impact`, `.world-panel.fx-shake`, `.toast.show`, `.sr-only`
   - dialogs: `dialog.intro`, `dialog.sheet`, `dialog.report` with `[data-rank]` variants, `.menu`, `.start-btn`, `.ghost-btn`, `.toggle`, `.episode-btn`, `.report-*`, `.score`
   - `html[data-motion=reduced]` must disable animations and transitions.

   **Layout:** desktop puts the scene and panel side by side. Mobile portrait is a 100dvh column (scene about 45dvh, panel fills the rest and scrolls internally, no page scroll, touch targets at least 44px). Phone landscape is a compact side-by-side layout. Text must meet 4.5:1 contrast and nothing should be smaller than 11px. The overview flagged both.
2. **Create the missing files:**
   - `src/dev/devtools.ts`, exporting `mountDevtools({ knots, session, jump })`. It should be a small panel: a knot selector, a variable editor, and live display of stats and tags.
   - `public/assets/compound.svg`: an illustrated 2D fallback of the compound, with sky, a cream wall with a blue band, a green gate on the left, a blue kiosk on the right reading "GOD'S TIME IS THE BEST", and a mango tree. Hotspot fallback positions are in `scenes.ts`.
   - `public/assets/favicon.svg`.
3. **Get it compiling:** run `npx tsc --noEmit` and `npm run build`, and fix all errors. Then run `npm run dev` and play through.
4. **Write automated tests** under `tests/*.test.ts`, using vitest (already configured):
   - story graph and tags, using `compileInk`, `validateTags` and random playthroughs; every run must end with a rank and with stats in 0–100
   - all four ranks reachable with scripted `byText` paths, plus rank boundary values via `story.EvaluateFunction('rank')` after setting variables
   - cross-episode callbacks: different Episode 1 choices produce different Episode 2/3 lines, for example the gossip line in `ep2.welcome` and the bofrot knock-on in `ep3.home`
   - unknown speaker prefixes: lines shaped like `Name:` that aren't registered speakers
   - save round-trip, v1→v2 migration, garbage and unknown-version data rejected, storage that throws
   - `Session.collectReport`
   - `parseLine` and `parseTag`

   Add a `story-validate` step to `npm test` if it's useful.
5. **Write the browser tests** in `scripts/e2e.mjs` (`npm run test:e2e`). Build, run `vite preview`, then drive Playwright through:
   - a full keyboard-only play-through to the report card
   - desktop at 1440×900, mobile portrait at 390×844, and mobile landscape at 844×390, with screenshots
   - `?flat`, and a launch with WebGL disabled (`--disable-gpu --disable-webgl`)
   - context loss via `window.__stage.loseContext()` / `restoreContext()`
   - reduced motion
   - saving, reloading and continuing
   - console errors and missing 404 assets
   - measurements of bundle size, load timing and frame rate

   Look at the screenshots with the Read tool and fix layout and visual problems. Polish Episode 1 first: it sets the quality bar.
6. **Write the docs:**
   - `README.md`: dev, build, test and story:check commands, architecture, URL flags.
   - `docs/AUTHORING.md`: the tag reference (taken from `validate.ts`); how to add a character, scene, hotspot, shot or episode; the Inky workflow (open `story/main.ink`); and dev preview through `?dev&knot=…&set=…`.
   - `PUBLISHER_OVERVIEW.md` covering: elevator pitch, player fantasy, audience, differentiators, gameplay loop, platform strategy, vertical-slice scope, roadmap, risks, and a pitch-video shot list. Clearly separate what the demo shows from what is proposed. The report card teases "The Visitor From Abroad" as proposed next content.
   - `docs/TEST_RESULTS.md`: actual results only, including measured performance.
   - `docs/CULTURAL_REVIEW.md`, flagging these for Ghanaian editorial review:
     - Twi: "maaha" / "Yaa, me ba", "medaase", "agoo/amee", and "akola bone" (as used in the original prototype)
     - 1998 cedi prices (milk ₵800, bread ₵1,200, sugar ₵900, matches ₵100, toffee ₵200, candles ₵300) and the ₵5,000 note
     - the GTV film rerun
     - the 1998 Akosombo low-water power cuts
     - the "Daily Graphic"
     - "palaver", "chale", "dash" and "bofrot"
     - the "God's time is the best" kiosk slogan
     - the padlocked phone dial
     - the name Esi for Mummy
     - kerosene lamps
   - Update `PROJECT_OVERVIEW.md` or add a changelog section listing what was implemented and what remains.

## Brief requirements still to satisfy
- Mobile and desktop must both feel native.
- Accessibility: keyboard play, screen-reader live region, modal focus, reduced motion, contrast.
- Audio must be optional and the story must never depend on it.
- No external runtime requests: Three.js and fonts are bundled.
- Save/load, migration and replay must work.
- Report only results you actually ran. Never claim a test passed without executing it.
- Don't over-engineer and don't add new content scope. Fix and polish what exists.
- Do not commit or init git unless the user asks.
