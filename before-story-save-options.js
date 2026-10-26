/* Erasure is limited to the independent Character Specific Stories save. */
const beforeStoryEraseButton=document.createElement('button');beforeStoryEraseButton.id='beforeStoryEraseSave';beforeStoryEraseButton.type='button';beforeStoryEraseButton.textContent='ERASE STORY SAVE DATA';beforeStoryEraseButton.setAttribute('aria-haspopup','dialog');beforeStoryEraseButton.setAttribute('aria-controls','beforeStoryEraseDialog');
const beforeStoryMenuActions=document.createElement('div');beforeStoryMenuActions.className='before-story-menu-actions';beforeStoryMenuActions.append(beforeStoryEraseButton,document.getElementById('beforeStoryExit'));document.querySelector('.before-story-top').appendChild(beforeStoryMenuActions);
const beforeStoryEraseDialog=document.createElement('section');beforeStoryEraseDialog.id='beforeStoryEraseDialog';beforeStoryEraseDialog.hidden=true;beforeStoryEraseDialog.setAttribute('role','dialog');beforeStoryEraseDialog.setAttribute('aria-modal','true');beforeStoryEraseDialog.setAttribute('aria-labelledby','beforeStoryEraseTitle');beforeStoryEraseDialog.setAttribute('aria-describedby','beforeStoryEraseDescription');
beforeStoryEraseDialog.innerHTML='<div><small>BEFORE THE STORY</small><h2 id="beforeStoryEraseTitle">ERASE STORY SAVE DATA?</h2><p id="beforeStoryEraseDescription">Erase completed chapters and unlocks for Character Specific Stories and begin again with Rome. Your main campaign progress and audio settings are kept.</p><p id="beforeStoryEraseError" role="alert" hidden></p><div class="before-story-erase-actions"><button id="beforeStoryEraseCancel" type="button">CANCEL</button><button id="beforeStoryEraseConfirm" type="button">ERASE STORY SAVE DATA</button></div></div>';
document.body.appendChild(beforeStoryEraseDialog);
function closeBeforeStoryErase(focus=true){beforeStoryEraseDialog.hidden=true;if(focus&&mode==='beforeStoryMenu')beforeStoryEraseButton.focus();}
beforeStoryEraseButton.onclick=()=>{if(mode!=='beforeStoryMenu'||!beforeStoryScene)return;document.getElementById('beforeStoryEraseError').hidden=true;beforeStoryEraseDialog.hidden=false;document.getElementById('beforeStoryEraseCancel').focus();};
document.getElementById('beforeStoryEraseCancel').onclick=()=>closeBeforeStoryErase();
document.getElementById('beforeStoryEraseConfirm').onclick=()=>{
 if(mode!=='beforeStoryMenu'||beforeStoryEraseDialog.hidden||!beforeStoryScene)return;
 try{localStorage.removeItem(BEFORE_STORY_SAVE_KEY);}catch(error){const message=document.getElementById('beforeStoryEraseError');message.textContent='The story save could not be erased. Please try again.';message.hidden=false;return;}
 beforeStoryProgress={romeCompleted:false,jukoCompleted:false,lastJukoCompleted:false,unionCrownCompleted:false,trueSuccessorCompleted:false,chrisHeathCompleted:false,chrisRomfordCompleted:false,peterAdministratorCompleted:false,peterDGCompleted:false,peterUxbridgeCompleted:false,kevinShinjukuCompleted:false,kevinRebellionCompleted:false,kevinFacelessCompleted:false,kevinAliveCompleted:false,kevinShibuyaCompleted:false};
 closeBeforeStoryErase(false);refreshBeforeStoryChapters();toggleBeforeStoryChapters(false);selectBeforeStoryCast('josiah');renderBeforeStoryMenu(0);syncMenuSong();beforeStoryEraseButton.focus();
};
document.addEventListener('keydown',e=>{
 if(beforeStoryEraseDialog.hidden)return;
 if(e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();closeBeforeStoryErase();}
 if(e.code==='Tab'){e.preventDefault();e.stopImmediatePropagation();const cancel=document.getElementById('beforeStoryEraseCancel'),confirm=document.getElementById('beforeStoryEraseConfirm');(document.activeElement===cancel?confirm:cancel).focus();}
},true);
const erasePreviousClearBeforeStory=clearBeforeStoryMenu;
clearBeforeStoryMenu=function(){closeBeforeStoryErase(false);erasePreviousClearBeforeStory();};

