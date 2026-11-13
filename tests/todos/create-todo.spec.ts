import { faker } from '@faker-js/faker';
import { expect, test } from '../../fixtures';
import { ToDoPage } from '../../pages/ToDoPage';

test.describe('ToDo - Create', () => {

  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ todoPage }) => {
    await todoPage.goto();
  });

  test('should create a new to-do item successfully', async ({ todoPage, folderPage, page }) => {
    // Arrange
    const folderName = `todo-folder-${faker.string.alphanumeric(8).toLowerCase()}`;
    const title = `todo-title-${faker.string.alphanumeric(8).toLowerCase()}`;
    const description = `todo-description-${faker.string.alphanumeric(12).toLowerCase()}`;

    // ToDo creation depends on an existing folder, so create one first.
    await folderPage.gotoList();
    await folderPage.createFolder(folderName);
    await page.goto('/folder?page=1&sort=id,desc');
    const folderId = await folderPage.getFolderIdByName(folderName);

    // Act
    await todoPage.goto();
    await todoPage.clickCreateNewToDo();
    await expect(page).toHaveURL(/\/to-do-item\/new$/);
    await todoPage.waitForFolderOptions();

    await todoPage.fillTitle(title);
    await todoPage.fillDescription(description);
    await todoPage.selectFolder(folderId);

    // Stabilize fast runs: verify form state before submit.
    await expect(todoPage.titleInput).toHaveValue(title);
    await expect(todoPage.descriptionInput).toHaveValue(description);
    await expect(todoPage.folderSelect).toHaveValue(folderId);

    await todoPage.clickSave();

    // Assert
    await expect(page).toHaveURL(/\/to-do-item(\?.*)?$/);
    await todoPage.refreshButton.click();
    await expect(todoPage.toDoRowByTitle(title)).toHaveCount(1, { timeout: 10000 });
  });



  test('should cancel to-do creation and return to list', async ({ todoPage, page }) => {
    // Act
    await todoPage.clickCreateNewToDo();
    await expect(page).toHaveURL(/\/to-do-item\/new$/);

    await todoPage.clickBack();

    // Assert
    await expect(page).toHaveURL(/\/to-do-item(\?.*)?$/);
  });


  test('should require title before saving', async ({ todoPage, page }) => {
    // Known issue: empty mandatory fields are not always blocked.
    test.fail(true, 'BUG-001: System allows the creation of a To-Do item with empty mandatory fields.');

    // Act
    await todoPage.clickCreateNewToDo();
    await expect(page).toHaveURL(/\/to-do-item\/new$/);

    await todoPage.fillTitle('');
    await todoPage.fillDescription('');
    await todoPage.titleInput.focus();
    await page.keyboard.press('Tab');

    // Assert
    await expect(todoPage.titleInput).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByText('This field is required.').first()).toBeVisible();
    
  });
});
