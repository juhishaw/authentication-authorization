/* eslint-disable */

const CACHE_NAME = "authapp-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/offline.html",
  "/icon-192.png",
  "/icon-512.png",
  "/static/js/bundle.js",
  "/static/js/main.chunk.js",
  "/static/js/0.chunk.js",
  "/static/css/main.css",
  "https://js.stripe.com/v3/",
];

// Install SW and cache necessary files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Caching offline assets");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Intercept fetch requests
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/offline.html"))
    );
  } else {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});

// Activate SW and clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});
