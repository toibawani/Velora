import React from 'react';
import '../../styles/ui/StatCard.css';

/**
 * A single metric: a label, a number, and optionally why that number moved.
 *
 * This used to animate itself in with motion/react, which was never listed in
 * package.json - it only worked because a stale copy of the package was
 * sitting in node_modules. The enter animation is a CSS keyframe now, so the
 * card costs nothing to render and nothing to bundle.
 */

/** Anything shaped like a lucide icon: it takes size/strokeWidth/color props. */
export type IconComponent = React.ComponentType<{
  size?: number | string;
  strokeWidth?: number;
  color?: string;
}>;

export type StatTrendKind = 'positive' | 'warning' | 'neutral';

export interface StatTrend {
  text: string;
  /** Defaults to neutral. Drives both the class and the word used to read it out. */
  type?: StatTrendKind;
}

export interface StatCardProps {
  icon?: IconComponent;
  label: string;
  value: string | number;
  description?: string;
  trend?: StatTrend;
  className?: string;
  /**
   * Pass this and the card becomes a real button. It used to be a div with an
   * onClick, which meant it could not be reached from the keyboard at all.
   */
  onClick?: () => void;
  /**
   * Draws the same box with a skeleton inside. The dimensions are held by the
   * card itself rather than by its content, so swapping to real numbers does
   * not shove the row below it down the page.
   */
  loading?: boolean;
  /** Stagger for the reveal, in index order. Only affects animation-delay. */
  index?: number;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  description,
  trend,
  className = '',
  onClick,
  loading = false,
  index = 0,
}: StatCardProps) {
  const classes = [
    'velora-stat-card',
    onClick ? 'interactive' : '',
    loading ? 'is-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style: React.CSSProperties | undefined =
    index > 0 ? { animationDelay: `${Math.min(index, 8) * 45}ms` } : undefined;

  const body = loading ? (
    <>
      <div className="velora-stat-header">
        <span className="velora-stat-skeleton skeleton-bar skeleton-bar--label" />
      </div>
      <div className="velora-stat-body">
        <span className="velora-stat-skeleton skeleton-bar skeleton-bar--value" />
      </div>
      <span className="velora-stat-skeleton skeleton-bar skeleton-bar--desc" />
    </>
  ) : (
    <>
      <div className="velora-stat-header">
        <span className="velora-stat-label">{label}</span>
        {Icon && (
          <span className="velora-stat-icon">
            <Icon size={16} strokeWidth={1.5} color="var(--accent-primary)" />
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
    </>
  );

  /* A loading card announces nothing useful yet, so it stays out of the
     accessibility tree rather than reading out a grey rectangle. */
  if (onClick && !loading) {
    return (
      <button
        type="button"
        className={classes}
        style={style}
        onClick={onClick}
      >
        {body}
      </button>
    );
  }

  return (
    <div className={classes} style={style} aria-busy={loading || undefined}>
      {body}
    </div>
  );
}

export default StatCard;
