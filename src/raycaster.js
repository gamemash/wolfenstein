let ShaderHelper = require('./shader_helper.js');
let Renderer = require('./renderer.js');
let TextureLoader = require('./texture_loader.js');

module.exports = {
  setup: function(){
    let gl = Renderer.gl;
    this.buffers = ShaderHelper.initBuffers();
    this.program = ShaderHelper.initShaders("raycast");
    gl.useProgram(this.program);
    gl.uniform2fv(gl.getUniformLocation(this.program, "screenSize"), [gl.drawingBufferWidth, gl.drawingBufferHeight]);
    this.texture = TextureLoader.get("7.GIF");
    this.vertexPositionAttribute = gl.getAttribLocation(this.program, "vertexPosition");
  },
  render: function(position){
    let gl = Renderer.gl;
    gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers);
    gl.vertexAttribPointer(this.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

    let positionUniformLocation = gl.getUniformLocation(this.program, "blockPosition");
    gl.uniform3fv(positionUniformLocation, position);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(gl.getUniformLocation(this.program, "testTexture"), 0);

    //gl.uniform2fv(
    //    gl.getUniformLocation(Tile.program, "blockAspects"),
    //    blockAspects);
    //
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  },
  findDistance: function(pos, ray, world, distance){
    if (!distance) distance = 0;
    let width = height = 10;
    if (parseInt(pos.x) < 0 || parseInt(pos.x) > width || parseInt(pos.y) < 0 || parseInt(pos.y) > height){
      return distance;
    }
    let tile = world[parseInt(pos.x) + parseInt(pos.y) * height];
    console.log(tile);
    if (tile && tile.filled){
      return distance;
    }

    let addedDistance = 0;
    if (ray.x == 0){
      addedDistance = (1- (pos.y % 1))/ray.y;;
    } else if (ray.y == 0){
      addedDistance = (1- (pos.x % 1))/ray.x;
    } else {
      d_x = (1 - (pos.x % 1)) / ray.x;
      d_y = (1 - (pos.y % 1)) / ray.y;
      addedDistance = Math.min(d_x, d_y);
    }

    pos.x += addedDistance * ray.x;
    pos.y += addedDistance * ray.y;
    distance += addedDistance;
    return this.findDistance(pos, ray, world, distance);
  }
};

