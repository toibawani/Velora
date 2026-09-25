import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, BookOpen, Command, Home, BarChart3, Users } from 'lucide-react';
import '../styles/CommandPalette.css';

const DESTINATIONS = [
  { id: 'universe', label: 'VELORA Universe', description: 'Your learning home', icon: Home },
  { id: 'learn', label: 'Learn', description: 'Choose a subject and follow your curiosity', icon: BookOpen },
  { id: 'analytics', label: 'Analytics', description: 'See how your understanding is growing', icon: BarChart3 },
  { id: 'community', label: 'Community', description: 'Compare notes with other learners', icon: Users }
];

function CommandPalette({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return DESTINATIONS;
    return DESTINATIONS.filter((item) => `${item.label} ${item.description}`.toLowerCase().includes(normalized));
  }, [query]);

  useEffect(() => {
    if (!isOpen) return undefined;
    setQuery('');
    window.setTimeout(() => inputRef.current?.focus(), 0);
    const handleKey = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigate = (id) => { onNavigate(id); onClose(); };

  return (
    <div className="command-palette-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="command-palette" role="dialog" aria-modal="true" aria-label="VELORA search" onMouseDown={(event) => event.stopPropagation()}>
        <div className="command-search-row">
          <Search size={20} aria-hidden="true" />
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search VELORA" aria-label="Search VELORA" />
          <button type="button" className="command-close" onClick={onClose} aria-label="Close search"><X size={20} /></button>
        </div>
        <div className="command-results" role="listbox" aria-label="Search results">
          {results.length ? results.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} type="button" className="command-result" onClick={() => navigate(item.id)} role="option" aria-selected="false">
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
