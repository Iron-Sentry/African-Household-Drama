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
- seedling == "pepper" && homework_told == "mummy":
    Mummy gave up one pepper plant for your education. You are still watering the other five. #remember
- seedling == "pepper":
    Madam's VERY GOOD pepper. Mummy still counts her plants every morning. #remember
- seedling == "auntie" && auntie_caught:
    Auntie Efua caught you with her orange tree. She now says she sponsors your education. #remember
- seedling == "auntie":
    Auntie Efua's orange tree went to school one night and never came back. #remember
- seedling == "asked":
    You knocked on Auntie Efua's door at night for a seedling. She has told the story at three funerals. #remember
- seedling == "stick":
    The resting mango. Madam kept it on her desk for eleven years. #remember
- seedling == "none":
    Monday morning. An empty tin. Two words from Madam: SEE ME. #remember
}
{
- credit == "daddy":
    You told Madam the truth, so Daddy got a VERY GOOD too. He has not stopped talking about it. #remember
- credit == "blisters":
    Madam said you have a farmer's hands. You showed everybody the blisters for a week. #remember
- hole_by == "daddy":
    Daddy's hole is still in the back corner. He calls it "the foundation". #remember
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
{
- called == "first":
    You answered the first call. Mummy has told every mother in the compound. #remember
- called == "employee":
    {friend} answered Mummy for you. {friend} is still waiting to be paid. #remember
- called == "third":
    "Coming? From where? Kumasi?" The compound still says it to anybody who is late. #remember
- called == "fullname":
    The day the whole junction learned your full name. #remember
}
{
- washing == "shirt":
    Daddy still says you saved his white shirt. And his career. #remember
- washing == "all":
    The day the washing line came down in the sand. #remember
}
{
- meat == "grab":
    "Faster than the Holy Spirit." Daddy says it before every meal now. #remember
- meat == "prayed":
    You prayed properly, and Mummy gave you her chicken. #remember
- meat == "asked":
    You negotiated chicken during prayer. Daddy is still deciding if he is proud. #remember
- meat == "watched":
    One eye on the pot. Daddy had the other one. Mummy ate the chicken. #remember
}
{meat_saved == "lost":
    Daddy "helped you" with your meat. You eat your meat first now. Always. #remember
}
{
- tv_won == "both":
    You read the Graphic, and nobody missed anything. Mummy watched her film on Wednesday. #remember
- tv_won == "cartoons":
    You held the remote for four seconds and chose cartoons. It was confiscated until Easter. #remember
- remote_truth == "blamed":
    {friend} sat on the remote. From Kumasi. #remember
- remote_truth == "confessed":
    Daddy sat on the solution for ten minutes. #remember
}
{
- drum == "filled" && drum_then == "sold":
    Two o'clock water. One hundred cedis a bucket. Daddy made you carry it for free. #remember
- drum == "filled":
    You filled the drum at two in the morning, and Daddy called you a future minister. #remember
- drum_then == "hid":
    The invisible bucket. It was bigger than your back. #remember
- drum_then == "self":
    You took the only bucket. Daddy went to work with a dry face. #remember
}
{
- home_time == "ontime":
    You came home when the streetlight came on. {friend} did not. You heard everything. #remember
- home_time == "messenger":
    Auntie Akua told the whole lane you were coming. You were not coming. #remember
- home_time == "late":
    Five more minutes became forty. You carried {friend}'s slippers home. #remember
}
{
- stain == "tie":
    You went to church in Daddy's red tie. Daddy went without one. #remember
- stain == "confess":
    Cold water and salt. Only Togo remains. #remember
- stain == "scrub":
    Hot water on palm oil. Your church clothes are pink forever. #remember
- stain == "hand":
    Hand on heart, all morning. Auntie Efua thinks you were born again. #remember
- stain == "hope":
    You went to church with Africa on your chest. #remember
}
{
- cooks_better == "both":
    "You both cook like angels. Different angels." Auntie Efua says you will be President. #remember
- cooks_better == "auntie":
    You told Auntie Efua she cooks better. Mummy heard. Mummy remembers. #remember
- cooks_better == "daddy":
    You said Daddy cooks best. Daddy can boil an egg. #remember
- cooks_better == "mummy":
    "Mummy, of course." Auntie Efua moved the biscuits. #remember
- cooks_better == "spoon":
    The biggest spoon of soup in history. #remember
}
{
- malt == "detective":
    Two empty bottles. One with two straws. One with none. Case closed. #remember
- malt == "admit":
    You confessed to one malt. Mummy confessed for Daddy about the other one. #remember
- malt == "blamed":
    You blamed {friend} for the malt. {friend} told Daddy about the long straw. #remember
- malt == "rat":
    The whole family searched the kitchen for a rat that opens bottles. #remember
}
{
- xmas_photo == "bunny":
    The Christmas photo. Bunny ears. Daddy still says he didn't know. #remember
- xmas_photo == "mummy":
    The Christmas photo. You and Mummy, looking at each other. #remember
- xmas_photo == "eyes":
    The Christmas photo. Eyes closed. On purpose. #remember
}
-> END
