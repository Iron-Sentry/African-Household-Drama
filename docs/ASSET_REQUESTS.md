# Asset requests: brief for an image-generation agent

**Status (17 October 2026):** delivered to `art_incoming/` and integrated. Source PNGs stay in `art_incoming/`; the game uses WebP copies in `public/assets/`. Reuse this brief for the next batch.

Copy everything below the line into Codex or ChatGPT. It asks for art only. Wiring the art into the game happens separately.

---

You are producing **original illustrated game art** for *African Household Drama*, a choice-driven family comedy set in Accra, Ghana in 1998. The repository is the game. **Do not edit any code, story or existing asset.** Only add new image files under `art_incoming/` and write `art_incoming/MANIFEST.md`.

## Match the existing style exactly

Before drawing, study these files in the repo:

- Characters: `public/assets/characters/mother_idle.webp`, `father_idle.webp`, `auntie_efua_idle.webp`, `child_boy_idle.webp`, `child_girl_idle.webp` (and their other poses).
- Rooms: `public/assets/rooms/family_hall.webp`, `public/assets/rooms/neighbours_lounge.webp`.
- Stickers: `public/assets/fx/*.webp`. Props: `public/assets/props/*.webp`.

Style: warm editorial-comic painting with clean dark-brown ink outlines, soft cel shading, a terracotta, indigo, cream and amber palette, and the golden late-afternoon light of the rooms. Characters are Ghanaian, warm and expressive, with the same proportions and rendering as the existing cast. Everything must be original. Copy no TV shows, brands, logos, real people or existing games.

## Hard technical rules (these broke last time)

1. **One PNG per pose.** Do not deliver grid atlases. If your tool only makes sheets, leave at least 80 px of empty transparent gutter between figures, so no head, hand or foot ever crosses into another figure's space.
2. Character sprites: **512×640 px PNG with real transparency** (RGBA, no painted or checkerboard background). Full body. **Feet touch the bottom edge.** The **whole head and hair sit inside the canvas with at least 24 px clear above them.** Raised hands also stay inside.
3. Within one character, every pose uses the **same scale**: the standing head height varies by no more than ±2%.
4. No stray fragments, halos, text or watermarks. Edges are clean against both light and dark backgrounds.
5. Backgrounds: **1672×941 px opaque PNG**, eye-level camera like the existing rooms. Keep the **centre floor area clear**, because two to four standing characters will stand there and cover the bottom 60% of the middle. Nothing important goes in the bottom 15% or the top 8%.

## What to make

### A. Backgrounds (`art_incoming/rooms/`)
1. `compound_courtyard.png`: a shared 1990s Accra compound house courtyard in the afternoon. Painted walls (cream with a blue band), a green metal gate, a mango tree, a line of washing, a water drum, a bench. Neighbours' doors on the sides.
2. `bofrot_street.png`: the lane just outside the compound gate. A roadside wooden table with a basket of bofrot (puff-puff), an umbrella, a hand-painted kiosk sign reading **"GOD'S TIME IS THE BEST"** (the only text allowed), electric poles, and a gutter with a small plank bridge.
3. `nana_bedroom_night.png`: a child's bedroom at night, lit by a moon through louvre windows. A single bed with a mosquito net, a wooden door left slightly ajar with warm hall light spilling through the gap. Dark but readable.

### B. Characters (`art_incoming/characters/`), same rules as the existing cast
4. **Boy (Nana)**, two missing poses that match `child_boy_*` exactly: `child_boy_happy.png` (relaxed open smile, hands at his sides) and `child_boy_proud.png` (chest out, hands on hips, beaming).
5. **The friend's mother**, a neighbour in her 40s, distinct from Mummy and Auntie Efua (green-and-yellow print dress, simple head tie, broom often in hand): `friend_mother_idle.png`, `friend_mother_laugh.png`, `friend_mother_point.png`, `friend_mother_hands_on_hips.png`, `friend_mother_shocked.png`, `friend_mother_wave.png`.
6. **The bofrot seller**, an older woman with a wide basket and an apron: `bofrot_seller_idle.png`, `bofrot_seller_call.png` (hand cupped to her mouth, calling out), `bofrot_seller_offer.png` (holding out bofrot wrapped in newspaper), `bofrot_seller_laugh.png`.

### C. TV pictures (`art_incoming/tv/`)
**640×480 px opaque PNG.** These play on a 1998 CRT in the living room, so use bold, simple shapes that read when small and slightly faded film colour. Original characters only.
7. `film_two_shot.png`: a melodrama scene, a man and a woman (Maria and Ricardo, original designs) facing each other at sunset on a veranda with a palm tree, emotional but apart.
8. `film_kiss.png`: the same framing, the two leaning in for a kiss, shot tastefully in near-silhouette against the sunset. Family-friendly.
9. `news_desk.png`: a 1990s Ghanaian state-TV newsreader at a desk in a suit, a plain blue studio, an original channel bug reading **"GTV"** in the top-left corner, and an empty red lower-third bar with no text.

### D. Props and stickers (`art_incoming/props/`, `art_incoming/fx/`)
10. `props/rotary_phone_padlock.png`: a cream rotary telephone with a tiny brass padlock through the first dial hole, transparent, about 360 px tall.
11. Stickers in exactly the style of `public/assets/fx/*.webp` (a spiky burst, thick dark outline, bold cream lettering), 650×650 transparent: `fx/chale.png` ("CHALE!"), `fx/shh.png` ("SHH!"), `fx/oops.png` ("OOPS!").

## Deliver

- Exact filenames and folders as above.
- `art_incoming/MANIFEST.md` listing every file, its size, and any rule you could not meet.
- Before finishing, check each sprite on a magenta background: the head is fully inside, the feet are on the bottom edge, there are no fragments, and the scale matches the character's other poses.
