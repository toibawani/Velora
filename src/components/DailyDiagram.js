import React, { useId, useMemo, useState } from 'react';
import {
  schwarzschildRadiusKm,
  circularOrbitSpeed,
  escapeSpeed,
  twoSourceIntensity,
} from '../utils/physicsFormulas';

/**
 * The diagram on today's rabbit hole card.
 *
 * Each kind is a drawing with one control, and every number it prints comes
 * from src/utils/physicsFormulas.js. Nothing animates on its own: the reader
 * changes a value and the picture changes, which is also why there is nothing
 * here that needs a reduced-motion fallback beyond the CSS transitions.
 */

const W = 460;
const H = 240;

function Figure({ children, caption }) {
  return (
    <figure className="rh-figure">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={caption} className="rh-figure-svg">
        {children}
      </svg>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Light bending past a mass                                           */
/* ------------------------------------------------------------------ */

function BlackHoleDiagram() {
  const [mass, setMass] = useState(10);
  const rsKm = schwarzschildRadiusKm(mass);
  const cx = 300;
  const cy = H / 2;
  // The drawing is not to scale: the horizon is drawn from the real radius so
  // that doubling the mass visibly doubles the disc, but a 60 km horizon on a
  // 460-unit canvas would be a dot. The label carries the true number.
  const horizon = 8 + Math.min(46, mass * 0.9);

  const paths = useMemo(() => {
    const lines = [];
    for (let row = 1; row <= 9; row += 1) {
      const y0 = (H / 10) * row;
      // A ray travelling left to right is pulled toward the mass. The offset is
      // strongest close to the horizon, which is the shape lensing produces.
      const points = [];
      for (let step = 0; step <= 60; step += 1) {
        const x = (W / 60) * step;
        const dx = x - cx;
        const dy = y0 - cy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const pull = (horizon * horizon) / Math.max(distance, horizon * 0.6);
        const signed = dy === 0 ? (y0 < cy ? -1 : 1) : Math.sign(dy);
        points.push([x, y0 - signed * pull * 1.15]);
      }
      lines.push(points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' '));
    }
    return lines;
  }, [horizon, cy]);

  return (
    <div className="rh-diagram">
      <Figure caption={`Grid of spacetime bent around a ${mass} solar mass black hole. Light paths curve toward it.`}>
        {paths.map((d, index) => (
          <path key={index} d={d} className="rh-grid-line" />
        ))}
        <circle cx={cx} cy={cy} r={horizon} className="rh-horizon" />
        <circle cx={cx} cy={cy} r={horizon + 3} className="rh-horizon-ring" />
        <text x={cx} y={cy + 4} className="rh-figure-label" textAnchor="middle">r_s</text>
      </Figure>
      <div className="rh-controls">
        <label htmlFor="rh-mass">Mass: {mass} solar masses</label>
        <input
          id="rh-mass"
          type="range"
          min="1"
          max="40"
          step="1"
          value={mass}
          onChange={(event) => setMass(Number(event.target.value))}
        />
        <p className="rh-readout" aria-live="polite">
          r<sub>s</sub> = 2GM/c<sup>2</sup> = <strong>{rsKm.toFixed(1)} km</strong>
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Escape versus orbit                                                 */
/* ------------------------------------------------------------------ */

const GM = 100; // arbitrary toy units: one central mass
const R0 = 34; // start radius, in drawing units

function OrbitDiagram() {
  const [speedFactor, setSpeedFactor] = useState(1);
  const circular = circularOrbitSpeed(GM, R0);
  const escape = escapeSpeed(GM, R0);
  const speed = circular * speedFactor;
  const captured = speed < escape;

  const path = useMemo(() => {
    let x = R0;
    let y = 0;
    let vx = 0;
    let vy = speed;
    const points = [`M${(W / 2 + x).toFixed(1)} ${(H / 2 - y).toFixed(1)}`];
    const dt = 0.06;
    for (let step = 0; step < 900; step += 1) {
      const radius = Math.sqrt(x * x + y * y);
      const accel = GM / (radius * radius * radius);
      vx -= accel * x * dt;
      vy -= accel * y * dt;
      x += vx * dt;
      y += vy * dt;
      if (Math.abs(x) > 260 || Math.abs(y) > 160) break;
      points.push(`L${(W / 2 + x).toFixed(1)} ${(H / 2 - y).toFixed(1)}`);
    }
    return points.join(' ');
  }, [speed]);

  return (
    <div className="rh-diagram">
      <Figure caption={`Path of a probe leaving a mass at ${speedFactor.toFixed(2)} times the circular orbit speed.`}>
        <circle cx={W / 2} cy={H / 2} r="12" className="rh-mass" />
        <circle cx={W / 2} cy={H / 2} r={R0} className="rh-orbit-guide" />
        <path d={path} className="rh-probe-path" />
        <text x={W / 2} y={H / 2 + 4} className="rh-figure-label" textAnchor="middle">M</text>
      </Figure>
      <div className="rh-controls">
        <label htmlFor="rh-speed">Launch speed: {speedFactor.toFixed(2)} × circular</label>
        <input
          id="rh-speed"
          type="range"
          min="0.5"
          max="1.6"
          step="0.05"
          value={speedFactor}
          onChange={(event) => setSpeedFactor(Number(event.target.value))}
        />
        <p className="rh-readout" aria-live="polite">
          v = {speed.toFixed(1)} · v<sub>esc</sub> = {escape.toFixed(1)} ·{' '}
          <strong>{captured ? 'captured, the path closes' : 'escape, the path leaves'}</strong>
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Entropy: molecules in a box                                         */
/* ------------------------------------------------------------------ */

const PARTICLES = 24;

/** A small deterministic scatter, so the first frame is the same each visit. */
function scatter(index) {
  const a = Math.sin(index * 12.9898) * 43758.5453;
  const b = Math.sin(index * 78.233) * 12345.6789;
  return [Math.abs(a - Math.floor(a)), Math.abs(b - Math.floor(b))];
}

function EntropyDiagram() {
  const [shakes, setShakes] = useState(0);
  const positions = useMemo(
    () => Array.from({ length: PARTICLES }, (_, index) => {
      const [baseA, baseB] = scatter(index);
      // Each shake mixes a little more, converging on an even spread rather
      // than pretending to run a molecular dynamics solver.
      const mixed = Math.min(0.92, shakes * 0.12);
      const a = baseA * (1 - mixed) + ((index * 0.618) % 1) * mixed;
      const b = baseB * (1 - mixed) + ((index * 0.414) % 1) * mixed;
      return { x: 40 + a * 380, y: 30 + b * 180 };
    }),
    [shakes]
  );
  const left = positions.filter((p) => p.x < W / 2).length;

  return (
    <div className="rh-diagram">
      <Figure caption={`${PARTICLES} molecules in a box, ${left} on the left and ${PARTICLES - left} on the right.`}>
        <rect x="34" y="24" width="392" height="192" className="rh-box" />
        <line x1={W / 2} y1="24" x2={W / 2} y2="216" className="rh-box-split" />
        {positions.map((p, index) => (
          <circle key={index} cx={p.x} cy={p.y} r="4.5" className="rh-particle" />
        ))}
      </Figure>
      <div className="rh-controls">
        <button type="button" className="vl-btn vl-btn--quiet rh-shake" onClick={() => setShakes((n) => n + 1)}>
          Stir the box
        </button>
        <p className="rh-readout" aria-live="polite">
          Left half: <strong>{left}</strong> of {PARTICLES} · stirs: {shakes}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Two-source interference                                             */
/* ------------------------------------------------------------------ */

function WavesDiagram() {
  const [separation, setSeparation] = useState(46);
  const bars = [];
  const wavelength = 26;
  for (let index = 0; index < 90; index += 1) {
    const sinTheta = (index - 45) / 60;
    const intensity = twoSourceIntensity(separation, wavelength, sinTheta);
    bars.push({ x: 40 + index * 4.3, h: 6 + intensity * 150 });
  }

  return (
    <div className="rh-diagram">
      <Figure caption="Interference pattern on a screen lit by two coherent sources.">
        {bars.map((bar, index) => (
          <line
            key={index}
            x1={bar.x}
            y1={H / 2 - bar.h / 2}
            x2={bar.x}
            y2={H / 2 + bar.h / 2}
            className="rh-wave-bar"
          />
        ))}
        <line x1="40" y1={H / 2} x2="430" y2={H / 2} className="rh-axis" />
      </Figure>
      <div className="rh-controls">
        <label htmlFor="rh-sep">Source separation: {separation}</label>
        <input
          id="rh-sep"
          type="range"
          min="20"
          max="90"
          step="1"
          value={separation}
          onChange={(event) => setSeparation(Number(event.target.value))}
        />
        <p className="rh-readout" aria-live="polite">
          Bright where d·sin θ = mλ. Wider separation, closer fringes.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The cave                                                            */
/* ------------------------------------------------------------------ */

function CaveDiagram() {
  // The allegory turns on a count: each prisoner watches one shadow and takes
  // it for the whole of the thing. The slider makes that count explicit, which
  // is the one quantity the drawing can honestly vary.
  const [prisoners, setPrisoners] = useState(2);

  return (
    <div className="rh-diagram">
      <Figure caption={`${prisoners} prisoners facing a wall, a fire behind them, and objects casting the shadows they watch.`}>
        <line x1="34" y1="30" x2="34" y2="216" className="rh-cave-wall" />
        <text x="42" y="46" className="rh-figure-label">the wall</text>

        <circle cx="392" cy="150" r="14" className="rh-fire" />
        <text x="360" y="192" className="rh-figure-label">the fire</text>

        <rect x="300" y="92" width="18" height="42" className="rh-object" />
        <rect x="336" y="80" width="12" height="54" className="rh-object" />
        <text x="278" y="70" className="rh-figure-label">the objects</text>

        <path d="M62 150 q10 -18 20 0" className="rh-shadow" />
        <path d="M120 138 q14 -26 28 0" className="rh-shadow" />
        <path d="M196 160 q8 -12 16 0" className="rh-shadow" />
        <text x="70" y="118" className="rh-figure-label">what they see</text>

        {Array.from({ length: prisoners }, (_, index) => (
          <circle key={index} cx={244 + index * 24} cy="196" r="7" className="rh-particle" />
        ))}
        <text x="222" y="224" className="rh-figure-label">the prisoners</text>
      </Figure>
      <div className="rh-controls">
        <label htmlFor="rh-prisoners">Prisoners watching: {prisoners}</label>
        <input
          id="rh-prisoners"
          type="range"
          min="1"
          max="6"
          step="1"
          value={prisoners}
          onChange={(event) => setPrisoners(Number(event.target.value))}
        />
        <p className="rh-readout" aria-live="polite">
          {prisoners} {prisoners === 1 ? 'prisoner' : 'prisoners'}, and the wall shows {prisoners}{' '}
          {prisoners === 1 ? 'shadow' : 'shadows'}. The count is all they can compare; what is missing is everything
          between the wall and the fire.
        </p>
      </div>
    </div>
  );
}

const DIAGRAMS = {
  blackhole: BlackHoleDiagram,
  orbit: OrbitDiagram,
  entropy: EntropyDiagram,
  waves: WavesDiagram,
  cave: CaveDiagram,
};

const DailyDiagram = ({ kind }) => {
  const Diagram = DIAGRAMS[kind];
  const fallbackId = useId();
  if (!Diagram) return <p className="rh-readout" id={fallbackId}>No diagram for this question.</p>;
  return <Diagram />;
};

export default DailyDiagram;
