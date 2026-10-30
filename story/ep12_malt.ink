// =====================================================================
//  EPISODE TWELVE: WHO FINISHED THE MALT?
//  That Saturday, 8:00 PM. Daddy's crate of Malta Guinness, bought for
//  the Christmas visitors and kept under his bed, should hold twelve.
//  Daddy has counted ten. Nana knows where one went. Only one.
// =====================================================================

=== ep12 ===
#episode:12 #scene:hall #light:evening #cast:mum,child,dad #cam:wide #amb:hall #prop:tv=off #prop:lamp=off #prop:keyhole=off #outfit:child=none #outfit:friend=none
#card:Episode Twelve/Who Finished the Malt?/That evening · 8:00 PM
Daddy comes out of the bedroom carrying the crate like a coffin. #expr:dad=stern #anim:dad=slump #focus:dad #sfx:thump
He puts it on the table. Everybody gathers. Like a funeral. #cam:table #insert:malt_bottle #focus:none
Daddy: Twelve. I bought twelve. #expr:dad=lecture #focus:dad
Daddy counts. One. Two. Three... #auto:1600 #sfx:click
Daddy: Ten. #fx:impact #expr:dad=scold #sticker:dad=hmmm
Thursday. Very hot. You and {friend}. One malt. Two straws. #expr:child=panic #emote:child=sweat #focus:child #light:tension
One. You drank one. Not two. #emote:child=question
Daddy: WHO FINISHED THE MALT? #expr:dad=scold #focus:dad #fx:shake
{told_malt:
    Mummy: Before Efua finishes it for us. #expr:mum=flat #focus:mum
}
Everybody looks at you. Mummy also looks at Daddy, but nobody notices that. #expr:mum=side_eye #focus:none #cam:push #readroom #timer:12
#hint:You drank one. Somebody else drank the other one. Daddy's bottle opener is on his key ring, not in the kitchen.
* [Admit you drank one #flavour:One. Only one. With your friend.]
    -> admit
* [Blame your friend #flavour:They were holding the bottle.]
    -> blame_friend
* [Suggest counting the empty bottles #flavour:Evidence.]
    -> empties
* [Blame the rat #timeout #flavour:Rats are thirsty too.]
    -> rat

= admit
~ malt = "admit"
~ score(6, 0, -4)
Nana: Daddy... I drank one. With {friend}. On Thursday. It was very hot. #expr:child=worried #focus:child
Daddy: One. #expr:dad=think #focus:dad
Nana: One, Daddy. Only one. #focus:child
Daddy: Then where is the other one? #expr:dad=scold #focus:dad
Mummy: The other one was drunk on Sunday night. By a man who shouted "GOAL!" #expr:mum=smug #focus:mum #sticker:mum=hmmm
Daddy goes very, very quiet. #expr:dad=shocked #focus:dad #auto:1800 #emote:dad=sweat
#moment:goal_malt/The Goal Malt
-> verdict

= blame_friend
~ malt = "blamed"
~ score(-5, 0, 5)
Nana: It was {friend}, Daddy. {friend} was holding the bottle. #expr:child=sneak #focus:child
Daddy: Then let us ask {friend}. #expr:dad=stern #focus:dad
Over the wall, Daddy calls. Over the wall, {friend} answers. #sfx:knock #focus:none
{friend}: Uncle, we shared it! Nana opened it! Nana had the long straw! #cast:mum,child,dad,friend #expr:friend=comment #focus:friend #anim:friend=bounce
{kojo_betrayed:
    {friend} has not forgotten the bofrot. {friend} will never forget the bofrot. #expr:friend=smug #emote:friend=sparkle
}
Nana: ...The long straw was an accident. #expr:child=worried #focus:child
Daddy: One. And the other one? #expr:dad=scold #focus:dad
{friend}: Uncle, I heard you shouting GOAL on Sunday. With something in your hand. #expr:friend=happy #focus:friend
Daddy sends {friend} home very quickly. #cast:mum,child,dad #expr:dad=shocked #focus:dad #emote:dad=sweat
#moment:long_straw/The Long Straw
-> verdict

= empties
~ malt = "detective"
~ score(2, 4, -2)
Nana: Daddy. Let us count the empty bottles. #expr:child=focused #focus:child
Mummy: Under the kitchen sink. #expr:mum=approve #focus:mum
You bring them out. Two empty malt bottles. #insert:malt_bottle #sfx:click #focus:none #cam:table
One has two straws in it. #emote:child=dots
One has no straw at all. #sfx:sting #cam:push
Nana: Only one person in this house drinks malt straight from the bottle. #expr:child=smug #focus:child
Everybody turns to Daddy. #expr:dad=shocked #focus:dad #emote:dad=sweat #fx:impact
Daddy: ...During the football, a man gets thirsty. #expr:dad=hands_on_hips
Mummy laughs so hard she has to sit down. #expr:mum=laugh #anim:mum=shake #focus:mum
#moment:no_straw/No Straw
-> verdict

= rat
~ malt = "rat"
~ score(-4, 0, 4)
Nana: Daddy... maybe a rat. #expr:child=worried #focus:child
{pocket_outcome == "rat":
    Mummy: The rat again? First Auntie Efua's biscuits, now malt? This rat is doing well. #expr:mum=side_eye #focus:mum #sticker:mum=hmmm
- else:
    Daddy: A rat. That opens bottles. With a bottle opener. #expr:dad=scold #focus:dad
}
Daddy: Show me this rat. #expr:dad=stern #focus:dad
You lead the whole family to the kitchen to look for a rat that does not exist. #focus:none #sfx:whoosh
Under the sink, you find no rat. You find two empty bottles. One with two straws. One with none. #insert:malt_bottle #sfx:sting
Daddy decides the investigation is now closed. #expr:dad=flat #focus:dad #emote:dad=sweat
#moment:thirsty_rat/The Thirsty Rat
-> verdict

// ---- The verdict --------------------------------------------------------

= verdict
Daddy clears his throat. The court is in session. #sfx:throat #cam:wide #focus:dad #expr:dad=lecture #light:evening
Daddy: Nobody touches these ten bottles until Christmas. Nobody. Including... anybody. #expr:dad=stern
Mummy: Including anybody. #expr:mum=side_eye #focus:mum
{
- malt == "admit" || malt == "detective":
    Daddy: And Nana. Thank you for your honesty. You may have a malt on Christmas Day. #expr:dad=approve #focus:dad #sticker:dad=good_child #sfx:good
- malt == "blamed":
    Daddy: And Nana. On Christmas Day, you will serve the malt. You will not drink the malt. #expr:dad=stern #focus:dad
- else:
    Daddy: And Nana. Tomorrow, you will look for that rat. All day. #expr:dad=stern #focus:dad
}
{told_malt:
    Auntie Efua, over the wall: Esi! Keep one for me oo! #sfx:sting #focus:none
    Daddy looks at the crate. Daddy looks at you. #expr:dad=sideeye #emote:child=sweat
}
Two weeks later, the whole house smells of Christmas. #focus:none #cam:wide #expr:child=delight #emote:child=sparkle
-> ep13
