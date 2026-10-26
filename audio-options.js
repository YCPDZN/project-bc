/* Shared audio levels for every menu and chapter. Keep original clip volumes as mix levels. */
const AudioOptions=(()=>{
 // Load recordings only when played, so returning to the menu does not preload every chapter.
 const preloadDescriptor=Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,'preload');
 Object.defineProperty(HTMLMediaElement.prototype,'preload',{
  configurable:true,enumerable:preloadDescriptor.enumerable,
  get(){return preloadDescriptor.get.call(this);},
  set(value){preloadDescriptor.set.call(this,'none');}
 });
 const NativeAudio=window.Audio;
 window.Audio=function Audio(src){
  const element=new NativeAudio();element.preload='none';if(src!==undefined)element.src=src;return element;
 };
 window.Audio.prototype=NativeAudio.prototype;Object.setPrototypeOf(window.Audio,NativeAudio);
 const key='project-bc-audio-options-v1';
 const clamp=value=>Math.max(0,Math.min(1,Number(value)||0));
 let saved={};try{saved=JSON.parse(localStorage.getItem(key))||{};}catch(e){}
 const levels={sound:clamp(saved.sound??1),music:clamp(saved.music??1),sfx:clamp(saved.sfx??.55)};
 const media=new Set(),categories=new WeakMap(),baseVolumes=new WeakMap();
 const descriptor=Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,'volume');
 function apply(element){if(!baseVolumes.has(element))baseVolumes.set(element,descriptor.get.call(element));const base=baseVolumes.get(element);const category=categories.get(element)||'voice';const channel=category==='music'?levels.music:category==='sfx'?levels.sfx:1;descriptor.set.call(element,clamp(base*levels.sound*channel));}
 Object.defineProperty(HTMLMediaElement.prototype,'volume',{
  configurable:true,enumerable:descriptor.enumerable,
  get(){return baseVolumes.get(this)??descriptor.get.call(this);},
  set(value){baseVolumes.set(this,clamp(value));media.add(this);apply(this);}
 });
 const nativePlay=HTMLMediaElement.prototype.play;
 HTMLMediaElement.prototype.play=function(){media.add(this);apply(this);return nativePlay.call(this);};
 function category(element,name){if(!element)return;categories.set(element,name);media.add(element);apply(element);}
 function level(name,value){levels[name]=clamp(value);try{localStorage.setItem(key,JSON.stringify(levels));}catch(e){}media.forEach(apply);if(typeof master!=='undefined'&&master)master.gain.value=(typeof muted!=='undefined'&&muted?0:.22)*levels.sound*levels.sfx;}
 return{levels,category,level,suspend:()=>{const clips=[...media].filter(a=>!a.paused&&!a.ended);clips.forEach(a=>a.pause());return clips;}};
})();
