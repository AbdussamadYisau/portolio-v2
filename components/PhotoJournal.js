import { useEffect, useRef, useState } from 'react';

export default function PhotoJournal() {
  const [data, setData] = useState({ status: 'loading', pictures: [] });
  const [selected, setSelected] = useState(null);
  const [retry, setRetry] = useState(0);
  const dialog = useRef(null);
  useEffect(() => {
    const controller = new AbortController();
    let timer;
    async function load() {
      try {
        const response = await fetch('/api/pictures', { signal: controller.signal });
        if (!response.ok) throw new Error();
        const result = await response.json();
        if (!controller.signal.aborted) setData(result);
      } catch { if (!controller.signal.aborted) setData({ status: 'unavailable', pictures: [] }); }
      if (!controller.signal.aborted) timer = setTimeout(load, 60000);
    }
    load();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [retry]);
  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    return () => { document.body.style.overflow = previous; };
  }, [selected]);
  function close() { dialog.current?.close(); setSelected(null); }
  return <section className="photo-journal" aria-labelledby="photo-journal-title">
    <div className="journal-heading"><div><span className="control-label">THROUGH MY LENS</span><h3 id="photo-journal-title">Life, <em>lately.</em></h3><p>Snapshots and things that catch my eye.</p></div><a className="text-link" href="https://www.instagram.com/sammieyisau/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a></div>
    {data.status === 'loading' && <p className="journal-notice" role="status">Developing the photos…</p>}
    {data.status === 'unavailable' && <div className="journal-notice" role="status">The photo journal is temporarily unavailable. <button onClick={() => { setData({ status: 'loading', pictures: [] }); setRetry(value => value + 1); }}>Try again ↗</button></div>}
    {(data.status === 'unconfigured' || (data.status === 'ready' && !data.pictures.length)) && <p className="journal-notice">A few moments worth keeping. Photos coming soon.</p>}
    <div className="journal-grid">{data.pictures.map((picture, index) => <figure key={picture.id} className="journal-photo"><button onClick={() => setSelected(picture)} aria-label={`Enlarge ${picture.title || picture.alt}`}><img src={picture.thumbnail} alt={picture.alt} width={picture.width} height={picture.height} loading="lazy" /><span className="photo-enlarge" aria-hidden="true">↗</span></button><figcaption><span className="photo-index">{String(index + 1).padStart(2, '0')}</span><div>{picture.caption && <p>{picture.caption}</p>}{picture.location && <span className="photo-location">{picture.location}</span>}</div></figcaption></figure>)}</div>
    <dialog className="photo-dialog" ref={dialog} onCancel={() => setSelected(null)} onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) close(); }} aria-label={selected?.title || 'Photo viewer'}>{selected && <div className="photo-dialog-content"><button className="photo-close" onClick={close} aria-label="Close photo" autoFocus>Close ×</button><img src={selected.full} alt={selected.alt} width={selected.width} height={selected.height} /><div className="photo-dialog-caption"><h4>{selected.title}</h4>{selected.caption && <p>{selected.caption}</p>}{selected.location && <span>{selected.location}</span>}</div></div>}</dialog>
  </section>;
}
