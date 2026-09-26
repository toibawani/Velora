import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BookText,
  ChevronDown,
  Compass,
  Gamepad2,
  Home,
  Layers3,
  LogOut,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { KNOWLEDGE_FIELDS, KNOWLEDGE_STATS } from '../data/knowledgeFields';
import { trackEvent } from '../utils/analytics';
import '../styles/UniverseHome.css';

const FIELD_ICONS = {
  science: Sparkles,
  philosophy: Compass,
  history: BookOpen,
  'political-science': Layers3,
  geography: Compass,
  literature: BookOpen,
};

function makeSelection(field, discipline, parentModule, topic) {
  return { field, discipline, module: parentModule, topic };
}

function UniverseHome({ user, setScreen, setSelectedSubject, setLearnView, onLogout, showToast }) {
  const initialField = KNOWLEDGE_FIELDS[0];
  const initialDiscipline = initialField.disciplines[0];
  const initialModule = initialDiscipline.modules[0];
  const [activeFieldId, setActiveFieldId] = useState(initialField.id);
  const [activeDisciplineId, setActiveDisciplineId] = useState(initialDiscipline.id);
  const [activeModuleName, setActiveModuleName] = useState(initialModule.name);
  const [selectedTopic, setSelectedTopic] = useState(initialModule.topics[0]);
  const [expandedDisciplineId, setExpandedDisciplineId] = useState(initialDiscipline.id);
  const [query, setQuery] = useState('');

  const activeField = KNOWLEDGE_FIELDS.find((field) => field.id === activeFieldId) || initialField;
  const activeDiscipline = activeField.disciplines.find((discipline) => discipline.id === activeDisciplineId) || activeField.disciplines[0];
  const activeModule = activeDiscipline.modules.find((item) => item.name === activeModuleName) || activeDiscipline.modules[0];
  const selection = makeSelection(activeField, activeDiscipline, activeModule, selectedTopic);
  const lessonFieldId = activeField.id === 'science'
    ? (activeDiscipline.id === 'physics' ? 'physics' : undefined)
    : activeField.lessonFieldId;

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
    const discipline = field.disciplines[0];
    const parentModule = discipline.modules[0];
    setActiveFieldId(field.id);
    setActiveDisciplineId(discipline.id);
    setActiveModuleName(parentModule.name);
    setSelectedTopic(parentModule.topics[0]);
    setExpandedDisciplineId(discipline.id);
    setQuery('');
    trackEvent('curriculum_field_selected', { fieldId: field.id });
  };

  const selectDiscipline = (discipline) => {
    const parentModule = discipline.modules[0];
    setActiveDisciplineId(discipline.id);
    setActiveModuleName(parentModule.name);
    setSelectedTopic(parentModule.topics[0]);
    setExpandedDisciplineId(discipline.id);
    setQuery('');
    trackEvent('curriculum_discipline_selected', { fieldId: activeField.id, disciplineId: discipline.id });
  };

  const selectModule = (parentModule) => {
    setActiveModuleName(parentModule.name);
    setSelectedTopic(parentModule.topics[0]);
    trackEvent('curriculum_topic_previewed', { fieldId: activeField.id, topic: parentModule.topics[0] });
  };

  const selectSearchResult = (result) => {
    setActiveFieldId(result.field.id);
    setActiveDisciplineId(result.discipline.id);
    setExpandedDisciplineId(result.discipline.id);
    setActiveModuleName(result.module.name);
    setSelectedTopic(result.topic);
    setQuery('');
  };

  const openLearningPath = () => {
    if (!lessonFieldId) {
      showToast?.(`${activeField.label} → ${activeDiscipline.name} is mapped in the atlas. Its full learning path is coming next.`, 'info');
      return;
    }

    trackEvent('lesson_opened', { fieldId: activeField.id, disciplineId: activeDiscipline.id, topic: selectedTopic });
    setSelectedSubject(lessonFieldId);
    setLearnView?.('overview');
    setScreen('learn');
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
    <div className="universe-home bg-[#F6EFE4] min-h-screen text-[#2C2118]">
      <header className="uh-header bg-[#F6EFE4]/85 backdrop-blur-md border-b border-[#3E2718]/10">
        <button className="uh-brand" type="button" onClick={() => setScreen('universe')} aria-label="VELORA home">
          <span className="uh-brand-mark">V</span>
          <span><strong>VELORA</strong><small>The knowledge atlas</small></span>
        </button>

        <nav className="uh-nav-links" aria-label="Primary navigation">
          <button type="button" className="uh-nav-item active" onClick={() => setScreen('universe')}><Home size={16} /> Atlas</button>
          <button type="button" className="uh-nav-item" onClick={() => { setSelectedSubject('physics'); setScreen('learn'); }}><BookOpen size={16} /> Learn</button>
          <button type="button" className="uh-nav-item" onClick={() => setScreen('dictionary')}><BookText size={16} /> Curious Dictionary</button>
          <button type="button" className="uh-nav-item" onClick={() => setScreen('analytics')}><BarChart3 size={16} /> Progress</button>
          <button type="button" className="uh-nav-item" onClick={() => setScreen('games')}><Gamepad2 size={16} /> Games</button>
        </nav>

        <div className="uh-header-actions">
          <span className="uh-user-greeting">Welcome, {user?.name || 'scholar'}</span>
          <button type="button" className="uh-icon-button" onClick={onLogout} aria-label="Sign out"><LogOut size={17} /></button>
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
                className="uh-primary bg-[#8C4A2F] hover:bg-[#6E3822] text-[#FFF8F1] font-medium px-5 py-2.5 rounded-full shadow-lg shadow-[#8C4A2F]/20 transition-all"
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
              <h2 id="atlas-heading" className="font-serif text-2xl font-light tracking-wide text-[#2C2118]">Explore the fields of human thought</h2>
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

          <div className="uh-atlas-grid">
            <aside className="uh-field-rail" aria-label="Knowledge fields">
              <p className="uh-rail-label">Major fields</p>
              {KNOWLEDGE_FIELDS.map((field, index) => {
                const FieldIcon = FIELD_ICONS[field.id];
                const isActive = field.id === activeField.id;
                return (
                  <button
                    type="button"
                    key={field.id}
                    className={`uh-field-button ${isActive ? 'active' : ''}`}
                    onClick={() => selectField(field)}
                    aria-label={`${field.label}, ${field.disciplines.length} disciplines`}
                    aria-pressed={isActive}
                  >
                    <span className="uh-field-number">0{index + 1}</span>
                    <FieldIcon size={19} />
                    <span><strong>{field.label}</strong><small>{field.disciplines.length} disciplines</small></span>
                  </button>
                );
              })}
            </aside>

            <div className="uh-field-panel">
              <header className="uh-field-header">
                <div>
                  <p className="uh-eyebrow">{activeField.eyebrow}</p>
                  <h3>{activeField.label}</h3>
                </div>
                <p>{activeField.description}</p>
              </header>

              <div className="uh-discipline-grid">
                {visibleDisciplines.map((discipline) => {
                  const isExpanded = discipline.id === expandedDisciplineId;
                  const isActive = discipline.id === activeDiscipline.id;
                  const topicCount = discipline.modules.reduce((total, item) => total + item.topics.length, 0);
                  return (
                    <article
                      key={discipline.id}
                      className={`uh-discipline-card bg-[#FFF9F1] border border-[#3E2718]/10 rounded-3xl p-6 hover:border-[#8C4A2F]/40 transition-all ${isActive ? 'active' : ''}`}
                    >
                      <button
                        type="button"
                        className="uh-discipline-trigger"
                        onClick={() => selectDiscipline(discipline)}
                        aria-expanded={isExpanded}
                        aria-controls={`discipline-${discipline.id}`}
                      >
                        <span><strong>{discipline.name}</strong><small>{topicCount} topics</small></span>
                        <ChevronDown size={18} className={isExpanded ? 'rotated' : ''} />
                      </button>
                      <p>{discipline.description}</p>

                      {isExpanded && (
                        <div id={`discipline-${discipline.id}`} className="uh-module-list">
                          {discipline.modules.map((parentModule) => (
                            <div key={parentModule.name} className="uh-module-group">
                              <button
                                type="button"
                                className={`uh-module-trigger ${activeModule.name === parentModule.name ? 'active' : ''}`}
                                onClick={() => selectModule(parentModule)}
                                aria-pressed={activeModule.name === parentModule.name}
                              >
                                {parentModule.name}<span>{parentModule.topics.length}</span>
                              </button>
                              {activeModule.name === parentModule.name && (
                                <div className="uh-topic-grid">
                                  {parentModule.topics.map((topic) => (
                                    <button
                                      type="button"
                                      key={topic}
                                      className={selectedTopic === topic ? 'active' : ''}
                                      onClick={() => {
                                        setSelectedTopic(topic);
                                        trackEvent('curriculum_topic_previewed', { fieldId: activeField.id, disciplineId: discipline.id, topic });
                                      }}
                                      aria-pressed={selectedTopic === topic}
                                    >
                                      {topic}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="uh-topic-preview" aria-live="polite" aria-label="Selected curriculum topic">
          <div>
            <p className="uh-eyebrow">Selected thread</p>
            <p className="uh-breadcrumbs">{selection.field.label} <span>/</span> {selection.discipline.name} <span>/</span> {selection.module.name}</p>
            <h2>{selection.topic}</h2>
            <p>This topic sits inside a clear sequence: begin with the field, understand the discipline, then narrow to the subfield and idea you need.</p>
          </div>
          <button
            type="button"
            className="uh-primary bg-[#8C4A2F] hover:bg-[#6E3822] text-[#FFF8F1] font-medium px-5 py-2.5 rounded-full shadow-lg shadow-[#8C4A2F]/20 transition-all"
            onClick={openLearningPath}
          >
            {lessonFieldId ? 'Open learning path' : 'Keep this path'} <ArrowRight size={17} />
          </button>
        </section>

        <section className="uh-method-section" aria-labelledby="method-title">
          <div>
            <p className="uh-eyebrow">A knowledge system that compounds</p>
            <h2 id="method-title" className="font-serif text-2xl font-light tracking-wide text-[#2C2118]">One idea should open the next.</h2>
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
