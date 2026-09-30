import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import '../styles/Auth.css';

/**
 * Registration form rebuilt as a proper 3-step flow:
 * Step 1: Personal info (name, email, phone)
 * Step 2: Account setup (username, password with strength meter)
 * Step 3: Preferences (subjects, learning goals)
 *
 * Each step has its own validation state, errors are announced via aria-live,
 * and the password meter never blocks paste (password managers rely on it).
 */

interface StepState {
  values: Record<string, string>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

interface RegisterProps {
  setScreen: (screen: string) => void;
  onRegister: (email: string, password: string, name: string, phone?: string, preferences?: Record<string, any>) => void;
  showToast: (message: string, type: 'info' | 'success' | 'error') => void;
}

const SUBJECTS = [
  { id: 'physics', name: 'Physics' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'biology', name: 'Biology' },
  { id: 'philosophy', name: 'Philosophy' },
  { id: 'history', name: 'History' },
  { id: 'political-science', name: 'Political Science' },
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'psychology', name: 'Psychology' },
  { id: 'economics', name: 'Economics' },
];

const LEARNING_GOALS = [
  { id: 'curiosity', name: 'Pure curiosity and exploration' },
  { id: 'exam', name: 'Preparing for exams' },
  { id: 'career', name: 'Career development' },
  { id: 'teaching', name: 'Teaching others' },
  { id: 'research', name: 'Academic research' },
];

// Simple validation functions (Zod would be better but avoiding new deps)
const validateEmail = (email: string): string => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return '';
};

const validatePhone = (phone: string): string => {
  if (!phone) return ''; // Phone is optional
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
  return '';
};

const validateName = (name: string): string => {
  if (!name.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
};

const validateUsername = (username: string): string => {
  if (!username.trim()) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
  return '';
};

const validatePassword = (password: string): string => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return '';
};

// Password strength calculator (0-4 scale)
const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return Math.min(strength, 4);
};

const getStrengthLabel = (strength: number): { label: string; color: string } => {
  const labels = [
    { label: 'Weak', color: 'var(--color-error)' },
    { label: 'Fair', color: 'var(--color-warning)' },
    { label: 'Good', color: '#8C4A2F' },
    { label: 'Strong', color: 'var(--color-success)' },
    { label: 'Very Strong', color: 'var(--color-success)' },
  ];
  return labels[strength] || labels[0];
};

function Register({ setScreen, onRegister, showToast }: RegisterProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const step1Ref = useRef<HTMLHeadingElement>(null);
  const step2Ref = useRef<HTMLHeadingElement>(null);
  const step3Ref = useRef<HTMLHeadingElement>(null);

  // Step 1: Personal info
  const [step1, setStep1] = useState<StepState>({
    values: { name: '', email: '', phone: '' },
    errors: { name: '', email: '', phone: '' },
    touched: { name: false, email: false, phone: false },
  });

  // Step 2: Account setup
  const [step2, setStep2] = useState<StepState>({
    values: { username: '', password: '', confirmPassword: '' },
    errors: { username: '', password: '', confirmPassword: '' },
    touched: { username: false, password: false, confirmPassword: false },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 3: Preferences — selections live in dedicated arrays rather than a
  // StepState bag, because these are multi-select chips, not text fields.
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Focus management on step change
  useEffect(() => {
    const refs = [null, step1Ref, step2Ref, step3Ref];
    refs[currentStep]?.current?.focus();
  }, [currentStep]);

  const handleStep1Change = (field: string, value: string) => {
    setStep1((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      errors: {
        ...prev.errors,
        [field]: prev.touched[field] ? validateField(field, value) : '',
      },
    }));
  };

  const handleStep1Blur = (field: string) => {
    setStep1((prev) => ({
      ...prev,
      touched: { ...prev.touched, [field]: true },
      errors: { ...prev.errors, [field]: validateField(field, prev.values[field]) },
    }));
  };

  const handleStep2Change = (field: string, value: string) => {
    setStep2((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      errors: {
        ...prev.errors,
        [field]: prev.touched[field] ? validateStep2Field(field, value, prev.values) : '',
      },
    }));
  };

  const handleStep2Blur = (field: string) => {
    setStep2((prev) => ({
      ...prev,
      touched: { ...prev.touched, [field]: true },
      errors: { ...prev.errors, [field]: validateStep2Field(field, prev.values[field], prev.values) },
    }));
  };

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name': return validateName(value);
      case 'email': return validateEmail(value);
      case 'phone': return validatePhone(value);
      default: return '';
    }
  };

  const validateStep2Field = (field: string, value: string, allValues: Record<string, string>): string => {
    switch (field) {
      case 'username': return validateUsername(value);
      case 'password': return validatePassword(value);
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== allValues.password) return 'Passwords do not match';
        return '';
      default: return '';
    }
  };

  const validateStep1 = (): boolean => {
    const errors = {
      name: validateName(step1.values.name),
      email: validateEmail(step1.values.email),
      phone: validatePhone(step1.values.phone),
    };
    setStep1((prev) => ({ ...prev, errors, touched: { name: true, email: true, phone: true } }));
    return !Object.values(errors).some(Boolean);
  };

  const validateStep2 = (): boolean => {
    const errors = {
      username: validateUsername(step2.values.username),
      password: validatePassword(step2.values.password),
      confirmPassword: step2.values.confirmPassword !== step2.values.password ? 'Passwords do not match' : '',
    };
    setStep2((prev) => ({ ...prev, errors, touched: { username: true, password: true, confirmPassword: true } }));
    return !Object.values(errors).some(Boolean);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onRegister(
        step1.values.email.trim().toLowerCase(),
        step2.values.password,
        step1.values.name.trim(),
        step1.values.phone.trim() || undefined,
        {
          subjects: selectedSubjects,
          learningGoals: selectedGoals,
        }
      );
    } catch (error) {
      showToast('Registration failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = calculatePasswordStrength(step2.values.password);
  const strengthInfo = getStrengthLabel(passwordStrength);

  return (
    <div className="auth-container">
      <div className="auth-card auth-card--multi-step">
        {/* Step indicator */}
        <div className="step-indicator" role="navigation" aria-label="Registration progress">
          <div className="step-indicator-bar">
            <div 
              className="step-indicator-progress" 
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              aria-hidden="true"
            />
          </div>
          <div className="step-labels">
            <span className={`step-label ${currentStep >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-text">Personal Info</span>
            </span>
            <span className={`step-label ${currentStep >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-text">Account</span>
            </span>
            <span className={`step-label ${currentStep >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-text">Preferences</span>
            </span>
          </div>
        </div>

        <h1 className="auth-title">Join VELORA</h1>
        <p className="auth-subtitle">Start your intellectual exploration today</p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="step-content" role="group" aria-labelledby="step1-heading">
              <h2 id="step1-heading" ref={step1Ref} className="step-heading" tabIndex={-1}>
                Personal Information
              </h2>
              
              <div className="form-group">
                <label htmlFor="register-name">Full name</label>
                <input
                  id="register-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  value={step1.values.name}
                  onChange={(e) => handleStep1Change('name', e.target.value)}
                  onBlur={() => handleStep1Blur('name')}
                  aria-invalid={Boolean(step1.errors.name)}
                  aria-describedby={step1.errors.name ? 'register-name-error' : undefined}
                  required
                />
                {step1.errors.name && (
                  <span className="auth-field-error" id="register-name-error" role="alert">
                    {step1.errors.name}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="register-email">Email</label>
                <input
                  id="register-email"
                  name="email"
                  autoComplete="email"
                  type="email"
                  placeholder="you@example.com"
                  value={step1.values.email}
                  onChange={(e) => handleStep1Change('email', e.target.value)}
                  onBlur={() => handleStep1Blur('email')}
                  aria-invalid={Boolean(step1.errors.email)}
                  aria-describedby={step1.errors.email ? 'register-email-error' : undefined}
                  required
                />
                {step1.errors.email && (
                  <span className="auth-field-error" id="register-email-error" role="alert">
                    {step1.errors.email}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="register-phone">Phone (optional)</label>
                <input
                  id="register-phone"
                  name="phone"
                  autoComplete="tel"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={step1.values.phone}
                  onChange={(e) => handleStep1Change('phone', e.target.value)}
                  onBlur={() => handleStep1Blur('phone')}
                  aria-invalid={Boolean(step1.errors.phone)}
                  aria-describedby={step1.errors.phone ? 'register-phone-error' : undefined}
                />
                {step1.errors.phone && (
                  <span className="auth-field-error" id="register-phone-error" role="alert">
                    {step1.errors.phone}
                  </span>
                )}
              </div>

              <div className="step-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-full"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Account Setup */}
          {currentStep === 2 && (
            <div className="step-content" role="group" aria-labelledby="step2-heading">
              <h2 id="step2-heading" ref={step2Ref} className="step-heading" tabIndex={-1}>
                Account Setup
              </h2>

              <div className="form-group">
                <label htmlFor="register-username">Username</label>
                <input
                  id="register-username"
                  name="username"
                  autoComplete="username"
                  placeholder="username"
                  value={step2.values.username}
                  onChange={(e) => handleStep2Change('username', e.target.value)}
                  onBlur={() => handleStep2Blur('username')}
                  aria-invalid={Boolean(step2.errors.username)}
                  aria-describedby={step2.errors.username ? 'register-username-error' : undefined}
                  required
                />
                {step2.errors.username && (
                  <span className="auth-field-error" id="register-username-error" role="alert">
                    {step2.errors.username}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="register-password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="register-password"
                    name="password"
                    autoComplete="new-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={step2.values.password}
                    onChange={(e) => handleStep2Change('password', e.target.value)}
                    onBlur={() => handleStep2Blur('password')}
                    aria-invalid={Boolean(step2.errors.password)}
                    aria-describedby={step2.errors.password ? 'register-password-error' : 'register-password-strength'}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                
                {/* Password strength meter */}
                {step2.values.password && (
                  <div className="password-strength-meter" id="register-password-strength" aria-live="polite">
                    <div className="strength-bar">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`strength-segment ${i < passwordStrength ? 'filled' : ''}`}
                          style={i < passwordStrength ? { backgroundColor: strengthInfo.color } : {}}
                        />
                      ))}
                    </div>
                    <span className="strength-label" style={{ color: strengthInfo.color }}>
                      {strengthInfo.label}
                    </span>
                  </div>
                )}

                {step2.errors.password && (
                  <span className="auth-field-error" id="register-password-error" role="alert">
                    {step2.errors.password}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="register-confirm-password">Confirm password</label>
                <div className="password-input-wrapper">
                  <input
                    id="register-confirm-password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={step2.values.confirmPassword}
                    onChange={(e) => handleStep2Change('confirmPassword', e.target.value)}
                    onBlur={() => handleStep2Blur('confirmPassword')}
                    aria-invalid={Boolean(step2.errors.confirmPassword)}
                    aria-describedby={step2.errors.confirmPassword ? 'register-confirm-password-error' : undefined}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((visible) => !visible)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {step2.errors.confirmPassword && (
                  <span className="auth-field-error" id="register-confirm-password-error" role="alert">
                    {step2.errors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="step-actions step-actions--two">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handlePreviousStep}
                  disabled={isSubmitting}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {currentStep === 3 && (
            <div className="step-content" role="group" aria-labelledby="step3-heading">
              <h2 id="step3-heading" ref={step3Ref} className="step-heading" tabIndex={-1}>
                Your Interests
              </h2>

              <div className="form-group">
                <label>Which subjects interest you? (Select all that apply)</label>
                <div className="subject-selection-grid" role="group" aria-label="Subject selection">
                  {SUBJECTS.map((subject) => (
                    <button
                      key={subject.id}
                      type="button"
                      className={`subject-pill ${selectedSubjects.includes(subject.id) ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedSubjects((prev) =>
                          prev.includes(subject.id)
                            ? prev.filter((s) => s !== subject.id)
                            : [...prev, subject.id]
                        );
                      }}
                      aria-pressed={selectedSubjects.includes(subject.id)}
                    >
                      {selectedSubjects.includes(subject.id) && <Check size={14} />}
                      {subject.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>What's your learning goal?</label>
                <div className="goal-selection-grid" role="radiogroup" aria-label="Learning goal selection">
                  {LEARNING_GOALS.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      className={`goal-pill ${selectedGoals.includes(goal.id) ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedGoals([goal.id]); // Single selection
                      }}
                      aria-pressed={selectedGoals.includes(goal.id)}
                    >
                      {selectedGoals.includes(goal.id) && <Check size={14} />}
                      {goal.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="step-actions step-actions--two">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handlePreviousStep}
                  disabled={isSubmitting}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="auth-footer">
          <button
            type="button"
            onClick={() => setScreen('login')}
            className="auth-link"
          >
            Already have an account? <span>Sign in</span>
          </button>
          <button
            type="button"
            onClick={() => setScreen('splash')}
            className="auth-back"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
