import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  parseDetailedLesson,
  parseDetailedLessonSources,
  selectDetailedLesson
} from '../detailedContent';
import { Lesson } from '../../types/content';

const readDetailedSource = (lessonId: string): string =>
  fs.readFileSync(
    path.resolve(process.cwd(), `src/content/detailed/${lessonId}.md`),
    'utf-8'
  );

describe('Detailed Study content', () => {
  it('parses Lesson 020 into teaching blocks with semantic outputs and a useful TOC', () => {
    const lesson = parseDetailedLesson(readDetailedSource('020'), '020');

    expect(lesson.id).toBe('020');
    expect(lesson.title).toContain('Arithmetic Operators');
    expect(lesson.blocks.some(block => block.type === 'prose')).toBe(true);
    expect(lesson.blocks.some(block => block.type === 'code')).toBe(true);
    expect(lesson.blocks.some(block => block.type === 'output')).toBe(true);
    expect(lesson.toc.map(item => item.text)).toEqual(expect.arrayContaining([
      expect.stringContaining('Addition'),
      expect.stringContaining('Floor Division')
    ]));

    const source = lesson.rawMarkdown;
    for (const operator of ['/', '//', '%', '**']) {
      expect(source).toContain(operator);
    }
  });

  it('selects enriched content when available and preserves the original lesson fallback otherwise', () => {
    const detailed020 = parseDetailedLesson(readDetailedSource('020'), '020');
    const base020 = { id: '020' } as Lesson;
    const base026 = { id: '026' } as Lesson;
    const detailedLessons = { '020': detailed020 };

    expect(selectDetailedLesson(base020, detailedLessons)).toBe(detailed020);
    expect(selectDetailedLesson(base026, detailedLessons)).toBeNull();
  });

  it('teaches List structure, indexing, slicing, and mutation in Lesson 021', () => {
    const lesson = parseDetailedLesson(readDetailedSource('021'), '021');
    const source = lesson.rawMarkdown;

    expect(lesson.title).toContain('Lists');
    expect(source).toContain('ordered');
    expect(source).toContain('mutable');
    expect(source).toContain('my_list[-1]');
    expect(source).toContain('my_list[1:4]');
    expect(source).toContain('my_list[::2]');
    expect(source).toContain('my_list[0:2]');
    expect(lesson.blocks.filter(block => block.type === 'output').length).toBeGreaterThan(3);
  });

  it('teaches and compares all five List methods in Lesson 022', () => {
    const lesson = parseDetailedLesson(readDetailedSource('022'), '022');
    const source = lesson.rawMarkdown;

    for (const method of ['append()', 'extend()', 'remove()', 'sort()', 'reverse()']) {
      expect(source).toContain(method);
    }
    expect(source).toContain('friends[-1][1]');
    expect(source).toContain('None');
    expect(lesson.blocks.some(block => block.type === 'comparison')).toBe(true);
    expect(lesson.blocks.some(block => block.type === 'warning')).toBe(true);
    expect(lesson.toc.map(item => item.text)).toEqual(expect.arrayContaining([
      expect.stringContaining('append()'),
      expect.stringContaining('extend()'),
      expect.stringContaining('reverse()')
    ]));
  });

  it('teaches all six List methods and remove-versus-pop semantics in Lesson 023', () => {
    const lesson = parseDetailedLesson(readDetailedSource('023'), '023');
    const source = lesson.rawMarkdown;

    for (const method of ['clear()', 'copy()', 'count()', 'index()', 'insert()', 'pop()']) {
      expect(source).toContain(method);
    }
    expect(source.toLowerCase()).toContain('shallow copy');
    expect(source).toContain('items.insert(-1, "Test")');
    expect(source).toContain('deleted_item = items.pop(2)');
    expect(source).toContain('remove(value)');
    expect(source).toContain('pop(index)');
    expect(lesson.blocks.some(block => block.type === 'comparison')).toBe(true);
    expect(lesson.blocks.some(block => block.type === 'error')).toBe(true);
  });

  it('teaches Tuple creation, indexing, and immutability in Lesson 024', () => {
    const lesson = parseDetailedLesson(readDetailedSource('024'), '024');
    const source = lesson.rawMarkdown;

    expect(source).toContain('Tuple = ordered, immutable sequence');
    expect(source).toContain('tuple_two = "Ahmed", "Mohamed"');
    expect(source).toContain('numbers[-3]');
    expect(source).toContain('numbers[1] = 100');
    expect(source).toContain('TypeError');
    expect(lesson.blocks.some(block => block.type === 'error')).toBe(true);
    expect(lesson.blocks.some(block => block.type === 'comparison')).toBe(true);
  });

  it('teaches one-item tuples, operations, methods, and unpacking in Lesson 025', () => {
    const lesson = parseDetailedLesson(readDetailedSource('025'), '025');
    const source = lesson.rawMarkdown;

    expect(source).toContain('("Python")');
    expect(source).toContain('("Python",)');
    expect(source.toLowerCase()).toContain('single-item tuple');
    expect(source).toContain('c = a + b');
    expect(source).toContain('numbers.count(8)');
    expect(source).toContain('numbers.index(30)');
    expect(source.toLowerCase()).toContain('unpacking');
    expect(source).toContain('name, _, country = person');
    expect(source).toContain('valid variable name');
    expect(lesson.blocks.some(block => block.type === 'warning')).toBe(true);
  });

  it('loads exactly the six enriched lessons with valid structured teaching content and no duplicate IDs', () => {
    const ids = ['020', '021', '022', '023', '024', '025'];
    const sources = Object.fromEntries(ids.map(id => [id, readDetailedSource(id)]));
    const lessons = parseDetailedLessonSources(sources);

    expect(Object.keys(lessons)).toEqual(ids);
    expect(new Set(Object.values(lessons).map(lesson => lesson.id)).size).toBe(6);

    for (const id of ids) {
      const lesson = lessons[id];
      expect(lesson.id).toBe(id);
      expect(lesson.title.trim().length).toBeGreaterThan(0);
      expect(lesson.blocks.some(block => block.type === 'prose')).toBe(true);
      expect(lesson.blocks.some(block => block.type === 'code')).toBe(true);
      expect(lesson.blocks.some(block => block.type === 'output' || block.type === 'error')).toBe(true);
      expect(lesson.toc.length).toBeGreaterThan(1);
    }
  });
});
