import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Target,
  Orbit,
  Waves,
  ArrowDown,
  Info
} from 'lucide-react';
import '../styles/PhysicsSimulations.css';

/**
 * Read the reduced-motion preference live rather than once at module load, so
 * changing it in the OS settings takes effect without a reload.
 */
function usePrefersReducedMotion() {
  // Read it during the first render, not in an effect. Anything that seeds
  // state from this value (isPlaying) would otherwise see false on the first
  // pass and start the animation for the people who asked it not to.
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
 * Lightweight, 60fps canvas & SVG-based interactives built for genuine understanding:
 * 1. Newton's Second Law (F = ma, friction, inertia)
 * 2. Projectile Motion (angles, ballistic arcs, vector decomposition)
 * 3. Gravity & Free Fall (Galileo's vacuum drop vs atmospheric drag)
 * 4. Wave Interference (coherent two-source ripple tank & nodal cancelation)
 * 5. Orbital Mechanics (Keplerian orbits, prograde/retrograde burns, escape velocity)
 */

// ============================================================================
// SIMULATION 1: NEWTON'S SECOND LAW (F = ma)
// ============================================================================
function NewtonSecondLawSim() {
  const [mass, setMass] = useState(10); // kg
  const [force, setForce] = useState(40); // N
  const [frictionEnabled, setFrictionEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cartX, setCartX] = useState(40); // px
  const [velocity, setVelocity] = useState(0); // m/s
  const [acceleration, setAcceleration] = useState(4); // m/s^2
  const [elapsedTime, setElapsedTime] = useState(0); // s

  const animRef = useRef(null);
  const lastTimeRef = useRef(null);
  const trackWidth = 580; // px
  const scale = 20; // 20 px = 1 meter

  // Friction coefficient
  const mu = frictionEnabled ? 0.18 : 0;
  const normalForce = mass * 9.8;
  const frictionForce = mu * normalForce;
  const currentAcc = mass > 0 ? (force > 0 ? (force - (frictionEnabled ? Math.min(force, frictionForce) : 0)) / mass : 0) : 0;

  useEffect(() => {
    setAcceleration(currentAcc);
  }, [mass, force, frictionEnabled, currentAcc]);

  const reset = () => {
    setIsPlaying(false);
    setCartX(40);
    setVelocity(0);
    setElapsedTime(0);
    lastTimeRef.current = null;
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const step = (now) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05); // max 50ms step
      lastTimeRef.current = now;

      setElapsedTime((prev) => prev + dt);

      setVelocity((v) => {
        const nextV = v + currentAcc * dt;
        setCartX((x) => {
          const nextX = x + nextV * scale * dt;
          if (nextX >= trackWidth - 60) {
            setIsPlaying(false);
            return trackWidth - 60;
          }
          return nextX;
        });
        return nextV;
      });

      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, currentAcc]);

  return (
    <div className="sim-card">
      <div className="sim-header-row">
        <div>
          <span className="sim-tag">Classical Mechanics</span>
          <h3 className="sim-title">Newton’s Second Law: Acceleration on a Track</h3>
        </div>
        <div className="sim-controls-top">
          <button
            type="button"
            className={`sim-btn ${isPlaying ? 'sim-btn-pause' : 'sim-btn-play'}`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            <span>{isPlaying ? 'Pause' : 'Apply Push'}</span>
          </button>
          <button type="button" className="sim-btn sim-btn-ghost" onClick={reset}>
            <RotateCcw size={15} /> Reset
          </button>
        </div>
      </div>

      <div className="sim-interactive-stage">
        <svg className="sim-svg" viewBox="0 0 620 180" preserveAspectRatio="xMidYMid meet">
          {/* Track base */}
          <rect x="20" y="130" width="580" height="14" fill="#6E5846" rx="3" opacity="0.4" />
          <line x1="20" y1="130" x2="600" y2="130" stroke="#3E2718" strokeWidth="2" opacity="0.6" />

          {/* Distance Hash Marks every 50px (2.5 meters) */}
          {[...Array(12)].map((_, i) => {
            const x = 40 + i * 50;
            return (
              <g key={i}>
                <line x1={x} y1="130" x2={x} y2="140" stroke="#3E2718" strokeWidth="1" opacity="0.5" />
                <text x={x} y="155" fontSize="10" fill="#6E5846" textAnchor="middle" fontFamily="sans-serif">
                  {(i * 2.5).toFixed(1)}m
                </text>
              </g>
            );
          })}

          {/* Force Vector Arrow (applied to cart) */}
          {force > 0 && (
            <g transform={`translate(${cartX + 35}, 85)`}>
              <line
                x1="0"
                y1="0"
                x2={Math.min(100, force * 1.2)}
                y2="0"
                stroke="#8C4A2F"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <polygon
                points={`${Math.min(100, force * 1.2) + 6},0 ${Math.min(100, force * 1.2)},-5 ${Math.min(100, force * 1.2)},5`}
                fill="#8C4A2F"
              />
              <text x={Math.min(100, force * 1.2) / 2} y="-8" fontSize="11" fill="#8C4A2F" fontWeight="bold" textAnchor="middle">
                F = {force}N
              </text>
            </g>
          )}

          {/* Friction Vector (opposing) */}
          {frictionEnabled && velocity > 0 && (
            <g transform={`translate(${cartX - 5}, 115)`}>
              <line x1="0" y1="0" x2="-30" y2="0" stroke="#A33B32" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="-36,0 -30,-4 -30,4" fill="#A33B32" />
              <text x="-15" y="-6" fontSize="9" fill="#A33B32" textAnchor="middle">
                f = {frictionForce.toFixed(1)}N
              </text>
            </g>
          )}

          {/* Cart / Rolling Mass */}
          <g transform={`translate(${cartX}, 80)`}>
            {/* Cart Body sized with mass */}
            <rect
              x="0"
              y="0"
              width="50"
              height={32 + Math.min(20, mass * 0.4)}
              rx="6"
              fill="#2C2118"
              stroke="#FFF9F1"
              strokeWidth="1.5"
            />
            {/* Mass label */}
            <text x="25" y="24" fontSize="12" fill="#FFF9F1" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
              {mass} kg
            </text>

            {/* Wheels */}
            <circle cx="12" cy={34 + Math.min(20, mass * 0.4)} r="7" fill="#6E5846" stroke="#2C2118" strokeWidth="1.5" />
            <circle cx="38" cy={34 + Math.min(20, mass * 0.4)} r="7" fill="#6E5846" stroke="#2C2118" strokeWidth="1.5" />
            <circle cx="12" cy={34 + Math.min(20, mass * 0.4)} r="2" fill="#FFF9F1" />
            <circle cx="38" cy={34 + Math.min(20, mass * 0.4)} r="2" fill="#FFF9F1" />
          </g>
        </svg>

        {/* Live Telemetry Panel */}
        <div className="sim-telemetry-strip">
          <div className="sim-telemetry-item">
            <span className="telemetry-label">Net Acceleration (a = F/m)</span>
            <span className="telemetry-val highlight">{acceleration.toFixed(2)} m/s²</span>
          </div>
          <div className="sim-telemetry-item">
            <span className="telemetry-label">Velocity (v)</span>
            <span className="telemetry-val">{velocity.toFixed(2)} m/s</span>
          </div>
          <div className="sim-telemetry-item">
            <span className="telemetry-label">Distance Traveled</span>
            <span className="telemetry-val">{((cartX - 40) / scale).toFixed(2)} m</span>
          </div>
          <div className="sim-telemetry-item">
            <span className="telemetry-label">Timer</span>
            <span className="telemetry-val">{elapsedTime.toFixed(2)} s</span>
          </div>
        </div>
      </div>

      {/* Sliders & Controls */}
      <div className="sim-params-grid">
        <div className="sim-slider-group">
          <div className="sim-slider-label-row">
            <span>Applied Force (F)</span>
            <strong>{force} Newtons</strong>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="2"
            value={force}
            onChange={(e) => setForce(Number(e.target.value))}
            className="sim-range"
            aria-label="Applied force slider"
          />
        </div>

        <div className="sim-slider-group">
          <div className="sim-slider-label-row">
            <span>Inertial Mass (m)</span>
            <strong>{mass} kg</strong>
          </div>
          <input
            type="range"
            min="2"
            max="40"
            step="1"
            value={mass}
            onChange={(e) => setMass(Number(e.target.value))}
            className="sim-range"
            aria-label="Inertial mass slider"
          />
        </div>

        <div className="sim-toggle-group">
          <label className="sim-checkbox-label">
            <input
              type="checkbox"
              checked={frictionEnabled}
              onChange={(e) => setFrictionEnabled(e.target.checked)}
            />
            <span>Include track friction (μ = 0.18)</span>
          </label>
        </div>
      </div>

      {/* Human Observation Note */}
      <div className="sim-explanation-box">
        <Info size={18} className="sim-info-icon" />
        <p>
          <strong>What to notice:</strong> Notice what happens when you double the mass: the force arrow stays the exact same length, but the ball acts heavy and stubborn—its speed barely inches upward. To get that 40 kg mass moving as briskly as the 4 kg one, you have to push ten times harder. The equation <em>F = ma</em> isn't abstract math; it's simply a description of inertia in action.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// SIMULATION 2: PROJECTILE MOTION (Parabolic Ballistics)
// ============================================================================
function ProjectileMotionSim() {
  const [angle, setAngle] = useState(45); // degrees
  const [velocity, setVelocity] = useState(30); // m/s
  const [gravity, setGravity] = useState(9.8); // m/s^2 (Earth)
  const [trails, setTrails] = useState([]);
  const [activeShot, setActiveShot] = useState(null);
  const animRef = useRef(null);

  const rad = (angle * Math.PI) / 180;
  const theoreticalMaxH = (Math.pow(velocity * Math.sin(rad), 2)) / (2 * gravity);
  const theoreticalHangTime = (2 * velocity * Math.sin(rad)) / gravity;
  const theoreticalRange = (Math.pow(velocity, 2) * Math.sin(2 * rad)) / gravity;

  const fire = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const startT = performance.now();
    const v0x = velocity * Math.cos(rad);
    const v0y = velocity * Math.sin(rad);

    const currentPoints = [];

    const step = (now) => {
      const t = (now - startT) / 1000 * 1.2; // simulation time
      const x = v0x * t;
      const y = v0y * t - 0.5 * gravity * t * t;

      if (y < 0 && t > 0.05) {
        // Impact
        const finalPoint = { x: theoreticalRange, y: 0 };
        currentPoints.push(finalPoint);
        setTrails((prev) => [...prev.slice(-4), { points: currentPoints, angle, velocity, range: theoreticalRange }]);
        setActiveShot(null);
        return;
      }

      currentPoints.push({ x, y });
      setActiveShot({ x, y, vx: v0x, vy: v0y - gravity * t, t });
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
  };

  const clearTrails = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setActiveShot(null);
    setTrails([]);
  };

  // Convert meters to canvas coords (Origin at x: 30, y: 160)
  const originX = 30;
  const originY = 160;
  const mToPx = 5.2; // 5.2 px per meter

  return (
    <div className="sim-card">
      <div className="sim-header-row">
        <div>
          <span className="sim-tag">Kinematics & Gravity</span>
          <h3 className="sim-title">Projectile Motion: Ballistics and Parabolic Arcs</h3>
        </div>
        <div className="sim-controls-top">
          <button type="button" className="sim-btn sim-btn-play" onClick={fire}>
            <Target size={15} /> Launch Projectile
          </button>
          <button type="button" className="sim-btn sim-btn-ghost" onClick={clearTrails}>
            <RotateCcw size={15} /> Clear Arcs
          </button>
        </div>
      </div>

      <div className="sim-interactive-stage">
        <svg className="sim-svg" viewBox="0 0 620 200" preserveAspectRatio="xMidYMid meet">
          {/* Ground */}
          <line x1="10" y1={originY} x2="610" y2={originY} stroke="#3E2718" strokeWidth="2" opacity="0.6" />
          <rect x="10" y={originY} width="600" height="30" fill="#6E5846" opacity="0.25" />

          {/* Distance Hashmarks */}
          {[...Array(6)].map((_, i) => {
            const distM = i * 20;
            const px = originX + distM * mToPx;
            return (
              <g key={i}>
                <line x1={px} y1={originY} x2={px} y2={originY + 6} stroke="#3E2718" strokeWidth="1" opacity="0.4" />
                <text x={px} y={originY + 18} fontSize="9" fill="#6E5846" textAnchor="middle" fontFamily="sans-serif">
                  {distM}m
                </text>
              </g>
            );
          })}

          {/* Previous Arc Trails (ghosts) */}
          {trails.map((tr, idx) => {
            const pathData = tr.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${originX + p.x * mToPx} ${originY - p.y * mToPx}`).join(' ');
            return (
              <g key={idx} opacity={0.35 + idx * 0.15}>
                <path d={pathData} fill="none" stroke="#6E5846" strokeWidth="1.5" strokeDasharray="4 3" />
                <circle cx={originX + tr.range * mToPx} cy={originY} r="3" fill="#6E5846" />
                <text x={originX + tr.range * mToPx} y={originY - 8} fontSize="8" fill="#6E5846" textAnchor="middle">
                  {tr.range.toFixed(1)}m ({tr.angle}°)
                </text>
              </g>
            );
          })}

          {/* Active Flight Path */}
          {activeShot && (
            <g>
              <circle cx={originX + activeShot.x * mToPx} cy={originY - activeShot.y * mToPx} r="6" fill="#8C4A2F" stroke="#FFF9F1" strokeWidth="1.5" />
              {/* Velocity vector breakdown */}
              <line
                x1={originX + activeShot.x * mToPx}
                y1={originY - activeShot.y * mToPx}
                x2={originX + activeShot.x * mToPx + activeShot.vx * 0.6}
                y2={originY - activeShot.y * mToPx - activeShot.vy * 0.6}
                stroke="#3F6B4A"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Launcher / Cannon at origin */}
          <g transform={`translate(${originX}, ${originY})`}>
            <circle cx="0" cy="0" r="10" fill="#2C2118" />
            <line
              x1="0"
              y1="0"
              x2={24 * Math.cos(rad)}
              y2={-24 * Math.sin(rad)}
              stroke="#2C2118"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* Telemetry Strip */}
        <div className="sim-telemetry-strip">
          <div className="sim-telemetry-item">
            <span className="telemetry-label">Calculated Range (R)</span>
            <span className="telemetry-val highlight">{theoreticalRange.toFixed(1)} meters</span>
          </div>
          <div className="sim-telemetry-item">
            <span className="telemetry-label">Peak Altitude (H)</span>
            <span className="telemetry-val">{theoreticalMaxH.toFixed(1)} meters</span>
          </div>
          <div className="sim-telemetry-item">
            <span className="telemetry-label">Flight Duration (T)</span>
            <span className="telemetry-val">{theoreticalHangTime.toFixed(2)} seconds</span>
          </div>
          <div className="sim-telemetry-item">
            <span className="telemetry-label">Horizontal Speed (v_x)</span>
            <span className="telemetry-val">{(velocity * Math.cos(rad)).toFixed(1)} m/s (constant)</span>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="sim-params-grid">
        <div className="sim-slider-group">
          <div className="sim-slider-label-row">
            <span>Launch Angle (θ)</span>
            <strong>{angle}°</strong>
          </div>
          <input
            type="range"
            min="15"
            max="80"
            step="1"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="sim-range"
            aria-label="Launch angle slider"
          />
        </div>

        <div className="sim-slider-group">
          <div className="sim-slider-label-row">
            <span>Initial Velocity (v₀)</span>
            <strong>{velocity} m/s</strong>
          </div>
          <input
            type="range"
            min="12"
            max="45"
            step="1"
            value={velocity}
            onChange={(e) => setVelocity(Number(e.target.value))}
            className="sim-range"
            aria-label="Initial velocity slider"
          />
        </div>

        <div className="sim-slider-group">
          <div className="sim-slider-label-row">
            <span>Gravitational Environment</span>
            <strong>{gravity === 9.8 ? 'Earth (9.8 m/s²)' : gravity === 1.6 ? 'Moon (1.6 m/s²)' : 'Mars (3.7 m/s²)'}</strong>
          </div>
          <div className="sim-btn-pill-row">
            <button
              type="button"
              className={`pill-btn ${gravity === 9.8 ? 'active' : ''}`}
              onClick={() => setGravity(9.8)}
            >
              Earth
            </button>
            <button
              type="button"
              className={`pill-btn ${gravity === 3.7 ? 'active' : ''}`}
              onClick={() => setGravity(3.7)}
            >
              Mars
            </button>
            <button
              type="button"
              className={`pill-btn ${gravity === 1.6 ? 'active' : ''}`}
              onClick={() => setGravity(1.6)}
            >
              Moon
            </button>
          </div>
        </div>
      </div>

      <div className="sim-explanation-box">
        <Info size={18} className="sim-info-icon" />
        <p>
          <strong>What to notice:</strong> Try setting the angle to 45 degrees, then try 30 and 60. Notice how 30° and 60° land in almost the exact same spot, but 60° spends twice as long hanging in the clouds? The horizontal speed is steady the whole way across because nothing in pure gravity pushes sideways; only the vertical speed gets stolen and handed back by gravity.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// SIMULATION 3: GRAVITY & FREE FALL (Galileo's Vacuum Chamber)
// ============================================================================
function FreeFallSim() {
  const [environment, setEnvironment] = useState('vacuum'); // 'vacuum' | 'air'
  const [height, setHeight] = useState(50); // meters
  const [isDropping, setIsDropping] = useState(false);
  const [timePassed, setTimePassed] = useState(0);
  const [cannonPos, setCannonPos] = useState(0); // 0 to 1 ratio
  const [featherPos, setFeatherPos] = useState(0); // 0 to 1 ratio
  const [landedTimes, setLandedTimes] = useState(null);

  const animRef = useRef(null);

  const drop = () => {
    setIsDropping(true);
    setCannonPos(0);
    setFeatherPos(0);
    setTimePassed(0);
    setLandedTimes(null);

    const startT = performance.now();
    let cannonLanded = false;
    let featherLanded = false;
    let tCannon = null;
    let tFeather = null;

    const g = 9.8;
    // Vacuum time: t = sqrt(2h/g)
    const tVac = Math.sqrt((2 * height) / g);
    // In air, feather reaches low terminal velocity (~2 m/s), cannonball barely affected
    const tFeatherAir = height / 3.2;

    const step = (now) => {
      const t = (now - startT) / 1000;
      setTimePassed(t);

      // Cannonball position
      if (!cannonLanded) {
        const y = 0.5 * g * t * t;
        const ratio = Math.min(1, y / height);
        setCannonPos(ratio);
        if (ratio >= 1) {
          cannonLanded = true;
          tCannon = t;
        }
      }

      // Feather position
      if (!featherLanded) {
        const ratio = environment === 'vacuum'
          ? Math.min(1, (0.5 * g * t * t) / height)
          : Math.min(1, (3.2 * t) / height);
        setFeatherPos(ratio);
        if (ratio >= 1) {
          featherLanded = true;
          tFeather = t;
        }
      }

      if (cannonLanded && featherLanded) {
        setIsDropping(false);
        setLandedTimes({
          cannon: tCannon.toFixed(3),
          feather: tFeather.toFixed(3),
        });
        return;
      }

      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
  };

  const reset = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setIsDropping(false);
    setCannonPos(0);
    setFeatherPos(0);
    setTimePassed(0);
    setLandedTimes(null);
  };

  const dropHeightPx = 130;

  return (
    <div className="sim-card">
      <div className="sim-header-row">
        <div>
          <span className="sim-tag">Equivalence Principle</span>
          <h3 className="sim-title">Gravity & Free Fall: The Vacuum Chamber Drop</h3>
        </div>
        <div className="sim-controls-top">
          <button
            type="button"
            className="sim-btn sim-btn-play"
            onClick={drop}
            disabled={isDropping}
          >
            <ArrowDown size={15} /> Release Objects
          </button>
          <button type="button" className="sim-btn sim-btn-ghost" onClick={reset}>
            <RotateCcw size={15} /> Reset Drop
          </button>
        </div>
      </div>

      <div className="sim-interactive-stage">
        <svg className="sim-svg" viewBox="0 0 620 220" preserveAspectRatio="xMidYMid meet">
          {/* Tower / Drop Platform */}
          <rect x="30" y="30" width="160" height="15" fill="#3E2718" rx="2" opacity="0.6" />
          <text x="110" y="24" fontSize="11" fill="#6E5846" textAnchor="middle" fontWeight="bold">
            Release Platform ({height}m)
          </text>

          {/* Chamber Outline */}
          <rect x="220" y="20" width="370" height="175" rx="10" fill={environment === 'vacuum' ? '#1B2230' : '#EFE4D6'} stroke="#3E2718" strokeWidth="1.5" />
          <text x="405" y="42" fontSize="12" fill={environment === 'vacuum' ? '#F6EFE4' : '#2C2118'} textAnchor="middle" fontWeight="600">
            {environment === 'vacuum' ? 'Evacuated Glass Vacuum Chamber (0 Air Molecules)' : 'Standard Air-Filled Chamber (1 Atm Pressure)'}
          </text>

          {/* Ground */}
          <line x1="220" y1="185" x2="590" y2="185" stroke="#3E2718" strokeWidth="3" />

          {/* Left lane: Heavy Cannonball (20 kg) */}
          <g transform={`translate(310, ${55 + cannonPos * dropHeightPx})`}>
            <circle cx="0" cy="0" r="14" fill="#2C2118" stroke="#FFF9F1" strokeWidth="1.5" />
            <text x="0" y="4" fontSize="9" fill="#FFF9F1" textAnchor="middle" fontWeight="bold">
              20kg
            </text>
          </g>
          <text x="310" y="175" fontSize="10" fill={environment === 'vacuum' ? '#A5B4FC' : '#6E5846'} textAnchor="middle">
            Heavy Iron Ball
          </text>

          {/* Right lane: Falcon Feather (0.005 kg) */}
          <g transform={`translate(480, ${55 + featherPos * dropHeightPx})`}>
            {/* Feather glyph */}
            <path
              d="M 0 -12 C 6 -6, 8 6, 0 14 C -8 6, -6 -6, 0 -12 Z"
              fill="#A56A2A"
              stroke="#FFF9F1"
              strokeWidth="1"
            />
            <line x1="0" y1="-12" x2="0" y2="18" stroke="#FFF9F1" strokeWidth="1.2" />
          </g>
          <text x="480" y="175" fontSize="10" fill={environment === 'vacuum' ? '#A5B4FC' : '#6E5846'} textAnchor="middle">
            Falcon Feather (5g)
          </text>
        </svg>

        <div className="sim-telemetry-strip">
          <div className="sim-telemetry-item">
            <span className="telemetry-label">Chamber State</span>
            <span className="telemetry-val highlight">{environment === 'vacuum' ? '100% Pure Vacuum' : 'Normal Atmospheric Air'}</span>
          </div>
          <div className="sim-telemetry-item">
            <span className="telemetry-label">Iron Ball Fall Time</span>
            <span className="telemetry-val">{landedTimes ? `${landedTimes.cannon}s` : `${timePassed.toFixed(2)}s`}</span>
          </div>
          <div className="sim-telemetry-item">
            <span className="telemetry-label">Feather Fall Time</span>
            <span className="telemetry-val">{landedTimes ? `${landedTimes.feather}s` : (environment === 'air' ? 'Floating...' : `${timePassed.toFixed(2)}s`)}</span>
          </div>
        </div>
      </div>

      <div className="sim-params-grid">
        <div className="sim-slider-group">
          <div className="sim-slider-label-row">
            <span>Drop Height</span>
            <strong>{height} meters</strong>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="sim-range"
            aria-label="Drop height slider"
          />
        </div>

        <div className="sim-slider-group">
          <div className="sim-slider-label-row">
            <span>Atmospheric Chamber</span>
            <strong>{environment === 'vacuum' ? 'Zero Drag (Vacuum)' : 'Air Friction'}</strong>
          </div>
          <div className="sim-btn-pill-row">
            <button
              type="button"
              className={`pill-btn ${environment === 'vacuum' ? 'active' : ''}`}
              onClick={() => { setEnvironment('vacuum'); reset(); }}
            >
              Vacuum Chamber
            </button>
            <button
              type="button"
              className={`pill-btn ${environment === 'air' ? 'active' : ''}`}
              onClick={() => { setEnvironment('air'); reset(); }}
            >
              Earth Air
            </button>
          </div>
        </div>
      </div>

      <div className="sim-explanation-box">
        <Info size={18} className="sim-info-icon" />
        <p>
          <strong>What to notice:</strong> Switch to 'Vacuum Chamber' and release both together. They hit the stone pavement at the exact same millisecond. Earth pulls four hundred times harder on the iron ball, but the iron ball is also four hundred times harder to accelerate because of its inertia. The two effects cancel out with surgical precision.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// SIMULATION 4: WAVE INTERFERENCE (Two-Source Ripple Tank)
// ============================================================================
function WaveInterferenceSim() {
  const canvasRef = useRef(null);
  const [wavelength, setWavelength] = useState(24); // px
  const [slitSeparation, setSlitSeparation] = useState(70); // px
  const [frequency, setFrequency] = useState(1.4); // speed factor
  const prefersReducedMotion = usePrefersReducedMotion();
  const visible = useDocumentVisible();
  // Someone who has asked for less motion gets a still frame and a play button,
  // not a faster animation.
  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const width = 360;
    const height = 180;
    canvas.width = width;
    canvas.height = height;

    // Offscreen image buffer for fast pixel rendering
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    const draw = () => {
      const k = (2 * Math.PI) / wavelength;
      const s1x = 40;
      const s1y = height / 2 - slitSeparation / 2;
      const s2x = 40;
      const s2y = height / 2 + slitSeparation / 2;

      // Downsampled render step for fast performance on mobile
      const step = 2;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const r1 = Math.sqrt((x - s1x) * (x - s1x) + (y - s1y) * (y - s1y));
          const r2 = Math.sqrt((x - s2x) * (x - s2x) + (y - s2y) * (y - s2y));

          // Superposition of two coherent harmonic waves
          const wave1 = Math.sin(k * r1 - t) / Math.max(1, Math.sqrt(r1 * 0.15));
          const wave2 = Math.sin(k * r2 - t) / Math.max(1, Math.sqrt(r2 * 0.15));
          const total = (wave1 + wave2) * 0.5; // range roughly -1 to 1

          // Warm editorial color mapping: 0 = neutral cream, +1 = deep espresso, -1 = terracotta
          const r = total > 0 ? 44 + (1 - total) * 190 : 140 + total * 80;
          const g = total > 0 ? 33 + (1 - total) * 190 : 74 + total * 40;
          const b = total > 0 ? 24 + (1 - total) * 190 : 47 + total * 20;

          for (let dy = 0; dy < step && y + dy < height; dy++) {
            for (let dx = 0; dx < step && x + dx < width; dx++) {
              const idx = ((y + dy) * width + (x + dx)) * 4;
              data[idx] = r;
              data[idx + 1] = g;
              data[idx + 2] = b;
              data[idx + 3] = 255;
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Draw Slits / Sources
      ctx.fillStyle = '#8C4A2F';
      ctx.beginPath();
      ctx.arc(s1x, s1y, 4, 0, Math.PI * 2);
      ctx.arc(s2x, s2y, 4, 0, Math.PI * 2);
      ctx.fill();

    };

    const loop = () => {
      t += 0.05 * frequency;
      draw();
      animId = requestAnimationFrame(loop);
    };

    if (isPlaying && visible) {
      animId = requestAnimationFrame(loop);
    } else {
      draw();
    }

    return () => cancelAnimationFrame(animId);
  }, [wavelength, slitSeparation, frequency, isPlaying, visible]);

  return (
    <div className="sim-card">
      <div className="sim-header-row">
        <div>
          <span className="sim-tag">Wave Mechanics</span>
          <h3 className="sim-title">Wave Interference: The Double-Slit Ripple Tank</h3>
        </div>
        <div className="sim-controls-top">
          <button
            type="button"
            className={`sim-btn ${isPlaying ? 'sim-btn-pause' : 'sim-btn-play'}`}
            onClick={() => setIsPlaying((playing) => !playing)}
            aria-pressed={isPlaying}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>

      {!isPlaying && (
        <p className="sim-motion-note" role="status">
          {prefersReducedMotion
            ? 'Motion is switched off in your system settings, so this is a still frame. Press Play and it will move anyway.'
            : 'Paused. The pattern is drawn from the sliders, so you can change them and read the shape without waiting.'}
        </p>
      )}

      <div className="sim-interactive-stage">
        <div className="sim-canvas-wrap">
          <canvas ref={canvasRef} className="sim-canvas" />
          <div className="sim-overlay-labels">
            <span className="sim-overlay-badge left">Coherent Slits (S₁, S₂)</span>
            <span className="sim-overlay-badge right">Fringe Intensity Screen</span>
          </div>
        </div>

        <div className="sim-telemetry-strip">
          <div className="sim-telemetry-item">
            <span className="telemetry-label">Wavelength (λ)</span>
            <span className="telemetry-val highlight">{wavelength} px</span>
          </div>
          <div className="sim-telemetry-item">
            <span className="telemetry-label">Slit Gap (d)</span>
            <span className="telemetry-val">{slitSeparation} px</span>
          </div>
          <div className="sim-telemetry-item">
            <span className="telemetry-label">Central Fringe Spacing</span>
            <span className="telemetry-val">{(wavelength * 300 / slitSeparation).toFixed(1)} px (y = λL/d)</span>
          </div>
        </div>
      </div>

      <div className="sim-params-grid">
        <div className="sim-slider-group">
          <div className="sim-slider-label-row">
            <span>Wavelength (λ)</span>
            <strong>{wavelength} px</strong>
          </div>
          <input
            type="range"
            min="14"
            max="45"
            step="1"
            value={wavelength}
            onChange={(e) => setWavelength(Number(e.target.value))}
            className="sim-range"
            aria-label="Wavelength slider"
          />
        </div>

        <div className="sim-slider-group">
          <div className="sim-slider-label-row">
            <span>Slit Separation (d)</span>
            <strong>{slitSeparation} px</strong>
          </div>
          <input
            type="range"
            min="30"
            max="120"
            step="2"
            value={slitSeparation}
            onChange={(e) => setSlitSeparation(Number(e.target.value))}
            className="sim-range"
            aria-label="Slit separation slider"
          />
        </div>

        <div className="sim-slider-group">
          <div className="sim-slider-label-row">
            <span>Wave Speed / Oscillation</span>
            <strong>{frequency.toFixed(1)}x</strong>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            className="sim-range"
            aria-label="Wave speed slider"
          />
        </div>
      </div>

      <div className="sim-explanation-box">
        <Info size={18} className="sim-info-icon" />
        <p>
          <strong>What to notice:</strong> Look at the still, gray avenues fanning outward between the bright ripples. In those calm corridors, a crest from the top source arrives at the exact same instant as a trough from the bottom source—two physical disturbances adding together to make absolute silence. Move the slits closer together and watch those calm alleys widen out.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// SIMULATION 5: ORBITAL MECHANICS (Keplerian Orbit & Thruster Burns)
// ============================================================================
function OrbitalMechanicsSim() {
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0); // 1.0 = circular orbit
  const [altitude, setAltitude] = useState(85); // orbital radius in px
  const [trail, setTrail] = useState([]);
  const [orbitStatus, setOrbitStatus] = useState('Stable Circular Orbit');
  const [isCrashed, setIsCrashed] = useState(false);
  const [isEscaped, setIsEscaped] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const visible = useDocumentVisible();
  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion);

  const posRef = useRef({ x: 0, y: -85, vx: 2.1, vy: 0 });
  const animRef = useRef(null);

  const centerX = 300;
  const centerY = 110;
  const GM = 380; // gravitational parameter

  const resetOrbit = useCallback((targetRadius = 85, speedFactor = 1.0) => {
    const r = targetRadius;
    const vCirc = Math.sqrt(GM / r) * speedFactor;
    posRef.current = { x: 0, y: -r, vx: vCirc, vy: 0 };
    setAltitude(targetRadius);
    setSpeedMultiplier(speedFactor);
    setTrail([]);
    setIsCrashed(false);
    setIsEscaped(false);
  }, []);

  const nudgePrograde = () => {
    posRef.current.vx *= 1.15;
    posRef.current.vy *= 1.15;
  };

  const nudgeRetrograde = () => {
    posRef.current.vx *= 0.85;
    posRef.current.vy *= 0.85;
  };

  useEffect(() => {
    resetOrbit(altitude, speedMultiplier);
  }, [resetOrbit, altitude, speedMultiplier]);

  useEffect(() => {
    if (!isPlaying || !visible) return undefined;
    let lastTime = performance.now();

    const step = (now) => {
      const dt = Math.min((now - lastTime) / 1000 * 2.8, 0.06);
      lastTime = now;

      if (!isCrashed && !isEscaped) {
        const { x, y, vx, vy } = posRef.current;
        const r2 = x * x + y * y;
        const r = Math.sqrt(r2);

        if (r < 18) {
          setIsCrashed(true);
          setOrbitStatus('Atmospheric Re-entry / Surface Impact');
          return;
        }

        if (r > 240) {
          setIsEscaped(true);
          setOrbitStatus('Hyperbolic Escape (v > v_esc)');
          return;
        }

        // Keplerian gravity: a = -GM/r^2 in radial direction
        const aMag = GM / r2;
        const ax = -aMag * (x / r);
        const ay = -aMag * (y / r);

        const newVx = vx + ax * dt;
        const newVy = vy + ay * dt;
        const newX = x + newVx * dt;
        const newY = y + newVy * dt;

        posRef.current = { x: newX, y: newY, vx: newVx, vy: newVy };

        setTrail((prev) => [...prev.slice(-180), { x: newX, y: newY }]);

        // Status
        const currentSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
        const escapeSpeed = Math.sqrt((2 * GM) / r);
        if (currentSpeed >= escapeSpeed * 0.98) {
          setOrbitStatus('Approaching Escape Velocity');
        } else if (Math.abs(currentSpeed - Math.sqrt(GM / r)) < 0.2) {
          setOrbitStatus('Near-Circular Kepler Orbit');
        } else {
          setOrbitStatus('Eccentric Elliptical Orbit');
        }
      }

      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [isCrashed, isEscaped, isPlaying, visible]);

  return (
    <div className="sim-card">
      <div className="sim-header-row">
        <div>
          <span className="sim-tag">Astrophysics</span>
          <h3 className="sim-title">Orbital Mechanics: Kepler’s Gravitational Well</h3>
        </div>
        <div className="sim-controls-top">
          <button
            type="button"
            className={`sim-btn ${isPlaying ? 'sim-btn-pause' : 'sim-btn-play'}`}
            onClick={() => setIsPlaying((playing) => !playing)}
            aria-pressed={isPlaying}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button type="button" className="sim-btn sim-btn-play" onClick={nudgePrograde}>
            <Zap size={14} /> + Prograde Burn (Speed Up)
          </button>
          <button type="button" className="sim-btn sim-btn-ghost" onClick={nudgeRetrograde}>
            - Retrograde Burn (Slow Down)
          </button>
          <button type="button" className="sim-btn sim-btn-ghost" onClick={() => resetOrbit(85, 1.0)}>
            <RotateCcw size={14} /> Circularize
          </button>
        </div>
      </div>

      {!isPlaying && (
        <p className="sim-motion-note" role="status">
          {prefersReducedMotion
            ? 'Motion is switched off in your system settings, so the planet is parked where you left it. Press Play and it will move anyway.'
            : 'Paused. The burns still work while it is stopped, so you can set up an orbit and then let it run.'}
        </p>
      )}

      <div className="sim-interactive-stage">
        <svg className="sim-svg" viewBox="0 0 600 220" preserveAspectRatio="xMidYMid meet">
          {/* Gravitational Contours */}
          <circle cx={centerX} cy={centerY} r="140" fill="none" stroke="#6E5846" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.3" />
          <circle cx={centerX} cy={centerY} r="85" fill="none" stroke="#6E5846" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.4" />
          <circle cx={centerX} cy={centerY} r="40" fill="none" stroke="#6E5846" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.3" />

          {/* Central Star / Planet */}
          <circle cx={centerX} cy={centerY} r="18" fill="#8C4A2F" stroke="#2C2118" strokeWidth="2" />
          <circle cx={centerX} cy={centerY} r="24" fill="none" stroke="#8C4A2F" strokeWidth="1" opacity="0.3" />
          <text x={centerX} y={centerY + 32} fontSize="10" fill="#6E5846" textAnchor="middle" fontWeight="bold">
            Central Mass (M)
          </text>

          {/* Orbital Trail */}
          {trail.length > 1 && (
            <path
              d={trail.map((p, i) => `${i === 0 ? 'M' : 'L'} ${centerX + p.x} ${centerY + p.y}`).join(' ')}
              fill="none"
              stroke="#A56A2A"
              strokeWidth="1.8"
              opacity="0.85"
            />
          )}

          {/* Orbiting Satellite */}
          {!isCrashed && (
            <g transform={`translate(${centerX + posRef.current.x}, ${centerY + posRef.current.y})`}>
              <circle cx="0" cy="0" r="5" fill="#2C2118" stroke="#FFF9F1" strokeWidth="1.5" />
              {/* Velocity vector */}
              <line
                x1="0"
                y1="0"
                x2={posRef.current.vx * 10}
                y2={posRef.current.vy * 10}
                stroke="#3F6B4A"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Crash / Escape Messages */}
          {isCrashed && (
            <text x={centerX} y={centerY - 28} fontSize="12" fill="#A33B32" textAnchor="middle" fontWeight="bold">
              💥 Orbit decayed: Collision with surface
            </text>
          )}
          {isEscaped && (
            <text x={centerX} y="30" fontSize="12" fill="#3F6B4A" textAnchor="middle" fontWeight="bold">
              🚀 Spacecraft achieved escape velocity into deep cosmos
            </text>
          )}
        </svg>

        <div className="sim-telemetry-strip">
          <div className="sim-telemetry-item">
            <span className="telemetry-label">Trajectory Status</span>
            <span className="telemetry-val highlight">{orbitStatus}</span>
          </div>
          <div className="sim-telemetry-item">
            <span className="telemetry-label">Circular Orbital Velocity</span>
            <span className="telemetry-val">v_circ = √(GM/r)</span>
          </div>
          <div className="sim-telemetry-item">
            <span className="telemetry-label">Escape Velocity Threshold</span>
            <span className="telemetry-val">v_esc = √2 · v_circ</span>
          </div>
        </div>
      </div>

      <div className="sim-explanation-box">
        <Info size={18} className="sim-info-icon" />
        <p>
          <strong>What to notice:</strong> An orbit isn't floating in zero gravity—the satellite is falling toward Earth every single second. But it's hurtling sideways so fast that the curved surface of the Earth drops away underneath it at the exact same rate. Hit '+ Prograde Burn' and notice how speeding up here doesn't make you higher now; it makes you swing higher on the opposite side of the planet half an orbit later.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN CONTAINER COMPONENT
// ============================================================================
export default function PhysicsSimulations({ defaultSim = 'newton', onBack }) {
  const [activeTab, setActiveTab] = useState(defaultSim);

  const tabs = [
    { id: 'newton', label: 'Newton’s 2nd Law (F=ma)', icon: Zap },
    { id: 'projectile', label: 'Projectile Motion', icon: Target },
    { id: 'freefall', label: 'Vacuum vs Air Drop', icon: ArrowDown },
    { id: 'waves', label: 'Wave Interference', icon: Waves },
    { id: 'orbit', label: 'Orbital Mechanics', icon: Orbit },
  ];

  return (
    <div className="physics-sims-container">
      <div className="sims-header">
        <div className="sims-header-text">
          <span className="sims-kicker">INTERACTIVE PHYSICS LABORATORY</span>
          <h2>See the equations move.</h2>
          <p>
            A diagram of a sloped plane cannot show you why the crate keeps
            sliding. Move a slider and watch what the equation does about it.
          </p>
        </div>
        {onBack && (
          <button type="button" className="sims-back-btn" onClick={onBack}>
            ← Back
          </button>
        )}
      </div>

      {/* Simulation Selector Tabs */}
      <div className="sims-tab-rail" role="tablist" aria-label="Physics simulations">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`sim-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Simulation */}
      <div className="sim-active-wrapper">
        {activeTab === 'newton' && <NewtonSecondLawSim />}
        {activeTab === 'projectile' && <ProjectileMotionSim />}
        {activeTab === 'freefall' && <FreeFallSim />}
        {activeTab === 'waves' && <WaveInterferenceSim />}
        {activeTab === 'orbit' && <OrbitalMechanicsSim />}
      </div>
    </div>
  );
}
