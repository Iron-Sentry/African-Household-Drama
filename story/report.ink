// =====================================================================
//  THE HOUSEHOLD REPORT CARD
//  Lines tagged #rank, #rankcopy, #remember and #quote are collected by
//  the game into the end-of-volume report card instead of the dialogue box.
// =====================================================================

=== report ===
~ temp r = rank()
#report #rank:{r} #cam:wide
{
- r == "golden":
    The Golden Child
    You read the room, respected the signals, and earned household legend status. Even Auntie Efua is impressed. #rankcopy
    {mummy_knows:
        Mummy also knows you are not quite as innocent as you look. She has decided this is a strength. #rankcopy
    }
    Mummy: That one? That one is my child. #quote:mum=proud
- r == "akola":
    Akola Bone!
    You collected side-eyes like trophies. Everybody in the compound has a story about you, and Mummy remembers all of them. #rankcopy
    {kojo_friend:
        At least {friend} thinks you are a legend. {friend}'s opinion is not currently being accepted. #rankcopy
    }
    Mummy: This child will finish me. Pass me my slippers. #quote:mum=angry
- r == "strategist":
    The Little Strategist
    Not every choice was perfect, but you always knew where the exits were. A future household diplomat. #rankcopy
    {counted_aloud:
        Auntie Efua has already offered you a job behind her provisions cupboard. #rankcopy
    }
    Daddy: Hmm. This one is going to be a lawyer. #quote:dad=smug
- else:
    The Family Comedian
    Your childhood is full of lessons, laughter, and moments the family will never, ever let you forget. #rankcopy
    Auntie Efua: Esi, bring the child again next week. I haven't laughed like this since Easter! #quote:auntie=laugh
}
// ---- What the family will remember (shown as a list on the report card)
{
- tv_reaction == "laugh":
    The laugh during Maria's big scene. Daddy sent you inside before the music finished. #remember
- tv_reaction == "eyes":
    You closed your eyes at exactly the right moment and earned the whole episode. #remember
- tv_reaction == "comment":
    "Ei! See what they are doing!" Mummy's finger pointed you to bed before the kiss had even finished. #remember
- tv_reaction == "water":
    The most convenient thirst in the history of the household. #remember
- tv_reaction == "froze":
    You watched the kissing scene like a documentary. Daddy changed the channel to the news. #remember
}
{
- woke == "sleepy":
    Your sleepy "Daddy... you called me?" Nobody suspects a thing. Yet. #remember
- woke == "pretend":
    The fake snore. Mummy heard it from the hall. #remember
}
{antenna == "foil":
    Mummy's Christmas foil is still on the antenna. Nobody is allowed to remove it. #remember
}
{
- biscuit == "one":
    You took exactly one biscuit and said thank you. Auntie Efua tells everybody. #remember
- biscuit == "grab" || biscuit == "many":
    You emptied Auntie Efua's tray faster than her soup could burn. #remember
- biscuit == "refuse":
    You refused Auntie Efua's biscuits. She is still a little bit hurt. #remember
- biscuit == "stare":
    You waited for Mummy to blink twice. Auntie Efua still asks about it. #remember
}
{auntie_tv_fixed:
    Auntie Efua's television has been perfect ever since your house call. #remember
}
{
- pocket_outcome == "confessed":
    You handed Auntie Efua a pocketful of crumbs and an apology. She laughed for a week. #remember
- pocket_outcome == "rat":
    The compound is still looking for a rat with pockets. #remember
- pocket_outcome == "kojo":
    {friend} has not forgotten the biscuit. {friend} will never forget the biscuit. #remember
}
{
- change == "returned":
    You gave Auntie Efua back a thousand cedis, and the news reached home before you did. #remember
- change == "spent":
    Ten bofrot. One thousand cedis. One knock at the door. #remember
- change == "home":
    You carried the extra money home untouched, and took it back the next morning. #remember
}
{
- gossip == "told":
    You told Auntie Efua about Daddy's car, the light bill and the snoring. The whole compound sends its sympathy. #remember
- gossip == "fine":
    "Everybody is fine, Auntie." The official family statement. Mummy has framed it in her heart. #remember
- gossip == "london":
    You asked about Kwabena, and Auntie Efua forgot every question she ever had. #remember
- gossip == "spy":
    You came home from an errand with Mummy's biggest secret. Daddy is still asking about the cake. #remember
}
{
- finale == "news":
    When Maria came back, you changed the channel to the news. Very educational. #remember
- finale == "mummy":
    You gave the remote to Mummy. Daddy is still trying to work out how she did it. #remember
- finale == "laugh":
    When Maria came back, everybody laughed. Even Mummy. Especially Mummy. #remember
- finale == "antenna":
    You sent the second kiss into the snow on purpose, and Mummy laughed until she cried. #remember
}
-> END
