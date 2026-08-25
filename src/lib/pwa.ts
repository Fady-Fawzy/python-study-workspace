export interface ServiceWorkerRegistrationOptions {
  isProduction?: boolean;
  baseUrl?: string;
  serviceWorker?: ServiceWorkerContainer;
  addEventListener?: (type: string, listener: EventListener) => void;
}

function getBrowserServiceWorker(): ServiceWorkerContainer | undefined {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return undefined;
  }

  return navigator.serviceWorker;
}

/**
 * Registers the static-site worker only in production. The options keep the
 * browser boundary injectable so the registration contract can be tested
 * without starting a real worker in jsdom.
 */
export function registerServiceWorker(options: ServiceWorkerRegistrationOptions = {}): void {
  const isProduction = options.isProduction ?? import.meta.env.PROD;
  const serviceWorker = options.serviceWorker ?? getBrowserServiceWorker();

  if (!isProduction || !serviceWorker) return;

  const baseUrl = options.baseUrl ?? import.meta.env.BASE_URL;
  const addEventListener = options.addEventListener
    ?? ((type: string, listener: EventListener) => window.addEventListener(type, listener));

  addEventListener('load', () => {
    void serviceWorker.register(`${baseUrl}sw.js`, { scope: baseUrl }).catch((error: unknown) => {
      console.warn('Offline mode could not be enabled:', error);
    });
  });
}
