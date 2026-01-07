import { test, expect } from '@playwright/test';
import { AdminLoginPage } from '../../pages/admin/AdminLogin.page.js';


test.describe('Admin Login Page', () => {
  let adminLoginPage;

  test.beforeEach(async ({ page }) => {
    adminLoginPage = new AdminLoginPage(page);
    await adminLoginPage.goto();
  });

  // Positive tests
  test('ENG - should load admin login page', async ({ page }) => {
    await expect(adminLoginPage.adminLoginTitle()).toHaveText('Admin Login');
  });
  
  test('SPN - should load admin login page', async ({ page }) => {
    await page.goto('/es/admin/login');
    await expect(adminLoginPage.adminLoginTitleSpanish()).toHaveText('Acceso Admin');
  });

  test('should login with valid credentials and show toast notification', async ({ page }) => {
    await adminLoginPage.fillEmail(process.env.ADMIN_EMAIL);
    await adminLoginPage.fillPassword(process.env.ADMIN_PASSWORD);
    await adminLoginPage.clickSignIn();
    
    await expect(adminLoginPage.validCredentialsNotification()).toBeVisible();
    await expect(adminLoginPage.dashboardWelcomeHeader()).toBeVisible();
  });

  // Negative tests
  test('should deny login with invalid credentials and show toast notification', async ({ page }) => {
    await adminLoginPage.fillEmail('invalid@example.com');
    await adminLoginPage.fillPassword('wrongpassword');
    await adminLoginPage.clickSignIn();
    
    await expect(page).toHaveURL(/.*\/admin\/login/);
    await expect(adminLoginPage.invalidCredentialsNotification()).toBeVisible();
  });

  test('should handle empty form submission', async ({ page }) => {
    await adminLoginPage.clickSignIn();
    await expect(adminLoginPage.dashboardWelcomeHeader()).not.toBeVisible();
    await expect(page).toHaveURL(/.*\/admin\/login/);
  });

  // Edge cases
  test('email is case in-sensitive ', async ({ page }) => {
    await adminLoginPage.fillEmail(process.env.ADMIN_EMAIL.toUpperCase());
    console.log(process.env.ADMIN_EMAIL.toUpperCase());
    await adminLoginPage.fillPassword(process.env.ADMIN_PASSWORD);
    await adminLoginPage.clickSignIn();
    
    await expect(adminLoginPage.validCredentialsNotification()).toBeVisible();
    await expect(adminLoginPage.dashboardWelcomeHeader()).toBeVisible();
  });

  test('password is case sensitive ', async ({ page }) => {
    await adminLoginPage.fillEmail(process.env.ADMIN_EMAIL);
    await adminLoginPage.fillPassword(process.env.ADMIN_PASSWORD.toUpperCase());
    console.log(process.env.ADMIN_PASSWORD.toUpperCase());
    await adminLoginPage.clickSignIn();
    
    await expect(adminLoginPage.invalidCredentialsNotification()).toBeVisible();
    await expect(adminLoginPage.dashboardWelcomeHeader()).not.toBeVisible();
  });
}); 