import { randomUUID } from 'node:crypto';

const TOKEN_KEY = 'portfolio:strava:token';
const SUMMARY_KEY = 'portfolio:strava:running';
const LOCK_KEY = 'portfolio:strava:refresh-lock';
export function createStravaStore(env = process.env, request = fetch) {
  const url = env.UPSTASH_REDIS_REST_URL?.trim();
  const secret = env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !secret || !url.startsWith('https://')) return null;
  async function command(...args) {
    const response = await request(url, { method: 'POST', headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' }, body: JSON.stringify(args), signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('Storage unavailable');
    const data = await response.json();
    if (data.error) throw new Error('Storage unavailable');
    return data.result;
  }
  return {
    get: async key => { const value = await command('GET', key); return value ? JSON.parse(value) : null; },
    set: (key, value, ttl) => command('SET', key, JSON.stringify(value), ...(ttl ? ['EX', ttl] : [])),
    lock: (value) => command('SET', LOCK_KEY, value, 'NX', 'EX', 30),
    unlock: value => command('EVAL', "if redis.call('get',KEYS[1]) == ARGV[1] then return redis.call('del',KEYS[1]) else return 0 end", 1, LOCK_KEY, value),
  };
}
export function summarizeRunning(stats, now = Date.now()) {
  const totals = stats?.recent_run_totals;
  if (!totals || !['count','distance','moving_time','elevation_gain'].every(key => Number.isFinite(totals[key]) && totals[key] >= 0)) throw new Error('Invalid running totals');
  return { status: 'ready', activities: totals.count, distanceKm: totals.distance / 1000, movingSeconds: totals.moving_time, elevationM: totals.elevation_gain, updatedAt: new Date(now).toISOString() };
}
export function createStravaReader({ env = process.env, request = fetch, store = createStravaStore(env, request), clock = Date.now, wait = ms => new Promise(resolve => setTimeout(resolve, ms)) } = {}) {
  let pending;
  const fail = reason => Object.assign(new Error('Strava unavailable'), { reason });
  async function token(force = false, rejectedToken) {
    const stored = await store.get(TOKEN_KEY);
    if (stored && stored.expires_at * 1000 > clock() + 60000 && (!force || stored.access_token !== rejectedToken)) return stored;
    const lockId = randomUUID();
    if (!await store.lock(lockId)) {
      for (let i = 0; i < 10; i++) {
        await wait(200);
        const latest = await store.get(TOKEN_KEY);
        if (latest && latest.expires_at * 1000 > clock() + 60000 && (!force || latest.access_token !== rejectedToken)) return latest;
      }
      throw fail('refresh_busy');
    }
    try {
      const latest = await store.get(TOKEN_KEY);
      if (latest && latest.expires_at * 1000 > clock() + 60000 && (!force || latest.access_token !== rejectedToken)) return latest;
      const response = await request('https://www.strava.com/oauth/token', { method:'POST', body: new URLSearchParams({ client_id: env.STRAVA_CLIENT_ID.trim(), client_secret: env.STRAVA_CLIENT_SECRET.trim(), refresh_token: latest?.refresh_token || env.STRAVA_REFRESH_TOKEN.trim(), grant_type:'refresh_token' }), signal:AbortSignal.timeout(8000) });
      if (!response.ok) throw fail('authorization_failed');
      const data = await response.json();
      if (!data.access_token || !data.refresh_token || !Number.isFinite(data.expires_at)) throw fail('authorization_failed');
      const next = { access_token:data.access_token, refresh_token:data.refresh_token, expires_at:data.expires_at };
      await store.set(TOKEN_KEY, next);
      return next;
    } finally { await store.unlock(lockId); }
  }
  async function read() {
    if (env.STRAVA_PUBLIC_STATS_ENABLED !== 'true') return {status:'disabled'};
    if (!store || !['STRAVA_CLIENT_ID','STRAVA_CLIENT_SECRET','STRAVA_REFRESH_TOKEN','STRAVA_ATHLETE_ID'].every(key => env[key]?.trim())) return {status:'unconfigured'};
    if (!/^\d+$/.test(env.STRAVA_ATHLETE_ID.trim())) return {status:'unconfigured'};
    const cached = await store.get(SUMMARY_KEY);
    if (cached?.status === 'ready' && clock() - Date.parse(cached.updatedAt) < 900000) return cached;
    async function stats(accessToken) {
      return request(`https://www.strava.com/api/v3/athletes/${env.STRAVA_ATHLETE_ID.trim()}/stats`, {headers:{Authorization:`Bearer ${accessToken}`},signal:AbortSignal.timeout(8000)});
    }
    let credentials = await token();
    let response = await stats(credentials.access_token);
    if (response.status === 401) { credentials = await token(true, credentials.access_token); response = await stats(credentials.access_token); }
    if (!response.ok) throw fail(response.status === 429 ? 'rate_limited' : response.status === 403 ? 'access_denied' : 'strava_unavailable');
    const result = summarizeRunning(await response.json(), clock());
    await store.set(SUMMARY_KEY, result, 900);
    return result;
  }
  return () => {
    if (!pending) pending = read().catch(error => ({status:'unavailable',reason:error.reason || 'connection_failed'})).finally(() => { pending = null; });
    return pending;
  };
}
