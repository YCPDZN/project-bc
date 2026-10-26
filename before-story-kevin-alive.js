/* Kevin's independent Chapter 4: the morning after the Camden church explosion. */
const KEVIN_ALIVE_LINES=[
 'The next day. Still breathing. Still here. I heard the roof come apart above us, felt the heat tear through the church, and for one glorious second I thought that was the end of it. No more footsteps. No more masks. But those black chains had other plans. Apparently even death has to queue before it gets its hands on me.',
 'I pulled the chains around myself. Every link tightened until they became a cloak, wrapped over my head, my chest, my back—every inch the fire could reach. The blast struck that shell instead of my body. I could hear the metal screaming against the pressure, but it held. When the walls fell, I was buried inside something that refused to let me burn.',
 'By morning, I had dragged myself out through the wreckage. The Faceless Opposer was gone. Not dead. Gone. He survived his first fire, and now he has slipped out of this one too. I wanted that church to be the last place either of us ever saw. Instead, I gave the bastard another story to tell himself about how nothing can kill him.',
 'He is running back to Japan. Back towards the place where his family taught people to be afraid of their name. Let him dress it up as a retreat, a homecoming, whatever makes that ruined face feel powerful beneath its mask. I know what running looks like. I spent years doing it. This time, I intend to be the footsteps he cannot shake.',
 'So I will follow him there. Across the sea, through whatever doors he locks, past whatever fools he puts between us. He wanted a hunt in Camden; now he can discover how it feels when the hunted man follows him home. These chains kept me alive. I will make him regret it. Japan, then. And this time, he does not get to choose when the chase ends.'
];

/* Supplied CH4KM1–5 recordings, matched to the five subtitle paragraphs. */
const kevinAliveVoices=[new Audio('assets/KEVIN-CH4KM1.mp3'),new Audio('assets/KEVIN-CH4KM2.mp3'),new Audio('assets/KEVIN-CH4KM3.mp3'),new Audio('assets/KEVIN-CH4KM4.mp3'),new Audio('assets/KEVIN-CH4KM5.mp3')];
for(const clip of kevinAliveVoices){clip.preload='metadata';clip.volume=.9;AudioOptions.category(clip,'voice');}
function currentKevinAliveVoice(){const s=beforeStoryScene?.kevinAlive;return s&&s.voiceIndex!==null?kevinAliveVoices[s.voiceIndex]:null;}
function stopKevinAliveVoice(){for(const clip of kevinAliveVoices){clip.pause();clip.currentTime=0;}const s=beforeStoryScene?.kevinAlive;if(s){s.voiceToken=(s.voiceToken||0)+1;s.voiceIndex=null;}}
function playKevinAliveVoice(){
 stopKevinAliveVoice();const s=beforeStoryScene?.kevinAlive;if(mode!=='beforeStoryKevinAlive'||!s||s.phase!=='speech')return;
 s.voiceIndex=s.line;s.voiceFailed=false;s.voiceGap=0;const clip=currentKevinAliveVoice(),token=s.voiceToken;clip.muted=muted;
 document.getElementById('beforeStoryNext').textContent=s.line===4?'FINISH CHAPTER →':'CONTINUE · ENTER →';
 const failed=()=>{if(beforeStoryScene?.kevinAlive!==s||s.voiceToken!==token)return;s.voiceFailed=true;document.getElementById('beforeStoryNext').textContent='PLAY DIALOGUE →';};
 if(clip.error)clip.load();try{clip.play()?.catch(failed);}catch(e){failed();}
}
function kevinAliveLineComplete(dt){
 const s=beforeStoryScene?.kevinAlive,clip=currentKevinAliveVoice();if(!s||s.phase!=='speech'||!clip||s.voiceFailed)return false;clip.muted=muted;
 if(clip.error){s.voiceFailed=true;document.getElementById('beforeStoryNext').textContent='RETRY DIALOGUE →';return false;}
 if(clip.ended){s.voiceGap+=dt;return s.voiceGap>=.85;}return false;
}

try{beforeStoryProgress.kevinAliveCompleted=JSON.parse(localStorage.getItem(BEFORE_STORY_SAVE_KEY))?.kevinAliveCompleted===true;}catch(e){beforeStoryProgress.kevinAliveCompleted=false;}
const kevinAliveCard=document.createElement('article');kevinAliveCard.className='before-story-next-chapter';kevinAliveCard.innerHTML='<small>CHAPTER 4 / 2018 / CUTSCENE</small><h2>KEVIN IS ALIVE?</h2><p>The next day. Black chains kept Kevin alive. The Faceless Opposer is heading back to Japan.</p><button id="beforeStoryKevinAlive" type="button" disabled>LOCKED · COMPLETE CHAPTER 3</button>';document.getElementById('beforeStoryKevinBack').before(kevinAliveCard);
const alivePreviousRefresh=refreshBeforeStoryChapters;refreshBeforeStoryChapters=function(){alivePreviousRefresh();const button=document.getElementById('beforeStoryKevinAlive');button.disabled=!beforeStoryProgress.kevinFacelessCompleted;button.textContent=button.disabled?'LOCKED · COMPLETE CHAPTER 3':beforeStoryProgress.kevinAliveCompleted?'REPLAY CHAPTER 4 →':'BEGIN CHAPTER 4 →';};refreshBeforeStoryChapters();
const kevinNextDay=document.createElement('div');kevinNextDay.id='kevinAliveNextDay';kevinNextDay.hidden=true;kevinNextDay.innerHTML='<small>CAMDEN · 2018</small><strong>THE NEXT DAY</strong>';beforeStoryCinema.append(kevinNextDay);
function buildKevinAlive(){
 const c=beforeStoryScene,root=new THREE.Group();root.name='Kevin is alive? / Camden / the next day / 2018';c.root.add(root);const s=c.kevinAlive={root,time:0,beat:0,line:0,phase:'nextDay',links:[],voiceIndex:null,voiceToken:0,voiceGap:0,voiceFailed:false};
 const brick=mat(0x665248),stone=mat(0x8b8983),dark=mat(0x191d23),glass=mat(0x526371),metal=mat(0x373a40,.35);
 box(root,60,.4,90,stone,0,-.25,-22);box(root,8,.05,75,mat(0x393f44),0,-.02,-20);
 for(const side of [-1,1])for(let n=0;n<6;n++){const x=side*9,z=10-n*11,h=8+n%3*2;box(root,9,h,10,brick,x,h/2,z);box(root,9.3,.25,10.3,dark,x,h,z);for(let y=4;y<h;y+=2.6)for(const dz of [-3,0,3]){box(root,.13,1.8,1.5,stone,side*4.45,y,z+dz);box(root,.15,1.5,1.25,glass,side*4.36,y,z+dz);}box(root,.15,2.6,2,dark,side*4.35,1.3,z);}
 for(let i=0;i<16;i++){const debris=box(root,.25+i%3*.2,.18+i%2*.18,.35,dark,(i%2?1:-1)*(2.5+i%3*.35),.1,5-i*.8);debris.rotation.y=i*.9;}
 const sign=heathSign('CAMDEN','#c3c5bf','#29333b',3.2);sign.position.set(-4.24,3.1,-5);sign.rotation.y=Math.PI/2;root.add(sign);
 root.add(new THREE.HemisphereLight(0xc2d1df,0x514039,1.4));const dawn=new THREE.DirectionalLight(0xf0c69b,1.4);dawn.position.set(-9,20,-25);root.add(dawn);
 s.hero=makeBeforeStoryKevin2018();s.hero.name='Kevin Murderhorn / surviving Camden / 2018';root.add(s.hero);s.spectre=makeRebellionSpectre();s.spectre.position.set(.1,.08,-1.8);s.spectre.userData.material.opacity=.5;root.add(s.spectre);
 const geometry=new THREE.TorusGeometry(.105,.029,6,12),material=new THREE.MeshStandardMaterial({color:0x050507,emissive:0x29202a,emissiveIntensity:.25,metalness:.7,roughness:.3});
 for(let i=0;i<112;i++){const link=new THREE.Mesh(geometry,material);root.add(link);s.links.push(link);}return s;
}
function clearKevinAlive(){stopKevinAliveVoice();const c=beforeStoryScene;if(c?.kevinAlive){disposeCampObject(c.kevinAlive.root);c.kevinAlive=null;}kevinNextDay.hidden=true;document.querySelector('.before-story-dialogue').hidden=false;keys.clear();}
function startKevinAlive(){
 const c=beforeStoryScene;if(mode!=='beforeStoryMenu'||!c||!beforeStoryProgress.kevinFacelessCompleted)return;clearFacelessCamden();clearKevinAlive();stopBeforeStoryVoice();
 for(const key of ['menuSet','romeSet','jukoSet','lastJukoSet','heathNarrationSet'])if(c[key])c[key].visible=false;for(const actor of Object.values(c.cast))actor.visible=false;if(c.crownMenu)c.crownMenu.visible=false;
 c.story='kevin';c.chapter='kevinAlive';buildKevinAlive();setMode('beforeStoryKevinAlive');hideUndeadCampaignCast();world.visible=upperWorld.visible=exhibit.visible=flash.visible=false;beforeStoryUI.hidden=true;beforeStoryCinema.hidden=false;keys.clear();drag=false;document.exitPointerLock?.();scene.background.setHex(0x8696a7);scene.fog.color.setHex(0x8696a7);scene.fog.density=.016;ambient.intensity=.9;cameraFill.intensity=.55;
 document.getElementById('beforeStoryCinemaChapter').textContent='BEFORE THE STORY / KEVIN MURDERHORN / CHAPTER 4';document.getElementById('beforeStoryCinemaTitle').innerHTML='KEVIN IS ALIVE? <span>CAMDEN · 2018</span>';document.getElementById('beforeStoryNext').disabled=true;document.querySelector('.before-story-dialogue').hidden=true;kevinNextDay.hidden=false;renderKevinAlive(0);syncMenuSong();updateMobileControls();
}
function showKevinAliveLine(){const s=beforeStoryScene.kevinAlive;s.phase='speech';s.beat=0;s.timeline=beforeStorySpeechTimeline(KEVIN_ALIVE_LINES[s.line]);kevinNextDay.hidden=true;document.querySelector('.before-story-dialogue').hidden=false;document.getElementById('beforeStorySpeaker').textContent='KEVIN MURDERHORN / BC-01';document.getElementById('beforeStoryLine').textContent=KEVIN_ALIVE_LINES[s.line];document.getElementById('beforeStoryCount').textContent=(s.line+1)+' / 5';document.getElementById('beforeStoryNext').disabled=false;document.getElementById('beforeStoryNext').textContent=s.line===4?'FINISH CHAPTER →':'CONTINUE · ENTER →';playKevinAliveVoice();}
function returnKevinAlive(){clearKevinAlive();beforeStoryCinema.hidden=true;returnBeforeStoryRome();selectBeforeStoryCast('kevin2004');beforeStoryKevinChapters.hidden=false;beforeStoryKevinButton.setAttribute('aria-expanded','true');document.getElementById('beforeStoryKevinAlive').focus();updateMobileControls();}
function advanceKevinAlive(){const s=beforeStoryScene?.kevinAlive;if(mode!=='beforeStoryKevinAlive'||!s||s.phase!=='speech')return;if(s.voiceFailed){playKevinAliveVoice();return;}stopKevinAliveVoice();if(s.line<4){s.line++;showKevinAliveLine();}else{beforeStoryProgress.kevinAliveCompleted=true;saveBeforeStoryProgress();refreshBeforeStoryChapters();returnKevinAlive();}}
function renderKevinAlive(dt){
 const c=beforeStoryScene,s=c?.kevinAlive;if(!s)return;dt=THREE.MathUtils.clamp(dt,0,.05);s.time+=dt;s.beat+=dt;animateCharacter(s.time,false,false,s.hero);const clip=currentKevinAliveVoice(),speechClock=clip&&!clip.paused&&!clip.ended?clip.currentTime:0;const u=s.hero.userData;u.head.rotation.y=Math.sin(s.time*.55)*.06;u.head.rotation.x=.02;for(const [i,arm]of u.arms.entries()){arm.rotation.x=-.2-Math.max(0,Math.sin(speechClock*1.2+i))*.3;arm.rotation.z=(i?1:-1)*.13;}
 // A close lattice of black links demonstrates the shield that kept the blast off him.
 const cloak=s.line===1?1:s.line===0?.45:.22;s.spectre.position.y=.08+Math.sin(s.time)*.06;
 for(const [i,link]of s.links.entries()){const row=Math.floor(i/14),a=(i%14)/14*TAU+s.time*.15,r=.5+(1-cloak)*.35;link.position.set(Math.cos(a)*r,.12+row*(s.line<=1?.29:.16),Math.sin(a)*r);link.rotation.set(a,Math.PI/2*(i%2),s.time*.1);}
 const opening=THREE.MathUtils.smoothstep(s.time,0,5),eye=new THREE.Vector3(5,4.1,11).lerp(new THREE.Vector3(2.7,2.5,5.9),opening),target=new THREE.Vector3(0,1.55,0);camera.up.set(0,1,0);camera.position.copy(c.root.position).add(eye);camera.lookAt(c.root.position.clone().add(target));camera.updateMatrixWorld(true);
 if(s.phase==='nextDay'&&s.beat>=2.8)showKevinAliveLine();else if(s.phase==='speech'&&kevinAliveLineComplete(dt))advanceKevinAlive();
}
document.getElementById('beforeStoryKevinAlive').onclick=startKevinAlive;
const alivePreviousNext=document.getElementById('beforeStoryNext').onclick;document.getElementById('beforeStoryNext').onclick=()=>mode==='beforeStoryKevinAlive'?advanceKevinAlive():alivePreviousNext();
const alivePreviousReturn=document.getElementById('beforeStoryReturn').onclick;document.getElementById('beforeStoryReturn').onclick=()=>mode==='beforeStoryKevinAlive'?returnKevinAlive():alivePreviousReturn();
const alivePreviousClear=clearBeforeStoryMenu;clearBeforeStoryMenu=function(){clearKevinAlive();alivePreviousClear();};
document.addEventListener('keydown',e=>{if(mode!=='beforeStoryKevinAlive'||e.repeat||!['Enter','Escape'].includes(e.code))return;e.preventDefault();e.stopImmediatePropagation();if(e.code==='Enter')advanceKevinAlive();else returnKevinAlive();},true);

const alivePreviousStopVoice=stopBeforeStoryVoice;stopBeforeStoryVoice=function(){stopKevinAliveVoice();alivePreviousStopVoice();};
