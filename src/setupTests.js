// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock HTMLCanvasElement.prototype.getContext for JSDOM
if (typeof window !== 'undefined' && window.HTMLCanvasElement) {
  window.HTMLCanvasElement.prototype.getContext = () => ({
    fillRect: () => {},
    clearRect: () => {},
    getImageData: (x, y, w, h) => ({ data: new Array(w * h * 4) }),
    putImageData: () => {},
    // A real ImageData carries a pixel buffer of w*h*4 bytes. Returning a
    // bare array breaks any canvas code that writes pixels, which is how the
    // wave simulation went unnoticed.
    createImageData: (w = 1, h = 1) => ({ width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }),
    setTransform: () => {},
    scale: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    ellipse: () => {},
    measureText: () => ({ width: 0 }),
    transform: () => {},
    resetTransform: () => {},
    drawImage: () => {},
    createRadialGradient: () => ({
      addColorStop: () => {},
    }),
    createLinearGradient: () => ({
      addColorStop: () => {},
    }),
  });
}

/* jsdom ships no matchMedia, and motion reads the reduced-motion preference
   once when its module first loads. The stub has to exist before any component
   import, and the preferences are read from a global so a test can change them
   and then re-import the component it wants to exercise. */
global.__veloraMediaPrefs = global.__veloraMediaPrefs || {};
window.matchMedia = (query) => {
  const prefs = global.__veloraMediaPrefs || {};
  const matches = /prefers-reduced-motion/.test(query)
    ? Boolean(prefs.reduce)
    : /\(pointer: fine\)/.test(query)
      ? prefs.fine !== false
      : /max-width/.test(query)
        ? Boolean(prefs.compact)
        : false;
  return {
    matches,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  };
};
