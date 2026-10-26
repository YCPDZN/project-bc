/* Keep interrupted chapter loads and graphics resets recoverable. */
(() => {
 const panel=document.createElement('section');panel.id='chapterRecovery';panel.hidden=true;
 panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','chapterRecoveryTitle');
 panel.innerHTML='<div><small>PROJECT BC</small><h2 id="chapterRecoveryTitle"></h2><p id="chapterRecoveryText"></p><button id="chapterRecoveryMenu" type="button">MAIN MENU</button><button id="chapterRecoveryReload" type="button">RELOAD GAME</button></div>';
 document.body.append(panel);
 const title=$('chapterRecoveryTitle'),text=$('chapterRecoveryText'),back=$('chapterRecoveryMenu'),reload=$('chapterRecoveryReload');
 function stopInput(){keys.clear();drag=false;document.exitPointerLock?.();window.dispatchEvent(new Event('blur'));}
 function show(){panel.hidden=false;(back.hidden?reload:back).focus();}
 function returnToMenu(){
  window.projectBCChapterFailed=false;panel.hidden=true;
  try{menu();refreshProgressUI();return true;}catch(error){console.error('Chapter cleanup failed',error);window.projectBCChapterFailed=true;return false;}
 }
 window.showChapterLoadFailure=function(chapter){
  window.projectBCChapterFailed=true;stopInput();
  const cleaned=returnToMenu();window.projectBCChapterFailed=true;
  title.textContent='Chapter interrupted';text.textContent='“'+chapter+'” could not start. '+(cleaned?'Return to the main menu to select a chapter again. Your saved progress is kept.':'Reload the game to return to your saved progress.');
  back.hidden=!cleaned;reload.hidden=false;show();
 };
 back.onclick=()=>{if(!returnToMenu())reload.click();};
 reload.onclick=()=>location.reload();
 renderer.domElement.addEventListener('webglcontextlost',event=>{
  event.preventDefault();window.projectBCGraphicsSuspended=true;stopInput();
  if(window.projectBCChapterFailed)return;
  title.textContent='Graphics interrupted';text.textContent='Waiting for the graphics system to recover. If this takes too long, reload the game to return to your saved progress.';
  back.hidden=true;reload.hidden=false;show();
 });
 renderer.domElement.addEventListener('webglcontextrestored',()=>{
  window.projectBCGraphicsSuspended=false;
  if(!window.projectBCChapterFailed){panel.hidden=true;last=performance.now();}
 });
 document.addEventListener('keydown',event=>{
  if(panel.hidden)return;
  if(event.target.closest?.('#chapterRecovery')&&['Tab','Enter','Space'].includes(event.code))return;
  event.preventDefault();event.stopImmediatePropagation();
 },true);
})();
