import { beforeEach, describe, expect, it } from 'vitest';
import {
  calculateReadingProgress,
  clearReadingProgress,
  readAllReadingProgress,
  readReadingProgress,
  writeReadingProgress,
} from './readingProgress';

describe('readingProgress', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('calculates a clamped percentage from the scroll range', () => {
    expect(calculateReadingProgress(0, 0)).toBe(0);
    expect(calculateReadingProgress(250, 1000)).toBe(25);
    expect(calculateReadingProgress(-10, 1000)).toBe(0);
    expect(calculateReadingProgress(1200, 1000)).toBe(100);
  });

  it('rounds and persists one normalized percentage per lesson', () => {
    writeReadingProgress('020', 42.6);

    expect(readReadingProgress('020')).toBe(43);
    expect(readReadingProgress('021')).toBe(0);
  });

  it('ignores malformed storage and invalid progress values', () => {
    window.localStorage.setItem('py_study_workspace_reading_progress_v1', '{bad');
    expect(readReadingProgress('020')).toBe(0);

    writeReadingProgress('020', Number.NaN);
    expect(readReadingProgress('020')).toBe(0);

    window.localStorage.setItem(
      'py_study_workspace_reading_progress_v1',
      JSON.stringify({ '020': 140, '021': -4, '022': 'half' }),
    );
    expect(readReadingProgress('020')).toBe(100);
    expect(readReadingProgress('021')).toBe(0);
    expect(readReadingProgress('022')).toBe(0);
  });

  it('clears one lesson without affecting the other lesson progress', () => {
    writeReadingProgress('020', 25);
    writeReadingProgress('021', 75);

    clearReadingProgress('020');

    expect(readReadingProgress('020')).toBe(0);
    expect(readReadingProgress('021')).toBe(75);
  });

  it('returns a sanitized snapshot without exposing the stored object', () => {
    window.localStorage.setItem(
      'py_study_workspace_reading_progress_v1',
      JSON.stringify({ '020': 42.6, '021': 140, '022': -4, '023': 'half', '  ': 50 }),
    );

    const snapshot = readAllReadingProgress();

    expect(snapshot).toEqual({ '020': 43, '021': 100, '022': 0 });
    snapshot['020'] = 100;
    expect(readReadingProgress('020')).toBe(43);
  });
});
