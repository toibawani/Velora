import React, { useState, useEffect } from 'react';
import '../styles/DailySpark.css';

function DailySpark() {
  const sparks = [
    {
      icon: '💡',
      title: 'Did you know?',
      fact: 'Light takes 8 minutes to reach Earth from the Sun.',
      detail: 'This means when you see the Sun, it\'s already gone from that position 8 minutes ago.',
      cta: 'Explore Light & Time →',
      topic: 'physics',
    },
    {
      icon: '🤔',
      title: 'Philosophy Question',
      fact: 'If a tree falls in a forest with no one to hear it, does it make a sound?',
      detail: 'Explore the nature of perception, reality, and consciousness.',
      cta: 'Explore Perception →',
      topic: 'philosophy',
    },
    {
      icon: '📜',
      title: 'Historical Fact',
      fact: 'The Renaissance began in Italy in the 1300s, changing everything about human thought.',
      detail: 'Discover how rediscovering ancient wisdom transformed the modern world.',
      cta: 'Explore the Renaissance →',
      topic: 'history',
    },
  ];

  const [currentSpark, setCurrentSpark] = useState(0);

  useEffect(() => {
    // Rotate through sparks (daily in production)
    const today = new Date().getDate();
    setCurrentSpark(today % sparks.length);
  }, []);

  const spark = sparks[currentSpark];

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