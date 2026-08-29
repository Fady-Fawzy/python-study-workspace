import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MobileBottomNav } from './MobileBottomNav';

describe('MobileBottomNav', () => {
  it('marks the current destination and opens lesson navigation', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    const onOpenLessons = vi.fn();
    const onOpenSearch = vi.fn();

    render(
      <MobileBottomNav
        currentPath="/notes"
        isLessonsOpen={false}
        onNavigate={onNavigate}
        onOpenLessons={onOpenLessons}
        onOpenSearch={onOpenSearch}
      />
    );

    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Notes' })).toHaveAttribute('aria-current', 'page');

    await user.click(screen.getByRole('button', { name: 'Lessons' }));
    expect(onOpenLessons).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Lessons' })).toHaveAttribute('aria-expanded', 'false');

    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(onOpenSearch).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Study' }));
    expect(onNavigate).toHaveBeenCalledWith('/');
  });

  it('treats lesson routes as part of Study', () => {
    render(
      <MobileBottomNav
        currentPath="/lesson/020"
        isLessonsOpen
        onNavigate={vi.fn()}
        onOpenLessons={vi.fn()}
        onOpenSearch={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Study' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Lessons' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Lessons' })).toHaveAttribute('aria-controls', 'mobile-navigation-drawer');
  });
});
