import React from 'react';
import '../styles/LandingPage.css';

/**
 * LandingPage Screen
 *
 * The marketing landing page for VELORA — first impression for new visitors.
 * Designed to communicate the core value proposition:
 * - Learning as exploration, not memorization
 * - Visual, immersive, and premium design language
 * - Social proof (learner counts, testimonials)
 * - Conversion CTA to register / explore
 */
function LandingPage({ setScreen }) {
  const testimonials = [
    {
      text: 'I spent 2 hours on the Black Holes module and couldn\'t stop. I\'ve never been that absorbed in a learning app before.',
      name: 'Priya S.',
      role: 'Engineering Student, IIT Delhi',
      avatar: '🎓'
    },
    {
      text: 'The philosophy discussions are actually making me a better critical thinker. I argue more clearly now.',
      name: 'Javier M.',
      role: 'Pre-law, University of Toronto',
      avatar: '⚖️'
    },
    {
      text: 'Finally something for people who actually want to UNDERSTAND physics, not just pass an exam.',
      name: 'Aiko T.',
      role: 'Self-learner & Science Writer',
      avatar: '📝'
    }
  ];

  const pillars = [
    {
      icon: '🌌',
      title: 'Interactive Visual Cosmos',
      desc: 'Animated physics simulations, canvas-rendered black hole accretion disks, and real-time tensor equations — not slides.'
    },
    {
      icon: '⚡',
      title: 'Flow-State Learning',
      desc: 'Scientifically-designed learning sessions that eliminate distraction and create genuine states of deep absorption.'
    },
    {
      icon: '🔬',
      title: 'Research-Grade Depth',
      desc: 'Primary paper distillations from Hawking 1974, EHT 2019, and Einstein 1916 — accessible without a PhD.'
    },
    {
      icon: '👥',
      title: 'Anonymous Peer Discourse',
      desc: 'Debate ideas without social pressure. Upvote the clearest explanation, not the most popular person.'
    },
    {
      icon: '📊',
      title: 'On-Device Learning Analytics',
      desc: 'Your cognitive patterns, peak focus hours, and forgetting curves — private and local, never sold to advertisers.'
    },
    {
      icon: '🏆',
      title: 'Verifiable Credentials',
      desc: 'Earn real, industry-recognized certificates with cryptographic verification IDs — shareable directly to LinkedIn.'
    }
  ];

  const domains = [
    { name: 'Astrophysics', emoji: '🌑', color: '#4f7df3' },
    { name: 'Philosophy', emoji: '🏛️', color: '#af52de' },
    { name: 'History', emoji: '📜', color: '#ff9f0a' },
    { name: 'Mathematics', emoji: '📐', color: '#30d5c8' },
    { name: 'Quantum Physics', emoji: '⚛️', color: '#34c759' },
    { name: 'Biology', emoji: '🧬', color: '#ff3b30' },
  ];

  return (
    <div className="landing-page">
      {/* Nav Bar */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <span className="landing-logo">VELORA</span>
          <div className="landing-nav-links">
            <button className="lp-nav-link">Domains</button>
            <button className="lp-nav-link">Community</button>
            <button className="lp-nav-link">For Educators</button>
          </div>
          <div className="landing-nav-cta">
            <button className="lp-login-btn" onClick={() => setScreen('login')}>Sign In</button>
            <button className="lp-cta-btn" onClick={() => setScreen('register')}>Start Exploring →</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-eyebrow">
          <span className="hero-badge">🌌 1,400+ Curious Minds Exploring</span>
        </div>

        <h1 className="hero-headline">
          Learning is<br />
          <em className="hero-accent">exploration</em>,<br />
          not memorization.
        </h1>

        <p className="hero-subline">
          VELORA reimagines education as an immersive intellectual cosmos.
          Explore physics, philosophy, and history through real science,
          animated simulations, and meaningful peer discourse — not passive video consumption.
        </p>

        <div className="hero-cta-row">
          <button className="hero-primary-cta" onClick={() => setScreen('register')}>
            Begin Your Exploration
          </button>
          <button className="hero-secondary-cta" onClick={() => setScreen('login')}>
            Already a Scholar? Sign In →
          </button>
        </div>

        {/* Domain Badges Preview */}
        <div className="hero-domains-strip">
          {domains.map(d => (
            <div key={d.name} className="hero-domain-pill" style={{ borderColor: `${d.color}50` }}>
              <span>{d.emoji}</span>
              <span style={{ color: d.color }}>{d.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* What Makes It Different */}
      <section className="landing-section pillars-section">
        <div className="section-inner">
          <span className="section-label">WHY VELORA</span>
          <h2 className="section-heading">Not just another education app.</h2>
          <p className="section-sub">
            We replaced passive video content with active intellectual engagement — the kind that actually changes how you think.
          </p>

          <div className="pillars-grid">
            {pillars.map(p => (
              <div key={p.title} className="pillar-card">
                <span className="pillar-icon">{p.icon}</span>
                <h3 className="pillar-title">{p.title}</h3>
                <p className="pillar-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Block */}
      <section className="landing-section compare-section">
        <div className="section-inner">
          <span className="section-label">VELORA VS. TRADITIONAL EDTECH</span>
          <h2 className="section-heading">The difference is in the depth.</h2>

          <div className="compare-table">
            <div className="compare-header">
              <div className="compare-col-label blank"></div>
              <div className="compare-col-label other">Khan Academy / Coursera</div>
              <div className="compare-col-label velora">VELORA</div>
            </div>
            {[
              ['Content depth', 'Survey-level overview', 'Research paper distillations + tensors'],
              ['Learning mode', 'Passive video watching', 'Interactive simulations + flow sessions'],
              ['Community', 'Comment sections', 'Anonymous Socratic debate rooms'],
              ['Analytics', 'Completion tracking', 'Cognitive pattern + forgetting curve analysis'],
              ['Credentials', 'Completion certificate (PDF)', 'Cryptographically verifiable + LinkedIn direct'],
              ['Engagement model', 'Streaks & gamification', 'Flow-state design + real intellectual reward'],
            ].map(([feature, them, us], i) => (
              <div key={i} className="compare-row">
                <div className="compare-feature">{feature}</div>
                <div className="compare-them">{them}</div>
                <div className="compare-us">{us}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="landing-section testimonials-section">
        <div className="section-inner">
          <span className="section-label">SCHOLAR TESTIMONIALS</span>
          <h2 className="section-heading">From the minds who've explored it.</h2>

          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <p className="testimonial-quote">"{t.text}"</p>
                <div className="testimonial-author-row">
                  <span className="testimonial-avatar">{t.avatar}</span>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-final-cta">
        <div className="final-cta-inner">
          <h2 className="final-cta-heading">Your intellectual cosmos awaits.</h2>
          <p className="final-cta-sub">Join 1,400+ scholars exploring physics, philosophy, and history the way it was meant to be understood.</p>
          <button className="hero-primary-cta large" onClick={() => setScreen('register')}>
            Create Free Account →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <span className="landing-logo small">VELORA</span>
          <span className="footer-tagline">Learning is exploration, not memorization.</span>
          <div className="footer-links">
            <button className="footer-link">Privacy</button>
            <button className="footer-link">Terms</button>
            <button className="footer-link">Educators</button>
            <button className="footer-link">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
