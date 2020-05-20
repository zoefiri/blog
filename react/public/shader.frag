#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.002, pct, st.y*1.3)-
          smoothstep( pct, pct+0.002, st.y);
}

vec3 gradient(float offset){
  float alternator = abs(sin(u_time));
  float c1 = abs(sin(u_time));
  float c2 = abs(cos(u_time));
  float c3 = cos(u_time+1.0);
	return vec3(c1,c2,c3);
}

float graph(vec2 st, float offset){
  float y = 0.1*(sin(st.x*180.0 +u_time*9.0)/29.5)/(cos(9.0*st.x + 2.3*u_time)/1.05 + 0.99)/1.5;
  float added = (y + offset);
  return added;
}

vec3 multigraph(vec2 st){
  float y = 0.0;
  float pct = 0.0;
  vec3 color = vec3(0,0,0);
  vec3 color_return = vec3(0,0,0);
  for(float ypos = -0.1; ypos < 1.2; ypos+=0.319){
    y = graph(st, ypos);
    color = vec3(y);
    pct = plot(st,y);
    color = pct*gradient(ypos);
    color_return += color;
  }
  return color_return;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = multigraph(st);

    gl_FragColor = vec4(color,1.0);
}
