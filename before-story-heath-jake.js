/* Chris's cast and narration belong only to his independent character story. */
function heathSign(text,color,bg,width){const object=sign(text,color,bg,width),canvas=object.material.map.image,ctx=canvas.getContext('2d');ctx.setTransform(2,0,0,2,0,0);ctx.fillStyle=bg;ctx.fillRect(0,0,512,128);ctx.strokeStyle=color;ctx.lineWidth=4;ctx.strokeRect(6,6,500,116);ctx.fillStyle=color;ctx.font='bold 38px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,64,470);object.material.map.needsUpdate=true;return object;}
const HEATH_CHRIS_INTRO_LINES=[
 'Dagenham, 2019. Before Brent Cross, before the uniforms became banners for a civil war, I was a police officer trying to keep ordinary people safe. That night, the calls from the Heath would not stop.',
 'People were frightened to walk home. Shopkeepers pulled their shutters down early, and families kept their children away from the streets after dark. Every witness had a different story, but the same fear.',
 'The group behind it wore black hoodies, tracksuits and balaclavas. They moved together, threatened anyone who spoke up, and mistook the silence they left behind for respect.',
 'One name kept turning up: Jake Stevens. On his tracks he called himself Kilo2Trappy. On the Heath, he wanted that name to sound like an order nobody could refuse.',
 'I had heard his music. The problem was not what he rapped about. The problem was the people being hurt while he tried to turn his reputation into control of the streets.',
 'Our brief was straightforward: enter the Heath, support the officers already there, and stop the attacks. Straightforward on paper. On the ground, we knew some of his men were armed.',
 'I checked my weapon, counted my medical supplies, and looked at the officers beside me. They were tired, but they were ready. None of us had come there to leave someone else facing it alone.',
 'We would have to move carefully. A balaclava did not make a man invincible, and a police badge did not make us bulletproof. Cover, clear sightlines, and keeping the team together would matter.',
 'Jake wanted an audience. He wanted a confrontation he could turn into another story about himself. I wanted the streets quiet enough for the people living there to sleep.',
 'So we went in. First, we would break up the group terrorising the Heath. Then I would face Jake Stevens myself. He could keep the stage name. He was still going to answer for what he had done.'
];
const HEATH_JAKE_QUOTES=[
 'Oi, fed! Jake Stevens on your paperwork, Kilo2Trappy round here. Learn the name before you start chatting.',
 'Look at you, bruv. Plastic helmet, shiny badge, thinking that makes you the hardest man on the Heath.',
 'I put threats in my bars and back them on the street. You put yours in a report nobody reads.',
 'My mandem are watching, Pinter. You reckon I am letting you embarrass me in my own ends?',
 'Allow the hero act. These streets do not clap for you, and neither will I.',
 'You brought the whole station and you are still backing off. That is proper embarrassing, fam.',
 'Keep moving, fed. Stand still for a second and that uniform is getting folded.',
 'Your badge does not run this postcode. I do. Come closer if you need that explained.',
 'You want me in cuffs? Come earn it, bruv. Stop hiding behind your mates.',
 'Nah, I am not finished! Kilo2Trappy does not bow out because some fed thinks the show is over!'
];

function makeBeforeStoryJake(){
 const root=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group(),arms=[],legs=[];root.add(body);body.add(head);head.position.y=2.08;
 root.name='Jake Stevens / Kilo2Trappy / BC-02';const purple=mat(0x514e89),seam=mat(0x303152),skin=mat(0xeeb987),ink=mat(0x101116),trousers=mat(0x252529),shoe=mat(0xe4e6df),grey=mat(0x68736e);
 ball(body,.36,.50,.25,purple,0,1.22,0);box(body,.57,.16,.42,purple,0,.88,0);
 for(const y of [.96,1.16,1.37])line3(body,[[-.31,y,.13],[-.20,y-.015,.24],[0,y-.025,.258],[.20,y-.015,.24],[.31,y,.13]],seam,.012);
 mesh(new THREE.CylinderGeometry(.14,.17,.20,20),purple,body,0,1.74,0);line3(body,[[0,1.64,.18],[0,1.78,.15]],ink,.012);box(body,.012,.72,.025,seam,0,1.23,.255);
 for(const side of [-1,1]){const arm=new THREE.Group();body.add(arm);arm.position.set(side*.35,1.49,0);ball(arm,.16,.23,.16,purple,0,-.18,0);ball(arm,.15,.22,.14,purple,0,-.48,.015);line3(arm,[[-.13,-.36,.08],[0,-.38,.15],[.13,-.36,.08]],seam,.012);ball(arm,.12,.13,.11,ink,0,-.69,.025);arms.push(arm);
 const leg=new THREE.Group();root.add(leg);leg.position.set(side*.16,.84,0);box(leg,.26,.73,.28,trousers,0,-.35,0);for(const offset of [-.025,.025])line3(leg,[[side*.12+offset,-.05,.15],[side*.12+offset,-.67,.15]],ink,.006);ball(leg,.17,.105,.27,shoe,0,-.75,.075);line3(leg,[[-.13,-.70,.19],[0,-.65,.26],[.13,-.70,.19]],grey,.018);box(leg,.29,.035,.39,grey,0,-.825,.07);legs.push(leg);}
 ball(head,.12,.15,.11,skin,0,-.34,0);ball(head,.31,.39,.28,skin);ball(head,.25,.21,.25,skin,0,-.20,.03);
 const scalp=mesh(new THREE.SphereGeometry(1,24,16,0,TAU,0,1.48),ink,head,0,.015,-.055);scalp.scale.set(.325,.405,.275);
 for(let i=0;i<9;i++){const tuft=mesh(new THREE.ConeGeometry(.052,.15,4),ink,head,-.23+i*.054,.38+Math.sin(i*.5)*.035,-.04);tuft.rotation.z=-.42;}
 for(const side of [-1,1]){ball(head,.059,.09,.05,skin,side*.31,-.03,0);ball(head,.105,.045,.023,shoe,side*.128,.025,.263);ball(head,.025,.030,.016,ink,side*.128+.026,.023,.286);ball(head,.107,.025,.024,skin,side*.128,.067,.273);line3(head,[[side*.128-.074,.137,.24],[side*.128,.15,.258],[side*.128+.074,.136,.24]],ink,.014);}
 ball(head,.046,.083,.065,skin,0,-.07,.28);const mouth=line3(head,[[-.11,-.20,.251],[-.02,-.227,.286],[.085,-.216,.262]],ink,.009);
 Object.assign(root.userData,{body,head,arms,legs,mouth,beforeStoryCode:'BC-02',year:2019});return isolateBeforeStoryModel(root);
}

const heathCast=document.createElement('div');heathCast.id='beforeStoryHeathCast';heathCast.className='before-story-cast';heathCast.hidden=true;
heathCast.innerHTML='<button id="heathSelectChris" type="button">BC-01 · CHRIS PINTER</button><button id="heathSelectJake" type="button">BC-02 · JAKE “KILO2TRAPPY” STEVENS</button>';
document.querySelector('.before-story-profile').appendChild(heathCast);
const heathCastPreviousSelect=selectBeforeStoryCast;
selectBeforeStoryCast=function(id){
 if(id!=='jake'){heathCastPreviousSelect(id);heathCast.hidden=id!=='chris';if(id==='chris'){beforeStoryScene.actor.userData.beforeStoryCode='BC-01';document.getElementById('beforeStoryCode').textContent='BC-01 / YEAR 2019';document.getElementById('heathSelectChris').setAttribute('aria-pressed','true');document.getElementById('heathSelectJake').setAttribute('aria-pressed','false');}return;}
 const c=beforeStoryScene;if(!c||mode!=='beforeStoryMenu')return;c.story='chris';if(!c.cast.jake){c.cast.jake=makeBeforeStoryJake();c.root.add(c.cast.jake);}for(const [key,a] of Object.entries(c.cast)){a.visible=key==='jake';a.position.set(0,0,0);}if(c.crownMenu)c.crownMenu.visible=false;c.actor=c.cast.jake;
 document.querySelector('.before-story-profile>.before-story-cast').hidden=true;heathCast.hidden=false;document.getElementById('beforeStoryChapters').hidden=true;document.getElementById('beforeStoryJosiah').setAttribute('aria-expanded','false');
 document.getElementById('beforeStoryCode').textContent='BC-02 / YEAR 2019';document.getElementById('beforeStoryName').textContent='JAKE STEVENS';document.getElementById('beforeStoryAlignment').textContent='KILO2TRAPPY / THE HEATH';document.getElementById('beforeStoryProfileText').textContent='A rapper and leader of the roadmen on the Heath in Dagenham. Known as Kilo2Trappy, he uses intimidation and armed followers to control the streets. Encountered by Chris Pinter in 2019.';
 document.getElementById('heathSelectChris').setAttribute('aria-pressed','false');document.getElementById('heathSelectJake').setAttribute('aria-pressed','true');renderBeforeStoryMenu(0);syncMenuSong();
};
document.getElementById('heathSelectChris').onclick=()=>selectBeforeStoryCast('chris');document.getElementById('heathSelectJake').onclick=()=>selectBeforeStoryCast('jake');

function buildHeathNarrationRoom(){
 const c=beforeStoryScene,r=new THREE.Group();r.name='Chris Pinter / empty narration room';c.root.add(r);c.heathNarrationSet=r;const wall=mat(0x25353c),wood=mat(0x472a22),brass=mat(0xb2965c);
 box(r,18,.25,18,wood,0,-.2,0);box(r,18,6,.4,wall,0,2.8,-6);for(const x of [-9,9])box(r,.4,6,18,wall,x,2.8,0);box(r,18,.25,18,mat(0x101822),0,5.9,0);
 for(let x=-8;x<=8;x+=2)box(r,.04,5,.06,brass,x,2.4,-5.7);box(r,4,.18,1.8,wood,0,1.1,0);for(const x of [-1.65,1.65])for(const z of [-.65,.65])box(r,.12,1.1,.12,wood,x,.5,z);
 const dossier=heathSign('DAGENHAM / 2019 / THE HEATH','#e2d9ba','#25343b',6);dossier.position.set(0,3.2,-5.5);r.add(dossier);box(r,1.3,.05,1,mat(0x3b4c69),-.8,1.23,.1);box(r,1.1,.02,.85,mat(0xe3d7b5),-.8,1.27,.1);
 const board=new THREE.Group();board.position.set(3,2.9,-5.45);r.add(board);box(board,2.1,1.6,.15,mat(0x121d25));for(const x of [-.65,0,.65])box(board,.04,1.3,.02,brass,x,0,.09);for(const y of [-.45,0,.45])box(board,1.9,.035,.02,brass,0,y,.09);for(const [x,y] of [[0,.4],[-.6,-.3],[.6,0]])ball(board,.065,.065,.025,mat(0x6e348d),x,y,.12);
 for(const x of [-6,6])box(r,1.6,2.6,1.1,mat(0x354049),x,1.25,-4.5);const lamp=new THREE.PointLight(0xffddab,24,12);lamp.position.set(-2,3,3);r.add(lamp);const rim=new THREE.PointLight(0x719edb,18,14);rim.position.set(3,4,-4);r.add(rim);
}
function startHeathNarration(){
 const c=beforeStoryScene;if(!c||mode!=='beforeStoryMenu')return;clearBeforeStoryHeath();stopBeforeStoryVoice();c.story='chris';c.chapter='chrisHeath';c.heathIntro={line:0,beat:0};
 for(const a of Object.values(c.cast))a.visible=false;if(c.crownMenu)c.crownMenu.visible=false;for(const key of ['menuSet','romeSet','jukoSet','lastJukoSet'])if(c[key])c[key].visible=false;
 if(!c.heathNarrationSet)buildHeathNarrationRoom();c.heathNarrationSet.visible=true;beforeStoryUI.hidden=true;beforeStoryCinema.hidden=false;setMode('beforeStoryHeathIntro');hideUndeadCampaignCast();world.visible=upperWorld.visible=flash.visible=false;keys.clear();scene.background.setHex(0x101822);scene.fog.color.setHex(0x101822);scene.fog.density=.02;ambient.intensity=.75;cameraFill.intensity=.4;
 document.getElementById('beforeStoryCinemaChapter').textContent='BEFORE THE STORY / CHRIS PINTER / CHAPTER 1';document.getElementById('beforeStoryCinemaTitle').innerHTML='INSURRECTION OF THE HEATH <span>2019</span>';showHeathNarrationLine();renderHeathNarration(0);syncMenuSong();
}
function showHeathNarrationLine(){const intro=beforeStoryScene.heathIntro;intro.beat=0;intro.duration=beforeStorySpeechTimeline(HEATH_CHRIS_INTRO_LINES[intro.line]).duration+1.3;document.getElementById('beforeStorySpeaker').textContent='CHRIS PINTER / BC-01 / NARRATION';document.getElementById('beforeStoryLine').textContent=HEATH_CHRIS_INTRO_LINES[intro.line];document.getElementById('beforeStoryCount').textContent=(intro.line+1)+' / 10';document.getElementById('beforeStoryNext').textContent=intro.line===9?'ENTER THE HEATH →':'CONTINUE →';playHeathChrisVoice();}
function advanceHeathNarration(){const c=beforeStoryScene;if(mode!=='beforeStoryHeathIntro'||!c)return;stopHeathChrisVoice();if(c.heathIntro.line===9){c.heathIntro=null;c.heathNarrationSet.visible=false;startBeforeStoryHeath();return;}c.heathIntro.line++;showHeathNarrationLine();}
function renderHeathNarration(dt){const c=beforeStoryScene;if(!c?.heathIntro)return;c.time+=dt;c.heathIntro.beat+=dt;camera.up.set(0,1,0);camera.position.copy(c.root.position).add(new THREE.Vector3(Math.sin(c.time*.1)*.2,2.4,5.2));camera.lookAt(c.root.position.clone().add(new THREE.Vector3(0,1.8,-2)));camera.updateMatrixWorld(true);if(heathChrisLineComplete(dt))advanceHeathNarration();}
const heathNextPrevious=document.getElementById('beforeStoryNext').onclick;document.getElementById('beforeStoryNext').onclick=()=>mode==='beforeStoryHeathIntro'?advanceHeathNarration():heathNextPrevious();
const heathReturnPrevious=document.getElementById('beforeStoryReturn').onclick;document.getElementById('beforeStoryReturn').onclick=()=>{if(mode==='beforeStoryHeathIntro'){beforeStoryScene.heathIntro=null;beforeStoryScene.heathNarrationSet.visible=false;returnBeforeStoryHeath();}else heathReturnPrevious();};
document.addEventListener('keydown',e=>{if(mode!=='beforeStoryHeathIntro'||e.repeat)return;if(e.code==='Enter'){e.preventDefault();advanceHeathNarration();}if(e.code==='Escape'){e.preventDefault();document.getElementById('beforeStoryReturn').click();}});

const heathBossHUD=document.createElement('section');heathBossHUD.id='heathBossHUD';heathBossHUD.hidden=true;heathBossHUD.innerHTML='<small>BC-02 / THE HEATH</small><h3>JAKE STEVENS <span>“KILO2TRAPPY”</span></h3><div><i id="heathBossBar"></i></div><b id="heathBossHP"></b>';
heathHUD.appendChild(heathBossHUD);const heathBossDialogue=document.createElement('section');heathBossDialogue.id='heathBossDialogue';heathBossDialogue.hidden=true;heathBossDialogue.innerHTML='<small>JAKE “KILO2TRAPPY” STEVENS / BC-02</small><p id="heathJakeLine"></p>';heathHUD.appendChild(heathBossDialogue);
const heathStartPrevious=startBeforeStoryHeath;
startBeforeStoryHeath=function(){heathStartPrevious();const b=beforeStoryScene?.heath;if(!b||b.jake)return;b.hero.userData.beforeStoryCode='BC-01';b.hero.name='Chris Pinter / BC-01 / Dagenham 2019';const actor=makeBeforeStoryJake();actor.position.set(0,0,-49);actor.visible=false;b.root.add(actor);b.jake={actor,hp:5000,maxHP:5000,active:false,isBoss:true,gun:true,fire:1,path:[],pathTime:0,attack:0,attackIndex:0,quoteIndex:0,quoteBeat:0};b.jake.flash=finaleGun(actor);b.jake.flash.visible=false;b.jake.speech=makeBeforeStorySpeechMouth('jake',actor);b.enemies.push(b.jake);heathBossHUD.hidden=heathBossDialogue.hidden=true;document.querySelector('.heath-reticle').textContent='+';renderBeforeStoryHeath(0);};
document.getElementById('heathRetry').onclick=startBeforeStoryHeath;document.getElementById('beforeStoryHeath').onclick=startHeathNarration;
function checkHeathJakePhase(){const b=beforeStoryScene?.heath,j=b?.jake;if(!j||j.active||b.ended||b.enemies.some(e=>!e.isBoss&&e.hp>0))return;j.active=true;j.actor.visible=true;b.hp=Math.min(100,b.hp+35);b.medkits++;j.quoteIndex=0;j.quoteBeat=0;j.timeline=beforeStorySpeechTimeline(HEATH_JAKE_QUOTES[0]);document.getElementById('heathJakeLine').textContent=HEATH_JAKE_QUOTES[0];heathBossHUD.hidden=heathBossDialogue.hidden=false;document.querySelector('#beforeStoryHeathHUD header p').textContent='DEFEAT JAKE STEVENS · SUPPORT THE POLICE';playHeathJakeVoice();}
function renderHeathJake(dt){
 const b=beforeStoryScene?.heath,j=b?.jake;if(!j)return;checkHeathJakePhase();if(j.active&&j.hp>0&&!b.paused&&!b.ended){
 j.quoteBeat+=dt;if(j.timeline&&heathJakeQuoteComplete(dt)){j.quoteIndex++;j.quoteBeat=0;j.timeline=j.quoteIndex<HEATH_JAKE_QUOTES.length?beforeStorySpeechTimeline(HEATH_JAKE_QUOTES[j.quoteIndex]):null;heathBossDialogue.hidden=!j.timeline;if(j.timeline){document.getElementById('heathJakeLine').textContent=HEATH_JAKE_QUOTES[j.quoteIndex];playHeathJakeVoice();}else stopHeathJakeVoice();}
 const level=heathJakeVoiceLevel(),m=j.speech;m.open.visible=level>.04;m.open.scale.set(m.width,.006+level*.027,.009);m.closed.visible=!m.open.visible;
 const targets=[{position:b.position,player:true},...b.police.filter(p=>p.hp>0).map(p=>({position:p.actor.position,unit:p}))].sort((a,z)=>j.actor.position.distanceTo(a.position)-j.actor.position.distanceTo(z.position)),target=targets[0],delta=target.position.clone().sub(j.actor.position),distance=delta.length();j.actor.rotation.y=Math.atan2(delta.x,delta.z);j.fire-=dt;j.attack=Math.max(0,j.attack-dt);j.shot=Math.max(0,(j.shot||0)-dt);
 const rushing=j.attackIndex%3===1;animateCharacter(b.time,distance>(rushing?1.9:10),rushing,j.actor);j.actor.userData.arms[1].rotation.x=j.attack>0?-1.5:-1.25;if(distance>(rushing?1.9:10))heathChase(j,target.position,dt,rushing?5:3);
 if(j.fire<=0&&distance<(rushing?2.5:25)){const from=j.actor.position.clone().add(new THREE.Vector3(0,1.3,0)),to=target.position.clone().add(new THREE.Vector3(0,1.3,0));if(heathSight(from,to)){j.fire=rushing?1.5:1.1;j.attack=.35;if(!rushing){j.shot=.08;heathTracer(from,to,0x9f77df);}if(target.player)heathDamage(rushing?12:8);else heathHit(target.unit,rushing?12:8);j.attackIndex++;}}j.flash.visible=j.shot>0;
 }
 if(j.hp<=0||b.ended){heathBossDialogue.hidden=true;j.flash.visible=false;j.speech.open.visible=false;j.speech.closed.visible=true;}heathBossHUD.hidden=!j.active;document.getElementById('heathBossHP').textContent=j.hp+' / '+j.maxHP+' HP';document.getElementById('heathBossBar').style.width=j.hp/j.maxHP*100+'%';
}
const heathCleanupPrevious=clearBeforeStoryHeath;clearBeforeStoryHeath=function(){heathCleanupPrevious();heathBossHUD.hidden=heathBossDialogue.hidden=true;};
const heathFinishPrevious=finishBeforeStoryHeath;finishBeforeStoryHeath=function(won){heathFinishPrevious(won);renderHeathJake(0);};
