import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShareAchievementModal from './ShareAchievementModal';

const open = (props) =>
  render(<ShareAchievementModal isOpen onClose={() => {}} {...props} />);

describe('ShareAchievementModal', () => {
  // These defaults asserted a result nobody had earned. Any caller that
  // forgot to pass a score got a certificate claiming 100 percent retention.
  test('does not claim mastery or a perfect score when told nothing', () => {
    open({});
    expect(screen.queryByText(/100% concept retention/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/black holes mastery/i)).not.toBeInTheDocument();
    expect(screen.getByText(/no score recorded/i)).toBeInTheDocument();
  });

  test('the shared text does not say the user mastered it', () => {
    open({ milestone: 'Word Puzzle' });
    expect(screen.getByText(/I just worked through Word Puzzle/i)).toBeInTheDocument();
    expect(screen.queryByText(/just mastered/i)).not.toBeInTheDocument();
  });

  test('the shared text no longer claims astrophysics for any game', () => {
    open({ milestone: 'Word Puzzle' });
    expect(screen.queryByText(/deep astrophysics/i)).not.toBeInTheDocument();
  });

  // A run where nothing was right was still badged as a milestone.
  test('a run with nothing correct is not badged as a milestone', () => {
    open({ milestone: 'Concept Check', score: '0 of 3 correct', completed: 3 });
    expect(screen.queryByText(/MILESTONE REACHED/i)).not.toBeInTheDocument();
    expect(screen.getByText(/SESSION COMPLETE/i)).toBeInTheDocument();
  });

  test('a run with something right is badged as a milestone', () => {
    open({ milestone: 'Concept Check', score: '2 of 3 correct', completed: 3 });
    expect(screen.getByText(/MILESTONE REACHED/i)).toBeInTheDocument();
  });

  test('the real score is shown, not a placeholder', () => {
    open({ milestone: 'Concept Check', score: '2 of 3 correct', userName: 'Ada' });
    expect(screen.getByText(/Ada . 2 of 3 correct/i)).toBeInTheDocument();
  });
});
