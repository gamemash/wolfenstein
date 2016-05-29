let Renderer = require('./src/renderer.js');
let ShaderLoader = require('./src/shader_loader.js');
let TextureLoader = require('./src/texture_loader.js');
let Raycaster = require('./src/raycaster.js');
let KeyInput = require('./src/key_input.js');

let levelData = require('./src/level_data.js');

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

let width = height = 32;
let world = [].concat.apply([],levelData.map(function(row,y){
  return row.map(function(f, x){
    return {x: x, y: y, filled: f}
  });
}));


let rowStart = 16 * 32;
for (let i = 0; i < 32; i += 1){
  world[i + rowStart].filled = true;
}
//world[67].filled = true;
//world[68].filled = true;
//world[2].filled = true;

let worldData = new Uint8Array(width * height * 4);
let i = 0;
world.forEach(function(tile){
  worldData[i]     = tile.x;
  worldData[i + 1] = tile.y;
  worldData[i + 2] = tile.filled;
  worldData[i + 3] = 0;
  i += 4;
});


{
  let gl = Renderer.gl;
  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, worldData);
  gl.texParameteri ( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST ) ;
  gl.texParameteri ( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST ) ;
  gl.texParameteri ( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT ) ;
  gl.texParameteri ( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT ) ;

  gl.bindTexture(gl.TEXTURE_2D, null);

  Raycaster.worldDataTexture = texture;
}

let position = [3, 3];
let angle = 0;
let speed = 2;
let rotationalSpeed = 1;
let dt = 1/60;
function render(){
  if (KeyInput[81]){
    angle += rotationalSpeed * Math.PI * 2 * dt;
  }
  if (KeyInput[69]){
    angle -= rotationalSpeed * Math.PI * 2 * dt;
  }
  let lookVector = [Math.cos(angle), Math.sin(angle)];

  if (KeyInput[87]){
    position[0] += lookVector[0] * speed * dt;
    position[1] += lookVector[1] * speed * dt;
  }

  if (KeyInput[83]){
    position[0] -= lookVector[0] * speed * dt;
    position[1] -= lookVector[1] * speed * dt;
  }

  if (KeyInput[65]){
    position[0] -= lookVector[1] * speed * dt;
    position[1] += lookVector[0] * speed * dt;
  }

  if (KeyInput[68]){
    position[0] += lookVector[1] * speed * dt;
    position[1] -= lookVector[0] * speed * dt;
  }

  Renderer.clear();

  Raycaster.render(position, lookVector);


  requestAnimationFrame(render);
  return;
  if (once){
    let gl = Renderer.gl;
    let size = 4 * 10 * 10;
    let pixelValues = new Uint8Array(size);
    let corrected = new Float32Array(size);
    gl.readPixels(aspects[0] / 2, aspects[1] / 2, 10, 10, gl.RGBA, gl.UNSIGNED_BYTE, pixelValues);
    for (let i = 0; i < size; i += 1){
     corrected[i] = pixelValues[i] / 255;
    }
    once = false;
  }

}

