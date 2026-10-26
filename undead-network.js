/* Direct browser co-op. The host owns enemies, damage, waves and session state. */
const UndeadCoop=(()=>{
 const peers=new Map(),roster=new Map();
 let role='solo',localId='host',onEvent=()=>{},character=0,ready=false,room='',running=false;
 const iceServers=[{urls:'stun:stun.cloudflare.com:3478'},{urls:'stun:stun.l.google.com:19302'}];
 const emit=(type,data)=>onEvent(type,data);
 const pack=data=>btoa(unescape(encodeURIComponent(JSON.stringify(data))));
 function unpack(code,kind){
  if(typeof code!=='string'||code.trim().length>100000)throw Error('Invalid connection code.');
  let data;try{data=JSON.parse(decodeURIComponent(escape(atob(code.trim()))));}catch(e){throw Error('That connection code could not be read.');}
  if(data.version!==1||data.kind!==kind||typeof data.sdp!=='string'||data.sdp.length>70000||!/^[a-z0-9-]{1,60}$/.test(data.id)||!/^[a-z0-9-]{1,60}$/.test(data.room))throw Error('This code is not a Survive the Undead '+kind+' code.');
  return data;
 }
 function send(peer,data){if(peer.channel?.readyState==='open'&&peer.channel.bufferedAmount<300000)peer.channel.send(JSON.stringify(data));}
 function broadcast(data){if(data.type==='end')running=false;for(const p of peers.values())send(p,data);}
 function publishRoster(){const list=[...roster.values()];broadcast({type:'roster',players:list});emit('roster',list);}
 function close(){
  for(const p of peers.values()){p.pc.onconnectionstatechange=null;if(p.channel)p.channel.onclose=null;p.pc.close();}
  peers.clear();roster.clear();role='solo';localId='host';room='';ready=false;running=false;emit('roster',[]);
 }
 function host(id){close();character=id;role='host';ready=true;room='bc-'+Math.random().toString(36).slice(2,12);roster.set('host',{id:'host',character,ready:true});publishRoster();}
 function receive(peer,event){
  if(typeof event.data!=='string'||event.data.length>300000)return;
  let m;try{m=JSON.parse(event.data);}catch(e){return;}if(!m||typeof m!=='object')return;
  if(role==='host'){
   if(!running&&m.type==='select'&&Number.isInteger(m.character)&&m.character>=0&&m.character<13){roster.set(peer.id,{id:peer.id,character:m.character,ready:m.ready===true});publishRoster();}
   else if(m.type==='input'&&roster.has(peer.id))emit('input',{id:peer.id,input:m.input});
  }else if(role==='client'){
   if(m.type==='roster'&&Array.isArray(m.players)&&m.players.length<=4&&m.players.every(p=>typeof p.id==='string'&&p.id.length<60&&Number.isInteger(p.character)&&p.character>=0&&p.character<13)){
    roster.clear();for(const p of m.players)roster.set(p.id,{id:p.id,character:p.character,ready:p.ready===true});emit('roster',[...roster.values()]);
   }else if(m.type==='start')emit('start',m);
   else if(m.type==='snapshot')emit('snapshot',m);
   else if(m.type==='end')emit('end',m);
  }
 }
 function attach(peer,channel){
  peer.channel=channel;
  channel.onopen=()=>{
   if(role==='host'&&running){channel.close();peer.pc.close();return;}
   if(role==='host'){roster.set(peer.id,{id:peer.id,character:0,ready:false});publishRoster();}
   else send(peer,{type:'select',character,ready});
   emit('connection',{connected:true,id:peer.id});
  };
  channel.onmessage=event=>receive(peer,event);
  channel.onclose=()=>{
   peers.delete(peer.id);if(role==='host'){roster.delete(peer.id);publishRoster();emit('departure',peer.id);}else emit('disconnect');
  };
 }
 function makePeer(id){
  if(typeof RTCPeerConnection==='undefined')throw Error('This browser does not support direct co-op.');
  const pc=new RTCPeerConnection({iceServers}),peer={id,pc};peers.set(id,peer);
  pc.onconnectionstatechange=()=>{if(pc.connectionState==='failed')emit('connection',{connected:false,id,message:'Connection failed. Create a fresh invitation, or try another network.'});};
  return peer;
 }
 function gathered(pc){return new Promise(resolve=>{
  if(pc.iceGatheringState==='complete'){resolve();return;}
  const timer=setTimeout(done,8000);function done(){clearTimeout(timer);pc.removeEventListener('icegatheringstatechange',check);resolve();}
  function check(){if(pc.iceGatheringState==='complete')done();}pc.addEventListener('icegatheringstatechange',check);
 });}
 async function invite(){
  if(role!=='host')throw Error('Host a squad first.');if(running)throw Error('Return to the lobby before inviting another player.');if(peers.size>=3)throw Error('This squad already has three guest invitations.');
  const id='guest-'+Math.random().toString(36).slice(2,11),peer=makePeer(id);attach(peer,peer.pc.createDataChannel('project-bc-undead'));
  try{await peer.pc.setLocalDescription(await peer.pc.createOffer());await gathered(peer.pc);if(peers.get(id)!==peer)throw Error('The squad was closed.');return pack({version:1,kind:'invite',room,id,sdp:peer.pc.localDescription.sdp});}
  catch(e){peer.pc.close();peers.delete(id);throw e;}
 }
 async function join(code,id){
  const offer=unpack(code,'invite');close();role='client';character=id;localId=offer.id;room=offer.room;
  const peer=makePeer('host');peer.pc.ondatachannel=e=>attach(peer,e.channel);
  try{await peer.pc.setRemoteDescription({type:'offer',sdp:offer.sdp});await peer.pc.setLocalDescription(await peer.pc.createAnswer());await gathered(peer.pc);if(peers.get('host')!==peer)throw Error('The squad was closed.');return pack({version:1,kind:'reply',room,id:localId,sdp:peer.pc.localDescription.sdp});}
  catch(e){close();throw e;}
 }
 async function accept(code){const answer=unpack(code,'reply'),peer=peers.get(answer.id);if(role!=='host'||answer.room!==room||!peer)throw Error('This reply does not belong to your squad.');await peer.pc.setRemoteDescription({type:'answer',sdp:answer.sdp});}
 function select(id,isReady=ready){character=id;ready=isReady;if(role==='host'){roster.set('host',{id:'host',character,ready:true});publishRoster();}else if(role==='client')send(peers.get('host')||{},{type:'select',character,ready});}
 function input(data){if(role==='client')send(peers.get('host')||{},{type:'input',input:data});}
 function start(){if(role!=='host'||![...roster.values()].every(p=>p.ready))throw Error('Every connected player must be ready.');running=true;broadcast({type:'start',map:'bc-complex',players:[...roster.values()]});}
 return{get role(){return role;},get localId(){return localId;},get players(){return [...roster.values()];},get connected(){return [...peers.values()].some(p=>p.channel?.readyState==='open');},get peerCount(){return peers.size;},get connectionStates(){return [...peers.values()].map(p=>({id:p.id,state:p.pc.connectionState,ice:p.pc.iceConnectionState,channel:p.channel?.readyState}));},set onEvent(fn){onEvent=fn;},host,invite,join,accept,select,input,start,broadcast,close,encode:pack};
})();
