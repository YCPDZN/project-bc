/* Kevin's independent prequel: Chapter 2, Chicago outskirts, United States, 2008. */
const KEVIN_REBELLION_LINES=[
 'Four years. Four bloody years, and I can still hear Takeshi telling me I was his. Look around, you bastard. Chicago. America. An ocean between us, and somehow your voice still thinks it owns the room inside my head.',
 'You called it discipline. You called it loyalty. You put a blade in me and then expected gratitude because you decided I could keep breathing! That was not mercy, Takeshi. That was a coward making sure his toy did not break too soon.',
 'And Bozuki—do not think I have forgotten you. Standing there with that smug look, letting your brother do the talking until you could add your own little humiliation. Two men sharing a throne, and neither of you brave enough to stand without someone beneath your boot.',
 'The Juko Zaibatsu. You say the name like it is a kingdom. Tokyo, Osaka, Sendai—names on a map you mistake for permission to do whatever the hell you want. Behind every locked door, behind every whispered order, there is somebody paying for your precious empire.',
 'I crossed the ocean. I changed streets, changed rooms, changed the way I looked over my shoulder. And then a train rattles past, or somebody laughs behind me, and suddenly I am back there. Do you understand what you left behind? Of course you do. That was the point.',
 'Now I hear Bozuki has brought his ambitions to America. Was Japan not enough for you? Did you run out of people to frighten? I did not come all this way to watch you plant the same rotten flag on another doorstep.',
 'You taught me to keep quiet. Smile when told. Wait until the door opened. Well, here is the part you did not plan for: somebody who spends years listening starts learning. Your names, your habits, the cracks between you. I have been listening, brothers.',
 'I am done begging the past to leave me alone. I am done calling every shaking hand a weakness. This rain can soak me to the bone, this thunder can drown out every word, but neither of you gets to tell me who I am again!',
 'Bozuki, you can hide behind your men. Takeshi, you can sit in Japan pretending the whole world still kneels when you speak. I will tear that certainty out of both of you. Not because somebody sent me. Because, for once, the decision is MINE.',
 'I AM NOT YOURS! DO YOU HEAR ME, TAKESHI? BOZUKI? NEVER AGAIN! AHHHH! …What the hell is that behind me? No. No, I did not call you. Whatever you are, you do not get to own me either.'
];
try{beforeStoryProgress.kevinRebellionCompleted=JSON.parse(localStorage.getItem(BEFORE_STORY_SAVE_KEY))?.kevinRebellionCompleted===true;}catch(e){beforeStoryProgress.kevinRebellionCompleted=false;}
const kevinRebellionCard=document.createElement('article');kevinRebellionCard.className='before-story-next-chapter';kevinRebellionCard.innerHTML='<small>CHAPTER 2 / 2008 / CUTSCENE</small><h2>KEVIN’S REBELLION</h2><p>Chicago outskirts, United States.<br>A thunderstorm. Two names Kevin cannot forget.</p><button id="beforeStoryKevinRebellion" type="button" disabled>LOCKED · COMPLETE CHAPTER 1</button>';document.getElementById('beforeStoryKevinBack').before(kevinRebellionCard);
const rebellionPreviousRefresh=refreshBeforeStoryChapters;refreshBeforeStoryChapters=function(){rebellionPreviousRefresh();const b=document.getElementById('beforeStoryKevinRebellion');b.disabled=!beforeStoryProgress.kevinShinjukuCompleted;b.textContent=b.disabled?'LOCKED · COMPLETE CHAPTER 1':beforeStoryProgress.kevinRebellionCompleted?'REPLAY CHAPTER 2 →':'BEGIN CHAPTER 2 →';};refreshBeforeStoryChapters();

function makeRebellionSpectre(){
 const figure=new THREE.Group(),dark=new THREE.MeshStandardMaterial({color:0x020204,emissive:0x07040a,transparent:true,opacity:.86,roughness:.8,depthWrite:false});figure.name='Kevin / black spectral figure / first manifestation';
 ball(figure,.30,.38,.27,dark,0,2.6,0);ball(figure,.49,.73,.28,dark,0,1.65,0);ball(figure,.33,.45,.22,dark,0,.92,0);
 for(const side of [-1,1]){ball(figure,.17,.58,.16,dark,side*.56,1.65,0);ball(figure,.12,.22,.14,dark,side*.56,.96,.02);ball(figure,.16,.54,.15,dark,side*.20,.49,0);}
 for(let i=0;i<5;i++){const mist=ball(figure,.3,.5,.18,dark,(i-2)*.15,.25,-.12);mist.rotation.z=(i-2)*.15;}
 figure.userData.material=dark;return figure;
}
function startRebellionStormAudio(b){
 initAudio();if(!audioCtx||!master)return;
 const buffer=audioCtx.createBuffer(1,audioCtx.sampleRate*3,audioCtx.sampleRate),samples=buffer.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=Math.random()*2-1;
 const source=audioCtx.createBufferSource(),filter=audioCtx.createBiquadFilter(),gain=audioCtx.createGain(),bus=audioCtx.createGain();source.buffer=buffer;source.loop=true;filter.type='lowpass';filter.frequency.value=2300;gain.gain.value=.18;source.connect(filter);filter.connect(gain);gain.connect(bus);bus.connect(master);source.start();b.stormAudio={source,filter,gain,bus,buffer,thunder:[]};
}
function rebellionThunder(b){
 const s=b.stormAudio;if(!s||muted)return;const source=audioCtx.createBufferSource(),filter=audioCtx.createBiquadFilter(),gain=audioCtx.createGain(),now=audioCtx.currentTime;source.buffer=s.buffer;filter.type='lowpass';filter.frequency.setValueAtTime(230,now);filter.frequency.exponentialRampToValueAtTime(65,now+2.8);gain.gain.setValueAtTime(.001,now);gain.gain.linearRampToValueAtTime(.8,now+.12);gain.gain.exponentialRampToValueAtTime(.001,now+2.8);source.connect(filter);filter.connect(gain);gain.connect(s.bus);const entry={source,filter,gain};s.thunder.push(entry);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();s.thunder=s.thunder.filter(v=>v!==entry);};source.start();source.stop(now+2.9);
}
function stopRebellionStormAudio(b){const s=b?.stormAudio;if(!s)return;s.source.stop();s.source.disconnect();s.filter.disconnect();s.gain.disconnect();for(const v of s.thunder){v.source.onended=null;v.source.stop();v.source.disconnect();v.filter.disconnect();v.gain.disconnect();}s.bus.disconnect();b.stormAudio=null;}

function buildKevinRebellion(){
 const c=beforeStoryScene,root=new THREE.Group();root.name='Kevin’s Rebellion / Chicago outskirts / United States / 2008';c.root.add(root);const b=c.rebellion={root,time:0,beat:0,line:0,nextStorm:4,flashTime:99,thunderAt:Infinity,revealTime:null};
 const mud=new THREE.MeshStandardMaterial({color:0x292a29,roughness:.30,metalness:.08}),asphalt=new THREE.MeshStandardMaterial({color:0x141b22,roughness:.24,metalness:.12}),concrete=mat(0x4b5156),steel=mat(0x333b45),grass=mat(0x233328);
 box(root,180,.5,180,mud,0,-.33,-30);box(root,12,.08,155,asphalt,16,-.045,-25);for(let z=40;z>-90;z-=7)box(root,.12,.013,3,mat(0x888477),16,.003,z);
 // An industrial fringe: freight sidings, warehouses, wet verges and a distant city.
 for(let i=0;i<5;i++){const x=-20-i%2*13,z=15-i*21,h=6+i%2*2;box(root,18,h,14,mat(i%2?0x3a454e:0x4b4946),x,h/2,z);box(root,18.6,.2,14.6,steel,x,h+.1,z);box(root,5,3.7,.08,mat(0x202930),x,1.85,z+7.05);for(let j=-6;j<=6;j+=3)box(root,1.1,.7,.08,mat(0x697477),x+j,h-1.4,z+7.05);}
 for(let i=0;i<5;i++){const container=new THREE.Group();container.position.set(-13,0,-12-i*8);root.add(container);box(container,3,2.8,6,mat(i%2?0x49392f:0x35434b),0,1.4,0);for(let x=-1.4;x<1.5;x+=.3)box(container,.03,2.5,.05,steel,x,1.4,3.03);}
 for(let x=-6;x<=8;x+=3){box(root,.055,2.8,.055,steel,x,1.4,-8);for(let y=.4;y<2.8;y+=.32)line3(root,[[x,y,-8],[x+3,y+.25,-8]],steel,.007);}
 for(let i=0;i<16;i++){const x=35+(i%5)*8,z=-65-Math.floor(i/5)*12,h=10+(i*7)%24;box(root,6,h,7,mat(0x303a48),x,h/2,z);for(let y=3;y<h;y+=3)for(let dx=-2;dx<=2;dx+=2)box(root,.55,.55,.03,mat(0x7e8074),x+dx,y,z+3.52);}
 // Elevated roadway and muddy roadside runoff keep the horizon grounded.
 box(root,160,.7,10,concrete,5,7,-43);for(let x=-65;x<80;x+=18)box(root,1.3,7,1.3,concrete,x,3.5,-43);box(root,160,.6,.25,steel,5,7.6,-38.2);
 for(let i=0;i<48;i++){const x=-65+Math.random()*130,z=-60+Math.random()*100;if(x>9&&x<23)continue;ball(root,.5+Math.random(),.12,.4+Math.random(),grass,x,-.04,z);}
 const water=new THREE.MeshStandardMaterial({color:0x4a5963,metalness:.5,roughness:.12,transparent:true,opacity:.65,side:THREE.DoubleSide});
 for(let i=0;i<34;i++){const puddle=mesh(new THREE.CircleGeometry(1,32),water,root,-8+Math.random()*17,-.038,-7+Math.random()*17);puddle.rotation.x=-Math.PI/2;puddle.scale.set(.3+Math.random()*1.8,.3+Math.random()*.8,1);}
 b.ripples=[];const rippleMaterial=new THREE.MeshBasicMaterial({color:0x9aaab8,transparent:true,opacity:.15,depthWrite:false});for(let i=0;i<24;i++){const ripple=mesh(new THREE.RingGeometry(.94,1,24),rippleMaterial.clone(),root,-6+Math.random()*12,-.025,-5+Math.random()*10);ripple.rotation.x=-Math.PI/2;b.ripples.push(ripple);}
 b.clouds=new THREE.Group();root.add(b.clouds);const cloud=mat(0x28323e);for(let i=0;i<28;i++)ball(b.clouds,14+Math.random()*9,3+Math.random()*4,9+Math.random()*12,cloud,-70+Math.random()*140,31+Math.random()*12,-85+Math.random()*125);
 const lamp=new THREE.PointLight(0xc9dae3,35,30);lamp.position.set(5,5,5);root.add(lamp);box(root,.13,5,.13,steel,5,2.5,5);box(root,.7,.15,.3,new THREE.MeshBasicMaterial({color:0xd0dce1}),5,5,5);
 b.lightning=new THREE.DirectionalLight(0xdde9ff,0);b.lightning.position.set(-20,38,10);root.add(b.lightning,new THREE.HemisphereLight(0x78889c,0x292e2b,.9));
 b.bolt=new THREE.Group();b.bolt.visible=false;root.add(b.bolt);const boltMat=new THREE.MeshBasicMaterial({color:0xebf3ff});line3(b.bolt,[[-15,43,-25],[-12,34,-24],[-17,27,-25],[-11,19,-24],[-14,12,-26]],boltMat,.075);line3(b.bolt,[[-17,27,-25],[-24,24,-25],[-29,18,-25]],boltMat,.035);
 const drops=new Float32Array(2300*6);for(let i=0;i<2300;i++){const n=i*6,x=Math.random()*40-20,y=Math.random()*25,z=Math.random()*38-18;drops.set([x,y,z,x+.22,y-.9,z+.06],n);}const rainGeo=new THREE.BufferGeometry();rainGeo.setAttribute('position',new THREE.BufferAttribute(drops,3));b.rain=new THREE.LineSegments(rainGeo,new THREE.LineBasicMaterial({color:0xafc0d3,transparent:true,opacity:.44,depthWrite:false}));b.rain.name='Violent wind-driven rain';b.rain.frustumCulled=false;root.add(b.rain);
 b.hero=makeBeforeStoryKevin2004();b.hero.name='Kevin Murderhorn / Chicago / 2008';b.hero.userData.year=2008;b.hero.traverse(o=>{for(const m of [].concat(o.material||[]))if(m.isMeshStandardMaterial)m.roughness=Math.min(m.roughness,.48);});root.add(b.hero);b.mouth=makeBeforeStorySpeechMouth('rebellionKevin',b.hero);
 b.spectre=makeRebellionSpectre();b.spectre.position.set(.1,.25,-1.9);b.spectre.visible=false;root.add(b.spectre);return b;
}
function clearKevinRebellion(){const c=beforeStoryScene;if(c?.rebellion){stopRebellionStormAudio(c.rebellion);disposeCampObject(c.rebellion.root);c.rebellion=null;}document.getElementById('beforeStoryNext').disabled=false;keys.clear();}
function startKevinRebellion(){
 const c=beforeStoryScene;if(mode!=='beforeStoryMenu'||!c||!beforeStoryProgress.kevinShinjukuCompleted)return;clearKevinShinjuku();clearKevinRebellion();stopBeforeStoryVoice();
 for(const key of ['menuSet','romeSet','jukoSet','lastJukoSet','heathNarrationSet'])if(c[key])c[key].visible=false;for(const actor of Object.values(c.cast))actor.visible=false;if(c.crownMenu)c.crownMenu.visible=false;
 c.story='kevin';c.chapter='kevinRebellion';const b=buildKevinRebellion();setMode('beforeStoryRebellion');beforeStoryUI.hidden=true;beforeStoryCinema.hidden=false;hideUndeadCampaignCast();world.visible=upperWorld.visible=exhibit.visible=flash.visible=false;scene.background.setHex(0x273443);scene.fog.color.setHex(0x273443);scene.fog.density=.014;ambient.intensity=.65;cameraFill.intensity=.6;keys.clear();
 document.getElementById('beforeStoryCinemaChapter').textContent='BEFORE THE STORY / KEVIN MURDERHORN / CHAPTER 2';document.getElementById('beforeStoryCinemaTitle').innerHTML='KEVIN’S REBELLION <span>2008 · CHICAGO OUTSKIRTS · UNITED STATES</span>';showKevinRebellionLine();startRebellionStormAudio(b);renderKevinRebellion(0);syncMenuSong();updateMobileControls();
}
function showKevinRebellionLine(){const b=beforeStoryScene.rebellion;b.beat=0;b.timeline=beforeStorySpeechTimeline(KEVIN_REBELLION_LINES[b.line]);document.getElementById('beforeStorySpeaker').textContent='KEVIN MURDERHORN / BC-01';document.getElementById('beforeStoryLine').textContent=KEVIN_REBELLION_LINES[b.line];document.getElementById('beforeStoryCount').textContent=(b.line+1)+' / 10';document.getElementById('beforeStoryNext').textContent='CONTINUE →';document.getElementById('beforeStoryNext').disabled=b.line===9;playKevinRebellionVoice();}
function returnKevinRebellion(){clearKevinRebellion();beforeStoryCinema.hidden=true;returnBeforeStoryRome();selectBeforeStoryCast('kevin2004');beforeStoryKevinChapters.hidden=false;beforeStoryKevinButton.setAttribute('aria-expanded','true');document.getElementById('beforeStoryKevinRebellion').focus();updateMobileControls();}
function advanceKevinRebellion(){const b=beforeStoryScene?.rebellion;if(mode!=='beforeStoryRebellion'||!b)return;if(b.line===9){if(b.revealTime===null||b.revealTime<3.5)return;startBozukiConfrontation();}else{b.line++;showKevinRebellionLine();}}
function renderKevinRebellion(dt){
 const c=beforeStoryScene,b=c?.rebellion;if(!b)return;dt=Math.max(0,Math.min(.1,dt));b.time+=dt;b.beat+=dt;b.flashTime+=dt;
 if(b.time>=b.nextStorm){b.flashTime=0;b.thunderAt=b.time+.8;b.nextStorm=b.time+7+Math.random()*6;}if(b.time>=b.thunderAt){rebellionThunder(b);b.thunderAt=Infinity;}
 const flash=b.flashTime<.13?3.8:b.flashTime>.23&&b.flashTime<.34?2.2:0;b.lightning.intensity=flash;b.bolt.visible=flash>0;
 const a=b.hero,u=a.userData;animateCharacter(b.time,false,false,a);const final=b.line===9,voiceClock=kevinRebellionVoiceClock(),scream=final&&voiceClock>0&&voiceClock<2.5,agitation=.02+b.line*.008;
 u.body.rotation.x=scream?-.15:.04+Math.sin(b.time*2.7)*agitation;u.body.position.y=Math.sin(b.time*3)*.014;u.head.rotation.set(scream?-.24:.015+Math.sin(b.time*1.8)*.05,Math.sin(b.time*.7)*.1,0);
 for(const [i,arm]of u.arms.entries()){const side=i?1:-1;arm.rotation.set(scream?-1.4:-.22-Math.max(0,Math.sin(b.beat*1.8+i))*.55,0,side*(scream?.85:.16+Math.sin(b.time*2)*agitation));}
 const level=kevinRebellionVoiceLevel();b.mouth.open.visible=level>.04;b.mouth.open.scale.set(b.mouth.width,.006+level*.035,.009);b.mouth.closed.visible=!b.mouth.open.visible;if(u.openMouth)u.openMouth.visible=false;
 if(final&&b.revealTime===null&&kevinRebellionRevealReady()){b.revealTime=0;b.spectre.visible=true;b.flashTime=0;b.thunderAt=b.time+.25;}
 if(b.revealTime!==null){b.revealTime+=dt;const reveal=THREE.MathUtils.smoothstep(b.revealTime,0,1.5);b.spectre.scale.setScalar(.2+reveal*1.1);b.spectre.position.y=.22+Math.sin(b.time*1.4)*.08;b.spectre.userData.material.opacity=.88*reveal;document.getElementById('beforeStoryNext').disabled=b.revealTime<3.5;}
 const drops=b.rain.geometry.attributes.position;for(let i=0;i<drops.count;i+=2){let x=drops.getX(i)+dt*5,y=drops.getY(i)-dt*22,z=drops.getZ(i)+dt*1.3;if(y<-.1)y+=25;if(x>20)x-=40;if(z>20)z-=38;drops.setXYZ(i,x,y,z);drops.setXYZ(i+1,x+.22,y-.9,z+.06);}drops.needsUpdate=true;
 for(const [i,ripple]of b.ripples.entries()){const p=(b.time*1.1+i/24)%1;ripple.scale.setScalar(.05+p*.55);ripple.material.opacity=(1-p)*.17;}b.clouds.position.x=Math.sin(b.time*.025)*3;
 // Upright camera: establish the wet outskirts, then hold Kevin and the figure in one shot.
 const approach=THREE.MathUtils.smoothstep(b.time,0,8),eye=new THREE.Vector3(9,5.2,13).lerp(new THREE.Vector3(3.6,2.7,6.6),approach),focus=new THREE.Vector3(1,2,-8).lerp(new THREE.Vector3(0,1.7,-.1),approach);if(final){eye.set(2.4,2.8,7.3);focus.set(0,1.9,-.65);}eye.x+=Math.sin(b.time*.12)*.10;camera.up.set(0,1,0);camera.position.copy(c.root.position).add(eye);camera.lookAt(c.root.position.clone().add(focus));camera.updateMatrixWorld(true);
 if(kevinRebellionLineComplete(dt)&&(!final||b.revealTime!==null&&b.revealTime>=3.5))advanceKevinRebellion();
}
document.getElementById('beforeStoryKevinRebellion').onclick=startKevinRebellion;
const rebellionPreviousNext=document.getElementById('beforeStoryNext').onclick;document.getElementById('beforeStoryNext').onclick=()=>mode==='beforeStoryRebellion'?advanceKevinRebellion():rebellionPreviousNext();
const rebellionPreviousReturn=document.getElementById('beforeStoryReturn').onclick;document.getElementById('beforeStoryReturn').onclick=()=>mode==='beforeStoryRebellion'?returnKevinRebellion():rebellionPreviousReturn();
const rebellionPreviousClear=clearBeforeStoryMenu;clearBeforeStoryMenu=function(){clearKevinRebellion();rebellionPreviousClear();};
document.addEventListener('keydown',e=>{if(mode!=='beforeStoryRebellion'||e.repeat)return;if(['Enter','Escape'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();if(e.code==='Enter')advanceKevinRebellion();else returnKevinRebellion();}},true);
