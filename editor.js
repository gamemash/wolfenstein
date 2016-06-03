let Renderer = require('./src/renderer.js');
let ShaderLoader = require('./src/shader_loader.js');
let TextureLoader = require('./src/texture_loader.js');
let Tile = require('./src/tile.js');
let Grid = require('./src/grid.js');
let Selector = require('./src/selector.js');
let levelData = require('./src/level_data');
let KeyInput = require('./src/key_input.js');
let MouseInput = require('./src/mouse_input.js');

let canvas = document.getElementById('game-canvas');
MouseInput.registerOnCanvas(canvas);
let aspects = [768, 512];
Renderer.setup(canvas, aspects);

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
    let startingPosition = [
      Math.floor(MouseInput.mouseDown.offsetX / scale + cameraPosition[0]),
      Math.floor((aspects[1] - MouseInput.mouseDown.offsetY) / scale + cameraPosition[1])];
    let currentPosition = [
      Math.floor(MouseInput.mouseMove.offsetX / scale + cameraPosition[0]),
      Math.floor((aspects[1] - MouseInput.mouseMove.offsetY) / scale + cameraPosition[1])];

    let pos = [
      Math.min(startingPosition[0], currentPosition[0]),
      Math.min(startingPosition[1], currentPosition[1])];
    let size = [
      Math.abs(startingPosition[0] - currentPosition[0]) + 1,
      Math.abs(startingPosition[1] - currentPosition[1]) + 1];
      
    selector = {position: pos, size: size};

    //console.log(currentPosition);
    //console.log(currentPosition[0] - mouseDownPosition[0], currentPosition[1] - mouseDownPosition[1]);
  }

  if (MouseInput.clickAction){
    let {up, down} = MouseInput.clickAction;
    let startingPosition = [
      Math.floor(down.offsetX / scale + cameraPosition[0]),
      Math.floor((aspects[1] - down.offsetY) / scale + cameraPosition[1])];
    let endPosition = [
      Math.floor(up.offsetX / scale + cameraPosition[0]),
      Math.floor((aspects[1] - up.offsetY) / scale + cameraPosition[1])];
    let pos = [
      Math.min(startingPosition[0], endPosition[0]),
      Math.min(startingPosition[1], endPosition[1])];
    let size = [
      Math.abs(startingPosition[0] - endPosition[0]) + 1,
      Math.abs(startingPosition[1] - endPosition[1]) + 1];
    selector = null;
    
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
    Selector.render(selector.position, selector.size, cameraPosition);
  }
  MouseInput.clickAction = null;
  requestAnimationFrame(render);
}
