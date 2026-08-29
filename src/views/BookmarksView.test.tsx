import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Lesson, SyntaxSection } from '../types/content';
import { StudyStateV1 } from '../types/state';
import { BookmarksView } from './BookmarksView';

const lessons: Lesson[] = [
  {
    id: '020',
    number: 20,
    title: 'Arithmetic Operators With A Deliberately Long Mobile Title',
    category: 'Operators & Expressions',
    rawMarkdown: '',
    parsedSections: [],
    toc: [],
    methods: [],
    quickReviewSectionIds: []
  }
];

const syntaxSections: SyntaxSection[] = [
  {
    id: 7,
    number: 7,
    title: 'Lists And Their Frequently Used Methods',
    category: 'Data Structures',
    rawMarkdown: '',
    subsections: [],
    methods: ['append']
  }
];

const baseState: StudyStateV1 = {
  version: 1,
  completedLessons: [],
  bookmarkedLessons: ['020'],
  bookmarkedSyntax: [7],
  lessonNotes: {},
  lastOpenedLessonId: null,
  recentLessonIds: [],
  theme: 'dark',
  preferredMode: 'detailed',
  updatedAt: '2026-08-25T00:00:00.000Z'
};

function renderBookmarks(state: StudyStateV1 = baseState) {
  const onNavigate = vi.fn();
  const onUpdateState = vi.fn();
  render(
    <BookmarksView
      lessons={lessons}
      syntaxSections={syntaxSections}
      state={state}
      onNavigate={onNavigate}
      onUpdateState={onUpdateState}
    />
  );
  return { onNavigate, onUpdateState };
}

afterEach(cleanup);

describe('bookmarks view', () => {
  it('uses the shared editorial index layout', () => {
    renderBookmarks();

    expect(screen.getByRole('heading', { level: 1 }).closest('.editorial-index')).toBeInTheDocument();
  });

  it('exposes counted filter tabs and filters lessons and syntax sections', async () => {
    const user = userEvent.setup();
    renderBookmarks();

    const filters = screen.getByRole('tablist', { name: /filter bookmarks/i });
    const all = within(filters).getByRole('tab', { name: 'All (2)' });
    const lessonTab = within(filters).getByRole('tab', { name: 'Lessons (1)' });
    const syntaxTab = within(filters).getByRole('tab', { name: 'Syntax Sections (1)' });

    expect(all).toHaveAttribute('aria-selected', 'true');
    await user.click(lessonTab);
    expect(lessonTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: /open lesson 020/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /open syntax section 7/i })).not.toBeInTheDocument();

    await user.click(syntaxTab);
    expect(syntaxTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: /open syntax section 7/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /open lesson 020/i })).not.toBeInTheDocument();
  });

  it('supports ArrowLeft and ArrowRight with roving tab focus and selection', async () => {
    const user = userEvent.setup();
    renderBookmarks();

    const all = screen.getByRole('tab', { name: 'All (2)' });
    const lessonTab = screen.getByRole('tab', { name: 'Lessons (1)' });
    const syntaxTab = screen.getByRole('tab', { name: 'Syntax Sections (1)' });

    all.focus();
    await user.keyboard('{ArrowRight}');
    expect(lessonTab).toHaveFocus();
    expect(lessonTab).toHaveAttribute('aria-selected', 'true');
    expect(lessonTab).toHaveAttribute('tabindex', '0');
    expect(all).toHaveAttribute('tabindex', '-1');

    await user.keyboard('{ArrowLeft}');
    expect(all).toHaveFocus();
    expect(all).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowLeft}');
    expect(syntaxTab).toHaveFocus();
    expect(syntaxTab).toHaveAttribute('aria-selected', 'true');
  });

  it('supports Home and End with roving tab focus and selection', async () => {
    const user = userEvent.setup();
    renderBookmarks();

    const all = screen.getByRole('tab', { name: 'All (2)' });
    const lessonTab = screen.getByRole('tab', { name: 'Lessons (1)' });
    const syntaxTab = screen.getByRole('tab', { name: 'Syntax Sections (1)' });

    lessonTab.focus();
    await user.keyboard('{End}');
    expect(syntaxTab).toHaveFocus();
    expect(syntaxTab).toHaveAttribute('aria-selected', 'true');
    expect(syntaxTab).toHaveAttribute('tabindex', '0');
    expect(lessonTab).toHaveAttribute('tabindex', '-1');

    await user.keyboard('{Home}');
    expect(all).toHaveFocus();
    expect(all).toHaveAttribute('aria-selected', 'true');
  });

  it('uses semantic navigation controls for saved lessons and syntax sections', async () => {
    const user = userEvent.setup();
    const { onNavigate } = renderBookmarks();

    await user.click(screen.getByRole('button', { name: /open lesson 020/i }));
    expect(onNavigate).toHaveBeenLastCalledWith('/lesson/020');

    await user.click(screen.getByRole('button', { name: /open syntax section 7/i }));
    expect(onNavigate).toHaveBeenLastCalledWith('/reference?section=7');
  });

  it('removes lesson and syntax bookmarks through clearly labelled actions', async () => {
    const user = userEvent.setup();
    const { onUpdateState } = renderBookmarks();

    await user.click(screen.getByRole('button', { name: /remove lesson 020 bookmark/i }));
    const lessonUpdater = onUpdateState.mock.calls[0][0];
    expect(lessonUpdater(baseState).bookmarkedLessons).toEqual([]);

    await user.click(screen.getByRole('button', { name: /remove syntax section 7 bookmark/i }));
    const syntaxUpdater = onUpdateState.mock.calls[1][0];
    expect(syntaxUpdater(baseState).bookmarkedSyntax).toEqual([]);
  });

  it('offers a clear return to study when there are no saved bookmarks', async () => {
    const user = userEvent.setup();
    const { onNavigate } = renderBookmarks({
      ...baseState,
      bookmarkedLessons: [],
      bookmarkedSyntax: []
    });

    const emptyState = screen.getByRole('region', { name: /no bookmarks yet/i });
    expect(within(emptyState).getByRole('status')).toHaveTextContent(/no bookmarks yet/i);
    await user.click(within(emptyState).getByRole('button', { name: /browse lessons/i }));
    expect(onNavigate).toHaveBeenCalledWith('/');
  });

  it('shows a useful filtered empty state instead of a blank view', async () => {
    const user = userEvent.setup();
    renderBookmarks({ ...baseState, bookmarkedSyntax: [] });

    await user.click(screen.getByRole('tab', { name: 'Syntax Sections (0)' }));
    const emptyState = screen.getByRole('region', { name: /no saved syntax sections/i });
    expect(within(emptyState).getByRole('status')).toHaveTextContent(/no saved syntax sections/i);
    await user.click(within(emptyState).getByRole('button', { name: /show all bookmarks/i }));
    expect(screen.getByRole('tab', { name: 'All (1)' })).toHaveAttribute('aria-selected', 'true');
  });
});
