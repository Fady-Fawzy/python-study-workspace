import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { parseLessons, parseSyntaxReference } from '../contentParser';
import { buildSearchIndex, searchIndexedItems } from '../searchIndex';

const lessonsRaw = fs.readFileSync(path.resolve(process.cwd(), 'elzero_python_lessons_20_to_74.md'), 'utf-8');
const syntaxRaw = fs.readFileSync(path.resolve(process.cwd(), 'python_syntax_reference_elzero_20_74.md'), 'utf-8');

describe('Search Engine Ranking', () => {
  const { lessons } = parseLessons(lessonsRaw);
  const syntaxSections = parseSyntaxReference(syntaxRaw);
  const index = buildSearchIndex(lessons, syntaxSections);

  it('builds a populated search index from real content', () => {
    expect(index.length).toBeGreaterThan(100);
  });

  it('ranks exact lesson number "56" with Lesson 056 as top result', () => {
    const results = searchIndexedItems('56', index);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].type).toBe('lesson');
    expect(results[0].lessonNumber).toBe(56);
    expect(results[0].title).toContain('Function And Return');
  });

  it('ranks padded lesson number "056" with Lesson 056 as top result', () => {
    const results = searchIndexedItems('056', index);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].type).toBe('lesson');
    expect(results[0].lessonNumber).toBe(56);
  });

  it('ranks method name "append" with append() as top result', () => {
    const results = searchIndexedItems('append', index);
    expect(results.length).toBeGreaterThan(0);
    const top = results[0];
    expect(top.title.toLowerCase()).toContain('append');
  });

  it('ranks "kwargs" with **kwargs and Packing/Unpacking prominently', () => {
    const results = searchIndexedItems('kwargs', index);
    expect(results.length).toBeGreaterThan(0);
    const titles = results.slice(0, 5).map(r => r.title.toLowerCase());
    expect(titles.some(t => t.includes('kwargs') || t.includes('packing'))).toBe(true);
  });

  it('ranks "reduce" with reduce() / Lesson 074 / Syntax #59-60 prominently', () => {
    const results = searchIndexedItems('reduce', index);
    expect(results.length).toBeGreaterThan(0);
    const topResults = results.slice(0, 5);
    const hasReduce = topResults.some(r => r.title.toLowerCase().includes('reduce') || r.lessonNumber === 74 || r.syntaxSectionId === 59 || r.syntaxSectionId === 60);
    expect(hasReduce).toBe(true);
  });

  it('ranks "lambda" with Lambda Function prominently', () => {
    const results = searchIndexedItems('lambda', index);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.title.toLowerCase().includes('lambda'))).toBe(true);
  });

  it('ranks "dictionary" with Dictionary content', () => {
    const results = searchIndexedItems('dictionary', index);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title.toLowerCase()).toContain('dictionary');
  });

  it('ranks "while" with While loop content', () => {
    const results = searchIndexedItems('while', index);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.title.toLowerCase().includes('while'))).toBe(true);
  });

  it('returns an empty array for empty or whitespace query', () => {
    expect(searchIndexedItems('', index)).toEqual([]);
    expect(searchIndexedItems('   ', index)).toEqual([]);
  });

  it('sorts all search results in strictly descending score order', () => {
    const results = searchIndexedItems('function', index);
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
    }
  });
});
