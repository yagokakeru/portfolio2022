uniform vec2 uFrequency;
uniform float uTime;
uniform float uSizeW;
uniform float uSizeH;

varying float vElevation;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x + uTime * 0.3) * uSizeW;
    elevation += sin(modelPosition.y * uFrequency.y + uTime * 0.3) * uSizeH;

    modelPosition.z = elevation;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vElevation = elevation;
}