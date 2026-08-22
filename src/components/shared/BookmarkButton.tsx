import React from 'react';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  title?: string;
  size?: number;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked,
  onToggle,
  title = 'Bookmark for quick review',
  size = 16
}) => {
  return (
    <button
      type="button"
      className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
      onClick={onToggle}
      title={isBookmarked ? 'Remove bookmark' : title}
      aria-label={isBookmarked ? 'Bookmarked' : 'Add bookmark'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${isBookmarked ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
        backgroundColor: isBookmarked ? 'var(--accent-gold-muted)' : 'var(--bg-surface-raised)',
        color: isBookmarked ? 'var(--accent-gold)' : 'var(--text-muted)',
        transition: 'all var(--transition-fast)'
      }}
    >
      <Bookmark
        size={size}
        strokeWidth={2}
        fill={isBookmarked ? 'currentColor' : 'none'}
      />
    </button>
  );
};
