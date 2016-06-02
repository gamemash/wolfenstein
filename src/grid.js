let ShaderHelper = require('./shader_helper.js');
let Renderer = require('./renderer.js');
let TextureLoader = require('./texture_loader.js');

module.exports = {
  setup: function(){
    let gl = Renderer.gl;
    this.buffers = ShaderHelper.initBuffers();
    this.program = ShaderHelper.initShaders("grid");
    gl.useProgram(this.program);
    gl.uniform2fv(gl.getUniformLocation(this.program, "screenSize"), [gl.drawingBufferWidth, gl.drawingBufferHeight]);
    this.vertexPositionAttribute = gl.getAttribLocation(this.program, "vertexPosition");
  },
  render: function(gridSize, cameraPosition){
    let gl = Renderer.gl;
    gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers);
    gl.vertexAttribPointer(this.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2fv(gl.getUniformLocation(this.program, "cameraPosition"), cameraPosition);
    gl.uniform1i(gl.getUniformLocation(this.program, "gridSize"), gridSize);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  } 
};


