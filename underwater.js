/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314 -- Sept 2023  -- A3 Template
/////////////////////////////////////////////////////////////////////////////////////////

console.log('A3 Sept 2023');

var meshesLoaded = false;
var RESOURCES_LOADED = false;
var deg2rad = Math.PI/180;

// give the following global scope (within in this file), which is useful for motions and objects
// that are related to animation

  // setup animation data structure, including a call-back function to use to update the model matrix
var crabMotion = new Motion(crabSetMatrices);
var danceMotion = new Motion(crabSetMatrices);
var jumpMotion = new Motion(crabSetMatrices);
var walkMotion = new Motion(crabSetMatrices);

var link0, link1, link2, link3, link4, link5, 
link6, link7, link8, link9, link10, 
link11, link12, link13, link14, link15, 
link16, link17, link18, link19, link20, 
link21, link22, link23, link24, link25;
var linkFrame0, linkFrame1, linkFrame2, linkFrame3, linkFrame4, linkFrame5, 
linkFrame6, linkFrame7, linkFrame8, linkFrame9, linkFrame10, 
linkFrame11, linkFrame12, linkFrame13, linkFrame14, linkFrame15, 
linkFrame16, linkFrame17, linkFrame18, linkFrame19, linkFrame20, 
linkFrame21, linkFrame22, linkFrame23, linkFrame24, linkFrame25;

var sphere;    
var meshes = {};  


// SETUP RENDERER & SCENE

var canvas = document.getElementById('canvas');
var camera;
var light;
var ambientLight;
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setClearColor(0xd0f0d0);     // set background colour
canvas.appendChild(renderer.domElement);

//////////////////////////////////////////////////////////
//  initCamera():   SETUP CAMERA
//////////////////////////////////////////////////////////

function initCamera() {
    // set up M_proj    (internally:  camera.projectionMatrix )
    var cameraFov = 30;     // initial camera vertical field of view, in degrees
      // view angle, aspect ratio, near, far
    camera = new THREE.PerspectiveCamera(cameraFov,1,0.1,1000); 

    var width = 10;  var height = 5;

//    An example of setting up an orthographic projection using threejs:
//    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000 );

    // set up M_view:   (internally:  camera.matrixWorldInverse )
    camera.position.set(0,35,75);
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(0,0,0);
    scene.add(camera);

      // SETUP ORBIT CONTROLS OF THE CAMERA (user control of rotation, pan, zoom)
//    const controls = new OrbitControls( camera, renderer.domElement );
    var controls = new THREE.OrbitControls(camera);
    controls.damping = 0.2;
    controls.autoRotate = false;
};

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
}

////////////////////////////////////////////////////////////////////////	
// init():  setup up scene
////////////////////////////////////////////////////////////////////////	

function init() {
    initCamera();
    initMotions();
    initLights();
    initObjects();
    initCrab();

    window.addEventListener('resize',resize);
    resize();
};

////////////////////////////////////////////////////////////////////////
// initMotions():  setup Motion instances for each object that we wish to animate
////////////////////////////////////////////////////////////////////////

function initMotions() {
  const restAngle = +60;
  const extendAngle = +40;
  const bendAngle = +70;

// #region ==== Standing ====
  const clawsOpen = [0, 2, 
    0,             // body        
    0, 0, 0, 0,    // left leg bases
    0, 0, 0, 0,    // right leg bases
    restAngle, restAngle, restAngle, restAngle,    // left leg tips
    restAngle, restAngle, restAngle, restAngle,     // right leg tips
    0, 0,          // claw bases
    +15, -15, +15, -15,    // claws
    0, 0,          // eye bases
    0, 0           // eye balls
  ];
  const clawsClosed = [0, 2, 
    0,             // body        
    0, 0, 0, 0,    // left leg bases
    0, 0, 0, 0,    // right leg bases
    restAngle, restAngle, restAngle, restAngle,    // left leg tips
    restAngle, restAngle, restAngle, restAngle,     // right leg tips
    0, 0,          // claw bases
    +5, -5, +5, -5,    // claws
    0, 0,          // eye bases
    0, 0           // eye balls
];

    // keyframes for crab:    name, time, [x, y, theta1 to theta25]
    crabMotion.addKeyFrame(new Keyframe('straight', 0.0, clawsClosed)); 
    crabMotion.addKeyFrame(new Keyframe('straight', 0.2, clawsOpen)); 
    crabMotion.addKeyFrame(new Keyframe('straight', 0.4, clawsClosed)); 
    crabMotion.addKeyFrame(new Keyframe('straight', 0.8, clawsOpen));
    crabMotion.addKeyFrame(new Keyframe('straight', 1.0, clawsClosed)); 

// #endregion    

// #region ==== Dancing ====
const move1 = [1, 2, 
  0,             // body        
  0, 0, 0, 0,    // left leg bases
  0, 0, 0, 0,    // right leg bases
  restAngle, restAngle, restAngle, bendAngle,    // left leg tips
  restAngle, restAngle, restAngle, extendAngle,     // right leg tips
  +10, +10,          // claw bases
  +20, -20, +20, -20,    // claws
  +10, +10,          // eye bases
  0, 0           // eye balls
];

const move2 = [0, 1, 
  0,             // body        
  0, 0, 0, 0,    // left leg bases
  0, 0, 0, 0,    // right leg bases
  restAngle, restAngle, bendAngle, bendAngle - 10,    // left leg tips
  restAngle, restAngle, extendAngle, extendAngle + 10,     // right leg tips
  +15, +15,          // claw bases
  +5, -5, +5, -5,    // claws
  +15, +15,          // eye bases
  0, 0           // eye balls
];

const move3 = [-1, 2, 
  0,             // body        
  0, 0, 0, 0,    // left leg bases
  0, 0, 0, 0,    // right leg bases
  restAngle, bendAngle, bendAngle - 10, restAngle,    // left leg tips
  restAngle, extendAngle, extendAngle + 10, restAngle,     // right leg tips
  +10, +10,          // claw bases
  +20, -20, +20, -20,    // claws
  0, 0,          // eye bases
  0, 0           // eye balls
];

const move4 = [0, 1, 
  0,             // body        
  0, 0, 0, 0,    // left leg bases
  0, 0, 0, 0,    // right leg bases
  bendAngle, bendAngle - 10, restAngle, extendAngle,    // left leg tips
  extendAngle, extendAngle + 10, restAngle, bendAngle,     // right leg tips
  -15, -10,          // claw bases
  +5, -5, +5, -5,    // claws
  -15, -10,          // eye bases
  0, 0           // eye balls
];

const move5 = [1, 2, 
  0,             // body        
  0, 0, 0, 0,    // left leg bases
  0, 0, 0, 0,    // right leg bases
  bendAngle - 10, restAngle, extendAngle, extendAngle +10,    // left leg tips
  extendAngle + 10, restAngle, bendAngle, bendAngle -10,     // right leg tips
  -15, -5,          // claw bases
  +20, -20, +20, -20,    // claws
  0, 0,          // eye bases
  0, 0           // eye balls
];

    danceMotion.addKeyFrame(new Keyframe('straight', 0.0, move1));
    danceMotion.addKeyFrame(new Keyframe('straight', 0.2, move2));
    danceMotion.addKeyFrame(new Keyframe('straight', 0.4, move3));
    danceMotion.addKeyFrame(new Keyframe('straight', 0.8, move4));
    danceMotion.addKeyFrame(new Keyframe('straight', 1.0, move5));
    danceMotion.addKeyFrame(new Keyframe('straight', 1.2, move1));
// #endregion
// #region ==== Jumping ====
const tipJumpAngle = +90;
const baseJumpAngle = +20;
const up = [0, 5, 
  0,             // body        
 baseJumpAngle, baseJumpAngle, baseJumpAngle, baseJumpAngle,    // left leg bases
 -baseJumpAngle, -baseJumpAngle, -baseJumpAngle, -baseJumpAngle,    // right leg bases
 tipJumpAngle, tipJumpAngle, tipJumpAngle, tipJumpAngle,    // left leg tips
 tipJumpAngle, tipJumpAngle, tipJumpAngle, tipJumpAngle,     // right leg tips
  +30, -30,          // claw bases
  +15, -15, +15, -15,    // claws
  0, 0,          // eye bases
  0, 0           // eye balls
];
const down = [0, 2, 
  0,             // body        
  0, 0, 0, 0,    // left leg bases
  0, 0, 0, 0,    // right leg bases
  restAngle, restAngle, restAngle, restAngle,    // left leg tips
  restAngle, restAngle, restAngle, restAngle,     // right leg tips
  0, 0,          // claw bases
  +5, -5, +5, -5,    // claws
  0, 0,          // eye bases
  0, 0           // eye balls
];

  // keyframes for crab:    name, time, [x, y, theta1 to theta25]
  jumpMotion.addKeyFrame(new Keyframe('straight', 0.0, down)); 
  jumpMotion.addKeyFrame(new Keyframe('straight', 0.2, up)); 
  jumpMotion.addKeyFrame(new Keyframe('straight', 0.4, down)); 
  // #endregion

// #region ==== Dancing ====
const walk1 = [
  0,             // body        
  0, 0, 0, 0,    // left leg bases
  0, 0, 0, 0,    // right leg bases
  restAngle, restAngle, restAngle, bendAngle,    // left leg tips
  restAngle, restAngle, restAngle, extendAngle,     // right leg tips
  0, 0,          // claw bases
  +20, -20, +20, -20,    // claws
  0, 0,          // eye bases
  0, 0           // eye balls
];

const walk2 = [ 
  0,             // body        
  0, 0, 0, 0,    // left leg bases
  0, 0, 0, 0,    // right leg bases
  restAngle, restAngle, bendAngle, bendAngle - 10,    // left leg tips
  restAngle, restAngle, extendAngle, extendAngle + 10,     // right leg tips
  +5, +5,          // claw bases
  +5, -5, +5, -5,    // claws
  +5, +5,          // eye bases
  0, 0           // eye balls
];

const walk3 = [
  0,             // body        
  0, 0, 0, 0,    // left leg bases
  0, 0, 0, 0,    // right leg bases
  restAngle, bendAngle, bendAngle - 10, restAngle,    // left leg tips
  restAngle, extendAngle, extendAngle + 10, restAngle,     // right leg tips
  0, 0,          // claw bases
  +20, -20, +20, -20,    // claws
  0, 0,          // eye bases
  0, 0           // eye balls
];

const walk4 = [ 
  0,             // body        
  0, 0, 0, 0,    // left leg bases
  0, 0, 0, 0,    // right leg bases
  bendAngle, bendAngle - 10, restAngle, extendAngle,    // left leg tips
  extendAngle, extendAngle + 10, restAngle, bendAngle,     // right leg tips
  -5, -5,          // claw bases
  +5, -5, +5, -5,    // claws
  -5, -5,          // eye bases
  0, 0           // eye balls
];

const walk5 = [
  0,             // body        
  0, 0, 0, 0,    // left leg bases
  0, 0, 0, 0,    // right leg bases
  bendAngle - 10, restAngle, extendAngle, extendAngle +10,    // left leg tips
  extendAngle + 10, restAngle, bendAngle, bendAngle -10,     // right leg tips
  0, 0,          // claw bases
  +20, -20, +20, -20,    // claws
  0, 0,          // eye bases
  0, 0           // eye balls
];

    walkMotion.addKeyFrame(new Keyframe('straight', 0.0, [0, 2].concat(walk1)));
    walkMotion.addKeyFrame(new Keyframe('straight', 0.2, [1, 2].concat(walk2)));
    walkMotion.addKeyFrame(new Keyframe('straight', 0.4, [2, 2].concat(walk3)));
    walkMotion.addKeyFrame(new Keyframe('straight', 0.8, [3, 2].concat(walk4)));
    walkMotion.addKeyFrame(new Keyframe('straight', 1.0, [4, 2].concat(walk5)));
    walkMotion.addKeyFrame(new Keyframe('straight', 1.2, [5, 2].concat(walk1)));
    walkMotion.addKeyFrame(new Keyframe('straight', 1.4, [6, 2].concat(walk1)));
    walkMotion.addKeyFrame(new Keyframe('straight', 1.6, [7, 2].concat(walk2)));
    walkMotion.addKeyFrame(new Keyframe('straight', 1.8, [8, 2].concat(walk3)));
    walkMotion.addKeyFrame(new Keyframe('straight', 2.0, [9, 2].concat(walk4)));
    walkMotion.addKeyFrame(new Keyframe('straight', 2.2, [10, 2].concat(walk5)));
    walkMotion.addKeyFrame(new Keyframe('straight', 2.4, [11, 2].concat(walk1)));

    walkMotion.addKeyFrame(new Keyframe('straight', 2.6, [10, 2].concat(walk1)));
    walkMotion.addKeyFrame(new Keyframe('straight', 2.8, [9, 2].concat(walk2)));
    walkMotion.addKeyFrame(new Keyframe('straight', 3.0, [8, 2].concat(walk3)));
    walkMotion.addKeyFrame(new Keyframe('straight', 3.2, [7, 2].concat(walk4)));
    walkMotion.addKeyFrame(new Keyframe('straight', 3.4, [6, 2].concat(walk5)));
    walkMotion.addKeyFrame(new Keyframe('straight', 3.6, [5, 2].concat(walk1)));
    walkMotion.addKeyFrame(new Keyframe('straight', 3.8, [4, 2].concat(walk1)));
    walkMotion.addKeyFrame(new Keyframe('straight', 4.0, [3, 2].concat(walk2)));
    walkMotion.addKeyFrame(new Keyframe('straight', 4.2, [2, 2].concat(walk3)));
    walkMotion.addKeyFrame(new Keyframe('straight', 4.4, [1, 2].concat(walk4)));
    walkMotion.addKeyFrame(new Keyframe('straight', 4.6, [0, 2].concat(walk5)));

// #endregion
}

///////////////////////////////////////////////////////////////////////////////////////
// crabSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function crabSetMatrices(avars) {
    var xPosition = avars[0];
    var yPosition = avars[1];

    var thetas = [];
    for (var i = 0; i <= 26; i++) {
      thetas[i] = avars[i+2] * deg2rad;
    }

    var M =  new THREE.Matrix4();
    
      ////////////// link0 (body)
    linkFrame0.matrix.identity(); 
    linkFrame0.matrix.multiply(M.makeTranslation(xPosition,yPosition,0));   
    linkFrame0.matrix.multiply(M.makeRotationZ(thetas[0]));    
    link0.matrix.copy(linkFrame0.matrix);
    link0.matrix.multiply(M.makeTranslation(0,0,0));   
    link0.matrix.multiply(M.makeScale(6,2,4.5));    

// #region ==================== left leg base ===========================
      ////////////// link1
    linkFrame1.matrix.copy(linkFrame0.matrix);      // start with parent frame
    linkFrame1.matrix.multiply(M.makeTranslation(-3,0,-2));
    linkFrame1.matrix.multiply(M.makeRotationZ(thetas[1]));
    linkFrame1.matrix.multiply(M.makeRotationY(-Math.PI/8));        
    link1.matrix.copy(linkFrame1.matrix);
    link1.matrix.multiply(M.makeTranslation(-1,0,0));   

      ///////////////  link2
    linkFrame2.matrix.copy(linkFrame0.matrix);
    linkFrame2.matrix.multiply(M.makeTranslation(-3.5,0,-1));
    linkFrame2.matrix.multiply(M.makeRotationZ(thetas[2]));    
    link2.matrix.copy(linkFrame2.matrix);
    link2.matrix.multiply(M.makeTranslation(-1,0,0));   

      /////////////// link3
    linkFrame3.matrix.copy(linkFrame0.matrix);
    linkFrame3.matrix.multiply(M.makeTranslation(-3.5,0,0.5));
    linkFrame3.matrix.multiply(M.makeRotationZ(thetas[3]));    
    link3.matrix.copy(linkFrame3.matrix);
    link3.matrix.multiply(M.makeTranslation(-1,0,0));   

      /////////////// link4
    linkFrame4.matrix.copy(linkFrame0.matrix);
    linkFrame4.matrix.multiply(M.makeTranslation(-3,0,1.5));
    linkFrame4.matrix.multiply(M.makeRotationZ(thetas[4]));    
    linkFrame4.matrix.multiply(M.makeRotationY(Math.PI/8));        
    link4.matrix.copy(linkFrame4.matrix);
    link4.matrix.multiply(M.makeTranslation(-1,0,0));  
// #endregion

// #region ==================== right leg base ===========================
    ////////////// link5
    linkFrame5.matrix.copy(linkFrame0.matrix);
    linkFrame5.matrix.multiply(M.makeTranslation(3,0,-2));
    linkFrame5.matrix.multiply(M.makeRotationZ(thetas[5]));
    linkFrame5.matrix.multiply(M.makeRotationY(Math.PI/8));        
    link5.matrix.copy(linkFrame5.matrix);
    link5.matrix.multiply(M.makeTranslation(1,0,0));   

      ///////////////  link6
    linkFrame6.matrix.copy(linkFrame0.matrix);
    linkFrame6.matrix.multiply(M.makeTranslation(3.5,0,-1));
    linkFrame6.matrix.multiply(M.makeRotationZ(thetas[6]));    
    link6.matrix.copy(linkFrame6.matrix);
    link6.matrix.multiply(M.makeTranslation(1,0,0));   

      /////////////// link7
    linkFrame7.matrix.copy(linkFrame0.matrix);
    linkFrame7.matrix.multiply(M.makeTranslation(3.5,0,0.5));
    linkFrame7.matrix.multiply(M.makeRotationZ(thetas[7]));    
    link7.matrix.copy(linkFrame7.matrix);
    link7.matrix.multiply(M.makeTranslation(1,0,0));   

      /////////////// link8
    linkFrame8.matrix.copy(linkFrame0.matrix);
    linkFrame8.matrix.multiply(M.makeTranslation(3, 0, 1.5));
    linkFrame8.matrix.multiply(M.makeRotationZ(thetas[8]));
    linkFrame8.matrix.multiply(M.makeRotationY(-Math.PI/8));
    link8.matrix.copy(linkFrame8.matrix);
    link8.matrix.multiply(M.makeTranslation(1, 0, 0));
// #endregion

// #region ==================== left leg tip ===========================
        ///////////////  link9
linkFrame9.matrix.copy(linkFrame1.matrix);
linkFrame9.matrix.multiply(M.makeTranslation(-1.9, -0.2, 0));
linkFrame9.matrix.multiply(M.makeRotationZ(thetas[9]));
link9.matrix.copy(linkFrame9.matrix);
link9.matrix.multiply(M.makeTranslation(-1, 0, 0));
  
        ///////////////  link10
linkFrame10.matrix.copy(linkFrame2.matrix);
linkFrame10.matrix.multiply(M.makeTranslation(-1.9, -0.2, 0));
linkFrame10.matrix.multiply(M.makeRotationZ(thetas[10]));
link10.matrix.copy(linkFrame10.matrix);
link10.matrix.multiply(M.makeTranslation(-1,0,0));
  
        /////////////// link11
linkFrame11.matrix.copy(linkFrame3.matrix);
linkFrame11.matrix.multiply(M.makeTranslation(-1.9, -0.2, 0));
linkFrame11.matrix.multiply(M.makeRotationZ(thetas[11]));
link11.matrix.copy(linkFrame11.matrix);
link11.matrix.multiply(M.makeTranslation(-1, 0, 0));

  
        /////////////// link12
linkFrame12.matrix.copy(linkFrame4.matrix);
linkFrame12.matrix.multiply(M.makeTranslation(-1.9, -0.2, 0));
linkFrame12.matrix.multiply(M.makeRotationZ(thetas[12]));
link12.matrix.copy(linkFrame12.matrix);
link12.matrix.multiply(M.makeTranslation(-1, 0, 0));
// #endregion

// #region ==================== right leg tip ===========================
        ///////////////  link13
linkFrame13.matrix.copy(linkFrame5.matrix);
linkFrame13.matrix.multiply(M.makeTranslation(1.9, -0.2, 0));
linkFrame13.matrix.multiply(M.makeScale(-1, 1, 1));
linkFrame13.matrix.multiply(M.makeRotationZ(thetas[13]));
link13.matrix.copy(linkFrame13.matrix);
link13.matrix.multiply(M.makeTranslation(-1, 0, 0));        
          
        ///////////////  link14
linkFrame14.matrix.copy(linkFrame6.matrix);
linkFrame14.matrix.multiply(M.makeTranslation(1.9, -0.2, 0));
linkFrame14.matrix.multiply(M.makeScale(-1, 1, 1));
linkFrame14.matrix.multiply(M.makeRotationZ(thetas[14]));
link14.matrix.copy(linkFrame14.matrix);
link14.matrix.multiply(M.makeTranslation(-1, 0, 0));        
          
        /////////////// link15
linkFrame15.matrix.copy(linkFrame7.matrix);
linkFrame15.matrix.multiply(M.makeTranslation(1.9, -0.2, 0));
linkFrame15.matrix.multiply(M.makeScale(-1, 1, 1));
linkFrame15.matrix.multiply(M.makeRotationZ(thetas[15]));
link15.matrix.copy(linkFrame15.matrix);
link15.matrix.multiply(M.makeTranslation(-1, 0, 0));
  
        /////////////// link16
linkFrame16.matrix.copy(linkFrame8.matrix);
linkFrame16.matrix.multiply(M.makeTranslation(1.9, -0.2, 0));
linkFrame16.matrix.multiply(M.makeScale(-1, 1, 1));
linkFrame16.matrix.multiply(M.makeRotationZ(thetas[16]));
link16.matrix.copy(linkFrame16.matrix);
link16.matrix.multiply(M.makeTranslation(-1, 0, 0));
// #endregion

// #region ==================== eye bases ===========================
      ////////////// link23 (left)
      linkFrame23.matrix.copy(linkFrame0.matrix);      // start with parent frame
      linkFrame23.matrix.multiply(M.makeTranslation(-1,1.5,1.3));
      linkFrame23.matrix.multiply(M.makeRotationZ(thetas[23]));
      link23.matrix.copy(linkFrame23.matrix);
  
        ///////////////  link24 (right)
      linkFrame24.matrix.copy(linkFrame0.matrix);
      linkFrame24.matrix.multiply(M.makeTranslation(1,1.5,1.3));
      linkFrame24.matrix.multiply(M.makeRotationZ(thetas[24]));    
      link24.matrix.copy(linkFrame24.matrix);
// #endregion

// #region ==================== eye balls ===========================
      ////////////// link25 (left)
      linkFrame25.matrix.copy(linkFrame23.matrix);      // start with parent frame
      linkFrame25.matrix.multiply(M.makeTranslation(0,0.5,0));
      linkFrame25.matrix.multiply(M.makeRotationZ(thetas[25]));
      link25.matrix.copy(linkFrame25.matrix);
  
        ///////////////  link26 (right)
      linkFrame26.matrix.copy(linkFrame24.matrix);
      linkFrame26.matrix.multiply(M.makeTranslation(0,0.5,0));
      linkFrame26.matrix.multiply(M.makeRotationZ(thetas[26]));    
      link26.matrix.copy(linkFrame26.matrix);
// #endregion

// #region ==================== claw bases ===========================
      ////////////// link17 (left)
      linkFrame17.matrix.copy(linkFrame0.matrix);
      linkFrame17.matrix.multiply(M.makeTranslation(-3,1,1.8));
      linkFrame17.matrix.multiply(M.makeRotationZ(thetas[17]));
      link17.matrix.copy(linkFrame17.matrix);
  
        ///////////////  link18 (right)
      linkFrame18.matrix.copy(linkFrame0.matrix);
      linkFrame18.matrix.multiply(M.makeTranslation(3,1,1.8));
      linkFrame18.matrix.multiply(M.makeRotationZ(thetas[18]));    
      link18.matrix.copy(linkFrame18.matrix);
// #endregion

// #region ==================== claws ===========================
      ////////////// link19 (left-left)
      linkFrame19.matrix.copy(linkFrame17.matrix);
      linkFrame19.matrix.multiply(M.makeTranslation(0,1.5,0));
      linkFrame19.matrix.multiply(M.makeRotationZ(thetas[19]));
      link19.matrix.copy(linkFrame19.matrix);
      link19.matrix.multiply(M.makeRotationY(-Math.PI/2));
  
        ///////////////  link20 (left-right)
      linkFrame20.matrix.copy(linkFrame17.matrix);
      linkFrame20.matrix.multiply(M.makeTranslation(0,1.5,0));
      linkFrame20.matrix.multiply(M.makeRotationZ(thetas[20]));    
      link20.matrix.copy(linkFrame20.matrix);
      link20.matrix.multiply(M.makeRotationY(Math.PI/2));

       ////////////// link21 (right-left)
       linkFrame21.matrix.copy(linkFrame18.matrix);
       linkFrame21.matrix.multiply(M.makeTranslation(0,1.5,0));
       linkFrame21.matrix.multiply(M.makeRotationZ(thetas[21]));
       link21.matrix.copy(linkFrame21.matrix);
       link21.matrix.multiply(M.makeRotationY(-Math.PI/2));
   
         ///////////////  link22 (right-right)
       linkFrame22.matrix.copy(linkFrame18.matrix);
       linkFrame22.matrix.multiply(M.makeTranslation(0,1.5,0));
       linkFrame22.matrix.multiply(M.makeRotationZ(thetas[22]));
       link22.matrix.copy(linkFrame22.matrix);     
       link22.matrix.multiply(M.makeRotationY(Math.PI/2));
// #endregion

    for (var i = 1; i <= 26; i++) {
      window['link' + i].updateMatrixWorld();
      window['linkFrame' + i].updateMatrixWorld();
    }
}

/////////////////////////////////////	
// initLights():  SETUP LIGHTS
/////////////////////////////////////	

function initLights() {
    light = new THREE.PointLight(0xffffff);
    light.position.set(2,10,2);
    scene.add(light);
    ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);
}

/////////////////////////////////////	
// MATERIALS
/////////////////////////////////////	

var diffuseMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
var diffuseMaterial2 = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide } );
var basicMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
var armadilloMaterial = new THREE.MeshBasicMaterial( {color: 0x7fff7f} );

/////////////////////////////////////	
// initObjects():  setup objects in the scene
/////////////////////////////////////	

function initObjects() {
    // var worldFrame = new THREE.AxesHelper(5) ;
    // scene.add(worldFrame);

    // textured floor
    var floorTexture = new THREE.TextureLoader().load('images/beach.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1, 1);
    var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
    var floorGeometry = new THREE.PlaneGeometry(50, 50);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -1.1;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);
}

/////////////////////////////////////////////////////////////////////////////////////
//  initCrab():  define all geometry associated with the hand
/////////////////////////////////////////////////////////////////////////////////////

function initCrab() {
    var crabMaterial = new THREE.MeshLambertMaterial( {color: 0xee4b2b} );
    var eyeballMaterial = new THREE.MeshLambertMaterial( {color: 0x000000} );
    crabMaterial.side = THREE.DoubleSide;
    var legBaseGeometry = new THREE.SphereGeometry( 0.8, 32, 16 );    // width, height, depth
    legBaseGeometry.scale(1.5,0.6,0.7);
    var legTipGeometry = new THREE.SphereGeometry( 0.8, 32, 16 );    // width, height, depth
    legTipGeometry.scale(2,0.6,0.7);
    var bodyGeometry = new THREE.SphereGeometry( 0.8, 32, 16 ); // radius, widthSegments, heightSegments
    
    // parameters:  radiusAtTop, radiusAtBottom, height, radialSegments, heightSegments
    var eyeBaseGeometry = new THREE.CylinderGeometry( 0.30, 0.30, 0.80, 20, 4 );
    var eyeBallGeometry = new THREE.SphereGeometry( 0.45, 32, 16 );
    
    var clawBaseGeometry = new THREE.CylinderGeometry( 0.35, 0.35, 1.0, 20, 4 );
    
    // == body ==
    link0 = new THREE.Mesh( bodyGeometry, crabMaterial );  scene.add( link0 );
    linkFrame0   = new THREE.AxesHelper(1) ;   
    // scene.add(linkFrame0);
    
    // == leg bases ==
    for (var i = 1; i <= 8; i++) {
      window['link' + i] = new THREE.Mesh( legBaseGeometry, crabMaterial );
      scene.add(window['link' + i]);
      window['linkFrame' + i] = new THREE.AxesHelper(1) ;   
      // scene.add(window['linkFrame' + i]);
    }

    // == leg tips ==
    for (var i = 9; i <= 16; i++) {
      window['link' + i] = new THREE.Mesh( legTipGeometry, crabMaterial );
      scene.add(window['link' + i]);
      window['linkFrame' + i] = new THREE.AxesHelper(1) ;   
      // scene.add(window['linkFrame' + i]);
    }

    // == claw bases ==
    for (var i = 17; i <= 18; i++) {
      window['link' + i] = new THREE.Mesh( clawBaseGeometry, crabMaterial );
      scene.add(window['link' + i]);
      window['linkFrame' + i] = new THREE.AxesHelper(1) ;   
      // scene.add(window['linkFrame' + i]);
    }

    // == claws ==
    // radius, widthSegments, heightSegments
    var hemisphereGeometry = new THREE.SphereGeometry(0.9,16,16, 0,  Math.PI, 0, Math.PI);
    var circleGeometry = new THREE.CircleGeometry(0.9, 32, 0, Math.PI*2);
    const hemisphere = new THREE.Mesh(hemisphereGeometry, crabMaterial);
    const circle = new THREE.Mesh(circleGeometry, crabMaterial);
    hemisphere.position.set(0,0,0);
    circle.position.set(0,0,0);
    hemisphere.scale.set(1,1.3,1);
    circle.scale.set(1,1.3,1);

    const claw = new THREE.Group();
    claw.add(hemisphere);
    claw.add(circle);

    for (var i = 19; i <= 22; i++) {
      window['link' + i] = claw.clone();
      scene.add(window['link' + i]);
      window['linkFrame' + i] = new THREE.AxesHelper(1) ;   
      // scene.add(window['linkFrame' + i]);
    }

    // == eye bases ==
    for (var i = 23; i <= 24; i++) {
      window['link' + i] = new THREE.Mesh( eyeBaseGeometry, crabMaterial );
      scene.add(window['link' + i]);
      window['linkFrame' + i] = new THREE.AxesHelper(1) ;   
      // scene.add(window['linkFrame' + i]);
    }

    // == eye balls ==
    for (var i = 25; i <= 26; i++) {
      window['link' + i] = new THREE.Mesh( eyeBallGeometry, eyeballMaterial );
      scene.add(window['link' + i]);
      window['linkFrame' + i] = new THREE.AxesHelper(1) ;   
      // scene.add(window['linkFrame' + i]);
    }

    // == setting property for every link and linkframe ==
    for (var i = 0; i <= 26; i++) {
      window['link' + i].matrixAutoUpdate = false;
      window['linkFrame' + i].matrixAutoUpdate = false;
  }
}

/////////////////////////////////////////////////////////////////////////////////////
//  create customShader material
/////////////////////////////////////////////////////////////////////////////////////

var customShaderMaterial = new THREE.ShaderMaterial( {
//        uniforms: { textureSampler: {type: 't', value: floorTexture}},
	vertexShader: document.getElementById( 'customVertexShader' ).textContent,
	fragmentShader: document.getElementById( 'customFragmentShader' ).textContent
} );

// var ctx = renderer.context;
// ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////

// movement
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;

    if (keyCode == "W".charCodeAt()) {          // W = Walk
      conditions.standingAnimation = false;
      conditions.dancingAnimation = false;
      conditions.jumpingAnimation = false;
      conditions.walkingAnimation = true;

    } else if (keyCode == "S".charCodeAt()) {   // S = Stand
      conditions.standingAnimation = true;
      conditions.dancingAnimation = false;
      conditions.jumpingAnimation = false;
      conditions.walkingAnimation = false;

    } else if (keyCode == "J".charCodeAt()) {   // J = Jump
      conditions.standingAnimation = false;
      conditions.dancingAnimation = false;
      conditions.jumpingAnimation = true;  
      conditions.walkingAnimation = false;

    } else if (keyCode == "D".charCodeAt()) {   // D = Dance
      conditions.standingAnimation = false;
      conditions.dancingAnimation = true;
      conditions.jumpingAnimation = false;
      conditions.walkingAnimation = false;

    } else if (keyCode == " ".charCodeAt()) {    // space = pause animation
      for (const variable in conditions) {
        if (conditions[variable]) {
          conditions[variable] = false;
          break;
        }
      }
    }
};

///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK:    This is the main animation loop
///////////////////////////////////////////////////////////////////////////////////////
var conditions = {
  standingAnimation: false,
  dancingAnimation: false,
  jumpingAnimation: false,
  walkingAnimation: true
};

var tmp = 0;

function update() {
  var dt=0.05;
  if (conditions.standingAnimation) {
	// advance the motion of all the animated objects
    crabMotion.timestep(dt);
  } else if (conditions.dancingAnimation) {
      danceMotion.timestep(dt);
  } else if (conditions.walkingAnimation) {
      walkMotion.timestep(dt);
  }
  else if (conditions.jumpingAnimation) {
      jumpMotion.timestep(dt);
      tmp++;
      console.log(tmp);
      if(tmp === 8) {
        conditions.jumpingAnimation = false;
        conditions.standingAnimation = true;
        tmp = 0;
      }
  }
	renderer.render(scene, camera);
  requestAnimationFrame(update);      // requests the next update call;  this creates a loop
}

init();
update();

