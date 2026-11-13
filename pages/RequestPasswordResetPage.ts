import { Locator, Page } from "@playwright/test";

export class RequestPasswordResetPage {
    
    readonly page: Page;

    // Locators: form fields and submit action
    readonly emailInput: Locator;   
    readonly resetPasswordButton: Locator;

    // Locators: feedback and validation
    readonly successToast: Locator;
    readonly emailTooShortError: Locator;
    readonly emailInvalidError: Locator;
    readonly emailRequiredError: Locator;

    constructor(page: Page) {
        
        this.page = page;

        this.emailInput = page.locator('[data-cy="emailResetPassword"]');
        this.resetPasswordButton = page.locator('[data-cy="submit"]');
        this.successToast = page.getByRole('alert').filter({ hasText: /reset your password/i });
        this.emailTooShortError = page.getByText('Your email is required to be at least 5 characters.');
        this.emailInvalidError = page.getByText('Your email is invalid.');
        this.emailRequiredError = page.getByText('Your email is required.');
    }

    // Navigation
    async goto() {
        await this.page.goto('/account/reset/request');
    }

    // Form actions
    async requestReset(email: string) {
        await this.emailInput.fill(email);
        await this.resetPasswordButton.click();
    }

}