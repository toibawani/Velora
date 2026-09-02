import React, { useState, useEffect } from 'react';
import '../styles/DailySpark.css';

const SPARKS = [
  {
    icon: '💡',
    title: 'Did you know?',
    fact: 'Light takes 8 minutes and 20 seconds to travel from the Sun to Earth.',
    detail: 'Photons generated in the solar core undergo thousands of years of radiative diffusion before escaping into space.',
    cta: 'Explore Light & Relativity →',
    topic: 'physics',
  },
  {
    icon: '🤔',
    title: 'Philosophical Inquiry',
    fact: 'If a tree falls in a forest with no observer present, does it produce sound?',
    detail: 'Examine the distinction between acoustic air pressure waves and subjective perceptual qualia.',
    cta: 'Explore Epistemology →',
    topic: 'philosophy',
  },
  {
    icon: '📜',
    title: 'Scientific History',
    fact: 'The Renaissance marked the mathematical formalization of observational astronomy.',
    detail: 'Galileo and Kepler bridged ancient deductive philosophy with empirical measurement.',
    cta: 'Explore Scientific History →',
    topic: 'history',
  },
];

function DailySpark() {
  const [currentSpark, setCurrentSpark] = useState(() => {
    const today = new Date().getDate();
    return today % SPARKS.length;
  });

  const spark = SPARKS[currentSpark];

  return (
    <div className="daily-spark">
      <div className="spark-card">
        <div className="spark-icon">{spark.icon}</div>

        <div className="spark-text">
          <h3 className="spark-title">{spark.title}</h3>
          <p className="spark-fact">{spark.fact}</p>
          <p className="spark-detail">{spark.detail}</p>
        </div>

        <button className="spark-cta">{spark.cta}</button>
      </div>
    </div>
  );
}

export default DailySpark;