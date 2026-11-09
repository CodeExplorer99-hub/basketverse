/* generato da tools/build.mjs */
const CACHE = "basketverse-vmw9u8flx";
const ASSETS = [
  "./index.html",
  "./vendor/three.min.js",
  "./manifest.webmanifest",
  "./icon/icon-64.png",
  "./icon/icon-192.png",
  "./icon/icon-256.png",
  "./icon/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  // Le Range request (audio/video streaming) richiedono 206 Partial Content:
  // il cache API restituisce 200 intero, Chrome puo' rifiutare di riprodurre.
  // Le passiamo direttamente alla rete cosi' il server risponde correttamente.
  if (e.request.headers.get("range")) return;
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
});
