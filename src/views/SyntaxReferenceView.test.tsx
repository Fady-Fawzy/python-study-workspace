import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SyntaxSection } from '../types/content';
import { StudyStateV1 } from '../types/state';
import { SyntaxReferenceView } from './SyntaxReferenceView';

const syntaxSections: SyntaxSection[] = [
  {
    id: 1,
    number: 1,
    title: 'Arithmetic Operators',
    category: 'Operators & Expressions',
    rawMarkdown: '',
    methods: [],
    subsections: [
      {
        id: 'operators-basics',
        heading: 'أساسيات Arithmetic',
        level: 3,
        content: 'استخدم `+` للجمع.',
        codeBlocks: [{ code: 'total = 2 + 3', language: 'python' }]
      }
    ]
  },
  {
    id: 2,
    number: 2,
    title: 'Lists With A Deliberately Long Reference Title For Narrow Screens',
    category: 'Data Structures',
    rawMarkdown: '',
    methods: ['append'],
    subsections: [
      {
        id: 'list-methods',
        heading: 'طرق Lists',
        level: 3,
        content: 'الدالة `append()` تضيف عنصرًا.',
        codeBlocks: [{ code: 'items.append("very-long-value")', language: 'python' }]
      }
    ]
  },
  {
    id: 7,
    number: 7,
    title: 'Dictionaries',
    category: 'Data Structures',
    rawMarkdown: '',
    methods: ['clear'],
    subsections: [
      {
        id: 'dictionary-methods',
        heading: 'Dictionary methods',
        level: 3,
        content: '`clear()` removes all items.',
        codeBlocks: []
      }
    ]
  }
];

const baseState: StudyStateV1 = {
  version: 1,
  completedLessons: [],
  bookmarkedLessons: [],
  bookmarkedSyntax: [],
  lessonNotes: {},
  lastOpenedLessonId: null,
  recentLessonIds: [],
  theme: 'dark',
  preferredMode: 'detailed',
  updatedAt: '2026-08-25T00:00:00.000Z'
};

function renderReference(
  state: StudyStateV1 = baseState,
  initialSectionId?: number,
  onUpdateState = vi.fn()
) {
  render(
    <SyntaxReferenceView
      syntaxSections={syntaxSections}
      state={state}
      initialSectionId={initialSectionId}
      onUpdateState={onUpdateState}
    />
  );
  return onUpdateState;
}

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('syntax reference', () => {
  it('uses the shared editorial index layout', () => {
    renderReference();

    expect(screen.getByRole('heading', { level: 1 }).closest('.editorial-index')).toBeInTheDocument();
  });

  it('combines category filtering and search while exposing selection state', async () => {
    const user = userEvent.setup();
    renderReference();

    const dataStructures = screen.getByRole('button', { name: /data structures/i });
    await user.click(dataStructures);
    expect(dataStructures).toHaveAttribute('aria-pressed', 'true');

    await user.type(screen.getByRole('searchbox', { name: /search syntax reference/i }), 'append');

    expect(screen.getByRole('article', { name: /lists with a deliberately long/i })).toBeInTheDocument();
    expect(screen.queryByRole('article', { name: /dictionaries/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('article', { name: /arithmetic operators/i })).not.toBeInTheDocument();
  });

  it('announces an accessible empty result with the active search and category', async () => {
    const user = userEvent.setup();
    renderReference();

    await user.click(screen.getByRole('button', { name: /data structures/i }));
    await user.type(screen.getByRole('searchbox', { name: /search syntax reference/i }), 'lambda');

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('lambda');
    expect(status).toHaveTextContent('Data Structures');
  });

  it('anchors the requested section without smooth motion when reduced motion is preferred', () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView
    });

    renderReference(baseState, 7);

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
  });

  it('exposes syntax bookmark pressed state and sends the updated state through the callback', async () => {
    const user = userEvent.setup();
    const onUpdateState = renderReference({ ...baseState, bookmarkedSyntax: [2] });
    const lists = screen.getByRole('article', { name: /lists with a deliberately long/i });
    const bookmark = within(lists).getByRole('button', { name: /remove bookmark/i });

    expect(bookmark).toHaveAttribute('aria-pressed', 'true');
    await user.click(bookmark);

    expect(onUpdateState).toHaveBeenCalledOnce();
    const updater = onUpdateState.mock.calls[0][0];
    expect(updater({ ...baseState, bookmarkedSyntax: [1, 2] }).bookmarkedSyntax).toEqual([1]);
  });

  it('renders every provided section, subsection, and code example without changing their text', () => {
    renderReference();

    expect(screen.getAllByRole('article')).toHaveLength(syntaxSections.length);
    expect(screen.getByRole('heading', { name: 'أساسيات Arithmetic' })).toBeInTheDocument();
    expect(screen.getByText('append()', { selector: 'code' })).toHaveAttribute('dir', 'ltr');
    const codeRegions = screen.getAllByRole('region', { name: 'Python code example' });
    expect(codeRegions[0]).toHaveTextContent('total = 2 + 3');
    expect(codeRegions).toHaveLength(2);
  });
});
