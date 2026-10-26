/* An independent survival continuity. Never writes to the campaign save. */
const UNDEAD_SAVE_KEY='project-bc-undead-v1';
const UNDEAD_MENU_THEME=new Audio('assets/undead-menu-chains-will-never-come-at-all.mp3');
UNDEAD_MENU_THEME.loop=true;UNDEAD_MENU_THEME.preload='metadata';UNDEAD_MENU_THEME.volume=.55;
AudioOptions.category(UNDEAD_MENU_THEME,'music');
const UNDEAD_CHARACTERS=[
 ['JOSIAH RICHARDS','THE PRIME SECRETARY',()=>makeCharacter()],['PETER CHAMBERS','THE DEPUTY',()=>makePeter()],
 ['ALISSA ROBERTS','THE VIPER',()=>makeAlissa()],['GARETH WILLIAMS','THE FOOL OF UXBRIDGE',()=>makeGareth(false)],
 ['STEPHEN MARSH','THE LOYALIST',()=>makeStephen()],['ELIZABETH STERLING','THE STATESWOMAN',()=>makeElizabethSterling()],
 ['KEVIN MURDERHORN','THE MASKED FIGURE',()=>makeRevealedKevin()],['GARETH JONES','THE INSIDER',()=>makeJonesOrEmma(false)],
 ['EMMA RICHARDS','THE SURVIVOR',()=>makeJonesOrEmma(true)],['MARIAH BANU','THE RESISTANCE LEADER',()=>makeMariahBanu()],
 ['CHRIS PINTER','THE OFFICER',()=>makeChrisPinter()],['DAMIAN JUKO','THE ENFORCER',()=>makeDamianJuko()],
 ['DAVID “DIESEL” BUSTERS','THE EX PRIME MINISTER',()=>makeDavidBusters()]
];
const UNDEAD_OPENING=[
 ['2025 / THE AFTERMATH','After the civil war in the United Kingdom in 2025, 2026 showed a much darker year.'],
 ['2026 / THE IMMUNITY PROJECT','The Prime Secretary, whereabouts unknown, had sent agents to make a cure for an upcoming virus. But the secret project backfired.'],
 ['BC COMPLEX / BASEMENT LEVEL','Deep within the BC Complex, scientists attempting to bio-engineer immunity accidentally triggered a catastrophic cellular mutation.'],
 ['THE ZAMBA-STRAIN','The resulting pathogen didn’t save lives—it completely rewired human biology. Known by survivors as the Zamba-Strain, it reanimates the deceased and drives the infected into a state of feral, relentless predatory hunger.'],
 ['THE DEAD DO NOT REST','The civil war’s battlefields are no longer historical ruins. They are active hunting grounds for an unstoppable, mutated horde.']
];
let undeadPreferences={character:0,bestWave:0,introSeen:false};
try{Object.assign(undeadPreferences,JSON.parse(localStorage.getItem(UNDEAD_SAVE_KEY))||{});}catch(e){}
if(!Number.isInteger(undeadPreferences.character)||undeadPreferences.character<0||undeadPreferences.character>12)undeadPreferences.character=0;
function saveUndeadPreferences(){try{localStorage.setItem(UNDEAD_SAVE_KEY,JSON.stringify(undeadPreferences));}catch(e){}}
let undeadScene=null,undeadGame=null;
const undeadEntry=document.createElement('button');undeadEntry.id='openUndead';undeadEntry.type='button';undeadEntry.textContent='SURVIVE THE UNDEAD';
document.getElementById('openChapters').after(undeadEntry);
const undeadUI=document.createElement('section');undeadUI.id='undeadUI';undeadUI.hidden=true;
undeadUI.innerHTML=`<div class="undead-top"><span>PROJECT BC / SURVIVE THE UNDEAD</span><button id="undeadExit" aria-label="Return to Project BC">← PROJECT BC</button></div>
<div id="undeadOpening" hidden><div class="undead-opening-copy"><small id="undeadEra"></small><h2 id="undeadOpeningTitle"></h2><p id="undeadOpeningText"></p><div class="undead-film-track"><i id="undeadOpeningProgress"></i></div><span id="undeadOpeningCount"></span></div><div class="undead-opening-actions"><button id="undeadOpeningSkip">SKIP OPENING</button><button id="undeadOpeningNext">CONTINUE · ENTER</button></div></div>
<main id="undeadMenu" hidden><div class="undead-menu-copy"><div class="eyebrow">UNITED KINGDOM / 2026 / A SEPARATE STORY</div><h1>SURVIVE<br>THE <em>UNDEAD</em></h1><p>The war ended.<br>The hunger did not.</p><button id="undeadMapsButton">MAPS <span>↗</span></button><div id="undeadCharacterGrid" role="group" aria-label="Select survival character"></div><small id="undeadBest"></small></div><aside class="undead-dossier"><small id="undeadCharacterCode"></small><h2 id="undeadCharacterName"></h2><p id="undeadCharacterRole"></p><b id="undeadCharacterStatus"></b><span>1–4 PLAYERS / ONLINE CO-OP</span></aside></main>
<section id="undeadMaps" hidden aria-label="Survival maps"><div class="undead-maps-heading"><button id="undeadMapsBack">← BACK</button><div><small>SURVIVE THE UNDEAD</small><h2>MAPS</h2></div></div><div class="undead-maps-grid"><article class="undead-map-card"><img src="assets/chapter-brent-cross.jpg" alt="The Brent Cross interior from Project BC"><div><small>01 / ZAMBA-STRAIN OUTBREAK</small><h3>BC GOVERNMENT COMPLEX</h3><p>The familiar concourses. Two floors. Service lifts. Something is moving behind the shutters.</p><p class="undead-map-facts">ENDLESS WAVES · 1–4 PLAYERS · SHARED REVIVES</p><button id="undeadSolo">PLAY SOLO</button><button id="undeadHost">HOST ONLINE CO-OP</button><button id="undeadJoin">JOIN ONLINE CO-OP</button></div></article><section id="undeadLobby" aria-label="Online co-op squad"><small>YOUR SQUAD</small><h3>STAY TOGETHER.</h3><p id="undeadLobbyStatus" aria-live="polite">Select solo play, or connect your squad.</p><ul id="undeadRoster"></ul><div id="undeadConnection" hidden><label for="undeadCodeInput" id="undeadCodeLabel">CONNECTION CODE</label><textarea id="undeadCodeInput" rows="3" maxlength="100000" spellcheck="false" placeholder="Paste the code here"></textarea><div class="undead-code-actions"><button id="undeadCreateInvite">CREATE INVITE</button><button id="undeadAcceptCode">ACCEPT REPLY</button></div><label for="undeadCodeOutput">YOUR CODE</label><textarea id="undeadCodeOutput" rows="3" readonly aria-label="Copy this connection code"></textarea><button id="undeadCopyCode">COPY CODE</button><p id="undeadConnectionHelp">The host sends an invite to a friend. Their friend pastes it here and sends the reply code back. The host accepts the reply. Create a separate invite for each friend.</p><button id="undeadReady">READY</button><button id="undeadStartSquad">START SURVIVAL</button><button id="undeadLeaveSquad">LEAVE SQUAD</button></div></section></div></section></section>`;
document.body.appendChild(undeadUI);
const undeadHUD=document.createElement('section');undeadHUD.id='undeadHUD';undeadHUD.hidden=true;
undeadHUD.innerHTML='<div class="undead-hud-top"><small>SURVIVE THE UNDEAD / BC GOVERNMENT COMPLEX</small><h2 id="undeadWave"></h2><p id="undeadCount"></p><p id="undeadTeam"></p></div><aside><canvas id="undeadMinimap" width="210" height="210" aria-label="Infected red, squad green, supplies white"></canvas><small>▲ YOU · ● SQUAD · ● INFECTED · + SUPPLIES</small><span id="undeadFloor"></span></aside><div id="undeadReticle">+</div><div class="undead-hud-bottom"><b id="undeadHealth"></b><span id="undeadAmmo"></span><p id="undeadPrompt"></p><small>WASD MOVE · SHIFT RUN · CLICK / Z FIRE · R RELOAD · E LIFT / HOLD TO REVIVE · ESC PAUSE</small></div><div id="undeadHit"></div><div id="undeadPause" hidden><div><small>SURVIVE THE UNDEAD</small><h2 id="undeadPauseTitle">STAY ALIVE.</h2><p id="undeadPauseText"></p><button id="undeadResume">RESUME</button><button id="undeadRetry">RETRY MAP</button><button id="undeadReturnMaps">RETURN TO MAPS</button></div></div>';
document.body.appendChild(undeadHUD);
for(const [id,entry] of UNDEAD_CHARACTERS.entries()){
 const b=document.createElement('button');b.type='button';b.dataset.undeadCharacter=id;b.innerHTML='<small>BC-'+String(id+1).padStart(2,'0')+'</small><span></span>';b.querySelector('span').textContent=entry[0];b.onclick=()=>selectUndeadCharacter(id);document.getElementById('undeadCharacterGrid').appendChild(b);
}
function canEnterUndead(){return gameProgress.laniakeaAftermath!==true&&gameProgress.kevinSolarAftermath!==true;}
function refreshUndeadEntry(){undeadEntry.hidden=!canEnterUndead();undeadEntry.disabled=!canEnterUndead();}
const refreshBeforeUndead=refreshLaniakeaAftermathMenu;
refreshLaniakeaAftermathMenu=function(){refreshBeforeUndead();refreshUndeadEntry();};
const refreshProgressBeforeUndead=refreshProgressUI;
refreshProgressUI=function(){refreshProgressBeforeUndead();refreshUndeadEntry();};
function hideUndeadCampaignCast(){for(const actor of [subject,peter,alissa,gareth,stephen,elizabethMenu,kevinMenu,kevinRevealed,garethJonesMenu,emmaMenu,mariahMenu,chrisMenu,damianMenu,davidMenu,awakenedJosiahMenu,solGuardianMenu,victoriousKevinMenu])if(actor)actor.visible=false;exhibit.visible=false;}
function clearUndeadGame(){
 if(!undeadGame)return;
 if(UndeadCoop.role==='host'&&!undeadGame.ended)UndeadCoop.broadcast({type:'end',reason:'The host returned to the lobby.'});
 disposeCampObject(undeadGame.root);disposeCampObject(undeadGame.gun);for(const [obj,visible] of undeadGame.hiddenObjects)obj.visible=visible;
 undeadGame=null;undeadHUD.hidden=true;upperWorld.position.y=0;currentFloor=0;
}
function clearUndeadMode(){
 if(!undeadScene)return;clearUndeadGame();UndeadCoop.close();
 const c=undeadScene;disposeCampObject(c.root);scene.background.copy(c.background);scene.fog.color.copy(c.fogColor);scene.fog.density=c.fogDensity;ambient.intensity=c.ambient;cameraFill.intensity=c.fill;
 undeadScene=null;undeadUI.hidden=true;document.body.classList.remove('undead-mode');
}
function createUndeadLab(){
 const c=undeadScene,r=c.root,concrete=mat(0x25332b),steel=mat(0x151e1a),tile=mat(0x647165),glass=new THREE.MeshPhongMaterial({color:0x94cb8a,transparent:true,opacity:.2,shininess:75});
 box(r,22,.3,32,tile,0,-.2,-3);box(r,22,.35,32,concrete,0,5.5,-3);box(r,.5,6,32,concrete,-11,2.5,-3);box(r,.5,6,32,concrete,11,2.5,-3);box(r,22,6,.5,concrete,0,2.5,-19);
 for(let x=-10;x<=10;x+=2)box(r,.025,.01,32,steel,x,.005,-3);
 for(let z=-18;z<=12;z+=2)box(r,22,.01,.025,steel,0,.006,z);
 c.lights=[];for(let z=-15;z<=9;z+=6){box(r,6,.06,.25,new THREE.MeshBasicMaterial({color:0xb5d581}),0,5.1,z);const l=new THREE.PointLight(0xa3cb6a,22,18);l.position.set(0,4.6,z);r.add(l);c.lights.push(l);}
 for(const x of [-7,7])for(const z of [-11,-4]){
  mesh(new THREE.CylinderGeometry(1,1.2,.3,20),steel,r,x,.15,z);mesh(new THREE.CylinderGeometry(.85,.85,3,20),glass,r,x,1.8,z);mesh(new THREE.CylinderGeometry(1,1,.3,20),steel,r,x,3.45,z);
  const specimen=makeUndeadZombie();specimen.position.set(x,.35,z);r.add(specimen);c.specimens.push(specimen);
  const lamp=new THREE.PointLight(0x69cf45,12,6);lamp.position.set(x,1.6,z+1);r.add(lamp);
 }
 box(r,5,.15,2,steel,0,1,-8);for(let i=0;i<5;i++){mesh(new THREE.CylinderGeometry(.16,.2,.55,10),glass,r,-1.6+i*.8,1.37,-8);ball(r,.13,.2,.13,new THREE.MeshBasicMaterial({color:0xafff68}),-1.6+i*.8,1.3,-8);}
 const display=sign('IMMUNITY PROGRAMME','#bde388','#102216',5);display.position.set(0,3.5,-18.7);r.add(display);
 const door=box(r,4,4,.2,steel,0,2,-18.65);c.door=door;
 for(const side of [-1,1]){box(r,.18,4,.1,new THREE.MeshBasicMaterial({color:0xbd273a}),side*2.2,2,-18.45);mesh(new THREE.CylinderGeometry(.14,.14,30,10),steel,r,side*9,5,-3).rotation.x=Math.PI/2;}
 const alarm=new THREE.PointLight(0xb5162c,0,28);alarm.position.set(0,4,-8);r.add(alarm);c.alarm=alarm;
 const corpse=makeUndeadZombie();r.add(corpse);corpse.position.set(0,.2,1);corpse.rotation.z=Math.PI/2;c.corpse=corpse;
 box(r,3,.15,1.3,steel,0,.8,1);box(r,2.5,.12,1.1,mat(0x909b85),0,.92,1);
}
function enterUndead(){
 if(mode!=='menu'||!canEnterUndead())return;
 loadChapterScreen('SURVIVE THE UNDEAD / 2026',()=>{
  menu();setMode('undeadIntro');hideUndeadCampaignCast();flash.visible=false;world.visible=upperWorld.visible=false;
  const root=new THREE.Group();root.position.x=2200;scene.add(root);
  undeadScene={root,phase:'intro',time:0,line:0,lineTime:0,specimens:[],background:scene.background.clone(),fogColor:scene.fog.color.clone(),fogDensity:scene.fog.density,ambient:ambient.intensity,fill:cameraFill.intensity};
  scene.background.setHex(0x050b06);scene.fog.color.setHex(0x122012);scene.fog.density=.02;ambient.intensity=.45;cameraFill.intensity=.15;document.body.classList.add('undead-mode');
  createUndeadLab();undeadUI.hidden=false;document.getElementById('undeadOpening').hidden=false;document.getElementById('undeadMenu').hidden=true;document.getElementById('undeadMaps').hidden=true;
  showUndeadOpeningLine();renderUndead(0);syncMenuSong();
 });
}
function showUndeadOpeningLine(){const c=undeadScene;document.getElementById('undeadEra').textContent=c.line<2?'2026':'QUARANTINE FAILURE';document.getElementById('undeadOpeningTitle').textContent=UNDEAD_OPENING[c.line][0];document.getElementById('undeadOpeningText').textContent=UNDEAD_OPENING[c.line][1];document.getElementById('undeadOpeningCount').textContent=String(c.line+1).padStart(2,'0')+' / 05';document.getElementById('undeadOpeningProgress').style.width=(c.line+1)/5*100+'%';}
function advanceUndeadOpening(){if(mode!=='undeadIntro'||!undeadScene)return;if(++undeadScene.line>=UNDEAD_OPENING.length){showUndeadMenu();return;}undeadScene.lineTime=0;showUndeadOpeningLine();}
function showUndeadMenu(){
 if(!undeadScene)return;clearUndeadGame();mode='undeadMenu';keys.clear();drag=false;document.exitPointerLock?.();
 for(const child of [...undeadScene.root.children])disposeCampObject(child);undeadScene.phase='menu';undeadScene.root.visible=true;undeadScene.actor=null;
 world.visible=upperWorld.visible=false;hideUndeadCampaignCast();flash.visible=false;scene.background.setHex(0x050a05);scene.fog.color.setHex(0x172012);scene.fog.density=.045;ambient.intensity=.75;cameraFill.intensity=.23;
 const r=undeadScene.root;box(r,18,.3,14,mat(0x122218),0,-.25,0);box(r,18,7,.3,mat(0x1a2920),0,3,-4);
 for(let x=-8;x<=8;x+=2){box(r,.04,6,.07,mat(0x566545),x,3,-3.8);box(r,.15,6,.15,mat(0x243526),x,3,-3.75);}
 const glow=new THREE.PointLight(0xa5ca69,13,15);glow.position.set(-2,3,2);r.add(glow);const red=new THREE.PointLight(0xa8152d,12,12);red.position.set(3,2,-2);r.add(red);
 mesh(new THREE.CylinderGeometry(1.5,1.7,.25,36),mat(0x213024),r,0,-.1,0);
 undeadUI.hidden=false;document.getElementById('undeadOpening').hidden=true;document.getElementById('undeadMaps').hidden=true;document.getElementById('undeadMenu').hidden=false;
 undeadPreferences.introSeen=true;saveUndeadPreferences();selectUndeadCharacter(undeadPreferences.character);syncMenuSong();
}
function selectUndeadCharacter(id){
 if(!Number.isInteger(id)||!UNDEAD_CHARACTERS[id])return;undeadPreferences.character=id;saveUndeadPreferences();
 for(const b of document.querySelectorAll('[data-undead-character]')){const selected=Number(b.dataset.undeadCharacter)===id;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));}
 const [name,role,make]=UNDEAD_CHARACTERS[id];document.getElementById('undeadCharacterCode').textContent='SUBJECT BC-'+String(id+1).padStart(2,'0');document.getElementById('undeadCharacterName').textContent=name;document.getElementById('undeadCharacterRole').textContent=role;document.getElementById('undeadCharacterStatus').textContent=id===0?'WHEREABOUTS UNKNOWN':'SURVIVAL CHARACTER';document.getElementById('undeadBest').textContent='BEST WAVE / '+(Number(undeadPreferences.bestWave)||0)+' · SEPARATE SURVIVAL RECORD';
 if(undeadScene?.phase==='menu'){if(undeadScene.actor)disposeCampObject(undeadScene.actor);undeadScene.actor=make();undeadScene.root.add(undeadScene.actor);undeadScene.actor.visible=true;}
 UndeadCoop.select(id);renderUndeadRoster();
}
function showUndeadMaps(){if(!undeadScene)return;clearUndeadGame();mode='undeadMaps';undeadScene.phase='maps';keys.clear();document.exitPointerLock?.();undeadUI.hidden=false;document.getElementById('undeadMenu').hidden=true;document.getElementById('undeadOpening').hidden=true;document.getElementById('undeadMaps').hidden=false;renderUndeadRoster();syncMenuSong();}
function lobbyStatus(message){document.getElementById('undeadLobbyStatus').textContent=message;}
function renderUndeadRoster(){
 const list=document.getElementById('undeadRoster');list.replaceChildren();const players=UndeadCoop.players.length?UndeadCoop.players:[{id:'host',character:undeadPreferences.character,ready:true}];
 for(const p of players){const li=document.createElement('li');li.textContent=(p.id===UndeadCoop.localId?'YOU / ':'')+UNDEAD_CHARACTERS[p.character][0]+' · '+(p.ready?'READY':'CHOOSING');list.appendChild(li);}
 document.getElementById('undeadStartSquad').hidden=UndeadCoop.role!=='host';document.getElementById('undeadStartSquad').disabled=!UndeadCoop.connected||!players.every(p=>p.ready);
 document.getElementById('undeadReady').hidden=UndeadCoop.role!=='client';document.getElementById('undeadCreateInvite').hidden=UndeadCoop.role!=='host';
}
async function undeadConnectionAction(task){for(const id of ['undeadCreateInvite','undeadAcceptCode'])document.getElementById(id).disabled=true;try{await task();}catch(e){lobbyStatus(e.message);}finally{for(const id of ['undeadCreateInvite','undeadAcceptCode'])document.getElementById(id).disabled=false;}}
function makeUndeadZombie(){
 const r=new THREE.Group(),body=new THREE.Group();r.add(body);const flesh=mat(0x91a77a),cloth=mat(0x26352d),dark=mat(0x14201b),blood=mat(0x752735);box(body,.5,.68,.34,cloth,0,1.2,0);
 const arms=[],legs=[],head=new THREE.Group();body.add(head);head.position.y=1.94;ball(head,.28,.34,.25,flesh,0,0,0);ball(head,.1,.13,.12,flesh,0,-.22,.03);
 for(const side of [-1,1]){box(head,.075,.055,.03,new THREE.MeshBasicMaterial({color:0xd7353b}),side*.11,.02,.239);const arm=new THREE.Group();body.add(arm);arm.position.set(side*.32,1.5,0);box(arm,.16,.57,.18,cloth,0,-.25,0);ball(arm,.09,.12,.09,flesh,0,-.6,0);arms.push(arm);const leg=new THREE.Group();r.add(leg);leg.position.set(side*.15,.9,0);box(leg,.22,.8,.25,dark,0,-.38,0);box(leg,.23,.12,.34,dark,0,-.8,.045);legs.push(leg);}
 box(head,.16,.08,.015,dark,0,-.15,.247);for(const [x,y] of [[-.12,1.1],[.15,1.4]])box(body,.12,.15,.01,blood,x,y,.178);
 r.userData={body,head,arms,legs};return r;
}
function undeadCellOpen(x,z,floor=0){return Number.isInteger(x)&&Number.isInteger(z)&&grid[z]?.[x]===0&&(floor===0||z<68);}
function undeadWalkable(x,z,floor=0,radius=.3){if(!Number.isFinite(x)||!Number.isFinite(z))return false;return [[x-radius,z-radius],[x+radius,z-radius],[x-radius,z+radius],[x+radius,z+radius]].every(([a,b])=>undeadCellOpen(Math.round(a/CELL),Math.round(b/CELL),floor));}
function undeadNearest(x,z,floor=0){for(let r=0;r<20;r++)for(let dx=-r;dx<=r;dx++)for(let dz=-r;dz<=r;dz++){const p=pos(x+dx,z+dz,floor*9);if(undeadWalkable(p.x,p.z,floor))return p;}return pos(40,57,floor*9);}

// Floor-specific connected regions keep infected out of sealed shop interiors.
function buildUndeadNavigation(){
 return [0,1].map(floor=>{
  const regions=new Int32Array(N*N),cells=[[]];
  for(let z=0;z<N;z++)for(let x=0;x<N;x++){
   const start=z*N+x;if(regions[start]||!undeadCellOpen(x,z,floor))continue;
   const id=cells.length,queue=[start],region=[];regions[start]=id;
   for(let i=0;i<queue.length;i++){
    const key=queue[i],cx=key%N,cz=Math.floor(key/N);region.push({x:cx,z:cz});
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,nz=cz+dz,k=nz*N+nx;if(undeadCellOpen(nx,nz,floor)&&!regions[k]){regions[k]=id;queue.push(k);}}
   }cells.push(region);
  }return {regions,cells};
 });
}
function undeadRegion(position,floor){const at=cell(position);if(!undeadCellOpen(at.x,at.z,floor))return 0;return undeadGame.navigation[floor].regions[at.z*N+at.x];}
function undeadSpawnPosition(target,living){
 const cells=undeadGame.navigation[target.floor].cells[undeadRegion(target.position,target.floor)]||[];
 const distant=cells.filter(c=>living.every(p=>p.floor!==target.floor||Math.hypot(p.position.x-c.x*CELL,p.position.z-c.z*CELL)>22));
 const choices=distant.length?distant:cells;if(!choices.length)return target.position.clone();
 const at=choices[Math.floor(Math.random()*choices.length)];return pos(at.x,at.z,target.floor*9);
}
function undeadRoute(a,b,floor){
 if(!undeadCellOpen(a.x,a.z,floor)||!undeadCellOpen(b.x,b.z,floor))return [];
 const nav=undeadGame.navigation[floor],start=a.z*N+a.x,end=b.z*N+b.x;if(nav.regions[start]!==nav.regions[end])return [];
 const previous=new Int32Array(N*N);previous.fill(-1);previous[start]=start;const queue=[start];
 for(let i=0;i<queue.length;i++){
  const key=queue[i];if(key===end){const out=[];for(let k=end;k!==start;k=previous[k])out.push({x:k%N,z:Math.floor(k/N)});return out.reverse();}
  const x=key%N,z=Math.floor(key/N);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,nz=z+dz,k=nz*N+nx;if(undeadCellOpen(nx,nz,floor)&&previous[k]===-1){previous[k]=key;queue.push(k);}}
 }return [];
}
function undeadSight(a,b,floor){const d=a.distanceTo(b),steps=Math.ceil(d/.6);for(let i=1;i<steps;i++){const p=a.clone().lerp(b,i/steps);if(!undeadWalkable(p.x,p.z,floor,0))return false;}return true;}
function buildUndeadCorruption(root){
 const levels=[];for(let floor=0;floor<2;floor++){
  const r=new THREE.Group();r.position.y=floor*9;root.add(r);levels.push(r);
  for(const [x,z] of [[37,12],[26,29],[54,30],[35,44],[45,56],[60,48],[21,55]]){
   const p=undeadNearest(x,z,floor),pool=mesh(new THREE.CircleGeometry(1.4,20),new THREE.MeshBasicMaterial({color:0x476e25,transparent:true,opacity:.48,depthWrite:false}),r,p.x,.025,p.z);pool.rotation.x=-Math.PI/2;
   for(let i=0;i<3;i++)ball(r,.3,.05,.23,mat(i%2?0x243d16:0x6c2833),p.x+Math.sin(i*2)*.8,.06,p.z+Math.cos(i*2)*.8);
   if(z%2){const lamp=new THREE.PointLight(0x92bc38,20,15);lamp.position.set(p.x,3,p.z);r.add(lamp);}else{const lamp=new THREE.PointLight(0xe22536,15,14);lamp.position.set(p.x,2.6,p.z);r.add(lamp);}
  }
  for(const l of liftCells){const p=undeadNearest(l.x,l.z,floor),label=sign('QUARANTINE / SERVICE LIFT','#cfdf94','#1b2919',3);label.position.set(p.x,3,p.z+3.2);r.add(label);}
  const label=sign('ZAMBA-STRAIN / DO NOT APPROACH','#e79483','#291114',5);label.position.set(40*CELL,3,48*CELL);r.add(label);
 }
 return levels;
}
function newUndeadPlayer(entry,index){
 const p={id:entry.id,character:entry.character,hp:150,ammo:24,reload:0,fire:0,floor:0,yaw:Math.PI,pitch:0,kills:0,liftCooldown:0,revive:0,input:{},position:undeadNearest(38+index,10,0)};
 if(p.id!==UndeadCoop.localId){p.actor=UNDEAD_CHARACTERS[p.character][2]();undeadGame.root.add(p.actor);}
 return p;
}
function startUndeadMap(remote=false){
 if(!undeadScene)return;if(!remote&&UndeadCoop.role==='client'){lobbyStatus('The host starts the map after everyone is ready.');return;}
 if(!remote&&UndeadCoop.role==='host'){try{UndeadCoop.start();}catch(e){lobbyStatus(e.message);return;}}
 clearUndeadGame();mode='undeadPlay';keys.clear();undeadScene.root.visible=false;hideUndeadCampaignCast();undeadUI.hidden=true;undeadHUD.hidden=false;document.getElementById('undeadPause').hidden=true;
 const root=new THREE.Group();scene.add(root);const roster=UndeadCoop.players.length?UndeadCoop.players:[{id:'host',character:undeadPreferences.character}];
 undeadGame={root,navigation:buildUndeadNavigation(),players:new Map(),zombies:new Map(),nextId:0,time:0,wave:0,nextWave:2,paused:false,ended:false,fireIntent:false,effects:[],snapshotTime:0,inputTime:0,hit:0,hiddenObjects:[],remote:remote||UndeadCoop.role==='client',mapTimer:0};
 const g=undeadGame;for(const [i,e] of roster.entries())g.players.set(e.id,newUndeadPlayer(e,i));
 g.corruption=buildUndeadCorruption(root);g.supplies=[[38,13],[40,57],[21,50],[61,29]].map(([x,z],i)=>{const model=new THREE.Group();root.add(model);const p=undeadNearest(x,z,i%2);model.position.copy(p);box(model,.6,.4,.5,mat(0xcfdac3),0,.3,0);box(model,.3,.07,.025,new THREE.MeshBasicMaterial({color:0x67e9a5}),0,.3,.26);box(model,.07,.25,.025,new THREE.MeshBasicMaterial({color:0x67e9a5}),0,.3,.26);return{model,floor:i%2,position:p,cooldown:0};});
 for(const fuse of fuses){g.hiddenObjects.push([fuse.group,fuse.group.visible]);fuse.group.visible=false;}
 const gun=new THREE.Group();camera.add(gun);gun.position.set(.3,-.27,-.6);box(gun,.13,.15,.48,mat(0x252e27),0,0,0);box(gun,.1,.22,.13,mat(0x131b15),0,-.14,.1);g.gun=gun;
 const local=g.players.get(UndeadCoop.localId);player.copy(local.position);yaw=local.yaw;pitch=0;currentFloor=0;upperWorld.position.y=9;world.visible=true;upperWorld.visible=false;exhibit.visible=false;flash.visible=true;flash.intensity=24;ambient.intensity=.5;cameraFill.intensity=.2;scene.background.setHex(0x050b08);scene.fog.color.setHex(0x132014);scene.fog.density=.006;
 syncMenuSong();requestLock();renderUndeadGame(0);updateMobileControls();
}
function undeadInput(){return {forward:+keys.has('KeyW')-+keys.has('KeyS'),side:+keys.has('KeyD')-+keys.has('KeyA'),sprint:keys.has('ShiftLeft')||keys.has('ShiftRight'),yaw,pitch,shoot:undeadGame?.holding===true||undeadGame?.fireIntent===true,reload:keys.has('KeyR'),use:keys.has('KeyE')};}
function validUndeadInput(value){if(!value||typeof value!=='object')return{};return{forward:Math.sign(Number(value.forward)||0),side:Math.sign(Number(value.side)||0),yaw:Number.isFinite(value.yaw)?value.yaw%TAU:0,pitch:THREE.MathUtils.clamp(Number(value.pitch)||0,-1.2,1.2),sprint:value.sprint===true,shoot:value.shoot===true,reload:value.reload===true,use:value.use===true};}
function moveUndeadPlayer(p,input,dt,authoritative=true){
 p.fire=Math.max(0,p.fire-dt);p.liftCooldown=Math.max(0,p.liftCooldown-dt);if(p.reload>0){p.reload=Math.max(0,p.reload-dt);if(!p.reload)p.ammo=24;}if(p.hp<=0)return;
 p.yaw=input.yaw??p.yaw;p.pitch=input.pitch??p.pitch;const f=input.forward||0,s=input.side||0,length=Math.hypot(f,s)||1,speed=input.sprint?6.2:4.1;
 const dx=(-Math.sin(p.yaw)*f+Math.cos(p.yaw)*s)*dt*speed/length,dz=(-Math.cos(p.yaw)*f-Math.sin(p.yaw)*s)*dt*speed/length;
 if(undeadWalkable(p.position.x+dx,p.position.z,p.floor))p.position.x+=dx;if(undeadWalkable(p.position.x,p.position.z+dz,p.floor))p.position.z+=dz;
 if(input.reload&&p.ammo<24&&!p.reload)p.reload=1.4;
 if(input.use&&!p.liftCooldown&&liftCells.some(l=>Math.hypot(p.position.x-l.x*CELL,p.position.z-l.z*CELL)<3)){p.floor=1-p.floor;p.position.y=p.floor*9;p.liftCooldown=2;}
 if(authoritative&&input.shoot)shootUndeadPlayer(p);
}
function undeadTracer(start,end){const g=undeadGame,line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([start,end]),new THREE.LineBasicMaterial({color:0xe0e99c}));g.root.add(line);g.effects.push({obj:line,left:.09});}
function shootUndeadPlayer(p){
 const g=undeadGame;if(!g||p.hp<=0||p.reload||p.fire>0)return;if(!p.ammo){p.reload=1.4;return;}p.ammo--;p.fire=.18;
 const from=p.position.clone().add(new THREE.Vector3(0,1.7,0)),direction=new THREE.Vector3(-Math.sin(p.yaw)*Math.cos(p.pitch),Math.sin(p.pitch),-Math.cos(p.yaw)*Math.cos(p.pitch)),ray=new THREE.Ray(from,direction);
 let best=60,target=null,end=from.clone().addScaledVector(direction,60);
 for(const z of g.zombies.values()){if(z.hp<=0||z.floor!==p.floor)continue;const hit=ray.intersectSphere(new THREE.Sphere(z.position.clone().add(new THREE.Vector3(0,1.25,0)),.85),new THREE.Vector3());if(hit){const d=hit.distanceTo(from);if(d<best&&undeadSight(p.position,hit,p.floor)){best=d;target=z;end=hit;}}}
 if(target){target.hp=Math.max(0,target.hp-35);if(!target.hp){p.kills++;target.actor.visible=false;}if(p.id===UndeadCoop.localId)document.getElementById('undeadReticle').textContent='×';}
 undeadTracer(from,end);if(p.id===UndeadCoop.localId)playGunshot(.35);
}
function shootUndead(){if(mode==='undeadPlay'&&undeadGame&&!undeadGame.paused&&!undeadGame.ended)undeadGame.fireIntent=true;}
function spawnUndeadWave(){
 const g=undeadGame;g.wave++;const living=[...g.players.values()].filter(p=>p.hp>0);if(!living.length)return;
 for(let i=0;i<Math.min(24,5+g.wave*2+living.length*2);i++){
  const p=living[i%living.length],floor=p.floor,position=undeadSpawnPosition(p,living);const actor=makeUndeadZombie();g.root.add(actor);const z={id:++g.nextId,position,floor,hp:Math.min(220,85+g.wave*7),actor,attack:1,path:[],repath:0};g.zombies.set(z.id,z);
 }
}
function updateUndeadZombies(dt){
 const g=undeadGame,alive=[...g.players.values()].filter(p=>p.hp>0);
 for(const z of g.zombies.values()){
  if(z.hp<=0)continue;z.attack-=dt;z.repath-=dt;
  const region=undeadRegion(z.position,z.floor);let targets=alive.filter(p=>p.floor===z.floor&&region&&undeadRegion(p.position,p.floor)===region);
  if(!targets.length&&alive.length){
   const otherFloor=1-z.floor,accessibleLifts=liftCells.filter(l=>region&&undeadRegion(pos(l.x,l.z,z.floor*9),z.floor)===region&&alive.some(p=>p.floor===otherFloor&&undeadRegion(p.position,p.floor)===undeadRegion(pos(l.x,l.z,otherFloor*9),otherFloor)));
   // Repair an already stranded infected without removing it or awarding a kill.
   if(!accessibleLifts.length){const p=alive[0];z.floor=p.floor;z.position.copy(undeadSpawnPosition(p,alive));z.path=[];z.repath=0;targets=alive.filter(p=>p.floor===z.floor&&undeadRegion(p.position,p.floor)===undeadRegion(z.position,z.floor));}
   else {const lift=accessibleLifts.sort((a,b)=>Math.hypot(z.position.x-a.x*CELL,z.position.z-a.z*CELL)-Math.hypot(z.position.x-b.x*CELL,z.position.z-b.z*CELL))[0];if(Math.hypot(z.position.x-lift.x*CELL,z.position.z-lift.z*CELL)<2){z.floor=otherFloor;z.position.y=z.floor*9;z.path=[];z.repath=0;targets=alive.filter(p=>p.floor===z.floor&&undeadRegion(p.position,p.floor)===undeadRegion(z.position,z.floor));}else targets=[{position:pos(lift.x,lift.z,z.floor*9),hp:Infinity}];}
  }
  const target=targets.sort((a,b)=>z.position.distanceTo(a.position)-z.position.distanceTo(b.position))[0];if(!target)continue;
  if(z.repath<=0){z.path=undeadRoute(cell(z.position),cell(target.position),z.floor);z.repath=1.3+z.id%4*.2;}
  const goal=z.path.length?pos(z.path[0].x,z.path[0].z,z.floor*9):target.position,delta=goal.clone().sub(z.position);delta.y=0;const distance=delta.length(),speed=Math.min(3.3,1.6+g.wave*.08),step=delta.multiplyScalar(Math.min(speed*dt,distance)/Math.max(distance,.001));
  if(distance<.15)z.path.shift();else if(undeadWalkable(z.position.x+step.x,z.position.z+step.z,z.floor,.25))z.position.add(step);
  z.actor.position.copy(z.position);z.actor.rotation.y=Math.atan2(target.position.x-z.position.x,target.position.z-z.position.z);
  animateCharacter(g.time+z.id,true,false,z.actor);z.actor.userData.arms.forEach((a,i)=>a.rotation.x=-1.25+Math.sin(g.time*3+i)*.08);z.actor.visible=z.floor===currentFloor;
  if(Number.isFinite(target.hp)&&z.position.distanceTo(target.position)<1.45&&z.attack<=0){target.hp=Math.max(0,target.hp-8);z.attack=1.2;if(target.id===UndeadCoop.localId)g.hit=.45;}
 }
}
function updateUndeadRevives(dt){
 const g=undeadGame;for(const down of g.players.values()){
  if(down.hp>0)continue;const helper=[...g.players.values()].find(p=>p.hp>0&&p.floor===down.floor&&p.position.distanceTo(down.position)<2.5&&p.input.use);
  down.revive=helper?down.revive+dt:0;if(down.revive>=2){down.hp=85;down.revive=0;}
 }
 for(const supply of g.supplies){supply.cooldown=Math.max(0,supply.cooldown-dt);if(supply.cooldown===0){const p=[...g.players.values()].find(p=>p.hp>0&&p.hp<150&&p.floor===supply.floor&&p.position.distanceTo(supply.position)<1.4);if(p){p.hp=Math.min(150,p.hp+60);supply.cooldown=25;}}supply.model.visible=supply.floor===currentFloor&&!supply.cooldown;}
}
function undeadSnapshot(){const g=undeadGame;return{type:'snapshot',wave:g.wave,nextWave:g.nextWave,ended:g.ended,players:[...g.players.values()].map(p=>({id:p.id,character:p.character,hp:p.hp,ammo:p.ammo,reload:p.reload,fire:p.fire,floor:p.floor,yaw:p.yaw,pitch:p.pitch,kills:p.kills,revive:p.revive,position:p.position.toArray()})),zombies:[...g.zombies.values()].filter(z=>z.hp>0).map(z=>({id:z.id,hp:z.hp,floor:z.floor,position:z.position.toArray(),rotation:z.actor.rotation.y})),supplies:g.supplies.map(s=>s.cooldown)};}
function applyUndeadSnapshot(m){
 const g=undeadGame;if(!g?.remote||!Array.isArray(m.players)||m.players.length>4||!Array.isArray(m.zombies)||m.zombies.length>30)return;
 const validPosition=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite)&&Math.abs(p[0])<500&&Math.abs(p[2])<500&&p[1]>=0&&p[1]<=9;
 if(!m.players.every(p=>g.players.has(p.id)&&validPosition(p.position)&&Number.isFinite(p.hp)&&p.hp>=0&&p.hp<=150&&[0,1].includes(p.floor)&&Number.isFinite(p.ammo)&&p.ammo>=0&&p.ammo<=24)||!m.zombies.every(z=>Number.isInteger(z.id)&&validPosition(z.position)&&[0,1].includes(z.floor)&&Number.isFinite(z.hp)))return;
 g.wave=Math.max(0,Math.min(10000,Number(m.wave)||0));g.nextWave=Math.max(0,Math.min(10,Number(m.nextWave)||0));
 for(const data of m.players){const p=g.players.get(data.id);const at=new THREE.Vector3(...data.position);if(p.id===UndeadCoop.localId&&p.floor===data.floor&&p.position.distanceTo(at)<3)p.position.lerp(at,.4);else p.position.copy(at);for(const key of ['hp','ammo','reload','fire','floor','yaw','pitch','kills','revive'])if(Number.isFinite(data[key]))p[key]=data[key];}
 const received=new Set();for(const data of m.zombies){received.add(data.id);let z=g.zombies.get(data.id);if(!z){z={id:data.id,actor:makeUndeadZombie(),position:new THREE.Vector3()};g.root.add(z.actor);g.zombies.set(z.id,z);}z.hp=data.hp;z.floor=data.floor;z.position.set(...data.position);z.actor.position.copy(z.position);z.actor.rotation.y=Number(data.rotation)||0;}
 for(const [id,z] of g.zombies)if(!received.has(id)){disposeCampObject(z.actor);g.zombies.delete(id);}
 if(Array.isArray(m.supplies))g.supplies.forEach((s,i)=>s.cooldown=Math.max(0,Number(m.supplies[i])||0));if(m.ended)endUndeadSurvival('Your squad has fallen.');
}
function drawUndeadMap(){
 const g=undeadGame,ctx=document.getElementById('undeadMinimap').getContext('2d'),size=210,pad=8,scale=(size-pad*2)/N;
 ctx.fillStyle='#07110a';ctx.fillRect(0,0,size,size);ctx.fillStyle='#374132';for(let z=0;z<N;z++)for(let x=0;x<N;x++)if(undeadCellOpen(x,z,currentFloor))ctx.fillRect(pad+x*scale,pad+z*scale,scale,scale);
 const mark=(position,color,r=2)=>{ctx.fillStyle=color;ctx.beginPath();ctx.arc(pad+position.x/CELL*scale,pad+position.z/CELL*scale,r,0,TAU);ctx.fill();};
 for(const z of g.zombies.values())if(z.hp>0&&z.floor===currentFloor)mark(z.position,'#f0575c');for(const s of g.supplies)if(s.floor===currentFloor&&!s.cooldown)mark(s.position,'#eef9d0',2.5);for(const p of g.players.values())if(p.floor===currentFloor)mark(p.position,p.id===UndeadCoop.localId?'#ffffff':p.hp>0?'#a1db78':'#dd932d',3);
}
function renderUndeadGame(dt){
 const g=undeadGame;if(!g)return;const local=g.players.get(UndeadCoop.localId);if(!local)return;
 if(!g.ended&&(!g.paused||UndeadCoop.role!=='solo')){
  g.time+=dt;let input=g.paused?{yaw,pitch}:undeadInput();local.input=validUndeadInput(input);
  if(g.remote){moveUndeadPlayer(local,local.input,dt,false);g.inputTime+=dt;if(g.inputTime>=.05){UndeadCoop.input(local.input);g.inputTime=0;g.fireIntent=false;}if(local.input.shoot&&local.hp>0&&!local.reload&&local.ammo>0&&!g.feedbackCooldown){playGunshot(.3);g.feedbackCooldown=.18;}g.feedbackCooldown=Math.max(0,(g.feedbackCooldown||0)-dt);}
  else{
   for(const p of g.players.values()){if(p.id!==UndeadCoop.localId&&g.time-(p.lastInput??-100)>1)p.input={};moveUndeadPlayer(p,p.input,dt,true);}
   updateUndeadZombies(dt);updateUndeadRevives(dt);
   if([...g.players.values()].every(p=>p.hp<=0)){endUndeadSurvival('Your squad has fallen.');}
   else if(![...g.zombies.values()].some(z=>z.hp>0)){g.nextWave-=dt;if(g.nextWave<=0){for(const z of g.zombies.values())disposeCampObject(z.actor);g.zombies.clear();spawnUndeadWave();g.nextWave=7;}}
   g.snapshotTime+=dt;if(g.snapshotTime>=.1){if(UndeadCoop.role==='host')UndeadCoop.broadcast(undeadSnapshot());g.snapshotTime=0;}
  }
  if(g.fireIntent&&!g.remote)g.fireIntent=false;
 }
 player.copy(local.position);currentFloor=local.floor;world.visible=currentFloor===0;upperWorld.visible=currentFloor===1;g.corruption.forEach((r,i)=>r.visible=i===currentFloor);
 camera.position.copy(player).add(new THREE.Vector3(0,1.7,0));camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);camera.updateMatrixWorld(true);g.gun.visible=local.hp>0&&!g.paused;g.gun.position.z=-.6+local.fire*.2;
 for(const p of g.players.values())if(p.actor){p.actor.visible=p.floor===currentFloor;p.actor.position.copy(p.position);p.actor.rotation.y=p.yaw+Math.PI;p.actor.rotation.z=p.hp>0?0:Math.PI/2;animateCharacter(g.time,!!(p.input.forward||p.input.side),false,p.actor);}
 if(g.remote)for(const z of g.zombies.values()){z.actor.visible=z.floor===currentFloor;animateCharacter(g.time+z.id,true,false,z.actor);z.actor.userData.arms.forEach(a=>a.rotation.x=-1.25);}
 for(const s of g.supplies)s.model.visible=s.floor===currentFloor&&!s.cooldown;
 for(const e of g.effects)e.left-=dt;for(let i=g.effects.length-1;i>=0;i--)if(g.effects[i].left<=0){disposeCampObject(g.effects[i].obj);g.effects.splice(i,1);}
 g.hit=Math.max(0,g.hit-dt);document.getElementById('undeadHit').style.opacity=g.hit;
 document.getElementById('undeadWave').textContent='WAVE '+String(g.wave).padStart(2,'0');const infected=[...g.zombies.values()].filter(z=>z.hp>0).length;document.getElementById('undeadCount').textContent=infected?infected+' INFECTED REMAINING':'NEXT WAVE / '+Math.max(0,Math.ceil(g.nextWave))+'s';
 document.getElementById('undeadHealth').textContent=local.hp>0?'HEALTH / '+Math.ceil(local.hp)+' / 150':'DOWNED / SQUAD CAN REVIVE YOU';document.getElementById('undeadAmmo').textContent=local.reload>0?'RELOADING…':'AMMO / '+local.ammo+' / 24';document.getElementById('undeadFloor').textContent=currentFloor?'UPPER FLOOR':'GROUND FLOOR';
 document.getElementById('undeadTeam').textContent=[...g.players.values()].map(p=>UNDEAD_CHARACTERS[p.character][0].split(' ')[0]+' '+(p.hp>0?Math.ceil(p.hp)+' HP':'DOWN')).join(' · ');
 const fallen=[...g.players.values()].find(p=>p.id!==local.id&&p.hp<=0&&p.floor===local.floor&&p.position.distanceTo(local.position)<2.5);document.getElementById('undeadPrompt').textContent=fallen?'HOLD E / REVIVE '+UNDEAD_CHARACTERS[fallen.character][0]:liftCells.some(l=>Math.hypot(player.x-l.x*CELL,player.z-l.z*CELL)<3)?'E / SERVICE LIFT':'';
 g.mapTimer+=dt;if(g.mapTimer>.2||dt===0){drawUndeadMap();g.mapTimer=0;}
}
function endUndeadSurvival(reason){
 const g=undeadGame;if(!g||g.ended)return;g.ended=true;g.holding=false;keys.clear();undeadPreferences.bestWave=Math.max(Number(undeadPreferences.bestWave)||0,g.wave);saveUndeadPreferences();
 if(UndeadCoop.role==='host')UndeadCoop.broadcast({type:'end',reason,wave:g.wave});document.exitPointerLock?.();document.getElementById('undeadPause').hidden=false;document.getElementById('undeadPauseTitle').textContent='THE HORDE REMAINS.';document.getElementById('undeadPauseText').textContent=reason+' Reached wave '+g.wave+'.';document.getElementById('undeadResume').hidden=true;document.getElementById('undeadRetry').hidden=UndeadCoop.role==='client';updateMobileControls();
}
function pauseUndead(){const g=undeadGame;if(!g||g.ended)return;g.paused=!g.paused;g.holding=false;keys.clear();document.getElementById('undeadPause').hidden=!g.paused;document.getElementById('undeadPauseTitle').textContent='STAY ALIVE.';document.getElementById('undeadPauseText').textContent=UndeadCoop.role==='solo'?'Survival paused.':'Your online squad is still in the complex. The session continues.';document.getElementById('undeadResume').hidden=false;document.getElementById('undeadRetry').hidden=true;if(g.paused)document.exitPointerLock?.();else requestLock();updateMobileControls();}
function renderUndead(dt){
 const c=undeadScene;if(!c)return;if(mode==='undeadPlay'){renderUndeadGame(dt);return;}c.time+=dt;
 if(mode==='undeadIntro'){
  c.lineTime+=dt;const red=c.line>=2;c.alarm.intensity=red?8+Math.sin(c.time*6)*6:0;c.lights.forEach((l,i)=>l.intensity=red?10+Math.sin(c.time*8+i)*8:22);
  if(c.line>=3){c.corpse.rotation.z=Math.max(0,Math.PI/2-c.lineTime*.13);c.corpse.position.y=.25;c.corpse.userData.arms.forEach(a=>a.rotation.x=-1.2);}
  const shots=[[2,2.5,10],[-5,2.8,5],[3,2.2,-.5],[2.8,1.7,5],[0,2.3,12]],targets=[[0,2,-8],[0,2,-10],[6,1.8,-4],[0,1,1],[0,1.5,-3]];
  camera.position.copy(c.root.position).add(new THREE.Vector3(...shots[c.line]));camera.position.x+=Math.sin(c.lineTime*.12)*.4;camera.up.set(0,1,0);camera.lookAt(c.root.position.clone().add(new THREE.Vector3(...targets[c.line])));
  if(c.lineTime>Math.max(7,UNDEAD_OPENING[c.line][1].split(/\s+/).length/2.8+1))advanceUndeadOpening();
 }else{
  if(c.actor){c.actor.rotation.y=.2+Math.sin(c.time*.24)*.26;animateCharacter(c.time,false,false,c.actor);}
  camera.position.copy(c.root.position).add(new THREE.Vector3(.1,1.8,4.5));camera.lookAt(c.root.position.clone().add(new THREE.Vector3(-1.4,1.4,0)));
 }camera.updateMatrixWorld(true);
}
UndeadCoop.onEvent=(type,data)=>{
 if(type==='roster')renderUndeadRoster();
 else if(type==='connection')lobbyStatus(data.connected?'Squad connected. Choose READY, then the host starts survival.':data.message);
 else if(type==='start'&&(mode==='undeadMaps'||mode==='undeadPlay'&&undeadGame?.ended)&&data.map==='bc-complex')startUndeadMap(true);
 else if(type==='input'&&undeadGame&&!undeadGame.remote){const p=undeadGame.players.get(data.id);if(p){p.input=validUndeadInput(data.input);p.lastInput=undeadGame.time;}}
 else if(type==='snapshot')applyUndeadSnapshot(data);
 else if(type==='end')endUndeadSurvival(typeof data.reason==='string'?data.reason.slice(0,150):'The session has ended.');
 else if(type==='disconnect'){lobbyStatus('The host disconnected. Return to the lobby to reconnect.');endUndeadSurvival('The host disconnected.');}
 else if(type==='departure'&&undeadGame){const p=undeadGame.players.get(data);if(p?.actor)disposeCampObject(p.actor);undeadGame.players.delete(data);}
};
document.getElementById('openUndead').onclick=enterUndead;
document.getElementById('undeadExit').onclick=()=>{menu();refreshProgressUI();};
document.getElementById('undeadOpeningNext').onclick=advanceUndeadOpening;document.getElementById('undeadOpeningSkip').onclick=showUndeadMenu;
document.getElementById('undeadMapsButton').onclick=showUndeadMaps;document.getElementById('undeadMapsBack').onclick=()=>{if(UndeadCoop.role!=='solo')UndeadCoop.close();document.getElementById('undeadConnection').hidden=true;showUndeadMenu();};
document.getElementById('undeadSolo').onclick=()=>{UndeadCoop.close();startUndeadMap();};
document.getElementById('undeadHost').onclick=()=>{UndeadCoop.host(undeadPreferences.character);document.getElementById('undeadConnection').hidden=false;document.getElementById('undeadCodeOutput').value='';document.getElementById('undeadCodeInput').value='';document.getElementById('undeadCodeLabel').textContent='PASTE YOUR FRIEND’S REPLY';document.getElementById('undeadAcceptCode').textContent='ACCEPT REPLY';lobbyStatus('Create an invite for each friend. Up to four players can survive together.');renderUndeadRoster();};
document.getElementById('undeadJoin').onclick=()=>{UndeadCoop.close();document.getElementById('undeadConnection').hidden=false;document.getElementById('undeadCodeOutput').value='';document.getElementById('undeadCodeInput').value='';document.getElementById('undeadCodeLabel').textContent='PASTE THE HOST’S INVITE';document.getElementById('undeadAcceptCode').textContent='JOIN / CREATE REPLY';document.getElementById('undeadCreateInvite').hidden=true;document.getElementById('undeadReady').hidden=true;document.getElementById('undeadStartSquad').hidden=true;lobbyStatus('Paste your host’s invite, then send your reply code back to them.');};
document.getElementById('undeadCreateInvite').onclick=()=>undeadConnectionAction(async()=>{lobbyStatus('Preparing your invite…');document.getElementById('undeadCodeOutput').value=await UndeadCoop.invite();lobbyStatus('Invite ready. Send it to your friend, then accept their reply.');});
document.getElementById('undeadAcceptCode').onclick=()=>undeadConnectionAction(async()=>{const code=document.getElementById('undeadCodeInput').value;if(UndeadCoop.role==='host'){await UndeadCoop.accept(code);lobbyStatus('Reply accepted. Connecting your squad…');}else{document.getElementById('undeadCodeOutput').value=await UndeadCoop.join(code,undeadPreferences.character);lobbyStatus('Send this reply to the host. Your squad connects after they accept it.');}renderUndeadRoster();});
document.getElementById('undeadCopyCode').onclick=async()=>{const field=document.getElementById('undeadCodeOutput');if(!field.value)return;try{await navigator.clipboard.writeText(field.value);lobbyStatus('Code copied.');}catch(e){field.focus();field.select();lobbyStatus('Your code is selected. Copy it and send it to your friend.');}};
document.getElementById('undeadReady').onclick=()=>{const me=UndeadCoop.players.find(p=>p.id===UndeadCoop.localId);UndeadCoop.select(undeadPreferences.character,!me?.ready);document.getElementById('undeadReady').textContent=me?.ready?'READY':'UNREADY';};
document.getElementById('undeadStartSquad').onclick=()=>startUndeadMap();document.getElementById('undeadLeaveSquad').onclick=()=>{UndeadCoop.close();document.getElementById('undeadConnection').hidden=true;lobbyStatus('Squad closed.');};
document.getElementById('undeadResume').onclick=pauseUndead;document.getElementById('undeadRetry').onclick=()=>startUndeadMap();document.getElementById('undeadReturnMaps').onclick=()=>{if(UndeadCoop.role==='client'){UndeadCoop.close();document.getElementById('undeadConnection').hidden=true;lobbyStatus('You left the squad. Join a host to reconnect.');}showUndeadMaps();};
document.addEventListener('keydown',e=>{
 if(!mode.startsWith('undead')||e.target.closest?.('textarea,input'))return;
 if(mode==='undeadIntro'&&e.code==='Enter'&&!e.repeat){e.preventDefault();if(!e.target.closest?.('button'))advanceUndeadOpening();return;}
 if(e.code==='Escape'&&!e.repeat){e.preventDefault();if(mode==='undeadPlay')pauseUndead();else if(mode==='undeadMaps')document.getElementById('undeadMapsBack').click();else{menu();refreshProgressUI();}return;}
 if(mode==='undeadPlay'&&!undeadGame.paused&&!undeadGame.ended){if(['Space','Tab'].includes(e.code))e.preventDefault();keys.add(e.code);}
});
document.addEventListener('mousemove',e=>{if(mode==='undeadPlay'&&!undeadGame.paused&&!undeadGame.ended&&(document.pointerLockElement||drag)){yaw-=THREE.MathUtils.clamp(e.movementX||0,-100,100)*.0023*(window.controlPreferences?.sensitivity||1);pitch=THREE.MathUtils.clamp(pitch-(e.movementY||0)*.0023*(window.controlPreferences?.sensitivity||1),-1.2,1.2);}});
document.getElementById('world').addEventListener('mousedown',e=>{if(e.button===0&&mode==='undeadPlay'&&!undeadGame.paused&&!undeadGame.ended){undeadGame.holding=true;shootUndead();requestLock();}});
addEventListener('mouseup',()=>{if(undeadGame)undeadGame.holding=false;});
document.addEventListener('pointerlockchange',()=>{if(mode==='undeadPlay'&&!document.pointerLockElement&&!window.mobileTouchActive&&!undeadGame?.paused&&!undeadGame?.ended)pauseUndead();});
addEventListener('blur',()=>{if(mode==='undeadPlay'&&!undeadGame?.paused&&!undeadGame?.ended)pauseUndead();});
refreshUndeadEntry();renderUndeadRoster();
