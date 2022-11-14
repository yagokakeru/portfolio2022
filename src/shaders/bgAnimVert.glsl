uniform float uFrequency;
uniform float uTime;

varying float vElevation;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency + uTime * 0.3);
    elevation += sin(modelPosition.y * uFrequency + uTime * 0.3);

    modelPosition.z = elevation;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vElevation = elevation;
}