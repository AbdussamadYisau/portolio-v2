const API = 'https://api.spotify.com/v1';
export function createSpotifyReader({ env = process.env, request = fetch, clock = Date.now } = {}) {
  let token, tokenUntil = 0, cache, cacheUntil = 0, pending;
  async function read() {
    const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = env;
    if (!id || !secret || !refresh) return { status: 'unconfigured' };
    if (!token || clock() >= tokenUntil) {
      const response = await request('https://accounts.spotify.com/api/token', {
        method: 'POST', headers: { Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }), signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error('Spotify authorization unavailable');
      const data = await response.json();
      if (!data.access_token) throw new Error('Missing access token');
      token = data.access_token;
      tokenUntil = clock() + Math.max(0, (Number(data.expires_in) || 3600) - 60) * 1000;
    }
    async function get(path) {
      const response = await request(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(8000) });
      if (response.status === 204) return null;
      if (!response.ok) {
        if (response.status === 401) tokenUntil = 0;
        if (response.status === 429) cacheUntil = clock() + Math.max(60, Number(response.headers.get('retry-after')) || 60) * 1000;
        throw new Error('Spotify temporarily unavailable');
      }
      return response.json();
    }
    const playing = await get('/me/player/currently-playing');
    let history = [], historyAvailable = true;
    try {
      const recent = await get('/me/player/recently-played?limit=4');
      history = (recent?.items || []).filter(item => item.track?.name).slice(0, 4);
    } catch {
      historyAvailable = false;
    }
    function display(track) {
      return { title: track.name, artist: track.artists?.map(a => a.name).join(', '), album: track.album?.name, image: track.album?.images?.[0]?.url || null, url: track.external_urls?.spotify || null };
    }
    const recentTracks = history.map(item => ({ ...display(item.track), playedAt: item.played_at || null }));
    const current = playing?.item?.type === 'track' ? playing.item : null;
    const track = current || history[0]?.track;
    if (!track) return { status: historyAvailable ? 'idle' : 'unavailable', recentTracks, historyAvailable };
    return { status: current && playing?.is_playing ? 'playing' : 'recent', ...display(track), recentTracks, historyAvailable };
  }
  return async () => {
    if (cache && clock() < cacheUntil) return cache;
    if (!pending) pending = read().then(value => { cache = value; cacheUntil = Math.max(cacheUntil, clock() + 30000); return value; }).catch(() => {
      cache = { status: 'unavailable' }; cacheUntil = Math.max(cacheUntil, clock() + 30000); return cache;
    }).finally(() => { pending = null; });
    return pending;
  };
}
