precision mediump float;
uniform int gridSize;

varying vec2 absoluteCoordinate;

void main(){
  if (gl_FragColor.w > 0.0) {
    discard;
  } else {
    vec2 gridCoordinate = floor(absoluteCoordinate / vec2(gridSize));
    if (abs(gridCoordinate.x * float(gridSize) - absoluteCoordinate.x) < 2.0){
      gl_FragColor = vec4(1);
      return;
    }

    if (abs(gridCoordinate.y * float(gridSize) - absoluteCoordinate.y) < 2.0){
      gl_FragColor = vec4(1);
      return;
    }
  }
  gl_FragColor = vec4(0, 0, 0, 1);
}

