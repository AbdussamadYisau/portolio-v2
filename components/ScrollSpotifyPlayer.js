import { useEffect, useRef, useState } from 'react';

let apiPromise;
function loadSpotifyApi() {
  if (!apiPromise) apiPromise = new Promise((resolve, reject) => {
    const previous = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = api => { previous?.(api); resolve(api); };
    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    script.onerror = () => { apiPromise = null; reject(new Error('Player unavailable')); };
    document.head.appendChild(script);
  });
  return apiPromise;
}

export default function ScrollSpotifyPlayer({ url }) {
  const mount = useRef(null);
  const controller = useRef(null);
  const play = useRef(null);
  const [status, setStatus] = useState('loading');
  useEffect(() => {
    let disposed = false, watchdog, readyTimeout;
    let ready = false, started = false, finished = false;
    const host = document.createElement('div');
    mount.current.appendChild(host);
    const stop = () => { controller.current?.pause(); };
    const attempt = () => {
      if (!controller.current || !ready || disposed) return;
      started = false; finished = false;
      setStatus('starting');
      controller.current.seek(0);
      controller.current.play();
      clearTimeout(watchdog);
      watchdog = setTimeout(() => { if (!disposed && !started) setStatus('blocked'); }, 5000);
    };
    play.current = attempt;
    readyTimeout = setTimeout(() => { if (!disposed && !controller.current) setStatus('unavailable'); }, 15000);
    loadSpotifyApi().then(api => {
      if (disposed) return;
      api.createController(host, { url, width: '100%', height: 152 }, player => {
        if (disposed) { player.destroy(); return; }
        controller.current = player;
        player.addListener('ready', () => {
          if (disposed) return;
          ready = true;
          clearTimeout(readyTimeout);
          setStatus('ready');
        });
        player.addListener('playback_update', event => {
          if (disposed) return;
          const data = event.data;
          if (!data.isPaused && !data.isBuffering) { started = true; clearTimeout(watchdog); setStatus('playing'); }
          if (!data.isPaused && data.position >= 10000) { finished = true; stop(); setStatus('done'); }
          else if (data.isPaused && started) setStatus(finished ? 'done' : 'paused');
        });
      });
    }).catch(() => { if (!disposed) setStatus('unavailable'); });
    const onVisibility = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      disposed = true; clearTimeout(watchdog); clearTimeout(readyTimeout);
      document.removeEventListener('visibilitychange', onVisibility);
      controller.current?.destroy(); controller.current = null; play.current = null;
      mount.current?.replaceChildren();
    };
  }, [url]);
  return <div className="spotify-listen scroll-spotify-player"><div ref={mount} /><p className="integration-note" role="status">{status === 'playing' ? 'Playing · pauses at 10 seconds.' : status === 'blocked' ? 'Playback did not start. Tap play to try again.' : status === 'done' ? 'Ten-second listen complete.' : status === 'unavailable' ? 'Player unavailable. Open this track on Spotify instead.' : status === 'loading' ? 'Loading Spotify player…' : 'Press play for a ten-second listen.'}</p>{status !== 'unavailable' && <button className="integration-button" disabled={status === 'loading'} onClick={() => { if (status === 'playing') { controller.current?.pause(); setStatus('paused'); } else play.current?.(); }}>{status === 'playing' ? 'PAUSE' : 'PLAY 10 SECONDS ↗'}</button>}<p className="integration-note">Spotify controls audio availability; a preview may be an excerpt from elsewhere in the song.</p></div>;
}
