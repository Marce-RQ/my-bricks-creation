import { test as setup, expect } from '@playwright/test';
import { AdminLoginPage } from './pages/admin/AdminLogin.page.js';

const authFile = 'tests/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  const adminLoginPage = new AdminLoginPage(page);
  await adminLoginPage.goto();

  // Perform your login steps
  await adminLoginPage.fillEmail(process.env.ADMIN_EMAIL);
  await adminLoginPage.fillPassword(process.env.ADMIN_PASSWORD);
  await adminLoginPage.clickSignIn();

  // Wait for successful login
  await expect(adminLoginPage.dashboardWelcomeHeader()).toBeVisible();

  // Save authentication state
  await page.context().storageState({ path: authFile });
});
