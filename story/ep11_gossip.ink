// =====================================================================
//  EPISODE ELEVEN: THE FAMILY GOSSIP TRAP
//  Saturday, 11:00 AM. Auntie Efua's soup bowl goes back today, and in
//  this compound a bowl never goes back empty. Mummy comes too. Auntie
//  sends Mummy to taste the soup in the kitchen, then asks the question
//  no child can answer.
// =====================================================================

=== ep11 ===
#episode:11 #scene:auntie #light:afternoon #cast:auntie,child,mum #cam:wide #amb:auntie #prop:auntie_tv=off #prop:lamp=off #prop:keyhole=off #outfit:child=none #outfit:friend=none
#card:Episode Eleven/The Family Gossip Trap/Saturday · 11:00 AM
Auntie Efua's soup bowl goes back today. Never empty. Mummy has filled it with her own groundnut soup. #expr:mum=offer_food #expr:auntie=welcome #expr:child=happy #focus:mum
This is not a bowl. This is diplomacy. #focus:none #emote:child=dots
Auntie Efua: Esi! Come, come! #expr:auntie=wave #focus:auntie #sfx:door
{auntie_tv_fixed:
    Auntie Efua: My engineer! My television has been perfect since you touched it! #expr:auntie=delight #emote:auntie=heart #cam:auntie_tv
}
Auntie Efua tastes Mummy's soup. A long, serious taste. #expr:auntie=gossip #cam:wide #sfx:pop
Auntie Efua: Esi. Go and taste MY soup in the kitchen. Tell me if the salt is correct. #expr:auntie=point
Mummy goes to the kitchen. The kitchen is behind a very thin curtain. #cast:auntie,child #expr:mum=idle #sfx:door #focus:none
Auntie Efua pulls you close. #expr:auntie=gossip #focus:auntie #cam:tray
Auntie Efua: Nana. Tell me the truth. Who cooks better? Me? Or your mother? #light:tension #sfx:heartbeat
The curtain does not move. The curtain is listening. #focus:none #expr:child=panic #emote:child=sweat #readroom #timer:12
#hint:Mummy can hear everything through that curtain. Auntie Efua can tell everybody everything. Both of them can cook.
* [Mummy, of course #flavour:Blood is thicker than soup.]
    -> mummy
* [You, Auntie #flavour:She is right here. And she has biscuits.]
    -> auntie
* [You both cook like angels. Different angels. #flavour:Diplomacy.]
    -> angels
* [My Daddy #flavour:Chaos.]
    -> daddy
* [Take a big spoon of soup so you can't answer #timeout #flavour:Mouth full. Very polite.]
    -> spoon

= mummy
~ cooks_better = "mummy"
~ score(2, 0, 0)
Nana: Mummy, Auntie. Of course. #expr:child=proud #focus:child
Auntie Efua: Hmph. #expr:auntie=arms_crossed #focus:auntie #sticker:auntie=hmmm
Mummy, from the kitchen: Good child! #sfx:good
Auntie Efua slowly moves the biscuit tray out of your reach. #insert:biscuit_tray #expr:auntie=arms_crossed #focus:none
#moment:blood_soup/Blood Is Thicker Than Soup
-> car

= auntie
~ cooks_better = "auntie"
~ score(-5, 0, 4)
Nana: You, Auntie. #expr:child=happy #focus:child
Auntie Efua: AH! I knew it! #expr:auntie=delight #focus:auntie #emote:auntie=heart #anim:auntie=bounce
In the kitchen, nothing. Absolutely nothing. #focus:none #sfx:heartbeat #auto:1600
Silence is the loudest thing Mummy owns. #light:tension
Auntie Efua: Take biscuits! Take two! Take three! #expr:auntie=offer_biscuits #insert:biscuit_tray #focus:auntie
#moment:loudest_silence/The Loudest Silence
-> car

= angels
~ cooks_better = "both"
~ score(4, 3, -3)
Nana: You both cook like angels, Auntie. Different angels. #expr:child=comment #focus:child
Auntie Efua stares at you. #expr:auntie=shocked #focus:auntie #auto:1400
Auntie Efua: ...Esi! Come and hear this child! This child will be President! #expr:auntie=laugh #anim:auntie=shake #sticker:auntie=chale
Mummy, from the kitchen: I heard. #sfx:good
#moment:different_angels/Different Angels
-> car

= daddy
~ cooks_better = "daddy"
~ score(2, 0, 0)
Nana: My Daddy. #expr:child=happy #focus:child
Auntie Efua: ...Your Daddy? #expr:auntie=shocked #focus:auntie #emote:auntie=question
Nana: He makes very good boiled eggs. #expr:child=proud #focus:child
Behind the curtain, Mummy laughs so hard a spoon falls. #sfx:thump #focus:none
Auntie Efua laughs until her headwrap slips. #expr:auntie=laugh #anim:auntie=shake #focus:auntie
#moment:boiled_eggs/Daddy's Boiled Eggs
-> car

= spoon
~ cooks_better = "spoon"
~ score(0, 1, -1)
You take the biggest spoon of soup in history. #expr:child=strain #sfx:crunch #focus:child
Auntie Efua waits. #expr:auntie=arms_crossed #focus:auntie
You chew. Groundnut soup does not need chewing. You chew anyway. #focus:child #anim:child=shake
Auntie Efua waits. #focus:auntie #auto:1200
Mummy comes back before you swallow. #cast:auntie,child,mum #focus:none #sfx:door
Auntie Efua: This child is a politician. #expr:auntie=point #focus:auntie
#moment:politician/The Politician
-> car

// ---- The second trap ------------------------------------------------------

= car
{cooks_better != "spoon":
    Mummy comes back from the kitchen. Her face says nothing. Her face says everything. #cast:auntie,child,mum #expr:mum=flat #focus:mum #sfx:door
}
Auntie Efua: Esi, your salt is correct. Now, Nana... #expr:auntie=gossip #focus:auntie #light:afternoon
{gossip == "told":
    Auntie Efua: The last time, you told me the car was at the mechanic. #expr:auntie=gossip
}
Auntie Efua: Is it true that your Daddy has bought something big? Something for Christmas? #emote:auntie=question #cam:tray
You know about the crate of Malta Guinness under Daddy's bed. Twelve bottles. For visitors. #expr:child=worried #emote:child=dots #focus:child
Mummy looks at you. Auntie Efua looks at you. #expr:mum=side_eye #focus:none #readroom #timer:10
#hint:Mummy is right here this time. If Auntie Efua hears "twelve bottles", she will be the first visitor.
* [Look at Mummy and say nothing #flavour:Pass the question.]
    ~ told_malt = false
    ~ score(3, 0, -2)
    You look at Mummy. Mummy takes the question like a goalkeeper. #focus:mum #expr:mum=approve
    Mummy: Efua, how is Kwabena? Is it still cold in London? #expr:mum=smug
    Auntie Efua forgets everything. #expr:auntie=delight #focus:auntie #emote:auntie=heart
* [Everybody is fine, Auntie #flavour:The official statement.]
    ~ told_malt = false
    ~ score(1, 0, -1)
    Nana: Everybody is fine, Auntie. #expr:child=happy #focus:child
    {gossip == "fine":
        Auntie Efua: "Everybody is fine." Again! This family is a fortress! #expr:auntie=arms_crossed #focus:auntie #sticker:auntie=hmmm
    - else:
        Auntie Efua: Fine is not news. #expr:auntie=arms_crossed #focus:auntie
    }
* [Tell her about the twelve malts #flavour:It's only a drink.]
    ~ told_malt = true
    ~ score(-4, 0, 4)
    Nana: Daddy bought a whole crate of malt, Auntie. Twelve. Under his bed. #expr:child=happy #focus:child
    Auntie Efua: TWELVE! Esi! Then I am coming for Christmas! #expr:auntie=delight #anim:auntie=jump #focus:auntie
    Mummy closes her eyes like someone saying a very short prayer. #expr:mum=eyesclosed #focus:mum
    #moment:twelve_malts/Twelve Malts
- -> walk_home

= walk_home
Across the compound. Mummy, the empty bowl, and you. #scene:compound #light:afternoon #cast:child,mum #cam:wide #amb:compound #focus:none
{
- cooks_better == "auntie":
    Mummy: So. Efua cooks better. #expr:mum=flat #focus:mum
    Nana: Mummy, I was being polite... #expr:child=worried #focus:child
    Mummy: Then tonight, you can be polite in Efua's house. For dinner. #expr:mum=stern #focus:mum
- cooks_better == "both":
    Mummy: Different angels. Hmm. Where did you learn that? #expr:mum=approve #focus:mum
    Nana: From you, Mummy. #expr:child=smug #focus:child
    Mummy almost smiles. #emote:mum=heart
- cooks_better == "daddy":
    Mummy: Boiled eggs. I will tell your father. He will be so proud. #expr:mum=laugh #focus:mum
- cooks_better == "mummy":
    Mummy puts her arm around your shoulders. She does not say anything. She does not need to. #expr:mum=approve #focus:mum #emote:child=heart
- else:
    Mummy: The politician. Next time, swallow before you come home. #expr:mum=side_eye #focus:mum
}
{told_malt:
    Mummy: And now Efua knows about the malt. Which means the whole of Accra knows about the malt. #expr:mum=stern #focus:mum
}
That evening, Daddy checks under his bed. Daddy counts. #focus:none #emote:child=dots #sfx:heartbeat
-> ep12
