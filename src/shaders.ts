export const vertexShader = /* glsl */ `
precision mediump float;

varying vec2 vUv;

void main() {
  vUv = vec2(1. - uv.x, uv.y);

  vec3 pos = position + vec3(0, 0, uv.x);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;

export const fragmentShader = /* glsl */ `
precision mediump float;

uniform sampler2D uTexture;
uniform sampler2D uTexture2;
uniform float uT;
uniform bool uClear;
uniform float uLumaThreshold;
uniform vec3 uColor;

varying vec2 vUv;

float colorShiftVar(float x) {
  return -0.5 * sin(x) + 1.;
}

vec3 colorShift(vec3 color) {
  return uColor * colorShiftVar(color.x);
}

void main() {  
  vec2 uv2 = vec2(1. - vUv.x, vUv.y);

  // colors
  vec3 color1Base = texture2D(uTexture, vUv).xyz;
  vec3 color1 = colorShift(color1Base);
  vec3 color2 = texture2D(uTexture2, uv2).xyz;

  float ratio = 0.005;
  float drive = 1.3 + uLumaThreshold;
  vec4 color;

  if (uClear) {
    color = vec4(color1 * 0.9, 1);
  } else {
    color = vec4((color1 * (ratio * drive) + color2 * (1. - ratio)), 1);
  }

  // final paint
  if (color.x <= .9 && color.y <= .9 && color.z <= .9) {
    gl_FragColor = color;
  } else {
    gl_FragColor = vec4(color.xyz * 0.3 * fract(uT * 500.), 1);
  }
}`;
