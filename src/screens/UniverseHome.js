import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ArrowRight,
  LogOut,
  Search,
  X,
} from 'lucide-react';
import { KNOWLEDGE_FIELDS, KNOWLEDGE_STATS } from '../data/knowledgeFields';
import { resolveAtlasTopic, fieldCoverage } from '../data/atlasResolution';
import AtlasIndex from '../components/AtlasIndex';
import { PRIMARY_SCREENS } from '../navigation';
import { trackEvent } from '../utils/analytics';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/UniverseHome.css';

/**
 * No per-field icons any more.
 *
 * The index deliberately carries hierarchy in type alone - number, letterspaced
 * caps, body text - and a row of six lucide glyphs beside the field names put a
 * shape back into the level that was supposed to be readable as a number. The
 * icons were only ever used by the old field rail, which the index replaced.
 */
function makeSelection(field, discipline, parentModule, topic) {
  return { field, discipline, module: parentModule, topic };
}

function UniverseHome({ user, setScreen, setSelectedSubject, setLearnView, onOpenLesson, onOpenDeepRead, onForgetProfile, showToast }) {
  const initialField = KNOWLEDGE_FIELDS[0];
  const initialDiscipline = initialField.disciplines[0];
  const initialModule = initialDiscipline.modules[0];
  const [activeFieldId, setActiveFieldId] = useState(initialField.id);
  const [activeDisciplineId, setActiveDisciplineId] = useState(initialDiscipline.id);
  const [activeModuleName, setActiveModuleName] = useState(initialModule.name);
  const [selectedTopic, setSelectedTopic] = useState(initialModule.topics[0]);
  const [query, setQuery] = useState('');

  const activeField = KNOWLEDGE_FIELDS.find((field) => field.id === activeFieldId) || initialField;
  const activeDiscipline = activeField.disciplines.find((discipline) => discipline.id === activeDisciplineId) || activeField.disciplines[0];
  const activeModule = activeDiscipline.modules.find((item) => item.name === activeModuleName) || activeDiscipline.modules[0];
  const selection = makeSelection(activeField, activeDiscipline, activeModule, selectedTopic);

  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery.length < 2) return [];

    return KNOWLEDGE_FIELDS.flatMap((field) => {
      const fieldMatches = [field.label, field.eyebrow, field.description]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);

      return field.disciplines.flatMap((discipline) => {
        const disciplineMatches = [discipline.name, discipline.description]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

        return discipline.modules.flatMap((parentModule) => {
          const moduleMatches = parentModule.name.toLowerCase().includes(normalizedQuery);
          return parentModule.topics
            .filter((topic) => fieldMatches || disciplineMatches || moduleMatches || topic.toLowerCase().includes(normalizedQuery))
            .map((topic) => ({
              ...makeSelection(field, discipline, parentModule, topic),
              relevance: topic.toLowerCase().startsWith(normalizedQuery) ? 0
                : topic.toLowerCase().includes(normalizedQuery) ? 1
                  : parentModule.name.toLowerCase().includes(normalizedQuery) ? 2
                    : discipline.name.toLowerCase().includes(normalizedQuery) ? 3
                      : 4,
            }));
        });
      });
    }).sort((first, second) => first.relevance - second.relevance);
  }, [query]);

  useEffect(() => {
    trackEvent('screen_view', { screen: 'universe', design: 'editorial-atlas' });
  }, []);

  const selectField = (field) => {
    // Land on the first discipline's first topic. The index shows everything at
    // once, so there is nothing to expand and no reason to preserve a previous
    // field's expansion state.
    const discipline = field.disciplines[0];
    const parentModule = discipline.modules[0];
    setActiveFieldId(field.id);
    setActiveDisciplineId(discipline.id);
    setActiveModuleName(parentModule.name);
    setSelectedTopic(parentModule.topics[0]);
    setQuery('');
    trackEvent('curriculum_field_selected', { fieldId: field.id });
  };

  const selectSearchResult = (result) => {
    setActiveFieldId(result.field.id);
    setActiveDisciplineId(result.discipline.id);
    setActiveModuleName(result.module.name);
    setSelectedTopic(result.topic);
    setQuery('');
  };

  /**
   * What the currently selected topic actually resolves to.
   *
   * Recomputed from the selection rather than stored, so the preview can never
   * disagree with what the button will do. That disagreement was the original
   * bug: the preview said one thing and the button navigated to another.
   */
  const resolution = useMemo(
    () => resolveAtlasTopic({
      fieldId: selection.field.id,
      disciplineId: selection.discipline.id,
      moduleName: selection.module.name,
      topic: selection.topic,
    }),
    [selection.field.id, selection.discipline.id, selection.module.name, selection.topic]
  );

  /**
   * How much of the active field is actually written.
   *
   * Shown in the atlas so a reader can tell the difference between "this app
   * has 573 topics" and "this app has 7 written topics", which the old layout
   * made impossible to see.
   */
  const coverage = useMemo(() => {
    const topics = activeField.disciplines.flatMap((discipline) =>
      discipline.modules.flatMap((item) => item.topics));
    return fieldCoverage(activeField.id, topics);
  }, [activeField]);

  // What the reader is being offered, in words, derived from the same resolver
  // the button uses. Previously this string was hardcoded per branch and drifted
  // from what the click actually did.
  const outcomeLabel = {
    lesson: 'Read the lesson',
    'deep-read': 'Open the deep read',
    unwritten: 'Not written yet',
    'unmapped-field': 'Not written yet',
  }[resolution.kind];

  const openLearningPath = () => {
    trackEvent('atlas_topic_opened', {
      fieldId: activeField.id,
      disciplineId: activeDiscipline.id,
      topic: selectedTopic,
      outcome: resolution.kind,
    });

    // Real lesson content. Hand the subject and topic id to the screen that can
    // actually resolve and render it.
    if (resolution.kind === 'lesson') {
      setSelectedSubject(resolution.subject);
      onOpenLesson?.(resolution.subject, resolution.topicId);
      return;
    }

    // Deep multi-level content. Four exist today: black holes, philosophy,
    // history and computer science. The anchor is passed straight through, so
    // a topic that names a level opens on that level.
    if (resolution.kind === 'deep-read') {
      const SUBJECT_BY_FIELD = { philosophy: 'philosophy', history: 'history', science: 'physics' };
      setSelectedSubject(SUBJECT_BY_FIELD[resolution.fieldId] || 'physics');
      onOpenDeepRead?.(resolution.readId, resolution.levelId);
      return;
    }

    // Nothing behind it yet. Say so, in the topic's own name, rather than
    // sending the reader somewhere that will not contain the thing they asked
    // for.
    showToast?.(
      `${resolution.title} is listed in the atlas but not written yet. ${coverage.written} of ${coverage.written + coverage.unwritten + coverage.unmapped} topics in ${activeField.label} have content today.`,
      'info'
    );
  };

  const scrollToAtlas = () => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('knowledge-atlas')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const visibleDisciplines = query.trim().length >= 2
    ? activeField.disciplines.filter((discipline) =>
        [discipline.name, discipline.description, ...discipline.modules.flatMap((item) => [item.name, ...item.topics])]
          .join(' ')
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      )
    : activeField.disciplines;

  return (
    <div className="universe-home bg-[--bg-tertiary] min-h-screen text-[--text-primary]">
      <header className="uh-header bg-[--bg-tertiary]/85 backdrop-blur-md border-b border-[--text-primary]/10">
        <button className="uh-brand" type="button" onClick={() => setScreen('universe')} aria-label="VELORA home">
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
          <button type="button" className="uh-icon-button" onClick={onForgetProfile} aria-label="Forget this device profile" title="Removes the name stored in this browser. It is not a sign out."><LogOut size={17} /></button>
        </div>
      </header>

      <main className="uh-main">
        <section className="uh-hero" aria-labelledby="atlas-title">
          <div className="uh-hero-copy">
            <p className="uh-eyebrow">A curriculum for the endlessly curious</p>
            <h1 id="atlas-title">Follow your curiosity to the edge of understanding.</h1>
            <p className="uh-lede">Six great fields. Hundreds of connected ideas. Begin with a discipline, move through its subfields, and arrive at the concept you need next.</p>
            <div className="uh-hero-actions">
              <button
                type="button"
                className="uh-primary bg-[--text-secondary] hover:bg-[--text-secondary] text-[--bg-primary] font-medium px-5 py-2.5 rounded-full shadow-lg shadow-[--text-secondary]/20 transition-all"
                onClick={scrollToAtlas}
              >
                Explore the atlas <ArrowRight size={17} />
              </button>
              <span>No endless lists. Just a clear next step.</span>
            </div>
          </div>

          <aside className="uh-hero-index" aria-label="Atlas at a glance">
            <p className="uh-index-label">The atlas at a glance</p>
            <dl>
              <div><dt>Fields</dt><dd>{KNOWLEDGE_STATS.fields}</dd></div>
              <div><dt>Disciplines</dt><dd>{KNOWLEDGE_STATS.disciplines}</dd></div>
              <div><dt>Topics</dt><dd>{KNOWLEDGE_STATS.topics}</dd></div>
            </dl>
            <p>Field → discipline → subfield → topic</p>
          </aside>
        </section>

        <section id="knowledge-atlas" className="uh-atlas-section" aria-labelledby="atlas-heading">
          <div className="uh-section-heading-row">
            <div>
              <p className="uh-eyebrow">The knowledge hierarchy</p>
              <h2 id="atlas-heading" className="font-serif text-2xl font-light tracking-wide text-[--text-primary]">Explore the fields of human thought</h2>
            </div>
            <p>Choose a field, open a discipline, select a subfield, then choose a topic to preview its place in the whole.</p>
          </div>

          <div className="uh-search-wrap">
            <Search size={19} aria-hidden="true" />
            <label className="sr-only" htmlFor="curriculum-search">Search the knowledge atlas</label>
            <input
              id="curriculum-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search entanglement, monsoons, virtue ethics…"
              autoComplete="off"
            />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear curriculum search"><X size={17} /></button>}
            {query.trim().length >= 2 && (
              <div className="uh-search-results" role="region" aria-label="Curriculum search results">
                <p>{searchResults.length ? `${searchResults.length} matches across the atlas` : 'No matching ideas yet'}</p>
                {searchResults.slice(0, 8).map((result) => (
                  <button
                    type="button"
                    key={`${result.field.id}-${result.discipline.id}-${result.module.name}-${result.topic}`}
                    onClick={() => selectSearchResult(result)}
                  >
                    <span>{result.topic}</span>
                    <small>{result.field.label} / {result.discipline.name} / {result.module.name}</small>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/*
            The subject rail and the discipline panel, replaced by an index.

            The old layout was a column of subject cards that each expanded into
            a grid of pill buttons. Both halves are gone: the rail is now a
            thumb-index of fields, and the panel is a two-column index of
            disciplines and topics with nothing collapsed. A reader can see all
            55 physics topics without expanding a single section, which is the
            thing the pill grid could not do.
          */}
          <div className="uh-atlas-grid uh-atlas-indexed">
            <nav className="aix-tabs" aria-label="Knowledge fields">
              {KNOWLEDGE_FIELDS.map((field, index) => {
                const isActive = field.id === activeField.id;
                const topics = field.disciplines.reduce(
                  (total, discipline) => total + discipline.modules.reduce((sum, item) => sum + item.topics.length, 0),
                  0
                );
                const written = field.disciplines.reduce(
                  (total, discipline) => total + discipline.modules.reduce(
                    (sum, item) => sum + item.topics.filter((topic) => {
                      const kind = resolveAtlasTopic({ fieldId: field.id, disciplineId: discipline.id, moduleName: item.name, topic }).kind;
                      return kind === 'lesson' || kind === 'deep-read';
                    }).length,
                    0
                  ),
                  0
                );
                return (
                  <button
                    type="button"
                    key={field.id}
                    className="aix-tab"
                    onClick={() => selectField(field)}
                    aria-pressed={isActive}
                    aria-label={`${field.label}, ${field.disciplines.length} disciplines, ${written} of ${topics} topics written`}
                  >
                    <span className="aix-tab-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="aix-tab-name">{field.label}</span>
                    <span className="aix-tab-meta">{written}/{topics} written</span>
                  </button>
                );
              })}
            </nav>

            <div className="uh-field-panel">
              <header className="uh-field-header">
                <div>
                  <p className="uh-eyebrow">{activeField.eyebrow}</p>
                  <h3>{activeField.label}</h3>
                </div>
                <p>{activeField.description}</p>
              </header>

              <p className="uh-index-key">
                <span className="uh-key-item"><span className="aix-marker written"><span className="aix-marker-dot" />has content</span></span>
                <span className="uh-key-item"><span className="aix-marker unwritten"><span className="aix-marker-dot" />listed, not written yet</span></span>
              </p>

              <AtlasIndex
                field={activeField}
                disciplines={visibleDisciplines}
                selected={selection}
                onSelect={({ field, discipline, moduleName, topic }) => {
                  setActiveFieldId(field.id);
                  setActiveDisciplineId(discipline.id);
                  setActiveModuleName(moduleName);
                  setSelectedTopic(topic);
                  trackEvent('curriculum_topic_previewed', { fieldId: field.id, disciplineId: discipline.id, topic });
                }}
              />
            </div>
          </div>
        </section>


        <section className="uh-topic-preview" aria-live="polite" aria-label="Selected curriculum topic">
          <div>
            <p className="uh-eyebrow">Selected thread</p>
            <p className="uh-breadcrumbs">{selection.field.label} <span>/</span> {selection.discipline.name} <span>/</span> {selection.module.name}</p>
            <h2>{selection.topic}</h2>
            {/*
              The description used to be one fixed sentence for all 573 topics:
              "This topic sits inside a clear sequence...". It read as though
              the app knew something about the topic and it was filler. Now each
              branch states what is actually true, including when the honest
              answer is that nothing is written here yet.
            */}
            {resolution.kind === 'lesson' && (
              <p>A written lesson, {resolution.title === selection.topic ? 'ready to read' : `titled ${resolution.title}`}. Opening it goes straight to the lesson rather than to a list it is somewhere inside.</p>
            )}
            {resolution.kind === 'deep-read' && (
              <p>Deep multi-level material, not a single lesson. {resolution.title} runs as a sequence of levels you can read in order or dip into.</p>
            )}
            {resolution.kind === 'unwritten' && (
              <p><strong>Not written yet.</strong> This topic is a real part of {selection.module.name}, and it is listed so the shape of the field is visible, but there is no lesson behind it. It is marked rather than filled with a placeholder.</p>
            )}
            {resolution.kind === 'unmapped-field' && (
              <p><strong>Not written yet.</strong> {selection.field.label} has no curriculum behind it in this build. The topics are listed; the lessons are not written.</p>
            )}
          </div>
          {/*
            Coverage, so the atlas states its own honesty instead of implying
            that every topic is one click from content. This is the number the
            old layout had no way of showing.
          */}
          <p className="uh-coverage">
            {activeField.label}: <strong>{coverage.written}</strong> of {coverage.written + coverage.unwritten + coverage.unmapped} topics written
          </p>
          <button
            type="button"
            className="uh-primary bg-[--text-secondary] hover:bg-[--text-secondary] text-[--bg-primary] font-medium px-5 py-2.5 rounded-full shadow-lg shadow-[--text-secondary]/20 transition-all"
            onClick={openLearningPath}
          >
            {outcomeLabel} <ArrowRight size={17} />
          </button>
        </section>

        <section className="uh-method-section" aria-labelledby="method-title">
          <div>
            <p className="uh-eyebrow">A knowledge system that compounds</p>
            <h2 id="method-title" className="font-serif text-2xl font-light tracking-wide text-[--text-primary]">One idea should open the next.</h2>
          </div>
          <div className="uh-method-grid">
            <article><span>01</span><h3>Start broad</h3><p>See how the major field connects ideas across centuries and disciplines.</p></article>
            <article><span>02</span><h3>Drill with intention</h3><p>Move from a discipline into the subfield that answers your current question.</p></article>
            <article><span>03</span><h3>Keep the thread</h3><p>Every topic has a visible address, so the next concept is never lost in a flat list.</p></article>
          </div>
        </section>
      </main>

      <footer className="uh-footer">
        <span>VELORA</span>
        <p>Learning is exploration, not memorization.</p>
      </footer>
    </div>
  );
}

export default UniverseHome;
