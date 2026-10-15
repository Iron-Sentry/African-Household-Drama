# Story authoring guide

## Workflow

Open `story/main.ink` in Inky. It includes every episode and `report.ink`, so playing that one file exercises the whole volume. In the web app, `npm run dev` recompiles all included `.ink` files and reloads the page when they change.

Before handing off a story edit, run:

```bash
npm test
```

For a quicker story-only pass, use `npm run story:check`. The compiler and tag validator report source filenames and line numbers. Remember these Ink rules:

- Put choice tags inside the brackets: `* [Take one #flavour:Politely.]`.
- Use `/`, not `|`, inside multi-part tags such as `#card:Kicker/Title/Meta`.
- A tag-only line attaches to the next content line.
- Do not give a stitch the same name as a global variable.
- Speaker dialogue uses a registered prefix such as `Mummy: Sit properly.`. Unregistered prefixes remain narration and fail the speaker audit when they look accidental.

## Cue reference

All accepted values are enforced by `src/content/validate.ts`.

| Cue | Value and effect |
| --- | --- |
| `#scene:id` | Switch location. Current IDs: `hall`, `auntie`, `compound`. |
| `#light:id` | Apply `snow`, `evening`, `film`, `tension`, `blackout`, `lamp`, `afternoon`, `dusk`, or `day`. |
| `#cam:shot` | Move the 3D camera and frame the 2D fallback. `push` is a slow dolly; other names come from the active scene. |
| `#hotspot:id` | Attach a choice to a scene hotspot marker. |
| `#cast:id,id` | Set visible cut-out characters; use `none` to clear them. |
| `#expr:who=expression` | Set a character face. Valid expressions are defined by `EXPRESSIONS` in `characters.ts`. |
| `#emote:who=name` | Show `sweat`, `shock`, `question`, `anger`, `sparkle`, `heart`, or `dots`. |
| `#anim:who=name` | Play `bounce`, `shake`, `jump`, `lean`, or `slump`. Disabled by reduced motion. |
| `#focus:who` | Create a reaction-shot focus; use `none` to restore the ensemble. |
| `#fx:name` | Play `shake`, `impact`, or `flash`. |
| `#sfx:name` | Trigger a registered synthesized sound. Audio remains optional. |
| `#amb:name` | Set `static`, `film`, `night`, `hall`, `auntie`, `clock`, or `compound` ambience. |
| `#prop:name=value` | Change a registered scene prop: `tv`, `foil`, `lamp`, `tray`, `biscuits`, `auntie_tv`, or `keyhole` (`on` frames the stage as the view through the bedroom keyhole). |
| `#timer:seconds` | Time the next choices when timed choices are enabled. |
| `#timeout` | Mark the choice automatically taken when that timer expires. |
| `#auto:milliseconds` | Advance the tagged line after a delay. |
| `#episode:number` | Start an episode, write its replay checkpoint, and update progress metadata. |
| `#card:Kicker/Title/Meta` | Show a full-scene episode card. Exactly three slash-separated parts are required. |
| `#moment:id/Title` | Permanently discover a profile moment and show its toast. |
| `#note:text` | Explain the score change in the feedback area. |
| `#flavour:text` | Add supporting copy below a choice label. |
| `#report` | Begin report-card collection instead of normal dialogue. |
| `#rank:id` | Set report styling to `golden`, `akola`, `strategist`, or `comedian`; dynamic `{r}` is supported. |
| `#rankcopy` | Add the tagged line to the ending summary. |
| `#quote:who=expression` | Use a speaker line as the report-card quotation and portrait. |
| `#remember` | Add the tagged line to “What the family will remember.” |

Tags may share a line: `#scene:hall #light:evening #cast:mum,child,dad #cam:wide`.

## Development preview

Add `?dev` to the Vite URL to open Story tools. The panel shows live stats, tags, continuation state, and choices; it can edit every Ink variable and jump to a compiled knot or stitch.

Direct links are useful for review:

```text
?dev&knot=ep2.tray
?dev&knot=ep3&set=approval:80,smarts:65,trouble:10,antenna:foil
?dev&flat&knot=ep3
```

Query-string overrides accept numbers, `true`, `false`, or strings. The editor in Story tools preserves the current variable types.

## Add a character

1. Add a `Character` entry to `CHARACTERS` in `src/content/characters.ts`. Give it a unique ID, display name, accepted speaker prefixes, kind, and accent.
2. For an on-stage character, add 270×540 body SVG markup and a `FaceRig`. The generated rig supplies all shared expressions. A voice-only character omits `body` and `face`.
3. If the design needs a new expression, add it once to `EXPRESSIONS`; it then becomes valid for every rigged character.
4. Use the ID in `#cast`, `#expr`, `#emote`, `#anim`, `#focus`, and `#quote` cues.
5. Run `npm test`; the tag and unknown-speaker audits catch registry mismatches.

## Add a scene, shot, or hotspot

1. Add the local fallback artwork to `public/assets/`.
2. Add a `Scene` in `src/content/scenes.ts` with its title, location, fallback filename, at least a `wide` shot, and hotspots.
3. A shot needs a 3D camera position, look-at point, optional field of view, and `[scale, originX%, originY%]` fallback framing.
4. A hotspot needs its label, 3D anchor, and `[x%, y%]` fallback anchor.
5. For a new 3D room, add its builder in `src/scene/rooms.ts` and route the new scene ID in `Stage3D.room()`; otherwise the local illustrated fallback still needs to be correct.
6. Reference the IDs with `#scene`, `#cam`, and choice-level `#hotspot` tags, then inspect both normal WebGL and `?flat`.

Shot and hotspot names are globally validated, so keep names unique when their meaning differs.

## Add an episode

1. Create `story/epN_name.ink`, include it from `story/main.ink`, and connect the previous episode to its entry knot.
2. Declare cross-episode variables in `main.ink` and keep score changes inside the shared `score()` helper so values remain clamped.
3. Begin with `#episode:N` and an episode card; establish scene, light, cast, camera, ambience, and prop state explicitly.
4. Add the episode title and an approximate first-play line count to `EPISODE_TITLES` and `EPISODE_LINES` in `src/main.ts`.
5. Extend the report memories and any callback tests that prove earlier decisions still matter.
6. Add scripted coverage for important routes, run `npm test`, and play the episode in WebGL and `?flat` at desktop and phone sizes.
