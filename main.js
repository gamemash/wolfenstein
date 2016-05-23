let Renderer = require('./src/renderer.js');
let ShaderLoader = require('./src/shader_loader.js');
let Raycaster = require('./src/raycaster.js');


let canvas = document.getElementById('game-canvas');
Renderer.setup(canvas, [512, 384]);


let stuffToLoad = [
  ShaderLoader.load("raycast.vert"),
  ShaderLoader.load("raycast.frag")
]

Promise.all(stuffToLoad).then(function(){
  Raycaster.setup();
  render();
});


function render(){
  Renderer.clear();
  Raycaster.render();

  requestAnimationFrame(render);
}

