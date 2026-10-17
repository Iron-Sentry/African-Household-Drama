# Art QA

The painted rooms, the 45 pose sprites, the stickers and the props come from the production kit. They are AI-generated concept art, cropped from grid sheets. They are static poses, not rigs. The game hides small flaws with staging: feet sit below the frame, and stickers and bubbles cover edges. These items still need a human art pass before a paid launch.

## Fixed in this repo

| Problem | Fix |
| --- | --- |
| The kit's sprites were cut from the atlases on a fixed 3×3 grid. Wherever a figure crossed a cell line, the head was sliced flat and the cut-off part landed in the neighbouring sprite: Daddy's whole bottom row, Auntie's wave and arms-crossed, the boy's plead and think, and the girl's comment, run, eyes-closed and think. | All 45 poses were re-sliced from `source_atlases/*.png` as connected figures, so whole heads are kept and neighbours' fragments dropped. Each figure was matched back to its kit pose name by silhouette. |
| Poses of the same character had different scales, so swaps "popped". | One scale per character (the tallest pose fills the canvas), feet on a common line 4 px from the bottom. |
| 11 MB of PNGs. | WebP q80, alpha q85: 1.7 MB for all 45 poses. |

## Needs replacement or retouch

| Asset | Problem | Current handling | Replacement spec |
| --- | --- | --- | --- |
| New art from `art_incoming/` | Generated to the brief in `docs/ASSET_REQUESTS.md`. The ±2% head-height rule across each new character's poses was not numerically certified. | In game: boy happy/proud, friend's mother (6 poses), Auntie Akua (4), compound, street and bedroom paintings, TV stills, three stickers, padlocked phone. | Landmark check of head heights before a paid launch. |
| Antenna | The paintings have no rabbit-ear antenna. | SVG antenna over the set. | Optional painted antenna prop. |
| TV stills | The 4:3 pictures sit on squarer painted glass. | Squeezed 12% and cropped slightly at the sides. | Optional 1:1 versions of the three stills. |

## Acceptance checklist for new art

- 512×640 transparent canvas, feet touching the bottom edge, head fully inside the canvas with at least 2% margin.
- No fragments from neighbouring cells. Check on a magenta background: `ffmpeg -i pose.png -vf "format=rgba,geq=r='if(alpha(X,Y),r(X,Y),255)':g='if(alpha(X,Y),g(X,Y),0)':b='if(alpha(X,Y),b(X,Y),255)':a=255" check.png`.
- The same character's head height stays within ±2% across poses.
- Check at 390×844 portrait. That is where faces are largest.
