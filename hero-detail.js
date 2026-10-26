/* Shared close-up detail for the twelve named Project BC characters.
   Kept on the existing rigs so dialogue, weapons and combat animation still work. */
'use strict';
const heroSkinPores=(()=>{
 const size=128,data=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const n=Math.sin(x*127.1+y*311.7)*43758.5453;
  const v=125+Math.floor((n-Math.floor(n))*15);
  const i=(y*size+x)*4;data[i]=data[i+1]=data[i+2]=v;data[i+3]=255;
 }
 const texture=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);
 texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
 texture.repeat.set(5,4);texture.magFilter=THREE.LinearFilter;
 texture.minFilter=THREE.LinearMipmapLinearFilter;texture.generateMipmaps=true;
 texture.needsUpdate=true;return texture;
})();
const heroClothWeave=(()=>{
 const size=128,data=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const v=126+((x&3)===0?9:0)+((y&3)===0?7:0);
  const i=(y*size+x)*4;data[i]=data[i+1]=data[i+2]=v;data[i+3]=255;
 }
 const texture=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);
 texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
 texture.repeat.set(5,5);texture.magFilter=THREE.LinearFilter;
 texture.minFilter=THREE.LinearMipmapLinearFilter;texture.generateMipmaps=true;
 texture.needsUpdate=true;return texture;
})();
function heroRoundedBox(width,height,depth,radius){
 const geo=new THREE.BoxGeometry(width,height,depth,4,4,4);
 const p=geo.attributes.position;
 const hx=width/2-radius,hy=height/2-radius,hz=depth/2-radius;
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
  const cx=THREE.MathUtils.clamp(x,-hx,hx),cy=THREE.MathUtils.clamp(y,-hy,hy),cz=THREE.MathUtils.clamp(z,-hz,hz);
  const dx=x-cx,dy=y-cy,dz=z-cz,len=Math.hypot(dx,dy,dz)||1;
  p.setXYZ(i,cx+dx/len*radius,cy+dy/len*radius,cz+dz/len*radius);
 }
 p.needsUpdate=true;geo.computeVertexNormals();return geo;
}
function heroTrouserLeg(width,height,depth){
 const geo=new THREE.CylinderGeometry(width*.53,width*.47,height,24,8);
 const p=geo.attributes.position;
 for(let i=0;i<p.count;i++){
  const y=p.getY(i),fall=(height/2-y)/height;
  p.setX(i,p.getX(i)*(1-.065*Math.sin(fall*Math.PI)));
  p.setZ(i,p.getZ(i)*depth/width+(fall>.54?.006:0));
 }
 p.needsUpdate=true;geo.computeVertexNormals();return geo;
}
const heroFaceLayout={
 josiah:{z:.31,eye:.025,mouth:-.235},peter:{z:.29,eye:.015,mouth:-.225},
 alissa:{z:.25,eye:.02,mouth:-.19},stephen:{z:.28,eye:.04,mouth:-.225},
 gareth:{z:.27,eye:.015,mouth:-.215},sterling:{z:.25,eye:.005,mouth:-.19},
 jones:{z:.26,eye:.035,mouth:-.205},emma:{z:.26,eye:.035,mouth:-.19},
 mariah:{z:.26,eye:.01,mouth:-.20},pinter:{z:.28,eye:.025,mouth:-.22},
 damian:{z:.27,eye:.015,mouth:-.215},kevinRevealed:{z:.27,eye:.015,mouth:-.18}
};
function enhanceHeroModel(actor,identity){
 const u=actor.userData,head=u.head,body=u.body;
 if(!head||!body||u.hdHero)return actor;
 u.hdHero=identity;
 const masked=identity==='kevinMasked',face=heroFaceLayout[identity];
 head.scale.setScalar(masked?.96:.86);
 if(face){
  for(const part of head.children){
   if(!part.isMesh||part.geometry?.type!=='SphereGeometry')continue;
   if(Math.abs(part.position.x)>.075&&Math.abs(part.position.x)<.27&&Math.abs(part.position.y-face.eye)<.075&&part.position.z>.22&&part.scale.x>.07&&part.scale.x<.13&&part.scale.y<.11){
    part.scale.x*=.72;part.scale.y*=.68;part.scale.z*=.72;part.position.z-=.012;
   }else if(Math.abs(part.position.x)>.075&&Math.abs(part.position.x)<.27&&Math.abs(part.position.y-face.eye)<.055&&part.position.z>.22&&part.scale.x>.012&&part.scale.x<.07&&part.scale.y<.06){
    part.scale.x*=.78;part.scale.y*=.78;part.position.z-=.018;
   }
   if(Math.abs(part.position.x)<.072&&part.position.y<-.025&&part.position.y>-.15&&part.position.z>face.z-.035&&part.scale.x<.075&&part.scale.y>.05){
    part.scale.x*=.65;part.scale.z*=.67;part.position.z-=.012;
   }
  }
 }
 // Replace only silhouette-size primitives. This smooths close-ups without
 // multiplying the many small details used by crowds, bullets or scenery.
 for(const group of [head,body,...(u.arms||[]),...(u.legs||[])])group.traverse(node=>{
  if(!node.isMesh)return;
  const g=node.geometry,s=node.scale;
  if(g?.type==='SphereGeometry'&&s.x>.16&&s.y>.16){
   node.geometry=new THREE.SphereGeometry(1,s.x>.25?48:36,s.x>.25?32:24);g.dispose();
  }else if(g?.type==='BoxGeometry'){
   const q=g.parameters;
   if(u.legs?.includes(node.parent)&&q.height>.56&&q.width>.14){
    node.geometry=heroTrouserLeg(q.width,q.height,q.depth);g.dispose();
   }else if(q.width>.17&&q.height>.18&&q.depth>.12){
    node.geometry=heroRoundedBox(q.width,q.height,q.depth,Math.min(.025,q.width*.09,q.depth*.09));g.dispose();
   }
  }
 });
 // The face and hands share the original skin material on these rigs.
 let skinMaterial=null;
 if(!masked){
  const faceMesh=head.children.find(n=>n.isMesh&&n.geometry?.type==='SphereGeometry'&&n.scale.x>.24&&n.scale.y>.32&&n.position.z>=-.01);
  skinMaterial=faceMesh?.material||null;
  if(skinMaterial?.isMeshStandardMaterial){
   skinMaterial.roughness=.78;skinMaterial.bumpMap=heroSkinPores;skinMaterial.bumpScale=.003;
   skinMaterial.needsUpdate=true;
  }
 }
 const torso=body.children.find(n=>n.isMesh&&n.geometry?.type==='SphereGeometry'&&n.scale.x>.23&&n.scale.y>.35);
 const clothMaterial=torso?.material;
 if(clothMaterial?.isMeshStandardMaterial&&clothMaterial!==skinMaterial){
  clothMaterial.roughness=.9;clothMaterial.bumpMap=heroClothWeave;clothMaterial.bumpScale=.0025;clothMaterial.needsUpdate=true;
 }
 if(face&&skinMaterial){
  const shadow=skinMaterial.color.clone().multiplyScalar(.61);
  const softShadow=new THREE.MeshStandardMaterial({color:shadow,roughness:.94});
  const contour=new THREE.MeshStandardMaterial({color:skinMaterial.color.clone().multiplyScalar(.93),roughness:.79,bumpMap:heroSkinPores,bumpScale:.002});
  // Fine lower lids and ear cartilage remain readable at close range.
  for(const side of [-1,1]){
   line3(head,[[side*.082,face.eye-.052,face.z+.004],[side*.14,face.eye-.058,face.z+.011],[side*.195,face.eye-.043,face.z-.025]],contour,.005).name='Lower eyelid';
   ball(head,.013,.007,.005,softShadow,side*.045,-.139,face.z+.072).name='Nostril';
   line3(head,[[side*.27,-.015,.025],[side*.287,-.072,.052],[side*.268,-.103,.03]],contour,.006).name='Ear fold';
  }
 }
 // Seams and a woven finish lend the clothing scale without changing costumes.
 if(clothMaterial?.color){
  const seamColor=clothMaterial.color.clone().offsetHSL(0,-.02,.10);
  const seam=new THREE.MeshStandardMaterial({color:seamColor,roughness:.86});
  for(const side of [-1,1]){
   line3(body,[[side*.255,1.50,.075],[side*.285,1.27,.14],[side*.235,.98,.14]],seam,.004).name='Tailored side seam';
   const arm=u.arms?.[(side+1)/2];
   if(arm)line3(arm,[[side*.03,-.13,.115],[side*.04,-.33,.125],[side*.025,-.52,.10]],seam,.004).name='Sleeve seam';
   const leg=u.legs?.[(side+1)/2];
   if(leg)line3(leg,[[0,-.09,.128],[0,-.37,.134],[0,-.60,.12]],seam,.004).name='Trouser crease';
  }
 }
 // Articulated fingers preserve the existing hand pivot for gun aiming.
 for(const arm of u.arms||[]){
  const hand=arm.children.find(n=>n.isMesh&&n.geometry?.type==='SphereGeometry'&&n.position.y<-.53&&n.scale.x>.06&&n.scale.x<.13);
  if(!hand)continue;
  const fingerMat=hand.material;
  for(let i=0;i<4;i++){
   const finger=ball(arm,.016,.057-(i===3?.008:0),.018,fingerMat,hand.position.x+(i-1.5)*.037,hand.position.y-.095,hand.position.z+.02);
   finger.rotation.z=(i-1.5)*.10;finger.name='Finger';
  }
 }
 return actor;
}
