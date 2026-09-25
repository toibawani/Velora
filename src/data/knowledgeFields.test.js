import { KNOWLEDGE_FIELDS, KNOWLEDGE_STATS, findKnowledgeTopic } from './knowledgeFields';

describe('VELORA knowledge atlas', () => {
  test('publishes the six requested major fields in editorial order', () => {
    expect(KNOWLEDGE_FIELDS.map((field) => field.label)).toEqual([
      'Science',
      'Philosophy',
      'History',
      'Political Science',
      'Geography',
      'Literature',
    ]);
    expect(KNOWLEDGE_STATS).toEqual({ fields: 6, disciplines: 34, topics: 572 });
  });

  test('keeps every field, discipline, and module addressable', () => {
    const fieldIds = new Set();
    const disciplineIds = new Set();

    KNOWLEDGE_FIELDS.forEach((field) => {
      expect(fieldIds.has(field.id)).toBe(false);
      fieldIds.add(field.id);
      expect(field.description.length).toBeGreaterThan(20);

      field.disciplines.forEach((discipline) => {
        const uniqueDisciplineId = `${field.id}:${discipline.id}`;
        expect(disciplineIds.has(uniqueDisciplineId)).toBe(false);
        disciplineIds.add(uniqueDisciplineId);
        expect(discipline.modules.length).toBeGreaterThan(0);
        discipline.modules.forEach((module) => expect(module.topics.length).toBeGreaterThan(0));
      });
    });
  });

  test('resolves representative topics through the full hierarchy', () => {
    expect(findKnowledgeTopic('science', 'physics', 'Quantum Physics', 'Superposition')?.discipline.name).toBe('Physics');
    expect(findKnowledgeTopic('philosophy', 'philosophy-branches', 'Metaphysics', 'Existence')?.field.label).toBe('Philosophy');
    expect(findKnowledgeTopic('history', 'indian-history', 'Indian Historical Traditions', 'Mughal Empire')?.topic).toBe('Mughal Empire');
    expect(findKnowledgeTopic('political-science', 'international-relations', 'Global Affairs', 'Diplomacy')?.discipline.name).toBe('International Relations');
    expect(findKnowledgeTopic('geography', 'physical-geography', 'Climatology', 'Monsoons')?.module.name).toBe('Climatology');
    expect(findKnowledgeTopic('literature', 'major-authors', 'Major Authors', 'Rabindranath Tagore')?.field.id).toBe('literature');
  });
});
