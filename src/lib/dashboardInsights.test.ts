import { describe, expect, it } from 'vitest';
import { Lesson } from '../types/content';
import { NextLessonRecommendation } from './nextLesson';
import { getDashboardInsights } from './dashboardInsights';

const lessons: Lesson[] = ['020', '021', '022', '023', '024', '025'].map((id) => ({
  id,
  number: Number(id),
  title: `Lesson ${id}`,
  category: 'Study',
  rawMarkdown: '',
  parsedSections: [],
  toc: [],
  methods: [],
  quickReviewSectionIds: []
}));

const recommendation = (lessonId: string | null, progress = 0): NextLessonRecommendation => ({
  lesson: lessonId ? lessons.find((lesson) => lesson.id === lessonId) ?? null : null,
  reason: lessonId ? 'continue' : null,
  progress
});

describe('dashboardInsights', () => {
  it('derives a focus item from the smart recommendation with normalized progress', () => {
    const insights = getDashboardInsights(
      lessons,
      [],
      [],
      [],
      recommendation('021', 37),
      { '021': 37.4 },
    );

    expect(insights.focus).toMatchObject({
      lesson: lessons[1],
      progress: 37,
      completed: false,
      reason: 'focus'
    });
  });

  it('builds an ordered recent queue without invalid ids or the focus duplicate', () => {
    const insights = getDashboardInsights(
      lessons,
      ['024'],
      [],
      ['021', '020', '999', '020', '024', '023'],
      recommendation('021'),
      { '020': 25, '024': 100 },
    );

    expect(insights.queue.map((item) => item.lesson.id)).toEqual(['020', '024', '023']);
    expect(insights.queue[1]).toMatchObject({ progress: 100, completed: true });
  });

  it('prioritizes partial lessons then bookmarked incomplete lessons in attention', () => {
    const insights = getDashboardInsights(
      lessons,
      [],
      ['025', '023'],
      [],
      recommendation('021'),
      { '020': 25, '022': 78, '023': 0, '024': 95 },
    );

    expect(insights.attention.map((item) => item.lesson.id)).toEqual(['020', '022', '024']);
    expect(insights.attention.map((item) => item.reason)).toEqual(['partial', 'partial', 'partial']);
  });

  it('uses bookmarks as attention items when no partial progress is available', () => {
    const insights = getDashboardInsights(
      lessons,
      [],
      ['025', '023'],
      [],
      recommendation('021'),
      {},
    );

    expect(insights.attention.map((item) => item.lesson.id)).toEqual(['025', '023']);
    expect(insights.attention.every((item) => item.reason === 'bookmark')).toBe(true);
  });

  it('returns no focus and a bounded attention list when every lesson is complete', () => {
    const insights = getDashboardInsights(
      lessons,
      lessons.map((lesson) => lesson.id),
      [],
      ['025', '024'],
      recommendation(null, 100),
      { '020': 24, '021': 40, '022': 60, '023': 80 },
    );

    expect(insights.focus).toBeNull();
    expect(insights.attention).toEqual([]);
    expect(insights.queue.map((item) => item.lesson.id)).toEqual(['025', '024']);
  });
});
