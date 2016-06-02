let Renderer = require('./src/renderer.js');
let ShaderLoader = require('./src/shader_loader.js');
let TextureLoader = require('./src/texture_loader.js');
let Tile = require('./src/tile.js');
let Grid = require('./src/grid.js');
let levelData = require('./src/level_data');
let KeyInput = require('./src/key_input.js');
let MouseInput = require('./src/mouse_input.js');

let canvas = document.getElementById('game-canvas');
MouseInput.registerOnCanvas(canvas);
let aspects = [512, 384];
Renderer.setup(canvas, aspects);

let stuffToLoad = [
  ShaderLoader.load("grid.vert"),
  ShaderLoader.load("grid.frag"),
  ShaderLoader.load("tile.vert"),
  ShaderLoader.load("tile.frag"),
  TextureLoader.load("walls.png")
]

Promise.all(stuffToLoad).then(function(){
  TextureLoader.buildTextures(Renderer.gl);
  Tile.setup();
  Grid.setup();
  console.log("Done; rendering..");
  render();
});

function handleInputForCamera(cameraPosition, dt){
  let speed = 1.0;
  if (KeyInput[87]){
    cameraPosition[1] += speed * dt;
  }

  if (KeyInput[83]){
    cameraPosition[1] -= speed * dt;
  }

  if (KeyInput[65]){
    cameraPosition[0] -= speed * dt;
  }

  if (KeyInput[68]){
    cameraPosition[0] += speed * dt;
  }

  return cameraPosition;
}


let world = [].concat.apply([],levelData.map(function(row,y){
  return row.map(function(f, x){
    return {x: x, y: y, filled: (f > 0), block: f - 1}
  });
}));

let cameraPosition = [0, 0];

let dt = 1/60;
function render(){
  Renderer.clear();
  cameraPosition = handleInputForCamera(cameraPosition, dt);

  Grid.render(64, cameraPosition);
  world.forEach(function(tile){
    if (tile.filled){
      Tile.render([tile.x, tile.y], tile.block, cameraPosition);
    }
  });
  requestAnimationFrame(render);
}
