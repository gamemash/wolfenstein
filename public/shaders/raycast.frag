varying mediump vec3 screenCoordinate;

void main(){
  mediump vec3 origin = vec3(0);
  mediump vec3 ray = normalize(screenCoordinate - origin);
  mediump vec3 position = vec3(screenCoordinate.xy, 0);
  mediump float depth = 0.0;










  gl_FragColor = vec4(ray, 1);
}
