import React, { KeyboardEvent, useState } from 'react';
import { ArrowRight, Bookmark, BookOpen, Code2, Trash2 } from 'lucide-react';
import { EmptyState } from '../components/shared/EmptyState';
import { Lesson, SyntaxSection } from '../types/content';
import { StudyStateV1 } from '../types/state';

interface BookmarksViewProps {
  lessons: Lesson[];
  syntaxSections: SyntaxSection[];
  state: StudyStateV1;
  onNavigate: (path: string) => void;
  onUpdateState: (updater: (prev: StudyStateV1) => StudyStateV1) => void;
}

type BookmarkFilter = 'all' | 'lessons' | 'syntax';

const bookmarkFilters: BookmarkFilter[] = ['all', 'lessons', 'syntax'];

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  lessons,
  syntaxSections,
  state,
  onNavigate,
  onUpdateState
}) => {
  const [activeTab, setActiveTab] = useState<BookmarkFilter>('all');

  const bookmarkedLessons = state.bookmarkedLessons
    .map((id) => lessons.find((lesson) => lesson.id === id))
    .filter((lesson): lesson is Lesson => Boolean(lesson));

  const bookmarkedSyntax = state.bookmarkedSyntax
    .map((sectionId) => syntaxSections.find((section) => section.id === sectionId))
    .filter((section): section is SyntaxSection => Boolean(section));

  const totalBookmarks = bookmarkedLessons.length + bookmarkedSyntax.length;
  const activeTabId = `bookmark-filter-${activeTab}`;
  const hasVisibleBookmarks = activeTab === 'all'
    ? totalBookmarks > 0
    : activeTab === 'lessons'
      ? bookmarkedLessons.length > 0
      : bookmarkedSyntax.length > 0;

  const handleRemoveLessonBookmark = (id: string) => {
    onUpdateState((prev) => ({
      ...prev,
      bookmarkedLessons: prev.bookmarkedLessons.filter((lessonId) => lessonId !== id)
    }));
  };

  const handleRemoveSyntaxBookmark = (sectionId: number) => {
    onUpdateState((prev) => ({
      ...prev,
      bookmarkedSyntax: prev.bookmarkedSyntax.filter((savedId) => savedId !== sectionId)
    }));
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, current: BookmarkFilter) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

    event.preventDefault();
    const currentIndex = bookmarkFilters.indexOf(current);
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? bookmarkFilters.length - 1
        : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + bookmarkFilters.length) % bookmarkFilters.length;
    const nextTab = bookmarkFilters[nextIndex];

    setActiveTab(nextTab);
    document.getElementById(`bookmark-filter-${nextTab}`)?.focus();
  };

  const tabProps = (filter: BookmarkFilter) => ({
    id: `bookmark-filter-${filter}`,
    role: 'tab' as const,
    'aria-selected': activeTab === filter,
    'aria-controls': 'bookmarks-panel',
    tabIndex: activeTab === filter ? 0 : -1,
    onClick: () => setActiveTab(filter),
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => handleTabKeyDown(event, filter),
    'data-selected': activeTab === filter ? '' : undefined
  });

  return (
    <div className="saved-view bookmarks-view">
      <header className="saved-view__header">
        <div className="saved-view__eyebrow">
          <Bookmark size={20} fill="currentColor" aria-hidden="true" />
          <h1>Saved Bookmarks</h1>
        </div>
        <p>Quick access to saved lessons and syntax reference sections.</p>
      </header>

      {totalBookmarks > 0 && (
        <div className="bookmark-tabs" role="tablist" aria-label="Filter bookmarks">
          <button type="button" className="bookmark-tab" {...tabProps('all')}>
            All <span className="bookmark-tab__count">({totalBookmarks})</span>
          </button>
          <button type="button" className="bookmark-tab" {...tabProps('lessons')}>
            Lessons <span className="bookmark-tab__count">({bookmarkedLessons.length})</span>
          </button>
          <button type="button" className="bookmark-tab" {...tabProps('syntax')}>
            Syntax Sections <span className="bookmark-tab__count">({bookmarkedSyntax.length})</span>
          </button>
        </div>
      )}

      {totalBookmarks === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarks yet"
          description="Bookmark any lesson or syntax reference section during your studies to quickly revisit it here."
          actionText="Browse Lessons"
          onAction={() => onNavigate('/')}
        />
      ) : (
        <div
          id="bookmarks-panel"
          className="bookmarks-panel"
          role="tabpanel"
          aria-labelledby={activeTabId}
          tabIndex={0}
        >
          {!hasVisibleBookmarks ? (
            <EmptyState
              icon={activeTab === 'lessons' ? BookOpen : Code2}
              title={activeTab === 'lessons' ? 'No saved lessons' : 'No saved syntax sections'}
              description={activeTab === 'lessons'
                ? 'Your syntax bookmarks are still available. Switch back to see everything you saved.'
                : 'Your lesson bookmarks are still available. Switch back to see everything you saved.'}
              actionText="Show All Bookmarks"
              onAction={() => setActiveTab('all')}
            />
          ) : (
            <div className="bookmark-sections">
              {(activeTab === 'all' || activeTab === 'lessons') && bookmarkedLessons.length > 0 && (
                <section className="bookmark-section" aria-labelledby="bookmarked-lessons-heading">
                  <h2 id="bookmarked-lessons-heading">
                    Bookmarked Lessons <span>{bookmarkedLessons.length}</span>
                  </h2>
                  <ul className="bookmark-list">
                    {bookmarkedLessons.map((lesson) => (
                      <li className="bookmark-row" key={lesson.id}>
                        <button
                          type="button"
                          className="bookmark-row__open"
                          aria-label={`Open Lesson ${lesson.id}: ${lesson.title}`}
                          onClick={() => onNavigate(`/lesson/${lesson.id}`)}
                        >
                          <BookOpen className="bookmark-row__icon" size={18} aria-hidden="true" />
                          <span className="bookmark-row__content">
                            <span className="bookmark-row__title">
                              <bdi>Lesson {lesson.id}</bdi> — <bdi>{lesson.title}</bdi>
                            </span>
                            <span className="bookmark-row__meta"><bdi>{lesson.category}</bdi></span>
                          </span>
                          <ArrowRight className="bookmark-row__arrow" size={16} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="bookmark-row__remove"
                          aria-label={`Remove Lesson ${lesson.id} bookmark`}
                          title="Remove bookmark"
                          onClick={() => handleRemoveLessonBookmark(lesson.id)}
                        >
                          <Trash2 size={17} aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {(activeTab === 'all' || activeTab === 'syntax') && bookmarkedSyntax.length > 0 && (
                <section className="bookmark-section" aria-labelledby="bookmarked-syntax-heading">
                  <h2 id="bookmarked-syntax-heading">
                    Bookmarked Syntax Sections <span>{bookmarkedSyntax.length}</span>
                  </h2>
                  <ul className="bookmark-list">
                    {bookmarkedSyntax.map((section) => (
                      <li className="bookmark-row bookmark-row--syntax" key={section.id}>
                        <button
                          type="button"
                          className="bookmark-row__open"
                          aria-label={`Open Syntax Section ${section.id}: ${section.title}`}
                          onClick={() => onNavigate(`/reference?section=${section.id}`)}
                        >
                          <Code2 className="bookmark-row__icon" size={18} aria-hidden="true" />
                          <span className="bookmark-row__content">
                            <span className="bookmark-row__title">
                              <bdi>Section {section.id}</bdi> — <bdi>{section.title}</bdi>
                            </span>
                            <span className="bookmark-row__meta"><bdi>{section.category}</bdi></span>
                          </span>
                          <ArrowRight className="bookmark-row__arrow" size={16} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="bookmark-row__remove"
                          aria-label={`Remove Syntax Section ${section.id} bookmark`}
                          title="Remove bookmark"
                          onClick={() => handleRemoveSyntaxBookmark(section.id)}
                        >
                          <Trash2 size={17} aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
