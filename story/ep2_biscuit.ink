// =====================================================================
//  EPISODE TWO — THE NEIGHBOUR'S BISCUIT
//  Monday afternoon. Auntie Efua's front room: a padlocked telephone,
//  a glass showcase nobody eats from, and one very important tray.
// =====================================================================

=== ep2 ===
#episode:2 #scene:compound #light:afternoon #cast:mum,child #cam:gate #amb:compound #prop:lamp=off
#card:Episode Two/The Neighbour's Biscuit/The next afternoon · 3:15 PM
The next afternoon is hot enough to fry an egg on the compound wall. #expr:mum=flat #expr:child=neutral
Mummy walks you across to Auntie Efua's house, holding your hand a little too tightly.
Mummy: Listen to me. Greet properly. Sit nicely. And do not embarrass me. #focus:mum
{
- tv_reaction == "laugh" || tv_reaction == "comment" || tv_reaction == "froze":
    Mummy: After yesterday's performance, I want to see a different child today. #expr:mum=sideeye
- tv_reaction == "eyes":
    Mummy: Behave the way you behaved yesterday. Auntie Efua should see that I have trained you. #expr:mum=proud
    The pressure of being the good child sits on your shoulders like a school bag full of stones. #expr:child=worried
- tv_reaction == "water":
    Mummy: And today, nobody is going to any kitchen. You will sit where I can see you. #expr:mum=sideeye
- tv_reaction == "antenna":
    Mummy: And don't touch Auntie Efua's television. #expr:mum=smile #emote:mum=sparkle
}
Mummy: Agoo! #sfx:knock #focus:none
Auntie Efua: Amee! Come in, come in!
"Agoo" is how you announce yourself at somebody's door. "Amee" is how they tell you to come in.
#scene:auntie #light:afternoon #cast:mum,child,auntie #cam:door #amb:auntie
Auntie Efua appears in the doorway in a dress so bright it makes the sun look tired. #expr:auntie=delight #anim:auntie=bounce
Mummy squeezes your hand. This is the moment. #expr:mum=flat
* ["Good afternoon, Auntie." #flavour:Polite. Correct. Safe.]
    ~ greeted = "proper"
    ~ score(5, 0, 0)
    Nana: Good afternoon, Auntie.
    Auntie Efua: Good afternoon, my dear! #expr:auntie=happy
* [Greet her in Twi: "Auntie, maaha!" #flavour:Show off a little.]
    ~ greeted = "twi"
    ~ score(9, 4, 0)
    Nana: Auntie, maaha!
    Auntie Efua: Yaa, me ba! Ei! Somebody is teaching this child well! #expr:auntie=delight #emote:auntie=heart
    #moment:maaha/Maaha, Auntie
    Mummy stands a little taller. #expr:mum=proud
* [Wave and head straight for the sofa #flavour:Greetings are for adults.]
    ~ greeted = "forgot"
    ~ score(-10, 0, 7)
    You give a small wave and walk straight towards the sofa. #anim:child=bounce
    Mummy: Nana. #expr:mum=angry #focus:mum
    It is only one word, but it stops you like a wall. #fx:shake #expr:child=shock
    Mummy: Come back here. Greet your Auntie.
    You march back to the door and greet her like a soldier reporting for duty. #anim:child=jump #focus:none
    Nana: Good afternoon, Auntie Efua!
    #moment:soldier/Reporting for Duty
    Auntie Efua: Hihihi! Good afternoon, soldier. #expr:auntie=laugh
- -> welcome

= welcome
Auntie Efua: Ah! Look how big you've grown! #cam:wide #expr:auntie=happy
{
- tv_reaction == "laugh":
    Auntie Efua: And I hear somebody was laughing at the Sunday film! Hihihi! #expr:auntie=laugh
    Mummy: Efua! #expr:mum=shock
- tv_reaction == "comment":
    Auntie Efua: So you are the famous film critic! Your mummy told me everything. #expr:auntie=laugh
    Mummy: Efua! #expr:mum=shock
- tv_reaction == "eyes":
    Auntie Efua: Your mummy says you closed your eyes like a pastor praying. Good child! #expr:auntie=proud
    Mummy pretends to look modest. She is not modest. #expr:mum=smug
- tv_reaction == "water":
    Auntie Efua: Your mummy says you get very thirsty at very convenient times. #expr:auntie=smug
- tv_reaction == "antenna":
    Auntie Efua: Your daddy was complaining this morning. He says you have weak hands. #expr:auntie=smug
    Mummy coughs into her hand. It sounds a lot like a laugh. #expr:mum=smile
- tv_reaction == "froze":
    Auntie Efua: I hear you watched the news like a professor. Very serious child! #expr:auntie=happy
}
It has been less than twenty-four hours. #cam:push #expr:child=shock #emote:child=sweat
In a Ghanaian household, even the smallest decision becomes everybody's business. #sfx:sting
#moment:everybodys_business/Everybody's Business
{antenna == "foil":
    Auntie Efua: And I hear you are an engineer! My own television has been giving me trouble since Easter. #expr:auntie=worried
}
Auntie Efua: Sit, sit! Let me bring you something. #anim:auntie=bounce
#cast:mum,child #cam:wide
She disappears into the kitchen. Mummy settles onto the sofa, which crackles under its plastic cover. #sfx:crinkle
Mummy: Sit down. And do not touch anything. #expr:mum=flat #focus:mum
-> look

= look
You sit. Auntie Efua's front room looks back at you. #focus:none #expr:child=neutral
- (opts)
* [The telephone #hotspot:phone]
    On a lace mat sits Auntie Efua's telephone. A cream one, with a round dial. #cam:phone
    There is a tiny padlock through the first hole of the dial, so nobody can make a call without her permission.
    It is the most secure object in the whole of Accra.
    ** [Give the padlock one tiny tug #flavour:Mummy said don't touch anything.]
        ~ touched_phone = true
        ~ score(-3, 0, 4)
        You give the padlock one tiny tug. #sfx:click
        Mummy: Nana. #expr:mum=angry #emote:mum=anger
        Mummy did not even turn around. Mummy does not need to turn around. #expr:child=shock
    ** [Leave it alone #flavour:Some locks are not for children.]
        ~ score(0, 3, 0)
        You leave it alone. Some locks are not for children. Some locks are not even for husbands.
    -- -> opts
* [The glass showcase #hotspot:showcase]
    A glass cabinet full of shining plates, cups with gold rims, and one ceramic swan. #cam:showcase
    Nobody has ever eaten from these plates. They are for visitors.
    You are a visitor. You are not that kind of visitor. #emote:child=dots
    -> opts
* [The framed photograph #hotspot:portrait]
    ~ looked_portrait = true
    A young man in a very thick coat, standing in front of a red bus, smiling like he has won something. #cam:portrait
    -> opts
* {antenna == "foil"} [Auntie's television #hotspot:auntie_tv]
    Auntie's television is showing two newsreaders through a blizzard. #cam:auntie_tv
    You know exactly what this television needs. #emote:child=sparkle #expr:child=smug
    -> opts
+ [Sit nicely and wait #flavour:Like a good child in a catalogue.]
    -> tray

= tray
Auntie Efua comes back carrying a tray like she is presenting a crown. #cast:mum,child,auntie #cam:tray #prop:tray=on #prop:biscuits=12 #expr:auntie=happy
{looked_portrait:
    Auntie Efua: Ah! You were looking at my Kwabena! He is in London. He is doing very well. #expr:auntie=proud #focus:auntie
    -> london ->
}
Auntie Efua: Do you want some biscuits and malt? #focus:none
She places the whole tray on the low table. Your stomach says YES. Your survival instincts say WAIT. #cam:tray #expr:child=worried
Auntie pushes the plate towards you. Mummy is sitting right there... watching. #focus:mum #expr:mum=sideeye #sfx:sting #light:tension
The biscuits look incredible. What is the correct household protocol? #focus:none
* [Take the biscuits immediately #flavour:Food is food!]
    -> grab
* [Check Mummy's expression first #flavour:Eyes before appetite.]
    -> look_mum
* [Politely refuse everything #flavour:Better safe than sorry?]
    -> refuse

= london
Auntie Efua: He writes to me every month. Every month! Last month he sent a photograph of snow.
* [Ask her what snow feels like #flavour:You genuinely want to know.]
    ~ heard_london = true
    ~ score(6, 2, 0)
    Nana: Auntie, what does snow feel like?
    Auntie Efua: He says it is like the inside of a fridge. But everywhere. Even outside! #expr:auntie=delight
    #moment:snow_question/What Does Snow Feel Like?
    Auntie Efua: You know, you are the first child who has ever asked me about my Kwabena. #emote:auntie=heart #expr:auntie=proud
* [Nod politely and look at the tray #flavour:The tray is RIGHT THERE.]
    Auntie Efua sees exactly where your eyes are going. #expr:auntie=smug
    Auntie Efua: Hmm. This one is more interested in biscuits than in London. #expr:auntie=laugh
- ->->

= grab
~ biscuit = "grab"
~ score(-14, -5, 15)
You take the biscuits. Several. Immediately. #prop:biscuits=8 #anim:child=bounce #sfx:crunch #light:afternoon
#note:You forgot to read the room.
Mummy: Ei! Are we starving you at home? You haven't even said thank you! #expr:mum=angry #fx:shake #focus:mum #emote:mum=anger
{tv_reaction == "eyes":
    Mummy: Yesterday a saint, today a vulture?
}
Auntie Efua laughs. You freeze with a biscuit halfway to your mouth. #focus:none #expr:auntie=laugh #expr:child=shock
Nana: Th-thank you, Auntie.
#moment:vulture/Halfway to the Mouth
Auntie Efua: Leave the child, Esi! Children must eat! But next time, thank you first, eh? #expr:auntie=happy
-> alone

= look_mum
~ score(0, 18, 0)
You look at Mummy. Not at the biscuits. At Mummy. #focus:mum #cam:mum_eyes
#note:You noticed the real boss of this conversation.
{trouble >= 25:
    Mummy gives the tiniest nod. It is the nod of a woman who is still thinking about yesterday. #expr:mum=sideeye
- else:
    Mummy gives the tiniest nod and a very serious look. Nobody else seems to notice. #expr:mum=sideeye
}
The tiny nod means you may accept ONE. Politely. #focus:none
* [Take one and say "Thank you, Auntie" #flavour:Respectful. Elegant. Perfect.]
    -> winner
* {greeted == "twi"} [Take one and say "Medaase, Auntie" #flavour:Twi again? Now you are showing off.]
    ~ said_medaase = true
    ~ score(4, 0, 0)
    -> winner
* [Take three biscuits and two malts #flavour:She nodded, didn't she?]
    -> too_much
* [Keep staring at Mummy #flavour:Waiting for a written instruction.]
    -> overthink

= winner
~ biscuit = "one"
~ score(24, 10, 0)
You take one biscuit. Just one. #prop:biscuits=11 #sfx:good #light:afternoon #expr:child=happy
{said_medaase:
    Nana: Medaase, Auntie.
    Auntie Efua: Twi again! Esi, this child will be a chief one day! #expr:auntie=delight
- else:
    Nana: Thank you, Auntie.
}
#note:Perfectly played!
Auntie Efua: Awww! This child has manners. You have trained your child well! #expr:auntie=delight #emote:auntie=heart
#moment:one_biscuit/The One-Biscuit Rule
Mummy smiles. You receive one biscuit, one malt, and something rarer than both: public praise. #expr:mum=proud #emote:mum=sparkle
-> alone

= too_much
~ biscuit = "many"
~ score(-12, 0, 17)
You take three biscuits and two malts. You need both arms. #prop:biscuits=9 #anim:child=bounce #sfx:bad #light:afternoon
#note:You misunderstood the assignment.
Mummy: Ah. Did I give you permission to carry the whole tray? #expr:mum=angry #focus:mum
Auntie Efua starts laughing. Your interpretation of the nod was a little ambitious. #focus:none #expr:auntie=laugh #expr:child=worried
#moment:ambitious_nod/An Ambitious Interpretation
Auntie Efua: Leave the child, Esi. At least now we know my malt is good!
-> alone

= overthink
~ biscuit = "stare"
~ score(2, -3, 0)
You keep staring at Mummy. Mummy keeps staring at you. #expr:child=stare #expr:mum=stare #auto:2000
Auntie Efua looks from Mummy, to you, to Mummy again. #focus:auntie #light:afternoon
Auntie Efua: My dear, are you waiting for your mother to blink twice? #expr:auntie=laugh
Everybody laughs. At least you did not cause major trouble. #focus:none #expr:mum=smile
#moment:blink_twice/Waiting for Two Blinks
Auntie Efua puts one biscuit directly into your hand, the way you would feed a shy goat. #prop:biscuits=11
-> alone

= refuse
~ biscuit = "refuse"
~ score(-4, 3, 7)
Nana: No, thank you, Auntie. I'm fine. #light:afternoon
#note:Safe... but now Auntie is offended.
Auntie Efua: Ei, why? Is my food not good enough for you? #expr:auntie=hurt #focus:auntie
Mummy gives you a puzzled look. Somehow, you have caused trouble by saying no. #focus:none #expr:mum=sideeye #expr:child=worried
Mummy: Take it. Auntie gave it with her whole heart.
#moment:polite_refusal/The Refusal That Backfired
You take one biscuit. It tastes slightly of guilt. #prop:biscuits=11
-> alone

= alone
Auntie Efua: Ei! My soup! #expr:auntie=shock #anim:auntie=jump
#cast:mum,child
Auntie Efua runs into the kitchen.
Outside, a woman calls out that she has fresh fish. Mummy is at the gate in two seconds. #cast:child
You are alone. With the tray. #cam:tray_close #light:tension #amb:clock #expr:child=stare
The biscuits sit in a perfect circle. Like a clock. Like a trap.
* [Slip one biscuit into your pocket #flavour:For later. For emergencies.]
    ~ pocketed = true
    ~ score(0, 2, 6)
    One biscuit goes into your pocket. Your heart is beating like a talking drum. #prop:biscuits=-1 #anim:child=shake #emote:child=sweat
    Nobody saw. Probably.
* [Take one, then rearrange the circle so nobody can tell #flavour:Careful geometry.]
    ~ pocketed = true
    ~ rearranged = true
    ~ score(0, 8, 4)
    You take one biscuit, then gently spread the others until the gap disappears. #prop:biscuits=-1 #emote:child=sparkle #expr:child=smug
    #moment:geometry/Biscuit Geometry
    It is the finest work of your career.
* [Sit on your hands and count the ceiling boards #flavour:Resist. Resist. Resist.]
    ~ score(6, 0, 0)
    You sit on both hands. You count the ceiling boards. There are forty-two. #anim:child=shake
    The biscuits remain forty-two times more interesting than the ceiling.
* {antenna == "foil"} [Fix Auntie's television while nobody is looking #flavour:The engineer is in.]
    ~ auntie_tv_fixed = true
    ~ score(10, 8, 0)
    You find a toffee wrapper in your pocket and give Auntie's antenna two careful twists. #cam:auntie_tv #sfx:tvclear #prop:auntie_tv=fixed
    The blizzard clears. The newsreaders appear, sharp and surprised. #emote:child=sparkle
    #moment:house_call/The Engineer Makes a House Call
- Footsteps. Auntie Efua and Mummy come back at the same time. #cast:mum,child,auntie #light:afternoon #amb:auntie #cam:wide #expr:child=neutral
{
- auntie_tv_fixed:
    Auntie Efua: Ei! My television! Esi, look! Your child is a genius! #expr:auntie=delight #anim:auntie=bounce
    Mummy: It comes from Daddy's side. Mostly the side that touches foil. #expr:mum=smug
- rearranged:
    Auntie Efua looks at the tray. Her head tilts. #expr:auntie=sideeye #focus:auntie
    Auntie Efua: Hmm. My biscuits have moved. I don't know how. But they have moved. #emote:auntie=question
- pocketed:
    Auntie Efua glances at the tray. Her eyes stay there one second longer than normal. #expr:auntie=sideeye #focus:auntie
    She says nothing. Yet.
- else:
    Auntie Efua: Look at this! The tray is exactly as I left it. This child has discipline! #expr:auntie=proud
    ~ score(4, 0, 0)
}
The visit ends the way every visit ends: with the adults standing at the door, saying goodbye for twenty-five minutes. #focus:none #cam:door
{
- biscuit == "one":
    Auntie Efua presses two more biscuits into your hand, wrapped in a napkin. "For the road." #expr:auntie=happy
- biscuit == "grab" || biscuit == "many":
    Auntie Efua: Next time, I will hide the tray! Hihihi! #expr:auntie=laugh
- biscuit == "refuse":
    Auntie Efua: Next time you will eat, eh? I'll be watching you! #expr:auntie=smug
- else:
    Auntie Efua: And next time, you don't need permission to blink! #expr:auntie=laugh
}
#scene:compound #light:dusk #cast:mum,child #cam:gate #amb:compound
Walking home, Mummy holds your hand again.
{
- approval >= 65:
    Looser this time.
    Mummy: You did well today. #expr:mum=proud #focus:mum
    Three words. They will keep you warm for a week. #focus:none #expr:child=happy
- approval < 40:
    The same grip as before. Possibly tighter.
    Mummy: We will talk at home. #expr:mum=flat #focus:mum
    You will not talk at home. Mummy will talk. You will listen. #focus:none #expr:child=sad
- else:
    Mummy hums to herself. You decide this is a good sign. You are not completely sure. #expr:mum=neutral
}
{pocketed:
    In your pocket, the biscuit waits. It is a problem for tomorrow's Nana. #emote:child=sweat
}
-> ep3
