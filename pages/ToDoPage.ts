import { Locator, Page } from '@playwright/test';

export class ToDoPage {
  readonly page: Page;

  // Locators: list view actions
  readonly createButton: Locator;
  readonly deleteButton: Locator;
  readonly editButton: Locator;
  readonly detailsButton: Locator;
  readonly refreshButton: Locator;

  // Locators: create/edit form
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly folderSelect: Locator;
  readonly saveButton: Locator;
  readonly backButton: Locator;

  // Locators: details and delete dialog
  readonly detailsBackButton: Locator;
  readonly deleteDialogHeading: Locator;
  readonly confirmDeleteButton: Locator;
  readonly cancelDeleteButton: Locator;
  readonly deletedToast: Locator;

  constructor(page: Page) {
    this.page = page;

    this.createButton = page.locator('[data-cy="entityCreateButton"]');
    this.deleteButton = page.locator('[data-cy="entityDeleteButton"]');
    this.editButton = page.locator('[data-cy="entityEditButton"]');
    this.detailsButton = page.locator('[data-cy="entityDetailsButton"]');
    this.refreshButton = page.getByRole('button', { name: /refresh list/i });

    this.titleInput = page.locator('[data-cy="title"]');
    this.descriptionInput = page.locator('[data-cy="description"]');
    this.folderSelect = page.locator('[data-cy="folder"]');
    this.saveButton = page.locator('[data-cy="entityCreateSaveButton"]');
    this.backButton = page.locator('[data-cy="entityCreateCancelButton"]');
    this.detailsBackButton = page.locator('[data-cy="entityDetailsBackButton"]');
    this.deleteDialogHeading = page.locator('[data-cy="toDoItemDeleteDialogHeading"]');
    this.confirmDeleteButton = page.locator('[data-cy="entityConfirmDeleteButton"]');
    this.cancelDeleteButton = page.getByRole('button', { name: /^cancel$/i });
    this.deletedToast = page.getByRole('alert').filter({ hasText: /todoitem is deleted/i });
  }

  // Navigation
  async goto() {
    await this.page.goto('/to-do-item?page=1&sort=id,asc');
  }

  // Form actions
  async clickCreateNewToDo() {
    await this.createButton.click();
  }

  // Wait until folder options are loaded before selecting.
  async waitForFolderOptions() {
    await this.folderSelect.locator('option').nth(1).waitFor({ state: 'attached' });
  }

  async fillTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async selectFolder(folderId: string) {
    await this.folderSelect.selectOption(folderId);
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async clickBack() {
    await this.backButton.click();
  }

  // Row-level actions
  toDoRowByTitle(title: string): Locator {
    return this.page.locator('tr[data-cy="entityTable"]').filter({ hasText: title });
  }

  editButtonByTitle(title: string): Locator {
    return this.toDoRowByTitle(title).locator(this.editButton);
  }

  async clickEditByTitle(title: string) {
    await this.editButtonByTitle(title).click();
  }

  detailsButtonByTitle(title: string): Locator {
    return this.toDoRowByTitle(title).locator(this.detailsButton);
  }

  async clickDetailsByTitle(title: string) {
    await this.detailsButtonByTitle(title).click();
  }

  // Use details view back button to return to list.
  async clickDetailsBack() {
    await this.detailsBackButton.click();
  }

  deleteButtonByTitle(title: string): Locator {
    return this.toDoRowByTitle(title).locator(this.deleteButton);
  }

  async clickDeleteByTitle(title: string) {
    await this.deleteButtonByTitle(title).click();
  }

  async confirmDelete() {
    await this.confirmDeleteButton.click();
  }

  async cancelDelete() {
    await this.cancelDeleteButton.click();
  }
}
