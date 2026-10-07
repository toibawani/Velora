import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/BlackHoleMastery.css';

/**
 * The decorative accretion disk behind the black hole reader.
 *
 * Extracted from BlackHoleMastery with the body moved unchanged, so the
 * reduced-motion guarantee stays exactly where it was rather than being lost in
 * a rewrite of the screen around it. The guarantee: never start a loop when the
 * visitor has asked for reduced motion, draw one frame so there is a black hole
 * rather than a blank canvas, and start or stop when the preference changes
 * mid-session.
 *
 * BlackHoleMastery.motion.test.jsx covers this by counting requestAnimationFrame
 * calls, because jsdom has no canvas backend and pixels cannot be read.
 */
function BlackHoleCanvas({ className = 'black-hole-canvas' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Precision high-performance canvas simulation for gravitation & photon ring
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationId;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    // Stable pre-allocated particle array to avoid garbage collection churn
    const PARTICLE_COUNT = 40;
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      baseAngle: (i / PARTICLE_COUNT) * Math.PI * 2,
      distOffset: (i % 5) * 12,
      speed: 0.008 + (i % 3) * 0.004,
      size: 1 + (i % 2) * 1.5,
      alpha: 0.3 + (i % 4) * 0.15
    }));

    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;
      dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    let time = 0;
    let isRunning = true;

    // This canvas is the one animation in the bundle that never consulted
    // prefers-reduced-motion. RelativityLab, PhysicsSimulations and StackSpread
    // all check it; this one runs a permanent accretion-disk loop with a moving
    // grid, which is exactly the kind of continuous peripheral motion that
    // setting exists to stop. With motion reduced we still draw one frame, so
    // the black hole is there rather than being a blank canvas.
    const motionQuery =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    let pausedForMotion = motionQuery ? motionQuery.matches : false;
    if (pausedForMotion) isRunning = false;

    const render = () => {
      if (!isRunning) return;

      // Dark matte canvas clear (no heavy radial gradient recreation per frame)
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.max(60, Math.min(width, height) / 5);

      // Distant subtle grid/field lines
      ctx.strokeStyle = '#12171f';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = (time * 0.5) % 40; x < width; x += 40) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      ctx.stroke();

      // Accretion disk (Clean Keplerian thin ellipses)
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius * 1.8, radius * 0.45, -0.2, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(29, 155, 240, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius * 1.4, radius * 0.35, -0.2, 0, Math.PI * 2);
      ctx.stroke();

      // Gravitational shadow & Event Horizon
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Sharp Photon Ring (Einstein ring definition)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 1, 0, Math.PI * 2);
      ctx.stroke();

      // Pre-allocated orbiting matter particles
      ctx.fillStyle = '#f7f9f9';
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        const angle = (p.baseAngle + time * p.speed) % (Math.PI * 2);
        const dist = radius + 24 + p.distOffset;
        const px = centerX + Math.cos(angle - 0.2) * dist;
        const py = centerY + Math.sin(angle) * (dist * 0.35);

        ctx.globalAlpha = p.alpha;
        ctx.fillRect(px - p.size / 2, py - p.size / 2, p.size, p.size);
      }
      ctx.globalAlpha = 1.0;

      time++;
      // renderOnce() deliberately runs with isRunning forced true; without this
      // guard that single frame schedules a follow-up and the loop starts anyway.
      if (!pausedForMotion) animationId = requestAnimationFrame(render);
    };

    // One frame with no follow-up request, so a reduced-motion visitor still
    // sees the rendered system rather than a cleared canvas.
    const renderOnce = () => {
      const wasRunning = isRunning;
      isRunning = true;
      render();
      isRunning = wasRunning;
    };

    if (pausedForMotion) {
      renderOnce();
    } else {
      render();
    }

    const onMotionPrefChange = (event) => {
      pausedForMotion = event.matches;
      if (pausedForMotion) {
        isRunning = false;
        cancelAnimationFrame(animationId);
        renderOnce();
      } else if (!document.hidden) {
        isRunning = true;
        animationId = requestAnimationFrame(render);
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationId);
      } else if (!pausedForMotion) {
        isRunning = true;
        animationId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    if (motionQuery && motionQuery.addEventListener) {
      motionQuery.addEventListener('change', onMotionPrefChange);
    }

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      if (motionQuery && motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', onMotionPrefChange);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="bhm-canvas-wrap" aria-hidden="true">
      <canvas ref={canvasRef} className={className} />
    </div>
  );
}

export default BlackHoleCanvas;
