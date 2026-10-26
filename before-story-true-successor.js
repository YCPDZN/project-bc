/* Josiah's final personal chapter; campaign saves and actors are never used. */
try{beforeStoryProgress.trueSuccessorCompleted=JSON.parse(localStorage.getItem(BEFORE_STORY_SAVE_KEY))?.trueSuccessorCompleted===true;}catch(error){beforeStoryProgress.trueSuccessorCompleted=false;}
const TRUE_SUCCESSOR_NARRATION=[
 'Three years have passed since Boki died. In England, my wife Emma welcomed our two children into the world. Their arrival gave me a future to care for, but it did not erase what I had done. I returned to the task I should never have abandoned: finding Tajiri, the orphaned son of Takeshi Juko. I could not undo Boki’s death. I could at least stop pretending that my remorse was enough.',
 'In time, the name surfaced again. Tajiri Juko. The true successor. Others spoke of an inheritance; I thought of the empty places around his family table. I had made one of them. Whatever he had become, I would have to face him myself.',
 'Kevin Murderhorn offered to come with me. The Juko name meant something very different to him. I did not ask him to forget it, and I did not mistake our agreement for forgiveness. We had a common purpose, and for this encounter he would stand beside me.',
 'I still carried the golden chains. There was no honest way to call myself innocent simply because I now disliked what I could do with them. Order required limits, including limits on the man who claimed to impose it. I had failed that test once.',
 'I would face Tajiri with Kevin at my side. I would answer for Boki, and I would stop the power she had awakened from claiming another life. I could not promise a clean ending. I could promise that I would no longer hide behind Union Crown.'
];
const TRUE_SUCCESSOR_COMBAT_LINES=[
 "Richards! My aunt spent her life searching for me, and you ended hers with those filthy golden chains!",
 "Murderhorn! You murdered Bozuki, and now you stand beside the bastard who killed Boki. Look at the company you keep!",
 "You took my aunt. You took my uncle. Did either of you imagine their family would simply forget?",
 "Do not speak to me about restraint, Josiah! Boki is dead, and you are still holding the weapon that killed her!",
 "Kevin, look at me when I say his name. Bozuki Juko. You will not hide behind that mask while I remember him!",
 "The sky is wide enough for both of you to run. Go on! I want to see which murderer abandons the other first!",
 "You call yourself lawful now, Richards? Did you change the rules after you finished killing my aunt?",
 "Bozuki deserved to face what he had done. You gave him death, Murderhorn. Do not dress that up as justice!",
 "Boki promised she would find me. You silenced that promise. I will make you hear her name with every blow!",
 "I am Tajiri Juko! I will drag both of you out of this sky before I let you bury my family beneath another excuse!"
];
const TRUE_SUCCESSOR_ENDING=[
 ['JOSIAH RICHARDS','ALMIGHTY HEAVEN! Hear me above the clouds, where there is no throne to shelter behind and no wall to conceal what we have done. I raise these hands with the weight of every life they have taken, and I call this power forth one final time.'],
 ['JOSIAH RICHARDS','Tajiri, your grief was real. Your anger had a name, a face, a family it could no longer return to. But you made the whole world answer for that grief, and I cannot allow another generation to inherit the ruin we have left behind.'],
 ['JOSIAH RICHARDS','I killed Boki. There is no title I can claim, no duty I can recite, that will turn those words into something clean. She wanted to find you, and I took that chance from her; I will carry that truth long after the fire below us has gone cold.'],
 ['JOSIAH RICHARDS','Kevin killed Bozuki, and you came into this sky demanding that we remember him. We remember. But remembering the dead cannot become permission to keep adding names to their number, until the living have nothing left to do but avenge one another.'],
 ['JOSIAH RICHARDS','Your father left an orphan behind him. Boki saw a child worth searching for; the world saw an inheritance worth fighting over. Somewhere between those two things, you were taught that power could give you back a family, and it lied to you as surely as it lied to me.'],
 ['JOSIAH RICHARDS','Kevin, stand clear. Whatever brought us here, this judgment leaves my hands, and I will not ask you to bear it for me. Let the heavens witness who summoned these flames, so that I cannot spend the rest of my life pretending the choice belonged to someone else.'],
 ['JOSIAH RICHARDS','These chains were offered to me as an answer to every uncertainty. Pull hard enough, I was told, and nations would become still. Yet every time I tightened my grip, another human voice disappeared beneath the sound of my own certainty.'],
 ['JOSIAH RICHARDS','Heaven, bear witness to the man beneath the power. I am frightened of what I can do, and more frightened of how easily I once called it necessary. If I survive this day, let that fear remain, so that I never again mistake obedience for peace.'],
 ['JOSIAH RICHARDS','Tajiri Juko, your name will not vanish with you into these flames. Neither will Boki’s, nor the promise she died trying to keep. I cannot offer you the forgiveness I have not earned; I can only refuse to let your family become another story I rewrite to absolve myself.'],
 ['JOSIAH RICHARDS','It is finished. The sky is silent again, but silence is not innocence, and victory is not forgiveness. Emma, our children, the life waiting for me in England—I must return to them as a man who remembers what these hands have done, not as a god who believes he can do no wrong.']
];
const successorAllyCaption=document.createElement('p');successorAllyCaption.id='unionAllyCaption';successorAllyCaption.textContent='KEVIN MURDERHORN / ALLIED';successorAllyCaption.style.color='#ffd66b';successorAllyCaption.hidden=true;unionFightUI.querySelector('header').appendChild(successorAllyCaption);
const successorCard=document.createElement('article');successorCard.className='before-story-next-chapter';successorCard.innerHTML='<small>FINAL CHAPTER / CHAPTER 5</small><h2>THE TRUE SUCCESSOR</h2><p>An aerial confrontation with Tajiri Juko.<br>Kevin Murderhorn fights alongside Josiah.</p><button id="beforeStoryTrueSuccessor" type="button" disabled>LOCKED · COMPLETE CHAPTER 4</button>';
document.getElementById('beforeStoryChapterBack').before(successorCard);
const successorPreviousRefresh=refreshBeforeStoryChapters;
refreshBeforeStoryChapters=function(){successorPreviousRefresh();const b=document.getElementById('beforeStoryTrueSuccessor');b.disabled=!beforeStoryProgress.unionCrownCompleted;b.textContent=b.disabled?'LOCKED · COMPLETE CHAPTER 4':beforeStoryProgress.trueSuccessorCompleted?'REPLAY FINAL CHAPTER →':'BEGIN CHAPTER 5 →';};
const tajiriCastButton=document.createElement('button');tajiriCastButton.type='button';tajiriCastButton.dataset.beforeCast='tajiri';tajiriCastButton.textContent='BC-05 · TAJIRI JUKO';tajiriCastButton.setAttribute('aria-pressed','false');document.querySelector('.before-story-cast').appendChild(tajiriCastButton);
const josiahKevinCastButton=document.createElement('button');josiahKevinCastButton.type='button';josiahKevinCastButton.dataset.beforeCast='kevinMasked';josiahKevinCastButton.textContent='BC-06 · KEVIN MURDERHORN';josiahKevinCastButton.setAttribute('aria-pressed','false');tajiriCastButton.after(josiahKevinCastButton);josiahKevinCastButton.onclick=()=>selectBeforeStoryCast('kevinMasked');

function makeTrueSuccessorTajiri(){
 const actor=makeBeforeStoryJones(),u=actor.userData,old=u.head;old.removeFromParent();disposeCampObject(old);actor.name='BC-05 / Tajiri Juko / The True Successor';
 actor.traverse(o=>{for(const m of [].concat(o.material||[])){const color=m.color?.getHex();if([0xc79a69,0x191112,0xe5e0d8,0xf0eee7].includes(color))m.color.setHex(0x100b0b);if(color===0xc22229)o.visible=false;}});
 const skin=mat(0xedbd87),hair=mat(0x24100e),ink=mat(0x17100e),white=mat(0xe9e3d5),head=new THREE.Group();head.position.y=2.08;u.body.add(head);
 ball(head,.11,.15,.11,skin,0,-.35,0);ball(head,.31,.37,.27,skin,0,0,0);ball(head,.25,.20,.25,skin,0,-.20,.03);ball(head,.34,.42,.27,hair,0,.01,-.14);
 for(const side of [-1,1]){
  for(let i=0;i<6;i++){const lock=ball(head,.095,.15,.09,hair,side*(.30+.025*Math.sin(i*1.7)),.12-i*.13,-.03);lock.rotation.z=side*Math.sin(i)*.20;}
  ball(head,.08,.085,.052,skin,side*.29,-.035,.035);ball(head,.085,.055,.025,white,side*.125,.01,.25);ball(head,.027,.035,.014,ink,side*.125+.02,.005,.28);
  line3(head,[[side*.125-.07,.034,.279],[side*.125+.07,.034,.279]],ink,.008);line3(head,[[side*.125-.07,.13+side*.035,.25],[side*.125+.07,.13-side*.035,.25]],hair,.008);
 }
 ball(head,.04,.075,.045,skin,.014,-.08,.27);const mouth=line3(head,[[-.09,-.205,.251],[0,-.235,.28],[.10,-.205,.248]],ink,.01);
 for(const x of [-.048,.045]){const tooth=mesh(new THREE.ConeGeometry(.022,.05,3),white,head,x,-.236,.28);tooth.rotation.z=Math.PI;}
 const hat=new THREE.Group();hat.name='Studded charcoal tricorn';head.add(hat);const felt=mat(0x292a2a),rim=mat(0x777979),stud=mat(0xc8cbca,.35);
 ball(hat,.39,.20,.30,felt,0,.39,-.01);const brim=mesh(new THREE.CylinderGeometry(.54,.54,.045,32),felt,hat,0,.25,0);brim.scale.set(1.25,1,.75);
 const shape=new THREE.Shape();shape.moveTo(-.64,.31);shape.bezierCurveTo(-.57,.50,-.28,.52,-.12,.49);shape.bezierCurveTo(.03,.71,.43,.62,.49,.34);shape.bezierCurveTo(.52,.30,.56,.56,.66,.48);shape.lineTo(.59,.19);shape.bezierCurveTo(.34,.15,.07,.18,-.12,.22);shape.bezierCurveTo(-.32,.14,-.52,.12,-.64,.31);
 const wing=mesh(new THREE.ExtrudeGeometry(shape,{depth:.035,bevelEnabled:false,curveSegments:18}),felt,hat,0,0,.24);wing.name='Raised tricorn brim';
 line3(hat,[[-.64,.31,.284],[-.57,.41,.284],[-.40,.47,.284],[-.22,.48,.284],[-.12,.49,.284]],rim,.012);
 line3(hat,[[-.12,.49,.284],[-.03,.58,.284],[.16,.62,.284],[.35,.56,.284],[.45,.43,.284],[.49,.28,.284],[.56,.24,.284],[.62,.46,.284]],rim,.012);
 for(const [x,y] of [[-.55,.34],[-.40,.40],[-.24,.43],[-.05,.51],[.12,.55],[.29,.50],[.39,.40],[.43,.29],[.58,.38]])ball(hat,.022,.022,.014,stud,x,y,.287);
 Object.assign(u,{head,mouth,smileCrease:null,beforeStoryCode:'BC-05',alignment:'Chaotic Evil',hasGlasses:false});return actor;
}
const successorPreviousSelect=selectBeforeStoryCast;
selectBeforeStoryCast=function(id){
 if(id!=='tajiri'){successorPreviousSelect(id);return;}
 const c=beforeStoryScene;if(!c||mode!=='beforeStoryMenu')return;
 if(!c.cast.tajiri){c.cast.tajiri=makeTrueSuccessorTajiri();c.root.add(c.cast.tajiri);}
 for(const [key,a] of Object.entries(c.cast)){a.visible=key==='tajiri';a.position.set(0,0,0);}if(c.crownMenu)c.crownMenu.visible=false;c.actor=c.cast.tajiri;
 document.getElementById('beforeStoryCode').textContent='BC-05 / CHAPTER 5';document.getElementById('beforeStoryName').textContent='TAJIRI JUKO';document.getElementById('beforeStoryAlignment').textContent='ALIGNMENT: CHAOTIC EVIL';document.getElementById('beforeStoryProfileText').textContent='The True Successor. Takeshi Juko’s son and Boki’s nephew. Josiah’s search brings him face to face with the heir of the Juko family.';
 document.querySelectorAll('[data-before-cast]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.beforeCast===id)));syncMenuSong();
};
tajiriCastButton.onclick=()=>selectBeforeStoryCast('tajiri');

function startTrueSuccessor(){
 const c=beforeStoryScene;if(mode!=='beforeStoryMenu'||!c||!beforeStoryProgress.unionCrownCompleted)return;
 clearBeforeStoryOsaka();clearBeforeStoryKenji();clearUnionCrown();stopBeforeStoryVoice();unionHideOtherSets();c.chapter='trueSuccessor';const root=new THREE.Group();c.root.add(root);c.unionCrown={root,time:0,line:0,beat:0,successorNarration:true};
 if(!c.jukoSet)buildBeforeStoryJuko();c.jukoSet.visible=true;setMode('beforeStorySuccessor');world.visible=upperWorld.visible=exhibit.visible=flash.visible=false;
 scene.background.setHex(0x101822);scene.fog.color.setHex(0x101822);scene.fog.density=.02;ambient.intensity=.75;cameraFill.intensity=.4;
 beforeStoryCinema.hidden=false;document.getElementById('beforeStoryCinemaChapter').textContent='BEFORE THE STORY / FINAL CHAPTER 5';document.getElementById('beforeStoryCinemaTitle').innerHTML='THE TRUE SUCCESSOR <span>TAJIRI JUKO</span>';showTrueSuccessorLine();renderTrueSuccessorCinema(0);
}
function showTrueSuccessorLine(){
 const b=beforeStoryScene.unionCrown;stopBeforeStoryVoice();b.beat=0;const ending=mode==='beforeStorySuccessorEnding',lines=ending?TRUE_SUCCESSOR_ENDING:TRUE_SUCCESSOR_NARRATION,entry=lines[b.line];
 document.getElementById('beforeStorySpeaker').textContent=ending?entry[0]:'JOSIAH RICHARDS / NARRATION';document.getElementById('beforeStoryLine').textContent=ending?entry[1]:entry;document.getElementById('beforeStoryCount').textContent=(b.line+1)+' / '+lines.length;b.speech=beforeStorySpeechTimeline(ending?entry[1]:entry);const next=document.getElementById('beforeStoryNext');next.disabled=ending&&b.line===lines.length-1&&!b.heaven?.deathComplete;next.hidden=false;next.textContent=next.disabled?'THE FIRE DESCENDS…':b.line===lines.length-1?(ending?'COMPLETE BEFORE THE STORY →':'FACE TAJIRI IN THE AIR →'):'CONTINUE →';if(ending)playTrueSuccessorHeavenVoice();else{const clip=beforeStorySuccessorVoices[b.line];clip.muted=muted;clip.play()?.catch(()=>{});}
}
function advanceTrueSuccessor(){
 const b=beforeStoryScene?.unionCrown;if(!b)return;
 const ending=mode==='beforeStorySuccessorEnding',lines=ending?TRUE_SUCCESSOR_ENDING:TRUE_SUCCESSOR_NARRATION;if(b.line<lines.length-1){b.line++;showTrueSuccessorLine();return;}
 if(ending){if(!b.heaven?.deathComplete)return;beforeStoryProgress.trueSuccessorCompleted=true;saveBeforeStoryProgress();refreshBeforeStoryChapters();returnBeforeStoryRome();}else startUnionCrownFight(true);
}
function renderTrueSuccessorCinema(dt){
 const c=beforeStoryScene,b=c?.unionCrown;if(!b)return;b.time+=dt;b.beat+=dt;camera.up.set(0,1,0);
 if(mode==='beforeStorySuccessor'){
  beforeStorySuccessorVoices[b.line].muted=muted;camera.position.copy(c.root.position).add(new THREE.Vector3(Math.sin(b.time*.1)*.2,2.4,5.2));camera.lookAt(c.root.position.clone().add(new THREE.Vector3(0,1.8,-2)));
 }else renderTrueSuccessorHeaven(dt);camera.updateMatrixWorld(true);
}
function configureUnionFightHUD(b){
 const successor=b.successor===true;successorAllyCaption.hidden=!successor;unionFightUI.querySelector('header>small').textContent=successor?'BEFORE THE STORY / FINAL CHAPTER 5 / THE TRUE SUCCESSOR':'BEFORE THE STORY / CHAPTER 4 / UNION CROWN';unionFightUI.querySelector('header>h2').textContent=successor?'DEFEAT TAJIRI JUKO':'DEFEAT BOKI JUKO';unionFightUI.querySelector('header>p').textContent=successor?'TAJIRI JUKO / BC-05':'BOKI JUKO / BC-04';unionFightUI.querySelector('.union-player>small').textContent=successor?'JOSIAH RICHARDS / LAWFUL NEUTRAL':'JOSIAH RICHARDS / LAWFUL EVIL';document.querySelector('#unionQuote>small').textContent=successor?'TAJIRI JUKO':'BOKI JUKO';unionFightUI.querySelector('footer').textContent=successor?'WASD FLY · SHIFT BOOST · R RISE · F DESCEND · CLICK CHAINS · Q / SPACE DODGE · V CAMERA · E HEAL · ESC PAUSE':'WASD MOVE · SHIFT RUN · CLICK CHAINS · Q / SPACE DODGE · V CAMERA · E HEAL · ESC PAUSE';document.getElementById('unionAttackCue').textContent=successor?'KEVIN IS YOUR ALLY · R RISE · F DESCEND · WATCH TAJIRI’S SABRE':'Watch Boki. Dodge her charms.';
}
function setupTrueSuccessorAlly(b){
 b.hero.userData.alignment='Lawful Neutral';b.ally=isolateBeforeStoryModel(makeKevinMurderhorn());b.ally.name='Kevin Murderhorn / allied with Josiah';b.root.add(b.ally);b.ally.position.set(-2,0,6);b.allyCooldown=1.5;b.allyShot=null;
 b.allyBeam=mesh(new THREE.CylinderGeometry(.035,.035,1,7),new THREE.MeshBasicMaterial({color:0x79baff}),b.root);b.allyBeam.visible=false;
 const marker=mesh(new THREE.TorusGeometry(.5,.045,6,24),new THREE.MeshBasicMaterial({color:0xffcf4b}),b.root);marker.rotation.x=Math.PI/2;b.allyMarker=marker;
 const h=b.enemy.userData;const sabre=new THREE.Group();h.arms[1].add(sabre);sabre.name='Tajiri’s curved sabre';sabre.position.set(0,-.70,.05);box(sabre,.04,.22,.04,mat(0x27211e),0,-.05,0);box(sabre,.22,.04,.055,mat(0xa99b74),0,.04,0);line3(sabre,[[0,.08,0],[.025,.30,0],[.06,.55,0],[.13,.85,0],[.18,1.03,0]],mat(0xd0d6d7,.25),.035);
}
function updateTrueSuccessorAlly(dt){
 const c=beforeStoryScene,b=c.unionCrown;if(b.ended||b.paused)return;
 const target=b.enemy.position.clone().add(new THREE.Vector3(-2.7,0,3.3)),delta=target.sub(b.ally.position),distance=delta.length();if(distance>.12)b.ally.position.addScaledVector(delta.normalize(),Math.min(distance,dt*4));
 b.ally.rotation.y=Math.atan2(b.enemy.position.x-b.ally.position.x,b.enemy.position.z-b.ally.position.z);animateCharacter(b.time,distance>.12,false,b.ally);b.allyMarker.position.copy(b.ally.position).y=b.ally.position.y+.06;b.allyCooldown-=dt;
 if(b.allyCooldown<=0){b.allyCooldown=1.5;b.allyShot=.17;b.enemyHP=Math.max(0,b.enemyHP-55);if(!b.enemyHP){finishUnionCrownFight(true);return;}}
 if(b.allyShot){b.allyShot=Math.max(0,b.allyShot-dt);b.ally.userData.arms[1].rotation.x=-1.45;const from=b.ally.position.clone().add(new THREE.Vector3(.35,1.2,0)),to=b.enemy.position.clone().add(new THREE.Vector3(0,1.2,0)),direction=to.clone().sub(from);b.allyBeam.position.copy(from).add(to).multiplyScalar(.5);b.allyBeam.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction.clone().normalize());b.allyBeam.scale.y=direction.length();b.allyBeam.visible=b.allyShot>0;}
}
function startTrueSuccessorEnding(){
 const b=beforeStoryScene.unionCrown;stopBeforeStoryVoice();b.hand.visible=false;b.hero.visible=true;b.hero.position.set(-1.8,8,.5);b.hero.rotation.set(0,.35,0);b.hero.userData.unionCrownSpecter.visible=false;b.ally.position.set(1.8,8,.5);b.ally.rotation.set(0,-.35,0);b.enemy.position.set(0,8,-1.2);b.enemy.rotation.set(0,0,0);b.enemy.userData.legs.forEach(leg=>leg.rotation.x=-.2);b.allyBeam.visible=false;b.allyMarker.visible=false;for(const effect of b.effects)disposeCampObject(effect.object);b.effects=[];b.line=0;b.beat=0;
 buildTrueSuccessorHeaven(b);unionFightUI.hidden=true;beforeStoryCinema.hidden=false;document.getElementById('beforeStoryCinemaChapter').textContent='BEFORE THE STORY / FINAL CHAPTER 5 / AFTERMATH';document.getElementById('beforeStoryCinemaTitle').innerHTML='THE TRUE SUCCESSOR <span>ALMIGHTY HEAVEN</span>';setMode('beforeStorySuccessorEnding');world.visible=upperWorld.visible=exhibit.visible=flash.visible=false;showTrueSuccessorLine();renderTrueSuccessorCinema(0);updateMobileControls();
}
const successorPreviousAdvance=advanceBeforeStoryRome;
advanceBeforeStoryRome=function(){if(mode==='beforeStorySuccessor'||mode==='beforeStorySuccessorEnding')advanceTrueSuccessor();else successorPreviousAdvance();};
document.getElementById('beforeStoryNext').onclick=advanceBeforeStoryRome;document.getElementById('beforeStoryTrueSuccessor').onclick=startTrueSuccessor;
document.addEventListener('keydown',e=>{if(!['beforeStorySuccessor','beforeStorySuccessorEnding'].includes(mode)||e.repeat)return;if(e.code==='Enter'){e.preventDefault();advanceTrueSuccessor();}else if(e.code==='Escape'){e.preventDefault();returnBeforeStoryRome();}});
refreshBeforeStoryChapters();

const beforeStorySuccessorVoices=[
 new Audio('assets/CH5JR1.mp3'),
 new Audio('assets/CH5JR2.mp3'),
 new Audio('assets/CH5JR3.mp3'),
 new Audio('assets/CH5JR4.mp3'),
 new Audio('assets/CH5JR5.mp3')
];
for(const clip of beforeStorySuccessorVoices){clip.preload='metadata';clip.volume=.9;AudioOptions.category(clip,'voice');}
const successorPreviousStopVoice=stopBeforeStoryVoice;
stopBeforeStoryVoice=function(){for(const clip of beforeStorySuccessorVoices){clip.pause();clip.currentTime=0;}successorPreviousStopVoice();};


