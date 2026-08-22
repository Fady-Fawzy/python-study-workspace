import React, { useState, useMemo, useEffect } from 'react';
import { Search, Code2 } from 'lucide-react';
import { marked } from 'marked';
import { SyntaxSection, SyntaxSubsection } from '../types/content';
import { StudyStateV1 } from '../types/state';
import { SYNTAX_CATEGORIES } from '../lib/lessonMapping';
import { CodeBlock } from '../components/code/CodeBlock';
import { BookmarkButton } from '../components/shared/BookmarkButton';

interface SyntaxReferenceViewProps {
  syntaxSections: SyntaxSection[];
  state: StudyStateV1;
  initialSectionId?: number | null;
  onUpdateState: (updater: (prev: StudyStateV1) => StudyStateV1) => void;
}

function renderFormattedHtml(text: string): string {
  try {
    const rawHtml = marked.parse(text) as string;
    return rawHtml.replace(/<code>/g, '<code class="inline-code" dir="ltr">');
  } catch {
    return text;
  }
}

export const SyntaxReferenceView: React.FC<SyntaxReferenceViewProps> = ({
  syntaxSections,
  state,
  initialSectionId,
  onUpdateState
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialSectionId) {
      const el = document.getElementById(`syntax-section-${initialSectionId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [initialSectionId]);

  // Filter sections by category and search
  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return syntaxSections.filter(sec => {
      // Category match
      if (selectedCategory !== 'All' && sec.category !== selectedCategory) {
        return false;
      }

      if (!query) return true;

      // Query match in title, section number, methods, or raw text
      return (
        sec.number.toString().includes(query) ||
        sec.title.toLowerCase().includes(query) ||
        sec.methods.some((m: string) => m.toLowerCase().includes(query)) ||
        sec.subsections.some((s: SyntaxSubsection) => s.heading.toLowerCase().includes(query) || s.content.toLowerCase().includes(query))
      );
    });
  }, [syntaxSections, selectedCategory, searchQuery]);

  const handleToggleBookmark = (secId: number) => {
    onUpdateState(prev => {
      const exists = prev.bookmarkedSyntax.includes(secId);
      const updated = exists
        ? prev.bookmarkedSyntax.filter((id: number) => id !== secId)
        : [...prev.bookmarkedSyntax, secId];
      return { ...prev, bookmarkedSyntax: updated };
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header & Description */}
      <div
        style={{
          paddingBottom: 'var(--space-4)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
          <Code2 size={20} color="var(--accent-primary)" />
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
            Python Syntax Reference & Cheat Sheet
          </h1>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          Comprehensive practical reference covering all 67 syntax sections from Lessons 20 → 74.
        </p>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
          backgroundColor: 'var(--bg-surface)',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)'
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '8px 12px',
            backgroundColor: 'var(--bg-surface-raised)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search syntax, methods (e.g. append, kwargs, lambda, reduce)..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px'
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)',
              fontWeight: selectedCategory === 'All' ? 600 : 500,
              backgroundColor: selectedCategory === 'All' ? 'var(--accent-primary)' : 'var(--bg-surface-raised)',
              color: selectedCategory === 'All' ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              transition: 'all var(--transition-fast)'
            }}
          >
            All ({syntaxSections.length})
          </button>

          {SYNTAX_CATEGORIES.map(cat => {
            const count = syntaxSections.filter(s => cat.sectionIds.includes(s.id)).length;

            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: selectedCategory === cat.name ? 600 : 500,
                  backgroundColor: selectedCategory === cat.name ? 'var(--accent-primary)' : 'var(--bg-surface-raised)',
                  color: selectedCategory === cat.name ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtered Sections Documentation Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {filteredSections.length === 0 ? (
          <div style={{ padding: 'var(--space-12) 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            No syntax sections found matching &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : (
          filteredSections.map(sec => {
            const isBookmarked = state.bookmarkedSyntax.includes(sec.id);

            return (
              <article
                key={sec.id}
                id={`syntax-section-${sec.id}`}
                style={{
                  scrollMarginTop: '80px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: `1px solid ${sec.isSpecialSection ? 'var(--accent-gold)' : 'var(--border-default)'}`,
                  padding: 'var(--space-5)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Section Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 'var(--space-3)',
                    marginBottom: 'var(--space-4)',
                    borderBottom: '1px solid var(--border-subtle)',
                    flexWrap: 'wrap',
                    gap: 'var(--space-2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: sec.isSpecialSection ? 'var(--accent-gold-muted)' : 'var(--accent-primary-muted)',
                        color: sec.isSpecialSection ? 'var(--accent-gold)' : 'var(--accent-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600
                      }}
                    >
                      #{sec.id}
                    </span>
                    <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {sec.title}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-badge)',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {sec.category}
                    </span>
                    <BookmarkButton
                      isBookmarked={isBookmarked}
                      onToggle={() => handleToggleBookmark(sec.id)}
                      title="Bookmark this syntax section"
                    />
                  </div>
                </div>

                {/* Subsections & Code Blocks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {sec.subsections.map((sub: SyntaxSubsection) => (
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

                      {sub.codeBlocks.map((cb, idx: number) => (
                        <CodeBlock
                          key={idx}
                          code={cb.code}
                          language={cb.language || 'python'}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
