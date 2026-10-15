// =====================================================================
//  EPISODE THREE — THE ERRAND
//  Tuesday after school. Five thousand cedis, a list of four things,
//  Sister Akos's kiosk, Kojo, and a compound where news travels faster
//  than electricity.
// =====================================================================

=== ep3 ===
#episode:3 #scene:hall #light:day #cast:mum,child,dad #cam:wide #amb:hall #prop:tv=off #prop:lamp=off
#card:Episode Three/The Errand/Tuesday, after school · 4:30 PM
Tuesday, after school. Mummy is making light soup, and Daddy is reading the Daily Graphic as if the newspaper owes him money. #expr:dad=focused #expr:mum=neutral #expr:child=neutral
Mummy: Nana! Come. #focus:mum
"Come" is the most dangerous word in a Ghanaian home. It can mean food. It can mean trouble. Today, it means an errand. #focus:none
Mummy: I need you to go to Sister Akos's kiosk for me.
{approval >= 60:
    ~ trusted = true
    Mummy hands you a five-thousand cedi note. It is the most money you have ever held. It is still warm from her purse. #emote:child=sparkle #expr:child=delight
- else:
    Mummy looks at the five-thousand cedi note. Then at you. Then at Daddy. #expr:mum=sideeye
    Mummy: Daddy, should we send this one?
    Daddy: The child must learn. #expr:dad=focused #focus:dad
    He does not lower the newspaper. #focus:none
    Mummy folds the note twice, presses it into your palm, and closes your fingers around it like a secret. #expr:mum=flat #expr:child=worried
}
Mummy: Listen well. One tin of milk. One loaf of tea bread. One small packet of sugar. And a box of matches. #focus:mum #expr:mum=flat
Mummy: And bring my change. All of it.
* [Repeat the list back to her #flavour:Milk, bread, sugar, matches...]
    ~ has_list = true
    ~ score(3, 4, 0)
    Nana: Milk. Tea bread. Sugar, the small one. Matches. And your change. #focus:child
    Mummy: Good. #expr:mum=proud #focus:none
* [Say "I know, Mummy!" and run #flavour:How hard can it be?]
    ~ score(0, 0, 2)
    Nana: I know, Mummy! #anim:child=bounce #sfx:whoosh
    You are already at the door. The list is already leaving your head. #focus:none
* {antenna == "foil" || smarts >= 45} [Write it on the back of a calendar page #flavour:Engineers keep records.]
    ~ has_list = true
    ~ score(4, 6, 0)
    You tear last month's page off Daddy's calendar and write the list on the back in pencil. #emote:child=sparkle #cam:calendar
    #moment:calendar_list/Minutes of the Meeting
    Daddy lowers his newspaper just far enough to look impressed. #expr:dad=proud #cam:wide
- Daddy: And Nana, come straight back. Don't stand there conversing with Kojo. #focus:dad #expr:dad=flat
-> compound

= compound
#scene:compound #light:afternoon #cast:child,kojo #cam:wide #amb:compound #focus:none
Outside, the compound is busy. Somebody is sweeping. Somebody is washing. Somebody's radio is playing highlife loud enough for everybody. #expr:child=neutral
Kojo from next door is rolling an old bicycle tyre with a stick, the way a king drives a chariot. #expr:kojo=happy #anim:kojo=bounce
Kojo: Chale! Where are you going?
Nana: Sister Akos. Mummy's errand.
{
- tv_reaction == "comment" || tv_reaction == "laugh":
    Kojo: Ei, it's the film critic! My mother heard it from Auntie Efua. #expr:kojo=laugh
    Even Kojo knows. Kojo's mother knows. By now, the goats probably know. #emote:child=sweat #expr:child=worried
- tv_reaction == "eyes":
    Kojo: Ah, the holy one! My mother says you close your eyes for kissing like a pastor. #expr:kojo=laugh
    It is not as much of a compliment as it sounds. #emote:child=dots
}
Kojo: I'm coming with you. Maybe Sister Akos will dash us something. #expr:kojo=delight
"Dash" means to give for free. Kojo believes in miracles.
-> kiosk

= kiosk
#cam:kiosk #cast:child,akos,kojo #light:afternoon
Sister Akos's kiosk is a blue metal box with a window. Across the top, in big yellow letters: GOD'S TIME IS THE BEST. #expr:akos=focused
{tv_reaction == "water":
    You said those exact words to Mummy on Sunday night. You feel strangely powerful. #expr:child=smug
}
Inside, Sister Akos is listening to a radio drama with her whole body. #sfx:radio
Sister Akos: Ah, Nana! Mummy's errand? What do you want, my dear? #expr:akos=happy #focus:akos
{has_list:
    You check your list. Four things. Easy. #focus:none #expr:child=happy
- else:
    You try to remember Mummy's list. It was... four things? Probably four things. #focus:none #expr:child=worried #emote:child=question
}
-> shop

= shop
#cam:shelf
- (shelf)
* [Tin of milk #hotspot:milk]
    ~ bought_milk = true
    ~ total += 800
    Sister Akos puts a tin of evaporated milk on the counter. #sfx:pop
    -> shelf
* [Loaf of tea bread #hotspot:bread]
    ~ bought_bread = true
    ~ total += 1200
    One loaf of tea bread, still soft. You resist the urge to squeeze it. #sfx:pop
    -> shelf
* [Small packet of sugar #hotspot:sugar]
    ~ bought_sugar = true
    ~ total += 900
    One small packet of sugar. #sfx:pop
    -> shelf
* [Box of matches #hotspot:matches]
    ~ bought_matches = true
    ~ total += 100
    One box of matches. Small, but very important in a year like this one. #sfx:pop
    -> shelf
* [Toffees #hotspot:toffee]
    ~ bought_toffee = true
    ~ total += 200
    Kojo: Yes! Toffee! #expr:kojo=delight #anim:kojo=jump
    Toffees were not on the list. Kojo insists they were spiritually on the list. #sfx:pop
    -> shelf
* [Candles #hotspot:candles]
    ~ bought_candles = true
    ~ total += 300
    Mummy didn't say candles. But the lights have gone off three times this week... #sfx:pop #emote:child=sparkle
    -> shelf
+ [That's everything, Sister Akos #flavour:Pay and go home.]
    -> pay

= pay
#cam:counter
{total == 0:
    Sister Akos: Nothing? You came all this way to buy nothing? #expr:akos=shock
    Kojo: We came to visit you, Sister Akos. #expr:kojo=smug
    Sister Akos: Hmm. Go and ask your mummy what she wants, and come back. #expr:akos=flat
    You run home, ask again, and run back. Mummy's face during this conversation will stay with you for some time. #sfx:whoosh #expr:child=sad
    ~ score(-6, 0, 4)
    ~ bought_milk = true
    ~ bought_bread = true
    ~ bought_sugar = true
    ~ bought_matches = true
    ~ total = 3000
}
Sister Akos adds it up on the edge of an old newspaper. Her lips move. Her pencil moves. The radio drama reaches a very exciting part. #expr:akos=focused
Sister Akos: That's ₵{cedis(total)}. #focus:akos
You hand her the five-thousand cedi note. #focus:none #sfx:coin
Sister Akos counts out your change without taking her eyes off the radio. #sfx:coin
Sister Akos: Your change. Greet Mummy for me, eh.
You look at the notes in your hand. Then you count again. #cam:counter #expr:child=stare #focus:child
She has given you ₵{cedis(6000 - total)}. It should be ₵{cedis(5000 - total)}. #sfx:sting
Sister Akos has given you one thousand cedis too much. #expr:child=shock
Kojo sees it too. Kojo sees everything that involves money. #focus:kojo #expr:kojo=delight #emote:kojo=sparkle
Kojo: Chale... bofrot money.
Bofrot are big, sweet, deep-fried doughnuts, and the bofrot woman across the road has just brought out a fresh basket. #focus:none
* [Tell Sister Akos she gave you too much #flavour:Honesty. Even with Kojo watching.]
    -> return_change
* {smarts >= 50} [Count the change out loud, slowly, until she notices #flavour:Let her catch her own mistake.]
    -> count_aloud
* [Spend it on bofrot for you and Kojo #flavour:Nobody will ever know. Right?]
    -> bofrot
* [Say nothing. Take it home and let Mummy decide #flavour:Not your money. Not your decision.]
    -> take_home

= return_change
~ change = "returned"
~ score(10, 4, 0)
Nana: Sister Akos, you gave me too much. #focus:child
Sister Akos turns the radio down. She has never done that in living memory. #sfx:radiooff #focus:none
She counts. She counts again. She puts her hand on her chest. #expr:akos=shock
Sister Akos: Ei! This radio drama will finish me. God bless you, Nana! #expr:akos=delight #emote:akos=heart
She drops a toffee into your hand. Then, after looking at Kojo's face, one more into his.
#moment:honest_change/Honest Change
Kojo: ...Sunday School. #expr:kojo=flat
Kojo will call you "Sunday School" for the rest of the week. It is a price you can afford.
-> walk_back

= count_aloud
~ change = "returned"
~ counted_aloud = true
~ score(8, 12, 0)
You start counting, loudly and slowly, like a bank manager. #anim:child=bounce #expr:child=smug
Nana: One thousand... two thousand... hmm... ₵{cedis(6000 - total)}. Hmm. #focus:child
Sister Akos's head turns away from the radio. Slowly. #focus:akos #expr:akos=stare
Sister Akos: Wait. That's too much. Ei! Nana, give me that! #expr:akos=shock #anim:akos=jump
She takes back the extra note, laughing at herself. #expr:akos=laugh #focus:none
Sister Akos: You are counting like a bank manager! One day you will manage my kiosk!
#moment:bank_manager/The Bank Manager
Kojo cannot even be angry. He is too impressed. #expr:kojo=shock
-> walk_back

= bofrot
~ change = "spent"
~ kojo_friend = true
~ score(-8, 2, 14)
You and Kojo cross the road to the bofrot woman like two businessmen with a plan. #sfx:whoosh #cam:road
Ten bofrot. Warm. Sugary. Glorious. #emote:kojo=heart #expr:child=happy #expr:kojo=delight
#note:Nobody will ever know. Right?
Kojo: You are my best friend. My real best friend. #focus:kojo
You count Mummy's change one last time. ₵{cedis(5000 - total)}. Exactly right. Nobody will ever know. #focus:none #sfx:sting
#moment:bofrot_economy/The Bofrot Economy
Somewhere in the compound, a door opens. You do not notice. You should have noticed.
-> walk_back

= take_home
~ change = "home"
~ score(4, 8, 0)
You fold all the money carefully and put it deep in your pocket. #expr:child=focused
{pocketed:
    Next to it, something crunches. Yesterday's biscuit. You had forgotten. It had not forgotten you. #emote:child=sweat
}
Kojo: You're not going to buy anything? Not even ONE bofrot? #expr:kojo=shock #focus:kojo
Nana: It's not my money.
Kojo: It's not Mummy's money either! #expr:kojo=flat
He has a point. You hate that he has a point. #focus:none #emote:child=dots
-> walk_back

= walk_back
#cam:gate #cast:child,auntie,kojo #light:afternoon #focus:none
On the way back, Auntie Efua is standing at her gate with a broom in one hand and an empty cup in the other. #expr:auntie=happy #expr:child=neutral
{auntie_tv_fixed:
    Auntie Efua: My engineer! My television is still perfect! I watched the news AND the weather! #expr:auntie=delight
}
{heard_london:
    Auntie Efua: Nana! Another letter came from Kwabena. I told him a clever child asked about his snow. #emote:auntie=heart #expr:auntie=proud
}
{pocketed:
    -> pocket ->
}
Auntie Efua: You went to Akos? Please, pour small sugar into this cup for me. My tea is crying. I'll give your mummy back. #focus:auntie
It is the sugar Mummy is waiting for. Auntie Efua is an elder, and you do not refuse an elder. You also do not come home with less sugar. #focus:none #emote:child=sweat
{not bought_sugar:
    There is only one problem. You did not buy any sugar. #expr:child=shock
    Nana: Auntie... I forgot the sugar.
    Auntie Efua: You forgot the sugar? Then what will your mummy put in her tea? #expr:auntie=shock
    Auntie Efua: Go back, go back! And bring me some too, since you are going. #expr:auntie=laugh
    You go back to Sister Akos for sugar. Twice the walking. Half the dignity. #sfx:whoosh
    ~ bought_sugar = true
    ~ sugar = "gave"
    ~ score(-3, 0, 2)
    -> home
}
* [Pour her some sugar. She is an elder #flavour:Respect first. Explanations later.]
    ~ sugar = "gave"
    ~ score(4, 0, 3)
    You pour sugar into Auntie Efua's cup. She watches the sugar the way Kojo watches money. #sfx:pop
    Auntie Efua: God bless you! Tell your mummy, eh. I'll give it back. #expr:auntie=delight
    She will not give it back. Everybody in the compound knows she will not give it back.
* [Say you must ask Mummy first #flavour:Polite. Careful. Possibly cowardly.]
    ~ sugar = "ask"
    ~ score(2, 6, 0)
    Nana: Auntie, let me ask Mummy first. It's her sugar.
    Auntie Efua: Hmm! Clever child. Okay, go and ask. Tell her it's for Efua. #expr:auntie=smug
* [Say you didn't buy any sugar #flavour:The packet is sticking out of the bag.]
    ~ sugar = "lied"
    ~ score(-8, 0, 8)
    Nana: Sorry, Auntie. I didn't buy sugar.
    Auntie Efua looks at the sugar packet sticking out of your bag. Then at you. #expr:auntie=sideeye #focus:auntie
    Auntie Efua: Then what is that? Snow? #expr:auntie=smug
    #moment:snow_sugar/Then What Is That? Snow?
    She takes two spoonfuls anyway, laughing all the way back to her tea. #expr:auntie=laugh #focus:none
- -> home

= pocket
Auntie Efua: And Nana... yesterday, when you came, I had twelve biscuits on that tray. #expr:auntie=sideeye #focus:auntie #cam:gate_close
Auntie Efua: When you left, I counted.
{rearranged:
    Auntie Efua: The circle was perfect. Too perfect. Eleven biscuits pretending to be twelve.
}
Your hand moves to your pocket. The biscuit is still there. It is now mostly crumbs. #focus:none #emote:child=sweat #expr:child=worried #sfx:sting
* [Confess and hand over the crumbs #flavour:A crushed biscuit and a clean conscience.]
    ~ pocket_outcome = "confessed"
    ~ score(8, 0, -6)
    You take out the biscuit. What is left of it. #anim:child=slump #expr:child=sad
    Nana: I'm sorry, Auntie. I took it.
    Auntie Efua stares at the crumbs. Then she laughs so hard she has to hold the gate. #expr:auntie=laugh #anim:auntie=shake
    #moment:crumbs/Confession in Crumbs
    Auntie Efua: Keep it, keep it! Next time, just ASK. Ah, this child! #emote:auntie=heart
* [Blame a rat #flavour:Accra has many rats.]
    ~ pocket_outcome = "rat"
    ~ score(-6, 2, 8)
    Nana: Maybe it was a rat, Auntie.
    Auntie Efua: A rat. A rat with pockets? #expr:auntie=sideeye #focus:auntie
    #moment:rat/A Rat With Pockets
    Auntie Efua: Hmm. We will see what this rat tells its mother. #expr:auntie=smug #focus:none
* [Look at Kojo #flavour:He's right there. He always looks guilty anyway.]
    ~ pocket_outcome = "kojo"
    ~ kojo_betrayed = true
    ~ score(-4, 0, 10)
    You look at Kojo. Auntie Efua looks at Kojo. Kojo looks at the sky. #focus:kojo
    Kojo: ME? I wasn't even there! #expr:kojo=shock #anim:kojo=jump
    Auntie Efua: Hmm. #expr:auntie=sideeye #focus:none
    Kojo will remember this. Kojo has a long memory and a bicycle tyre.
- ->->

= home
#scene:hall #light:day #cast:mum,child,dad #cam:table #amb:hall #focus:none
You put the bag on the table. Mummy looks inside. #expr:mum=flat #expr:child=neutral #expr:dad=focused
~ temp listed = 0
{bought_milk:
    ~ listed++
}
{bought_bread:
    ~ listed++
}
{bought_sugar:
    ~ listed++
}
{bought_matches:
    ~ listed++
}
{listed == 4:
    Mummy: Milk. Bread. Sugar. Matches. Good. #expr:mum=proud
    ~ score(5, 0, 0)
- else:
    Mummy: Milk... bread... #expr:mum=sideeye
    {not bought_milk:
        Mummy: And where is my milk? What will I put in Daddy's tea? #expr:mum=angry
    }
    {not bought_bread:
        Mummy: Where is the bread? Are we eating the bag?
    }
    {not bought_matches:
        Mummy: And the matches? When the light goes off tonight, how will I light the lamp? With my eyes? #expr:mum=angry
    }
    ~ score(-6, 0, 4)
    Mummy: Four things, Nana. Four. #emote:mum=anger
}
{bought_candles:
    Mummy: Candles? I didn't ask for candles. #expr:mum=sideeye
    {bought_matches:
        Daddy: Ah, but the light is going off again tonight. That is thinking ahead. #expr:dad=proud #focus:dad
        Mummy: Hmm. Clever. But next time, ask. #expr:mum=smile #focus:none
        ~ score(0, 5, 0)
    - else:
        Mummy: Candles, but no matches. So we will light them with prayer? #expr:mum=flat
        ~ score(0, 0, 3)
    }
}
{bought_toffee:
    Mummy: And who asked for toffee? #expr:mum=sideeye
    Nana: Kojo said it was spiritually on the list.
    Mummy: Kojo is not your mother. #expr:mum=flat
}
Then Mummy takes out the change. She counts it. Slowly. Note by note. #cam:push #light:tension #focus:mum #sfx:coin #expr:mum=focused
Daddy lowers his newspaper. #expr:dad=stare #sfx:coin
Nobody breathes. #auto:1600 #sfx:coin
{
- change == "returned":
    Mummy: ...₵{cedis(5000 - total)}. Correct. #expr:mum=neutral #sfx:good #light:day
    There is a knock at the door. #sfx:knock #focus:none
    Auntie Efua: Esi! Have you heard? Akos says your child gave back her money! A whole thousand cedis! #cast:mum,child,dad,auntie #expr:auntie=delight
    {counted_aloud:
        Auntie Efua: She says this child counts like a bank manager!
    }
    It took less than one hour for the news to travel from the kiosk, to Auntie Efua, to your own hall. It got here before you could even tell it. #cam:wide
    Mummy doesn't say anything. She just puts her hand on your head for a moment. That's all. It's enough. #expr:mum=proud #expr:child=happy #emote:mum=heart
    ~ score(10, 0, 0)
- change == "spent":
    Mummy: ...₵{cedis(5000 - total)}. Correct. Good. #expr:mum=happy #light:day
    You breathe out. You got away with it. #expr:child=smug #focus:none
    There is a knock at the door. #sfx:knock
    Kojo's Mother: Esi! Thank you oo, for the bofrot your child bought my Kojo! Ten bofrot! You people are rich now! #sfx:sting
    Mummy turns. Slowly. Like the standing fan. #expr:mum=angry #focus:mum #fx:impact #emote:mum=anger
    #moment:everybody_knows/Everybody Knows Everything
    Mummy: Which bofrot? With which money? #expr:child=shock
    {kojo_betrayed:
        Kojo's Mother: And Kojo says your child blamed him for a biscuit! A biscuit, Esi! #expr:mum=angry
    }
    The next ten minutes are not suitable for this report. You will be doing the dishes until you are thirty. #focus:none #expr:child=sad #anim:child=slump
    ~ score(-10, 0, 12)
- else:
    You put all the money on the table. Every note. #focus:none #light:day
    Nana: Sister Akos gave me too much. I didn't know what to do, so I brought it.
    Mummy looks at the extra note for a long time. #expr:mum=stare #focus:mum
    Mummy: You should have told her there and then. #expr:mum=flat
    Mummy: But you didn't spend it. And you didn't hide it. #expr:mum=smile
    Mummy: Tomorrow morning, you will take it back to her yourself.
    Daddy, from behind the newspaper: That's my child. #expr:dad=proud #focus:none
    ~ score(6, 0, 0)
}
{
- sugar == "gave":
    Mummy lifts the sugar packet and weighs it in her hand. #expr:mum=sideeye
    Mummy: This sugar is... light.
    Nana: Auntie Efua borrowed some.
    Mummy: Efua! #expr:mum=flat
    Daddy laughs so hard the newspaper shakes. #expr:dad=laugh
- sugar == "ask":
    Nana: Mummy, Auntie Efua wants some sugar. I said I'd ask you first.
    Mummy: You asked first? Good. Take her this cup. Efua and her tea. #expr:mum=smile
    ~ score(4, 2, 0)
- sugar == "lied":
    Mummy: And Efua says you told her you didn't buy sugar. #expr:mum=sideeye
    Mummy: She also says my sugar is now called snow. #expr:dad=laugh
    ~ score(-2, 0, 2)
}
{
- pocket_outcome == "confessed":
    Mummy: And Efua told me about a certain biscuit. #expr:mum=sideeye #focus:mum
    Mummy: She also said you were honest about it. I don't know whether to scold you or praise you.
    Daddy: Do both. It's Tuesday. #expr:dad=smug #focus:none
- pocket_outcome == "rat":
    Mummy: Efua says she has a rat. A rat that steals biscuits and has pockets. Do you know this rat? #expr:mum=sideeye #focus:mum
    You do know this rat. #expr:child=worried #focus:none
    ~ score(-4, 0, 4)
- pocket_outcome == "kojo" && change != "spent":
    Mummy: And why is Kojo's mother telling everybody that you blamed Kojo for a biscuit? #expr:mum=angry #focus:mum
    ~ score(-4, 0, 4)
}
#focus:none #cam:wide
-> lights_back

= lights_back
#light:blackout #cast:mum,child,dad #cam:wide #amb:night #prop:tv=off #prop:lamp=on
That night, the light goes off again, right on time. The family sits in the hall by the kerosene lamp, sweating politely. #expr:mum=neutral #expr:dad=neutral #expr:child=neutral #light:lamp
And then... #auto:1400
The fan coughs. The bulb flickers. #sfx:powerup #light:evening #prop:lamp=off
Neighbour: LIGHT! The light has come! #fx:flash
Everybody in the compound cheers at the same time, like Ghana has scored a goal. #sfx:cheer #expr:child=delight
Daddy is at the television before anybody else can move. #anim:dad=bounce #expr:dad=delight #prop:tv=snow #cam:tv
{
- antenna == "foil":
    Mummy's Christmas foil is still on the antenna. The picture is perfect. #prop:tv=film
    Mummy: My foil is working harder than everybody in this house. #expr:mum=smug
- antenna == "held":
    Daddy: Nana. Antenna. #expr:dad=flat
    You take your position. The snow clears. You have accepted your destiny. #prop:tv=film #anim:child=jump
- else:
    The screen is pure snow. Mummy reaches out, touches the antenna with one finger, and sits back down. #prop:tv=film #anim:mum=lean
    Mummy: Hmm. #expr:mum=smug
}
TV: Maria... I have crossed seven oceans to find you. #amb:film #light:film #cam:tv
GTV is repeating Sunday's episode. #sfx:sting
Everybody in the hall freezes. #cam:sofa #expr:mum=stare #expr:dad=stare #expr:child=stare
Daddy looks at Mummy. Mummy looks at Daddy. Then they both look at you. #expr:mum=sideeye #expr:dad=sideeye #focus:none
{trusted || approval >= 60:
    ~ has_remote = true
    Daddy holds out the remote control. Still in its plastic. #focus:dad #emote:dad=sparkle #cam:remote
    Daddy: Nana. You know what to do. #expr:dad=focused
    #note:The remote control. Six years of plastic. Yours, for one night.
}
TV: Ricardo... there are only five oceans. #focus:none #cam:tv
The music swells. Ricardo leans closer. #cam:push #light:tension #sfx:romance #timer:9
* {has_remote} [Change the channel to the news #flavour:Water levels at Akosombo. Thrilling.]
    -> f_news
* [Close your eyes. You're a professional now #flavour:You know the drill.]
    -> f_eyes
* [Laugh. It's even funnier the second time #flavour:You've earned this one.]
    -> f_laugh
* {antenna == "held" || antenna == "foil"} [Reach for the antenna #flavour:You know exactly which rod.]
    -> f_antenna
* {has_remote} [Hand the remote to Mummy #flavour:Let the real boss decide.]
    -> f_mummy
* [Freeze #timeout #flavour:Become furniture. Again.]
    -> f_froze

= f_news
~ finale = "news"
~ score(6, 8, 0)
You press the button through the plastic. Once, firmly. #prop:tv=news #sfx:click #cam:tv
The newsreader appears, talking about the water level at Akosombo. It is the most beautiful thing you have ever seen. #light:film
Daddy: Very educational. #expr:dad=proud #cam:sofa
Mummy: Very educational. #expr:mum=proud
#moment:remote_control/Master of the Remote
-> laughter

= f_eyes
~ finale = "eyes"
~ score(6, 4, 0)
You close your eyes. Calmly. Professionally. Like you have done this before. #expr:child=eyesclosed #cam:sofa
{tv_reaction == "eyes":
    Daddy: Again? Somebody give this child a certificate. #expr:dad=laugh
- else:
    Mummy: Hmm. Now you know. #expr:mum=proud
}
-> laughter

= f_laugh
~ finale = "laugh"
~ score(2, 0, 6)
You laugh. You can't help it. #expr:child=laugh #anim:child=shake #cam:sofa
{tv_reaction == "laugh" || tv_reaction == "comment":
    On Sunday, this exact laugh got you sent inside. Tonight...
}
Daddy laughs. He tries not to. He fails. #expr:dad=laugh #anim:dad=shake
Mummy: Akola bone... #expr:mum=laugh
But she is laughing when she says it. #anim:mum=shake
#moment:akola_bone/Akola Bone, Lovingly
-> laughter

= f_antenna
~ finale = "antenna"
~ score(4, 6, 2)
You reach for the antenna. One small push. #anim:child=lean #prop:tv=snow #sfx:static #light:snow
The kiss dissolves into snow.
Daddy: NANA! #expr:dad=shock #anim:dad=jump
Mummy is holding her stomach. Mummy is laughing so hard that no sound is coming out. #expr:mum=laugh #anim:mum=shake
{mummy_knows:
    She saw through your thirst on Sunday. She sees through this too. And now Daddy knows.
}
#moment:snowstorm/Snowstorm, On Purpose
-> laughter

= f_mummy
~ finale = "mummy"
~ score(8, 6, 0)
You hand the remote to Mummy. #cam:sofa
Mummy does not even look down. One press, through the plastic. The channel changes instantly. #prop:tv=news #sfx:click #expr:mum=smug
Daddy stares at the remote, then at Mummy, as if she has performed a miracle. #expr:dad=shock
Mummy: Some of us know where the buttons are. #expr:mum=smug
#moment:real_boss/The Real Boss
-> laughter

= f_froze
~ finale = "froze"
~ score(0, 0, 4)
Nobody moves. Nobody breathes. The kiss lasts for what feels like four business days. #expr:child=stare #expr:mum=stare #expr:dad=stare #auto:2400
When it finally ends, all three of you exhale at the same time. #prop:tv=film
-> laughter

= laughter
Then somebody snorts. Nobody knows who started it. #light:evening #cam:wide #sfx:good
For a moment, everybody in the hall is laughing. Daddy. You. Even Mummy. Especially Mummy. #expr:mum=laugh #expr:dad=laugh #expr:child=laugh
Then, click. #sfx:powercut #light:blackout #prop:tv=off #amb:night
The light is gone again. #auto:1400
Everybody: EI! #fx:shake
In the dark, somebody is still laughing. You can't tell who. It might be Mummy. #expr:mum=laugh
{bought_candles && bought_matches:
    Mummy: Nana. Where are those candles you bought? #focus:mum
    You hand them over with great dignity. #prop:lamp=on #light:lamp #focus:none
    Daddy: Engineer! #expr:dad=delight
    #moment:prepared/Prepared for Darkness
    ~ score(4, 4, 0)
}
In a Ghanaian household, even the smallest decision can become everybody's business. #cam:lamp
But some of them become family stories. #sfx:title
-> report
