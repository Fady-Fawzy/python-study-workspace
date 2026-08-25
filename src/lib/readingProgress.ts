export const READING_PROGRESS_STORAGE_KEY = 'py_study_workspace_reading_progress_v1';

type ReadingProgressMap = Record<string, number>;

const clampPercentage = (value: number): number =>
  Math.min(100, Math.max(0, Math.round(value)));

const readProgressMap = (): ReadingProgressMap => {
  try {
    const raw = window.localStorage.getItem(READING_PROGRESS_STORAGE_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    return Object.entries(parsed).reduce<ReadingProgressMap>((result, [lessonId, value]) => {
      if (lessonId.trim() && typeof value === 'number' && Number.isFinite(value)) {
        result[lessonId] = clampPercentage(value);
      }
      return result;
    }, {});
  } catch {
    return {};
  }
};

const persistProgressMap = (progressMap: ReadingProgressMap): void => {
  try {
    window.localStorage.setItem(READING_PROGRESS_STORAGE_KEY, JSON.stringify(progressMap));
  } catch {
    // Storage can be unavailable in private browsing or restricted environments.
  }
};

export const readReadingProgress = (lessonId: string): number => {
  if (!lessonId.trim()) return 0;
  return readProgressMap()[lessonId] ?? 0;
};

export const writeReadingProgress = (lessonId: string, progress: number): void => {
  if (!lessonId.trim() || !Number.isFinite(progress)) return;
  const progressMap = readProgressMap();
  progressMap[lessonId] = clampPercentage(progress);
  persistProgressMap(progressMap);
};

export const clearReadingProgress = (lessonId: string): void => {
  if (!lessonId.trim()) return;
  const progressMap = readProgressMap();
  delete progressMap[lessonId];
  persistProgressMap(progressMap);
};

export const calculateReadingProgress = (scrollTop: number, maxScrollTop: number): number => {
  if (!Number.isFinite(scrollTop) || !Number.isFinite(maxScrollTop) || maxScrollTop <= 0) return 0;
  return clampPercentage((Math.max(0, scrollTop) / maxScrollTop) * 100);
};
