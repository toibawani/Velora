import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle } from 'lucide-react';
import '../../styles/ui/EmptyState.css';

/**
 * EmptyState — Humanized empty state container (21st.dev/shadcn compatible).
 * Replaces jarring blank spaces with informative guidance and actionable cues.
 */
export function EmptyState({
  icon: Icon = HelpCircle,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <motion.div
      className={`velora-empty-state ${className}`}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="velora-empty-icon-wrapper">
        <Icon size={28} strokeWidth={1.5} color="var(--color-accent)" />
      </div>

      <h3 className="velora-empty-title">{title}</h3>
      {description && <p className="velora-empty-description">{description}</p>}

      {actionLabel && onAction && (
        <button className="velora-empty-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}

export default EmptyState;
