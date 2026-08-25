import React, { useState, useEffect } from 'react';
import { DetailedLessonMap, Lesson, SyntaxSection } from '../types/content';
import { PracticeLessonMap } from '../types/practice';
import { PracticeProgress, StudyStateV1 } from '../types/state';
import { LessonHeader } from '../components/lesson/LessonHeader';
import { LessonContent } from '../components/lesson/LessonContent';
import { DetailedLessonContent } from '../components/lesson/DetailedLessonContent';
import { QuickReviewContent } from '../components/lesson/QuickReviewContent';
import { PracticeContent } from '../components/lesson/PracticeContent';
import { TableOfContents } from '../components/lesson/TableOfContents';
import { LessonReadingControls } from '../components/lesson/LessonReadingControls';
import { LessonNotes } from '../components/lesson/LessonNotes';
import { LessonPagination } from '../components/lesson/LessonPagination';
import { selectDetailedLesson } from '../lib/detailedContent';
import { readReadingPosition, writeReadingPosition } from '../lib/readingPosition';

interface LessonViewProps {
  lessonId: string;
  lessons: Lesson[];
  detailedLessons: DetailedLessonMap;
  practiceLessons?: PracticeLessonMap;
  syntaxSections: SyntaxSection[];
  state: StudyStateV1;
  onUpdateState: (updater: (prev: StudyStateV1) => StudyStateV1) => void;
  onNavigate: (path: string) => void;
  isFullView?: boolean;
  onFullViewChange?: (active: boolean) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lessonId,
  lessons,
  detailedLessons,
  practiceLessons = {},
  syntaxSections,
  state,
  onUpdateState,
  onNavigate,
  isFullView = false,
  onFullViewChange = () => undefined
}) => {
  const [activeMode, setActiveMode] = useState<'detailed' | 'quickReview' | 'practice'>(state.preferredMode || 'detailed');

  const currentIndex = lessons.findIndex(l => l.id === lessonId);
  const lesson = currentIndex !== -1 ? lessons[currentIndex] : lessons[0];
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const detailedLesson = selectDetailedLesson(lesson, detailedLessons);
  const detailedToc = detailedLesson?.toc || lesson.toc;
  const practiceLesson = practiceLessons[lesson.id];

  useEffect(() => {
    if (activeMode === 'practice' && !practiceLesson) {
      setActiveMode('detailed');
    }
  }, [activeMode, practiceLesson]);

  // Track recent lessons and last opened lesson
  useEffect(() => {
    if (!lesson) return;

    onUpdateState(prev => {
      const recents = [lesson.id, ...prev.recentLessonIds.filter((id: string) => id !== lesson.id)].slice(0, 10);
      return {
        ...prev,
        lastOpenedLessonId: lesson.id,
        recentLessonIds: recents
      };
    });

    window.scrollTo({ top: readReadingPosition(lesson.id), behavior: 'auto' });
  }, [lesson, onUpdateState]);

  // Keep a lightweight, lesson-scoped reading checkpoint without coupling it
  // to the main study state. The requestAnimationFrame guard prevents a long
  // reading session from writing localStorage for every scroll event.
  useEffect(() => {
    if (!lesson) return;

    let frame: number | null = null;
    let frameType: 'animation' | 'timeout' | null = null;
    let lastPosition = Math.max(0, window.scrollY || 0);

    const persist = () => {
      frame = null;
      frameType = null;
      lastPosition = Math.max(0, window.scrollY || 0);
      writeReadingPosition(lesson.id, lastPosition);
    };

    const schedulePersist = () => {
      // Capture the position synchronously so route changes cannot replace it
      // with the next page's temporary scroll-to-top position during cleanup.
      lastPosition = Math.max(0, window.scrollY || 0);
      if (frame !== null) return;

      if (typeof window.requestAnimationFrame === 'function') {
        frameType = 'animation';
        frame = window.requestAnimationFrame(persist);
      } else {
        frameType = 'timeout';
        frame = window.setTimeout(persist, 0);
      }
    };

    const flushPersist = () => {
      if (frame !== null) {
        if (frameType === 'animation' && typeof window.cancelAnimationFrame === 'function') {
          window.cancelAnimationFrame(frame);
        } else if (frameType === 'timeout') {
          window.clearTimeout(frame);
        }
        frame = null;
        frameType = null;
      }
      writeReadingPosition(lesson.id, lastPosition);
    };

    window.addEventListener('scroll', schedulePersist, { passive: true });
    window.addEventListener('pagehide', flushPersist);

    return () => {
      window.removeEventListener('scroll', schedulePersist);
      window.removeEventListener('pagehide', flushPersist);
      flushPersist();
    };
  }, [lesson]);

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  const isCompleted = state.completedLessons.includes(lesson.id);
  const isBookmarked = state.bookmarkedLessons.includes(lesson.id);
  const initialNote = state.lessonNotes[lesson.id] || '';

  // Get matching syntax reference sections
  const matchedSyntaxSections = lesson.quickReviewSectionIds
    .map((secId: number) => syntaxSections.find(s => s.id === secId))
    .filter((s): s is SyntaxSection => Boolean(s));

  const handleToggleComplete = () => {
    onUpdateState(prev => {
      const exists = prev.completedLessons.includes(lesson.id);
      const updated = exists
        ? prev.completedLessons.filter((id: string) => id !== lesson.id)
        : [...prev.completedLessons, lesson.id];
      return { ...prev, completedLessons: updated };
    });
  };

  const handleToggleBookmark = () => {
    onUpdateState(prev => {
      const exists = prev.bookmarkedLessons.includes(lesson.id);
      const updated = exists
        ? prev.bookmarkedLessons.filter((id: string) => id !== lesson.id)
        : [...prev.bookmarkedLessons, lesson.id];
      return { ...prev, bookmarkedLessons: updated };
    });
  };

  const handleSaveNote = (lId: string, noteText: string) => {
    onUpdateState(prev => ({
      ...prev,
      lessonNotes: {
        ...prev.lessonNotes,
        [lId]: noteText
      }
    }));
  };

  const handlePracticeModeChange = (mode: 'detailed' | 'quickReview' | 'practice') => {
    setActiveMode(mode);
    if (mode !== 'practice') {
      onUpdateState(prev => ({ ...prev, preferredMode: mode }));
    }
  };

  const handlePracticeProgressChange = (progress: PracticeProgress) => {
    onUpdateState(prev => ({
      ...prev,
      practiceProgress: {
        ...(prev.practiceProgress || {}),
        [lesson.id]: progress
      }
    }));
  };

  return (
    <div className="lesson-layout">
      {/* Main Lesson Column */}
      <div className="lesson-main-column">
        <LessonHeader
          lessonId={lesson.id}
          title={lesson.title}
          category={lesson.category}
          isCompleted={isCompleted}
          isBookmarked={isBookmarked}
          activeMode={activeMode}
          hasPractice={Boolean(practiceLesson)}
          onToggleComplete={handleToggleComplete}
          onToggleBookmark={handleToggleBookmark}
          onModeChange={handlePracticeModeChange}
          isFullView={isFullView}
          onToggleFullView={onFullViewChange}
        />

        {activeMode === 'detailed' && detailedToc.length > 1 && (
          <TableOfContents items={detailedToc} variant="mobile" />
        )}

        {/* Dynamic Mode Content */}
        <div
          id={`lesson-${lesson.id}-mode-panel`}
          className="lesson-mode-panel"
          role="tabpanel"
          aria-labelledby={`lesson-${lesson.id}-${activeMode}-tab`}
          tabIndex={0}
        >
          {activeMode === 'detailed' ? (
            detailedLesson ? (
              <DetailedLessonContent lesson={detailedLesson} />
            ) : (
              <LessonContent sections={lesson.parsedSections} />
            )
          ) : activeMode === 'quickReview' ? (
            <QuickReviewContent
              syntaxSections={matchedSyntaxSections}
              onOpenFullReference={(secId: number) => onNavigate(`/reference?section=${secId}`)}
            />
          ) : practiceLesson ? (
            <PracticeContent
              lesson={practiceLesson}
              progress={state.practiceProgress?.[lesson.id]}
              onProgressChange={handlePracticeProgressChange}
            />
          ) : null}
        </div>

        {/* Personal Study Notes */}
        <LessonNotes
          lessonId={lesson.id}
          initialNote={initialNote}
          onSaveNote={handleSaveNote}
        />

        {/* Lesson Pagination */}
        <LessonPagination
          prevLesson={prevLesson}
          nextLesson={nextLesson}
          isCompleted={isCompleted}
          onSelectLesson={(id: string) => onNavigate(`/lesson/${id}`)}
          onToggleComplete={handleToggleComplete}
        />
      </div>

      {/* Sticky Table of Contents (Desktop) */}
      {activeMode === 'detailed' && detailedToc.length > 1 && (
        <TableOfContents items={detailedToc} variant="desktop" />
      )}

      <LessonReadingControls />
    </div>
  );
};
