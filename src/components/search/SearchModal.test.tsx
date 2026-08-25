import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchModal } from './SearchModal';
import { IndexedItem } from '../../lib/searchIndex';

const index: IndexedItem[] = [
  {
    id: 'lesson-020',
    type: 'lesson',
    title: 'Lesson 020: A deliberately long Arithmetic Operators title that must wrap on narrow screens',
    subtitle: 'Operators & Expressions with a deliberately long category name',
    lessonNumber: 20,
    url: '/lesson/020',
    badge: 'Lesson 020',
    keywords: ['operator', 'arithmetic'],
    content: 'operator arithmetic',
    exactTerms: ['operator', '020']
  },
  {
    id: 'method-021-operator',
    type: 'method',
    title: 'operator()',
    subtitle: 'In Lesson 021',
    lessonNumber: 21,
    url: '/lesson/021',
    badge: 'Method',
    keywords: ['operator'],
    content: 'operator method',
    exactTerms: ['operator', 'operator()']
  },
  {
    id: 'syntax-1',
    type: 'syntax',
    title: 'Operator syntax',
    subtitle: 'Syntax Reference',
    syntaxSectionId: 1,
    url: '/reference?section=1',
    badge: 'Syntax',
    keywords: ['operator'],
    content: 'operator syntax',
    exactTerms: ['operator']
  }
];

function SearchHarness({
  onSelectResult = vi.fn(),
  commands = []
}: {
  onSelectResult?: (url: string) => void;
  commands?: Array<{
    id: string;
    label: string;
    description: string;
    keywords?: string[];
    onSelect: () => void;
  }>;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open search</button>
      <SearchModal
        isOpen={open}
        onClose={() => setOpen(false)}
        index={index}
        onSelectResult={onSelectResult}
        commands={commands}
      />
    </>
  );
}

describe('SearchModal', () => {
  it('is a labelled dialog with a labelled searchbox, ordinary results list, and clear action', async () => {
    const user = userEvent.setup();
    render(<SearchHarness />);
    await user.click(screen.getByRole('button', { name: /open search/i }));

    const dialog = screen.getByRole('dialog', { name: /search python study workspace/i });
    const input = within(dialog).getByRole('searchbox', { name: /search lessons, syntax, and methods/i });
    await waitFor(() => expect(input).toHaveFocus());
    expect(input).toHaveAttribute('aria-controls', 'global-search-results');
    expect(input).not.toHaveAttribute('aria-activedescendant');

    await user.type(input, 'operator');
    const resultsList = within(dialog).getByRole('list', { name: /search results/i });
    expect(resultsList).toHaveAttribute('id', 'global-search-results');
    expect(within(dialog).getAllByRole('button', { name: /open search result/i })).toHaveLength(3);
    expect(within(dialog).getByRole('button', { name: /clear search/i })).toBeInTheDocument();
  });

  it('closes with Escape, backdrop, and its explicit close action, then returns focus and restores body lock', async () => {
    const user = userEvent.setup();
    document.body.style.overflow = 'clip';
    render(<SearchHarness />);
    const trigger = screen.getByRole('button', { name: /open search/i });

    await user.click(trigger);
    expect(document.body).toHaveStyle({ overflow: 'hidden' });
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body).toHaveStyle({ overflow: 'clip' });

    await user.click(trigger);
    await user.click(screen.getByTestId('search-modal-backdrop'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(trigger);
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /close search/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    document.body.style.overflow = '';
  });

  it('traps focus and wraps keyboard result selection before activating with Enter', async () => {
    const onSelectResult = vi.fn();
    const user = userEvent.setup();
    render(<SearchHarness onSelectResult={onSelectResult} />);
    await user.click(screen.getByRole('button', { name: /open search/i }));
    const dialog = screen.getByRole('dialog');
    const input = within(dialog).getByRole('searchbox');
    await user.type(input, 'operator');

    const resultButtons = within(dialog).getAllByRole('button', { name: /open search result/i });
    const lastResult = resultButtons[resultButtons.length - 1];
    lastResult.focus();
    await user.tab();
    expect(input).toHaveFocus();
    input.focus();
    await user.tab({ shift: true });
    expect(lastResult).toHaveFocus();

    input.focus();
    await user.keyboard('{ArrowUp}{Enter}');
    expect(onSelectResult).toHaveBeenCalledWith('/lesson/020');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('wraps ArrowDown selection and resets its query each time it opens', async () => {
    const onSelectResult = vi.fn();
    const user = userEvent.setup();
    render(<SearchHarness onSelectResult={onSelectResult} />);
    const trigger = screen.getByRole('button', { name: /open search/i });
    await user.click(trigger);
    const input = screen.getByRole('searchbox');
    await user.type(input, 'operator');
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');
    expect(onSelectResult).toHaveBeenCalledWith('/lesson/021');

    await user.click(trigger);
    expect(screen.getByRole('searchbox')).toHaveValue('');
  });

  it('keeps the keyboard-selected result visible in the scrolling results region', async () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView
    });
    const user = userEvent.setup();
    render(<SearchHarness />);
    await user.click(screen.getByRole('button', { name: /open search/i }));
    await user.type(screen.getByRole('searchbox'), 'operator');
    scrollIntoView.mockClear();

    await user.keyboard('{ArrowDown}');

    await waitFor(() => expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' }));
  });

  it('shows quick actions in the empty palette and runs a command', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <SearchHarness
        commands={[{
          id: 'syntax',
          label: 'Syntax Reference',
          description: 'Browse Python syntax by topic.',
          keywords: ['reference', 'docs'],
          onSelect
        }]}
      />
    );

    await user.click(screen.getByRole('button', { name: /open search/i }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: /quick actions/i })).toBeInTheDocument();
    const command = within(dialog).getByRole('button', { name: /run command: syntax reference/i });
    expect(command).toHaveAttribute('data-command-id', 'syntax');

    await user.click(command);
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('filters commands alongside search when a command keyword is typed', async () => {
    const user = userEvent.setup();
    render(
      <SearchHarness
        commands={[
          { id: 'notes', label: 'Notes', description: 'Open saved notes.', keywords: ['writing'], onSelect: vi.fn() },
          { id: 'backup', label: 'Backup & Restore', description: 'Export or restore progress.', keywords: ['data'], onSelect: vi.fn() }
        ]}
      />
    );

    await user.click(screen.getByRole('button', { name: /open search/i }));
    await user.type(screen.getByRole('searchbox'), 'backup');
    expect(screen.getByRole('button', { name: /run command: backup & restore/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /run command: notes/i })).not.toBeInTheDocument();
  });
});
