const cacheName = "v2";

self.addEventListener("install", (event) => {
  console.log("Attempting to install service worker");

});

self.addEventListener("activate", (event) => {
  console.log("Attempting to activate service worker");

  const cacheAllowlist = [cacheName];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cacheAllowlist.indexOf(cache) === -1) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});


self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request)
      .then(response => {
        // if (response.status === 404) {
        //   return caches.match('pages/404.html');
        // }
        return caches.open(cacheName)
        .then(cache => {
          cache.put(event.request.url, response.clone());
          return response;
        });
      });
    }).catch(error => {
      console.log('Error, ', error);
      return caches.match('pages/offline.html');
    })
  );
});