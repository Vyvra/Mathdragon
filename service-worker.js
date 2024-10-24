// PWA settings
const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/Mathdragon/index.html',
  //Mathdragon/styes.css',
  // 'MathDragon/game.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});