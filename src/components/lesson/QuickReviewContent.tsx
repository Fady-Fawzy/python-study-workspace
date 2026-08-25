import React from 'react';
import { marked } from 'marked';
import { ArrowUpRight, Zap } from 'lucide-react';
import { SyntaxSection } from '../../types/content';
import { CodeBlock } from '../code/CodeBlock';

interface QuickReviewContentProps {
  syntaxSections: SyntaxSection[];
  onOpenFullReference?: (sectionId: number) => void;
}

function renderFormattedHtml(text: string): string {
  try {
    const rawHtml = marked.parse(text) as string;
    return rawHtml.replace(/<code>/g, '<code class="inline-code" dir="ltr">');
  } catch {
    return text;
  }
}

export const QuickReviewContent: React.FC<QuickReviewContentProps> = ({
  syntaxSections,
  onOpenFullReference
}) => {
  if (syntaxSections.length === 0) {
    return (
      <div className="quick-review-empty" role="status">
        <Zap size={24} aria-hidden="true" />
        <p>Quick syntax reference for this lesson is being loaded.</p>
      </div>
    );
  }

  return (
    <div className="quick-review">
      <div className="quick-review__notice">
        <div className="quick-review__notice-copy">
          <Zap size={16} aria-hidden="true" />
          <span>Showing concise syntax and review rules from Syntax Reference</span>
        </div>
        {onOpenFullReference && (
          <button
            type="button"
            className="quick-review__reference-link"
            onClick={() => onOpenFullReference(syntaxSections[0].id)}
          >
            <span>Open in Syntax Explorer</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </button>
        )}
      </div>

      {syntaxSections.map(sec => (
        <section key={sec.id} className="quick-review-card" aria-labelledby={`quick-review-${sec.id}`}>
          <header className="quick-review-card__header">
            <h2 id={`quick-review-${sec.id}`} dir="ltr">
              <bdi dir="ltr">#{sec.id})</bdi> {sec.title}
            </h2>
            <span className="quick-review-card__category" dir="ltr">{sec.category}</span>
          </header>

          <div className="quick-review-card__body">
            {sec.subsections.map(sub => (
              <div key={sub.id} className="quick-review-subsection">
                {sub.heading && (
                  <h3 dir="ltr" className="prose-text">{sub.heading}</h3>
                )}

                {sub.content.trim() && (
                  <div
                    dir="ltr"
                    className="quick-review-subsection__content prose-text"
                    dangerouslySetInnerHTML={{ __html: renderFormattedHtml(sub.content) }}
                  />
                )}

                {sub.codeBlocks.map((cb, idx) => (
                  <CodeBlock
                    key={idx}
                    code={cb.code}
                    language={cb.language || 'python'}
                    title={cb.title}
                  />
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
