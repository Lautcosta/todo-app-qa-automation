import { faker } from '@faker-js/faker';
import { expect, test } from '../../fixtures';

test.describe('ToDo - Edit', () => {
  
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ todoPage }) => {
    await todoPage.goto();
  });

  test('should edit a to-do item successfully', async ({ todoPage, folderPage, page }) => {
    // Arrange
    const folderName = `todo-folder-${faker.string.alphanumeric(8).toLowerCase()}`;
    const originalTitle = `todo-title-${faker.string.alphanumeric(8).toLowerCase()}`;
    const updatedTitle = `todo-updated-${faker.string.alphanumeric(8).toLowerCase()}`;
    const description = `todo-description-${faker.string.alphanumeric(12).toLowerCase()}`;

    // ToDo creation depends on an existing folder.
    await folderPage.gotoList();
    await folderPage.createFolder(folderName);
    await page.goto('/folder?page=1&sort=id,desc');
    const folderId = await folderPage.getFolderIdByName(folderName);

    await todoPage.goto();
    await todoPage.clickCreateNewToDo();
    await expect(page).toHaveURL(/\/to-do-item\/new$/);
    await todoPage.waitForFolderOptions();
    await todoPage.fillTitle(originalTitle);
    await todoPage.fillDescription(description);
    await todoPage.selectFolder(folderId);
    await todoPage.clickSave();

    await page.goto('/to-do-item?page=1&sort=id,desc');
    await expect(todoPage.toDoRowByTitle(originalTitle)).toHaveCount(1, { timeout: 10000 });

    // Act
    await todoPage.clickEditByTitle(originalTitle);
    await expect(page).toHaveURL(/\/to-do-item\/\d+\/edit(\?.*)?$/);

    await todoPage.fillTitle(updatedTitle);
    await todoPage.clickSave();

    // Assert
    await expect(page).toHaveURL(/\/to-do-item(\?.*)?$/);
    await page.goto('/to-do-item?page=1&sort=id,desc');
    await expect(todoPage.toDoRowByTitle(updatedTitle)).toHaveCount(1, { timeout: 10000 });
  });

  test('should cancel to-do edit and return to list', async ({ todoPage, folderPage, page }) => {
    // Arrange
    const folderName = `todo-folder-${faker.string.alphanumeric(8).toLowerCase()}`;
    const originalTitle = `todo-title-${faker.string.alphanumeric(8).toLowerCase()}`;
    const changedTitle = `todo-cancel-${faker.string.alphanumeric(8).toLowerCase()}`;
    const description = `todo-description-${faker.string.alphanumeric(12).toLowerCase()}`;

    // Prepare a record to edit.
    await folderPage.gotoList();
    await folderPage.createFolder(folderName);
    await page.goto('/folder?page=1&sort=id,desc');
    const folderId = await folderPage.getFolderIdByName(folderName);

    await todoPage.goto();
    await todoPage.clickCreateNewToDo();
    await expect(page).toHaveURL(/\/to-do-item\/new$/);
    await todoPage.waitForFolderOptions();
    await todoPage.fillTitle(originalTitle);
    await todoPage.fillDescription(description);
    await todoPage.selectFolder(folderId);
    await todoPage.clickSave();

    await page.goto('/to-do-item?page=1&sort=id,desc');
    await expect(todoPage.toDoRowByTitle(originalTitle)).toHaveCount(1, { timeout: 10000 });

    // Act
    await todoPage.clickEditByTitle(originalTitle);
    await expect(page).toHaveURL(/\/to-do-item\/\d+\/edit(\?.*)?$/);

    await todoPage.fillTitle(changedTitle);
    await todoPage.clickBack();

    // Assert
    await expect(page).toHaveURL(/\/to-do-item(\?.*)?$/);
    await page.goto('/to-do-item?page=1&sort=id,desc');
    await expect(todoPage.toDoRowByTitle(originalTitle)).toHaveCount(1, { timeout: 10000 });
    await expect(todoPage.toDoRowByTitle(changedTitle)).toHaveCount(0);
  });

  test('should require title before saving on edit', async ({ todoPage, folderPage, page }) => {
    // Known issue: empty mandatory fields are not always blocked on update.
    test.fail(true, 'BUG-001: System allows the creation or update of a To-Do item with empty mandatory fields.');

    // Arrange
    const folderName = `todo-folder-${faker.string.alphanumeric(8).toLowerCase()}`;
    const originalTitle = `todo-title-${faker.string.alphanumeric(8).toLowerCase()}`;
    const description = `todo-description-${faker.string.alphanumeric(12).toLowerCase()}`;

    await folderPage.gotoList();
    await folderPage.createFolder(folderName);
    await page.goto('/folder?page=1&sort=id,desc');
    const folderId = await folderPage.getFolderIdByName(folderName);

    await todoPage.goto();
    await todoPage.clickCreateNewToDo();
    await expect(page).toHaveURL(/\/to-do-item\/new$/);
    await todoPage.waitForFolderOptions();
    await todoPage.fillTitle(originalTitle);
    await todoPage.fillDescription(description);
    await todoPage.selectFolder(folderId);
    await todoPage.clickSave();

    await page.goto('/to-do-item?page=1&sort=id,desc');
    await expect(todoPage.toDoRowByTitle(originalTitle)).toHaveCount(1, { timeout: 10000 });

    // Act
    await todoPage.clickEditByTitle(originalTitle);
    await expect(page).toHaveURL(/\/to-do-item\/\d+\/edit(\?.*)?$/);

    await todoPage.fillTitle('');
    await todoPage.titleInput.focus();
    await page.keyboard.press('Tab');

    // Assert
    await expect(todoPage.titleInput).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByText('This field is required.').first()).toBeVisible();
  });
});

