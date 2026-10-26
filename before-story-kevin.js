/* Character story 04: a separate 2004 model, cinematic and prequel save flag. */
const KEVIN_SHINJUKU_LINES=[
 ['kevin','Shinjuku, 2004. I remember the lights, the noise, the people passing me. Nothing about that street warned me what was waiting around the corner.'],
 ['kevin','I was not looking for a fight. Then the footsteps behind me slowed when I slowed. By the time I turned into the side street, someone was already blocking the other end.'],
 ['yakuza','Stop there. Keep your hands where I can see them. You are not going anywhere.'],
 ['kevin','Who are you? What do you want from me?'],
 ['yakuza','No more questions. You are coming with me.']
];
const TAKESHI_SHINJUKU_LINES=[
 'Look at you. One little blade, and all that freedom you thought you had is lying in the gutter.',
 'Keep your hand on that wound. You do not get to bleed out until I decide we are finished.',
 'Go on. Look down the street. Count the doors you could have reached if your legs still obeyed you.',
 'That man was careless. I prefer my victims frightened enough to remember every instruction.',
 'I could take you to a hospital. Then this would become a terrible memory. But I have barely begun enjoying your company.',
 'My name is Takeshi Juko. Remember it. When you wake up somewhere unfamiliar, I want it to be the first thing you think of.',
 'I will let you hope someone is coming. Watching you listen for footsteps that never arrive will be worth the wait.',
 'No more questions. No more choices. You are mine now, and I intend to keep you alive long enough to understand what that means.'
];
try{beforeStoryProgress.kevinShinjukuCompleted=JSON.parse(localStorage.getItem(BEFORE_STORY_SAVE_KEY))?.kevinShinjukuCompleted===true;}catch(e){beforeStoryProgress.kevinShinjukuCompleted=false;}
const beforeStoryKevinButton=document.createElement('button');beforeStoryKevinButton.id='beforeStoryKevin';beforeStoryKevinButton.type='button';beforeStoryKevinButton.className='before-story-character-button';beforeStoryKevinButton.setAttribute('aria-expanded','false');beforeStoryKevinButton.setAttribute('aria-controls','beforeStoryKevinChapters');beforeStoryKevinButton.innerHTML='<b>04</b><span><small>CHARACTER STORY</small><strong>KEVIN MURDERHORN</strong></span><i>↗</i>';beforeStoryPeterChapters.after(beforeStoryKevinButton);
const beforeStoryKevinChapters=document.createElement('section');beforeStoryKevinChapters.id='beforeStoryKevinChapters';beforeStoryKevinChapters.className='before-story-personal-chapters';beforeStoryKevinChapters.hidden=true;beforeStoryKevinChapters.setAttribute('aria-labelledby','beforeStoryKevinChapterTitle');beforeStoryKevinChapters.innerHTML='<small>KEVIN MURDERHORN / BC-01 / CHAPTER 1 / 2004 / CUTSCENE</small><h2 id="beforeStoryKevinChapterTitle">AMBUSH AT SHINJUKU</h2><p>Shinjuku, Japan. Kevin is ambushed by a member of the Japanese Yakuza.</p><button id="beforeStoryShinjuku" type="button">BEGIN CHAPTER 1 →</button><button id="beforeStoryKevinBack" type="button">← BACK</button>';beforeStoryKevinButton.after(beforeStoryKevinChapters);
const kevinStoryCast=document.createElement('div');kevinStoryCast.id='beforeStoryKevinCast';kevinStoryCast.className='before-story-cast';kevinStoryCast.hidden=true;kevinStoryCast.setAttribute('aria-label',"Kevin Murderhorn's story characters");kevinStoryCast.innerHTML='<button id="kevinStorySelectKevin" type="button" aria-pressed="false">BC-01 · KEVIN MURDERHORN</button><button id="kevinStorySelectTakeshi" type="button" aria-pressed="false">BC-02 · TAKESHI JUKO</button><button id="kevinStorySelectBozuki" type="button" aria-pressed="false">BC-03 · BOZUKI JUKO</button>';document.querySelector('.before-story-profile').appendChild(kevinStoryCast);
const KEVIN_STORY_CAST_IDS=['kevin2004','takeshi2004','bozuki2004'];
const KEVIN_STORY_PROFILES={
 kevin2004:['BC-01','KEVIN MURDERHORN','ALIGNMENT: TRUE NEUTRAL','Kevin Murderhorn in 2004, before Project BC. His story begins in Shinjuku, where a member of the Japanese Yakuza ambushes him.'],
 takeshi2004:['BC-02','TAKESHI JUKO','ALIGNMENT: NEUTRAL EVIL','Takeshi Juko leads the Juko Zaibatsu alongside his brother Bozuki. In 2004, he approaches the wounded Kevin in Shinjuku after the attacker has fled. Calculating and sadistic, he sees Kevin’s helplessness as an opportunity to take control.'],
 bozuki2004:['BC-03','BOZUKI JUKO','ALIGNMENT: LAWFUL EVIL','Bozuki Juko is Takeshi Juko’s brother and co-leader of the Juko Zaibatsu. Together, the brothers control an organisation with influence across Tokyo, Osaka and Sendai. Their shared leadership makes the Zaibatsu a powerful and feared force across the regions they control.']
};

function makeBeforeStoryKevin2004(){
 const root=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group(),arms=[],legs=[],forearmMeshes=[],hands=[];root.add(body);body.add(head);head.position.y=2.08;
 const shirt=mat(0x08090a),trousers=mat(0x0b0b0d),shoe=mat(0x070708),skin=mat(0xf0c18b),hair=mat(0x100907),ink=mat(0x171411),white=mat(0xf9f8eb);
 ball(body,.32,.45,.205,shirt,0,1.23,0);box(body,.49,.18,.34,shirt,0,.9,0);
 for(const side of [-1,1]){
  const arm=new THREE.Group();body.add(arm);arm.position.set(side*.32,1.47,0);ball(arm,.13,.18,.13,shirt,0,-.12,0);forearmMeshes.push(ball(arm,.084,.24,.087,skin,0,-.4,0));hands.push(ball(arm,.082,.12,.081,skin,0,-.66,.015));arm.rotation.z=side*.045;arms.push(arm);
  const leg=new THREE.Group();root.add(leg);leg.position.set(side*.145,.82,0);box(leg,.235,.70,.27,trousers,0,-.33,0);ball(leg,.15,.10,.235,shoe,0,-.73,.065);legs.push(leg);
 }
 ball(head,.33,.4,.27,hair,0,.035,-.07);ball(head,.29,.36,.25,skin,0,-.025,.04);
 for(const side of [-1,1]){
  for(let i=0;i<6;i++){const lock=ball(head,.10+(i%2)*.015,.16,.13,hair,side*(.265+.012*Math.sin(i)),.24-i*.18,-.08);lock.rotation.z=side*(.1+i%2*.12);}
  ball(head,.1,.19,.13,hair,side*.255,-.68,-.12);ball(head,.065,.085,.05,skin,side*.29,-.08,.045);
  ball(head,.111,.119,.026,white,side*.12,.035,.267);ball(head,.033,.045,.016,ink,side*.12+.037,.02,.292);
  const brow=box(head,.17,.024,.025,hair,side*.12,.19,.25);brow.rotation.z=-side*.09;
 }
 for(const [x,y,z,tilt] of [[-.23,.22,.08,-.5],[-.14,.34,.07,-.35],[0,.36,.01,.08],[.15,.31,.06,.35],[.24,.20,.04,.4]]){const wave=ball(head,.125,.13,.17,hair,x,y,z);wave.rotation.z=tilt;}
 ball(head,.045,.06,.057,skin,.016,-.08,.274);const mouth=line3(head,[[-.075,-.205,.246],[.015,-.202,.279],[.09,-.212,.249]],ink,.008);
 root.name='Kevin Murderhorn / 2004 / BC-01 / black short-sleeved shirt';Object.assign(root.userData,{body,head,arms,legs,forearmMeshes,hands,mouth,beforeStoryCode:'BC-01',year:2004,alignment:'True Neutral'});return isolateBeforeStoryModel(enhanceHeroModel(root,'kevin2004'));
}
function makeShinjukuYakuza(){
 // An original face and silhouette: straight side-parted hair, a defined jaw,
 // smaller almond-shaped eyes and an open charcoal jacket with no tie.
 const root=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group(),arms=[],legs=[];root.add(body);body.add(head);head.position.y=2.08;
 const skin=mat(0xe6b18c),hair=mat(0x0c0c10),jacket=mat(0x27232d),shirt=mat(0xc9c5bd),trousers=mat(0x19181f),shoe=mat(0x101015),ink=mat(0x201b1a),white=mat(0xeee9db);
 ball(body,.34,.46,.205,jacket,0,1.23,0);box(body,.51,.21,.35,jacket,0,.92,0);box(body,.16,.48,.034,shirt,0,1.32,.213);
 for(const side of [-1,1]){
  const lapel=box(body,.13,.43,.045,jacket,side*.145,1.4,.237);lapel.rotation.z=side*.21;
  const collar=box(body,.10,.12,.035,shirt,side*.075,1.62,.23);collar.rotation.z=side*.27;
  const arm=new THREE.Group();body.add(arm);arm.position.set(side*.34,1.48,0);ball(arm,.125,.30,.13,jacket,0,-.28,0);box(arm,.185,.055,.19,shirt,0,-.57,0);ball(arm,.085,.12,.084,skin,0,-.66,.025);arms.push(arm);
  const leg=new THREE.Group();root.add(leg);leg.position.set(side*.15,.82,0);box(leg,.24,.70,.28,trousers,0,-.33,0);ball(leg,.15,.10,.235,shoe,0,-.73,.08);legs.push(leg);
 }
 box(body,.15,.015,.014,ink,-.20,1.4,.257);ball(body,.018,.018,.014,ink,0,1.13,.247);
 ball(head,.275,.355,.235,skin,0,-.015,.025);ball(head,.22,.135,.205,skin,0,-.255,.022);
 const cap=mesh(new THREE.SphereGeometry(1,36,24,0,TAU,0,1.35),hair,head,0,.045,-.045);cap.scale.set(.297,.366,.26);
 const sweep=ball(head,.23,.085,.20,hair,-.065,.327,.005);sweep.rotation.z=.09;ball(head,.15,.09,.16,hair,.145,.302,-.005);
 const eyeShape=new THREE.Shape();eyeShape.moveTo(-.083,0);eyeShape.quadraticCurveTo(0,.079,.083,0);eyeShape.quadraticCurveTo(0,-.035,-.083,0);
 for(const side of [-1,1]){
  box(head,.042,.18,.065,hair,side*.271,.055,-.035);ball(head,.057,.081,.041,skin,side*.278,-.075,.008);
  mesh(new THREE.ShapeGeometry(eyeShape,18),white,head,side*.111,.024,.253);ball(head,.028,.032,.012,ink,side*.111,.036,.269);
  line3(head,[[side*.111-.083,.024,.257],[side*.111,.064,.26],[side*.111+.083,.024,.257]],ink,.006);
  const brow=box(head,.155,.026,.022,hair,side*.11,.143,.223);brow.rotation.z=-side*.08;
 }
 line3(head,[[.09,.343,.17],[.10,.369,.02],[.095,.327,-.14]],mat(0x343039),.006);
 ball(head,.035,.055,.044,skin,0,-.071,.254);const mouth=line3(head,[[-.083,-.205,.226],[0,-.204,.254],[.082,-.205,.226]],ink,.008);
 root.name='Shinjuku Yakuza / original Japanese character';Object.assign(root.userData,{body,head,arms,legs,mouth,identity:'shinjukuYakuza',nationality:'Japanese',year:2004});return isolateBeforeStoryModel(enhanceHeroModel(root,'shinjukuYakuza'));
}
function makeShinjukuKnife(actor){
 const knife=new THREE.Group();knife.name='Yakuza knife';actor.userData.arms[1].add(knife);knife.position.set(0,-.65,.03);
 const steel=new THREE.MeshStandardMaterial({color:0xcdd3df,metalness:.8,roughness:.22,side:THREE.DoubleSide}),handle=mat(0x15131b),guard=mat(0x676b75,.65);
 box(knife,.08,.10,.16,handle,0,0,-.035);box(knife,.16,.045,.045,guard,0,0,.068);
 box(knife,.075,.012,.29,steel,0,0,.23);const blade=new THREE.BufferGeometry();blade.setAttribute('position',new THREE.Float32BufferAttribute([-.045,0,.09,.045,0,.09,.032,0,.38,-.045,0,.09,.032,0,.38,0,0,.58]));blade.computeVertexNormals();const edge=new THREE.Mesh(blade,steel);edge.name='Knife blade';knife.add(edge);line3(knife,[[0,.004,.10],[0,.004,.39],[0,0,.58]],guard,.003);return knife;
}
function closeBeforeStoryKevinChapters(){beforeStoryKevinChapters.hidden=true;beforeStoryKevinButton.setAttribute('aria-expanded','false');}
const kevinStoryPreviousSelect=selectBeforeStoryCast;selectBeforeStoryCast=function(id){
 const c=beforeStoryScene;if(!c||mode!=='beforeStoryMenu')return;
 if(!KEVIN_STORY_CAST_IDS.includes(id)){kevinStoryCast.hidden=true;closeBeforeStoryKevinChapters();if(c.story==='kevin')c.story='home';kevinStoryPreviousSelect(id);return;}
 const profile=KEVIN_STORY_PROFILES[id];if(!c.cast[id]){const actor=id==='kevin2004'?makeBeforeStoryKevin2004():isolateBeforeStoryModel(makeOsakaTormentor(id==='takeshi2004'?'Takeshi Juko':'Bozuki Juko'));Object.assign(actor.userData,{beforeStoryCode:profile[0],year:2004,alignment:id==='takeshi2004'?'Neutral Evil':id==='bozuki2004'?'Lawful Evil':'True Neutral'});if(id!=='kevin2004'){actor.name='Before the Story / '+profile[1]+' / '+profile[0];actor.userData.title='Co-leader of the Juko Zaibatsu';}c.cast[id]=actor;c.root.add(actor);}c.story='kevin';c.actor=c.cast[id];
 for(const [key,actor] of Object.entries(c.cast)){actor.visible=key===id;actor.position.set(0,0,0);}if(c.crownMenu)c.crownMenu.visible=false;
 document.getElementById('beforeStoryChapters').hidden=true;document.getElementById('beforeStoryJosiah').setAttribute('aria-expanded','false');closeBeforeStoryChrisChapters();closeBeforeStoryPeterChapters();peterStoryCast.hidden=peterDGTitle.hidden=heathCast.hidden=true;document.querySelector('.before-story-profile>.before-story-cast').hidden=true;
 document.getElementById('beforeStoryCode').textContent=profile[0]+' / CHARACTER STORY 04 / YEAR 2004';document.getElementById('beforeStoryName').textContent=profile[1];document.getElementById('beforeStoryAlignment').textContent=profile[2];document.getElementById('beforeStoryProfileText').textContent=profile[3];kevinStoryCast.hidden=false;
 for(const [i,button] of [...kevinStoryCast.querySelectorAll('button')].entries())button.setAttribute('aria-pressed',String(KEVIN_STORY_CAST_IDS[i]===id));
 document.querySelectorAll('[data-before-cast]').forEach(button=>button.setAttribute('aria-pressed','false'));renderBeforeStoryMenu(0);syncMenuSong();
};
document.getElementById('kevinStorySelectKevin').onclick=()=>selectBeforeStoryCast('kevin2004');document.getElementById('kevinStorySelectTakeshi').onclick=()=>selectBeforeStoryCast('takeshi2004');document.getElementById('kevinStorySelectBozuki').onclick=()=>selectBeforeStoryCast('bozuki2004');
beforeStoryKevinButton.onclick=()=>{if(mode!=='beforeStoryMenu')return;const open=beforeStoryKevinChapters.hidden;selectBeforeStoryCast('kevin2004');beforeStoryKevinChapters.hidden=!open;beforeStoryKevinButton.setAttribute('aria-expanded',String(open));(open?document.getElementById('beforeStoryKevinBack'):beforeStoryKevinButton).focus();};
document.getElementById('beforeStoryKevinBack').onclick=()=>{closeBeforeStoryKevinChapters();beforeStoryScene.story='home';syncMenuSong();beforeStoryKevinButton.focus();};
const kevinStoryPreviousToggle=toggleBeforeStoryChapters;toggleBeforeStoryChapters=function(open){closeBeforeStoryKevinChapters();if(open&&KEVIN_STORY_CAST_IDS.some(id=>beforeStoryScene?.actor===beforeStoryScene?.cast[id]))selectBeforeStoryCast('josiah');kevinStoryPreviousToggle(open);};
const kevinStoryPreviousRefresh=refreshBeforeStoryChapters;refreshBeforeStoryChapters=function(){kevinStoryPreviousRefresh();document.getElementById('beforeStoryShinjuku').textContent=beforeStoryProgress.kevinShinjukuCompleted?'REPLAY CHAPTER 1 →':'BEGIN CHAPTER 1 →';};refreshBeforeStoryChapters();

function buildKevinShinjuku(){
 const c=beforeStoryScene,root=new THREE.Group();root.name='Ambush at Shinjuku / 2004';c.root.add(root);const b=c.shinjuku={root,time:0,beat:0,line:0},road=mat(0x191d28),concrete=mat(0x44454d),black=mat(0x11121a),metal=mat(0x454454),window=mat(0x152331);
 box(root,36,.3,78,road,0,-.22,-12);for(const side of [-1,1]){box(root,4,.16,75,concrete,side*6,-.035,-12);for(let i=0;i<7;i++){
  const x=side*(10+i%2),z=12-i*9,height=9+i%3*3;box(root,7,height,8,mat(i%2?0x30313d:0x484750),x,height/2-.05,z);
  for(let y=3;y<height;y+=2)for(const dx of [-2,0,2])box(root,1.1,1.1,.08,window,x+dx,y,z+4.03);
  const glow=['#73cce5','#e877a6','#eec974'][i%3],words=['SHINJUKU','CAFE','KARAOKE','2004','ARCADE','TOKYO','NIGHT'][i],label=heathSign(words,glow,'#161827',3.3);label.position.set(x,3.3,z+4.1);root.add(label);
  const strip=new THREE.MeshBasicMaterial({color:glow});box(root,.15,5,.1,strip,x-side*3.1,4,z+4.08);const light=new THREE.PointLight(glow,16,17);light.position.set(x-side*3,3.4,z+4.4);root.add(light);
  if(i%2===0){box(root,.11,4.5,.11,metal,side*4.8,2.25,z);box(root,.7,.1,.2,strip,side*4.8,4.5,z);}
 }}
 // A side passage provides a visible approach instead of spawning the attacker beside Kevin.
 box(root,12,8,.5,concrete,-14,4,-3);box(root,.4,8,15,concrete,-20,4,4);for(let i=0;i<3;i++){box(root,1.4,1.7,.8,metal,-9-i*2,.85,-2.2);box(root,.16,5,.16,metal,-12-i*2,2.5,-2.65);}const alleySign=heathSign('SHINJUKU / 2004','#bddcfa','#192231',4);alleySign.position.set(-12,3,-2.6);root.add(alleySign);
 for(let z=12;z>-45;z-=7)box(root,.12,.015,3,mat(0xaea496),0,-.054,z);for(let x=-3.5;x<=3.5;x+=1)box(root,.6,.018,4,mat(0x9b9fa3),x,-.05,-12);
 const moonlight=new THREE.DirectionalLight(0x9cb8dc,1.3);moonlight.position.set(10,18,8);root.add(moonlight,new THREE.HemisphereLight(0x9faeca,0x292027,1));
 b.kevin=makeBeforeStoryKevin2004();b.kevin.position.set(0,0,3.5);b.kevin.rotation.y=Math.PI;root.add(b.kevin);
 b.yakuza=makeShinjukuYakuza();b.yakuza.position.set(-10,0,1.5);root.add(b.yakuza);b.knife=makeShinjukuKnife(b.yakuza);
 b.takeshi=isolateBeforeStoryModel(makeOsakaTormentor('Takeshi Juko'));b.takeshi.visible=false;b.takeshi.position.set(1.6,0,-10);root.add(b.takeshi);
 b.wound=ball(b.kevin.userData.body,.065,.075,.009,new THREE.MeshStandardMaterial({color:0x991a24,emissive:0x35080b,roughness:1}),.06,1.12,.242);b.wound.name='Kevin / stab wound on shirt';b.wound.visible=false;
 b.attackLight=new THREE.PointLight(0xc7d6f3,18,12);b.attackLight.position.set(1.5,3.3,2.7);b.attackLight.visible=false;root.add(b.attackLight);
 b.mouths={kevin:makeBeforeStorySpeechMouth('shinjukuKevin',b.kevin),yakuza:makeBeforeStorySpeechMouth('shinjukuYakuza',b.yakuza),takeshi:makeBeforeStorySpeechMouth('shinjukuTakeshi',b.takeshi)};return b;
}
function clearKevinShinjuku(){const c=beforeStoryScene;if(c?.shinjuku){disposeCampObject(c.shinjuku.root);c.shinjuku=null;}document.getElementById('beforeStoryNext').disabled=false;keys.clear();}
function startKevinShinjuku(){
 const c=beforeStoryScene;if(mode!=='beforeStoryMenu'||!c)return;clearKevinShinjuku();stopBeforeStoryVoice();clearPeterAdministrator();clearPeterDGConversation();clearPeterUxbridge();clearBeforeStoryHeath();clearPinterRomford();
 for(const key of ['menuSet','romeSet','jukoSet','lastJukoSet','heathNarrationSet'])if(c[key])c[key].visible=false;for(const actor of Object.values(c.cast))actor.visible=false;if(c.crownMenu)c.crownMenu.visible=false;
 c.story='kevin';c.chapter='kevinShinjuku';buildKevinShinjuku();setMode('beforeStoryShinjuku');beforeStoryUI.hidden=true;beforeStoryCinema.hidden=false;hideUndeadCampaignCast();world.visible=upperWorld.visible=exhibit.visible=flash.visible=false;scene.background.setHex(0x101829);scene.fog.color.setHex(0x101829);scene.fog.density=.018;ambient.intensity=.9;cameraFill.intensity=.5;keys.clear();
 document.getElementById('beforeStoryCinemaChapter').textContent='BEFORE THE STORY / KEVIN MURDERHORN / CHAPTER 1';document.getElementById('beforeStoryCinemaTitle').innerHTML='AMBUSH AT SHINJUKU <span>2004</span>';showKevinShinjukuLine();renderKevinShinjuku(0);syncMenuSong();updateMobileControls();
}
function showKevinShinjukuLine(){const b=beforeStoryScene.shinjuku,[speaker,text]=KEVIN_SHINJUKU_LINES[b.line];b.beat=0;b.timeline=beforeStorySpeechTimeline(text);document.getElementById('beforeStorySpeaker').textContent=speaker==='kevin'?'KEVIN MURDERHORN / BC-01':'YAKUZA MEMBER';document.getElementById('beforeStoryLine').textContent=text;document.getElementById('beforeStoryCount').textContent=(b.line+1)+' / '+KEVIN_SHINJUKU_LINES.length;document.getElementById('beforeStoryNext').textContent='CONTINUE →';document.getElementById('beforeStoryNext').disabled=false;}
function returnKevinShinjuku(){clearKevinShinjuku();beforeStoryCinema.hidden=true;returnBeforeStoryRome();selectBeforeStoryCast('kevin2004');beforeStoryKevinChapters.hidden=false;beforeStoryKevinButton.setAttribute('aria-expanded','true');document.getElementById('beforeStoryShinjuku').focus();}
function finishKevinShinjuku(){beforeStoryProgress.kevinShinjukuCompleted=true;saveBeforeStoryProgress();refreshBeforeStoryChapters();returnKevinShinjuku();}
function beginKevinShinjukuStab(){
 const b=beforeStoryScene.shinjuku;b.attack={time:0,hit:false};b.attackLight.visible=true;document.getElementById('beforeStorySpeaker').textContent='KEVIN MURDERHORN / BC-01';document.getElementById('beforeStoryLine').textContent='';document.getElementById('beforeStoryCount').textContent='AMBUSH';document.getElementById('beforeStoryNext').textContent='…';document.getElementById('beforeStoryNext').disabled=true;renderKevinShinjukuStab(0);
}
function advanceKevinShinjuku(){const b=beforeStoryScene?.shinjuku;if(mode!=='beforeStoryShinjuku'||!b)return;if(b.takeshiSpeech){if(b.takeshiSpeech.line===TAKESHI_SHINJUKU_LINES.length-1)finishKevinShinjuku();else{b.takeshiSpeech.line++;showTakeshiShinjukuLine();}return;}if(b.aftermath||b.attack)return;if(b.line===KEVIN_SHINJUKU_LINES.length-1)beginKevinShinjukuStab();else{b.line++;showKevinShinjukuLine();}}
function renderKevinShinjukuStab(dt){
 const c=beforeStoryScene,b=c.shinjuku,a=b.attack;a.time+=dt;const t=a.time,thrust=THREE.MathUtils.smoothstep(t,.55,.95),withdraw=THREE.MathUtils.smoothstep(t,1.15,1.65),reach=thrust*(1-withdraw),recoil=THREE.MathUtils.smoothstep(t,.95,1.55),kneel=THREE.MathUtils.smoothstep(t,2,3.2);
 animateCharacter(b.time,false,false,b.yakuza);animateCharacter(b.time,false,false,b.kevin);
 b.yakuza.position.set(-1.3+.54*reach,0,1.5-.7*reach);b.yakuza.rotation.y=Math.atan2(1.3,-1.6);b.yakuza.userData.body.rotation.set(0,0,0);b.yakuza.userData.arms[1].rotation.set(-.45-.75*reach,0,0);
 b.kevin.position.set(.19*recoil,-.5*kneel,-.1-.24*recoil);b.kevin.rotation.y=Math.atan2(-1.3,1.6);b.kevin.userData.body.rotation.set(.18*recoil+.28*kneel,0,0);b.kevin.userData.head.rotation.x=.12*recoil;
 for(const [i,arm] of b.kevin.userData.arms.entries()){arm.rotation.set(-.8+.35*recoil,0,(i?1:-1)*(.55-recoil));b.kevin.userData.forearmMeshes[i].scale.y=.24-.09*recoil;b.kevin.userData.forearmMeshes[i].position.y=-.4+.04*recoil;b.kevin.userData.hands[i].position.y=-.66+.16*recoil;}for(const leg of b.kevin.userData.legs)leg.rotation.x=1.25*kneel;
 b.root.updateMatrixWorld(true);const target=b.wound.getWorldPosition(new THREE.Vector3());b.knife.lookAt(target);b.knife.updateMatrixWorld(true);
 if(t>=.95&&!a.hit){a.hit=true;b.wounded=true;b.kevin.userData.injured=true;b.wound.visible=true;a.contactDistance=b.knife.localToWorld(new THREE.Vector3(0,0,.58)).distanceTo(target);playKevinShinjukuVoice(5);}
 for(const [id,mouth] of Object.entries(b.mouths)){const level=kevinShinjukuVoiceLevel(id);mouth.open.visible=level>.04;mouth.open.scale.set(mouth.width,.006+level*.025,.009);mouth.closed.visible=!mouth.open.visible;}
 document.getElementById('beforeStoryLine').textContent=a.hit?'AHH!':'';const next=document.getElementById('beforeStoryNext');next.disabled=true;next.textContent='…';
 // An upright side view keeps the knife, contact and Kevin's recoil in the shot.
 const eye=new THREE.Vector3(3.15,2.55,3.3),focus=new THREE.Vector3(-.35,1.3-.30*kneel,.3);camera.up.set(0,1,0);camera.position.copy(c.root.position).add(eye);camera.lookAt(c.root.position.clone().add(focus));camera.updateMatrixWorld(true);
 if(t>=4.8&&kevinShinjukuScreamComplete())beginKevinShinjukuAftermath();
}
function beginKevinShinjukuAftermath(){
 const b=beforeStoryScene.shinjuku;b.aftermath={phase:'departure',time:0};b.takeshi.visible=false;document.getElementById('beforeStoryCount').textContent='SHINJUKU / 2004';document.getElementById('beforeStoryLine').textContent='';for(const mouth of Object.values(b.mouths)){mouth.open.visible=false;mouth.closed.visible=true;}
 renderKevinShinjukuAftermath(0);
}
function renderKevinShinjukuAftermath(dt){
 if(beforeStoryScene.shinjuku.takeshiSpeech){renderTakeshiShinjukuSpeech(dt);return;}
 const c=beforeStoryScene,b=c.shinjuku,a=b.aftermath;a.time+=dt;const next=document.getElementById('beforeStoryNext');next.disabled=true;next.textContent='…';
 if(a.phase==='departure'){
  const run=THREE.MathUtils.clamp(a.time/3.6,0,1);b.takeshi.visible=false;b.yakuza.position.set(-1.3-12.7*run,0,1.5-4*run);b.yakuza.rotation.y=Math.atan2(-12.7,-4);animateCharacter(b.time*2.4,true,false,b.yakuza);b.knife.rotation.set(.65,0,0);
  document.getElementById('beforeStorySpeaker').textContent='KEVIN MURDERHORN / BC-01';
  if(a.time>=3.6){b.yakuza.visible=false;a.phase='arrival';a.time=0;b.takeshi.visible=true;}
 }
 if(a.phase==='arrival'){
  // The attacker is hidden before Takeshi enters; the two are never visible together.
  b.yakuza.visible=false;b.takeshi.visible=true;const approach=THREE.MathUtils.smoothstep(a.time,0,2.8);b.takeshi.position.set(1.6-.2*approach,0,-10+10.8*approach);b.takeshi.rotation.y=approach<1?Math.atan2(-.2,10.8):Math.atan2(b.kevin.position.x-b.takeshi.position.x,b.kevin.position.z-b.takeshi.position.z);animateCharacter(b.time,approach<1,false,b.takeshi);
  document.getElementById('beforeStorySpeaker').textContent='TAKESHI JUKO';
 }
 const reveal=a.phase==='arrival'?THREE.MathUtils.smoothstep(a.time,1.4,2.8):0,eye=new THREE.Vector3(4.2-7*reveal,2.8-.4*reveal,4.5-.7*reveal),focus=new THREE.Vector3(.6,1.3,a.phase==='departure'?.2:-1.5+1.7*THREE.MathUtils.smoothstep(a.time,0,2.8));camera.up.set(0,1,0);camera.position.copy(c.root.position).add(eye);camera.lookAt(c.root.position.clone().add(focus));camera.updateMatrixWorld(true);
 if(a.phase==='arrival'&&a.time>=3.4){b.takeshiSpeech={line:0,beat:0};showTakeshiShinjukuLine();renderTakeshiShinjukuSpeech(0);}
}
function showTakeshiShinjukuLine(){
 const b=beforeStoryScene.shinjuku,s=b.takeshiSpeech;s.beat=0;s.timeline=beforeStorySpeechTimeline(TAKESHI_SHINJUKU_LINES[s.line]);document.getElementById('beforeStorySpeaker').textContent='TAKESHI JUKO';document.getElementById('beforeStoryLine').textContent=TAKESHI_SHINJUKU_LINES[s.line];document.getElementById('beforeStoryCount').textContent=(s.line+1)+' / '+TAKESHI_SHINJUKU_LINES.length;document.getElementById('beforeStoryNext').disabled=false;document.getElementById('beforeStoryNext').textContent=s.line===TAKESHI_SHINJUKU_LINES.length-1?'FINISH CHAPTER →':'CONTINUE →';
}
function renderTakeshiShinjukuSpeech(dt){
 const c=beforeStoryScene,b=c.shinjuku,s=b.takeshiSpeech;s.beat+=dt;b.yakuza.visible=false;b.takeshi.visible=true;animateCharacter(b.time,false,false,b.takeshi);
 const level=takeshiShinjukuVoiceLevel();
 for(const [id,mouth] of Object.entries(b.mouths)){const speaking=id==='takeshi'?level:0;mouth.open.visible=speaking>.04;mouth.open.scale.set(mouth.width,.006+speaking*.025,.009);mouth.closed.visible=!mouth.open.visible;if(mouth.actor.userData.openMouth)mouth.actor.userData.openMouth.visible=false;}
 b.takeshi.userData.arms[1].rotation.x=-.25-level*.3;
 camera.up.set(0,1,0);camera.position.copy(c.root.position).add(new THREE.Vector3(-3.2,2.6,-1.8));camera.lookAt(c.root.position.clone().add(new THREE.Vector3(.9,1.6,.3)));camera.updateMatrixWorld(true);
 if(takeshiShinjukuLineComplete(dt))advanceKevinShinjuku();
}
function renderKevinShinjuku(dt){
 const c=beforeStoryScene,b=c?.shinjuku;if(!b)return;dt=Math.min(.1,Math.max(0,dt));b.time+=dt;if(b.aftermath){renderKevinShinjukuAftermath(dt);return;}if(b.attack){renderKevinShinjukuStab(dt);return;}b.beat+=dt;const progress=THREE.MathUtils.smoothstep(b.beat,0,3.5),walk=b.line<2;
 b.kevin.position.set(0,0,b.line===0?3.5-progress*1.2:b.line===1?2.3-progress*2:b.line===2?.3:b.line===3?.3-progress*.4:-.1);b.kevin.rotation.y=b.line<2?Math.PI:-1.12;
 b.yakuza.position.set(b.line<2?-10:b.line===2?-10+progress*8.7:-1.3,0,1.5);b.yakuza.rotation.y=Math.atan2(b.kevin.position.x-b.yakuza.position.x,b.kevin.position.z-b.yakuza.position.z);
 animateCharacter(b.time,walk,false,b.kevin);animateCharacter(b.time,b.line===2&&progress<1,false,b.yakuza);b.yakuza.userData.arms[1].rotation.x=b.line<2?0:-.5;b.knife.rotation.set(0,0,0);
 if(b.line>=3)for(const [i,arm] of b.kevin.userData.arms.entries()){arm.rotation.x=-.8;arm.rotation.z=(i?1:-1)*.55;}
 for(const [id,mouth] of Object.entries(b.mouths)){const level=kevinShinjukuVoiceLevel(id);mouth.open.visible=level>.04;mouth.open.scale.set(mouth.width,.006+level*.025,.009);mouth.closed.visible=!mouth.open.visible;if(mouth.actor.userData.openMouth)mouth.actor.userData.openMouth.visible=false;}
 const eye=b.line===0?new THREE.Vector3(6-progress*1.5,4.3-progress,10):b.line===1?new THREE.Vector3(3.4,2.4,5.5):b.line===2?new THREE.Vector3(3.7,2.65,5.1):b.line===3?new THREE.Vector3(-2.7,2.2,4.4):new THREE.Vector3(2.5,2.35,4.7),target=b.line<2?new THREE.Vector3(0,1.5,b.kevin.position.z):new THREE.Vector3(-.65,1.6,.7);camera.up.set(0,1,0);camera.position.copy(c.root.position).add(eye);camera.lookAt(c.root.position.clone().add(target));camera.updateMatrixWorld(true);
 if(kevinShinjukuLineComplete(dt))advanceKevinShinjuku();
}
document.getElementById('beforeStoryShinjuku').onclick=startKevinShinjuku;
const kevinShinjukuPreviousNext=document.getElementById('beforeStoryNext').onclick;document.getElementById('beforeStoryNext').onclick=()=>mode==='beforeStoryShinjuku'?advanceKevinShinjuku():kevinShinjukuPreviousNext();
const kevinShinjukuPreviousReturn=document.getElementById('beforeStoryReturn').onclick;document.getElementById('beforeStoryReturn').onclick=()=>mode==='beforeStoryShinjuku'?returnKevinShinjuku():kevinShinjukuPreviousReturn();
const kevinShinjukuPreviousClear=clearBeforeStoryMenu;clearBeforeStoryMenu=function(){clearKevinShinjuku();kevinStoryCast.hidden=true;closeBeforeStoryKevinChapters();kevinShinjukuPreviousClear();};
document.addEventListener('keydown',e=>{if(e.repeat||!beforeStoryEraseDialog.hidden)return;if(mode==='beforeStoryShinjuku'&&['Enter','Escape'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();if(e.code==='Enter')advanceKevinShinjuku();else returnKevinShinjuku();}else if(mode==='beforeStoryMenu'&&e.code==='Escape'&&!beforeStoryKevinChapters.hidden){e.preventDefault();e.stopImmediatePropagation();document.getElementById('beforeStoryKevinBack').click();}},true);
