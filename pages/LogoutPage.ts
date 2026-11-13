import { Locator, Page } from "@playwright/test";

export class LogoutPage {
    
    readonly page: Page;

    // Locators
    readonly accountMenuButton: Locator;
    readonly signOutOption: Locator;
    readonly logoutSuccessHeading: Locator;

    constructor(page: Page) {
        
        this.page = page;
        this.accountMenuButton = page.getByRole('link', { name: /account/i });
        this.signOutOption = page.locator('[data-cy="logout"]');
        this.logoutSuccessHeading = page.getByRole('heading', { level: 4, name: /logged out successfully!/i, });

    }

    // Navigation
    async gotoHome() {
        await this.page.goto('/');
    }
      
    // Action flow
    async logout() {
        await this.accountMenuButton.click();
        await this.signOutOption.click();
    }

}