import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LessonNotesEditor } from './LessonNotes';

describe('LessonNotes', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders one editor without owning disclosure state', () => {
    render(<LessonNotesEditor lessonId="020" initialNote="" onSaveNote={vi.fn()} />);

    expect(screen.getByRole('textbox', { name: /personal study notes/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /lesson notes/i })).not.toBeInTheDocument();
    expect(screen.getByText('0 characters')).toBeInTheDocument();
  });

  it('debounces autosave and exposes saving feedback through a live status', () => {
    const onSaveNote = vi.fn();
    render(<LessonNotesEditor lessonId="020" initialNote="" onSaveNote={onSaveNote} />);
    const textarea = screen.getByRole('textbox', { name: /personal study notes/i });

    fireEvent.change(textarea, { target: { value: 'remember this' } });
    expect(screen.getByRole('status')).toHaveTextContent('Saving');
    expect(onSaveNote).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(600));
    expect(onSaveNote).toHaveBeenCalledTimes(1);
    expect(onSaveNote).toHaveBeenCalledWith('020', 'remember this');
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });

  it('flushes a pending edit on blur without a later duplicate save', () => {
    const onSaveNote = vi.fn();
    render(<LessonNotesEditor lessonId="020" initialNote="" onSaveNote={onSaveNote} />);
    const textarea = screen.getByRole('textbox', { name: /personal study notes/i });

    fireEvent.change(textarea, { target: { value: 'blurred note' } });
    fireEvent.blur(textarea);
    expect(onSaveNote).toHaveBeenCalledTimes(1);
    expect(onSaveNote).toHaveBeenCalledWith('020', 'blurred note');

    act(() => vi.advanceTimersByTime(3000));
    expect(onSaveNote).toHaveBeenCalledTimes(1);
  });

  it('flushes the old lesson before switching and prevents a stale timer save', () => {
    const onSaveNote = vi.fn();
    const { rerender } = render(
      <LessonNotesEditor lessonId="020" initialNote="old persisted" onSaveNote={onSaveNote} />
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'pending lesson 20' } });

    rerender(<LessonNotesEditor lessonId="021" initialNote="lesson 21 note" onSaveNote={onSaveNote} />);

    expect(onSaveNote).toHaveBeenCalledTimes(1);
    expect(onSaveNote).toHaveBeenCalledWith('020', 'pending lesson 20');
    expect(screen.getByRole('textbox')).toHaveValue('lesson 21 note');

    act(() => vi.advanceTimersByTime(3000));
    expect(onSaveNote).toHaveBeenCalledTimes(1);
  });

  it('flushes a pending edit when unmounted', () => {
    const onSaveNote = vi.fn();
    const { unmount } = render(
      <LessonNotesEditor lessonId="020" initialNote="" onSaveNote={onSaveNote} />
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'save before leaving' } });

    unmount();

    expect(onSaveNote).toHaveBeenCalledTimes(1);
    expect(onSaveNote).toHaveBeenCalledWith('020', 'save before leaving');
    act(() => vi.advanceTimersByTime(3000));
    expect(onSaveNote).toHaveBeenCalledTimes(1);
  });

  it('syncs a same-lesson note restored by an external state replacement', () => {
    const onSaveNote = vi.fn();
    const { rerender } = render(
      <LessonNotesEditor lessonId="020" initialNote="before restore" onSaveNote={onSaveNote} />
    );

    rerender(
      <LessonNotesEditor lessonId="020" initialNote="restored backup note" onSaveNote={onSaveNote} />
    );

    expect(screen.getByRole('textbox')).toHaveValue('restored backup note');
    expect(onSaveNote).not.toHaveBeenCalled();
  });

  it('discards a pending draft when an external restore replaces the same lesson note', () => {
    const onSaveNote = vi.fn();
    const { rerender, unmount } = render(
      <LessonNotesEditor lessonId="020" initialNote="persisted note" onSaveNote={onSaveNote} />
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'stale pending draft' } });

    rerender(
      <LessonNotesEditor lessonId="020" initialNote="authoritative restored note" onSaveNote={onSaveNote} />
    );

    expect(screen.getByRole('textbox')).toHaveValue('authoritative restored note');
    expect(screen.getByRole('status')).toHaveTextContent('Changes save automatically');
    act(() => vi.advanceTimersByTime(3000));
    expect(onSaveNote).not.toHaveBeenCalled();

    unmount();
    expect(onSaveNote).not.toHaveBeenCalled();
  });

  it('keeps the draft stable when its own save is reflected back through initialNote', () => {
    const onSaveNote = vi.fn();
    const { rerender } = render(
      <LessonNotesEditor lessonId="020" initialNote="old note" onSaveNote={onSaveNote} />
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'saved draft' } });
    act(() => vi.advanceTimersByTime(600));

    rerender(<LessonNotesEditor lessonId="020" initialNote="saved draft" onSaveNote={onSaveNote} />);

    expect(screen.getByRole('textbox')).toHaveValue('saved draft');
    act(() => vi.advanceTimersByTime(3000));
    expect(onSaveNote).toHaveBeenCalledTimes(1);
    expect(onSaveNote).toHaveBeenCalledWith('020', 'saved draft');
  });
});
