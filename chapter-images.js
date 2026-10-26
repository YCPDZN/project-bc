/* Chapter artwork captured from Project BC's own rendered scenes. */
const CHAPTER_SCENE_IMAGES={
 brent:{src:'assets/chapter-brent-cross.jpg',alt:'Josiah and Peter in the Brent Cross atrium'},
 cabinet:{src:'assets/chapter-cabinet.jpg',alt:'Josiah and Peter outside No. 10 Downing Street'},
 civil:{src:'assets/chapter-civil.jpg',alt:'The confrontation inside the House of Commons'},
 tube:{src:'assets/chapter-tube.jpg',alt:'Alissa aboard the southbound Tube train'},
 kevinTube:{src:'assets/chapter-kevin-tube.jpg',alt:'The masked figure beyond Camden Town’s blue door'},
 cornered:{src:'assets/chapter-cornered-rat.jpg',alt:'Kevin cornered in the government’s underground rooms'},
 fool:{src:'assets/chapter-fool-traitor.jpg',alt:'Gareth Williams and Josiah at Door 100 in the Red Room'},
 busters:{src:'assets/chapter-busters.jpg',alt:'David “Diesel” Busters inside the gold Pindar Complex'},
 uxbridge:{src:'assets/chapter-uxbridge.jpg',alt:'Kevin pursuing Gareth Williams through daytime Westminster'},
 secretaryDead:{src:'assets/chapter-secretary-dead.jpg',alt:'Josiah grieving in the Brent Cross atrium'},
 prime:{src:'assets/chapter-prime-secretary.jpg',alt:'Kevin at Brent Cross before the final confrontation'},
 resistanceSiege:{src:'assets/chapter-resistance-siege.jpg',alt:'Peter Chambers’s last stand in the Brent Cross atrium'},
 defense:{src:'assets/chapter-defense.jpg',alt:'Josiah defending the Brent Cross atrium'},
 kevinSiege:{src:'assets/chapter-kevin-siege.jpg',alt:'Josiah confronted by Peter and Kevin in the sealed atrium'},
 curtain:{src:'assets/chapter-final-curtain.jpg',alt:'Gareth Williams addressing Parliament Square as Third Prime Secretary'},
 roam:{src:'assets/chapter-free-roam.jpg',alt:'The game’s Parliament Square at night'}
};
function setChapterSceneImage(card,key){
 if(!card)return;
 const art=CHAPTER_SCENE_IMAGES[key];
 let image=card.querySelector(':scope > img');
 if(!image){image=document.createElement('img');card.prepend(image);}
 card.querySelector('.busters-card-portrait')?.remove();
 if(!card.querySelector(':scope > .chapter-card-copy')){
  const copy=document.createElement('div');copy.className='chapter-card-copy';
  for(const child of [...card.childNodes])if(child!==image)copy.appendChild(child);
  card.appendChild(copy);
 }
 card.classList.add('has-scene-image');image.classList.add('chapter-scene-image');
 card.querySelector('.chapter-eyebrow')?.classList.add('eyebrow');
 image.width=960;image.height=640;image.loading='lazy';image.decoding='async';image.alt=art.alt;
 if(image.dataset.scene!==key){image.src=art.src;image.dataset.scene=key;}
}
function refreshChapterSceneImages(){
 const byButton=id=>document.getElementById(id)?.closest('.chapter-card');
 for(const [id,key] of [
  ['start','brent'],['operationCabinet','cabinet'],['openCivil','civil'],['openCorneredRat','cornered'],
  ['openFoolTraitor','fool'],['openDefense','defense'],['openBusters','busters'],['openUxbridge','uxbridge'],
  ['openFinalCurtain','curtain'],['openKevinSiege','kevinSiege'],['openFreeRoam','roam']
 ])setChapterSceneImage(byButton(id),key);
 setChapterSceneImage(byButton('openTube'),isKevinStoryRoute()?'kevinTube':'tube');
 const title=chapterFiveTitle();
 setChapterSceneImage(document.getElementById('chapter5'),title==='THE SECRETARY IS DEAD'?'secretaryDead':title==='SIEGE OF BRENT CROSS'?'resistanceSiege':'prime');
}
const refreshProgressWithChapterScenes=refreshProgressUI;
refreshProgressUI=function(){refreshProgressWithChapterScenes();refreshChapterSceneImages();};
refreshChapterSceneImages();
