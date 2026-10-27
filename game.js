/* PROJECT BC — a self-contained, original horror game. Three.js MIT. */
'use strict';
const $=id=>document.getElementById(id), TAU=Math.PI*2;
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas:$('world'),antialias:true,powerPreference:'high-performance'});}catch(e){$('error').hidden=false;throw e;}
const HD_TARGET_PIXELS=1920*1080,HD_MIN_SCALE=.72,HD_MAX_SCALE=1;
const hdGraphics={scale:1,sampleMs:0,sampleFrames:0,lastAdjustment:performance.now(),pixelRatio:1};
function applyHDResolution(){
 const width=Math.max(1,innerWidth),height=Math.max(1,innerHeight);
 const touch=window.mobileTouchActive??(navigator.maxTouchPoints>0&&matchMedia('(pointer: coarse)').matches);
 const ideal=Math.min(touch?1.5:2,Math.sqrt((touch?Math.min(HD_TARGET_PIXELS,1200000):HD_TARGET_PIXELS)/(width*height)));
 hdGraphics.pixelRatio=ideal*hdGraphics.scale;
 renderer.setPixelRatio(hdGraphics.pixelRatio);renderer.setSize(width,height,false);
}
function tickHDPerformance(ms,now){
 if(document.hidden||ms<=0||ms>250||mode==='chapterLoading')return;
 hdGraphics.sampleMs+=ms;hdGraphics.sampleFrames++;
 if(now-hdGraphics.lastAdjustment<3000||hdGraphics.sampleFrames<45)return;
 const mean=hdGraphics.sampleMs/hdGraphics.sampleFrames;
 hdGraphics.sampleMs=0;hdGraphics.sampleFrames=0;hdGraphics.lastAdjustment=now;
 let next=hdGraphics.scale;
 if(mean>25)next=Math.max(HD_MIN_SCALE,next-.10);
 else if(mean<16.5)next=Math.min(HD_MAX_SCALE,next+.05);
 if(Math.abs(next-hdGraphics.scale)>.001){hdGraphics.scale=next;applyHDResolution();}
}
applyHDResolution();
const HD_ANISOTROPY=Math.min(8,renderer.capabilities.getMaxAnisotropy());
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x080e0c);scene.fog=new THREE.FogExp2(0x080e0c,.052);
 const camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.06,900);scene.add(camera);
 const outdoorNightSky=new THREE.Mesh(new THREE.SphereGeometry(750,48,24),nightSkyMaterial());scene.add(outdoorNightSky);outdoorNightSky.renderOrder=-100;outdoorNightSky.visible=false;
const ambient=new THREE.HemisphereLight(0x90a99e,0x242017,1.05);scene.add(ambient);
const mat=(c,roughness=.85)=>new THREE.MeshStandardMaterial({color:c,roughness});
const skin=mat(0xe8a580),hair=mat(0x855326),shirt=mat(0x252a2b),black=mat(0x080c0c),white=mat(0xe1e4d4),iris=mat(0x69b4ad),sole=mat(0x101717);
function mesh(geo,material,parent,x=0,y=0,z=0){let m=new THREE.Mesh(geo,material);m.position.set(x,y,z);parent.add(m);return m;}
function box(parent,w,h,d,material,x=0,y=0,z=0){return mesh(new THREE.BoxGeometry(w,h,d),material,parent,x,y,z)}
function ball(parent,sx,sy,sz,material,x=0,y=0,z=0){let m=mesh(new THREE.SphereGeometry(1,24,18),material,parent,x,y,z);m.scale.set(sx,sy,sz);return m;}
function line3(parent,pts,material,r=.013){return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p))),24,r,5,false),material,parent)}
function makeCharacter(){
 const root=new THREE.Group();root.name='Prime Secretary Josiah Richards';
 const body=new THREE.Group();root.add(body);body.name='Torso';
 ball(body,.34,.53,.22,shirt,0,1.16,0);box(body,.50,.23,.36,shirt,0,.88,0);
 const legs=[];for(const s of [-1,1]){let leg=new THREE.Group();leg.position.set(s*.155,.82,0);root.add(leg);leg.name=s<0?'LeftLeg':'RightLeg';box(leg,.22,.7,.25,black,0,-.32,0);ball(leg,.145,.11,.23,sole,0,-.72,.07);legs.push(leg);}
 const arms=[];for(const s of [-1,1]){let arm=new THREE.Group();arm.position.set(s*.32,1.47,0);body.add(arm);arm.rotation.z=s*.09;arm.name=s<0?'LeftArm':'RightArm';ball(arm,.12,.37,.135,shirt,s*.035,-.27,0);ball(arm,.105,.16,.10,skin,s*.055,-.66,.015);arms.push(arm);}
 const head=new THREE.Group();head.position.set(0,2.18,0);body.add(head);head.name='Head';
 ball(head,.12,.18,.12,skin,0,-.34,0);ball(head,.365,.455,.32,skin,0,.03,0);ball(head,.29,.27,.295,skin,.02,-.20,.035);
 for(const s of [-1,1]){ball(head,.087,.12,.074,skin,s*.351,-.015,.005);line3(head,[[s*.378,.04,.071],[s*.399,.055,.06],[s*.4,-.02,.061],[s*.375,-.045,.069]],hair,.009);}
 // The cropped cap and swept fringe follow the reference silhouette.
 let cap=mesh(new THREE.SphereGeometry(1,32,16,0,TAU,0,1.18),hair,head,0,.055,-.015);cap.scale.set(.381,.451,.329);
 ball(head,.083,.24,.25,hair,-.296,.155,-.083);ball(head,.12,.25,.11,hair,0,.14,-.294);
 for(let i=0;i<5;i++){let tuft=mesh(new THREE.ConeGeometry(.087,.25,4),hair,head,-.21+i*.11,.427-i*.017,.14);tuft.rotation.z=-.95;tuft.rotation.x=.7;}
 for(const s of [-1,1]){
  ball(head,.112,.083,.038,white,s*.161,.025,.295);ball(head,.044,.054,.020,iris,s*.161+.03,.023,.331);ball(head,.023,.033,.012,black,s*.161+.037,.021,.347);ball(head,.009,.012,.006,white,s*.161+.045,.037,.356);
  let lid=ball(head,.119,.052,.037,skin,s*.161,.079,.318);lid.rotation.z=-s*.025;
  line3(head,[[s*.161-.10,.056,.337],[s*.161,.051,.35],[s*.161+.10,.057,.327]],black,.01);
  line3(head,[[s*.161-.087,.186,.283],[s*.161-.025,.202,.30],[s*.161+.043,.18,.293]],hair,.011);
 }
 ball(head,.058,.108,.085,skin,.045,-.056,.316);line3(head,[[.024,-.12,.372],[.074,-.139,.368],[.103,-.12,.333]],hair,.008);
 const mouth=line3(head,[[-.16,-.218,.287],[-.08,-.25,.314],[.04,-.26,.327],[.145,-.231,.296]],black,.011);
 const smileCrease=line3(head,[[.123,-.225,.306],[.15,-.249,.292],[.134,-.28,.291]],black,.008);
 for(const s of [-1,1]){let bow=ball(body,.102,.071,.066,black,s*.088,1.575,.235);bow.rotation.z=s*.4;}
 ball(body,.048,.046,.05,black,0,1.575,.257);
 for(let y=1.39;y>.97;y-=.17)ball(body,.019,.019,.015,black,0,y,.219);
 root.userData={body,head,arms,legs,mouth,smileCrease};return enhanceHeroModel(root,'josiah');
}
const subject=makeCharacter();scene.add(subject);
const awakenedJosiahMenu=makeAwakenedMenuJosiah(scene);
const peter=makePeter();scene.add(peter);
const alissa=makeAlissa();scene.add(alissa);let alissaAI={};
const stephen=makeStephen();scene.add(stephen);stephen.visible=false;
const elizabethMenu=makeElizabethSterling();scene.add(elizabethMenu);elizabethMenu.visible=false;
const kevinMenu=makeKevinMurderhorn();scene.add(kevinMenu);kevinMenu.visible=false;
const kevinRevealed=makeRevealedKevin();scene.add(kevinRevealed);kevinRevealed.visible=false;
const garethJonesMenu=makeJonesOrEmma(false),emmaMenu=makeJonesOrEmma(true);scene.add(garethJonesMenu,emmaMenu);garethJonesMenu.visible=emmaMenu.visible=false;
const mariahMenu=makeMariahBanu();scene.add(mariahMenu);mariahMenu.visible=false;

function makeDavidBusters(){
 const root=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group();root.add(body);body.add(head);head.position.y=2.08;
 const skin=mat(0xf1b796),cyan=mat(0x35bddb),edge=mat(0x1583a2),dark=mat(0x080b0d),hair=mat(0x70400c),arms=[],legs=[];
 ball(body,.30,.44,.20,cyan,0,1.19,0);box(body,.52,.23,.36,cyan,0,.88,0);box(body,.18,.65,.045,dark,0,1.21,.201);
 for(const side of [-1,1]){const lapel=box(body,.095,.38,.045,edge,side*.145,1.36,.22);lapel.rotation.z=side*.23;const arm=new THREE.Group();arm.position.set(side*.34,1.48,0);body.add(arm);ball(arm,.105,.34,.12,cyan,0,-.30,0);box(arm,.20,.07,.23,dark,0,-.60,0);ball(arm,.10,.13,.08,skin,0,-.72,.01);arms.push(arm);const leg=new THREE.Group();leg.position.set(side*.14,.81,0);root.add(leg);box(leg,.24,.71,.28,dark,0,-.33,0);ball(leg,.15,.105,.25,dark,0,-.72,.09);legs.push(leg);}
 const tie=box(body,.07,.49,.045,cyan,.025,1.21,.25);tie.rotation.z=.08;ball(body,.055,.07,.027,cyan,0,1.49,.25);box(body,.12,.05,.03,mat(0xe4d8b8),.025,.94,.24);
 ball(head,.30,.38,.27,skin,0,0,0);ball(head,.11,.15,.11,skin,0,-.35,0);ball(head,.32,.22,.285,hair,0,.23,-.03);ball(head,.105,.28,.13,hair,-.25,.09,-.015);
 for(const side of [-1,1]){ball(head,.07,.10,.045,skin,side*.30,-.06,0);ball(head,.08,.042,.027,white,side*.12,.025,.245);ball(head,.035,.035,.016,mat(0x21857d),side*.12,.02,.272);line3(head,[[side*.12-.055,.12,.245],[side*.12,.135,.26],[side*.12+.055,.12,.245]],hair,.014);}
 for(let i=0;i<3;i++){const tuft=ball(head,.085,.13,.05,hair,-.13+i*.10,.23-i*.025,.23);tuft.rotation.z=.65;}
 ball(head,.045,.07,.075,skin,0,-.08,.265);const mouth=line3(head,[[-.10,-.20,.24],[0,-.225,.273],[.10,-.20,.24]],mat(0x864e3a),.012);
 root.userData={body,head,arms,legs,mouth};root.name='BC-13 / David “Diesel” Busters';return root;
}
const davidMenu=makeDavidBusters();scene.add(davidMenu);davidMenu.visible=false;

const damianMenu=makeDamianJuko();scene.add(damianMenu);damianMenu.visible=false;
const chrisMenu=makeChrisPinter();scene.add(chrisMenu);chrisMenu.visible=false;
const gareth=makeGareth(false);scene.add(gareth);let garethQuest='offered';const questCase=new THREE.Group();scene.add(questCase);box(questCase,.65,.42,.18,mat(0x536d96));box(questCase,.24,.10,.06,black,0,.25,0);questCase.visible=false;
let mode='menu',elapsed=0,clock=0,yaw=0,pitch=0,flashOn=true,battery=100,stamina=100,collected=0,muted=false,softScares=false,toastEnd=0;
const keys=new Set();let mapOpen=false,drag=false,dragX=0,viewerAngle=.3,viewerDistance=4.1,interactable=null;
const player=new THREE.Vector3();let ai={};let fuses=[];let world=new THREE.Group();let exhibit=new THREE.Group();scene.add(world,exhibit);
const exhibitKey=new THREE.PointLight(0xf2ce97,55,12,2);exhibitKey.position.set(1.8,3.4,3);exhibit.add(exhibitKey);
const exhibitRim=new THREE.PointLight(0x86beaa,28,11,2);exhibitRim.position.set(-1.8,2.4,-1.8);exhibit.add(exhibitRim);
const exhibitRed=new THREE.PointLight(0xa33920,7,8,2);exhibitRed.position.set(2,1.5,-2);exhibit.add(exhibitRed);
box(exhibit,30,.15,30,mat(0x16241d),0,-.15,0);box(exhibit,18,7,.2,mat(0x1b2921),0,3,-3.8);
for(let x=-8;x<9;x+=2.5){box(exhibit,.08,7,.10,mat(0x344138),x,3,-3.65);box(exhibit,1.4,.06,.03,mat(0x424c40),x,2.8,-3.58);}
mesh(new THREE.CylinderGeometry(.84,.94,.16,48),mat(0x263329),exhibit,0,-.01,0);
const flash=new THREE.SpotLight(0xffe7bd,65,24,.53,.55,1.5);camera.add(flash);flash.position.set(.15,-.13,.05);camera.add(flash.target);flash.target.position.set(0,0,-8);
const captureLight=new THREE.PointLight(0x64ffac,0,5);camera.add(captureLight);
const cameraFill=new THREE.PointLight(0xa2bdac,.7,4);camera.add(cameraFill);
function texture(kind){let c=document.createElement('canvas');c.width=c.height=512;let t=c.getContext('2d');t.scale(2,2);t.fillStyle=kind==='wall'?'#596359':'#303a34';t.fillRect(0,0,256,256);let seed=41;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};for(let i=0;i<13000;i++){let v=rnd()*100;t.fillStyle=`rgba(${v+20},${v+25},${v+18},${rnd()*.18})`;t.fillRect(rnd()*256,rnd()*256,1+rnd()*4,1+rnd()*4)}if(kind==='wall'){t.fillStyle='#252b2d';t.fillRect(0,238,256,18);t.fillStyle='#8b8b7a';t.fillRect(0,234,256,4);for(let i=0;i<15;i++){t.fillStyle='#111b141c';t.fillRect(rnd()*256,0,rnd()*5,256)}}else{t.strokeStyle='#0c1a13';t.lineWidth=3;t.strokeRect(0,0,256,256);t.beginPath();t.moveTo(128,0);t.lineTo(128,256);t.moveTo(0,128);t.lineTo(256,128);t.stroke()}t.setTransform(1,0,0,1,0,0);for(let i=0;i<9000;i++){const shade=Math.floor(rnd()*70+70);t.fillStyle='rgba('+shade+','+shade+','+shade+','+(rnd()*.12)+')';t.fillRect(rnd()*512,rnd()*512,1,1);}let tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.anisotropy=HD_ANISOTROPY;return tx;}
function brentCrossTileTexture(){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;
 const ctx=canvas.getContext('2d'),tile=256;
 let seed=91827;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 // Four large cream stone tiles per repeat; the muted blue-grey band echoes the reference.
 ctx.fillStyle='#d9dbd3';ctx.fillRect(0,0,1024,1024);
 for(let z=0;z<4;z++)for(let x=0;x<4;x++){
  const left=x*tile,top=z*tile,shade=Math.floor(random()*15)-7;
  ctx.fillStyle='rgb('+[225+shade,225+shade,215+shade].join(',')+')';ctx.fillRect(left+3,top+3,tile-6,tile-6);
  const wash=ctx.createLinearGradient(left,top,left+tile,top+tile);
  wash.addColorStop(0,'#ffffff24');wash.addColorStop(.48,'#a9b0ab0c');wash.addColorStop(1,'#6e77710c');
  ctx.fillStyle=wash;ctx.fillRect(left+3,top+3,tile-6,tile-6);
  // Fine marble veins, deterministic and contained inside each slab.
  ctx.save();ctx.beginPath();ctx.rect(left+5,top+5,tile-10,tile-10);ctx.clip();
  for(let line=0;line<9;line++){
   const y=top+22+random()*220,slope=(random()-.5)*42;
   ctx.beginPath();ctx.moveTo(left-15,y);ctx.bezierCurveTo(left+56,y+slope*.35,left+88,y-slope*.25,left+tile*.52,y+slope*.15);
   ctx.bezierCurveTo(left+177,y+slope*.65,left+206,y-slope*.2,left+tile+15,y+slope);
   ctx.strokeStyle=line%3===0?'#68716c20':'#858e8919';ctx.lineWidth=line%3===0?1.4:.7;ctx.stroke();
   if(line%3===0){ctx.beginPath();ctx.moveTo(left+110,y+slope*.1);ctx.quadraticCurveTo(left+137,y+slope*.1+10,left+155,y+slope*.5+17);ctx.stroke();}
  }
  for(let grain=0;grain<320;grain++){
   const value=random()>.5?255:94;ctx.fillStyle='rgba('+value+','+value+','+value+','+(random()*.055)+')';
   ctx.fillRect(left+random()*tile,top+random()*tile,1+random()*2,1+random()*2);
  }
  ctx.restore();
  ctx.fillStyle='#a6aaa538';ctx.fillRect(left,top,tile,3);ctx.fillRect(left,top,3,tile);
 }
 ctx.fillStyle='#667b8580';ctx.fillRect(0,248,1024,18);
 ctx.fillStyle='#b4bdc17a';ctx.fillRect(0,248,1024,3);
 ctx.fillStyle='#455e6859';ctx.fillRect(0,263,1024,2);
 const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
 map.wrapS=map.wrapT=THREE.RepeatWrapping;map.anisotropy=HD_ANISOTROPY;
 return map;
}
const wallMat=new THREE.MeshStandardMaterial({map:texture('wall'),roughness:.95});
const floorTex=brentCrossTileTexture();floorTex.repeat.set(N/4,N/4);
const floorMat=new THREE.MeshStandardMaterial({map:floorTex,color:0xffffff,roughness:.42,metalness:.02});
function sign(text,color='#cbceac',bg='#14271e',w=1.35){const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.scale(2,2);ctx.fillStyle=bg;ctx.fillRect(0,0,512,128);ctx.strokeStyle=color;ctx.lineWidth=4;ctx.strokeRect(6,6,500,116);ctx.fillStyle=color;ctx.font='bold 38px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,64);let tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;tx.anisotropy=HD_ANISOTROPY;return new THREE.Mesh(new THREE.PlaneGeometry(w,w/4),new THREE.MeshBasicMaterial({map:tx}));}
let currentFloor=0,upperWorld=null;
const liftCells=[{x:40,z:57},{x:40,z:17}];
function buildSecondFloor(){
 upperWorld=new THREE.Group();scene.add(upperWorld);upperWorld.visible=false;
 const upperFloorTex=brentCrossTileTexture();upperFloorTex.repeat.set(N/4,68/4);
  const concrete=mat(0x313b40),interiorStone=brentCrossWallMaterial(),floor=new THREE.MeshStandardMaterial({map:upperFloorTex,color:0xffffff,roughness:.42,metalness:.02}),ceiling=brentCrossCeilingMaterial(N*CELL,68*CELL);
 box(upperWorld,N*CELL,.2,68*CELL,floor,40*CELL,-.15,33.5*CELL);
 box(upperWorld,N*CELL,.2,68*CELL,ceiling,40*CELL,5,33.5*CELL);
 for(let z=0;z<=68;z++)for(let x=0;x<N;x++){
  const wall=grid[z]?.[x]!==0||z===68;
   if(wall&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>grid[z+dz]?.[x+dx]===0)){const inside=x>0&&x<N-1&&z>0&&z<68;box(upperWorld,CELL,5,CELL,inside?interiorStone:concrete,x*CELL,2.4,z*CELL);}
 }
 for(const z of [17,37,57])for(const x of [15,40,65]){const label=sign('LEVEL 1 / '+(z===17?'NORTH':z===57?'SOUTH':'GALLERY'),'#90b6c5','#101b25',5);label.position.set(x*CELL,3,z*CELL);upperWorld.add(label);}
 const coords=[[6,7],[74,8],[7,64],[74,64],[15,27],[65,27],[15,47],[65,47]];
 // Reuse the relay design, but give every circuit independent controls/materials.
 const sample=fuses[0];for(let level=0;level<2;level++)for(let i=0;i<8;i++){
  if(level===0&&i<4){fuses[i].level=0;continue;}
  const [x,z]=coords[i],group=sample.group.clone(true);group.position.copy(pos(x,z));
  group.traverse(o=>{if(o.material)o.material=o.material.clone();});
  const lamp=group.children[sample.group.children.indexOf(sample.lamp)],lever=group.children[sample.group.children.indexOf(sample.lever)],light=group.children[sample.group.children.indexOf(sample.light)];
  const oldLabel=group.children.find(o=>o.geometry?.type==='PlaneGeometry');if(oldLabel)group.remove(oldLabel);
  const label=sign('RELAY '+String(level*8+i+1).padStart(2,'0'),'#d9bd77');label.position.set(0,2.2,.21);group.add(label);
  (level?upperWorld:world).add(group);fuses.push({x,z,level,zone:'LEVEL '+level,group,light,lamp,lever,active:false});
 }
 for(const parent of [world,upperWorld])for(const l of liftCells){
  const lift=new THREE.Group();lift.position.copy(pos(l.x,l.z));parent.add(lift);
  box(lift,2.5,.08,2.5,mat(0x697a83),0,-.02,0);const label=sign('E / SERVICE LIFT','#9bd9ff','#152532',3.2);label.position.set(0,2.7,0);lift.add(label);
 }
}
function resetFloors(){currentFloor=0;player.level=0;for(const a of [subject,peter,alissa,gareth]){a.position.level=0;a.userData.floorPath=[];}upperWorld.visible=false;}
function useFloorLift(){
 currentFloor=1-currentFloor;player.level=currentFloor;world.visible=currentFloor===0;upperWorld.visible=currentFloor===1;
 questCase.visible=currentFloor===0&&garethQuest==='accepted';hideCombatBars();hideJosiahDuel();
 for(const clips of [josiahClips,peterClips,garethClips])clips.forEach(a=>a.pause());
 toast(currentFloor?'LEVEL 1 / UPPER SHOPPING GALLERIES':'GROUND FLOOR / BRENT CROSS',5);syncFloorActors();
}
function syncFloorActors(){for(const a of [subject,peter,alissa,gareth])a.visible=(a.position.level||0)===currentFloor&&!hunterGone(a);}
function updateFloorTravel(dt){
 for(const a of [subject,peter,alissa]){
  a.userData.floorTravelling=false;
  if((a.position.level||0)===currentFloor||hunterGone(a)||elapsed<20||a===alissa&&!alissaAI.allied)continue;
  a.userData.floorTravelling=true;
  const lift=liftCells.reduce((best,l)=>a.position.distanceTo(pos(l.x,l.z))<a.position.distanceTo(pos(best.x,best.z))?l:best);
  if(a.position.distanceTo(pos(lift.x,lift.z))<1){a.position.level=currentFloor;a.userData.floorPath=[];a.userData.floorTravelling=false;continue;}
  let path=a.userData.floorPath;if(!path?.length){path=route(cell(a.position),lift);a.userData.floorPath=path;}
  if(path.length){const v=pos(path[0].x,path[0].z).sub(a.position),d=v.length();if(d<.05)path.shift();else{v.multiplyScalar(Math.min(d,4*relaySpeedMultiplier()*dt)/d);if(walkable(a.position.x+v.x,a.position.z+v.z,.2)){a.position.add(v);a.rotation.y=Math.atan2(v.x,v.z);}else a.userData.floorPath=[];}}
 }
 syncFloorActors();
}

buildWorld();buildSecondFloor();
let audioCtx=null,master=null,drone=null;
const menuSong=new Audio('assets/audio/clip-bea1f0228ed0.mp3');
menuSong.loop=true;menuSong.preload='auto';menuSong.volume=.65;
const postChapterThreeMenuSong=new Audio("assets/audio/clip-d3dee08d1161.mp3");
postChapterThreeMenuSong.loop=true;postChapterThreeMenuSong.preload='auto';postChapterThreeMenuSong.volume=.65;
const postTubeMenuSong=new Audio('assets/audio/clip-314c20dbd5ec.mp3');
postTubeMenuSong.loop=true;postTubeMenuSong.preload='auto';postTubeMenuSong.volume=.65;
const josiahGoneSong=new Audio("assets/audio/clip-dc5a538d0524.mp3");josiahGoneSong.loop=true;josiahGoneSong.preload='auto';josiahGoneSong.volume=.55;
function selectedMenuTheme(){if(isKevinStoryRoute()&&gameProgress.tubeCompleted===true)return MURDERHORN_ROUTE_THEME;if(gameProgress.universalRestorationCompleted===true)return postChapterThreeMenuSong;if(gameProgress.kevinSolarAftermath===true)return IRON_DRIFT_MENU_THEME;if(gameProgress.laniakeaCompleted===true)return josiahGoneSong;if(gameProgress.laniakeaAftermath===true)return LANIAKEA_MENU_THEME;if(gameProgress.secretaryDeadCompleted===true)return josiahGoneSong;if(gameProgress.kevinRouteStarted===true&&gameProgress.garethQuestCompleted===false&&gameProgress.tubeCompleted===true)return MURDERHORN_ROUTE_THEME;if(gameProgress.brentCrossCompleted===true&&gameProgress.garethQuestCompleted===false&&gameProgress.tubeCompleted===true)return postTubeMenuSong;return gameProgress.garethQuestCompleted===true&&gameProgress.civilDisobedienceSurvived===true?postChapterThreeMenuSong:menuSong;}
function syncMenuSong(){
 const solarConversation=mode==='solarNegotiation';const breakdown=mode==='rooms'&&corneredRooms?.finale?.phase==='breakdown',ending=mode==='resistanceCredits';const active=solarConversation?IRON_DRIFT_MENU_THEME:mode==='beforeStoryShibuya'&&beforeStoryScene?.shibuya?.cosmic&&typeof BEFORE_STORY_SAGITTARIUS_THEME!=='undefined'?BEFORE_STORY_SAGITTARIUS_THEME:mode==='beforeStoryUnionFight'&&!beforeStoryScene?.unionCrown?.successor&&typeof BEFORE_STORY_UNION_BOSS_THEME!=='undefined'?BEFORE_STORY_UNION_BOSS_THEME:mode==='beforeStoryOsaka'&&typeof BEFORE_STORY_OSAKA_THEME!=='undefined'?BEFORE_STORY_OSAKA_THEME:mode==='beforeStoryMenu'?(typeof selectedBeforeStoryTheme==='function'?selectedBeforeStoryTheme():menuSong):mode==='undeadMenu'&&typeof UNDEAD_MENU_THEME!=='undefined'?UNDEAD_MENU_THEME:breakdown||ending?josiahGoneSong:selectedMenuTheme(),inMenu=(mode==='beforeStoryShibuya'&&beforeStoryScene?.shibuya?.cosmic&&beforeStoryScene.shibuya.phase==='fight'&&!beforeStoryScene.shibuya.paused&&!beforeStoryScene.shibuya.ended)||(mode==='beforeStoryUnionFight'&&!beforeStoryScene?.unionCrown?.successor&&!beforeStoryScene?.unionCrown?.paused&&!beforeStoryScene?.unionCrown?.ended)||(mode==='beforeStoryOsaka'&&!beforeStoryScene?.osaka?.paused)||mode==='beforeStoryMenu'||mode==='undeadMenu'||mode==='menu'||solarConversation||mode==='viewer'||mode==='kevin5'||(mode==='finalCurtain'&&finalCurtain?.phase==='outro')||(mode==='finalWar'&&finalWar?.kevinSiegeRoute&&(finalWar.kevinSiegeEnding||!finalWar.paused&&!finalWar.ended))||breakdown||ending||(mode==='primePeaceOutro'&&gameProgress.universalRestorationCompleted===true);josiahGoneSong.volume=breakdown?.22:.55;
 for(const track of [menuSong,postChapterThreeMenuSong,postTubeMenuSong,josiahGoneSong,LANIAKEA_MENU_THEME,IRON_DRIFT_MENU_THEME,MURDERHORN_ROUTE_THEME,...(typeof UNDEAD_MENU_THEME==='undefined'?[]:[UNDEAD_MENU_THEME]),...(typeof BEFORE_STORY_OSAKA_THEME==='undefined'?[]:[BEFORE_STORY_OSAKA_THEME]),...(typeof BEFORE_STORY_JOSIAH_SECOND_THEME==='undefined'?[]:[BEFORE_STORY_JOSIAH_SECOND_THEME]),...(typeof BEFORE_STORY_KEVIN_END_THEME==='undefined'?[]:[BEFORE_STORY_KEVIN_END_THEME]),...(typeof BEFORE_STORY_UNION_BOSS_THEME==='undefined'?[]:[BEFORE_STORY_UNION_BOSS_THEME]),...(typeof BEFORE_STORY_SAGITTARIUS_THEME==='undefined'?[]:[BEFORE_STORY_SAGITTARIUS_THEME])]){track.muted=muted;if(inMenu&&track===active){if(!muted&&track.paused)track.play().catch(()=>{});}else{track.pause();if(!((mode==='beforeStoryShibuya'&&beforeStoryScene?.shibuya?.cosmic&&!beforeStoryScene.shibuya.ended&&typeof BEFORE_STORY_SAGITTARIUS_THEME!=='undefined'&&track===BEFORE_STORY_SAGITTARIUS_THEME)||(mode==='beforeStoryOsaka'&&typeof BEFORE_STORY_OSAKA_THEME!=='undefined'&&track===BEFORE_STORY_OSAKA_THEME)||(mode==='beforeStoryUnionFight'&&!beforeStoryScene?.unionCrown?.successor&&!beforeStoryScene?.unionCrown?.ended&&typeof BEFORE_STORY_UNION_BOSS_THEME!=='undefined'&&track===BEFORE_STORY_UNION_BOSS_THEME)))track.currentTime=0;}}
}
// Retry after a user gesture when the browser blocks initial autoplay.
document.addEventListener('pointerdown',syncMenuSong);
document.addEventListener('keydown',syncMenuSong);
const josiahClips=["assets/audio/clip-4820a9a73df7.mp3","assets/audio/clip-96b1a27d003e.mp3","assets/audio/clip-7115e2e2f191.mp3","assets/audio/clip-fab8821feabe.mp3","assets/audio/clip-d49d3be455ce.mp3"].map(src=>{const a=new Audio(src);a.preload='auto';return a;});
let josiahVoice;
function resetJosiahVoice(){
 josiahClips.forEach(a=>{a.pause();a.currentTime=0;});
 josiahVoice={met:false,flee:0,away:0,escaped:false,returnPending:false,final:false,active:-1,cooldown:0,fleeTime:0,lastX:null,lastZ:null};
 
}
function syncJosiahVoice(visible=false){
 josiahClips.forEach(a=>a.muted=muted);
 const a=josiahClips[josiahVoice.active];
 if(a){
  if(mode==='play'&&visible&&!voiceIsPlaying(peterClips)&&!voiceIsPlaying(garethClips)){if(a.paused&&!a.ended)a.play().catch(()=>{});}
  else a.pause();
 }
 
}
function playJosiahVoice(index){
 josiahVoice.active=index;
 const a=josiahClips[index];a.currentTime=0;a.muted=muted;
 a.play().catch(()=>{});
 
}
function updateJosiahVoice(dt,canSee,noticed){
 const v=josiahVoice;
 // Use Josiah's existing unobstructed sight test; hearing alone never triggers speech.
 const visible=canSee&&elapsed>20&&!hunterGone(subject);
 const dx=v.lastX===null?0:player.x-v.lastX,dz=v.lastZ===null?0:player.z-v.lastZ;
 const fleeing=visible&&ai.chase>0&&(dx*(player.x-subject.position.x)+dz*(player.z-subject.position.z))>dt*.4;
 v.lastX=player.x;v.lastZ=player.z;
 v.cooldown=Math.max(0,v.cooldown-dt);
 if(v.met){if(!visible){v.away+=dt;if(v.away>=7)v.escaped=true;}else{if(v.escaped){v.returnPending=true;v.escaped=false;}v.away=0;}}
 v.fleeTime=fleeing?v.fleeTime+dt:0;
 if(v.active>=0&&josiahClips[v.active].ended){v.active=-1;v.cooldown=2;}
 syncJosiahVoice(visible);
 if(!visible||v.active>=0||v.cooldown>0||voiceIsPlaying(peterClips)||voiceIsPlaying(garethClips))return;
 if(!v.met&&(noticed||ai.chase>0)){v.met=true;playJosiahVoice(0);return;}
 if(!v.met)return;
 if(collected===16&&!v.final){v.final=true;playJosiahVoice(4);return;}
 if(v.returnPending){v.returnPending=false;playJosiahVoice(3);return;}
 if(v.fleeTime>=.6&&v.flee<2){playJosiahVoice(1+v.flee);v.flee++;v.fleeTime=0;}
}
resetJosiahVoice();

const peterClips=["assets/audio/clip-0c5debe9a882.mp3","assets/audio/clip-008b215abb78.mp3","assets/audio/clip-1a22ea2a95cd.mp3","assets/audio/clip-c2e35570be22.mp3"].map(src=>{const a=new Audio(src);a.preload='auto';return a;});
let peterVoice;
function resetPeterVoice(){
 peterClips.forEach(a=>{a.pause();a.currentTime=0;});
 peterVoice={met:false,flee:0,away:0,escaped:false,returnPending:false,final:false,active:-1,cooldown:0,fleeTime:0,lastX:null,lastZ:null};
 
}
function syncPeterVoice(visible=false){
 peterClips.forEach(a=>a.muted=muted);
 const a=peterClips[peterVoice.active];
 if(a){
  if(mode==='play'&&visible&&!voiceIsPlaying(josiahClips)&&!voiceIsPlaying(garethClips)){if(a.paused&&!a.ended)a.play().catch(()=>{});}
  else a.pause();
 }
 
}
function playPeterVoice(index){
 peterVoice.active=index;
 const a=peterClips[index];a.currentTime=0;a.muted=muted;
 a.play().catch(()=>{});
 
}
function updatePeterVoice(dt,canSee,noticed){
 const v=peterVoice;
 // Use Peter's existing unobstructed sight test; hearing alone never triggers speech.
 const visible=canSee&&elapsed>20&&!hunterGone(peter);
 const dx=v.lastX===null?0:player.x-v.lastX,dz=v.lastZ===null?0:player.z-v.lastZ;
 const fleeing=visible&&(peterAI.independent?peterAI.chase:ai.chase)>0&&(dx*(player.x-peter.position.x)+dz*(player.z-peter.position.z))>dt*.4;
 v.lastX=player.x;v.lastZ=player.z;
 v.cooldown=Math.max(0,v.cooldown-dt);
 if(v.met){if(!visible){v.away+=dt;if(v.away>=7)v.escaped=true;}else{if(v.escaped){v.returnPending=true;v.escaped=false;}v.away=0;}}
 v.fleeTime=fleeing?v.fleeTime+dt:0;
 if(v.active>=0&&peterClips[v.active].ended){v.active=-1;v.cooldown=2;}
 syncPeterVoice(visible);
 if(!visible||v.active>=0||v.cooldown>0||voiceIsPlaying(josiahClips)||voiceIsPlaying(garethClips))return;
 if(!v.met&&(noticed||(peterAI.independent?peterAI.chase:ai.chase)>0)){v.met=true;playPeterVoice(0);return;}
 if(!v.met)return;
 if(v.returnPending){v.returnPending=false;playPeterVoice(3);return;}
 if(v.fleeTime>=.6&&v.flee<2){playPeterVoice(1+v.flee);v.flee++;v.fleeTime=0;}
}
resetPeterVoice();

function voiceIsPlaying(clips){return clips.some(a=>!a.paused&&!a.ended);}
function initAudio(){if(audioCtx){audioCtx.resume();return;}try{audioCtx=new (window.AudioContext||window.webkitAudioContext)();master=audioCtx.createGain();master.gain.value=(muted?0:.22)*AudioOptions.levels.sound*AudioOptions.levels.sfx;master.connect(audioCtx.destination);for(let f of [42,63,84.3]){let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.value=f;g.gain.value=.13;o.connect(g);g.connect(master);o.start();}audioCtx.resume();}catch(e){}}
function tone(f,duration=.15,volume=.3,type='sine',end=0){if(!audioCtx||muted)return;let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.setValueAtTime(f,audioCtx.currentTime);if(end)o.frequency.exponentialRampToValueAtTime(end,audioCtx.currentTime+duration);g.gain.setValueAtTime(volume,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+duration);o.connect(g);g.connect(master);o.start();o.stop(audioCtx.currentTime+duration);}
function toast(message,time=4){$('toast').textContent=message;toastEnd=elapsed+time;$('toast').style.opacity=1;}
function setMode(m){if(!scene.fog)scene.fog=new THREE.FogExp2(0x080e0c,.052);if(m!=='rescue')clearGarethRescueKneel();if(alissa.userData.anarchistMask)alissa.userData.anarchistMask.visible=false;subject.rotation.z=0;subject.position.y=0;$('nextChapterPending').hidden=true;poseJosiahGrieving(subject,false);setSternJosiah(subject,false);updateJosiahMenuInjury(false);updateJosiahUntouchable(false);closeChapterPicker(false);if(upperWorld)upperWorld.visible=['play','paused','lost','won'].includes(m)&&currentFloor===1;if(m!=='paused')$('garethQuestPanel').hidden=true;questCase.visible=m==='play'&&garethQuest==='accepted';if(m!=='play')hideCombatBars();if(m!=='play')hideAlissaQTE();if(m!=='scare')clearChainCapture();mode=m;updateGarethResistanceOutfit();syncGarethVoice();syncMenuSong();syncJosiahVoice();syncPeterVoice();syncActors();captureLight.intensity=0;for(const id of ['menu','hud','pause','end','viewer','intro','fictionCard'])$(id).hidden=true;$('mapWrap').hidden=true;mapOpen=false;keys.clear();if(m==='intro')$('intro').hidden=false;if(m==='menu')$('menu').hidden=false;if(m==='viewer')$('viewer').hidden=false;if(m==='play')$('hud').hidden=false;if(m==='paused'){$('hud').hidden=false;$('pause').hidden=false;}if(m==='lost'||m==='won')$('end').hidden=false;world.visible=['play','paused','lost','won','scare'].includes(m)&&currentFloor===0;exhibit.visible=!['play','paused','lost','won','scare'].includes(m);flash.visible=!exhibit.visible;ambient.intensity=world.visible?.82:1.05;scene.fog.density=world.visible?.0065:.052;}
function requestLock(){if(window.mobileTouchActive||document.pointerLockElement===$('world'))return;try{let p=$('world').requestPointerLock();if(p?.catch)p.catch(()=>{});}catch(e){}}
function initializePlayerView(){
 camera.position.copy(player);camera.position.y=1.65;
 camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);camera.updateMatrixWorld(true);
 flash.visible=true;flash.intensity=52;cameraFill.intensity=.22;captureLight.intensity=0;
 updateMall(0);
}
function startGameplay(){resetFloors();resetHunterMotion(subject);resetHunterMotion(peter);resetJosiahVoice();resetPeterVoice();elapsed=0;collected=0;battery=100;stamina=100;flashOn=true;player.copy(pos(spawnCell.x,spawnCell.z));yaw=-.12;pitch=.10;for(let f of fuses){f.active=false;f.lamp.material.color.setHex(0xe7b563);f.lamp.material.emissive.setHex(0xe7b563);f.light.color.setHex(0xeab468);f.lever.rotation.z=.5;}subject.position.copy(pos(40,32));subject.rotation.set(0,0,0);subject.scale.setScalar(1);ai={chase:0,repath:0,path:[],target:{x:65,z:37},seen:false};resetPeter();resetAlissa();resetGareth();$('peterStatus').textContent='PETER / ESCORTING JOSIAH';$('relays').textContent='0 / 16 RELAYS ONLINE';$('objective').textContent='RESTORE THE POWER';$('danger').style.opacity=0;setMode('play');initializePlayerView();initAudio();requestLock();toast('BRENT CROSS. Enter the shopping centre. Restore 16 relays across both floors. Red = Josiah. Dark red = Peter. Yellow = Alissa.  [TAB] MAP',8);}
function menu(){
 if(!scene.fog)scene.fog=new THREE.FogExp2(0x080e0c,.052);
 clearAtriumScene();clearCabinetScene();clearStephenRescue();
 if(typeof clearGarethPrologue==='function')clearGarethPrologue();
 if(!scene.fog)scene.fog=new THREE.FogExp2(0x080e0c,.052);
 if(typeof clearBeforeStoryMenu==='function')clearBeforeStoryMenu(); if(typeof clearUndeadMode==='function')clearUndeadMode();clearChapterRedOpening();clearRedRooms();clearUxbridgeChase();clearUxbridge();clearFinalCurtainBattle();clearFinalCurtain();clearPindar();if(typeof closeEncyclopedia==='function')closeEncyclopedia(false);if($('factionsPanel')){$('factionsPanel').hidden=true;$('menu').inert=false;}clearFreeRoam();clearSpaceBoss();if(!scene.fog)scene.fog=new THREE.FogExp2(0x080e0c,.052);$('chapterLoading').hidden=true;clearTyrantFour();clearTubeMission();clearKevinTubeEnding();clearBusters();clearFinalWar();clearSecretaryOpening();clearCorneredRooms();clearCorneredIntro();clearParliamentCamp();clearCivilScene();stopGunshots();if(carChase)clearCarChase();if(bossBattle)clearBossBattle();resetHunterMotion(subject);resetHunterMotion(peter);document.exitPointerLock?.();setMode('menu');subject.position.set(0,0,0);subject.scale.setScalar(1);subject.rotation.set(0,.3,0);subject.userData.head.rotation.set(0,0,0);resetPeterPose();if(gameProgress.kevinSolarAftermath===true)selectedSubject=6;selectSubject(selectedSubject);refreshLaniakeaAftermathMenu();}
function pause(){if(mode!=='play')return;setMode('paused');document.exitPointerLock?.();}
function resume(){setMode('play');requestLock();}
let chapterLoadingBypass=false;
function loadChapterScreen(title,begin){
 if(chapterLoadingBypass)return begin();
 keys.clear();drag=false;document.exitPointerLock?.();
 mode='chapterLoading';$('chapterLoadingName').textContent=title;$('chapterLoading').hidden=false;
 setTimeout(()=>{
  if(mode!=='chapterLoading')return;
  chapterLoadingBypass=true;
  try{begin();}finally{chapterLoadingBypass=false;$('chapterLoading').hidden=false;requestAnimationFrame(()=>$('chapterLoading').hidden=true);}
 },850);
}
function continueCompletedChapter(chapter){
 keys.clear();document.exitPointerLock?.();refreshProgressUI();
 if(chapter===1){startCabinet();return;}
 if(chapter===2&&canOpenTube()){startTubeMission(true);return;}
 if(chapter===2&&canOpenCivil()){startCivilDisobedience();return;}
 if(chapter===3&&canOpenTyrantFour()){startTyrantFour('square',true);return;}
 if(chapter===3&&canOpenCorneredRat()){startCorneredRat();return;}
 if(chapter===4&&canOpenFinalWar()){startSecretaryOpening();return;}
 // Preserve the completed route when its next chapter has not been built yet.
 clearCarChase();clearBossBattle();clearParliamentCamp();clearCivilScene();clearCorneredRooms();clearCorneredIntro();setMode('chapterComingSoon');world.visible=upperWorld.visible=exhibit.visible=false;
 $('nextChapterTitle').textContent=chapter===2?'TUBE':chapterFiveTitle();$('nextChapterMessage').textContent='Previous chapter completed. Your progress is saved. This chapter is coming soon.';$('nextChapterPending').hidden=false;
}
function endGame(won){if(won){recordBrentCrossCompletion();queueMicrotask(()=>continueCompletedChapter(1));return;}setMode(won?'won':'lost');document.exitPointerLock?.();$('endLabel').textContent=won?'CONTAINMENT RESTORED / YOU SURVIVED':(captureSubject===peter?'CONTACT LOST / SUBJECT BC-02 / PETER CHAMBERS':'CONTACT LOST / SUBJECT BC-01 / JOSIAH RICHARDS');$('endTitle').textContent=won?'You made it out.':captureSubject===peter?'Peter found you.':'Josiah found you.';$('endText').textContent=won?`All sixteen relays restored. Escape time: ${formatTime(elapsed)}. Somewhere below, both subjects are still waiting.`:`${collected} of 16 relays restored. Break his line of sight, use connecting corridors, and save stamina for the chase.`;$('retry').firstChild.textContent=won?'PLAY AGAIN ':'TRY AGAIN ';tone(won?390:55,1,.5,'sine',won?780:25);}
let scareTime=0;
function caught(who=subject){if(mode!=='play')return;captureSubject=who;if(softScares){endGame(false);return;}resetHunterMotion(who);who.userData.head.rotation.set(0,0,0);who.rotation.x=0;who.rotation.z=0;setMode('scare');alissa.visible=false;gareth.visible=false;questCase.visible=false;world.visible=false;subject.visible=who===subject;peter.visible=who===peter;document.exitPointerLock?.();scareTime=0;renderCapture(0);if(who===peter){peter.userData.mouth.visible=false;peter.userData.openMouth.visible=true;peter.userData.eyeMats.forEach(m=>{m.emissive.setHex(0x26b85c);m.emissiveIntensity=.6;});tone(65,.75,.55,'triangle',210);tone(520,.38,.35,'square',90);}else{tone(130,.8,.6,'sawtooth',32);tone(930,.35,.4,'triangle',120);}}
function interact(){if(mode!=='play'||!interactable)return;if(interactable==='lift'){useFloorLift();return;}if(interactable==='gareth'){talkGareth();return;}if(interactable==='briefcase'){garethQuest='retrieved';questCase.visible=false;$('questTracker').textContent='OPTIONAL / RETURN THE BRIEFCASE TO GARETH';toast('Briefcase collected. Return to Gareth at the entrance.',4);return;}if(interactable==='exit'){if(collected===16)endGame(true);else toast(`The exit has no power. ${16-collected} relays still offline.`);return;}let f=interactable;if(f.active)return;f.active=true;f.lamp.material.color.setHex(0x84e0a3);f.lamp.material.emissive.setHex(0x84e0a3);f.light.color.setHex(0x84e0a3);f.lever.rotation.z=-.5;collected++;syncAlissaAlliance();$('relays').textContent=`${collected} / 16 RELAYS ONLINE`;tone(330,.25,.6);setTimeout(()=>tone(660,.4,.5),120);if(collected===16){$('objective').textContent='RETURN TO THE EXIT';toast('Power restored. Get back to the south evacuation gate.',6);}else toast(`Relay restored. ${16-collected} remaining. He heard that.`,4);ai.chase=Math.max(ai.chase,12);ai.lastKnown=cell(player);ai.repath=0;peterAI.chase=Math.max(peterAI.chase,12);peterAI.lastKnown=cell(player);peterAI.repath=0;if(collected===1)releasePeter();}
function formatTime(t){return `${Math.floor(t/60).toString().padStart(2,'0')}:${Math.floor(t%60).toString().padStart(2,'0')}`;}
let stepClock=0,heartbeat=0;
function relaySpeedMultiplier(){return 1+Math.min(collected,16)*.0275+(collected>=16?.12:0);}
function update(dt){elapsed+=dt;updateFloorTravel(dt);updateGareth(dt);const crouch=keys.has('KeyC'),moving=keys.has('KeyW')||keys.has('KeyS')||keys.has('KeyA')||keys.has('KeyD')||keys.has('ArrowUp')||keys.has('ArrowDown');let sprint=keys.has('ShiftLeft')&&stamina>1&&moving&&!crouch;
 if(keys.has('ArrowLeft'))yaw+=dt*1.8;if(keys.has('ArrowRight'))yaw-=dt*1.8;
 let forward=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0),side=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0);let len=Math.hypot(forward,side)||1,speed=crouch?2.2:sprint?7.2:4.3;speed*=garethQuest==='returned'?1.75:1;
 let dx=(-Math.sin(yaw)*forward+Math.cos(yaw)*side)/len*speed*dt,dz=(-Math.cos(yaw)*forward-Math.sin(yaw)*side)/len*speed*dt;
 if((currentFloor===0||player.z<67*CELL)&&walkable(player.x+dx,player.z))player.x+=dx;if((currentFloor===0||player.z+dz<67*CELL)&&walkable(player.x,player.z+dz))player.z+=dz;
 stamina=THREE.MathUtils.clamp(stamina+(sprint?-16:20)*dt,0,100);battery=THREE.MathUtils.clamp(battery+(flashOn?-.65:6)*dt,0,100);if(battery===0&&flashOn){flashOn=false;toast('Flashlight empty. Let it recharge.');}
 flash.intensity=flashOn?52*(battery<15?.6+Math.sin(elapsed*35)*.15:1):0;cameraFill.intensity=flashOn?.22:.05;
 camera.position.copy(player);camera.position.y=crouch?1.04:1.65;camera.position.y+=moving?Math.sin(elapsed*(sprint?14:9))*.025:0;camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);
 if(moving){stepClock+=dt;if(stepClock>(sprint?.30:crouch?.8:.48)){tone(75+random()*30,.11,crouch?.08:sprint?.38:.2,'triangle',35);stepClock=0;}}
 updateAlissa(dt);if(mode!=='play')return;
 const sensed=senseHunter(subject,ai,dt,sprint,crouch),distance=sensed.distance,canSee=sensed.visible,noticed=sensed.noticed;
 
 updateJosiahVoice(dt,canSee,noticed);
 if(elapsed>20&&!hunterGone(subject)&&!subject.userData.fighting&&!subject.userData.floorTravelling){const leaping=updateHunterLeap(subject,ai,dt,canSee);if(mode!=='play')return;ai.repath-=dt;if(ai.repath<=0){if(ai.chase>0)ai.target=ai.lastKnown||cell(subject.position);else if(!ai.path.length){const points=patrolPoints;ai.target=points[Math.floor(random()*points.length)];}let anchor=ai.path[0]||cell(subject.position);ai.path=route(anchor,ai.target);if(subject.position.distanceTo(pos(anchor.x,anchor.z))>.08)ai.path.unshift(anchor);ai.repath=.55;}
  if(!leaping&&ai.path.length){let target=pos(ai.path[0].x,ai.path[0].z);let dir=target.sub(subject.position),d=dir.length(),v=(ai.chase>0?4.65:3.2)*relaySpeedMultiplier()*dt;if(d<v){subject.position.add(dir);ai.path.shift();}else{dir.multiplyScalar(v/d);if(walkable(subject.position.x+dir.x,subject.position.z+dir.z,.2))subject.position.add(dir);else ai.repath=0;}if(d>.03)subject.rotation.y=Math.atan2(dir.x,dir.z);}
  if(distance<.83&&canSee){caught();return;}
 }
 updatePeter(dt,sprint,crouch);if(mode!=='play')return;
 const peterDistance=peter.position.distanceTo(player),peterVisible=!hunterGone(peter)&&peterDistance<60&&sight(peter.position,player);
 updatePeterVoice(dt,peterVisible,peterVisible&&peterDistance<(flashOn?56:crouch?20:38));let walking=ai.path.length>0&&elapsed>20;if(!subject.userData.fighting)animateCharacter(elapsed,walking,ai.chase>0);let danger=THREE.MathUtils.clamp((11-distance)/10,0,.85)*(ai.chase>0?1:.1);$('danger').style.opacity=Math.max(danger,peterAI.chase>0?THREE.MathUtils.clamp((11-peter.position.distanceTo(player))/10,0,.85):0);
 $('alert').textContent=peterAI.chase>0?'PETER IS LOOKING FOR YOU':ai.chase>0?'JOSIAH IS LOOKING FOR YOU':crouch?'KEEP QUIET':flashOn?'SIGNAL UNSTABLE':'LIGHT OFF / RECHARGING';$('alert').style.color=ai.chase>0?'#e6a185':'#a5b49c';if(ai.chase>0){heartbeat+=dt;if(heartbeat>Math.max(.32,distance*.055)){tone(49,.18,.5);heartbeat=0;}}
 interactable=null;let prompt='';for(let f of fuses)if(f.level===currentFloor&&!f.active&&f.group.position.distanceTo(player)<2.05){interactable=f;prompt='[ E ]  RESTORE RELAY';break;}
 if(currentFloor===0&&player.distanceTo(pos(exitCell.x,exitCell.z))<2.6){interactable='exit';prompt=collected===16?'[ E ]  LEAVE BRENT CROSS':'[ E ]  EXIT — POWER REQUIRED';}
 if(currentFloor===0&&player.distanceTo(gareth.position)<2.8){interactable='gareth';prompt=gareth.userData.patrol?.pending?'[ E ] COLLECT GARETH’S SUPPLIES':garethQuest==='returned'?'[ E ] TALK TO GARETH':'[ E ] TALK TO GARETH / OPTIONAL MISSION';}else if(currentFloor===0&&garethQuest==='accepted'&&player.distanceTo(questCase.position)<2.5){interactable='briefcase';prompt='[ E ] COLLECT GARETH’S BRIEFCASE';}
 if(!interactable&&liftCells.some(l=>player.distanceTo(pos(l.x,l.z))<2.8)){interactable='lift';prompt=currentFloor?'[ E ] LIFT TO GROUND FLOOR':'[ E ] LIFT TO UPPER FLOOR';}
 $('prompt').style.display=prompt?'block':'none';$('prompt').textContent=prompt;$('battery').style.width=battery+'%';$('batteryText').textContent=Math.ceil(battery)+'%';$('stamina').style.width=stamina+'%';$('timer').textContent=formatTime(elapsed);if(elapsed>toastEnd)$('toast').style.opacity=0;updateMall(dt);
}
function senseHunter(actor,state,dt,sprinting,crouching){
 if((actor.position.level||0)!==currentFloor||hunterGone(actor)||actor.userData.fighting){state.chase=0;return {visible:false,noticed:false,distance:Infinity};}
 const distance=actor.position.distanceTo(player),visible=distance<60&&sight(actor.position,player);
 const movingNow=['KeyW','KeyS','KeyA','KeyD','ArrowUp','ArrowDown'].some(k=>keys.has(k));
 const hearing=(sprinting?32:crouching?3: movingNow?14:0)*(visible?1:.45);
 const noticed=elapsed>20&&((visible&&distance<(flashOn?56:crouching?20:38))||distance<hearing);
 if(noticed){state.lastKnown=cell(player);state.chase=12;state.repath=Math.min(state.repath||0,.18);}
 else state.chase=Math.max(0,(state.chase||0)-dt);
 return {visible,noticed,distance};
}
function resetHunterMotion(actor){
 actor.userData.leap={phase:'idle',time:0,cooldown:3,lift:0,dx:0,dz:0};
 actor.userData.body.rotation.x=0;actor.userData.body.position.y=0;
 actor.userData.legs.forEach(l=>{l.position.y=.82;l.rotation.x=0;});
 actor.userData.arms.forEach(a=>a.rotation.x=0);
}
function updateHunterLeap(actor,state,dt,visible){
 const l=actor.userData.leap||(resetHunterMotion(actor),actor.userData.leap);
 l.cooldown=Math.max(0,l.cooldown-dt);
 const distance=actor.position.distanceTo(player);
 if(l.phase==='idle'){
  if(state.chase<=0||!visible||distance<2.4||distance>5.5||l.cooldown>0)return false;
  l.phase='windup';l.time=0;l.dx=(player.x-actor.position.x)/distance;l.dz=(player.z-actor.position.z)/distance;
  actor.rotation.y=Math.atan2(l.dx,l.dz);tone(95,.18,.2,'triangle',55);
 }
 l.time+=dt;
 if(l.phase==='windup'){
  l.lift=-.22*Math.min(1,l.time/.45);
  if(l.time>=.45){l.phase='air';l.time=0;}
 }else if(l.phase==='air'){
  l.lift=Math.sin(Math.min(1,l.time/.52)*Math.PI)*.9;
  // Sweep small steps so a leap cannot pass through a wall or skip the player.
  let remaining=9.5*dt;
  while(remaining>0){const step=Math.min(.1,remaining),x=actor.position.x+l.dx*step,z=actor.position.z+l.dz*step;
   if(!walkable(x,z,.25)){l.phase='recover';l.time=0;l.lift=0;break;}
   actor.position.x=x;actor.position.z=z;remaining-=step;
   if(actor.position.distanceTo(player)<.83&&sight(actor.position,player)){caught(actor);break;}
  }
  if(l.time>=.52){l.phase='recover';l.time=0;l.lift=0;}
 }else if(l.phase==='recover'){
  l.lift=-.12*(1-Math.min(1,l.time/.55));
  if(l.time>=.55){l.phase='idle';l.lift=0;l.cooldown=6;state.path=[];state.repath=0;}
 }
 return true;
}
function updateUntouchableAura(show){
 const u=subject.userData;
 if(show&&!u.menuAura){
  const root=new THREE.Group();root.name='Union Crown and golden chains';subject.add(root);
  const stand=new THREE.Group();stand.position.set(.35,.22,-.72);root.add(stand);
  const blue=new THREE.MeshStandardMaterial({color:0x208dff,emissive:0x0865ff,emissiveIntensity:1.05,transparent:true,opacity:.68,roughness:.35});
  ball(stand,.46,.62,.26,blue,0,1.6,0);ball(stand,.28,.35,.25,blue,0,2.5,0);
  for(const s of [-1,1]){ball(stand,.18,.59,.19,blue,s*.55,1.55,.03);ball(stand,.19,.17,.19,blue,s*.55,.98,.08);ball(stand,.19,.57,.19,blue,s*.23,.57,0);ball(stand,.085,.025,.018,new THREE.MeshBasicMaterial({color:0xaeeaff}),s*.12,2.53,.237);}
  const gold=new THREE.MeshStandardMaterial({color:0xffcd48,emissive:0x946315,emissiveIntensity:.65,metalness:.8,roughness:.25});
  for(let i=0;i<5;i++)mesh(new THREE.ConeGeometry(.075,.25,4),gold,stand,(i-2)*.1,2.86,.02);
  const chains=new THREE.Group();root.add(chains);const geo=new THREE.TorusGeometry(.085,.023,6,10);
  for(let ring=0;ring<3;ring++)for(let i=0;i<64;i++){const angle=i/64*TAU,r=ring===1?.94:.80;const link=new THREE.Mesh(geo,gold);link.position.set(Math.cos(angle)*r,.6+ring*.61+Math.sin(angle*2+ring)*.16,Math.sin(angle)*r);link.rotation.set(Math.PI/2+(i%2)*Math.PI/2,0,angle);chains.add(link);}
  u.menuAura={root,stand,chains};
 }
 if(u.menuAura){u.menuAura.root.visible=show;if(show){u.menuAura.stand.position.y=.22+Math.sin(clock*1.4)*.035;u.menuAura.chains.rotation.y=clock*.12;}}
}
function updateJosiahUntouchable(show){updateUntouchableAura(show);
 const u=subject.userData;
 if(show&&!u.untouchableArms){
  const group=new THREE.Group();group.name='Hands crossed behind back';u.body.add(group);const suit=mat(0x252a2b),flesh=mat(0xe8a580);
  for(const s of [-1,1]){
   line3(group,[[s*.32,1.46,0],[s*.39,1.23,-.12],[s*.35,1.02,-.25]],suit,.11);
   line3(group,[[s*.35,1.02,-.25],[s*.18,.94,-.35],[-s*.04,.96,-.39]],suit,.09);
   const hand=ball(group,.115,.085,.075,flesh,-s*.07,.97+s*.045,-.40-s*.035);hand.rotation.z=s*.28;
  }
  u.untouchableArms=group;
 }
 if(u.untouchableArms)u.untouchableArms.visible=show;
 u.arms[1].visible=!show;u.arms[0].visible=!show&&!u.menuInjury?.groups.some(group=>group.visible);
 if(show){u.body.rotation.x=-.035;u.body.rotation.z=0;u.head.rotation.x=-.06;}
}
function updateJosiahMenuInjury(show){show=show&&gameProgress.josiahWrathful!==true;
 const u=subject.userData;
 if(show&&!u.menuInjury){
  const groups=[],blood=mat(0x8e1026,.5),dry=mat(0x490812,.8),suit=mat(0x252a2b),wrap=mat(0xc3b6a2),flesh=mat(0xe8a580);
  const add=parent=>{const group=new THREE.Group();parent.add(group);groups.push(group);return group;};
  const torso=add(u.body);
  for(let i=0;i<22;i++){const x=Math.sin(i*2.4)*.25,y=.9+(i%7)*.095;ball(torso,.045+(i%3)*.015,.025+(i%4)*.018,.012,i%3?blood:dry,x,y,.215);}
  for(const side of [-1,1])for(let i=0;i<9;i++)ball(torso,.025,.04,.012,dry,side*.25,1.0+i*.05,-.15);
  for(const leg of u.legs){const stain=add(leg);for(let i=0;i<8;i++)ball(stain,.045,.045,.012,i%2?blood:dry,Math.sin(i*2)*.06,-.08-i*.075,.132);}
  const face=add(u.head);for(let i=0;i<4;i++)ball(face,.022,.035,.008,dry,-.22+i*.017,-.08-i*.036,.283);
  const arm=add(u.body);arm.name='Supported arm across chest';
  ball(arm,.12,.21,.13,suit,-.34,1.28,.03);ball(arm,.13,.12,.14,suit,-.32,1.08,.13);
  const forearm=ball(arm,.25,.115,.13,wrap,-.10,1.15,.32);forearm.rotation.z=.16;ball(arm,.105,.09,.09,flesh,.16,1.2,.32);
  for(let i=0;i<5;i++)line3(arm,[[-.29+i*.08,1.055,.40],[-.31+i*.08,1.23,.41]],mat(0x9d9183),.008);
  line3(arm,[[.20,1.73,.12],[-.30,1.04,.31],[.13,1.09,.37],[.20,1.73,.12]],wrap,.035);
  u.menuInjury={groups};
 }
 if(u.menuInjury)u.menuInjury.groups.forEach(group=>group.visible=show);
 u.arms[0].visible=!show;
 if(show){u.body.rotation.x=.07;u.head.rotation.x=.04;}
 else{u.head.rotation.x=0;}
}

function animateCharacter(t,walking,chasing,actor=subject){
 const u=actor.userData,l=u.leap,active=mode==='play'&&l&&l.phase!=='idle';
 const sprinting=walking&&chasing,cycle=t*(sprinting?14:6),lift=active?l.lift:0;
 u.body.rotation.x=active?(l.phase==='air'?.42:.28):sprinting?.22:0;
 u.body.position.y=lift+(walking?Math.abs(Math.sin(cycle))*(sprinting?.09:.035):Math.sin(t*1.5)*.006);
 u.legs.forEach((leg,i)=>{leg.position.y=.82+lift;leg.rotation.x=active?(l.phase==='air'?(i===0?-.9:.65):-.35):walking?Math.sin(cycle+i*Math.PI)*(sprinting?.95:.42):0;});
 u.arms.forEach((arm,i)=>{arm.rotation.x=active?(l.phase==='air'?-1.45:.7):walking?-Math.sin(cycle+i*Math.PI)*(sprinting?1.05:.3):Math.sin(t*1.1)*.025;});
 u.head.rotation.z=chasing?.08:Math.sin(t*.5)*.025;if(actor===alissa)poseAlissaGun();
}

let chainCapture=null;
function clearChainCapture(){
 if(!chainCapture)return;
 scene.remove(chainCapture.group);chainCapture.geometry.dispose();chainCapture.material.dispose();chainCapture.veil.remove();chainCapture=null;
}
function renderChainCapture(dt){
 scareTime+=dt;
 if(!chainCapture){
  const group=new THREE.Group(),geometry=new THREE.TorusGeometry(.052,.013,6,10),material=new THREE.MeshStandardMaterial({color:0xffc94f,metalness:.8,roughness:.24,emissive:0xd58a12,emissiveIntensity:.65});
  const chains=Array.from({length:4},()=>Array.from({length:32},()=>{const link=new THREE.Mesh(geometry,material);link.scale.y=1.5;group.add(link);return link;}));
  const glow=new THREE.PointLight(0xffbd42,9,8);group.add(glow);scene.add(group);
  const veil=document.createElement('div');veil.style.cssText='position:fixed;inset:0;z-index:90;pointer-events:none;';document.body.appendChild(veil);
  chainCapture={group,geometry,material,chains,glow,veil};
 }
 const t=scareTime,actor=subject,u=actor.userData,forward=new THREE.Vector3(0,0,1).applyAxisAngle(new THREE.Vector3(0,1,0),actor.rotation.y),right=new THREE.Vector3(1,0,0).applyAxisAngle(new THREE.Vector3(0,1,0),actor.rotation.y);
 const clamp=x=>Math.max(0,Math.min(1,x)),arrival=clamp((t-.35)/.65),tight=clamp((t-1.05)/.8),finish=clamp((t-2.45)/.45);
 u.body.rotation.x=-.1*tight;u.body.position.y=0;
 u.arms.forEach((a,i)=>a.rotation.x=-1.3*arrival+.55*tight+Math.sin(t*18+i)*.025*tight);
 u.head.rotation.z=.08*Math.sin(t*5);actor.updateMatrixWorld(true);
 const head=u.head.getWorldPosition(new THREE.Vector3());
 camera.position.copy(head).addScaledVector(forward,1.85-.55*tight);
 camera.position.y-=.12*tight;
 camera.position.addScaledVector(right,Math.sin(t*39)*.022*tight);
 camera.lookAt(head);camera.rotation.z=Math.sin(t*27)*.035*tight;
 camera.updateMatrixWorld(true);
 flash.intensity=20;captureLight.intensity=2.5;
 chainCapture.glow.position.copy(head).addScaledVector(forward,.6);
 const q=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0);
 chainCapture.chains.forEach((links,k)=>{
  const side=k%2?1:-1;
  const origin=head.clone().addScaledVector(right,side*.36);origin.y-=.6;
  const local=new THREE.Vector3(side*(.56-.2*tight),k<2?-.35:-.17,-.42);
  const end=local.applyMatrix4(camera.matrixWorld),middle=origin.clone().lerp(end,.58).addScaledVector(right,side*.25*(1-tight));
  middle.y-=.25*(1-tight);
  const curve=new THREE.QuadraticBezierCurve3(origin,middle,end);
  links.forEach((link,i)=>{
   const p=i/(links.length-1);link.visible=p<=arrival;
   link.position.copy(curve.getPoint(p));q.setFromUnitVectors(up,curve.getTangent(p).normalize());link.quaternion.copy(q);link.rotateY(i%2?Math.PI/2:0);
  });
 });
 chainCapture.material.emissiveIntensity=.55+Math.sin(t*23)*.12;
 chainCapture.veil.style.background=`radial-gradient(ellipse at center, transparent ${Math.max(5,52-tight*38)}%, rgba(85,0,0,${tight*.8}) 76%, rgba(0,0,0,${.3+tight*.7}) 100%), linear-gradient(rgba(0,0,0,${finish}),rgba(0,0,0,${finish}))`;
 if(t>=2.9)endGame(false);
}

function makeAlissa(){
 const root=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group();root.add(body);body.add(head);head.position.y=2.05;
 const suit=mat(0x14151a),blouse=mat(0x242329),pale=mat(0xe5bda5),darkHair=mat(0x111013),metal=mat(0x30333a,.3);
 ball(body,.29,.46,.19,suit,0,1.16,0);box(body,.43,.2,.3,suit,0,.86,0);box(body,.16,.38,.025,blouse,0,1.35,.185);
 for(const s of [-1,1]){const lapel=box(body,.085,.35,.035,blouse,s*.12,1.4,.20);lapel.rotation.z=s*.24;}
 ball(head,.29,.37,.26,pale,0,0,0);ball(head,.10,.17,.10,pale,0,-.35,0);
 ball(head,.315,.28,.27,darkHair,0,.19,-.06);ball(head,.30,.42,.13,darkHair,0,-.05,-.20);
 for(const s of [-1,1]){ball(head,.105,.43,.18,darkHair,s*.255,-.07,-.005);ball(head,.073,.045,.025,white,s*.12,.025,.24);ball(head,.026,.032,.015,black,s*.12,.02,.263);line3(head,[[s*.12-.065,.105,.245],[s*.12,.12,.26],[s*.12+.06,.105,.245]],darkHair,.012);}
 ball(head,.04,.075,.055,pale,0,-.07,.255);const mouth=line3(head,[[-.085,-.19,.23],[0,-.2,.255],[.085,-.19,.23]],mat(0x964f55),.012);
 const arms=[],legs=[];
 for(const s of [-1,1]){const a=new THREE.Group();a.position.set(s*.3,1.48,0);body.add(a);ball(a,.105,.33,.11,suit,0,-.28,0);ball(a,.085,.115,.075,pale,0,-.61,0);arms.push(a);const l=new THREE.Group();l.position.set(s*.13,.82,0);root.add(l);box(l,.2,.67,.24,suit,0,-.32,0);ball(l,.115,.09,.21,black,0,-.72,.075);legs.push(l);}
 const gun=new THREE.Group();arms[1].add(gun);gun.position.set(0,-.60,.035);registerHeldGun(gun,new THREE.Vector3(0,-1,0));box(gun,.105,.36,.11,metal,0,-.12,.025);box(gun,.065,.24,.025,mat(0x78818b,.25),0,-.12,.09);box(gun,.075,.11,.14,black,0,.015,-.035);
 const muzzle=ball(gun,.085,.13,.085,new THREE.MeshBasicMaterial({color:0xffe783}),0,-.29,.025);muzzle.visible=false;
 root.userData={body,head,arms,legs,muzzle,mouth};root.name='Alissa "The Viper" Roberts';return enhanceHeroModel(root,'alissa');
}
function hunterGone(actor){return (actor.userData.goneUntil||0)>elapsed;}
function resetJosiahDuel(){
 const old=subject.userData.duel;
 if(old&&old.fx){scene.remove(old.fx);old.fx.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});}
 subject.userData.duel={phase:null,time:0,next:0,ready:0,standReady:0,hit:false,fx:null};
 alissa.userData.trappedUntil=0;
}
function hideJosiahDuel(){const d=subject.userData.duel;if(d){if(d.fx)d.fx.visible=false;if(d.phase){d.phase=null;resetHunterMotion(subject);}}}
function makeDuelFX(d){
 const fx=new THREE.Group();scene.add(fx);d.fx=fx;d.links=[];
 for(let i=0;i<44;i++){const link=new THREE.Mesh(new THREE.TorusGeometry(.10,.025,6,10),new THREE.MeshStandardMaterial({color:0xffcb48,emissive:0xc58b16,emissiveIntensity:.8,metalness:.75,roughness:.25}));fx.add(link);d.links.push(link);}
 const stand=new THREE.Group();fx.add(stand);d.stand=stand;
 const blue=new THREE.MeshStandardMaterial({color:0x208dff,emissive:0x0865ff,emissiveIntensity:.8,transparent:true,opacity:.68});
 ball(stand,.48,.65,.28,blue,0,1.45,0);ball(stand,.29,.36,.26,blue,0,2.38,0);
 for(const s of [-1,1]){ball(stand,.17,.65,.18,blue,s*.58,1.4,.15);ball(stand,.19,.55,.20,blue,s*.23,.50,0);ball(stand,.20,.2,.2,blue,s*.58,.85,.4);}
}
function updateJosiahDuel(dt,target=alissa){
 const h=subject,u=h.userData,d=u.duel||(resetJosiahDuel(),u.duel);
 if(!d.fx)makeDuelFX(d);d.fx.visible=true;d.links.forEach(l=>l.visible=false);d.stand.visible=false;
 const v=target.position.clone().sub(h.position),dist=v.length();h.rotation.y=Math.atan2(v.x,v.z);
 if(!d.phase){
  if(elapsed<d.ready){animateCharacter(elapsed,false,false,h);return;}
  let type=['chain','stand','leap','whip'][d.next++%4];if(type==='stand'&&elapsed<d.standReady)type='chain';
  d.phase=type;d.time=0;d.hit=false;d.aim=target.position.clone();d.direction=v.clone().normalize();if(type==='stand')d.standReady=elapsed+60;
 }
 d.time+=dt;const t=d.time,type=d.phase;
 animateCharacter(elapsed,false,false,h);
 if(type==='leap'){
  if(t<.45){u.body.position.y=-.22;u.arms.forEach(a=>a.rotation.x=.7);}
  else if(t<.97){
   let left=9.5*dt;while(left>0){const step=Math.min(.1,left),x=h.position.x+d.direction.x*step,z=h.position.z+d.direction.z*step;if(!walkable(x,z,.25))break;h.position.x=x;h.position.z=z;left-=step;}
   const lift=Math.sin((t-.45)/.52*Math.PI)*.9;u.body.position.y=lift;u.legs.forEach(l=>{l.position.y=.82+lift;l.rotation.x=-.65;});u.arms.forEach(a=>a.rotation.x=-1.45);
   if(!d.hit&&h.position.distanceTo(target.position)<1.7&&sight(h.position,target.position)){target.userData.hp=Math.max(0,target.userData.hp-36);d.hit=true;}
  }else {u.body.position.y=-.1;u.legs.forEach(l=>l.position.y=.82);}
 }else{
  u.arms[1].rotation.x=type==='stand'?-1.3:-2.6;
  if(type==='stand'){
   u.arms[0].rotation.x=-1.3;d.stand.visible=true;d.stand.position.copy(h.position).addScaledVector(d.direction,-.85);d.stand.rotation.y=h.rotation.y;d.stand.scale.setScalar(1.15+Math.sin(t*8)*.035);
  }
  const from=h.position.clone().add(new THREE.Vector3(0,2.5,0)),to=d.aim.clone().add(new THREE.Vector3(0,1.0,0));
  const reach=Math.max(0,Math.min(1,(t-.4)/.4));
  d.links.forEach((l,i)=>{const f=i/43;l.visible=t>.4&&f<=reach;
   l.position.copy(from).lerp(to,f);l.position.y+=Math.sin(f*Math.PI)*.5;
   if(type==='whip'){l.position.x+=Math.sin(f*Math.PI*4+t*14)*.5*f;l.position.z+=Math.cos(f*Math.PI*4+t*14)*.5*f;}
   l.lookAt(to);l.rotateY(i%2?Math.PI/2:0);
  });
  if(t>=.85&&!d.hit){d.hit=true;if(sight(h.position,target.position)&&(type==='stand'||target.position.distanceTo(d.aim)<3)){
   target.userData.hp=Math.max(0,target.userData.hp-(type==='stand'?48:type==='whip'?16:24));if(type==='whip')target.userData.trappedUntil=elapsed+2.5;
  }}
 }
 if(t>(type==='stand'?2.1:type==='leap'?1.52:1.35)){d.phase=null;d.ready=elapsed+.9;resetHunterMotion(h);d.fx.visible=false;}
}

function resetCombatHealth(){resetJosiahDuel();
 for(const h of [subject,peter,alissa]){h.userData.hp=h===alissa?140:5000;h.userData.maxHP=h.userData.hp;h.userData.fighting=false;h.userData.attackCooldown=0;}
 alissa.userData.goneUntil=0;alissaAI.fireCooldown=0;hideCombatBars();
}
function hideCombatBars(){hideJosiahDuel();const p=$('combatBars');if(p)p.hidden=true;}
function showCombatBars(target){
 const panel=$('combatBars');panel.hidden=false;
 for(const [id,h] of [['alissa',alissa],['josiah',subject],['peter',peter]]){
  $(id+'HPText').parentElement.hidden=h!==alissa&&h!==target;
  $(id+'HP').style.width=(hunterGone(h)?0:100*h.userData.hp/h.userData.maxHP)+'%';
  $(id+'HPText').textContent=hunterGone(h)?'GONE':Math.ceil(h.userData.hp)+' / '+h.userData.maxHP;
 }
}
function updateAllyCombat(dt){
 const a=alissaAI;
 for(const h of [subject,peter])h.userData.fighting=false;
 if(!a.allied){hideCombatBars();return false;}
 if(hunterGone(alissa)){alissa.visible=false;hideCombatBars();hideAlissaQTE();return true;}
 if(alissa.userData.goneUntil){alissa.userData.goneUntil=0;alissa.userData.hp=140;alissa.visible=true;toast('Alissa is back.',4);}
 a.fireCooldown=Math.max(0,(a.fireCooldown||0)-dt);
 const enemies=[subject,peter].filter(h=>!hunterGone(h)&&h.position.distanceTo(alissa.position)<28&&sight(h.position,alissa.position));
 if(!enemies.length){hideCombatBars();return false;}
 hideAlissaQTE();if(!enemies.includes(subject))hideJosiahDuel();
 enemies.sort((x,y)=>x.position.distanceTo(alissa.position)-y.position.distanceTo(alissa.position));const target=enemies[0];
 const delta=target.position.clone().sub(alissa.position),distance=delta.length();alissa.rotation.y=Math.atan2(delta.x,delta.z);
 // Circle the target while retreating from melee; collision-check every step.
 const side=Math.sin(elapsed*.8)>0?1:-1,dx=(delta.z*side-delta.x*(distance<5?1.5:0))/Math.max(distance,.01),dz=(-delta.x*side-delta.z*(distance<5?1.5:0))/Math.max(distance,.01);
 const nx=alissa.position.x+dx*2.4*dt,nz=alissa.position.z+dz*2.4*dt;
 if(elapsed>=(alissa.userData.trappedUntil||0)&&walkable(nx,nz,.25)){alissa.position.x=nx;alissa.position.z=nz;}
 animateCharacter(elapsed,true,true,alissa);poseAlissaGun(true);
 alissa.userData.body.rotation.x=.14;alissa.userData.body.position.y=-.10+Math.sin(elapsed*12)*.025;
 alissa.userData.arms[1].rotation.x-=Math.max(0,a.flash)*2;
 if(a.fireCooldown<=0&&sight(alissa.position,target.position)){
  a.fireCooldown=.65;a.flash=.13;alissa.userData.muzzle.visible=true;target.userData.hp=Math.max(0,target.userData.hp-25);playGunshot(.45);
  if(target.userData.hp===0){target.userData.goneUntil=elapsed+30;target.visible=false;resetHunterMotion(target);const state=target===peter?peterAI:ai;state.path=[];state.chase=0;state.repath=0;(target===peter?peterClips:josiahClips).forEach(c=>c.pause());toast(target===peter?'Peter is Gone for 30 seconds':'Josiah is gone for 30 seconds',6);}
 }
 for(const h of enemies){
  if(hunterGone(h))continue;h.userData.fighting=true;
  const state=h===peter?peterAI:ai;state.chase=0;state.path=[];state.repath=0;
  if(h===subject){updateJosiahDuel(dt);continue;}
  const v=alissa.position.clone().sub(h.position),dist=v.length();h.rotation.y=Math.atan2(v.x,v.z);
  if(dist>1.45){v.multiplyScalar(Math.min(dist-1.3,5.1*relaySpeedMultiplier()*dt)/Math.max(dist,.01));if(walkable(h.position.x+v.x,h.position.z+v.z,.25))h.position.add(v);}
  animateCharacter(elapsed,true,true,h);h.userData.attackCooldown=Math.max(0,h.userData.attackCooldown-dt);
  if(dist<1.9){h.userData.arms[0].rotation.x=-1.4+Math.sin(elapsed*19)*.6;
   if(h.userData.attackCooldown<=0&&sight(h.position,alissa.position)){h.userData.attackCooldown=.9;alissa.userData.hp=Math.max(0,alissa.userData.hp-28);}
  }
 }
 if(alissa.userData.hp<=0){alissa.userData.goneUntil=elapsed+120;alissa.visible=false;a.target=null;a.path=[];for(const h of [subject,peter])h.userData.fighting=false;hideJosiahDuel();toast('Alissa is gone for 2 minutes',7);}
 showCombatBars(target);return true;
}

function hideAlissaQTE(){const panel=$('alissaQTE');if(panel)panel.hidden=true;}
function syncAlissaAlliance(){
 const a=alissaAI;if(!a||a.allied||collected<8)return;
 a.allied=true;if(a.target==='player'){a.target=null;a.aim=0;a.dodged=false;}hideAlissaQTE();
 document.querySelectorAll('.alissa-dot').forEach(e=>{e.style.color='#53b9ff';e.textContent='● ALISSA / ALLY';});
 toast('Alissa is now your ally. Watch the blue marker.',5);
}
function resetAlissa(){
 for(const actor of [subject,peter])actor.userData.goneUntil=0;
 alissa.position.copy(pos(15,17));
 alissaAI={spent:false,allied:false,aim:0,target:null,dodged:false,path:[],corner:1,repath:0,flash:0};alissa.userData.muzzle.visible=false;hideAlissaQTE();resetCombatHealth();
 document.querySelectorAll('.alissa-dot').forEach(e=>{e.style.color='#ffe34b';e.textContent='● ALISSA / THE VIPER';});
}
function poseAlissaGun(aiming=false){
 const u=alissa.userData;
 u.arms[1].rotation.x=aiming?-Math.PI/2:-.45;
 u.arms[0].rotation.x=aiming?-1.15:-.3;
 u.arms[0].rotation.z=aiming?-.35:0;
}
function updateAlissa(dt){if(alissa.userData.floorTravelling)return;
 for(const actor of [subject,peter]){if(actor.userData.goneUntil&&!hunterGone(actor)){actor.userData.goneUntil=0;actor.userData.hp=actor.userData.maxHP||100;actor.visible=true;}}
 syncAlissaAlliance();const a=alissaAI;
 a.flash=Math.max(0,a.flash-dt);alissa.userData.muzzle.visible=a.flash>0;
 if(updateAllyCombat(dt))return;
 if(!a.spent&&!a.allied){
  const targets=[...(a.allied?[]:[{actor:null,position:player}]),...[subject,peter].filter(h=>!hunterGone(h)).map(h=>({actor:h,position:h.position}))].filter(t=>alissa.position.distanceTo(t.position)<25&&sight(alissa.position,t.position)).sort((x,y)=>alissa.position.distanceTo(x.position)-alissa.position.distanceTo(y.position));
  const target=targets.find(t=>(t.actor||'player')===a.target)||targets[0];
  if(target){
   const key=target.actor||'player';if(a.target!==key){a.target=key;a.aim=0;a.dodged=false;}a.aim+=dt;
   const d=target.position.clone().sub(alissa.position);alissa.rotation.y=Math.atan2(d.x,d.z);animateCharacter(elapsed,false,false,alissa);poseAlissaGun(true);
   const limit=target.actor?1.15:1.8;if(!target.actor&&a.dodged){camera.rotation.z=-.16;camera.position.y-=.25;}
   if(!target.actor){const panel=$('alissaQTE');panel.hidden=false;$('alissaQTEText').textContent=a.dodged?'DODGE READY — SHOT WILL MISS':'ALISSA IS AIMING — PRESS Q TO DODGE';$('alissaQTEBar').style.width=Math.max(0,1-a.aim/limit)*100+'%';}else hideAlissaQTE();
   if(a.aim>=limit){a.spent=true;a.flash=.12;alissa.userData.muzzle.visible=true;hideAlissaQTE();playGunshot(.65);
    if(target.actor){const h=target.actor;h.userData.goneUntil=elapsed+30;h.visible=false;resetHunterMotion(h);const state=h===peter?peterAI:ai;state.chase=0;state.path=[];state.repath=0;(h===peter?peterClips:josiahClips).forEach(c=>c.pause());toast(h===peter?'Peter is Gone for 30 seconds':'Josiah is gone for 30 seconds',6);}
    else if(a.dodged){toast('You dodged the shot. Alissa’s gun is empty.',4);}
    else {captureSubject=alissa;endGame(false);$('endLabel').textContent='CONTACT LOST / SUBJECT BC-03';$('endTitle').textContent='Alissa shot you.';$('endText').textContent='Press Q during her aim warning to dodge the shot.';return;}
   }return;
  }a.target=null;a.aim=0;a.dodged=false;hideAlissaQTE();
 }
 const corners=[{x:15,z:17},{x:65,z:17},{x:65,z:57},{x:15,z:57}];
 if(!a.path.length){if(alissa.position.distanceTo(pos(corners[a.corner].x,corners[a.corner].z))<.2)a.corner=(a.corner+1)%corners.length;a.path=route(cell(alissa.position),corners[a.corner]);}
 if(a.path.length){const delta=pos(a.path[0].x,a.path[0].z).sub(alissa.position),d=delta.length(),step=Math.min(d,3.5*dt);if(d<.05)a.path.shift();else{delta.multiplyScalar(step/d);if(walkable(alissa.position.x+delta.x,alissa.position.z+delta.z,.2)){alissa.position.add(delta);alissa.rotation.y=Math.atan2(delta.x,delta.z);}else a.path=[];}}
 animateCharacter(elapsed,a.path.length>0,false,alissa);poseAlissaGun();
}
document.addEventListener('keydown',e=>{if(mode==='siegeEnding'){if(e.code==='Enter'&&!e.repeat){e.preventDefault();advanceSiegeEnding();}return;}if(mode==='siegePeterIntro'){if(e.code==='Enter'&&!e.repeat){e.preventDefault();advanceSiegePeter();}return;}if(mode==='siegeEnd')return;if(mode==='kevinChainStruggle'){if(e.code==='Space'){e.preventDefault();pressKevinChainQTE(e.repeat);}return;}if(mode==='primePeaceOutro'||mode==='kevinChainGameOver')return;if(mode==='primeReunion'){if(e.code==='Enter'){e.preventDefault();if(!e.repeat)advancePrimeReunion();}return;}if(mode==='finalWarCinema'){if(finalWar?.josiahEncounter?.phase==='universeQTE'&&e.code==='Space'){e.preventDefault();pressUniverseQTE(e.repeat);return;}if(['Enter','Space','Escape'].includes(e.code))e.preventDefault();if(e.code==='Enter'&&!e.repeat){if(finalWar?.josiahEncounter?.phase==='death')advanceJosiahDeath();else nextAtriumJosiahLine();}return;}if(mode==='finalWar'){if(['intro','death'].includes(finalWar?.josiahEncounter?.phase)&&e.code==='Enter'){if(!e.repeat){if(finalWar.josiahEncounter.phase==='death')advanceJosiahDeath();else nextAtriumJosiahLine();}return;}if(e.code==='Escape'){finalWar.paused?resumeFinalWar():pauseFinalWar();return;}if(finalWar.paused||finalWar.ended)return;if(e.code==='Space'&&!e.repeat&&finalWar.kevinArena)finalWar.kevinArena.jumpQueued=true;if(e.code==='KeyE'&&!e.repeat)useFinalWarLift();if(e.code==='KeyR'&&!e.repeat)reloadFinalWar();if(e.code==='KeyF'&&!e.repeat)flash.visible=!flash.visible;if(['Space','Tab'].includes(e.code))e.preventDefault();keys.add(e.code);return;}if(mode==='secretaryIntro'){if(!e.repeat&&e.code==='Enter')advanceSecretaryOpening();if(e.code==='Escape'){menu();refreshProgressUI();}return;}if(mode==='rooms'){if(['dialogue','ending','breakdown'].includes(corneredRooms.finale?.phase)){if(e.code==='Enter')advancePeterFinale();return;}if(corneredRooms.questChoice){e.preventDefault();return;}if(['Space','Tab','KeyE','KeyF'].includes(e.code))e.preventDefault();if(e.code==='Escape'){corneredRooms.paused?resumeCorneredRooms():pauseCorneredRooms();return;}if(corneredRooms.paused)return;if(!e.repeat&&e.code==='KeyE')useCorneredDoor();if(!e.repeat&&e.code==='KeyF'){if(corneredRooms.finale)firePeterFinale();else corneredRooms.torch=!corneredRooms.torch;}keys.add(e.code);return;}if(mode==='roomsEnd')return;if(mode==='cornered'||mode==='corneredEnd'){if(e.code==='Escape'){menu();refreshProgressUI();}return;}if(e.code==='KeyQ'&&!e.repeat&&mode==='play'&&!alissaAI.allied&&!alissaAI.spent&&alissaAI.target==='player'&&alissaAI.aim>0&&alissaAI.aim<1.8){e.preventDefault();alissaAI.dodged=true;}});

function makeChrisPinter(neutralOfficer=false){
 const root=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group();root.name=neutralOfficer?'Police officer':'Chris Pinter / BC-11';root.add(body);body.add(head);head.position.y=2.10;
 const navy=mat(0x111923),vest=mat(0x181e25),complexion=mat(0xe9b58e),brown=mat(0x634e3d),silver=mat(0xb9c5cf,.3),boots=mat(0x090c10,.45);const arms=[],legs=[];
 ball(body,.36,.49,.24,navy,0,1.20,0);box(body,.53,.25,.38,navy,0,.91,0);box(body,.61,.66,.12,vest,0,1.26,.22);for(const x of [-.28,.28])box(body,.10,.75,.10,vest,x,1.31,.17);box(body,.57,.08,.44,boots,0,.88,0);box(body,.09,.065,.025,silver,0,.88,.24);
 for(const x of [-.16,.16]){box(body,.23,.2,.07,vest,x,1.13,.31);box(body,.23,.028,.085,silver,x,1.24,.32);}box(body,.13,.22,.1,boots,-.25,1.49,.32);box(body,.025,.18,.025,boots,-.25,1.68,.32);for(let i=0;i<4;i++)box(body,.08,.008,.01,silver,-.25,1.46+i*.027,.38);
 const labelCanvas=document.createElement('canvas');labelCanvas.width=256;labelCanvas.height=96;const ctx=labelCanvas.getContext('2d');ctx.fillStyle='#111923';ctx.fillRect(0,0,256,96);ctx.fillStyle='#eeeeee';ctx.font='bold 51px Arial';ctx.textAlign='center';ctx.fillText('POLICE',128,66);const texture=new THREE.CanvasTexture(labelCanvas);texture.colorSpace=THREE.SRGBColorSpace;const label=mesh(new THREE.PlaneGeometry(.30,.11),new THREE.MeshBasicMaterial({map:texture}),body,.10,1.47,.292);label.name='POLICE chest patch';
 for(const side of [-1,1]){const arm=new THREE.Group();body.add(arm);arm.position.set(side*.37,1.49,0);ball(arm,.14,.22,.15,navy,0,-.17,0);ball(arm,.105,.22,.105,complexion,0,-.47,.01);ball(arm,.10,.13,.085,complexion,0,-.69,.025);arms.push(arm);box(body,.16,.04,.17,boots,side*.29,1.60,0);box(body,.13,.24,.12,boots,side*.35,.83,.10);
 const leg=new THREE.Group();root.add(leg);leg.position.set(side*.155,.84,0);box(leg,.25,.64,.28,navy,0,-.28,0);box(leg,.27,.17,.30,navy,side*.025,-.29,.02);box(leg,.24,.26,.27,boots,0,-.64,0);ball(leg,.155,.11,.26,boots,0,-.76,.09);for(let j=0;j<4;j++)box(leg,.14,.015,.012,silver,0,-.58-j*.035,.142);legs.push(leg);}
 ball(head,.12,.16,.12,complexion,0,-.35,0);ball(head,.32,.41,.29,complexion,0,.015,0);ball(head,.265,.24,.26,complexion,0,-.19,.035);ball(head,.32,.25,.20,brown,0,.17,-.10);
 for(const side of [-1,1]){ball(head,.065,.10,.06,complexion,side*.32,-.035,0);ball(head,.093,.061,.027,white,side*.135,.025,.272);ball(head,.029,.035,.019,mat(0x4b697b),side*.135,.023,.30);ball(head,.014,.024,.009,black,side*.135,.022,.318);line3(head,[[side*.135-.073,.117,.265],[side*.135,.13,.28],[side*.135+.073,.12,.265]],brown,.016);}
 ball(head,.049,.10,.073,complexion,0,-.065,.29);const mouth=line3(head,neutralOfficer?[[-.105,-.219,.277],[0,-.219,.303],[.105,-.219,.277]]:[[-.13,-.205,.26],[-.06,-.235,.292],[.055,-.235,.292],[.13,-.205,.26]],black,.009);mouth.name=neutralOfficer?'Neutral closed mouth':'Pinter smile';if(!neutralOfficer){const teeth=box(head,.13,.027,.012,white,0,-.218,.302);teeth.name='Pinter smile teeth';}
 const helmet=new THREE.Group();helmet.name='Custodian police helmet';head.add(helmet);helmet.position.y=.32;ball(helmet,.36,.46,.32,navy,0,.24,-.025);ball(helmet,.41,.045,.37,boots,0,-.065,.03);const seam=line3(helmet,[[0,.67,0],[0,.59,.21],[0,.31,.30]],boots,.02);const badge=new THREE.Group();badge.name='Silver helmet badge';helmet.add(badge);badge.position.set(0,.24,.305);for(let i=0;i<8;i++){const ray=box(badge,.035,.20,.02,silver);ray.rotation.z=i*Math.PI/4;}ball(badge,.071,.09,.025,silver,0,0,.025);ball(badge,.039,.049,.014,navy,0,0,.052);box(badge,.09,.035,.025,silver,0,.125,.01);
 root.userData={body,head,arms,legs,mouth};return neutralOfficer?root:enhanceHeroModel(root,'pinter');
}

function makeStephen(){
 const root=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group();root.name='Stephen Marsh';root.add(body);body.add(head);head.position.y=2.12;
 const uniform=mat(0x090d14),skinTone=mat(0xf1c391),hairTone=mat(0x080909),blue=mat(0x12618b),gold=mat(0xe3bd18,.35),eyes=mat(0x161718);
 ball(body,.34,.48,.22,uniform,0,1.19,0);box(body,.49,.22,.35,uniform,0,.9,0);
 box(body,.11,.42,.04,white,0,1.31,.23);const knot=box(body,.09,.075,.04,white,0,1.55,.24);knot.rotation.z=.15;
 box(body,.51,.075,.37,black,0,.85,0);box(body,.08,.06,.025,mat(0x92989e,.35),0,.85,.20);
 const arms=[],legs=[];
 for(const s of [-1,1]){const arm=new THREE.Group();body.add(arm);arm.position.set(s*.32,1.48,0);ball(arm,.115,.35,.13,uniform,0,-.29,0);ball(arm,.09,.135,.085,skinTone,0,-.69,.02);arms.push(arm);box(body,.15,.045,.15,uniform,s*.26,1.57,0);
 const leg=new THREE.Group();root.add(leg);leg.position.set(s*.145,.82,0);box(leg,.22,.7,.26,uniform,0,-.33,0);ball(leg,.14,.10,.23,black,0,-.73,.075);legs.push(leg);}
 ball(head,.12,.17,.12,skinTone,0,-.34,0);ball(head,.34,.41,.30,skinTone,0,.015,0);ball(head,.27,.24,.26,skinTone,0,-.2,.02);
 ball(head,.33,.33,.18,hairTone,0,.08,-.15);
 for(const s of [-1,1]){ball(head,.075,.105,.06,skinTone,s*.33,-.045,0);line3(head,[[s*.34,-.01,.06],[s*.37,-.03,.07],[s*.345,-.07,.07]],hairTone,.008);
 ball(head,.107,.091,.026,white,s*.14,.045,.277);ball(head,.033,.034,.016,eyes,s*.14-.025,.034,.298);ball(head,.113,.052,.032,skinTone,s*.14,.099,.292);line3(head,[[s*.14-.102,.054,.302],[s*.14,.048,.308],[s*.14+.1,.045,.296]],black,.012);}
 ball(head,.05,.105,.085,skinTone,-.025,-.066,.289);
 const mouth=line3(head,[[-.13,-.22,.253],[-.03,-.238,.28],[.065,-.232,.27],[.14,-.219,.247]],black,.009);
 const cap=new THREE.Group();head.add(cap);cap.name='Police peaked cap';cap.position.y=.36;
 const crown=mesh(new THREE.CylinderGeometry(.43,.35,.24,32),uniform,cap,0,.11,-.01);crown.scale.z=.85;
 const band=mesh(new THREE.CylinderGeometry(.358,.358,.075,32),blue,cap,0,-.025,-.005);band.scale.z=.85;band.name='Blue hatband';
 const visor=ball(cap,.41,.035,.30,black,0,-.09,.24);visor.name='Cap visor';
 const badge=new THREE.Group();cap.add(badge);badge.position.set(0,.13,.365);badge.name='Gold cap badge';
 const shield=new THREE.Shape();shield.moveTo(0,.16);shield.lineTo(.095,.055);shield.quadraticCurveTo(.105,-.025,0,-.085);shield.quadraticCurveTo(-.105,-.025,-.095,.055);shield.closePath();mesh(new THREE.ExtrudeGeometry(shield,{depth:.018,bevelEnabled:false}),gold,badge);box(badge,.19,.045,.025,gold,0,-.085,.01);
 root.userData={body,head,arms,legs,mouth};return enhanceHeroModel(root,'stephen');
}

function makeGareth(dressForRoute=true,detail=true,faceVariant='gareth'){
 const actor=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group();actor.name='Gareth Williams';actor.add(body);body.add(head);head.position.y=2.05;
 const suit=mat(0x253039),complexion=mat(0xecc393),buzz=mat(0x2b2522),eye=mat(0x493b30);
 const shirt=mat(0xd8dbd6),tie=mat(0x762936),lapelCloth=mat(0x35414a),stripe=mat(0x59616a),oxford=mat(0x211b1a,.55);
 ball(body,.29,.46,.20,suit,0,1.16,0);box(body,.44,.22,.33,suit,0,.9,0);
 box(body,.20,.47,.038,shirt,0,1.32,.209);
 for(const s of [-1,1]){
  const collar=box(body,.11,.15,.03,shirt,s*.075,1.535,.249);collar.rotation.z=-s*.42;
  const lapel=box(body,.105,.39,.044,lapelCloth,s*.16,1.385,.227);lapel.rotation.z=s*.23;
  line3(body,[[s*.23,1.57,.239],[s*.20,1.34,.256],[s*.13,1.19,.24]],stripe,.004);
  line3(body,[[s*.27,1.43,.14],[s*.26,1.1,.18]],stripe,.003);
 }
 box(body,.074,.073,.045,tie,0,1.52,.284);
 box(body,.058,.30,.038,tie,0,1.335,.275);
 const tieTip=mesh(new THREE.ConeGeometry(.041,.08,3),tie,body,0,1.15,.277);tieTip.rotation.z=Math.PI;
 box(body,.11,.023,.026,shirt,-.19,1.305,.232);
 for(const y of [1.18,1.03])ball(body,.013,.013,.013,stripe,.045,y,.217);
 const legs=[],arms=[];
 for(const s of [-1,1]){
  const leg=new THREE.Group();leg.position.set(s*.135,.82,0);actor.add(leg);box(leg,.21,.70,.25,suit,0,-.33,0);ball(leg,.13,.10,.23,oxford,0,-.73,.075);line3(leg,[[-.08,-.71,.249],[0,-.72,.295],[.08,-.71,.249]],stripe,.004);legs.push(leg);
  const arm=new THREE.Group();arm.position.set(s*.30,1.46,0);body.add(arm);ball(arm,.105,.33,.12,suit,0,-.29,0);box(arm,.15,.04,.16,shirt,0,-.59,0);ball(arm,.085,.12,.075,complexion,0,-.69,.02);arms.push(arm);
 }
 ball(head,.11,.16,.11,complexion,0,-.32,0);
 const face=ball(head,.31,.38,.285,complexion,0,.02,0),jaw=ball(head,.25,.19,.255,complexion,0,-.20,.03);
 if(faceVariant==='gareth'){
  face.scale.x=.325;face.scale.y=.39;
  jaw.scale.x=.272;jaw.scale.y=.202;jaw.scale.z=.247;jaw.position.y=-.215;
 }
 // Cropped hair follows the scalp without hiding the face.
 const cap=new THREE.Group();cap.name='Buzz cut';head.add(cap);
 ball(cap,.305,.15,.20,buzz,0,.31,-.035);
 ball(cap,.265,.045,.055,buzz,-.012,.35,.18);
 line3(cap,[[.055,.425,.065],[.082,.385,.153],[.105,.347,.204]],mat(0x51443a),.004);
 ball(cap,.288,.19,.092,buzz,0,.19,-.226);
 for(const s of [-1,1]){
  ball(cap,.046,.14,.10,buzz,s*.265,.20,.018);
  const temple=ball(cap,.027,.075,.067,buzz,s*.281,.105,.023);temple.rotation.z=-s*.12;
 }
 for(let i=0;i<5;i++)line3(cap,[[-.20+i*.08,.382,.018],[-.15+i*.08,.411,-.037],[-.10+i*.08,.396,-.105]],buzz,.005);
 for(const s of [-1,1]){
  ball(head,.065,.105,.065,complexion,s*.30,-.015,0);
  if(faceVariant==='gareth'){
   ball(head,.093,.048,.024,white,s*.13,.006,.264);
   ball(head,.027,.031,.014,eye,s*.13,-.004,.286);
   ball(head,.107,.046,.031,complexion,s*.13,.061,.278);
   line3(head,[[s*.13-.081,.115,.253],[s*.13,.126,.274],[s*.13+.072,.113,.258]],buzz,.014);
   line3(head,[[s*.20,-.028,.25],[s*.25,-.038,.205]],mat(0x997756),.005);
  }else{
   ball(head,.098,.065,.027,white,s*.13,.015,.263);ball(head,.032,.038,.015,eye,s*.13,.005,.285);
   ball(head,.105,.038,.035,complexion,s*.13,.061,.274);
   line3(head,[[s*.13-.07,.135,.25],[s*.13,.15,.269],[s*.13+.065,.13,.25]],buzz,.012);
  }
 }
 let mouth;
 if(faceVariant==='gareth'){
  ball(head,.038,.105,.054,complexion,0,-.082,.281);
  ball(head,.046,.027,.044,complexion,-.006,-.139,.31);
  mouth=line3(head,[[-.119,-.225,.243],[-.035,-.233,.268],[.055,-.23,.268],[.119,-.224,.243]],mat(0x60483d),.009);
  line3(head,[[-.064,-.256,.249],[.008,-.261,.264],[.071,-.251,.248]],complexion,.006);
  const stubble=mat(0x947251);
  for(let i=0;i<14;i++){const x=(i%7-3)*.041,y=-.265-Math.floor(i/7)*.023;ball(head,.004,.004,.003,stubble,x,y,.264-Math.abs(x)*.13);}
 }else{
  ball(head,.05,.075,.065,complexion,0,-.075,.285);
  mouth=line3(head,[[-.13,-.19,.24],[-.065,-.225,.269],[.035,-.235,.277],[.125,-.20,.247]],black,.011);
  line3(head,[[.115,-.195,.25],[.135,-.218,.235],[.12,-.24,.237]],black,.008);
 }
 actor.userData={body,head,arms,legs,mouth};if(dressForRoute)applyGarethResistanceOutfit(actor,garethUsesResistanceOutfit());return detail?enhanceHeroModel(actor,'gareth'):actor;
}

function resetGareth(){gareth.userData.escape=null;stopGarethVoice();resetGarethPatrol();
 gareth.position.copy(pos(33,70));gareth.rotation.y=0;
 garethQuest='offered';questCase.visible=false;questCase.position.copy(pos(40,57));questCase.position.y=.45;
 $('garethQuestPanel').hidden=true;$('questTracker').textContent='';
}
function talkGareth(){
 if(garethQuest==='returned'){if(collectGarethSupplies())return;playGarethVoice(2);toast('Gareth: Thanks again. Good luck in there.',4);return;}
 if(garethQuest==='retrieved'){garethQuest='returned';playGarethVoice(1);questCase.visible=false;battery=100;stamina=100;$('questTracker').textContent='SIDE MISSION COMPLETE / THE LOST BRIEFCASE';toast('Gareth: You found it! Thank you. Flashlight and stamina restored.',6);beginGarethPatrol();return;}
 if(garethQuest==='accepted'){toast('Gareth: My briefcase is in the south atrium. Bring it back if you can.',5);return;}
 setMode('paused');$('pause').hidden=true;$('garethQuestPanel').hidden=false;document.exitPointerLock?.();playGarethVoice(0);
}
function closeGarethQuest(accept){
 if(accept){garethQuest='accepted';questCase.visible=true;$('questTracker').textContent='OPTIONAL / FIND GARETH’S BRIEFCASE IN THE SOUTH ATRIUM';}
 $('garethQuestPanel').hidden=true;resume();
}
function resetGarethPatrol(){
 gareth.userData.patrol={path:[],stop:0,visits:0,waitingUntil:0,nextFind:elapsed+40,pending:null,finds:0,repath:0};
}
function beginGarethPatrol(){resetGarethPatrol();$('questTracker').textContent='GARETH / EXPLORING THE SHOPPING CENTRE';}
function collectGarethSupplies(){
 const p=gareth.userData.patrol;if(!p||!p.pending)return false;
 if(p.pending==='battery')battery=100;else stamina=100;
 toast(p.pending==='battery'?'Gareth gave you fresh batteries. Flashlight restored.':'Gareth gave you an energy drink. Stamina restored.',5);
 p.pending=null;p.waitingUntil=elapsed+3;p.nextFind=elapsed+40;
 $('questTracker').textContent='GARETH / EXPLORING THE SHOPPING CENTRE';return true;
}
function updateGarethEscape(dt){
 const u=gareth.userData,e=u.escape||(u.escape={threat:null,lastSeen:0,repath:0,path:[]});
 const threats=[subject,peter,...(!alissaAI.allied?[alissa]:[])].filter(h=>!hunterGone(h)&&gareth.position.distanceTo(h.position)<26&&sight(gareth.position,h.position));
 threats.sort((a,b)=>gareth.position.distanceTo(a.position)-gareth.position.distanceTo(b.position));
 const threat=threats[0];
 if(threat){
  if(e.threat!==threat){toast('Gareth is running away from '+(threat===subject?'Josiah':threat===peter?'Peter':'Alissa'),5);e.path=[];e.repath=0;}
  e.threat=threat;e.lastSeen=elapsed;e.lastPosition=threat.position.clone();
 }
 if(e.threat===alissa&&alissaAI.allied){e.threat=null;e.path=[];}
 if(!e.threat||elapsed-e.lastSeen>5||hunterGone(e.threat)){
  if(e.threat&&u.patrol){u.patrol.path=[];u.patrol.repath=0;}
  e.threat=null;e.path=[];return false;
 }
 e.repath-=dt;
 if(e.repath<=0||!e.path.length){
  const here=cell(gareth.position),options=[];
  for(const dx of [-8,-4,0,4,8])for(const dz of [-8,-4,0,4,8]){
   if(!dx&&!dz)continue;const x=here.x+dx,z=here.z+dz;if(x<1||z<1||x>=N-1||z>=N-1||!walkable(x*CELL,z*CELL,.2))continue;
   const destination=pos(x,z),path=route(here,{x,z});if(!path.length)continue;
   const separation=destination.distanceTo(e.lastPosition);if(separation<gareth.position.distanceTo(e.lastPosition)+2)continue;
   const approach=Math.min(...path.slice(0,5).map(p=>pos(p.x,p.z).distanceTo(e.lastPosition)));
   options.push({path,score:separation+approach*2-path.length*.15});
  }
  options.sort((a,b)=>b.score-a.score);e.path=options[0]?.path||[];e.repath=1;
 }
 let moving=false;
 if(e.path.length){const v=pos(e.path[0].x,e.path[0].z).sub(gareth.position),d=v.length();if(d<.05)e.path.shift();else{v.multiplyScalar(Math.min(d,5.8*dt)/d);if(walkable(gareth.position.x+v.x,gareth.position.z+v.z,.2)){gareth.position.add(v);gareth.rotation.y=Math.atan2(v.x,v.z);moving=true;}else{e.path=[];e.repath=0;}}}
 animateCharacter(elapsed,moving,true,gareth);return true;
}

function updateGareth(dt){if(updateGarethEscape(dt))return;
 if(garethQuest==='accepted')questCase.rotation.y=elapsed*.5;
 if(garethQuest!=='returned'){animateCharacter(elapsed,false,false,gareth);return;}
 const p=gareth.userData.patrol;if(!p){resetGarethPatrol();return;}
 if(elapsed<p.waitingUntil){animateCharacter(elapsed,false,false,gareth);return;}
 const stops=[{x:40,z:70},{x:40,z:57},{x:15,z:57},{x:15,z:37},{x:15,z:17},{x:40,z:17},{x:65,z:17},{x:65,z:37},{x:65,z:57},{x:40,z:37}];
 const dest=stops[p.stop];
 if(gareth.position.distanceTo(pos(dest.x,dest.z))<.15){
  p.path=[];p.stop=(p.stop+1)%stops.length;p.visits++;p.waitingUntil=elapsed+2;
  if(p.visits>=2&&!p.pending&&elapsed>=p.nextFind){p.pending=p.finds++%2===0?'battery':'stamina';p.nextFind=elapsed+40;toast('Gareth has found something',6);$('questTracker').textContent='GARETH HAS FOUND SOMETHING / TALK TO HIM AT THE BLUE SQUARE';}
  animateCharacter(elapsed,false,false,gareth);return;
 }
 p.repath=Math.max(0,p.repath-dt);
 if(!p.path.length&&p.repath<=0){p.path=route(cell(gareth.position),dest);p.repath=1;}
 let moved=false;
 if(p.path.length){const v=pos(p.path[0].x,p.path[0].z).sub(gareth.position),distance=v.length();
  if(distance<.05)p.path.shift();else{v.multiplyScalar(Math.min(distance,3.1*dt)/distance);if(walkable(gareth.position.x+v.x,gareth.position.z+v.z,.2)){gareth.position.add(v);gareth.rotation.y=Math.atan2(v.x,v.z);moved=true;}else{p.path=[];p.repath=.5;}}
 }
 animateCharacter(elapsed,moved,false,gareth);
}

const garethClips=["assets/audio/clip-cac741623f7c.mp3","assets/audio/clip-65a430cee161.mp3","assets/audio/clip-11f7c4f02e65.mp3"].map(src=>{const a=new Audio(src);a.preload='auto';return a;});
let garethSpeaking=-1;
function stopGarethVoice(){garethClips.forEach(a=>{a.pause();a.currentTime=0;});garethSpeaking=-1;}
function playGarethVoice(index){
 stopGarethVoice();garethSpeaking=index;
 josiahClips.forEach(a=>a.pause());peterClips.forEach(a=>a.pause());
 const a=garethClips[index];a.muted=muted;a.play().catch(()=>{});
}
function syncGarethVoice(){
 garethClips.forEach(a=>a.muted=muted);
 if(!['play','paused'].includes(mode)){stopGarethVoice();return;}
 const a=garethClips[garethSpeaking];if(!a||a.ended)return;
 if(mode==='paused')a.pause();else if(a.paused)a.play().catch(()=>{});
}

const atriumClips=["assets/audio/clip-55823f320cec.mp3","assets/audio/clip-e2ae09d0dea9.mp3","assets/audio/clip-f7bcc9d50bc3.mp3","assets/audio/clip-18c638f9cdd9.mp3","assets/audio/clip-7fe44dd61838.mp3","assets/audio/clip-0019527563a1.mp3"].map(src=>{const a=new Audio(src);a.preload='auto';return a;});
let atriumAnalyser=null,atriumSources=null,atriumSamples=null;
function prepareAtriumAudio(){if(!audioCtx||atriumSources)return;try{atriumAnalyser=audioCtx.createAnalyser();atriumAnalyser.fftSize=256;atriumSamples=new Uint8Array(256);atriumSources=atriumClips.map(a=>{const s=audioCtx.createMediaElementSource(a);s.connect(atriumAnalyser);return s;});atriumAnalyser.connect(audioCtx.destination);}catch(e){atriumAnalyser=null;}}
function playAtriumLine(index){atriumClips.forEach(a=>{a.pause();a.currentTime=0;a.muted=muted;});const a=atriumClips[index];a.play().catch(()=>{});}
function atriumMouthLevel(){if(!atriumAnalyser)return 0;atriumAnalyser.getByteTimeDomainData(atriumSamples);let sum=0;for(const n of atriumSamples)sum+=((n-128)/128)**2;return Math.min(1,Math.sqrt(sum/atriumSamples.length)*6);}
const alissaVowAudio=new Audio('assets/audio/clip-5f6780781f80.mp3');alissaVowAudio.preload='auto';let alissaVowSource=null;
let atriumScene=null;
const atriumDialogue=[
 ['PETER CHAMBERS','Someone’s at the entrance.'],
 ['JOSIAH RICHARDS','Then let them in.'],
 ['PETER CHAMBERS','And if they restore the power?'],
 ['JOSIAH RICHARDS','Sixteen relays. Two floors. They won’t get far.'],
 ['PETER CHAMBERS','I’ll take the galleries. You take the atrium.'],
 ['JOSIAH RICHARDS','Bring them to me.']
];
function clearAtriumScene(){clearAlissaAlley();
 $('atriumCutscene').hidden=true;$('atriumSpeaker').style.color='';if(atriumScene?.vowStarted){alissa.userData.head.rotation.set(0,0,0);resetHunterMotion(alissa);alissa.userData.arms[0].rotation.z=0;}atriumClips.forEach(a=>{a.pause();a.currentTime=0;});if(!atriumScene)return;
 for(const a of [subject,peter])if(a.userData.mouth)a.userData.mouth.visible=true;
 for(const m of atriumScene.mouths){m.parent.remove(m);m.geometry.dispose();m.material.dispose();}
 scene.remove(atriumScene.light);atriumScene.light.dispose();
 for(const a of [subject,peter]){a.userData.head.rotation.set(0,0,0);resetHunterMotion(a);}
 atriumScene=null;
}
function start(){if(!chapterLoadingBypass)return loadChapterScreen('ENTER BRENT CROSS',()=>start());
 clearAtriumScene();resetFloors();resetHunterMotion(subject);resetHunterMotion(peter);resetPeterPose();
 setMode('cinematic');initAudio();prepareAtriumAudio();document.exitPointerLock?.();
 world.visible=true;upperWorld.visible=false;exhibit.visible=false;subject.visible=peter.visible=true;alissa.visible=gareth.visible=questCase.visible=false;
 subject.position.set(138,0,112);peter.position.set(142,0,112.6);subject.rotation.set(0,Math.PI/2,0);peter.rotation.set(0,-Math.PI/2,0);
 subject.scale.setScalar(1);peter.scale.setScalar(1);ambient.intensity=.32;scene.fog.density=.0065;flash.visible=false;cameraFill.intensity=0;
 const light=new THREE.PointLight(0xaac6df,18,16,1.5);light.position.set(140,4,115);scene.add(light);
 const mouths=[subject,peter].map(a=>{const m=ball(a.userData.head,.09,.006,.005,new THREE.MeshBasicMaterial({color:0x281114}),a===subject?.02:0,a===subject?-.247:-.226,a===subject?.325:.309);m.visible=false;return m;});
 atriumScene={time:0,lineTime:0,shot:0,started:false,light,mouths};$('atriumCutscene').hidden=false;renderAtriumScene(0);
}
function finishAtriumScene(){if(mode!=='cinematic')return;clearAtriumScene();startGameplay();}
function clearAlissaAlley(){
 alissaVowAudio.pause();alissaVowAudio.currentTime=0;
 const c=atriumScene;if(!c)return;
 if(c.alley){scene.remove(c.alley);c.alley.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});}
 if(c.vowMouth){c.vowMouth.parent.remove(c.vowMouth);c.vowMouth.geometry.dispose();c.vowMouth.material.dispose();}
 alissa.userData.muzzle.visible=false;alissa.userData.head.rotation.set(0,0,0);alissa.userData.arms[0].rotation.z=0;
 $('atriumCutscene').style.background='';
}
function renderAlissaVow(c){
 if(!c.vowStarted){
  c.vowStarted=true;atriumClips.forEach(a=>a.pause());c.mouths.forEach(m=>m.visible=false);
  world.visible=upperWorld.visible=false;subject.visible=peter.visible=false;alissa.visible=true;
  alissa.position.set(0,0,0);alissa.rotation.set(0,0,0);alissa.scale.setScalar(1);resetHunterMotion(alissa);
  const alley=new THREE.Group();scene.add(alley);c.alley=alley;
  const brick=mat(0x29232b),paving=mat(0x11141b),steel=mat(0x232e35);
  box(alley,7,.2,24,paving,0,-.15,2);box(alley,.4,7,24,brick,-3.2,3.4,2);box(alley,.4,7,24,brick,3.2,3.4,2);box(alley,6.5,7,.3,brick,0,3.4,-8);
  for(let y=.4;y<7;y+=.45){box(alley,.015,.025,24,mat(0x151319),-2.985,y,2);box(alley,.015,.025,24,mat(0x151319),2.985,y,2);}
  for(const z of [-5,-1,4,8]){box(alley,.09,6,.1,steel,-2.9,3,z);box(alley,.6,.8,.35,steel,2.7,.4,z);}
  box(alley,1.3,1.3,1.2,mat(0x27352d),-2.1,.65,-2);box(alley,1.45,.1,1.3,steel,-2.1,1.33,-2);
  const label=sign('SERVICE ACCESS','#937d85','#160c15',2.2);label.position.set(0,3,-7.8);alley.add(label);
  c.light.position.set(1.5,4,3);c.light.color.setHex(0xadc5e6);c.light.intensity=22;ambient.intensity=.25;
  c.vowMouth=ball(alissa.userData.head,.064,.008,.004,new THREE.MeshBasicMaterial({color:0x2b121c}),0,-.198,.256);c.vowMouth.visible=false;
  if(audioCtx&&atriumAnalyser&&!alissaVowSource){try{alissaVowSource=audioCtx.createMediaElementSource(alissaVowAudio);alissaVowSource.connect(atriumAnalyser);}catch(e){}}
  alissaVowAudio.currentTime=0;alissaVowAudio.muted=muted;alissaVowAudio.play().catch(()=>{});
  $('atriumSpeaker').textContent='ALISSA “THE VIPER” ROBERTS';$('atriumSpeaker').style.color='#ffe34b';
  $('atriumLine').textContent='Mother, I will swear on your life that I will assassinate the Prime Secretary!';
 }
 const t=c.lineTime,duration=Number.isFinite(alissaVowAudio.duration)?alissaVowAudio.duration:7;
 if(c.gunTime===undefined&&(alissaVowAudio.ended||t>duration+1))c.gunTime=t;
 const ending=c.gunTime===undefined?-1:t-c.gunTime;
 animateCharacter(t,false,false,alissa);poseAlissaGun(false);
 const level=atriumMouthLevel();c.vowMouth.visible=ending<0&&!alissaVowAudio.paused&&level>.05;c.vowMouth.scale.y=.005+level*.018;
 if(ending>=0){c.vowMouth.visible=false;alissa.userData.arms[1].rotation.x=-.45-Math.min(1,ending/.35)*(Math.PI/2-.45);alissa.userData.arms[0].rotation.x=-1.1;}
 camera.position.set(.05,1.8,3.2-Math.min(t,8)*.025);camera.lookAt(0,1.85,0);camera.rotation.z=0;
 if(ending>=.4&&!c.fired){c.fired=true;alissa.userData.muzzle.visible=true;c.light.intensity=110;playGunshot(.75);$('atriumCutscene').style.background='rgba(255,225,185,.65)';}
 if(ending>.48){alissa.userData.muzzle.visible=false;c.light.intensity=22;$('atriumCutscene').style.background='#030205';}
 $('atriumProgress').style.width=((6+Math.min(1,t/(duration+.8)))/7*100)+'%';
 if(ending>=.75)finishAtriumScene();
}

function renderAtriumScene(dt){
 const c=atriumScene;if(!c)return;c.time+=dt;
 c.lineTime+=dt;
 if(c.shot===atriumDialogue.length){renderAlissaVow(c);return;}
 if(!c.started){c.started=true;playAtriumLine(c.shot);$('atriumSpeaker').textContent=atriumDialogue[c.shot][0];$('atriumLine').textContent=atriumDialogue[c.shot][1];}
 const audio=atriumClips[c.shot],duration=Number.isFinite(audio.duration)&&audio.duration>0?audio.duration:4;
 if((audio.ended&&c.lineTime>=.3)||c.lineTime>duration+1){c.shot++;c.lineTime=0;c.started=false;if(c.shot>atriumDialogue.length){finishAtriumScene();return;}renderAtriumScene(0);return;}
 const shot=c.shot,speaking=shot%2===0?peter:subject,other=speaking===peter?subject:peter,t=Math.min(2.6,c.lineTime);
 for(const a of [subject,peter]){animateCharacter(c.time,false,false,a);a.userData.head.rotation.y=a===speaking?Math.sin(c.time*3)*.05:0;}
 speaking.userData.arms[shot%2].rotation.x=-.45-Math.sin(t*3)*.22;other.userData.arms[0].rotation.x=.04;
 const level=atriumMouthLevel();c.mouths.forEach((m,i)=>{const a=[subject,peter][i],open=a===speaking&&!audio.paused&&!audio.ended&&level>.035;m.visible=open;m.scale.y=.006+level*.021;if(a.userData.mouth)a.userData.mouth.visible=!open;});
 if(shot===0){camera.position.set(140+Math.sin(t*.3)*.6,2.3,118-t*.45);camera.lookAt(140,1.65,112);}
 else if(shot===4){camera.position.set(137+t*.5,1.55,115.5);camera.lookAt(142,1.95,112.6);}
 else {const s=speaking===subject?1:-1;camera.position.set(speaking.position.x+s*(2.5-t*.12),2.25,speaking.position.z+1.1);camera.lookAt(speaking.position.x,2.05,speaking.position.z);}
 camera.rotation.z=Math.sin(t*2)*.008;$('atriumProgress').style.width=((c.shot+Math.min(1,c.lineTime/duration))/(atriumDialogue.length+1)*100)+'%';
}

const SAVE_KEY='project-bc-progress-v1';
function loadProgress(){try{const v=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{};}catch(e){return {};}}
let gameProgress=loadProgress(),saveAvailable=true,cabinetScene=null;
if(gameProgress.kevinSolarAftermath===true)selectedSubject=6;
function saveProgress(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(gameProgress));saveAvailable=true;}catch(e){saveAvailable=false;}}
// Discard the earlier development unlock unless a real escape was recorded.
if(gameProgress.cabinetUnlockRequested){gameProgress.brentCrossCompleted=Number.isFinite(gameProgress.bestTime)&&gameProgress.bestTime>=0;gameProgress.cabinetUnlocked=gameProgress.brentCrossCompleted;delete gameProgress.cabinetUnlockRequested;saveProgress();}
// Remove the temporary playtest override while preserving earned completion.
if(gameProgress.cabinetPlaytestUnlocked){delete gameProgress.cabinetPlaytestUnlocked;saveProgress();}
try{localStorage.removeItem('project-bc-cabinet-playtest-20260915');}catch(e){}
function stephenIsDeceased(){return gameProgress.brentCrossCompleted===true&&(gameProgress.garethQuestCompleted===true?gameProgress.stephenLoyalDeathConfirmed===true:(gameProgress.stephenFallWitnessed===true||gameProgress.a5EscapeCompleted===true));}
function garethRemainsAlly(){return !gameProgress.brentCrossCompleted||gameProgress.garethQuestCompleted===true;}
function updateCharacterOutcomes(){
 document.querySelectorAll('.gareth-dot').forEach(e=>{e.textContent=garethRemainsAlly()?'■ GARETH / ALLY':'■ GARETH / NOT ALLIED';e.style.color=garethRemainsAlly()?'#53b9ff':'#b6abb9';});
 selectSubject(selectedSubject);
}
// Remove the discarded shooting outcome from older saves.
if('stephenKilled' in gameProgress){delete gameProgress.stephenKilled;saveProgress();}
function canOpenCivil(){return !isKevinStoryRoute()&&gameProgress.brentCrossCompleted===true&&gameProgress.garethQuestCompleted===true&&(gameProgress.loyalPursuitCompleted===true||gameProgress.cabinetCompleted===true);}
const commonsDialogue=[
 ['ELIZABETH STERLING','Prime Secretary. You arrive wounded, with half the city watching. What happened?',7],
 ['PETER CHAMBERS','They destroyed the car. We made it here before they could finish the job.',6],
 ['JOSIAH RICHARDS',"Spare me that concerned little performance, Sterling. You Labour Party politicians smell blood and immediately start rehearsing your speeches.",9],
 ['ELIZABETH STERLING','Outside these walls, people are calling it resistance. Your enemies are no longer afraid of you.',7],
 ['JOSIAH RICHARDS',"Resistance? Listen to yourself. I despise politicians: all that sanctimonious bullshit, and never a spine between you. Your Labour Party would sell this country for a round of applause.",12],
 ['PETER CHAMBERS','Gareth is with them. So is Alissa. They will follow us to Westminster.',6],
 ['ELIZABETH STERLING','Then stop pretending this is contained. Parliament Square will be the next place they gather.',7],
 ['JOSIAH RICHARDS',"Peter, seal the approaches. And you, Sterling, keep your bloody campaign slogans out of my chamber. You are here because I tolerate you. Do not mistake that for respect.",11]
];
const commonsClips=["assets/audio/clip-a848af1f3de1.mp3","assets/audio/clip-6a69fc3d499e.mp3","assets/audio/clip-5f6388ec79de.mp3","assets/audio/clip-4b45e176556e.mp3","assets/audio/clip-02f8fa876ca2.mp3","assets/audio/clip-4ae39f20c544.mp3","assets/audio/clip-a5f43d9c689e.mp3","assets/audio/clip-78bc0332c90c.mp3","assets/audio/clip-a3fad7ab02ae.mp3"].map(src=>{const a=new Audio(src);a.preload='auto';a.volume=.9;return a;});
let commonsAnalyser=null,commonsSamples=null;const commonsAudioSources=new WeakMap();
function prepareCommonsLipAudio(){initAudio();if(!audioCtx)return;try{if(!commonsAnalyser){commonsAnalyser=audioCtx.createAnalyser();commonsAnalyser.fftSize=256;commonsSamples=new Uint8Array(256);commonsAnalyser.connect(audioCtx.destination);}for(const clip of commonsClips){if(!commonsAudioSources.has(clip)){const source=audioCtx.createMediaElementSource(clip);source.connect(commonsAnalyser);commonsAudioSources.set(clip,source);}}}catch(e){}}
function updateCommonsMouths(c,speaker,dt){
 if(!c.mouths)c.mouths=[subject,peter,c.elizabeth].map((actor,i)=>{const m=ball(actor.userData.head,i===2?.062:.085,.006,.006,new THREE.MeshBasicMaterial({color:0x291018}),i===0?.02:0,i===0?-.247:i===1?-.226:-.198,i===0?.33:i===1?.315:.26);m.visible=false;return {actor,m};});
 const clip=commonsClipAt(c.line);let level=0;
 if(!clip.paused&&!clip.ended&&!c.voiceFailed){if(commonsAnalyser){commonsAnalyser.getByteTimeDomainData(commonsSamples);let sum=0;for(const n of commonsSamples)sum+=((n-128)/128)**2;level=Math.min(1,Math.sqrt(sum/commonsSamples.length)*7);}else level=.25+Math.abs(Math.sin(clip.currentTime*16))*.35;}
 const index=speaker==='JOSIAH RICHARDS'?0:speaker==='PETER CHAMBERS'?1:2;
 c.mouths.forEach(({actor,m},i)=>{const open=i===index&&level>.025;m.visible=open;m.scale.y=.006+level*.026;if(actor.userData.mouth)actor.userData.mouth.visible=!open;if(actor.userData.openMouth)actor.userData.openMouth.visible=false;});
}
function clearCommonsMouths(c){for(const {actor,m} of c?.mouths||[]){m.parent?.remove(m);m.geometry.dispose();m.material.dispose();if(actor.userData.mouth)actor.userData.mouth.visible=true;}}
function commonsClipAt(index){return commonsClips[index===5&&gameProgress.stephenRescued===true&&!stephenIsDeceased()?8:index];}
function stopCommonsVoice(){commonsClips.forEach(a=>{a.pause();a.currentTime=0;});}
function startCommonsVoice(c){stopCommonsVoice();c.voiceLine=c.line;c.voiceFailed=false;const clip=commonsClipAt(c.line);clip.muted=muted;try{const pending=clip.play();if(pending?.catch)pending.catch(()=>{if(civilScene===c&&c.voiceLine===c.line)c.voiceFailed=true;});}catch(e){c.voiceFailed=true;}}
function commonsVoiceDuration(c){const clip=commonsClipAt(c.line);return Number.isFinite(clip.duration)&&clip.duration>0?clip.duration:commonsLineAt(c.line)[2];}
function commonsLineAt(index){const entry=commonsDialogue[index];if(entry[0]==='PETER CHAMBERS'&&entry[1].startsWith('Gareth is with them.')&&gameProgress.stephenRescued===true&&!stephenIsDeceased())return [entry[0],'Gareth is with them, and so are Stephen and Alissa. They will follow us to Westminster.',7];return entry;}
function refreshChapterThree(){
 const decided=gameProgress.brentCrossCompleted===true,loyal=gameProgress.garethQuestCompleted===true;const civilUnlocked=canOpenCivil(),civilButton=$('openCivil');civilButton.disabled=!civilUnlocked;civilButton.textContent=civilUnlocked?'PLAY CIVIL DISOBEDIENCE':'🔒 COMPLETE OPERATION: CABINET FIRST';civilButton.setAttribute('aria-disabled',String(!civilUnlocked));civilButton.title=civilUnlocked?'Open the House of Commons cutscene':'Finish Operation: Cabinet on the RESISTANCE route to unlock';
 $('chapter3Loyal').hidden=!civilUnlocked;$('chapter3Hostile').hidden=!decided||loyal||gameProgress.a5EscapeCompleted!==true;
 for(const [id,route,done] of [['chapter3LoyalState',true,canOpenCivil()],['chapter3HostileState',false,gameProgress.a5EscapeCompleted]]){
 $(id).textContent=!decided?'ROUTE DEPENDS ON GARETH’S QUEST':loyal!==route?'UNAVAILABLE ON THIS ROUTE':done?(route?'UNLOCKED / OPENING SCENE':'UNLOCKED / BOARD THE TRAIN'):'COMPLETE OPERATION: CABINET FIRST';
 }
 if(gameProgress.tubeCompleted===true)$('chapter3HostileState').textContent='COMPLETE / TUBE';$('chapter3HostileEyebrow').textContent=gameProgress.kevinRouteStarted===true?'CHAPTER 03 / KEVIN ROUTE':'CHAPTER 03 / TYRANT';
}
function refreshChapterFour(){refreshUxbridgeChapter();$('chapter4KevinBusters').hidden=!canOpenBusters();$('openBusters').disabled=!canOpenBusters();$('chapter4KevinBustersState').textContent=gameProgress.pindarCompleted?'COMPLETE / REPLAY FROM OPENING CUTSCENE':'UNLOCKED / OPENING CUTSCENE';const resistance=!isKevinStoryRoute()&&gameProgress.brentCrossCompleted===true&&gameProgress.garethQuestCompleted===true,unlocked=resistance&&gameProgress.civilDisobedienceSurvived===true;$('chapter4Resistance').hidden=!unlocked;$('openCorneredRat').hidden=!unlocked;$('chapter4State').textContent=unlocked?'UNLOCKED / 100 ROOMS':'🔒 COMPLETE CIVIL DISOBEDIENCE FIRST';$('openCorneredRat').disabled=!unlocked;$('openCorneredRat').setAttribute('aria-disabled',String(!unlocked));}
function chapterFiveTitle(){if(gameProgress.emmaShot===true)return 'THE SECRETARY IS DEAD';if(gameProgress.corneredRatRoomsCompleted>=100&&gameProgress.mariahFreed!==true&&gameProgress.emmaRescued!==true)return 'SIEGE OF BRENT CROSS';return 'THE PRIME SECRETARY';}
function buildSecretaryRearMeeting(c){const rear=new THREE.Group(),east=new THREE.Group();c.root.add(rear,east);rear.position.set(40*CELL,0,-8);east.position.set(83*CELL,0,37*CELL);c.rearScene=rear;c.eastScene=east;rear.visible=east.visible=false;
 for(const site of [rear,east]){box(site,30,.2,24,mat(0x171a20),0,-.15,0);box(site,30,8,.6,mat(0x302b31),0,4,8);for(const x of [-12,-4,4,12]){box(site,.35,8,.8,mat(0x55505a),x,4,7.8);box(site,3,2,.1,mat(0x18222b),x,5,7.65);}for(const x of [-11,11]){box(site,2,1.3,1.3,mat(0x3a4742),x,.65,5);box(site,2.1,.1,1.4,mat(0x161e1d),x,1.33,5);}const lamp=new THREE.PointLight(0xadbcd4,27,30,1.4);lamp.position.set(0,5,2);site.add(lamp);}
 const service=sign('BRENT CROSS / REAR SERVICE ACCESS','#cab9c3','#1c121d',7);service.position.set(0,4,7.5);service.rotation.y=Math.PI;rear.add(service);
 const roster=[['ELIZABETH STERLING',makeElizabethSterling(),0,3],['GARETH WILLIAMS',makeGareth(),-2,-1],['GARETH JONES',makeJonesOrEmma(false),-3.5,1],['MARIAH BANU',makeMariahBanu(),1.8,-.4],['ALISSA ROBERTS',makeAlissa(),3.3,1]];c.rearCast={};roster.forEach(([name,actor,x,z],i)=>{rear.add(actor);actor.position.set(x,0,z);actor.rotation.y=i?Math.atan2(-x,3-z):Math.PI;c.rearCast[name]=actor;});
 c.eastKevin=makeRevealedKevin();east.add(c.eastKevin);c.eastKevin.position.set(0,0,2);c.eastKevin.rotation.y=Math.PI;c.eastNinjas=[];for(let i=0;i<8;i++){const actor=makeCampNinja();east.add(actor);actor.position.set((i%4-1.5)*2.1,0,4+Math.floor(i/4)*2);actor.rotation.y=Math.PI;c.eastNinjas.push(actor);}
}
const secretaryRearLines=[['BRENT CROSS COMPLEX / REAR SERVICE ACCESS','You regroup with Gareth Williams, Gareth Jones, Mariah Banu and Alissa. Elizabeth Sterling is waiting.'],['GARETH WILLIAMS','Sterling. No more statements. No more excuses. You have some explaining to do.'],['ELIZABETH STERLING','I know. I stood beside him and let the title do the talking. I cannot pretend I did not see what he was becoming.'],['MARIAH BANU','Then tell us something useful. Who is inside, and how do we reach him?'],['ELIZABETH STERLING','PSRM soldiers hold the concourses. Josiah is in the atrium. I came through the service entrance, but you will not get everyone through unnoticed.'],['GARETH JONES','You expect us to trust you after everything that happened?'],['ELIZABETH STERLING','No. Keep me here. Ask your questions. But do not mistake his grief for surrender.'],['ALISSA ROBERTS','Then start talking. Every entrance. Every guard. Everything you know.'],['BRENT CROSS COMPLEX / EAST SIDE','Meanwhile, Kevin Murderhorn and his ninjas gather on the eastern approach.'],['KEVIN MURDERHORN','Police at the front. A reunion at the back. How considerate. Let them keep each other busy.']];
function updateSecretaryRearLips(c,dt){const speaker=secretaryOpeningLineAt(c.line)[0],level=secretaryVoiceLevel(c);if(!c.rearMouths)c.rearMouths=Object.entries(c.rearCast).map(([name,actor])=>{const [y,z,width]=name==='GARETH WILLIAMS'?[-.223,.286,.075]:name==='GARETH JONES'?[-.205,.274,.07]:name==='ALISSA ROBERTS'?[-.198,.267,.06]:name==='MARIAH BANU'?[-.21,.267,.055]:[-.198,.269,.062];const mouth=ball(actor.userData.head,width,.006,.009,new THREE.MeshBasicMaterial({color:0x281016}),0,y,z);mouth.visible=false;return {name,actor,mouth,level:0};});for(const e of c.rearMouths){const target=e.name===speaker?level:0;e.level+=(target-e.level)*Math.min(1,dt*22);const open=target>.018&&e.level>.015;e.mouth.visible=open;e.mouth.scale.y=.006+e.level*.033;if(e.actor.userData.mouth)e.actor.userData.mouth.visible=!open;}}
function renderSecretaryRear(c,dt){const beat=c.line-14,isEast=beat>=8,site=isEast?c.eastScene:c.rearScene;c.rearScene.visible=!isEast;c.eastScene.visible=isEast;c.mouth.visible=false;updateSecretaryRearLips(c,dt);const speaker=secretaryOpeningLineAt(c.line)[0];for(const [i,[name,actor]] of Object.entries(c.rearCast).entries()){animateCharacter(c.total+i,false,false,actor);if(name===speaker){actor.userData.head.rotation.y=Math.sin(c.total*2)*.05;actor.userData.arms[0].rotation.x=-.5-Math.sin(c.total*2)*.1;}}animateCharacter(c.total,false,false,c.eastKevin);c.eastNinjas.forEach((a,i)=>animateCharacter(c.total+i,false,false,a));
 // The camera occupies the player's place in the Resistance group.
 const focus=!isEast&&c.rearCast[speaker],target=focus?focus.position.clone().add(new THREE.Vector3(0,1.8,0)):new THREE.Vector3(0,1.5,isEast?3:1),offset=focus?new THREE.Vector3(focus.position.x*.3,1.75,-2.5):new THREE.Vector3(isEast?-6:0,isEast?2.7:1.7,isEast?-6:-3.4);const goal=offset.add(site.position),look=target.add(site.position);if(c.rearShot!==isEast){camera.position.copy(goal);c.look.copy(look);c.rearShot=isEast;}camera.position.lerp(goal,1-Math.exp(-dt*2));c.look.lerp(look,1-Math.exp(-dt*3));camera.lookAt(c.look);const duration=Math.max(5,secretaryOpeningLineAt(c.line)[1].length/14);$('secretaryOpeningProgress').style.width=Math.min(100,c.time/duration*100)+'%';if(secretaryVoiceDone(c,duration))advanceSecretaryOpening();}

let finalWar=null;
function finalWarCellOpen(x,z,floor=currentFloor){if(finalWar?.kevinSiegeRoute)return kevinSiegeCellOpen(x,z,floor);if(finalWar?.defenseRoute){if(grid[z]?.[x]!==0||floor===1&&z>=68)return false;return !(floor===0&&!finalWar.atriumReleased&&((x>=28&&x<=29||x>=51&&x<=52)&&z>=24&&z<=50||(z>=24&&z<=25||z>=49&&z<=50)&&x>=28&&x<=52));}if(grid[z]?.[x]!==0||floor===1&&z>=68)return false;if(floor===0&&((x>=28&&x<=29||x>=51&&x<=52)&&z>=24&&z<=50||(z>=24&&z<=25||z>=49&&z<=50)&&x>=28&&x<=52))return false;return !(Math.abs(x-40)<=1&&Math.abs(z-17)<=1);}
function finalWarWalkable(x,z,r=.3,floor=currentFloor){for(const dx of [-r,r])for(const dz of [-r,r])if(!finalWarCellOpen(Math.round((x+dx)/CELL),Math.round((z+dz)/CELL),floor))return false;return true;}
function finalWarNearest(x,z,floor=currentFloor){x=Math.round(x);z=Math.round(z);for(let r=0;r<N;r++)for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dz))!==r)continue;if(finalWarCellOpen(x+dx,z+dz,floor))return new THREE.Vector3((x+dx)*CELL,floor*9,(z+dz)*CELL);}return new THREE.Vector3(spawnCell.x*CELL,floor*9,spawnCell.z*CELL);}
function finalWarPath(from,to,keepOutside=false){const open=(x,z,floor)=>finalWarCellOpen(x,z,floor)&&(!keepOutside||!defenseAtriumBuffer(x,z));const floor=from.y>=8?1:0;if((to.y>=8?1:0)!==floor)return [];const a=cell(from),b=cell(to),start=a.z*N+a.x,end=b.z*N+b.x;if(!open(a.x,a.z,floor)||!open(b.x,b.z,floor))return [];const previous=new Int32Array(N*N).fill(-1),queue=new Int32Array(N*N);let read=0,write=1;queue[0]=start;previous[start]=start;while(read<write){const id=queue[read++];if(id===end)break;const x=id%N,z=Math.floor(id/N);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,nz=z+dz,ni=nz*N+nx;if(open(nx,nz,floor)&&previous[ni]===-1){previous[ni]=id;queue[write++]=ni;}}}if(previous[end]===-1)return [];const path=[];for(let id=end;id!==start;id=previous[id])path.push(new THREE.Vector3((id%N)*CELL,floor*9,Math.floor(id/N)*CELL));return path.reverse();}
function finalWarSight(a,b){const floor=a.y>=8?1:0;if((b.y>=8?1:0)!==floor)return false;const distance=Math.hypot(a.x-b.x,a.z-b.z),steps=Math.ceil(distance/.55);for(let i=1;i<steps;i++){const t=i/steps;if(!finalWarWalkable(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t,0,floor))return false;}return true;}
function finalWarHostile(a,b){if(a===b)return false;if(finalWar?.kevinSiegeRoute)return true;if(finalWar?.defenseRoute)return true;if(finalWar?.siegeRoute)return true;if(finalWar?.primeRoute&&((a==='red'&&(b==='blue'||b==='green'))||(b==='red'&&(a==='blue'||a==='green'))))return false;if((a==='blue'&&b==='green')||(a==='green'&&b==='blue'))return false;return true;}
const kevinWarAudio=[new Audio("assets/audio/clip-b54ea5e5b0af.mp3"),new Audio("assets/audio/clip-a41095084bcb.mp3"),new Audio("assets/audio/clip-c6960ba6b02b.mp3"),new Audio("assets/audio/clip-b56dcc934458.mp3"),new Audio("assets/audio/clip-cfaf7af89e4a.mp3"),new Audio("assets/audio/clip-0e55852275e0.mp3"),new Audio("assets/audio/clip-4aca04504b4c.mp3")];
let kevinWarVoice=null;
function stopKevinWarVoice(){if(kevinWarVoice){kevinWarVoice.pause();kevinWarVoice.currentTime=0;kevinWarVoice=null;}}
const kevinFinalAudio=[new Audio("assets/audio/clip-68f040861491.mp3"),new Audio("assets/audio/clip-4e490b703d95.mp3"),new Audio("assets/audio/clip-7e24bb61adbf.mp3"),new Audio("assets/audio/clip-723922150ffa.mp3"),new Audio("assets/audio/clip-701221a333a8.mp3"),new Audio("assets/audio/clip-748f80cc7c70.mp3"),new Audio("assets/audio/clip-3a27ebdb73a8.mp3"),new Audio("assets/audio/clip-c57f840902e8.mp3"),new Audio("assets/audio/clip-4a2fc832f6f9.mp3"),new Audio("assets/audio/clip-4a4945aa4f84.mp3")];
function playKevinWarVoice(index,finalBoss=false){stopKevinWarVoice();const pool=finalBoss?kevinFinalAudio:kevinWarAudio,a=pool[index%pool.length];kevinWarVoice=a;a.muted=muted;const promise=a.play();if(promise?.catch)promise.catch(()=>{if(kevinWarVoice===a)kevinWarVoice=null;});}
const kevinWarLines=[
'For the past twenty years, I have been a slave to others. First in Japan, now England. I am fucking done taking orders.',
'Come closer. I want to see your face when you realise nobody is coming to save you.',
'You brought your friends? Good. Now you can watch each other fucking fall.',
'That thing behind me? It does not feel pity. Neither do I.',
'Run. Go on. The chains make such a lovely sound when they catch up.',
'Keep shooting, you desperate little bastard. I want you to believe you have a chance.',
'No masters. No orders. Just me, you, and a very fucking long night.'
];
function makeKevinWarSpectre(u){const root=new THREE.Group(),dark=new THREE.MeshStandardMaterial({color:0x030207,emissive:0x171020,roughness:.5,transparent:true,opacity:.88});finalWar.root.add(root);box(root,.95,1.3,.5,dark,0,2,0);box(root,.58,.65,.5,dark,0,3,0);for(const side of [-1,1]){box(root,.32,1.55,.35,dark,side*.7,1.9,0);box(root,.36,1.1,.38,dark,side*.27,.85,0);box(root,.15,.045,.025,new THREE.MeshBasicMaterial({color:0xbfa9d6}),side*.13,3.06,.26);}u.spectre=root;return root;}
function kevinWarBeam(a,b,chain=false,gold=null){const group=new THREE.Group(),delta=b.clone().sub(a),length=delta.length();if(length<.01)return;const direction=delta.clone().normalize(),rotation=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),direction);if(chain){for(let d=0;d<length;d+=.45){const link=new THREE.Mesh(new THREE.TorusGeometry(.15,.045,5,8),new THREE.MeshStandardMaterial({color:gold||0x050409,emissive:gold?0x624311:0x34283d}));link.position.copy(a).addScaledVector(direction,d);link.quaternion.copy(rotation);link.rotateX(Math.PI/2);link.rotateY(Math.round(d/.45)%2*Math.PI/2);group.add(link);}}else{for(const [radius,color,opacity] of [[.19,0x786184,.3],[.095,0x010102,1]]){const beam=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,length,8),new THREE.MeshBasicMaterial({color,transparent:opacity<1,opacity}));beam.position.copy(a).add(b).multiplyScalar(.5);beam.quaternion.copy(rotation);group.add(beam);}}finalWar.root.add(group);finalWar.effects.push({obj:group,life:chain?.65:.4,floor:a.y>=8?1:0});}
function updateKevinWar(u,dt,visible,pos){const w=finalWar,ghost=u.spectre||makeKevinWarSpectre(u);ghost.position.copy(u.actor.position).add(new THREE.Vector3(-Math.sin(u.actor.rotation.y)*1.2,.15+Math.sin(w.time*3)*.12,-Math.cos(u.actor.rotation.y)*1.2));ghost.rotation.y=u.actor.rotation.y;ghost.visible=u.floor===currentFloor;const near=!u.followerCombat&&u.actor.position.distanceTo(player)<24&&finalWarSight(u.actor.position,player);if(u.finalBoss&&u.finalSpeechPending&&(!kevinWarVoice||kevinWarVoice.ended)){u.finalSpeechPending=false;u.tauntAt=Math.max(u.tauntAt||0,w.time+5);}if(near&&(!kevinWarVoice||kevinWarVoice.ended)&&w.time>=(u.tauntAt||0)){const n=u.tauntIndex||0;playKevinWarVoice(n,!!u.finalBoss);$('finalWarKevinLine').textContent=(u.finalBoss?kevinFinalTaunts:kevinWarLines)[n%(u.finalBoss?kevinFinalTaunts:kevinWarLines).length];$('finalWarKevinDialogue').hidden=false;const speechTime=u.finalBoss?Math.max(10,$('finalWarKevinLine').textContent.split(/\s+/).length/2.6):(n===0?11:7);w.kevinTextUntil=w.time+speechTime;u.tauntIndex=n+1;u.finalSpeechPending=!!u.finalBoss;u.tauntAt=u.finalBoss?w.kevinTextUntil+5:w.time+(n===0?17:13);}
 if(u.cast){u.cast.warning.visible=u.floor===currentFloor;u.cast.left-=dt;u.actor.userData.arms.forEach(a=>a.rotation.x=-2.2);ghost.scale.setScalar(1.1);if(u.cast.left<=0){const c=u.cast;u.cast=null;disposeCampObject(c.warning);const end=c.point,from=u.actor.position.clone().add(new THREE.Vector3(0,1.6,0));if(finalWarSight(u.actor.position,end)){kevinWarBeam(from,end,c.chain);const t=c.target,tp=t.player?player:t.actor.position;if(t.hp>0&&finalWarHostile(u.faction,t.faction)&&tp.distanceTo(new THREE.Vector3(end.x,u.floor*9,end.z))<(c.chain?1.7:1.15)&&finalWarSight(u.actor.position,tp)){if(t.player)w.hp=Math.max(0,w.hp-(u.finalBoss?(c.chain?26:34):(c.chain?18:25)));else damageFinalWarUnit(t,c.chain?18:25);}}u.fire=u.finalBoss?.85:2.4;}return;}
 ghost.scale.setScalar(1);if(!u.dodge&&visible&&pos&&u.fire<=0){const point=pos.clone();point.y=u.floor*9+1.2;const warning=new THREE.Mesh(new THREE.RingGeometry(.85,1.05,32),new THREE.MeshBasicMaterial({color:0xb29bc8,side:THREE.DoubleSide,transparent:true,opacity:.65}));warning.rotation.x=-Math.PI/2;warning.position.set(point.x,u.floor*9+.08,point.z);w.root.add(warning);u.cast={point,target:u.target,chain:(u.attackIndex||0)%2===0,left:u.finalBoss?.75:1.05,warning};u.attackIndex=(u.attackIndex||0)+1;}}

function clearFinalWar(){clearKevinSiegeEnding();$('finalWarKevinHealth').querySelector('strong').firstChild.textContent='KEVIN MURDERHORN ';$('finalWarKevinBar').style.background='';stopChambersTheme();$('defenseEncounterHP')?.remove();clearMariahEncounter();stopDefenseIntroVoice();if(finalWar?.defenseIntro)$('tyrantCinema').hidden=true;$('finalWarRetry').hidden=false;$('finalWarEnd').querySelector('h2').textContent='YOU FELL AT BRENT CROSS';$('finalWarEnd').querySelector('p').textContent='Regroup with your allies and try again.';$('finalWarHUD').querySelector('.war-map p').innerHTML='<span style="color:#65b8ff">● RESISTANCE</span> · <span id="finalWarPoliceLegend" style="color:#5bdf8e">● POLICE</span><br><span style="color:#f33858">● PSRM</span> · <span style="color:#ffd44c">● KEVIN / NINJAS</span>';clearSiegeEnding();stopPeterKillTaunt();for(const id of ['siegePeterUI','siegePeterHealth','siegePeterTaunt','siegeEnd'])$(id).hidden=true;$('finalWarHUD').className='';$('finalWarHUD').querySelector('h3').textContent='BRENT CROSS / FOUR-WAY WAR';$('finalWarHUD').querySelector('.war-keys').textContent='WASD MOVE · SHIFT SPRINT · CLICK / Z FIRE · R RELOAD · F FLASHLIGHT · ESC PAUSE · WHITE CRATES RESTORE HEALTH';for(const id of ['kevinPatternHUD','kevinChainUI','kevinChainFailure','primePeaceOutro'])$(id).hidden=true;$('primeKevinVictory').hidden=true;$('primeSecretaryEnd').hidden=true;$('primeReunionUI').hidden=true;clearJosiahCosmos();stopJosiahFinalVoice();stopKevinWarVoice();if(!finalWar)return;restoreAtriumCast();upperWorld.position.y=0;if(finalWar.gun)disposeCampObject(finalWar.gun);disposeCampObject(finalWar.root);scene.background.copy(finalWar.background);scene.fog.color.copy(finalWar.fogColor);finalWar=null;for(const id of ['finalWarHUD','finalWarPause','finalWarEnd','finalWarKevinDialogue','finalWarKevinHealth','josiahAtriumDialogue','josiahAtriumHealth'])$(id).hidden=true;}
function addFinalWarUnit(name,faction,actor,x,z,hp,kind='rifle',floor=0){const w=finalWar;w.root.add(actor);actor.visible=true;actor.position.copy(finalWarNearest(x,z,floor));actor.rotation.y=Math.PI;const unit={name,faction,actor,hp,maxHP:hp,kind,floor,path:[],repath:0,fire:Math.random(),hit:0,target:null,decision:0,base:actor.position.clone(),phase:Math.random()*TAU};if(kind==='ally'||kind==='police')unit.muzzle=finaleGun(actor);else unit.muzzle=actor.userData.muzzle;w.units.push(unit);return unit;}
function startFinalWar(cinematicStart=false,defenseRoute=false,kevinSiege=false){if(kevinSiege?!canOpenKevinSiege():defenseRoute?!canOpenDefense():!canOpenFinalWar())return;clearSecretaryOpening();clearFinalWar();clearCorneredRooms();setMode('finalWar');currentFloor=0;player.y=0;upperWorld.position.y=9;world.visible=true;upperWorld.visible=false;exhibit.visible=false;flash.visible=true;flash.intensity=35;ambient.intensity=.38;cameraFill.intensity=.15;keys.clear();const root=new THREE.Group();scene.add(root);finalWar={root,units:[],effects:[],kevinSiegeRoute:kevinSiege,time:0,hp:150,ammo:24,reload:0,fire:0,holding:false,paused:false,ended:false,kills:0,mapTime:0,aiSound:0,background:scene.background.clone(),fogColor:scene.fog.color.clone()};const w=finalWar;if(defenseRoute){setupDefenseBattle();return;}w.primeRoute=!kevinSiege&&isPrimeSecretaryRoute();w.siegeRoute=!kevinSiege&&isSiegeRoute();$('finalWarPoliceLegend').textContent=w.primeRoute?'● POLICE / MARSH / PINTER':'● POLICE';$('finalWarPoliceLegend').style.color=w.primeRoute?'#65b8ff':'#5bdf8e';$('finalWarHUD').querySelector('.eyebrow').textContent='FINAL CHAPTER / '+chapterFiveTitle();scene.background.setHex(0x070408);scene.fog.color.setHex(0x120b15);scene.fog.density=.005;player.copy(finalWarNearest(38,8));const origin=cell(player),reachable=new Set([origin.z*N+origin.x]),frontier=[origin];for(let n=0;n<frontier.length;n++){const v=frontier[n];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=v.x+dx,z=v.z+dz,id=z*N+x;if(finalWarCellOpen(x,z)&&!reachable.has(id)){reachable.add(id);frontier.push({x,z});}}}w.reachable=reachable;yaw=Math.PI;pitch=0;
 const wall=mat(0x42333b),steel=mat(0x1c1c24);const seals=new THREE.Group();root.add(seals);w.seals=seals;for(const x of [28.5,51.5]){box(seals,.7,12,25*CELL,wall,x*CELL,6,37*CELL);for(let z=25;z<=49;z+=2)box(seals,1,12,.35,steel,x*CELL,6,z*CELL);}for(const z of [24.5,49.5]){box(seals,23*CELL,12,.7,wall,40*CELL,6,z*CELL);for(let x=29;x<=51;x+=2)box(seals,.35,12,1,steel,x*CELL,6,z*CELL);}
 for(const l of liftCells.filter(l=>l.z!==57)){box(seals,3*CELL,4,3*CELL,steel,l.x*CELL,2,l.z*CELL);const label=sign('LIFT SEALED','#dfb7c2','#221019',3);label.position.set(l.x*CELL,2.5,(l.z+1.52)*CELL);seals.add(label);}
 const stock={root,x:exitCell.x*CELL,z:79*CELL};populateSecretaryBrentCross(stock);stock.soldiers.forEach(s=>disposeCampObject(s.actor));
 if(!kevinSiege){addFinalWarUnit('GARETH WILLIAMS','blue',makeGareth(),37,8,Infinity,'ally');if(!w.siegeRoute){addFinalWarUnit('GARETH JONES','blue',makeJonesOrEmma(false),39,8,Infinity,'ally');addFinalWarUnit('MARIAH BANU','blue',makeMariahBanu(),37,9,Infinity,'ally');}addFinalWarUnit('ALISSA','blue',makeAlissa(),39,9,Infinity,'ally');
 const policeFaction=w.primeRoute?'blue':'green';addFinalWarUnit(w.siegeRoute&&stephenLeadsFinalOpening()?'STEPHEN MARSH':'PINTER',policeFaction,w.siegeRoute&&stephenLeadsFinalOpening()?makeStephen():makeChrisPinter(),38,75,w.siegeRoute?300:Infinity,'police');if(w.primeRoute)addFinalWarUnit('STEPHEN MARSH','blue',makeStephen(),40,74,Infinity,'police');for(const [x,z] of [[35,74],[41,74],[32,69],[46,69],[40,63]])addFinalWarUnit('POLICE',policeFaction,makeChrisPinter(true),x,z,140,'police');

 const kevin=addFinalWarUnit('KEVIN','yellow',makeRevealedKevin(),65,17,2000,'kevin',1);w.kevin=kevin;
 const floorReach=[0,1].map(floor=>{const start=cell(finalWarNearest(40,57,floor)),seen=new Set([start.z*N+start.x]),queue=[start];for(let n=0;n<queue.length;n++)for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=queue[n].x+dx,z=queue[n].z+dz,id=z*N+x;if(finalWarCellOpen(x,z,floor)&&!seen.has(id)){seen.add(id);queue.push({x,z});}}return seen;});const used=new Set();for(const faction of ['red','yellow'])for(let i=0;i<30;i++){const floor=i%2,candidates=[];for(let z=7;z<66;z+=3)for(let x=7;x<75;x+=3){if(!finalWarCellOpen(x,z,floor)||x>=28&&x<=52&&z>=24&&z<=50||used.has(floor+':'+x+':'+z))continue;const at=new THREE.Vector3(x*CELL,floor*9,z*CELL);if(floor===1&&at.distanceTo(kevin.base)<35)continue;if(floor===0&&at.distanceTo(player)<20)continue;if(floorReach[floor].has(z*N+x))candidates.push([x,z]);}if(!candidates.length)throw Error('No faction spawn cell');const [x,z]=candidates[Math.floor(Math.random()*candidates.length)];used.add(floor+':'+x+':'+z);addFinalWarUnit(faction==='red'?'PSRM':'NINJA',faction,faction==='red'?makePSRMSoldier():makeCampNinja(),x,z,faction==='red'?120:85,faction==='red'?'rifle':'ninja',floor);}
 }buildFinalWarStairs();
 const josiah=makeCharacter();root.add(josiah);josiah.position.set(40*CELL,0,37*CELL+8);poseJosiahGrieving(josiah,!w.primeRoute&&!w.siegeRoute);w.josiah=josiah;w.josiahFloor=w.siegeRoute?1:0;if(w.siegeRoute)josiah.position.copy(finalWarNearest(43,57,1));
 const gun=new THREE.Group();camera.add(gun);gun.position.set(.3,-.27,-.6);box(gun,.13,.15,.48,mat(0x25232c),0,0,0);box(gun,.10,.22,.13,steel,0,-.14,.10);w.gun=gun;
 w.medkits=[[38,11],[20,57],[65,19],[42,72]].map(([x,z])=>{const model=new THREE.Group();root.add(model);model.position.copy(finalWarNearest(x,z));box(model,.7,.45,.45,mat(0xddddce),0,.3,0);box(model,.1,.25,.025,mat(0xa91a35),0,.3,.24);box(model,.3,.08,.025,mat(0xa91a35),0,.3,.24);return {model,ready:0};});
 if(kevinSiege)setupKevinSiegeForces();$('finalWarHUD').hidden=false;$('finalWarNotice').textContent=w.primeRoute?'PSRM HOLDING FIRE · RED FIGHTS YELLOW · SOUTH LIFT → ATRIUM STAIRS':'SOUTH LIFT → UPPER GALLERIES → ATRIUM STAIRS · KEVIN IS UPSTAIRS';if(w.siegeRoute){$('finalWarHUD').className='siege-war-hud';$('finalWarPoliceLegend').textContent='● POLICE / HOSTILE';$('finalWarHUD').querySelector('.war-keys').textContent='WASD MOVE · SHIFT SPRINT · CLICK / Z FIRE · R RELOAD · E SOUTH LIFT · ESC PAUSE · BLUE ALLIES ONLY';updateSiegeObjectives();}if(kevinSiege)updateKevinSiegeObjectives();if(!cinematicStart)requestLock();syncMenuSong();renderFinalWar(0);}
const josiahFinalIntroAudio=[new Audio("assets/audio/clip-03acf375bc11.mp3"),new Audio("assets/audio/clip-9672e7f13cec.mp3"),new Audio("assets/audio/clip-051f3a72b8c6.mp3"),new Audio("assets/audio/clip-50f2fa5ce23f.mp3"),new Audio("assets/audio/clip-a794ce95ff12.mp3"),new Audio("assets/audio/clip-78acda696d6b.mp3"),new Audio("assets/audio/clip-d6c95935b8f2.mp3")];
const josiahFinalCombatAudio=[new Audio("assets/audio/clip-8e9a4896beac.mp3"),new Audio("assets/audio/clip-707b22b27c5b.mp3"),new Audio("assets/audio/clip-3505c52e6c35.mp3"),new Audio("assets/audio/clip-fbb23d3e0f5e.mp3"),new Audio("assets/audio/clip-d971cef06dd8.mp3"),new Audio("assets/audio/clip-74ee7bd308be.mp3"),new Audio("assets/audio/clip-426e5b6da802.mp3"),new Audio("assets/audio/clip-1b9ad1eed880.mp3"),new Audio("assets/audio/clip-b1ee546c2678.mp3"),new Audio("assets/audio/clip-14ba5b1b070d.mp3")];
let josiahFinalVoice=null;
function stopJosiahFinalVoice(){if(josiahFinalVoice){josiahFinalVoice.audio.pause();josiahFinalVoice.audio.currentTime=0;josiahFinalVoice=null;}}
function playJosiahFinalVoice(combat,index){stopJosiahFinalVoice();const audio=(combat?(finalWar?.kevinSiegeRoute?kevinSiegeJosiahCombatAudio:finalWar?.siegeRoute?siegeJosiahCombatAudio:josiahFinalCombatAudio):josiahFinalIntroAudio)[index],v={audio,failed:false,elapsed:0};josiahFinalVoice=v;audio.muted=muted;try{audio.play()?.catch(()=>{v.failed=true;});}catch(e){v.failed=true;}}
function tickJosiahFinalVoice(dt,fallback){const v=josiahFinalVoice;if(!v)return true;v.elapsed+=dt;v.audio.muted=muted;const duration=v.audio.duration;return v.audio.ended&&v.elapsed>.15||v.failed&&v.elapsed>=fallback||v.elapsed>(Number.isFinite(duration)&&duration>0?duration+8:Math.max(90,fallback+15));}
const josiahAtriumLines=[
 ['JOSIAH RICHARDS','You came all this way. Through my soldiers. Through my walls. Jones… you brought them here?'],
 ['GARETH JONES','Josiah, you were my protégé. I taught you to serve this country. I never taught you to rule it through fear.'],
 ['JOSIAH RICHARDS','You taught me to keep my head down and wait my turn. I stopped waiting. Now Emma is dead, Peter betrayed me, and my own mentor stands with the people coming to finish me.'],
 ['MARIAH BANU','We came to stop you, Josiah. Surrender, and you will stand trial. No more soldiers dying for you. No more families torn apart.'],
 ['JOSIAH RICHARDS','A trial? With you restored to office and Jones there to tell them where I went wrong? Neither of you could take my power, so you come here offering me a cage.'],
 ['ALISSA ROBERTS','My mother never got that offer. You had her arrested and executed. Jones is still giving you a chance to surrender. Take it.'],
 ['JOSIAH RICHARDS','You want your old pupil back, Jones? Look at me. This is what I became. Union Crown—let them come and take me!']
];
const josiahAtriumTaunts=[
 'Politicians bicker and bicker. All talk, no action. I am the only one keeping this G7 country alive! I am trying to protect the world from Moscow and Beijing—and even Washington. And you would tear me down for it!',
 'You sat in meetings, Jones. You watched them bury every difficult decision beneath another report. You taught me how the machinery worked. Do not pretend to be shocked because I finally made it obey someone!',
 'Mariah, tell me what happens after your precious trial. Another election? Another smiling face promising change? While you count your votes, other powers are deciding what this country is allowed to become!',
 'You call this tyranny because you can see the chains. The people who owned this country before me kept theirs out of sight. At least I have the courage to stand here and admit that I intend to rule!',
 'Alissa, you want me to say I am sorry. You want a sentence that will make your mother’s death mean something. I cannot give you that. And now I cannot even find the words to make sense of Emma’s!',
 'Peter stood beside me. He knew every door, every weakness, every name I trusted. I gave him power, and he turned it on her. Do not stand there and tell me that trust would have saved us!',
 'I remember being your protégé, Jones. I remember waiting outside rooms while lesser men decided my future. You say I have changed. Of course I have changed. I swore I would never wait outside another door!',
 'Listen to yourselves. Arrest me. Try me. Replace me. Every one of you has a plan for the morning after I am gone. Not one of you has told me how you will keep this country standing through the night!',
 'Emma would have hated this. I know that. You do not have to tell me. But she is not here to ask me to stop, and I cannot bear to hear any of you speak as though you could take her place!',
 'You think I am fighting for an office now? A title on a door? Look around you! This is everything I have left. If you want to take it, come through the chains and take it from my fucking hands!'
];
function stageAtriumCast(){const w=finalWar,b=w.josiahEncounter;const p=w.josiah.position;b.cast={ 'JOSIAH RICHARDS':w.josiah };b.savedCast=[];for(const [i,u] of w.units.filter(u=>u.kind==='ally').entries()){b.savedCast.push({u,position:u.actor.position.clone(),rotation:u.actor.rotation.clone(),floor:u.floor});u.floor=0;u.actor.visible=true;u.actor.position.set(p.x-3+i*2,0,p.z+6);u.actor.rotation.set(0,Math.PI,0);b.cast[u.name==='ALISSA'?'ALISSA ROBERTS':u.name]=u.actor;}b.cameraPose=camera.position.clone();}
function restoreAtriumCast(){const b=finalWar?.josiahEncounter;if(!b)return;for(const e of b.savedCast||[]){e.u.actor.position.copy(e.position);e.u.actor.rotation.copy(e.rotation);e.u.floor=e.floor;e.u.actor.userData.arms.forEach(a=>a.visible=true);e.u.repath=0;e.u.path=[];}b.savedCast=[];}
function frameAtriumSpeaker(dt){const w=finalWar,b=w.josiahEncounter,speaker=josiahAtriumLines[b.line][0],actor=b.cast[speaker]||w.josiah,target=actor.position.clone().add(new THREE.Vector3(0,1.55,0)),front=speaker==='JOSIAH RICHARDS'?1:-1,shot=target.clone().add(new THREE.Vector3(2.1,.25,front*3.4));camera.position.lerp(shot,Math.min(1,dt*6));camera.lookAt(target);for(const a of Object.values(b.cast)){animateCharacter(b.time,false,false,a);const speaking=a===actor&&josiahFinalVoice&&!josiahFinalVoice.audio.paused&&!josiahFinalVoice.audio.ended;if(a.userData.openMouth){a.userData.openMouth.visible=!!speaking&&Math.sin(b.time*17)>.1;if(a.userData.mouth)a.userData.mouth.visible=!a.userData.openMouth.visible;}}}
const josiahDeathAudio=[new Audio("assets/audio/clip-57aec8800015.mp3"),new Audio("assets/audio/clip-c8977636800c.mp3"),new Audio("assets/audio/clip-0f7d38b24438.mp3"),new Audio("assets/audio/clip-114a9cd89050.mp3"),new Audio("assets/audio/clip-efb2ae036942.mp3")];
const josiahChoiceAudio=new Audio("assets/audio/clip-67453fe0bd57.mp3");
const josiahLastDefiance="I don’t fucking think so. You think you can close your hands around my throat and decide how my story ends? I will tear the sky open. I will pull every star from its place. If there is no world left where I can stand, then there will be no world left for any of you!";
function playJosiahDeathAudio(index){stopJosiahFinalVoice();const audio=josiahDeathAudio[index],v={audio,failed:false,elapsed:0};josiahFinalVoice=v;audio.muted=muted;try{audio.play()?.catch(()=>{v.failed=true;});}catch(e){v.failed=true;}}
function startJosiahLastDefiance(){const w=finalWar,b=w?.josiahEncounter;if(!b||b.phase!=='death')return;stopJosiahFinalVoice();if(b.grip){disposeCampObject(b.grip);b.grip=null;}b.deathAlissa.userData.arms.forEach(a=>a.visible=true);b.deathAlissa.position.z+=1.7;b.phase='defiance';b.defianceTime=0;const v={audio:josiahChoiceAudio,failed:false,elapsed:0};josiahFinalVoice=v;v.audio.currentTime=0;v.audio.muted=muted;try{v.audio.play()?.catch(()=>{v.failed=true;});}catch(e){v.failed=true;}$('josiahAtriumNext').hidden=true;$('josiahAtriumSkip').hidden=true;$('josiahAtriumSpeaker').textContent='JOSIAH RICHARDS';$('josiahAtriumSpeaker').style.color='#ef7891';$('josiahAtriumLine').textContent=josiahLastDefiance;b.rupture=makeSovereignEffects(w.root,w.josiah.position.x,w.josiah.position.z);}
function beginJosiahUniverseQTE(){const b=finalWar.josiahEncounter;b.phase='universeQTE';b.qtePresses=0;b.qteDeadline=Date.now()+10000;$('josiahAtriumDialogue').hidden=true;$('universeQTE').hidden=false;updateUniverseQTE();}
function updateUniverseQTE(){const b=finalWar.josiahEncounter;$('universeQTECount').textContent=b.qtePresses+' / 10';$('universeQTETime').textContent=(Math.max(0,b.qteDeadline-Date.now())/1000).toFixed(1)+'s';}
function pressUniverseQTE(repeat=false){const b=finalWar?.josiahEncounter;if(!b||b.phase!=='universeQTE'||repeat)return;if(Date.now()>=b.qteDeadline){startJosiahBigBang();return;}b.qtePresses++;updateUniverseQTE();if(b.qtePresses>=10){$('universeQTE').hidden=true;b.phase='death';if(b.rupture){disposeCampObject(b.rupture.root);b.rupture=null;}finishJosiahDeath();startResistanceCredits();}}
function startJosiahBigBang(){const w=finalWar,b=w.josiahEncounter;if(b.phase!=='universeQTE')return;b.phase='bigBang';b.preResetSave={...gameProgress};gameProgress={};try{localStorage.removeItem(SAVE_KEY);saveAvailable=true;}catch(e){saveAvailable=false;try{localStorage.setItem(SAVE_KEY,'{}');saveAvailable=true;}catch(e){}}b.cosmicStart=Date.now();$('universeQTE').hidden=true;$('josiahAtriumDialogue').hidden=true;$('cosmicCaption').hidden=false;w.root.visible=false;world.visible=upperWorld.visible=false;const root=new THREE.Group();scene.add(root);b.cosmos=root;b.oldFog=scene.fog;scene.fog=null;scene.background.setHex(0x000005);const standard=new THREE.Group();root.add(standard);b.standardCosmos=standard;const make=(r,color,parent=standard)=>{const o=new THREE.Mesh(new THREE.SphereGeometry(r,32,20),new THREE.MeshBasicMaterial({color}));parent.add(o);return o;};b.earth=make(3,0x2369ab);for(let i=0;i<16;i++){const land=make(.45,0x497953,b.earth);const angle=i*2.4,lat=Math.sin(i*1.7);land.position.set(Math.cos(angle)*Math.sqrt(1-lat*lat)*2.95,lat*2.95,Math.sin(angle)*Math.sqrt(1-lat*lat)*2.95);land.scale.set(1,.6,.35);}b.sun=make(12,0xffcd68);b.sun.position.x=-70;for(let i=0;i<7;i++){const planet=make(.6+i*.16,[0x998478,0xc6a17c,0xad6e4d,0xc7ab88][i%4]);planet.position.set(-70+Math.cos(i*1.1)*(20+i*13),0,Math.sin(i*1.1)*(20+i*13));}const points=[];for(let i=0;i<4500;i++){const r=Math.sqrt(Math.random())*1800,angle=r*.012+(i%4)*Math.PI/2+(Math.random()-.5)*.6;points.push(Math.cos(angle)*r,(Math.random()-.5)*75,Math.sin(angle)*r);}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));b.galaxy=new THREE.Points(geometry,new THREE.PointsMaterial({color:0xc2bcff,size:3}));standard.add(b.galaxy);b.galaxy.visible=false;b.bang=make(1,0xfff3e0);b.bang.visible=false;b.cosmicModels=createJosiahCosmicModels(root);}
const JOSIAH_COSMOS_STAGES=[
 {name:'BRENT CROSS',end:2},
 {name:'UNITED KINGDOM / THE BRITISH ISLES',end:4.5,model:'british'},
 {name:'EARTH',end:7},
 {name:'THE SOLAR SYSTEM',end:10},
 {name:'THE MILKY WAY',end:13},
 {name:'VIRGO SUPERCLUSTER',end:16,model:'virgo'},
 {name:'LANIAKEA SUPERCLUSTER',end:19,model:'laniakea'},
 {name:'DARKNESS',end:22}
];
function renderJosiahUniverse(dt){const w=finalWar,b=w.josiahEncounter;if(b.phase==='defiance'||b.phase==='universeQTE'){w.josiah.userData.arms.forEach(a=>a.rotation.x=-2.7);camera.position.copy(w.josiah.position).add(new THREE.Vector3(2.5,2.2,4));camera.lookAt(w.josiah.position.clone().add(new THREE.Vector3(0,1.6,0)));if(b.rupture)animateSovereignEffects(b.rupture,(b.defianceTime||0)+.2,true);if(b.phase==='defiance'){b.defianceTime+=dt;if(tickJosiahFinalVoice(dt,17)){stopJosiahFinalVoice();beginJosiahUniverseQTE();}}else{updateUniverseQTE();if(Date.now()>=b.qteDeadline)startJosiahBigBang();}return;}if(b.phase!=='bigBang')return;
 const t=(Date.now()-b.cosmicStart)/1000,stage=JOSIAH_COSMOS_STAGES.find(v=>t<v.end)||JOSIAH_COSMOS_STAGES.at(-1);
 for(const [name,model] of Object.entries(b.cosmicModels))model.visible=stage.model===name;
 b.standardCosmos.visible=!stage.model&&t>=4.5&&t<13;
 if(t<2){b.cosmos.visible=false;world.visible=true;camera.position.copy(w.josiah.position).add(new THREE.Vector3(t*45,15+t*70,40+t*60));camera.lookAt(w.josiah.position);}
 else if(t>=19){world.visible=false;b.cosmos.visible=false;scene.background.setHex(0x000000);}
 else{world.visible=false;b.cosmos.visible=true;scene.background.setHex(0x000005);if(stage.model){camera.position.set(0,stage.model==='british'?1:0,stage.model==='british'?10:stage.model==='virgo'?21:25);camera.lookAt(0,0,0);b.cosmicModels[stage.model].rotation.y+=dt*(stage.model==='british'?.08:.025);}else{const d=t<7?8+(t-2)*12:t<13?68+Math.pow((t-7)/6,2)*350:418+(t-13)*600;camera.position.set(d*.25,d*.35,d);camera.lookAt(0,0,0);b.galaxy.visible=t>=10;b.earth.rotation.y+=dt*.15;}}
 $('cosmicCaption').textContent=stage.name;
 if(t>=22){b.phase='universeLost';$('cosmicCaption').textContent='NOTHING REMAINS';$('universeFailure').hidden=false;}
}
function startResistanceCredits(){configureLaniakeaCredits();stopJosiahFinalVoice();stopKevinWarVoice();clearFinalWar();keys.clear();drag=false;gameProgress.secretaryDeadCompleted=true;saveProgress();mode='resistanceCredits';syncMenuSong();document.exitPointerLock?.();world.visible=upperWorld.visible=exhibit.visible=false;for(const id of ['finalWarHUD','josiahAtriumDialogue','josiahAtriumHealth','menu'])$(id).hidden=true;const panel=$('resistanceCredits');panel.hidden=false;$('resistanceCreditsScroll').scrollTop=0;$('creditsContinue').hidden=true;panel.dataset.finished='false';resistanceCreditsTime=0;resistanceCreditsScrollCarry=0;}
let resistanceCreditsTime=0,resistanceCreditsScrollCarry=0;
function renderResistanceCredits(dt){const panel=$('resistanceCredits'),scroll=$('resistanceCreditsScroll');resistanceCreditsTime+=dt;if(resistanceCreditsTime>5&&panel.dataset.finished!=='true'){resistanceCreditsScrollCarry+=dt*22;const step=Math.floor(resistanceCreditsScrollCarry);scroll.scrollTop+=step;resistanceCreditsScrollCarry-=step;if(scroll.scrollTop+scroll.clientHeight>=scroll.scrollHeight-2){panel.dataset.finished='true';$('creditsContinue').hidden=false;}}}
function clearJosiahCosmos(){const b=finalWar?.josiahEncounter;if(b?.cosmos){disposeCampObject(b.cosmos);scene.fog=b.oldFog;b.cosmos=null;}for(const id of ['universeQTE','cosmicCaption','universeFailure'])$(id).hidden=true;}
const josiahDeathLines=[['JOSIAH RICHARDS','Wait… Alissa. Please.'],['ALISSA ROBERTS','There it is. You know how to beg when it is your life.'],['ALISSA ROBERTS','You didn’t give my mother mercy. Why should I give any to you?'],['ALISSA ROBERTS','Look at me. No speeches. No orders. Just look at me.'],['ALISSA ROBERTS','You do not get to look away this time.']];
function startJosiahDeath(){const w=finalWar,b=w.josiahEncounter;if(b.phase==='death'||b.phase==='defeated')return;stopJosiahFinalVoice();stopKevinWarVoice();b.phase='death';b.deathLine=0;b.deathTime=0;b.totalDeath=0;w.holding=false;keys.clear();$('josiahAtriumHealth').hidden=true;$('finalWarKevinDialogue').hidden=true;restoreAtriumCast();stageAtriumCast();const a=w.units.find(u=>u.name==='ALISSA').actor,j=w.josiah;b.deathAlissa=a;a.position.copy(j.position).add(new THREE.Vector3(0,0,.75));a.rotation.y=Math.PI;j.visible=true;poseJosiahGrieving(j,false);b.grip=new THREE.Group();w.root.add(b.grip);a.userData.arms.forEach(arm=>arm.visible=false);for(const side of [-1,1]){const from=a.position.clone().add(new THREE.Vector3(side*.3,1.45,0)),to=j.position.clone().add(new THREE.Vector3(side*.13,1.66,.22)),delta=to.clone().sub(from);const arm=new THREE.Mesh(new THREE.CylinderGeometry(.075,.09,delta.length(),8),mat(0x151218));arm.position.copy(from).add(to).multiplyScalar(.5);arm.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());b.grip.add(arm);const hand=new THREE.Mesh(new THREE.SphereGeometry(.095,10,8),mat(0xc49576));hand.position.copy(to);b.grip.add(hand);}showJosiahDeathLine();enterAtriumCinema();}
function showJosiahDeathLine(){const b=finalWar.josiahEncounter,line=josiahDeathLines[b.deathLine];$('josiahAtriumDialogue').hidden=false;$('josiahAtriumNext').hidden=false;$('josiahAtriumSkip').hidden=false;$('josiahAtriumSpeaker').textContent=line[0];$('josiahAtriumLine').textContent=line[1];$('josiahAtriumSpeaker').style.color=line[0]==='ALISSA ROBERTS'?'#75baff':'#ef7891';playJosiahDeathAudio(b.deathLine);}
function advanceJosiahDeath(){const b=finalWar?.josiahEncounter;if(!b||b.phase!=='death'||finalWar.paused)return;b.deathLine++;b.deathTime=0;if(b.deathLine>=josiahDeathLines.length){startJosiahLastDefiance();return;}showJosiahDeathLine();}
function renderJosiahDeath(dt){const w=finalWar,b=w.josiahEncounter;b.deathTime+=dt;b.totalDeath+=dt;const j=w.josiah;j.userData.head.rotation.x=-.14+Math.sin(b.totalDeath*13)*.025;j.userData.arms.forEach((a,i)=>a.rotation.x=-1.6+Math.sin(b.totalDeath*8+i)*.08);camera.position.lerp(j.position.clone().add(new THREE.Vector3(3.2,2.15,2.7)),Math.min(1,dt*5));camera.lookAt(j.position.clone().add(new THREE.Vector3(0,1.5,.3)));if(tickJosiahFinalVoice(dt,Math.max(4,josiahDeathLines[b.deathLine][1].length/15)))advanceJosiahDeath();}
function finishJosiahDeath(){const w=finalWar,b=w?.josiahEncounter;if(!b||b.phase!=='death')return;stopJosiahFinalVoice();if(b.grip)disposeCampObject(b.grip);b.grip=null;restoreAtriumCast();b.phase='defeated';leaveAtriumCinema();w.josiah.visible=true;w.josiah.rotation.z=Math.PI/2;w.josiah.position.y=.3;w.josiah.userData.head.rotation.x=0;$('josiahAtriumDialogue').hidden=true;$('josiahAtriumHealth').hidden=true;$('finalWarNotice').textContent='JOSIAH IS DEAD · CLEAR THE REMAINING HOSTILES';gameProgress.josiahFinalDefeated=true;saveProgress();camera.position.set(player.x,player.y+1.7,player.z);camera.rotation.set(pitch,yaw,0);requestLock();}
function enterAtriumCinema(){const w=finalWar;mode='finalWarCinema';w.paused=false;w.holding=false;drag=false;keys.clear();w.gun.visible=false;for(const id of ['finalWarHUD','finalWarPause','finalWarEnd','finalWarKevinDialogue','finalWarKevinHealth','josiahAtriumHealth'])$(id).hidden=true;$('josiahAtriumDialogue').classList?.remove('combat-dialogue');releaseFinalWarCinematicPointer();}
function leaveAtriumCinema(){const w=finalWar;mode='finalWar';w.paused=false;w.holding=false;drag=false;keys.clear();w.gun.visible=true;$('finalWarHUD').hidden=false;$('finalWarPause').hidden=true;$('josiahAtriumDialogue').classList?.add('combat-dialogue');camera.position.set(player.x,player.y+1.7,player.z);camera.rotation.set(pitch,yaw,0);}
function releaseFinalWarCinematicPointer(){const w=finalWar;if(!w)return;w.cinematicPointerRelease=true;w.paused=false;$('finalWarPause').hidden=true;document.exitPointerLock?.();}
function autoPauseFinalWar(){const w=finalWar;if(!w||performance.now()<(w.transitionUntil||0)||w.cinematicPointerRelease||['intro','death'].includes(w.josiahEncounter?.phase))return;pauseFinalWar();}
function startAtriumJosiahEncounter(){const w=finalWar;if(w.kevinSiegeRoute&&!w.kevinAtriumEntered)return;if(w.siegeRoute||w.kevinSiegeRoute){if(w.josiahEncounter)return;w.josiahEncounter={phase:'intro',line:0,time:0,attack:0,taunt:0,tauntAt:0};stopKevinWarVoice();$('finalWarKevinDialogue').hidden=true;beginAtriumJosiahFight();return;}$('josiahAtriumNext').hidden=false;$('josiahAtriumSkip').hidden=false;if(w.josiahEncounter)return;w.josiahEncounter={phase:'intro',line:0,time:0,attack:0,taunt:0,tauntAt:0};w.holding=false;keys.clear();stopKevinWarVoice();$('finalWarKevinDialogue').hidden=true;$('finalWarKevinHealth').hidden=true;enterAtriumCinema();poseJosiahGrieving(w.josiah,false);stageAtriumCast();showAtriumJosiahLine();frameAtriumSpeaker(1);}
function showAtriumJosiahLine(){const b=finalWar.josiahEncounter,line=josiahAtriumLines[b.line];$('josiahAtriumDialogue').hidden=false;$('josiahAtriumSpeaker').textContent=line[0];$('josiahAtriumSpeaker').style.color=line[0]==='JOSIAH RICHARDS'?'#ef7891':'#75baff';$('josiahAtriumLine').textContent=line[1];b.time=0;playJosiahFinalVoice(false,b.line);}
function nextAtriumJosiahLine(){const w=finalWar,b=w?.josiahEncounter;if(!b||b.phase!=='intro'||w.paused)return;b.line++;if(b.line>=josiahAtriumLines.length){beginAtriumJosiahFight();return;}showAtriumJosiahLine();}
function beginAtriumJosiahFight(){const w=finalWar,b=w?.josiahEncounter;if(!b||b.phase!=='intro'||w.paused)return;stopJosiahFinalVoice();restoreAtriumCast();leaveAtriumCinema();camera.position.set(player.x,player.y+1.7,player.z);camera.rotation.set(pitch,yaw,0);b.phase='fight';b.time=0;for(const [i,ally] of w.units.filter(v=>v.kind==='ally').entries()){ally.floor=w.josiahFloor||0;ally.actor.position.copy(w.siegeRoute?finalWarNearest(38+i,57,1):finalWarNearest(37+i,40,0));ally.actor.visible=true;ally.path=[];ally.repath=0;ally.decision=0;}const actor=w.josiah;poseJosiahGrieving(actor,false);const u={name:'JOSIAH',faction:'red',actor,hp:3000,maxHP:3000,kind:'josiah',floor:w.josiahFloor||0,path:[],repath:0,fire:1,hit:0,target:null,decision:0,base:actor.position.clone(),phase:0};w.units.push(u);b.unit=u;const stand=makeKevinWarSpectre(u);stand.traverse(o=>{if(o.material){o.material=o.material.clone();o.material.color.setHex(0x193d8c);if(o.material.emissive)o.material.emissive.setHex(0x12265b);}});stand.visible=true;w.sovereignStand=stand;$('josiahAtriumDialogue').hidden=true;$('josiahAtriumNext').hidden=true;$('josiahAtriumSkip').hidden=true;requestLock();}
function renderAtriumJosiahIntro(dt){const b=finalWar.josiahEncounter;b.time+=dt;frameAtriumSpeaker(dt);if(b.line===6)finalWar.josiah.userData.arms[0].rotation.x=-2.6;if(tickJosiahFinalVoice(dt,Math.max(4,josiahAtriumLines[b.line][1].length/16)))nextAtriumJosiahLine();}
function updateAtriumJosiahBoss(u,dt){const w=finalWar,b=u.kind==='josiahAlly'?u.standCombat:w.josiahEncounter;if(!b||b.phase!=='fight')return;const near=currentFloor===u.floor&&player.distanceTo(u.actor.position)<55;const ghost=u.spectre;ghost.position.copy(u.actor.position).add(new THREE.Vector3(-Math.sin(u.actor.rotation.y)*1.5,.15,-Math.cos(u.actor.rotation.y)*1.5));ghost.rotation.y=u.actor.rotation.y;ghost.visible=near;if(u.kind!=='josiahAlly'){$('josiahAtriumHealth').hidden=!near;$('josiahAtriumHP').textContent=Math.ceil(u.hp)+' / 3000';$('josiahAtriumBar').style.width=u.hp/30+'%';if(b.combatSpeaking&&(tickJosiahFinalVoice(dt,b.combatFallback))){stopJosiahFinalVoice();b.combatSpeaking=false;b.textUntil=w.time;b.tauntAt=w.time+5;}if(near&&!b.combatSpeaking&&w.time>=b.tauntAt){$('josiahAtriumDialogue').hidden=false;$('josiahAtriumSpeaker').textContent='JOSIAH RICHARDS';$('josiahAtriumSpeaker').style.color='#ef7891';const speeches=w.kevinSiegeRoute?KEVIN_SIEGE_JOSIAH_TAUNTS:w.siegeRoute?siegeJosiahTaunts:josiahAtriumTaunts,voiceIndex=b.taunt++%speeches.length,speech=speeches[voiceIndex];playJosiahFinalVoice(true,voiceIndex);b.combatSpeaking=true;$('josiahAtriumLine').textContent=speech;const readingTime=Math.max(10,speech.split(/\s+/).length/2.6);b.combatFallback=readingTime;b.siegeSpeechUntil=w.time+readingTime;b.textUntil=Infinity;b.tauntAt=Infinity;}if(w.time>b.textUntil||!near)$('josiahAtriumDialogue').hidden=true;}
 if(u.cast){const c=u.cast;c.left-=dt;u.actor.userData.arms.forEach((a,i)=>a.rotation.x=c.type===2?-2.5:i===0?-2.3:-.4);c.warning.visible=currentFloor===u.floor;if(c.left<=0){disposeCampObject(c.warning);u.cast=null;const from=u.actor.position.clone().add(new THREE.Vector3(0,1.6,0));if(finalWarSight(u.actor.position,c.point)){kevinWarBeam(from,c.point,true,0xeac34a);const victims=w.units.filter(v=>v.hp>0&&v!==u&&finalWarHostile(u.faction,v.faction)&&v.floor===u.floor).map(v=>({unit:v,p:v.actor.position}));if(currentFloor===u.floor&&finalWarHostile(u.faction,finalWarPlayerFaction()))victims.push({p:player});for(const v of victims)if(v.p.distanceTo(new THREE.Vector3(c.point.x,u.floor*9,c.point.z))<c.radius&&finalWarSight(u.actor.position,v.p)){if(v.unit)damageFinalWarUnit(v.unit,c.damage);else{w.hp=Math.max(0,w.hp-c.damage);if(c.type===3)w.chainSlowUntil=w.time+1.5;}}}u.fire=c.type===2?2.4:1.05;}return;}
 const target=u.target,pos=target?.player?player:target?.actor.position;if(u.dodge||!pos||!finalWarSight(u.actor.position,pos)||u.fire>0)return;const type=b.attack++%4,point=pos.clone();point.y=u.floor*9+1.2;const radius=type===2?4:1.8,warning=new THREE.Mesh(new THREE.RingGeometry(radius-.12,radius,40),new THREE.MeshBasicMaterial({color:0xf1c44d,side:THREE.DoubleSide,transparent:true,opacity:.75}));warning.rotation.x=-Math.PI/2;warning.position.set(point.x,u.floor*9+.09,point.z);w.root.add(warning);u.cast={type,point,radius,damage:type===2?35:22,left:type===2?1.3:.85,warning};if(type===1&&!u.holdPosition){const landing=pos.clone().lerp(u.actor.position,.18);if(finalWarWalkable(landing.x,landing.z,.35,u.floor)){u.actor.position.copy(landing);u.actor.position.y=u.floor*9;}}}

function buildFinalWarStairs(){const w=finalWar,stairs=new THREE.Group();w.root.add(stairs);w.stairs=stairs;const stone=mat(0x4b3039),rail=mat(0x9e8290);for(let i=0;i<36;i++){const y=(i+1)*.25,z=37*CELL+(i+.5)*8*CELL/36;box(stairs,4,.25,8*CELL/36+.04,stone,37*CELL,y-.125,z);for(const side of [-1,1]){box(stairs,.06,1,.06,rail,37*CELL+side*2,y+.5,z);box(stairs,.08,.08,8*CELL/36+.06,rail,37*CELL+side*2,y+1,z);}}for(const [z,y,text] of [[45*CELL,9,'ATRIUM / STAIRS DOWN'],[37*CELL,0,'GALLERIES / STAIRS UP']]){const label=sign(text,'#d6bdc9','#210a15',4);label.position.set(37*CELL,y+2.8,z);stairs.add(label);}w.stairCooldown=0;}
function useFinalWarLift(){const w=finalWar;if(!w||w.kevinArena||w.paused||w.onStairs||Math.hypot(player.x-40*CELL,player.z-57*CELL)>3)return;currentFloor=1-currentFloor;player.y=currentFloor*9;world.visible=!currentFloor;upperWorld.visible=!!currentFloor;w.mapTime=0;stopKevinWarVoice();$('finalWarKevinDialogue').hidden=true;}
function updateFinalWarTravel(dt){const w=finalWar;w.stairCooldown=Math.max(0,w.stairCooldown-dt);const x=37*CELL,top=45*CELL,bottom=37*CELL;if(w.siegeRoute){updateSiegeObjectives();if(w.siegeReady&&!w.siegeBoss&&Math.abs(player.x-x)<2.5&&Math.abs(player.z-(currentFloor?top:bottom))<2.5){startSiegePeterEncounter();return;}}if(w.primeRoute&&!w.kevinFinal&&currentFloor===1&&Math.abs(player.x-x)<2.5&&Math.abs(player.z-top)<2.5){finishPrimeSecretaryPreview();return;}if(!w.onStairs&&!w.stairCooldown&&Math.abs(player.x-x)<1.8&&Math.abs(player.z-(currentFloor?top:bottom))<1.1){w.onStairs=true;w.stairFrom=currentFloor;}
 if(w.onStairs){player.x=THREE.MathUtils.clamp(player.x,x-1.7,x+1.7);player.y=THREE.MathUtils.clamp((player.z-bottom)/(top-bottom),0,1)*9;if(player.z>top+1.1||player.z<bottom-1.1){currentFloor=player.z>top?1:0;player.y=currentFloor*9;w.onStairs=false;w.stairCooldown=1;if(w.kevinSiegeRoute&&w.stairFrom===1&&currentFloor===0)w.kevinAtriumEntered=true;}world.visible=player.y<8.8;upperWorld.visible=player.y>=8.8;}else{player.y=currentFloor*9;world.visible=currentFloor===0;upperWorld.visible=currentFloor===1;}if(w.seals)w.seals.visible=(w.kevinSiegeRoute?player.y<8.8:currentFloor===0)&&!w.atriumReleased;w.josiah.visible=currentFloor===(w.josiahFloor||0)&&w.josiahEncounter?.phase!=='defeated';w.stairs.visible=true;
 const nearLift=Math.hypot(player.x-40*CELL,player.z-57*CELL)<3;$('finalWarTravel').textContent=w.onStairs?'ATRIUM STAIRWELL · WALK UP / DOWN':nearLift?'[ E ] SOUTH LIFT · '+(currentFloor?'GROUND FLOOR':'UPPER FLOOR'):(currentFloor?'LEVEL 1 · KEVIN / ATRIUM STAIRS':'GROUND · SOUTH LIFT TO UPPER FLOOR');if(w.defenseRoute&&!w.onStairs&&!nearLift)$('finalWarTravel').textContent=currentFloor?'UPPER GALLERIES · COALITION IN THE OUTER WINGS':'ATRIUM SEALED · USE THE STAIRS TO REACH THE UPPER FLOOR';if(w.siegeRoute)$('finalWarTravel').textContent=w.siegeBoss?'ATRIUM · PETER’S LAST STAND':currentFloor===1?'UPPER FLOOR · JOSIAH AT SOUTH LIFT · KEVIN IN GALLERIES':'SOUTH LIFT · PRESS E TO REACH BOTH BOSSES';
 const k=w.kevin,seen=k&&!k.followerCombat&&k.hp>0&&k.floor===currentFloor&&player.distanceTo(k.actor.position)<38&&finalWarSight(player,k.actor.position);$('finalWarKevinHealth').hidden=!seen;if(seen){$('finalWarKevinHP').textContent=Math.ceil(k.hp)+' / '+k.maxHP;$('finalWarKevinBar').style.width=(k.hp/k.maxHP*100)+'%';}}
function finalWarMove(u,target,dt,speed){u.repath-=dt;const p=u.actor.position;if(u.repath<=0){u.path=finalWarPath(p,target,finalWar.defenseRoute&&!finalWar.atriumReleased&&u.floor===0&&u.faction==='blue');u.repath=1.4+Math.random()*.5;}const goal=u.path[0];if(!goal)return false;const delta=goal.clone().sub(p);delta.y=0;const distance=delta.length();if(distance<.25){u.path.shift();return false;}const step=delta.multiplyScalar(Math.min(distance,speed*dt)/distance),candidate=p.clone().add(step);if((!finalWar.defenseRoute||finalWar.atriumReleased||u.floor===1||u.faction!=='blue'||!defenseAtriumBuffer(Math.round(candidate.x/CELL),Math.round(candidate.z/CELL)))&&finalWarWalkable(candidate.x,candidate.z,.25,u.floor)){p.copy(candidate);u.actor.rotation.y=Math.atan2(step.x,step.z);return true;}u.repath=0;return false;}
function finalWarTracer(a,b,color){const w=finalWar,line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([a,b]),new THREE.LineBasicMaterial({color}));w.root.add(line);w.effects.push({obj:line,life:.10,floor:a.y>=8?1:0});}
function damageFinalWarUnit(u,damage,source='ai'){if(!Number.isFinite(u.hp)||u.hp<=0)return;const arena=finalWar?.kevinArena;if(u.finalBoss&&arena&&['raising','platform'].includes(arena.phase)){if(arena.phase!=='platform'||source!=='player'||player.y<1.5)return;arena.shotCount++;}u.hp=Math.max(0,u.hp-damage);u.hit=.18;if(u.hp===0){if(u.spectre)u.spectre.visible=false;if(u.cast){disposeCampObject(u.cast.warning);u.cast=null;}if(u.kind==='siegePeter'){finalWar.kills++;finishSiege();return;}if(u.kind==='josiah'){finalWar.kills++;if(finalWar.kevinSiegeRoute){finishKevinSiege();return;}if(finalWar.siegeRoute)defeatSiegeJosiah();else startJosiahDeath();return;}if(u.kind==='kevin'){if(u.finalBoss){finalWar.kills++;finishPrimeKevinFinalBoss();return;}stopKevinWarVoice();$('finalWarKevinDialogue').hidden=true;}u.actor.visible=false;if(u.muzzle)u.muzzle.visible=false;finalWar.kills++;}}
function tryKevinWarDodge(u,direction){const w=finalWar;if(u.hp<=0||u.finalBoss&&finalWar.kevinArena?.phase!=='ground'||u.cast||u.dodge||w.time<(u.dodgeAt||0)||!finalWarSight(player,u.actor.position))return;const offset=u.actor.position.clone().sub(player),distance=offset.length();if(distance>40||direction.dot(offset.normalize())<.965)return;u.dodgeAt=w.time+(u.kind==='josiah'||u.finalBoss?1.25:2.8);if(Math.random()>(u.kind==='josiah'?.85:.7))return;const side=new THREE.Vector3(direction.z,0,-direction.x).normalize();for(const sign of [Math.random()<.5?-1:1]){for(const flip of [sign,-sign]){const end=u.actor.position.clone().addScaledVector(side,flip*(u.kind==='josiah'?3.2:2.5));if(!finalWarSight(u.actor.position,end)||!finalWarWalkable(end.x,end.z,.35,u.floor))continue;u.dodge={end,left:u.kind==='josiah'?.24:.32,sign:flip};u.repath=0;return;}}}
function moveKevinWarDodge(u,dt){if(!u.dodge)return;const d=u.dodge,step=u.actor.position.clone().lerp(d.end,Math.min(1,dt/Math.max(.001,d.left)));if(finalWarWalkable(step.x,step.z,.35,u.floor))u.actor.position.copy(step);else d.left=0;d.left-=dt;u.actor.userData.body.rotation.z=d.sign*.4;u.actor.userData.arms.forEach(a=>a.rotation.x=-.8);if(d.left<=0){u.dodge=null;u.actor.userData.body.rotation.z=0;}}
function fireFinalWarWeapon(){const w=finalWar;if(mode!=='finalWar'||!w||w.paused||w.ended||['intro','death'].includes(w.josiahEncounter?.phase)||w.fire>0||w.reload>0)return;if(beginMariahOffer())return;if(w.ammo<=0){reloadFinalWar();return;}w.ammo--;w.fire=.19;camera.updateMatrixWorld(true);const direction=new THREE.Vector3();camera.getWorldDirection(direction);for(const u of w.units)if(u.kind==='kevin'||u.kind==='josiah'||u.kind==='siegePeter')tryKevinWarDodge(u,direction);const ray=new THREE.Ray(camera.position.clone(),direction);let best=70,target=null,impact=null;for(const u of w.units){if(u.hp<=0||u.floor!==currentFloor||!finalWarHostile(finalWarPlayerFaction(),u.faction))continue;u.actor.updateMatrixWorld(true);const hit=ray.intersectBox(new THREE.Box3().setFromObject(u.actor),new THREE.Vector3());if(hit){const d=hit.distanceTo(camera.position);if(d<best&&finalWarSight(player,hit)){best=d;target=u;impact=hit;}}}if(target)damageFinalWarUnit(target,28,'player');$('finalWarReticle').textContent=target?'×':'+';let end=impact;if(!end){end=camera.position.clone();for(let d=.5;d<=70;d+=.5){const sample=camera.position.clone().addScaledVector(direction,d);if(!finalWarWalkable(sample.x,sample.z,0))break;end.copy(sample);}}finalWarTracer(camera.position.clone().add(new THREE.Vector3(0,-.15,0)),end,0xffdc9c);playGunshot(.65);}
function reloadFinalWar(){const w=finalWar;if(w&&!w.paused&&!w.ended&&!w.reload&&w.ammo<24)w.reload=1.7;}
function chooseFinalWarTarget(u){const w=finalWar,p=u.actor.position;let best=null,score=Infinity;const candidates=w.units.filter(v=>v.hp>0&&v.floor===u.floor&&finalWarHostile(u.faction,v.faction));if(u.floor===currentFloor&&!w.onStairs&&finalWarHostile(u.faction,finalWarPlayerFaction()))candidates.push({faction:finalWarPlayerFaction(),hp:w.hp,position:player,player:true});for(const v of candidates){const pos=v.player?player:v.actor.position,d=p.distanceTo(pos);const rank=d+(d<45&&finalWarSight(p,pos)?0:35);if(rank<score){score=rank;best=v;}}return best;}
function renderFinalWar(dt){updateChambersTheme();const w=finalWar;if(w?.kevinSiegeEnding){renderKevinSiegeEnding(dt);return;}if(!w||w.paused||w.ended)return;if(w.josiahEncounter?.phase==='death'){renderJosiahDeath(dt);return;}if(w.josiahEncounter?.phase==='intro'){renderAtriumJosiahIntro(dt);return;}if(!w.defenseRoute&&!w.primeRoute&&!w.josiahEncounter&&(!w.kevinSiegeRoute||w.kevinAtriumEntered)&&currentFloor===(w.josiahFloor||0)&&!w.onStairs&&player.distanceTo(w.josiah.position)<20&&finalWarSight(player,w.josiah.position)){startAtriumJosiahEncounter();return;}w.time+=dt;w.fire=Math.max(0,w.fire-dt);w.aiSound=Math.max(0,w.aiSound-dt);if(w.reload>0){w.reload=Math.max(0,w.reload-dt);if(w.reload===0)w.ammo=24;}const f=+keys.has('KeyW')-+keys.has('KeyS'),s=+keys.has('KeyD')-+keys.has('KeyA'),length=Math.hypot(f,s)||1,speed=(keys.has('ShiftLeft')||keys.has('ShiftRight')?6.5:4.1)*(w.chainSlowUntil>w.time?.4:1),dx=(-Math.sin(yaw)*f+Math.cos(yaw)*s)/length*dt*speed,dz=(-Math.cos(yaw)*f-Math.sin(yaw)*s)/length*dt*speed;if(w.kevinArena?kevinPlayerCanMove(player.x+dx,player.z):finalWarWalkable(player.x+dx,player.z,.3,w.onStairs?1:currentFloor))player.x+=dx;if(w.kevinArena?kevinPlayerCanMove(player.x,player.z+dz):finalWarWalkable(player.x,player.z+dz,.3,w.onStairs?1:currentFloor))player.z+=dz;if(w.kevinArena){updateKevinArena(dt);updateKevinJump(dt);const k=w.kevin;$('finalWarKevinHealth').hidden=false;$('finalWarKevinHP').textContent=Math.ceil(k.hp)+' / 10000';$('finalWarKevinBar').style.width=k.hp/100+'%';}else updateFinalWarTravel(dt);if(w.ended||mode!=='finalWar')return;camera.position.set(player.x,player.y+1.7,player.z);camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);w.gun.position.z=-.6+w.fire*.25;if(w.holding)fireFinalWarWeapon();if(w.josiahEncounter?.phase==='death'||w.ended)return;
 for(const [index,u] of w.units.entries()){if(w.ended||w.josiahEncounter?.phase==='death')return;if(u.hp<=0)continue;u.actor.visible=u.floor===currentFloor;if(u.spectre)u.spectre.visible=u.actor.visible;u.fire-=dt;u.hit=Math.max(0,u.hit-dt);u.decision-=dt;if(u.decision<=0||u.target?.hp<=0){u.target=chooseFinalWarTarget(u);u.decision=.55+Math.random()*.3;}if(w.defenseRoute&&advanceDefenseCoalition(u,dt))continue;const target=u.target,pos=target?.player?player:target?.actor.position;let moving=false;const distance=pos?u.actor.position.distanceTo(pos):Infinity,visible=pos&&distance<48&&finalWarSight(u.actor.position,pos);
 if(w.kevinArena&&w.kevinArena.phase!=='ground'&&u.kind==='police')continue;if(u.kind==='ally'){if(w.kevinArena&&w.kevinArena.phase!=='ground')continue;if(u.floor!==currentFloor){u.floor=currentFloor;u.actor.position.copy(player).add(new THREE.Vector3(0,0,1));u.path=[];u.repath=0;if(w.kevinSiegeRoute){const at=cell(player);u.actor.position.copy(finalWarNearest(at.x,at.z,currentFloor));if(u.cast){disposeCampObject(u.cast.warning);u.cast=null;}u.target=null;u.decision=0;u.actor.visible=true;animateCharacter(w.time,false,false,u.actor);continue;}}const offset=new THREE.Vector3(Math.cos(index*1.57)*2.4,0,Math.sin(index*1.57)*2.4),goal=player.clone().add(offset);const follow=finalWarWalkable(goal.x,goal.z)?goal:player;if(u.actor.position.distanceTo(player)>4||!finalWarSight(u.actor.position,player))moving=finalWarMove(u,follow,dt,u.actor.position.distanceTo(player)>12?8:5);}
 else if(!(w.kevinArena&&w.kevinArena.phase!=='ground')&&(u.kind!=='kevin'||w.defenseRoute)&&!u.holdPosition&&!u.dodge&&pos&&(!visible||distance>(u.kind==='ninja'?1.6:19)))moving=finalWarMove(u,pos,dt,u.kind==='ninja'?5.8:u.kind==='kevin'?4.4:3.5);
 animateCharacter(w.time+u.phase,moving,u.kind==='ninja',u.actor);if(u.hit>0)u.actor.userData.body.rotation.x=-u.hit;if(u.muzzle)u.muzzle.visible=false;
 if(w.defenseRoute)dodgeDefenseLeader(u,dt);if(u.kind==='coalitionPeter'){updateCoalitionPeter(u,dt,pos,visible);continue;}if(u.kind==='siegePeter'){updateSiegePeter(u,dt,pos,visible);continue;}if(u.kind==='josiah'||u.kind==='josiahAlly'){if(u.kind==='josiahAlly'&&w.kevinArena&&w.kevinArena.phase!=='ground'){if(u.cast){disposeCampObject(u.cast.warning);u.cast=null;}u.actor.userData.arms.forEach(a=>a.rotation.x=w.kevinArena.phase==='pull'?-1.5:-.5);if(u.spectre)u.spectre.position.copy(u.actor.position).add(new THREE.Vector3(0,.15,-1.5));continue;}moveKevinWarDodge(u,dt);if(!u.holdPosition&&!u.cast&&!u.dodge&&pos){const delta=pos.clone().sub(u.actor.position);delta.y=0;const d=delta.length();if(d>1){delta.normalize();const side=new THREE.Vector3(delta.z,0,-delta.x).multiplyScalar(Math.sin(w.time*1.5)>0?1:-1),goal=u.actor.position.clone().addScaledVector(side,dt*4.8).addScaledVector(delta,dt*(d>7?4:d<4?-3:0));if(finalWarWalkable(goal.x,goal.z,.35,u.floor)&&finalWarSight(u.actor.position,goal))u.actor.position.copy(goal);}}if(visible)u.actor.rotation.y=Math.atan2(pos.x-u.actor.position.x,pos.z-u.actor.position.z);updateAtriumJosiahBoss(u,dt);continue;}
 if(u.kind==='kevin'||u.followerCombat==='kevin'){if(u.finalBoss&&w.kevinArena?.phase!=='ground'){if(u.spectre){u.spectre.visible=true;u.spectre.position.copy(u.actor.position).add(new THREE.Vector3(0,.2,-1.2));}continue;}moveKevinWarDodge(u,dt);moveKevinFinalBoss(u,dt,pos);if(visible)u.actor.rotation.y=Math.atan2(pos.x-u.actor.position.x,pos.z-u.actor.position.z);updateKevinWar(u,dt,visible,pos);continue;}
 if(visible){u.actor.rotation.y=Math.atan2(pos.x-u.actor.position.x,pos.z-u.actor.position.z);u.actor.userData.arms.forEach((arm,i)=>arm.rotation.x=u.kind==='ninja'?-1+Math.sin(w.time*10+i)*.65:-1.5);if(u.fire<=0&&(u.kind!=='ninja'||distance<1.9)){u.fire=u.kind==='ninja'?.9:u.kind==='kevin'?.65:1.3+Math.random()*.4;const damage=u.kind==='ninja'?13:u.kind==='kevin'?9:7;if(target.player)w.hp=Math.max(0,w.hp-damage);else damageFinalWarUnit(target,damage);if(u.kind!=='ninja'){if(u.muzzle)u.muzzle.visible=true;finalWarTracer(u.actor.position.clone().add(new THREE.Vector3(0,1.5,0)),pos.clone().add(new THREE.Vector3(0,1.2,0)),u.faction==='green'?0x76eba2:u.faction==='yellow'?0xffd55c:u.faction==='blue'?0x77bbff:0xf76e80);if(distance<45&&w.aiSound<=0){playGunshot(.12);w.aiSound=.15;}}}}
 }
 if(kevinWarVoice)kevinWarVoice.muted=muted;if(w.time>=(w.kevinTextUntil||0)&&(!kevinWarVoice||kevinWarVoice.ended))$('finalWarKevinDialogue').hidden=true;
 for(const item of w.medkits){item.model.visible=currentFloor===(item.floor||0)&&w.time>=item.ready;if(item.model.visible&&item.model.position.distanceTo(player)<1.6&&w.hp<150){w.hp=Math.min(150,w.hp+(item.heal||55));item.ready=w.time+(item.respawn||25);item.model.visible=false;}}
 for(const effect of w.effects){effect.obj.visible=effect.floor===undefined||effect.floor===currentFloor;effect.life-=dt;if(effect.life<=0)disposeCampObject(effect.obj);}w.effects=w.effects.filter(e=>e.life>0);$('finalWarHealth').textContent=Math.ceil(w.hp)+' / 150';$('finalWarAmmo').textContent=w.reload>0?'RELOADING…':w.ammo+' / 24 · R RELOAD';$('finalWarCounts').textContent='PSRM '+w.units.filter(u=>u.faction==='red'&&u.hp>0).length+' · YELLOW '+w.units.filter(u=>u.faction==='yellow'&&u.hp>0).length+' · POLICE '+w.units.filter(u=>u.kind==='police'&&u.hp>0).length;w.mapTime-=dt;if(w.mapTime<=0){drawFinalWarMap();w.mapTime=.12;}if(!w.units.some(u=>(u.faction==='red'||u.faction==='yellow')&&u.hp>0))$('finalWarNotice').textContent='BOTH FLOORS SECURED · ATRIUM ACCESS VIA UPPER STAIRS';if(w.siegeRoute)updateSiegeObjectives();if(w.defenseRoute)updateDefenseBattle();if(w.kevinSiegeRoute)updateKevinSiegeObjectives();if(w.hp<=0){stopPeterKillTaunt();stopJosiahFinalVoice();stopKevinWarVoice();w.ended=true;w.holding=false;keys.clear();syncMenuSong();$('finalWarEnd').hidden=false;document.exitPointerLock?.();}}
function drawFinalWarMap(){const w=finalWar,cv=$('finalWarMap'),ctx=cv.getContext('2d'),size=cv.width,scale=size/N;ctx.fillStyle='#08040c';ctx.fillRect(0,0,size,size);for(let z=0;z<N;z++)for(let x=0;x<N;x++)if(finalWarCellOpen(x,z)){ctx.fillStyle='#302730';ctx.fillRect(x*scale,z*scale,scale+.2,scale+.2);}ctx.fillStyle='#451320';ctx.fillRect(28.5*scale,24.5*scale,23*scale,25*scale);ctx.strokeStyle='#bf5267';ctx.strokeRect(28.5*scale,24.5*scale,23*scale,25*scale);ctx.fillStyle='#ddb4c0';ctx.font='8px monospace';ctx.textAlign='center';ctx.fillText(w.kevinSiegeRoute?(currentFloor?'ATRIUM STAIRS DOWN':'SEALED / JOSIAH'):currentFloor?'ATRIUM STAIRS':'ATRIUM / STAIRS ACCESS',40*scale,34*scale);ctx.fillStyle='#9bc9ff';ctx.fillText(currentFloor?'LEVEL 1':'GROUND FLOOR',40*scale,5*scale);ctx.fillText('LIFT',40*scale,57*scale);ctx.fillText('STAIRS',37*scale,45*scale);const colors={blue:'#65b8ff',green:'#5bdf8e',red:'#f33858',yellow:'#ffd44c'};for(const [i,u] of w.units.entries()){if(u.hp<=0||u.floor!==currentFloor)continue;const x=u.actor.position.x/CELL*scale,y=u.actor.position.z/CELL*scale;ctx.fillStyle=colors[u.faction];ctx.beginPath();ctx.arc(x,y,['PSRM','NINJA','POLICE','RESISTANCE'].includes(u.name)?2:3.7,0,TAU);ctx.fill();if(!['PSRM','NINJA','POLICE','RESISTANCE'].includes(u.name)){ctx.textAlign=x>size*.75?'right':x<size*.25?'left':'center';ctx.fillText(u.name,x,y+(u.faction==='blue'?(-10-(i%3)*9):-7));}}if(w.siegeRoute&&w.siegePeter&&!w.siegeBoss&&currentFloor===1){ctx.fillStyle=colors.red;ctx.beginPath();ctx.arc(37*scale,45*scale,4,0,TAU);ctx.fill();ctx.fillText('PETER',37*scale,45*scale-8);}if(!w.alliedJosiah&&w.josiahEncounter?.phase!=='defeated'&&(!w.siegeRoute||currentFloor===1)){ctx.fillStyle=colors.red;const jx=w.josiah.position.x/CELL*scale,jz=w.josiah.position.z/CELL*scale;ctx.beginPath();ctx.arc(jx,jz,4,0,TAU);ctx.fill();ctx.textAlign='center';ctx.fillText('JOSIAH',jx,jz+13);}ctx.save();ctx.translate(player.x/CELL*scale,player.z/CELL*scale);ctx.rotate(-yaw);ctx.fillStyle=w.kevinSiegeRoute?'#ffd44c':w.defenseRoute?(w.joinedResistance?'#65b8ff':'#ff5368'):'white';ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(4,4);ctx.lineTo(-4,4);ctx.fill();ctx.restore();}
function pauseFinalWar(){chambersTheme.pause();chambersThemeRequested=false;const w=finalWar;if(mode!=='finalWar'||!w||w.ended)return;w.paused=true;syncMenuSong();if(w.mariahCombatVoice)w.mariahCombatVoice.audio.pause();if(w.betrayalVoice)w.betrayalVoice.audio.pause();if(w.siegeBoss?.voice)w.siegeBoss.voice.pause();if(josiahFinalVoice)josiahFinalVoice.audio.pause();if(kevinWarVoice)kevinWarVoice.pause();w.holding=false;keys.clear();$('finalWarPause').hidden=false;document.exitPointerLock?.();}
function resumeFinalWar(){if(!finalWar||finalWar.ended||finalWar.mariahChoice==='pending')return;keys.clear();drag=false;finalWar.holding=false;finalWar.paused=false;syncMenuSong();if(finalWar.betrayalVoice&&!finalWar.betrayalVoice.audio.ended)finalWar.betrayalVoice.audio.play()?.catch(()=>{finalWar.betrayalVoice.failed=true;});if(finalWar.siegeBoss?.voice)finalWar.siegeBoss.voice.play()?.catch(()=>{});if(josiahFinalVoice&&!josiahFinalVoice.audio.ended){const v=josiahFinalVoice;v.audio.play().catch(()=>{v.failed=true;});}if(kevinWarVoice&&!kevinWarVoice.ended)kevinWarVoice.play().catch(()=>{});$('finalWarPause').hidden=true;requestLock();}

function populateSecretaryBrentCross(c){const root=c.root;c.soldiers=[];const posts=[[-3,-1],[3,-1],[-5,3],[6,1],[-7,7],[8,6]];for(const [dx,dz] of posts){const actor=makePSRMSoldier();root.add(actor);actor.position.set(c.x+dx,0,c.z+dz);actor.rotation.y=0;c.soldiers.push({actor,base:actor.position.clone(),patrol:false});}
 for(let gz=73;gz>=29;gz-=6){const gx=[34,38,42,46].find(x=>grid[gz]?.[x]===0&&grid[gz]?.[x+1]===0);if(gx===undefined)continue;const actor=makePSRMSoldier();root.add(actor);actor.position.set(gx*CELL,0,gz*CELL);c.soldiers.push({actor,base:actor.position.clone(),patrol:true});}
 const products=new THREE.Group();products.name='Stocked Brent Cross shops';root.add(products);c.shopStock=products;const packaging=[mat(0x923d43),mat(0x3d638a),mat(0xc5ae71),mat(0x667d61),mat(0xaaaaa6)],wood=mat(0x3b2923),metal=mat(0x848387);
 for(const shop of shopPlans){if(shop.closed)continue;const x=(shop.x1+shop.x2)*CELL/2,z=(shop.za+shop.zb)*CELL/2;const display=new THREE.Group();products.add(display);display.position.set(x,0,z);const kind=shop.index%4;
 if(kind===0){for(const side of [-1,1]){box(display,.07,2,.07,metal,side*1.3,1,0);}box(display,2.7,.07,.07,metal,0,2,0);for(let i=0;i<7;i++){const px=-1.1+i*.36;box(display,.27,.52,.10,packaging[i%5],px,1.5,0);for(const side of [-1,1]){const sleeve=box(display,.16,.3,.1,packaging[i%5],px+side*.17,1.61,0);sleeve.rotation.z=side*.45;}box(display,.02,.22,.02,metal,px,1.88,0);}}
 else{for(const y of [.45,1.05,1.65]){box(display,3,.08,.9,wood,0,y,0);for(let i=0;i<6;i++){const px=-1.2+i*.48;if(kind===1){box(display,.3,.34,.24,packaging[(i+shop.index)%5],px,y+.21,0);box(display,.19,.09,.012,mat(0xd9d4bc),px,y+.24,.13);}else if(kind===2){box(display,.34,.25,.08,mat(0x191e24),px,y+.18,0);box(display,.28,.18,.012,mat(0x54778b),px,y+.19,.047);box(display,.12,.035,.19,metal,px,y+.06,0);}else{for(let j=0;j<3;j++)box(display,.095,.28,.22,packaging[(i+j)%5],px+j*.105,y+.18,0);}}}for(const side of [-1,1])box(display,.07,1.75,.8,metal,side*1.48,.9,0);}
 const frontX=shop.front*CELL-shop.facing*.8;for(let i=0;i<5;i++){box(products,.45,.75,.5,wood,frontX,.375,(shop.za+.9+i*.6)*CELL);box(products,.3,.25,.26,packaging[i%5],frontX,.88,(shop.za+.9+i*.6)*CELL);}
 }
}
function animateSecretarySoldiers(c){for(const [i,s] of c.soldiers.entries()){const t=c.total*.7+i;if(s.patrol){s.actor.position.x=s.base.x+(Math.sin(t)+1)*CELL*.42;s.actor.rotation.y=Math.cos(t)>0?Math.PI/2:-Math.PI/2;}animateCharacter(c.total+i,s.patrol,false,s.actor);s.actor.userData.arms[0].rotation.x=-.8;s.actor.userData.arms[1].rotation.x=-1;s.actor.userData.head.rotation.y=s.patrol?0:Math.sin(t)*.16;}}

const secretaryVoiceClips=["assets/audio/clip-0ef9a6e95167.mp3","assets/audio/clip-d8e5e39b2957.mp3","assets/audio/clip-8f953c8d013f.mp3","assets/audio/clip-ad76a2096564.mp3","assets/audio/clip-7c3f7883ab6b.mp3","assets/audio/clip-906d6b43d6c4.mp3","assets/audio/clip-3c7d6fbf530c.mp3","assets/audio/clip-9d1f98ae50cc.mp3","assets/audio/clip-77726d4a6b6d.mp3","assets/audio/clip-65b14e3b8862.mp3","assets/audio/clip-fed5930860da.mp3","assets/audio/clip-b50573ea4cd7.mp3"].map(src=>{const a=new Audio(src);a.preload='auto';a.loop=false;return a;});
const secretaryRearAudio=["assets/audio/clip-d07a510f8f43.mp3","assets/audio/clip-41c70b8e1cbe.mp3","assets/audio/clip-8afc827fa55c.mp3","assets/audio/clip-2b3440433c38.mp3","assets/audio/clip-eb981db680d5.mp3","assets/audio/clip-c3d1691e9c27.mp3","assets/audio/clip-b84b5c7d738a.mp3"].map(src=>{const a=new Audio(src);a.preload='auto';a.loop=false;return a;});
secretaryRearAudio.push(new Audio("assets/audio/clip-d01e05817166.mp3"));secretaryRearAudio[7].preload='auto';
const stephenFinalOpeningAudio=[new Audio("assets/audio/clip-747c00f50bae.mp3"),new Audio("assets/audio/clip-87068d5bea1d.mp3")];
function stephenLeadsFinalOpening(){if(isKevinSiegeOpening())return false;return isPrimeSecretaryRoute()||(chapterFiveTitle()==='SIEGE OF BRENT CROSS'&&gameProgress.stephenRescued===true&&!stephenIsDeceased());}
const primeSecretaryAltAudio=[new Audio("assets/audio/clip-7728146a4ea5.mp3"),new Audio("assets/audio/clip-6393a841e433.mp3"),new Audio("assets/audio/clip-6d8f7d012874.mp3"),new Audio("assets/audio/clip-3c71bd666451.mp3"),new Audio("assets/audio/clip-e181c7591e18.mp3"),new Audio("assets/audio/clip-b6138175d908.mp3"),new Audio("assets/audio/clip-32627cfbcbf2.mp3"),new Audio("assets/audio/clip-6e990abd9c2f.mp3"),new Audio("assets/audio/clip-d6fb9d4f5c09.mp3"),new Audio("assets/audio/clip-df798e09693d.mp3"),new Audio("assets/audio/clip-bea72a090fd0.mp3")];
const josiahHoldFireAudio=new Audio("assets/audio/clip-df3b2d817451.mp3");
const siegeConversationAudio=[new Audio("assets/audio/clip-bd25b4de4229.mp3"),new Audio("assets/audio/clip-141ffb75b9ce.mp3"),new Audio("assets/audio/clip-90f48289d21c.mp3"),new Audio("assets/audio/clip-0f8a5845b38b.mp3"),new Audio("assets/audio/clip-f09e7a989d14.mp3")];
const pinterSiegeSealAudio=new Audio("assets/audio/clip-45656086d2ea.mp3");
const stephenSiegeSealAudio=new Audio("assets/audio/clip-731d8476df74.mp3");
function secretaryVoiceAt(line){if(secretaryOpening?.siege||isSiegeRoute())return line===1?(stephenLeadsFinalOpening()?stephenFinalOpeningAudio[0]:secretaryVoiceClips[0]):line===2?(stephenLeadsFinalOpening()?stephenSiegeSealAudio:pinterSiegeSealAudio):line>=4&&line<=8?siegeConversationAudio[line-4]:null;if(secretaryOpening?.holdFireOrder)return josiahHoldFireAudio;if(isPrimeSecretaryRoute()){if(line>=4&&line<=13)return primeSecretaryAltAudio[line-4];if(line===20)return primeSecretaryAltAudio[10];}if((line===1||line===2)&&stephenLeadsFinalOpening())return stephenFinalOpeningAudio[line-1];if(isPrimeSecretaryRoute()&&primeSecretaryOpeningOverrides[line])return null;if(line===23)return secretaryRearAudio[7];if(line>=15&&line<=21)return secretaryRearAudio[line-15];return line===1?secretaryVoiceClips[0]:line===2?secretaryVoiceClips[1]:line>=4&&line<14?secretaryVoiceClips[line-2]:null;}
function stopSecretaryVoice(){[...secretaryVoiceClips,...secretaryRearAudio,...stephenFinalOpeningAudio,...primeSecretaryAltAudio,josiahHoldFireAudio,stephenSiegeSealAudio,pinterSiegeSealAudio,...siegeConversationAudio].forEach(a=>{a.pause();a.currentTime=0;});}
function playSecretaryVoice(c){stopSecretaryVoice();const a=secretaryVoiceAt(c.line);c.voiceFailed=false;if(!a)return;prepareCorneredLipAudio();a.muted=muted;const line=c.line;try{a.play()?.catch(()=>{if(secretaryOpening===c&&c.line===line)c.voiceFailed=true;});}catch(e){c.voiceFailed=true;}}
function secretaryVoiceDone(c,fallback){const a=secretaryVoiceAt(c.line);if(!a)return c.time>fallback;a.muted=muted;const duration=Number.isFinite(a.duration)&&a.duration>0?a.duration:30;return a.ended&&c.time>.15||c.voiceFailed&&c.time>fallback||c.time>duration+8;}
function secretaryVoiceLevel(c){const a=secretaryVoiceAt(c.line);if(!a||a.paused||a.ended||c.voiceFailed)return 0;if(corneredAnalyser){corneredAnalyser.getByteTimeDomainData(corneredSamples);let sum=0;for(const n of corneredSamples)sum+=((n-128)/128)**2;return Math.min(1,Math.sqrt(sum/corneredSamples.length)*8);}return .2+Math.abs(Math.sin(a.currentTime*14))*.4;}

let secretaryOpening=null;
const siegeJosiahCombatAudio=[new Audio("assets/audio/clip-3a37a7826c40.mp3"),new Audio("assets/audio/clip-8b40458e9e60.mp3"),new Audio("assets/audio/clip-a158e5442b3c.mp3"),new Audio("assets/audio/clip-2c5e99ffe389.mp3"),new Audio("assets/audio/clip-168fdad617af.mp3")];
const siegeJosiahTaunts=["You came up in my own lift to place me under arrest? Look around you. Every corridor, every soldier, every locked door answers to me. You have mistaken access for permission.","The police have turned their guns on everyone. Murderhorn is carving through my men, and Peter thinks he can wait in the shadows while we destroy each other. I will not surrender my country to that pack of scavengers.","Politicians spend their lives arguing over who deserves to lead. I made the decisions they were too frightened to make. You can hate me for it, but hatred does not qualify you to take my place.","Peter learned every trick he knows standing behind my chair. If he thinks these powers make him my equal, he can come up here and prove it. I am finished sending other people to deal with my mistakes.","No more envoys. No more warnings. You wanted the Prime Secretary, and here I am. Break my chains if you can—or I will drag every last one of you off this floor myself."];
function isSiegeRoute(){return chapterFiveTitle()==='SIEGE OF BRENT CROSS';}
function canOpenSiege(){return !isKevinStoryRoute()&&gameProgress.brentCrossCompleted===true&&gameProgress.garethQuestCompleted===true&&gameProgress.corneredRatRoomsCompleted>=100&&isSiegeRoute();}
function siegeOpeningLines(){const officer=stephenLeadsFinalOpening()?'STEPHEN MARSH':'CHRIS PINTER';return [
 ['BRENT CROSS COMPLEX / SOUTH GATE','FINAL CHAPTER — SIEGE OF BRENT CROSS'],
 [officer,'Prime Secretary, you’re under arrest for high treason.'],
 [officer,'Seal the exits. Armed groups inside are to stand down. Resistance, PSRM, Murderhorn’s men—no exceptions.'],
 ['BRENT CROSS COMPLEX / EAST SERVICE YARD','While the police close in, Peter Chambers meets Kevin Murderhorn.'],
 ['PETER CHAMBERS','The Resistance are coming. Keep them in the galleries, Murderhorn. Let Josiah exhaust himself guarding the upper lift.'],
 ['KEVIN MURDERHORN','You want his throne. I want his chains broken. Don’t mistake that for fucking loyalty.'],
 ['PETER CHAMBERS','Loyalty has nothing to do with it. Let the police and his soldiers tear each other apart. I will be waiting at the stairs.'],
 ['KEVIN MURDERHORN','Send them upstairs. I’ll show them what happens when there’s nobody left to give me orders.'],
 ['PETER CHAMBERS','And when the shooting stops, remember who knew where everyone would be standing.']
 ];}
function prepareSiegeOpening(c){c.siege=true;c.josiah.visible=false;c.rearScene.visible=false;c.eastScene.visible=false;const p=makePeter();c.eastScene.add(p);p.position.set(-2.5,0,.5);p.rotation.y=Math.atan2(2.5,1.5);c.eastKevin.rotation.y=Math.atan2(-2.5,-1.5);c.siegePeter=p;const fill=new THREE.PointLight(0xbdc9e5,16,15);fill.position.set(2,3,-2);c.eastScene.add(fill);$('secretaryOpeningUI').querySelector('.cinema-top strong').textContent='FINAL CHAPTER / SIEGE OF BRENT CROSS';}
function renderSiegeOpening(c,dt){const east=c.line>=3,speaker=secretaryOpeningLineAt(c.line)[0];c.eastScene.visible=east;c.rearScene.visible=false;c.josiah.visible=false;const talking=c.line>0&&c.line!==3&&secretaryVoiceLevel(c)>.02;for(const [name,a] of [[stephenLeadsFinalOpening()?'STEPHEN MARSH':'CHRIS PINTER',c.chris],['PETER CHAMBERS',c.siegePeter],['KEVIN MURDERHORN',c.eastKevin]]){animateCharacter(c.total,false,false,a);if(name!=='KEVIN MURDERHORN')primeReunionMouth(a,talking&&speaker===name,c.total);if(talking&&speaker===name)a.userData.arms[0].rotation.x=-.6-Math.sin(c.total*2)*.1;}c.eastNinjas.forEach((a,i)=>animateCharacter(c.total+i,false,false,a));animateSecretarySoldiers(c);c.beacons.forEach((b,i)=>b.light.intensity=Math.sin(c.total*13+i*Math.PI)>0?25:1);let goal,look;if(east){const a=speaker==='PETER CHAMBERS'?c.siegePeter:c.eastKevin;look=a.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0,1.6,0));goal=look.clone().add(speaker==='PETER CHAMBERS'?new THREE.Vector3(4,.45,-3):new THREE.Vector3(-2,.45,-4));if(c.line===3){look=c.eastScene.position.clone().add(new THREE.Vector3(-1,1.5,2));goal=look.clone().add(new THREE.Vector3(-4,1,-7));}}else{look=c.chris.position.clone().add(new THREE.Vector3(0,1.6,0));goal=look.clone().add(new THREE.Vector3(-2,.5,-4));}if(c.siegeShot!==c.line){camera.position.copy(goal);c.siegeShot=c.line;}camera.position.lerp(goal,1-Math.exp(-dt*3));camera.lookAt(look);const duration=Math.max(4,secretaryOpeningLineAt(c.line)[1].length/15);$('secretaryOpeningProgress').style.width=Math.min(100,c.time/duration*100)+'%';if(secretaryVoiceDone(c,duration))advanceSecretaryOpening();}
function updateSiegeObjectives(){const w=finalWar;if(!w?.siegeRoute)return;const ready=w.kevin.hp<=0&&w.josiahEncounter?.phase==='defeated';w.siegeReady=ready;if(ready&&!w.siegePeter){const a=makePeter();w.root.add(a);a.position.set(37*CELL,9,45*CELL);a.rotation.y=Math.PI;w.siegePeter=a;}if(w.siegePeter&&!w.siegeBoss)w.siegePeter.visible=currentFloor===1;if(w.siegeBoss)$('finalWarNotice').textContent='FINAL OBJECTIVE · DEFEAT PETER CHAMBERS IN THE ATRIUM';else if(ready)$('finalWarNotice').textContent='JOSIAH AND KEVIN DEFEATED · RETURN TO THE ATRIUM STAIRS · PETER IS WAITING';else $('finalWarNotice').textContent='DEFEAT KEVIN: '+(w.kevin.hp<=0?'DONE':'FIRST FLOOR')+' · DEFEAT JOSIAH: '+(w.josiahEncounter?.phase==='defeated'?'DONE':'UPPER SOUTH LIFT')+' · ALL ENEMY FACTIONS ARE HOSTILE';}
function defeatSiegeJosiah(){const w=finalWar,b=w.josiahEncounter;stopJosiahFinalVoice();b.phase='defeated';w.josiah.rotation.z=Math.PI/2;w.josiah.position.y=(w.josiahFloor||0)*9+.3;$('josiahAtriumDialogue').hidden=true;$('josiahAtriumHealth').hidden=true;updateSiegeObjectives();}
const siegePeterIntroLines=[['PETER CHAMBERS','Josiah and Murderhorn. Both brought down, and you still walked straight into my hands. I knew you would reach the stairs.'],['GARETH WILLIAMS','You used all of them. The soldiers, the police—even Murderhorn. It ends here, Peter.'],['PETER CHAMBERS','He gave me power and expected obedience. Now you will see what his shadow can do.']];
function startSiegePeterEncounter(){const w=finalWar;if(!w?.siegeReady||w.siegeBoss||w.siegeIntro)return;stopKevinWarVoice();stopJosiahFinalVoice();stopPeterKillTaunt();w.paused=false;w.holding=false;keys.clear();mode='siegePeterIntro';currentFloor=0;w.onStairs=false;world.visible=true;upperWorld.visible=false;w.siegePeter.position.copy(finalWarNearest(43,39,0));w.siegePeter.visible=true;player.copy(finalWarNearest(37,41,0));for(const [i,u] of w.units.filter(u=>u.kind==='ally').entries()){u.floor=0;u.actor.position.copy(finalWarNearest(36+i*2,42,0));u.actor.visible=true;u.path=[];}w.siegeIntro={line:0,time:0};w.gun.visible=false;for(const id of ['finalWarHUD','finalWarPause','josiahAtriumDialogue','josiahAtriumHealth','finalWarKevinHealth','finalWarKevinDialogue'])$(id).hidden=true;$('siegePeterUI').hidden=false;showSiegePeterLine();document.exitPointerLock?.();renderSiegePeterIntro(0);}
function showSiegePeterLine(){const c=finalWar.siegeIntro,[speaker,line]=siegePeterIntroLines[c.line];$('siegePeterSpeaker').textContent=speaker;$('siegePeterSpeaker').style.color=speaker==='PETER CHAMBERS'?'#ef7891':'#75baff';$('siegePeterLine').textContent=line;}
function advanceSiegePeter(){const c=finalWar?.siegeIntro;if(mode!=='siegePeterIntro'||!c)return;c.line++;c.time=0;if(c.line>=siegePeterIntroLines.length){beginSiegePeterFight();return;}showSiegePeterLine();}
function renderSiegePeterIntro(dt){const w=finalWar,c=w.siegeIntro;c.time+=dt;const talking=siegePeterIntroLines[c.line][0],g=w.units.find(u=>u.name==='GARETH WILLIAMS').actor,p=w.siegePeter;for(const [name,a] of [['PETER CHAMBERS',p],['GARETH WILLIAMS',g]]){animateCharacter(c.time,false,false,a);primeReunionMouth(a,name===talking,c.time);}const a=talking==='PETER CHAMBERS'?p:g,target=a.position.clone().add(new THREE.Vector3(0,1.6,0));camera.position.copy(target).add(new THREE.Vector3(2,.3,3.7));camera.lookAt(target);if(c.time>Math.max(5,siegePeterIntroLines[c.line][1].length/15))advanceSiegePeter();}
function beginSiegePeterFight(){const w=finalWar;if(!w||w.siegeBoss)return;primeReunionMouth(w.siegePeter,false,0);const u=addFinalWarUnit('PETER CHAMBERS','red',w.siegePeter,43,39,5000,'siegePeter',0);u.attackIndex=0;u.tauntIndex=0;u.tauntAt=w.time+1;u.fire=1.5;w.siegeBoss=u;$('siegePeterHP').textContent='5000 / 5000';$('siegePeterBar').style.width='100%';makeKevinWarSpectre(u);w.hp=Math.max(w.hp,100);w.ammo=24;w.reload=0;w.paused=false;mode='finalWar';w.gun.visible=true;$('siegePeterUI').hidden=true;$('finalWarHUD').hidden=false;$('siegePeterHealth').hidden=false;yaw=Math.atan2(player.x-u.actor.position.x,player.z-u.actor.position.z);pitch=0;camera.position.copy(player).add(new THREE.Vector3(0,1.7,0));camera.rotation.set(pitch,yaw,0);updateSiegeObjectives();requestLock();}
function updateSiegePeter(u,dt,pos,visible){const w=finalWar;moveKevinWarDodge(u,dt);u.spectre.position.copy(u.actor.position).add(new THREE.Vector3(0,.15,-1.5));u.spectre.visible=currentFloor===0;$('siegePeterHP').textContent=Math.ceil(u.hp)+' / '+u.maxHP;$('siegePeterBar').style.width=u.hp/u.maxHP*100+'%';$('siegePeterHealth').hidden=currentFloor!==0;const sequence=[1,2,4,5,8,9];if(u.voice){u.voice.muted=muted;if(u.voice.ended||w.time-u.voiceStarted>Math.max(10,Number.isFinite(u.voice.duration)?u.voice.duration+2:20)){u.voice.pause();u.voice=null;u.tauntAt=w.time+5;$('siegePeterTaunt').hidden=true;}}if(!u.voice&&w.time>=u.tauntAt&&currentFloor===0){const n=sequence[u.tauntIndex++%sequence.length];stopPeterKillTaunt();u.voice=peterCombatAudio[n];u.voice.currentTime=0;u.voice.muted=muted;u.voiceStarted=w.time;u.voice.play()?.catch(()=>{});$('siegePeterTauntText').textContent=peterCombatTaunts[n];$('siegePeterTaunt').hidden=false;}primeReunionMouth(u.actor,!!u.voice&&!u.voice.paused,w.time);if(visible)u.actor.rotation.y=Math.atan2(pos.x-u.actor.position.x,pos.z-u.actor.position.z);if(u.cast){const c=u.cast;c.left-=dt;u.actor.userData.arms.forEach((a,i)=>a.rotation.x=c.type===0&&i===1?-.4:-2.2);if(c.left<=0){disposeCampObject(c.warning);u.cast=null;const from=u.actor.position.clone().add(new THREE.Vector3(0,1.5,0));for(let i=0;i<(c.type===2?3:1);i++)kevinWarBeam(from.clone().add(new THREE.Vector3((i-1)*.2,0,0)),c.point,true);const victims=w.units.filter(v=>v!==u&&v.hp>0&&v.floor===0&&finalWarHostile(u.faction,v.faction)).map(v=>({unit:v,p:v.actor.position}));if(currentFloor===0)victims.push({p:player});for(const v of victims)if(Math.hypot(v.p.x-c.point.x,v.p.z-c.point.z)<c.radius&&finalWarSight(u.actor.position,v.p)){if(v.unit)damageFinalWarUnit(v.unit,c.type===2?30:22);else{w.hp=Math.max(0,w.hp-(c.type===2?30:22));if(c.type===1)w.chainSlowUntil=w.time+2;}}u.fire=1.1;u.actor.userData.body.rotation.x=.2;}return;}if(visible&&u.fire<=0&&!u.dodge){const type=u.attackIndex++%3,point=pos.clone();point.y=1.1;const radius=type===2?3.3:1.8,warning=new THREE.Mesh(new THREE.RingGeometry(radius-.12,radius,36),new THREE.MeshBasicMaterial({color:0x9e7fae,transparent:true,opacity:.8,side:THREE.DoubleSide}));warning.rotation.x=-Math.PI/2;warning.position.set(point.x,.08,point.z);w.root.add(warning);u.cast={type,point,radius,warning,left:type===2?1.35:.95};}}
function finishSiege(){stopChambersTheme();startSiegeEnding();}
const siegeEndingAudio=[new Audio("assets/audio/clip-79804f3b0469.mp3"),new Audio("assets/audio/clip-619c1a4fd7ea.mp3"),new Audio("assets/audio/clip-54998f9d79fe.mp3"),new Audio("assets/audio/clip-a7b89a14a7b8.mp3"),new Audio("assets/audio/clip-3f26ca5c0842.mp3"),new Audio("assets/audio/clip-3871c96636d1.mp3"),new Audio("assets/audio/clip-d70b3fe427af.mp3"),new Audio("assets/audio/clip-9df2bf0f8227.mp3"),new Audio("assets/audio/clip-d26b852c68d0.mp3"),new Audio("assets/audio/clip-c47baf25da42.mp3"),new Audio("assets/audio/clip-0fcf3525462e.mp3"),new Audio("assets/audio/clip-b2d00c04366e.mp3"),new Audio("assets/audio/clip-1b2c8595d112.mp3"),new Audio("assets/audio/clip-c1c09ce259e7.mp3")];
function siegeEndingClip(c=siegeEnding){return c?siegeEndingAudio[c.stage==='outro'?c.line:c.line+4]||null:null;}
function stopSiegeEndingVoice(){siegeEndingAudio.forEach(a=>{a.pause();a.currentTime=0;});}
function playSiegeEndingVoice(){stopSiegeEndingVoice();const c=siegeEnding,a=siegeEndingClip(c);c.voiceFailed=false;if(!a)return;a.muted=muted;const line=c.line,stage=c.stage;try{a.play()?.catch(()=>{if(siegeEnding===c&&c.line===line&&c.stage===stage)c.voiceFailed=true;});}catch(e){c.voiceFailed=true;}}
function siegeEndingVoiceDone(c,fallback){const a=siegeEndingClip(c);if(!a||c.voiceFailed||a.error)return c.time>=fallback;a.muted=muted;return a.ended&&c.time>.15||c.time>(Number.isFinite(a.duration)&&a.duration>0?a.duration+8:Math.max(90,fallback+15));}
function siegeEndingTalking(c){const a=siegeEndingClip(c);return !a||c.voiceFailed?true:!a.paused&&!a.ended&&a.currentTime>0;}

let siegeEnding=null;
const siegeOutroLines=[
 ['PETER CHAMBERS','So… this is what it costs to stand above him.'],
 ['GARETH WILLIAMS','Emma is dead. Peter killed her before we reached the atrium. We were too late.'],
 ['ALISSA ROBERTS','Josiah. Murderhorn. Peter. They’re all gone. Tell me that means this is finally over.'],
 ['GARETH WILLIAMS','The shooting has stopped. That is all I can promise.']
];
const sterlingDeficitLines=[
 [
  "ELIZABETH STERLING",
  "The Prime Secretary is dead. His deputy is dead. Kevin Murderhorn is dead. Tonight, this House resumes the authority that was taken from it."
 ],
 [
  "ELIZABETH STERLING",
  "I assume the office of Prime Minister. We shall restore order, reopen our institutions, and account for everything that was done in their name."
 ],
 [
  "ELIZABETH STERLING",
  "But those powers did not vanish with the men who wielded them. They tore something from the world. What remains is an absence—a debt that ordinary laws cannot measure."
 ],
 [
  "ELIZABETH STERLING",
  "I therefore declare the Metaphysical Deficit. Until its full extent is understood, every manifestation, every disturbance, and every surviving trace of those powers will fall under the authority of this government."
 ],
 [
  "ELIZABETH STERLING",
  "You have been told that the age of chains is over. Let us be precise. The chains have changed hands."
 ],
 [
  "ELIZABETH STERLING",
  "The organisation calling itself the Resistance is composed of serving and former civil servants, joined by armed collaborators. Its members used the access entrusted to them by the state to build a force beyond its control. Their previous service does not place them above scrutiny."
 ],
 [
  "ELIZABETH STERLING",
  "They will tell you that they acted to remove a tyrant. That does not entitle them to retain their weapons, conceal their activities, or decide which government they are prepared to obey. They were appointed to serve this country—not to appoint themselves its guardians."
 ],
 [
  "ELIZABETH STERLING",
  "Accordingly, I declare the Resistance a terrorist organisation. Its funds will be frozen, its weapons seized, and warrants issued for its leadership. No former grade, department, or record of service will provide immunity."
 ],
 [
  "ELIZABETH STERLING",
  "And for those still waiting for Mariah Banu: she is not coming back. Kevin Murderhorn killed her while she was in his captivity. There will be no return from exile, no restoration, and no rival administration arriving to overturn the decisions of this House."
 ],
 [
  "ELIZABETH STERLING",
  "To the civil servants still sheltering the Resistance: return to your posts and surrender what you know. Those who refuse will be treated as its accomplices. The emergency is not over because Josiah Richards is dead. From this moment forward, I decide when it ends."
 ]
];

function clearSiegeEnding(){stopSiegeEndingVoice();$('siegeCredits').hidden=true;if(!siegeEnding)return;const c=siegeEnding;disposeCampObject(c.root);scene.background.copy(c.background);scene.fog.color.copy(c.fogColor);scene.fog.density=c.fogDensity;ambient.intensity=c.ambient;cameraFill.intensity=c.fill;siegeEnding=null;$('siegeEndingUI').hidden=true;}
function startSiegeEnding(){const w=finalWar;clearSiegeEnding();w.ended=true;w.holding=false;w.paused=false;keys.clear();drag=false;stopPeterKillTaunt();stopJosiahFinalVoice();stopKevinWarVoice();w.siegeBoss.actor.rotation.z=Math.PI/2;w.siegeBoss.actor.position.y=.3;gameProgress.siegeCompleted=true;gameProgress.siegePeterDefeated=true;saveProgress();mode='siegeEnding';currentFloor=0;world.visible=true;upperWorld.visible=false;w.gun.visible=false;const root=new THREE.Group();scene.add(root);const c=siegeEnding={root,stage:'outro',line:0,time:0,total:0,background:scene.background.clone(),fogColor:scene.fog.color.clone(),fogDensity:scene.fog.density,ambient:ambient.intensity,fill:cameraFill.intensity};c.peter=w.siegeBoss.actor;c.peter.visible=true;c.peter.userData.arms.forEach(a=>a.rotation.set(0,0,0));const center=c.peter.position.clone();c.emma=makeJonesOrEmma(true);root.add(c.emma);c.emma.position.copy(center).add(new THREE.Vector3(-3,.35,1));c.emma.rotation.set(0,0,Math.PI/2);const blanket=box(root,1.45,.25,.8,mat(0x27222c),center.x-3.7,.55,center.z+1);c.gareth=w.units.find(u=>u.name==='GARETH WILLIAMS').actor;c.alissa=w.units.find(u=>u.name==='ALISSA').actor;for(const [i,a] of [c.gareth,c.alissa].entries()){a.position.copy(center).add(new THREE.Vector3(-2+i*3,0,3.8));a.rotation.y=Math.PI;a.visible=true;}for(const u of w.units)if(![c.gareth,c.alissa,c.peter].includes(u.actor)){u.actor.visible=false;if(u.spectre)u.spectre.visible=false;}if(w.siegeBoss.spectre)w.siegeBoss.spectre.visible=false;for(const e of w.effects)e.obj.visible=false;const light=new THREE.PointLight(0xb5c1dd,22,22);light.position.copy(center).add(new THREE.Vector3(0,4,3));root.add(light);for(const id of ['finalWarHUD','siegePeterUI','siegePeterHealth','siegePeterTaunt','finalWarPause','finalWarKevinDialogue','finalWarKevinHealth','josiahAtriumDialogue','josiahAtriumHealth','siegeEnd'])$(id).hidden=true;$('siegeEndingUI').hidden=false;showSiegeEndingLine();document.exitPointerLock?.();renderSiegeEnding(0);}
function beginSterlingEpilogue(){const c=siegeEnding,w=finalWar;for(const a of [subject,peter,alissa,gareth,stephen,chrisMenu,mariahMenu,garethJonesMenu,emmaMenu,kevinMenu,kevinRevealed,elizabethMenu])a.visible=false;c.stage='epilogue';c.line=0;c.time=0;c.total=0;w.root.visible=false;world.visible=upperWorld.visible=exhibit.visible=false;for(const child of c.root.children)child.visible=false;const room=makeCommonsChamber();c.root.add(room);c.room=room;room.traverse(o=>{if(o.isPointLight){o.color.setHex(0x9da6c0);o.intensity=10;}});const sterling=makeElizabethSterling();c.root.add(sterling);c.sterling=sterling;sterling.position.set(0,0,-4);sterling.rotation.y=0;const aura=new THREE.Group();c.root.add(aura);aura.position.copy(sterling.position);c.aura=aura;c.rings=[];for(let i=0;i<5;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(.8+i*.17,.022,6,64),new THREE.MeshBasicMaterial({color:i%2?0x56adac:0x8856bf,transparent:true,opacity:.22,depthWrite:false}));ring.position.y=.3+i*.45;ring.rotation.x=Math.PI/2+i*.07;aura.add(ring);c.rings.push(ring);}c.motes=[];for(let i=0;i<48;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.022+(i%3)*.006,5,5),new THREE.MeshBasicMaterial({color:i%2?0x99d2cc:0xb190e7,transparent:true,opacity:.6,depthWrite:false}));aura.add(m);c.motes.push(m);}c.glow=new THREE.PointLight(0x7744b0,9,10);c.glow.position.set(0,1.7,-4.5);c.root.add(c.glow);const key=new THREE.PointLight(0xc5d7db,15,13);key.position.set(1,3,0);c.root.add(key);ambient.intensity=.3;cameraFill.intensity=.12;flash.visible=false;scene.background.setHex(0x03040a);scene.fog.color.setHex(0x080711);scene.fog.density=.014;showSiegeEndingLine();renderSiegeEnding(0);}
function showSiegeEndingLine(){const c=siegeEnding,lines=c.stage==='outro'?siegeOutroLines:sterlingDeficitLines;const [speaker,line]=lines[c.line];$('siegeEndingTitle').textContent=c.stage==='outro'?'SIEGE OF BRENT CROSS / AFTERMATH':'EPILOGUE / THE METAPHYSICAL DEFICIT';$('siegeEndingSpeaker').textContent=speaker;$('siegeEndingSpeaker').style.color=speaker==='ELIZABETH STERLING'?'#bba3df':speaker==='PETER CHAMBERS'?'#df6b82':'#7ab6e6';$('siegeEndingLine').textContent=line;playSiegeEndingVoice();}
function advanceSiegeEnding(){const c=siegeEnding;if(mode!=='siegeEnding'||!c)return;c.line++;c.time=0;const lines=c.stage==='outro'?siegeOutroLines:sterlingDeficitLines;if(c.line>=lines.length){if(c.stage==='outro')beginSterlingEpilogue();else finishSiegeEpilogue();return;}showSiegeEndingLine();}
function skipSiegeEnding(){if(!siegeEnding||mode!=='siegeEnding')return;if(siegeEnding.stage==='outro')beginSterlingEpilogue();else finishSiegeEpilogue();}
function renderSiegeEnding(dt){const c=siegeEnding;if(!c)return;c.time+=dt;c.total+=dt;const lines=c.stage==='outro'?siegeOutroLines:sterlingDeficitLines,speaker=lines[c.line][0];if(c.stage==='outro'){const actor=speaker==='PETER CHAMBERS'?c.peter:speaker==='GARETH WILLIAMS'?c.gareth:c.alissa;for(const [name,a] of [['PETER CHAMBERS',c.peter],['GARETH WILLIAMS',c.gareth],['ALISSA ROBERTS',c.alissa]]){if(a!==c.peter)animateCharacter(c.total,false,false,a);primeReunionMouth(a,speaker===name&&siegeEndingTalking(c),c.total);}actor.updateMatrixWorld(true);const target=actor===c.peter?actor.localToWorld(new THREE.Vector3(0,1.2,0)):actor.position.clone().add(new THREE.Vector3(0,1.5,0)),offset=actor===c.peter?new THREE.Vector3(1.8,1.7,3.2):new THREE.Vector3(1.9,.35,-3.4);camera.position.copy(target).add(offset);camera.lookAt(target);}else{subject.visible=false;if(finalWar){finalWar.root.visible=false;finalWar.josiah.visible=false;}const a=c.sterling;animateCharacter(c.total,false,false,a);primeReunionMouth(a,siegeEndingTalking(c),c.total);a.userData.arms[0].rotation.x=c.line>=3?-1.1:-.3;const power=c.line>=3?1:.5;c.rings.forEach((r,i)=>{r.rotation.z=c.total*(i%2?-.35:.28);r.position.y=.3+i*.45+Math.sin(c.total*1.3+i)*.1;r.material.opacity=(.18+Math.sin(c.total*1.8+i)*.07)*power;});c.motes.forEach((m,i)=>{const angle=i*2.4+c.total*(.3+i%3*.06),radius=.85+Math.sin(i*1.7)*.32;m.position.set(Math.cos(angle)*radius,(i*.073+c.total*.25)%3.6,Math.sin(angle)*radius);});c.glow.intensity=5+power*8+Math.sin(c.total*2)*2;camera.position.set(2.5-Math.min(c.time,20)*.025,2.05,1.8-Math.min(c.time,20)*.04);camera.lookAt(0,1.6,-4);}const duration=Math.max(5,lines[c.line][1].split(/\s+/).length/2.4);const clip=siegeEndingClip(c),voiced=clip&&!c.voiceFailed&&!clip.error&&Number.isFinite(clip.duration)&&clip.duration>0;$('siegeEndingProgress').style.width=Math.min(100,(voiced?clip.currentTime/clip.duration:c.time/duration)*100)+'%';if(siegeEndingVoiceDone(c,duration))advanceSiegeEnding();}
function finishSiegeEpilogue(){if(!siegeEnding)return;stopSiegeEndingVoice();gameProgress.siegeEpilogueCompleted=true;saveProgress();primeReunionMouth(siegeEnding.sterling,false,0);$('siegeEndingUI').hidden=true;startSiegeCredits();}


function isPrimeSecretaryRoute(){return gameProgress.emmaRescued===true&&gameProgress.emmaShot!==true;}
function canOpenPrimeSecretary(){return !isKevinStoryRoute()&&gameProgress.brentCrossCompleted===true&&gameProgress.garethQuestCompleted===true&&gameProgress.corneredRatRoomsCompleted>=100&&isPrimeSecretaryRoute();}
function canOpenFinalWar(){return canOpenSecretaryDead()||canOpenPrimeSecretary()||canOpenSiege();}
const primeSecretaryOpeningOverrides={
0:['BRENT CROSS COMPLEX / SOUTH GATE','FINAL CHAPTER — THE PRIME SECRETARY'],
1:['STEPHEN MARSH','Prime Secretary, you’re under arrest for high treason.'],
2:['STEPHEN MARSH','In the name of Mariah Banu, the true Prime Minister.'],
3:['BRENT CROSS COMPLEX / THE GRAND ATRIUM','Josiah listens to the arrest order. He straightens his cuffs and waits.'],
4:['JOSIAH RICHARDS','An arrest warrant. How very official.'],
5:['JOSIAH RICHARDS','Tell your officers to hold their positions.'],
6:['JOSIAH RICHARDS','There will be no panic. Not here.'],
7:['JOSIAH RICHARDS','Emma is alive. Whatever else happens tonight, remember that.'],
8:['JOSIAH RICHARDS','Peter mistook proximity to power for the right to take it. I will not make the mistake of trusting another man so completely.'],
9:['JOSIAH RICHARDS','They saved her. I know. That earns them a hearing, not my surrender.'],
10:['JOSIAH RICHARDS','Mariah can bring her police, her speeches and her promises. I am still here.'],
11:['JOSIAH RICHARDS','Keep the south entrance covered. Nobody fires without a clear target. I want discipline, not martyrs.'],
12:['JOSIAH RICHARDS','If they reach the atrium, let them speak. I would like to hear what they think comes next.'],
13:['JOSIAH RICHARDS','Until then, hold the complex. I remain the Prime Secretary.'],
20:['ELIZABETH STERLING','No. Keep me here. Ask your questions. But understand this: Emma is alive, and Josiah is thinking clearly. He has had time to prepare.']
};
function secretaryOpeningLineAt(index){if(secretaryOpening?.siege||isSiegeRoute())return siegeOpeningLines()[index];if(secretaryOpening?.holdFireOrder)return ['JOSIAH RICHARDS','My wife is with them. Hold your fire. Escort them to the atrium—and keep Murderhorn away from her.'];if((index===1||index===2)&&stephenLeadsFinalOpening())return ['STEPHEN MARSH',secretaryOpeningLines[index][1]];return isPrimeSecretaryRoute()&&primeSecretaryOpeningOverrides[index]||secretaryOpeningLines[index];}
const primeReunionAudio=[new Audio("assets/audio/clip-9334482b6487.mp3"),new Audio("assets/audio/clip-16e7dae80840.mp3"),new Audio("assets/audio/clip-cd69c79ae260.mp3"),new Audio("assets/audio/clip-6fc05a2e1738.mp3"),new Audio("assets/audio/clip-365eb4072f9d.mp3"),new Audio("assets/audio/clip-8fd0b4db97a2.mp3"),new Audio("assets/audio/clip-b76f5f6f571f.mp3"),new Audio("assets/audio/clip-b7b82d7587ca.mp3"),new Audio("assets/audio/clip-b554c7a7b0e1.mp3")];
function playPrimeReunionAudio(index){stopJosiahFinalVoice();const audio=primeReunionAudio[index],v={audio,failed:false,elapsed:0};josiahFinalVoice=v;audio.currentTime=0;audio.muted=muted;try{audio.play()?.catch(()=>{v.failed=true;});}catch(e){v.failed=true;}}

const primeReunionLines=[
 ['EMMA RICHARDS','Josiah, look at me. I am here. I am alive.'],
 ['JOSIAH RICHARDS','Emma… I thought I would never hear your voice again.'],
 ['EMMA RICHARDS','They brought me back to you. Nobody here needs to die for that.'],
 ['JOSIAH RICHARDS','I should have protected you. I trusted Peter, and you paid for it.'],
 ['EMMA RICHARDS','Then listen to me now. Let me stand beside you without being afraid of what you will do next.'],
 ['JOSIAH RICHARDS','I am listening. I cannot undo what happened. But I will not turn you away.'],
 ['EMMA RICHARDS','That is a start. Come here.']
];
const kevinFinalTaunts=[
 "Look at this touching little reunion. Keep holding hands. I want to see who lets go first.",
 "Twenty years taking orders from men like you, Josiah. Now you get to find out what I learned in the dark.",
 "Jones, you opened the door once. Every scream since then has a little piece of your signature on it.",
 "You all think you are leaving together. That is my favourite part. The certainty, just before it breaks.",
 "Go on, Alissa. Tell them revenge makes you whole. Tell them why your hands still shake.",
 "I remember every person who begged. Not their names. Just the moment they realised I was enjoying it.",
 "Keep your eyes on me, you righteous little bastards. I want witnesses when your hope runs out.",
 "A Prime Secretary, a Prime Minister and a pair of policemen. All that authority, and none of it can make me stop.",
 "You think this ends in Brent Cross? This is where it begins. I am declaring war on the whole fucking world. Every government that used me, every flag they ordered me to kill beneath, every comfortable bastard who thought the violence would stay overseas—I am bringing it home to all of them. There will be no distant front line. They will wake up inside the war.",
 "Do you know what I see when I look at mankind? An endless queue of new masters, all waiting for their turn to put someone else in chains. I will wipe out every last one of you. No survivors to rebuild it, no children taught to worship the same rotten flags, nobody left to write a kinder version of what you were. When I am finished, the world will finally be silent."
];
function stagePrimeReunionWitnesses(){const w=finalWar,c=w.reunion,j=w.josiah.position;c.witnesses=[];for(const [i,u] of w.units.filter(u=>u.kind==='ally'||u.name==='PINTER'||u.name==='STEPHEN MARSH').entries()){u.floor=0;u.actor.visible=true;u.actor.position.copy(finalWarNearest(36+i,41,0));u.actor.rotation.y=Math.atan2(j.x-u.actor.position.x,j.z-u.actor.position.z);u.path=[];u.repath=0;c.witnesses.push(u.actor);}const sterling=makeElizabethSterling();c.root.add(sterling);sterling.position.copy(finalWarNearest(43,41,0));sterling.rotation.y=Math.PI;c.witnesses.push(sterling);}
function startPrimeKevinFinalBoss(){const w=finalWar,c=w.reunion;if(!w||w.kevinFinal)return;stopKevinWarVoice();w.kevinFinal=true;w.ended=false;w.paused=false;w.holding=false;w.hp=150;w.ammo=24;w.reload=0;w.fire=0;keys.clear();currentFloor=0;player.copy(finalWarNearest(37,40,0));yaw=0;pitch=0;for(const u of w.units){if(u.faction==='yellow'||u.name==='PSRM'){u.hp=0;u.actor.visible=false;if(u.spectre)u.spectre.visible=false;if(u.cast){disposeCampObject(u.cast.warning);u.cast=null;}}}const k=w.kevin;k.hp=k.maxHP=10000;k.floor=0;k.finalBoss=true;k.actor.visible=true;k.actor.position.copy(finalWarNearest(44,39,0));k.base.copy(k.actor.position);k.fire=1.5;k.path=[];k.repath=0;k.dodge=null;k.tauntAt=0;k.tauntIndex=0;k.decision=0;c.kevin.visible=false;if(c.healing)disposeCampObject(c.healing.root);c.healing=null;for(const u of w.units.filter(u=>u.kind==='ally'||u.kind==='police')){u.floor=0;u.actor.position.copy(finalWarNearest(36+w.units.indexOf(u)%8,41,0));u.path=[];u.repath=0;u.decision=0;}w.josiah.position.copy(finalWarNearest(40,39,0));w.josiah.userData.body.rotation.x=0;const ally=addFinalWarUnit('JOSIAH','blue',w.josiah,40,39,Infinity,'josiahAlly',0);ally.standCombat={phase:'fight',attack:0};ally.fire=1;const stand=makeKevinWarSpectre(ally);stand.traverse(o=>{if(o.material){o.material=o.material.clone();o.material.color.setHex(0x193d8c);if(o.material.emissive)o.material.emissive.setHex(0x12265b);}});w.alliedJosiah=ally;c.emma.position.copy(finalWarNearest(35,43,0));w.gun.visible=true;mode='finalWar';$('primeReunionUI').hidden=true;$('finalWarHUD').hidden=false;$('finalWarNotice').textContent='FINAL BOSS · KEVIN MURDERHORN · 10,000 HP';setupKevinArena();camera.position.copy(player).add(new THREE.Vector3(0,1.7,0));camera.rotation.set(pitch,yaw,0);requestLock();}
// Kevin's final phase: platform combat and the Union Crown chain struggle.
function setupKevinArena(){$('finalWarHUD').className='kevin-arena-hud';$('finalWarHUD').querySelector('h3').textContent='THE ATRIUM / FINAL BOSS';$('finalWarHUD').querySelector('.war-keys').textContent='WASD MOVE · SHIFT SPRINT · SPACE JUMP · CLICK / Z FIRE · R RELOAD · ESC PAUSE';$('finalWarTravel').textContent='CLIMB THE PLATFORMS · BREAK HIS GUARD · JOSIAH WILL PULL HIM DOWN';const w=finalWar,root=new THREE.Group();w.root.add(root);w.kevinArena={root,phase:'ground',time:0,cycle:0,nextRise:8,patternAt:2,pattern:0,platforms:[],projectiles:[],shotCount:0,verticalSpeed:0,grounded:true,jumpQueued:false,volleyAt:0};const b=w.kevinArena;for(let i=0;i<5;i++){const height=(i+1)*.9,x=43*CELL,z=44*CELL-i*3;const group=new THREE.Group();root.add(group);group.position.set(x,0,z);const column=box(group,2.6,height,2.6,mat(0x181021),0,height/2,0);const cap=box(group,2.68,.09,2.68,new THREE.MeshStandardMaterial({color:0x5a3e73,emissive:0x241234}),0,height,0);const rim=new THREE.LineSegments(new THREE.EdgesGeometry(cap.geometry),new THREE.LineBasicMaterial({color:0xd4aaf4}));rim.position.copy(cap.position);group.add(rim);group.scale.y=.001;group.visible=false;b.platforms.push({x,z,height,group});}w.kevin.target=null;$('kevinPatternHUD').hidden=false;$('kevinPatternText').textContent='SPACE: JUMP · CLICK: SHOOT · R: RELOAD';}
function kevinPlatformHeight(x,z){const b=finalWar?.kevinArena;if(!b||!['raising','platform','pull'].includes(b.phase))return 0;let height=0;for(const p of b.platforms)if(Math.abs(x-p.x)<1.3&&Math.abs(z-p.z)<1.3)height=Math.max(height,p.height*p.group.scale.y);return height;}
function kevinPlayerCanMove(x,z){if(!finalWarWalkable(x,z,.3,0))return false;return kevinPlatformHeight(x,z)<=player.y+.2;}
function updateKevinJump(dt){const w=finalWar,b=w.kevinArena;if(!b)return;const floor=kevinPlatformHeight(player.x,player.z);if(b.jumpQueued&&b.grounded){b.verticalSpeed=7.6;b.grounded=false;}b.jumpQueued=false;const prev=player.y;b.verticalSpeed-=20*dt;player.y+=b.verticalSpeed*dt;if(player.y<=floor&&(prev>=floor-.25||b.grounded)){player.y=floor;b.verticalSpeed=0;b.grounded=true;}else if(player.y<0){player.y=0;b.verticalSpeed=0;b.grounded=true;}else b.grounded=false;}
function clearKevinAttackMarkers(){const b=finalWar?.kevinArena;if(!b)return;for(const attack of b.projectiles)disposeCampObject(attack.root);b.projectiles=[];}
function kevinGroundPattern(type){const w=finalWar,b=w.kevinArena,k=w.kevin,root=new THREE.Group();b.root.add(root);const p=player.clone();p.y=0;const attack={type,root,time:0,origin:k.actor.position.clone(),point:p,hit:false};if(type==='sweep'){const ring=new THREE.Mesh(new THREE.TorusGeometry(1,.08,6,72),new THREE.MeshBasicMaterial({color:0xc090e5,transparent:true,opacity:.75}));ring.rotation.x=Math.PI/2;root.add(ring);root.position.copy(k.actor.position);root.position.y=.15;attack.ring=ring;$('kevinPatternText').textContent='BLACK CHAIN SWEEP · JUMP OVER THE RING';}else{const radius=type==='barrage'?1.8:2.5;attack.radius=radius;const mark=new THREE.Mesh(new THREE.RingGeometry(radius-.12,radius,32),new THREE.MeshBasicMaterial({color:0xcf79dc,side:THREE.DoubleSide,transparent:true,opacity:.7}));mark.rotation.x=-Math.PI/2;root.add(mark);root.position.set(p.x,.05,p.z);$('kevinPatternText').textContent=type==='barrage'?'SPECTRAL LASERS · LEAVE THE MARKED SPOT':'SHADOW SLAM · MOVE OUT OF THE CIRCLE';}b.projectiles.push(attack);}
function updateKevinPatterns(dt){const w=finalWar,b=w.kevinArena;for(const a of b.projectiles){a.time+=dt;if(a.type==='sweep'){const radius=a.time<1?1:(a.time-1)*12+1;a.ring.scale.setScalar(radius);if(a.time>=1&&!a.hit&&Math.abs(Math.hypot(player.x-a.origin.x,player.z-a.origin.z)-radius)<.8&&player.y<.8&&finalWarSight(a.origin,player)){a.hit=true;w.hp=Math.max(0,w.hp-24);}}else if(a.time>=1.15&&!a.hit){a.hit=true;const end=a.point.clone().add(new THREE.Vector3(0,1.2,0));kevinWarBeam(w.kevin.actor.position.clone().add(new THREE.Vector3(0,1.6,0)),end,false);if(Math.hypot(player.x-a.point.x,player.z-a.point.z)<a.radius&&finalWarSight(w.kevin.actor.position,player))w.hp=Math.max(0,w.hp-(a.type==='barrage'?22:30));if(a.type==='slam'&&finalWarWalkable(a.point.x,a.point.z,.35,0)){w.kevin.actor.position.copy(a.point);}}if(a.time>(a.type==='sweep'?5:1.65))disposeCampObject(a.root);}b.projectiles=b.projectiles.filter(a=>a.time<=(a.type==='sweep'?5:1.65));}
function beginKevinPlatformPhase(){const w=finalWar,b=w.kevinArena,k=w.kevin;b.phase='raising';b.time=0;b.shotCount=0;b.cycle++;clearKevinAttackMarkers();if(k.cast){disposeCampObject(k.cast.warning);k.cast=null;}k.dodge=null;k.actor.position.set(b.platforms[4].x,0,b.platforms[4].z);b.platforms.forEach(p=>{p.group.visible=true;p.group.scale.y=.001;});$('kevinPatternText').textContent='KEVIN RAISES THE FLOOR · JUMP UP THE PLATFORMS';}
function beginJosiahPull(){const w=finalWar,b=w.kevinArena;b.phase='pull';b.time=0;b.pullFrom=w.kevin.actor.position.clone();b.pullTo=finalWarNearest(42,41,0);b.chainAt=0;clearKevinAttackMarkers();$('kevinPatternText').textContent='UNION CROWN · JOSIAH IS DRAGGING KEVIN DOWN';}
function updateKevinArena(dt){const w=finalWar,b=w.kevinArena;if(!b)return;b.time+=dt;updateKevinPatterns(dt);const k=w.kevin;w.stairs.visible=false;world.visible=true;upperWorld.visible=false;currentFloor=0;
 if(b.phase==='ground'){if(w.time>=b.nextRise){beginKevinPlatformPhase();return;}if(w.time>=b.patternAt){kevinGroundPattern(['sweep','barrage','slam'][b.pattern++%3]);b.patternAt=w.time+4;}}
 else if(b.phase==='raising'){const t=Math.min(1,b.time/2);for(const p of b.platforms){p.group.scale.y=Math.max(.001,t);if(Math.abs(player.x-p.x)<1.3&&Math.abs(player.z-p.z)<1.3&&player.y<p.height*t){player.y=p.height*t;b.grounded=true;b.verticalSpeed=0;}}k.actor.position.y=4.5*t;k.actor.userData.arms.forEach(a=>a.rotation.x=-2.5);if(t===1){b.phase='platform';b.time=0;b.volleyAt=w.time+2;}}
 else if(b.phase==='platform'){k.actor.position.set(b.platforms[4].x,4.5,b.platforms[4].z);k.actor.userData.arms.forEach(a=>a.rotation.x=-1.8);$('kevinPatternText').textContent='JUMP + SHOOT FROM ABOVE · BREAK HIS GUARD '+b.shotCount+' / 6';if(w.time>=b.volleyAt){kevinGroundPattern('barrage');if(b.pattern++%2===0)kevinGroundPattern('sweep');b.volleyAt=w.time+2.4;}if(b.shotCount>=6)beginJosiahPull();}
 else if(b.phase==='pull'){const t=Math.min(1,b.time/2.5),j=w.alliedJosiah.actor;j.userData.arms.forEach(a=>a.rotation.x=-1.5);k.actor.position.lerpVectors(b.pullFrom,b.pullTo,t);k.actor.userData.body.rotation.x=-.3;for(const p of b.platforms)p.group.scale.y=Math.max(.001,1-t);if(w.time>=b.chainAt){kevinWarBeam(j.position.clone().add(new THREE.Vector3(0,1.5,0)),k.actor.position.clone().add(new THREE.Vector3(0,1.2,0)),true,0xeac34a);b.chainAt=w.time+.25;}if(t===1){b.phase='ground';b.time=0;b.nextRise=w.time+20;b.patternAt=w.time+4;k.fire=2;k.actor.userData.body.rotation.x=0;b.platforms.forEach(p=>p.group.visible=false);$('kevinPatternText').textContent='KEVIN EXPOSED · KEEP FIRING';damageFinalWarUnit(k,220);}}
 const ghost=k.spectre;if(ghost)ghost.position.copy(k.actor.position).add(new THREE.Vector3(0,.2,-1.2));}
function startKevinChainStruggle(){const w=finalWar;if(!w||w.kevinStruggle)return;w.ended=true;w.holding=false;w.paused=false;keys.clear();drag=false;stopKevinWarVoice();stopJosiahFinalVoice();clearKevinAttackMarkers();if(w.kevin.cast){disposeCampObject(w.kevin.cast.warning);w.kevin.cast=null;}if(w.alliedJosiah.cast){disposeCampObject(w.alliedJosiah.cast.warning);w.alliedJosiah.cast=null;}w.kevin.actor.visible=true;w.kevin.actor.position.copy(finalWarNearest(43,40,0));w.kevin.actor.position.y=0;w.alliedJosiah.actor.position.copy(finalWarNearest(40,40,0));const witnesses=w.units.filter(u=>u.hp>0&&u!==w.kevin&&u!==w.alliedJosiah);witnesses.forEach((u,i)=>{u.actor.position.set(41.5*CELL+(i-(witnesses.length-1)/2)*1.4,0,40*CELL-5);u.actor.rotation.y=0;});for(const u of [w.kevin,w.alliedJosiah])if(u.spectre)u.spectre.position.copy(u.actor.position).add(new THREE.Vector3(0,.2,-1.2));w.kevinArena.platforms.forEach(p=>p.group.visible=false);player.y=0;w.kevinStruggle={started:Date.now(),phase:'windup',presses:0,chainAt:0};mode='kevinChainStruggle';w.gun.visible=false;for(const id of ['finalWarHUD','finalWarPause','finalWarKevinDialogue','finalWarKevinHealth','kevinPatternHUD'])$(id).hidden=true;$('kevinChainUI').hidden=false;$('kevinChainPrompt').textContent='BLACK CHAINS AGAINST UNION CROWN';$('kevinChainCount').textContent='GET READY';$('kevinChainTime').textContent='';document.exitPointerLock?.();}
function pressKevinChainQTE(repeat=false){const w=finalWar,b=w?.kevinStruggle;if(!b||b.phase!=='qte'||repeat)return;if(Date.now()>=b.deadline){resolveKevinChainQTE(false);return;}b.presses++;$('kevinChainCount').textContent=b.presses+' / 10';if(b.presses>=10)resolveKevinChainQTE(true);}
function renderKevinChainStruggle(dt){const w=finalWar,b=w?.kevinStruggle;if(!b||!['windup','qte','victory'].includes(b.phase))return;const k=w.kevin.actor,j=w.alliedJosiah.actor,now=Date.now(),t=(now-b.started)/1000;k.visible=true;k.rotation.y=Math.atan2(j.position.x-k.position.x,j.position.z-k.position.z);j.rotation.y=Math.atan2(k.position.x-j.position.x,k.position.z-j.position.z);for(const a of [k,j]){a.userData.arms.forEach(arm=>arm.rotation.x=-1.6);a.userData.body.rotation.x=Math.sin(t*15)*.025;}camera.position.copy(j.position).lerp(k.position,.5).add(new THREE.Vector3(1,3.3,7));camera.lookAt(j.position.clone().lerp(k.position,.5).add(new THREE.Vector3(0,1.3,0)));if(now>=b.chainAt){kevinWarBeam(j.position.clone().add(new THREE.Vector3(0,1.5,.15)),k.position.clone().add(new THREE.Vector3(0,1.2,0)),true,0xeac34a);kevinWarBeam(k.position.clone().add(new THREE.Vector3(0,1.5,-.15)),j.position.clone().add(new THREE.Vector3(0,1.2,0)),true);b.chainAt=now+250;}for(const e of w.effects){e.life-=dt;if(e.life<=0)disposeCampObject(e.obj);}w.effects=w.effects.filter(e=>e.life>0);if(b.phase==='windup'&&t>=3){b.phase='qte';b.deadline=now+10000;$('kevinChainPrompt').textContent='HELP JOSIAH · PRESS SPACE 10 TIMES';$('kevinChainCount').textContent='0 / 10';}if(b.phase==='qte'){$('kevinChainTime').textContent=(Math.max(0,b.deadline-now)/1000).toFixed(1)+'s';if(now>=b.deadline)resolveKevinChainQTE(false);}if(b.phase==='victory'){k.position.y=Math.max(.2,1-(now-b.wonAt)/1200);k.rotation.z=Math.min(Math.PI/2,(now-b.wonAt)/1000);if(now-b.wonAt>2500)showPrimePeaceOutro();}}
let primeChainCosmos=null;
function startPrimeChainCosmos(){
 const w=finalWar,root=new THREE.Group();scene.add(root);
 const models=createJosiahCosmicModels(root),earth=new THREE.Mesh(new THREE.SphereGeometry(3,32,20),new THREE.MeshBasicMaterial({color:0x246ca9}));root.add(earth);
 const sun=new THREE.Mesh(new THREE.SphereGeometry(9,28,18),new THREE.MeshBasicMaterial({color:0xffd47c}));sun.position.x=-55;root.add(sun);
 const planets=[];for(let i=0;i<7;i++){const planet=new THREE.Mesh(new THREE.SphereGeometry(.45+i*.16,12,8),new THREE.MeshBasicMaterial({color:[0xa39483,0xc5ae81,0xb76b55,0x91a4c0][i%4]}));planet.position.set(-55+Math.cos(i*1.35)*(16+i*11),0,Math.sin(i*1.35)*(16+i*11));root.add(planet);planets.push(planet);}
 const points=[];for(let i=0;i<4000;i++){const r=Math.sqrt(i/4000)*150,a=r*.06+i*2.39996;points.push(Math.cos(a)*r,(Math.sin(i*13.7))*5,Math.sin(a)*r);}
 const galaxy=new THREE.Points(new THREE.BufferGeometry().setFromPoints(Array.from({length:points.length/3},(_,i)=>new THREE.Vector3(points[i*3],points[i*3+1],points[i*3+2]))),new THREE.PointsMaterial({color:0xd2d4ff,size:1.1,transparent:true,opacity:.9}));root.add(galaxy);
 primeChainCosmos={root,models,earth,sun,planets,galaxy,time:0,oldFog:scene.fog,oldBackground:scene.background.clone()};
 w.root.visible=false;scene.fog=null;scene.background.setHex(0x000005);mode='kevinChainCosmos';$('kevinChainUI').hidden=true;$('cosmicCaption').hidden=false;
}
function renderPrimeChainCosmos(dt){
 const c=primeChainCosmos;if(!c)return;c.time+=dt;const t=c.time;
 const stage=t<1.8?'BRENT CROSS':t<4?'UNITED KINGDOM / THE BRITISH ISLES':t<6.2?'EARTH':t<9?'THE SOLAR SYSTEM':'THE MILKY WAY';
 $('cosmicCaption').textContent=stage;c.models.british.visible=stage==='UNITED KINGDOM / THE BRITISH ISLES';
 c.earth.visible=stage==='EARTH'||stage==='THE SOLAR SYSTEM';c.sun.visible=stage==='THE SOLAR SYSTEM';c.planets.forEach(p=>p.visible=stage==='THE SOLAR SYSTEM');c.galaxy.visible=stage==='THE MILKY WAY';
 if(t<1.8){c.root.visible=false;world.visible=true;camera.position.copy(finalWar.josiah.position).add(new THREE.Vector3(t*38,12+t*45,30+t*55));camera.lookAt(finalWar.josiah.position);}
 else{world.visible=false;upperWorld.visible=false;c.root.visible=true;if(stage==='UNITED KINGDOM / THE BRITISH ISLES'){camera.position.set(0,1,10);camera.lookAt(0,0,0);c.models.british.rotation.y+=dt*.08;}else if(stage==='EARTH'){camera.position.set(0,2,12);camera.lookAt(0,0,0);c.earth.rotation.y+=dt*.2;}else if(stage==='THE SOLAR SYSTEM'){camera.position.set(18,20,90);camera.lookAt(-25,0,0);}else{camera.position.set(35,55,250);camera.lookAt(0,0,0);c.galaxy.rotation.y+=dt*.025;}}
 if(t>=12&&mode==='kevinChainCosmos'){mode='kevinChainGameOver';$('kevinChainFailure').hidden=false;}
}
function clearPrimeChainCosmos(){const c=primeChainCosmos;if(!c)return;disposeCampObject(c.root);scene.fog=c.oldFog;scene.background.copy(c.oldBackground);$('cosmicCaption').hidden=true;primeChainCosmos=null;}
function resolveKevinChainQTE(won){const w=finalWar,b=w?.kevinStruggle;if(!b||b.phase!=='qte')return;if(won){b.phase='victory';b.wonAt=Date.now();$('kevinChainPrompt').textContent='UNION CROWN PREVAILS';$('kevinChainCount').textContent='KEVIN MURDERHORN IS DEFEATED';$('kevinChainTime').textContent='';return;}b.phase='lost';gameProgress={};try{localStorage.removeItem(SAVE_KEY);saveAvailable=true;}catch(e){saveAvailable=false;try{localStorage.setItem(SAVE_KEY,'{}');saveAvailable=true;}catch(e){}}w.kevin.actor.userData.arms.forEach(a=>a.rotation.x=-2.5);startPrimeChainCosmos();}
function showPrimePeaceOutro(){const w=finalWar;if(!w||w.kevinStruggle?.phase!=='victory')return;gameProgress.primeSecretaryCompleted=true;gameProgress.primeSecretaryKevinDefeated=true;saveProgress();w.kevinStruggle.phase='complete';mode='primePeaceOutro';$('kevinChainUI').hidden=true;$('primePeaceOutro').hidden=false;}

function moveKevinFinalBoss(u,dt,pos){if(!u.finalBoss||finalWar.kevinArena?.phase!=='ground'||u.cast||u.dodge||!pos)return;const delta=pos.clone().sub(u.actor.position);delta.y=0;const d=delta.length();if(d<.1)return;delta.normalize();const side=new THREE.Vector3(delta.z,0,-delta.x).multiplyScalar(Math.sin(finalWar.time*1.8)>0?1:-1),goal=u.actor.position.clone().addScaledVector(delta,dt*(d>6?6.8:d<3?-4:0)).addScaledVector(side,dt*4.5);if(finalWarWalkable(goal.x,goal.z,.35,0)&&finalWarSight(u.actor.position,goal))u.actor.position.copy(goal);else finalWarMove(u,pos,dt,6.8);}
function finishPrimeKevinFinalBoss(){startKevinChainStruggle();}

function finishPrimeSecretaryPreview(){const w=finalWar;if(!w||w.ended)return;w.ended=true;w.holding=false;w.paused=false;stopKevinWarVoice();stopJosiahFinalVoice();keys.clear();drag=false;gameProgress.primeSecretaryStairsReached=true;saveProgress();mode='primeReunion';w.gun.visible=false;for(const id of ['finalWarHUD','finalWarPause','finalWarKevinDialogue','finalWarKevinHealth','primeSecretaryEnd'])$(id).hidden=true;currentFloor=0;world.visible=true;upperWorld.visible=false;w.seals.visible=true;for(const u of w.units){u.actor.visible=false;if(u.spectre)u.spectre.visible=false;}for(const e of w.effects)e.obj.visible=false;const root=new THREE.Group();w.root.add(root);const j=w.josiah;j.visible=true;j.rotation.set(0,0,0);poseJosiahGrieving(j,false);j.position.set(40*CELL,0,37*CELL+8);const emma=makeJonesOrEmma(true);root.add(emma);emma.position.copy(j.position).add(new THREE.Vector3(0,0,1.4));emma.rotation.y=Math.PI;const kevin=makeRevealedKevin();root.add(kevin);kevin.position.copy(j.position).add(new THREE.Vector3(5,0,6));kevin.rotation.y=Math.atan2(-5,-6);kevin.visible=false;const wounds=new THREE.Group();kevin.userData.body.add(wounds);for(let i=0;i<5;i++)ball(wounds,.06,.12,.012,mat(0x671221),-.18+i*.08,1.1+i*.055,.25);const muzzle=finaleGun(kevin);muzzle.visible=false;const wound=ball(j.userData.body,.08,.12,.015,mat(0x8a142b),.1,1.35,.25);wound.visible=false;const light=new THREE.PointLight(0xb7c8e3,30,22);light.position.copy(j.position).add(new THREE.Vector3(0,5,3));root.add(light);w.reunion={root,emma,kevin,muzzle,wound,line:0,time:0,total:0,phase:'talk',shot:false};stagePrimeReunionWitnesses();$('primeReunionNext').hidden=false;$('primeReunionUI').hidden=false;showPrimeReunionLine();document.exitPointerLock?.();renderPrimeReunion(0);}
function showPrimeReunionLine(){const c=finalWar.reunion,line=primeReunionLines[c.line];$('primeReunionSpeaker').textContent=line[0];$('primeReunionSpeaker').style.color=line[0]==='EMMA RICHARDS'?'#b8cbef':'#ef7891';$('primeReunionLine').textContent=line[1];c.time=0;playPrimeReunionAudio(c.line);}
function primeReunionMouth(actor,talking,t){const u=actor.userData;if(!u.reunionMouth)u.reunionMouth=ball(u.head,.055,.006,.009,new THREE.MeshBasicMaterial({color:0x291018}),0,-.22,.32);u.reunionMouth.visible=talking;u.reunionMouth.scale.y=.006+(talking?Math.abs(Math.sin(t*14))*.025:0);if(u.mouth)u.mouth.visible=!talking;}
function advancePrimeReunion(){const c=finalWar?.reunion;if(mode!=='primeReunion'||!c||c.phase!=='talk')return;stopJosiahFinalVoice();c.line++;if(c.line>=primeReunionLines.length){c.phase='embrace';c.time=0;$('primeReunionSpeaker').textContent='';$('primeReunionLine').textContent='';$('primeReunionNext').hidden=true;}else showPrimeReunionLine();}
function skipPrimeReunion(){if(mode!=='primeReunion'||!finalWar?.reunion)return;stopJosiahFinalVoice();const c=finalWar.reunion;c.wound.visible=false;c.muzzle.visible=false;primeReunionMouth(finalWar.josiah,false,0);primeReunionMouth(c.emma,false,0);gameProgress.primeSecretaryReunionViewed=true;saveProgress();$('primeReunionUI').hidden=true;startPrimeKevinFinalBoss();}
function renderPrimeReunion(dt){const w=finalWar,c=w?.reunion;if(!c)return;c.time+=dt;c.total+=dt;const j=w.josiah,e=c.emma,k=c.kevin;animateCharacter(c.total,false,false,j);animateCharacter(c.total+.5,false,false,e);primeReunionMouth(j,false,c.total);primeReunionMouth(e,false,c.total);let target=j.position.clone().add(new THREE.Vector3(0,1.4,.6)),shot=j.position.clone().add(new THREE.Vector3(3.8,2.1,4));
 if(c.phase==='talk'){const emma=primeReunionLines[c.line][0]==='EMMA RICHARDS',actor=emma?e:j;primeReunionMouth(actor,true,c.total);target=actor.position.clone().add(new THREE.Vector3(0,1.6,0));shot=actor.position.clone().add(new THREE.Vector3(2.2,1.95,emma?-3:3));if(tickJosiahFinalVoice(dt,Math.max(4,primeReunionLines[c.line][1].length/14))){c.line++;if(c.line===primeReunionLines.length){stopJosiahFinalVoice();$('primeReunionNext').hidden=true;c.phase='embrace';c.time=0;$('primeReunionLine').textContent='';$('primeReunionSpeaker').textContent='';}else showPrimeReunionLine();}}
 else if(c.phase==='embrace'){e.position.z=THREE.MathUtils.lerp(e.position.z,j.position.z+.6,Math.min(1,dt*2));j.userData.arms.forEach(a=>a.rotation.x=-1.2);e.userData.arms.forEach(a=>a.rotation.x=-1.25);if(c.time>3.5){c.phase='attack';c.time=0;k.visible=true;}}
 else if(c.phase==='attack'){animateCharacter(c.total,true,false,k);k.userData.body.rotation.z=-.16;k.userData.arms[0].rotation.x=-.5;k.userData.arms[1].rotation.x=-1.5;if(c.time<2)k.position.z-=dt*.7;shot=j.position.clone().add(new THREE.Vector3(4.5,2.3,7));target=j.position.clone().lerp(k.position,.5).add(new THREE.Vector3(0,1.4,0));if(c.time>=2&&!c.shot){c.shot=true;playGunshot(.85);c.wound.visible=true;c.muzzle.visible=true;finalWarTracer(k.position.clone().add(new THREE.Vector3(0,1.5,0)),j.position.clone().add(new THREE.Vector3(0,1.35,.2)),0xffd794);}if(c.shot){c.muzzle.visible=c.time<2.12;j.userData.body.rotation.x=.3;j.userData.head.rotation.x=.18;e.position.x=j.position.x-.85;e.position.z=j.position.z+.6;}for(const effect of w.effects){effect.life-=dt;if(effect.life<=0)effect.obj.visible=false;}if(c.time>3.4){c.phase='heal';c.time=0;c.healing=makeSovereignEffects(c.root,j.position.x,j.position.z);$('primeReunionSpeaker').textContent='EMMA RICHARDS';$('primeReunionLine').textContent='Josiah!';playPrimeReunionAudio(7);}}
 else if(c.phase==='heal'){animateSovereignEffects(c.healing,c.time,true);j.userData.arms[0].rotation.x=-1.2;j.userData.body.rotation.x=.25*Math.max(0,1-c.time/3);c.wound.scale.setScalar(Math.max(0,1-c.time/3));if(c.time>3)c.wound.visible=false;const voiceDone=tickJosiahFinalVoice(dt,c.lastLineStarted?5:3);if(!c.lastLineStarted&&c.time>3&&voiceDone){c.lastLineStarted=true;c.lastLineAt=c.time;playPrimeReunionAudio(8);}if(c.lastLineStarted){$('primeReunionSpeaker').textContent='JOSIAH RICHARDS';$('primeReunionLine').textContent='Stay behind me, Emma. I am not finished.';primeReunionMouth(j,true,c.time);}if(c.lastLineStarted&&josiahFinalVoice?.audio===primeReunionAudio[8]&&voiceDone&&c.time>c.lastLineAt+.2){stopJosiahFinalVoice();primeReunionMouth(j,false,0);gameProgress.primeSecretaryReunionViewed=true;saveProgress();$('primeReunionUI').hidden=true;startPrimeKevinFinalBoss();return;}}
 camera.position.lerp(shot,Math.min(1,dt*4));camera.lookAt(target);
}

function canOpenSecretaryDead(){return !isKevinStoryRoute()&&gameProgress.brentCrossCompleted===true&&gameProgress.garethQuestCompleted===true&&gameProgress.corneredRatRoomsCompleted>=100&&gameProgress.emmaShot===true;}
function clearSecretaryOpening(){stopSecretaryVoice();if(secretaryOpening){disposeCampObject(secretaryOpening.root);scene.background.copy(secretaryOpening.background);scene.fog.color.copy(secretaryOpening.fogColor);secretaryOpening=null;}$('secretaryOpeningUI').hidden=true;$('secretaryOpeningEnd').hidden=true;}
function startSecretaryOpening(kevinSiege=false){if(!chapterLoadingBypass)return loadChapterScreen(kevinSiege?'THE SIEGE OF BRENT CROSS':chapterFiveTitle(),()=>startSecretaryOpening(kevinSiege));if(kevinSiege?!canOpenKevinSiege():!canOpenFinalWar())return;clearSecretaryOpening();clearCorneredRooms();clearCorneredIntro();setMode('secretaryIntro');document.exitPointerLock?.();keys.clear();world.visible=true;upperWorld.visible=false;exhibit.visible=false;flash.visible=false;const root=new THREE.Group();scene.add(root);const x=exitCell.x*CELL,z=79*CELL;
 const c=secretaryOpening={root,x,z,kevinSiege,line:0,time:0,total:0,background:scene.background.clone(),fogColor:scene.fog.color.clone(),look:new THREE.Vector3(x,1.5,z)};scene.background.setHex(0x050308);scene.fog.color.setHex(0x090811);scene.fog.density=.008;ambient.intensity=.28;cameraFill.intensity=.12;
 box(root,34,.18,26,mat(0x181921,.4),x,-.12,z+12);for(const side of [-1,1]){box(root,3,.22,26,mat(0x424049),x+side*15,.02,z+12);for(let dz=3;dz<24;dz+=5)box(root,.13,.015,2.8,mat(0xafa7a4),x+side*5,.005,z+dz);}
 const car=makeChaseCar(0xf1f2f0);root.add(car);car.position.set(x+3.3,0,z+8);car.rotation.y=-.2;for(const side of [-1,1])for(let i=0;i<6;i++)box(car,.025,.24,.53,mat(i%2?0xc2d643:0x12467c),side*1.062,.73,-1.65+i*.56);box(car,1.15,.07,.26,mat(0x171d26),0,1.75,.05);const beacons=[];for(const side of [-1,1]){const lens=box(car,.45,.14,.23,new THREE.MeshBasicMaterial({color:0x2585ff}),side*.31,1.84,.05);const light=new THREE.PointLight(0x176dff,20,18,1.3);light.position.set(side*.4,2,.05);car.add(light);beacons.push({lens,light});}const police=sign('POLICE','#172941','#eeeeee',1.15);police.position.set(0,1.02,-1.65);police.rotation.x=-Math.PI/2;car.add(police);
 const chris=stephenLeadsFinalOpening()?makeStephen():makeChrisPinter();root.add(chris);chris.position.set(x+.6,0,z+6.7);chris.rotation.y=Math.PI;const josiah=makeCharacter();root.add(josiah);josiah.position.set(40*CELL,0,37*CELL+8);josiah.rotation.y=0;poseJosiahGrieving(josiah,!isPrimeSecretaryRoute()&&!isSiegeRoute());const atriumLight=new THREE.PointLight(0xa7b8dc,32,24,1.5);atriumLight.position.set(40*CELL-3,5,37*CELL+10);root.add(atriumLight);c.chris=chris;c.josiah=josiah;c.beacons=beacons;c.mouth=ball(chris.userData.head,.075,.006,.009,new THREE.MeshBasicMaterial({color:0x29121b}),0,-.225,.31);c.mouth.visible=false;const key=new THREE.PointLight(0xc4d5ed,22,22,1.4);key.position.set(x-3,5,z+3);root.add(key);
 populateSecretaryBrentCross(c);buildSecretaryRearMeeting(c);camera.position.set(x-9,4.5,z+14);camera.lookAt(x+1,1.4,z+4);$('secretaryOpeningUI').querySelector('.cinema-top strong').textContent='FINAL CHAPTER / '+(isPrimeSecretaryRoute()?'THE PRIME SECRETARY':'THE SECRETARY IS DEAD');if(kevinSiege||isSiegeRoute())prepareSiegeOpening(c);$('secretaryOpeningUI').hidden=false;showSecretaryOpeningLine();}
const secretaryOpeningLines=[['BRENT CROSS COMPLEX / SOUTH GATE','FINAL CHAPTER — THE SECRETARY IS DEAD'],['CHRIS PINTER','Prime Secretary, you’re under arrest for high treason.'],['CHRIS PINTER','In the name of Mariah Banu, the true Prime Minister.'],['BRENT CROSS COMPLEX / THE GRAND ATRIUM','Inside, Josiah breaks down. The arrest order echoes through the atrium.'],['JOSIAH RICHARDS','Enough.'],['JOSIAH RICHARDS','Enough…'],['JOSIAH RICHARDS','ENOUGH!'],['JOSIAH RICHARDS',"I’m God! I’m invincible!"],['JOSIAH RICHARDS','I gave the orders. I held this country together. Nobody had the right to take her from me!'],['JOSIAH RICHARDS','Emma… look at me. Look what I can do. Why can’t I bring you back?'],['JOSIAH RICHARDS','No. I will not stand here and beg. Not before them. Not before anyone.'],['JOSIAH RICHARDS','You call me a traitor? You come to my gates, wearing her authority, and expect me to kneel?'],['JOSIAH RICHARDS','Let Mariah come herself. Let her see what is left of the man she wants arrested.'],['JOSIAH RICHARDS','Come then, if you want to DIE so badly, come die! If I have to die, I will drag the whole world down with me!'],...secretaryRearLines];
function showSecretaryOpeningLine(){const c=secretaryOpening,line=secretaryOpeningLineAt(c.line);$('secretaryOpeningSpeaker').textContent=line[0];$('secretaryOpeningLine').textContent=line[1];playSecretaryVoice(c);}
function advanceSecretaryOpening(){const c=secretaryOpening;if(!c||mode!=='secretaryIntro')return;stopSecretaryVoice();if(isPrimeSecretaryRoute()&&c.line===13&&!c.holdFireOrder){c.holdFireOrder=true;c.time=0;showSecretaryOpeningLine();return;}c.holdFireOrder=false;c.line++;c.time=0;if(c.line>=(c.siege?siegeOpeningLines().length:secretaryOpeningLines.length)){finishSecretaryOpening();return;}showSecretaryOpeningLine();}
function finishSecretaryOpening(){if(!secretaryOpening||mode!=='secretaryIntro')return;stopSecretaryVoice();for(const e of secretaryOpening.rearMouths||[]){e.mouth.visible=false;if(e.actor.userData.mouth)e.actor.userData.mouth.visible=true;}if(secretaryOpening.josiahMouth)secretaryOpening.josiahMouth.visible=false;secretaryOpening.mouth.visible=false;secretaryOpening.chris.userData.mouth.visible=true;const kevinSiege=secretaryOpening.kevinSiege===true;if(kevinSiege)gameProgress.kevinSiegeIntroViewed=true;else if(isSiegeRoute())gameProgress.siegeIntroViewed=true;else if(isPrimeSecretaryRoute())gameProgress.primeSecretaryIntroViewed=true;else gameProgress.secretaryDeadIntroViewed=true;saveProgress();$('secretaryOpeningUI').hidden=true;startFinalWar(false,false,kevinSiege);}
function updateSecretaryOutburst(c){const j=c.josiah,u=j.userData;if(c.line<4)return;if(!c.josiahMouth){c.josiahMouth=ball(u.head,.085,.01,.009,new THREE.MeshBasicMaterial({color:0x261016}),.02,-.24,.334);}const level=secretaryVoiceLevel(c);c.josiahMouth.visible=level>.02;c.josiahMouth.scale.y=.006+level*(c.line===6?.07:.04);if(u.sternMouth)u.sternMouth.visible=!c.josiahMouth.visible;
 if(c.line>=6){poseJosiahGrieving(j,false);setSternJosiah(j,true);if(c.josiahMouth.visible)u.sternMouth.visible=false;u.body.rotation.x=-.08;u.head.rotation.x=-.14;u.arms[0].rotation.set(-2.8,0,-.25);u.arms[1].rotation.set(-.9,0,.55);if(c.outburstAt===undefined){c.outburstAt=c.total;c.outburstEffects=makeSovereignEffects(c.root,j.position.x,j.position.z);tone(48,.7,.22,'sawtooth',22);}animateSovereignEffects(c.outburstEffects,c.total-c.outburstAt+1.12);}
}
function renderSecretaryOpening(dt){const c=secretaryOpening;if(!c)return;c.time+=dt;c.total+=dt;if(c.siege){renderSiegeOpening(c,dt);return;}if(c.line>=14){renderSecretaryRear(c,dt);return;}const {x,z,chris}=c;animateCharacter(c.total,false,false,chris);chris.userData.arms[0].rotation.x=c.line>0?-.9:-.15;chris.userData.arms[0].rotation.z=-.2;chris.userData.head.rotation.x=.025*Math.sin(c.total*2);if(isPrimeSecretaryRoute()){poseJosiahGrieving(c.josiah,false);animateCharacter(c.total,false,false,c.josiah);c.josiah.userData.arms[0].rotation.x=c.line>=4?-.3:0;if(!c.josiahMouth)c.josiahMouth=ball(c.josiah.userData.head,.085,.006,.009,new THREE.MeshBasicMaterial({color:0x261016}),.02,-.24,.334);const level=c.line>=4&&c.line<=13?secretaryVoiceLevel(c):0;c.josiahMouth.visible=level>.02;c.josiahMouth.scale.y=.006+level*.035;if(c.josiah.userData.mouth)c.josiah.userData.mouth.visible=!c.josiahMouth.visible;}else{poseJosiahGrieving(c.josiah,true);c.josiah.userData.body.rotation.x=.17+Math.sin(c.total*7)*.024;c.josiah.userData.head.rotation.x=.22+Math.sin(c.total*5)*.018;updateSecretaryOutburst(c);}animateSecretarySoldiers(c);const level=(c.line===1||c.line===2)?secretaryVoiceLevel(c):0,talking=level>.02;c.mouth.visible=talking;c.mouth.scale.y=.006+level*.04;chris.userData.mouth.visible=!talking;c.beacons.forEach((b,i)=>{const on=Math.sin(c.total*13+i*Math.PI)>0;b.lens.material.color.setHex(on?0x51a4ff:0x102b50);b.light.intensity=on?25:1;});
 const interior=c.line>=3,goal=interior?new THREE.Vector3(40*CELL+2.3,2.3,37*CELL+11.8):c.line===0?new THREE.Vector3(x-7,3.5,z+12):new THREE.Vector3(x-1.6,2.05,z+3.3),look=interior?new THREE.Vector3(40*CELL,1.75,37*CELL+8):c.line===0?new THREE.Vector3(x+1,1.3,z+4):new THREE.Vector3(x+.6,2,z+6.7);if(c.interiorShot!==interior){if(interior){camera.position.copy(goal).add(new THREE.Vector3(1,1,2));c.look.copy(look);}c.interiorShot=interior;}camera.position.lerp(goal,1-Math.exp(-dt*(interior?.65:1.7)));c.look.lerp(look,1-Math.exp(-dt*2));camera.lookAt(c.look);if(c.outburstAt!==undefined){const age=c.total-c.outburstAt;if(age<.65){const shake=(1-age/.65)*.09;camera.position.x+=Math.sin(c.total*67)*shake;camera.position.y+=Math.sin(c.total*53)*shake;}}const duration=isPrimeSecretaryRoute()?Math.max(4,secretaryOpeningLineAt(c.line)[1].length/14):([4,7,7,6,1.5,1.5,2.5][c.line]??Math.max(5,secretaryOpeningLineAt(c.line)[1].length/13));$('secretaryOpeningProgress').style.width=Math.min(100,c.time/duration*100)+'%';if(secretaryVoiceDone(c,duration))advanceSecretaryOpening();}

function refreshChapterFive(){refreshKevinSiegeChapter();const resistance=!isKevinStoryRoute()&&gameProgress.brentCrossCompleted===true&&gameProgress.garethQuestCompleted===true,unlocked=resistance&&gameProgress.corneredRatRoomsCompleted>=100,title=chapterFiveTitle();$('chapter5').hidden=!unlocked;$('chapter5Title').textContent=title;const playable=unlocked&&canOpenFinalWar();$('chapter5State').textContent=unlocked?'UNLOCKED / '+title+(playable?' — PLAY CHAPTER':' — COMING SOON'):'🔒 COMPLETE CORNERED RAT FIRST';$('playSecretaryDead').textContent='PLAY '+title;$('playSecretaryDead').hidden=!playable;$('playSecretaryDead').disabled=!playable;$('chapter5Availability').textContent=playable?'Brent Cross / Four-faction battle':'COMING SOON';}
function refreshProgressUI(){if(typeof refreshGarethPrologueCard==='function')refreshGarethPrologueCard();refreshFinalCurtainChapter();refreshTyrantChapters();updateCharacterOutcomes();refreshChapterThree();refreshChapterFour();refreshChapterFive();refreshFreeRoamUnlock();syncMenuSong();
 const unlocked=gameProgress.brentCrossCompleted===true;
 $('chapter2Cabinet').hidden=!unlocked;$('operationCabinet').disabled=!unlocked;$('operationCabinet').textContent=(unlocked?'':'🔒 ')+ 'OPERATION: CABINET';
 $('cabinetRequirement').textContent=unlocked?'UNLOCKED / OPENING CUTSCENE':'COMPLETE ENTER BRENT CROSS FIRST';
 $('completionStatus').textContent=gameProgress.brentCrossCompleted===true?'ENTER BRENT CROSS — COMPLETED'+(saveAvailable?' / SAVED':' / THIS SESSION'):'ENTER BRENT CROSS — NOT COMPLETED';
}
function recordBrentCrossCompletion(){for(const key of ['kevinRouteStarted','kevinTubeClashWinner','kevinTubeEndingCompleted','bustersIntroViewed','pindarCompleted','pindarRoom','finalCurtainIntroViewed','finalCurtainCompleted','finalCurtainBattleDeaths'])delete gameProgress[key];delete gameProgress.newPrimeSecretaryEnding;delete gameProgress.defenseResistanceEnding;delete gameProgress.defenseLoyalEnding;delete gameProgress.siegeEpilogueCompleted;delete gameProgress.siegeCompleted;delete gameProgress.siegePeterDefeated;delete gameProgress.siegeIntroViewed;delete gameProgress.primeSecretaryCompleted;delete gameProgress.primeSecretaryKevinDefeated;delete gameProgress.secretaryDeadCompleted;delete gameProgress.josiahFinalDefeated;delete gameProgress.josiahBreakdownViewed;delete gameProgress.garethJonesDeceased;delete gameProgress.mariahNeverSeenAgain;delete gameProgress.mariahFreed;delete gameProgress.corneredRatRoomsCompleted;delete gameProgress.tubeCompleted;delete gameProgress.josiahWrathful;delete gameProgress.corneredRatStarted;delete gameProgress.corneredRatIntroViewed;delete gameProgress.civilDisobedienceSurvived;delete gameProgress.civilDisobedienceCompleted;delete gameProgress.debugCompletion;delete gameProgress.cabinetCompleted;delete gameProgress.loyalBossDefeated;delete gameProgress.loyalPursuitCompleted;delete gameProgress.a5EscapeCompleted;delete gameProgress.debugCompletion;delete gameProgress.stephenRescueOutcome;delete gameProgress.stephenLoyalDeathConfirmed;delete gameProgress.stephenRescued;delete gameProgress.stephenConfrontedJosiah;delete gameProgress.stephenFellOnMotorway;delete gameProgress.stephenFallWitnessed;delete gameProgress.debugCompletion;gameProgress.garethQuestCompleted=garethQuest==='returned';gameProgress.brentCrossCompleted=true;gameProgress.cabinetUnlocked=true;gameProgress.bestTime=typeof gameProgress.bestTime==='number'?Math.min(gameProgress.bestTime,elapsed):elapsed;saveProgress();refreshProgressUI();}
function eraseGameSave(){
 if(!window.confirm('Erase your saved completion and lock Operation: Cabinet? This cannot be undone.'))return;
 gameProgress={};try{localStorage.removeItem(SAVE_KEY);saveAvailable=true;}catch(e){saveAvailable=false;}
 refreshProgressUI();$('completionStatus').textContent=saveAvailable?'SAVE ERASED / START AGAIN':'SAVE COULD NOT BE ERASED FROM THIS BROWSER';
}
function makeDowningStreet(){
 const room=new THREE.Group();room.name='10 Downing Street at night';
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d');ctx.fillStyle='#151b22';ctx.fillRect(0,0,256,256);
 for(let row=0;row<16;row++)for(let col=-1;col<8;col++){const x=col*40+(row%2)*20,y=row*16;ctx.fillStyle=['#252b31','#20262c','#2b3037'][(row+col+9)%3];ctx.fillRect(x+1,y+1,38,14);}
 const tx=new THREE.CanvasTexture(canvas);tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.repeat.set(8,5);tx.colorSpace=THREE.SRGBColorSpace;
 const brick=new THREE.MeshStandardMaterial({map:tx,roughness:.95}),stone=mat(0xa9a593),iron=mat(0x070a0d,.4),glass=new THREE.MeshStandardMaterial({color:0x3f4a45,emissive:0x75653b,emissiveIntensity:.12,roughness:.25}),door=mat(0x030507,.25);
 box(room,26,14,1,brick,0,6.8,-.6);box(room,30,.16,10,mat(0x3b3c40,.6),0,-.12,3);box(room,36,.12,14,mat(0x10151e,.25),0,-.28,12);
 for(const y of [4.7,8.7,12.9])box(room,26,.24,.27,stone,0,y,.04);
 for(const y of [2.5,6.6,10.7])for(const x of [-10,-6,-3.5,3.5,6,10]){
  if(y===2.5&&Math.abs(x)<4)continue;
  box(room,1.6,2.5,.10,glass,x,y,.02);box(room,1.85,.13,.25,stone,x,y-1.3,.14);
  for(const s of [-1,1])box(room,.09,2.6,.15,stone,x+s*.83,y,.14);
  for(const offset of [-1.25,0,1.25])box(room,1.7,.07,.15,stone,x,y+offset,.14);box(room,.055,2.5,.15,stone,x,y,.14);
 }
 box(room,1.8,3.25,.18,door,0,1.62,.17);
 for(const x of [-.48,.48])for(const y of [.55,1.5,2.45])box(room,.70,.68,.045,mat(0x090c10,.3),x,y,.28);
 for(const s of [-1,1]){box(room,.30,4.0,.38,stone,s*1.12,2,.12);box(room,.43,.15,.48,stone,s*1.12,3.95,.18);}
 box(room,2.8,.22,.60,stone,0,4.13,.20);
 const fan=mesh(new THREE.CircleGeometry(.89,32,0,Math.PI),glass,room,0,3.25,.22);
 const arc=[];for(let i=0;i<=32;i++)arc.push([Math.cos(i/32*Math.PI)*.94,3.25+Math.sin(i/32*Math.PI)*.94,.30]);line3(room,arc,stone,.055);
 for(let i=0;i<=6;i++){const a=i/6*Math.PI;line3(room,[[0,3.25,.31],[Math.cos(a)*.86,3.25+Math.sin(a)*.86,.31]],stone,.022);}
 const num=sign('10','#e7e2d1','#030507',.32);num.position.set(0,2.85,.32);room.add(num);box(room,.38,.10,.06,mat(0xa89748,.25),0,1.8,.33);ball(room,.045,.045,.05,mat(0xb0a566,.2),0,1.3,.35);
 for(const s of [-1,1]){for(let x=1.5;x<12.5;x+=.22){box(room,.035,1.6,.035,iron,s*x,.8,2.3);mesh(new THREE.ConeGeometry(.055,.15,5),iron,room,s*x,1.67,2.3);}for(const y of [.2,1.25])box(room,11,.045,.05,iron,s*7,y,2.3);}
 const lampArc=[];for(let i=0;i<=24;i++)lampArc.push([Math.cos(i/24*Math.PI)*1.3,3.7+Math.sin(i/24*Math.PI)*.6,1.0]);line3(room,lampArc,iron,.035);
 box(room,.34,.48,.28,new THREE.MeshBasicMaterial({color:0xe5c68a}),0,4.15,1);for(const x of [-.18,.18])box(room,.03,.55,.32,iron,x,4.15,1);box(room,.46,.10,.4,iron,0,4.45,1);
 const lantern=new THREE.PointLight(0xffd291,24,12,1.5);lantern.position.set(0,4.0,1.5);room.add(lantern);
 const moon=new THREE.DirectionalLight(0x829dc9,1.5);moon.position.set(-8,13,9);room.add(moon);const fill=new THREE.PointLight(0x9db3d4,16,20,1.5);fill.position.set(2,4,7);room.add(fill);
 return room;
}
const cabinetClips=["assets/audio/clip-e9fdd3060f04.mp3","assets/audio/clip-422e3cc1259d.mp3","assets/audio/clip-407298dd994c.mp3"].map(src=>{const a=new Audio(src);a.preload='auto';return a;});
function stopCabinetAudio(){cabinetClips.forEach(a=>{a.pause();a.currentTime=0;});}
function playCabinetLine(index){stopCabinetAudio();const a=cabinetClips[index];a.muted=muted;a.play().catch(()=>{});}
function startCabinet(){if(!chapterLoadingBypass)return loadChapterScreen('OPERATION: CABINET',()=>startCabinet());
 if(!gameProgress.brentCrossCompleted)return;
 clearAtriumScene();setMode('cabinet');initAudio();document.exitPointerLock?.();
 world.visible=upperWorld.visible=exhibit.visible=false;subject.visible=peter.visible=true;alissa.visible=gareth.visible=questCase.visible=false;flash.visible=false;
 resetHunterMotion(subject);resetHunterMotion(peter);resetPeterPose();subject.position.set(-.65,0,3.7);peter.position.set(2.2,0,3.35);subject.rotation.set(0,.1,0);peter.rotation.set(0,-.25,0);subject.scale.setScalar(1);peter.scale.setScalar(1);
 const room=makeDowningStreet();scene.add(room);ambient.intensity=.22;scene.fog.density=.012;
 const crossed=new THREE.Group();peter.userData.body.add(crossed);const sleeve=mat(0x202b35),hand=mat(0xdfb79d);
 line3(crossed,[[-.33,1.46,0],[-.40,1.13,.18],[.23,1.25,.35]],sleeve,.105);line3(crossed,[[.33,1.46,0],[.39,1.1,.17],[-.23,1.25,.43]],sleeve,.105);ball(crossed,.075,.09,.055,hand,.23,1.25,.36);ball(crossed,.075,.09,.055,hand,-.23,1.25,.44);peter.userData.arms.forEach(a=>a.visible=false);
 const garethPresent=!garethRemainsAlly();if(garethPresent){resetHunterMotion(gareth);gareth.position.set(-3.0,0,3.25);gareth.rotation.set(0,.15,0);gareth.scale.setScalar(1);gareth.visible=true;}
 cabinetScene={room,crossed,garethPresent,time:0,lineTime:0,shot:0,started:false};$('atriumCutscene').hidden=false;$('cutsceneHeading').textContent='OPERATION: CABINET / 10 DOWNING STREET / NIGHT';$('atriumSpeaker').style.color='#c79aed';renderCabinet(0);
}
const cabinetLines=[['JOSIAH RICHARDS','The scum cattle have infiltrated the Brent Cross Complex and threaten my estate.'],['JOSIAH RICHARDS','I remember your face.'],['JOSIAH RICHARDS','Don’t let me see it again.']];
function renderMotorwayConfrontation(c,dt){
 if(!c.motorway){
  stopCabinetAudio();c.room.visible=false;c.crossed.visible=false;
  gareth.visible=peter.visible=false;subject.visible=stephen.visible=true;
  resetHunterMotion(subject);resetHunterMotion(stephen);subject.position.set(0,0,-1.7);subject.rotation.set(0,0,0);stephen.position.set(0,0,3);stephen.rotation.set(0,Math.PI,0);
  const road=new THREE.Group();scene.add(road);const asphalt=mat(0x10151c,.7),barrier=mat(0x4b535b),paint=mat(0xb6b7ae);
  box(road,18,.2,150,asphalt,0,-.15,0);
  for(const x of [-6,0,6])for(let z=-65;z<=65;z+=8)box(road,.12,.015,3,paint,x,-.035,z);
  for(const x of [-9,9]){box(road,.3,.7,150,barrier,x,.35,0);box(road,.15,.12,150,barrier,x,.95,0);for(let z=-60;z<=60;z+=15){box(road,.15,8,.15,barrier,x,4,z);box(road,2,.1,.2,barrier,x+(x<0?1:-1),8,z);const light=new THREE.PointLight(0xabc0dc,30,23,1.7);light.position.set(x+(x<0?2:-2),7.7,z);road.add(light);}}
  const signBoard=sign('MOTORWAY / ROAD CLOSED','#cddce4','#162d39',8);signBoard.position.set(0,6,-20);road.add(signBoard);
  const light=new THREE.PointLight(0xe6d4a5,0,18,1.2);light.position.set(0,2.5,-1);road.add(light);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1,.045,8,48),new THREE.MeshBasicMaterial({color:0xffebae,transparent:true,opacity:.9}));ring.rotation.x=Math.PI/2;ring.position.set(0,.18,-1.7);ring.visible=false;road.add(ring);
  c.motorway={road,light,ring,time:0,struck:false};ambient.intensity=.3;scene.fog.density=.022;
  $('cutsceneHeading').textContent='OPERATION: CABINET / MOTORWAY / NIGHT';$('atriumSpeaker').textContent='STEPHEN MARSH';$('atriumSpeaker').style.color='#b9d0eb';$('atriumLine').textContent='Stephen stands in Josiah’s path.';
 }
 const m=c.motorway;m.time+=dt;const t=m.time;
 animateCharacter(t,false,false,subject);if(t<2.5)animateCharacter(t,false,false,stephen);
 if(t>=1.8){subject.userData.arms.forEach(a=>a.rotation.x=-Math.min(1,(t-1.8)/.6)*2.1);$('atriumSpeaker').textContent='JOSIAH RICHARDS';$('atriumSpeaker').style.color='#ed6977';$('atriumLine').textContent='ALMIGHTY HEAVEN!';}
 if(t>=2.5&&!m.struck){m.struck=true;tone(48,.7,.65,'sawtooth',150);}
 if(m.struck){const hit=t-2.5;m.ring.visible=hit<1;m.ring.scale.setScalar(1+hit*12);m.ring.material.opacity=Math.max(0,1-hit);m.light.intensity=Math.max(0,100*(1-hit));const fall=Math.min(1,hit/.9);stephen.rotation.x=-fall*Math.PI/2;stephen.position.y=.28*fall;stephen.position.z=3+fall*.65;}
 if(t<1.8){camera.position.set(5,2.4,8-t*.3);camera.lookAt(0,1.5,.6);}else if(t<2.5){camera.position.set(1.4,2.4,1.3);camera.lookAt(0,2,-1.7);}else{camera.position.set(4.4,1.9,7.5);camera.lookAt(0,1,1.2);}
 camera.rotation.z=t>=2.5&&t<3?Math.sin(t*60)*.025:0;
 if(t>=3.4&&m.struck&&!m.outcomeSaved&&c.garethPresent&&!garethRemainsAlly()){m.outcomeSaved=true;gameProgress.stephenConfrontedJosiah=true;gameProgress.stephenFellOnMotorway=true;gameProgress.stephenFallWitnessed=true;saveProgress();}
 if(t>3.7){$('atriumSpeaker').textContent='';$('atriumLine').textContent='Stephen falls to the tarmac.';}
 $('atriumProgress').style.width=Math.min(100,t/6*100)+'%';if(t>=6)finishCabinet();
}
function clearMotorwayConfrontation(c){
 if(c.motorway){const road=c.motorway.road;scene.remove(road);road.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(o.material.map)o.material.map.dispose();o.material.dispose();}});}
 
 stephen.visible=false;stephen.rotation.set(0,0,0);stephen.position.set(0,0,0);resetHunterMotion(stephen);resetHunterMotion(subject);
}

function clearCabinetScene(){
 if(!cabinetScene)return;stopCabinetAudio();clearMotorwayConfrontation(cabinetScene);
 for(const group of [cabinetScene.room,cabinetScene.crossed])disposeCampObject(group);
 cabinetScene=null;peter.userData.arms.forEach(a=>a.visible=true);
 $('atriumCutscene').hidden=true;$('atriumSpeaker').style.color='';$('cutsceneHeading').textContent='BRENT CROSS / MOMENTS EARLIER';
 resetHunterMotion(subject);resetHunterMotion(peter);
}
function finishCabinet(){
 if(mode!=='cabinet'||!cabinetScene)return;clearCabinetScene();
 gameProgress.cabinetBriefingViewed=true;saveProgress();
 if(garethRemainsAlly())startStephenRescue();else startCarChase();refreshProgressUI();
}
function renderCabinet(dt){
 const c=cabinetScene;if(!c)return;if(c.shot>=cabinetLines.length){if(c.garethPresent)renderMotorwayConfrontation(c,dt);else finishCabinet();return;}c.time+=dt;c.lineTime+=dt;
 if(!c.started){c.started=true;playCabinetLine(c.shot);$('atriumSpeaker').textContent=cabinetLines[c.shot][0];$('atriumLine').textContent=cabinetLines[c.shot][1];}
 const clip=cabinetClips[c.shot],duration=Number.isFinite(clip.duration)&&clip.duration>0?clip.duration:[7,3.5,3.5][c.shot];
 if((clip.ended&&c.lineTime>.2)||c.lineTime>duration+1){c.shot++;c.lineTime=0;c.started=false;if(c.shot===cabinetLines.length){if(c.garethPresent)renderMotorwayConfrontation(c,0);else finishCabinet();return;}renderCabinet(0);return;}
 const shot=c.shot;
 animateCharacter(c.time,false,false,subject);animateCharacter(c.time,false,false,peter);if(c.garethPresent)animateCharacter(c.time,false,false,gareth);subject.userData.arms[0].rotation.x=-.35-Math.sin(c.time*2)*.15;subject.userData.head.rotation.y=Math.sin(c.time*2.5)*.035;
 if(shot===0){const t=Math.min(c.lineTime,7);camera.position.set(-3+t*.25,3.3-t*.12,12-t*.3);camera.lookAt(.4,2.4,1.8);}else{const t=Math.min(c.lineTime,5);camera.position.set(-.3,2.25,6.9-t*.07);camera.lookAt(-.65,2.05,3.7);}
 camera.rotation.z=0;$('atriumProgress').style.width=((shot+Math.min(1,c.lineTime/duration))/cabinetLines.length*100)+'%';
}
function closeChapterPicker(focus=true){const p=$('chapterPicker');if(!p)return;const wasOpen=!p.hidden;p.hidden=true;$('menu').inert=false;if(focus&&wasOpen)$('openChapters').focus();}





function openChapterPicker(){if(mode!=='menu')return;refreshProgressUI();$('chapterPicker').hidden=false;$('menu').inert=true;$('closeChapters').focus();}

let rescueScene=null;
function makeBossMotorway(){
 const road=new THREE.Group(),asphalt=mat(0x10151c),metal=mat(0x465260),paint=mat(0xabb8c2);
 box(road,28,.2,150,asphalt,0,-.15,12);
 for(const x of [-7,0,7])for(let z=-55;z<80;z+=7)box(road,.13,.02,3,paint,x,-.035,z);
 for(const x of [-13.7,13.7]){box(road,.25,.7,150,metal,x,.35,12);for(let z=-40;z<75;z+=18){box(road,.15,7,.15,metal,x,3.5,z);box(road,2,.12,.25,metal,x-Math.sign(x),7,z);const light=new THREE.PointLight(0xaac9ef,35,26,1.5);light.position.set(x-Math.sign(x)*2,6.8,z);road.add(light);}}
 const board=sign('MOTORWAY / ROAD CLOSED','#e2edf3','#123c31',9);board.position.set(0,6,-12);road.add(board);
 for(const z of [2,29]){box(road,26,.7,.35,metal,0,.35,z);for(let x=-12;x<=12;x+=2)box(road,.6,.3,.4,paint,x,.75,z);}
 return road;
}
function startStephenRescue(){
 if(!garethRemainsAlly())return;setMode('rescue');world.visible=upperWorld.visible=exhibit.visible=false;
 const road=makeBossMotorway();scene.add(road);rescueScene={road,time:0,outcome:null,blood:[]};
 peter.visible=false;subject.visible=alissa.visible=gareth.visible=stephen.visible=true;
 for(const a of [subject,alissa,gareth,stephen]){resetHunterMotion(a);a.scale.setScalar(1);a.rotation.set(0,0,0);a.userData.body.rotation.set(0,0,0);}
 subject.position.set(0,0,12);subject.rotation.y=0;stephen.position.set(0,.28,19);stephen.rotation.x=-Math.PI/2;
 gareth.position.set(1.05,0,18.3);gareth.rotation.y=-Math.PI/2;setupGarethRescueKneel();alissa.position.set(-3,0,21);alissa.rotation.y=Math.PI;
 for(const leg of stephen.userData.legs){const stains=new THREE.Group();leg.add(stains);rescueScene.blood.push(stains);for(let i=0;i<12;i++){const s=ball(stains,.06+(i%3)*.018,.05+(i%4)*.02,.014,mat(i%2?0x650713:0x940c1d,.5),Math.sin(i*2.3)*.07,-.08-i*.049,.137);s.rotation.z=i*.7;}}
 const ring=new THREE.Mesh(new THREE.TorusGeometry(1,.055,8,48),new THREE.MeshBasicMaterial({color:0xffde8a,transparent:true,opacity:1}));ring.rotation.x=Math.PI/2;ring.position.set(0,.12,12);ring.visible=false;road.add(ring);rescueScene.ring=ring;
 ambient.intensity=.45;scene.fog.density=.018;flash.visible=false;
 $('rescueOverlay').hidden=false;$('rescueHelp').hidden=false;$('rescueHelp').disabled=true;$('rescueHelp').textContent='GET READY';$('rescueLine').textContent='Stephen is bleeding. Gareth kneels beside him while Josiah approaches.';
}
function helpStephen(){const r=rescueScene;if(mode!=='rescue'||!r||r.time<4.2||r.time>=5.7||r.outcome)return;r.outcome='saved';playGunshot(.7);$('rescueHelp').hidden=true;$('rescueLine').textContent='Your shot breaks Josiah’s concentration. Gareth shields Stephen from the blast.';}
function clearStephenRescue(){
 clearGarethRescueKneel();const r=rescueScene;if(!r)return;
 for(const group of [r.road,...r.blood])disposeCampObject(group);
 rescueScene=null;$('rescueOverlay').hidden=true;
 for(const a of [stephen,gareth,subject]){a.rotation.set(0,0,0);a.userData.body.rotation.set(0,0,0);a.userData.head.rotation.set(0,0,0);resetHunterMotion(a);}stephen.visible=false;
}
function finishStephenRescue(){
 const r=rescueScene;if(!r)return;gameProgress.stephenRescueOutcome=r.outcome;gameProgress.stephenRescued=r.outcome==='saved';delete gameProgress.stephenLoyalDeathConfirmed;saveProgress();
 clearStephenRescue();startBossBattle();
}
function renderStephenRescue(dt){
 const r=rescueScene;r.time+=dt;const t=r.time;
 // Keep the injured body grounded; Gareth kneels at Stephen's shoulder.
 gareth.userData.body.position.y=-.38;gareth.userData.body.rotation.x=.18;gareth.userData.legs.forEach(l=>l.visible=false);gareth.userData.arms[0].rotation.x=-1.1;gareth.userData.arms[1].rotation.x=-.8;
 stephen.userData.head.rotation.z=Math.sin(t*1.7)*.025;stephen.userData.arms[0].rotation.z=-.35;
 if(t<3){camera.position.set(3.6,2.6,21.8);camera.lookAt(.3,.6,18.5);}
 else if(t<4.2){camera.position.set(2.1,2.5,15);camera.lookAt(0,1.9,12);subject.userData.arms.forEach(a=>a.rotation.x=-Math.min(1,(t-3)/1.2)*2.1);$('rescueLine').textContent='JOSIAH RICHARDS: ALMIGHTY HEAVEN!';}
 else{camera.position.set(.7,1.65,22);camera.lookAt(0,1.7,12);if(!r.outcome){$('rescueHelp').disabled=false;$('rescueHelp').textContent='[ E ] SHOOT — SAVE STEPHEN · '+Math.max(0,5.7-t).toFixed(1)+'s';$('rescueLine').textContent='STOP JOSIAH BEFORE THE BLAST HITS STEPHEN!';}}
 if(t>=5.7&&!r.outcome){r.outcome='died';$('rescueHelp').hidden=true;$('rescueLine').textContent='Too late. Almighty Heaven strikes Stephen.';tone(48,.7,.65,'sawtooth',150);}
 if(r.outcome){
  if(r.resolvedAt===undefined)r.resolvedAt=t;const age=t-r.resolvedAt;
  r.ring.visible=age<.9;r.ring.scale.setScalar(1+age*(r.outcome==='saved'?3:13));r.ring.material.opacity=Math.max(0,1-age/.9);
  if(r.outcome==='saved'){subject.userData.body.rotation.z=-Math.sin(Math.min(1,age)*Math.PI)*.25;subject.userData.arms.forEach(a=>a.rotation.x=-.4);gareth.userData.body.rotation.x=.32;
   if(age>1.2){camera.position.set(2.6,1.6,20);camera.lookAt(.3,.5,18.7);$('rescueLine').textContent='Stephen is alive. You cover Gareth as he secures the wounded constable. Josiah turns toward you.';}
  }else{stephen.userData.head.rotation.z=.18;stephen.userData.arms[0].rotation.z=-.65;camera.rotation.z=age<.4?Math.sin(age*70)*.025:0;if(age>1)$('rescueLine').textContent='Stephen is dead. Josiah turns toward you. Prepare to fight.';}
  if(age>=3.8)finishStephenRescue();
 }
}

let bossBattle=null;
function bossWalkable(x,z,r=.25){
 if(x-r< -13||x+r>13||z-r<3||z+r>28)return false;
 return ![[-9,9,-5,12],[5,17,9,20]].some(([x1,z1,x2,z2])=>x+r>x1&&x-r<x2&&z+r>z1&&z-r<z2);
}
function clearBossBattle(){
 if(!bossBattle)return;
 hideJosiahDuel();resetJosiahDuel();
 for(const group of [bossBattle.arena,bossBattle.gun,bossBattle.garethGun]){if(group.parent)group.parent.remove(group);group.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(o.material.map)o.material.map.dispose();o.material.dispose();}});}
 bossBattle=null;for(const id of ['bossHUD','bossPause','bossResult'])$(id).hidden=true;
 for(const a of [subject,peter,alissa,gareth]){resetHunterMotion(a);a.userData.arms.forEach(arm=>{arm.visible=true;arm.rotation.z=0;});}
}
function bossGun(parent){const group=new THREE.Group();parent.add(group);if(parent!==camera)registerHeldGun(group,new THREE.Vector3(0,0,-1));box(group,.10,.13,.42,mat(0x252a32,.3),0,0,-.16);box(group,.08,.2,.1,mat(0x171c25),0,-.10,0);return group;}
function startBossBattle(){
 if(!gameProgress.brentCrossCompleted||!garethRemainsAlly())return;
 clearBossBattle();setMode('boss');resetFloors();elapsed=0;keys.clear();
 world.visible=upperWorld.visible=exhibit.visible=questCase.visible=stephen.visible=false;
 for(const a of [subject,peter,alissa,gareth]){resetHunterMotion(a);a.visible=true;a.position.level=0;a.userData.goneUntil=0;a.rotation.set(0,0,0);a.scale.setScalar(1);}
 subject.position.set(0,0,6);subject.userData.hp=subject.userData.maxHP=1000;
 peter.position.set(11,0,5);peter.userData.hp=peter.userData.maxHP=250;peter.visible=false;
 alissa.position.set(-3,0,19);alissa.userData.hp=alissa.userData.maxHP=220;
 gareth.position.set(3,0,20);gareth.userData.hp=gareth.userData.maxHP=220;
 player.set(0,0,23);player.level=0;yaw=0;pitch=0;
 const arena=makeBossMotorway();scene.add(arena);box(arena,28,.15,27,mat(0x141722),0,-.12,15.5);
 for(const [x,z] of [[-7,10.5],[7,18.5]]){box(arena,4,1.25,3,mat(0x292b35),x,.63,z);box(arena,2.5,.65,1.8,mat(0x151a25),x,1.45,z);}
 const gun=bossGun(camera);gun.position.set(.30,-.25,-.55);
 const garethGun=bossGun(gareth.userData.arms[1]);garethGun.position.set(0,-.63,.025);garethGun.rotation.x=-Math.PI/2;
 bossBattle={arena,gun,garethGun,avatar:{position:player,userData:{hp:150,maxHP:150,trappedUntil:0}},weapon:0,fire:0,recoil:0,alissaFire:0,garethFire:0,peterAttack:0,peterArrived:false,target:null,noticeUntil:5,holdingFire:false};
 resetJosiahDuel();flash.visible=true;flash.intensity=28;cameraFill.intensity=.3;ambient.intensity=.32;scene.fog.density=.01;
 camera.position.copy(player);camera.position.y=1.65;camera.rotation.order='YXZ';camera.rotation.set(0,0,0);camera.updateMatrixWorld(true);
 $('bossHUD').hidden=false;$('bossNotice').textContent='DEFEAT JOSIAH / ALISSA AND GARETH ARE WITH YOU';updateBossHUD();initAudio();requestLock();
}
function bossNotice(text){$('bossNotice').textContent=text;bossBattle.noticeUntil=elapsed+4;}
function bossReinforcements(){const b=bossBattle;if(!b.peterArrived&&subject.userData.hp<=500){b.peterArrived=true;peter.visible=true;bossNotice('PETER CHAMBERS HAS ARRIVED');}}
function fireBossWeapon(){
 const b=bossBattle;if(mode!=='boss'||!b||b.fire>0)return;
 b.fire=b.weapon===0?.28:.9;b.recoil=.12;
 const direction=new THREE.Vector3();camera.getWorldDirection(direction);const ray=new THREE.Ray(camera.position.clone(),direction);
 let target=null,best=Infinity;
 for(const enemy of [subject,...(b.peterArrived?[peter]:[])]){if(enemy.userData.hp<=0)continue;const centre=enemy.position.clone();centre.y=1.25;const hit=ray.intersectSphere(new THREE.Sphere(centre,b.weapon===0?.8:1.15),new THREE.Vector3());if(hit&&hit.distanceTo(camera.position)<best&&sight(player,enemy.position)){target=enemy;best=hit.distanceTo(camera.position);}}
 if(target){const damage=b.weapon===0?25:best<12?70:30;target.userData.hp=Math.max(0,target.userData.hp-damage);$('bossReticle').textContent='×';}else $('bossReticle').textContent='+';
 playGunshot(b.weapon===0?.6:.8);bossReinforcements();
}
function bossMove(actor,target,speed,dt){
 const v=target.clone().sub(actor.position);v.y=0;const dist=v.length();if(dist<.1)return false;v.multiplyScalar(Math.min(dist,speed*dt)/dist);
 for(const offset of [0,.85,-.85]){const step=v.clone().applyAxisAngle(new THREE.Vector3(0,1,0),offset);if(bossWalkable(actor.position.x+step.x,actor.position.z+step.z)){actor.position.add(step);actor.rotation.y=Math.atan2(step.x,step.z);return true;}}return false;
}
function updateBossHUD(){
 const b=bossBattle;for(const [name,a] of [['Player',b.avatar],['Josiah',subject],['Peter',peter],['Alissa',alissa],['Gareth',gareth]]){$('boss'+name+'Health').style.width=Math.max(0,a.userData.hp/a.userData.maxHP*100)+'%';$('boss'+name+'Value').textContent=Math.ceil(a.userData.hp)+' / '+a.userData.maxHP;}
 $('bossPeterRow').hidden=!b.peterArrived;$('bossWeapon').textContent=b.weapon===0?'1 / PISTOL · ∞':'2 / SHOTGUN · ∞';
 const c=$('bossMap').getContext('2d');c.fillStyle='#100a12';c.fillRect(0,0,160,160);for(const [a,color] of [[subject,'#ff354b'],[peter,'#ad304b'],[alissa,'#53b9ff'],[gareth,'#86dcff'],[b.avatar,'#ffffff']]){if(a.userData.hp<=0||a===peter&&!b.peterArrived)continue;c.fillStyle=color;c.beginPath();c.arc((a.position.x+14)/28*160,(a.position.z-2)/28*160,3,0,TAU);c.fill();}
}
function finishBossBattle(won){
 if(mode!=='boss')return;mode='bossEnd';keys.clear();bossBattle.holdingFire=false;hideJosiahDuel();document.exitPointerLock?.();$('bossResult').hidden=false;$('bossResultTitle').textContent=won?'OPERATION: CABINET COMPLETE':'YOU FELL IN BATTLE';$('bossResultText').textContent=won?'Josiah and Peter have been defeated.':'Retry the battle with full health and your allies.';
 if(won){gameProgress.loyalBossDefeated=true;gameProgress.stephenLoyalDeathConfirmed=gameProgress.stephenRescueOutcome==='died';saveProgress();clearBossBattle();startCarChase(true);}
}
function pauseBossBattle(){if(mode!=='boss')return;mode='bossPaused';keys.clear();bossBattle.holdingFire=false;$('bossPause').hidden=false;document.exitPointerLock?.();}
function resumeBossBattle(){if(mode!=='bossPaused')return;mode='boss';$('bossPause').hidden=true;requestLock();}
function updateBossBattle(dt){
 const b=bossBattle;elapsed+=dt;b.fire=Math.max(0,b.fire-dt);b.recoil=Math.max(0,b.recoil-dt);b.alissaFire-=dt;b.garethFire-=dt;b.peterAttack-=dt;
 const forward=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0),side=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0),len=Math.hypot(forward,side)||1;
 const speed=elapsed<(b.avatar.userData.trappedUntil||0)?0:keys.has('ShiftLeft')?6.5:4.3,dx=(-Math.sin(yaw)*forward+Math.cos(yaw)*side)/len*speed*dt,dz=(-Math.cos(yaw)*forward-Math.sin(yaw)*side)/len*speed*dt;
 if(bossWalkable(player.x+dx,player.z))player.x+=dx;if(bossWalkable(player.x,player.z+dz))player.z+=dz;
 camera.position.copy(player);camera.position.y=keys.has('KeyC')?1.1:1.65;camera.rotation.set(pitch,yaw,0);camera.updateMatrixWorld(true);b.gun.position.z=-.55+b.recoil*.5;
 if(b.holdingFire)fireBossWeapon();bossReinforcements();
 const allies=[b.avatar,...[alissa,gareth].filter(a=>a.userData.hp>0)];
 if(subject.userData.hp>0){
  if(!subject.userData.duel?.phase||!b.target||b.target.userData.hp<=0){b.target=allies[Math.floor(elapsed/3)%allies.length];}
  if(subject.position.distanceTo(b.target.position)>5&&!subject.userData.duel?.phase)bossMove(subject,b.target.position,2.8,dt);
  updateJosiahDuel(dt,b.target);
 }else {subject.visible=false;hideJosiahDuel();}
 for(const [a,cool,damage] of [[alissa,'alissaFire',8],[gareth,'garethFire',6]]){
  if(a.userData.hp<=0){a.visible=false;continue;}
  const target=subject.userData.hp>0?subject:b.peterArrived&&peter.userData.hp>0?peter:null;if(!target)continue;
  const dist=a.position.distanceTo(target.position);let moving=false;
  if(elapsed>=(a.userData.trappedUntil||0)){if(dist>13)moving=bossMove(a,target.position,3.3,dt);else if(dist<4){const retreat=a.position.clone().add(a.position.clone().sub(target.position).normalize().multiplyScalar(3));moving=bossMove(a,retreat,3.3,dt);}}
  const v=target.position.clone().sub(a.position);a.rotation.y=Math.atan2(v.x,v.z);animateCharacter(elapsed,moving,false,a);a.userData.arms[1].rotation.x=-Math.PI/2;
  if(b[cool]<=0&&sight(a.position,target.position)){target.userData.hp=Math.max(0,target.userData.hp-damage);b[cool]=a===alissa?.8:1.2;playGunshot(.4);if(a===alissa)alissa.userData.muzzle.visible=true;}else if(a===alissa)alissa.userData.muzzle.visible=false;
 }
 bossReinforcements();
 if(b.peterArrived&&peter.userData.hp>0){const living=allies.filter(a=>a.userData.hp>0).sort((a,c)=>peter.position.distanceTo(a.position)-peter.position.distanceTo(c.position)),t=living[0];if(t){const moving=bossMove(peter,t.position,4.2,dt);animateCharacter(elapsed,moving,true,peter);if(peter.position.distanceTo(t.position)<1.65&&b.peterAttack<=0&&sight(peter.position,t.position)){t.userData.hp=Math.max(0,t.userData.hp-18);b.peterAttack=.9;peter.userData.arms[0].rotation.x=-1.5;}}}else if(b.peterArrived)peter.visible=false;
 if(elapsed>b.noticeUntil)$('bossNotice').textContent='';updateBossHUD();
 if(b.avatar.userData.hp<=0)finishBossBattle(false);else if(subject.userData.hp<=0&&b.peterArrived&&peter.userData.hp<=0)finishBossBattle(true);
}

const alissaChaseAudio=new Audio('assets/audio/clip-7a232ad13225.mp3');
alissaChaseAudio.preload='auto';
function stopChaseVoice(){alissaChaseAudio.pause();alissaChaseAudio.currentTime=0;}
function playChaseVoice(){stopChaseVoice();alissaChaseAudio.muted=muted;const pending=alissaChaseAudio.play();if(pending?.catch)pending.catch(()=>{});}
const hurryUpAudio=new Audio('assets/audio/clip-0d2a4059270e.mp3');
hurryUpAudio.preload='auto';hurryUpAudio.loop=true;hurryUpAudio.volume=.45;
function playHurryUp(){hurryUpAudio.muted=muted;const pending=hurryUpAudio.play();if(pending?.catch)pending.catch(()=>{});}
function stopHurryUp(){hurryUpAudio.pause();hurryUpAudio.currentTime=0;}
let carChase=null;
const chaseStops=[['STAPLES CORNER',0],['WEST HENDON BROADWAY / A5',180],['THE HYDE',520],['COLINDALE / EDGWARE ROAD',900],['BURNT OAK BROADWAY',1350],['EDGWARE HIGH STREET',1750],['TURN RIGHT / STATION ROAD A5100',1900],['EDGWARE STATION',2120]];
function chasePoint(s,lane=0){const turn=Math.max(0,Math.min(1,(s-1860)/110)),angle=turn*Math.PI/2;const x=s<1860?Math.sin(s/430)*24:Math.sin(1860/430)*24+(s-1860)*turn;return {x:x+Math.cos(angle)*lane,z:-Math.min(s,1970)+Math.sin(angle)*lane,angle};}
function placeChaseCar(car,s,lane){const p=chasePoint(s,lane);car.position.set(p.x,0,p.z);car.rotation.y=-p.angle;}
function makeChaseCar(color,r8=false,bus=false){
 const car=new THREE.Group(),body=mat(color,.3),glass=new THREE.MeshStandardMaterial({color:0x55788b,transparent:true,opacity:.38,roughness:.2}),rubber=mat(0x090a0d),metal=mat(0x8895a2,.25);
 const w=bus?2.6:2.1,len=bus?9:4.5;
 box(car,w,bus?3.8:.58,len,body,0,bus?2.2:.65,0);
 if(bus){for(const y of [1.65,3.1])for(const x of [-1.31,1.31])box(car,.02,.75,7.8,glass,x,y,0);box(car,2.3,.8,.03,glass,0,3.1,-4.51);const b=sign('142 EDGWARE','#ffda78','#090b0c',2);b.position.set(0,3.9,-4.53);b.rotation.y=Math.PI;car.add(b);}
 else{box(car,1.65,.12,1.9,body,0,1.63,.18);box(car,1.65,.68,.03,glass,0,1.26,-.8);box(car,1.65,.58,.03,glass,0,1.28,1.1);for(const x of [-.86,.86]){box(car,.04,.58,1.7,glass,x,1.26,.15);box(car,.06,.65,.09,body,x,1.26,-.8);box(car,.07,.6,.08,body,x,1.28,1.1);}
 box(car,1.5,.26,.05,rubber,0,.64,-2.28);for(const x of [-.78,.78]){box(car,.5,.07,.05,new THREE.MeshBasicMaterial({color:0xc9efff}),x,.93,-2.29);box(car,.42,.07,.05,new THREE.MeshBasicMaterial({color:0xe32139}),x,.82,2.27);}
 if(r8){box(car,2.25,.09,.45,rubber,0,1.12,1.95);for(const x of [-.7,.7])box(car,.06,.28,.12,metal,x,.98,1.95);for(const x of [-1.06,1.06])box(car,.025,.48,.85,rubber,x,.76,.9);for(let i=0;i<4;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(.075,.012,5,16),metal);ring.position.set((i-1.5)*.105,.87,-2.32);car.add(ring);}}
 }
 for(const x of [-w/2,w/2])for(const z of [-len*.32,len*.32]){const tire=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.24,14),rubber);tire.rotation.z=Math.PI/2;tire.position.set(x,.43,z);car.add(tire);const hub=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,.25,10),metal);hub.rotation.z=Math.PI/2;hub.position.copy(tire.position);car.add(hub);}
 return car;
}
function chaseOccupant(car,x,z,hairColor){const p=new THREE.Group();car.add(p);p.position.set(x,.55,z);box(p,.42,.45,.3,mat(0x13151e),0,.35,0);ball(p,.2,.24,.2,mat(0xe7b496),0,.83,0);ball(p,.21,.13,.21,mat(hairColor),0,1,-.01);return p;}
function clearCarChase(){stopHurryUp();stopChaseVoice();stopR8AftermathVoice();if(!carChase)return;scene.remove(carChase.root);carChase.root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(o.material.map)o.material.map.dispose();o.material.dispose();}});carChase=null;for(const id of ['chaseHUD','chaseIntro','chaseResult','chasePause','r8Aftermath'])$(id).hidden=true;}
function startCarChase(pursuit=false){
 if(!gameProgress.brentCrossCompleted||(pursuit?(!garethRemainsAlly()||!gameProgress.loyalBossDefeated):garethRemainsAlly()))return;clearCarChase();setMode('chaseIntro');keys.clear();document.exitPointerLock?.();world.visible=upperWorld.visible=exhibit.visible=false;for(const a of [subject,peter,alissa,gareth,stephen])a.visible=false;
 const root=new THREE.Group();scene.add(root);const asphalt=mat(0x171b24),pavement=mat(0x41414a),paint=mat(0xc9bdac);
 for(let s=0;s<2200;s+=25){const p=chasePoint(s),chunk=new THREE.Group();chunk.position.set(p.x,0,p.z);chunk.rotation.y=-p.angle;root.add(chunk);box(chunk,14,.2,27,asphalt,0,-.15,0);for(const x of [-8,8]){box(chunk,2,.22,27,pavement,x,-.04,0);const height=4+(s/25%5)*1.3;box(chunk,8,height,20,mat(s%50?0x4b3539:0x363c48),x*1.8,height/2,0);for(const y of [2,4])box(chunk,.06,.75,14,mat(0x968d70),x*1.8-Math.sign(x)*4.03,y,0);}for(const x of [-3.5,0,3.5])box(chunk,.1,.02,8,paint,x,.01,0);if(s%100===0){box(chunk,.12,6,.12,paint,-7,3,0);const light=new THREE.PointLight(0xc5d5f5,18,38,1.6);light.position.set(-6,5.8,0);chunk.add(light);}}
 for(const [name,s] of chaseStops){const p=chasePoint(s),label=sign(name,'#f1eeee','#174432',7);label.position.set(p.x,5,p.z-8);root.add(label);}
 const station=new THREE.Group();root.add(station);const end=chasePoint(2140);station.position.set(end.x+8,0,end.z);box(station,5,4,12,mat(0x9e674a),0,2,0);const label=sign('EDGWARE STATION','#ffffff','#132b5b',6);label.position.set(-3,3.5,0);label.rotation.y=-Math.PI/2;station.add(label);const roundel=new THREE.Mesh(new THREE.TorusGeometry(1,.22,8,24),mat(0xc82138));roundel.position.set(-3,5,0);roundel.rotation.y=-Math.PI/2;station.add(roundel);
 const car=makeChaseCar(0x274d78),r8=makeChaseCar(0x07090c,true);root.add(car,r8);chaseOccupant(car,-.43,.2,0x0a090b);chaseOccupant(car,.43,.2,0x473628);chaseOccupant(r8,.45,-.1,0x855326);chaseOccupant(r8,-.45,-.1,0x38291e);if(pursuit)chaseOccupant(car,0,.9,0x171512);else chaseOccupant(r8,0,.9,0x171512);
 const traffic=[];for(let i=0;i<28;i++){const bus=i%7===0,model=makeChaseCar(bus?0xbb1228:[0x9f9da0,0x526673,0x783d42][i%3],false,bus);root.add(model);traffic.push({model,s:120+i*76,lane:i%3===0?2.1:i%2?-5.1:-1.8,speed:i%3===0?-12:10+i%4,bus});}
 carChase={root,car,r8,traffic,pursuit,r8hp:300,shot:0,ram:0,rivalLane:-3.5,s:0,lane:-3.5,speed:0,hp:100,gap:45,time:0,intro:0,hit:0};placeChaseCar(car,0,-3.5);placeChaseCar(r8,pursuit?45:-35,-3.5);ambient.intensity=.7;scene.fog.density=.007;flash.visible=false;
 $('chaseIntro').hidden=false;$('chaseHUD').hidden=false;renderCarChase(0);$('chaseIntroTitle').textContent=pursuit?'JOSIAH IS ESCAPING':'ALISSA ROBERTS';$('chaseDialogue').textContent=pursuit?'Alissa: He’s making for Edgware. Stay on him — we have to stop that car!':'“Damn, the Prime Secretary is really that ruthless, killing innocent cops just for doing their job!”';$('chaseMission').textContent=pursuit?'Pursue Josiah and Peter along the A5 with Alissa and Gareth. Hold F to fire when close and lined up, or ram the R8. Destroy it before Edgware station.':'Josiah is driving the black R8, with Peter and Gareth. Get Alissa to Edgware station via Colindale. Follow the A5 and Station Road.';$('chaseCombat').hidden=!pursuit;if(!pursuit)playChaseVoice();
}
function beginCarChase(){if(mode!=='chaseIntro')return;stopChaseVoice();stopHurryUp();playHurryUp();mode='chase';$('chaseIntro').hidden=true;keys.clear();}
function pauseCarChase(){if(mode!=='chase')return;hurryUpAudio.pause();mode='chasePaused';keys.clear();$('chasePause').hidden=false;}
function resumeCarChase(){if(mode!=='chasePaused')return;playHurryUp();mode='chase';$('chasePause').hidden=true;}
const r8AftermathLines=[["JOSIAH RICHARDS","Ah—my ribs. Peter, where are you? Answer me."],["ALISSA ROBERTS","He cannot hear you over the wreck, Prime Secretary."],["JOSIAH RICHARDS","Stay back. I can still stand."],["JOSIAH RICHARDS","No… no, my arm is broken. I can feel it."],["ALISSA ROBERTS","All those chains, and a crash still puts you on the pavement."],["JOSIAH RICHARDS","You think this is funny? People were in that car."],["JOSIAH RICHARDS","Every breath feels like glass. What did you do to me?"],["ALISSA ROBERTS","You chased us across London. Now you know how it feels to be helpless."],["JOSIAH RICHARDS","I gave an order. I did not order you to kill us."],["JOSIAH RICHARDS","My leg—damn it. Do not touch it."],["ALISSA ROBERTS","For once, you are the one asking someone to show mercy."],["JOSIAH RICHARDS","I will remember every face here. Every single one."],["JOSIAH RICHARDS","Get me out of the road. I need a doctor."],["JOSIAH RICHARDS","This is not over. I will make it to Parliament, even if I have to crawl."]];
const r8AftermathClips=["assets/audio/clip-9285291a2979.mp3","assets/audio/clip-0c9021c6fa34.mp3","assets/audio/clip-36bea8e344ce.mp3","assets/audio/clip-3f396cdcb6b5.mp3","assets/audio/clip-4b5317df403b.mp3","assets/audio/clip-019adbc5a914.mp3","assets/audio/clip-4c55e915a9cb.mp3","assets/audio/clip-3346053ed817.mp3","assets/audio/clip-883167722f4b.mp3","assets/audio/clip-c5ccf9d6805a.mp3","assets/audio/clip-6aafba7a3dec.mp3","assets/audio/clip-cccdbd4b96e8.mp3","assets/audio/clip-ea370089bbd7.mp3","assets/audio/clip-bf2e17d2a9dc.mp3"].map(src=>{const audio=new Audio(src);audio.preload='metadata';return audio;});
function stopR8AftermathVoice(){for(const audio of r8AftermathClips){audio.pause();audio.currentTime=0;}}
function playR8AftermathLine(a,index){stopR8AftermathVoice();a.line=index;a.time=0;a.voiceFailed=false;const clip=r8AftermathClips[index];clip.muted=muted;try{clip.play()?.catch(()=>{if(carChase?.aftermath===a&&a.line===index)a.voiceFailed=true;});}catch(e){a.voiceFailed=true;}}
let r8LipAnalyser=null,r8LipSamples=null;const r8LipSources=new WeakMap();
function prepareR8LipAudio(){initAudio();if(!audioCtx)return;try{if(!r8LipAnalyser){r8LipAnalyser=audioCtx.createAnalyser();r8LipAnalyser.fftSize=256;r8LipSamples=new Uint8Array(256);r8LipAnalyser.connect(audioCtx.destination);}for(const clip of r8AftermathClips)if(!r8LipSources.has(clip)){const source=audioCtx.createMediaElementSource(clip);source.connect(r8LipAnalyser);r8LipSources.set(clip,source);}}catch(e){r8LipAnalyser=null;}}
function r8LipLevel(clip,failed){if(failed||clip.paused||clip.ended)return 0;if(r8LipAnalyser){r8LipAnalyser.getByteTimeDomainData(r8LipSamples);let power=0;for(const value of r8LipSamples)power+=((value-128)/128)**2;return Math.min(1,Math.sqrt(power/r8LipSamples.length)*6);}return .18+.16*Math.abs(Math.sin(clip.currentTime*11));}
function startR8Aftermath(){
 const c=carChase;if(!c||!c.pursuit)return;prepareR8LipAudio();mode='r8Aftermath';keys.clear();document.exitPointerLock?.();$('chaseHUD').hidden=true;$('chaseIntro').hidden=true;
 const root=c.aftermathRoot=new THREE.Group();c.root.add(root);const wreck=c.r8.position.clone();
 c.r8.rotation.z=-.38;c.r8.rotation.x=.08;
 const josiah=makeCharacter(),alissaActor=makeAlissa();root.add(josiah,alissaActor);c.aftermathJosiah=josiah;c.aftermathAlissa=alissaActor;
 josiah.position.copy(wreck).add(new THREE.Vector3(2.4,0,1.2));alissaActor.position.copy(wreck).add(new THREE.Vector3(-1.3,0,3.6));
 josiah.rotation.y=.18;alissaActor.rotation.y=-.3;const light=new THREE.PointLight(0xe1d5cb,34,17,1.4);light.position.copy(wreck).add(new THREE.Vector3(0,4,2));root.add(light);const redGlow=new THREE.PointLight(0xb51630,13,12);redGlow.position.copy(wreck).add(new THREE.Vector3(-2,1.5,-1));root.add(redGlow);camera.position.copy(josiah.position).add(new THREE.Vector3(2.5,2.25,4));camera.lookAt(josiah.position.clone().add(new THREE.Vector3(0,1.35,0)));
 const red=mat(0x711221),dark=mat(0x39070d);
 for(let i=0;i<22;i++){const x=Math.sin(i*7.2)*.29,y=.82+(i%9)*.11;ball(josiah.userData.body,.035+(i%3)*.019,.045+(i%4)*.02,.016,i%3?red:dark,x,y,.245);}
 for(const leg of josiah.userData.legs)for(let i=0;i<9;i++)ball(leg,.038,.056,.017,i%2?red:dark,Math.sin(i*2)*.08,-.05-i*.075,.145);
 for(let i=0;i<6;i++)ball(josiah.userData.head,.026,.036,.012,red,-.22+i*.023,-.03-i*.046,.28);
 josiah.userData.body.rotation.x=.48;josiah.userData.head.rotation.x=.18;josiah.userData.arms[0].rotation.set(-.85,0,-.7);josiah.userData.arms[1].rotation.x=-1.2;
 c.aftermath={line:0,time:0,total:0,voiceFailed:false};$('r8Aftermath').hidden=false;playR8AftermathLine(c.aftermath,0);renderR8Aftermath(0);
}
function finishR8Aftermath(){if(mode!=='r8Aftermath')return;stopR8AftermathVoice();$('r8Aftermath').hidden=true;startCivilDisobedience();}
function renderR8Aftermath(dt){const c=carChase,a=c?.aftermath;if(!a||mode!=='r8Aftermath')return;a.time+=dt;a.total+=dt;
 let clip=r8AftermathClips[a.line];clip.muted=muted;
 let duration=Number.isFinite(clip.duration)&&clip.duration>0?clip.duration:Math.max(4.2,r8AftermathLines[a.line][1].length/15);
 if((clip.ended&&a.time>.2)||a.voiceFailed&&a.time>=duration||a.time>=duration+8){
  if(a.line===r8AftermathLines.length-1){finishR8Aftermath();return;}
  playR8AftermathLine(a,a.line+1);clip=r8AftermathClips[a.line];duration=Number.isFinite(clip.duration)&&clip.duration>0?clip.duration:Math.max(4.2,r8AftermathLines[a.line][1].length/15);
 }
 const [name,text]=r8AftermathLines[a.line],josiah=name==='JOSIAH RICHARDS',j=c.aftermathJosiah,l=c.aftermathAlissa,actor=josiah?j:l;
 $('r8AftermathSpeaker').textContent=name;$('r8AftermathLine').textContent=text;$('r8AftermathProgress').style.width=Math.min(100,100*(a.voiceFailed?a.time:clip.currentTime)/duration)+'%';
 j.userData.body.rotation.x=.42+Math.sin(a.total*2)*.018;j.userData.head.rotation.x=.17+Math.sin(a.total*3)*.025;
 l.userData.arms[0].rotation.x=-.4-Math.sin(a.total*2)*.08;
 if(!a.mouths){a.mouths=[j,l].map((actor,i)=>{const shape=new THREE.Shape();shape.absellipse(0,0,i?.067:.092,.03,0,TAU,false,0);const mouth=new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshBasicMaterial({color:i?0x5b2532:0x241016,side:THREE.DoubleSide,depthTest:true}));mouth.position.set(0,i?-.2:-.247,i?.264:.334);mouth.scale.y=.15;mouth.visible=false;actor.userData.head.add(mouth);return {actor,mouth,level:0};});}
 const voice=r8LipLevel(clip,a.voiceFailed);
 for(let i=0;i<2;i++){const entry=a.mouths[i],target=(josiah?i===0:i===1)?voice:0;entry.level+=(target-entry.level)*Math.min(1,dt*18);const open=entry.level>.035;entry.mouth.visible=open;entry.mouth.scale.y=.22+entry.level*1.4;if(entry.actor.userData.mouth)entry.actor.userData.mouth.visible=!open;if(entry.actor.userData.smileCrease)entry.actor.userData.smileCrease.visible=!open;}
 const target=actor.position.clone().add(new THREE.Vector3(0,1.35,0)),shot=target.clone().add(josiah?new THREE.Vector3(2.5,.9,4):new THREE.Vector3(-2,.6,3.2));
 camera.position.lerp(shot,Math.min(1,dt*4));camera.lookAt(target);
}
function finishCarChase(won){
 if(!carChase)return;const loyal=carChase.pursuit;stopHurryUp();stopGunshots();keys.clear();
 if(won){gameProgress.cabinetCompleted=true;if(loyal)gameProgress.loyalPursuitCompleted=true;else gameProgress.a5EscapeCompleted=true;saveProgress();if(loyal)startR8Aftermath();else queueMicrotask(()=>continueCompletedChapter(2));return;}
 mode='chaseEnd';$('chaseResult').hidden=false;$('chaseResultTitle').textContent=loyal?'PURSUIT FAILED':'THE R8 CAUGHT YOU';$('chaseResultText').textContent=loyal?'Josiah escaped or your car was wrecked. Return to the main menu.':'Your escape was stopped. Return to the main menu.';
}
function renderCarChase(dt){
 const c=carChase;if(!c)return;c.time+=dt;
 if(mode==='chaseIntro'){c.intro+=dt;camera.position.set(c.car.position.x+5,2.7,7);camera.lookAt(c.car.position.clone().add(new THREE.Vector3(0,1,0)));}
 if(mode==='chase'){
 const throttle=keys.has('KeyW')||keys.has('ArrowUp'),brake=keys.has('KeyS')||keys.has('ArrowDown')||keys.has('Space');c.speed=THREE.MathUtils.clamp(c.speed+(throttle?10:-3)*dt-(brake?22*dt:0),0,38);
 const steer=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0);c.lane+=steer*dt*(2+c.speed*.1);if(Math.abs(c.lane)>6){c.lane=THREE.MathUtils.clamp(c.lane,-6,6);c.speed*=.98;c.hp-=8*dt;}
 c.s+=c.speed*dt;c.gap=c.pursuit?THREE.MathUtils.clamp(c.gap+(29-c.speed)*dt,3,180):THREE.MathUtils.clamp(c.gap+(c.speed-27)*dt*.24,0,90);c.hit=Math.max(0,c.hit-dt);
 for(const t of c.traffic){t.s+=t.speed*dt;if(t.s<c.s-100)t.s=c.s+500;if(t.s>2180)t.s=c.s+300;placeChaseCar(t.model,t.s,t.lane);if(t.speed<0)t.model.rotation.y+=Math.PI;if(c.hit===0&&Math.abs(t.s-c.s)<(t.bus?6:4)&&Math.abs(t.lane-c.lane)<2.15){c.hp-=t.speed<0?28:18;c.speed*=.5;c.hit=1.1;t.s+=20;}}
 placeChaseCar(c.car,c.s,c.lane);if(c.pursuit){c.rivalLane=-3.5+Math.sin(c.time*.65)*1.6;placeChaseCar(c.r8,c.s+c.gap,c.rivalLane);c.shot=Math.max(0,c.shot-dt);c.ram=Math.max(0,c.ram-dt);if(keys.has('KeyF')&&c.shot===0){c.shot=.25;playGunshot(.55);if(c.gap<60&&Math.abs(c.lane-c.rivalLane)<1.7){c.r8hp=Math.max(0,c.r8hp-18);c.r8.rotation.z=.055;}}if(c.gap<5&&Math.abs(c.lane-c.rivalLane)<2&&c.ram===0){c.r8hp=Math.max(0,c.r8hp-45);c.hp-=5;c.gap=12;c.ram=1;c.hit=.25;} $('r8Health').style.width=c.r8hp/3+'%';$('r8HealthText').textContent='JOSIAH’S R8 · '+c.r8hp+' / 300 HP · HOLD F TO FIRE';}else placeChaseCar(c.r8,c.s-c.gap,c.lane+Math.sin(c.time)*.45);
 const back=chasePoint(c.s-10,c.lane);camera.position.set(back.x,4.6,back.z+2);const ahead=chasePoint(c.s+18,c.lane);camera.lookAt(ahead.x,1,ahead.z);camera.rotation.z=c.hit>0?Math.sin(c.time*45)*.025:0;
 if(c.pursuit){if(c.hp<=0)finishCarChase(false);else if(c.r8hp<=0)finishCarChase(true);else if(c.gap>=180||c.s+c.gap>=2120)finishCarChase(false);}else if(c.hp<=0||c.gap<=0)finishCarChase(false);else if(c.s>=2120)finishCarChase(true);
 }
 const stop=chaseStops.filter(x=>x[1]<=c.s).pop();$('chasePlace').textContent=stop[0];$('chaseStats').textContent=Math.round(c.speed*2.237)+' MPH · CAR '+Math.max(0,Math.ceil(c.hp))+'% · R8 '+Math.round(c.gap)+(c.pursuit?'m AHEAD':'m BEHIND');$('chaseProgress').style.width=Math.min(100,c.s/2120*100)+'%';
}

const gunshotSource='assets/audio/clip-de51e20efd90.mp3';
const gunshotPool=Array.from({length:8},()=>{const a=new Audio(gunshotSource);a.preload='auto';return a;});let gunshotIndex=0;
function playGunshot(volume=.6){if(muted)return;const a=gunshotPool[gunshotIndex++%gunshotPool.length];a.pause();a.currentTime=0;a.volume=volume;a.muted=false;const pending=a.play();if(pending?.catch)pending.catch(()=>{});}
function stopGunshots(){gunshotPool.forEach(a=>{a.pause();a.currentTime=0;});}

let civilScene=null;
function makeMariahBanu(){
 const root=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group(),arms=[],legs=[];root.name='Mariah Banu';root.add(body);body.add(head);head.position.y=2.04;
 const skin=mat(0x80522e),hair=mat(0x0b0c0f),red=mat(0xd31a23),cloth=mat(0x211012),gold=mat(0xb89935,.7),ink=mat(0x24160f),eyeWhite=mat(0xe9e2d6);
 ball(body,.265,.40,.19,cloth,0,1.22,0);box(body,.40,.17,.30,cloth,0,.91,0);ball(body,.25,.15,.205,red,0,.97,0);
 const sash=box(body,.105,.59,.04,red,-.012,1.32,.194);sash.rotation.z=.40;
 for(const s of [-1,1]){const arm=new THREE.Group();body.add(arm);arm.position.set(s*.285,1.47,0);ball(arm,.08,.31,.09,skin,0,-.27,0);ball(arm,.07,.18,.075,skin,0,-.53,.015);ball(arm,.068,.10,.075,skin,0,-.72,.015);arms.push(arm);
  if(s===-1)for(const y of [-.56,-.605,-.65]){const bracelet=mesh(new THREE.TorusGeometry(.085,.013,6,20),gold,arm,0,y,.01);bracelet.rotation.x=Math.PI/2;}
  const leg=new THREE.Group();root.add(leg);leg.position.set(s*.125,.82,0);box(leg,.215,.70,.25,cloth,0,-.33,0);ball(leg,.15,.075,.22,red,0,-.75,.09);box(leg,.14,.08,.12,red,0,-.78,-.075);legs.push(leg);}
 ball(head,.092,.18,.09,skin,0,-.35,0);ball(head,.28,.35,.25,skin,0,0,.025);ball(head,.21,.18,.20,skin,0,-.20,.04);
 // Dense rounded curls build the reference's swept-back, voluminous silhouette.
 ball(head,.35,.45,.25,hair,-.085,.01,-.17);
 for(let row=0;row<8;row++)for(let col=0;col<6;col++){const a=Math.PI*.1+col/5*Math.PI*.95,x=-.055+Math.cos(a)*(.32+Math.sin(row)*.015),y=.38-row*.115,z=-.13-Math.sin(a)*.18;ball(head,.105,.10,.11,hair,x,y,z);}
 for(let i=0;i<8;i++)ball(head,.10,.105,.12,hair,-.30-i%2*.025,.23-i*.11,-.05);
 // Bright red band curves across the front of the curls.
 const band=mesh(new THREE.TorusGeometry(.30,.045,8,30,Math.PI*.94),red,head,0,.055,.12);band.rotation.z=.13;band.scale.set(1,1.18,1);const knot=ball(head,.08,.045,.06,red,.18,.35,.15);knot.rotation.z=-.25;
 for(const s of [-1,1]){ball(head,.060,.085,.05,skin,s*.277,-.07,.02);ball(head,.093,.054,.023,eyeWhite,s*.12,.01,.26);ball(head,.026,.031,.014,ink,s*.12+.01,.003,.282);ball(head,.10,.035,.025,skin,s*.12,.059,.269);
  line3(head,[[s*.12-.078,.037,.284],[s*.12,.045,.291],[s*.12+.078,.032,.282]],ink,.009);line3(head,[[s*.12-.07,.131,.24],[s*.12,.145,.25],[s*.12+.065,.131,.242]],hair,.009);
  const hoop=mesh(new THREE.TorusGeometry(.055,.009,6,16),gold,head,s*.28,-.17,.03);hoop.scale.y=1.35;}
 ball(head,.040,.060,.059,skin,0,-.075,.274);const mouth=line3(head,[[-.065,-.196,.235],[0,-.214,.253],[.065,-.191,.232]],ink,.009);ball(head,.027,.01,.009,skin,0,-.245,.227);
 root.userData={body,head,arms,legs,mouth};return enhanceHeroModel(root,'mariah');
}

function makeJonesOrEmma(emma=false){
 const root=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group(),arms=[],legs=[];root.name=emma?'Emma Richards':'Gareth Jones';root.add(body);body.add(head);head.position.y=emma?2.04:2.08;
 const skin=mat(0xe9bd89),jacket=mat(0x191112),trousers=mat(emma?0x38383b:0x111214),hair=mat(emma?0x777678:0x999a98),ink=mat(0x17181d),shirt=mat(emma?0x711e27:0xe5e0d8),red=mat(0xc22229),shoe=mat(emma?0x4e4e52:0x151011);
 ball(body,emma?.285:.32,.45,.205,jacket,0,1.2,0);box(body,.45,.18,.33,trousers,0,.89,0);
 ball(body,emma?.235:.13,.31,.045,shirt,0,1.30,.20);box(body,emma?.32:.17,.30,.035,shirt,0,1.08,.21);
 for(const s of [-1,1]){const lapel=box(body,.09,.40,.045,jacket,s*.18,1.36,.228);lapel.rotation.z=s*.2;}
 if(!emma){const tie=box(body,.066,.43,.04,red,0,1.27,.25);tie.rotation.z=-.045;box(body,.08,.065,.045,red,0,1.52,.253);const tip=mesh(new THREE.ConeGeometry(.05,.1,3),red,body,-.01,1.01,.25);tip.rotation.z=Math.PI;}
 else{const neckline=mesh(new THREE.ConeGeometry(.1,.20,3),skin,body,0,1.58,.235);neckline.rotation.z=Math.PI;}
 for(const s of [-1,1]){const arm=new THREE.Group();body.add(arm);arm.position.set(s*.31,1.47,0);ball(arm,.105,.32,.12,jacket,0,-.28,0);box(arm,.165,.065,.18,emma?jacket:shirt,0,-.58,0);ball(arm,.083,.12,.08,emma?shirt:skin,0,-.69,.015);arms.push(arm);
 const leg=new THREE.Group();root.add(leg);leg.position.set(s*.14,.82,0);box(leg,.235,.7,.26,trousers,0,-.33,0);line3(leg,[[0,-.06,.136],[0,-.63,.136]],emma?ink:trousers,.005);ball(leg,.145,.10,.23,shoe,0,-.73,.07);legs.push(leg);}
 ball(head,.10,.16,.10,skin,0,-.34,0);ball(head,.30,.37,.27,skin,0,0,0);ball(head,.25,.19,.24,skin,0,-.20,.025);
 if(emma){ball(head,.30,.40,.21,hair,0,.015,-.16);for(const s of [-1,1])for(let i=0;i<6;i++){const lock=ball(head,.115,.16,.12,hair,s*(.27+.025*Math.sin(i*2)),.22-i*.17,-.10);lock.rotation.z=s*.18;}for(const [x,y] of [[-.22,.28],[-.09,.34],[.05,.35],[.18,.28]]){const wave=ball(head,.14,.13,.14,hair,x,y,.01);wave.rotation.z=-x;}ball(head,.13,.25,.11,hair,.27,-.64,-.07);}
 else{const scalp=mesh(new THREE.SphereGeometry(1,24,14,0,TAU,0,1.43),hair,head,0,.025,-.025);scalp.scale.set(.31,.36,.27);const fringe=ball(head,.21,.065,.075,hair,-.08,.27,.20);fringe.rotation.z=.24;for(const s of [-1,1])box(head,.05,.20,.08,hair,s*.285,.035,-.045);}
 for(const s of [-1,1]){ball(head,.065,.09,.052,skin,s*.30,-.055,0);ball(head,.099,.062,.025,white,s*.125,.035,.253);ball(head,.031,.034,.015,ink,s*.125-.017,.024,.276);ball(head,.101,.03,.025,skin,s*.125,.086,.263);
 const brow=box(head,.16,.026,.025,emma?hair:ink,s*.125,.146,.24);brow.rotation.z=s*.055;
 const rim=new THREE.Group();head.add(rim);rim.position.set(s*.128,.045,.291);const points=[];for(let j=0;j<=24;j++){const a=j/24*TAU;points.push([Math.cos(a)*.112,Math.sin(a)*.081,0]);}line3(rim,points,ink,.012);line3(head,[[s*.239,.064,.29],[s*.305,.075,.015]],ink,.009);}
 line3(head,[[-.018,.052,.299],[.018,.052,.299]],ink,.009);ball(head,.045,.07,.065,skin,-.012,-.067,.271);
 if(emma){const mouth=line3(head,[[-.073,-.19,.235],[0,-.213,.258],[.064,-.187,.24]],mat(0x9a3035),.018);box(head,.075,.015,.013,white,0,-.196,.269);root.userData.mouth=mouth;}
 else{root.userData.mouth=line3(head,[[-.10,-.202,.236],[0,-.20,.264],[.078,-.214,.239]],ink,.008);for(let i=0;i<38;i++){const a=i*2.399,rad=.055+((i*7)%19)/19*.16,x=Math.cos(a)*rad,y=-.20+Math.sin(a)*rad*.62;if(y>-.18&&Math.abs(x)<.075)continue;ball(head,.006,.006,.006,ink,x,y,.255-Math.abs(x)*.23);}}
 Object.assign(root.userData,{body,head,arms,legs});return enhanceHeroModel(root,emma?'emma':'jones');
}

function makeRevealedKevin(){
 const root=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group(),arms=[],legs=[];root.name='Kevin / revealed appearance';root.add(body);body.add(head);head.position.y=2.06;
 const blackCloth=mat(0x111216),seams=mat(0x25262c),hair=mat(0x171311),skin=mat(0xeee4d8),mask=mat(0x070a0d),whiteEye=mat(0xf7f3e7),iris=mat(0x705342);
 ball(body,.32,.46,.215,blackCloth,0,1.2,0);box(body,.50,.22,.34,blackCloth,0,.91,0);
 line3(body,[[0,1.6,.205],[0,1.2,.226],[0,.92,.181]],seams,.008);
 for(const s of [-1,1]){const arm=new THREE.Group();body.add(arm);arm.position.set(s*.32,1.47,0);ball(arm,.12,.34,.13,blackCloth,0,-.29,0);box(arm,.18,.065,.18,seams,0,-.57,0);ball(arm,.083,.12,.083,mask,0,-.68,.01);arms.push(arm);
 const leg=new THREE.Group();root.add(leg);leg.position.set(s*.145,.82,0);box(leg,.235,.7,.26,blackCloth,0,-.33,0);ball(leg,.145,.10,.23,mask,0,-.73,.075);legs.push(leg);}
 // Long black waves sit behind the pale, angular cartoon face.
 ball(head,.33,.40,.27,hair,0,.035,-.075);ball(head,.295,.35,.25,skin,0,-.015,.025);
 for(const s of [-1,1]){for(let i=0;i<5;i++){const lock=ball(head,.10+(i%2)*.025,.17,.13,hair,s*(.265+.014*Math.sin(i)),.21-i*.19,-.065);lock.rotation.z=s*(.12+(i%2)*.1);}
 ball(head,.11,.25,.14,hair,s*.255,-.54,-.13);ball(head,.065,.085,.045,skin,s*.29,-.075,.045);
 ball(head,.095,.048,.024,whiteEye,s*.12,.015,.267);ball(head,.028,.03,.014,iris,s*.12,.008,.286);ball(head,.012,.024,.01,mask,s*.12,.008,.299);
 line3(head,[[s*.12-.085,.027,.29],[s*.12,.055,.29],[s*.12+.08,.025,.285]],mask,.01);
 const brow=box(head,.17,.027,.023,hair,s*.12,.117,.258);brow.rotation.z=-s*.16;}
 for(const [x,y,z,tilt] of [[-.2,.25,.09,-.5],[-.12,.33,.06,-.35],[.015,.34,.015,.05],[.15,.29,.065,.38],[.23,.18,.04,.35]]){const wave=ball(head,.13,.14,.18,hair,x,y,z);wave.rotation.z=tilt;}
 ball(head,.043,.067,.05,skin,0,-.055,.273);
 // Soft black face covering, rather than his earlier metal armour mask.
 ball(head,.225,.135,.058,mask,0,-.175,.254);box(head,.37,.13,.055,mask,0,-.155,.28);
 for(const s of [-1,1])line3(head,[[s*.18,-.13,.27],[s*.30,-.065,.066],[s*.19,-.235,.245]],seams,.012);
 root.userData={body,head,arms,legs};return enhanceHeroModel(root,'kevinRevealed');
}

function makeKevinMurderhorn(){
 const root=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group(),arms=[],legs=[];root.name='BC-07';root.add(body);body.add(head);head.position.y=2.08;
 const cloth=mat(0x24232b),shadow=mat(0x0c0d13),plate=mat(0x48494e,.55),edge=mat(0x797b7b,.6),leather=mat(0x39302c),gunmetal=mat(0x20252b,.6);
 // Broad stylised silhouette, segmented armour and a hood framing an oversized mask.
 ball(body,.37,.45,.23,shadow,0,1.23,0);box(body,.54,.23,.36,plate,0,.9,0);
 for(const s of [-1,1]){const chest=ball(body,.185,.28,.065,plate,s*.17,1.36,.22);chest.rotation.z=s*.12;line3(body,[[s*.04,1.56,.265],[s*.25,1.36,.285],[s*.28,1.11,.23]],edge,.016);}
 for(let i=0;i<4;i++)box(body,.36-i*.025,.065,.08,plate,0,1.1-i*.075,.255);
 box(body,.65,.085,.4,leather,0,.89,.03);ball(body,.075,.055,.025,edge,0,.89,.255);
 const cape=new THREE.Group();body.add(cape);cape.name='Long hooded cloak';
 const geo=new THREE.BufferGeometry(),v=[];for(let i=0;i<12;i++){const a=i/12*Math.PI,b=(i+1)/12*Math.PI;const p=t=>[Math.cos(t)*.45,1.67,-Math.sin(t)*.28-.06],q=t=>[Math.cos(t)*.68,.05,-Math.sin(t)*.43-.07];v.push(...p(a),...q(a),...q(b),...p(a),...q(b),...p(b));}geo.setAttribute('position',new THREE.Float32BufferAttribute(v,3));geo.computeVertexNormals();const capeMat=cloth.clone();capeMat.side=THREE.DoubleSide;cape.add(new THREE.Mesh(geo,capeMat));
 for(const s of [-1,1]){const arm=new THREE.Group();body.add(arm);arm.position.set(s*.40,1.49,0);ball(arm,.16,.18,.18,plate,0,-.035,0);ball(arm,.12,.3,.13,cloth,0,-.29,0);for(let i=0;i<3;i++)box(arm,.24,.075,.27,plate,0,-.18-i*.13,0);box(arm,.23,.19,.28,leather,0,-.52,0);ball(arm,.095,.12,.095,shadow,0,-.69,0);arm.rotation.z=s*.23;arms.push(arm);
  for(const x of [-.09,.09])ball(arm,.025,.025,.022,edge,x,-.055,.16);
  const pistol=new THREE.Group();arm.add(pistol);pistol.position.set(0,-.7,.08);pistol.rotation.x=.55;pistol.name='Twin pistol';box(pistol,.10,.13,.48,gunmetal,0,.025,.12);box(pistol,.085,.17,.11,leather,0,-.10,-.06);box(pistol,.08,.04,.37,edge,0,.105,.13);ball(pistol,.043,.043,.018,shadow,0,.025,.365);
  const leg=new THREE.Group();root.add(leg);leg.position.set(s*.17,.82,0);box(leg,.26,.65,.29,shadow,0,-.32,0);ball(leg,.15,.14,.065,plate,0,-.34,.16);box(leg,.23,.26,.095,leather,0,-.56,.15);ball(leg,.16,.11,.24,shadow,0,-.73,.07);legs.push(leg);
  const skirt=box(body,.28,.39,.085,plate,s*.28,.68,.24);skirt.rotation.z=s*.16;
 }
 ball(head,.365,.425,.31,cloth,0,.035,-.035);ball(head,.295,.345,.08,shadow,0,-.005,.235);ball(head,.255,.305,.065,plate,0,-.02,.294);
 for(const s of [-1,1]){const brow=box(head,.20,.045,.045,edge,s*.115,.11,.351);brow.rotation.z=s*.20;const eye=box(head,.16,.045,.025,shadow,s*.115,.058,.36);eye.rotation.z=s*.08;line3(head,[[s*.22,-.015,.345],[s*.12,-.10,.36],[s*.105,-.22,.329]],edge,.016);}
 const nose=mesh(new THREE.ConeGeometry(.065,.18,4),edge,head,0,-.035,.372);nose.rotation.x=.12;
 box(head,.155,.029,.035,shadow,0,-.17,.36);line3(head,[[-.09,-.205,.34],[0,-.27,.32],[.09,-.205,.34]],edge,.014);
 line3(head,[[-.30,-.20,.27],[-.32,.16,.26],[-.17,.38,.24],[0,.43,.21],[.17,.38,.24],[.32,.16,.26],[.30,-.20,.27]],leather,.032);
 root.userData={body,head,arms,legs};return enhanceHeroModel(root,'kevinMasked');
}

function makeElizabethSterling(){
 const root=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group();root.add(body);body.add(head);head.position.y=2.13;
 const coat=mat(0x79192b),trim=mat(0x121015),skin=mat(0xd2a284),silver=mat(0x92978f),copper=mat(0x985329),lens=new THREE.MeshStandardMaterial({color:0xa1c1c9,transparent:true,opacity:.22});
 ball(body,.31,.43,.2,coat,0,1.25,0);const skirt=mesh(new THREE.CylinderGeometry(.28,.48,1.02,12),coat,body,0,.68,0);skirt.scale.z=.66;
 box(body,.18,.42,.04,trim,0,1.4,.20);for(const s of [-1,1]){const lapel=box(body,.12,.38,.06,trim,s*.15,1.47,.21);lapel.rotation.z=s*.3;}
 for(let i=0;i<4;i++)ball(body,.026,.026,.02,trim,.045,1.18-i*.19,.245);
 ball(head,.29,.37,.26,skin);ball(head,.09,.14,.09,skin,0,-.35,0);ball(head,.31,.3,.27,silver,0,.19,-.05);
 for(const s of [-1,1]){ball(head,.12,.46,.15,silver,s*.26,-.1,-.025);ball(head,.12,.32,.13,copper,s*.265,-.55,.015);ball(head,.08,.23,.09,copper,s*.24,-.81,.065);
 ball(head,.072,.042,.027,white,s*.115,.005,.239);ball(head,.023,.028,.012,trim,s*.115,0,.265);
 box(head,.19,.12,.024,lens,s*.12,.01,.28);line3(head,[[s*.12-.1,.075,.294],[s*.12+.1,.075,.294],[s*.12+.09,-.055,.294],[s*.12-.09,-.055,.294],[s*.12-.1,.075,.294]],trim,.012);line3(head,[[s*.22,.04,.28],[s*.29,.06,.04]],trim,.012);}
 line3(head,[[-.025,.025,.29],[.025,.025,.29]],trim,.012);ball(head,.04,.07,.05,skin,0,-.07,.255);const mouth=line3(head,[[-.075,-.19,.23],[0,-.20,.255],[.075,-.18,.23]],mat(0x6d2840),.014);
 const arms=[],legs=[];for(const s of [-1,1]){const arm=new THREE.Group();body.add(arm);arm.position.set(s*.34,1.48,0);ball(arm,.11,.32,.12,coat,0,-.28,0);ball(arm,.125,.12,.13,trim,0,-.53,0);ball(arm,.075,.115,.075,skin,0,-.68,.01);arms.push(arm);const leg=new THREE.Group();root.add(leg);leg.position.set(s*.14,.82,0);box(leg,.17,.68,.19,trim,0,-.35,0);ball(leg,.12,.08,.18,trim,0,-.74,.06);legs.push(leg);}
 root.userData={body,head,arms,legs,mouth};root.name='Elizabeth Sterling';return enhanceHeroModel(root,'sterling');
}
function makeParliamentExterior(){
 const root=new THREE.Group(),stone=mat(0x9a8462),dark=mat(0x1c2934),roof=mat(0x30343d);
 box(root,80,.3,60,mat(0x414341),0,-.2,10);box(root,46,8,9,stone,0,4,-4);box(root,46,.5,10,roof,0,8,-4);
 for(let x=-22;x<=22;x+=2){box(root,.18,10,.4,stone,x,5,.7);for(const y of [2,4.6,6.8])box(root,.85,1.55,.08,dark,x+.7,y,.55);mesh(new THREE.ConeGeometry(.3,1.8,4),stone,root,x,10.3,.7);}
 for(const x of [-22,19]){const height=x<0?18:27;box(root,4,height,4,stone,x,height/2,-2);box(root,4.5,.6,4.5,stone,x,height-3,-2);mesh(new THREE.ConeGeometry(3,6,4),roof,root,x,height+2,-2);for(const s of [-1,1])mesh(new THREE.ConeGeometry(.4,3,4),stone,root,x+s*2,height+1,0);if(x>0){const clockFace=mesh(new THREE.CircleGeometry(1.35,32),mat(0xf0dfae),root,x,height-3,.03);line3(root,[[x,height-1.9,.08],[x,height-3,.08],[x+.8,height-3.3,.08]],dark,.055);}}
 return root;
}
function makeCommonsChamber(){
 const room=new THREE.Group(),oak=mat(0x684a2c),panel=mat(0x9a753f),green=mat(0x146b49,.5),carpet=mat(0x777b51),gold=mat(0xc5a55b,.4);
  box(room,19,.2,31,carpet,0,-.14,0);box(room,19,11,.3,oak,0,5.4,-15);
  // Close the chamber on every side so the exterior sky never shows through a shot.
  box(room,19,11,.3,oak,0,5.4,15);box(room,19,.35,31,oak,0,11.05,0);
 for(const side of [-1,1]){box(room,.3,11,31,oak,side*9.5,5.4,0);for(let z=-14;z<=14;z+=2){box(room,.12,3.2,1.65,panel,side*9.3,1.8,z);box(room,.12,2.3,1.6,panel,side*9.3,6,z);box(room,.16,1.8,1.05,mat(0xb4b9a3),side*9.28,9,z);box(room,.3,11,.16,gold,side*9.2,5.4,z-1);}
 box(room,2,.22,31,oak,side*8.6,4.1,0);for(let z=-14;z<=14;z+=.6)box(room,.12,.8,.07,gold,side*7.65,4.65,z);box(room,.12,.1,31,gold,side*7.65,5.05,0);
 for(let row=0;row<4;row++){const x=side*(3+row*1.5),y=row*.24;box(room,1.4,.24,24,oak,x,y+.1,0);box(room,1,.24,23,green,x,y+.55,0);box(room,.2,.8,23,green,x+side*.55,y+.96,0);for(const z of [-11.8,11.8])box(room,1.35,.85,.16,oak,x,y+.65,z);}
 box(room,.08,.01,28,mat(0x852c32),side*1.6,.001,0);}
 for(let x=-8;x<=8;x+=2){box(room,1.7,3,.12,panel,x,1.8,-14.8);box(room,1.7,2.4,.12,panel,x,6,-14.8);}
 box(room,2.6,4,.6,oak,0,2,-13.8);box(room,1.2,1.4,.25,green,0,1.5,-13.35);box(room,3,1,2,oak,0,.5,-6);box(room,3.3,.15,2.2,panel,0,1.07,-6);box(room,1.6,.06,.16,gold,0,1.2,-5.5);for(const x of [-.95,.95])box(room,.55,.4,.6,oak,x,1.32,-6);
 for(let z=-12;z<15;z+=5){box(room,19,.2,.2,oak,0,10.5,z);box(room,.035,3,.035,gold,0,9,z);box(room,.7,1,.7,new THREE.MeshBasicMaterial({color:0xffedbf}),0,7.25,z);const light=new THREE.PointLight(0xffdea4,35,20,1.5);light.position.set(0,6,z);room.add(light);}
 return room;
}
function clearCivilScene(){stopCommonsVoice();clearCommonsMouths(civilScene);if(!civilScene)return;for(const root of [civilScene.exterior,civilScene.room,civilScene.elizabeth,civilScene.wounds]){root.parent?.remove(root);root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});}civilScene=null;$('civilOverlay').hidden=true;subject.userData.body.rotation.set(0,0,0);subject.userData.head.rotation.set(0,0,0);resetHunterMotion(subject);resetHunterMotion(peter);}
function startCivilDisobedience(){if(!chapterLoadingBypass)return loadChapterScreen('CIVIL DISOBEDIENCE',()=>startCivilDisobedience());
 if(!canOpenCivil())return;
 clearCarChase();clearBossBattle();clearCivilScene();prepareCommonsLipAudio();setMode('civil');document.exitPointerLock?.();keys.clear();world.visible=upperWorld.visible=exhibit.visible=false;for(const a of [subject,peter,alissa,gareth,stephen])a.visible=false;
 const exterior=new THREE.Group(),room=makeCommonsChamber(),elizabeth=makeElizabethSterling(),wounds=new THREE.Group();scene.add(exterior,room,elizabeth);subject.userData.body.add(wounds);
 for(let i=0;i<7;i++)ball(wounds,.04,.065,.015,mat(0x641322),-.15+Math.sin(i)*.12,1.1+i*.07,.23);
 civilScene={exterior,room,elizabeth,wounds,time:0,line:0,lineTime:0};room.visible=elizabeth.visible=false;for(const a of [subject,peter]){resetHunterMotion(a);a.scale.setScalar(1);a.rotation.set(0,0,0);}subject.position.set(-.8,0,-8);peter.position.set(1,0,-8.4);elizabeth.position.set(0,0,-2);elizabeth.rotation.y=Math.PI;
 ambient.intensity=.8;scene.fog.density=.005;flash.visible=false;$('civilOverlay').hidden=false;$('civilCaption').textContent='CIVIL DISOBEDIENCE / PALACE OF WESTMINSTER';gameProgress.civilDisobedienceStarted=true;saveProgress();renderCivilScene(0);
}
function finishCivilScene(){if(mode!=='civil'||!civilScene)return;gameProgress.civilDisobedienceCompleted=true;saveProgress();startParliamentCamp();}
function renderCivilScene(dt){const c=civilScene;if(!c)return;c.time+=dt;c.lineTime+=dt;const t=c.time;
 if(c.voiceLine!==c.line)startCommonsVoice(c);const clip=commonsClipAt(c.line),duration=commonsVoiceDuration(c);if((clip.ended&&c.lineTime>.2)||((c.voiceFailed||clip.error)&&c.lineTime>=duration)||c.lineTime>=duration+8){if(c.line===commonsDialogue.length-1){finishCivilScene();return;}c.line++;c.lineTime=0;startCommonsVoice(c);}
 c.exterior.visible=false;c.room.visible=c.elizabeth.visible=subject.visible=peter.visible=true;scene.fog.density=.008;
 animateCharacter(t,false,false,peter);animateCharacter(t,false,false,c.elizabeth);
 subject.userData.body.rotation.z=.13;subject.userData.body.rotation.x=.16;subject.userData.body.position.y=-.07+Math.sin(t*2)*.012;subject.userData.head.rotation.x=.13;subject.userData.arms[0].rotation.x=-.7;subject.userData.arms[0].rotation.z=-.65;
 const [speaker,line]=commonsLineAt(c.line);updateCommonsMouths(c,speaker,dt);$('civilCaption').textContent='CIVIL DISOBEDIENCE / HOUSE OF COMMONS';$('civilSpeaker').textContent=speaker;$('civilDialogue').textContent=line;$('civilProgress').style.width=Math.min(100,(c.voiceFailed?c.lineTime:commonsClipAt(c.line).currentTime)/commonsVoiceDuration(c)*100)+'%';
 const actor=speaker==='ELIZABETH STERLING'?c.elizabeth:speaker==='PETER CHAMBERS'?peter:subject;actor.userData.head.rotation.y=Math.sin(t*1.6)*.025;
 if(actor===c.elizabeth){camera.position.set(2.2,2.1,-5.3);camera.lookAt(0,1.7,-2);c.elizabeth.userData.arms[0].rotation.x=-.3-Math.sin(t*2)*.1;}
 else{camera.position.set(actor.position.x-2,2.2,-4.2);camera.lookAt(actor.position.x,1.65,-8);if(actor===peter)peter.userData.arms[1].rotation.x=-.35;}
}

function makeHospitalNurse(){
 const a=makeJonesOrEmma(true);a.name='Hospital nurse';const seen=new Set();a.traverse(o=>{if(o.material&&!seen.has(o.material)){seen.add(o.material);const hex=o.material.color?.getHex();if(hex===0x777678)o.material.color.setHex(0x3d2c25);if(hex===0x711e27)o.material.color.setHex(0x23272a);if(hex===0xe9bd89)o.material.color.setHex(0xd6ae8c);} });
 a.userData.head.traverse(o=>{if(o.geometry?.type==='TubeGeometry')o.visible=false;if(o.material?.color?.getHex()===0x3d2c25&&o.position.y<-.1)o.visible=false;});ball(a.userData.head,.16,.15,.13,mat(0x3d2c25),0,-.02,-.30);a.userData.mouth=line3(a.userData.head,[[-.07,-.2,.25],[0,-.215,.268],[.07,-.2,.25]],mat(0x6c3e39),.01);
 const body=a.userData.body,strap=mat(0x44494b);line3(body,[[-.13,1.58,.24],[-.08,1.08,.255],[.08,1.08,.255],[.13,1.58,.24]],strap,.017);box(body,.13,.17,.025,mat(0xd8dddb),.08,1.05,.27);ball(body,.045,.045,.02,mat(0x797d7b),.22,1.33,.22);return a;
}
function setSternJosiah(actor,show){const u=actor.userData;if(!u.sternMouth){u.sternMouth=line3(u.head,[[-.13,-.24,.30],[0,-.235,.329],[.13,-.245,.302]],black,.014);u.sternMouth.visible=false;}u.mouth.visible=!show;if(u.smileCrease)u.smileCrease.visible=!show;u.sternMouth.visible=show;}
function makeSovereignEffects(parent,x,z){
 const root=new THREE.Group();parent.add(root);root.position.set(x,0,z);const gold=new THREE.MeshStandardMaterial({color:0xffd36b,metalness:.8,roughness:.25,emissive:0xd88b13,emissiveIntensity:1.3}),chains=[];
 for(let strand=0;strand<4;strand++){const chain=new THREE.Group();root.add(chain);for(let i=0;i<28;i++){const t=i/27,a=t*TAU+strand*Math.PI/2,link=mesh(new THREE.TorusGeometry(.085,.018,5,10),gold,chain,Math.cos(a)*(.6+t*.8),.3+t*2.6,Math.sin(a)*(.6+t*.8));link.rotation.set(t*3,strand+i%2*Math.PI/2,a);link.scale.y=1.45;}chains.push(chain);}
 const rings=[];for(let i=0;i<3;i++){const m=new THREE.MeshBasicMaterial({color:i===1?0xd6edff:0xffd46e,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide});const ring=mesh(new THREE.TorusGeometry(1,.035,6,64),m,root,0,.9+i*.25,0);ring.rotation.x=Math.PI/2;rings.push(ring);}
 const glow=new THREE.PointLight(0xffc65c,0,18,1.5);glow.position.y=2;root.add(glow);return {root,chains,rings,glow};
}
function animateSovereignEffects(e,t,chains=true){e.chains.forEach((a,i)=>{a.visible=chains;a.rotation.y=t*(i%2?-.45:.45);a.scale.setScalar(Math.min(1,t*1.3));});const burst=Math.max(0,t-1.1);e.rings.forEach((r,i)=>{const life=Math.max(0,burst-i*.16);r.scale.setScalar(.1+life*7);r.material.opacity=life>0?Math.max(0,.8-life*.5):0;});e.glow.intensity=t<1.1?t*17:Math.max(0,28-burst*14);}
const kevinAftermathClips=["assets/audio/clip-a3b6a0d82d09.mp3","assets/audio/clip-c66258bc5830.mp3"].map(src=>{const a=new Audio(src);a.preload='auto';return a;});
function stopKevinAftermathVoice(){kevinAftermathClips.forEach(a=>{a.pause();a.currentTime=0;});}
function tickKevinAftermathVoice(c,dt){if(c.afterTime<7)return;const index=c.afterVoiceIndex??0;if(c.afterVoiceIndex===undefined){c.afterVoiceIndex=0;c.afterVoiceElapsed=0;c.afterVoiceFailed=false;const clip=kevinAftermathClips[0];clip.muted=muted;try{clip.play()?.catch(()=>{if(corneredIntro===c)c.afterVoiceFailed=true;});}catch(e){c.afterVoiceFailed=true;}}
 else c.afterVoiceElapsed+=dt;const clip=kevinAftermathClips[c.afterVoiceIndex];clip.muted=muted;const duration=Number.isFinite(clip.duration)&&clip.duration>0?clip.duration:(c.afterVoiceIndex===0?12:8);const done=c.afterVoiceFailed?c.afterVoiceElapsed>=duration:clip.ended||c.afterVoiceElapsed>duration+8;if(!done)return;if(c.afterVoiceIndex===1){finishCorneredIntro();return;}clip.pause();clip.currentTime=0;c.afterVoiceIndex=1;c.afterVoiceElapsed=0;c.afterVoiceFailed=false;const next=kevinAftermathClips[1];next.muted=muted;try{next.play()?.catch(()=>{if(corneredIntro===c)c.afterVoiceFailed=true;});}catch(e){c.afterVoiceFailed=true;}}
function startSovereignAftermath(){stopKevinAftermathVoice();const c=corneredIntro;stopCorneredVoice();c.aftermath=true;c.afterTime=0;c.afterRoom='hospital';c.effects=makeSovereignEffects(c.root,0,1.2);$('corneredSpeaker').textContent='UNION CROWN';$('corneredLine').textContent='';}
function buildKevinAftermathRoom(){const c=corneredIntro;disposeCampObject(c.root);const r=new THREE.Group();scene.add(r);c.root=r;c.afterRoom='kevin';const wall=mat(0x34343d),iron=mat(0x1b212a),stone=mat(0x62606b);box(r,14,.3,14,mat(0x25232c),0,-.18,0);box(r,14,6,.3,wall,0,3,-5);for(const s of [-1,1]){box(r,.3,6,14,wall,s*7,3,0);box(r,2,2,.08,iron,s*4,3,-4.8);for(let x=-.8;x<=.8;x+=.4)box(r,.04,2,.07,stone,s*4+x,3,-4.7);}box(r,1.5,3,.12,iron,0,1.5,-4.8);for(let y=.3;y<5.9;y+=.5)box(r,14,.025,.025,stone,0,y,-4.8);
 const light=new THREE.PointLight(0x9aaacc,25,17,1.5);light.position.set(0,4,1);r.add(light);const cast={kevin:makeRevealedKevin(),gareth:makeGareth(),alissa:makeAlissa()};if(gameProgress.stephenRescued===true&&!stephenIsDeceased())cast.stephen=makeStephen();for(const a of Object.values(cast))r.add(a);cast.kevin.position.set(0,0,-2.7);cast.gareth.position.set(-2.2,0,1.3);cast.gareth.rotation.y=Math.PI;cast.alissa.position.set(2,0,1);cast.alissa.rotation.y=Math.PI;if(cast.stephen){cast.stephen.position.set(-.2,0,2.4);cast.stephen.rotation.y=Math.PI;}c.cast=cast;c.effects=makeSovereignEffects(r,0,-2.7);c.effects.chains.forEach(a=>a.visible=false);ambient.intensity=.45;scene.fog.density=.02;
}
function renderSovereignAftermath(dt){const c=corneredIntro;c.afterTime+=dt;let t=c.afterTime;if(t>=4&&c.afterRoom==='hospital')buildKevinAftermathRoom();if(c.afterRoom==='hospital'){const j=c.cast.josiah;animateCharacter(t,false,false,j);setSternJosiah(j,true);j.userData.arms[1].rotation.x=-2.95;j.userData.arms[1].rotation.z=-.16;animateSovereignEffects(c.effects,t);camera.position.set(1.2,2.2,5.2);camera.lookAt(0,1.8,1.2);if(t>1.1&&t<2.8){camera.position.x+=Math.sin(t*63)*.055;camera.position.y+=Math.sin(t*47)*.04;}}
 else{t-=4;animateSovereignEffects(c.effects,t,false);for(const [name,a] of Object.entries(c.cast)){animateCharacter(t,false,false,a);if(name!=='kevin'&&t<3){a.userData.body.rotation.x=-.2*Math.sin(Math.min(1,t/1.1)*Math.PI/2);a.userData.arms[0].rotation.x=-1;}}const k=c.cast.kevin;if(t>3){k.userData.head.rotation.x=-.13;k.userData.arms[0].rotation.z=.45;k.userData.arms[1].rotation.z=-.45;}const pan=Math.min(1,t/2);camera.position.set(3.6*(1-pan)+.45*pan,2.1-.15*pan,4.8-3.8*pan);camera.lookAt(0,1.65,-2.7);if(t>1.1&&t<2.8){camera.position.x+=Math.sin(t*59)*.055;camera.position.y+=Math.sin(t*41)*.045;}$('corneredSpeaker').textContent=t<3?'UNION CROWN':'KEVIN MURDERHORN';$('corneredLine').textContent=t<3?'':(c.afterVoiceIndex??0)===0?'Mwahahaha! You fools! You wasted your time cornering me while the Prime Secretary recovered. Did you feel that? His power has returned—and now you’re trapped here with me.':'One hundred rooms. I’ll be hunting you through every one. Let’s see if you can reach the last door alive.';}
 tickKevinAftermathVoice(c,dt);const clip=kevinAftermathClips[c.afterVoiceIndex??0],duration=Number.isFinite(clip.duration)&&clip.duration>0?clip.duration:10;$('corneredProgress').style.width=(c.afterTime<7?c.afterTime/7*20:20+((c.afterVoiceIndex??0)+Math.min(1,(c.afterVoiceElapsed||0)/duration))*40)+'%';camera.updateMatrixWorld(true);
}

function startCorneredHospital(){stopCorneredVoice();
 const c=corneredIntro;disposeCampObject(c.root);c.root=new THREE.Group();scene.add(c.root);c.hospital=true;c.time=0;c.index=-1;c.lipMouths=null;
 const r=c.root,wall=mat(0x687579),floor=mat(0x303d44),metal=mat(0x6d7c83),linen=mat(0xe1dfd6);box(r,14,.25,16,floor,0,-.17,0);box(r,14,5,.3,wall,0,2.5,-6);for(const s of [-1,1])box(r,.3,5,16,wall,s*7,2.5,0);
 for(const s of [-1,1]){box(r,2.8,2,.1,mat(0x111e32),s*4,3,-5.78);for(const dx of [-1.4,0,1.4])box(r,.055,2,.05,linen,s*4+dx,3,-5.7);box(r,2.8,.055,.05,linen,s*4,3,-5.7);}
 box(r,2.1,.3,3.8,metal,0,.65,-1);box(r,1.95,.22,3.6,linen,0,.91,-1);box(r,1.5,.22,.65,linen,0,1.1,-2.35);for(const x of [-.95,.95])for(const z of [-2.7,.7])box(r,.07,.65,.07,metal,x,.33,z);
 box(r,1.1,.1,.8,metal,-2.3,1.05,-1);for(const x of [-2.75,-1.85])box(r,.06,1,.06,metal,x,.5,-1);box(r,.8,.55,.14,mat(0x18262b),2.2,1.9,-2);box(r,.66,.39,.025,new THREE.MeshBasicMaterial({color:0x17483f}),2.2,1.9,-1.91);line3(r,[[1.94,1.9,-1.88],[2.1,1.9,-1.88],[2.15,2.02,-1.88],[2.2,1.79,-1.88],[2.25,1.9,-1.88],[2.45,1.9,-1.88]],new THREE.MeshBasicMaterial({color:0x80e3b7}),.012);box(r,.055,1.7,.055,metal,2.2,.85,-2);
 const light=new THREE.PointLight(0xc9e8f4,40,18,1.6);light.position.set(0,4,1);r.add(light);ambient.intensity=.7;scene.fog.density=.016;
 const josiah=makeCharacter(),nurse=makeHospitalNurse();r.add(josiah,nurse);josiah.position.set(0,0,1.2);nurse.position.set(-1.25,0,1.7);nurse.rotation.y=.85;setSternJosiah(josiah,true);
 const wrap=new THREE.Group();josiah.userData.body.add(wrap);ball(wrap,.25,.12,.13,linen,-.09,1.18,.32);line3(wrap,[[.18,1.71,.13],[-.30,1.05,.31],[.17,1.1,.37],[.18,1.71,.13]],linen,.028);josiah.userData.arms[0].visible=false;
 c.cast={josiah,nurse};c.wrap=wrap;c.lines=[['NURSE','Hold still, Prime Secretary. I’m removing the sling first.','nurse'],['NURSE','The cast can come off now. Your treatment is complete. Try moving your arm.','nurse'],['JOSIAH RICHARDS','They thought a wound would bring me to my knees.','josiah'],['NURSE','Your injuries have healed. You should still take time to rest.','nurse'],['JOSIAH RICHARDS','Rest? They have mistaken restraint for weakness.','josiah'],['JOSIAH RICHARDS','I am SOVEREIGN.','josiah'],['JOSIAH RICHARDS','Let the wretches cower before me.','josiah']];$('corneredOverlay').hidden=false;renderCorneredIntro(0);
}
function updateHospitalLips(c,dt){
 if(!c.hospitalMouths)c.hospitalMouths=['nurse','josiah'].map(name=>{const actor=c.cast[name],m=ball(actor.userData.head,name==='josiah'?.083:.063,.006,.008,new THREE.MeshBasicMaterial({color:0x291016}),name==='josiah'?.015:0,name==='josiah'?-.24:-.207,name==='josiah'?.338:.277);m.visible=false;return {actor,name,m,level:0};});
 const clip=currentCorneredClip(c),speaker=c.lines[c.index][2];let level=0;if(clip&&!clip.paused&&!clip.ended&&!c.voiceFailed){if(corneredAnalyser){corneredAnalyser.getByteTimeDomainData(corneredSamples);let sum=0;for(const v of corneredSamples)sum+=((v-128)/128)**2;level=Math.min(1,Math.sqrt(sum/corneredSamples.length)*8);}else level=.18+Math.abs(Math.sin(clip.currentTime*15))*.4;}
 for(const e of c.hospitalMouths){const target=e.name===speaker?level:0;e.level+=(target-e.level)*Math.min(1,dt*22);const open=target>.02&&e.level>.015;e.m.visible=open;e.m.scale.y=.006+e.level*.035;const closed=e.name==='josiah'?e.actor.userData.sternMouth:e.actor.userData.mouth;if(closed)closed.visible=!open;if(e.name==='josiah')e.actor.userData.mouth.visible=false;}
}

function renderCorneredHospital(dt){const c=corneredIntro;c.time+=dt;if(!tickCorneredVoice(c,dt))return;const index=c.index,line=c.lines[index],j=c.cast.josiah,n=c.cast.nurse;animateCharacter(c.time,false,false,j);animateCharacter(c.time,false,false,n);setSternJosiah(j,true);
 if(index<2){n.userData.arms[1].rotation.x=-1.2;n.userData.arms[1].rotation.z=-.45;n.userData.body.rotation.z=-.1;const clip=currentCorneredClip(c),fraction=index===1?Math.min(1,c.lineElapsed/(Number.isFinite(clip.duration)?clip.duration:6)):0;c.wrap.position.x=-fraction*.65;c.wrap.position.y=-fraction*.4;}else{if(c.wrap.parent===j.userData.body){c.root.attach(c.wrap);c.wrap.position.set(-2.3,1.18,-1);c.wrap.rotation.set(0,0,Math.PI/2);}j.userData.arms[0].visible=true;n.position.x=-1.8;}
 if(index===5){j.userData.arms[0].rotation.x=-.7;j.userData.arms[1].rotation.x=-.7;j.userData.head.rotation.x=-.07;}
 if(index===6){const lift=Math.min(1,c.lineElapsed/1.1);j.userData.arms[1].rotation.x=-.3-lift*2.65;j.userData.arms[1].rotation.z=-.16;j.userData.head.rotation.x=-.09;n.position.x=-2.05;}updateHospitalLips(c,dt);$('corneredSpeaker').textContent=line[0];$('corneredLine').textContent=line[1];if(index<2){camera.position.set(1.7,1.9,4.2);camera.lookAt(-.4,1.35,1.4);}else{camera.position.set(.6,1.85,index===5?3.5:4.4);camera.lookAt(0,1.7,1.2);}const clip=currentCorneredClip(c),duration=clip&&Number.isFinite(clip.duration)&&clip.duration>0?clip.duration:6;$('corneredProgress').style.width=Math.min(100,(index+Math.min(1,c.lineElapsed/duration))/c.lines.length*100)+'%';camera.updateMatrixWorld(true);
}

const corneredVoiceClips=["assets/audio/clip-fa1a4e80aa40.mp3","assets/audio/clip-9fab528023f0.mp3","assets/audio/clip-3951337d578e.mp3","assets/audio/clip-61eeb8d31c21.mp3","assets/audio/clip-070dff9d6fcb.mp3","assets/audio/clip-bc309e666631.mp3","assets/audio/clip-ba31bbfd6de0.mp3"].map(src=>{const a=new Audio(src);a.preload='auto';return a;});
let corneredAnalyser=null,corneredSamples=null;const corneredAudioSources=new WeakMap();
function prepareCorneredLipAudio(){initAudio();if(!audioCtx)return;try{if(!corneredAnalyser){corneredAnalyser=audioCtx.createAnalyser();corneredAnalyser.fftSize=256;corneredSamples=new Uint8Array(256);corneredAnalyser.connect(audioCtx.destination);}for(const clip of [...corneredVoiceClips,...hospitalVoiceClips,...peterEndingAudio,...josiahBreakdownAudio,...secretaryVoiceClips,...secretaryRearAudio,...stephenFinalOpeningAudio,...primeSecretaryAltAudio,josiahHoldFireAudio]){if(!corneredAudioSources.has(clip)){const source=audioCtx.createMediaElementSource(clip);source.connect(corneredAnalyser);corneredAudioSources.set(clip,source);}}}catch(e){}}
function updateCorneredLips(c,dt){
 if(!c.lipMouths)c.lipMouths=['gareth','alissa','stephen'].filter(name=>c.cast[name]).map(name=>{const actor=c.cast[name],m=ball(actor.userData.head,name==='alissa'?.06:.075,.006,.009,new THREE.MeshBasicMaterial({color:0x281016}),0,name==='alissa'?-.198:name==='gareth'?-.223:-.232,name==='alissa'?.267:name==='gareth'?.286:.292);m.visible=false;return {name,actor,m,level:0};});
 const clip=currentCorneredClip(c),speaker=c.lines[c.index]?.[2];let level=0;if(clip&&!clip.paused&&!clip.ended&&!c.voiceFailed&&speaker!=='kevin'){if(corneredAnalyser){corneredAnalyser.getByteTimeDomainData(corneredSamples);let sum=0;for(const n of corneredSamples)sum+=((n-128)/128)**2;level=Math.min(1,Math.sqrt(sum/corneredSamples.length)*8);}else level=.15+Math.abs(Math.sin(clip.currentTime*15))*.4;}
 for(const entry of c.lipMouths){const target=entry.name===speaker?level:0;entry.level+=(target-entry.level)*Math.min(1,dt*22);const open=target>.018&&entry.level>.015;entry.m.visible=open;entry.m.scale.y=.006+entry.level*.033;if(entry.actor.userData.mouth)entry.actor.userData.mouth.visible=!open;}
}

const hospitalVoiceClips=["assets/audio/clip-b1a3e6ef8ec7.mp3","assets/audio/clip-ff727634115a.mp3","assets/audio/clip-e35993d0d593.mp3","assets/audio/clip-252f951c977a.mp3","assets/audio/clip-ffab37ee879e.mp3","assets/audio/clip-5ce162e774ce.mp3","assets/audio/clip-ce63928feff8.mp3"].map(src=>{const a=new Audio(src);a.preload='auto';return a;});
function stopCorneredVoice(){[...corneredVoiceClips,...hospitalVoiceClips].forEach(a=>{a.pause();a.currentTime=0;});}
function currentCorneredClip(c){if(c.hospital)return hospitalVoiceClips[c.index];return c.index===4&&!c.cast.stephen?null:corneredVoiceClips[c.index];}
function playCorneredLine(c){prepareCorneredLipAudio();stopCorneredVoice();c.lineElapsed=0;c.voiceFailed=false;const clip=currentCorneredClip(c);if(!clip)return;clip.muted=muted;try{const pending=clip.play();if(pending?.catch)pending.catch(()=>{if(corneredIntro===c)c.voiceFailed=true;});}catch(e){c.voiceFailed=true;}}
function tickCorneredVoice(c,dt){if(c.index<0){c.index=0;playCorneredLine(c);}else c.lineElapsed+=dt;const clip=currentCorneredClip(c);if(clip)clip.muted=muted;const duration=clip&&Number.isFinite(clip.duration)&&clip.duration>0?clip.duration:6;const finished=clip&&!c.voiceFailed?(clip.ended||c.lineElapsed>duration+8):c.lineElapsed>=duration;if(finished){c.index++;if(c.index>=c.lines.length){finishCorneredIntro();return false;}playCorneredLine(c);}return true;}

let corneredRooms=null;
function setupHundredRoomStory(){const c=corneredRooms;c.quest={stage:'waiting',fileRoom:33+Math.floor(Math.random()*5),freed:false};c.storyActors=[];c.jones=makeJonesOrEmma(false);c.jones.position.set(-1.55,0,c.layouts[29].center);c.root.add(c.jones);c.mariah=makeMariahBanu();c.mariah.position.set(1.6,0,c.layouts[81].center);c.root.add(c.mariah);c.file=new THREE.Group();c.root.add(c.file);c.file.position.set(1.4,.9,c.layouts[c.quest.fileRoom].center);box(c.file,.55,.035,.4,mat(0xbaaa7a),0,0,0);box(c.file,.38,.012,.29,mat(0xe6dfc7),.02,.026,0);c.cell=new THREE.Group();c.root.add(c.cell);c.cell.position.z=c.layouts[81].center;const steel=mat(0x6a7177);for(let x=.8;x<=2.8;x+=.25)box(c.cell,.035,2.7,.05,steel,x,1.35,.65);box(c.cell,2.2,.06,.08,steel,1.8,2.7,.65);c.warning='';c.warningTime=0;}
function roomStoryPrompt(){const c=corneredRooms;if(!c.quest)return '';const q=c.quest;if(q.stage==='fighting'||q.stage==='lost')return ''; if(c.index===29&&player.distanceTo(c.jones.position)<2.5)return q.stage==='file'?'[ E ] GIVE TRANSFER FILE TO GARETH JONES':q.stage==='key'?'GARETH JONES · KEY TO ROOM 082 RECEIVED':'[ E ] TALK TO GARETH JONES';if(c.index===q.fileRoom&&q.stage==='search'&&Math.hypot(player.x-c.file.position.x,player.z-c.file.position.z)<2)return '[ E ] TAKE MARIAH’S TRANSFER FILE';if(c.index===81&&!q.freed&&!['fighting','lost'].includes(q.stage)&&player.distanceTo(c.mariah.position)<2.7)return q.stage==='key'?'[ E ] USE KEY · FREE MARIAH BANU':'MARIAH IS LOCKED IN · GARETH JONES HAS THE KEY';return '';}
function openJonesQuestChoice(){const c=corneredRooms;c.questChoice=true;c.paused=true;keys.clear();$('roomsPause').hidden=true;$('jonesQuestChoice').hidden=false;document.exitPointerLock?.();}
function chooseJonesQuest(accept){const c=corneredRooms;if(!c||!c.questChoice)return;c.questChoice=false;c.paused=false;$('jonesQuestChoice').hidden=true;if(accept){c.quest.stage='search';c.warning='GARETH JONES: Find Mariah’s transfer file in room '+String(c.quest.fileRoom+1).padStart(3,'0')+'. I’ll hold Kevin back while you search.';c.warningTime=9;}else beginJonesLastStand();requestLock();}
function beginJonesLastStand(){const c=corneredRooms,q=c.quest;if(q.stage!=='waiting')return;q.stage='fighting';q.fightRemaining=120;c.warning='Gareth Jones is fighting Kevin Murderhorn.';c.warningTime=10;c.mariah.visible=false;c.cell.visible=false;if(!c.pursuer){const actor=makeRevealedKevin();c.root.add(actor);c.pursuer={actor,bash:0,door:null};}c.pursuer.actor.position.set(c.jones.position.x+1.4,0,c.jones.position.z-.8);}
function tickJonesLastStand(dt){const c=corneredRooms,q=c.quest;if(q.stage!=='fighting')return;q.fightRemaining=Math.max(0,q.fightRemaining-dt);if(q.fightRemaining===0){q.stage='lost';c.jones.visible=false;gameProgress.garethJonesDeceased=true;gameProgress.mariahNeverSeenAgain=true;delete gameProgress.mariahFreed;saveProgress();c.warning='Gareth Jones has died. It is now impossible to find Mariah Banu.';c.warningTime=14;return;}const k=c.pursuer.actor,j=c.jones,t=c.time;j.rotation.y=Math.atan2(k.position.x-j.position.x,k.position.z-j.position.z);k.rotation.y=j.rotation.y+Math.PI;animateCharacter(t,false,false,j);animateCharacter(t,false,false,k);j.userData.arms[1].rotation.x=-1.2+Math.sin(t*8)*.65;k.userData.arms[0].rotation.x=-1.25+Math.sin(t*8+2)*.7;j.userData.body.rotation.z=Math.sin(t*4)*.08;k.userData.body.rotation.z=Math.sin(t*4+1)*.08;}

function interactRoomStory(){const c=corneredRooms,q=c.quest;if(c.index===29&&player.distanceTo(c.jones.position)<2.5){if(q.stage==='waiting'){openJonesQuestChoice();return true;}if(q.stage==='fighting'||q.stage==='lost')return false;else if(q.stage==='file'){q.stage='key';c.pursuerGrace=12;c.warning='GARETH JONES: Take this key. Free Mariah Banu at door 082. Hurry!';}else c.warning=q.stage==='search'?'Return with the transfer file. The corridor is secured.':'The key opens Mariah’s cell in room 082.';c.warningTime=8;return true;}
 if(c.index===q.fileRoom&&q.stage==='search'&&Math.hypot(player.x-c.file.position.x,player.z-c.file.position.z)<2){q.stage='file';c.file.visible=false;c.warning='TRANSFER FILE FOUND · Return to Gareth Jones in room 030.';c.warningTime=6;return true;}
 if(c.index===81&&!q.freed&&!['fighting','lost'].includes(q.stage)&&player.distanceTo(c.mariah.position)<2.7){if(q.stage==='key'){q.freed=true;c.cell.visible=false;c.companions.push({name:'MARIAH',actor:c.mariah,lag:5});gameProgress.mariahFreed=true;delete gameProgress.garethJonesDeceased;delete gameProgress.mariahNeverSeenAgain;saveProgress();c.warning='MARIAH BANU IS FREE · She is coming with you.';}else c.warning='A key is required. Complete Gareth Jones’s quest in room 030.';c.warningTime=7;return true;}return false;}
function updateHundredRoomStory(dt){const c=corneredRooms,q=c.quest;if(!q)return;if(c.index>29&&q.stage==='waiting')beginJonesLastStand();tickJonesLastStand(dt);const absent=q.stage==='fighting'||q.stage==='lost';c.jones.visible=q.stage!=='lost'&&Math.abs(c.index-29)<=1;c.mariah.visible=!absent&&(q.freed||Math.abs(c.index-81)<=1);c.cell.visible=!absent&&!q.freed&&Math.abs(c.index-81)<=1;c.file.visible=q.stage==='search'&&Math.abs(c.index-q.fileRoom)<=1;if(c.jones.visible&&q.stage!=='fighting')animateCharacter(c.time,false,false,c.jones);if(c.mariah.visible&&!q.freed)animateCharacter(c.time,false,false,c.mariah);
 if(c.furthest>=19&&!c.pursuer){const actor=makeRevealedKevin();c.root.add(actor);actor.position.set(0,0,c.layouts[0].center+c.layouts[0].depth/2-2);c.pursuer={actor,bash:0,door:null};c.warning='KEVIN IS COMING FROM ROOM 001 · RUN!';c.warningTime=7;}
 const k=c.pursuer;if(k)k.actor.position.y=roomStairHeight(k.actor.position.z);if(k&&q.stage==='fighting'){k.actor.visible=c.jones.visible;}if(k&&q.stage!=='fighting'){c.pursuerGrace=Math.max(0,(c.pursuerGrace||0)-dt);const safe=q.stage==='search'||q.stage==='file'||c.pursuerGrace>0,p=k.actor.position;const entry=c.layouts[29].center+c.layouts[29].depth/2;let moving=false;if(safe){if(p.z<entry+2)p.z=entry+2;}else{const delta=player.z-p.z,step=Math.sign(delta)*Math.min(Math.abs(delta),18*dt);let blocked=null;for(const door of c.doors.values())if(door.open<.9&&Math.abs(door.z-p.z)<1.1||door.open<.9&&(door.z-p.z)*(door.z-(p.z+step))<=0){blocked=door;break;}if(blocked){if(k.door!==blocked.number){k.door=blocked.number;k.bash=0;}k.bash+=dt;if(k.bash>=2.4){blocked.target=1;k.bash=0;}}else{p.z+=step;k.door=null;moving=Math.abs(step)>.001;}if(Math.abs(p.z-player.z)<2){p.x+=(player.x-p.x)*Math.min(1,dt*8);if(p.distanceTo(player)<1){failCorneredPursuit();return;}}else p.x*=Math.max(0,1-dt*5);k.actor.rotation.y=delta<0?Math.PI:0;}k.actor.visible=Math.abs(p.z-player.z)<45;animateCharacter(c.time,moving,true,k.actor);}
 c.warningTime=Math.max(0,c.warningTime-dt);const objective=q.stage==='fighting'?'Gareth Jones is fighting Kevin Murderhorn · '+Math.ceil(q.fightRemaining)+'s':q.stage==='lost'?'Gareth Jones has died · Mariah can never be found. Reach room 100.':q.freed?'MARIAH RESCUED · REACH ROOM 100':q.stage==='key'?'KEY OBTAINED · FREE MARIAH AT DOOR 082':q.stage==='file'?'RETURN TO GARETH JONES · ROOM 030':q.stage==='search'?'FIND TRANSFER FILE · ROOM '+String(q.fileRoom+1).padStart(3,'0'):'FIND GARETH JONES · ROOM 030';$('roomsQuest').textContent=c.warningTime>0?c.warning:objective;const prompt=roomStoryPrompt();if(prompt)$('roomsPrompt').textContent=prompt;}
function failCorneredPursuit(){mode='roomsEnd';keys.clear();document.exitPointerLock?.();$('roomsHUD').hidden=true;$('roomsEnd').hidden=false;$('roomsEndTitle').textContent='KEVIN CAUGHT YOU';$('roomsEndText').textContent='You reached room '+String(corneredRooms.index+1).padStart(3,'0')+'. Try a new layout and keep moving.';$('roomsRetry').hidden=false;}

function generateCorneredRooms(){
 const themes=['THE BLOOD WING','CRIMSON RECORDS','THE RED GALLERY','SCARLET QUARTERS','THE SANGUINE LIBRARY'].map(name=>({name,wall:0x480916,wood:0x29050c,floor:0x160207}));
 return Array.from({length:100},(_,i)=>({number:i+1,stairs:i>0&&i<98&&i%7===0,locked:i>1&&i<98&&i%4===2,keyTaken:false,width:9+Math.floor(Math.random()*5),depth:13+Math.floor(Math.random()*10),theme:themes[Math.floor(Math.random()*themes.length)],rug:Math.random()>.3,ceiling:6.4+Math.random()*.8,props:Array.from({length:4+Math.floor(Math.random()*5)},(_,j)=>({side:j%2?1:-1,z:.12+Math.random()*.76,type:Math.floor(Math.random()*4),height:1.3+Math.random()*1.1})),flicker:Math.random()*TAU}));
}
function clearCorneredRooms(){stopChambersTheme();if(mode==='rooms'&&corneredRooms?.finale?.phase==='breakdown'){josiahGoneSong.pause();josiahGoneSong.currentTime=0;}stopJosiahBreakdownAudio();stopPeterEndingAudio();stopPeterKillTaunt();stopPeterFinaleVoice();if(!corneredRooms)return;$('roomsMap').width=$('roomsMap').height=210;if(corneredRooms.finale?.playerGun)disposeCampObject(corneredRooms.finale.playerGun);clearChapterRedOpening(corneredRooms);if(corneredRooms.surfaceMaps){disposeDetailedRedObject(corneredRooms.root);corneredRooms.surfaceMaps.dispose();}else disposeCampObject(corneredRooms.root);scene.background.copy(corneredRooms.background);scene.fog.color.copy(corneredRooms.fogColor);corneredRooms=null;for(const id of ['roomsHUD','roomsPause','roomsEnd','jonesQuestChoice','peterFinaleUI','peterFightHUD'])$(id).hidden=true;}
function startCorneredRooms(){if(!canOpenCorneredRat())return;clearCorneredIntro();clearCorneredRooms();setMode('rooms');world.visible=upperWorld.visible=exhibit.visible=false;for(const a of [subject,peter,alissa,gareth,stephen,elizabethMenu,kevinMenu,kevinRevealed,garethJonesMenu,emmaMenu,mariahMenu,chrisMenu])a.visible=false;
 corneredRooms={layouts:generateCorneredRooms(),index:0,furthest:0,time:0,paused:false,root:null,obstacles:[],background:scene.background.clone(),fogColor:scene.fog.color.clone(),torch:true};scene.background.setHex(0x050407);scene.fog.color.setHex(0x100b13);scene.fog.density=.03;ambient.intensity=.32;cameraFill.intensity=.12;flash.visible=true;flash.intensity=30;keys.clear();$('roomsHUD').hidden=false;loadCorneredRoom(0);setupHundredRoomStory();updateHundredRoomStory(0);beginChapterRedOpening(corneredRooms,'A CORNERED RAT');
}
function buildCorneredRoomBase(index,context=corneredRooms){const c=context,obstacles=[],lights=[];const plan=c.layouts[index],r=new THREE.Group();c.root.add(r);r.position.z=plan.center;const {width:w,depth:d,theme:t,ceiling:h}=plan,wall=mat(t.wall),wood=mat(t.wood),trim=mat(0x71604f),dark=mat(0x111018),metal=mat(0x4e4a45);
 box(r,w,.3,d,mat(t.floor),0,-.17,0);box(r,w,.2,d,mat(0x17151b),0,h,0);for(const s of [-1,1]){box(r,.25,h,d,wall,s*w/2,h/2,0);for(const side of [-1,1])box(r,(w-2.2)/2,h,.25,wall,side*(w/4+.55),h/2,s*d/2);box(r,2.2,h-2.9,.25,wall,0,2.9+(h-2.9)/2,s*d/2);box(r,.08,.14,d,trim,s*(w/2-.16),.14,0);box(r,.08,.12,d,trim,s*(w/2-.16),h-.2,0);for(let z=-d/2+1;z<d/2;z+=2){box(r,.04,1.1,1.7,wood,s*(w/2-.15),.68,z);box(r,.07,.08,1.8,trim,s*(w/2-.19),1.25,z);}}
 for(let z=-d/2;z<d/2;z+=.65)box(r,w,.012,.025,dark,0,.005,z);
 if(plan.rug){box(r,2.5,.025,d-3,mat(index%2?0x54091a:0x3f0512),0,.025,0);for(const s of [-1,1])box(r,.035,.01,d-3.1,trim,s*1.12,.045,0);}
 for(const s of [-1,1]){const z=s*d/2;for(const x of [-1.08,1.08])box(r,.12,2.9,.26,trim,x,1.45,z);box(r,2.28,.14,.26,trim,0,2.9,z);const number=s===1?index:index+1;if(!c.doors.has(number)){const pivot=new THREE.Group();c.root.add(pivot);pivot.position.set(-1,0,plan.center+z);const leaf=box(pivot,2,2.8,.14,wood,1,1.4,0);for(const face of [-1,1]){ball(pivot,.055,.055,.055,metal,1.72,1.15,face*.12);for(const y of [.7,1.8])box(pivot,1.55,.7,.03,wall,1,y,face*.09);const label=sign(number===100?'EXIT':String(number+1).padStart(3,'0'),'#edd9b5','#211720',.7);label.position.set(1,2.34,face*.13);if(face===-1)label.rotation.y=Math.PI;pivot.add(label);}c.doors.set(number,{pivot,z:plan.center+z,open:0,target:0,number});}}
 for(const s of [-1,1])for(const z of [-d*.28,d*.28]){const bulb=ball(r,.09,.17,.09,new THREE.MeshBasicMaterial({color:0xff6a79}),s*(w/2-.35),2.45,z);box(r,.10,.35,.22,metal,s*(w/2-.28),2.22,z);const light=new THREE.PointLight(0xff344f,7,9,1.7);light.position.set(s*(w/2-.6),2.5,z);r.add(light);lights.push(light);}
 for(const p of plan.props){const x=p.side*(w/2-1),z=(p.z-.5)*(d-4),prop=new THREE.Group();r.add(prop);prop.position.set(x,0,z);let size=1.25;
  if(p.type===0){box(prop,1.2,p.height,.6,wood,0,p.height/2,0);for(let y=.4;y<p.height;y+=.45){box(prop,1.05,.04,.65,trim,0,y,.05);for(let k=0;k<5;k++)box(prop,.13,.3,.18,mat([0x553039,0x4c4d36,0x323f50][k%3]),-.4+k*.19,y+.17,.32);}}
  else if(p.type===1){box(prop,1.25,.1,.8,wood,0,.85,0);for(const a of [-.5,.5])for(const b of [-.3,.3])box(prop,.09,.85,.09,wood,a,.425,b);box(prop,.45,.07,.30,mat(0xb1a485),.1,.95,.05);}
  else if(p.type===2){box(prop,1.1,.40,.8,wood,0,.55,0);box(prop,1.0,.35,.72,mat(0x403343),0,.80,0);box(prop,1.05,.8,.15,wood,0,1.13,-.35);}
  else{box(prop,.70,.8,.70,mat(0x494044),0,.4,0);for(let j=0;j<4;j++){const leaf=mesh(new THREE.ConeGeometry(.22,.8,5),mat(0x293931),prop,(j%2-.5)*.2,1+j*.13,0);leaf.rotation.z=(j-1.5)*.15;}size=.85;}
  obstacles.push([x-size/2,z-.55,x+size/2,z+.55]);}
 // Small framed abstract portraits, distinct from the original game's artwork.
 for(const s of [-1,1]){box(r,.08,1.1,.85,trim,s*(w/2-.18),2,0);box(r,.09,.9,.66,mat(0x241b26),s*(w/2-.23),2,0);ball(r,.04,.23,.16,mat(0x6a4c46),s*(w/2-.28),2.07,0);}
 addRoomStairsAndKey(r,plan,index);r.updateMatrixWorld(true);return {root:r,index,lights,obstacles:obstacles.map(([a,b,d,e])=>[a,b+plan.center,d,e+plan.center])};
}

function buildCorneredRoom(index,context=corneredRooms){return context?.surfaceMaps?buildDetailedRedRoom(context.layouts[index],context):buildCorneredRoomBase(index,context);}
function loadCorneredRoom(index){const c=corneredRooms;if(index>0&&c.arrival)clearChapterRedOpening(c);prepareLegacyRedRooms(c);if(!c.rooms){c.root=new THREE.Group();scene.add(c.root);c.rooms=new Map();c.doors=new Map();let centre=0;c.layouts.forEach((p,i)=>{if(i)centre-=(c.layouts[i-1].depth+p.depth)/2;p.center=centre;});player.set(0,0,c.layouts[0].depth/2-2.8);yaw=0;pitch=0;camera.rotation.order='YXZ';setupRoomCompanions();}
 c.index=index;if(c.pursuer&&index>1){const behind=c.doors.get(index-1);if(behind)behind.target=0;}c.furthest=Math.max(c.furthest,index);for(let i=Math.max(0,index-1);i<=Math.min(99,index+1);i++)if(!c.rooms.has(i))c.rooms.set(i,buildCorneredRoom(i));for(const [i,room] of c.rooms)if(Math.abs(i-index)>1){disposeDetailedRedObject(room.root);c.rooms.delete(i);}for(const door of c.doors.values())door.pivot.visible=Math.abs(door.number-index)<=2;c.obstacles=[...c.rooms.values()].flatMap(r=>r.obstacles);c.lights=[...c.rooms.values()].flatMap(r=>r.lights);syncLegacyRedRoomLights(c);const p=c.layouts[index];$('roomsNumber').textContent='ROOM '+String(index+1).padStart(3,'0')+' / 100';$('roomsWing').textContent=redRoomTitle(p);drawRoomsMinimap();}
function nearestRoomDoor(){const c=corneredRooms;return [...c.doors.values()].filter(d=>d.number>0&&Math.abs(d.z-player.z)<2.5&&Math.abs(player.x)<1.5).sort((a,b)=>Math.abs(a.z-player.z)-Math.abs(b.z-player.z))[0];}
function useCorneredDoor(){const c=corneredRooms;if(mode!=='rooms'||!c||c.paused||c.finale||c.arrival)return;if(collectRoomKey())return;if(interactRoomStory())return;const door=nearestRoomDoor();if(door?.number===82&&!c.quest.freed&&!['fighting','lost'].includes(c.quest.stage)){c.warning='FREE MARIAH BEFORE LEAVING ROOM 082 · KEY REQUIRED';c.warningTime=5;return;}if(door&&door.target===0){const lock=c.layouts[door.number-1];if(lock?.locked&&!lock.keyTaken){c.warning='LOCKED · FIND THE GOLD KEY NEARBY';c.warningTime=4;return;}door.target=1;}}
function corneredRoomWalkable(x,z){const c=corneredRooms;if(c.quest&&!c.quest.freed&&!['fighting','lost'].includes(c.quest.stage)&&x>.65&&x<3&&Math.abs(z-c.layouts[81].center)<.85)return false;for(const door of c.doors.values())if(Math.abs(z-door.z)<.4){if(Math.abs(x)>.72||door.open<.9)return false;}
 const inside=[...c.rooms.values()].some(r=>{const p=c.layouts[r.index];return Math.abs(x)<p.width/2-.4&&Math.abs(z-p.center)<p.depth/2+.05;});const last=c.layouts[99],outside=c.index===99&&c.doors.get(100)?.open>=.9&&Math.abs(x)<.72&&z<last.center-last.depth/2&&z>last.center-last.depth/2-2;return (inside||outside)&&!c.obstacles.some(([a,b,d,e])=>x>a-.3&&x<d+.3&&z>b-.3&&z<e+.3);}
function renderCorneredRooms(dt){const c=corneredRooms;if(!c)return;if(c.arrival){renderChapterRedOpening(dt);return;}if(c.paused)return;if(c.finale){renderPeterFinale(dt);return;}c.time+=dt;for(const door of c.doors.values()){playRoomDoorOpening(door);door.open+=Math.sign(door.target-door.open)*Math.min(Math.abs(door.target-door.open),dt*1.35);door.pivot.rotation.y=-door.open*Math.PI*.52;}
 const f=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0),s=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0),len=Math.hypot(f,s)||1,speed=keys.has('ShiftLeft')?(c.pursuer?7:5.5):3.5,dx=(-Math.sin(yaw)*f+Math.cos(yaw)*s)/len*dt*speed,dz=(-Math.cos(yaw)*f-Math.sin(yaw)*s)/len*dt*speed;
 if(corneredRoomWalkable(player.x+dx,player.z))player.x+=dx;if(corneredRoomWalkable(player.x,player.z+dz))player.z+=dz;
 const p=c.layouts[c.index];if(player.z<p.center-p.depth/2-.5){if(c.index===99){finishCorneredRooms();return;}loadCorneredRoom(c.index+1);}else if(c.index>0&&player.z>p.center+p.depth/2+.5)loadCorneredRoom(c.index-1);
 player.y=roomStairHeight(player.z);camera.position.set(player.x,player.y+1.7,player.z);camera.rotation.set(pitch,yaw,0);const door=nearestRoomDoor();$('roomsPrompt').textContent=door?(door.open>=.9?'WALK THROUGH':door.target?'OPENING…':'[ E ] OPEN DOOR'):'';c.lights.forEach((l,i)=>l.intensity=6.7+Math.sin(c.time*2+i)*.3);flash.visible=c.torch;updateRoomCompanions(dt);updateHundredRoomStory(dt);const kp=c.layouts[c.index];if(kp.locked&&!kp.keyTaken&&Math.hypot(player.x-1.7,player.z-kp.center)<2)$('roomsPrompt').textContent='[ E ] TAKE DOOR KEY';drawRoomsMinimap();drawKevinTracker();}
function setupRoomCompanions(){const c=corneredRooms;const roster=[['GARETH',makeGareth()],['ALISSA',makeAlissa()]];if(gameProgress.stephenRescued===true&&!stephenIsDeceased())roster.push(['STEPHEN',makeStephen()]);c.trail=[player.clone()];c.companions=roster.map(([name,actor],i)=>{c.root.add(actor);const side=i===0?-.65:i===1?.65:0;actor.position.set(player.x+side,0,player.z+(yaw===0?1.15:-1.15));actor.rotation.y=yaw+Math.PI;return {name,actor,lag:1.8+i*.9};});drawRoomsMinimap();}
function updateRoomCompanions(dt){const c=corneredRooms;if(player.distanceTo(c.trail[c.trail.length-1])>.35)c.trail.push(player.clone());while(c.trail.length>120)c.trail.shift();for(const [i,e] of c.companions.entries()){let goal=c.trail[0],distance=0;for(let j=c.trail.length-1;j>0;j--){distance+=c.trail[j].distanceTo(c.trail[j-1]);goal=c.trail[j-1];if(distance>=e.lag)break;}const p=e.actor.position,dx=goal.x-p.x,dz=goal.z-p.z,d=Math.hypot(dx,dz),gap=p.distanceTo(player);let moving=false;if(d>.2&&gap>1.4){const step=Math.min(d,dt*(gap>7?(c.pursuer?10:5.6):3.7)),sx=dx/d*step,sz=dz/d*step;const free=(x,z)=>corneredRoomWalkable(x,z)&&Math.hypot(x-player.x,z-player.z)>1.15&&!c.companions.some(o=>o!==e&&Math.hypot(x-o.actor.position.x,z-o.actor.position.z)<.45);if(free(p.x+sx,p.z+sz)){p.x+=sx;p.z+=sz;moving=true;}else if(free(p.x+sx,p.z)){p.x+=sx;moving=Math.abs(sx)>.001;}else if(free(p.x,p.z+sz)){p.z+=sz;moving=Math.abs(sz)>.001;}if(moving){const angle=Math.atan2(dx,dz),diff=Math.atan2(Math.sin(angle-e.actor.rotation.y),Math.cos(angle-e.actor.rotation.y));e.actor.rotation.y+=diff*Math.min(1,dt*7);}}e.actor.position.y=roomStairHeight(e.actor.position.z);animateCharacter(c.time+i,moving,false,e.actor);}}
function drawRoomsMinimap(){const c=corneredRooms;if(!c)return;const canvas=$('roomsMap'),ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,scale=9,p=c.layouts[c.index],x=v=>w/2+(v-player.x)*scale,z=v=>h/2+(v-player.z)*scale;ctx.clearRect(0,0,w,h);ctx.fillStyle='#090710';ctx.fillRect(0,0,w,h);ctx.fillStyle='#30232e';ctx.fillRect(x(-p.width/2),z(p.center-p.depth/2),p.width*scale,p.depth*scale);ctx.strokeStyle='#b0818a';ctx.lineWidth=2;ctx.strokeRect(x(-p.width/2),z(p.center-p.depth/2),p.width*scale,p.depth*scale);ctx.fillStyle='#82705d';for(const [a,b,d,e] of c.obstacles)ctx.fillRect(x(a),z(b),(d-a)*scale,(e-b)*scale);ctx.fillStyle='#e2b861';for(const side of [-1,1])ctx.fillRect(x(-.9),z(p.center+side*p.depth/2)-2,1.8*scale,4);for(const e of c.companions||[]){ctx.fillStyle='#61b4ff';ctx.beginPath();ctx.arc(x(e.actor.position.x),z(e.actor.position.z),3.4,0,TAU);ctx.fill();ctx.font='8px monospace';ctx.textAlign='center';ctx.fillStyle='#c0dfff';ctx.fillText(e.name,x(e.actor.position.x),z(e.actor.position.z)-7);}for(const [actor,label,color] of [[c.jones,'JONES','#72baff'],[c.mariah,'MARIAH','#72baff'],[c.pursuer?.actor,'KEVIN','#ffd34b']]){if(!actor?.visible)continue;ctx.fillStyle=color;ctx.beginPath();ctx.arc(x(actor.position.x),z(actor.position.z),3.5,0,TAU);ctx.fill();ctx.font='8px monospace';ctx.textAlign='center';ctx.fillText(label,x(actor.position.x),z(actor.position.z)-7);}ctx.save();ctx.translate(w/2,h/2);ctx.rotate(-yaw);ctx.fillStyle='#fff0e8';ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(4,4);ctx.lineTo(0,2);ctx.lineTo(-4,4);ctx.closePath();ctx.fill();ctx.restore();}

function pauseCorneredRooms(){if(corneredRooms?.arrival){pauseChapterRedOpening();return;}chambersTheme.pause();chambersThemeRequested=false;if(mode!=='rooms'||!corneredRooms||corneredRooms.questChoice||['dialogue','ending','breakdown'].includes(corneredRooms.finale?.phase))return;corneredRooms.paused=true;if(corneredRooms.finale?.killTauntPending)activePeterCombatAudio().pause();keys.clear();$('roomsPause').hidden=false;document.exitPointerLock?.();}
function resumeCorneredRooms(){if(!corneredRooms||mode!=='rooms')return;corneredRooms.paused=false;if(corneredRooms.finale?.killTauntPending)activePeterCombatAudio().play().catch(()=>{corneredRooms.finale.killTauntPending=false;});$('roomsPause').hidden=true;requestLock();}
function finishCorneredRooms(){if(mode!=='rooms')return;if(corneredRooms.quest.freed&&!corneredRooms.peterDefeated){startPeterFinale();return;}mode='roomsEnd';keys.clear();document.exitPointerLock?.();$('roomsHUD').hidden=true;$('roomsEnd').hidden=false;$('roomsEndTitle').textContent='TO BE CONTINUED';$('roomsEndText').textContent=corneredRooms.quest.freed?(gameProgress.peterKilledByStephen?'Stephen stopped Peter. Emma is free. Chapter 5 is unlocked.':'Peter killed Emma before anyone could stop him. Chapter 5 is unlocked.'):'You escaped all 100 rooms. Gareth Jones is gone, and Mariah Banu can never be found.';$('roomsRetry').hidden=true;gameProgress.corneredRatRoomsCompleted=100;saveProgress();queueMicrotask(()=>continueCompletedChapter(4));}

function roomStairHeight(z){const c=corneredRooms,p=c.layouts.find(p=>Math.abs(z-p.center)<=p.depth/2);if(!p?.stairs)return 0;const d=Math.abs(z-p.center),span=p.depth/2-2;return d>span?0:Math.floor(Math.min(1,(span-d)/Math.max(1,span-1.2))*12)*.16;}
function addRoomStairsAndKey(root,p,index){if(p.stairs){const span=p.depth/2-2;for(let j=0;j<24;j++){const z=-span+(j+.5)*span/12,y=Math.floor(Math.min(1,(span-Math.abs(z))/Math.max(1,span-1.2))*12)*.16;box(root,p.width-.3,y+.08,span/12,mat(0x410814),0,y/2-.04,z);for(const side of [-1,1]){box(root,.055,.9,.055,mat(0x9b4c52),side*1.5,y+.45,z);box(root,.09,.055,span/12+.03,mat(0x9b4c52),side*1.5,y+.9,z);}}}if(p.locked&&!p.keyTaken){const key=new THREE.Group();key.name='nearbyDoorKey';root.add(key);key.position.set(1.7,1+roomStairHeight(p.center),0);const gold=new THREE.MeshBasicMaterial({color:0xffd365});mesh(new THREE.TorusGeometry(.13,.045,6,12),gold,key,0,0,0);box(key,.07,.35,.06,gold,0,-.22,0);box(key,.16,.07,.06,gold,.055,-.34,0);p.keyMesh=key;const label=sign('KEY '+String(index+2).padStart(3,'0'),'#ffe6a1','#310510',.85);label.position.set(1.7,key.position.y+.5,0);root.add(label);p.keyLabel=label;}}
function collectRoomKey(){const c=corneredRooms,p=c.layouts[c.index];if(!p.locked||p.keyTaken||Math.hypot(player.x-1.7,player.z-p.center)>2)return false;p.keyTaken=true;if(p.keyMesh)p.keyMesh.visible=false;if(p.keyLabel)p.keyLabel.visible=false;c.warning='KEY COLLECTED · NEXT DOOR UNLOCKED';c.warningTime=4;tone(550,.15,.08);return true;}
function drawKevinTracker(){const c=corneredRooms;if(!c?.pursuer||c.finale)return;const cv=$('roomsMap'),ctx=cv.getContext('2d'),p=c.pursuer.actor.position,w=cv.width,h=cv.height;const dx=p.x-player.x,dz=p.z-player.z,d=Math.hypot(dx,dz),r=Math.min(w,h)/2-18,len=Math.hypot(dx*9,dz*9)||1;const x=w/2+dx*9*Math.min(1,r/len),y=h/2+dz*9*Math.min(1,r/len);ctx.fillStyle='#ffd34b';ctx.beginPath();ctx.arc(x,y,5,0,TAU);ctx.fill();ctx.fillStyle='#13030a';ctx.fillRect(0,h-24,w,24);ctx.fillStyle='#ffda65';ctx.textAlign='center';ctx.font='10px monospace';ctx.fillText('KEVIN · '+Math.round(d)+'m'+(len>r?' · OFF MAP':''),w/2,h-9);}
function finaleGun(actor){const arm=actor.userData.arms?.[1]||actor;const gun=new THREE.Group();arm.add(gun);gun.position.set(0,-.64,.03);registerHeldGun(gun,new THREE.Vector3(0,0,1));box(gun,.13,.17,.48,mat(0x171820),0,0,.1);box(gun,.11,.24,.13,mat(0x26232b),0,-.14,-.02);const flash=ball(gun,.12,.12,.25,new THREE.MeshBasicMaterial({color:0xffd36b}),0,0,.4);flash.visible=false;return flash;}
function startPeterFinale(){$('peterFinaleLocation').textContent='CORNERED RAT / DOOR 100';const c=corneredRooms;if(c.finale)return;loadCorneredRoom(99);c.pursuer&&(c.pursuer.actor.visible=false);const z=c.layouts[99].center;c.obstacles=[];for(const room of c.rooms.values())room.root.visible=false;for(const door of c.doors.values())door.pivot.visible=false;const arena=new THREE.Group();arena.position.z=z;c.root.add(arena);box(arena,24,.3,30,mat(0x22040b),0,-.18,0);for(const x of [-12,12])box(arena,.3,6,30,mat(0x500b19),x,3,0);for(const dz of [-15,15])box(arena,24,6,.3,mat(0x350610),0,3,dz);for(const x of [-10,10])for(const dz of [-10,0,10]){const l=new THREE.PointLight(0xff6472,18,18);l.position.set(x,4,dz);arena.add(l);box(arena,.18,4,.18,mat(0x99535b),x,2,dz);}const enemy=makePeter();c.root.add(enemy);enemy.visible=true;enemy.position.set(0,0,z-7);const emma=makeJonesOrEmma(true);c.root.add(emma);emma.position.set(2,0,z-9);const ropes=new THREE.Group();emma.add(ropes);for(const y of [.75,1.05,1.35]){const r=mesh(new THREE.TorusGeometry(.37,.04,6,18),mat(0x9b8461),ropes,0,y,0);r.rotation.x=Math.PI/2;}emma.userData.arms?.forEach(a=>a.rotation.x=.25);box(arena,1,.12,1,mat(0x17030a),2,.6,-9);for(const x of [1.6,2.4])box(arena,.1,.6,.1,mat(0x17030a),x,.3,-9);
 if(!c.companions.some(e=>e.name==='JONES'))c.companions.push({name:'JONES',actor:c.jones,lag:6});c.companions.forEach((e,i)=>{e.actor.visible=true;e.actor.position.set(-7+i*3,0,z+6);e.flash=finaleGun(e.actor);e.shot=.5+i*.2;});player.set(0,0,z+11);yaw=0;pitch=0;c.finale={phase:'dialogue',line:0,time:0,hp:1000,playerHP:150,enemy,emma,ropes,arena,z,fire:0,attack:3,windup:0,shot:0,effects:[]};$('roomsHUD').hidden=true;$('peterFinaleUI').hidden=false;keys.clear();showPeterFinaleLine();}
const peterFinaleClips=["assets/audio/clip-fe948a087eae.mp3","assets/audio/clip-0ea7997e4e7c.mp3","assets/audio/clip-1c1bee4be9f2.mp3","assets/audio/clip-c945dd592650.mp3","assets/audio/clip-44d90a2911bc.mp3"].map(src=>{const clip=new Audio(src);clip.preload='auto';return clip;});
function stopPeterFinaleVoice(){peterFinaleClips.forEach(a=>{a.pause();a.currentTime=0;});}
function playPeterFinaleVoice(b){if(b.phase!=='dialogue'||b.voiceStartedLine===b.line)return;stopPeterFinaleVoice();b.voiceStartedLine=b.line;b.voiceFailed=false;const line=b.line,clip=peterFinaleClips[line];if(!clip)return;clip.loop=false;clip.muted=muted;try{clip.play()?.catch(()=>{if(corneredRooms?.finale===b&&b.line===line)b.voiceFailed=true;});}catch(e){b.voiceFailed=true;}}
function tickPeterFinaleVoice(b){if(b.phase!=='dialogue')return;const clip=peterFinaleClips[b.line];if(!clip)return;clip.muted=muted;const duration=Number.isFinite(clip.duration)&&clip.duration>0?clip.duration:0;if(clip.ended&&b.time>.2||b.voiceFailed&&b.time>8||duration&&b.time>duration+8||!duration&&b.time>30)advancePeterFinale();}
const peterFinaleLines=[['PETER CHAMBERS','The nice deputy was an act. Josiah gave me power, and now I intend to turn it against my master. Emma is my insurance.'],['GARETH WILLIAMS','Emma? You tied up one of my colleagues? You disgust me, Peter. Let her go.'],['EMMA RICHARDS','Gareth… don’t let him use me.'],['PETER CHAMBERS','The Prime Secretary made me more than a man. Let me show you what his gift can do.'],['ALISSA ROBERTS','Everyone, take position. We bring Peter down and get Emma out alive.']];
function showPeterFinaleLine(){const b=corneredRooms.finale,line=peterFinaleLines[b.line];$('peterFinaleSpeaker').textContent=line[0];$('peterFinaleLine').textContent=line[1];playPeterFinaleVoice(b);}
function advancePeterFinale(){const c=corneredRooms,b=c?.finale;if(b?.phase==='breakdown'){advanceJosiahBreakdown();return;}if(b?.phase==='ending'){advancePeterEnding();return;}if(!b||b.phase!=='dialogue')return;stopPeterFinaleVoice();b.line++;b.time=0;if(b.line<peterFinaleLines.length){showPeterFinaleLine();return;}b.phase='fight';triggerPeterCombatTaunt(b);$('peterFinaleSpeaker').textContent='';$('peterFinaleLine').textContent='';$('peterFinaleUI').hidden=true;$('roomsHUD').hidden=false;$('peterFightHUD').hidden=false;const gun=new THREE.Group();camera.add(gun);gun.position.set(.3,-.25,-.6);box(gun,.12,.16,.4,mat(0x25212a),0,0,0);box(gun,.1,.22,.12,mat(0x120c12),0,-.13,.08);b.playerGun=gun;requestLock();}
function firePeterFinale(){const c=corneredRooms,b=c?.finale;if(mode!=='rooms'||c.paused||b?.phase!=='fight'||b.fire>0)return;b.fire=.22;camera.updateMatrixWorld(true);const direction=new THREE.Vector3();camera.getWorldDirection(direction);b.enemy.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(b.enemy);const hit=new THREE.Ray(camera.position.clone(),direction).intersectBox(bounds,new THREE.Vector3());if(hit)reactPeterToHit(b,22,true);playGunshot(.65);peterFinaleTracer(camera.position.clone().add(new THREE.Vector3(0,-.15,0)),hit||camera.position.clone().addScaledVector(direction,24),0xffdf99);}
function peterFinaleTracer(a,b,color){const c=corneredRooms,geo=new THREE.BufferGeometry().setFromPoints([a,b]),line=new THREE.Line(geo,new THREE.LineBasicMaterial({color}));c.root.add(line);c.finale.effects.push({obj:line,life:.1});}
function renderPeterFinale(dt){updateChambersTheme();const c=corneredRooms,b=c.finale;b.time+=dt;c.time+=dt;if(b.phase==='breakdown'){renderJosiahBreakdown(dt);return;}if(b.phase==='ending'){renderPeterEnding(dt);return;}if(b.phase==='dialogue'){camera.position.set(0,1.8,b.z+1);camera.lookAt(1,1.2,b.z-8);tickPeterFinaleVoice(b);return;}
 tickPeterKillTaunt(b);b.fire=Math.max(0,b.fire-dt);const f=+keys.has('KeyW')-+keys.has('KeyS'),s=+keys.has('KeyD')-+keys.has('KeyA'),len=Math.hypot(f,s)||1,speed=c.time<(b.snaredUntil||0)?1.5:keys.has('ShiftLeft')?6.5:4;player.x=THREE.MathUtils.clamp(player.x+(-Math.sin(yaw)*f+Math.cos(yaw)*s)/len*speed*dt,-11,11);player.z=THREE.MathUtils.clamp(player.z+(-Math.cos(yaw)*f-Math.sin(yaw)*s)/len*speed*dt,b.z-13,b.z+13);camera.position.set(player.x,1.7,player.z);camera.rotation.set(pitch,yaw,0);if(keys.has('KeyF'))firePeterFinale();
 const e=b.enemy;e.rotation.y=Math.atan2(player.x-e.position.x,player.z-e.position.z);updatePeterEvasion(b,dt);animateCharacter(c.time,b.dodgeTime>0,true,e);b.attack-=dt;
 if(b.attack<=0&&b.windup<=0&&!(b.dodgeTime>0)){b.windup=1.4;b.target=player.clone();b.attackKind=b.shot++%3;const ring=mesh(new THREE.TorusGeometry(b.attackKind?3:2,.07,8,40),new THREE.MeshBasicMaterial({color:b.attackKind?0x6c9fff:0xa599bd}),c.root,b.target.x,.08,b.target.z);ring.rotation.x=Math.PI/2;b.warningRing=ring;}
 if(b.windup>0){b.windup-=dt;e.userData.arms[0].rotation.x=-2.5;$('peterAttackCue').textContent=['BLACK CHAIN LASH · DODGE THE MARKED RING','CHAIN BARRAGE · KEEP MOVING','CHAIN SNARE · GET OUT OF THE RING'][b.attackKind];if(b.windup<=0){if(Math.hypot(player.x-b.target.x,player.z-b.target.z)<(b.attackKind?3:2)){b.playerHP=Math.max(0,b.playerHP-(b.attackKind?35:25));if(b.attackKind===2)b.snaredUntil=c.time+1.2;}launchPeterBlackChains(b);b.recovery=.7;disposeCampObject(b.warningRing);b.warningRing=null;b.attack=2.1;}}else $('peterAttackCue').textContent='PETER’S BORROWED POWER · KEEP MOVING';
 c.companions.forEach((a,i)=>{const pos=a.actor.position;pos.x=-7+i*3+Math.sin(c.time*.6+i)*.8;a.actor.rotation.y=Math.atan2(e.position.x-pos.x,e.position.z-pos.z);animateCharacter(c.time+i,false,false,a.actor);if(a.actor.userData.arms?.[1])a.actor.userData.arms[1].rotation.x=-1.5;a.shot-=dt;a.flash.visible=a.shot<.07;if(a.shot<=0){a.shot=1.2+i*.08;if(!(b.dodgeTime>0))reactPeterToHit(b,3,false);playGunshot(.13);peterFinaleTracer(pos.clone().add(new THREE.Vector3(0,1.5,0)),e.position.clone().add(new THREE.Vector3(0,1.2,0)),0xffc978);}});
 animatePeterFinaleAttack(b,dt);for(const effect of b.effects){effect.life-=dt;if(effect.chain){const t=1-effect.life/effect.duration;effect.obj.scale.setScalar(Math.min(1,t*4));effect.obj.position.copy(effect.origin);}if(effect.life<=0)disposeCampObject(effect.obj);}b.effects=b.effects.filter(x=>x.life>0);$('peterFinaleHP').textContent=Math.ceil(b.hp)+' / 1000';$('peterFinaleBar').style.width=(b.hp/10)+'%';$('peterPlayerHP').textContent='PLAYER · '+b.playerHP+' / 150';$('roomsNumber').textContent='DOOR 100 / FREE EMMA';$('roomsWing').textContent='PETER CHAMBERS';$('roomsQuest').textContent='Armed allies: '+c.companions.map(a=>a.name).join(' · ');$('roomsPrompt').textContent=c.time<(b.tauntUntil||0)?'PETER: '+currentPeterTaunt(b):'';drawPeterFinaleMap();
 if(b.playerHP<=0){endPeterFinale(false);return;}if(b.hp<=0)endPeterFinale(true);}
const peterKillTauntAudio=new Audio("assets/audio/clip-ed64c23ae1f6.mp3");peterKillTauntAudio.preload='auto';peterKillTauntAudio.loop=false;
const peterCombatAudio=[peterKillTauntAudio,...["assets/audio/clip-e7f6fefc0bb7.mp3","assets/audio/clip-82ee5745e0cb.mp3","assets/audio/clip-4dcd3962b0b1.mp3","assets/audio/clip-3c7b337f6661.mp3","assets/audio/clip-cf5fdeeddcc8.mp3","assets/audio/clip-02191e4bd37e.mp3","assets/audio/clip-e9c7a9472ff6.mp3","assets/audio/clip-06198082069e.mp3","assets/audio/clip-09aae75da9c7.mp3"].map(src=>{const a=new Audio(src);a.preload='auto';a.loop=false;return a;})];
function activePeterCombatAudio(){return peterCombatAudio[corneredRooms?.finale?.tauntIndex||0];}
function stopPeterKillTaunt(){peterCombatAudio.forEach(a=>{a.pause();a.currentTime=0;});}
function triggerPeterCombatTaunt(b){stopPeterKillTaunt();const clip=peterCombatAudio[b.tauntIndex||0];b.tauntUntil=corneredRooms.time+5;b.voiceStart=corneredRooms.time;b.killTauntPending=true;b.nextTauntAt=Infinity;clip.muted=muted;try{clip.play()?.catch(()=>{if(corneredRooms?.finale===b){b.killTauntPending=false;b.nextTauntAt=corneredRooms.time+5;}});}catch(e){b.killTauntPending=false;b.nextTauntAt=corneredRooms.time+5;}}
function tickPeterKillTaunt(b){const clip=activePeterCombatAudio();clip.muted=muted;if(b.killTauntPending){const age=corneredRooms.time-b.voiceStart,duration=Number.isFinite(clip.duration)&&clip.duration>0?clip.duration:60;if(clip.ended||age>duration+8){b.killTauntPending=false;b.tauntUntil=corneredRooms.time;b.nextTauntAt=corneredRooms.time+2;}else b.tauntUntil=corneredRooms.time+.2;}else if(corneredRooms.time>=b.nextTauntAt){b.tauntIndex=((b.tauntIndex||0)+1)%peterCombatAudio.length;triggerPeterCombatTaunt(b);}}
const peterCombatTaunts=[
'I will kill you all, and then I will kill her and Josiah.',
'You mistook obedience for loyalty. Josiah made the same mistake.',
'He gave me these powers and expected me to remain his shadow.',
'Look carefully, Gareth. Your colleague is watching you fail.',
'The Prime Secretary taught me cruelty. I intend to surpass him.',
'Alissa, you wanted revenge. You should have stayed out of mine.',
'Mariah, there is no government left for you to reclaim.',
'One hundred rooms, and you still walked straight into my hands.',
'You can dodge the chains. You cannot dodge this forever.',
'When Josiah falls, I will not be standing beside him. I will be standing over him.'
];
function currentPeterTaunt(b){return peterCombatTaunts[(b.tauntIndex||0)%peterCombatTaunts.length];}
function reactPeterToHit(b,damage,playerHit){b.hp=Math.max(0,b.hp-damage);b.hitReaction=playerHit?.3:.12;if(playerHit){b.hits=(b.hits||0)+1;if((b.dodgeCooldown||0)<=0&&b.windup<=0){b.dodgeTime=.5;b.dodgeCooldown=3;b.dodgeDirection=b.enemy.position.x>7?-1:b.enemy.position.x<-7?1:b.hits%2?1:-1;}}}
function updatePeterEvasion(b,dt,arena=corneredRooms){b.dodgeCooldown=Math.max(0,(b.dodgeCooldown||0)-dt);b.hitReaction=Math.max(0,(b.hitReaction||0)-dt);if(b.dodgeTime>0){b.dodgeTime=Math.max(0,b.dodgeTime-dt);b.enemy.position.x=THREE.MathUtils.clamp(b.enemy.position.x+b.dodgeDirection*8*dt,-9.5,9.5);}else if(b.windup<=0&&!(b.recovery>0)){b.enemy.position.x=THREE.MathUtils.clamp(b.enemy.position.x+Math.sin(arena.time*.7)*dt*.8,-9.5,9.5);}}
function launchPeterBlackChains(b,arena=corneredRooms){const origin=b.enemy.position.clone().add(new THREE.Vector3(0,1.5,0)),end=b.target.clone().add(new THREE.Vector3(0,1,0)),delta=end.clone().sub(origin),group=new THREE.Group();arena.root.add(group);group.position.copy(origin);const material=new THREE.MeshStandardMaterial({color:0x070609,metalness:.85,roughness:.28,emissive:0x302536,emissiveIntensity:.4}),count=Math.min(64,Math.max(10,Math.ceil(delta.length()*3)));for(let strand=0;strand<(b.attackKind===1?5:b.attackKind===2?3:1);strand++){for(let i=0;i<count;i++){const t=i/(count-1),link=new THREE.Mesh(new THREE.TorusGeometry(.12,.038,5,10),material);link.position.copy(delta).multiplyScalar(t);link.position.x+=Math.sin(t*Math.PI*4+strand*2.1)*.3*Math.sin(t*Math.PI);link.position.y+=Math.sin(t*Math.PI)*(.4+strand*.2);link.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),delta.clone().normalize());link.rotateY(i%2?Math.PI/2:0);group.add(link);}}b.effects.push({obj:group,life:.8,duration:.8,chain:true,origin});}
function animatePeterFinaleAttack(b,dt,arena=corneredRooms){const u=b.enemy.userData;let charge=b.windup>0?1-b.windup/1.4:0;const recoil=Math.max(0,b.recovery||0)/.7;b.recovery=Math.max(0,(b.recovery||0)-dt);if(b.windup>0){u.body.rotation.x=-.12*charge;u.body.rotation.y=(b.attackKind?0:-.35)*charge;u.arms[0].rotation.x=-.5-charge*2.3;u.arms[0].rotation.z=-.25*charge;u.arms[1].rotation.x=b.attackKind?-.5-charge*2.3:-.35;u.arms[1].rotation.z=b.attackKind?.25*charge:0;u.head.rotation.x=-.12*charge;}else if(recoil>0){u.body.rotation.x=.25*recoil;u.body.rotation.y=.2*recoil;u.arms[0].rotation.x=-1.65*recoil;u.arms[1].rotation.x=b.attackKind?-1.65*recoil:-.25;u.head.rotation.x=.12*recoil;}else{u.body.rotation.x=0;u.body.rotation.y=0;u.head.rotation.x=0;if(arena.time<(b.tauntUntil||0)){u.arms[0].rotation.x=-1.1;u.arms[0].rotation.z=-.7;u.arms[1].rotation.z=.55;}else{u.arms[0].rotation.z=-.065;u.arms[1].rotation.z=.065;}}if(b.dodgeTime>0){u.body.rotation.z=b.dodgeDirection*.45;u.body.rotation.x=.25;u.arms[0].rotation.x=-.8;u.arms[1].rotation.x=-.8;}else{u.body.rotation.z=0;if(b.hitReaction>0){u.body.rotation.x-=b.hitReaction*.65;u.head.rotation.x-=b.hitReaction*.5;}}const talking=arena.time<(b.tauntUntil||0);if(u.openMouth){u.openMouth.visible=talking&&Math.sin(arena.time*14)>.05;if(u.mouth)u.mouth.visible=!u.openMouth.visible;}}
function drawPeterFinaleMap(){const c=corneredRooms,b=c.finale,cv=$('roomsMap');if(cv.width!==280||cv.height!==320){cv.width=280;cv.height=320;}const ctx=cv.getContext('2d'),w=cv.width,h=cv.height,scale=Math.min((w-64)/24,(h-76)/30),x=v=>w/2+v*scale,z=v=>h/2+(v-b.z)*scale;ctx.fillStyle='#0b0208';ctx.fillRect(0,0,w,h);ctx.fillStyle='#2c0a17';ctx.fillRect(x(-12),z(b.z-15),24*scale,30*scale);ctx.strokeStyle='#ad526d';ctx.lineWidth=2;ctx.strokeRect(x(-12),z(b.z-15),24*scale,30*scale);ctx.fillStyle='#dcb7c6';ctx.font='11px monospace';ctx.textAlign='center';ctx.fillText('DOOR 100 / ARENA OVERVIEW',w/2,18);if(b.windup>0){ctx.strokeStyle=b.attackKind?'#7eaaff':'#cbb3d3';ctx.beginPath();ctx.arc(x(b.target.x),z(b.target.z),(b.attackKind?3:2)*scale,0,TAU);ctx.stroke();}const markers=[[{position:player},'#ffffff','YOU'],[b.enemy,'#ed2548','PETER'],[b.emma,'#ffcf79','EMMA'],...c.companions.map(a=>[a.actor,'#64b7ff',a.name])];for(const [i,[actor,color,name]] of markers.entries()){const px=x(actor.position.x),py=z(actor.position.z);ctx.fillStyle=color;ctx.beginPath();ctx.arc(px,py,4,0,TAU);ctx.fill();ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText(name,px,py+(i>=3&&i%2?15:-9));}ctx.fillStyle='#c5a5b4';ctx.font='9px monospace';ctx.fillText('BLUE ALLIES · RED PETER · GOLD EMMA',w/2,h-12);}

function endPeterFinale(won){stopChambersTheme();stopPeterKillTaunt();const c=corneredRooms,b=c.finale;if(won&&b.playerGun){disposeCampObject(b.playerGun);b.playerGun=null;}$('peterFightHUD').hidden=true;$('peterFinaleUI').hidden=true;if(won){startPeterEnding();}else{mode='roomsEnd';keys.clear();document.exitPointerLock?.();$('roomsHUD').hidden=true;$('roomsEnd').hidden=false;$('roomsEndTitle').textContent='PETER OVERWHELMED YOU';$('roomsEndText').textContent='Your allies are still holding the line. Retry the Door 100 fight.';$('roomsRetry').hidden=false;}}
const peterEndingAudio=["assets/audio/clip-83ab021d83f1.mp3","assets/audio/clip-2dd8b56aaa8a.mp3","assets/audio/clip-7555c25d293f.mp3","assets/audio/clip-b5c458a35df6.mp3","assets/audio/clip-404ee5cb0ed7.mp3","assets/audio/clip-88787464245b.mp3","assets/audio/clip-5bb2490e975c.mp3","assets/audio/clip-18cddcd5f142.mp3","assets/audio/clip-6d18b8859678.mp3"].map(src=>{const a=new Audio(src);a.preload='auto';a.loop=false;return a;});
function stopPeterEndingAudio(){peterEndingAudio.forEach(a=>{a.pause();a.currentTime=0;});}
function playPeterEndingAudio(b,index){prepareCorneredLipAudio();stopPeterEndingAudio();b.endingVoiceIndex=index;b.endingVoiceStart=b.endingTime;b.endingVoiceFailed=false;const a=peterEndingAudio[index];a.muted=muted;try{a.play()?.catch(()=>{if(corneredRooms?.finale===b&&b.endingVoiceIndex===index)b.endingVoiceFailed=true;});}catch(e){b.endingVoiceFailed=true;}}
function peterEndingAudioDone(b){const a=peterEndingAudio[b.endingVoiceIndex];if(!a)return true;a.muted=muted;const elapsed=b.endingTime-b.endingVoiceStart,duration=Number.isFinite(a.duration)&&a.duration>0?a.duration:30;return a.ended&&elapsed>.15||b.endingVoiceFailed&&elapsed>7||elapsed>duration+8;}
const peterEndingRant=[
 ['PETER CHAMBERS','You think this changes anything?'],
 ['PETER CHAMBERS','Look at you. One man on the floor, and you think you have saved the country. Josiah will still be there when you leave this room.'],
 ['PETER CHAMBERS','I signed his orders. I cleaned up his mistakes. I smiled while he took the credit, and you all mistook me for furniture.'],
 ['PETER CHAMBERS','Then he gave me power. His mistake was believing gratitude would keep me obedient. I was going to take everything from him.'],
 ['GARETH WILLIAMS','And Emma was supposed to pay for your ambition? She trusted you.'],
 ['PETER CHAMBERS','Trust? She married a tyrant. You served one. Spare me the outrage, Gareth. None of you gets to walk out of here clean.']
];
function startPeterEnding(){stopChambersTheme();const c=corneredRooms,b=c.finale;stopPeterKillTaunt();stopPeterFinaleVoice();b.phase='ending';b.endingLine=0;b.endingTime=0;b.endingAction=false;b.endingShot=false;b.stephenStops=gameProgress.stephenRescued===true&&!stephenIsDeceased();c.paused=false;keys.clear();$('roomsHUD').hidden=true;$('peterFightHUD').hidden=true;$('peterFinaleUI').hidden=false;if(b.warningRing){disposeCampObject(b.warningRing);b.warningRing=null;}for(const f of b.effects)disposeCampObject(f.obj);b.effects=[];b.enemy.position.set(0,.12,b.z-6);b.enemy.rotation.set(0,.3,1.12);b.enemy.userData.body.rotation.set(0,0,0);b.enemy.userData.arms.forEach(a=>a.rotation.set(0,0,0));b.blood=new THREE.Group();c.root.add(b.blood);b.blood.position.set(-.5,.02,b.z-5.7);for(let i=0;i<7;i++){const drop=ball(b.blood,.09+i*.025,.008,.08,mat(0x630b19),(i%3-.8)*.17,0,(i/3-.8)*.13);drop.visible=false;}b.bloodyLip=ball(b.enemy.userData.head,.055,.025,.022,mat(0x790e21),0,-.24,.33);b.hiddenPistol=finaleGun(b.enemy);b.hiddenPistol.parent.visible=false;c.companions.forEach((a,i)=>{a.flash.visible=false;a.actor.position.set(-5+i*2,0,b.z+2);a.actor.rotation.y=Math.PI;});showPeterEndingLine();document.exitPointerLock?.();}
function showPeterEndingLine(){const b=corneredRooms.finale,line=peterEndingRant[b.endingLine];$('peterFinaleSpeaker').textContent=line[0];$('peterFinaleLine').textContent=line[1];playPeterEndingAudio(b,b.endingLine);}
function advancePeterEnding(){const b=corneredRooms?.finale;if(!b||b.phase!=='ending'||b.endingAction)return;stopPeterEndingAudio();b.endingLine++;b.endingTime=0;if(b.endingLine<peterEndingRant.length){showPeterEndingLine();return;}b.endingAction=true;$('peterFinaleSpeaker').textContent='PETER CHAMBERS';$('peterFinaleLine').textContent='If I cannot take his throne… I can still take something he loves.';playPeterEndingAudio(b,6);}
function updatePeterEndingSpeakerShot(b,dt,action){
 const gareth=corneredRooms.companions.find(a=>a.name==='GARETH')?.actor;
 const speaking=b.endingVoiceIndex===4||b.endingVoiceIndex===8;
 const clip=peterEndingAudio[b.endingVoiceIndex];
 let cameraGoal=new THREE.Vector3(action?-4:-3.2,action?2.2:1.6,b.z+(action?-3:-2.7)),lookGoal=new THREE.Vector3(action?.7:-.6,action?1:.8,b.z+(action?-7:-6));
 if(gareth){if(!b.garethEndingMouth){b.garethEndingMouth=ball(gareth.userData.head,.075,.006,.009,new THREE.MeshBasicMaterial({color:0x281016}),0,-.223,.286);b.garethEndingMouth.visible=false;b.garethLipLevel=0;}
 let level=0;if(speaking&&clip&&!clip.paused&&!clip.ended&&!b.endingVoiceFailed){if(corneredAnalyser){corneredAnalyser.getByteTimeDomainData(corneredSamples);let sum=0;for(const v of corneredSamples)sum+=((v-128)/128)**2;level=Math.min(1,Math.sqrt(sum/corneredSamples.length)*8);}else level=.15+Math.abs(Math.sin(clip.currentTime*15))*.4;}
 b.garethLipLevel+=(level-b.garethLipLevel)*Math.min(1,dt*22);const open=level>.018&&b.garethLipLevel>.015;b.garethEndingMouth.visible=open;b.garethEndingMouth.scale.y=.006+b.garethLipLevel*.033;if(gareth.userData.mouth)gareth.userData.mouth.visible=!open;
 if(speaking){gareth.updateMatrixWorld(true);lookGoal=gareth.userData.head.getWorldPosition(new THREE.Vector3());lookGoal.y-=.12;cameraGoal=lookGoal.clone().add(new THREE.Vector3(.65,.12,-3.1).applyAxisAngle(new THREE.Vector3(0,1,0),gareth.rotation.y-Math.PI));}
 }
 const blend=1-Math.exp(-dt*4);camera.position.lerp(cameraGoal,blend);if(!b.endingLook)b.endingLook=new THREE.Vector3(-.6,.8,b.z-6);b.endingLook.lerp(lookGoal,blend);camera.lookAt(b.endingLook);
}
function renderPeterEnding(dt){const c=corneredRooms,b=c.finale;b.endingTime+=dt;const t=b.endingTime,u=b.enemy.userData;if(!b.endingAction){const cough=b.endingLine===0&&t<2.2;u.body.rotation.x=cough?Math.sin(t*19)*.075:Math.sin(c.time*2)*.015;u.head.rotation.x=cough?Math.sin(t*19)*.1:0;b.blood.children.forEach((o,i)=>o.visible=b.endingLine>0||t>.35+i*.2);if(u.openMouth){u.openMouth.visible=b.endingVoiceIndex!==4&&Math.sin(c.time*12)>.1;u.mouth.visible=!u.openMouth.visible;}updatePeterEndingSpeakerShot(b,dt,false);if(peterEndingAudioDone(b))advancePeterEnding();return;}
 updatePeterEndingSpeakerShot(b,dt,true);const gun=b.hiddenPistol.parent;gun.visible=t>1;u.arms[1].rotation.x=-Math.min(1.6,Math.max(0,t-1)*1.1);if(t>=2.8&&!b.endingShot&&peterEndingAudioDone(b)){b.endingShot=true;b.endingShotTime=t;playGunshot(.85);if(b.stephenStops){const a=c.companions.find(a=>a.name==='STEPHEN');if(a){a.actor.rotation.y=Math.atan2(b.enemy.position.x-a.actor.position.x,b.enemy.position.z-a.actor.position.z);a.actor.userData.arms[1].rotation.x=-1.5;a.flash.visible=true;peterFinaleTracer(a.actor.position.clone().add(new THREE.Vector3(0,1.5,0)),b.enemy.position.clone().add(new THREE.Vector3(0,.7,0)),0xffdf99);}gameProgress.peterKilledByStephen=true;gameProgress.emmaRescued=true;delete gameProgress.emmaShot;$('peterFinaleSpeaker').textContent='STEPHEN MARSH';$('peterFinaleLine').textContent='Not another step. Gareth, get Emma out of those restraints.';}else{b.hiddenPistol.visible=true;peterFinaleTracer(b.enemy.position.clone().add(new THREE.Vector3(0,.8,0)),b.emma.position.clone().add(new THREE.Vector3(0,1.2,0)),0xffdf99);ball(b.emma.userData.body,.16,.2,.035,mat(0x700e20),0,1.2,.23);gameProgress.emmaShot=true;gameProgress.emmaRescued=false;delete gameProgress.peterKilledByStephen;$('peterFinaleSpeaker').textContent='GARETH WILLIAMS';$('peterFinaleLine').textContent='Emma! Alissa, cover him! Mariah, help me!';}saveProgress();playPeterEndingAudio(b,b.stephenStops?7:8);}
 if(b.endingShot){const fall=Math.min(1,(t-b.endingShotTime)/1.1);if(b.stephenStops){b.enemy.rotation.z=1.12+fall*.43;u.head.rotation.x=.2;u.openMouth.visible=false;u.mouth.visible=true;if(t>4)b.ropes.visible=false;}else{b.emma.rotation.z=-fall*1.4;b.emma.position.y=-fall*.15;}for(const a of c.companions)a.flash.visible=false;b.hiddenPistol.visible=false;for(const f of b.effects){f.life-=dt;if(f.life<=0)disposeCampObject(f.obj);}b.effects=b.effects.filter(f=>f.life>0);}
 if(b.endingShot&&t-b.endingShotTime>3&&peterEndingAudioDone(b)){stopPeterEndingAudio();c.peterDefeated=true;gameProgress.peterDoor100Defeated=true;if(gameProgress.emmaShot===true&&!b.stephenStops){startJosiahBreakdown();return;}$('peterFinaleUI').hidden=true;finishCorneredRooms();}}

const josiahBreakdownAudio=["assets/audio/clip-899334074139.mp3","assets/audio/clip-67b8984a8247.mp3","assets/audio/clip-4d719aa5e05c.mp3","assets/audio/clip-86ce4e5fdfa3.mp3","assets/audio/clip-6fe045cbe8de.mp3"].map(src=>{const a=new Audio(src);a.preload='auto';a.loop=false;return a;});
function stopJosiahBreakdownAudio(){josiahBreakdownAudio.forEach(a=>{a.pause();a.currentTime=0;});}
function playJosiahBreakdownAudio(d){stopJosiahBreakdownAudio();d.voiceFailed=false;const a=josiahBreakdownAudio[d.line-1];if(!a)return;prepareCorneredLipAudio();a.muted=muted;try{a.play()?.catch(()=>{d.voiceFailed=true;});}catch(e){d.voiceFailed=true;}}
function josiahBreakdownAudioDone(d){const a=josiahBreakdownAudio[d.line-1];if(!a)return d.time>5;a.muted=muted;const duration=Number.isFinite(a.duration)&&a.duration>0?a.duration:30;return a.ended&&d.time>.2||d.voiceFailed&&d.time>7||d.time>duration+8;}
function poseJosiahGrieving(actor,active){const u=actor.userData;
 if(!active){if(u.grievingPose){u.arms.forEach((a,i)=>{a.visible=true;a.rotation.set(0,0,i?.09:-.09);});u.body.rotation.x=0;u.body.rotation.z=0;u.head.rotation.x=0;u.grievingPose=false;}if(u.cryingSleeves)u.cryingSleeves.visible=false;if(u.coveringHands)u.coveringHands.visible=false;return;}
 u.grievingPose=true;setSternJosiah(actor,true);u.body.rotation.x=.09;u.head.rotation.x=.15;u.body.rotation.z=Math.sin(clock*4)*.008;u.arms.forEach(a=>a.visible=false);
 if(!u.coveringHands){u.coveringHands=new THREE.Group();u.head.add(u.coveringHands);u.cryingSleeves=new THREE.Group();u.body.add(u.cryingSleeves);u.cryingSegments=[];
 for(const side of [-1,1]){const hand=new THREE.Group();u.coveringHands.add(hand);hand.position.set(side*.16,.025,.398);hand.rotation.z=-side*.09;
 ball(hand,.13,.145,.065,skin,0,0,0);for(let f=0;f<4;f++)ball(hand,.029,.105,.037,skin,(f-1.5)*.052,.11,.012);ball(hand,.052,.083,.045,skin,-side*.115,-.055,.01);
 const shoulder=new THREE.Vector3(side*.33,1.47,0),elbow=new THREE.Vector3(side*.55,1.61,.48);const upper=mesh(new THREE.CylinderGeometry(.125,.12,1,12),shirt,u.cryingSleeves),forearm=mesh(new THREE.CylinderGeometry(.105,.125,1,12),shirt,u.cryingSleeves);ball(u.cryingSleeves,.13,.13,.13,shirt,elbow.x,elbow.y,elbow.z);u.cryingSegments.push({hand,shoulder,elbow,upper,forearm});}
 }
 u.coveringHands.visible=u.cryingSleeves.visible=true;actor.updateMatrixWorld(true);
 for(const part of u.cryingSegments){const wrist=part.hand.localToWorld(new THREE.Vector3(0,-.10,0));u.body.worldToLocal(wrist);for(const [segment,from,to] of [[part.upper,part.shoulder,part.elbow],[part.forearm,part.elbow,wrist]]){const delta=to.clone().sub(from);segment.position.copy(from).add(to).multiplyScalar(.5);segment.scale.y=delta.length();segment.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());}}
}

const josiahBreakdownLines=[
 ['BRENT CROSS COMPLEX / LATER','The report arrives. Emma Richards is dead. Peter Chambers pulled the trigger.'],
 ['JOSIAH RICHARDS','No. Read it again. There has been a mistake. Emma was not supposed to be there.'],
 ['JOSIAH RICHARDS','Peter… I trusted you. I gave you everything. And you took her?'],
 ['JOSIAH RICHARDS','I can command every man in this building. I can seal every road in London. But I cannot… I cannot bring her back.'],
 ['JOSIAH RICHARDS','Emma. Please. Just tell me what to do. You always knew what to say.'],
 ['JOSIAH RICHARDS','Get out. All of you. Leave me alone.']
];
function startJosiahBreakdown(){const c=corneredRooms,b=c.finale;if(gameProgress.emmaShot!==true||b.stephenStops){$('peterFinaleUI').hidden=true;finishCorneredRooms();return;}stopPeterEndingAudio();stopPeterKillTaunt();c.root.children.forEach(o=>o.visible=false);world.visible=true;upperWorld.visible=false;flash.visible=false;scene.background.setHex(0x080408);scene.fog.color.setHex(0x100810);scene.fog.density=.0065;ambient.intensity=.25;cameraFill.intensity=.12;
 const actor=makeCharacter();c.root.add(actor);actor.position.set(138,0,112);actor.rotation.y=0;setSternJosiah(actor,true);const light=new THREE.PointLight(0xb7c8ea,20,18,1.5);light.position.set(138,4,114);c.root.add(light);const report=new THREE.Group();c.root.add(report);report.position.set(138.6,.025,112.7);box(report,.5,.015,.7,mat(0xc5bdad));for(let i=0;i<5;i++)box(report,.34,.005,.012,mat(0x38292f),0,.012,-.2+i*.08);const mouth=ball(actor.userData.head,.07,.006,.008,new THREE.MeshBasicMaterial({color:0x24101b}),.02,-.24,.33);mouth.visible=false;b.breakdown={actor,light,mouth,line:0,time:0,look:new THREE.Vector3(138,1.4,112)};b.phase='breakdown';syncMenuSong();camera.position.set(144,3.2,120);camera.lookAt(138,1.4,112);$('roomsHUD').hidden=true;$('peterFightHUD').hidden=true;$('peterFinaleUI').hidden=false;$('peterFinaleLocation').textContent='BRENT CROSS COMPLEX / AFTERMATH';keys.clear();showJosiahBreakdownLine();}
function showJosiahBreakdownLine(){const d=corneredRooms.finale.breakdown,line=josiahBreakdownLines[d.line];$('peterFinaleSpeaker').textContent=line[0];$('peterFinaleLine').textContent=line[1];playJosiahBreakdownAudio(d);}
function advanceJosiahBreakdown(){const c=corneredRooms,b=c?.finale,d=b?.breakdown;if(!d||b.phase!=='breakdown')return;stopJosiahBreakdownAudio();d.line++;d.time=0;if(d.line>=josiahBreakdownLines.length){d.mouth.visible=false;gameProgress.josiahBreakdownViewed=true;saveProgress();josiahGoneSong.pause();josiahGoneSong.currentTime=0;$('peterFinaleUI').hidden=true;finishCorneredRooms();return;}showJosiahBreakdownLine();}
function renderJosiahBreakdown(dt){const b=corneredRooms.finale,d=b.breakdown,a=d.actor,u=a.userData;d.time+=dt;const t=d.time,i=d.line;const collapse=i>=3?Math.min(1,t/2):0;a.position.y=-.65*collapse;u.body.rotation.x=i>=3?.22+.025*Math.sin(t*9):.035*Math.sin(t*4);u.head.rotation.x=i>=3?.35:.06*Math.sin(t*3);u.head.rotation.y=i===1?Math.sin(t*5)*.15:0;u.arms[0].rotation.x=i>=3?-2.3:i===2?-1.1:-.25;u.arms[1].rotation.x=i>=3?-2.3:i===2?-1.1:-.25;u.arms[0].rotation.z=i>=3?-.35:-.1;u.arms[1].rotation.z=i>=3?.35:.1;u.legs.forEach(l=>l.rotation.x=collapse*.7);const clip=josiahBreakdownAudio[i-1];let level=0;if(clip&&!clip.paused&&!clip.ended&&!d.voiceFailed){if(corneredAnalyser){corneredAnalyser.getByteTimeDomainData(corneredSamples);let sum=0;for(const n of corneredSamples)sum+=((n-128)/128)**2;level=Math.min(1,Math.sqrt(sum/corneredSamples.length)*8);}else level=.2+Math.abs(Math.sin(clip.currentTime*12))*.4;}d.mouth.visible=level>.02;d.mouth.scale.y=.006+level*.035;if(u.sternMouth)u.sternMouth.visible=!d.mouth.visible;
 const goal=i===0?new THREE.Vector3(143,3,119):i<3?new THREE.Vector3(139.3,2.5,115.2):new THREE.Vector3(136.5,1.6,115.4),look=new THREE.Vector3(138,i>=3?1.1:1.95,112);camera.position.lerp(goal,1-Math.exp(-dt*1.7));d.look.lerp(look,1-Math.exp(-dt*2));camera.lookAt(d.look);d.light.intensity=18+Math.sin(t*2)*.4;if(josiahBreakdownAudioDone(d))advanceJosiahBreakdown();}

function retryCorneredEncounter(){const c=corneredRooms;if(!c?.finale){startCorneredRooms();return;}const b=c.finale;mode='rooms';c.paused=false;b.phase='fight';b.tauntIndex=0;b.dodgeTime=0;b.dodgeCooldown=0;b.hitReaction=0;b.snaredUntil=0;triggerPeterCombatTaunt(b);b.hp=1000;b.playerHP=150;b.attack=3;b.windup=0;if(b.warningRing){disposeCampObject(b.warningRing);b.warningRing=null;}player.set(0,0,b.z+11);yaw=pitch=0;$('roomsEnd').hidden=true;$('roomsHUD').hidden=false;$('peterFightHUD').hidden=false;requestLock();}
document.addEventListener('mousedown',e=>{if(e.button===0&&e.target===$('world'))firePeterFinale();});

let corneredIntro=null;
function canOpenCorneredRat(){return gameProgress.brentCrossCompleted===true&&gameProgress.garethQuestCompleted===true&&gameProgress.civilDisobedienceSurvived===true;}
function clearCorneredIntro(){stopKevinAftermathVoice();stopCorneredVoice();if(!corneredIntro)return;disposeCampObject(corneredIntro.root);scene.background.copy(corneredIntro.background);scene.fog.color.copy(corneredIntro.fogColor);corneredIntro=null;$('corneredOverlay').hidden=true;$('corneredEnd').hidden=true;}
function startCorneredRat(){if(!chapterLoadingBypass)return loadChapterScreen('A CORNERED RAT',()=>startCorneredRat());
 if(!canOpenCorneredRat())return;clearParliamentCamp();clearCivilScene();clearCorneredIntro();setMode('cornered');for(const a of [subject,peter,alissa,gareth,stephen,elizabethMenu,kevinMenu,kevinRevealed])a.visible=false;world.visible=upperWorld.visible=exhibit.visible=false;
 const root=new THREE.Group();root.name='Cornered Rat / service passage';scene.add(root);const brick=mat(0x3e3438),stone=mat(0x554e51),iron=mat(0x1b2129);
 box(root,13,.3,32,mat(0x1b1c24),0,-.18,1);for(const s of [-1,1]){box(root,1,9,30,brick,s*6.5,4.5,1);for(let y=.3;y<9;y+=.45)box(root,.03,.025,30,stone,s*5.99,y,1);for(const z of [-10,-4,2,8]){box(root,.08,1.7,1.2,iron,s*5.97,5.5,z);box(root,.13,.07,1.4,stone,s*5.9,4.6,z);}box(root,.16,8,.16,iron,s*5.8,4,-11);}
 box(root,13,7,.6,brick,0,3.5,-12);box(root,2.3,3.4,.15,iron,0,1.7,-11.65);for(let y=.6;y<3.3;y+=.65)box(root,2.1,.10,.04,stone,0,y,-11.55);
 for(const [x,z] of [[-4,-8],[4,-5],[-4,3]]){box(root,1.4,1.2,1.3,mat(0x343c35),x,.6,z);box(root,1.5,.12,1.4,iron,x,1.25,z);}
 for(const z of [-10,1,11]){box(root,.8,.15,.4,iron,0,5,z);const l=new THREE.PointLight(z===-10?0xad3450:0xb5c5db,16,15,1.8);l.position.set(0,4.6,z);root.add(l);}
 const cast={kevin:makeRevealedKevin(),gareth:makeGareth(),alissa:makeAlissa()};if(gameProgress.stephenRescued===true&&!stephenIsDeceased())cast.stephen=makeStephen();
 for(const a of Object.values(cast))root.add(a);cast.kevin.position.set(0,0,-9.4);cast.gareth.position.set(-1.2,0,-4.5);cast.gareth.rotation.y=Math.PI;cast.alissa.position.set(1.6,0,-3.8);cast.alissa.rotation.y=Math.PI;if(cast.stephen){cast.stephen.position.set(-2.4,0,-2.6);cast.stephen.rotation.y=Math.PI;}
 const lines=[['KEVIN MURDERHORN','You followed me all this way. Still trying to correct your paperwork, Gareth?','kevin'],['GARETH WILLIAMS','That mistake cost people their lives. You don’t get to hide behind it anymore.','gareth'],['ALISSA ROBERTS','Peter’s gone. We’re not chasing him. You’re the one answering our questions.','alissa'],['KEVIN MURDERHORN','You think a locked door and a few guns make me yours?','kevin'],[cast.stephen?'STEPHEN MARSH':'GARETH WILLIAMS',cast.stephen?'No more running, Murderhorn. Keep your hands where we can see them.':'The passage is sealed. There’s nowhere left to run.',cast.stephen?'stephen':'gareth'],['GARETH WILLIAMS','The mask is gone, Kevin. Tell us what you’re doing here—and who sent you.','gareth'],['KEVIN MURDERHORN','Careful. A cornered rat still has teeth.','kevin']];
 corneredIntro={root,cast,lines,time:0,index:-1,background:scene.background.clone(),fogColor:scene.fog.color.clone()};scene.background.setHex(0x06060c);scene.fog.color.setHex(0x100a15);scene.fog.density=.025;ambient.intensity=.45;flash.visible=false;cameraFill.intensity=.16;keys.clear();document.exitPointerLock?.();$('corneredOverlay').hidden=false;$('corneredEnd').hidden=true;gameProgress.corneredRatStarted=true;saveProgress();renderCorneredIntro(0);
}
function renderCorneredIntro(dt){const c=corneredIntro;if(!c)return;if(c.aftermath){renderSovereignAftermath(dt);return;}if(c.hospital){renderCorneredHospital(dt);return;}c.time+=dt;if(!tickCorneredVoice(c,dt))return;updateCorneredLips(c,dt);const index=c.index,line=c.lines[index],speaker=c.cast[line[2]];for(const [name,a] of Object.entries(c.cast)){animateCharacter(c.time,false,false,a);if(name==='kevin'){a.userData.body.rotation.x=.11;a.userData.arms[0].rotation.x=-.45;}if(a===speaker)a.userData.head.rotation.x=Math.sin(c.time*3)*.025;}
 $('corneredSpeaker').textContent=line[0];$('corneredLine').textContent=line[1];
 if(line[2]==='kevin'){camera.position.set(1.3,1.85,-6.1);camera.lookAt(0,1.65,-9.4);}else{camera.position.set(-.1,1.85,-7.4);camera.lookAt(speaker.position.x,1.7,speaker.position.z);}camera.updateMatrixWorld(true);const clip=currentCorneredClip(c),length=clip&&Number.isFinite(clip.duration)&&clip.duration>0?clip.duration:6;$('corneredProgress').style.width=Math.min(100,(index+Math.min(1,(c.lineElapsed||0)/length))/c.lines.length*100)+'%';
}
function finishCorneredIntro(){if(!corneredIntro||mode!=='cornered')return;if(!corneredIntro.hospital){startCorneredHospital();return;}if(!corneredIntro.aftermath){startSovereignAftermath();return;}stopKevinAftermathVoice();stopCorneredVoice();gameProgress.josiahWrathful=true;gameProgress.corneredRatIntroViewed=true;saveProgress();startCorneredRooms();}

let parliamentCamp=null;
function detailedCampTent(parent,x,z,color,obstacles){
 const tent=new THREE.Group();parent.add(tent);tent.position.set(x,0,z);tent.name='Canvas field tent';
 const fabric=mat(color),rope=mat(0xb5a887),metal=mat(0x383c3d),dark=mat(0x171c19);
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute([
 -2.2,.12,-2.4,0,2.6,-2.4,0,2.6,2.4, -2.2,.12,-2.4,0,2.6,2.4,-2.2,.12,2.4,
 0,2.6,-2.4,2.2,.12,-2.4,2.2,.12,2.4, 0,2.6,-2.4,2.2,.12,2.4,0,2.6,2.4,
 -2.2,.12,-2.4,2.2,.12,-2.4,0,2.6,-2.4],3));geometry.computeVertexNormals();fabric.side=THREE.DoubleSide;tent.add(new THREE.Mesh(geometry,fabric));
 box(tent,4.3,.06,4.7,dark,0,.13,0);
 // Open front flap reveals bedding and a rucksack rather than a painted doorway.
 for(const s of [-1,1]){line3(tent,[[s*2.2,.14,2.4],[0,2.6,2.4]],rope,.025);line3(tent,[[s*1.6,.82,2.2],[s*3,.08,3.1]],rope,.018);box(tent,.07,.35,.07,metal,s*3,.14,3.1);const roll=ball(tent,.47,.12,1.2,mat(0x74705c),s*.8,.3,-.1);box(tent,.75,.1,.32,mat(0xa5987c),s*.8,.42,-1.1);}
 for(let z=-2;z<=2;z+=1)line3(tent,[[-2.15,.16,z],[0,2.61,z],[2.15,.16,z]],rope,.009);
 box(tent,.07,2.6,.07,metal,0,1.3,-2.3);ball(tent,.3,.43,.22,mat(0x333c31),1.5,.6,1);box(tent,.4,.3,.35,mat(0x393d35),-1.5,.32,1.6);
 obstacles.push([x-2.35,z-2.5,x+2.35,z+2.5]);
}
function addParliamentCampDetail(root,obstacles,palace,port,tower){
 const stone=mat(0x9e8a6b),trim=mat(0xb7a27d),iron=mat(0x20282b),wood=mat(0x68513a),tan=mat(0x8e805f),dark=mat(0x2a3030);
 // Repeated facade details share instanced geometry to keep the square responsive.
 function instances(parent,material,items){const batch=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),material,items.length),o=new THREE.Object3D();items.forEach((a,i)=>{o.position.set(a[0],a[1],a[2]);o.scale.set(a[3],a[4],a[5]);o.rotation.set(0,0,0);o.updateMatrix();batch.setMatrixAt(i,o.matrix);});parent.add(batch);return batch;}
 const masonry=[];for(let y=.5;y<15;y+=.75)for(let x=-26;x<38;x+=2.2)masonry.push([x+(y%1.5?.5:0),y,6.04,2.1,.018,.025]);instances(palace,dark,masonry);
 const tracery=[];for(let x=-26.3;x<38;x+=2.2)for(const y of [3.3,7.1,11.2]){for(const dx of [-.4,0,.4])tracery.push([x+dx,y,6.19,.055,2.5,.09]);tracery.push([x,y-.9,6.2,1.1,.07,.12]);const arch=[];for(let n=0;n<=12;n++)arch.push([x+Math.cos(n*Math.PI/12)*.57,y+.75+Math.sin(n*Math.PI/12)*.72,6.23]);line3(palace,arch,trim,.045);}instances(palace,trim,tracery);
 for(let x=-26;x<38;x+=4.4){box(palace,.8,.5,1,trim,x,15.7,6);mesh(new THREE.ConeGeometry(.4,2.8,6),stone,palace,x,19.3,6.4);}
 for(const side of [-1,1])for(let y=2;y<23;y+=2.2){box(tower,.65,1.4,.07,dark,side*1.25,y,3.18);box(tower,.07,1.4,.1,trim,side*1.25,y,3.24);}
 for(const x of [-2.6,2.6])for(const z of [-2.6,2.6]){box(tower,.3,5,.3,trim,x,33,z);mesh(new THREE.ConeGeometry(.45,3.5,4),stone,tower,x,37,z);}
 const bays=[];for(let x=-12;x<=12;x+=2.4)for(let y=3;y<17;y+=2.8){bays.push([x,y,10.7,.08,2,.08]);bays.push([x,y,10.7,1.55,.07,.08]);}instances(port,trim,bays);
 for(let x=-12;x<=12;x+=2.4){const arch=[];for(let i=0;i<=16;i++)arch.push([x+Math.cos(i*Math.PI/16)*.95,1.6+Math.sin(i*Math.PI/16)*1.2,10.85]);line3(port,arch,trim,.10);}
 for(const x of [-10,-5,0,5,10])for(const z of [-5,5])for(let y=25.8;y<27.2;y+=.3)box(port,1.15,.07,1.15,stone,x,y,z);
 // Kerbs, paving joints, drains and road markings define the edge of the square.
 const slabs=[];for(let x=-23;x<=23;x+=1.25)for(let z=-10;z<=34;z+=1.25)if(Math.abs(x)>20||z<-8||z>30)slabs.push([x,.105,z,1.2,.035,1.2]);instances(root,mat(0x8a8c82),slabs);
 for(let x=-24;x<24;x+=2){box(root,1.96,.22,.35,stone,x,.1,-11.5);box(root,1.96,.22,.35,stone,x,.1,35);}
 for(const z of [-12.3,-12.55])box(root,49,.025,.05,mat(0xc2ab40),0,-.08,z);
 for(const x of [-19,19]){box(root,1.1,.035,.6,iron,x,.14,-9);for(let i=0;i<9;i++)box(root,.04,.04,.6,stone,x-.48+i*.12,.165,-9);}
 for(let x=-20;x<=20;x+=5)box(root,2,.035,.13,mat(0xc4c0aa),x,-.1,-15.1);
 // Sandbagged camp entrances and warning lamps.
 for(const x of [-18,18]){for(let row=0;row<3;row++)for(let i=0;i<4;i++)ball(root,.57,.17,.3,tan,x+i*.9+(row%2)*.25,.25+row*.3,-5);obstacles.push([x-.6,-5.5,x+3.8,-4.5]);}
 for(const x of [-7,-3,3,7]){box(root,.12,1.65,.12,iron,x,.82,-10.5);ball(root,.15,.13,.15,new THREE.MeshBasicMaterial({color:0xff9d35}),x,1.75,-10.5);}
 for(const x of [-20,20])for(const z of [5,22]){for(let plank=0;plank<4;plank++)box(root,.13,.07,2,wood,x-.25+plank*.16,.62,z);for(const dz of [-.75,.75])box(root,.5,.6,.07,iron,x,.3,z+dz);box(root,.09,.65,2,wood,x+.4,.95,z);obstacles.push([x-.5,z-1.1,x+.6,z+1.1]);}
 // Memorial plinth and bronze figure on the square's edge.
 box(root,1.8,1.4,1.8,stone,-18,.7,30);box(root,2.1,.2,2.1,trim,-18,1.5,30);const bronze=mat(0x343b30,.6);ball(root,.32,.65,.25,bronze,-18,2.3,30);ball(root,.21,.27,.2,bronze,-18,3.1,30);for(const s of [-1,1])box(root,.18,.7,.21,bronze,-18+s*.18,1.8,30);obstacles.push([-19.2,28.8,-16.8,31.2]);
 // Bare London trees frame the view without obscuring the tower.
 for(const [x,z] of [[-23,3],[23,28],[-22,34],[24,-3]]){line3(root,[[x,0,z],[x+.15,3,z],[x-.1,7,z]],wood,.18);for(let i=0;i<7;i++){const a=i*2.4;line3(root,[[x,2.8+i*.4,z],[x+Math.cos(a)*1.5,5+i*.3,z+Math.sin(a)],[x+Math.cos(a)*2.8,6.7+i*.2,z+Math.sin(a)*1.8]],wood,.045);}obstacles.push([x-.4,z-.4,x+.4,z+.4]);}
 // Camp equipment: water, medical supplies, radios, cables and a cooking area.
 for(const [x,z] of [[-6,6],[6,19],[-5,26]]){for(const side of [-1,1]){box(root,.07,.9,1.04,iron,x+side*.55,.45,z);box(root,1.55,.06,1.04,iron,x,.75,z);}for(let i=0;i<3;i++){mesh(new THREE.CylinderGeometry(.15,.15,.42,12),mat(0x758f98),root,x-.4+i*.4,1.1,z);box(root,.12,.03,.12,iron,x-.4+i*.4,1.33,z);}}
 box(root,.75,.45,.3,iron,.9,1.37,9);box(root,.26,.16,.03,mat(0x799665),.76,1.4,9.16);line3(root,[[1.1,1.6,9],[1.18,2.3,9]],iron,.013);for(let i=0;i<4;i++)ball(root,.035,.035,.02,mat(0xbbb8a5),1+i*.08,1.25,9.17);
 for(let i=0;i<5;i++){const paper=box(root,.3,.006,.4,mat(0xcdc5ae),-.5+i*.2,1.125,8.8+Math.sin(i)*.2);paper.rotation.y=i*.5;}line3(root,[[-.7,1.13,8.7],[0,1.13,9.3],[.5,1.13,8.8]],mat(0x983438),.012);
 const medical=box(root,.8,.55,.5,mat(0xc6bea8),-2.4,.3,10);box(root,.35,.1,.025,mat(0xa33435),-2.4,.34,10.26);box(root,.1,.35,.025,mat(0xa33435),-2.4,.34,10.26);
 mesh(new THREE.CylinderGeometry(.48,.4,.8,14),iron,root,5,.5,5);const ember=ball(root,.34,.06,.34,new THREE.MeshBasicMaterial({color:0xdc7030}),5,.91,5);obstacles.push([4.4,4.4,5.6,5.6]);
 for(const z of [4.4,5.6])box(root,1.5,.08,.08,iron,5,1,z);mesh(new THREE.CylinderGeometry(.24,.24,.27,12),mat(0x737b7e),root,5,1.17,5);
 line3(root,[[-13,.17,15.5],[-8,.17,17],[1,.17,17],[3,.17,10],[1,.17,9]],iron,.018);
 // Small repeated leaves and worn gravel remain low-cost instanced details.
 const debris=[];for(let i=0;i<180;i++){const x=Math.sin(i*12.989)*19,z=11+Math.cos(i*7.31)*18;debris.push([x,.155,z,.05+(i%3)*.025,.009,.09]);}instances(root,mat(0x877350),debris);
 return root;
}

function addCampGovernmentStreet(root){
 const street=new THREE.Group();street.name='Government street / reference backdrop';root.add(street);street.position.set(0,0,57);
 const stone=mat(0x8b877d),trim=mat(0xb8ae96),glass=mat(0x243038),roof=mat(0x393e40),iron=mat(0x161c22);
 box(street,21,.1,76,mat(0x20242b),0,-.08,19);for(const s of [-1,1]){box(street,4,.2,76,mat(0x686764),s*12,.02,19);for(let z=-15;z<52;z+=6)box(street,.10,.012,2.4,trim,s*1.4,.01,z);}
 for(const s of [-1,1])for(let wing=0;wing<3;wing++){
  const block=new THREE.Group();street.add(block);block.position.set(s*24,0,-7+wing*22);block.rotation.y=s*Math.PI/2;
  box(block,22,20,13,stone,0,10,0);for(const y of [1.1,4.7,9.4,14.1,19.4,20.2])box(block,22.6,.35,13.5,trim,0,y,0);
  for(let y=.4;y<4.5;y+=.5)for(let x=-10.5;x<11;x+=1.5)box(block,1.42,.045,.06,roof,x,y,6.54);
  for(let x=-9;x<=9;x+=3){for(const y of [2.6,7,11.7,16.3]){box(block,1.5,2.7,.10,glass,x,y,6.56);for(const dx of [-.85,.85])box(block,.18,3,.3,trim,x+dx,y,6.7);box(block,1.95,.20,.45,trim,x,y-1.5,6.7);box(block,1.95,.21,.4,trim,x,y+1.5,6.7);box(block,.075,2.7,.13,trim,x,y,6.7);box(block,1.5,.08,.13,trim,x,y,6.7);
    if(y===7||y===11.7){const pediment=mesh(new THREE.ConeGeometry(1.22,.8,3),trim,block,x,y+2,6.7);pediment.rotation.y=Math.PI;pediment.scale.z=.22;}
   }box(block,.24,1,.24,trim,x,20.9,6.6);ball(block,.24,.24,.24,trim,x,21.5,6.6);}
  if(s===1&&wing===0){for(let x=-7.5;x<=7.5;x+=3){mesh(new THREE.CylinderGeometry(.3,.4,9,12),trim,block,x,10,7.5);box(block,.95,.35,.95,trim,x,5.5,7.5);box(block,.85,.35,.85,trim,x,14.5,7.5);}box(block,18,.6,2.1,trim,0,15,7.2);const pediment=mesh(new THREE.ConeGeometry(10,4,3),trim,block,0,17,7.3);pediment.scale.z=.13;pediment.rotation.y=Math.PI;}
  for(let x=-10;x<11;x+=.7)box(block,.1,1,.1,iron,x,.5,7.7);
 }
 for(const s of [-1,1])for(let z=-15;z<52;z+=14){box(street,.12,5,.12,iron,s*10.2,2.5,z);box(street,.48,.7,.48,iron,s*10.2,5,z);box(street,.32,.48,.32,new THREE.MeshBasicMaterial({color:0xa3906f}),s*10.2,5,z);}
 // Geometric Union flag on an angled pole, matching the right-hand facade reference.
 const flag=new THREE.Group();street.add(flag);flag.position.set(-15,10,-10);flag.rotation.y=.35;
 line3(flag,[[0,0,0],[2.6,1.6,0]],trim,.05);box(flag,2.2,1.35,.025,mat(0x152a50),2.5,.72,0);
 for(const tilt of [-.55,.55]){const stripe=box(flag,2.5,.18,.035,mat(0xc8c6b9),2.5,.72,.025);stripe.rotation.z=tilt;}
 box(flag,.36,1.35,.04,trim,2.5,.72,.04);box(flag,2.2,.34,.04,trim,2.5,.72,.04);box(flag,.19,1.35,.05,mat(0x962c3d),2.5,.72,.06);box(flag,2.2,.18,.05,mat(0x962c3d),2.5,.72,.06);
 return street;
}


function expandParliamentGround(root,obstacles){
 const stone=mat(0x56545a),iron=mat(0x24272c),asphalt=mat(0x22252a),concrete=mat(0x777570),red=mat(0x651b27);
 box(root,78,.35,130,asphalt,0,-.32,49);box(root,64,.18,48,stone,0,-.06,13);
 // Wider perimeter pavements link the square to the government street.
 for(const s of [-1,1])box(root,5,.20,73,stone,s*11.5,-.025,73);
 for(let z=39;z<107;z+=6)box(root,.12,.02,2.7,concrete,0,.02,z);
 function cover(x,z,w,d,h,color){box(root,w,h,d,color,x,h/2,z);obstacles.push([x-w/2,z-d/2,x+w/2,z+d/2]);}
 for(const [x,z] of [[-27,4],[27,20],[-27,29],[27,-5],[-7,46],[7,66],[-7,85],[7,98]]){cover(x,z,3.6,1,1.15,concrete);for(let i=-1;i<=1;i++){const band=box(root,.22,1.05,.02,red,x+i,.6,z+.51);band.rotation.z=-.3;}}
 function car(x,z,color){const a=new THREE.Group();root.add(a);a.position.set(x,0,z);box(a,1.9,.65,4.1,color,0,.65,0);box(a,1.6,.65,2.1,mat(0x26333e),0,1.28,-.2);for(const s of [-1,1])for(const t of [-1,1]){const wheel=mesh(new THREE.CylinderGeometry(.34,.34,.21,12),iron,a,s*.94,.36,t*1.35);wheel.rotation.z=Math.PI/2;}obstacles.push([x-1.05,z-2.2,x+1.05,z+2.2]);}
 car(-6,57,mat(0x323d47));car(6,79,mat(0x452b32));car(-5,100,mat(0x3d4035));
 // A red double-decker provides a recognisable landmark and substantial cover.
 const bus=new THREE.Group();root.add(bus);bus.position.set(7,0,51);box(bus,2.5,3.8,9,red,0,2.1,0);for(const s of [-1,1])for(let z=-3.6;z<=3.6;z+=1.2)for(const y of [1.8,3.2])box(bus,.03,.8,.95,mat(0x172732),s*1.26,y,z);box(bus,2.1,.9,.04,mat(0x1d2c35),0,3.1,-4.51);for(const s of [-1,1])for(const z of [-2.8,2.8]){const wheel=mesh(new THREE.CylinderGeometry(.48,.48,.24,12),iron,bus,s*1.22,.48,z);wheel.rotation.z=Math.PI/2;}obstacles.push([5.6,46.3,8.4,55.7]);
 for(const s of [-1,1]){for(let z=-10;z<=38;z+=2){box(root,.06,2,.06,iron,s*33,1,z);}box(root,.07,.08,48,iron,s*33,1.65,14);for(let z=39;z<110;z+=2)box(root,.06,2,.06,iron,s*14.7,1,z);box(root,.07,.08,72,iron,s*14.7,1.6,74);}
 for(let x=-14;x<=14;x+=3.5)cover(x,110,3.2,1.2,1.5,concrete);
 for(const s of [-1,1])for(const z of [40,63,87,106]){box(root,.12,5,.12,iron,s*12.6,2.5,z);ball(root,.23,.32,.23,new THREE.MeshBasicMaterial({color:0xffd39a}),s*12.6,5,z);const light=new THREE.PointLight(0xffd49a,12,14,1.6);light.position.set(s*12.6,4.7,z);root.add(light);}
}

function makeParliamentCamp(){
 const grassTexture=new THREE.TextureLoader().load(parliamentGrassData);grassTexture.colorSpace=THREE.SRGBColorSpace;grassTexture.wrapS=grassTexture.wrapT=THREE.RepeatWrapping;grassTexture.repeat.set(8,8);grassTexture.anisotropy=HD_ANISOTROPY;
 const root=new THREE.Group(),obstacles=[],stone=mat(0xa59271),roof=mat(0x3c4446),glass=mat(0x31444d),iron=mat(0x202a2c),grass=new THREE.MeshStandardMaterial({map:grassTexture,color:0x829382,roughness:1}),paving=mat(0x747b76);
 box(root,180,.4,150,mat(0x343d3c),0,-.35,0);box(root,48,.22,46,paving,0,-.03,11);box(root,40,.24,38,grass,0,.01,11);
 // Palace facade and Elizabeth Tower sit beyond the inaccessible eastern road.
 const palace=new THREE.Group();root.add(palace);palace.position.set(18,0,-36);
 box(palace,66,15,12,stone,5,7.5,0);box(palace,66,1,13,roof,5,15.2,0);
 for(let x=-27;x<39;x+=2.2){box(palace,.24,18,.55,stone,x,9,6.4);for(const y of [3.3,7.1,11.2]){box(palace,1.05,2.5,.10,glass,x+.72,y,6.07);box(palace,.09,2.6,.14,stone,x+.72,y,6.15);}mesh(new THREE.ConeGeometry(.42,2.2,4),stone,palace,x,18.7,6.4);}
 for(const y of [5.2,9,13.3])box(palace,66,.28,.55,stone,5,y,6.3);
 const tower=new THREE.Group();palace.add(tower);tower.position.set(-28,0,0);box(tower,6,32,6,stone,0,16,0);
 for(const x of [-2.7,-1.8,-.9,0,.9,1.8,2.7])box(tower,.12,24,.18,roof,x,12,3.08);
 for(const y of [23,27,30,32])box(tower,6.6,.4,6.6,stone,0,y,0);
 const faceMat=new THREE.MeshBasicMaterial({color:0xe3debf});
 for(let side=0;side<4;side++){const face=new THREE.Group();face.rotation.y=side*Math.PI/2;tower.add(face);mesh(new THREE.CircleGeometry(2.1,48),faceMat,face,0,27,3.22);const rim=new THREE.Mesh(new THREE.TorusGeometry(2.12,.12,8,48),roof);rim.position.set(0,27,3.25);face.add(rim);for(let i=0;i<12;i++){const tick=box(face,.09,.28,.04,iron,Math.sin(i*TAU/12)*1.78,27+Math.cos(i*TAU/12)*1.78,3.29);tick.rotation.z=-i*TAU/12;}line3(face,[[0,28.5,3.32],[0,27,3.32],[1.1,26.8,3.32]],iron,.065);}
 box(tower,4.5,4,4.5,stone,0,34,0);mesh(new THREE.ConeGeometry(4.1,9,4),roof,tower,0,40,0);mesh(new THREE.ConeGeometry(.3,3,6),iron,tower,0,46,0);
 // Portcullis House: regular window bays, pitched roof and tall ventilation stacks.
 const port=new THREE.Group();root.add(port);port.position.set(-42,0,-25);box(port,26,17,21,stone,0,8.5,0);
 for(let x=-12;x<=12;x+=2.4)for(let y=3;y<17;y+=2.8){box(port,1.55,2,.1,glass,x,y,10.56);box(port,.17,17,.25,roof,x-1,8.5,10.7);}
 const portRoof=mesh(new THREE.CylinderGeometry(8,18,7,4),roof,port,0,20.4,0);portRoof.rotation.y=Math.PI/4;portRoof.scale.z=.85;
 for(const x of [-10,-5,0,5,10])for(const z of [-5,5]){box(port,.9,5,.9,roof,x,25,z);box(port,1.5,.35,1.5,iron,x,27.5,z);}
 // Continuous railings, closed gates and concrete blocks prevent access to Parliament.
 for(let x=-65;x<=65;x+=1.1){box(root,.07,3,.07,iron,x,1.5,-17);mesh(new THREE.ConeGeometry(.10,.3,5),iron,root,x,3.1,-17);}
 for(const y of [.45,2.5])box(root,132,.08,.1,iron,0,y,-17);
 for(let x=-60;x<=60;x+=12){box(root,.8,3.5,.8,stone,x,1.7,-17);box(root,1.1,.25,1.1,stone,x,3.5,-17);}
 for(let x=-8;x<=8;x+=4)box(root,3.2,1.1,1.1,mat(0x7b7970),x,.55,-13);
 function tent(x,z,color){detailedCampTent(root,x,z,color,obstacles);}

 for(const [x,z,c] of [[-13,1,0x59664a],[12,2,0x64523b],[-13,13,0x445f68],[12,14,0x676342],[-10,25,0x50583c],[9,26,0x685543]])tent(x,z,c);
 for(const [x,z] of [[-6,6],[6,19],[-5,26]]){box(root,1.5,.85,1,mat(0x64503c),x,.43,z);box(root,1,.65,.8,mat(0x484f45),x+1.8,.33,z);obstacles.push([x-.8,z-.6,x+2.4,z+.6]);}
 const table=new THREE.Group();root.add(table);table.position.set(0,0,9);box(table,3,.15,1.5,mat(0x69503b),0,1,0);for(const x of [-1.3,1.3])for(const z of [-.6,.6])box(table,.1,1,.1,iron,x,.5,z);box(table,1.8,.025,.9,mat(0xd1c6a2),0,1.09,0);obstacles.push([-1.6,8.1,1.6,9.9]);
 for(const x of [-22,22])for(const z of [-8,12,32]){box(root,.13,5,.13,iron,x,2.5,z);ball(root,.22,.35,.22,new THREE.MeshBasicMaterial({color:0xffe5a9}),x,5,z);const lamp=new THREE.PointLight(0xffd49a,14,16,1.6);lamp.position.set(x,4.8,z);root.add(lamp);}
 const moonlight=new THREE.DirectionalLight(0x667c96,.7);moonlight.position.set(-20,50,20);root.add(moonlight);
 addParliamentCampDetail(root,obstacles,palace,port,tower);addCampGovernmentStreet(root);expandParliamentGround(root,obstacles);root.updateMatrixWorld(true);return {root,obstacles};
}
function clearParliamentCamp(){if(!parliamentCamp)return;for(const entry of parliamentCamp.battle?.reveal?.speechMouths||[]){disposeCampObject(entry.m);entry.closed.visible=true;}clearCampSurvival();for(const entry of parliamentCamp.allies||[]){entry.actor.visible=false;entry.actor.position.copy(entry.position);entry.actor.rotation.copy(entry.rotation);}scene.remove(parliamentCamp.root);parliamentCamp.root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(o.material.map)o.material.map.dispose();o.material.dispose();}});scene.background.copy(parliamentCamp.background);scene.fog.color.copy(parliamentCamp.fogColor);parliamentCamp=null;$('campHUD').hidden=true;}
function startParliamentCamp(){if(!canOpenCivil())return;clearCivilScene();clearCarChase();clearBossBattle();clearParliamentCamp();setMode('camp');for(const a of [subject,peter,alissa,gareth,stephen])a.visible=false;world.visible=upperWorld.visible=exhibit.visible=false;const built=makeParliamentCamp();parliamentCamp={...built,background:scene.background.clone(),fogColor:scene.fog.color.clone()};scene.add(built.root);scene.background.setHex(0x07080d);scene.fog.color.setHex(0x0b0b12);scene.fog.density=.014;ambient.intensity=.34;flash.visible=true;flash.intensity=24;cameraFill.intensity=.14;parliamentCamp.time=0;parliamentCamp.lamps=[];built.root.traverse(o=>{if(o.isPointLight)parliamentCamp.lamps.push(o);});setupCampAllies();startCampSurvival();player.set(0,0,31);yaw=0;pitch=.03;keys.clear();$('campHUD').hidden=false;renderParliamentCamp(0);}

function makePSRMSoldier(){
 const root=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group(),arms=[],legs=[];root.name='PSRM militia';root.add(body);body.add(head);head.position.y=2.04;
 const camo=mat(0x343931),dark=mat(0x151b1c),patch=mat(0x565448),brown=mat(0x483c36),metal=mat(0x30393b,.55),lens=mat(0x060e13,.65);
 box(body,.59,.69,.36,camo,0,1.22,0);box(body,.52,.57,.13,dark,0,1.26,.24);box(body,.55,.075,.4,dark,0,.88,0);
 for(const s of [-1,1]){const arm=new THREE.Group();body.add(arm);arm.position.set(s*.36,1.5,0);ball(arm,.13,.31,.14,camo,0,-.27,0);ball(arm,.115,.12,.12,dark,0,-.61,0);arms.push(arm);const leg=new THREE.Group();root.add(leg);leg.position.set(s*.16,.82,0);box(leg,.25,.68,.29,camo,0,-.33,0);box(leg,.2,.19,.065,dark,0,-.32,.17);ball(leg,.15,.11,.25,dark,0,-.73,.07);legs.push(leg);box(body,.11,.33,.065,patch,s*.21,1.28,.325);box(body,.14,.23,.1,brown,s*.34,.95,0);}
 for(let i=0;i<4;i++){box(body,.09,.22,.08,patch,-.16+i*.11,1.08,.34);box(body,.07,.04,.02,metal,-.16+i*.11,1.19,.39);}
 for(let i=0;i<18;i++){const s=i%2?1:-1;const piece=box(i<10?body:legs[i%2],.10,.09,.012,i%3?brown:patch,i<10?s*(.09+(i%3)*.075):s*.045,i<10?1+(i%5)*.11:-.1-(i%4)*.14,i<10?.19:.151);piece.rotation.z=i*.7;}
 ball(head,.285,.34,.25,dark,0,0,0);const cap=mesh(new THREE.SphereGeometry(.3,12,8,0,TAU,0,Math.PI/2),camo,head,0,.12,0);cap.scale.y=.65;box(head,.48,.055,.32,camo,0,.15,.14);
 ball(head,.25,.105,.06,metal,0,.03,.226);ball(head,.215,.068,.065,lens,0,.04,.263);box(head,.28,.24,.10,metal,0,-.18,.24);
 for(let i=-2;i<=2;i++)box(head,.025,.13,.014,dark,i*.046,-.18,.3);
 const label=sign('PSRM','#c8c8b9','#192021',.37);label.position.set(0,1.47,.322);body.add(label);
 const rifle=new THREE.Group();body.add(rifle);rifle.position.set(.07,1.15,.47);box(rifle,.12,.16,.64,dark,0,0,0);box(rifle,.06,.065,.37,metal,0,.015,.46);box(rifle,.10,.22,.12,dark,0,-.16,-.06);box(rifle,.13,.15,.24,brown,0,0,-.40);box(rifle,.045,.07,.09,metal,0,.11,.19);
 const muzzle=ball(rifle,.075,.075,.15,new THREE.MeshBasicMaterial({color:0xffc75f}),0,.01,.69);muzzle.visible=false;
 root.userData={body,head,arms,legs,muzzle,rifle};return root;
}
function disposeCampObject(root){if(!root)return;root.removeFromParent();const gs=new Set(),ms=new Set();root.traverse(o=>{if(o.geometry)gs.add(o.geometry);if(o.material)for(const m of [].concat(o.material))ms.add(m);});gs.forEach(g=>g.dispose());ms.forEach(m=>{m.map?.dispose();m.dispose();});}
function makeCampNinja(){
 const root=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group(),arms=[],legs=[];root.name='Masked swordsman';root.add(body);body.add(head);head.position.y=2.04;
 const cloth=mat(0x242a31),dark=mat(0x10151b),wrap=mat(0x42474b),skin=mat(0xc5ac8a),steel=mat(0xa3afb3,.75);
 ball(body,.32,.43,.21,cloth,0,1.21,0);for(const s of [-1,1]){const lapel=box(body,.12,.55,.045,wrap,s*.1,1.29,.22);lapel.rotation.z=s*.4;}box(body,.60,.09,.39,dark,0,.9,0);
 for(const s of [-1,1]){const arm=new THREE.Group();body.add(arm);arm.position.set(s*.35,1.46,0);ball(arm,.13,.30,.14,cloth,0,-.26,0);for(let i=0;i<4;i++)box(arm,.19,.035,.21,wrap,0,-.43-i*.047,0);ball(arm,.09,.12,.09,dark,0,-.68,0);arms.push(arm);const sword=new THREE.Group();arm.add(sword);sword.position.set(0,-.67,.07);box(sword,.07,.08,.23,dark,0,0,.02);box(sword,.23,.08,.05,wrap,0,0,.14);const blade=box(sword,.065,.035,.76,steel,0,0,.54);blade.rotation.x=-.1;mesh(new THREE.ConeGeometry(.045,.16,4),steel,sword,0,.055,1);sword.rotation.x=-.3;
 const leg=new THREE.Group();root.add(leg);leg.position.set(s*.17,.82,0);ball(leg,.18,.29,.17,cloth,0,-.22,0);box(leg,.23,.32,.27,dark,0,-.52,0);for(let i=0;i<4;i++)box(leg,.24,.027,.28,wrap,0,-.43-i*.055,0);ball(leg,.15,.10,.24,dark,0,-.73,.06);legs.push(leg);}
 ball(head,.31,.37,.27,cloth);box(head,.40,.085,.06,skin,0,.025,.254);for(const s of [-1,1])box(head,.09,.025,.015,dark,s*.11,.025,.292);ball(head,.25,.16,.06,dark,0,-.16,.25);root.userData={body,head,arms,legs};return root;
}
function spawnCampSpecial(kind){
 const c=parliamentCamp;if(!spawnPSRM())return null;const e=c.enemies[c.enemies.length-1],position=e.actor.position.clone();disposeCampObject(e.actor);e.kind=kind;e.actor=kind==='ninja'?makeCampNinja():kind==='peter'?makePeter():makeKevinMurderhorn();e.actor.position.copy(position);scene.add(e.actor);e.hp=e.maxHP=kind==='kevin'?200:kind==='peter'?Infinity:100;e.fire=2;e.attack=0;
 if(kind==='peter'){const gun=bossGun(e.actor.userData.arms[1]);gun.position.set(0,-.62,.08);gun.rotation.x=Math.PI/2;}
 return e;
}
function updateCampReinforcements(dt){
 const c=parliamentCamp,b=c.battle;if(b.wave>=3&&!b.peterJoined){const e=spawnCampSpecial('peter');if(e)b.peterJoined=true;}
 if(b.wave>=6&&!b.kevinJoined){const e=spawnCampSpecial('kevin');if(e)b.kevinJoined=true;}
 if(b.wave>=3&&!b.break){b.ninjaClock=(b.ninjaClock||0)-dt;if(b.ninjaClock<=0&&c.enemies.filter(e=>e.kind==='ninja').length<4){if(spawnCampSpecial('ninja'))b.ninjaClock=5;}}
 // The last wave continuously replenishes both factions until their leader falls.
 if(b.wave===6&&!b.break&&b.remaining===0){b.reinforceClock=(b.reinforceClock||0)-dt;if(b.reinforceClock<=0&&c.enemies.filter(e=>!e.kind).length<7){if(spawnPSRM())b.reinforceClock=3;}}
}
function campEnemyFaction(e){return e.kind==='kevin'||e.kind==='ninja'?'yellow':'red';}
function campEnemyTargets(e){const c=parliamentCamp,faction=campEnemyFaction(e),p=e.actor.position;return [{position:player},...c.allies.filter(a=>a.hp>0).map(a=>({position:a.actor.position,entry:a})),...c.enemies.filter(other=>other!==e&&other.hp>0&&campEnemyFaction(other)!==faction).map(other=>({position:other.actor.position,entry:other}))].filter(t=>campLineClear(p,t.position)).sort((a,b)=>p.distanceTo(a.position)-p.distanceTo(b.position));}
function campTargetFlow(target){const start={x:Math.round(target.x),z:Math.round(target.z)},queue=[start],flow=new Map([[start.x+','+start.z,0]]);for(let i=0;i<queue.length;i++){const p=queue[i],d=flow.get(p.x+','+p.z);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const n={x:p.x+dx,z:p.z+dz},key=n.x+','+n.z;if(!flow.has(key)&&campGroundClear(n.x,n.z)){flow.set(key,d+1);queue.push(n);}}}return flow;}

function updateCampSpecial(e,dt){
 const c=parliamentCamp,b=c.battle,p=e.actor.position;e.fire-=dt;e.attack=Math.max(0,(e.attack||0)-dt);if(e.stun>0){e.stun-=dt;animateCharacter(c.time,false,false,e.actor);e.actor.userData.body.rotation.x=.35;return;}
 const targets=campEnemyTargets(e),target=targets[0],dist=target?p.distanceTo(target.position):Infinity;
 const walking=dist>(e.kind==='ninja'?1.9:13)?movePSRM(e,dt*(e.kind==='ninja'?1.9:1.1),target?.position||player):false,aim=target?.position||player;e.actor.rotation.y=Math.atan2(aim.x-p.x,aim.z-p.z);animateCharacter(c.time,walking,false,e.actor);
 if(e.kind==='ninja'){e.actor.userData.arms[0].rotation.x=e.attack>0?-1.6+Math.sin(e.attack*10)*.8:-.5;e.actor.userData.arms[1].rotation.x=e.attack>0?-1.2:.1;if(dist<2.2&&e.fire<=0){e.attack=.5;e.fire=1.25;if(target.entry)target.entry.hp=Math.max(0,target.entry.hp-15);else b.hp=Math.max(0,b.hp-14);}}
 else{e.actor.userData.arms.forEach(a=>a.rotation.x=-1.35);if(dist<25&&e.fire<=0){e.fire=e.kind==='kevin'?.8:1.8;campTracer(p,target.position,e.kind==='kevin'?0xffd34c:0xff5353);playGunshot(.22);if(target.entry)target.entry.hp=Math.max(0,target.entry.hp-12);else b.hp=Math.max(0,b.hp-(e.kind==='kevin'?12:9));}}
}
const kevinRevealLines=[
 ['PETER CHAMBERS','This is not over.'],
 ['GARETH WILLIAMS','Wait. That mask… take it off.'],
 ['GARETH WILLIAMS','Kevin Murderhorn? No. It can’t be you.'],
 ['KEVIN MURDERHORN','You remember me after all, Gareth.'],
 ['GARETH WILLIAMS','You were the convicted terrorist. The release order… that was my mistake. I let you walk free.'],
 ['KEVIN MURDERHORN','And look what your little mistake made possible.'],
 ['GARETH WILLIAMS','I should have stopped you then. Tonight, we finally did.']
];
const kevinRevealClips=["assets/audio/clip-21a2db1339f1.mp3","assets/audio/clip-9df5e67a6685.mp3","assets/audio/clip-773578175f90.mp3","assets/audio/clip-6b5f103adee6.mp3","assets/audio/clip-7e83683b2a9f.mp3","assets/audio/clip-bae2242c5e8c.mp3","assets/audio/clip-22059f60ed94.mp3"].map(src=>{const audio=new Audio(src);audio.preload='metadata';return audio;});
let kevinRevealAnalyser=null,kevinRevealSamples=null;
const kevinRevealSources=new WeakMap();
function prepareKevinRevealLips(){
 initAudio();if(!audioCtx)return;
 try{
  if(!kevinRevealAnalyser){kevinRevealAnalyser=audioCtx.createAnalyser();kevinRevealAnalyser.fftSize=512;kevinRevealSamples=new Uint8Array(512);kevinRevealAnalyser.connect(audioCtx.destination);}
  for(const clip of kevinRevealClips)if(!kevinRevealSources.has(clip)){const source=audioCtx.createMediaElementSource(clip);source.connect(kevinRevealAnalyser);kevinRevealSources.set(clip,source);}
 }catch(e){}
}
function updateKevinRevealLips(r,dt){
 const [masked,revealed,peterActor]=parliamentCamp.revealActors;
 if(!r.speechMouths)r.speechMouths=[peterActor,gareth].map((actor,index)=>{
  const closed=actor.userData.mouth;closed.geometry.computeBoundingBox();
  const bounds=closed.geometry.boundingBox,center=bounds.getCenter(new THREE.Vector3());
  const m=ball(actor.userData.head,Math.min(.085,(bounds.max.x-bounds.min.x)*.36),.006,.009,new THREE.MeshBasicMaterial({color:0x281119}),center.x,center.y,bounds.max.z+.004);
  m.visible=false;return {actor,closed,m,level:0,speaker:index===0?'PETER CHAMBERS':'GARETH WILLIAMS'};
 });
 const clip=kevinRevealClips[r.index],speaker=kevinRevealLines[r.index][0];let level=0;
 if(!r.voiceFailed&&!clip.paused&&!clip.ended&&clip.readyState>=2&&kevinRevealAnalyser){
  kevinRevealAnalyser.getByteTimeDomainData(kevinRevealSamples);let sum=0;
  for(const value of kevinRevealSamples)sum+=((value-128)/128)**2;
  level=THREE.MathUtils.clamp((Math.sqrt(sum/kevinRevealSamples.length)-.012)*7,0,1);
 }
 for(const entry of r.speechMouths){const target=entry.speaker===speaker?level:0;
  entry.level+=(target-entry.level)*(1-Math.exp(-dt*(target>entry.level?30:20)));
  const open=target>.015&&entry.level>.015;entry.m.visible=open;entry.m.scale.y=.006+entry.level*.032;entry.closed.visible=!open;
  if(entry.actor.userData.openMouth)entry.actor.userData.openMouth.visible=false;
 }
 // Kevin's face covering remains intact; speech is conveyed with a restrained head movement.
 const kevinLevel=speaker==='KEVIN MURDERHORN'?level:0;
 for(const actor of [masked,revealed])actor.userData.head.rotation.x=kevinLevel*.035;
}
function stopKevinRevealVoice(){for(const audio of kevinRevealClips){audio.pause();audio.currentTime=0;}}
function playKevinRevealLine(r,index){
 prepareKevinRevealLips();stopKevinRevealVoice();r.index=index;r.lineTime=0;r.voiceFailed=false;
 $('kevinRevealSpeaker').textContent=kevinRevealLines[index][0];$('kevinRevealLine').textContent=kevinRevealLines[index][1];
 const audio=kevinRevealClips[index];audio.muted=muted;
 try{audio.play()?.catch(()=>{if(parliamentCamp?.battle?.reveal===r&&r.index===index)r.voiceFailed=true;});}catch(e){r.voiceFailed=true;}
}
function startKevinReveal(){const c=parliamentCamp,b=c.battle;if(b.reveal||b.ended)return;b.reveal={time:0,lineTime:0,index:-1,voiceFailed:false};b.holding=false;b.remaining=0;keys.clear();document.exitPointerLock?.();c.gun.visible=false;for(const e of c.enemies)e.actor.visible=false;for(const a of c.allies)a.actor.visible=false;
 const masked=makeKevinMurderhorn(),revealed=makeRevealedKevin(),fleeing=makePeter();scene.add(masked,revealed,fleeing);masked.position.set(0,0,28);revealed.position.copy(masked.position);revealed.visible=false;fleeing.position.set(5,0,30);c.revealActors=[masked,revealed,fleeing];gareth.visible=true;gareth.position.set(-1.8,0,29);gareth.rotation.y=.9;gareth.userData.body.rotation.x=0;
 $('campCombat').hidden=true;$('campHUD').hidden=true;$('kevinReveal').hidden=false;playKevinRevealLine(b.reveal,0);renderKevinReveal(0);
}
function renderKevinReveal(dt){const c=parliamentCamp,r=c?.battle?.reveal;if(!r)return;r.time+=dt;r.lineTime+=dt;
 const clip=kevinRevealClips[r.index];clip.muted=muted;const fallback=Math.max(4,kevinRevealLines[r.index][1].length/15),duration=Number.isFinite(clip.duration)&&clip.duration>0?clip.duration:fallback;
 if((clip.ended&&r.lineTime>=.25)||r.voiceFailed&&r.lineTime>=fallback||r.lineTime>duration+8){if(r.index===kevinRevealLines.length-1){finishKevinReveal();return;}playKevinRevealLine(r,r.index+1);}
 const index=r.index,[masked,revealed,fleeing]=c.revealActors,unmasked=index>=2;masked.visible=!unmasked;revealed.visible=unmasked;
 if(index===0){fleeing.visible=true;fleeing.position.z=30+Math.min(7,r.lineTime)*2.5;fleeing.rotation.y=0;animateCharacter(r.time,true,true,fleeing);}else fleeing.visible=false;
 const actor=unmasked?revealed:masked;animateCharacter(r.time,false,false,actor);animateCharacter(r.time,false,false,gareth);
 if(index===2||index===4){gareth.userData.arms[0].rotation.x=-1.2;gareth.userData.head.rotation.z=-.15;}
 updateKevinRevealLips(r,dt);
 if(index===0){camera.position.set(1.7,1.8,35);camera.lookAt(fleeing.position.x,1.4,fleeing.position.z);}else if(index===3||index===5){camera.position.set(.35,1.9,31.3);camera.lookAt(0,1.8,28);}else{camera.position.set(-.3,1.85,32.8);camera.lookAt(-1.1,1.65,28.8);}camera.updateMatrixWorld(true);
}
function finishKevinReveal(){const c=parliamentCamp;if(!c?.battle.reveal)return;stopKevinRevealVoice();const r=c.battle.reveal;for(const entry of r.speechMouths||[]){disposeCampObject(entry.m);entry.closed.visible=true;}if(gareth.userData.mouth)gareth.userData.mouth.visible=true;c.battle.reveal=null;for(const a of c.revealActors||[])disposeCampObject(a);c.revealActors=[];gareth.visible=false;$('kevinReveal').hidden=true;finishCampSurvival(true);}

function setupCampSupplies(){
 const c=parliamentCamp,b=c.battle;b.magazines=[12,6];b.capacity=[12,6];b.reserve=[72,24];b.reload=0;b.reloadWeapon=-1;c.supplies=[];
 const locations=[[-4,30,'health'],[4,28,'ammo'],[-20,8,'health'],[20,25,'ammo'],[-26,22,'ammo'],[27,8,'health'],[-3,44,'ammo'],[3,63,'health'],[-3,76,'ammo'],[3,93,'health'],[-10,103,'ammo']];
 for(const [x,z,kind] of locations){let position=null;for(let r=0;r<5&&!position;r++)for(let dx=-r;dx<=r&&!position;dx++)for(let dz=-r;dz<=r;dz++)if(campGroundClear(x+dx,z+dz)){position={x:x+dx,z:z+dz};break;}if(!position)continue;
  const root=new THREE.Group();root.name=kind==='health'?'Health pack':'Ammunition crate';root.position.set(position.x,.35,position.z);scene.add(root);const base=mat(kind==='health'?0xddd9ce:0x40472c),mark=new THREE.MeshBasicMaterial({color:kind==='health'?0xe53e58:0xe1b84a});box(root,.58,.33,.40,base,0,0,0);if(kind==='health'){box(root,.10,.24,.025,mark,0,0,.215);box(root,.30,.075,.025,mark,0,0,.216);}else for(let i=-1;i<=1;i++)box(root,.06,.2,.035,mark,i*.12,0,.22);const ring=mesh(new THREE.TorusGeometry(.43,.022,5,24),mark,root,0,-.15,0);ring.rotation.x=Math.PI/2;c.supplies.push({root,kind,cooldown:0});
 }
 for(const e of c.allies)e.hp=Infinity;
}
function reloadCampWeapon(){const b=parliamentCamp?.battle;if(mode!=='camp'||!b||b.ended||b.paused||b.reveal||b.reload>0)return;const w=b.weapon;if(b.magazines[w]>=b.capacity[w]||b.reserve[w]<=0)return;b.reloadWeapon=w;b.reload=w===0?1.5:2.3;b.holding=false;updateCampBattleHUD();}
function switchCampWeapon(w){const b=parliamentCamp?.battle;if(!b||b.ended||b.paused||b.reveal||b.reload>0)return;b.weapon=w;updateCampBattleHUD();}
function updateCampSupplies(dt){const c=parliamentCamp,b=c.battle;if(b.reload>0){b.reload=Math.max(0,b.reload-dt);if(b.reload===0){const w=b.reloadWeapon,amount=Math.min(b.capacity[w]-b.magazines[w],b.reserve[w]);b.magazines[w]+=amount;b.reserve[w]-=amount;b.reloadWeapon=-1;}}
 for(const p of c.supplies){if(p.cooldown>0){p.cooldown=Math.max(0,p.cooldown-dt);p.root.visible=p.cooldown===0;continue;}p.root.rotation.y+=dt*.55;p.root.position.y=.4+Math.sin(c.time*2)*.065;if(Math.hypot(player.x-p.root.position.x,player.z-p.root.position.z)<1.3){let used=false;if(p.kind==='health'&&b.hp<150){b.hp=Math.min(150,b.hp+50);used=true;}if(p.kind==='ammo'&&(b.reserve[0]<144||b.reserve[1]<48)){b.reserve[0]=Math.min(144,b.reserve[0]+36);b.reserve[1]=Math.min(48,b.reserve[1]+12);used=true;}if(used){p.root.visible=false;p.cooldown=45;b.pickupText=p.kind==='health'?'+50 HEALTH':'AMMO COLLECTED';b.pickupNotice=3;}}}
 b.pickupNotice=Math.max(0,(b.pickupNotice||0)-dt);
}

function startCampSurvival(){
 const c=parliamentCamp;c.battle={hp:150,wave:0,maxWaves:6,remaining:0,spawn:0,break:10,kills:0,fire:0,recoil:0,holding:false,weapon:0,ended:false,paused:false,flow:new Map(),flowTime:0,effects:[]};c.enemies=[];
 c.gun=bossGun(camera);c.gun.position.set(.30,-.25,-.55);
 for(const e of c.allies){e.hp=100;e.fire=0;if(e.actor!==alissa){e.gun=bossGun(e.actor.userData.arms[1]);e.gun.position.set(0,-.6,0);e.gun.rotation.x=-Math.PI/2;}}
 setupCampSupplies();$('campCombat').hidden=false;$('campEnd').hidden=true;$('campPause').hidden=true;initAudio();updateCampBattleHUD();
}
function clearCampSurvival(){stopKevinRevealVoice();const c=parliamentCamp;if(!c)return;for(const p of c.supplies||[])disposeCampObject(p.root);for(const a of c.revealActors||[])disposeCampObject(a);$('kevinReveal').hidden=true;disposeCampObject(c.gun);for(const e of c.enemies||[])disposeCampObject(e.actor);for(const e of c.allies||[]){disposeCampObject(e.gun);if(e.actor.userData.muzzle)e.actor.userData.muzzle.visible=false;}for(const e of c.battle?.effects||[])disposeCampObject(e.line);for(const id of ['campCombat','campEnd','campPause'])$(id).hidden=true;}
function campShotBlocked(origin,target){const delta=target.clone().sub(origin),distance=delta.length();if(distance<.1)return false;const ray=new THREE.Raycaster(origin,delta.normalize(),.08,Math.max(.08,distance-.08));const c=parliamentCamp;if(!c.shotCover||c.coverChildCount!==c.root.children.length){c.root.updateMatrixWorld(true);c.shotCover=[];c.root.traverse(o=>{if(!o.isMesh)return;const bounds=new THREE.Box3().setFromObject(o);if(bounds.max.y>.35&&bounds.min.y<3&&bounds.max.x>-33&&bounds.min.x<33&&bounds.max.z>-11&&bounds.min.z<110)c.shotCover.push(o);});c.coverChildCount=c.root.children.length;}return ray.intersectObjects(c.shotCover,false).length>0;}
function campLineClear(a,b){return !campShotBlocked(new THREE.Vector3(a.x,1.45,a.z),new THREE.Vector3(b.x,1.45,b.z));}
function campTracer(a,b,color){const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(a.x,a.y||1.4,a.z),new THREE.Vector3(b.x,b.y||1.3,b.z)]),new THREE.LineBasicMaterial({color,transparent:true,opacity:.8}));scene.add(line);parliamentCamp.battle.effects.push({line,life:.09});}
function spawnPSRM(){
 const c=parliamentCamp,points=[[-30,-7],[30,-7],[-30,32],[30,32],[-30,10],[30,20],[-11,104],[11,104],[-11,71],[11,91]],available=points.filter(([x,z])=>campGroundClear(x,z)&&Math.hypot(x-player.x,z-player.z)>12&&!c.enemies.some(e=>Math.hypot(x-e.actor.position.x,z-e.actor.position.z)<1.4));if(!available.length)return false;
 const [x,z]=available[Math.floor(Math.random()*available.length)],actor=makePSRMSoldier();actor.position.set(x,0,z);scene.add(actor);c.enemies.push({actor,hp:65+c.battle.wave*5,fire:1.2+Math.random(),aim:0,flash:0});return true;
}
function buildCampFlow(){const c=parliamentCamp,b=c.battle,start={x:Math.round(player.x),z:Math.round(player.z)},queue=[start];b.flow=new Map([[start.x+','+start.z,0]]);for(let i=0;i<queue.length;i++){const p=queue[i],d=b.flow.get(p.x+','+p.z);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const n={x:p.x+dx,z:p.z+dz},key=n.x+','+n.z;if(!b.flow.has(key)&&campGroundClear(n.x,n.z)){b.flow.set(key,d+1);queue.push(n);}}}}
function movePSRM(e,dt,target=player){const c=parliamentCamp,p=e.actor.position;let goal=target;if(!campSegmentClear(p,target)){const key=Math.round(target.x)+','+Math.round(target.z);if(target!==player&&(e.flowKey!==key||!e.targetFlow||c.time-(e.flowAt||0)>1)){e.targetFlow=campTargetFlow(target);e.flowKey=key;e.flowAt=c.time;}const flow=target===player?c.battle.flow:e.targetFlow;const x=Math.round(p.x),z=Math.round(p.z),near=[];for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){const q={x:x+dx,z:z+dz},score=flow.get(q.x+','+q.z);if(score!==undefined&&campSegmentClear(p,q))near.push({...q,score});}near.sort((a,b)=>a.score-b.score);goal=near[0];if(!goal)return false;}
 const dx=goal.x-p.x,dz=goal.z-p.z,d=Math.hypot(dx,dz);if(d<.15)return false;const step=Math.min(d,dt*(1.1+c.battle.wave*.11)),x=p.x+dx/d*step,z=p.z+dz/d*step;if(!campGroundClear(x,z)||Math.hypot(x-player.x,z-player.z)<1.25||c.enemies.some(other=>other!==e&&Math.hypot(x-other.actor.position.x,z-other.actor.position.z)<.6)||c.allies.some(a=>Math.hypot(x-a.actor.position.x,z-a.actor.position.z)<.75))return false;p.set(x,0,z);return true;
}
function fireCampWeapon(){const c=parliamentCamp,b=c?.battle;if(mode!=='camp'||!b||b.ended||b.paused||b.reveal||b.fire>0||b.reload>0)return;if(b.magazines[b.weapon]<=0){reloadCampWeapon();return;}b.magazines[b.weapon]--;b.fire=b.weapon?.8:.23;b.recoil=.12;camera.updateMatrixWorld(true);const direction=new THREE.Vector3();camera.getWorldDirection(direction);const ray=new THREE.Ray(camera.position.clone(),direction);let hit=null,nearest=45;
 for(const e of c.enemies){if(e.hp<=0)continue;e.actor.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(e.actor).expandByScalar(.06);const point=ray.intersectBox(bounds,new THREE.Vector3());if(point&&point.distanceTo(camera.position)<nearest&&!campShotBlocked(camera.position,point)){hit=e;nearest=point.distanceTo(camera.position);}}
 if(hit){hit.hp-=b.weapon?(nearest<12?85:40):34;$('campCrosshair').textContent='×';}else $('campCrosshair').textContent='+';campTracer(camera.position,camera.position.clone().addScaledVector(direction,nearest),0xffe2a0);playGunshot(.6);
}
function finishCampSurvival(won){const b=parliamentCamp.battle;if(b.ended)return;b.ended=true;b.holding=false;keys.clear();document.exitPointerLock?.();$('campEnd').hidden=false;$('campEndTitle').textContent=won?'DAWN / NIGHT SURVIVED':'THE CAMP HAS FALLEN';$('campEndText').textContent=won?'You and the resistance held Parliament Square. Peter has fled. Don’t pursue Peter.':'The PSRM overran your position. Try again from the first wave.';$('campRetry').hidden=won;if(won){gameProgress.civilDisobedienceSurvived=true;saveProgress();scene.background.setHex(0x25202b);scene.fog.color.setHex(0x302631);ambient.intensity=.65;queueMicrotask(()=>continueCompletedChapter(3));}updateCampBattleHUD();}
function pauseCampSurvival(){const b=parliamentCamp?.battle;if(!b||b.ended||b.reveal)return;b.paused=true;b.holding=false;keys.clear();$('campPause').hidden=false;document.exitPointerLock?.();}
function resumeCampSurvival(){const b=parliamentCamp?.battle;if(!b||b.ended)return;b.paused=false;$('campPause').hidden=true;requestLock();}
function updateCampBattleHUD(){const b=parliamentCamp.battle;$('campHP').textContent=Math.ceil(b.hp)+' / 150';$('campHPFill').style.width=Math.max(0,b.hp/150*100)+'%';$('campWave').textContent=b.ended?'':b.break>0?'NEXT WAVE IN '+Math.ceil(b.break)+'s':'WAVE '+b.wave+' / '+b.maxWaves+' · PSRM '+(b.remaining+parliamentCamp.enemies.filter(e=>!e.kind).length);$('campWeapon').textContent=(b.weapon?'2 / SHOTGUN':'1 / PISTOL')+' · '+b.magazines[b.weapon]+' / '+b.reserve[b.weapon]+(b.reload>0?' · RELOADING '+b.reload.toFixed(1)+'s':' · R RELOAD');$('campKills').textContent='ENEMIES DEFEATED: '+b.kills;const allies=c=>c.allies.map(a=>a.name+' ∞').join(' · ');$('campAllies').textContent=allies(parliamentCamp)+(b.peterJoined?' · PETER ∞':'');$('campPickup').textContent=b.pickupNotice>0?b.pickupText:'HEALTH + / AMMO ▪ · WALK OVER TO COLLECT';const boss=parliamentCamp.enemies.find(e=>e.kind==='kevin');$('campBoss').textContent=boss?'MASKED FIGURE · '+Math.max(0,Math.ceil(boss.hp))+' / 200 · DON’T PURSUE PETER':b.wave>=3?'DON’T PURSUE PETER · YELLOW = SWORDSMEN':'';}
function updateCampSurvival(dt){const c=parliamentCamp,b=c.battle;if(!b||b.ended||b.paused||b.reveal)return;updateCampSupplies(dt);b.fire=Math.max(0,b.fire-dt);b.recoil=Math.max(0,b.recoil-dt);c.gun.position.z=-.55+b.recoil*.5;c.gun.position.y=b.reload>0?-.43:-.25;c.gun.rotation.x=b.reload>0?.45:0;if(!b.recoil)$('campCrosshair').textContent='+';if(b.holding)fireCampWeapon();
 for(let i=b.effects.length-1;i>=0;i--){const e=b.effects[i];e.life-=dt;if(e.life<=0){disposeCampObject(e.line);b.effects.splice(i,1);}}
 if(b.break>0){b.break-=dt;if(b.break<=0){b.break=0;b.wave++;b.remaining=6+b.wave*3;b.spawn=0;}}
 else if(b.remaining>0){b.spawn-=dt;if(b.spawn<=0&&c.enemies.length<12&&spawnPSRM()){b.remaining--;b.spawn=Math.max(.65,1.7-b.wave*.12);}}
 updateCampReinforcements(dt);b.flowTime-=dt;if(b.flowTime<=0){buildCampFlow();b.flowTime=.7;}
 for(const e of c.enemies){if(e.hp<=0)continue;if(e.kind){updateCampSpecial(e,dt);continue;}const p=e.actor.position;const targets=campEnemyTargets(e),t=targets[0];const distance=t?p.distanceTo(t.position):Infinity;const moving=distance>14?movePSRM(e,dt,t?.position||player):false;const aim=t?.position||player;e.actor.rotation.y=Math.atan2(aim.x-p.x,aim.z-p.z);animateCharacter(c.time,moving,false,e.actor);e.actor.userData.arms.forEach(a=>a.rotation.x=-1.15);e.fire-=dt;e.flash=Math.max(0,e.flash-dt);e.actor.userData.muzzle.visible=e.flash>0;
  if(distance<23&&e.fire<=0){e.aim+=dt;e.actor.userData.muzzle.visible=Math.sin(e.aim*20)>0;if(e.aim>.65){e.aim=0;e.fire=1.6+Math.random();e.flash=.09;campTracer(p,t.position,0xff5544);playGunshot(.16);if(t.entry)t.entry.hp=Math.max(0,t.entry.hp-9);else b.hp=Math.max(0,b.hp-(5+b.wave));}}else e.aim=0;
 }
 for(const a of c.allies){a.fire-=dt;if(a.hp<=0){a.actor.userData.body.rotation.x=.7;continue;}const target=c.enemies.filter(e=>e.hp>0&&a.actor.position.distanceTo(e.actor.position)<22&&campLineClear(a.actor.position,e.actor.position)).sort((x,y)=>a.actor.position.distanceTo(x.actor.position)-a.actor.position.distanceTo(y.actor.position))[0];if(target){const p=target.actor.position;a.actor.rotation.y=Math.atan2(p.x-a.actor.position.x,p.z-a.actor.position.z);a.actor.userData.arms[1].rotation.x=-Math.PI/2;if(a.fire<=0){target.hp-=a.actor===alissa?24:16;a.fire=a.actor===alissa?.9:1.4;campTracer(a.actor.position,p,0x72bdff);playGunshot(.18);}}}
 if(b.hp>0&&c.enemies.some(e=>e.kind==='kevin'&&e.hp<=0)){startKevinReveal();return;}for(const e of c.enemies)if(e.kind==='peter'&&e.hp<=0){e.hp=Infinity;e.stun=5;}for(let i=c.enemies.length-1;i>=0;i--)if(c.enemies[i].hp<=0){disposeCampObject(c.enemies[i].actor);c.enemies.splice(i,1);b.kills++;}
 if(b.hp<=0){finishCampSurvival(false);return;}if(b.break<=0&&!b.remaining&&!c.enemies.some(e=>!e.kind)&&b.wave<b.maxWaves){b.break=9;b.hp=Math.min(150,b.hp+30);for(const a of c.allies)a.hp=Infinity;}
 updateCampBattleHUD();
}

function setupCampAllies(){
 const roster=[[gareth,'GARETH',-3,12],[alissa,'ALISSA',4,16]];
 if(gameProgress.stephenRescued===true&&!stephenIsDeceased())roster.push([stephen,'STEPHEN',-7,18]);
 parliamentCamp.allies=roster.map(([actor,name,x,z])=>{const entry={actor,name,position:actor.position.clone(),rotation:actor.rotation.clone()};actor.position.set(x,0,z);actor.rotation.set(0,.2,0);actor.visible=true;return entry;});
}
function campGroundClear(x,z){return x>-32&&x<32&&z>-10&&z<108&&(z<38||Math.abs(x)<14)&&!parliamentCamp.obstacles.some(([a,b,c,d])=>x>a-.55&&x<c+.55&&z>b-.55&&z<d+.55);}
function campSegmentClear(a,b){const n=Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/.25);for(let i=0;i<=n;i++){const t=n?i/n:0;if(!campGroundClear(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t))return false;}return true;}
function planCampPatrol(entry){
 const start={x:Math.round(entry.actor.position.x),z:Math.round(entry.actor.position.z)},key=p=>p.x+','+p.z;
 if(!campSegmentClear(entry.actor.position,start))return [];
 const queue=[start],parents=new Map([[key(start),null]]);let head=0;
 while(head<queue.length){const p=queue[head++];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const n={x:p.x+dx,z:p.z+dz};if(!parents.has(key(n))&&campGroundClear(n.x,n.z)){parents.set(key(n),p);queue.push(n);}}}
 const choices=queue.filter(p=>Math.hypot(p.x-start.x,p.z-start.z)>7&&Math.hypot(p.x-player.x,p.z-player.z)>2);
 if(!choices.length)return [];
 let target=choices[Math.floor(Math.random()*choices.length)],path=[];while(target){path.push(target);target=parents.get(key(target));}path.reverse();
 const smooth=[];let from=entry.actor.position,i=0;while(i<path.length){let j=i;while(j+1<path.length&&campSegmentClear(from,path[j+1]))j++;smooth.push(path[j]);from=path[j];i=j+1;}return smooth;
}
function updateCampPatrols(dt){
 for(const [i,e] of parliamentCamp.allies.entries()){
  if(e.hp<=0)continue;
  e.wait=Math.max(0,(e.wait||0)-dt);let walking=false;
  if(!e.wait){if(!e.path||!e.path.length)e.path=planCampPatrol(e);
   const goal=e.path[0];if(goal){const p=e.actor.position,dx=goal.x-p.x,dz=goal.z-p.z,d=Math.hypot(dx,dz),step=Math.min(d,dt*(e.actor===stephen?.8:1.15+i*.12));
    if(d<.12){e.path.shift();if(!e.path.length)e.wait=1.5+Math.random()*3;}
    else{const x=p.x+dx/d*step,z=p.z+dz/d*step,blocked=Math.hypot(x-player.x,z-player.z)<1||parliamentCamp.allies.some(other=>other!==e&&Math.hypot(x-other.actor.position.x,z-other.actor.position.z)<1);
     if(!blocked&&campSegmentClear(p,{x,z})){p.x=x;p.z=z;walking=step>0;e.blocked=0;const angle=Math.atan2(dx,dz),diff=Math.atan2(Math.sin(angle-e.actor.rotation.y),Math.cos(angle-e.actor.rotation.y));e.actor.rotation.y+=diff*Math.min(1,dt*6);}
     else{e.blocked=(e.blocked||0)+dt;if(e.blocked>1.5){e.path=[];e.wait=.5+Math.random();e.blocked=0;}}
    }
   }else e.wait=1;
  }
  animateCharacter(parliamentCamp.time+i*2,walking,false,e.actor);
 }
}
function drawCampMap(){
 const c=$('campMap'),ctx=c.getContext('2d'),w=c.width,h=c.height;
 const px=x=>12+(x+34)/68*(w-24),pz=z=>24+(z+11)/123*(h-36);
 ctx.clearRect(0,0,w,h);ctx.fillStyle='#09050bdd';ctx.fillRect(0,0,w,h);
 ctx.fillStyle='#211b23';ctx.fillRect(px(-32),pz(-10),px(32)-px(-32),pz(38)-pz(-10));ctx.fillRect(px(-14),pz(38),px(14)-px(-14),pz(108)-pz(38));
 ctx.fillStyle='#17231f';ctx.fillRect(px(-20),pz(-8),px(20)-px(-20),pz(30)-pz(-8));
 ctx.fillStyle='#574049';for(const [a,b,d,e] of parliamentCamp.obstacles)ctx.fillRect(px(a),pz(b),Math.max(2,px(d)-px(a)),Math.max(2,pz(e)-pz(b)));
 ctx.fillStyle='#b16a77';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText('PARLIAMENT / SEALED',w/2,13);
 for(const {actor,name} of parliamentCamp.allies){ctx.fillStyle='#53a9ff';ctx.beginPath();ctx.arc(px(actor.position.x),pz(actor.position.z),3.5,0,TAU);ctx.fill();ctx.fillStyle='#b8d8ff';ctx.font='8px monospace';ctx.fillText(name,px(actor.position.x),pz(actor.position.z)-7);}
 for(const p of parliamentCamp.supplies||[]){if(!p.root.visible)continue;ctx.fillStyle=p.kind==='health'?'#80e4b2':'#e4bc70';ctx.font='11px monospace';ctx.fillText(p.kind==='health'?'+':'▪',px(p.root.position.x),pz(p.root.position.z));}for(const e of parliamentCamp.enemies||[]){ctx.fillStyle=e.kind==='kevin'||e.kind==='ninja'?'#ffd34b':e.kind==='peter'?'#9e1835':'#ec4356';ctx.beginPath();ctx.arc(px(e.actor.position.x),pz(e.actor.position.z),3,0,TAU);ctx.fill();if(e.kind==='peter'||e.kind==='kevin'){const label=e.kind==='peter'?'PETER':gameProgress.civilDisobedienceSurvived===true?'KEVIN':'????? ??????????';ctx.font='8px monospace';ctx.textAlign='center';const x=Math.max(42,Math.min(w-42,px(e.actor.position.x))),y=Math.max(22,pz(e.actor.position.z)-7);ctx.fillStyle='#08050be6';ctx.fillRect(x-40,y-8,80,10);ctx.fillStyle=e.kind==='peter'?'#ff8597':'#ffe293';ctx.fillText(label,x,y);}}ctx.save();ctx.translate(px(player.x),pz(player.z));ctx.rotate(-yaw);ctx.fillStyle='#fff0ed';ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(4,4);ctx.lineTo(0,2);ctx.lineTo(-4,4);ctx.closePath();ctx.fill();ctx.restore();
}

function campWalkable(x,z){return campGroundClear(x,z)&&!(parliamentCamp.allies||[]).some(e=>Math.hypot(x-e.actor.position.x,z-e.actor.position.z)<.75);}
function renderParliamentCamp(dt){if(parliamentCamp.battle?.reveal){renderKevinReveal(dt);return;}if(parliamentCamp.battle?.paused||parliamentCamp.battle?.ended)return;parliamentCamp.time+=dt;updateCampPatrols(dt);drawCampMap();parliamentCamp.lamps.forEach((lamp,i)=>{const t=parliamentCamp.time;lamp.intensity=11+(Math.sin(t*1.8+i*2.1)*.5)+(Math.sin(t*9+i)*Math.sin(t*3.4+i)>.85?-3:0);});const forward=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0),side=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0),len=Math.hypot(forward,side)||1,speed=keys.has('ShiftLeft')?6:3.5;const dx=(-Math.sin(yaw)*forward+Math.cos(yaw)*side)*dt*speed/len,dz=(-Math.cos(yaw)*forward-Math.sin(yaw)*side)*dt*speed/len;if(campWalkable(player.x+dx,player.z))player.x+=dx;if(campWalkable(player.x,player.z+dz))player.z+=dz;camera.position.set(player.x,1.7,player.z);camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);camera.updateMatrixWorld(true);updateCampSurvival(dt);drawCampMap();}

let last=performance.now();
function frame(now){requestAnimationFrame(frame);if(window.accessibilityGuideOpen){last=now;return;}const frameMs=now-last;let dt=Math.min(frameMs/1000,.05);last=now;clock+=dt;if(typeof updateMobileControls==='function')updateMobileControls();if(typeof updateAccessibleControls==='function')updateAccessibleControls(dt);
 damianMenu.visible=(mode==='menu'||mode==='viewer')&&selectedSubject===11;
 awakenedJosiahMenu.visible=mode==='menu'&&gameProgress.laniakeaAftermath===true;
 if(awakenedJosiahMenu.visible)subject.visible=false;
  davidMenu.visible=(mode==='menu'||mode==='viewer')&&selectedSubject===12&&gameProgress.laniakeaAftermath!==true&&gameProgress.kevinSolarAftermath!==true;
  if(mode==='garethPrologue')renderGarethPrologue(dt);else if(mode==='beforeStoryShibuya')renderKevinShibuya(dt);else if(mode==='beforeStoryKevinAlive')renderKevinAlive(dt);else if(mode==='beforeStoryKevinChurch')renderKevinChurchEnding(dt);else if(mode==='beforeStoryFaceless')renderFacelessCamden(dt);else if(mode==='beforeStoryBozukiIntro'||mode==='beforeStoryBozukiFight')renderBozukiEncounter(dt);else if(mode==='beforeStoryRebellion')renderKevinRebellion(dt);else if(mode==='beforeStoryShinjuku')renderKevinShinjuku(dt);else if(mode==='beforeStoryPeterTube')renderPeterUxbridge(dt);else if(mode==='beforeStoryDG')renderPeterDGConversation(dt);else if(mode==='beforeStoryAdministrator')renderPeterAdministrator(dt);else if(mode==='beforeStoryRomford')renderPinterRomford(dt);else if(mode==='beforeStoryHeathIntro')renderHeathNarration(dt);else if(mode==='beforeStoryHeath')renderBeforeStoryHeath(dt);else if(mode==='beforeStoryMenu')renderBeforeStoryMenu(dt);else if(mode==='beforeStoryRome')renderBeforeStoryRome(dt);else if(mode==='beforeStoryJuko')renderBeforeStoryJuko(dt);else if(mode==='beforeStoryKenji')renderBeforeStoryKenji(dt);else if(mode==='beforeStoryKenjiEnding')renderBeforeStoryKenjiEnding(dt);else if(mode==='beforeStoryLastJuko')renderBeforeStoryLastJuko(dt);else if(mode==='beforeStoryBoki')renderBeforeStoryBoki(dt);else if(mode==='beforeStoryOsaka')renderBeforeStoryOsaka(dt);else if(mode==='beforeStoryOsakaEnding')renderBeforeStoryOsakaEnding(dt);else if(mode==='beforeStoryUnion')renderUnionCrownNarration(dt);else if(mode==='beforeStoryUnionFight')renderUnionCrownFight(dt);else if(mode==='beforeStoryUnionEnding')renderUnionCrownEnding(dt);else if(mode==='beforeStorySuccessor'||mode==='beforeStorySuccessorEnding')renderTrueSuccessorCinema(dt);else if(mode.startsWith('undead'))renderUndead(dt);else if(mode==='redRooms')renderRedRooms(dt);else if(mode==='uxbridgeChase')renderUxbridgeChase(dt);else if(mode==='uxbridge')renderUxbridge(dt);else if(mode==='curtainBattle')renderFinalCurtainBattle(dt);else if(mode==='finalCurtain')renderFinalCurtain(dt);else if(mode==='pindar')renderPindar(dt);else if(mode==='kevin4')renderBusters(dt);else if(mode==='freeRoam')renderFreeRoam(dt);else if(mode==='spaceBoss')renderSpaceBoss(dt);else if(mode==='solarNegotiation')renderSolarNegotiation(dt);else if(mode==='universalRestoration')renderUniversalRestoration(dt);else if(mode==='spaceBossLoss')renderSpaceBossLoss(dt);else if(mode==='defenseIntro')renderDefenseIntro(dt);else if(mode==='tyrantEnding')renderWilliamsEnding(dt);else if(mode==='tyrant4')renderTyrantFour(dt);else if(mode==='tubeEnding')renderTubeBetrayal(dt);else if(mode==='kevinTubeEnding')renderKevinTubeEnding(dt);else if(mode==='tube')renderTubeMission(dt);else if(mode==='siegeCredits')renderSiegeCredits(dt);else if(mode==='siegeEnding')renderSiegeEnding(dt);else if(mode==='siegePeterIntro')renderSiegePeterIntro(dt);else if(mode==='kevinChainStruggle')renderKevinChainStruggle(dt);else if(mode==='kevinChainCosmos')renderPrimeChainCosmos(dt);else if(mode==='primeReunion')renderPrimeReunion(dt);else if(mode==='resistanceCredits')renderResistanceCredits(dt);else if(mode==='finalWarCinema'){if(finalWar?.josiahEncounter?.phase==='intro')renderAtriumJosiahIntro(dt);else if(finalWar?.josiahEncounter?.phase==='death')renderJosiahDeath(dt);else renderJosiahUniverse(dt);}else if(mode==='finalWar')renderFinalWar(dt);else if(mode==='secretaryIntro')renderSecretaryOpening(dt);else if(mode==='rooms')renderCorneredRooms(dt);
 else if(mode==='cornered')renderCorneredIntro(dt);
 else if(mode==='camp')renderParliamentCamp(dt);
 else if(mode==='civil')renderCivilScene(dt);
 else if(['chase','chaseIntro'].includes(mode))renderCarChase(dt);else if(mode==='r8Aftermath')renderR8Aftermath(dt);
 else if(mode==='rescue')renderStephenRescue(dt);
 else if(mode==='boss')updateBossBattle(dt);
 else if(mode==='cabinet')renderCabinet(dt);
 else if(mode==='cinematic')renderAtriumScene(dt);
 else if(mode==='play')update(dt);
 else if(mode==='menu'||mode==='viewer'){
  const actor=displayActor();updateGarethResistanceOutfit();updateAlissaAnarchistModel();setSternJosiah(subject,actor===subject&&gameProgress.josiahWrathful===true&&gameProgress.universalRestorationCompleted!==true);actor.position.set(0,0,0);actor.rotation.y=actor===awakenedJosiahMenu ? .15+Math.sin(clock*.35)*.18 : mode==='viewer'?viewerAngle:.20+(clock*.24)%TAU;actor.rotation.z=0;if(!(actor===subject&&gameProgress.secretaryDeadCompleted))animateCharacter(clock,false,false,actor);updateJosiahMenuInjury(actor===subject&&gameProgress.garethQuestCompleted===true&&gameProgress.civilDisobedienceCompleted===true&&gameProgress.universalRestorationCompleted!==true);if(actor===subject&&gameProgress.universalRestorationCompleted===true)subject.userData.body.rotation.x=0;updateJosiahUntouchable(actor===subject&&gameProgress.brentCrossCompleted===true&&gameProgress.garethQuestCompleted!==true&&gameProgress.a5EscapeCompleted===true&&!josiahIsTubeProtector()&&!(gameProgress.kevinRouteStarted===true&&gameProgress.kevinTubeClashWinner==='alissa'));poseJosiahGrieving(subject,actor===subject&&gameProgress.josiahBreakdownViewed===true&&!gameProgress.secretaryDeadCompleted&&gameProgress.universalRestorationCompleted!==true);if(actor===subject&&(gameProgress.secretaryDeadCompleted||(gameProgress.kevinRouteStarted===true&&gameProgress.kevinTubeClashWinner==='alissa'))){updateJosiahMenuInjury(false);updateJosiahUntouchable(false);subject.rotation.z=0;subject.position.set(0,0,0);subject.userData.body.rotation.set(0,0,0);setSternJosiah(subject,false);animateCharacter(clock,false,false,subject);}if(actor===subject&&josiahIsTubeProtector())poseJosiahProtector();if(actor===subject&&gameProgress.defenseLoyalEnding===true)poseJosiahVictorious();flash.intensity=0;cameraFill.intensity=0;
  resetKevinSiegeJosiahMenuModel();if(actor===awakenedJosiahMenu)poseAwakenedMenuJosiah(actor,clock);syncVictoriousKevinMenu();poseVictoriousKevin(clock);poseSolGuardian(clock);
  if(mode==='menu'){camera.position.set(.1,1.65,3.75);camera.lookAt(-1.42,1.35,0);}else{camera.position.set(0,1.42,viewerDistance);camera.lookAt(-1.35,1.35,0);}
 }else if(mode==='scare'){renderCapture(dt);}
  outdoorNightSky.visible=!world.visible&&(mode==='curtainBattle'||mode==='camp'||mode==='chase'||mode==='chaseIntro'||mode==='cabinet'||mode==='rescue'||mode==='tyrant4'||mode==='defenseIntro'||mode==='tyrantEnding'||mode==='freeRoam'&&(freeRoam?.destination==='parliament'||freeRoam?.destination==='tube'&&freeRoam.station<6)||mode==='tube'&&tubeMission?.station<6);
  if(outdoorNightSky.visible){outdoorNightSky.position.copy(camera.position);outdoorNightSky.material.uniforms.time.value=clock;}
  correctHeldWeaponAiming();if(typeof updatePlayerGunFeedback==='function')updatePlayerGunFeedback(dt);renderer.render(scene,camera);tickHDPerformance(frameMs,now);
}requestAnimationFrame(frame);
window.addEventListener('resize',()=>{applyHDResolution();camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()});
document.addEventListener('keydown',e=>{if(mode==='redRooms'){handleRedRoomKey(e);return;}if(mode==='uxbridgeChase'){handleUxChaseKey(e);return;}if(mode==='pindar'){handlePindarKey(e);return;}if(mode==='freeRoam'){handleFreeRoamKey(e);return;}if(mode==='disclaimer'){if(['Enter','Space'].includes(e.code)){e.preventDefault();if(!e.repeat)continueFromDisclaimer();}return;}if(mode==='camp'){if(parliamentCamp.battle.reveal){if(e.code==='Escape'){e.preventDefault();finishKevinReveal();}return;}if(e.code==='Escape'){if(parliamentCamp.battle.paused)resumeCampSurvival();else pauseCampSurvival();}else{if(e.code==='Digit1')switchCampWeapon(0);if(e.code==='Digit2')switchCampWeapon(1);if(e.code==='KeyR'&&!e.repeat)reloadCampWeapon();if(['Space','Tab'].includes(e.code))e.preventDefault();keys.add(e.code);}return;}if(mode==='civil'){if(['Space','Enter'].includes(e.code)){e.preventDefault();return;}if(e.code==='Escape'){menu();refreshProgressUI();}return;}if(mode==='r8Aftermath'){if(e.code==='Escape'){e.preventDefault();finishR8Aftermath();}return;}if(['chase','chaseIntro','chasePaused','chaseEnd'].includes(mode)){e.preventDefault();if(mode==='chaseIntro'&&e.code==='Enter')beginCarChase();else if(e.code==='Escape'){if(mode==='chase')pauseCarChase();else if(mode==='chasePaused')resumeCarChase();}else if(mode==='chase')keys.add(e.code);return;}if(mode==='rescue'){if(e.code==='KeyE'){e.preventDefault();if(!e.repeat)helpStephen();}return;}if(mode==='boss'||mode==='bossPaused'){e.preventDefault();if(e.code==='Escape'){if(mode==='boss')pauseBossBattle();else resumeBossBattle();return;}if(mode==='boss'){keys.add(e.code);if(e.code==='Digit1')bossBattle.weapon=0;if(e.code==='Digit2')bossBattle.weapon=1;}return;}if(!$('chapterPicker').hidden&&e.code==='Escape'){e.preventDefault();closeChapterPicker();return;}if(mode==='cabinet'){if(['Escape','Space','Enter'].includes(e.code)){e.preventDefault();if(!e.repeat)finishCabinet();}return;}if(mode==='cinematic'){if(['Escape','Space','Enter'].includes(e.code)){e.preventDefault();if(!e.repeat)finishAtriumScene();}return;}if(mode==='intro'){if(e.target.closest('button')&&['Space','Enter'].includes(e.code))return;if(['ArrowRight','ArrowLeft','Space','Enter','Escape'].includes(e.code)){e.preventDefault();if(e.repeat)return;if(e.code==='Escape')menu();else if(e.code==='ArrowLeft')previousIntro();else nextIntro();}return;}if(['Tab','Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='Escape'){if(mode==='play')pause();else if(mode==='viewer')menu();return;}if(mode!=='play')return;keys.add(e.code);if(e.repeat)return;if(e.code==='KeyF'){flashOn=!flashOn;if(flashOn&&battery<2)flashOn=false;tone(180,.035,.1,'square');}if(e.code==='KeyE')interact();if(e.code==='Tab'){mapOpen=true;$('mapWrap').hidden=false;drawMap();}});
document.addEventListener('keyup',e=>{keys.delete(e.code);if(e.code==='Tab'){mapOpen=false;$('mapWrap').hidden=true;}});
document.addEventListener('mousemove',e=>{if(mode==='freeRoam'&&(document.pointerLockElement||drag)){yaw-=THREE.MathUtils.clamp(e.movementX||0,-100,100)*.0023*(window.controlPreferences?.sensitivity||1);pitch=THREE.MathUtils.clamp(pitch-THREE.MathUtils.clamp(e.movementY||0,-100,100)*.0023*(window.controlPreferences?.sensitivity||1),-1.2,1.2);}if((mode==='play'||mode==='boss'||mode==='camp'||mode==='finalWar'&&!finalWar.paused&&!finalWar.ended||mode==='rooms'&&!corneredRooms.paused&&!corneredRooms.arrival)&&(document.pointerLockElement||drag)){const mx=Number.isFinite(e.movementX)?THREE.MathUtils.clamp(e.movementX,-100,100):0,my=Number.isFinite(e.movementY)?THREE.MathUtils.clamp(e.movementY,-100,100):0;yaw-=mx*.0023*(window.controlPreferences?.sensitivity||1);pitch=THREE.MathUtils.clamp(pitch-my*.0023*(window.controlPreferences?.sensitivity||1),-1.35,1.35);}if(mode==='viewer'&&drag){viewerAngle+=e.movementX*.01*(window.controlPreferences?.sensitivity||1);}});
$('world').addEventListener('mousedown',e=>{if(e.button!==0)return;drag=true;if(mode==='finalWar'&&!finalWar.paused&&!finalWar.ended){finalWar.holding=true;fireFinalWarWeapon();requestLock();}if(mode==='camp'&&!parliamentCamp.battle.paused&&!parliamentCamp.battle.ended){parliamentCamp.battle.holding=true;fireCampWeapon();}if(mode==='boss'){bossBattle.holdingFire=true;fireBossWeapon();requestLock();}else if(mode==='play'||mode==='camp'||mode==='rooms'&&!corneredRooms.paused)requestLock();});window.addEventListener('mouseup',()=>{drag=false;if(finalWar)finalWar.holding=false;if(parliamentCamp?.battle)parliamentCamp.battle.holding=false;if(bossBattle)bossBattle.holdingFire=false;});
$('world').addEventListener('wheel',e=>{if(mode==='viewer'){viewerDistance=THREE.MathUtils.clamp(viewerDistance+e.deltaY*.004,2.9,6);e.preventDefault();}},{passive:false});
document.addEventListener('pointerlockchange',()=>{if(document.pointerLockElement&&mode==='finalWar'&&finalWar)finalWar.cinematicPointerRelease=false;if(!document.pointerLockElement&&!window.mobileTouchActive){if(mode==='finalWar')autoPauseFinalWar();if(mode==='rooms'&&!corneredRooms?.arrival)pauseCorneredRooms();if(mode==='camp')pauseCampSurvival();if(mode==='play')pause();else if(mode==='boss')pauseBossBattle();}});window.addEventListener('blur',()=>{keys.clear();if(mode==='finalWar')autoPauseFinalWar();if(mode==='rooms')pauseCorneredRooms();if(mode==='camp')pauseCampSurvival();pause();pauseBossBattle();pauseCarChase();});
$('jonesAccept').onclick=()=>chooseJonesQuest(true);$('jonesDecline').onclick=()=>chooseJonesQuest(false);$('roomsRetry').onclick=retryCorneredEncounter;$('roomsResume').onclick=resumeCorneredRooms;$('roomsQuit').onclick=$('roomsEndMenu').onclick=()=>{menu();refreshProgressUI();};$('openCorneredRat').onclick=startCorneredRat;$('corneredSkip').onclick=finishCorneredIntro;$('corneredBack').onclick=$('corneredEndMenu').onclick=()=>{menu();refreshProgressUI();};$('kevinRevealSkip').onclick=finishKevinReveal;$('campRetry').onclick=()=>{startParliamentCamp();requestLock();};$('campResume').onclick=resumeCampSurvival;$('campPauseMenu').onclick=$('campEndMenu').onclick=()=>{menu();refreshProgressUI();};$('campBack').onclick=()=>{menu();refreshProgressUI();};$('civilSkip').onclick=finishCivilScene;$('openCivil').onclick=startCivilDisobedience;$('civilBack').onclick=()=>{menu();refreshProgressUI();};$('r8AftermathSkip').onclick=finishR8Aftermath;$('chaseBegin').onclick=beginCarChase;$('chaseResume').onclick=resumeCarChase;$('chaseQuit').onclick=$('chaseMenu').onclick=()=>{menu();refreshProgressUI();};$('bossResume').onclick=resumeBossBattle;$('bossRetry').onclick=startBossBattle;$('bossQuit').onclick=$('bossMenu').onclick=()=>{menu();refreshProgressUI();};$('rescueHelp').onclick=helpStephen;$('finalWarResume').onclick=resumeFinalWar;$('finalWarRetry').onclick=()=>{if(finalWar?.defenseRoute)startDefense(false);else startFinalWar(false,false,finalWar?.kevinSiegeRoute===true);};$('finalWarQuit').onclick=$('finalWarEndMenu').onclick=()=>{menu();refreshProgressUI();};$('playSecretaryDead').onclick=startSecretaryOpening;$('secretaryOpeningNext').onclick=advanceSecretaryOpening;$('secretaryOpeningSkip').onclick=finishSecretaryOpening;$('secretaryOpeningMenu').onclick=()=>{menu();refreshProgressUI();};$('openChapters').onclick=()=>{$('debugRestorePanel').hidden=true;openChapterPicker();};$('closeChapters').onclick=()=>closeChapterPicker();$('eraseSave').onclick=eraseGameSave;$('operationCabinet').onclick=startCabinet;refreshProgressUI();$('skipAtrium').onclick=()=>{if(mode==='cabinet')finishCabinet();else finishAtriumScene();};$('start').onclick=start;$('retry').onclick=start;$('resume').onclick=resume;$('quit').onclick=menu;$('endMenu').onclick=menu;$('back').onclick=()=>{const returnToEncyclopedia=window.encyclopediaViewerReturn===true;menu();if(returnToEncyclopedia)showEncyclopediaInstant();};
$('inspect').onclick=()=>{window.encyclopediaViewerReturn=false;$('back').textContent='← BACK TO PROJECT BC';setMode('viewer');viewerAngle=.3;viewerDistance=4.1;};
$('mute').onclick=()=>{muted=!muted;[...secretaryVoiceClips,...secretaryRearAudio,...stephenFinalOpeningAudio,...primeSecretaryAltAudio,josiahHoldFireAudio].forEach(a=>a.muted=muted);josiahBreakdownAudio.forEach(a=>a.muted=muted);peterEndingAudio.forEach(a=>a.muted=muted);peterCombatAudio.forEach(a=>a.muted=muted);peterFinaleClips.forEach(a=>a.muted=muted);commonsClips.forEach(a=>a.muted=muted);hurryUpAudio.muted=muted;if(muted)stopGunshots();alissaChaseAudio.muted=muted;cabinetClips.forEach(a=>a.muted=muted);alissaVowAudio.muted=muted;atriumClips.forEach(a=>a.muted=muted);garethClips.forEach(a=>a.muted=muted);syncMenuSong();josiahClips.forEach(a=>a.muted=muted);peterClips.forEach(a=>a.muted=muted);if(master)master.gain.value=(muted?0:.22)*AudioOptions.levels.sound*AudioOptions.levels.sfx;$('mute').textContent=muted?'SOUND OFF':'SOUND ON';};
for(const name of ['sound','music','sfx']){const slider=$(name+'Level'),value=$(name+'Value');slider.value=Math.round(AudioOptions.levels[name]*100);value.textContent=slider.value+'%';slider.addEventListener('input',()=>{AudioOptions.level(name,slider.value/100);value.textContent=slider.value+'%';});}
$('openAudioOptions').onclick=()=>{$('audioOptionsPanel').hidden=false;$('openAudioOptions').setAttribute('aria-expanded','true');$('soundLevel').focus();};
$('closeAudioOptions').onclick=()=>{$('audioOptionsPanel').hidden=true;$('openAudioOptions').setAttribute('aria-expanded','false');$('openAudioOptions').focus();};
$('soft').onclick=()=>{softScares=!softScares;$('soft').textContent=softScares?'SCARES: REDUCED':'SCARES: FULL';};
// Read-only inspection plus deterministic hooks for build verification; absent from the interface.
window.ProjectBC={get state(){return{mode,collected,elapsed,battery,stamina,player:{x:player.x,z:player.z},enemy:{x:subject.position.x,z:subject.position.z},peter:{x:peter.position.x,z:peter.position.z,independent:peterAI.independent,chase:peterAI.chase},selectedSubject,grid:grid.map(r=>r.slice()),fuses:fuses.map(f=>({x:f.x,z:f.z,active:f.active}))}},character:subject,peter,route,walkable};
for(const track of [menuSong,postChapterThreeMenuSong,postTubeMenuSong,josiahGoneSong,LANIAKEA_MENU_THEME,IRON_DRIFT_MENU_THEME,MURDERHORN_ROUTE_THEME,SPACE_BOSS_THEME,IRON_DRIFT_BOSS_THEME,garethSuperbossTheme,chambersTheme,hurryUpAudio])AudioOptions.category(track,'music');
for(const effect of [...gunshotPool,roomDoorOpenSound])AudioOptions.category(effect,'sfx');
menu();
$('questAccept').onclick=()=>closeGarethQuest(true);$('questDecline').onclick=()=>closeGarethQuest(false);setupSubjects();
setupIntro();initKevinTubeEndingControls();initBustersControls();



$('nextChapterMenu').onclick=()=>{menu();refreshProgressUI();};

$('josiahAtriumNext').onclick=()=>finalWar?.josiahEncounter?.phase==='death'?advanceJosiahDeath():nextAtriumJosiahLine();$('josiahAtriumSkip').onclick=()=>finalWar?.josiahEncounter?.phase==='death'?startJosiahLastDefiance():beginAtriumJosiahFight();





$('universeContinue').onclick=()=>{if(finalWar?.josiahEncounter?.phase!=='universeLost')return;menu();refreshProgressUI();};

$('creditsContinue').onclick=()=>{$('resistanceCredits').hidden=true;menu();refreshProgressUI();};$('creditsSkip').onclick=()=>{const scroll=$('resistanceCreditsScroll');scroll.scrollTop=scroll.scrollHeight;$('resistanceCredits').dataset.finished='true';$('creditsContinue').hidden=false;};





$('primeKevinVictoryMenu').onclick=()=>{menu();refreshProgressUI();};

$('primeReunionNext').onclick=advancePrimeReunion;$('primeReunionSkip').onclick=skipPrimeReunion;

function restorePlaytestSkip(chapter,encounter=''){if(mode!=='menu')return;const loyal=chapter>=4||$('debugResistance').checked,jones=$('debugJones').checked,emma=$('debugEmma').checked,alive=chapter===5&&jones?emma:$('debugStephen').checked;gameProgress={brentCrossCompleted:true,cabinetUnlocked:true,garethQuestCompleted:loyal,debugCompletion:true};if(chapter>=3)Object.assign(gameProgress,{cabinetCompleted:true,cabinetBriefingViewed:true,loyalBossDefeated:loyal,loyalPursuitCompleted:loyal,a5EscapeCompleted:!loyal,stephenRescued:loyal&&alive,stephenLoyalDeathConfirmed:!alive,stephenFallWitnessed:!loyal,stephenFellOnMotorway:!loyal});if(chapter>=4)Object.assign(gameProgress,{civilDisobedienceStarted:true,civilDisobedienceCompleted:true,civilDisobedienceSurvived:true});if(chapter>=5)Object.assign(gameProgress,{corneredRatStarted:true,corneredRatIntroViewed:true,corneredRatRoomsCompleted:100,josiahWrathful:true,mariahFreed:jones,garethJonesDeceased:!jones,mariahNeverSeenAgain:!jones,peterDoor100Defeated:jones,peterKilledByStephen:jones&&emma,emmaRescued:jones&&emma,emmaShot:jones&&!emma,josiahBreakdownViewed:jones&&!emma});saveProgress();refreshProgressUI();$('debugRestoreResult').textContent='Playtest save ready: '+(chapter===5?chapterFiveTitle():'CHAPTER '+chapter);if(encounter==='josiah'){closeChapterPicker();startFinalWar(true);player.copy(finalWar.josiah.position).add(new THREE.Vector3(-4,0,4));startAtriumJosiahEncounter();}if(encounter==='kevin'){closeChapterPicker();startFinalWar(true);finishPrimeSecretaryPreview();}}
for(const n of [2,3,4,5])$('debugRestore'+n).onclick=()=>restorePlaytestSkip(n);$('debugRestoreJosiah').onclick=()=>{$('debugJones').checked=true;$('debugEmma').checked=false;restorePlaytestSkip(5,'josiah');};$('debugRestoreKevin').onclick=()=>{$('debugJones').checked=true;$('debugEmma').checked=true;restorePlaytestSkip(5,'kevin');};


$('kevinChainFailureContinue').onclick=()=>{clearPrimeChainCosmos();menu();refreshProgressUI();};$('primePeaceContinue').onclick=()=>{menu();refreshProgressUI();};
$('kevinChainRefuse').onclick=()=>{
 clearPrimeChainCosmos();$('kevinChainFailure').hidden=true;
 gameProgress={kevinSolarAftermath:true,solarPreResetProgress:{...gameProgress}};saveProgress();selectedSubject=6;
 menu();refreshProgressUI();selectSubject(6);
};

$('siegePeterNext').onclick=advanceSiegePeter;$('siegePeterSkip').onclick=beginSiegePeterFight;$('siegeEndMenu').onclick=()=>{menu();refreshProgressUI();};$('debugRestoreSiege').onclick=()=>{$('debugJones').checked=false;$('debugEmma').checked=false;restorePlaytestSkip(5);closeChapterPicker();startSecretaryOpening();};

$('siegeEndingNext').onclick=advanceSiegeEnding;$('siegeEndingSkip').onclick=skipSiegeEnding;

function playtestSiegePeter(){if(mode!=='menu')return;$('debugJones').checked=false;$('debugEmma').checked=false;restorePlaytestSkip(5);closeChapterPicker();startFinalWar(true);const w=finalWar;w.kevin.hp=0;w.kevin.actor.visible=false;if(w.kevin.spectre)w.kevin.spectre.visible=false;w.josiahEncounter={phase:'defeated'};w.josiah.visible=false;updateSiegeObjectives();startSiegePeterEncounter();beginSiegePeterFight();}
$('debugRestoreSiegePeter').onclick=playtestSiegePeter;

let siegeCreditsTime=0,siegeCreditsCarry=0;
function startSiegeCredits(){stopSiegeEndingVoice();keys.clear();drag=false;mode='siegeCredits';if(siegeEnding)siegeEnding.root.visible=false;if(finalWar)finalWar.root.visible=false;world.visible=upperWorld.visible=exhibit.visible=false;$('siegeEnd').hidden=true;$('siegeCredits').hidden=false;$('siegeCredits').dataset.finished='false';$('siegeCreditsScroll').scrollTop=0;$('siegeCreditsContinue').hidden=true;siegeCreditsTime=0;siegeCreditsCarry=0;document.exitPointerLock?.();}
function finishSiegeCreditsScroll(){const scroll=$('siegeCreditsScroll');scroll.scrollTop=scroll.scrollHeight;$('siegeCredits').dataset.finished='true';$('siegeCreditsContinue').hidden=false;}
function renderSiegeCredits(dt){const panel=$('siegeCredits'),scroll=$('siegeCreditsScroll');siegeCreditsTime+=dt;if(siegeCreditsTime>4&&panel.dataset.finished!=='true'){siegeCreditsCarry+=dt*19;const step=Math.floor(siegeCreditsCarry);scroll.scrollTop+=step;siegeCreditsCarry-=step;if(scroll.scrollTop+scroll.clientHeight>=scroll.scrollHeight-2){panel.dataset.finished='true';$('siegeCreditsContinue').hidden=false;}}}
$('siegeCreditsSkip').onclick=finishSiegeCreditsScroll;$('siegeCreditsContinue').onclick=()=>{menu();refreshProgressUI();};

function playtestCorneredDoor100(){if(mode!=='menu')return;const helped=$('debugJones').checked;restorePlaytestSkip(4);closeChapterPicker();Object.assign(gameProgress,{corneredRatStarted:true,corneredRatIntroViewed:true,josiahWrathful:true,mariahFreed:helped,garethJonesDeceased:!helped,mariahNeverSeenAgain:!helped});saveProgress();startCorneredRooms();const c=corneredRooms;c.quest.stage=helped?'key':'lost';c.quest.freed=helped;c.file.visible=c.cell.visible=false;if(helped){c.companions.push({name:'MARIAH',actor:c.mariah,lag:5});startPeterFinale();}else{loadCorneredRoom(99);player.set(0,0,c.layouts[99].center+c.layouts[99].depth/2-3);c.jones.visible=c.mariah.visible=false;updateHundredRoomStory(0);}camera.position.copy(player).add(new THREE.Vector3(0,1.7,0));camera.rotation.set(pitch,yaw,0);$('debugRestoreResult').textContent='Playtest: Cornered Rat / Door 100';}
$('debugRestoreDoor100').onclick=playtestCorneredDoor100;

initTubeControls();

initTyrantFour();

function setupGarethRescueKneel(){clearGarethRescueKneel();const u=gareth.userData,root=new THREE.Group();root.name='Gareth grounded rescue kneel';gareth.add(root);u.rescueKneel=root;u.legs.forEach(l=>l.visible=false);const fabric=mat(u.resistanceOutfit?.visible?0xbdbfc2:0x191214),shoe=mat(u.resistanceOutfit?.visible?0xeee9e8:0x141318),sole=mat(0x44434a);const segment=(a,b)=>{const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start),part=new THREE.Mesh(new THREE.CylinderGeometry(.105,.105,delta.length(),12),fabric);part.position.copy(start).add(end).multiplyScalar(.5);part.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());root.add(part);};for(const [hip,knee,ankle] of [[[-.135,.44,0],[-.18,.12,-.17],[-.18,.10,-.52]],[[.135,.44,0],[.19,.47,.35],[.19,.10,.40]]]){segment(hip,knee);segment(knee,ankle);ball(root,.112,.112,.112,fabric,...knee);ball(root,.135,.08,.22,shoe,ankle[0],.09,ankle[2]+.08);box(root,.27,.025,.40,sole,ankle[0],.025,ankle[2]+.07);}}
function clearGarethRescueKneel(){const u=gareth.userData;if(!u.rescueKneel)return;disposeCampObject(u.rescueKneel);u.rescueKneel=null;u.body.position.y=0;u.body.rotation.x=0;u.legs.forEach(l=>{l.visible=true;l.position.y=.82;l.rotation.set(0,0,0);});}

function registerHeldGun(gun,axis){gun.userData.barrelAxis=axis;(registerHeldGun.items||(registerHeldGun.items=new Set())).add(gun);}
function correctHeldWeaponAiming(){for(const gun of registerHeldGun.items||[]){let top=gun;while(top.parent)top=top.parent;if(top!==scene){registerHeldGun.items.delete(gun);continue;}const arm=gun.parent,body=arm?.parent,actor=body?.parent;if(!actor?.userData.arms?.includes(arm))continue;if(!gun.userData.restQuaternion)gun.userData.restQuaternion=gun.quaternion.clone();if(!actor.visible||!arm.visible||arm.rotation.x>-.65||arm.rotation.x< -2.25){gun.quaternion.copy(gun.userData.restQuaternion);continue;}actor.updateMatrixWorld(true);const target=actor.userData.weaponAimPoint,origin=gun.getWorldPosition(new THREE.Vector3());let direction;if(target){direction=target.clone().sub(origin);}else{direction=new THREE.Vector3(0,0,1).applyQuaternion(actor.getWorldQuaternion(new THREE.Quaternion()));}if(direction.lengthSq()<.001)continue;direction.normalize().applyQuaternion(arm.getWorldQuaternion(new THREE.Quaternion()).invert());gun.quaternion.setFromUnitVectors(gun.userData.barrelAxis,direction);gun.updateMatrixWorld(true);}}

