import React from 'react';
import { render, screen } from '@testing-library/react';
import AccountSection from './AccountSection';

// The default build: no Supabase URL, no key, no account. This is the shape the
// app ships in when nobody configures a project, so it is not an edge case.
jest.mock('../backend/supabaseClient', () => ({ backendEnabled: false }));
jest.mock('../backend/api');

test('says accounts are off in one plain line and offers no control', () => {
  render(<AccountSection />);

  expect(screen.getByRole('heading', { name: 'Account' })).toBeInTheDocument();
  expect(
    screen.getByText('Accounts are not switched on in this build. Everything here works without one.'),
  ).toBeInTheDocument();
  expect(screen.queryByLabelText('Email address')).not.toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  // It must not report a session it cannot have.
  expect(screen.queryByText(/signed in as/i)).not.toBeInTheDocument();
});
