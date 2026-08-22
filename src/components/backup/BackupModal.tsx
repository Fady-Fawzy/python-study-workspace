import React, { useState, useRef } from 'react';
import { Download, Upload, X, ShieldCheck, AlertCircle, FileText } from 'lucide-react';
import { StudyStateV1 } from '../../types/state';
import { exportBackup, importBackup } from '../../lib/storage';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: StudyStateV1;
  onStateRestored: (newState: StudyStateV1) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  state,
  onStateRestored
}) => {
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportBackup(state);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importBackup(content);
      if (res.success && res.state) {
        setImportStatus({ success: true, message: 'Backup restored successfully!' });
        onStateRestored(res.state);
        setTimeout(() => {
          onClose();
          setImportStatus(null);
        }, 1200);
      } else {
        setImportStatus({ success: false, message: res.error || 'Failed to parse backup file' });
      }
    };
    reader.readAsText(file);
  };

  const notesCount = Object.keys(state.lessonNotes).filter(k => state.lessonNotes[k].trim()).length;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 'var(--space-4)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-4) var(--space-5)',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-raised)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <ShieldCheck size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>
              Backup & Restore Study Data
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              color: 'var(--text-muted)',
              display: 'flex',
              padding: '4px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 'var(--space-5)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
            Your notes, bookmarks, and completed lessons are stored securely in your browser. Export a JSON backup to protect against browser cache clears.
          </p>

          {/* Current State Summary */}
          <div
            style={{
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-5)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-2)'
            }}
          >
            <div>✓ Completed: <strong>{state.completedLessons.length} / 55</strong></div>
            <div>🔖 Bookmarks: <strong>{state.bookmarkedLessons.length + state.bookmarkedSyntax.length}</strong></div>
            <div>📝 Notes: <strong>{notesCount} lessons</strong></div>
            <div>⏱ Version: <strong>v1.0</strong></div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <button
              type="button"
              onClick={handleExport}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'var(--accent-primary)',
                color: '#ffffff',
                borderRadius: 'var(--radius-md)',
                fontWeight: 500,
                fontSize: 'var(--text-sm)',
                transition: 'opacity var(--transition-fast)'
              }}
            >
              <Download size={16} />
              <span>Download JSON Backup</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'var(--bg-surface-raised)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 500,
                fontSize: 'var(--text-sm)',
                transition: 'background var(--transition-fast)'
              }}
            >
              <Upload size={16} />
              <span>Restore from Backup File</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          {/* Status feedback */}
          {importStatus && (
            <div
              style={{
                marginTop: 'var(--space-4)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                backgroundColor: importStatus.success ? 'var(--accent-success-muted)' : 'var(--accent-danger-muted)',
                color: importStatus.success ? 'var(--accent-success)' : 'var(--accent-danger)',
                border: `1px solid ${importStatus.success ? 'var(--accent-success)' : 'var(--accent-danger)'}`
              }}
            >
              {importStatus.success ? <FileText size={14} /> : <AlertCircle size={14} />}
              <span>{importStatus.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
