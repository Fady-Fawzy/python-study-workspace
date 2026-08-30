import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearReadingCheckpoint,
  clearReadingPosition,
  readReadingCheckpoint,
  readReadingPosition,
  writeReadingCheckpoint,
  writeReadingPosition
} from './readingPosition';

const STORAGE_KEY = 'py_study_workspace_reading_positions_v1';
const CHECKPOINT_STORAGE_KEY = 'py_study_workspace_reading_checkpoints_v2';

describe('reading position persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('round-trips a valid lesson position and clears it by lesson', () => {
    expect(readReadingPosition('020')).toBe(0);

    writeReadingPosition('020', 240);

    expect(readReadingPosition('020')).toBe(240);
    expect(readReadingPosition('021')).toBe(0);

    clearReadingPosition('020');

    expect(readReadingPosition('020')).toBe(0);
  });

  it('ignores invalid positions and recovers from malformed storage', () => {
    writeReadingPosition('020', 180);
    writeReadingPosition('020', -1);
    writeReadingPosition('020', Number.NaN);
    writeReadingPosition('020', Number.POSITIVE_INFINITY);

    expect(readReadingPosition('020')).toBe(180);

    localStorage.setItem(STORAGE_KEY, '{bad json');

    expect(readReadingPosition('020')).toBe(0);
  });

  it('round-trips an exact section checkpoint', () => {
    writeReadingCheckpoint('020', {
      y: 640,
      sectionId: '020-comparisons-2',
      sectionText: 'Comparisons',
      updatedAt: '2026-08-30T10:00:00.000Z'
    });

    expect(readReadingCheckpoint('020')).toEqual({
      y: 640,
      sectionId: '020-comparisons-2',
      sectionText: 'Comparisons',
      updatedAt: '2026-08-30T10:00:00.000Z'
    });
    expect(readReadingPosition('020')).toBe(640);
  });

  it('uses a legacy numeric position when no structured checkpoint exists', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ '020': 420 }));

    expect(readReadingCheckpoint('020')).toEqual({
      y: 420,
      sectionId: null,
      sectionText: null,
      updatedAt: null
    });
  });

  it('sanitizes invalid checkpoint fields and recovers from corrupt JSON', () => {
    localStorage.setItem(CHECKPOINT_STORAGE_KEY, JSON.stringify({
      '020': {
        y: 90,
        sectionId: '   ',
        sectionText: 42,
        updatedAt: 'not-a-date'
      },
      '021': { y: -1, sectionId: 'bad', sectionText: 'Bad', updatedAt: null }
    }));

    expect(readReadingCheckpoint('020')).toEqual({
      y: 90,
      sectionId: null,
      sectionText: null,
      updatedAt: null
    });
    expect(readReadingCheckpoint('021')).toEqual({
      y: 0,
      sectionId: null,
      sectionText: null,
      updatedAt: null
    });

    localStorage.setItem(CHECKPOINT_STORAGE_KEY, '{bad json');
    expect(readReadingCheckpoint('020')).toEqual({
      y: 0,
      sectionId: null,
      sectionText: null,
      updatedAt: null
    });
  });

  it('ignores invalid writes and clears both checkpoint generations', () => {
    writeReadingPosition('020', 180);
    writeReadingCheckpoint('020', {
      y: 300,
      sectionId: 'valid',
      sectionText: 'Valid',
      updatedAt: '2026-08-30T10:00:00.000Z'
    });
    writeReadingCheckpoint('020', {
      y: -2,
      sectionId: 'invalid',
      sectionText: 'Invalid'
    });

    expect(readReadingCheckpoint('020').y).toBe(300);

    clearReadingCheckpoint('020');

    expect(readReadingCheckpoint('020').y).toBe(0);
    expect(readReadingPosition('020')).toBe(0);
  });
});
