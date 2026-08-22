export interface LessonSection {
  id: string;
  heading?: string;
  level: number;
  type: 'text' | 'code' | 'callout' | 'list' | 'table';
  content: string;
  language?: string;
  subsections?: LessonSection[];
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface Lesson {
  id: string;               // e.g. "020", "056"
  number: number;           // e.g. 20, 56
  title: string;            // e.g. "Arithmetic Operators", "Function And Return"
  category: string;         // e.g. "Operators", "Functions"
  rawMarkdown: string;
  parsedSections: LessonSection[];
  toc: TocItem[];
  methods: string[];        // Extracted methods e.g. ["append", "extend"]
  quickReviewSectionIds: number[]; // e.g. [26, 27]
  summary?: string;
}

export interface SyntaxSubsection {
  id: string;
  heading: string;
  level: number;
  content: string;
  codeBlocks: { code: string; language: string; title?: string }[];
}

export interface SyntaxSection {
  id: number;               // 1 to 67
  number: number;
  title: string;            // e.g. "Arithmetic Operators", "Lists"
  category: string;         // e.g. "Data Structures", "Control Flow"
  rawMarkdown: string;
  subsections: SyntaxSubsection[];
  methods: string[];        // Methods covered in this section
  isSpecialSection?: boolean; // For 61-67 (Patterns, Pitfalls, Mental Models)
}

export interface CategoryGroup {
  name: string;
  lessonIds: string[];
  description?: string;
  iconName?: string;
}

export interface SearchResult {
  id: string;
  type: 'lesson' | 'syntax' | 'method' | 'section';
  title: string;
  subtitle: string;
  snippet: string;
  url: string;
  lessonNumber?: number;
  syntaxSectionId?: number;
  badge: string;
  score: number;
}
