const STORAGE_KEY = 'py_study_workspace_reading_positions_v1';
const CHECKPOINT_STORAGE_KEY = 'py_study_workspace_reading_checkpoints_v2';

type ReadingPositions = Record<string, number>;

export interface ReadingCheckpoint {
  y: number;
  sectionId: string | null;
  sectionText: string | null;
  updatedAt: string | null;
}

type ReadingCheckpoints = Record<string, ReadingCheckpoint>;
type ReadingCheckpointInput = Omit<ReadingCheckpoint, 'updatedAt'> & { updatedAt?: string };

const emptyCheckpoint = (): ReadingCheckpoint => ({
  y: 0,
  sectionId: null,
  sectionText: null,
  updatedAt: null
});

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

const sanitizeOptionalText = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const sanitizeTimestamp = (value: unknown): string | null => {
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value))) return null;
  return value;
};

const sanitizeCheckpoint = (value: unknown): ReadingCheckpoint | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  if (!isValidPosition(candidate.y)) return null;

  return {
    y: candidate.y,
    sectionId: sanitizeOptionalText(candidate.sectionId),
    sectionText: sanitizeOptionalText(candidate.sectionText),
    updatedAt: sanitizeTimestamp(candidate.updatedAt)
  };
};

const readCheckpoints = (): ReadingCheckpoints => {
  if (typeof window === 'undefined' || !window.localStorage) return {};

  try {
    const raw = window.localStorage.getItem(CHECKPOINT_STORAGE_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed).flatMap(([lessonId, checkpoint]) => {
        const sanitized = sanitizeCheckpoint(checkpoint);
        return lessonId.trim().length > 0 && sanitized ? [[lessonId, sanitized]] : [];
      })
    );
  } catch {
    return {};
  }
};

const writeCheckpoints = (checkpoints: ReadingCheckpoints): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    window.localStorage.setItem(CHECKPOINT_STORAGE_KEY, JSON.stringify(checkpoints));
  } catch {
    // localStorage can be unavailable or full; reading should keep working.
  }
};

export function readReadingCheckpoint(lessonId: string): ReadingCheckpoint {
  if (!lessonId.trim()) return emptyCheckpoint();

  const checkpoint = readCheckpoints()[lessonId];
  if (checkpoint) return checkpoint;

  const legacyPosition = readPositions()[lessonId];
  return isValidPosition(legacyPosition)
    ? { ...emptyCheckpoint(), y: legacyPosition }
    : emptyCheckpoint();
}

export function writeReadingCheckpoint(
  lessonId: string,
  checkpoint: ReadingCheckpointInput
): void {
  if (!lessonId.trim() || !isValidPosition(checkpoint.y)) return;

  writeCheckpoints({
    ...readCheckpoints(),
    [lessonId]: {
      y: checkpoint.y,
      sectionId: sanitizeOptionalText(checkpoint.sectionId),
      sectionText: sanitizeOptionalText(checkpoint.sectionText),
      updatedAt: checkpoint.updatedAt === undefined
        ? new Date().toISOString()
        : sanitizeTimestamp(checkpoint.updatedAt)
    }
  });
}

export function clearReadingCheckpoint(lessonId: string): void {
  if (!lessonId.trim()) return;

  const checkpoints = readCheckpoints();
  delete checkpoints[lessonId];
  writeCheckpoints(checkpoints);

  const positions = readPositions();
  delete positions[lessonId];
  writePositions(positions);
}

export function readReadingPosition(lessonId: string): number {
  return readReadingCheckpoint(lessonId).y;
}

export function writeReadingPosition(lessonId: string, position: number): void {
  if (!lessonId.trim() || !isValidPosition(position)) return;
  writePositions({ ...readPositions(), [lessonId]: position });
}

export function clearReadingPosition(lessonId: string): void {
  clearReadingCheckpoint(lessonId);
}
