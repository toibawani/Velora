import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { X, Command } from 'lucide-react';
import '../styles/KeyboardHelp.css';
import { useFocusTrap } from '../hooks/useFocusTrap';

/**
 * KeyboardHelp - modal listing every keyboard shortcut, opened with
 * Cmd/Ctrl+/ and closed with Escape.
 */
const SHORTCUTS = [
  ['⌘ K / Ctrl K', 'Open search'],
  ['⌘ / / Ctrl /', 'Show keyboard help'],
  ['Esc', 'Close a menu, dialog, or drawer'],
  ['Tab', 'Move through interactive controls']
];

KeyboardHelp.propTypes = { isOpen: PropTypes.string, onClose: PropTypes.shape({"onClose": PropTypes.func}) };

function KeyboardHelp({ isOpen, onClose }) {
  const helpRef = useRef(null);
  useFocusTrap(isOpen, helpRef, { onClose });

  if (!isOpen) return null;
  return (
    <div data-testid="keyboard-help" className="keyboard-help-backdrop" role="presentation" onMouseDown={onClose}>
      <section ref={helpRef} className="keyboard-help" role="dialog" aria-modal="true" aria-labelledby="keyboard-help-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="keyboard-help-header"><div><span className="keyboard-help-eyebrow"><Command size={14} /> Shortcuts</span><h2 id="keyboard-help-title">Move through VELORA</h2></div><button onClick={onClose} aria-label="Close keyboard help"><X size={20} /></button></header>
        <div className="keyboard-help-list">{SHORTCUTS.map(([keys, description]) => <div className="keyboard-help-row" key={keys}><kbd>{keys}</kbd><span>{description}</span></div>)}</div>
        <p className="keyboard-help-note">Shortcuts work anywhere in the app. They never interrupt a form field you are using. Additional shortcuts are discovered as you explore.</p>
      </section>
    </div>
  );
}

export default KeyboardHelp;
