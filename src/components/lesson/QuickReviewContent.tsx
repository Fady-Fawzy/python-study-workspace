import React from 'react';
import { marked } from 'marked';
import { SyntaxSection } from '../../types/content';
import { CodeBlock } from '../code/CodeBlock';
import { Zap, ArrowUpRight } from 'lucide-react';

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
      <div
        style={{
          padding: 'var(--space-8) var(--space-4)',
          textAlign: 'center',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border-default)',
          color: 'var(--text-muted)'
        }}
      >
        <Zap size={24} style={{ marginBottom: 'var(--space-2)' }} />
        <p style={{ fontSize: 'var(--text-sm)' }}>
          Quick syntax reference for this lesson is being loaded.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Notice header */}
      <div
        style={{
          padding: 'var(--space-3) var(--space-4)',
          backgroundColor: 'var(--bg-surface-raised)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          <Zap size={14} color="var(--accent-gold)" />
          <span>Showing concise syntax and review rules from Syntax Reference</span>
        </div>
        {onOpenFullReference && (
          <button
            type="button"
            onClick={() => onOpenFullReference(syntaxSections[0].id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: 'var(--text-xs)',
              color: 'var(--accent-primary)',
              fontWeight: 500
            }}
          >
            <span>Open in Syntax Explorer</span>
            <ArrowUpRight size={12} />
          </button>
        )}
      </div>

      {syntaxSections.map(sec => (
        <div
          key={sec.id}
          style={{
            padding: 'var(--space-5)',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {/* Section Header */}
          <div
            style={{
              paddingBottom: 'var(--space-3)',
              marginBottom: 'var(--space-4)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
              #{sec.id}) {sec.title}
            </h2>
            <span
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-badge)',
                color: 'var(--text-muted)'
              }}
            >
              {sec.category}
            </span>
          </div>

          {/* Subsections & Code */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {sec.subsections.map(sub => (
              <div key={sub.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {sub.heading && (
                  <h3
                    dir="auto"
                    className="arabic-text"
                    style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginTop: 'var(--space-2)'
                    }}
                  >
                    {sub.heading}
                  </h3>
                )}

                {sub.content.trim() && (
                  <div
                    dir="auto"
                    className="arabic-text"
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                      lineHeight: 'var(--leading-arabic)'
                    }}
                    dangerouslySetInnerHTML={{ __html: renderFormattedHtml(sub.content) }}
                  />
                )}

                {sub.codeBlocks.map((cb, idx) => (
                  <CodeBlock
                    key={idx}
                    code={cb.code}
                    language={cb.language || 'python'}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
