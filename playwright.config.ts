import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  globalSetup: './support/global.setup.ts',
  
  use: {
    baseURL: process.env.BASE_URL,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },


  projects: [
    {
      name: 'auth',
      testMatch: /.*tests[\\/]+auth[\\/]+.*\.spec\.ts/,
    },
    {
      name: 'todos',
      testMatch: /.*tests[\\/]+todos[\\/]+.*\.spec\.ts/,
      workers: 1,
      use: { storageState: 'playwright/.auth/user.json' },
    },
    {
      name: 'folders',
      testMatch: /.*tests[\\/]+folders[\\/]+.*\.spec\.ts/,
      workers: 1,
      use: { storageState: 'playwright/.auth/user.json' },
    },
    {
      name: 'settings',
      testMatch: /.*tests[\\/]+settings[\\/]+.*\.spec\.ts/,
      use: { storageState: 'playwright/.auth/user.json' },
    },
  ],
});
