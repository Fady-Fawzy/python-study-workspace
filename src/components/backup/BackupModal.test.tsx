import React from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BackupModal } from './BackupModal';
import { StudyStateV1 } from '../../types/state';

const state: StudyStateV1 = {
  version: 1,
  completedLessons: ['020'],
  bookmarkedLessons: [],
  bookmarkedSyntax: [],
  lessonNotes: { '020': 'Remember precedence' },
  lastOpenedLessonId: '020',
  recentLessonIds: ['020'],
  theme: 'dark',
  preferredMode: 'detailed',
  updatedAt: '2026-08-25T00:00:00.000Z'
};

function BackupHarness({ onStateRestored = vi.fn() }: { onStateRestored?: (value: StudyStateV1) => void }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open backup</button>
      <BackupModal
        isOpen={open}
        onClose={() => setOpen(false)}
        state={state}
        onStateRestored={onStateRestored}
      />
    </>
  );
}

describe('BackupModal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('is a labelled dialog with clear import/export actions and initial close focus', async () => {
    const user = userEvent.setup();
    render(<BackupHarness />);
    await user.click(screen.getByRole('button', { name: /open backup/i }));
    const dialog = screen.getByRole('dialog', { name: /backup & restore study data/i });
    expect(within(dialog).getByRole('button', { name: /download json backup/i })).toBeInTheDocument();
    const close = within(dialog).getByRole('button', { name: /close backup & restore/i });
    await waitFor(() => expect(close).toHaveFocus());
  });

  it('closes with Escape, backdrop, and close; traps focus, restores focus and body scroll', async () => {
    const user = userEvent.setup();
    document.body.style.overflow = 'clip';
    render(<BackupHarness />);
    const trigger = screen.getByRole('button', { name: /open backup/i });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog');
    const close = within(dialog).getByRole('button', { name: /close backup & restore/i });
    const restore = within(dialog).getByRole('button', { name: /restore from backup file/i });
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    close.focus();
    await user.tab({ shift: true });
    expect(restore).toHaveFocus();
    restore.focus();
    await user.tab();
    expect(close).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body).toHaveStyle({ overflow: 'clip' });

    await user.click(trigger);
    await user.click(screen.getByTestId('backup-modal-backdrop'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(trigger);
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /close backup & restore/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    document.body.style.overflow = '';
  });

  it('preserves restore behavior and announces success as live status', async () => {
    const onStateRestored = vi.fn();
    const user = userEvent.setup();
    render(<BackupHarness onStateRestored={onStateRestored} />);
    await user.click(screen.getByRole('button', { name: /open backup/i }));
    const fileInput = screen.getByLabelText(/choose json backup file/i);
    const file = new File([
      JSON.stringify({ ...state, completedLessons: ['020', '021'] })
    ], 'backup.json', { type: 'application/json' });

    await user.upload(fileInput, file);
    await waitFor(() => expect(onStateRestored).toHaveBeenCalledWith(expect.objectContaining({
      completedLessons: ['020', '021']
    })));
    expect(screen.getByRole('status')).toHaveTextContent(/restored successfully/i);
  });

  it('announces invalid imports without closing the dialog', async () => {
    const user = userEvent.setup();
    render(<BackupHarness />);
    await user.click(screen.getByRole('button', { name: /open backup/i }));
    await user.upload(
      screen.getByLabelText(/choose json backup file/i),
      new File(['{ broken'], 'broken.json', { type: 'application/json' })
    );
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/json/i));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('preserves JSON download behavior', async () => {
    const user = userEvent.setup();
    const createObjectURL = vi.fn(() => 'blob:backup');
    const revokeObjectURL = vi.fn();
    const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL });
    render(<BackupHarness />);

    await user.click(screen.getByRole('button', { name: /open backup/i }));
    await user.click(screen.getByRole('button', { name: /download json backup/i }));

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(anchorClick).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:backup');
    expect(screen.getByRole('status')).toHaveTextContent(/backup downloaded successfully/i);
  });

  it('announces an export failure without closing', async () => {
    const user = userEvent.setup();
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => { throw new Error('blocked'); })
    });
    render(<BackupHarness />);
    await user.click(screen.getByRole('button', { name: /open backup/i }));

    await user.click(screen.getByRole('button', { name: /download json backup/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/could not download backup/i);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('cancels a successful-import close timer when the modal is closed and reopened', async () => {
    vi.useFakeTimers();
    class ImmediateFileReader {
      static EMPTY = 0;
      static LOADING = 1;
      static DONE = 2;
      onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
      readAsText() {
        this.onload?.({ target: { result: JSON.stringify(state) } } as unknown as ProgressEvent<FileReader>);
      }
      abort() {}
    }
    vi.stubGlobal('FileReader', ImmediateFileReader);
    render(<BackupHarness />);
    const trigger = screen.getByRole('button', { name: /open backup/i });
    fireEvent.click(trigger);
    fireEvent.change(screen.getByLabelText(/choose json backup file/i), {
      target: { files: [new File(['{}'], 'backup.json', { type: 'application/json' })] }
    });
    expect(screen.getByRole('status')).toHaveTextContent(/restored successfully/i);

    fireEvent.click(screen.getByRole('button', { name: /close backup/i }));
    fireEvent.click(trigger);
    act(() => vi.advanceTimersByTime(1300));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('ignores a stale FileReader completion after close and reopen', async () => {
    const readers: DeferredFileReader[] = [];
    class DeferredFileReader {
      static EMPTY = 0;
      static LOADING = 1;
      static DONE = 2;
      onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
      abort = vi.fn();
      constructor() { readers.push(this); }
      readAsText() {}
      emit(content: string) {
        this.onload?.({ target: { result: content } } as unknown as ProgressEvent<FileReader>);
      }
    }
    vi.stubGlobal('FileReader', DeferredFileReader);
    const onStateRestored = vi.fn();
    const user = userEvent.setup();
    render(<BackupHarness onStateRestored={onStateRestored} />);
    const trigger = screen.getByRole('button', { name: /open backup/i });
    await user.click(trigger);
    await user.upload(
      screen.getByLabelText(/choose json backup file/i),
      new File(['{}'], 'backup.json', { type: 'application/json' })
    );
    const staleReader = readers[0];

    await user.click(screen.getByRole('button', { name: /close backup/i }));
    await user.click(trigger);
    act(() => staleReader.emit(JSON.stringify({ ...state, completedLessons: ['074'] })));

    expect(onStateRestored).not.toHaveBeenCalled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
