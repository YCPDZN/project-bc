/* Character prequels use their own menu and never update campaign progression. */
let beforeStoryScene=null;
const BEFORE_STORY_SAVE_KEY='project-bc-before-story-v1';
let beforeStoryProgress=(()=>{try{const saved=JSON.parse(localStorage.getItem(BEFORE_STORY_SAVE_KEY));return {romeCompleted:saved?.romeCompleted===true,jukoCompleted:saved?.jukoCompleted===true,lastJukoCompleted:saved?.lastJukoCompleted===true};}catch(e){return {romeCompleted:false,jukoCompleted:false,lastJukoCompleted:false};}})();
function saveBeforeStoryProgress(){try{localStorage.setItem(BEFORE_STORY_SAVE_KEY,JSON.stringify(beforeStoryProgress));}catch(e){}}
function refreshBeforeStoryChapters(){
 const unlocked=beforeStoryProgress.romeCompleted===true;document.getElementById('beforeStoryRome').innerHTML=(unlocked?'REPLAY CHAPTER 1':'BEGIN CHAPTER 1')+' <span>→</span>';
 const chapter3=document.getElementById('beforeStoryLastJuko');if(chapter3){chapter3.disabled=!beforeStoryProgress.jukoCompleted;chapter3.textContent=beforeStoryProgress.jukoCompleted?(beforeStoryProgress.lastJukoCompleted?'REPLAY CHAPTER 3 →':'BEGIN CHAPTER 3 →'):'LOCKED · COMPLETE CHAPTER 2';}const button=document.getElementById('beforeStoryJuko');button.disabled=!unlocked;button.textContent=unlocked?(beforeStoryProgress.jukoCompleted?'REPLAY CHAPTER 2 →':'BEGIN CHAPTER 2 →'):'LOCKED · COMPLETE ROME';document.getElementById('beforeStoryRomeStatus').textContent=unlocked?'COMPLETED · CUTSCENE':'CUTSCENE';
}
const beforeStoryRomeVoices=['assets/ROME1.mp3','assets/ROME2.mp3','assets/ROME3.mp3','assets/ROME4.mp3'].map(src=>{const clip=new Audio(src);clip.preload='auto';clip.volume=.9;AudioOptions.category(clip,'voice');return clip;});
const beforeStoryJukoVoices=["assets/JUKOZ1.mp3","assets/JUKOZ2.mp3","assets/JUKOZ3.mp3","assets/JUKOZ4.mp3","assets/JUKOZ5.mp3","assets/JUKOZ6.mp3","assets/JUKOZ7.mp3","assets/JUKOZ8.mp3","assets/JUKOZ9.mp3","assets/JUKOZ10.mp3","assets/JUKOZ11.mp3","assets/JUKOZ12.mp3","assets/JUKOZ13.mp3","assets/JUKOZ14.mp3","assets/JUKOZ15.mp3"].map(src=>{const clip=new Audio(src);clip.preload='metadata';clip.volume=.9;AudioOptions.category(clip,'voice');return clip;});
// Measured 20 ms amplitude frames stay synchronized with media.currentTime, including local files.
const BEFORE_STORY_ROME_VOICE_ENVELOPES=[{"step":0.02,"duration":4.2840625,"levels":[0,0,0,0,0.037,0.144,0.727,0.8,0.8,0.8,0.8,0.8,0.535,0.683,0.7,0.717,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.757,0.688,0.712,0.8,0.8,0.8,0.482,0.11,0,0.061,0.428,0.8,0.595,0.156,0.8,0.8,0.8,0.746,0.325,0.134,0.01,0.181,0.473,0.591,0.583,0.296,0.24,0.157,0.111,0.008,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.012,0.462,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.219,0.305,0.393,0,0,0.153,0.8,0.586,0.8,0.8,0.8,0.8,0.8,0.774,0.661,0.285,0.197,0.192,0.182,0.138,0.125,0.166,0.114,0.116,0.349,0.416,0.42,0.33,0.295,0.178,0.001,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.061,0,0,0.363,0.8,0.8,0.8,0.609,0,0.31,0.527,0.8,0.8,0.49,0.178,0.19,0.128,0.134,0.133,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.768,0.368,0.29,0.273,0.417,0.546,0.703,0.535,0.476,0.392,0.217,0.16,0.103,0.059,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"step":0.02,"duration":3.8661041666666667,"levels":[0,0,0,0,0,0.032,0.412,0.8,0.8,0.8,0.8,0.795,0.717,0.376,0.063,0.024,0.015,0.017,0.8,0.8,0.8,0.8,0.8,0.8,0.699,0.346,0.14,0.078,0,0,0.006,0.45,0.8,0.8,0.742,0.8,0.8,0.8,0.8,0.8,0.8,0.548,0.405,0.106,0,0,0,0,0,0,0,0,0,0.012,0.003,0.014,0,0,0,0,0,0,0,0,0,0,0.102,0.187,0.231,0.211,0.403,0.8,0.8,0.8,0.8,0.8,0.8,0.61,0.694,0.8,0.8,0.8,0.768,0.521,0.554,0.505,0.49,0.539,0.412,0.146,0.192,0.276,0.465,0.678,0.8,0.8,0.8,0.8,0.734,0.51,0.358,0.236,0.191,0.022,0,0,0,0.017,0.044,0.037,0.117,0.137,0.21,0.203,0.253,0.044,0,0.102,0.8,0.8,0.8,0.667,0.414,0.473,0.766,0.614,0.037,0.007,0.085,0.011,0.8,0.8,0.8,0.035,0,0,0,0.017,0.033,0.484,0.8,0.8,0.8,0.8,0.8,0.8,0.666,0.197,0.129,0.084,0,0,0.052,0.019,0.8,0.574,0.186,0.03,0.522,0.8,0.8,0.406,0.235,0.093,0.158,0.8,0.8,0.8,0.8,0.8,0.8,0.617,0.442,0.185,0.102,0.109,0.116,0.112,0.069,0.063,0.044,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"step":0.02,"duration":4.911,"levels":[0,0,0,0,0,0,0,0,0.713,0.8,0.688,0.794,0.625,0.445,0.447,0.429,0.405,0.404,0.455,0.6,0.417,0.8,0.8,0.742,0.001,0.439,0.498,0.175,0.8,0.8,0.8,0.776,0.481,0.246,0.178,0.167,0.178,0.165,0.15,0.128,0.121,0.12,0.109,0.116,0.114,0.135,0.209,0.657,0.8,0.8,0.8,0.8,0.8,0.8,0.791,0.8,0.8,0.8,0.722,0.306,0.144,0.187,0.259,0.125,0.102,0.178,0.8,0.8,0.649,0.506,0.601,0.581,0.549,0.586,0.15,0,0.403,0.371,0.278,0.346,0.334,0.283,0.22,0.165,0.17,0.159,0.095,0.04,0.011,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.8,0.8,0.8,0.8,0.8,0.369,0.308,0.284,0.584,0.544,0.662,0.767,0.8,0.8,0.8,0.679,0.306,0.8,0.8,0.8,0.609,0.522,0.754,0.8,0.65,0.439,0.365,0,0,0,0,0,0.626,0.133,0.091,0.8,0.8,0.8,0.298,0.044,0.116,0.152,0.8,0.8,0.8,0.8,0.5,0.379,0.535,0.8,0.8,0.8,0.8,0.708,0.571,0.71,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.359,0.515,0.8,0.8,0.498,0.567,0.361,0.335,0.085,0,0.265,0.381,0.43,0.343,0.342,0.226,0.247,0.19,0.203,0.235,0.403,0.136,0.08,0.206,0.179,0.139,0.153,0.1,0.226,0.307,0.396,0.301,0.26,0.228,0.143,0.052,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"step":0.02,"duration":4.519166666666667,"levels":[0,0,0,0,0.156,0.346,0.8,0.8,0.8,0.592,0.556,0.58,0.708,0.8,0.8,0.8,0.8,0.8,0.337,0.035,0.088,0.114,0.121,0.8,0.8,0.473,0.207,0.098,0,0,0,0,0,0.046,0.516,0.8,0.8,0.8,0.8,0.345,0.047,0,0,0,0.8,0.8,0.8,0.8,0.8,0.8,0.613,0.251,0.213,0.168,0.188,0.192,0.8,0.8,0.8,0.499,0.338,0.248,0.381,0.135,0,0,0,0.542,0.8,0.8,0.683,0.521,0.571,0.645,0.759,0.516,0.254,0.201,0.173,0.322,0.588,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.454,0.057,0.088,0.072,0.042,0,0.209,0.8,0.8,0.8,0.69,0.658,0.576,0.617,0.628,0.8,0.8,0.8,0.5,0.407,0.4,0.298,0.197,0.106,0.192,0.49,0.401,0.471,0.443,0.367,0.384,0.228,0.098,0.026,0.013,0.006,0.011,0.005,0.011,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.011,0.086,0.138,0.164,0.179,0.201,0.465,0.8,0.8,0.611,0.364,0.23,0.225,0.051,0,0,0,0.454,0.8,0.8,0.603,0.601,0.63,0.682,0.461,0.164,0.072,0,0,0,0,0,0,0.067,0.133,0.8,0.8,0.8,0.8,0.789,0.675,0.268,0.25,0.238,0.082,0.016,0.07,0.081,0.057,0.037,0.015,0.014,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}];
const beforeStoryEntry=document.createElement('button');beforeStoryEntry.id='openBeforeStory';beforeStoryEntry.type='button';beforeStoryEntry.textContent='CHARACTER SPECIFIC CHAPTERS';beforeStoryEntry.setAttribute('aria-controls','beforeStoryUI');
document.getElementById('openUndead').after(beforeStoryEntry);
const beforeStoryUI=document.createElement('section');beforeStoryUI.id='beforeStoryUI';beforeStoryUI.hidden=true;beforeStoryUI.setAttribute('aria-label','Before the Story');
beforeStoryUI.innerHTML=`<header class="before-story-top"><span>PROJECT BC / CHARACTER SPECIFIC CHAPTERS</span><button id="beforeStoryExit" type="button">← PROJECT BC</button></header><main class="before-story-layout"><div class="before-story-copy"><small>THE STORIES BEFORE BRENT CROSS</small><h1>BEFORE<br><em>THE STORY</em></h1><p>Playable chapters and cinematic stories before Project BC.</p><button id="beforeStoryJosiah" type="button" aria-expanded="false" aria-controls="beforeStoryChapters"><b>01</b><span><small>CHARACTER STORY</small><strong>JOSIAH RICHARDS</strong></span><i>↗</i></button><section id="beforeStoryChapters" hidden aria-labelledby="beforeStoryChapterTitle"><small>JOSIAH RICHARDS</small><h2 id="beforeStoryChapterTitle">CHAPTER 1: ROME</h2><small id="beforeStoryRomeStatus">CUTSCENE</small><p>Italy · 2000<br>Josiah Richards meets Gareth Jones, long before Brent Cross.</p><button id="beforeStoryRome" type="button">BEGIN CHAPTER 1 <span>→</span></button><article class="before-story-next-chapter"><small>CHAPTER 2 / 2004</small><h2>THE JUKO ZAIBATSU</h2><p>A Foreign Office investigation.<br>Narrated by Josiah Richards.</p><button id="beforeStoryJuko" type="button" disabled>LOCKED · COMPLETE ROME</button></article><article class="before-story-next-chapter"><small>CHAPTER 3 / 2010</small><h2>THE LAST JUKO</h2><p>Boki Juko and the power within Osaka Castle.<br>Narrated by Josiah Richards.</p><button id="beforeStoryLastJuko" type="button" disabled>LOCKED · COMPLETE CHAPTER 2</button></article><button id="beforeStoryChapterBack" type="button">← BACK</button></section><div class="before-story-note">BEFORE THE EVENTS OF PROJECT BC</div></div><aside class="before-story-profile"><small id="beforeStoryCode">BC-01 / YEAR 2000</small><h2 id="beforeStoryName">JOSIAH RICHARDS</h2><span id="beforeStoryAlignment">ALIGNMENT: NEUTRAL GOOD</span><p id="beforeStoryProfileText">A younger Josiah, before Project BC.</p><div class="before-story-cast"><button type="button" data-before-cast="josiah" aria-pressed="true">BC-01 · JOSIAH</button><button type="button" data-before-cast="jones" aria-pressed="false">BC-02 · GARETH JONES</button><button type="button" data-before-cast="kenji" aria-pressed="false">BC-03 · KENJI TANAKA</button><button type="button" data-before-cast="boki" aria-pressed="false">BC-04 · BOKI JUKO</button></div></aside></main>`;
document.body.appendChild(beforeStoryUI);
const beforeStoryCinema=document.createElement('section');beforeStoryCinema.id='beforeStoryCinema';beforeStoryCinema.hidden=true;
beforeStoryCinema.innerHTML='<header><small id="beforeStoryCinemaChapter">BEFORE THE STORY / CHAPTER 1</small><h2 id="beforeStoryCinemaTitle">ROME <span>2000</span></h2><button id="beforeStoryReturn" type="button">← BEFORE THE STORY</button></header><div class="before-story-dialogue"><small id="beforeStorySpeaker"></small><p id="beforeStoryLine"></p><div><span id="beforeStoryCount"></span><button id="beforeStoryNext" type="button">CONTINUE →</button></div></div>';
document.body.appendChild(beforeStoryCinema);
function canEnterBeforeStory(){return gameProgress.laniakeaAftermath!==true&&gameProgress.kevinSolarAftermath!==true;}
function refreshBeforeStoryEntry(){refreshBeforeStoryChapters();beforeStoryEntry.hidden=!canEnterBeforeStory();beforeStoryEntry.disabled=!canEnterBeforeStory();}
const refreshBeforeStoryPrevious=refreshLaniakeaAftermathMenu;
refreshLaniakeaAftermathMenu=function(){refreshBeforeStoryPrevious();refreshBeforeStoryEntry();};
const refreshBeforeStoryProgressPrevious=refreshProgressUI;
refreshProgressUI=function(){refreshBeforeStoryProgressPrevious();refreshBeforeStoryEntry();};
function clearBeforeStoryMenu(){
 if(!beforeStoryScene)return;clearBeforeStoryOsaka();clearBeforeStoryKenji();stopBeforeStoryVoice();const c=beforeStoryScene;disposeCampObject(c.root);scene.background.copy(c.background);scene.fog.color.copy(c.fogColor);scene.fog.density=c.fogDensity;ambient.intensity=c.ambient;cameraFill.intensity=c.fill;beforeStoryScene=null;beforeStoryUI.hidden=true;beforeStoryCinema.hidden=true;camera.up.set(0,1,0);
}
function enterBeforeStory(){
 if(mode!=='menu'||!canEnterBeforeStory())return;
 loadChapterScreen('BEFORE THE STORY',()=>{
  menu();setMode('beforeStoryMenu');hideUndeadCampaignCast();world.visible=upperWorld.visible=false;flash.visible=false;
  const root=new THREE.Group();root.position.x=2600;scene.add(root);
  beforeStoryScene={root,time:0,background:scene.background.clone(),fogColor:scene.fog.color.clone(),fogDensity:scene.fog.density,ambient:ambient.intensity,fill:cameraFill.intensity};
  scene.background.setHex(0x10070c);scene.fog.color.setHex(0x190911);scene.fog.density=.035;ambient.intensity=1.15;cameraFill.intensity=.5;
  const stone=mat(0x231820),edge=mat(0x57343f);box(root,20,.25,14,stone,0,-.2,0);box(root,20,7,.3,mat(0x210c16),0,3,-4);
  for(let x=-9;x<=9;x+=2.5){box(root,.045,6,.08,edge,x,3,-3.75);box(root,.055,.05,6,edge,x,.01,0);}
  mesh(new THREE.CylinderGeometry(1.5,1.7,.2,48),mat(0x31202a),root,0,-.08,0);
  const keyLight=new THREE.PointLight(0xffd6c0,26,15);keyLight.position.set(-2,3,3);root.add(keyLight);const rim=new THREE.PointLight(0xd22c48,24,13);rim.position.set(2,3,-2);root.add(rim);
  const actor=makeBeforeStoryJosiah(),jones=makeBeforeStoryJones();root.add(actor,jones);jones.visible=false;beforeStoryScene.actor=actor;const kenji=makeBeforeStoryKenji(),boki=makeBeforeStoryBoki();kenji.visible=boki.visible=false;root.add(kenji,boki);beforeStoryScene.cast={josiah:actor,jones,kenji,boki};beforeStoryScene.speechMouths=Object.entries(beforeStoryScene.cast).map(([id,a])=>makeBeforeStorySpeechMouth(id,a));beforeStoryScene.menuSet=new THREE.Group();for(const o of [...root.children])if(o!==actor&&o!==jones&&o!==kenji&&o!==boki)beforeStoryScene.menuSet.add(o);root.add(beforeStoryScene.menuSet);selectBeforeStoryCast('josiah');
  beforeStoryUI.hidden=false;document.getElementById('beforeStoryChapters').hidden=true;document.getElementById('beforeStoryJosiah').setAttribute('aria-expanded','false');renderBeforeStoryMenu(0);syncMenuSong();
 });
}
function renderBeforeStoryMenu(dt){
 const c=beforeStoryScene;if(!c)return;c.time+=dt;c.actor.rotation.y=.12+Math.sin(c.time*.23)*.2;animateCharacter(c.time,false,false,c.actor);
 camera.position.copy(c.root.position).add(new THREE.Vector3(.1,1.8,4.5));camera.up.set(0,1,0);camera.lookAt(c.root.position.clone().add(new THREE.Vector3(-1.45,1.4,0)));camera.updateMatrixWorld(true);
}
function toggleBeforeStoryChapters(open){document.getElementById('beforeStoryChapters').hidden=!open;document.getElementById('beforeStoryJosiah').setAttribute('aria-expanded',String(open));if(open)document.getElementById('beforeStoryChapterBack').focus();else document.getElementById('beforeStoryJosiah').focus();}
beforeStoryEntry.onclick=enterBeforeStory;
document.getElementById('beforeStoryJosiah').onclick=()=>toggleBeforeStoryChapters(document.getElementById('beforeStoryChapters').hidden);
document.getElementById('beforeStoryChapterBack').onclick=()=>toggleBeforeStoryChapters(false);
document.getElementById('beforeStoryExit').onclick=()=>{menu();refreshProgressUI();document.getElementById('openBeforeStory').focus();};
document.addEventListener('keydown',e=>{if(!mode.startsWith('beforeStory')||(mode==='beforeStoryPeterTube'||mode==='beforeStoryDG'||mode==='beforeStoryAdministrator'||mode==='beforeStoryRomford'||mode==='beforeStoryHeathIntro'||mode==='beforeStoryHeath'||mode==='beforeStoryKenji'||mode==='beforeStoryOsaka'||mode==='beforeStoryUnion'||mode==='beforeStoryUnionFight'||mode==='beforeStoryUnionEnding'||mode==='beforeStorySuccessor'||mode==='beforeStorySuccessorEnding')||e.repeat)return;if(e.code==='Escape'){e.preventDefault();if(mode==='beforeStoryRome'||mode==='beforeStoryJuko'||mode==='beforeStoryKenjiEnding'||mode==='beforeStoryLastJuko'||mode==='beforeStoryBoki'||mode==='beforeStoryOsakaEnding')returnBeforeStoryRome();else if(!document.getElementById('beforeStoryChapters').hidden)toggleBeforeStoryChapters(false);else document.getElementById('beforeStoryExit').click();}else if((mode==='beforeStoryRome'||mode==='beforeStoryJuko'||mode==='beforeStoryKenjiEnding'||mode==='beforeStoryLastJuko'||mode==='beforeStoryBoki'||mode==='beforeStoryOsakaEnding')&&e.code==='Enter'){e.preventDefault();advanceBeforeStoryRome();}});
refreshBeforeStoryEntry();

/* Each prequel owns its model resources, including copies of shared detail textures. */
function isolateBeforeStoryModel(actor){
 const materials=new Map(),textures=new Map(),geometries=new Map();actor.traverse(o=>{if(o.geometry){if(!geometries.has(o.geometry))geometries.set(o.geometry,o.geometry.clone());o.geometry=geometries.get(o.geometry);}if(o.material){const array=Array.isArray(o.material);const ownMaterials=[].concat(o.material).map(m=>{if(!materials.has(m)){const own=m.clone();for(const k of ['map','bumpMap','normalMap','roughnessMap'])if(own[k]){if(!textures.has(own[k])){const t=own[k].clone();t.needsUpdate=true;textures.set(own[k],t);}own[k]=textures.get(own[k]);}materials.set(m,own);}return materials.get(m);});o.material=array?ownMaterials:ownMaterials[0];}});
 return actor;
}
function makeBeforeStoryJosiah(){
 const actor=isolateBeforeStoryModel(makeGareth(false,true)),donor=isolateBeforeStoryModel(makeCharacter());
 const oldHead=actor.userData.head,{head,mouth,smileCrease}=donor.userData;oldHead.removeFromParent();disposeCampObject(oldHead);
 actor.userData.body.add(head);head.position.y=2.08;Object.assign(actor.userData,{head,mouth,smileCrease,beforeStoryCode:'BC-01',alignment:'Neutral Good',year:2000});disposeCampObject(donor);
 actor.name='Before the Story / Josiah Richards (2000)';return actor;
}
function selectBeforeStoryCast(id){
 const c=beforeStoryScene;if(!c||mode!=='beforeStoryMenu')return;
 if(id==='kevinMasked'&&!c.cast.kevinMasked){const actor=isolateBeforeStoryModel(makeKevinMurderhorn());actor.name='Before the Story / BC-06 / Kevin Murderhorn (masked)';Object.assign(actor.userData,{beforeStoryCode:'BC-06',alignment:'Chaotic Evil'});c.cast.kevinMasked=actor;c.root.add(actor);}
 for(const [key,a] of Object.entries(c.cast)){a.visible=key===id;a.position.set(0,0,0);}c.actor=c.cast[id];
 const profiles={josiah:['BC-01 / YEAR 2000','JOSIAH RICHARDS','ALIGNMENT: NEUTRAL GOOD','A younger Josiah, before Project BC.'],jones:['BC-02 / YEAR 2000','GARETH JONES','ALIGNMENT: LAWFUL GOOD','Gareth Jones in 2000, before the glasses and the civil war.'],kenji:['BC-03 / YEAR 2009','KENJI “THE VIPER” TANAKA','ALIGNMENT: CHAOTIC EVIL','The ruthless enforcer of Bozuki Juko. Encountered in Shibuya.'+(beforeStoryProgress.jukoCompleted?' Status: defeated.':'')],boki:['BC-04 / YEAR 2010','BOKI JUKO','ALIGNMENT: CHAOTIC NEUTRAL','Grieving her two brothers, Takeshi and Bozuki, and searching for her orphaned nephew, Takeshi’s son. She seeks a way out of her sorrow within Osaka Castle.'],kevinMasked:['BC-06 / CHAPTER 5','KEVIN MURDERHORN','ALIGNMENT: CHAOTIC EVIL','Behind his armoured mask, Kevin carries his own history with the Juko family. He joins Josiah against Tajiri Juko in The True Successor.']};const profile=profiles[id];for(const [i,key] of ['beforeStoryCode','beforeStoryName','beforeStoryAlignment','beforeStoryProfileText'].entries())document.getElementById(key).textContent=profile[i];
 document.querySelectorAll('[data-before-cast]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.beforeCast===id)));
}
document.querySelectorAll('[data-before-cast]').forEach(b=>b.onclick=()=>selectBeforeStoryCast(b.dataset.beforeCast));
const BEFORE_STORY_ROME_LINES=[
 ['GARETH JONES','Josiah Richards? Gareth Jones. Good to finally meet you.','jones'],
 ['JOSIAH RICHARDS','Likewise, Gareth. Rome is quite a place to begin.','josiah'],
 ['GARETH JONES','A city full of history. You wonder what people will remember about us.','jones'],
 ['JOSIAH RICHARDS','Then let us give them something worth remembering. Something good.','josiah']
];
function buildBeforeStoryRome(){
 const c=beforeStoryScene,r=new THREE.Group();c.root.add(r);c.romeSet=r;
 const limestone=mat(0xc4b18e),stone=mat(0x9e8c71),terracotta=mat(0xa35f43),cream=mat(0xead6af),water=mat(0x70aab2,.18);
 box(r,90,.4,90,stone,0,-.3,0);for(let z=-15;z<16;z+=2)for(let x=-16;x<17;x+=2)box(r,1.94,.018,1.94,limestone,x,-.085,z);
 // Layered arcades evoke Rome's amphitheatre, with genuine open arches.
 const arc=new THREE.Shape();arc.moveTo(-1.1,0);arc.lineTo(-1.1,2.9);arc.lineTo(1.1,2.9);arc.lineTo(1.1,0);arc.lineTo(.78,0);arc.lineTo(.78,1.35);arc.absarc(0,1.35,.78,0,Math.PI,false);arc.lineTo(-.78,0);arc.lineTo(-1.1,0);
 const archGeo=new THREE.ExtrudeGeometry(arc,{depth:.55,bevelEnabled:false,curveSegments:18});
 for(let level=0;level<3;level++)for(let i=0;i<30;i++){const a=i/30*TAU,arch=mesh(archGeo,limestone,r,Math.sin(a)*24,level*3.3,Math.cos(a)*24-36);arch.rotation.y=a;const col=mesh(new THREE.CylinderGeometry(.19,.23,3.2,12),cream,r,Math.sin(a-.044)*24,level*3.3+1.6,Math.cos(a-.044)*24-36);col.rotation.y=a;}
 for(let level=0;level<4;level++){const band=mesh(new THREE.TorusGeometry(24,.18,8,90),stone,r,0,level*3.3,-36);band.rotation.x=Math.PI/2;}
 for(const side of [-1,1])for(let i=0;i<5;i++){const x=side*(14+i*.8),z=4-i*7;box(r,6,8+i%2*2,5,cream,x,4,z);box(r,6.7,.4,5.7,terracotta,x,8+i%2*2,z);for(let y=1.8;y<7;y+=2)for(let dx of [-1.7,0,1.7]){box(r,.8,1.15,.06,mat(0x39443e),x+dx,y,z+2.53);box(r,1,.1,.16,limestone,x+dx,y-.65,z+2.57);}}
 const fountain=new THREE.Group();fountain.position.set(-4,0,-4);r.add(fountain);mesh(new THREE.CylinderGeometry(2.5,2.7,.35,48),cream,fountain,0,.1,0);mesh(new THREE.CylinderGeometry(2.28,2.28,.06,48),water,fountain,0,.32,0);mesh(new THREE.CylinderGeometry(.3,.6,1.9,24),cream,fountain,0,1.15,0);mesh(new THREE.CylinderGeometry(1.1,.35,.25,40),limestone,fountain,0,2.1,0);
 for(let i=0;i<12;i++){const a=i/12*TAU;line3(fountain,[[Math.cos(a)*.8,2.15,Math.sin(a)*.8],[Math.cos(a)*1.4,1.9,Math.sin(a)*1.4],[Math.cos(a)*1.6,.4,Math.sin(a)*1.6]],water,.018);}
 const sun=new THREE.DirectionalLight(0xffdfaf,3);sun.position.set(5,14,8);r.add(sun);const fill=new THREE.HemisphereLight(0xbadcf2,0x97775b,2);r.add(fill);
}
function startBeforeStoryRome(){
 const c=beforeStoryScene;if(!c||mode!=='beforeStoryMenu')return;loadChapterScreen('CHAPTER 1: ROME — 2000',()=>{
 if(!beforeStoryScene)return;for(const actor of Object.values(c.cast))actor.visible=false;c.chapter='rome';if(c.jukoSet)c.jukoSet.visible=false;if(c.lastJukoSet)c.lastJukoSet.visible=false;document.getElementById('beforeStoryCinemaChapter').textContent='BEFORE THE STORY / CHAPTER 1';document.getElementById('beforeStoryCinemaTitle').innerHTML='ROME <span>2000</span>';if(c.crownMenu)c.crownMenu.visible=false;setMode('beforeStoryRome');hideUndeadCampaignCast();world.visible=upperWorld.visible=flash.visible=false;beforeStoryUI.hidden=true;c.menuSet.visible=false;if(!c.romeSet)buildBeforeStoryRome();c.romeSet.visible=true;
 scene.background.setHex(0xa8cbdc);scene.fog.color.setHex(0xc5d5d5);scene.fog.density=.007;ambient.intensity=1.4;cameraFill.intensity=.45;c.line=0;c.beat=0;c.cast.josiah.visible=c.cast.jones.visible=true;c.cast.josiah.position.set(-.85,0,0);c.cast.jones.position.set(1.1,0,.15);c.cast.josiah.rotation.y=.5;c.cast.jones.rotation.y=-.6;beforeStoryCinema.hidden=false;showBeforeStoryRomeLine();renderBeforeStoryRome(0);syncMenuSong();
 });
}
function showBeforeStoryRomeLine(){const c=beforeStoryScene,line=BEFORE_STORY_ROME_LINES[c.line];stopBeforeStoryVoice();playBeforeStoryRomeVoice();c.speechTimeline=beforeStorySpeechTimeline(line[1]);document.getElementById('beforeStorySpeaker').textContent=line[0]+' / '+(line[2]==='josiah'?'BC-01':'BC-02');document.getElementById('beforeStoryLine').textContent=line[1];document.getElementById('beforeStoryCount').textContent=(c.line+1)+' / '+BEFORE_STORY_ROME_LINES.length;document.getElementById('beforeStoryNext').textContent=c.line===BEFORE_STORY_ROME_LINES.length-1?'FINISH CHAPTER 1 →':'CONTINUE →';}
function advanceBeforeStoryRome(){const c=beforeStoryScene;if(!c)return;if(mode==='beforeStoryJuko'){advanceBeforeStoryJuko();return;}if(mode==='beforeStoryKenjiEnding'){advanceBeforeStoryKenjiEnding();return;}if(mode==='beforeStoryLastJuko'){advanceBeforeStoryLastJuko();return;}if(mode==='beforeStoryBoki'){advanceBeforeStoryBoki();return;}if(mode==='beforeStoryOsakaEnding'){advanceBeforeStoryOsakaEnding();return;}if(mode!=='beforeStoryRome')return;if(c.line>=BEFORE_STORY_ROME_LINES.length-1){beforeStoryProgress.romeCompleted=true;saveBeforeStoryProgress();refreshBeforeStoryChapters();returnBeforeStoryRome();document.getElementById('beforeStoryJuko').focus();return;}c.line++;c.beat=0;showBeforeStoryRomeLine();}
function renderBeforeStoryRome(dt){
 const c=beforeStoryScene;if(!c)return;c.time+=dt;c.beat+=dt;for(const a of Object.values(c.cast))animateCharacter(c.time,false,false,a);updateBeforeStoryMouths(dt);
 // Upright, slowly moving two-shot keeps both characters and Rome in frame.
 camera.up.set(0,1,0);camera.position.copy(c.root.position).add(new THREE.Vector3(.4+Math.sin(c.time*.12)*.3,2.1,6.4));camera.lookAt(c.root.position.clone().add(new THREE.Vector3(.1,1.45,0)));camera.updateMatrixWorld(true);
}
function returnBeforeStoryRome(){const c=beforeStoryScene;if(!c)return;clearBeforeStoryOsaka();clearBeforeStoryKenji();stopBeforeStoryVoice();beforeStoryCinema.style.boxShadow="none";beforeStoryCinema.hidden=true;if(c.romeSet)c.romeSet.visible=false;if(c.jukoSet)c.jukoSet.visible=false;if(c.lastJukoSet)c.lastJukoSet.visible=false;c.menuSet.visible=true;setMode('beforeStoryMenu');hideUndeadCampaignCast();world.visible=upperWorld.visible=flash.visible=false;scene.background.setHex(0x10070c);scene.fog.color.setHex(0x190911);scene.fog.density=.035;ambient.intensity=1.15;cameraFill.intensity=.5;beforeStoryUI.hidden=false;selectBeforeStoryCast('josiah');resetBeforeStoryMouths();renderBeforeStoryMenu(0);syncMenuSong();document.getElementById(c.chapter==='lastJuko'?'beforeStoryLastJuko':c.chapter==='juko'?'beforeStoryJuko':'beforeStoryRome').focus();}
document.getElementById('beforeStoryRome').onclick=startBeforeStoryRome;document.getElementById('beforeStoryReturn').onclick=returnBeforeStoryRome;document.getElementById('beforeStoryNext').onclick=advanceBeforeStoryRome;

function makeBeforeStoryJones(){
 const root=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group(),arms=[],legs=[];root.name='Before the Story / Gareth Jones (2000)';root.add(body);body.add(head);head.position.y=2.08;
 const skin=mat(0xe9bd89),jacket=mat(0x191112),trousers=mat(0xc79a69),hair=mat(0x11100e),ink=mat(0x17181d),shirt=mat(0xe5e0d8),red=mat(0xc22229),shoe=mat(0xf0eee7);
 ball(body,.32,.45,.205,jacket,0,1.2,0);box(body,.45,.18,.33,trousers,0,.89,0);
 ball(body,.13,.31,.045,shirt,0,1.30,.20);box(body,.17,.30,.035,shirt,0,1.08,.21);
 for(const s of [-1,1]){const lapel=box(body,.09,.40,.045,jacket,s*.18,1.36,.228);lapel.rotation.z=s*.2;}
 const tie=box(body,.066,.43,.04,red,0,1.27,.25);tie.rotation.z=-.045;box(body,.08,.065,.045,red,0,1.52,.253);const tip=mesh(new THREE.ConeGeometry(.05,.1,3),red,body,-.01,1.01,.25);tip.rotation.z=Math.PI;
 for(const s of [-1,1]){const arm=new THREE.Group();body.add(arm);arm.position.set(s*.31,1.47,0);ball(arm,.105,.32,.12,jacket,0,-.28,0);box(arm,.165,.065,.18,shirt,0,-.58,0);ball(arm,.083,.12,.08,skin,0,-.69,.015);arms.push(arm);
 const leg=new THREE.Group();root.add(leg);leg.position.set(s*.14,.82,0);box(leg,.235,.7,.26,trousers,0,-.33,0);line3(leg,[[0,-.06,.136],[0,-.63,.136]],trousers,.005);ball(leg,.145,.10,.23,shoe,0,-.73,.07);legs.push(leg);}
 ball(head,.10,.16,.10,skin,0,-.34,0);ball(head,.30,.37,.27,skin,0,0,0);ball(head,.25,.19,.24,skin,0,-.20,.025);
 const scalp=mesh(new THREE.SphereGeometry(1,24,14,0,TAU,0,1.43),hair,head,0,.025,-.025);scalp.scale.set(.31,.36,.27);const fringe=ball(head,.21,.065,.075,hair,-.08,.27,.20);fringe.rotation.z=.24;for(const s of [-1,1])box(head,.05,.20,.08,hair,s*.285,.035,-.045);
 for(const s of [-1,1]){ball(head,.065,.09,.052,skin,s*.30,-.055,0);ball(head,.099,.062,.025,white,s*.125,.035,.253);ball(head,.031,.034,.015,ink,s*.125-.017,.024,.276);ball(head,.101,.03,.025,skin,s*.125,.086,.263);
 const brow=box(head,.16,.026,.025,ink,s*.125,.146,.24);brow.rotation.z=s*.055;
 }
 ball(head,.045,.07,.065,skin,-.012,-.067,.271);
 root.userData.mouth=line3(head,[[-.10,-.202,.236],[0,-.20,.264],[.078,-.214,.239]],ink,.008);for(let i=0;i<38;i++){const a=i*2.399,rad=.055+((i*7)%19)/19*.16,x=Math.cos(a)*rad,y=-.20+Math.sin(a)*rad*.62;if(y>-.18&&Math.abs(x)<.075)continue;ball(head,.006,.006,.006,ink,x,y,.255-Math.abs(x)*.23);}
 Object.assign(root.userData,{body,head,arms,legs,beforeStoryCode:'BC-02',alignment:'Lawful Good',year:2000,hasGlasses:false});return isolateBeforeStoryModel(enhanceHeroModel(root,'jones'));
}

/* Mouth geometry stays anchored to the lips; the original expression never stretches. */
function makeBeforeStorySpeechMouth(id,actor){
 const closed=actor.userData.mouth;closed.scale.set(1,1,1);closed.geometry.computeBoundingBox();const bounds=closed.geometry.boundingBox,center=bounds.getCenter(new THREE.Vector3());
 const width=Math.min(.085,(bounds.max.x-bounds.min.x)*.32),open=ball(actor.userData.head,width,.006,.009,new THREE.MeshBasicMaterial({color:0x281119}),center.x,center.y,bounds.max.z+.005);
 open.name='Rome / anchored speech mouth';open.visible=false;return {id,actor,closed,open,width,level:0};
}
function resetBeforeStoryMouths(){
 for(const m of beforeStoryScene?.speechMouths||[]){m.level=0;m.open.visible=false;m.open.scale.set(m.width,.006,.009);m.closed.visible=true;m.closed.scale.set(1,1,1);if(m.actor.userData.smileCrease)m.actor.userData.smileCrease.visible=true;}
}
function beforeStorySpeechTimeline(text){
 // Retain subtitle timing only if a supplied voice clip cannot play.
 let time=.14;const words=[];for(const token of text.match(/\S+/g)||[]){const syllables=Math.max(1,(token.match(/[aeiouy]+/gi)||[]).length),duration=Math.min(.62,.17+syllables*.10);words.push({start:time,end:time+duration,syllables});time+=duration+(/[.!?]$/.test(token)?.30:/[,;:]$/.test(token)?.18:.065);}return {words,duration:time};
}
function stopBeforeStoryVoice(){
 for(const clip of [...beforeStoryRomeVoices,...beforeStoryJukoVoices,...beforeStoryLastJukoVoices,...beforeStoryBokiVoices]){clip.pause();clip.currentTime=0;}resetBeforeStoryMouths();
}
function playBeforeStoryRomeVoice(){
 const c=beforeStoryScene,index=c.line,clip=beforeStoryRomeVoices[index];c.voiceFailed=false;clip.muted=muted;
 clip.play()?.catch(()=>{if(beforeStoryScene===c&&c.line===index&&mode==='beforeStoryRome')c.voiceFailed=true;});
}
function beforeStoryRomeVoiceLevel(){
 const c=beforeStoryScene,clip=c&&beforeStoryRomeVoices[c.line];if(!clip)return 0;clip.muted=muted;
 if(c.voiceFailed||clip.error){const word=c.speechTimeline.words.find(w=>c.beat>=w.start&&c.beat<w.end);if(!word)return 0;const phase=(c.beat-word.start)/(word.end-word.start);return .7*Math.abs(Math.sin(phase*Math.PI*word.syllables))*Math.min(1,phase*9,(1-phase)*9);}
 if(clip.paused||clip.ended||clip.readyState<2)return 0;
 const envelope=BEFORE_STORY_ROME_VOICE_ENVELOPES[c.line],frame=clip.currentTime/envelope.step,index=Math.floor(frame),mix=frame-index;
 return (envelope.levels[index]||0)*(1-mix)+(envelope.levels[index+1]||0)*mix;
}
function updateBeforeStoryMouths(dt){
 const c=beforeStoryScene;if(!c?.speechTimeline)return;const id=BEFORE_STORY_ROME_LINES[c.line][2],target=beforeStoryRomeVoiceLevel();
 for(const m of c.speechMouths){const speaking=m.id===id&&target>.01;m.level+=((speaking?target:0)-m.level)*(1-Math.exp(-Math.max(0,dt)*24));const visible=speaking&&m.level>.035;
  m.open.visible=visible;m.open.scale.set(m.width*(1-.16*m.level),.006+m.level*.028,.009);m.closed.visible=!visible;m.closed.scale.set(1,1,1);if(m.actor.userData.smileCrease)m.actor.userData.smileCrease.visible=!visible;
 }
}

const BEFORE_STORY_JUKO_LINES=[
 "In 2004, Gareth Jones suddenly left the civil service. Before he went, he installed me as his successor: the next Grade 7. I had worked beside him long enough to trust his judgement, but his departure left questions he never answered. I inherited his position without understanding everything that came with it.",
 "I was working in the Foreign Office when the assignment reached my desk. There were rumours of a plan to reach the stars. At first, it sounded like an ambitious research programme: something for scientists, ministers and committees to argue over. But the people asking questions about it were not behaving like scientists.",
 "The reports were incomplete. Names vanished between one document and the next, and nobody seemed willing to explain who was financing the work. Whenever I asked what the plan was meant to achieve, the answers became less precise. Reaching the stars was the only phrase that remained consistent.",
 "And there was something I had not put in those reports. I had spoken to a priest as he lay dying. He told me that another person was going to achieve that plan. His breathing was failing, but he seemed more frightened of what would happen after his death than of dying itself.",
 "I cannot remember the priest’s name, and that failure has troubled me ever since. I remember speaking to him. I remember how urgently he wanted me to listen. He knew something about the plan to reach the stars, and he was determined to tell me before his remaining strength gave out.",
 "Even then, he spoke as if my involvement were already settled. “You will help me reach the stars, whether you like it or not.” Those were the words of a dying priest, spoken directly to me. He left me to wonder whether I had heard a threat, a prediction, or a promise that would somehow outlive him.",
 "The investigation eventually brought me to the Juko Zaibatsu. It was led by two brothers: Takeshi Juko and Bozuki Juko. Their names appeared in places where the official accounts offered very little detail. I needed to establish what they controlled, whom they answered to, and whether they were connected to the plan.",
 "The brothers ruled regions in Tokyo, Osaka and Sendai. The distance between those cities did not seem to weaken their influence. Each new report widened the picture, until I was looking at something much larger than a single local operation. Whatever the Juko brothers were building, it had roots in several places.",
 "I could not yet prove that the zaibatsu and the dying priest’s words belonged to the same story. Suspicion was not evidence, however much I wanted the fragments to fit. But I could not dismiss what he had told me either. He had used his final breath to warn me that another person would achieve that ambition.",
 "So I continued the investigation. Gareth had left me a position to fill, the Foreign Office had given me a task, and a priest had told me I would have no choice in what came next. I intended to discover what reaching the stars actually meant. And I intended to find out why the Juko Zaibatsu stood in the middle of it.",
 "In 2009, five years after my investigation began, I came face to face with Kenji Tanaka in Shibuya. By then, I had learned that people rarely used his real name. They called him the Viper.",
 "Kenji had been the ruthless enforcer of Bozuki Juko. He was the man sent to make certain that orders were obeyed. To understand what was happening in Shibuya, I had to understand what had become of his master.",
 "Bozuki had broken away from the Juko Zaibatsu. He later died in America in a terrorist attack. His death left Kenji without the man he had served, but it did not put an end to the danger.",
 "Kenji was planning an insurrection. Whatever loyalty he had once shown Bozuki had become a determination to impose his own will. The reports that brought me to Shibuya were no longer about something happening in the distant future.",
 "The Viper was standing in front of me. He had no intention of answering my questions, and his whip made that clear enough. I had come to stop an insurrection. If that meant facing Bozuki’s enforcer myself, then I would face him."
];

function buildBeforeStoryJuko(){
 const c=beforeStoryScene,r=new THREE.Group();c.root.add(r);c.jukoSet=r;
 const wood=mat(0x472a22),brass=mat(0xb2965c),paper=mat(0xdcd2b5),wall=mat(0x25353c),dark=mat(0x101822);
 box(r,18,.25,18,wood,0,-.2,0);box(r,18,6,.4,wall,0,2.8,-6);box(r,.4,6,18,wall,-9,2.8,0);box(r,.4,6,18,wall,9,2.8,0);box(r,18,.25,18,dark,0,5.9,0);
 for(let x=-8;x<9;x+=2){box(r,.05,5,.1,brass,x,2.4,-5.7);box(r,1.8,1.1,.12,wood,x,.7,-5.7);}
 // An office dossier and a stellar chart carry the narration without inventing a mission.
 box(r,4,.2,1.8,wood,0,1.1,0);for(const x of [-1.65,1.65])for(const z of [-.65,.65])box(r,.12,1.1,.12,wood,x,.5,z);
 const folder=box(r,1.3,.025,.95,mat(0x771f33),-.8,1.22,.15);folder.rotation.y=-.16;const pages=box(r,1.08,.035,.78,paper,-.8,1.24,.15);pages.rotation.y=-.16;for(let z=-.1;z<.4;z+=.08)box(r,.72,.008,.009,mat(0x8e8170),-.8,1.263,z);
 const globe=mesh(new THREE.SphereGeometry(.38,32,20),mat(0x315b78),r,1.25,1.65,.05);line3(r,[[1.25,1.27,.05],[1.25,1.45,.05]],brass,.055);mesh(new THREE.CylinderGeometry(.3,.3,.06,24),brass,r,1.25,1.25,.05);
 const board=new THREE.Group();board.position.set(0,3,-5.45);r.add(board);box(board,6.6,3,.1,brass);box(board,6.4,2.8,.12,dark,0,0,.07);
 const star=mat(0xafd9ef),points=[];for(let i=0;i<65;i++){const x=Math.sin(i*12.9898)*2.9,y=Math.cos(i*7.233)*1.17;ball(board,.015+(i%5===0?.018:0),.015,.018,star,x,y,.15);if(i%9===0)points.push([x,y,.17]);}line3(board,points,brass,.007);
 for(const x of [-6,6]){box(r,1.6,2.6,1.1,mat(0x354049),x,1.25,-4.5);for(let y=.45;y<2.7;y+=.7){box(r,1.5,.55,.05,wall,x,y,-3.92);box(r,.32,.035,.1,brass,x,y,-3.86);}}
 const lamp=new THREE.PointLight(0xffddab,24,12);lamp.position.set(-2,3,3);r.add(lamp);const rim=new THREE.PointLight(0x719edb,18,14);rim.position.set(3,4,-4);r.add(rim);
}
function startBeforeStoryJuko(){
 const c=beforeStoryScene;if(!c||mode!=='beforeStoryMenu'||!beforeStoryProgress.romeCompleted)return;
 loadChapterScreen('CHAPTER 2: THE JUKO ZAIBATSU — 2004',()=>{if(beforeStoryScene!==c)return;stopBeforeStoryVoice();c.chapter='juko';if(c.lastJukoSet)c.lastJukoSet.visible=false;c.line=0;c.beat=0;if(c.crownMenu)c.crownMenu.visible=false;setMode('beforeStoryJuko');hideUndeadCampaignCast();world.visible=upperWorld.visible=flash.visible=false;beforeStoryUI.hidden=true;c.menuSet.visible=false;if(c.romeSet)c.romeSet.visible=false;if(!c.jukoSet)buildBeforeStoryJuko();c.jukoSet.visible=true;for(const a of Object.values(c.cast))a.visible=false;scene.background.setHex(0x101822);scene.fog.color.setHex(0x101822);scene.fog.density=.02;ambient.intensity=.75;cameraFill.intensity=.4;
 document.getElementById('beforeStoryCinemaChapter').textContent='BEFORE THE STORY / CHAPTER 2';document.getElementById('beforeStoryCinemaTitle').innerHTML='THE JUKO ZAIBATSU <span>2004</span>';beforeStoryCinema.hidden=false;showBeforeStoryJukoLine();renderBeforeStoryJuko(0);syncMenuSong();});
}
function showBeforeStoryJukoLine(){const c=beforeStoryScene;stopBeforeStoryVoice();playBeforeStoryJukoVoice();document.getElementById('beforeStorySpeaker').textContent='JOSIAH RICHARDS / NARRATION';document.getElementById('beforeStoryLine').textContent=BEFORE_STORY_JUKO_LINES[c.line];document.getElementById('beforeStoryCount').textContent=(c.line+1)+' / '+BEFORE_STORY_JUKO_LINES.length;document.getElementById('beforeStoryNext').textContent=c.line===BEFORE_STORY_JUKO_LINES.length-1?'FACE THE VIPER →':'CONTINUE →';}
function advanceBeforeStoryJuko(){const c=beforeStoryScene;if(mode!=='beforeStoryJuko'||!c)return;if(c.line===BEFORE_STORY_JUKO_LINES.length-1){stopBeforeStoryVoice();startBeforeStoryKenji();return;}c.line++;c.beat=0;showBeforeStoryJukoLine();}
function renderBeforeStoryJuko(dt){const c=beforeStoryScene;if(!c)return;const narrationClip=beforeStoryJukoVoices[c.line];if(narrationClip)narrationClip.muted=muted;c.time+=dt;c.beat+=dt;camera.up.set(0,1,0);const x=Math.sin(c.time*.1)*.2;camera.position.copy(c.root.position).add(new THREE.Vector3(x,2.4,5.2));camera.lookAt(c.root.position.clone().add(new THREE.Vector3(0,1.8,-2)));camera.updateMatrixWorld(true);}
document.getElementById('beforeStoryJuko').onclick=startBeforeStoryJuko;

function playBeforeStoryJukoVoice(){const c=beforeStoryScene,index=c.line,clip=beforeStoryJukoVoices[index];c.voiceFailed=false;if(!clip){c.voiceFailed=true;return;}clip.muted=muted;clip.play()?.catch(()=>{if(beforeStoryScene===c&&c.line===index&&mode==='beforeStoryJuko')c.voiceFailed=true;});}

