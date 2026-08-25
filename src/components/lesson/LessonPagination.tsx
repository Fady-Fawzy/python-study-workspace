import React from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Lesson } from '../../types/content';

interface LessonPaginationProps {
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
  isCompleted: boolean;
  onSelectLesson: (id: string) => void;
  onToggleComplete: () => void;
}

export const LessonPagination: React.FC<LessonPaginationProps> = ({
  prevLesson,
  nextLesson,
  isCompleted,
  onSelectLesson,
  onToggleComplete
}) => (
  <section className="lesson-pagination" aria-label="Lesson progress and navigation">
    <div className="lesson-pagination__completion">
      <div>
        <strong>{isCompleted ? 'Lesson complete' : 'Finished studying?'}</strong>
        <span>{isCompleted ? 'Your progress is saved.' : 'Mark this lesson to update your study progress.'}</span>
      </div>
      <button
        type="button"
        className="lesson-pagination__complete"
        data-completed={isCompleted || undefined}
        aria-pressed={isCompleted}
        onClick={onToggleComplete}
      >
        <Check size={18} strokeWidth={isCompleted ? 3 : 2} aria-hidden="true" />
        <span>{isCompleted ? 'Lesson Completed' : 'Mark Lesson as Completed'}</span>
      </button>
    </div>

    <nav className="lesson-pagination__links" aria-label="Lesson pagination">
      {prevLesson && (
        <button
          type="button"
          className="lesson-pagination__link lesson-pagination__link--previous"
          aria-label={`Previous lesson ${prevLesson.id}: ${prevLesson.title}`}
          onClick={() => onSelectLesson(prevLesson.id)}
        >
          <span className="lesson-pagination__direction">
            <ChevronLeft size={16} aria-hidden="true" />
            Previous lesson
          </span>
          <span className="lesson-pagination__lesson">
            <bdi dir="ltr">{prevLesson.id}</bdi>
            <span aria-hidden="true">—</span>
            <span>{prevLesson.title}</span>
          </span>
        </button>
      )}

      {nextLesson && (
        <button
          type="button"
          className="lesson-pagination__link lesson-pagination__link--next"
          aria-label={`Next lesson ${nextLesson.id}: ${nextLesson.title}`}
          onClick={() => onSelectLesson(nextLesson.id)}
        >
          <span className="lesson-pagination__direction">
            Next lesson
            <ChevronRight size={16} aria-hidden="true" />
          </span>
          <span className="lesson-pagination__lesson">
            <bdi dir="ltr">{nextLesson.id}</bdi>
            <span aria-hidden="true">—</span>
            <span>{nextLesson.title}</span>
          </span>
        </button>
      )}
    </nav>
  </section>
);
