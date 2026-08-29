import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CodeBlock } from './CodeBlock';

describe('CodeBlock', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('exposes a technical-notebook copy state on the code example region', () => {
    render(<CodeBlock code={'value = 20'} language="python" />);

    expect(screen.getByRole('region', { name: 'Python code example' }))
      .toHaveAttribute('data-copy-state', 'idle');
  });

  it('copies the exact source and resets accessible feedback after two seconds', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    });
    const code = 'for item in values:\n    print(item)  \n';
    render(<CodeBlock code={code} language="python" />);

    const copy = screen.getByRole('button', { name: 'Copy Python code' });
    await act(async () => {
      fireEvent.click(copy);
      await Promise.resolve();
    });

    expect(writeText).toHaveBeenCalledWith(code);
    expect(screen.getByRole('button', { name: 'Copied Python code' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Code copied to clipboard');

    act(() => vi.advanceTimersByTime(1999));
    expect(screen.getByRole('button', { name: 'Copied Python code' })).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole('button', { name: 'Copy Python code' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('keeps source code isolated LTR and labels the region', () => {
    render(<CodeBlock code={'name = "فادي"'} language="python" title="مثال" />);

    const region = screen.getByRole('region', { name: 'مثال (python)' });
    expect(region).toHaveAttribute('dir', 'ltr');
    expect(region.querySelector('pre')).toHaveAttribute('dir', 'ltr');
    expect(region.querySelector('code')).toHaveAttribute('dir', 'ltr');
  });
});
