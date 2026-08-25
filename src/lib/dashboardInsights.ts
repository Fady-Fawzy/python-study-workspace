import { Lesson } from '../types/content';
import { NextLessonRecommendation } from './nextLesson';

export type DashboardInsightReason = 'focus' | 'recent' | 'partial' | 'bookmark';

export interface DashboardInsightItem {
  lesson: Lesson;
  progress: number;
  completed: boolean;
  reason: DashboardInsightReason;
}

export interface DashboardInsights {
  focus: DashboardInsightItem | null;
  queue: DashboardInsightItem[];
  attention: DashboardInsightItem[];
}

const MAX_QUEUE_ITEMS = 3;
const MAX_ATTENTION_ITEMS = 3;

const normalizeProgress = (value: number): number => (
  Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : 0
);

const progressFor = (
  progressMap: Record<string, number>,
  lessonId: string,
  fallback = 0,
): number => normalizeProgress(
  typeof progressMap[lessonId] === 'number' ? progressMap[lessonId] : fallback,
);

export const getDashboardInsights = (
  lessons: Lesson[],
  completedIds: Iterable<string>,
  bookmarkedIds: Iterable<string>,
  recentIds: Iterable<string>,
  recommendation: NextLessonRecommendation,
  progressMap: Record<string, number>,
): DashboardInsights => {
  const completed = new Set(completedIds);
  const bookmarks = [...new Set(bookmarkedIds)];
  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const focusLesson = recommendation.lesson
    ? lessonById.get(recommendation.lesson.id) ?? null
    : null;
  const focus = focusLesson
    ? {
      lesson: focusLesson,
      progress: progressFor(progressMap, focusLesson.id, recommendation.progress),
      completed: completed.has(focusLesson.id),
      reason: 'focus' as const,
    }
    : null;
  const seenQueue = new Set<string>();
  const queue: DashboardInsightItem[] = [];

  for (const lessonId of recentIds) {
    if (queue.length >= MAX_QUEUE_ITEMS || seenQueue.has(lessonId) || lessonId === focusLesson?.id) {
      continue;
    }

    const lesson = lessonById.get(lessonId);
    if (!lesson) continue;

    seenQueue.add(lessonId);
    queue.push({
      lesson,
      progress: progressFor(progressMap, lesson.id),
      completed: completed.has(lesson.id),
      reason: 'recent',
    });
  }

  const focusId = focusLesson?.id;
  const partialLessons = lessons
    .map((lesson, index) => ({
      lesson,
      index,
      progress: progressFor(progressMap, lesson.id),
    }))
    .filter(({ lesson, progress }) => (
      !completed.has(lesson.id)
      && lesson.id !== focusId
      && progress > 0
      && progress < 100
    ))
    .sort((a, b) => a.progress - b.progress || a.index - b.index);

  const attention: DashboardInsightItem[] = [];
  const seenAttention = new Set<string>();

  for (const { lesson, progress } of partialLessons) {
    if (attention.length >= MAX_ATTENTION_ITEMS) break;

    seenAttention.add(lesson.id);
    attention.push({
      lesson,
      progress,
      completed: false,
      reason: 'partial',
    });
  }

  for (const lessonId of bookmarks) {
    if (attention.length >= MAX_ATTENTION_ITEMS || seenAttention.has(lessonId) || lessonId === focusId) {
      continue;
    }

    const lesson = lessonById.get(lessonId);
    if (!lesson || completed.has(lesson.id)) continue;

    seenAttention.add(lesson.id);
    attention.push({
      lesson,
      progress: progressFor(progressMap, lesson.id),
      completed: false,
      reason: 'bookmark',
    });
  }

  return { focus, queue, attention };
};
