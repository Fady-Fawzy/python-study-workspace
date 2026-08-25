import { describe, expect, it } from 'vitest';
import syntaxRaw from '../../../python_syntax_reference_elzero_20_74.md?raw';
import { DETAILED_LESSON_SOURCES } from '../../content/detailed';

const arabicPattern = /[\u0600-\u06ff]/;

describe('English educational content', () => {
  it('keeps every runtime lesson and syntax explanation in English', () => {
    const sources = [
      ...Object.entries(DETAILED_LESSON_SOURCES).map(([id, source]) => ({ id, source })),
      { id: 'syntax-reference', source: syntaxRaw }
    ];

    const remainingArabic = sources
      .filter(({ source }) => arabicPattern.test(source))
      .map(({ id }) => id);

    expect(remainingArabic).toEqual([]);
  });
});
