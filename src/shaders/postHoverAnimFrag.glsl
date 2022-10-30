uniform sampler2D uTexture;
uniform float uAlpha;

varying vec2 vUv;

vec2 scaleUV(vec2 uv,float scale) {
    float center = 0.5;
    return ((uv - center) * scale) + center;
}

void main() {
    vec3 color = texture2D(uTexture,scaleUV(vUv,1.0)).rgb;
    gl_FragColor = vec4(color,uAlpha);
}