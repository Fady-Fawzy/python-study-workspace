import React, { useState, useEffect } from 'react';
import { DetailedLessonMap, Lesson, SyntaxSection } from '../types/content';
import { StudyStateV1 } from '../types/state';
import { LessonHeader } from '../components/lesson/LessonHeader';
import { LessonContent } from '../components/lesson/LessonContent';
import { DetailedLessonContent } from '../components/lesson/DetailedLessonContent';
import { QuickReviewContent } from '../components/lesson/QuickReviewContent';
import { TableOfContents } from '../components/lesson/TableOfContents';
import { LessonNotes } from '../components/lesson/LessonNotes';
import { LessonPagination } from '../components/lesson/LessonPagination';
import { selectDetailedLesson } from '../lib/detailedContent';

interface LessonViewProps {
  lessonId: string;
  lessons: Lesson[];
  detailedLessons: DetailedLessonMap;
  syntaxSections: SyntaxSection[];
  state: StudyStateV1;
  onUpdateState: (updater: (prev: StudyStateV1) => StudyStateV1) => void;
  onNavigate: (path: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lessonId,
  lessons,
  detailedLessons,
  syntaxSections,
  state,
  onUpdateState,
  onNavigate
}) => {
  const [activeMode, setActiveMode] = useState<'detailed' | 'quickReview'>(state.preferredMode || 'detailed');

  const currentIndex = lessons.findIndex(l => l.id === lessonId);
  const lesson = currentIndex !== -1 ? lessons[currentIndex] : lessons[0];
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const detailedLesson = selectDetailedLesson(lesson, detailedLessons);
  const detailedToc = detailedLesson?.toc || lesson.toc;

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

    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [lesson, onUpdateState]);

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

  const handleModeChange = (mode: 'detailed' | 'quickReview') => {
    setActiveMode(mode);
    onUpdateState(prev => ({ ...prev, preferredMode: mode }));
  };

  return (
    <div style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'flex-start' }}>
      {/* Main Lesson Column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <LessonHeader
          lessonId={lesson.id}
          title={lesson.title}
          category={lesson.category}
          isCompleted={isCompleted}
          isBookmarked={isBookmarked}
          activeMode={activeMode}
          onToggleComplete={handleToggleComplete}
          onToggleBookmark={handleToggleBookmark}
          onModeChange={handleModeChange}
        />

        {/* Dynamic Mode Content */}
        {activeMode === 'detailed' ? (
          detailedLesson ? (
            <DetailedLessonContent lesson={detailedLesson} />
          ) : (
            <LessonContent sections={lesson.parsedSections} />
          )
        ) : (
          <QuickReviewContent
            syntaxSections={matchedSyntaxSections}
            onOpenFullReference={(secId: number) => onNavigate(`/reference?section=${secId}`)}
          />
        )}

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
        <TableOfContents items={detailedToc} />
      )}
    </div>
  );
};
