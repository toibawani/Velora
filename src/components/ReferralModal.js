import React, { useState } from 'react';
import '../styles/ReferralModal.css';

/**
 * ReferralModal Component
 * 
 * Implements a generous, non-paywalled peer referral system.
 * Inviter and invitee both receive a 7-day preview of Pro features (Offline downloads,
 * Verified Certificates, Cognitive Velocity Analytics).
 */
function ReferralModal({ isOpen, onClose, userName = 'Explorer' }) {
  const [copied, setCopied] = useState(false);
  const referralCode = `velora.app/join/${(userName || 'learner').toLowerCase().replace(/[^a-z0-9]/g, '')}-galaxy`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(`https://${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShare = (platform) => {
    const text = encodeURIComponent(`I'm exploring deep physics, philosophy, and history on VELORA 🌌 Join me and unlock 7 days of Pro Features: https://${referralCode}`);
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://${referralCode}`, '_blank');
    }
  };

  return (
    <div className="referral-modal-overlay" onClick={onClose}>
      <div className="referral-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="referral-header">
          <div className="referral-tag-badge">
            <span>🎁 COMMUNITY INVITATION</span>
          </div>
          <button className="referral-close-btn" onClick={onClose}>×</button>
        </div>

        <h2 className="referral-title">Invite a Fellow Mind</h2>
        <p className="referral-subtitle">
          Gift a friend 7 days of Pro Feature Previews. When they join, you both unlock full access to our offline simulation vault, verifiable certificates, and neural analytics.
        </p>

        {/* Pro Previews Grid */}
        <div className="pro-perks-grid">
          <div className="perk-box">
            <span className="perk-icon">⚡</span>
            <div className="perk-info">
              <h4 className="perk-title">Offline Module Vault</h4>
              <p className="perk-desc">Save interactive canvases and simulations for flight or low-connectivity study.</p>
            </div>
          </div>

          <div className="perk-box">
            <span className="perk-icon">📜</span>
            <div className="perk-info">
              <h4 className="perk-title">Verified Course Certificates</h4>
              <p className="perk-desc">Share credentialed completion certificates directly to LinkedIn and portfolio resumes.</p>
            </div>
          </div>

          <div className="perk-box">
            <span className="perk-icon">📊</span>
            <div className="perk-info">
              <h4 className="perk-title">Cognitive Velocity Analytics</h4>
              <p className="perk-desc">Access deep retention curve modeling and tailored peak-hour learning schedules.</p>
            </div>
          </div>
        </div>

        {/* Copy Link Row */}
        <div className="referral-link-section">
          <label className="referral-input-label">Your Personal Invitation Link</label>
          <div className="referral-input-group">
            <input
              type="text"
              readOnly
              className="referral-link-input"
              value={`https://${referralCode}`}
            />
            <button className="copy-link-btn" onClick={handleCopy}>
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="social-share-actions">
          <button className="share-btn whatsapp" onClick={() => handleShare('whatsapp')}>
            Share on WhatsApp
          </button>
          <button className="share-btn twitter" onClick={() => handleShare('twitter')}>
            Post on X (Twitter)
          </button>
          <button className="share-btn linkedin" onClick={() => handleShare('linkedin')}>
            Share on LinkedIn
          </button>
        </div>

        {/* Zero Paywall Promise */}
        <p className="zero-paywall-notice">
          ✨ <strong>No Paywalls, Ever:</strong> VELORA’s entire foundational curriculum is 100% free for everyone. Pro features are supplementary tools for power learners.
        </p>
      </div>
    </div>
  );
}

export default ReferralModal;
