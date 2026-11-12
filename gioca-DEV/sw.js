/* generato da tools/build.mjs */
const CACHE = "basketverse-dev-vmwe3lf6x";
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
    .then((ks) => Promise.all(ks.filter((k) => k !== CACHE && k.startsWith("basketverse-dev-")).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  // Le Range request (audio/video streaming) richiedono 206 Partial Content:
  // il cache API restituisce 200 intero, Chrome puo' rifiutare di riprodurre.
  // Le passiamo direttamente alla rete cosi' il server risponde correttamente.
  if (e.request.headers.get("range")) return;
  // La PAGINA DEL GIOCO (index.html) va presa PRIMA DALLA RETE: con la cache
  // davanti, dopo ogni aggiornamento del sito il telefono apriva ancora la
  // versione vecchia e quella nuova arrivava solo all'apertura successiva.
  // Senza rete (offline) si ripiega sulla copia in cache.
  const url = new URL(e.request.url);
  const isPage = e.request.mode === "navigate" || url.pathname.endsWith("/index.html");
  if (isPage) {
    e.respondWith(fetch(e.request.url, { cache: "no-cache" })
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put("./index.html", copy)); }
        return res;
      })
      .catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
});
