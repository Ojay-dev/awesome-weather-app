const cacheName = 'v3';
const cacheAssets = [
	'index.html',
	'css/style.css',
	'svg/atmospheric.svg',
	'svg/cloud.svg',
	'svg/rain.svg',
	'svg/sun.svg',
	'js/script.js',
	'js/helperFunctions.js',
];

self.addEventListener('install', (event) => {
	console.log('Attempting to install service worker');

	event.waitUntil(
		caches
			.open(cacheName)
			.then((cache) => {
				console.log('Service Worker: Caching Files');
				cache.addAll(cacheAssets);
			})
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	console.log('Attempting to activate service worker');

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

self.addEventListener('fetch', (event) => {
	console.log('Fetch event for ', event.request.url);
	event.respondWith(
		// fetch(event.request).catch(() => caches.match(event.request))
		caches
			.match(event.request)
			.then((response) => {
				if (response) {
					console.log('Found ', event.request.url, ' in cache');
					return response;
				}
				console.log('Network request for ', event.request.url);
				return fetch(event.request).then((response) => {
					// if (response.status === 404) {
					//   return caches.match('pages/404.html');
					// }
					return caches.open(cacheName).then((cache) => {
						cache.put(event.request.url, response.clone());
						return response;
					});
				});
			})
			.catch((error) => {
				console.log('Error, ', error);
				return caches.match('pages/offline.html');
			})
	);
});
