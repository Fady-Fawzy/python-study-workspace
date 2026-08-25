export type PracticeQuestionType = 'multiple-choice' | 'predict-output' | 'behavior';

export interface PracticeQuestion {
  id: string;
  type: PracticeQuestionType;
  prompt: string;
  code?: string;
  output?: string;
  choices: string[];
  correctAnswer: number;
  explanation: string;
}

export interface PracticeLesson {
  id: string;
  number: number;
  title: string;
  questions: PracticeQuestion[];
}

export type PracticeLessonMap = Record<string, PracticeLesson>;
