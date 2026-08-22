import React from 'react';
import { BookOpen, Bookmark, Clock, Check, ArrowRight, Play } from 'lucide-react';
import { Lesson, SyntaxSection } from '../types/content';
import { StudyStateV1 } from '../types/state';
import { LESSON_CATEGORIES } from '../lib/lessonMapping';

interface StudyDashboardProps {
  lessons: Lesson[];
  syntaxSections: SyntaxSection[];
  state: StudyStateV1;
  onNavigate: (path: string) => void;
}

export const StudyDashboard: React.FC<StudyDashboardProps> = ({
  lessons,
  state,
  onNavigate
}) => {
  const completedCount = state.completedLessons.length;
  const progressPercent = Math.round((completedCount / 55) * 100);

  // Last opened lesson
  const lastLessonId = state.lastOpenedLessonId || '020';
  const lastLesson = lessons.find(l => l.id === lastLessonId) || lessons[0];

  // Recently opened lessons
  const recentLessons = state.recentLessonIds
    .map((id: string) => lessons.find(l => l.id === id))
    .filter((l): l is Lesson => Boolean(l))
    .slice(0, 5);

  // Bookmarked lessons
  const bookmarkedLessons = state.bookmarkedLessons
    .map((id: string) => lessons.find(l => l.id === id))
    .filter((l): l is Lesson => Boolean(l))
    .slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* 1. Continue Studying Hero Banner */}
      <div
        style={{
          padding: 'var(--space-5)',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--accent-primary-muted)',
                color: 'var(--accent-primary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600
              }}
            >
              <Play size={10} fill="currentColor" />
              Continue Studying
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              Lesson {lastLesson.id}
            </span>
          </div>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {lastLesson.title}
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Topic: {lastLesson.category}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate(`/lesson/${lastLesson.id}`)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-primary)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: 'var(--text-sm)',
            transition: 'opacity var(--transition-fast)',
            minHeight: '44px'
          }}
        >
          <span>Open Lesson</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* 2. Progress Overview (Clean, No fake charts) */}
      <div
        style={{
          padding: 'var(--space-5)',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Check size={16} color="var(--accent-success)" />
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Course Progress</h3>
          </div>
          <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
            {completedCount} / 55 completed ({progressPercent}%)
          </span>
        </div>

        {/* Linear progress bar */}
        <div
          style={{
            height: '6px',
            width: '100%',
            backgroundColor: 'var(--bg-surface-raised)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: 'var(--accent-success)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* 3. Two Column Sections: Recent & Bookmarks */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-4)'
        }}
      >
        {/* Recently Viewed */}
        <div
          style={{
            padding: 'var(--space-4)',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-default)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <Clock size={15} color="var(--text-muted)" />
            <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              Recently Studied
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {recentLessons.map((l: Lesson) => {
              const isCompleted = state.completedLessons.includes(l.id);
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => onNavigate(`/lesson/${l.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-xs)',
                    textAlign: 'left',
                    transition: 'background var(--transition-fast)'
                  }}
                  className="hover-surface"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      {l.id}
                    </span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {l.title}
                    </span>
                  </div>
                  {isCompleted && (
                    <Check size={12} color="var(--accent-success)" strokeWidth={2.5} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bookmarks */}
        <div
          style={{
            padding: 'var(--space-4)',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-default)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Bookmark size={15} color="var(--accent-gold)" fill="var(--accent-gold)" />
              <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                Saved Bookmarks
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/bookmarks')}
              style={{ fontSize: '11px', color: 'var(--accent-primary)' }}
            >
              View all
            </button>
          </div>

          {bookmarkedLessons.length === 0 ? (
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', padding: 'var(--space-4) 0', textAlign: 'center' }}>
              No bookmarks yet. Click the bookmark icon on any lesson to save it here.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {bookmarkedLessons.map((l: Lesson) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => onNavigate(`/lesson/${l.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-xs)',
                    textAlign: 'left',
                    transition: 'background var(--transition-fast)'
                  }}
                  className="hover-surface"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', fontWeight: 600 }}>
                      {l.id}
                    </span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {l.title}
                    </span>
                  </div>
                  <ArrowRight size={12} color="var(--text-muted)" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Topic Curriculum Explorer */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <BookOpen size={16} color="var(--accent-primary)" />
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>Course Topics (Lessons 20 → 74)</h3>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {LESSON_CATEGORIES.map((cat) => {
            const catLessons = lessons.filter(l => l.number >= cat.range[0] && l.number <= cat.range[1]);
            const completedInCat = catLessons.filter(l => state.completedLessons.includes(l.id)).length;
            const isCatComplete = completedInCat === catLessons.length && catLessons.length > 0;

            return (
              <div
                key={cat.name}
                style={{
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-default)',
                  transition: 'border-color var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  <div>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {cat.name}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginLeft: 'var(--space-2)' }}>
                      (Lessons {cat.range[0].toString().padStart(3, '0')} → {cat.range[1].toString().padStart(3, '0')})
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontFamily: 'var(--font-mono)',
                      color: isCatComplete ? 'var(--accent-success)' : 'var(--text-muted)',
                      fontWeight: 500
                    }}
                  >
                    {completedInCat}/{catLessons.length} completed
                  </span>
                </div>

                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                  {cat.description}
                </p>

                {/* Lesson pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {catLessons.map((l: Lesson) => {
                    const isDone = state.completedLessons.includes(l.id);
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => onNavigate(`/lesson/${l.id}`)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isDone ? 'var(--accent-success-muted)' : 'var(--bg-surface-raised)',
                          border: `1px solid ${isDone ? 'var(--accent-success)' : 'var(--border-subtle)'}`,
                          fontSize: 'var(--text-xs)',
                          color: isDone ? 'var(--accent-success)' : 'var(--text-secondary)',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{l.id}</span>
                        <span>{l.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .hover-surface:hover {
          background-color: var(--bg-surface-hover) !important;
        }
      `}</style>
    </div>
  );
};
