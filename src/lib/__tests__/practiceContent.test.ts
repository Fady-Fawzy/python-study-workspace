import { describe, expect, it } from 'vitest';
import { PRACTICE_LESSON_SOURCES } from '../../content/practice';
import { parsePracticeLessons, selectPracticeLesson } from '../practiceContent';

const expectedLessons = new Map([
  ['020', 'Arithmetic Operators'],
  ['021', 'Lists'],
  ['022', 'List Methods Part 1'],
  ['023', 'List Methods Part 2'],
  ['024', 'Tuples And Methods Part 1'],
  ['025', 'Tuples And Methods Part 2']
]);

describe('practice content', () => {
  it('validates the six initial lesson banks and maps each lesson correctly', () => {
    const map = parsePracticeLessons(PRACTICE_LESSON_SOURCES);

    expect(Object.keys(map).sort()).toEqual([...expectedLessons.keys()].sort());

    for (const [id, title] of expectedLessons) {
      const lesson = selectPracticeLesson(id, map);

      expect(lesson).toBeDefined();
      expect(lesson?.title).toBe(title);
      expect(lesson?.questions.length).toBeGreaterThanOrEqual(5);

      const questionIds = new Set(lesson?.questions.map(question => question.id));
      expect(questionIds.size).toBe(lesson?.questions.length);

      for (const question of lesson?.questions ?? []) {
        expect(['multiple-choice', 'predict-output', 'behavior']).toContain(question.type);
        expect(question.prompt.trim()).not.toBe('');
        expect(question.explanation.trim()).not.toBe('');
        expect(question.choices.length).toBeGreaterThanOrEqual(2);
        expect(question.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(question.correctAnswer).toBeLessThan(question.choices.length);
      }
    }

    expect(selectPracticeLesson('026', map)).toBeUndefined();
  });

  it('rejects duplicate lesson IDs and invalid answer references', () => {
    const duplicate = PRACTICE_LESSON_SOURCES[0];

    expect(() => parsePracticeLessons([duplicate, duplicate])).toThrow(/duplicate lesson id/i);
    expect(() => parsePracticeLessons([{
      ...duplicate,
      id: '099',
      number: 99,
      questions: [{
        ...duplicate.questions[0],
        correctAnswer: 99
      }]
    }])).toThrow(/correct answer/i);
  });
});
