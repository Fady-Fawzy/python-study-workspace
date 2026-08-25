import React, { useState } from 'react';
import { ArrowRight, FileText, Search, Trash2 } from 'lucide-react';
import { EmptyState } from '../components/shared/EmptyState';
import { Lesson } from '../types/content';
import { StudyStateV1 } from '../types/state';

interface NotesViewProps {
  lessons: Lesson[];
  state: StudyStateV1;
  onNavigate: (path: string) => void;
  onUpdateState: (updater: (prev: StudyStateV1) => StudyStateV1) => void;
}

interface SavedNote {
  lessonId: string;
  lessonTitle: string;
  lessonCategory: string;
  note: string;
}

export const NotesView: React.FC<NotesViewProps> = ({
  lessons,
  state,
  onNavigate,
  onUpdateState
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const lessonsWithNotes: SavedNote[] = Object.entries(state.lessonNotes)
    .filter(([, note]) => typeof note === 'string' && note.trim().length > 0)
    .map(([lessonId, note]) => {
      const lesson = lessons.find((candidate) => candidate.id === lessonId);
      return {
        lessonId,
        lessonTitle: lesson ? lesson.title : `Lesson ${lessonId}`,
        lessonCategory: lesson ? lesson.category : 'Python',
        note
      };
    });

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredNotes = lessonsWithNotes.filter((item) => {
    if (!normalizedQuery) return true;

    return [item.lessonId, item.lessonTitle, item.lessonCategory, item.note]
      .some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
  });

  const handleDeleteNote = (lessonId: string) => {
    if (!window.confirm(`Delete note for Lesson ${lessonId}?`)) return;

    onUpdateState((prev) => {
      const lessonNotes = { ...prev.lessonNotes };
      delete lessonNotes[lessonId];
      return { ...prev, lessonNotes };
    });
  };

  return (
    <div className="saved-view notes-view">
      <header className="saved-view__header">
        <div className="saved-view__eyebrow">
          <FileText size={20} aria-hidden="true" />
          <h1>Personal Study Notes</h1>
        </div>
        <p>
          All personal takeaways, gotchas, and reminders written across lessons
          {' '}({lessonsWithNotes.length} {lessonsWithNotes.length === 1 ? 'lesson' : 'lessons'} with notes).
        </p>
      </header>

      {lessonsWithNotes.length > 0 && (
        <div className="notes-search" role="search" aria-label="Search study notes">
          <label className="visually-hidden" htmlFor="notes-search-input">Search study notes</label>
          <Search size={18} aria-hidden="true" />
          <input
            id="notes-search-input"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search titles, topics, or note text..."
          />
          {searchQuery && (
            <button
              type="button"
              className="notes-search__clear"
              aria-label="Clear search"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>
      )}

      {lessonsWithNotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No personal notes yet"
          description="While studying any lesson, write personal takeaways, gotchas, or reminders in the notes box to see them organized here."
          actionText="Start Studying"
          onAction={() => onNavigate('/')}
        />
      ) : filteredNotes.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching notes"
          description={`No notes match “${searchQuery}”. Try another phrase or clear the current search.`}
          actionText="Clear Search"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <section className="saved-notes" aria-label="Saved study notes">
          {filteredNotes.map((item) => {
            const titleId = `saved-note-title-${item.lessonId}`;

            return (
              <article
                className="saved-note"
                aria-label={`Lesson ${item.lessonId}: ${item.lessonTitle}`}
                key={item.lessonId}
              >
                <header className="saved-note__header">
                  <div className="saved-note__heading">
                    <span className="saved-note__lesson" dir="ltr">Lesson {item.lessonId}</span>
                    <div className="saved-note__title-wrap">
                      <h2 id={titleId}><bdi>{item.lessonTitle}</bdi></h2>
                      <p><bdi>{item.lessonCategory}</bdi></p>
                    </div>
                  </div>

                  <div className="saved-note__actions">
                    <button
                      type="button"
                      className="saved-note__open"
                      aria-label={`Open Lesson ${item.lessonId}: ${item.lessonTitle}`}
                      onClick={() => onNavigate(`/lesson/${item.lessonId}`)}
                    >
                      <span>Open Lesson</span>
                      <ArrowRight size={15} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="saved-note__delete"
                      aria-label={`Delete note for Lesson ${item.lessonId}`}
                      title="Delete note"
                      onClick={() => handleDeleteNote(item.lessonId)}
                    >
                      <Trash2 size={17} aria-hidden="true" />
                    </button>
                  </div>
                </header>

                <div dir="auto" className="saved-note__content arabic-text">
                  {item.note}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};
