import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { SearchModal } from '../search/SearchModal';
import { BackupModal } from '../backup/BackupModal';
import { Lesson, SyntaxSection } from '../../types/content';
import { StudyStateV1 } from '../../types/state';
import { IndexedItem } from '../../lib/searchIndex';
import { closeTransientOverlays } from '../../lib/overlayEvents';

interface AppShellProps {
  currentPath: string;
  lessons: Lesson[];
  syntaxSections: SyntaxSection[];
  searchIndex: IndexedItem[];
  state: StudyStateV1;
  activeLessonId: string | null;
  onNavigate: (path: string) => void;
  onUpdateState: (updater: (prev: StudyStateV1) => StudyStateV1) => void;
  onThemeChange: (theme: 'dark' | 'light' | 'system') => void;
  isFullView?: boolean;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentPath,
  lessons,
  searchIndex,
  state,
  activeLessonId,
  onNavigate,
  onUpdateState,
  onThemeChange,
  isFullView = false,
  children
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMobileDrawer = useCallback(() => setIsMobileDrawerOpen(false), []);
  const openSearch = useCallback(() => {
    closeTransientOverlays();
    setIsBackupOpen(false);
    setIsMobileDrawerOpen(false);
    setIsSearchOpen(true);
  }, []);
  const openBackup = useCallback(() => {
    closeTransientOverlays();
    setIsSearchOpen(false);
    setIsMobileDrawerOpen(false);
    setIsBackupOpen(true);
  }, []);

  // Global keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isSearchOpen) setIsSearchOpen(false);
        else openSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, openSearch]);

  const isFullWidthPage = currentPath.startsWith('/reference') || currentPath === '/bookmarks' || currentPath === '/notes';

  return (
    <div
      className={`app-shell${isFullView ? ' app-shell--full-view' : ''}`}
      data-full-view={isFullView ? 'true' : undefined}
      data-testid="app-shell"
    >
      {/* Desktop Sidebar (visible on screens > 1024px) */}
      <Sidebar
        lessons={lessons}
        activeLessonId={activeLessonId}
        completedLessonIds={state.completedLessons}
        bookmarkedLessonIds={state.bookmarkedLessons}
        onSelectLesson={(id) => onNavigate(`/lesson/${id}`)}
      />

      {/* Mobile Slide-over Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={closeMobileDrawer}
        lessons={lessons}
        activeLessonId={activeLessonId}
        state={state}
        currentPath={currentPath}
        onNavigate={onNavigate}
        onOpenBackup={openBackup}
        triggerRef={mobileMenuButtonRef}
      />

      {/* Main Column */}
      <div className="app-main-wrapper">
        <Header
          currentPath={currentPath}
          isMobileDrawerOpen={isMobileDrawerOpen}
          mobileMenuButtonRef={mobileMenuButtonRef}
          onNavigate={onNavigate}
          onOpenSearch={openSearch}
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
          onOpenBackup={openBackup}
          state={state}
          onThemeChange={onThemeChange}
        />

        <main className={`app-content ${isFullWidthPage ? 'full-width' : ''}`}>
          {children}
        </main>
      </div>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        index={searchIndex}
        onSelectResult={(url) => onNavigate(url)}
      />

      {/* Backup & Restore Modal */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        state={state}
        onStateRestored={(newState) => onUpdateState(() => newState)}
      />
    </div>
  );
};
