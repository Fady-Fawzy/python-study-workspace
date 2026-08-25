import React from 'react';
import { ArrowUpRight, Code2 } from 'lucide-react';
import { SyntaxSection } from '../../types/content';

interface LessonSyntaxLinksProps {
  sections: SyntaxSection[];
  onNavigate: (path: string) => void;
}

/** A compact bridge from lesson concepts to the matching reference entries. */
export const LessonSyntaxLinks: React.FC<LessonSyntaxLinksProps> = ({ sections, onNavigate }) => {
  if (sections.length === 0) return null;

  return (
    <nav className="lesson-syntax-links" aria-label="Related syntax reference">
      <div className="lesson-syntax-links__header">
        <Code2 size={18} aria-hidden="true" />
        <h2>Related Syntax Reference</h2>
      </div>

      <div className="lesson-syntax-links__list">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className="lesson-syntax-links__item"
            aria-label={`Open syntax reference section ${section.id}: ${section.title}`}
            onClick={() => onNavigate(`/reference?section=${section.id}`)}
          >
            <span className="lesson-syntax-links__number" dir="ltr">#{section.id}</span>
            <span className="lesson-syntax-links__copy">
              <strong><bdi>{section.title}</bdi></strong>
              <small><bdi>{section.category}</bdi></small>
            </span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        ))}
      </div>
    </nav>
  );
};
