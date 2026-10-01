import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, Circle } from 'lucide-react';
import { CURRICULUM } from '../data/curriculum';
import { getAnalyticsData } from '../utils/analyticsStorage';
import '../styles/Challenges.css';

/**
 * Guided paths.
 *
 * This screen used to be a fiction. A "7-day sprint" with "4 days remaining",
 * "28 spots left (out of 100 Genesis Badges)", 1,420 participants, a progress
 * bar frozen at "Day 4 of 7 (57%)" for every person who ever opened it, and a
 * leaderboard of five invented people - one of which was labelled You. Velora
 * has no accounts, no server and no way to know another human exists, so every
 * one of those numbers was written by hand.
 *
 * What remains is the part that can be true. A path is a module the curriculum
 * actually teaches, in the order it is written. A lesson is ticked when the
 * reader has recorded real minutes on it, on this device. Add a module to the
 * curriculum and a path appears here by itself: there is no second list of
 * claims to keep in sync, because there is no second set of facts.
 */

const SUBJECTS = Object.entries(CURRICULUM).map(([id, record]) => ({ id, label: record.name }));

const keyFor = (value) => String(value || '').trim().toLowerCase();

function Challenges({ setScreen, onOpenLesson }) {
  const [subjectId, setSubjectId] = useState(SUBJECTS[0].id);
  // Read once per visit. This screen mounts on navigation, and minutes are only
  // ever written when a reader closes - so navigating back is the refresh.
  const [analytics] = useState(() => getAnalyticsData());

  const minutesByTopic = useMemo(() => {
    const map = new Map();
    (analytics.topicTimeDistribution || [])
      .filter((entry) => (entry.subject || 'physics') === subjectId && (entry.hours || 0) > 0)
      .forEach((entry) => {
        const minutes = Math.round((entry.hours || 0) * 60);
        map.set(keyFor(entry.topic), (map.get(keyFor(entry.topic)) || 0) + minutes);
      });
    return map;
  }, [analytics, subjectId]);

  const subject = CURRICULUM[subjectId];

  const paths = (subject.modules || []).map((module) => {
    const steps = module.topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      kicker: topic.kicker,
      minutes: topic.minutes || 0,
      minutesLogged: minutesByTopic.get(keyFor(topic.title)) || 0,
    }));
    return {
      id: `${subjectId}:${module.id}`,
      title: module.title,
      intro: module.intro,
      steps,
      logged: steps.filter((step) => step.minutesLogged > 0).length,
      readingMinutes: steps.reduce((total, step) => total + step.minutes, 0),
      loggedMinutes: steps.reduce((total, step) => total + step.minutesLogged, 0),
    };
  });

  const lessonCount = paths.reduce((total, path) => total + path.steps.length, 0);
  const loggedCount = paths.reduce((total, path) => total + path.logged, 0);
  const readingMinutes = paths.reduce((total, path) => total + path.readingMinutes, 0);
  const loggedMinutes = paths.reduce((total, path) => total + path.loggedMinutes, 0);
  const percent = lessonCount ? Math.round((loggedCount / lessonCount) * 100) : 0;

  return (
    <div className="challenges-page-root">
      <header className="challenges-nav-header">
        <button className="challenges-back-btn" onClick={() => setScreen('universe')}>
          ← Return to Universe
        </button>
        <h1 className="challenges-title-bar">Guided Paths</h1>
        <div style={{ width: '80px' }} aria-hidden="true"></div>
      </header>

      <main className="challenges-main-content">
        <div className="sprint-picker-tabs" role="tablist" aria-label="Subject">
          {SUBJECTS.map((option) => (
            <button
              key={option.id}
              role="tab"
              aria-selected={subjectId === option.id}
              className={`sprint-tab-btn ${subjectId === option.id ? 'active' : ''}`}
              onClick={() => setSubjectId(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <section className="sprint-hero-card">
          <div className="sprint-badge-row">
            <span className="sprint-domain-badge">{subject.name}</span>
          </div>

          <h2 className="sprint-main-heading">
            {paths.length} paths · {lessonCount} lessons · {readingMinutes} minutes of reading
          </h2>
          <p className="sprint-lead-text">
            A path is a module this app actually teaches, in the order it is written. A lesson is
            ticked when you have spent time on it - the reader counts those minutes on this device,
            so an unticked lesson is the truth and not a bug waiting to happen.
          </p>

          <div className="sprint-progress-wrapper">
            <div className="progress-info-row">
              <span className="progress-label">Lessons you have opened</span>
              <span className="progress-value">
                {loggedCount} of {lessonCount}
                {loggedMinutes > 0 ? ` · ${loggedMinutes} min logged` : ' · no time logged yet'}
              </span>
            </div>
            <div
              className="sprint-track"
              role="progressbar"
              aria-valuenow={loggedCount}
              aria-valuemin={0}
              aria-valuemax={lessonCount}
              aria-label={`Lessons opened in ${subject.name}`}
            >
              <div className="sprint-fill" style={{ width: `${percent}%` }}></div>
            </div>
          </div>
        </section>

        <div className="sprint-milestones-col">
          <h3 className="col-header-title">Paths in {subject.name}</h3>
          <div className="milestones-stack">
            {paths.map((path) => (
              <div key={path.id} className="milestone-day-card">
                <div className="day-number-pill">{path.steps.length} lessons</div>
                <div className="day-info-block">
                  <h4 className="day-title">{path.title}</h4>
                  <span className="day-status-text">{path.intro}</span>

                  <ul className="path-step-list">
                    {path.steps.map((step) => (
                      <li key={step.id} className={`path-step ${step.minutesLogged > 0 ? 'logged' : ''}`}>
                        <span className="path-step-mark" aria-hidden="true">
                          {step.minutesLogged > 0 ? <Check size={15} /> : <Circle size={15} />}
                        </span>
                        <span className="path-step-copy">
                          <span className="path-step-title">{step.title}</span>
                          <span className="path-step-kicker">{step.kicker}</span>
                        </span>
                        <span className="path-step-meta">
                          {step.minutesLogged > 0
                            ? `${step.minutesLogged} min logged`
                            : `${step.minutes} min read`}
                        </span>
                        {onOpenLesson && (
                          <button className="start-day-btn" onClick={() => onOpenLesson(subjectId, step.id)}>
                            {step.minutesLogged > 0 ? 'Open again' : 'Start'}
                            <ArrowRight size={14} aria-hidden="true" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Challenges;
