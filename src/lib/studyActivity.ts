/**
 * A deliberately small, separate activity store for the dashboard. Keeping
 * this outside StudyStateV1 means existing backup/restore data stays backward
 * compatible while the dashboard can still show useful momentum.
 */
export const STUDY_ACTIVITY_STORAGE_KEY = 'py_study_workspace_activity_v1';

export interface StudyActivity {
  studyDays: string[];
}

export interface StudyActivitySummary {
  activeDaysLast7: number;
  currentStreak: number;
  todayStudied: boolean;
  totalDays: number;
}

const EMPTY_ACTIVITY: StudyActivity = { studyDays: [] };
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function storageAvailable(): Storage | undefined {
  if (typeof window === 'undefined' || !window.localStorage) return undefined;
  return window.localStorage;
}

function dateKey(date: Date): string {
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateFromKey(key: string): Date | null {
  if (!DATE_KEY_PATTERN.test(key)) return null;
  const [year, month, day] = key.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year
    && date.getMonth() === month - 1
    && date.getDate() === day
    ? date
    : null;
}

function normaliseDays(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return [...new Set(
    value.filter((item): item is string => (
      typeof item === 'string' && dateFromKey(item) !== null
    ))
  )].sort();
}

export function readStudyActivity(): StudyActivity {
  const storage = storageAvailable();
  if (!storage) return { ...EMPTY_ACTIVITY };

  try {
    const raw = storage.getItem(STUDY_ACTIVITY_STORAGE_KEY);
    if (!raw) return { ...EMPTY_ACTIVITY };

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { ...EMPTY_ACTIVITY };
    }

    return { studyDays: normaliseDays((parsed as { studyDays?: unknown }).studyDays) };
  } catch {
    return { ...EMPTY_ACTIVITY };
  }
}

export function recordStudyActivity(date = new Date()): StudyActivity {
  if (Number.isNaN(date.getTime())) return readStudyActivity();

  const activity = readStudyActivity();
  const studyDays = normaliseDays([...activity.studyDays, dateKey(date)]);
  const next = { studyDays };
  const storage = storageAvailable();

  if (storage) {
    try {
      storage.setItem(STUDY_ACTIVITY_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // A full/private localStorage should never prevent reading a lesson.
    }
  }

  return next;
}

function shiftDate(date: Date, offset: number): Date {
  const shifted = new Date(date);
  shifted.setDate(shifted.getDate() + offset);
  return shifted;
}

export function getStudyActivitySummary(
  now = new Date(),
  activity = readStudyActivity()
): StudyActivitySummary {
  const days = new Set(normaliseDays(activity.studyDays));
  const today = dateKey(now);
  let activeDaysLast7 = 0;

  for (let offset = 0; offset < 7; offset += 1) {
    if (days.has(dateKey(shiftDate(now, -offset)))) activeDaysLast7 += 1;
  }

  let currentStreak = 0;
  while (days.has(dateKey(shiftDate(now, -currentStreak)))) {
    currentStreak += 1;
  }

  return {
    activeDaysLast7,
    currentStreak,
    todayStudied: days.has(today),
    totalDays: days.size
  };
}
