export interface StudyStateV1 {
  version: 1;
  completedLessons: string[];       // Array of lesson IDs e.g. ["020", "021"]
  bookmarkedLessons: string[];      // Array of lesson IDs e.g. ["022", "056"]
  bookmarkedSyntax: number[];       // Array of syntax section IDs e.g. [3, 26]
  lessonNotes: Record<string, string>; // lessonId -> note text
  lastOpenedLessonId: string | null;  // e.g. "020"
  recentLessonIds: string[];         // Max 10 recent lesson IDs
  theme: 'dark' | 'light' | 'system';
  preferredMode: 'detailed' | 'quickReview';
  practiceProgress?: Record<string, PracticeProgress>;
  updatedAt: string;
}

export interface PracticeProgress {
  questionIndex: number;
  answers: Record<string, number>;
  score: number;
  completed: boolean;
}

export type StorageState = StudyStateV1;

export interface BackupData {
  exportedAt: string;
  appVersion: string;
  state: StudyStateV1;
}
