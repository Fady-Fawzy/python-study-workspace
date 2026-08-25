import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Lesson } from '../types/content';
import { StudyStateV1 } from '../types/state';
import { LessonView } from './LessonView';

const lesson: Lesson = {
  id: '020',
  number: 20,
  title: 'Arithmetic Operators',
  category: 'Operators & Expressions',
  rawMarkdown: '',
  parsedSections: [],
  toc: [],
  methods: [],
  quickReviewSectionIds: []
};

const state: StudyStateV1 = {
  version: 1,
  completedLessons: [],
  bookmarkedLessons: [],
  bookmarkedSyntax: [],
  lessonNotes: {},
  lastOpenedLessonId: null,
  recentLessonIds: [],
  theme: 'dark',
  preferredMode: 'quickReview',
  updatedAt: '2026-08-25T00:00:00.000Z'
};

describe('LessonView', () => {
  it('starts in the persisted mode and persists a new mode selection', async () => {
    window.scrollTo = vi.fn();
    const user = userEvent.setup();
    const onUpdateState = vi.fn();
    render(
      <LessonView
        lessonId="020"
        lessons={[lesson]}
        detailedLessons={{}}
        syntaxSections={[]}
        state={state}
        onUpdateState={onUpdateState}
        onNavigate={vi.fn()}
      />
    );

    expect(screen.getByRole('tab', { name: /quick review/i })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('tab', { name: /detailed study/i }));

    const resultingStates = onUpdateState.mock.calls.map(([updater]) => updater(state));
    expect(resultingStates).toContainEqual(expect.objectContaining({ preferredMode: 'detailed' }));
  });

  it('places the mobile contents trigger before lesson content rather than after notes and pagination', () => {
    window.scrollTo = vi.fn();
    const detailedLesson = {
      id: '020',
      number: 20,
      title: lesson.title,
      rawMarkdown: '',
      blocks: [
        { id: 'first', type: 'heading' as const, level: 2, content: 'First' },
        { id: 'second', type: 'heading' as const, level: 2, content: 'Second' }
      ],
      toc: [
        { id: 'first', text: 'First', level: 2 },
        { id: 'second', text: 'Second', level: 2 }
      ]
    };

    render(
      <LessonView
        lessonId="020"
        lessons={[lesson]}
        detailedLessons={{ '020': detailedLesson }}
        syntaxSections={[]}
        state={{ ...state, preferredMode: 'detailed' }}
        onUpdateState={vi.fn()}
        onNavigate={vi.fn()}
      />
    );

    const trigger = screen.getByRole('button', { name: /open lesson contents/i });
    const modePanel = screen.getByRole('tabpanel');
    expect(trigger.compareDocumentPosition(modePanel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
