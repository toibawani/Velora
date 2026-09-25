import React, { useEffect } from 'react';
import { X, Command } from 'lucide-react';
import '../styles/KeyboardHelp.css';

const SHORTCUTS = [
  ['⌘ K / Ctrl K', 'Open search'],
  ['⌘ / / Ctrl /', 'Show keyboard help'],
  ['Esc', 'Close a menu, dialog, or drawer'],
  ['Tab', 'Move through interactive controls']
];

function KeyboardHelp({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="keyboard-help-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="keyboard-help" role="dialog" aria-modal="true" aria-labelledby="keyboard-help-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="keyboard-help-header"><div><span className="keyboard-help-eyebrow"><Command size={14} /> Shortcuts</span><h2 id="keyboard-help-title">Move through VELORA</h2></div><button onClick={onClose} aria-label="Close keyboard help"><X size={20} /></button></header>
        <div className="keyboard-help-list">{SHORTCUTS.map(([keys, description]) => <div className="keyboard-help-row" key={keys}><kbd>{keys}</kbd><span>{description}</span></div>)}</div>
        <p className="keyboard-help-note">Shortcuts work anywhere in the app. They never interrupt a form field you are using.</p>
      </section>
    </div>
  );
}

export default KeyboardHelp;
