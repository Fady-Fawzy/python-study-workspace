import React, { useState } from 'react';
import { FileText, Search, ArrowRight, Trash2 } from 'lucide-react';
import { Lesson } from '../types/content';
import { StudyStateV1 } from '../types/state';
import { EmptyState } from '../components/shared/EmptyState';

interface NotesViewProps {
  lessons: Lesson[];
  state: StudyStateV1;
  onNavigate: (path: string) => void;
  onUpdateState: (updater: (prev: StudyStateV1) => StudyStateV1) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  lessons,
  state,
  onNavigate,
  onUpdateState
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all lessons with non-empty notes
  const lessonsWithNotes: { lessonId: string; lessonTitle: string; lessonCategory: string; note: string }[] = Object.entries(state.lessonNotes)
    .filter(([_, note]) => typeof note === 'string' && note.trim().length > 0)
    .map(([lessonId, note]) => {
      const lesson = lessons.find(l => l.id === lessonId);
      return {
        lessonId,
        lessonTitle: lesson ? lesson.title : `Lesson ${lessonId}`,
        lessonCategory: lesson ? lesson.category : 'Python',
        note: note as string
      };
    });

  const filteredNotes = lessonsWithNotes.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.lessonId.includes(q) ||
      item.lessonTitle.toLowerCase().includes(q) ||
      item.note.toLowerCase().includes(q)
    );
  });

  const handleDeleteNote = (lessonId: string) => {
    if (window.confirm(`Delete note for Lesson ${lessonId}?`)) {
      onUpdateState(prev => {
        const copy = { ...prev.lessonNotes };
        delete copy[lessonId];
        return { ...prev, lessonNotes: copy };
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
          <FileText size={20} color="var(--accent-primary)" />
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
            Personal Study Notes
          </h1>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          All personal takeaways, gotchas, and notes written across lessons ({lessonsWithNotes.length} lessons with notes).
        </p>
      </div>

      {/* Search notes */}
      {lessonsWithNotes.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '8px 12px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)'
          }}
        >
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within your study notes..."
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
      )}

      {/* Notes List */}
      {lessonsWithNotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No personal notes yet"
          description="While studying any lesson, write personal takeaways, gotchas, or reminders in the notes box to see them organized here."
          actionText="Start Studying"
          onAction={() => onNavigate('/')}
        />
      ) : filteredNotes.length === 0 ? (
        <div style={{ padding: 'var(--space-8) 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          No notes match &ldquo;{searchQuery}&rdquo;.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {filteredNotes.map(item => (
            <div
              key={item.lessonId}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)',
                padding: 'var(--space-5)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-3)',
                  paddingBottom: 'var(--space-2)',
                  borderBottom: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: 'var(--space-2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: 'var(--accent-primary)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--accent-primary-muted)'
                    }}
                  >
                    Lesson {item.lessonId}
                  </span>
                  <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.lessonTitle}
                  </h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <button
                    type="button"
                    onClick={() => handleDeleteNote(item.lessonId)}
                    title="Delete note"
                    style={{ color: 'var(--text-muted)', padding: '4px' }}
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate(`/lesson/${item.lessonId}`)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-surface-raised)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 500,
                      color: 'var(--text-primary)'
                    }}
                  >
                    <span>Open Lesson</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* Note Content */}
              <div
                dir="auto"
                className="arabic-text"
                style={{
                  fontSize: 'var(--text-sm)',
                  lineHeight: 'var(--leading-arabic)',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'pre-wrap',
                  backgroundColor: 'var(--bg-surface-raised)',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {item.note}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
