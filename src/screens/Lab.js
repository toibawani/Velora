import React from 'react';
import PropTypes from 'prop-types';
import SimulationLab from '../components/SimulationLab';

/**
 * The Lab route. The simulations own their own shell; this screen exists so the
 * router has one place to pass navigation into, and so a future experiment can
 * be added without touching App.
 */
export default function Lab({ setScreen }) {
  return <SimulationLab onBack={() => setScreen('universe')} />;
}

Lab.propTypes = {
  setScreen: PropTypes.func,
};
