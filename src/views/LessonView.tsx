import React, { useEffect, useRef, useState } from 'react';
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
import { LessonStudyDock, StudyMode } from '../components/lesson/LessonStudyDock';
import { LessonNotesSurface } from '../components/lesson/LessonNotesSurface';
import { LessonPagination } from '../components/lesson/LessonPagination';
import { LessonSyntaxLinks } from '../components/lesson/LessonSyntaxLinks';
import { selectDetailedLesson } from '../lib/detailedContent';
import {
  ReadingCheckpoint,
  readReadingCheckpoint,
  writeReadingCheckpoint
} from '../lib/readingPosition';
import { recordStudyActivity } from '../lib/studyActivity';
import { closeTransientOverlays } from '../lib/overlayEvents';
import { useLessonSectionProgress } from '../hooks/useLessonSectionProgress';

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
  const [activeMode, setActiveMode] = useState<StudyMode>(state.preferredMode || 'detailed');
  const [isContentsOpen, setIsContentsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [savedCheckpoint, setSavedCheckpoint] = useState<ReadingCheckpoint>(() => (
    readReadingCheckpoint(lessonId)
  ));
  const contentsButtonRef = useRef<HTMLButtonElement>(null);
  const notesButtonRef = useRef<HTMLButtonElement>(null);

  const currentIndex = lessons.findIndex(l => l.id === lessonId);
  const lesson = currentIndex !== -1 ? lessons[currentIndex] : lessons[0];
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const detailedLesson = selectDetailedLesson(lesson, detailedLessons);
  const detailedToc = detailedLesson?.toc || lesson.toc;
  const practiceLesson = practiceLessons[lesson.id];
  const sectionProgress = useLessonSectionProgress(
    detailedToc,
    activeMode === 'detailed' && detailedToc.length > 0
  );
  const activeSectionRef = useRef(sectionProgress.activeItem);
  activeSectionRef.current = sectionProgress.activeItem;

  useEffect(() => {
    if (activeMode === 'practice' && !practiceLesson) {
      setActiveMode('detailed');
    }
  }, [activeMode, practiceLesson]);

  // Track recent lessons and last opened lesson
  useEffect(() => {
    if (!lesson) return;

    recordStudyActivity();

    onUpdateState(prev => {
      const recents = [lesson.id, ...prev.recentLessonIds.filter((id: string) => id !== lesson.id)].slice(0, 10);
      return {
        ...prev,
        lastOpenedLessonId: lesson.id,
        recentLessonIds: recents
      };
    });

    setIsContentsOpen(false);
    setIsNotesOpen(false);

    const checkpoint = readReadingCheckpoint(lesson.id);
    setSavedCheckpoint(checkpoint);
    const savedHeading = checkpoint.sectionId
      ? document.getElementById(checkpoint.sectionId)
      : null;
    if (savedHeading && typeof savedHeading.scrollIntoView === 'function') {
      savedHeading.scrollIntoView({ behavior: 'auto', block: 'start' });
    } else {
      window.scrollTo({ top: checkpoint.y, behavior: 'auto' });
    }
  }, [lesson, onUpdateState]);

  // Keep a lightweight, lesson-scoped reading checkpoint without coupling it
  // to the main study state. The requestAnimationFrame guard prevents a long
  // reading session from writing localStorage for every scroll event.
  useEffect(() => {
    if (!lesson || activeMode !== 'detailed') return;

    let frame: number | null = null;
    let frameType: 'animation' | 'timeout' | null = null;
    let pending = false;
    let lastPosition = Math.max(0, window.scrollY || 0);

    const persist = () => {
      frame = null;
      frameType = null;
      pending = false;
      lastPosition = Math.max(0, window.scrollY || 0);
      const activeSection = activeSectionRef.current;
      writeReadingCheckpoint(lesson.id, {
        y: lastPosition,
        sectionId: activeSection?.id ?? null,
        sectionText: activeSection?.text ?? null
      });
    };

    const schedulePersist = () => {
      // Capture the position synchronously so route changes cannot replace it
      // with the next page's temporary scroll-to-top position during cleanup.
      lastPosition = Math.max(0, window.scrollY || 0);
      if (pending) return;
      pending = true;

      if (typeof window.requestAnimationFrame === 'function') {
        frameType = 'animation';
        frame = window.requestAnimationFrame(persist);
      } else {
        frameType = 'timeout';
        frame = window.setTimeout(persist, 0);
      }
    };

    const flushPersist = () => {
      if (pending && frame !== null) {
        if (frameType === 'animation' && typeof window.cancelAnimationFrame === 'function') {
          window.cancelAnimationFrame(frame);
        } else if (frameType === 'timeout') {
          window.clearTimeout(frame);
        }
        frame = null;
        frameType = null;
        pending = false;
      }
      const activeSection = activeSectionRef.current;
      writeReadingCheckpoint(lesson.id, {
        y: lastPosition,
        sectionId: activeSection?.id ?? null,
        sectionText: activeSection?.text ?? null
      });
    };

    window.addEventListener('scroll', schedulePersist, { passive: true });
    window.addEventListener('pagehide', flushPersist);

    return () => {
      window.removeEventListener('scroll', schedulePersist);
      window.removeEventListener('pagehide', flushPersist);
      flushPersist();
    };
  }, [activeMode, lesson]);

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
      },
      lessonNoteUpdatedAt: noteText.trim()
        ? {
            ...(prev.lessonNoteUpdatedAt || {}),
            [lId]: new Date().toISOString()
          }
        : Object.fromEntries(
            Object.entries(prev.lessonNoteUpdatedAt || {}).filter(([lessonKey]) => lessonKey !== lId)
          )
    }));
  };

  const handlePracticeModeChange = (mode: StudyMode) => {
    setActiveMode(mode);
    setIsContentsOpen(false);
    if (mode === 'practice') setIsNotesOpen(false);
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

  const handleOpenContents = () => {
    closeTransientOverlays();
    setIsNotesOpen(false);
    setIsContentsOpen(true);
  };

  const handleOpenNotes = () => {
    closeTransientOverlays();
    setIsContentsOpen(false);
    setIsNotesOpen(true);
  };

  const handleResume = () => {
    if (savedCheckpoint.sectionId) {
      const heading = document.getElementById(savedCheckpoint.sectionId);
      if (heading && typeof heading.scrollIntoView === 'function') {
        heading.scrollIntoView({ behavior: 'auto', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: savedCheckpoint.y, behavior: 'auto' });
  };

  const savedSectionIndex = savedCheckpoint.sectionId
    ? detailedToc.findIndex(item => item.id === savedCheckpoint.sectionId)
    : -1;
  const canResume = Boolean(savedCheckpoint.sectionId)
    && (savedCheckpoint.y > 96 || savedSectionIndex > 0);
  const hasSectionNavigation = activeMode === 'detailed' && detailedToc.length > 1;

  return (
    <div
      className="lesson-layout lesson-workspace"
      data-notes-open={isNotesOpen || undefined}
      data-study-mode={activeMode}
    >
      {/* Main Lesson Column */}
      <div className="lesson-main-column">
        <LessonHeader
          lessonId={lesson.id}
          title={lesson.title}
          category={lesson.category}
          isCompleted={isCompleted}
          isBookmarked={isBookmarked}
          onToggleComplete={handleToggleComplete}
          onToggleBookmark={handleToggleBookmark}
          isFullView={isFullView}
          onToggleFullView={onFullViewChange}
        />

        <LessonStudyDock
          lessonId={lesson.id}
          activeMode={activeMode}
          hasPractice={Boolean(practiceLesson)}
          activeSectionText={sectionProgress.activeItem?.text}
          activeSectionIndex={sectionProgress.activeIndex}
          sectionTotal={sectionProgress.total}
          sectionProgress={sectionProgress.progress}
          canOpenContents={hasSectionNavigation}
          canResume={canResume}
          resumeSectionText={savedCheckpoint.sectionText}
          contentsButtonRef={contentsButtonRef}
          notesButtonRef={notesButtonRef}
          onModeChange={handlePracticeModeChange}
          onOpenContents={handleOpenContents}
          onOpenNotes={handleOpenNotes}
          onResume={handleResume}
        />

        {hasSectionNavigation && (
          <TableOfContents
            items={detailedToc}
            variant="mobile"
            activeId={sectionProgress.activeId}
            onSelectItem={item => sectionProgress.scrollToSection(item.id)}
            isOpen={isContentsOpen}
            onOpenChange={setIsContentsOpen}
            triggerMode="external"
            returnFocusRef={contentsButtonRef}
          />
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

        <LessonSyntaxLinks
          sections={matchedSyntaxSections}
          onNavigate={onNavigate}
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
      {hasSectionNavigation && (
        <TableOfContents
          items={detailedToc}
          variant="desktop"
          activeId={sectionProgress.activeId}
          onSelectItem={item => sectionProgress.scrollToSection(item.id)}
        />
      )}

      <LessonNotesSurface
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        lessonId={lesson.id}
        initialNote={initialNote}
        onSaveNote={handleSaveNote}
        returnFocusRef={notesButtonRef}
      />

      <LessonReadingControls />
    </div>
  );
};
