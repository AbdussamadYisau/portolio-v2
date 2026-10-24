import { useEffect, useRef, useState } from 'react';
import RunningCard from './RunningCard';
import ScrollSpotifyPlayer from './ScrollSpotifyPlayer';

function safeUrl(value, hosts) {
  try { const url = new URL(value); return url.protocol === 'https:' && hosts.includes(url.hostname) ? url.href : null; } catch { return null; }
}
export default function LiveInterests() {
  const [music, setMusic] = useState({ status: 'loading' });
  const [expanded, setExpanded] = useState(false);
  const [runningHeight, setRunningHeight] = useState(null);
  const runningColumn = useRef(null);
  useEffect(() => {
    const card = runningColumn.current?.querySelector('article');
    if (!card) return;
    const observer = new ResizeObserver(() => setRunningHeight(card.getBoundingClientRect().height));
    observer.observe(card);
    return () => observer.disconnect();
  }, []);
  const embed = safeUrl(process.env.NEXT_PUBLIC_STRAVA_EMBED_URL, ['www.strava.com', 'strava.com', 'strava-embeds.com']);
  const profile = safeUrl(process.env.NEXT_PUBLIC_STRAVA_PROFILE_URL, ['www.strava.com', 'strava.com']);
  useEffect(() => {
    let cancelled = false, timer;
    const controller = new AbortController();
    async function update() {
      if (document.visibilityState === 'hidden') { timer = setTimeout(update, 30000); return; }
      try {
        const response = await fetch('/api/spotify', { signal: controller.signal });
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (!cancelled) setMusic(data);
      } catch { if (!cancelled) setMusic({ status: 'unavailable' }); }
      if (!cancelled) timer = setTimeout(update, 30000);
    }
    update();
    return () => { cancelled = true; controller.abort(); clearTimeout(timer); };
  }, []);
  const songUrl = safeUrl(music.url, ['open.spotify.com']);
  const image = safeUrl(music.image, ['i.scdn.co', 'mosaic.scdn.co']);
  const hasTrack = ['playing', 'recent'].includes(music.status) && music.title;
  const recentTracks = Array.isArray(music.recentTracks) ? music.recentTracks.slice(0, 4) : [];
  function embedUrl(value) {
    const url = safeUrl(value, ['open.spotify.com']);
    if (!url) return null;
    const match = new URL(url).pathname.match(/^\/track\/([a-zA-Z0-9]+)$/);
    return match ? `https://open.spotify.com/embed/track/${match[1]}` : null;
  }
  const latestPlayer = embedUrl(recentTracks[0]?.url || music.url);
  return <div className="live-interests">
    <div ref={runningColumn} className="running-column"><RunningCard embed={embed} profile={profile} /></div>
    <article className="live-card music-card expandable-music" style={{ "--running-card-height": runningHeight ? `${runningHeight}px` : undefined }}><div className="music-card-main"><div className="live-card-label"><span>02 / THE SOUNDTRACK</span><span>SPOTIFY ↗</span></div><h3>In my<br /><em>headphones.</em></h3><div className="music-display"><div className="album-cover">{hasTrack && image ? <img src={image} alt={`${music.album || music.title} album artwork`} width="180" height="180" loading="lazy" /> : <span aria-hidden="true">♫</span>}</div><div className="music-details"><p className="music-status" role="status"><span className={`music-dot ${music.status === 'playing' ? 'is-playing' : ''}`} />{music.status === 'playing' ? 'NOW PLAYING' : music.status === 'recent' ? 'LAST LISTENED' : music.status === 'loading' ? 'TUNING IN…' : 'OFF THE AIR'}</p><h4>{hasTrack ? music.title : 'A moment of quiet.'}</h4><p>{hasTrack ? music.artist : music.status === 'unavailable' ? 'The soundtrack is temporarily unavailable.' : 'Burna Boy is always a good place to start.'}</p>{hasTrack && songUrl && <a className="text-link" href={songUrl} target="_blank" rel="noreferrer">LISTEN ON SPOTIFY ↗</a>}</div></div>
      {latestPlayer && <ScrollSpotifyPlayer url={latestPlayer.replace("/embed/track/", "/track/")} />}
      <p className="integration-note">{hasTrack ? 'Listening activity from Spotify · refreshed every 30 seconds.' : 'Music, good stories, and the occasional quiet moment.'}</p>
      <button className="music-history-toggle" aria-expanded={expanded} aria-controls="recent-listening-grid" onClick={() => setExpanded(value => !value)}>{expanded ? 'HIDE RECENT LISTENS' : 'EXPLORE RECENT LISTENS'}<span aria-hidden="true">{expanded ? '−' : '+'}</span></button></div>
      {expanded && <div id="recent-listening-grid" className="music-history-panel">
      {recentTracks.length > 0 && <section className="recent-listening" aria-label="Recently played tracks"><h4>Recently played <span>{recentTracks.length.toString().padStart(2, '0')}</span></h4><ol>{recentTracks.map((track, index) => {
        const url = safeUrl(track.url, ['open.spotify.com']);
        const artwork = safeUrl(track.image, ['i.scdn.co', 'mosaic.scdn.co']);
        return <li key={`${track.playedAt || 'recent'}-${index}`}><span className="recent-number">{String(index + 1).padStart(2, '0')}</span>{artwork ? <img src={artwork} alt="" width="40" height="40" loading="lazy" /> : <span className="recent-art" aria-hidden="true">♫</span>}<div>{url ? <a href={url} target="_blank" rel="noreferrer">{track.title} ↗</a> : <span>{track.title}</span>}<p>{track.artist}</p></div></li>;
      })}</ol></section>}
      {music.historyAvailable === false && <p className="integration-note">Recent listening history is temporarily unavailable.</p>}
      {!recentTracks.length && music.historyAvailable !== false && <p className="integration-note">No recent listening entries available yet.</p>}</div>}</article>
  </div>;
}
