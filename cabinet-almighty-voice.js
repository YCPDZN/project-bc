/* Operation: Cabinet voice cues for Stephen's confrontations and the Resistance pursuit. */
const cabinetAlmightyHeavenVoice=new Audio('assets/CABINET-JOSIAHVSSTEPHEN.mp3');
cabinetAlmightyHeavenVoice.preload='metadata';cabinetAlmightyHeavenVoice.volume=.9;
AudioOptions.category(cabinetAlmightyHeavenVoice,'voice');
let cabinetAlmightyOwner=null,cabinetAlmightyToken=0,cabinetAlmightyBlocked=false;
function cabinetAlmightyActive(){return cabinetAlmightyOwner&&(cabinetAlmightyOwner.kind==='rescue'?mode==='rescue'&&rescueScene===cabinetAlmightyOwner.scene:mode==='cabinet'&&cabinetScene===cabinetAlmightyOwner.scene);}
function stopCabinetAlmightyVoice(){cabinetAlmightyToken++;cabinetAlmightyHeavenVoice.pause();cabinetAlmightyHeavenVoice.currentTime=0;cabinetAlmightyOwner=null;cabinetAlmightyBlocked=false;}
function playCabinetAlmightyVoice(){
 if(!cabinetAlmightyActive())return;const token=++cabinetAlmightyToken;cabinetAlmightyBlocked=false;cabinetAlmightyHeavenVoice.muted=muted;if(cabinetAlmightyHeavenVoice.error)cabinetAlmightyHeavenVoice.load();
 const failed=()=>{if(token===cabinetAlmightyToken&&cabinetAlmightyActive())cabinetAlmightyBlocked=true;};try{cabinetAlmightyHeavenVoice.play()?.catch(failed);}catch(e){failed();}
}
function cueCabinetAlmightyVoice(kind,owner,state){
 cabinetAlmightyHeavenVoice.muted=muted;if(state.almightyHeavenPlayed)return;state.almightyHeavenPlayed=true;stopCabinetAlmightyVoice();cabinetAlmightyOwner={kind,scene:owner};playCabinetAlmightyVoice();
}
const cabinetHeavenPreviousMotorway=renderMotorwayConfrontation;
renderMotorwayConfrontation=function(c,dt){cabinetHeavenPreviousMotorway(c,dt);if(mode==='cabinet'&&cabinetScene===c&&c.motorway?.time>=1.8)cueCabinetAlmightyVoice('cabinet',c,c.motorway);};
const cabinetHeavenPreviousRescue=renderStephenRescue;
renderStephenRescue=function(dt){const r=rescueScene;cabinetHeavenPreviousRescue(dt);if(mode==='rescue'&&rescueScene===r&&r.time>=3)cueCabinetAlmightyVoice('rescue',r,r);};
const cabinetHeavenPreviousStop=stopCabinetAudio;
stopCabinetAudio=function(){stopCabinetAlmightyVoice();cabinetHeavenPreviousStop();};
const cabinetHeavenPreviousFinishRescue=finishStephenRescue;
finishStephenRescue=function(){stopCabinetAlmightyVoice();cabinetHeavenPreviousFinishRescue();};
const cabinetHeavenPreviousSetMode=setMode;
setMode=function(next){if(next!==mode)stopCabinetAlmightyVoice();cabinetHeavenPreviousSetMode(next);};
function retryCabinetAlmightyVoice(){if(cabinetAlmightyBlocked&&cabinetAlmightyActive())playCabinetAlmightyVoice();}
document.addEventListener('pointerdown',retryCabinetAlmightyVoice);document.addEventListener('keydown',retryCabinetAlmightyVoice);

const cabinetAlissaPursuitVoice=new Audio('assets/CABINET-RALISSA1.mp3');
cabinetAlissaPursuitVoice.preload='metadata';cabinetAlissaPursuitVoice.volume=.9;
AudioOptions.category(cabinetAlissaPursuitVoice,'voice');
let cabinetAlissaOwner=null,cabinetAlissaToken=0,cabinetAlissaBlocked=false;
function cabinetAlissaActive(){return mode==='chaseIntro'&&carChase===cabinetAlissaOwner&&carChase?.pursuit;}
function stopCabinetAlissaVoice(){cabinetAlissaToken++;cabinetAlissaPursuitVoice.pause();cabinetAlissaPursuitVoice.currentTime=0;cabinetAlissaOwner=null;cabinetAlissaBlocked=false;}
function playCabinetAlissaVoice(){
 if(!cabinetAlissaActive())return;const token=++cabinetAlissaToken;cabinetAlissaBlocked=false;cabinetAlissaPursuitVoice.muted=muted;if(cabinetAlissaPursuitVoice.error)cabinetAlissaPursuitVoice.load();
 const failed=()=>{if(token===cabinetAlissaToken&&cabinetAlissaActive())cabinetAlissaBlocked=true;};try{cabinetAlissaPursuitVoice.play()?.catch(failed);}catch(e){failed();}
}
const cabinetAlissaPreviousStop=stopChaseVoice;
stopChaseVoice=function(){stopCabinetAlissaVoice();cabinetAlissaPreviousStop();};
const cabinetAlissaPreviousStart=startCarChase;
startCarChase=function(pursuit=false){const previous=carChase;cabinetAlissaPreviousStart(pursuit);if(pursuit&&mode==='chaseIntro'&&carChase!==previous&&carChase?.pursuit){cabinetAlissaOwner=carChase;playCabinetAlissaVoice();}};
const cabinetAlissaPreviousRender=renderCarChase;
renderCarChase=function(dt){cabinetAlissaPreviousRender(dt);if(cabinetAlissaActive())cabinetAlissaPursuitVoice.muted=muted;};
const cabinetAlissaPreviousSetMode=setMode;
setMode=function(next){if(next!==mode)stopCabinetAlissaVoice();cabinetAlissaPreviousSetMode(next);};
function retryCabinetAlissaVoice(){if(cabinetAlissaBlocked&&cabinetAlissaActive())playCabinetAlissaVoice();}
document.addEventListener('pointerdown',retryCabinetAlissaVoice);document.addEventListener('keydown',retryCabinetAlissaVoice);
