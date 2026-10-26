/* Shared alternative controls. Existing chapter bindings remain available. */
(() => {
 const storage='project-bc-controls-v1';let saved={};try{saved=JSON.parse(localStorage.getItem(storage))||{};}catch(e){}
 const prefs=window.controlPreferences={sensitivity:Math.max(.3,Math.min(2,Number(saved.sensitivity)||1)),largeTouch:saved.largeTouch!==false,tapHolds:saved.tapHolds===true};
 const panel=document.createElement('section');panel.id='controlsGuide';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','controlsGuideTitle');
 panel.innerHTML='<div class="controls-card"><header><div><small>PROJECT BC / CONTROLS</small><h2 id="controlsGuideTitle">Play your way</h2></div><button id="controlsGuideClose" type="button">BACK · H / ESC</button></header><p>Left-click and Z still attack. These alternatives work alongside the original controls.</p><div id="controlsGuideActions"></div><details><summary>All keyboard shortcuts</summary><dl><dt>Move</dt><dd>WASD or arrow keys</dd><dt>Aim / look</dt><dd>Mouse, or I / J / K / L (up / left / down / right)</dd><dt>Attack</dt><dd>Left-click or Z; hold for repeated attacks</dd><dt>Interact / heal</dt><dd>E or Enter, when available</dd><dt>Reload</dt><dd>R or X</dd><dt>Run</dt><dd>Either Shift key; T toggles running</dd><dt>Crouch</dt><dd>Hold C; U toggles crouching</dd><dt>Dodge / jump</dt><dd>Q to dodge; Space also dodges if there is no jump action</dd><dt>Map</dt><dd>M toggles the map; original Tab controls still work</dd><dt>Camera</dt><dd>V or B</dd><dt>Flight</dt><dd>F or G; Page Up / Page Down rise / descend</dd><dt>Torch / sleep / wait</dt><dd>F, depending on the chapter</dd><dt>Weapons</dt><dd>1 / 2 where available</dd><dt>Driving</dt><dd>W / Up accelerate; A / D or Left / Right steer; S / Down or Space brake; Z / F shoot</dd><dt>Dialogue</dt><dd>Enter / Space where shown, or Tab to a button and press Enter; choices remain yours</dd><dt>Pause / guide</dt><dd>Escape or P pauses; H or F1 opens this guide</dd></dl></details><fieldset><legend>Comfort settings</legend><label for="controlsSensitivity">Look sensitivity <output id="controlsSensitivityValue"></output></label><input id="controlsSensitivity" type="range" min="30" max="200" step="5"><label class="controls-check"><input id="controlsLargeTouch" type="checkbox"> Larger touch buttons</label><label class="controls-check"><input id="controlsTapHolds" type="checkbox"> Tap RUN / CROUCH to toggle on touchscreens</label><p>Settings are saved on this device. Toggles and held keys clear when you pause, change chapter, open this guide or switch apps.</p></fieldset></div>';
 document.body.append(panel);
 const help=document.createElement('button');help.id='controlsHelpButton';help.type='button';help.textContent='CONTROLS · H';help.setAttribute('aria-haspopup','dialog');help.setAttribute('aria-controls','controlsGuide');help.setAttribute('aria-keyshortcuts','H F1');document.body.append(help);
 const $c=id=>document.getElementById(id),api=()=>window.ProjectBCControls;
 const labels={sprint:'RUN — Shift / T toggle',fire:'ATTACK — left-click / hold Z',use:'USE / HEAL — E / Enter',reload:'RELOAD — R / X',view:'CAMERA — V / B',flight:'FLY / LAND — F / G',ascend:'RISE — Page Up',descend:'DESCEND — Page Down',jump:'JUMP / BRAKE — Space',torch:'TORCH / SLEEP / WAIT — F',crouch:'CROUCH — C / U toggle',dodge:'DODGE — Q / Space',map:'MAP — M toggle / Tab',weapon1:'PISTOL — 1',weapon2:'SHOTGUN — 2'};
 let returnFocus=null,guideMode=null,guideClips=[],guideHadLock=false,lastMode=null,toggleRun=false,toggleCrouch=false;
 const held=new Map(),lookKeys=new Set();
 function editing(e){return e.target.closest?.('input,textarea,select,[contenteditable="true"]');}
 function clear(){for(const [code,target]of held)api()?.key(target,false,'accessible-'+code);held.clear();lookKeys.clear();api()?.action('sprint',false,'toggle-run');api()?.action('crouch',false,'toggle-crouch');toggleRun=toggleCrouch=false;help.textContent='CONTROLS · H';}
 function updateSettings(){document.body.classList.toggle('accessible-large-touch',prefs.largeTouch);$c('controlsSensitivityValue').textContent=prefs.sensitivity.toFixed(2)+'×';try{localStorage.setItem(storage,JSON.stringify(prefs));}catch(e){}}
 $c('controlsSensitivity').value=prefs.sensitivity*100;$c('controlsLargeTouch').checked=prefs.largeTouch;$c('controlsTapHolds').checked=prefs.tapHolds;updateSettings();
 $c('controlsSensitivity').oninput=e=>{prefs.sensitivity=Number(e.target.value)/100;updateSettings();};
 $c('controlsLargeTouch').onchange=e=>{prefs.largeTouch=e.target.checked;updateSettings();};
 $c('controlsTapHolds').onchange=e=>{prefs.tapHolds=e.target.checked;api()?.release();updateSettings();};
 function open(){
  if(window.accessibilityGuideOpen||!api())return;
  const s=api().snapshot();returnFocus=document.activeElement;guideMode=s.mode;guideHadLock=!!document.pointerLockElement;
  clear();api().release();window.accessibilityGuideOpen=true;
  guideClips=typeof AudioOptions!=='undefined'?AudioOptions.suspend():[];panel.hidden=false;help.hidden=true;
  const actions=$c('controlsGuideActions');actions.replaceChildren();
  const title=document.createElement('h3');title.textContent=s.active?'Available here':'Menus and cinematics';actions.append(title);
  const list=document.createElement('ul');
  const currentLabel=a=>a==='torch'?(s.mode==='tube'?'SLEEP — F':s.mode==='beforeStoryPeterTube'?'WAIT — F':'TORCH — F'):a==='jump'&&s.mode==='chase'?'BRAKE — Space':a==='use'?(['beforeStoryKenji','beforeStoryOsaka','beforeStoryHeath','beforeStoryUnionFight','beforeStoryBozukiFight','beforeStoryShibuya'].includes(s.mode)?'HEAL — E / Enter':'INTERACT — E / Enter'):a==='dodge'&&s.actions.includes('jump')?'DODGE — Q':labels[a];
  for(const text of s.q?['QTE — press Space or tap TAP! once per prompt']:s.active?s.actions.map(currentLabel).filter(Boolean):['Tab / Shift + Tab — select a button','Enter / Space — activate the selected button','Enter — advance dialogue where supported; use the displayed buttons for choices']){const row=document.createElement('li');row.textContent=text;list.append(row);}actions.append(list);
  document.exitPointerLock?.();$c('controlsGuideClose').focus();
 }
 function close(){
  if(!window.accessibilityGuideOpen)return;
  panel.hidden=true;help.hidden=false;window.accessibilityGuideOpen=false;
  // Tube time is measured against the real clock, so exclude time spent reading.
  if(typeof tubeMission!=='undefined'&&tubeMission)tubeMission.last=performance.now();
  if(api()?.snapshot().mode===guideMode){for(const clip of guideClips)if(!clip.ended)clip.play()?.catch(()=>{});if(guideHadLock)requestLock();}
  guideClips=[];if(returnFocus?.isConnected&&returnFocus.getClientRects().length)returnFocus.focus();else help.focus();
 }
 help.onclick=open;$c('controlsGuideClose').onclick=close;
 // Capture above chapter listeners so menus retain native Tab/Enter navigation.
 window.addEventListener('pointerlockchange',e=>{if(window.accessibilityGuideOpen)e.stopImmediatePropagation();},true);
 window.addEventListener('keydown',e=>{
  if(window.accessibilityGuideOpen){
   e.stopPropagation();if(['Escape','KeyH','KeyP','F1'].includes(e.code)&&!editing(e)){e.preventDefault();if(!e.repeat)close();return;}
   if(e.code==='Escape'){e.preventDefault();close();return;}
   if(e.code==='Tab'){const buttons=[...panel.querySelectorAll('button,input,summary')].filter(n=>!n.disabled&&n.getClientRects().length),first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}return;
  }
  if(editing(e)){e.stopPropagation();return;}
  if(e.ctrlKey||e.altKey||e.metaKey)return;
  if(['KeyH','F1'].includes(e.code)){e.preventDefault();e.stopPropagation();if(!e.repeat)open();return;}
  const s=api()?.snapshot();if(!s)return;
  if(e.code==='Tab'&&(!s.active||s.q)){e.stopPropagation();return;}
  if(e.target.closest?.('button,summary')&&e.target.getClientRects().length&&['Enter','Space'].includes(e.code)){e.stopPropagation();return;}
  if(e.code==='Escape'){clear();return;}
  if(e.code==='KeyP'&&(!s.active||s.q||['freeRoam','viewer','rescue'].includes(s.mode))){const resume=[...document.querySelectorAll('button[id*="Resume"],#resume')].find(b=>!b.disabled&&b.getClientRects().length&&!b.closest('[hidden]'));e.preventDefault();e.stopPropagation();if(!e.repeat){if(resume)resume.click();else if(!['menu','beforeStoryMenu','undeadMenu'].includes(s.mode))open();}return;}
  if(!s.active||s.q)return;
  if(e.code==='KeyP'){e.preventDefault();e.stopPropagation();if(!e.repeat){clear();api().pause();}return;}
  const move={ArrowUp:'KeyW',ArrowDown:'KeyS',ArrowLeft:'KeyA',ArrowRight:'KeyD',ShiftRight:'ShiftLeft'};
  if(move[e.code]&&s.mode!=='viewer'&&s.mode!=='rescue'){
   e.preventDefault();e.stopPropagation();if(!held.has(e.code)){held.set(e.code,move[e.code]);api().key(move[e.code],true,'accessible-'+e.code);}return;
  }
  if(['KeyI','KeyJ','KeyK','KeyL'].includes(e.code)){e.preventDefault();e.stopPropagation();lookKeys.add(e.code);return;}
  const action={Enter:'use',KeyX:'reload',KeyB:'view',KeyG:'flight',PageUp:'ascend',PageDown:'descend',Space:s.actions.includes('jump')?null:'dodge'}[e.code];
  if(action&&s.actions.includes(action)){e.preventDefault();e.stopPropagation();if(e.repeat)return;if(['ascend','descend'].includes(action)){const target=$c('mobileActions').querySelector('[data-action="'+action+'"]').dataset.code;held.set(e.code,target);api().key(target,true,'accessible-'+e.code);}else{api().action(action,true);api().action(action,false);}return;}
  if(e.code==='KeyM'&&s.actions.includes('map')){e.preventDefault();e.stopPropagation();if(!e.repeat)api().map();return;}
  if(e.code==='KeyT'&&s.actions.includes('sprint')){e.preventDefault();e.stopPropagation();if(!e.repeat){toggleRun=!toggleRun;api().action('sprint',toggleRun,'toggle-run');}return;}
  if(e.code==='KeyU'&&s.actions.includes('crouch')){e.preventDefault();e.stopPropagation();if(!e.repeat){toggleCrouch=!toggleCrouch;api().action('crouch',toggleCrouch,'toggle-crouch');}return;}
 },true);
 window.addEventListener('keyup',e=>{if(held.has(e.code)){api()?.key(held.get(e.code),false,'accessible-'+e.code);held.delete(e.code);e.stopPropagation();}if(lookKeys.delete(e.code))e.stopPropagation();},true);
 window.addEventListener('blur',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
 window.updateAccessibleControls=function(dt){
  const s=api()?.snapshot();if(!s)return;const token=s.mode+'|'+s.active+'|'+s.q;
  if(lastMode!==token){clear();lastMode=token;}
  if(!s.active||s.q)return;
  if(toggleRun&&s.actions.includes('sprint'))api().action('sprint',true,'toggle-run');
  if(toggleCrouch&&s.actions.includes('crouch'))api().action('crouch',true,'toggle-crouch');
  const hint='CONTROLS · H'+(toggleRun?' · RUN ON':'')+(toggleCrouch?' · CROUCH ON':'');if(help.textContent!==hint)help.textContent=hint;
  const x=Number(lookKeys.has('KeyL'))-Number(lookKeys.has('KeyJ')),y=Number(lookKeys.has('KeyK'))-Number(lookKeys.has('KeyI'));
  if(x||y)api().look(x*dt*1.6*prefs.sensitivity,y*dt*1.6*prefs.sensitivity);
 };
})();
