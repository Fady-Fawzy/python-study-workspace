import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LessonStudyDock } from './LessonStudyDock';

function renderDock(overrides: Partial<React.ComponentProps<typeof LessonStudyDock>> = {}) {
  const props: React.ComponentProps<typeof LessonStudyDock> = {
    lessonId: '020',
    activeMode: 'detailed',
    hasPractice: true,
    activeSectionText: 'Arithmetic precedence',
    activeSectionIndex: 1,
    sectionTotal: 5,
    sectionProgress: 40,
    canOpenContents: true,
    canResume: true,
    resumeSectionText: 'Floor division',
    onModeChange: vi.fn(),
    onOpenContents: vi.fn(),
    onOpenNotes: vi.fn(),
    onResume: vi.fn(),
    ...overrides
  };
  render(<LessonStudyDock {...props} />);
  return props;
}

describe('LessonStudyDock', () => {
  it('combines study modes with current-section context', () => {
    renderDock();

    expect(screen.getByRole('region', { name: 'Study controls' })).toHaveClass('lesson-study-dock');
    expect(screen.getByRole('tablist', { name: 'Study mode' })).toBeInTheDocument();
    expect(screen.getByText('Section 2 of 5')).toBeInTheDocument();
    expect(screen.getByText('Arithmetic precedence')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: /section progress/i })).toHaveValue(40);
  });

  it('keeps roving tab focus and keyboard mode selection', async () => {
    const user = userEvent.setup();
    const props = renderDock();
    const detailed = screen.getByRole('tab', { name: /detailed study/i });
    const quick = screen.getByRole('tab', { name: /quick review/i });

    expect(detailed).toHaveAttribute('aria-selected', 'true');
    expect(detailed).toHaveAttribute('tabindex', '0');
    expect(quick).toHaveAttribute('tabindex', '-1');

    detailed.focus();
    await user.keyboard('{ArrowRight}');
    expect(props.onModeChange).toHaveBeenCalledWith('quickReview');
  });

  it('opens contents and notes from reachable controls', async () => {
    const user = userEvent.setup();
    const props = renderDock();

    await user.click(screen.getByRole('button', { name: /lesson contents/i }));
    await user.click(screen.getByRole('button', { name: /personal study notes/i }));

    expect(props.onOpenContents).toHaveBeenCalledTimes(1);
    expect(props.onOpenNotes).toHaveBeenCalledTimes(1);
  });

  it('shows resume only for a meaningful checkpoint', async () => {
    const user = userEvent.setup();
    const props = renderDock();
    const resume = screen.getByRole('button', { name: /resume at floor division/i });

    await user.click(resume);
    expect(props.onResume).toHaveBeenCalledTimes(1);

    renderDock({ canResume: false });
    expect(screen.getAllByRole('button', { name: /resume at floor division/i })).toHaveLength(1);
  });

  it('omits section and contents controls outside Detailed Study', () => {
    renderDock({ activeMode: 'quickReview' });

    expect(screen.queryByText('Section 2 of 5')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /lesson contents/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /personal study notes/i })).toBeInTheDocument();
  });
});
