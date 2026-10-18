import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Legal.css';

TermsScreen.propTypes = { setScreen: PropTypes.shape({ setScreen: PropTypes.func }) };

function TermsScreen({ setScreen }) {
  return (
    <div className="legal-screen">
      <nav className="legal-nav">
        <button className="legal-back" onClick={() => setScreen('settings')}>
          Back to Settings
        </button>
      </nav>

      <main className="legal-content">
        <div className="legal-inner">
          <h1>Terms of Service</h1>
          <p className="legal-date">Last updated: 18 October 2026</p>

          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By using VELORA, you agree to these terms. If you do not agree, please do not use the application.
              VELORA is a reference book and learning tool provided as-is without warranty.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. What VELORA Is</h2>
            <p>
              VELORA is a browser-based learning application that runs entirely on your device.
              It contains educational content about physics, philosophy, history, and related subjects.
              The content is provided for informational purposes only and should not be considered
              professional advice in any field.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. What VELORA Is Not</h2>
            <p>
              VELORA is not an accredited educational institution. Completion of lessons or activities
              does not grant any certification, credential, or academic credit. VELORA does not provide
              tutoring, consulting, or professional services.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Account and Data</h2>
            <p>
              VELORA does not require accounts, email addresses, or passwords. Your progress and preferences
              are stored locally in your browser using localStorage. This data:
            </p>
            <ul>
              <li>Resides only on your device</li>
              <li>Is not transmitted to any server</li>
              <li>Will be lost if you clear your browser data or switch devices</li>
              <li>Cannot be recovered by anyone, including the developers</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Content Accuracy</h2>
            <p>
              While we strive for accuracy, VELORA's content may contain errors or become outdated.
              Scientific understanding, historical interpretation, and philosophical perspectives evolve.
              You should verify important information through authoritative sources before relying on it.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. No Warranty</h2>
            <p>
              VELORA is provided "as is" without warranties of any kind, either express or implied,
              including but not limited to warranties of merchantability, fitness for a particular purpose,
              or non-infringement.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Limitation of Liability</h2>
            <p>
              In no event shall the developers be liable for any indirect, incidental, special,
              consequential, or punitive damages arising from your use of VELORA.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Intellectual Property</h2>
            <p>
              The VELORA application, its design, and its original content are protected by copyright.
              Source URLs are provided for dictionary entries where applicable. External sources remain
              the property of their respective owners.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Modifications</h2>
            <p>
              These terms may be updated at any time. Continued use of VELORA after changes constitutes
              acceptance of the updated terms.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Contact</h2>
            <p>
              Questions about these terms can be raised through the GitHub repository at
              github.com/toibawani/Velora.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default TermsScreen;
