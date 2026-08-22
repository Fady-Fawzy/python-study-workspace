import { describe, it, expect } from 'vitest';
import {
  LESSON_TO_SYNTAX_MAP,
  LESSON_CATEGORIES,
  SYNTAX_CATEGORIES,
  getCategoryForLesson,
  getCategoryForSyntaxSection
} from '../lessonMapping';

describe('Lesson to Syntax Reference Deterministic Mapping', () => {
  it('covers all 55 lessons from 20 to 74', () => {
    for (let lessonNum = 20; lessonNum <= 74; lessonNum++) {
      const mapped = LESSON_TO_SYNTAX_MAP[lessonNum];
      expect(mapped, `Missing mapping for lesson ${lessonNum}`).toBeDefined();
      expect(Array.isArray(mapped)).toBe(true);
      expect(mapped.length).toBeGreaterThan(0);
    }
  });

  it('guarantees all mapped syntax IDs reference valid sections (1..67)', () => {
    for (let lessonNum = 20; lessonNum <= 74; lessonNum++) {
      const sectionIds = LESSON_TO_SYNTAX_MAP[lessonNum];
      for (const id of sectionIds) {
        expect(id).toBeGreaterThanOrEqual(1);
        expect(id).toBeLessThanOrEqual(67);
      }
    }
  });

  it('verifies representative lesson mappings across the full curriculum', () => {
    const expectations: Record<number, number[]> = {
      20: [1],
      22: [3],
      30: [7],
      41: [16, 17],
      47: [21],
      51: [22],
      56: [26, 27],
      60: [32, 33],
      64: [37],
      65: [38],
      69: [44, 45, 46, 47, 48, 49, 50, 51],
      72: [57, 60],
      73: [58, 60],
      74: [59, 60]
    };

    for (const [lessonStr, expectedSections] of Object.entries(expectations)) {
      const lessonNum = Number(lessonStr);
      expect(LESSON_TO_SYNTAX_MAP[lessonNum]).toEqual(expectedSections);
    }
  });

  it('assigns meaningful topic categories to every lesson and syntax section', () => {
    for (let lessonNum = 20; lessonNum <= 74; lessonNum++) {
      const cat = getCategoryForLesson(lessonNum);
      expect(cat).toBeTruthy();
      expect(cat).not.toBe('General');
    }

    for (let sectionNum = 1; sectionNum <= 67; sectionNum++) {
      const cat = getCategoryForSyntaxSection(sectionNum);
      expect(cat).toBeTruthy();
    }
  });

  it('ensures category groupings cover all lessons and syntax sections', () => {
    const totalLessonRanges = LESSON_CATEGORIES.reduce((acc, g) => acc + (g.range[1] - g.range[0] + 1), 0);
    expect(totalLessonRanges).toBe(55);

    const totalGroupedSyntax = SYNTAX_CATEGORIES.reduce((acc, c) => acc + c.sectionIds.length, 0);
    expect(totalGroupedSyntax).toBe(67);
  });
});
