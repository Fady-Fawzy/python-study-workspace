export type RouteInfo =
  | { view: 'dashboard' }
  | { view: 'lesson'; lessonId: string }
  | { view: 'reference'; sectionId: number | null }
  | { view: 'bookmarks' }
  | { view: 'notes' };

export function normalizePath(pathOrHash: string): string {
  const clean = pathOrHash.replace(/^#/, '');
  if (!clean || clean === '/') return '/';
  return clean.startsWith('/') ? clean : `/${clean}`;
}

export function parseRoute(pathOrHash: string): RouteInfo {
  const normalized = normalizePath(pathOrHash);

  const lessonMatch = normalized.match(/^\/lesson\/(\d{3})/);
  if (lessonMatch) {
    return { view: 'lesson', lessonId: lessonMatch[1] };
  }

  if (normalized.startsWith('/reference')) {
    const sectionMatch = normalized.match(/[?&]section=(\d+)/);
    const sectionId = sectionMatch ? parseInt(sectionMatch[1], 10) : null;
    return { view: 'reference', sectionId };
  }

  if (normalized === '/bookmarks') {
    return { view: 'bookmarks' };
  }

  if (normalized === '/notes') {
    return { view: 'notes' };
  }

  return { view: 'dashboard' };
}
