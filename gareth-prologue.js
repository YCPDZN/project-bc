/* A standalone opening before Enter Brent Cross. No route is chosen here. */
const GARETH_PROLOGUE_LINES=[
 "Normal. There hasn't been a normal since the riots ended. The Cabinet Office didn't just take over Parliament. They chained it. Richards is rewriting the rules of the entire country every single day, and somehow we're expected to come into work, straighten our ties and pretend this is simply another change of government. I can't shake this feeling that the ground is moving underneath us, even when everyone insists we're standing on solid ground.",
 "I used to think the frightening part would be the noise. The smashed windows, the shouting, the sirens that never seemed to stop. But it's the quiet afterwards that gets to me. People lower their voices when they mention him. They check who's standing behind them. A country doesn't recover because everyone has stopped arguing. Sometimes it has simply learned what happens to the people who refuse to be quiet.",
 "Look at what we've started calling order. Gates where there used to be entrances. Armed men where there used to be reception desks. Another instruction, another restriction, another perfectly reasonable explanation for why something you could do yesterday is forbidden today. Every measure is temporary until the next measure arrives. Then the old one becomes normal, and we're told we should be grateful that things aren't worse.",
 "And Richards stands above it all as if doubt is a weakness other people suffer from. He doesn't speak like a man asking the country to trust him. He speaks like a man announcing what the country has already decided. What does the future look like under someone who thinks he's a god? What happens when a mistake stops being a mistake because the man who made it refuses to admit he can be wrong?",
 "I keep thinking about the people outside these offices. The ones trying to pay the rent, find a doctor, get their children home before another street is sealed off. They aren't pieces on a map. They don't get another life because somebody in a grand room calls their suffering necessary. We were supposed to make the country work for them. When did keeping the government standing become more important than the people underneath it?",
 "The paperwork makes it worse, in a way. It gives everything such clean edges. You can ruin a life with a paragraph and still leave the office with spotless hands. Someone changes a heading, someone approves a list, someone says the proper authority has signed it. Then nobody feels responsible. I know how easy it is to hide behind a procedure. That's what frightens me: I know how ordinary the people doing it can be.",
 "And I can't stand here pretending I'm innocent of it. I'm still wearing the suit. I'm still walking through the doors. I've told myself that staying close to the machinery means I might stop something worse from happening. Perhaps that's true. Perhaps it's the excuse a coward gives himself when leaving would cost him something. I don't know which answer I fear more, and every day I put off finding out.",
 "It isn't only Britain, either. The whole world seems to be holding its breath, watching to see how much a government can take before people stop calling it a government at all. Every crisis becomes permission. Every frightened crowd becomes an opportunity. If a man can put chains around Parliament and call it salvation, what lesson do the men watching from elsewhere take from that? Not the lesson I want them to learn.",
 "I keep asking myself what happens next. Not the next announcement. Not the next speech with all the right words in it. I mean the morning when someone we know disappears from the office and nobody asks where they've gone. The day loyalty isn't enough, because loyalty has to be proved again. Are we protecting ourselves by keeping our heads down, or are we just waiting for our own turn to be bound by those chains?",
 "I don't have a clever answer. I wish I did. I wish I could look myself in the eye and say there's a plan, that someone knows where the line is and will stop him before he crosses it. All I know is that I remember what this country was supposed to be, and I'm not ready to pretend this is it. Brent Cross is where they're taking us next. Before those doors close behind me, I need to decide how much of myself I'm willing to leave outside.",
 "Brent Cross. It's in Hendon, in north-west London. It used to be a shopping centre: shop windows, food courts, people going about their lives. Now the Cabinet Office has turned it into a government complex. Same place on the map. A very different reason to be afraid of what's inside.",
 "People have started calling it Downing Street 2.0. They say it like it's a joke, but I'm not laughing. Once a shopping centre becomes the heart of a regime, you start wondering what else they'll take, and whether those doors still open both ways."
];
const GARETH_PROLOGUE_AUDIO=[
 'assets/PROLOGUE-GW1.mp3','assets/PROLOGUE-GW2.mp3','assets/PROLOGUE-GW3.mp3','assets/PROLOGUE-GW4.mp3','assets/PROLOGUE-GW5.mp3',
 'assets/PROLOGUE-GW6.mp3','assets/PROLOGUE-GW7.mp3','assets/PROLOGUE-GW8.mp3','assets/PROLOGUE-GW9.mp3','assets/PROLOGUE-GW10.mp3',
 'assets/PROLOGUE-GW11.mp3','assets/PROLOGUE-GW12.mp3'
].map(src=>{const clip=new Audio(src);clip.preload='metadata';clip.volume=.9;AudioOptions.category(clip,'voice');return clip;});
function stopGarethPrologueVoice(){for(const clip of GARETH_PROLOGUE_AUDIO){clip.pause();clip.currentTime=0;}}
let garethPrologueScene=null;
const garethPrologueUI=document.createElement('section');garethPrologueUI.id='garethPrologueCinema';garethPrologueUI.hidden=true;garethPrologueUI.setAttribute('aria-label','Prologue / Gareth Williams');
garethPrologueUI.innerHTML='<header><div><small>BEFORE CHAPTER 1</small><h2>PROLOGUE</h2></div><nav aria-label="Prologue controls"><button id="garethPrologueNext" type="button">NEXT LINE · ENTER</button><button id="garethPrologueSkip" type="button">SKIP PROLOGUE</button><button id="garethPrologueBack" type="button">MAIN MENU</button></nav></header><div class="gareth-prologue-subtitles"><div class="gareth-prologue-speaker"><strong>GARETH WILLIAMS</strong><span id="garethPrologueCount"></span></div><p id="garethPrologueLine"></p><div class="gareth-prologue-track"><i id="garethPrologueProgress"></i></div><small>ENTER / SPACE: NEXT LINE · H: CONTROLS · ESC: MAIN MENU</small></div>';
document.body.append(garethPrologueUI);
function refreshGarethPrologueCard(){const card=$('chapterPrologue');if(card)card.hidden=false;const status=$('garethPrologueStatus');if(status)status.textContent=gameProgress.garethPrologueViewed?'REPLAY / GARETH WILLIAMS':'OPENING CINEMATIC / GARETH WILLIAMS';}
function clearGarethPrologue(){
 const c=garethPrologueScene;if(!c)return;
 stopGarethPrologueVoice();
 garethPrologueScene=null;garethPrologueUI.hidden=true;disposeCampObject(c.root);
 scene.background=c.background;scene.fog=c.fog;ambient.intensity=c.ambient;cameraFill.intensity=c.fill;camera.up.set(0,1,0);
}
function startGarethPrologue(fromChapters=false){
 const returnToChapters=fromChapters===true,returnSubject=selectedSubject;
 menu();setMode('garethPrologue');document.exitPointerLock?.();keys.clear();
 world.visible=upperWorld.visible=exhibit.visible=flash.visible=false;
 for(const actor of [subject,peter,alissa,gareth,stephen,chrisMenu,mariahMenu,garethJonesMenu,emmaMenu,kevinMenu,kevinRevealed,elizabethMenu,damianMenu,davidMenu])actor.visible=false;
 const root=new THREE.Group();scene.add(root);
 const actor=makeGareth(false);root.add(actor);actor.rotation.y=-.07;
 const c=garethPrologueScene={root,actor,line:0,lineTime:0,time:0,returnToChapters,returnSubject,background:scene.background.clone(),fog:scene.fog?.clone()||null,ambient:ambient.intensity,fill:cameraFill.intensity};
 const wall=mat(0x24232b),wood=mat(0x362b31),frame=mat(0x11181f);
 box(root,12,.15,12,mat(0x201d25),0,-.12,0);box(root,12,4.6,.15,wall,0,2.15,-3.5);box(root,.15,4.6,12,wall,-6,2.15,0);box(root,.15,4.6,12,wall,6,2.15,0);box(root,12,.15,12,wall,0,4.5,0);
 box(root,5.1,2.7,.1,frame,1.6,2.35,-3.35);box(root,4.8,2.4,.025,new THREE.MeshBasicMaterial({color:0x152943}),1.6,2.35,-3.27);
 for(const x of [-.8,.8,2.4,4])box(root,.06,2.65,.06,frame,x,2.35,-3.20);
 box(root,5.1,.055,.07,frame,1.6,2.35,-3.20);
 // A distant, stylised Westminster silhouette beyond the office window.
 const skyline=mat(0x090f1a);for(let i=0;i<13;i++)box(root,.28,.55+(i%3)*.12,.04,skyline,-.5+i*.31,1.35,-3.18);
 box(root,.23,1.25,.04,skyline,2.72,1.77,-3.17);const spire=mesh(new THREE.ConeGeometry(.17,.45,4),skyline,root,2.72,2.61,-3.17);spire.rotation.y=Math.PI/4;
 box(root,2.4,.12,1.1,wood,-2.6,.8,-.4);for(const x of [-3.5,-1.7])box(root,.09,.8,.09,frame,x,.35,-.4);
 box(root,.6,.035,.45,mat(0xc9c2b2),-2.4,.885,-.35);box(root,.62,.03,.45,mat(0x681b33),-2.9,.875,-.45);
 const key=new THREE.PointLight(0xf3d3b1,22,10);key.position.set(-2,3.3,3.1);root.add(key);
 const rim=new THREE.PointLight(0x5b8dc9,12,9);rim.position.set(2.7,2.9,-1);root.add(rim);
 c.mouth=makeBustersSpeechMouth(actor);
 scene.background=new THREE.Color(0x0a101c);scene.fog=new THREE.FogExp2(0x111522,.02);ambient.intensity=.65;cameraFill.intensity=.16;
 garethPrologueUI.hidden=false;showGarethPrologueLine();renderGarethPrologue(0);updateMobileControls();
}
function showGarethPrologueLine(){
 const c=garethPrologueScene;if(!c)return;stopGarethPrologueVoice();c.lineTime=0;c.voiceFailed=false;c.voiceGap=0;c.timeline=beforeStorySpeechTimeline(GARETH_PROLOGUE_LINES[c.line]);
 const clip=GARETH_PROLOGUE_AUDIO[c.line],line=c.line;if(clip){clip.muted=muted;clip.play()?.catch(()=>{if(garethPrologueScene===c&&c.line===line)c.voiceFailed=true;});}
 $('garethPrologueLine').textContent=GARETH_PROLOGUE_LINES[c.line];$('garethPrologueCount').textContent=String(c.line+1).padStart(2,'0')+' / '+GARETH_PROLOGUE_LINES.length;
 $('garethPrologueNext').textContent=c.line===GARETH_PROLOGUE_LINES.length-1?'FINISH PROLOGUE →':'NEXT LINE · ENTER';
 c.mouth.level=0;c.mouth.open.visible=false;c.mouth.closed.visible=true;
}
function returnFromGarethPrologue(completed=false,toMenu=false){
 const c=garethPrologueScene;if(!c)return;
 if(completed){gameProgress.garethPrologueViewed=true;saveProgress();}
 clearGarethPrologue();menu();selectSubject(c.returnSubject);refreshGarethPrologueCard();
 if(c.returnToChapters&&!toMenu&&!$('openChapters').hidden)openChapterPicker();
 else $('openGarethPrologueMenu').focus();
}
function finishGarethPrologue(){returnFromGarethPrologue(true);}
function advanceGarethPrologue(){const c=garethPrologueScene;if(!c)return;if(++c.line>=GARETH_PROLOGUE_LINES.length)finishGarethPrologue();else showGarethPrologueLine();}
function renderGarethPrologue(dt){
 const c=garethPrologueScene;if(!c)return;c.time+=dt;c.lineTime+=dt;
 const a=c.actor,u=a.userData;animateCharacter(c.time,false,false,a);
 u.head.rotation.x=.025+Math.sin(c.time*1.7)*.025;u.head.rotation.y=Math.sin(c.time*.6)*.035;
 u.arms[0].rotation.x=-.27-Math.max(0,Math.sin(c.time*1.5))*.18;u.arms[0].rotation.z=-.13;
 u.arms[1].rotation.x=-.13-Math.max(0,Math.sin(c.time*1.1+.8))*.22;u.arms[1].rotation.z=.11;
 const clip=GARETH_PROLOGUE_AUDIO[c.line],envelope=GARETH_PROLOGUE_ENVELOPES[c.line];let target=0;
 if(clip)clip.muted=muted;
 const fallback=!clip||c.voiceFailed||!!clip.error;
 if(clip&&!fallback&&!clip.paused&&!clip.ended&&clip.readyState>=2){const frame=clip.currentTime/envelope.step,index=Math.floor(frame),mix=frame-index;target=(envelope.levels[index]||0)*(1-mix)+(envelope.levels[index+1]||0)*mix;}
 else if(fallback){const word=c.timeline.words.find(w=>c.lineTime>=w.start&&c.lineTime<w.end);if(word){const p=(c.lineTime-word.start)/(word.end-word.start);target=Math.abs(Math.sin(p*Math.PI*word.syllables))*.7*Math.min(1,p*8,(1-p)*8);}}
 c.mouth.level+=(target-c.mouth.level)*(1-Math.exp(-dt*28));c.mouth.open.visible=c.mouth.level>.025;c.mouth.closed.visible=!c.mouth.open.visible;c.mouth.open.scale.y=.006+c.mouth.level*.03;if(u.openMouth)u.openMouth.visible=false;
 camera.up.set(0,1,0);camera.position.set(.2+Math.sin(c.time*.12)*.12,2.05,3.05-Math.min(.2,c.line*.018));camera.lookAt(0,1.65,0);camera.updateMatrixWorld(true);
 const duration=clip&&!fallback?(Number.isFinite(clip.duration)?clip.duration:envelope.duration):Math.max(c.timeline.duration+1.6,envelope?.duration||0);
 const position=clip&&!fallback?clip.currentTime:c.lineTime;$('garethPrologueProgress').style.width=Math.min(100,position/duration*100)+'%';
 if(clip&&!fallback){if(clip.ended)c.voiceGap+=dt;else c.voiceGap=0;if(c.voiceGap>=.3)advanceGarethPrologue();}
 else if(c.lineTime>=duration)advanceGarethPrologue();
}
$('garethPrologueNext').onclick=advanceGarethPrologue;$('garethPrologueSkip').onclick=finishGarethPrologue;$('garethPrologueBack').onclick=()=>returnFromGarethPrologue(false,true);$('openGarethPrologue').onclick=()=>startGarethPrologue(true);$('openGarethPrologueMenu').onclick=()=>startGarethPrologue();
document.addEventListener('keydown',e=>{if(mode!=='garethPrologue'||e.repeat)return;if(e.code==='Escape'){e.preventDefault();returnFromGarethPrologue(false,true);}else if(['Enter','Space'].includes(e.code)&&!e.target.closest('button')){e.preventDefault();advanceGarethPrologue();}});
refreshGarethPrologueCard();
