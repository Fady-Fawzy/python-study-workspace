import { describe, expect, it } from 'vitest';
import { applyThemePreference, resolveTheme, themeColorFor } from './theme';

describe('theme helpers', () => {
  it('resolves an explicit preference and follows the system for auto mode', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });

  it('applies the theme and synchronizes browser chrome metadata', () => {
    document.documentElement.removeAttribute('data-theme');
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    meta?.remove();

    expect(applyThemePreference('light', document, false)).toBe('light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.content)
      .toBe(themeColorFor('light'));

    expect(applyThemePreference('dark', document, false)).toBe('dark');
    expect(document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.content)
      .toBe(themeColorFor('dark'));
  });
});
