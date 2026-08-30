import React, { KeyboardEvent, RefObject } from 'react';
import {
  BookOpen,
  ClipboardCheck,
  FileEdit,
  List,
  RotateCcw,
  Zap
} from 'lucide-react';

export type StudyMode = 'detailed' | 'quickReview' | 'practice';

interface LessonStudyDockProps {
  lessonId: string;
  activeMode: StudyMode;
  hasPractice?: boolean;
  activeSectionText?: string | null;
  activeSectionIndex?: number;
  sectionTotal?: number;
  sectionProgress?: number;
  canOpenContents?: boolean;
  canResume?: boolean;
  resumeSectionText?: string | null;
  contentsButtonRef?: RefObject<HTMLButtonElement | null>;
  notesButtonRef?: RefObject<HTMLButtonElement | null>;
  onModeChange: (mode: StudyMode) => void;
  onOpenContents: () => void;
  onOpenNotes: () => void;
  onResume: () => void;
}

const modeDetails: Record<StudyMode, { label: string; icon: React.ReactNode }> = {
  detailed: { label: 'Detailed Study', icon: <BookOpen size={17} aria-hidden="true" /> },
  quickReview: { label: 'Quick Review', icon: <Zap size={17} aria-hidden="true" /> },
  practice: { label: 'Practice', icon: <ClipboardCheck size={17} aria-hidden="true" /> }
};

export const LessonStudyDock: React.FC<LessonStudyDockProps> = ({
  lessonId,
  activeMode,
  hasPractice = false,
  activeSectionText = null,
  activeSectionIndex = 0,
  sectionTotal = 0,
  sectionProgress = 0,
  canOpenContents = false,
  canResume = false,
  resumeSectionText = null,
  contentsButtonRef,
  notesButtonRef,
  onModeChange,
  onOpenContents,
  onOpenNotes,
  onResume
}) => {
  const modes: StudyMode[] = hasPractice
    ? ['detailed', 'quickReview', 'practice']
    : ['detailed', 'quickReview'];

  const selectMode = (mode: StudyMode) => {
    onModeChange(mode);
    window.requestAnimationFrame?.(() => {
      document.getElementById(`lesson-${lessonId}-${mode}-tab`)?.focus();
    });
  };

  const handleModeKeyDown = (event: KeyboardEvent<HTMLButtonElement>, mode: StudyMode) => {
    const currentIndex = modes.indexOf(mode);
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % modes.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + modes.length) % modes.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = modes.length - 1;

    if (nextIndex === null) return;
    event.preventDefault();
    selectMode(modes[nextIndex]);
  };

  const showSectionContext = activeMode === 'detailed' && sectionTotal > 1;
  const showResume = activeMode === 'detailed' && canResume && Boolean(resumeSectionText);

  return (
    <section className="lesson-study-dock" aria-label="Study controls">
      <div
        className="lesson-mode-switch lesson-mode-rail"
        data-mode-count={modes.length}
        role="tablist"
        aria-label="Study mode"
      >
        {modes.map(mode => (
          <button
            key={mode}
            id={`lesson-${lessonId}-${mode}-tab`}
            type="button"
            role="tab"
            className={`lesson-mode-switch__tab lesson-mode-switch__tab--${mode}`}
            data-selected={activeMode === mode || undefined}
            aria-selected={activeMode === mode}
            aria-controls={`lesson-${lessonId}-mode-panel`}
            tabIndex={activeMode === mode ? 0 : -1}
            onClick={() => selectMode(mode)}
            onKeyDown={event => handleModeKeyDown(event, mode)}
          >
            {modeDetails[mode].icon}
            <span>{modeDetails[mode].label}</span>
          </button>
        ))}
      </div>

      <div className="lesson-study-dock__context">
        {showSectionContext && (
          <div className="lesson-study-dock__section">
            <div className="lesson-study-dock__section-copy">
              <span>Section {activeSectionIndex + 1} of {sectionTotal}</span>
              <strong dir="auto">{activeSectionText}</strong>
            </div>
            <progress
              value={sectionProgress}
              max={100}
              aria-label="Current section progress"
            />
          </div>
        )}

        <div className="lesson-study-dock__actions">
          {showResume && (
            <button
              type="button"
              className="lesson-study-dock__action lesson-study-dock__resume"
              aria-label={`Resume at ${resumeSectionText}`}
              onClick={onResume}
            >
              <RotateCcw size={16} aria-hidden="true" />
              <span>Resume</span>
            </button>
          )}
          {activeMode === 'detailed' && canOpenContents && (
            <button
              ref={contentsButtonRef}
              type="button"
              className="lesson-study-dock__action"
              aria-label="Open lesson contents"
              onClick={onOpenContents}
            >
              <List size={17} aria-hidden="true" />
              <span>Contents</span>
            </button>
          )}
          {activeMode !== 'practice' && (
            <button
              ref={notesButtonRef}
              type="button"
              className="lesson-study-dock__action"
              aria-label="Open personal study notes"
              onClick={onOpenNotes}
            >
              <FileEdit size={17} aria-hidden="true" />
              <span>Notes</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
