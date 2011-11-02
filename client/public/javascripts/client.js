var socket = io.connect('http://dev.isolated.se:3131');


socket.on('msg', function(msg) {
  switch(msg.type) {
    case 'authreq':
      socket.emit('auth', { user: 'trouf', pass: 'pass'});
      break;
    case 'auth_ok':
      console.log('Auth successful');
      socket.emit('assets');
      break;
    case 'aoi':
      console.log(msg);
      break;
  }
});

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var camera, controls, scene, renderer;

var cross, mover, merged, group;

var tree, mouseX, mouseY, mouseDown;

merged = new THREE.Geometry();

loadModel();



function loadModel() {
  
  
  
loader = new THREE.JSONLoader( true );
    document.body.appendChild( loader.statusDomElement );

   loader.load( { model: '/javascripts/tree.js', callback: function( geometry ) { console.log(geometry); tree = geometry; init();} } );
}


function init() {

    // scene and camera

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xffffff, 0.0020 );

    
    
    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1000 );
    //camera = new THREE.OrthographicCamera( window.innerWidth / - 4, window.innerWidth / 4, window.innerHeight / 4, window.innerHeight / - 4, -1000, 5000 );
    camera.position.x = 200;    
    camera.position.y = 200;
    camera.position.z = 200;
/*
    
    controls = new THREE.TrackballControls( camera );

    
    var radius = 10;
    
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.2;

    controls.noZoom = true;
    controls.noPan = true;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.minDistance = radius * 1.1;
    controls.maxDistance = radius * 10;

    controls.keys = [ 65, 83, 68 ]; // [ rotateKey, zoomKey, panKey ]
*/
    
    
    // world
    // plane
var planeGeo = new THREE.PlaneGeometry(4000, 4000, 10, 10);
var planeMat = new THREE.MeshLambertMaterial({color: 0x00ff00});
var plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI/2;
    
    plane.receiveShadow = true;
    scene.add(plane);
    
    
    
    var cube = tree;//new THREE.CubeGeometry( 20, 60, 20 );

    
    
    /*
    cube.vertices[ 0 ].position.multiplyScalar( 0.01 );
    cube.vertices[ 1 ].position.multiplyScalar( 0.01 );
    cube.vertices[ 4 ].position.multiplyScalar( 0.01 );
    cube.vertices[ 5 ].position.multiplyScalar( 0.01 );
    */

    var material =  new THREE.MeshLambertMaterial( { color: 0x00ee00} );
    var material2 =  new THREE.MeshLambertMaterial({color: 0xffffff});
    
    var cube2 = new THREE.CubeGeometry( 20, 20, 20 );
    
    
     mover = new THREE.Mesh( cube2, material2 );
        mover.position.set( 0,
                            10,
                            0 );

        mover.updateMatrix();
        //mover.matrixAutoUpdate = false;
    
      // camera.target = mover;
    mover.castShadow = true;
    
        scene.add( mover );
    
    
  

    for( var i = 0; i < 200; i ++ ) {

        var mesh = new THREE.Mesh( cube, material );
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.10;
        mesh.position.set(( Math.random() - 0.5 ) * 1000,
                          0,
                          ( Math.random() - 0.5 ) * 1000 );

        mesh.rotation.y = Math.PI/((Math.random()-0.5) * 2);
        
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        
            
mesh.receiveShadow = true;
        
        THREE.GeometryUtils.merge(merged, mesh);
        
        

    }
    
    
    merged.computeFaceNormals();
            group    = new THREE.Mesh( merged, material );
            group.castShadow = true;
            group.matrixAutoUpdate = false;
            group.updateMatrix();
    
    scene.add(group);
    
    light = new THREE.SpotLight( 0xffffff );
    light.position.set( 0, 1500, 1000 );
    light.target.position.set( 0, 0, 0 );
    light.castShadow = true;
    scene.add( light );

    // lights
/*
    light = new THREE.SpotLight( 0xffffff );
    light.position.set( 500, 500, 500);
    light.castShadow = true;
    scene.add( light );
*/              
    /*
    light = new THREE.SpotLight( 0x002288 );
    light.position.set( -1, -1, -1 );
    light.castShadow = true;
    scene.add( light );
    */
    light = new THREE.AmbientLight( 0x222222 );
    scene.add( light );


    // renderer

    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setClearColorHex( 0xffffff, 1 );
    
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild( stats.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    animate();

}


function animate() {

   
    
    requestAnimationFrame( animate );
       
    render();
    stats.update();

}

function render() {
   
    mover.position.x += 0.2;
    
    var time = new Date().getTime() * 0.0005;
    //camera.position.y = mover.position.y;       
  // controls.update();
    
   //Orbit cam stuff
   if(mouseDown) {
     var x = (mouseX/window.innerWidth * 4) * Math.PI;
     var y = (mouseY/window.innerHeight) * 400;
     
        
     camera.position.x = mover.position.x +  (Math.cos(x * 0.5)) * 200;
     camera.position.z = mover.position.z +  (Math.sin(x * 0.5)) * 200;
     camera.position.y = y;
    }
   
   camera.lookAt(mover.position);   
   camera.updateMatrix();
   
    renderer.render( scene, camera );

}

function onDocumentMouseMove(event) {

  mouseX = ( event.clientX );
  mouseY = ( event.clientY );

}

function onDocumentMouseDown(event) {
  mouseDown = true;
}

function onDocumentMouseUp(event) {
  mouseDown = false;
  
}


//Ported from Stefan Gustavson's java implementation
//http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
//Read Stefan's excellent paper for details on how this code works.
//
//Sean McCullough banksean@gmail.com

/**
* You can pass in a random number generator object if you like.
* It is assumed to have a random() method.
*/
var SimplexNoise = function(r) {
if (r == undefined) r = Math;
this.grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0], 
                              [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1], 
                              [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]]; 
this.p = [];
for (var i=0; i<256; i++) {
 this.p[i] = Math.floor(r.random()*256);
}
// To remove the need for index wrapping, double the permutation table length 
this.perm = []; 
for(var i=0; i<512; i++) {
 this.perm[i]=this.p[i & 255];
} 

// A lookup table to traverse the simplex around a given point in 4D. 
// Details can be found where this table is used, in the 4D noise method. 
this.simplex = [ 
 [0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0], 
 [0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0], 
 [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], 
 [1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0], 
 [1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0], 
 [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], 
 [2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0], 
 [2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]; 
};

SimplexNoise.prototype.dot = function(g, x, y) { 
return g[0]*x + g[1]*y;
};

SimplexNoise.prototype.noise = function(xin, yin) { 
var n0, n1, n2; // Noise contributions from the three corners 
// Skew the input space to determine which simplex cell we're in 
var F2 = 0.5*(Math.sqrt(3.0)-1.0); 
var s = (xin+yin)*F2; // Hairy factor for 2D 
var i = Math.floor(xin+s); 
var j = Math.floor(yin+s); 
var G2 = (3.0-Math.sqrt(3.0))/6.0; 
var t = (i+j)*G2; 
var X0 = i-t; // Unskew the cell origin back to (x,y) space 
var Y0 = j-t; 
var x0 = xin-X0; // The x,y distances from the cell origin 
var y0 = yin-Y0; 
// For the 2D case, the simplex shape is an equilateral triangle. 
// Determine which simplex we are in. 
var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords 
if(x0>y0) {i1=1; j1=0;} // lower triangle, XY order: (0,0)->(1,0)->(1,1) 
else {i1=0; j1=1;}      // upper triangle, YX order: (0,0)->(0,1)->(1,1) 
// A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and 
// a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where 
// c = (3-sqrt(3))/6 
var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords 
var y1 = y0 - j1 + G2; 
var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords 
var y2 = y0 - 1.0 + 2.0 * G2; 
// Work out the hashed gradient indices of the three simplex corners 
var ii = i & 255; 
var jj = j & 255; 
var gi0 = this.perm[ii+this.perm[jj]] % 12; 
var gi1 = this.perm[ii+i1+this.perm[jj+j1]] % 12; 
var gi2 = this.perm[ii+1+this.perm[jj+1]] % 12; 
// Calculate the contribution from the three corners 
var t0 = 0.5 - x0*x0-y0*y0; 
if(t0<0) n0 = 0.0; 
else { 
 t0 *= t0; 
 n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);  // (x,y) of grad3 used for 2D gradient 
} 
var t1 = 0.5 - x1*x1-y1*y1; 
if(t1<0) n1 = 0.0; 
else { 
 t1 *= t1; 
 n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1); 
}
var t2 = 0.5 - x2*x2-y2*y2; 
if(t2<0) n2 = 0.0; 
else { 
 t2 *= t2; 
 n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2); 
} 
// Add contributions from each corner to get the final noise value. 
// The result is scaled to return values in the interval [-1,1]. 
return 70.0 * (n0 + n1 + n2); 
};

//3D simplex noise 
SimplexNoise.prototype.noise3d = function(xin, yin, zin) { 
var n0, n1, n2, n3; // Noise contributions from the four corners 
// Skew the input space to determine which simplex cell we're in 
var F3 = 1.0/3.0; 
var s = (xin+yin+zin)*F3; // Very nice and simple skew factor for 3D 
var i = Math.floor(xin+s); 
var j = Math.floor(yin+s); 
var k = Math.floor(zin+s); 
var G3 = 1.0/6.0; // Very nice and simple unskew factor, too 
var t = (i+j+k)*G3; 
var X0 = i-t; // Unskew the cell origin back to (x,y,z) space 
var Y0 = j-t; 
var Z0 = k-t; 
var x0 = xin-X0; // The x,y,z distances from the cell origin 
var y0 = yin-Y0; 
var z0 = zin-Z0; 
// For the 3D case, the simplex shape is a slightly irregular tetrahedron. 
// Determine which simplex we are in. 
var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords 
var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords 
if(x0>=y0) { 
 if(y0>=z0) 
   { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; } // X Y Z order 
   else if(x0>=z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; } // X Z Y order 
   else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; } // Z X Y order 
 } 
else { // x0<y0 
 if(y0<z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; } // Z Y X order 
 else if(x0<z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; } // Y Z X order 
 else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; } // Y X Z order 
} 
// A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z), 
// a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and 
// a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where 
// c = 1/6.
var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords 
var y1 = y0 - j1 + G3; 
var z1 = z0 - k1 + G3; 
var x2 = x0 - i2 + 2.0*G3; // Offsets for third corner in (x,y,z) coords 
var y2 = y0 - j2 + 2.0*G3; 
var z2 = z0 - k2 + 2.0*G3; 
var x3 = x0 - 1.0 + 3.0*G3; // Offsets for last corner in (x,y,z) coords 
var y3 = y0 - 1.0 + 3.0*G3; 
var z3 = z0 - 1.0 + 3.0*G3; 
// Work out the hashed gradient indices of the four simplex corners 
var ii = i & 255; 
var jj = j & 255; 
var kk = k & 255; 
var gi0 = this.perm[ii+this.perm[jj+this.perm[kk]]] % 12; 
var gi1 = this.perm[ii+i1+this.perm[jj+j1+this.perm[kk+k1]]] % 12; 
var gi2 = this.perm[ii+i2+this.perm[jj+j2+this.perm[kk+k2]]] % 12; 
var gi3 = this.perm[ii+1+this.perm[jj+1+this.perm[kk+1]]] % 12; 
// Calculate the contribution from the four corners 
var t0 = 0.6 - x0*x0 - y0*y0 - z0*z0; 
if(t0<0) n0 = 0.0; 
else { 
 t0 *= t0; 
 n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0, z0); 
}
var t1 = 0.6 - x1*x1 - y1*y1 - z1*z1; 
if(t1<0) n1 = 0.0; 
else { 
 t1 *= t1; 
 n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1, z1); 
} 
var t2 = 0.6 - x2*x2 - y2*y2 - z2*z2; 
if(t2<0) n2 = 0.0; 
else { 
 t2 *= t2; 
 n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2, z2); 
} 
var t3 = 0.6 - x3*x3 - y3*y3 - z3*z3; 
if(t3<0) n3 = 0.0; 
else { 
 t3 *= t3; 
 n3 = t3 * t3 * this.dot(this.grad3[gi3], x3, y3, z3); 
} 
// Add contributions from each corner to get the final noise value. 
// The result is scaled to stay just inside [-1,1] 
return 32.0*(n0 + n1 + n2 + n3); 
};
