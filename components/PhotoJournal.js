import { useEffect, useRef, useState } from 'react';
import { retainPicturesOnError } from '../lib/content-state.mjs';

export default function PhotoJournal() {
  const [data, setData] = useState({ status: 'loading', pictures: [] });
  const [selected, setSelected] = useState(null);
  const [retry, setRetry] = useState(0);
  const dialog = useRef(null);
  const gallery = useRef(null);
  const galleryRevealed = useRef(false);
  const motion = useRef(null);
  const closing = useRef(false);
  const keyboardOpen = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    let timer;
    async function load() {
      try {
        const response = await fetch('/api/pictures', { signal: controller.signal });
        if (!response.ok) throw new Error();
        const result = await response.json();
        if (!controller.signal.aborted) setData(result);
      } catch { if (!controller.signal.aborted) setData(retainPicturesOnError); }
      if (!controller.signal.aborted) timer = setTimeout(load, 60000);
    }
    load();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [retry]);
  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closing.current = false;
    dialog.current?.showModal();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const surface = dialog.current?.querySelector('.photo-dialog-content');
    motion.current = surface?.animate([
      { opacity: 0, transform: reduced ? 'none' : 'scale(.97)' },
      { opacity: 1, transform: reduced ? 'none' : 'scale(1)' },
    ], { duration: keyboardOpen.current ? 0 : reduced ? 80 : 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    return () => { motion.current?.cancel(); document.body.style.overflow = previous; };
  }, [selected]);
  useEffect(() => {
    if (!data.pictures.length || galleryRevealed.current) return;
    const grid = gallery.current;
    const animations = [];
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || galleryRevealed.current) return;
      galleryRevealed.current = true;
      observer.disconnect();
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      grid.querySelectorAll('.journal-photo').forEach((photo, index) => {
        animations.push(photo.animate([
          { opacity: 0, transform: reduced ? 'none' : 'translateY(8px)' },
          { opacity: 1, transform: reduced ? 'none' : 'translateY(0)' },
        ], {
          duration: reduced ? 80 : 240, delay: reduced ? 0 : Math.min(index * 40, 160),
          easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards',
        }));
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    observer.observe(grid);
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); };
  }, [data.pictures.length]);
  async function close(instant = false) {
    if (closing.current && !instant) return;
    if (instant) motion.current?.cancel();
    closing.current = true;
    const surface = dialog.current?.querySelector('.photo-dialog-content');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (surface && !instant) {
      const current = getComputedStyle(surface);
      const from = { opacity: current.opacity, transform: current.transform };
      motion.current?.cancel();
      motion.current = surface.animate([from, { opacity: 0, transform: reduced ? 'none' : 'scale(.97)' }], {
        duration: reduced ? 80 : 160, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'forwards',
      });
      try { await motion.current.finished; } catch { return; }
    }
    dialog.current?.close();
    setSelected(null);
  }
  return <section className="photo-journal" aria-labelledby="photo-journal-title">
    <div className="journal-heading"><div><span className="control-label">THROUGH MY LENS</span><h3 id="photo-journal-title">Life, <em>lately.</em></h3><p>Snapshots and things that catch my eye.</p></div><a className="text-link" href="https://www.instagram.com/sammieyisau/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a></div>
    {data.refreshFailed && <p className="journal-notice" role="status">Showing saved photos. Updates are temporarily unavailable. <button onClick={() => setRetry(value => value + 1)}>Retry ↗</button></p>}
    {data.status === 'loading' && <p className="journal-notice" role="status">Developing the photos…</p>}
    {data.status === 'unavailable' && <div className="journal-notice" role="status">The photo journal is temporarily unavailable. <button onClick={() => { setData({ status: 'loading', pictures: [] }); setRetry(value => value + 1); }}>Try again ↗</button></div>}
    {(data.status === 'unconfigured' || (data.status === 'ready' && !data.pictures.length)) && <p className="journal-notice">A few moments worth keeping. Photos coming soon.</p>}
    <div className="journal-grid" ref={gallery}>{data.pictures.map((picture, index) => <figure key={picture.id} className="journal-photo"><button onClick={event => { keyboardOpen.current = event.detail === 0; setSelected(picture); }} aria-label={`Enlarge ${picture.title || picture.alt}`}><img src={picture.thumbnail} alt={picture.alt} width={picture.width} height={picture.height} loading="lazy" /><span className="photo-enlarge" aria-hidden="true">↗</span></button><figcaption><span className="photo-index">{String(index + 1).padStart(2, '0')}</span><div>{picture.caption && <p>{picture.caption}</p>}{picture.location && <span className="photo-location">{picture.location}</span>}</div></figcaption></figure>)}</div>
    <dialog className="photo-dialog" ref={dialog} onCancel={event => { event.preventDefault(); close(true); }} onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) close(); }} aria-label={selected?.title || 'Photo viewer'}>{selected && <div className="photo-dialog-content"><button className="photo-close" onClick={() => close()} aria-label="Close photo" autoFocus>Close ×</button><img src={selected.full} alt={selected.alt} width={selected.width} height={selected.height} /><div className="photo-dialog-caption"><h4>{selected.title}</h4>{selected.caption && <p>{selected.caption}</p>}{selected.location && <span>{selected.location}</span>}</div></div>}</dialog>
  </section>;
}
