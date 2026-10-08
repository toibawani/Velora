/**
 * LoadingCard - skeleton loading placeholder for content areas.
 * Shows a shimmer animation while data is being fetched.
 */
import React from 'react';
import PropTypes from 'prop-types';

import '../styles/LoadingCard.css';

LoadingCard.propTypes = { count: PropTypes.string, label: PropTypes.string, compact: PropTypes.string };

function LoadingCard({ count = 3, label = "Loading content", compact = false }) {
  return (
    <div className="loading-container" aria-label={label} role="status" aria-busy="true">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="loading-card" aria-hidden="true">
          <div className="skeleton-line skeleton-title"></div>
          {!compact && (
            <>
              <div className="skeleton-line skeleton-text"></div>
              <div className="skeleton-line skeleton-text medium"></div>
              <div className="skeleton-line skeleton-text short"></div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default LoadingCard;
