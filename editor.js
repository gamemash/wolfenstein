let Renderer = require('./src/renderer.js');
let ShaderLoader = require('./src/shader_loader.js');
let TextureLoader = require('./src/texture_loader.js');
let Tile = require('./src/tile.js');
let Grid = require('./src/grid.js');
let Selector = require('./src/selector.js');
let levelData = require('./src/level_data');
let KeyInput = require('./src/key_input.js');
let MouseInput = require('./src/mouse_input.js');
let Vec2 = require('./src/vector.js');

let canvas = document.getElementById('game-canvas');
MouseInput.registerOnCanvas(canvas);
Renderer.setup(canvas);

let stuffToLoad = [
  ShaderLoader.load("grid.vert"),
  ShaderLoader.load("grid.frag"),
  ShaderLoader.load("tile.vert"),
  ShaderLoader.load("tile.frag"),
  ShaderLoader.load("selector.vert"),
  ShaderLoader.load("selector.frag"),
  TextureLoader.load("walls.png")
]

Promise.all(stuffToLoad).then(function(){
  TextureLoader.buildTextures(Renderer.gl);
  Tile.setup();
  Grid.setup();
  Selector.setup();
  console.log("Done; rendering..");
  render();
});

function handleInputForCamera(cameraPosition, dt){
  let speed = 16.0;
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
let selector;

let scale = 32;
let dt = 1/60;
function render(){
  Renderer.clear();
  cameraPosition = handleInputForCamera(cameraPosition, dt);
  if (MouseInput.mouseDown){
    let startingPosition = Selector.eventToTileCoord(MouseInput.mouseDown, cameraPosition, scale);
    let currentPosition = Selector.eventToTileCoord(MouseInput.mouseMove, cameraPosition, scale);

    let pos = Vec2.min(startingPosition, currentPosition);
    let size = startingPosition.subtract(currentPosition).abs().addScalar(1);
    selector = {position: pos, size: size};

  }

  if (MouseInput.clickAction){
    selector = null;

    let {up, down} = MouseInput.clickAction;
    let startingPosition = Selector.eventToTileCoord(down, cameraPosition, scale);
    let endPosition = Selector.eventToTileCoord(up, cameraPosition, scale);

    let pos = Vec2.min(startingPosition, endPosition);
    let size = startingPosition.subtract(endPosition).abs().addScalar(1);
    console.log(pos, size);
    for (let y = pos.y; y < pos.y + size.y; y += 1){
      for (let x = pos.x; x < pos.x + size.x; x += 1){
        world[x + y * 32].filled = true;
        world[x + y * 32].block = 20;
      }
    }
    
    //world[currentPosition[0] + currentPosition[1] * 32].filled = true;
    //world[currentPosition[0] + currentPosition[1] * 32].block = 20;
  }


  Grid.render(64, cameraPosition);
  world.forEach(function(tile){
    if (tile.filled){
      Tile.render([tile.x, tile.y], tile.block, cameraPosition);
    }
  });
  if (selector){
    Selector.render(selector.position.toArray(), selector.size.toArray(), cameraPosition);
  }
  MouseInput.clickAction = null;
  requestAnimationFrame(render);
}
