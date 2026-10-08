import React from 'react';
import PropTypes from 'prop-types';

import DeepRead from './DeepRead';
import { PHILOSOPHY_LEVELS, TOTAL_ENTRIES, STATUS_LABELS } from '../data/philosophy';

/**
 * Philosophy, through the same reader physics uses.
 *
 * The whole point of this component is how little of it there is. Black holes
 * needed a bespoke screen; philosophy needs the levels, the words, and the status
 * vocabulary, and nothing else - which is the result the content work was meant
 * to produce rather than a claim made about it.
 *
 * `initialLevelId` is how a reader who clicked "Free Will" in the Atlas lands on
 * the free will level instead of the top of the subject. It is the same argument
 * the level rail makes: someone who came back for a specific part should not have
 * to walk to it.
 */
PhilosophyDeepRead.propTypes = { onBack: PropTypes.shape({"onBack": PropTypes.func}), initialLevelId: PropTypes.string };

function PhilosophyDeepRead({ onBack, initialLevelId }) {
  return (
    <DeepRead
      levels={PHILOSOPHY_LEVELS}
      eyebrow="Philosophy"
      title="The big questions"
      note={`${PHILOSOPHY_LEVELS.length} levels, ${TOTAL_ENTRIES} entries. Every entry carries a label saying whether it is settled, a live debate, or an open question.`}
      railLabel="Philosophy levels"
      statusLabels={STATUS_LABELS}
      onBack={onBack}
      initialLevelId={initialLevelId}
    />
  );
}

export default PhilosophyDeepRead;
