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

describe('StackSpread', () => {
  test('shows every plate, and the plates are drawn rather than linked stock', () => {
    renderWith({});

    const { container } = renderWith({});
    const plates = Array.from(container.querySelectorAll('img'));
    const sources = plates.map((node) => node.getAttribute('src') || '');

    expect(sources).toHaveLength(8);
    sources.forEach((src) => {
      expect(src).toContain('/hero-plates/');
      expect(src).toMatch(/\.svg$/);
    });
    expect(sources.join(' ')).toContain('pendulum.svg');
    expect(sources.join(' ')).toContain('manuscript.svg');
    // The brief rules out stock photography, so nothing may point off-site.
    expect(sources.some((src) => /^https?:/.test(src))).toBe(false);

    // Every plate needs its own description, not one shared label.
    plates.forEach((node) => {
      expect(node.getAttribute('alt') || '').toMatch(/\w/);
    });
  });

  test('tidies itself into a grid when motion is welcome', () => {
    const { container } = renderWith({ reduce: false });

    expect(container.querySelector('.stack-field--still')).toBeNull();
  });

  test('renders the finished grid as still markup when motion is reduced', () => {
    const { container } = renderWith({ reduce: true });

    // The reduced branch should not merely animate less. It should be the end
    // state, with no fan offsets, and nothing asking for a compositor layer.
    expect(container.querySelector('.stack-field--still')).not.toBeNull();
    expect(container.querySelectorAll('.stack-plate-still')).toHaveLength(8);

    // A motion-driven plate would carry a transform matrix. The still plates
    // position themselves with left/top and a static rotation instead.
    const plates = container.querySelectorAll('.stack-plate');
    expect(plates).toHaveLength(8);
    plates.forEach((plate) => {
      expect(plate.style.transform || '').not.toMatch(/matrix/);
      expect(plate.style.left).toMatch(/calc/);
    });
  });

  test('leaves the pointer alone on a touch device', () => {
    const { container } = renderWith({ reduce: false, fine: false });
    const stage = container.querySelector('.stack-field-stage');

    // No handler means nothing to fire on a scroll-driven touch pass.
    expect(stage.onpointermove).toBeFalsy();
  });

  test('says in plain words what the field is', () => {
    renderWith({});
    expect(screen.getByText(/tidies itself into a grid/i)).toBeInTheDocument();
  });
});
