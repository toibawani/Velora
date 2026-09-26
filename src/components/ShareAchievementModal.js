import React, { useState, useRef, useEffect } from 'react';
import { copyText, COPY_OK } from '../utils/clipboard';

/**
 * ShareAchievementModal Component
 * 
 * Generates viral, share-worthy milestone celebration moments with:
 * - High-res SVG achievement badge
 * - 1-click native sharing to WhatsApp, X (Twitter), LinkedIn, and Instagram Stories
 * - Pre-filled viral copy with link attribution
 */
/**
 * Nothing here claims mastery or a perfect score by default any more. The
 * defaults used to be "Black Holes Mastery" and "100% Concept Retention", so
 * a caller that forgot to pass a score produced a certificate asserting the
 * user had retained everything. The share text also said "I just mastered
 * this" and "exploring deep astrophysics" for any game at all, including the
 * word puzzle.
 *
 * `completed` is how many items the user actually attempted, which is what
 * lets a zero be reported as a zero rather than dressed up.
 */
function ShareAchievementModal({
  isOpen,
  onClose,
  milestone = 'Session complete',
  score = '',
  userName = '',
  completed = null,
}) {
  const [copiedText, setCopiedText] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const resetCopiedRef = useRef(null);

  useEffect(() => () => clearTimeout(resetCopiedRef.current), []);

  if (!isOpen) return null;

  const parts = [`I just worked through ${milestone} on VELORA`];
  if (score) parts.push(score);
  else if (completed !== null) parts.push(`${completed} item${completed === 1 ? '' : 's'}`);
  const shareCopy = `${parts.join(', ')}: https://velora.app`;

  const handleShare = (platform) => {
    const encodedText = encodeURIComponent(shareCopy);
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://velora.app')}&summary=${encodedText}`, '_blank');
    }
  };

  const handleCopyCaption = async () => {
    // The shared helper knows the two ways this fails: no clipboard API at
    // all on a plain http:// origin, and a rejected write when permission is
    // refused. The old code used `?.` and claimed success regardless.
    const result = await copyText(shareCopy);
    if (result === COPY_OK) {
      setCopiedText(true);
      setCopyFailed(false);
      resetCopiedRef.current = setTimeout(() => setCopiedText(false), 3000);
    } else {
      setCopiedText(false);
      setCopyFailed(true);
    }
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="share-modal-header">
          {/* Only celebrate something that happened. This said
              "MILESTONE UNLOCKED" on every share, including runs where the
              user got nothing right. */}
          <span className="milestone-badge-tag">
            {completed === 0
              ? 'SESSION STARTED'
              : score && !/^0 of /.test(score)
                ? 'MILESTONE REACHED'
                : 'SESSION COMPLETE'}
          </span>
          <button className="share-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Visual Achievement Card */}
        <div className="achievement-graphic-card">
          <div className="badge-svg-container">
            <svg viewBox="0 0 160 160" className="milestone-badge-svg">
              <circle cx="80" cy="80" r="72" fill="none" stroke="#2563EB" strokeWidth="3" opacity="0.3" />
              <circle cx="80" cy="80" r="64" fill="#141414" stroke="#2563EB" strokeWidth="2" />
              <circle cx="80" cy="80" r="50" fill="rgba(37, 99, 235, 0.1)" stroke="#34c759" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="80" y="74" fontSize="28" textAnchor="middle" dominantBaseline="middle">
                🌌
              </text>
              <text x="80" y="110" fontSize="10" fill="#ffffff" fontWeight="800" textAnchor="middle" letterSpacing="1">
                VELORA MASTER
              </text>
            </svg>
          </div>

          <h2 className="milestone-achievement-name">{milestone}</h2>
          <span className="achievement-recipient">
            {[userName, score].filter(Boolean).join(' \u00b7 ') || 'No score recorded for this session'}
          </span>
          <p className="achievement-blurb">
            Mastered mathematical escape velocities, spacetime curvature tensors, and event horizon optics.
          </p>
        </div>

        {/* Pre-filled Share Caption Box */}
        <div className="share-caption-box">
          <p className="caption-preview-text">"{shareCopy}"</p>
        </div>

        {/* Viral Share Buttons */}
        <div className="share-buttons-grid">
          <button className="viral-btn whatsapp" onClick={() => handleShare('whatsapp')}>
            Share on WhatsApp
          </button>
          <button className="viral-btn twitter" onClick={() => handleShare('twitter')}>
            Post on X (Twitter)
          </button>
          <button className="viral-btn linkedin" onClick={() => handleShare('linkedin')}>
            Share on LinkedIn
          </button>
          <button className="viral-btn copy" onClick={handleCopyCaption}>
            {copiedText ? '✓ Caption Copied!' : 'Copy Text for Instagram'}
          </button>
        </div>

        {copyFailed && (
          <p className="share-copy-fallback" role="status">
            The browser would not let this page use the clipboard, which usually
            means the site is not on https. Select the text above and copy it by
            hand.
          </p>
        )}
      </div>
    </div>
  );
}

export default ShareAchievementModal;
