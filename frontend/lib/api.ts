
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  'https://bookloop-backend-qgj8.onrender.com/api'
).replace(/\/+$/, '');

type ApiOptions = Omit<RequestInit, 'body'> & {
  auth?: boolean;
  body?: BodyInit | Record<string, unknown> | null;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const {
    auth = false,
    headers,
    body,
    ...requestOptions
  } = options;

  const requestHeaders = new Headers(headers);

  const isFormData =
    typeof FormData !== 'undefined' && body instanceof FormData;

  if (!isFormData) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (auth && typeof window !== 'undefined') {
    const token = localStorage.getItem('bookloop_access_token');

    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  const requestBody =
    body !== undefined &&
    body !== null &&
    typeof body === 'object' &&
    !isFormData &&
    !(typeof Blob !== 'undefined' && body instanceof Blob) &&
    !(typeof URLSearchParams !== 'undefined' &&
      body instanceof URLSearchParams) &&
    !(body instanceof ArrayBuffer)
      ? JSON.stringify(body)
      : body as BodyInit | null | undefined;

  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  let response: Response;

  try {
    response = await fetch(url, {
      ...requestOptions,
      body: requestBody,
      headers: requestHeaders,
    });
  } catch {
    throw new Error(
      'Unable to connect to the BookLoop server. Please check your internet connection or try again later.',
    );
  }

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
  return `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}
