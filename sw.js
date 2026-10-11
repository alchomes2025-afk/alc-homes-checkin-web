// Service worker de la web de check-in: guarda la página para poder abrirla sin conexión.
// No guarda ni intercepta nada del backend ni datos de huéspedes; solo la propia página (que no contiene datos personales).
// Estrategia: red primero (así las actualizaciones llegan al momento) y, si no hay conexión o tarda más de 6 s, la copia guardada.
const CACHE = 'alc-checkin-pagina-v1';
const CLAVE = '/';
const ESPERA_MS = 6000;

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.add(new Request(CLAVE, { cache: 'reload' })))
      .catch(() => { /* sin red al instalar: se guardará en la primera visita con conexión */ })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || req.mode !== 'navigate') return;
  if (new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(paginaConRespaldo(req));
});

async function paginaConRespaldo(req) {
  const cache = await caches.open(CACHE);
  const ruta  = new URL(req.url).pathname;
  const esPagina = ruta === '/' || ruta === '/index.html';
  const red = fetch(req).then((resp) => {
    if (resp.ok && esPagina) cache.put(CLAVE, resp.clone());
    return resp;
  });
  red.catch(() => {});   // si pierde la carrera contra el plazo, que no quede como error sin tratar
  try {
    return await Promise.race([red, new Promise((_, no) => setTimeout(no, ESPERA_MS))]);
  } catch (_) {
    const guardada = esPagina ? await cache.match(CLAVE) : null;
    return guardada || red;
  }
}
