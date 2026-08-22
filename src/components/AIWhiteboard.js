import React, { useRef, useEffect, useState } from 'react';
import '../styles/Whiteboard.css';

function AIWhiteboard({ topic, onBack }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [brushColor, setBrushColor] = useState('#667eea');
  const [brushSize, setBrushSize] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      setContext(ctx);

      // Draw initial background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const startDrawing = (e) => {
    if (!context) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);

    // Particle effect on start
    createParticles(x, y);
  };

  const draw = (e) => {
    if (!isDrawing || !context) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    context.lineTo(x, y);
    context.stroke();

    // Glow effect
    context.shadowColor = brushColor;
    context.shadowBlur = 5;
  };

  const stopDrawing = () => {
    if (context) {
      context.closePath();
      context.shadowColor = 'transparent';
    }
    setIsDrawing(false);
  };

  const createParticles = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.className = 'canvas-particle';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.background = brushColor;
      canvas.parentElement.appendChild(particle);

      setTimeout(() => particle.remove(), 800);
    }
  };

  const clearCanvas = () => {
    if (context) {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const animateExplanation = () => {
    setShowAnimation(true);
    // Simulate AI drawing explanation
    const steps = [
      { text: 'Drawing concept...', delay: 500 },
      { text: 'Animating relationships...', delay: 1500 },
      { text: 'Explaining step-by-step...', delay: 2500 },
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setAnimationStep(idx + 1);
      }, step.delay);
    });

    setTimeout(() => {
      setShowAnimation(false);
    }, 3500);
  };

  return (
    <div className="learn-container">
      <div className="learn-header">
        <button className="learn-back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>✨ AI Whiteboard</h1>
        <div style={{ width: '60px' }}></div>
      </div>

      <div className="whiteboard-container">
        <div className="whiteboard-canvas-wrapper">
          <canvas
            ref={canvasRef}
            className="whiteboard-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />

          {showAnimation && (
            <div className="whiteboard-animation">
              <div className="animation-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>AI is visualizing {topic?.name}...</p>
            </div>
          )}
        </div>

        <div className="whiteboard-controls">
          <div className="control-group">
            <label>Brush Color</label>
            <div className="color-picker">
              {['#667eea', '#764ba2', '#1D9E75', '#FF6B6B', '#FFA500', '#000000'].map(
                (color) => (
                  <button
                    key={color}
                    className={`color-btn ${brushColor === color ? 'active' : ''}`}
                    style={{ background: color }}
                    onClick={() => setBrushColor(color)}
                  />
                )
              )}
            </div>
          </div>

          <div className="control-group">
            <label>Brush Size: {brushSize}px</label>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(e.target.value)}
              className="size-slider"
            />
          </div>

          <button className="btn-clear" onClick={clearCanvas}>
            🗑️ Clear Canvas
          </button>

          <button className="btn-ai-draw" onClick={animateExplanation}>
            ✨ Let AI Visualize
          </button>
        </div>

        <div className="whiteboard-info">
          <h3>💡 How to use:</h3>
          <p>• Draw diagrams, graphs, or mind maps freely</p>
          <p>• Use the AI button to get an animated explanation</p>
          <p>• Save your whiteboard work to your portfolio</p>
        </div>
      </div>
    </div>
  );
}

export default AIWhiteboard;