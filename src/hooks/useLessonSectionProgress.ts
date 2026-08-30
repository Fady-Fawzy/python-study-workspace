import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TocItem } from '../types/content';

const READING_LINE_PX = 112;

function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useLessonSectionProgress(items: TocItem[], enabled = true) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');
  const frameRef = useRef<number | null>(null);
  const frameTypeRef = useRef<'animation' | 'timeout' | null>(null);

  useEffect(() => {
    if (!items.some(item => item.id === activeId)) {
      setActiveId(items[0]?.id ?? '');
    }
  }, [activeId, items]);

  const syncFromScroll = useCallback(() => {
    if (!enabled || items.length === 0) return;

    let current = items[0];
    for (const item of items) {
      const heading = document.getElementById(item.id);
      if (!heading) continue;
      if (heading.getBoundingClientRect().top <= READING_LINE_PX) current = item;
      else break;
    }
    setActiveId(current.id);
  }, [enabled, items]);

  useEffect(() => {
    if (!enabled || items.length === 0) return;

    syncFromScroll();

    const scheduleSync = () => {
      if (frameRef.current !== null) return;

      const run = () => {
        frameRef.current = null;
        frameTypeRef.current = null;
        syncFromScroll();
      };

      if (typeof window.requestAnimationFrame === 'function') {
        frameTypeRef.current = 'animation';
        frameRef.current = window.requestAnimationFrame(run);
      } else {
        frameTypeRef.current = 'timeout';
        frameRef.current = window.setTimeout(run, 0);
      }
    };

    window.addEventListener('scroll', scheduleSync, { passive: true });
    window.addEventListener('resize', scheduleSync);

    return () => {
      window.removeEventListener('scroll', scheduleSync);
      window.removeEventListener('resize', scheduleSync);
      if (frameRef.current === null) return;
      if (frameTypeRef.current === 'animation' && typeof window.cancelAnimationFrame === 'function') {
        window.cancelAnimationFrame(frameRef.current);
      } else {
        window.clearTimeout(frameRef.current);
      }
      frameRef.current = null;
      frameTypeRef.current = null;
    };
  }, [enabled, items, syncFromScroll]);

  const scrollToSection = useCallback((id: string) => {
    const item = items.find(candidate => candidate.id === id);
    const heading = item ? document.getElementById(item.id) : null;
    if (!item || !heading) return false;

    heading.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start'
    });
    setActiveId(item.id);
    return true;
  }, [items]);

  const activeIndex = Math.max(0, items.findIndex(item => item.id === activeId));
  const total = items.length;
  const activeItem = items[activeIndex] ?? null;
  const progress = total > 0 ? Math.round(((activeIndex + 1) / total) * 100) : 0;

  return useMemo(() => ({
    activeId,
    activeItem,
    activeIndex,
    total,
    progress,
    scrollToSection,
    syncFromScroll
  }), [activeId, activeIndex, activeItem, progress, scrollToSection, syncFromScroll, total]);
}
