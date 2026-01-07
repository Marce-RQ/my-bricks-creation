import { test, expect } from '@playwright/test';
import { MainPage } from '../../pages/user/MainPage.page.js';

test.describe('User portal main landing page', () => {
  let mainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
  });

  test('header brand logo navigates to home page', async ({ page }) => {
    await page.goto('/my-story');
    await mainPage.clickHeaderBrandLogo();
    await expect(mainPage.mainHeadingEnglish()).toBeVisible();
  });

  test('change language feature works', async ({ page }) => {
    await mainPage.clickLanguageSwitcher();
    await mainPage.selectSpanishLanguage();
    await expect(mainPage.mainHeadingSpanish()).toContainText('Hola');
    await mainPage.clickLanguageSwitcher();
    await mainPage.selectEnglishLanguage();
    await expect(mainPage.mainHeadingEnglish()).toContainText('Hi');
  });

  test('explore Gallery link navigates to gallery section', async ({
    page,
  }) => {
    await mainPage.clickExploreGalleryLink();
    // Assuming gallery section has id 'gallery'
    await expect(
      page.locator('text=Each build is a new adventure')
    ).toBeInViewport();
  });

  test('My Story link navigates to My Story section', async ({ page }) => {
    await mainPage.clickMyStoryLink();
    await expect(page).toHaveURL(/\/(my-story|quien-soy)/);
  });

  test("Builds' counters display visible numeric values", async ({ page }) => {
    await expect(mainPage.creationCounter()).toHaveText(/\d+/);
    await expect(mainPage.totalPiecesCounter()).toHaveText(/\d+/);
  });

  test("View Build button navigates to specific build's page", async ({
    page,
  }) => {
    await mainPage.clickYodaViewBuildButton();
    await expect(page).toHaveURL(/\/builds\/yoda-pilot/);
  });

  test.only("Build's image is visible and loaded", async ({ page }) => {
    await mainPage.verifyYodaPilotImageLoaded();
  });

  test('Support My Journey link navigates to support page', async ({
    page,
  }) => {
    await mainPage.clickSupportMyJourneyLink();
    await expect(page).toHaveURL(/\/support/);
  });

  test('Footers links navigate to correct pages', async ({ page }) => {});
});
