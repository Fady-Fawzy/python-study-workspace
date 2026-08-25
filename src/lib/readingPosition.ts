const STORAGE_KEY = 'py_study_workspace_reading_positions_v1';

type ReadingPositions = Record<string, number>;

const isValidPosition = (value: unknown): value is number => (
  typeof value === 'number' && Number.isFinite(value) && value >= 0
);

const readPositions = (): ReadingPositions => {
  if (typeof window === 'undefined' || !window.localStorage) return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed).filter(([lessonId, position]) => (
        lessonId.trim().length > 0 && isValidPosition(position)
      ))
    );
  } catch {
    return {};
  }
};

const writePositions = (positions: ReadingPositions): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // localStorage can be unavailable or full; reading should keep working.
  }
};

export function readReadingPosition(lessonId: string): number {
  if (!lessonId.trim()) return 0;
  const position = readPositions()[lessonId];
  return isValidPosition(position) ? position : 0;
}

export function writeReadingPosition(lessonId: string, position: number): void {
  if (!lessonId.trim() || !isValidPosition(position)) return;
  writePositions({ ...readPositions(), [lessonId]: position });
}

export function clearReadingPosition(lessonId: string): void {
  if (!lessonId.trim()) return;
  const positions = readPositions();
  delete positions[lessonId];
  writePositions(positions);
}
