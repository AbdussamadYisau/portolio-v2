import { useEffect, useRef } from 'react';

export default function AppearanceMenu({ theme, onChange }) {
  const root = useRef(null);
  const trigger = useRef(null);
  function dismiss(restoreFocus = false) {
    if (!root.current?.open) return;
    root.current.open = false;
    if (restoreFocus) trigger.current?.focus();
  }
  useEffect(() => {
    const outside = event => { if (!root.current?.contains(event.target)) dismiss(); };
    const escape = event => {
      if (event.key === 'Escape' && root.current?.open) { event.preventDefault(); dismiss(true); }
    };
    const resized = () => { if (window.innerWidth > 600) dismiss(); };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    window.addEventListener('resize', resized);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
      window.removeEventListener('resize', resized);
    };
  }, []);
  return <details className="mobile-appearance" ref={root} onBlur={event => {
    if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) dismiss();
  }}>
    <summary ref={trigger} aria-label={`Appearance, ${theme} selected`} title="Appearance">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none" /></svg>
    </summary>
    <div className="appearance-dropdown"><fieldset><legend>Appearance</legend>{[
      { value: 'auto', label: 'Automatic', note: 'Follows your local time' },
      { value: 'light', label: 'Light', note: 'Paper in daylight' },
      { value: 'dark', label: 'Dark', note: 'Easy on the eyes' },
    ].map(option => <label key={option.value} className="appearance-choice"><input type="radio" name="mobile-theme" value={option.value} checked={theme === option.value} onChange={() => { onChange(option.value); dismiss(true); }} /><span><strong>{option.label}</strong><small>{option.note}</small></span></label>)}</fieldset></div>
  </details>;
}
