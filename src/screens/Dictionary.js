import PropTypes from 'prop-types';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, Search, X, BookOpen, History } from 'lucide-react';
import HighlightedText from '../components/HighlightedText';
import { copyText, COPY_OK } from '../utils/clipboard';
import { buildTermShareUrl } from '../utils/shareLinks';
import { rememberTerm, resolveRecentTerms } from '../utils/recentTerms';
import {
  CURIOUS_TERMS,
  DICTIONARY_SUBJECTS,
  countTermsByLetter,
  countTermsBySubject,
  selectTerms,
  verifiedTermCount,
  relatedTerms,
} from '../data/dictionary';
import '../styles/Dictionary.css';

/**
 * How the result list can be ordered.
 *
 * The list was alphabetical and nothing else, which is the right default for a
 * dictionary and the wrong only option for someone revising: "shortest first"
 * is how you read a new subject quickly, and "by subject" is how you see what
 * the dictionary actually covers. Every order is a total one - ties fall back
 * to the term - so the list cannot reshuffle between renders.
 */
export const DICTIONARY_ORDERS = [
  {
    id: 'az',
    label: 'A to Z',
    compare: (a, b) => a.term.localeCompare(b.term),
  },
  {
    id: 'za',
    label: 'Z to A',
    compare: (a, b) => b.term.localeCompare(a.term),
  },
  {
    id: 'subject',
    label: 'By subject',
    compare: (a, b) =>
      a.subject.localeCompare(b.subject) || a.term.localeCompare(b.term),
  },
  {
    id: 'shortest',
    label: 'Shortest first',
    compare: (a, b) =>
      (a.explanation || '').length - (b.explanation || '').length ||
      a.term.localeCompare(b.term),
  },
];

/** The comparator for an order id, defaulting to alphabetical. */
export const comparatorFor = (orderId) =>
  (DICTIONARY_ORDERS.find((order) => order.id === orderId) || DICTIONARY_ORDERS[0]).compare;

/**
 * Dictionary - term lookup across subjects with letter and subject filters,
 * plus curious-term discovery on the landing side.
 */
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

Dictionary.propTypes = {
  setScreen: PropTypes.shape({ setScreen: PropTypes.func }),
  /** An entry id another screen or a shared link asked for. */
  initialTerm: PropTypes.string,
  /** Called once that request has been honoured, so it does not fire again. */
  onTermOpened: PropTypes.func,
};

function Dictionary({ setScreen, initialTerm = null, onTermOpened }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [activeEntryId, setActiveEntryId] = useState(null);
  const [orderId, setOrderId] = useState('az');
  const navbarRef = useRef(null);
  const searchRef = useRef(null);
  // Set when an entry is opened from a link inside another entry, so the
  // scroll happens for that jump and not for every card the reader unfolds.
  const scrollPendingRef = useRef(false);
  // Which entry was copied, and what the browser said about it. The clipboard
  // helper reports failure rather than swallowing it, so the button can say
  // "blocked" instead of claiming a link that is not on the clipboard.
  const [copyState, setCopyState] = useState(null);
  // Entries opened recently, resolved against the entries that exist now. Read
  // once on mount and refreshed when an entry opens, which is the only moment
  // the list can change.
  const [recent, setRecent] = useState(() => resolveRecentTerms(CURIOUS_TERMS));

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

  /**
   * "/" puts the cursor in the search box.
   *
   * The dictionary is a list of 138 entries with one input at the top, and the
   * only way to reach it was to scroll to the top and click. The handler stays
   * off while someone is typing: a slash inside the search box, or inside any
   * other field the app eventually puts on this screen, has to reach the field
   * rather than be eaten as a shortcut.
   */
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      const tag = target && target.tagName ? target.tagName.toLowerCase() : '';
      if (['input', 'textarea', 'select'].includes(tag) || (target && target.isContentEditable)) {
        return;
      }
      event.preventDefault();
      if (searchRef.current) searchRef.current.focus();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  /**
   * Opens one entry by id, whatever the current filters are.
   *
   * A related entry is usually not in the current result set - it can be a
   * different subject, or under a letter the reader filtered to - so jumping to
   * it means clearing the filters that would hide it. Focus moves with the
   * card, otherwise a keyboard user is left at the top of a list they did not
   * ask to see.
   */
  const handleCopyLink = async (entry) => {
    const status = await copyText(buildTermShareUrl(entry.id));
    setCopyState({ id: entry.id, status });
  };

  const openEntry = (entryId) => {
    setSearchQuery('');
    setSelectedSubject('all');
    setSelectedLetter('ALL');
    setActiveEntryId(entryId);
    scrollPendingRef.current = true;
  };

  /**
   * Honour a request to open one entry.
   *
   * A shared `#/term/{id}` link opened this screen and then dropped the id, so
   * the reader landed at the top of 144 entries with no sign of which one the
   * link was about. An id that is not in the dictionary opens nothing and is
   * cleared, rather than leaving the request to fire again on the next visit.
   */
  useEffect(() => {
    if (!initialTerm) return;
    if (CURIOUS_TERMS.some((term) => term.id === initialTerm)) {
      setSearchQuery('');
      setSelectedSubject('all');
      setSelectedLetter('ALL');
      setActiveEntryId(initialTerm);
      scrollPendingRef.current = true;
    }
    if (onTermOpened) onTermOpened();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTerm]);

  /**
   * Records what was opened, and refreshes the strip that lists it.
   *
   * One effect rather than a call at each of the four places an entry can open
   * (a card, a related chip, a deep link, a recent chip), because four call
   * sites is how one of them ends up forgetting.
   */
  useEffect(() => {
    if (!activeEntryId) return;
    rememberTerm(activeEntryId);
    setRecent(resolveRecentTerms(CURIOUS_TERMS));
  }, [activeEntryId]);

  useEffect(() => {
    if (!scrollPendingRef.current || !activeEntryId) return;
    scrollPendingRef.current = false;
    const node = document.getElementById(`dict-entry-${activeEntryId}`);
    if (!node) return;
    if (node.scrollIntoView) node.scrollIntoView({ block: 'start', behavior: 'smooth' });
    if (node.focus) node.focus({ preventScroll: true });
  }, [activeEntryId]);

  // Cross-subject search and filtering. The rules live in the data module so
  // the counts shown on the letter bar and the subject rail are computed from
  // the same logic that decides what this list contains - when they are written
  // twice they drift, and the drift shows up as a pill that says 7 and a list
  // that holds 6.
  const filteredTerms = useMemo(
    () => selectTerms({ query: searchQuery, subject: selectedSubject, letter: selectedLetter }),
    [searchQuery, selectedSubject, selectedLetter]
  );

  // Sorting a copy, because the selection comes from the data module and a
  // comparator that mutated it would leave the dictionary in a different order
  // on the next visit. The count below stays on `filteredTerms`, which holds
  // exactly the same entries.
  const orderedTerms = useMemo(
    () => [...filteredTerms].sort(comparatorFor(orderId)),
    [filteredTerms, orderId]
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
          {/* The count that matters more than the size. An absent verified flag
              means nobody has read the entry against its source, so saying it
              here is the honest version of a number that otherwise reads as
              "138 checked". */}
          <span
            className="dict-verified-count"
            title="Entries read back against their listed source, not entries with a source link."
          >
            {verifiedTermCount} of {CURIOUS_TERMS.length} checked against source
          </span>
        </div>
      </header>

      <main className="dict-main-layout">
        {/* Search Bar & Subject Tabs */}
        <section className="dict-controls-card">
          <div className="dict-search-wrap">
            <Search size={18} className="search-icon-svg" />
            <input
              type="text"
              ref={searchRef}
              className="dict-search-input"
              placeholder="Search across all subjects (e.g. momentum, cognitive dissonance, entropy, Rawls)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (selectedLetter !== 'ALL') setSelectedLetter('ALL');
              }}
              aria-label="Search across all subjects"
            />
            {/* The shortcut is invisible otherwise, and a key nobody is told
                about is a key nobody uses. */}
            {!searchQuery && (
              <kbd className="dict-search-kbd" aria-hidden="true">
                /
              </kbd>
            )}
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

          {/* Order. A native select rather than another row of pills, because
              this is a preference about the list and not a filter on it. */}
          <div className="dict-order-row">
            <label className="dict-order-label" htmlFor="dict-order">
              Order
            </label>
            <select
              id="dict-order"
              className="dict-order-select"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            >
              {DICTIONARY_ORDERS.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.label}
                </option>
              ))}
            </select>
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

        {/* Recently opened. Only while nothing is filtering the list: the strip
            is a shortcut back to something already read, and it belongs above a
            list of everything rather than above a search result. */}
        {recent.length > 0 && !searchQuery && selectedSubject === 'all' && selectedLetter === 'ALL' && (
          <section className="dict-recent" aria-label="Recently opened">
            <span className="dict-recent-label">
              <History size={13} aria-hidden="true" /> Recently opened
            </span>
            <div className="dict-recent-chips">
              {recent.map((term) => (
                <button
                  key={term.id}
                  type="button"
                  className={`dict-recent-chip ${activeEntryId === term.id ? 'active' : ''}`}
                  onClick={() => openEntry(term.id)}
                >
                  {term.term}
                </button>
              ))}
            </div>
          </section>
        )}

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
            orderedTerms.map((entry) => {
              const isExpanded = activeEntryId === entry.id;
              return (
                <article
                  key={entry.id}
                  id={`dict-entry-${entry.id}`}
                  tabIndex={-1}
                  aria-label={entry.term}
                  className={`lexicon-entry-card ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => setActiveEntryId(isExpanded ? null : entry.id)}
                  onKeyDown={(event) => {
                    // The header is a normal click target, so it needs the same
                    // affordance from the keyboard rather than being a mouse
                    // only way into the explanation.
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setActiveEntryId(isExpanded ? null : entry.id);
                    }
                  }}
                >
                  <div className="entry-head-row">
                    <div className="entry-title-wrap">
                      <span className="entry-letter-badge">{entry.letter}</span>
                      <div>
                        {/* The list already narrowed to the matching entries;
                          * marking the matched characters inside each one is
                          * what saves the reader hunting for the word in a card
                          * with three blocks of text on it. */}
                        <h2 className="entry-term">
                          <HighlightedText text={entry.term} query={searchQuery} />
                        </h2>
                        <p className="entry-tagline">
                          <HighlightedText text={entry.tagline} query={searchQuery} />
                        </p>
                      </div>
                    </div>
                    <span
                      className={`entry-domain-badge domain-${entry.subject}`}
                      data-testid="entry-subject"
                    >
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
                        {entry.verified !== true && (
                          <span className="source-flag" title="This entry has not been checked against its source yet.">
                            not checked yet
                          </span>
                        )}
                      </div>
                    )}

                    {/* A permanent link to this entry. A shared link only
                      * works if there is a way to make one. Only rendered
                      * while the entry is open: 144 copy buttons in the
                      * document is a tab trap, not an affordance. */}
                    {isExpanded && (
                    <div className="entry-link-row">
                      <button
                        type="button"
                        className="entry-copy-link"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleCopyLink(entry);
                        }}
                      >
                        {copyState && copyState.id === entry.id && copyState.status === COPY_OK
                          ? 'Link copied'
                          : 'Copy link to this entry'}
                      </button>
                      {copyState && copyState.id === entry.id && copyState.status !== COPY_OK && (
                        <span className="entry-copy-error" role="status">
                          This browser would not let the page use the clipboard, so copy the
                          address bar instead.
                        </span>
                      )}
                    </div>
                    )}

                    {/* Where to go next. Derived from the wording of the
                      * entries, so it is offered as "Related" and not as a
                      * prerequisite or a claim about the order to read them. */}
                    {isExpanded && (() => {
                      const related = relatedTerms(entry, CURIOUS_TERMS, 3);
                      if (related.length === 0) return null;
                      return (
                        <div className="entry-related">
                          <span className="related-label">Related</span>
                          {related.map((next) => (
                            <button
                              key={next.id}
                              type="button"
                              className="related-chip"
                              data-testid="related-term"
                              onClick={(event) => {
                                // The card itself toggles on click; a jump has to
                                // reach the chip rather than the wrapper.
                                event.stopPropagation();
                                openEntry(next.id);
                              }}
                            >
                              {next.term}
                            </button>
                          ))}
                        </div>
                      );
                    })()}
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
