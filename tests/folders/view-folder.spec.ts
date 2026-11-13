import { faker } from '@faker-js/faker';
import { expect, test } from '../../fixtures';

test.describe('Folders - View', () => {
  
  test.beforeEach(async ({ folderPage }) => {
    await folderPage.gotoList();
  });

  test('should open folder details view from list', async ({ folderPage, page }) => {
    // Arrange
    const folderName = `folder-view-${faker.string.alphanumeric(10).toLowerCase()}`;

    // Create the folder first so the details view has a deterministic target.
    await folderPage.createFolder(folderName);
    await expect(page).toHaveURL(/\/folder(\?.*)?$/);
    
    // Keep newest rows first to find the fresh record quickly.
    await page.goto('/folder?page=1&sort=id,desc');
    await expect(folderPage.folderRowByName(folderName)).toHaveCount(1);

    // Act
    await folderPage.clickDetailsByName(folderName);

    // Assert
    await expect(page).toHaveURL(/\/folder\/\d+$/);
  });
});
