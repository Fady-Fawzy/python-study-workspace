import { StudyStateV1, BackupData } from '../types/state';

const STORAGE_KEY = 'py_study_workspace_state_v1';
const BACKUP_VERSION = '1.0.0';

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

    return {
      version: 1,
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      bookmarkedLessons: Array.isArray(parsed.bookmarkedLessons) ? parsed.bookmarkedLessons : [],
      bookmarkedSyntax: Array.isArray(parsed.bookmarkedSyntax) ? parsed.bookmarkedSyntax : [],
      lessonNotes: (parsed.lessonNotes && typeof parsed.lessonNotes === 'object') ? parsed.lessonNotes : {},
      lastOpenedLessonId: typeof parsed.lastOpenedLessonId === 'string' ? parsed.lastOpenedLessonId : '020',
      recentLessonIds: Array.isArray(parsed.recentLessonIds) ? parsed.recentLessonIds : ['020'],
      theme: ['dark', 'light', 'system'].includes(parsed.theme) ? parsed.theme : 'system',
      preferredMode: ['detailed', 'quickReview'].includes(parsed.preferredMode) ? parsed.preferredMode : 'detailed',
      updatedAt: parsed.updatedAt || new Date().toISOString()
    };
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
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toISOString().split('T')[0];
  a.download = `python-study-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Validates and imports JSON backup data.
 */
export function importBackup(jsonString: string): { success: boolean; state?: StudyStateV1; error?: string } {
  try {
    const data = JSON.parse(jsonString);
    const candidate = data.state || data; // Support either full backup wrapper or bare state

    if (!candidate || typeof candidate !== 'object') {
      return { success: false, error: 'Invalid backup format' };
    }

    const sanitized: StudyStateV1 = {
      version: 1,
      completedLessons: Array.isArray(candidate.completedLessons) ? candidate.completedLessons : [],
      bookmarkedLessons: Array.isArray(candidate.bookmarkedLessons) ? candidate.bookmarkedLessons : [],
      bookmarkedSyntax: Array.isArray(candidate.bookmarkedSyntax) ? candidate.bookmarkedSyntax : [],
      lessonNotes: (candidate.lessonNotes && typeof candidate.lessonNotes === 'object') ? candidate.lessonNotes : {},
      lastOpenedLessonId: typeof candidate.lastOpenedLessonId === 'string' ? candidate.lastOpenedLessonId : '020',
      recentLessonIds: Array.isArray(candidate.recentLessonIds) ? candidate.recentLessonIds : ['020'],
      theme: ['dark', 'light', 'system'].includes(candidate.theme) ? candidate.theme : 'system',
      preferredMode: ['detailed', 'quickReview'].includes(candidate.preferredMode) ? candidate.preferredMode : 'detailed',
      updatedAt: new Date().toISOString()
    };

    saveStudyState(sanitized);
    return { success: true, state: sanitized };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Failed to parse JSON file' };
  }
}
