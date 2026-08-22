import React, { useEffect, useState, useMemo } from 'react';
import { X, BookOpen, Code2, Bookmark, FileText, Check, Search, ChevronRight, ChevronDown } from 'lucide-react';
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
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  lessons,
  activeLessonId,
  state,
  currentPath,
  onNavigate
}) => {
  const [filterText, setFilterText] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Body scroll lock on open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleCategory = (catName: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  const navLinks = [
    { label: 'Study Home', path: '/', icon: BookOpen },
    { label: 'Syntax Reference', path: '/reference', icon: Code2 },
    { label: 'Bookmarks', path: '/bookmarks', icon: Bookmark, count: state.bookmarkedLessons.length + state.bookmarkedSyntax.length },
    { label: 'Personal Notes', path: '/notes', icon: FileText, count: Object.keys(state.lessonNotes).filter(k => state.lessonNotes[k].trim()).length }
  ];

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

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 200,
        display: 'flex'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(85vw, 340px)',
          height: '100%',
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-default)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          paddingBottom: 'calc(var(--space-6) + env(safe-area-inset-bottom, 0px))'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div
          style={{
            height: 'var(--header-height)',
            padding: '0 var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-raised)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--accent-primary)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '11px',
                fontFamily: 'var(--font-mono)'
              }}
            >
              PY
            </span>
            <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
              Python Navigation
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation drawer"
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Primary Page Navigation Links */}
        <div style={{ padding: 'var(--space-3) var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navLinks.map(link => {
              const active = currentPath === link.path || (link.path === '/' && currentPath === '/');
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => {
                    onNavigate(link.path);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '44px',
                    padding: '0 var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: active ? 'var(--accent-primary-muted)' : 'transparent',
                    color: active ? 'var(--accent-primary)' : 'var(--text-primary)',
                    fontWeight: active ? 600 : 500,
                    fontSize: 'var(--text-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <Icon size={16} />
                    <span>{link.label}</span>
                  </div>
                  {typeof link.count === 'number' && link.count > 0 && (
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--bg-surface-raised)',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {link.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lesson Filter */}
        <div style={{ padding: 'var(--space-3) var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: '8px 12px',
              backgroundColor: 'var(--bg-surface-raised)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <Search size={15} color="var(--text-muted)" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search 55 lessons..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>

        {/* Grouped Lessons Scroll Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-2) var(--space-2)' }}>
          {groupedLessons.map(cat => {
            const isCollapsed = !filterText && collapsedCategories[cat.name];
            const completedInCat = cat.lessons.filter(l => state.completedLessons.includes(l.id)).length;

            return (
              <div key={cat.name} style={{ marginBottom: 'var(--space-2)' }}>
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    minHeight: '40px',
                    padding: '0 var(--space-2)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                    <span>{cat.name}</span>
                  </div>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                    {completedInCat}/{cat.lessons.length}
                  </span>
                </button>

                {!isCollapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {cat.lessons.map(lesson => {
                      const isActive = activeLessonId === lesson.id;
                      const isCompleted = state.completedLessons.includes(lesson.id);
                      const isBookmarked = state.bookmarkedLessons.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => {
                            onNavigate(`/lesson/${lesson.id}`);
                            onClose();
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            minHeight: '44px',
                            padding: '0 var(--space-3)',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: isActive ? 'var(--accent-primary-muted)' : 'transparent',
                            color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
                            fontSize: 'var(--text-sm)',
                            textAlign: 'left',
                            fontWeight: isActive ? 600 : 400
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)'
                              }}
                            >
                              {lesson.id}
                            </span>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {lesson.title}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                            {isBookmarked && (
                              <Bookmark size={14} color="var(--accent-gold)" fill="var(--accent-gold)" />
                            )}
                            {isCompleted && (
                              <div
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: 'var(--radius-full)',
                                  backgroundColor: 'var(--accent-success-muted)',
                                  color: 'var(--accent-success)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Check size={12} strokeWidth={3} />
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
      </div>
    </div>
  );
};
