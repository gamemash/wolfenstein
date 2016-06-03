let ShaderHelper = require('./shader_helper.js');
let Renderer = require('./renderer.js');
let TextureLoader = require('./texture_loader.js');
let Properties = require("./game_properties.js");
let Vec2 = require('./vector.js');

module.exports = {
  setup: function(){
    let gl = Renderer.gl;
    this.buffers = ShaderHelper.initBuffers();
    this.program = ShaderHelper.initShaders("selector");
    gl.useProgram(this.program);
    gl.uniform2fv(gl.getUniformLocation(this.program, "screenSize"), [gl.drawingBufferWidth, gl.drawingBufferHeight]);
    this.vertexPositionAttribute = gl.getAttribLocation(this.program, "vertexPosition");
  },
  render: function(position, size, cameraPosition){
    let gl = Renderer.gl;
    gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers);
    gl.vertexAttribPointer(this.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2fv(gl.getUniformLocation(this.program, "cameraPosition"), cameraPosition);
    gl.uniform2fv(gl.getUniformLocation(this.program, "position"), position);
    gl.uniform2fv(gl.getUniformLocation(this.program, "size"), size);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  },
  eventToTileCoord: function(event, cameraPosition, scale){
    return new Vec2(
        event.offsetX / scale + cameraPosition[0],
        (Properties.aspects[1] - event.offsetY) / scale + cameraPosition[1]
      ).floor();
  }
};


