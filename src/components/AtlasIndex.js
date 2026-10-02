import React, { useMemo } from 'react';
import { resolveAtlasTopic } from '../data/atlasResolution';
import '../styles/AtlasIndex.css';

/**
 * The atlas, rendered as an index.
 *
 * WHY AN INDEX AND NOT A GRID OF PILLS
 * -----------------------------------
 * The previous layout was a grid of subject cards, each expanding into a row of
 * pill buttons. Pills are the most overused shape in generated UI and they carry
 * no information: nine pills next to seven pills look identical unless you
 * already know the content. The atlas has a real three-level hierarchy - field,
 * discipline, topic - and the form people have used for exactly that shape for
 * five hundred years is a book's index: entry, leader dots, marker.
 *
 * So hierarchy here is typographic, not geometric. Field is the display serif.
 * Discipline is letterspaced small caps with a rule under it. Topic is quiet
 * body text on an indented line. Nothing is a shape, so nothing has to be
 * decoded before it can be read.
 *
 * WHY NOTHING COLLAPSES
 * --------------------
 * The complaint this replaces was that a flat pill list does not scale to 55
 * physics topics: by the time you are reading Quantum Physics' nine topics next
 * to Classical Mechanics' seven, the pills are undifferentiated and you have to
 * expand every section to learn what exists. Here every discipline and every
 * topic is on the page at once. Physics' 55 topics are visible without a single
 * click. Density comes from the index line being able to hold a whole topic in
 * one line of body text, which a pill cannot do without wrapping.
 *
 * WHY THE MARKER IS ON EVERY LINE
 * ------------------------------
 * The index is also the honest report. Written topics carry a filled accent
 * marker; unwritten ones are set in tertiary ink with a hollow marker. A reader
 * scanning Physics can see that three topics have content and the rest do not
 * without opening anything, which is a claim the old layout could not make -
 * it showed 55 identical pills and a single number in a corner.
 */

/** Reads as "has content" or "listed but not written", per line. */
function Marker({ resolution }) {
  const written = resolution.kind === 'lesson' || resolution.kind === 'deep-read';
  /*
   * The status is abbreviated to a word rather than drawn as a coloured dot
   * alone. Two reasons, both from looking at it render: a 7px dot is invisible
   * at the right edge of a narrow column, and colour alone would fail anyone who
   * cannot separate the accent from the tertiary ink. "Written" and "Not yet" fit
   * in a two-column index at 375px without wrapping, which a full
   * "not written yet" did not - it pushed past the column edge and was clipped.
   */
  return (
    <span className={`aix-marker ${written ? 'written' : 'unwritten'}`}>
      <span className="aix-marker-dot" aria-hidden="true" />
      <span className="aix-marker-text">{written ? 'Written' : 'Not yet'}</span>
      <span className="sr-only">{written ? ', has content' : ', not written yet'}</span>
    </span>
  );
}

/** One topic line: name, leader run, status marker. */
function TopicLine({ field, discipline, moduleName, topic, isSelected, onSelect }) {
  const resolution = useMemo(
    () => resolveAtlasTopic({ fieldId: field.id, disciplineId: discipline.id, moduleName, topic }),
    [field.id, discipline.id, moduleName, topic]
  );
  const written = resolution.kind === 'lesson' || resolution.kind === 'deep-read';

  return (
    <li className="aix-entry-row">
      <button
        type="button"
        className={`aix-entry ${isSelected ? 'current' : ''} ${written ? '' : 'unwritten'}`}
        onClick={() => onSelect({ field, discipline, moduleName, topic })}
        aria-current={isSelected ? 'true' : undefined}
        // The accessible name states the status, so a screen reader user learns
        // the same thing the marker shows visually.
        aria-label={`${topic}${written ? '' : ', not written yet'}`}
      >
        <span className="aix-entry-text">{topic}</span>
        <span className="aix-leader" aria-hidden="true" />
        <Marker resolution={resolution} />
      </button>
    </li>
  );
}

function AtlasIndex({ field, disciplines, selected, onSelect }) {
  return (
    <div className="aix-index">
      {disciplines.map((discipline) => {
        const topicCount = discipline.modules.reduce((total, item) => total + item.topics.length, 0);
        return (
          /*
           * A field guide groups by subfield when a discipline has several, and
           * does not when it has one. Forcing a subfield heading onto 'Plasma
           * Physics' (a discipline whose only module is itself) produced a level
           * of hierarchy that carried no information.
           */
          <section className="aix-group" key={discipline.id}>
            <header className="aix-group-head">
              <h4 className="aix-group-title">{discipline.name}</h4>
              <span className="aix-leader" aria-hidden="true" />
              <span className="aix-group-count">{topicCount}</span>
            </header>
            <p className="aix-group-desc">{discipline.description}</p>

            {discipline.modules.map((moduleItem) => (
              <div className="aix-subgroup" key={moduleItem.name}>
                {discipline.modules.length > 1 && (
                  <h5 className="aix-subgroup-title">{moduleItem.name}</h5>
                )}
                <ul className="aix-entries">
                  {moduleItem.topics.map((topic) => (
                    <TopicLine
                      key={`${discipline.id}-${moduleItem.name}-${topic}`}
                      field={field}
                      discipline={discipline}
                      moduleName={moduleItem.name}
                      topic={topic}
                      isSelected={selected.topic === topic
                        && selected.discipline.id === discipline.id
                        && selected.module.name === moduleItem.name}
                      onSelect={onSelect}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}

export default AtlasIndex;
