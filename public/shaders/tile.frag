precision mediump float;

uniform sampler2D wallsTexture;
varying vec2 relativeCoordinate;

void main(){
  vec2 wallsTextureFormat = vec2(6,19);
  float textureID = 4.0;
  vec2 textureCoordinate = vec2(mod(textureID, wallsTextureFormat.x),floor(textureID / wallsTextureFormat.x));
  gl_FragColor = texture2D(wallsTexture, (relativeCoordinate + textureCoordinate) / wallsTextureFormat);
}

