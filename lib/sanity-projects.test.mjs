import test from 'node:test';
import assert from 'node:assert/strict';
import {getProjects,PROJECTS_QUERY} from './sanity.mjs';
const env={NEXT_PUBLIC_SANITY_PROJECT_ID:'zro6hwxc',NEXT_PUBLIC_SANITY_DATASET:'production'};
const response=result=>new Response(JSON.stringify({result}));
test('unconfigured projects do not call upstream',async()=>{
 assert.deepEqual(await getProjects({env:{},request:()=>{throw Error('Unexpected request');}}),{status:'unconfigured',projects:[]});
});
test('maps project fields and rejects non-web links',async()=>{
 const data=await getProjects({env,request:async url=>{
  assert.equal(url.searchParams.get('perspective'),'published');
  return response([{_id:'pace',title:'Pace converter',url:'https://example.com',category:'Running tool',year:2026,description:'Convert pace'},
  {_id:'bad',title:'Bad',url:'javascript:alert(1)'},{_id:'blank',title:' ',url:'https://example.com'}]);
 }});
 assert.equal(data.projects.length,1);assert.equal(data.projects[0].name,'Pace converter');assert.equal(data.projects[0].year,'2026');assert.equal(data.projects[0].image,null);
});
test('optimizes screenshots with image alt and optional fields',async()=>{
 const data=await getProjects({env,request:async()=>response([{_id:'p',title:'Project',url:'https://example.com',image:{alt:'Screenshot',asset:{_id:'image-b4d64a851b48558c7af0b60fd489f71fa73e3f0a-3024x4032-jpg'}}}])});
 assert.match(data.projects[0].image,/w=800/);assert.match(data.projects[0].image,/h=600/);assert.equal(data.projects[0].imageAlt,'Screenshot');assert.equal(data.projects[0].year,'');
});
test('query excludes drafts and orders before projection',()=>{assert.match(PROJECTS_QUERY,/_type == "project"/);assert.match(PROJECTS_QUERY,/drafts/);assert.match(PROJECTS_QUERY,/order\(displayOrder asc/);});
test('handles empty projects and upstream errors distinctly',async()=>{
 assert.deepEqual(await getProjects({env,request:async()=>response([])}),{status:'ready',projects:[]});
 await assert.rejects(getProjects({env,request:async()=>new Response('',{status:500})}));
});

test('dedicated Selected Work project does not change photo project config',async()=>{
 const separate={...env,SANITY_WORK_PROJECT_ID:'ttil6cux',SANITY_WORK_DATASET:'production'};
 await getProjects({env:separate,request:async url=>{
   assert.equal(url.hostname,'ttil6cux.apicdn.sanity.io');
   assert.match(url.pathname,/production$/);
   return response([]);
 }});
 assert.equal(separate.NEXT_PUBLIC_SANITY_PROJECT_ID,'zro6hwxc');
});
test('dedicated work dataset defaults independently of photo dataset',async()=>{
 await getProjects({env:{...env,NEXT_PUBLIC_SANITY_DATASET:'photos',SANITY_WORK_PROJECT_ID:'ttil6cux'},request:async url=>{
  assert.match(url.pathname,/production$/);return response([]);
 }});
});
