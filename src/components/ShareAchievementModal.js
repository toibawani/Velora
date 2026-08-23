import React, { useState } from 'react';
import '../styles/ShareAchievementModal.css';

/**
 * ShareAchievementModal Component
 * 
 * Generates viral, share-worthy milestone celebration moments with:
 * - High-res SVG achievement badge
 * - 1-click native sharing to WhatsApp, X (Twitter), LinkedIn, and Instagram Stories
 * - Pre-filled viral copy with link attribution
 */
function ShareAchievementModal({ isOpen, onClose, milestone = 'Black Holes Mastery', score = '100% Concept Retention', userName = 'Explorer' }) {
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const shareCopy = `I just mastered ${milestone} on VELORA 🌌 Exploring deep astrophysics through interactive visual simulations: https://velora.app`;

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

  const handleCopyCaption = () => {
    navigator.clipboard?.writeText(shareCopy);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="share-modal-header">
          <span className="milestone-badge-tag">🏆 MILESTONE UNLOCKED</span>
          <button className="share-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Visual Achievement Card */}
        <div className="achievement-graphic-card">
          <div className="badge-svg-container">
            <svg viewBox="0 0 160 160" className="milestone-badge-svg">
              <circle cx="80" cy="80" r="72" fill="none" stroke="#4f7df3" strokeWidth="3" opacity="0.3" />
              <circle cx="80" cy="80" r="64" fill="#141414" stroke="#4f7df3" strokeWidth="2" />
              <circle cx="80" cy="80" r="50" fill="rgba(79, 125, 243, 0.1)" stroke="#34c759" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="80" y="74" fontSize="28" textAnchor="middle" dominantBaseline="middle">
                🌌
              </text>
              <text x="80" y="110" fontSize="10" fill="#ffffff" fontWeight="800" textAnchor="middle" letterSpacing="1">
                VELORA MASTER
              </text>
            </svg>
          </div>

          <h2 className="milestone-achievement-name">{milestone}</h2>
          <span className="achievement-recipient">Awarded to {userName} · {score}</span>
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
      </div>
    </div>
  );
}

export default ShareAchievementModal;
