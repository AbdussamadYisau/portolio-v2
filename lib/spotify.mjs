const API = 'https://api.spotify.com/v1';
export function createSpotifyReader({ env = process.env, request = fetch, clock = Date.now } = {}) {
  let token, tokenUntil = 0, cache, cacheUntil = 0, pending;
  const failure = reason => Object.assign(new Error('Spotify connection failed'), { spotifyReason: reason });
  async function read() {
    const [id, secret, refresh] = ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 'SPOTIFY_REFRESH_TOKEN'].map(key => env[key]?.trim());
    if (!id || !secret || !refresh) return { status: 'unconfigured' };
    if (!token || clock() >= tokenUntil) {
      const response = await request('https://accounts.spotify.com/api/token', {
        method: 'POST', headers: { Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }), signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) {
        let code;
        try { code = (await response.json()).error; } catch {}
        throw failure(code === 'invalid_client' ? 'invalid_client' : code === 'invalid_grant' ? 'invalid_refresh_token' : response.status === 429 ? 'rate_limited' : 'authorization_failed');
      }
      const data = await response.json();
      if (!data.access_token) throw failure('authorization_failed');
      token = data.access_token;
      tokenUntil = clock() + Math.max(0, (Number(data.expires_in) || 3600) - 60) * 1000;
    }
    async function get(path) {
      const response = await request(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(8000) });
      if (response.status === 204) return null;
      if (!response.ok) {
        if (response.status === 401) tokenUntil = 0;
        if (response.status === 429) cacheUntil = clock() + Math.max(60, Number(response.headers.get('retry-after')) || 60) * 1000;
        throw failure(response.status === 401 ? 'authorization_expired' : response.status === 403 ? 'access_denied' : response.status === 429 ? 'rate_limited' : 'spotify_unavailable');
      }
      return response.json();
    }
    let playing = null, playbackError;
    try { playing = await get('/me/player/currently-playing'); }
    catch (error) {
      if (error.spotifyReason === 'rate_limited') throw error;
      playbackError = error;
    }
    let history = [], historyAvailable = true;
    try {
      const recent = await get('/me/player/recently-played?limit=4');
      history = (recent?.items || []).filter(item => item.track?.name).slice(0, 4);
    } catch (error) {
      if (playbackError || !playing?.item) throw error;
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
    if (!pending) pending = read().then(value => { cache = value; cacheUntil = Math.max(cacheUntil, clock() + 30000); return value; }).catch(error => {
      cache = { status: 'unavailable', reason: error.spotifyReason || 'connection_failed' }; cacheUntil = Math.max(cacheUntil, clock() + 30000); return cache;
    }).finally(() => { pending = null; });
    return pending;
  };
}
