import type { FC } from 'react';
import { BookOpen, FileText, ListTree, Search } from 'lucide-react';

interface MobileBottomNavProps {
  currentPath: string;
  isLessonsOpen: boolean;
  onNavigate: (path: string) => void;
  onOpenLessons: () => void;
  onOpenSearch: () => void;
}

const isStudyPath = (path: string) => path === '/' || path.startsWith('/lesson/');

export const MobileBottomNav: FC<MobileBottomNavProps> = ({
  currentPath,
  isLessonsOpen,
  onNavigate,
  onOpenLessons,
  onOpenSearch
}) => (
  <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
    <button
      type="button"
      className="mobile-bottom-nav__item"
      aria-current={isStudyPath(currentPath) ? 'page' : undefined}
      onClick={() => onNavigate('/')}
    >
      <BookOpen size={19} aria-hidden="true" />
      <span>Study</span>
    </button>
    <button
      type="button"
      className="mobile-bottom-nav__item"
      aria-expanded={isLessonsOpen}
      aria-controls="mobile-navigation-drawer"
      onClick={onOpenLessons}
    >
      <ListTree size={19} aria-hidden="true" />
      <span>Lessons</span>
    </button>
    <button
      type="button"
      className="mobile-bottom-nav__item"
      onClick={onOpenSearch}
    >
      <Search size={19} aria-hidden="true" />
      <span>Search</span>
    </button>
    <button
      type="button"
      className="mobile-bottom-nav__item"
      aria-current={currentPath.startsWith('/notes') ? 'page' : undefined}
      onClick={() => onNavigate('/notes')}
    >
      <FileText size={19} aria-hidden="true" />
      <span>Notes</span>
    </button>
  </nav>
);
