import { describe, it, expect, beforeEach } from 'vitest';
import { importBackup, loadStudyState } from '../storage';
import { StudyStateV1, BackupData } from '../../types/state';

describe('Backup & Restore System', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('imports valid BackupData wrapper and persists to storage', () => {
    const backup: BackupData = {
      exportedAt: '2026-08-22T00:00:00.000Z',
      appVersion: '1.0.0',
      state: {
        version: 1,
        completedLessons: ['020', '030', '074'],
        bookmarkedLessons: ['074'],
        bookmarkedSyntax: [59],
        lessonNotes: {
          '074': 'Reduce combines elements using a reducer function.'
        },
        lastOpenedLessonId: '074',
        recentLessonIds: ['074'],
        theme: 'dark',
        preferredMode: 'quickReview',
        updatedAt: '2026-08-22T00:00:00.000Z'
      }
    };

    const result = importBackup(JSON.stringify(backup));
    expect(result.success).toBe(true);
    expect(result.state?.completedLessons).toEqual(['020', '030', '074']);
    expect(result.state?.lessonNotes['074']).toBe('Reduce combines elements using a reducer function.');

    const persisted = loadStudyState();
    expect(persisted.completedLessons).toEqual(['020', '030', '074']);
    expect(persisted.bookmarkedSyntax).toEqual([59]);
  });

  it('imports direct StudyStateV1 object without wrapper', () => {
    const rawState: StudyStateV1 = {
      version: 1,
      completedLessons: ['056'],
      bookmarkedLessons: ['056'],
      bookmarkedSyntax: [],
      lessonNotes: { '056': 'Note content' },
      lastOpenedLessonId: '056',
      recentLessonIds: ['056'],
      theme: 'light',
      preferredMode: 'detailed',
      updatedAt: new Date().toISOString()
    };

    const result = importBackup(JSON.stringify(rawState));
    expect(result.success).toBe(true);
    expect(result.state?.completedLessons).toEqual(['056']);
  });

  it('gracefully rejects malformed JSON strings', () => {
    const result = importBackup('{ broken json: &&');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('gracefully rejects non-object payloads', () => {
    const result = importBackup('42');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid backup format');
  });

  it('sanitizes missing fields during backup restore', () => {
    const partialBackup = {
      completedLessons: ['020', '021']
      // missing bookmarks, notes, etc.
    };

    const result = importBackup(JSON.stringify(partialBackup));
    expect(result.success).toBe(true);
    expect(result.state?.completedLessons).toEqual(['020', '021']);
    expect(result.state?.bookmarkedLessons).toEqual([]);
    expect(result.state?.lessonNotes).toEqual({});
    expect(result.state?.theme).toBe('system');
  });
});
