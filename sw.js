/* Old site service worker: wipes everything the installed app saved and always shows the "we've moved" page. */
const CACHE = 'moved-v1';
const HOME = new URL('index.html', self.registration.scope).href;

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.add(HOME)).catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
    const wins = await self.clients.matchAll({ type: 'window' });
    wins.forEach(w => { try { w.navigate(w.url); } catch (_) {} });
  })());
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.mode === 'navigate') {
    e.respondWith(
      fetch(HOME, { cache: 'no-store' }).catch(() => caches.match(HOME))
    );
  }
});
