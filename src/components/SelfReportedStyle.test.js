import React from 'react';
import { render, screen } from '@testing-library/react';
import SelfReportedStyle from './SelfReportedStyle';

beforeEach(() => localStorage.clear());

const storeStyle = (style) =>
  localStorage.setItem('velora_onboarding_preferences', JSON.stringify({ domain: 'physics', style, time: '30 minutes' }));

test('renders nothing at all when no style was ever chosen', () => {
  const { container } = render(<SelfReportedStyle />);

  expect(container).toBeEmptyDOMElement();
});

test('shows what was chosen, named as a self-report rather than a reading', () => {
  storeStyle('visual');
  render(<SelfReportedStyle />);

  expect(screen.getByText('You told us')).toBeInTheDocument();
  expect(screen.getByText('Visual')).toBeInTheDocument();
  expect(screen.getByText(/not measured/i)).toBeInTheDocument();
  // The card sits in its own region, so nothing here can be read as a stat tile.
  expect(screen.getByLabelText('Self-reported learning style')).toBeInTheDocument();
});
