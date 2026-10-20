# Story authoring guide

## Workflow

Open `story/main.ink` in Inky. It includes every episode and `report.ink`, so playing that one file exercises the whole volume. In the web app, `npm run dev` recompiles all included `.ink` files and reloads the page when they change.

Before handing off a story edit, run `npm test` (or `npm run story:check` for a quick pass). Remember these Ink rules:

- Put choice tags inside the brackets: `* [Take one #flavour:Politely.]`.
- Use `/`, not `|`, inside multi-part tags such as `#card:Kicker/Title/Meta`.
- A tag-only line attaches to the next content line (so `#hint:` can sit on its own line before a choice).
- Do not give a stitch the same name as a global variable (`change`, `gossip`, `antenna`, `finale` are variables).
- Speaker dialogue uses a registered prefix such as `Mummy: Sit properly.`. Anything else is narration and appears as a caption. Avoid a `Word:` shape in narration; the speaker audit flags it.
- The friend next door is `{friend}` with pronouns `{fhe}`, `{fhim}`, `{fhis}`. The game sets them from the boy/girl choice (boy player → Adjoa, girl player → Kojo). Write `{friend}: Chale!` for their lines and `{friend}'s Mother:` for their mother.

## How a line is staged

- A **speaker line** becomes a speech bubble hung off that character's face. If the speaker is not in `#cast` (or is off screen) the bubble pins to the top with an "off-stage" tag. `TV:` lines hang off the television.
- A **narration line** becomes a paper caption.
- When **choices** appear, the last line becomes the question on top of the answer stack.

## Cue reference

All accepted values are enforced by `src/content/validate.ts`.

| Cue | Value and effect |
| --- | --- |
| `#scene:id` | Switch location: `hall`, `auntie`, `compound`, `street`, `bedroom`, `garden` (the back corner) or `school`. Resets the camera to `wide`. |
| `#transition:kind` | How a `#scene` change on the same line plays: `fade` (default; dips to black and names the new place), `iris` (cartoon iris shut, for comic exits) or `cut` (instant, for shocks). Episode `#card` lines always fade. |
| `#light:id` | `day`, `afternoon`, `evening`, `dusk`, `moon`, `film`, `tension`, `snow`, `lamp`, `blackout`, `doorway` (a shaft of light from an opened door). |
| `#cam:shot` | Frame a named shot from the scene (see `scenes.ts`). `push` is a slow dolly on the current shot. |
| `#cast:id,id` | Who stands in the room, left to right (`mum`, `dad`, `child`, `friend`, `auntie`, `friendmum`, `bofrot`, `teacher`, `classmate`); `none` clears it. `id@x` pins someone to x% of the painting (`#cast:mum@50,dad@72` stands Daddy beside the TV); the others still spread along the floor. |
| `#expr:who=mood` | Change pose. Use a shared mood (`neutral happy delight laugh proud smile smug flat sideeye angry shock worried sad hurt eyesclosed focused stare strain`) or a pose name that sheet has (`offer_food`, `read_paper`, `offer_biscuits`, `run`, `comment`…). |
| `#focus:who` | Reaction shot: push in on that face and soften everyone else; `none` returns to the shot. |
| `#readroom` | READ THE ROOM: tighter push, vignette, stamp. Ends when the player chooses. |
| `#hint:text` | The "What did I notice?" cue offered with the next choices. |
| `#outfit:who=name` | Change clothes: the character's poses come from the `<sheet>_<name>` sheet (`#outfit:child=uniform` uses `child_boy_uniform` / `child_girl_uniform`). `none` puts their own clothes back. Moods still work; a pose the outfit lacks falls back to its idle. |
| `#sticker:who=name` | Comic burst by a character: `akola_bone`, `ei`, `good_child`, `hmmm`, `trouble`, `chale`, `shh`, `oops`, `ewurade`, `see_me`, `very_good`, `my_pepper`. |
| `#insert:name` | Prop close-up panel for this line: `tv_remote`, `biscuit_tray`, `malt_bottle`, `boombox`, `wall_clock`, `framed_family_photo`, `rotary_phone_padlock`, `agric_exercise_book`, `seedling_tin`, `pepper_plant_tin`, `mango_stick_tin`, `hurricane_lantern`, `watering_can_tin`. |
| `#emote:who=name` | `sweat`, `shock`, `question`, `anger`, `sparkle`, `heart`, `dots`. |
| `#anim:who=name` | `bounce`, `shake`, `jump`, `lean`, `slump`. Off in reduced motion. |
| `#hotspot:id` | On a choice: also mark it in the room (`phone`, `clock`, `showcase`, `portrait`, `auntie_tv`). |
| `#prop:name=value` | `tv` (`snow film kiss news off`), `auntie_tv` (`snow fixed off`), `foil`, `lamp`, `keyhole` (`on`/`off`), and each scene piece (`hole`, `auntie_seedling` in the `garden`; `on`/`off`). While `keyhole` is on, the hole frames the scene's `keyhole` point and speakers outside it talk off-stage. |
| `#fx:name` | `shake`, `impact`, `flash`. |
| `#sfx:name` / `#amb:name` | Recorded effect / room tone (`hall`, `compound`, `street`, `auntie`, `clock`, `night`, `static`, `film`, `school`, `dusk`). `dig` and `splash` borrow nearby recordings and `bell` and `rooster` are silent until their own recordings arrive. The cue → file map is at the top of `src/audio/audio.ts`; files and credits are in `public/assets/audio/` and `docs/AUDIO_CREDITS.md`. |
| `#timer:seconds` / `#timeout` | Time the next choices (when timed choices are on); the `#timeout` choice is taken when time runs out. |
| `#auto:ms` | Advance the tagged line by itself. |
| `#episode:n` | Start an episode and write its replay checkpoint. |
| `#card:Kicker/Title/Meta` | Full-screen episode title card. |
| `#moment:id/Title` | Discover a moment (toast + report card). |
| `#note:text` | Explain a score change in a notice. |
| `#flavour:text` | Supporting line under a choice. |
| `#report`, `#rank:id`, `#rankcopy`, `#quote:who=mood`, `#remember` | Report-card collection (see `report.ink`). |

## Development preview

`?dev` opens Story tools: live stats and tags, a variable editor, and a knot jump. Direct links:

```text
?dev&knot=ep2.tray
?dev&knot=ep3&set=approval:80,smarts:65,trouble:10,antenna:foil
```

A jump starts with an empty stage, so jump to a line that sets `#scene` and `#cast`, or play in from the episode start.

## Add a character or pose

1. Export poses as 512×640 transparent PNGs with the feet at the bottom edge, then encode to `public/assets/characters/<sheet>_<pose>.webp` (`cwebp -q 80 -alpha_q 85 -m 6`).
2. Add the sheet to `SHEETS` in `src/content/characters.ts`: its pose list, and which pose each shared mood uses. Also set `head`: the height from the top of the hair to the chin in % of the 640 px canvas, measured once on the idle pose. Bubbles hang below the chin it gives, and phones keep that face clear of text.
3. Add a `CHARACTERS` entry (id, display name, speaker prefixes, `adult`/`child`, name-tag accent, sheet). Voice-only characters omit `sprite`.
4. Run `npm test`; the tag validator and speaker audit catch mismatches.

## Add a scene, shot or hotspot

1. Add the painting (16:9) to `public/assets/rooms/`.
2. Add a `SCENES` entry in `src/content/scenes.ts`. Every coordinate is a percentage of the painting: `floor` is the x-range the cast spreads across, `tv` is the screen rectangle, shots are `[zoom, x%, y%]`, hotspots are `[x%, y%]`. Optional: `night` is a second painting of the same view that fades in under `#light:moon`, `blackout` or `lamp`; `pieces` are cut-out images (bottom-centre at `at`, `w`% wide) switched with `#prop:<piece>=on`; `keyhole` is the point the peeping view frames.
3. To measure, crop the source with a grid: `ffmpeg -i room.png -vf "crop=500:400:1200:150,drawgrid=w=25:h=25:c=red@0.4" grid.png`.
4. Check desktop, 390×844 portrait and 844×390 landscape; `npm run test:e2e` fails if dialogue or choices leave the viewport.

## Add an episode

1. Create `story/epN_name.ink`, include it from `story/main.ink`, and declare new variables there.
2. Start with `#episode:N #scene:… #cast:…` and a `#card:` line; end by diverting to the next knot.
3. Add the title to `EPISODE_TITLES` in `src/main.ts` and extend the episode list.
4. Add scripted coverage for important routes in `tests/`, run `npm test`, and play it at desktop and phone sizes.

## Art that hasn't arrived yet (placeholders)

The story can use an image before it is painted. `src/content/assets.ts` lists every pending file under its final path (as named in `docs/ASSET_REQUESTS.md`) with a stand-in: an existing image, or `null` for a dashed "art coming" card. Everything that draws art (paintings, poses, inserts, stickers, pieces) goes through `assetUrl()`, so the stand-in shows until the real file exists.

When a delivery lands:

1. Encode each file to WebP at its listed path, like the existing art (`cwebp -q 80 -alpha_q 85 -m 6` for transparent sprites, props and stickers). Keep the PNG sources in `art_incoming/`.
2. Delete its line from `PLACEHOLDERS`. `npm test` fails while a delivered file still has a line, and when the story uses an image that is neither on disk nor listed.
3. For a new character sheet (`teacher`, `classmate`), re-measure `head` in `SHEETS`; the current values are the stand-ins'.
4. For the new paintings, re-place the scene's `pieces` and shots in `scenes.ts` (they are set for the stand-in paintings), then check desktop, 390×844 and 844×390.

