import React, { useState, useEffect } from 'react';
import { Award, UserPlus, Atom, Brain, Landmark, Sparkles, Headphones, Disc, ArrowRight } from 'lucide-react';
import DailySpark from '../components/DailySpark';
import SocialProof from '../components/SocialProof';
import ReferralModal from '../components/ReferralModal';
import CertificateModal from '../components/CertificateModal';
import ThemeToggle from '../components/ThemeToggle';
import LoadingCard from '../components/LoadingCard';
import { trackEvent } from '../utils/analytics';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import '../styles/UniverseHome.css';
// StreakTracker & PersonalizedDashboard reserved for future feature sections

/**
 * UniverseHome Screen
 * 
 * Central dashboard designed with Apple/Notion clarity. Focuses on personal
 * learning momentum, quick domain entry, and live community activity.
 */
function UniverseHome({ user, setScreen, setSelectedSubject, setLearnView, onLogout }) {
  const [hoveredSubject, setHoveredSubject] = useState(null);
  const [showReferral, setShowReferral] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useKeyboardShortcuts({
    escape: () => {
      setShowReferral(false);
      setShowCertificate(false);
    }
  });

  useEffect(() => {
    trackEvent('screen_view', { screen: 'universe', user: user?.name });
    
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [user]);

  const subjects = [
    {
      id: 'physics',
      name: 'Physics',
      icon: Atom,
      color: '#4f7df3',
      description: 'Master the fundamental laws governing spacetime, relativity, and quantum systems',
      progress: '65% complete'
    },
    {
      id: 'philosophy',
      name: 'Philosophy',
      icon: Brain,
      color: '#af52de',
      description: 'Explore epistemology, ethical frameworks, and the philosophy of science',
      progress: '45% complete'
    },
    {
      id: 'history',
      name: 'History',
      icon: Landmark,
      color: '#ff9f0a',
      description: 'Understand the civilizational catalysts and scientific revivals shaping humanity',
      progress: '80% complete'
    },
  ];

  const handleSubjectClick = (subjectId) => {
    trackEvent('subject_selected', { subjectId });
    setSelectedSubject(subjectId);
    setScreen('learn');
  };

  return (
    <div className="universe-home">
      {/* Header */}
      <header className="uh-header">
        <div className="uh-header-left">
          <h1 className="uh-title">VELORA</h1>
          <p className="uh-tagline">Your Personal Knowledge Universe</p>
        </div>

        {/* Quick Nav Bar */}
        <nav className="uh-nav-links">
          <button className="uh-nav-item active" onClick={() => setScreen('universe')}>
            Home
          </button>
          <button className="uh-nav-item" onClick={() => { setSelectedSubject('physics'); setScreen('learn'); }}>
            Learn
          </button>
          <button className="uh-nav-item" onClick={() => setScreen('games')}>
            Flow Games
          </button>
          <button className="uh-nav-item" onClick={() => setScreen('analytics')}>
            Analytics
          </button>
          <button className="uh-nav-item" onClick={() => setScreen('community')}>
            Community
          </button>
          <button className="uh-nav-item" onClick={() => setScreen('challenges')}>
            Challenges
          </button>
        </nav>

        <div className="uh-header-right">
          <ThemeToggle />
          <button className="uh-cert-btn" onClick={() => setShowCertificate(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Award size={15} strokeWidth={1.5} color="var(--color-accent)" />
            <span>Certificate</span>
          </button>
          <button className="uh-invite-btn" onClick={() => setShowReferral(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <UserPlus size={15} strokeWidth={1.5} color="var(--color-accent)" />
            <span>Invite</span>
          </button>
          <span className="uh-user">{user?.name || 'Explorer'}</span>
          <button className="uh-logout" onClick={onLogout}>
            Exit
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="uh-main">
        {isLoading ? (
          <LoadingCard count={3} label="Loading universe" />
        ) : (
          <>
            <div className="uh-hero-header">
              <h1 className="uh-hero-title">Academic Universe</h1>
              <p className="uh-hero-subtitle">
                Curated curriculum spanning relativistic spacetime, epistemology, and historical revivals.
              </p>
            </div>

            {/* Daily Spark */}
            <section className="uh-daily-spark">
              <DailySpark />
            </section>

        {/* Feature Spotlight Banner */}
        <section className="uh-spotlight-section">
          <div className="uh-spotlight-content">
            <div className="uh-spotlight-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} strokeWidth={1.5} color="var(--color-accent)" />
              <span>New Laboratory & Sensory Features</span>
            </div>
            <h2 className="uh-spotlight-title">Interactive Spacetime Physics & Deep Focus Soundscapes</h2>
            <p className="uh-spotlight-desc">
              Explore our real-time General Relativity curvature canvas, calculate gravitational time dilation for supermassive black holes, or enter the Web Audio binaural sensory chamber.
            </p>
          </div>
          <div className="uh-spotlight-actions">
            <button
              className="uh-spotlight-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              onClick={() => {
                if (setLearnView) setLearnView('relativity-lab');
                setSelectedSubject('physics');
                setScreen('learn');
              }}
            >
              <Atom size={16} strokeWidth={1.5} />
              <span>Launch Relativity Lab</span>
            </button>
            <button
              className="uh-spotlight-btn secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              onClick={() => {
                if (setLearnView) setLearnView('black-hole-mastery');
                setSelectedSubject('physics');
                setScreen('learn');
              }}
            >
              <Disc size={16} strokeWidth={1.5} />
              <span>Black Holes Masterclass</span>
            </button>
            <button
              className="uh-spotlight-btn secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              onClick={() => {
                if (setLearnView) setLearnView('sensory-rooms');
                setSelectedSubject('physics');
                setScreen('learn');
              }}
            >
              <Headphones size={16} strokeWidth={1.5} />
              <span>Sensory Focus Room</span>
            </button>
          </div>
        </section>

        {/* Subject Cards */}
        <section className="uh-subjects">
          <div className="section-header-row">
            <div>
              <h2 className="uh-subjects-title">Choose Your Domain</h2>
              <p className="uh-subjects-subtitle">
                Select a pathway to explore interactive canvases, deep curriculum, and flow challenges.
              </p>
            </div>
          </div>

          <div className="uh-subjects-grid">
            {subjects.map((subject) => {
              const SubjectIcon = subject.icon;
              return (
                <div
                  key={subject.id}
                  className="uh-subject-card"
                  onMouseEnter={() => setHoveredSubject(subject.id)}
                  onMouseLeave={() => setHoveredSubject(null)}
                  onClick={() => handleSubjectClick(subject.id)}
                  style={{
                    borderColor: hoveredSubject === subject.id ? subject.color : undefined
                  }}
                >
                  <div
                    className="card-header"
                    style={{
                      borderColor: subject.color,
                      background: `${subject.color}10`,
                    }}
                  >
                    <span className="card-emoji" style={{ display: 'flex', alignItems: 'center' }}>
                      <SubjectIcon size={24} strokeWidth={1.5} color={subject.color} />
                    </span>
                    <span className="card-progress-tag" style={{ color: subject.color }}>
                      {subject.progress}
                    </span>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{subject.name}</h3>
                    <p className="card-description">{subject.description}</p>
                  </div>
                  <button
                    className="card-cta"
                    style={{
                      background: subject.color,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>Explore Domain</span>
                    <ArrowRight size={15} strokeWidth={1.5} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Live Social Proof & Activity Dashboard */}
        <section className="uh-social-section">
          <h2 className="uh-section-title">Community & Momentum</h2>
          <SocialProof onSelectTopic={() => { setSelectedSubject('physics'); setScreen('learn'); }} />
        </section>
          </>
        )}
      </main>

      {/* Referral Modal */}
      <ReferralModal
        isOpen={showReferral}
        onClose={() => setShowReferral(false)}
        userName={user?.name}
      />

      {/* Course Completion Certificate Modal */}
      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        userName={user?.name}
        domain="Astrophysics & General Relativity"
      />
    </div>
  );
}

export default UniverseHome;