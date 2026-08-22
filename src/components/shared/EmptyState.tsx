import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-12) var(--space-6)',
        textAlign: 'center',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-default)',
        margin: 'var(--space-6) 0'
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--bg-surface-raised)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          marginBottom: 'var(--space-4)'
        }}
      >
        <Icon size={22} strokeWidth={1.75} />
      </div>
      <h3 style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-2)' }}>
        {title}
      </h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', maxWidth: '380px', marginBottom: actionText ? 'var(--space-4)' : 0 }}>
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            backgroundColor: 'var(--accent-primary)',
            color: '#ffffff',
            borderRadius: 'var(--radius-md)',
            fontWeight: 500,
            fontSize: 'var(--text-sm)',
            transition: 'background var(--transition-fast)'
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
