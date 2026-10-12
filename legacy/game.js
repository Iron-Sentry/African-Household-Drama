/* African Household Drama — original branching story prototype.
 * All story data and outcomes are authored here so chapters can grow easily.
 */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const root = $('world-panel');
  const dom = {
    start: $('start-btn'), intro: $('intro-overlay'), brand: $('brand-home'),
    location: $('scene-location'), title: $('scene-title'), caption: $('chapter-small'),
    sceneNum: document.querySelector('.scene-number'), fallback: $('fallback-scene'),
    mum: $('mum-sprite'), speaker: $('speaker-name'), avatar: $('speaker-avatar'),
    text: $('dialogue-text'), extra: $('dialogue-extra'), feedback: $('feedback'),
    choices: $('choices'), choicesHeading: $('choices-heading'), hint: $('choices-hint'),
    next: $('continue-btn'), nextText: $('continue-text'), mood: $('mood-status'),
    approval: $('stat-approval'), smarts: $('stat-smarts'), trouble: $('stat-trouble'),
    progress: $('progress-track'), progressCaption: $('progress-caption'), progressNum: $('progress-num'),
    tvBug: $('tv-bug'), toast: $('toast'), sound: $('sound-toggle'),
    soundText: $('sound-text'), soundIcon: $('sound-icon')
  };
  const STORY = {
    tv_open: {
      chapter: 1, scene: 'tv', speaker: 'NARRATOR', mood: 'PEACEFUL... FOR NOW',
      text: 'It is 1998. One TV. One sofa. One very dangerous family movie night.',
      extra: 'You are sitting with Mummy and Daddy in the hall. Nothing could possibly go wrong.',
      next: 'tv_mum', button: 'SETTLE IN'
    },
    tv_mum: {
      chapter: 1, scene: 'tv', speaker: 'MUMMY', mood: 'MUMMY IS WATCHING',
      text: '“Sit properly, and don’t let me hear any unnecessary noise.”',
      extra: 'She says this without even looking away from the television.',
      next: 'tv_dad', button: 'YES, MUMMY'
    },
    tv_dad: {
      chapter: 1, scene: 'tv', speaker: 'DADDY', mood: 'MOVIE TIME',
      text: '“Shhh. The film is starting. Who has the remote?”',
      extra: 'You lean forward. Finally, the interesting part…',
      next: 'tv_kiss', button: 'WATCH THE FILM'
    },
    tv_kiss: {
      chapter: 1, scene: 'tv', speaker: 'NARRATOR', mood: 'DANGER! DANGER!',
      text: 'EI! The people on the television have started KISSING. Your parents are right beside you.',
      extra: 'Daddy clears his throat. Mummy glances at you. You have exactly one move.',
      choices: [
        { label: 'Burst out laughing', flavour: 'You just cannot hold it in.', next: 'tv_laugh', score: { approval: -15, trouble: 18 }, notice: 'Mummy heard that laugh. -15 Approval · +18 Trouble', tone: 'negative' },
        { label: 'Immediately close your eyes', flavour: 'You saw absolutely nothing.', next: 'tv_eyes', score: { approval: 22, smarts: 15 }, notice: 'Excellent survival instincts! +22 Approval · +15 Street Smarts', tone: 'positive' },
        { label: 'Comment on the scene', flavour: '“Ei, Mummy! See what they are doing!”', next: 'tv_comment', score: { approval: -22, trouble: 26 }, notice: 'You said that OUT LOUD? -22 Approval · +26 Trouble', tone: 'negative' }
      ]
    },
    tv_laugh: {
      chapter: 1, scene: 'tv', speaker: 'MUMMY', mood: 'YOU ARE IN TROUBLE', warning: true,
      text: '“AKOLA BONE! What exactly is making you laugh? Do you have a problem?”',
      extra: 'Daddy slowly turns his head. The film has become the least of your worries.',
      next: 'tv_laugh_aftermath', button: 'OH, NOTHING, MUMMY'
    },
    tv_laugh_aftermath: {
      chapter: 1, scene: 'tv', speaker: 'DADDY', mood: 'PRIVILEGES REVOKED',
      text: '“If you have so much energy, go and bring your schoolbooks.”',
      extra: 'Your evening movie privilege has officially become a homework session.',
      next: 'neigh_open', button: 'THE NEXT DAY →'
    },
    tv_eyes: {
      chapter: 1, scene: 'tv', speaker: 'MUMMY', mood: 'GOLDEN CHILD MOMENT',
      text: '“Hmm. Good child. You know when to close your eyes.”',
      extra: 'A soft approving nod. You may remain in the hall. The ancestors are smiling.',
      next: 'tv_eyes_aftermath', button: 'OPEN ONE EYE'
    },
    tv_eyes_aftermath: {
      chapter: 1, scene: 'tv', speaker: 'NARRATOR', mood: 'MOVIE PRIVILEGE SAVED',
      text: 'You have survived the kissing scene. The movie continues. Life is beautiful.',
      extra: 'But one victory does not mean you understand all the rules of a Ghanaian home.',
      next: 'neigh_open', button: 'THE NEXT DAY →'
    },
    tv_comment: {
      chapter: 1, scene: 'tv', speaker: 'MUMMY', mood: 'MAXIMUM SIDE-EYE', warning: true,
      text: '“AKOLA BONE! Who asked you to do commentary? Go to your room!”',
      extra: 'You have managed to offend both parents, interrupt the movie, and end your own evening.',
      next: 'tv_comment_aftermath', button: 'LEAVE THE HALL'
    },
    tv_comment_aftermath: {
      chapter: 1, scene: 'tv', speaker: 'NARRATOR', mood: 'ROOM ARREST',
      text: 'The door closes. You hear the movie continue without you. Pain.',
      extra: 'Tomorrow is another day. Maybe the neighbourhood will be kinder. (It will not.)',
      next: 'neigh_open', button: 'THE NEXT DAY →'
    },
    neigh_open: {
      chapter: 2, scene: 'neigh', speaker: 'NARRATOR', mood: 'VISITING HOURS',
      text: 'The next afternoon, Mummy takes you to visit Auntie Efua next door.',
      extra: 'She reminds you to greet properly, sit nicely, and not embarrass her.',
      next: 'neigh_welcome', button: 'ENTER AUNTIE’S HOUSE'
    },
    neigh_welcome: {
      chapter: 2, scene: 'neigh', speaker: 'AUNTIE EFUA', mood: 'SUSPICIOUS GENEROSITY',
      text: '“Ah! Look how big you’ve grown! Do you want some biscuits and malt?”',
      extra: 'She places a whole tray on the table. Your stomach says YES. Your survival instincts say WAIT.',
      next: 'neigh_offer', button: 'LOOK AT THE TRAY'
    },
    neigh_offer: {
      chapter: 2, scene: 'neigh', speaker: 'NARRATOR', mood: 'READ THE ROOM',
      text: 'Auntie pushes the plate towards you. Mummy is sitting right there… watching.',
      extra: 'The biscuits look incredible. What is the correct household protocol?',
      choices: [
        { label: 'Take the biscuits immediately', flavour: 'Food is food!', next: 'neigh_grab', score: {approval:-14, trouble:15, smarts:-5}, notice:'You forgot to read the room. -14 Approval · +15 Trouble', tone:'negative' },
        { label: 'Check Mummy’s expression first', flavour: 'Eyes before appetite.', next: 'neigh_look', score: {smarts:18}, notice:'You noticed the real boss of this conversation. +18 Street Smarts', tone:'positive' },
        { label: 'Politely refuse everything', flavour: 'Better safe than sorry?', next: 'neigh_refuse', score: {approval:-4, trouble:7, smarts:3}, notice:'Safe... but now Auntie is offended. +7 Trouble', tone:'negative' }
      ]
    },
    neigh_grab: {
      chapter: 2, scene: 'neigh', speaker: 'MUMMY', mood: 'THE LOOK™', warning:true,
      text: '“Ei! Are we starving you at home? You haven’t even said thank you!”',
      extra: 'Auntie Efua laughs. You freeze with a biscuit halfway to your mouth.',
      next: 'ending', button: 'SEE YOUR REPORT CARD'
    },
    neigh_refuse: {
      chapter: 2, scene: 'neigh', speaker: 'AUNTIE EFUA', mood: 'AWKWARD SILENCE',
      text: '“Ei, why? Is my food not good enough for you?”',
      extra: 'Mummy gives you a puzzled look. Somehow you have caused trouble by saying no.',
      next: 'ending', button: 'SEE YOUR REPORT CARD'
    },
    neigh_look: {
      chapter: 2, scene: 'neigh', speaker: 'NARRATOR', mood: 'READ THE ROOM ACTIVATED', look: true,
      text: 'Mummy gives the tiniest nod and a very serious look. No one else seems to notice.',
      extra: 'Translation: You may accept ONE, politely. How do you respond?',
      choices: [
        { label: 'Take one and say “Thank you, Auntie”', flavour: 'Respectful. Elegant. Perfect.', next: 'neigh_winner', score: {approval:24, smarts:10}, notice:'Perfectly played! +24 Approval · +10 Street Smarts', tone:'positive' },
        { label: 'Take three biscuits and two malts', flavour: 'She nodded, didn’t she?', next: 'neigh_too_much', score: {approval:-12, trouble:17}, notice:'You misunderstood the assignment. +17 Trouble', tone:'negative' },
        { label: 'Keep staring at Mummy', flavour: 'Waiting for a written instruction.', next: 'neigh_overthink', score: {approval:2, smarts:-3}, notice:'The whole room is now staring at you.', tone:'negative' }
      ]
    },
    neigh_winner: {
      chapter: 2, scene: 'neigh', speaker: 'AUNTIE EFUA', mood: 'RESPECTFUL CHILD',
      text: '“Awww! This child has manners. You have trained your child well!”',
      extra: 'Mummy smiles. You receive biscuits, a malt, and rare public praise.',
      next: 'ending', button: 'SEE YOUR REPORT CARD'
    },
    neigh_too_much: {
      chapter: 2, scene: 'neigh', speaker: 'MUMMY', mood: 'OVERCONFIDENCE DETECTED', warning:true,
      text: '“Ah. Did I give you permission to carry the whole tray?”',
      extra: 'Auntie starts laughing. Your interpretation of the nod was a little ambitious.',
      next: 'ending', button: 'SEE YOUR REPORT CARD'
    },
    neigh_overthink: {
      chapter: 2, scene: 'neigh', speaker: 'AUNTIE EFUA', mood: 'SITUATION COMPLICATED',
      text: '“My dear, are you waiting for your mother to blink twice?”',
      extra: 'Everybody laughs. At least you did not cause major trouble.',
      next: 'ending', button: 'SEE YOUR REPORT CARD'
    }
  };
  let state;
  let soundEnabled = false;
  let audioCtx;
  let toastTimeout;
  const clamp=(n,min=0,max=100)=>Math.min(max,Math.max(min,n));
  const portraits={MUMMY:'mum.svg',DADDY:'dad.svg','AUNTIE EFUA':'auntie.svg',NARRATOR:'child.svg'};
  function resetState(){state={ current:'tv_open', chapter:1, approval:50, smarts:20, trouble:0, history:[], lastNotice:null, lastTone:null, stepsSeen:0};}
  function sfx(type='click') {
    if(!soundEnabled) return;
    try {
      audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();
      if(audioCtx.state==='suspended')audioCtx.resume();
      const now=audioCtx.currentTime;
      function note(freq, delay, dur, gain=.065, wave='sine'){
        const o=audioCtx.createOscillator(), g=audioCtx.createGain();
        o.type=wave;o.frequency.setValueAtTime(freq,now+delay);
        g.gain.setValueAtTime(0,now+delay);g.gain.linearRampToValueAtTime(gain,now+delay+.012);g.gain.exponentialRampToValueAtTime(.001,now+delay+dur);
        o.connect(g);g.connect(audioCtx.destination);o.start(now+delay);o.stop(now+delay+dur+.03);
      }
      if(type==='good'){note(450,0,.18);note(610,.12,.22);note(840,.26,.32)}
      else if(type==='bad'){note(225,0,.22,.08,'triangle');note(165,.16,.31,.06,'triangle')}
      else {note(360,0,.075,.035,'triangle')}
    } catch(e){/* sound never blocks gameplay */}
  }
  function notify(message){dom.toast.textContent=message;dom.toast.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>dom.toast.classList.remove('show'),2100);}
  function applyScore(change,notice,tone){
    Object.entries(change||{}).forEach(([key,value])=>{state[key]=clamp(state[key]+value);});
    state.lastNotice=notice||null;state.lastTone=tone||'';
    sfx(tone==='positive'?'good':tone==='negative'?'bad':'click');
    if(notice)notify(notice);
  }
  function updateStats(){
    dom.approval.textContent=String(state.approval).padStart(2,'0');
    dom.smarts.textContent=String(state.smarts).padStart(2,'0');
    dom.trouble.textContent=String(state.trouble).padStart(2,'0');
  }
  const progress={tv_open:5,tv_mum:12,tv_dad:20,tv_kiss:28,tv_laugh:36,tv_laugh_aftermath:42,tv_eyes:36,tv_eyes_aftermath:42,tv_comment:36,tv_comment_aftermath:42,neigh_open:51,neigh_welcome:60,neigh_offer:70,neigh_grab:89,neigh_refuse:89,neigh_look:78,neigh_winner:92,neigh_too_much:92,neigh_overthink:92,ending:100};
  function enterRoom(scene){
    const neigh=scene==='neigh';root.classList.toggle('neighbour',neigh);
    dom.fallback.style.backgroundImage=`url('../public/assets/room-${neigh?'neighbour':'tv'}.svg')`;
    dom.location.textContent=neigh?'AUNTIE EFUA’S HOUSE • 3:15 PM':'THE FAMILY HALL • 7:42 PM';
    dom.title.textContent=neigh?'THE NEIGHBOUR’S BISCUIT':'THE KISSING SCENE';
    dom.caption.textContent=neigh?'CHAPTER 02':'CHAPTER 01';
    dom.sceneNum.innerHTML=`${neigh?'02':'01'}<span>/</span>02`;
    dom.tvBug.innerHTML=neigh?'<span class="blink-red">●</span> VISITING HOURS':'<span class="blink-red">●</span> LIVE FROM THE HALL';
    window.AHD3D?.setRoom?.(scene);
  }
  function render(){
    const id=state.current;
    if(id==='ending'){renderEnding();return;}
    const step=STORY[id];if(!step)return;
    enterRoom(step.scene);
    root.classList.toggle('mum-warning',!!step.warning);
    dom.mum.src=`../public/assets/${step.warning||step.look?'mum-sideeye':'mum'}.svg`;
    dom.speaker.textContent=step.speaker==='MUMMY'?'MUMMY':step.speaker==='DADDY'?'DADDY':step.speaker==='AUNTIE EFUA'?'AUNTIE EFUA':'THE NARRATOR';
    dom.avatar.innerHTML=`<img src="../public/assets/${portraits[step.speaker]||'child.svg'}" alt="" />`;
    dom.text.textContent=step.text;
    dom.extra.textContent=step.extra||'';
    dom.mood.textContent=step.mood;
    dom.feedback.hidden=!state.lastNotice;
    if(state.lastNotice){dom.feedback.textContent=state.lastNotice;dom.feedback.className=`feedback ${state.lastTone||''}`;}
    dom.choices.replaceChildren();
    const hasChoices=!!step.choices;
    dom.choicesHeading.textContent=hasChoices?'MAKE YOUR CHOICE':'THE STORY CONTINUES';
    dom.hint.textContent=hasChoices?'PICK YOUR MOVE ↓':'YOUR NEXT CHAPTER →';
    dom.next.hidden=hasChoices;
    if(hasChoices){
      step.choices.forEach((option,index)=>{
        const btn=document.createElement('button');btn.className='choice-btn';btn.type='button';
        const num=document.createElement('span');num.className='choice-index';num.textContent=String(index+1).padStart(2,'0');
        const main=document.createElement('span');main.className='choice-label';main.textContent=option.label;
        const arrow=document.createElement('span');arrow.className='choice-arrow';arrow.textContent='↗';
        btn.append(num,main,arrow);btn.title=option.flavour||option.label;
        btn.setAttribute('aria-label',`${index+1}. ${option.label}${option.flavour?'. '+option.flavour:''}`);
        btn.addEventListener('click',()=>choose(index));dom.choices.append(btn);
      });
    }else dom.nextText.textContent=step.button||'CONTINUE';
    updateStats();
    const p=progress[id]||0;dom.progress.style.width=p+'%';dom.progressNum.textContent=String(p).padStart(2,'0')+'%';
    dom.progressCaption.textContent=step.chapter===1?'EPISODE 01 · THE FAMILY HALL':'EPISODE 02 · VISITING AUNTIE';
  }
  function go(id){state.current=id;state.lastNotice=null;state.lastTone=null;state.stepsSeen++;render();}
  function choose(index){
    const step=STORY[state.current];if(!step||!step.choices)return;
    const option=step.choices[index];if(!option)return;
    state.history.push({chapter:step.chapter,prompt:step.text,choice:option.label});
    applyScore(option.score,option.notice,option.tone);
    const notice=state.lastNotice, tone=state.lastTone;
    go(option.next);
    state.lastNotice=notice;state.lastTone=tone;
    dom.feedback.hidden=!notice;dom.feedback.className=`feedback ${tone}`;dom.feedback.textContent=notice||'';
  }
  function getRank(){
    if(state.approval>=70&&state.smarts>=55&&state.trouble<=15)return{label:'THE GOLDEN CHILD',emoji:'✷',copy:'You read the room, respected the signals, and earned household legend status. Even Auntie is impressed.'};
    if(state.trouble>=30)return{label:'AKOLA BONE!',emoji:'!',copy:'You collected side-eyes like trophies. Everybody has a story about you, and Mummy remembers all of them.'};
    if(state.smarts>=48)return{label:'THE LITTLE STRATEGIST',emoji:'✦',copy:'Not every choice was perfect, but you know how to read the room. A future household diplomat.'};
    return{label:'THE FAMILY COMEDIAN',emoji:'☺',copy:'Your childhood is full of lessons, laughter, and those moments the family will never let you forget.'};
  }
  function renderEnding(){
    enterRoom('neigh');root.classList.remove('mum-warning');dom.mum.src='../public/assets/mum.svg';
    const rank=getRank();
    dom.speaker.textContent='YOUR REPORT CARD';dom.avatar.textContent=rank.emoji;
    dom.text.textContent=rank.label;dom.extra.textContent=rank.copy;
    dom.mood.textContent='STORY COMPLETE';
    dom.feedback.hidden=false;dom.feedback.className='feedback positive';dom.feedback.textContent=`You survived two household episodes and made ${state.history.length} big decisions.`;
    dom.choicesHeading.textContent='YOUR FINAL HOUSEHOLD SCORES';dom.hint.textContent='CAN YOU DO BETTER?';
    dom.choices.replaceChildren();
    const line=document.createElement('div');line.className='end-score';line.innerHTML='<strong>✳ END OF VOLUME ONE</strong><span>Your choices changed the ending. Replay to discover a different fate.</span>';
    dom.choices.append(line);
    dom.next.hidden=false;dom.nextText.textContent='REPLAY THE STORY';
    dom.progress.style.width='100%';dom.progressNum.textContent='100%';dom.progressCaption.textContent='VOLUME ONE COMPLETED';
    updateStats();sfx('good');
  }
  dom.next.addEventListener('click',()=>{
    if(state.current==='ending'){restart();return;}
    const step=STORY[state.current];if(step&&step.next){sfx('click');go(step.next);}
  });
  function start(){dom.intro.classList.add('is-hidden');dom.intro.setAttribute('aria-hidden','true');go('tv_open');sfx('good');}
  function restart(){resetState();go('tv_open');sfx('click');}
  dom.start.addEventListener('click',start);
  dom.brand.addEventListener('click',ev=>{ev.preventDefault();dom.intro.classList.remove('is-hidden');dom.intro.removeAttribute('aria-hidden');resetState();render();});
  dom.sound.addEventListener('click',()=>{soundEnabled=!soundEnabled;dom.soundText.textContent=soundEnabled?'SOUND ON':'SOUND OFF';dom.soundIcon.textContent=soundEnabled?'♫':'♪';if(soundEnabled)sfx('good');});
  document.addEventListener('keydown',ev=>{
    if(ev.altKey||ev.ctrlKey||ev.metaKey||ev.repeat)return;
    if(!dom.intro.classList.contains('is-hidden')){if(ev.key==='Enter'){ev.preventDefault();start();}return;}
    if(['1','2','3'].includes(ev.key)&&STORY[state.current]?.choices){choose(Number(ev.key)-1);}
    else if(ev.key==='Enter'&&!STORY[state.current]?.choices){dom.next.click();}
  });
  resetState();render();
})();
