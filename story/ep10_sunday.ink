// =====================================================================
//  EPISODE TEN: SUNDAY BEST
//  Sunday, 6:05 AM. First service at 6:30. White clothes, ironed by Mummy with
//  starch strong enough to stand up by itself. Then one last bite of
//  Daddy's bread and stew, and one red drop.
// =====================================================================

=== ep10 ===
#episode:10 #scene:bedroom #light:dusk #cast:child #cam:wide #amb:hall #prop:lamp=off #prop:keyhole=off #outfit:child=none #outfit:friend=none
#card:Episode Ten/Sunday Best/Sunday · 6:05 AM
Sunday. Your white church clothes. Ironed. Starched. They could go to church without you. #expr:child=proud #emote:child=sparkle #focus:child
Mummy, from the hall: First service is at six-thirty! Nobody will make me late for the Lord! #sfx:sting
You eat one last bite of Daddy's bread and stew. Just one. #expr:child=delight #sfx:crunch #focus:none
One red drop falls. #auto:1400 #cam:push #sfx:heartbeat
Right on your chest. On the white. #expr:child=panic #fx:impact #sticker:child=ewurade #emote:child=shock
It is the shape of Africa. #emote:child=dots #focus:child
Mummy, from the hall: Nana! Inspection in five minutes! #sfx:sting #focus:none
Palm oil does not forgive. Palm oil does not forget. #expr:child=worried #readroom #timer:12
#hint:Cold water and salt can save palm oil, if you are quick. Hot water and soap make it worse. Mummy knows this. You don't.
* [Cover it with your hand all morning #flavour:Hand on heart. Very holy.]
    -> hand
* [Tell Mummy and ask for help #flavour:She has fought palm oil before.]
    -> confess
* [Scrub it secretly with soap #flavour:Quick. Hot water. Lots of soap.]
    -> scrub
* [Borrow Daddy's tie and wear it over the stain #flavour:A long tie covers everything.]
    -> tie
* [Hope nobody notices #timeout #flavour:It's small. It's tiny. It's Africa.]
    -> hope

= hand
~ stain = "hand"
~ score(-1, 1, 0)
You put your hand on your chest. Like a national anthem. #expr:child=proud #focus:child
-> inspection

= confess
~ stain = "confess"
~ score(6, 0, -4)
Nana: Mummy... palm oil. #expr:child=worried #focus:child
Mummy appears in the doorway. One look. #cast:child,mum@84 #cam:door #light:doorway #expr:mum=shocked #emote:mum=shock
Mummy: Take it off. Quick. Cold water. Salt. #expr:mum=stern #focus:mum
Two minutes. Cold water, salt, Mummy's thumbs, and a prayer. #insert:watering_can_tin #sfx:splash #focus:none #cam:wide
Africa disappears. A faint Togo remains. Nobody will see Togo. #expr:child=delight #emote:child=sparkle #sfx:good
Mummy: Next time, you tell me in one minute, not five. #expr:mum=approve #focus:mum
#moment:cold_water/Cold Water and Salt
-> inspection

= scrub
~ stain = "scrub"
~ score(-3, 0, 3)
Hot water. Soap. Scrub, scrub, scrub. #expr:child=strain #anim:child=shake #sfx:splash
Africa becomes pink. Then bigger. Then wet. #emote:child=sweat #focus:child
Now it is the shape of Africa and Europe. #fx:impact #expr:child=panic
#moment:pink_africa/Pink Africa
-> inspection

= tie
~ stain = "tie"
~ score(-1, 3, 1)
You tiptoe into Daddy's room. Daddy's red tie. The long one. #expr:child=sneak #focus:child #sfx:door
You tie it like Daddy does. Badly. But it covers Africa completely. #expr:child=proud #emote:child=sparkle
Daddy, from his room: Esi! Where is my red tie? #sfx:sting #focus:none
#moment:small_lawyer/The Small Lawyer
-> inspection

= hope
~ stain = "hope"
~ score(-3, 0, 2)
It is small. Nobody will notice. Nobody notices anything at six in the morning. #expr:child=happy #focus:child
-> inspection

// ---- Mummy's inspection -------------------------------------------------

= inspection
The hall. Mummy's inspection line. #scene:hall #light:dusk #cast:mum,child,dad #cam:wide #amb:hall #prop:tv=off #expr:mum=stern #expr:dad=hands_on_hips #transition:cut
Mummy: Turn around. #focus:mum
{
- stain == "hand":
    You turn around. Hand on chest. #expr:child=proud #focus:child
    Mummy: Why is your hand there? #expr:mum=side_eye #focus:mum
    Nana: I'm... grateful, Mummy. #expr:child=worried #focus:child
    Daddy: Leave the child. The child is grateful. #expr:dad=laugh #focus:dad
    Mummy is not finished with you. But it is 6:29. #expr:mum=stern #focus:mum
- stain == "confess":
    You turn around. Clean. White. Faint Togo. #expr:child=proud #focus:child
    Mummy: Perfect. #expr:mum=approve #focus:mum #sticker:mum=good_child
- stain == "scrub":
    You turn around. Mummy sees a giant wet pink continent. #expr:child=worried #focus:child #emote:mum=shock
    Mummy: Nana. Did you use HOT water? #expr:mum=wail #focus:mum #fx:shake #sticker:mum=ei
    Mummy: Hot water! On palm oil! Who raised you?! #expr:mum=scold
    Daddy: You did. #expr:dad=laugh #focus:dad
    Mummy pins her own handkerchief over it. It is pink too now. #expr:mum=stern #focus:mum
- stain == "tie":
    You turn around. Daddy's red tie hangs down to your knees. #expr:child=proud #focus:child
    Daddy sees his tie. Daddy opens his mouth. #expr:dad=shocked #focus:dad
    Mummy: Leave it. It's 6:29. You will go without a tie. #expr:mum=stern #focus:mum
    Daddy goes to church with an open collar, like a musician. #expr:dad=flat #focus:dad
- else:
    You turn around. #focus:child
    Mummy: Turn again. #expr:mum=side_eye #focus:mum
    Mummy: What is this map on your chest? #expr:mum=scold #fx:shake #sticker:mum=hmmm
    Nana: ...Africa, Mummy. #expr:child=worried #focus:child
    It is 6:29. There is no time. Mummy pins her handkerchief over Africa and pushes you out of the door. #expr:mum=stern #focus:none
}
-> church_yard

= church_yard
The compound. Auntie Efua, in a headwrap taller than the gate. #scene:compound #light:dusk #cast:auntie@40,child,mum@70,dad@84 #cam:wide #amb:compound #expr:auntie=wave #sfx:door
Auntie Efua: Ah! Look at Nana! So smart for the Lord! #expr:auntie=welcome #focus:auntie
{
- stain == "tie":
    Auntie Efua: And a tie! A small lawyer! Esi, this one will defend us all in court! #expr:auntie=laugh #emote:auntie=heart
    Daddy touches his empty collar. Nobody defends him. #expr:dad=flat #focus:dad
    ~ score(2, 0, -1)
- stain == "hand":
    Auntie Efua: Hand on heart! Since when? Esi, has this child been born again? #expr:auntie=shocked #emote:auntie=question
    Mummy: Since this morning. #expr:mum=side_eye #focus:mum
- stain == "confess":
    Auntie Efua looks you up and down. She finds nothing. She is disappointed. #expr:auntie=arms_crossed #focus:auntie
- else:
    Auntie Efua: Esi, why is the child wearing a handkerchief? #expr:auntie=gossip #focus:auntie #emote:auntie=question
    Mummy: Fashion. #expr:mum=flat #focus:mum
    Auntie Efua will tell three people before the first hymn. #focus:none
    ~ score(-2, 0, 0)
}
-> after_church

= after_church
After church. The sermon was about honesty. Mummy looked at you the whole time. #light:afternoon #cam:wide #focus:none #expr:child=flat #expr:mum=side_eye
{stain == "confess":
    Mummy didn't look at you. She looked at Daddy, who slept through the second reading. #expr:dad=eyesclosed #focus:dad
}
-> ep10_end

= ep10_end
That evening, the white clothes hang on the line in the moonlight. #light:moon #amb:night #cast:child #cam:tree
{
- stain == "confess":
    Clean. White. Faint Togo, only if you know where to look.
- stain == "scrub":
    Pink. Forever. Next Sunday, they will be your "special" clothes.
- else:
    Africa is still there, faintly. Mummy will fight it again on Saturday.
}
Next Saturday, Mummy has a bowl for you to return. To Auntie Efua. #expr:child=worried #emote:child=dots
-> ep11
