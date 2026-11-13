import { expect, test } from '../../fixtures';

test.describe('Folders - Create', () => {
    
    test.describe.configure({ mode: 'serial' });
  
    test.beforeEach(async ({ folderPage }) => {
      await folderPage.gotoList();
    });

    test('should create a new folder successfully', async ({ folderPage, page }) => {

      // Arrange
      const folderName = `folder-${Date.now()}`;

      // Act
      await folderPage.clickCreateNewFolder();
      await expect(page).toHaveURL(/\/folder\/new$/);

      await folderPage.fillName(folderName);
      await folderPage.clickSave();

      // Assert
      await expect(page).toHaveURL(/\/folder(\?.*)?$/);
      await expect(folderPage.toastAlert).toBeVisible();
      // Sort by latest id so the newly created folder is visible on first page.
      await page.goto('/folder?page=1&sort=id,desc');
      await expect(page.getByRole('button', { name: /refresh list/i })).toBeEnabled();
      await expect(folderPage.folderRowByName(folderName)).toHaveCount(1);
    });

    test('generate 50 folders', async ({ folderPage }) => {
      test.setTimeout(5 * 60 * 1000);

      const runId = Date.now();

      for (let iteration = 1; iteration <= 50; iteration++) {
        const folderName = `folder-bulk-${runId}-${iteration}`;

        await folderPage.createFolder(folderName);
      }
      
    });

    test('should cancel folder creation and return to folders list', async ({ folderPage, page }) => {
      // Arrange
      const folderName = `folder-cancel-${Date.now()}`;
    
      // Act
      await folderPage.clickCreateNewFolder();
      await expect(page).toHaveURL(/\/folder\/new$/);
    
      await folderPage.fillName(folderName);
      await folderPage.clickBack();
    
      // Assert
      await expect(page).toHaveURL(/\/folder(\?.*)?$/);
      await expect(folderPage.folderRowByName(folderName)).toHaveCount(0);
    });

    test('should show name required validation on blur (known bug)', async ({ folderPage, page }) => {
      // Known issue: required validation does not trigger reliably on blur.
      test.fail(
        true,
        'BUG-002: Name required validation is not shown when leaving the Name field empty.'
      );

      // Act
      await folderPage.clickCreateNewFolder();
      await expect(page).toHaveURL(/\/folder\/new$/);
    
      await folderPage.fillName('');
      await folderPage.nameInput.focus();
      await page.keyboard.press('Tab');

      // Assert
      await expect(folderPage.nameRequiredError).toHaveText(/name is required\./i);
  });


});