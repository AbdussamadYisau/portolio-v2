import { useEffect, useState } from 'react';

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});
export default function LagosClock() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const tick = () => { if (!document.hidden) setNow(new Date()); };
    tick();
    const timer = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', tick); };
  }, []);
  return <div className="lagos-clock"><span className="clock-dot" aria-hidden="true" /><span>MY TIME · LAGOS<time dateTime={now?.toISOString()}>{now ? formatter.format(now) : '--:--:--'} <small>WAT</small></time></span></div>;
}
