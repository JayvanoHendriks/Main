const OFFLINE_VERSION = 1
const CACHE_NAME = 'pokedex-offline'
const OFFLINE_URL = 'offline.html'

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(`${CACHE_NAME}-v${OFFLINE_VERSION}`)
      await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }))
    })(),
  )

  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable()
      }

      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse

          if (preloadResponse) {
            return preloadResponse
          }

          return await fetch(event.request)
        } catch {
          const cache = await caches.open(`${CACHE_NAME}-v${OFFLINE_VERSION}`)
          return cache.match(OFFLINE_URL)
        }
      })(),
    )
  }
})
