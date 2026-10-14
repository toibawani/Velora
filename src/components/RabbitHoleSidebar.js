import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { getRabbitHoleConnections } from '../data/rabbitHoles';
import '../styles/RabbitHole.css';

/**
 * RabbitHoleSidebar
 *
 * An editorial sidebar revealing three unexpected, genuine connections to
 * completely different fields for the active topic.
 */
function RabbitHoleSidebar({
  topicId,
  topicTitle,
  subject,
  isOpen,
  onClose,
  onNavigateFigure,
}) {
  const panelRef = useRef(null);

  const connections = getRabbitHoleConnections(topicId, topicTitle, subject);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="rabbit-hole-scrim"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="rabbit-hole-sidebar open"
        ref={panelRef}
        role="dialog"
        aria-label="Rabbit Hole Mode: Cross-discipline connections"
        aria-modal="true"
      >
        <header className="rabbit-hole-header">
          <div className="rabbit-hole-title-group">
            <span className="rabbit-hole-badge">Cross-discipline synthesis</span>
            <h2 className="rabbit-hole-heading">Rabbit Hole Mode</h2>
            <p className="rabbit-hole-subhead">
              Three unexpected bridges from <strong>{topicTitle || 'this idea'}</strong> into completely different fields of human thought.
            </p>
          </div>
          <button
            type="button"
            className="rabbit-hole-close-btn"
            onClick={onClose}
            aria-label="Close rabbit hole sidebar"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="rabbit-hole-content">
          {connections.map((item, index) => {
            const stepNum = String(index + 1).padStart(2, '0');
            return (
              <article key={item.title} className="rabbit-hole-card">
                <div className="rabbit-hole-card-top">
                  <span className="rabbit-hole-step">{stepNum}</span>
                  <span className="rabbit-hole-discipline">{item.discipline}</span>
                </div>
                <h3 className="rabbit-hole-card-title">{item.title}</h3>
                <p className="rabbit-hole-card-body">{item.explanation}</p>

                {item.actionType === 'dialogue' && item.targetFigure && (
                  <button
                    type="button"
                    className="rabbit-hole-action-btn"
                    onClick={() => {
                      onClose();
                      onNavigateFigure?.(item.targetFigure);
                    }}
                  >
                    <Sparkles size={14} aria-hidden="true" />
                    Discuss with {item.targetFigure === 'socrates' ? 'Socrates' : item.targetFigure === 'einstein' ? 'Albert Einstein' : item.targetFigure === 'rumi' ? 'Rumi' : item.targetFigure === 'curie' ? 'Marie Curie' : item.targetFigure === 'chanakya' ? 'Chanakya' : 'Ibn Rushd'}
                    <ArrowRight size={13} aria-hidden="true" />
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </aside>
    </>
  );
}

RabbitHoleSidebar.propTypes = {
  topicId: PropTypes.string,
  topicTitle: PropTypes.string,
  subject: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onNavigateFigure: PropTypes.func,
};

export default RabbitHoleSidebar;
