import React from 'react';
import { render, screen } from '@testing-library/react';

import StackSpread from './StackSpread';

/**
 * The matchMedia stub lives in setupTests, because jsdom has none. Setting the
 * preferences before render is enough here: the component reads the reduced
 * motion query live rather than sampling it once at module load.
 */
function renderWith(prefs) {
  global.__veloraMediaPrefs = prefs;
  return render(<StackSpread />);
}

afterEach(() => {
  global.__veloraMediaPrefs = {};
});

const STAGE_NAME = /eight drawn plates/i;

describe('StackSpread', () => {
  test('shows every plate, and the plates are drawn rather than linked stock', () => {
    renderWith({});

    // The plates are images with real alt text, so they can be found the way a
    // reader using a screen reader finds them rather than by class name.
    const plates = screen.getAllByRole('img');
    expect(plates).toHaveLength(8);

    plates.forEach((plate) => {
      expect(plate).toHaveAttribute('src', expect.stringContaining('/hero-plates/'));
      expect(plate).toHaveAttribute('src', expect.stringMatching(/\.svg$/));
      expect(plate).toHaveAttribute('src', expect.not.stringMatching(/^https?:/));
      // Every plate needs its own description, not one shared label.
      expect(plate).toHaveAttribute('alt', expect.stringMatching(/\w/));
    });

    // Two named drawings have to be among them, or the set could be eight
    // copies of one file and every assertion above would still pass.
    expect(screen.getByAltText(/a pendulum drawn hanging straight down/i)).toBeInTheDocument();
    expect(screen.getByAltText(/a page of text with a reader's note/i)).toBeInTheDocument();
  });

  test('tidies itself into a grid when motion is welcome', () => {
    renderWith({ reduce: false });

    expect(screen.getByTestId('stack-field')).not.toHaveClass('stack-field--still');
    screen.getAllByTestId('stack-plate').forEach((plate) => {
      expect(plate).toHaveClass('stack-plate-moving');
    });
  });

  test('renders the finished grid as still markup when motion is reduced', () => {
    renderWith({ reduce: true });

    // The reduced branch should not merely animate less. It should be the end
    // state, with no fan offsets, and nothing asking for a compositor layer.
    expect(screen.getByTestId('stack-field')).toHaveClass('stack-field--still');

    const plates = screen.getAllByTestId('stack-plate');
    expect(plates).toHaveLength(8);
    plates.forEach((plate) => {
      expect(plate).toHaveClass('stack-plate-still');
      // A motion-driven plate would carry a transform matrix. The still plates
      // position themselves with left/top and a static rotation instead.
      expect(plate).toHaveAttribute('style', expect.not.stringContaining('matrix'));
      expect(plate).toHaveAttribute('style', expect.stringContaining('calc(50%'));
    });
  });

  test('leaves the pointer alone on a touch device', () => {
    renderWith({ reduce: false, fine: false });
    const stage = screen.getByRole('group', { name: STAGE_NAME });

    // No handler means nothing to fire on a scroll-driven touch pass.
    expect(stage.onpointermove).toBeFalsy();
    expect(stage.onpointerleave).toBeFalsy();
  });

  test('says in plain words what the field is', () => {
    renderWith({});
    expect(screen.getByText(/tidies itself into a grid/i)).toBeInTheDocument();
  });
});
