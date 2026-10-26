// Project BC fictional prologue. User-supplied narrative; only Markdown markup is removed.
const PROLOGUE = [
  {
    "era": "2018",
    "title": "A stranger in Japan",
    "text": "In the year 2018, Josiah Richards touched down in Japan, his sights set on one man: Tajiri Juko, the elusive Stand user tied to the Camden Church attack back home in England. What started as a lone-wolf hunt for justice twisted into something far grander—a brutal ascent to power in Japan's hidden world."
  },
  {
    "era": "2018",
    "title": "Union Crown",
    "text": "Josiah arrived in Sendai under a stormy sky, his spectral Union Crown humming with restrained fury—a shimmering crown of ethereal chains that bound enemies' powers against them. Whispers led him to the outskirts, where he tracked rumors of \"The Faceless Opposer,\" a spectral power said to mimic and counter any ability it faced. But Sendai was no quiet city; it pulsed with rival factions vying for control after the chaos of past battles."
  },
  {
    "era": "2018",
    "title": "The first reckoning",
    "text": "Drawn into a back-alley ambush, Josiah faced two cursed entities loyal to a demon god—Tadai and Kazai, snarling horrors. Tadai's explosive cursed projectiles rained down like hellfire, while Kazai's phasing shadows slipped through walls to strike from impossible angles. Lesser men would have fallen. Josiah? He laughed. Union Crown erupted, its ethereal chains latching onto Tadai's blasts mid-air and hurling them back threefold. Kazai's shadows twisted into knots, binding him in his own cursed darkness. In under a minute, both lay exorcised and broken at his feet—vanquished with ruthless ease. Word spread like wildfire: a foreigner had crushed their spirits"
  },
  {
    "era": "2021",
    "title": "Echoes",
    "text": "2021. The coronavirus pandemic struck the world like wildfire, lockdowns chaining billions in isolation as death tolls climbed. Yet echoes lingered."
  },
  {
    "era": "2021",
    "title": "Return to England",
    "text": "Three years after Sendai's shadows, Josiah Richards returned to England, his Union Crown tempered by victory. Amid Partygate's brewing scandal—parties in Downing Street while the nation suffered—he was assigned to the inquiry. A civil servant by day, kingpin by night, Josiah navigated Westminster's lies, his chains ready to bind fresh corruption."
  },
  {
    "era": "2021",
    "title": "The inquiry",
    "text": "But the investigation twisted him. Unearthing layers of elite hypocrisy—ministers partying while families buried loved ones—ignited a fire in Josiah's soul. The inquiry turned him narcissistic, convincing him he alone could shatter the status quo. No longer content with shadows, he envisioned Union Crown as the tool to reform Britain itself: binding corrupt leaders, rewriting power's rules. Ambition swelled—Parliament would kneel, or break."
  },
  {
    "era": "2021–22",
    "title": "In the shadow of the Crown",
    "text": "Whispers spread through the highest circles: The Queen had secretly been meeting with him, drawn to the outsider's unyielding vision. And everyone loved the Queen—her quiet strength a beacon amid the chaos, approval soaring as she sat alone at Philip's funeral, the nation's perfect symbol of sacrifice. No wonder, widowed and isolated, she sought Josiah to do her bidding: purge the hypocrites she could not touch. In shadowed chambers at Buckingham, she tested his resolve, her regal gaze piercing his bravado. Was he the crown's reckoning... or its undoing?"
  },
  {
    "era": "2022",
    "title": "A stepping stone",
    "text": "A certain blonde politician, who was Britain's public Enemy Number One, became Josiah's stepping stone. 62% demanded his head. The nation got it—gift-wrapped by Union Crown."
  },
  {
    "era": "2022",
    "title": "The succession storm",
    "text": "The Queen passed away at the age of 96 in the 8th of September 2022, her reign's final chapter closing as the world mourned. the politician's early downfall had been her last quiet victory, but Josiah stood ready in the shadows—his approval at record highs, Union Crown poised for the succession storm. With the Queen gone, who would his chains bind next?"
  },
  {
    "era": "2024",
    "title": "The Riots of ’24",
    "text": "2 years later, fury boiled over into the Riots of '24. David “Diesel” Busters, the firebrand populist of the Cyan Party—swept to power on a tidal wave of disgust. the public demanded an alternative. Cyan banners flew over burning precincts as Diesel's rallies turned violent, his chants of \"Drain the Elites!\" echoing Josiah's old promises. Now the narcissist faced a mirror—would Union Crown bind the new demagogue... or crown him?"
  },
  {
    "era": "2024",
    "title": "The mandarin menace",
    "text": "David “Diesel” Busters crowned his triumph by appointing Josiah Richards as Cabinet Secretary of the Cabinet Office—the civil service's iron spine, now bent to populist will. But cracks formed fast. Josiah, guardian of impartiality, clashed with Diesel's raw political hammer. \"Neutrality serves the nation,\" Josiah warned, chains itching beneath his suit. \"Politics serves the people!\" Diesel roared back. Parliament erupted as Diesel branded Josiah \"the obstruction\"—a relic blocking Cyan revolution. \"Snap election!\" he thundered, dissolving government to purge the mandarin menace. In desperation, Diesel forged an unholy alliance with far right extremists, whose rallies fused with Cyan fury. United, they marched on Westminster, Cyan flags entwined with Union Jacks. Josiah's chains faced their greatest test: bind the alliance... or join it?"
  },
  {
    "era": "2024",
    "title": "Britain knelt",
    "text": "But Josiah flipped the board. Siding with Labour's rising star Mariah Banu, he branded David \"traitor committing sedition\"—Cyan mobs torching the constitution itself. Union Crown worked invisibly: leaked tapes, witness bindings, scandal chains that crushed the alliance at the polls. Mariah swept victory with Josiah's shadow hand guiding every swing seat. Installed as PM, Mariah turned on her maker. Josiah struck first—defeating both her and Diesel's remnants in a single night of ethereal chains. Parliament dissolved in chaos, the nation leaderless. From the ashes, Josiah emerged as Interim Leader, Union Crown's golden halo his crown. The narcissist had won: Britain knelt to its kingpin."
  }
];
let introIndex = -1;
function renderIntro(){
 const chapter=PROLOGUE[introIndex],opening=!chapter;
 $('intro').classList.toggle('chapter',!opening);
 $('introEra').textContent=opening?'BC':chapter.era;
 $('introEyebrow').textContent=opening?'THE RISE OF UNION CROWN':chapter.era+' / THE RISE OF UNION CROWN';
 if(opening)$('introHeading').innerHTML='The Prime Secretary<br><span>Josiah Richards</span>';
 else $('introHeading').textContent=chapter.title;
 const paragraph=document.createElement('p');
 paragraph.textContent=opening?MALL_BIO:chapter.text;
 $('introBody').replaceChildren(paragraph);$('introBody').scrollTop=0;
 $('introCount').textContent=opening?'PROLOGUE / 00':'CHAPTER '+String(introIndex+1).padStart(2,'0')+' / '+String(PROLOGUE.length).padStart(2,'0');
 $('introProgress').style.width=((introIndex+1)/PROLOGUE.length*100)+'%';
 $('introPrev').hidden=opening;
 $('introNext').firstChild.textContent=opening?'BEGIN PROLOGUE ':introIndex===PROLOGUE.length-1?'ENTER PROJECT BC ':'NEXT CHAPTER ';
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)$('introHeading').animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,easing:'ease-out'});
}
function beginIntro(){setMode('disclaimer');$('fictionCard').hidden=false;requestAnimationFrame(()=>$('fictionContinue').focus());}
function continueFromDisclaimer(){if(mode!=='disclaimer')return;$('fictionCard').hidden=true;setMode('intro');introIndex=-1;renderIntro();$('introNext').focus();}
function nextIntro(){if(introIndex>=PROLOGUE.length-1){menu();return;}introIndex++;renderIntro();}
function previousIntro(){introIndex=Math.max(-1,introIndex-1);renderIntro();}
function setupIntro(){
 $('fictionContinue').onclick=continueFromDisclaimer;
 $('introNext').onclick=nextIntro;$('introPrev').onclick=previousIntro;
 $('skipIntro').onclick=menu;$('replayIntro').onclick=beginIntro;
 beginIntro();
}
