import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RouteLoading } from './App';

describe('route loading surface', () => {
  it('announces lazy route loading without shifting the reading layout', () => {
    render(<RouteLoading />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading study view…');
    expect(screen.getByRole('status')).toHaveClass('route-loading');
  });
});
