console.log("inside service worker");

const CACHE_NAME = 'static-cache-v1';

const FILES_TO_CACHE = [
  '/index.html',
  '/scripts/app-bundle.js',
  '/scripts/vendor-bundle.js',
  "/scripts/velocity-shim.js"
];

this.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

this.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});
