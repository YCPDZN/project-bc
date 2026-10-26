// Original, lightweight 3D visualisations used only by Josiah's reset sequence.
function createJosiahCosmicModels(parent){
 const models={};
 const ocean=new THREE.MeshStandardMaterial({color:0x103966,roughness:.8,metalness:.08});
 const land=new THREE.MeshStandardMaterial({color:0x4e7654,roughness:1,flatShading:true});
 const group=new THREE.Group();group.visible=false;parent.add(group);models.british=group;
 const globe=new THREE.Mesh(new THREE.SphereGeometry(3.3,48,32),ocean);group.add(globe);
 const island=(points,scale=1)=>{const shape=new THREE.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x*scale,y*scale):shape.moveTo(x*scale,y*scale));shape.closePath();const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:true,bevelSize:.035,bevelThickness:.035,bevelSegments:1}),land);mesh.position.z=3.48;group.add(mesh);};
 island([[-.2,-2.2],[-.5,-1.85],[-.4,-1.5],[-.75,-1.1],[-.62,-.78],[-.35,-.63],[-.52,-.25],[-.45,.1],[-.65,.5],[-.4,.78],[-.65,1.18],[-.38,1.65],[-.12,1.45],[.2,1.78],[.55,1.5],[.48,1.1],[.78,.78],[.56,.48],[.8,.08],[.52,-.25],[.65,-.68],[.4,-1],[.65,-1.42],[.24,-1.72],[.18,-2.12]]);
 island([[-1.65,-1.6],[-1.85,-1.18],[-1.65,-.76],[-1.8,-.4],[-1.52,-.1],[-1.72,.32],[-1.43,.71],[-1.2,.68],[-1.08,.27],[-.96,-.08],[-1.08,-.45],[-.95,-.94],[-1.19,-1.42]]);
 const rim=new THREE.Mesh(new THREE.SphereGeometry(3.36,48,32),new THREE.MeshBasicMaterial({color:0x62bdff,transparent:true,opacity:.09,side:THREE.BackSide}));group.add(rim);
 const rng=seed=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 const random=rng(79312);
 function stars(count,radius,colors){const positions=[],rgb=[];for(let i=0;i<count;i++){const a=random()*Math.PI*2,r=Math.sqrt(random())*radius,z=(random()-.5)*radius*.3;positions.push(Math.cos(a)*r,Math.sin(a)*r,z);const c=new THREE.Color(colors[i%colors.length]);rgb.push(c.r,c.g,c.b);}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(rgb,3));return new THREE.Points(geometry,new THREE.PointsMaterial({size:.07,vertexColors:true,transparent:true,opacity:.9,depthWrite:false}));}
 const virgo=new THREE.Group();virgo.visible=false;parent.add(virgo);models.virgo=virgo;
 virgo.add(stars(1900,9,['#d8ecff','#fff4ce','#a0c2ff']));
 for(let c=0;c<18;c++){const x=(random()-.5)*15,y=(random()-.5)*10,z=(random()-.5)*3;const core=new THREE.Mesh(new THREE.SphereGeometry(.09+random()*.12,8,6),new THREE.MeshBasicMaterial({color:c%3===0?0xffe6b8:0xbfdfff}));core.position.set(x,y,z);virgo.add(core);for(let arm=0;arm<2;arm++){const vertices=[];for(let i=0;i<55;i++){const a=i*.19+arm*Math.PI,r=i*.019;vertices.push(x+Math.cos(a)*r,y+Math.sin(a)*r,z+(random()-.5)*.1);}const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({length:vertices.length/3},(_,i)=>new THREE.Vector3(vertices[i*3],vertices[i*3+1],vertices[i*3+2]))),new THREE.LineBasicMaterial({color:0xa8cfff,transparent:true,opacity:.42}));virgo.add(line);}}
 const laniakea=new THREE.Group();laniakea.visible=false;parent.add(laniakea);models.laniakea=laniakea;
 laniakea.add(stars(2100,12,['#d4e7ff','#fff0cc','#9ccfff']));
 const hub=new THREE.Vector3(-1.5,.4,0);
 for(let strand=0;strand<90;strand++){const angle=strand*2.39996,reach=5+random()*7,source=new THREE.Vector3(Math.cos(angle)*reach,Math.sin(angle)*reach*.78,(random()-.5)*5),control=new THREE.Vector3((source.x+hub.x)*.45+Math.sin(angle*2)*1.8,(source.y+hub.y)*.45+Math.cos(angle*3)*1.2,source.z*.4),curve=new THREE.QuadraticBezierCurve3(source,control,hub);const vertices=curve.getPoints(24);laniakea.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(vertices),new THREE.LineBasicMaterial({color:strand%4===0?0x86baff:0xe5bd70,transparent:true,opacity:.2+random()*.35})));for(let i=0;i<4;i++){const dot=new THREE.Mesh(new THREE.SphereGeometry(.025+random()*.035,6,4),new THREE.MeshBasicMaterial({color:0xffedc4}));dot.position.copy(curve.getPoint(random()));laniakea.add(dot);}}
 const attractor=new THREE.Mesh(new THREE.SphereGeometry(.65,18,12),new THREE.MeshBasicMaterial({color:0xffe6a2,transparent:true,opacity:.65}));attractor.position.copy(hub);laniakea.add(attractor);
 return models;
}
