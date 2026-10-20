// =====================================================================
//  EPISODE THREE: THE ERRAND
//  Tuesday after school. Five thousand cedis, a list of four things,
//  Auntie Efua's provisions cupboard, the friend from next door, and a
//  neighbour who sells milk, sugar, bread, matches... and news.
// =====================================================================

=== ep3 ===
#episode:3 #scene:hall #light:day #cast:mum,child,dad #cam:wide #amb:hall #prop:tv=off #prop:lamp=off #prop:keyhole=off
#card:Episode Three/The Errand/Tuesday, after school · 4:30 PM
Tuesday, after school. Mummy is making light soup, and Daddy is reading the Daily Graphic as if the newspaper owes him money. #expr:dad=read_paper #expr:mum=neutral #expr:child=neutral
Mummy: Nana! Come. #focus:mum
"Come" is the most dangerous word in a Ghanaian home. It can mean food. It can mean trouble. Today, it means an errand. #focus:none
Mummy: Go to Auntie Efua for me. I need provisions.
Auntie Efua sells provisions from the cupboard beside her door: milk, sugar, bread, matches, and news. Mostly news.
{approval >= 60:
    ~ trusted = true
    Mummy hands you a five-thousand cedi note. It is the most money you have ever held. It is still warm from her purse. #emote:child=sparkle #expr:child=delight
- else:
    Mummy looks at the five-thousand cedi note. Then at you. Then at Daddy. #expr:mum=sideeye
    Mummy: Daddy, should we send this one?
    Daddy: The child must learn. #focus:dad
    He does not lower the newspaper. #focus:none
    Mummy folds the note twice, presses it into your palm, and closes your fingers around it like a secret. #expr:mum=flat #expr:child=worried
}
Mummy: Listen well. One tin of milk. One loaf of tea bread. One small packet of sugar. And a box of matches. #focus:mum #expr:mum=scold
Mummy: And bring my change. All of it.
Mummy: And Nana. Efua will ask you questions about this house. You know nothing. You hear me? Nothing. #expr:mum=stern #sticker:mum=hmmm
* [Repeat the list back to her #flavour:Milk, bread, sugar, matches...]
    ~ has_list = true
    ~ score(3, 4, 0)
    Nana: Milk. Tea bread. Sugar, the small one. Matches. My change. And I know nothing. #focus:child
    Mummy: Good. #expr:mum=proud #focus:none
* [Say "I know, Mummy!" and run #flavour:How hard can it be?]
    ~ score(0, 0, 2)
    Nana: I know, Mummy! #anim:child=bounce #expr:child=run #sfx:whoosh
    You are already at the door. The list is already leaving your head. #focus:none
* {antenna == "foil" || smarts >= 45} [Write it on the back of a calendar page #flavour:Engineers keep records.]
    ~ has_list = true
    ~ score(4, 6, 0)
    You tear last month's page off Daddy's calendar and write the list on the back in pencil. #emote:child=sparkle
    #moment:calendar_list/Minutes of the Meeting
    Daddy lowers his newspaper just far enough to look impressed. #expr:dad=proud
- Daddy: And Nana, come straight back. Don't stand there conversing with {friend}. #focus:dad #expr:dad=stern
-> errand

= errand
#scene:compound #light:afternoon #cast:child,friend #cam:wide #amb:compound #focus:none #prop:auntie_tv=snow
{auntie_tv_fixed:
    #prop:auntie_tv=fixed
}
Outside, the compound is busy. Somebody is sweeping. Somebody's radio is playing highlife loud enough for everybody. #expr:child=neutral #expr:friend=happy
{friend} from next door is rolling an old bicycle tyre with a stick, the way a king drives a chariot, with an empty kerosene bottle in the other hand.
{friend}'s Mother: {friend}! Kerosene! Before the light goes! #cast:child,friend,friendmum #expr:friendmum=point
{friend}: I'm going, I'm going! #cast:child,friend #expr:friend=run
{friend}: Chale! Mummy's errand? #anim:friend=bounce #expr:friend=happy #sticker:friend=chale
Nana: Mummy's errand.
{
- tv_reaction == "comment" || tv_reaction == "laugh":
    {friend}: Ei, it's the film critic! My mother heard it from Auntie Efua. #expr:friend=laugh
    Even {friend} knows. {friend}'s mother knows. By now, the goats probably know. #emote:child=sweat #expr:child=worried
- tv_reaction == "eyes":
    {friend}: Ah, the holy one! My mother says you close your eyes for kissing like a pastor. #expr:friend=laugh
    It is not as much of a compliment as it sounds. #emote:child=dots
- else:
    {friend}: My mother sent me for kerosene. And to listen. Mostly to listen. #expr:friend=smug
}
-> provisions

= provisions
Across the compound, to Auntie Efua's door. Again. #scene:auntie #cast:child,auntie,friend #cam:wide #amb:auntie #light:afternoon
Auntie Efua appears with a radio pressed to her ear. A radio drama is playing, and somebody in it is being very wicked. #expr:auntie=gossip #insert:boombox #sfx:radio
Auntie Efua: Ah, Nana! And {friend}! Mummy's errand? Come, come. #expr:auntie=welcome #focus:auntie
{auntie_tv_fixed:
    Auntie Efua: My engineer! My television is still perfect! I watched the news AND the weather! #expr:auntie=delight #sticker:auntie=good_child
}
{heard_london:
    Auntie Efua: And another letter came from Kwabena. I told him a clever child asked about his snow. #emote:auntie=heart #expr:auntie=welcome
}
{pocketed:
    -> pocket ->
}
Auntie Efua: What do you want, my dear? #focus:none #expr:auntie=neutral
{has_list:
    You check your list. Four things. Easy. #expr:child=happy
- else:
    You try to remember Mummy's list. It was... four things? Probably four things. #expr:child=worried #emote:child=question
}
-> shop

= pocket
Auntie Efua: But first. Nana. Yesterday, when you came, I had twelve biscuits on that tray. #expr:auntie=point #focus:auntie #cam:tray
Auntie Efua: When you left, I counted.
{rearranged:
    Auntie Efua: The circle was perfect. Too perfect. Eleven biscuits pretending to be twelve. #expr:auntie=sideeye
}
Your hand moves to your pocket. The biscuit is still there. It is now mostly crumbs. #focus:none #cam:wide #emote:child=sweat #expr:child=worried #sfx:sting #readroom
#hint:Auntie Efua is not angry. Auntie Efua is enjoying this. That is worse, and also better.
* [Confess and hand over the crumbs #flavour:A crushed biscuit and a clean conscience.]
    ~ pocket_outcome = "confessed"
    ~ score(8, 0, -6)
    You take out the biscuit. What is left of it. #anim:child=slump #expr:child=sad
    Nana: I'm sorry, Auntie. I took it.
    Auntie Efua stares at the crumbs. Then she laughs so hard she has to hold the cupboard. #expr:auntie=laugh #anim:auntie=shake
    #moment:crumbs/Confession in Crumbs
    Auntie Efua: Keep it, keep it! Next time, just ASK. Ah, this child! #emote:auntie=heart #sticker:auntie=good_child
* [Blame a rat #flavour:Accra has many rats.]
    ~ pocket_outcome = "rat"
    ~ score(-6, 2, 8)
    Nana: Maybe it was a rat, Auntie.
    Auntie Efua: A rat. A rat with pockets? #expr:auntie=sideeye #focus:auntie #sticker:auntie=hmmm
    #moment:rat/A Rat With Pockets
    Auntie Efua: Hmm. We will see what this rat tells its mother. #expr:auntie=gossip #focus:none
* [Look at {friend} #flavour:Right there. Always looking guilty anyway.]
    ~ pocket_outcome = "kojo"
    ~ kojo_betrayed = true
    ~ score(-4, 0, 10)
    You look at {friend}. Auntie Efua looks at {friend}. {friend} looks at the ceiling. #focus:friend
    {friend}: ME? I wasn't even there! #expr:friend=shock #anim:friend=jump #sticker:friend=ei
    Auntie Efua: Hmm. #expr:auntie=sideeye #focus:none
    {friend} will remember this. {friend} has a long memory and a bicycle tyre.
- ->->

= shop
#cam:showcase #focus:none
- (shelf)
* [Tin of milk]
    ~ bought_milk = true
    ~ total += 800
    Auntie Efua puts a tin of evaporated milk on the table. #sfx:pop
    -> shelf
* [Loaf of tea bread]
    ~ bought_bread = true
    ~ total += 1200
    One loaf of tea bread, still soft. You resist the urge to squeeze it. #sfx:pop
    -> shelf
* [Small packet of sugar]
    ~ bought_sugar = true
    ~ total += 900
    One small packet of sugar. #sfx:pop
    -> shelf
* [Box of matches]
    ~ bought_matches = true
    ~ total += 100
    One box of matches. Small, but very important in a year like this one. #sfx:pop
    -> shelf
* [Toffees]
    ~ bought_toffee = true
    ~ total += 200
    {friend}: Yes! Toffee! #expr:friend=delight #anim:friend=jump #cam:wide
    Toffees were not on the list. {friend} insists they were spiritually on the list. #sfx:pop
    -> shelf
* [Candles]
    ~ bought_candles = true
    ~ total += 300
    Mummy didn't say candles. But the lights have gone off three times this week... #sfx:pop #emote:child=sparkle
    -> shelf
+ [That's everything, Auntie #flavour:Pay and go home.]
    -> pay

= pay
#cam:counter
{total == 0:
    Auntie Efua: Nothing? You came all this way to buy nothing? #expr:auntie=shock #cam:wide
    {friend}: We came to visit you, Auntie. #expr:friend=smug
    Auntie Efua: Hmm. Go and ask your mummy what she wants, and come back. #expr:auntie=arms_crossed
    You run home, ask again, and run back. Mummy's face during this conversation will stay with you for some time. #sfx:whoosh #expr:child=sad
    ~ score(-6, 0, 4)
    ~ bought_milk = true
    ~ bought_bread = true
    ~ bought_sugar = true
    ~ bought_matches = true
    ~ total = 3000
}
Auntie Efua adds it up on the edge of an old newspaper. Her lips move. Her pencil moves. The radio drama reaches a very exciting part. #expr:auntie=focused #cam:wide
Auntie Efua: That's ₵{cedis(total)}. #focus:auntie
You hand her the five-thousand cedi note. #focus:none #sfx:coin
-> gossip_trap

= gossip_trap
Auntie Efua takes the note slowly. Very slowly. Like a woman who has just remembered she has questions. #expr:auntie=gossip #focus:auntie
Auntie Efua: So, Nana... how is everybody at home? Your daddy's car, is it still at the mechanic? #sticker:auntie=hmmm
Auntie Efua: And your mummy, I heard her shouting on Sunday. Was it about the light bill? You can tell me. I'm your Auntie.
Behind her, {friend} is listening so hard that {fhis} ears have moved. #focus:friend #expr:friend=stare
Mummy's voice is in your head: "You know nothing." #focus:none #readroom #light:tension
#hint:Auntie Efua's questions always sound small. Every answer you give will reach three houses before you reach your own.
* [Tell her everything #flavour:She asked so nicely.]
    ~ gossip = "told"
    ~ score(-6, 0, 8)
    You tell her everything. The car. The light bill. The kissing scene. Daddy's snoring. Some things she did not even ask about. #expr:child=comment #light:afternoon
    Auntie Efua's eyes grow bigger with every sentence. #expr:auntie=shocked
    Auntie Efua: Ei! Is that so? Hmm! Hmm! #sticker:auntie=ei
    #moment:correspondent/The Household Correspondent
    She drops two toffees into your hand. News is expensive. You have just been paid. #expr:auntie=delight
* [Say "Everybody is fine, Auntie." #flavour:The official family statement.]
    ~ gossip = "fine"
    ~ score(5, 8, 0)
    Nana: Everybody is fine, Auntie. Thank you. #expr:child=neutral #light:afternoon
    Auntie Efua waits. You wait. The radio drama waits. #expr:auntie=arms_crossed #auto:1600
    Auntie Efua: Hmm. Your mummy has trained you. #expr:auntie=sideeye
    #moment:no_comment/No Comment
    She sounds disappointed. Somewhere across the compound, Mummy sneezes with pride.
* {heard_london || looked_portrait} [Ask about Kwabena in London instead #flavour:Change the subject. Elegantly.]
    ~ gossip = "london"
    ~ score(6, 10, 0)
    Nana: Auntie, how is Kwabena? Is it still snowing in London? #light:afternoon
    Auntie Efua forgets the car. She forgets the light bill. She forgets the radio drama. #expr:auntie=delight #emote:auntie=heart
    Auntie Efua: Ah! Let me tell you about my Kwabena...
    Twelve minutes later, you know the name of every street in London and Kwabena's shoe size. Nobody has said one word about your house.
    #moment:distraction/The Great Distraction
    {friend}: ...Chale. That was professional. #expr:friend=shock
* {smarts >= 50} [Ask what SHE has heard about your house #flavour:Two can play this game.]
    ~ gossip = "spy"
    ~ score(0, 12, 2)
    Nana: Auntie... what have YOU heard? #expr:child=smug #light:afternoon
    Auntie Efua leans in. This is her favourite question in the whole world. #expr:auntie=gossip #focus:auntie
    Auntie Efua: Well. I hear your mummy is planning a surprise. For your daddy's birthday. A cake from the bakery in Osu! But you didn't hear it from me. #sticker:auntie=hmmm
    You now know something Daddy doesn't. This is either a great power or a great danger. #focus:none #emote:child=sparkle
    #moment:double_agent/The Double Agent
- -> counting

= counting
Auntie Efua counts out your change with one eye on you and one ear on the radio. #sfx:coin #expr:auntie=focused #sfx:radio
Auntie Efua: Your change. Greet Mummy for me, eh.
You look at the notes in your hand. Then you count again. #cam:counter #expr:child=stare #focus:child #insert:boombox
She has given you ₵{cedis(6000 - total)}. It should be ₵{cedis(5000 - total)}. #sfx:sting
Auntie Efua has given you one thousand cedis too much. #expr:child=shock
{friend} sees it too. {friend} sees everything that involves money. #focus:friend #expr:friend=delight #emote:friend=sparkle
Outside, right on time, Auntie Akua the bofrot seller comes down the lane. #focus:none
Auntie Akua: Bofrot! Hot bofrot! Fresh from the oil! #sfx:sting
{friend}: Chale... bofrot money.
Bofrot are big, sweet, deep-fried doughnuts, and the basket outside has just been filled. #readroom
#hint:Auntie Efua's mistake. Auntie Efua's cupboard. Auntie Efua's compound. Auntie Efua hears everything, eventually.
* [Tell Auntie she gave you too much #flavour:Honesty. Even with {friend} watching.]
    -> return_change
* {smarts >= 50} [Count the change out loud, slowly, until she notices #flavour:Let her catch her own mistake.]
    -> count_aloud
* [Spend it on bofrot for you and {friend} #flavour:Nobody will ever know. Right?]
    -> bofrot
* [Say nothing. Take it home and let Mummy decide #flavour:Not your money. Not your decision.]
    -> take_home

= return_change
~ change = "returned"
~ score(10, 4, 0)
Nana: Auntie, you gave me too much. #focus:child #cam:wide
Auntie Efua turns the radio down. She has never done that in living memory. #sfx:radiooff #focus:none
She counts. She counts again. She puts her hand on her chest. #expr:auntie=shocked
Auntie Efua: Ei! This radio drama will finish me. God bless you, Nana! #expr:auntie=delight #emote:auntie=heart #sticker:auntie=good_child
She drops a toffee into your hand. Then, after looking at {friend}'s face, one more into {fhis}.
#moment:honest_change/Honest Change
{friend}: ...Sunday School. #expr:friend=flat
{friend} will call you "Sunday School" for the rest of the week. It is a price you can afford.
-> home

= count_aloud
~ change = "returned"
~ counted_aloud = true
~ score(8, 12, 0)
You start counting, loudly and slowly, like a bank manager. #anim:child=bounce #expr:child=smug #cam:wide
Nana: One thousand... two thousand... hmm... ₵{cedis(6000 - total)}. Hmm. #focus:child
Auntie Efua's head turns away from the radio. Slowly. #focus:auntie #expr:auntie=stare
Auntie Efua: Wait. That's too much. Ei! Nana, give me that! #expr:auntie=shocked #anim:auntie=jump
She takes back the extra note, laughing at herself. #expr:auntie=laugh #focus:none
Auntie Efua: You are counting like a bank manager! One day you will run my cupboard!
#moment:bank_manager/The Bank Manager
{friend} cannot even be angry. {friend} is too impressed. #expr:friend=shock
-> home

= bofrot
~ change = "spent"
~ kojo_friend = true
~ score(-8, 2, 14)
You and {friend} walk out through the gate like two businessmen with a plan. #scene:street #light:afternoon #amb:street #cast:child,friend,bofrot #cam:wide #sfx:whoosh
Auntie Akua: Ah! My customers! How many? #expr:bofrot=offer
Nana: Ten, please. #expr:child=proud
Ten bofrot. Warm. Sugary. Glorious. #emote:friend=heart #expr:child=happy #expr:friend=delight #expr:bofrot=laugh
#note:Nobody will ever know. Right?
{friend}: You are my best friend. My real best friend. #focus:friend #sticker:friend=chale
You count Mummy's change one last time. ₵{cedis(5000 - total)}. Exactly right. Nobody will ever know. #focus:none #sfx:sting
#moment:bofrot_economy/The Bofrot Economy
Across the lane, a curtain moves at {friend}'s mother's window. You do not notice. You should have noticed. #sticker:friend=trouble
-> home

= take_home
~ change = "home"
~ score(4, 8, 0)
You fold all the money carefully and put it deep in your pocket. #expr:child=focused #cam:wide
{pocketed && pocket_outcome != "confessed":
    Next to it, something crunches. Yesterday's biscuit. You had forgotten. It had not forgotten you. #emote:child=sweat
}
{friend}: You're not going to buy anything? Not even ONE bofrot? #expr:friend=shock #focus:friend
Nana: It's not my money.
{friend}: It's not Mummy's money either! #expr:friend=flat
{friend} has a point. You hate that {fhe} has a point. #focus:none #emote:child=dots
-> home

= home
#scene:hall #light:day #cast:mum,child,dad #cam:table #amb:hall #focus:none
You put the bag on the table. Mummy looks inside. #expr:mum=flat #expr:child=neutral #expr:dad=read_paper
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
    Mummy: Milk. Bread. Sugar. Matches. Good. #expr:mum=proud #cam:wide
    ~ score(5, 0, 0)
- else:
    Mummy: Milk... bread... #expr:mum=sideeye #cam:wide
    {not bought_milk:
        Mummy: And where is my milk? What will I put in Daddy's tea? #expr:mum=angry
    }
    {not bought_bread:
        Mummy: Where is the bread? Are we eating the bag?
    }
    {not bought_sugar:
        Mummy: No sugar. So the tea will be sweetened with your excuses? #expr:mum=angry
    }
    {not bought_matches:
        Mummy: And the matches? When the light goes off tonight, how will I light the lamp? With my eyes? #expr:mum=angry
    }
    ~ score(-6, 0, 4)
    Mummy: Four things, Nana. Four. #emote:mum=anger #sticker:mum=hmmm
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
    Nana: {friend} said it was spiritually on the list.
    Mummy: {friend} is not your mother. #expr:mum=flat
}
Then Mummy takes out the change. She counts it. Slowly. Note by note. #cam:push #light:tension #focus:mum #sfx:coin #expr:mum=think
Daddy lowers his newspaper. #expr:dad=stare #sfx:coin
Nobody breathes. #auto:1600 #sfx:coin
{
- change == "returned":
    Mummy: ...₵{cedis(5000 - total)}. Correct. #expr:mum=neutral #sfx:good #light:day
    There is a knock at the door. #sfx:knock #focus:none
    Auntie Efua: Esi! Have you heard? Your child gave me back my own money! A whole thousand cedis! #cast:mum,child,dad,auntie #expr:auntie=delight
    {counted_aloud:
        Auntie Efua: Counted it out like a bank manager, right in front of me!
    }
    It took less than one hour for the news to travel from Auntie's cupboard to your own hall. It got here before you could even tell it. #cam:wide
    Mummy doesn't say anything. She just puts her hand on your head for a moment. That's all. It's enough. #expr:mum=approve #expr:child=happy #emote:mum=heart
    ~ score(10, 0, 0)
- change == "spent":
    Mummy: ...₵{cedis(5000 - total)}. Correct. Good. #expr:mum=happy #light:day
    You breathe out. You got away with it. #expr:child=smug #focus:none
    There is a knock at the door. #sfx:knock
    {friend}'s Mother: Esi! Thank you oo, for the bofrot your child bought my {friend}! Ten bofrot! You people are rich now! #sfx:sting #cast:mum,child,dad,friendmum #expr:friendmum=wave
    Mummy turns. Slowly. Like the standing fan. #expr:mum=angry #focus:mum #fx:impact #emote:mum=anger #sticker:mum=trouble
    #moment:everybody_knows/Everybody Knows Everything
    Mummy: Which bofrot? With which money? #expr:child=shock
    {kojo_betrayed:
        {friend}'s Mother: And {friend} says your child blamed {fhim} for a biscuit! A biscuit, Esi! #expr:mum=angry #expr:friendmum=point
    }
    The next ten minutes are not suitable for this report. You will be doing the dishes until you are thirty. #focus:none #cast:mum,child,dad #expr:child=sad #anim:child=slump
    ~ score(-10, 0, 12)
- else:
    You put all the money on the table. Every note. #focus:none #light:day
    Nana: Auntie Efua gave me too much. I didn't know what to do, so I brought it.
    Mummy looks at the extra note for a long time. #expr:mum=stare #focus:mum
    Mummy: You should have told her there and then. #expr:mum=flat
    Mummy: But you didn't spend it. And you didn't hide it. #expr:mum=smile
    Mummy: Tomorrow morning, you will take it back to her yourself.
    Daddy, from behind the newspaper: That's my child. #expr:dad=proud #focus:none
    ~ score(6, 0, 0)
}
{
- gossip == "told":
    Mummy: Nana. Why does Efua know that Daddy's car is still at the mechanic? #expr:mum=side_eye #focus:mum
    Daddy lowers the newspaper all the way. #expr:dad=shocked
    Daddy: And why does she know that I snore? #focus:dad #sticker:dad=ei
    You have no defence. You were the defence. #focus:none #expr:child=sad
    ~ score(-6, 0, 6)
- gossip == "fine":
    Mummy: Efua says you told her "everybody is fine." She was very annoyed. #expr:mum=smile #focus:mum
    Mummy almost smiles. Almost. #expr:mum=proud
    ~ score(4, 2, 0)
- gossip == "london":
    Mummy: Efua says you asked about Kwabena. She is still talking. I could hear her from the kitchen. #expr:mum=smile
    Daddy laughs so hard the newspaper shakes. #expr:dad=laugh
- gossip == "spy":
    Nana: Mummy... Auntie Efua says you're buying Daddy a cake from Osu. #expr:child=smug
    Mummy freezes. #expr:mum=shocked #focus:mum
    Daddy lowers his newspaper. Very slowly. #expr:dad=think #focus:dad
    Daddy: What cake?
    Mummy: ...Nana. Go and bathe. #expr:mum=stern #focus:mum #sticker:mum=hmmm
    ~ score(-2, 4, 2)
}
{
- pocket_outcome == "confessed":
    Mummy: And Efua told me about a certain biscuit. #expr:mum=sideeye #focus:mum
    Mummy: She also said you were honest about it. I don't know whether to scold you or praise you.
    Daddy: Do both. It's Tuesday. #expr:dad=hands_on_hips #focus:none
- pocket_outcome == "rat":
    Mummy: Efua says she has a rat. A rat that steals biscuits and has pockets. Do you know this rat? #expr:mum=sideeye #focus:mum
    You do know this rat. #expr:child=worried #focus:none
    ~ score(-4, 0, 4)
- pocket_outcome == "kojo" && change != "spent":
    Mummy: And why is {friend}'s mother telling everybody that you blamed {friend} for a biscuit? #expr:mum=angry #focus:mum
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
    Mummy: My foil is working harder than everybody in this house. #expr:mum=arms_crossed
- antenna == "held":
    Daddy: Nana. Antenna. #expr:dad=flat
    You take your position. The snow clears. You have accepted your destiny. #prop:tv=film #anim:child=jump
- else:
    The screen is pure snow. Mummy reaches out, touches the antenna with one finger, and sits back down. #prop:tv=film #anim:mum=lean
    Mummy: Hmm. #expr:mum=arms_crossed
}
TV: Maria... I have crossed seven oceans to find you. #amb:film #light:film #cam:tv
GTV is repeating Sunday's episode. #sfx:sting
Everybody in the hall freezes. #cam:wide #expr:mum=stare #expr:dad=stare #expr:child=stare
Daddy looks at Mummy. Mummy looks at Daddy. Then they both look at you. #expr:mum=sideeye #expr:dad=sideeye #focus:none #readroom
{trusted || approval >= 60:
    ~ has_remote = true
    Daddy holds out the remote control. Still in its plastic. #focus:dad #emote:dad=sparkle #insert:tv_remote
    Daddy: Nana. You know what to do. #expr:dad=think
    #note:The remote control. Six years of plastic. Yours, for one night.
}
TV: Ricardo... there are only five oceans. #focus:none #cam:tv
The music swells. Ricardo leans closer. #cam:push #light:tension #sfx:romance #prop:tv=kiss #timer:9
#hint:Same kiss. Same sofa. But this time they are both looking at you, and nobody has cleared their throat. They are waiting to see who you have become.
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
You press the button through the plastic. Once, firmly. #prop:tv=news #sfx:click #cam:tv #insert:tv_remote
The newsreader appears, talking about the water level at Akosombo. It is the most beautiful thing you have ever seen. #light:film
Daddy: Very educational. #expr:dad=approve #cam:wide
Mummy: Very educational. #expr:mum=approve #sticker:mum=good_child
#moment:remote_control/Master of the Remote
-> laughter

= f_eyes
~ finale = "eyes"
~ score(6, 4, 0)
You close your eyes. Calmly. Professionally. Like you have done this before. #expr:child=eyesclosed #cam:wide
{tv_reaction == "eyes":
    Daddy: Again? Somebody give this child a certificate. #expr:dad=laugh
- else:
    Mummy: Hmm. Now you know. #expr:mum=proud #sticker:mum=good_child
}
-> laughter

= f_laugh
~ finale = "laugh"
~ score(2, 0, 6)
You laugh. You can't help it. #expr:child=laugh #anim:child=shake #cam:wide
{tv_reaction == "laugh" || tv_reaction == "comment":
    On Sunday, this exact laugh got you sent inside. Tonight...
}
Daddy laughs. He tries not to. He fails. #expr:dad=laugh #anim:dad=shake
Mummy: Akola bone... #expr:mum=laugh #sticker:mum=akola_bone
But she is laughing when she says it. #anim:mum=shake
#moment:akola_bone/Akola Bone, Lovingly
-> laughter

= f_antenna
~ finale = "antenna"
~ score(4, 6, 2)
You reach for the antenna. One small push. #anim:child=lean #prop:tv=snow #sfx:static #light:snow
The kiss dissolves into snow.
Daddy: NANA! #expr:dad=shock #anim:dad=jump #cam:wide #sticker:dad=ei
Mummy is holding her stomach. Mummy is laughing so hard that no sound is coming out. #expr:mum=laugh #anim:mum=shake
{mummy_knows:
    She saw through your thirst on Sunday. She sees through this too. And now Daddy knows.
}
#moment:snowstorm/Snowstorm, On Purpose
-> laughter

= f_mummy
~ finale = "mummy"
~ score(8, 6, 0)
You hand the remote to Mummy. #cam:wide #insert:tv_remote
Mummy does not even look down. One press, through the plastic. The channel changes instantly. #prop:tv=news #sfx:click #expr:mum=arms_crossed
Daddy stares at the remote, then at Mummy, as if she has performed a miracle. #expr:dad=shock
Mummy: Some of us know where the buttons are. #expr:mum=arms_crossed
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
On Friday, Madam gives Agric homework. You write it down. Then you forget it completely. #sfx:sting
-> ep4
