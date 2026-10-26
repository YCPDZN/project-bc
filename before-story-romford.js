/* Chris Pinter's second chapter: an owned cinematic, outside the campaign. */
const PINTER_ROMFORD_LINES=[
 '2021. I stood beneath the canopy of the building on the left, watching the rain turn the street into a sheet of trembling silver. For once, there was nobody running towards me, nobody shouting for help. Only the gutters, the clock above the shops, and a town carrying on without asking what was on my mind.',
 'Two years had passed since the Heath. People spoke about that night as though it had finished when the last suspect was taken away. Reports were filed, statements signed, and the streets reopened. But a case can be closed while the people inside it are still trying to find their way out.',
 'I remembered the officers beside me in Dagenham: tired eyes, wet uniforms, jokes that stopped the moment the radio crackled. Courage rarely looked like the posters in the station. Usually it was someone swallowing their fear and taking another step because the person behind them could not afford to be left alone.',
 'Jake Stevens had wanted his name to own a neighbourhood. I had wanted the people living there to stop being afraid of it. We stopped him, but I kept wondering how many boys had already learned his lesson: that being feared was easier than being heard. You cannot put that lesson in handcuffs.',
 'Across the road, the shop windows glowed through the rain. Someone had arranged those displays, counted the till, worried about the rent. Behind every incident number was a life with ordinary things to lose. I needed to remember that, especially on the days when the paperwork made everybody look like a problem to be processed.',
 'The uniform gave me authority. It did not give me the right to stop listening. There were people who saw a police officer and felt safer, and people who saw the same officer and braced themselves. If I pretended that difference did not exist, I would never understand the streets I was supposed to protect.',
 'I used to think keeping order meant knowing exactly where the line was. Lately, I had watched decent people pushed towards it by exhaustion, anger, and the feeling that nobody would answer them. That did not excuse hurting someone. It did mean that restoring silence was not always the same thing as restoring peace.',
 'A gust blew rain beneath the edge of the canopy, and I stepped closer to the wall. Even here, out of the downpour, I could not make the weather stop. Perhaps that was what troubled me most about the job: the temptation to mistake a little shelter for control over the whole storm.',
 'I wondered what kind of man I would become if the pressure kept building. Would I still recognise the moment a necessary decision became a convenient cruelty? Would I speak up when it cost me something? It was easy to answer those questions in an empty street. The answers that mattered would come when somebody was watching.',
 'The clock moved on. I straightened my jacket and looked out towards the road again. I could not promise this town a world without fear, and I could not undo what Dagenham had already suffered. But I could keep showing up, keep listening, and refuse to forget who the uniform was meant to serve. For that rainy afternoon, it had to be enough.'
];
try{beforeStoryProgress.chrisRomfordCompleted=JSON.parse(localStorage.getItem(BEFORE_STORY_SAVE_KEY))?.chrisRomfordCompleted===true;}catch(e){beforeStoryProgress.chrisRomfordCompleted=false;}
const romfordChapterCard=document.createElement('article');romfordChapterCard.className='before-story-next-chapter';
romfordChapterCard.innerHTML='<small>FINAL CHAPTER / 2021 / CUTSCENE</small><h2>SANCTUARY</h2><p>Chris shelters from the rain and reflects on the years since the Heath.</p><button id="beforeStoryRomford" type="button" disabled>COMPLETE CHAPTER 1 TO UNLOCK</button>';
document.getElementById('beforeStoryChrisBack').before(romfordChapterCard);
const romfordPreviousRefresh=refreshBeforeStoryChapters;
refreshBeforeStoryChapters=function(){romfordPreviousRefresh();const button=document.getElementById('beforeStoryRomford');button.disabled=!beforeStoryProgress.chrisHeathCompleted;button.textContent=button.disabled?'COMPLETE CHAPTER 1 TO UNLOCK':beforeStoryProgress.chrisRomfordCompleted?'REPLAY FINAL CHAPTER · SANCTUARY →':'BEGIN FINAL CHAPTER · SANCTUARY →';};
refreshBeforeStoryChapters();

function romfordSurface(kind){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d');
 ctx.fillStyle=kind==='brick'?'#aa8260':'#46525c';ctx.fillRect(0,0,256,256);
 for(let i=0;i<2200;i++){const x=(i*83)%256,y=(i*137+Math.floor(i/256)*17)%256;ctx.fillStyle=i%2?'#ffffff0b':'#00000012';ctx.fillRect(x,y,2,2);}
 if(kind==='brick'){ctx.strokeStyle='#6c5948';ctx.lineWidth=2;for(let row=0;row<16;row++){const y=row*16;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(256,y);ctx.stroke();for(let col=-1;col<5;col++){const x=col*64+(row%2)*32;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+16);ctx.stroke();}}}
 const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(kind==='brick'?2:8,kind==='brick'?3:18);
 return new THREE.MeshStandardMaterial({map,color:0xffffff,roughness:kind==='brick'?.9:.28,metalness:kind==='brick'?0:.18});
}
function buildPinterRomford(){
 const c=beforeStoryScene,root=new THREE.Group();root.name='Chris Pinter / Sanctuary / rainy day 2021';c.root.add(root);
 const b=c.romford={root,time:0,line:0,beat:0},brick=romfordSurface('brick'),road=romfordSurface('road'),cream=mat(0xc6c4b4),trim=mat(0x7f8077),roof=mat(0x41454b),glass=mat(0x354954),stone=mat(0x8c9395),warm=new THREE.MeshBasicMaterial({color:0xddcfa1}),ink=mat(0x292d33);
 box(root,120,.3,150,mat(0x606c72),0,-.25,-30);box(root,17,.08,115,road,0,-.05,-34);
 for(const side of [-1,1]){box(root,5,.12,115,stone,side*11,.02,-34);box(root,.24,.24,115,cream,side*8.55,.035,-34);}
 for(let z=8;z>-90;z-=8)box(root,.12,.012,3,cream,0,.006,z);
 // The sheltered pavement, clock tower and continuous left-hand arcade follow the reference.
 const tower=new THREE.Group();tower.name='Left clock tower and sheltered shopfront';tower.position.set(-15,0,2);root.add(tower);
 box(tower,8,17,10,brick,0,8.5,0);box(tower,8.5,.22,10.5,cream,0,15,0);box(tower,8.1,2.7,10.1,cream,0,16.4,0);
 for(const x of [-3,-1,1,3])box(tower,.17,2.6,.12,ink,x,16.4,5.14);
 const gable=new THREE.Shape();gable.moveTo(-4.3,0);gable.lineTo(0,3);gable.lineTo(4.3,0);gable.closePath();const pitched=mesh(new THREE.ExtrudeGeometry(gable,{depth:11,bevelEnabled:false}),roof,tower,0,17.75,-5.5);pitched.name='Clock tower pitched roof';
 for(const y of [5,8,11,13.5])for(const x of [-2,2]){box(tower,1.6,1.8,.10,cream,x,y,5.08);box(tower,1.3,1.5,.12,glass,x,y,5.15);box(tower,.05,1.5,.04,cream,x,y,5.23);}
 const clockCanvas=document.createElement('canvas');clockCanvas.width=clockCanvas.height=256;const clockCtx=clockCanvas.getContext('2d');clockCtx.fillStyle='#d8d2bc';clockCtx.beginPath();clockCtx.arc(128,128,118,0,TAU);clockCtx.fill();clockCtx.strokeStyle='#30373c';clockCtx.lineWidth=7;
 for(let i=0;i<12;i++){const a=i*TAU/12;clockCtx.beginPath();clockCtx.moveTo(128+Math.sin(a)*90,128-Math.cos(a)*90);clockCtx.lineTo(128+Math.sin(a)*104,128-Math.cos(a)*104);clockCtx.stroke();}clockCtx.lineWidth=10;clockCtx.beginPath();clockCtx.moveTo(85,101);clockCtx.lineTo(128,128);clockCtx.lineTo(177,80);clockCtx.stroke();
 const clock=mesh(new THREE.CircleGeometry(1.05,32),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(clockCanvas)}),tower,0,16.5,5.18);clock.name='Sanctuary clock';
 for(let i=0;i<8;i++){
 const z=2-i*12;box(root,8,8,11,brick,-15,4,z-10);box(root,7.9,.3,11.1,cream,-15,8,z-10);
 for(const dz of [-3.3,0,3.3]){box(root,.14,2.9,2.8,glass,-10.94,1.75,z-10+dz);box(root,.16,.07,2.8,trim,-10.84,1.75,z-10+dz);}
 const awning=box(root,3.8,.28,12,roof,-9.3,3.25,z);awning.name='Left covered pavement';
 for(const dz of [-5.6,5.6])box(root,.15,3.15,.15,trim,-7.55,1.57,z+dz);
 for(const dz of [-3.5,3.5])box(root,.09,1.6,1.6,glass,-10.94,5.8,z-10+dz);
 box(root,.12,.14,10,warm,-10.1,2.96,z);
 // Pale commercial block and illuminated windows on the opposite side.
 const block=new THREE.Group();block.position.set(15,0,z-4);root.add(block);box(block,8,7.7,11,cream,0,3.85,0);box(block,8.3,.18,11.3,trim,0,7.8,0);
 for(const dz of [-3.5,0,3.5]){box(block,.12,2.5,2.8,glass,-4.06,5.45,dz);box(block,.15,2.7,2.8,glass,-4.08,1.6,dz);box(block,.17,.12,2.8,trim,-4.16,1.7,dz);}
 box(block,.18,.8,10,mat(i%2?0x697076:0x565c65),-4.13,3.55,0);box(block,.2,.11,10,warm,-4.15,2.95,0);
 }
 const title=heathSign('SANCTUARY','#d4d8cb','#37434a',4);title.position.set(-10.77,2.6,3.7);title.rotation.y=Math.PI/2;root.add(title);
 // Bus shelter, bollards, islands and lamps make the empty street feel inhabited.
 for(let z=12;z>-85;z-=18){for(const side of [-1,1]){box(root,.12,6,.12,ink,side*8,3,z);box(root,1.1,.15,.42,warm,side*8,6,z);ball(root,.28,.07,.2,warm,side*8,5.9,z);box(root,.15,.7,.15,ink,side*8.7,.4,z+3);}}
 const shelter=new THREE.Group();shelter.name='Right bus shelter';shelter.position.set(9.6,0,12);root.add(shelter);box(shelter,2.2,.14,4,roof,0,2.6,0);for(const z of [-1.7,1.7])box(shelter,.08,2.5,.08,trim,.9,1.25,z);
 const clearGlass=new THREE.MeshStandardMaterial({color:0xadc2c8,transparent:true,opacity:.28,roughness:.1,side:THREE.DoubleSide});box(shelter,.04,2.1,3.7,clearGlass,.9,1.25,0);box(shelter,.5,.1,3,trim,.4,.65,0);
 box(root,1.1,.18,5,stone,1,.1,-10);box(root,1,.18,4,stone,-1,.1,-46);
 for(let i=0;i<28;i++){const puddle=mesh(new THREE.CircleGeometry(.45+i%5*.16,24),new THREE.MeshStandardMaterial({color:0x7c96a4,transparent:true,opacity:.35,roughness:.09,metalness:.32}),root,(i%2?1:-1)*(2+i%6),.012,12-i*3.6);puddle.rotation.x=-Math.PI/2;puddle.scale.y=.35;puddle.name='Rain puddle';}
 box(root,25,3,1,mat(0x6b7277),0,8,-88);box(root,50,10,7,brick,0,5,-97);
 root.add(new THREE.HemisphereLight(0xc6d9e6,0x626466,1.55));const daylight=new THREE.DirectionalLight(0xc5d8e4,1.35);daylight.position.set(10,30,20);root.add(daylight);
 const canopyLight=new THREE.PointLight(0xf4d6ac,11,9);canopyLight.position.set(-9,2.9,6);root.add(canopyLight);
 b.hero=isolateBeforeStoryModel(makeChrisPinter());b.hero.name='Chris Pinter / BC-01 / sheltering in Sanctuary 2021';b.hero.position.set(-9.5,.08,5);b.hero.rotation.y=.72;root.add(b.hero);b.hero.userData.mouth.visible=false;b.hero.userData.mouth=line3(b.hero.userData.head,[[-.11,-.229,.275],[0,-.221,.305],[.11,-.229,.275]],mat(0x282027),.008);b.mouth=makeBeforeStorySpeechMouth('romfordPinter',b.hero);b.hero.traverse(o=>{if(o.name==='Pinter smile teeth')o.visible=false;});if(b.hero.userData.smileCrease)b.hero.userData.smileCrease.visible=false;
 const drops=new Float32Array(1800*6);for(let i=0;i<1800;i++){const x=-24+(i*7.317)%48,z=23-(i*13.391)%113,y=.2+(i*3.177)%18;const offset=i*6;drops.set([x,y,z,x+.07,y-.46,z+.025],offset);}
 const rainGeometry=new THREE.BufferGeometry();rainGeometry.setAttribute('position',new THREE.BufferAttribute(drops,3));b.rain=new THREE.LineSegments(rainGeometry,new THREE.LineBasicMaterial({color:0xaec8d9,transparent:true,opacity:.42}));b.rain.name='Rain / excluded beneath left arcade';root.add(b.rain);
 return b;
}
function clearPinterRomford(){const c=beforeStoryScene;if(!c?.romford)return;disposeCampObject(c.romford.root);c.romford=null;beforeStoryCinema.removeAttribute('data-romford');keys.clear();}
function startPinterRomford(){
 const c=beforeStoryScene;if(!c||mode!=='beforeStoryMenu'||!beforeStoryProgress.chrisHeathCompleted)return;
 clearBeforeStoryHeath();clearPinterRomford();stopBeforeStoryVoice();stopHeathChrisVoice();stopHeathJakeVoice();
 for(const key of ['menuSet','romeSet','jukoSet','lastJukoSet','heathNarrationSet'])if(c[key])c[key].visible=false;for(const actor of Object.values(c.cast))actor.visible=false;if(c.crownMenu)c.crownMenu.visible=false;
 c.story='chris';c.chapter='chrisRomford';buildPinterRomford();beforeStoryUI.hidden=true;beforeStoryCinema.hidden=false;beforeStoryCinema.dataset.romford='true';setMode('beforeStoryRomford');hideUndeadCampaignCast();world.visible=upperWorld.visible=exhibit.visible=flash.visible=false;keys.clear();scene.background.setHex(0x879ba9);scene.fog.color.setHex(0x879ba9);scene.fog.density=.012;ambient.intensity=.9;cameraFill.intensity=.5;
 document.getElementById('beforeStoryCinemaChapter').textContent='BEFORE THE STORY / CHRIS PINTER / FINAL CHAPTER';document.getElementById('beforeStoryCinemaTitle').innerHTML='SANCTUARY <span>2021</span>';showPinterRomfordLine();renderPinterRomford(0);syncMenuSong();updateMobileControls();
}
function showPinterRomfordLine(){const b=beforeStoryScene.romford;b.beat=0;b.timeline=beforeStorySpeechTimeline(PINTER_ROMFORD_LINES[b.line]);document.getElementById('beforeStorySpeaker').textContent='CHRIS PINTER / BC-01';document.getElementById('beforeStoryLine').textContent=PINTER_ROMFORD_LINES[b.line];document.getElementById('beforeStoryCount').textContent=(b.line+1)+' / 10';document.getElementById('beforeStoryNext').textContent=b.line===9?'FINISH CHAPTER →':'CONTINUE →';}
function returnPinterRomford(){clearPinterRomford();returnBeforeStoryHeath();document.getElementById('beforeStoryRomford').focus();}
function advancePinterRomford(){const b=beforeStoryScene?.romford;if(mode!=='beforeStoryRomford'||!b)return;if(b.line===9){beforeStoryProgress.chrisRomfordCompleted=true;saveBeforeStoryProgress();refreshBeforeStoryChapters();returnPinterRomford();}else{b.line++;showPinterRomfordLine();}}
function renderPinterRomford(dt){
 const c=beforeStoryScene,b=c?.romford;if(!b)return;b.time+=dt;b.beat+=dt;const a=b.hero;a.userData.body.position.y=Math.sin(b.time*1.6)*.009;a.userData.head.rotation.x=.025+Math.sin(b.time*.5)*.018;a.userData.head.rotation.y=Math.sin(b.time*.23)*.055;for(const arm of a.userData.arms)arm.rotation.x=-.035;
 const level=sanctuaryChrisVoiceLevel();b.mouth.open.visible=level>.04;b.mouth.open.scale.set(b.mouth.width,.006+level*.023,.009);b.mouth.closed.visible=!b.mouth.open.visible;
 const p=b.rain.geometry.attributes.position;for(let i=0;i<p.count;i+=2){let x=p.getX(i)+dt*.65,y=p.getY(i)-dt*13,z=p.getZ(i);if(y<0)y+=18;if(x>24)x-=48;const underCover=x>=-11.2&&x<=-7.4&&z>=-88&&z<=8&&y<3.45;p.setXYZ(i,x,y,z);p.setXYZ(i+1,underCover?x:x+.07,underCover?y:y-.46,underCover?z:z+.025);}p.needsUpdate=true;
 // Continuous upright dolly from the street into a sheltered, readable portrait.
 const approach=THREE.MathUtils.smoothstep(b.time,0,8),position=new THREE.Vector3(4,5,26).lerp(new THREE.Vector3(-6.5,2.52,8.2),approach),target=new THREE.Vector3(-6,5,-5).lerp(new THREE.Vector3(-9.5,1.94,5),approach);position.x+=Math.sin(b.time*.08)*.13;camera.up.set(0,1,0);camera.position.copy(c.root.position).add(position);camera.lookAt(c.root.position.clone().add(target));camera.updateMatrixWorld(true);
 if(sanctuaryChrisLineComplete(dt))advancePinterRomford();
}
document.getElementById('beforeStoryRomford').onclick=startPinterRomford;
const romfordPreviousNext=document.getElementById('beforeStoryNext').onclick;document.getElementById('beforeStoryNext').onclick=()=>mode==='beforeStoryRomford'?advancePinterRomford():romfordPreviousNext();
const romfordPreviousReturn=document.getElementById('beforeStoryReturn').onclick;document.getElementById('beforeStoryReturn').onclick=()=>mode==='beforeStoryRomford'?returnPinterRomford():romfordPreviousReturn();
const romfordPreviousClear=clearBeforeStoryMenu;clearBeforeStoryMenu=function(){clearPinterRomford();romfordPreviousClear();};
document.addEventListener('keydown',e=>{if(mode!=='beforeStoryRomford'||e.repeat)return;if(e.code==='Enter'){e.preventDefault();advancePinterRomford();}else if(e.code==='Escape'){e.preventDefault();returnPinterRomford();}});
