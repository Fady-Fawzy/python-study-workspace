import React, { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface ScrollAvailability {
  canJumpTop: boolean;
  canJumpEnd: boolean;
}

const JUMP_THRESHOLD = 96;

const getScrollAvailability = (): ScrollAvailability => {
  const scrollTop = Math.max(0, window.scrollY || 0);
  const maxScrollTop = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );

  return {
    canJumpTop: scrollTop > JUMP_THRESHOLD,
    canJumpEnd: maxScrollTop - scrollTop > JUMP_THRESHOLD
  };
};

const prefersReducedMotion = (): boolean => (
  typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches
);

export const LessonReadingControls: React.FC = () => {
  const [availability, setAvailability] = useState<ScrollAvailability>(getScrollAvailability);

  const updateAvailability = useCallback(() => {
    setAvailability(getScrollAvailability());
  }, []);

  useEffect(() => {
    let frame: number | null = null;

    const scheduleUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        updateAvailability();
      });
    };

    updateAvailability();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [updateAvailability]);

  const jumpTo = (top: number) => {
    window.scrollTo({
      top,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    });
  };

  if (!availability.canJumpTop && !availability.canJumpEnd) return null;

  const maxScrollTop = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );

  return (
    <nav className="lesson-reading-controls" aria-label="Reading navigation">
      {availability.canJumpTop && (
        <button
          type="button"
          className="lesson-reading-controls__button"
          aria-label="Jump to top"
          title="Jump to top"
          onClick={() => jumpTo(0)}
        >
          <ArrowUp size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      )}
      {availability.canJumpEnd && (
        <button
          type="button"
          className="lesson-reading-controls__button"
          aria-label="Jump to end"
          title="Jump to end"
          onClick={() => jumpTo(maxScrollTop)}
        >
          <ArrowDown size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      )}
    </nav>
  );
};
