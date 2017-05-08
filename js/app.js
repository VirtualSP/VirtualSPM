/*
 *   Virtual Speaker System for Chrome Android
 */						

var src, source, splitter, audio, fc,flen;
var xv, yv, zv, vol, rv, tv,tvv, cv, bv, cf,cn2 ,tfile,gl;
 vol = 0.4; ctlvol = 0.7; cv = 1.0; rv =-0.4; cf = 0;   //***
var obj= {};
var touchSX,touchSY, touchEX,touchEY, touchDX, touchDY, diffSX, diffEX, el,ctx;

var AudioContext = window.AudioContext || window.webkitAudioContext; 
var audioCtx = new AudioContext();

var gainL = audioCtx.createGain();
 var gainBL = audioCtx.createGain();
var gainR = audioCtx.createGain();
 var gainBR = audioCtx.createGain();
gainL.gain.value = vol; gainBL.gain.value = rv;
gainR.gain.value = vol; gainBR.gain.value = rv;

splitter = audioCtx.createChannelSplitter(2);

xv = 4; yv = 2; zv = -4; rv = 0.0; tv = 0; bv = 0; gl=0;

var pannerL = audioCtx.createPanner(); 
 pannerL.panningModel = 'HRTF';
 pannerL.distanceModel = 'linear';
 pannerL.refDistance = 1;
 pannerL.maxDistance = 1000;
 pannerL.rolloffFactor = 1;
 pannerL.coneInnerAngle = 360; //120;
 pannerL.coneOuterAngle = 360; // 180;
 pannerL.coneOuterGain = 0;
 pannerL.setOrientation(0,0,1);
var pannerBL = audioCtx.createPanner();
 pannerBL.panningModel = 'HRTF';
 pannerBL.distanceModel = 'inverse';
 pannerBL.refDistance = 1;
 pannerBL.maxDistance = 1000;
 pannerBL.rolloffFactor = 4;
 pannerBL.coneInnerAngle = 360;
 pannerBL.coneOuterAngle = 360;
 pannerBL.coneOuterGain = 0;
 pannerBL.setOrientation(0,0,1);
var pannerSL = pannerBL;               //***
var pannerUL = pannerBL; 
var delaySL = audioCtx.createDelay(); delaySL.delayTime.value=0.01;

var pannerR = audioCtx.createPanner();
 pannerR.panningModel = 'HRTF';
 pannerR.distanceModel = 'linear';
 pannerR.refDistance = 1;
 pannerR.maxDistance = 1000;
 pannerR.rolloffFactor = 1;
 pannerR.coneInnerAngle = 360; // 120;
 pannerR.coneOuterAngle = 360; // 180;
 pannerR.coneOuterGain = 0;
 pannerR.setOrientation(0,0,1); 

var pannerBR = audioCtx.createPanner(); 
 pannerBR.panningModel = 'HRTF'; 
 pannerBR.distanceModel = 'inverse';
 pannerBR.refDistance = 10;
 pannerBR.maxDistance = 1000;
 pannerBR.rolloffFactor = 4;
 pannerBR.coneInnerAngle = 360;
 pannerBR.coneOuterAngle = 360;
 pannerBR.coneOuterGain = 0;
 pannerBR.setOrientation(0,0,1);
var pannerSR = pannerBR;               //***
var pannerUR = pannerBR;
var delaySR = audioCtx.createDelay(); delaySR.delayTime.value=0.01;

var listener = audioCtx.listener; 

var bass   = audioCtx.createBiquadFilter();
 bass.type   = 'lowshelf';
 bass.frequency.value   =  100;
 bass.gain.value   =  0;
var treble   = audioCtx.createBiquadFilter();
 treble.type   = 'highshelf';
 treble.frequency.value   =  12000;
 treble.gain.value   =  20;

var camera, scene, renderer, canvas,ctx,geometry,material;	
var cube, plane, light0,Sphere0;	
	
var wX = 400;
var wY = 400;   
var meshL,meshR,cubeL, cubeR;


//window.onload = function() { 
function ini() {
  audio = new Audio(src); audio.controls = true; document.body.appendChild(audio); 
  source = audioCtx.createMediaElementSource(audio);
  //var x = document.createElement("INPUT"); x.setAttribute("type", "checkbox");

    //audio.autoplay = true;
  initgls(); //movsp();

  document.querySelector("#input").addEventListener("change",
        function () { handleFiles(); } );
  document.querySelector("#loop").addEventListener("click",
	function () { chkLoop(); } );

  document.querySelector("#numZ").addEventListener("change",
        function () { changeValueZ(document.querySelector("#numZ").value); });
  document.querySelector("#numY").addEventListener("change",
        function () { changeValueY(document.querySelector("#numY").value); });
  document.querySelector("#numX").addEventListener("change",
        function () { changeValueX(document.querySelector("#numX").value); });

  document.querySelector("#rSp").addEventListener("change",
        function () { changeVolRear(document.querySelector("#rSp").value); });
  document.querySelector("#bass").addEventListener("change",
        function () { changeBass(document.querySelector("#bass").value); });
  document.querySelector("#treble").addEventListener("change",
        function () { changeTreble(document.querySelector("#treble").value); });

}

var lp = false;
function chkLoop() {
 if ( document.getElementById('loop').innerHTML === "OFF" ) { 
        document.getElementById('loop').innerHTML = "ON"; lp = true; }
 else { document.getElementById('loop').innerHTML = "OFF"; lp = false; }
}

function initgls() {

renderer = new THREE.WebGLRenderer({ canvas: tCanvas , alpha: true }); //******
renderer.setSize (wX,wY);    
renderer.setClearColor(0x444477, 0.2); //*****
         
camera = new THREE.PerspectiveCamera (90, 1, 1, 1000);  
camera.position.x=0; camera.position.y=5; camera.position.z=5;   
camera.lookAt( {x:0, y:4.2, z:0 } ); 
      
scene = new THREE.Scene(); scene.add(camera);  //scene.background = new THREE.Color( 0xff0000 );
    
var geometry_sph = new THREE.SphereGeometry (0.7, 36, 36);         
var material0 = new THREE.MeshLambertMaterial( { color: 0x0088cc } );    
Sphere0 = new THREE.Mesh (geometry_sph, material0);     
Sphere0.position.x= 0; Sphere0.position.y= 0; Sphere0.position.z= 0; Sphere0.castShadow = true;     
scene.add( Sphere0 );

var geometry_cube = new THREE.CubeGeometry (2, 3, 1.5);
     //var ambient = new THREE.AmbientLight(0x333333); scene.add(ambient);
        
     var br = new THREE.MeshLambertMaterial({color: 0x886600});
     var gr = new THREE.MeshLambertMaterial({color: 0x333333});
     var materials = [ br, br, br, br, gr, br ];
   
        var material_cube = new THREE.MeshFaceMaterial(materials);
         cubeL = new THREE.Mesh (geometry_cube, material_cube);
         cubeL.position.setX(-xv); cubeL.position.setY(yv); cubeL.position.setZ(zv); 
		cubeL.rotation.order = "ZYX";          
         cubeL.castShadow = true; 
	scene.add( cubeL ); 
         cubeR = new THREE.Mesh (geometry_cube, material_cube);
         cubeR.position.setX(xv); cubeR.position.setY(yv); cubeR.position.setZ(zv);
		cubeR.rotation.order = "ZYX";          
         cubeR.castShadow = true; 
        scene.add( cubeR ); 
         
  light0 = new THREE.SpotLight( 0xffffff );      
  light0.position.x=100; light0.position.y=100; light0.position.z=100;    
  light0.shadow.mapSize.width = 2048; light0.shadow.mapSize.height = 2048;
  scene.add( light0 );
 
    var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 1, 1),
        new THREE.MeshLambertMaterial({
            color: 0xdddddd, transparent: true, opacity: 0.7
        })
    );
    plane.position.y = 0;
    plane.rotation.x = -Math.PI / 2;
    scene.add( plane );

    light0.castShadow = true;
    plane.receiveShadow = true;
    renderer.shadowMap.enabled = true;
   renderer.render( scene, camera ); 
    document.getElementById("fn").innerHTML= "Swipe(xy)/Pinch(z) : Speaker coordinates";

  //audio = new Audio(src); audio.controls = true; document.body.appendChild(audio); 
    audio.autoplay = true; //audio.volume = 0.5;
 // setPos(xv,yv,zv); 
 gl=gl+1;

 el = document.getElementById("tCanvas");
 ctx = el.getContext("experimental-webgl");
 //ctx = renderer;
 ctx.canvas.addEventListener("touchstart", handleStart, false);
 ctx.canvas.addEventListener("touchmove", handleMove, false);
 ctx.canvas.addEventListener("touchend", handleEnd, false);

} // -- end of initgl --


function movsp() { 
  cubeL.position.setX(-xv); cubeL.position.setY(yv); cubeL.position.setZ(zv);
  cubeR.position.setX(xv);  cubeR.position.setY(yv); cubeR.position.setZ(zv); 
    cubeL.rotation.x=Math.atan(-yv/zv); cubeR.rotation.x=Math.atan(-yv/zv);
    cubeL.rotation.y=Math.atan(-xv/zv); cubeR.rotation.y=Math.atan(xv/zv); 
 renderer.render( scene, camera ); 
}

function startPlay() {  			
	//source = audioCtx.createMediaElementSource(audio); 
        playGain(); setPos( xv, yv, zv ); 
} 
   
function handleFiles() {
fc = 0; movsp();
//audio = new Audio(src);
var fileInput = document.getElementById("input");
flen = fileInput.files.length;
  if (flen>0) {loadsrc(flen);}
}

function loadnext() {
 fc = fc + 1; 
   if (fc<flen) {loadsrc();}  
   else { fc = 0; 
	if (lp === true) {loadsrc(flen);}
       //  loadsrc();	if (document.getElementById("roop").checked) {loadsrc();}
   } 
}

function loadsrc() {
 var fname;
    src = URL.createObjectURL(document.getElementsByTagName('input')[6].files[fc]); 
    fname = document.getElementsByTagName('input')[6].files[fc].name; 
    showMetaData(document.getElementsByTagName('input')[6].files[fc]);  // ****************************
	//tfile=fname;
						
    audio.src=src;	audio.autoplay = true;
  
    audio.addEventListener('loadeddata', function() {
      document.getElementById("fn").innerHTML= (fc+1) +" of "+flen+" : "+fname;
      if ( fc  < flen ) { 
       audio.onended = function() { loadnext(); }
        //audio.addEventListener('ended', function() { 
        //  fc = fc + 1; loadsrc();                                 
        //},false);
      //startPlay();
      }
    startPlay();
   }, false);

}


function playGain() {
  source.connect(splitter); 
  //splitter.connect(gainL, 0).connect(pannerL).connect(bass).connect(treble).connect(audioCtx.destination);
  splitter.connect(pannerL, 0).connect(bass).connect(treble).connect(audioCtx.destination);
    splitter.connect(gainBL, 0).connect(pannerBL).connect(delaySL).connect(audioCtx.destination);
    splitter.connect(gainBL, 0).connect(pannerSL).connect(delaySL).connect(audioCtx.destination); 
    splitter.connect(gainBL, 0).connect(pannerUL).connect(delaySL).connect(audioCtx.destination);
	//var pannerUR = pannerBR;    
  
  //splitter.connect(gainR, 1).connect(pannerR).connect(bass).connect(treble).connect(audioCtx.destination); 
  splitter.connect(pannerR, 1).connect(bass).connect(treble).connect(audioCtx.destination);
    splitter.connect(gainBR, 1).connect(pannerBR).connect(delaySR).connect(audioCtx.destination);
    splitter.connect(gainBR, 1).connect(pannerSR).connect(delaySR).connect(audioCtx.destination);  
    splitter.connect(gainBR, 1).connect(pannerUR).connect(delaySR).connect(audioCtx.destination);
  //source.start(0);
 audio.play();
}

function setPos(x,y,z) { 
 pannerL.setPosition( -x, y*4, z*3); //pannerL.setOrientation(x,-y*2,-z*3);  
  pannerBL.setPosition(-x,y*2, -z*3); pannerSL.setPosition(-x*4,y*2, 3*z/2); pannerUL.setPosition(-x/2,y*4, 3*z/2);
 pannerR.setPosition( x,y*4, z*3); //pannerR.setOrientation(-x,-y*2,-z*3); 
  pannerBR.setPosition( x,y*2, -z*3); pannerSR.setPosition( x*4,y*2, 3*z/2); pannerUR.setPosition( x/2,y*4, 3*z/2);
 listener.setPosition( 0, -y, -z );
 movsp();    
//audio.currentTime=audio.currentTime-0.1; 
}

function changeValueZ(zvalue) {
 zv = zvalue; //document.getElementById("panValueZ").innerHTML="pos_Z = "+zv;
 //document.querySelector("#numZ").value = zv;
 //localStorage.setItem('numZ', document.getElementById('#numZ').value);
 setPos( xv, yv, zv );  
}

function changeValueY(yvalue) {  
 yv = yvalue; //document.getElementById("panValueY").innerHTML="pos_Y = "+yv; 
 //document.querySelector("#numY").value = yv;
 setPos( xv, yv, zv );  
}

function changeValueX(xvalue) {  
 xv = xvalue; //document.getElementById("panValueX").innerHTML="dist_X = "+xv; 
 //document.querySelector("#numX").value = xv;
 setPos( xv, yv, zv ); 
}

function changeVolRear(rSpVol) {  
 rv = rSpVol; document.getElementById("rspVol").innerHTML="surround = " + rv; 
 document.querySelector("#rSp").value = rv; 
 gainBL.gain.value = -rv; gainBR.gain.value = -rv;
}

function changeBass(bvalue) {
  bass.gain.value = bvalue;  
  bv = bvalue;  //bv = bvalue*3 + 45;
  //bass.frequency.value   =  bv;
    document.getElementById("bassValue").innerHTML="bass = "+ bv;
    document.querySelector("#bass").value = bvalue;
}
function changeTreble(tvalue) {
  treble.gain.value = tvalue ;  
  tv = tvalue; tvv = -tvalue*500 + 12000;
  //treble.frequency.value   = tvv;
    document.getElementById("trebleValue").innerHTML="treble = "+ tv;
    document.querySelector("#treble").value = tvalue;
}

function handleStart(evt) {
  evt.preventDefault();
 switch ( evt.touches.length ) {
  case 1:
   touchDX = 0; touchDY = 0;
   touchSX = evt.touches[0].pageX-200; touchSY = evt.touches[0].pageY-200; break;
  case 2:
   diffSX = Math.abs( evt.touches[0].pageX - evt.touches[1].pageX ); break
 }
}
function handleMove(evt) {
  evt.preventDefault();
 switch ( evt.touches.length ) {
  case 1:
   touchEX = evt.touches[0].pageX-200; touchEY = evt.touches[0].pageY-200;
   if ( touchSX > 0) {
	touchDX = (touchSX - touchEX)/300;
   } else {
	touchDX = -(touchSX - touchEX)/300;
   } 
   touchDY = (touchSY - touchEY)/300;
   xv = xv - touchDX; 
	document.querySelector("#numX").value = xv;
	//document.getElementById("panValueX").innerHTML="dist_X = "+xv;
   yv = yv + touchDY;
	document.querySelector("#numY").value = yv;
	 //document.getElementById("panValueY").innerHTML="pos_Y = "+yv;
   break;
  case 2:
   diffEX = Math.abs( evt.touches[0].pageX - evt.touches[1].pageX );
   if ( diffSX > diffEX ) { 
    zv = zv - 0.1;
   } else {
    zv = zv + 0.1;
   } 
    document.querySelector("#numZ").value = zv;  
   break;
 }
  //setPos( xv, yv, zv );
}
function handleEnd(evt) {
  evt.preventDefault(); setPos( xv, yv, zv );
}

//------------ metedata --------------------------
var material,picture,texture,planea,image,img,picdata;

function showMetaData(data) {
      musicmetadata(data, function (err, result) {
       
	image = document.getElementById('myimg');

         // if (err) {console.log(result);image.src = '';} 
		//initgls(); //xv=xv+1; movsp(); //renderer.render( scene, camera );

        if (result.picture.length > 0) { //picdata=result.picture;
          picture = result.picture[0]; //alert(picture.width);
          var url = URL.createObjectURL(new Blob([picture.data], {'type': 'image/' + picture.format}));
	  //var im=new Image(); im.src=url.src;
          image.src = url; image.width=128; image.height=128;

	//var c = document.getElementById('canvas'); 
        //var ctx = c.getContext('2d');  
	//img = document.getElementById('myimg'); //alert(img.width);
	//ctx.drawImage(im,0,0);ctx.fillRect(0, 0, 4, 4);

	
	//var loader = new THREE.TextureLoader(); loader.crossOrigin = '*'; loader.setCrossOrigin("anonymous");
	 //var texture = loader.load('vsp.png'); 

	//var loader = new THREE.TextureLoader(); loader.setCrossOrigin('Anonymous'); 
	// texture = loader.load(url);

	//texture = new THREE.DataTexture( picture.data, 16, 16, THREE.RGBAFormat );texture.needsUpdate = true;

	//material = new THREE.MeshLambertMaterial({ map: texture });

	//material = new THREE.MeshLambertMaterial({map:texture});

	//var planea = new THREE.Mesh(new THREE.PlaneGeometry(16, 16, 1, 1), 
	//	new THREE.MeshLambertMaterial({color: 0xfd3d3d}));

	//loader.load(url, function(texture){
    //var material = new THREE.MeshLambertMaterial({map: texture});
    //mesh = new THREE.Mesh(geometry, material);
    //scene.add(mesh);});

	//planea = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), material);
	//planea.castShadow = true; planea.recieveShadow = true;
    //planea.position.y = 4; planea.position.z = -24;
    //planea.rotation.y = Math.PI/8;
    //scene.add( planea );

	//renderer.render( scene, camera );	

        }
        else {image.style.visibility = 'hidden';} //var div = document.getElementById('info');
        //div.innerText = JSON.stringify(result, undefined, 2);
      });
    }
