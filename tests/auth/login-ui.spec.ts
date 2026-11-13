import { test, expect } from '../../fixtures';

test.describe('Auth - Login UI', () => {
   

    test.beforeEach(async ({ loginPage }) => {
        // Arrange: start each test from login screen.
        await loginPage.goto();
    });

    test('successful login', async ({ page, loginPage }) => {
        // Arrange
        test.skip(!process.env.E2E_USERNAME || !process.env.E2E_PASSWORD, 'Missing E2E credentials');

        // Act
        await loginPage.login(process.env.E2E_USERNAME!, process.env.E2E_PASSWORD!);

        // Assert
        await expect(page).toHaveURL('/');
        await expect(page.getByRole('heading', { level: 2, name: /welcome to ensolvers qa challenge!/i })).toBeVisible();
    });


    test('empty fields validation', async ({ page, loginPage }) => {
        // Act
        await loginPage.login('', '');

        // Assert
        await expect(page).toHaveURL(/\/login$/);
        await expect(loginPage.usernameRequiredError).toBeVisible();
        await expect(loginPage.passwordRequiredError).toBeVisible();
    });
 

    test('invalid credentials', async ({ page, loginPage }) => {
        // Act
        await loginPage.login('wrong-user', 'wrong-pass');

        // Assert
        await expect(page).toHaveURL(/\/login$/);
        await expect(loginPage.loginErrorAlert).toBeVisible();
        await expect(loginPage.usernameInput).toHaveValue('wrong-user');
        await expect(loginPage.passwordInput).toHaveValue('wrong-pass');
    });


});