import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, FileEdit, RefreshCw } from 'lucide-react';

interface LessonNotesProps {
  lessonId: string;
  initialNote: string;
  onSaveNote: (lessonId: string, note: string) => void;
  initiallyOpen?: boolean;
}

type SaveStatus = 'idle' | 'saving' | 'saved';

export const LessonNotes: React.FC<LessonNotesProps> = ({
  lessonId,
  initialNote,
  onSaveNote,
  initiallyOpen = true
}) => {
  const [note, setNote] = useState(initialNote || '');
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const currentLessonRef = useRef(lessonId);
  const initialNoteRef = useRef(initialNote);
  const noteRef = useRef(initialNote || '');
  const dirtyRef = useRef(false);
  const saveTimerRef = useRef<number | null>(null);
  const statusTimerRef = useRef<number | null>(null);
  const saveVersionRef = useRef(0);
  const onSaveRef = useRef(onSaveNote);
  const observedInitialNoteRef = useRef({ lessonId, note: initialNote });

  initialNoteRef.current = initialNote;
  onSaveRef.current = onSaveNote;

  const clearSaveTimer = () => {
    saveVersionRef.current += 1;
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
  };

  const clearStatusTimer = () => {
    if (statusTimerRef.current !== null) {
      window.clearTimeout(statusTimerRef.current);
      statusTimerRef.current = null;
    }
  };

  const showSavedStatus = () => {
    clearStatusTimer();
    setStatus('saved');
    statusTimerRef.current = window.setTimeout(() => {
      setStatus('idle');
      statusTimerRef.current = null;
    }, 1600);
  };

  const flushPendingNote = () => {
    clearSaveTimer();
    if (!dirtyRef.current) return false;
    dirtyRef.current = false;
    onSaveRef.current(currentLessonRef.current, noteRef.current);
    return true;
  };

  useEffect(() => {
    currentLessonRef.current = lessonId;
    const nextNote = initialNoteRef.current || '';
    noteRef.current = nextNote;
    dirtyRef.current = false;
    setNote(nextNote);
    setStatus('idle');

    return () => {
      if (statusTimerRef.current !== null) {
        window.clearTimeout(statusTimerRef.current);
        statusTimerRef.current = null;
      }
      saveVersionRef.current += 1;
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      if (dirtyRef.current) {
        const pendingNote = noteRef.current;
        dirtyRef.current = false;
        onSaveRef.current(currentLessonRef.current, pendingNote);
      }
    };
    // The lesson identity intentionally owns the editing lifecycle. Changes to
    // initialNote caused by this component's own save must not reset the draft.
  }, [lessonId]);

  useEffect(() => {
    const previous = observedInitialNoteRef.current;
    observedInitialNoteRef.current = { lessonId, note: initialNote };

    if (previous.lessonId !== lessonId || previous.note === initialNote) return;

    // A same-lesson prop replacement comes from an external state operation
    // such as Backup Restore. It is authoritative and must cancel, not flush,
    // an older local draft. A reflected value from our own save already equals
    // noteRef and can keep the current Saved feedback intact.
    if (initialNote === noteRef.current && !dirtyRef.current) return;

    if (statusTimerRef.current !== null) {
      window.clearTimeout(statusTimerRef.current);
      statusTimerRef.current = null;
    }
    saveVersionRef.current += 1;
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    const restoredNote = initialNote || '';
    dirtyRef.current = false;
    noteRef.current = restoredNote;
    setNote(restoredNote);
    setStatus('idle');
  }, [initialNote, lessonId]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextNote = event.target.value;
    setNote(nextNote);
    noteRef.current = nextNote;
    dirtyRef.current = true;
    setStatus('saving');
    clearStatusTimer();
    clearSaveTimer();

    const saveVersion = saveVersionRef.current;
    const scheduledLessonId = currentLessonRef.current;
    saveTimerRef.current = window.setTimeout(() => {
      saveTimerRef.current = null;
      if (
        saveVersion !== saveVersionRef.current
        || scheduledLessonId !== currentLessonRef.current
        || !dirtyRef.current
      ) return;

      const pendingNote = noteRef.current;
      dirtyRef.current = false;
      onSaveRef.current(scheduledLessonId, pendingNote);
      showSavedStatus();
    }, 600);
  };

  const handleBlur = () => {
    if (flushPendingNote()) showSavedStatus();
  };

  const statusText = status === 'saving'
    ? 'Saving…'
    : status === 'saved'
      ? 'Saved'
      : 'Changes save automatically';

  return (
    <section
      className="lesson-notes lesson-notes-panel"
      aria-labelledby={`lesson-${lessonId}-notes-title`}
      data-open={isOpen || undefined}
    >
      <div className="lesson-notes__header">
        <button
          type="button"
          className="lesson-notes__toggle"
          aria-expanded={isOpen}
          aria-controls={`lesson-${lessonId}-notes-panel`}
          aria-label={isOpen ? 'Close lesson notes' : 'Open lesson notes'}
          onClick={() => setIsOpen((open) => !open)}
        >
          <FileEdit size={18} aria-hidden="true" />
          <span id={`lesson-${lessonId}-notes-title`}>Personal Study Notes</span>
          <ChevronDown className="lesson-notes__chevron" size={16} aria-hidden="true" />
        </button>

        <div
          className="lesson-notes__status"
          data-status={status}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {status === 'saving' && <RefreshCw size={14} className="spin-icon" aria-hidden="true" />}
          {status === 'saved' && <Check size={14} aria-hidden="true" />}
          <span>{statusText}</span>
        </div>
      </div>

      {isOpen && (
        <div id={`lesson-${lessonId}-notes-panel`} className="lesson-notes__body">
          <textarea
            id={`lesson-${lessonId}-notes`}
            className="lesson-notes__textarea"
            value={note}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Write key takeaways, mental models, code snippets, or gotchas for this lesson…"
            dir="auto"
            aria-label="Personal Study Notes"
            aria-describedby={`lesson-${lessonId}-notes-help`}
          />
          <div id={`lesson-${lessonId}-notes-help`} className="lesson-notes__footer">
            <span>Autosaved on this device</span>
            <span>{note.length} characters</span>
          </div>
        </div>
      )}
    </section>
  );
};
