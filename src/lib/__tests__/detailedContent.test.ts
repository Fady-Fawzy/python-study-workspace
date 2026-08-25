import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'node:child_process';
import {
  parseDetailedLesson,
  parseDetailedLessonSources,
  selectDetailedLesson
} from '../detailedContent';
import { DETAILED_LESSON_SOURCES } from '../../content/detailed';
import { Lesson } from '../../types/content';

const readDetailedSource = (lessonId: string): string =>
  fs.readFileSync(
    path.resolve(process.cwd(), `src/content/detailed/${lessonId}.md`),
    'utf-8'
  );

describe('Detailed Study content', () => {
  it('classifies interactive and environment-dependent result fences separately', () => {
    const lesson = parseDetailedLesson(`# 038 — User Input

## تجربة الإدخال

\`\`\`python
name = input("Your name: ")
print(name)
\`\`\`

\`\`\`example-run
Your name: Ahmed
Ahmed
\`\`\`

\`\`\`example-output
/home/user/project
\`\`\`
`, '038');

    expect(lesson.blocks.some(block => block.type === 'example-run')).toBe(true);
    expect(lesson.blocks.some(block => block.type === 'example-output')).toBe(true);
  });

  it('parses Lesson 020 into teaching blocks with semantic outputs and a useful TOC', () => {
    const lesson = parseDetailedLesson(readDetailedSource('020'), '020');

    expect(lesson.id).toBe('020');
    expect(lesson.title).toContain('Arithmetic Operators');
    expect(lesson.blocks.some(block => block.type === 'prose')).toBe(true);
    expect(lesson.blocks.some(block => block.type === 'code')).toBe(true);
    expect(lesson.blocks.some(block => block.type === 'output')).toBe(true);
    expect(lesson.toc.map(item => item.text)).toEqual(expect.arrayContaining([
      expect.stringContaining('Addition'),
      expect.stringContaining('Floor division')
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

  it('keeps the foundational 020 through 025 subset valid and free of duplicate IDs', () => {
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

  it('teaches Sets and Dictionaries in Lessons 026 through 032', () => {
    const expectedTopics: Record<string, string[]> = {
      '026': ['Set', 'unique', 'Indexing'],
      '027': ['clear()', 'union()', 'add()', 'copy()', 'remove()', 'discard()', 'pop()', 'update()'],
      '028': ['difference()', 'intersection()', 'symmetric_difference()'],
      '029': ['issuperset()', 'issubset()', 'isdisjoint()'],
      '030': ['Dictionary', 'keys()', 'values()', 'get('],
      '031': ['clear()', 'update()', 'copy()', 'keys()', 'values()'],
      '032': ['setdefault()', 'popitem()', 'items()', 'fromkeys()']
    };

    for (const [id, topics] of Object.entries(expectedTopics)) {
      const lesson = parseDetailedLesson(readDetailedSource(id), id);
      expect(lesson.id).toBe(id);
      expect(lesson.blocks.some(block => block.type === 'prose')).toBe(true);
      expect(lesson.blocks.some(block => block.type === 'code')).toBe(true);
      expect(lesson.blocks.some(block => block.type === 'output' || block.type === 'example-output')).toBe(true);
      expect(lesson.toc.length).toBeGreaterThan(1);
      for (const topic of topics) expect(lesson.rawMarkdown.toLowerCase()).toContain(topic.toLowerCase());
    }
  });

  it('matches Lesson 031 semantic OUTPUT blocks to a real run of its original source example', () => {
    const originalSource = fs.readFileSync(
      path.resolve(process.cwd(), 'elzero_python_lessons_20_to_74.md'),
      'utf-8'
    );
    const originalLesson = originalSource.match(/^# 031 —[\s\S]*?(?=^---$)/m)?.[0] || '';
    const originalCode = [...originalLesson.matchAll(/```python\n([\s\S]*?)```/g)]
      .map(match => match[1])
      .join('\n');
    const run = spawnSync('python3', ['-c', originalCode], { encoding: 'utf-8' });
    const lesson = parseDetailedLesson(readDetailedSource('031'), '031');
    const detailedOutput = lesson.blocks
      .filter(block => block.type === 'output')
      .map(block => block.content.trim())
      .join('\n');

    expect(run.status).toBe(0);
    expect(detailedOutput).toBe(run.stdout.trim());
  });

  it('teaches Boolean logic, conversion, and input-driven practice in Lessons 033 through 040', () => {
    const expectedTopics: Record<string, string[]> = {
      '033': ['Boolean', 'bool(', 'True', 'False'],
      '034': ['and', 'or', 'not'],
      '035': ['+=', '-=', '*=', '/=', '%='],
      '036': ['==', '!=', '>=', '<='],
      '037': ['str(', 'int(', 'float(', 'list(', 'tuple(', 'set('],
      '038': ['input()', 'String', 'strip()', 'capitalize()'],
      '039': ['email.index("@")', 'Username', 'Domain'],
      '040': ['months', 'weeks', 'days', 'seconds']
    };

    for (const [id, topics] of Object.entries(expectedTopics)) {
      const lesson = parseDetailedLesson(readDetailedSource(id), id);
      expect(lesson.id).toBe(id);
      expect(lesson.toc.length).toBeGreaterThan(1);
      for (const topic of topics) expect(lesson.rawMarkdown.toLowerCase()).toContain(topic.toLowerCase());
      if (Number(id) >= 38) {
        expect(lesson.blocks.some(block => block.type === 'example-run')).toBe(true);
      } else {
        expect(lesson.blocks.some(block => block.type === 'output' || block.type === 'example-output')).toBe(true);
      }
    }
  });

  it('teaches conditions and membership in Lessons 041 through 046', () => {
    const expectedTopics: Record<string, string[]> = {
      '041': ['if', 'elif', 'else', 'Indentation'],
      '042': ['Nested If', 'student', 'has_license'],
      '043': ['Ternary', 'value_if_true', 'value_if_false'],
      '044': ['Age Is Out Of Range', 'and', 'seconds'],
      '045': [' in ', 'not in', 'Dictionary'],
      '046': ['admins', 'update', 'delete']
    };

    for (const [id, topics] of Object.entries(expectedTopics)) {
      const lesson = parseDetailedLesson(readDetailedSource(id), id);
      expect(lesson.toc.length).toBeGreaterThan(1);
      for (const topic of topics) expect(lesson.rawMarkdown.toLowerCase()).toContain(topic.toLowerCase());
      expect(lesson.blocks.some(block => block.type === 'output' || block.type === 'example-run')).toBe(true);
    }
  });

  it('teaches while and for loop behavior in Lessons 047 through 055', () => {
    const expectedTopics: Record<string, string[]> = {
      '047': ['while', 'else', 'Infinite Loop'],
      '048': ['len(websites)', 'index', 'friends'],
      '049': ['bookmarks', 'maximum_bookmarks', 'https://'],
      '050': ['password', 'tries', 'break'],
      '051': ['for', 'String', 'Loop Finished'],
      '052': ['Even', 'Odd', '% 2'],
      '053': ['Nested For', 'people', 'skills'],
      '054': ['break', 'continue', 'pass'],
      '055': ['user.values()', 'user.items()', 'key, value']
    };

    for (const [id, topics] of Object.entries(expectedTopics)) {
      const lesson = parseDetailedLesson(readDetailedSource(id), id);
      expect(lesson.toc.length).toBeGreaterThan(1);
      for (const topic of topics) expect(lesson.rawMarkdown.toLowerCase()).toContain(topic.toLowerCase());
      expect(lesson.blocks.some(block => ['output', 'example-run'].includes(block.type))).toBe(true);
    }
  });

  it('teaches functions, argument forms, scope, recursion, and lambda in Lessons 056 through 064', () => {
    const expectedTopics: Record<string, string[]> = {
      '056': ['def ', 'return', 'say_hello()'],
      '057': ['Parameters', 'Arguments', 'addition'],
      '058': ['*names', '*skills', 'Tuple'],
      '059': ['Default Parameters', 'Unknown', 'country="Egypt"'],
      '060': ['**skills', '**my_skills', 'Dictionary'],
      '061': ['*skills', '**skills_progress', '**my_progress'],
      '062': ['Local', 'Global', 'global x'],
      '063': ['Recursion', 'countdown', 'clean_word'],
      '064': ['lambda', 'expression', 'addition']
    };

    for (const [id, topics] of Object.entries(expectedTopics)) {
      const lesson = parseDetailedLesson(readDetailedSource(id), id);
      expect(lesson.toc.length).toBeGreaterThan(1);
      for (const topic of topics) expect(lesson.rawMarkdown.toLowerCase()).toContain(topic.toLowerCase());
      expect(lesson.blocks.some(block => block.type === 'output')).toBe(true);
    }
  });

  it('teaches file modes, reading, writing, positioning, and deletion in Lessons 065 through 068', () => {
    const expectedTopics: Record<string, string[]> = {
      '065': ['open(', 'Read', 'Write', 'Append', 'Create'],
      '066': ['read(5)', 'readline()', 'readlines()', 'close()'],
      '067': ['write(', 'writelines()', 'Append', 'Mode `w`'],
      '068': ['tell()', 'seek(5)', 'truncate(10)', 'os.remove']
    };

    for (const [id, topics] of Object.entries(expectedTopics)) {
      const lesson = parseDetailedLesson(readDetailedSource(id), id);
      expect(lesson.toc.length).toBeGreaterThan(1);
      for (const topic of topics) expect(lesson.rawMarkdown.toLowerCase()).toContain(topic.toLowerCase());
      expect(lesson.blocks.some(block => block.type === 'code')).toBe(true);
      if (id !== '065') {
        expect(lesson.blocks.some(block => block.type === 'example-output' || block.type === 'output')).toBe(true);
      }
    }
  });

  it('teaches built-ins and functional transformations in Lessons 069 through 074', () => {
    const expectedTopics: Record<string, string[]> = {
      '069': ['all()', 'any()', 'bin(', 'id('],
      '070': ['sum(', 'round(', 'range(', 'sep=', 'end='],
      '071': ['abs(', 'pow(', 'min(', 'max(', 'slice('],
      '072': ['map(', 'double_number', 'lambda'],
      '073': ['filter(', 'even_number', 'startswith("A")'],
      '074': ['reduce(', 'functools', 'Map / Filter / Reduce']
    };

    for (const [id, topics] of Object.entries(expectedTopics)) {
      const lesson = parseDetailedLesson(readDetailedSource(id), id);
      expect(lesson.toc.length).toBeGreaterThan(1);
      for (const topic of topics) expect(lesson.rawMarkdown.toLowerCase()).toContain(topic.toLowerCase());
      expect(lesson.blocks.some(block => block.type === 'output')).toBe(true);
    }
  });

  it('parses exactly one enriched Detailed Study source for every Lesson 020 through 074', () => {
    const expectedIds = Array.from({ length: 55 }, (_, index) => String(index + 20).padStart(3, '0'));
    const detailedDirectory = path.resolve(process.cwd(), 'src/content/detailed');
    const fileIds = fs.readdirSync(detailedDirectory)
      .filter(file => /^\d{3}\.md$/.test(file))
      .map(file => file.slice(0, 3))
      .sort();
    const sources = Object.fromEntries(fileIds.map(id => [id, readDetailedSource(id)]));
    const lessons = parseDetailedLessonSources(sources);

    expect(fileIds).toEqual(expectedIds);
    expect(Object.keys(lessons).sort()).toEqual(expectedIds);
    expect(new Set(Object.values(lessons).map(lesson => lesson.id)).size).toBe(55);

    for (const id of expectedIds) {
      expect(lessons[id].title.trim().length).toBeGreaterThan(0);
      expect(lessons[id].blocks.some(block => block.type === 'prose')).toBe(true);
      expect(lessons[id].blocks.some(block => block.type === 'code')).toBe(true);
      expect(lessons[id].toc.length).toBeGreaterThan(1);
    }
  });

  it('maps every runtime Detailed source key to a lesson with the same ID', () => {
    const expectedIds = Array.from({ length: 55 }, (_, index) => String(index + 20).padStart(3, '0'));
    const runtimeLessons = parseDetailedLessonSources(DETAILED_LESSON_SOURCES);

    expect(Object.keys(runtimeLessons)).toEqual(expectedIds);
    for (const id of expectedIds) expect(runtimeLessons[id].id).toBe(id);
  });

  it('keeps every original non-comment Python example line in the matching Detailed lesson without copying the Summary', () => {
    const originalSource = fs.readFileSync(
      path.resolve(process.cwd(), 'elzero_python_lessons_20_to_74.md'),
      'utf-8'
    ).split(/^# ملخص أهم ما تم تغطيته من 20 إلى 74$/m)[0];
    const lessonParts = originalSource.split(/(?=^# \d{3} — )/m);

    for (const part of lessonParts) {
      const id = part.match(/^# (\d{3}) — /)?.[1];
      if (!id || Number(id) < 20 || Number(id) > 74) continue;

      const detailedSource = readDetailedSource(id);
      const detailedPython = [...detailedSource.matchAll(/```python\n([\s\S]*?)```/g)]
        .map(match => match[1])
        .join('\n');
      const pythonBlocks = [...part.matchAll(/```python\n([\s\S]*?)```/g)];
      const sourceLines = pythonBlocks.flatMap(match => match[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('#'))
      );

      for (const line of new Set(sourceLines)) {
        expect(detailedPython, `Lesson ${id} is missing from Python fences: ${line}`).toContain(line);
      }
    }
  });
});
