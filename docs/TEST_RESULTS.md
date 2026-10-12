# Test results

Run date: **12 October 2026**

Environment: **macOS 26.7.1 (25G241), Node.js 22.19.0, npm 10.9.3, Google Chrome for Testing 151.0.7922.34**

This document records commands actually run in this workspace. Timing figures are local production-preview measurements, not a hardware-independent benchmark.

## TypeScript and production build

`npx tsc --noEmit` completed with no diagnostics.

`npm run build` completed successfully with Vite 8.3.4. The final browser pass built 33 modules in 2.04 s. Principal generated files were:

| Asset | Raw | Vite gzip |
| --- | ---: | ---: |
| Three.js stage chunk | 553.50 kB | 140.45 kB |
| Main application chunk | 283.50 kB | 75.20 kB |
| Application CSS | 39.95 kB | 9.77 kB |
| Development-tools chunk | 2.06 kB | 0.95 kB |
| HTML | 11.59 kB | 3.36 kB |

The E2E script measured the complete `dist/` tree, including fonts and assets, at **1,515,347 raw bytes** and **833,832 bytes** when each file was independently gzip-compressed.

## Story validation and unit tests

`npm test` completed successfully.

- Ink compiled: **44 knots/stitches**, **33 moments**, **934 tags**.
- **3,000** seeded random playthroughs completed, averaging **223 lines**.
- Every playthrough ended with a rank and in-range scores.
- Every authored moment was reached across the simulation.
- Rank distribution: **Akola 37.2%**, **Family Comedian 37.0%**, **Little Strategist 21.8%**, **Golden Child 4.0%**.
- Vitest: **4 files passed, 26 tests passed**, duration **6.68 s** in the final run.

The passing unit suite covers compiled graph/tag validity, random routes, scripted access to all four endings, rank boundaries, Episode 1→2 gossip callbacks, the bofrot Episode 2→3 callback, unknown speaker-shaped lines, `parseLine`, `parseTag`, report collection, save round-trip, v1→v2 migration, invalid data, and throwing storage.

## Production browser suite

`npm run test:e2e` completed successfully against a Vite production preview.

The keyboard-only route made **13** numbered decisions and reached **The Family Comedian** report card. No unexpected console errors or missing 404 assets were recorded.

### Responsive layout

| Viewport | Document size | Scene | Story panel | Minimum choice target |
| --- | --- | --- | --- | ---: |
| 1440×900 desktop | 1440×900 | 902.48×700 | 454.17×700 | 54 px |
| 390×844 portrait | 390×844 | 376×320.72 | 376×414.28, internal scroll | 51 px |
| 844×390 landscape | 844×390 | 467.39×311 | 352.61×311, internal scroll | 44 px |

All three had no horizontal or page-height overflow.

### Fallbacks, state, and motion

- Forced `?flat`: passed.
- Browser launched with `--disable-gpu --disable-webgl`: illustrated fallback passed. Three expected WebGL-creation errors were isolated from unexpected console errors.
- Forced WebGL context loss: fallback appeared; context restoration returned the 3D stage.
- Reduced-motion setting: document mode was `reduced`; sampled transition and animation durations were both **0.001 s**.
- Save/reload/continue: a save was written and the same story line was restored.

### Local load and rendering measurements

Measured in the 1440×900 production-preview scenario:

| Metric | Result |
| --- | ---: |
| HTTP response | 3.9 ms |
| DOMContentLoaded | 274.7 ms |
| Window load | 322.3 ms |
| First Contentful Paint | 268 ms |
| Sampled animation rate | 60.37 fps |
| WebGL quality tier | high |

These numbers came from one local cached run and should not be treated as field performance. Lower-powered physical mobile hardware was not measured.

## Screenshot inspection

The final E2E run wrote and the implementation pass visually inspected:

- `test-results/screenshots/desktop-episode1.png`
- `test-results/screenshots/mobile-portrait-episode1.png`
- `test-results/screenshots/mobile-landscape-episode1.png`
- `test-results/screenshots/flat-fallback.png`
- `test-results/screenshots/webgl-disabled-fallback.png`
- `test-results/screenshots/reduced-motion.png`
- `test-results/screenshots/report-card.png`

The latest inspection tightened the portrait scene to a more cinematic room ratio, returned 34 px of height to the story panel, and confirmed that the revised opening dialogue wraps cleanly. The browser suite was rerun after those changes.

## Not run

No manual VoiceOver or NVDA session, 200% browser zoom audit, physical touch-device test, network-throttled test, or representative low-end mobile GPU profile was run in this implementation pass.
