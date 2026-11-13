import { Locator, Page } from "@playwright/test";

export class LoginPage {
    
    readonly page: Page;

    // Locators
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly loginErrorAlert: Locator;
    readonly usernameRequiredError: Locator;
    readonly passwordRequiredError: Locator;

    constructor(page: Page) {
        
        this.page = page;

        this.usernameInput = page.getByPlaceholder(/your username/i);
        this.passwordInput = page.getByPlaceholder(/your password/i);
        this.signInButton = page.getByRole('button', { name: /sign in/i });
        this.loginErrorAlert = this.page.locator('[data-cy="loginError"]');
        this.usernameRequiredError = this.page.getByText(/username cannot be empty!/i);
        this.passwordRequiredError = this.page.getByText(/password cannot be empty!/i);

    }

    // Navigation
    async goto() {
        await this.page.goto('/login');
    }
      
    // Form actions
    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
    }


}