import { useEffect, useState } from 'react';

export default function RunningCard({ embed, profile }) {
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    let timer;
    async function load() {
      try {
        const response = await fetch('/api/strava', { signal: controller.signal });
        if (response.ok) { const result = await response.json(); if (!controller.signal.aborted) setSummary(result); }
      } catch {}
      if (!controller.signal.aborted) timer = setTimeout(load, 900000);
    }
    load();
    return () => { controller.abort(); clearTimeout(timer); };
  }, []);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    setLoaded(false);
    setSlow(false);
    if (!embed) return;
    const timer = setTimeout(() => setSlow(true), 12000);
    return () => clearTimeout(timer);
  }, [embed]);
  if (summary?.status === 'ready') {
    const format = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 1 });
    const minutes = Math.round(summary.movingSeconds / 60);
    return <article className="live-card running-card strava-summary" aria-label="Running summary for the last four weeks">
      <div className="live-card-label"><span>STRAVA / RUNNING</span>{profile ? <a href={profile} target="_blank" rel="noreferrer">LAST 4 WEEKS ↗</a> : <span>LAST 4 WEEKS</span>}</div>
      <div className="strava-symbol-link"><svg className="strava-symbol" viewBox="0 0 100 110" fill="currentColor" aria-hidden="true"><path d="M38 4 7 59h21l10-18 10 18h21L38 4Z" /><path d="m68 104 25-44H76l-8 15-8-15H43l25 44Z" /></svg></div>
      <dl className="running-stats"><div><dt>Activities</dt><dd>{summary.activities}</dd></div><div><dt>Distance</dt><dd>{format.format(summary.distanceKm)}<small> km</small></dd></div><div><dt>Moving</dt><dd>{Math.floor(minutes / 60)}h {minutes % 60}m</dd></div><div><dt>Elevation</dt><dd>{Math.round(summary.elevationM)}<small> m</small></dd></div></dl>
      {profile && <a className="text-link running-profile-link" href={profile} target="_blank" rel="noreferrer">VIEW ON STRAVA ↗</a>}
    </article>;
  }
  return <article className="live-card running-card strava-embed-card" aria-labelledby="running-title">
    <div className="live-card-label"><span>01 / ON THE MOVE</span><span>STRAVA ↗</span></div>
    <h3 id="running-title">Miles away<br /><em>from the screen.</em></h3>
    <p>A running log. One outing at a time.</p>
    {embed ? <div className="strava-embed-frame"><div className="run-embed"><iframe key={embed} title="Abdussamad’s Strava running activity" src={embed} loading="lazy" onLoad={() => setLoaded(true)} referrerPolicy="strict-origin-when-cross-origin" /></div></div> : <div className="run-placeholder"><span className="run-glyph" aria-hidden="true">↗</span><p className="integration-note">Running updates will live here.</p></div>}
    {embed && !loaded && !slow && <p className="integration-note" role="status">Loading running activity…</p>}
    {embed && slow && !loaded && <p className="integration-note" role="status">The activity is taking a little longer to load.</p>}
    {profile && <a className="text-link running-profile-link" href={profile} target="_blank" rel="noreferrer">FOLLOW MY RUNNING ↗</a>}
  </article>;
}
