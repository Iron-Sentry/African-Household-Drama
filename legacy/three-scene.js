/*
 * Three.js-driven 3D miniature rooms behind 2D SVG character cutouts and
 * accessible HTML story controls. Browser loads Three.js from jsDelivr.
 * Offline/no WebGL: lovingly illustrated SVG stage remains fully playable.
 */
const stage = document.getElementById('room-window');
const canvas = document.getElementById('three-canvas');

async function launchThree() {
  let THREE;
  try {
    THREE = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
  } catch (error) {
    console.info('Three.js unavailable; continuing with illustrated fallback scene.', error?.message);
    return;
  }
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference:'low-power' });
  } catch (error) {
    console.info('WebGL unavailable; continuing with illustrated fallback scene.');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.55;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(39, 1, .1, 90);
  camera.position.set(7, 5, 9.4);
  camera.lookAt(.0,1.75,0);

  const ambient = new THREE.HemisphereLight('#ffdcbb','#715568',2.4);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight('#ffe3bf',3.0);
  sun.position.set(-3,9,5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024,1024);
  sun.shadow.camera.left = -12;sun.shadow.camera.right = 12;
  sun.shadow.camera.top = 12;sun.shadow.camera.bottom = -12;
  sun.shadow.bias = -.001;
  scene.add(sun);
  const lamp = new THREE.PointLight('#ffae72',25,13,2);
  lamp.position.set(-2.9,2.9,-2.9);
  scene.add(lamp);

  const matte=(c,roughness=1,extra={})=>new THREE.MeshStandardMaterial({color:c,roughness,...extra});
  const mats={wood:matte('#654131'),woodHi:matte('#966747'),metal:matte('#353440',.58),cream:matte('#f1cf9e'),gold:matte('#c88d56'),skin:matte('#b88b73')};
  function box(parent,w,h,d,x,y,z,material,r=0){
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof material==='string'?matte(material):material);
    mesh.position.set(x,y,z);mesh.rotation.y=r;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  function sphere(parent,rad,x,y,z,material){
    const mesh=new THREE.Mesh(new THREE.SphereGeometry(rad,18,12),typeof material==='string'?matte(material):material);
    mesh.position.set(x,y,z);mesh.castShadow=true;parent.add(mesh);return mesh;
  }
  function cylinder(parent,rt,rb,height,x,y,z,mat,segments=20){
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,height,segments),typeof mat==='string'?matte(mat):mat);
    mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  function posterTexture(text,bg,ink){
    const c=document.createElement('canvas');c.width=512;c.height=360;
    const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);
    ctx.strokeStyle=ink;ctx.globalAlpha=.23;ctx.lineWidth=18;
    for(let i=-120;i<620;i+=42){ctx.beginPath();ctx.moveTo(i,-30);ctx.lineTo(i+200,420);ctx.stroke();}
    ctx.globalAlpha=1;ctx.textAlign='center';ctx.fillStyle=ink;
    ctx.font='bold 63px Georgia';ctx.fillText(text,256,205);
    ctx.font='bold 24px Arial';ctx.fillText('HOME IS A WHOLE MOVIE',256,259);
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
  }
  function plane(parent,w,h,x,y,z,material){
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;
  }
  const tvCanvas=document.createElement('canvas');tvCanvas.width=400;tvCanvas.height=240;
  const tctx=tvCanvas.getContext('2d');
  const tvTexture=new THREE.CanvasTexture(tvCanvas);tvTexture.colorSpace=THREE.SRGBColorSpace;
  function paintTv(time){
    const ctx=tctx,w=tvCanvas.width,h=tvCanvas.height;
    const grad=ctx.createLinearGradient(0,0,0,h);grad.addColorStop(0,'#719eaa');grad.addColorStop(.53,'#426b87');grad.addColorStop(1,'#20334c');
    ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#ceb7ad';ctx.beginPath();ctx.arc(117,90,35,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#5b415a';ctx.beginPath();ctx.ellipse(115,194,76,93,0,Math.PI,Math.PI*2);ctx.fill();
    ctx.fillStyle='#d09e88';ctx.beginPath();ctx.arc(269,90,36,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#3d4859';ctx.beginPath();ctx.ellipse(284,194,78,100,0,Math.PI,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#cf9996';ctx.lineWidth=13;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(143,109);ctx.lineTo(206,118);ctx.lineTo(244,108);ctx.stroke();
    ctx.fillStyle='#edb3a9';ctx.font='31px Georgia';ctx.fillText('♥',185,52+Math.sin(time*.003)*3);
    ctx.fillStyle='#1a283650';for(let y=0;y<h;y+=5)ctx.fillRect(0,y,w,1.6);
    for(let i=0;i<70;i++){const px=(i*157+Math.floor(time*.05)*31)%400,py=(i*91+Math.floor(time*.06)*13)%240;ctx.fillStyle=i%2?'#ffffff13':'#07152730';ctx.fillRect(px,py,2,2);}
    tvTexture.needsUpdate=true;
  }
  function createRoom(mode){
    const neighbor=mode==='neigh';
    const room=new THREE.Group();scene.add(room);
    const wall=neighbor?'#a0aa91':'#b98888';
    box(room,10,.23,8,0,-.13,0,neighbor?'#af9472':'#b08168');
    box(room,10,4.85,.18,0,2.3,-4,wall);
    box(room,.18,4.85,8,-5,2.3,0,neighbor?'#879885':'#8f7480');
    // Warm wall baseboard and floor tile seams
    box(room,10,.21,.23,0,.16,-3.83,'#e8be91');
    box(room,.21,.21,8,-4.82,.16,0,'#e8be91');
    for(let i=-4;i<=4;i++)box(room,.016,.006,8,i,0,0,'#8d655d');
    for(let j=-3;j<=3;j++)box(room,10,.006,.017,0,0,j,'#87655a');
    // Woven rug
    box(room,5.4,.038,3.05,1.25,.036,.9,neighbor?'#577f6f':'#a55f61');
    box(room,5.0,.044,2.65,1.25,.065,.9,neighbor?'#9ab092':'#d59a76');
    box(room,4.6,.05,2.25,1.25,.081,.9,neighbor?'#6c9382':'#ab6b69');
    // Rounded visual geometry is slightly low-poly, deliberately toy-like.
    const sofa=neighbor?'#638e7a':'#7a5d77';
    const cushions=neighbor?'#87a990':'#b27e84';
    box(room,3.85,.85,1.32,1.2,.78,.9,sofa);
    box(room,3.85,.96,.41,1.2,1.27,1.65,sofa);
    box(room,3.55,.3,1.12,1.2,1.10,.9,cushions);
    box(room,.42,1.04,1.44,-.82,.96,.92,sofa);
    box(room,.42,1.04,1.44,3.21,.96,.92,sofa);
    box(room,.1,.58,.26,-.30,.37,1.5,mats.wood);
    box(room,.1,.58,.26,2.7,.37,1.5,mats.wood);
    // Pillows
    const pill=box(room,.8,.55,.2,.1,1.57,1.4,neighbor?'#c78e68':'#d6a575');pill.rotation.z=.14;
    const pill2=box(room,.7,.5,.22,2.2,1.6,1.42,neighbor?'#e3c48d':'#d4a8a3');pill2.rotation.z=-.13;
    // Coffee table and objects
    cylinder(room,1.13,1.21,.13,1.24,.73,-1.24,mats.woodHi,28);
    cylinder(room,.12,.14,.54,.65,.43,-1.40,mats.wood,10);
    cylinder(room,.12,.14,.54,1.83,.43,-1.40,mats.wood,10);
    cylinder(room,.12,.14,.54,.95,.43,-.79,mats.wood,10);
    cylinder(room,.39,.34,.05,1.18,.83,-1.16,'#eddbc0',24);
    if(neighbor){
      for(let i=0;i<5;i++){
        const o=sphere(room,.105,.93+i*.115,.91,-1.16+Math.sin(i)*.1,'#c99554');o.scale.y=.35;
      }
      cylinder(room,.09,.11,.36,1.86,.95,-1.22,'#93583f');
      cylinder(room,.1,.09,.08,1.86,1.17,-1.22,'#ddb974');
    }else{
      box(room,.58,.035,.36,1.1,.86,-1.2,'#673f42');
      sphere(room,.083,1.45,.96,-1.17,'#bd8564');
    }
    // Hanging print above sofa
    const pmat=new THREE.MeshBasicMaterial({map:posterTexture(neighbor?'AKWABA':'FAMILY','#dbbd91',neighbor?'#497763':'#a24f5d')});
    box(room,2.03,1.35,.09,1.45,3.17,-3.76,'#5a3d3d');
    plane(room,1.85,1.18,1.45,3.17,-3.695,pmat);
    // Window and curtains
    box(room,2.15,1.97,.12,-2.95,3.1,-3.80,'#eacb9e');
    box(room,1.86,1.72,.13,-2.95,3.1,-3.72,neighbor?'#96adb0':'#658d9d');
    box(room,.085,1.73,.16,-2.95,3.1,-3.63,'#f8dfb7');
    box(room,1.86,.085,.16,-2.95,3.1,-3.63,'#f8dfb7');
    const curtain=neighbor?'#caa477':'#a45e6d';
    box(room,.44,2.13,.24,-4.04,3.0,-3.56,curtain);
    box(room,.44,2.13,.24,-1.92,3.0,-3.56,curtain);
    // Side table / radio or TV
    if(!neighbor){
      box(room,2.2,.7,.93,-2.25,.73,-2.25,mats.wood);
      box(room,2.3,.12,1.15,-2.25,1.15,-2.25,mats.woodHi);
      box(room,2.08,1.59,.74,-2.22,1.99,-2.24,'#4b3740');
      box(room,1.73,1.26,.05,-2.35,2.02,-1.836,'#181f29');
      const screen=plane(room,1.65,1.13,-2.35,2.02,-1.802,new THREE.MeshBasicMaterial({map:tvTexture}));
      screen.material.toneMapped=false;
      cylinder(room,.06,.06,.05,-1.23,2.36,-1.76,'#e4b77d');
      cylinder(room,.06,.06,.05,-1.23,2.11,-1.76,'#e4b77d');
      // rabbit ear TV antenna
      const a=box(room,.025,.54,.025,-2.5,3.06,-2.17,'#86817d');a.rotation.z=.4;
      const b=box(room,.025,.54,.025,-2.1,3.06,-2.17,'#86817d');b.rotation.z=-.4;
    } else {
      box(room,1.58,1.6,.55,-2.3,.83,-2.55,mats.wood);
      box(room,1.75,.13,.71,-2.3,1.66,-2.55,mats.woodHi);
      cylinder(room,.24,.19,.45,-2.3,1.95,-2.52,'#ac8465');
      for(let k=0;k<4;k++){let leaf=sphere(room,.25,-2.45+(k%2)*.25,2.15+k*.15,-2.52,'#55785b');leaf.scale.set(1,.27,.5);}
      cylinder(room,.16,.17,.53,-3.4,1.91,-2.72,'#c5a46f');
      cylinder(room,.37,.15,.15,-3.4,2.18,-2.72,'#ead4a7');
    }
    // Fan, plant, and lamp
    cylinder(room,.44,.55,.09,4.26,.10,2.43,'#49454b');
    cylinder(room,.07,.07,2.56,4.26,1.37,2.43,'#65646c');
    sphere(room,.31,4.26,2.78,2.43,'#6b6972');
    const blades=new THREE.Group();blades.position.set(4.26,2.78,2.72);
    for(let i=0;i<3;i++){let blade=box(blades,.24,.84,.045,0,.35,0,'#ded1c0');blade.rotation.z=i*Math.PI*2/3;blade.position.set(-Math.sin(blade.rotation.z)*.38,Math.cos(blade.rotation.z)*.38,0);}room.add(blades);
    const plantPot=cylinder(room,.33,.27,.48,-4.12,.38,2.33,'#ad714f');
    for(let i=0;i<6;i++){const leaf=sphere(room,.31,-4.12+Math.cos(i*1.1)*.24,.77+(i%2)*.24,2.33+Math.sin(i*1.1)*.24,'#537a59');leaf.scale.set(.66,1.45,.6);}
    room.userData.blades=blades;
    return room;
  }
  const rooms={tv:createRoom('tv'),neigh:createRoom('neigh')};
  let current='tv';rooms.neigh.visible=false;
  const setRoom=(next)=>{
    current=next==='neigh'?'neigh':'tv';
    rooms.tv.visible=current==='tv';rooms.neigh.visible=current==='neigh';
    lamp.color.set(current==='tv'?'#ffae72':'#ffe0a1');
  };
  window.AHD3D={setRoom};
  if (document.getElementById('world-panel')?.classList.contains('neighbour')) setRoom('neigh');
  let mouseX=0,mouseY=0;
  stage.addEventListener('pointermove',e=>{
    const r=stage.getBoundingClientRect();
    mouseX=((e.clientX-r.left)/r.width-.5)*2;
    mouseY=((e.clientY-r.top)/r.height-.5)*2;
  });
  stage.addEventListener('pointerleave',()=>{mouseX=mouseY=0;});
  function resize(){
    const {width,height}=stage.getBoundingClientRect();
    if(width<1||height<1)return;
    renderer.setSize(width,height,false);
    camera.aspect=width/height;
    camera.fov=width<490?52:width<770?46:39;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);
  resize();
  stage.classList.add('three-ready');
  const clock=new THREE.Clock();let frames=0;
  function animate(){
    requestAnimationFrame(animate);
    const t=clock.getElapsedTime();
    camera.position.x+=(7+mouseX*.45-camera.position.x)*.024;
    camera.position.y+=(5-mouseY*.24-camera.position.y)*.024;
    camera.lookAt(0,1.65,0);
    rooms.tv.userData.blades.rotation.z=t*.7;
    rooms.neigh.userData.blades.rotation.z=t*.7;
    if((frames++%4)===0&&current==='tv')paintTv(performance.now());
    renderer.render(scene,camera);
  }
  paintTv(0);animate();
}
launchThree();
