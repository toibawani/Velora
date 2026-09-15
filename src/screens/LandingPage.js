import React from 'react';
import {
  Globe,
  Zap,
  Microscope,
  Users,
  BarChart2,
  Award,
  ArrowRight,
  Check,
  X,
} from 'lucide-react';
import '../styles/LandingPage.css';

/**
 * LandingPage Screen
 *
 * The marketing landing page for VELORA — first impression for new visitors.
 * Left-aligned asymmetric hero. No centered column stacks.
 * Phase 2+4: Asymmetric layout, lucide icons, intentional visual density.
 */
function LandingPage({ setScreen }) {
  const testimonials = [
    {
      text: 'I spent 2 hours on the Black Holes module and couldn\'t stop. I\'ve never been that absorbed in a learning app before.',
      name: 'Priya S.',
      role: 'Engineering Student, IIT Delhi',
      initials: 'PS',
    },
    {
      text: 'The philosophy discussions are actually making me a better critical thinker. I argue more clearly now.',
      name: 'Javier M.',
      role: 'Pre-law, University of Toronto',
      initials: 'JM',
    },
    {
      text: 'Finally something for people who actually want to UNDERSTAND physics, not just pass an exam.',
      name: 'Aiko T.',
      role: 'Self-learner & Science Writer',
      initials: 'AT',
    },
  ];

  const pillars = [
    {
      Icon: Globe,
      title: 'Interactive Visual Cosmos',
      desc: 'Animated physics simulations, canvas-rendered black hole accretion disks, and real-time tensor equations — not slides.',
      featured: true,
    },
    {
      Icon: Zap,
      title: 'Flow-State Learning',
      desc: 'Scientifically-designed sessions that eliminate distraction and create genuine states of deep absorption.',
    },
    {
      Icon: Microscope,
      title: 'Research-Grade Depth',
      desc: 'Primary paper distillations from Hawking 1974, EHT 2019, and Einstein 1916 — accessible without a PhD.',
    },
    {
      Icon: Users,
      title: 'Anonymous Peer Discourse',
      desc: 'Debate ideas without social pressure. Upvote the clearest explanation, not the most popular person.',
    },
    {
      Icon: BarChart2,
      title: 'On-Device Analytics',
      desc: 'Your cognitive patterns, peak focus hours, and forgetting curves — private and local, never sold.',
    },
    {
      Icon: Award,
      title: 'Verifiable Credentials',
      desc: 'Earn certificates with cryptographic verification IDs — shareable directly to LinkedIn.',
    },
  ];

  const domains = [
    { name: 'Astrophysics', color: '#4f7df3' },
    { name: 'Philosophy', color: '#6D28D9' },
    { name: 'History', color: '#b45309' },
    { name: 'Mathematics', color: '#0f766e' },
    { name: 'Quantum Physics', color: '#15803d' },
    { name: 'Biology', color: '#b91c1c' },
  ];

  const compareRows = [
    ['Content depth', 'Survey-level overview', 'Research paper distillations'],
    ['Learning mode', 'Passive video watching', 'Interactive simulations'],
    ['Community', 'Comment sections', 'Anonymous Socratic debate rooms'],
    ['Analytics', 'Completion tracking', 'Cognitive pattern analysis'],
    ['Credentials', 'PDF certificate', 'Cryptographically verifiable'],
    ['Engagement', 'Streaks & gamification', 'Flow-state design'],
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
            <button className="lp-cta-btn" onClick={() => setScreen('register')}>
              Start Exploring <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section — Left-aligned asymmetric split */}
      <section className="landing-hero">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="hero-badge">1,400+ curious minds exploring</span>
          </div>

          <h1 className="hero-headline">
            Learning is<br />
            <em className="hero-accent">exploration,</em><br />
            not memorization.
          </h1>

          <p className="hero-subline">
            VELORA reimagines education as an immersive intellectual cosmos.
            Explore physics, philosophy, and history through real science,
            animated simulations, and meaningful peer discourse.
          </p>

          <div className="hero-cta-row">
            <button className="hero-primary-cta" onClick={() => setScreen('register')}>
              Begin Your Exploration
            </button>
            <button className="hero-secondary-cta" onClick={() => setScreen('login')}>
              Already a Scholar? Sign In <ArrowRight size={13} />
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-stat-stack">
            <div className="hero-stat-card hero-stat-card--main">
              <span className="hero-stat-number">1,400+</span>
              <span className="hero-stat-label">Scholars active this week</span>
            </div>
            <div className="hero-stat-card">
              <span className="hero-stat-number">94%</span>
              <span className="hero-stat-label">Report deeper understanding vs. video lectures</span>
            </div>
            <div className="hero-stat-card">
              <span className="hero-stat-number">6</span>
              <span className="hero-stat-label">Scientific domains, 200+ modules</span>
            </div>
          </div>

          <div className="hero-domains-strip">
            {domains.map(d => (
              <div
                key={d.name}
                className="hero-domain-pill"
                style={{ borderColor: `${d.color}40`, color: d.color }}
              >
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes It Different — Asymmetric bento */}
      <section className="landing-section pillars-section">
        <div className="section-inner">
          <div className="section-header-asymm">
            <span className="section-label">WHY VELORA</span>
            <h2 className="section-heading">Not just another education app.</h2>
          </div>

          <div className="pillars-bento">
            {pillars.map((p, i) => (
              <div
                key={p.title}
                className={`pillar-card${p.featured ? ' pillar-card--featured' : ''}`}
              >
                <span className="pillar-icon-wrap">
                  <p.Icon size={18} strokeWidth={1.8} />
                </span>
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
          <div className="section-header-asymm">
            <span className="section-label">VELORA VS. TRADITIONAL EDTECH</span>
            <h2 className="section-heading">The difference is in the depth.</h2>
          </div>

          <div className="compare-table">
            <div className="compare-header">
              <div className="compare-col-label"></div>
              <div className="compare-col-label other">Khan Academy / Coursera</div>
              <div className="compare-col-label velora">VELORA</div>
            </div>
            {compareRows.map(([feature, them, us], i) => (
              <div key={i} className="compare-row">
                <div className="compare-feature">{feature}</div>
                <div className="compare-them">
                  <X size={13} className="compare-icon compare-icon--no" />
                  {them}
                </div>
                <div className="compare-us">
                  <Check size={13} className="compare-icon compare-icon--yes" />
                  {us}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — Staggered masonry-feel */}
      <section className="landing-section testimonials-section">
        <div className="section-inner">
          <div className="section-header-asymm">
            <span className="section-label">SCHOLAR TESTIMONIALS</span>
            <h2 className="section-heading">From the minds who've explored it.</h2>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className={`testimonial-card testimonial-card--${i}`}>
                <p className="testimonial-quote">"{t.text}"</p>
                <div className="testimonial-author-row">
                  <span className="testimonial-avatar">{t.initials}</span>
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

      {/* Final CTA — Left-anchored, not center-stacked */}
      <section className="landing-final-cta">
        <div className="final-cta-inner">
          <div className="final-cta-text">
            <h2 className="final-cta-heading">Your intellectual cosmos awaits.</h2>
            <p className="final-cta-sub">
              Join 1,400+ scholars exploring physics, philosophy, and history
              the way it was meant to be understood.
            </p>
          </div>
          <div className="final-cta-action">
            <button className="hero-primary-cta large" onClick={() => setScreen('register')}>
              Create Free Account <ArrowRight size={15} />
            </button>
            <p className="final-cta-note">No credit card required. Free forever for core content.</p>
          </div>
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
