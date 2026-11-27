import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, ArrowRight, Send, Sparkles, Trash2, X } from 'lucide-react';
import { MINDS, MIND_BY_ID } from '../data/minds';
import { DEBATES, MODES, composeReply, getDebate } from '../data/mindsEngine';
import { getBotConversation, saveBotConversation, clearBotConversation } from '../utils/botStorage';
import { getProfile } from '../utils/localProfile';
import GlossaryText from '../components/GlossaryText';
import '../styles/VeloraMinds.css';

/**
 * Velora Minds.
 *
 * A library of researched intellectual profiles, a conversation surface that
 * composes replies from documented positions, and a set of curated debates. The
 * screen is deliberately explicit about what it is: a reconstruction, not a
 * channel, and not a language model.
 */

const THEMES = ['Reality', 'Time', 'Morality', 'Freedom', 'Power', 'Art', 'Life', 'Science', 'Mind & Machine'];

function Monogram({ mind, size = 'large' }) {
  return (
    <span className={`vm-monogram vm-monogram--${size}`} aria-hidden="true">
      {mind.portrait}
    </span>
  );
}

Monogram.propTypes = {
  mind: PropTypes.object.isRequired,
  size: PropTypes.string,
};

function Library({ onOpen, onDebate }) {
  const [theme, setTheme] = useState('all');
  const visible = theme === 'all' ? MINDS : MINDS.filter((mind) => mind.themes.includes(theme));

  return (
    <main className="vm-main">
      <header className="vm-masthead">
        <div>
          <p className="vm-kicker">Reconstructed intellectual company</p>
          <h1>
            Velora <em>Minds</em>
          </h1>
          <p className="vm-lead">
            Eleven thinkers, each with a researched profile: how they formed, how they argued, what they
            actually wrote, and where their own positions break down. You can put a question to them, ask
            them to teach, or make them argue.
          </p>
        </div>
        <div className="vm-honesty">
          <p className="vm-honesty-label">Read this first</p>
          <p>
            These are <strong>reconstructions</strong>, not the people, and not a live language model. Every
            reply is composed from a documented position and carries the source it was built from.
          </p>
          <p>
            Where a figure never addressed your question, the reply says so instead of inventing an opinion.
            Their contradictions and political failures are kept in the profile, not smoothed away.
          </p>
        </div>
      </header>

      <nav className="vm-themes" aria-label="Filter thinkers by theme">
        <button type="button" className={theme === 'all' ? 'active' : ''} aria-pressed={theme === 'all'} onClick={() => setTheme('all')}>
          All <span>{MINDS.length}</span>
        </button>
        {THEMES.map((item) => {
          const count = MINDS.filter((mind) => mind.themes.includes(item)).length;
          if (!count) return null;
          return (
            <button
              key={item}
              type="button"
              className={theme === item ? 'active' : ''}
              aria-pressed={theme === item}
              onClick={() => setTheme(item)}
            >
              {item} <span>{count}</span>
            </button>
          );
        })}
      </nav>

      <ul className="vm-grid">
        {visible.map((mind) => (
          <li key={mind.id}>
            <button type="button" className="vm-card" onClick={() => onOpen(mind.id)} aria-label={`Open ${mind.name}`}>
              <span className="vm-card-head">
                <Monogram mind={mind} size="card" />
                <span className="vm-card-ident">
                  <strong>{mind.name}</strong>
                  <span>{mind.dates}</span>
                  <span>{mind.discipline}</span>
                </span>
              </span>
              <span className="vm-card-thesis">{mind.thesis}</span>
              <span className="vm-card-foot">
                <span>{mind.positions.length} documented positions</span>
                <ArrowRight size={15} aria-hidden="true" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <section className="vm-debates" aria-labelledby="vm-debates-heading">
        <div className="vm-section-head">
          <p className="vm-kicker">Two positions, one question</p>
          <h2 id="vm-debates-heading">Set them against each other</h2>
          <p>
            These are not imagined conversations. Each debate pairs two positions that genuinely conflict,
            with the fault line stated and both sources named.
          </p>
        </div>
        <ol>
          {DEBATES.map((debate) => {
            const a = MIND_BY_ID[debate.a.mindId];
            const b = MIND_BY_ID[debate.b.mindId];
            return (
              <li key={debate.id}>
                <button type="button" className="vm-debate-card" onClick={() => onDebate(debate.id)}>
                  <span className="vm-debate-names">
                    {a.name.split(' ').slice(-1)} <span aria-hidden="true">×</span> {b.name.split(' ').slice(-1)}
                  </span>
                  <strong>{debate.title}</strong>
                  <span>{debate.question}</span>
                  <span className="vm-debate-open">
                    Read the disagreement <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="vm-method" aria-labelledby="vm-method-heading">
        <h2 id="vm-method-heading">How a reply is made</h2>
        <div className="vm-method-grid">
          <div>
            <span className="vm-step">01</span>
            <h3>The question is matched to documented positions</h3>
            <p>
              Each figure has four to five positions, each with its own vocabulary. The engine scores your
              words against those vocabularies and selects the closest. It does not generate free text.
            </p>
          </div>
          <div>
            <span className="vm-step">02</span>
            <h3>The reply is composed from that position</h3>
            <p>
              The claim, the argument in the figure&apos;s register, the source, and the tension the position
              itself has not resolved. The mode changes the shape, not the content.
            </p>
          </div>
          <div>
            <span className="vm-step">03</span>
            <h3>No match is admitted, not papered over</h3>
            <p>
              If nothing is close enough, the reply says so and offers the nearest documented position. That is
              the honest limit of a reconstruction, and it is visible rather than hidden.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

Library.propTypes = {
  onOpen: PropTypes.func.isRequired,
  onDebate: PropTypes.func.isRequired,
};

function Conversation({ mind, mode, setMode }) {
  const profile = getProfile();
  const uid = profile?.name || 'local_scholar';
  const [messages, setMessages] = useState(() => getBotConversation(mind.id, uid));
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    setMessages(getBotConversation(mind.id, uid));
    setInput('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mind.id]);

  useEffect(() => {
    if (typeof endRef.current?.scrollIntoView === 'function') {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages]);

  const send = (raw) => {
    const text = (raw || input).trim();
    if (!text) return;
    const userMessage = { sender: 'user', text, timestamp: new Date().toISOString() };
    const withUser = [...messages, userMessage];
    const reply = composeReply({ mindId: mind.id, mode, query: text, history: withUser });
    const botMessage = {
      sender: 'bot',
      text: reply.text,
      timestamp: new Date().toISOString(),
      positionId: reply.positionId,
      positionTitle: reply.positionTitle,
      citation: reply.citation,
      note: reply.note,
      matched: reply.matched,
      mode,
    };
    const next = [...withUser, botMessage];
    setMessages(next);
    setInput('');
    saveBotConversation(mind.id, next, uid);
  };

  const activeMode = MODES.find((item) => item.id === mode) || MODES[0];

  return (
    <section className="vm-conversation" aria-labelledby="vm-conversation-heading">
      <div className="vm-conversation-head">
        <div>
          <p className="vm-kicker">The conversation</p>
          <h2 id="vm-conversation-heading">Put something to {mind.name.split(' ')[0]}</h2>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            className="vm-clear"
            onClick={() => {
              clearBotConversation(mind.id, uid);
              setMessages([]);
            }}
          >
            <Trash2 size={14} aria-hidden="true" /> Clear
          </button>
        )}
      </div>

      <div className="vm-modes" role="tablist" aria-label="Conversation mode">
        {MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={mode === item.id}
            className={mode === item.id ? 'active' : ''}
            onClick={() => setMode(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="vm-mode-note">{activeMode.description}</p>

      {messages.length === 0 && (
        <div className="vm-starters">
          <p className="vm-starters-label">
            <Sparkles size={13} aria-hidden="true" /> Start with one of these, or write your own
          </p>
          <div>
            {mind.starters.map((starter) => (
              <button key={starter} type="button" onClick={() => send(starter)}>
                {starter}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="vm-transcript" aria-live="polite" aria-label={`Conversation with ${mind.name}`}>
        {messages.map((message, index) => (
          <article key={`${message.timestamp}-${index}`} className={`vm-message vm-message--${message.sender}`}>
            <header>
              <span>{message.sender === 'user' ? 'You' : mind.name}</span>
              {message.sender === 'bot' && message.mode && (
                <span className="vm-message-mode">{MODES.find((item) => item.id === message.mode)?.short || 'Ask'}</span>
              )}
            </header>
            {message.text.split('\n\n').map((paragraph, i) => (
              <p key={i}>
                <GlossaryText text={paragraph} />
              </p>
            ))}
            {message.sender === 'bot' && (
              <footer className="vm-message-foot">
                {message.positionTitle && (
                  <span className="vm-position-tag">
                    Position: {message.positionTitle}
                    {message.matched === false ? ' (nearest match)' : ''}
                  </span>
                )}
                {message.citation && (
                  <a href={message.citation.url} target="_blank" rel="noreferrer noopener">
                    {message.citation.label}
                  </a>
                )}
                {message.note && <span className="vm-message-note">{message.note}</span>}
              </footer>
            )}
          </article>
        ))}
        <div ref={endRef} />
      </div>

      <form
        className="vm-composer"
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
      >
        <label className="sr-only" htmlFor="vm-input">
          Type your question for {mind.name}
        </label>
        <textarea
          id="vm-input"
          rows={3}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
          placeholder={`Ask about ${mind.positions[0].title.toLowerCase()}…`}
        />
        <div className="vm-composer-foot">
          <span>Shift + Enter for a new line. Replies are composed from documented positions, not generated.</span>
          <button type="submit" aria-label="Send question" disabled={!input.trim()}>
            <Send size={15} aria-hidden="true" /> Send
          </button>
        </div>
      </form>
    </section>
  );
}

Conversation.propTypes = {
  mind: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
  setMode: PropTypes.func.isRequired,
};

function Figure({ mind, onBack, onDebate }) {
  const [mode, setMode] = useState('ask');

  return (
    <main className="vm-main vm-figure">
      <div className="vm-figure-bar">
        <button type="button" className="vm-back" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" /> All minds
        </button>
        <span>{mind.field}</span>
      </div>

      <header className="vm-figure-head">
        <Monogram mind={mind} />
        <div>
          <h1>{mind.name}</h1>
          <p className="vm-figure-meta">
            {mind.dates} <span aria-hidden="true">·</span> {mind.discipline}
          </p>
          <p className="vm-thesis">
            <GlossaryText text={mind.thesis} limit={2} />
          </p>
          <div className="vm-theme-tags">
            {mind.themes.map((theme) => (
              <span key={theme}>{theme}</span>
            ))}
          </div>
        </div>
      </header>

      <div className="vm-figure-grid">
        <aside className="vm-profile">
          <section>
            <h2>Formation</h2>
            <p>
              <GlossaryText text={mind.profile.formation} limit={2} />
            </p>
          </section>
          <section>
            <h2>Method</h2>
            <p>
              <GlossaryText text={mind.profile.method} limit={2} />
            </p>
          </section>
          <section>
            <h2>How the thought developed</h2>
            <p>
              <GlossaryText text={mind.profile.development} limit={2} />
            </p>
          </section>
          <section>
            <h2>Limits and contradictions</h2>
            <p>
              <GlossaryText text={mind.profile.limits} limit={2} />
            </p>
          </section>
          <section>
            <h2>Works</h2>
            <ul className="vm-works">
              {mind.works.map((work) => (
                <li key={work.title}>
                  <strong>{work.title}</strong>
                  <span>{work.year}</span>
                  <p>{work.note}</p>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Documented positions</h2>
            <ol className="vm-positions">
              {mind.positions.map((position) => (
                <li key={position.id}>
                  <strong>{position.title}</strong>
                  <p>
                    <GlossaryText text={position.claim} limit={1} />
                  </p>
                  <a href={position.citation.url} target="_blank" rel="noreferrer noopener">
                    {position.citation.label}
                  </a>
                </li>
              ))}
            </ol>
          </section>
          {mind.pairsWith?.length > 0 && (
            <section>
              <h2>Argue with someone else</h2>
              <div className="vm-pairs">
                {DEBATES.filter(
                  (debate) =>
                    (debate.a.mindId === mind.id || debate.b.mindId === mind.id)
                ).map((debate) => (
                  <button key={debate.id} type="button" onClick={() => onDebate(debate.id)}>
                    {debate.title}
                  </button>
                ))}
              </div>
            </section>
          )}
        </aside>

        <div className="vm-talk">
          <Conversation mind={mind} mode={mode} setMode={setMode} />
        </div>
      </div>
    </main>
  );
}

Figure.propTypes = {
  mind: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onDebate: PropTypes.func.isRequired,
};

function Debate({ debateId, onBack, onOpenMind }) {
  const debate = getDebate(debateId);
  if (!debate) {
    return (
      <main className="vm-main">
        <button type="button" className="vm-back" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" /> All minds
        </button>
        <p>That debate is not in the library.</p>
      </main>
    );
  }

  const side = (entry) => (
    <article className="vm-side">
      <header>
        <Monogram mind={entry.mind} size="card" />
        <div>
          <button type="button" onClick={() => onOpenMind(entry.mind.id)}>
            {entry.mind.name}
          </button>
          <span>{entry.mind.dates}</span>
        </div>
      </header>
      <h3>{entry.position.title}</h3>
      <p className="vm-side-claim">
        <GlossaryText text={entry.position.claim} limit={1} />
      </p>
      <p>
        <GlossaryText text={entry.position.argument} limit={2} />
      </p>
      <p className="vm-side-tension">
        <strong>Where it strains:</strong> {entry.position.tension}
      </p>
      <a href={entry.position.citation.url} target="_blank" rel="noreferrer noopener">
        {entry.position.citation.label}
      </a>
    </article>
  );

  return (
    <main className="vm-main">
      <div className="vm-figure-bar">
        <button type="button" className="vm-back" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" /> All minds
        </button>
        <span>Historical debate</span>
      </div>

      <header className="vm-debate-head">
        <p className="vm-kicker">Two documented positions</p>
        <h1>{debate.title}</h1>
        <p className="vm-debate-question">{debate.question}</p>
      </header>

      <div className="vm-debate-body">
        {side(debate.a)}
        <div className="vm-debate-divider" aria-hidden="true">
          <span>vs</span>
        </div>
        {side(debate.b)}
      </div>

      <section className="vm-fault" aria-labelledby="vm-fault-heading">
        <h2 id="vm-fault-heading">The fault line</h2>
        <p>
          <GlossaryText text={debate.faultLine} limit={2} />
        </p>
        <p className="vm-why">
          <GlossaryText text={debate.why} limit={2} />
        </p>
      </section>

      <footer className="vm-debate-foot">
        <button type="button" onClick={() => onOpenMind(debate.a.mind.id)}>
          Talk to {debate.a.mind.name} <ArrowRight size={15} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => onOpenMind(debate.b.mind.id)}>
          Talk to {debate.b.mind.name} <ArrowRight size={15} aria-hidden="true" />
        </button>
      </footer>
    </main>
  );
}

Debate.propTypes = {
  debateId: PropTypes.string,
  onBack: PropTypes.func.isRequired,
  onOpenMind: PropTypes.func.isRequired,
};

export default function VeloraMinds({ setScreen, initialFigureId }) {
  const [view, setView] = useState(() => (initialFigureId && MIND_BY_ID[initialFigureId] ? 'figure' : 'library'));
  const [figureId, setFigureId] = useState(() => (MIND_BY_ID[initialFigureId] ? initialFigureId : 'einstein'));
  const [debateId, setDebateId] = useState(null);

  const mind = useMemo(() => MIND_BY_ID[figureId], [figureId]);

  const openMind = (id) => {
    if (!MIND_BY_ID[id]) return;
    setFigureId(id);
    setView('figure');
    window.scrollTo?.({ top: 0 });
  };

  const openDebate = (id) => {
    setDebateId(id);
    setView('debate');
    window.scrollTo?.({ top: 0 });
  };

  const goLibrary = () => {
    setView('library');
    window.scrollTo?.({ top: 0 });
  };

  return (
    <div className="vm-shell">
      <div className="vm-topbar">
        <button type="button" onClick={() => setScreen('universe')}>
          <X size={15} aria-hidden="true" /> Atlas
        </button>
        <span>VELORA MINDS</span>
      </div>

      {view === 'library' && <Library onOpen={openMind} onDebate={openDebate} />}
      {view === 'figure' && mind && <Figure mind={mind} onBack={goLibrary} onDebate={openDebate} />}
      {view === 'debate' && <Debate debateId={debateId} onBack={goLibrary} onOpenMind={openMind} />}
    </div>
  );
}

VeloraMinds.propTypes = {
  setScreen: PropTypes.func,
  initialFigureId: PropTypes.string,
};
