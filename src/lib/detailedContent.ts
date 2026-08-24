import { marked } from 'marked';
import {
  DetailedBlockType,
  DetailedContentBlock,
  DetailedLesson,
  DetailedLessonMap,
  Lesson,
  TocItem
} from '../types/content';
import { slugify } from './contentParser';

const CALLOUT_TYPES: Record<string, DetailedBlockType> = {
  IMPORTANT: 'note',
  NOTE: 'note',
  WARNING: 'warning',
  COMPARISON: 'comparison',
  'MENTAL-MODEL': 'mental-model'
};

function plainHeading(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_~]/g, '')
    .trim();
}

function parseCallout(raw: string): Pick<DetailedContentBlock, 'type' | 'content' | 'label'> {
  const lines = raw
    .split('\n')
    .map(line => line.replace(/^>\s?/, ''));
  const marker = lines[0]?.trim().match(/^\[!([A-Z-]+)\]\s*(.*)$/);

  if (!marker) {
    return {
      type: 'note',
      label: 'ملاحظة',
      content: lines.join('\n').trim()
    };
  }

  const type = CALLOUT_TYPES[marker[1]] || 'note';
  const labels: Record<DetailedBlockType, string> = {
    heading: '',
    prose: '',
    code: '',
    output: '',
    'example-run': '',
    'example-output': '',
    error: '',
    note: 'معلومة مهمة',
    warning: 'خطأ شائع',
    comparison: 'مقارنة مهمة',
    'mental-model': 'الصورة الذهنية',
    'rich-text': ''
  };
  const firstLine = marker[2].trim();
  const content = [firstLine, ...lines.slice(1)].filter(Boolean).join('\n').trim();

  return { type, label: labels[type], content };
}

export function parseDetailedLesson(rawMarkdown: string, expectedId?: string): DetailedLesson {
  const header = rawMarkdown.match(/^#\s+(\d{3})\s*[—–-]\s*(.+)$/m);
  if (!header) {
    throw new Error('Detailed lesson must start with "# NNN — Title".');
  }

  const id = header[1];
  if (expectedId && id !== expectedId) {
    throw new Error(`Detailed lesson ID mismatch: expected ${expectedId}, received ${id}.`);
  }

  const title = header[2].trim();
  const tokens = marked.lexer(rawMarkdown);
  const blocks: DetailedContentBlock[] = [];
  const toc: TocItem[] = [];

  tokens.forEach((token, index) => {
    if (token.type === 'heading') {
      if (token.depth === 1) return;

      const text = plainHeading(token.text);
      const blockId = `detailed-${id}-${slugify(text)}-${index}`;
      blocks.push({
        id: blockId,
        type: 'heading',
        content: token.text,
        level: token.depth
      });

      if (token.depth === 2) {
        toc.push({ id: blockId, text, level: token.depth });
      }
      return;
    }

    if (token.type === 'code') {
      const language = (token.lang || 'python').toLowerCase();
      const resultTypes: Partial<Record<string, DetailedBlockType>> = {
        output: 'output',
        'example-run': 'example-run',
        'example-output': 'example-output',
        error: 'error'
      };
      const type = resultTypes[language] || 'code';
      blocks.push({
        id: `detailed-${id}-${type}-${index}`,
        type,
        content: token.text,
        language: type === 'code' ? language : undefined
      });
      return;
    }

    if (token.type === 'paragraph') {
      blocks.push({
        id: `detailed-${id}-prose-${index}`,
        type: 'prose',
        content: token.raw
      });
      return;
    }

    if (token.type === 'blockquote') {
      blocks.push({
        id: `detailed-${id}-callout-${index}`,
        ...parseCallout(token.raw)
      });
      return;
    }

    if (token.type === 'list' || token.type === 'table') {
      blocks.push({
        id: `detailed-${id}-rich-${index}`,
        type: 'rich-text',
        content: token.raw
      });
      return;
    }

    if (token.type === 'html') {
      throw new Error(`Raw HTML is not allowed in detailed lesson ${id}.`);
    }
  });

  if (!title || blocks.length === 0) {
    throw new Error(`Detailed lesson ${id} is empty or invalid.`);
  }

  return {
    id,
    number: Number(id),
    title,
    rawMarkdown,
    blocks,
    toc
  };
}

export function parseDetailedLessonSources(sources: Record<string, string>): DetailedLessonMap {
  const lessons: DetailedLessonMap = {};

  for (const [expectedId, source] of Object.entries(sources)) {
    const lesson = parseDetailedLesson(source, expectedId);
    if (lessons[lesson.id]) {
      throw new Error(`Duplicate detailed lesson ID: ${lesson.id}.`);
    }
    lessons[lesson.id] = lesson;
  }

  return lessons;
}

export function selectDetailedLesson(
  lesson: Pick<Lesson, 'id'>,
  detailedLessons: DetailedLessonMap
): DetailedLesson | null {
  return detailedLessons[lesson.id] || null;
}
