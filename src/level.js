let Renderer = require('./renderer.js');

let Level = function(size, data){
  this.size = size;
  this.data = data;
}

Level.export = function(size, world){
  return JSON.stringify({
    size: size,
    data: world.map(function(tile){ return tile.block + 1; })
  });
}

Level.import = function(jsonString){
  let {size, data} = JSON.parse(jsonString);
  let world = data.map(function(f, k){
    let x = k % size;
    let y = Math.floor(k / size);
    return {x: x, y: y, filled: (f > 0), block: f - 1}
  });
  return new Level(size, world);
}

Object.assign(Level.prototype, {
  createTexture: function(){
    let width = height = this.size;
    let gl = Renderer.gl;
    let texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri ( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST ) ;
    gl.texParameteri ( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST ) ;
    gl.texParameteri ( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT ) ;
    gl.texParameteri ( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT ) ;
    gl.bindTexture(gl.TEXTURE_2D, null);

    this.texture = texture;
    this.updateTexture(this.data);

  },
  updateTexture: function(data){
    let gl = Renderer.gl;
    let width = height = this.size;
    let worldData = new Uint8Array(width * height * 4);
    let i = 0;
    data.forEach(function(tile){
      worldData[i]     = tile.x;
      worldData[i + 1] = tile.y;
      worldData[i + 2] = tile.filled;
      worldData[i + 3] = tile.block;
      i += 4;
    });

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, worldData);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
});

module.exports = Level;
