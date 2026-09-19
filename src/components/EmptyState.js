import React from 'react';
import '../styles/EmptyState.css';

function EmptyState({ icon, title, description, action, actionText, onAction, actionLabel }) {
  const handleAction = action || onAction;
  const buttonText = actionText || actionLabel;

  return (
    <div className="empty-state">
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
