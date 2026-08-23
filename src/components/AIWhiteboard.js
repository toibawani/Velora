import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/Whiteboard.css';

/**
 * Interactive Concept & Derivation Whiteboard
 * 
 * High-performance 2D Canvas whiteboard for drafting mathematical proofs,
 * physics vector diagrams, and geometry with preset scientific templates.
 */

const PRESETS = [
  {
    id: 'spacetime-curvature',
    name: 'Spacetime Curvature Grid',
    desc: 'Radial grid depression modeling gravitational mass',
    draw: (ctx, w, h) => {
      ctx.strokeStyle = 'rgba(29, 155, 240, 0.4)';
      ctx.lineWidth = 1;
      const cx = w / 2;
      const cy = h / 2;
      for (let r = 20; r < Math.min(w, h) / 2; r += 25) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * (w / 2), cy + Math.sin(angle) * (h / 2));
        ctx.stroke();
      }
      // Central mass point
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  {
    id: 'harmonic-wave',
    name: 'Harmonic Wave Superposition',
    desc: 'Dual sinusoidal waveforms showing constructive phase',
    draw: (ctx, w, h) => {
      ctx.lineWidth = 2;
      const cy = h / 2;
      // Axis
      ctx.strokeStyle = 'rgba(113, 118, 123, 0.4)';
      ctx.beginPath();
      ctx.moveTo(40, cy);
      ctx.lineTo(w - 40, cy);
      ctx.stroke();

      // Wave 1
      ctx.strokeStyle = '#1d9bf0';
      ctx.beginPath();
      for (let x = 40; x < w - 40; x++) {
        const y = cy + Math.sin((x - 40) * 0.03) * 40;
        if (x === 40) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wave 2 (Superposition result)
      ctx.strokeStyle = '#00ba7c';
      ctx.beginPath();
      for (let x = 40; x < w - 40; x++) {
        const y = cy + Math.sin((x - 40) * 0.03) * 60;
        if (x === 40) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
];

const COLORS = [
  { label: 'White/Ink', value: 'var(--text-primary)' },
  { label: 'Blue', value: '#1d9bf0' },
  { label: 'Green', value: '#00ba7c' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Red', value: '#f4212e' },
];

function AIWhiteboard({ topic, onBack }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tool, setTool] = useState('pen'); // 'pen' | 'line' | 'arrow' | 'eraser'
  const [strokeColor, setStrokeColor] = useState('#1d9bf0');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [analysisActive, setAnalysisActive] = useState(false);

  // Setup HiDPI Canvas
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  useEffect(() => {
    setupCanvas();
    const handleResize = () => setupCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setupCanvas]);

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    const { x, y } = getCanvasCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = strokeWidth * 6;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = strokeColor === 'var(--text-primary)' ? '#f7f9f9' : strokeColor;
      ctx.lineWidth = strokeWidth;
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.closePath();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const loadPreset = (preset) => {
    handleClear();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    preset.draw(ctx, rect.width, rect.height);
  };

  return (
    <div className="whiteboard-screen">
      {/* Header */}
      <header className="wb-navbar">
        <div className="wb-nav-left">
          <button className="wb-back-btn" onClick={onBack}>
            ← Back
          </button>
          <div className="wb-title-col">
            <h1 className="wb-title">Analytical Canvas & Proof Board</h1>
            <span className="wb-sub">Topic: {topic?.name || 'Fundamental Physics & Geometry'}</span>
          </div>
        </div>

        <div className="wb-nav-actions">
          <button
            className={`wb-analyze-btn ${analysisActive ? 'active' : ''}`}
            onClick={() => setAnalysisActive(!analysisActive)}
          >
            {analysisActive ? 'Hide Proof Notes' : 'Open Proof Notes'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="wb-workspace-layout">
        {/* Left Toolbar */}
        <aside className="wb-toolbar-panel">
          <div className="toolbar-section">
            <span className="toolbar-label">Tools</span>
            <div className="tool-buttons-stack">
              <button
                className={`wb-tool-btn ${tool === 'pen' ? 'active' : ''}`}
                onClick={() => setTool('pen')}
                title="Pen / Stylus"
              >
                ✏️ Pen
              </button>
              <button
                className={`wb-tool-btn ${tool === 'eraser' ? 'active' : ''}`}
                onClick={() => setTool('eraser')}
                title="Eraser"
              >
                🧹 Eraser
              </button>
            </div>
          </div>

          <div className="toolbar-section">
            <span className="toolbar-label">Color</span>
            <div className="color-swatches-grid">
              {COLORS.map((c, idx) => (
                <button
                  key={idx}
                  className={`color-swatch-btn ${strokeColor === c.value ? 'active' : ''}`}
                  style={{ backgroundColor: c.value === 'var(--text-primary)' ? '#ffffff' : c.value }}
                  onClick={() => setStrokeColor(c.value)}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="toolbar-section">
            <span className="toolbar-label">Stroke Width ({strokeWidth}px)</span>
            <input
              type="range"
              min="1"
              max="8"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="stroke-slider"
            />
          </div>

          <div className="toolbar-section">
            <span className="toolbar-label">Scientific Presets</span>
            <div className="preset-buttons-stack">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  className="preset-btn"
                  onClick={() => loadPreset(p)}
                >
                  <span className="preset-name">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button className="wb-clear-btn" onClick={handleClear}>
            Clear Canvas
          </button>
        </aside>

        {/* Center Drawing Canvas */}
        <section className="wb-canvas-container" ref={containerRef}>
          <canvas
            ref={canvasRef}
            className="wb-canvas-element"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </section>

        {/* Right Proof & Derivation Notes Drawer */}
        {analysisActive && (
          <aside className="wb-analysis-drawer">
            <div className="drawer-header">
              <h3 className="drawer-title">Analytical Formalism</h3>
              <button className="drawer-close" onClick={() => setAnalysisActive(false)}>✕</button>
            </div>

            <div className="derivation-step-box">
              <span className="step-tag">Lemma 1: Metric Invariance</span>
              <p className="step-text">
                {"Under coordinate transformation x'^μ = Λ^μ_ν x^ν, the spacetime interval ds² = g_μν dx^μ dx^ν remains invariant."}
              </p>
              <code className="step-code">{"g'_{αβ} = (∂x^μ / ∂x'^α) (∂x^ν / ∂x'^β) g_μν"}</code>
            </div>

            <div className="derivation-step-box">
              <span className="step-tag">Lemma 2: Geodesic Equation</span>
              <p className="step-text">
                {"Freely falling test particles follow extremal proper time curves parameterized by affine parameter λ:"}
              </p>
              <code className="step-code">{"(d²x^μ / dλ²) + Γ^μ_{αβ} (dx^α / dλ) (dx^β / dλ) = 0"}</code>
            </div>

            <div className="key-takeaways-block">
              <h4>Key Insights:</h4>
              <ul>
                <li>Spacetime curvature dictates the Christoffel symbols Γ^μ_αβ.</li>
                <li>In flat Minkowski space, all connection coefficients vanish and straight paths are recovered.</li>
              </ul>
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}

export default AIWhiteboard;