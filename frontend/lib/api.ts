const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type ApiOptions = RequestInit & {
  auth?: boolean;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { auth = false, headers, ...requestOptions } = options;

  const requestHeaders = new Headers(headers);

  requestHeaders.set('Content-Type', 'application/json');

  if (auth && typeof window !== 'undefined') {
    const token = localStorage.getItem('bookloop_access_token');

    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...requestOptions,
    headers: requestHeaders,
  });

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}

export function getApiUrl(endpoint: string) {
  return `${API_URL}${endpoint}`;
}