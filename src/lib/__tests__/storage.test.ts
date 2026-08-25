import { describe, it, expect, beforeEach } from 'vitest';
import { loadStudyState, saveStudyState } from '../storage';
import { StudyStateV1 } from '../../types/state';

const STORAGE_KEY = 'py_study_workspace_state_v1';

describe('Storage Layer & Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns clean initial default state when storage is empty', () => {
    const state = loadStudyState();
    expect(state).toBeDefined();
    expect(state.version).toBe(1);
    expect(state.completedLessons).toEqual([]);
    expect(state.bookmarkedLessons).toEqual([]);
    expect(state.bookmarkedSyntax).toEqual([]);
    expect(state.lessonNotes).toEqual({});
    expect(state.practiceProgress).toEqual({});
    expect(state.lastOpenedLessonId).toBe('020');
    expect(state.theme).toBe('system');
    expect(state.preferredMode).toBe('detailed');
  });

  it('performs lossless round-trip save and load', () => {
    const customState: StudyStateV1 & { lessonNoteUpdatedAt: Record<string, string> } = {
      version: 1,
      completedLessons: ['020', '021', '056'],
      bookmarkedLessons: ['056'],
      bookmarkedSyntax: [26, 27],
      lessonNotes: {
        '056': 'Functions use the def keyword and return values.'
      },
      lessonNoteUpdatedAt: {
        '056': '2026-08-25T08:30:00.000Z'
      },
      lastOpenedLessonId: '056',
      recentLessonIds: ['056', '021', '020'],
      theme: 'dark',
      preferredMode: 'quickReview',
      practiceProgress: {
        '020': {
          questionIndex: 2,
          answers: { '020-precedence': 0, '020-true-division': 1 },
          score: 1,
          completed: false
        }
      },
      updatedAt: new Date().toISOString()
    };

    const saved = saveStudyState(customState);
    expect(saved).toBe(true);

    const loaded = loadStudyState();
    expect(loaded.completedLessons).toEqual(['020', '021', '056']);
    expect(loaded.bookmarkedLessons).toEqual(['056']);
    expect(loaded.bookmarkedSyntax).toEqual([26, 27]);
    expect(loaded.lessonNotes['056']).toBe('Functions use the def keyword and return values.');
    expect(loaded.lessonNoteUpdatedAt).toEqual({ '056': '2026-08-25T08:30:00.000Z' });
    expect(loaded.lastOpenedLessonId).toBe('056');
    expect(loaded.theme).toBe('dark');
    expect(loaded.preferredMode).toBe('quickReview');
    expect(loaded.practiceProgress).toEqual({
      '020': {
        questionIndex: 2,
        answers: { '020-precedence': 0, '020-true-division': 1 },
        score: 1,
        completed: false
      }
    });
  });

  it('safely recovers from malformed/corrupt JSON without throwing', () => {
    localStorage.setItem(STORAGE_KEY, '{ invalid JSON corrupted: %%');
    const state = loadStudyState();
    expect(state).toBeDefined();
    expect(state.version).toBe(1);
    expect(state.completedLessons).toEqual([]);
    expect(state.lastOpenedLessonId).toBe('020');
  });

  it('safely recovers from non-object JSON values (numbers, strings, booleans)', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(12345));
    const state = loadStudyState();
    expect(state).toEqual(expect.objectContaining({ version: 1, lastOpenedLessonId: '020' }));
  });

  it('fills in missing fields from partial or legacy objects', () => {
    const partial = {
      completedLessons: ['020'],
      theme: 'light'
      // missing notes, bookmarks, preferredMode, etc.
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(partial));

    const state = loadStudyState();
    expect(state.completedLessons).toEqual(['020']);
    expect(state.theme).toBe('light');
    expect(state.bookmarkedLessons).toEqual([]);
    expect(state.bookmarkedSyntax).toEqual([]);
    expect(state.lessonNotes).toEqual({});
    expect(state.preferredMode).toBe('detailed');
    expect(state.practiceProgress).toEqual({});
  });

  it('validates theme and preferredMode values, falling back to safe defaults on invalid values', () => {
    const invalidValues = {
      theme: 'invalid-rainbow-theme',
      preferredMode: 'unknown-mode'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidValues));

    const state = loadStudyState();
    expect(state.theme).toBe('system');
    expect(state.preferredMode).toBe('detailed');
  });

  it('sanitizes malformed note values and typed collections loaded from storage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      completedLessons: ['020', 21, null, '020'],
      bookmarkedLessons: 'not-an-array',
      bookmarkedSyntax: [3, '4', null, 3],
      recentLessonIds: ['020', {}, '021'],
      lessonNotes: {
        '020': 'safe note',
        '021': null,
        '022': ['would crash trim'],
        '023': 23
      },
      lessonNoteUpdatedAt: {
        '020': '2026-08-25T08:00:00.000Z',
        '021': 'not-a-date',
        '022': 42
      }
    }));

    const loaded = loadStudyState();
    expect(loaded.completedLessons).toEqual(['020']);
    expect(loaded.bookmarkedLessons).toEqual([]);
    expect(loaded.bookmarkedSyntax).toEqual([3]);
    expect(loaded.recentLessonIds).toEqual(['020', '021']);
    expect(loaded.lessonNotes).toEqual({ '020': 'safe note' });
    expect(loaded.lessonNoteUpdatedAt).toEqual({ '020': '2026-08-25T08:00:00.000Z' });
    expect(() => Object.values(loaded.lessonNotes).filter(note => note.trim())).not.toThrow();
  });

  it.each([null, [], 'notes', 42])('replaces non-record lessonNotes value %p with an empty record', (lessonNotes) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lessonNotes }));
    expect(loadStudyState().lessonNotes).toEqual({});
  });

  it('keeps valid practice progress and drops malformed lesson records', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      bookmarkedLessons: ['020'],
      lessonNotes: { '020': 'Keep this note' },
      practiceProgress: {
        '020': {
          questionIndex: 1,
          answers: { '020-precedence': 0 },
          score: 1,
          completed: false
        },
        '021': {
          questionIndex: -1,
          answers: { '021-index': 'bad' },
          score: 0,
          completed: false
        },
        '022': 'not-a-progress-record'
      }
    }));

    const loaded = loadStudyState();
    expect(loaded.bookmarkedLessons).toEqual(['020']);
    expect(loaded.lessonNotes).toEqual({ '020': 'Keep this note' });
    expect(loaded.practiceProgress).toEqual({
      '020': {
        questionIndex: 1,
        answers: { '020-precedence': 0 },
        score: 1,
        completed: false
      }
    });
  });
});
