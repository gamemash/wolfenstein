attribute vec2 vertexPosition;

uniform mediump vec2 screenSize;
varying mediump vec2 absoluteCoordinate;

void main(){
  gl_Position = vec4(vertexPosition * vec2(2) - vec2(1), 0, 1);
  absoluteCoordinate = vertexPosition * vec2(2) * screenSize;
}

