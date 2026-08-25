import { afterEach, describe, expect, it } from 'vitest';
import {
  getStudyActivitySummary,
  recordStudyActivity,
  readStudyActivity,
  STUDY_ACTIVITY_STORAGE_KEY
} from './studyActivity';

afterEach(() => {
  window.localStorage.clear();
});

describe('study activity', () => {
  it('records one local calendar day only once', () => {
    const morning = new Date(2026, 7, 25, 9, 0);
    const evening = new Date(2026, 7, 25, 21, 0);

    recordStudyActivity(morning);
    recordStudyActivity(evening);

    expect(readStudyActivity().studyDays).toEqual(['2026-08-25']);
    expect(window.localStorage.getItem(STUDY_ACTIVITY_STORAGE_KEY)).toContain('2026-08-25');
  });

  it('summarizes the current streak and active days in the last seven days', () => {
    window.localStorage.setItem(
      STUDY_ACTIVITY_STORAGE_KEY,
      JSON.stringify({ studyDays: ['2026-08-20', '2026-08-23', '2026-08-24', '2026-08-25'] })
    );

    expect(getStudyActivitySummary(new Date(2026, 7, 25))).toEqual({
      activeDaysLast7: 4,
      currentStreak: 3,
      todayStudied: true,
      totalDays: 4
    });
  });

  it('ignores malformed or impossible stored activity', () => {
    window.localStorage.setItem(
      STUDY_ACTIVITY_STORAGE_KEY,
      JSON.stringify({ studyDays: ['2026-08-25', 'not-a-date', 42, ''] })
    );

    expect(readStudyActivity()).toEqual({ studyDays: ['2026-08-25'] });
  });
});
