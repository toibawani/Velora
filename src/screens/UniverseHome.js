import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, LogOut, Search, X } from 'lucide-react';
import { KNOWLEDGE_FIELDS, KNOWLEDGE_STATS } from '../data/knowledgeFields';
import { resolveAtlasTopic } from '../data/atlasResolution';
import { PRIMARY_SCREENS } from '../navigation';
import { trackEvent } from '../utils/analytics';
import { trackTopicOpened } from '../utils/siteAnalytics';
import { getLastLesson, saveLastLesson } from '../utils/resumePath';
import {
  getDailyRabbitHole,
  readNotebook,
  saveAnswer,
  removeAnswer,
  notebookMarkdown,
  NOTEBOOK_FILENAME,
} from '../utils/dailyRabbitHole';
import DailyDiagram from '../components/DailyDiagram';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/UniverseHome.css';
import '../styles/pillars.css';

/**
 * Home is two screens, not one long page.
 *
 * THE PROBLEM THIS REPLACES
 * -------------------------
 * The old home put a hero, the daily question, a resume card, a search box, a
 * topic preview plate and all 188 Science topics on one scroll. A reader who
 * wanted black holes arrived in the middle of an alphabetical index, and after
 * tapping a topic the panel they had to act on was several screens above them.
 * That is a page that contains everything and leads with nothing.
 *
 * WHAT IT IS NOW
 * --------------
 * "Today" is one card: the day's question, a diagram that makes it concrete,
 * the reader's own explanation, and the notebook of past answers. Below it, the
 * six fields as tabs.
 *
 * Opening a field replaces the page with that field: its disciplines down the
 * left, the chosen discipline's topics down the right, and a topic that has
 * content opens it on the spot. No preview panel, no scrolling back up, no
 * second button that says what the first one already said.
 */

const SUBJECT_BY_FIELD = { philosophy: 'philosophy', history: 'history', science: 'physics' };

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

/** Everything a field contains, counted once. */
const fieldTotals = (field) => {
  let total = 0;
  let written = 0;
  field.disciplines.forEach((discipline) => {
    discipline.modules.forEach((moduleItem) => {
      moduleItem.topics.forEach((topic) => {
        total += 1;
        const kind = resolveAtlasTopic({
          fieldId: field.id,
          disciplineId: discipline.id,
          moduleName: moduleItem.name,
          topic,
        }).kind;
        if (kind === 'lesson' || kind === 'deep-read') written += 1;
      });
    });
  });
  return { total, written };
};

function UniverseHome({
  user,
  setScreen,
  setSelectedSubject,
  onOpenLesson,
  onOpenDeepRead,
  onForgetProfile,
  showToast,
}) {
  const [view, setView] = useState('today');
  const [activeFieldId, setActiveFieldId] = useState(KNOWLEDGE_FIELDS[0].id);
  const [activeDisciplineId, setActiveDisciplineId] = useState(KNOWLEDGE_FIELDS[0].disciplines[0].id);
  const [query, setQuery] = useState('');
  const [notebook, setNotebook] = useState(() => readNotebook());

  const daily = useMemo(() => getDailyRabbitHole(), []);
  // Read from the notebook already in state rather than going back to storage,
  // so saving an edit updates the label and the list in the same render.
  const savedToday = useMemo(
    () => notebook.find((item) => item.date === daily?.date) || null,
    [notebook, daily]
  );
  const [draft, setDraft] = useState(() => savedToday?.text || '');
  const [saveNote, setSaveNote] = useState('');
  const lastLesson = getLastLesson();

  useEffect(() => {
    trackEvent('screen_view', { screen: 'universe', design: 'daily-rabbit-hole' });
  }, []);

  const activeField = KNOWLEDGE_FIELDS.find((field) => field.id === activeFieldId) || KNOWLEDGE_FIELDS[0];
  const activeDiscipline =
    activeField.disciplines.find((discipline) => discipline.id === activeDisciplineId) ||
    activeField.disciplines[0];

  const totals = useMemo(() => fieldTotals(activeField), [activeField]);

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized.length < 2) return [];
    return KNOWLEDGE_FIELDS.flatMap((field) =>
      field.disciplines.flatMap((discipline) =>
        discipline.modules.flatMap((moduleItem) =>
          moduleItem.topics
            .filter((topic) => topic.toLowerCase().includes(normalized))
            .map((topic) => ({ field, discipline, module: moduleItem, topic }))
        )
      )
    ).slice(0, 8);
  }, [query]);

  /** Open whatever a topic actually resolves to. There is no preview step. */
  const openResolution = (resolution, fieldLabel, coverage) => {
    trackTopicOpened(resolution.title, resolution.subject || fieldLabel);

    if (resolution.kind === 'lesson') {
      setSelectedSubject(resolution.subject);
      saveLastLesson(resolution.subject, resolution.topicId, resolution.title);
      onOpenLesson?.(resolution.subject, resolution.topicId);
      return;
    }
    if (resolution.kind === 'deep-read') {
      setSelectedSubject(SUBJECT_BY_FIELD[resolution.fieldId] || 'physics');
      onOpenDeepRead?.(resolution.readId, resolution.levelId);
      return;
    }
    showToast?.(
      `${resolution.title} is listed in the atlas but not written yet. ${coverage.written} of ${coverage.total} topics in ${fieldLabel} have content today.`,
      'info'
    );
  };

  const openTopic = (field, discipline, moduleItem, topic) => {
    const resolution = resolveAtlasTopic({
      fieldId: field.id,
      disciplineId: discipline.id,
      moduleName: moduleItem.name,
      topic,
    });
    openResolution(resolution, field.label, fieldTotals(field));
    trackEvent('atlas_topic_opened', {
      fieldId: field.id,
      disciplineId: discipline.id,
      topic,
      outcome: resolution.kind,
    });
  };

  const openField = (field) => {
    setActiveFieldId(field.id);
    setActiveDisciplineId(field.disciplines[0].id);
    setView('subject');
    trackEvent('curriculum_field_selected', { fieldId: field.id });
    window.scrollTo?.({ top: 0, behavior: 'auto' });
  };

  const readTheFullIdea = () => {
    if (!daily?.read) return;
    if (daily.read.kind === 'lesson') {
      setSelectedSubject(daily.read.subject);
      onOpenLesson?.(daily.read.subject, daily.read.topicId);
      return;
    }
    setSelectedSubject(SUBJECT_BY_FIELD[daily.term.subject] || 'physics');
    onOpenDeepRead?.(daily.read.readId);
  };

  const handleSave = () => {
    const result = saveAnswer({
      date: daily.date,
      entryId: daily.id,
      prompt: daily.prompt,
      termId: daily.termId,
      text: draft,
    });
    if (result === 'none') {
      setNotebook(readNotebook());
      setSaveNote(`Saved for ${formatDate(daily.date)}.`);
      showToast?.('Saved to your notebook.', 'success');
    } else {
      setSaveNote('This browser refused the write, so nothing was saved.');
      showToast?.('This browser refused to store the answer.', 'info');
    }
  };

  const handleDelete = (date) => {
    setNotebook(readNotebook().filter((item) => item.date !== date));
    removeAnswer(date);
    if (date === daily.date) setDraft('');
    showToast?.('Removed from your notebook.', 'info');
  };

  const exportNotebook = () => {
    try {
      const blob = new Blob([notebookMarkdown(notebook)], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = NOTEBOOK_FILENAME;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showToast?.('Notebook exported as Markdown.', 'success');
    } catch {
      showToast?.('This browser would not download the file.', 'info');
    }
  };

  const searchBox = (
    <div className="rh-search">
      <Search size={18} aria-hidden="true" />
      <label className="sr-only" htmlFor="curriculum-search">Search the knowledge atlas</label>
      <input
        id="curriculum-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search entanglement, monsoons, virtue ethics…"
        autoComplete="off"
      />
      {query && (
        <button type="button" className="rh-search-clear" onClick={() => setQuery('')} aria-label="Clear curriculum search">
          <X size={16} />
        </button>
      )}
      {query.trim().length >= 2 && (
        <div className="rh-search-results" role="region" aria-label="Curriculum search results">
          <p>
            {searchResults.length
              ? `${searchResults.length} matches across the atlas`
              : 'No matching ideas yet'}
          </p>
          {searchResults.map((result) => (
            <button
              type="button"
              key={`${result.field.id}-${result.discipline.id}-${result.module.name}-${result.topic}`}
              aria-label={`${result.topic}, ${result.field.label}`}
              onClick={() => {
                openTopic(result.field, result.discipline, result.module, result.topic);
                setQuery('');
              }}
            >
              <span>{result.topic}</span>
              <small>{result.field.label} / {result.discipline.name}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const fieldTabs = (current, onOpen, label) => (
    <nav className="rh-fields" aria-label={label}>
      {KNOWLEDGE_FIELDS.map((field, index) => {
        const { written, total } = fieldTotals(field);
        return (
          <button
            type="button"
            key={field.id}
            className="rh-field"
            aria-pressed={current === field.id}
            aria-label={`${field.label}, ${written} of ${total} topics written`}
            onClick={() => onOpen(field)}
          >
            <span className="rh-field-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="rh-field-name">{field.label}</span>
            <span className="rh-field-meta">{written}/{total}</span>
          </button>
        );
      })}
    </nav>
  );

  const resumeCard = lastLesson && (
    <section className="rh-resume" aria-labelledby="rh-resume-title">
      <div>
        <p className="rh-eyebrow">Pick up where you left off</p>
        <h2 id="rh-resume-title">{lastLesson.topicTitle}</h2>
        <p className="rh-resume-subject">{lastLesson.subject}</p>
        {Number.isFinite(lastLesson.percent) && (
          <>
            <div
              className="rh-resume-bar"
              role="progressbar"
              aria-label={`${lastLesson.topicTitle} read`}
              aria-valuenow={lastLesson.percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span className="rh-resume-fill" style={{ width: `${lastLesson.percent}%` }} />
            </div>
            <p className="rh-resume-percent">{lastLesson.percent}% read</p>
          </>
        )}
      </div>
      <button
        type="button"
        className="vl-btn vl-btn--quiet"
        onClick={() => {
          setSelectedSubject(lastLesson.subject);
          onOpenLesson?.(lastLesson.subject, lastLesson.topicId);
        }}
      >
        Resume <ArrowRight size={15} aria-hidden="true" />
      </button>
    </section>
  );

  return (
    <div className="universe-home">
      <header className="uh-header">
        <button className="uh-brand" type="button" onClick={() => setView('today')} aria-label="VELORA home">
          <span className="uh-brand-mark">V</span>
          <span><strong>VELORA</strong><small>The knowledge atlas</small></span>
        </button>

        <nav className="uh-nav-links" aria-label="Primary navigation">
          {PRIMARY_SCREENS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                className={`uh-nav-item ${item.id === 'universe' ? 'active' : ''}`}
                onClick={() => setScreen(item.id)}
                aria-current={item.id === 'universe' ? 'page' : undefined}
              >
                <Icon size={16} aria-hidden="true" /> {item.label}
              </button>
            );
          })}
        </nav>

        <div className="uh-header-actions">
          <span className="uh-user-greeting">Welcome, {user?.name || 'scholar'}</span>
          <ThemeToggle />
          <button
            type="button"
            className="uh-icon-button"
            onClick={onForgetProfile}
            aria-label="Forget this device profile"
            title="Removes the name stored in this browser. It is not a sign out."
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>

      {view === 'today' ? (
        <main className="uh-main rh-main">
          <p className="rh-dateline">
            The Daily Rabbit Hole
            <span aria-hidden="true"> · </span>
            <time dateTime={daily?.date}>{daily ? formatDate(daily.date) : ''}</time>
          </p>

          <h1 className="rh-title">
            One question a day.
            <em>Answer it in your own words.</em>
          </h1>
          <p className="rh-intro">
            The question stays the same until midnight, then changes. Nothing is scored,
            nothing is counted, and what you write stays in this browser until you export it.
          </p>

          {daily && (
            <article className="rh-day" aria-labelledby="rh-question">
              <div className="rh-day-head">
                <span>{daily.term.subject} · Curious Dictionary</span>
                <span className="rh-day-tag">{daily.term.term}</span>
              </div>

              <h2 id="rh-question">{daily.prompt}</h2>
              <p className="rh-lead">{daily.lead}</p>

              <div className="rh-day-grid">
                <div className="rh-day-figure">
                  <DailyDiagram kind={daily.diagram} />
                  <p className="rh-notice">
                    <strong>What to notice.</strong> {daily.notice}
                  </p>
                </div>

                <div className="rh-write">
                <label htmlFor="rh-answer">Explain it back, in your own words</label>
                <textarea
                  id="rh-answer"
                  rows={4}
                  value={draft}
                  onChange={(event) => {
                    setDraft(event.target.value);
                    setSaveNote('');
                  }}
                  placeholder="Start anywhere. One sentence is enough."
                />
                <div className="rh-write-row">
                  <button
                    type="button"
                    className="vl-btn rh-save"
                    onClick={handleSave}
                    disabled={!draft.trim()}
                  >
                    {savedToday ? 'Update today’s answer' : 'Save to notebook'}
                  </button>
                  <button type="button" className="vl-textlink" onClick={exportNotebook}>
                    Export notebook as Markdown
                  </button>
                </div>
                  <p className="rh-save-note" role="status">
                    {saveNote || (savedToday ? 'An answer for today is already in your notebook.' : '')}
                  </p>
                </div>
              </div>

              <details className="rh-compare">
                <summary>Compare with the dictionary</summary>
                <p className="rh-term">
                  <strong>{daily.term.term}</strong> {daily.term.tagline}
                </p>
                <p>{daily.term.explanation}</p>
                <p className="rh-example">Example. {daily.term.example}</p>
              </details>

              <div className="rh-day-foot">
                {daily.read && (
                  <button type="button" className="vl-btn vl-btn--quiet" onClick={readTheFullIdea}>
                    Read the full idea <ArrowRight size={15} aria-hidden="true" />
                  </button>
                )}
                <span>{daily.term.term} · {daily.term.subject}</span>
              </div>
            </article>
          )}

          <section className="rh-pillars" aria-labelledby="rh-pillars-title">
            <div className="rh-shelf-head">
              <p className="rh-eyebrow">Three ways in</p>
              <h2 id="rh-pillars-title">Go deeper than a topic.</h2>
              <p>
                A written library of strange results, a laboratory whose numbers come from real
                equations, and eight thinkers you can argue with.
              </p>
            </div>
            <div className="rh-pillar-grid">
              <button type="button" className="rh-pillar" onClick={() => setScreen('dossiers')}>
                <span className="rh-pillar-number">01</span>
                <strong>Dossiers</strong>
                <span>
                  Long-form essays on the Unruh effect, time crystals, Gödel, the wood wide web. Terms
                  defined, equations unpacked, evidence and disputes labelled.
                </span>
                <span className="rh-pillar-open">
                  Enter the library <ArrowRight size={14} aria-hidden="true" />
                </span>
              </button>
              <button type="button" className="rh-pillar" onClick={() => setScreen('lab')}>
                <span className="rh-pillar-number">02</span>
                <strong>The Lab</strong>
                <span>
                  Tunnelling, the Lorenz attractor, the logistic map and the quantum Zeno effect. Change
                  a parameter and the model is recomputed, with its limits stated.
                </span>
                <span className="rh-pillar-open">
                  Run an experiment <ArrowRight size={14} aria-hidden="true" />
                </span>
              </button>
              <button type="button" className="rh-pillar" onClick={() => setScreen('dialogues')}>
                <span className="rh-pillar-number">03</span>
                <strong>Velora Minds</strong>
                <span>
                  Einstein on time, Nietzsche on morality, Sontag on images. Researched profiles,
                  sourced positions, and debates that are actually disagreements.
                </span>
                <span className="rh-pillar-open">
                  Start a conversation <ArrowRight size={14} aria-hidden="true" />
                </span>
              </button>
            </div>
          </section>

          <section className="rh-notebook" aria-labelledby="rh-notebook-title">
            <div className="rh-notebook-head">
              <h2 id="rh-notebook-title">Your notebook</h2>
              <p>
                {notebook.length === 0
                  ? 'Nothing saved yet. Today’s answer will be the first entry.'
                  : `${notebook.length} ${notebook.length === 1 ? 'answer' : 'answers'} kept in this browser.`}
              </p>
            </div>

            {notebook.length === 0 ? (
              <p className="rh-empty">
                The notebook is a local file, not an account. It is here until you clear this
                browser’s storage, and the export above is the copy that survives that.
              </p>
            ) : (
              <ol className="rh-entries">
                {notebook.map((entry) => (
                  <li key={entry.date} className="rh-entry">
                    <div className="rh-entry-head">
                      <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                      <button
                        type="button"
                        className="rh-entry-remove"
                        onClick={() => handleDelete(entry.date)}
                        aria-label={`Delete the answer for ${formatDate(entry.date)}`}
                      >
                        <X size={15} />
                      </button>
                    </div>
                    <p className="rh-entry-question">{entry.prompt}</p>
                    <p className="rh-entry-answer">{entry.text}</p>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {resumeCard}

          <section className="rh-shelf" aria-labelledby="rh-shelf-title">
            <div className="rh-shelf-head">
              <p className="rh-eyebrow">The atlas</p>
              <h2 id="rh-shelf-title">Every field is a shelf.</h2>
              <p>
                Open one and it replaces this page: its disciplines on the left, their topics on
                the right, and anything written opens on the spot.
              </p>
            </div>

            {searchBox}
            {fieldTabs(null, openField, 'Knowledge fields')}

            <dl className="rh-totals">
              <div><dt>Fields</dt><dd>{String(KNOWLEDGE_STATS.fields).padStart(2, '0')}</dd></div>
              <div><dt>Disciplines</dt><dd>{KNOWLEDGE_STATS.disciplines}</dd></div>
              <div><dt>Topics listed</dt><dd>{KNOWLEDGE_STATS.topics}</dd></div>
            </dl>
          </section>

          <footer className="rh-footer">
            <span>VELORA</span>
            <p>Learning is exploration, not memorization.</p>
          </footer>
        </main>
      ) : (
        <main className="uh-main shelf-main">
          <button type="button" className="shelf-back" onClick={() => setView('today')}>
            <ArrowLeft size={16} aria-hidden="true" /> Today
          </button>

          <header className="shelf-hero">
            <p className="rh-eyebrow">The atlas · {activeField.eyebrow}</p>
            <h1>{activeField.label}</h1>
            <p className="shelf-description">{activeField.description}</p>
            <p className="shelf-count">
              <strong>{totals.written}</strong> of {totals.total} topics written
            </p>
          </header>

          {fieldTabs(activeField.id, openField, 'Knowledge fields')}

          <div className="shelf-split">
            <nav className="shelf-disciplines" aria-label={`Disciplines in ${activeField.label}`}>
              {activeField.disciplines.map((discipline) => {
                const count = discipline.modules.reduce((sum, item) => sum + item.topics.length, 0);
                const isActive = discipline.id === activeDiscipline.id;
                return (
                  <button
                    type="button"
                    key={discipline.id}
                    className="shelf-discipline"
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => setActiveDisciplineId(discipline.id)}
                  >
                    <span>{discipline.name}</span>
                    <span className="shelf-discipline-count">{count}</span>
                  </button>
                );
              })}
            </nav>

            <div className="shelf-topics">
              <header className="shelf-topics-head">
                <h2>{activeDiscipline.name}</h2>
                <p>{activeDiscipline.description}</p>
              </header>

              {activeDiscipline.modules.map((moduleItem) => (
                <section key={moduleItem.name} className="shelf-module" aria-labelledby={`mod-${moduleItem.name}`}>
                  <h3 id={`mod-${moduleItem.name}`}>{moduleItem.name}</h3>
                  <ul>
                    {moduleItem.topics.map((topic) => {
                      const resolution = resolveAtlasTopic({
                        fieldId: activeField.id,
                        disciplineId: activeDiscipline.id,
                        moduleName: moduleItem.name,
                        topic,
                      });
                      const written = resolution.kind === 'lesson' || resolution.kind === 'deep-read';
                      return (
                        <li key={topic}>
                          {written ? (
                            <button
                              type="button"
                              className="shelf-topic"
                              aria-label={`${topic}, open`}
                              onClick={() => openTopic(activeField, activeDiscipline, moduleItem, topic)}
                            >
                              <span className="shelf-topic-name">{topic}</span>
                              <span className="shelf-leader" aria-hidden="true" />
                              <span className="shelf-topic-status">
                                {resolution.kind === 'deep-read' ? 'deep read' : 'read'}
                                <ArrowRight size={14} aria-hidden="true" />
                              </span>
                            </button>
                          ) : (
                            <span className="shelf-topic is-unwritten" aria-label={`${topic}, not written yet`}>
                              <span className="shelf-topic-name">{topic}</span>
                              <span className="shelf-leader" aria-hidden="true" />
                              <span className="shelf-topic-status">not written yet</span>
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </div>

          <footer className="rh-footer">
            <span>VELORA</span>
            <p>{totals.written} of {totals.total} topics in {activeField.label} have content today.</p>
          </footer>
        </main>
      )}
    </div>
  );
}

export default UniverseHome;
