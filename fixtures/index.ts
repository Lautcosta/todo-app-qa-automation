import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { RequestPasswordResetPage } from '../pages/RequestPasswordResetPage';
import { LogoutPage } from '../pages/LogoutPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ToDoPage } from '../pages/ToDoPage';
import { FolderPage } from '../pages/FolderPage';

type Fixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  requestPasswordResetPage: RequestPasswordResetPage;
  logoutPage : LogoutPage;
  settingsPage: SettingsPage;
  todoPage: ToDoPage;
  folderPage: FolderPage;

};

export const test = base.extend<Fixtures>({
  
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  requestPasswordResetPage: async ({ page }, use) => {
    await use(new RequestPasswordResetPage(page));
  },

  logoutPage: async ({ page }, use) => {
    await use(new LogoutPage(page));
  },

  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },

  todoPage: async ({ page }, use) => {
    await use(new ToDoPage(page));
  },

  folderPage: async ({ page }, use) => {
    await use(new FolderPage(page));
  },

});

export { expect } from '@playwright/test';