import { apiRequest } from './api';

const ACCESS_TOKEN_KEY = 'bookloop_access_token';
const USER_KEY = 'bookloop_user';

export type AuthUser = {
  id: string;
  name?: string;
  email: string;
  role?: 'USER' | 'ADMIN';
};

type AuthResponse = {
  success?: boolean;
  message?: string;
  data?: {
    user?: AuthUser;
    accessToken?: string;
    token?: string;
    refreshToken?: string;
  };
  user?: AuthUser;
  accessToken?: string;
  token?: string;
};

function extractAccessToken(response: AuthResponse) {
  return (
    response.accessToken ||
    response.token ||
    response.data?.accessToken ||
    response.data?.token
  );
}

function extractUser(response: AuthResponse) {
  return response.user || response.data?.user;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const accessToken = extractAccessToken(response);
  const user = extractUser(response);

  if (typeof window !== 'undefined') {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }

    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  return response;
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  return response;
}

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await apiRequest<AuthResponse>('/auth/refresh', {
      method: 'POST',
    });

    const accessToken = extractAccessToken(response);

    if (accessToken && typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }

    return accessToken || null;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('/auth/logout', {
      method: 'POST',
      auth: true,
    });
  } catch {
    // Local authentication state is still cleared below.
  }

  clearAuth();
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}

export function clearAuth(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}