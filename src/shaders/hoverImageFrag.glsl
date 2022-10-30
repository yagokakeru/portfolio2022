uniform sampler2D uTexture;
uniform float uAlpha;
//uniform vec2 uOffset;

varying vec2 vUv;

vec2 scaleUV(vec2 uv,float scale) {
    float center = 0.5;
    return ((uv - center) * scale) + center;
}

/*vec3 rgbShift() {
    float r = texture2D(uTexture,vUv + uOffset).r;
    vec2 gb = texture2D(uTexture,vUv).gb;
    return vec3(r,gb);
}*/

void main() {
    vec3 color = texture2D(uTexture,scaleUV(vUv,1.0)).rgb;
    //vec3 color = rgbShift();
    gl_FragColor = vec4(color,uAlpha);
}