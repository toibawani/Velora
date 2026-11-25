import React from 'react';
import { render, screen } from '@testing-library/react';
import RelativityLab from './RelativityLab';
import SensoryRooms from './SensoryRooms';
import BlackHolesElite from './BlackHolesElite';

describe('Velora Scientific & Sensory Features', () => {
  test('renders RelativityLab with calculations and preset benchmarks', () => {
    render(<RelativityLab onBack={() => {}} />);
    expect(screen.getByText(/one second here, measured from far away/i)).toBeInTheDocument();
    expect(screen.getByText(/Schwarzschild radius/i)).toBeInTheDocument();
    expect(screen.getByText(/Sagittarius A\*/i)).toBeInTheDocument();
    expect(screen.getByText(/Gravitational time dilation/i)).toBeInTheDocument();
  });

  test('renders SensoryRooms with Web Audio soundscape channels and breathing pacer', () => {
    render(<SensoryRooms onBack={() => {}} />);
    expect(screen.getByText(/Deep Focus Sensory Room/i)).toBeInTheDocument();
    // The channel names no longer claim 432 Hz is cosmic or that a binaural
    // beat puts you into a brain state.
    expect(screen.getByText(/Low Drone \(432 Hz\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Binaural Beat \(10 Hz\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Deep Brownian Noise/i)).toBeInTheDocument();
  });

  test('renders BlackHolesElite with updated CTA action triggers', () => {
    render(<BlackHolesElite onExploreMasterclass={() => {}} onOpenLab={() => {}} />);
    expect(screen.getByText(/Explore Full Black Holes Masterclass/i)).toBeInTheDocument();
    expect(screen.getByText(/Launch Relativity Simulation Lab/i)).toBeInTheDocument();
  });
});
