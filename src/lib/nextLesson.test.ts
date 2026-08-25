import { describe, expect, it } from 'vitest';
import { Lesson } from '../types/content';
import { getNextLessonRecommendation } from './nextLesson';

const lessons: Lesson[] = [
  { id: '020', number: 20, title: 'Arithmetic Operators', category: 'Operators', rawMarkdown: '', parsedSections: [], toc: [], methods: [], quickReviewSectionIds: [] },
  { id: '021', number: 21, title: 'Lists', category: 'Lists', rawMarkdown: '', parsedSections: [], toc: [], methods: [], quickReviewSectionIds: [] },
  { id: '022', number: 22, title: 'List Methods', category: 'Lists', rawMarkdown: '', parsedSections: [], toc: [], methods: [], quickReviewSectionIds: [] },
  { id: '023', number: 23, title: 'More List Methods', category: 'Lists', rawMarkdown: '', parsedSections: [], toc: [], methods: [], quickReviewSectionIds: [] },
];

const readProgress = (values: Record<string, number>) => (lessonId: string) => values[lessonId] ?? 0;

describe('getNextLessonRecommendation', () => {
  it('resumes an incomplete lesson with a saved partial reading position', () => {
    const recommendation = getNextLessonRecommendation(
      lessons,
      [],
      [],
      '021',
      readProgress({ '021': 42 }),
    );

    expect(recommendation.lesson?.id).toBe('021');
    expect(recommendation.reason).toBe('resume');
    expect(recommendation.progress).toBe(42);
  });

  it('continues with the next lesson after the last lesson is complete', () => {
    const recommendation = getNextLessonRecommendation(
      lessons,
      ['020', '021'],
      [],
      '021',
      readProgress({ '021': 100 }),
    );

    expect(recommendation.lesson?.id).toBe('022');
    expect(recommendation.reason).toBe('continue');
  });

  it('chooses the first incomplete bookmarked lesson when no resume cue exists', () => {
    const recommendation = getNextLessonRecommendation(
      lessons,
      ['020'],
      ['023', '022'],
      null,
      readProgress({}),
    );

    expect(recommendation.lesson?.id).toBe('022');
    expect(recommendation.reason).toBe('bookmark');
  });

  it('falls back to the first incomplete lesson', () => {
    const recommendation = getNextLessonRecommendation(lessons, ['020'], [], null, readProgress({}));

    expect(recommendation.lesson?.id).toBe('021');
    expect(recommendation.reason).toBe('start');
  });

  it('returns no recommendation after every lesson is complete', () => {
    const recommendation = getNextLessonRecommendation(
      lessons,
      ['020', '021', '022', '023'],
      [],
      '023',
      readProgress({ '023': 100 }),
    );

    expect(recommendation.lesson).toBeNull();
    expect(recommendation.reason).toBeNull();
    expect(recommendation.progress).toBe(100);
  });
});
