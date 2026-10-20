// =====================================================================
//  AFRICAN HOUSEHOLD DRAMA: Volume One
//  "In a Ghanaian household, even the smallest decision can become
//   everybody's business."
//
//  Entry file. Open this file in Inky to read/play the whole story.
//  Tag reference: docs/AUTHORING.md
// =====================================================================

INCLUDE ep1_kissing.ink
INCLUDE ep2_biscuit.ink
INCLUDE ep3_errand.ink
INCLUDE ep4_agric.ink
INCLUDE report.ink

// ---- Household scores (0–100). Change them with ~ score(approval, smarts, trouble)
VAR approval = 50
VAR smarts = 20
VAR trouble = 0

// ---- The friend from next door: the game renames them after the child the
// player did not pick (boy player -> Adjoa, girl player -> Kojo).
VAR friend = "Adjoa"
VAR fhe = "she"
VAR fhim = "her"
VAR fhis = "her"

// ---- Episode 1: The Kissing Scene
VAR woke = "none"           // pretend | rush | sleepy
VAR antenna = "none"        // held | foil | slap
VAR tv_reaction = "none"    // comment | laugh | eyes | water | froze
VAR mummy_knows = false     // Mummy saw through your convenient thirst

// ---- Episode 2: The Neighbour's Biscuit
VAR greeted = "none"        // proper | twi | forgot
VAR looked_portrait = false
VAR heard_london = false    // you asked Auntie about her son in London
VAR told_clock = false     // you told Auntie her clock has stopped
VAR touched_phone = false  // you tugged the padlock on Auntie's phone
VAR biscuit = "none"        // grab | one | many | stare | refuse
VAR said_medaase = false
VAR pocketed = false        // a biscuit went into your pocket
VAR rearranged = false
VAR auntie_tv_fixed = false

// ---- Episode 3: The Errand
VAR trusted = false
VAR has_list = false
VAR bought_milk = false
VAR bought_bread = false
VAR bought_sugar = false
VAR bought_matches = false
VAR bought_toffee = false
VAR bought_candles = false
VAR total = 0
VAR change = "none"         // returned | spent | home
VAR counted_aloud = false
VAR kojo_friend = false
VAR kojo_betrayed = false
VAR pocket_outcome = "none" // confessed | rat | kojo
VAR gossip = "none"         // told | fine | london | spy
VAR has_remote = false
VAR finale = "none"         // news | eyes | laugh | antenna | mummy | froze

// ---- Episode 4: The Science Homework
VAR homework_told = "none"  // mummy | daddy | nobody
VAR hole_by = "none"        // daddy | me | tin  (who dug in the back corner; none if nobody knew)
VAR seedling = "none"       // pepper | auntie | stick | asked | none
VAR auntie_caught = false   // Auntie Efua caught you at the wall with her orange tree
VAR credit = "none"         // me | daddy | blisters | auntie  (what you told Madam)

-> ep1

// ---------------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------------

// Change the three household scores at once, clamped to 0–100.
=== function score(a, s, t)
~ approval = clamp(approval + a)
~ smarts = clamp(smarts + s)
~ trouble = clamp(trouble + t)

=== function clamp(x)
~ return MIN(MAX(x, 0), 100)

// Prints whole cedis with a thousands comma: 3200 -> 3,200
=== function cedis(n)
~ temp th = n / 1000
~ temp rem = n % 1000
{th > 0:{th},}{rem == 0 && th > 0:000}{rem > 0 && rem < 100 && th > 0:0}{rem > 0:{rem}}{n == 0:0}

// Final household rank. Checked in order: first match wins.
=== function rank()
{
- approval >= 85 && smarts >= 60 && trouble <= 15:
    ~ return "golden"
- trouble >= 55:
    ~ return "akola"
- smarts >= 70:
    ~ return "strategist"
- else:
    ~ return "comedian"
}
