# Asset requests: brief for an image-generation agent

**Status (30 October 2026):**

- **Batch 3, Episodes Five to Thirteen: delivered and integrated, 6 November 2026.** All 37 recommended and 39 nice-to-have files, plus girl-player versions of the three stain close-ups (`church_clothes_*_girl.png`), which the review of the delivered art found were needed. Generated through `codex exec` with the repo's art as references; sources are in `art_incoming/`, the record in `art_incoming/MANIFEST.md`. Its brief is kept below for the record.
- Batch 2, Episode Four "The Science Homework": delivered to `art_incoming/` on 20 October 2026 and integrated (all 37 required and 6 nice-to-have files). Auntie Efua's seedling was painted out of both `compound_corner_*` paintings (sources kept as `*_patched.png`) so the game's `auntie_seedling` piece can be uprooted; `auntie_efua_over_wall` is drawn as a garden piece, not an actor pose. The episode was later renamed "The Science Homework"; the exercise book was re-lettered "SCIENCE H/W" (source: `agric_exercise_book_science.png`). Its brief is kept further down for the record.
- Batch 1 (Episodes 1–3 top-up) was delivered to `art_incoming/` on 17 October 2026 and integrated. Its list is kept at the end of this file for the record.

Source PNGs stay in `art_incoming/`. The game uses WebP copies in `public/assets/`. Wiring the art into the game happens separately, after delivery.

The brief below is the one used for Batch 3. Copy everything between the two lines into Codex or ChatGPT to reuse it. It asks for art only.

---

You are producing **original illustrated game art** for *African Household Drama*, a choice-driven family comedy set in Accra, Ghana in 1998. The repository is the game. **Do not edit any code, story or existing asset.** Only add new image files under `art_incoming/` and write `art_incoming/MANIFEST.md`.

## The episodes you are drawing for

Episodes Five to Thirteen already exist in `story/` and play with the current art. Read them for context; the scenes below are where a picture will replace a sentence.

- **Five, When Mummy Calls Your Full Name:** ampe in the compound, then a race to bring the washing in before the rain.
- **Six, The Meat in the Soup:** light soup and fufu. One fat chicken thigh is left in the pot while Daddy prays.
- **Seven, Who Touched the Remote?:** Black Stars football against Mummy's Sunday film.
- **Eight, The Water You Forgot to Fetch:** the tap only runs at 2 AM; the water drum is empty at dawn.
- **Nine, Five More Minutes:** chaskele (a milk tin and a stick) in the lane until the streetlight comes on.
- **Ten, Sunday Best:** one drop of red palm-oil stew on Nana's starched white church clothes.
- **Eleven, The Family Gossip Trap:** Auntie Efua asks who cooks better, her or Mummy.
- **Twelve, Who Finished the Malt?:** Daddy's crate of twelve malts for the Christmas visitors has ten in it.
- **Thirteen, Christmas Visitors Are Coming:** Christmas Eve in the family hall, then the family photo.

## Match the existing style exactly

Before drawing, study these files in the repo:

- Characters: `public/assets/characters/*.webp`, especially `mother_*`, `father_*`, `child_boy_*`, `child_girl_*`.
- Rooms: `public/assets/rooms/family_hall.webp`, `compound_courtyard.webp`.
- Props: `public/assets/props/*.webp`. Stickers: `public/assets/fx/*.webp`.

**Style:**

- A warm editorial-comic painting with clean dark-brown ink outlines and soft cel shading.
- A terracotta, indigo, cream and amber palette.
- New poses of existing characters must be recognisably the same person, with the same face, proportions and rendering.

Everything must be original. Copy no TV shows, brands, logos, real people or existing games. **No brand names or readable labels anywhere:** malt bottles, tins and crates are plain or carry a blank, faded label.

## Hard technical rules

1. **One PNG per file.** No grid atlases.
2. **Character sprites:**
   - **512×640 px PNG with real transparency** (RGBA, no painted or checkerboard background).
   - Full body, with the **feet touching the bottom edge** and **at least 24 px clear above the head and hair.**
   - Hands and anything held stay fully inside the canvas.
   - Same scale as that character's existing `*_idle.webp`: standing head height within ±2%.
3. No stray fragments, halos, text or watermarks. Edges are clean against light and dark backgrounds.
4. **Backgrounds:** **1672×941 px opaque PNG**, except `family_hall_christmas.png`, which is **1600×901 px** because that is the size of its only source, `public/assets/rooms/family_hall.webp`. A variant of an existing room must line up with it exactly: the same camera, and every piece of furniture, the TV and the doorways in the same place, so the game's characters and camera shots still fit.
5. **Props:** transparent PNG, tightly cropped with about 16 px of clear margin, about 360 px tall unless the item says otherwise. They are shown as close-up panels.
6. **Stickers:** 650×650 transparent PNG, in exactly the style of `public/assets/fx/*.webp`: a spiky burst, a thick dark outline, and bold cream lettering.
7. **TV stills:** **640×480 px opaque PNG**, like `public/assets/tv/*.webp`: a picture as a 1990s CRT would show it, with no scoreboard, channel logo or text.

## What to make

Priority: **R** = recommended for this round, **N** = nice to have. Draw every R item first.

### A. Backgrounds (`art_incoming/rooms/`)

1. **R** `family_hall_christmas.png`: `family_hall.webp` on Christmas Eve, lined up exactly with the original. (Episode Thirteen.)
   - Add: paper chains and tinsel across the ceiling and window, a small artificial Christmas tree with tinsel and a few baubles in the corner by the window, Christmas cards standing on the showcase and the TV cabinet, a few balloons, and the good plates stacked on the dining table through the arch.
   - Keep the sofa, coffee table, TV, fan, doorways, the framed photographs on the wall and the floor exactly where they are. Keep the centre floor clear.
   - Late-afternoon light, as in the original.
2. **R** `nana_bedroom_day.png`: `nana_bedroom_night.webp` by day, lined up exactly with the original. Daylight through the louvres, no moon, no stars, walls and floor in morning colours. The game uses it at 6 AM and 4 PM; the moonlit painting stays for night. (Episodes Ten and Thirteen.)
3. **R** `bofrot_street_night.png`: `bofrot_street.webp` at nightfall, lined up exactly with the original. Deep indigo sky, **the streetlight on its pole is lit** with a warm pool of light on the road below it, the stall in shadow. (Episode Nine turns on this light.)
4. **N** `compound_courtyard_night.png`: `compound_courtyard.webp` by moonlight, lined up exactly with the original, including the washing line, the blue drum and the tap. (Episodes Eight and Ten.)

### B. TV stills (`art_incoming/tv/`)

5. **R** `football_match.png`: a wide broadcast view of a football match on a green pitch in 1990s colour, two teams in plain shirts with no crests or numbers, a blurred crowd. No real players. (Episode Seven.)
6. **N** `cartoon.png`: a frame from an original hand-drawn 1990s children's cartoon: a cheeky spider in a little hat, in the spirit of the Ananse folk tales. Original design, no existing characters. (Episode Seven.)

### C. Props (`art_incoming/props/`)

The malt bottles in items 9 and 11 must match `public/assets/props/malt_bottle.webp`: short brown glass with its red-and-gold label and no lettering, because Episode Thirteen still shows that bottle.

7. **R** `soup_pot_thigh.png`: a dented aluminium cooking pot of orange-red light soup, steaming, with one fat chicken thigh floating alone in it. Seen from slightly above. (Episode Six.)
8. **R** `church_clothes_stain.png`: Nana's white, starched Sunday clothes on a wooden hanger, with one red-orange palm-oil stain on the chest, roughly the shape of Africa. (Episode Ten.)
9. **R** `malt_crate.png`: a 1990s plastic drinks crate of twelve bottles matching `malt_bottle.webp`, metal caps on. **Two slots are empty.** (Episode Twelve.)
10. **R** `ice_block.png`: a block of ice wrapped in a damp jute sack, dripping, the sack folded back to show the ice. (Episode Thirteen.)
11. **R** `empty_bottles_straws.png`: two empty bottles matching `malt_bottle.webp`, caps off, side by side. One has two drinking straws in it; the other has none. This is the reveal of Episode Twelve.
12. **R** `table_soup_spread.png`: a family meal laid out to stand on the coffee table in the hall, about 700 px wide, at the same eye-level angle as `family_hall.webp`: the dented soup pot steaming in the middle, three enamel bowls, a covered dish of fufu. It stands on the table as a cut-out, so nothing below the food. (Episode Six.)
13. **R** The Christmas photo, the last image of the volume (8 files). A printed family photograph in a simple wooden frame, about 900 px tall, in the same painted style as `framed_family_photo.webp`, taken indoors with a flash in `family_hall_christmas`. Everybody in their best clothes, squeezed together, with Auntie Efua in the middle: Mummy, Daddy, Auntie Efua, Kojo's mother, and the two children.
    - `christmas_photo_smile_{boy,girl}.png`: everybody smiling properly.
    - `christmas_photo_bunny_{boy,girl}.png`: as above, with Nana holding up two fingers behind Daddy's head. Daddy has not noticed. Auntie Efua has.
    - `christmas_photo_eyes_{boy,girl}.png`: as above, with Nana's eyes tightly shut.
    - `christmas_photo_mummy_{boy,girl}.png`: everybody looks at the camera except Nana and Mummy, who look at each other while Mummy fixes Nana's collar.
    - In the `_boy` files Nana is the boy (`child_boy_idle`) and the other child is the girl (`child_girl_idle`). In the `_girl` files the two swap roles.
14. **N** `fufu_bowl.png`: an enamel bowl with a smooth ball of fufu sitting in light soup, with a chicken neck and a wing. (Episode Six.)
15. **N** `soup_pot_empty.png`: the same pot as item 7, with only a little orange soup left and no meat. (Episode Six.)
16. **N** `red_tie.png`: Daddy's long red necktie, slightly crumpled, about 420 px tall. (Episode Ten.)
17. **N** `church_clothes_pink.png`: the clothes from item 8 after hot water and soap: a huge wet pink blotch the shape of Africa and Europe. (Episode Ten.)
18. **N** `church_clothes_clean.png`: the clothes from item 8, clean, with the faintest stain the shape of Togo. (Episode Ten.)
19. **N** `salt_water_basin.png`: an enamel basin of cold water with a small mound of salt on its rim. (Episode Ten.)
20. **N** `chaskele_tin_stick.png`: a dented empty milk tin and a short wooden bat-stick, lying on red earth. (Episode Nine.)
21. **N** `empty_bucket.png`: an empty plastic bucket with a wire handle, a little water at the bottom. (Episode Eight.)
22. **N** `water_drum_full.png`: looking down into the courtyard's blue water drum with its lid off, full to the top, a little moonlight on the water. (Episode Eight.)
23. **N** `water_drum_empty.png`: the same view, dry to the bottom. (Episode Eight.)
24. **N** `washing_in_sand.png`: a heap of washing and a fallen line in the sand: a good kaba, a white shirt and a school uniform. (Episode Five.)
25. **N** `soup_bowl_groundnut.png`: a covered enamel bowl with the lid lifted to show groundnut soup. (Episode Eleven.)
26. **N** `good_plate.png`: one good china plate with a gold rim and small flowers, seen at a slight angle. (Episode Thirteen.)
27. **N** `malt_ice_bucket.png`: a bucket of ice with bottles matching `malt_bottle.webp` standing in it, wet and cold. (Episode Thirteen.)
28. **N** `film_camera.png`: a 1990s compact film camera with a flash and no brand name, on a small tripod, its self-timer light on. (Episode Thirteen.)

### D. New poses for existing characters (`art_incoming/characters/`)

Each must match that character's existing scale, face and clothes exactly.

29. **R** **Mummy:** `mother_laugh.png`: laughing out loud with her head back and one hand on her stomach. Every other adult has a laugh pose; Mummy has five laugh cues and none.
30. **R** **Home clothes, girl only** (the boy already has these): `child_girl_proud.png`, chin up and beaming, and `child_girl_ashamed.png`, head down and shoulders dropped.
31. **R** **Daddy:** `father_pray.png`: standing upright, **eyes closed**, hands clasped in front of his chest, praying very sincerely. The story relies on his eyes being shut. (Episode Six.)
32. **R** **Daddy at 5:40 AM:** bare-chested, a cloth towel wrapped from waist to knee, a second towel on one shoulder, a plastic bucket in one hand (4 files). `father_towel_idle.png`, `father_towel_laugh.png`, `father_towel_shocked.png`, `father_towel_stern.png`. Same face, moustache and build as `father_idle`; modest and comic. (Episode Eight.)
33. **R** **Nana in white church clothes**, for **both** the boy and the girl (6 files). The player picks one child, and the friend uses the other's sprites.
    - Boy: a white starched short-sleeved shirt and dark trousers. Girl: a white dress with a frilled collar. Both: polished black shoes. Hair and face identical to the home sprites.
    - No stain on these. Poses: `*_church_idle.png` (standing neatly), `*_church_proud.png` (chin up, hands at the sides), `*_church_worried.png` (one hand pressed flat over the chest, hiding something).
34. **R** **The same clothes with the stain**, one red-orange palm-oil stain on the chest, the shape of Africa (4 files): `*_church_stain_idle.png` and `*_church_stain_panic.png` (both hands on the head, eyes wide, mouth open).
35. **N** **The same clothes after each attempt to hide it** (6 files), one standing pose each: `*_church_tie_idle.png` (Daddy's long red tie hanging down to the knees), `*_church_hanky_idle.png` (Mummy's handkerchief pinned over the chest), `*_church_pink_idle.png` (a giant wet pink blotch).
36. **N** **Sunday best for the adults** (3 files): `mother_sunday_idle.png` (a fine church kaba), `father_sunday_idle.png` (a white shirt, buttoned, and dark trousers, with no tie), `auntie_efua_sunday_idle.png` (a grand print dress and **a headwrap comically taller than her head**).
37. **N** **More adult poses** (3 files): `mother_eyes_closed.png` (eyes shut, a very short prayer), `father_side_eye.png` (one eye open, watching sideways), `father_carry_crate.png` (carrying a drinks crate in both arms, grave as a pallbearer).
38. **N** **Children at play**, for **both** the boy and the girl, in home clothes (8 files): `*_ampe.png` (mid-jump, clapping, one foot out, as in the ampe game), `*_swing.png` (swinging a short wooden stick like a bat), `*_throw.png` (underarm throw of a milk tin), `*_bucket.png` (carrying a full bucket with both hands, straining).

### E. Stickers (`art_incoming/fx/`)

39. **R** `goal.png`: "GOAL!" (Episode Seven.)
40. **N** `amen.png`: "AMEN!" (Episode Six.)
41. **N** `merry_christmas.png`: "MERRY CHRISTMAS!" (Episode Thirteen.)

### Totals

| Group | Recommended | Nice to have |
| --- | ---: | ---: |
| Backgrounds | 3 | 1 |
| TV stills | 1 | 1 |
| Props | 14 (8 are the Christmas photo) | 15 |
| Poses | 18 | 20 |
| Stickers | 1 | 2 |
| **Total** | **37** | **39** |

## Deliver

- Exact filenames and folders as above.
- Add a **Batch 3** section at the top of `art_incoming/MANIFEST.md`, listing every file, its size, its priority (R or N), and any rule you could not meet. Do not remove the Batch 1 and Batch 2 records already in that file: the folder is ignored by Git, so they cannot be recovered.
- Before finishing:
  - Check each sprite on a magenta background: head and hands fully inside, feet on the bottom edge, no fragments, scale matching the character's `*_idle` pose.
  - Lay each variant background over the painting it comes from (`family_hall_christmas` on `family_hall`, `nana_bedroom_day` on `nana_bedroom_night`, `bofrot_street_night` on `bofrot_street`, `compound_courtyard_night` on `compound_courtyard`) and check that the furniture, TV and doorways line up.

---

### Batch 3: not covered by the brief

- **Sound.** Handled separately: `rooster`, `bell`, `dig`, `splash`, thunder, rain, a tap, a bottle, a goal crowd and a camera were added on 6 November 2026; see `docs/AUDIO_CREDITS.md`.
- **Wiring.** Each delivered file needs a code change before the story can use it: props join `INSERTS` and stickers join `STICKERS` in `src/content/validate.ts`; TV stills join the `tv` prop in `validate.ts` and the set in `src/stage/stage.ts`; outfits become sheets (`child_boy_church`, `child_boy_church_stain`, `father_towel`…) in `src/content/characters.ts`; new poses join their sheet there too, and a new pose must be mapped to the moods that should use it, or the old pose keeps showing (`mother_laugh` to `laugh`, `father_pray` to `eyesclosed`, `child_girl_proud` to `proud`); the Christmas hall becomes a scene in `src/content/scenes.ts` with the hall's coordinates, and "Years later" in Episode Thirteen goes back to the plain hall; the day bedroom becomes the `bedroom` scene's `bg` with the moonlit painting as its `night`, and the street and courtyard get their `night` paintings the same way. Then the `#insert`, `#sticker`, `#outfit` and `#scene` cues go into the episode files.

---

## Batch 2 brief (Episode Four, delivered 20 October 2026, for the record)

---

You are producing **original illustrated game art** for *African Household Drama*, a choice-driven family comedy set in Accra, Ghana in 1998. The repository is the game. **Do not edit any code, story or existing asset.** Only add new image files under `art_incoming/` and write `art_incoming/MANIFEST.md`.

## The episode you are drawing for

**Episode Four: The Science Homework.** It is Sunday evening. Nana (the player child, a boy or a girl, about 10) suddenly remembers what Madam said on Friday: *"Every pupil must bring a seedling, planted in a tin, for the school farm on Monday."* Panic. Daddy takes over the homework, as Ghanaian fathers do, and digs a hole far too big by lantern light while Mummy holds the lamp. There is no seedling in the house. Nana has to choose: pull up Mummy's pepper plant, sneak Auntie Efua's little seedling from beside the wall, stick a dry mango stick in a tin and hope, or tell the truth. On Monday morning, Madam inspects every pupil's tin in the school yard.

The scenes, in order:

1. The family hall (existing art).
2. The compound garden corner at dusk and night (new).
3. The school yard on Monday morning (new).

## Match the existing style exactly

Before drawing, study these files in the repo:

- Characters: `public/assets/characters/mother_*.webp`, `father_*.webp`, `auntie_efua_*.webp`, `child_boy_*.webp`, `child_girl_*.webp`.
- Rooms: `public/assets/rooms/family_hall.webp`, `compound_courtyard.webp`, `nana_bedroom_night.webp`.
- Stickers: `public/assets/fx/*.webp`. Props: `public/assets/props/*.webp`.

**Style:**

- A warm editorial-comic painting with clean dark-brown ink outlines and soft cel shading.
- A terracotta, indigo, cream and amber palette.
- Characters are Ghanaian, warm and expressive, with the same proportions and rendering as the existing cast. New poses of existing characters must be recognisably the same person in the same clothes, unless the brief asks for the school uniform.

Everything must be original. Copy no TV shows, brands, logos, real schools, real people or existing games. Tins and containers have **no brand labels**: use plain metal, a blank faded paper label, or a torn label with no readable text.

## Hard technical rules (these broke last time)

1. **One PNG per pose.** Do not deliver grid atlases. If your tool only makes sheets, leave at least 80 px of empty transparent gutter between figures, so no head, hand, foot or tool ever crosses into another figure's space.
2. **Character sprites:**
   - **512×640 px PNG with real transparency** (RGBA, no painted or checkerboard background).
   - Full body, with the **feet touching the bottom edge.**
   - The **whole head and hair sit inside the canvas with at least 24 px clear above them.**
   - Raised hands and held tools (hoe, cutlass, lantern, tin) also stay fully inside the canvas.
3. Within one character, every pose uses the **same scale**: the standing head height varies by no more than ±2%. New poses must match that character's existing poses, so measure against `*_idle.webp`.
4. No stray fragments, halos, text or watermarks. Edges are clean against both light and dark backgrounds.
5. **Backgrounds:**
   - **1672×941 px opaque PNG**, with an eye-level camera like the existing rooms.
   - Keep the **centre floor area clear**: two to four standing characters will cover the bottom 60% of the middle.
   - Nothing important goes in the bottom 15% or the top 8%.
6. **Props:** transparent PNG, tightly cropped with about 16 px of clear margin, about 360 px tall unless the item says otherwise.
7. **Stickers:** 650×650 transparent PNG, in exactly the style of `public/assets/fx/*.webp`: a spiky burst, a thick dark outline, and bold cream lettering.

## What to make

Priority: **R** = required to ship the episode, **N** = nice to have. Draw every R item first.

### A. Backgrounds (`art_incoming/rooms/`)

1. **R** `compound_corner_dusk.png`: a closer view of one corner of the existing compound courtyard (same cream walls with a blue band, same mango tree at the edge of the frame), at dusk with an orange-to-indigo sky.
   - Contents:
     - A patch of bare red laterite earth.
     - Mummy's row of pepper plants growing in old cut-open tins and a halved jerrycan along the wall.
     - A water drum, and a low section of the boundary wall to Auntie Efua's compound.
   - **Auntie Efua's young seedling** is visible just on the far side of the low wall, beside a small gap in the blocks. Keep it small and clearly separate, because the game may cover it with a prop.
   - Leave the bare earth patch in the left-centre clear: the dug-hole prop goes there.
2. **R** `compound_corner_night.png`: the same framing and composition as item 1, at night.
   - Moonlight, deep indigo shadows, warm light spilling from a doorway. Readable but dark.
   - Used for the sneaking choice.
   - Everything must line up with the dusk version so the game can cross-fade between them.
3. **R** `school_yard_morning.png`: a 1990s Ghanaian public primary school yard in bright early-morning light.
   - Buildings: a long single-storey classroom block with louvre windows, a covered verandah and painted cream-and-brown walls. A blackboard is propped against the verandah wall, with chalk writing that is an unreadable scribble.
   - Grounds:
     - Dusty laterite ground and a flagpole.
     - A neem tree giving shade.
     - A fenced school farm on one side with rows of young seedlings in tins.
   - Classmates in uniform stand in a loose line along the left and right edges, holding their tins. Keep them small and in the background, so the centre stays clear.
   - The only signboard is plain, with no readable text.

### B. New characters (`art_incoming/characters/`), same rules as the existing cast

4. **R** **Madam, the class teacher.** A Ghanaian woman in her late 30s, firm but fair.
   - Clothing and features: a modest printed kaba-and-slit (a fitted blouse and wrap skirt) in indigo and gold, a neat head tie or short relaxed hair, and reading glasses on a cord.
   - Props: she carries a class register and a thin wooden pointer stick, never shown striking anyone.
   - Make sure she is distinct from Mummy, Auntie Efua and Kojo's mother.
   - Poses:
     - `teacher_idle.png`: standing with the register held to her chest.
     - `teacher_inspect.png`: bending forward and peering through her glasses at a tin held low.
     - `teacher_approve.png`: a warm smile and a small nod, pointer lowered.
     - `teacher_stern.png`: arms folded over the register, one eyebrow up.
     - `teacher_shocked.png`: hand to her chest, glasses slipping.
     - `teacher_laugh.png`: trying not to laugh, with a hand over her mouth.
5. **N** **A show-off classmate** (a boy, about 10, in the school uniform from item 7, distinct from Nana and the friend). He brings a ridiculously large plant.
   - `classmate_idle.png`: holding a big tin with a banana sucker as tall as himself.
   - `classmate_show_off.png`: chin up, presenting it.
   - `classmate_laugh.png`: pointing and laughing.

### C. New poses for existing characters (`art_incoming/characters/`)

Each must match that character's existing scale, face and clothes exactly.

6. **R** **Nana at home, in their usual home clothes**, for **both** the boy and the girl. Every file comes in two versions, `child_boy_*` and `child_girl_*` (6 files). The player picks one child, and the friend uses the other's sprites.
   - `*_panic.png`: both hands on the head, eyes wide, mouth open ("I forgot!").
   - `*_dig.png`: a small hoe raised mid-dig, feet planted, tongue out in concentration. The hoe stays fully inside the canvas.
   - `*_sneak.png`: tiptoeing, body low, glancing back over one shoulder, one hand reaching forward.
7. **R** **Nana at school, in uniform**, for **both** the boy and the girl (8 files).
   - **Uniform:**
     - Boy: brown shorts and a cream short-sleeved shirt.
     - Girl: a brown pinafore over a cream blouse.
     - Both: white socks and black school shoes, with no crest or text.
   - Hair and face are identical to the home sprites.
   - Poses:
     - `*_uniform_idle.png`: standing, holding a tin seedling with both hands at waist height.
     - `*_uniform_proud.png`: holding the tin up toward the viewer, beaming.
     - `*_uniform_nervous.png`: hiding the tin behind their back, small guilty smile.
     - `*_uniform_ashamed.png`: head down, tin hanging from one hand.
8. **R** **Daddy** (same face, glasses and build):
   - `father_dig.png`: shirt sleeves rolled, sweat on the brow, a hoe swung high over one shoulder. The hoe stays fully inside the canvas.
   - `father_lecture.png`: leaning on the hoe handle, the other hand raised with one finger up, explaining agriculture with great authority.
9. **R** **Mummy** (same face and dress):
   - `mother_lantern.png`: standing and holding a lit kerosene hurricane lantern up at shoulder height, unimpressed.
   - `mother_wail.png`: both hands on her head, mouth open in disbelief ("My pepper!").
10. **N** **Auntie Efua:** `auntie_efua_over_wall.png`, leaning forward with both forearms resting on an invisible ledge at chest height, peering, nosy. Cropped at the waist is acceptable for this pose only: the game will hide the bottom of it behind the wall.

### D. Props (`art_incoming/props/`)

11. **R** `seedling_tin.png`: a healthy young mango seedling, four or five leaves, planted in red earth inside a cut-open tin with a blank, faded paper label.
12. **R** `pepper_plant_tin.png`: Mummy's pepper plant with green and red peppers, in a halved jerrycan with earth spilling over the rim.
13. **R** `auntie_seedling.png`: a small young orange-tree seedling standing in a little mound of earth, about 260 px tall. It is drawn separately so it can be "uprooted" in game.
14. **R** `mango_stick_tin.png`: the fake. A bare, dry mango stick pushed into a tin of earth, with one sad leaf tied on with thread.
15. **R** `dug_hole.png`: a far-too-big hole in red laterite earth with a big mound of dug soil beside it and a hoe stuck upright in the mound. About 700 px wide, viewed from the same eye-level angle as the backgrounds.
16. **R** `hurricane_lantern.png`: a lit kerosene hurricane lantern, glass glowing warm, about 300 px tall.
17. **R** `agric_exercise_book.png`: an open 1990s school exercise book on a plain transparent background, about 900×640 px.
    - A ruled page with a pupil's pencil handwriting reading exactly **"AGRIC. H/W: Bring one seedling in a tin on Monday."**
    - A red-ink teacher tick in the margin.
    - This is the only lettering allowed on a prop.
18. **N** `watering_can_tin.png`: an old tin with nail holes punched in the bottom, used as a watering can, with water dripping.

### E. Stickers (`art_incoming/fx/`)

19. **R** `fx/ewurade.png`: "EWURADE!" (Akan for "Oh Lord!").
20. **R** `fx/see_me.png`: "SEE ME!" in the style of a teacher's red-ink note: a red burst with cream lettering.
21. **R** `fx/very_good.png`: "VERY GOOD!", the same red-ink teacher style.
22. **N** `fx/my_pepper.png`: "MY PEPPER!"

### Totals

| Group | Required | Nice to have |
| --- | --- | --- |
| Backgrounds | 3 | 0 |
| New characters | 6 (teacher) | 3 (classmate) |
| New poses for existing characters | 18 (6 home child, 8 uniform child, 2 Daddy, 2 Mummy) | 1 (Auntie Efua) |
| Props | 7 | 1 |
| Stickers | 3 | 1 |
| **Total** | **37** | **6** |

## Deliver

- Exact filenames and folders as above.
- `art_incoming/MANIFEST.md` listing every file, its size, its priority (R or N), and any rule you could not meet.
- Before finishing, check each sprite on a magenta background:
  - The head and any held tool are fully inside the canvas.
  - The feet are on the bottom edge (except `auntie_efua_over_wall`).
  - There are no fragments.
  - The scale matches the character's existing `*_idle` pose.
- Check that `compound_corner_dusk.png` and `compound_corner_night.png` line up when laid over each other.

---

## Not covered by this brief

These are handled in code, so don't request them from the art agent:

- **Sound.** All audio is synthesized in `src/audio/audio.ts`. Episode Four needs new sounds there: hoe digging, splashing water, a lantern hiss, a school bell, and a cockerel at dawn.
- **Lighting.** The family hall at evening and the transition from dusk to night use the existing `#light` tints, together with the paired corner paintings.
- **Episode card.** It's text-only, set by `#card`.

## Batch 1 (delivered 17 October 2026, for reference)

- **Backgrounds:** `compound_courtyard`, `bofrot_street`, `nana_bedroom_night`.
- **Characters:**
  - Boy: `child_boy_happy`, `child_boy_proud`.
  - Kojo's mother: `friend_mother_*` (6 poses).
  - Auntie Akua, the bofrot seller: `bofrot_seller_*` (4 poses).
- **TV stills:** `film_two_shot`, `film_kiss`, `news_desk`.
- **Props:** `rotary_phone_padlock`.
- **Stickers:** `chale`, `shh`, `oops`.

The full Batch 1 brief is in git history (commit `ac605c2` and earlier).
