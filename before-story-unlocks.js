/* Campaign completion unlocks the four independent character stories. */
const BEFORE_STORY_UNLOCK_REQUIREMENTS={
 josiah:{button:'beforeStoryJosiah',section:'beforeStoryChapters',text:'Complete Enter Brent Cross (Chapter 1).',earned:p=>p.brentCrossCompleted===true},
 chris:{button:'beforeStoryChris',section:'beforeStoryChrisChapters',text:'Complete Operation: Cabinet (Chapter 2), on either Resistance or Tyrant.',earned:p=>p.cabinetCompleted===true||p.loyalPursuitCompleted===true||p.a5EscapeCompleted===true},
 peter:{button:'beforeStoryPeter',section:'beforeStoryPeterChapters',text:'Complete Civil Disobedience (Resistance), or Tube with any ending: Josiah wins, Alissa wins, or Alissa’s betrayal at Embankment.',earned:p=>p.civilDisobedienceSurvived===true||p.tubeCompleted===true},
 kevin:{button:'beforeStoryKevin',section:'beforeStoryKevinChapters',text:'Complete The Return of Busters (Alissa wins), The Fool of Uxbridge (Josiah wins), The Prime Secretary (Resistance), or Universal Restoration in The Last Refusal: Sol.',earned:p=>p.pindarCompleted===true||p.uxbridgeCompleted===true||p.uxbridgeRedRoomsCompleted===true||p.primeSecretaryCompleted===true||p.universalRestorationCompleted===true}
};
function recordBeforeStoryUnlocks(previous={}){
 const current=gameProgress.beforeStoryUnlocks||{},earned={};
 for(const [id,r]of Object.entries(BEFORE_STORY_UNLOCK_REQUIREMENTS))if(current[id]===true||previous?.[id]===true||r.earned(gameProgress))earned[id]=true;
 if(!Object.keys(earned).length)return false;
 const changed=Object.keys(earned).some(id=>current[id]!==true);gameProgress.beforeStoryUnlocks=earned;return changed;
}
function beforeStoryUnlocked(id){const r=BEFORE_STORY_UNLOCK_REQUIREMENTS[id];return !!r&&(gameProgress.beforeStoryUnlocks?.[id]===true||r.earned(gameProgress));}
function refreshBeforeStoryUnlocks(){
 for(const [id,r]of Object.entries(BEFORE_STORY_UNLOCK_REQUIREMENTS)){
  const button=document.getElementById(r.button),unlocked=beforeStoryUnlocked(id),note=document.getElementById(r.button+'Requirement');
  button.disabled=!unlocked;button.setAttribute('aria-disabled',String(!unlocked));button.title=unlocked?'UNLOCKED':r.text;button.querySelector('small').textContent=unlocked?'CHARACTER STORY':'LOCKED';button.querySelector('i').textContent=unlocked?'↗':'🔒';note.hidden=unlocked;
  if(!unlocked){document.getElementById(r.section).hidden=true;button.setAttribute('aria-expanded','false');}
 }
}
for(const [id,r]of Object.entries(BEFORE_STORY_UNLOCK_REQUIREMENTS)){
 const button=document.getElementById(r.button),note=document.createElement('p');note.id=r.button+'Requirement';note.className='before-story-unlock-requirement';note.textContent=r.text;button.after(note);button.setAttribute('aria-describedby',note.id);
 const previous=button.onclick;button.onclick=function(event){if(beforeStoryUnlocked(id))return previous.call(this,event);};
 // Also guard chapter controls if an old personal save has already completed them.
 document.getElementById(r.section).addEventListener('click',event=>{if(!beforeStoryUnlocked(id)){event.preventDefault();event.stopImmediatePropagation();}},true);
}
const beforeStoryUnlockPreviousSave=saveProgress;
saveProgress=function(){recordBeforeStoryUnlocks(loadProgress().beforeStoryUnlocks);beforeStoryUnlockPreviousSave();refreshBeforeStoryUnlocks();};
const beforeStoryUnlockPreviousRefresh=refreshBeforeStoryChapters;
refreshBeforeStoryChapters=function(){if(recordBeforeStoryUnlocks())beforeStoryUnlockPreviousSave();beforeStoryUnlockPreviousRefresh();refreshBeforeStoryUnlocks();};
refreshBeforeStoryChapters();
