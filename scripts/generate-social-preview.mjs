import { readFile, writeFile } from 'node:fs/promises';
import React from 'react';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const root = new URL('../', import.meta.url);
const h = React.createElement;
const ink = '#151515';
const tree = h('div', { style: { display:'flex',flexDirection:'column',width:'100%',height:'100%',background:'#e4ee8a',color:ink,padding:'45px 55px',fontFamily:'Inter' } },
  h('div', {style:{display:'flex',width:1090,alignItems:'center',justifyContent:'space-between',borderBottom:`2px solid ${ink}`,paddingBottom:22}},
    h('div',{style:{fontSize:40,fontWeight:900,letterSpacing:-3}},'AY'),
    h('div',{style:{fontSize:16,letterSpacing:2}},'FRONTEND ENGINEER / LAGOS, NG')),
  h('div',{style:{display:'flex',width:1090,flex:1,alignItems:'center',justifyContent:'space-between'}},
    h('div',{style:{display:'flex',flexDirection:'column',width:790}},
      h('div',{style:{fontSize:29,letterSpacing:-1,marginBottom:20}},'Abdussamad Yisau.'),
      h('div',{style:{fontSize:84,fontWeight:900,letterSpacing:-6,lineHeight:0.95}},'Building digital'),
      h('div',{style:{fontSize:84,fontWeight:900,letterSpacing:-6,lineHeight:0.95}},'things.')),
    h('div',{style:{display:'flex',alignItems:'center',justifyContent:'center',background:ink,color:'#e4ee8a',width:190,height:230,transform:'rotate(4deg)',boxShadow:'10px 10px 0 #6244e6'}},
      h('svg',{width:130,height:130,viewBox:'0 0 100 100',fill:'none'},h('path',{d:'M50 3v94M3 50h94M17 17l66 66M17 83l66-66',stroke:'#e4ee8a',strokeWidth:13})))),
  h('div',{style:{display:'flex',width:1090,justifyContent:'space-between',borderTop:`2px solid ${ink}`,paddingTop:19,fontSize:16,letterSpacing:1}},
    h('span',null,'CODE WITH INTENTION. BUILD WITH FEELING.'),h('span',null,'abdussamadyisau.xyz')));
const svg = await satori(tree, {width:1200,height:630,fonts:[
  {name:'Inter',data:await readFile(new URL('assets/Inter-Medium.ttf',root)),weight:500,style:'normal'},
  {name:'Inter',data:await readFile(new URL('assets/Inter-Black.ttf',root)),weight:900,style:'normal'},
]});
const png = new Resvg(svg).render().asPng();
await writeFile(new URL('public/social-preview.png',root),png);
console.log(`Generated social-preview.png (1200×630, ${png.length} bytes)`);
