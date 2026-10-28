import test from 'node:test';
import assert from 'node:assert/strict';
import {createStravaReader,summarizeRunning} from './strava.mjs';
const env={STRAVA_CLIENT_ID:'id',STRAVA_CLIENT_SECRET:'secret',STRAVA_REFRESH_TOKEN:'refresh',STRAVA_ATHLETE_ID:'123',STRAVA_PUBLIC_STATS_ENABLED:'true'};
const stats={recent_run_totals:{count:4,distance:19500,moving_time:7620,elevation_gain:36},recent_ride_totals:{count:99,distance:999999}};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status});
function storage(){const data=new Map();return {data,get:async k=>data.get(k),set:async(k,v)=>data.set(k,v),lock:async()=>true,unlock:async()=>{}};}
test('uses running totals only and converts distance',()=>{const s=summarizeRunning(stats,0);assert.equal(s.activities,4);assert.equal(s.distanceKm,19.5);assert.equal(s.movingSeconds,7620);});
test('rejects missing and invalid totals, permits zeros',()=>{assert.throws(()=>summarizeRunning({}));assert.throws(()=>summarizeRunning({recent_run_totals:{...stats.recent_run_totals,distance:-1}}));assert.equal(summarizeRunning({recent_run_totals:{count:0,distance:0,moving_time:0,elevation_gain:0}}).activities,0);});
test('does not access upstream while disabled or unconfigured',async()=>{const request=()=>{throw Error('Unexpected request');};assert.deepEqual(await createStravaReader({env:{},store:null,request})(),{status:'disabled'});assert.deepEqual(await createStravaReader({env,store:null,request})(),{status:'unconfigured'});});
test('persists rotating tokens, caches stats and deduplicates concurrent requests',async()=>{
 const store=storage();let calls=0;
 const read=createStravaReader({env,store,clock:()=>0,request:async()=>++calls===1?json({access_token:'access',refresh_token:'rotated',expires_at:3600}):json(stats)});
 const [a,b]=await Promise.all([read(),read()]);assert.deepEqual(a,b);assert.equal(calls,2);assert.equal(store.data.get('portfolio:strava:token').refresh_token,'rotated');await read();assert.equal(calls,2);assert.ok(!JSON.stringify(a).includes('access'));assert.ok(!JSON.stringify(a).includes('rotated'));
});
test('retries once after 401 and releases refresh locks',async()=>{
 const store=storage();store.data.set('portfolio:strava:token',{access_token:'old',refresh_token:'r',expires_at:3600});let calls=0,unlocks=0;store.unlock=async()=>{unlocks++;};
 const read=createStravaReader({env,store,clock:()=>0,request:async()=>++calls===1?json({},401):calls===2?json({access_token:'new',refresh_token:'rotated',expires_at:3600}):json(stats)});
 assert.equal((await read()).status,'ready');assert.equal(calls,3);assert.equal(unlocks,1);
});
test('returns a safe failure without exposing upstream error bodies',async()=>{
 const store=storage();const read=createStravaReader({env,store,request:async()=>json({message:'private'},400)});
 assert.deepEqual(await read(),{status:'unavailable',reason:'authorization_failed'});
});
test('waits for an in-progress refresh rather than rotating twice',async()=>{
 const store=storage();store.lock=async()=>false;let calls=0;
 const read=createStravaReader({env,store,clock:()=>0,wait:async()=>{store.data.set('portfolio:strava:token',{access_token:'new',refresh_token:'r',expires_at:3600});},request:async()=>{calls++;return json(stats);}});
 assert.equal((await read()).status,'ready');assert.equal(calls,1);
});

test('shares rate-limit cooldown between instances and retries after expiry', async () => {
 const store=storage(); let now=0, calls=0;
 store.data.set('portfolio:strava:token',{access_token:'a',refresh_token:'r',expires_at:3600});
 const request=async()=>{ calls++; return calls===1 ? new Response('{}',{status:429,headers:{'Retry-After':'1200'}}) : json(stats); };
 const options={env,store,clock:()=>now,request};
 const first=createStravaReader(options);
 assert.equal((await first()).reason,'rate_limited');
 await first(); await createStravaReader(options)(); assert.equal(calls,1);
 now=1200001;
 assert.equal((await createStravaReader(options)()).status,'ready'); assert.equal(calls,2);
});

test('preserves the last summary across a failed refresh and cooldown', async () => {
 const store=storage(); let now=0, calls=0;
 store.data.set('portfolio:strava:token',{access_token:'a',refresh_token:'r',expires_at:3600});
 const options={env,store,clock:()=>now,request:async()=>++calls===1?json(stats):json({},503)};
 const first=createStravaReader(options);
 const saved=await first(); now=900001;
 assert.deepEqual(await first(),saved);
 assert.deepEqual(await createStravaReader(options)(),saved); assert.equal(calls,2);
});

test('does not display stale totals after authorization is denied', async () => {
 const store=storage(); let now=0, calls=0;
 store.data.set('portfolio:strava:token',{access_token:'a',refresh_token:'r',expires_at:3600});
 const read=createStravaReader({env,store,clock:()=>now,request:async()=>++calls===1?json(stats):json({},403)});
 await read(); now=900001;
 assert.deepEqual(await read(),{status:'unavailable',reason:'access_denied'});
 assert.deepEqual(await read(),{status:'unavailable',reason:'access_denied'});
 assert.equal(calls,2);
});
