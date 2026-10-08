import React from 'react';
import PropTypes from 'prop-types';

import DeepRead from './DeepRead';
import { HISTORY_LEVELS, TOTAL_ENTRIES, STATUS_LABELS } from '../data/history';

/**
 * History, through the same reader physics and philosophy use.
 *
 * This is the third time this pattern has been built, and the point of building
 * it three times is how little there is here. A third subject with a different
 * evidentiary culture needed only a level list, a title, and its own status
 * vocabulary - the vocabulary being the one real difference from
 * PhilosophyDeepRead, since "well-documented / disputed / contested framing" is
 * a genuinely different evidential position from "settled / debated / open", not
 * a relabelling of the same three words.
 *
 * `initialLevelId` is how a reader who clicked "World War I" in the Atlas lands
 * on the century-of-wars level rather than the top of the subject.
 */
HistoryDeepRead.propTypes = { onBack: PropTypes.shape({"onBack": PropTypes.func}), initialLevelId: PropTypes.string };

function HistoryDeepRead({ onBack, initialLevelId }) {
  return (
    <DeepRead
      levels={HISTORY_LEVELS}
      eyebrow="History"
      title="History, from the record"
      note={`${HISTORY_LEVELS.length} levels, ${TOTAL_ENTRIES} entries. Every entry is labelled for what the surviving record can actually establish: well documented, disputed among historians, or contested at the level of the framing itself.`}
      railLabel="History levels"
      statusLabels={STATUS_LABELS}
      onBack={onBack}
      initialLevelId={initialLevelId}
    />
  );
}

export default HistoryDeepRead;