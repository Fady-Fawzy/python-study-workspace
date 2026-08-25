const CACHE_PREFIX = 'python-study-workspace';
const CACHE_NAME = `${CACHE_PREFIX}-v1`;
const APP_SCOPE = self.registration.scope;
const APP_SHELL = new URL('./', APP_SCOPE).href;
const PRECACHE_URLS = [
  APP_SHELL,
  new URL('manifest.webmanifest', APP_SHELL).href,
  new URL('icon.svg', APP_SHELL).href
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

function cacheResponse(request, response) {
  if (!response.ok || response.type !== 'basic') return response;

  return caches.open(CACHE_NAME)
    .then((cache) => cache.put(request, response.clone()))
    .then(() => response);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => cacheResponse(APP_SHELL, response))
        .catch(() => caches.match(APP_SHELL))
    );
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cached) => cached || fetch(request).then((response) => cacheResponse(request, response)))
  );
});
