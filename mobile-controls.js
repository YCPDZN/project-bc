// Touch is an additional input source; the desktop handlers remain authoritative.
(() => {
 const touchKeys=new Set(),physicalKeys=new Set(),pointers=new Map(),keyOwners=new Map();
 let enabled=navigator.maxTouchPoints>0&&matchMedia('(pointer: coarse)').matches;
 let stamp='',firing=false,stickId=null,lookId=null,lastLook=null,mapHeld=false,mouseOverlayPress=false,desktopHeld=false;
 let keyboardFiring=false,keyboardFireMode=null;
 function stopKeyboardFire(){keyboardFiring=false;keyboardFireMode=null;key('KeyF',false,'keyboard-shoot');}
 const root=document.createElement('section');root.id='mobileControls';root.hidden=true;root.setAttribute('aria-label','Touch game controls');
 root.innerHTML='<div id="mobileStick" role="group" aria-label="Movement joystick"><span id="mobileStickKnob"></span><small>MOVE</small></div><div id="mobileLook" aria-label="Swipe to look"></div><div id="mobileActions"></div><button id="mobilePause" type="button" aria-label="Pause game">Ⅱ</button><button id="mobileQTE" type="button">TAP!</button><small id="mobileHint">LEFT: MOVE · RIGHT: LOOK</small>';
 document.body.append(root);
 const actions=document.getElementById('mobileActions'),stick=document.getElementById('mobileStick'),knob=document.getElementById('mobileStickKnob'),look=document.getElementById('mobileLook'),qte=document.getElementById('mobileQTE');
 const definitions=[['flight','FLY','KeyF'],['ascend','RISE','KeyE'],['descend','DOWN','KeyQ'],['view','CAMERA','KeyV'],['fire','FIRE',null],['use','USE','KeyE'],['reload','RELOAD','KeyR'],['sprint','RUN','ShiftLeft'],['jump','JUMP','Space'],['torch','TORCH','KeyF'],['crouch','CROUCH','KeyC'],['dodge','DODGE','KeyQ'],['map','MAP','Tab'],['weapon1','PISTOL','Digit1'],['weapon2','SHOTGUN','Digit2']];
 const buttons={};
 for(const [id,label,code] of definitions){const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.action=id;b.dataset.code=code||'';b.setAttribute('aria-label',label);actions.append(b);buttons[id]=b;}
 function setEnabled(value){const changed=window.mobileTouchActive!==value;if(value&&!enabled&&document.pointerLockElement)document.exitPointerLock?.();enabled=value;window.mobileTouchActive=value;document.body.classList.toggle('touch-controls',value);if(changed&&typeof applyHDResolution==='function')applyHDResolution();}
 function key(code,down,owner='tap'){if(!code)return;const owners=keyOwners.get(code)||new Set();if(down){owners.add(owner);keyOwners.set(code,owners);if(touchKeys.has(code))return;touchKeys.add(code);document.dispatchEvent(new KeyboardEvent('keydown',{code,key:code==='Space'?' ':code,bubbles:true,cancelable:true}));}else{owners.delete(owner);if(owners.size)return;keyOwners.delete(code);if(!touchKeys.delete(code))return;if(!physicalKeys.has(code))document.dispatchEvent(new KeyboardEvent('keyup',{code,bubbles:true}));}}
 function pulse(code){key(code,true);key(code,false);}
 function reset(){keyOwners.clear();for(const code of [...touchKeys])key(code,false);pointers.clear();stickId=lookId=null;lastLook=null;firing=mapHeld=false;knob.style.transform='translate(-50%,-50%)';root.querySelectorAll('.pressed').forEach(b=>b.classList.remove('pressed'));}
 function state(){
  const q=mode==='beforeStoryKenji'&&!!beforeStoryScene?.fight?.qte&&!beforeStoryScene.fight.paused&&!beforeStoryScene.fight.ended||mode==='kevinChainStruggle'&&finalWar?.kevinStruggle?.phase==='qte'||mode==='finalWarCinema'&&finalWar?.josiahEncounter?.phase==='universeQTE';
  let active=['beforeStoryShibuya','beforeStoryFaceless','beforeStoryBozukiFight','beforeStoryPeterTube','beforeStoryHeath','beforeStoryUnionFight','beforeStoryOsaka','beforeStoryKenji','undeadPlay','play','boss','camp','rooms','finalWar','tube','tyrant4','spaceBoss','freeRoam','pindar','curtainBattle','uxbridgeChase','redRooms','chase','rescue','viewer'].includes(mode);
  if(mode==='redRooms'&&(redRooms?.paused||!['explore','fight'].includes(redRooms?.phase)))active=false;if(mode==='uxbridgeChase'&&(uxbridgeChase?.paused||uxbridgeChase?.ended||uxbridgeChase?.interception))active=false;if(mode==='pindar'&&(pindar?.paused||['cinema','ending','won','lost'].includes(pindar?.encounter?.phase)))active=false;if(mode==='curtainBattle'&&(finalCurtainBattle?.paused||finalCurtainBattle?.ended))active=false;
  if(mode==='beforeStoryShibuya'&&(beforeStoryScene?.shibuya?.paused||beforeStoryScene?.shibuya?.ended||beforeStoryScene?.shibuya?.phase!=='fight'))active=false;
  if(mode==='beforeStoryFaceless'&&(beforeStoryScene?.faceless?.paused||beforeStoryScene?.faceless?.ended||beforeStoryScene?.faceless?.phase!=='run'))active=false;
  if(mode==='beforeStoryBozukiFight'&&(beforeStoryScene?.bozuki?.paused||beforeStoryScene?.bozuki?.ended))active=false;
  if(mode==='beforeStoryHeath'&&(beforeStoryScene?.heath?.paused||beforeStoryScene?.heath?.ended))active=false;
  if(mode==='beforeStoryUnionFight'&&(beforeStoryScene?.unionCrown?.paused||beforeStoryScene?.unionCrown?.ended))active=false;if(mode==='beforeStoryOsaka'&&beforeStoryScene?.osaka?.paused)active=false;if(mode==='undeadPlay'&&(undeadGame?.paused||undeadGame?.ended))active=false;if(mode==='beforeStoryKenji'&&(beforeStoryScene?.fight?.paused||beforeStoryScene?.fight?.ended||beforeStoryScene?.fight?.qte))active=false;
  if(mode==='beforeStoryPeterTube'&&(beforeStoryScene?.peterUxbridge?.paused||beforeStoryScene?.peterUxbridge?.phase==='conversation'))active=false;
  if(mode==='boss'&& !bossBattle)active=false;
  if(mode==='camp'&&(parliamentCamp?.battle?.paused||parliamentCamp?.battle?.ended||parliamentCamp?.battle?.reveal))active=false;
  if(mode==='rooms'&&(corneredRooms?.arrival||corneredRooms?.paused||corneredRooms?.questChoice||['dialogue','ending','breakdown'].includes(corneredRooms?.finale?.phase)))active=false;
  if(mode==='finalWar'&&(finalWar?.paused||finalWar?.ended||['intro','death'].includes(finalWar?.josiahEncounter?.phase)||finalWar?.mariahChoice==='pending'))active=false;
  if(mode==='tube'&&(tubeMission?.paused||tubeMission?.ended||tubeMission?.dream||tubeMission?.camdenChoice||tubeMission?.camdenReveal!==undefined||tubeMission?.camdenTalk!==undefined))active=false;
  if(mode==='tyrant4'&&(corneredRooms?.arrival||tyrantFour?.paused||tyrantFour?.cinema))active=false;
  if(mode==='spaceBoss'&&(spaceBoss?.paused||spaceBoss?.cinematic))active=false;
  if(mode==='chase'&&(!carChase||!document.getElementById('chasePause')?.hidden||!document.getElementById('chaseResult')?.hidden))active=false;
  if(mode==='beforeStoryPeterTube'&&!document.getElementById('peterUxbridgeRoute')?.hidden)active=false;
  return {q,active};
 }
 function shoot(){
  if(mode==='beforeStoryShibuya'){attackKevinShibuyaChains();return;}
  if(mode==='beforeStoryBozukiFight'){attackKevinBlackChains();return;}
  if(mode==='beforeStoryHeath'){shootBeforeStoryHeath();return;}if(mode==='beforeStoryUnionFight'){attackUnionCrownChains();return;}if(mode==='beforeStoryOsaka'){shootBeforeStoryOsaka();return;}if(mode==='beforeStoryKenji'){shootBeforeStoryKenji();return;}if(mode==='undeadPlay'){shootUndead();return;}
  if(mode==='redRooms'&&redRooms?.phase==='fight')shootUxbridgeMariah();else if(mode==='uxbridgeChase')attackUxbridgeChains();else if(mode==='boss')fireBossWeapon();
  else if(mode==='camp')fireCampWeapon();
  else if(mode==='rooms'&&corneredRooms?.finale?.phase==='fight')firePeterFinale();
  else if(mode==='finalWar')fireFinalWarWeapon();
  else if(mode==='tube')shootTube();
  else if(mode==='tyrant4')shootTyrant();
  else if(mode==='spaceBoss')spaceBossShoot();
  else if(mode==='pindar')shootPindar();else if(mode==='curtainBattle')shootCurtainBattle();
 }
 function config(){
  const a=[];if(mode==='beforeStoryShibuya')return beforeStoryScene?.shibuya?.cosmic?['sprint','fire','dodge','view','use','ascend','descend']:['sprint','fire','dodge','view','use'];if(mode==='beforeStoryFaceless')return ['sprint','dodge','view'];if(mode==='beforeStoryBozukiFight')return ['sprint','fire','dodge','view','use'];if(mode==='beforeStoryPeterTube')return ['sprint','use','torch','map'];if(mode==='beforeStoryHeath')return ['sprint','fire','reload','dodge','view','use'];if(mode==='beforeStoryUnionFight')return beforeStoryScene?.unionCrown?.successor?['sprint','fire','dodge','view','use','ascend','descend']:['sprint','fire','dodge','view','use'];if(mode==='beforeStoryOsaka')return ['sprint','fire','reload','view','use'];if(mode==='beforeStoryKenji')return ['sprint','fire','reload','dodge','view','use'];if(mode==='undeadPlay')return ['sprint','fire','reload','use'];
  if(mode==='redRooms')return redRooms?.phase==='fight'?['sprint','fire','reload','weapon1','weapon2']:['sprint','use'];if(mode==='uxbridgeChase')return uxbridgeChase?.flying?['sprint','fire','view','flight','ascend','descend']:['sprint','fire','view','flight'];if(mode==='viewer')return a;if(mode==='curtainBattle')return ['sprint','fire','reload','weapon1','weapon2','map'];
  if(mode==='rescue')return ['use'];
  if(mode==='chase')return ['fire','jump'];
  a.push('sprint');
  if(['play','rooms','finalWar','tube','tyrant4','freeRoam','pindar'].includes(mode))a.push('use');
  if(['boss','camp','finalWar','tube','tyrant4','spaceBoss'].includes(mode)||mode==='rooms'&&corneredRooms?.finale?.phase==='fight'||mode==='pindar'&&pindar?.encounter?.phase==='fight')a.push('fire');
  if(['camp','finalWar','tube','tyrant4','spaceBoss'].includes(mode))a.push('reload');
  if(mode==='play')a.push('torch','crouch','dodge','map');
  if(mode==='rooms'&&!corneredRooms?.finale)a.push('torch');
  if(mode==='tube')a.push('torch');
  if(mode==='finalWar'&&finalWar?.kevinArena)a.push('jump');
  if(mode==='boss'||mode==='camp')a.push('weapon1','weapon2');
  if(mode==='boss')a.push('crouch');
  return a;
 }
 window.ProjectBCControls={
  snapshot:()=>({...state(),mode,actions:config()}),
  key:(code,down,owner)=>key(code,down,owner),
  action:(id,down,owner='accessible-action')=>{
   const s=state();if(down&&(!s.active||s.q||!config().includes(id)))return;
   const code=buttons[id]?.dataset.code;if(code)key(code,down,owner);
  },
  map:()=>{if(!state().active||!config().includes('map'))return;if(mode==='play'){mapHeld=!mapHeld;key('Tab',mapHeld,'map');buttons.map.classList.toggle('pressed',mapHeld);}else pulse('Tab');},
  pause:()=>pulse('Escape'),
  release:()=>{stopKeyboardFire();releaseDesktop();reset();physicalKeys.clear();keys.clear();},
  look:(dx,dy)=>{if(!state().active||state().q)return;if(mode==='viewer'){viewerAngle+=dx;return;}if(mode==='chase'||mode==='rescue')return;yaw-=dx;pitch=THREE.MathUtils.clamp(pitch-dy,-1.1,1.1);}
 };
 window.updateMobileControls=function(){
  const s=state(),visible=enabled&&(s.active||s.q),wanted=config(),next=[mode,visible,s.q,wanted.join(',')].join('|');
  if(keyboardFiring&&(!s.active||s.q||mode!==keyboardFireMode||!wanted.includes('fire')))stopKeyboardFire();
  document.body.dataset.touchMode=mode;root.classList.toggle('driving',mode==='chase');root.classList.toggle('rescuing',mode==='rescue');root.classList.toggle('map-open',mapHeld);document.getElementById('mobilePause').setAttribute('aria-label',mode==='freeRoam'?'Return to main menu':'Pause game');document.getElementById('mobilePause').textContent=mode==='freeRoam'?'EXIT':'Ⅱ';
  if(next!==stamp){reset();stamp=next;buttons.ascend.dataset.code=((mode==='beforeStoryUnionFight'&&beforeStoryScene?.unionCrown?.successor)||(mode==='beforeStoryShibuya'&&beforeStoryScene?.shibuya?.cosmic))?'KeyR':'KeyE';buttons.descend.dataset.code=((mode==='beforeStoryUnionFight'&&beforeStoryScene?.unionCrown?.successor)||(mode==='beforeStoryShibuya'&&beforeStoryScene?.shibuya?.cosmic))?'KeyF':'KeyQ';root.hidden=!visible;root.classList.toggle('qte',!!s.q);root.classList.toggle('viewing',mode==='viewer');for(const [id,b] of Object.entries(buttons))b.hidden=!wanted.includes(id);qte.hidden=!s.q;buttons.flight.textContent=mode==='uxbridgeChase'&&uxbridgeChase?.flying?'LAND':'FLY';buttons.fire.textContent=(mode==='beforeStoryShibuya'||mode==='beforeStoryBozukiFight'||mode==='uxbridgeChase'||mode==='beforeStoryUnionFight')?'CHAINS':'FIRE';buttons.jump.textContent=mode==='chase'?'BRAKE':'JUMP';buttons.torch.textContent=mode==='beforeStoryPeterTube'?'WAIT':mode==='tube'?'SLEEP':'TORCH';buttons.use.textContent=mode==='beforeStoryPeterTube'?'USE / SIT':mode==='beforeStoryOsaka'?'OPEN':(mode==='beforeStoryShibuya'||mode==='beforeStoryBozukiFight'||mode==='beforeStoryHeath'||mode==='beforeStoryKenji'||mode==='beforeStoryUnionFight')?'HEAL':mode==='tube'||mode==='freeRoam'?'USE / SIT':mode==='rescue'?'HELP':'USE';document.getElementById('mobileHint').textContent=mode==='chase'?'STICK: ACCELERATE / STEER · BRAKE TO SLOW':mode==='viewer'?'SWIPE TO ROTATE MODEL':'LEFT: MOVE · RIGHT: LOOK';}
  if(visible&&s.active&&firing)shoot();
  if(keyboardFiring){if(mode==='chase')key('KeyF',true,'keyboard-shoot');else shoot();}
 };
 function capture(e,element){e.preventDefault();e.stopPropagation();element.setPointerCapture?.(e.pointerId);}
 stick.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'||stickId!==null)return;setEnabled(true);capture(e,stick);stickId=e.pointerId;moveStick(e);});
 function moveStick(e){if(e.pointerId!==stickId)return;const b=stick.getBoundingClientRect(),radius=b.width*.35;let x=e.clientX-b.left-b.width/2,y=e.clientY-b.top-b.height/2;const length=Math.hypot(x,y);if(length>radius){x=x/length*radius;y=y/length*radius;}knob.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`;key('KeyA',x< -radius*.23,'stick');key('KeyD',x>radius*.23,'stick');key('KeyW',y< -radius*.23,'stick');key('KeyS',y>radius*.23,'stick');}
 stick.addEventListener('pointermove',moveStick);
 function releaseStick(e){if(e.pointerId!==stickId)return;stickId=null;for(const code of ['KeyW','KeyA','KeyS','KeyD'])key(code,false,'stick');knob.style.transform='translate(-50%,-50%)';}
 for(const event of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(event,releaseStick);
 look.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'||lookId!==null)return;capture(e,look);lookId=e.pointerId;lastLook=[e.clientX,e.clientY];});
 look.addEventListener('pointermove',e=>{if(e.pointerId!==lookId||!lastLook)return;e.preventDefault();const dx=e.clientX-lastLook[0],dy=e.clientY-lastLook[1];lastLook=[e.clientX,e.clientY];if(mode==='viewer'){viewerAngle+=dx*.009*(window.controlPreferences?.sensitivity||1);return;}if(mode==='chase')return;yaw-=THREE.MathUtils.clamp(dx,-80,80)*.004*(window.controlPreferences?.sensitivity||1);pitch=THREE.MathUtils.clamp(pitch-THREE.MathUtils.clamp(dy,-80,80)*.004*(window.controlPreferences?.sensitivity||1),-1.2,1.2);});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])look.addEventListener(event,e=>{if(e.pointerId===lookId){lookId=null;lastLook=null;}});
 actions.addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(!b||e.pointerType!=='touch')return;capture(e,b);const action=b.dataset.action;if(window.controlPreferences?.tapHolds&&['sprint','crouch'].includes(action)){const on=!b.classList.contains('pressed');b.classList.toggle('pressed',on);key(b.dataset.code,on,'touch-toggle-'+action);return;}if(action==='map'){if(mode==='play'){mapHeld=!mapHeld;key('Tab',mapHeld,'map');b.classList.toggle('pressed',mapHeld);}else pulse('Tab');return;}const code=action==='fire'?(mode==='chase'?'KeyF':null):b.dataset.code;pointers.set(e.pointerId,{b,code,action});b.classList.add('pressed');if(action==='fire'){firing=true;shoot();}key(code,true,e.pointerId);});
 function releaseAction(e){const p=pointers.get(e.pointerId);if(!p)return;pointers.delete(e.pointerId);if(![...pointers.values()].some(x=>x.b===p.b))p.b.classList.remove('pressed');key(p.code,false,e.pointerId);firing=[...pointers.values()].some(x=>x.action==='fire');}
 for(const event of ['pointerup','pointercancel','lostpointercapture'])actions.addEventListener(event,releaseAction);
 qte.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')return;capture(e,qte);pulse('Space');});
 document.getElementById('mobilePause').onclick=()=>{reset();pulse('Escape');};
 // These automatically voiced scenes also accept Enter to skip a line on Windows.
 for(const id of ['pindarCinema','pindarEnding']){const panel=document.getElementById(id),box=panel?.querySelector('.pindar-dialogue-box');const button=document.createElement('button');button.type='button';button.className='mobile-dialogue-next';button.textContent='NEXT LINE';button.onclick=e=>{e.stopPropagation();pulse('Enter');};box?.append(button);box?.addEventListener('click',e=>{if(enabled)e.stopPropagation();});}
 // A touchscreen laptop can switch back to its existing keyboard/mouse controls.
 function releaseDesktop(){
  if(!desktopHeld)return;desktopHeld=false;drag=false;
  if(bossBattle)bossBattle.holdingFire=false;
  if(parliamentCamp?.battle)parliamentCamp.battle.holding=false;
  for(const b of [finalWar,tyrantFour,spaceBoss,finalCurtainBattle,uxbridgeChase,undeadGame,corneredRooms?.finale,redRooms?.mariahFight,beforeStoryScene?.fight,beforeStoryScene?.osaka,beforeStoryScene?.unionCrown,beforeStoryScene?.heath,beforeStoryScene?.bozuki,beforeStoryScene?.shibuya])if(b)b.holding=false;
 }
 document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){mouseOverlayPress=false;releaseDesktop();setEnabled(true);}else if(e.pointerType==='mouse'&&e.isTrusted&&pointers.size===0&&stickId===null){mouseOverlayPress=root.contains(e.target)&&!e.target.closest('button');reset();setEnabled(false);updateMobileControls();}},true);
 // A mouse press can retain its original touch-overlay target after that layer
 // is hidden. Forward only that gameplay press to the original canvas handlers.
 document.addEventListener('mousedown',e=>{
  const overlay=mouseOverlayPress||root.contains(e.target)&&!e.target.closest('button');mouseOverlayPress=false;
  if(e.button!==0||e.sourceCapabilities?.firesTouchEvents||e.target.closest?.('button,input,select,textarea,a'))return;
  const canvas=document.getElementById('world'),lockedBody=document.pointerLockElement===canvas&&(e.target===document||e.target===document.body);
  if(e.target!==canvas&&!overlay&&!lockedBody)return;
  reset();setEnabled(false);updateMobileControls();desktopHeld=true;
  if(e.target!==canvas&&state().active){e.preventDefault();e.stopImmediatePropagation();canvas.dispatchEvent(new MouseEvent('mousedown',{button:0,buttons:1,bubbles:true,cancelable:true,clientX:e.clientX,clientY:e.clientY}));}
 },true);
 window.addEventListener('mouseup',e=>{if(e.button===0)releaseDesktop();},true);
 window.addEventListener('pointercancel',e=>{if(e.pointerType==='mouse')releaseDesktop();},true);
 document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement){mouseOverlayPress=false;releaseDesktop();}});
 document.addEventListener('keydown',e=>{if(e.code==='Escape'){mouseOverlayPress=false;releaseDesktop();}},true);
 document.addEventListener('keydown',e=>{
  if(e.code==='Escape'){stopKeyboardFire();return;}
  if(e.code!=='KeyZ'||e.ctrlKey||e.altKey||e.metaKey||e.target.closest?.('input,textarea,select,[contenteditable="true"]'))return;
  const s=state();if(!s.active||s.q||!config().includes('fire'))return;
  e.preventDefault();if(e.repeat||keyboardFiring)return;
  reset();setEnabled(false);updateMobileControls();keyboardFiring=true;keyboardFireMode=mode;
  if(mode==='chase')key('KeyF',true,'keyboard-shoot');else shoot();
 },true);
 document.addEventListener('keyup',e=>{if(e.code==='KeyZ'){stopKeyboardFire();e.preventDefault();}},true);
 document.addEventListener('keydown',e=>{if(e.isTrusted)physicalKeys.add(e.code);},true);
 document.addEventListener('keyup',e=>{if(e.isTrusted){physicalKeys.delete(e.code);if(touchKeys.has(e.code))queueMicrotask(()=>keys.add(e.code));}},true);
 window.addEventListener('blur',()=>{stopKeyboardFire();mouseOverlayPress=false;releaseDesktop();reset();physicalKeys.clear();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stopKeyboardFire();mouseOverlayPress=false;releaseDesktop();reset();}});
 window.addEventListener('resize',reset);
 setEnabled(enabled);
})();

