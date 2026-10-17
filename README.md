# African Household Drama

An interactive Ghanaian family sitcom set in Accra in 1998. Volume One is a complete three-episode vertical slice: **The Kissing Scene**, **The Neighbour's Biscuit**, and **The Errand**. Choices change Approval, Street Smarts, and Trouble, carry consequences between episodes, unlock discoverable moments, and lead to one of four household report cards.

It plays like the choice-driven story games it is inspired by: the painted room fills the screen, the family stands in it, and every line hangs off whoever is saying it in a speech bubble. Narration appears as a comic caption, the TV talks from the TV, choices rise over the scene, and at key moments the camera pushes into Mummy's face so you can **read the room**.

## Run it

Requires Node.js 22 and npm.

```bash
npm install
npm run dev
```

Production build and local preview:

```bash
npm run build
npm run preview
```

`dist/` deploys to any static host (relative asset URLs; `firebase.json` is included). Ink, fonts, story data, sound generation and art are all local; the game makes no external runtime requests.

## Validation

```bash
npm test             # 3,000 story simulations, tag checks, and Vitest unit tests
npm run story:check  # standalone story compiler/graph simulation
npm run test:e2e     # production build and Playwright browser suite
npx tsc --noEmit     # TypeScript only
```

`test:e2e` uses an installed Playwright Chromium executable and writes evidence to `test-results/`. See [docs/TEST_RESULTS.md](docs/TEST_RESULTS.md).

## Controls

- Tap or click anywhere on the scene, or press `Enter`/`Space`, to advance.
- `1`–`9` pick a visible choice. Choices are ordinary buttons, so Tab works too.
- `Escape` or the ❚❚ button pauses (settings, title screen, restart). The ☰ button opens the story so far.
- **What did I notice?** under a choice reveals the cue you were meant to read. Players with 50+ Street Smarts see it automatically.
- Sound is on by default (the 🔈 button mutes it) and starts on your first tap. Real recordings from Freesound, credited in [docs/AUDIO_CREDITS.md](docs/AUDIO_CREDITS.md). No story information depends on audio.

Settings: sound, timed choices, larger text, three text speeds, and system/reduced/full motion.

## Architecture

- `story/main.ink` includes the three episode files and the report card. Open it in Inky.
- `vite.config.ts` compiles the Ink sources into `virtual:story` and rejects invalid story tags at build time.
- `src/narrative/session.ts` adapts inkjs output into typed line, choice and report beats.
- `src/main.ts` is the director: it applies cues, saves on every line, handles checkpoints, the boy/girl choice, replay, input and dialogs.
- `src/stage/stage.ts` is the scene: one 16:9 world (painted room, cast, TV overlay, light) behind a CSS camera. Shots, reaction push-ins and *read the room* are camera framings; on narrow screens the camera follows whoever is speaking. It reports each speaker's on-screen face position so the UI can hang a bubble off it.
- `src/ui/ui.ts` draws speech bubbles, captions, choices, hints, inserts, HUD, notices, the episode card and the dialogue log.
- `src/content/` holds the character/pose registry, scene registry (all coordinates are % of the painting) and the tag validator.
- `src/audio/audio.ts` plays recorded room tones, effects and music on separate buses; TV and radio sounds go through a small-speaker filter, and stingers duck the music.
- `src/game/save.ts` owns versioned local saves, profile, settings and the player choice.
- `public/assets/` holds five painted locations (family hall, Auntie Efua's lounge, compound, street, Nana's bedroom), 57 pose sprites for seven characters, painted TV stills, reaction stickers and prop inserts. All are WebP, compressed from the production kit and `art_incoming/` PNGs.

## Development URLs

- `?dev` shows the story tools (knot jump, variable editor, live tags).
- `?dev&knot=ep2.tray&set=antenna:foil,mummy_knows:true` jumps with variable overrides.
- `?test` exposes `window.__ahd` for browser tests; `?test&knot=…` also jumps.

## Writing and extending

See [docs/AUTHORING.md](docs/AUTHORING.md) for the cue vocabulary and how to add characters, poses, scenes and episodes. Art issues and replacement specs are tracked in [docs/ART_QA.md](docs/ART_QA.md); language and period details awaiting Ghanaian review are in [docs/CULTURAL_REVIEW.md](docs/CULTURAL_REVIEW.md).

## Persistence and privacy

The browser stores the current Ink position, stage state, episode checkpoints, settings, the player choice, discovered moments and endings in local storage. Storage failures are non-fatal. There is no backend, account, analytics, advertising, or user-data transmission.
