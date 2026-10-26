function resetKevinPostTubeProgress(){for(const key of ['kevinSiegeStarted','kevinSiegeIntroViewed','kevinSiegeCompleted','kevinSiegeOutroViewed','uxbridgeRedRoomsStarted','uxbridgeRedRoomsCompleted','uxbridgeMariahDefeated','uxbridgeJonesDefeated','uxbridgeEndingViewed','uxbridgeCompleted','uxbridgeChaseCompleted','uxbridgeGarethStopped','uxbridgeRooftopViewed','uxbridgeEscapeViewed','uxbridgeStarted','uxbridgeIntroViewed','bustersIntroViewed','pindarRoom','pindarCompleted','finalCurtainIntroViewed','finalCurtainOutroViewed','finalCurtainCompleted','finalCurtainBattleDeaths'])delete gameProgress[key];}
function isKevinStoryRoute(){return gameProgress.kevinRouteStarted===true&&gameProgress.universalRestorationCompleted!==true&&gameProgress.laniakeaAftermath!==true&&gameProgress.kevinSolarAftermath!==true;}
function kevinTubeAlissaDefeated(){return isKevinStoryRoute()&&gameProgress.tubeCompleted===true&&gameProgress.kevinTubeClashWinner==='josiah';}
function uxbridgeEndingStatus(id){if(!kevinTubeAlissaDefeated())return null;if(gameProgress.kevinSiegeCompleted===true)return ({0:'deceased',1:'victorious',3:'deceased',6:'victorious',7:'deceased',9:'deceased',10:'deceased',11:'deceased'}[id]||null);return gameProgress.uxbridgeEndingViewed===true?({3:gameProgress.kevinSiegeStarted?'hostile':'missing',7:'deceased',9:'deceased'}[id]||null):null;}
function kevinMenuProgress(){if(!isKevinStoryRoute())return gameProgress;const p={...gameProgress,garethQuestCompleted:false};for(const key of ['civilDisobedienceStarted','civilDisobedienceCompleted','civilDisobedienceSurvived','corneredRatStarted','corneredRatIntroViewed','corneredRatRoomsCompleted','josiahWrathful','josiahBreakdownViewed','mariahFreed','mariahNeverSeenAgain','garethJonesDeceased','peterDoor100Defeated','peterKilledByStephen','emmaShot','emmaRescued','secretaryDeadCompleted','primeSecretaryCompleted','primeSecretaryKevinDefeated','siegeCompleted','siegeEpilogueCompleted','siegePeterDefeated','tyrantFourCompleted','tyrantWilliamsKilled','damianRevealViewed','defenseLoyalEnding','defenseResistanceEnding','newPrimeSecretaryEnding'])delete p[key];return p;}
let bustersScene=null;
const bustersOpeningAudio=['assets/CH4PG1.mp3','assets/CH4PG2.mp3','assets/CH4PG3.mp3','assets/CH4PG4.mp3','assets/CH4PG5.mp3','assets/CH4PG6.mp3','assets/CH4PG7.mp3','assets/CH4PG8.mp3','assets/CH4PG9.mp3','assets/CH4PG10.mp3','assets/CH4PG11.mp3','assets/CH4PG12.mp3'].map(src=>{const clip=new Audio(src);clip.preload='auto';clip.volume=.9;return clip;});
const bustersRevealAudio=new Map([[13,'assets/KMCH4.mp3'],[16,'assets/KMCH41.mp3'],[18,'assets/KMCHTJ1.mp3'],[19,'assets/KMCHBJ1.mp3'],[21,'assets/KMCH42.mp3']].map(([index,src])=>{const clip=new Audio(src);clip.preload='auto';clip.volume=.9;return [index,clip];}));
function bustersClip(index){return index<bustersOpeningAudio.length?bustersOpeningAudio[index]:bustersRevealAudio.get(index);}
function makeBustersSpeechMouth(actor){const closed=actor.userData.mouth;closed.geometry.computeBoundingBox();const bounds=closed.geometry.boundingBox,center=bounds.getCenter(new THREE.Vector3());const open=ball(actor.userData.head,Math.min(.085,(bounds.max.x-bounds.min.x)*.36),.006,.009,new THREE.MeshBasicMaterial({color:0x281119}),center.x,center.y,bounds.max.z+.004);open.visible=false;return {actor,closed,open,level:0};}
function resetBustersMouths(){const c=bustersScene;if(!c?.speechMouths)return;for(const entry of c.speechMouths){entry.level=0;entry.open.visible=false;entry.closed.visible=true;if(entry.actor.userData.openMouth)entry.actor.userData.openMouth.visible=false;}}
function updateBustersLips(c,dt){if(!c.speechMouths)return;const clip=bustersClip(c.line),speaker=c.line<12?(c.line%2===0?c.chambers:c.williams):[13,16,21].includes(c.line)?c.kevin:c.line===18?c.takeshi:c.line===19?c.bozuki:null;let level=0;if(clip&&!clip.paused&&!clip.ended&&clip.readyState>=2){clip.muted=muted;const t=clip.currentTime,d=Number.isFinite(clip.duration)?clip.duration:0,edge=Math.min(1,t/.14,d>0?(d-t)/.2:1);level=Math.max(0,Math.sin(t*16)*.36+Math.sin(t*9.1)*.18+.25)*Math.max(0,edge);}for(const entry of c.speechMouths){const target=entry.actor===speaker?level:0;entry.level+=(target-entry.level)*(1-Math.exp(-dt*(target>entry.level?30:20)));const talking=target>.015&&entry.level>.015;entry.open.visible=talking;entry.open.scale.y=.006+entry.level*.032;entry.closed.visible=!talking;if(entry.actor.userData.openMouth)entry.actor.userData.openMouth.visible=false;}}
function stopBustersVoice(){for(const clip of [...bustersOpeningAudio,...bustersRevealAudio.values()]){clip.pause();clip.currentTime=0;}resetBustersMouths();}
function canOpenBusters(){return isKevinStoryRoute()&&gameProgress.tubeCompleted===true&&gameProgress.kevinTubeClashWinner==='alissa'&&gameProgress.laniakeaAftermath!==true&&gameProgress.kevinSolarAftermath!==true;}
const BUSTERS_OPENING_LINES=[
 ['PETER CHAMBERS','Close the gates. Until we have control of the situation, no one speaks to the press.'],
 ['GARETH WILLIAMS','Josiah is dead, Peter. Alissa killed him at Embankment. You cannot lock the news outside.'],
 ['PETER CHAMBERS','Then let them hear it from the new Prime Secretary. I am assuming command.'],
 ['GARETH WILLIAMS','He is barely cold and you are already practising the title.'],
 ['PETER CHAMBERS','Someone must hold this government together. Unless you would prefer to let it collapse?'],
 ['GARETH WILLIAMS','I would prefer an explanation. Where were your men when she pulled that trigger?'],
 ['PETER CHAMBERS','Watch your tone, Williams. You are speaking to the Prime Secretary.'],
 ['GARETH WILLIAMS','And you are speaking to someone who remembers when you carried his folders.'],
 ['PETER CHAMBERS','You will keep the militia in line. Alissa must not mistake one victory for the end of us.'],
 ['GARETH WILLIAMS','Then stop fighting over his chair and look at what is happening outside these gates.'],
 ['PETER CHAMBERS','What are you talking about?'],
 ['GARETH WILLIAMS','David “Diesel” Busters. His name is coming up again. While you crown yourself, he is making his return.']
];
const BUSTERS_REVEAL_LINES=[
 ['CAMDEN / PRESENT DAY','Elsewhere, the masked figure intercepts a report: David “Diesel” Busters has been freed.'],
 ['KEVIN MURDERHORN','Who opened his cell? Give me the name.'],
 ['CAMDEN / PRESENT DAY','The report names one man: Damian Juko.'],
 ['CAMDEN / PRESENT DAY','Kevin tears off his mask. His hands shake as the name drags him back to Osaka.'],
 ['KEVIN MURDERHORN','No. Not that platform. I can still hear the train. I can still hear them.'],
 ['OSAKA / 2004','Takeshi Juko and Bozuki Juko force Kevin toward the platform edge as a train roars past.'],
 ['TAKESHI JUKO','You are mine.'],
 ['BOZUKI JUKO','Gaijin.'],
 ['CAMDEN / PRESENT DAY','The memory breaks. Kevin recoils against the wall, struggling to steady his breath.'],
 ['KEVIN MURDERHORN','Juko freed Busters. He is here. No—stay here. This is Camden. This is now.']
];
const BUSTERS_ALL_LINES=[...BUSTERS_OPENING_LINES,...BUSTERS_REVEAL_LINES];
function makeOsakaTormentor(name){
 const actor=makeDamianJuko(),head=actor.userData.head,hair=mat(0x110f10);actor.name=name;
 if(name==='Takeshi Juko'){
  for(const [x,y,h] of [[-.23,.39,.35],[-.08,.48,.42],[.08,.46,.38],[.23,.34,.30]]){const spike=mesh(new THREE.ConeGeometry(.12,h,6),hair,head,x,y,0);spike.rotation.z=-x*.9;}
 }else{
  const sweep=ball(head,.36,.18,.28,hair,.05,.43,.04);sweep.rotation.z=-.18;
  ball(head,.24,.14,.20,hair,.16,.53,.03);ball(head,.16,.29,.13,hair,-.30,.10,-.06);
 }
 return actor;
}
function makeOsakaPlatform(){
 const root=new THREE.Group(),tile=mat(0x626d78),dark=mat(0x111c28),yellow=mat(0xd6a94b),steel=mat(0x566776);
 box(root,24,.24,12,tile,0,-.12,0);box(root,24,.08,.32,yellow,0,.035,-3.4);
 for(let x=-10;x<=10;x+=4){box(root,.24,4,.24,steel,x,2,-5.1);box(root,3.3,.12,.35,steel,x,4,-5.1);}
 box(root,26,4,.18,dark,0,2,-8);box(root,26,.18,13,dark,0,4.2,-1);
 const train=new THREE.Group();root.add(train);box(train,13,2.7,2.5,mat(0xabb8c1,.35),0,1.45,-5.1);box(train,13,.28,2.57,mat(0x3266a5),0,.65,-5.1);
 for(let x=-5.2;x<=5.2;x+=2){box(train,1.25,1.05,.035,mat(0x142b42,.25),x,1.75,-3.82);box(train,.09,1.3,.06,steel,x+.77,1.68,-3.79);}
 const light=new THREE.PointLight(0xaacbff,28,17);light.position.set(0,3,1);root.add(light);const faceLight=new THREE.PointLight(0xffe1c0,12,8);faceLight.position.set(0,2,3);root.add(faceLight);
 return {root,train};
}
function unmaskBustersKevin(actor){
 const head=actor.userData.head;
 for(const child of head.children)if(child.position.z>.2&&child.position.y<-.10&&child.position.y>-.29&&child.material?.color?.getHex()===0x070a0d)child.visible=false;
 if(!actor.userData.bustersMouth)actor.userData.bustersMouth=line3(head,[[-.08,-.19,.30],[0,-.205,.32],[.08,-.19,.30]],mat(0x694a49),.012);
 actor.userData.mouth=actor.userData.bustersMouth;
 actor.userData.bustersUnmasked=true;
}
function updateBustersStage(c){
 const n=c.line,osaka=n>=17&&n<=19,present=n>=12;
 c.root.visible=!present;c.present.visible=present&&!osaka;c.osaka.root.visible=osaka;
 if(n>=15&&!c.kevin.userData.bustersUnmasked){unmaskBustersKevin(c.kevin);c.speechMouths.push(makeBustersSpeechMouth(c.kevin));}
 $('bustersCinema').querySelector('.cinema-top span').textContent=osaka?'CHAPTER 04 / OSAKA · 2004':present?'CHAPTER 04 / CAMDEN · PRESENT DAY':'CHAPTER 04 / DOWNING STREET';
}
function clearBusters(){stopBustersVoice();if(!bustersScene)return;$('bustersCinema').hidden=true;scene.remove(bustersScene.root,bustersScene.present,bustersScene.osaka.root);bustersScene=null;}
function startBusters(){if(!canOpenBusters())return;if(!chapterLoadingBypass)return loadChapterScreen('CHAPTER 04 · THE RETURN OF BUSTERS',startBusters);menu();setMode('kevin4');world.visible=upperWorld.visible=exhibit.visible=false;for(const a of [subject,peter,alissa,gareth,stephen,chrisMenu,mariahMenu,garethJonesMenu,emmaMenu,kevinMenu,kevinRevealed,elizabethMenu,damianMenu,davidMenu])a.visible=false;flash.visible=false;const root=makeDowningStreet();scene.add(root);const chambers=makePeter(),williams=makeGareth(false);root.add(chambers,williams);chambers.position.set(-1.25,0,4);williams.position.set(1.25,0,4.5);chambers.rotation.y=1.15;williams.rotation.y=-1.55;
 const present=new THREE.Group();scene.add(present);box(present,15,.2,13,mat(0x122036),0,-.1,0);box(present,15,6,.2,mat(0x0b1732),0,3,-5);for(const x of [-5,0,5])box(present,.13,5,.25,mat(0x4383ae),x,2.5,-4.8);const kevin=makeRevealedKevin();present.add(kevin);kevin.position.set(0,0,-1);kevin.rotation.y=.13;present.add(new THREE.PointLight(0x549be9,15,12));
 const osaka=makeOsakaPlatform();scene.add(osaka.root);const memoryKevin=makeRevealedKevin(),takeshi=makeOsakaTormentor('Takeshi Juko'),bozuki=makeOsakaTormentor('Bozuki Juko');osaka.root.add(memoryKevin,takeshi,bozuki);memoryKevin.position.set(0,0,-.1);takeshi.position.set(-1.65,0,-.45);bozuki.position.set(1.65,0,-.45);takeshi.rotation.y=.8;bozuki.rotation.y=-.8;unmaskBustersKevin(memoryKevin);
 bustersScene={root,chambers,williams,present,kevin,osaka,memoryKevin,takeshi,bozuki,line:0,time:0,speechMouths:[makeBustersSpeechMouth(chambers),makeBustersSpeechMouth(williams),makeBustersSpeechMouth(takeshi),makeBustersSpeechMouth(bozuki)]};scene.background.setHex(0x07101b);scene.fog.color.setHex(0x09111a);scene.fog.density=.012;ambient.intensity=.35;$('bustersCinema').hidden=false;showBustersLine();keys.clear();document.exitPointerLock?.();}
function showBustersLine(){const c=bustersScene;if(!c)return;stopBustersVoice();c.time=0;c.voiceFailed=false;updateBustersStage(c);const [name,line]=BUSTERS_ALL_LINES[c.line];$('bustersSpeaker').textContent=name;$('bustersLine').textContent=line;$('bustersNext').hidden=true;const index=c.line,clip=bustersClip(index);if(clip){clip.muted=muted;clip.play()?.catch(()=>{if(bustersScene===c&&c.line===index)c.voiceFailed=true;});}}
function finishBustersOpening(){if(!bustersScene)return;gameProgress.bustersIntroViewed=true;gameProgress.pindarRoom=gameProgress.pindarRoom||1;saveProgress();clearBusters();startPindar();}
function advanceBusters(){if(!bustersScene)return;if(++bustersScene.line>=BUSTERS_ALL_LINES.length)finishBustersOpening();else showBustersLine();}
function bustersLineFinished(c){const clip=bustersClip(c.line);if(clip){if(clip.ended&&c.time>.25)return true;const fallback=c.voiceFailed||!!clip.error;const duration=Number.isFinite(clip.duration)&&clip.duration>0?clip.duration:0;return fallback&&c.time>Math.max(4,duration+1,BUSTERS_ALL_LINES[c.line][1].split(/\s+/).length/2.5);}const words=BUSTERS_ALL_LINES[c.line][1].split(/\s+/).length;return c.time>THREE.MathUtils.clamp(words/2.7+1.2,2.6,7);}
function renderBusters(dt){const c=bustersScene;if(!c)return;c.time+=dt;
 if(c.line<12){for(const actor of [c.chambers,c.williams]){animateCharacter(c.time,false,false,actor);actor.userData.head.rotation.y=0;}const speaker=c.line%2===0?c.chambers:c.williams;speaker.userData.arms[0].rotation.x=-.6-Math.sin(c.time*2)*.12;speaker.userData.head.rotation.x=Math.sin(c.time*1.8)*.035;camera.position.set(c.line<2?0:c.line%2===0?-1:1,2.05,c.line<2?10.5:8.4);camera.lookAt(0,1.7,3.4);}
 else if(c.line>=17&&c.line<=19){c.osaka.train.position.x=-1.4+Math.sin(c.time*.7)*.65;for(const actor of [c.memoryKevin,c.takeshi,c.bozuki])animateCharacter(c.time,false,false,actor);c.memoryKevin.userData.body.rotation.x=.24;c.memoryKevin.userData.head.rotation.z=Math.sin(c.time*7)*.055;c.takeshi.userData.arms[0].rotation.x=-.9;c.bozuki.userData.arms[1].rotation.x=-.65;camera.position.set(c.line===18?-1.1:c.line===19?1.1:0,1.8,5.5);camera.lookAt(0,1.4,-.5);}
 else{animateCharacter(c.time,false,false,c.kevin);if(c.line>=15&&c.line<=16){c.kevin.userData.body.rotation.x=.28;c.kevin.userData.head.rotation.z=Math.sin(c.time*9)*.09;c.kevin.userData.arms[0].rotation.x=-.8;}camera.position.set(c.line>=15&&c.line<=16?.75:0,1.9,c.line>=15&&c.line<=16?3.5:5.5);camera.lookAt(0,1.65,-1);}
 updateBustersLips(c,dt);if(bustersScene===c&&bustersLineFinished(c))advanceBusters();
}
function initBustersControls(){$('openBusters').onclick=startBusters;$('bustersNext').hidden=true;$('bustersSkip').onclick=finishBustersOpening;document.addEventListener('keydown',e=>{if(mode!=='kevin4'||!bustersScene)return;if(e.code==='Enter'&&!e.repeat){e.preventDefault();advanceBusters();}else if(e.code==='Escape'){e.preventDefault();menu();}});}
