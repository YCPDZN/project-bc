/* Playtest shortcuts enter their destination only after the chapter loader finishes. */
'use strict';
(()=>{
 const button=id=>document.getElementById(id);
 const curtainEnding=document.createElement('button');curtainEnding.id='debugFinalCurtainEnding';curtainEnding.type='button';curtainEnding.textContent='THE FINAL CURTAIN CALL / ENDING CUTSCENE';button('debugRestorePanel').insertBefore(curtainEnding,button('debugRestorePanel').firstChild);
 curtainEnding.onclick=()=>{if(mode!=='menu')return;enter('THE FINAL CURTAIN CALL / ENDING CUTSCENE',()=>{gameProgress={brentCrossCompleted:true,cabinetUnlocked:true,cabinetCompleted:true,cabinetBriefingViewed:true,garethQuestCompleted:false,a5EscapeCompleted:true,stephenFallWitnessed:true,stephenFellOnMotorway:true,kevinRouteStarted:true,tubeCompleted:true,kevinTubeClashWinner:'alissa',bustersIntroViewed:true,pindarCompleted:true,finalCurtainIntroViewed:true,finalCurtainCompleted:true,finalCurtainBattleDeaths:['david','gareth','mariah','alissa'],debugCompletion:true};saveProgress();refreshProgressUI();startCurtainEnding();button('debugRestoreResult').textContent='Playtest: The Final Curtain Call / ending cutscene';});};
 function seed(chapter,route,options={}){
  if(mode!=='menu')return false;
  const loyal=route==='resistance';
  const helped=options.helped??button('debugJones').checked;
  const emmaSaved=options.emmaSaved??button('debugEmma').checked;
  const stephenAlive=button('debugStephen').checked;
  button('debugResistance').checked=loyal;
  gameProgress={brentCrossCompleted:true,cabinetUnlocked:true,garethQuestCompleted:loyal,debugCompletion:true};
  if(chapter>=3){
   Object.assign(gameProgress,{cabinetCompleted:true,cabinetBriefingViewed:true});
   if(loyal)Object.assign(gameProgress,{loyalBossDefeated:true,loyalPursuitCompleted:true,stephenRescued:stephenAlive,stephenLoyalDeathConfirmed:!stephenAlive});
   else Object.assign(gameProgress,{a5EscapeCompleted:true,stephenFallWitnessed:true,stephenFellOnMotorway:true});
  }
  if(chapter>=4){
   if(loyal)Object.assign(gameProgress,{civilDisobedienceStarted:true,civilDisobedienceCompleted:true,civilDisobedienceSurvived:true});
   else Object.assign(gameProgress,{tubeCompleted:true,tubeBetrayalSeen:true});
  }
  if(chapter>=5){
   if(loyal)Object.assign(gameProgress,{
    corneredRatStarted:true,corneredRatIntroViewed:true,corneredRatRoomsCompleted:100,
    josiahWrathful:true,mariahFreed:helped,garethJonesDeceased:!helped,mariahNeverSeenAgain:!helped,
    peterDoor100Defeated:helped,peterKilledByStephen:helped&&emmaSaved&&stephenAlive,
    emmaRescued:helped&&emmaSaved,emmaShot:helped&&!emmaSaved,josiahBreakdownViewed:helped&&!emmaSaved
   });
   else Object.assign(gameProgress,{tyrantFourSquareCleared:true,tyrantFourCompleted:true,tyrantWilliamsKilled:true,damianRevealViewed:true});
  }
  saveProgress();refreshProgressUI();
  button('debugRestoreResult').textContent='Playtest save ready: '+(chapter===5?(loyal?chapterFiveTitle():'THE DEFENSE OF BRENT CROSS'):'CHAPTER '+chapter);
  return true;
 }
 function enter(title,build){
  closeChapterPicker();
  loadChapterScreen(title,build);
 }
 function chapter(chapter){
  const route=button('debugResistance').checked?'resistance':'tyrant';
  if(!seed(chapter,route))return;
  closeChapterPicker();
  if(chapter===2)startCabinet();
  else if(chapter===3)(route==='resistance'?startCivilDisobedience:startTubeMission)();
  else if(chapter===4)(route==='resistance'?startCorneredRat:startTyrantFour)();
  else if(route==='resistance')startSecretaryOpening();
  else startDefense();
 }
 for(const chapterNumber of [2,3,4,5])button('debugRestore'+chapterNumber).onclick=()=>chapter(chapterNumber);
 const civilEnding=document.createElement('button');
 civilEnding.id='debugCivilEnding';civilEnding.type='button';
 civilEnding.textContent='CIVIL DISOBEDIENCE / ENDING CUTSCENE';
 button('debugRestore3').insertAdjacentElement('afterend',civilEnding);
 civilEnding.onclick=()=>{
  if(!seed(3,'resistance'))return;
  enter('CIVIL DISOBEDIENCE / ENDING CUTSCENE',()=>{
   startParliamentCamp();startKevinReveal();
  });
 };
 button('debugRestoreSiege').onclick=()=>{
  if(!seed(5,'resistance',{helped:false,emmaSaved:false}))return;
  closeChapterPicker();startSecretaryOpening();
 };
 button('debugRestoreJosiah').onclick=()=>{
  if(!seed(5,'resistance',{helped:true,emmaSaved:false}))return;
  enter('THE SECRETARY IS DEAD',()=>{
   startFinalWar(true);
   player.copy(finalWar.josiah.position).add(new THREE.Vector3(-4,0,4));
   startAtriumJosiahEncounter();
  });
 };
 button('debugStopJosiahReset').onclick=()=>{
  if(!seed(5,'resistance',{helped:true,emmaSaved:false}))return;
  enter('THE SECRETARY IS DEAD',()=>{
   startFinalWar(true);
   player.copy(finalWar.josiah.position).add(new THREE.Vector3(-4,0,4));
   startAtriumJosiahEncounter();
   beginAtriumJosiahFight();
   startJosiahDeath();
   startJosiahLastDefiance();
   stopJosiahFinalVoice();
   beginJosiahUniverseQTE();
   button('debugRestoreResult').textContent='Playtest: press SPACE 10 times in 10 seconds to stop Josiah’s reset';
  });
 };
 button('debugSpaceBoss').onclick=()=>{
  if(!seed(5,'resistance',{helped:true,emmaSaved:false}))return;
  enter('THE LAST REFUSAL / LANIAKEA',()=>{
   startFinalWar(true);
   finalWar.josiahEncounter={phase:'universeLost',oldFog:scene.fog,preResetSave:{...gameProgress}};
   gameProgress={};
   try{localStorage.removeItem(SAVE_KEY);saveAvailable=true;}catch(e){saveAvailable=false;}
   startSpaceBoss();
   button('debugRestoreResult').textContent='Playtest: Laniakea boss fight';
  });
 };
 const solarKevin=document.createElement('button');
 solarKevin.id='debugSolarKevin';solarKevin.type='button';
 solarKevin.textContent='SOL / FIGHT KEVIN';
 button('debugSpaceBoss').insertAdjacentElement('afterend',solarKevin);
 solarKevin.onclick=()=>{
  if(mode!=='menu')return;
  enter('SOL / FIGHT KEVIN',()=>{
   gameProgress={kevinSolarAftermath:true};
   saveProgress();selectedSubject=6;menu();
   startKevinSolarBoss();
   button('debugRestoreResult').textContent='Playtest: Sol / fight Kevin';
  });
 };
 const solarAfterKevin=document.createElement('button');
 solarAfterKevin.id='debugSolarAfterKevin';solarAfterKevin.type='button';
 solarAfterKevin.textContent='SOL / AFTER KEVIN BOSS FIGHT';
 solarKevin.insertAdjacentElement('afterend',solarAfterKevin);
 solarAfterKevin.onclick=()=>{
  if(mode!=='menu')return;
  enter('SOL / AFTER KEVIN',()=>{
   gameProgress={kevinSolarAftermath:true,kevinSolarCompleted:true,solarJosiahSurvived:true};
   saveProgress();selectedSubject=0;menu();selectSubject(0);refreshProgressUI();
   button('debugRestoreResult').textContent='Playtest: Sol / after Kevin boss fight';
  });
 };
 button('debugRestoreKevin').onclick=()=>{
  if(!seed(5,'resistance',{helped:true,emmaSaved:true}))return;
  enter('THE PRIME SECRETARY',()=>{startFinalWar(true);finishPrimeSecretaryPreview();});
 };
 const primeBeam=document.createElement('button');
 primeBeam.id='debugPrimeBeamStruggle';primeBeam.type='button';
 primeBeam.textContent='THE PRIME SECRETARY / BEAM STRUGGLE';
 button('debugRestoreKevin').insertAdjacentElement('afterend',primeBeam);
 primeBeam.onclick=()=>{
  if(!seed(5,'resistance',{helped:true,emmaSaved:true}))return;
  enter('THE PRIME SECRETARY / BEAM STRUGGLE',()=>{
   startFinalWar(true);
   finishPrimeSecretaryPreview();
   skipPrimeReunion();
   startKevinChainStruggle();
   button('debugRestoreResult').textContent='Playtest: The Prime Secretary / Kevin vs Josiah beam struggle';
  });
 };
 button('debugRestoreSiegePeter').onclick=()=>{
  if(!seed(5,'resistance',{helped:false,emmaSaved:false}))return;
  enter('SIEGE OF BRENT CROSS',()=>{
   startFinalWar(true);const w=finalWar;
   w.kevin.hp=0;w.kevin.actor.visible=false;if(w.kevin.spectre)w.kevin.spectre.visible=false;
   w.josiahEncounter={phase:'defeated'};w.josiah.visible=false;
   updateSiegeObjectives();startSiegePeterEncounter();beginSiegePeterFight();
  });
 };
 button('debugRestoreDoor100').onclick=()=>{
  if(!seed(4,'resistance'))return;
  const helped=button('debugJones').checked;
  Object.assign(gameProgress,{corneredRatStarted:true,corneredRatIntroViewed:true,josiahWrathful:true,mariahFreed:helped,garethJonesDeceased:!helped,mariahNeverSeenAgain:!helped});
  saveProgress();
  enter('A CORNERED RAT',()=>{
   startCorneredRooms();const c=corneredRooms;
   c.quest.stage=helped?'key':'lost';c.quest.freed=helped;c.file.visible=c.cell.visible=false;
   if(helped){c.companions.push({name:'MARIAH',actor:c.mariah,lag:5});startPeterFinale();}
   else{loadCorneredRoom(99);player.set(0,0,c.layouts[99].center+c.layouts[99].depth/2-3);c.jones.visible=c.mariah.visible=false;updateHundredRoomStory(0);}
   camera.position.copy(player).add(new THREE.Vector3(0,1.7,0));camera.rotation.set(pitch,yaw,0);
   button('debugRestoreResult').textContent='Playtest: Cornered Rat / Door 100';
  });
 };
 button('debugTubeEnding').onclick=()=>{
  if(!seed(3,'tyrant'))return;
  enter('TUBE · EDGWARE TO EMBANKMENT',()=>{
   startTubeMission();tubeMission.elapsed=TUBE_ARRIVALS[17];updateTubeHUD();startTubeBetrayal();
   button('debugRestoreResult').textContent='Playtest: Tube / Embankment ending cutscene';
  });
 };
 function garethBoss(ending){
  if(!seed(4,'tyrant'))return;
  enter('THE FOOL AND THE TRAITOR',()=>{
   startTyrantFour('pursuit');tyrantFour.jonesCleared=true;loadCorneredRoom(99);startTyrantGarethBoss();
   if(ending){tyrantFour.runner.hp=0;startWilliamsEnding();}
   button('debugRestoreResult').textContent='Playtest: Gareth '+(ending?'ending cutscene':'boss / Door 100');
  });
 }
 button('debugTyrantGarethBoss').onclick=()=>garethBoss(false);
 button('debugTyrantGarethEnding').onclick=()=>garethBoss(true);
 function defense(stage,label){
  if(!seed(5,'tyrant'))return;
  enter('THE DEFENSE OF BRENT CROSS',()=>{
   startDefense(stage===null);if(stage===null)return;
   const w=finalWar;w.paused=false;w.ended=false;w.holding=false;w.hp=150;w.ammo=24;
   keys.clear();currentFloor=0;w.onStairs=false;world.visible=true;upperWorld.visible=false;
   for(const u of w.units){
    if((stage==='last'&&u.faction==='blue'&&u!==w.mariah)||(stage==='power'&&u!==w.alliedJosiah)){
     u.hp=0;u.actor.visible=false;if(u.spectre)u.spectre.visible=false;
    }
    u.target=null;u.decision=0;u.path=[];u.repath=0;
    if(u.cast){disposeCampObject(u.cast.warning);u.cast=null;}
   }
   if(stage==='power'){
    w.mariahChoice='usurper';gameProgress.defenseUsurperChosen=true;updateUsurperRoute();
    player.copy(finalWarNearest(40,39,0));w.alliedJosiah.hp=w.alliedJosiah.maxHP;
    w.usurperQuoteAt=w.time;w.gun.visible=true;button('finalWarHUD').hidden=false;
    w.transitionUntil=performance.now()+1500;w.cinematicPointerRelease=true;
   }else{
    w.mariahChoice=null;w.lastMariahOffer=false;
    player.copy(w.mariah.actor.position).add(new THREE.Vector3(0,0,2));
   }
   yaw=stage==='power'?Math.atan2(player.x-w.josiah.position.x,player.z-w.josiah.position.z):0;
   pitch=0;camera.rotation.order='YXZ';camera.position.copy(player).add(new THREE.Vector3(0,1.7,0));camera.rotation.set(pitch,yaw,0);
   if(label==='TYRANT / SEIZE POWER / JOSIAH FIGHT'){
    for(const key of ['defenseLoyalEnding','defenseResistanceEnding','newPrimeSecretaryEnding','defenseBattleCleared'])delete gameProgress[key];
    gameProgress.defenseJoinedResistance=false;
   }
   saveProgress();updateDefenseBattle();drawFinalWarMap();if(stage!=='power')beginMariahOffer();
   button('debugRestoreResult').textContent='Playtest: '+label;
  });
 }
 button('debugMariahChoice').onclick=()=>defense('choice','DEFENSE / MARIAH’S CHOICE');
 button('debugMariahLast').onclick=()=>defense('last','DEFENSE / MARIAH ALONE');
 button('debugClaimPower').onclick=()=>defense('power','DEFENSE / CLAIM POWER');
 button('debugDefenseJosiah').onclick=()=>defense('power','TYRANT / SEIZE POWER / JOSIAH FIGHT');
 function seedKevinPlaytest(winner){
  gameProgress={brentCrossCompleted:true,cabinetUnlocked:true,cabinetCompleted:true,cabinetBriefingViewed:true,garethQuestCompleted:false,a5EscapeCompleted:true,stephenFallWitnessed:true,stephenFellOnMotorway:true,kevinRouteStarted:true,tubeCompleted:true,kevinTubeClashWinner:winner,debugCompletion:true};
 }
 function bottomShortcut(id,label,run){
  const shortcut=document.createElement('button');
  shortcut.id=id;shortcut.type='button';shortcut.textContent=label;
  button('debugRestorePanel').insertBefore(shortcut,button('debugRestoreResult'));
  shortcut.onclick=()=>{if(mode==='menu')enter(label,run);};
 }
 bottomShortcut('debugFinalCurtainGareth','THE FINAL CURTAIN CALL / SKIP TO GARETH',()=>{
  seedKevinPlaytest('alissa');
  Object.assign(gameProgress,{bustersIntroViewed:true,pindarCompleted:true,finalCurtainIntroViewed:true});
  saveProgress();refreshProgressUI();startFinalCurtainBattle();
  const b=finalCurtainBattle,g=b.units.find(e=>e.id==='gareth');
  for(const id of ['david','mariah'])curtainBattleDamage(b.units.find(e=>e.id===id),Infinity);
  // Find a clear arena lane so the shortcut never spawns inside scenery or troops.
  let spawn;
  for(const radius of [14,18,22]){
   for(let angle=0;angle<Math.PI*2;angle+=Math.PI/8){
    const point=g.actor.position.clone().add(new THREE.Vector3(Math.sin(angle)*radius,0,Math.cos(angle)*radius));
    if(point.z>=610&&curtainBattleWalkable(point.x,point.z)&&!curtainBattleBlockSegment(point,g.actor.position)&&!b.units.some(e=>e.hp>0&&point.distanceTo(e.actor.position)<2)){spawn=point;break;}
   }
   if(spawn)break;
  }
  player.copy(spawn||new THREE.Vector3(0,0,620));
  yaw=Math.atan2(player.x-g.actor.position.x,player.z-g.actor.position.z);pitch=0;
  camera.position.copy(player).add(new THREE.Vector3(0,1.7,0));camera.rotation.set(pitch,yaw,0);
  updateCurtainGarethAccess();updateCurtainBattleHUD();drawCurtainBattleMap();
  button('debugRestoreResult').textContent='Playtest: The Final Curtain Call / Gareth boss fight';
 });
 bottomShortcut('debugUxbridgeDoor100','THE FOOL OF UXBRIDGE / SKIP TO DOOR 100',()=>{
  seedKevinPlaytest('josiah');
  Object.assign(gameProgress,{uxbridgeChaseCompleted:true,uxbridgeGarethStopped:true});
  saveProgress();refreshProgressUI();startRedRoomJourney();
  const p=redRooms;
  for(let i=0;i<99;i++)p.opened.add(i);
  loadRedRooms(99);
  const previous=p.rooms.get(98);previous.door.open=previous.door.target=1;previous.pivot.rotation.y=-Math.PI*.54;
  player.set(0,0,p.plans[99].center);finishRedRoomArrival();
  updateRedRoomFirstPerson();renderRedRooms(0);
  button('debugRestoreResult').textContent='Playtest: The Fool of Uxbridge / Door 100';
 });
 bottomShortcut('debugKevinSiegeJosiah','KEVIN - SIEGE OF BRENT CROSS',()=>{
  seedKevinPlaytest('josiah');
  Object.assign(gameProgress,{uxbridgeCompleted:true,uxbridgeEndingViewed:true,uxbridgeMariahDefeated:true,uxbridgeJonesDefeated:true});
  saveProgress();refreshProgressUI();startFinalWar(true,false,true);
  const w=finalWar;
  currentFloor=0;w.onStairs=false;w.stairCooldown=1;w.kevinAtriumEntered=true;
  player.copy(finalWarNearest(37,37,0));
  world.visible=true;upperWorld.visible=false;w.seals.visible=true;
  yaw=Math.atan2(player.x-w.josiah.position.x,player.z-w.josiah.position.z);pitch=0;
  startAtriumJosiahEncounter();
  renderFinalWar(0);updateKevinSiegeObjectives();drawFinalWarMap();
  button('debugRestoreResult').textContent='Playtest: KEVIN - SIEGE OF BRENT CROSS / Josiah atrium fight';
 });
})();
