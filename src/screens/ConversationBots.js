import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, Send, Sparkles, Trash2 } from 'lucide-react';
import { BOTS, BOT_LIST, generateBotResponse } from '../data/conversationBots';
import {
  getBotConversation,
  saveBotConversation,
  clearBotConversation,
} from '../utils/botStorage';
import { getProfile } from '../utils/localProfile';
import '../styles/ConversationBots.css';

/**
 * ConversationBots Screen
 *
 * Implements historical figure dialogues with Einstein, Rumi, Socrates,
 * Ibn Rushd, Chanakya, and Marie Curie.
 */
function ConversationBots({ setScreen, initialFigureId = 'einstein', showToast }) {
  const [activeFigureId, setActiveFigureId] = useState(() => {
    return BOTS[initialFigureId] ? initialFigureId : 'einstein';
  });

  const profile = getProfile();
  const authUid = profile?.name || 'local_scholar';

  const [messages, setMessages] = useState(() => {
    return getBotConversation(activeFigureId, authUid);
  });

  const [inputText, setInputText] = useState('');
  const transcriptEndRef = useRef(null);

  // Switch figure: reload its saved history
  const handleSelectFigure = (figureId) => {
    setActiveFigureId(figureId);
    const saved = getBotConversation(figureId, authUid);
    setMessages(saved);
  };

  const activeBot = BOTS[activeFigureId] || BOTS.einstein;

  // Auto-scroll on new message
  useEffect(() => {
    if (typeof transcriptEndRef.current?.scrollIntoView === 'function') {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMessage = {
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputText('');

    // Generate authentic figure response
    const botReplyText = generateBotResponse(activeFigureId, query, nextMessages);
    const botMessage = {
      sender: 'bot',
      text: botReplyText,
      timestamp: new Date().toISOString(),
    };

    const updated = [...nextMessages, botMessage];
    setMessages(updated);
    saveBotConversation(activeFigureId, updated, authUid);
  };

  const handleClearHistory = () => {
    clearBotConversation(activeFigureId, authUid);
    setMessages([]);
    showToast?.(`Conversation with ${activeBot.name} cleared.`, 'info');
  };

  return (
    <div className="dialogue-console">
      {/* Navbar */}
      <header className="dialogue-navbar">
        <div className="dialogue-nav-left">
          <button
            type="button"
            className="dialogue-back-btn"
            onClick={() => setScreen('universe')}
            aria-label="Return to knowledge atlas"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Atlas
          </button>
          <div className="dialogue-title-col">
            <h1 className="dialogue-title">Intellectual Dialogues</h1>
            <span className="dialogue-sub">
              Converse directly with foundational thinkers within their own era and worldview
            </span>
          </div>
        </div>
      </header>

      {/* Figures Selector */}
      <nav className="dialogue-figures-strip" aria-label="Select historical figure">
        {BOT_LIST.map((bot) => {
          const isActive = bot.id === activeFigureId;
          return (
            <button
              key={bot.id}
              type="button"
              className={`figure-pill-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleSelectFigure(bot.id)}
              aria-pressed={isActive}
              aria-label={`Converse with ${bot.name}, ${bot.title}`}
            >
              <span className="figure-pill-avatar" aria-hidden="true">
                {bot.portrait}
              </span>
              <span className="figure-pill-name">{bot.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Dialogue Console */}
      <main className="dialogue-main">
        {/* Historical Bio & Context Card */}
        <section className="dialogue-bio-card" aria-labelledby="bio-heading">
          <div className="dialogue-bio-top">
            <h2 id="bio-heading" className="dialogue-bio-name">
              {activeBot.name}
            </h2>
            <div className="dialogue-bio-meta">
              <span>{activeBot.title}</span>
              <span>·</span>
              <span>{activeBot.dates}</span>
              <span>·</span>
              <span>{activeBot.location}</span>
            </div>
          </div>
          <p className="dialogue-bio-text">{activeBot.bio}</p>
          <p className="dialogue-context-text">
            <strong>Historical Context:</strong> {activeBot.context}
          </p>
        </section>

        {/* Thoughtful Starter Questions */}
        <section className="dialogue-starters-card" aria-label="Suggested inquiries">
          <span className="dialogue-starters-label">
            <Sparkles size={13} aria-hidden="true" /> Suggested Inquiries
          </span>
          <div className="dialogue-starters-grid">
            {activeBot.starters.map((starter) => (
              <button
                key={starter}
                type="button"
                className="dialogue-starter-chip"
                onClick={() => handleSendMessage(starter)}
              >
                {starter}
              </button>
            ))}
          </div>
        </section>

        {/* Conversation Transcript */}
        <section
          className="dialogue-transcript"
          aria-live="polite"
          aria-label={`Transcript of dialogue with ${activeBot.name}`}
        >
          {messages.length === 0 ? (
            <div className="dialogue-bubble bot">
              <span className="dialogue-bubble-sender">{activeBot.name}</span>
              <div className="dialogue-bubble-content">
                Greetings, scholar. I am ready to converse with you on matters of{' '}
                {activeBot.domain.toLowerCase()} Ask your question, and let us examine the truth of it.
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`dialogue-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}
              >
                <span className="dialogue-bubble-sender">
                  {msg.sender === 'user' ? profile?.name || 'You' : activeBot.name}
                </span>
                <div className="dialogue-bubble-content">{msg.text}</div>
              </div>
            ))
          )}
          <div ref={transcriptEndRef} />
        </section>

        {/* Clear transcript option if history exists */}
        {messages.length > 0 && (
          <button
            type="button"
            className="dialogue-clear-btn"
            onClick={handleClearHistory}
            aria-label="Clear this conversation transcript"
          >
            <Trash2 size={13} aria-hidden="true" /> Reset conversation transcript
          </button>
        )}

        {/* Input Bar */}
        <form
          className="dialogue-input-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type="text"
            className="dialogue-input-field"
            placeholder={`Ask ${activeBot.name} a question...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            aria-label={`Type your question for ${activeBot.name}`}
          />
          <button
            type="submit"
            className="dialogue-send-btn"
            disabled={!inputText.trim()}
            aria-label="Send question"
          >
            <Send size={15} aria-hidden="true" /> Send
          </button>
        </form>
      </main>
    </div>
  );
}

ConversationBots.propTypes = {
  setScreen: PropTypes.func.isRequired,
  initialFigureId: PropTypes.string,
  showToast: PropTypes.func,
};

export default ConversationBots;
