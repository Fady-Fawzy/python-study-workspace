import React, { useState, useMemo } from 'react';
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

  const toggleCategory = (catName: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  // Group lessons by topic category
  const groupedLessons = useMemo(() => {
    const query = filterText.trim().toLowerCase();

    return LESSON_CATEGORIES.map(cat => {
      const catLessons = lessons.filter(l => {
        const inRange = l.number >= cat.range[0] && l.number <= cat.range[1];
        if (!inRange) return false;
        if (!query) return true;

        return (
          l.id.includes(query) ||
          l.number.toString().includes(query) ||
          l.title.toLowerCase().includes(query) ||
          l.methods.some(m => m.toLowerCase().includes(query))
        );
      });

      return {
        ...cat,
        lessons: catLessons
      };
    }).filter(cat => cat.lessons.length > 0);
  }, [lessons, filterText]);

  return (
    <aside className="app-sidebar-container">
      {/* Sidebar Header & Filter */}
      <div
        style={{
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '6px 10px',
            backgroundColor: 'var(--bg-surface-raised)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter lessons..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-primary)'
            }}
          />
        </div>
      </div>

      {/* Lesson List Container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--space-2) var(--space-2) var(--space-8)'
        }}
      >
        {groupedLessons.map(cat => {
          const isCollapsed = !filterText && collapsedCategories[cat.name];
          const completedInCat = cat.lessons.filter(l => completedLessonIds.includes(l.id)).length;

          return (
            <div key={cat.name} style={{ marginBottom: 'var(--space-2)' }}>
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--text-muted)',
                  textAlign: 'left',
                  transition: 'background var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', minWidth: 0 }}>
                  {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cat.name}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: completedInCat === cat.lessons.length ? 'var(--accent-success)' : 'var(--text-muted)',
                    marginLeft: '4px',
                    flexShrink: 0
                  }}
                >
                  {completedInCat}/{cat.lessons.length}
                </span>
              </button>

              {/* Category Lessons */}
              {!isCollapsed && (
                <div style={{ marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  {cat.lessons.map(lesson => {
                    const isActive = activeLessonId === lesson.id;
                    const isCompleted = completedLessonIds.includes(lesson.id);
                    const isBookmarked = bookmarkedLessonIds.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => onSelectLesson(lesson.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '6px 8px 6px 12px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-xs)',
                          textAlign: 'left',
                          backgroundColor: isActive ? 'var(--accent-primary-muted)' : 'transparent',
                          color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                          fontWeight: isActive ? 600 : 400,
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                              flexShrink: 0
                            }}
                          >
                            {lesson.id}
                          </span>
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {lesson.title}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginLeft: '6px' }}>
                          {isBookmarked && (
                            <Bookmark size={12} color="var(--accent-gold)" fill="var(--accent-gold)" />
                          )}
                          {isCompleted && (
                            <div
                              style={{
                                width: '14px',
                                height: '14px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: 'var(--accent-success-muted)',
                                color: 'var(--accent-success)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Check size={10} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
