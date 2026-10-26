let encyclopediaTimer=null;
function closeEncyclopedia(focus=true){
 clearTimeout(encyclopediaTimer);encyclopediaTimer=null;
 $('encyclopediaLoading').hidden=true;$('encyclopediaPanel').hidden=true;$('menu').inert=false;
 if(focus&&mode==='menu')$('openEncyclopedia').focus();
}
function buildEncyclopediaCharacters(){
 const list=$('encyclopediaCharacters'),previous=selectedSubject;
 list.replaceChildren();
 for(let id=0;id<13;id++){
  selectSubject(id);
  const name=$('subjectName').textContent,role=$('subjectRole').textContent;
  const status=$('subjectStatus').textContent,code=$('subjectCode').textContent;
  const card=document.createElement('button');card.type='button';card.className='encyclopedia-character';
  const small=document.createElement('span');small.className='eyebrow';small.textContent=code;
  const heading=document.createElement('strong');heading.textContent=name;
  const title=document.createElement('span');title.textContent=role;
  const faction=document.createElement('span');faction.className='encyclopedia-affiliation';faction.textContent=characterFactionSummary(id);
  const state=document.createElement('em');state.textContent=status;
  card.append(small,heading,title,faction,state);
  card.onclick=()=>{
   closeEncyclopedia(false);selectSubject(id);$('inspect').click();
   window.encyclopediaViewerReturn=true;
   $('back').textContent='← BACK TO ENCYCLOPEDIA';
  };
  list.append(card);
 }
 selectSubject(previous);
}
function openEncyclopedia(){
 if(mode!=='menu'||gameProgress.laniakeaAftermath===true||gameProgress.kevinSolarAftermath===true)return;
 $('audioOptionsPanel').hidden=true;
 $('encyclopediaLoading').hidden=false;$('menu').inert=true;
 encyclopediaTimer=setTimeout(()=>{
  encyclopediaTimer=null;if(mode!=='menu'){closeEncyclopedia(false);return;}
  buildEncyclopediaCharacters();$('encyclopediaLoading').hidden=true;
  $('encyclopediaPanel').hidden=false;$('closeEncyclopedia').focus();
 },700);
}
function showEncyclopediaInstant(){
 if(mode!=='menu')return;
 buildEncyclopediaCharacters();$('encyclopediaLoading').hidden=true;
 $('encyclopediaPanel').hidden=false;$('menu').inert=true;$('closeEncyclopedia').focus();
}
$('openEncyclopedia').onclick=openEncyclopedia;
$('closeEncyclopedia').onclick=()=>closeEncyclopedia();
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&(!$('encyclopediaPanel').hidden||!$('encyclopediaLoading').hidden)){
  event.preventDefault();closeEncyclopedia();
 }
});
