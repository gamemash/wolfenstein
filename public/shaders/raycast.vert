attribute vec2 vertexPosition;
uniform vec2 screenSize;

varying mediump vec3 screenCoordinate;


void main(){
  vec2 tileSize = vec2(8);
  gl_Position = vec4((vertexPosition * vec2(2) - vec2(1)), 0, 1);
  screenCoordinate = vec3(gl_Position.xy, 1);
}
