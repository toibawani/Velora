import React from 'react';
import RevisionPlannerComponent from '../components/RevisionPlanner';

/**
 * Screen wrapper for RevisionPlanner
 */
function RevisionPlanner({ setScreen }) {
  return (
    <RevisionPlannerComponent onBack={() => setScreen('universe')} />
  );
}

export default RevisionPlanner;