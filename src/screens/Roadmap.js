import ROADMAP, { ROADMAP_TOTALS, lessonTopicCount, atlasTopicCount } from '../roadmap';
import '../styles/Roadmap.css';

/**
 * Roadmap.
 *
 * The content lives in src/roadmap.js as data so that src/roadmap.test.js can
 * check the numbers in it against the data files they claim to describe. The
 * alternative, writing this page as markup, is how a roadmap stops being true
 * without anyone noticing: a count gets typed once, a subject is added, and the
 * page keeps saying the old number with no check anywhere.
 *
 * The voice is the point. This app has no server, so it cannot promise that
 * anything will be built, and a page that said "coming soon" next to a list of
 * dates would be making claims nobody here can keep. Each row says what exists
 * and, where something is missing, what the missing part is.
 */

const STATE_COPY = {
  live: { label: 'Working', className: 'rm-live' },
  partial: { label: 'Partly built', className: 'rm-partial' },
  removed: { label: 'Removed', className: 'rm-removed' },
  notstarted: { label: 'Not started', className: 'rm-notstarted' },
};

Roadmap.propTypes = { setScreen: PropTypes.shape({"setScreen": PropTypes.func}) };

function Roadmap({ setScreen }) {
  return (
    <div className="roadmap-page">
      <header className="rm-header">
        <div>
          <p className="rm-eyebrow">What is here</p>
          <h1>Roadmap</h1>
        </div>
        <button type="button" className="rm-back" onClick={() => setScreen('universe')}>
          Back to the atlas
        </button>
      </header>

      <div className="rm-intro">
        <p>
          This app has no server. Everything you write, and everything it measures, is stored in this
          browser and nowhere else. So the useful thing a roadmap can do here is describe what is
          actually present, and be specific about what is missing. There are no dates on this page
          because there is no schedule behind them.
        </p>
        <ul className="rm-totals">
          {ROADMAP_TOTALS.map((total) => (
            <li key={total.id}>
              <strong>{total.count}</strong>
              <span>{total.title}</span>
            </li>
          ))}
        </ul>
      </div>

      {ROADMAP.map((section) => (
        <section key={section.id} className="rm-section" aria-labelledby={`rm-${section.id}`}>
          <h2 id={`rm-${section.id}`}>{section.title}</h2>
          <p className="rm-section-summary">{section.summary}</p>
          <ul className="rm-list">
            {section.items.map((item) => {
              const state = STATE_COPY[item.state] || STATE_COPY.live;
              return (
                <li key={item.name} className="rm-item">
                  <div className="rm-item-head">
                    <h3>{item.name}</h3>
                    <span className={`rm-state ${state.className}`}>{state.label}</span>
                  </div>
                  <p>{item.detail}</p>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <footer className="rm-footer">
        <p>
          The atlas lists {atlasTopicCount} topics and {lessonTopicCount} of them have written
          lessons. That gap is the largest piece of unfinished work here, and it is the first line
          above rather than the last because it is the one that matters.
        </p>
      </footer>
    </div>
  );
}

export default Roadmap;
