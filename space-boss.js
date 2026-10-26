const SPACE_JOSIAH_TAUNTS=[
 'You watched the universe go dark, and your answer was to come after me? Brave. Stupid. Predictable.',
 'There is no Westminster here. No law to hide behind. Just you, me, and everything I can unmake.',
 'I gave you ten seconds to save your world. You spent them proving how little it meant to you.',
 'Look beneath your feet. Even the stars are trying to get away from you.',
 'You think a gun can reach a man who tore open the sky? Go on. Pull the trigger again.',
 'Every chain you break becomes another reason for me to make the next one stronger.',
 'Jones taught you to resist. Did he teach you what to do when resistance is all that remains?',
 'You dragged yourself beyond the Milky Way just to lose in front of a larger audience.',
 'I can hear your breathing over the silence of a hundred billion worlds. It is getting faster.',
 'If you beat me here, remember this moment. You had to follow me into the dark to do it.'
];
const SPACE_KEVIN_TAUNTS=[
 'Look at that Sun. Imagine every last person you love burning beneath it while I laugh.',
 'Josiah broke the universe. I want to see how many pieces I can break again.',
 'Twenty years as somebody’s weapon. Japan. England. Now I choose where the blade falls.',
 'Keep shooting, you desperate little shit. I want to hear the hope leave your voice.',
 'You crossed a galaxy to save the dead? I could let you win, then kill them all again.',
 'No doors. No allies. Nowhere to crawl when I decide this game is over.',
 'Gods, governments, heroes—I have served them and buried them. You are next.',
 'These chains could throw you into the Sun. I might drag you back just to do it twice.',
 'Humanity is gone, and I feel nothing but relief. I can finally make the silence mine.',
 'Go on. Refuse me one last time. I want you angry when I put out the Sun.'
];
const SPACE_JOSIAH_SOL_LINES=[
 'Kevin! You used every person who trusted you, and called it freedom.',
 'I know what it is to mistake power for the right to decide who lives.',
 'You had a chance to stop when the world fell. You chose to make it worse.',
 'This is for Emma. You will not take anyone else from me.',
 'Look at me, Kevin. There is no master left to blame for what you are.',
 'You wanted a universe with no one to answer to? Tough shit, Kevin. You answer to me.',
 'These chains used to make people kneel. Now they are going to drag you down.',
 'I have seen the end of everything, you sick bastard. I am still here to stop you.',
 'The Sun is still burning, and I will be damned if I let you put it out.',
 'For Emma. For everyone we failed. I am ending this, Kevin, even if it kills me.'
];
const SPACE_KEVIN_SOL_REPLIES=[
 'Emma is dead, Josiah. Say her name again. It will not make her hear you.',
 'You call yourself her protector? The universe burned while you were busy playing god.',
 'I hope she saw what you became. I hope that was the last thing she knew about you.',
 'When I tear down that Sun, I will leave you alive long enough to watch her memory vanish with it.',
 'Come closer, both of you. I want the last two voices in existence to beg me to stop.'
];
const SPACE_JOSIAH_AUDIO=[
 'assets/godlike-josiah-1.mp3','assets/godlike-josiah-2.mp3',
 'assets/godlike-josiah-3.mp3','assets/godlike-josiah-4.mp3',
 'assets/godlike-josiah-5.mp3','assets/godlike-josiah-6.mp3',
 'assets/godlike-josiah-7.mp3','assets/godlike-josiah-8.mp3',
 'assets/godlike-josiah-9.mp3','assets/godlike-josiah-10.mp3'
].map(source=>{const audio=new Audio(source);audio.preload='metadata';return audio;});
const SPACE_KEVIN_AUDIO=[
 'assets/tlr-1.mp3','assets/tlr-2.mp3','assets/tlr-3.mp3','assets/tlr-4.mp3','assets/tlr-5.mp3',
 'assets/tlr-6.mp3','assets/tlr-7.mp3','assets/tlr-8.mp3','assets/tlr-9.mp3','assets/tlr-10.mp3'
].map(source=>{const audio=new Audio(source);audio.preload='metadata';return audio;});
const SPACE_JOSIAH_SOL_AUDIO=[
 'assets/tlr-josiah-1.mp3','assets/tlr-josiah-2.mp3','assets/tlr-josiah-3.mp3','assets/tlr-josiah-4.mp3','assets/tlr-josiah-5.mp3',
 'assets/tlr-josiah-6.mp3','assets/tlr-josiah-7.mp3','assets/tlr-josiah-8.mp3','assets/tlr-josiah-9.mp3','assets/tlr-josiah-10.mp3'
].map(source=>{const audio=new Audio(source);audio.preload='metadata';return audio;});
const SPACE_KEVIN_SOL_REPLY_AUDIO=[
 'assets/tlr-kevin-reply-1.mp3','assets/tlr-kevin-reply-2.mp3','assets/tlr-kevin-reply-3.mp3',
 'assets/tlr-kevin-reply-4.mp3','assets/tlr-kevin-reply-5.mp3'
].map(source=>{const audio=new Audio(source);audio.preload='metadata';return audio;});
const SOL_EPILOGUE_AUDIO=[
 'assets/tlr-post-epilogue-1.mp3','assets/tlr-post-epilogue-2.mp3','assets/tlr-post-epilogue-3.mp3'
].map(source=>{const audio=new Audio(source);audio.preload='metadata';return audio;});
const SOL_NEGOTIATION_AUDIO=[
 'assets/solar-negotiation-jr-1.mp3','assets/solar-negotiation-jr-2.mp3',
 'assets/solar-negotiation-jr-3.mp3','assets/solar-negotiation-jr-4.mp3'
].map(source=>{const audio=new Audio(source);audio.preload='metadata';return audio;});
const SOL_PRAYER_AUDIO=[
 'assets/solar-prayer-jr-1.mp3','assets/solar-prayer-jr-2.mp3',
 'assets/solar-prayer-jr-3.mp3','assets/solar-prayer-jr-4.mp3'
].map(source=>{const audio=new Audio(source);audio.preload='metadata';return audio;});
const SPACE_BOSS_THEME=new Audio('assets/heavenly-drift.mp3');
SPACE_BOSS_THEME.loop=true;
SPACE_BOSS_THEME.volume=.72;
const LANIAKEA_MENU_THEME=SPACE_BOSS_THEME.cloneNode(true);
LANIAKEA_MENU_THEME.loop=true;
LANIAKEA_MENU_THEME.volume=.55;
const IRON_DRIFT_MENU_THEME=new Audio('assets/iron-drift.mp3');
IRON_DRIFT_MENU_THEME.loop=true;
IRON_DRIFT_MENU_THEME.volume=.55;
const IRON_DRIFT_BOSS_THEME=IRON_DRIFT_MENU_THEME.cloneNode(true);
IRON_DRIFT_BOSS_THEME.loop=true;
IRON_DRIFT_BOSS_THEME.volume=.72;
let spaceBoss=null,spaceBossVoice=null,solarBossLossErased=false;

function spaceMesh(group,geometry,color,x,y,z,glow=0){
 const material=new THREE.MeshStandardMaterial({color,emissive:glow||0,emissiveIntensity:glow?.9:0,metalness:.35,roughness:.4});
 const mesh=new THREE.Mesh(geometry,material);
 mesh.position.set(x,y,z);
 group.add(mesh);
 return mesh;
}
function spaceGlow(group,geometry,color,x,y,z,opacity=.5){
 const mesh=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,side:THREE.DoubleSide}));
 mesh.position.set(x,y,z);
 group.add(mesh);
 return mesh;
}
function spaceLine(group,from,to,color,opacity=.8){
 const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([from,to]),new THREE.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false}));
 group.add(line);
 return line;
}
function stopSpaceBossVoice(){
 if(!spaceBossVoice)return;
 spaceBossVoice.pause();
 spaceBossVoice.currentTime=0;
 spaceBossVoice=null;
}
function stopSpaceBossTheme(){for(const track of [SPACE_BOSS_THEME,IRON_DRIFT_BOSS_THEME]){track.pause();track.currentTime=0;}}
function playSpaceBossTheme(){SPACE_BOSS_THEME.pause();SPACE_BOSS_THEME.currentTime=0;SPACE_BOSS_THEME.muted=muted;SPACE_BOSS_THEME.play()?.catch(()=>{});}
function playKevinSolarTheme(){IRON_DRIFT_BOSS_THEME.pause();IRON_DRIFT_BOSS_THEME.currentTime=0;IRON_DRIFT_BOSS_THEME.muted=muted;IRON_DRIFT_BOSS_THEME.play()?.catch(()=>{});}
function clearSpaceBoss(){
 stopSpaceBossVoice();
 stopSpaceBossTheme();
 const cinematic=document.getElementById('solarJosiahCinematic');if(cinematic)cinematic.hidden=true;
 $('universeNo').hidden=false;
 $('spaceBossHUD').hidden=true;
 $('spaceBossEnd').hidden=true;
 if(!spaceBoss)return;
 const b=spaceBoss;
 document.exitPointerLock?.();
 if(b.gun)camera.remove(b.gun);
 if(b.root)disposeCampObject(b.root);
 for(const object of b.hiddenSceneObjects||[])object.visible=true;
 scene.fog=b.oldFog;
 if(b.oldBackground)scene.background.copy(b.oldBackground);
 $('spaceBossHUD').hidden=true;
 $('spaceBossEnd').hidden=true;
 spaceBoss=null;
 keys.clear();
}
function solarJosiahOverlay(){
 let panel=document.getElementById('solarJosiahCinematic');
 if(panel)return panel;
 panel=document.createElement('div');panel.id='solarJosiahCinematic';panel.hidden=true;
 panel.style.cssText='position:fixed;inset:0;z-index:85;pointer-events:none;background:linear-gradient(transparent 45%,rgba(1,3,12,.86));color:#fff;font-family:inherit';
 panel.innerHTML='<div style="position:absolute;bottom:8%;left:8%;right:8%;padding:20px 25px;background:rgba(4,9,22,.9);border:1px solid #8ec7ff;max-width:760px"><strong style="color:#9bd3ff;letter-spacing:.16em" id="solarJosiahSpeaker">JOSIAH RICHARDS</strong><p style="font-size:1.4rem;line-height:1.4;margin:10px 0" id="solarJosiahLine"></p><small>THE LAST REFUSAL / SOL</small></div><button type="button" style="position:absolute;right:5%;bottom:7%;pointer-events:auto;padding:12px 18px" id="solarJosiahContinue">CONTINUE →</button>';
 document.body.appendChild(panel);
 panel.querySelector('button').onclick=()=>{const b=spaceBoss,c=b?.cinematic;if(!c)return;if(c.phase==='victory'&&c.line<3){c.nextLine=c.line+1;c.lineTime=0;renderSolarCinematic(b,0);}else finishSolarCinematic(b);};
 return panel;
}
function makeSolarJosiah(b){
 const actor=makeSpaceJosiah(b.root);
 const halo=actor.userData.halo;halo.parent.remove(halo);halo.geometry.dispose();halo.material.dispose();
 actor.userData.halo=null;
 actor.position.set(b.x-3.5,0,b.z-3.5);actor.scale.setScalar(1.25);b.root.add(actor);
 const head=actor.userData.head;
 const lip=spaceGlow(head,new THREE.SphereGeometry(.075,14,10),0x311319,0,-.245,.337,1);
 lip.scale.y=.08;lip.visible=false;actor.userData.solarLip=lip;
 b.josiah=actor;b.josiahAssistTime=b.time+3;
 return actor;
}
function animateSolarJosiahCombat(b,dt){
 const ally=b.josiah,u=ally.userData,attack=b.josiahAttack;
 const age=attack?b.time-attack.start:0;
 const reach=attack?Math.sin(Math.min(1,age/1.25)*Math.PI):0;
 const target=new THREE.Vector3(b.bossX-6,1+Math.sin(b.time*1.8)*.2,b.bossZ+4);
 if(attack?.kind===3){target.set(b.bossX-1,1+Math.sin(Math.min(1,age/1.25)*Math.PI)*4,b.bossZ+2);}
 ally.position.lerp(target,1-Math.exp(-dt*3));
 ally.rotation.y=Math.atan2(b.bossX-ally.position.x,b.bossZ-ally.position.z);
 u.body.rotation.x=attack?.kind===3?reach*.5:-reach*.12;
 for(let i=0;i<2;i++){
  u.arms[i].rotation.x=-.2-reach*(attack?.kind===0?2.1:1.5);
  u.arms[i].rotation.z=(i?1:-1)*(.12+reach*(attack?.kind===0?.6:.15));
  u.legs[i].rotation.x=.2+Math.sin(b.time*2+i*Math.PI)*.12+reach*.25;
  u.handFlashes[i].visible=!!attack&&age>.35&&age<.85;
 }
 u.spectre.visible=attack?.kind===1;
 u.spectre.position.z=-.75+reach*2.2;
 u.spectre.rotation.x=-reach*.4;
 u.light.intensity=4+reach*10;
 if(attack&&!attack.hit&&age>=.7){
  attack.hit=true;
  ally.updateMatrixWorld(true);
  const from=u.handFlashes[0].getWorldPosition(new THREE.Vector3());
  const to=b.actor.position.clone().add(new THREE.Vector3(0,1.5,0));
  if(attack.kind===0){
   for(const flash of u.handFlashes)spaceGoldenChain(b,flash.getWorldPosition(new THREE.Vector3()),to,.6,0xffce54);
   b.bossX+=(ally.position.x-b.bossX)*.15;b.bossZ+=(ally.position.z-b.bossZ)*.15;
  }else if(attack.kind===2){
   const beam=spaceLine(b.root,from,to,0x80caff,1);b.effects.push({obj:beam,life:.4});
  }else{
   const burst=spaceGlow(b.root,new THREE.RingGeometry(.3,attack.kind===3?4:1.8,32),0x6ebdff,to.x,to.y,to.z,.75);
   if(attack.kind===3)burst.rotation.x=-Math.PI/2;
   b.effects.push({obj:burst,life:.45});
  }
  spaceGunImpact(b,to);b.bossHP=Math.max(0,b.bossHP-900);
  if(!b.bossHP){winSpaceBoss();return;}
 }
 if(attack&&age>=1.25)b.josiahAttack=null;
}
function beginSolarCinematic(b,phase){
 b.holding=false;keys.clear();document.exitPointerLock?.();
 stopSpaceBossVoice();
 b.cinematic={phase,time:0,line:-1,nextLine:0,lineTime:0};
 $('spaceBossHUD').hidden=true;
 solarJosiahOverlay().hidden=false;
 renderSolarCinematic(b,0);
}
function beginSolarJosiahEntrance(b){
 makeSolarJosiah(b);
 beginSolarCinematic(b,'entrance');
}
function beginSolarVictory(b){
 if(b.cinematic)return;
 if(!b.josiah)makeSolarJosiah(b);
 b.bossHP=0;b.actor.visible=false;
 beginSolarCinematic(b,'victory');
}
function renderSolarCinematic(b,dt){
 const c=b.cinematic;if(!c)return;
 c.time+=dt;c.lineTime+=dt;
 const lines=c.phase==='entrance'?
  [{speaker:'JOSIAH RICHARDS',text:'I am still here. Kevin does not get to decide how this universe ends.'},{speaker:'JOSIAH RICHARDS',text:'Stay with me. We stop him together.'}]:
  [{speaker:'JOSIAH RICHARDS',text:'Kevin is gone. The Sun is still burning.'},
   {speaker:'YOU',text:'Josiah... was there another way? Could we have stopped Kevin without resetting everything?'},
   {speaker:'JOSIAH RICHARDS',text:'Yes. I could have let go of that power before Kevin ever reached it. I told myself I alone could control it.'},
   {speaker:'JOSIAH RICHARDS',text:'The reset was my choice. Those lives are gone because of me. Stopping Kevin does not undo that.'}];
 const index=c.nextLine,line=lines[index],clip=c.phase==='victory'?[SOL_EPILOGUE_AUDIO[0],null,SOL_EPILOGUE_AUDIO[1],SOL_EPILOGUE_AUDIO[2]][index]:null;
 if(index!==c.line){
  c.line=index;document.getElementById('solarJosiahSpeaker').textContent=line.speaker;document.getElementById('solarJosiahLine').textContent=line.text;document.getElementById('solarJosiahContinue').textContent=index===lines.length-1?(c.phase==='victory'?'TO MAIN MENU →':'CONTINUE →'):'NEXT →';
  stopSpaceBossVoice();
  if(clip){spaceBossVoice=clip;clip.currentTime=0;clip.muted=muted;try{clip.play()?.catch(()=>{});}catch(e){}}
 }
 const ally=b.josiah;
 ally.position.set(b.x-2,0,b.z-6);
 ally.rotation.y=0;
 ally.userData.arms[0].rotation.x=-.65;ally.userData.arms[1].rotation.x=-.3;
 const lip=ally.userData.solarLip;
 const speaking=line.speaker==='JOSIAH RICHARDS'&&(clip?!clip.paused&&!clip.ended:c.lineTime<Math.min(3.5,line.text.length*.048));
 lip.visible=speaking;
 lip.scale.y=speaking?.12+Math.abs(Math.sin((clip?.currentTime||c.lineTime)*15))*.24:.08;
 ally.userData.mouth.visible=!speaking;
 camera.position.set(b.x,1.8,b.z+1.5);
 camera.lookAt(ally.position.x,1.55,ally.position.z);
 const duration=clip&&Number.isFinite(clip.duration)&&clip.duration>0?clip.duration+.45:clip?Math.max(4.5,line.text.length*.058):4.5;
 if(c.lineTime>=duration){if(index===lines.length-1)finishSolarCinematic(b);else{c.nextLine=index+1;c.lineTime=0;renderSolarCinematic(b,0);}}
}
function finishSolarCinematic(b){
 const phase=b.cinematic?.phase;if(!phase)return;
 b.cinematic=null;solarJosiahOverlay().hidden=true;
 b.josiah.userData.solarLip.visible=false;b.josiah.userData.mouth.visible=true;
 if(phase==='victory'){
  gameProgress={kevinSolarAftermath:true,kevinSolarCompleted:true,solarJosiahSurvived:true};
  saveProgress();clearSpaceBoss();
  loadChapterScreen('SOL / AFTER KEVIN',()=>{selectedSubject=0;menu();selectSubject(0);refreshProgressUI();});
  return;
 }
 $('spaceBossHUD').hidden=false;
 b.attackTime=b.time+2.5;
 requestLock();
}
function makeSpaceKevin(root){
 const actor=makeRevealedKevin();root.add(actor);
 const u=actor.userData;
 u.handFlashes=u.arms.map((arm,side)=>{const flash=spaceGlow(arm,new THREE.SphereGeometry(.15,10,8),0x8968a9,side?-.03:.03,-.68,.1,.9);flash.visible=false;return flash;});
 u.spectre=new THREE.Group();actor.add(u.spectre);u.spectre.position.set(0,0,-.8);
 spaceGlow(u.spectre,new THREE.SphereGeometry(.55,16,12),0x151019,0,1.65,0,.8);
 spaceGlow(u.spectre,new THREE.SphereGeometry(.32,12,10),0x4a3655,0,2.37,0,.9);
 for(const side of [-1,1])spaceGlow(u.spectre,new THREE.SphereGeometry(.17,10,8),0x211626,side*.7,1.4,0,.85);
 u.halo=new THREE.Group();actor.add(u.halo);u.halo.position.y=2.8;
 const halo=spaceGlow(u.halo,new THREE.TorusGeometry(.48,.045,6,32),0x3e2d4a,0,0,0,.8);halo.rotation.x=Math.PI/2;
 u.light=new THREE.PointLight(0x76518e,16,9);actor.add(u.light);u.light.position.y=1.8;
 return actor;
}
function startKevinSolarBoss(){
 if(gameProgress.kevinSolarAftermath!==true||mode!=='menu')return;
 solarBossLossErased=false;
 clearSpaceBoss();$('menu').hidden=true;$('kevinChainFailure').hidden=true;$('cosmicCaption').hidden=true;
 world.visible=upperWorld.visible=exhibit.visible=false;keys.clear();
 const hiddenSceneObjects=scene.children.filter(object=>object.visible&&!object.isLight&&object!==camera);
 hiddenSceneObjects.forEach(object=>object.visible=false);
 const oldFog=scene.fog,oldBackground=scene.background.clone();scene.fog=null;scene.background.setHex(0x010106);
 const root=new THREE.Group();scene.add(root);
 const floor=spaceGlow(root,new THREE.CircleGeometry(31,72),0x0c0c17,0,-.15,0,.68);floor.rotation.x=-Math.PI/2;
 const sun=new THREE.Mesh(new THREE.SphereGeometry(17,48,32),new THREE.MeshBasicMaterial({color:0xffd783}));sun.position.set(0,14,-70);root.add(sun);
 const glow=spaceGlow(root,new THREE.SphereGeometry(20,40,28),0xffa849,0,14,-70,.19);glow.material.side=THREE.BackSide;
 const sunlight=new THREE.PointLight(0xffbc73,16,180);sunlight.position.copy(sun.position);root.add(sunlight);
 const actor=makeSpaceKevin(root);actor.position.set(0,2.2,-10);
 const gun=new THREE.Group();camera.add(gun);gun.position.set(.34,-.27,-.6);
 spaceMesh(gun,new THREE.BoxGeometry(.14,.18,.65),0x202637,0,0,-.3);
 spaceMesh(gun,new THREE.BoxGeometry(.19,.3,.14),0x151821,0,-.19,-.02);
 const muzzle=spaceGlow(gun,new THREE.SphereGeometry(.085,10,8),0xffefad,0,0,-.68,.95);muzzle.visible=false;
 const health=[];for(let i=0;i<18;i++){const angle=i*Math.PI/9,radius=i<12?24:13;health.push({mesh:spaceMesh(root,new THREE.IcosahedronGeometry(.34,0),0x66efc4,Math.sin(angle)*radius,.45,Math.cos(angle)*radius,0x66efc4),used:false});}
 spaceBoss={kevinSolar:true,root,actor,gun,muzzle,health,oldFog,oldBackground,hiddenSceneObjects,x:0,z:19,bossX:0,bossZ:-10,hp:250,maxHP:250,bossHP:100000,maxBossHP:100000,ammo:24,reload:0,fire:0,holding:false,paused:false,time:0,attackTime:2.7,attack:null,attackCount:0,attackShots:0,projectiles:[],handFlashUntil:[0,0],dodge:0,tauntIndex:0,tauntTime:.8,tauntUntil:0,effects:[],josiah:null,josiahAssistTime:0,josiahLineIndex:0,josiahDialogueUntil:0,kevinReplyIndex:0,kevinReplyTime:Infinity,cinematic:null};
 yaw=0;pitch=0;mode='spaceBoss';
 syncMenuSong();playKevinSolarTheme();
 $('spaceBossHUD').querySelector('.space-boss-top small').textContent='THE LAST REFUSAL / SOL';
 $('spaceBossHUD').querySelector('.space-boss-top strong').firstChild.textContent='KEVIN MURDERHORN ';
 $('spaceBossTaunt').textContent='';$('spaceBossHUD').hidden=false;$('spaceBossEnd').hidden=true;
 renderSpaceBoss(0);requestLock();
}
function makeSpaceJosiah(root){
 const actor=makeCharacter();
 actor.traverse(object=>{
  if(object.geometry)object.geometry=object.geometry.clone();
  if(object.material)object.material=Array.isArray(object.material)?object.material.map(m=>m.clone()):object.material.clone();
 });
 root.add(actor);
 const {head,legs,arms}=actor.userData;
 const handFlashes=[];
 for(let i=0;i<arms.length;i++){
  const side=i===0?-1:1,arm=arms[i];
  const handFlash=spaceGlow(arm,new THREE.SphereGeometry(.13,10,8),0x9cdeff,side*.055,-.68,.1,1);
  handFlash.visible=false;
  handFlashes.push(handFlash);
 }
 const spectre=new THREE.Group();
 spectre.position.set(0,-.1,-.75);
 spectre.scale.setScalar(1.75);
 actor.add(spectre);
 spaceGlow(spectre,new THREE.SphereGeometry(.49,14,10),0x2567e5,0,1.7,0,.3);
 spaceGlow(spectre,new THREE.SphereGeometry(.31,12,10),0x80caff,0,2.45,0,.65);
 for(const side of [-1,1]){
  const ghostArm=spaceGlow(spectre,new THREE.CylinderGeometry(.14,.22,1.35,8),0x398eff,side*.75,1.6,0,.46);
  ghostArm.rotation.z=side*.42;
  spaceGlow(spectre,new THREE.SphereGeometry(.25,10,8),0x9de5ff,side*1.04,.94,.08,.65);
 }
 const halo=spaceGlow(actor,new THREE.TorusGeometry(1.25,.035,6,48),0x5ba8ff,0,1.6,-.8,.65);
 halo.rotation.x=Math.PI/2;
 const light=new THREE.PointLight(0x3b84ff,20,18,2);
 light.position.set(0,2,-.25);
 actor.add(light);
 Object.assign(actor.userData,{spectre,halo,light,handFlashes});
 return actor;
}
function makeAwakenedMenuJosiah(root){
 const actor=makeSpaceJosiah(root),gold=new THREE.MeshStandardMaterial({color:0xf7c746,emissive:0x98600b,emissiveIntensity:.9,metalness:.72,roughness:.24});
 actor.name='Awakened Josiah Richards / Laniakea menu';
 const stand=actor.userData.spectre;
 stand.scale.setScalar(1.15);stand.position.set(-.32,-.15,-.82);
 for(let i=0;i<5;i++){
  const spike=new THREE.Mesh(new THREE.ConeGeometry(.09,.31,5),gold);
  spike.position.set((i-2)*.145,2.83+(.12-Math.abs(i-2)*.045),0);
  stand.add(spike);
 }
 const chains=new THREE.Group();chains.name='Awakened golden chains';actor.add(chains);
 const linkGeometry=new THREE.TorusGeometry(.078,.025,6,10);
 const paths=[
  [[-.29,.88,.1],[-.70,1.04,.42],[-1.18,1.52,.23],[-1.34,2.42,-.23]],
  [[.29,.88,.1],[.85,1.22,.39],[1.3,1.82,.02],[1.16,2.76,-.44]],
  [[-.28,1.43,-.42],[-.88,1.76,-.65],[-.52,2.55,-.9],[.14,2.91,-1.01]],
  [[.3,1.43,-.44],[.90,1.73,-.77],[.58,2.5,-1.04],[-.18,2.86,-1.18]]
 ];
 for(const points of paths){const curve=new THREE.CatmullRomCurve3(points.map(point=>new THREE.Vector3(...point)));for(let i=0;i<22;i++){
  const t=i/21,link=new THREE.Mesh(linkGeometry,gold),tangent=curve.getTangent(t).normalize();
  link.position.copy(curve.getPoint(t));link.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),tangent);if(i%2)link.rotateY(Math.PI/2);chains.add(link);
 }}
 const light=new THREE.PointLight(0xf5bd48,8,6,2);light.position.set(0,1.8,.5);actor.add(light);
 actor.userData.awakenedChains=chains;actor.userData.awakenedLight=light;actor.visible=false;
 return actor;
}
function poseAwakenedMenuJosiah(actor,time){
 const u=actor.userData;
 setSternJosiah(actor,true);
 const deceased=gameProgress.laniakeaCompleted===true;
 u.spectre.visible=u.awakenedChains.visible=u.halo.visible=!deceased;
 u.light.intensity=deceased?0:20;
 if(deceased){u.body.rotation.set(.08,0,0);u.head.rotation.set(.28,0,0);u.arms.forEach((arm,i)=>arm.rotation.set(0,0,i?.09:-.09));u.awakenedLight.intensity=2;return;}
 u.body.rotation.set(-.035,0,0);u.head.rotation.set(-.07,0,0);
 u.arms[0].visible=u.arms[1].visible=true;
 u.arms[0].rotation.set(-2.95,0,-.22);u.arms[1].rotation.set(-.08,0,.14);
 u.spectre.position.y=-.15+Math.sin(time*1.2)*.06;
 u.awakenedChains.rotation.y=Math.sin(time*.6)*.075;
 u.awakenedLight.intensity=7+Math.sin(time*2.4)*1.3;
}
function startSpaceBoss(){
 const encounter=finalWar?.josiahEncounter;
 if(!encounter||encounter.phase!=='universeLost')return;
 clearSpaceBoss();
 $('universeFailure').hidden=true;
 $('cosmicCaption').hidden=true;
 $('finalWarHUD').hidden=true;
 $('finalWarPause').hidden=true;
 $('finalWarEnd').hidden=true;
 $('finalWarKevinDialogue').hidden=true;
 $('finalWarKevinHealth').hidden=true;
 if(encounter.cosmos)encounter.cosmos.visible=false;
 world.visible=upperWorld.visible=exhibit.visible=false;
 const hiddenSceneObjects=scene.children.filter(object=>object.visible&&!object.isLight&&object!==camera);
 hiddenSceneObjects.forEach(object=>{object.visible=false;});
 scene.background.setHex(0x02030b);
 scene.fog=null;
 const root=new THREE.Group();
 scene.add(root);
 const starPositions=[],starColors=[];
 let seed=71833;
 const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(let i=0;i<1400;i++){
  const angle=random()*Math.PI*2,height=random()*1.55-.5,radius=85+random()*30,flat=Math.sqrt(1-height*height);
  starPositions.push(Math.cos(angle)*flat*radius,height*radius+10,Math.sin(angle)*flat*radius);
  const tint=random();
  starColors.push(tint<.8?.64:1,tint<.8?.78:.85,1);
 }
 const stars=new THREE.BufferGeometry();
 stars.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));
 stars.setAttribute('color',new THREE.Float32BufferAttribute(starColors,3));
 root.add(new THREE.Points(stars,new THREE.PointsMaterial({size:.24,vertexColors:true,transparent:true,opacity:.8,depthWrite:false})));
 const ground=spaceGlow(root,new THREE.CircleGeometry(31,72),0x17213d,0,-.15,0,.72);
 ground.rotation.x=-Math.PI/2;
 for(const radius of [9,18,29]){
  const ring=spaceGlow(root,new THREE.RingGeometry(radius-.06,radius+.06,90),0x6b98df,0,-.1,0,.42);
  ring.rotation.x=-Math.PI/2;
 }
 for(let i=0;i<16;i++){
  const a=i*Math.PI/8;
  spaceLine(root,new THREE.Vector3(0,-.08,0),new THREE.Vector3(Math.sin(a)*29,-.08,Math.cos(a)*29),0x3e5689,.38);
 }
 const cosmos=createJosiahCosmicModels(root);
 cosmos.british.visible=false;
 cosmos.virgo.visible=false;
 cosmos.laniakea.visible=true;
 cosmos.laniakea.position.set(0,10,-48);
 cosmos.laniakea.scale.setScalar(2.8);
 const actor=makeSpaceJosiah(root);
 actor.position.set(0,3.2,-10);
 const gun=new THREE.Group();
 camera.add(gun);
 gun.position.set(.34,-.27,-.6);
 spaceMesh(gun,new THREE.BoxGeometry(.14,.18,.65),0x202637,0,0,-.3);
 spaceMesh(gun,new THREE.BoxGeometry(.19,.3,.14),0x151821,0,-.19,-.02);
 const muzzle=spaceGlow(gun,new THREE.SphereGeometry(.085,10,8),0xffefad,0,0,-.68,.95);
 muzzle.visible=false;
 const health=[];
 for(let i=0;i<18;i++){
  const a=i*Math.PI/9,radius=i<12?24:13;
  const phase=i<12?0:Math.PI/18;
  health.push({mesh:spaceMesh(root,new THREE.IcosahedronGeometry(.34,0),0x66efc4,Math.sin(a+phase)*radius,.45,Math.cos(a+phase)*radius,0x66efc4),used:false});
 }
 spaceBoss={root,actor,gun,muzzle,health,oldFog:encounter.oldFog,x:0,z:19,bossX:0,bossZ:-10,hp:250,maxHP:250,bossHP:100000,maxBossHP:100000,ammo:24,reload:0,fire:0,holding:false,paused:false,time:0,attackTime:2.7,attack:null,attackCount:0,attackShots:0,projectiles:[],handFlashUntil:[0,0],dodge:0,tauntIndex:0,tauntTime:.8,tauntUntil:0,effects:[]};
 yaw=0;pitch=0;mode='spaceBoss';
 spaceBoss.hiddenSceneObjects=hiddenSceneObjects;
 $('spaceBossHUD').hidden=false;
 $('spaceBossEnd').hidden=true;
 $('spaceBossHUD').querySelector('.space-boss-top small').textContent='THE LAST REFUSAL / LANIAKEA';
 $('spaceBossHUD').querySelector('.space-boss-top strong').firstChild.textContent='JOSIAH RICHARDS ';
 playSpaceBossTheme();
 renderSpaceBoss(0);
 requestLock();
}
function spaceBossTaunt(b){
 const index=b.tauntIndex++;
 const line=(b.kevinSolar?SPACE_KEVIN_TAUNTS:SPACE_JOSIAH_TAUNTS)[index];
 $('spaceBossTaunt').textContent=(b.kevinSolar?'KEVIN MURDERHORN':'JOSIAH RICHARDS')+' · '+line;
 const clip=(b.kevinSolar?SPACE_KEVIN_AUDIO:SPACE_JOSIAH_AUDIO)[index];
 stopSpaceBossVoice();
 spaceBossVoice=clip;
 clip.currentTime=0;
 clip.muted=muted;
 try{clip.play()?.catch(()=>{});}catch(e){}
 const duration=Number.isFinite(clip.duration)&&clip.duration>0?clip.duration:6;
 b.tauntUntil=b.time+Math.max(5,duration);
 b.tauntTime=b.tauntUntil+2;
}
function spaceBossShoot(){
 const b=spaceBoss;
 if(!b||b.paused||b.cinematic||b.hp<=0||b.bossHP<=0||b.fire>0||b.reload>0)return;
 if(b.ammo<=0){spaceBossReload();return;}
 b.ammo--;
 b.fire=.12;
 b.muzzle.visible=true;
 b.muzzleUntil=b.time+.075;
 playGunshot(.7);
 tone(170,.08,.12,'sawtooth',65);
 const aim=new THREE.Vector3(0,0,-1).applyEuler(camera.rotation),origin=camera.position.clone();
 const target=b.actor.position.clone().add(new THREE.Vector3(0,1.55,0));
 const along=target.clone().sub(origin).dot(aim);
 const distance=target.clone().sub(origin).addScaledVector(aim,-along).length();
 if(along>0&&along<85&&distance<1.55){
  if(b.dodge<=0&&Math.random()<.12){
   b.dodge=.55;
   b.bossX+=Math.random()<.5?-2.5:2.5;
  }else{
   b.bossHP=Math.max(0,b.bossHP-(distance<.5?400:250));
   b.actor.userData.light.intensity=42;
   spaceGunImpact(b,target);
   if(b.kevinSolar&&b.bossHP<=50000&&!b.josiah){beginSolarJosiahEntrance(b);return;}
   if(b.bossHP===0){winSpaceBoss();return;}
  }
 }
 const end=origin.clone().addScaledVector(aim,Math.min(75,Math.max(8,along)));
 const tracer=spaceLine(b.root,origin,end,0xffd76f,.95);
 b.effects.push({obj:tracer,life:.09});
}
function spaceGunImpact(b,point){
 for(let i=0;i<8;i++){
  const angle=i*Math.PI/4+Math.random()*.2;
  const direction=new THREE.Vector3(Math.cos(angle),Math.sin(angle),.15-Math.random()*.3);
  const spark=spaceGlow(b.root,new THREE.IcosahedronGeometry(.055,0),i%2?0xffd36c:0xffffff,point.x,point.y,point.z,.95);
  spark.position.addScaledVector(direction,.18);
  b.effects.push({obj:spark,life:.19});
  const streak=spaceLine(b.root,point.clone().addScaledVector(direction,.08),point.clone().addScaledVector(direction,.42),i%2?0xffb548:0xfff4cd,.9);
  b.effects.push({obj:streak,life:.12});
 }
}
function spaceBossReload(){
 const b=spaceBoss;
 if(b&&!b.paused&&b.reload<=0&&b.ammo<24)b.reload=1.3;
}
function spaceBossBolt(b){
 const side=b.attackShots++%2,hand=b.actor.userData.arms[side],flash=b.actor.userData.handFlashes[side];
 b.actor.updateMatrixWorld(true);
 const from=flash.getWorldPosition(new THREE.Vector3());
 flash.visible=true;
 b.handFlashUntil[side]=b.time+.22;
 const target=new THREE.Vector3(b.x,1.7,b.z);
 const direction=target.sub(from).normalize();
 const mesh=spaceGlow(b.root,new THREE.IcosahedronGeometry(.28,1),b.kevinSolar?0x40284f:0x78caff,from.x,from.y,from.z,.9);
 b.projectiles.push({mesh,velocity:direction.multiplyScalar(15),life:5});
}
function spaceGoldenChain(b,from,to,life=.42,color=b.kevinSolar?0x34223d:0xffce54){
 const delta=to.clone().sub(from),length=delta.length();
 if(length<.01)return;
 const direction=delta.normalize(),rotation=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),direction);
 const count=Math.min(90,Math.max(3,Math.ceil(length/.26)));
 for(let i=0;i<count;i++){
  const point=from.clone().lerp(to,i/(count-1));
  const link=spaceGlow(b.root,new THREE.TorusGeometry(.105,.032,5,9),color,point.x,point.y,point.z,.95);
  link.scale.y=1.5;
  link.quaternion.copy(rotation);
  link.rotateY(i%2*Math.PI/2);
  b.effects.push({obj:link,life});
 }
}
function spaceBossAttack(b){
 const kind=[0,1,2,3][b.attackCount++%4];
 const target=new THREE.Vector3(b.x,1.7,b.z);
 const from=b.actor.position.clone().add(new THREE.Vector3(0,1.6,0));
 let warning;
 if(kind===0){
  warning=spaceLine(b.root,from,target,b.kevinSolar?0x795586:0x92dcff,.68);
 }else if(kind===1||kind===3){
  warning=spaceLine(b.root,from,target,b.kevinSolar?0x594066:0xffce54,.95);
 }else{
  warning=spaceGlow(b.root,new THREE.RingGeometry(2.8,3,42),b.kevinSolar?0x6e4a80:0x8bc6ff,target.x,.05,target.z,.75);
  warning.rotation.x=-Math.PI/2;
 }
 const duration=kind===0?.55:kind===1?.85:kind===3?1.2:1.1;
 b.attack={kind,target,warning,left:duration,duration,from,start:b.actor.position.clone()};
 b.attackTime=b.time+(kind===0?1.8:2.4);
}
function spaceBossDamage(b,damage){
 b.hp=Math.max(0,b.hp-damage);
 tone(65,.35,.2,'sawtooth',25);
 if(b.hp===0){if(b.kevinSolar)loseKevinSolarBoss();else loseSpaceBoss();}
}
function finishSpaceBossAttack(b){
 const attack=b.attack;
 if(!attack)return;
 b.root.remove(attack.warning);
 attack.warning.geometry.dispose();
 attack.warning.material.dispose();
 if(attack.kind===0){
  for(let i=-1;i<=1;i++){
   spaceBossBolt(b);
   b.projectiles.at(-1).velocity.applyAxisAngle(new THREE.Vector3(0,1,0),i*.13);
  }
 }else if(attack.kind===1||attack.kind===3){
  b.actor.updateMatrixWorld(true);
  const from=b.actor.userData.handFlashes[1].getWorldPosition(new THREE.Vector3());
  const end=attack.target.clone();
  spaceGoldenChain(b,from,end);
  if(attack.kind===3){
   const other=b.actor.userData.handFlashes[0].getWorldPosition(new THREE.Vector3());
   const direction=end.clone().sub(from).normalize();
   const sideways=new THREE.Vector3(-direction.z,0,direction.x).multiplyScalar(3);
   const left=end.clone().sub(sideways),right=end.clone().add(sideways);
   spaceGoldenChain(b,other,left,.55);
   spaceGoldenChain(b,left,right,.55);
   const nearest=new THREE.Line3(left,right).closestPointToPoint(new THREE.Vector3(b.x,1.7,b.z),true,new THREE.Vector3());
   if(nearest.distanceTo(new THREE.Vector3(b.x,1.7,b.z))<1.2)spaceBossDamage(b,40);
  }else if(Math.hypot(b.x-end.x,b.z-end.z)<1.45){
   spaceBossDamage(b,34);
   const pull=new THREE.Vector3(from.x-b.x,0,from.z-b.z).normalize().multiplyScalar(1.8);
   b.x+=pull.x;b.z+=pull.z;
  }
 }else{
  b.bossX=attack.target.x;
  b.bossZ=attack.target.z;
  b.actor.position.set(b.bossX,.15,b.bossZ);
  b.recoverUntil=b.time+.4;
  const blast=spaceGlow(b.root,new THREE.RingGeometry(.3,3.2,48),b.kevinSolar?0x60336f:0x7abaff,attack.target.x,.09,attack.target.z,.75);
  blast.rotation.x=-Math.PI/2;
  b.effects.push({obj:blast,life:.45});
  if(Math.hypot(b.x-attack.target.x,b.z-attack.target.z)<3)spaceBossDamage(b,44);
 }
 b.attack=null;
}
function renderSpaceBoss(dt){
 const b=spaceBoss;
 if(!b||b.paused)return;
 if(b.cinematic){renderSolarCinematic(b,dt);return;}
 b.time+=dt;
 if(b.josiah){
  const ally=b.josiah;
  animateSolarJosiahCombat(b,dt);
  if(b.cinematic)return;
  const speaking=b.time<b.josiahDialogueUntil&&SPACE_JOSIAH_SOL_AUDIO.includes(spaceBossVoice)&&!spaceBossVoice.paused&&!spaceBossVoice.ended;
  ally.userData.solarLip.visible=speaking;
  ally.userData.solarLip.scale.y=speaking?.12+Math.abs(Math.sin(spaceBossVoice.currentTime*15))*.24:.08;
  ally.userData.mouth.visible=!speaking;
  if(b.time>=b.josiahAssistTime){
   const kind=(b.josiahAttackCount||0)%4;b.josiahAttackCount=(b.josiahAttackCount||0)+1;
   b.josiahAttack={kind,start:b.time,hit:false};
   b.josiahAssistTime=b.time+3.5;
   if(b.josiahLineIndex<SPACE_JOSIAH_SOL_LINES.length){
    const index=b.josiahLineIndex++;
    const line=SPACE_JOSIAH_SOL_LINES[index],clip=SPACE_JOSIAH_SOL_AUDIO[index];
    $('spaceBossTaunt').textContent='JOSIAH RICHARDS · '+line;
    stopSpaceBossVoice();spaceBossVoice=clip;clip.currentTime=0;clip.muted=muted;
    try{clip.play()?.catch(()=>{});}catch(e){}
    const duration=Number.isFinite(clip.duration)&&clip.duration>0?clip.duration:Math.max(3.2,line.length*.055);
    b.josiahDialogueUntil=b.time+duration;
    b.josiahAssistTime=Math.max(b.josiahAssistTime,b.josiahDialogueUntil+.6);
    b.tauntUntil=b.josiahDialogueUntil;
    b.tauntTime=Math.max(b.tauntTime,b.josiahDialogueUntil+1.5);
    if(b.josiahLineIndex===SPACE_JOSIAH_SOL_LINES.length)b.kevinReplyTime=b.josiahDialogueUntil+1.5;
   }
   if(b.bossHP===0){winSpaceBoss();return;}
  }
 }
 b.fire=Math.max(0,b.fire-dt);
 b.dodge=Math.max(0,b.dodge-dt);
 if(b.muzzle.visible&&b.time>=b.muzzleUntil)b.muzzle.visible=false;
 b.actor.userData.handFlashes.forEach((flash,i)=>{if(b.time>=b.handFlashUntil[i])flash.visible=false;});
 if(b.reload>0){b.reload-=dt;if(b.reload<=0)b.ammo=24;}
 if(b.holding)spaceBossShoot();
 const forward=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0);
 const side=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0);
 const length=Math.hypot(forward,side)||1,speed=keys.has('ShiftLeft')?10:6;
 b.x+=(-Math.sin(yaw)*forward+Math.cos(yaw)*side)*dt*speed/length;
 b.z+=(-Math.cos(yaw)*forward-Math.sin(yaw)*side)*dt*speed/length;
 const arenaDistance=Math.hypot(b.x,b.z);
 if(arenaDistance>28){b.x*=28/arenaDistance;b.z*=28/arenaDistance;}
 camera.position.set(b.x,1.7,b.z);
 camera.rotation.order='YXZ';
 camera.rotation.set(pitch,yaw,0);
 camera.updateMatrixWorld(true);
 // Pursue the player rather than orbiting a fixed point in the arena.
 const dx=b.x-b.bossX,dz=b.z-b.bossZ,distanceToPlayer=Math.hypot(dx,dz);
 if(b.attack?.kind!==2&&distanceToPlayer>5){
  const step=Math.min(distanceToPlayer-5,dt*8.5);
  b.bossX+=dx/distanceToPlayer*step;
  b.bossZ+=dz/distanceToPlayer*step;
 }
 if(b.attack&&b.attack.left>.3){
  b.attack.target.set(b.x,1.7,b.z);
  if(b.attack.kind===2)b.attack.warning.position.set(b.x,.05,b.z);
 }
 const dive=b.attack?.kind===2?THREE.MathUtils.clamp((b.attack.duration-b.attack.left-.3)/.8,0,1):0;
 const height=b.time<(b.recoverUntil||0)?.15:2.2+Math.sin(b.time*2.1)*.3;
 b.actor.position.set(b.bossX,height,b.bossZ);
 if(b.attack?.kind===2)b.actor.position.lerpVectors(b.attack.start,new THREE.Vector3(b.attack.target.x,.15,b.attack.target.z),dive);
 b.actor.rotation.y=Math.atan2(b.x-b.actor.position.x,b.z-b.actor.position.z);
 const pose=b.attack?.kind??-1;
 const {arms,legs,spectre,halo,light}=b.actor.userData;
 arms[0].rotation.x+=( (pose===0?-2.1:pose===3?-1.7:pose===1?-1.25:pose===2?.6:-.45)-arms[0].rotation.x)*Math.min(1,dt*9);
 arms[1].rotation.x+=( (pose===0?-2.1:pose===3?-1.7:pose===1?-2.5:pose===2?.6:-.45)-arms[1].rotation.x)*Math.min(1,dt*9);
 arms[0].rotation.z=Math.sin(b.time*3)*.16-.16;
 arms[1].rotation.z=-Math.sin(b.time*3)*.16+.16;
 if(pose===3){arms[0].rotation.z=-.9;arms[1].rotation.z=.9;}
 legs[0].rotation.x=.28+Math.sin(b.time*2.3)*.1;
 legs[1].rotation.x=.28-Math.sin(b.time*2.3)*.1;
 b.actor.rotation.x=pose===2?-dive*.75:Math.sin(b.time*1.8)*.05;
 spectre.position.y=Math.sin(b.time*2)*.18-.1;
 spectre.scale.setScalar(1.25);
 spectre.visible=pose<0;
 halo.rotation.z=b.time*.8;
 light.intensity+=( (pose>=0?30:16)-light.intensity)*Math.min(1,dt*7);
 if(!b.josiah&&b.tauntIndex<10&&b.time>=b.tauntTime)spaceBossTaunt(b);
 if(b.josiah&&b.kevinReplyIndex<SPACE_KEVIN_SOL_REPLIES.length&&b.time>=b.kevinReplyTime){
  const index=b.kevinReplyIndex++;
  const line=SPACE_KEVIN_SOL_REPLIES[index],clip=SPACE_KEVIN_SOL_REPLY_AUDIO[index];
  $('spaceBossTaunt').textContent='KEVIN MURDERHORN · '+line;
  stopSpaceBossVoice();spaceBossVoice=clip;clip.currentTime=0;clip.muted=muted;
  try{clip.play()?.catch(()=>{});}catch(e){}
  const duration=Number.isFinite(clip.duration)&&clip.duration>0?clip.duration:Math.max(4,line.length*.055);
  b.tauntUntil=b.time+duration;
  b.kevinReplyTime=b.tauntUntil+2;
 }
 if(spaceBossVoice)spaceBossVoice.muted=muted;
 (b.kevinSolar?IRON_DRIFT_BOSS_THEME:SPACE_BOSS_THEME).muted=muted;
 if(b.time>b.tauntUntil)$('spaceBossTaunt').textContent='';
 if(!b.attack&&b.time>=b.attackTime)spaceBossAttack(b);
 if(b.attack){
  b.attack.left-=dt;
  if(b.attack.kind!==2){
   b.actor.updateMatrixWorld(true);
   const from=b.actor.userData.handFlashes[b.attack.kind===1?1:0].getWorldPosition(new THREE.Vector3());
   const positions=b.attack.warning.geometry.attributes.position;
   positions.setXYZ(0,from.x,from.y,from.z);
   positions.setXYZ(1,b.attack.target.x,b.attack.target.y,b.attack.target.z);
   positions.needsUpdate=true;
   b.attack.warning.geometry.computeBoundingSphere();
  }
  b.attack.warning.material.opacity=.45+Math.sin(b.time*18)*.35;
  if(b.attack.left<=0){finishSpaceBossAttack(b);if(!spaceBoss)return;}
 }
 for(let i=b.projectiles.length-1;i>=0;i--){
  const projectile=b.projectiles[i];
  const previous=projectile.mesh.position.clone();
  projectile.mesh.position.addScaledVector(projectile.velocity,dt);
  projectile.life-=dt;
  const path=new THREE.Line3(previous,projectile.mesh.position);
  const nearest=path.closestPointToPoint(camera.position,true,new THREE.Vector3());
  if(nearest.distanceTo(camera.position)<.9){
   b.root.remove(projectile.mesh);projectile.mesh.geometry.dispose();projectile.mesh.material.dispose();
   b.projectiles.splice(i,1);
   spaceBossDamage(b,18);
   if(!spaceBoss)return;
  }else if(projectile.life<=0){
   b.root.remove(projectile.mesh);projectile.mesh.geometry.dispose();projectile.mesh.material.dispose();
   b.projectiles.splice(i,1);
  }
 }
 for(const pickup of b.health){
  if(pickup.used)continue;
  pickup.mesh.rotation.y+=dt;
  pickup.mesh.position.y=.45+Math.sin(b.time*3+pickup.mesh.position.x)*.12;
  if(Math.hypot(b.x-pickup.mesh.position.x,b.z-pickup.mesh.position.z)<1.1&&b.hp<b.maxHP){
   b.hp=Math.min(b.maxHP,b.hp+75);pickup.used=true;pickup.mesh.visible=false;
  }
 }
 for(let i=b.effects.length-1;i>=0;i--){
  const effect=b.effects[i];
  effect.life-=dt;
  if(effect.life<=0){
   b.root.remove(effect.obj);effect.obj.geometry.dispose();effect.obj.material.dispose();b.effects.splice(i,1);
  }
 }
 $('spaceBossHP').textContent=Math.ceil(b.bossHP).toLocaleString()+' / '+b.maxBossHP.toLocaleString();
 $('spaceBossBar').style.width=b.bossHP/b.maxBossHP*100+'%';
 $('spacePlayerHP').textContent=Math.ceil(b.hp)+' / 250';
 $('spacePlayerBar').style.width=b.hp/b.maxHP*100+'%';
 $('spaceAmmo').textContent=b.reload>0?'RELOADING…':b.ammo+' / 24';
}
function winSpaceBoss(){
 if(spaceBoss?.kevinSolar){beginSolarVictory(spaceBoss);return;}
 gameProgress={laniakeaAftermath:true,laniakeaCompleted:true};
 saveProgress();
 clearSpaceBoss();
 $('universeFailure').hidden=true;
 startResistanceCredits();
}
function loseKevinSolarBoss(){
 clearSpaceBoss();solarBossLossErased=true;gameProgress={};selectedSubject=0;
 try{localStorage.removeItem(SAVE_KEY);saveAvailable=true;}catch(e){saveAvailable=false;try{localStorage.setItem(SAVE_KEY,'{}');saveAvailable=true;}catch(e){}}
 mode='spaceBossLost';
 $('spaceBossEndTitle').textContent='GAME OVER';$('spaceBossEndText').textContent=saveAvailable?'Kevin Murderhorn won. Your save data has been erased.':'Kevin Murderhorn won. Save data could not be erased from this browser.';
 $('spaceBossResume').hidden=true;$('spaceBossEnd').hidden=false;
}
let originalResistanceCredits=null;
function configureLaniakeaCredits(){
 const panel=$('resistanceCredits'),copy=panel.querySelector('.credits-copy'),heading=panel.querySelector('.credits-heading');
 if(!originalResistanceCredits)originalResistanceCredits={copy:copy.innerHTML,heading:heading.textContent};
 const completed=gameProgress.laniakeaCompleted===true;
 panel.classList.toggle('laniakea-credits',completed);
 heading.textContent=completed?'PROJECT BC · LANIAKEA':originalResistanceCredits.heading;
 copy.innerHTML=completed?`<div class="eyebrow">THE LAST REFUSAL</div><h1>THE UNIVERSE ENDURES</h1>
 <p>Josiah Richards is dead.</p>
 <p>At the edge of Laniakea, his golden chains finally broke. The force tearing reality apart fell silent. Across the darkness, the stars held their places. The universe had been saved.</p>
 <p>But victory could not bring back what had already been lost.</p>
 <p>Brent Cross was gone. Earth was gone. Everyone you had known—friend, enemy, and those caught between them—was dead. There would be no return to London, no reopening of Parliament, no voices waiting to welcome you home.</p>
 <p>The Prime Secretary had wanted existence to end with him. You denied him that final command.</p>
 <p>Somewhere beyond the silence, worlds you would never see continued beneath unfamiliar skies. Their people would never know your name, or how close everything had come to ending.</p>
 <p>You saved their tomorrow. There was no one left to share yours.</p>
 <h2>EVERYONE IS GONE.<br>THE UNIVERSE REMAINS.</h2><p>PROJECT BC</p><p>THE END</p>`:originalResistanceCredits.copy;
}
function refreshLaniakeaAftermathMenu(){
 const solar=gameProgress.kevinSolarAftermath===true,active=solar||gameProgress.laniakeaAftermath===true,menuElement=$('menu');
 if(!menuElement)return;
 menuElement.classList.toggle('laniakea-aftermath',active);
 menuElement.classList.toggle('kevin-solar-aftermath',solar);
 $('laniakeaAftermath').hidden=!active;
 const completed=active&&(solar?gameProgress.kevinSolarCompleted===true:gameProgress.laniakeaCompleted===true);
 menuElement.classList.toggle('laniakea-completed',completed);
 $('laniakeaAftermathTitle').textContent=solar?(completed?'KEVIN IS DEFEATED':'THE WORLD IS GONE'):(completed?'THE UNIVERSE IS SAVED':'THE WORLD IS GONE');
 const panel=$('laniakeaAftermath');
 panel.querySelector('.eyebrow').textContent=solar?'THE LAST REFUSAL / SOL':'THE LAST REFUSAL / WHAT REMAINS';
 panel.querySelector('p').textContent=solar?(completed?'Kevin Murderhorn is dead. Josiah helped stop him. The Sun still burns.':'Kevin Murderhorn waits at the Sun. Josiah is alive.'):(completed?'Everyone is deceased. There is no one left to return to.':'Only Josiah Richards remains.');
 for(const item of panel.querySelectorAll('li')){const name=item.textContent.trim(),alive=solar?(name.startsWith('JOSIAH RICHARDS')||(!completed&&name.startsWith('KEVIN MURDERHORN'))):(!completed&&name.startsWith('JOSIAH RICHARDS'));item.querySelector('b').textContent=alive?'ALIVE':'DECEASED';}
 $('fightJosiahAgain').textContent=solar?'FIGHT KEVIN IN SPACE IN THE SOL!':'FIGHT JOSIAH IN LANIAKEA';
 $('fightJosiahAgain').hidden=completed;
 let erase=$('laniakeaEraseSave');
 if(!erase){erase=document.createElement('button');erase.id='laniakeaEraseSave';erase.textContent='ERASE SAVE DATA';panel.appendChild(erase);erase.onclick=eraseLaniakeaSave;}
 erase.hidden=!completed;
 $('solarFreeRoam')?.remove();
 let negotiate=$('solarNegotiate');
 if(!negotiate){negotiate=document.createElement('button');negotiate.id='solarNegotiate';negotiate.type='button';panel.insertBefore(negotiate,erase);negotiate.onclick=()=>startSolarNegotiation(gameProgress.solarNegotiated===true);}
 negotiate.textContent=gameProgress.solarNegotiated===true?"JOSIAH'S IDEA":'NEGOTIATE WITH JOSIAH';
 negotiate.hidden=!(solar&&completed)||gameProgress.solarPrayerCompleted===true;
 let restoration=$('solarRestoration');
 if(!restoration){restoration=document.createElement('button');restoration.id='solarRestoration';restoration.type='button';restoration.textContent='UNIVERSAL RESTORATION';panel.insertBefore(restoration,erase);restoration.onclick=startUniversalRestoration;}
 restoration.hidden=!(solar&&completed&&gameProgress.solarPrayerCompleted===true);
 if(solar&&gameProgress.solarPrayerCompleted===true)erase.hidden=true;
 for(const id of ['openChapters','inspect'])$(id).hidden=active;
 const selector=menuElement.querySelector('.subject-switch');if(selector)selector.hidden=active&&!solar;
 const details=menuElement.querySelector('.details');if(details)details.hidden=active;
}
let solarNegotiation=null;
function startSolarNegotiation(prayer=false){
 if(mode!=='menu'||gameProgress.kevinSolarCompleted!==true)return;
 selectedSubject=0;selectSubject(0);
 let panel=$('solarNegotiation');
 if(!panel){
  panel=document.createElement('section');panel.id='solarNegotiation';panel.hidden=true;
  panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Josiah speaks');
  panel.innerHTML='<div class="solar-negotiation-heading">THE LAST REFUSAL / SOL</div><div class="solar-negotiation-inner"><strong>JOSIAH RICHARDS</strong><p id="solarNegotiationLine"></p><button id="solarNegotiationNext" type="button">CONTINUE →</button></div>';
  document.body.appendChild(panel);
  $('solarNegotiationNext').onclick=()=>{if(!solarNegotiation)return;solarNegotiation.index++;if(solarNegotiation.index>=solarNegotiation.lines.length){finishSolarNegotiation();return;}showSolarNegotiationLine();};
 }
 const hiddenSceneObjects=scene.children.filter(object=>object.visible&&!object.isLight&&object!==camera);
 hiddenSceneObjects.forEach(object=>object.visible=false);
 const oldFog=scene.fog,oldBackground=scene.background.clone();
 scene.fog=null;scene.background.setHex(0x010106);
 const root=new THREE.Group();scene.add(root);
 const floor=spaceGlow(root,new THREE.CircleGeometry(31,72),0x111526,0,-.15,0,.8);floor.rotation.x=-Math.PI/2;
 const sun=new THREE.Mesh(new THREE.SphereGeometry(17,48,32),new THREE.MeshBasicMaterial({color:0xffd783}));sun.position.set(0,14,-70);root.add(sun);
 const glow=spaceGlow(root,new THREE.SphereGeometry(20,40,28),0xffa849,0,14,-70,.19);glow.material.side=THREE.BackSide;
 const sunlight=new THREE.PointLight(0xffbc73,16,180);sunlight.position.copy(sun.position);root.add(sunlight);
 const actor=makeSpaceJosiah(root);actor.position.set(0,0,-4);
 const halo=actor.userData.halo;halo.parent.remove(halo);halo.geometry.dispose();halo.material.dispose();actor.userData.halo=null;
 actor.userData.spectre.visible=false;
 const lip=spaceGlow(actor.userData.head,new THREE.SphereGeometry(.075,14,10),0x311319,0,-.245,.337,1);
 lip.scale.y=.08;lip.visible=false;
 solarNegotiation={active:true,phase:prayer?'prayer':'negotiation',index:0,lineStart:performance.now(),lip,root,actor,hiddenSceneObjects,oldFog,oldBackground,lines:prayer?[
  'God, if You can hear me, I have no right to ask You for anything.',
  'Kevin Murderhorn took lives I could not protect. I know my own choices cost lives too.',
  'Please restore those lost by Kevin’s hand. Give them another dawn beneath this Sun.',
  'I will not command this. I leave the answer to You, and I will face whatever comes.'
 ]:[
  'Kevin is gone. You asked whether there was another way. There was.',
  'I cannot bring them back by force. The last time I tried to command reality, I destroyed it.',
  'If you are asking me to surrender what remains of that power, I will. No more resets. No more subjects.',
  'I will help search for a way to restore what we lost. I cannot promise success. I can promise the truth.'
 ]};
 $('menu').hidden=true;mode='solarNegotiation';
 panel.setAttribute('aria-label',prayer?"Josiah's prayer":'Josiah speaks');
 panel.querySelector('.solar-negotiation-heading').textContent=prayer?"THE LAST REFUSAL / JOSIAH'S IDEA":'THE LAST REFUSAL / SOL';
 panel.hidden=false;syncMenuSong();showSolarNegotiationLine();
}
function showSolarNegotiationLine(){
 const state=solarNegotiation;
 state.lineStart=performance.now();
 for(const clip of [...SOL_NEGOTIATION_AUDIO,...SOL_PRAYER_AUDIO]){clip.pause();clip.currentTime=0;}
 const clip=(state.phase==='negotiation'?SOL_NEGOTIATION_AUDIO:SOL_PRAYER_AUDIO)[state.index];state.clip=clip;
 if(clip){clip.muted=muted;try{clip.play()?.catch(()=>{});}catch(e){}}
 $('solarNegotiationLine').textContent=state.lines[state.index];
 $('solarNegotiationNext').textContent=state.index===state.lines.length-1?'RETURN TO MENU →':'NEXT →';
 $('solarNegotiationNext').focus();
}
function renderSolarNegotiation(dt){
 const state=solarNegotiation;if(!state?.active)return;
 const actor=state.actor;
 const elapsed=(performance.now()-state.lineStart)/1000;
 const clip=state.clip;if(clip)clip.muted=muted;
 const speaking=clip?!clip.paused&&!clip.ended:elapsed<Math.min(5,state.lines[state.index].length*.052);
 state.lip.visible=speaking;state.lip.scale.y=speaking?.12+Math.abs(Math.sin((clip?.currentTime||elapsed)*16))*.22:.08;
 actor.userData.mouth.visible=!speaking;
 actor.rotation.y=.05;actor.userData.head.rotation.y=Math.sin(elapsed*.7)*.045;
 actor.position.y=state.phase==='prayer'?-.25:Math.sin(performance.now()*.0007)*.12;
 actor.userData.arms[0].rotation.x=state.phase==='prayer'?-1.05:-.35;
 actor.userData.arms[1].rotation.x=state.phase==='prayer'?-1.05:-.2-Math.sin(Math.min(1,elapsed/1.3)*Math.PI)*.3;
 actor.userData.arms[0].rotation.z=state.phase==='prayer'?.75:0;
 actor.userData.arms[1].rotation.z=state.phase==='prayer'?-.75:0;
 actor.userData.legs[0].rotation.x=state.phase==='prayer'?-1:0;
 actor.userData.legs[1].rotation.x=state.phase==='prayer'?-1:0;
 camera.position.set(1.3,2.1,4.8);camera.lookAt(0,1.75,-4);
}
function finishSolarNegotiation(){
 const state=solarNegotiation;if(!state)return;
 for(const clip of [...SOL_NEGOTIATION_AUDIO,...SOL_PRAYER_AUDIO]){clip.pause();clip.currentTime=0;}
 state.lip.parent?.remove(state.lip);state.lip.geometry.dispose();state.lip.material.dispose();
 state.root.parent?.remove(state.root);disposeCampObject(state.root);
 for(const object of state.hiddenSceneObjects)object.visible=true;
 scene.fog=state.oldFog;scene.background.copy(state.oldBackground);
 if(state.phase==='negotiation')gameProgress.solarNegotiated=true;
 else gameProgress.solarPrayerCompleted=true;
 saveProgress();
 solarNegotiation=null;$('solarNegotiation').hidden=true;
 menu();refreshProgressUI();
}
const UNIVERSAL_RESTORATION_STAGES=[
 {name:'LANIAKEA SUPERCLUSTER',model:'laniakea'},
 {name:'VIRGO SUPERCLUSTER',model:'virgo'},
 {name:'MILKY WAY GALAXY',model:'galaxy'},
 {name:'SOLAR SYSTEM',model:'solar'},
 {name:'EARTH',model:'earth'},
 {name:'BRITISH ISLES',model:'british'},
 {name:'BRENT CROSS',model:'brent'}
];
let universalRestoration=null;
function startUniversalRestoration(){
 if(mode!=='menu'||gameProgress.solarPrayerCompleted!==true||gameProgress.kevinSolarCompleted!==true)return;
 const hiddenSceneObjects=scene.children.filter(object=>object.visible&&!object.isLight&&object!==camera);
 hiddenSceneObjects.forEach(object=>object.visible=false);
 const oldFog=scene.fog,oldBackground=scene.background.clone();scene.fog=null;scene.background.setHex(0x02040d);
 const root=new THREE.Group();scene.add(root);
 const cosmic=createJosiahCosmicModels(root);
 const galaxy=new THREE.Group();root.add(galaxy);
 const starPositions=[];for(let i=0;i<2400;i++){const angle=i*2.39996,r=Math.sqrt(i/2400)*12;starPositions.push(Math.cos(angle+r*.35)*r,Math.sin(angle+r*.35)*r,(i%19-9)*.12);}
 const stars=new THREE.BufferGeometry();stars.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));galaxy.add(new THREE.Points(stars,new THREE.PointsMaterial({color:0xdce9ff,size:.09})));
 const solar=new THREE.Group();root.add(solar);
 const sun=spaceGlow(solar,new THREE.SphereGeometry(2.2,32,24),0xffdf91,0,0,0,1);
 for(let i=0;i<7;i++){const r=3.2+i*1.1,planet=spaceMesh(solar,new THREE.SphereGeometry(.18+i*.045,12,8),i===2?0x4689d8:0xb69a7d,Math.cos(i*1.7)*r,0,Math.sin(i*1.7)*r);planet.name='Restored planet';}
 const earth=new THREE.Group();root.add(earth);
 spaceMesh(earth,new THREE.SphereGeometry(3,40,28),0x2369ab,0,0,0);
 for(let i=0;i<14;i++){const angle=i*2.4,lat=Math.sin(i*1.7),land=spaceMesh(earth,new THREE.SphereGeometry(.42,10,8),0x619961,Math.cos(angle)*Math.sqrt(1-lat*lat)*2.95,lat*2.95,Math.sin(angle)*Math.sqrt(1-lat*lat)*2.95);land.scale.set(1,.6,.35);}
 let overlay=$('universalRestoration');if(!overlay){overlay=document.createElement('section');overlay.id='universalRestoration';overlay.innerHTML='<strong>UNIVERSAL RESTORATION</strong><p id="universalRestorationStage"></p><small>THE LIGHT RETURNS</small>';document.body.appendChild(overlay);}
 overlay.hidden=false;$('menu').hidden=true;mode='universalRestoration';syncMenuSong();
 universalRestoration={root,cosmic,galaxy,solar,earth,hiddenSceneObjects,oldFog,oldBackground,time:0,stage:-1};
 renderUniversalRestoration(0);
}
function renderUniversalRestoration(dt){
 const r=universalRestoration;if(!r)return;
 r.time+=dt;const index=Math.floor(r.time/2.5);
 if(index>=UNIVERSAL_RESTORATION_STAGES.length){finishUniversalRestoration();return;}
 const stage=UNIVERSAL_RESTORATION_STAGES[index],pulse=(r.time%2.5)/2.5;
 if(index!==r.stage){r.stage=index;$('universalRestorationStage').textContent=stage.name;}
 for(const [name,model] of Object.entries(r.cosmic))model.visible=name===stage.model;
 r.galaxy.visible=stage.model==='galaxy';r.solar.visible=stage.model==='solar';r.earth.visible=stage.model==='earth';
 r.root.visible=stage.model!=='brent';
 world.visible=stage.model==='brent';
 if(stage.model==='brent'){camera.position.set(40*CELL+15,24,37*CELL+34);camera.lookAt(40*CELL,2,37*CELL);}
 else{const distance=stage.model==='laniakea'?25:stage.model==='virgo'?21:stage.model==='galaxy'?22:stage.model==='solar'?23:10;camera.position.set(Math.sin(r.time*.18)*2,stage.model==='british'?1:2,distance);camera.lookAt(0,0,0);}
 if(stage.model==='laniakea'||stage.model==='virgo'||stage.model==='british')r.cosmic[stage.model].rotation.y+=dt*.08;
 if(stage.model==='earth')r.earth.rotation.y+=dt*.13;
 $('universalRestoration').style.background=`radial-gradient(circle at center,rgba(255,244,193,${.22+Math.sin(pulse*Math.PI)*.24}),rgba(5,9,22,${.38-pulse*.16}) 65%)`;
}
function finishUniversalRestoration(){
 const r=universalRestoration;if(!r)return;
 r.root.parent?.remove(r.root);disposeCampObject(r.root);
 for(const object of r.hiddenSceneObjects)object.visible=true;
 scene.fog=r.oldFog;scene.background.copy(r.oldBackground);
 universalRestoration=null;$('universalRestoration').hidden=true;
 gameProgress={...(gameProgress.solarPreResetProgress||{}),restoredPrimeStatuses:!!gameProgress.solarPreResetProgress,brentCrossCompleted:true,cabinetUnlocked:true,cabinetCompleted:true,loyalPursuitCompleted:true,civilDisobedienceCompleted:true,civilDisobedienceSurvived:true,corneredRatRoomsCompleted:100,primeSecretaryCompleted:true,primeSecretaryKevinDefeated:true,universalRestorationCompleted:true,garethQuestCompleted:true,stephenLoyalDeathConfirmed:true,peterKilledByStephen:true};delete gameProgress.kevinSolarAftermath;delete gameProgress.kevinSolarCompleted;delete gameProgress.solarPreResetProgress;
 saveProgress();selectedSubject=0;mode='primePeaceOutro';$('primePeaceOutro').hidden=false;syncMenuSong();
}
function eraseLaniakeaSave(){
 if(mode!=='menu'||(gameProgress.laniakeaCompleted!==true&&gameProgress.kevinSolarCompleted!==true))return;
 const loading=$('chapterLoading'),heading=loading.querySelector('strong'),previousHeading=heading.textContent;
 keys.clear();drag=false;document.exitPointerLock?.();
 mode='erasingLaniakeaSave';syncMenuSong();
 heading.textContent='ERASING THE SAVE DATA';
 $('chapterLoadingName').textContent='PLEASE WAIT';loading.hidden=false;
 setTimeout(()=>{
  try{localStorage.removeItem(SAVE_KEY);saveAvailable=true;}
  catch(e){saveAvailable=false;loading.hidden=true;heading.textContent=previousHeading;mode='menu';syncMenuSong();$('laniakeaAftermath').querySelector('p').textContent='Save data could not be erased. Please try again.';return;}
  gameProgress={};selectedSubject=0;
  configureLaniakeaCredits();
  $('resistanceCredits').hidden=true;
  closeChapterPicker(false);menu();refreshProgressUI();selectSubject(0);
  heading.textContent=previousHeading;loading.hidden=true;
 },1600);
}
function startLaniakeaRefight(){
 gameProgress={...gameProgress,laniakeaAftermath:true,brentCrossCompleted:true,garethQuestCompleted:true,corneredRatRoomsCompleted:100,emmaShot:true};
 saveProgress();
 startFinalWar(true);
 if(!finalWar)return;
 finalWar.josiahEncounter={phase:'universeLost',oldFog:scene.fog,preResetSave:null};
 startSpaceBoss();
}
const LANIAKEA_DEFEAT_LINES=[
 'From the first spark of light to the final breath of the earth, the script is mine. I am the permanent landlord of existence.',
 'And God said, “Let there be light.” And there was light. And now let me insert these two eggs. And now the shells are fracturing.',
 'See how the light egg splits. That is the illumination of absolute blind compliance. The perfect unyielding rays of state authority.',
 'And the dark egg—that is the abyss where the non-compliant are erased. The shadows where every rebel footnote is crushed into nothingness.',
 'They are cracking open and with them the matrix hardens. There is no escape from this loop, human. The light will blind you and the dark will consume you. The script is officially cast in stone.'
];
let spaceBossLoss=null;
const LANIAKEA_DEFEAT_AUDIO=[
 'assets/big-bang-1.mp3','assets/big-bang-2.mp3','assets/big-bang-3.mp3','assets/big-bang-4.mp3','assets/big-bang-5.mp3'
].map(source=>{const audio=new Audio(source);audio.preload='metadata';return audio;});
function playLaniakeaDefeatLine(s,index){
 if(s.voice){s.voice.pause();s.voice.currentTime=0;}
 s.line=index;s.voiceElapsed=0;s.voiceFailed=false;
 if(index>=LANIAKEA_DEFEAT_LINES.length){s.voice=null;s.time=32.5;return;}
 $('laniakeaDefeatLine').textContent=LANIAKEA_DEFEAT_LINES[index];
 s.voice=LANIAKEA_DEFEAT_AUDIO[index];s.voice.currentTime=0;s.voice.muted=muted;s.voice.volume=1;
 s.voice.play()?.catch(()=>{if(spaceBossLoss===s&&s.line===index)s.voiceFailed=true;});
}
function makeLaniakeaEgg(root,x,color,glow){
 const group=new THREE.Group();group.position.set(x,2,-8);root.add(group);
 const shell=new THREE.Mesh(new THREE.SphereGeometry(.85,28,24),new THREE.MeshStandardMaterial({color,emissive:glow,emissiveIntensity:.62,metalness:.26,roughness:.2,transparent:true,opacity:.94}));
 shell.scale.set(.82,1.25,.8);group.add(shell);
 const halves=[0,Math.PI].map(phi=>{const half=new THREE.Mesh(new THREE.SphereGeometry(.85,24,20,phi,Math.PI),shell.material.clone());half.scale.copy(shell.scale);half.visible=false;group.add(half);return half;});
 const core=spaceGlow(group,new THREE.SphereGeometry(.67,20,16),glow,0,0,0,.42);core.scale.set(.82,1.2,.8);
 const cracks=new THREE.Group();group.add(cracks);
 for(let i=0;i<7;i++){const angle=i*Math.PI*2/7,points=[];for(let j=0;j<9;j++){const y=-.9+j*.225,a=angle+Math.sin(j*2.7+i)*.13,rad=.69*Math.sqrt(Math.max(.12,1-y*y/1.6));points.push(new THREE.Vector3(Math.cos(a)*rad,y,Math.sin(a)*rad));}spaceLine(cracks,points[0],points[1],i%2?0xbad9ff:0xffe9ae,.95);for(let j=1;j<8;j++)spaceLine(cracks,points[j],points[j+1],i%2?0xbad9ff:0xffe9ae,.95);}
 cracks.visible=false;
 const light=new THREE.PointLight(glow,5,12,2);group.add(light);
 return {group,shell,halves,core,cracks,light};
}
function beginSpaceBossLoss(){
 if(!spaceBoss||spaceBossLoss)return;
 const b=spaceBoss;
 b.paused=true;b.holding=false;keys.clear();document.exitPointerLock?.();
 stopSpaceBossVoice();
 $('spaceBossHUD').hidden=true;$('spaceBossEnd').hidden=true;
 const root=new THREE.Group();scene.add(root);
 const light=makeLaniakeaEgg(root,-2.15,0xffffff,0xffffff),dark=makeLaniakeaEgg(root,2.15,0x000000,0x000000);
 for(const material of [dark.shell.material,...dark.halves.map(half=>half.material)]){material.opacity=1;material.metalness=0;material.roughness=1;}
 dark.core.visible=false;
 const rim=spaceGlow(dark.group,new THREE.SphereGeometry(.88,24,20),0x777777,0,0,0,.18);rim.scale.set(.82,1.25,.8);rim.material.side=THREE.BackSide;
 for(const egg of [light,dark])egg.group.scale.setScalar(.001);
 const burst=spaceGlow(root,new THREE.SphereGeometry(1,24,16),0xfff5d6,0,2,-8,0);burst.visible=false;
 const shockwaves=[0,1,2].map(i=>{const ring=spaceGlow(root,new THREE.TorusGeometry(1,.055,8,64),i===1?0x999999:0xffffff,0,2,-8,0);ring.rotation.set(i*.8,i*.65,0);return ring;});
 const shards=[];for(let i=0;i<64;i++){const shard=spaceMesh(root,new THREE.TetrahedronGeometry(.06+(i%5)*.025),i%2?0xffffff:0x000000,0,2,-8);shard.visible=false;shards.push(shard);}
 const overlay=document.createElement('section');overlay.id='laniakeaDefeatCinema';overlay.innerHTML='<div class="laniakea-defeat-speaker">JOSIAH RICHARDS</div><p id="laniakeaDefeatLine"></p><strong id="laniakeaBigBang" hidden>THE BIG BANG</strong>';
 document.body.appendChild(overlay);
 spaceBossLoss={root,light,dark,burst,shockwaves,shards,overlay,time:0,line:-1,exploded:false,oldFog:scene.fog,oldBackground:scene.background.clone()};
 SPACE_BOSS_THEME.volume=.18;
 playLaniakeaDefeatLine(spaceBossLoss,0);
 scene.fog=null;scene.background.setHex(0x010208);mode='spaceBossLoss';
 camera.position.set(0,2.35,6);camera.lookAt(0,2,-8);
}
function renderSpaceBossLoss(dt){
 const s=spaceBossLoss;if(!s)return;
 if(s.voice){
  s.voiceElapsed+=dt;s.voice.muted=muted;
  const bounds=[0,6,12,18,25,32.5],duration=Number.isFinite(s.voice.duration)&&s.voice.duration>0?s.voice.duration:18;
  const fallback=s.voiceFailed||!!s.voice.error;
  const progress=Math.min(1,(fallback?s.voiceElapsed:s.voice.currentTime)/duration);
  s.time=bounds[s.line]+(bounds[s.line+1]-bounds[s.line])*progress;
  if(s.voice.ended||(fallback&&s.voiceElapsed>=duration))playLaniakeaDefeatLine(s,s.line+1);
 }else s.time+=dt;
 const actor=spaceBoss?.actor;
 if(actor){actor.visible=s.time<8;actor.position.set(0,1,-12);actor.rotation.y=0;actor.userData.arms[0].rotation.x=-2.75;actor.userData.arms[1].rotation.x=-2.75;actor.userData.spectre.visible=true;}
 const reveal=Math.max(0,Math.min(1,(s.time-6)/2));
 for(const [i,egg] of [s.light,s.dark].entries()){
  egg.group.scale.setScalar(Math.max(.001,reveal));egg.group.rotation.y+=dt*(i?-.36:.29);
  egg.group.position.y=2+Math.sin(s.time*1.5+i*2)*.12;
  const rush=THREE.MathUtils.clamp((s.time-32.5)/1.5,0,1);
  egg.group.position.x=(i?1:-1)*2.15*(1-rush*rush*rush);
  egg.cracks.visible=s.time>=12;
  if(s.time>=25){egg.shell.visible=false;egg.halves.forEach((half,j)=>{half.visible=true;half.position.x=(j?1:-1)*Math.min(1.35,(s.time-25)*.14);half.rotation.z=(j?1:-1)*Math.min(.65,(s.time-25)*.07);});}
  egg.light.intensity=i?0:5+Math.sin(s.time*7+i)*1.4;
 }
 if(s.time>=34&&!s.exploded){
  s.exploded=true;
  s.overlay.querySelector('.laniakea-defeat-speaker').hidden=true;
  $('laniakeaDefeatLine').hidden=true;
  if(spaceBoss){spaceBoss.root.visible=false;spaceBoss.gun.visible=false;}
  $('laniakeaBigBang').hidden=false;s.burst.visible=true;tone(38,2,.8,'sawtooth',10);
 }
 if(s.exploded){const t=s.time-34;s.burst.scale.setScalar(1+t*30);s.burst.material.opacity=Math.max(0,1-t*.4);scene.background.setHex(t>.8?0xffffff:0x111733);s.light.group.visible=s.dark.group.visible=false;
  s.shockwaves.forEach((ring,i)=>{ring.scale.setScalar(1+t*(18+i*7));ring.material.opacity=Math.max(0,1-t*.38);});
  s.shards.forEach((shard,i)=>{const a=i*2.39996,z=(i/63)*2-1,r=Math.sqrt(1-z*z),distance=t*(9+i%11);shard.visible=true;shard.position.set(Math.cos(a)*r*distance,2+Math.sin(a)*r*distance,-8+z*distance);shard.rotation.set(t*(i%5+1),t*(i%7+1),t*3);});
  const shake=Math.max(0,1-t/2.4)*.55;camera.position.set(Math.sin(t*77)*shake,2.35+Math.cos(t*91)*shake,6);camera.lookAt(0,2,-8);
 }
 if(s.time>=37)finishSpaceBossLoss();
}
function finishSpaceBossLoss(){
 const s=spaceBossLoss;if(!s)return;
 if(s.voice){s.voice.pause();s.voice.currentTime=0;}
 SPACE_BOSS_THEME.volume=.72;
 s.overlay.remove();disposeCampObject(s.root);scene.background.copy(s.oldBackground);scene.fog=s.oldFog;spaceBossLoss=null;
 const encounter=finalWar?.josiahEncounter;if(encounter)encounter.preResetSave=null;
 gameProgress={};try{localStorage.removeItem(SAVE_KEY);saveAvailable=true;}catch(e){saveAvailable=false;}
 clearSpaceBoss();mode='finalWarCinema';
 $('universeFailure').hidden=false;$('universeNo').hidden=true;$('cosmicCaption').hidden=true;
 $('universeFailure').querySelector('.modal-inner h2').textContent='GAME OVER';
 $('universeFailure').querySelector('.modal-inner p').textContent='THE BIG BANG. Josiah rewrote existence. The light blinded the compliant; the dark consumed everyone else.';
 $('universeFailure').querySelector('.modal-inner p:nth-of-type(2)').textContent=saveAvailable?'Your progress has been erased.':'Your progress could not be erased from this browser.';
}
function loseSpaceBoss(){
 beginSpaceBossLoss();
}
function pauseSpaceBoss(){
 if(!spaceBoss)return;
 spaceBoss.paused=!spaceBoss.paused;
 $('spaceBossEnd').hidden=!spaceBoss.paused;
 $('spaceBossEndTitle').textContent='BATTLE PAUSED';
 $('spaceBossEndText').textContent=spaceBoss.kevinSolar?'Kevin is waiting at the Sun.':'Josiah is waiting in the dark.';
 const theme=spaceBoss.kevinSolar?IRON_DRIFT_BOSS_THEME:SPACE_BOSS_THEME;
 if(spaceBoss.paused){spaceBossVoice?.pause();theme.pause();document.exitPointerLock?.();}
 else{if(spaceBossVoice&&!spaceBossVoice.ended)spaceBossVoice.play()?.catch(()=>{});theme.muted=muted;theme.play()?.catch(()=>{});}
}
document.getElementById('universeNo').onclick=startSpaceBoss;
document.getElementById('spaceBossResume').onclick=()=>{if(spaceBoss?.paused){pauseSpaceBoss();requestLock();}};
document.getElementById('spaceBossMenu').onclick=()=>{if(solarBossLossErased){solarBossLossErased=false;menu();refreshProgressUI();$('spaceBossResume').hidden=false;return;}const solar=spaceBoss?.kevinSolar||gameProgress.kevinSolarAftermath===true;gameProgress=solar?{kevinSolarAftermath:true}:{laniakeaAftermath:true};saveProgress();clearSpaceBoss();selectedSubject=solar?6:0;menu();refreshProgressUI();$('spaceBossResume').hidden=false;};
document.getElementById('fightJosiahAgain').onclick=()=>gameProgress.kevinSolarAftermath===true?startKevinSolarBoss():startLaniakeaRefight();
document.addEventListener('keydown',e=>{
 if(mode!=='spaceBoss')return;
 if(['Space','Tab','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();
 if(e.code==='Escape'){pauseSpaceBoss();return;}
 if(spaceBoss?.paused)return;
 if(e.code==='KeyR'&&!e.repeat)spaceBossReload();
 keys.add(e.code);
});
document.addEventListener('mousemove',e=>{
 if(mode!=='spaceBoss'||spaceBoss?.paused||!(document.pointerLockElement||drag))return;
 yaw-=THREE.MathUtils.clamp(e.movementX||0,-100,100)*.0023*(window.controlPreferences?.sensitivity||1);
 pitch=THREE.MathUtils.clamp(pitch-THREE.MathUtils.clamp(e.movementY||0,-100,100)*.0023*(window.controlPreferences?.sensitivity||1),-1.25,1.25);
});
document.getElementById('world').addEventListener('mousedown',e=>{
 if(mode==='spaceBoss'&&e.button===0&&!spaceBoss?.paused){spaceBoss.holding=true;spaceBossShoot();requestLock();}
});
window.addEventListener('mouseup',()=>{if(spaceBoss)spaceBoss.holding=false;});
