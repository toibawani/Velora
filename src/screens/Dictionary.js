import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, X, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { DICTIONARY_SUBJECTS, CURIOUS_TERMS } from '../data/curiousDictionaryData';
import '../styles/Dictionary.css';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function Dictionary({ setScreen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [activeEntryId, setActiveEntryId] = useState(null);

  // Cross-subject search and filtering
  const filteredTerms = useMemo(() => {
    return CURIOUS_TERMS.filter((item) => {
      // 1. Cross-subject global search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTerm = item.term.toLowerCase().includes(query);
        const matchesTagline = item.tagline.toLowerCase().includes(query);
        const matchesExplanation = item.explanation.toLowerCase().includes(query);
        const matchesExample = item.example.toLowerCase().includes(query);
        const matchesSubject = item.subject.toLowerCase().includes(query);
        if (!matchesTerm && !matchesTagline && !matchesExplanation && !matchesExample && !matchesSubject) {
          return false;
        }
      }

      // 2. Subject filter
      if (selectedSubject !== 'all' && item.subject !== selectedSubject) {
        return false;
      }

      // 3. A-to-Z letter index
      if (selectedLetter !== 'ALL' && item.letter !== selectedLetter) {
        return false;
      }

      return true;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, selectedSubject, selectedLetter]);

  // Which letters have at least one term under the currently selected subject?
  const availableLetters = useMemo(() => {
    const letters = new Set();
    CURIOUS_TERMS.forEach((item) => {
      if (selectedSubject === 'all' || item.subject === selectedSubject) {
        letters.add(item.letter);
      }
    });
    return letters;
  }, [selectedSubject]);

  return (
    <div className="dictionary-console">
      {/* Top Navbar */}
      <header className="dict-navbar">
        <div className="dict-nav-left">
          <button
            type="button"
            className="dict-back-btn"
            onClick={() => setScreen('universe')}
            aria-label="Return to knowledge atlas"
          >
            <ArrowLeft size={16} /> Atlas
          </button>
          <div className="dict-title-col">
            <h1 className="dict-title">Curious Dictionary</h1>
            <span className="dict-sub">Clear explanations of fundamental concepts, written for genuine understanding</span>
          </div>
        </div>
        <div className="dict-stat-pill">
          <span>{CURIOUS_TERMS.length} Concepts Index</span>
        </div>
      </header>

      <main className="dict-main-layout">
        {/* Search Bar & Subject Tabs */}
        <section className="dict-controls-card">
          <div className="dict-search-wrap">
            <Search size={18} className="search-icon-svg" />
            <input
              type="text"
              className="dict-search-input"
              placeholder="Search across all subjects (e.g. momentum, cognitive dissonance, entropy, Rawls)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (selectedLetter !== 'ALL') setSelectedLetter('ALL');
              }}
              aria-label="Search across all subjects"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Subject Pills */}
          <div className="dict-subject-scroll">
            {DICTIONARY_SUBJECTS.map((sub) => {
              const isActive = selectedSubject === sub.id;
              const count = sub.id === 'all'
                ? CURIOUS_TERMS.length
                : CURIOUS_TERMS.filter((t) => t.subject === sub.id).length;
              return (
                <button
                  key={sub.id}
                  type="button"
                  className={`sub-filter-pill ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedSubject(sub.id);
                    setSelectedLetter('ALL');
                  }}
                  aria-pressed={isActive}
                >
                  {sub.name}
                  <span className="sub-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* A-to-Z Alphabet Index */}
          <div className="alphabet-selector-strip" role="toolbar" aria-label="Alphabetical Jump Bar">
            <button
              type="button"
              className={`letter-pill ${selectedLetter === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedLetter('ALL')}
            >
              All
            </button>
            {ALPHABET.map((char) => {
              const hasChar = availableLetters.has(char);
              const isSelected = selectedLetter === char;
              return (
                <button
                  key={char}
                  type="button"
                  disabled={!hasChar}
                  className={`letter-pill ${isSelected ? 'active' : ''} ${!hasChar ? 'disabled' : ''}`}
                  onClick={() => setSelectedLetter(char)}
                  aria-label={`Jump to letter ${char}`}
                >
                  {char}
                </button>
              );
            })}
          </div>
        </section>

        {/* Entries Stream */}
        <section className="dict-entries-stream" aria-live="polite">
          {filteredTerms.length === 0 ? (
            <div className="dict-empty-state">
              <BookOpen size={36} strokeWidth={1.5} color="var(--color-text-muted)" />
              <h3>No matching concepts found</h3>
              <p>Try searching for a related principle or switch to "All Subjects".</p>
              <button
                type="button"
                className="dict-reset-filter-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubject('all');
                  setSelectedLetter('ALL');
                }}
              >
                Reset search & filters
              </button>
            </div>
          ) : (
            filteredTerms.map((entry) => {
              const isExpanded = activeEntryId === entry.id;
              return (
                <article
                  key={entry.id}
                  className={`lexicon-entry-card ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => setActiveEntryId(isExpanded ? null : entry.id)}
                >
                  <div className="entry-head-row">
                    <div className="entry-title-wrap">
                      <span className="entry-letter-badge">{entry.letter}</span>
                      <div>
                        <h2 className="entry-term">{entry.term}</h2>
                        <p className="entry-tagline">{entry.tagline}</p>
                      </div>
                    </div>
                    <span className={`entry-domain-badge domain-${entry.subject}`}>
                      {entry.subject.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="entry-body-content">
                    <p className="entry-explanation">{entry.explanation}</p>

                    {entry.example && (
                      <div className="entry-analogy-box">
                        <span className="analogy-label">Concrete Example:</span>
                        <p className="analogy-text">{entry.example}</p>
                      </div>
                    )}

                    {entry.source && (
                      <div className="entry-source-row">
                        <span className="source-label">Primary Context & Foundation:</span>
                        <span className="source-text">{entry.source}</span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}

export default Dictionary;
