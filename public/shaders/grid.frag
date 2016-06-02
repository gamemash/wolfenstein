precision mediump float;

uniform int gridSize;
uniform vec2 screenSize;
uniform vec2 cameraPosition;

varying vec2 absoluteCoordinate;

void main(){
  float borderThinkness = 2.0;
  if (gl_FragColor.w > 0.0) {
    discard;
  } else {
    vec2 gridCoordinate = floor(absoluteCoordinate / vec2(gridSize) + cameraPosition);
    if (gridCoordinate.x < 0.0 || gridCoordinate.y < 0.0){
      gl_FragColor = vec4(0.3, 0.3, 0.3, 1);
      return;
    }
    if (abs((gridCoordinate.x - cameraPosition.x) * float(gridSize) - absoluteCoordinate.x) < borderThinkness){
      gl_FragColor = vec4(0.5);
      return;
    }

    if (abs((gridCoordinate.y - cameraPosition.y) * float(gridSize) - absoluteCoordinate.y) < borderThinkness){
      gl_FragColor = vec4(0.5);
      return;
    }
  }
  gl_FragColor = vec4(0, 0, 0, 1);
}

