addEventListener('fetch', event => {
  event.respondWith(checkAuthHeader(event.request));
});

const presharedAuthHeaderKey = 'AUTH_HEADER';
const presharedAuthHeaderValue = 'test_key';

async function checkAuthHeader(request) {
  let psk = request.headers.get(presharedAuthHeaderKey);

  if (psk !== presharedAuthHeaderValue) {
    return new Response('Sorry, this page is not available.', {
      status: 403,
      statusText: 'Forbidden',
    });
  }

  return fetch(request);
}
