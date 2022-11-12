varying vec2 vUv;
uniform float uTime;

float PI = 3.1415926535897932384626433832795;

vec3 deformationCurve(vec3 position, vec2 uv, float time) {
    position.y = position.y + (sin(uv.x * PI) * time * 0.0003);
    return position;
}

void main() {
    vUv = vec2(uv.x, uv.y + (uTime * 0.0004));
    vec3 newPosition = position;
    newPosition = deformationCurve(position,uv,uTime);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}