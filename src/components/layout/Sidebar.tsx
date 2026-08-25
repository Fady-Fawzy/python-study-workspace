import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Bookmark, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { Lesson } from '../../types/content';
import { LESSON_CATEGORIES } from '../../lib/lessonMapping';

interface SidebarProps {
  lessons: Lesson[];
  activeLessonId: string | null;
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  onSelectLesson: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  lessons,
  activeLessonId,
  completedLessonIds,
  bookmarkedLessonIds,
  onSelectLesson
}) => {
  const [filterText, setFilterText] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
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
    if (!activeCategoryName) return;
    setCollapsedCategories(previous => previous[activeCategoryName]
      ? { ...previous, [activeCategoryName]: false }
      : previous);
  }, [activeCategoryName, activeLessonId]);

  useEffect(() => {
    const activeRow = activeLessonRowRef.current;
    if (typeof activeRow?.scrollIntoView === 'function') {
      activeRow.scrollIntoView({ block: 'nearest' });
    }
  }, [activeLessonId, isActiveCategoryCollapsed]);

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

  return (
    <aside className="app-sidebar-container" aria-label="Lesson navigation">
      <div className="sidebar-filter">
        <Search size={15} aria-hidden="true" />
        <label className="visually-hidden" htmlFor="sidebar-lesson-filter">Filter lessons</label>
        <input
          id="sidebar-lesson-filter"
          type="search"
          value={filterText}
          onChange={(event) => setFilterText(event.target.value)}
          placeholder="Filter lessons…"
        />
      </div>

      <div className="sidebar-lessons">
        {filterText.trim() && groupedLessons.length === 0 && (
          <p className="lesson-nav-empty" role="status">
            No lessons match <bdi>&ldquo;{filterText.trim()}&rdquo;</bdi>.
          </p>
        )}
        {groupedLessons.map(category => {
          const isCollapsed = !filterText && collapsedCategories[category.name];
          const completedCount = category.lessons.filter(lesson => completedLessonIds.includes(lesson.id)).length;
          const regionId = `sidebar-category-${category.range[0]}`;

          return (
            <section className="lesson-nav-group" key={category.name}>
              <button
                type="button"
                className="lesson-nav-category lesson-nav-category--desktop"
                onClick={() => setCollapsedCategories(previous => ({
                  ...previous,
                  [category.name]: !previous[category.name]
                }))}
                aria-expanded={!isCollapsed}
                aria-controls={regionId}
              >
                <span className="lesson-nav-category__label">
                  {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                  <span>{category.name}</span>
                </span>
                <span
                  className="lesson-nav-category__progress"
                  data-complete={completedCount === category.lessons.length || undefined}
                >
                  {completedCount}/{category.lessons.length}
                </span>
              </button>

              {!isCollapsed && (
                <div id={regionId} className="lesson-nav-list">
                  {category.lessons.map(lesson => {
                    const active = activeLessonId === lesson.id;
                    const completed = completedLessonIds.includes(lesson.id);
                    const bookmarked = bookmarkedLessonIds.includes(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        ref={active ? activeLessonRowRef : undefined}
                        type="button"
                        className="lesson-nav-row"
                        data-active={active || undefined}
                        aria-current={active ? 'page' : undefined}
                        aria-label={`Lesson ${lesson.id}: ${lesson.title}${completed ? ', completed' : ''}${bookmarked ? ', bookmarked' : ''}`}
                        onClick={() => onSelectLesson(lesson.id)}
                      >
                        <span className="lesson-nav-row__content">
                          <span className="lesson-nav-row__number">{lesson.id}</span>
                          <span className="lesson-nav-row__title">{lesson.title}</span>
                        </span>
                        <span className="lesson-nav-row__status" aria-hidden="true">
                          {bookmarked && <Bookmark size={13} className="lesson-nav-bookmark" fill="currentColor" />}
                          {completed && <span className="lesson-nav-complete"><Check size={11} strokeWidth={3} /></span>}
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
    </aside>
  );
};
