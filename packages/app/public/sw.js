const CACHE_VERSION = 'v1';
const PAGES_CACHE = `ct-pages-${CACHE_VERSION}`;
const ASSETS_CACHE = `ct-assets-${CACHE_VERSION}`;
const IMAGES_CACHE = `ct-images-${CACHE_VERSION}`;
const OFFLINE_IMAGES_CACHE = 'ct-offline-images';

const CURRENT_CACHES = [
  PAGES_CACHE,
  ASSETS_CACHE,
  IMAGES_CACHE,
  OFFLINE_IMAGES_CACHE,
];

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !CURRENT_CACHES.includes(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function handleNavigate(request) {
  const pagesCache = await caches.open(PAGES_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) pagesCache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await pagesCache.match(request);
    if (cached) return cached;
    const shell = await pagesCache.match('/');
    if (shell) return shell;
    throw err;
  }
}

async function handleStaticAsset(request) {
  const cache = await caches.open(ASSETS_CACHE);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);
  return cached || (await networkFetch) || Response.error();
}

async function handleImage(request) {
  const offlineCache = await caches.open(OFFLINE_IMAGES_CACHE);
  const savedOffline = await offlineCache.match(request);
  if (savedOffline) return savedOffline;

  const cache = await caches.open(IMAGES_CACHE);
  const cached = await cache.match(request);
  if (cached) {
    fetch(request)
      .then((response) => cache.put(request, response.clone()))
      .catch(() => {});
    return cached;
  }

  const response = await fetch(request);
  cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigate(request));
    return;
  }

  if (request.destination === 'image') {
    event.respondWith(handleImage(request));
    return;
  }

  if (['script', 'style', 'font'].includes(request.destination)) {
    event.respondWith(handleStaticAsset(request));
  }
});
