import { marked } from 'marked';
import { Lesson, LessonSection, TocItem, SyntaxSection, SyntaxSubsection } from '../types/content';
import { LESSON_TO_SYNTAX_MAP, getCategoryForLesson, getCategoryForSyntaxSection } from './lessonMapping';

// Slug helper for TOC and section anchor IDs
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u0621-\u064A\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section';
}

// Extract method calls like `append()`, `insert()`, `kwargs`, `def`, `map()`
export function extractMethods(content: string): string[] {
  const methods = new Set<string>();
  
  // Look for word() patterns in code or text
  const funcMatches = content.matchAll(/\b([a-zA-Z_]\w*)\s*\(/g);
  for (const m of funcMatches) {
    const fn = m[1];
    if (!['print', 'type', 'if', 'while', 'for', 'in', 'and', 'or', 'not', 'return', 'def', 'import', 'from', 'as'].includes(fn)) {
      methods.add(`${fn}()`);
    }
  }

  // Look for special keywords like *args, **kwargs
  if (content.includes('*args')) methods.add('*args');
  if (content.includes('**kwargs')) methods.add('**kwargs');

  return Array.from(methods);
}

/**
 * Parses `elzero_python_lessons_20_to_74.md` into 55 structured Lesson objects.
 */
export function parseLessons(rawMarkdown: string): { lessons: Lesson[]; summaryMarkdown: string } {
  const lessons: Lesson[] = [];
  let summaryMarkdown = '';

  const lessonHeaderRegex = /^# (\d{3})\s*[—–-]\s*(.*)$/gm;
  const matches = [...rawMarkdown.matchAll(lessonHeaderRegex)];

  // Check for summary section at bottom
  const summaryIndex = rawMarkdown.search(/^# ملخص.*$/m);
  if (summaryIndex !== -1) {
    summaryMarkdown = rawMarkdown.substring(summaryIndex);
  }

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const lessonId = match[1]; // e.g. "020"
    const lessonNumber = parseInt(lessonId, 10); // 20
    const title = match[2].trim();
    const category = getCategoryForLesson(lessonNumber);

    const startIndex = match.index!;
    let endIndex = rawMarkdown.length;
    if (i < matches.length - 1) {
      endIndex = matches[i + 1].index!;
    } else if (summaryIndex !== -1 && summaryIndex > startIndex) {
      endIndex = summaryIndex;
    }

    const lessonRaw = rawMarkdown.substring(startIndex, endIndex).trim();

    // Parse tokens using marked lexer
    const tokens = marked.lexer(lessonRaw);

    const sections: LessonSection[] = [];
    const toc: TocItem[] = [];
    const methods = extractMethods(lessonRaw);

    // Skip the first H1 token (the lesson title itself)
    for (let t = 0; t < tokens.length; t++) {
      const token = tokens[t];

      if (token.type === 'heading') {
        if (token.depth === 1) {
          continue;
        }

        const headingText = token.text;
        const headingId = `${lessonId}-${slugify(headingText)}-${t}`;
        toc.push({
          id: headingId,
          text: headingText,
          level: token.depth
        });

        sections.push({
          id: headingId,
          heading: headingText,
          level: token.depth,
          type: 'text',
          content: ''
        });
      } else if (token.type === 'code') {
        sections.push({
          id: `${lessonId}-code-${t}`,
          type: 'code',
          level: 0,
          language: token.lang || 'python',
          content: token.text
        });
      } else if (token.type === 'paragraph') {
        sections.push({
          id: `${lessonId}-p-${t}`,
          type: 'text',
          level: 0,
          content: token.raw
        });
      } else if (token.type === 'blockquote') {
        sections.push({
          id: `${lessonId}-quote-${t}`,
          type: 'callout',
          level: 0,
          content: token.raw
        });
      } else if (token.type === 'list') {
        sections.push({
          id: `${lessonId}-list-${t}`,
          type: 'list',
          level: 0,
          content: token.raw
        });
      } else if (token.type === 'table') {
        sections.push({
          id: `${lessonId}-table-${t}`,
          type: 'table',
          level: 0,
          content: token.raw
        });
      }
    }

    const quickReviewSectionIds = LESSON_TO_SYNTAX_MAP[lessonNumber] || [];

    lessons.push({
      id: lessonId,
      number: lessonNumber,
      title,
      category,
      rawMarkdown: lessonRaw,
      parsedSections: sections,
      toc,
      methods,
      quickReviewSectionIds
    });
  }

  return { lessons, summaryMarkdown };
}

/**
 * Parses `python_syntax_reference_elzero_20_74.md` into 67 structured SyntaxSection objects.
 */
export function parseSyntaxReference(rawMarkdown: string): SyntaxSection[] {
  const sections: SyntaxSection[] = [];

  const sectionHeaderRegex = /^# (\d+)\)\s*(.*)$/gm;
  const matches = [...rawMarkdown.matchAll(sectionHeaderRegex)];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const sectionNumber = parseInt(match[1], 10);
    const title = match[2].trim();
    const category = getCategoryForSyntaxSection(sectionNumber);
    const isSpecialSection = sectionNumber >= 61;

    const startIndex = match.index!;
    const endIndex = (i < matches.length - 1) ? matches[i + 1].index! : rawMarkdown.length;
    const sectionRaw = rawMarkdown.substring(startIndex, endIndex).trim();

    const tokens = marked.lexer(sectionRaw);
    const subsections: SyntaxSubsection[] = [];
    let currentSub: SyntaxSubsection = {
      id: `syn-${sectionNumber}-intro`,
      heading: '',
      level: 2,
      content: '',
      codeBlocks: []
    };

    const methods = extractMethods(sectionRaw);

    for (let t = 0; t < tokens.length; t++) {
      const token = tokens[t];

      if (token.type === 'heading' && token.depth > 1) {
        if (currentSub.content.trim() || currentSub.codeBlocks.length > 0 || currentSub.heading) {
          subsections.push(currentSub);
        }
        currentSub = {
          id: `syn-${sectionNumber}-${slugify(token.text)}-${t}`,
          heading: token.text,
          level: token.depth,
          content: '',
          codeBlocks: []
        };
      } else if (token.type === 'code') {
        currentSub.codeBlocks.push({
          code: token.text,
          language: token.lang || 'python'
        });
      } else if (token.type === 'paragraph' || token.type === 'blockquote' || token.type === 'list' || token.type === 'table') {
        currentSub.content += token.raw + '\n\n';
      }
    }

    if (currentSub.content.trim() || currentSub.codeBlocks.length > 0 || currentSub.heading) {
      subsections.push(currentSub);
    }

    sections.push({
      id: sectionNumber,
      number: sectionNumber,
      title,
      category,
      rawMarkdown: sectionRaw,
      subsections,
      methods,
      isSpecialSection
    });
  }

  return sections;
}
