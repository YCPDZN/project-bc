/* Chapter 3 ending: an attempted final confrontation, not a campaign death flag. */
const KEVIN_CHURCH_ENDING_LINES=[
 'YOU WANTED ME CORNERED? HERE I AM! NO MORE STREETS, NO MORE FOOTSTEPS, NO MORE OF YOUR LAUGHTER FOLLOWING ME HOME! YOU CHASED ME INTO A CHURCH THINKING YOU HAD FOUND YOUR PREY. LOOK AROUND! I DID NOT COME HERE TO HIDE. I CAME HERE TO MAKE SURE NEITHER OF US WALKS OUT!',
 'YOUR FATHER, TAKESHI! YOUR UNCLE, BOZUKI! YOUR AUNT, BOKI! YOU CARRY THEIR NAMES LIKE THEY MAKE YOU UNTOUCHABLE! THEY ARE DEAD, AND YOU ARE STILL TRYING TO BUILD A THRONE OUT OF WHAT THEY LEFT BEHIND! WHEN YOU MEET THEM IN HELL, TELL THEM THEIR PRECIOUS FAMILY NAME DID NOT SAVE YOU!',
 'YOUR FATHER ESCAPED INTO A GRAVE. YOUR UNCLE NEVER ESCAPED ME. YOUR AUNT FOUND POWER AND STILL COULD NOT ESCAPE JOSIAH! NOW YOU COME CRAWLING OUT OF THE FIRE, DEMANDING THAT THE WORLD PAY FOR ALL THREE! I OWE YOUR FAMILY NOTHING! NOT MERCY, NOT AN APOLOGY, NOT ONE MORE NIGHT OF BEING HUNTED!',
 'DO NOT LOOK AT THE DOOR! THERE IS NO BARGAIN WAITING ON THE OTHER SIDE! I AM NOT ASKING THIS PLACE TO FORGIVE ME, AND I AM NOT ASKING ANYONE TO SAVE ME! YOU WANT MY LIFE SO BADLY? THEN YOU CAN STAY HERE WITH ME WHILE EVERYTHING YOU THOUGHT YOU CONTROLLED COMES APART!',
 'GO ON! CALL FOR THEM! CALL FOR YOUR FATHER, YOUR UNCLE AND YOUR AUNT! ASK THEM WHERE THEIR EMPIRE WENT! IF THIS PLACE BECOMES OUR GRAVE, THEN SO BE IT! BUT YOU DO NOT GET TO STAND OVER MINE AND LAUGH! THE CHASE ENDS HERE! MEET YOUR FAMILY IN HELL, YOU SADISTIC BASTARD!'
];
const kevinChurchVoices=[new Audio('assets/KEVIN-KMEC1.mp3'),new Audio('assets/KEVIN-KMEC2.mp3'),new Audio('assets/KEVIN-KMEC3.mp3'),new Audio('assets/KEVIN-KMEC4.mp3'),new Audio('assets/KEVIN-KMEC5.mp3')];
for(const clip of kevinChurchVoices){clip.preload='metadata';clip.volume=.9;AudioOptions.category(clip,'voice');}
const JOSIAH_CHURCH_OBSERVATION='No, it can’t be… The Faceless Opposer.';

const josiahChurchVoice=new Audio('assets/KEVIN-CH3-JOSIAH.mp3');
josiahChurchVoice.preload='metadata';josiahChurchVoice.volume=.9;AudioOptions.category(josiahChurchVoice,'voice');
const JOSIAH_CHURCH_ENVELOPE={"duration":3.631,"step":0.02,"levels":[0,0,0,0,0.266,0.382,0.298,0.321,0.27,0.509,0.737,0.642,0.538,0.423,0.392,0.506,0.8,0.8,0.553,0.384,0.261,0.32,0.297,0.243,0.198,0.122,0.067,0.046,0,0,0,0,0,0,0,0,0,0.644,0.756,0.11,0,0,0,0,0,0.231,0.464,0.8,0.8,0.8,0.429,0.532,0.318,0.103,0.491,0.8,0.8,0.8,0.8,0.715,0.334,0.243,0.36,0.305,0,0,0.134,0.773,0.68,0.273,0.231,0.177,0.136,0.161,0.166,0.122,0.032,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.205,0.8,0.484,0.096,0.114,0.155,0.15,0.12,0.066,0.021,0.012,0.058,0.308,0.8,0.8,0.8,0.684,0.34,0.237,0.444,0.263,0.156,0.138,0.045,0.749,0.8,0.8,0.426,0.27,0.295,0.305,0.8,0.8,0.704,0.03,0,0,0.139,0.1,0.271,0.431,0.579,0.753,0.8,0.8,0.8,0.8,0.8,0.8,0.777,0.662,0.549,0.368,0.248,0.599,0.472,0.152,0.143,0.177,0.222,0.192,0.112,0.046,0.018,0,0,0,0,0,0,0,0,0,0,0,0,0,0]};
const churchVideoUI=document.createElement('section');churchVideoUI.id='kevinChurchVideo';churchVideoUI.hidden=true;churchVideoUI.setAttribute('aria-label','Chapter 3 ending video');
churchVideoUI.innerHTML='<video id="kevinChurchEndingVideo" playsinline controls preload="metadata" aria-label="Kevin Chapter 3 ending"></video><div class="church-video-actions"><button id="churchVideoBack">BACK TO BEFORE THE STORY</button><button id="churchVideoPlay" hidden>PLAY VIDEO</button><p id="churchVideoStatus" role="status"></p></div>';
document.body.append(churchVideoUI);
const churchEndingVideo=document.getElementById('kevinChurchEndingVideo');churchEndingVideo.src='assets/KEVIN-CH3-END.mp4';churchEndingVideo.volume=1;AudioOptions.category(churchEndingVideo,'voice');
const churchVideoPlay=document.getElementById('churchVideoPlay'),churchVideoStatus=document.getElementById('churchVideoStatus');
const churchMissionComplete=document.createElement('div');churchMissionComplete.id='kevinFacelessMissionComplete';churchMissionComplete.setAttribute('role','status');churchMissionComplete.tabIndex=-1;churchMissionComplete.hidden=!beforeStoryProgress.kevinFacelessCompleted;churchMissionComplete.innerHTML='<strong>MISSION COMPLETE</strong><small>CHAPTER 3 / THE FACELESS OPPOSER</small>';facelessCard.prepend(churchMissionComplete);
const churchPreviousRefresh=refreshBeforeStoryChapters;refreshBeforeStoryChapters=function(){churchPreviousRefresh();churchMissionComplete.hidden=!beforeStoryProgress.kevinFacelessCompleted;};
function stopJosiahChurchVoice(){josiahChurchVoice.pause();josiahChurchVoice.currentTime=0;const s=beforeStoryScene?.facelessChurch;if(s){s.observerToken=(s.observerToken||0)+1;if(s.observerMouth){s.observerMouth.open.visible=false;s.observerMouth.closed.visible=true;}}}
function playJosiahChurchVoice(){
 const s=beforeStoryScene?.facelessChurch;if(!s||s.phase!=='observer')return;stopJosiahChurchVoice();s.observerFailed=false;s.observerGap=0;const token=s.observerToken;josiahChurchVoice.muted=muted;
 document.getElementById('beforeStoryNext').disabled=true;document.getElementById('beforeStoryNext').textContent='…';
 const failed=()=>{if(beforeStoryScene?.facelessChurch!==s||s.observerToken!==token)return;s.observerFailed=true;document.getElementById('beforeStoryNext').disabled=false;document.getElementById('beforeStoryNext').textContent='PLAY JOSIAH’S LINE →';};
 try{josiahChurchVoice.play()?.catch(failed);}catch(e){failed();}
}
function stopKevinChurchVideo(){churchEndingVideo.onended=null;churchEndingVideo.onerror=null;churchEndingVideo.pause();churchEndingVideo.currentTime=0;churchVideoUI.hidden=true;churchVideoPlay.hidden=true;churchVideoStatus.textContent='';const s=beforeStoryScene?.facelessChurch;if(s)s.videoToken=(s.videoToken||0)+1;}
function playKevinChurchVideo(){
 const s=beforeStoryScene?.facelessChurch;if(!s||s.phase!=='video')return;const token=s.videoToken;churchEndingVideo.muted=muted;churchVideoPlay.hidden=true;churchVideoStatus.textContent='';
 const blocked=()=>{if(beforeStoryScene?.facelessChurch!==s||s.videoToken!==token)return;churchVideoPlay.hidden=false;churchVideoStatus.textContent='Press PLAY VIDEO to continue.';};try{churchEndingVideo.play()?.catch(blocked);}catch(e){blocked();}
}
function startKevinChurchVideo(){
 const s=beforeStoryScene?.facelessChurch;if(!s||s.phase!=='observer'||!josiahChurchVoice.ended)return;
 stopKevinChurchVoice();stopJosiahChurchVoice();stopKevinChurchExplosionSound(s);stopKevinChurchVideo();s.phase='video';beforeStoryCinema.hidden=true;churchVideoUI.hidden=false;
 const token=s.videoToken;churchEndingVideo.onended=()=>{if(beforeStoryScene?.facelessChurch===s&&s.phase==='video'&&s.videoToken===token&&churchEndingVideo.ended)completeKevinChurchEnding();};
 churchEndingVideo.onerror=()=>{if(beforeStoryScene?.facelessChurch!==s||s.videoToken!==token)return;churchVideoPlay.hidden=false;churchVideoPlay.textContent='RETRY VIDEO';churchVideoStatus.textContent='The video could not play. Retry to finish the chapter.';};churchVideoPlay.textContent='PLAY VIDEO';playKevinChurchVideo();updateMobileControls();
}
churchVideoPlay.onclick=()=>{if(churchEndingVideo.error)churchEndingVideo.load();playKevinChurchVideo();};document.getElementById('churchVideoBack').onclick=returnFacelessCamden;

function currentKevinChurchVoice(){const s=beforeStoryScene?.facelessChurch;return s&&s.voiceIndex!==null?kevinChurchVoices[s.voiceIndex]:null;}
function stopKevinChurchVoice(){for(const clip of kevinChurchVoices){clip.pause();clip.currentTime=0;}const s=beforeStoryScene?.facelessChurch;if(s){s.voiceToken=(s.voiceToken||0)+1;s.voiceIndex=null;}}
function playKevinChurchVoice(){
 stopKevinChurchVoice();const s=beforeStoryScene?.facelessChurch;if(!s||s.phase!=='rant')return;s.voiceIndex=s.line;s.voiceFailed=false;s.voiceGap=0;const clip=currentKevinChurchVoice(),token=s.voiceToken;clip.muted=muted;
 const failed=()=>{if(beforeStoryScene?.facelessChurch===s&&s.voiceToken===token)s.voiceFailed=true;};try{clip.play()?.catch(failed);}catch(e){failed();}
}
function kevinChurchLineComplete(dt){
 const s=beforeStoryScene?.facelessChurch,clip=currentKevinChurchVoice();if(!s)return false;if(!clip||s.voiceFailed||clip.error)return s.beat>=s.timeline.duration+1.5;
 clip.muted=muted;if(clip.ended||Number.isFinite(clip.duration)&&clip.duration>0&&clip.currentTime>=clip.duration-.01&&!clip.paused){s.voiceGap+=dt;return s.voiceGap>=.85;}return false;
}
function buildKevinChurchAftermath(s){
 // The exterior effects stay visible when the enclosed interior is hidden.
 const interior=new THREE.Group();interior.name='Enclosed church interior';while(s.root.children.length)interior.add(s.root.children[0]);s.root.add(interior);s.interior=interior;
 const blast=new THREE.Group();blast.name='Church explosion / fire, pressure wave, debris and smoke';blast.position.set(0,3,31);s.root.add(blast);blast.visible=false;s.blast=blast;s.blastTime=0;
 s.fireball=mesh(new THREE.SphereGeometry(1,20,14),new THREE.MeshBasicMaterial({color:0xffa23e,transparent:true,opacity:.8,depthWrite:false}),blast);s.core=mesh(new THREE.SphereGeometry(1,16,12),new THREE.MeshBasicMaterial({color:0xffefd1,transparent:true,opacity:.9,depthWrite:false}),blast);
 s.flames=[];for(let i=0;i<12;i++)s.flames.push(mesh(new THREE.SphereGeometry(1,10,8),new THREE.MeshBasicMaterial({color:[0xffc574,0xf76d26,0xd94213][i%3],transparent:true,opacity:.9,depthWrite:false}),blast));
 s.shockwave=mesh(new THREE.TorusGeometry(1,.04,6,48),new THREE.MeshBasicMaterial({color:0xffdba9,transparent:true,opacity:.5,depthWrite:false}),blast,0,-2.85,0);s.shockwave.rotation.x=Math.PI/2;
 s.blastLight=new THREE.PointLight(0xffac58,0,65);s.blastLight.position.set(0,3,31);s.root.add(s.blastLight);
 s.smoke=[];const smokeMaterial=new THREE.MeshBasicMaterial({color:0x33323a,transparent:true,opacity:.18,depthWrite:false});for(let i=0;i<14;i++){const cloud=mesh(new THREE.SphereGeometry(1,8,6),smokeMaterial,blast);s.smoke.push(cloud);}
 s.debris=[];const rubble=mat(0x5b4a3e);for(let i=0;i<18;i++){const fragment=box(blast,.22+i%3*.16,.20+i%2*.18,.28,rubble,0,0,0);s.debris.push(fragment);}
 s.observer=isolateBeforeStoryModel(makeUnionCrownJosiah());s.observer.name='Josiah Richards / black hoodie / observing the church';s.observer.position.set(-5,0,52);s.observer.rotation.y=Math.atan2(5,-20);s.observer.visible=false;if(s.observer.userData.unionCrownSpecter)s.observer.userData.unionCrownSpecter.visible=false;s.root.add(s.observer);s.observerMouth=makeBeforeStorySpeechMouth('churchObserver',s.observer);
 s.observerLight=new THREE.PointLight(0xc3d2ec,0,12);s.observerLight.position.set(-4,4,48);s.root.add(s.observerLight);
 s.interiorFlash=mesh(new THREE.SphereGeometry(1,16,12),new THREE.MeshBasicMaterial({color:0xffdba0,transparent:true,opacity:.9,depthWrite:false}),interior,0,2,1);s.interiorFlash.visible=false;
}
function stopKevinChurchExplosionSound(s){const sound=s?.explosionSound;if(!sound)return;s.explosionSound=null;sound.source.onended=null;try{sound.source.stop();}catch(e){}sound.source.disconnect();sound.filter.disconnect();sound.gain.disconnect();}
function playKevinChurchExplosionSound(s){
 initAudio();if(!audioCtx||!master||muted)return;const buffer=audioCtx.createBuffer(1,Math.ceil(audioCtx.sampleRate*2.4),audioCtx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.exp(-i/data.length*4);
 const source=audioCtx.createBufferSource(),filter=audioCtx.createBiquadFilter(),gain=audioCtx.createGain(),now=audioCtx.currentTime;source.buffer=buffer;filter.type='lowpass';filter.frequency.setValueAtTime(650,now);filter.frequency.exponentialRampToValueAtTime(55,now+2.3);gain.gain.setValueAtTime(.001,now);gain.gain.linearRampToValueAtTime(.65,now+.04);gain.gain.exponentialRampToValueAtTime(.001,now+2.3);source.connect(filter);filter.connect(gain);gain.connect(master);s.explosionSound={source,filter,gain};source.onended=()=>{if(s.explosionSound?.source===source)stopKevinChurchExplosionSound(s);};source.start();
}
function startKevinChurchExplosion(){
 const s=beforeStoryScene?.facelessChurch;if(!s)return;stopKevinChurchVoice();s.phase='explosion';s.beat=0;s.blastTime=0;s.blast.visible=true;s.interiorFlash.visible=true;document.querySelector('.before-story-dialogue').hidden=true;document.getElementById('beforeStoryNext').disabled=true;beforeStoryCinema.style.background='transparent';playKevinChurchExplosionSound(s);
}
function updateKevinChurchExplosion(dt){
 const s=beforeStoryScene.facelessChurch;s.blastTime+=dt;const t=s.blastTime,u=THREE.MathUtils.clamp(t/3.8,0,1),fade=Math.max(0,1-t/3.8);
 s.fireball.visible=t<3.8;s.fireball.scale.set(1+u*13,.8+u*8,1+u*13);s.fireball.material.opacity=fade*.75;s.core.visible=t<1.8;s.core.scale.setScalar(1+Math.min(1,t/1.8)*9);s.core.material.opacity=Math.max(0,1-t/1.8)*.9;s.blastLight.intensity=fade*180;
 for(const [i,flame]of s.flames.entries()){const a=i/12*TAU;flame.visible=t<2.8;flame.position.set(Math.cos(a)*(1+u*6),Math.sin(a*3)*(1+u*2),Math.sin(a)*(1+u*6));flame.scale.set(1+u*4,1+u*(3+i%3),1+u*4);flame.material.opacity=Math.max(0,1-t/2.8)*.9;}
 s.shockwave.visible=t<3.8;s.shockwave.scale.setScalar(1+u*24);s.shockwave.material.opacity=fade*.4;
 for(const [i,cloud]of s.smoke.entries()){const age=Math.min(t,10),a=i/14*TAU;cloud.position.set(Math.cos(a)*(2+i%3),1+i%4+age*.38,Math.sin(a)*(2+i%2));cloud.scale.setScalar(1.2+Math.min(age,6)*.45);}
 for(const [i,fragment]of s.debris.entries()){const a=i/18*TAU,age=Math.min(t,3);fragment.position.set(Math.cos(a)*(1+age*(2+i%3)),Math.max(-2.8,age*(5+i%4)-age*age*4),Math.sin(a)*(1+age*(2+i%3)));fragment.rotation.set(age*(i%3+1),a+age,age*2);}
 s.interiorFlash.scale.setScalar(1+t*8);s.interiorFlash.material.opacity=Math.max(0,1-t/1.1);
 if(t>=.8){s.interior.visible=false;beforeStoryScene.faceless.root.visible=true;}
}
function startJosiahChurchObservation(){
 const s=beforeStoryScene.facelessChurch;s.phase='observer';s.beat=0;s.interior.visible=false;s.observer.visible=true;s.observerLight.intensity=18;beforeStoryScene.faceless.root.visible=true;
 // The mask survives the blast; its wearer is still called the Faceless Opposer here.
 s.root.add(s.enemy);s.enemy.position.set(0,0,32);s.enemy.rotation.y=0;s.enemy.visible=true;s.observerFirst=beforeStorySpeechTimeline('No, it can’t be…');s.observerSecond=beforeStorySpeechTimeline('The Faceless Opposer.');
 document.querySelector('.before-story-dialogue').hidden=false;document.getElementById('beforeStoryCinemaTitle').innerHTML='THE FACELESS OPPOSER <span>CAMDEN · 2018</span>';document.getElementById('beforeStorySpeaker').textContent='JOSIAH RICHARDS';document.getElementById('beforeStoryLine').textContent='No, it can’t be…';document.getElementById('beforeStoryCount').textContent='EPILOGUE';document.getElementById('beforeStoryNext').disabled=true;document.getElementById('beforeStoryNext').textContent='…';playJosiahChurchVoice();
}
function renderJosiahChurchObservation(dt){
 const c=beforeStoryScene,s=c.facelessChurch;updateKevinChurchExplosion(dt);animateCharacter(s.time,false,false,s.observer);animateCharacter(s.time,false,false,s.enemy);s.observer.rotation.y=Math.atan2(5,-20);s.observer.userData.head.rotation.x=.035;s.observer.userData.head.rotation.y=-.13;
 const age=josiahChurchVoice.currentTime,level=!josiahChurchVoice.paused&&!josiahChurchVoice.ended?JOSIAH_CHURCH_ENVELOPE.levels[Math.floor(age/JOSIAH_CHURCH_ENVELOPE.step)]||0:0,m=s.observerMouth;m.open.visible=level>.04;m.open.scale.set(m.width,.006+level*.025,.009);m.closed.visible=!m.open.visible;if(s.observer.userData.openMouth)s.observer.userData.openMouth.visible=false;
 if(age>=2.05)document.getElementById('beforeStoryLine').textContent=JOSIAH_CHURCH_OBSERVATION;
 for(const [i,arm]of s.observer.userData.arms.entries()){arm.rotation.x=i?-.25:-.10;arm.rotation.z=(i?1:-1)*.12;}
 const eye=new THREE.Vector3(-2.6,2.45,47.8),focus=new THREE.Vector3(-5,1.7,52);
 camera.up.set(0,1,0);camera.position.copy(c.root.position).add(s.root.position).add(eye);camera.lookAt(c.root.position.clone().add(s.root.position).add(focus));camera.updateMatrixWorld(true);josiahChurchVoice.muted=muted;
 if(josiahChurchVoice.error&&!s.observerFailed){s.observerFailed=true;document.getElementById('beforeStoryNext').disabled=false;document.getElementById('beforeStoryNext').textContent='RETRY JOSIAH’S LINE →';}
 if(josiahChurchVoice.ended){s.observerGap+=dt;if(s.observerGap>=.6)startKevinChurchVideo();}
}

function facelessChurchArch(parent,x,y,z,width,height,material){
 const points=[];for(let n=0;n<=16;n++){const t=n/16;points.push(new THREE.Vector3(x+(t-.5)*width,y+Math.sin(t*Math.PI)*height,z));}
 return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),24,.10,6,false),material,parent);
}
function buildFacelessChurchExterior(root,b){
 const stone=mat(0x555251),trim=mat(0x8f887b),wood=mat(0x242023),dark=mat(0x0a1018);
 for(const side of [-1,1]){box(root,4,10,2,stone,side*4.4,5,-140);box(root,.65,10.8,2.4,trim,side*6.2,5.4,-139.8);box(root,2.8,14,3.8,stone,side*6,7,-142);const spire=mesh(new THREE.ConeGeometry(2.15,5,4),dark,root,side*6,16.5,-142);spire.rotation.y=Math.PI/4;}
 box(root,4.8,5,2,stone,0,7.5,-140);facelessChurchArch(root,0,4,-138.9,4.8,2.8,trim);box(root,4.5,4.1,.12,dark,0,2,-139.7);for(const side of [-1,1])box(root,.45,4.2,.5,trim,side*2.5,2,-138.9);
 const window=mesh(new THREE.CircleGeometry(1.1,24),new THREE.MeshBasicMaterial({color:0x647c9e}),root,0,8.1,-138.96);for(let n=0;n<8;n++){const a=n*Math.PI/4;line3(root,[[0,8.1,-138.9],[Math.cos(a)*1.1,8.1+Math.sin(a)*1.1,-138.9]],trim,.055);}box(root,.14,1.2,.13,trim,0,11.4,-140);box(root,.65,.12,.13,trim,0,11.55,-140);
 const sign=heathSign('CHURCH','#d9d2bd','#222129',4.5);sign.position.set(0,3.75,-138.85);root.add(sign);box(root,9,.13,4,wood,0,-.05,-137);
 b.exitLight=new THREE.PointLight(0xc6b991,25,20);b.exitLight.position.set(0,3,-135);root.add(b.exitLight);
}

function buildKevinChurchEnding(){
 const c=beforeStoryScene,root=new THREE.Group();root.name='Camden church / Kevin Chapter 3 ending';root.position.set(0,0,-170);c.root.add(root);
 const s=c.facelessChurch={root,phase:'entry',time:0,beat:0,line:0,doors:[],links:[],charge:0,voiceIndex:null,voiceToken:0,voiceFailed:false,voiceGap:0};
 const stone=mat(0x71675d),trim=mat(0x9e8e76),wood=mat(0x3c2725),roof=mat(0x211d21),gold=mat(0xb69b58,.45),dark=mat(0x15151b);
 box(root,18,.45,40,stone,0,-.28,0);
 // Solid walls and a complete ceiling keep the night sky outside the church.
 for(const side of [-1,1]){box(root,.6,10,36,stone,side*8.6,5,-1);for(let z=-15;z<=13;z+=4){box(root,.5,8,.6,trim,side*8.15,4,z);box(root,.07,3.2,1.3,new THREE.MeshBasicMaterial({color:z%3?0x506b9a:0x936649}),side*8.28,4.8,z+1.8);box(root,.12,.12,1.6,gold,side*8.2,4.7,z+1.8);box(root,.12,3.5,.08,gold,side*8.2,4.8,z+1.8);}}
 box(root,17.8,10,.55,stone,0,5,-18.5);box(root,18,.4,38,roof,0,10.2,-.5);
 for(let z=-15;z<16;z+=5){for(const side of [-1,1])box(root,.48,7,.5,trim,side*6.8,3.5,z);facelessChurchArch(root,0,6.5,z,13.6,2.6,wood);box(root,16,.18,.20,wood,0,9.85,z);}
 // Open aisle, pews, candles and the altar establish a recognisable church interior.
 for(let z=-8;z<=11;z+=3.2)for(const side of [-1,1]){box(root,4.9,.18,.85,wood,side*4.5,.65,z);box(root,4.9,.85,.12,wood,side*4.5,1.05,z-.45);for(const x of [side*2.5,side*6.5])box(root,.14,.7,.65,wood,x,.3,z);}
 for(let z=-17;z<17;z+=1.5)for(let x=-7.5;x<8;x+=1.5)box(root,1.46,.02,1.46,mat((Math.round(x+z)*3)%2?0x5b5650:0x756d62),x,-.045,z);
 box(root,9,.24,4,trim,0,.08,-15.5);box(root,4,1.2,1.8,stone,0,.8,-15.3);box(root,4.3,.16,2,gold,0,1.48,-15.3);box(root,.24,3.6,.24,gold,0,4,-17.5);box(root,2,.22,.24,gold,0,4.65,-17.5);
 for(const side of [-1,1])for(let n=0;n<3;n++){const x=side*(1.2+n*.35);box(root,.09,.45,.09,mat(0xd4c7ad),x,1.75,-15.3);ball(root,.035,.09,.035,new THREE.MeshBasicMaterial({color:0xffc67a}),x,2.04,-15.3);}
 for(const side of [-1,1]){box(root,6.4,10,.6,stone,side*5.9,5,17.5);const door=new THREE.Group();root.add(door);door.position.set(side*2.5,0,17.2);box(door,2.45,4.2,.16,wood,-side*1.22,2.1,0);box(door,.12,3.5,.05,gold,-side*2.2,2.1,.10);s.doors.push(door);}
 box(root,5,5.8,.6,stone,0,7.1,17.5);facelessChurchArch(root,0,4.2,17,5.2,2.4,trim);
 root.add(new THREE.HemisphereLight(0x84716c,0x1b1421,1.25));s.light=new THREE.PointLight(0xedba76,60,28);s.light.position.set(0,6,-7);root.add(s.light);const rearLight=new THREE.PointLight(0x7c98c7,25,25);rearLight.position.set(0,5,12);root.add(rearLight);
 s.hero=makeBeforeStoryKevin2018();s.hero.position.set(0,0,22);s.hero.rotation.y=Math.PI;root.add(s.hero);s.enemy=makeFacelessOpposer();s.enemy.position.set(0,0,28);s.enemy.rotation.y=Math.PI;s.enemy.visible=false;root.add(s.enemy);
 s.spectre=makeRebellionSpectre();s.spectre.position.set(-.7,.1,-5.5);s.spectre.visible=false;root.add(s.spectre);
 const geometry=new THREE.TorusGeometry(.10,.024,6,12),material=new THREE.MeshStandardMaterial({color:0x030307,emissive:0x40222b,emissiveIntensity:.25,metalness:.65,roughness:.3});
 for(let n=0;n<100;n++){const link=new THREE.Mesh(geometry,material);link.visible=false;root.add(link);s.links.push(link);}
 s.dust=mesh(new THREE.SphereGeometry(.1,6,4),new THREE.MeshBasicMaterial({color:0xbcb2a7,transparent:true,opacity:.15}),root,0,4,0);s.dust.visible=false;
 buildKevinChurchAftermath(s);return s;
}
function startKevinChurchEnding(){
 const c=beforeStoryScene,b=c?.faceless;if(!b||c.facelessChurch)return;
 stopBeforeStoryVoice();b.ended=true;b.won=true;b.hand.visible=false;b.root.visible=false;keys.clear();drag=false;document.exitPointerLock?.();facelessUI.hidden=true;
 buildKevinChurchEnding();setMode('beforeStoryKevinChurch');hideUndeadCampaignCast();world.visible=upperWorld.visible=exhibit.visible=flash.visible=false;beforeStoryUI.hidden=true;beforeStoryCinema.hidden=false;scene.background.setHex(0x0b0910);scene.fog.color.setHex(0x0b0910);scene.fog.density=.008;ambient.intensity=.45;cameraFill.intensity=.6;
 document.getElementById('beforeStoryCinemaChapter').textContent='BEFORE THE STORY / KEVIN MURDERHORN / CHAPTER 3';document.getElementById('beforeStoryCinemaTitle').innerHTML='THE DOORS CLOSE <span>CAMDEN · 2018</span>';document.getElementById('beforeStorySpeaker').textContent='';document.getElementById('beforeStoryLine').textContent='';document.getElementById('beforeStoryCount').textContent='';document.getElementById('beforeStoryNext').disabled=true;document.getElementById('beforeStoryNext').textContent='…';beforeStoryCinema.style.background='transparent';renderKevinChurchEnding(0);updateMobileControls();
}
function showKevinChurchLine(){
 const s=beforeStoryScene.facelessChurch;s.phase='rant';s.beat=0;s.timeline=beforeStorySpeechTimeline(KEVIN_CHURCH_ENDING_LINES[s.line]);
 document.getElementById('beforeStorySpeaker').textContent='KEVIN MURDERHORN / BC-01';document.getElementById('beforeStoryLine').textContent=KEVIN_CHURCH_ENDING_LINES[s.line];document.getElementById('beforeStoryCount').textContent=(s.line+1)+' / '+KEVIN_CHURCH_ENDING_LINES.length;document.getElementById('beforeStoryNext').disabled=false;document.getElementById('beforeStoryNext').textContent=s.line===4?'CONTINUE →':'CONTINUE · ENTER →';
 playKevinChurchVoice();
}
function advanceKevinChurchEnding(){
 const s=beforeStoryScene?.facelessChurch;if(mode!=='beforeStoryKevinChurch'||!s)return;
 if(s.phase==='observer'){if(s.observerFailed)playJosiahChurchVoice();return;}if(s.phase!=='rant')return;
 stopKevinChurchVoice();if(++s.line<KEVIN_CHURCH_ENDING_LINES.length)showKevinChurchLine();else startKevinChurchExplosion();
}
function completeKevinChurchEnding(){
 const s=beforeStoryScene?.facelessChurch;if(!s||s.phase!=='video'||!churchEndingVideo.ended)return;
 s.phase='complete';beforeStoryProgress.kevinFacelessCompleted=true;saveBeforeStoryProgress();refreshBeforeStoryChapters();returnFacelessCamden();churchMissionComplete.focus({preventScroll:true});churchMissionComplete.scrollIntoView({block:'center'});
}

function renderKevinChurchEnding(dt){
 const c=beforeStoryScene,s=c?.facelessChurch;if(!s||s.phase==='complete'||s.phase==='video')return;dt=THREE.MathUtils.clamp(dt,0,.05);s.time+=dt;s.beat+=dt;camera.up.set(0,1,0);
 if(s.phase==='observer'){renderJosiahChurchObservation(dt);return;}
 if(s.phase==='explosion'){
  updateKevinChurchExplosion(dt);s.light.intensity=60+Math.max(0,1-s.beat/.8)*160;let eye=s.beat<.8?new THREE.Vector3(2.7,2.55,.3):new THREE.Vector3(4.5,6,54),focus=s.beat<.8?new THREE.Vector3(0,1.6,-4):new THREE.Vector3(0,5,31);const shake=Math.max(0,1-s.beat/3)*.07;eye.x+=Math.sin(s.time*31)*shake;eye.y+=Math.sin(s.time*23)*shake;camera.position.copy(c.root.position).add(s.root.position).add(eye);camera.lookAt(c.root.position.clone().add(s.root.position).add(focus));camera.updateMatrixWorld(true);if(s.beat>=4.7)startJosiahChurchObservation();return;
 }
 let eye,focus;
 if(s.phase==='entry'){
  const run=THREE.MathUtils.smoothstep(s.time,0,5.3);s.hero.position.z=22-26*run;s.enemy.visible=s.time>1.8;const pursuit=THREE.MathUtils.smoothstep(s.time,1.8,6);s.enemy.position.z=28-18*pursuit;animateCharacter(s.time,true,true,s.hero);animateCharacter(s.time,true,true,s.enemy);
  for(const [n,door]of s.doors.entries())door.rotation.y=(n?1:-1)*1.1*(1-THREE.MathUtils.smoothstep(s.time,5.1,6.2));
  eye=new THREE.Vector3(1.6,3.0,Math.max(3,s.hero.position.z+6));focus=new THREE.Vector3(0,1.5,s.hero.position.z-2);
  if(s.time>=6.5){s.hero.position.set(0,0,-4);s.hero.rotation.y=0;s.enemy.position.set(0,0,10);s.enemy.visible=true;s.spectre.visible=true;showKevinChurchLine();}
 }else{
  animateCharacter(s.time,false,false,s.hero);animateCharacter(s.time,false,false,s.enemy);s.hero.rotation.y=0;s.enemy.rotation.y=Math.PI;
  const clip=currentKevinChurchVoice(),speechAge=clip&&!s.voiceFailed&&!clip.error?clip.currentTime:s.beat,speechDuration=clip&&Number.isFinite(clip.duration)&&clip.duration>0?clip.duration:s.timeline?.duration||10,progress=THREE.MathUtils.smoothstep(speechAge,0,speechDuration),word=s.timeline?.words.find(w=>speechAge>=w.start&&speechAge<w.end),pulse=word?Math.abs(Math.sin(speechAge*10)):0;
  s.hero.userData.head.rotation.x=-.04-pulse*.06;s.hero.userData.head.rotation.y=Math.sin(s.time*1.6)*.05;
  for(const [n,arm]of s.hero.userData.arms.entries()){arm.rotation.x=-.45-pulse*.5-(s.line>=3?.4:0);arm.rotation.z=(n?1:-1)*(.15+pulse*.16+(s.line>=3?.25:0));}
  s.enemy.userData.head.rotation.z=Math.sin(s.time*.8)*.07;
  s.spectre.position.y=.15+Math.sin(s.time*1.7)*.12;s.charge=Math.min(.65,s.line*.13+progress*.08);
  for(const [n,link]of s.links.entries()){const a=n/100*TAU*3+s.time*.18;link.visible=s.charge>.03;link.position.set(Math.cos(a)*(2+s.charge*4),.3+n/100*6,Math.sin(a)*(4+s.charge*5)+1);link.rotation.set(a,n%2*Math.PI/2,s.time*.3);}
  s.light.intensity=60+s.charge*40+Math.sin(s.time*18)*s.charge*8;
  eye=s.line===0?new THREE.Vector3(5.0-progress*.5,3.2,5):s.line===2?new THREE.Vector3(-3.4,2.6,1.7-progress*.4):new THREE.Vector3(2.7-progress*.3,2.55,.3-progress*.4);focus=new THREE.Vector3(0,1.6,-4);
  if(s.line===2&&progress>.6){const cut=THREE.MathUtils.smoothstep(progress,.6,.75);eye.lerp(new THREE.Vector3(-2.8,2.5,5.8),cut);focus.lerp(new THREE.Vector3(0,1.65,10),cut);}
  if(s.line===4&&progress<.35){const cut=1-THREE.MathUtils.smoothstep(progress,.2,.35);eye.lerp(new THREE.Vector3(1.7,3.1,13.1),cut);}
  if(s.phase==='rant'&&kevinChurchLineComplete(dt))advanceKevinChurchEnding();
 }
 camera.position.copy(c.root.position).add(s.root.position).add(eye);camera.lookAt(c.root.position.clone().add(s.root.position).add(focus));camera.updateMatrixWorld(true);
}
function clearKevinChurchEnding(){
 const c=beforeStoryScene,s=c?.facelessChurch;stopKevinChurchVoice();stopJosiahChurchVoice();stopKevinChurchVideo();if(s){stopKevinChurchExplosionSound(s);disposeCampObject(s.root);c.facelessChurch=null;beforeStoryCinema.hidden=true;}
 beforeStoryCinema.style.background='transparent';document.querySelector('.before-story-dialogue').hidden=false;facelessUI.style.background='';for(const node of facelessUI.querySelectorAll('header,aside,section'))node.hidden=false;document.getElementById('beforeStoryNext').disabled=false;
}
const churchPreviousFinishFaceless=finishFacelessCamden;finishFacelessCamden=function(won){if(won&&beforeStoryScene?.faceless&&!beforeStoryScene.faceless.ended)startKevinChurchEnding();else churchPreviousFinishFaceless(won);};
const churchPreviousClearFaceless=clearFacelessCamden;clearFacelessCamden=function(){clearKevinChurchEnding();churchPreviousClearFaceless();};
const churchPreviousNext=document.getElementById('beforeStoryNext').onclick;document.getElementById('beforeStoryNext').onclick=()=>mode==='beforeStoryKevinChurch'?advanceKevinChurchEnding():churchPreviousNext();
const churchPreviousReturn=document.getElementById('beforeStoryReturn').onclick;document.getElementById('beforeStoryReturn').onclick=()=>mode==='beforeStoryKevinChurch'?returnFacelessCamden():churchPreviousReturn();
document.addEventListener('keydown',e=>{if(mode!=='beforeStoryKevinChurch'||e.repeat)return;if(['Enter','Escape'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();if(e.code==='Enter')advanceKevinChurchEnding();else returnFacelessCamden();}},true);
const churchPreviousStopVoice=stopBeforeStoryVoice;stopBeforeStoryVoice=function(){stopKevinChurchVoice();stopJosiahChurchVoice();churchPreviousStopVoice();};
