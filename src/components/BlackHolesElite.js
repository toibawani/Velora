import React, { useState } from 'react';
import '../styles/BlackHolesElite.css';

function BlackHolesElite() {
  const sections = [
    {
      title: 'The Story of How We Discovered Black Holes',
      expert: 'Based on Einstein\'s General Relativity (1915)',
      content: 'Karl Schwarzschild predicted black holes mathematically in 1916, but we didn\'t actually observe one until 2019 with the Event Horizon Telescope.',
      facts: [
        'First real image: M87, 55 million light-years away',
        'Mass: 6.5 billion suns',
        'Event Horizon size: 42 million km across',
      ],
    },
    {
      title: 'Why This Matters for Your Future',
      expert: 'Career connection',
      content: 'Understanding black holes leads to careers in astrophysics, theoretical physics, and space agencies like NASA, ESA, and ISRO.',
      facts: [
        'Astrophysicist salary: $100K-$200K+',
        'Research opportunities at top universities',
        'Contribute to mankind\'s understanding of reality',
      ],
    },
  ];

  return (
    <div className="black-holes-elite">
      {sections.map((section, idx) => (
        <div key={idx} className="elite-section">
          <div className="section-header">
            <h3 className="section-title">{section.title}</h3>
            <span className="section-expert">👨‍🚀 {section.expert}</span>
          </div>

          <p className="section-content">{section.content}</p>

          <div className="facts-list">
            {section.facts.map((fact, i) => (
              <div key={i} className="fact-item">
                <span className="fact-icon">→</span>
                <span className="fact-text">{fact}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="elite-cta">
        <p>Ready to go deeper?</p>
        <button className="cta-button">Explore Full Black Holes Masterclass →</button>
      </div>
    </div>
  );
}

export default BlackHolesElite;