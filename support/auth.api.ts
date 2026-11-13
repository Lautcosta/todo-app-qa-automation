import { request, APIRequestContext } from '@playwright/test';

type LoginParams = {
  baseURL: string;
  username: string;
  password: string;
};

/**
 * Creates an isolated API request context for authentication calls.
 * We keep this separate so setup code stays clean and focused.
 */
export async function createAuthRequestContext(baseURL: string): Promise<APIRequestContext> {
  return await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Logs in through backend API and returns the JWT token (id_token).
 *
 * Why this exists:
 * - UI login is slower and flaky for setup.
 * - API login is fast and deterministic.
 * - The returned token is later injected into sessionStorage in global setup.
 */
export async function loginByApi(params: LoginParams): Promise<string> {
  const { baseURL, username, password } = params;

  const apiContext = await createAuthRequestContext(baseURL);

  try {
    // This endpoint was discovered from browser Network tab.
    const response = await apiContext.post('/api/authenticate', {
      data: {
        username,
        password,
        rememberMe: false,
      },
    });

    // Fail early with useful details if backend authentication fails.
    if (!response.ok()) {
      const errorBody = await response.text();
      throw new Error(
        `API login failed. Status: ${response.status()} ${response.statusText()} | Body: ${errorBody}`
      );
    }

    // Expected response shape: { id_token: "..." }
    const body = (await response.json()) as { id_token?: string };

    if (!body.id_token) {
      throw new Error('API login succeeded but id_token was not returned in response body.');
    }

    return body.id_token;
  } finally {
    // Always dispose the request context to avoid leaked resources.
    await apiContext.dispose();
  }
}