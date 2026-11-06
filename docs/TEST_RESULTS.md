# Test results

Run on 6 November 2026 in this workspace (macOS, Node 22.19 under Rosetta, because `node_modules` holds x64 binaries; installed Google Chrome, headless). Raw output: `test-results/e2e-results.json`. Screenshots: `test-results/screenshots/`.

## `npm test`

- Ink compiles with no warnings. 131 knots/stitches, 90 moments, 3,210 tags, all valid.
- 3,000 random playthroughs: every run ends with a rank and stats within 0–100, and every moment is reached. Ending distribution under random play: akola 47.1%, strategist 35.2%, comedian 11.9%, golden 5.8%.
- Vitest: 42/42 passing. Coverage:
  - scripted paths to all four ranks
  - rank boundaries
  - cross-episode callbacks
  - friend naming for boy and girl players
  - save round-trip and migration
  - tag and line parsing
  - speaker audit
  - every image the story uses exists
  - who faces whom: who a line is said to, and that every listed pose exists

## `npm run test:e2e`

| Check | Result |
| --- | --- |
| Keyboard-only play-through to the report card | Passed: 45 decisions, 198 speech bubbles shown, ends on "The Family Comedian". |
| Layout at 1440×900, 390×844, 360×800, 844×390 | No page scroll. Every visible bubble, caption and choice inside the viewport. Smallest choice target 50 px. |
| Girl player | Kojo speaks in Episode 3; girl and boy sprites both on stage. |
| Facing | In Episode 7, everyone turns to Daddy when he speaks and to Mummy when she does. |
| Reduced motion | Transitions and camera moves become instant. |
| Save → reload → Continue | Resumes on the same line. |
| Console errors / 404s | None / none. |
| Desktop performance | 61 fps. First contentful paint 0.8–1.1 s locally in headless Chrome, about the same as the previous live build measured the same way (0.8 s). About 2.6 MB transferred to the first choice with sound on. `dist/` is 16.1 MB. **Not yet measured on real phones.** |

Not yet verified: real Android and iOS devices, screen readers beyond the live-region wiring, and low-end GPU performance.
