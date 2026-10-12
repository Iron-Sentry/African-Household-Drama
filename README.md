# African Household Drama

An interactive Ghanaian family sitcom set in Accra in 1998. Volume One is a complete three-episode vertical slice: **The Kissing Scene**, **The Neighbour's Biscuit**, and **The Errand**. Choices change Approval, Street Smarts, and Trouble, carry consequences between episodes, unlock discoverable moments, and lead to one of four household report cards.

## Run it

Requires Node.js 22 and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The production workflow is:

```bash
npm run build
npm run preview
```

The built site is in `dist/` and can be deployed to any static host. Three.js, Ink, fonts, story data, sound generation, and art are bundled or local; the game makes no external runtime requests.

## Validation

```bash
npm test             # 3,000 story simulations, tag checks, and Vitest unit tests
npm run story:check  # standalone story compiler/graph simulation
npm run test:e2e     # production build and Playwright browser suite
npx tsc --noEmit     # TypeScript only
```

`test:e2e` starts a local Vite preview and uses an installed Playwright Chromium executable. It captures evidence under `test-results/`. See [docs/TEST_RESULTS.md](docs/TEST_RESULTS.md) for the latest run made in this workspace.

## Controls

- Mouse or touch: advance dialogue and choose responses.
- `Enter` or `Space`: start and advance.
- `1`–`6`: select a visible choice.
- `Escape`: open the in-game menu while playing.
- Sound is opt-in. No story information depends on audio.

The Settings sheet also offers untimed choices, three text speeds, and system/reduced/full motion modes.

## Architecture

- `story/main.ink` includes the three episode files and the report-card ending. This is the file to open in Inky.
- `vite.config.ts` compiles the Ink sources into a virtual module and rejects invalid story tags during development and builds.
- `src/narrative/session.ts` adapts inkjs output into typed dialogue, choice, and report beats.
- `src/main.ts` directs cues, persistence, episode checkpoints, replay, input, dialogs, and progressive 3D enhancement.
- `src/content/` contains the character/expression rig, scene/shot/hotspot registry, and tag validator.
- `src/ui/` renders dialogue, choices, actors, feedback, accessibility announcements, and episode transitions.
- `src/scene/` contains the always-available illustrated stage and the lazy-loaded Three.js rooms.
- `src/audio/audio.ts` generates optional ambience and effects with Web Audio.
- `src/game/save.ts` owns defensive versioned local saves, profile state, settings, and v1 migration.
- `src/dev/devtools.ts` provides the opt-in story inspector.
- `tests/` validates story behavior and runtime units; `scripts/e2e.mjs` validates the production browser experience.
- `legacy/` preserves the original two-episode prototype for reference.

The HTML game is authoritative. Three.js progressively replaces the local SVG background when WebGL is ready; context loss, disabled WebGL, or `?flat` leaves the complete 2D experience in place.

## Development URLs

- `?flat` — force the illustrated 2D stage.
- `?dev` — show the knot selector, editable variables, current tags, stats, and choices.
- `?dev&knot=ep2.tray` — start the dev preview at a knot or stitch.
- `?dev&knot=ep2.tray&set=antenna:foil,mummy_knows:true` — jump with variable overrides.
- `?test` — expose browser-test hooks such as `window.__stage`; not intended for players.

Flags can be combined, for example `?dev&flat&knot=ep3.shop`.

## Writing and extending

See [docs/AUTHORING.md](docs/AUTHORING.md) for the complete cue vocabulary, Inky workflow, and the steps for adding characters, scenes, shots, hotspots, or episodes. Run `npm test` after every story change; malformed tags fail before they reach the browser.

## Persistence and privacy

The browser stores the current Ink position, stage state, episode checkpoints, settings, discovered moments, and endings in local storage. Storage failures are non-fatal. There is no backend, account, analytics, advertising, or user-data transmission.
