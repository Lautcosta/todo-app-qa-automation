import { test, expect } from '../../fixtures';
import { faker } from '@faker-js/faker';

test.describe('Auth - Register UI', () => {

    test.beforeEach(async ({ registerPage }) => {
      // Arrange: start each test on register page.
      await registerPage.goto();
    });
  
    test('successful registration', async ({ registerPage }) => {
        // Arrange
        const unique = Date.now();
        const username = `${faker.internet.username().toLowerCase()}${unique}`;
        const email = `${faker.string.alphanumeric(8).toLowerCase()}${unique}@mail.com`;
        const password = 'ValidPass123';

        // Act
        await registerPage.register(username, email, password, password);

        // Assert
        await expect(registerPage.successToast).toBeVisible();
        await expect(registerPage.successToast).toContainText(/registration saved!/i);
    });

    test('username already exists', async ({ registerPage}) => {
        // Arrange
        const unique = Date.now();
        const username = 'user'; // Existing username in the app
        const email = `${faker.string.alphanumeric(8).toLowerCase()}${unique}@mail.com`;
        const password = 'ValidPass123';

        // Act
        await registerPage.register(username, email, password, password);

        // Assert
        await expect(registerPage.usernameAlreadyUsedToast).toBeVisible();
        await expect(registerPage.usernameAlreadyUsedToast).toContainText(/login name already used!/i);
    });

    test('passwords do not match', async ({ registerPage }) => {
        // Arrange
        const unique = Date.now();
        const username = `${faker.internet.username().toLowerCase()}${unique}`;
        const email = `${faker.string.alphanumeric(8).toLowerCase()}${unique}@mail.com`;
        const password = 'ValidPass123';
        const confirmPassword = 'DifferentPass123';

        // Act
        await registerPage.register(username, email, password, confirmPassword);

        // Assert
        await expect(registerPage.passwordMismatchError).toBeVisible();
        await expect(registerPage.passwordMismatchError).toContainText(/do not match/i);
    });

    test('empty required fields', async ({ registerPage }) => {  
        // Act
        await registerPage.register('', '', '', '');

        // Assert
        await expect(registerPage.usernameRequiredError).toBeVisible();
        await expect(registerPage.emailRequiredError).toBeVisible();
    });


    test('password too short', async ({ registerPage }) => {
        // Arrange
        const unique = Date.now();
        const username = `${faker.internet.username().toLowerCase()}${unique}`;
        const email = `${faker.string.alphanumeric(8).toLowerCase()}${unique}@mail.com`;
        const shortPassword = '123';
      
        // Act
        await registerPage.register(username, email, shortPassword, shortPassword);

        // Assert
        await expect(registerPage.passwordTooShortError).toBeVisible();
        await expect(registerPage.passwordTooShortError).toContainText(/at least 4 characters/i);
    });

    test('password too long', async ({ registerPage }) => {
        // Arrange
        const unique = Date.now();
        const username = `${faker.internet.username().toLowerCase()}${unique}`;
        const email = `${faker.string.alphanumeric(8).toLowerCase()}${unique}@mail.com`;
        const longPassword = 'a'.repeat(51); // > 50
      
        // Act
        await registerPage.register(username, email, longPassword, longPassword);

        // Assert
        await expect(registerPage.passwordTooLongError).toBeVisible();
        await expect(registerPage.passwordTooLongError).toContainText(/cannot be longer than 50 characters/i);
    });

  });