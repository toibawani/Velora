import React from 'react';
import { motion } from 'motion/react';
import '../../styles/ui/StatCard.css';

/**
 * StatCard — Minimal, high-contrast metric card primitive.
 * Designed to conform to VELORA design tokens with zero default color bleed.
 */
export function StatCard({
  icon: Icon,
  label,
  value,
  description,
  trend,
  className = '',
  onClick
}) {
  return (
    <motion.div
      className={`velora-stat-card ${onClick ? 'interactive' : ''} ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={onClick ? { y: -2 } : undefined}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <div className="velora-stat-header">
        <span className="velora-stat-label">{label}</span>
        {Icon && (
          <span className="velora-stat-icon">
            <Icon size={16} strokeWidth={1.5} color="var(--color-accent)" />
          </span>
        )}
      </div>

      <div className="velora-stat-body">
        <div className="velora-stat-value">{value}</div>
        {trend && (
          <span className={`velora-stat-trend ${trend.type || 'neutral'}`}>
            {trend.text}
          </span>
        )}
      </div>

      {description && <p className="velora-stat-desc">{description}</p>}
    </motion.div>
  );
}

export default StatCard;
