import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Pause, Play, RotateCcw } from 'lucide-react';
import {
  barrierTransmission,
  deBroglieWavelengthNm,
  logisticBifurcation,
  logisticStep,
  lorenzDivergence,
  lorenzStep,
  rabiSurvival,
  zenoSurvival,
} from '../utils/labMath';
import '../styles/SimulationLab.css';

/**
 * The Lab.
 *
 * Four numerical experiments, each built on src/utils/labMath.js. The rule for
 * this file is that every number on screen is produced by the model rather than
 * drawn to look plausible, and every panel states the model's limits.
 */

/** Read a design token from the document, so a canvas matches the theme. */
const token = (name, fallback) => {
  if (typeof window === 'undefined' || !document?.documentElement) return fallback;
  const value = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
};

function useCanvas(draw, deps) {
  const ref = useRef(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    let frame = 0;
    const render = () => {
      const parent = canvas.parentElement;
      const width = parent ? parent.clientWidth : 600;
      const height = parent ? Math.max(220, Math.round(width * 0.5)) : 300;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      drawRef.current(ctx, width, height);
    };
    render();
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

function Slider({ label, value, min, max, step, unit, onChange, note }) {
  return (
    <label className="lab-control">
      <span className="lab-control-head">
        <span>{label}</span>
        <strong>
          {value}
          {unit ? <span className="lab-unit"> {unit}</span> : null}
        </strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {note ? <span className="lab-control-note">{note}</span> : null}
    </label>
  );
}

Slider.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  unit: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  note: PropTypes.string,
};

function Experiment({ number, field, title, question, children, controls, readout, equation, symbols, notice, challenge, limits, onReset }) {
  return (
    <article className="lab-exp" aria-labelledby={`lab-exp-${number}`}>
      <header className="lab-exp-head">
        <p className="lab-exp-kicker">
          <span>{String(number).padStart(2, '0')}</span> {field}
        </p>
        <h2 id={`lab-exp-${number}`}>{title}</h2>
        <p className="lab-exp-question">{question}</p>
      </header>

      <div className="lab-exp-body">
        <div className="lab-figure">{children}</div>
        <div className="lab-panel">
          <div className="lab-controls">{controls}</div>
          <button type="button" className="lab-reset" onClick={onReset}>
            <RotateCcw size={14} aria-hidden="true" /> Reset to the starting values
          </button>
        </div>
      </div>

      <div className="lab-readout" role="status">
        {readout}
      </div>

      <div className="lab-model">
        <p className="lab-model-label">The model</p>
        <div className="lab-equation">{equation}</div>
        <dl className="lab-symbols">
          {symbols.map((symbol) => (
            <div key={symbol.symbol}>
              <dt>{symbol.symbol}</dt>
              <dd>
                {symbol.meaning} <span>{symbol.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="lab-notes">
        <div>
          <h3>What to notice</h3>
          <p>{notice}</p>
        </div>
        <div>
          <h3>An experiment to try</h3>
          <p>{challenge}</p>
        </div>
        <div>
          <h3>What this model leaves out</h3>
          <p>{limits}</p>
        </div>
      </div>
    </article>
  );
}

Experiment.propTypes = {
  number: PropTypes.number.isRequired,
  field: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  children: PropTypes.node,
  controls: PropTypes.node,
  readout: PropTypes.node,
  equation: PropTypes.string.isRequired,
  symbols: PropTypes.arrayOf(PropTypes.object).isRequired,
  notice: PropTypes.string.isRequired,
  challenge: PropTypes.string.isRequired,
  limits: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
};

/* -------------------------------------------------------------------------
    Tunnelling
   ------------------------------------------------------------------------- */

const TUNNEL_DEFAULTS = { energy: 4.5, barrier: 5, width: 1.2 };

function TunnellingLab() {
  const [state, setState] = useState(TUNNEL_DEFAULTS);

  const transmission = barrierTransmission({
    energyEv: state.energy,
    barrierEv: state.barrier,
    widthNm: state.width,
  });
  const wavelength = deBroglieWavelengthNm(state.energy);

  const curve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 160; i += 1) {
      const energy = 0.2 + (i / 160) * 9.8;
      points.push({
        energy,
        t: barrierTransmission({ energyEv: energy, barrierEv: state.barrier, widthNm: state.width }),
      });
    }
    return points;
  }, [state.barrier, state.width]);

  const canvasRef = useCanvas(
    (ctx, w, h) => {
      const ink = token('--text-primary', '#1a1410');
      const accent = token('--accent-primary', '#a33b1f');
      const subdued = token('--text-tertiary', '#8a7a68');
      const pad = { l: 46, r: 16, t: 18, b: 34 };
      const plotW = w - pad.l - pad.r;
      const plotH = h - pad.t - pad.b;

      ctx.fillStyle = token('--bg-elevated', '#fbf6ec');
      ctx.fillRect(0, 0, w, h);

      // Axes
      ctx.strokeStyle = subdued;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.l, pad.t);
      ctx.lineTo(pad.l, pad.t + plotH);
      ctx.lineTo(pad.l + plotW, pad.t + plotH);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Barrier marker
      const barrierX = pad.l + plotW * (state.barrier / 10.2);
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.35;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(barrierX, pad.t);
      ctx.lineTo(barrierX, pad.t + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // Transmission curve. Log scale would be honest across six decades, so
      // the plot compresses with a power of 0.4 and says so in the readout.
      const yFor = (t) => pad.t + plotH - Math.pow(Math.max(t, 1e-12), 0.4) * plotH;
      const xFor = (e) => pad.l + (e / 10.2) * plotW;
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      curve.forEach((point, i) => {
        const x = xFor(point.energy);
        const y = yFor(point.t);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Current point
      const cx = xFor(state.energy);
      const cy = yFor(transmission);
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Labels
      ctx.fillStyle = subdued;
      ctx.font = '11px "Source Sans 3", sans-serif';
      ctx.fillText('transmission (compressed)', pad.l, pad.t - 6);
      ctx.fillText('incident energy (eV) →', pad.l + plotW - 120, pad.t + plotH + 22);
      ctx.fillText('0', pad.l - 4, pad.t + plotH + 14);
      ctx.fillText('5', xFor(5) - 3, pad.t + plotH + 14);
      ctx.fillText('10', xFor(10.2) - 8, pad.t + plotH + 14);
      ctx.fillText('barrier', barrierX + 5, pad.t + 12);
    },
    [curve, transmission, state.energy, state.barrier]
  );

  const percentage = transmission * 100;
  const label =
    percentage > 10 ? percentage.toFixed(1) : percentage > 0.01 ? percentage.toFixed(3) : percentage.toExponential(2);

  return (
    <Experiment
      number={1}
      field="Quantum mechanics"
      title="Tunnelling through a barrier"
      question="A particle with less energy than the barrier in front of it can still appear on the other side. How much gets through, and why does the answer collapse so fast with width?"
      controls={
        <>
          <Slider
            label="Particle energy"
            value={state.energy}
            min={0.5}
            max={9.5}
            step={0.1}
            unit="eV"
            onChange={(energy) => setState((prev) => ({ ...prev, energy }))}
            note="The kinetic energy the particle would have far from the barrier."
          />
          <Slider
            label="Barrier height"
            value={state.barrier}
            min={0.5}
            max={10}
            step={0.1}
            unit="eV"
            onChange={(barrier) => setState((prev) => ({ ...prev, barrier }))}
            note="The potential energy inside the barrier. When it exceeds the particle energy, tunnelling is the only way through."
          />
          <Slider
            label="Barrier width"
            value={state.width}
            min={0.05}
            max={3}
            step={0.05}
            unit="nm"
            onChange={(width) => setState((prev) => ({ ...prev, width }))}
            note="The distance over which the wavefunction must decay. This is the variable that matters most."
          />
        </>
      }
      readout={
        <>
          <span className="lab-big">{label}%</span> of the incident wave is transmitted.
          <span className="lab-readout-sub">
            {state.energy < state.barrier
              ? 'The particle is below the barrier: this is quantum tunnelling, and classically the answer would be exactly zero.'
              : 'The particle is above the barrier, but it still reflects at the edges — transmission is not 100% until the energy is far above the barrier.'}
          </span>
          <span className="lab-readout-sub">
            de Broglie wavelength: {wavelength.toFixed(3)} nm. The barrier is {(state.width / wavelength).toFixed(1)} wavelengths thick.
          </span>
        </>
      }
      equation="T = 1 / [1 + (k² + κ²)² sinh²(κL) / (4k²κ²)],  κ = √(2m(V₀ − E))/ħ"
      symbols={[
        { symbol: 'T', meaning: 'Transmission probability', unit: '0 to 1' },
        { symbol: 'E', meaning: 'Particle energy', unit: 'eV' },
        { symbol: 'V₀', meaning: 'Barrier height', unit: 'eV' },
        { symbol: 'L', meaning: 'Barrier width', unit: 'nm' },
        { symbol: 'κ', meaning: 'Decay constant inside the barrier. Larger κ means faster decay.', unit: '1/m' },
        { symbol: 'k', meaning: 'Wave number outside the barrier', unit: '1/m' },
        { symbol: 'm', meaning: 'Particle mass, taken as the electron mass', unit: 'kg' },
      ]}
      notice="Below the barrier, transmission falls off exponentially with width: doubling L does not halve T, it squares the suppression. Above the barrier, T oscillates because the wave reflects off both faces and interferes with itself. The plot compresses a huge range: a transmission of 10⁻⁶ and 10⁶ would be invisible next to 1 on a linear axis."
      challenge="Set the energy just below the barrier and watch the percentage. Now halve the width and note the factor by which transmission rises. Then raise the energy to just above the barrier and find a dip — that is a resonance, not a mistake."
      limits="A rectangular barrier, one dimension, a single non-relativistic particle, and no interaction with the environment. Real tunnelling happens through a barrier that is neither perfectly rectangular nor static, and the particle may lose energy to the lattice on the way. The model also ignores spin and assumes the mass is the bare electron mass, which is wrong inside a semiconductor."
      onReset={() => setState(TUNNEL_DEFAULTS)}
    >
      <canvas ref={canvasRef} role="img" aria-label="Transmission probability against incident energy" />
    </Experiment>
  );
}

/* -------------------------------------------------------------------------
   Lorenz
   ------------------------------------------------------------------------- */

const LORENZ_DEFAULTS = { sigma: 10, rho: 28, beta: 2.667, running: true };

function LorenzLab() {
  const [params, setParams] = useState(LORENZ_DEFAULTS);
  const [version, setVersion] = useState(0);
  const [divergence, setDivergence] = useState(0);
  const trail = useRef([]);
  const state = useRef({ x: 0.1, y: 0, z: 0 });
  const last = useRef(0);

  const reset = useCallback(() => {
    trail.current = [];
    state.current = { x: 0.1, y: 0, z: 0 };
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    reset();
  }, [params.sigma, params.rho, params.beta, reset]);

  useEffect(() => {
    setDivergence(lorenzDivergence({ sigma: params.sigma, rho: params.rho, beta: params.beta }));
  }, [params.sigma, params.rho, params.beta]);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let raf = 0;

    const render = () => {
      const parent = canvas.parentElement;
      const width = parent ? parent.clientWidth : 600;
      const height = parent ? Math.max(240, Math.round(width * 0.55)) : 300;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const paper = token('--bg-elevated', '#fbf6ec');
      const ink = token('--text-primary', '#1a1410');
      const accent = token('--accent-primary', '#a33b1f');
      const subdued = token('--text-tertiary', '#8a7a68');

      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, width, height);

      // Project x against z, the view that makes the two lobes visible.
      const project = (p) => ({
        x: width * 0.5 + p.x * (width / 62),
        y: height * 0.55 - (p.z - 25) * (height / 60),
      });

      // Axes
      ctx.strokeStyle = subdued;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width * 0.5, 12);
      ctx.lineTo(width * 0.5, height - 12);
      ctx.moveTo(12, height * 0.55);
      ctx.lineTo(width - 12, height * 0.55);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = subdued;
      ctx.font = '11px "Source Sans 3", sans-serif';
      ctx.fillText('z', width * 0.5 + 6, 20);
      ctx.fillText('x', width - 20, height * 0.55 - 6);

      const points = trail.current;
      if (points.length > 1) {
        const split = Math.floor(points.length * 0.6);
        ctx.lineWidth = 1;
        for (let i = 1; i < points.length; i += 1) {
          const a = project(points[i - 1]);
          const b = project(points[i]);
          ctx.strokeStyle = i < split ? accent : ink;
          ctx.globalAlpha = i < split ? 0.25 : 0.75;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        const head = project(points[points.length - 1]);
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = subdued;
      ctx.fillText(`σ ${params.sigma.toFixed(1)}   ρ ${params.rho.toFixed(1)}   β ${params.beta.toFixed(2)}`, 14, height - 14);
    };

    const accrue = () => {
      const steps = 4;
      for (let i = 0; i < steps; i += 1) {
        state.current = lorenzStep(
          state.current,
          { sigma: params.sigma, rho: params.rho, beta: params.beta },
          0.004
        );
        trail.current.push(state.current);
      }
      if (trail.current.length > 2600) trail.current = trail.current.slice(-2600);
    };

    const loop = (time) => {
      if (time - last.current > 24) {
        last.current = time;
        if (params.running) accrue();
        render();
      }
      raf = requestAnimationFrame(loop);
    };

    render();
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [params, version]);

  const finite = Number.isFinite(divergence);
  const lyapunov = finite ? divergence.toFixed(2) : '—';

  return (
    <Experiment
      number={2}
      field="Complex systems"
      title="The Lorenz attractor"
      question="Three coupled equations, no randomness, and a trajectory that never repeats. What do the three parameters control, and how quickly does predictability disappear?"
      controls={
        <>
          <Slider
            label="σ (Prandtl number)"
            value={params.sigma}
            min={1}
            max={20}
            step={0.1}
            onChange={(sigma) => setParams((prev) => ({ ...prev, sigma }))}
            note="The ratio of viscosity to thermal diffusivity. It sets how strongly x is pulled toward y."
          />
          <Slider
            label="ρ (Rayleigh number)"
            value={params.rho}
            min={1}
            max={60}
            step={0.1}
            onChange={(rho) => setParams((prev) => ({ ...prev, rho }))}
            note="The temperature difference driving the convection. Below about 24.7 the origin is stable and the trajectory spirals in."
          />
          <Slider
            label="β (geometry factor)"
            value={params.beta}
            min={0.5}
            max={6}
            step={0.01}
            onChange={(beta) => setParams((prev) => ({ ...prev, beta }))}
            note="The aspect ratio of the convection cells. It scales how fast z decays."
          />
          <div className="lab-inline-actions">
            <button
              type="button"
              className="lab-toggle"
              onClick={() => setParams((prev) => ({ ...prev, running: !prev.running }))}
            >
              {params.running ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
              {params.running ? 'Pause' : 'Run'}
            </button>
          </div>
        </>
      }
      readout={
        <>
          Largest Lyapunov exponent: <span className="lab-big">{lyapunov}</span> per unit time.
          <span className="lab-readout-sub">
            A positive value means two trajectories starting 10⁻⁸ apart separate exponentially. The estimate is
            finite-time and changes with the parameters; it is not a property of a single orbit.
          </span>
          <span className="lab-readout-sub">
            The ember section of the trail is the older history; the ink section is the most recent. The trajectory
            switches lobes without ever repeating its path.
          </span>
        </>
      }
      equation="ẋ = σ(y − x),  ẏ = x(ρ − z) − y,  ż = xy − βz"
      symbols={[
        { symbol: 'x, y, z', meaning: 'The state: convective flow rate, temperature difference, and departure from linearity', unit: 'dimensionless' },
        { symbol: 'σ', meaning: 'Prandtl number, the ratio of momentum to thermal diffusivity', unit: 'dimensionless' },
        { symbol: 'ρ', meaning: 'Rayleigh number, proportional to the temperature gradient', unit: 'dimensionless' },
        { symbol: 'β', meaning: 'Aspect ratio of the convection cells', unit: 'dimensionless' },
      ]}
      notice="At ρ below about 24.74 the trajectory spirals into one of two fixed points and stays there. Above that value both fixed points become unstable and the orbit wanders between the lobes forever. The switch is not random: the equations are deterministic. It is sensitive dependence, not chance."
      challenge="Set ρ to 20 and watch the orbit settle. Raise it slowly past 24.74 and note the moment it stops settling. Then try σ = 10, ρ = 28, β = 8/3 and leave it running for a minute: the pattern looks stable at a glance and never actually repeats."
      limits="The Lorenz system is a three-variable truncation of Rayleigh–Bénard convection. It is not a simulation of a real fluid: it keeps three modes of an infinite expansion. The Lyapunov estimate is finite-time and depends on the initial separation. The canvas projects onto the x–z plane, so a crossing on screen is not a crossing in three dimensions."
      onReset={() => setParams(LORENZ_DEFAULTS)}
    >
      <canvas ref={canvasRef} role="img" aria-label="Lorenz attractor traced in the x–z plane" />
    </Experiment>
  );
}

/* -------------------------------------------------------------------------
   Bifurcation
   ------------------------------------------------------------------------- */

const BIFURCATION_DEFAULT_R = 3.57;

function BifurcationLab() {
  const [r, setR] = useState(BIFURCATION_DEFAULT_R);
  const [zoom, setZoom] = useState(false);

  const points = useMemo(
    () =>
      logisticBifurcation({
        rMin: zoom ? 3.4 : 2.4,
        rMax: zoom ? 4 : 4,
        samples: zoom ? 420 : 520,
        keep: zoom ? 55 : 40,
      }),
    [zoom]
  );

  const rMin = zoom ? 3.4 : 2.4;

  const orbit = useMemo(() => {
    let x = 0.4;
    for (let i = 0; i < 400; i += 1) x = logisticStep(r, x);
    const values = [];
    for (let i = 0; i < 64; i += 1) {
      x = logisticStep(r, x);
      values.push(x);
    }
    return values;
  }, [r]);

  const distinct = useMemo(() => {
    const rounded = new Set(orbit.map((value) => value.toFixed(3)));
    return rounded.size;
  }, [orbit]);

  const canvasRef = useCanvas(
    (ctx, w, h) => {
      const ink = token('--text-primary', '#1a1410');
      const accent = token('--accent-primary', '#a33b1f');
      const subdued = token('--text-tertiary', '#8a7a68');
      const pad = { l: 40, r: 14, t: 16, b: 30 };
      const plotW = w - pad.l - pad.r;
      const plotH = h - pad.t - pad.b;

      ctx.fillStyle = token('--bg-elevated', '#fbf6ec');
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = subdued;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.l, pad.t);
      ctx.lineTo(pad.l, pad.t + plotH);
      ctx.lineTo(pad.l + plotW, pad.t + plotH);
      ctx.stroke();
      ctx.globalAlpha = 1;

      const xFor = (value) => pad.l + ((value - rMin) / (4 - rMin)) * plotW;
      const yFor = (value) => pad.t + plotH - value * plotH;

      ctx.fillStyle = ink;
      ctx.globalAlpha = 0.5;
      points.forEach((point) => {
        ctx.fillRect(xFor(point.r), yFor(point.x), 1, 1);
      });
      ctx.globalAlpha = 1;

      // The chosen r
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(xFor(r), pad.t);
      ctx.lineTo(xFor(r), pad.t + plotH);
      ctx.stroke();

      // Current orbit points on the line
      ctx.fillStyle = accent;
      orbit.forEach((value) => {
        ctx.beginPath();
        ctx.arc(xFor(r), yFor(value), 1.6, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = subdued;
      ctx.font = '11px "Source Sans 3", sans-serif';
      ctx.fillText('1', pad.l - 14, yFor(1) + 4);
      ctx.fillText('0', pad.l - 14, yFor(0) + 4);
      ctx.fillText(`r = ${rMin}`, pad.l, h - 8);
      ctx.fillText('r = 4', pad.l + plotW - 30, h - 8);
      ctx.fillText('x', pad.l - 24, pad.t + 8);
    },
    [points, r, orbit, zoom]
  );

  const behaviour =
    r < 3
      ? 'a single stable value'
      : r < 3.449
      ? 'a period-2 oscillation'
      : r < 3.544
      ? 'a period-4 oscillation'
      : r < 3.5699
      ? 'period 8, 16, 32… as r rises'
      : 'a chaotic band with periodic windows';

  return (
    <Experiment
      number={3}
      field="Chaos"
      title="The logistic map, end to end"
      question="One line — x next = r × x × (1 − x) — produces a fixed point, then an oscillation, then a cascade of doublings, then chaos. Where does order actually end?"
      controls={
        <>
          <Slider
            label="Growth rate r"
            value={r}
            min={2.4}
            max={4}
            step={0.001}
            onChange={setR}
            note="The only parameter. Below 1 the population dies; between 3 and 3.57 it doubles its period repeatedly; beyond 3.57 much of the range is chaotic."
          />
          <div className="lab-inline-actions">
            <button type="button" className="lab-toggle" onClick={() => setZoom((value) => !value)}>
              {zoom ? 'Show the whole range' : 'Zoom into the cascade'}
            </button>
          </div>
        </>
      }
      readout={
        <>
          At r = {r.toFixed(3)} the map settles into <span className="lab-big">{behaviour}</span>.
          <span className="lab-readout-sub">
            After a transient of 400 iterations, the next 64 values take {distinct} distinct values to three
            decimal places. That is the period, unless the motion is chaotic, in which case no finite count is
            the period.
          </span>
          <span className="lab-readout-sub">
            The ratio of successive bifurcation intervals approaches 4.669: Feigenbaum's constant, which is the
            same for a whole class of maps. That universality is why this toy equation matters.
          </span>
        </>
      }
      equation="x_{n+1} = r x_n (1 − x_n)"
      symbols={[
        { symbol: 'x_n', meaning: 'The state at step n, confined between 0 and 1', unit: 'dimensionless' },
        { symbol: 'r', meaning: 'The growth rate, from 0 to 4. Above 4 the state escapes the interval.', unit: 'dimensionless' },
        { symbol: 'n', meaning: 'Iteration number. This is a discrete-time model, not a differential equation.', unit: 'integer' },
      ]}
      notice="Each dot in the diagram is a value the map visits after the transient. Where there is one dot, the map is periodic with period 1. Where there are two, it alternates. The cascade of doublings accumulates at r ≈ 3.5699, and past that the dots smear into bands — but the bands contain pale vertical stripes where the map becomes periodic again. Chaos and order are interleaved, not sequential."
      challenge="Find a periodic window inside the chaotic region: around r = 3.83 the map returns to period 3. Set r = 3.83 and count the distinct values. Then set r = 3.8284 and watch the count change."
      limits="This is a discrete map, not a physical population. Real populations have noise, age structure and space, and no real system follows this equation exactly. The diagram is swept at finite resolution, so thin periodic windows can be missed. The transient of 400 steps is long enough for most r but not a proof of convergence."
      onReset={() => {
        setR(BIFURCATION_DEFAULT_R);
        setZoom(false);
      }}
    >
      <canvas ref={canvasRef} role="img" aria-label="Bifurcation diagram of the logistic map" />
    </Experiment>
  );
}

/* -------------------------------------------------------------------------
   Quantum Zeno
   ------------------------------------------------------------------------- */

const ZENO_DEFAULTS = { omega: 1, totalTime: 2, measurements: 10 };

function ZenoLab() {
  const [state, setState] = useState(ZENO_DEFAULTS);

  // Total time is fixed and the interval is derived. The other choice - a fixed
  // interval with N varying - lengthens the experiment as N rises and makes the
  // survival probability fall. That is not the Zeno effect, it is a longer
  // experiment, and presenting it as the effect would have been wrong.
  const tau = state.totalTime / state.measurements;
  const survival = zenoSurvival({ omega: state.omega, tau, measurements: state.measurements });
  const free = rabiSurvival({ omega: state.omega, time: state.totalTime });

  const curve = useMemo(() => {
    const points = [];
    for (let n = 1; n <= 200; n += 1) {
      points.push({
        n,
        p: zenoSurvival({ omega: state.omega, tau: state.totalTime / n, measurements: n }),
      });
    }
    return points;
  }, [state.omega, state.totalTime]);

  const canvasRef = useCanvas(
    (ctx, w, h) => {
      const ink = token('--text-primary', '#1a1410');
      const accent = token('--accent-primary', '#a33b1f');
      const subdued = token('--text-tertiary', '#8a7a68');
      const pad = { l: 44, r: 16, t: 18, b: 32 };
      const plotW = w - pad.l - pad.r;
      const plotH = h - pad.t - pad.b;

      ctx.fillStyle = token('--bg-elevated', '#fbf6ec');
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = subdued;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.l, pad.t);
      ctx.lineTo(pad.l, pad.t + plotH);
      ctx.lineTo(pad.l + plotW, pad.t + plotH);
      ctx.stroke();
      ctx.globalAlpha = 1;

      const xFor = (n) => pad.l + (Math.log10(n) / Math.log10(200)) * plotW;
      const yFor = (p) => pad.t + plotH - p * plotH;

      // Free-evolution reference
      ctx.strokeStyle = subdued;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(pad.l, yFor(free));
      ctx.lineTo(pad.l + plotW, yFor(free));
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      curve.forEach((point, i) => {
        const x = xFor(point.n);
        const y = yFor(point.p);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      const cx = xFor(state.measurements);
      const cy = yFor(survival);
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = subdued;
      ctx.font = '11px "Source Sans 3", sans-serif';
      ctx.fillText('survival probability', pad.l, pad.t - 6);
      ctx.fillText('1', pad.l - 14, yFor(1) + 4);
      ctx.fillText('0', pad.l - 14, yFor(0) + 4);
      ctx.fillText('1 measurement', pad.l - 8, h - 8);
      ctx.fillText('200', pad.l + plotW - 18, h - 8);
      ctx.fillText('unmeasured', pad.l + 4, yFor(free) - 6);
    },
    [curve, survival, free, state.measurements]
  );

  return (
    <Experiment
      number={4}
      field="Measurement"
      title="The quantum Zeno effect"
      question="Ask a two-level system the same question often enough and it can be held in place. How many measurements does it take, and what does the survival curve actually look like?"
      controls={
        <>
          <Slider
            label="Rabi frequency Ω"
            value={state.omega}
            min={0.2}
            max={4}
            step={0.1}
            unit="rad/s"
            onChange={(omega) => setState((prev) => ({ ...prev, omega }))}
            note="How fast the two states exchange population when nothing measures them."
          />
          <Slider
            label="Total time T"
            value={state.totalTime}
            min={0.2}
            max={4}
            step={0.1}
            unit="s"
            onChange={(totalTime) => setState((prev) => ({ ...prev, totalTime }))}
            note="Held fixed while N changes, so the comparison is like for like. The interval between measurements is τ = T/N."
          />
          <Slider
            label="Number of measurements N"
            value={state.measurements}
            min={1}
            max={200}
            step={1}
            onChange={(measurements) => setState((prev) => ({ ...prev, measurements }))}
            note="Each measurement projects the system back onto the state it was found in."
          />
        </>
      }
      readout={
        <>
          Survival probability: <span className="lab-big">{(survival * 100).toFixed(2)}%</span> after{' '}
          {state.measurements} measurements over {state.totalTime.toFixed(1)} s, one every
          {' '}{tau.toFixed(4)} s.
          <span className="lab-readout-sub">
            With no measurements at all, the same total time would leave {Math.round(free * 100)}% of the
            population in the initial state.
          </span>
          <span className="lab-readout-sub">
            {survival > free + 0.005
              ? 'Measurement is inhibiting the transition: this is the Zeno regime.'
              : survival < free - 0.005
              ? 'Measurement is not inhibiting here, because the interval is long compared with the oscillation.'
              : 'The measurement rate is too low to change the outcome appreciably.'}
          </span>
        </>
      }
      equation="P(N) = cos^{2N}(Ωτ / 2)"
      symbols={[
        { symbol: 'P', meaning: 'Probability of still finding the system in its initial state', unit: '0 to 1' },
        { symbol: 'N', meaning: 'Number of projective measurements', unit: 'integer' },
        { symbol: 'Ω', meaning: 'Rabi frequency of the two-level system', unit: 'rad/s' },
        { symbol: 'τ', meaning: 'Time between measurements', unit: 's' },
      ]}
      notice="The curve rises toward 1 as N grows, because each measurement projects the system back and the intervals shrink at the same time. The dashed line is the unmeasured survival probability for the same total time, and it does not move when you change N: that is what makes the comparison honest. At very large N the curve is flat against the top of the plot, which is the Zeno limit."
      challenge="Set T = 2 s and Ω = 1. At N = 1 the system has time to rotate a long way. Raise N to 20, then 200, and watch survival climb toward 1. Then change T and note that a longer total time needs more measurements to hold the system in place."
      limits="Ideal projective measurements, infinitely fast, with no error. A real measurement has a duration and can itself drive transitions. The two-level model ignores decay to a third level and any coupling to the environment. The formula is exact for this idealisation and approximate for every real experiment. Anti-Zeno behaviour, where an intermediate measurement rate accelerates decay, needs a structured environment and is not in this model."
      onReset={() => setState(ZENO_DEFAULTS)}
    >
      <canvas ref={canvasRef} role="img" aria-label="Survival probability against number of measurements" />
    </Experiment>
  );
}

/* -------------------------------------------------------------------------
   The screen body
   ------------------------------------------------------------------------- */

export default function SimulationLab({ onBack, onOpenClassic }) {
  return (
    <div className="lab-shell">
      <header className="lab-masthead">
        <div>
          <p className="lab-kicker">Four numerical experiments</p>
          <h1>The Lab</h1>
          <p className="lab-lead">
            Every panel below solves a model. Change a parameter and the numbers are recomputed from the
            equations, not redrawn to look convincing. The equation, its symbols and its assumptions sit under
            each figure, because a simulation you cannot audit is a screensaver.
          </p>
        </div>
        <div className="lab-masthead-side">
          <p>
            <strong>Deterministic, not decorative.</strong> The tunnelling panel solves the rectangular-barrier
            matching conditions. The Lorenz panel integrates with fourth-order Runge–Kutta. The bifurcation panel
            iterates the map 340 times per column. The Zeno panel evaluates the projective-measurement product.
          </p>
          {onOpenClassic && (
            <button type="button" className="lab-classic-link" onClick={onOpenClassic}>
              Open the mechanics lab →
            </button>
          )}
        </div>
      </header>

      <TunnellingLab />
      <LorenzLab />
      <BifurcationLab />
      <ZenoLab />

      <footer className="lab-footer">
        <button type="button" onClick={onBack}>
          ← Back to the atlas
        </button>
        <p>
          Models in <code>src/utils/labMath.js</code>, unit-tested in <code>src/utils/labMath.test.js</code>.
        </p>
      </footer>
    </div>
  );
}

SimulationLab.propTypes = {
  onBack: PropTypes.func,
  onOpenClassic: PropTypes.func,
};
