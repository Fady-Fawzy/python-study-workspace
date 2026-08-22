import { useState, useEffect, useMemo, useCallback } from 'react';
import lessonsRaw from '../elzero_python_lessons_20_to_74.md?raw';
import syntaxRaw from '../python_syntax_reference_elzero_20_74.md?raw';
import { parseLessons, parseSyntaxReference } from './lib/contentParser';
import { buildSearchIndex } from './lib/searchIndex';
import { loadStudyState, saveStudyState } from './lib/storage';
import { parseRoute, normalizePath } from './lib/routing';
import { StudyStateV1 } from './types/state';
import { AppShell } from './components/layout/AppShell';
import { StudyDashboard } from './views/StudyDashboard';
import { LessonView } from './views/LessonView';
import { SyntaxReferenceView } from './views/SyntaxReferenceView';
import { BookmarksView } from './views/BookmarksView';
import { NotesView } from './views/NotesView';

export function App() {
  // 1. Parse Markdown Content
  const { lessons } = useMemo(() => parseLessons(lessonsRaw), []);
  const syntaxSections = useMemo(() => parseSyntaxReference(syntaxRaw), []);
  const searchIndex = useMemo(() => buildSearchIndex(lessons, syntaxSections), [lessons, syntaxSections]);

  // 2. Persistent State
  const [state, setState] = useState<StudyStateV1>(() => loadStudyState());

  // Save on state change
  const updateState = useCallback((updater: (prev: StudyStateV1) => StudyStateV1) => {
    setState(prev => {
      const next = updater(prev);
      saveStudyState(next);
      return next;
    });
  }, []);

  // 3. Theme Management
  useEffect(() => {
    const applyTheme = () => {
      let activeTheme = state.theme;
      if (activeTheme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        activeTheme = prefersDark ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', activeTheme);
    };

    applyTheme();

    // Listen to OS theme changes if on system
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      if (state.theme === 'system') applyTheme();
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [state.theme]);

  // 4. Client-side Routing Strategy (Supports Hash and Pathname cleanly)
  const getInitialPath = () => {
    const hash = window.location.hash;
    if (hash) return normalizePath(hash);
    return normalizePath(window.location.pathname || '/');
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);

  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash;
      if (hash) {
        setCurrentPath(normalizePath(hash));
      } else {
        setCurrentPath(normalizePath(window.location.pathname || '/'));
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(normalizePath(path));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleThemeChange = (theme: 'dark' | 'light' | 'system') => {
    updateState(prev => ({ ...prev, theme }));
  };

  const route = parseRoute(currentPath);

  // Render View based on Route
  const renderView = () => {
    switch (route.view) {
      case 'lesson':
        return (
          <LessonView
            lessonId={route.lessonId}
            lessons={lessons}
            syntaxSections={syntaxSections}
            state={state}
            onUpdateState={updateState}
            onNavigate={navigate}
          />
        );
      case 'reference':
        return (
          <SyntaxReferenceView
            syntaxSections={syntaxSections}
            state={state}
            initialSectionId={route.sectionId}
            onUpdateState={updateState}
          />
        );
      case 'bookmarks':
        return (
          <BookmarksView
            lessons={lessons}
            syntaxSections={syntaxSections}
            state={state}
            onNavigate={navigate}
            onUpdateState={updateState}
          />
        );
      case 'notes':
        return (
          <NotesView
            lessons={lessons}
            state={state}
            onNavigate={navigate}
            onUpdateState={updateState}
          />
        );
      default:
        return (
          <StudyDashboard
            lessons={lessons}
            syntaxSections={syntaxSections}
            state={state}
            onNavigate={navigate}
          />
        );
    }
  };

  const activeLessonId = route.view === 'lesson' ? route.lessonId : null;

  return (
    <AppShell
      currentPath={currentPath}
      lessons={lessons}
      syntaxSections={syntaxSections}
      searchIndex={searchIndex}
      state={state}
      activeLessonId={activeLessonId}
      onNavigate={navigate}
      onUpdateState={updateState}
      onThemeChange={handleThemeChange}
    >
      {renderView()}
    </AppShell>
  );
}

export default App;
