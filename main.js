let Renderer = require('./src/renderer.js');
let ShaderLoader = require('./src/shader_loader.js');
let Raycaster = require('./src/raycaster.js');


let canvas = document.getElementById('game-canvas');
let aspects = [512, 384];
Renderer.setup(canvas, aspects);

let stuffToLoad = [
  ShaderLoader.load("raycast.vert"),
  ShaderLoader.load("raycast.frag")
]

Promise.all(stuffToLoad).then(function(){
  Raycaster.setup();
  render();
});


let once = true;

let radius = 5;
let position = [0, 0, 5];
let angle = 0;
function render(){
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

