import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TocItem } from '../types/content';
import { useLessonSectionProgress } from './useLessonSectionProgress';

const items: TocItem[] = [
  { id: 'first', text: 'First', level: 2 },
  { id: 'second', text: 'Second', level: 2 },
  { id: 'third', text: 'Third', level: 2 }
];

function addHeading(id: string, top: number) {
  const heading = document.createElement('h2');
  heading.id = id;
  heading.scrollIntoView = vi.fn();
  heading.getBoundingClientRect = vi.fn(() => ({ top } as DOMRect));
  document.body.append(heading);
  return heading;
}

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

describe('useLessonSectionProgress', () => {
  it('selects the last heading above the sticky reading line', () => {
    addHeading('first', -220);
    addHeading('second', 80);
    addHeading('third', 460);

    const { result } = renderHook(() => useLessonSectionProgress(items, true));

    expect(result.current.activeId).toBe('second');
    expect(result.current.activeIndex).toBe(1);
    expect(result.current.total).toBe(3);
    expect(result.current.progress).toBe(67);
  });

  it('falls back to the first item when headings are not mounted', () => {
    const { result } = renderHook(() => useLessonSectionProgress(items, true));

    expect(result.current.activeItem).toEqual(items[0]);
    expect(result.current.progress).toBe(33);
  });

  it('syncs from scroll and stops tracking while disabled', () => {
    const first = addHeading('first', 70);
    const second = addHeading('second', 400);
    addHeading('third', 800);
    const { result, rerender } = renderHook(
      ({ enabled }) => useLessonSectionProgress(items, enabled),
      { initialProps: { enabled: true } }
    );

    first.getBoundingClientRect = vi.fn(() => ({ top: -300 } as DOMRect));
    second.getBoundingClientRect = vi.fn(() => ({ top: 90 } as DOMRect));
    act(() => result.current.syncFromScroll());
    expect(result.current.activeId).toBe('second');

    rerender({ enabled: false });
    second.getBoundingClientRect = vi.fn(() => ({ top: 600 } as DOMRect));
    act(() => window.dispatchEvent(new Event('scroll')));
    expect(result.current.activeId).toBe('second');
  });

  it('scrolls to a section instantly when reduced motion is preferred', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    const heading = addHeading('second', 300);
    const { result } = renderHook(() => useLessonSectionProgress(items, true));

    act(() => result.current.scrollToSection('second'));

    expect(heading.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
    expect(result.current.activeId).toBe('second');
  });
});
