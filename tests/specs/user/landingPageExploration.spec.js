import { test, expect } from '@playwright/test';
import { LandingPage } from '../../pages/user/LandingPage.page.js';

test.describe('User portal main landing page', () => {
  let landingPage;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await landingPage.goto();
  });

  test('header brand logo navigates to home page', async ({ page }) => {
    await page.goto('/my-story');
    await landingPage.clickHeaderBrandLogo();
    await expect(landingPage.mainHeadingEnglish()).toBeVisible();
  });

  test('change language feature works', async ({ page }) => {
    await landingPage.clickLanguageSwitcher();
    await landingPage.selectSpanishLanguage();
    await expect(landingPage.mainHeadingSpanish()).toContainText('Hola');
    await landingPage.clickLanguageSwitcher();
    await landingPage.selectEnglishLanguage();
    await expect(landingPage.mainHeadingEnglish()).toContainText('Hi');
  });

  test('explore Gallery link navigates to gallery section', async ({
    page,
  }) => {
    await landingPage.clickExploreGalleryLink();
    // Assuming gallery section has id 'gallery'
    await expect(
      page.locator('text=Each build is a new adventure')
    ).toBeInViewport();
  });

  test('My Story link navigates to My Story section', async ({ page }) => {
    await landingPage.clickMyStoryLink();
    await expect(page).toHaveURL(/\/(my-story|quien-soy)/);
  });

  test("Builds' counters display visible numeric values", async ({ page }) => {
    await expect(landingPage.creationCounter()).toHaveText(/\d+/);
    await expect(landingPage.totalPiecesCounter()).toHaveText(/\d+/);
  });

  test("View Build button navigates to specific build's page", async ({
    page,
  }) => {
    await landingPage.clickYodaViewBuildButton();
    await expect(page).toHaveURL(/\/builds\/yoda-pilot/);
  });

  test("Build's image is visible and loaded", async ({ page }) => {
    await page.goto('/#gallery');
    await landingPage.verifyYodaPilotImageLoaded();
  });

  test('Support My Journey link navigates to support page', async ({
    page,
  }) => {
    await landingPage.clickSupportMyJourneyLink();
    await expect(page).toHaveURL(/\/support/);
  });

  test('Footers links navigate to correct pages', async ({ page }) => {});
});
