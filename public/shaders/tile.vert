attribute vec2 vertexPosition;
uniform vec2 screenSize;
uniform vec2 position;
uniform vec2 cameraPosition;

varying mediump vec2 relativeCoordinate;

void main(){
  vec2 tileSize = vec2(64);//vec2(32);

  gl_Position = vec4((vertexPosition + position) / screenSize * tileSize - vec2(1.0) - cameraPosition, 0, 1);
  relativeCoordinate = vec2(vertexPosition.x, 1.0 - vertexPosition.y);
}

