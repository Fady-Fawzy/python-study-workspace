import React from 'react';
import { Check, Maximize2, Minimize2 } from 'lucide-react';
import { BookmarkButton } from '../shared/BookmarkButton';

interface LessonHeaderProps {
  lessonId: string;
  title: string;
  category: string;
  isCompleted: boolean;
  isBookmarked: boolean;
  onToggleComplete: () => void;
  onToggleBookmark: () => void;
  isFullView?: boolean;
  onToggleFullView?: (active: boolean) => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  lessonId,
  title,
  category,
  isCompleted,
  isBookmarked,
  onToggleComplete,
  onToggleBookmark,
  isFullView = false,
  onToggleFullView = () => undefined
}) => {
  return (
    <header className="lesson-header lesson-masthead" aria-label="Lesson overview">
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
    </header>
  );
};
