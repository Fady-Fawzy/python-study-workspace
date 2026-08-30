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
    isFullView: false,
    onToggleComplete: vi.fn(),
    onToggleBookmark: vi.fn(),
    onToggleFullView: vi.fn(),
    ...overrides
  };
  render(<LessonHeader {...props} />);
  return props;
}

describe('LessonHeader', () => {
  it('uses a focused document masthead without duplicating study controls', () => {
    renderHeader();

    expect(screen.getByRole('banner', { name: 'Lesson overview' })).toHaveClass('lesson-masthead');
    expect(screen.queryByRole('tablist', { name: 'Study mode' })).not.toBeInTheDocument();
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

  it('exposes a full-view toggle that can also exit the focused reading mode', async () => {
    const user = userEvent.setup();
    const props = renderHeader();

    const enterButton = screen.getByRole('button', { name: 'Full View' });
    expect(enterButton).toHaveAttribute('aria-pressed', 'false');
    await user.click(enterButton);
    expect(props.onToggleFullView).toHaveBeenCalledWith(true);

    const exitProps = renderHeader({ isFullView: true });
    const exitButton = screen.getByRole('button', { name: 'Exit Full View' });
    expect(exitButton).toHaveAttribute('aria-pressed', 'true');
    await user.click(exitButton);
    expect(exitProps.onToggleFullView).toHaveBeenCalledWith(false);
  });

});
