const CACHE_NAME = 'controle-turmas-v3';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Falha no cache:', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado');
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna do cache ou faz fetch da rede
        return response || fetch(event.request);
      })
  );
});
