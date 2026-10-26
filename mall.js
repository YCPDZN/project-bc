/* Brent Cross: an original, large, explorable shopping centre built as 3D geometry. */
const N=81,CELL=3.5,spawnCell={x:38,z:78},exitCell={x:38,z:79};
const MALL_BIO="Josiah Richards is the Prime Secretary of the United Kingdom, a title that he created in Early 2025, shortly after the riots of '24.";
let grid=[],rng=73459;
const shopPlans=[],frontCells=new Set(),mallBatches=new Map(),mallLamps=[];
const mallLights=[],mallZones=[
 {name:'FOOD COURT',x:16,z:9},{name:'NORTHSTAR DEPARTMENT STORE',x:64,z:9},
 {name:'WEST ARCADE',x:15,z:37},{name:'EAST ARCADE',x:65,z:37},
 {name:'THE GRAND ATRIUM',x:40,z:37},{name:'CINEMA',x:16,z:63},
 {name:'MARKET HALL',x:64,z:63},{name:'SOUTH CONCOURSE',x:40,z:57},
 {name:'BRENT CROSS FORECOURT',x:40,z:75}];
const patrolPoints=[{x:15,z:17},{x:15,z:37},{x:40,z:17},{x:65,z:17},{x:65,z:37},{x:65,z:57},{x:40,z:57},{x:15,z:57},{x:40,z:27},{x:40,z:47}];
function random(){rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/4294967296;}
const pos=(x,z,y=0)=>new THREE.Vector3(x*CELL,y,z*CELL);
function cell(v){return{x:Math.round(v.x/CELL),z:Math.round(v.z/CELL)}}
function carve(x1,z1,x2,z2,value=0){for(let z=z1;z<=z2;z++)for(let x=x1;x<=x2;x++)grid[z][x]=value;}
function generateMap(){
 rng=73459;grid=Array.from({length:N},()=>Array(N).fill(1));
 carve(1,69,79,79);carve(37,66,43,69);
 for(const [x1,x2] of [[13,17],[37,43],[63,67]])carve(x1,5,x2,67);
 for(const [z1,z2] of [[15,19],[35,39],[55,59]])carve(4,z1,76,z2);
 carve(30,26,50,48);
 for(const [x1,z1,x2,z2] of [[4,4,28,14],[52,4,76,14],[4,60,28,66],[52,60,76,66]])carve(x1,z1,x2,z2);
 let index=0;
 for(const [x1,x2,front,facing] of [[4,11,12,1],[19,28,18,-1],[52,61,62,1],[69,76,68,-1]]){
  for(const [za,zb] of [[20,25],[27,33],[40,46],[48,54]]){
   carve(x1,za,x2,zb);const middle=Math.round((za+zb)/2),closed=index%4===1;
   if(!closed)grid[middle][front]=0;
   for(let z=za;z<=zb;z++)frontCells.add(front+','+z);
   shopPlans.push({x1,x2,za,zb,front,facing,middle,closed,index:index++});
  }
 }
 // Smaller boutiques open onto the central north and south promenades.
 for(const [x1,x2,front,facing] of [[30,35,36,1],[45,50,44,-1]])for(const [za,zb] of [[5,9],[11,14],[20,24],[50,54],[60,66]]){
  carve(x1,za,x2,zb);let middle=Math.round((za+zb)/2);grid[middle][front]=0;
  for(let z=za;z<=zb;z++)frontCells.add(front+','+z);
  shopPlans.push({x1,x2,za,zb,front,facing,middle,closed:false,index:index++});
 }
 // Large props are part of the navigation grid, so Josiah routes around them.
 carve(39,36,41,38,2);carve(31,31,31,38,2);carve(49,36,49,43,2);
 for(const x of[30,50])for(const z of[26,32,42,48])grid[z][x]=2;
 for(const x of[37,39,41,43])grid[68][x]=2;
 for(const[x,z]of[[34,28],[46,28],[34,46],[46,46],[33,40],[47,34]])grid[z][x]=2;
 carve(48,72,57,76,2);
 for(const [x,z] of [[23,75],[27,75],[23,78],[27,78],[8,9],[23,9],[56,7],[61,7],[69,7],[56,11],[61,11],[69,11],[6,62],[7,62],[8,62],[20,62],[21,62],[22,62]])grid[z][x]=2;
}
function walkable(x,z,r=.25){if(['boss','bossPaused','bossEnd'].includes(mode))return bossWalkable(x,z,r);for(const dx of [-r,r])for(const dz of [-r,r]){let cx=Math.floor((x+dx)/CELL+.5),cz=Math.floor((z+dz)/CELL+.5);if(grid[cz]?.[cx]!==0)return false;}return true;}
function route(a,b){let queue=[a],prev=new Map([[a.x+','+a.z,null]]),end=b.x+','+b.z;for(let i=0;i<queue.length;i++){let p=queue[i],k=p.x+','+p.z;if(k===end){let out=[];while(prev.get(k)!==null){const[x,z]=k.split(',').map(Number);out.unshift({x,z});k=prev.get(k)}return out;}for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){let x=p.x+dx,z=p.z+dz,nk=x+','+z;if(grid[z]?.[x]===0&&!prev.has(nk)){prev.set(nk,k);queue.push({x,z})}}}return[];}
function sight(a,b){if((a.level||0)!==(b.level||0))return false;let d=a.distanceTo(b),steps=Math.ceil(d/.65);for(let i=1;i<steps;i++){let t=i/steps;if(!walkable(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t,.02))return false;}return true;}
function slab(w,h,d,material,x,y,z,ry=0,rz=0){let batch=mallBatches.get(material.uuid);if(!batch){batch={material,matrices:[]};mallBatches.set(material.uuid,batch)}let o=new THREE.Object3D();o.position.set(x,y,z);o.scale.set(w,h,d);o.rotation.set(0,ry,rz);o.updateMatrix();batch.matrices.push(o.matrix.clone());}
function finishBatches(){for(const batch of mallBatches.values()){let inst=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),batch.material,batch.matrices.length);batch.matrices.forEach((m,i)=>inst.setMatrixAt(i,m));inst.computeBoundingSphere();world.add(inst)}}
function mallLabel(text,x,y,z,width=8,rotation=0,color='#c7c7b4',background='#202a2b',height=1.2){
 const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=Math.max(32,Math.round(1536*height/width));let ctx=canvas.getContext('2d');ctx.fillStyle=background;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';let font=canvas.height*.72;ctx.font=`500 ${font}px Georgia`;let textWidth=ctx.measureText(text).width;if(textWidth>1450)ctx.font=`500 ${Math.floor(font*1450/textWidth)}px Georgia`;ctx.fillText(text,768,canvas.height*.53);ctx.fillStyle='#ffffff16';ctx.fillRect(18,canvas.height-4,1500,1);let tx=new THREE.CanvasTexture(canvas);tx.colorSpace=THREE.SRGBColorSpace;tx.anisotropy=HD_ANISOTROPY;let m=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:tx}));m.position.set(x,y,z);m.rotation.y=rotation;world.add(m);return m;
}
function makeLeaderBanner(){
 const portraitScene=new THREE.Scene();portraitScene.background=new THREE.Color(0x4c5752);const clone=subject.clone(true);portraitScene.add(clone);clone.rotation.y=-.13;
 portraitScene.add(new THREE.HemisphereLight(0xffffff,0x414134,2));let light=new THREE.DirectionalLight(0xffe5c6,3.5);light.position.set(2,4,4);portraitScene.add(light);
 let portraitCamera=new THREE.PerspectiveCamera(33,512/640,.1,20);portraitCamera.position.set(0,2,3.2);portraitCamera.lookAt(0,1.98,0);
 const target=new THREE.WebGLRenderTarget(512,640);renderer.setRenderTarget(target);renderer.render(portraitScene,portraitCamera);const pixels=new Uint8Array(512*640*4);renderer.readRenderTargetPixels(target,0,0,512,640,pixels);renderer.setRenderTarget(null);
 const face=document.createElement('canvas');face.width=512;face.height=640;let fc=face.getContext('2d'),data=fc.createImageData(512,640);for(let y=0;y<640;y++)data.data.set(pixels.subarray((639-y)*512*4,(640-y)*512*4),y*512*4);fc.putImageData(data,0,0);target.dispose();
 const c=document.createElement('canvas');c.width=768;c.height=1536;let ctx=c.getContext('2d');ctx.fillStyle='#71766c';ctx.fillRect(0,0,768,1536);ctx.drawImage(face,0,0,768,960);let grad=ctx.createLinearGradient(0,780,0,1100);grad.addColorStop(0,'#202b2400');grad.addColorStop(1,'#202b24');ctx.fillStyle=grad;ctx.fillRect(0,780,768,756);ctx.fillStyle='#d2cbbb';ctx.textAlign='center';ctx.font='bold 82px Arial';ctx.fillText('OUR LEADER.',384,1050);ctx.fillText('OUR GUIDE.',384,1140);ctx.font='24px Georgia';ctx.fillText('PRIME SECRETARY',384,1285);ctx.font='34px Georgia';ctx.fillText('JOSIAH RICHARDS',384,1345);ctx.strokeStyle='#c6b987';ctx.lineWidth=3;ctx.strokeRect(15,15,738,1506);
 for(let i=0;i<1200;i++){ctx.fillStyle=random()>.5?'#0000000c':'#eeeecc09';ctx.fillRect(random()*768,random()*1536,random()*3+1,random()*24+1)}
 let tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;tx.anisotropy=HD_ANISOTROPY;return new THREE.MeshStandardMaterial({map:tx,roughness:1,emissive:0x7b8172,emissiveMap:tx,emissiveIntensity:.28});
}
let sharedNightSkyTexture;
function nightSkyMaterial(){
 if(!sharedNightSkyTexture){sharedNightSkyTexture=new THREE.TextureLoader().load(nightSkyData);sharedNightSkyTexture.colorSpace=THREE.SRGBColorSpace;sharedNightSkyTexture.anisotropy=HD_ANISOTROPY;}
 return new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{time:{value:0},skyMap:{value:sharedNightSkyTexture}},
 vertexShader:'varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:`varying vec3 direction;uniform sampler2D skyMap;
 void main(){vec3 d=normalize(direction);float a=atan(d.z,d.x);float u=abs(fract(a/6.283185+.5)*2.-1.);
 vec3 photo=texture2D(skyMap,vec2(u,clamp(.28+d.y*.85,0.,1.))).rgb;
 vec3 color=mix(vec3(.006,.014,.027),photo,smoothstep(-.18,.08,d.y));
 gl_FragColor=vec4(color,1.);}`});
}
function brentCrossCeilingMaterial(width,depth){
 const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d'),tile=128;x.fillStyle='#c9cbc7';x.fillRect(0,0,512,512);
 for(let y=0;y<4;y++)for(let i=0;i<4;i++){
  const px=i*tile,py=y*tile,shade=226+((i+y)%3-1)*3;x.fillStyle=`rgb(${shade},${shade+1},${shade-2})`;x.fillRect(px+2,py+2,tile-4,tile-4);
  const g=x.createLinearGradient(px,py,px+tile,py+tile);g.addColorStop(0,'rgba(255,255,255,.13)');g.addColorStop(1,'rgba(70,74,73,.07)');x.fillStyle=g;x.fillRect(px+2,py+2,tile-4,tile-4);
 }
 x.strokeStyle='rgba(68,74,75,.42)';x.lineWidth=2;for(let p=0;p<=512;p+=tile){x.beginPath();x.moveTo(p,0);x.lineTo(p,512);x.stroke();x.beginPath();x.moveTo(0,p);x.lineTo(512,p);x.stroke();}
 const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(width/4,depth/4);map.anisotropy=HD_ANISOTROPY;
 return new THREE.MeshStandardMaterial({map,color:0xd0d2cc,roughness:.96,emissive:0x252724,emissiveIntensity:.22});
}
function brentCrossWallMaterial(){
 const map=new THREE.TextureLoader().load(brentCrossWallData);map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(1.5,4);map.anisotropy=HD_ANISOTROPY;
 return new THREE.MeshStandardMaterial({map,color:0xc1b9ae,roughness:.92});
}
function buildWorld(){
 generateMap();
  const concrete=new THREE.MeshStandardMaterial({map:texture('wall'),color:0x9e9e95,roughness:1}),interiorStone=brentCrossWallMaterial();
 const stone=mat(0x555d60),dark=mat(0x1c252a),metal=mat(0x343b40,.58),trim=mat(0x868b80,.55),rust=mat(0x694437),wood=mat(0x4d4134),glass=new THREE.MeshStandardMaterial({color:0x566e70,transparent:true,opacity:.32,roughness:.25,metalness:.35});
 const warm=new THREE.MeshBasicMaterial({color:0xb0b092}),cyan=new THREE.MeshBasicMaterial({color:0x607e82}),red=new THREE.MeshBasicMaterial({color:0xab3024});
  // Marble ends at the south doors; the forecourt keeps its outdoor paving.
  floorTex.repeat.set(N/4,69/4);floorMat.color.setHex(0xffffff);slab(N*CELL,.2,69*CELL,floorMat,40*CELL,-.14,34*CELL);
  const forecourtTex=texture('floor');forecourtTex.wrapS=forecourtTex.wrapT=THREE.RepeatWrapping;forecourtTex.repeat.set(N/4,12/4);
  const forecourtMat=new THREE.MeshStandardMaterial({map:forecourtTex,color:0x8b9494,roughness:.95});
  slab(N*CELL,.2,12*CELL,forecourtMat,40*CELL,-.14,74.5*CELL);
 // Only boundary faces are built; deep inaccessible masses do not waste geometry.
 for(let z=0;z<N;z++)for(let x=0;x<N;x++)if(grid[z][x]===1&&!frontCells.has(x+','+z)&&!(z===68&&x>1&&x<79)){
  let edge=x===0||z===0||x===N-1||z===N-1||[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>grid[z+dz]?.[x+dx]===0);
   if(edge){const inside=x>0&&x<N-1&&z>0&&z<68&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>grid[z+dz]?.[x+dx]===0);slab(CELL,z>=69?2.3:9.7,CELL,inside?interiorStone:concrete,x*CELL,z>=69?1.1:4.8,z*CELL);}
 }
  // Pale modular ceiling panels surround the open grand atrium.
  for(const[x1,z1,x2,z2]of[[3,3,77,25],[3,49,77,67],[3,26,29,48],[51,26,77,48]]){const w=(x2-x1+1)*CELL,d=(z2-z1+1)*CELL;slab(w,.35,d,brentCrossCeilingMaterial(w,d),(x1+x2)*CELL/2,10,(z1+z2)*CELL/2);}
 for(let z=8;z<=65;z+=7)for(const x of[15,40,65]){if(x===40&&z>25&&z<49)continue;slab(6.6,.12,1,warm,x*CELL,9.6,z*CELL);slab(7,.16,1.3,metal,x*CELL,9.8,z*CELL);mallLamps.push({x:x*CELL,y:7,z:z*CELL,color:0xd3c8a6,power:46});}
 for(const z of[17,37,57])for(let x=8;x<=73;x+=9){if(z===37&&x>=30&&x<=50)continue;slab(.85,.1,5.6,cyan,x*CELL,9.6,z*CELL);mallLamps.push({x:x*CELL,y:7,z:z*CELL,color:0x9aafb4,power:40});}
 // Gritty, glass-fronted shops; an open doorway is always reflected in collision.
 const brands=['NORTHLINE','CROWN OPTICS','THE LAST PAGE','STILL / LIFE','ECHO RECORDS','MODERN HOME','JUNO FOOTWEAR','HOLLOW & CO.','ARCADE ELECTRICS','SILVER LANE','THE WATCH ROOM','GOLDEN THREAD','PAPER & INK','AFTER HOURS','VANTAGE','LOST PROPERTY'];
 shopPlans.forEach(s=>{
  let xx=s.front*CELL+s.facing*(CELL/2-.08),zz=(s.za+s.zb)*CELL/2,length=(s.zb-s.za+1)*CELL;
  slab(.3,1.1,length,metal,xx,5.7,zz);slab(.3,3.2,length,dark,xx,8.05,zz);
  for(let z=s.za;z<=s.zb;z++){
   if(z===s.middle&&!s.closed){slab(.2,.12,CELL,warm,xx,5.0,z*CELL);continue;}
   slab(.12,4.9,CELL-.14,s.closed?metal:glass,xx,2.5,z*CELL);
   slab(.21,5,.1,trim,xx+s.facing*.05,2.5,z*CELL-CELL/2);
   if(s.closed)for(let y=.3;y<5;y+=.25)slab(.18,.03,CELL-.14,trim,xx+s.facing*.09,y,z*CELL);
  }
  mallLabel(brands[s.index%brands.length],xx+s.facing*.25,5.7,zz,Math.min(length-1,14),s.facing*Math.PI/2,s.closed?'#92998c':'#d1c4a8','#20292b',.85);
  mallLabel(s.closed?'CLOSED BY ORDER':'FINAL CLEARANCE',xx+s.facing*.3,2.3,(s.za+.35)*CELL,2.2,s.facing*Math.PI/2,'#b6a89a',s.closed?'#393d38':'#542e2a',.8);
  let back=s.facing===1?s.x1*CELL:s.x2*CELL;
  for(let z=s.za+1;z<s.zb;z+=2){slab(.7,2.2,3.5,wood,back,1.1,z*CELL);for(let y=.3;y<2.2;y+=.6)slab(.9,.08,3.55,trim,back+s.facing*.15,y,z*CELL);}
  slab(1.3,1.0,3.5,wood,(s.x1+s.x2)*CELL/2,.5,(s.za+.7)*CELL);
  for(let i=0;i<6;i++){let px=(s.x1+random()*(s.x2-s.x1))*CELL,pz=(s.za+random()*(s.zb-s.za))*CELL;slab(.45,.03,.65,trim,px,.025,pz,random()*TAU);}
 });
 // Atrium: a dry fountain, upper galleries, stalled escalators and a glass roof.
 const centre=pos(40,37);let fountain=mesh(new THREE.CylinderGeometry(5.1,5.4,.9,48),stone,world,centre.x,.35,centre.z);mesh(new THREE.CylinderGeometry(4.7,4.7,.1,48),dark,world,centre.x,.84,centre.z);mesh(new THREE.CylinderGeometry(1.4,2,1.5,20),stone,world,centre.x,1.25,centre.z);
 for(let i=0;i<12;i++){let a=i/12*TAU;slab(.16,.5,.16,trim,centre.x+3.8*Math.cos(a),1.05,centre.z+3.8*Math.sin(a));}
 for(const x of[30,50])for(const z of[26,32,42,48]){slab(1.1,17,1.1,stone,x*CELL,8.5,z*CELL);slab(4,.25,4,trim,x*CELL,16.6,z*CELL);}
 for(const[x1,z1,x2,z2]of[[30,26,32,48],[48,26,50,48],[32,26,48,28],[32,46,48,48]]){
  let w=(x2-x1+1)*CELL,d=(z2-z1+1)*CELL,cx=(x1+x2)*CELL/2,cz=(z1+z2)*CELL/2;slab(w,.45,d,stone,cx,6.8,cz);
  if(w<d){let edge=cx+(cx<140?1:-1)*(w/2-.25);slab(.08,1.2,d,glass,edge,7.6,cz);slab(.15,.12,d,trim,edge,8.2,cz);}else{let edge=cz+(cz<130?1:-1)*(d/2-.25);slab(w,1.2,.08,glass,cx,7.6,edge);slab(w,.12,.15,trim,cx,8.2,edge);}
 }
 slab(72,.06,79,glass,140,17,129.5);for(let x=30;x<=50;x+=2)slab(.18,.35,79,trim,x*CELL,17.2,129.5);for(let z=26;z<=48;z+=3)slab(72,.35,.18,trim,140,17.2,z*CELL);
 function escalator(x,z,reverse){let run=24,steps=36;for(let i=0;i<steps;i++){let h=(i+1)*6.8/steps;slab(2.45,.2,run/steps+.03,metal,x,h,z+(reverse?-1:1)*i*run/steps);}for(const side of[-1,1]){let rail=box(world,.14,.14,Math.hypot(run,6.8),dark,x+side*1.27,4.35,z+(reverse?-1:1)*run/2);rail.rotation.x=(reverse?1:-1)*Math.atan2(6.8,run);}slab(3.3,.12,.5,rust,x,.9,z-.7);mallLabel('OUT OF SERVICE',x,1.1,z-1,2.7,Math.PI,'#cdb071','#322f23',.35);}
 escalator(31*CELL,31*CELL,false);escalator(49*CELL,43*CELL,true);
 mallLabel('BRENT CROSS',140,12.5,26*CELL+.3,30,0,'#c7c6ab','#202b2e',2.4);
 mallLabel('THE GRAND ATRIUM',140,5.5,48*CELL+2,13,0,'#c7c6ab','#26302c',1);
 for(const[x,z]of[[34,28],[46,28],[34,46],[46,46],[33,40],[47,34]]){
  slab(2.8,.7,2.8,stone,x*CELL,.35,z*CELL);slab(2.55,.06,2.55,wood,x*CELL,.72,z*CELL);
  for(let i=0;i<7;i++){let h=1.2+random()*1.2;slab(.065,h,.065,wood,x*CELL+random()*1.4-.7,.7+h/2,z*CELL+random()*1.4-.7,random()*TAU,random()*.5-.25);}
 }
 const paper=mat(0x868272);for(let i=0;i<210;i++){let x=4+Math.floor(random()*73),z=5+Math.floor(random()*73);if(grid[z][x]===0)slab(.25+random()*.45,.006,.3+random()*.55,paper,x*CELL+random()*1.5,.004,z*CELL+random()*1.5,random()*TAU);}
 // Food court and anchor tenants create distinct destinations instead of a maze.
 mallLabel('THE FOOD COURT',16*CELL,6,14*CELL,37,0,'#d2b88c','#292721',2);
 for(let x=6;x<=26;x+=4){slab(10,2.5,2.5,wood,x*CELL,1.25,4*CELL);mallLabel(['NAKED CHIPS','WOK AFTER DARK','CAFE UNION','SWEET NOTHING','PIZZA PALACE','LAST ORDERS'][Math.floor((x-6)/4)],x*CELL,4,4*CELL+1.3,10,0,'#cbbb94','#303131',1.3);}
 for(const[x,z]of[[8,9],[23,9]]){mesh(new THREE.CylinderGeometry(1.2,1.2,.13,20),wood,world,x*CELL,1,z*CELL);slab(.16,1,.16,metal,x*CELL,.5,z*CELL);for(const side of[-1,1]){slab(.65,.12,.65,rust,x*CELL+side*1.55,.65,z*CELL);slab(.65,.65,.1,wood,x*CELL+side*1.55,1,z*CELL+.3);}}
 mallLabel('NORTHSTAR',64*CELL,6,14*CELL,30,0,'#c2c0bb','#24262d',2.2);
 for(const[x,z]of[[56,7],[61,7],[69,7],[56,11],[61,11],[69,11]]){slab(2.6,2.3,2.8,metal,x*CELL,1.15,z*CELL);for(let y=.3;y<2.5;y+=.55)slab(2.9,.08,3,wood,x*CELL,y,z*CELL);}
 mallLabel('CINEMA  /  LAST SCREENING',16*CELL,6,60*CELL-1,35,Math.PI,'#d6ae88','#2b2322',2);
 for(const base of[6,20]){slab(11,4,.2,dark,(base+1)*CELL,3,66*CELL);for(let x=base;x<base+3;x++)for(let z=61;z<64;z++){slab(1.3,.4,1.1,rust,x*CELL,.55,z*CELL);slab(1.3,1.1,.25,rust,x*CELL,1,z*CELL-0.4);}}
 mallLabel('MARKET HALL',64*CELL,6,60*CELL-1,30,Math.PI,'#b7b9a0','#29342d',2);
 for(let x=56;x<75;x+=4)for(const z of[62,65]){slab(7,.12,1.5,wood,x*CELL,1,z*CELL);slab(.12,1,1.3,metal,x*CELL-2.8,.5,z*CELL);slab(.12,1,1.3,metal,x*CELL+2.8,.5,z*CELL);}
 for(const[x,z,name]of[[15,54,'FOOD COURT ↑   CINEMA ↓'],[65,54,'NORTHSTAR ↑   MARKET HALL ↓'],[40,54,'GRAND ATRIUM ↑   EXIT ↓'],[40,20,'WEST ARCADE ←   EAST ARCADE →']]){mallLabel(name,x*CELL,5.5,z*CELL,14,0,'#bac9bb','#173030',1.05);slab(.04,4,.04,metal,x*CELL-6.5,7.6,z*CELL);slab(.04,4,.04,metal,x*CELL+6.5,7.6,z*CELL);}
 // The reference forecourt: monumental fascia, political banner, fenced play area,
 // parked cars, bollards, blue-grey floodlights and weathered paving.
 const frontZ=68*CELL;
 slab(119,17,2,concrete,65.5,8.4,frontZ);slab(119,17,2,concrete,214.5,8.4,frontZ);
 slab(28,11.1,2,stone,140,11.35,frontZ);slab(265,1.1,2.5,dark,140,17,frontZ);
 for(let x=8;x<=75;x+=5){slab(14,.8,.08,glass,x*CELL,6.15,frontZ+1.07);slab(14,.08,.12,trim,x*CELL,5.72,frontZ+1.12);}
 mallLabel('BRENT CROSS',43*CELL,13,frontZ+1.13,55,0,'#b6bab8','#343c41',5.8);
 mallLabel('GOVERNMENT COMPLEX',43*CELL,9.1,frontZ+1.15,55,0,'#939e9e','#343c41',2.6);
 // Entrance is an open, 24.5 metre-wide passage through the facade.
 for(const x of[37,39,41,43]){slab(.18,5.5,.35,trim,x*CELL,2.7,frontZ+.9);}
 slab(25,.35,5,dark,40*CELL,5.6,frontZ+2);mallLabel('WELCOME TO BRENT CROSS',40*CELL,5.05,frontZ+4.6,20,0,'#cfb784','#272a27',.8);
 mallLabel('ENTRANCE  /  SOUTH CONCOURSE',40*CELL,4.1,frontZ-3,15,0,'#a5b9ab','#25322c',.7);
 const posterMat=makeLeaderBanner();let poster=mesh(new THREE.PlaneGeometry(8.5,17),posterMat,world,33*CELL,8.5,frontZ+2.2);slab(8.9,17.4,.3,trim,33*CELL,8.5,frontZ+2);for(const x of[31.7,34.3])slab(.2,17.3,.3,metal,x*CELL,8.5,frontZ+2.4);
 mallLabel('UNION CROWN',26*CELL,12.5,frontZ+1.2,14,0,'#988b66','#1e2526',2.5);mallLabel('ORDER  /  DUTY  /  UNITY',26*CELL,9.3,frontZ+1.2,14,0,'#988b66','#1e2526',.8);
 // Three-dimensional crown above the state motto.
 for(let i=0;i<5;i++){let cone=mesh(new THREE.ConeGeometry(.45,2.2,4),trim,world,26*CELL-2.4+i*1.2,15,frontZ+1.7);cone.rotation.z=(i-2)*-.12;}slab(5.8,.3,.6,trim,26*CELL,13.9,frontZ+1.7);
 // Rain-dark forecourt, raised borders and a clear pedestrian route.
 const pavingTexture=texture('floor');pavingTexture.repeat.set(4,4);const paving=new THREE.MeshStandardMaterial({map:pavingTexture,color:0xaab0ac,roughness:.8});
 for(let z=70;z<=79;z+=2)for(let x=30;x<=46;x+=2)slab(6.95,.035,6.95,paving,x*CELL,.015,z*CELL);
 for(const x of[35,44])for(let z=71;z<=79;z+=3){mesh(new THREE.CylinderGeometry(.13,.19,1.2,10),metal,world,x*CELL,.6,z*CELL);slab(.29,.12,.29,trim,x*CELL,.97,z*CELL);}
 for(const[x,z]of[[23,75],[27,75],[23,78],[27,78]]){
  let car=new THREE.Group();world.add(car);car.position.copy(pos(x,z));let paint=mat(x===23?0x29465a:0x444440,.38);box(car,2.2,.75,4.1,paint,0,.8,0);box(car,1.9,.8,2.3,glass,0,1.5,-.15);box(car,1.96,.12,2.4,paint,0,1.95,-.15);for(const sx of[-1,1])for(const sz of[-1,1]){let wheel=mesh(new THREE.CylinderGeometry(.46,.46,.24,12),dark,car,sx*1.08,.46,sz*1.25);wheel.rotation.z=Math.PI/2;}box(car,1.75,.15,.08,red,0,.95,2.09);
 }
 for(let x=21;x<30;x+=2){slab(.08,.025,30,trim,x*CELL,.01,75*CELL);}
 // Derelict playground occupies its own fenced island to the right of the path.
 let px=52.5*CELL,pz=74*CELL;slab(35,.1,17.5,mat(0x283b3b),px,.04,pz);
 for(let x=48;x<=57;x+=.4)for(const z of[71.5,76.5])slab(.045,1.8,.045,metal,x*CELL,.9,z*CELL);
 for(let z=71.5;z<=76.5;z+=.4)for(const x of[47.5,57.5])slab(.045,1.8,.045,metal,x*CELL,.9,z*CELL);
 for(const y of[.4,1.6]){for(const z of[71.5,76.5])slab(35,.06,.06,metal,px,y,z*CELL);for(const x of[47.5,57.5])slab(.06,.06,17.5,metal,x*CELL,y,pz);}
 for(const x of[50,55]){for(const side of[-1,1])slab(.16,5,.16,rust,x*CELL+side*1.6,2.5,pz,0,side*.24);slab(4.5,.16,.16,rust,x*CELL,5,pz);for(const dx of[-.6,.6])slab(.025,3.1,.025,metal,x*CELL+dx,3.35,pz);slab(1.5,.13,.6,wood,x*CELL,1.75,pz);}
 for(let x=58;x<74;x+=3){slab(3,.6,3,stone,x*CELL,.3,72*CELL);for(let i=0;i<6;i++)slab(.08,1.8+random(),.08,wood,x*CELL+random()*2-1,1.5,72*CELL+random()*2-1,random()*TAU,random()*.6-.3);}
 for(const x of[31,48,62]){slab(.18,18,.18,metal,x*CELL,9,frontZ+1.9);slab(.9,.25,.45,warm,x*CELL,17.8,frontZ+2.1);mallLamps.push({x:x*CELL,y:12,z:frontZ+7,color:0xbccbdd,power:260});}
 for(let i=0;i<2;i++){let lamp=new THREE.SpotLight(0xcbd9e6,180,65,.65,.7,1.5);lamp.position.set((i?51:31)*CELL,16,frontZ+4);lamp.target.position.set((i?44:35)*CELL,2,frontZ+18);world.add(lamp,lamp.target);}
 // Restore the four wings, then unlock the south evacuation gate.
 for(const[idx,x,z,zone]of[[0,6,7,'FOOD COURT'],[1,74,8,'NORTHSTAR'],[2,7,64,'CINEMA'],[3,74,64,'MARKET HALL']]){
  let group=new THREE.Group();group.position.copy(pos(x,z));world.add(group);box(group,.8,1.4,.45,metal,0,1.1,0);box(group,.67,1.0,.025,dark,0,1.25,.24);let lamp=box(group,.36,.12,.035,new THREE.MeshStandardMaterial({color:0xe7b563,emissive:0xe7b563,emissiveIntensity:1.7}),0,1.56,.26);let lever=box(group,.06,.3,.1,trim,0,1.13,.29);lever.rotation.z=.5;let label=sign('RELAY 0'+(idx+1),'#d9bd77');label.position.set(0,2.2,.21);group.add(label);let light=new THREE.PointLight(0xeab468,5,8,1.5);light.position.set(0,2,.8);group.add(light);fuses.push({x,z,zone,group,light,lamp,lever,active:false});mallLabel(zone,x*CELL,3.5,z*CELL,8,0,'#c3b681','#23302b',.7);
 }
 mallLabel('SOUTH GATE  /  EVACUATION',exitCell.x*CELL,3.2,79*CELL,18,Math.PI,'#a4d2b3','#213e30',1.2);
 for(const side of[-1,1])slab(.45,3,.45,metal,exitCell.x*CELL+side*7,1.5,79*CELL);slab(14,.12,.16,rust,exitCell.x*CELL,1.1,79*CELL);mallLamps.push({x:exitCell.x*CELL,y:3,z:78*CELL,color:0x80b99b,power:30});
 // Storm clouds, generated in a shader; no external images or network requests.
 const skyGeo=new THREE.SphereGeometry(500,32,16);const skyMat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{time:{value:0}},vertexShader:'varying vec3 v;void main(){v=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 v;uniform float time;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}void main(){vec3 d=normalize(v);vec2 p=d.xz/max(.17,d.y+.35)*3.;p.x+=time*.003;float f=n(p)*.55+n(p*2.1)*.27+n(p*4.2)*.13;vec3 c=mix(vec3(.025,.033,.05),vec3(.19,.205,.26),f*f);gl_FragColor=vec4(c,1.);}'});const sky=mesh(skyGeo,skyMat,world,140,0,140);sky.renderOrder=-10;world.userData.sky=sky;
  skyMat.dispose();sky.material=nightSkyMaterial();
  let moon=new THREE.DirectionalLight(0xb2bfd6,.85);moon.position.set(100,190,240);world.add(moon);world.userData.moon=moon;
 for(let i=0;i<6;i++){let light=new THREE.PointLight(0xc4c4b0,0,35,1.6);world.add(light);mallLights.push(light);}
 finishBatches();world.visible=false;
}
let mallMapBase=null,mallLightTick=0,mapTick=0;
function buildMallMapBase(){let c=document.createElement('canvas');c.width=c.height=810;let ctx=c.getContext('2d'),s=810/N;ctx.fillStyle='#0b1215';ctx.fillRect(0,0,810,810);for(let z=0;z<N;z++)for(let x=0;x<N;x++){ctx.fillStyle=grid[z][x]===0?(z>=69?'#35413f':'#43524e'):grid[z][x]===2?'#25312f':'#192524';ctx.fillRect(x*s,z*s,s-.5,s-.5)}mallMapBase=c;}
function paintMap(canvas,mini){if(!mallMapBase)buildMallMapBase();let c=canvas.getContext('2d'),size=canvas.width,s=size/N;c.clearRect(0,0,size,size);c.drawImage(mallMapBase,0,0,size,size);
 if(!mini){c.font='bold 9px monospace';c.textAlign='center';c.fillStyle='#b0bcb0';for(const zone of mallZones)c.fillText(zone.name,(zone.x+.5)*s,(zone.z+.5)*s-12);}
 for(const f of fuses){if(f.level!==currentFloor)continue;c.fillStyle=f.active?'#78dba0':'#e7be67';c.save();c.translate((f.x+.5)*s,(f.z+.5)*s);c.rotate(Math.PI/4);let r=mini?3:4;c.fillRect(-r,-r,r*2,r*2);c.restore();}
 c.strokeStyle=currentFloor===0?'#8cf2b0':'transparent';c.lineWidth=1.8;c.strokeRect((exitCell.x+.5)*s-4,(exitCell.z+.5)*s-4,8,8);
 if((subject.position.level||0)===currentFloor&&!hunterGone(subject)){ const ex=(subject.position.x/CELL+.5)*s,ez=(subject.position.z/CELL+.5)*s;c.fillStyle='#ff3038';c.shadowColor='#ff1525';c.shadowBlur=mini?8:12;c.beginPath();c.arc(ex,ez,mini?3.7:5,0,TAU);c.fill();c.shadowBlur=0;c.strokeStyle='#ffaaaa';c.lineWidth=1;c.stroke();}
 if((peter.position.level||0)===currentFloor&&!hunterGone(peter)){ const gx=(peter.position.x/CELL+.5)*s,gz=(peter.position.z/CELL+.5)*s;c.fillStyle='#b83250';c.shadowColor='#b83250';c.shadowBlur=mini?6:9;c.beginPath();c.arc(gx,gz,mini?2.8:4.5,0,TAU);c.fill();c.shadowBlur=0;c.strokeStyle='#ff879c';c.lineWidth=.8;c.stroke();}
 if((alissa.position.level||0)===currentFloor&&!hunterGone(alissa)){ const ax=(alissa.position.x/CELL+.5)*s,az=(alissa.position.z/CELL+.5)*s;c.fillStyle=alissaAI.allied?"#53b9ff":"#ffe34b";c.beginPath();c.arc(ax,az,mini?3:4.5,0,TAU);c.fill();}
 if(currentFloor===0){const qx=(gareth.position.x/CELL+.5)*s,qz=(gareth.position.z/CELL+.5)*s;c.fillStyle=garethRemainsAlly()?"#53b9ff":"#b6abb9";c.fillRect(qx-3,qz-3,6,6);if(garethQuest==="accepted"){c.strokeStyle="#53b9ff";c.strokeRect((questCase.position.x/CELL+.5)*s-4,(questCase.position.z/CELL+.5)*s-4,8,8);}}
 c.fillStyle='#88ccff';c.font='bold 9px monospace';c.fillText(currentFloor?'LEVEL 1':'GROUND',8,14);for(const l of liftCells){c.strokeStyle='#88ccff';c.strokeRect((l.x+.5)*s-4,(l.z+.5)*s-4,8,8);}
 c.save();c.translate((player.x/CELL+.5)*s,(player.z/CELL+.5)*s);c.rotate(-yaw);c.fillStyle='#efffff';c.strokeStyle='#071417';c.lineWidth=1.5;c.beginPath();c.moveTo(0,mini?-5.5:-8);c.lineTo(mini?-3.5:-5,mini?4:6);c.lineTo(mini?3.5:5,mini?4:6);c.closePath();c.stroke();c.fill();c.restore();
}
function drawMap(){paintMap($('map'),false);}
function updateMall(dt){
 ambient.intensity=currentFloor?.15:player.z>=68*CELL?.22:.18;
 world.userData.moon.intensity=player.z>=68*CELL?.20:.10;
 mallLightTick-=dt;mapTick-=dt;
 if(mallLightTick<=0){let nearest=mallLamps.slice().sort((a,b)=>((a.x-player.x)**2+(a.z-player.z)**2)-((b.x-player.x)**2+(b.z-player.z)**2)).slice(0,6);nearest.forEach((p,i)=>{mallLights[i].position.set(p.x,p.y,p.z);mallLights[i].color.setHex(p.color);mallLights[i].intensity=p.power*.22;});mallLightTick=.3;
 let nearestZone=mallZones.reduce((a,b)=>Math.hypot(a.x*CELL-player.x,a.z*CELL-player.z)<Math.hypot(b.x*CELL-player.x,b.z*CELL-player.z)?a:b);const tile=cell(player);if(tile.z>=69)nearestZone=mallZones[8];else if(tile.x>=30&&tile.x<=50&&tile.z>=26&&tile.z<=48)nearestZone=mallZones[4];$('location').textContent=(currentFloor?'LEVEL 1 / ':'GROUND / ')+nearestZone.name;
 }
 if(mapTick<=0){paintMap($('minimap'),true);$('josiahDistance').textContent=(subject.position.level||0)!==currentFloor?'OTHER FLOOR':hunterGone(subject)?'GONE':Math.round(subject.position.distanceTo(player))+' m';$('peterDistance').textContent=(peter.position.level||0)!==currentFloor?'OTHER FLOOR':hunterGone(peter)?'GONE':Math.round(peter.position.distanceTo(player))+' m';if(mapOpen)drawMap();mapTick=.1;}
 world.userData.sky.material.uniforms.time.value=elapsed;
 for(const l of liftCells){/* Lift locations are shown on either floor below. */}
 syncFloorActors();
}
