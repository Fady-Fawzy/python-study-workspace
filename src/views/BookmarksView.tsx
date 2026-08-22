import React, { useState } from 'react';
import { Bookmark, BookOpen, Code2, ArrowRight, Trash2 } from 'lucide-react';
import { Lesson, SyntaxSection } from '../types/content';
import { StudyStateV1 } from '../types/state';
import { EmptyState } from '../components/shared/EmptyState';

interface BookmarksViewProps {
  lessons: Lesson[];
  syntaxSections: SyntaxSection[];
  state: StudyStateV1;
  onNavigate: (path: string) => void;
  onUpdateState: (updater: (prev: StudyStateV1) => StudyStateV1) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  lessons,
  syntaxSections,
  state,
  onNavigate,
  onUpdateState
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'lessons' | 'syntax'>('all');

  const bookmarkedLessons = state.bookmarkedLessons
    .map((id: string) => lessons.find(l => l.id === id))
    .filter((l): l is Lesson => Boolean(l));

  const bookmarkedSyntax = state.bookmarkedSyntax
    .map((secId: number) => syntaxSections.find(s => s.id === secId))
    .filter((s): s is SyntaxSection => Boolean(s));

  const handleRemoveLessonBookmark = (id: string) => {
    onUpdateState(prev => ({
      ...prev,
      bookmarkedLessons: prev.bookmarkedLessons.filter((lId: string) => lId !== id)
    }));
  };

  const handleRemoveSyntaxBookmark = (secId: number) => {
    onUpdateState(prev => ({
      ...prev,
      bookmarkedSyntax: prev.bookmarkedSyntax.filter((sId: number) => sId !== secId)
    }));
  };

  const totalBookmarks = bookmarkedLessons.length + bookmarkedSyntax.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
          <Bookmark size={20} color="var(--accent-gold)" fill="var(--accent-gold)" />
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
            Saved Bookmarks
          </h1>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          Quick access to saved lessons and syntax cheat sheet sections.
        </p>
      </div>

      {/* Filter Tabs */}
      {totalBookmarks > 0 && (
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-xs)',
              fontWeight: activeTab === 'all' ? 600 : 500,
              backgroundColor: activeTab === 'all' ? 'var(--accent-primary-muted)' : 'var(--bg-surface)',
              color: activeTab === 'all' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              border: `1px solid ${activeTab === 'all' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`
            }}
          >
            All ({totalBookmarks})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lessons')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-xs)',
              fontWeight: activeTab === 'lessons' ? 600 : 500,
              backgroundColor: activeTab === 'lessons' ? 'var(--accent-primary-muted)' : 'var(--bg-surface)',
              color: activeTab === 'lessons' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              border: `1px solid ${activeTab === 'lessons' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`
            }}
          >
            Lessons ({bookmarkedLessons.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('syntax')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-xs)',
              fontWeight: activeTab === 'syntax' ? 600 : 500,
              backgroundColor: activeTab === 'syntax' ? 'var(--accent-primary-muted)' : 'var(--bg-surface)',
              color: activeTab === 'syntax' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              border: `1px solid ${activeTab === 'syntax' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`
            }}
          >
            Syntax Sections ({bookmarkedSyntax.length})
          </button>
        </div>
      )}

      {totalBookmarks === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarks yet"
          description="Bookmark any lesson or syntax reference section during your studies to quickly revisit them here."
          actionText="Browse Lessons"
          onAction={() => onNavigate('/')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Lessons Section */}
          {(activeTab === 'all' || activeTab === 'lessons') && bookmarkedLessons.length > 0 && (
            <div>
              <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>
                Bookmarked Lessons ({bookmarkedLessons.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {bookmarkedLessons.map((lesson: Lesson) => (
                  <div
                    key={lesson.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-3) var(--space-4)',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-default)'
                    }}
                  >
                    <div
                      onClick={() => onNavigate(`/lesson/${lesson.id}`)}
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer', flex: 1, minWidth: 0 }}
                    >
                      <BookOpen size={16} color="var(--accent-primary)" />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                          Lesson {lesson.id} — {lesson.title}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                          {lesson.category}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveLessonBookmark(lesson.id)}
                        title="Remove bookmark"
                        style={{ color: 'var(--text-muted)', padding: '6px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate(`/lesson/${lesson.id}`)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--bg-surface-raised)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 500,
                          color: 'var(--text-primary)'
                        }}
                      >
                        <span>Open</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Syntax Section */}
          {(activeTab === 'all' || activeTab === 'syntax') && bookmarkedSyntax.length > 0 && (
            <div>
              <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>
                Bookmarked Syntax Sections ({bookmarkedSyntax.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {bookmarkedSyntax.map((sec: SyntaxSection) => (
                  <div
                    key={sec.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-3) var(--space-4)',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-default)'
                    }}
                  >
                    <div
                      onClick={() => onNavigate(`/reference?section=${sec.id}`)}
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer', flex: 1, minWidth: 0 }}
                    >
                      <Code2 size={16} color="var(--accent-gold)" />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                          #{sec.id}) {sec.title}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                          {sec.category}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveSyntaxBookmark(sec.id)}
                        title="Remove bookmark"
                        style={{ color: 'var(--text-muted)', padding: '6px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate(`/reference?section=${sec.id}`)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--bg-surface-raised)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 500,
                          color: 'var(--text-primary)'
                        }}
                      >
                        <span>View</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
