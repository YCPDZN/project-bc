/* The second personal story shares the prequel menu, never campaign actors or saves. */
const beforeStoryChrisButton=document.createElement('button');beforeStoryChrisButton.id='beforeStoryChris';beforeStoryChrisButton.type='button';beforeStoryChrisButton.setAttribute('aria-expanded','false');beforeStoryChrisButton.setAttribute('aria-controls','beforeStoryChrisChapters');
beforeStoryChrisButton.innerHTML='<b>02</b><span><small>CHARACTER STORY</small><strong>CHRIS PINTER</strong></span><i>↗</i>';
document.getElementById('beforeStoryChapters').after(beforeStoryChrisButton);
const beforeStoryChrisChapters=document.createElement('section');beforeStoryChrisChapters.id='beforeStoryChrisChapters';beforeStoryChrisChapters.hidden=true;beforeStoryChrisChapters.setAttribute('aria-labelledby','beforeStoryChrisChapterTitle');
beforeStoryChrisChapters.innerHTML='<small>CHRIS PINTER / CHAPTER 1 / 2019</small><h2 id="beforeStoryChrisChapterTitle">INSURRECTION OF THE HEATH</h2><p>Dagenham, East London.<br>Fight the roadmen with police support.</p><button id="beforeStoryHeath" type="button">BEGIN CHAPTER 1 →</button><button id="beforeStoryChrisBack" type="button">← BACK</button>';
beforeStoryChrisButton.after(beforeStoryChrisChapters);
function closeBeforeStoryChrisChapters(){beforeStoryChrisChapters.hidden=true;beforeStoryChrisButton.setAttribute('aria-expanded','false');}
const chrisPreviousSelect=selectBeforeStoryCast;
selectBeforeStoryCast=function(id){
 const c=beforeStoryScene;if(!c||mode!=='beforeStoryMenu')return;
 if(id!=='chris'){c.story=c.story===undefined?'home':c.story==='chris'?'josiah':c.story;closeBeforeStoryChrisChapters();document.querySelector('.before-story-cast').hidden=false;chrisPreviousSelect(id);return;}
 c.story='chris';if(!c.cast.chris){const actor=isolateBeforeStoryModel(makeChrisPinter());actor.name='Before the Story / Chris Pinter';c.cast.chris=actor;c.root.add(actor);}
 for(const [key,actor] of Object.entries(c.cast)){actor.visible=key==='chris';actor.position.set(0,0,0);}if(c.crownMenu)c.crownMenu.visible=false;c.actor=c.cast.chris;
 document.getElementById('beforeStoryChapters').hidden=true;document.getElementById('beforeStoryJosiah').setAttribute('aria-expanded','false');document.querySelector('.before-story-cast').hidden=true;
 document.getElementById('beforeStoryCode').textContent='CHARACTER STORY / 02 / YEAR 2019';document.getElementById('beforeStoryName').textContent='CHRIS PINTER';document.getElementById('beforeStoryAlignment').textContent='ALIGNMENT: LAWFUL GOOD';document.getElementById('beforeStoryProfileText').textContent='A police officer from Dagenham, East London, United Kingdom. His story begins with Insurrection of the Heath in 2019.';
 document.querySelectorAll('[data-before-cast]').forEach(button=>button.setAttribute('aria-pressed','false'));renderBeforeStoryMenu(0);syncMenuSong();
};
beforeStoryChrisButton.onclick=()=>{if(mode!=='beforeStoryMenu')return;const open=beforeStoryChrisChapters.hidden;selectBeforeStoryCast('chris');beforeStoryChrisChapters.hidden=!open;beforeStoryChrisButton.setAttribute('aria-expanded',String(open));(open?document.getElementById('beforeStoryChrisBack'):beforeStoryChrisButton).focus();};
document.getElementById('beforeStoryChrisBack').onclick=()=>{closeBeforeStoryChrisChapters();beforeStoryScene.story='home';syncMenuSong();beforeStoryChrisButton.focus();};
const chrisPreviousToggle=toggleBeforeStoryChapters;
toggleBeforeStoryChapters=function(open){closeBeforeStoryChrisChapters();if(open&&beforeStoryScene&&(beforeStoryScene.actor===beforeStoryScene.cast.chris||beforeStoryScene.actor===beforeStoryScene.cast.jake))selectBeforeStoryCast('josiah');if(beforeStoryScene)beforeStoryScene.story=open?'josiah':'home';chrisPreviousToggle(open);syncMenuSong();};
const chrisPreviousTheme=selectedBeforeStoryTheme;
selectedBeforeStoryTheme=function(){return beforeStoryScene?.story==='josiah'?chrisPreviousTheme():menuSong;};
document.addEventListener('keydown',e=>{if(mode==='beforeStoryMenu'&&e.code==='Escape'&&!beforeStoryChrisChapters.hidden&&beforeStoryEraseDialog.hidden){e.preventDefault();e.stopImmediatePropagation();document.getElementById('beforeStoryChrisBack').click();}},true);
document.getElementById('beforeStoryEraseDescription').textContent='Erase completed chapters and unlocks for Character Specific Stories and return to the beginning. Your main campaign progress and audio settings are kept.';
