import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Play,
  Pause,
  RotateCcw,
  ArrowDown,
  Zap,
  Target,
  Waves,
  Orbit,
} from 'lucide-react';
import {
  predictedFallTime,
  predictedAirborneTime,
  frictionFor,
  netAcceleration,
  maxHeight,
  hangTime,
  projectileRange,
  circularSpeed,
  escapeSpeed,
  orbitType,
} from '../utils/physics';
import { twoSourceIntensity } from '../utils/physicsFormulas';

/**
 * Read the reduced-motion preference live rather than once at module load, so
 * changing it in the OS settings takes effect without a reload.
 */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const list = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(list.matches);
    list.addEventListener('change', sync);
    return () => list.removeEventListener('change', sync);
  }, []);

  return reduced;
}

/** False while the tab is in the background, so nothing animates unseen. */
function useDocumentVisible() {
  const [visible, setVisible] = useState(
    () => (typeof document === 'undefined' ? true : !document.hidden)
  );

  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  return visible;
}

/**
 * Interactive Physics Simulations Suite
 *
 * Five experiments, all built from src/utils/physics.js: a number on the screen
 * is a number the motion uses. Each one answers a question, shows one figure,
 * exposes the variables that question turns on, and prints a readout of what
 * actually happened.
 */

const seconds = (value) => `${value.toFixed(2)} s`;
const metres = (value) => `${value.toFixed(1)} m`;

/** The shell every experiment fills: question, actions, figure, readout, note. */
function Experiment({ number, field, title, question, actions, children, note }) {
  return (
    <article className="exp">
      <header className="exp-head">
        <div className="exp-head-copy">
          <p className="exp-kicker">
            Experiment {number}
            <span className="exp-kicker-sep" aria-hidden="true">/</span>
            {field}
          </p>
          <h2 className="exp-title">{title}</h2>
          <p className="exp-question">{question}</p>
        </div>
        {actions && <div className="exp-actions">{actions}</div>}
      </header>

      {children}

      <p className="exp-note">
        <span className="exp-note-label">What to notice</span>
        {note}
      </p>
    </article>
  );
}

function Param({ id, label, value, display, min, max, step, onChange }) {
  return (
    <div className="exp-param">
      <div className="exp-param-head">
        <label htmlFor={id}>{label}</label>
        <span className="exp-param-value">{display}</span>
      </div>
      <input
        id={id}
        className="exp-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

function Segmented({ label, value, options, onChange }) {
  return (
    <div className="exp-param">
      <div className="exp-param-head">
        <span className="exp-param-label">{label}</span>
      </div>
      <div className="exp-segmented" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`exp-segment ${value === option.id ? 'is-active' : ''}`}
            aria-pressed={value === option.id}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Readout({ items }) {
  return (
    <dl className="exp-readout">
      {items.map((item) => (
        <div className="exp-readout-item" key={item.label}>
          <dt>{item.label}</dt>
          <dd>
            <span className="exp-readout-value">{item.value}</span>
            {item.note ? <span className="exp-readout-note">{item.note}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// ============================================================================
// 1. NEWTON'S SECOND LAW
// ============================================================================
const TRACK_METRES = 24;
const TRACK_PIXELS = 396;
const TRACK_ORIGIN = 32;
const TRACK_GROUND = 104;
const PIXELS_PER_METRE = TRACK_PIXELS / TRACK_METRES;
const CART_WIDTH = 46;
// Leave room for the cart, the longest force arrow and the arrow's label.
const CART_MAX_X = (TRACK_PIXELS - CART_WIDTH - 70) / PIXELS_PER_METRE;

function NewtonSecondLawSim() {
  const [mass, setMass] = useState(10); // kg
  const [force, setForce] = useState(40); // N
  const [frictionEnabled, setFrictionEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [, setFrame] = useState(0);

  const body = useRef({ x: 0, v: 0, t: 0 });
  const animation = useRef(null);

  // One friction value, used by both the arrow and the acceleration.
  const friction = frictionFor(mass, force, frictionEnabled);
  const acceleration = force > 0 ? netAcceleration(force, mass, friction) : 0;

  const reset = () => {
    setIsPlaying(false);
    body.current = { x: 0, v: 0, t: 0 };
    setFrame((frame) => frame + 1);
  };

  useEffect(() => {
    if (!isPlaying) return undefined;
    let last = performance.now();

    const step = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const state = body.current;
      state.v += acceleration * dt;
      state.x = Math.min(CART_MAX_X, state.x + state.v * dt);
      state.t += dt;

      if (state.x >= CART_MAX_X) {
        setIsPlaying(false);
        return;
      }
      setFrame((frame) => frame + 1);
      animation.current = requestAnimationFrame(step);
    };

    animation.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animation.current);
  }, [isPlaying, acceleration]);

  const { x, v, t } = body.current;
  const cartX = TRACK_ORIGIN + x * PIXELS_PER_METRE;
  const cartHeight = 26 + Math.min(22, mass * 0.55);
  const arrowLength = Math.min(84, force * 0.9);
  const frictionLength = Math.min(58, friction * 2.2);

  return (
    <Experiment
      number="01"
      field="Classical mechanics"
      title="Newton's second law"
      question="What does a push actually change?"
      actions={
        <>
          <button
            type="button"
            className="exp-action"
            onClick={() => setIsPlaying((playing) => !playing)}
            aria-pressed={isPlaying}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            {isPlaying ? 'Pause' : 'Push the cart'}
          </button>
          <button type="button" className="exp-action exp-action--quiet" onClick={reset}>
            <RotateCcw size={15} /> Reset
          </button>
        </>
      }
      note={
        <>
          The force arrow is the same length whatever the mass is; the acceleration
          is not. Keep the push at {force} N and raise the mass: the cart gains speed
          more slowly, because the same force now has more inertia to move. Switch
          friction on and watch the arrow that opposes the cart print the same value
          the motion subtracts.
        </>
      }
    >
      <figure className="exp-figure">
        <svg
          className="exp-svg"
          viewBox="0 0 460 138"
          role="img"
          aria-label={`A cart of ${mass} kilograms on a track, pushed with ${force} newtons${frictionEnabled ? `, against ${friction.toFixed(1)} newtons of friction` : ''}.`}
        >
          <line className="fig-axis" x1="24" y1={TRACK_GROUND} x2="444" y2={TRACK_GROUND} />
          {[0, 4, 8, 12, 16, 20, 24].map((metre) => {
            const tickX = TRACK_ORIGIN + metre * PIXELS_PER_METRE;
            return (
              <g key={metre}>
                <line className="fig-tick" x1={tickX} y1={TRACK_GROUND} x2={tickX} y2={TRACK_GROUND + 6} />
                <text className="fig-label" x={tickX} y={TRACK_GROUND + 20} textAnchor="middle">
                  {metre} m
                </text>
              </g>
            );
          })}

          {/* Where the cart started, so distance is visible as distance. */}
          <line
            className="fig-ghost"
            x1={TRACK_ORIGIN}
            y1={TRACK_GROUND - 44}
            x2={TRACK_ORIGIN}
            y2={TRACK_GROUND}
          />

          <g transform={`translate(${cartX}, ${TRACK_GROUND - cartHeight - 2})`}>
            <rect className="fig-solid" x="0" y="0" width={CART_WIDTH} height={cartHeight} rx="2" />
            <text className="fig-label fig-label--inverse" x={CART_WIDTH / 2} y="17" textAnchor="middle">
              {mass} kg
            </text>
            <circle className="fig-wheel" cx="12" cy={cartHeight} r="6" />
            <circle className="fig-wheel" cx={CART_WIDTH - 12} cy={cartHeight} r="6" />
          </g>

          {force > 0 && (
            <g transform={`translate(${cartX + CART_WIDTH}, ${TRACK_GROUND - cartHeight / 2 - 2})`}>
              <line className="fig-vector" x1="0" y1="0" x2={arrowLength} y2="0" />
              <polygon
                className="fig-vector-head"
                points={`${arrowLength + 7},0 ${arrowLength},-4.5 ${arrowLength},4.5`}
              />
              <text className="fig-label fig-label--accent" x={arrowLength / 2 + 12} y="-9" textAnchor="middle">
                F = {force} N
              </text>
            </g>
          )}

          {frictionEnabled && friction > 0 && (
            <g transform={`translate(${cartX}, ${TRACK_GROUND - 12})`}>
              <line className="fig-vector fig-vector--quiet" x1="-2" y1="0" x2={-frictionLength} y2="0" />
              <polygon
                className="fig-vector-head fig-vector-head--quiet"
                points={`${-frictionLength - 7},0 ${-frictionLength},-4 ${-frictionLength},4`}
              />
              <text className="fig-label" x={-frictionLength / 2} y="15" textAnchor="middle">
                f = {friction.toFixed(1)} N
              </text>
            </g>
          )}
        </svg>
        <figcaption className="exp-caption">
          The track is marked in metres. The dashed line is where the cart started.
        </figcaption>
      </figure>

      <div className="exp-params">
        <Param
          id="newton-force"
          label="Applied force"
          value={force}
          display={`${force} N`}
          min={0}
          max={100}
          step={2}
          onChange={setForce}
        />
        <Param
          id="newton-mass"
          label="Inertial mass"
          value={mass}
          display={`${mass} kg`}
          min={2}
          max={40}
          step={1}
          onChange={setMass}
        />
        <Segmented
          label="Track surface"
          value={frictionEnabled ? 'friction' : 'smooth'}
          options={[
            { id: 'smooth', label: 'Smooth' },
            { id: 'friction', label: 'μ = 0.18' },
          ]}
          onChange={(next) => setFrictionEnabled(next === 'friction')}
        />
      </div>

      <Readout
        items={[
          { label: 'Net force', value: `${(force - friction).toFixed(1)} N`, note: `F − f` },
          { label: 'Acceleration', value: `${acceleration.toFixed(2)} m/s²`, note: 'a = F/m' },
          { label: 'Velocity', value: `${v.toFixed(2)} m/s` },
          { label: 'Distance', value: metres(x) },
          { label: 'Time', value: seconds(t) },
        ]}
      />
    </Experiment>
  );
}

// ============================================================================
// 2. PROJECTILE MOTION
// ============================================================================
const PROJECTILE_GROUND = 180;
const PROJECTILE_ORIGIN = 42;
const PROJECTILE_WIDTH = 388;
const PROJECTILE_HEIGHT = 132;

const arcPath = (angle, speed, gravity, scale) => {
  const radians = (angle * Math.PI) / 180;
  const vx = speed * Math.cos(radians);
  const vy = speed * Math.sin(radians);
  const flight = hangTime(speed, angle, gravity);
  const points = [];
  for (let step = 0; step <= 40; step += 1) {
    const time = (flight * step) / 40;
    const x = vx * time;
    const y = vy * time - 0.5 * gravity * time * time;
    points.push(
      `${step === 0 ? 'M' : 'L'} ${PROJECTILE_ORIGIN + x * scale} ${PROJECTILE_GROUND - Math.max(0, y) * scale}`
    );
  }
  return points.join(' ');
};

function ProjectileMotionSim() {
  const [angle, setAngle] = useState(45);
  const [speed, setSpeed] = useState(30);
  const [gravity, setGravity] = useState(9.8);
  const [flightTime, setFlightTime] = useState(null);
  const [launch, setLaunch] = useState(0);
  const [shots, setShots] = useState([]);
  const shot = useRef(null);

  const range = projectileRange(speed, angle, gravity);
  const apex = maxHeight(speed, angle, gravity);
  const flight = hangTime(speed, angle, gravity);
  const horizontalSpeed = speed * Math.cos((angle * Math.PI) / 180);
  const scale =
    range > 0 && apex > 0
      ? Math.min(PROJECTILE_WIDTH / range, PROJECTILE_HEIGHT / apex)
      : 1;

  const fire = () => {
    if (flightTime !== null) return;
    shot.current = { angle, speed, gravity, range, apex, flight, scale };
    setFlightTime(0);
    setLaunch((value) => value + 1);
  };

  const clear = () => {
    setFlightTime(null);
    setShots([]);
  };

  // Animate only the marker; the arc itself is drawn from the same formula, so
  // the ball cannot drift away from its own predicted path.
  useEffect(() => {
    if (!launch) return undefined;
    const current = shot.current;
    const start = performance.now();
    let frameId;

    const step = (now) => {
      const time = (now - start) / 1000;
      if (time >= current.flight) {
        setFlightTime(null);
        setShots((previous) => [...previous.slice(-2), current]);
        return;
      }
      setFlightTime(time);
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [launch]);

  const radians = (angle * Math.PI) / 180;
  const currentX = speed * Math.cos(radians) * (flightTime || 0);
  const currentY =
    speed * Math.sin(radians) * (flightTime || 0) -
    0.5 * gravity * (flightTime || 0) * (flightTime || 0);

  return (
    <Experiment
      number="02"
      field="Kinematics"
      title="Projectile motion"
      question="Where does the arc come from?"
      actions={
        <>
          <button type="button" className="exp-action" onClick={fire}>
            <Target size={15} /> Launch
          </button>
          <button type="button" className="exp-action exp-action--quiet" onClick={clear}>
            <RotateCcw size={15} /> Clear arcs
          </button>
        </>
      }
      note={
        <>
          Gravity pulls down, and nothing pushes sideways, so the horizontal speed
          stays fixed while the vertical speed is spent and returned. Set {angle}°
          and then 90° minus it: on Earth the two land in the same place, but the
          higher one hangs there longer.
        </>
      }
    >
      <figure className="exp-figure">
        <svg
          className="exp-svg"
          viewBox="0 0 460 220"
          role="img"
          aria-label={`A projectile launched at ${angle} degrees and ${speed} metres per second under ${gravity} metres per second squared, landing ${range.toFixed(1)} metres away.`}
        >
          <line className="fig-axis" x1="24" y1={PROJECTILE_GROUND} x2="444" y2={PROJECTILE_GROUND} />

          {/* Previous shots, kept as hairlines for comparison. */}
          {shots.map((previous, index) => (
            <g key={`${previous.angle}-${previous.speed}-${index}`} className="fig-previous">
              <path
                className="fig-ghost-stroke"
                d={arcPath(previous.angle, previous.speed, previous.gravity, previous.scale)}
              />
              <text
                className="fig-label"
                x={PROJECTILE_ORIGIN + previous.range * previous.scale}
                y={PROJECTILE_GROUND - 6}
                textAnchor="end"
              >
                {previous.angle}°
              </text>
            </g>
          ))}

          {/* A 45 degree reference arc at the current speed, so the angle has a
              comparison on screen instead of in a paragraph. */}
          {angle !== 45 && (
            <path
              className="fig-ghost-stroke"
              d={arcPath(45, speed, gravity, scale)}
            />
          )}

          <path className="fig-arc" d={arcPath(angle, speed, gravity, scale)} />

          {/* Apex guide. */}
          <line
            className="fig-ghost"
            x1={PROJECTILE_ORIGIN}
            y1={PROJECTILE_GROUND - apex * scale}
            x2={PROJECTILE_ORIGIN + (range / 2) * scale}
            y2={PROJECTILE_GROUND - apex * scale}
          />
          <text
            className="fig-label"
            x={PROJECTILE_ORIGIN + 4}
            y={PROJECTILE_GROUND - apex * scale - 6}
          >
            apex {apex.toFixed(1)} m
          </text>

          {/* Range marker. */}
          <line
            className="fig-tick fig-tick--accent"
            x1={PROJECTILE_ORIGIN + range * scale}
            y1={PROJECTILE_GROUND - 6}
            x2={PROJECTILE_ORIGIN + range * scale}
            y2={PROJECTILE_GROUND + 6}
          />
          <text
            className="fig-label fig-label--accent"
            x={PROJECTILE_ORIGIN + range * scale}
            y={PROJECTILE_GROUND + 20}
            textAnchor="middle"
          >
            R = {range.toFixed(1)} m
          </text>

          {flightTime !== null && (
            <circle
              className="fig-ball"
              cx={PROJECTILE_ORIGIN + currentX * scale}
              cy={PROJECTILE_GROUND - Math.max(0, currentY) * scale}
              r="5"
            />
          )}

          {/* Launcher. */}
          <g transform={`translate(${PROJECTILE_ORIGIN}, ${PROJECTILE_GROUND})`}>
            <circle className="fig-solid" cx="0" cy="0" r="7" />
            <line
              className="fig-barrel"
              x1="0"
              y1="0"
              x2={22 * Math.cos(radians)}
              y2={-22 * Math.sin(radians)}
            />
          </g>
        </svg>
        <figcaption className="exp-caption">
          {angle === 45
            ? 'The arc is the predicted path; launch to send the marker along it. It is scaled to fit, so the range label is the true distance.'
            : 'The dashed arc is the same launch at 45°. The solid arc is scaled to fit, so the range label is the true distance.'}
        </figcaption>
      </figure>

      <div className="exp-params">
        <Param
          id="projectile-angle"
          label="Launch angle"
          value={angle}
          display={`${angle}°`}
          min={15}
          max={80}
          step={1}
          onChange={setAngle}
        />
        <Param
          id="projectile-speed"
          label="Initial speed"
          value={speed}
          display={`${speed} m/s`}
          min={12}
          max={45}
          step={1}
          onChange={setSpeed}
        />
        <Segmented
          label="Gravity"
          value={String(gravity)}
          options={[
            { id: '9.8', label: 'Earth' },
            { id: '3.7', label: 'Mars' },
            { id: '1.6', label: 'Moon' },
          ]}
          onChange={(next) => setGravity(Number(next))}
        />
      </div>

      <Readout
        items={[
          { label: 'Range', value: metres(range), note: 'R = v² sin 2θ / g' },
          { label: 'Apex', value: metres(apex), note: 'H = (v sin θ)² / 2g' },
          { label: 'Flight time', value: seconds(flight), note: 'T = 2v sin θ / g' },
          { label: 'Horizontal speed', value: `${horizontalSpeed.toFixed(1)} m/s`, note: 'constant' },
        ]}
      />
    </Experiment>
  );
}

// ============================================================================
// 3. GRAVITY AND FREE FALL
// ============================================================================
const BALL_KG = 20;
const FEATHER_KG = 0.005;
const DROP_TOP = 44;
const DROP_FLOOR = 192;
const DROP_PIXELS = DROP_FLOOR - DROP_TOP;

function FreeFallSim() {
  const [environment, setEnvironment] = useState('vacuum');
  const [height, setHeight] = useState(50);
  const [elapsed, setElapsed] = useState(0);
  const [isDropping, setIsDropping] = useState(false);
  const [landed, setLanded] = useState(null);

  const ballTime = predictedFallTime(height);
  const featherTime =
    environment === 'vacuum' ? ballTime : predictedAirborneTime(height);
  const duration = Math.max(ballTime, featherTime);

  const animation = useRef(null);

  const reset = () => {
    if (animation.current) cancelAnimationFrame(animation.current);
    setIsDropping(false);
    setElapsed(0);
    setLanded(null);
  };

  const drop = () => {
    reset();
    setIsDropping(true);
    const start = performance.now();

    const step = (now) => {
      const time = Math.min((now - start) / 1000, duration);
      setElapsed(time);
      if (time >= duration) {
        setLanded({ ball: ballTime, feather: featherTime });
        setIsDropping(false);
        return;
      }
      animation.current = requestAnimationFrame(step);
    };

    animation.current = requestAnimationFrame(step);
  };

  useEffect(() => () => {
    if (animation.current) cancelAnimationFrame(animation.current);
  }, []);

  const ballRatio = Math.min(1, (0.5 * 9.8 * elapsed * elapsed) / height);
  const featherRatio =
    environment === 'vacuum'
      ? ballRatio
      : Math.min(1, (3.2 * elapsed) / height);
  const massRatio = BALL_KG / FEATHER_KG;

  return (
    <Experiment
      number="03"
      field="Equivalence principle"
      title="The vacuum drop"
      question="Does a heavy thing fall faster?"
      actions={
        <>
          <button type="button" className="exp-action" onClick={drop} disabled={isDropping}>
            <ArrowDown size={15} /> Release both
          </button>
          <button type="button" className="exp-action exp-action--quiet" onClick={reset}>
            <RotateCcw size={15} /> Reset drop
          </button>
        </>
      }
      note={
        <>
          Earth pulls on the iron ball with {massRatio.toLocaleString()} times the
          force it puts on the feather. The iron ball also has{' '}
          {massRatio.toLocaleString()} times the inertia to overcome. In a vacuum
          those two facts cancel exactly, so both cross the same {height} m in the
          same time. In air the feather never gets close.
        </>
      }
    >
      <figure className="exp-figure">
        <svg
          className="exp-svg"
          viewBox="0 0 460 224"
          role="img"
          aria-label={`Two objects released together in ${environment === 'vacuum' ? 'a vacuum' : 'air'} from ${height} metres: a ${BALL_KG} kilogram iron ball and a ${FEATHER_KG * 1000} gram feather.`}
        >
          <line className="fig-axis" x1="52" y1={DROP_TOP} x2="416" y2={DROP_TOP} />
          <text className="fig-label" x="52" y={DROP_TOP - 8}>
            release, {height} m
          </text>
          <line className="fig-axis" x1="52" y1={DROP_FLOOR} x2="416" y2={DROP_FLOOR} />
          <text className="fig-label" x="52" y={DROP_FLOOR + 18}>
            ground
          </text>

          {/* Two lanes, so the comparison is spatial rather than verbal. */}
          <line className="fig-ghost" x1="156" y1={DROP_TOP} x2="156" y2={DROP_FLOOR} />
          <line className="fig-ghost" x1="300" y1={DROP_TOP} x2="300" y2={DROP_FLOOR} />

          <g transform={`translate(156, ${DROP_TOP + ballRatio * DROP_PIXELS})`}>
            <circle className="fig-solid" cx="0" cy="0" r="11" />
            <text className="fig-label" x="20" y="4">
              {BALL_KG} kg
            </text>
          </g>

          <g transform={`translate(300, ${DROP_TOP + featherRatio * DROP_PIXELS})`}>
            <path className="fig-feather" d="M 0 -10 C 6 -4, 7 5, 0 11 C -7 5, -6 -4, 0 -10 Z" />
            <line className="fig-feather-rib" x1="0" y1="-10" x2="0" y2="14" />
            <text className="fig-label" x="18" y="4">
              {FEATHER_KG * 1000} g
            </text>
          </g>

          <text className="fig-label fig-label--accent" x="156" y={DROP_FLOOR + 18} textAnchor="middle">
            {landed ? seconds(landed.ball) : '—'}
          </text>
          <text className="fig-label fig-label--accent" x="300" y={DROP_FLOOR + 18} textAnchor="middle">
            {landed ? seconds(landed.feather) : '—'}
          </text>
        </svg>
        <figcaption className="exp-caption">
          Landing times appear under each lane when both objects are down.
        </figcaption>
      </figure>

      <div className="exp-params">
        <Param
          id="drop-height"
          label="Drop height"
          value={height}
          display={`${height} m`}
          min={20}
          max={100}
          step={5}
          onChange={(next) => {
            setHeight(next);
            reset();
          }}
        />
        <Segmented
          label="Chamber"
          value={environment}
          options={[
            { id: 'vacuum', label: 'Vacuum' },
            { id: 'air', label: 'Air' },
          ]}
          onChange={(next) => {
            setEnvironment(next);
            reset();
          }}
        />
      </div>

      <Readout
        items={[
          {
            label: 'Iron ball',
            value: landed ? seconds(landed.ball) : '—',
            note: `t = √(2h/g) = ${seconds(ballTime)}`,
          },
          {
            label: 'Feather',
            value: landed ? seconds(landed.feather) : '—',
            note:
              environment === 'vacuum'
                ? 'same as the ball'
                : `terminal velocity: ${seconds(featherTime)}`,
          },
          {
            label: 'Weight ratio',
            value: `${massRatio.toLocaleString()} ×`,
            note: `${BALL_KG} kg to ${FEATHER_KG * 1000} g`,
          },
          { label: 'Chamber', value: environment === 'vacuum' ? 'Vacuum' : 'Air' },
        ]}
      />
    </Experiment>
  );
}

// ============================================================================
// 4. WAVE INTERFERENCE
// ============================================================================

/** Where the intensity peaks on the screen, in screen pixels from the centre. */
const intensityPeaks = (profile) => {
  const peaks = [];
  for (let index = 1; index < profile.length - 1; index += 1) {
    const point = profile[index];
    if (
      point.intensity > 0.55 &&
      point.intensity > profile[index - 1].intensity &&
      point.intensity >= profile[index + 1].intensity
    ) {
      peaks.push(point);
    }
  }
  return peaks;
};

function WaveInterferenceSim() {
  const canvasRef = useRef(null);
  const [wavelength, setWavelength] = useState(24);
  const [slitSeparation, setSlitSeparation] = useState(70);
  const [frequency, setFrequency] = useState(1.4);
  const prefersReducedMotion = usePrefersReducedMotion();
  const visible = useDocumentVisible();
  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion);

  // The screen is the canvas's right edge: 260 wide, sources at x = 30.
  const screenDistance = 220;
  const profile = useMemo(() => {
    const points = [];
    for (let y = -90; y <= 90; y += 2) {
      const sinTheta = y / Math.hypot(y, screenDistance);
      points.push({ y, intensity: twoSourceIntensity(slitSeparation, wavelength, sinTheta) });
    }
    return points;
  }, [slitSeparation, wavelength]);

  const peaks = intensityPeaks(profile);
  // The central maximum sits at the centre of the screen; the number worth
  // measuring is the distance from there to the first bright fringe, which is
  // what λL/d predicts. Peak-to-peak would be twice that.
  const firstFringe = peaks
    .filter((peak) => Math.abs(peak.y) > 4)
    .sort((a, b) => Math.abs(a.y) - Math.abs(b.y))[0];
  const measuredFringe = firstFringe ? Math.abs(firstFringe.y) : null;
  const predictedFringe = (wavelength * screenDistance) / slitSeparation;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d');
    if (!context) return undefined;

    let frameId;
    let time = 0;
    const width = 260;
    const height = 180;
    canvas.width = width;
    canvas.height = height;

    // Render at half resolution and scale up with smoothing. The old loop
    // painted 2x2 blocks straight into the visible canvas, which is why the
    // tank looked like a mosaic rather than a wave.
    const buffer = document.createElement('canvas');
    buffer.width = width / 2;
    buffer.height = height / 2;
    const bufferContext = buffer.getContext('2d');
    if (!bufferContext) return undefined;
    const image = bufferContext.createImageData(buffer.width, buffer.height);

    // The wave colours come from the theme rather than a fixed rust palette.
    const probe = document.createElement('canvas').getContext('2d');
    if (!probe) return undefined;
    const asRgb = (token, fallback) => {
      const value = getComputedStyle(canvas).getPropertyValue(token).trim() || fallback;
      probe.fillStyle = value;
      probe.fillRect(0, 0, 1, 1);
      const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
      return { r, g, b };
    };
    const paper = asRgb('--bg-elevated', '#FFF9F1');
    const ink = asRgb('--text-primary', '#2C2118');
    const ember = asRgb('--accent-primary', '#B1431A');
    const mix = (from, to, amount) => ({
      r: from.r + (to.r - from.r) * amount,
      g: from.g + (to.g - from.g) * amount,
      b: from.b + (to.b - from.b) * amount,
    });

    const draw = () => {
      const k = (2 * Math.PI) / wavelength;
      const halfWidth = buffer.width;
      const halfHeight = buffer.height;
      const data = image.data;

      for (let y = 0; y < halfHeight; y += 1) {
        for (let x = 0; x < halfWidth; x += 1) {
          const worldX = x * 2;
          const worldY = y * 2;
          const r1 = Math.hypot(worldX - 30, worldY - (height / 2 - slitSeparation / 2));
          const r2 = Math.hypot(worldX - 30, worldY - (height / 2 + slitSeparation / 2));
          const wave1 = Math.sin(k * r1 - time) / Math.max(1, Math.sqrt(r1 * 0.15));
          const wave2 = Math.sin(k * r2 - time) / Math.max(1, Math.sqrt(r2 * 0.15));
          const total = (wave1 + wave2) * 0.5;
          const colour =
            total >= 0 ? mix(paper, ink, Math.min(1, total)) : mix(paper, ember, Math.min(1, -total));

          const offset = (y * halfWidth + x) * 4;
          data[offset] = colour.r;
          data[offset + 1] = colour.g;
          data[offset + 2] = colour.b;
          data[offset + 3] = 255;
        }
      }

      bufferContext.putImageData(image, 0, 0);
      context.imageSmoothingEnabled = true;
      context.drawImage(buffer, 0, 0, width, height);

      // The screen edge the intensity strip is sampled from.
      context.strokeStyle = 'rgba(44, 33, 24, 0.35)';
      context.beginPath();
      context.moveTo(width - 4, 0);
      context.lineTo(width - 4, height);
      context.stroke();

      context.fillStyle = `rgb(${ember.r}, ${ember.g}, ${ember.b})`;
      context.beginPath();
      context.arc(30, height / 2 - slitSeparation / 2, 3, 0, Math.PI * 2);
      context.arc(30, height / 2 + slitSeparation / 2, 3, 0, Math.PI * 2);
      context.fill();
    };

    const loop = () => {
      time += 0.05 * frequency;
      draw();
      frameId = requestAnimationFrame(loop);
    };

    if (isPlaying && visible) {
      frameId = requestAnimationFrame(loop);
    } else {
      draw();
    }

    return () => cancelAnimationFrame(frameId);
  }, [wavelength, slitSeparation, frequency, isPlaying, visible]);

  const stripPoint = (point) => {
    const x = 34 + ((point.y + 90) / 180) * 392;
    const y = 74 - point.intensity * 52;
    return `${x} ${y}`;
  };

  return (
    <Experiment
      number="04"
      field="Wave mechanics"
      title="Two-source interference"
      question="Where do the quiet lanes come from?"
      actions={
        <button
          type="button"
          className="exp-action"
          onClick={() => setIsPlaying((playing) => !playing)}
          aria-pressed={isPlaying}
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      }
      note={
        <>
          A crest from one source arrives where a trough from the other is
          passing, and the two cancel. Those are the pale corridors fanning out
          of the tank. Bring the sources closer and the corridors widen; the
          strip below measures the distance between bright fringes from the same
          formula the water is drawn with.
        </>
      }
    >
      <div className="exp-motion-note-slot">
        {!isPlaying && (
          <p className="exp-motion-note" role="status">
            {prefersReducedMotion
              ? 'Motion is switched off in your system settings, so this is a still frame. Press Play and it will move anyway.'
              : 'Paused. The pattern is drawn from the sliders, so you can change them and read the shape without waiting.'}
          </p>
        )}
      </div>

      <figure className="exp-figure exp-figure--canvas">
        <canvas ref={canvasRef} className="exp-canvas" aria-label="Ripple tank interference pattern" role="img" />
        <svg className="exp-strip" viewBox="0 0 460 96" role="img" aria-label={`Intensity across the screen, with the first bright fringe ${measuredFringe ? `${measuredFringe} pixels from the centre` : 'not resolved on this screen'}.`}>
          <line className="fig-axis" x1="34" y1="74" x2="426" y2="74" />
          <path
            className="fig-profile"
            d={profile.map((point, index) => `${index === 0 ? 'M' : 'L'} ${stripPoint(point)}`).join(' ')}
          />
          {peaks.map((peak) => {
            const [x, y] = stripPoint(peak).split(' ');
            return <circle key={peak.y} className="fig-peak" cx={x} cy={y} r="2.4" />;
          })}
          <text className="fig-label" x="34" y="90">
            top edge
          </text>
          <text className="fig-label" x="230" y="90" textAnchor="middle">
            centre
          </text>
          <text className="fig-label" x="426" y="90" textAnchor="end">
            bottom edge
          </text>
        </svg>
        <figcaption className="exp-caption">
          Ripple tank on top, with the sampled intensity across its far edge
          below. Both are drawn from the two-source superposition.
        </figcaption>
      </figure>

      <div className="exp-params">
        <Param
          id="wave-wavelength"
          label="Wavelength"
          value={wavelength}
          display={`${wavelength} px`}
          min={14}
          max={45}
          step={1}
          onChange={setWavelength}
        />
        <Param
          id="wave-separation"
          label="Slit separation"
          value={slitSeparation}
          display={`${slitSeparation} px`}
          min={30}
          max={120}
          step={2}
          onChange={setSlitSeparation}
        />
        <Param
          id="wave-speed"
          label="Oscillation speed"
          value={frequency}
          display={`${frequency.toFixed(1)}×`}
          min={0.5}
          max={2.5}
          step={0.1}
          onChange={setFrequency}
        />
      </div>

      <Readout
        items={[
          { label: 'Wavelength', value: `${wavelength} px` },
          { label: 'Slit separation', value: `${slitSeparation} px` },
          {
            label: 'First fringe',
            value: measuredFringe ? `${measuredFringe} px` : 'not resolved',
            note: 'measured from the centre of the strip',
          },
          {
            label: 'Predicted fringe',
            value: `${predictedFringe.toFixed(1)} px`,
            note: 'λL/d, L = 220 px',
          },
        ]}
      />
    </Experiment>
  );
}

// ============================================================================
// 5. ORBITAL MECHANICS
// ============================================================================
const ORBIT_GM = 380;
const ORBIT_CENTRE_X = 230;
const ORBIT_CENTRE_Y = 112;
const ORBIT_START_RADIUS = 78;
const ORBIT_ESCAPE_RADIUS = 100;
const ORBIT_CRASH_RADIUS = 16;

const startOrbit = () => ({
  x: 0,
  y: -ORBIT_START_RADIUS,
  vx: circularSpeed(ORBIT_GM, ORBIT_START_RADIUS),
  vy: 0,
});

function OrbitalMechanicsSim() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion);
  const [ended, setEnded] = useState(null);
  const [, setFrame] = useState(0);
  const body = useRef(startOrbit());
  const trail = useRef([]);
  const animation = useRef(null);
  const visible = useDocumentVisible();

  const resetOrbit = () => {
    body.current = startOrbit();
    trail.current = [];
    setEnded(null);
    setIsPlaying(!prefersReducedMotion);
    setFrame((frame) => frame + 1);
  };

  const burn = (factor) => {
    if (ended) return;
    body.current.vx *= factor;
    body.current.vy *= factor;
    setFrame((frame) => frame + 1);
  };

  useEffect(() => {
    if (!isPlaying || !visible) return undefined;
    let last = performance.now();

    const step = (now) => {
      const dt = Math.min(((now - last) / 1000) * 2.6, 0.05);
      last = now;
      const state = body.current;
      const radiusSquared = state.x * state.x + state.y * state.y;
      const radius = Math.sqrt(radiusSquared);

      if (radius < ORBIT_CRASH_RADIUS) {
        setIsPlaying(false);
        setEnded('crash');
        return;
      }
      if (radius > ORBIT_ESCAPE_RADIUS) {
        setIsPlaying(false);
        setEnded('escape');
        return;
      }

      const pull = ORBIT_GM / radiusSquared;
      const ax = -pull * (state.x / radius);
      const ay = -pull * (state.y / radius);
      const vx = state.vx + ax * dt;
      const vy = state.vy + ay * dt;

      state.x += vx * dt;
      state.y += vy * dt;
      state.vx = vx;
      state.vy = vy;

      trail.current.push({ x: state.x, y: state.y });
      if (trail.current.length > 320) trail.current.shift();

      setFrame((frame) => frame + 1);
      animation.current = requestAnimationFrame(step);
    };

    animation.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animation.current);
  }, [isPlaying, visible]);

  const { x, y, vx, vy } = body.current;
  const radius = Math.hypot(x, y);
  const speed = Math.hypot(vx, vy);
  const circular = circularSpeed(ORBIT_GM, radius);
  const escape = escapeSpeed(ORBIT_GM, radius);
  const orbit = orbitType(speed, ORBIT_GM, radius);
  const status = ended === 'escape'
    ? 'Escaped: the path no longer closes'
    : ended === 'crash'
      ? 'Decayed: the path met the surface'
      : orbit === 'circular'
        ? 'Stable, near-circular orbit'
        : orbit === 'elliptical'
          ? 'Elliptical: further out on the far side'
          : 'Decaying: the far side is lower';

  return (
    <Experiment
      number="05"
      field="Astrophysics"
      title="Orbital mechanics"
      question="What keeps a satellite up?"
      actions={
        <>
          <button
            type="button"
            className="exp-action"
            onClick={() => setIsPlaying((playing) => !playing)}
            aria-pressed={isPlaying}
            disabled={Boolean(ended)}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button type="button" className="exp-action" onClick={() => burn(1.15)}>
            <Zap size={15} /> Prograde burn
          </button>
          <button
            type="button"
            className="exp-action exp-action--quiet"
            onClick={() => burn(0.85)}
          >
            Retrograde burn
          </button>
          <button type="button" className="exp-action exp-action--quiet" onClick={resetOrbit}>
            <RotateCcw size={15} /> Reset orbit
          </button>
        </>
      }
      note={
        <>
          The satellite is falling towards the star every second. It is also
          moving sideways fast enough that the surface curves away underneath it
          at the same rate. A prograde burn does not lift it now; it raises the
          far side of the orbit half a revolution later. Two burns are enough to
          cross escape speed, and then the path never comes back.
        </>
      }
    >
      {!isPlaying && !ended && (
        <p className="exp-motion-note" role="status">
          {prefersReducedMotion
            ? 'Motion is switched off in your system settings, so the satellite is parked where you left it. Press Play and it will move anyway.'
            : 'Paused. The burns still work while it is stopped, so you can set up an orbit and then let it run.'}
        </p>
      )}

      <figure className="exp-figure">
        <svg
          className="exp-svg"
          viewBox="0 0 460 224"
          role="img"
          aria-label={`A satellite at ${radius.toFixed(0)} display units from the central mass, moving at ${speed.toFixed(2)} display units per second. ${status}.`}
        >
          <circle className="fig-ghost" cx={ORBIT_CENTRE_X} cy={ORBIT_CENTRE_Y} r={ORBIT_START_RADIUS} />
          <circle className="fig-ghost" cx={ORBIT_CENTRE_X} cy={ORBIT_CENTRE_Y} r={ORBIT_ESCAPE_RADIUS} />

          <circle className="fig-world" cx={ORBIT_CENTRE_X} cy={ORBIT_CENTRE_Y} r="13" />
          <text className="fig-label fig-label--inverse" x={ORBIT_CENTRE_X} y={ORBIT_CENTRE_Y + 4} textAnchor="middle">
            M
          </text>

          {trail.current.length > 1 && (
            <path
              className="fig-orbit"
              d={trail.current
                .map((point, index) => `${index === 0 ? 'M' : 'L'} ${ORBIT_CENTRE_X + point.x} ${ORBIT_CENTRE_Y + point.y}`)
                .join(' ')}
            />
          )}

          <g transform={`translate(${ORBIT_CENTRE_X + x}, ${ORBIT_CENTRE_Y + y})`}>
            <circle className="fig-satellite" cx="0" cy="0" r="4" />
            <line className="fig-vector fig-vector--quiet" x1="0" y1="0" x2={vx * 9} y2={vy * 9} />
          </g>

          {ended === 'escape' && (
            <text className="fig-label fig-label--accent" x={ORBIT_CENTRE_X} y="18" textAnchor="middle">
              escape velocity reached
            </text>
          )}
          {ended === 'crash' && (
            <text className="fig-label fig-label--accent" x={ORBIT_CENTRE_X} y="18" textAnchor="middle">
              surface impact
            </text>
          )}
          <text className="fig-label" x={ORBIT_CENTRE_X} y="216" textAnchor="middle">
            dashed circles: starting orbit and escape boundary
          </text>
        </svg>
        <figcaption className="exp-caption">
          Distances are display units, not metres. The arrow is the velocity
          vector, drawn to scale with itself.
        </figcaption>
      </figure>

      <Readout
        items={[
          { label: 'Radius', value: `${radius.toFixed(1)} u` },
          { label: 'Speed', value: `${speed.toFixed(2)} u/s` },
          { label: 'Circular speed here', value: `${circular.toFixed(2)} u/s` },
          { label: 'Escape speed here', value: `${escape.toFixed(2)} u/s` },
          { label: 'Speed / circular', value: `${(speed / circular).toFixed(2)} ×` },
        ]}
      />

      <p className="exp-status" aria-live="polite">{status}</p>
    </Experiment>
  );
}

// ============================================================================
// THE SCREEN
// ============================================================================
export const PHYSICS_SIMULATIONS = [
  {
    id: 'newton',
    label: 'Newton\u2019s 2nd Law (F=ma)',
    short: 'Newton\u2019s second law',
    field: 'Classical mechanics',
    question: 'What does a push actually change?',
    icon: Zap,
  },
  {
    id: 'projectile',
    label: 'Projectile Motion',
    short: 'Projectile motion',
    field: 'Kinematics',
    question: 'Where does the arc come from?',
    icon: Target,
  },
  {
    id: 'freefall',
    label: 'Vacuum vs Air Drop',
    short: 'The vacuum drop',
    field: 'Equivalence principle',
    question: 'Does a heavy thing fall faster?',
    icon: ArrowDown,
  },
  {
    id: 'waves',
    label: 'Wave Interference',
    short: 'Two-source interference',
    field: 'Wave mechanics',
    question: 'Where do the quiet lanes come from?',
    icon: Waves,
  },
  {
    id: 'orbit',
    label: 'Orbital Mechanics',
    short: 'Orbital mechanics',
    field: 'Astrophysics',
    question: 'What keeps a satellite up?',
    icon: Orbit,
  },
];

const SIMULATION_COMPONENTS = {
  newton: NewtonSecondLawSim,
  projectile: ProjectileMotionSim,
  freefall: FreeFallSim,
  waves: WaveInterferenceSim,
  orbit: OrbitalMechanicsSim,
};

PhysicsSimulations.propTypes = {
  defaultSim: PropTypes.string,
  onBack: PropTypes.func,
  backLabel: PropTypes.string,
};

export default function PhysicsSimulations({
  defaultSim = 'newton',
  onBack,
  backLabel = 'Back',
}) {
  const [activeTab, setActiveTab] = useState(defaultSim);
  const tabs = PHYSICS_SIMULATIONS;
  const active = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const ActiveSimulation = SIMULATION_COMPONENTS[active.id];

  const moveTab = (event) => {
    const index = tabs.findIndex((tab) => tab.id === active.id);
    const moves = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = tabs[(moves[event.key] + tabs.length) % tabs.length];
    setActiveTab(next.id);
    const node = document.getElementById(`lab-tab-${next.id}`);
    if (node) node.focus();
  };

  return (
    <div className="physics-lab">
      <header className="lab-masthead">
        <div className="lab-masthead-copy">
          <p className="lab-kicker">Physics laboratory</p>
          <h1 className="lab-title">Five experiments you can disturb.</h1>
          <p className="lab-intro">
            Change one number and watch what the equation does with it. Every
            figure is drawn from the same formula that prints the readout.
          </p>
        </div>
        {onBack && (
          <button type="button" className="lab-back" onClick={onBack}>
            ← {backLabel}
          </button>
        )}
      </header>

      <div className="lab-layout">
        <div
          className="lab-index"
          role="tablist"
          aria-label="Experiments"
          aria-orientation="vertical"
          onKeyDown={moveTab}
        >
          <p className="lab-index-label">Experiments</p>
          <ol className="lab-index-list">
            {tabs.map((tab, index) => {
              const selected = tab.id === active.id;
              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    role="tab"
                    id={`lab-tab-${tab.id}`}
                    aria-selected={selected}
                    aria-controls="lab-panel"
                    tabIndex={selected ? 0 : -1}
                    className={`lab-index-item ${selected ? 'is-active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="lab-index-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="lab-index-copy">
                      <span className="lab-index-name">{tab.short}</span>
                      <span className="lab-index-meta">{tab.field}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div
          className="lab-panel"
          id="lab-panel"
          role="tabpanel"
          aria-labelledby={`lab-tab-${active.id}`}
          tabIndex={-1}
        >
          <ActiveSimulation />
        </div>
      </div>
    </div>
  );
}
