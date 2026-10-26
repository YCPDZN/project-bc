const FACTION_ROSTERS={
 psrm:[
  [0,'JOSIAH RICHARDS','CHAPTERS 1–5'],
  [1,'PETER CHAMBERS','CHAPTERS 1–4'],
  [5,'ELIZABETH STERLING','CHAPTERS 1–5'],
  [3,'GARETH WILLIAMS','RESISTANCE: CHAPTER 1 · TYRANT: CHAPTERS 1–3'],
  [4,'STEPHEN MARSH','CHAPTER 1'],
  [10,'CHRIS PINTER','CHAPTER 1'],
  [7,'GARETH JONES','CHAPTER 1']
 ],
 resistance:[
  [9,'MARIAH BANU','GOVERNMENT IN EXILE'],
  [3,'GARETH WILLIAMS','RESISTANCE: CHAPTERS 2–5 · TYRANT: CHAPTERS 4–5'],
  [2,'ALISSA ROBERTS','CHAPTERS 2–5 · BOTH ROUTES'],
  [7,'GARETH JONES','CHAPTERS 1–5'],
  [11,'DAMIAN JUKO','CHAPTERS 1–5'],
  [4,'STEPHEN MARSH','CHAPTERS 2–5'],
  [10,'CHRIS PINTER','CHAPTERS 2–5']
 ],
 kevin:[
  [6,'KEVIN MURDERHORN','LEADER'],
  [1,'PETER CHAMBERS','CHAPTERS 4–5 · BOTH ROUTES'],
  [2,'ALISSA ROBERTS','CHAPTER 1 · BOTH ROUTES']
 ]
};
function characterFactionSummary(id){if(Number(id)===12)return 'FACTION: CYAN PARTY';
 const faction=currentFactionForCharacter(id);
 const names={police:'POLICE',psrm:"PRIME SECRETARY'S RIVETELLIA MILITIA (PSRM)",resistance:'RESISTANCE',kevin:kevinIdentityRevealed()?"KEVIN MURDERHORN'S FACTION":'???'};
 return 'FACTION: '+(names[faction]||'UNASSIGNED');
}
function currentStoryChapter(){
 if(isKevinStoryRoute()&&canOpenKevinSiege())return 5;if(isKevinStoryRoute())return gameProgress.kevinTubeClashWinner==='alissa'?(gameProgress.pindarCompleted===true?5:4):(gameProgress.uxbridgeStarted===true?4:3);
 if(gameProgress.corneredRatRoomsCompleted>=100||gameProgress.tyrantFourCompleted===true)return 5;
 if(gameProgress.civilDisobedienceSurvived===true||gameProgress.tubeCompleted===true)return 4;
 if(gameProgress.cabinetCompleted===true)return 3;
 if(gameProgress.brentCrossCompleted===true)return 2;
 return 1;
}
function currentFactionForCharacter(id){
 const chapter=currentStoryChapter(),resistanceRoute=gameProgress.garethQuestCompleted===true;
 if(gameProgress.kevinRouteStarted===true&&gameProgress.universalRestorationCompleted!==true){if(Number(id)===1)return canOpenKevinSiege()&&gameProgress.kevinSiegeStarted===true?'kevin':'psrm';if(Number(id)===10&&canOpenKevinSiege()&&gameProgress.kevinSiegeStarted===true)return 'police';if(Number(id)===3)return kevinTubeAlissaDefeated()?'resistance':'psrm';}
 switch(Number(id)){
  case 0:case 5:return 'psrm';
  case 1:return chapter>=4?'kevin':'psrm';
  case 3:return chapter===1||(!resistanceRoute&&chapter<=3)?'psrm':'resistance';
  case 4:case 10:return chapter===1?'psrm':'resistance';
  case 7:return chapter===1?'psrm':'resistance';
  case 2:return chapter===1?'kevin':'resistance';
  case 6:return 'kevin';
  case 9:case 11:return 'resistance';
  default:return 'unassigned';
 }
}
function renderFactionRoster(key,revealed){
 const list=$('factionRoster'+key[0].toUpperCase()+key.slice(1));list.replaceChildren();
 if(key==='kevin'&&!revealed){const item=document.createElement('li');item.textContent='???';list.append(item);return;}
 for(const [id,name] of FACTION_ROSTERS[key]){
  if(currentFactionForCharacter(id)!==key)continue;
  const item=document.createElement('li');item.textContent=name;list.append(item);
 }
}
function openFactions(){
 if(mode!=='menu'||gameProgress.laniakeaAftermath===true||gameProgress.kevinSolarAftermath===true)return;
 const revealed=kevinIdentityRevealed();
 $('factionKevinName').textContent=revealed?"KEVIN MURDERHORN'S FACTION":"???";
 $('factionKevinOrigin').textContent=revealed?'CAMDEN / LONDON':'ORIGIN UNKNOWN';
 $('factionKevinText').textContent=revealed
  ?'From Camden, Kevin Murderhorn commands masked fighters who favour blades, speed and ambushes. They answer to him rather than the PSRM or the Resistance, and strike across the city as his plans unfold.'
  :'Masked fighters have appeared in London. Their leader, base and purpose remain unknown.';
 for(const key of ['kevin','psrm','resistance'])renderFactionRoster(key,revealed);
 $('factionsPanel').hidden=false;$('menu').inert=true;$('closeFactions').focus();
}
function closeFactions(){
 if($('factionsPanel').hidden)return;
 $('factionsPanel').hidden=true;$('menu').inert=false;
 if(mode==='menu')$('openFactions').focus();
}
$('openFactions').onclick=openFactions;
$('closeFactions').onclick=closeFactions;
$('factionsPanel').addEventListener('click',event=>{if(event.target===$('factionsPanel'))closeFactions();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('factionsPanel').hidden){event.preventDefault();closeFactions();}});
if(mode==='menu')selectSubject(selectedSubject);
