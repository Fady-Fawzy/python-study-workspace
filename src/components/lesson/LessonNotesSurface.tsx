import React, { RefObject, useEffect, useRef, useState } from 'react';
import { FileEdit, X } from 'lucide-react';
import { CLOSE_TRANSIENT_OVERLAYS_EVENT } from '../../lib/overlayEvents';
import { LessonNotesEditor } from './LessonNotes';

interface LessonNotesSurfaceProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  initialNote: string;
  onSaveNote: (lessonId: string, note: string) => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

const focusableSelector = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

function desktopQueryMatches(): boolean {
  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(min-width: 1180px)').matches;
  }
  return window.innerWidth >= 1180;
}

function useWideDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(desktopQueryMatches);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(min-width: 1180px)');
    const update = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    setIsDesktop(query.matches);
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  return isDesktop;
}

export const LessonNotesSurface: React.FC<LessonNotesSurfaceProps> = ({
  isOpen,
  onClose,
  lessonId,
  initialNote,
  onSaveNote,
  returnFocusRef
}) => {
  const isDesktop = useWideDesktop();
  const surfaceRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const closeForOverlay = () => onClose();
    window.addEventListener(CLOSE_TRANSIENT_OVERLAYS_EVENT, closeForOverlay);
    return () => window.removeEventListener(CLOSE_TRANSIENT_OVERLAYS_EVENT, closeForOverlay);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || isDesktop) return;

    const originalOverflow = document.body.style.overflow;
    const returnTarget = returnFocusRef?.current;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !surfaceRef.current) return;

      const focusable = Array.from(
        surfaceRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      );
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
      returnTarget?.focus({ preventScroll: true });
    };
  }, [isDesktop, isOpen, onClose, returnFocusRef]);

  if (!isOpen) return null;

  return (
    <div
      className="lesson-notes-backdrop"
      data-desktop={isDesktop || undefined}
      data-testid="lesson-notes-backdrop"
      onMouseDown={event => {
        if (!isDesktop && event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        ref={surfaceRef}
        className="lesson-notes-surface"
        role={isDesktop ? 'complementary' : 'dialog'}
        aria-modal={isDesktop ? undefined : 'true'}
        aria-label="Personal Study Notes"
      >
        <header className="lesson-notes-surface__header">
          <div>
            <span className="lesson-notes-surface__eyebrow">Study workspace</span>
            <h2><FileEdit size={18} aria-hidden="true" /> Personal Study Notes</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="ui-icon-button"
            aria-label="Close personal study notes"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        <div className="lesson-notes-surface__body">
          <LessonNotesEditor
            lessonId={lessonId}
            initialNote={initialNote}
            onSaveNote={onSaveNote}
          />
        </div>
      </aside>
    </div>
  );
};
