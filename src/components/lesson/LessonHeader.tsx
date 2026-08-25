import React, { KeyboardEvent } from 'react';
import { BookOpen, Check, ClipboardCheck, Maximize2, Minimize2, Zap } from 'lucide-react';
import { BookmarkButton } from '../shared/BookmarkButton';

type StudyMode = 'detailed' | 'quickReview' | 'practice';

interface LessonHeaderProps {
  lessonId: string;
  title: string;
  category: string;
  isCompleted: boolean;
  isBookmarked: boolean;
  activeMode: StudyMode;
  hasPractice?: boolean;
  onToggleComplete: () => void;
  onToggleBookmark: () => void;
  onModeChange: (mode: StudyMode) => void;
  isFullView?: boolean;
  onToggleFullView?: (active: boolean) => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  lessonId,
  title,
  category,
  isCompleted,
  isBookmarked,
  activeMode,
  hasPractice = false,
  onToggleComplete,
  onToggleBookmark,
  onModeChange,
  isFullView = false,
  onToggleFullView = () => undefined
}) => {
  const modes: StudyMode[] = hasPractice
    ? ['detailed', 'quickReview', 'practice']
    : ['detailed', 'quickReview'];

  const selectMode = (mode: typeof modes[number]) => {
    onModeChange(mode);
    window.requestAnimationFrame(() => {
      document.getElementById(`lesson-${lessonId}-${mode}-tab`)?.focus();
    });
  };

  const handleModeKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    mode: typeof modes[number]
  ) => {
    const currentIndex = modes.indexOf(mode);
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % modes.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + modes.length) % modes.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = modes.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      selectMode(modes[nextIndex]);
    }
  };

  return (
    <header className="lesson-header">
      <div className="lesson-header__topline">
        <div className="lesson-header__meta">
          <span className="lesson-header__number" dir="ltr">Lesson {lessonId}</span>
          <span className="lesson-header__category" dir="auto">{category}</span>
        </div>

        <div className="lesson-header__actions" aria-label="Lesson actions">
          <div className="lesson-header__secondary-actions">
            <BookmarkButton
              isBookmarked={isBookmarked}
              onToggle={onToggleBookmark}
              title="Bookmark this lesson"
            />
            <button
              type="button"
              className="lesson-complete-button"
              data-completed={isCompleted || undefined}
              onClick={onToggleComplete}
              aria-pressed={isCompleted}
              aria-label={isCompleted ? 'Lesson completed; mark incomplete' : 'Mark lesson complete'}
            >
              <Check size={16} strokeWidth={isCompleted ? 3 : 2} aria-hidden="true" />
              <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>
          </div>
          <button
            type="button"
            className="lesson-full-view-toggle"
            data-active={isFullView || undefined}
            onClick={() => onToggleFullView(!isFullView)}
            aria-pressed={isFullView}
            aria-label={isFullView ? 'Exit Full View' : 'Full View'}
            title={isFullView ? 'Exit Full View' : 'Full View'}
          >
            {isFullView ? (
              <Minimize2 size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Maximize2 size={16} strokeWidth={2} aria-hidden="true" />
            )}
            <span>{isFullView ? 'Exit Full View' : 'Full View'}</span>
          </button>
        </div>
      </div>

      <h1 className="lesson-header__title" dir="auto">{title}</h1>

      <div
        className="lesson-mode-switch"
        data-mode-count={modes.length}
        role="tablist"
        aria-label="Study mode"
      >
        <button
          id={`lesson-${lessonId}-detailed-tab`}
          type="button"
          role="tab"
          className="lesson-mode-switch__tab"
          data-selected={activeMode === 'detailed' || undefined}
          aria-selected={activeMode === 'detailed'}
          aria-controls={`lesson-${lessonId}-mode-panel`}
          tabIndex={activeMode === 'detailed' ? 0 : -1}
          onClick={() => onModeChange('detailed')}
          onKeyDown={(event) => handleModeKeyDown(event, 'detailed')}
        >
          <BookOpen size={17} aria-hidden="true" />
          <span>Detailed Study</span>
        </button>

        <button
          id={`lesson-${lessonId}-quickReview-tab`}
          type="button"
          role="tab"
          className="lesson-mode-switch__tab lesson-mode-switch__tab--quick"
          data-selected={activeMode === 'quickReview' || undefined}
          aria-selected={activeMode === 'quickReview'}
          aria-controls={`lesson-${lessonId}-mode-panel`}
          tabIndex={activeMode === 'quickReview' ? 0 : -1}
          onClick={() => onModeChange('quickReview')}
          onKeyDown={(event) => handleModeKeyDown(event, 'quickReview')}
        >
          <Zap size={17} aria-hidden="true" />
          <span>Quick Review</span>
        </button>

        {hasPractice && (
          <button
            id={`lesson-${lessonId}-practice-tab`}
            type="button"
            role="tab"
            className="lesson-mode-switch__tab lesson-mode-switch__tab--practice"
            data-selected={activeMode === 'practice' || undefined}
            aria-selected={activeMode === 'practice'}
            aria-controls={`lesson-${lessonId}-mode-panel`}
            tabIndex={activeMode === 'practice' ? 0 : -1}
            onClick={() => onModeChange('practice')}
            onKeyDown={(event) => handleModeKeyDown(event, 'practice')}
          >
            <ClipboardCheck size={17} aria-hidden="true" />
            <span>Practice</span>
          </button>
        )}
      </div>
    </header>
  );
};
