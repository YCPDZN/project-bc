/* Kevin route / Josiah survives. Uses the established mall and Siege opening. */
const kevinSiegeCard=document.createElement('article');
kevinSiegeCard.id='chapter5KevinSiege';
kevinSiegeCard.className='chapter-card';
kevinSiegeCard.innerHTML='<div class="chapter-eyebrow">CHAPTER 05 / KEVIN ROUTE</div><h3>The Siege of Brent Cross</h3><p>Police · PSRM · Resistance · Your allied ninjas</p><strong id="kevinSiegeState"></strong><button id="openKevinSiege">PLAY THE SIEGE OF BRENT CROSS</button>';
document.getElementById('chapter4KevinUxbridge').after(kevinSiegeCard);
document.getElementById('openKevinSiege').onclick=()=>startSecretaryOpening(true);

function canOpenKevinSiege(){return canOpenUxbridge()&&gameProgress.uxbridgeEndingViewed===true;}
function refreshKevinSiegeChapter(){
 const unlocked=canOpenKevinSiege();
 kevinSiegeCard.hidden=!unlocked;
 document.getElementById('openKevinSiege').disabled=!unlocked;
 document.getElementById('kevinSiegeState').textContent=gameProgress.kevinSiegeCompleted?'COMPLETE / REPLAY FROM OPENING CUTSCENE':'UNLOCKED / OPENING CUTSCENE';
}
function isKevinSiegeOpening(){return secretaryOpening?.kevinSiege===true;}

const KEVIN_SIEGE_JOSIAH_TAUNTS=[
 'Peter. You stood beside me for years, and now you hide behind Murderhorn’s little errand runner. Look at what you have reduced yourself to.',
 'Kevin, those black chains do not make you my equal. They make you a prisoner who has mistaken his leash for a crown.',
 'You crossed London following a voice in your sleep. Tell me, did he promise you freedom before he put you to work?',
 'Yellow banners. Masked servants. A borrowed deputy. Is this your great rebellion, Murderhorn? A collection of people you have not betrayed yet?',
 'Pinter can seal the exits. Williams can rally his defectors. Juko can break every gate outside. None of them commands this atrium. I DO.',
 'You watched Alissa fall at Embankment and still thought you could walk into my stronghold untouched. You have learned absolutely nothing.',
 'Peter, there will be no second throne waiting for you. When I am finished with your new friends, you will answer to me on your knees.',
 'Hear that, Kevin? Your ninjas are dying for a future you would never share with them. At least I have the decency to call obedience what it is.',
 'Keep firing. Every empty magazine is another confession that you came here without the power to finish what you started.',
 'No police. No Resistance. No Murderhorn. When these golden chains close around you, there will be one authority left in Brent Cross—MINE.'
];
const kevinSiegeJosiahCombatAudio=[
 'assets/CH5ASOBC1.mp3','assets/CH5ASOBC2.mp3','assets/CH5ASOBC3.mp3','assets/CH5ASOBC4.mp3','assets/CH5ASOBC5.mp3',
 'assets/CH5ASOBC6.mp3','assets/CH5ASOBC7.mp3','assets/CH5ASOBC8.mp3','assets/CH5ASOBC9.mp3','assets/CH5ASOBC10.mp3'
].map(src=>{
 const clip=new Audio(src);
 clip.preload='metadata';clip.volume=.9;AudioOptions.category(clip,'voice');
 return clip;
});
function kevinSiegeAtriumCell(x,z){return x>=30&&x<=50&&z>=26&&z<=48;}
function kevinSiegeCellOpen(x,z,floor){
 if(grid[z]?.[x]!==0||floor===1&&z>=68)return false;
 if(liftCells.some(l=>l.z!==57&&Math.abs(x-l.x)<=1&&Math.abs(z-l.z)<=1))return false;
 // Ground entrances are sealed; the upper galleries lead to the existing stairwell.
 return !(floor===0&&((x>=28&&x<=29||x>=51&&x<=52)&&z>=24&&z<=50||(z>=24&&z<=25||z>=49&&z<=50)&&x>=28&&x<=52));
}

function setupKevinSiegeForces(){
 const w=finalWar;
 w.primeRoute=w.siegeRoute=false;
 w.atriumReleased=false;
 w.kevinAtriumEntered=false;
 w.seals.visible=true;
 // Walls stop below the upper galleries, leaving their stair landing accessible.
 for(const o of w.seals.children)if(o.geometry?.parameters.height===12&&o.position.y===6){o.scale.y=8.6/12;o.position.y=4.3;}
 w.josiahFloor=0;
 w.josiah.position.copy(finalWarNearest(40,37,0));
 poseJosiahGrieving(w.josiah,false);
 const peter=addFinalWarUnit('PETER CHAMBERS','yellow',makePeter(),39,10,Infinity,'ally');
 const kevin=addFinalWarUnit('KEVIN MURDERHORN','yellow',makeRevealedKevin(),41,10,Infinity,'ally');
 kevin.followerCombat='kevin';
 w.kevin=kevin;
 w.playerFollowers=[peter,kevin];
 const gareth=makeGareth();applyGarethResistanceOutfit(gareth,true);
 addFinalWarUnit('GARETH WILLIAMS','blue',gareth,24,36,2500,'police');
 addFinalWarUnit('DAMIAN JUKO','blue',makeDamianJuko(),23,39,2500,'police');
 addFinalWarUnit('CHRIS PINTER','green',makeChrisPinter(),39,72,1500,'police');
 // Patrols on both levels converge on opponents, rather than arriving in waves.
 for(const [faction,sites] of [
  ['yellow',[[35,12],[45,12],[25,17],[55,17],[20,25],[59,27],[18,40],[62,43]]],
  ['red',[[26,29],[54,29],[26,42],[54,42],[24,22],[56,52],[35,48],[46,48]]],
  ['green',[[34,69],[45,69],[35,61],[45,61],[22,58],[59,58],[19,53],[65,53]]],
  ['blue',[[20,35],[20,42],[23,30],[18,46],[59,32],[62,37],[58,46],[64,43]]]
 ])for(const [i,[x,z]] of sites.entries()){
  const actor=faction==='yellow'?makeCampNinja():faction==='red'?makePSRMSoldier():makeChrisPinter(true);
  addFinalWarUnit(faction==='yellow'?'NINJA':faction==='red'?'PSRM':faction==='green'?'POLICE':'RESISTANCE',faction,actor,x,z,faction==='yellow'?300:220,faction==='yellow'?'ninja':faction==='red'?'rifle':'police',i<6?0:1);
 }
 gameProgress.kevinSiegeStarted=true;
 saveProgress();
 $('finalWarHUD').className='siege-war-hud';
 $('finalWarHUD').querySelector('.eyebrow').textContent='CHAPTER 05 / KEVIN ROUTE / THE SIEGE OF BRENT CROSS';
 $('finalWarHUD').querySelector('.war-map p').innerHTML='<span style="color:#ffd44c">● YOU / PETER / KEVIN / NINJAS</span><br><span style="color:#5bdf8e">● POLICE / PINTER</span> · <span style="color:#f33858">● PSRM / JOSIAH</span><br><span style="color:#65b8ff">● RESISTANCE / GARETH / DAMIAN</span>';
 $('finalWarHUD').querySelector('.war-keys').textContent='WASD MOVE · SHIFT SPRINT · CLICK / Z FIRE · R RELOAD · E SOUTH LIFT · ESC PAUSE · WHITE CRATES RESTORE HEALTH';
 updateKevinSiegeObjectives();
}

function updateKevinSiegeObjectives(){
 const w=finalWar;if(!w?.kevinSiegeRoute)return;
 // Followers cross levels with the player using the same ally system as the original Siege.
 $('finalWarKevinHealth').hidden=true;
 $('finalWarKevinDialogue').hidden=true;
 $('finalWarNotice').textContent=w.josiahEncounter?'DEFEAT JOSIAH IN THE ATRIUM · PETER AND KEVIN ARE WITH YOU':'ATRIUM SEALED · SOUTH LIFT → UPPER GALLERIES → STAIRS DOWN';
 $('finalWarTravel').textContent=w.onStairs?'ATRIUM STAIRWELL · WALK UP / DOWN':Math.hypot(player.x-40*CELL,player.z-57*CELL)<3?'[ E ] SOUTH LIFT · '+(currentFloor?'GROUND FLOOR':'UPPER FLOOR'):currentFloor?'UPPER GALLERIES · ATRIUM STAIRS / CENTRE OF MAP':kevinSiegeAtriumCell(cell(player).x,cell(player).z)?'GRAND ATRIUM · STAIRS ARE THE ONLY EXIT':'GROUND FLOOR · ATRIUM ENTRANCES SEALED';
 $('finalWarCounts').textContent=['yellow','green','red','blue'].map((f,i)=>['ALLIES','POLICE','PSRM','RESISTANCE'][i]+' '+w.units.filter(u=>u.faction===f&&u.hp>0).length).join(' · ');
 // Keep Josiah's combat movement inside the atrium while he fights every opposing team.
 const boss=w.josiahEncounter?.unit;
 if(boss?.hp>0){boss.actor.position.x=THREE.MathUtils.clamp(boss.actor.position.x,30*CELL,50*CELL);boss.actor.position.z=THREE.MathUtils.clamp(boss.actor.position.z,26*CELL,48*CELL);}
}
function finishKevinSiege(){
 const w=finalWar;if(!w?.kevinSiegeRoute||w.ended)return;
 stopJosiahFinalVoice();stopKevinWarVoice();
 w.josiahEncounter.phase='defeated';
 w.josiah.rotation.z=Math.PI/2;w.josiah.position.y=.3;
 w.ended=true;w.holding=false;keys.clear();
 gameProgress.kevinSiegeCompleted=true;saveProgress();
 startKevinSiegeEnding();
}

function kevinIsSiegeVictor(){return kevinTubeAlissaDefeated()&&gameProgress.kevinSiegeCompleted===true;}
function resetKevinSiegeJosiahMenuModel(){
 if(!kevinIsSiegeVictor()||selectedSubject!==0||!['menu','viewer'].includes(mode))return;
 updateJosiahMenuInjury(false);updateJosiahUntouchable(false);poseJosiahGrieving(subject,false);setSternJosiah(subject,false);
 subject.visible=true;awakenedJosiahMenu.visible=false;if(solGuardianMenu)solGuardianMenu.visible=false;
 subject.rotation.z=0;subject.userData.body.rotation.set(0,0,0);subject.userData.head.rotation.set(0,0,0);
 animateCharacter(clock,false,false,subject);
}
const KEVIN_SIEGE_ENDING_LINES=[
 ['THE GOLDEN CHAINS FALL','Josiah Richards lies motionless beneath the roof of Brent Cross. The atrium he sealed has become the place where his rule ends.'],
 ['PETER CHAMBERS','The deputy stands beside the man he once called an enemy. There is no final order from Josiah. No one answers to him now.'],
 ['THE VOICE FROM THE DREAM','You stepped off the train in Camden. You opened the blue door. The voice that promised you a way out has led you here.'],
 ['KEVIN MURDERHORN / VICTORIOUS','Kevin brings his hands together. Behind him, a black figure rises. Where the golden chains have fallen, black chains take their place.'],
 ['THE SIEGE OF BRENT CROSS / END','The battle beyond the atrium is not forgotten. But the stronghold has fallen, and Kevin Murderhorn is already looking towards what comes next.']
];
const kevinSiegeEndingUI=document.createElement('section');
kevinSiegeEndingUI.id='kevinSiegeEndingUI';kevinSiegeEndingUI.hidden=true;
kevinSiegeEndingUI.setAttribute('aria-label','Kevin route Siege ending cutscene');
kevinSiegeEndingUI.innerHTML='<div class="cinema-top"><span>CHAPTER 05 / THE SIEGE OF BRENT CROSS / KEVIN ROUTE</span><button id="kevinSiegeEndingNext">CONTINUE · ENTER</button></div><div class="cinema-dialogue"><strong id="kevinSiegeEndingSpeaker"></strong><p id="kevinSiegeEndingLine"></p></div>';
document.body.appendChild(kevinSiegeEndingUI);
const kevinSiegeOutroUI=document.createElement('section');
kevinSiegeOutroUI.id='kevinSiegeOutro';kevinSiegeOutroUI.hidden=true;
kevinSiegeOutroUI.setAttribute('aria-label','The Siege of Brent Cross Kevin route outro');
kevinSiegeOutroUI.innerHTML=`<div class="credits-heading">PROJECT BC / THE SIEGE OF BRENT CROSS</div>
<button id="kevinSiegeOutroSkip">SKIP TO END</button>
<div id="kevinSiegeOutroScroll" tabindex="0" aria-label="Ending story"><div class="credits-copy">
<div class="eyebrow">THE SIEGE OF BRENT CROSS / KEVIN ROUTE</div>
<h1>KEVIN MURDERHORN<br>VICTORIOUS</h1>
<p>The golden chains fall silent. Josiah Richards, the Prime Secretary who claimed Brent Cross as his stronghold, lies dead in its atrium.</p>
<p>Alissa’s death at Embankment did not secure his future. The power he kept, the deputy he trusted, and the walls he raised could not save him from the alliance waiting beyond them.</p>
<p>Peter Chambers stands with Kevin Murderhorn. Around them, the surviving ninjas hold the atrium. The police, the PSRM and the Resistance fought for the same centre; none of their banners stands beside the fallen Prime Secretary.</p>
<p>Gareth Williams, Damian Juko and Chris Pinter did not survive the siege. Peter Chambers did. He stands victorious beside Kevin, beneath the roof where his former leader fell.</p>
<p>You followed a voice through a dream, stepped off a train, and opened a blue door. It promised an escape from betrayal. Every step brought you deeper into someone else’s plan.</p>
<p>Kevin’s hands meet in a silent prayer. His black figure towers behind him, and its chains stretch across the place Josiah once commanded. A ruler has fallen. The hunger for power has survived.</p>
<div class="credits-finish"><h2>THE END</h2><p>KEVIN MURDERHORN VICTORIOUS</p><p>BRENT CROSS HAS FALLEN.</p></div>
</div></div><button id="kevinSiegeOutroMenu" hidden>MAIN MENU</button>`;
document.body.appendChild(kevinSiegeOutroUI);

function startKevinSiegeEnding(){
 const w=finalWar;if(!w?.kevinSiegeRoute||!w.ended||w.kevinSiegeEnding)return;
 for(const id of ['finalWarHUD','finalWarPause','finalWarEnd','josiahAtriumDialogue','josiahAtriumHealth','finalWarKevinDialogue','finalWarKevinHealth'])$(id).hidden=true;
 keys.clear();drag=false;flash.visible=false;w.gun.visible=false;
 const c=w.kevinSiegeEnding={phase:'cinematic',line:0,time:0,lineTime:0,fogDensity:scene.fog.density,ambient:ambient.intensity,fill:cameraFill.intensity};
 for(const u of w.units){u.actor.visible=false;if(u.spectre)u.spectre.visible=false;if(u.cast?.warning)u.cast.warning.visible=false;}
 for(const effect of w.effects)effect.obj.visible=false;
 for(const kit of w.medkits)kit.model.visible=false;
 currentFloor=0;world.visible=true;upperWorld.visible=false;
 // Stage the ending on the open atrium floor, clear of the central fountain.
 c.anchor=new THREE.Vector3(40*CELL,0,42*CELL);
 w.josiah.visible=true;w.josiah.position.copy(c.anchor).add(new THREE.Vector3(-2.8,.3,1));
 c.peter=w.playerFollowers.find(u=>u.name==='PETER CHAMBERS').actor;
 c.peter.visible=true;c.peter.position.copy(c.anchor).add(new THREE.Vector3(3.4,0,-1));c.peter.rotation.set(0,-.25,0);
 c.victor=getVictoriousKevinMenu(false);w.root.add(c.victor);c.victor.visible=true;c.victor.position.copy(c.anchor);c.victor.rotation.set(0,.12,0);
 c.guards=[];for(const [x,z] of [[-5,-3],[5,-3],[-6,-6],[6,-6]]){const guard=makeCampNinja();guard.position.copy(c.anchor).add(new THREE.Vector3(x,0,z));w.root.add(guard);c.guards.push(guard);}
 const key=new THREE.PointLight(0xffdfc0,32,24);key.position.copy(c.anchor).add(new THREE.Vector3(1,5,5));w.root.add(key);
 const rim=new THREE.PointLight(0xab163b,26,19);rim.position.copy(c.anchor).add(new THREE.Vector3(-3,3,-3));w.root.add(rim);
 ambient.intensity=.7;cameraFill.intensity=.2;scene.fog.density=.006;
 kevinSiegeEndingUI.hidden=false;showKevinSiegeEndingLine();renderKevinSiegeEnding(0);
 updateMobileControls();document.exitPointerLock?.();syncMenuSong();
}
function showKevinSiegeEndingLine(){
 const c=finalWar?.kevinSiegeEnding;if(c?.phase!=='cinematic')return;
 $('kevinSiegeEndingSpeaker').textContent=KEVIN_SIEGE_ENDING_LINES[c.line][0];
 $('kevinSiegeEndingLine').textContent=KEVIN_SIEGE_ENDING_LINES[c.line][1];
 $('kevinSiegeEndingNext').textContent=c.line===KEVIN_SIEGE_ENDING_LINES.length-1?'OUTRO · ENTER':'CONTINUE · ENTER';
}
function advanceKevinSiegeEnding(){
 const c=finalWar?.kevinSiegeEnding;if(!c)return;
 if(c.phase==='outro'){if(kevinSiegeOutroUI.dataset.finished==='true')returnFromKevinSiegeOutro();else finishKevinSiegeOutro();return;}
 if(++c.line>=KEVIN_SIEGE_ENDING_LINES.length){startKevinSiegeOutro();return;}
 c.lineTime=0;showKevinSiegeEndingLine();
}
function renderKevinSiegeEnding(dt){
 const c=finalWar?.kevinSiegeEnding;if(!c)return;
 if(c.phase==='outro'){renderKevinSiegeOutro(dt);return;}
 c.time+=dt;c.lineTime+=dt;
 animateCharacter(c.time,false,false,c.peter);for(const guard of c.guards)animateCharacter(c.time,false,true,guard);
 const u=c.victor.userData;u.body.position.y=Math.sin(c.time*1.5)*.006;u.victorySpectre.visible=c.line>=3;
 u.victoryChains.visible=c.line>=3;u.victorySpectre.position.y=.15+Math.sin(c.time*1.4)*.055;u.victoryChains.rotation.y=Math.sin(c.time*.65)*.045;
 const shots=[[-4.8,1.5,5.5],[5.9,2,5.8],[-4.5,3.1,10],[.3,2.25,5.3],[5.5,3.9,12]],looks=[[-2.8,.6,1],[2.9,1.7,-.5],[0,1.5,0],[0,1.95,0],[0,1.5,0]];
 camera.position.copy(c.anchor).add(new THREE.Vector3(...shots[c.line]));camera.position.x+=Math.sin(c.lineTime*.12)*.2;
 camera.up.set(0,1,0);camera.lookAt(c.anchor.clone().add(new THREE.Vector3(...looks[c.line])));camera.updateMatrixWorld(true);
 if(c.lineTime>=Math.max(6,KEVIN_SIEGE_ENDING_LINES[c.line][1].split(/\s+/).length/3+1))advanceKevinSiegeEnding();
}
function startKevinSiegeOutro(){
 const c=finalWar?.kevinSiegeEnding;if(c?.phase!=='cinematic')return;
 c.phase='outro';c.time=0;c.scrollCarry=0;keys.clear();drag=false;
 finalWar.root.visible=false;world.visible=false;upperWorld.visible=false;
 scene.background.setHex(0x030205);kevinSiegeEndingUI.hidden=true;
 kevinSiegeOutroUI.hidden=false;kevinSiegeOutroUI.dataset.finished='false';
 $('kevinSiegeOutroScroll').scrollTop=0;$('kevinSiegeOutroMenu').hidden=true;syncMenuSong();
}
function finishKevinSiegeOutro(){
 if(finalWar?.kevinSiegeEnding?.phase!=='outro')return;
 $('kevinSiegeOutroScroll').scrollTop=$('kevinSiegeOutroScroll').scrollHeight;
 kevinSiegeOutroUI.dataset.finished='true';$('kevinSiegeOutroMenu').hidden=false;
 gameProgress.kevinSiegeOutroViewed=true;saveProgress();
}
function renderKevinSiegeOutro(dt){
 const c=finalWar?.kevinSiegeEnding;if(c?.phase!=='outro'||kevinSiegeOutroUI.dataset.finished==='true')return;
 c.time+=dt;const scroll=$('kevinSiegeOutroScroll');
 if(c.time>3){c.scrollCarry+=dt*28;const step=Math.floor(c.scrollCarry);scroll.scrollTop+=step;c.scrollCarry-=step;}
 if(scroll.scrollTop+scroll.clientHeight>=scroll.scrollHeight-2)finishKevinSiegeOutro();
}
function returnFromKevinSiegeOutro(){
 if(finalWar?.kevinSiegeEnding?.phase!=='outro'||kevinSiegeOutroUI.dataset.finished!=='true')return;
 kevinSiegeOutroUI.hidden=true;
 loadChapterScreen('KEVIN MURDERHORN VICTORIOUS',()=>{selectedSubject=6;menu();selectSubject(6);refreshProgressUI();});
}
function clearKevinSiegeEnding(){
 kevinSiegeEndingUI.hidden=kevinSiegeOutroUI.hidden=true;
 const c=finalWar?.kevinSiegeEnding;if(!c)return;
 scene.fog.density=c.fogDensity;ambient.intensity=c.ambient;cameraFill.intensity=c.fill;
}
document.getElementById('kevinSiegeEndingNext').onclick=advanceKevinSiegeEnding;
document.getElementById('kevinSiegeOutroSkip').onclick=finishKevinSiegeOutro;
document.getElementById('kevinSiegeOutroMenu').onclick=returnFromKevinSiegeOutro;
addEventListener('keydown',e=>{if(mode==='finalWar'&&finalWar?.kevinSiegeEnding&&e.code==='Enter'&&!e.repeat){e.preventDefault();if(e.target.closest?.('button'))return;advanceKevinSiegeEnding();}});
