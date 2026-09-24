import React from 'react';
import '../styles/LoadingCard.css';

function LoadingCard({ count = 3, label = "Loading content" }) {
  return (
    <div className="loading-container" aria-label={label} role="status" aria-busy="true">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="loading-card" aria-hidden="true">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-text"></div>
          <div className="skeleton-line skeleton-text short"></div>
        </div>
      ))}
    </div>
  );
}

export default LoadingCard;
