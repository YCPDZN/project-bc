/* Chapter 4's victory aftermath belongs only to Kevin's Josiah-alive branch. */
const UXBRIDGE_MARIAH_ENDING_LINES=[
 'Gareth… stay with me. Don’t you dare close your eyes.',
 'Look at us. This is what Kevin wanted you to do. He sent you here to tear the Resistance apart.',
 'But I was never its only leader. There is someone else… someone Kevin cannot frighten into silence.',
 'Damian Juko. Remember that name. You haven’t ended the Resistance. You’ve given him a reason to come for you.'
];
const uxbridgeEndingShade=document.createElement('div');uxbridgeEndingShade.id='redRoomEndingShade';uxbridgeEndingShade.hidden=true;uxbridgeMariahUI.appendChild(uxbridgeEndingShade);
function layUxbridgeWoundedActor(actor,x,z,angle){
 const dropped=[];actor.traverse(o=>{if(o.userData.barrelAxis)dropped.push(o);});
 for(const [i,gun]of dropped.entries()){redRooms.root.add(gun);registerHeldGun.items?.delete(gun);gun.rotation.set(Math.PI/2,0,i*.7);gun.position.set(x+(i?-.65:.65),0,z-.6);gun.updateMatrixWorld(true);gun.position.y+=.04-new THREE.Box3().setFromObject(gun).min.y;}
 actor.position.set(x,0,z);actor.rotation.set(-Math.PI/2,0,angle);const u=actor.userData;
 u.body.position.set(0,0,0);u.body.rotation.set(0,0,0);u.head.rotation.set(.08,0,0);
 u.arms.forEach((a,i)=>a.rotation.set(-.2,0,i?-.24:.24));u.legs.forEach((leg,i)=>leg.rotation.set(i?.1:-.05,0,i?.1:-.1));
 actor.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(actor);actor.position.y+=.035-bounds.min.y;actor.updateMatrixWorld(true);
 const blood=new THREE.MeshStandardMaterial({color:0x8c1830,emissive:0x31040e,roughness:.55});
 for(let i=0;i<4;i++)ball(u.body,.045+i*.01,.035+i*.008,.008,blood,.11+Math.sin(i*2)*.06,1.2-i*.08,.225);
 ball(u.head,.02,.055,.009,blood,.15,-.08,.255);
 const point=actor.localToWorld(new THREE.Vector3(.08,1.15,0)),pool=new THREE.Mesh(new THREE.CircleGeometry(.58,32),new THREE.MeshStandardMaterial({color:0x5b0b1b,emissive:0x220109,transparent:true,opacity:.85,roughness:.35}));pool.rotation.x=-Math.PI/2;pool.scale.set(1.35,.65,1);pool.position.set(point.x,.028,point.z);pool.name='Stylized blood pool';redRooms.root.add(pool);
 return pool;
}
function beginUxbridgeEnding(){
 const p=redRooms,b=p?.mariahFight;if(!b||b.ending)return;
 stopUxbridgeRoomVoice();p.phase='ending';p.phaseTime=0;p.paused=false;p.completed=false;keys.clear();drag=false;
 const q=p.plans[99];b.ending={stage:'aftermath',time:0,line:0,lineTime:0,root:null,beat:-1,lastStep:-1};
 layUxbridgeWoundedActor(p.mariah,-1.65,q.exit+7.5,-.08);layUxbridgeWoundedActor(b.jones.actor,1.75,q.exit+7.8,.13);
 const key=new THREE.PointLight(0xeac1b9,18,18);key.position.set(0,4.2,q.exit+8);p.root.add(key);
 redRoomsUI.classList.remove('red-room-fight');redRoomsUI.classList.add('red-room-cinematic');$('redRoomFightHUD').hidden=true;$('redRoomMariahCinema').hidden=false;$('redRoomModal').hidden=true;
 $('redRoomMariahCinema').querySelector('.cinema-top>span').textContent='CHAPTER 04 / THE FOOL OF UXBRIDGE / AFTERMATH';$('redRoomMariahNext').textContent='NEXT LINE · ENTER';
 uxbridgeEndingShade.hidden=false;uxbridgeEndingShade.style.opacity='0';playUxbridgeRoomVoice('mariahEnding',0);document.exitPointerLock?.();renderUxbridgeEnding(0);
}
function advanceUxbridgeEnding(){
 const p=redRooms,c=p?.mariahFight?.ending;if(p?.phase!=='ending'||p.paused||!c)return;
 if(c.stage==='reveal'){finishUxbridgeEnding();return;}
 if(++c.line>=UXBRIDGE_MARIAH_ENDING_LINES.length){beginUxbridgeDamianReveal();return;}
 c.lineTime=0;playUxbridgeRoomVoice('mariahEnding',c.line);
}
function beginUxbridgeDamianReveal(){
 const p=redRooms,b=p.mariahFight,c=b.ending;stopUxbridgeRoomVoice();c.stage='reveal';c.time=0;c.beat=-1;
 // A separate enclosed corridor reuses the established Damian entrance motifs.
 const root=c.root=new THREE.Group();root.position.set(1200,0,0);scene.add(root);const stone=mat(0x10131b),trim=mat(0x3d414d);
 box(root,12,.2,38,stone,0,-.13,0);box(root,12,.2,38,stone,0,5,0);for(const x of [-5.5,5.5])box(root,.3,5,38,stone,x,2.5,0);box(root,11,5,.3,stone,0,2.5,-17);
 c.lamps=[];for(let z=-14;z<=14;z+=4){for(const side of [-1,1])box(root,.4,5,.65,trim,side*5.3,2.5,z);const lamp=box(root,4,.05,.16,new THREE.MeshBasicMaterial({color:0xcbd9e8}),0,4.85,z);lamp.visible=false;c.lamps.push(lamp);}
 c.back=new THREE.PointLight(0x9baeff,28,25);c.back.position.set(0,3,-12);root.add(c.back);c.front=new THREE.PointLight(0xe5e3d9,0,17);c.front.position.set(1,3,1);root.add(c.front);
 c.damian=makeDamianJuko();c.damian.position.set(0,0,-8);root.add(c.damian);
 c.links=[];for(const side of [-1,1])for(let i=0;i<30;i++){const link=new THREE.Mesh(new THREE.TorusGeometry(.095,.027,6,10),new THREE.MeshStandardMaterial({color:0xd4ab45,emissive:0x4c3108,metalness:.7,roughness:.25}));link.position.set(side*(.7+i*.11),1.2+Math.sin(i*.5)*.09,-2);link.rotation.set(0,Math.PI/2,i%2?Math.PI/2:0);link.visible=false;root.add(link);c.links.push({obj:link,start:link.position.clone(),side});}
 c.rings=[];for(let i=0;i<3;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(1,.017,6,96),new THREE.MeshBasicMaterial({color:0xbecfff,transparent:true,opacity:0}));ring.rotation.x=Math.PI/2;ring.position.set(0,.04+i*.06,-2);root.add(ring);c.rings.push(ring);}
 flash.visible=false;ambient.intensity=.12;cameraFill.intensity=.2;scene.fog.density=.018;scene.fog.color.setHex(0x03040a);scene.background.setHex(0x03040a);
 $('redRoomMariahNext').textContent='CONTINUE · ENTER';$('redRoomMariahCinema').querySelector('.cinema-top>span').textContent='THE RESISTANCE / STILL STANDING';tone(38,1.8,.1,'sine',24);renderUxbridgeEnding(0);
}
function renderUxbridgeEnding(dt){
 const p=redRooms,b=p.mariahFight,c=b.ending;c.time+=dt;c.lineTime+=dt;
 if(c.stage==='aftermath'){
  for(const [i,actor]of [p.mariah,b.jones.actor].entries()){actor.userData.body.position.z=Math.sin(c.time*2+i)*.004;actor.userData.head.rotation.x=.08+Math.sin(c.time*1.3+i)*.015;}
  const q=p.plans[99],target=p.mariah.userData.head.getWorldPosition(new THREE.Vector3());
  if(c.line===0&&c.lineTime<2)aimUxbridgeCamera(new THREE.Vector3(.2,4.2,q.exit+12.5),new THREE.Vector3(0,.35,q.exit+6.4));
  else aimUxbridgeCamera(target.clone().add(new THREE.Vector3(c.line%2?-.6:.65,1.1,3.1)),target);
  updateUxbridgeRoomVoice(dt);if(b.voice?.done)advanceUxbridgeEnding();return;
 }
 const t=c.time,d=c.damian,walk=THREE.MathUtils.clamp((t-1.8)/6,0,1);d.position.z=-8+walk*6;animateCharacter(t,t>=1.8&&t<7.8,false,d);
 const step=Math.floor((t-1.8)/.7);if(t>=1.8&&t<7.8&&step!==c.lastStep){c.lastStep=step;tone(55,.12,.06,'triangle',32);}
 c.front.intensity=THREE.MathUtils.clamp((t-6)*6,0,26);c.back.intensity=26+Math.sin(t*2)*2;
 c.lamps.forEach((lamp,i)=>lamp.visible=t>2.5+i*.5&&(t>8||Math.sin(t*13+i)>-.4));
 const beat=t<1.5?0:t<5?1:t<8?2:t<10?3:4;
 if(c.beat!==beat){c.beat=beat;const lines=[['','The room falls silent.'],['','Somewhere beyond Door 100… footsteps.'],['','The lights bend towards a figure in the dark.'],['','The chains stop.'],['DAMIAN JUKO','LAWFUL ENFORCER AND EXECUTIONER']];$('redRoomMariahSpeaker').textContent=lines[beat][0];$('redRoomMariahLine').textContent=lines[beat][1];if(beat===3)tone(48,1.2,.12,'triangle',20);if(beat===4)tone(85,1.3,.1,'sine',190);}
 if(t>=8)d.userData.arms[0].rotation.x=-1.45;
 for(const link of c.links){link.obj.visible=t>=8&&t<13.5;link.obj.position.copy(link.start);if(t>=10){const burst=t-10;link.obj.position.x+=link.side*burst*1.8;link.obj.position.y+=Math.sin(burst)*1.2;link.obj.position.z+=Math.sin(link.start.x*3)*burst;link.obj.rotation.z+=dt*5;}}
 for(const [i,ring]of c.rings.entries()){const pulse=(Math.max(0,t-10-i*.35)%2.5)/2.5;ring.scale.setScalar(1+pulse*7);ring.material.opacity=t>=10?(1-pulse)*.4:0;}
 let shot,look;if(t<5){shot=new THREE.Vector3(.8,.35,d.position.z+2.9);look=new THREE.Vector3(0,.35,d.position.z);}else if(t<8){shot=new THREE.Vector3(-2.2,.9,2);look=new THREE.Vector3(0,1.6,d.position.z);}else{const angle=(t-8)*.12;shot=new THREE.Vector3(Math.sin(angle)*3.8,1.15,-2+Math.cos(angle)*3.8);look=new THREE.Vector3(0,1.7,-2);}
 aimUxbridgeCamera(c.root.position.clone().add(shot),c.root.position.clone().add(look));uxbridgeEndingShade.style.opacity=t<1.5?String(1-t/1.5):t>14.5?String(Math.min(1,(t-14.5)/1.5)):'0';
 if(t>=16.2)finishUxbridgeEnding();
}
function finishUxbridgeEnding(){
 const p=redRooms,b=p?.mariahFight;if(p?.phase!=='ending'||p.paused)return;
 stopUxbridgeRoomVoice();uxbridgeEndingShade.hidden=true;p.phase='complete';p.completed=true;gameProgress.uxbridgeEndingViewed=true;saveProgress();refreshProgressUI();
 pauseRedRooms('THE FOOL OF UXBRIDGE / COMPLETE','Mariah Banu and Gareth Jones are defeated. Damian Juko has arrived.');
}
function clearUxbridgeEnding(){
 const c=redRooms?.mariahFight?.ending;if(c?.root)disposeDetailedRedObject(c.root);
 uxbridgeEndingShade.hidden=true;uxbridgeEndingShade.style.opacity='0';$('redRoomMariahCinema').querySelector('.cinema-top>span').textContent='THE FOOL OF UXBRIDGE / ROOM 100';$('redRoomMariahNext').textContent='NEXT LINE · ENTER';
}
