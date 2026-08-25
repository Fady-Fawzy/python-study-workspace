import React from 'react';
import { marked } from 'marked';
import { ArrowUpRight, Zap } from 'lucide-react';
import { SyntaxSection } from '../../types/content';
import { CodeBlock } from '../code/CodeBlock';

interface QuickReviewContentProps {
  syntaxSections: SyntaxSection[];
  onOpenFullReference?: (sectionId: number) => void;
}

function isExampleHeading(heading: string): boolean {
  return /\bexample(?:s)?\b|demo/i.test(heading);
}

function getEntryTitle(heading: string): string {
  return heading.trim() || 'Core syntax';
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
          <span>Scan the element, what it does, and the syntax you need.</span>
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
            <div className="quick-review-card__meta" dir="ltr">
              <span className="quick-review-card__category">{sec.category}</span>
              <span className="quick-review-card__count">
                {sec.subsections.length} {sec.subsections.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </header>

          <div className="quick-review-card__body">
            {sec.subsections.map(sub => {
              const hasDescription = Boolean(sub.content.trim());
              const isExample = isExampleHeading(sub.heading);

              return (
                <article key={sub.id} className="quick-review-entry">
                  <header className="quick-review-entry__header">
                    <span className="quick-review-entry__marker" aria-hidden="true">•</span>
                    <h3 dir="ltr">{getEntryTitle(sub.heading)}</h3>
                  </header>

                  {hasDescription && (
                    <div className="quick-review-entry__detail">
                      <span className="quick-review-entry__label">What it does</span>
                      <div
                        dir="ltr"
                        className="quick-review-subsection__content prose-text"
                        dangerouslySetInnerHTML={{ __html: renderFormattedHtml(sub.content) }}
                      />
                    </div>
                  )}

                  {sub.codeBlocks.length > 0 && (
                    <div className="quick-review-entry__code">
                      <span className="quick-review-entry__label">{isExample ? 'Example' : 'Syntax'}</span>
                      <div className="quick-review-entry__code-stack">
                        {sub.codeBlocks.map((cb, idx) => (
                          <CodeBlock
                            key={idx}
                            code={cb.code}
                            language={cb.language || 'python'}
                            title={cb.title}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};
