import React, { useState } from 'react';
import '../styles/Challenges.css';

/**
 * Challenges Screen
 * 
 * Curated monthly sprints (e.g. "Master Black Holes in 7 Days") designed to foster
 * deep peer community, urgency, and pride in mastery. The first 100 finishers unlock
 * exclusive archival badges on the global leaderboard.
 */
function Challenges({ setScreen }) {
  const [activeSprintTab, setActiveSprintTab] = useState('black-holes-7day');
  const [joinedSprints, setJoinedSprints] = useState({ 'black-holes-7day': true });

  const monthlySprints = [
    {
      id: 'black-holes-7day',
      title: 'Master Black Holes in 7 Days',
      domain: 'Astrophysics & Spacetime Geometry',
      deadline: '4 days remaining',
      spotsRemaining: '28 spots left (out of 100 Genesis Badges)',
      participantsCount: 1420,
      userProgress: 57, // Day 4 of 7
      currentDay: 4,
      days: [
        { day: 1, title: 'Schwarzschild Radius & Escape Speed', status: 'completed' },
        { day: 2, title: 'Gravitational Time Dilation & Clocks', status: 'completed' },
        { day: 3, title: 'Photon Spheres & Event Horizon Optics', status: 'completed' },
        { day: 4, title: 'Spacetime Singularity & Penrose Diagrams', status: 'in-progress' },
        { day: 5, title: 'Hawking Radiation & Quantum Thermodynamics', status: 'locked' },
        { day: 6, title: 'EHT Radio Interferometry Analysis', status: 'locked' },
        { day: 7, title: 'Final Comprehensive Conceptual Defense', status: 'locked' },
      ],
      leaderboard: [
        { rank: 1, name: 'Talia V.', time: 'Completed in 5d 4h', badge: 'Genesis #1' },
        { rank: 2, name: 'Devon R.', time: 'Completed in 5d 8h', badge: 'Genesis #2' },
        { rank: 3, name: 'Kenji S.', time: 'Completed in 5d 14h', badge: 'Genesis #3' },
        { rank: 4, name: 'Maya L.', time: 'Completed in 5d 19h', badge: 'Genesis #4' },
        { rank: 5, name: 'You (Explorer)', time: 'Day 4 / 7 (On Pace)', badge: 'Contender' }
      ]
    },
    {
      id: 'ancient-philosophy-10day',
      title: 'The Socratic Crucible (10 Days)',
      domain: 'Classical Epistemology & Logic',
      deadline: '8 days remaining',
      spotsRemaining: '45 spots left',
      participantsCount: 890,
      userProgress: 20,
      currentDay: 2,
      days: [
        { day: 1, title: 'The Socratic Method & Aporia', status: 'completed' },
        { day: 2, title: 'Platonic Forms & The Divided Line', status: 'in-progress' },
        { day: 3, title: 'Aristotle’s Categories & Syllogisms', status: 'locked' },
      ],
      leaderboard: [
        { rank: 1, name: 'Julian M.', time: 'Completed in 8d 2h', badge: 'Genesis #1' },
        { rank: 2, name: 'Siddharth N.', time: 'Completed in 8d 6h', badge: 'Genesis #2' }
      ]
    }
  ];

  const activeSprint = monthlySprints.find(s => s.id === activeSprintTab) || monthlySprints[0];

  return (
    <div className="challenges-page-root">
      {/* Top Header */}
      <header className="challenges-nav-header">
        <button className="challenges-back-btn" onClick={() => setScreen('universe')}>
          ← Return to Universe
        </button>
        <h1 className="challenges-title-bar">Monthly Mastery Sprints</h1>
        <div style={{ width: '80px' }}></div>
      </header>

      <main className="challenges-main-content">
        {/* Sprint Tabs */}
        <div className="sprint-picker-tabs">
          {monthlySprints.map((sprint) => (
            <button
              key={sprint.id}
              className={`sprint-tab-btn ${activeSprintTab === sprint.id ? 'active' : ''}`}
              onClick={() => setActiveSprintTab(sprint.id)}
            >
              {sprint.title}
            </button>
          ))}
        </div>

        {/* Sprint Hero Card */}
        <section className="sprint-hero-card">
          <div className="sprint-badge-row">
            <span className="sprint-domain-badge">{activeSprint.domain}</span>
            <span className="sprint-deadline-badge">⏳ {activeSprint.deadline}</span>
          </div>

          <h2 className="sprint-main-heading">{activeSprint.title}</h2>
          <p className="sprint-lead-text">
            Join {activeSprint.participantsCount.toLocaleString()} learners pushing the boundaries of comprehension. Complete all 7 daily deep dives to earn the permanent Genesis Finisher badge.
          </p>

          <div className="sprint-urgency-banner">
            <span className="urgency-icon">🔥</span>
            <span className="urgency-text">
              <strong>{activeSprint.spotsRemaining}</strong> to be permanently immortalized on the monthly leaderboard.
            </span>
          </div>

          {/* User Progress Bar */}
          <div className="sprint-progress-wrapper">
            <div className="progress-info-row">
              <span className="progress-label">Your Sprint Velocity</span>
              <span className="progress-value">Day {activeSprint.currentDay} of {activeSprint.days.length} ({activeSprint.userProgress}%)</span>
            </div>
            <div className="sprint-track">
              <div className="sprint-fill" style={{ width: `${activeSprint.userProgress}%` }}></div>
            </div>
          </div>
        </section>

        {/* Split Section: Daily Milestones & Live Leaderboard */}
        <div className="sprint-split-grid">
          {/* Daily Milestones */}
          <div className="sprint-milestones-col">
            <h3 className="col-header-title">Daily Milestone Curriculum</h3>
            <div className="milestones-stack">
              {activeSprint.days.map((item) => (
                <div key={item.day} className={`milestone-day-card ${item.status}`}>
                  <div className="day-number-pill">Day {item.day}</div>
                  <div className="day-info-block">
                    <h4 className="day-title">{item.title}</h4>
                    <span className="day-status-text">
                      {item.status === 'completed' && '✓ Completed & Verified'}
                      {item.status === 'in-progress' && '⚡ Today’s Active Focus'}
                      {item.status === 'locked' && '🔒 Unlocks Tomorrow'}
                    </span>
                  </div>
                  {item.status === 'in-progress' && (
                    <button
                      className="start-day-btn"
                      onClick={() => setScreen('learn')}
                    >
                      Enter Day {item.day} →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Live Leaderboard */}
          <div className="sprint-leaderboard-col">
            <h3 className="col-header-title">🏆 Top Finisher Standings</h3>
            <div className="leaderboard-card-box">
              <div className="board-header-row">
                <span>Rank & Scholar</span>
                <span>Pace / Badge</span>
              </div>
              <div className="board-rows-list">
                {activeSprint.leaderboard.map((user, idx) => (
                  <div key={idx} className={`board-user-row ${user.rank === 5 ? 'highlight-user' : ''}`}>
                    <div className="user-rank-name">
                      <span className="rank-idx">#{user.rank}</span>
                      <span className="user-text-name">{user.name}</span>
                    </div>
                    <div className="user-badge-time">
                      <span className="time-stat">{user.time}</span>
                      <span className="genesis-badge">{user.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Challenges;