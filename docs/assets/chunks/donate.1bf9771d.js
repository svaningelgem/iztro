import{_ as a,a as d}from"./wcpay.d0e1a780.js";import{_ as l,o as t,c as s,k as e,a as n,e as p,L as c}from"./framework.589369be.js";const m={name:"Donate",data(){return{show:!1}}},u={style:{padding:"10px","border-radius":"5px","text-align":"center","margin-top":"35px","border-style":"double","border-color":"var(--vp-custom-block-danger-border)","border-top":"1px dashed var(--vp-custom-block-danger-border)","border-bottom":"1px dashed var(--vp-custom-block-danger-border)"}},b=e("p",null,"点击关闭",-1),_=e("div",null,[e("img",{src:a,alt:"alipay",width:"300",style:{display:"inline-block","border-radius":"20px"}}),n("  "),e("img",{src:d,alt:"wechat pay",width:"300",style:{display:"inline-block","border-radius":"20px"}})],-1),x=[b,_];function f(y,o,h,k,r,g){return t(),s(c,null,[e("div",u,[n(" 码字不易，如果觉得文档对你有帮助，请考虑 "),e("a",{style:{cursor:"pointer"},onClick:o[0]||(o[0]=i=>r.show=!0)},"点击此处打赏站长")]),r.show?(t(),s("div",{key:0,onClick:o[1]||(o[1]=i=>r.show=!r.show),style:{position:"fixed",top:"0",left:"0",right:"0",bottom:"0","z-index":"99","backdrop-filter":"blur(10px)",display:"flex","align-items":"center","justify-content":"center","flex-direction":"column",cursor:"pointer"}},x)):p("",!0)],64)}const B=l(m,[["render",f]]);export{B as D};
