/* Visual feedback follows successful player shots, never mouse presses or AI fire. */
(() => {
 const feedback=new WeakMap(),active=new Set();
 function kick(gun){
  if(!gun?.parent)return;
  let fx=feedback.get(gun);
  if(!fx){
   const model=new THREE.Group();model.name='Player weapon recoil';
   for(const child of [...gun.children])model.add(child);
   gun.add(model);
   // Local barrel geometry points forward along -Z in these first-person guns.
   let front=0;model.traverse(o=>{if(o.isMesh&&o.geometry){o.geometry.computeBoundingBox();front=Math.min(front,o.position.z+o.geometry.boundingBox.min.z*o.scale.z);}});
   const flash=new THREE.Mesh(new THREE.ConeGeometry(.045,.16,5),new THREE.MeshBasicMaterial({color:0xffdc91,transparent:true,opacity:.9,depthWrite:false}));
   flash.rotation.x=-Math.PI/2;flash.position.set(0,0,front-.06);flash.visible=false;model.add(flash);
   fx={gun,model,flash,left:0};feedback.set(gun,fx);
  }
  fx.left=.14;active.add(fx);
 }
 const bindings=[
  ['fireBossWeapon',()=>[bossBattle?.gun,bossBattle?.fire]],
  ['fireCampWeapon',()=>[parliamentCamp?.gun,parliamentCamp?.battle?.fire]],
  ['fireFinalWarWeapon',()=>[finalWar?.gun,finalWar?.fire]],
  ['firePeterFinale',()=>[corneredRooms?.finale?.playerGun,corneredRooms?.finale?.fire]],
  ['shootTyrant',()=>[tyrantFour?.gun,tyrantFour?.fire]],
  ['shootTube',()=>[tubeMission?.gun,tubeMission?.cooldown]],
  ['shootPindar',()=>[pindar?.playerGun,pindar?.encounter?.shotTime]],
  ['shootCurtainBattle',()=>[finalCurtainBattle?.gun,finalCurtainBattle?.fire]],
  ['shootUxbridgeMariah',()=>[redRooms?.mariahFight?.gun,redRooms?.mariahFight?.fire]]
 ];
 for(const [name,read]of bindings){
  const original=window[name];
  window[name]=function(...args){const [gun,before]=read(),result=original(...args),[,after]=read();if(gun&&Number.isFinite(after)&&after>(before||0))kick(gun);return result;};
 }
 window.updatePlayerGunFeedback=function(dt){
  for(const fx of active){
   fx.left=Math.max(0,fx.left-Math.max(0,dt));
   const strength=fx.left/.14;
   fx.model.position.z=.045*strength;fx.model.rotation.x=.11*strength;
   fx.flash.visible=fx.left>.09&&fx.gun.visible;
   if(!fx.left||!fx.gun.parent){fx.model.position.z=0;fx.model.rotation.x=0;fx.flash.visible=false;active.delete(fx);}
  }
 };
})();
