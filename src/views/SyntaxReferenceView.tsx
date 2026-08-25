import React, { useEffect, useMemo, useState } from 'react';
import { Code2, Search } from 'lucide-react';
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
    if (initialSectionId == null) return;

    const section = document.getElementById(`syntax-section-${initialSectionId}`);
    if (!section) return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    section.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start'
    });
  }, [initialSectionId]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const section of syntaxSections) {
      counts.set(section.category, (counts.get(section.category) ?? 0) + 1);
    }
    return counts;
  }, [syntaxSections]);

  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();

    return syntaxSections.filter(section => {
      if (selectedCategory !== 'All' && section.category !== selectedCategory) return false;
      if (!query) return true;

      return (
        section.number.toString().includes(query) ||
        section.title.toLocaleLowerCase().includes(query) ||
        section.methods.some(method => method.toLocaleLowerCase().includes(query)) ||
        section.subsections.some(subsection =>
          subsection.heading.toLocaleLowerCase().includes(query) ||
          subsection.content.toLocaleLowerCase().includes(query)
        ) ||
        section.rawMarkdown.toLocaleLowerCase().includes(query)
      );
    });
  }, [syntaxSections, selectedCategory, searchQuery]);

  const handleToggleBookmark = (sectionId: number) => {
    onUpdateState(previous => {
      const exists = previous.bookmarkedSyntax.includes(sectionId);
      const bookmarkedSyntax = exists
        ? previous.bookmarkedSyntax.filter(id => id !== sectionId)
        : [...previous.bookmarkedSyntax, sectionId];

      return { ...previous, bookmarkedSyntax };
    });
  };

  const categoryButtons = [
    { name: 'All', count: syntaxSections.length },
    ...SYNTAX_CATEGORIES.map(category => ({
      name: category.name,
      count: categoryCounts.get(category.name) ?? 0
    }))
  ];

  return (
    <div className="syntax-reference">
      <header className="syntax-reference__header">
        <div className="syntax-reference__eyebrow">
          <Code2 size={18} aria-hidden="true" />
          <span>Lessons 20–74</span>
        </div>
        <h1>Python Syntax Reference &amp; Cheat Sheet</h1>
        <p>Comprehensive practical reference covering all 67 syntax sections from Lessons 20 → 74.</p>
      </header>

      <section className="syntax-toolbar" aria-label="Filter syntax reference">
        <label className="syntax-search">
          <span className="visually-hidden">Search syntax reference</span>
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder="Search syntax, methods, or examples…"
            autoComplete="off"
          />
        </label>

        <div className="syntax-categories" role="group" aria-label="Syntax categories">
          {categoryButtons.map(category => {
            const isSelected = selectedCategory === category.name;

            return (
              <button
                key={category.name}
                type="button"
                className="syntax-category"
                aria-pressed={isSelected}
                data-selected={isSelected || undefined}
                onClick={() => setSelectedCategory(category.name)}
              >
                <span>{category.name}</span>
                <span className="syntax-category__count" aria-hidden="true">
                  {category.count}
                </span>
              </button>
            );
          })}
        </div>

        <p className="syntax-toolbar__summary" aria-live="polite">
          Showing <strong>{filteredSections.length}</strong> of {syntaxSections.length} sections
        </p>
      </section>

      <div className="syntax-sections">
        {filteredSections.length === 0 ? (
          <div className="syntax-empty" role="status">
            <Search size={22} aria-hidden="true" />
            <div>
              <h2>No matching syntax sections</h2>
              <p>
                No results for <bdi>&ldquo;{searchQuery.trim()}&rdquo;</bdi> in{' '}
                <bdi>{selectedCategory === 'All' ? 'all categories' : selectedCategory}</bdi>.
              </p>
            </div>
          </div>
        ) : (
          filteredSections.map(section => {
            const titleId = `syntax-section-title-${section.id}`;
            const isBookmarked = state.bookmarkedSyntax.includes(section.id);

            return (
              <article
                key={section.id}
                id={`syntax-section-${section.id}`}
                className="syntax-section"
                data-special={section.isSpecialSection || undefined}
                aria-labelledby={titleId}
              >
                <header className="syntax-section__header">
                  <div className="syntax-section__heading">
                    <span className="syntax-section__number">#{section.id}</span>
                    <h2 id={titleId} dir="ltr">
                      <bdi>{section.title}</bdi>
                    </h2>
                  </div>

                  <div className="syntax-section__actions">
                    <span className="syntax-section__category">
                      <bdi>{section.category}</bdi>
                    </span>
                    <BookmarkButton
                      isBookmarked={isBookmarked}
                      onToggle={() => handleToggleBookmark(section.id)}
                      title="Bookmark this syntax section"
                    />
                  </div>
                </header>

                <div className="syntax-section__content">
                  {section.subsections.map((subsection: SyntaxSubsection) => (
                    <section className="syntax-subsection" key={subsection.id}>
                      {subsection.heading && (
                        <h3 dir="ltr" className="prose-text">
                          {subsection.heading}
                        </h3>
                      )}

                      {subsection.content.trim() && (
                        <div
                          dir="ltr"
                          className="syntax-subsection__prose prose-text"
                          dangerouslySetInnerHTML={{ __html: renderFormattedHtml(subsection.content) }}
                        />
                      )}

                      {subsection.codeBlocks.map((codeBlock, index) => (
                        <CodeBlock
                          key={`${subsection.id}-${index}`}
                          code={codeBlock.code}
                          language={codeBlock.language || 'python'}
                          title={codeBlock.title}
                        />
                      ))}
                    </section>
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
