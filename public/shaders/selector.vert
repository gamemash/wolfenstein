precision mediump float;

attribute vec2 vertexPosition;
uniform vec2 size;
uniform vec2 screenSize;
uniform vec2 position;
uniform mediump vec2 cameraPosition;
varying mediump vec2 absoluteCoordinate;

void main(){
  vec2 tileSize = vec2(64);//vec2(32);

  gl_Position = vec4((vertexPosition * size + position - cameraPosition) / screenSize * tileSize - vec2(1.0) , 0, 1);
  absoluteCoordinate = vertexPosition * size * tileSize;
}

