import { useState, useEffect, useMemo, useCallback } from 'react';
import lessonsRaw from '../elzero_python_lessons_20_to_74.md?raw';
import syntaxRaw from '../python_syntax_reference_elzero_20_74.md?raw';
import { parseLessons, parseSyntaxReference } from './lib/contentParser';
import { parseDetailedLessonSources } from './lib/detailedContent';
import { parsePracticeLessons } from './lib/practiceContent';
import { DETAILED_LESSON_SOURCES } from './content/detailed';
import { PRACTICE_LESSON_SOURCES } from './content/practice';
import { buildSearchIndex } from './lib/searchIndex';
import { loadStudyState, saveStudyState } from './lib/storage';
import { parseRoute, normalizePath } from './lib/routing';
import { applyThemePreference } from './lib/theme';
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
  const detailedLessons = useMemo(
    () => parseDetailedLessonSources(DETAILED_LESSON_SOURCES),
    []
  );
  const practiceLessons = useMemo(
    () => parsePracticeLessons(PRACTICE_LESSON_SOURCES),
    []
  );
  const searchIndex = useMemo(
    () => buildSearchIndex(lessons, syntaxSections, detailedLessons),
    [lessons, syntaxSections, detailedLessons]
  );

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
    const applyCurrentTheme = () => applyThemePreference(
      state.theme,
      document,
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );

    applyCurrentTheme();

    // Listen to OS theme changes if on system
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      if (state.theme === 'system') applyCurrentTheme();
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
  const [isLessonFullView, setIsLessonFullView] = useState(false);

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

  useEffect(() => {
    if (route.view !== 'lesson') {
      setIsLessonFullView(false);
    }
  }, [route.view]);

  // Render View based on Route
  const renderView = () => {
    switch (route.view) {
      case 'lesson':
        return (
          <LessonView
            lessonId={route.lessonId}
            lessons={lessons}
            detailedLessons={detailedLessons}
            practiceLessons={practiceLessons}
            syntaxSections={syntaxSections}
            state={state}
            onUpdateState={updateState}
            onNavigate={navigate}
            isFullView={isLessonFullView}
            onFullViewChange={setIsLessonFullView}
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
      isFullView={route.view === 'lesson' && isLessonFullView}
    >
      {renderView()}
    </AppShell>
  );
}

export default App;
