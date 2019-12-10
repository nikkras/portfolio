precision highp float;
uniform vec4 iMouse;
uniform vec3 iResolution;
uniform float iTime;
uniform vec2 textureSize;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
varying vec2 vUv;

// Visualization of the system in Buffer A

// uncomment to just render the normals
// #define NORMAL

// light source rotation
#define TIME iTime*.3

// displacement
#define DISP.07

// contrast
#define SIGMOID_CONTRAST 5.6

// mip level
#define MIP 1.

vec4 contrast(vec4 x){
  return 1./(1.+exp(-SIGMOID_CONTRAST*(x-.5)));
}

vec3 blendOverlay(vec3 base,vec3 blend){
  return mix(1.-2.*(1.-base)*(1.-blend),2.*base*blend,step(base,vec3(.5)));
}

float rand(vec2 co){
  return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);
}

void mainImage(out vec4 fragColor,in vec2 fragCoord){
  vec2 texel=1./iResolution.xy;
  vec2 uv=fragCoord.xy/iResolution.xy;
  // vec2 uv=fragCoord;
  
  // aspect
  vec2 margin=vec2(0);
  vec2 Sres=iResolution.xy-2.*margin;
  vec2 Tres=textureSize.xy;
  vec2 ratio=Sres/Tres;
  
  // uv -= margin;
  
  // centering the blank part in case of rectangle fit
  // uv -= vec2(.5,1.)*Tres*max(vec2(ratio.x-ratio.y,ratio.y-ratio.x),0.);
  
  //fragCoord /= Tres*ratio.y;               // fit height, keep ratio
  //fragCoord /= Tres*ratio.x;               // fit width, keep ratio
  
  // uv /= Tres*min(ratio.x,ratio.y);  // fit rectangle,  keep ratio
  // uv *= 1.;                         // zoom out factor
  
  // fragColor = fract(uv)==uv
  //       ? texture2D(iChannel0, uv)
  //       : fragColor-fragColor;
  
  // vignetting
  float Falloff=iResolution.x>800.?.7:iResolution.x>400.?1.:2.;
  vec2 coord=(uv-.5)*(iResolution.x/iResolution.y)*2.;
  float rf=sqrt(dot(coord,coord))*Falloff;
  float rf2_1=rf*rf+1.;
  float e_v=1./(rf2_1*rf2_1);
  
  #ifdef NORMAL
  
  vec2 d=texture2D(iChannel1,uv).xy;
  vec3 nr=normalize(vec3(d.x,d.y,sqrt(clamp(1.-length(d.xy),0.,1.))));
  fragColor=vec4(nr,1.);
  
  #else
  vec2 n=vec2(0.,texel.y);
  vec2 e=vec2(texel.x,0.);
  vec2 s=vec2(0.,-texel.y);
  vec2 w=vec2(-texel.x,0.);
  
  vec2 d=texture2D(iChannel1,uv).xy;
  vec2 d_n=texture2D(iChannel1,fract(uv+n)).xy;
  vec2 d_e=texture2D(iChannel1,fract(uv+e)).xy;
  vec2 d_s=texture2D(iChannel1,fract(uv+s)).xy;
  vec2 d_w=texture2D(iChannel1,fract(uv+w)).xy;
  
  vec3 i=texture2D(iChannel0,fract(uv+DISP*d),MIP).xyz;
  vec3 i_n=texture2D(iChannel0,fract(uv+DISP*d_n),MIP).xyz;
  vec3 i_e=texture2D(iChannel0,fract(uv+DISP*d_e),MIP).xyz;
  vec3 i_s=texture2D(iChannel0,fract(uv+DISP*d_s),MIP).xyz;
  vec3 i_w=texture2D(iChannel0,fract(uv+DISP*d_w),MIP).xyz;
  
  vec3 ib=.4*i+.15*(i_n+i_e+i_s+i_w);
  
  vec3 nr=normalize(vec3(d.x,d.y,sqrt(clamp(1.-length(d.xy),0.,1.))));
  vec3 l=normalize(vec3(cos(TIME),sin(TIME),.1));
  // vec3 l=normalize(vec3(-0.3,0.9,.1));
  // l=mix(vec3(0.2),vec3(0.9),l);
  vec3 sh=pow(vec3(clamp(dot(nr,l),0.,1.)),vec3(5.));
  
  vec4 final=contrast(vec4(.9*ib+.6*sh,1.));
  final.rgb=blendOverlay(final.rgb,vec3(.5+rand(uv+iTime)*.3));
  // final.rgb=blendOverlay(final.rgb,pow(vec3(0.0235, 0.1647, 0.6275)*uv.y,vec3(2.)));
  
  // final.r/=abs(cos(iTime/22.)*.98);
  // final.g/=abs(cos(iTime/21.)*.91);
  // final.b/=abs(cos(iTime/24.)*.93);
  
  final.rgb*=e_v;
  // final*=pow(vec4(0.) * uv.y, vec4(1.2));
  final*=smoothstep(0.,.6,uv.y);
  // final*=smoothstep(1.,.7,uv.y);
  fragColor=final;
  #endif
}

void main(){
  mainImage(gl_FragColor,gl_FragCoord.xy);
}
