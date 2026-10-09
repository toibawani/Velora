import React from 'react';
import PropTypes from 'prop-types';

import { HelpCircle } from 'lucide-react';
import '../../styles/ui/EmptyState.css';

/**
 * Shown when a list has nothing in it yet, so the screen reads as "nothing
 * here yet" instead of "broken".
 *
 * The enter animation is a CSS keyframe in EmptyState.css. It used to come
 * from motion/react, which is not a dependency of this project.
 */
EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.string,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  actionLabel: PropTypes.string
};

function EmptyState({
  icon: Icon = HelpCircle,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`velora-empty-state ${className}`.trim()}>
      <div className="velora-empty-icon-wrapper">
        <Icon size={28} strokeWidth={1.5} color="var(--accent-primary)" />
      </div>

      <h3 className="velora-empty-title">{title}</h3>
      {description && <p className="velora-empty-description">{description}</p>}

      {actionLabel && onAction && (
        <button className="velora-empty-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
