// =====================================================================
//  EPISODE THIRTEEN: CHRISTMAS VISITORS ARE COMING
//  Christmas Eve, 4:00 PM. Visitors at six. The good plates are coming
//  out of the showcase. Ten malts are waiting. Everybody who saw this
//  year is coming to the house, and every one of them remembers.
// =====================================================================

=== ep13 ===
#episode:13 #scene:hall #light:afternoon #cast:mum,child,dad #cam:wide #amb:hall #prop:tv=off #prop:lamp=off #prop:keyhole=off #prop:foil=off #outfit:child=none #outfit:friend=none
#card:Episode Thirteen/Christmas Visitors Are Coming/Christmas Eve · 4:00 PM
Christmas Eve. The radio is playing carols. Mummy is not. #sfx:radio #expr:mum=stern #expr:dad=read_paper #expr:child=happy
Mummy: Visitors at six. SIX. #focus:mum #anim:mum=bounce
Mummy: The floor. The plates. The ice for the malt. The chairs. Your father's newspapers. #expr:mum=scold
Daddy lowers his newspaper. Daddy raises his newspaper. #expr:dad=read_paper #focus:dad
The good plates are coming out of the showcase. The ones that only come out for visitors. And funerals. #focus:none #cam:wide #sfx:crinkle
Mummy turns to you. Two hours. Twenty jobs. One child. #expr:mum=stern #focus:mum #cam:push #readroom #timer:12
#hint:The plates are older than you, and Mummy loves them more. The ice-seller closes at five. Mummy decides the most urgent thing by what visitors see first.
* [Disappear into the bedroom #flavour:A Christmas miracle: invisibility.]
    -> hide
* [Offer to arrange the good plates #flavour:Handle with fear.]
    -> plates
* [Ask what job is most urgent #flavour:Read the room.]
    -> urgent
* [Run to buy ice for the malt #flavour:The ice-seller closes at five.]
    -> ice
* [Stand there #timeout #flavour:Twenty jobs is a lot of jobs.]
    -> froze

= hide
~ xmas_job = "hid"
~ score(-6, 0, 5)
You tiptoe into the bedroom and lie under the bed. #expr:child=sneak #scene:bedroom #light:afternoon #cast:child #cam:bed #transition:iris
Peace. Quiet. Christmas. #expr:child=eyesclosed #emote:child=dots #auto:1600
Mummy, from the doorway: I can see your feet. #sfx:sting #fx:impact #cast:child,mum@84 #cam:door #light:doorway #expr:mum=scold
Mummy: Since you like small spaces, you will clean the toilet. #expr:mum=stern #focus:mum #sticker:child=oops
#moment:christmas_feet/I Can See Your Feet
-> six_oclock

= plates
~ xmas_job = "plates"
~ score(6, 0, -3)
Nana: Mummy, I'll do the plates. #expr:child=proud #focus:child
Mummy hands you the first plate like a newborn baby. #expr:mum=offer_food #focus:mum #sfx:crinkle
Mummy: If you break it, don't come back. Go to Kumasi. #expr:mum=stern
One plate. Two plates. Twelve plates. Not one crack. #sfx:pop #expr:child=strain #focus:child #cam:table
Mummy inspects the table. Mummy approves the table. #expr:mum=approve #focus:mum #sticker:mum=good_child #sfx:good
#moment:good_plates/The Good Plates
-> six_oclock

= urgent
~ xmas_job = "asked"
~ score(6, 3, -4)
Nana: Mummy. What is the most urgent? #expr:child=focused #focus:child
Mummy stops. Mummy looks at you like she has seen a miracle. #expr:mum=shock #focus:mum #emote:mum=sparkle
Mummy: The floor. Visitors see the floor first. Then the table. #expr:mum=approve
Sweep. Mop. Table. Done by five-thirty. #sfx:whoosh #anim:child=bounce #focus:none #cam:wide
Mummy sits down for the first time today. #expr:mum=idle #focus:mum #emote:mum=heart
#moment:most_urgent/The Most Urgent Job
-> six_oclock

= ice
~ xmas_job = "ice"
~ score(2, 3, -1)
You run. #expr:child=run #sfx:whoosh #focus:none
The lane. The ice-seller is closing. #scene:street #light:dusk #cast:bofrot@16,child #cam:stall #amb:street #transition:iris
Auntie Akua: Last block! Because it's Christmas! #expr:bofrot=offer #focus:bofrot
You carry a block of ice home against your chest. Your chest will never forget. #expr:child=strain #anim:child=shake #emote:child=sweat #focus:child
Home. The malt goes into a bucket of ice. Daddy salutes you. #scene:hall #light:dusk #cast:mum,child,dad #cam:wide #amb:hall #expr:dad=delight #transition:cut
#moment:last_ice/The Last Block of Ice
Mummy: And the floor? #expr:mum=side_eye #focus:mum
Nana: ...The floor is next, Mummy. #expr:child=worried #focus:child
-> six_oclock

= froze
~ xmas_job = "froze"
~ score(-2, 0, 1)
You stand there. #expr:child=stare #focus:child
Mummy: Good. Since you are standing, you can do everything. #expr:mum=stern #focus:mum
Everything. #anim:child=slump #sfx:whoosh #focus:none
-> six_oclock

// ---- Six o'clock ----------------------------------------------------------

= six_oclock
Six o'clock. The door. #scene:hall #light:evening #cast:mum,child,dad #cam:wide #amb:hall #sfx:knock #expr:mum=delight #expr:dad=approve #expr:child=happy
Merry Christmas! #sfx:cheer #cast:auntie,mum,child,dad,friendmum,friend #expr:auntie=wave #expr:friendmum=wave #expr:friend=happy
Auntie Efua comes in first. Auntie Efua always comes in first. #focus:auntie #expr:auntie=welcome
{
- biscuit == "one":
    Auntie Efua: My Nana! Still taking only one biscuit? Good child! #emote:auntie=heart
- biscuit == "grab" || biscuit == "many":
    Auntie Efua: I have hidden my biscuits in my handbag, before you ask. #expr:auntie=point
- else:
    Auntie Efua: Nana! You have grown! What are they feeding you? #expr:auntie=laugh
}
{
- seedling == "auntie" && auntie_caught:
    Auntie Efua: And how is MY orange tree at school? I am still sponsoring your education, you know. #expr:auntie=gossip
- seedling == "asked":
    Auntie Efua: Madam sends greetings! We were in Form Two together, you know. #expr:auntie=gossip
}
{cooks_better == "auntie":
    Auntie Efua: Esi, the child says I cook better. Children don't lie. #expr:auntie=smug
    Mummy: Children don't lie. #expr:mum=flat #focus:mum
}
{told_malt:
    Auntie Efua: Now. Where is my malt? Twelve bottles, I heard. #expr:auntie=point #focus:auntie
    Daddy: Ten. #expr:dad=flat #focus:dad
}
{friend}'s Mother: Merry Christmas, Esi! #expr:friendmum=laugh #focus:friendmum
{
- drum_then == "gave" || drum_then == "borrowed":
    {friend}'s Mother: This child, Esi. Water at two o'clock in the morning. This child is a blessing. #expr:friendmum=wave
- drum_then == "sold":
    {friend}'s Mother: Is the water seller here? I have brought one hundred cedis. #expr:friendmum=point
}
{friend} finds you immediately. #focus:friend #expr:friend=happy
{
- malt == "blamed":
    {friend}: I told your Daddy the truth about the long straw. Merry Christmas. #expr:friend=smug
- home_time == "late":
    {friend}: I want my slippers back. Merry Christmas. #expr:friend=comment
- called == "employee":
    {friend}: Your volunteer has arrived. Merry Christmas. #expr:friend=proud
- else:
    {friend}: Merry Christmas! Is there jollof? #expr:friend=delight
}
Daddy opens the malt. #focus:dad #expr:dad=delight #insert:malt_bottle #sfx:pop
{
- malt == "admit" || malt == "detective":
    Daddy hands you a malt. In front of everybody. Like a medal. #emote:child=sparkle #sfx:good
- malt == "blamed":
    You serve the malt. You do not drink the malt. #expr:child=flat #emote:child=dots
- else:
    Daddy gives everybody a malt. He gives you a cup of water. With ice. #expr:child=flat
}
{xmas_job == "ice":
    The malt is ice-cold. Daddy tells everybody who bought the ice. #emote:dad=sparkle
}
Jollof. Chicken. Laughter. Auntie Efua tells every story about this year. Every single one. #focus:none #cam:wide #expr:auntie=laugh #anim:auntie=shake #sfx:cheer
-> photo

// ---- The Christmas photo ---------------------------------------------------

= photo
Daddy: Photo! Everybody! Christmas photo! #expr:dad=lecture #focus:dad #anim:dad=bounce
Daddy sets the camera on the showcase. Ten seconds. #insert:framed_family_photo #focus:none
Everybody squeezes in. Auntie Efua takes the middle. Of course. #cam:wide #expr:auntie=welcome #expr:mum=approve #expr:friendmum=laugh #expr:friend=happy
Ten. Nine. Eight... #sfx:click #cam:push #readroom #timer:8
#hint:This photo will hang in the hall for thirty years. Every visitor will see it. Every visitor will ask.
* [Smile properly #flavour:For the next thirty years.]
    ~ xmas_photo = "smile"
    ~ score(4, 0, -3)
    You smile. A real one. Mummy, beside you, smiles the same smile. #expr:child=happy #expr:mum=approve #focus:child
* [Bunny ears behind Daddy's head #flavour:For the next thirty years.]
    ~ xmas_photo = "bunny"
    ~ score(-2, 0, 2)
    Two fingers rise behind Daddy's head. Auntie Efua sees them. Auntie Efua does not tell. #expr:child=smug #expr:auntie=laugh #focus:child #emote:auntie=sparkle
* [Close your eyes at exactly the right moment #flavour:You have practised this.]
    ~ xmas_photo = "eyes"
    ~ score(1, 0, -1)
    You close your eyes. On purpose. You are an expert. #expr:child=eyesclosed #focus:child
    {tv_reaction == "eyes":
        Mummy: Ah. The kissing-scene eyes. #expr:mum=laugh #focus:mum
    }
* [Look at Mummy #timeout #flavour:She is fixing your collar.]
    ~ xmas_photo = "mummy"
    ~ score(3, 0, -1)
    You look at Mummy. Mummy is fixing your collar. You are both looking at each other when... #expr:mum=approve #expr:child=happy #focus:mum
- FLASH. #fx:flash #sfx:click #focus:none #cam:wide #insert:framed_family_photo
-> years_later

= years_later
Years later. #light:evening #cast:none #cam:photo #amb:hall #sfx:title
The Christmas photo hangs in the hall. Every visitor stops in front of it. #insert:framed_family_photo
{
- xmas_photo == "bunny":
    Every visitor asks about the bunny ears. Daddy still says he didn't know.
- xmas_photo == "eyes":
    Every visitor asks why Nana's eyes are closed. Mummy says, "That one? That one is a long story."
- xmas_photo == "mummy":
    In the photo, everybody is looking at the camera. Except you and Mummy. You are looking at each other.
- else:
    In the photo, everybody is smiling. Even Daddy. Especially Auntie Efua.
}
In a Ghanaian household, even the smallest decision can become everybody's business. #cam:wide
This year, all of them did.
-> report
