import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, Command } from 'lucide-react';
import { SCREENS } from '../navigation';
import '../styles/CommandPalette.css';
import { useFocusTrap } from '../hooks/useFocusTrap';

/**
 * The palette listed four destinations while the app had seven. Cmd-K is the
 * fastest route to a screen there is one, so leaving the dictionary and the
 * games out of it meant the two things most worth typing the name of were the
 * two you could not. It now searches the same registry every other nav uses.
 */
const DESTINATIONS = SCREENS;

CommandPalette.propTypes = { isOpen: PropTypes.string, onClose: PropTypes.shape({"onClose": PropTypes.func}), onNavigate: PropTypes.shape({"onNavigate": PropTypes.func}) };

function CommandPalette({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const paletteRef = useRef(null);
  useFocusTrap(isOpen, paletteRef, { onClose });
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return DESTINATIONS;
    return DESTINATIONS.filter((item) =>
      // drawerLabel is searched too: someone who remembers the nav saying
      // "Curious Dictionary" should find it by typing that, not "Dictionary".
      `${item.label} ${item.drawerLabel} ${item.description}`.toLowerCase().includes(normalized));
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return undefined;
    setQuery('');
    setActiveIndex(0);
    window.setTimeout(() => inputRef.current?.focus(), 0);
    const handleKey = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigate = (id) => { onNavigate(id); onClose(); };
  const moveSelection = (direction) => {
    if (!results.length) return;
    setActiveIndex((index) => (index + direction + results.length) % results.length);
  };
  const handlePaletteKeyDown = (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); moveSelection(1); }
    if (event.key === 'ArrowUp') { event.preventDefault(); moveSelection(-1); }
    if (event.key === 'Enter' && results[activeIndex]) { event.preventDefault(); navigate(results[activeIndex].id); }
  };

  return (
    <div className="command-palette-backdrop" role="presentation" onMouseDown={onClose}>
      <section ref={paletteRef} className="command-palette" role="dialog" aria-modal="true" aria-label="VELORA search" onMouseDown={(event) => event.stopPropagation()} onKeyDown={handlePaletteKeyDown}>
        <div className="command-search-row">
          <Search size={20} aria-hidden="true" />
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search VELORA" aria-label="Search VELORA" />
          <button type="button" className="command-close" onClick={onClose} aria-label="Close search"><X size={20} /></button>
        </div>
        <div className="command-results" role="listbox" aria-label="Search results">
          {results.length ? results.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} type="button" className={`command-result ${activeIndex === results.indexOf(item) ? 'active' : ''}`} onClick={() => navigate(item.id)} role="option" aria-selected={activeIndex === results.indexOf(item)}>
              <span className="command-result-icon"><Icon size={18} aria-hidden="true" /></span>
              <span><strong>{item.label}</strong><small>{item.description}</small></span>
              <span className="command-enter">Go</span>
            </button>;
          }) : <p className="command-empty">No match yet. Try “learn” or “analytics”.</p>}
        </div>
        <footer className="command-footer"><span><Command size={13} /> K to open</span><span>Esc to close</span></footer>
      </section>
    </div>
  );
}

export default CommandPalette;
