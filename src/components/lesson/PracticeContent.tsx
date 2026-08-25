import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { CodeBlock } from '../code/CodeBlock';
import { PracticeLesson, PracticeQuestion } from '../../types/practice';
import { PracticeProgress } from '../../types/state';

interface PracticeContentProps {
  lesson: PracticeLesson;
  progress?: PracticeProgress;
  onProgressChange: (progress: PracticeProgress) => void;
}

const normalizeProgress = (
  progress: PracticeProgress | undefined,
  questionCount: number
): PracticeProgress => {
  const questionIndex = progress && Number.isInteger(progress.questionIndex)
    ? progress.questionIndex
    : 0;
  const score = progress && Number.isInteger(progress.score) && progress.score >= 0
    ? progress.score
    : 0;

  return {
    questionIndex: Math.min(
      Math.max(questionIndex, 0),
      Math.max(questionCount - 1, 0)
    ),
    answers: progress?.answers ? { ...progress.answers } : {},
    score,
    completed: progress?.completed === true
  };
};

const typeLabel: Record<PracticeQuestion['type'], string> = {
  'multiple-choice': 'Multiple choice',
  'predict-output': 'Predict the output',
  behavior: 'Concept check'
};

export const PracticeContent: React.FC<PracticeContentProps> = ({
  lesson,
  progress,
  onProgressChange
}) => {
  const [localProgress, setLocalProgress] = useState<PracticeProgress>(() => (
    normalizeProgress(progress, lesson.questions.length)
  ));

  useEffect(() => {
    setLocalProgress(normalizeProgress(progress, lesson.questions.length));
  }, [lesson.id, lesson.questions.length, progress]);

  const currentQuestion = lesson.questions[localProgress.questionIndex];
  const selectedAnswer = currentQuestion
    ? localProgress.answers[currentQuestion.id]
    : undefined;
  const answeredCount = Object.keys(localProgress.answers).filter(id => (
    lesson.questions.some(question => question.id === id)
  )).length;
  const isAnswered = selectedAnswer !== undefined;
  const isCorrect = isAnswered && selectedAnswer === currentQuestion?.correctAnswer;
  const scorePercent = Math.round((localProgress.score / lesson.questions.length) * 100);

  const commitProgress = (nextProgress: PracticeProgress) => {
    setLocalProgress(nextProgress);
    onProgressChange(nextProgress);
  };

  const handleAnswer = (answerIndex: number) => {
    if (!currentQuestion || isAnswered || localProgress.completed) return;

    commitProgress({
      ...localProgress,
      answers: {
        ...localProgress.answers,
        [currentQuestion.id]: answerIndex
      },
      score: localProgress.score + (answerIndex === currentQuestion.correctAnswer ? 1 : 0)
    });
  };

  const handleNext = () => {
    if (!currentQuestion || !isAnswered) return;

    if (localProgress.questionIndex === lesson.questions.length - 1) {
      commitProgress({ ...localProgress, completed: true });
      return;
    }

    commitProgress({
      ...localProgress,
      questionIndex: localProgress.questionIndex + 1
    });
  };

  const handlePrevious = () => {
    if (localProgress.questionIndex === 0 || localProgress.completed) return;

    commitProgress({
      ...localProgress,
      questionIndex: localProgress.questionIndex - 1
    });
  };

  const handleRestart = () => {
    commitProgress({
      questionIndex: 0,
      answers: {},
      score: 0,
      completed: false
    });
  };

  const progressText = useMemo(
    () => `${answeredCount} of ${lesson.questions.length} answered`,
    [answeredCount, lesson.questions.length]
  );

  if (localProgress.completed) {
    return (
      <section className="practice-content" aria-label={`${lesson.title} practice`}>
        <div className="practice-complete" role="status">
          <div className="practice-complete__icon" aria-hidden="true">
            <CheckCircle2 size={28} strokeWidth={2} />
          </div>
          <p className="practice-eyebrow">Practice complete</p>
          <h2>Practice complete</h2>
          <p className="practice-complete__copy">Nice work.</p>
          <p className="practice-complete__score">
            <strong>{localProgress.score}/{lesson.questions.length} correct</strong>
            <span>{scorePercent}% score</span>
          </p>
          <p className="practice-complete__copy">
            Review the explanations or restart the practice to strengthen your recall.
          </p>
          <div className="practice-complete__actions">
            <button type="button" className="practice-button practice-button--primary" onClick={handleRestart}>
              <RotateCcw size={16} aria-hidden="true" />
              <span>Restart Practice</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!currentQuestion) return null;

  return (
    <section className="practice-content" aria-label={`${lesson.title} practice`}>
      <header className="practice-header">
        <div>
          <p className="practice-eyebrow">Practice Mode</p>
          <h2>Check your understanding</h2>
        </div>
        <div className="practice-score" aria-label={`${localProgress.score} correct answers`}>
          <span className="practice-score__value">{localProgress.score}</span>
          <span className="practice-score__label">score</span>
        </div>
      </header>

      <div className="practice-progress">
        <div className="practice-progress__meta">
          <span>Question {localProgress.questionIndex + 1} of {lesson.questions.length}</span>
          <span>{progressText}</span>
        </div>
        <div
          className="practice-progress__bar"
          role="progressbar"
          aria-label="Practice progress"
          aria-valuemin={0}
          aria-valuemax={lesson.questions.length}
          aria-valuenow={answeredCount}
          aria-valuetext={progressText}
        >
          <span style={{ inlineSize: `${(answeredCount / lesson.questions.length) * 100}%` }} />
        </div>
      </div>

      <article className="practice-question">
        <div className="practice-question__type">{typeLabel[currentQuestion.type]}</div>
        <h3>
          <span className="practice-question__position">
            Question {localProgress.questionIndex + 1} of {lesson.questions.length}
          </span>
          <span>{currentQuestion.prompt}</span>
        </h3>

        {currentQuestion.code && (
          <CodeBlock code={currentQuestion.code} language="python" title="Question code" />
        )}

        <div className="practice-choices" role="group" aria-label="Answer choices">
          {currentQuestion.choices.map((choice, index) => {
            const choiceState = isAnswered
              ? index === currentQuestion.correctAnswer
                ? 'correct'
                : index === selectedAnswer
                  ? 'incorrect'
                  : 'neutral'
              : undefined;

            return (
              <button
                key={`${currentQuestion.id}-${choice}`}
                type="button"
                className="practice-choice"
                data-state={choiceState}
                aria-pressed={selectedAnswer === index}
                disabled={isAnswered}
                onClick={() => handleAnswer(index)}
              >
                <span className="practice-choice__marker" aria-hidden="true">
                  {String.fromCharCode(65 + index)}
                </span>
                <span dir={currentQuestion.type === 'predict-output' ? 'ltr' : 'auto'}>{choice}</span>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="practice-feedback" data-correct={isCorrect || undefined}>
            <div
              className="practice-feedback__heading"
              role="status"
              aria-live="polite"
              aria-label={isCorrect ? 'Correct' : 'Not quite'}
            >
              {isCorrect ? (
                <CheckCircle2 size={18} aria-hidden="true" />
              ) : (
                <XCircle size={18} aria-hidden="true" />
              )}
              <strong>{isCorrect ? 'Correct' : 'Not quite'}</strong>
            </div>
            {currentQuestion.output && (
              <div className="practice-output" dir="ltr">
                <span className="practice-output__label">Expected output</span>
                <pre>{currentQuestion.output}</pre>
              </div>
            )}
            <p>{currentQuestion.explanation}</p>
          </div>
        )}
      </article>

      <footer className="practice-actions">
        <button
          type="button"
          className="practice-button practice-button--secondary"
          onClick={handlePrevious}
          disabled={localProgress.questionIndex === 0}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Previous</span>
        </button>
        <button
          type="button"
          className="practice-button practice-button--primary"
          onClick={handleNext}
          disabled={!isAnswered}
        >
          <span>{localProgress.questionIndex === lesson.questions.length - 1 ? 'Finish Practice' : 'Next question'}</span>
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </footer>
    </section>
  );
};
