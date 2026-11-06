// =====================================================================
//  EPISODE ONE: THE KISSING SCENE
//  Sunday night, near bedtime. One television. One antenna.
//  One child behind the bedroom door, watching through the keyhole.
//  This is the free episode: keep it short, visual, and nostalgic.
// =====================================================================

=== ep1 ===
#episode:1 #scene:hall #light:evening #cast:mum@50,dad@72 #cam:keyhole #prop:tv=snow #prop:keyhole=on #amb:static
#card:Episode One/The Kissing Scene/Accra, Ghana · Sunday · 8:25 PM
Bedtime. But your eye is pressed to the keyhole. #expr:dad=strain #anim:dad=lean #expr:mum=flat
Daddy: Ah! This antenna! #anim:dad=shake #sfx:static
Mummy: Maria starts in five minutes, oo.
Daddy: NANA! #fx:impact #expr:dad=strain #sfx:sting #cam:push
Your name. Your chance. But you are supposed to be asleep.
* [Pretend to be asleep #flavour:His voice will pass.]
    -> pretend
* [Run out with excitement #flavour:"Yes, Daddy!"]
    -> rush
* [Answer in a sleepy voice #flavour:"Daddy... you called me?"]
    -> sleepy

= pretend
~ woke = "pretend"
~ score(-8, 0, 4)
You dive into bed and squeeze your eyes shut. #transition:iris #prop:keyhole=off #scene:bedroom #light:moon #cast:none #cam:bed #amb:night #sfx:whoosh
Daddy: Nana! #auto:1200
You snore a little. For realism. #sfx:snore #auto:1600
BAM. The door flies open. #sfx:door #fx:impact #cam:wide #cast:mum #expr:mum=angry #anim:mum=bounce
Mummy: Akola bone! Your father is calling you and you are lying there? #emote:mum=anger #sticker:mum=akola_bone
Mummy: Get up! Go and fix the antenna! #fx:shake
#note:Mummy knows a fake snore.
-> fix_antenna

= rush
~ woke = "rush"
~ score(-6, 0, 3)
Nana: YES, DADDY! #prop:keyhole=off #cast:mum,child,dad #cam:wide #anim:child=jump #expr:child=run #sfx:whoosh
Both parents turn. Slowly. #expr:child=neutral #expr:mum=sideeye #expr:dad=sideeye #sfx:sting
Mummy: Weren't you supposed to be sleeping? #focus:mum
Nana: I... was sleeping fast. #expr:child=worried #emote:child=sweat #focus:child
#note:Too awake for a sleeping child.
Mummy: Fix the antenna. We will talk. #expr:mum=flat #focus:none
-> fix_antenna

= sleepy
~ woke = "sleepy"
~ score(10, 6, 0)
Nana: Daddy...? You called me? #sfx:yawn #prop:keyhole=off #cast:mum,child,dad #cam:wide #expr:child=eyesclosed #anim:child=slump
#note:Award-winning performance.
#moment:sleepy_voice/Best Actor, Sleeping Category
Daddy: Oh, you were sleeping. Sorry, my dear. #expr:dad=smile #focus:dad
Daddy: Kindly help me with the antenna. #focus:none #expr:mum=smile
-> fix_antenna

= fix_antenna
Daddy: Hold it. Turn it left. Small. Small! #scene:hall #light:evening #cast:mum,child,dad #cam:tv #expr:dad=strain #expr:child=neutral #anim:child=lean #sfx:static
Daddy: Now up... and STOP! #emote:dad=sweat #expr:mum=flat
* [Do exactly what Daddy says #flavour:Left. Small. Up. Stop.]
    ~ antenna = "held"
    ~ score(6, 0, 0)
    Left. Small. Up. Stop. #anim:child=lean
    The snow melts into colour. #prop:tv=film #sfx:tvclear #expr:child=delight
    Daddy: You see? When you listen, things work! #expr:dad=delight #emote:dad=sparkle
    #moment:human_antenna/The Human Antenna
* [Wrap Mummy's foil around it #flavour:Kitchen science.]
    ~ antenna = "foil"
    ~ score(-2, 12, 0)
    You dash to the kitchen and back with Mummy's foil. #anim:child=bounce #sfx:whoosh
    Two twists. A silver crown. #prop:foil=on #prop:tv=film #sfx:tvclear
    Daddy: Ei! Engineer! #expr:dad=delight #emote:dad=sparkle
    Mummy: Is that my Christmas foil? #expr:mum=sideeye #emote:mum=anger #sticker:mum=hmmm
    #moment:foil_engineer/The Aluminium Engineer
* [Give the television one slap #flavour:It works for Uncle Fiifi.]
    ~ antenna = "slap"
    ~ score(-4, 0, 3)
    One firm slap. #fx:shake #sfx:thump #anim:child=lean
    The picture vanishes completely. #prop:tv=snow #sfx:static #expr:child=worried #sticker:child=oops
    Daddy: Who taught you to beat my television? It is not a goat! #expr:dad=shock #emote:dad=shock
    Mummy touches the antenna with one finger. Perfect picture. #anim:mum=lean #prop:tv=film #sfx:tvclear #expr:mum=smug
    #moment:tv_discipline/Television Discipline
- -> theme

= theme
The theme song. Just in time. #sfx:theme #amb:film #light:film #prop:tv=film #cast:mum,child,dad #cam:sofa #expr:child=delight #expr:mum=neutral #expr:dad=focused
You squeeze onto the sofa, between Mummy and Daddy. #anim:child=bounce
{woke == "pretend" || woke == "rush":
    Mummy: Watch quietly. Then bed. #expr:mum=flat #focus:mum
}
TV: Maria, please. Forgive me. #cam:tv #focus:none
TV: You lied to me, Ricardo! #auto:1600
Daddy: Hmm. This thing is getting serious. Just forgive him! #cam:sofa #expr:dad=focused #focus:dad
Mummy: Yes, Maria! He is apologising. He is remorseful! #expr:mum=focused #focus:mum
TV: ...I forgive you. #cam:tv #focus:none #sfx:romance #light:tension
Ricardo touches her face. They look. And look. #cam:push #expr:child=worried
Everybody knows what comes next.
Daddy clears his throat. #sfx:throat #cam:sofa #emote:dad=sweat #expr:dad=worried
So does Mummy. #sfx:throat #expr:mum=sideeye #focus:mum
Two side-eyes. One child. Cold sweat. #sfx:heartbeat #prop:tv=kiss #focus:none #readroom #expr:child=shock #emote:child=sweat #timer:12
#hint:Two throats cleared at once. In this house that is not a cold. It is a warning, and both warnings are pointed at you.
* [Comment on the scene #flavour:"Ei! See what they are doing!"]
    -> comment
* [Burst out laughing #flavour:It's coming out.]
    -> laugh
* [Immediately close your eyes #flavour:You saw nothing.]
    -> eyes
* [Announce that you are very thirsty #flavour:A strategic retreat.]
    -> water
* [Freeze #timeout #flavour:Become furniture.]
    -> froze

= comment
~ tv_reaction = "comment"
~ score(-18, 0, 20)
Nana: Ei! See what they are doing! #anim:child=jump #expr:child=comment #sfx:bad
Silence. Even the fan stops. #expr:mum=stare #expr:dad=stare #expr:child=shock #auto:1500
Mummy's hand rises. Slowly. Your whole life flashes before your eyes. #sfx:heartbeat #expr:child=hurt #emote:child=shock
It stops. One finger points at the bedroom door. That finger has sent bigger people than you to bed. #fx:impact #anim:mum=lean #expr:mum=angry
Mummy: Who asked you for commentary? Bed! #emote:mum=anger #focus:mum #sticker:mum=akola_bone
#moment:film_critic/The Film Critic
Through the wall, Maria's story continues without you. #cast:mum,dad #focus:none #light:tension
-> ending

= laugh
~ tv_reaction = "laugh"
~ score(-12, 0, 14)
A laugh escapes. A big one. #expr:child=laugh #anim:child=shake #sfx:bad
Daddy: What is funny? #expr:dad=angry #focus:dad #fx:shake #sticker:dad=trouble
Daddy: Akola bone. Go inside. Now. #expr:dad=flat
#moment:sent_inside/Sent Inside
Through the wall, Maria's story continues without you. #cast:mum,dad #focus:none #light:tension
-> ending

= eyes
~ tv_reaction = "eyes"
~ score(22, 15, 0)
You shut your eyes so tight you see stars. #expr:child=eyesclosed #sfx:good
Mummy: Good child. #expr:mum=proud #emote:mum=sparkle #focus:mum #sticker:mum=good_child
Daddy pats your knee. #expr:dad=proud #focus:none
#moment:professional_blinker/The Professional Eye-Closer
Daddy: You can open now. #auto:1800 #prop:tv=film #light:film #sfx:romance
You watch the rest of the episode. All of it. Between Mummy and Daddy. #expr:child=delight #cam:wide
-> ending

= water
~ tv_reaction = "water"
~ mummy_knows = true
~ score(4, 15, 0)
Nana: Mummy... I'm very thirsty. #expr:child=worried
Mummy: ...Go. #expr:mum=sideeye #focus:mum
You walk to the kitchen like a soldier leaving a battlefield. #cast:mum,dad #sfx:whoosh #focus:none
When the music changes, you come back. #cast:mum,child,dad #prop:tv=film
Mummy: That thirst came at a very convenient time. #expr:mum=sideeye #focus:mum #sticker:mum=hmmm
#moment:convenient_thirst/The Convenient Thirst
She knows. You know she knows. #focus:none
-> ending

= froze
~ tv_reaction = "froze"
~ score(-5, 0, 8)
You don't move. You just... watch. #expr:child=stare #auto:1600
Daddy grabs the remote and changes to the news. #cam:tv #insert:tv_remote #sfx:click #prop:tv=news
Mummy: Nana, why were you watching like that? #expr:mum=sideeye #cam:wide #focus:mum
#moment:documentary/The Documentary Watcher
There is no correct answer. #focus:none
-> ending

= ending
The closing theme plays. #sfx:theme #cam:wide #light:evening #amb:night
{tv_reaction == "eyes":
    Mummy: Now, bed. #expr:mum=smile
}
Mummy: Tomorrow, we are visiting Auntie Efua. #expr:mum=flat #focus:mum
By tomorrow afternoon, somebody else will know exactly what happened tonight. #focus:none #sfx:sting
-> ep2
