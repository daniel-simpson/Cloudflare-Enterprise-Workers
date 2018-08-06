const azureStorageContainerAccessToken =
  'GENERATE THIS TOKEN IN AZURE BLOB STORAGE DASHBOARD';
const environmentsConfig = `https://(AZURE_STORAGE_ACCOUNT).blob.core.windows.net/(AZURE_CONTAINER_NAME)/rewrite-to-alternate-host.json?${azureStorageContainerAccessToken}`;

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const requestUrl = new URL(request.url);
  const environment = await getEnvironment(request, requestUrl);

  if (environment === null) {
    // No environment to rewrite to, return
    return fetch(request);
  }

  requestUrl.scheme = environment.scheme.toString();
  requestUrl.host = environment.host;

  // Return a streaming response (not awaited) from the rewritten url
  return await fetch(requestUrl.toString(), {
    cf: environment.cf,
  });
}

// Retrieve the correct platform for this request
const getEnvironment = async (request, requestUrl) => {
  const configResponse = await fetch(environmentsConfig);
  const environments = await configResponse.json();

  // Use the javascript reduce function to find the first applicable environment for this URL
  return environments.reduce((prev, env) => {
    if (prev) {
      return prev;
    }

    const hasPatternMatch = env.patterns.reduce((p, pattern) => {
      return p || requestUrl.pathname.match(new RegExp(pattern));
    }, false);

    return hasPatternMatch ? env : null;
  }, null);
};
