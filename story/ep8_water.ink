// =====================================================================
//  EPISODE EIGHT: THE WATER YOU FORGOT TO FETCH
//  Sunday night into Monday. The tap only runs at night, and only
//  sometimes. Tonight it runs at 2 AM. Filling the drum is Nana's job.
//  At 5:40 AM, Daddy needs a bath and Mummy needs to cook.
// =====================================================================

=== ep8 ===
#episode:8 #scene:bedroom #light:moon #cast:child #cam:bed #amb:night #prop:lamp=off #prop:keyhole=off #outfit:child=none #outfit:friend=none
#card:Episode Eight/The Water You Forgot to Fetch/Sunday night · 2:10 AM
2:10 AM. Somewhere outside, a sound like a river in a pipe. #sfx:splash #expr:child=eyesclosed #focus:child
The water has come. #auto:1600 #focus:none #cam:window
Your bed is warm. The compound is cold. The mosquito net is like a hug. #cam:bed #expr:child=eyesclosed #emote:child=dots #readroom #timer:10
#hint:In this house the tap runs at night, and only sometimes. Daddy bathes at six. Mummy cooks at six.
* [Get up and fill the drum #flavour:A job is a job.]
    ~ drum = "filled"
    ~ score(6, 0, -4)
    You get up. Your feet find the cold floor. Your heart finds its courage. #expr:child=strain #anim:child=slump #focus:child
    -> night_shift
* [Fill one bucket, then back to bed #flavour:Half a job is still a job.]
    ~ drum = "bucket"
    ~ score(1, 1, -1)
    One bucket. Just one. You are back under the net before the mosquitoes notice. #expr:child=sneak #sfx:splash #focus:none
    -> morning
* [Five more minutes #timeout #flavour:The water will wait.]
    ~ drum = "slept"
    ~ score(-2, 0, 1)
    Five more minutes. #expr:child=eyesclosed #sfx:snore #focus:none
    The water does not wait. #sfx:splash #auto:1400
    -> morning

= night_shift
The compound at night. The moon, the drum, the tap, and you. #scene:compound #light:moon #cast:child@70 #cam:drum #amb:night #transition:iris
Bucket. Tap. Splash. Drum. Again. And again. #sfx:splash #expr:child=strain #anim:child=bounce
Your arms are on fire. The drum is full. #sfx:splash #expr:child=proud #emote:child=sparkle #cam:wide
#moment:night_shift/The Night Shift
You go back to bed like a soldier home from war. #focus:none #sfx:yawn
-> morning

// ---- Monday morning ----------------------------------------------------

= morning
5:40 AM. A cockerel decides it is Monday. #scene:compound #light:dusk #cast:child@30,dad@62 #cam:wide #amb:compound #sfx:rooster #expr:dad=hands_on_hips #expr:child=neutral
Daddy comes out with his towel on his shoulder and his bucket in his hand. #focus:dad
{
- drum == "filled":
    -> full_drum
- drum == "bucket":
    -> one_bucket
- else:
    -> empty_drum
}

= full_drum
Daddy opens the drum. Full. To the top. #cam:drum #sfx:splash #expr:dad=delight #focus:dad #emote:dad=sparkle
Daddy: Who filled the drum? #expr:dad=approve
Nana: Me, Daddy. At two o'clock. #expr:child=proud #focus:child
Daddy: At two o'clock! This one is going to be a minister. #expr:dad=laugh #focus:dad #sticker:dad=good_child #sfx:good
Then the gate. #sfx:knock #cam:gate #focus:none
{friend}'s Mother: Esi! Good morning! The water didn't reach our side last night. #cast:friendmum@30,child@46,dad@62 #cam:wide #expr:friendmum=wave #focus:friendmum
{friend}'s Mother: Please, just two buckets. For {friend}'s school bath. #expr:friendmum=hands_on_hips
Everybody looks at the drum. Your drum. Your two o'clock drum. #cam:wide #focus:none #readroom #timer:10
#hint:Mummy borrows salt from that house every week. Daddy borrows their ladder every month.
* [Give her two buckets #flavour:Neighbours are neighbours.]
    ~ drum_then = "gave"
    ~ score(5, 0, -3)
    You fill her buckets yourself. {friend}'s Mother blesses you, your children, and your children's children. #expr:friendmum=laugh #focus:friendmum #emote:friendmum=heart #sfx:splash
    Mummy, from the house: Good! #sfx:good
* [Charge her one hundred cedis a bucket #flavour:Two o'clock water is premium water.]
    ~ drum_then = "sold"
    ~ score(-4, 2, 3)
    Nana: Auntie, it's one hundred cedis a bucket. Two o'clock water. #expr:child=smug #focus:child
    {friend}'s Mother stares at you. Then at Daddy. #expr:friendmum=shocked #focus:friendmum #emote:friendmum=anger
    {change == "spent":
        {friend}'s Mother: Ah! The bofrot millionaire is now selling water! #expr:friendmum=point
    }
    Daddy: She will take it free. And you will carry it. #expr:dad=stern #focus:dad #sticker:child=oops
    #moment:water_vendor/Two O'Clock Water
* [Look at Daddy first #flavour:It's his bath water too.]
    ~ drum_then = "asked"
    ~ score(3, 1, -2)
    You look at Daddy. Daddy looks at his bucket. Daddy sighs. #expr:dad=think #focus:dad
    Daddy: Give her. I will bathe small-small. #expr:dad=approve
    Daddy bathes with exactly half a bucket, like a sparrow. He tells everybody at work. #focus:none #emote:dad=sparkle
- -> ep8_end

= one_bucket
One bucket. Next to the empty drum. #sfx:splash #focus:none #cam:drum
Mummy comes out with the cooking pot. Daddy is holding his towel. You have school at seven. #cast:child@30,mum@46,dad@62 #cam:wide #expr:mum=stern #expr:dad=hands_on_hips
One bucket. Three people. #readroom #timer:10
#hint:Daddy has a meeting at nine. Mummy's koko feeds everybody. Madam inspects ears.
* [Give it to Daddy #flavour:He has a meeting.]
    ~ drum_then = "dad"
    ~ score(3, 0, -2)
    Daddy takes the bucket like a trophy. #expr:dad=delight #focus:dad
    You go to school with a wiped face and a strong spirit. #expr:child=flat #focus:child
* [Give it to Mummy for the koko #flavour:Everybody eats.]
    ~ drum_then = "mum"
    ~ score(4, 0, -2)
    Mummy takes the bucket. The koko is made. Everybody eats. #expr:mum=approve #focus:mum #sfx:good
    Daddy bathes with the water from the kettle, one cup at a time. #expr:dad=flat #focus:dad
* [Keep it for your own bath #flavour:Madam inspects ears.]
    ~ drum_then = "self"
    ~ score(-3, 0, 2)
    You disappear into the bathroom with the only bucket. #expr:child=sneak #sfx:door #cast:mum@46,dad@62
    Daddy: Did that child just take the whole bucket? #expr:dad=shocked #focus:dad
    Mummy: Your child. #expr:mum=flat #focus:mum
    #moment:only_bucket/The Only Bucket
- -> ep8_end

= empty_drum
Daddy opens the drum. #sfx:thump #focus:dad
Empty. Not even a mosquito. #expr:dad=shocked #emote:dad=shock #cam:drum
Daddy turns the tap. A sad little cough. Nothing. #focus:none #cam:wide
Daddy: Nana. #expr:dad=stern #focus:dad #sfx:heartbeat
Behind the drum, the empty bucket you were supposed to fill. #expr:child=panic #emote:child=sweat #focus:child #readroom #timer:10
#hint:Daddy is wearing only a towel. He has a meeting at nine. He is not in a joking mood.
* [Hide the empty bucket behind your back #flavour:What bucket?]
    ~ drum_then = "hid"
    ~ score(-6, 0, 6)
    You hide the bucket behind your back. It is bigger than your back. #expr:child=sneak #anim:child=shake
    Daddy: What is that behind you? #expr:dad=scold #focus:dad
    Nana: Nothing, Daddy. #focus:child
    The bucket falls over. CLANG. #sfx:thump #fx:impact #sticker:dad=akola_bone #focus:none
    #moment:invisible_bucket/The Invisible Bucket
* [Tell Daddy the truth #flavour:You slept. Say it.]
    ~ drum_then = "truth"
    ~ score(3, 0, -3)
    Nana: Daddy... the water came. I slept. I'm sorry. #expr:child=worried #focus:child
    Daddy breathes in. Daddy breathes out. #expr:dad=think #focus:dad #auto:1600
    Daddy: Thank you for not lying. Tonight, you sit by that tap until it runs. #expr:dad=stern
* [Run to borrow from your friend's house #flavour:Fast feet. Big smile.]
    ~ drum_then = "borrowed"
    ~ score(1, 2, 0)
    You grab two buckets and run. #expr:child=run #sfx:whoosh #cast:dad@62 #focus:none
    You come back slowly. Very slowly. Two full buckets. #cast:child@30,dad@62 #expr:child=strain #anim:child=slump #sfx:splash
    Daddy: Where did this come from? #expr:dad=think #focus:dad
    {friend}'s Mother, from over the wall: Esi! Your child owes me two buckets! #sfx:sting
    Daddy: ...Thank you, Nana. And tonight, you will fill HER drum too. #expr:dad=laugh #focus:dad
    #moment:borrowed_water/Borrowed Water
- -> ep8_end

= ep8_end
Daddy leaves for work. #cam:wide #focus:none #cast:child,mum@60 #sfx:door
{
- drum_then == "self":
    Daddy leaves with a damp towel and a dry face.
- drum_then == "hid" || drum_then == "truth":
    Daddy leaves smelling of perfume. Only perfume.
- else:
    Daddy leaves fresh, and late.
}
Mummy: Tonight, the water comes again. #expr:mum=stern #focus:mum
Nana: I'll be awake, Mummy. #expr:child=proud #focus:child
{drum == "filled":
    Mummy: You were awake last night too. I heard you. #expr:mum=approve #focus:mum #emote:child=heart
}
-> ep9
