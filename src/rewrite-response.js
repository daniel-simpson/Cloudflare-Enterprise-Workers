addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

const replacementPairs = [
  {
    search: 'Mozilla/5.0',
    replace: 'TEST',
  },
];

async function handleRequest(request) {
  const response = await fetch(request);

  if (replacementPairs == null || replacementPairs.length == 0) {
    // Nothing to replace.
    return response;
  }

  var isRewritableMimeType = checkForRewriteableMimeType(response);
  if (!isRewritableMimeType) {
    return response;
  }

  /* Note: We DO need to await the text response here.  Usually we return directly with
   * a streaming response, but as we need to run text replacement on the response's text
   * we are forced to download the entire text response first before running our logic.
   */
  var originalResponseText = await response.text();

  /* Applies each of the replacementPairs above in order (in order to rewrite multiple
   * strings) using the following regex flags:
   *   g: global replace all instances of the pattern
   *   i: case insensitive.
   */
  const newResponseText = replacementPairs.reduce(
    (prev, pair) => prev.replace(new RegExp(pair.search, 'gi'), pair.replace),
    originalResponseText,
  );

  return new Response(newResponseText, {
    method: response.method,
    headers: response.headers,
  });
}

function checkForRewriteableMimeType(response) {
  const contentType = response.headers.get('Content-Type');
  const contentTypeParts = contentType.split(';');

  const allowedMimeTypes = [
    'text/html',
    'text/javascript',
    'application/javascript',
    'application/json',
    'text/css',
  ];

  const isAllowedMimeType = allowedMimeTypes.indexOf(contentTypeParts[0]) > -1;

  if (!isAllowedMimeType) {
    console.log('Skipping MimeType: ' + contentTypeParts[0]);
    return false;
  }

  console.log('Replacing MimeType: ' + contentTypeParts[0]);
  return true;
}

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'gi'), replacement);
};
