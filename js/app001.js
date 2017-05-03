/*
 *   Virtual Speaker System for Chrome Android
 */						

var src, source, splitter, audio;
var xv, yv, zv, vol, rv, tv,tvv, cv, bv, cf,cn2 ,tfile,gl;
 vol = 0.4; ctlvol = 0.7; cv = 1.0; rv =-0.4; cf = 0;   //***
var obj= {};

var AudioContext = window.AudioContext || window.webkitAudioContext; 
var audioCtx = new AudioContext();

var gainL = audioCtx.createGain();
 var gainBL = audioCtx.createGain();
var gainR = audioCtx.createGain();
 var gainBR = audioCtx.createGain();
gainL.gain.value = vol; gainBL.gain.value = rv;
gainR.gain.value = vol; gainBR.gain.value = rv;

splitter = audioCtx.createChannelSplitter(2);
//var merger = audioCtx.createChannelMerger(2);

xv = 4; yv = 2; zv = -4; rv = 0.2; tv = 0; bv = 0; gl=0;

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

var listener = audioCtx.Spationallistener; 

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

//document.addEventListener("DOMContentLoaded", function(event) { //alert("gg");
//    initgls();
//  });

function onDocumentTouchStart( event ) {
            event.preventDefault();
		//movsp();
	document.removeEventListener('touchstart', onDocumentTouchStart, false);
        }   

window.onload = function() { //alert("g");
  initgls(); 
  //readinis();
  //document.location.reload(true);

  document.querySelector("#input").addEventListener("change",
        function () { handleFiles(); } );

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
  //initgls();
document.addEventListener('touchstart', onDocumentTouchStart, false);
//changeValueX(document.querySelector("#numX").value);
}

window.addEventListener('beforeunload', function(e) {
 var confirmationMessage = "\o/";
  e.returnValue = confirmationMessage; 
  audio.currentTime=0; audio.src=""; document.getElementById("input").value="";
  document.location.reload(true);
}, false);


//window.onbeforeunload = function(e){ document.getElementById("input").value=""; };


window.addEventListener('pageshow', function(e) { 
 document.getElementById("fn").innerHTML=gl;
 //initgls();
 var confirmationMessage = "\o/";
  e.returnValue = confirmationMessage; 
  //audio.currentTime=0; audio.src=""; 
}, false);

function mypageshowcode() { console.log("page");
 //audio.currentTime=0; audio.src="";
}
function endSession() { console.log("end"); alert("end");
 //audio.currentTime=0; audio.src="";
}

function initgls() {

renderer = new THREE.WebGLRenderer({ canvas: tCanvas });
renderer.setSize (wX,wY);    
renderer.setClearColor(0x444477, 1);
         
camera = new THREE.PerspectiveCamera (90, 1, 1, 1000);  
camera.position.x=0; camera.position.y=5; camera.position.z=5;   
camera.lookAt( {x:0, y:4.2, z:0 } ); 
      
scene = new THREE.Scene(); scene.add(camera);  
    
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
  scene.add( light0 );
 
    var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 10, 10),
        new THREE.MeshLambertMaterial({
            color: 0xdddddd, transparent: true, opacity: 0.7
        })
    );
    plane.position.y = 0;
    plane.rotation.x = -Math.PI / 2;
    scene.add( plane );

    light0.castShadow = true;
    plane.receiveShadow = true;
    renderer.shadowMapEnabled = true;
   renderer.render( scene, camera );

  audio = new Audio(src); audio.controls = true; document.body.appendChild(audio); 
    audio.autoplay = true; //audio.volume = 0.5;
 // setPos(xv,yv,zv); gl=gl+1;
} // -- end of initgl --


function movsp() { 
  cubeL.position.setX(-xv); cubeL.position.setY(yv); cubeL.position.setZ(zv);
  cubeR.position.setX(xv);  cubeR.position.setY(yv); cubeR.position.setZ(zv); 
    cubeL.rotation.x=Math.atan(-yv/zv); cubeR.rotation.x=Math.atan(-yv/zv);
    cubeL.rotation.y=Math.atan(-xv/zv); cubeR.rotation.y=Math.atan(xv/zv); 
 renderer.render( scene, camera ); //alert("g");
}

function startPlay() {  
 audio.controls = true; 
	document.body.appendChild(audio); 	//**********************
	//audio.volume = cv; 			
	source = audioCtx.createMediaElementSource(audio); 
	//source = audioCtx.createMediaStreamSource(audio);         
	if (source !== undefined) { playGain(); setPos( xv, yv, zv );  }
	else { console.log("not supported");}  
} 

var fc = 0;   
function handleFiles() {
var fileInput = document.getElementById("input");
var len = fileInput.files.length;
  if (len>0) {loadsrc(len);} 
}

function loadsrc(len) {
 var fname;
  document.body.removeChild(audio);		//**********************
    src = URL.createObjectURL(document.getElementsByTagName('input')[0].files[fc]);
    //fname = document.getElementsByTagName('input')[0].files[fc].name; 
	//tfile=fname;
	//obj[tfile]=xv;
	/*
	chrome.storage.local.get(tfile,function (result) { 
		xv=result[tfile].xv; if (!xv) {xv=4;};
		yv=result[tfile].yv; if (!yv) {yv=2;}; 
		zv=result[tfile].zv; if (!zv) {zv=-4;};
		rv=result[tfile].rv; if (!rv) {rv=-0.5;}; 
		bv=result[tfile].bv; if (!bv) {bv= 0;}; 
		tv=result[tfile].tv; if (!tv) {tv= 20;}; 
		cv=result[tfile].cv; if (!cv) {cv=0.7;};
		fileinis(); //console.log(xv,yv,zv,rv,bv,tv);
	 }); 	
	*/					
    audio = new Audio(src);			//**********************
	audio.src=src;	audio.autoplay = true;
    audio.addEventListener('loadeddata', function() { 
	
	//document.getElementById("input").value="";
      /*
      //document.getElementById("fn").innerHTML="now playing "+(fc+1)+" of "+len+" : "+fname; //!!! for old chrome
	document.getElementById("fn").innerHTML=document.getElementById("input").value;
      audio.addEventListener('ended',function(){ 
          fc = fc + 1; 
		cv = audio.volume; //setvals(); 
	//chrome.storage.local.set({ 'ctlv': ctlvol }, function () {  });
          if (fc<len) {loadsrc(len);} 
		 else { fc = 0; }                                 
      },false); //console.log(fc);
     */
    startPlay(); 
 }, false);
}


function playGain() {
  source.connect(splitter); 
  splitter.connect(gainL, 0).connect(pannerL).connect(bass).connect(treble).connect(audioCtx.destination);
    splitter.connect(gainBL, 0).connect(pannerBL).connect(delaySL).connect(audioCtx.destination);
    splitter.connect(gainBL, 0).connect(pannerSL).connect(delaySL).connect(audioCtx.destination); 
    splitter.connect(gainBL, 0).connect(pannerUL).connect(delaySL).connect(audioCtx.destination);
	//var pannerUR = pannerBR;    
  
  splitter.connect(gainR, 1).connect(pannerR).connect(bass).connect(treble).connect(audioCtx.destination); 
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
 movsp();    
//audio.currentTime=audio.currentTime-0.1; 
}

function changeValueZ(zvalue) {
 zv = zvalue; document.getElementById("panValueZ").innerHTML="pos_Z = "+zv;
 document.querySelector("#numZ").value = zv;
 setPos( xv, yv, zv );
 //chrome.storage.local.set({'vspzv': zv}, function () { }); 
 //setvals(); 
 //if (tfile) { obj[tfile]={xv,yv,zv,rv,bv,tv}; chrome.storage.local.set(obj, function () { }); };  
}

function changeValueY(yvalue) {  
 yv = yvalue; document.getElementById("panValueY").innerHTML="pos_Y = "+yv; 
 document.querySelector("#numY").value = yv;
 setPos( xv, yv, zv );
 //chrome.storage.local.set({'vspyv': yv}, function () { }); 
 //setvals(); 
 //if (tfile) { obj[tfile]={xv,yv,zv,rv,bv,tv}; chrome.storage.local.set(obj, function () { }); };  
}

function changeValueX(xvalue) {  
 xv = xvalue; document.getElementById("panValueX").innerHTML="dist_X = "+xv; 
 document.querySelector("#numX").value = xv;
 setPos( xv, yv, zv );
 //chrome.storage.local.set({ 'vspxv': xv }, function () {  }); 
 //setvals(); 
 //if (tfile) { obj[tfile]={xv,yv,zv,rv,bv,tv}; chrome.storage.local.set(obj, function () { }); }; 
}

function changeVolRear(rSpVol) {  
 rv = rSpVol; document.getElementById("rspVol").innerHTML="surround_vol = " + rv; 
 document.querySelector("#rSp").value = rv;
 //setvals(); 
 //if (tfile) { obj[tfile]={xv,yv,zv,rv,bv,tv}; chrome.storage.local.set(obj, function () { }); };  
 gainBL.gain.value = -rv; gainBR.gain.value = -rv;
}

function changeBass(bvalue) {
  bass.gain.value = bvalue;  
  bv = bvalue;  //bv = bvalue*3 + 45;
  //bass.frequency.value   =  bv;
    document.getElementById("bassValue").innerHTML="bass = "+ bv;
    document.querySelector("#bass").value = bvalue;
  //setvals(); 
  //if (tfile) { obj[tfile]={xv,yv,zv,rv,bv,tv}; chrome.storage.local.set(obj, function () { }); };
}
function changeTreble(tvalue) {
  treble.gain.value = tvalue ;  
  tv = tvalue; tvv = -tvalue*500 + 12000;
  //treble.frequency.value   = tvv;
    document.getElementById("trebleValue").innerHTML="treble = "+ tv;
    document.querySelector("#treble").value = tvalue;
  //setvals(); 
  //if (tfile) { obj[tfile]={xv,yv,zv,rv,bv,tv}; chrome.storage.local.set(obj, function () { }); };
}

function setvals() {
  //if (tfile) { obj[tfile]={xv,yv,zv,rv,bv,tv,cv}; chrome.storage.local.set(obj, function () { }); };
}
/*
function readinis() {
var keys = ['vspxv','vspyv','vspzv','ctlv'];
  chrome.storage.local.get(keys,function (result) { 
	xv=result.vspxv; if (!xv) {xv=4;}; changeValueX(xv);
	yv=result.vspyv; if (!yv) {yv=2;}; changeValueY(yv);
	zv=result.vspzv; if (!zv) {zv=-4;}; changeValueZ(zv);
	ctlvol=result.ctlv; if (!ctlvol) {ctlvol=1;};
   });
 movsp();
}

function fileinis() { 
 changeValueX(xv); changeValueY(yv); changeValueZ(zv);
 changeVolRear(rv); changeBass(bv); changeTreble(tv);
 movsp(); setPos(xv,yv,zv);
}
*/