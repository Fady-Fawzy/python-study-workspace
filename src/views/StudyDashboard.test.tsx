import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { writeReadingPosition } from '../lib/readingPosition';
import { writeReadingProgress } from '../lib/readingProgress';
import { Lesson } from '../types/content';
import { StudyStateV1 } from '../types/state';
import { StudyDashboard } from './StudyDashboard';

const lessons: Lesson[] = [
  {
    id: '020',
    number: 20,
    title: 'Arithmetic Operators With A Deliberately Long Mobile Title',
    category: 'Operators & Expressions',
    rawMarkdown: '',
    parsedSections: [],
    toc: [],
    methods: [],
    quickReviewSectionIds: []
  },
  {
    id: '021',
    number: 21,
    title: 'Lists',
    category: 'Lists & Operations',
    rawMarkdown: '',
    parsedSections: [],
    toc: [],
    methods: [],
    quickReviewSectionIds: []
  },
  {
    id: '074',
    number: 74,
    title: 'Reduce Function',
    category: 'Built-In & Functional Tools',
    rawMarkdown: '',
    parsedSections: [],
    toc: [],
    methods: ['reduce'],
    quickReviewSectionIds: []
  }
];

const baseState: StudyStateV1 = {
  version: 1,
  completedLessons: [],
  bookmarkedLessons: [],
  bookmarkedSyntax: [],
  lessonNotes: {},
  lastOpenedLessonId: null,
  recentLessonIds: [],
  theme: 'dark',
  preferredMode: 'detailed',
  updatedAt: '2026-08-25T00:00:00.000Z'
};

function renderDashboard(overrides: Partial<StudyStateV1> = {}) {
  const onNavigate = vi.fn();
  render(
    <StudyDashboard
      lessons={lessons}
      syntaxSections={[]}
      state={{ ...baseState, ...overrides }}
      onNavigate={onNavigate}
    />
  );
  return onNavigate;
}

function renderActivityDashboard() {
  const onNavigate = vi.fn();
  render(
    <StudyDashboard
      lessons={lessons}
      syntaxSections={[]}
      state={baseState}
      onNavigate={onNavigate}
      activity={{ studyDays: ['2026-08-23', '2026-08-24', '2026-08-25'] }}
      activityNow={new Date(2026, 7, 25)}
    />
  );
  return onNavigate;
}

afterEach(cleanup);

describe('study dashboard', () => {
  it('resumes the saved lesson and falls back to the first available lesson', async () => {
    const user = userEvent.setup();
    localStorage.clear();
    writeReadingPosition('074', 480);
    const onNavigate = renderDashboard({ lastOpenedLessonId: '074' });

    const continueRegion = screen.getByRole('region', { name: /continue studying/i });
    expect(within(continueRegion).getByText('Reduce Function')).toBeInTheDocument();
    expect(within(continueRegion).getByText(/saved reading position/i)).toBeInTheDocument();
    await user.click(within(continueRegion).getByRole('button', { name: /resume lesson 074/i }));
    expect(onNavigate).toHaveBeenLastCalledWith('/lesson/074');

    cleanup();
    const fallbackNavigate = renderDashboard({ lastOpenedLessonId: '999' });
    const fallbackRegion = screen.getByRole('region', { name: /continue studying/i });
    expect(within(fallbackRegion).getByText(/start your first lesson/i)).toBeInTheDocument();
    await user.click(within(fallbackRegion).getByRole('button', { name: /start lesson 020/i }));
    expect(fallbackNavigate).toHaveBeenLastCalledWith('/lesson/020');
  });

  it('exposes compact, course-relative progress semantics', () => {
    renderDashboard({ completedLessons: ['020', '074'] });

    const progress = screen.getByRole('progressbar', { name: /course progress/i });
    expect(progress).toHaveAttribute('max', '3');
    expect(progress).toHaveAttribute('value', '2');
    expect(screen.getByText('2 of 3 lessons completed')).toBeInTheDocument();
    expect(screen.getByText('67%')).toBeInTheDocument();
  });

  it('shows a study overview and points to the next incomplete lesson', async () => {
    const user = userEvent.setup();
    const onNavigate = renderDashboard({
      completedLessons: ['020'],
      bookmarkedLessons: ['074'],
      lessonNotes: { '020': 'Review precedence' },
      lastOpenedLessonId: '020'
    });

    const overview = screen.getByRole('region', { name: /study overview/i });
    expect(within(overview).getByText('1 completed')).toBeInTheDocument();
    expect(within(overview).getByText('2 remaining')).toBeInTheDocument();
    expect(within(overview).getByText('1 bookmark')).toBeInTheDocument();
    expect(within(overview).getByText('1 note')).toBeInTheDocument();

    await user.click(within(overview).getByRole('button', { name: /open next lesson 021/i }));
    expect(onNavigate).toHaveBeenLastCalledWith('/lesson/021');
  });

  it('shows saved reading progress and explains when the recommendation resumes', () => {
    localStorage.clear();
    writeReadingPosition('021', 480);
    writeReadingProgress('021', 37);
    renderDashboard({ lastOpenedLessonId: '021' });

    const continueRegion = screen.getByRole('region', { name: /continue studying/i });
    expect(within(continueRegion).getByText('37%')).toBeInTheDocument();
    expect(within(continueRegion).getByRole('progressbar', { name: /lesson 021 reading progress/i })).toHaveValue(37);

    const overview = screen.getByRole('region', { name: /study overview/i });
    expect(within(overview).getByText(/resume where you left off/i)).toBeInTheDocument();
    expect(within(overview).getByRole('button', { name: /open next lesson 021/i })).toBeInTheDocument();
  });

  it('uses an incomplete bookmark when there is no saved lesson to resume', () => {
    localStorage.clear();
    renderDashboard({ bookmarkedLessons: ['074'] });

    const overview = screen.getByRole('region', { name: /study overview/i });
    expect(within(overview).getByText(/from your bookmarks/i)).toBeInTheDocument();
    expect(within(overview).getByRole('button', { name: /open next lesson 074/i })).toBeInTheDocument();
  });

  it('shows a useful recent-lessons empty state', () => {
    renderDashboard();

    const recentRegion = screen.getByRole('region', { name: /recently studied/i });
    expect(within(recentRegion).getByText(/lessons you open will appear here/i)).toBeInTheDocument();
  });

  it('makes recent lessons easy to resume and keeps completion status accessible', async () => {
    const user = userEvent.setup();
    const onNavigate = renderDashboard({
      recentLessonIds: ['074', '021'],
      completedLessons: ['021']
    });

    const recentRegion = screen.getByRole('region', { name: /recently studied/i });
    const completedRow = within(recentRegion).getByRole('button', { name: /lesson 021.*completed/i });
    expect(completedRow).toBeInTheDocument();
    await user.click(within(recentRegion).getByRole('button', { name: /lesson 074/i }));
    expect(onNavigate).toHaveBeenLastCalledWith('/lesson/074');
  });

  it('supports empty and populated bookmark navigation', async () => {
    const user = userEvent.setup();
    const emptyNavigate = renderDashboard();
    const emptyRegion = screen.getByRole('region', { name: /saved bookmarks/i });
    expect(within(emptyRegion).getByText(/bookmark a lesson to keep it within reach/i)).toBeInTheDocument();
    await user.click(within(emptyRegion).getByRole('button', { name: /view all bookmarks/i }));
    expect(emptyNavigate).toHaveBeenLastCalledWith('/bookmarks');

    cleanup();
    const populatedNavigate = renderDashboard({ bookmarkedLessons: ['074'] });
    const populatedRegion = screen.getByRole('region', { name: /saved bookmarks/i });
    await user.click(within(populatedRegion).getByRole('button', { name: /lesson 074/i }));
    expect(populatedNavigate).toHaveBeenLastCalledWith('/lesson/074');
  });

  it('navigates from readable topic discovery rows', async () => {
    const user = userEvent.setup();
    const onNavigate = renderDashboard();

    const topicsRegion = screen.getByRole('region', { name: /course topics/i });
    const longTitleRow = within(topicsRegion).getByRole('button', {
      name: /lesson 020.*arithmetic operators with a deliberately long mobile title/i
    });
    expect(longTitleRow).toHaveClass('dashboard-topic-lesson');
    await user.click(longTitleRow);
    expect(onNavigate).toHaveBeenLastCalledWith('/lesson/020');
  });

  it('shows a compact activity streak without replacing course progress', () => {
    renderActivityDashboard();

    const activity = screen.getByRole('region', { name: /study activity/i });
    expect(within(activity).getByText('3-day streak')).toBeInTheDocument();
    expect(within(activity).getByText('3 active days')).toBeInTheDocument();
    expect(within(activity).getByText(/studied today/i)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /course progress/i })).toBeInTheDocument();
  });
});
