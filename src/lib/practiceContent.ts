import { PracticeLesson, PracticeLessonMap, PracticeQuestionType } from '../types/practice';

const SUPPORTED_TYPES = new Set<PracticeQuestionType>([
  'multiple-choice',
  'predict-output',
  'behavior'
]);

const nonEmpty = (value: unknown): value is string => (
  typeof value === 'string' && value.trim().length > 0
);

export function parsePracticeLessons(sources: readonly PracticeLesson[]): PracticeLessonMap {
  const map: PracticeLessonMap = {};

  for (const lesson of sources) {
    if (map[lesson.id]) {
      throw new Error(`Duplicate lesson ID: ${lesson.id}`);
    }
    if (!/^\d{3}$/.test(lesson.id) || lesson.number !== Number(lesson.id)) {
      throw new Error(`Practice lesson ID and number do not match: ${lesson.id}`);
    }
    if (!nonEmpty(lesson.title)) {
      throw new Error(`Practice lesson ${lesson.id} is missing a title`);
    }
    if (!Array.isArray(lesson.questions) || lesson.questions.length === 0) {
      throw new Error(`Practice lesson ${lesson.id} must contain questions`);
    }

    const questionIds = new Set<string>();
    for (const question of lesson.questions) {
      if (!nonEmpty(question.id) || questionIds.has(question.id)) {
        throw new Error(`Duplicate or missing question ID in lesson ${lesson.id}`);
      }
      questionIds.add(question.id);

      if (!SUPPORTED_TYPES.has(question.type)) {
        throw new Error(`Unsupported practice question type in ${lesson.id}/${question.id}`);
      }
      if (!nonEmpty(question.prompt) || !nonEmpty(question.explanation)) {
        throw new Error(`Practice question ${lesson.id}/${question.id} needs prompt and explanation`);
      }
      if (!Array.isArray(question.choices) || question.choices.length < 2) {
        throw new Error(`Practice question ${lesson.id}/${question.id} needs at least two choices`);
      }
      if (!Number.isInteger(question.correctAnswer)
        || question.correctAnswer < 0
        || question.correctAnswer >= question.choices.length) {
        throw new Error(`Invalid correct answer for practice question ${lesson.id}/${question.id}`);
      }
      if (question.choices.some(choice => !nonEmpty(choice))) {
        throw new Error(`Practice question ${lesson.id}/${question.id} has an empty choice`);
      }
      if (question.code !== undefined && !nonEmpty(question.code)) {
        throw new Error(`Practice question ${lesson.id}/${question.id} has empty code`);
      }
      if (question.output !== undefined && !nonEmpty(question.output)) {
        throw new Error(`Practice question ${lesson.id}/${question.id} has empty output`);
      }
    }

    map[lesson.id] = lesson;
  }

  return map;
}

export function selectPracticeLesson(
  lessonId: string,
  map: PracticeLessonMap
): PracticeLesson | undefined {
  return map[lessonId];
}
