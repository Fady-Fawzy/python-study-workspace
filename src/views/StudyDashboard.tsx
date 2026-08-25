import React from 'react';
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  Clock,
  Flame,
  FileText,
  ListChecks,
  Play
} from 'lucide-react';
import { LESSON_CATEGORIES } from '../lib/lessonMapping';
import { readReadingPosition } from '../lib/readingPosition';
import { getStudyActivitySummary, readStudyActivity, StudyActivity } from '../lib/studyActivity';
import { Lesson, SyntaxSection } from '../types/content';
import { StudyStateV1 } from '../types/state';

interface StudyDashboardProps {
  lessons: Lesson[];
  syntaxSections: SyntaxSection[];
  state: StudyStateV1;
  onNavigate: (path: string) => void;
  activity?: StudyActivity;
  activityNow?: Date;
}

function lessonActionLabel(lesson: Lesson, isCompleted = false) {
  return `Lesson ${lesson.id}: ${lesson.title}${isCompleted ? ', completed' : ''}`;
}

function metricLabel(value: number, singular: string, plural = `${singular}s`) {
  return `${value} ${value === 1 ? singular : plural}`;
}

export const StudyDashboard: React.FC<StudyDashboardProps> = ({
  lessons,
  state,
  onNavigate,
  activity,
  activityNow
}) => {
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));
  const completedIds = new Set(
    state.completedLessons.filter((lessonId) => lessonIds.has(lessonId))
  );
  const completedCount = completedIds.size;
  const totalLessons = lessons.length;
  const remainingCount = Math.max(totalLessons - completedCount, 0);
  const progressPercent = totalLessons > 0
    ? Math.round((completedCount / totalLessons) * 100)
    : 0;
  const bookmarkCount = state.bookmarkedLessons.length + state.bookmarkedSyntax.length;
  const noteCount = Object.values(state.lessonNotes).filter((note) => note.trim()).length;
  const activitySummary = getStudyActivitySummary(
    activityNow ?? new Date(),
    activity ?? readStudyActivity()
  );
  const nextLesson = lessons.find((lesson) => !completedIds.has(lesson.id));

  const savedLesson = lessons.find((lesson) => lesson.id === state.lastOpenedLessonId);
  const lastLesson = savedLesson ?? lessons[0];
  const hasSavedLesson = Boolean(savedLesson);
  const hasSavedReadingPosition = Boolean(lastLesson && readReadingPosition(lastLesson.id) > 0);

  const recentLessons = state.recentLessonIds
    .map((id) => lessons.find((lesson) => lesson.id === id))
    .filter((lesson): lesson is Lesson => Boolean(lesson))
    .slice(0, 5);

  const bookmarkedLessons = state.bookmarkedLessons
    .map((id) => lessons.find((lesson) => lesson.id === id))
    .filter((lesson): lesson is Lesson => Boolean(lesson))
    .slice(0, 5);

  return (
    <div className="dashboard">
      {lastLesson && (
        <section className="dashboard-continue ui-card" aria-label="Continue Studying">
          <div className="dashboard-continue__content">
            <div className="dashboard-eyebrow">
              <span className="dashboard-eyebrow__label">
                <Play size={12} fill="currentColor" aria-hidden="true" />
                Continue Studying
              </span>
              <span className="dashboard-lesson-number">Lesson {lastLesson.id}</span>
            </div>
            <h1 className="dashboard-continue__title">{lastLesson.title}</h1>
            <p className="dashboard-continue__meta">{lastLesson.category}</p>
            <p className="dashboard-continue__resume-note">
              {hasSavedReadingPosition
                ? 'Saved reading position ready to resume.'
                : hasSavedLesson
                  ? 'Continue from this lesson whenever you are ready.'
                  : 'Start your first lesson and build your study trail.'}
            </p>
          </div>

          <button
            type="button"
            className="dashboard-primary-action"
            aria-label={`${hasSavedLesson ? 'Resume' : 'Start'} Lesson ${lastLesson.id}: ${lastLesson.title}`}
            onClick={() => onNavigate(`/lesson/${lastLesson.id}`)}
          >
            <span>{hasSavedLesson ? 'Resume Lesson' : 'Start Lesson'}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </section>
      )}

      <section className="dashboard-progress ui-card" aria-labelledby="dashboard-progress-title">
        <div className="dashboard-progress__summary">
          <div className="dashboard-section-title">
            <span className="dashboard-section-title__icon dashboard-section-title__icon--success">
              <Check size={16} aria-hidden="true" />
            </span>
            <h2 id="dashboard-progress-title">Course Progress</h2>
          </div>
          <div className="dashboard-progress__numbers">
            <span>{completedCount} of {totalLessons} lessons completed</span>
            <strong>{progressPercent}%</strong>
          </div>
        </div>
        <progress
          className="dashboard-progress__bar"
          aria-labelledby="dashboard-progress-title"
          aria-valuetext={`${completedCount} of ${totalLessons} lessons completed`}
          value={completedCount}
          max={Math.max(totalLessons, 1)}
        />
      </section>

      <section className="dashboard-activity ui-card" aria-label="Study activity">
        <div className="dashboard-activity__header">
          <div className="dashboard-section-title">
            <span className="dashboard-section-title__icon dashboard-section-title__icon--streak">
              <Flame size={16} aria-hidden="true" />
            </span>
            <div>
              <h2>Study activity</h2>
              <p>Small, consistent sessions add up.</p>
            </div>
          </div>
          <span className="dashboard-activity__total">{activitySummary.totalDays} total days</span>
        </div>

        <dl className="dashboard-activity__metrics">
          <div className="dashboard-activity__metric dashboard-activity__metric--highlight">
            <dt>Current streak</dt>
            <dd>{activitySummary.currentStreak}-day streak</dd>
          </div>
          <div className="dashboard-activity__metric">
            <dt>Last 7 days</dt>
            <dd>{activitySummary.activeDaysLast7} active {activitySummary.activeDaysLast7 === 1 ? 'day' : 'days'}</dd>
          </div>
          <div className="dashboard-activity__metric dashboard-activity__metric--status">
            <dt>Today</dt>
            <dd>{activitySummary.todayStudied ? 'Studied today' : 'Not started today'}</dd>
          </div>
        </dl>
      </section>

      <section className="dashboard-overview ui-card" aria-label="Study Overview">
        <div className="dashboard-overview__header">
          <div className="dashboard-section-title">
            <ListChecks size={17} aria-hidden="true" />
            <h2>Study Overview</h2>
          </div>
          <span className="dashboard-overview__percent">{progressPercent}% complete</span>
        </div>

        <div className="dashboard-overview__metrics">
          <div className="dashboard-overview__metric">
            <span className="dashboard-overview__metric-icon dashboard-overview__metric-icon--success" aria-hidden="true">
              <Check size={15} />
            </span>
            <span className="dashboard-overview__metric-value">{metricLabel(completedCount, 'completed', 'completed')}</span>
          </div>
          <div className="dashboard-overview__metric">
            <span className="dashboard-overview__metric-icon dashboard-overview__metric-icon--primary" aria-hidden="true">
              <BookOpen size={15} />
            </span>
            <span className="dashboard-overview__metric-value">{metricLabel(remainingCount, 'remaining', 'remaining')}</span>
          </div>
          <div className="dashboard-overview__metric">
            <span className="dashboard-overview__metric-icon dashboard-overview__metric-icon--bookmark" aria-hidden="true">
              <Bookmark size={15} fill="currentColor" />
            </span>
            <span className="dashboard-overview__metric-value">{metricLabel(bookmarkCount, 'bookmark')}</span>
          </div>
          <div className="dashboard-overview__metric">
            <span className="dashboard-overview__metric-icon dashboard-overview__metric-icon--note" aria-hidden="true">
              <FileText size={15} />
            </span>
            <span className="dashboard-overview__metric-value">{metricLabel(noteCount, 'note')}</span>
          </div>
        </div>

        {nextLesson ? (
          <div className="dashboard-overview__next">
            <div className="dashboard-overview__next-copy">
              <span className="dashboard-overview__next-label">Next up</span>
              <strong>Lesson {nextLesson.id}: {nextLesson.title}</strong>
            </div>
            <button
              type="button"
              className="dashboard-overview__next-action"
              aria-label={`Open next lesson ${nextLesson.id}: ${nextLesson.title}`}
              onClick={() => onNavigate(`/lesson/${nextLesson.id}`)}
            >
              Open Next
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <p className="dashboard-overview__complete-message">All lessons are complete. Nice work.</p>
        )}
      </section>

      <div className="dashboard-resume-grid">
        <section className="dashboard-list-card ui-card" aria-labelledby="dashboard-recent-title">
          <header className="dashboard-list-card__header">
            <div className="dashboard-section-title">
              <Clock size={17} aria-hidden="true" />
              <h2 id="dashboard-recent-title">Recently Studied</h2>
            </div>
          </header>

          {recentLessons.length === 0 ? (
            <div className="dashboard-empty-state">
              <Clock size={20} aria-hidden="true" />
              <div>
                <strong>Your recent study list is ready.</strong>
                <p>Lessons you open will appear here for quick access.</p>
              </div>
            </div>
          ) : (
            <div className="dashboard-lesson-list">
              {recentLessons.map((lesson) => {
                const isCompleted = completedIds.has(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    className="dashboard-lesson-row"
                    aria-label={lessonActionLabel(lesson, isCompleted)}
                    onClick={() => onNavigate(`/lesson/${lesson.id}`)}
                  >
                    <span className="dashboard-lesson-row__number">{lesson.id}</span>
                    <span className="dashboard-lesson-row__title">{lesson.title}</span>
                    {isCompleted ? (
                      <span className="dashboard-lesson-row__status dashboard-lesson-row__status--complete" aria-hidden="true">
                        <Check size={14} />
                      </span>
                    ) : (
                      <ArrowRight className="dashboard-lesson-row__arrow" size={15} aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="dashboard-list-card ui-card" aria-labelledby="dashboard-bookmarks-title">
          <header className="dashboard-list-card__header">
            <div className="dashboard-section-title">
              <Bookmark className="dashboard-bookmark-icon" size={17} fill="currentColor" aria-hidden="true" />
              <h2 id="dashboard-bookmarks-title">Saved Bookmarks</h2>
            </div>
            <button
              type="button"
              className="dashboard-secondary-action"
              onClick={() => onNavigate('/bookmarks')}
            >
              View all bookmarks
            </button>
          </header>

          {bookmarkedLessons.length === 0 ? (
            <div className="dashboard-empty-state">
              <Bookmark size={20} aria-hidden="true" />
              <div>
                <strong>Keep useful lessons close.</strong>
                <p>Bookmark a lesson to keep it within reach here.</p>
              </div>
            </div>
          ) : (
            <div className="dashboard-lesson-list">
              {bookmarkedLessons.map((lesson) => (
                <button
                  key={lesson.id}
                  type="button"
                  className="dashboard-lesson-row"
                  aria-label={lessonActionLabel(lesson, completedIds.has(lesson.id))}
                  onClick={() => onNavigate(`/lesson/${lesson.id}`)}
                >
                  <span className="dashboard-lesson-row__number dashboard-lesson-row__number--bookmark">
                    {lesson.id}
                  </span>
                  <span className="dashboard-lesson-row__title">{lesson.title}</span>
                  <ArrowRight className="dashboard-lesson-row__arrow" size={15} aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="dashboard-topics" aria-labelledby="dashboard-topics-title">
        <header className="dashboard-topics__header">
          <div className="dashboard-section-title dashboard-section-title--large">
            <BookOpen size={19} aria-hidden="true" />
            <div>
              <h2 id="dashboard-topics-title">Course Topics</h2>
              <p>Browse Lessons 020–074 by topic</p>
            </div>
          </div>
        </header>

        <div className="dashboard-topic-list">
          {LESSON_CATEGORIES.map((category) => {
            const categoryLessons = lessons.filter(
              (lesson) => lesson.number >= category.range[0] && lesson.number <= category.range[1]
            );
            const completedInCategory = categoryLessons.filter((lesson) => completedIds.has(lesson.id)).length;
            const isCategoryComplete = categoryLessons.length > 0
              && completedInCategory === categoryLessons.length;

            return (
              <article className="dashboard-topic ui-card" key={category.name}>
                <header className="dashboard-topic__header">
                  <div className="dashboard-topic__heading">
                    <h3>{category.name}</h3>
                    <span>
                      Lessons {category.range[0].toString().padStart(3, '0')}–{category.range[1].toString().padStart(3, '0')}
                    </span>
                  </div>
                  <span
                    className="dashboard-topic__progress"
                    data-complete={isCategoryComplete || undefined}
                  >
                    {completedInCategory}/{categoryLessons.length} completed
                  </span>
                </header>
                <p className="dashboard-topic__description">{category.description}</p>

                {categoryLessons.length > 0 && (
                  <ul className="dashboard-topic__lessons">
                    {categoryLessons.map((lesson) => {
                      const isCompleted = completedIds.has(lesson.id);
                      return (
                        <li key={lesson.id}>
                          <button
                            type="button"
                            className="dashboard-topic-lesson"
                            data-complete={isCompleted || undefined}
                            aria-label={lessonActionLabel(lesson, isCompleted)}
                            onClick={() => onNavigate(`/lesson/${lesson.id}`)}
                          >
                            <span className="dashboard-topic-lesson__number">{lesson.id}</span>
                            <span className="dashboard-topic-lesson__title">{lesson.title}</span>
                            {isCompleted ? (
                              <Check size={14} aria-hidden="true" />
                            ) : (
                              <ArrowRight size={14} aria-hidden="true" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
