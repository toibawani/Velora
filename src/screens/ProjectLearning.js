import React, { useState } from 'react';
import '../styles/Components.css';

function ProjectLearning({ topic, subject, onBack }) {
  const [activeProject, setActiveProject] = useState(0);

  const projects = [
    {
      title: 'Build a Real-World Application',
      description: 'Create something practical using this concept',
      steps: [
        'Understand the core concept',
        'Plan your project architecture',
        'Implement the solution',
        'Test and debug',
        'Optimize and deploy',
      ],
      difficulty: 'Intermediate',
    },
    {
      title: 'Solve Real Problems',
      description: 'Find and solve actual problems using this concept',
      steps: [
        'Identify a problem',
        'Break it down',
        'Apply the concept',
        'Validate the solution',
        'Share your work',
      ],
      difficulty: 'Hard',
    },
    {
      title: 'Teach Someone Else',
      description: 'Create a tutorial or guide',
      steps: [
        'Master the concept',
        'Create examples',
        'Write clear explanations',
        'Make it visual',
        'Share and get feedback',
      ],
      difficulty: 'Medium',
    },
  ];

  const project = projects[activeProject];

  return (
    <div className="learn-container">
      <div className="learn-header">
        <button className="learn-back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>🎯 Project-Based Learning</h1>
        <div style={{ width: '60px' }}></div>
      </div>

      <div className="projects-container">
        <div className="project-selector">
          {projects.map((proj, idx) => (
            <button
              key={idx}
              className={`project-btn ${idx === activeProject ? 'active' : ''}`}
              onClick={() => setActiveProject(idx)}
            >
              {proj.title}
            </button>
          ))}
        </div>

        <div className="project-detail">
          <h2>{project.title}</h2>
          <p className="project-description">{project.description}</p>
          <span className="project-difficulty">📍 {project.difficulty}</span>

          <div className="project-steps">
            <h3>Project Steps:</h3>
            {project.steps.map((step, idx) => (
              <div key={idx} className="step-item">
                <span className="step-number">{idx + 1}</span>
                <span className="step-text">{step}</span>
              </div>
            ))}
          </div>

          <button className="btn-start-project">Start Project →</button>
        </div>
      </div>
    </div>
  );
}

export default ProjectLearning;