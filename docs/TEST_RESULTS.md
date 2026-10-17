# Test results

Run on 17 October 2026 in this workspace (macOS, Node 22.19, cached Playwright Chromium headless shell). Raw output: `test-results/e2e-results.json`; screenshots: `test-results/screenshots/`.

## `npm test`

- Ink compiles with no warnings. 46 knots/stitches, 36 moments, 1,002 tags, all valid.
- 3,000 random playthroughs: every run ends with a rank and stats within 0–100, and every moment is reached. Ending distribution under random play: Akola Bone! 42.5%, Little Strategist 30.3%, Family Comedian 24.9%, Golden Child 2.3%.
- Vitest: 29/29 passing. Coverage:
  - scripted paths to all four ranks
  - rank boundaries
  - Episode 1 → 2 gossip callback
  - bofrot, gossip-trap and biscuit-accusation callbacks
  - friend naming for boy and girl players
  - save round-trip and migration
  - tag and line parsing
  - speaker audit

## `npm run test:e2e`

| Check | Result |
| --- | --- |
| Keyboard-only play-through to the report card | Passed: 24 decisions, 96 speech bubbles shown, ends on "Akola Bone!" |
| Layout at 1440×900, 390×844, 360×800, 844×390 | No page scroll. Every visible bubble, caption and choice inside the viewport. Smallest choice 50 px. HUD buttons 44 px. |
| Girl player | Kojo speaks in Episode 3; girl and boy sprites both on stage. |
| Reduced motion | Transitions and camera moves become instant. |
| Save → reload → Continue | Resumes on the same line. |
| Console errors / 404s | None / none. |
| Desktop performance | 60 fps. First contentful paint about 190 ms locally. About 1.28 MB transferred to the first choice. |

Not yet verified: real Android and iOS devices, screen readers beyond the live-region wiring, and low-end GPU performance.
