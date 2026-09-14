const apiBaseUrl = import.meta.env.VITE_API_URL || '/api/v1';

export async function authRequest(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const body =
    response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(body?.error || 'Unable to complete the request.');
  return body;
}
