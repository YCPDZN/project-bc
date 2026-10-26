/* Room 100 belongs to the player, after Kevin's pursuit of Gareth. */
const UXBRIDGE_MARIAH_LINES=[
 'So you found me. A hundred locked rooms, and you still followed Kevin’s instructions all the way here.',
 'Josiah killed Alissa. Gareth has been hunted through the streets. And Kevin keeps finding someone else to do his dirty work.',
 'I will not hand the Resistance to another man who thinks this country belongs to him. Tell your masked friend that.',
 'If you came to silence me, you will have to face me yourself. No chains. No borrowed gods. Just you and me.'
];
const uxbridgeMariahUI=document.createElement('div');uxbridgeMariahUI.id='uxbridgeMariahUI';
uxbridgeMariahUI.innerHTML=`<div id="redRoomMariahCinema" hidden><div class="cinema-top"><span>THE FOOL OF UXBRIDGE / ROOM 100</span><div><button id="redRoomMariahNext">NEXT LINE · ENTER</button><button id="redRoomMariahSkip">SKIP CUTSCENE</button></div></div><div class="cinema-dialogue"><strong id="redRoomMariahSpeaker">MARIAH BANU</strong><p id="redRoomMariahLine" aria-live="polite"></p></div></div><div id="redRoomFightHUD" hidden><div class="red-room-fight-bars"><div class="boss-health player"><label>PLAYER <span id="redRoomPlayerValue"></span></label><div><i id="redRoomPlayerHealth"></i></div></div><div class="boss-health"><label>MARIAH BANU <span id="redRoomMariahValue"></span></label><div><i id="redRoomMariahHealth"></i></div></div><div class="boss-health" id="redRoomJonesBar" hidden><label>GARETH JONES <span id="redRoomJonesValue"></span></label><div><i id="redRoomJonesHealth"></i></div></div><strong id="redRoomWeapon"></strong></div><div id="redRoomReticle">+</div><div id="redRoomFightNotice" role="status"></div><div id="redRoomCombatDialogue" hidden><strong id="redRoomCombatSpeaker"></strong><p id="redRoomCombatLine" aria-live="polite"></p></div></div>`;
redRoomsUI.appendChild(uxbridgeMariahUI);
const redRoomRetry=document.createElement('button');redRoomRetry.id='redRoomRetry';redRoomRetry.textContent='RETRY ROOM 100 BOSS FIGHT';redRoomRetry.hidden=true;
document.getElementById('redRoomMenu').before(redRoomRetry);
document.getElementById('redRoomMariahNext').onclick=()=>redRooms?.phase==='ending'?advanceUxbridgeEnding():redRooms?.phase==='jonesIntro'?finishUxbridgeJonesIntro():advanceUxbridgeMariahIntro();
document.getElementById('redRoomMariahSkip').onclick=()=>redRooms?.phase==='ending'?finishUxbridgeEnding():redRooms?.phase==='jonesIntro'?finishUxbridgeJonesIntro():startUxbridgeMariahFight();
redRoomRetry.onclick=startUxbridgeMariahFight;

function beginUxbridgeMariahIntro(){
 const p=redRooms;if(!p||p.phase!=='explore'||p.index!==99)return;
 p.phase='meeting';p.phaseTime=0;keys.clear();drag=false;
 p.mariahFight={line:0,lineTime:0,mouth:makeBustersSpeechMouth(p.mariah),start:p.mariah.position.clone()};
 p.mariah.rotation.set(0,0,0);redRoomsUI.classList.add('red-room-cinematic');
 $('redRoomPrompt').textContent='';$('redRoomMariahCinema').hidden=false;$('redRoomFightHUD').hidden=true;
 playUxbridgeRoomVoice('intro',0);document.exitPointerLock?.();
 renderUxbridgeMariahIntro(0);
}
function advanceUxbridgeMariahIntro(){
 const p=redRooms,b=p?.mariahFight;if(!b||p.paused||p.phase!=='meeting')return;
 if(++b.line>=UXBRIDGE_MARIAH_LINES.length){startUxbridgeMariahFight();return;}
 b.lineTime=0;playUxbridgeRoomVoice('intro',b.line);
}
function renderUxbridgeMariahIntro(dt){
 const p=redRooms,b=p.mariahFight;b.lineTime+=dt;
 const length=Math.max(5.5,UXBRIDGE_MARIAH_LINES[b.line].split(/\s+/).length/2.7+1),t=b.lineTime;
 const target=p.mariah.position.clone().add(new THREE.Vector3(0,1.72,0));
 const distance=4.8-Math.min(1,t/length)*.4,side=b.line%2?-.55:.55;
 aimUxbridgeCamera(target.clone().add(new THREE.Vector3(side,.12,distance)),target);
 animateCharacter(p.time,false,false,p.mariah);
 p.mariah.rotation.y=Math.atan2(camera.position.x-p.mariah.position.x,camera.position.z-p.mariah.position.z);
 updateUxbridgeRoomVoice(dt);
 if(b.voice?.done)advanceUxbridgeMariahIntro();
}
function mariahArenaWalkable(x,z){
 const p=redRooms,q=p?.plans[99];return !!q&&x>-q.width/2+.7&&x<q.width/2-.7&&z<q.entry-.8&&z>q.exit+.8&&redRoomWalkable(x,z);
}
function mariahArenaClear(a,c){
 const count=Math.ceil(a.distanceTo(c)*2);
 for(let i=1;i<count;i++){const t=i/count;if(!mariahArenaWalkable(THREE.MathUtils.lerp(a.x,c.x,t),THREE.MathUtils.lerp(a.z,c.z,t)))return false;}
 return true;
}
function clearMariahArenaEffects(b){
 for(const fx of b.effects||[])disposeDetailedRedObject(fx.root);b.effects=[];
 for(const pickup of b.pickups||[])disposeDetailedRedObject(pickup.root);b.pickups=[];
}
function startUxbridgeMariahFight(){
 const p=redRooms,b=p?.mariahFight;if(!b||!['meeting','lost'].includes(p.phase))return;
 stopUxbridgeRoomVoice();clearMariahArenaEffects(b);if(b.jones){disposeDetailedRedObject(b.jones.actor);b.jones=null;}
 Object.assign(b,{hp:150,maxHP:150,enemyHP:10000,maxEnemyHP:10000,jonesArrived:false,voiceTurn:0,mariahVoiceIndex:0,jonesVoiceIndex:0,nextVoiceAt:p.time+2,weapon:0,ammo:[24,8],reload:0,fire:0,recoil:0,holding:false,ended:false,notice:'DEFEAT MARIAH / EVADE HER DUAL PISTOLS',noticeTime:5});
 $('redRoomJonesBar').hidden=true;
 if(!b.enemy){b.enemy={actor:p.mariah,kind:'gareth',superboss:true};attachTyrantPistols(b.enemy,true);}
 Object.assign(b.enemy,{hp:b.enemyHP,maxHP:b.maxEnemyHP,pattern:0,wind:0,windDuration:0,burst:0,burstClock:0,fire:2.5,nextMove:2,dodge:0,dodgeCooldown:2,dodgeSign:1,strafeSign:1,recoil:0,hitReact:0,recovery:0,hand:0,animPhase:0,locomoting:false});
 b.enemy.muzzles.forEach(m=>m.visible=false);b.mouth.open.visible=false;b.mouth.closed.visible=true;
 if(!b.gun){b.gun=bossGun(camera);b.gun.position.set(.3,-.25,-.55);}b.gun.visible=true;
 p.mariah.position.copy(b.start);p.mariah.rotation.set(0,0,0);p.mariah.userData.body.rotation.set(0,0,0);p.mariah.userData.body.position.y=0;p.mariah.userData.head.rotation.set(0,0,0);
 const q=p.plans[99];player.set(0,0,q.entry-4);yaw=Math.atan2(player.x-b.start.x,player.z-b.start.z);pitch=0;
 for(const [x,z]of [[-4,q.center+5],[4,q.center],[-4,q.center-5]]){
  let point;for(let offset=0;offset<6&&!point;offset++)for(const sign of [1,-1])if(mariahArenaWalkable(x,z+offset*sign)){point={x,z:z+offset*sign};break;}
  if(!point)continue;const root=makeGarethHealthPack();root.position.set(point.x,.1,point.z);p.root.add(root);b.pickups.push({root,...point,taken:false});
 }
 // Only gunfire and combat effects play in this encounter.
 b.music?.pause();b.music=null;syncMenuSong();
 p.phase='fight';p.phaseTime=0;p.paused=false;p.completed=false;keys.clear();
 redRoomsUI.classList.remove('red-room-cinematic');redRoomsUI.classList.add('red-room-fight');$('redRoomMariahCinema').hidden=true;$('redRoomFightHUD').hidden=false;$('redRoomModal').hidden=true;$('redRoomRetry').hidden=true;
 redRoomsUI.querySelector('.ux-pursuit-top h2').textContent='DEFEAT MARIAH BANU';redRoomsUI.querySelector('footer').textContent='WASD MOVE · SHIFT RUN · MOUSE FIRE · 1 / 2 WEAPONS · R RELOAD · ESC PAUSE';
 $('redRoomPrompt').textContent='';updateRedRoomFirstPerson();updateUxbridgeMariahHUD();drawRedRoomMap();requestLock();
}
function updateUxbridgeMariahHUD(){
 const b=redRooms?.mariahFight;if(!b||b.hp===undefined)return;
 $('redRoomPlayerValue').textContent=Math.ceil(b.hp)+' / '+b.maxHP;$('redRoomPlayerHealth').style.width=(b.hp/b.maxHP*100)+'%';
 $('redRoomMariahValue').textContent=Math.ceil(b.enemyHP)+' / '+b.maxEnemyHP;$('redRoomMariahHealth').style.width=(b.enemyHP/b.maxEnemyHP*100)+'%';
 if(b.jones){$('redRoomJonesValue').textContent=Math.ceil(b.jones.hp)+' / '+b.jones.maxHP;$('redRoomJonesHealth').style.width=(b.jones.hp/b.jones.maxHP*100)+'%';}
 $('redRoomWeapon').textContent=(b.weapon?'SHOTGUN':'PISTOL')+' / '+b.ammo[b.weapon]+(b.reload>0?' · RELOADING':' · R RELOAD');
 $('redRoomFightNotice').textContent=b.noticeTime>0?b.notice:'';
}
function reloadUxbridgeMariahWeapon(){
 const p=redRooms,b=p?.mariahFight;if(p?.phase!=='fight'||p.paused||b.reload>0||b.ammo[b.weapon]===(b.weapon?8:24))return;
 b.reload=1.5;b.reloadWeapon=b.weapon;updateUxbridgeMariahHUD();
}
function mariahArenaTracer(a,c,color=0xffd28e){
 const root=new THREE.Line(new THREE.BufferGeometry().setFromPoints([a,c]),new THREE.LineBasicMaterial({color,transparent:true,opacity:.85}));redRooms.root.add(root);redRooms.mariahFight.effects.push({root,life:.13});
}
function shootUxbridgeMariah(){
 const p=redRooms,b=p?.mariahFight;if(p?.phase!=='fight'||p.paused||b.ended||b.fire>0||b.reload>0)return;
 if(b.ammo[b.weapon]<=0){reloadUxbridgeMariahWeapon();return;}b.ammo[b.weapon]--;b.fire=b.weapon?.7:.21;b.recoil=.12;
 updateRedRoomFirstPerson();const direction=new THREE.Vector3();camera.getWorldDirection(direction);
 const ray=new THREE.Ray(camera.position.clone(),direction),targets=[{actor:p.mariah,hp:b.enemyHP,jones:false},...(b.jones?[{actor:b.jones.actor,hp:b.jones.hp,jones:true}]:[])];let closest=null;
 for(const target of targets){if(target.hp<=0)continue;target.actor.updateMatrixWorld(true);const hit=ray.intersectBox(new THREE.Box3().setFromObject(target.actor).expandByScalar(.16),new THREE.Vector3());if(hit&&mariahArenaClear(player,target.actor.position)&&(!closest||hit.distanceTo(camera.position)<closest.hit.distanceTo(camera.position)))closest={...target,hit};}
 let end=camera.position.clone().addScaledVector(direction,40);
 if(closest){end=closest.hit;const damage=b.weapon?(end.distanceTo(camera.position)<12?450:240):160;if(closest.jones)damageUxbridgeJones(damage);else damageUxbridgeMariah(damage);$('redRoomReticle').textContent='×';}
 else $('redRoomReticle').textContent='+';
 mariahArenaTracer(camera.position.clone(),end);playGunshot(.4);updateUxbridgeMariahHUD();
}
function damageUxbridgeMariah(amount){
 const p=redRooms,b=p?.mariahFight;if(p?.phase!=='fight'||p.paused||b.ended||amount<=0)return;
 if(b.enemyHP<=0)return;
 b.enemyHP=Math.max(b.jonesArrived?0:5000,b.enemyHP-amount);const e=b.enemy;e.hp=b.enemyHP;e.hitReact=.18;
 if(e.hp>0&&e.dodgeCooldown<=0&&!e.wind&&!e.recovery){e.dodge=.5;e.dodgeSign=Math.random()<.5?-1:1;e.dodgeCooldown=1.3;}
 if(!b.jonesArrived&&b.enemyHP<=5000){beginUxbridgeJonesIntro();return;}
 if(b.enemyHP<=0){defeatUxbridgeRoomActor(e);if(b.voice?.actor===p.mariah)stopUxbridgeRoomVoice();checkUxbridgeRoomVictory();}
}
function mariahArenaWarning(aim,radius,life){
 const root=new THREE.Mesh(new THREE.RingGeometry(Math.max(.1,radius-.06),radius,48),new THREE.MeshBasicMaterial({color:0xff3455,transparent:true,opacity:.75,side:THREE.DoubleSide}));root.rotation.x=-Math.PI/2;root.position.copy(aim);root.position.y=.04;redRooms.root.add(root);redRooms.mariahFight.effects.push({root,life});
}
function updateUxbridgeMariahAttacks(dt){
 const p=redRooms,b=p.mariahFight,e=b.enemy;e.hp=b.enemyHP;b.time=p.time;if(e.hp<=0)return;
 updateTyrantGarethBoss(e,dt,{state:b,range:40,damageScale:5/12,
  free:(x,z)=>mariahArenaWalkable(x,z)&&Math.hypot(x-player.x,z-player.z)>1.1&&(!b.jones||b.jones.hp<=0||Math.hypot(x-b.jones.actor.position.x,z-b.jones.actor.position.z)>1.2),
  clearShot:mariahArenaClear,
  trace:(a,c)=>mariahArenaTracer(a,c,0xff697e),warning:mariahArenaWarning,
  prompt:text=>{b.notice=text.replace(/\bGARETH\b/g,'MARIAH').replace(/\bHIS\b/g,'HER');b.noticeTime=2;}
 });
}
function renderUxbridgeMariahFight(dt){
 const p=redRooms,b=p.mariahFight,q=p.plans[99];if(b.ended)return;
 const f=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0),s=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0),step=(keys.has('ShiftLeft')||keys.has('ShiftRight')?8:5.2)*dt/(Math.hypot(f,s)||1);
 const dx=(-Math.sin(yaw)*f+Math.cos(yaw)*s)*step,dz=(-Math.cos(yaw)*f-Math.sin(yaw)*s)*step;
 const free=(x,z)=>mariahArenaWalkable(x,z)&&(b.enemyHP<=0||Math.hypot(x-p.mariah.position.x,z-p.mariah.position.z)>.85)&&(!b.jones||b.jones.hp<=0||Math.hypot(x-b.jones.actor.position.x,z-b.jones.actor.position.z)>.85);
 if(free(player.x+dx,player.z))player.x+=dx;
 if(free(player.x,player.z+dz))player.z+=dz;
 player.y=0;updateRedRoomFirstPerson();b.fire=Math.max(0,b.fire-dt);b.recoil=Math.max(0,b.recoil-dt);b.noticeTime=Math.max(0,b.noticeTime-dt);
 if(b.reload>0){b.reload=Math.max(0,b.reload-dt);if(b.reload===0)b.ammo[b.reloadWeapon]=b.reloadWeapon?8:24;}
 if(b.holding)shootUxbridgeMariah();if(b.ended||p.phase!=='fight')return;
 b.gun.position.z=-.55+b.recoil*.5;updateUxbridgeMariahAttacks(dt);updateUxbridgeJonesAttacks(dt);tickUxbridgeRoomCombatVoice(dt);
 for(let i=b.effects.length-1;i>=0;i--){const fx=b.effects[i];fx.life-=dt;if(fx.life<=0){disposeDetailedRedObject(fx.root);b.effects.splice(i,1);}}
 for(const pickup of b.pickups){if(pickup.taken)continue;pickup.root.rotation.y+=dt;pickup.root.position.y=.12+Math.sin(p.time*2)*.05;
  if(b.hp>0&&b.hp<b.maxHP&&Math.hypot(player.x-pickup.x,player.z-pickup.z)<1.5){b.hp=Math.min(b.maxHP,b.hp+50);pickup.taken=true;pickup.root.visible=false;b.notice='HEALTH RESTORED +50';b.noticeTime=2;}
 }
 updateUxbridgeMariahHUD();if(b.hp<=0)finishUxbridgeMariahFight(false);
}
function finishUxbridgeMariahFight(won){
 const p=redRooms,b=p?.mariahFight;if(p?.phase!=='fight'||b.ended||(won&&(!b.jonesArrived||b.enemyHP>0||b.jones.hp>0)))return;
 b.ended=true;b.holding=false;b.enemy.wind=b.enemy.burst=b.enemy.recoil=0;b.music?.pause();b.enemy.muzzles.forEach(m=>m.visible=false);b.gun.visible=false;keys.clear();
 stopUxbridgeRoomVoice();if(b.jones){b.jones.wind=b.jones.burst=b.jones.recoil=0;b.jones.muzzles.forEach(m=>m.visible=false);}
 clearMariahArenaEffects(b);p.phase=won?'complete':'lost';p.completed=won;
 if(won){gameProgress.uxbridgeMariahDefeated=true;gameProgress.uxbridgeJonesDefeated=true;gameProgress.uxbridgeRedRoomsCompleted=true;gameProgress.uxbridgeCompleted=true;saveProgress();refreshProgressUI();}
 updateUxbridgeMariahHUD();if(won){beginUxbridgeEnding();return;}pauseRedRooms('YOU WERE DEFEATED','Retry the boss fight directly from Room 100.');
}
function clearUxbridgeMariah(){
 stopUxbridgeRoomVoice();clearUxbridgeEnding();const b=redRooms?.mariahFight;if(b){b.music?.pause();if(b.music)b.music.currentTime=0;if(b.gun)disposeDetailedRedObject(b.gun);}
 redRoomsUI.classList.remove('red-room-fight');$('redRoomMariahCinema').hidden=true;$('redRoomFightHUD').hidden=true;$('redRoomRetry').hidden=true;
 redRoomsUI.querySelector('.ux-pursuit-top h2').textContent='FIND MARIAH BANU';redRoomsUI.querySelector('footer').textContent='WASD MOVE · SHIFT RUN · E OPEN DOOR · ESC PAUSE';
}
