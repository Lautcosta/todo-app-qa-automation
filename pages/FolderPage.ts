import { Locator, Page } from '@playwright/test';

export class FolderPage {
  readonly page: Page;

  // Locators: list view actions
  readonly createFolderButton: Locator;
  readonly tableRows: Locator;
  readonly toastAlert: Locator;
  readonly deleteButton: Locator;
  readonly detailsButton: Locator;
  readonly editButton: Locator;

  // Locators: create/edit form and delete dialog
  readonly nameInput: Locator;
  readonly saveButton: Locator;
  readonly backButton: Locator;
  readonly nameRequiredError: Locator;
  readonly deleteDialogHeading: Locator;
  readonly confirmDeleteButton: Locator;
  readonly folderDeletedToast: Locator;

  constructor(page: Page) {
    
    this.page = page;

    this.createFolderButton = page.locator('[data-cy="entityCreateButton"]');
    this.tableRows = page.locator('tr[data-cy="entityTable"]');
    this.toastAlert = page.getByRole('alert');
    this.deleteButton = page.locator('[data-cy="entityDeleteButton"]');
    this.detailsButton = page.locator('[data-cy="entityDetailsButton"]');
    this.editButton = page.locator('[data-cy="entityEditButton"]');

    this.nameInput = page.locator('[data-cy="name"]');
    this.saveButton = page.locator('[data-cy="entityCreateSaveButton"]');
    this.backButton = page.locator('[data-cy="entityCreateCancelButton"]');
    this.nameRequiredError = page.getByText(/name is required|required/i);
    this.deleteDialogHeading = page.locator('[data-cy="folderDeleteDialogHeading"]');
    this.confirmDeleteButton = page.locator('[data-cy="entityConfirmDeleteButton"]');
    this.folderDeletedToast = page.getByText(/a folder is deleted with/i);
  }

  // Navigation
  async gotoList() {
    await this.page.goto('/folder');
  }

  // Form actions
  async clickCreateNewFolder() {
    await this.createFolderButton.click();
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async clickBack() {
    await this.backButton.click();
  }

  // Create flow helper used by multiple tests.
  async createFolder(name: string) {
    await this.clickCreateNewFolder();
    await this.page.waitForURL(/\/folder\/new$/);
    await this.fillName(name);
    await this.clickSave();
    await this.page.waitForURL(/\/folder(\?.*)?$/);
  }

  folderRowByName(name: string): Locator {
    return this.tableRows.filter({ hasText: name });
  }

  // Gets the row ID from the first table cell for downstream relations.
  async getFolderIdByName(name: string): Promise<string> {
    const row = this.folderRowByName(name).first();
    const idText = (await row.locator('td').first().innerText()).trim();
    if (!idText) {
      throw new Error(`Folder id not found for folder name: ${name}`);
    }
    return idText;
  }

  deleteButtonByFolderName(name: string): Locator {
    return this.folderRowByName(name).locator(this.deleteButton);
  }

  detailsButtonByFolderName(name: string): Locator {
    return this.folderRowByName(name).locator(this.detailsButton);
  }

  editButtonByFolderName(name: string): Locator {
    return this.folderRowByName(name).locator(this.editButton);
  }

  // Row-level actions
  async clickDeleteByName(name: string) {
    await this.deleteButtonByFolderName(name).click();
  }

  async clickDetailsByName(name: string) {
    await this.detailsButtonByFolderName(name).click();
  }

  async clickEditByName(name: string) {
    await this.editButtonByFolderName(name).click();
  }

  async confirmDelete() {
    await this.confirmDeleteButton.click();
  }

  // Convenience helper for direct cleanup paths.
  async deleteFolderByName(name: string) {
    await this.clickDeleteByName(name);
    await this.confirmDelete();
  }

  async isFolderVisible(name: string): Promise<boolean> {
    return await this.folderRowByName(name).first().isVisible();
  }

  async getCreationToast(): Promise<string | null> {
    return await this.toastAlert.textContent();
  }
}