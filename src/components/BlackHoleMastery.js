import React from 'react';
import PropTypes from 'prop-types';
import DeepRead from './DeepRead';
import BlackHoleCanvas from './BlackHoleCanvas';
import { BLACK_HOLE_LEVELS, TOTAL_ENTRIES, STATUS_LABELS } from '../data/blackholes';

/**
 * Black holes, in levels.
 *
 * This used to hold the whole reader - the rail, the pager, the focus handling -
 * and all of that now lives in <DeepRead>, which philosophy also uses. What is
 * left here is only what is specific to physics: the levels, the words, the
 * background canvas, and the relativity lab link that belongs on Level 1.
 *
 * Keeping this file as a named component rather than inlining <DeepRead> at the
 * call site means the physics screen's public shape did not change when the
 * reader was generalised, so nothing that renders it had to be touched.
 */
function BlackHoleMastery({ onBack, onOpenLab }) {
  return (
    <DeepRead
      levels={BLACK_HOLE_LEVELS}
      eyebrow="Physics"
      title="Black holes"
      note={`${BLACK_HOLE_LEVELS.length} levels, ${TOTAL_ENTRIES} entries. Any dotted word can be defined where it appears, without leaving the page.`}
      railLabel="Black hole levels"
      statusLabels={STATUS_LABELS}
      onBack={onBack}
      background={<BlackHoleCanvas />}
      levelFooter={(level) =>
        onOpenLab && level.number === 1 ? (
          <button type="button" className="bhm-lab-link" onClick={onOpenLab}>
            Try it: the relativity lab
          </button>
        ) : null
      }
    />
  );
}

export default BlackHoleMastery;
