precision mediump float;
uniform vec3 blockPosition;

varying vec3 screenCoordinate;

bool inBlock(vec3 pointOfIntersection, vec3 blockPosition, float blockSize){
  return (pointOfIntersection.x > blockPosition.x &&
          pointOfIntersection.y > blockPosition.y &&
          pointOfIntersection.z > blockPosition.z &&
          pointOfIntersection.x < blockPosition.x + blockSize &&
          pointOfIntersection.y < blockPosition.y + blockSize &&
          pointOfIntersection.z < blockPosition.z + blockSize);
}

void main(){
  vec3 origin = vec3(0, 0, 0);
  vec3 ray = normalize(screenCoordinate - origin);
  vec3 position = vec3(screenCoordinate.xy, 0);
  float blockSize = 1.0;

  for (int i = 0; i < 6; i++){
    vec3 blockNormal = vec3(0,0,1);
    vec3 faceOffset;
    if (i == 0){
      blockNormal = normalize(vec3(0,0,1));
    } else if (i == 1){
      blockNormal = normalize(vec3(0,1,0));
    } else if (i == 2) {
      blockNormal = normalize(vec3(1,0,0));
    } else if (i == 3) {
      blockNormal = normalize(vec3(0,0,1));
      faceOffset = vec3(0, 0, blockSize);
    } else if (i == 4) {
      blockNormal = normalize(vec3(0,1,0));
      faceOffset = vec3(0, blockSize, 0);
    } else if (i == 5) {
      blockNormal = normalize(vec3(1,0,0));
      faceOffset = vec3(blockSize, 0, 0);
    }

    float bottomHalf = 0.0;
    float topHalf = dot(blockPosition + faceOffset - position, blockNormal);
    float d = 0.0;
    vec3 result = vec3(0);
    vec3 pointOfIntersection = vec3(0);
    if (topHalf != 0.0){
      bottomHalf = dot(ray, blockNormal);
      d = topHalf/bottomHalf + 0.00001;
      pointOfIntersection = ray * d + position;
      if (inBlock(pointOfIntersection, blockPosition, blockSize)){
        result = (pointOfIntersection - blockPosition) / blockSize;

        gl_FragColor = vec4(result, 1);
      }
    }
  }
}
