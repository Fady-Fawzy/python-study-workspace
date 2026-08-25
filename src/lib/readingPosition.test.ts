import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearReadingPosition,
  readReadingPosition,
  writeReadingPosition
} from './readingPosition';

const STORAGE_KEY = 'py_study_workspace_reading_positions_v1';

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
});
