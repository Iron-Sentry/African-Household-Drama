// =====================================================================
//  EPISODE NINE: FIVE MORE MINUTES
//  Wednesday, 5:50 PM. Chaskele in the lane: a milk tin, a stick, and
//  twenty-three runs. The rule is simple. When the streetlight comes on,
//  you come home. The streetlight is flickering.
// =====================================================================

=== ep9 ===
#episode:9 #scene:street #light:afternoon #cast:bofrot@16,friend,child #cam:wide #amb:street #prop:lamp=off #prop:keyhole=off #outfit:child=none #outfit:friend=none
#card:Episode Nine/Five More Minutes/Wednesday · 5:50 PM
Chaskele in the lane. A milk tin. A stick. You. #expr:child=focused #expr:friend=comment #expr:bofrot=idle
{friend} throws. You swing. #anim:friend=lean #sfx:whoosh
CLANG! The tin flies past the gutter. #sfx:thump #fx:impact #anim:child=jump #expr:child=delight
Twenty-three runs. A world record. In this lane. #sfx:cheer #emote:child=sparkle
Auntie Akua: Eiii, small Abedi Pele! #expr:bofrot=laugh #focus:bofrot
The sky turns orange. Then pink. #light:dusk #focus:none #cam:gate
The streetlight flickers. Once. Twice. #light:evening #fx:flash #sfx:click
{friend}: It's not fully on. That one doesn't count. #expr:friend=comment #focus:friend
{friend}: Five more minutes. #expr:friend=happy #anim:friend=bounce
{called == "fullname" || called == "third":
    The last time you didn't come, the whole junction learned your full name. #emote:child=sweat #focus:none
}
The rule is the rule. When the streetlight comes on, you come home. #focus:none #expr:child=worried #readroom #timer:10
#hint:Mummy can see the streetlight from the kitchen window. Mummy can also see the clock.
* [Go home now #flavour:Twenty-three runs is enough history.]
    -> on_time
* [Five more minutes #timeout #flavour:It's not FULLY on.]
    -> late
* [Ask Auntie Akua to tell Mummy you're coming #flavour:She knows everybody.]
    -> messenger

= on_time
~ home_time = "ontime"
~ score(6, 0, -5)
Nana: I'm going. The rule is the rule. #expr:child=proud #focus:child
{friend}: Coward! #expr:friend=sideeye #focus:friend
Nana: Alive coward. #expr:child=smug #focus:child
You run home with the tin as a trophy. #sfx:whoosh #focus:none
Home. Mummy is at the window. She sees you come in, two minutes after the light. #scene:compound #light:evening #cast:child,mum@84 #cam:door #amb:compound #expr:mum=approve
Mummy: Good. #focus:mum
From the lane, a familiar voice. #focus:none #cam:gate
{friend}'s Mother, from the lane: {friend}! Do you know what time it is? #sfx:sting
{friend}'s Mother, from the lane: Five more minutes? I will give you five more minutes! #fx:shake
#moment:alive_coward/Alive Coward
You eat your dinner very peacefully. #expr:child=happy #emote:child=heart
-> ep9_end

= late
~ home_time = "late"
~ score(-3, 0, 2)
Five more minutes. #expr:child=delight #anim:child=jump #focus:none
{friend} throws. You swing. CLANG! #sfx:thump #anim:friend=lean
Five more minutes. #sfx:whoosh #auto:1200
Five more minutes. #anim:child=jump #auto:1200
Auntie Akua lights her lantern. That is the second clock. #prop:lamp=on #light:moon #expr:bofrot=call #focus:bofrot
Auntie Akua: Children! It is night! Your mothers have eyes! #expr:bofrot=call
Then, at the end of the lane, a silhouette. Hands on hips. #cam:gate #focus:none #sfx:heartbeat #cast:bofrot@16,friend,child,mum@57
It is Mummy. In her slippers. #expr:mum=stern #focus:mum
{friend} disappears so fast {fhe} leaves {fhis} slippers behind. #cast:bofrot@16,child,mum@57 #sfx:whoosh #focus:none
Mummy: Five more minutes, eh? #expr:mum=scold #focus:mum #sticker:mum=hmmm
Mummy: It is forty minutes past six. #readroom #timer:10
#hint:Mummy hates lies more than lateness. But Mummy loves a good explanation.
* [Say sorry. Mean it. #flavour:No excuses.]
    ~ score(4, 0, -3)
    Nana: Sorry, Mummy. I knew. I just didn't want to stop. #expr:child=worried #focus:child
    Mummy: ...At least you are honest. Walk in front of me. #expr:mum=stern #focus:mum
* [Blame the streetlight #flavour:It came on late. Technically.]
    ~ score(-4, 0, 4)
    Nana: Mummy, the streetlight came on late today. #expr:child=comment #focus:child
    Mummy: The streetlight came on late. And the moon? Did the moon also come late? #expr:mum=scold #focus:mum #fx:shake
    #moment:late_moon/The Late Moon
* [Show her the twenty-three runs #flavour:Some things are worth it.]
    ~ score(-1, 0, 1)
    Nana: Mummy. Twenty-three runs. A world record. #expr:child=proud #focus:child
    Auntie Akua: It's true, Esi! The child is a champion! #expr:bofrot=laugh #focus:bofrot
    Mummy tries not to smile. Mummy fails, for half a second. #expr:mum=laugh #focus:mum
    Mummy: The champion will sweep the compound tomorrow. #expr:mum=stern
    #moment:champion/Twenty-Three Runs
- You walk home in front of Mummy, holding {friend}'s slippers. #focus:none #emote:child=dots
-> ep9_end

= messenger
~ home_time = "messenger"
~ score(1, 3, 0)
Nana: Auntie Akua, please, if you see Mummy, tell her I'm coming. #expr:child=happy #focus:child
Auntie Akua: Eh? I will tell her right now. #expr:bofrot=call #focus:bofrot
She cups her hands. #auto:1000
Auntie Akua: ESI! YOUR CHILD IS HERE! THE CHILD SAYS IT IS COMING! #fx:shake #sfx:sting #anim:bofrot=bounce
The whole lane hears. #focus:none #cam:gate
Mummy, from far away: THEN WHY IS THE CHILD STILL THERE? #fx:impact #expr:child=panic #emote:child=shock
{friend}: Chale. You are finished. #expr:friend=laugh #focus:friend
#moment:town_crier/The Town Crier
You run. Auntie Akua laughs for the rest of the evening. #expr:child=run #sfx:whoosh #expr:bofrot=laugh #focus:none
-> ep9_end

= ep9_end
That night, through your window, Mummy is talking to {friend}'s Mother over the wall. #scene:bedroom #light:moon #cast:child #cam:bed #amb:night #expr:child=eyesclosed
{
- home_time == "ontime":
    Mummy, over the wall: Mine came home on time. I don't know what you are feeding yours.
- home_time == "late":
    Mummy, over the wall: Both of them. Forty minutes. Yes. Slippers and all.
- else:
    Mummy, over the wall: Akua shouted it to the whole lane. I could have died.
}
You smile into your pillow. #expr:child=happy #emote:child=dots
-> ep10
