// =====================================================================
//  EPISODE FOUR: THE SCIENCE HOMEWORK
//  The next Sunday, 6:40 PM. On Friday Madam said: one seedling, in a
//  tin, for the school farm, on Monday. Nana remembers now. Daddy
//  remembers his village. Mummy counts her peppers. Auntie Efua
//  counts everything.
// =====================================================================

=== ep4 ===
#episode:4 #scene:hall #light:evening #cast:mum,child,dad #cam:wide #amb:hall #prop:tv=off #prop:lamp=off #prop:keyhole=off #outfit:child=none #outfit:friend=none
#card:Episode Four/The Science Homework/The next Sunday · 6:40 PM
Sunday evening. Uniform ironed. Shoes polished. The week is ready. #expr:child=happy #expr:mum=neutral #expr:dad=read_paper
Mummy: Nana. Your homework. Finished? #focus:mum
Nana: Yes, Mummy! #focus:child #expr:child=proud
Then you remember Friday. #focus:none #insert:agric_exercise_book #cam:push #sfx:sting
EWURADE. #expr:child=panic #sticker:child=ewurade #fx:impact #emote:child=sweat
One seedling. In a tin. Tomorrow morning. #readroom
#hint:Mummy is calm right now. In ten minutes she will be cooking. In an hour, she will be tired.
* [Tell Mummy the truth #flavour:Now, while she is calm.]
    -> tell_mummy
* [Whisper it to Daddy #flavour:He grew up in the village. He knows plants.]
    -> tell_daddy
* [Say nothing. Fix it yourself #flavour:Tonight. Quietly.]
    -> tell_nobody

= tell_mummy
~ homework_told = "mummy"
~ score(6, 0, -2)
Nana: Mummy... Science homework. A seedling, in a tin. For tomorrow. #expr:child=worried
Mummy: Tomorrow. And you are telling me at 6:40 on Sunday? #expr:mum=stern #focus:mum #sticker:mum=hmmm
Mummy: Hmm. At least you told me. #expr:mum=flat
#note:Bad news, delivered early.
Daddy lowers the newspaper. Agriculture has entered the house. #focus:dad #expr:dad=lecture #emote:dad=sparkle
Daddy: A seedling? Leave it to me. #focus:none
-> dig

= tell_daddy
~ homework_told = "daddy"
~ score(2, 1, 0)
You tiptoe to Daddy's chair. #expr:child=sneak
Nana: Daddy. Science homework. A seedling. Tomorrow. Don't tell Mummy. #expr:child=worried
Daddy folds the newspaper. Slowly. Like a general. #expr:dad=lecture #focus:dad
Daddy: In my village, I planted cocoa before I could walk. #emote:dad=sparkle
{antenna == "foil":
    Daddy: My engineer needs a scientist. Come! #expr:dad=delight
}
Mummy: Planted what? #expr:mum=sideeye #focus:mum #sticker:mum=hmmm
Mummy heard everything. Mummy always hears everything. #focus:none
-> dig

= tell_nobody
~ homework_told = "nobody"
~ score(-2, 0, 1)
Nana: All finished, Mummy. #expr:child=happy #emote:child=sweat
Mummy looks at you one second longer than usual. #expr:mum=sideeye #focus:mum
{tv_reaction == "eyes":
    Mummy: My good child. #expr:mum=proud
    Being the good child is very heavy tonight. #focus:none #expr:child=worried
}
#note:A secret with a deadline.
-> alone

// ---- Daddy takes over -------------------------------------------------

= dig
The back corner. Daddy has found a hoe. Daddy has found his youth. #scene:garden #light:dusk #cast:dad@32,child@54,mum@74 #cam:wide #amb:dusk #prop:hole=off #prop:auntie_seedling=on #expr:dad=dig #expr:child=neutral #anim:dad=bounce
Mummy holds the lantern. She did not volunteer. #expr:mum=lantern #insert:hurricane_lantern
Daddy: Agriculture is the backbone of this nation! #expr:dad=lecture #focus:dad
THUNK. THUNK. THUNK. #expr:dad=dig #sfx:dig #fx:shake #focus:none #cam:hole #prop:hole=on
The hole gets bigger. And bigger. #sfx:dig #anim:dad=shake
Mummy: Daddy. Are you planting a tree or burying a car? #expr:mum=sideeye #focus:mum #cam:wide
Daddy: Roots need room! #expr:dad=lecture #focus:dad
Madam will ask who did this homework. #focus:none #readroom
#hint:Daddy is enjoying himself. Madam is not here. But Madam always asks.
* [Let Daddy finish #flavour:"Very good hole, Daddy."]
    ~ hole_by = "daddy"
    ~ score(5, 0, 0)
    Nana: Very good hole, Daddy. #expr:child=happy
    Daddy: You see? Your mother does not understand agriculture. #expr:dad=laugh #focus:dad
    Mummy: I understand that it is dark. #expr:mum=lantern #focus:mum
    #moment:crater/The Crater
    THUNK. #sfx:dig #fx:shake #focus:none
* [Take the hoe. It's YOUR homework #flavour:Madam will ask.]
    ~ hole_by = "me"
    ~ score(4, 2, 0)
    You take the hoe. It is heavier than it looks. #expr:child=dig #expr:dad=shocked #sfx:dig #anim:child=shake
    Daddy: Ah! Small farmer! #expr:dad=proud #focus:dad #sticker:dad=good_child
    Mummy: Good. Let Madam see YOUR blisters. #expr:mum=approve #focus:mum
    #moment:small_farmer/Small Farmer
    #focus:none
* [Remind him: Madam said in a TIN #flavour:Not in the ground.]
    ~ hole_by = "tin"
    ~ score(2, 3, 0)
    Nana: Daddy... Madam said in a tin. #expr:child=comment
    Daddy stops. Looks at the hole. Looks at you. #expr:dad=think #focus:dad #auto:1800
    Mummy laughs so hard the lantern shakes. #expr:mum=laugh #anim:mum=shake #focus:mum #sticker:mum=chale
    Daddy: The hole is for later. When the tree grows, it must go somewhere. #expr:dad=lecture #focus:dad
    #moment:hole_for_later/The Hole Is for Later
    #focus:none
- -> the_seedling

// ---- Nobody knows -----------------------------------------------------

= alone
The back corner. You, an empty milk tin, and the evening. #scene:garden #light:dusk #cast:child #cam:wide #amb:dusk #prop:hole=off #prop:auntie_seedling=on #expr:child=worried
Mummy: Nana! What are you doing outside?
Nana: Fresh air, Mummy! #expr:child=happy
Mummy: Fresh air. Hmm.
-> the_seedling

// ---- The seedling (the main decision) ---------------------------------

= the_seedling
Night falls on the back corner. #light:moon #amb:night #cam:wide #prop:lamp=off
{homework_told != "nobody":
    Daddy: Now. The seedling. Where is the seedling? #expr:dad=lecture #focus:dad
    Nobody answers. There is no seedling. #focus:none #emote:dad=dots
- else:
    A tin. Some earth. No seedling. #emote:child=dots
}
The shops are closed. Madam is not. #expr:child=panic #sfx:heartbeat
Mummy's pepper plants, in their row of tins. #cam:peppers #insert:pepper_plant_tin
Auntie Efua's little orange tree, just over the wall. #cam:wall
A dry mango stick, lying by the gutter. #cam:wide #insert:mango_stick_tin
Tomorrow comes in ten hours. #emote:child=sweat #readroom #timer:12
#hint:Mummy counts her peppers. Auntie Efua counts everything. Madam only counts leaves.
* [Pull up one of Mummy's pepper plants #flavour:She has six. Five is still a lot.]
    -> pepper
* [Borrow Auntie Efua's seedling #flavour:Over the wall. Quietly.]
    -> sneak
* [Plant the mango stick #flavour:It's a tree. It's just resting.]
    -> stick
* [Go and ask Auntie Efua properly #flavour:Knock. Greet. Beg.]
    -> ask
* [Hope it sorts itself out #timeout #flavour:Sleep on it.]
    -> nothing

= pepper
~ seedling = "pepper"
{homework_told == "mummy":
    ~ score(4, 1, 0)
    You look at the peppers. Mummy looks at you looking at the peppers. #expr:mum=side_eye #focus:mum
    Mummy: ...Take one. ONE. And you will water the other five until Christmas. #expr:mum=stern
    #moment:pepper_gift/Mummy's Sacrifice
- else:
    ~ score(-3, 1, 2)
    You choose the smallest one. You apologise to it. #expr:child=dig #sfx:dig
    #moment:pepper_heist/The Pepper Heist
}
Into the tin. It looks surprised. #insert:pepper_plant_tin #focus:none
-> water

= sneak
~ seedling = "auntie"
~ score(-4, 1, 3)
{homework_told != "nobody":
    Mummy goes in to check the soup. Daddy goes in to wash the hole off his hands. #cast:child #expr:child=sneak
}
You tiptoe to the gap in the wall. #cast:child@10 #cam:wall #expr:child=sneak
Crickets. Moonlight. Your heart, louder than both. #sfx:heartbeat
You ease the little tree out of the ground. #prop:auntie_seedling=off #expr:child=dig #sfx:dig
Auntie Efua: WHO IS THERE? #prop:auntie_over_wall=on #fx:impact #expr:child=panic #cam:wall
{trouble >= 35 || pocket_outcome == "rat":
    ~ auntie_caught = true
    ~ score(-2, 0, 2)
    Auntie Efua: Nana?! With my orange tree?!
    Nana: Auntie... it's for Science. Madam said. #expr:child=worried #focus:child
    Auntie Efua: Hmm. Take it. But by tomorrow, the whole compound will know who planted my tree. #focus:none
- else:
    You become a shadow. You become the wall. #expr:child=sneak #focus:child #auto:1800
    Auntie Efua: Hmm. Goats. #focus:none
    She goes in. #prop:auntie_over_wall=off
}
You run. #expr:child=run #sfx:whoosh #focus:none #prop:auntie_over_wall=off
#moment:night_operation/The Night Operation
-> water

= stick
~ seedling = "stick"
~ score(-1, 2, 2)
One dry mango stick. One leaf, holding on for its life. #insert:mango_stick_tin #expr:child=think
You tie the leaf on properly with Mummy's thread. Botany. #expr:child=proud #emote:child=sparkle
{homework_told != "nobody":
    Daddy: ...What is that? #expr:dad=shocked #focus:dad #emote:dad=question
    Nana: A mango tree, Daddy. It's resting. #focus:child
    Daddy decides to believe you. Agriculture is about faith. #expr:dad=think #focus:none
}
#moment:resting_mango/The Resting Mango
-> water

= ask
~ seedling = "asked"
Across the compound, to Auntie Efua's door. At night. #scene:compound #light:moon #cast:child #cam:door #amb:night #transition:iris
Knock knock. #sfx:knock
Auntie Efua: Who is knocking at this hour?! #cast:child,auntie #expr:auntie=arms_crossed #cam:wide
Nana: Good evening, Auntie. Please, I need one seedling. For Science. #expr:child=worried
{said_medaase || greeted == "twi" || auntie_tv_fixed || change == "returned":
    ~ score(8, 1, -3)
    Auntie Efua: Ah! My Nana! For school? Come, come! #expr:auntie=welcome #focus:auntie #emote:auntie=heart
    She digs up her own orange tree, wraps it in newspaper, and gives it to you like a baby. #expr:auntie=offer_biscuits
    Auntie Efua: Tell Madam it is from Auntie Efua. Say my name twice. #expr:auntie=gossip
- else:
    ~ score(5, 1, -2)
    Auntie Efua: A seedling. At night. On Sunday. #expr:auntie=sideeye #focus:auntie #sticker:auntie=hmmm
    You get the seedling. You also get a lecture about planning that lasts as long as a church service. #expr:auntie=point #expr:child=ashamed
}
#moment:asked_properly/Knock, Greet, Beg
By morning, the whole compound knows. #focus:none #sfx:sting
-> water

= nothing
~ seedling = "none"
~ score(-4, 0, 2)
You go to bed. Maybe the seedling will come in a dream. #cast:none #expr:child=eyesclosed #amb:night
It does not come in a dream. #auto:1600
-> morning

= water
Before bed, you water it from Daddy's old milk tin, the one with nail holes in the bottom. #cam:wide #insert:watering_can_tin #sfx:splash #expr:child=happy
-> morning

= morning
Somewhere, a cockerel decides it is Monday. #sfx:rooster #auto:1600
-> monday

// ---- School ------------------------------------------------------------

= monday
The bell. A line of children. A line of tins. #scene:school #light:day #cast:teacher,classmate,child,friend #cam:wide #amb:school #outfit:child=uniform #outfit:friend=uniform #sfx:bell #expr:teacher=inspect #expr:child=neutral #expr:friend=neutral
Madam walks the line like a general. #focus:teacher #cam:line
Kwame: Madam! Mine is a BANANA! #expr:classmate=show_off #anim:classmate=bounce #focus:classmate
Kwame's banana is taller than Kwame. #emote:classmate=sparkle
Madam: Very good. Who helped you, Kwame? #expr:teacher=approve #focus:teacher
Kwame: ...My uncle has a farm, Madam. #expr:classmate=idle #focus:classmate
{friend} holds up a small tin of something green. {fhe} watered it with tea. #focus:friend #expr:friend=proud
Madam stops in front of you. #focus:teacher #expr:teacher=inspect #sfx:heartbeat
{
- seedling == "pepper":
    You hold up the pepper plant. Two red peppers wave at Madam. #insert:pepper_plant_tin #expr:child=proud #focus:child
    Madam: A pepper! Very practical. My soup thanks you. #expr:teacher=approve #focus:teacher #sticker:teacher=very_good #sfx:good
- seedling == "auntie" || seedling == "asked":
    You hold up the little orange tree. It travelled well. #insert:seedling_tin #expr:child=proud #focus:child
    Madam: An orange tree! Excellent. #expr:teacher=approve #focus:teacher #sticker:teacher=very_good #sfx:good
- seedling == "stick":
    You hold up the mango stick. The one leaf trembles. #insert:mango_stick_tin #expr:child=nervous #focus:child
    Madam: ...Nana. What is this? #expr:teacher=stern #focus:teacher
    Nana: A mango tree, Madam. It's resting. #focus:child
    Kwame laughs so hard he drops his banana. #expr:classmate=laugh #anim:classmate=shake #focus:classmate
    Madam: Resting. Then it can rest in my office. #expr:teacher=laugh #focus:teacher
    Madam: SEE ME. #expr:teacher=stern #sticker:teacher=see_me #sfx:bad
- else:
    Your hands are empty. #expr:child=ashamed #focus:child
    Madam: Nana. Where is your seedling? #expr:teacher=stern #focus:teacher
    Nana: It's... coming, Madam. #expr:child=nervous #focus:child
    Madam: SEE ME. #focus:teacher #sticker:teacher=see_me #sfx:bad
}
{seedling == "pepper" || seedling == "auntie" || seedling == "asked":
    -> who_did_it
}
-> home

= who_did_it
Madam: And who did this work? You, or your parents? #expr:teacher=inspect #focus:teacher #readroom
#hint:Madam has taught for twenty years. She has met every father in Accra.
* [All by myself, Madam #flavour:Mostly true. In spirit.]
    ~ credit = "me"
    Nana: All by myself, Madam. #expr:child=proud #focus:child
    {homework_told != "nobody" && hole_by == "daddy":
        ~ score(-4, 0, 2)
        {friend}: Madam! Nana's daddy dug a hole you could bury a car in. The whole compound heard. #expr:friend=comment #focus:friend #anim:friend=bounce
        {kojo_betrayed:
            {friend} has a long memory. Today, it was useful. #expr:friend=smug
        }
        Madam: Hmm. #expr:teacher=stern #focus:teacher #sticker:teacher=hmmm
    - else:
        ~ score(4, 0, 0)
        Madam: Good. #expr:teacher=approve #focus:teacher
    }
* {homework_told != "nobody"} [My Daddy helped me #flavour:Daddy helped a LOT.]
    ~ credit = "daddy"
    ~ score(6, 2, -2)
    Nana: My Daddy helped me, Madam. A lot. #expr:child=happy #focus:child
    Madam: Honest. I like honest. Tell your daddy he also gets VERY GOOD. #expr:teacher=laugh #focus:teacher #sticker:teacher=very_good
    #moment:honest_farmer/An Honest Farmer
* {hole_by == "me"} [Show her your blisters #flavour:Evidence.]
    ~ credit = "blisters"
    ~ score(6, 2, 0)
    You hold out your palms. Two blisters, fresh from the hoe. #expr:child=proud #focus:child
    Madam: These are a farmer's hands. #expr:teacher=approve #focus:teacher #sticker:teacher=very_good
    #moment:farmer_hands/Farmer's Hands
* {seedling == "asked"} [Auntie Efua gave it to me #flavour:Say her name twice.]
    ~ credit = "auntie"
    ~ score(5, 1, 0)
    Nana: Auntie Efua gave it to me. Auntie Efua. #focus:child
    Madam: Efua? Efua from Form Two? We were in school together! #expr:teacher=shocked #focus:teacher
    Madam: Tell her she still owes me two cedis. #expr:teacher=laugh
    #moment:small_accra/Small, Small Accra
- -> home

// ---- Home, Monday evening ---------------------------------------------

= home
That evening. #scene:hall #light:evening #cast:mum,child,dad #cam:wide #amb:hall #outfit:child=none #outfit:friend=none #expr:mum=neutral #expr:dad=read_paper #expr:child=neutral
{
- seedling == "pepper" && homework_told != "mummy":
    Mummy counts her peppers. Five. #expr:mum=wail #focus:mum #sticker:mum=my_pepper #fx:shake
    Mummy: Who has kidnapped my pepper?! #expr:mum=angry
    Nana: Madam said VERY GOOD, Mummy. #expr:child=worried #focus:child
    Mummy: Then Madam can come and grind my pepper for me. #expr:mum=stern #focus:mum
    ~ score(-3, 0, 0)
- seedling == "auntie" && auntie_caught:
    Mummy: Efua says she is now "sponsoring your education". She has told eleven people. #expr:mum=side_eye #focus:mum
    Daddy: Eleven? It's only Monday. #expr:dad=laugh #focus:dad
- seedling == "auntie":
    Auntie Efua, over the wall: Esi! Something has eaten my orange tree. Something with two legs! #sticker:mum=hmmm
    Mummy looks at you. You look at the ceiling. #expr:mum=side_eye #focus:mum #expr:child=worried
    ~ score(-2, 0, 0)
- seedling == "asked":
    Auntie Efua, over the wall: Esi! Your child came to my door at night like a proper citizen! #expr:mum=proud
    Mummy pretends to be modest. She is not modest. #expr:mum=smug #focus:mum
    ~ score(4, 0, 0)
- seedling == "stick":
    Madam has sent a note home. Mummy reads it. Daddy reads it. #expr:mum=stern #expr:dad=think #insert:agric_exercise_book
    Daddy laughs before he can stop himself. Mummy does not. #expr:dad=laugh #expr:mum=flat #focus:dad
- else:
    Madam has sent a note home. Two words. #expr:mum=stern #focus:mum #insert:agric_exercise_book
    Mummy: Next time, you tell me on Friday. #expr:mum=scold
    ~ score(-2, 0, 0)
}
{hole_by == "daddy":
    Daddy: And the hole is ready, for when the tree is ready. #expr:dad=lecture #focus:dad
    Mummy: The hole is ready for somebody to fall in. #expr:mum=flat #focus:mum
}
-> years_later

= years_later
Years later. #scene:school #light:afternoon #cast:none #cam:farm #amb:school #sfx:title
{
- seedling == "pepper":
    The school farm grows the hottest pepper in Accra. Nobody knows where it came from. You know.
- seedling == "auntie" || seedling == "asked":
    There is an orange tree at the back of the school farm. Every year, it fruits. Auntie Efua tells people she planted it.
- seedling == "stick":
    The mango stick never woke up. Madam kept it on her desk for eleven years. She called it "Nana's tree".
- else:
    The next year, you brought two seedlings. One for you. One for whoever forgot.
}
In a Ghanaian household, even the smallest decision can become everybody's business. #cam:wide
But some of them grow into family stories.
-> report
