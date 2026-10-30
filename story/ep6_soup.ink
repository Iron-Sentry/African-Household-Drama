// =====================================================================
//  EPISODE SIX: THE MEAT IN THE SOUP
//  That Saturday, 7:40 PM. Light soup and fufu. The gizzard is Daddy's:
//  that is the law. One fat chicken thigh is left in the pot, Mummy is
//  in the kitchen, and Daddy has started to pray.
// =====================================================================

=== ep6 ===
#episode:6 #scene:hall #light:evening #cast:mum,child,dad #cam:table #amb:hall #prop:tv=off #prop:lamp=off #prop:keyhole=off #outfit:child=none #outfit:friend=none
#card:Episode Six/The Meat in the Soup/That evening · 7:40 PM
Light soup. Fufu. Steam you can see from the door. #expr:child=delight #emote:child=heart #expr:dad=read_paper #expr:mum=offer_food #sfx:pop
Mummy dishes. Daddy's bowl first. The gizzard goes in. #focus:mum
The gizzard is Daddy's. This is the law. Nobody wrote it down. Nobody needed to. #focus:none #emote:dad=sparkle
Your bowl. A neck. A wing. A lot of soup. #expr:child=flat #emote:child=dots #focus:child
And in the pot... one fat chicken thigh. Alone. #focus:none #cam:push #sfx:sting
Mummy: Let me bring the pepper. Nobody touch anything. #expr:mum=stern #focus:mum
Mummy goes to the kitchen. #cast:child,dad #focus:none #sfx:door
Daddy: Let us pray. #expr:dad=eyesclosed #focus:dad
Daddy prays like he is paid by the word. #focus:none #light:tension #sfx:throat
The thigh is right there. Daddy's eyes are closed. #cam:table #expr:child=focused #readroom #timer:12
#hint:Daddy's eyes are closed. Mummy is in the kitchen. The kitchen has a window into the hall.
* [Slide the thigh into your bowl #flavour:Fast. Silent. Holy.]
    -> grab
* [Close your eyes and pray properly #flavour:God sees the chicken.]
    -> pray
* [Whisper, "Daddy, can I have the last piece?" #flavour:Negotiate. During prayer.]
    -> ask
* [Keep one eye on the pot #timeout #flavour:Watch and pray.]
    -> watch

= grab
~ meat = "grab"
~ score(-6, 0, 7)
Spoon in. Thigh out. Into your bowl, under the wing. #expr:child=sneak #sfx:pop #anim:child=lean
Daddy: ...and bless the hands that prepared this food... #focus:dad
Mummy, from the kitchen: ...and the hands that are TAKING the food! #sfx:sting #fx:impact #expr:child=panic #emote:child=shock #focus:none
Daddy opens one eye. #expr:dad=shocked #focus:dad
Daddy: Nana! Your hand is faster than the Holy Spirit? #sticker:dad=ei #fx:shake
Mummy comes back. She takes the thigh out of your bowl and gives it to Daddy. Daddy did not ask. #cast:mum,child,dad #expr:mum=stern #focus:mum
#moment:holy_spirit/Faster Than the Holy Spirit
-> amen

= pray
~ meat = "prayed"
~ score(6, 0, -5)
You close your eyes. Properly. Both of them. #expr:child=eyesclosed #focus:child
Daddy: ...and we thank you for this food. Amen. #focus:dad
Nana: Amen! #expr:child=happy #focus:child #light:evening
You open your eyes. The pot is empty. #cam:table #sfx:sting #emote:child=shock #focus:none
The thigh is in Daddy's bowl. Daddy prays with his eyes closed. Daddy's spoon does not. #expr:dad=smug #focus:dad
Mummy comes back. She sees your face. She sees Daddy's bowl. #cast:mum,child,dad #expr:mum=side_eye #focus:mum
Without a word, Mummy puts her own piece of chicken in your bowl. #expr:mum=approve #emote:child=heart #sfx:good
#moment:quiet_victory/A Quiet Victory
Some victories come without a fight. #focus:none
-> amen

= ask
~ meat = "asked"
Nana, whispering: Daddy... can I have the last piece? #expr:child=worried #focus:child
Daddy stops praying. #expr:dad=shocked #focus:dad #auto:1400
Daddy: Ei! Even during prayer you are negotiating chicken? #sticker:dad=ei
{antenna == "foil" || hole_by == "daddy" || credit == "daddy":
    ~ score(4, 2, -1)
    Daddy: ...Half. You get half. Because you asked. #expr:dad=laugh
    He cuts it with his spoon like a High Court judge. #anim:dad=lean #sfx:pop #emote:child=sparkle
    #moment:judgment/The Judgment of Daddy
- else:
    ~ score(-1, 1, 1)
    Daddy: Close your eyes. We are not finished. #expr:dad=stern
    Daddy prays for ten more minutes. Specifically for children who negotiate. #light:tension #emote:child=dots #focus:none
    #moment:extra_prayer/Extra Prayer
}
Mummy comes back with the pepper. #cast:mum,child,dad #focus:none
-> amen

= watch
~ meat = "watched"
~ score(-2, 0, 1)
You close one eye. The other eye guards the pot. #expr:child=sideeye #focus:child
Daddy also has one eye open. Daddy is also guarding the pot. #expr:dad=sideeye #focus:dad
You look at each other. Nobody blinks. #focus:none #cam:push #sfx:heartbeat #auto:1600
Mummy, from the kitchen: The two of you. Close your eyes. #sfx:sting
#moment:one_eye/Watch and Pray
Mummy comes back, takes the thigh, and eats it herself. Peace has been restored. #cast:mum,child,dad #expr:mum=smug #focus:mum
-> amen

// ---- Amen. Now eat. ----------------------------------------------------

= amen
Amen. Everybody eats. #light:evening #cam:wide #focus:none #expr:mum=idle #expr:dad=idle #sfx:crunch
You saved your meat at the side of the bowl, under the fufu. The way everybody does. #expr:child=happy #focus:child
Daddy's bowl is empty. Daddy's eyes are not. #expr:dad=sideeye #focus:dad #sfx:heartbeat #readroom #timer:8
#hint:The best meat is saved for last. Everybody knows. That is the problem.
* [Eat it NOW #flavour:A bird in the mouth.]
    ~ meat_saved = "ate"
    ~ score(1, 1, -1)
    Gone. One bite. #expr:child=delight #sfx:crunch #focus:child
    Daddy sighs like a man who has lost a match. #expr:dad=flat #focus:dad
* [Save it for last, like a professional #timeout #flavour:Patience is a virtue.]
    ~ meat_saved = "lost"
    ~ score(-1, 0, 1)
    You eat the fufu. You drink the soup. You turn around for one second to get water. #expr:child=happy #focus:none
    When you turn back... #sfx:sting #auto:1200
    Daddy: You weren't eating it, so I helped you. #expr:dad=laugh #focus:dad #sticker:child=ewurade #expr:child=shock
    #moment:helped_you/Daddy Helped You
    #focus:none
* [Offer it to Mummy #flavour:She cooked it.]
    ~ meat_saved = "offered"
    ~ score(7, 0, -4)
    Mummy looks at the meat. Mummy looks at you. #expr:mum=shock #focus:mum
    Mummy: Eat. You are still growing. But I saw it. #expr:mum=approve #emote:mum=heart
    Daddy pretends he did not want it. Daddy wanted it. #expr:dad=flat #focus:dad
    #focus:none
- Rain on the zinc. Full bellies. A quiet house. #focus:none #amb:night #cam:wide
{meat == "grab":
    Tonight, you wash every bowl. Mummy has decided. #expr:child=flat #expr:mum=stern
}
Tomorrow is Sunday. And on Sunday, at three o'clock, there is football. #expr:dad=delight #emote:dad=sparkle
-> ep7
