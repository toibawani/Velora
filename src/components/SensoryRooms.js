import React, { useState, useEffect, useRef } from 'react';
import '../styles/SensoryRooms.css';

/**
 * SensoryRooms Component
 * 
 * High-performance, zero-dependency ambient soundscape generator and deep focus chamber.
 * Uses the native Web Audio API for harmonic drone generation, 10Hz binaural alpha waves,
 * and Brownian noise study isolation.
 */
function SensoryRooms({ topic, onBack }) {
  // Web Audio Context reference
  const audioCtxRef = useRef(null);

  // Active sound state
  const [activeSounds, setActiveSounds] = useState({
    drone: false,
    binaural: false,
    brownNoise: false,
  });

  // Sound volume levels (0 to 1)
  const [volumes, setVolumes] = useState({
    drone: 0.4,
    binaural: 0.35,
    brownNoise: 0.25,
  });

  // Audio Node references for live parameter manipulation
  const soundNodesRef = useRef({
    drone: null,
    binaural: null,
    brownNoise: null,
  });

  // Pomodoro Focus Timer State (25 minutes = 1500s)
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Box Breathing cycle state: 'inhale' | 'hold' | 'exhale' | 'pause'
  const [breathPhase, setBreathPhase] = useState('inhale');

  // Initialize or resume AudioContext on user interaction
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtxRef.current = new AudioCtxClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Toggle Cosmic 432Hz Drone
  const toggleDrone = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (activeSounds.drone) {
      // Stop Drone
      if (soundNodesRef.current.drone) {
        soundNodesRef.current.drone.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        setTimeout(() => {
          try {
            soundNodesRef.current.drone.osc1.stop();
            soundNodesRef.current.drone.oscSub.stop();
            soundNodesRef.current.drone = null;
          } catch (e) {}
        }, 350);
      }
      setActiveSounds((prev) => ({ ...prev, drone: false }));
    } else {
      // Start Cosmic Drone (432Hz fundamental + 108Hz sub-bass through low-pass biquad filter)
      const osc1 = ctx.createOscillator();
      const oscSub = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(432, ctx.currentTime);

      oscSub.type = 'sine';
      oscSub.frequency.setValueAtTime(108, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volumes.drone * 0.5, ctx.currentTime + 0.8);

      osc1.connect(filter);
      oscSub.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      oscSub.start();

      soundNodesRef.current.drone = { osc1, oscSub, gain };
      setActiveSounds((prev) => ({ ...prev, drone: true }));
    }
  };

  // Toggle 10Hz Binaural Alpha Beat (Stereo separation: 216Hz Left, 226Hz Right)
  const toggleBinaural = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (activeSounds.binaural) {
      if (soundNodesRef.current.binaural) {
        soundNodesRef.current.binaural.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        setTimeout(() => {
          try {
            soundNodesRef.current.binaural.oscL.stop();
            soundNodesRef.current.binaural.oscR.stop();
            soundNodesRef.current.binaural = null;
          } catch (e) {}
        }, 350);
      }
      setActiveSounds((prev) => ({ ...prev, binaural: false }));
    } else {
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      const merger = ctx.createChannelMerger(2);
      const gain = ctx.createGain();

      oscL.type = 'sine';
      oscL.frequency.setValueAtTime(216, ctx.currentTime); // Left ear

      oscR.type = 'sine';
      oscR.frequency.setValueAtTime(226, ctx.currentTime); // Right ear (10Hz delta = Alpha state)

      // Connect L to channel 0 and R to channel 1
      oscL.connect(merger, 0, 0);
      oscR.connect(merger, 0, 1);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volumes.binaural * 0.4, ctx.currentTime + 0.8);

      merger.connect(gain);
      gain.connect(ctx.destination);

      oscL.start();
      oscR.start();

      soundNodesRef.current.binaural = { oscL, oscR, gain };
      setActiveSounds((prev) => ({ ...prev, binaural: true }));
    }
  };

  // Toggle Synthesized Brownian Noise
  const toggleBrownNoise = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (activeSounds.brownNoise) {
      if (soundNodesRef.current.brownNoise) {
        soundNodesRef.current.brownNoise.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        setTimeout(() => {
          try {
            soundNodesRef.current.brownNoise.source.stop();
            soundNodesRef.current.brownNoise = null;
          } catch (e) {}
        }, 350);
      }
      setActiveSounds((prev) => ({ ...prev, brownNoise: false }));
    } else {
      // Generate 5 seconds of procedural Brownian noise in an audio buffer
      const bufferSize = ctx.sampleRate * 5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Gain compensation
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volumes.brownNoise * 0.35, ctx.currentTime + 0.8);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start();

      soundNodesRef.current.brownNoise = { source, gain };
      setActiveSounds((prev) => ({ ...prev, brownNoise: true }));
    }
  };

  // Handle Volume Change
  const handleVolumeChange = (key, val) => {
    setVolumes((prev) => ({ ...prev, [key]: val }));
    const node = soundNodesRef.current[key];
    if (node && node.gain && audioCtxRef.current) {
      node.gain.linearRampToValueAtTime(val * 0.5, audioCtxRef.current.currentTime + 0.05);
    }
  };

  // Breathing pacer cycle (4s inhale, 4s hold, 4s exhale, 4s hold)
  useEffect(() => {
    const phases = ['inhale', 'hold', 'exhale', 'hold'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % phases.length;
      setBreathPhase(phases[idx]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Pomodoro Focus Countdown Timer
  useEffect(() => {
    let timer;
    if (isTimerRunning && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, secondsRemaining]);

  // Clean up Web Audio on component unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="sensory-chamber-container">
      {/* Header */}
      <header className="sr-header">
        <div>
          <button className="sr-back-btn" onClick={onBack}>
            ← Back to Learn
          </button>
          <h1 className="sr-title">
            <span>🏛️</span> Deep Focus Sensory Room
          </h1>
          <p className="sr-subtitle">
            Acoustic resonance and cognitive isolation designed for effortless scientific flow state.
          </p>
        </div>
      </header>

      {/* Main Grid */}
      <div className="sr-grid">
        {/* Respiration Aura & Focus Timer */}
        <div className="sr-aura-card">
          <div className="sr-aura-ring-wrapper">
            <div className={`sr-aura-ring ${breathPhase}`} />
            <div className="sr-timer-center">
              <span className="sr-timer-digits">{formatTimer(secondsRemaining)}</span>
              <span className="sr-breath-cue">{breathPhase}</span>
            </div>
          </div>

          <div className="sr-timer-controls">
            <button
              className="sr-btn-primary"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? 'Pause Session' : 'Start Focus Block'}
            </button>
            <button
              className="sr-btn-secondary"
              onClick={() => {
                setIsTimerRunning(false);
                setSecondsRemaining(25 * 60);
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Web Audio Synthesizer Deck */}
        <div className="sr-synth-card">
          <h2 className="sr-card-title">
            <span>Acoustic Frequency Channels</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 'normal' }}>
              Zero Latency Audio
            </span>
          </h2>

          <div className="sr-soundscape-list">
            {/* 432Hz Drone */}
            <div className={`sr-sound-row ${activeSounds.drone ? 'active' : ''}`}>
              <div className="sr-sound-info">
                <span className="sr-sound-icon">🌌</span>
                <div>
                  <h3 className="sr-sound-name">Cosmic Harmonic (432 Hz)</h3>
                  <p className="sr-sound-desc">Deep resonant fundamental + 108Hz grounding sub-bass</p>
                </div>
              </div>
              <div className="sr-sound-actions">
                <div className="sr-slider-wrapper">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volumes.drone}
                    onChange={(e) => handleVolumeChange('drone', parseFloat(e.target.value))}
                    className="sr-volume-slider"
                  />
                </div>
                <button
                  className={`sr-toggle-btn ${activeSounds.drone ? 'playing' : ''}`}
                  onClick={toggleDrone}
                >
                  {activeSounds.drone ? 'Active' : 'Play'}
                </button>
              </div>
            </div>

            {/* 10Hz Binaural Alpha */}
            <div className={`sr-sound-row ${activeSounds.binaural ? 'active' : ''}`}>
              <div className="sr-sound-info">
                <span className="sr-sound-icon">🎧</span>
                <div>
                  <h3 className="sr-sound-name">Binaural Alpha Waves (10 Hz)</h3>
                  <p className="sr-sound-desc">Stereo pulse entraining calm focus (Headphones recommended)</p>
                </div>
              </div>
              <div className="sr-sound-actions">
                <div className="sr-slider-wrapper">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volumes.binaural}
                    onChange={(e) => handleVolumeChange('binaural', parseFloat(e.target.value))}
                    className="sr-volume-slider"
                  />
                </div>
                <button
                  className={`sr-toggle-btn ${activeSounds.binaural ? 'playing' : ''}`}
                  onClick={toggleBinaural}
                >
                  {activeSounds.binaural ? 'Active' : 'Play'}
                </button>
              </div>
            </div>

            {/* Brownian Noise */}
            <div className={`sr-sound-row ${activeSounds.brownNoise ? 'active' : ''}`}>
              <div className="sr-sound-info">
                <span className="sr-sound-icon">🌊</span>
                <div>
                  <h3 className="sr-sound-name">Deep Brownian Noise</h3>
                  <p className="sr-sound-desc">Low-frequency acoustic blanket masking environmental distraction</p>
                </div>
              </div>
              <div className="sr-sound-actions">
                <div className="sr-slider-wrapper">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volumes.brownNoise}
                    onChange={(e) => handleVolumeChange('brownNoise', parseFloat(e.target.value))}
                    className="sr-volume-slider"
                  />
                </div>
                <button
                  className={`sr-toggle-btn ${activeSounds.brownNoise ? 'playing' : ''}`}
                  onClick={toggleBrownNoise}
                >
                  {activeSounds.brownNoise ? 'Active' : 'Play'}
                </button>
              </div>
            </div>
          </div>

          <div className="sr-notice-banner">
            <span>💡</span>
            <span>
              All audio is generated procedurally in your browser using mathematical oscillators. No external audio streams or bandwidth required.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SensoryRooms;