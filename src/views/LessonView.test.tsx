import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Lesson, SyntaxSection } from '../types/content';
import { StudyStateV1 } from '../types/state';
import {
  readReadingCheckpoint,
  readReadingPosition,
  writeReadingCheckpoint,
  writeReadingPosition
} from '../lib/readingPosition';
import { getStudyActivitySummary, readStudyActivity } from '../lib/studyActivity';
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

const practiceLesson = {
  id: '020',
  number: 20,
  title: 'Arithmetic Operators',
  questions: [{
    id: 'first',
    type: 'predict-output' as const,
    prompt: 'What does this print?',
    choices: ['2', '3'],
    correctAnswer: 0,
    explanation: 'Addition produces 2.'
  }]
};

const relatedSyntaxSections: SyntaxSection[] = [
  {
    id: 1,
    number: 1,
    title: 'Arithmetic Operators',
    category: 'Operators & Expressions',
    rawMarkdown: '',
    methods: [],
    subsections: []
  },
  {
    id: 2,
    number: 2,
    title: 'Lists',
    category: 'Data Structures',
    rawMarkdown: '',
    methods: ['append'],
    subsections: []
  }
];

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

  it('records one study activity day when a lesson is opened', () => {
    localStorage.clear();
    window.scrollTo = vi.fn();

    render(
      <LessonView
        lessonId="020"
        lessons={[lesson]}
        detailedLessons={{}}
        syntaxSections={[]}
        state={state}
        onUpdateState={vi.fn()}
        onNavigate={vi.fn()}
      />
    );

    expect(readStudyActivity().studyDays).toHaveLength(1);
    expect(getStudyActivitySummary().todayStudied).toBe(true);
  });

  it('places contents in the study dock before lesson content', () => {
    window.scrollTo = vi.fn();

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
    expect(screen.getByRole('region', { name: 'Study controls' })).toContainElement(trigger);
    expect(trigger.compareDocumentPosition(modePanel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('forwards full-view changes from the lesson header', async () => {
    window.scrollTo = vi.fn();
    const user = userEvent.setup();
    const onFullViewChange = vi.fn();

    render(
      <LessonView
        lessonId="020"
        lessons={[lesson]}
        detailedLessons={{}}
        syntaxSections={[]}
        state={{ ...state, preferredMode: 'detailed' }}
        onUpdateState={vi.fn()}
        onNavigate={vi.fn()}
        isFullView={false}
        onFullViewChange={onFullViewChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Full View' }));
    expect(onFullViewChange).toHaveBeenCalledWith(true);
  });

  it('records a timestamp when a personal note is autosaved', () => {
    vi.useFakeTimers();
    try {
      window.scrollTo = vi.fn();
      const onUpdateState = vi.fn();

      render(
        <LessonView
          lessonId="020"
          lessons={[lesson]}
          detailedLessons={{}}
          syntaxSections={[]}
          state={{ ...state, preferredMode: 'detailed' }}
          onUpdateState={onUpdateState}
          onNavigate={vi.fn()}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /open personal study notes/i }));

      expect(screen.getAllByRole('textbox', { name: /personal study notes/i })).toHaveLength(1);

      act(() => {
        fireEvent.change(screen.getByRole('textbox', { name: /personal study notes/i }), {
          target: { value: 'Review operator precedence.' }
        });
        vi.advanceTimersByTime(600);
      });

      const savedStates = onUpdateState.mock.calls.map(([updater]) => updater(state));
      expect(savedStates).toContainEqual(expect.objectContaining({
        lessonNoteUpdatedAt: expect.objectContaining({ '020': expect.any(String) })
      }));
    } finally {
      act(() => {
        vi.runOnlyPendingTimers();
      });
      vi.useRealTimers();
    }
  });

  it('renders jump controls outside the lesson reading content', () => {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 320, writable: true });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 2000,
      writable: true
    });
    window.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    render(
      <LessonView
        lessonId="020"
        lessons={[lesson]}
        detailedLessons={{}}
        syntaxSections={[]}
        state={{ ...state, preferredMode: 'detailed' }}
        onUpdateState={vi.fn()}
        onNavigate={vi.fn()}
      />
    );

    const controls = screen.getByRole('navigation', { name: 'Reading navigation' });
    expect(controls).toContainElement(screen.getByRole('button', { name: 'Jump to top' }));
    expect(controls).toContainElement(screen.getByRole('button', { name: 'Jump to end' }));
  });

  it('restores a saved reading position when opening a lesson', () => {
    localStorage.clear();
    window.scrollTo = vi.fn();
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0, writable: true });
    window.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    writeReadingPosition('020', 480);

    render(
      <LessonView
        lessonId="020"
        lessons={[lesson]}
        detailedLessons={{}}
        syntaxSections={[]}
        state={{ ...state, preferredMode: 'detailed' }}
        onUpdateState={vi.fn()}
        onNavigate={vi.fn()}
      />
    );

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 480, behavior: 'auto' });
  });

  it('restores the exact saved heading before falling back to pixels', () => {
    localStorage.clear();
    window.scrollTo = vi.fn();
    const scrollIntoView = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoView;
    writeReadingCheckpoint('020', {
      y: 480,
      sectionId: 'second',
      sectionText: 'Second',
      updatedAt: '2026-08-30T10:00:00.000Z'
    });

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

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
    expect(window.scrollTo).not.toHaveBeenCalledWith({ top: 480, behavior: 'auto' });
  });

  it('falls back to the saved pixel when a checkpoint heading is stale', () => {
    localStorage.clear();
    window.scrollTo = vi.fn();
    writeReadingCheckpoint('020', {
      y: 360,
      sectionId: 'removed-heading',
      sectionText: 'Removed heading',
      updatedAt: '2026-08-30T10:00:00.000Z'
    });

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

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 360, behavior: 'auto' });
  });

  it('persists the current lesson position after scrolling', () => {
    localStorage.clear();
    window.scrollTo = vi.fn();
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 540, writable: true });
    window.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

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

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(readReadingPosition('020')).toBe(540);
    expect(readReadingCheckpoint('020')).toEqual(expect.objectContaining({
      sectionId: 'second',
      sectionText: 'Second'
    }));
  });

  it('keeps study controls, contents, and notes available in Full View', async () => {
    window.scrollTo = vi.fn();
    const user = userEvent.setup();
    render(
      <LessonView
        lessonId="020"
        lessons={[lesson]}
        detailedLessons={{ '020': detailedLesson }}
        syntaxSections={[]}
        state={{ ...state, preferredMode: 'detailed' }}
        onUpdateState={vi.fn()}
        onNavigate={vi.fn()}
        isFullView
      />
    );

    expect(screen.getByRole('region', { name: 'Study controls' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open lesson contents/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /open personal study notes/i }));
    expect(screen.getByRole('textbox', { name: /personal study notes/i })).toBeInTheDocument();
  });

  it('renders Practice for a mapped lesson and persists the selected answer', async () => {
    window.scrollTo = vi.fn();
    const user = userEvent.setup();
    const onUpdateState = vi.fn();

    render(
      <LessonView
        lessonId="020"
        lessons={[lesson]}
        detailedLessons={{}}
        practiceLessons={{ '020': practiceLesson }}
        syntaxSections={[]}
        state={{ ...state, preferredMode: 'detailed' }}
        onUpdateState={onUpdateState}
        onNavigate={vi.fn()}
      />
    );

    await user.click(screen.getByRole('tab', { name: 'Practice' }));
    expect(screen.getByRole('region', { name: /arithmetic operators practice/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '2' }));
    const persistedStates = onUpdateState.mock.calls.map(([updater]) => updater(state));
    expect(persistedStates).toContainEqual(expect.objectContaining({
      practiceProgress: {
        '020': {
          questionIndex: 0,
          answers: { first: 0 },
          score: 1,
          completed: false
        }
      }
    }));
  });

  it('exposes every related syntax reference link from the lesson', async () => {
    window.scrollTo = vi.fn();
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    const lessonWithSyntax = { ...lesson, quickReviewSectionIds: [1, 2] };

    render(
      <LessonView
        lessonId="020"
        lessons={[lessonWithSyntax]}
        detailedLessons={{}}
        syntaxSections={relatedSyntaxSections}
        state={{ ...state, preferredMode: 'detailed' }}
        onUpdateState={vi.fn()}
        onNavigate={onNavigate}
      />
    );

    const related = screen.getByRole('navigation', { name: /related syntax reference/i });
    expect(related).toHaveTextContent('Arithmetic Operators');
    expect(related).toHaveTextContent('Lists');
    await user.click(screen.getByRole('button', { name: /open syntax reference section 2/i }));
    expect(onNavigate).toHaveBeenCalledWith('/reference?section=2');
  });

  it('does not expose Practice for a lesson without a mapped bank', () => {
    window.scrollTo = vi.fn();
    const lesson026: Lesson = {
      ...lesson,
      id: '026',
      number: 26,
      title: 'Strings'
    };

    render(
      <LessonView
        lessonId="026"
        lessons={[lesson026]}
        detailedLessons={{}}
        practiceLessons={{ '020': practiceLesson }}
        syntaxSections={[]}
        state={{ ...state, preferredMode: 'quickReview' }}
        onUpdateState={vi.fn()}
        onNavigate={vi.fn()}
      />
    );

    expect(screen.queryByRole('tab', { name: 'Practice' })).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /quick review/i })).toBeInTheDocument();
  });
});
