import { Locator, Page } from '@playwright/test';

export class SettingsPage {

  readonly page: Page;

  // Locators: editable profile fields
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly saveButton: Locator;

  // Locators: feedback and validation
  readonly settingsSavedToast: Locator;
  readonly firstNameRequiredError: Locator;
  
  readonly lastNameRequiredError: Locator;
  readonly emailRequiredError: Locator;
  readonly emailTooShortError: Locator;
  readonly emailInvalidError: Locator;
  readonly firstNameTooLongError: Locator;
  readonly lastNameTooLongError: Locator;

  constructor(page: Page) {

    this.page = page;

    this.firstNameInput = page.locator('[data-cy="firstname"]');
    this.lastNameInput = page.locator('[data-cy="lastname"]');
    this.emailInput = page.locator('[data-cy="email"]');
    this.saveButton = page.locator('[data-cy="submit"]');

    this.settingsSavedToast = page.getByRole('alert').filter({ hasText: /settings saved!/i });

    this.firstNameRequiredError = page.getByText(/first name is required/i);
    this.lastNameRequiredError = page.getByText(/last name is required/i);
    this.emailRequiredError = page.getByText(/email is required/i);
    this.emailTooShortError = page.getByText(/at least 5 characters/i);
    this.emailInvalidError = page.getByText(/email is invalid/i);
    this.firstNameTooLongError = page.getByText(/first name cannot be longer than 50 characters/i);
    this.lastNameTooLongError = page.getByText(/last name cannot be longer than 50 characters/i);
  }

  // Navigation
  async goto() {
    await this.page.goto('/account/settings');
    await this.page.waitForLoadState('networkidle');
  }

  // Form actions
  async fillFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async clickSave() {
    await this.saveButton.click();
  }

  // Helper to update all user-editable settings in one call.
  async updateSettings(data: { firstName: string; lastName: string; email: string }) {
    await this.fillFirstName(data.firstName);
    await this.fillLastName(data.lastName);
    await this.fillEmail(data.email);
    await this.clickSave();
  }

  async getFirstNameValue(): Promise<string> {
    return (await this.firstNameInput.inputValue()).trim();
  }

  async getLastNameValue(): Promise<string> {
    return (await this.lastNameInput.inputValue()).trim();
  }

  async getEmailValue(): Promise<string> {
    return (await this.emailInput.inputValue()).trim();
  }
}