import { Locator, Page } from "@playwright/test";

export class RegisterPage {
    
    readonly page: Page;

    // Locators: form fields
    readonly usernameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly registerButton: Locator;

    // Locators: feedback and validation
    readonly successToast: Locator;
    readonly usernameAlreadyUsedToast: Locator;
    readonly passwordMismatchError: Locator;
    readonly usernameRequiredError: Locator;
    readonly emailRequiredError: Locator;
    readonly passwordTooLongError: Locator;
    readonly passwordTooShortError: Locator;

    constructor(page: Page) {
        
        this.page = page;

        this.usernameInput = page.locator('[data-cy="username"]');
        this.emailInput = page.locator('[data-cy="email"]');
        this.passwordInput = page.locator('[data-cy="firstPassword"]');
        this.confirmPasswordInput = page.locator('[data-cy="secondPassword"]');
        this.registerButton = page.locator('[data-cy="submit"]');
        this.successToast = page.getByRole('alert').filter({ hasText: /registration saved/i });
        this.usernameAlreadyUsedToast = page.getByRole('alert').filter({ hasText: /login name already used/i });
        this.passwordMismatchError = page.getByText('The password and its confirmation do not match!');
        this.usernameRequiredError = page.getByText('Your username is required.');
        this.emailRequiredError = page.getByText('Your email is required.');
        this.passwordTooLongError = page.getByText('Your password cannot be longer than 50 characters.');
        this.passwordTooShortError = page.getByText('Your password is required to be at least 4 characters.');
    }

    // Navigation
    async goto() {
        await this.page.goto('/account/register');
    }

    // Form actions
    async register(username: string, email: string, password: string, confirmPassword: string) {
        await this.usernameInput.fill(username);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(confirmPassword);
        await this.registerButton.click();
    }

}