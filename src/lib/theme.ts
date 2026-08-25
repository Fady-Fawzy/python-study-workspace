export type ThemePreference = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

const THEME_COLORS: Record<ResolvedTheme, string> = {
  dark: '#090d14',
  light: '#f8fafc'
};

export function resolveTheme(preference: ThemePreference, prefersDark: boolean): ResolvedTheme {
  if (preference === 'system') return prefersDark ? 'dark' : 'light';
  return preference;
}

export function themeColorFor(theme: ResolvedTheme): string {
  return THEME_COLORS[theme];
}

export function applyThemePreference(
  preference: ThemePreference,
  documentRef: Document | undefined = typeof document === 'undefined' ? undefined : document,
  prefersDark = false
): ResolvedTheme {
  const activeTheme = resolveTheme(preference, prefersDark);
  if (!documentRef) return activeTheme;

  documentRef.documentElement.setAttribute('data-theme', activeTheme);
  let themeMeta = documentRef.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!themeMeta) {
    themeMeta = documentRef.createElement('meta');
    themeMeta.name = 'theme-color';
    documentRef.head.appendChild(themeMeta);
  }
  themeMeta.content = themeColorFor(activeTheme);
  return activeTheme;
}
