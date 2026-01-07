import { test, expect } from '@playwright/test';
import { BuildPage } from '../pages/Build.page.js';

test.describe('Build Page Exploration', () => {
  let buildPage;

  test.beforeEach(async ({ page }) => {
    buildPage = new BuildPage(page);
    await buildPage.goto();
  });

  test('Main image is visible and loaded', async () => {
    await buildPage.verifyPrincipalImageLoaded();
  });

  test('Carousel functionality works forward and backward', async () => {
    await buildPage.clickNextImage();
    await expect(buildPage.imageDisplayOrder()).toHaveText(/^2 \/ \d+$/);
    await buildPage.clickPrevImage();
    await expect(buildPage.imageDisplayOrder()).toHaveText(/^1 \/ \d+$/);
  });

  test('Build details are visible', async () => {
    await buildPage.verifyBuildDetails();
  })

  test('Support Me link correctly navigates to the support page', async () => {
    await buildPage.clickSupportMeLink();
    await expect(buildPage.page).toHaveURL(/\/support/);
  });

  test('Back to Gallery link correctly navigates to the gallery page', async () => {
    await buildPage.clickBackToGalleryLink();
    await expect(buildPage.page).toHaveURL(/\/#gallery/);
  });
});
