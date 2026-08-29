import type { FC } from 'react';
import { ArrowRight, Bookmark, BookOpen, Check, Clock, FileText, Flame, ListChecks, Play } from 'lucide-react';
import { ProgressRing } from '../components/shared/ProgressRing';
import { LESSON_CATEGORIES } from '../lib/lessonMapping';
import { getDashboardInsights } from '../lib/dashboardInsights';
import { getNextLessonRecommendation, RecommendationReason } from '../lib/nextLesson';
import { readReadingPosition } from '../lib/readingPosition';
import { readAllReadingProgress, readReadingProgress } from '../lib/readingProgress';
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

const lessonActionLabel = (lesson: Lesson, completed = false) => (
  `Lesson ${lesson.id}: ${lesson.title}${completed ? ', completed' : ''}`
);

const metricLabel = (value: number, singular: string, plural = `${singular}s`) => (
  `${value} ${value === 1 ? singular : plural}`
);

const recommendationLabels: Record<Exclude<RecommendationReason, null>, string> = {
  resume: 'Resume where you left off',
  continue: 'Continue the sequence',
  bookmark: 'From your bookmarks',
  start: 'Start the course'
};

export const StudyDashboard: FC<StudyDashboardProps> = ({
  lessons,
  state,
  onNavigate,
  activity,
  activityNow
}) => {
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));
  const completedIds = new Set(state.completedLessons.filter((id) => lessonIds.has(id)));
  const completedCount = completedIds.size;
  const totalLessons = lessons.length;
  const remainingCount = Math.max(totalLessons - completedCount, 0);
  const progressPercent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;
  const bookmarkCount = state.bookmarkedLessons.length + state.bookmarkedSyntax.length;
  const noteCount = Object.values(state.lessonNotes).filter((note) => note.trim()).length;
  const activitySummary = getStudyActivitySummary(activityNow ?? new Date(), activity ?? readStudyActivity());
  const recommendation = getNextLessonRecommendation(
    lessons,
    completedIds,
    state.bookmarkedLessons,
    state.lastOpenedLessonId,
    readReadingProgress
  );
  const dashboardInsights = getDashboardInsights(
    lessons,
    completedIds,
    state.bookmarkedLessons,
    state.recentLessonIds,
    recommendation,
    readAllReadingProgress()
  );
  const nextLesson = recommendation.lesson;
  const savedLesson = lessons.find((lesson) => lesson.id === state.lastOpenedLessonId);
  const lastLesson = savedLesson ?? lessons[0];
  const hasSavedLesson = Boolean(savedLesson);
  const hasSavedReadingPosition = Boolean(lastLesson && readReadingPosition(lastLesson.id) > 0);
  const lastLessonProgress = lastLesson ? readReadingProgress(lastLesson.id) : 0;
  const recentLessons = dashboardInsights.queue;
  const bookmarkedLessons = state.bookmarkedLessons
    .map((id) => lessons.find((lesson) => lesson.id === id))
    .filter((lesson): lesson is Lesson => Boolean(lesson))
    .slice(0, 5);

  return (
    <div className="dashboard dashboard--editorial">
      {lastLesson && (
        <section className="dashboard-continue dashboard-continue--editorial" aria-label="Continue Studying">
          <div className="dashboard-continue__index" aria-hidden="true">
            <span>PYTHON / STUDY TRAIL</span>
            <span>{completedCount.toString().padStart(2, '0')}—{totalLessons.toString().padStart(2, '0')}</span>
          </div>
          <div className="dashboard-continue__layout">
            <div className="dashboard-continue__content">
              <div className="dashboard-eyebrow">
                <span className="dashboard-eyebrow__label"><Play size={12} fill="currentColor" aria-hidden="true" />Lesson {lastLesson.id}</span>
                <span className="dashboard-continue__category">{lastLesson.category}</span>
              </div>
              <h1 className="dashboard-continue__heading">Continue learning</h1>
              <h2 className="dashboard-continue__title">{lastLesson.title}</h2>
              <p className="dashboard-continue__resume-note">
                {lastLessonProgress > 0
                  ? `Saved reading position at ${lastLessonProgress}% — ready to resume.`
                  : hasSavedReadingPosition
                    ? 'Saved reading position ready to resume.'
                    : hasSavedLesson
                      ? 'Continue from this lesson whenever you are ready.'
                      : 'Start your first lesson and build your study trail.'}
              </p>
              {lastLessonProgress > 0 && (
                <div className="dashboard-continue__progress">
                  <div className="dashboard-continue__progress-header"><span>Reading progress</span><strong dir="ltr">{lastLessonProgress}%</strong></div>
                  <progress value={lastLessonProgress} max={100} aria-label={`Lesson ${lastLesson.id} reading progress`} />
                </div>
              )}
              <button
                type="button"
                className="dashboard-primary-action"
                aria-label={`${hasSavedLesson ? 'Resume' : 'Start'} Lesson ${lastLesson.id}: ${lastLesson.title}`}
                onClick={() => onNavigate(`/lesson/${lastLesson.id}`)}
              >
                <span>{hasSavedLesson ? 'Resume Lesson' : 'Start Lesson'}</span><ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
            <ProgressRing value={progressPercent} label="Course completion visual" size={132} />
          </div>
        </section>
      )}

      {totalLessons > 0 && (
        <section className={`dashboard-focus dashboard-focus--editorial${dashboardInsights.focus ? '' : ' dashboard-focus--complete'}`} aria-label="Today's focus">
          {dashboardInsights.focus ? (
            <>
              <div className="dashboard-focus__marker"><ListChecks size={17} aria-hidden="true" /><span>Today&apos;s focus</span></div>
              <div className="dashboard-focus__content">
                <div className="dashboard-focus__lesson-meta">
                  <span className="dashboard-lesson-number">Lesson {dashboardInsights.focus.lesson.id}</span>
                  {recommendation.reason && <span>{recommendationLabels[recommendation.reason]}</span>}
                </div>
                <h2 className="dashboard-focus__title">{dashboardInsights.focus.lesson.title}</h2>
                {dashboardInsights.focus.progress > 0 ? (
                  <div className="dashboard-focus__progress">
                    <div className="dashboard-focus__progress-header"><span>Reading progress</span><strong dir="ltr">{dashboardInsights.focus.progress}%</strong></div>
                    <progress value={dashboardInsights.focus.progress} max={100} aria-label={`Lesson ${dashboardInsights.focus.lesson.id} focus progress`} />
                  </div>
                ) : <p className="dashboard-focus__note">Start here when you are ready for your next focused session.</p>}
              </div>
              <button
                type="button"
                className="dashboard-focus__action"
                aria-label={`Open focus lesson ${dashboardInsights.focus.lesson.id}: ${dashboardInsights.focus.lesson.title}`}
                onClick={() => onNavigate(`/lesson/${dashboardInsights.focus?.lesson.id}`)}
              >
                <span>{dashboardInsights.focus.progress > 0 ? 'Resume Focus' : 'Start Focus'}</span><ArrowRight size={18} aria-hidden="true" />
              </button>
            </>
          ) : (
            <div className="dashboard-focus__complete"><Check size={18} aria-hidden="true" /><div><h2>Today&apos;s focus is complete</h2><p>You have finished every lesson in this course. Nice work.</p></div></div>
          )}
        </section>
      )}

      <section className="dashboard-progress dashboard-progress--editorial" aria-label="Course Progress">
        <div className="dashboard-progress__summary">
          <div><span className="dashboard-kicker">Course progress</span><strong>{completedCount} of {totalLessons} lessons completed</strong></div>
        </div>
        <progress className="dashboard-progress__bar" aria-label="Course Progress" aria-valuetext={`${completedCount} of ${totalLessons} lessons completed`} value={completedCount} max={Math.max(totalLessons, 1)} />
      </section>

      <section className="dashboard-overview dashboard-overview--editorial" aria-label="Study Overview">
        <div className="dashboard-overview__header">
          <div><span className="dashboard-kicker">At a glance</span><h2>Study Overview</h2></div>
          <span className="dashboard-overview__percent">{progressPercent}% complete</span>
        </div>
        <div className="dashboard-status" role="region" aria-label="Course status">
          <div><Check size={15} aria-hidden="true" /><span>{metricLabel(completedCount, 'completed', 'completed')}</span></div>
          <div><BookOpen size={15} aria-hidden="true" /><span>{metricLabel(remainingCount, 'remaining', 'remaining')}</span></div>
          <div><Bookmark size={15} aria-hidden="true" /><span>{metricLabel(bookmarkCount, 'bookmark')}</span></div>
          <div><FileText size={15} aria-hidden="true" /><span>{metricLabel(noteCount, 'note')}</span></div>
        </div>
        {nextLesson ? (
          <div className="dashboard-overview__next">
            <div className="dashboard-overview__next-copy">
              <span className="dashboard-overview__next-label">Next up</span><strong>Lesson {nextLesson.id}: {nextLesson.title}</strong>
              {recommendation.reason && <span className="dashboard-overview__next-reason">{recommendationLabels[recommendation.reason]}</span>}
            </div>
            <button type="button" className="dashboard-overview__next-action" aria-label={`Open next lesson ${nextLesson.id}: ${nextLesson.title}`} onClick={() => onNavigate(`/lesson/${nextLesson.id}`)}>
              Open Next <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        ) : <p className="dashboard-overview__complete-message">All lessons are complete. Nice work.</p>}
      </section>

      <section className="dashboard-activity dashboard-activity--editorial" aria-label="Study activity">
        <div className="dashboard-activity__header">
          <div className="dashboard-section-title"><Flame size={17} aria-hidden="true" /><div><h2>Study activity</h2><p>Small, consistent sessions add up.</p></div></div>
          <span className="dashboard-activity__total">{activitySummary.totalDays} total days</span>
        </div>
        <dl className="dashboard-activity__metrics">
          <div className="dashboard-activity__metric dashboard-activity__metric--highlight"><dt>Current streak</dt><dd>{activitySummary.currentStreak}-day streak</dd></div>
          <div className="dashboard-activity__metric"><dt>Last 7 days</dt><dd>{activitySummary.activeDaysLast7} active {activitySummary.activeDaysLast7 === 1 ? 'day' : 'days'}</dd></div>
          <div className="dashboard-activity__metric dashboard-activity__metric--status"><dt>Today</dt><dd>{activitySummary.todayStudied ? 'Studied today' : 'Not started today'}</dd></div>
        </dl>
      </section>

      <div className="dashboard-trail-grid">
        <section className="dashboard-list-section" aria-labelledby="dashboard-recent-title">
          <header className="dashboard-list-card__header">
            <div className="dashboard-section-title"><Clock size={17} aria-hidden="true" /><div><span className="dashboard-kicker">Study trail</span><h2 id="dashboard-recent-title">Recently Studied</h2></div></div>
          </header>
          <ul className="dashboard-lesson-list" aria-label="Study trail">
            {recentLessons.length === 0 ? (
              <li className="dashboard-empty-state"><Clock size={20} aria-hidden="true" /><div><strong>Your recent study list is ready.</strong><p>Lessons you open will appear here for quick access.</p></div></li>
            ) : recentLessons.map((item) => (
              <li key={item.lesson.id}>
                <button type="button" className="dashboard-lesson-row" aria-label={`${lessonActionLabel(item.lesson, item.completed)}${item.progress > 0 ? `, ${item.progress}% reading progress` : ''}`} onClick={() => onNavigate(`/lesson/${item.lesson.id}`)}>
                  <span className="dashboard-lesson-row__number">{item.lesson.id}</span>
                  <span className="dashboard-lesson-row__content">
                    <span className="dashboard-lesson-row__title">{item.lesson.title}</span>
                    {item.progress > 0 && <span className="dashboard-lesson-row__progress"><progress value={item.progress} max={100} aria-label={`Lesson ${item.lesson.id} reading progress`} /><span dir="ltr">{item.progress}%</span></span>}
                  </span>
                  {item.completed ? <span className="dashboard-lesson-row__status dashboard-lesson-row__status--complete" aria-hidden="true"><Check size={14} /></span> : <ArrowRight className="dashboard-lesson-row__arrow" size={15} aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="dashboard-list-section" aria-labelledby="dashboard-bookmarks-title">
          <header className="dashboard-list-card__header">
            <div className="dashboard-section-title"><Bookmark size={17} fill="currentColor" aria-hidden="true" /><div><span className="dashboard-kicker">Saved</span><h2 id="dashboard-bookmarks-title">Saved Bookmarks</h2></div></div>
            <button type="button" className="dashboard-secondary-action" onClick={() => onNavigate('/bookmarks')}>View all bookmarks</button>
          </header>
          {bookmarkedLessons.length === 0 ? (
            <div className="dashboard-empty-state"><Bookmark size={20} aria-hidden="true" /><div><strong>Keep useful lessons close.</strong><p>Bookmark a lesson to keep it within reach here.</p></div></div>
          ) : (
            <div className="dashboard-lesson-list">
              {bookmarkedLessons.map((lesson) => (
                <button key={lesson.id} type="button" className="dashboard-lesson-row" aria-label={lessonActionLabel(lesson, completedIds.has(lesson.id))} onClick={() => onNavigate(`/lesson/${lesson.id}`)}>
                  <span className="dashboard-lesson-row__number dashboard-lesson-row__number--bookmark">{lesson.id}</span><span className="dashboard-lesson-row__title">{lesson.title}</span><ArrowRight className="dashboard-lesson-row__arrow" size={15} aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="dashboard-attention dashboard-attention--editorial" aria-label="Needs attention">
        <div className="dashboard-attention__header">
          <div className="dashboard-section-title"><Clock size={17} aria-hidden="true" /><div><span className="dashboard-kicker">Return queue</span><h2>Needs attention</h2><p>Partial and bookmarked lessons worth revisiting.</p></div></div>
          <span className="dashboard-attention__count" dir="ltr">{dashboardInsights.attention.length}</span>
        </div>
        {dashboardInsights.attention.length === 0 ? (
          <div className="dashboard-attention__empty"><Check size={18} aria-hidden="true" /><span>You&apos;re on track. No unfinished saved lessons need attention.</span></div>
        ) : (
          <div className="dashboard-attention__list">
            {dashboardInsights.attention.map((item) => (
              <button key={item.lesson.id} type="button" className="dashboard-attention__row" aria-label={`${lessonActionLabel(item.lesson, item.completed)}${item.progress > 0 ? `, ${item.progress}% reading progress` : ''}`} onClick={() => onNavigate(`/lesson/${item.lesson.id}`)}>
                <span className="dashboard-lesson-row__number">{item.lesson.id}</span>
                <span className="dashboard-attention__copy"><span className="dashboard-attention__title">{item.lesson.title}</span><span className="dashboard-attention__meta">{item.reason === 'bookmark' ? 'Bookmarked lesson' : 'In progress'}{item.progress > 0 ? ` · ${item.progress}% read` : ''}</span></span>
                <ArrowRight className="dashboard-lesson-row__arrow" size={15} aria-hidden="true" />
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-topics dashboard-topics--editorial" aria-labelledby="dashboard-topics-title">
        <header className="dashboard-topics__header"><div className="dashboard-section-title dashboard-section-title--large"><BookOpen size={19} aria-hidden="true" /><div><span className="dashboard-kicker">Course index</span><h2 id="dashboard-topics-title">Course Topics</h2><p>Browse Lessons 020–074 by topic</p></div></div></header>
        <div className="dashboard-topic-list">
          {LESSON_CATEGORIES.map((category) => {
            const categoryLessons = lessons.filter((lesson) => lesson.number >= category.range[0] && lesson.number <= category.range[1]);
            const completedInCategory = categoryLessons.filter((lesson) => completedIds.has(lesson.id)).length;
            const isComplete = categoryLessons.length > 0 && completedInCategory === categoryLessons.length;
            return (
              <article className="dashboard-topic" key={category.name}>
                <header className="dashboard-topic__header">
                  <div className="dashboard-topic__heading"><h3>{category.name}</h3><span>Lessons {category.range[0].toString().padStart(3, '0')}–{category.range[1].toString().padStart(3, '0')}</span></div>
                  <span className="dashboard-topic__progress" data-complete={isComplete || undefined}>{completedInCategory}/{categoryLessons.length} completed</span>
                </header>
                <p className="dashboard-topic__description">{category.description}</p>
                {categoryLessons.length > 0 && (
                  <ul className="dashboard-topic__lessons">
                    {categoryLessons.map((lesson) => {
                      const isCompleted = completedIds.has(lesson.id);
                      return <li key={lesson.id}><button type="button" className="dashboard-topic-lesson" data-complete={isCompleted || undefined} aria-label={lessonActionLabel(lesson, isCompleted)} onClick={() => onNavigate(`/lesson/${lesson.id}`)}><span className="dashboard-topic-lesson__number">{lesson.id}</span><span className="dashboard-topic-lesson__title">{lesson.title}</span>{isCompleted ? <Check size={14} aria-hidden="true" /> : <ArrowRight size={14} aria-hidden="true" />}</button></li>;
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
