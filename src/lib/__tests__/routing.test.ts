import { describe, it, expect } from 'vitest';
import { parseRoute, normalizePath } from '../routing';

describe('Static Route Parser', () => {
  it('parses root paths as dashboard', () => {
    expect(parseRoute('/')).toEqual({ view: 'dashboard' });
    expect(parseRoute('')).toEqual({ view: 'dashboard' });
    expect(parseRoute('#/')).toEqual({ view: 'dashboard' });
  });

  it('parses lesson paths with padded IDs', () => {
    expect(parseRoute('/lesson/056')).toEqual({ view: 'lesson', lessonId: '056' });
    expect(parseRoute('#/lesson/020')).toEqual({ view: 'lesson', lessonId: '020' });
    expect(parseRoute('#/lesson/074')).toEqual({ view: 'lesson', lessonId: '074' });
  });

  it('parses syntax reference paths with optional section query parameters', () => {
    expect(parseRoute('/reference')).toEqual({ view: 'reference', sectionId: null });
    expect(parseRoute('#/reference')).toEqual({ view: 'reference', sectionId: null });
    expect(parseRoute('/reference?section=59')).toEqual({ view: 'reference', sectionId: 59 });
    expect(parseRoute('#/reference?section=3')).toEqual({ view: 'reference', sectionId: 3 });
  });

  it('parses bookmarks and notes routes', () => {
    expect(parseRoute('/bookmarks')).toEqual({ view: 'bookmarks' });
    expect(parseRoute('#/bookmarks')).toEqual({ view: 'bookmarks' });
    expect(parseRoute('/notes')).toEqual({ view: 'notes' });
    expect(parseRoute('#/notes')).toEqual({ view: 'notes' });
  });

  it('normalizes path strings reliably', () => {
    expect(normalizePath('#/lesson/022')).toBe('/lesson/022');
    expect(normalizePath('lesson/022')).toBe('/lesson/022');
    expect(normalizePath('')).toBe('/');
    expect(normalizePath('/')).toBe('/');
    expect(normalizePath('#')).toBe('/');
  });
});
