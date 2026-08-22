import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
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
}) => {
  return (
    <div
      style={{
        marginTop: 'var(--space-10)',
        paddingTop: 'var(--space-6)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)'
      }}
    >
      {/* Mark Complete Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-3)',
          backgroundColor: 'var(--bg-surface-raised)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <button
          type="button"
          onClick={onToggleComplete}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '8px 20px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isCompleted ? 'var(--accent-success)' : 'var(--accent-primary)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: 'var(--text-sm)',
            transition: 'all var(--transition-fast)',
            minHeight: '42px'
          }}
        >
          <Check size={16} strokeWidth={isCompleted ? 3 : 2} />
          <span>{isCompleted ? 'Lesson Completed ✓' : 'Mark Lesson as Completed'}</span>
        </button>
      </div>

      {/* Prev / Next Buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-3)'
        }}
      >
        {prevLesson ? (
          <button
            type="button"
            onClick={() => onSelectLesson(prevLesson.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              textAlign: 'left',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              <ChevronLeft size={14} />
              <span>Previous Lesson</span>
            </div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              {prevLesson.id} — {prevLesson.title}
            </div>
          </button>
        ) : <div />}

        {nextLesson ? (
          <button
            type="button"
            onClick={() => onSelectLesson(nextLesson.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              textAlign: 'right',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              <span>Next Lesson</span>
              <ChevronRight size={14} />
            </div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              {nextLesson.id} — {nextLesson.title}
            </div>
          </button>
        ) : <div />}
      </div>
    </div>
  );
};
