/* Peter's independent early-2025 chapter. Route order verified against TfL's Piccadilly diagram. */
const PETER_UXBRIDGE_STATIONS=['GREEN PARK','HYDE PARK CORNER','KNIGHTSBRIDGE','SOUTH KENSINGTON','GLOUCESTER ROAD',"EARL’S COURT",'BARONS COURT','HAMMERSMITH','TURNHAM GREEN','ACTON TOWN','EALING COMMON','NORTH EALING','PARK ROYAL','ALPERTON','SUDBURY TOWN','SUDBURY HILL','SOUTH HARROW','RAYNERS LANE','EASTCOTE','RUISLIP MANOR','RUISLIP','ICKENHAM','HILLINGDON','UXBRIDGE'];
// The late-evening service calls at Turnham Green. Forty-second game legs compress the journey.
const PETER_UXBRIDGE_LEG=40;
// District-line platforms are scenery on these legs; the Piccadilly train does not stop.
const PETER_UXBRIDGE_PASSING_STATIONS=[{name:'RAVENSCOURT PARK',leg:7,at:.28},{name:'STAMFORD BROOK',leg:7,at:.72},{name:'CHISWICK PARK',leg:8,at:.5}];
function peterUxbridgeRouteRows(){return PETER_UXBRIDGE_STATIONS.map((name,i)=>'<li value="'+(i+1)+'" data-peter-stop="'+i+'">'+name+'</li>'+PETER_UXBRIDGE_PASSING_STATIONS.filter(stop=>stop.leg===i).map(stop=>'<li class="peter-passing-stop" data-peter-pass="'+stop.name+'"><span class="peter-green-square" aria-hidden="true"></span>'+stop.name+'<small>PASS WITHOUT STOPPING</small></li>').join('')).join('');}
function buildPeterPassingStations(b){
 b.passingStations=PETER_UXBRIDGE_PASSING_STATIONS.map(stop=>{
  const root=new THREE.Group();root.name='Passing station / '+stop.name;root.visible=false;b.root.add(root);
  const concrete=mat(0x737982),steel=mat(0x324538),roof=mat(0x444f4d),green=new THREE.MeshBasicMaterial({color:0x42b86d});
  for(const side of [-1,1]){
   box(root,2.5,.4,26,concrete,side*3.05,-.2,0);box(root,.13,.025,26,green,side*1.86,.015,0);
   box(root,2.4,.15,24,roof,side*3.1,3.5,0);
   for(const z of [-10,-4,4,10])box(root,.09,3.5,.09,steel,side*4.1,1.75,z);
   for(const z of [-8,2,10]){
    const label=sign(stop.name,'#f2fff5','#143a24',2.7),ctx=label.material.map.image.getContext('2d');ctx.fillStyle='#143a24';ctx.fillRect(14,14,484,100);ctx.fillStyle='#42b86d';ctx.fillRect(24,50,28,28);ctx.fillStyle='#f2fff5';ctx.font='bold 32px monospace';ctx.fillText(stop.name,282,64,430);label.material.map.needsUpdate=true;label.position.set(side*3.9,2,z);label.rotation.y=-side*Math.PI/2;root.add(label);
    box(root,.04,.42,.42,green,side*3.86,2,z-1.65);
   }
   box(root,1.5,.12,.42,steel,side*3.2,.5,-5);
   const lamp=new THREE.PointLight(0xcce7d5,8,10);lamp.position.set(side*3.1,3,2);root.add(lamp);
  }
  return {...stop,root};
 });
}
function updatePeterPassingStations(b){
 const progress=(b.elapsed%PETER_UXBRIDGE_LEG-10)/(PETER_UXBRIDGE_LEG-10);b.passingStation=null;
 for(const stop of b.passingStations){
  const distance=(progress-stop.at)*150;stop.root.position.z=distance;
  stop.root.visible=b.phase==='travel'&&!b.stopped&&b.station===stop.leg&&Math.abs(distance)<55;
  if(stop.root.visible&&Math.abs(distance)<16)b.passingStation=stop.name;
  const row=document.querySelector('[data-peter-pass="'+stop.name+'"]');
  row.classList.toggle('visited',b.station>stop.leg||b.station===stop.leg&&progress>stop.at+.11);row.classList.toggle('passing-current',b.passingStation===stop.name);
 }
}
const PETER_UXBRIDGE_RECRUITMENT=[
 ['peter','Mr Williams? Peter Chambers, Deputy Prime Secretary. I come on behalf of the Prime Minister, now known as the Prime Secretary. He has an offer for you.'],
 ['gareth','The Deputy Prime Secretary has come all the way to Uxbridge for me? I was beginning to think my name had been left at the bottom of somebody’s filing cabinet.'],
 ['peter','The Prime Secretary is building the Prime Secretary’s Rivetellia Militia. We need people who understand how government works and are prepared to enforce its decisions. Your experience as a Grade 7 makes you useful.'],
 ['gareth','Useful, am I? Well, I am tired of watching other people receive the credit. If I join this militia, I want to know that Richards will actually stand behind me.'],
 ['peter','Serve the PSRM, deliver results, and the Prime Secretary will know your name. I shall record your appointment personally. You have an opportunity to help us impose order; I suggest you take it.'],
 ['gareth','Then tell Prime Secretary Richards he has his answer. I am in. Gareth Williams, at the service of the PSRM.']
];
try{beforeStoryProgress.peterUxbridgeCompleted=JSON.parse(localStorage.getItem(BEFORE_STORY_SAVE_KEY))?.peterUxbridgeCompleted===true;}catch(e){beforeStoryProgress.peterUxbridgeCompleted=false;}
const peterUxbridgeChapter=document.createElement('article');peterUxbridgeChapter.className='before-story-next-chapter';peterUxbridgeChapter.innerHTML='<small>FINAL CHAPTER / EARLY 2025 / PLAYABLE</small><h2>SERVANT OF UXBRIDGE</h2><p>Take the Piccadilly line from Green Park to Uxbridge. Meet Gareth Williams and recruit him to the PSRM.</p><button id="beforeStoryPeterUxbridge" type="button" disabled>COMPLETE CHAPTER 2 TO UNLOCK</button>';document.getElementById('beforeStoryPeterBack').before(peterUxbridgeChapter);
const peterUxbridgeHUD=document.createElement('section');peterUxbridgeHUD.id='peterUxbridgeHUD';peterUxbridgeHUD.hidden=true;peterUxbridgeHUD.innerHTML='<header><small>BEFORE THE STORY / PETER CHAMBERS / FINAL CHAPTER / EARLY 2025</small><h2>SERVANT OF UXBRIDGE</h2><p id="peterUxbridgeObjective"></p><b id="peterUxbridgeStation"></b><p id="peterUxbridgeService"></p><progress id="peterUxbridgeProgress" max="23" value="0"></progress></header><aside><button id="peterUxbridgeRouteButton">ROUTE MAP · TAB</button><button id="peterUxbridgePause">PAUSE · ESC</button><button id="peterUxbridgeReturn">← PETER’S STORY</button></aside><div id="peterUxbridgeRoute" hidden><h3>PICCADILLY LINE / UXBRIDGE</h3><small>23:00 DEPARTURE · EARLY 2025</small><ol>'+peterUxbridgeRouteRows()+'</ol><button id="peterUxbridgeCloseRoute">CLOSE ROUTE MAP</button></div><div class="peter-uxbridge-action"><p id="peterUxbridgePrompt"></p><button id="peterUxbridgeUse">BOARD TRAIN · E</button><button id="peterUxbridgeWait" hidden>WAIT FOR NEXT STOP · F</button></div><footer>WASD MOVE · SHIFT WALK FASTER · E USE / SIT · F WAIT WHILE SEATED · TAB ROUTE · ESC PAUSE</footer><div id="peterUxbridgeModal" hidden><div><h2>JOURNEY PAUSED</h2><p>The train and Peter’s movement are paused.</p><button id="peterUxbridgeResume">RESUME</button><button id="peterUxbridgeQuit">← PETER’S STORY</button></div></div>';
document.body.appendChild(peterUxbridgeHUD);
function peterStoryIs2025(){return beforeStoryProgress.peterDGCompleted===true;}
function applyPeter2025Profile(id){
 const c=beforeStoryScene;if(!c||mode!=='beforeStoryMenu'||!['peter','peterDG'].includes(id))return;if(!peterStoryIs2025()){if(id==='peter'){Object.assign(c.actor.userData,{title:'Grade 7',year:2023});delete c.actor.userData.alignment;}return;}
 if(id==='peterDG'){
  if(!c.cast.peterPrime){const actor=isolateBeforeStoryModel(makeCharacter());actor.name='Peter story / BC-02 / Prime Secretary Josiah / early 2025';Object.assign(actor.userData,{beforeStoryCode:'BC-02',title:'Prime Secretary',alignment:'Neutral Evil',year:2025});c.cast.peterPrime=actor;c.root.add(actor);}
  for(const actor of Object.values(c.cast)){actor.visible=actor===c.cast.peterPrime;actor.position.set(0,0,0);}c.actor=c.cast.peterPrime;
 }
 const josiah=id==='peterDG';Object.assign(c.actor.userData,{title:josiah?'Prime Secretary':'Deputy Prime Secretary',alignment:josiah?'Neutral Evil':'Lawful Evil',year:2025});
 document.getElementById('beforeStoryCode').textContent=(josiah?'BC-02':'BC-01')+' / CHARACTER STORY 03 / EARLY 2025';document.getElementById('beforeStoryAlignment').textContent='ALIGNMENT: '+(josiah?'NEUTRAL EVIL':'LAWFUL EVIL');peterDGTitle.textContent='TITLE: '+(josiah?'Prime Secretary':'Deputy Prime Secretary');
 document.getElementById('beforeStoryProfileText').textContent=josiah?'Prime Secretary Josiah Richards in early 2025. Peter Chambers serves as his deputy. Richards sends him to Uxbridge to recruit Gareth Williams into the Prime Secretary’s Rivetellia Militia.':'Deputy Prime Secretary Peter Chambers in early 2025. The quiet administrator now serves Josiah Richards directly. His assignment is to take the Piccadilly line to Uxbridge and recruit Gareth Williams into the PSRM.';renderBeforeStoryMenu(0);
}
const peterUxbridgePreviousSelect=selectBeforeStoryCast;selectBeforeStoryCast=function(id){peterUxbridgePreviousSelect(id);applyPeter2025Profile(id);};
const peterUxbridgePreviousToggle=toggleBeforeStoryChapters;toggleBeforeStoryChapters=function(open){if(open&&beforeStoryScene?.actor===beforeStoryScene?.cast.peterPrime)selectBeforeStoryCast('josiah');peterUxbridgePreviousToggle(open);};
const peterUxbridgePreviousRefresh=refreshBeforeStoryChapters;refreshBeforeStoryChapters=function(){peterUxbridgePreviousRefresh();const button=document.getElementById('beforeStoryPeterUxbridge');button.disabled=!beforeStoryProgress.peterDGCompleted;button.textContent=button.disabled?'COMPLETE CHAPTER 2 TO UNLOCK':beforeStoryProgress.peterUxbridgeCompleted?'REPLAY FINAL CHAPTER →':'BEGIN FINAL CHAPTER →';};refreshBeforeStoryChapters();

function clearPeterUxbridge(){const c=beforeStoryScene;if(c?.peterUxbridge){disposeCampObject(c.peterUxbridge.root);c.peterUxbridge=null;document.exitPointerLock?.();}peterUxbridgeHUD.hidden=true;document.getElementById('peterUxbridgeModal').hidden=true;document.getElementById('peterUxbridgeRoute').hidden=true;keys.clear();drag=false;}
function startPeterUxbridge(){
 const c=beforeStoryScene;if(!c||mode!=='beforeStoryMenu'||!beforeStoryProgress.peterDGCompleted)return;
 clearPeterUxbridge();clearPeterDGConversation();clearPeterAdministrator();stopBeforeStoryVoice();
 const b=c.peterUxbridge={root:new THREE.Group(),time:0,elapsed:0,station:-1,phase:'boarding',paused:false,seated:false,position:new THREE.Vector3(2.85,1.65,0),doors:[],stationLabels:[]};c.root.add(b.root);b.root.name='Piccadilly / Green Park to Uxbridge / Peter story';
 buildTubeCarriage(b,{companion:false,weapon:false,direction:'UXBRIDGE'});buildPeterPassingStations(b);
 for(const door of b.doors)door.mesh.position.z=door.z+door.q*.63;
 b.terminal=new THREE.Group();b.terminal.visible=false;b.root.add(b.terminal);const steel=mat(0x65717b);box(b.terminal,2.7,.15,6,steel,2.85,3.35,20);for(const x of [1.7,4])for(const z of [17.5,22.5])box(b.terminal,.1,3.35,.1,steel,x,1.65,z);const terminalSign=tubeSign('UXBRIDGE',2);terminalSign.position.set(3.82,2.2,20);terminalSign.rotation.y=-Math.PI/2;b.terminal.add(terminalSign);b.recruitmentLight=new THREE.PointLight(0xffe2c6,18,12);b.recruitmentLight.position.set(.4,3.4,20);b.recruitmentLight.visible=false;b.root.add(b.recruitmentLight);
 // A distinct blue seat pattern and line maps retain the familiar deep-level carriage geometry.
 const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#101b42';ctx.fillRect(0,0,128,128);for(let y=0;y<128;y+=16)for(let x=0;x<128;x+=12){ctx.fillStyle=(x+y)%3?'#3c72ab':'#b34652';ctx.fillRect(x,y,3,9);}const texture=new THREE.CanvasTexture(canvas);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(2,8);texture.colorSpace=THREE.SRGBColorSpace;
 const seats=new Set();b.root.traverse(o=>{if(o.material?.map?.repeat?.y===8&&o.material.roughness===.95)seats.add(o.material);});for(const seat of seats){seat.map.dispose();seat.map=texture;seat.needsUpdate=true;}
 for(const side of [-1,1])for(const z of [-9,9]){const lineMap=tubeSign('PICCADILLY · UXBRIDGE',2);lineMap.position.set(side*1.65,2.33,z);lineMap.rotation.y=-side*Math.PI/2;b.root.add(lineMap);}
 b.gareth=isolateBeforeStoryModel(makeGareth(false,true));b.gareth.name='Gareth Williams / Grade 7 / Uxbridge recruitment';b.gareth.position.set(2.9,0,-3);b.gareth.visible=false;b.root.add(b.gareth);b.peter=isolateBeforeStoryModel(makePeter());b.peter.name='Deputy Prime Secretary Peter / Uxbridge recruitment';b.peter.visible=false;b.root.add(b.peter);b.mouths={peter:makeBeforeStorySpeechMouth('uxbridgePeter',b.peter),gareth:makeBeforeStorySpeechMouth('uxbridgeGareth',b.gareth)};
 for(const actor of Object.values(c.cast))actor.visible=false;for(const key of ['menuSet','romeSet','jukoSet','lastJukoSet','heathNarrationSet'])if(c[key])c[key].visible=false;if(c.crownMenu)c.crownMenu.visible=false;
 c.story='peter';c.chapter='peterUxbridge';setMode('beforeStoryPeterTube');beforeStoryUI.hidden=true;beforeStoryCinema.hidden=true;peterUxbridgeHUD.hidden=false;hideUndeadCampaignCast();world.visible=upperWorld.visible=exhibit.visible=flash.visible=false;scene.background.setHex(0x080d19);scene.fog.color.setHex(0x080d19);scene.fog.density=.006;ambient.intensity=.85;cameraFill.intensity=.4;keys.clear();yaw=2.85;pitch=0;updatePeterUxbridge();renderPeterUxbridge(0);syncMenuSong();updateMobileControls();
}
function updatePeterUxbridge(){
 const b=beforeStoryScene?.peterUxbridge;if(!b)return;const index=Math.min(23,Math.floor(b.elapsed/PETER_UXBRIDGE_LEG)),changed=index!==b.station;b.station=index;b.stopped=b.phase==='boarding'||index===23||b.elapsed%PETER_UXBRIDGE_LEG<10;
 if(changed)for(const label of b.stationLabels){const replacement=tubeSign(PETER_UXBRIDGE_STATIONS[index],1.3);label.geometry.dispose();label.material.map?.dispose();label.material.dispose();label.geometry=replacement.geometry;label.material=replacement.material;}
 if(index===23&&b.phase==='travel'){b.phase='arrival';b.seated=false;b.position.set(0,1.65,2);b.gareth.visible=true;keys.clear();}
 b.platform.visible=b.stopped;b.tunnel.visible=!b.stopped&&index<6;b.scenery.visible=!b.stopped&&index>=6;scene.background.setHex(0x080d19);
 b.terminal.visible=index===23;updatePeterPassingStations(b);
 document.getElementById('peterUxbridgeObjective').textContent=b.phase==='boarding'?'BOARD THE UXBRIDGE-BOUND PICCADILLY TRAIN':b.phase==='travel'?'MEET GARETH WILLIAMS IN UXBRIDGE · RECRUIT HIM TO THE PSRM':'MEET GARETH WILLIAMS ON THE PLATFORM';document.getElementById('peterUxbridgeStation').textContent=(b.stopped?'AT: ':'NEXT: ')+PETER_UXBRIDGE_STATIONS[b.stopped?index:Math.min(23,index+1)];document.getElementById('peterUxbridgeService').textContent='PICCADILLY / UXBRIDGE BRANCH · '+(index<6?'DEEP-LEVEL':'SURFACE')+' · '+(index+1)+' / 24 STATIONS'+(b.passingStation?' · ■ PASSING '+b.passingStation:'');document.getElementById('peterUxbridgeProgress').value=index;
 document.querySelectorAll('[data-peter-stop]').forEach(row=>{const i=Number(row.dataset.peterStop);row.classList.toggle('visited',i<index);row.classList.toggle('current',i===index);if(i===index)row.setAttribute('aria-current','step');else row.removeAttribute('aria-current');});
 updatePeterUxbridgePrompt();
}
function updatePeterUxbridgePrompt(){
 const b=beforeStoryScene?.peterUxbridge;if(!b)return;const nearSeat=[-15,-9,-3,3,9,15].some(z=>Math.abs(b.position.z-z)<1.65),nearGareth=b.position.clone().setY(0).distanceTo(b.gareth.position)<2.2;
 const label=b.phase==='boarding'?'BOARD TRAIN · E':b.phase==='arrival'?(b.onPlatform?'SPEAK TO GARETH · E':'LEAVE TRAIN · E'):b.seated?'STAND · E':'SIT · E';document.getElementById('peterUxbridgeUse').textContent=label;document.getElementById('peterUxbridgeUse').disabled=b.paused||b.phase==='travel'&&!b.seated&&!nearSeat||b.phase==='arrival'&&b.onPlatform&&!nearGareth;document.getElementById('peterUxbridgeWait').hidden=b.phase!=='travel'||!b.seated;document.getElementById('peterUxbridgePrompt').textContent=b.phase==='boarding'?'Green Park · Westbound · Uxbridge':b.phase==='arrival'?(b.onPlatform?'Gareth is waiting further along the platform.':'Uxbridge terminus. Leave the carriage to meet Gareth.'):(b.seated?'Remain seated to wait for the next stop, or stand and explore the carriage.':'Walk along the carriage and press E beside a seat to sit.');
}
function usePeterUxbridge(){
 const b=beforeStoryScene?.peterUxbridge;if(mode!=='beforeStoryPeterTube'||!b||b.paused||b.phase==='conversation')return;
 if(b.phase==='boarding'){b.phase='travel';b.elapsed=0;b.position.set(0,1.65,2);yaw=0;}
 else if(b.phase==='arrival'){if(!b.onPlatform){b.onPlatform=true;b.position.set(2.85,1.65,0);yaw=0;pitch=0;}else if(b.position.clone().setY(0).distanceTo(b.gareth.position)<2.2)startPeterUxbridgeRecruitment();}
 else if(b.seated){b.seated=false;b.position.copy(b.seatReturn);yaw=0;}
 else if([-15,-9,-3,3,9,15].some(z=>Math.abs(b.position.z-z)<1.65)){b.seated=true;b.seatReturn=b.position.clone();b.position.set(-1.22,1.38,b.position.z);yaw=-Math.PI/2;pitch=0;}
 keys.clear();updatePeterUxbridge();updateMobileControls();
}
function waitPeterUxbridge(){const b=beforeStoryScene?.peterUxbridge;if(mode!=='beforeStoryPeterTube'||!b||b.paused||b.phase!=='travel'||!b.seated)return;b.elapsed=Math.min(23*PETER_UXBRIDGE_LEG,(b.station+1)*PETER_UXBRIDGE_LEG);updatePeterUxbridge();renderPeterUxbridge(0);}
function pausePeterUxbridge(){const b=beforeStoryScene?.peterUxbridge;if(!b||b.phase==='conversation')return;b.paused=true;keys.clear();drag=false;document.exitPointerLock?.();document.getElementById('peterUxbridgeModal').hidden=false;updateMobileControls();}
function returnPeterUxbridge(){clearPeterUxbridge();beforeStoryCinema.hidden=true;returnBeforeStoryRome();selectBeforeStoryCast('peter');beforeStoryPeterChapters.hidden=false;beforeStoryPeterButton.setAttribute('aria-expanded','true');document.getElementById('beforeStoryPeterUxbridge').focus();}
function startPeterUxbridgeRecruitment(){
 const b=beforeStoryScene.peterUxbridge;b.phase='conversation';b.line=0;b.peter.visible=true;b.peter.position.set(2.85,0,21);b.gareth.position.set(2.85,0,19);b.peter.rotation.y=Math.PI;b.gareth.rotation.y=0;b.recruitmentLight.visible=true;peterUxbridgeHUD.hidden=true;beforeStoryCinema.hidden=false;keys.clear();drag=false;document.exitPointerLock?.();document.getElementById('beforeStoryCinemaChapter').textContent='BEFORE THE STORY / PETER CHAMBERS / FINAL CHAPTER';document.getElementById('beforeStoryCinemaTitle').innerHTML='SERVANT OF UXBRIDGE <span>UXBRIDGE · EARLY 2025</span>';showPeterUxbridgeLine();updateMobileControls();
}
function showPeterUxbridgeLine(){const b=beforeStoryScene.peterUxbridge,line=PETER_UXBRIDGE_RECRUITMENT[b.line];b.beat=0;b.timeline=beforeStorySpeechTimeline(line[1]);document.getElementById('beforeStorySpeaker').textContent=line[0]==='peter'?'PETER CHAMBERS / DEPUTY PRIME SECRETARY':'GARETH WILLIAMS / GRADE 7';document.getElementById('beforeStoryLine').textContent=line[1];document.getElementById('beforeStoryCount').textContent=(b.line+1)+' / '+PETER_UXBRIDGE_RECRUITMENT.length;document.getElementById('beforeStoryNext').textContent=b.line===PETER_UXBRIDGE_RECRUITMENT.length-1?'RECRUIT GARETH →':'CONTINUE →';}
function advancePeterUxbridgeLine(){const b=beforeStoryScene?.peterUxbridge;if(!b||b.phase!=='conversation')return;if(b.line===PETER_UXBRIDGE_RECRUITMENT.length-1){beforeStoryProgress.peterUxbridgeCompleted=true;saveBeforeStoryProgress();refreshBeforeStoryChapters();returnPeterUxbridge();}else{b.line++;showPeterUxbridgeLine();}}
function renderPeterUxbridge(dt){
 const c=beforeStoryScene,b=c?.peterUxbridge;if(!b)return;dt=Math.min(.1,Math.max(0,dt));
 if(b.paused)return;b.time+=dt;
 if(b.phase==='conversation'){
  b.beat+=dt;const speaker=PETER_UXBRIDGE_RECRUITMENT[b.line][0];for(const [id,actor] of Object.entries({peter:b.peter,gareth:b.gareth})){animateCharacter(b.time,false,false,actor);const mouth=b.mouths[id],level=peterUxbridgeVoiceLevel(id);mouth.open.visible=level>.04;mouth.open.scale.set(mouth.width,.006+level*.025,.009);mouth.closed.visible=!mouth.open.visible;if(actor.userData.openMouth)actor.userData.openMouth.visible=false;}
  camera.up.set(0,1,0);camera.position.copy(c.root.position).add(new THREE.Vector3(-.5,2.6,20));camera.lookAt(c.root.position.clone().add(new THREE.Vector3(2.85,1.75,20)));camera.updateMatrixWorld(true);if(peterUxbridgeLineComplete(dt))advancePeterUxbridgeLine();return;
 }
 if(b.phase==='travel')b.elapsed=Math.min(23*PETER_UXBRIDGE_LEG,b.elapsed+dt);updatePeterUxbridge();
 if(!b.seated){let x=Number(keys.has('KeyD'))-Number(keys.has('KeyA')),z=Number(keys.has('KeyS'))-Number(keys.has('KeyW'));const length=Math.hypot(x,z)||1,speed=keys.has('ShiftLeft')?3.7:2.4;const platform=b.phase==='boarding'||b.onPlatform;b.position.x=THREE.MathUtils.clamp(b.position.x+(x*Math.cos(yaw)+z*Math.sin(yaw))/length*speed*dt,platform?2.05:-.62,platform?3.72:.62);b.position.z=THREE.MathUtils.clamp(b.position.z+(z*Math.cos(yaw)-x*Math.sin(yaw))/length*speed*dt,-16.7,16.7);}
 for(const door of b.doors)door.mesh.position.z=THREE.MathUtils.lerp(door.mesh.position.z,door.z+(b.stopped?door.q*.63:0),Math.min(1,dt*3));b.scenery.position.z=(b.time*12)%5;b.tunnel.position.z=(b.time*13)%3;if(b.gareth.visible)animateCharacter(b.time,false,false,b.gareth);
 camera.position.copy(c.root.position).add(b.position);camera.up.set(0,1,0);camera.rotation.set(pitch,yaw,0,'YXZ');camera.updateMatrixWorld(true);updatePeterUxbridgePrompt();
}
document.getElementById('beforeStoryPeterUxbridge').onclick=startPeterUxbridge;document.getElementById('peterUxbridgeUse').onclick=usePeterUxbridge;document.getElementById('peterUxbridgeWait').onclick=waitPeterUxbridge;document.getElementById('peterUxbridgePause').onclick=pausePeterUxbridge;document.getElementById('peterUxbridgeReturn').onclick=document.getElementById('peterUxbridgeQuit').onclick=returnPeterUxbridge;document.getElementById('peterUxbridgeResume').onclick=()=>{const b=beforeStoryScene?.peterUxbridge;if(!b)return;b.paused=false;document.getElementById('peterUxbridgeModal').hidden=true;keys.clear();updateMobileControls();};
document.getElementById('peterUxbridgeRouteButton').onclick=()=>{const panel=document.getElementById('peterUxbridgeRoute');panel.hidden=!panel.hidden;if(!panel.hidden){const row=panel.querySelector('.passing-current')||panel.querySelector('.current');row?.scrollIntoView({block:'center'});}};document.getElementById('peterUxbridgeCloseRoute').onclick=()=>document.getElementById('peterUxbridgeRoute').hidden=true;
const peterUxbridgePreviousNext=document.getElementById('beforeStoryNext').onclick;document.getElementById('beforeStoryNext').onclick=()=>mode==='beforeStoryPeterTube'?advancePeterUxbridgeLine():peterUxbridgePreviousNext();const peterUxbridgePreviousReturn=document.getElementById('beforeStoryReturn').onclick;document.getElementById('beforeStoryReturn').onclick=()=>mode==='beforeStoryPeterTube'?returnPeterUxbridge():peterUxbridgePreviousReturn();
const peterUxbridgePreviousClear=clearBeforeStoryMenu;clearBeforeStoryMenu=function(){clearPeterUxbridge();peterUxbridgePreviousClear();};
document.addEventListener('keydown',e=>{
 if(mode!=='beforeStoryPeterTube'||!beforeStoryScene?.peterUxbridge||e.repeat)return;const b=beforeStoryScene.peterUxbridge;
 if(['Escape','Enter','KeyE','KeyF','Tab'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();}
 if(e.code==='Escape'){if(b.phase==='conversation')returnPeterUxbridge();else if(b.paused)document.getElementById('peterUxbridgeResume').click();else pausePeterUxbridge();return;}if(b.paused)return;
 if(['KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight'].includes(e.code)){e.preventDefault();keys.add(e.code);}
 if(b.phase==='conversation'){if(e.code==='Enter')advancePeterUxbridgeLine();return;}if(e.code==='KeyE')usePeterUxbridge();if(e.code==='KeyF')waitPeterUxbridge();if(e.code==='Tab')document.getElementById('peterUxbridgeRouteButton').click();
},true);
document.addEventListener('mousemove',e=>{const b=beforeStoryScene?.peterUxbridge;if(mode==='beforeStoryPeterTube'&&b&&!b.paused&&b.phase!=='conversation'&&(document.pointerLockElement||drag)){yaw-=THREE.MathUtils.clamp(e.movementX||0,-100,100)*.0023*(window.controlPreferences?.sensitivity||1);pitch=THREE.MathUtils.clamp(pitch-THREE.MathUtils.clamp(e.movementY||0,-100,100)*.0023*(window.controlPreferences?.sensitivity||1),-1.25,1.25);}});
document.getElementById('world').addEventListener('mousedown',e=>{const b=beforeStoryScene?.peterUxbridge;if(e.button===0&&mode==='beforeStoryPeterTube'&&b&&!b.paused&&b.phase!=='conversation')requestLock();});
window.addEventListener('blur',()=>{if(mode==='beforeStoryPeterTube')pausePeterUxbridge();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='beforeStoryPeterTube')pausePeterUxbridge();});
document.addEventListener('pointerlockchange',()=>{const b=beforeStoryScene?.peterUxbridge;if(mode==='beforeStoryPeterTube'&&b&&!document.pointerLockElement&&!window.mobileTouchActive&&!b.paused&&b.phase!=='conversation')pausePeterUxbridge();});
