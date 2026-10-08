import React from 'react';
import PropTypes from 'prop-types';

import '../styles/EmptyState.css';

/**
 * EmptyState - friendly placeholder shown when a list or section has no
 * content yet, with an optional action button.
 */
EmptyState.propTypes = { icon: PropTypes.string, title: PropTypes.string, description: PropTypes.string, action: PropTypes.string, actionText: PropTypes.string, onAction: PropTypes.shape({"onAction": PropTypes.func}), actionLabel: PropTypes.string };

function EmptyState({ icon, title, description, action, actionText, onAction, actionLabel }) {
  const handleAction = action || onAction;
  const buttonText = actionText || actionLabel;

  return (
    <div data-testid="empty-state"
          className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{description}</p>
      {handleAction && buttonText && (
        <button className="empty-btn" onClick={handleAction}>
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
