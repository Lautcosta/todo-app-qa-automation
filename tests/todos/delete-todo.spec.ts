import { faker } from '@faker-js/faker';
import { expect, test } from '../../fixtures';

test.describe('ToDo - Delete', () => {

  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ todoPage }) => {
    await todoPage.goto();
  });

  test('should delete a to-do item successfully', async ({ todoPage, folderPage, page }) => {
    // Arrange
    const folderName = `todo-folder-${faker.string.alphanumeric(8).toLowerCase()}`;
    const title = `todo-title-${faker.string.alphanumeric(8).toLowerCase()}`;
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
    await todoPage.fillTitle(title);
    await todoPage.fillDescription(description);
    await todoPage.selectFolder(folderId);
    await todoPage.clickSave();

    await page.goto('/to-do-item?page=1&sort=id,desc');
    await expect(todoPage.toDoRowByTitle(title)).toHaveCount(1, { timeout: 10000 });

    // Act
    await todoPage.clickDeleteByTitle(title);
    await expect(page).toHaveURL(/\/to-do-item\/\d+\/delete(\?.*)?$/);
    await expect(todoPage.deleteDialogHeading).toBeVisible();

    await todoPage.confirmDelete();
    await page.goto('/to-do-item?page=1&sort=id,desc');

    // Assert
    await expect(page).toHaveURL(/\/to-do-item(\?.*)?$/);
    await expect(todoPage.toDoRowByTitle(title)).toHaveCount(0);
  });

  test('should cancel to-do item deletion from modal', async ({ todoPage, folderPage, page }) => {
    // Arrange
    const folderName = `todo-folder-${faker.string.alphanumeric(8).toLowerCase()}`;
    const title = `todo-title-${faker.string.alphanumeric(8).toLowerCase()}`;
    const description = `todo-description-${faker.string.alphanumeric(12).toLowerCase()}`;

    // Prepare a record so cancel flow can be validated.
    await folderPage.gotoList();
    await folderPage.createFolder(folderName);
    await page.goto('/folder?page=1&sort=id,desc');
    const folderId = await folderPage.getFolderIdByName(folderName);

    await todoPage.goto();
    await todoPage.clickCreateNewToDo();
    await expect(page).toHaveURL(/\/to-do-item\/new$/);
    await todoPage.waitForFolderOptions();
    await todoPage.fillTitle(title);
    await todoPage.fillDescription(description);
    await todoPage.selectFolder(folderId);
    await todoPage.clickSave();

    await page.goto('/to-do-item?page=1&sort=id,desc');
    await expect(todoPage.toDoRowByTitle(title)).toHaveCount(1, { timeout: 10000 });

    // Act
    await todoPage.clickDeleteByTitle(title);
    await expect(page).toHaveURL(/\/to-do-item\/\d+\/delete(\?.*)?$/);
    await expect(todoPage.deleteDialogHeading).toBeVisible();

    await todoPage.cancelDelete();

    // Assert
    await expect(page).toHaveURL(/\/to-do-item(\?.*)?$/);
    await page.goto('/to-do-item?page=1&sort=id,desc');
    await expect(todoPage.toDoRowByTitle(title)).toHaveCount(1, { timeout: 10000 });
  });
});

