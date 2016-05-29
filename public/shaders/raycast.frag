precision mediump float;
uniform vec3 blockPosition;
uniform sampler2D testTexture;
uniform sampler2D worldDataTexture;
uniform vec2 playerPosition;

varying vec2 screenCoordinate;
varying vec2 relativeCoordinate;

void main(){
  vec3 lookDirection = normalize(vec3(0, 0, 1));
  vec3 origin = vec3(0, 0.5, 0) + vec3(playerPosition.x, 0, playerPosition.y);

  vec3 fovVector = cross(lookDirection, vec3(0, -1, 0));
  vec3 fovOffset = fovVector * vec3(relativeCoordinate.x / 2.0, 0, 0);
  fovOffset.y += relativeCoordinate.y / 2.0;
  vec3 ray = normalize(lookDirection + fovOffset);
  vec3 position = origin + fovOffset;



  for (int i = 0; i < 32; i++){
    if ( position.x < 0.0)
      discard;
    if ( position.y > 1.0 || position.y < 0.0)
      discard; //ceiling or floor

    ivec3 tilePosition = ivec3(position);

    vec4 tileData = texture2D(worldDataTexture, vec2(tilePosition.xz) / 32.0);
    if (tileData.z > 0.9/256.0){
      vec2 relativeToWallCoordinate = position.xy - floor(position.xy);
      relativeToWallCoordinate.y = 1.0 - relativeToWallCoordinate.y;
      //gl_FragColor = vec4(relativeToWallCoordinate, 0, 1);
      gl_FragColor = texture2D(testTexture, relativeToWallCoordinate);
      return;
    }
    float addedDistance = 0.0;
    if (ray.x == 0.0){
      addedDistance = (1.0 - mod(position.z,1.0)) / ray.z;
    } else if (ray.y == 0.0){
      addedDistance = (1.0 - mod(position.x,1.0)) / ray.x;
    } else {
      float d_x = (1.0 - mod(position.x,1.0)) / ray.x;
      float d_z = (1.0 - mod(position.z,1.0)) / ray.z;
      addedDistance = min(abs(d_x), abs(d_z));
    }
    position += ray * (addedDistance + 0.000001);
  }
  gl_FragColor = vec4(0, 0, 0, 1);
}
