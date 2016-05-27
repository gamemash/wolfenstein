let Renderer = require('./src/renderer.js');
let ShaderLoader = require('./src/shader_loader.js');
let TextureLoader = require('./src/texture_loader.js');
let Raycaster = require('./src/raycaster.js');


let canvas = document.getElementById('game-canvas');
let aspects = [512, 384];
Renderer.setup(canvas, aspects);

let stuffToLoad = [
  ShaderLoader.load("raycast.vert"),
  ShaderLoader.load("raycast.frag"),
  TextureLoader.load("7.GIF")
]

Promise.all(stuffToLoad).then(function(){
  TextureLoader.buildTextures(Renderer.gl);
  Raycaster.setup();
  render();
});


let once = true;

let radius = 5;
let position = [0, 0, 5];
let angle = 0;

let width = height = 10;
let world = [].concat.apply([], (new Array(height)).fill().map(function(_,y){
  return (new Array(width)).fill().map(function(_, x){
    return {x: x, y: y, filled: false}
  });
}));

world[5 + width].filled = true;

let vector = function(x, y){ return {x: x, y: y}; };
function magnitude(v){
  return Math.sqrt(Math.pow(v.x,2) + Math.pow(v.y,2));

}
function normalize(v){
  let length = magnitude(v);
  return vector(v.x / length, v.y / length);
}

function divideScalar(v, scalar){
  return vector(v.x / scalar, v.y / scalar);
}
function multiplyScalar(v, scalar){
  return vector(v.x * scalar, v.y * scalar);
}
function addVectors(){
  let result = vector(0, 0);
  for(let i = 0; i < arguments.length; i += 1){
    result.x += arguments[i].x;
    result.y += arguments[i].y;
  }
  return result;
}

function subVectors(){
  let result = vector(arguments[0].x, arguments[0].y);
  for(let i = 1; i < arguments.length; i += 1){
    result.x -= arguments[i].x;
    result.y -= arguments[i].y;
  }
  return result;
}

let lookDirection = normalize(vector(1, 1));
let origin = vector(4.5, 0);
let fovVector = vector(lookDirection.y, -lookDirection.x);


//new Array(aspects[0]).fill().map(function(_,k){
//  let a = k - aspects[0] / 2;
//  let fovOffset = multiplyScalar(fovVector, a / (aspects[0] / 2));
//  let ray = addVectors(lookDirection, fovOffset);
//  let pos = addVectors(origin, fovOffset);
//  //console.log(ray, pos);
//});

function render(){
  let distance = Raycaster.findDistance(vector(5.5, 0), normalize(vector(0.1, 0.9)), world);
  console.log(distance);
  return;
  Renderer.clear();

  position[0] = Math.cos(angle) * radius;
  position[1] = Math.sin(angle) * radius;

  Raycaster.render(position);
  angle += 0.01;

  if (once){
    let gl = Renderer.gl;
    let size = 4 * 10 * 10;
    let pixelValues = new Uint8Array(size);
    let corrected = new Float32Array(size);
    gl.readPixels(aspects[0] / 2, aspects[1] / 2, 10, 10, gl.RGBA, gl.UNSIGNED_BYTE, pixelValues);
    for (let i = 0; i < size; i += 1){
     corrected[i] = pixelValues[i] / 255;
    }
    console.log(corrected);
    once = false;
  }


  requestAnimationFrame(render);
}

