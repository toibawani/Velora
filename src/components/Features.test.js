import React from 'react';
import { render, screen } from '@testing-library/react';
import RelativityLab from './RelativityLab';
import SensoryRooms from './SensoryRooms';
import BlackHolesElite from './BlackHolesElite';

describe('Velora Scientific & Sensory Features', () => {
  test('renders RelativityLab with calculations and preset benchmarks', () => {
    render(<RelativityLab onBack={() => {}} />);
    expect(screen.getByText(/General Relativity & Spacetime Laboratory/i)).toBeInTheDocument();
    expect(screen.getByText(/Schwarzschild Radius/i)).toBeInTheDocument();
    expect(screen.getByText(/Sagittarius A\*/i)).toBeInTheDocument();
    expect(screen.getByText(/Gravitational Time Dilation/i)).toBeInTheDocument();
  });

  test('renders SensoryRooms with Web Audio soundscape channels and breathing pacer', () => {
    render(<SensoryRooms onBack={() => {}} />);
    expect(screen.getByText(/Deep Focus Sensory Room/i)).toBeInTheDocument();
    expect(screen.getByText(/Cosmic Harmonic \(432 Hz\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Binaural Alpha Waves \(10 Hz\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Deep Brownian Noise/i)).toBeInTheDocument();
  });

  test('renders BlackHolesElite with updated CTA action triggers', () => {
    render(<BlackHolesElite onExploreMasterclass={() => {}} onOpenLab={() => {}} />);
    expect(screen.getByText(/Explore Full Black Holes Masterclass/i)).toBeInTheDocument();
    expect(screen.getByText(/Launch Relativity Simulation Lab/i)).toBeInTheDocument();
  });
});
