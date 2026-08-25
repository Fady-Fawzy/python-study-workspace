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
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      aria-pressed={isBookmarked}
    >
      <Bookmark
        size={size}
        strokeWidth={2}
        fill={isBookmarked ? 'currentColor' : 'none'}
      />
    </button>
  );
};
