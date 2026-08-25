import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { registerServiceWorker } from '../pwa';

describe('PWA service worker registration', () => {
  it('registers the worker on page load with the GitHub Pages base path', () => {
    const register = vi.fn(() => Promise.resolve({}));
    const addEventListener = vi.fn((_: string, listener: EventListener) => listener(new Event('load')));

    registerServiceWorker({
      isProduction: true,
      baseUrl: '/python-study-workspace/',
      serviceWorker: { register } as unknown as ServiceWorkerContainer,
      addEventListener
    });

    expect(addEventListener).toHaveBeenCalledWith('load', expect.any(Function));
    expect(register).toHaveBeenCalledWith('/python-study-workspace/sw.js', {
      scope: '/python-study-workspace/'
    });
  });

  it('does not register a worker during development', () => {
    const register = vi.fn(() => Promise.resolve({}));
    const addEventListener = vi.fn();

    registerServiceWorker({
      isProduction: false,
      serviceWorker: { register } as unknown as ServiceWorkerContainer,
      addEventListener
    });

    expect(addEventListener).not.toHaveBeenCalled();
    expect(register).not.toHaveBeenCalled();
  });

  it('ships a versioned worker that can activate an updated cache', () => {
    const worker = readFileSync(resolve(process.cwd(), 'public/sw.js'), 'utf8');

    expect(worker).toContain("CACHE_NAME = `${CACHE_PREFIX}-v2`");
    expect(worker).toContain("event.data?.type === 'SKIP_WAITING'");
    expect(worker).toContain('self.skipWaiting()');
  });
});
