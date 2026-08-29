import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressRing } from './ProgressRing';

describe('ProgressRing', () => {
  it('clamps progress for an honest accessible course status', () => {
    render(<ProgressRing value={140} label="Course progress" />);

    const progress = screen.getByRole('progressbar', { name: 'Course progress' });
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
    expect(progress).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('normalizes invalid and negative progress to zero', () => {
    const { rerender } = render(<ProgressRing value={Number.NaN} label="Reading progress" />);
    expect(screen.getByRole('progressbar', { name: 'Reading progress' })).toHaveAttribute('aria-valuenow', '0');

    rerender(<ProgressRing value={-20} label="Reading progress" />);
    expect(screen.getByRole('progressbar', { name: 'Reading progress' })).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
