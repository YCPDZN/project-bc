const UXBRIDGE_MARIAH_COMBAT_LINES=[
 'Kevin sent you ahead because he knows what happens to the people standing beside him!',
 'Gareth escaped one execution squad, only to find you and your master waiting. You call that freedom?',
 'Watch both hands. I didn’t survive Josiah’s regime by fighting fair!',
 'You’re bleeding for a man who won’t even enter the room. Think about that!',
 'I will not kneel to Josiah, Kevin, or you. If this is my last stand, you’ll remember it!'
];
const UXBRIDGE_JONES_INTRO='Mariah, you are not facing this alone. Kevin has used enough people already. If you want to get to her, you will have to get through me as well.';
const UXBRIDGE_JONES_COMBAT_LINES=[
 'I taught people to serve the public. Kevin taught you to serve his ambition!',
 'Mariah, keep moving! I’ll cover you while you reload!',
 'You followed his orders through a hundred rooms. Have you asked yourself why he stayed behind?',
 'I have watched too many decent people become someone else’s weapon. Put yours down!',
 'You will not finish the Resistance in this room. Not while I can still stand!'
];
const uxbridgeMariahIntroClips=['assets/CH4MB1.mp3','assets/CH4MB2.mp3','assets/CH4MB3.mp3','assets/CH4MB4.mp3'].map(uxbridgeRoomClip);
const uxbridgeMariahCombatClips=['assets/CH4MBBF1.mp3','assets/CH4MBBF2.mp3','assets/CH4MBBF3.mp3','assets/CH4MBBF4.mp3','assets/CH4MBBF5.mp3'].map(uxbridgeRoomClip);
const uxbridgeMariahEndingClips=['assets/CH4MBFC1.mp3','assets/CH4MBFC2.mp3','assets/CH4MBFC3.mp3','assets/CH4MBFC4.mp3'].map(uxbridgeRoomClip);
const uxbridgeJonesIntroClip=uxbridgeRoomClip('assets/CH4MBGJ1.mp3');
const uxbridgeJonesCombatClips=['assets/CH4MBGJ1BF1.mp3','assets/CH4MBGJ1BF2.mp3','assets/CH4MBGJ1BF3.mp3','assets/CH4MBGJ1BF4.mp3','assets/CH4MBGJ1BF5.mp3'].map(uxbridgeRoomClip);
const uxbridgeRoomSpeechSources=new WeakMap();
function uxbridgeRoomClip(src){const a=new Audio(src);a.preload='metadata';a.volume=.9;AudioOptions.category(a,'voice');return a;}
function resetUxbridgeRoomMouths(){
 const b=redRooms?.mariahFight;if(!b)return;
 for(const mouth of [b.mouth,b.jones?.mouth])if(mouth){mouth.open.visible=false;mouth.closed.visible=true;mouth.level=0;}
}
function stopUxbridgeRoomVoice(){
 const b=redRooms?.mariahFight;for(const a of [...uxbridgeMariahIntroClips,...uxbridgeMariahCombatClips,...uxbridgeMariahEndingClips,uxbridgeJonesIntroClip,...uxbridgeJonesCombatClips]){a.pause();a.currentTime=0;}
 if(b)b.voice=null;resetUxbridgeRoomMouths();$('redRoomCombatDialogue').hidden=true;
}
function playUxbridgeRoomVoice(kind,index=0){
 stopUxbridgeRoomVoice();const b=redRooms?.mariahFight;if(!b)return;
 const isJones=kind.startsWith('jones'),text=kind==='intro'?UXBRIDGE_MARIAH_LINES[index]:kind==='mariahCombat'?UXBRIDGE_MARIAH_COMBAT_LINES[index]:kind==='mariahEnding'?UXBRIDGE_MARIAH_ENDING_LINES[index]:kind==='jonesIntro'?UXBRIDGE_JONES_INTRO:UXBRIDGE_JONES_COMBAT_LINES[index];
 const clip=kind==='intro'?uxbridgeMariahIntroClips[index]:kind==='mariahCombat'?uxbridgeMariahCombatClips[index]:kind==='mariahEnding'?uxbridgeMariahEndingClips[index]:kind==='jonesIntro'?uxbridgeJonesIntroClip:kind==='jonesCombat'?uxbridgeJonesCombatClips[index]:null;
 const v=b.voice={kind,index,text,clip,actor:isJones?b.jones.actor:redRooms.mariah,mouth:isJones?b.jones.mouth:b.mouth,elapsed:0,failed:false,done:false,paused:false};
 if(kind==='intro'||kind==='jonesIntro'||kind==='mariahEnding'){$('redRoomMariahSpeaker').textContent=isJones?'GARETH JONES':'MARIAH BANU';$('redRoomMariahLine').textContent=text;}
 else{$('redRoomCombatSpeaker').textContent=isJones?'GARETH JONES':'MARIAH BANU';$('redRoomCombatLine').textContent=text;$('redRoomCombatDialogue').hidden=false;}
 if(clip){
  // Local file origins cannot safely route external MP3s through Web Audio.
  // Keep native playback there; hosted and embedded clips use amplitude lip sync.
  initAudio();try{if(audioCtx&&(location.protocol!=='file:'||clip.src.startsWith('data:'))&&!uxbridgeRoomSpeechSources.has(clip)){const source=audioCtx.createMediaElementSource(clip),analyser=audioCtx.createAnalyser();analyser.fftSize=256;source.connect(analyser);analyser.connect(audioCtx.destination);uxbridgeRoomSpeechSources.set(clip,{source,analyser,samples:new Uint8Array(256)});}}catch(e){}
  clip.muted=muted;clip.play().catch(()=>{if(b.voice===v)v.failed=true;});
 }
}
function updateUxbridgeRoomVoice(dt){
 const b=redRooms?.mariahFight,v=b?.voice;if(!v||v.paused)return;v.elapsed+=dt;
 const a=v.clip,fallback=Math.max(5.5,v.text.split(/\s+/).length/2.5+1),duration=Number.isFinite(a?.duration)?a.duration:0;
 v.done=a?(a.ended||((v.failed||a.error)&&v.elapsed>=fallback)||v.elapsed>(duration||60)+10):v.elapsed>=fallback;
 let level=0;
 if(a){a.muted=muted;if(!a.paused&&!a.ended&&a.readyState>=2){const audio=uxbridgeRoomSpeechSources.get(a);if(audio){audio.analyser.getByteTimeDomainData(audio.samples);let sum=0;for(const value of audio.samples)sum+=((value-128)/128)**2;level=Math.min(.8,Math.sqrt(sum/audio.samples.length)*8);}else level=Math.max(0,Math.sin(a.currentTime*16)*.3+Math.sin(a.currentTime*9)*.18+.25);}}
 else if(!v.done&&v.elapsed>.2&&v.elapsed<fallback-.6)level=Math.max(0,Math.sin(v.elapsed*16)*.3+Math.sin(v.elapsed*9)*.18+.25);
 for(const mouth of [b.mouth,b.jones?.mouth])if(mouth){const target=mouth===v.mouth?level:0;mouth.level=(mouth.level||0)+(target-(mouth.level||0))*(1-Math.exp(-dt*25));mouth.open.visible=target>.015&&mouth.level>.015;mouth.open.scale.y=.006+mouth.level*.035;mouth.closed.visible=!mouth.open.visible;}
}
function pauseUxbridgeRoomVoice(){const v=redRooms?.mariahFight?.voice;if(v){v.paused=true;v.clip?.pause();}resetUxbridgeRoomMouths();}
function resumeUxbridgeRoomVoice(){const b=redRooms?.mariahFight,v=b?.voice;if(!v)return;v.paused=false;if(v.clip&&!v.done)v.clip.play().catch(()=>{if(b.voice===v)v.failed=true;});}
function tickUxbridgeRoomCombatVoice(dt){
 const p=redRooms,b=p.mariahFight;updateUxbridgeRoomVoice(dt);
 if(b.voice?.done){stopUxbridgeRoomVoice();b.nextVoiceAt=p.time+3;}
 if(b.voice||p.time<b.nextVoiceAt)return;
 const mariahAvailable=b.enemyHP>0&&b.mariahVoiceIndex<UXBRIDGE_MARIAH_COMBAT_LINES.length,jonesAlive=b.jones?.hp>0;
 if(!mariahAvailable&&!jonesAlive)return;
 const jonesTurn=jonesAlive&&(!mariahAvailable||b.voiceTurn++%2===1);
 if(jonesTurn)playUxbridgeRoomVoice('jonesCombat',b.jonesVoiceIndex++%UXBRIDGE_JONES_COMBAT_LINES.length);
 else playUxbridgeRoomVoice('mariahCombat',b.mariahVoiceIndex++);
}
