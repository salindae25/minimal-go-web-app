// Adapted from px0's request helper: same-origin JSON, explicit HTTP errors.
export async function api(path, { method = 'GET', body, signal } = {}) {
  const url = new URL(path, document.baseURI);
  if (url.origin !== location.origin) throw new Error('API requests must use the same origin.');
  const options = { method, signal, headers: { Accept: 'application/json' } };
  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.error || `Request failed (${response.status}).`);
  }
  return json;
}
