# African Household Drama — publisher overview

## Elevator pitch

**African Household Drama** is a choice-driven family sitcom set in Accra in 1998. The player is Nana, a child navigating the unwritten rules of home: survive an awkward television scene, read a neighbour's biscuit etiquette, and return from a simple errand without turning it into compound-wide news. Small decisions become callbacks, family stories, and a final household report card.

Tagline: *In a Ghanaian household, even the smallest decision can become everybody's business.*

## Player fantasy

The player gets to be the quick-thinking child at the centre of a loving, observant, and very talkative household. Success is not simply obedience. It is reading the room: knowing when to be polite, when to improvise, when an adult's silence is an instruction, and when a clever escape creates a bigger story later.

## Audience

The slice is aimed at:

- players who enjoy narrative comedy, consequential choices, and short replayable stories;
- Ghanaian and wider African audiences looking for recognisable domestic specificity;
- diaspora audiences interested in a warmly remembered place and period;
- families and streamers who can compare choices and retell their own versions of the situations.

Age rating, localisation priorities, commercial positioning, and audience size have not yet been established through research.

## What differentiates it

- The stakes are intimate and comic: a remote control, one biscuit, a shopping list, and the devastating reach of family memory.
- Ghanaian household logic is the game system rather than a decorative setting.
- Earlier behavior returns as gossip, trust, temptations, and tailored report-card memories.
- Expressive 2D cut-out characters sit over spatial 3D rooms, while illustrated scenes keep the full experience playable without WebGL.
- Approval, Street Smarts, and Trouble create competing definitions of a “good” choice instead of a single morality meter.
- The experience is readable as a solo story and performative enough for group play.

## Gameplay loop

1. Enter a familiar household situation.
2. Read dialogue, expressions, camera emphasis, and environmental details.
3. Choose a response, action, or hotspot under social pressure; selected moments may be timed.
4. See an immediate reaction and score movement.
5. Carry the decision into later dialogue, opportunities, gossip, and consequences.
6. Finish the volume with a rank, remembered incidents, and a discovery checklist that invites replay.

## What the vertical slice demonstrates now

- Three connected, complete episodes: **The Kissing Scene**, **The Neighbour's Biscuit**, and **The Errand**.
- A full beginning-to-report-card run with four reachable ranks: **The Golden Child**, **Akola Bone!**, **The Little Strategist**, and **The Family Comedian**.
- Thirty-three discoverable moments and cross-episode callbacks.
- Responsive desktop, phone portrait, and phone landscape presentation.
- Three Three.js locations with local illustrated 2D fallbacks.
- Local save/continue, version migration, episode checkpoints, replay, settings, opt-in synthesized sound, and untimed-choice support.
- Keyboard play, native modal dialogs, a screen-reader status region, reduced-motion behavior, and 44 px minimum tested choice targets.
- A writer-facing Ink pipeline with live compilation, tag validation, direct knot preview, editable variables, automated route simulation, unit tests, and production browser tests.

The slice does **not** demonstrate a backend, accounts, cloud saves, analytics, voice acting, localisation, console/mobile-native builds, monetisation, or a production content pipeline beyond the repository.

## Platform strategy

### Demonstrated

The current target is a static web release for modern desktop and mobile browsers. It needs no server-side runtime and makes no external runtime requests. The 2D stage is the compatibility baseline; Three.js is progressive enhancement.

### Proposed

Use the web build for audience testing, festival/publisher links, and lightweight distribution first. Consider installable web packaging or native wrappers only after device testing and audience validation establish a reason to support them. Console work would require a separate input, certification, save, performance, and accessibility plan.

## Roadmap

### Next production gates

1. Ghanaian editorial review of language, period details, prices, names, media references, and household behavior.
2. Moderated playtests with Ghana-based and diaspora players; test comprehension, humour, choice pressure, average duration, and replay motivation.
3. Manual VoiceOver/NVDA, 200% zoom, touch-device, and representative lower-powered Android testing.
4. Copy and balance revision based on those reviews, followed by another automated regression pass.

### Proposed content expansion

The report card teases **The Visitor From Abroad**: Kwabena returns from London and the whole compound has opinions. This is proposed next content, not part of the current demo. A production plan should prove a repeatable episode budget and callback limit before committing to a larger season.

### Longer-term possibilities

Additional volumes, localisation, selected voice performance, richer shareable report cards, and platform packaging are opportunities to evaluate. None is implemented or committed.

## Principal risks

- **Cultural accuracy:** the comedy depends on precise language, manners, material culture, and 1998 context. The flagged details need Ghanaian editorial ownership.
- **Branch growth:** persistent callbacks create value but can multiply writing, testing, and localisation cost. Keep a documented variable budget per episode.
- **Hardware variation:** the measured desktop WebGL result is strong, but representative low-end phones have not been profiled. The 2D fallback reduces, but does not eliminate, device risk.
- **Accessibility validation:** automated keyboard, target-size, reduced-motion, overflow, and modal behavior are covered; manual screen-reader and zoom testing remains.
- **Commercial uncertainty:** audience size, willingness to pay, distribution channel, and acquisition strategy have not been tested.
- **Content throughput:** the slice has a robust authoring foundation, but it has not yet demonstrated a multi-writer editorial workflow.

## Pitch-video shot list

1. **Cold open — 5 seconds:** title card, Accra 1998, and the tagline over the warm household palette.
2. **The room — 8 seconds:** wide 3D hall, CRT snow, character cut-outs entering, then a fast cut to the identical illustrated fallback.
3. **The impossible choice — 12 seconds:** Daddy adjusting the antenna, the kissing scene approaching, three choices appearing, and Nana's reaction.
4. **Consequences travel — 12 seconds:** Auntie Efua's biscuit tray, a callback to Episode One, then Kojo repeating compound gossip in Episode Three.
5. **The errand — 15 seconds:** compound wide shot, “GOD'S TIME IS THE BEST” kiosk, item hotspots, the extra-change dilemma, and rapidly moving score feedback.
6. **Expression reel — 8 seconds:** Mummy's side-eye, Daddy's focus, Auntie's laugh, Kojo's delight, and emote/impact beats.
7. **Play anywhere — 8 seconds:** desktop, phone portrait, phone landscape, reduced motion, and the 2D fallback.
8. **Payoff — 10 seconds:** the household report card, remembered choices, discovered moments, and all four rank names.
9. **Forward tease — 5 seconds:** “Next time: The Visitor From Abroad” clearly labelled as proposed content.

Use only captured game footage for demonstrated features. Treat proposed-content frames as concept cards, not playable footage.
