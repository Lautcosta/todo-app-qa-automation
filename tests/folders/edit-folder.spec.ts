import { faker } from '@faker-js/faker';
import { expect, test } from '../../fixtures';

test.describe('Folders - Edit', () => {
  test.beforeEach(async ({ folderPage }) => {
    await folderPage.gotoList();
  });

  test('should edit a folder name successfully', async ({ folderPage, page }) => {
    // Arrange
    const originalName = `folder-edit-${faker.string.alphanumeric(8).toLowerCase()}`;
    const updatedName = `folder-updated-${faker.string.alphanumeric(8).toLowerCase()}`;

    // Create the folder first, then open edit from the list.
    await folderPage.createFolder(originalName);
    await page.goto('/folder?page=1&sort=id,desc');
    await expect(folderPage.folderRowByName(originalName)).toHaveCount(1);

    // Act
    await folderPage.clickEditByName(originalName);
    await expect(page).toHaveURL(/\/folder\/\d+\/edit$/);

    await folderPage.fillName(updatedName);
    await folderPage.clickSave();

    // Assert
    await expect(page).toHaveURL(/\/folder(\?.*)?$/);
    await page.goto('/folder?page=1&sort=id,desc');
    await expect(folderPage.folderRowByName(updatedName)).toHaveCount(1);
    await expect(folderPage.folderRowByName(originalName)).toHaveCount(0);
    
  });
});
