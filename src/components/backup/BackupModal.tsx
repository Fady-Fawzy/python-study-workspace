import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Download, FileText, ShieldCheck, Upload, X } from 'lucide-react';
import { StudyStateV1 } from '../../types/state';
import { exportBackup, importBackup } from '../../lib/storage';
import { useModalDialog } from '../shared/useModalDialog';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: StudyStateV1;
  onStateRestored: (newState: StudyStateV1) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose, state, onStateRestored }) => {
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const readerRef = useRef<FileReader | null>(null);
  const sessionRef = useRef(0);
  const dialogRef = useModalDialog({ isOpen, onClose, initialFocusRef: closeButtonRef });

  useEffect(() => {
    sessionRef.current += 1;
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (readerRef.current) {
      readerRef.current.abort();
      readerRef.current = null;
    }
    if (isOpen) setImportStatus(null);

    return () => {
      sessionRef.current += 1;
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      if (readerRef.current) {
        readerRef.current.abort();
        readerRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    readerRef.current?.abort();
    const reader = new FileReader();
    const session = sessionRef.current;
    readerRef.current = reader;
    reader.onload = (loadEvent) => {
      if (session !== sessionRef.current || readerRef.current !== reader) return;
      readerRef.current = null;
      const content = typeof loadEvent.target?.result === 'string' ? loadEvent.target.result : '';
      const result = importBackup(content);
      if (result.success && result.state) {
        setImportStatus({ success: true, message: 'Backup restored successfully!' });
        onStateRestored(result.state);
        closeTimerRef.current = window.setTimeout(() => {
          if (session !== sessionRef.current) return;
          closeTimerRef.current = null;
          onClose();
          setImportStatus(null);
        }, 1200);
      } else {
        setImportStatus({ success: false, message: result.error || 'Failed to parse backup file' });
      }
      input.value = '';
    };
    reader.onerror = () => {
      if (session !== sessionRef.current || readerRef.current !== reader) return;
      readerRef.current = null;
      setImportStatus({ success: false, message: 'Could not read the selected backup file.' });
      input.value = '';
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    try {
      exportBackup(state);
      setImportStatus({ success: true, message: 'Backup downloaded successfully.' });
    } catch {
      setImportStatus({ success: false, message: 'Could not download backup. Please try again.' });
    }
  };

  const notesCount = Object.values(state.lessonNotes).filter(note => note.trim()).length;

  return (
    <div
      className="backup-modal-backdrop"
      data-testid="backup-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="backup-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="backup-modal-title"
        aria-describedby="backup-modal-description"
      >
        <div className="backup-modal__header">
          <span className="backup-modal__title-icon" aria-hidden="true"><ShieldCheck size={20} /></span>
          <h2 id="backup-modal-title">Backup &amp; Restore Study Data</h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="ui-icon-button backup-modal__close"
            onClick={onClose}
            aria-label="Close backup & restore"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="backup-modal__content">
          <p id="backup-modal-description">
            Your notes, bookmarks, and completed lessons stay in this browser. Download a JSON backup so your study progress is easy to restore.
          </p>

          <dl className="backup-modal__summary" aria-label="Current study data">
            <div><dt>Completed</dt><dd>{state.completedLessons.length} / 55</dd></div>
            <div><dt>Bookmarks</dt><dd>{state.bookmarkedLessons.length + state.bookmarkedSyntax.length}</dd></div>
            <div><dt>Notes</dt><dd>{notesCount} lessons</dd></div>
            <div><dt>Version</dt><dd>v1.0</dd></div>
          </dl>

          <div className="backup-modal__actions">
            <button type="button" className="backup-modal__action backup-modal__action--primary" onClick={handleExport}>
              <Download size={18} aria-hidden="true" />
              <span>Download JSON Backup</span>
            </button>
            <button type="button" className="backup-modal__action" onClick={() => fileInputRef.current?.click()}>
              <Upload size={18} aria-hidden="true" />
              <span>Restore from Backup File</span>
            </button>
            <label className="visually-hidden" htmlFor="backup-file-input">Choose JSON backup file</label>
            <input
              ref={fileInputRef}
              id="backup-file-input"
              className="visually-hidden"
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              tabIndex={-1}
            />
          </div>

          {importStatus && (
            <div
              className="backup-modal__status"
              data-success={importStatus.success || undefined}
              role={importStatus.success ? 'status' : 'alert'}
              aria-live={importStatus.success ? 'polite' : 'assertive'}
            >
              {importStatus.success ? <FileText size={18} aria-hidden="true" /> : <AlertCircle size={18} aria-hidden="true" />}
              <span>{importStatus.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
