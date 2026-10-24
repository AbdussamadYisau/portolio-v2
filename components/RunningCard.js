import { useEffect, useState } from 'react';

export default function RunningCard({ embed, profile }) {
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    setLoaded(false);
    setSlow(false);
    if (!embed) return;
    const timer = setTimeout(() => setSlow(true), 12000);
    return () => clearTimeout(timer);
  }, [embed]);
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
