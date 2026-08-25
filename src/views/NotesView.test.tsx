import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Lesson } from '../types/content';
import { StudyStateV1 } from '../types/state';
import { NotesView } from './NotesView';

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
  },
  {
    id: '074',
    number: 74,
    title: 'Reduce Function',
    category: 'Built-In & Functional Tools',
    rawMarkdown: '',
    parsedSections: [],
    toc: [],
    methods: ['reduce'],
    quickReviewSectionIds: []
  }
];

const mixedDirectionNote =
  'استخدم reduce() مع lambda ثم راجع very_long_python_identifier_that_must_wrap_safely_after_saving_the_note.';

const baseState: StudyStateV1 = {
  version: 1,
  completedLessons: [],
  bookmarkedLessons: [],
  bookmarkedSyntax: [],
  lessonNotes: {
    '020': 'راجع ترتيب العمليات قبل الحل.',
    '074': mixedDirectionNote
  },
  lastOpenedLessonId: null,
  recentLessonIds: [],
  theme: 'dark',
  preferredMode: 'detailed',
  updatedAt: '2026-08-25T00:00:00.000Z'
};

function renderNotes(state: StudyStateV1 = baseState) {
  const onNavigate = vi.fn();
  const onUpdateState = vi.fn();
  render(
    <NotesView
      lessons={lessons}
      state={state}
      onNavigate={onNavigate}
      onUpdateState={onUpdateState}
    />
  );
  return { onNavigate, onUpdateState };
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('notes view', () => {
  it('filters notes by title, category, and note content from an accessible search field', async () => {
    const user = userEvent.setup();
    renderNotes();

    const search = screen.getByRole('searchbox', { name: /search study notes/i });
    await user.type(search, 'functional tools');

    expect(screen.getByRole('article', { name: /lesson 074/i })).toBeInTheDocument();
    expect(screen.queryByRole('article', { name: /lesson 020/i })).not.toBeInTheDocument();
  });

  it('uses a semantic control to return to the source lesson', async () => {
    const user = userEvent.setup();
    const { onNavigate } = renderNotes();

    await user.click(screen.getByRole('button', { name: /open lesson 074/i }));
    expect(onNavigate).toHaveBeenCalledWith('/lesson/074');
  });

  it('preserves delete confirmation and leaves state unchanged when cancelled', async () => {
    const user = userEvent.setup();
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const { onUpdateState } = renderNotes();

    await user.click(screen.getByRole('button', { name: /delete note for lesson 020/i }));

    expect(confirm).toHaveBeenCalledWith('Delete note for Lesson 020?');
    expect(onUpdateState).not.toHaveBeenCalled();
  });

  it('deletes only the confirmed lesson note', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { onUpdateState } = renderNotes();

    await user.click(screen.getByRole('button', { name: /delete note for lesson 074/i }));

    expect(onUpdateState).toHaveBeenCalledOnce();
    const updater = onUpdateState.mock.calls[0][0];
    expect(updater(baseState).lessonNotes).toEqual({
      '020': 'راجع ترتيب العمليات قبل الحل.'
    });
  });

  it('offers a return to study when there are no personal notes', async () => {
    const user = userEvent.setup();
    const { onNavigate } = renderNotes({ ...baseState, lessonNotes: {} });

    const emptyState = screen.getByRole('region', { name: /no personal notes yet/i });
    expect(within(emptyState).getByRole('status')).toHaveTextContent(/no personal notes yet/i);
    await user.click(within(emptyState).getByRole('button', { name: /start studying/i }));
    expect(onNavigate).toHaveBeenCalledWith('/');
  });

  it('announces no matches and lets the learner clear the active filter', async () => {
    const user = userEvent.setup();
    renderNotes();

    const search = screen.getByRole('searchbox', { name: /search study notes/i });
    await user.type(search, 'does-not-exist');

    const emptyState = screen.getByRole('region', { name: /no matching notes/i });
    expect(within(emptyState).getByRole('status')).toHaveTextContent('does-not-exist');
    await user.click(within(emptyState).getByRole('button', { name: /clear search/i }));
    expect(search).toHaveValue('');
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });

  it('keeps long mixed-direction note content isolated and safely wrappable', () => {
    renderNotes();

    const note = screen.getByText(mixedDirectionNote);
    expect(note).toHaveAttribute('dir', 'auto');
    expect(note).toHaveClass('saved-note__content');
    expect(note.closest('article')).toHaveAccessibleName(/lesson 074/i);
  });
});
