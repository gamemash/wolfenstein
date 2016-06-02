precision mediump float;
uniform int gridSize;

varying vec2 absoluteCoordinate;
uniform vec2 cameraPosition;

void main(){
  vec2 screenSize = vec2(512, 384);
  float borderThinkness = 2.0;
  if (gl_FragColor.w > 0.0) {
    discard;
  } else {
    vec2 gridCoordinate = floor(absoluteCoordinate / vec2(gridSize) + cameraPosition * screenSize / float(gridSize));
    if (gridCoordinate.x < 0.0 || gridCoordinate.y < 0.0){
      gl_FragColor = vec4(0.3, 0.3, 0.3, 1);
      return;
    }
    if (abs(gridCoordinate.x * float(gridSize) - cameraPosition.x * screenSize.x - absoluteCoordinate.x) < borderThinkness){
      gl_FragColor = vec4(0.5);
      return;
    }

    if (abs(gridCoordinate.y * float(gridSize) - cameraPosition.y * screenSize.y - absoluteCoordinate.y) < borderThinkness){
      gl_FragColor = vec4(0.5);
      return;
    }
  }
  gl_FragColor = vec4(0, 0, 0, 1);
}

