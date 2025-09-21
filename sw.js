const CACHE = "ug-estimator-v7-6-54";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE && caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.mode === "navigate") {
    // SPA-style navigation fallback to index
    e.respondWith(fetch(req).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});
