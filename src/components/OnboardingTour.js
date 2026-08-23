import React, { useState } from 'react';
import '../styles/OnboardingTour.css';

/**
 * OnboardingTour Component
 *
 * A 5-step guided first-run experience for new users:
 * 1. Welcome & Philosophy (sets the tone vs. boring edtech)
 * 2. Choose Your Domain (personalizes subject interest)
 * 3. Pick Your Learning Style (visual / textual / interactive)
 * 4. Set Your Daily Learning Intention (time & goal)
 * 5. Take Your First Daily Spark
 *
 * Stored in localStorage to never show twice.
 */

const STEPS = [
  {
    id: 'welcome',
    illustration: '🌌',
    title: 'Welcome to VELORA.',
    subtitle: 'This is not a boring education app.',
    body: 'VELORA is a living intellectual cosmos. You don\'t passively watch videos here — you explore, discover, and synthesize ideas across physics, philosophy, and history. Expect to feel genuinely absorbed.',
    cta: 'I\'m ready →'
  },
  {
    id: 'domain',
    illustration: '🔭',
    title: 'Which domain calls to you?',
    subtitle: 'Pick the universe you want to start exploring.',
    body: null,
    cta: 'Set My Domain →',
    options: [
      { id: 'physics', label: 'Astrophysics', emoji: '🌑', desc: 'Black holes, relativity, cosmology' },
      { id: 'philosophy', label: 'Philosophy', emoji: '🏛️', desc: 'Socrates, logic, epistemology' },
      { id: 'history', label: 'History', emoji: '📜', desc: 'Civilizations, revolutions, ideas' },
      { id: 'mathematics', label: 'Mathematics', emoji: '📐', desc: 'Proofs, number theory, geometry' },
    ]
  },
  {
    id: 'style',
    illustration: '⚡',
    title: 'How do you learn best?',
    subtitle: 'VELORA adapts to your cognitive style.',
    body: null,
    cta: 'Personalize →',
    options: [
      { id: 'visual', label: 'Visual', emoji: '👁️', desc: 'Animated diagrams & canvas simulations' },
      { id: 'textual', label: 'Textual', emoji: '📖', desc: 'Deep-read articles & paper distillations' },
      { id: 'interactive', label: 'Interactive', emoji: '🎮', desc: 'Quizzes, flow games & debates' },
    ]
  },
  {
    id: 'intention',
    illustration: '🌅',
    title: 'Set your daily learning intention.',
    subtitle: 'How much time do you want to spend exploring today?',
    body: 'VELORA doesn\'t reward streaks or punish misses. Learning is personal — this is your commitment to yourself.',
    cta: 'Lock In My Intention →',
    timeOptions: ['15 minutes', '30 minutes', '1 hour', 'As long as it takes']
  },
  {
    id: 'spark',
    illustration: '✦',
    title: 'You\'re ready to explore.',
    subtitle: 'Your intellectual cosmos awaits.',
    body: 'Every day VELORA surfaces a Daily Spark — a single question that opens an entire universe of thought. Your first one is waiting. Go discover something extraordinary.',
    cta: 'Enter the Cosmos →'
  }
];

function OnboardingTour({ onComplete, setSelectedSubject }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedTime, setSelectedTime] = useState('30 minutes');

  const step = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;

  const handleNext = () => {
    if (step.id === 'domain' && selectedDomain) {
      setSelectedSubject?.(selectedDomain);
    }
    if (isLast) {
      localStorage.setItem('velora_onboarding_done', '1');
      onComplete?.();
    } else {
      setStepIdx(prev => prev + 1);
    }
  };

  const canProceed = () => {
    if (step.id === 'domain') return !!selectedDomain;
    if (step.id === 'style') return !!selectedStyle;
    return true;
  };

  const progress = ((stepIdx + 1) / STEPS.length) * 100;

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card">
        {/* Progress Bar */}
        <div className="onboarding-progress-track">
          <div className="onboarding-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Step Counter */}
        <div className="onboarding-step-counter">
          Step {stepIdx + 1} of {STEPS.length}
        </div>

        {/* Illustration */}
        <div className="onboarding-illustration">{step.illustration}</div>

        {/* Text */}
        <div className="onboarding-text-block">
          <h2 className="onboarding-title">{step.title}</h2>
          <p className="onboarding-subtitle">{step.subtitle}</p>
          {step.body && <p className="onboarding-body">{step.body}</p>}
        </div>

        {/* Domain Picker */}
        {step.id === 'domain' && (
          <div className="onboarding-options-grid">
            {step.options.map(opt => (
              <button
                key={opt.id}
                className={`onboarding-option-card ${selectedDomain === opt.id ? 'selected' : ''}`}
                onClick={() => setSelectedDomain(opt.id)}
              >
                <span className="opt-emoji">{opt.emoji}</span>
                <span className="opt-label">{opt.label}</span>
                <span className="opt-desc">{opt.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Learning Style Picker */}
        {step.id === 'style' && (
          <div className="onboarding-options-grid three-col">
            {step.options.map(opt => (
              <button
                key={opt.id}
                className={`onboarding-option-card ${selectedStyle === opt.id ? 'selected' : ''}`}
                onClick={() => setSelectedStyle(opt.id)}
              >
                <span className="opt-emoji">{opt.emoji}</span>
                <span className="opt-label">{opt.label}</span>
                <span className="opt-desc">{opt.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Time Intention Picker */}
        {step.id === 'intention' && (
          <div className="onboarding-time-options">
            {step.timeOptions.map(t => (
              <button
                key={t}
                className={`time-option-btn ${selectedTime === t ? 'selected' : ''}`}
                onClick={() => setSelectedTime(t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* CTA */}
        <button
          className="onboarding-cta-btn"
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {isLast ? '✦ ' : ''}{step.cta}
        </button>

        {stepIdx > 0 && !isLast && (
          <button
            className="onboarding-skip-link"
            onClick={() => { localStorage.setItem('velora_onboarding_done', '1'); onComplete?.(); }}
          >
            Skip setup
          </button>
        )}
      </div>
    </div>
  );
}

export default OnboardingTour;
