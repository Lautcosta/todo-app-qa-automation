import { expect, test } from '../../fixtures';

test.describe('Folders - Delete', () => {
  
  test.beforeEach(async ({ folderPage }) => {
    await folderPage.gotoList();
  });

  test('should delete a folder successfully', async ({ folderPage, page }) => {
    // Arrange
    const folderName = `folder-delete-${Date.now()}`;
    await folderPage.createFolder(folderName);
    
    await expect(page).toHaveURL(/\/folder(\?.*)?$/);
  
    await expect(folderPage.folderRowByName(folderName)).toHaveCount(1);

    // Act
    await folderPage.clickDeleteByName(folderName);
    await expect(folderPage.deleteDialogHeading).toBeVisible();

    await folderPage.confirmDelete();

    // Assert
    await expect(folderPage.folderDeletedToast).toBeVisible();
    await expect(folderPage.folderRowByName(folderName)).toHaveCount(0);
  });
});
