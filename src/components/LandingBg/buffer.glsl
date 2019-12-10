precision highp float;
uniform vec3 iMouse;
uniform vec3 iResolution;
uniform float iTime;
uniform bool start;
uniform bool reset;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
varying vec2 vUv;

#define _G0 0.25
#define _G1 0.125
#define _G2 0.0625
#define W0 18.0
#define W1 0.5
#define TIMESTEP 0.18
// #define ADVECT_DIST 2.0
#define ADVECT_DIST 4.0
#define DV 0.80710678

// nonlinearity
float nl(float x) {
    return 1.0 / (1.0 + exp(W0 * (W1 * x - 0.5))); 
}

vec4 gaussian(vec4 x, vec4 x_nw, vec4 x_n, vec4 x_ne, vec4 x_w, vec4 x_e, vec4 x_sw, vec4 x_s, vec4 x_se) {
    return _G0*x + _G1*(x_n + x_e + x_w + x_s) + _G2*(x_nw + x_sw + x_ne + x_se);
}

vec2 normz(vec2 x) {
	return x == vec2(0.0, 0.0) ? vec2(0.0, 0.0) : normalize(x);
}

vec4 advect(vec2 ab, vec2 vUv, vec2 step) {
    
    vec2 aUv = vUv - ab * ADVECT_DIST * step;
    
    vec2 n  = vec2(0.0, step.y);
    vec2 ne = vec2(step.x, step.y);
    vec2 e  = vec2(step.x, 0.0);
    vec2 se = vec2(step.x, -step.y);
    vec2 s  = vec2(0.0, -step.y);
    vec2 sw = vec2(-step.x, -step.y);
    vec2 w  = vec2(-step.x, 0.0);
    vec2 nw = vec2(-step.x, step.y);

    vec4 u =    texture2D(iChannel0, fract(aUv));
    vec4 u_n =  texture2D(iChannel0, fract(aUv+n));
    vec4 u_e =  texture2D(iChannel0, fract(aUv+e));
    vec4 u_s =  texture2D(iChannel0, fract(aUv+s));
    vec4 u_w =  texture2D(iChannel0, fract(aUv+w));
    vec4 u_nw = texture2D(iChannel0, fract(aUv+nw));
    vec4 u_sw = texture2D(iChannel0, fract(aUv+sw));
    vec4 u_ne = texture2D(iChannel0, fract(aUv+ne));
    vec4 u_se = texture2D(iChannel0, fract(aUv+se));
    
    return gaussian(u, u_nw, u_n, u_ne, u_w, u_e, u_sw, u_s, u_se);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 texel = 1. / iResolution.xy;
    
    vec2 n  = vec2(0.0, 1.0);
    vec2 ne = vec2(1.0, 1.0);
    vec2 e  = vec2(1.0, 0.0);
    vec2 se = vec2(1.0, -1.0);
    vec2 s  = vec2(0.0, -1.0);
    vec2 sw = vec2(-1.0, -1.0);
    vec2 w  = vec2(-1.0, 0.0);
    vec2 nw = vec2(-1.0, 1.0);

    vec4 u =    texture2D(iChannel0, fract(vUv));
    vec4 u_n =  texture2D(iChannel0, fract(vUv+texel*n));
    vec4 u_e =  texture2D(iChannel0, fract(vUv+texel*e));
    vec4 u_s =  texture2D(iChannel0, fract(vUv+texel*s));
    vec4 u_w =  texture2D(iChannel0, fract(vUv+texel*w));
    vec4 u_nw = texture2D(iChannel0, fract(vUv+texel*nw));
    vec4 u_sw = texture2D(iChannel0, fract(vUv+texel*sw));
    vec4 u_ne = texture2D(iChannel0, fract(vUv+texel*ne));
    vec4 u_se = texture2D(iChannel0, fract(vUv+texel*se));

    float di_n  = nl(distance(u_n.xy + n, u.xy));
    float di_w  = nl(distance(u_w.xy + w, u.xy));
    float di_e  = nl(distance(u_e.xy + e, u.xy));
    float di_s  = nl(distance(u_s.xy + s, u.xy));
    
    float di_ne  = nl(DV * distance(u_ne.xy + ne, u.xy));
    float di_se  = nl(DV * distance(u_se.xy + se, u.xy));
    float di_sw  = nl(DV * distance(u_sw.xy + sw, u.xy));
    float di_nw  = nl(DV * distance(u_nw.xy + nw, u.xy));

    vec2 xy_n  = u_n.xy + n - u.xy;
    vec2 xy_w  = u_w.xy + w - u.xy;
    vec2 xy_e  = u_e.xy + e - u.xy;
    vec2 xy_s  = u_s.xy + s - u.xy;
    
    vec2 xy_ne  = DV * (u_ne.xy + ne - u.xy);
    vec2 xy_se  = DV * (u_se.xy + se - u.xy);
    vec2 xy_sw  = DV * (u_sw.xy + sw - u.xy);
    vec2 xy_nw  = DV * (u_nw.xy + nw - u.xy);

    vec2 ma = di_ne * xy_ne + di_se * xy_se + di_sw * xy_sw + di_nw * xy_nw + di_n * xy_n + di_w * xy_w + di_e * xy_e + di_s * xy_s;

    vec4 u_blur = gaussian(u, u_nw, u_n, u_ne, u_w, u_e, u_sw, u_s, u_se);
    
    vec4 auv = advect(u.xy, vUv, texel);
    
    // main update rule. there are lots of possible variations one could try here,
    // using either the advected, blurred, or original values.
    vec2 dv = auv.zw + TIMESTEP * ma;
    vec2 du = u_blur.xy + TIMESTEP * dv;

    if (start == true) {
    	vec2 d = fragCoord - iMouse.xy;
        float m = exp(-length(d) / 30.0);
        du.xy += m * normz(d);
        // du.xy += m;
    }
    
    vec3 init = texture2D(iChannel1, vUv).xyz;
    // initialize with noise
    if((u == vec4(0.0) && init != vec3(0.0)) || reset == true) {
        fragColor = vec4(-0.5 + init.xy, 0.0, 0.0);
    } else {
        du = length(du) > 1.0 ? normz(du) : du;
        fragColor = vec4(du, dv);
    }
}

void main(){
  mainImage(gl_FragColor,gl_FragCoord.xy);
}
