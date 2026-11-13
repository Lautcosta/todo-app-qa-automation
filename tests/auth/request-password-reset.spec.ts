import { test, expect } from '../../fixtures';
import { faker } from '@faker-js/faker';

test.describe('Auth - Request Password Reset UI', () => {
  
  test.beforeEach(async ({ requestPasswordResetPage }) => {
    // Arrange: start each test from reset-password request form.
    await requestPasswordResetPage.goto();
  });

  test('successful password reset request', async ({ requestPasswordResetPage }) => {
    // Arrange
    const email = faker.internet.email().toLowerCase();

    // Act
    await requestPasswordResetPage.requestReset(email);

    // Assert
    await expect(requestPasswordResetPage.successToast).toBeVisible();
    await expect(requestPasswordResetPage.successToast).toContainText(
      /check your emails for details on how to reset your password\./i
    );
  });

  test('email less than 5 characters', async ({ requestPasswordResetPage }) => {
    // Act
    await requestPasswordResetPage.requestReset('a@b');

    // Assert
    await expect(requestPasswordResetPage.emailTooShortError).toBeVisible();
    await expect(requestPasswordResetPage.emailTooShortError).toContainText(
      /at least 5 characters/i
    );
  });

  test('invalid email format', async ({ requestPasswordResetPage }) => {
    // Act
    await requestPasswordResetPage.requestReset('invalid-email');

    // Assert
    await expect(requestPasswordResetPage.emailInvalidError).toBeVisible();
    await expect(requestPasswordResetPage.emailInvalidError).toContainText(
      /your email is invalid\./i
    );
  });

  test('empty email field', async ({ requestPasswordResetPage }) => {
    // Act
    await requestPasswordResetPage.requestReset('');

    // Assert
    await expect(requestPasswordResetPage.emailRequiredError).toBeVisible();
    await expect(requestPasswordResetPage.emailRequiredError).toContainText(
      /your email is required\./i
    );
  });
});