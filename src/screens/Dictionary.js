import React, { useState, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, Search, X, BookOpen } from 'lucide-react';
import {
  CURIOUS_TERMS,
  DICTIONARY_SUBJECTS,
  countTermsByLetter,
  countTermsBySubject,
  selectTerms,
} from '../data/dictionary';
import '../styles/Dictionary.css';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function Dictionary({ setScreen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [activeEntryId, setActiveEntryId] = useState(null);
  const navbarRef = useRef(null);

  // The A-Z bar sticks directly underneath the navbar, so it needs to know
  // how tall that is. Measured rather than hardcoded, because the navbar
  // reflows on mobile and a guessed offset leaves the bar tucked under it.
  useEffect(() => {
    const el = navbarRef.current;
    if (!el) return undefined;

    const publish = () => {
      document.documentElement.style.setProperty(
        '--dict-navbar-h',
        `${Math.round(el.getBoundingClientRect().height)}px`
      );
    };

    publish();
    window.addEventListener('resize', publish);
    return () => {
      window.removeEventListener('resize', publish);
      document.documentElement.style.removeProperty('--dict-navbar-h');
    };
  }, []);

  // Cross-subject search and filtering. The rules live in the data module so
  // the counts shown on the letter bar and the subject rail are computed from
  // the same logic that decides what this list contains - when they are written
  // twice they drift, and the drift shows up as a pill that says 7 and a list
  // that holds 6.
  const filteredTerms = useMemo(
    () => selectTerms({ query: searchQuery, subject: selectedSubject, letter: selectedLetter }),
    [searchQuery, selectedSubject, selectedLetter]
  );

  // How many terms sit under each letter, so the bar can say what a click will
  // produce instead of leaving people to click and find out. Keyed on the
  // subject only: typing in the search box must not grey out letters, because
  // the bar indexes the dictionary, not the current result set.
  const letterCounts = useMemo(() => {
    const counts = {};
    ALPHABET.forEach((char) => {
      counts[char] = countTermsByLetter(char, selectedSubject);
    });
    return counts;
  }, [selectedSubject]);

  return (
    <div className="dictionary-console">
      {/* Top Navbar */}
      <header className="dict-navbar" ref={navbarRef}>
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
              const count = countTermsBySubject(sub.id);
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

        </section>

        {/* A-to-Z index. Sits outside the controls card so it can stay put
            while the list scrolls underneath it. */}
        <div className="dict-letter-bar">
          <span className="dict-letter-bar-label">Jump to</span>
          <div className="alphabet-selector-strip" role="toolbar" aria-label="Alphabetical Jump Bar">
            <button
              type="button"
              className={`letter-pill ${selectedLetter === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedLetter('ALL')}
              aria-pressed={selectedLetter === 'ALL'}
            >
              All
            </button>
            {ALPHABET.map((char) => {
              const count = letterCounts[char] || 0;
              const isSelected = selectedLetter === char;
              return (
                <button
                  key={char}
                  type="button"
                  disabled={count === 0}
                  className={`letter-pill ${isSelected ? 'active' : ''} ${count === 0 ? 'disabled' : ''}`}
                  onClick={() => setSelectedLetter(char)}
                  aria-pressed={isSelected}
                  aria-label={`Jump to ${char}, ${count} ${count === 1 ? 'term' : 'terms'}`}
                  title={count === 0 ? `No terms under ${char}` : `${count} under ${char}`}
                >
                  {char}
                  {count > 0 && <span className="letter-count">{count}</span>}
                </button>
              );
            })}
          </div>
          <span className="dict-result-count" role="status">
            {filteredTerms.length} {filteredTerms.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

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
                        <span className="source-label">Where this comes from:</span>
                        {entry.sourceUrl ? (
                          <a
                            className="source-text source-link"
                            href={entry.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {entry.source}
                          </a>
                        ) : (
                          <span className="source-text">{entry.source}</span>
                        )}
                        {entry.verified === false && (
                          <span className="source-flag" title="This entry has not been checked against its source yet.">
                            not checked yet
                          </span>
                        )}
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
