import { faker } from '@faker-js/faker';
import { expect, test } from '../../fixtures';

test.describe('ToDo - View', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ todoPage }) => {
    await todoPage.goto();
  });

  test('should open to-do item details and return to list', async ({ todoPage, folderPage, page }) => {
    // Arrange
    const folderName = `todo-folder-${faker.string.alphanumeric(8).toLowerCase()}`;
    const title = `todo-title-${faker.string.alphanumeric(8).toLowerCase()}`;
    const description = `todo-description-${faker.string.alphanumeric(12).toLowerCase()}`;

    // ToDo creation depends on an existing folder.
    await folderPage.gotoList();
    await folderPage.createFolder(folderName);
    await page.goto('/folder?page=1&sort=id,desc');
    const folderId = await folderPage.getFolderIdByName(folderName);

    // Act: create a record to view.
    await todoPage.goto();
    await todoPage.clickCreateNewToDo();
    await expect(page).toHaveURL(/\/to-do-item\/new$/);
    await todoPage.waitForFolderOptions();

    await todoPage.fillTitle(title);
    await todoPage.fillDescription(description);
    await todoPage.selectFolder(folderId);
    await todoPage.clickSave();

    // Assert precondition in list before opening details.
    await expect(page).toHaveURL(/\/to-do-item(\?.*)?$/);
    await page.goto('/to-do-item?page=1&sort=id,desc');
    await expect(todoPage.toDoRowByTitle(title)).toHaveCount(1, { timeout: 10000 });

    // Act
    await todoPage.clickDetailsByTitle(title);

    // Assert
    await expect(page).toHaveURL(/\/to-do-item\/\d+$/);

    // Act: alternate flow (return back to list).
    await todoPage.clickDetailsBack();

    // Assert
    await expect(page).toHaveURL(/\/to-do-item(\?.*)?$/);
    
  });

});

