import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, ArrowRight, ArrowUpRight, Search, X } from 'lucide-react';
import {
  DOSSIERS,
  DOSSIER_WORD_COUNT,
  LENSES,
  getDossier,
  getRelatedDossiers,
  searchDossiers,
} from '../data/dossiers';
import GlossaryText, { GlossaryFieldProvider } from '../components/GlossaryText';
import DossierArt, { motifFor } from '../components/DossierArt';
import '../styles/Dossiers.css';

function Section({ section, index }) {
  const Heading = index === 0 ? 'h2' : 'h2';
  const body = (section.body || []).map((paragraph, i) => (
    <p key={`p-${i}`}>
      <GlossaryText text={paragraph} />
    </p>
  ));

  if (section.kind === 'math') {
    return (
      <section className="ds-section ds-section--math" aria-labelledby={`ds-h-${index}`}>
        <Heading id={`ds-h-${index}`}>{section.heading}</Heading>
        <div className="ds-equation" role="math" aria-label={section.equation}>
          {section.equation}
        </div>
        <dl className="ds-symbols">
          {section.symbols.map((symbol) => (
            <div key={symbol.symbol}>
              <dt>{symbol.symbol}</dt>
              <dd>
                <GlossaryText text={symbol.meaning} limit={1} />
                {symbol.unit ? <span className="ds-unit"> · {symbol.unit}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
        {body}
        {section.assumptions?.length ? (
          <div className="ds-assumptions">
            <h3>What the equation assumes</h3>
            <ul>
              {section.assumptions.map((assumption) => (
                <li key={assumption}>
                  <GlossaryText text={assumption} limit={1} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    );
  }

  if (section.kind === 'terms') {
    return (
      <section className="ds-section ds-section--terms" aria-labelledby={`ds-h-${index}`}>
        <Heading id={`ds-h-${index}`}>{section.heading}</Heading>
        <dl className="ds-terms">
          {section.items.map((item) => (
            <div key={item.term}>
              <dt>{item.term}</dt>
              <dd>
                <GlossaryText text={item.definition} limit={2} />
              </dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  if (section.kind === 'steps') {
    return (
      <section className="ds-section" aria-labelledby={`ds-h-${index}`}>
        <Heading id={`ds-h-${index}`}>{section.heading}</Heading>
        <ol className="ds-steps">
          {section.items.map((item, i) => (
            <li key={item.title}>
              <span className="ds-step-number" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>
                  <GlossaryText text={item.text} limit={2} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  if (section.kind === 'table') {
    return (
      <section className="ds-section" aria-labelledby={`ds-h-${index}`}>
        <Heading id={`ds-h-${index}`}>{section.heading}</Heading>
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                {section.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row) => (
                <tr key={row.join('-')}>
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={`${cell}-${i}`} scope="row">
                        <GlossaryText text={cell} limit={1} />
                      </th>
                    ) : (
                      <td key={`${cell}-${i}`}>
                        <GlossaryText text={cell} limit={1} />
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {section.note ? (
          <p className="ds-table-note">
            <GlossaryText text={section.note} limit={1} />
          </p>
        ) : null}
      </section>
    );
  }

  if (section.kind === 'misconception') {
    return (
      <section className="ds-section ds-section--correction" aria-labelledby={`ds-h-${index}`}>
        <p className="ds-correction-label">Correction</p>
        <Heading id={`ds-h-${index}`}>{section.heading}</Heading>
        <blockquote className="ds-claim">
          <GlossaryText text={section.claim} limit={1} />
        </blockquote>
        <p>
          <GlossaryText text={section.correction} limit={2} />
        </p>
      </section>
    );
  }

  if (section.kind === 'questions') {
    return (
      <section className="ds-section ds-section--questions" aria-labelledby={`ds-h-${index}`}>
        <Heading id={`ds-h-${index}`}>{section.heading}</Heading>
        <ul>
          {section.items.map((item) => (
            <li key={item}>
              <GlossaryText text={item} limit={1} />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="ds-section" aria-labelledby={`ds-h-${index}`}>
      <Heading id={`ds-h-${index}`}>{section.heading}</Heading>
      {body}
    </section>
  );
}

Section.propTypes = {
  section: PropTypes.shape({
    kind: PropTypes.string,
    heading: PropTypes.string,
    body: PropTypes.arrayOf(PropTypes.string),
    equation: PropTypes.string,
    symbols: PropTypes.array,
    assumptions: PropTypes.arrayOf(PropTypes.string),
    items: PropTypes.array,
    rows: PropTypes.array,
    columns: PropTypes.arrayOf(PropTypes.string),
    note: PropTypes.string,
    claim: PropTypes.string,
    correction: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

function DossierReader({ dossier, onBack, onOpen, readIds }) {
  const headingRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const articleRef = useRef(null);

  useEffect(() => {
    setActiveIndex(0);
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo?.({ top: 0, behavior: 'auto' });
    if (articleRef.current) articleRef.current.scrollTop = 0;
  }, [dossier.id]);

  // Reading progress, measured against the article rather than the window so
  // the rail can show it even when the page is not the only scroll container.
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dossier.id]);

  const related = getRelatedDossiers(dossier);
  const index = DOSSIERS.findIndex((item) => item.id === dossier.id);
  const next = DOSSIERS[(index + 1) % DOSSIERS.length];

  const jumpTo = (i) => {
    setActiveIndex(i);
    const target = document.getElementById(`ds-h-${i}`);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <main className="ds-reader">
      <div className="ds-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <div className="ds-reader-bar">
        <button type="button" className="ds-back" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" /> The library
        </button>
        <span className="ds-reader-meta">
          {dossier.field} · {dossier.minutes} min · {readIds.has(dossier.id) ? 'read' : 'unread'}
        </span>
      </div>

      <div className="ds-reader-grid">
        <nav className="ds-contents" aria-label={`Contents of ${dossier.title}`}>
          <p className="ds-contents-label">Contents</p>
          <ol>
            {dossier.sections.map((section, i) => (
              <li key={section.heading}>
                <button
                  type="button"
                  className={i === activeIndex ? 'active' : ''}
                  aria-current={i === activeIndex ? 'true' : undefined}
                  onClick={() => jumpTo(i)}
                >
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {section.heading}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <GlossaryFieldProvider field={dossier.field}>
        <article className="ds-article" ref={articleRef}>
          <header>
            <p className="ds-kicker">
              {dossier.field} <span aria-hidden="true">/</span> {dossier.difficulty}
            </p>
            <h1 ref={headingRef} tabIndex={-1}>
              {dossier.title}
            </h1>
            <p className="ds-standfirst">
              <GlossaryText text={dossier.standfirst} limit={2} />
            </p>
            <dl className="ds-facts">
              <div>
                <dt>Status</dt>
                <dd>{dossier.status}</dd>
              </div>
              <div>
                <dt>Lenses</dt>
                <dd>{dossier.lenses.join(', ')}</dd>
              </div>
              <div>
                <dt>Reading</dt>
                <dd>{dossier.minutes} minutes</dd>
              </div>
            </dl>
          </header>

          <DossierArt motif={motifFor(dossier.id)} seed={dossier.id} label={`${dossier.field} / plate`} />

          <p className="ds-opening">
            <GlossaryText text={dossier.opening} limit={3} />
          </p>

          {dossier.sections.map((section, i) => (
            <Section key={section.heading} section={section} index={i} />
          ))}

          <section className="ds-sources" aria-labelledby="ds-sources-heading">
            <h2 id="ds-sources-heading">Sources</h2>
            <p className="ds-sources-note">
              These are the papers and books the dossier is built from. Where a claim is contested, the
              disagreement is named in the text rather than hidden behind a single citation.
            </p>
            <ol>
              {dossier.sources.map((source) => (
                <li key={source.label}>
                  <a href={source.url} target="_blank" rel="noreferrer noopener">
                    {source.label} <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ol>
          </section>

          {related.length > 0 && (
            <section className="ds-related" aria-labelledby="ds-related-heading">
              <h2 id="ds-related-heading">Read next</h2>
              <div className="ds-related-grid">
                {related.map((item) => (
                  <button key={item.id} type="button" onClick={() => onOpen(item.id)}>
                    <span>{item.field}</span>
                    <strong>{item.title}</strong>
                    <small>{item.standfirst.split('. ')[0]}.</small>
                  </button>
                ))}
              </div>
            </section>
          )}

          <footer className="ds-next">
            <span>Next dossier</span>
            <button type="button" onClick={() => onOpen(next.id)}>
              {next.title} <ArrowRight size={16} aria-hidden="true" />
            </button>
          </footer>
        </article>
        </GlossaryFieldProvider>
      </div>
    </main>
  );
}

DossierReader.propTypes = {
  dossier: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  readIds: PropTypes.instanceOf(Set).isRequired,
};

function Dossiers({ setScreen }) {
  const [lens, setLens] = useState('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);
  const [readIds, setReadIds] = useState(() => new Set());

  const openDossier = (id) => {
    if (!getDossier(id)) return;
    setOpenId(id);
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const byQuery = searchDossiers(query);
    if (lens === 'all') return byQuery;
    return byQuery.filter((dossier) => dossier.lenses.includes(lens));
  }, [lens, query]);

  const active = openId ? getDossier(openId) : null;

  if (active) {
    return (
      <div className="ds-shell">
        <DossierReader
          dossier={active}
          onBack={() => {
            setOpenId(null);
            window.scrollTo?.({ top: 0 });
          }}
          onOpen={openDossier}
          readIds={readIds}
        />
      </div>
    );
  }

  return (
    <div className="ds-shell">
      <header className="ds-masthead">
        <div>
          <p className="ds-kicker">The long-form library</p>
          <h1>Dossiers</h1>
          <p className="ds-lead">
            Each dossier takes one strange result and follows it all the way down: where it came from,
            what it actually says, the mathematics that carries it, the evidence that exists, and the
            part that is still argued about. Written as arguments, not summaries.
          </p>
        </div>
        <dl className="ds-masthead-counts">
          <div>
            <dt>Dossiers</dt>
            <dd>{String(DOSSIERS.length).padStart(2, '0')}</dd>
          </div>
          <div>
            <dt>Words written</dt>
            <dd>{DOSSIER_WORD_COUNT.toLocaleString()}</dd>
          </div>
          <div>
            <dt>Sources</dt>
            <dd>{DOSSIERS.reduce((sum, item) => sum + item.sources.length, 0)}</dd>
          </div>
        </dl>
      </header>

      <div className="ds-controls">
        <div className="ds-search">
          <Search size={17} aria-hidden="true" />
          <label className="sr-only" htmlFor="dossier-search">
            Search the dossiers
          </label>
          <input
            id="dossier-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the vacuum, infinity, networks…"
            autoComplete="off"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear dossier search">
              <X size={15} />
            </button>
          )}
        </div>

        <nav className="ds-lenses" aria-label="Filter by lens">
          <button
            type="button"
            className={lens === 'all' ? 'active' : ''}
            aria-pressed={lens === 'all'}
            onClick={() => setLens('all')}
          >
            All <span>{DOSSIERS.length}</span>
          </button>
          {LENSES.map((item) => {
            const count = DOSSIERS.filter((dossier) => dossier.lenses.includes(item.label)).length;
            if (!count) return null;
            return (
              <button
                key={item.id}
                type="button"
                className={lens === item.label ? 'active' : ''}
                aria-pressed={lens === item.label}
                onClick={() => setLens(item.label)}
                title={item.note}
              >
                {item.label} <span>{count}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {filtered.length === 0 ? (
        <p className="ds-empty">
          Nothing in the library matches “{query}”. The search runs over the full text of every dossier,
          not only the titles.
        </p>
      ) : (
        <ol className="ds-grid">
          {filtered.map((dossier) => (
            <li key={dossier.id}>
              <button type="button" className="ds-card" onClick={() => openDossier(dossier.id)}>
                <span className="ds-card-top">
                  <span>{dossier.field}</span>
                  <span>{readIds.has(dossier.id) ? 'read' : `${dossier.minutes} min`}</span>
                </span>
                <strong>{dossier.title}</strong>
                <span className="ds-card-standfirst">{dossier.standfirst}</span>
                <span className="ds-card-foot">
                  <span>{dossier.status}</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}

      <section className="ds-how" aria-labelledby="ds-how-heading">
        <h2 id="ds-how-heading">How these are written</h2>
        <div className="ds-how-grid">
          <p>
            <strong>Every term is defined where it first matters.</strong> A dossier does not assume you
            already know what a Bogoliubov transformation is, or what a non-measurable set is. It tells you,
            then uses it. Any word with a dotted underline opens its definition without leaving the page.
          </p>
          <p>
            <strong>Every equation is unpacked.</strong> What each symbol means, its units, what the
            equation assumes, and what changes when a variable changes. A formula you cannot read is
            decoration.
          </p>
          <p>
            <strong>Established results and live disputes are labelled.</strong> Where a claim is measured,
            the experiment is named. Where it is a prediction with no measurement, the dossier says so. Where
            the popular explanation is wrong, there is a correction section.
          </p>
        </div>
      </section>

      <footer className="ds-footer">
        <button type="button" onClick={() => setScreen('universe')}>
          <ArrowLeft size={15} aria-hidden="true" /> Back to the atlas
        </button>
        <p>{DOSSIER_WORD_COUNT.toLocaleString()} words across {DOSSIERS.length} dossiers, all written for this library.</p>
      </footer>
    </div>
  );
}

Dossiers.propTypes = {
  setScreen: PropTypes.func,
};

export default Dossiers;
