// =====================================================================
//  EPISODE SEVEN: WHO TOUCHED THE REMOTE?
//  Sunday, 2:55 PM. Black Stars at three. Mummy's film at three. In this
//  house the TV is commanded from the chair, and the remote is missing.
//  Nana watched cartoons this morning. Nana knows exactly where it is.
// =====================================================================

=== ep7 ===
#episode:7 #scene:hall #light:afternoon #cast:mum,child,dad #cam:wide #amb:hall #prop:tv=off #prop:lamp=off #prop:keyhole=off #outfit:child=none #outfit:friend=none
#card:Episode Seven/Who Touched the Remote?/Sunday · 2:55 PM
Sunday. After church. After jollof. The most powerful hour of the week. #expr:dad=hands_on_hips #expr:mum=idle #expr:child=happy
Daddy: Black Stars. Three o'clock. Nobody move. #expr:dad=lecture #focus:dad #emote:dad=sparkle
Mummy: My film starts at three o'clock. #expr:mum=arms_crossed #focus:mum
Daddy: The remote. Where is the remote? #expr:dad=think #focus:dad
Not on the table. Not on the TV. #cam:table #emote:dad=question #focus:none
Daddy does not get up to press buttons. In this house, the TV is commanded from the chair. #cam:wide
Then you remember. Cartoons. Before church. The remote went under a cushion. #expr:child=panic #emote:child=sweat #focus:child
Which cushion? Daddy's cushion. #cam:sofa #sfx:sting #focus:none
Daddy is sitting on it. #expr:dad=hands_on_hips #focus:dad
{has_remote:
    Mummy: The last time this child held the remote, Maria disappeared into the snow. #expr:mum=side_eye #focus:mum
}
Daddy: WHO TOUCHED THE REMOTE? #expr:dad=scold #focus:dad #fx:impact #sticker:dad=hmmm
Everybody looks at you. Even the fan. #cam:fan #focus:none #expr:child=worried #readroom #timer:12
#hint:Daddy is sitting on the evidence. Mummy wants her film. Kickoff is in four minutes.
* [Confess. "Daddy... you're sitting on it." #flavour:The truth, delivered to a chair.]
    -> confess
* [Search the room like a detective #flavour:Find it. Heroically.]
    -> detective
* [Say your friend was holding it this morning #flavour:Nobody can check.]
    -> blame
* [Say nothing #timeout #flavour:Silence is golden.]
    -> silent

= confess
~ remote_truth = "confessed"
~ score(6, 0, -5)
Nana: Daddy... I watched cartoons this morning. It's under your cushion. #expr:child=worried #focus:child #cam:wide
Daddy stands. Lifts the cushion. The remote. Still warm. #expr:dad=shocked #insert:tv_remote #sfx:pop #focus:dad
Daddy: I have been sitting on the solution. #expr:dad=laugh
Mummy laughs. Daddy laughs. Nobody shouts. #expr:mum=laugh #focus:mum #sfx:good
#moment:sitting_solution/Sitting on the Solution
Daddy: You found it. You decide. #expr:dad=approve #focus:dad
-> decide

= detective
~ remote_truth = "detective"
~ score(1, 3, 0)
Nana: Nobody move. I will find it. #expr:child=focused #focus:child #anim:child=bounce #cam:wide
Under the table. Behind the showcase. Inside the flower vase. #cam:table #sfx:whoosh #focus:none
You check the fan. Nobody knows why. #cam:fan
Daddy: Time is going! #expr:dad=stern #focus:dad #cam:wide
Nana: Daddy. Please. Stand up. #expr:child=comment #focus:child
Daddy stands. You lift the cushion. #anim:dad=jump #insert:tv_remote #sfx:pop #focus:none
Nana: FOUND IT! #expr:child=delight #emote:child=sparkle #sfx:cheer #anim:child=jump
{mummy_knows || woke == "pretend":
    Mummy: Hmm. You found it very fast. As if you knew where it was. #expr:mum=side_eye #focus:mum #sticker:mum=hmmm
- else:
    Daddy: Sherlock Holmes! #expr:dad=laugh #focus:dad #sticker:dad=good_child
}
#moment:detective/The Detective
Daddy: You found it. You decide. #expr:dad=approve #focus:dad
-> decide

= blame
~ remote_truth = "blamed"
~ score(-5, 0, 6)
Nana: {friend} was here this morning. {friend} was holding it. #expr:child=sneak #focus:child
Mummy: {friend} left for Kumasi at five o'clock this morning. I waved them off. #expr:mum=side_eye #focus:mum #sticker:mum=hmmm
Daddy shifts in his chair. Something under the cushion clicks. #expr:dad=shocked #focus:dad #sfx:click
The TV comes on by itself. #prop:tv=snow #sfx:static #fx:flash #cam:tv #focus:none
Daddy lifts the cushion. The remote. #insert:tv_remote #cam:wide
Daddy: So {friend} sat here. From Kumasi. #expr:dad=scold #focus:dad #fx:shake #sticker:dad=akola_bone
#moment:kumasi_remote/The Kumasi Remote
Mummy takes the remote out of Daddy's hand while he is still shouting. #expr:mum=arms_crossed #focus:mum
-> mummy_wins

= silent
~ remote_truth = "silent"
~ score(-2, 0, 2)
You say nothing. Very loudly. #expr:child=flat #emote:child=dots #focus:child
Daddy: Somebody in this room knows. #expr:dad=stern #focus:dad
Mummy: Somebody in this room is sweating. #expr:mum=side_eye #focus:mum #emote:child=sweat
Three o'clock. Daddy gives up and gets up to press the TV button with his own finger. #prop:tv=snow #sfx:static #cam:tv #focus:none
The remote falls off the cushion behind him. #insert:tv_remote #sfx:thump #cam:wide
Everybody looks at the remote. Everybody looks at you. #expr:child=panic
Daddy: Cartoons? #expr:dad=stern #focus:dad
Nana: ...Cartoons. #expr:child=worried #focus:child
#moment:silent_witness/The Silent Witness
While Daddy is still standing, Mummy picks up the remote. #expr:mum=arms_crossed #focus:mum
-> mummy_wins

// ---- Two faces, one TV ------------------------------------------------

= decide
The remote is in your hand. Two faces. One TV. #cam:push #expr:child=focused #focus:none
Daddy: Black Stars, Nana. Your country needs you. #expr:dad=lecture #focus:dad
Mummy: My film, Nana. I carried you for nine months. #expr:mum=arms_crossed #focus:mum
The remote is very heavy. #focus:none #readroom #timer:10
#hint:The football is live. The Sunday film repeats on Wednesday night. You read it in the Graphic. Mummy didn't.
* [Black Stars for Daddy #flavour:Your country needs you.]
    ~ tv_won = "dad"
    ~ score(0, 0, 0)
    -> football
* [The film for Mummy #flavour:Nine months is a strong argument.]
    ~ tv_won = "mum"
    ~ score(3, 0, -2)
    -> film
* [Football now. "Mummy, your film repeats on Wednesday." #flavour:You read the Graphic.]
    ~ tv_won = "both"
    ~ score(6, 4, -4)
    Nana: Mummy, the film repeats on Wednesday at eight. It was in the Graphic. #expr:child=comment #focus:child
    Mummy: ...Is that so? #expr:mum=think #focus:mum
    Daddy: Who taught this child to read the Graphic? #expr:dad=delight #focus:dad
    Mummy: Not you. #expr:mum=flat #focus:mum
    #moment:read_graphic/Read the Graphic
    -> football
* [Change it to cartoons #flavour:Power corrupts.]
    ~ tv_won = "cartoons"
    ~ score(-6, 0, 7)
    Click. Cartoons. #sfx:click #prop:tv=snow #cam:tv
    Two parents turn to you, very slowly. #cam:wide #expr:dad=shocked #expr:mum=shocked #sfx:heartbeat
    The remote is confiscated until further notice. #sticker:child=oops #expr:child=ashamed
    #moment:power_corrupts/Power Corrupts
    -> film
* [Freeze #timeout #flavour:They are both looking at you.]
    ~ tv_won = "mum"
    ~ score(0, 0, 0)
    You freeze. Mummy does not freeze. #expr:child=stare #focus:child
    -> mummy_wins

= mummy_wins
{tv_won == "none":
    ~ tv_won = "mum"
}
Mummy: Thank you. #expr:mum=approve #focus:mum
-> film

= football
Click. The Black Stars run out. In the snow. #sfx:click #prop:tv=snow #sfx:static #cam:tv #amb:static #focus:none
{antenna == "foil":
    Mummy's Christmas foil does its work. The snow clears. Daddy salutes it. #prop:foil=on #sfx:tvclear #expr:dad=delight #emote:dad=heart
}
Daddy: Pass! Pass it! PASS IT! #expr:dad=hands_on_hips #focus:dad #anim:dad=bounce
GOAL! #sfx:cheer #fx:flash #anim:dad=jump #anim:child=jump #expr:child=delight #focus:none #cam:wide
Daddy lifts you up to the ceiling fan. Mummy screams. Not about the goal. #expr:mum=shock #fx:shake
{tv_won == "dad":
    ~ score(-2, 0, -1)
    Mummy watches the football with her arms folded. She will remember this on Wednesday. #expr:mum=arms_crossed #focus:mum
}
-> ep7_end

= film
Click. Mummy's film. #sfx:click #prop:tv=film #light:film #amb:film #cam:tv #focus:none
Daddy goes to the corridor with his small radio and listens to the match standing up. #cast:mum,child #sfx:radio #expr:mum=delight
Neighbour: GOAL! #sfx:cheer
Daddy, from the corridor: GOOOOAL! #fx:shake #sfx:cheer
Mummy turns the film up. #expr:mum=smug #focus:mum
-> ep7_end

= ep7_end
Evening comes. The house is calm again. #light:evening #cam:wide #amb:hall #prop:tv=off #prop:foil=off #cast:mum,child,dad #focus:none #expr:dad=idle #expr:mum=idle #expr:child=neutral
Mummy: The water comes tonight. When it comes, Nana, fill the drum. #expr:mum=stern #focus:mum
Nana: Yes, Mummy. #expr:child=happy #focus:child
You will remember. Definitely. #focus:none #emote:child=dots
-> ep8
