import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import '../styles/RelativityLab.css';

// Fundamental physical constants (SI Units)
const G = 6.6743e-11; // m^3 kg^-1 s^-2
const C = 299792458;  // m/s
const SOLAR_MASS = 1.98847e30; // kg
const EARTH_MASS = 5.9722e24;  // kg
const HBAR = 1.054571817e-34; // J s
const KB = 1.380649e-23;     // J/K

const PRESETS = [
  {
    id: 'earth',
    name: 'Earth',
    icon: '🌍',
    massInSolar: EARTH_MASS / SOLAR_MASS,
    radiusMultiplier: 2.5,
    note: 'Earth compressed to black hole would be ~9mm in radius (smaller than a coin).'
  },
  {
    id: 'sun',
    name: 'Sun (1 M☉)',
    icon: '☀️',
    massInSolar: 1.0,
    radiusMultiplier: 3.0,
    note: '1 Solar mass collapses to an event horizon radius of 2.95 km.'
  },
  {
    id: 'cygnus-x1',
    name: 'Cygnus X-1',
    icon: '💫',
    massInSolar: 21.2,
    radiusMultiplier: 2.0,
    note: 'First confirmed stellar-mass black hole discovered in the Milky Way.'
  },
  {
    id: 'sag-a',
    name: 'Sagittarius A*',
    icon: '🌌',
    massInSolar: 4.297e6,
    radiusMultiplier: 1.5,
    note: 'The supermassive monster at the geometric center of the Milky Way.'
  },
  {
    id: 'gargantua',
    name: "Gargantua (Miller's Planet)",
    icon: '🌊',
    massInSolar: 1.0e8,
    radiusMultiplier: 1.05,
    note: 'Extreme time dilation: 1 hour on Miller’s planet = 7 Earth years!'
  },
  {
    id: 'm87',
    name: 'M87*',
    icon: '🔴',
    massInSolar: 6.5e9,
    radiusMultiplier: 2.0,
    note: 'First black hole directly imaged by the Event Horizon Telescope in 2019.'
  }
];

function RelativityLab({ onBack }) {
  const [selectedPreset, setSelectedPreset] = useState('sag-a');
  // Logarithmic scale for mass (in Solar Masses): 10^-6 to 10^10
  const [logMass, setLogMass] = useState(Math.log10(4.297e6));
  // Orbit distance in multiples of Schwarzschild Radius (r / r_s): 1.02 to 20
  const [radiusRatio, setRadiusRatio] = useState(1.5);
  // Observer local clock time (in hours)
  const [localHours, setLocalHours] = useState(1);

  const canvasRef = useRef(null);

  // Compute Mass in kg
  const massSolar = Math.pow(10, logMass);
  const massKg = massSolar * SOLAR_MASS;

  // Schwarzschild Radius: r_s = 2GM / c^2
  const rSchwarzschild = (2 * G * massKg) / (C * C); // in meters
  // Observer actual distance: r = ratio * r_s
  const observerDistance = radiusRatio * rSchwarzschild;

  // Gravitational Time Dilation factor: t / t0 = 1 / sqrt(1 - r_s / r)
  const timeDilationFactor = useMemo(() => {
    if (radiusRatio <= 1.0001) return Infinity;
    return 1 / Math.sqrt(1 - (1 / radiusRatio));
  }, [radiusRatio]);

  // Distant observer elapsed time
  const distantHours = isFinite(timeDilationFactor) ? localHours * timeDilationFactor : Infinity;

  // Gravitational Light Deflection (Einstein ring angle in radians): theta = 4GM / (r c^2)
  const lightDeflectionArcsec = useMemo(() => {
    const angleRad = (4 * G * massKg) / (observerDistance * C * C);
    return (angleRad * (180 / Math.PI) * 3600);
  }, [massKg, observerDistance]);

  // Hawking Temperature: T = (hbar * c^3) / (8 * pi * G * M * kB)
  const hawkingTempKelvin = useMemo(() => {
    return (HBAR * Math.pow(C, 3)) / (8 * Math.PI * G * massKg * KB);
  }, [massKg]);

  // Apply a Preset
  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset.id);
    setLogMass(Math.log10(preset.massInSolar));
    setRadiusRatio(preset.radiusMultiplier);
  };

  // Format Schwarzschild radius gracefully
  const formatDistance = (meters) => {
    if (meters < 0.01) return `${(meters * 1000).toFixed(2)} mm`;
    if (meters < 1000) return `${meters.toFixed(2)} m`;
    if (meters < 1e9) return `${(meters / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} km`;
    if (meters < 1e12) return `${(meters / 1.496e11).toFixed(2)} AU`;
    return `${(meters / 9.461e15).toFixed(4)} Light Years`;
  };

  // Format Elapsed Time gracefully
  const formatDistantTime = (hours) => {
    if (!isFinite(hours)) return 'Infinite (Time Stood Still)';
    if (hours < 24) return `${hours.toFixed(2)} hours`;
    const days = hours / 24;
    if (days < 365) return `${days.toFixed(1)} days (${(hours).toFixed(0)}h)`;
    const years = days / 365.25;
    if (years < 1e4) return `${years.toFixed(2)} years`;
    return `${years.toExponential(2)} years`;
  };

  // Spacetime Curvature Warp Grid Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = 0;
    let height = 0;
    let time = 0;
    let isRunning = true;

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

      ctx.fillStyle = '#06080d';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height * 0.45;
      const depth = height * 0.4;

      // Draw 3D Spacetime Grid with gravitational funnel depression
      const rows = 14;
      const cols = 22;
      const cellW = width / (cols - 1);
      const cellH = depth / (rows - 1);

      // Curvature depth scaled by mass and proximity
      const curvatureIntensity = Math.min(120, 30 + (logMass + 6) * 5);
      const warpRadius = Math.max(40, (radiusRatio * 20));

      const getPoint = (c, r) => {
        const x = (c - cols / 2) * cellW;
        const z = (r - rows / 2) * cellH;

        // Distance from center on the 2D plane
        const dist = Math.hypot(x, z);

        // Potential well depression: -1 / (dist + epsilon)
        const dip = (curvatureIntensity * 80) / (dist + 30);

        // Perspective projection
        const scale = 180 / (180 + z);
        const screenX = centerX + x * scale;
        const screenY = centerY + (z + dip) * scale;

        return { x: screenX, y: screenY, dip, scale, dist };
      };

      // Draw grid lines
      ctx.lineWidth = 1;

      // Row curves
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const pt = getPoint(c, r);
          const alpha = Math.max(0.1, 0.45 - (pt.dist / (width * 0.75)));
          ctx.strokeStyle = `rgba(102, 126, 234, ${alpha})`;
          if (c === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      // Col curves
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const pt = getPoint(c, r);
          const alpha = Math.max(0.1, 0.45 - (pt.dist / (width * 0.75)));
          ctx.strokeStyle = `rgba(102, 126, 234, ${alpha})`;
          if (r === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      // Event Horizon Core Sphere
      const horizonRadius = Math.max(14, Math.min(36, 12 + logMass * 1.5));
      const coreY = centerY + curvatureIntensity * 0.75;

      // Glow / accretion boundary
      const grad = ctx.createRadialGradient(centerX, coreY, horizonRadius * 0.8, centerX, coreY, horizonRadius * 2.2);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.8)');
      grad.addColorStop(0.5, 'rgba(234, 88, 12, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, coreY, horizonRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Black Hole Silhouette
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(centerX, coreY, horizonRadius, 0, Math.PI * 2);
      ctx.fill();

      // Photon Sphere ring (r = 1.5 r_s)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, coreY, horizonRadius * 1.5, 0, Math.PI * 2);
      ctx.stroke();

      // Orbiting probe showing time dilation effect
      const probeAngle = time * (0.02 / Math.sqrt(radiusRatio));
      const probeOrbitR = horizonRadius * radiusRatio;
      const probeX = centerX + Math.cos(probeAngle) * probeOrbitR;
      const probeY = coreY + Math.sin(probeAngle) * (probeOrbitR * 0.35);

      // Probe trail
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(probeX, probeY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Pulse ring around probe
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(probeX, probeY, 8 + (time % 20) * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      // Text label near probe
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.fillText(`r = ${radiusRatio.toFixed(2)} rs`, probeX + 10, probeY - 6);

      time++;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateSize);
    };
  }, [logMass, radiusRatio]);

  return (
    <div className="relativity-lab-container">
      {/* Header */}
      <header className="rel-header">
        <div className="rel-header-left">
          <button className="rel-back-btn" onClick={onBack}>
            ← Back to Physics
          </button>
          <h1 className="rel-title">
            <span>⚛️</span> General Relativity & Spacetime Laboratory
          </h1>
          <p className="rel-subtitle">
            Manipulate stellar masses, event horizon metrics, and gravitational time warping in real time.
          </p>
        </div>
      </header>

      {/* Preset Selector Chips */}
      <div className="rel-presets-bar">
        <span className="rel-presets-label">Astrophysical Benchmarks:</span>
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            className={`rel-preset-chip ${selectedPreset === preset.id ? 'active' : ''}`}
            onClick={() => handleSelectPreset(preset)}
          >
            {preset.icon} {preset.name}
          </button>
        ))}
      </div>

      {/* Interactive Grid: Visualizer + Controls */}
      <div className="rel-grid">
        {/* Visualizer Card */}
        <div className="rel-canvas-card">
          <div className="rel-card-header">
            <h2 className="rel-card-title">Real-Time Spacetime Metric (Embedding Funnel)</h2>
            <span className="rel-badge">Live Geodesic Solver</span>
          </div>

          <div className="rel-canvas-wrapper">
            <canvas ref={canvasRef} className="rel-canvas" />
          </div>

          <p className="rel-canvas-caption">
            The rubber-sheet grid depicts gravitational depression $g_{00} = -(1 - r_s/r)$. The orange sphere represents the photon sphere ($1.5 r_s$), and the green node represents your current orbital coordinates.
          </p>
        </div>

        {/* Dynamic Controls Card */}
        <div className="rel-controls-card">
          <div className="rel-card-header">
            <h2 className="rel-card-title">Curvature & Distance Parameters</h2>
            <span className="rel-badge">SI Precision</span>
          </div>

          {/* Mass Slider */}
          <div className="rel-slider-group">
            <div className="rel-slider-header">
              <span className="rel-slider-label">Black Hole Mass ($M$)</span>
              <span className="rel-slider-value">
                {massSolar < 1e-3
                  ? `${(massSolar * (SOLAR_MASS / EARTH_MASS)).toFixed(2)} M⊕ (Earth Masses)`
                  : massSolar < 1e5
                  ? `${massSolar.toLocaleString(undefined, { maximumFractionDigits: 1 })} M☉`
                  : `${massSolar.toExponential(2)} M☉`}
              </span>
            </div>
            <input
              type="range"
              min="-6"
              max="10"
              step="0.05"
              value={logMass}
              onChange={(e) => {
                setLogMass(parseFloat(e.target.value));
                setSelectedPreset('custom');
              }}
              className="rel-slider"
            />
            <p className="rel-slider-subtext">
              Logarithmic range from planetary micro-masses ($10^{-6} M_\odot$) to ultra-massive quasar cores ($10^{10} M_\odot$).
            </p>
          </div>

          {/* Proximity / Coordinate Distance Slider */}
          <div className="rel-slider-group">
            <div className="rel-slider-header">
              <span className="rel-slider-label">Proximity Ratio ($r / r_s$)</span>
              <span className="rel-slider-value">{radiusRatio.toFixed(2)} × Horizon</span>
            </div>
            <input
              type="range"
              min="1.02"
              max="15.0"
              step="0.02"
              value={radiusRatio}
              onChange={(e) => {
                setRadiusRatio(parseFloat(e.target.value));
                setSelectedPreset('custom');
              }}
              className="rel-slider"
            />
            <p className="rel-slider-subtext">
              At $r = 1.0 r_s$, time stops relative to distant clocks. At $r = 1.5 r_s$, light orbits in a closed loop.
            </p>
          </div>

          {/* Local Clock Duration */}
          <div className="rel-slider-group">
            <div className="rel-slider-header">
              <span className="rel-slider-label">Local Observer Duration</span>
              <span className="rel-slider-value">{localHours} Hour{localHours > 1 ? 's' : ''}</span>
            </div>
            <input
              type="range"
              min="1"
              max="24"
              step="1"
              value={localHours}
              onChange={(e) => setLocalHours(parseInt(e.target.value, 10))}
              className="rel-slider"
            />
          </div>

          {/* Live Physics Metrics */}
          <div className="rel-metrics-grid">
            <div className="rel-metric-box">
              <span className="rel-metric-title">Event Horizon Radius ($r_s$)</span>
              <span className="rel-metric-number">{formatDistance(rSchwarzschild)}</span>
              <span className="rel-metric-desc">Point of zero photon escape</span>
            </div>

            <div className="rel-metric-box">
              <span className="rel-metric-title">Dilation Factor ($\gamma_g$)</span>
              <span className="rel-metric-number" style={{ color: '#f59e0b' }}>
                {isFinite(timeDilationFactor) ? `${timeDilationFactor.toFixed(2)}x` : '∞'}
              </span>
              <span className="rel-metric-desc">Gravitational clock retardation</span>
            </div>

            <div className="rel-metric-box">
              <span className="rel-metric-title">Earth / Distant Clock Time</span>
              <span className="rel-metric-number" style={{ color: '#10b981' }}>
                {formatDistantTime(distantHours)}
              </span>
              <span className="rel-metric-desc">For {localHours} hr spent at current orbit</span>
            </div>

            <div className="rel-metric-box">
              <span className="rel-metric-title">Light Deflection ($\theta$)</span>
              <span className="rel-metric-number">
                {lightDeflectionArcsec > 3600
                  ? `${(lightDeflectionArcsec / 3600).toFixed(2)}°`
                  : `${lightDeflectionArcsec.toFixed(1)}″`}
              </span>
              <span className="rel-metric-desc">Gravitational lensing arc</span>
            </div>
          </div>
        </div>
      </div>

      {/* Physics Theoretical Foundations */}
      <div className="rel-theory-card">
        <h2 className="rel-card-title">Governing General Relativistic Equations</h2>
        <div className="rel-formula-row">
          <div className="rel-formula-block">
            <span className="rel-formula-code">r_s = 2GM / c²</span>
            <p className="rel-formula-explanation">
              <strong>Schwarzschild Radius:</strong> Karl Schwarzschild (1916) derived this exact solution to Einstein's Field Equations. Any mass compressed inside its $r_s$ inevitably forms a gravitational singularity.
            </p>
          </div>

          <div className="rel-formula-block">
            <span className="rel-formula-code">Δt = Δt₀ / √(1 - r_s / r)</span>
            <p className="rel-formula-explanation">
              <strong>Gravitational Time Dilation:</strong> Clocks deeper in a gravitational well run slower than clocks farther out. As $r \to r_s$, the denominator approaches zero and external time approaches infinity.
            </p>
          </div>

          <div className="rel-formula-block">
            <span className="rel-formula-code">T_H = ℏc³ / (8πGMk_B)</span>
            <p className="rel-formula-explanation">
              <strong>Hawking Temperature:</strong> Black holes are blackbody radiators emitting quantum Hawking radiation at {hawkingTempKelvin.toExponential(2)} K. Lower mass holes burn hotter and evaporate exponentially faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RelativityLab;
