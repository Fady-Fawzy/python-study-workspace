import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('uses a light or dark icon for legacy system state instead of exposing a monitor control', async () => {
    const user = userEvent.setup();
    const onThemeChange = vi.fn();
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));

    render(<ThemeToggle theme="system" onThemeChange={onThemeChange} />);

    const toggle = screen.getByRole('button', { name: 'Theme: Light' });
    expect(toggle.querySelector('.lucide-monitor')).not.toBeInTheDocument();
    expect(toggle.querySelector('.lucide-sun')).toBeInTheDocument();

    await user.click(toggle);
    expect(onThemeChange).toHaveBeenCalledWith('dark');
  });
});
