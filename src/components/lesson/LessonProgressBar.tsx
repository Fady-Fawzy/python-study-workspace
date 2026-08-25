import React, { useCallback, useEffect, useState } from 'react';
import {
  calculateReadingProgress,
  readReadingProgress,
  writeReadingProgress,
} from '../../lib/readingProgress';

interface LessonProgressBarProps {
  lessonId: string;
}

const getCurrentProgress = (): number => {
  const scrollTop = Math.max(0, window.scrollY || 0);
  const maxScrollTop = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return calculateReadingProgress(scrollTop, maxScrollTop);
};

export const LessonProgressBar: React.FC<LessonProgressBarProps> = ({ lessonId }) => {
  const [progress, setProgress] = useState(() => readReadingProgress(lessonId));

  const updateProgress = useCallback(() => {
    const nextProgress = getCurrentProgress();
    setProgress((currentProgress) => currentProgress === nextProgress ? currentProgress : nextProgress);
    writeReadingProgress(lessonId, nextProgress);
  }, [lessonId]);

  useEffect(() => {
    let frame: number | null = null;

    const scheduleUpdate = () => {
      if (frame !== null) return;
      if (typeof window.requestAnimationFrame === 'function') {
        frame = window.requestAnimationFrame(() => {
          frame = null;
          updateProgress();
        });
      } else {
        frame = window.setTimeout(() => {
          frame = null;
          updateProgress();
        }, 0);
      }
    };

    updateProgress();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame !== null) {
        if (typeof window.cancelAnimationFrame === 'function') {
          window.cancelAnimationFrame(frame);
        } else {
          window.clearTimeout(frame);
        }
      }
    };
  }, [updateProgress]);

  return (
    <section className="lesson-progress" aria-label="Lesson reading progress">
      <div className="lesson-progress__header">
        <span>Reading progress</span>
        <strong dir="ltr">{progress}%</strong>
      </div>
      <progress
        value={progress}
        max={100}
        aria-label={`Lesson ${lessonId} reading progress`}
      />
    </section>
  );
};
