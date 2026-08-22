import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { parseLessons, parseSyntaxReference, extractMethods, slugify } from '../contentParser';

const lessonsRaw = fs.readFileSync(path.resolve(process.cwd(), 'elzero_python_lessons_20_to_74.md'), 'utf-8');
const syntaxRaw = fs.readFileSync(path.resolve(process.cwd(), 'python_syntax_reference_elzero_20_74.md'), 'utf-8');

describe('Content Parser: Lessons', () => {
  const { lessons, summaryMarkdown } = parseLessons(lessonsRaw);

  it('parses exactly 55 lessons', () => {
    expect(lessons).toHaveLength(55);
  });

  it('starts at Lesson 020 and ends at Lesson 074', () => {
    expect(lessons[0].id).toBe('020');
    expect(lessons[0].number).toBe(20);
    expect(lessons[lessons.length - 1].id).toBe('074');
    expect(lessons[lessons.length - 1].number).toBe(74);
  });

  it('contains every contiguous lesson from 020 to 074 with no duplicates or missing IDs', () => {
    const ids = lessons.map(l => l.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(55);

    for (let num = 20; num <= 74; num++) {
      const padId = num.toString().padStart(3, '0');
      expect(ids).toContain(padId);
    }
  });

  it('ensures every lesson has a non-empty title and valid category', () => {
    for (const lesson of lessons) {
      expect(lesson.title.trim().length).toBeGreaterThan(0);
      expect(lesson.category.trim().length).toBeGreaterThan(0);
      expect(lesson.parsedSections.length).toBeGreaterThan(0);
    }
  });

  it('preserves code blocks and fences within parsed lessons', () => {
    const lessonWithCode = lessons.find(l => l.id === '056');
    expect(lessonWithCode).toBeDefined();
    const codeSections = lessonWithCode!.parsedSections.filter(s => s.type === 'code');
    expect(codeSections.length).toBeGreaterThan(0);
    expect(codeSections[0].content).toContain('def say_hello');
  });

  it('extracts course summary if present in raw markdown', () => {
    expect(summaryMarkdown).toBeDefined();
    expect(summaryMarkdown.length).toBeGreaterThan(0);
  });
});

describe('Content Parser: Syntax Reference', () => {
  const syntaxSections = parseSyntaxReference(syntaxRaw);

  it('parses exactly 67 syntax sections', () => {
    expect(syntaxSections).toHaveLength(67);
  });

  it('contains every contiguous section from 1 to 67 with unique IDs', () => {
    const ids = syntaxSections.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(67);

    for (let i = 1; i <= 67; i++) {
      expect(ids).toContain(i);
    }
  });

  it('ensures every syntax section has non-empty titles and content/subsections', () => {
    for (const sec of syntaxSections) {
      expect(sec.title.trim().length).toBeGreaterThan(0);
      expect(sec.category.trim().length).toBeGreaterThan(0);
      expect(sec.subsections.length).toBeGreaterThan(0);
    }
  });

  it('locates important known syntax topics semantically', () => {
    const allTitles = syntaxSections.map(s => s.title.toLowerCase());
    const allText = syntaxSections.map(s => s.rawMarkdown.toLowerCase()).join(' ');

    expect(allTitles.some(t => t.includes('arithmetic'))).toBe(true);
    expect(allTitles.some(t => t.includes('list'))).toBe(true);
    expect(allTitles.some(t => t.includes('dict'))).toBe(true);
    expect(allText).toContain('append');
    expect(allText).toContain('kwargs');
    expect(allText).toContain('lambda');
    expect(allText).toContain('reduce');
    expect(allText).toContain('filter');
    expect(allText).toContain('map');
  });
});

describe('Content Parser Helpers', () => {
  it('extracts methods and parameter patterns correctly', () => {
    const sample = 'Use items.append("x") and dict.get(key) with **kwargs and *args';
    const methods = extractMethods(sample);
    expect(methods).toContain('append()');
    expect(methods).toContain('get()');
    expect(methods).toContain('*args');
    expect(methods).toContain('**kwargs');
  });

  it('creates stable URL-safe slugs for headings', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    expect(slugify('دوال_البحث والترتيب')).toBe('دوال-البحث-والترتيب');
    expect(slugify('')).toBe('section');
  });
});
