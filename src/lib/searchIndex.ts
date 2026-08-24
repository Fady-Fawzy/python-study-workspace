import { DetailedLessonMap, Lesson, SyntaxSection, SearchResult } from '../types/content';

export interface IndexedItem {
  id: string;
  type: 'lesson' | 'syntax' | 'method';
  title: string;
  subtitle: string;
  lessonNumber?: number;
  syntaxSectionId?: number;
  url: string;
  badge: string;
  keywords: string[];
  content: string;
  exactTerms: string[];
}

export function buildSearchIndex(
  lessons: Lesson[],
  syntaxSections: SyntaxSection[],
  detailedLessons: DetailedLessonMap = {}
): IndexedItem[] {
  const index: IndexedItem[] = [];

  // Index Lessons
  for (const lesson of lessons) {
    const lessonNumStr = lesson.number.toString();
    const lessonPadStr = lesson.id; // "020"
    const detailedLesson = detailedLessons[lesson.id];

    index.push({
      id: `lesson-${lesson.id}`,
      type: 'lesson',
      title: `Lesson ${lesson.id}: ${lesson.title}`,
      subtitle: lesson.category,
      lessonNumber: lesson.number,
      url: `/lesson/${lesson.id}`,
      badge: `Lesson ${lesson.id}`,
      exactTerms: [lessonNumStr, lessonPadStr, `lesson ${lessonNumStr}`, `lesson ${lessonPadStr}`],
      keywords: [
        lesson.title.toLowerCase(),
        lesson.category.toLowerCase(),
        ...lesson.methods.map(m => m.toLowerCase()),
        ...lesson.toc.map(t => t.text.toLowerCase()),
        ...(detailedLesson?.toc.map(t => t.text.toLowerCase()) || [])
      ],
      content: [lesson.rawMarkdown, detailedLesson?.rawMarkdown || ''].join('\n').toLowerCase()
    });

    // Index Methods specifically attached to this lesson
    for (const method of lesson.methods) {
      index.push({
        id: `method-${lesson.id}-${method}`,
        type: 'method',
        title: method,
        subtitle: `In Lesson ${lesson.id} (${lesson.title})`,
        lessonNumber: lesson.number,
        url: `/lesson/${lesson.id}`,
        badge: 'Method',
        exactTerms: [method.toLowerCase(), method.replace(/[()]/g, '').toLowerCase()],
        keywords: [method.toLowerCase(), lesson.title.toLowerCase()],
        content: `method ${method} in lesson ${lesson.id}`
      });
    }
  }

  // Index Syntax Reference Sections
  for (const sec of syntaxSections) {
    const secNumStr = sec.number.toString();
    index.push({
      id: `syntax-${sec.id}`,
      type: 'syntax',
      title: `${sec.id}) ${sec.title}`,
      subtitle: `Syntax Reference • ${sec.category}`,
      syntaxSectionId: sec.id,
      url: `/reference?section=${sec.id}`,
      badge: 'Syntax',
      exactTerms: [secNumStr, `sec ${secNumStr}`, `section ${secNumStr}`],
      keywords: [
        sec.title.toLowerCase(),
        sec.category.toLowerCase(),
        ...sec.methods.map(m => m.toLowerCase()),
        ...sec.subsections.map(s => s.heading.toLowerCase())
      ],
      content: sec.rawMarkdown.toLowerCase()
    });

    // Subsections in syntax reference
    for (const sub of sec.subsections) {
      if (sub.heading) {
        index.push({
          id: `syntax-sub-${sec.id}-${sub.id}`,
          type: 'syntax',
          title: sub.heading,
          subtitle: `In Syntax #${sec.id}: ${sec.title}`,
          syntaxSectionId: sec.id,
          url: `/reference?section=${sec.id}`,
          badge: 'Reference',
          exactTerms: [sub.heading.toLowerCase(), sub.heading.replace(/[()]/g, '').toLowerCase()],
          keywords: [sub.heading.toLowerCase(), sec.title.toLowerCase()],
          content: sub.content.toLowerCase()
        });
      }
    }
  }

  return index;
}

export function searchIndexedItems(query: string, index: IndexedItem[]): SearchResult[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const results: { item: IndexedItem; score: number; snippet: string }[] = [];

  const isNumericQuery = /^\d+$/.test(clean);
  const queryNum = isNumericQuery ? parseInt(clean, 10) : null;

  for (const item of index) {
    let score = 0;
    let snippet = '';

    // 1. Exact Lesson Number match (Highest priority)
    if (queryNum !== null && item.type === 'lesson' && item.lessonNumber === queryNum) {
      score += 1000;
    }

    // 2. Exact syntax section match
    if (queryNum !== null && item.type === 'syntax' && item.syntaxSectionId === queryNum) {
      score += 800;
    }

    // 3. Exact term match (e.g. "append", "kwargs", "filter", "range")
    if (item.exactTerms.some(term => term === clean)) {
      score += 500;
    }

    // 4. Exact term start with
    if (item.exactTerms.some(term => term.startsWith(clean))) {
      score += 300;
    }

    // 5. Title exact / contains
    const titleLower = item.title.toLowerCase();
    if (titleLower === clean) {
      score += 400;
    } else if (titleLower.startsWith(clean)) {
      score += 200;
    } else if (titleLower.includes(clean)) {
      score += 100;
    }

    // 6. Keywords match
    for (const kw of item.keywords) {
      if (kw === clean) {
        score += 80;
      } else if (kw.includes(clean)) {
        score += 40;
      }
    }

    // 7. Body content match
    const bodyIdx = item.content.indexOf(clean);
    if (bodyIdx !== -1) {
      score += 20;
      // Extract a 100-char context window snippet
      const start = Math.max(0, bodyIdx - 30);
      const end = Math.min(item.content.length, bodyIdx + clean.length + 50);
      snippet = '...' + item.content.substring(start, end).replace(/\n+/g, ' ') + '...';
    }

    if (score > 0) {
      results.push({
        item,
        score,
        snippet: snippet || item.subtitle
      });
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);

  // Return top 25 results
  return results.slice(0, 25).map(({ item, score, snippet }) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    subtitle: item.subtitle,
    snippet,
    url: item.url,
    lessonNumber: item.lessonNumber,
    syntaxSectionId: item.syntaxSectionId,
    badge: item.badge,
    score
  }));
}
