import React, { useState } from 'react';
import { Orbit, Telescope, Zap, Sunrise, Sparkles, Moon, Landmark, ScrollText, Ruler, Eye, BookOpen, Gamepad2 } from 'lucide-react';
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

const ONBOARDING_KEY = 'velora_onboarding_done';

const markOnboardingComplete = () => {
  try {
    localStorage.setItem(ONBOARDING_KEY, '1');
  } catch {
    // Onboarding should still complete when storage is unavailable.
  }
};

const STEPS = [
  {
    id: 'welcome',
    illustration: Orbit,
    title: 'Welcome to VELORA.',
    subtitle: 'This is not a boring education app.',
    body: 'VELORA is a living intellectual cosmos. You don\'t passively watch videos here — you explore, discover, and synthesize ideas across physics, philosophy, and history. Expect to feel genuinely absorbed.',
    cta: 'I\'m ready →'
  },
  {
    id: 'domain',
    illustration: Telescope,
    title: 'Which domain calls to you?',
    subtitle: 'Pick the universe you want to start exploring.',
    body: null,
    cta: 'Set My Domain →',
    options: [
      { id: 'physics', label: 'Astrophysics', icon: Moon, desc: 'Black holes, relativity, cosmology' },
      { id: 'philosophy', label: 'Philosophy', icon: Landmark, desc: 'Socrates, logic, epistemology' },
      { id: 'history', label: 'History', icon: ScrollText, desc: 'Civilizations, revolutions, ideas' },
      { id: 'mathematics', label: 'Mathematics', icon: Ruler, desc: 'Proofs, number theory, geometry' },
    ]
  },
  {
    id: 'style',
    illustration: Zap,
    title: 'How do you learn best?',
    subtitle: 'VELORA adapts to your cognitive style.',
    body: null,
    cta: 'Personalize →',
    options: [
      { id: 'visual', label: 'Visual', icon: Eye, desc: 'Animated diagrams & canvas simulations' },
      { id: 'textual', label: 'Textual', icon: BookOpen, desc: 'Deep-read articles & paper distillations' },
      { id: 'interactive', label: 'Interactive', icon: Gamepad2, desc: 'Quizzes, flow games & debates' },
    ]
  },
  {
    id: 'intention',
    illustration: Sunrise,
    title: 'Set your daily learning intention.',
    subtitle: 'How much time do you want to spend exploring today?',
    body: 'VELORA doesn\'t reward streaks or punish misses. Learning is personal — this is your commitment to yourself.',
    cta: 'Lock In My Intention →',
    timeOptions: ['15 minutes', '30 minutes', '1 hour', 'As long as it takes']
  },
  {
    id: 'spark',
    illustration: Sparkles,
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

  const persistPreferences = (domain, style, time) => {
    try {
      localStorage.setItem('velora_onboarding_preferences', JSON.stringify({ domain, style, time }));
    } catch {
      // The flow remains usable if storage is unavailable.
    }
  };

  const handleNext = () => {
    if (step.id === 'domain' && selectedDomain) {
      setSelectedSubject?.(selectedDomain);
    }
    if (isLast) {
      persistPreferences(selectedDomain, selectedStyle, selectedTime);
      markOnboardingComplete();
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

  const Illustration = step.illustration;

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
        <div className="onboarding-illustration"><Illustration size={40} aria-hidden="true" /></div>

        {/* Text */}
        <div className="onboarding-text-block">
          <h2 className="onboarding-title">{step.title}</h2>
          <p className="onboarding-subtitle">{step.subtitle}</p>
          {step.body && <p className="onboarding-body">{step.body}</p>}
        </div>

        {/* Domain Picker */}
        {step.id === 'domain' && (
          <div className="onboarding-options-grid">
            {step.options.map(({ id, label, desc, icon: OptionIcon }) => (
              <button
                key={id}
                className={`onboarding-option-card ${selectedDomain === id ? 'selected' : ''}`}
                 aria-pressed={selectedDomain === id}
                onClick={() => setSelectedDomain(id)}
              >
                <span className="opt-emoji"><OptionIcon size={22} aria-hidden="true" /></span>
                <span className="opt-label">{label}</span>
                <span className="opt-desc">{desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Learning Style Picker */}
        {step.id === 'style' && (
          <div className="onboarding-options-grid three-col">
            {step.options.map(({ id, label, desc, icon: OptionIcon }) => (
              <button
                key={id}
                className={`onboarding-option-card ${selectedStyle === id ? 'selected' : ''}`}
                 aria-pressed={selectedStyle === id}
                onClick={() => setSelectedStyle(id)}
              >
                <span className="opt-emoji"><OptionIcon size={22} aria-hidden="true" /></span>
                <span className="opt-label">{label}</span>
                <span className="opt-desc">{desc}</span>
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
                 aria-pressed={selectedTime === t}
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
          {isLast && <Sparkles size={13} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 5 }} />}{step.cta}
        </button>

        {stepIdx > 0 && !isLast && (
          <button
            className="onboarding-skip-link"
            onClick={() => { markOnboardingComplete(); onComplete?.(); }}
          >
            Skip setup
          </button>
        )}
      </div>
    </div>
  );
}

export default OnboardingTour;
