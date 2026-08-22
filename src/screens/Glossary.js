import React, { useState } from 'react';
import '../styles/Glossary.css';

const GLOSSARY_DATA = {
  physics: [
    { term: 'Acceleration', def: 'Rate of change of velocity with respect to time.' },
    { term: 'Angular velocity', def: 'Rate of change of angular displacement.' },
    { term: 'Aphelion', def: 'Point in orbit farthest from the sun.' },
    { term: 'Black hole', def: 'Region of spacetime with gravity so strong that nothing escapes.' },
    { term: 'Centripetal force', def: 'Force directed toward the center of circular motion.' },
  ],
  chemistry: [
    { term: 'Atom', def: 'Smallest unit of an element retaining its properties.' },
    { term: 'Covalent bond', def: 'Chemical bond formed by sharing electrons between atoms.' },
    { term: 'Catalyst', def: 'Substance that speeds up a reaction without being consumed.' },
    { term: 'Isotope', def: 'Atoms of same element with different numbers of neutrons.' },
    { term: 'pH', def: 'Measure of acidity or alkalinity of a substance.' },
  ],
  biology: [
    { term: 'Mitochondria', def: 'Organelle responsible for energy production in cells.' },
    { term: 'Photosynthesis', def: 'Process by which plants convert light energy to chemical energy.' },
    { term: 'Enzyme', def: 'Protein that catalyzes biochemical reactions.' },
    { term: 'DNA', def: 'Deoxyribonucleic acid; molecule carrying genetic instructions.' },
    { term: 'Meiosis', def: 'Cell division process that produces gametes.' },
  ],
};

function Glossary({ setScreen }) {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('physics');

  const allTerms = Object.values(GLOSSARY_DATA).flat();
  const filteredTerms = search 
    ? allTerms.filter(t => t.term.toLowerCase().includes(search.toLowerCase()))
    : GLOSSARY_DATA[selectedSubject];

  return (
    <div className="glossary-page">
      <header className="glossary-header">
        <div className="container">
          <h1>Fun - Glossaries & Dictionaries</h1>
          <button className="btn btn-primary" onClick={() => setScreen('dashboard')}>
            Back
          </button>
        </div>
      </header>

      <main className="container glossary-main">
        <input 
          type="text"
          placeholder="Search terms... (e.g., acceleration, DNA, catalyst)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        {!search && (
          <div className="subject-filters">
            {Object.keys(GLOSSARY_DATA).map((subject) => (
              <button
                key={subject}
                className={`filter-btn ${selectedSubject === subject ? 'active' : ''}`}
                onClick={() => setSelectedSubject(subject)}
              >
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </button>
            ))}
          </div>
        )}

        <div className="terms-grid">
          {filteredTerms.map((item, idx) => (
            <div key={idx} className="term-card">
              <h3>{item.term}</h3>
              <p>{item.def}</p>
            </div>
          ))}
        </div>

        <div className="glossary-footer">
          <p>📚 Glossaries available for: Physics • Chemistry • Biology • Mathematics • Philosophy</p>
        </div>
      </main>
    </div>
  );
}

export default Glossary;