import { test, expect } from '@playwright/test';
import { Dashboard } from '../../pages/admin/Dashboard.page.js';

test.describe('Admin Dashboard', () => {
  let dashboard;

  test.beforeEach(async ({ page }) => {
    dashboard = new Dashboard(page);
    await dashboard.goto();
    await dashboard.waitForLoad();
  });

  test.only('should display navigation, stats, quick actions, and storage widgets', async () => {
    await expect(dashboard.adminPanelLink()).toBeVisible();
    await expect(dashboard.dashboardNavLink()).toBeVisible();
    await expect(dashboard.postsNavLink()).toBeVisible();
    await expect(dashboard.userSiteNavLink()).toBeVisible();
    await expect(dashboard.logoutButton()).toBeVisible();

    await expect(dashboard.welcomeHeading()).toBeVisible();
    await expect(dashboard.totalBuildsCard()).toBeVisible();
    await expect(dashboard.publishedCard()).toBeVisible();
    await expect(dashboard.draftsCard()).toBeVisible();

    await expect(dashboard.quickActionsHeading()).toBeVisible();
    await expect(dashboard.createNewBuildQuickAction()).toBeVisible();
    await expect(dashboard.managePostsQuickAction()).toBeVisible();
    await expect(dashboard.userSiteQuickAction()).toBeVisible();

    await expect(dashboard.storageUsageHeading()).toBeVisible();
    await expect(dashboard.storageUsageInfo()).toBeVisible();
  });

  test('should navigate to the new build form from header CTA', async ({ page }) => {
    await dashboard.clickNewBuildButton();
    await expect(page).toHaveURL(/\/admin\/posts\/new$/);
  });

  test('should navigate via quick actions to posts and user site', async ({ page }) => {
    await dashboard.clickManagePostsQuickAction();
    await expect(page).toHaveURL(/\/admin\/posts$/);

    await dashboard.goto();
    await dashboard.waitForLoad();
    await dashboard.clickUserSiteQuickAction();
    await expect(page).toHaveURL('/');
  });

  test('should open posts list from sidebar navigation', async ({ page }) => {
    await dashboard.clickPostsNavLink();
    await expect(page).toHaveURL(/\/admin\/posts$/);
  });

});
