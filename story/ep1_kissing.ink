// =====================================================================
//  EPISODE ONE — THE KISSING SCENE
//  Sunday evening, the family hall. One television. One sofa.
//  One remote control, still wrapped in its plastic.
// =====================================================================

=== ep1 ===
#episode:1 #scene:hall #light:snow #cast:none #cam:tv_close #prop:tv=snow #amb:static
#card:Episode One/The Kissing Scene/Accra, Ghana · Sunday · 7:42 PM
Accra, 1998. In this house there is one television, one sofa, and one remote control.
You are allowed to sit on the sofa.
Daddy: Nana! Nana, come. Come and hold this antenna for me. #cam:wide #cast:mum,child,dad #expr:dad=strain #anim:dad=lean #light:evening
The Sunday film starts in two minutes, and the television is showing nothing but snow. #expr:child=worried
Mummy: Leave the antenna. Every Sunday, it's the same palaver. #expr:mum=flat
Daddy: The film will not watch itself, my dear. Nana! Today! #expr:dad=strain #anim:dad=shake
-> fix_antenna

= fix_antenna
The antenna is two metal rods on top of the television, bent like an old man's knees. #cam:tv #expr:dad=neutral #expr:child=neutral
Daddy: Hold it there. No, move it back. The first spot. #expr:dad=strain #emote:dad=sweat
* [Hold it exactly where Daddy says #flavour:Become one with the television.]
    ~ antenna = "held"
    ~ score(4, 0, 0)
    You grab the antenna. #anim:child=jump #prop:tv=film #sfx:tvclear
    The snow clears. A woman in an enormous pink dress appears on the screen. #cam:tv
    Daddy: Don't move. Don't breathe. From today, you are part of this television. #expr:dad=delight
    Mummy: The child can't stand there for the whole film. #expr:mum=flat
    Daddy: Why not? It's a good film. #expr:dad=smug
    #moment:human_antenna/The Human Antenna
    You are now a piece of household electronics. #expr:child=stare
* [Fetch Mummy's aluminium foil from the kitchen #flavour:Science. Kitchen science.]
    ~ antenna = "foil"
    ~ score(-2, 12, 0)
    You run to the kitchen and come back with Mummy's roll of aluminium foil. #anim:child=bounce #sfx:whoosh
    Two careful twists around each rod. A small silver crown for the television. #prop:foil=on #prop:tv=film #sfx:tvclear
    The picture comes in, sharp as a new cutlass.
    Daddy: Ei! Engineer! You see this child? Engineer! #expr:dad=delight #emote:dad=sparkle
    #moment:foil_engineer/The Aluminium Engineer
    Mummy: Is that my foil? I was keeping that foil for Christmas. #expr:mum=sideeye #emote:mum=anger
* [Give the television one firm slap on the side #flavour:It always works for Uncle Fiifi.]
    ~ antenna = "slap"
    ~ score(-3, 0, 5)
    You walk up to the television and give it one firm slap. #fx:shake #sfx:thump #anim:child=lean
    The picture flickers... appears... #prop:tv=film
    ...and disappears completely. #prop:tv=snow #sfx:static #expr:child=worried
    Daddy: Who taught you to beat my television? It is not a goat! #expr:dad=shock #emote:dad=shock
    Mummy sighs, stands up, and touches the antenna with one finger. #anim:mum=lean #expr:mum=flat
    The picture comes back perfectly. #prop:tv=film #sfx:tvclear
    #moment:tv_discipline/Television Discipline
    Mummy: Sit down. Both of you. #expr:mum=smug
- -> settle

= settle
{antenna == "held":
    You stay beside the television, holding the antenna. From here you can see the whole hall. And the whole hall can see you. #cam:wide
- else:
    You sit on the sofa between Mummy and Daddy. The best seat in the house. Also the most dangerous. #cam:sofa
}
The adverts are still running. You have a moment to look around. #expr:child=neutral #expr:dad=neutral #expr:mum=neutral
- (look)
* [The remote control #hotspot:remote]
    The remote control sits on the arm of Daddy's chair, still wrapped in the clear plastic it came with. #cam:remote
    It has been "new" for six years. It will be new forever.
    Daddy: Don't touch. You'll spoil it. #expr:dad=flat
    -> look
* [The calendar #hotspot:calendar]
    ~ seen_calendar = true
    A calendar from Daddy's office. This month's picture is the Akosombo Dam. #cam:calendar
    Daddy says the lake behind the dam is very low this year. That is why the lights keep going off.
    Mummy: Don't remind me. My fridge has become a cupboard. #expr:mum=flat
    -> look
* [The wedding photograph #hotspot:photo]
    Mummy and Daddy on their wedding day. Mummy looks exactly the same. #cam:photo
    Daddy had hair. Nobody in this house discusses Daddy's hair. #expr:dad=flat #emote:dad=dots
    -> look
* [The standing fan #hotspot:fan]
    The standing fan turns its head slowly from side to side, like a headmaster at assembly. #cam:fan
    When it faces you, life is sweet. When it faces Daddy, it somehow stays there. #emote:child=sweat
    -> look
+ [Watch the film #flavour:The adverts are finishing.]
    -> film

= film
Daddy: Shhh. The film is starting. Who has the remote? #cam:sofa #amb:film #light:film #expr:dad=focused
Mummy: It's in your hand. #expr:mum=flat
Daddy: ...I know. #expr:dad=flat #emote:dad=dots #auto:1600
Mummy: Nana, sit properly. And don't let me hear any unnecessary noise. #expr:mum=flat #focus:mum
She says this without even looking away from the television. #focus:none
Tonight's film is a foreign romance called Hearts of Fire. The hero has a very serious moustache. #cam:tv #prop:tv=film
TV: Isabella... I have crossed seven oceans to find you.
TV: Ricardo... there are only five oceans. #auto:1800
TV: For you, I found two more. #sfx:romance
Daddy: Hmm. This man is serious. #expr:dad=focused #cam:sofa
The music swells. Isabella leans closer. Ricardo leans closer. #cam:push #light:tension #expr:child=worried
Something is happening on the television. Something terrible. #cam:push
Daddy clears his throat. Twice. #emote:dad=sweat #expr:dad=worried
Mummy's eyes move. Not her head. Only her eyes. Slowly... towards you. #focus:mum #expr:mum=sideeye #sfx:sting
{antenna == "held":
    EI! The people on the television have started KISSING. And you are standing right beside it, in front of everybody. #fx:impact #sfx:kiss #focus:none #prop:tv=kiss #expr:child=shock #timer:8
- else:
    EI! The people on the television have started KISSING. Your parents are right beside you. #fx:impact #sfx:kiss #focus:none #prop:tv=kiss #expr:child=shock #timer:8
}
* [Burst out laughing #flavour:You just cannot hold it in.]
    -> laugh
* [Immediately close your eyes #flavour:You saw absolutely nothing.]
    -> eyes
* [Comment on the scene #flavour:"Ei, Mummy! See what they are doing!"]
    -> comment
* [Announce that you are very, very thirsty #flavour:A strategic retreat to the kitchen.]
    -> water
* {antenna == "held"} [Let go of the antenna #flavour:Accidentally. Of course.]
    -> letgo
* [Freeze #timeout #flavour:Say nothing. Become furniture.]
    -> froze

= laugh
~ tv_reaction = "laugh"
~ score(-15, 0, 18)
A laugh escapes. Not a small one. A big, round one that bounces off every wall. #expr:child=laugh #anim:child=shake #sfx:bad
#note:Mummy heard that laugh.
Mummy: AKOLA BONE! What exactly is making you laugh? Do you have a problem? #expr:mum=angry #anim:mum=bounce #fx:shake #focus:mum #emote:mum=anger
Daddy slowly turns his head. The film has become the least of your worries. #focus:dad #expr:dad=flat #expr:child=worried
Nana: N-nothing, Mummy.
Daddy: If you have so much energy, go and bring your schoolbooks. #expr:dad=flat #focus:none
#moment:homework/Homework Instead of Romance
Your Sunday film has officially become a homework session at the dining table. #cam:table #expr:child=sad
From the table you can hear Ricardo singing. You will never know why he is singing.
-> lights_off

= eyes
~ tv_reaction = "eyes"
~ score(22, 15, 0)
You shut your eyes so fast and so tight that you see small stars. #expr:child=eyesclosed #sfx:good
#note:Excellent survival instincts!
Mummy: Hmm. Good child. You know when to close your eyes. #expr:mum=proud #emote:mum=sparkle #focus:mum
A soft, approving nod. The ancestors are smiling. #focus:none
You keep your eyes closed. Just to be safe. #light:film #prop:tv=film
You hear music. Then a door slams. Then a car chase. Then what sounds like a wedding. #auto:2600
Daddy: Nana. Open your eyes. They finished long ago. #expr:dad=happy
You open them. Ricardo is now married, has two children, and is somehow in prison. #expr:child=shock #emote:child=question
#moment:professional_blinker/The Professional Eye-Closer
You have missed the entire plot.
-> lights_off

= comment
~ tv_reaction = "comment"
~ score(-22, 0, 26)
Nana: Ei, Mummy! See what they are doing! #expr:child=shock #anim:child=jump #sfx:bad
#note:You said that OUT LOUD.
The hall goes completely silent. Even the fan seems to stop and look at you. #auto:1800 #expr:mum=stare #expr:dad=stare
Mummy: AKOLA BONE! Who asked you to do commentary? Go to your room! #expr:mum=angry #fx:shake #focus:mum #emote:mum=anger
Daddy: Go. #focus:dad #expr:dad=flat
You have managed to offend both parents, interrupt the film, and end your own evening. #focus:none #expr:child=sad #anim:child=slump
#moment:film_critic/The Film Critic
The bedroom door closes. Through the wall, you hear the film continue without you. Pain. #cast:mum,dad #light:tension
-> lights_off

= water
~ tv_reaction = "water"
~ score(4, 15, 0)
Nana: Mummy... I'm very thirsty. #expr:child=worried
Mummy: ...Go. #expr:mum=sideeye #focus:mum
#note:A strategic retreat.
You walk to the kitchen like a soldier leaving a battlefield. #cast:mum,dad #sfx:whoosh #focus:none
Behind you, Daddy coughs for nine seconds straight. #emote:dad=sweat
Mummy: And bring me water too!
You take your time. You drink very slowly. You count the floor tiles. When the music changes, you come back. #cast:mum,child,dad #prop:tv=film
The kiss is over. Ricardo is riding a horse now.
Mummy: That thirst came at a very convenient time. #expr:mum=sideeye #focus:mum
Nana: God's time is the best, Mummy. #expr:child=smug #focus:child
Daddy laughs before he can stop himself. Mummy does not. #expr:dad=laugh #expr:mum=flat #focus:none
#moment:convenient_thirst/The Convenient Thirst
Mummy writes something down in the notebook inside her head. #expr:mum=sideeye
-> lights_off

= letgo
~ tv_reaction = "antenna"
~ mummy_knows = true
~ score(8, 18, 2)
Your hand slips. Completely by accident. #anim:child=lean
The kiss dissolves into snow. #prop:tv=snow #sfx:static #light:snow
Daddy: Nana! Hold it well! #expr:dad=shock #anim:dad=jump
Nana: Sorry, Daddy. My hand is tired. #expr:child=worried
You fight bravely with the antenna for a long, long time. Somehow, it only works again when the music changes. #prop:tv=film #light:film #sfx:tvclear
Daddy: Finally! #expr:dad=happy
Mummy looks at you for a long moment. Then, very slightly, the corner of her mouth moves. #focus:mum #expr:mum=smile
#note:Mummy noticed. Mummy approves.
#moment:strategic_interference/Strategic Interference
She knows. You know she knows. Nobody will ever say anything. #focus:none
-> lights_off

= froze
~ tv_reaction = "froze"
~ score(-5, 0, 8)
You do not laugh. You do not close your eyes. You just... watch. Like a scientist. #expr:child=stare #auto:2000
Daddy reaches for the remote. He presses the button. Nothing happens. #emote:dad=sweat #cam:remote
He presses it again, harder, through the plastic.
The channel changes to the news. The newsreader is talking about the water level at Akosombo. #prop:tv=news #cam:tv #light:film
Daddy: Hmm. Very educational. #expr:dad=flat #cam:sofa
Mummy: Nana, why were you watching like that? #expr:mum=sideeye #focus:mum
#moment:documentary/The Documentary Watcher
There is no correct answer to this question. You have learned this too late. #focus:none
-> lights_off

= lights_off
Then, click. #sfx:powercut #light:blackout #prop:tv=off #amb:night #cast:mum,child,dad #cam:wide #focus:none
The fan stops. The television dies. The whole street goes dark at the same time. #expr:child=shock #expr:mum=flat #expr:dad=shock
Neighbour: EI! They have taken the light!
{seen_calendar:
    Akosombo. You think about the calendar. The lake must be very, very low.
}
Mummy finds the kerosene lamp without even looking. She has done this many times this year. #prop:lamp=on #light:lamp #cam:lamp
{
- tv_reaction == "laugh":
    Daddy: God has seen your laughing, Nana. #expr:dad=smug
    Nana: But Daddy, the light went off for everybody.
    Daddy: God has seen everybody's laughing. #expr:dad=flat
- tv_reaction == "comment":
    Daddy calls towards the bedroom door: Is the film critic sleeping? #expr:dad=smug
    Mummy: If not, the film critic should be sleeping. #expr:mum=flat
- tv_reaction == "eyes":
    Daddy: At least one person in this house has discipline. #expr:dad=proud
- tv_reaction == "water":
    Mummy: Nana. Since you know the way to the kitchen so well, bring the matches. #expr:mum=sideeye
- tv_reaction == "antenna":
    Daddy: This antenna. If Nana had held it properly... #expr:dad=flat
    Mummy: Leave the child. #expr:mum=smile
    Daddy looks from Mummy to you and back again, and decides not to investigate. #emote:dad=question
- tv_reaction == "froze":
    Daddy: Nana, the news was very interesting, eh? #expr:dad=smug
    You nod in the dark. You have never been so happy to see darkness.
}
Mummy: Tomorrow afternoon, I am visiting Auntie Efua. Nana, you are coming with me. #expr:mum=flat #focus:mum
{
- tv_reaction == "eyes":
    Mummy: A well-behaved child should be seen. #expr:mum=proud
    Nana: But Mummy...
    Mummy: Seen. Not heard. #expr:mum=flat
    #note:Good behaviour has its price.
    Being the good child, it turns out, comes with responsibilities. #expr:child=sad
- tv_reaction == "water":
    Mummy: Bring your thirst. Auntie Efua has plenty of water. #expr:mum=sideeye
- tv_reaction == "antenna":
    Mummy: Daddy needs to fix his antenna in peace. #expr:mum=smile
- else:
    Mummy: After tonight, I am not leaving you alone in this house with that television. #expr:mum=flat
}
In the lamplight, the house goes quiet. #focus:none #cam:lamp
But in a Ghanaian household, nothing stays quiet for long. #sfx:sting
By tomorrow afternoon, somebody else will know exactly what happened tonight.
-> ep2
