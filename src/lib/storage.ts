import { StudyStateV1, BackupData } from '../types/state';

const STORAGE_KEY = 'py_study_workspace_state_v1';
const BACKUP_VERSION = '1.0.0';

const uniqueStrings = (value: unknown): string[] => (
  Array.isArray(value)
    ? [...new Set(value.filter((item): item is string => typeof item === 'string'))]
    : []
);

const uniqueNumbers = (value: unknown): number[] => (
  Array.isArray(value)
    ? [...new Set(value.filter((item): item is number => (
      typeof item === 'number' && Number.isInteger(item) && item >= 0
    )))]
    : []
);

const sanitizeLessonNotes = (value: unknown): Record<string, string> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  );
};

const isPlainRecord = (value: unknown): value is Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const sanitizeState = (candidate: Record<string, unknown>): StudyStateV1 => ({
  version: 1,
  completedLessons: uniqueStrings(candidate.completedLessons),
  bookmarkedLessons: uniqueStrings(candidate.bookmarkedLessons),
  bookmarkedSyntax: uniqueNumbers(candidate.bookmarkedSyntax),
  lessonNotes: sanitizeLessonNotes(candidate.lessonNotes),
  lastOpenedLessonId: typeof candidate.lastOpenedLessonId === 'string' || candidate.lastOpenedLessonId === null
    ? candidate.lastOpenedLessonId
    : '020',
  recentLessonIds: Array.isArray(candidate.recentLessonIds)
    ? uniqueStrings(candidate.recentLessonIds)
    : ['020'],
  theme: candidate.theme === 'dark' || candidate.theme === 'light' || candidate.theme === 'system'
    ? candidate.theme
    : 'system',
  preferredMode: candidate.preferredMode === 'quickReview' || candidate.preferredMode === 'detailed'
    ? candidate.preferredMode
    : 'detailed',
  updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : new Date().toISOString()
});

export const INITIAL_STATE: StudyStateV1 = {
  version: 1,
  completedLessons: [],
  bookmarkedLessons: [],
  bookmarkedSyntax: [],
  lessonNotes: {},
  lastOpenedLessonId: '020',
  recentLessonIds: ['020'],
  theme: 'system',
  preferredMode: 'detailed',
  updatedAt: new Date().toISOString()
};

/**
 * Safely loads state from localStorage with migration and corruption recovery.
 */
export function loadStudyState(): StudyStateV1 {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { ...INITIAL_STATE };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...INITIAL_STATE };
    }

    const parsed = JSON.parse(raw);

    // Validate and sanitize
    if (!parsed || typeof parsed !== 'object') {
      console.warn('Malformed storage detected, resetting to initial state.');
      return { ...INITIAL_STATE };
    }

    return sanitizeState(parsed as Record<string, unknown>);
  } catch (err) {
    console.error('Error reading localStorage:', err);
    return { ...INITIAL_STATE };
  }
}

/**
 * Safely saves state to localStorage.
 */
export function saveStudyState(state: StudyStateV1): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;

  try {
    const payload = JSON.stringify({
      ...state,
      updatedAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEY, payload);
    return true;
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
    return false;
  }
}

/**
 * Export state as downloadable JSON backup file.
 */
export function exportBackup(state: StudyStateV1): void {
  const backup: BackupData = {
    exportedAt: new Date().toISOString(),
    appVersion: BACKUP_VERSION,
    state
  };

  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  let url: string | null = null;
  let anchor: HTMLAnchorElement | null = null;

  try {
    url = URL.createObjectURL(blob);
    anchor = document.createElement('a');
    anchor.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    anchor.download = `python-study-backup-${dateStr}.json`;
    document.body.appendChild(anchor);
    anchor.click();
  } finally {
    anchor?.remove();
    if (url) URL.revokeObjectURL(url);
  }
}

/**
 * Validates and imports JSON backup data.
 */
export function importBackup(jsonString: string): { success: boolean; state?: StudyStateV1; error?: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!isPlainRecord(data)) {
      return { success: false, error: 'Invalid backup format' };
    }

    const candidate = Object.prototype.hasOwnProperty.call(data, 'state') ? data.state : data;
    if (!isPlainRecord(candidate)) return { success: false, error: 'Invalid backup format' };

    const sanitized = sanitizeState(candidate);
    sanitized.updatedAt = new Date().toISOString();

    saveStudyState(sanitized);
    return { success: true, state: sanitized };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Failed to parse JSON file' };
  }
}
