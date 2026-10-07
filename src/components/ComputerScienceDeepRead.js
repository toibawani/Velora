import React from 'react';
import PropTypes from 'prop-types';
import DeepRead from './DeepRead';
import { CS_LEVELS, TOTAL_ENTRIES, STATUS_LABELS } from '../data/computerscience';

/**
 * Computer science, through the same reader physics, philosophy and history use.
 *
 * This is the fourth time this pattern has been built, and the point of building
 * it four times is how little there is here. A subject with genuinely different
 * epistemics - one that needs five status tiers where the others needed three -
 * needed a wrapper component, a title, and its own vocabulary. The reader, the
 * rail, the pager, the focus handling, the glossary join and the level
 * navigation are all unchanged.
 *
 * The vocabulary is the one real difference and it is not cosmetic: 'proved',
 * 'measured', 'machine-dependent', 'contested' and 'open' each mean a different
 * thing about how a claim is backed, and 'machine-dependent' in particular has
 * no counterpart in the other three subjects, because in them a checked claim
 * is simply true.
 *
 * `initialLevelId` is how a reader who tapped "Quantum Computing" in the Atlas
 * lands on the frontier level rather than the top of the subject.
 */
function ComputerScienceDeepRead({ onBack, initialLevelId }) {
  return (
    <DeepRead
      levels={CS_LEVELS}
      eyebrow="Computer Science"
      title="Computer science, from the machine up"
      note={`${CS_LEVELS.length} levels, ${TOTAL_ENTRIES} entries. Every entry is labelled for what actually backs the claim: proved by a proof, measured on real hardware, true only of a named version or configuration, actively contested between capable people, or an open problem nobody has solved. A number in this subject is a statement about a machine, not about the world.`}
      railLabel="Computer science levels"
      statusLabels={STATUS_LABELS}
      onBack={onBack}
      initialLevelId={initialLevelId}
    />
  );
}

export default ComputerScienceDeepRead;