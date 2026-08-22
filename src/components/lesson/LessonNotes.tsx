import React, { useState, useEffect, useRef } from 'react';
import { FileEdit, Check, RefreshCw } from 'lucide-react';

interface LessonNotesProps {
  lessonId: string;
  initialNote: string;
  onSaveNote: (lessonId: string, note: string) => void;
}

export const LessonNotes: React.FC<LessonNotesProps> = ({
  lessonId,
  initialNote,
  onSaveNote
}) => {
  const [note, setNote] = useState(initialNote || '');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [prevLessonId, setPrevLessonId] = useState(lessonId);
  const timerRef = useRef<number | null>(null);

  if (prevLessonId !== lessonId) {
    setPrevLessonId(lessonId);
    setNote(initialNote || '');
    setStatus('idle');
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNote(val);
    setStatus('saving');

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      onSaveNote(lessonId, val);
      setStatus('saved');
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    }, 600);
  };

  const handleBlur = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    onSaveNote(lessonId, note);
    setStatus('saved');
    setTimeout(() => {
      setStatus('idle');
    }, 1500);
  };

  return (
    <div
      style={{
        marginTop: 'var(--space-8)',
        padding: 'var(--space-5)',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <FileEdit size={16} color="var(--accent-primary)" />
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
            Personal Study Notes
          </span>
        </div>

        {/* Subtle Saving Indicator */}
        <div style={{ fontSize: 'var(--text-xs)', minHeight: '20px', display: 'flex', alignItems: 'center' }}>
          {status === 'saving' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
              <RefreshCw size={12} className="spin-icon" />
              <span>Saving...</span>
            </span>
          )}
          {status === 'saved' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--accent-success)' }}>
              <Check size={12} strokeWidth={2.5} />
              <span>Saved ✓</span>
            </span>
          )}
        </div>
      </div>

      <textarea
        value={note}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Write key takeaways, mental models, code snippets, or gotchas for this lesson... (Autosaved)"
        dir="auto"
        style={{
          width: '100%',
          minHeight: '120px',
          padding: 'var(--space-3)',
          backgroundColor: 'var(--bg-surface-raised)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--leading-relaxed)',
          resize: 'vertical',
          outline: 'none',
          fontFamily: 'var(--font-sans)',
          transition: 'border-color var(--transition-fast)'
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 'var(--space-1)',
          fontSize: '11px',
          color: 'var(--text-muted)'
        }}
      >
        <span>{note.length} characters</span>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-icon {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};
