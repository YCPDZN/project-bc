/* Camden branch: the closing cinematic of Chapter 3 / Tube. */
let kevinTubeEnding=null;
const MURDERHORN_ROUTE_THEME=new Audio('assets/MURDERHORN.mp3');
MURDERHORN_ROUTE_THEME.loop=true;
MURDERHORN_ROUTE_THEME.preload='auto';
MURDERHORN_ROUTE_THEME.volume=.65;
const kevinTubeDialogueAudio=['assets/AVJR1.mp3','assets/AVJR2.mp3','assets/AVJR3.mp3'].map(src=>{const clip=new Audio(src);clip.preload='auto';clip.volume=.9;return clip;});
function stopKevinTubeDialogue(){for(const clip of kevinTubeDialogueAudio){clip.pause();clip.currentTime=0;}}
function playKevinTubeDialogue(line){stopKevinTubeDialogue();const clip=kevinTubeDialogueAudio[line-1];if(!clip)return;clip.muted=muted;clip.play()?.catch(()=>{});}
const josiahEmbankmentVictoryAudio=['assets/KR1.mp3','assets/KR2.mp3','assets/KR3.mp3','assets/KR4.mp3','assets/KR5.mp3','assets/KR6.mp3','assets/KR7.mp3','assets/KR8.mp3','assets/KR9.mp3','assets/KR10.mp3'].map(src=>{const clip=new Audio(src);clip.preload='auto';clip.volume=.9;return clip;});
function stopJosiahEmbankmentVictoryVoice(){for(const clip of josiahEmbankmentVictoryAudio){clip.pause();clip.currentTime=0;}}
function playJosiahEmbankmentVictoryVoice(index){stopJosiahEmbankmentVictoryVoice();const clip=josiahEmbankmentVictoryAudio[index];if(!clip)return;clip.muted=muted;clip.play()?.catch(()=>{});}
const alissaEmbankmentVictoryAudio=['assets/AR1.mp3','assets/AR2.mp3','assets/AR3.mp3','assets/AR4.mp3','assets/AR5.mp3','assets/AR6.mp3','assets/AR7.mp3','assets/AR8.mp3','assets/AR9.mp3','assets/AR10.mp3'].map(src=>{const clip=new Audio(src);clip.preload='auto';clip.volume=.9;return clip;});
function stopAlissaEmbankmentVictoryVoice(){for(const clip of alissaEmbankmentVictoryAudio){clip.pause();clip.currentTime=0;}}
function playAlissaEmbankmentVictoryVoice(index){stopAlissaEmbankmentVictoryVoice();const clip=alissaEmbankmentVictoryAudio[index];if(!clip)return;clip.muted=muted;clip.play()?.catch(()=>{});}
const KEVIN_TUBE_ENDING_LINES=[
 ['EMBANKMENT','The southbound train reaches Embankment. The platform shakes beneath a clash beyond the gates.'],
 ['ALISSA ROBERTS','You followed me all the way here?'],
 ['JOSIAH RICHARDS','You made your choice, Alissa. Stand down.'],
 ['ALISSA ROBERTS','Then come and take me.'],
 ['EMBANKMENT','Golden chains tear across the tiles. Alissa dodges and returns fire.'],
 ['EMBANKMENT','The fight turns on a single opening.']
];
const JOSIAH_EMBANKMENT_VICTORY_LINES=[
 'You crossed a city to hide behind a masked stranger, Alissa. He never even stepped onto this platform.',
 'You called desertion freedom. All you did was leave yourself alone when the doors closed.',
 'That gun made you brave for three seconds. The rest of the fight was spent looking for an exit.',
 'You wanted to see me brought to my knees. Look carefully at which one of us is on the floor.',
 'You promised to tear down my authority. You could not hold this station for a single night.',
 'Do you hear the train leaving? Nobody aboard knows you stayed. Nobody is coming back.',
 'The man behind that blue door let you believe your betrayal mattered to him. You were a distraction.',
 'You mistook his silence for a plan. I watched you bet your life on it.',
 'I will remember what you chose here. The world will remember only that you lost.',
 'Rest now, Alissa. Your last act of defiance has bought your new ally nothing.'
];
const ALISSA_EMBANKMENT_VICTORY_LINES=[
 'He is down. I did it. Why are my hands still shaking?',
 'Mum... he cannot hurt you now. I thought I would feel safe when he was gone.',
 'I watched Josiah take you from me. I have lived inside that moment ever since.',
 'I wanted him to hear your name before the shot. I could not even say it.',
 'No. No, do not look at me. I can still see him standing there.',
 'The train is leaving. For once, I do not have to run from him.',
 'Mum, I can hear my own breath again. I had forgotten what that felt like.',
 '(crying) I thought killing him would bring you back. It cannot. I know that now.',
 '(sobbing, then steadying) But he cannot take anyone else from us. It is over.',
 'Mum... I miss you. And I can finally smile without feeling guilty. We did it.'
];
function canReplayKevinTubeEnding(){return gameProgress.kevinRouteStarted===true&&gameProgress.tubeCompleted===true;}
function clearKevinTubeEnding(){stopKevinTubeDialogue();stopJosiahEmbankmentVictoryVoice();stopAlissaEmbankmentVictoryVoice();const c=kevinTubeEnding;if(!c)return;$('kevinTubeEndingUI').hidden=true;$('kevinTubeEndingResult').hidden=true;scene.remove(c.root);c.root.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();});kevinTubeEnding=null;}
function startKevinTubeEnding(){if(!chapterLoadingBypass)return loadChapterScreen('CHAPTER 03 · TUBE · EMBANKMENT',startKevinTubeEnding);if(!canReplayKevinTubeEnding())return;menu();setMode('kevinTubeEnding');world.visible=upperWorld.visible=exhibit.visible=false;for(const actor of [subject,peter,alissa,gareth,stephen,chrisMenu,mariahMenu,garethJonesMenu,emmaMenu,kevinMenu,kevinRevealed,elizabethMenu])actor.visible=false;flash.visible=false;
 const root=new THREE.Group();scene.add(root);const floor=mat(0x4c5358),wall=mat(0x65727a),dark=mat(0x131b25),gold=new THREE.MeshBasicMaterial({color:0xf6c354}),blue=new THREE.MeshBasicMaterial({color:0x9bd7ff});
 box(root,20,.2,46,floor,0,-.12,-3);for(let z=-24;z<=18;z+=2)box(root,19.8,.012,.025,mat(0x34424b),0,.005,z);for(let x=-9;x<=9;x+=2)box(root,.025,.012,45,mat(0x34424b),x,.007,-3);
 for(const x of [-10,10])box(root,.3,7,46,wall,x,3.4,-3);box(root,20,.3,46,dark,0,6.85,-3);box(root,20,6,.35,dark,0,3,-26);
 for(const z of [-20,-10,0,10]){box(root,12,.07,.25,blue,0,6.65,z);const lamp=new THREE.PointLight(0xb5d8f5,5,19);lamp.position.set(0,5.7,z);root.add(lamp);for(const x of [-7.5,7.5]){box(root,.7,6,.7,dark,x,3,z);box(root,.12,.1,.72,blue,x,4.9,z);}}
 const station=sign('EMBANKMENT / SOUTHBOUND','#e7ecf1','#182536',6);station.position.set(0,4.8,-25.75);root.add(station);
 const josiah=makeCharacter(),alissaActor=makeAlissa();root.add(josiah,alissaActor);josiah.position.set(-2.8,0,-16);alissaActor.position.set(2.7,0,-15);josiah.rotation.y=.9;alissaActor.rotation.y=-.85;
 const goldLight=new THREE.PointLight(0xfbc45d,8,11),blueLight=new THREE.PointLight(0x70b9ff,7,10);root.add(goldLight,blueLight);const chains=[];for(let i=0;i<36;i++){const strand=new THREE.Mesh(new THREE.TorusGeometry(.09,.025,5,10),gold);root.add(strand);chains.push(strand);}const sparks=[];for(let i=0;i<16;i++)sparks.push(ball(root,.035,.035,.035,i%2?gold:blue,0,0,-15));const muzzle=ball(root,.12,.12,.12,new THREE.MeshBasicMaterial({color:0xffe1a1}),0,0,-15);muzzle.visible=false;
 const winner=gameProgress.kevinTubeClashChoice;if(!['josiah','alissa'].includes(winner)){menu();return;}kevinTubeEnding={root,josiah,alissa:alissaActor,goldLight,blueLight,chains,sparks,muzzle,winner,time:0,line:0,phase:'clash',shotAt:0,resultTime:0};scene.background.setHex(0x07101b);scene.fog.color.setHex(0x09111a);scene.fog.density=.012;ambient.intensity=.8;camera.position.set(0,2.35,8);camera.lookAt(0,1.5,-16);$('kevinTubeEndingUI').hidden=false;$('kevinTubeEndingResult').hidden=true;showKevinTubeEndingLine();keys.clear();document.exitPointerLock?.();}
function showKevinTubeEndingLine(){const c=kevinTubeEnding;if(!c)return;const [speaker,line]=KEVIN_TUBE_ENDING_LINES[c.line];$('kevinTubeEndingSpeaker').textContent=speaker;$('kevinTubeEndingLine').textContent=line;$('kevinTubeEndingNext').textContent='CONTINUE';playKevinTubeDialogue(c.line);}
function resolveKevinTubeEnding(){const c=kevinTubeEnding;if(!c||c.phase!=='clash')return;stopKevinTubeDialogue();c.phase='result';c.resultTime=0;$('kevinTubeEndingUI').hidden=true;}
function showEmbankmentVictoryLine(){const c=kevinTubeEnding;if(!c||c.phase!=='victoryDialogue')return;const alissaWon=c.winner==='alissa',lines=alissaWon?ALISSA_EMBANKMENT_VICTORY_LINES:JOSIAH_EMBANKMENT_VICTORY_LINES;$('kevinTubeEndingSpeaker').textContent=alissaWon?'ALISSA ROBERTS':'JOSIAH RICHARDS';$('kevinTubeEndingLine').textContent=lines[c.victoryLine];$('kevinTubeEndingNext').textContent=c.victoryLine===lines.length-1?'SEE RESULT':'CONTINUE';$('kevinTubeEndingSkip').textContent='SKIP DIALOGUE';if(alissaWon)playAlissaEmbankmentVictoryVoice(c.victoryLine);else playJosiahEmbankmentVictoryVoice(c.victoryLine);}
function advanceKevinTubeEnding(){const c=kevinTubeEnding;if(!c)return;if(c.phase==='victoryDialogue'){const lines=c.winner==='alissa'?ALISSA_EMBANKMENT_VICTORY_LINES:JOSIAH_EMBANKMENT_VICTORY_LINES;if(++c.victoryLine<lines.length)showEmbankmentVictoryLine();else{c.victoryDialogueDone=true;finishKevinTubeEnding();}return;}if(c.phase!=='clash')return;if(++c.line<KEVIN_TUBE_ENDING_LINES.length){showKevinTubeEndingLine();return;}resolveKevinTubeEnding();}
function finishKevinTubeEnding(){const c=kevinTubeEnding;if(!c||c.phase==='complete')return;resetKevinPostTubeProgress();gameProgress.kevinTubeClashWinner=c.winner;gameProgress.tubeCompleted=true;saveProgress();refreshProgressUI();if(!c.victoryDialogueDone){c.phase='victoryDialogue';c.victoryLine=0;$('kevinTubeEndingUI').hidden=false;showEmbankmentVictoryLine();return;}stopJosiahEmbankmentVictoryVoice();stopAlissaEmbankmentVictoryVoice();c.phase='complete';$('kevinTubeEndingUI').hidden=true;$('kevinTubeEndingResult').hidden=true;queueMicrotask(()=>{if(kevinTubeEnding===c&&mode==='kevinTubeEnding')(c.winner==='alissa'?startBusters:startUxbridge)();});}
function renderKevinTubeEnding(dt){
 const c=kevinTubeEnding;if(!c)return;c.time+=dt;const a=c.alissa,j=c.josiah;
 if(c.phase==='victoryDialogue'||c.phase==='complete'){
  for(const actor of [a,j]){actor.position.y=0;actor.rotation.set(0,0,0);actor.userData.body.rotation.set(0,0,0);actor.userData.body.position.y=0;for(const arm of actor.userData.arms)arm.rotation.set(0,0,0);for(const leg of actor.userData.legs)leg.rotation.set(0,0,0);}
  a.position.set(2.4,0,-15);j.position.set(-2.4,0,-16);
  a.rotation.y=Math.atan2(j.position.x-a.position.x,j.position.z-a.position.z);
  j.rotation.y=Math.atan2(a.position.x-j.position.x,a.position.z-j.position.z);
  const loser=c.winner==='josiah'?a:j;loser.rotation.z=Math.PI/2;loser.position.y=.32;
  if(c.winner==='alissa'){
   const crying=c.phase==='victoryDialogue'&&c.victoryLine<9;
   showAlissaBreakdownTears(a,crying);
   const tremble=crying?Math.sin(c.time*12)*.018:0;
   a.userData.body.rotation.x=(crying?.15:0)+tremble;
   a.userData.head.rotation.x=crying?.22+Math.sin(c.time*3)*.025:-.04;
   a.userData.arms[0].rotation.x=crying?-1.15:-.15;
   a.userData.arms[1].rotation.x=-.18;
  }
  a.userData.weaponAimPoint=null;a.userData.muzzle.parent.quaternion.identity();
  a.userData.muzzle.visible=false;c.muzzle.visible=false;
  for(const link of c.chains)link.visible=false;
  for(const spark of c.sparks)spark.visible=false;
  c.goldLight.position.copy(j.position).add(new THREE.Vector3(0,2,0));c.blueLight.position.copy(a.position).add(new THREE.Vector3(0,2,0));
  c.goldLight.intensity=4;c.blueLight.intensity=4;
  camera.position.set(c.winner==='alissa'?1.1:0,2.2,c.winner==='alissa'?-10:-8);camera.lookAt(c.winner==='alissa'?a.position.x:0,1.35,-15.5);
  return;
 }
 const smooth=x=>{x=THREE.MathUtils.clamp(x,0,1);return x*x*(3-2*x);};
 const cycle=c.time%5.5,attack=smooth((cycle-.65)/.45)*(1-smooth((cycle-1.5)/.6)),dodge=Math.sin(Math.PI*smooth((cycle-.8)/1.5));
 for(const actor of [a,j]){actor.position.y=0;actor.rotation.x=actor.rotation.z=0;actor.userData.body.rotation.set(0,0,0);for(const arm of actor.userData.arms)arm.rotation.set(-.25,0,0);for(const leg of actor.userData.legs)leg.rotation.set(0,0,0);}
 a.position.set(2.4,0,-15+dodge*1.4);j.position.set(-2.4+attack*.45,0,-16);
 a.rotation.y=Math.atan2(j.position.x-a.position.x,j.position.z-a.position.z);j.rotation.y=Math.atan2(a.position.x-j.position.x,a.position.z-j.position.z);
 j.userData.arms[1].rotation.x=-.4-attack*1.25;j.userData.arms[0].rotation.x=-.6;
 a.userData.body.rotation.z=dodge*.3;a.userData.body.position.y=-dodge*.18;
 a.userData.legs[0].rotation.x=dodge*.45;a.userData.legs[1].rotation.x=-dodge*.35;
 const firing=c.phase==='clash'&&cycle>2.65&&cycle<3.55,recoil=firing?Math.max(0,Math.sin((cycle-2.65)*24))*.15:0;
 if(firing){j.userData.arms[0].rotation.set(-1.25,0,-.65);j.userData.body.rotation.z=-recoil;j.position.x-=recoil*.7;}
 a.userData.arms[1].rotation.x=-Math.PI/2-recoil;a.userData.arms[0].rotation.x=-1.15;
 a.userData.weaponAimPoint=j.position.clone().add(new THREE.Vector3(0,1.5,0));
 let chainAmount=attack,flash=firing&&recoil>.09;
 if(c.phase!=='clash'){
  if(c.phase==='result')c.resultTime+=dt;
  const t=c.resultTime,fall=smooth((t-.65)/1.15),loser=c.winner==='josiah'?a:j;
  a.position.set(2.4,0,-15);j.position.set(-2.4,0,-16);a.userData.body.position.y=0;a.userData.body.rotation.z=0;
  for(const leg of a.userData.legs)leg.rotation.x=0;
  chainAmount=c.winner==='josiah'?smooth(t/.4)*(1-smooth((t-1.3)/.6)):0;
  j.userData.arms[1].rotation.x=c.winner==='josiah'?-1.55:-.5;
  flash=c.winner==='alissa'&&t>.35&&t<.55;
  loser.rotation.z=fall*Math.PI/2;loser.position.y=fall*.32;
  for(const arm of loser.userData.arms)arm.rotation.x=-.2;
  if(c.phase==='result'&&t>=2.8)finishKevinTubeEnding();
 }
 if(flash&&c.time-c.shotAt>.15){c.shotAt=c.time;playGunshot(.25);}
 c.muzzle.visible=false;a.userData.muzzle.visible=flash;correctHeldWeaponAiming();c.root.updateMatrixWorld(true);
 const from=j.userData.arms[1].localToWorld(new THREE.Vector3(0,-.62,0)),target=a.position.clone().add(new THREE.Vector3(0,1.25,0));
 const reach=from.clone().lerp(target,chainAmount),direction=reach.clone().sub(from).normalize();
 for(let i=0;i<c.chains.length;i++){const link=c.chains[i],u=i/(c.chains.length-1);link.visible=chainAmount>.02&&c.phase!=='complete';link.position.copy(from).lerp(reach,u);link.position.y+=Math.sin(u*Math.PI)*.28*(1-chainAmount);link.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),direction);link.rotateY(i%2?Math.PI/2:0);}
 const impact=flash?j.position:target;
 for(let i=0;i<c.sparks.length;i++){const spark=c.sparks[i],pulse=(c.time*4+i*.13)%1;spark.visible=c.phase!=='complete'&&(flash||chainAmount>.95);spark.position.set(impact.x+Math.sin(i*3)*pulse*.45,1.4+Math.cos(i*5)*pulse*.5,impact.z+Math.cos(i*2)*pulse*.45);spark.scale.setScalar(.035*(1-pulse));}
 c.goldLight.position.copy(j.position).add(new THREE.Vector3(0,2,0));c.blueLight.position.copy(a.position).add(new THREE.Vector3(0,2,0));c.goldLight.intensity=4+chainAmount*7;c.blueLight.intensity=4+(flash?5:0);
 camera.position.set(Math.sin(c.time*.12)*.4,2.2,-8);camera.lookAt(0,1.1,-15.5);
}
function initKevinTubeEndingControls(){$('kevinTubeEndingNext').onclick=advanceKevinTubeEnding;$('kevinTubeEndingSkip').onclick=()=>{const c=kevinTubeEnding;if(c?.phase==='clash')resolveKevinTubeEnding();else if(c?.phase==='victoryDialogue'){c.victoryDialogueDone=true;finishKevinTubeEnding();}};$('kevinTubeEndingMenu').onclick=menu;document.addEventListener('keydown',e=>{if(mode!=='kevinTubeEnding'||!kevinTubeEnding)return;if(['Enter','Space'].includes(e.code)&&!e.repeat){e.preventDefault();advanceKevinTubeEnding();}else if(e.code==='Escape'){e.preventDefault();menu();}});}
