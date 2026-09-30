import type { DictionarySubject } from './types';

/**
 * The subjects the console can filter by, in the order the rail shows them.
 * 'all' is first because it is the default filter, not because it is a subject.
 */
export const DICTIONARY_SUBJECTS: DictionarySubject[] = [
  { id: 'all', name: 'All Subjects' },
  { id: 'physics', name: 'Physics' },
  { id: 'biology', name: 'Biology' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'philosophy', name: 'Philosophy' },
  { id: 'history', name: 'History' },
  { id: 'political-science', name: 'Political Science' },
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'psychology', name: 'Psychology' },
  { id: 'economics', name: 'Economics' },
];

export default DICTIONARY_SUBJECTS;
