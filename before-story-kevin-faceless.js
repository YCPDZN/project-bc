/* Kevin's third personal chapter. It shares no campaign actors or save flags. */
const BEFORE_STORY_KEVIN_END_THEME=new Audio('assets/KEVIN-END-THEME.mp3');
BEFORE_STORY_KEVIN_END_THEME.loop=true;BEFORE_STORY_KEVIN_END_THEME.preload='metadata';BEFORE_STORY_KEVIN_END_THEME.volume=.55;AudioOptions.category(BEFORE_STORY_KEVIN_END_THEME,'music');
const kevinEndPreviousStoryTheme=selectedBeforeStoryTheme;
selectedBeforeStoryTheme=function(){return beforeStoryScene?.story==='kevin'&&beforeStoryProgress.kevinFacelessCompleted?BEFORE_STORY_KEVIN_END_THEME:kevinEndPreviousStoryTheme();};
const FACELESS_CAMDEN_QUOTES=[
 'Keep running, Murderhorn. I want you to hear every footstep behind you.',
 'I could catch you now. But then I would miss the best part.',
 'Listen to that breathing. Finally, a sound of yours I enjoy.',
 'Go on, call for help. I want an audience.',
 'The fire took my face. It left me with a beautiful appetite for your suffering.',
 'I will let you see the exit before I drag you away from it.',
 'Beg louder. Camden should hear what its monster sounds like afraid.',
 'There is no bargain, no mercy. I am doing this because I enjoy it.',
 'Reach for that train. Give yourself one last stupid hope.',
 'When you stumble, I will smile beneath this mask. You will hear it.'
];
const facelessVoices=[new Audio('assets/KEVIN-TFO1.mp3'),new Audio('assets/KEVIN-TFO2.mp3'),new Audio('assets/KEVIN-TFO3.mp3'),new Audio('assets/KEVIN-TFO4.mp3'),new Audio('assets/KEVIN-TFO5.mp3'),new Audio('assets/KEVIN-TFO6.mp3'),new Audio('assets/KEVIN-TFO7.mp3'),new Audio('assets/KEVIN-TFO8.mp3'),new Audio('assets/KEVIN-TFO9.mp3'),new Audio('assets/KEVIN-TFO10.mp3')];
const FACELESS_VOICE_DURATIONS=[5.068,3.709,5.146,3.971,5.956,4.127,5.799,7.889,6.269,7.079];
for(const clip of facelessVoices){clip.preload='metadata';clip.volume=.9;AudioOptions.category(clip,'voice');}
function currentFacelessVoice(){const b=beforeStoryScene?.faceless;return b&&b.voiceIndex!==null?facelessVoices[b.voiceIndex]:null;}
function stopFacelessVoice(){
 for(const clip of facelessVoices){clip.pause();clip.currentTime=0;}
 const b=beforeStoryScene?.faceless;if(b){b.voiceToken=(b.voiceToken||0)+1;b.voiceIndex=null;b.voicePaused=false;b.nextVoice=0;}
 document.getElementById('facelessQuote').hidden=true;
}
function playFacelessVoice(index){
 const b=beforeStoryScene?.faceless;if(!b||b.paused||b.ended||b.phase!=='run')return;
 for(const clip of facelessVoices){clip.pause();clip.currentTime=0;}
 b.voiceToken=(b.voiceToken||0)+1;b.voiceIndex=index;b.nextVoice=index+1;b.voiceAge=0;b.voiceGap=0;b.voiceFailed=false;b.voicePaused=false;
 const clip=facelessVoices[index],token=b.voiceToken;clip.muted=muted;
 const failed=()=>{if(beforeStoryScene?.faceless===b&&b.voiceToken===token)b.voiceFailed=true;};
 try{clip.play()?.catch(failed);}catch(e){failed();}
}
function pauseFacelessVoice(){const b=beforeStoryScene?.faceless,clip=currentFacelessVoice();if(b&&clip){b.voicePaused=!clip.paused&&!clip.ended;clip.pause();}}
function resumeFacelessVoice(){
 const b=beforeStoryScene?.faceless,clip=currentFacelessVoice();if(!b||b.paused||b.ended||!b.voicePaused||!clip)return;
 b.voicePaused=false;const token=b.voiceToken;try{clip.play()?.catch(()=>{if(beforeStoryScene?.faceless===b&&b.voiceToken===token)b.voiceFailed=true;});}catch(e){b.voiceFailed=true;}
}
function updateFacelessQuote(dt=0){
 const b=beforeStoryScene?.faceless,quote=document.getElementById('facelessQuote');
 if(!b||b.phase!=='run'||b.paused||b.ended){quote.hidden=true;return;}
 if(b.voiceIndex===null&&b.nextVoice<facelessVoices.length)playFacelessVoice(b.nextVoice);
 let clip=currentFacelessVoice();if(!clip){quote.hidden=true;return;}
 clip.muted=muted;b.voiceAge+=dt;
 // The masked speaker keeps his face covered; subtitles follow the actual recording.
 const finished=b.voiceFailed||clip.error?b.voiceAge>=FACELESS_VOICE_DURATIONS[b.voiceIndex]:clip.ended||Number.isFinite(clip.duration)&&clip.duration>0&&clip.currentTime>=clip.duration-.01&&!clip.paused;
 if(finished){b.voiceGap+=dt;if(b.voiceGap>=1.1){if(b.nextVoice<facelessVoices.length){playFacelessVoice(b.nextVoice);clip=currentFacelessVoice();}else{b.voiceIndex=null;quote.hidden=true;return;}}}
 quote.hidden=b.voiceGap>=.6;if(!quote.hidden)document.getElementById('facelessQuoteText').textContent=FACELESS_CAMDEN_QUOTES[b.voiceIndex];
}
try{beforeStoryProgress.kevinFacelessCompleted=JSON.parse(localStorage.getItem(BEFORE_STORY_SAVE_KEY))?.kevinFacelessCompleted===true;}catch(e){beforeStoryProgress.kevinFacelessCompleted=false;}
const facelessCastButton=document.createElement('button');facelessCastButton.id='kevinStorySelectFaceless';facelessCastButton.type='button';facelessCastButton.textContent='BC-04 · TAJIRI JUKO';facelessCastButton.setAttribute('aria-pressed','false');kevinStoryCast.appendChild(facelessCastButton);KEVIN_STORY_CAST_IDS.push('faceless2018');
KEVIN_STORY_PROFILES.faceless2018=['BC-04','TAJIRI JUKO','ALIGNMENT: CHAOTIC EVIL','The Faceless Opposer. Takeshi Juko’s son and the nephew of Bozuki and Boki. In 2013, Tajiri fell into the fire during his confrontation with Josiah and Kevin. He survived, but the flames disfigured his nose. Concealing the damage behind a white mask, he became the Faceless Opposer. By 2018, he is pursuing Kevin through Camden.'];
const facelessCard=document.createElement('article');facelessCard.className='before-story-next-chapter';facelessCard.innerHTML='<small>CHAPTER 3 / 2018 / ESCAPE</small><h2>THE FACELESS OPPOSER</h2><p>Camden, London. Run from the Faceless Opposer and reach the church.</p><button id="beforeStoryKevinFaceless" type="button" disabled>LOCKED · COMPLETE CHAPTER 2</button>';document.getElementById('beforeStoryKevinBack').before(facelessCard);
function makeBeforeStoryKevin2018(){
 // Use the same revealed Kevin factory as the campaign menu, with owned resources.
 const actor=isolateBeforeStoryModel(makeRevealedKevin());
 Object.assign(actor.userData,{beforeStoryCode:'BC-01',year:2018,alignment:'Chaotic Evil',menuEra:'masked2018',plainBlackMask:true,appearanceSource:'kevinRevealed'});
 actor.name='Kevin Murderhorn / 2018 / campaign revealed model / plain black mask';return actor;
}

function makeFacelessOpposer(){
 const actor=isolateBeforeStoryModel(makeTrueSuccessorTajiri()),u=actor.userData,head=u.head,white=mat(0xedeef0),ink=mat(0x09090b),red=mat(0x60202e),gold=mat(0xd9aa3c,.55);
 for(const arm of u.arms)arm.traverse(o=>{for(const material of [].concat(o.material||[]))if(material.color?.getHex()===0xe9bd89)material.color.setHex(0x08090a);});
 u.mouth.visible=false;const shape=new THREE.Shape();shape.moveTo(-.285,.235);shape.quadraticCurveTo(0,.19,.285,.235);shape.lineTo(.268,-.19);shape.quadraticCurveTo(.18,-.36,0,-.385);shape.quadraticCurveTo(-.18,-.36,-.268,-.19);shape.closePath();
 const beforeMask=new Set(head.children);const mask=mesh(new THREE.ExtrudeGeometry(shape,{depth:.027,bevelEnabled:true,bevelSize:.008,bevelThickness:.005,bevelSegments:1}),white,head,0,0,.32);mask.name='Faceless Opposer / white mask over disfigured nose';
 for(const side of [-1,1]){
  const eye=new THREE.Shape();eye.moveTo(side*.055,.015);eye.lineTo(side*.235,.055);eye.lineTo(side*.155,-.12);eye.closePath();mesh(new THREE.ShapeGeometry(eye),ink,head,0,0,.355);
  const streak=new THREE.Shape();streak.moveTo(side*.17,-.135);streak.lineTo(side*.145,-.25);streak.lineTo(side*.195,-.21);streak.closePath();mesh(new THREE.ShapeGeometry(streak),red,head,0,0,.357);
  for(let n=0;n<3;n++)ball(head,.010,.010,.004,red,side*(.065+n*.045),.09+n*.006,.355);
 }
 for(const side of [-1,1]){ball(u.body,.028,.045,.012,gold,side*.23,1.60,.18);ball(u.body,.022,.023,.011,gold,side*.19,1.48,.226);}ball(u.body,.045,.054,.015,gold,-.12,1.46,.23);
 Object.assign(u,{beforeStoryCode:'BC-04',year:2018,alignment:'Chaotic Evil',title:'The Faceless Opposer',facelessMask:mask,facelessMaskPieces:head.children.filter(o=>!beforeMask.has(o)),menuEra:'faceless2018'});actor.name='BC-04 / The Faceless Opposer / Camden 2018';return actor;
}
const facelessPreviousSelect=selectBeforeStoryCast;selectBeforeStoryCast=function(id){
 const c=beforeStoryScene;if(c&&mode==='beforeStoryMenu'){
  if(id==='kevin2004'){const era=beforeStoryProgress.kevinRebellionCompleted?'masked2018':'unmasked2004';if(c.cast[id]&&c.cast[id].userData.menuEra!==era){const old=c.cast[id];if(c.actor===old)c.actor=null;disposeCampObject(old);delete c.cast[id];}if(!c.cast[id]){const actor=era==='masked2018'?makeBeforeStoryKevin2018():makeBeforeStoryKevin2004();actor.userData.menuEra=era;c.cast[id]=actor;c.root.add(actor);}}
  if(id==='faceless2018'&&!c.cast[id]){c.cast[id]=makeFacelessOpposer();c.root.add(c.cast[id]);}
 }
 facelessPreviousSelect(id);if(!c||mode!=='beforeStoryMenu')return;
 if(id==='faceless2018'){document.getElementById('beforeStoryCode').textContent='BC-04 / CHARACTER STORY 04 / YEAR 2018';document.getElementById('beforeStoryName').textContent='TAJIRI JUKO · THE FACELESS OPPOSER';}
 if(id==='kevin2004'&&beforeStoryProgress.kevinRebellionCompleted){document.getElementById('beforeStoryCode').textContent='BC-01 / CHARACTER STORY 04 / YEAR 2018';document.getElementById('beforeStoryAlignment').textContent='ALIGNMENT: CHAOTIC EVIL';document.getElementById('beforeStoryProfileText').textContent='Kevin Murderhorn after his spectral awakening and confrontation with Bozuki. By 2018, he wears an all-black outfit and a plain black mask. In Camden, the Faceless Opposer pursues him.';}
};
facelessCastButton.onclick=()=>selectBeforeStoryCast('faceless2018');
const facelessPreviousRefresh=refreshBeforeStoryChapters;refreshBeforeStoryChapters=function(){facelessPreviousRefresh();const button=document.getElementById('beforeStoryKevinFaceless');button.disabled=!beforeStoryProgress.kevinRebellionCompleted;button.textContent=button.disabled?'LOCKED · COMPLETE CHAPTER 2':beforeStoryProgress.kevinFacelessCompleted?'REPLAY CHAPTER 3 →':'BEGIN CHAPTER 3 →';};refreshBeforeStoryChapters();

const facelessUI=document.createElement('section');facelessUI.id='beforeStoryFacelessHUD';facelessUI.hidden=true;facelessUI.innerHTML='<header><small>BEFORE THE STORY / KEVIN MURDERHORN / CHAPTER 3</small><h2>THE FACELESS OPPOSER</h2><p>CAMDEN · 2018</p><b id="facelessObjective">A FIGURE AT THE END OF THE STREET</b><p id="facelessHint">Reach the church. Keep moving.</p><div class="faceless-meter"><i id="facelessProgress"></i></div></header><aside><canvas id="facelessMap" width="180" height="260"></canvas><small>CYAN · YOU / RED · OPPOSER / GREEN · EXIT</small></aside><section><small>STAMINA</small><div class="faceless-meter"><i id="facelessStamina"></i></div><b id="facelessDistance"></b><button id="facelessView" type="button">VIEW: THIRD PERSON · V</button><button id="facelessPause" type="button">PAUSE · ESC</button></section><footer>WASD MOVE · SHIFT RUN · Q / SPACE DODGE · V CAMERA · ESC PAUSE</footer><div id="facelessQuote" hidden><small>THE FACELESS OPPOSER</small><p id="facelessQuoteText"></p></div><div id="facelessModal" hidden><div><small>THE FACELESS OPPOSER</small><h2 id="facelessResult"></h2><p id="facelessResultText"></p><button id="facelessResume" type="button">RESUME</button><button id="facelessRetry" type="button">RETRY ESCAPE</button><button id="facelessReturn" type="button">BACK TO BEFORE THE STORY</button></div></div>';document.body.appendChild(facelessUI);
function buildFacelessCamden(){
 const c=beforeStoryScene,root=new THREE.Group();root.name='Camden / Faceless Opposer escape / 2018';c.root.add(root);const b=c.faceless={root,time:0,phase:'intro',position:new THREE.Vector3(0,0,45),stamina:100,dodge:0,dodgeCooldown:0,thirdPerson:true,paused:false,ended:false,obstacles:[],step:0,voiceIndex:null,nextVoice:0,voiceAge:0,voiceGap:0,voiceToken:0,voicePaused:false};
 const asphalt=mat(0x20262b),stone=mat(0x565453),curb=mat(0x777678),brick=[mat(0x5e4640),mat(0x59443b),mat(0x373c43)],glass=mat(0x172832),steel=mat(0x161c20),lamp=new THREE.MeshBasicMaterial({color:0xe7c78a});
 box(root,52,.4,260,asphalt,0,-.28,-40);for(const side of [-1,1]){box(root,5,.12,240,stone,side*8.5,-.02,-40);box(root,.2,.25,240,curb,side*6,.05,-40);}
 for(let z=65;z>-145;z-=7){box(root,.11,.018,2.5,mat(0xb2a66a),-.13,-.065,z);box(root,.11,.018,2.5,mat(0xb2a66a),.13,-.065,z);}
 const names=['CAMDEN RECORDS','MARKET','THE LOCK','BOOKSHOP','CAMDEN HIGH STREET','NIGHT CAFE','STABLES','LONDON'];
 for(const side of [-1,1])for(let n=0;n<18;n++){const z=56-n*11,height=8+n%3*2,x=side*14;box(root,8,height,10,brick[n%3],x,height/2,z);for(let y=3.8;y<height;y+=2.4)for(const dz of [-3,0,3]){box(root,.12,1.65,1.4,stone,side*9.96,y,z+dz);box(root,.14,1.4,1.16,glass,side*9.88,y,z+dz);}box(root,.85,.24,8,steel,side*9.65,2.7,z);for(const dz of [-2.5,2.5]){box(root,.12,2.2,3.6,glass,side*9.88,1.15,z+dz);box(root,.16,2.5,.13,stone,side*9.83,1.3,z+dz+1.86);}const sign=heathSign(names[n%names.length],n%3===0?'#e2b86b':'#c8c9c4','#1b2227',5.3);sign.position.set(side*9.46,2.3,z);sign.rotation.y=-side*Math.PI/2;root.add(sign);
  if(n%3===0){box(root,.1,5.3,.1,steel,side*5.8,2.6,z);ball(root,.18,.10,.18,lamp,side*5.8,5.3,z);const light=new THREE.PointLight(0xd5ae75,12,18);light.position.set(side*5.8,5,z);root.add(light);}
 }
 // Low street furniture and parked vehicles leave a navigable route on both sides.
 for(const [x,z,w,d]of [[-2,-12,2.4,2],[2,-37,2.3,2],[-2,-65,2.7,2.2],[1.9,-91,2.5,2]]){box(root,w,1.05,d,mat(0x414d41),x,.5,z);box(root,w+.12,.12,d+.12,stone,x,1.07,z);for(let n=0;n<5;n++)ball(root,.24,.27,.24,mat(0x202e23),x-w*.4+n*w*.2,1.2,z);b.obstacles.push({x,z,w,d});}
 for(const [x,z]of [[4.5,16],[-4.5,-26],[4.5,-58],[-4.5,-112]]){box(root,1.9,.8,4.2,mat(0x354556),x,.55,z);box(root,1.6,.65,2.1,glass,x,1.24,z-.15);for(const dx of [-1,1])for(const dz of [-1.3,1.3])ball(root,.12,.32,.32,steel,x+dx*.9,.32,z+dz);b.obstacles.push({x,z,w:2,d:4.3});}
 const bridge=mat(0x243b38);box(root,34,1.1,4,bridge,0,6.6,-70);for(const side of [-1,1])box(root,1.5,6.5,4,brick[1],side*10,3.25,-70);const bridgeSign=heathSign('CAMDEN','#ded5b0','#243b38',7);bridgeSign.position.set(0,6.55,-67.95);root.add(bridgeSign);
 buildFacelessChurchExterior(root,b);
 const moon=new THREE.DirectionalLight(0xa5b8cd,1.8);moon.position.set(-6,18,15);root.add(moon,new THREE.HemisphereLight(0x8497b2,0x26201d,1.2));
 b.hero=makeBeforeStoryKevin2018();b.hero.position.copy(b.position);root.add(b.hero);b.enemy=makeFacelessOpposer();b.enemy.position.set(0,0,60);root.add(b.enemy);b.enemy.rotation.y=Math.PI;
 b.hand=new THREE.Group();camera.add(b.hand);for(const side of [-1,1])ball(b.hand,.09,.12,.17,mat(0x060709),side*.30,-.38,-.65);b.hand.visible=false;return b;
}
function clearFacelessCamden(){const c=beforeStoryScene,b=c?.faceless;if(!b)return;stopFacelessVoice();keys.clear();drag=false;document.exitPointerLock?.();disposeCampObject(b.hand);disposeCampObject(b.root);c.faceless=null;updateFacelessQuote();facelessUI.hidden=true;facelessUI.style.boxShadow='none';}
function startFacelessCamden(){
 const c=beforeStoryScene;if(mode!=='beforeStoryMenu'||!c||!beforeStoryProgress.kevinRebellionCompleted)return;clearFacelessCamden();clearBozukiEncounter();clearKevinRebellion();clearKevinShinjuku();stopBeforeStoryVoice();
 for(const key of ['menuSet','romeSet','jukoSet','lastJukoSet','heathNarrationSet'])if(c[key])c[key].visible=false;for(const actor of Object.values(c.cast))actor.visible=false;if(c.crownMenu)c.crownMenu.visible=false;c.story='kevin';c.chapter='kevinFaceless';buildFacelessCamden();setMode('beforeStoryFaceless');hideUndeadCampaignCast();world.visible=upperWorld.visible=exhibit.visible=flash.visible=false;beforeStoryUI.hidden=beforeStoryCinema.hidden=true;facelessUI.hidden=false;document.getElementById('facelessModal').hidden=true;scene.background.setHex(0x1b2433);scene.fog.color.setHex(0x1b2433);scene.fog.density=.012;ambient.intensity=.8;cameraFill.intensity=.5;keys.clear();yaw=0;pitch=-.01;renderFacelessCamden(0);updateMobileControls();
}
function facelessBlocked(x,z,r=.35){const b=beforeStoryScene.faceless;return b.obstacles.find(o=>Math.abs(x-o.x)<o.w/2+r&&Math.abs(z-o.z)<o.d/2+r);}
function moveFacelessActor(p,delta,r=.35){const x=THREE.MathUtils.clamp(p.x+delta.x,-5.5,5.5),z=THREE.MathUtils.clamp(p.z+delta.z,-137,68);if(!facelessBlocked(x,p.z,r))p.x=x;if(!facelessBlocked(p.x,z,r))p.z=z;p.y=0;}
function dodgeFaceless(){const b=beforeStoryScene?.faceless;if(mode!=='beforeStoryFaceless'||!b||b.phase!=='run'||b.paused||b.ended||b.dodgeCooldown>0||b.stamina<12)return;b.stamina-=12;b.dodge=.32;b.dodgeCooldown=1.2;b.dodgeDirection=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));if(keys.has('KeyA'))b.dodgeDirection.set(-Math.cos(yaw),0,Math.sin(yaw));if(keys.has('KeyD'))b.dodgeDirection.set(Math.cos(yaw),0,-Math.sin(yaw));}
function facelessCamera(){const c=beforeStoryScene,b=c.faceless;b.hero.position.copy(b.position);b.hero.rotation.y=yaw+Math.PI;b.hero.visible=b.thirdPerson;b.hand.visible=!b.thirdPerson&&!b.ended;const eye=b.position.clone().add(new THREE.Vector3(0,1.75,0));if(b.thirdPerson)eye.add(new THREE.Vector3(Math.sin(yaw)*3.8+Math.cos(yaw)*1.25,.45,Math.cos(yaw)*3.8-Math.sin(yaw)*1.25));eye.x=THREE.MathUtils.clamp(eye.x,-5.8,5.8);eye.z=THREE.MathUtils.clamp(eye.z,-138,69);camera.up.set(0,1,0);camera.position.copy(c.root.position).add(eye);camera.rotation.order='YXZ';if(b.thirdPerson){const target=b.position.clone().add(new THREE.Vector3(0,1.55,0)).add(new THREE.Vector3(-Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch)).multiplyScalar(15));camera.lookAt(c.root.position.clone().add(target));}else camera.rotation.set(pitch,yaw,0);camera.updateMatrixWorld(true);document.getElementById('facelessView').textContent='VIEW: '+(b.thirdPerson?'THIRD PERSON':'FIRST PERSON')+' · V';}
function drawFacelessMap(){const b=beforeStoryScene.faceless,canvas=document.getElementById('facelessMap'),ctx=canvas.getContext('2d'),x=v=>90+v*8,z=v=>10+(68-v)/205*238;ctx.fillStyle='#0c1218';ctx.fillRect(0,0,180,260);ctx.fillStyle='#39434a';ctx.fillRect(43,8,94,242);ctx.fillStyle='#53605c';for(const o of b.obstacles)ctx.fillRect(x(o.x-o.w/2),z(o.z+o.d/2),o.w*8,o.d/205*238);ctx.fillStyle='#86cba3';ctx.fillRect(66,z(-134),48,6);for(const [p,color]of [[b.position,'#79e3f2'],[b.enemy.position,'#e85e79']]){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x(p.x),z(p.z),4,0,TAU);ctx.fill();}ctx.fillStyle='#c7d3dc';ctx.font='9px monospace';ctx.fillText('CAMDEN / N ↑',9,12);}
function finishFacelessCamden(won){const b=beforeStoryScene?.faceless;if(!b||b.ended)return;b.ended=true;b.won=won;stopFacelessVoice();updateFacelessQuote();keys.clear();document.exitPointerLock?.();b.hand.visible=false;document.getElementById('facelessModal').hidden=false;document.getElementById('facelessResume').hidden=true;document.getElementById('facelessRetry').hidden=won;document.getElementById('facelessResult').textContent=won?'KEVIN ESCAPED':'THE OPPOSER CAUGHT YOU';document.getElementById('facelessResultText').textContent=won?'Chapter 3: The Faceless Opposer completed.':'Run, dodge and use the street furniture to keep your distance.';if(won){beforeStoryProgress.kevinFacelessCompleted=true;saveBeforeStoryProgress();refreshBeforeStoryChapters();}updateMobileControls();}
function pauseFacelessCamden(){const b=beforeStoryScene?.faceless;if(mode!=='beforeStoryFaceless'||!b||b.ended||b.paused)return;b.paused=true;pauseFacelessVoice();updateFacelessQuote();keys.clear();document.exitPointerLock?.();document.getElementById('facelessModal').hidden=false;document.getElementById('facelessResult').textContent='PAUSED';document.getElementById('facelessResultText').textContent='Camden escape paused.';document.getElementById('facelessResume').hidden=false;document.getElementById('facelessRetry').hidden=true;updateMobileControls();}
function resumeFacelessCamden(){const b=beforeStoryScene?.faceless;if(!b||b.ended)return;b.paused=false;resumeFacelessVoice();updateFacelessQuote();document.getElementById('facelessModal').hidden=true;updateMobileControls();}
function returnFacelessCamden(){clearFacelessCamden();returnBeforeStoryRome();selectBeforeStoryCast('kevin2004');beforeStoryKevinChapters.hidden=false;beforeStoryKevinButton.setAttribute('aria-expanded','true');document.getElementById('beforeStoryKevinFaceless').focus();}
function renderFacelessCamden(dt){
 const c=beforeStoryScene,b=c?.faceless;if(!b||b.paused)return;dt=THREE.MathUtils.clamp(dt,0,.05);if(!b.ended)b.time+=dt;
 if(b.phase==='intro'){animateCharacter(b.time,false,false,b.hero);animateCharacter(b.time,false,false,b.enemy);camera.up.set(0,1,0);camera.position.copy(c.root.position).add(new THREE.Vector3(4.1,3.4,50));camera.lookAt(c.root.position.clone().add(new THREE.Vector3(0,1.6,58)));camera.updateMatrixWorld(true);if(b.time>=4.5){b.phase='run';b.time=0;keys.clear();document.getElementById('facelessObjective').textContent='RUN TO THE CHURCH';updateMobileControls();}updateFacelessQuote();drawFacelessMap();return;}
 if(!b.ended){b.dodge=Math.max(0,b.dodge-dt);b.dodgeCooldown=Math.max(0,b.dodgeCooldown-dt);let x=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0),z=(keys.has('KeyS')?1:0)-(keys.has('KeyW')?1:0),len=Math.hypot(x,z);if(len){x/=len;z/=len;}const sprint=!!len&&(keys.has('ShiftLeft')||keys.has('ShiftRight'))&&b.stamina>1,speed=sprint?8:4.9;b.stamina=THREE.MathUtils.clamp(b.stamina+dt*(sprint?-16:20),0,100);let delta=new THREE.Vector3(x*Math.cos(yaw)+z*Math.sin(yaw),0,-x*Math.sin(yaw)+z*Math.cos(yaw)).multiplyScalar(dt*speed);if(b.dodge)delta.addScaledVector(b.dodgeDirection,dt*13);moveFacelessActor(b.position,delta);animateCharacter(b.time,!!len,sprint,b.hero);
  const enemy=b.enemy.position,target=b.position.clone();if(b.waypoint&&enemy.distanceTo(b.waypoint)<.7)b.waypoint=null;let direction=(b.waypoint||target).clone().sub(enemy).setY(0).normalize();const blocked=facelessBlocked(enemy.x+direction.x*1.2,enemy.z+direction.z*1.2,.4);if(blocked&&!b.waypoint){const left=blocked.x-blocked.w/2-.8,right=blocked.x+blocked.w/2+.8,side=left< -5.2?right:right>5.2?left:Math.abs(enemy.x-left)<Math.abs(enemy.x-right)?left:right;b.waypoint=new THREE.Vector3(THREE.MathUtils.clamp(side,-5.3,5.3),0,enemy.z);direction=b.waypoint.clone().sub(enemy).normalize();}const burst=b.time%12>9?7.4:5.7;moveFacelessActor(enemy,direction.multiplyScalar(dt*burst),.4);b.enemy.rotation.y=Math.atan2(b.position.x-enemy.x,b.position.z-enemy.z);animateCharacter(b.time*1.2,true,true,b.enemy);
  b.step-=dt;if(len&&b.step<=0){b.step=sprint?.27:.4;tone(65,.04,.018,'triangle',40);}const distance=enemy.distanceTo(b.position);if(distance<1.25&&!b.dodge)finishFacelessCamden(false);else if(b.position.z<-132&&Math.abs(b.position.x)<3.2)finishFacelessCamden(true);document.getElementById('facelessDistance').textContent='OPPOSER · '+Math.round(distance)+' m';facelessUI.style.boxShadow=distance<5?'inset 0 0 90px #a01c3870':'none';
 }
 if(mode!=='beforeStoryFaceless')return;
 updateFacelessQuote(dt);facelessCamera();document.getElementById('facelessStamina').style.width=b.stamina+'%';document.getElementById('facelessProgress').style.width=THREE.MathUtils.clamp((45-b.position.z)/177*100,0,100)+'%';drawFacelessMap();
}
document.getElementById('beforeStoryKevinFaceless').onclick=startFacelessCamden;document.getElementById('facelessView').onclick=()=>{const b=beforeStoryScene?.faceless;if(b&&!b.paused&&!b.ended){b.thirdPerson=!b.thirdPerson;facelessCamera();}};document.getElementById('facelessPause').onclick=pauseFacelessCamden;document.getElementById('facelessResume').onclick=resumeFacelessCamden;document.getElementById('facelessReturn').onclick=returnFacelessCamden;document.getElementById('facelessRetry').onclick=()=>{returnFacelessCamden();startFacelessCamden();};
const facelessPreviousClear=clearBeforeStoryMenu;clearBeforeStoryMenu=function(){clearFacelessCamden();facelessPreviousClear();};
document.addEventListener('keydown',e=>{const b=beforeStoryScene?.faceless;if(mode!=='beforeStoryFaceless'||!b)return;if(['Escape','Space','KeyQ','KeyV'].includes(e.code))e.preventDefault();if(e.code==='Escape'){e.stopImmediatePropagation();if(!e.repeat&&!b.ended)b.paused?resumeFacelessCamden():pauseFacelessCamden();return;}if(b.paused||b.ended||b.phase!=='run')return;keys.add(e.code);if(e.repeat)return;if(e.code==='KeyV')document.getElementById('facelessView').click();if(['Space','KeyQ'].includes(e.code))dodgeFaceless();},true);
document.addEventListener('keyup',e=>{if(mode==='beforeStoryFaceless')keys.delete(e.code);});document.addEventListener('mousemove',e=>{const b=beforeStoryScene?.faceless;if(mode==='beforeStoryFaceless'&&b&&!b.paused&&!b.ended&&b.phase==='run'&&(document.pointerLockElement||drag)){yaw-=THREE.MathUtils.clamp(e.movementX||0,-100,100)*.0023*(window.controlPreferences?.sensitivity||1);pitch=THREE.MathUtils.clamp(pitch-(e.movementY||0)*.0023*(window.controlPreferences?.sensitivity||1),-1.15,1.15);}});document.getElementById('world').addEventListener('mousedown',()=>{if(mode==='beforeStoryFaceless'&&!beforeStoryScene?.faceless?.paused&&!beforeStoryScene?.faceless?.ended)requestLock();});window.addEventListener('blur',()=>{if(mode==='beforeStoryFaceless')pauseFacelessCamden();});

const facelessPreviousStopVoice=stopBeforeStoryVoice;stopBeforeStoryVoice=function(){stopFacelessVoice();facelessPreviousStopVoice();};
