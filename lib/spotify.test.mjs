import test from 'node:test';
import assert from 'node:assert/strict';
import { createSpotifyReader } from './spotify.mjs';
const env = { SPOTIFY_CLIENT_ID: 'id', SPOTIFY_CLIENT_SECRET: 'secret', SPOTIFY_REFRESH_TOKEN: 'refresh' };
const track = { type: 'track', name: 'Song', artists: [{ name: 'Artist' }], album: { name: 'Album', images: [{ url: 'https://i.scdn.co/art' }] }, external_urls: { spotify: 'https://open.spotify.com/track/test' } };
const json = (data, status = 200) => new Response(JSON.stringify(data), { status });
test('missing configuration does not call Spotify', async () => {
 const read = createSpotifyReader({ env: {}, request: () => { throw Error('Unexpected request'); } });
 assert.deepEqual(await read(), { status: 'unconfigured' });
});
test('playing metadata is sanitized, cached, and concurrent requests are deduplicated', async () => {
 let count = 0;
 const read = createSpotifyReader({ env, request: async () => ++count === 1 ? json({ access_token: 'private', expires_in: 3600 }) : json({ is_playing: true, item: track, device: { name: 'private device' } }) });
 const values = await Promise.all([read(), read(), read()]);
 assert.equal(count, 3); assert.equal(values[0].status, 'playing');
 assert.equal(values[0].title, 'Song'); assert.ok(!JSON.stringify(values).includes('private'));
 await read(); assert.equal(count, 3);
});
test('no current playback falls back to recent tracks', async () => {
 const calls = [];
 const read = createSpotifyReader({ env, request: async url => { calls.push(url); return calls.length === 1 ? json({ access_token: 'token' }) : calls.length === 2 ? new Response(null, { status: 204 }) : json({ items: [{ track }] }); } });
 assert.equal((await read()).status, 'recent'); assert.match(calls[2], /recently-played/);
});
test('empty history shows idle', async () => {
 let count = 0;
 const read = createSpotifyReader({ env, request: async () => ++count === 1 ? json({ access_token: 'token' }) : count === 2 ? new Response(null, { status: 204 }) : json({ items: [] }) });
 assert.deepEqual(await read(), { status: 'idle', recentTracks: [], historyAvailable: true });
});
test('authorization failures do not expose upstream details', async () => {
 const read = createSpotifyReader({ env, request: async () => json({ secret: 'sensitive' }, 401) });
 assert.deepEqual(await read(), { status: 'unavailable', reason: 'authorization_failed' });
});
test('rate limits respect Retry-After and tokens are reused', async () => {
 let time = 0, calls = 0;
 const read = createSpotifyReader({ env, clock: () => time, request: async () => ++calls === 1 ? json({ access_token: 'token', expires_in: 3600 }) : calls === 2 ? new Response(null, { status: 429, headers: { 'retry-after': '120' } }) : json({ is_playing: true, item: track }) });
 assert.equal((await read()).status, 'unavailable'); time = 60000; await read(); assert.equal(calls, 2);
 time = 121000; assert.equal((await read()).status, 'playing'); assert.equal(calls, 4);
});

test('recent history preserves listening order and repeats, and strips private metadata', async () => {
 let count = 0;
 const history = [{ track, played_at: '2026-10-24T08:00:00Z', context: { private: true } }, { track, played_at: '2026-10-24T07:00:00Z' }];
 const read = createSpotifyReader({ env, request: async () => ++count === 1 ? json({ access_token: 'token' }) : count === 2 ? json({ is_playing: true, item: track }) : json({ items: history }) });
 const data = await read();
 assert.equal(data.recentTracks.length, 2);
 assert.equal(data.recentTracks[0].playedAt, history[0].played_at);
 assert.equal(data.recentTracks[1].playedAt, history[1].played_at);
 assert.ok(!JSON.stringify(data).includes('private'));
});
test('history failure retains a currently playing song', async () => {
 let count = 0;
 const read = createSpotifyReader({ env, request: async () => ++count === 1 ? json({ access_token: 'token' }) : count === 2 ? json({ is_playing: true, item: track }) : json({}, 403) });
 const data = await read();
 assert.equal(data.status, 'playing'); assert.equal(data.historyAvailable, false); assert.deepEqual(data.recentTracks, []);
});
test('history requests and exposes only the four most recent entries', async () => {
 let count = 0;
 const read = createSpotifyReader({ env, request: async url => {
   count++;
   if (count === 1) return json({ access_token: 'token' });
   if (count === 2) return new Response(null, { status: 204 });
   assert.match(url, /recently-played\?limit=4$/);
   return json({ items: Array.from({ length: 7 }, (_, index) => ({ track: { ...track, name: `Song ${index}` }, played_at: `entry-${index}` })) });
 } });
 const data = await read();
 assert.equal(data.recentTracks.length, 4);
 assert.deepEqual(data.recentTracks.map(item => item.title), ['Song 0', 'Song 1', 'Song 2', 'Song 3']);
});

test('invalid refresh tokens produce a safe actionable reason', async () => {
 const read = createSpotifyReader({env, request: async () => json({error:'invalid_grant',error_description:'sensitive upstream details'},400)});
 assert.deepEqual(await read(), {status:'unavailable',reason:'invalid_refresh_token'});
});
test('history still displays when currently-playing is denied', async () => {
 let calls=0;
 const read=createSpotifyReader({env,request:async()=>++calls===1?json({access_token:'token'}):calls===2?json({},403):json({items:[{track}]})});
 const data=await read(); assert.equal(data.status,'recent'); assert.equal(data.recentTracks.length,1);
});
test('invalid clients produce a safe actionable reason', async () => {
 const read=createSpotifyReader({env,request:async()=>json({error:'invalid_client'},401)});
 assert.deepEqual(await read(),{status:'unavailable',reason:'invalid_client'});
});
