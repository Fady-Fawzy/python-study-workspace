import { render, screen, waitFor, within } from '@testing-library/react';
import type React from 'react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppShell } from './AppShell';
import { Lesson } from '../../types/content';
import { StudyStateV1 } from '../../types/state';
import { TableOfContents } from '../lesson/TableOfContents';

const lessons: Lesson[] = [
  {
    id: '020',
    number: 20,
    title: 'Arithmetic Operators',
    category: 'Operators & Expressions',
    rawMarkdown: '',
    parsedSections: [],
    toc: [],
    methods: [],
    quickReviewSectionIds: []
  },
  {
    id: '074',
    number: 74,
    title: 'Reduce Function',
    category: 'Built-In & Functional Tools',
    rawMarkdown: '',
    parsedSections: [],
    toc: [],
    methods: ['reduce'],
    quickReviewSectionIds: []
  }
];

const state: StudyStateV1 = {
  version: 1,
  completedLessons: ['020'],
  bookmarkedLessons: ['020'],
  bookmarkedSyntax: [],
  lessonNotes: {},
  lastOpenedLessonId: '020',
  recentLessonIds: ['020'],
  theme: 'dark',
  preferredMode: 'detailed',
  updatedAt: '2026-08-25T00:00:00.000Z'
};

const searchIndex = [
  {
    id: 'lesson-020',
    type: 'lesson' as const,
    title: 'Lesson 020: Arithmetic Operators',
    subtitle: 'Operators & Expressions',
    lessonNumber: 20,
    url: '/lesson/020',
    badge: 'Lesson 020',
    keywords: ['arithmetic operators'],
    content: 'addition subtraction multiplication',
    exactTerms: ['20', '020']
  }
];

function renderShell(path = '/lesson/020', children: React.ReactNode = <p>Lesson content</p>) {
  const onNavigate = vi.fn();
  const getShell = (nextPath: string) => (
    <AppShell
      currentPath={nextPath}
      lessons={lessons}
      syntaxSections={[]}
      searchIndex={searchIndex}
      state={state}
      activeLessonId={nextPath.startsWith('/lesson/') ? nextPath.slice('/lesson/'.length) : null}
      onNavigate={onNavigate}
      onUpdateState={vi.fn()}
      onThemeChange={vi.fn()}
    >
      {children}
    </AppShell>
  );
  const view = render(getShell(path));
  return { onNavigate, rerenderPath: (nextPath: string) => view.rerender(getShell(nextPath)) };
}

describe('application shell navigation', () => {
  it('exposes drawer state and marks Study active on lesson routes', async () => {
    const user = userEvent.setup();
    renderShell();

    const menu = screen.getByRole('button', { name: /open lessons navigation/i });
    expect(menu).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog', { name: /python navigation/i })).not.toBeInTheDocument();

    await user.click(menu);
    expect(menu).toHaveAttribute('aria-expanded', 'true');

    const drawer = screen.getByRole('dialog', { name: /python navigation/i });
    expect(within(drawer).getByRole('button', { name: 'Study Home' })).toHaveAttribute('aria-current', 'page');
    expect(within(screen.getByRole('navigation', { name: /^primary navigation$/i })).getByRole('button', { name: 'Study' }))
      .toHaveAttribute('aria-current', 'page');
    expect(within(drawer).getByRole('button', { name: /operators & expressions/i })).toHaveAttribute('aria-expanded', 'true');
    expect(within(drawer).getByRole('button', { name: /close navigation drawer/i })).toHaveFocus();
  });

  it('traps focus, closes with Escape, restores focus and restores body scroll', async () => {
    const user = userEvent.setup();
    document.body.style.overflow = 'clip';
    renderShell();

    const menu = screen.getByRole('button', { name: /open lessons navigation/i });
    await user.click(menu);
    const drawer = screen.getByRole('dialog', { name: /python navigation/i });
    const close = within(drawer).getByRole('button', { name: /close navigation drawer/i });
    const lastFocusable = within(drawer).getByRole('button', { name: /lesson 074/i });
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    close.focus();
    await user.tab({ shift: true });
    expect(lastFocusable).toHaveFocus();

    lastFocusable.focus();
    await user.tab();
    expect(close).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: /python navigation/i })).not.toBeInTheDocument();
    expect(menu).toHaveFocus();
    expect(document.body).toHaveStyle({ overflow: 'clip' });
    document.body.style.overflow = '';
  });

  it('closes on backdrop, close control, navigation and lesson selection', async () => {
    const user = userEvent.setup();
    const { onNavigate } = renderShell();
    const menu = screen.getByRole('button', { name: /open lessons navigation/i });

    await user.click(menu);
    await user.click(screen.getByTestId('mobile-drawer-backdrop'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(menu);
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /close navigation drawer/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(menu);
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Syntax Reference' }));
    expect(onNavigate).toHaveBeenLastCalledWith('/reference');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(menu);
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /lesson 020/i }));
    expect(onNavigate).toHaveBeenLastCalledWith('/lesson/020');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps search and theme controls accessible and opens backup from the drawer', async () => {
    const user = userEvent.setup();
    renderShell();

    expect(screen.getByRole('button', { name: /global search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /theme: dark/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /python study home/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /open lessons navigation/i }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /backup & restore/i }));
    expect(screen.queryByRole('dialog', { name: /python navigation/i })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /backup & restore study data/i })).toBeInTheDocument();
  });

  it.each([
    { chord: '{Control>}k{/Control}', label: 'Ctrl+K' },
    { chord: '{Meta>}k{/Meta}', label: 'Cmd+K' }
  ])('opens and toggles global search with $label', async ({ chord }) => {
    const user = userEvent.setup();
    renderShell();

    await user.keyboard(chord);
    expect(screen.getByRole('dialog', { name: /search python study workspace/i })).toBeInTheDocument();

    await user.keyboard(chord);
    expect(screen.queryByRole('dialog', { name: /search python study workspace/i })).not.toBeInTheDocument();
  });

  it('switches drawer, backup, and search overlays without unlocking the page or stacking dialogs', async () => {
    const user = userEvent.setup();
    document.body.style.overflow = 'clip';
    renderShell();

    await user.click(screen.getByRole('button', { name: /open lessons navigation/i }));
    expect(screen.getByRole('dialog', { name: /python navigation/i })).toBeInTheDocument();
    await user.keyboard('{Control>}k{/Control}');
    expect(screen.queryByRole('dialog', { name: /python navigation/i })).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: /search python study workspace/i })).toBeInTheDocument();
    await waitFor(() => expect(within(
      screen.getByRole('dialog', { name: /search python study workspace/i })
    ).getByRole('searchbox')).toHaveFocus());
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    await user.click(screen.getByRole('button', { name: /backup & restore data/i }));
    expect(screen.queryByRole('dialog', { name: /search python study workspace/i })).not.toBeInTheDocument();
    const backup = screen.getByRole('dialog', { name: /backup & restore study data/i });
    await waitFor(() => expect(within(backup).getByRole('button', { name: /close backup/i })).toHaveFocus());
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    await user.keyboard('{Meta>}k{/Meta}');
    expect(screen.queryByRole('dialog', { name: /backup & restore study data/i })).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: /search python study workspace/i })).toBeInTheDocument();
    await waitFor(() => expect(within(
      screen.getByRole('dialog', { name: /search python study workspace/i })
    ).getByRole('searchbox')).toHaveFocus());
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body).toHaveStyle({ overflow: 'clip' });
    document.body.style.overflow = '';
  });

  it('hands off an open mobile lesson contents sheet to global search without stacking dialogs', async () => {
    const user = userEvent.setup();
    document.body.style.overflow = 'clip';
    renderShell('/lesson/020', (
      <TableOfContents
        variant="mobile"
        items={[
          { id: 'first-section', text: 'First section', level: 2 },
          { id: 'second-section', text: 'Second section', level: 2 }
        ]}
      />
    ));

    await user.click(screen.getByRole('button', { name: /open lesson contents/i }));
    expect(screen.getAllByRole('dialog')).toHaveLength(1);

    await user.keyboard('{Control>}k{/Control}');

    const search = screen.getByRole('dialog', { name: /search python study workspace/i });
    expect(screen.getAllByRole('dialog')).toEqual([search]);
    await waitFor(() => expect(within(search).getByRole('searchbox')).toHaveFocus());
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body).toHaveStyle({ overflow: 'clip' });
    document.body.style.overflow = '';
  });

  it('announces compact no-results feedback in desktop and mobile lesson filters', async () => {
    const user = userEvent.setup();
    renderShell();

    const sidebar = screen.getByRole('complementary', { name: /lesson navigation/i });
    await user.type(within(sidebar).getByRole('searchbox', { name: /filter lessons/i }), 'no-such-lesson');
    expect(within(sidebar).getByRole('status')).toHaveTextContent(/no lessons match/i);

    await user.click(screen.getByRole('button', { name: /open lessons navigation/i }));
    const drawer = screen.getByRole('dialog', { name: /python navigation/i });
    await user.type(within(drawer).getByRole('searchbox', { name: /search lessons/i }), 'no-such-lesson');
    expect(within(drawer).getByRole('status')).toHaveTextContent(/no lessons match/i);
  });

  it('reveals and scrolls to a newly active late lesson in drawer and sidebar', async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoView;
    const { rerenderPath } = renderShell('/lesson/074');

    const sidebar = screen.getByRole('complementary', { name: /lesson navigation/i });
    const sidebarLateCategory = within(sidebar).getByRole('button', { name: /built-in & functional tools/i });
    await user.click(sidebarLateCategory);
    expect(sidebarLateCategory).toHaveAttribute('aria-expanded', 'false');

    await user.click(screen.getByRole('button', { name: /open lessons navigation/i }));
    const drawer = screen.getByRole('dialog', { name: /python navigation/i });
    const drawerLateCategory = within(drawer).getByRole('button', { name: /built-in & functional tools/i });
    await user.click(drawerLateCategory);
    expect(drawerLateCategory).toHaveAttribute('aria-expanded', 'false');
    await user.click(within(drawer).getByRole('button', { name: /close navigation drawer/i }));

    scrollIntoView.mockClear();
    rerenderPath('/lesson/020');
    rerenderPath('/lesson/074');

    await waitFor(() => expect(sidebarLateCategory).toHaveAttribute('aria-expanded', 'true'));
    expect(within(sidebar).getByRole('button', { name: /lesson 074/i })).toHaveAttribute('aria-current', 'page');

    await user.click(screen.getByRole('button', { name: /open lessons navigation/i }));
    const reopenedDrawer = screen.getByRole('dialog', { name: /python navigation/i });
    await waitFor(() => {
      expect(within(reopenedDrawer).getByRole('button', { name: /built-in & functional tools/i }))
        .toHaveAttribute('aria-expanded', 'true');
    });
    expect(within(reopenedDrawer).getByRole('button', { name: /lesson 074/i })).toHaveAttribute('aria-current', 'page');
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
  });
});
