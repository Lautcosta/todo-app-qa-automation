import { test, expect } from '../../fixtures';

test.use({ storageState: 'playwright/.auth/user.json' });

test('logout successfully from account dropdown', async ({ logoutPage, page }) => {
  // Arrange
  await logoutPage.gotoHome();

  // Act
  await logoutPage.logout();

  // Assert
  await expect(page).toHaveURL(/\/logout$/);
  await expect(logoutPage.logoutSuccessHeading).toBeVisible();
});