import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readReadingProgress } from '../../lib/readingProgress';
import { LessonProgressBar } from './LessonProgressBar';

const setScrollMetrics = (scrollY: number, scrollHeight: number, innerHeight = 1000) => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: scrollY, writable: true });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: innerHeight, writable: true });
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    value: scrollHeight,
    writable: true,
  });
};

describe('LessonProgressBar', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    setScrollMetrics(0, 2000);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows and persists the current lesson reading percentage', () => {
    render(<LessonProgressBar lessonId="020" />);

    const progress = screen.getByRole('progressbar', { name: /lesson 020 reading progress/i });
    expect(progress).toHaveValue(0);
    expect(screen.getByText('0%')).toBeInTheDocument();

    act(() => {
      setScrollMetrics(250, 2000);
      fireEvent.scroll(window);
    });

    expect(progress).toHaveValue(25);
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(readReadingProgress('020')).toBe(25);
  });
});
