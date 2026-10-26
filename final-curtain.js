let finalCurtain=null;
const curtainSpeechAudio=['assets/CH5PSGW1.mp3','assets/CH5PSGW2.mp3','assets/CH5PSGW3.mp3','assets/CH5PSGW4.mp3','assets/CH5PSGW5.mp3','assets/CH5PSGW6.mp3','assets/CH5PSGW7.mp3','assets/CH5PSGW8.mp3','assets/CH5PSGW9.mp3','assets/CH5PSGW10.mp3','assets/CH5PSGW11.mp3','assets/CH5PSGW12.mp3','assets/CH5PSGW13.mp3','assets/CH5PSGW14.mp3','assets/CH5PSGW15.mp3','assets/CH5PSGW16.mp3','assets/CH5PSGW17.mp3','assets/CH5PSGW18.mp3','assets/CH5PSGW19.mp3','assets/CH5PSGW20.mp3'].map(src=>{const clip=new Audio(src);clip.preload='metadata';clip.volume=.9;return clip;});
function stopCurtainVoice(){for(const clip of curtainSpeechAudio){clip.pause();clip.currentTime=0;}if(finalCurtain?.mouth){finalCurtain.mouth.open.visible=false;finalCurtain.mouth.closed.visible=true;finalCurtain.mouth.level=0;}}
const FINAL_CURTAIN_SPEECH=[
 'People of Britain—look around you. We are still here. After every shattered promise and every night of fear, we are still standing!',
 'They told us this country would fall with one man. They forgot that Britain was built by millions who refused to fall at all!',
 'I stand before Parliament as your Third Prime Secretary. But a title means nothing unless the person carrying it has the courage to serve!',
 'I have been called a fool. I have been laughed out of rooms. Tonight, that fool stands here to tell you: this country is not finished!',
 'Our streets have heard enough gunfire. Our children have learned enough names from memorials. We owe them a future louder than our grief!',
 'To the families watching behind locked doors: you deserve to open them without fear. That is the Britain we must build together!',
 'To every worker who kept a light burning while the powerful fought over chairs: this country survived because of you!',
 'To the soldiers listening tonight: strength is measured by the lives you protect. Remember that every time you lift your weapon!',
 'We cannot rebuild a nation by demanding that it forget. We must face what happened, name what was broken, and put it right!',
 'From Uxbridge to Camden, from Brent Cross to the streets beyond this square, no community should be treated as expendable!',
 'I will not promise an easy morning. There are people moving in the shadows who would tear this country apart for another taste of power!',
 'Let them hear me clearly: Britain is not your prize. Its people are not your property. Its future is not yours to burn!',
 'We have buried too many ambitions alongside too many innocent lives. The next chapter must be written by those prepared to keep people alive!',
 'A government must earn its place every single day. Through food on tables, safety on streets, and answers when the public demands them!',
 'So bring your questions. Bring your anger. Bring your determination. A country that can speak is a country that can begin to heal!',
 'I know what it means to be underestimated. And I know what happens when ordinary people decide they have finally had enough!',
 'Tonight, we choose to stand up. Tomorrow, we clear the wreckage. Then we build something our children will never have to escape!',
 'Look at the person beside you. That is who this is for. Not a portrait on a wall. Not a name above an office. Each other!',
 'If you still believe this country can rise, let this square hear you! Let every darkened street know that hope has not surrendered!',
 'Britain—stand tall! The curtain has not fallen on our future. We are taking the stage together, and we are bringing this country back!'
];
const curtainUI=document.createElement('section');curtainUI.id='finalCurtainUI';curtainUI.hidden=true;curtainUI.innerHTML='<div class="cinema-top"><span>CHAPTER 05 / THE FINAL CURTAIN CALL</span><button id="curtainNext">CONTINUE · ENTER</button></div><div class="cinema-dialogue"><strong id="curtainSpeaker"></strong><p id="curtainLine"></p></div>';document.body.appendChild(curtainUI);
const curtainCard=document.createElement('article');curtainCard.id='chapter5KevinCurtain';curtainCard.className='chapter-card';curtainCard.hidden=true;curtainCard.innerHTML='<div class="chapter-card-copy"><div class="eyebrow">CHAPTER 05 / KEVIN ROUTE</div><h3>The Final Curtain Call</h3><p>Damian Juko arrives · Parliament Square</p><strong>OPENING CUTSCENE</strong><button id="openFinalCurtain">PLAY THE FINAL CURTAIN CALL</button></div>';
document.getElementById('openBusters').closest('article').after(curtainCard);
function refreshFinalCurtainChapter(){curtainCard.hidden=!(canOpenBusters()&&gameProgress.pindarCompleted===true);curtainCard.querySelector('strong').textContent=gameProgress.finalCurtainCompleted?'COMPLETE / REPLAY FROM OPENING CUTSCENE':'UNLOCKED / OPENING CUTSCENE';curtainCard.querySelector('p').textContent='Trafalgar Square → Whitehall → Parliament Square';}
function clearFinalCurtain(){curtainOutroUI.hidden=true;stopDieselCurtainVoice();stopCurtainVoice();if(!finalCurtain)return;const c=finalCurtain;scene.remove(c.root);pindarDispose(c.root);scene.background.copy(c.background);scene.fog.color.copy(c.fogColor);scene.fog.density=c.fogDensity;ambient.intensity=c.ambient;cameraFill.intensity=c.fill;curtainUI.hidden=true;$('curtainNext').textContent='CONTINUE · ENTER';finalCurtain=null;}
function startFinalCurtain(){if(!canOpenBusters()||!gameProgress.pindarCompleted)return;if(!chapterLoadingBypass){loadChapterScreen('CHAPTER 05 / THE FINAL CURTAIN CALL',startFinalCurtain);return;}menu();closeChapterPicker();setMode('finalCurtain');keys.clear();world.visible=false;upperWorld.visible=false;exhibit.visible=false;for(const a of [subject,peter,alissa,gareth,stephen,chrisMenu,mariahMenu,garethJonesMenu,emmaMenu,kevinMenu,kevinRevealed,elizabethMenu,damianMenu,davidMenu])a.visible=false;syncMenuSong();
 const root=new THREE.Group();root.position.x=1200;scene.add(root);finalCurtain={root,phase:'entrance',time:0,line:0,lineTime:0,background:scene.background.clone(),fogColor:scene.fog.color.clone(),fogDensity:scene.fog.density,ambient:ambient.intensity,fill:cameraFill.intensity};const c=finalCurtain;
 const stone=mat(0x10131b),trim=mat(0x3d414d);box(root,12,.2,38,stone,0,-.13,0);for(const x of [-5.5,5.5])box(root,.3,5,38,stone,x,2.5,0);box(root,12,.2,38,stone,0,5,0);box(root,11,5,.3,stone,0,2.5,-17);
 c.lamps=[];for(let z=-14;z<=14;z+=4){for(const side of [-1,1])box(root,.4,5,.65,trim,side*5.3,2.5,z);c.lamps.push(box(root,4,.05,.16,new THREE.MeshBasicMaterial({color:0xcbd9e8}),0,4.85,z));}
 c.back=new THREE.PointLight(0x9baeff,30,25);c.back.position.set(0,3,-12);root.add(c.back);c.front=new THREE.PointLight(0xe5e3d9,0,17);c.front.position.set(1,3,1);root.add(c.front);c.damian=makeDamianJuko();root.add(c.damian);c.damian.position.set(0,0,-8);
 c.rings=[];for(let i=0;i<3;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(1,.017,6,96),new THREE.MeshBasicMaterial({color:0xbecfff,transparent:true,opacity:0}));ring.rotation.x=Math.PI/2;ring.position.set(0,.04+i*.06,-2);root.add(ring);c.rings.push(ring);}c.links=[];for(const side of [-1,1])for(let i=0;i<35;i++){const link=new THREE.Mesh(new THREE.TorusGeometry(.095,.027,6,10),new THREE.MeshStandardMaterial({color:0xd4ab45,emissive:0x4c3108,metalness:.7,roughness:.25}));link.position.set(side*(.7+i*.11),1.2+Math.sin(i*.5)*.09,-2);link.rotation.set(0,Math.PI/2,i%2?Math.PI/2:0);root.add(link);c.links.push({obj:link,start:link.position.clone(),side});}
 flash.visible=false;ambient.intensity=.12;scene.fog.density=.018;scene.fog.color.setHex(0x03040a);scene.background.setHex(0x03040a);curtainUI.hidden=false;tone(38,2,.12,'sine',24);renderFinalCurtain(0);
}
function curtainSpeech(){const c=finalCurtain;if(!c)return;for(const child of [...c.root.children]){c.root.remove(child);pindarDispose(child);}c.phase='speech';c.time=0;c.line=0;c.lineTime=0;c.root.add(makeParliamentExterior());for(const side of [-1,1])for(let i=0;i<3;i++){const guard=makePSRMSoldier();guard.position.set(side*(4+i*2),0,3);c.root.add(guard);}const grass=mat(0x10231c);box(c.root,30,.05,17,grass,0,.01,12);box(c.root,8,.4,5,mat(0x282c35),0,.2,5);box(c.root,1.1,1.15,.65,mat(0x302419),0,.95,5.9);box(c.root,1.3,.12,.85,mat(0x77552e),0,1.56,5.9);c.williams=makeGareth(false);c.root.add(c.williams);c.williams.position.set(0,.4,5);c.mouth=makeBustersSpeechMouth(c.williams);const key=new THREE.PointLight(0xffe2ad,35,45);key.position.set(0,7,11);c.root.add(key);const rim=new THREE.PointLight(0x89aaff,24,40);rim.position.set(-6,6,-1);c.root.add(rim);scene.background.setHex(0x050a18);scene.fog.color.setHex(0x0b1220);scene.fog.density=.005;ambient.intensity=.65;cameraFill.intensity=.3;showCurtainLine();}
function showCurtainLine(){stopCurtainVoice();const c=finalCurtain,clip=curtainSpeechAudio[c.line];c.voiceFailed=false;clip.muted=muted;clip.play().catch(()=>{if(finalCurtain===c&&curtainSpeechAudio[c.line]===clip)c.voiceFailed=true;});$('curtainSpeaker').textContent='GARETH WILLIAMS / 3RD PRIME SECRETARY';$('curtainLine').textContent=FINAL_CURTAIN_SPEECH[finalCurtain.line];}
function nextCurtainLine(){const c=finalCurtain;if(!c)return;if(c.phase==='outro'){if(curtainOutroUI.dataset.finished==='true')returnFromCurtainOutro();else finishCurtainOutroScroll();return;}if(c.phase==='ending'){advanceCurtainEnding();return;}if(c.phase==='entrance'){curtainSpeech();return;}if(c.phase==='diesel'){stopDieselCurtainVoice();if(++c.line<DIESEL_CURTAIN_LINES.length){c.lineTime=0;showDieselCurtainLine();return;}gameProgress.finalCurtainIntroViewed=true;saveProgress();startFinalCurtainBattle();return;}stopCurtainVoice();if(++c.line>=FINAL_CURTAIN_SPEECH.length){beginDieselCurtain();return;}c.lineTime=0;showCurtainLine();}
function renderFinalCurtain(dt){const c=finalCurtain;if(!c)return;if(c.phase==='outro'){renderCurtainOutro(dt);return;}if(c.phase==='ending'){renderCurtainEnding(dt);return;}if(c.phase==='diesel'){renderDieselCurtain(dt);return;}c.time+=dt;let shot,look;if(c.phase==='entrance'){const t=c.time,d=c.damian;d.position.z=-8+Math.min(1,Math.max(0,(t-4)/10))*6;animateCharacter(t,t>=4&&t<14,false,d);c.front.intensity=Math.max(0,Math.min(24,(t-12)*3));c.back.intensity=24+Math.sin(t*2)*3;c.lamps.forEach((m,i)=>m.visible=t>5+i*.7&&(t>16||Math.sin(t*13+i)>-.45));for(const link of c.links){link.obj.visible=t>14&&t<23;const burst=Math.max(0,t-19);link.obj.position.copy(link.start);link.obj.position.x+=link.side*burst*1.8;link.obj.position.y+=Math.sin(burst)*1.2;link.obj.rotation.z+=dt*5;}
 if(t>=14)d.userData.arms[0].rotation.x=-1.45;for(let i=0;i<c.rings.length;i++){const pulse=(Math.max(0,t-18-i*.35)%3)/3;c.rings[i].scale.setScalar(1+pulse*7);c.rings[i].material.opacity=t>=18?(1-pulse)*.4:0;}$('curtainSpeaker').textContent=t<20?'THE FINAL CURTAIN CALL':'DAMIAN JUKO / LAWFUL ENFORCER AND EXECUTIONER';$('curtainLine').textContent=t<4?'Beyond the fall of a Prime Secretary… silence.':t<10?'Footsteps. Steady. Unhurried.':t<16?'The lights bend towards a figure in the dark.':t<20?'The chains stop.':'Damian Juko has arrived.';
 shot=t<8?new THREE.Vector3(.8,.28,d.position.z+2.6):t<14?new THREE.Vector3(-2.2,.7,2):new THREE.Vector3(Math.sin((t-14)*.12)*3.8,1.1,-2+Math.cos((t-14)*.12)*3.8);look=new THREE.Vector3(0,t<8?.25:1.6,d.position.z);if(t>=25){curtainSpeech();return;}
 }else{c.lineTime+=dt;const duration=Math.max(6,FINAL_CURTAIN_SPEECH[c.line].split(/\s+/).length/2.6+1);const clip=curtainSpeechAudio[c.line];clip.muted=muted;if(clip.ended||c.voiceFailed&&c.lineTime>=duration){nextCurtainLine();return;}animateCharacter(c.time,false,false,c.williams);const arms=c.williams.userData.arms;if(arms){arms[0].rotation.x=-.45-Math.sin(c.time*1.6)*.25;arms[1].rotation.x=-.2;}const t=clip.currentTime,edge=Math.max(0,Math.min(1,t/.14,Number.isFinite(clip.duration)?(clip.duration-t)/.2:1));const target=!clip.paused&&!clip.ended&&clip.readyState>=2?Math.max(0,Math.sin(t*16)*.36+Math.sin(t*9.1)*.18+.25)*edge:0;c.mouth.level+=(target-c.mouth.level)*(1-Math.exp(-dt*25));c.mouth.open.visible=target>.015&&c.mouth.level>.015;c.mouth.closed.visible=!c.mouth.open.visible;c.mouth.open.scale.y=.006+c.mouth.level*.032;if(c.williams.userData.openMouth)c.williams.userData.openMouth.visible=false;const wide=c.line%5===0;shot=new THREE.Vector3(Math.sin(c.time*.12)*(wide?4:1),wide?3.1:2.15,wide?16:8.2);look=new THREE.Vector3(0,1.9,5);}
 camera.position.copy(c.root.position).add(shot);camera.lookAt(c.root.position.clone().add(look));}
document.getElementById('openFinalCurtain').onclick=startFinalCurtain;document.getElementById('curtainNext').onclick=nextCurtainLine;addEventListener('keydown',e=>{if(mode==='finalCurtain'&&e.code==='Enter'&&!e.repeat){e.preventDefault();nextCurtainLine();}});
const dieselCurtainAudio=['assets/DB1.mp3','assets/DB2.mp3','assets/DB3.mp3','assets/DB4.mp3','assets/DB5.mp3','assets/DB6.mp3','assets/DB7.mp3','assets/DB8.mp3','assets/DB9.mp3','assets/DB10.mp3','assets/DB11.mp3','assets/DB12.mp3','assets/DB13.mp3','assets/DB14.mp3','assets/DB15.mp3'].map(src=>{const a=new Audio(src);a.preload='metadata';a.volume=.9;return a;});
function stopDieselCurtainVoice(){for(const a of dieselCurtainAudio){a.pause();a.currentTime=0;}if(finalCurtain?.phase==='diesel'&&finalCurtain.mouth){finalCurtain.mouth.level=0;finalCurtain.mouth.open.visible=false;finalCurtain.mouth.closed.visible=true;}}
const DIESEL_CURTAIN_LINES=[
 'Listen to him, people of Britain! Another speech from another stolen chair. Williams calls it service; I call it the deep state changing its uniform!',
 'You are a deep-state infiltrator, Prime Secretary! You learned your promises in their corridors, and now you expect the streets to swallow every word!',
 'Look at these people, Gareth! They pay the bills, bury the dead, and carry this country while your little circle keeps passing the crown around!',
 'You say Britain belongs to its people? Then come down from that guarded podium! Answer them without your militia deciding who gets to speak!',
 'The people did not survive all this to applaud a third landlord of the same rotten system! Your curtain call has begun, Williams—and this time the crowd will have its say!',
 "And you lot cheering him on—woke filth, every last one of you! He waves a flag, promises you comfort, and suddenly you forget whose boot was on your neck!",
 "Look at you: a chorus of obedient little cowards, applauding whichever bureaucrat inherits the microphone. You call it progress. I call it rot!",
 "You sneer at the people who refuse to kneel, then crawl back to your precious state begging it to tell you what to think. Pathetic, spineless hypocrites!",
 "Williams, your followers are the filth that keeps this machine running! They dress their surrender up as compassion and expect the rest of us to choke on it!",
 "Keep clapping, you woke parasites! Every cheer tells me exactly who would sell this country for a pat on the head. I despise your cowardice—and I will not beg for your approval!",
 "Only Josiah had the power to CHALLENGE ME! He could make this city tremble. You, Williams? You can barely make it listen!",
 "With him gone, my faction will conquer the United Kingdom anew! Your borrowed title will not stop us. Your militia will not stop us. This country will be ours!",
 "From the cliffs of Dover to the Highlands of Scotland, I will raise our banner over this nation! Britain will stand tall again—and the world will learn to reckon with us!",
 "I will not watch this island bow its head and apologise for existing! Let the bells ring, let the flags rise, and let Britain roar until every capital hears us!",
 "Remember the name of the country beneath your feet! The United Kingdom! We will seize its future, restore its pride, and make this land a power they dare not dismiss again!"
];
function makeCurtainTrafalgar(){
 const root=new THREE.Group(),stone=mat(0x8a8278),pale=mat(0xb5a88e),dark=mat(0x23262b),window=mat(0x171e2b),bronze=mat(0x253d39);
 root.name='Trafalgar Square / National Gallery and St Martin-in-the-Fields';
 box(root,100,.4,90,mat(0x575451),0,-.3,0);
 for(let i=0;i<7;i++)box(root,62,.22,18-i*1.6,stone,-12,i*.22,-24-i*.8);
 box(root,70,12,12,stone,-12,7.3,-40);box(root,73,.8,13,pale,-12,13.7,-40);
 for(let x=-44;x<23;x+=3.2){box(root,1.3,2.8,.15,window,x,7,-33.85);box(root,1.6,.25,.4,pale,x,8.7,-33.6);}
 box(root,19,.7,5,pale,-12,13.8,-32);for(let x=-20;x<=-4;x+=3.2){mesh(new THREE.CylinderGeometry(.55,.65,9,12),pale,root,x,8.8,-31);box(root,1.4,.45,1.4,pale,x,4.4,-31);box(root,1.4,.45,1.4,pale,x,13.3,-31);}
 const pediment=mesh(new THREE.ConeGeometry(11,4,3),pale,root,-12,15.3,-32);pediment.rotation.y=Math.PI/2;pediment.scale.z=.3;
 mesh(new THREE.CylinderGeometry(6,6,4,24),pale,root,-12,15.5,-40);const dome=mesh(new THREE.SphereGeometry(6,24,12,0,Math.PI*2,0,Math.PI/2),dark,root,-12,17.5,-40);dome.scale.y=.8;
 // St Martin's clock tower and spire frame the eastern skyline.
 box(root,15,11,18,pale,34,5.5,-35);box(root,5,23,5,pale,34,15,-32);box(root,6,.6,6,stone,34,23,-32);
 for(const x of [32.7,35.3])box(root,.6,4,.2,window,x,20,-29.4);
 mesh(new THREE.CircleGeometry(1.25,24),mat(0xd5e0d5),root,34,24.5,-29.35);box(root,.07,.85,.05,dark,34,24.8,-29.25);box(root,.65,.07,.05,dark,34.3,24.5,-29.25);
 mesh(new THREE.ConeGeometry(3.2,17,8),pale,root,34,35,-32);box(root,.15,2,.15,pale,34,44.5,-32);box(root,1,.15,.15,pale,34,45,-32);
 // Illuminated circular fountain, with animated water jets.
 const water=new THREE.MeshPhongMaterial({color:0x197a88,emissive:0x064450,transparent:true,opacity:.8,shininess:85});mesh(new THREE.CylinderGeometry(12,12,.5,64),stone,root,7,.2,0);mesh(new THREE.CylinderGeometry(11.3,11.3,.08,64),water,root,7,.5,0);
 mesh(new THREE.TorusGeometry(11.7,.45,10,64),pale,root,7,.6,0).rotation.x=Math.PI/2;
 mesh(new THREE.CylinderGeometry(3.6,4.1,1.1,32),pale,root,7,1.1,0);mesh(new THREE.CylinderGeometry(3.8,3.3,.3,32),stone,root,7,1.8,0);mesh(new THREE.CylinderGeometry(.8,1.2,2.5,20),bronze,root,7,3,0);
 root.userData.jets=[];for(let i=0;i<12;i++){const a=i*Math.PI/6,points=[];for(let j=0;j<=20;j++){const t=j/20;points.push(new THREE.Vector3(7+Math.cos(a)*t*3.5,1.9+Math.sin(t*Math.PI)*5,Math.sin(a)*t*3.5));}const jet=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),20,.065,5,false),new THREE.MeshBasicMaterial({color:0x9aefff,transparent:true,opacity:.55}));root.add(jet);root.userData.jets.push(jet);}
 const fountainLight=new THREE.PointLight(0x6feaff,65,32);fountainLight.position.set(7,2,0);root.add(fountainLight);
 // Bronze equestrian monument on its stone plinth.
 box(root,3,4,3,pale,-4,2,-17);const horse=new THREE.Group();root.add(horse);horse.position.set(-4,4,-17);ball(horse,1.25,.55,.45,bronze,0,1,0);for(const x of [-.8,.8])for(const z of [-.3,.3])box(horse,.17,1,.17,bronze,x,.5,z);ball(horse,.35,.65,.3,bronze,1,1.7,0);ball(horse,.3,.5,.3,bronze,0,2,0);ball(horse,.23,.27,.23,bronze,0,2.65,0);
 for(let x=-36;x<=36;x+=6){box(root,.2,3,.2,dark,x,1.5,14);ball(root,.35,.4,.35,new THREE.MeshBasicMaterial({color:0xffedc3}),x,3.3,14);const lamp=new THREE.PointLight(0xffdba1,7,12);lamp.position.set(x,3.4,14);root.add(lamp);}
 for(let x=-35;x<=35;x+=3)box(root,.16,1.2,.16,dark,x,.6,18);
 return root;
}
function frameDavidCurtainFace(c){c.diesel.updateMatrixWorld(true);const face=c.diesel.userData.head.getWorldPosition(new THREE.Vector3());face.y-=.36;const shot=new THREE.Vector3(.20+Math.sin(c.time*.15)*.08,.12,2.7).applyAxisAngle(new THREE.Vector3(0,1,0),c.diesel.rotation.y);camera.position.copy(face).add(shot);camera.lookAt(face);camera.updateMatrixWorld(true);}
function beginDieselCurtain(){const c=finalCurtain;if(!c)return;stopCurtainVoice();for(const child of [...c.root.children])pindarDispose(child);c.phase='diesel';c.time=0;c.line=0;c.lineTime=0;c.square=makeCurtainTrafalgar();c.root.add(c.square);c.diesel=makeDavidBusters();c.diesel.name='David “Diesel” Busters / Trafalgar taunt';c.root.add(c.diesel);c.diesel.position.set(-5,0,7);c.mouth=makeBustersSpeechMouth(c.diesel);const light=new THREE.PointLight(0xffe4bc,28,25);light.position.set(-5,5,11);c.root.add(light);ambient.intensity=.8;scene.background.setHex(0x0b1024);scene.fog.color.setHex(0x14172b);scene.fog.density=.003;showDieselCurtainLine();frameDavidCurtainFace(c);}
function showDieselCurtainLine(){stopDieselCurtainVoice();const c=finalCurtain,a=dieselCurtainAudio[c.line];c.dieselVoiceFailed=false;a.muted=muted;a.play().catch(()=>{if(finalCurtain===c&&dieselCurtainAudio[c.line]===a)c.dieselVoiceFailed=true;});$('curtainSpeaker').textContent='DAVID “DIESEL” BUSTERS / TRAFALGAR SQUARE';$('curtainLine').textContent=DIESEL_CURTAIN_LINES[finalCurtain.line];}
function renderDieselCurtain(dt){const c=finalCurtain;c.time+=dt;c.lineTime+=dt;animateCharacter(c.time,false,false,c.diesel);c.diesel.userData.arms[0].rotation.x=-.65-Math.sin(c.time*1.8)*.3;for(const jet of c.square.userData.jets)jet.material.opacity=.45+Math.sin(c.time*3)*.1;frameDavidCurtainFace(c);const a=dieselCurtainAudio[c.line];a.muted=muted;const t=a.currentTime,edge=Math.max(0,Math.min(1,t/.14,Number.isFinite(a.duration)?(a.duration-t)/.2:1));const target=!a.paused&&!a.ended&&a.readyState>=2?Math.max(0,Math.sin(t*16)*.36+Math.sin(t*9.1)*.18+.25)*edge:0;c.mouth.level+=(target-c.mouth.level)*(1-Math.exp(-dt*25));c.mouth.open.visible=target>.015&&c.mouth.level>.015;c.mouth.closed.visible=!c.mouth.open.visible;c.mouth.open.scale.y=.006+c.mouth.level*.032;if(c.diesel.userData.openMouth)c.diesel.userData.openMouth.visible=false;if(a.ended||c.dieselVoiceFailed&&c.lineTime>Math.max(7,DIESEL_CURTAIN_LINES[c.line].split(/\s+/).length/2.6+1))nextCurtainLine();}


const CURTAIN_ENDING_LINES=[
 ['THE FINAL CURTAIN CALL','The guns fall silent along Whitehall. David “Diesel” Busters, Gareth Williams and Mariah Banu are dead.'],
 ['WHAT REMAINS','Alissa’s revenge is over. Her story ends here too. The banners that divided London lie abandoned.'],
 ['NO. 10 DOWNING STREET','Behind the black gates, Kevin Murderhorn steps out of the shadows. His mask is gone.'],
 ['KEVIN MURDERHORN / VICTORIOUS','His hands meet in a silent prayer. A black figure rises behind him, its chains stretching into the night.'],
 ['THE FINAL CURTAIN CALL / END','You helped him bring the factions down. Now London belongs to the man who called you from the dream.']
];
function startCurtainEnding(){
 if(!kevinIsCurtainVictor())return;menu();setMode('finalCurtain');world.visible=upperWorld.visible=exhibit.visible=false;
 for(const actor of [subject,peter,alissa,gareth,stephen,chrisMenu,mariahMenu,garethJonesMenu,emmaMenu,kevinMenu,kevinRevealed,elizabethMenu,damianMenu,davidMenu])actor.visible=false;
 const root=new THREE.Group();root.position.x=1200;scene.add(root);const c=finalCurtain={root,phase:'ending',time:0,line:0,lineTime:0,background:scene.background.clone(),fogColor:scene.fog.color.clone(),fogDensity:scene.fog.density,ambient:ambient.intensity,fill:cameraFill.intensity};
 root.add(makeDowningStreet());c.victor=getVictoriousKevinMenu(false);root.add(c.victor);c.victor.visible=true;c.victor.position.set(0,0,6);
 const key=new THREE.PointLight(0xe9d4c3,30,22);key.position.set(1,4,11);root.add(key);const rim=new THREE.PointLight(0xc00925,24,15);rim.position.set(-3,3,3);root.add(rim);
 scene.background.setHex(0x05040a);scene.fog.color.setHex(0x08050c);scene.fog.density=.008;ambient.intensity=.45;cameraFill.intensity=.15;flash.visible=false;curtainUI.hidden=false;showCurtainEndingLine();renderCurtainEnding(0);
}
function showCurtainEndingLine(){const c=finalCurtain;$('curtainSpeaker').textContent=CURTAIN_ENDING_LINES[c.line][0];$('curtainLine').textContent=CURTAIN_ENDING_LINES[c.line][1];$('curtainNext').textContent=c.line===CURTAIN_ENDING_LINES.length-1?'OUTRO · ENTER':'CONTINUE · ENTER';}
function advanceCurtainEnding(){const c=finalCurtain;if(c?.phase!=='ending')return;if(++c.line>=CURTAIN_ENDING_LINES.length){startCurtainOutro();return;}c.lineTime=0;showCurtainEndingLine();}
function renderCurtainEnding(dt){const c=finalCurtain;c.time+=dt;c.lineTime+=dt;const u=c.victor.userData;u.body.position.y=Math.sin(c.time*1.5)*.006;u.victorySpectre.position.y=.15+Math.sin(c.time*1.4)*.055;u.victoryChains.rotation.y=Math.sin(c.time*.65)*.045;
 const wide=c.line<2,shot=new THREE.Vector3(wide?4.5:Math.sin(c.time*.12)*.3,wide?3.2:1.95,wide?16:9.7);camera.position.copy(c.root.position).add(shot);camera.lookAt(c.root.position.clone().add(new THREE.Vector3(0,wide?2:1.85,6)));camera.updateMatrixWorld(true);if(c.lineTime>=8)advanceCurtainEnding();
}

const curtainOutroUI=document.createElement('section');
curtainOutroUI.id='curtainOutro';curtainOutroUI.hidden=true;
curtainOutroUI.setAttribute('aria-label','The Final Curtain Call ending');
curtainOutroUI.innerHTML=`<div class="credits-heading">PROJECT BC / THE FINAL CURTAIN CALL</div>
<button id="curtainOutroSkip">SKIP TO END</button>
<div id="curtainOutroScroll" tabindex="0" aria-label="Ending story"><div class="credits-copy">
<div class="eyebrow">THE FINAL CURTAIN CALL / KEVIN ROUTE</div>
<h1>KEVIN MURDERHORN<br>VICTORIOUS</h1>
<p>Whitehall falls silent. David “Diesel” Busters, Gareth Williams and Mariah Banu will never raise their banners again. Alissa Roberts has taken her revenge, but she will not live to see what follows.</p>
<p>The streets between Trafalgar Square and Parliament are strewn with the remains of rival armies. Their leaders promised Britain a future. None of them is left to claim it.</p>
<p>Behind the black gates of Downing Street, Kevin Murderhorn lowers his mask. His hands come together in a silent prayer. The figure behind him rises, and black chains stretch into the night.</p>
<p>You followed the voice from the dream. You stepped off the train. You opened the blue door. Every victory brought you closer to this moment—and brought London closer to him.</p>
<p>There is no speech of reconciliation. No promise of mercy. Only a man who once answered to others, standing where the orders will now begin.</p>
<p>The city survives the final curtain call. Its freedom does not. As dawn approaches, the surviving streets wait for Kevin Murderhorn’s first command.</p>
<div class="credits-finish"><h2>THE END</h2><p>KEVIN MURDERHORN VICTORIOUS</p><p>LONDON BELONGS TO HIM.</p></div>
</div></div><button id="curtainOutroMenu" hidden>MAIN MENU</button>`;
document.body.appendChild(curtainOutroUI);
function startCurtainOutro(){
 const c=finalCurtain;if(c?.phase!=='ending')return;
 stopCurtainVoice();stopDieselCurtainVoice();keys.clear();drag=false;
 c.phase='outro';c.time=0;c.outroCarry=0;c.root.visible=false;
 curtainUI.hidden=true;curtainOutroUI.hidden=false;curtainOutroUI.dataset.finished='false';
 $('curtainOutroScroll').scrollTop=0;$('curtainOutroMenu').hidden=true;
 scene.background.setHex(0x030205);document.exitPointerLock?.();syncMenuSong();
}
function finishCurtainOutroScroll(){
 if(finalCurtain?.phase!=='outro')return;
 const scroll=$('curtainOutroScroll');scroll.scrollTop=scroll.scrollHeight;
 curtainOutroUI.dataset.finished='true';$('curtainOutroMenu').hidden=false;
 gameProgress.finalCurtainOutroViewed=true;saveProgress();
}
function renderCurtainOutro(dt){
 const c=finalCurtain;if(c?.phase!=='outro'||curtainOutroUI.dataset.finished==='true')return;
 c.time+=dt;const scroll=$('curtainOutroScroll');
 if(c.time>3){c.outroCarry+=dt*28;const step=Math.floor(c.outroCarry);scroll.scrollTop+=step;c.outroCarry-=step;}
 if(scroll.scrollTop+scroll.clientHeight>=scroll.scrollHeight-2)finishCurtainOutroScroll();
}
function returnFromCurtainOutro(){
 if(finalCurtain?.phase!=='outro'||curtainOutroUI.dataset.finished!=='true')return;
 curtainOutroUI.hidden=true;
 loadChapterScreen('KEVIN MURDERHORN VICTORIOUS',()=>{selectedSubject=6;menu();selectSubject(6);refreshProgressUI();});
}
document.getElementById('curtainOutroSkip').onclick=finishCurtainOutroScroll;
document.getElementById('curtainOutroMenu').onclick=returnFromCurtainOutro;
