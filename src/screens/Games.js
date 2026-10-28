import PropTypes from 'prop-types';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Target, Type, Link2, FileText, Puzzle, Orbit, Clock, ArrowRight, Brain, Zap } from 'lucide-react';
import FlowStateGame from '../components/FlowStateGame';
import ConceptScrabble from '../games/ConceptScrabble';
import QuantumQuiz from '../games/QuantumQuiz';
import DefinitionDuel from '../games/DefinitionDuel';
import KnowledgeChain from '../games/KnowledgeChain';
import WordPuzzle from '../games/WordPuzzle';
import RelativityLab from '../components/RelativityLab';
import BrainGames, { BRAIN_GAMES } from '../components/BrainGames';
import PhysicsSimulations, { PHYSICS_SIMULATIONS } from '../components/PhysicsSimulations';
// The decks themselves, so each card can say how much there is to do and that
// number cannot drift from the game it describes. The descriptions above used
// to carry the counts in prose, and one of them still claimed ten questions
// while the deck held fourteen.
import { QUIZ_QUESTIONS } from '../games/QuantumQuiz';
import { DUEL_PAIRS } from '../games/DefinitionDuel';
import { PUZZLES } from '../games/WordPuzzle';
import { SCRABBLE_LEVELS } from '../games/ConceptScrabble';
import { CHAINS } from '../games/KnowledgeChain';
import { getAnalyticsData } from '../utils/analyticsStorage';
import { getGameResults, getLastPlayedGame, formatResult } from '../utils/gameResults';
import '../styles/Games.css';

// Names, colours and time limits are taken from what these games actually
// do. The durations used to be invented: Definition Duel is a 60 second
// round advertised as 8 minutes, and Knowledge Chain has no clock at all
// and claimed 12. The colours were blue, green, orange and teal, in a
// palette the stylesheet explicitly describes as warm espresso, never
// indigo.
export const CLASSIC_GAMES = [
  {
    id: 'quiz',
    name: 'Concept Check',
    type: 'quiz',
    description: 'Fourteen questions across space, quantum, physics, chemistry, biology and philosophy, with the reasoning behind each answer',
    icon: Target,
    color: '--text-secondary',
    difficulty: 'Mixed',
    itemCount: QUIZ_QUESTIONS.length,
    itemUnit: 'questions',
  },
  {
    id: 'scrabble',
    name: 'Concept Scrabble',
    type: 'scrabble',
    description: 'Build scientific terms from a rack of letters',
    icon: Type,
    color: '--text-secondary',
    difficulty: 'Easy',
    itemCount: SCRABBLE_LEVELS.length,
    itemUnit: 'terms',
  },
  {
    id: 'chain',
    name: 'Knowledge Chain',
    type: 'chain',
    description: 'Put four concepts in the order where each one causes the next',
    icon: Link2,
    color: '--text-secondary',
    difficulty: 'Medium',
    itemCount: CHAINS.length,
    itemUnit: 'chains',
  },
  {
    id: 'duel',
    name: 'Definition Duel',
    type: 'duel',
    description: 'Type the term a definition describes, against a 60 second clock',
    icon: FileText,
    color: '--text-secondary',
    difficulty: 'Medium',
    fixedLength: '60 seconds',
    itemCount: DUEL_PAIRS.length,
    itemUnit: 'definitions',
  },
  {
    id: 'puzzle',
    name: 'Concept Puzzle',
    type: 'puzzle',
    description: 'Fill in the missing term in a definition',
    icon: Puzzle,
    color: '--text-tertiary',
    difficulty: 'Easy',
    itemCount: PUZZLES.length,
    itemUnit: 'puzzles',
  },
  {
    id: 'relativity',
    name: 'Relativity Lab',
    type: 'simulation',
    description: 'Play with time dilation, length contraction and event horizons',
    icon: Orbit,
    color: '--text-secondary',
    difficulty: 'Advanced',
  },
];

// Every game the hub can open, counted from the arrays it renders. The README
// and scripts/by-the-numbers.js read the same two exports, so the number cannot
// say 5 in one place and 8 in another.
export const TOTAL_SIMULATIONS =
  PHYSICS_SIMULATIONS.length + CLASSIC_GAMES.filter((game) => game.type === 'simulation').length;

// Relativity Lab sits in the classic grid and is a simulation, so it is
// subtracted here and counted in TOTAL_SIMULATIONS instead.
export const TOTAL_GAMES =
  CLASSIC_GAMES.filter((game) => game.type !== 'simulation').length + BRAIN_GAMES.length;

/**
 * GameHub
 *
 * Offers both classic interactive modes and distraction-free Flow State learning
 * sessions tailored for deep conceptual mastery.
 */
GameHub.propTypes = { setScreen: PropTypes.shape({"setScreen": PropTypes.func}), initialTab: PropTypes.string,
  initialGame: PropTypes.string,
  onGameOpened: PropTypes.func };

function GameHub({ setScreen, initialTab = 'classic', initialGame = null, onGameOpened }) {
  const [hubTab, setHubTab] = useState(initialTab); // 'brain' | 'sims' | 'classic'
  const [selectedGame, setSelectedGame] = useState(initialGame || null);
  const cardRefs = useRef([]);

  // A lesson deep-linked here with a specific game. Open it once and tell the
  // app to clear the request so a later, unprompted visit to games does not
  // spring the same game on the reader again.
  useEffect(() => {
    if (!initialGame || !onGameOpened) return;
    onGameOpened();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // What this device has actually recorded. Read once on mount, the same way
  // Journey reads it, so the two screens cannot disagree about the same numbers.
  const [analytics] = useState(() => getAnalyticsData());
  // What the games on this device have produced, so a card can say "best 1200
  // of 1600" instead of nothing at all. Read whenever the hub is the visible
  // screen again rather than once on mount: the hub stays mounted while a game
  // is open, so a value read at mount would be missing the round the player
  // just finished and would go stale in exactly the moment it matters.
  const gameResults = useMemo(
    () => (selectedGame ? {} : getGameResults()),
    [selectedGame]
  );
  const sessionsLogged = analytics.weeklyActivity.reduce(
    (total, day) => total + (day.sessions || 0),
    0
  );
  const conceptsTouched = analytics.topicTimeDistribution.length;
  // Off by default. Flow State is a timed question drill, so switching it on by
  // default meant the six real games underneath could not be reached at all
  // unless you found this checkbox and turned it off.
  const [useFlowMode, setUseFlowMode] = useState(false);
  // Which difficulties to show on the classic tab. 'All' rather than an empty
  // set, so the default is the whole grid and filtering is something you opt
  // into rather than something you have to undo.
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  // The game played most recently, so the hub can offer to pick it up again.
  // Read off the same records the cards use, so the strip and the card cannot
  // disagree about which game was last.
  const lastPlayed = useMemo(
    () => (selectedGame ? null : getLastPlayedGame()),
    [selectedGame]
  );
  const lastPlayedGame = lastPlayed
    ? CLASSIC_GAMES.find((game) => game.id === lastPlayed.gameId)
    : null;

  // The label a card carries, read off the card itself rather than a list here,
  // so a difficulty added to a game cannot be missing from the filter.
  const DIFFICULTIES = ['All', ...new Set(CLASSIC_GAMES.map((game) => game.difficulty))];
  const visibleGames = CLASSIC_GAMES.filter(
    (game) => difficultyFilter === 'All' || game.difficulty === difficultyFilter
  );

  /**
   * Arrow keys move between cards, Home and End to the ends of the row.
   *
   * The cards became real buttons so they could be reached with Tab, but six of
   * them in a grid still means six tab stops between the filter and the insights
   * panel, and a grid you can only walk through in document order is a grid
   * nobody uses from the keyboard. Up and Down move by a row, counted from the
   * cards themselves rather than from a hardcoded column count, because the grid
   * reflows to two columns and then one as the window narrows.
   */
  const handleGridKeyDown = (event) => {
    const cards = cardRefs.current.filter(Boolean);
    if (cards.length === 0) return;
    const current = cards.indexOf(document.activeElement);
    if (current === -1) return;

    const firstRowTop = cards[0].offsetTop;
    const columns = cards.filter((card) => card.offsetTop === firstRowTop).length || 1;

    const moves = {
      ArrowRight: current + 1,
      ArrowLeft: current - 1,
      ArrowDown: current + columns,
      ArrowUp: current - columns,
      Home: 0,
      End: cards.length - 1,
    };

    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = Math.min(Math.max(moves[event.key], 0), cards.length - 1);
    if (next === current) return;
    cards[next].focus();
  };

  // Render selected game in Flow State or Classic mode
  if (selectedGame) {
    const activeGameConfig = CLASSIC_GAMES.find(g => g.id === selectedGame) || CLASSIC_GAMES[0];

    if (activeGameConfig.type === 'simulation') {
      return <RelativityLab onBack={() => setSelectedGame(null)} />;
    }

    if (useFlowMode) {
      return (
        <FlowStateGame
          gameName={activeGameConfig.name}
          gameType={activeGameConfig.type}
          difficulty={activeGameConfig.difficulty}
          duration={parseInt(activeGameConfig.fixedLength, 10) || 10}
          onBack={() => setSelectedGame(null)}
        />
      );
    }

    const gameMap = {
      scrabble: <ConceptScrabble onBack={() => setSelectedGame(null)} />,
      quiz: <QuantumQuiz onBack={() => setSelectedGame(null)} />,
      duel: <DefinitionDuel onBack={() => setSelectedGame(null)} />,
      chain: <KnowledgeChain onBack={() => setSelectedGame(null)} />,
      puzzle: <WordPuzzle onBack={() => setSelectedGame(null)} />,
      relativity: <RelativityLab onBack={() => setSelectedGame(null)} />,
    };

    return gameMap[selectedGame] || <FlowStateGame gameName={activeGameConfig.name} onBack={() => setSelectedGame(null)} />;
  }

  return (
    <div className="games-hub-new">
      {/* Header */}
      <header className="games-header-new">
        <button className="back-btn-games" onClick={() => setScreen('universe')}>
          ← Return to Universe
        </button>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`pill-btn ${hubTab === 'brain' ? 'active' : ''}`}
            onClick={() => { setHubTab('brain'); setSelectedGame(null); }}
            style={{ padding: '6px 16px', fontSize: '0.85rem' }}
          >
            <Brain size={14} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 6 }} /> Brain Games
          </button>
          <button
            type="button"
            className={`pill-btn ${hubTab === 'sims' ? 'active' : ''}`}
            onClick={() => { setHubTab('sims'); setSelectedGame(null); }}
            style={{ padding: '6px 16px', fontSize: '0.85rem' }}
          >
            <Zap size={14} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 6 }} /> Physics Simulations
          </button>
          <button
            type="button"
            className={`pill-btn ${hubTab === 'classic' ? 'active' : ''}`}
            onClick={() => { setHubTab('classic'); setSelectedGame(null); }}
            style={{ padding: '6px 16px', fontSize: '0.85rem' }}
          >
            <Puzzle size={14} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 6 }} /> Concept Puzzles
          </button>
        </div>
        <p
          className="games-count-line"
          style={{ flexBasis: '100%', margin: '10px 0 0', fontSize: '0.82rem', color: 'var(--text-tertiary)' }}
        >
          {TOTAL_GAMES} games and {TOTAL_SIMULATIONS} simulations, counted from the lists on this screen.
        </p>
        {hubTab === 'classic' && (
          <div className="flow-mode-switch">
            <label className="mode-switch-label">
              <input
                type="checkbox"
                checked={useFlowMode}
                onChange={(e) => setUseFlowMode(e.target.checked)}
              />
              <span className="mode-text">Flow State Mode</span>
            </label>
          </div>
        )}
      </header>

      {hubTab === 'brain' && <BrainGames onBack={() => setScreen('universe')} />}
      {hubTab === 'sims' && <PhysicsSimulations onBack={() => setScreen('universe')} />}

      {hubTab === 'classic' && (
        <>
          {/* Hero */}
          <section className="games-hero">
            <div className="hero-content">
              <h2>Master Concepts Through Deep Interaction</h2>
              <p>
                Engage with scientific frameworks directly. No artificial scoreboards. Only focus, clarity, and reflection.
              </p>
            </div>
          </section>

      {/* Difficulty filter.
        *
        * Six cards sat in one grid with a difficulty printed on each and no way
        * to use it, so someone with ten minutes and no appetite for Relativity
        * Lab had to read all six cards to find the two marked Easy. Every label
        * on the filter is read off the cards, so a game given a new difficulty
        * shows up here without anyone remembering to add it.
        */}
      <div className="games-difficulty-filter" role="group" aria-label="Filter games by difficulty">
        <span className="games-filter-label">Difficulty</span>
        {DIFFICULTIES.map((level) => (
          <button
            key={level}
            type="button"
            className={`pill-btn ${difficultyFilter === level ? 'active' : ''}`}
            aria-pressed={difficultyFilter === level}
            onClick={() => setDifficultyFilter(level)}
          >
            {level}
            <span className="games-filter-count">
              {level === 'All'
                ? CLASSIC_GAMES.length
                : CLASSIC_GAMES.filter((game) => game.difficulty === level).length}
            </span>
          </button>
        ))}
      </div>

      {/* Pick up where you left off.
        *
        * Six games are a lot to scan when you came back to finish the round you
        * started, and the score you were chasing was the only thing on the
        * screen that remembered it. This offers that game directly.
        */}
      {lastPlayedGame && (
        <div className="games-resume" data-testid="games-resume">
          <p className="games-resume-text">
            Last played: <strong>{lastPlayedGame.name}</strong>
            <span className="games-resume-score">
              {' '}
              &middot; best {formatResult(lastPlayed)}
            </span>
          </p>
          <button
            type="button"
            className="pill-btn"
            onClick={() => setSelectedGame(lastPlayedGame.id)}
          >
            Play it again
          </button>
        </div>
      )}

      {/* Games Grid */}
      <main className="games-grid-main" onKeyDown={handleGridKeyDown}>
        {visibleGames.map((game, index) => {
          const GameIcon = game.icon;
          return (
            // A div with an onClick is not focusable, has no role, and cannot
            // be activated by keyboard, so the entire games grid was mouse
            // only. The inner "Start Session" button did nothing on its own
            // and relied on the click bubbling up to the div.
            <button
              type="button"
              key={game.id}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className="game-card-large"
              data-testid="game-card"
              aria-label={game.name}
              onClick={() => setSelectedGame(game.id)}
              style={{ '--game-color': game.color, textAlign: 'left' }}
            >
              <div className="game-card-header">
                <span className="game-icon-large" style={{ display: 'flex', alignItems: 'center' }}>
                  <GameIcon size={24} strokeWidth={1.5} color={game.color} data-testid="game-icon" />
                </span>
                <h3>{game.name}</h3>
              </div>

              <p className="game-description" data-testid="game-description">{game.description}</p>

              {/* Only present once a round has been finished. An "unplayed"
                * marker on every card would be noise, and a zero would read as
                * a score rather than as an absence. */}
              {gameResults[game.id] && (
                <p className="game-best" data-testid="game-best">
                  Best {formatResult(gameResults[game.id])}
                  <span className="game-plays">
                    {' '}
                    &middot; {gameResults[game.id].plays}{' '}
                    {gameResults[game.id].plays === 1 ? 'round' : 'rounds'} played
                  </span>
                </p>
              )}

              <div className="game-meta-row">
                <span className="game-difficulty" data-testid="game-difficulty">{game.difficulty}</span>
                {game.itemCount > 0 && (
                  <span className="game-length" data-testid="game-length">
                    {game.itemCount} {game.itemUnit}
                  </span>
                )}
                {game.fixedLength && (
                  <span className="game-duration" data-testid="game-duration" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} strokeWidth={1.5} />
                    <span>{game.fixedLength}</span>
                  </span>
                )}
              </div>

              <span className="play-btn-large" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <span>Start session</span>
                <ArrowRight size={14} strokeWidth={1.5} />
              </span>
            </button>
          );
        })}
        {visibleGames.length === 0 && (
          <p className="games-grid-empty">
            No game on this list is marked {difficultyFilter}.
          </p>
        )}
      </main>

      {/* Stats */}
        {/*
         * These four numbers used to be typed out by hand: 18 sessions, 4.9/5
         * comprehension, 15 concepts mastered, 92% retention. Nothing on this
         * device produced any of them, and every learner saw exactly the same
         * four - including someone who had just arrived - which is the same
         * failure Journey was rebuilt to remove. The hero above this panel even
         * claims "no artificial scoreboards", which put the contradiction on one
         * screen.
         *
         * What is real is minutes spent: LessonReader records a session when a
         * lesson closes. So the panel now shows that, plus an empty state that
         * says so, rather than a number that flatters.
         *
         * What stays absent is the scoring. Comprehension and retention are not
         * dropped because they would be awkward to produce - they are dropped
         * because nothing here measures them. A quiz would produce a number
         * instantly, and that number would not be a measure of understanding.
         */}
        <section className="games-stats">
          <h3>Your Learning Insights</h3>
          {sessionsLogged === 0 ? (
            <p className="games-stats-empty">
              Nothing recorded yet. A count appears here when you close a lesson, so this
              panel can only ever show time you actually spent.
            </p>
          ) : (
            <div className="stats-row">
              <div className="stat-item" role="group" aria-label="Sessions logged">
                <p className="stat-number" data-testid="stat-value">{sessionsLogged}</p>
                <p className="stat-label">Sessions logged</p>
              </div>
              <div className="stat-item" role="group" aria-label="Concepts touched">
                <p className="stat-number" data-testid="stat-value">{conceptsTouched}</p>
                <p className="stat-label">Concepts touched</p>
              </div>
              <div className="stat-item" role="group" aria-label="Hours recorded">
                <p className="stat-number" data-testid="stat-value">{analytics.totalHoursStudied}</p>
                <p className="stat-label">Hours recorded</p>
              </div>
            </div>
          )}
          <p className="games-stats-note">
            No comprehension rating and no retention score. Nothing in this app measures
            either one, so a number here would be decoration shaped like a measurement.
          </p>
        </section>
      </>
    )}
  </div>
);
}

export default GameHub;