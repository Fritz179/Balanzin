attribute vec3 a_Destination;
attribute vec2 a_Source;
attribute vec4 a_Color;

uniform mat4 u_MVP;
uniform vec2 u_Offset;

varying vec4 v_Color;
varying vec2 v_Source;

void main() {
  v_Color = a_Color;
  v_Source = a_Source;
  gl_Position = vec4(a_Destination + vec3(u_Offset, 0), 1.0) * u_MVP;
}
