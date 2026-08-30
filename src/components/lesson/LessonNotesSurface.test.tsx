import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { closeTransientOverlays } from '../../lib/overlayEvents';
import { LessonNotesSurface } from './LessonNotesSurface';

function stubDesktop(matches: boolean) {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  }));
}

afterEach(() => {
  document.body.style.overflow = '';
  vi.unstubAllGlobals();
});

describe('LessonNotesSurface', () => {
  it('is a non-modal complementary panel on wide desktops', () => {
    stubDesktop(true);
    render(
      <LessonNotesSurface
        isOpen
        onClose={vi.fn()}
        lessonId="020"
        initialNote="desktop note"
        onSaveNote={vi.fn()}
      />
    );

    expect(screen.getByRole('complementary', { name: /personal study notes/i })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getAllByRole('textbox', { name: /personal study notes/i })).toHaveLength(1);
    expect(document.body.style.overflow).toBe('');
  });

  it('opens an accessible mobile sheet, traps focus, and restores focus on Escape', async () => {
    stubDesktop(false);
    const user = userEvent.setup();
    const onClose = vi.fn();
    const returnFocusRef = createRef<HTMLButtonElement>();
    const { rerender } = render(
      <>
        <button ref={returnFocusRef}>Notes trigger</button>
        <LessonNotesSurface
          isOpen
          onClose={onClose}
          lessonId="020"
          initialNote=""
          onSaveNote={vi.fn()}
          returnFocusRef={returnFocusRef}
        />
      </>
    );

    const dialog = screen.getByRole('dialog', { name: /personal study notes/i });
    const close = within(dialog).getByRole('button', { name: /close personal study notes/i });
    const textarea = within(dialog).getByRole('textbox');
    expect(close).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');

    textarea.focus();
    await user.tab();
    expect(close).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(<button ref={returnFocusRef}>Notes trigger</button>);
    expect(returnFocusRef.current).toHaveFocus();
    expect(document.body.style.overflow).toBe('');
  });

  it('closes on backdrop and when another transient overlay opens', () => {
    stubDesktop(false);
    const onClose = vi.fn();
    const { rerender } = render(
      <LessonNotesSurface
        isOpen
        onClose={onClose}
        lessonId="020"
        initialNote=""
        onSaveNote={vi.fn()}
      />
    );

    fireEvent.mouseDown(screen.getByTestId('lesson-notes-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <LessonNotesSurface
        isOpen
        onClose={onClose}
        lessonId="020"
        initialNote=""
        onSaveNote={vi.fn()}
      />
    );
    closeTransientOverlays();
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('renders nothing while closed', () => {
    stubDesktop(false);
    render(
      <LessonNotesSurface
        isOpen={false}
        onClose={vi.fn()}
        lessonId="020"
        initialNote=""
        onSaveNote={vi.fn()}
      />
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
