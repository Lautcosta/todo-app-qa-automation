import { expect, test } from '../../fixtures';
import { faker } from '@faker-js/faker';

test.describe('Update settings', () => {
  
  test.beforeEach(async ({ settingsPage }) => {
    // Arrange: start each case from settings page.
    await settingsPage.goto();
  });

  test('should save valid changes and show success toast', async ({ settingsPage }) => {
    // Arrange
    const uniqueSuffix = Date.now();

    const updatedData = {
      firstName: `${faker.person.firstName()}${uniqueSuffix}`,
      lastName: `${faker.person.lastName()}${uniqueSuffix}`,
      email: `${faker.string.alphanumeric(8).toLowerCase()}${uniqueSuffix}@mail.com`,
    };

    // Act
    await settingsPage.updateSettings(updatedData);

    // Assert
    await expect(settingsPage.settingsSavedToast).toBeVisible();
  });

  test('should show required error when first name is empty', async ({ settingsPage }) => {
    // Arrange
    const uniqueSuffix = Date.now();

    // Act
    await settingsPage.fillLastName(`${faker.person.lastName()}${uniqueSuffix}`);
    await settingsPage.fillEmail(`${faker.string.alphanumeric(8).toLowerCase()}${uniqueSuffix}@mail.com`);
    await settingsPage.fillFirstName('');
    await settingsPage.clickSave();

    // Assert
    await expect(settingsPage.firstNameRequiredError).toBeVisible();
    await expect(settingsPage.firstNameRequiredError).toContainText(/first name is required/i);
  });

  test('should show required error when last name is empty', async ({ settingsPage }) => {
    // Arrange
    const uniqueSuffix = Date.now();

    // Act
    await settingsPage.fillFirstName(`${faker.person.firstName()}${uniqueSuffix}`);
    await settingsPage.fillEmail(`${faker.string.alphanumeric(8).toLowerCase()}${uniqueSuffix}@mail.com`);
    await settingsPage.fillLastName('');
    await settingsPage.clickSave();

    // Assert
    await expect(settingsPage.lastNameRequiredError).toBeVisible();
    await expect(settingsPage.lastNameRequiredError).toContainText(/last name is required/i);
  });

  test('should show required error when email is empty', async ({ settingsPage }) => {
    // Arrange
    const uniqueSuffix = Date.now();

    // Act
    await settingsPage.fillFirstName(`${faker.person.firstName()}${uniqueSuffix}`);
    await settingsPage.fillLastName(`${faker.person.lastName()}${uniqueSuffix}`);
    await settingsPage.fillEmail('');
    await settingsPage.clickSave();

    // Assert
    await expect(settingsPage.emailRequiredError).toBeVisible();
    await expect(settingsPage.emailRequiredError).toContainText(/email is required/i);
  });

  test('should show email too short error', async ({ settingsPage }) => {
    // Arrange
    const uniqueSuffix = Date.now();

    // Act
    await settingsPage.fillFirstName(`${faker.person.firstName()}${uniqueSuffix}`);
    await settingsPage.fillLastName(`${faker.person.lastName()}${uniqueSuffix}`);
    await settingsPage.fillEmail('a@b');
    await settingsPage.clickSave();

    // Assert
    await expect(settingsPage.emailTooShortError).toBeVisible();
    await expect(settingsPage.emailTooShortError).toContainText(/at least 5 characters/i);
  });

  test('should show invalid email format error', async ({ settingsPage }) => {
    // Arrange
    const uniqueSuffix = Date.now();

    // Act
    await settingsPage.fillFirstName(`${faker.person.firstName()}${uniqueSuffix}`);
    await settingsPage.fillLastName(`${faker.person.lastName()}${uniqueSuffix}`);
    await settingsPage.fillEmail(`invalid-email-${uniqueSuffix}`);
    await settingsPage.clickSave();

    // Assert
    await expect(settingsPage.emailInvalidError).toBeVisible();
    await expect(settingsPage.emailInvalidError).toContainText(/email is invalid/i);
  });

  test('should show first name max length error on blur', async ({ settingsPage }) => {

    // Arrange
    const tooLongFirstName = faker.string.alpha(51);

    // Act
    await settingsPage.fillFirstName(tooLongFirstName);
    await settingsPage.emailInput.click();

    // Assert
    await expect(settingsPage.firstNameTooLongError).toBeVisible();
    await expect(settingsPage.firstNameTooLongError).toContainText(/your first name cannot be longer than 50 characters/i);
  });

  test('should show last name max length error on blur', async ({ settingsPage }) => {


    // Arrange
    const tooLongLastName = faker.string.alpha(51);

    // Act
    await settingsPage.fillLastName(tooLongLastName);
    await settingsPage.emailInput.click();

    // Assert
    await expect(settingsPage.lastNameTooLongError).toBeVisible();
    await expect(settingsPage.lastNameTooLongError).toContainText(/your last name cannot be longer than 50 characters/i);
  });
});
