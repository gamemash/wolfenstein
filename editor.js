let Renderer = require('./src/renderer.js');
let ShaderLoader = require('./src/shader_loader.js');
let TextureLoader = require('./src/texture_loader.js');
let Tile = require('./src/tile.js');
let Grid = require('./src/grid.js');
let Selector = require('./src/selector.js');
let levelData = require('./src/level_data');
let KeyInput = require('./src/key_input.js');
let MouseInput = require('./src/mouse_input.js');
let Toolbar = require('./src/toolbar.js');
let Vec2 = require('./src/vector.js');
let Level = require('./src/level.js');
let exportToClipboard = require('./src/export_clipboard.js');

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
  ExportTool.setup(document.getElementById("toolbar"));
  Toolbar.setup("walls.png", new Vec2(6, 19));
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

let level = Level.import(levelData);
level.createTexture();
let world = level.data;

let ExportTool = {
  setup: function(container){
    let button = this.button = document.createElement('button');
    button.innerHTML = "Export";
    button.onclick = function(){
      //Level.import(Level.export(32, world));
      exportToClipboard(Level.export(32, world));
    }
    container.appendChild(button);
  }
}

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
    world = Toolbar.activeTool.use(world, MouseInput.clickAction, cameraPosition, scale);
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
