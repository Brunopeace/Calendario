const CACHE_NAME = 'calendario-sport-v1';
// Lista de arquivos que queremos cachear para funcionar offline
const STATIC_FILES = [
  'index.html',
  'manifest.json',
  'icons/sport.png', // Substitua pelo caminho correto do seu logo
  'icons/icon-192.png',
  'icons/icon-512.png'
];

// Instalação do Service Worker e criação do cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto com sucesso!');
        return cache.addAll(STATIC_FILES);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepta requisições de rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se o arquivo estiver no cache, retorna ele.
        // Se não, faz a requisição na rede.
        return response || fetch(event.request);
      })
  );
});
