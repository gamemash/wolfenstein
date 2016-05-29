precision mediump float;
uniform vec3 blockPosition;
uniform sampler2D testTexture;
uniform sampler2D worldDataTexture;

varying vec2 screenCoordinate;
varying vec2 relativeCoordinate;

bool inBlock(vec3 pointOfIntersection, vec3 blockPosition, float blockSize){
  return (pointOfIntersection.x > blockPosition.x &&
          pointOfIntersection.y > blockPosition.y &&
          pointOfIntersection.z > blockPosition.z &&
          pointOfIntersection.x < blockPosition.x + blockSize &&
          pointOfIntersection.y < blockPosition.y + blockSize &&
          pointOfIntersection.z < blockPosition.z + blockSize);
}

void main(){
  vec3 lookDirection = normalize(vec3(0, 0, 1));
  vec3 origin = vec3(1.5, 0, 0);

  vec3 fovVector = cross(lookDirection, vec3(0, -1, 0));
  vec3 fovOffset = fovVector * vec3(relativeCoordinate.x / 2.0, 0, 0);
  fovOffset.y += screenCoordinate.y;
  vec3 ray = normalize(lookDirection + fovOffset);
  vec3 position = origin + fovOffset;


  if ( position.x < 0.0)
    discard;
  if ( position.y > 1.0 || position.y < 0.0)
    discard; //ceiling or floor

  ivec3 tilePosition = ivec3(position);

  vec4 tileData = texture2D(worldDataTexture, vec2(tilePosition.xz) / 32.0);
  if (tileData.z < 0.9/256.0)
    discard;
  vec2 relativeToWallCoordinate = position.xy - floor(position.xy);
  relativeToWallCoordinate.y = 1.0 - relativeToWallCoordinate.y;
  gl_FragColor = texture2D(testTexture, relativeToWallCoordinate);
}
  //return;

  //for (int i = 0; i < 6; i++){
  //  vec3 blockNormal = vec3(0,0,1);
  //  vec3 faceOffset;
  //  if (i == 0){
  //    blockNormal = normalize(vec3(0,0,1));
  //  } else if (i == 1){
  //    blockNormal = normalize(vec3(0,1,0));
  //  } else if (i == 2) {
  //    blockNormal = normalize(vec3(1,0,0));
  //  } else if (i == 3) {
  //    blockNormal = normalize(vec3(0,0,1));
  //    faceOffset = vec3(0, 0, blockSize);
  //  } else if (i == 4) {
  //    blockNormal = normalize(vec3(0,1,0));
  //    faceOffset = vec3(0, blockSize, 0);
  //  } else if (i == 5) {
  //    blockNormal = normalize(vec3(1,0,0));
  //    faceOffset = vec3(blockSize, 0, 0);
  //  }

  //  float bottomHalf = 0.0;
  //  float topHalf = dot(blockPosition + faceOffset - position, blockNormal);
  //  float d = 0.0;
  //  vec3 result = vec3(0);
  //  vec3 pointOfIntersection = vec3(0);
  //  if (topHalf != 0.0){
  //    bottomHalf = dot(ray, blockNormal);
  //    d = topHalf/bottomHalf + 0.00001;
  //    pointOfIntersection = ray * d + position;
  //    if (inBlock(pointOfIntersection, blockPosition, blockSize)){
  //      result = (pointOfIntersection - blockPosition) / blockSize;

  //        gl_FragColor = texture2D(testTexture, result.xy);
  //        //gl_FragColor = texture2D(worldDataTexture, result.xy);
  //    }
  //  }
  //}
//}
