import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LessonReadingControls } from './LessonReadingControls';

const setScrollMetrics = (scrollY: number, scrollHeight: number, innerHeight = 800) => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: scrollY, writable: true });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: innerHeight, writable: true });
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    value: scrollHeight,
    writable: true
  });
};

describe('LessonReadingControls', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    setScrollMetrics(320, 2000);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('offers top and end actions after the reader has started scrolling', () => {
    render(<LessonReadingControls />);

    act(() => {
      fireEvent.scroll(window);
    });

    expect(screen.getByRole('button', { name: 'Jump to top' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Jump to end' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Jump to top' }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });

    fireEvent.click(screen.getByRole('button', { name: 'Jump to end' }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 1200, behavior: 'smooth' });
  });

  it('uses instant scrolling when reduced motion is enabled', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    render(<LessonReadingControls />);

    act(() => {
      fireEvent.scroll(window);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Jump to end' }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 1200, behavior: 'auto' });
  });
});
