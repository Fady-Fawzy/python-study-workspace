import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  X, BookOpen, Code2, Bookmark, FileText, Check, Search,
  ChevronRight, ChevronDown, Shield
} from 'lucide-react';
import { Lesson } from '../../types/content';
import { LESSON_CATEGORIES } from '../../lib/lessonMapping';
import { StudyStateV1 } from '../../types/state';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: Lesson[];
  activeLessonId: string | null;
  state: StudyStateV1;
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenBackup: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const focusableSelector = [
  'button:not([disabled])',
  'input:not([disabled])',
  'a[href]',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

const isNavActive = (currentPath: string, path: string) => {
  if (path === '/') return currentPath === '/' || currentPath.startsWith('/lesson');
  return currentPath.startsWith(path);
};

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  lessons,
  activeLessonId,
  state,
  currentPath,
  onNavigate,
  onOpenBackup,
  triggerRef
}) => {
  const [filterText, setFilterText] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeLessonRowRef = useRef<HTMLButtonElement>(null);
  const activeLesson = lessons.find(lesson => lesson.id === activeLessonId);
  const activeCategoryName = activeLesson
    ? LESSON_CATEGORIES.find(category => (
      activeLesson.number >= category.range[0] && activeLesson.number <= category.range[1]
    ))?.name
    : undefined;
  const isActiveCategoryCollapsed = activeCategoryName
    ? Boolean(collapsedCategories[activeCategoryName])
    : false;

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const returnTarget = (document.activeElement as HTMLElement | null) ?? triggerRef.current;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      returnTarget?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  useEffect(() => {
    if (!isOpen || !activeCategoryName) return;
    setCollapsedCategories(previous => previous[activeCategoryName]
      ? { ...previous, [activeCategoryName]: false }
      : previous);
  }, [isOpen, activeLessonId, activeCategoryName]);

  useEffect(() => {
    const activeRow = activeLessonRowRef.current;
    if (isOpen && typeof activeRow?.scrollIntoView === 'function') {
      activeRow.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, activeLessonId, isActiveCategoryCollapsed]);

  const navLinks = [
    { label: 'Study Home', path: '/', icon: BookOpen },
    { label: 'Syntax Reference', path: '/reference', icon: Code2 },
    { label: 'Bookmarks', path: '/bookmarks', icon: Bookmark, count: state.bookmarkedLessons.length + state.bookmarkedSyntax.length },
    { label: 'Personal Notes', path: '/notes', icon: FileText, count: Object.values(state.lessonNotes).filter(note => note.trim()).length }
  ];

  const groupedLessons = useMemo(() => {
    const query = filterText.trim().toLowerCase();
    return LESSON_CATEGORIES.map(category => ({
      ...category,
      lessons: lessons.filter(lesson => {
        const inRange = lesson.number >= category.range[0] && lesson.number <= category.range[1];
        if (!inRange || !query) return inRange;
        return lesson.id.includes(query)
          || lesson.number.toString().includes(query)
          || lesson.title.toLowerCase().includes(query)
          || lesson.methods.some(method => method.toLowerCase().includes(query));
      })
    })).filter(category => category.lessons.length > 0);
  }, [lessons, filterText]);

  if (!isOpen) return null;

  return (
    <div
      className="mobile-drawer-backdrop"
      data-testid="mobile-drawer-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        id="mobile-navigation-drawer"
        className="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-navigation-title"
      >
        <div className="mobile-drawer__header">
          <div className="mobile-drawer__title-wrap">
            <span className="app-brand__mark" aria-hidden="true">PY</span>
            <h2 id="mobile-navigation-title" className="mobile-drawer__title">Python Navigation</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="ui-icon-button mobile-drawer__close"
            onClick={onClose}
            aria-label="Close navigation drawer"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mobile-drawer__primary" aria-label="Mobile primary navigation">
          {navLinks.map(link => {
            const active = isNavActive(currentPath, link.path);
            const Icon = link.icon;
            return (
              <button
                key={link.path}
                type="button"
                className="mobile-drawer__nav-row"
                data-active={active || undefined}
                aria-current={active ? 'page' : undefined}
                onClick={() => {
                  onNavigate(link.path);
                  onClose();
                }}
              >
                <span className="mobile-drawer__row-label">
                  <Icon size={18} aria-hidden="true" />
                  <span>{link.label}</span>
                </span>
                {typeof link.count === 'number' && link.count > 0 && (
                  <span className="navigation-count">{link.count}</span>
                )}
              </button>
            );
          })}
          <button type="button" className="mobile-drawer__nav-row" onClick={onOpenBackup}>
            <span className="mobile-drawer__row-label">
              <Shield size={18} aria-hidden="true" />
              <span>Backup &amp; Restore</span>
            </span>
          </button>
        </nav>

        <div className="mobile-drawer__filter">
          <Search size={17} aria-hidden="true" />
          <label className="visually-hidden" htmlFor="mobile-lesson-filter">Search lessons</label>
          <input
            id="mobile-lesson-filter"
            type="search"
            value={filterText}
            onChange={(event) => setFilterText(event.target.value)}
            placeholder="Search 55 lessons…"
          />
        </div>

        <div className="mobile-drawer__lessons" aria-label="Lessons">
          {filterText.trim() && groupedLessons.length === 0 && (
            <p className="lesson-nav-empty" role="status">
              No lessons match <bdi>&ldquo;{filterText.trim()}&rdquo;</bdi>.
            </p>
          )}
          {groupedLessons.map(category => {
            const isCollapsed = !filterText && collapsedCategories[category.name];
            const completedCount = category.lessons.filter(lesson => state.completedLessons.includes(lesson.id)).length;
            const regionId = `mobile-category-${category.range[0]}`;

            return (
              <section className="lesson-nav-group" key={category.name}>
                <button
                  type="button"
                  className="lesson-nav-category"
                  onClick={() => setCollapsedCategories(previous => ({
                    ...previous,
                    [category.name]: !previous[category.name]
                  }))}
                  aria-expanded={!isCollapsed}
                  aria-controls={regionId}
                >
                  <span className="lesson-nav-category__label">
                    {isCollapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
                    <span>{category.name}</span>
                  </span>
                  <span className="lesson-nav-category__progress">{completedCount}/{category.lessons.length}</span>
                </button>

                {!isCollapsed && (
                  <div id={regionId} className="lesson-nav-list">
                    {category.lessons.map(lesson => {
                      const active = activeLessonId === lesson.id;
                      const completed = state.completedLessons.includes(lesson.id);
                      const bookmarked = state.bookmarkedLessons.includes(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          ref={active ? activeLessonRowRef : undefined}
                          type="button"
                          className="lesson-nav-row lesson-nav-row--mobile"
                          data-active={active || undefined}
                          aria-current={active ? 'page' : undefined}
                          aria-label={`Lesson ${lesson.id}: ${lesson.title}${completed ? ', completed' : ''}${bookmarked ? ', bookmarked' : ''}`}
                          onClick={() => {
                            onNavigate(`/lesson/${lesson.id}`);
                            onClose();
                          }}
                        >
                          <span className="lesson-nav-row__content">
                            <span className="lesson-nav-row__number">{lesson.id}</span>
                            <span className="lesson-nav-row__title">{lesson.title}</span>
                          </span>
                          <span className="lesson-nav-row__status" aria-hidden="true">
                            {bookmarked && <Bookmark size={14} className="lesson-nav-bookmark" fill="currentColor" />}
                            {completed && <span className="lesson-nav-complete"><Check size={12} strokeWidth={3} /></span>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
