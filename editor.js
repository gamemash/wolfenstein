let Renderer = require('./src/renderer.js');
let ShaderLoader = require('./src/shader_loader.js');
let TextureLoader = require('./src/texture_loader.js');
let Tile = require('./src/tile.js');
let Grid = require('./src/grid.js');

let canvas = document.getElementById('game-canvas');
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


function render(){
  Renderer.clear();

  Grid.render(64);
  Tile.render([0,0]);
  requestAnimationFrame(render);
}
