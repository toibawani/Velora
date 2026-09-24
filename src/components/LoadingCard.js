import React from 'react';
import '../styles/LoadingCard.css';

function LoadingCard({ count = 3 }) {
  return (
    <div className="loading-container" aria-label="Loading content" role="status">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="loading-card">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-text"></div>
          <div className="skeleton-line skeleton-text short"></div>
        </div>
      ))}
    </div>
  );
}

export default LoadingCard;
