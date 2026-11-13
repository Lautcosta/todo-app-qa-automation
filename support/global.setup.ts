import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { loginByApi } from './auth.api';

dotenv.config();

/**
 * Global setup:
 * - Authenticates via API
 * - Persists authenticated storage state for non-auth suites
 */
async function globalSetup(_config: FullConfig): Promise<void> {
  const baseURL = process.env.BASE_URL;
  const username = process.env.E2E_USERNAME;
  const password = process.env.E2E_PASSWORD;

  if (!baseURL || !username || !password) {
    throw new Error(
      'Missing required env vars. Expected: BASE_URL, E2E_USERNAME, E2E_PASSWORD.'
    );
  }

  const token = await loginByApi({ baseURL, username, password });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Ensure origin is initialized before writing sessionStorage.
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

  // Persist token in both storages:
  // - sessionStorage matches current app behavior after UI login
  // - localStorage is captured by Playwright storageState for reuse across tests
  await page.evaluate((idToken: string) => {
    window.sessionStorage.setItem('jhi-authenticationToken', idToken);
    window.localStorage.setItem('jhi-authenticationToken', idToken);
  }, token);

  const storageStatePath = path.resolve(process.cwd(), 'playwright/.auth/user.json');

  // Guarantee output directory exists before saving state.
  fs.mkdirSync(path.dirname(storageStatePath), { recursive: true });

  await context.storageState({ path: storageStatePath });

  await context.close();
  await browser.close();
}

export default globalSetup;