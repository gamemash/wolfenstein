precision mediump float;

uniform int gridSize;
uniform vec2 screenSize;
uniform vec2 cameraPosition;
uniform vec2 size;

varying vec2 absoluteCoordinate;

void main(){
  float borderThinkness = 5.0;
  vec2 pixelCoordinate = absoluteCoordinate;
  if (pixelCoordinate.x < borderThinkness ||
    pixelCoordinate.y < borderThinkness ||
    pixelCoordinate.x > size.x * 64.0 - borderThinkness ||
    pixelCoordinate.y > size.y * 64.0 - borderThinkness){
    gl_FragColor = vec4(0.8, 0.8, 0.1, 1);
  } else
    discard;
}

