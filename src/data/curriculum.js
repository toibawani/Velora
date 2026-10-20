import { PHYSICS_CURRICULUM } from './physicsCurriculum';
import { PHILOSOPHY_CURRICULUM } from './philosophyCurriculum';
import { HISTORY_CURRICULUM } from './historyCurriculum';
import { CHEMISTRY_CURRICULUM } from './chemistryCurriculum';
import { BIOLOGY_CURRICULUM } from './biologyCurriculum';

export const CURRICULUM = { physics: PHYSICS_CURRICULUM, philosophy: PHILOSOPHY_CURRICULUM, history: HISTORY_CURRICULUM, chemistry: CHEMISTRY_CURRICULUM, biology: BIOLOGY_CURRICULUM };
export const getTopic = (subjectId, topicId) => (CURRICULUM[subjectId]?.modules || []).flatMap((module) => module.topics.map((topic) => ({ ...topic, moduleTitle: module.title }))).find((topic) => topic.id === topicId);
