let ShaderLoader = require('./shader_loader.js');
let Renderer = require('./renderer.js');

let squareVerticesBuffer = null;
function initBuffers(){
  let gl = Renderer.gl;
  if (squareVerticesBuffer){
    return squareVerticesBuffer;
  }

  let vertices = [
     0.0,  0.0,
     1.0,  0.0,
     1.0,  1.0,
     0.0,  0.0,
     1.0,  1.0,
     0.0,  1.0
  ];

  squareVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  return squareVerticesBuffer;
}

let shaderPrograms = {};
function initShaders(shaderName) {
  let gl = Renderer.gl;
  if (shaderName in shaderPrograms){
    return shaderPrograms[shaderName];
  }

  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, ShaderLoader.get(shaderName + '.frag'));
  gl.compileShader(fragmentShader);

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {  
    console.log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(fragmentShader));  
  }
  
  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, ShaderLoader.get(shaderName + '.vert'));
  gl.compileShader(vertexShader);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {  
    console.log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(vertexShader));  
  }

  //// Create the shader program

  let shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.log("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
  }

  gl.useProgram(shaderProgram);

  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);

  shaderPrograms[shaderName] = shaderProgram;

  return shaderProgram;
}


module.exports = {
  initShaders: initShaders,
  initBuffers: initBuffers
};

