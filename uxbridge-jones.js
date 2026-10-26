/* One reinforcement event, with no damage or timers advancing during his entrance. */
function beginUxbridgeJonesIntro(){
 const p=redRooms,b=p?.mariahFight;if(p?.phase!=='fight'||b.jonesArrived||b.ended)return;
 stopUxbridgeRoomVoice();b.jonesArrived=true;b.holding=false;keys.clear();
 const actor=makeJonesOrEmma(false);actor.name='Gareth Jones / Room 100';p.root.add(actor);
 const q=p.plans[99],start=new THREE.Vector3(0,0,q.entry-.9);let end=start.clone();
 entrance:for(const x of [-2,2,0])for(let offset=5;offset<=8;offset++)if(mariahArenaWalkable(x,q.entry-offset)&&Math.hypot(x-player.x,q.entry-offset-player.z)>1.4){end.set(x,0,q.entry-offset);break entrance;}
 const e=b.jones={actor,kind:'jones',hp:5000,maxHP:5000,mouth:makeBustersSpeechMouth(actor),start,end,fire:2.5,wind:0,burst:0,burstClock:0,recoil:0,animPhase:0,hitReact:0,dodge:0,locomoting:false};attachTyrantPistols(e,false);e.muzzles.forEach(m=>m.visible=false);actor.position.copy(start);
 p.phase='jonesIntro';p.phaseTime=0;b.gun.visible=false;b.enemy.muzzles.forEach(m=>m.visible=false);
 redRoomsUI.classList.add('red-room-cinematic');$('redRoomMariahCinema').hidden=false;$('redRoomFightHUD').hidden=true;
 $('redRoomJonesBar').hidden=false;redRoomsUI.querySelector('.ux-pursuit-top h2').textContent='DEFEAT MARIAH & GARETH JONES';
 playUxbridgeRoomVoice('jonesIntro');document.exitPointerLock?.();renderUxbridgeJonesIntro(0);
}
function renderUxbridgeJonesIntro(dt){
 const p=redRooms,b=p.mariahFight,e=b.jones,t=Math.min(1,p.phaseTime/2.2);
 e.actor.position.lerpVectors(e.start,e.end,t);turnTyrantActor(e.actor,player,dt||.01);animateTyrantActor(e,dt,t<1?'walk':'idle',p.time);
 const target=e.actor.position.clone().add(new THREE.Vector3(0,1.65,0));aimUxbridgeCamera(target.clone().add(new THREE.Vector3(.8,.2,4.5)),target);
 updateUxbridgeRoomVoice(dt);if(b.voice?.done)finishUxbridgeJonesIntro();
}
function finishUxbridgeJonesIntro(){
 const p=redRooms,b=p?.mariahFight;if(p?.phase!=='jonesIntro'||p.paused)return;
 stopUxbridgeRoomVoice();b.jones.actor.position.copy(b.jones.end);p.phase='fight';p.phaseTime=0;b.gun.visible=true;b.nextVoiceAt=p.time+3;b.voiceTurn=1;
 redRoomsUI.classList.remove('red-room-cinematic');$('redRoomMariahCinema').hidden=true;$('redRoomFightHUD').hidden=false;
 b.notice='GARETH JONES IS HELPING MARIAH / DEFEAT BOTH';b.noticeTime=5;updateRedRoomFirstPerson();updateUxbridgeMariahHUD();requestLock();
}
function defeatUxbridgeRoomActor(e){
 e.wind=e.burst=e.recoil=0;e.locomoting=false;e.muzzles.forEach(m=>m.visible=false);e.actor.userData.weaponAimPoint=null;
 e.actor.userData.arms.forEach(a=>a.rotation.set(0,0,0));e.actor.rotation.z=Math.PI/2;e.actor.position.y=-.6;
 const mouth=e.mouth||redRooms.mariahFight.mouth;mouth.open.visible=false;mouth.closed.visible=true;
}
function checkUxbridgeRoomVictory(){const b=redRooms?.mariahFight;if(b?.jonesArrived&&b.enemyHP<=0&&b.jones.hp<=0)finishUxbridgeMariahFight(true);}
function damageUxbridgeJones(amount){
 const p=redRooms,b=p?.mariahFight,e=b?.jones;if(p?.phase!=='fight'||p.paused||b.ended||!e||e.hp<=0||amount<=0)return;
 e.hp=Math.max(0,e.hp-amount);e.hitReact=.18;if(e.hp<=0){defeatUxbridgeRoomActor(e);if(b.voice?.actor===e.actor)stopUxbridgeRoomVoice();checkUxbridgeRoomVictory();}updateUxbridgeMariahHUD();
}
function updateUxbridgeJonesAttacks(dt){
 const p=redRooms,b=p.mariahFight,e=b.jones;if(!e||e.hp<=0)return;
 e.recoil=Math.max(0,e.recoil-dt);e.hitReact=Math.max(0,e.hitReact-dt);turnTyrantActor(e.actor,player,dt);
 // Jones flanks alongside Mariah rather than firing from his entrance position.
 const a=e.actor.position,d=a.distanceTo(player);e.locomoting=false;
 if(!e.wind&&!e.burst){const direction=player.clone().sub(a);direction.y=0;direction.normalize();const sign=d<4?-1:d>9?1:0;
  const dx=(direction.x*sign+direction.z*.4)*dt*2.3,dz=(direction.z*sign-direction.x*.4)*dt*2.3;
  const free=(x,z)=>mariahArenaWalkable(x,z)&&Math.hypot(x-player.x,z-player.z)>1.1&&(b.enemyHP<=0||Math.hypot(x-p.mariah.position.x,z-p.mariah.position.z)>1.2);
  if(free(a.x+dx,a.z+dz)){a.x+=dx;a.z+=dz;e.locomoting=true;}
 }
 if(e.wind>0){e.wind=Math.max(0,e.wind-dt);if(e.wind===0){e.burst=3;e.burstClock=0;}}
 else if(!e.burst){e.fire-=dt;if(e.fire<=0&&d<35&&mariahArenaClear(a,player)){e.aim=player.clone();e.wind=.65;e.fire=2.6;mariahArenaWarning(e.aim,.85,.8);b.notice='GARETH JONES / COVERING FIRE — MOVE';b.noticeTime=1.5;}}
 if(e.burst>0){e.burstClock-=dt;if(e.burstClock<=0){e.burst--;e.burstClock=.2;e.recoil=.22;garethPistolTrace(e,0,e.aim,(from,to)=>mariahArenaTracer(from,to,0x91b9ff));playGunshot(.25);if(player.distanceTo(e.aim)<1.1&&mariahArenaClear(a,player))b.hp=Math.max(0,b.hp-8);}}
 animateTyrantActor(e,dt,e.recoil>0?'fire':e.wind||e.burst?'aim':e.locomoting?'walk':'aim',p.time);
}
