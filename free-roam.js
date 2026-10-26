/* Peaceful postgame spaces. Route flags remain untouched while travelling. */
const FREE_ROAM_PARTY=[
 {id:0,name:'Josiah Richards',make:()=>makeCharacter()},
 {id:1,name:'Peter Chambers',make:()=>makePeter()},
 {id:2,name:'Alissa Roberts',make:()=>makeAlissa()},
 {id:3,name:'Gareth Williams',make:()=>makeGareth()},
 {id:4,name:'Stephen Marsh',make:()=>makeStephen()},
 {id:5,name:'Elizabeth Sterling',make:()=>makeElizabethSterling()},
 {id:7,name:'Gareth Jones',make:()=>makeJonesOrEmma(false)},
 {id:8,name:'Emma Richards',make:()=>makeJonesOrEmma(true)},
 {id:9,name:'Mariah Banu',make:()=>makeMariahBanu()},
 {id:10,name:'Chris Pinter',make:()=>makeChrisPinter()},
 {id:11,name:'Damian Juko',make:()=>makeDamianJuko()}
];
let freeRoam=null,freeRoamChosen=[];
function freeRoamCompanionDeceased(id){
 if(uxbridgeEndingStatus(id)==='deceased')return true;
 if(gameProgress.universalRestorationCompleted===true)return id===1;
 if(id===0)return gameProgress.secretaryDeadCompleted===true;
 if(id===1)return gameProgress.peterKilledByStephen===true||gameProgress.emmaShot===true;
 if(id===3)return gameProgress.tyrantWilliamsKilled===true;
 if(id===4)return gameProgress.secretaryDeadCompleted===true||stephenIsDeceased();
 if(id===7)return gameProgress.garethJonesDeceased===true;
 if(id===8)return gameProgress.emmaShot===true;
 if(id===9)return gameProgress.mariahNeverSeenAgain===true;
 return false;
}
const FREE_ROAM_TUBE_SECONDS=32*60;
function freeRoamTubeStops(direction){return direction==='north'?TUBE_STATIONS.slice().reverse():TUBE_STATIONS;}
function freeRoamTubeArrivals(direction){return direction==='north'?TUBE_ARRIVALS.slice().reverse().map(seconds=>FREE_ROAM_TUBE_SECONDS-seconds):TUBE_ARRIVALS;}
function freeRoamUnlocked(){return gameProgress.primeSecretaryCompleted===true||gameProgress.secretaryDeadCompleted===true||gameProgress.universalRestorationCompleted===true;}
function refreshFreeRoamUnlock(){const card=$('chapterFreeRoam');if(card)card.hidden=!freeRoamUnlocked();}
function refreshFreeRoamChoices(){
 const host=$('freeRoamCompanions');host.replaceChildren();
 for(const entry of FREE_ROAM_PARTY){const dead=freeRoamCompanionDeceased(entry.id),label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.value=entry.id;input.disabled=dead;input.checked=freeRoamChosen.includes(entry.id)&&!dead;input.onchange=()=>{if(input.checked){if(freeRoamChosen.length===3){input.checked=false;return;}freeRoamChosen.push(entry.id);}else freeRoamChosen=freeRoamChosen.filter(id=>id!==entry.id);refreshFreeRoamChoices();};label.append(input,document.createTextNode(entry.name+(dead?' · DECEASED':'')));host.append(label);}
 $('freeRoamCount').textContent=freeRoamChosen.length+' / 3 selected';
 document.querySelectorAll('[data-free-destination]').forEach(button=>button.disabled=freeRoamChosen.length!==3);
}
function openFreeRoamFromMenu(){
 if(!freeRoamUnlocked())return;
 if(mode==='freeRoam')clearFreeRoam();
 if(mode!=='menu'){menu();refreshProgressUI();}
 closeChapterPicker(false);$('menu').inert=true;freeRoamChosen=freeRoamChosen.filter(id=>FREE_ROAM_PARTY.some(entry=>entry.id===id&&!freeRoamCompanionDeceased(id))).slice(0,3);refreshFreeRoamChoices();$('freeRoamSelect').hidden=false;
}
function closeFreeRoamSelection(){ $('freeRoamSelect').hidden=true;$('menu').inert=false; }
function freeRoamParliamentClear(x,z){
 const obstacles=freeRoam?.parliamentObstacles||[];
 return x>-32&&x<32&&z>-10&&z<108&&(z<38||Math.abs(x)<14)&&!obstacles.some(([a,b,c,d])=>x>a-.55&&x<c+.55&&z>b-.55&&z<d+.55);
}
function buildFreeRoamPlace(root,destination){
 if(destination==='brent')return; // The real Chapter 1 mall is already built in `world`.
 if(destination==='parliament'){const square=makeParliamentCamp();root.add(square.root);freeRoam.parliamentObstacles=square.obstacles;return;}
 if(destination==='tube'){
  const carriage={root,doors:[],stationLabels:[]};buildTubeCarriage(carriage);carriage.alissa.visible=false;camera.remove(carriage.gun);carriage.gun.traverse(o=>{o.geometry?.dispose();});
  carriage.tunnel.visible=true;carriage.platform.visible=false;
  root.traverse(o=>{if(o.isMesh&&o.material?.map?.image?.textContent==='SOUTHBOUND')o.visible=false;});
  freeRoam.carriage=carriage;return;
 }

}
function startFreeRoam(destination){
 if(!freeRoamUnlocked()||freeRoamChosen.length!==3||freeRoamChosen.some(freeRoamCompanionDeceased))return;
 const tubeDirection=destination==='tube-south'?'south':'north';
 if(destination==='tube-south')destination='tube';
 $('freeRoamSelect').hidden=true;$('menu').inert=false;clearFreeRoam();
 if(mode!=='menu')menu();
 setMode('freeRoam');world.visible=false;upperWorld.visible=false;exhibit.visible=false;
 for(const actor of [subject,peter,alissa,stephen,gareth,kevinMenu,elizabethMenu,mariahMenu,garethJonesMenu,emmaMenu,chrisMenu,damianMenu])if(actor)actor.visible=false;
 const root=new THREE.Group();scene.add(root);
 freeRoam={root,destination,tubeDirection,party:[],position:destination==='brent'?new THREE.Vector3(spawnCell.x*CELL,1.65,spawnCell.z*CELL):new THREE.Vector3(0,1.65,destination==='tube'?8:31),elapsed:0,station:0,stopped:true,seated:destination==='tube',journeyStartedAt:performance.now(),oldBackground:scene.background.clone(),oldFog:scene.fog,oldAmbient:ambient.intensity,oldMoon:world.userData.moon?.intensity};
 buildFreeRoamPlace(root,destination);
 freeRoamChosen.forEach((id,i)=>{const entry=FREE_ROAM_PARTY.find(c=>c.id===id),actor=entry.make();actor.visible=true;actor.scale.setScalar(destination==='tube'?.84:1);root.add(actor);actor.position.set(destination==='brent'?(spawnCell.x*CELL+(i-1)*1.3):(i-1)*1.3,0,destination==='tube'?-4:destination==='brent'?spawnCell.z*CELL+3:34);freeRoam.party.push({actor,entry,index:i});});
 world.visible=destination==='brent';upperWorld.visible=false;
 scene.background.setHex(destination==='tube'?0x161f25:destination==='brent'?0x252d32:0x07080d);scene.fog=new THREE.FogExp2(destination==='tube'?0x161f25:destination==='brent'?0x252d32:0x0b0b12,destination==='tube'?.005:destination==='brent'?.0045:.014);ambient.intensity=destination==='tube'?1.15:destination==='brent'?.4:.34;
 if(destination==='brent'){flash.visible=true;flash.intensity=18;cameraFill.intensity=.15;world.userData.moon.intensity=.22;}
 if(destination==='parliament'){flash.visible=true;flash.intensity=24;cameraFill.intensity=.14;}
 yaw=0;pitch=0;keys.clear();$('freeRoamHUD').hidden=false;updateFreeRoamHUD();
}
function updateFreeRoamHUD(){const r=freeRoam;if(!r)return;const names={parliament:'PARLIAMENT SQUARE',brent:'BRENT CROSS',tube:r.tubeDirection==='south'?'EDGWARE → EMBANKMENT':'EMBANKMENT → EDGWARE'};$('freeRoamPlace').textContent=names[r.destination];$('freeRoamParty').textContent='WITH '+r.party.map(item=>item.entry.name.toUpperCase()).join(' · ');if(r.destination==='tube'){const stops=freeRoamTubeStops(r.tubeDirection),next=stops[Math.min(17,r.station+1)],current=stops[r.station],underground=r.tubeDirection==='south'?r.station>=6:r.station<12;$('freeRoamJourney').textContent=`${formatTime(r.elapsed)} / 32:00 · ${underground?'UNDERGROUND':'SURFACE SECTION'} · ${r.station>=17?'ARRIVED AT '+current:r.stopped?'AT '+current+' · NEXT '+next:'NEXT '+next} · ${r.seated?'SEATED':'STANDING'}`;}else $('freeRoamJourney').textContent='Explore freely. Your companions follow you.';$('freeRoamControls').textContent=r.destination==='tube'?'WASD MOVE · MOUSE LOOK · E SIT / STAND · ESC MENU':'WASD MOVE · SHIFT SPRINT · MOUSE LOOK · ESC MENU';}
function renderFreeRoam(dt){const r=freeRoam;if(!r)return;const speed=keys.has('ShiftLeft')?7:4.2,forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw)),move=new THREE.Vector3();if(!r.seated){if(keys.has('KeyW')||keys.has('ArrowUp'))move.add(forward);if(keys.has('KeyS')||keys.has('ArrowDown'))move.sub(forward);if(keys.has('KeyA')||keys.has('ArrowLeft'))move.sub(right);if(keys.has('KeyD')||keys.has('ArrowRight'))move.add(right);if(move.lengthSq()){const next=r.position.clone().addScaledVector(move.normalize(),speed*dt),clear=r.destination==='brent'?(x,z)=>walkable(x,z,.28):r.destination==='parliament'?freeRoamParliamentClear:()=>true;if(clear(next.x,next.z))r.position.copy(next);else{if(clear(next.x,r.position.z))r.position.x=next.x;if(clear(r.position.x,next.z))r.position.z=next.z;}}}
 if(r.destination==='tube'){r.position.x=THREE.MathUtils.clamp(r.position.x,-1.25,1.25);r.position.z=THREE.MathUtils.clamp(r.position.z,-15.8,15.8);}r.position.y=r.seated?1.1:1.65;camera.position.copy(r.position);camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);
 if(r.destination==='brent'){world.userData.sky.material.uniforms.time.value+=dt;const nearest=mallLamps.slice().sort((a,b)=>((a.x-r.position.x)**2+(a.z-r.position.z)**2)-((b.x-r.position.x)**2+(b.z-r.position.z)**2)).slice(0,6);nearest.forEach((lamp,i)=>{mallLights[i].position.set(lamp.x,lamp.y,lamp.z);mallLights[i].color.setHex(lamp.color);mallLights[i].intensity=lamp.power*.20;});}
 r.party.forEach(({actor,index})=>{const target=r.destination==='tube'?new THREE.Vector3((index-1)*.9,0,-4-index*1.4):r.position.clone().add(new THREE.Vector3((index-1)*1.45,-1.65,2.4+index*.6));target.y=0;const clear=r.destination==='brent'?(x,z)=>walkable(x,z,.2):r.destination==='parliament'?freeRoamParliamentClear:()=>true;if(!clear(target.x,target.z))target.set(r.position.x+(index-1)*.7,0,r.position.z);if(clear(target.x,target.z))actor.position.lerp(target,Math.min(1,dt*3));else actor.position.copy(target);actor.rotation.y=yaw;const legs=actor.userData?.legs;if(legs&&Array.isArray(legs)){const swing=move.lengthSq()?Math.sin(clock*11+index)*.22:0;for(let i=0;i<legs.length;i++)if(legs[i]?.rotation)legs[i].rotation.x=(i%2?-1:1)*swing;}});
 if(r.destination==='tube'){r.elapsed=Math.min(FREE_ROAM_TUBE_SECONDS,Math.max(r.elapsed,(performance.now()-r.journeyStartedAt)/1000));const arrivals=freeRoamTubeArrivals(r.tubeDirection),stops=freeRoamTubeStops(r.tubeDirection);let station=0;while(station<17&&r.elapsed>=arrivals[station+1])station++;if(station!==r.station){r.station=station;for(const label of r.carriage.stationLabels){const replacement=tubeSign(stops[station],1.3);label.geometry.dispose();label.material.map?.dispose();label.material.dispose();label.geometry=replacement.geometry;label.material=replacement.material;}}r.stopped=station===17||r.elapsed-arrivals[station]<18;r.carriage.platform.visible=r.stopped;const underground=r.tubeDirection==='south'?station>=6:station<12;r.carriage.tunnel.visible=!r.stopped&&underground;r.carriage.scenery.visible=!r.stopped&&!underground;scene.background.setHex(underground?0x030508:0x4c5965);for(const door of r.carriage.doors)door.mesh.position.z=THREE.MathUtils.lerp(door.mesh.position.z,door.z+(r.stopped?door.q*.63:0),Math.min(1,dt*3));r.carriage.scenery.position.z=(r.elapsed*12)%5;r.carriage.tunnel.position.z=(r.elapsed*13)%3;updateFreeRoamHUD();}}
function handleFreeRoamKey(e){if(e.code==='Escape'){e.preventDefault();menu();refreshProgressUI();return;}if(e.code==='KeyE'&&freeRoam?.destination==='tube'&&!e.repeat){e.preventDefault();freeRoam.seated=!freeRoam.seated;freeRoam.position.x=freeRoam.seated?-1.15:0;updateFreeRoamHUD();return;}if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();keys.add(e.code);}
function clearFreeRoam(){const r=freeRoam;if(!r)return;scene.remove(r.root);r.root.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material]){m.map?.dispose();m.dispose?.();}}});scene.background.copy(r.oldBackground);scene.fog=r.oldFog;ambient.intensity=r.oldAmbient;if(r.oldMoon!==undefined)world.userData.moon.intensity=r.oldMoon;freeRoam=null;$('freeRoamHUD').hidden=true;keys.clear();}
document.addEventListener('DOMContentLoaded',()=>{
 $('openFreeRoam').onclick=openFreeRoamFromMenu;$('freeRoamCancel').onclick=closeFreeRoamSelection;
 document.querySelectorAll('[data-free-destination]').forEach(button=>button.onclick=()=>startFreeRoam(button.dataset.freeDestination));
 $('freeRoamTravel').onclick=()=>{document.exitPointerLock?.();openFreeRoamFromMenu();};
 $('freeRoamExit').onclick=()=>{menu();refreshProgressUI();};

});
