uniform vec3 uColor;

varying float vElevation;

void main() {
    vec4 color = vec4( uColor, 1.0 );
    color.rgb *= vElevation * 0.1;
    gl_FragColor = color;
}