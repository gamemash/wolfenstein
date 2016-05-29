attribute vec2 vertexPosition;
uniform vec2 screenSize;

varying mediump vec2 screenCoordinate;
varying mediump vec2 relativeCoordinate;


void main(){
  vec2 tileSize = vec2(8);
  vec2 aspectfix = vec2(screenCoordinate.x / screenCoordinate.y, 1);

  gl_Position = vec4((vertexPosition * vec2(2) - vec2(1)), 0, 1);
  relativeCoordinate = vec2(gl_Position.xy) ;
  screenCoordinate = vec2(vertexPosition);
}
