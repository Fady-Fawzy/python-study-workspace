import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TableOfContents } from './TableOfContents';

const items = [
  { id: 'clear', text: 'clear() — تفريغ نفس الـ Set', level: 2 },
  { id: 'union', text: 'union() — اتحاد المجموعات', level: 3 }
];

let intersectionCallback: IntersectionObserverCallback;

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: IntersectionObserverCallback) {
      intersectionCallback = callback;
    }
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
    takeRecords = vi.fn(() => []);
    root = null;
    rootMargin = '';
    thresholds = [];
  });
});

afterEach(() => {
  document.body.style.overflow = '';
  vi.unstubAllGlobals();
});

describe('TableOfContents', () => {
  it('opens an accessible mobile sheet, enters and traps focus, then returns focus on Escape', async () => {
    const user = userEvent.setup();
    render(<TableOfContents items={items} variant="mobile" />);

    const trigger = screen.getByRole('button', { name: /open lesson contents/i });
    expect(trigger).toHaveAttribute('data-open', 'false');
    trigger.focus();
    await user.click(trigger);
    expect(trigger).toHaveAttribute('data-open', 'true');

    const dialog = screen.getByRole('dialog', { name: /lesson contents/i });
    const close = within(dialog).getByRole('button', { name: /close lesson contents/i });
    const lastItem = within(dialog).getByRole('button', { name: /union/i });
    expect(close).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');

    lastItem.focus();
    await user.tab();
    expect(close).toHaveFocus();

    await user.tab({ shift: true });
    expect(lastItem).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('data-open', 'false');
    expect(document.body.style.overflow).toBe('');
    expect(trigger).toHaveFocus();
  });

  it('closes on backdrop interaction and restores focus', async () => {
    const user = userEvent.setup();
    render(<TableOfContents items={items} variant="mobile" />);
    const trigger = screen.getByRole('button', { name: /open lesson contents/i });

    await user.click(trigger);
    fireEvent.mouseDown(screen.getByTestId('mobile-toc-backdrop'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('marks the active section, scrolls to a selection, and closes the mobile sheet', async () => {
    const user = userEvent.setup();
    const heading = document.createElement('h2');
    heading.id = 'union';
    heading.scrollIntoView = vi.fn();
    document.body.append(heading);
    render(<TableOfContents items={items} variant="mobile" />);

    await user.click(screen.getByRole('button', { name: /open lesson contents/i }));
    const dialog = screen.getByRole('dialog', { name: /lesson contents/i });
    const firstItem = within(dialog).getByRole('button', { name: /clear/i });
    expect(firstItem).toHaveAttribute('aria-current', 'location');

    await user.click(within(dialog).getByRole('button', { name: /union/i }));

    expect(heading.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    heading.remove();
  });

  it('updates the desktop active item from observed headings', () => {
    const heading = document.createElement('h2');
    heading.id = 'union';
    document.body.append(heading);
    render(<TableOfContents items={items} variant="desktop" />);

    act(() => {
      intersectionCallback([
        { isIntersecting: true, target: heading } as unknown as IntersectionObserverEntry
      ], {} as IntersectionObserver);
    });

    expect(screen.getByRole('button', { name: /union/i })).toHaveAttribute('aria-current', 'location');
    heading.remove();
  });

  it('uses a shared controlled active section and delegates selection', async () => {
    const user = userEvent.setup();
    const onSelectItem = vi.fn();

    render(
      <TableOfContents
        items={items}
        variant="desktop"
        activeId="union"
        onSelectItem={onSelectItem}
      />
    );

    expect(screen.getByRole('button', { name: /union/i })).toHaveAttribute('aria-current', 'location');
    await user.click(screen.getByRole('button', { name: /clear/i }));

    expect(onSelectItem).toHaveBeenCalledWith(items[0]);
  });

  it('supports an externally controlled mobile sheet without rendering a duplicate trigger', () => {
    const onOpenChange = vi.fn();
    render(
      <TableOfContents
        items={items}
        variant="mobile"
        triggerMode="external"
        isOpen
        onOpenChange={onOpenChange}
      />
    );

    expect(screen.queryByRole('button', { name: /open lesson contents/i })).not.toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId('mobile-toc-backdrop'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('uses RTL rows while isolating a leading Python identifier as LTR', () => {
    render(<TableOfContents items={items} variant="desktop" />);
    const row = screen.getByRole('button', { name: /clear/i });

    expect(row).toHaveAttribute('dir', 'rtl');
    expect(row.querySelector('bdi')).toHaveAttribute('dir', 'ltr');
    expect(row.querySelector('bdi')).toHaveTextContent('clear()');
  });

  it('isolates every Latin identifier run wherever it appears in an Arabic heading', () => {
    const mixedItems = [
      { id: 'filter', text: 'تطبيق filter()', level: 2 },
      { id: 'input', text: 'input() ترجع String', level: 2 },
      { id: 'min-max', text: 'min() وmax() مع الأرقام', level: 2 }
    ];
    render(<TableOfContents items={mixedItems} variant="desktop" />);

    const expectedRuns = [
      ['filter()'],
      ['input()', 'String'],
      ['min()', 'max()']
    ];
    mixedItems.forEach((item, index) => {
      const row = screen.getByRole('button', { name: item.text });
      expect(row.textContent).toBe(item.text);
      expect(Array.from(row.querySelectorAll('bdi')).map(node => node.textContent)).toEqual(expectedRuns[index]);
      row.querySelectorAll('bdi').forEach(node => expect(node).toHaveAttribute('dir', 'ltr'));
    });
  });

  it('keeps contiguous multiword Latin phrases together while isolating separate Python identifiers', () => {
    const mixedItems = [
      { id: 'while-loop', text: 'شرح While Loop بالعربي', level: 2 },
      { id: 'packed', text: 'استخدام Packed Arguments عمليًا', level: 2 },
      { id: 'base', text: 'فهم Base Case مع filter() وmin() وmax()', level: 2 }
    ];
    render(<TableOfContents items={mixedItems} variant="desktop" />);

    const expectedRuns = [
      ['While Loop'],
      ['Packed Arguments'],
      ['Base Case', 'filter()', 'min()', 'max()']
    ];
    mixedItems.forEach((item, index) => {
      const row = screen.getByRole('button', { name: item.text });
      expect(Array.from(row.querySelectorAll('bdi')).map(node => node.textContent)).toEqual(expectedRuns[index]);
    });
  });

  it('uses instant scrolling when reduced motion is preferred', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    const heading = document.createElement('h2');
    heading.id = 'clear';
    heading.scrollIntoView = vi.fn();
    document.body.append(heading);
    render(<TableOfContents items={items} variant="desktop" />);

    await user.click(screen.getByRole('button', { name: /clear/i }));

    expect(heading.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
    heading.remove();
  });
});
