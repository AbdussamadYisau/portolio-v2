import { randomUUID } from 'node:crypto';

const TOKEN_KEY = 'portfolio:strava:token';
const SUMMARY_KEY = 'portfolio:strava:running';
const LOCK_KEY = 'portfolio:strava:refresh-lock';
const BACKOFF_KEY = 'portfolio:strava:backoff';
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
  let pending, lastSummary, localBackoff;
  const fail = reason => Object.assign(new Error('Strava unavailable'), { reason });
  const staleSummary = reason => !['authorization_failed', 'access_denied'].includes(reason)
    && lastSummary && clock() - Date.parse(lastSummary.updatedAt) < 86400000 ? lastSummary : null;
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
    if (cached?.status === 'ready') lastSummary = cached;
    if (cached?.status === 'ready' && clock() - Date.parse(cached.updatedAt) < 900000) return cached;
    const backoff = localBackoff?.until > clock() ? localBackoff : await store.get(BACKOFF_KEY);
    if (backoff?.until > clock()) return staleSummary(backoff.reason) || { status: 'unavailable', reason: backoff.reason };
    async function stats(accessToken) {
      return request(`https://www.strava.com/api/v3/athletes/${env.STRAVA_ATHLETE_ID.trim()}/stats`, {headers:{Authorization:`Bearer ${accessToken}`},signal:AbortSignal.timeout(8000)});
    }
    let credentials = await token();
    let response = await stats(credentials.access_token);
    if (response.status === 401) { credentials = await token(true, credentials.access_token); response = await stats(credentials.access_token); }
    if (!response.ok) {
      const error = fail(response.status === 429 ? 'rate_limited' : response.status === 403 ? 'access_denied' : 'strava_unavailable');
      const retryAfter = response.headers?.get('retry-after');
      const seconds = Number(retryAfter);
      error.retryMs = response.status === 429
        ? Math.max(900000, Number.isFinite(seconds) ? seconds * 1000 : Date.parse(retryAfter) - clock() || 0)
        : 60000;
      throw error;
    }
    const result = summarizeRunning(await response.json(), clock());
    await store.set(SUMMARY_KEY, result, 86400);
    lastSummary = result;
    return result;
  }
  return () => {
    if (!pending) pending = read().catch(async error => {
      const reason = error.reason || 'connection_failed';
      const delay = error.retryMs || 60000;
      localBackoff = { until: clock() + delay, reason };
      try { await store?.set(BACKOFF_KEY, localBackoff, Math.ceil(delay / 1000)); } catch {}
      return staleSummary(reason) || { status: 'unavailable', reason };
    }).finally(() => { pending = null; });
    return pending;
  };
}
