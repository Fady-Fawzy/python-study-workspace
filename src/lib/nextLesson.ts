import { Lesson } from '../types/content';

export type RecommendationReason = 'resume' | 'continue' | 'bookmark' | 'start';

export interface NextLessonRecommendation {
  lesson: Lesson | null;
  reason: RecommendationReason | null;
  progress: number;
}

const clampProgress = (value: number): number =>
  Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : 0;

export const getNextLessonRecommendation = (
  lessons: Lesson[],
  completedIds: Iterable<string>,
  bookmarkedIds: Iterable<string>,
  lastOpenedLessonId: string | null,
  readProgress: (lessonId: string) => number,
): NextLessonRecommendation => {
  const completed = new Set(completedIds);
  const bookmarks = new Set(bookmarkedIds);
  const incompleteLessons = lessons.filter((lesson) => !completed.has(lesson.id));

  if (incompleteLessons.length === 0) {
    return { lesson: null, reason: null, progress: 100 };
  }

  const lastLesson = lessons.find((lesson) => lesson.id === lastOpenedLessonId);
  const lastProgress = lastLesson ? clampProgress(readProgress(lastLesson.id)) : 0;

  if (lastLesson && !completed.has(lastLesson.id) && lastProgress > 0 && lastProgress < 90) {
    return { lesson: lastLesson, reason: 'resume', progress: lastProgress };
  }

  if (lastLesson) {
    const lastIndex = lessons.findIndex((lesson) => lesson.id === lastLesson.id);
    const nextLesson = incompleteLessons.find((lesson) => lessons.indexOf(lesson) > lastIndex);
    if (nextLesson) {
      return {
        lesson: nextLesson,
        reason: 'continue',
        progress: clampProgress(readProgress(nextLesson.id)),
      };
    }
  }

  const bookmarkedLesson = incompleteLessons.find((lesson) => bookmarks.has(lesson.id));
  if (bookmarkedLesson) {
    return {
      lesson: bookmarkedLesson,
      reason: 'bookmark',
      progress: clampProgress(readProgress(bookmarkedLesson.id)),
    };
  }

  const firstLesson = incompleteLessons[0];
  return {
    lesson: firstLesson,
    reason: 'start',
    progress: clampProgress(readProgress(firstLesson.id)),
  };
};
