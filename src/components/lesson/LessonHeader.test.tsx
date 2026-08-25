import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LessonHeader } from './LessonHeader';

function renderHeader(overrides: Partial<React.ComponentProps<typeof LessonHeader>> = {}) {
  const props: React.ComponentProps<typeof LessonHeader> = {
    lessonId: '056',
    title: 'Function Packing And Unpacking Arguments',
    category: 'Functions & Scope',
    isCompleted: false,
    isBookmarked: false,
    activeMode: 'detailed',
    onToggleComplete: vi.fn(),
    onToggleBookmark: vi.fn(),
    onModeChange: vi.fn(),
    ...overrides
  };
  render(<LessonHeader {...props} />);
  return props;
}

describe('LessonHeader', () => {
  it('exposes the study modes as an accessible single-select tab set', async () => {
    const user = userEvent.setup();
    const props = renderHeader();

    const tablist = screen.getByRole('tablist', { name: /study mode/i });
    const detailed = screen.getByRole('tab', { name: /detailed study/i });
    const quick = screen.getByRole('tab', { name: /quick review/i });

    expect(tablist).toContainElement(detailed);
    expect(detailed).toHaveAttribute('aria-selected', 'true');
    expect(detailed).toHaveAttribute('tabindex', '0');
    expect(quick).toHaveAttribute('aria-selected', 'false');
    expect(quick).toHaveAttribute('tabindex', '-1');

    await user.click(quick);
    expect(props.onModeChange).toHaveBeenCalledWith('quickReview');
  });

  it('announces bookmark and completion pressed state and invokes both actions', async () => {
    const user = userEvent.setup();
    const props = renderHeader({ isCompleted: true, isBookmarked: true });

    const bookmark = screen.getByRole('button', { name: /remove bookmark/i });
    const completion = screen.getByRole('button', { name: /completed/i });
    expect(bookmark).toHaveAttribute('aria-pressed', 'true');
    expect(completion).toHaveAttribute('aria-pressed', 'true');

    await user.click(bookmark);
    await user.click(completion);
    expect(props.onToggleBookmark).toHaveBeenCalledTimes(1);
    expect(props.onToggleComplete).toHaveBeenCalledTimes(1);
  });
});
