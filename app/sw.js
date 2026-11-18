const CACHE = 'chordpad-v3'
const SHELL = ['./', 'index.html', 'manifest.webmanifest']

async function precache() {
  const cache = await caches.open(CACHE)
  await cache.addAll(SHELL)
  // The entry JS/CSS were fetched before this worker existed; read the built HTML and cache them
  // now, so the very first offline reload works.
  const html = await (await fetch('index.html')).text()
  const urls = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((url) => !url.startsWith('data:') && !url.startsWith('http'))
    .map((url) => new URL(url, self.location).href)
  await cache.addAll(urls)
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  if (new URL(request.url).origin !== self.location.origin) return

  // Navigations go to the network first so a new build's hashed assets are picked up;
  // the cache is only the offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => caches.match('index.html'))
    )
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => cached || caches.match('index.html'))
      return cached || network
    })
  )
})
