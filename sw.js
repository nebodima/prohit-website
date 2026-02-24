const CACHE = 'prohit-v1';
const PRECACHE = [
  '/',
  '/index.html',
  '/setlist_2026.html',
  '/about.html',
  '/chords_cover.html',
  '/flyer.html',
  '/custom.css',
  '/site.css',
  '/template.css',
  '/fa/all.min.css',
  '/jquery.min.js',
  '/bootstrap-es5.min.js',
  '/megamenu.js',
  '/favicon.svg',
  '/ico/icon-192.png',
  '/ico/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (!resp || resp.status !== 200 || resp.type === 'opaque') return resp;
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return resp;
      });
    })
  );
});
