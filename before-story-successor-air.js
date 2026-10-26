/* An aerial arena with automatic hovering; no floor, walls or castle geometry. */
function buildTrueSuccessorAirArena(b){
 const r=b.root;r.name='The True Successor / aerial arena';
 const skyMaterial=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{top:{value:new THREE.Color(0x294a7d)},horizon:{value:new THREE.Color(0xaec7e0)},low:{value:new THREE.Color(0x768aa5)}},vertexShader:'varying vec3 vSky; void main(){vSky=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'uniform vec3 top;uniform vec3 horizon;uniform vec3 low;varying vec3 vSky;void main(){float h=normalize(vSky).y;vec3 c=mix(horizon,top,smoothstep(0.0,0.9,h));c=mix(c,low,smoothstep(0.0,0.7,-h));gl_FragColor=vec4(c,1.0);}'});
 const sky=mesh(new THREE.SphereGeometry(210,48,32),skyMaterial,r,0,8,0);sky.name='Seamless atmospheric sky';sky.renderOrder=-10;
 const clouds=new THREE.Group();clouds.name='Cloud sea far below the fight';r.add(clouds);b.airClouds=clouds;
 const cloudMat=new THREE.MeshStandardMaterial({color:0xc9d5e3,roughness:1});
 for(let i=0;i<42;i++){const angle=i*2.399963,rad=12+Math.sqrt(i/42)*135,x=Math.cos(angle)*rad,z=Math.sin(angle)*rad;
  for(let k=0;k<5;k++)ball(clouds,8+(k%3)*3,3.5+(i%3),7+(k%2)*4,cloudMat,x+Math.cos(k*1.7)*9,-30+(i%4)*2,z+Math.sin(k*1.7)*9);
 }
 const sun=ball(r,7,7,7,new THREE.MeshBasicMaterial({color:0xffecd1}),65,74,-145);sun.name='Distant sun';
 const sunlight=new THREE.DirectionalLight(0xffe0b9,2.5);sunlight.position.set(30,70,-40);r.add(sunlight);r.add(new THREE.HemisphereLight(0xc4dfff,0x596a85,1.4));
 b.airAttack=null;b.airAltitudeMin=4;b.airAltitudeMax=20;
}
function trueSuccessorAirOrb(direction,speed=11,homing=false){
 const b=beforeStoryScene.unionCrown,at=b.enemy.position.clone().add(new THREE.Vector3(0,1.3,0));
 const object=ball(b.root,.18,.18,.18,new THREE.MeshBasicMaterial({color:homing?0xff8569:0xb8a0ff}),at.x,at.y,at.z);b.projectiles.push({object,velocity:direction.clone().multiplyScalar(speed),homing,life:6});
}
function beginTrueSuccessorAirAttack(){
 const b=beforeStoryScene.unionCrown,index=b.attackIndex++%5,center=b.position.clone().add(new THREE.Vector3(0,1.3,0)),origin=b.enemy.position.clone().add(new THREE.Vector3(0,1.3,0));
 const ring=mesh(new THREE.SphereGeometry(index===4?2:.8,18,12),new THREE.MeshBasicMaterial({color:0xf792a5,wireframe:true,transparent:true,opacity:.65}),b.root);ring.position.copy(index===4?center:origin);
 b.airAttack={index,beat:0,center,origin,ring};
 document.getElementById('unionAttackCue').textContent=['CROWN SHARDS · STRAFE IN THE AIR','SPHERICAL SHOCKWAVE · GAIN DISTANCE','PURSUING SEAL · DODGE','SABRE DIVE · BOOST ASIDE','AIR FRACTURE · LEAVE THE MARKED SPHERE'][index];unionQuote();
}
function updateTrueSuccessorAirAttack(dt){
 const b=beforeStoryScene.unionCrown,a=b.airAttack;if(!a)return;a.beat+=dt;
 b.enemy.userData.arms[1].rotation.x=-Math.min(2.3,a.beat*2.3);
 const direction=b.position.clone().add(new THREE.Vector3(0,1.3,0)).sub(b.enemy.position.clone().add(new THREE.Vector3(0,1.3,0))).normalize();
 if(a.beat>=1&&!a.fired){a.fired=true;
  if(a.index===0)for(const angle of [-.22,0,.22])trueSuccessorAirOrb(direction.clone().applyAxisAngle(new THREE.Vector3(0,1,0),angle));
  if(a.index===2)trueSuccessorAirOrb(direction,8,true);
  if(a.index===3)a.direction=direction;
 }
 if(a.index===1&&a.fired){const radius=(a.beat-1)*7;a.ring.scale.setScalar(Math.max(.1,radius/.8));const distance=b.position.clone().add(new THREE.Vector3(0,1.3,0)).distanceTo(a.origin);if(Math.abs(distance-radius)<.7)unionDamage(12);}
 if(a.index===3&&a.fired&&a.beat<1.85){b.enemy.position.addScaledVector(a.direction,dt*14);b.enemy.position.x=THREE.MathUtils.clamp(b.enemy.position.x,-22,22);b.enemy.position.y=THREE.MathUtils.clamp(b.enemy.position.y,4,20);b.enemy.position.z=THREE.MathUtils.clamp(b.enemy.position.z,-22,22);if(b.position.distanceTo(b.enemy.position)<1.7)unionDamage(18);}
 if(a.index===4&&a.beat>=1.25&&!a.struck){a.struck=true;if(b.position.clone().add(new THREE.Vector3(0,1.3,0)).distanceTo(a.center)<2)unionDamage(15);
  for(let i=0;i<10;i++){const angle=i/10*Math.PI*2,spark=ball(b.root,.06,.4,.06,new THREE.MeshBasicMaterial({color:0xff9be5}),a.center.x+Math.cos(angle)*1.7,a.center.y+Math.sin(angle)*1.7,a.center.z);b.effects.push({object:spark,life:.5});}
 }
 if(b.ended)return;
 if(a.beat>=3){disposeCampObject(a.ring);b.airAttack=null;b.nextAttack=1.3;}
}
function renderTrueSuccessorAirFight(dt){
 const b=beforeStoryScene?.unionCrown;if(!b||mode!=='beforeStoryUnionFight')return;dt=Math.min(.05,Math.max(0,dt));
 if(!b.paused&&!b.ended){
  b.time+=dt;for(const k of ['fire','invulnerable','dodge','dodgeCooldown'])b[k]=Math.max(0,(b[k]||0)-dt);
  let x=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0),z=(keys.has('KeyS')?1:0)-(keys.has('KeyW')?1:0),y=(keys.has('KeyR')?1:0)-(keys.has('KeyF')?1:0),length=Math.hypot(x,y,z);
  if(length){x/=length;y/=length;z/=length;const speed=keys.has('ShiftLeft')?10:6.5;b.position.x+=(x*Math.cos(yaw)+z*Math.sin(yaw))*dt*speed;b.position.z+=(-x*Math.sin(yaw)+z*Math.cos(yaw))*dt*speed;b.position.y+=y*dt*speed;}
  if(b.dodge)b.position.addScaledVector(b.dodgeDirection,dt*15);
  b.position.x=THREE.MathUtils.clamp(b.position.x,-24,24);b.position.z=THREE.MathUtils.clamp(b.position.z,-24,24);b.position.y=THREE.MathUtils.clamp(b.position.y,b.airAltitudeMin,b.airAltitudeMax);
  animateCharacter(b.time,false,false,b.hero);animateCharacter(b.time,false,false,b.enemy);b.hero.userData.body.rotation.x=length?.12:0;
  for(const actor of [b.hero,b.enemy])actor.userData.legs.forEach((leg,i)=>leg.rotation.x=-.2+Math.sin(b.time*1.7+i)*.08);
  if(b.airAttack?.index!==3){const desired=new THREE.Vector3(Math.sin(b.time*.45)*5,10+Math.sin(b.time*.7)*1.2,-6+Math.cos(b.time*.45)*2);b.enemy.position.lerp(desired,dt*.8);}
  b.enemy.rotation.y=Math.atan2(b.position.x-b.enemy.position.x,b.position.z-b.enemy.position.z);b.hero.userData.arms[1].rotation.x=b.chain?-1.6:-.2;
  if(!b.airAttack){b.nextAttack-=dt;if(b.nextAttack<=0)beginTrueSuccessorAirAttack();}updateTrueSuccessorAirAttack(dt);if(b.ended)return;
  for(let i=b.projectiles.length-1;i>=0;i--){const p=b.projectiles[i],previous=p.object.position.clone();p.life-=dt;
   if(p.homing){const desired=b.position.clone().add(new THREE.Vector3(0,1.3,0)).sub(previous).normalize().multiplyScalar(8);p.velocity.lerp(desired,dt*1.5);}p.object.position.addScaledVector(p.velocity,dt);
   if(kenjiSegmentDistance(b.position.clone().add(new THREE.Vector3(0,1.3,0)),previous,p.object.position)<.65){unionDamage(p.homing?15:12);p.life=0;if(b.ended)return;}
   if(p.life<=0||Math.abs(p.object.position.x)>32||Math.abs(p.object.position.z)>32||p.object.position.y<-2||p.object.position.y>30){disposeCampObject(p.object);b.projectiles.splice(i,1);}
  }
  updateTrueSuccessorAlly(dt);if(mode!=='beforeStoryUnionFight'||b.ended)return;b.ally.userData.legs.forEach((leg,i)=>leg.rotation.x=-.2+Math.sin(b.time*1.7+i)*.08);
  if(b.holding)attackUnionCrownChains();updateUnionChains(dt);if(mode!=='beforeStoryUnionFight')return;
  for(let i=b.effects.length-1;i>=0;i--){const e=b.effects[i];e.life-=dt;if(e.life<=0){disposeCampObject(e.object);b.effects.splice(i,1);}}
  b.airClouds.position.x=Math.sin(b.time*.04)*2;
 }
 updateTajiriCombatLips();updateUnionCamera();document.getElementById('unionBossHP').textContent=b.enemyHP.toLocaleString()+' / 5,000 HP';document.getElementById('unionBossBar').style.width=b.enemyHP/50+'%';document.getElementById('unionHP').textContent=b.hp+' / 100 HP';document.getElementById('unionPlayerBar').style.width=b.hp+'%';document.getElementById('unionChainCue').textContent=b.fire?'GOLDEN CHAINS · RECOVERING':'GOLDEN CHAINS · READY';document.getElementById('unionView').textContent='VIEW: '+(b.thirdPerson?'THIRD PERSON':'FIRST PERSON')+' · V';document.getElementById('unionHeal').textContent='E · HEAL / '+b.medkits+' REMAINING';
}

