import React, { useId } from 'react';
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
  const titleId = useId();

  return (
    <section className="empty-state" aria-labelledby={titleId}>
      <span className="empty-state__icon" aria-hidden="true">
        <Icon size={22} strokeWidth={1.75} />
      </span>
      <div className="empty-state__copy" role="status">
        <h2 id={titleId} className="empty-state__title">{title}</h2>
        <p className="empty-state__description">{description}</p>
      </div>
      {actionText && onAction && (
        <button type="button" className="empty-state__action" onClick={onAction}>
          {actionText}
        </button>
      )}
    </section>
  );
};
