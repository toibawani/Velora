import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Globe, Sun, Sparkles, Orbit, Clapperboard, CircleDot } from 'lucide-react';

/**
 * RelativityLab - interactive general-relativity playground: mass, proximity
 * and time-dilation sliders over live physics metrics.
 *
 * The screen is built like the physics laboratory: benchmarks, one figure, the
 * parameters that matter, then a readout table. Equations are HTML with real
 * subscripts. The previous version printed `$M$`, `$r_s$` and
 * `$10^{-6} M_\odot$` at readers because the copy had been written for a LaTeX
 * renderer this app does not have.
 */
const G = 6.6743e-11; // m^3 kg^-1 s^-2
const C = 299792458; // m/s
const SOLAR_MASS = 1.98847e30; // kg
const EARTH_MASS = 5.9722e24; // kg
const HBAR = 1.054571817e-34; // J s
const KB = 1.380649e-23; // J/K

const PRESETS = [
  {
    id: 'earth',
    name: 'Earth',
    icon: Globe,
    massInSolar: EARTH_MASS / SOLAR_MASS,
    radiusMultiplier: 2.5,
    note: 'Earth compressed to a black hole would be about 9 mm in radius, smaller than a coin.',
  },
  {
    id: 'sun',
    name: 'Sun (1 M☉)',
    icon: Sun,
    massInSolar: 1.0,
    radiusMultiplier: 3.0,
    note: 'One solar mass collapses to an event horizon radius of 2.95 km.',
  },
  {
    id: 'cygnus-x1',
    name: 'Cygnus X-1',
    icon: Sparkles,
    massInSolar: 21.2,
    radiusMultiplier: 2.0,
    // Cygnus X-1 is the leading candidate and has been for fifty years, but
    // no stellar-mass black hole has been confirmed by direct observation, so
    // "first confirmed" was overstating it.
    note: 'The leading stellar-mass black hole candidate, in a binary system over 7,000 light years away.',
  },
  {
    id: 'sag-a',
    name: 'Sagittarius A*',
    icon: Orbit,
    massInSolar: 4.297e6,
    radiusMultiplier: 1.5,
    note: 'The supermassive black hole at the centre of the Milky Way, about 4.3 million solar masses.',
  },
  {
    id: 'gargantua',
    // Gargantua is fictional. It sat in this list beside the Earth, the Sun and
    // M87* with the same treatment and no mention of that, which made a film
    // prop look like an observation.
    name: 'Gargantua (fictional)',
    icon: Clapperboard,
    massInSolar: 1.0e8,
    radiusMultiplier: 1.05,
    isFictional: true,
    note: 'From the film Interstellar, not an observed object. Its figures come from the script, not from a measurement.',
  },
  {
    id: 'm87',
    name: 'M87*',
    icon: CircleDot,
    massInSolar: 6.5e9,
    radiusMultiplier: 2.0,
    note: 'The first black hole imaged by the Event Horizon Telescope, in April 2019.',
  },
];

const presetMassLabel = (solarMasses) => {
  if (solarMasses < 1e-3) {
    return `${Math.round(solarMasses * (SOLAR_MASS / EARTH_MASS)).toLocaleString()} M⊕`;
  }
  return `${solarMasses.toExponential(1)} M☉`;
};

RelativityLab.propTypes = {
  onBack: PropTypes.func,
  backLabel: PropTypes.string,
};

function RelativityLab({ onBack, backLabel = 'Back' }) {
  const [selectedPreset, setSelectedPreset] = useState('sag-a');
  // Logarithmic scale for mass (in solar masses): 10^-6 to 10^10.
  const [logMass, setLogMass] = useState(Math.log10(4.297e6));
  // Orbit distance in multiples of the Schwarzschild radius: 1.02 to 15.
  const [radiusRatio, setRadiusRatio] = useState(1.5);
  // Observer local clock time, in hours.
  const [localHours, setLocalHours] = useState(1);

  const canvasRef = useRef(null);
  const activePreset = PRESETS.find((preset) => preset.id === selectedPreset);

  const massSolar = Math.pow(10, logMass);
  const massKg = massSolar * SOLAR_MASS;
  const rSchwarzschild = (2 * G * massKg) / (C * C);
  const observerDistance = radiusRatio * rSchwarzschild;

  const timeDilationFactor = useMemo(() => {
    if (radiusRatio <= 1.0001) return Infinity;
    return 1 / Math.sqrt(1 - 1 / radiusRatio);
  }, [radiusRatio]);

  const distantHours = isFinite(timeDilationFactor) ? localHours * timeDilationFactor : Infinity;

  const lightDeflectionArcsec = useMemo(() => {
    const angleRad = (4 * G * massKg) / (observerDistance * C * C);
    return angleRad * (180 / Math.PI) * 3600;
  }, [massKg, observerDistance]);

  const hawkingTempKelvin = useMemo(
    () => (HBAR * Math.pow(C, 3)) / (8 * Math.PI * G * massKg * KB),
    [massKg]
  );

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset.id);
    setLogMass(Math.log10(preset.massInSolar));
    setRadiusRatio(preset.radiusMultiplier);
  };

  const formatDistance = (meters) => {
    if (meters < 0.01) return `${(meters * 1000).toFixed(2)} mm`;
    if (meters < 1000) return `${meters.toFixed(2)} m`;
    if (meters < 1e9) return `${(meters / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} km`;
    if (meters < 1e12) return `${(meters / 1.496e11).toFixed(2)} AU`;
    return `${(meters / 9.461e15).toFixed(4)} light years`;
  };

  const formatDistantTime = (hours) => {
    // At the horizon the coordinate-time ratio diverges. It does not mean the
    // clock there has stopped, which is what "Time Stood Still" once claimed.
    if (!isFinite(hours)) return 'Diverges at the horizon';
    if (hours < 24) return `${hours.toFixed(2)} hours`;
    const days = hours / 24;
    if (days < 365) return `${days.toFixed(1)} days (${hours.toFixed(0)}h)`;
    const years = days / 365.25;
    if (years < 1e4) return `${years.toFixed(2)} years`;
    return `${years.toExponential(2)} years`;
  };

  const massLabel = massSolar < 1e-3
    ? `${(massSolar * (SOLAR_MASS / EARTH_MASS)).toFixed(2)} Earth masses`
    : massSolar < 1e5
      ? `${massSolar.toLocaleString(undefined, { maximumFractionDigits: 1 })} M☉`
      : `${massSolar.toExponential(2)} M☉`;

  // Spacetime curvature warp grid.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let animId;
    let width = 0;
    let height = 0;
    let time = 0;
    let isRunning = true;

    // The grid animated from mount with no way to stop it and ignored
    // prefers-reduced-motion entirely.
    const motionQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    let pausedForMotion = motionQuery ? motionQuery.matches : false;

    // Colours come from the theme, so the plate is paper in the light theme and
    // night in the dark one rather than a fixed black rectangle on cream.
    const styles = getComputedStyle(canvas);
    const token = (name, fallback) => styles.getPropertyValue(name).trim() || fallback;
    const paper = token('--bg-elevated', '#FFF9F1');
    const ink = token('--text-primary', '#2C2118');
    const grid = token('--text-secondary', '#6E5846');
    const ember = token('--accent-primary', '#B1431A');

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const render = () => {
      if (!isRunning) return;

      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height * 0.44;
      const depth = height * 0.42;

      const rows = 14;
      const cols = 22;
      const cellW = width / (cols - 1);
      const cellH = depth / (rows - 1);
      const curvatureIntensity = Math.min(120, 30 + (logMass + 6) * 5);

      const getPoint = (column, row) => {
        const x = (column - cols / 2) * cellW;
        const z = (row - rows / 2) * cellH;
        const distance = Math.hypot(x, z);
        const dip = (curvatureIntensity * 80) / (distance + 30);
        const scale = 180 / (180 + z);
        return {
          x: centerX + x * scale,
          y: centerY + (z + dip) * scale,
          distance,
        };
      };

      ctx.lineWidth = 1;
      ctx.strokeStyle = grid;
      ctx.globalAlpha = 0.3;

      for (let row = 0; row < rows; row += 1) {
        ctx.beginPath();
        for (let column = 0; column < cols; column += 1) {
          const point = getPoint(column, row);
          if (column === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
      }

      for (let column = 0; column < cols; column += 1) {
        ctx.beginPath();
        for (let row = 0; row < rows; row += 1) {
          const point = getPoint(column, row);
          if (row === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      const horizonRadius = Math.max(14, Math.min(36, 12 + logMass * 1.5));
      const coreY = centerY + curvatureIntensity * 0.75;

      // Photon sphere: light can orbit here at 1.5 r_s.
      ctx.strokeStyle = ember;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, coreY, horizonRadius * 1.5, 0, Math.PI * 2);
      ctx.stroke();

      // The horizon itself.
      ctx.fillStyle = ink;
      ctx.beginPath();
      ctx.arc(centerX, coreY, horizonRadius, 0, Math.PI * 2);
      ctx.fill();

      // The probe, on the orbit the radius slider describes.
      const probeAngle = time * (0.02 / Math.sqrt(radiusRatio));
      const probeOrbitR = horizonRadius * radiusRatio;
      const probeX = centerX + Math.cos(probeAngle) * probeOrbitR;
      const probeY = coreY + Math.sin(probeAngle) * (probeOrbitR * 0.35);

      ctx.fillStyle = ember;
      ctx.beginPath();
      ctx.arc(probeX, probeY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = ember;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(probeX, probeY, 8 + (time % 20) * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.fillStyle = grid;
      ctx.font = '11px "Source Sans 3", system-ui, sans-serif';
      ctx.fillText(`r = ${radiusRatio.toFixed(2)} rₛ`, probeX + 10, probeY - 6);

      time += 1;
      animId = requestAnimationFrame(render);
    };

    // One frame with no follow-up request, for the reduced-motion case.
    const renderOnce = () => {
      const wasRunning = isRunning;
      isRunning = true;
      render();
      isRunning = wasRunning;
    };

    const onVisibility = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animId);
      } else if (!pausedForMotion) {
        isRunning = true;
        animId = requestAnimationFrame(render);
      }
    };

    const onMotionPrefChange = (event) => {
      pausedForMotion = event.matches;
      if (pausedForMotion) {
        isRunning = false;
        cancelAnimationFrame(animId);
        renderOnce();
      } else if (!document.hidden) {
        isRunning = true;
        animId = requestAnimationFrame(render);
      }
    };

    if (pausedForMotion) {
      isRunning = false;
      renderOnce();
    } else {
      render();
    }

    document.addEventListener('visibilitychange', onVisibility);
    if (motionQuery) {
      if (motionQuery.addEventListener) motionQuery.addEventListener('change', onMotionPrefChange);
      else motionQuery.addListener(onMotionPrefChange);
    }

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateSize);
      document.removeEventListener('visibilitychange', onVisibility);
      if (motionQuery) {
        if (motionQuery.removeEventListener) motionQuery.removeEventListener('change', onMotionPrefChange);
        else motionQuery.removeListener(onMotionPrefChange);
      }
    };
  }, [logMass, radiusRatio]);

  return (
    <div data-testid="relativity-lab" className="rel-lab">
      <header className="rel-masthead">
        <div className="rel-masthead-copy">
          <p className="rel-kicker">Relativity laboratory</p>
          <h1 className="rel-title">One second here, measured from far away.</h1>
          <p className="rel-intro">
            Pick a mass, put the probe close to the horizon, and read how much
            longer a distant clock runs while an hour passes beside the black
            hole.
          </p>
        </div>
        {onBack && (
          <button type="button" className="rel-back" onClick={onBack}>
            ← {backLabel}
          </button>
        )}
      </header>

      <section className="rel-section" aria-labelledby="rel-benchmarks-label">
        <h2 className="rel-section-label" id="rel-benchmarks-label">Benchmarks</h2>
        <div className="rel-benchmarks" role="group" aria-label="Black hole benchmarks">
          {PRESETS.map((preset) => {
            const Icon = preset.icon;
            const selected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                className={`rel-benchmark ${selected ? 'is-active' : ''}`}
                aria-pressed={selected}
                onClick={() => handleSelectPreset(preset)}
              >
                <span className="rel-benchmark-name">
                  <Icon size={14} aria-hidden="true" />
                  {preset.name}
                </span>
                <span className="rel-benchmark-mass">{presetMassLabel(preset.massInSolar)}</span>
              </button>
            );
          })}
        </div>
        {activePreset && activePreset.note && (
          <p className={`rel-preset-note ${activePreset.isFictional ? 'is-fictional' : ''}`} role="note">
            {activePreset.isFictional && <strong>Not a real object. </strong>}
            {activePreset.note}
          </p>
        )}
      </section>

      <div className="rel-workspace">
        <figure className="rel-figure">
          <canvas
            ref={canvasRef}
            className="rel-canvas"
            role="img"
            aria-label={`Embedding diagram of a ${massLabel} black hole. The probe sits at ${radiusRatio.toFixed(2)} times the horizon radius.`}
          />
          <figcaption className="rel-caption">
            A rubber-sheet embedding of the gravitational well. The ink disc is
            the event horizon, the ember ring is the photon sphere at 1.5 times
            that radius, and the dot is the probe.
          </figcaption>
        </figure>

        <div className="rel-controls">
          <h2 className="rel-section-label">Parameters</h2>

          <div className="rel-param">
            <div className="rel-param-head">
              <label htmlFor="rel-mass">Black hole mass</label>
              <span className="rel-param-value">{massLabel}</span>
            </div>
            <input
              id="rel-mass"
              type="range"
              min="-6"
              max="10"
              step="0.05"
              value={logMass}
              aria-label="Black hole mass, logarithmic solar masses"
              onChange={(event) => {
                setLogMass(parseFloat(event.target.value));
                setSelectedPreset('custom');
              }}
              className="rel-range"
            />
            <p className="rel-param-hint">
              Logarithmic, from 10<sup>−6</sup> M☉ to 10<sup>10</sup> M☉.
            </p>
          </div>

          <div className="rel-param">
            <div className="rel-param-head">
              <label htmlFor="rel-radius">Proximity to the horizon</label>
              <span className="rel-param-value">{radiusRatio.toFixed(2)} × rₛ</span>
            </div>
            <input
              id="rel-radius"
              type="range"
              min="1.02"
              max="15.0"
              step="0.02"
              value={radiusRatio}
              aria-label="Proximity to the horizon, in Schwarzschild radii"
              onChange={(event) => {
                setRadiusRatio(parseFloat(event.target.value));
                setSelectedPreset('custom');
              }}
              className="rel-range"
            />
            <p className="rel-param-hint">
              At the horizon, distant clocks diverge. At 1.5 rₛ, light can orbit.
            </p>
          </div>

          <div className="rel-param">
            <div className="rel-param-head">
              <label htmlFor="rel-duration">Local observer duration</label>
              <span className="rel-param-value">
                {localHours} hour{localHours > 1 ? 's' : ''}
              </span>
            </div>
            <input
              id="rel-duration"
              type="range"
              min="1"
              max="24"
              step="1"
              value={localHours}
              aria-label="Local observer duration, hours"
              onChange={(event) => setLocalHours(parseInt(event.target.value, 10))}
              className="rel-range"
            />
            <p className="rel-param-hint">
              Time measured by the clock beside the probe, not by the distant one.
            </p>
          </div>
        </div>
      </div>

      <section className="rel-section" aria-labelledby="rel-readout-label">
        <h2 className="rel-section-label" id="rel-readout-label">Readout</h2>
        <dl className="rel-metrics">
          <div className="rel-metric">
            <dt>Event horizon radius <span className="rel-metric-symbol">rₛ</span></dt>
            <dd>
              <span className="rel-metric-value">{formatDistance(rSchwarzschild)}</span>
              <span className="rel-metric-note">the point of no return</span>
            </dd>
          </div>
          <div className="rel-metric">
            <dt>Dilation factor <span className="rel-metric-symbol">1 / √(1 − rₛ/r)</span></dt>
            <dd>
              <span className="rel-metric-value">
                {isFinite(timeDilationFactor) ? `${timeDilationFactor.toFixed(2)}×` : '∞'}
              </span>
              <span className="rel-metric-note">distant time per local hour</span>
            </dd>
          </div>
          <div className="rel-metric">
            <dt>Distant clock</dt>
            <dd>
              <span className="rel-metric-value">{formatDistantTime(distantHours)}</span>
              <span className="rel-metric-note">
                while {localHours} hour{localHours > 1 ? 's' : ''} pass at the probe
              </span>
            </dd>
          </div>
          <div className="rel-metric">
            <dt>Light deflection <span className="rel-metric-symbol">θ</span></dt>
            <dd>
              <span className="rel-metric-value">
                {lightDeflectionArcsec > 3600
                  ? `${(lightDeflectionArcsec / 3600).toFixed(2)}°`
                  : `${lightDeflectionArcsec.toFixed(1)}″`}
              </span>
              <span className="rel-metric-note">lensing at the probe distance</span>
            </dd>
          </div>
        </dl>
      </section>

      <section className="rel-section" aria-labelledby="rel-theory-label">
        <h2 className="rel-section-label" id="rel-theory-label">Governing equations</h2>
        <ol className="rel-theory">
          <li>
            <h3>Schwarzschild radius</h3>
            <p className="rel-formula">r<sub>s</sub> = 2GM / c<sup>2</sup></p>
            <p>
              Karl Schwarzschild derived this exact solution in 1916. Any mass
              compressed inside its own r<sub>s</sub> has an escape speed at or
              above the speed of light.
            </p>
          </li>
          <li>
            <h3>Gravitational time dilation</h3>
            <p className="rel-formula">Δt = Δt<sub>0</sub> / √(1 − r<sub>s</sub>/r)</p>
            <p>
              Clocks deeper in a well run slower than clocks farther out. As r
              approaches r<sub>s</sub>, the denominator approaches zero and the
              distant time diverges.
            </p>
          </li>
          <li>
            <h3>Hawking temperature</h3>
            <p className="rel-formula">T<sub>H</sub> = ℏc<sup>3</sup> / (8πGMk<sub>B</sub>)</p>
            <p>
              This mass radiates at {hawkingTempKelvin.toExponential(2)} K. Lower
              mass holes burn hotter and evaporate faster.
            </p>
          </li>
        </ol>
      </section>
    </div>
  );
}

export default RelativityLab;
