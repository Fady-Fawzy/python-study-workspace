import React from 'react';
import { Check, BookOpen, Zap } from 'lucide-react';
import { BookmarkButton } from '../shared/BookmarkButton';

interface LessonHeaderProps {
  lessonId: string;
  title: string;
  category: string;
  isCompleted: boolean;
  isBookmarked: boolean;
  activeMode: 'detailed' | 'quickReview';
  onToggleComplete: () => void;
  onToggleBookmark: () => void;
  onModeChange: (mode: 'detailed' | 'quickReview') => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  lessonId,
  title,
  category,
  isCompleted,
  isBookmarked,
  activeMode,
  onToggleComplete,
  onToggleBookmark,
  onModeChange
}) => {
  return (
    <div
      style={{
        paddingBottom: 'var(--space-5)',
        marginBottom: 'var(--space-6)',
        borderBottom: '1px solid var(--border-subtle)',
        width: '100%'
      }}
    >
      {/* Top category & action buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-3)',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
          width: '100%'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent-primary-muted)',
              color: 'var(--accent-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600
            }}
          >
            Lesson {lessonId}
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            {category}
          </span>
        </div>

        {/* Actions: Bookmark & Complete */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <BookmarkButton
            isBookmarked={isBookmarked}
            onToggle={onToggleBookmark}
            title="Bookmark this lesson"
          />

          <button
            type="button"
            onClick={onToggleComplete}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              backgroundColor: isCompleted ? 'var(--accent-success-muted)' : 'var(--bg-surface-raised)',
              color: isCompleted ? 'var(--accent-success)' : 'var(--text-secondary)',
              border: `1px solid ${isCompleted ? 'var(--accent-success)' : 'var(--border-subtle)'}`,
              transition: 'all var(--transition-fast)',
              minHeight: '36px'
            }}
          >
            <Check size={14} strokeWidth={isCompleted ? 3 : 2} />
            <span>{isCompleted ? 'Completed ✓' : 'Mark Complete'}</span>
          </button>
        </div>
      </div>

      {/* Main Title */}
      <h1
        style={{
          fontSize: 'clamp(1.2rem, 4vw, 1.75rem)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: 'var(--space-4)',
          wordBreak: 'break-word'
        }}
      >
        {title}
      </h1>

      {/* Mode Switcher: Detailed vs Quick Review */}
      <div
        style={{
          display: 'inline-flex',
          padding: '3px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface-raised)',
          border: '1px solid var(--border-subtle)',
          maxWidth: '100%',
          flexWrap: 'wrap',
          gap: '2px'
        }}
      >
        <button
          type="button"
          onClick={() => onModeChange('detailed')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            fontWeight: activeMode === 'detailed' ? 600 : 500,
            backgroundColor: activeMode === 'detailed' ? 'var(--bg-surface)' : 'transparent',
            color: activeMode === 'detailed' ? 'var(--text-primary)' : 'var(--text-muted)',
            boxShadow: activeMode === 'detailed' ? 'var(--shadow-sm)' : 'none',
            transition: 'all var(--transition-fast)'
          }}
        >
          <BookOpen size={14} />
          <span>Detailed Study</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('quickReview')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            fontWeight: activeMode === 'quickReview' ? 600 : 500,
            backgroundColor: activeMode === 'quickReview' ? 'var(--bg-surface)' : 'transparent',
            color: activeMode === 'quickReview' ? 'var(--accent-gold)' : 'var(--text-muted)',
            boxShadow: activeMode === 'quickReview' ? 'var(--shadow-sm)' : 'none',
            transition: 'all var(--transition-fast)'
          }}
        >
          <Zap size={14} />
          <span>Quick Review</span>
        </button>
      </div>
    </div>
  );
};
