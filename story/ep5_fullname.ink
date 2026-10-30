// =====================================================================
//  EPISODE FIVE: WHEN MUMMY CALLS YOUR FULL NAME
//  The next Saturday, 5:20 PM. Ampe in the compound. The first call is
//  your name. The second call is your FULL name. Nobody has ever heard
//  a third call, because Mummy comes outside. Then the rain comes.
// =====================================================================

=== ep5 ===
#episode:5 #scene:compound #light:afternoon #cast:friend,child #cam:wide #amb:compound #prop:keyhole=off #outfit:child=none #outfit:friend=none
#card:Episode Five/When Mummy Calls Your Full Name/The next Saturday · 5:20 PM
Saturday. Ampe in the compound. Clap, jump, foot out. #expr:child=delight #expr:friend=laugh #anim:child=jump #sfx:pop
Eleven to four. You are winning. #anim:friend=jump #sfx:cheer
{friend}: Again! One more! #expr:friend=comment #focus:friend
Mummy, from the house: Nana! #sfx:sting #focus:none
{friend} stops mid-jump. #expr:friend=shock #emote:friend=shock
The first call is free. Everybody knows the first call is free. #expr:child=worried #readroom #timer:10
#hint:First call, your name. Second call, your full name. Nobody has ever heard a third call.
* [Shout "Yes, Mummy!" and run #flavour:Fast feet, no questions.]
    -> first_call
* [Pretend you didn't hear #flavour:The wind is very loud today.]
    ~ score(-3, 0, 2)
    You jump. You clap. You hear nothing. #expr:child=happy #anim:child=jump #sfx:pop
    -> full_name
* [Ask your friend to answer for you #flavour:A terrible plan.]
    -> employee
* [Just one more round #timeout #flavour:Eleven to four. She can wait.]
    ~ score(-3, 0, 2)
    One more round. Clap, jump... #anim:child=jump #sfx:pop
    -> full_name

= first_call
~ called = "first"
~ score(6, 0, -5)
Nana: YES, MUMMY! I'M COMING! #expr:child=run #anim:child=bounce #sfx:whoosh
You reach the door before your own echo. #cast:friend,child,mum@84 #cam:door #expr:mum=approve
Mummy: Ah. So you have ears. #focus:mum
#moment:first_call/The First Call
{friend}: Eleven to four. I am writing it down. #expr:friend=sideeye #focus:friend
-> rain

= full_name
~ called = "fullname"
{friend} hears it first. {friend} stops clapping. #expr:friend=worried #focus:friend
The compound goes quiet. Even the mango tree holds its breath. #focus:none #light:tension #sfx:heartbeat #auto:1600
Mummy, from the house: NANA {friend == "Adjoa":KWAME|AKOSUA} BOATENG! #fx:impact #sticker:child=ewurade #expr:child=panic
Somewhere in the compound, a radio switches off. #sfx:radiooff #cam:push
{friend}'s Mother, from her window: Ei. The full name. #emote:friend=sweat
{friend}: Chale... I'm going home. #expr:friend=run #focus:friend
{friend} is gone. Loyalty has limits. #cast:child #focus:none #sfx:whoosh #readroom #timer:8
* [RUN #flavour:Now. Immediately. Yesterday.]
    ~ score(1, 0, -2)
    You have never run faster. Not even from Auntie Efua's goat. #expr:child=run #anim:child=bounce #sfx:whoosh
    Mummy is already at the door. #cast:child,mum@84 #cam:door #expr:mum=arms_crossed
    Mummy: The second time. You heard me the second time. #focus:mum #sticker:mum=hmmm
* [Shout "I'm coming!" from where you are #timeout #flavour:Technically, an answer.]
    ~ called = "third"
    ~ score(-4, 0, 5)
    Nana: I'M COMING, MUMMY! #expr:child=comment
    You do not move. #auto:1400 #emote:child=dots
    The door opens. #sfx:door #cast:child,mum@84 #cam:door #expr:mum=scold
    Mummy: Coming? From where? Kumasi? #focus:mum #sticker:mum=ei #fx:shake
    Mummy: Are your legs on holiday? #expr:mum=stern
    #moment:from_kumasi/Coming From Kumasi
    #focus:none
- -> rain

= employee
~ called = "employee"
~ score(-4, 0, 4)
Nana: Answer for me. Make your voice small. #expr:child=sneak #focus:child
{friend} cups {fhis} hands around {fhis} mouth. #expr:friend=comment #focus:friend
{friend}: YES, MUMMY! I'M COMING! #anim:friend=bounce
A long silence. #focus:none #auto:1800 #emote:child=sweat
Mummy, from the house: ...Is that Nana's voice? #sfx:sting
The door opens. Mummy looks at {friend}. Mummy looks at you. #sfx:door #cast:friend,child,mum@84 #cam:door #expr:mum=side_eye
Mummy: So now you have employed somebody to answer for you? #focus:mum #sticker:mum=hmmm
{friend}: Auntie, I'm not employed. I'm a volunteer. #expr:friend=proud #focus:friend
#moment:employee/Your Employee Can Help
Mummy: Then, volunteer, you can help with the washing. You too, Managing Director. #expr:mum=stern #focus:mum
-> rain

// ---- The washing line ---------------------------------------------------

= rain
A dark cloud rolls over the compound like a trotro. #light:tension #cam:tree #sfx:thump #fx:flash #focus:none
{called == "employee":
    The washing line flaps. Two of you. One line. No time. #cast:friend@44,child@62,mum@84 #expr:mum=stern
- else:
    The washing line flaps. One of you. One line. No time. #cast:child@62,mum@84 #expr:mum=stern
}
Mummy: Bring it in! Quick, quick! #focus:mum #anim:mum=bounce
Mummy's good kaba. Daddy's white work shirt. Your school uniform. #cam:tree #expr:child=panic #focus:none
The first drop lands on your nose. #sfx:splash #emote:child=sweat #readroom #timer:10
#hint:Daddy wears that white shirt on Monday. Mummy washed it by hand. Twice.
* [Daddy's white shirt first #flavour:Monday is serious.]
    ~ washing = "shirt"
    ~ score(4, 2, -3)
    You save the shirt. Not one drop. White as a church. #expr:child=proud #emote:child=sparkle #sfx:good #cam:wide
    Mummy: Hmm. Clever. #expr:mum=approve #focus:mum
    #moment:white_shirt/The White Shirt
    #focus:none
* [Mummy's good kaba first #flavour:She is watching you.]
    ~ washing = "kaba"
    ~ score(6, 0, -3)
    You save the kaba. Mummy sees you save the kaba. #expr:child=proud #expr:mum=approve #focus:mum #sfx:good #cam:wide
    Daddy's shirt gets rained on. Daddy is not here to see it. #focus:none
* [Grab everything at once #flavour:Two arms. How hard can it be?]
    ~ washing = "all"
    ~ score(-3, 0, 3)
    You grab everything. Everything grabs back. #expr:child=strain #anim:child=shake #cam:wide
    The whole line comes down in the sand. #fx:impact #sfx:thump #expr:mum=wail #emote:mum=shock
    Mummy: My kaba! #focus:mum #fx:shake
    #moment:sand_collection/The Sand Collection
    #focus:none
* [Stand and watch the sky #timeout #flavour:Maybe it will change its mind.]
    ~ washing = "none"
    ~ score(-4, 0, 2)
    The sky does not change its mind. #sfx:splash #emote:child=dots #cam:wide
    Mummy runs past you with both arms full. She says nothing. That is worse. #expr:mum=stern #focus:mum
    #focus:none
- The rain arrives. Everybody runs. #sfx:splash #anim:child=bounce
-> indoors

= indoors
Inside. Rain on the zinc roof like a hundred drummers. #scene:hall #light:evening #cast:mum,child,dad #cam:wide #amb:hall #prop:tv=off #prop:lamp=off #expr:dad=read_paper #expr:mum=flat #expr:child=neutral
{
- called == "first":
    Mummy: When I call you once and you answer once, life is sweet. #expr:mum=approve #focus:mum
- called == "employee":
    Daddy: I hear we have a new member of staff. #expr:dad=laugh #focus:dad
    Mummy: Unpaid. #expr:mum=flat #focus:mum
- else:
    Daddy: I heard your full name from the junction. #expr:dad=laugh #focus:dad
    Mummy: The whole junction heard it. Next time, answer the first time. #expr:mum=stern #focus:mum
}
{
- washing == "shirt":
    Daddy holds up his white shirt. Dry. Perfect. He looks at you like you saved his career. #expr:dad=approve #focus:dad #emote:dad=sparkle
- washing == "all":
    Mummy is washing the kaba again. By hand. She looks at you between rinses. #expr:mum=side_eye #focus:mum
- washing == "none":
    Every towel in the house is wet. Tonight, you will dry yourself with optimism. #expr:child=flat #focus:child
}
From the kitchen comes the smell of light soup. Tonight, there is chicken. #focus:none #expr:child=delight #emote:child=heart
-> ep6
