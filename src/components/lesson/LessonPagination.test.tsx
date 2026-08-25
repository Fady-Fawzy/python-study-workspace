import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Lesson } from '../../types/content';
import { LessonPagination } from './LessonPagination';

const makeLesson = (id: string, title: string): Lesson => ({
  id,
  number: Number(id),
  title,
  category: 'Test',
  rawMarkdown: '',
  parsedSections: [],
  toc: [],
  methods: [],
  quickReviewSectionIds: []
});

describe('LessonPagination', () => {
  it('provides title-aware semantic previous, next, and completion controls', async () => {
    const user = userEvent.setup();
    const onSelectLesson = vi.fn();
    const onToggleComplete = vi.fn();
    render(
      <LessonPagination
        prevLesson={makeLesson('020', 'Arithmetic Operators')}
        nextLesson={makeLesson('022', 'Very Long Membership Operator Lesson Title')}
        isCompleted={false}
        onSelectLesson={onSelectLesson}
        onToggleComplete={onToggleComplete}
      />
    );

    const nav = screen.getByRole('navigation', { name: /lesson pagination/i });
    const previous = screen.getByRole('button', { name: /previous lesson 020.*arithmetic operators/i });
    const next = screen.getByRole('button', { name: /next lesson 022.*very long membership/i });
    expect(nav).toContainElement(previous);
    expect(nav).toContainElement(next);
    expect(previous).toHaveClass('lesson-pagination__link');
    expect(next).toHaveClass('lesson-pagination__link');

    await user.click(next);
    await user.click(screen.getByRole('button', { name: /mark lesson as completed/i }));
    expect(onSelectLesson).toHaveBeenCalledWith('022');
    expect(onToggleComplete).toHaveBeenCalledTimes(1);
  });
});
