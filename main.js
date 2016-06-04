let Renderer = require('./src/renderer.js');
let ShaderLoader = require('./src/shader_loader.js');
let TextureLoader = require('./src/texture_loader.js');
let Raycaster = require('./src/raycaster.js');
let KeyInput = require('./src/key_input.js');

let levelData = require('./src/level_data.js');
let Level = require('./src/level.js');

let canvas = document.getElementById('game-canvas');
let aspects = [512, 384];
Renderer.setup(canvas, aspects);

let stuffToLoad = [
  ShaderLoader.load("raycast.vert"),
  ShaderLoader.load("raycast.frag"),
  TextureLoader.load("walls.png")
]

Promise.all(stuffToLoad).then(function(){
  TextureLoader.buildTextures(Renderer.gl);
  Raycaster.setup();
  ImportTool.setup(document.getElementById("toolbar"));
  render();
});


let once = true;

let radius = 5;

let level = Level.import(levelData);
level.createTexture();
Raycaster.worldDataTexture = level.texture;

let ImportTool = {
  setup: function(container){
    let button = this.button = document.createElement('button');
    button.innerHTML = "Import";
    button.onclick = function(){
      let input = prompt("Level export", "");
      let newLevel = Level.import(input);
      level.data = newLevel.data;
      level.updateTexture(newLevel.data);
    }
    container.appendChild(button);
  }
}

let position = [2.5, 2.5];
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
  let oldPosition = [position[0], position[1]];

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

  let currentTile = level.data.find(function(tile){ return tile.x == Math.floor(position[0]) && tile.y == Math.floor(position[1]) } );

  if (currentTile.filled){
    console.log(position, oldPosition);
    position = oldPosition;
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

