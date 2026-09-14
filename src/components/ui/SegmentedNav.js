import React from 'react';
import '../../styles/ui/SegmentedNav.css';

/**
 * SegmentedNav — Token-styled segment filter / tab bar (21st.dev/shadcn compatible).
 * Offers disciplined active segment tracking without bloated tabs libraries.
 */
export function SegmentedNav({
  items = [],
  activeId,
  onChange,
  className = ''
}) {
  return (
    <div className={`velora-segmented-nav ${className}`} role="tablist">
      {items.map((item) => {
        const isActive = activeId === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={isActive}
            className={`velora-segment-btn ${isActive ? 'active' : ''}`}
            onClick={() => onChange(item.id)}
          >
            {Icon && <Icon size={14} strokeWidth={1.5} />}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span className="velora-segment-badge">{item.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedNav;
