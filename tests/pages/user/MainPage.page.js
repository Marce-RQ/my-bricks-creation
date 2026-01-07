import { expect } from '@playwright/test';

export class MainPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  //Locators
  //Header
  headerBrandLogo = () =>
    this.page.getByRole('img', { name: 'Header Brand Image' });
  languageSwitcher = () =>
    this.page.getByRole('button', {
      name: 'Change language',
    });
  englishLanguageOption = () =>
    this.page.getByRole('button', {
      name: 'English',
    });
  spanishLanguageOption = () =>
    this.page.getByRole('button', {
      name: 'Español',
    });

  //Hero Section
  mainHeadingEnglish = () =>
    this.page.getByRole('heading', { name: "Hi, I'm a" });
  mainHeadingSpanish = () =>
    this.page.getByRole('heading', { name: 'Hola, soy un' });
  exploreGalleryLink = (name) =>
    this.page.getByRole('link', { name: 'Explore Gallery', exact: true });
  myStoryLink = (name) => this.page.getByRole('link', { name: '👤 My Story' });
  creationCounter = () => this.page.getByLabel('creation-counter');
  totalPiecesCounter = () => this.page.getByLabel('pieces-counter');

  //My Creations Section
  yodaPilotImage = () => this.page.locator('img[alt="Yoda Pilot"]');
  yodaViewBuildButton = () =>
    this.page.locator('a[href*="/builds/yoda-pilot"]');

  enjoyMyCreationsHeader = () =>
    this.page.getByRole('heading', { name: 'Enjoyed my creations?' });

  supportMyJourneyLink = () =>
    this.page.locator('a.btn-primary[href*="/support"]');

  //Actions
  async clickHeaderBrandLogo() {
    await this.headerBrandLogo().click();
  }

  async clickExploreGalleryLink() {
    await this.exploreGalleryLink().click();
  }

  async clickMyStoryLink() {
    await this.myStoryLink().click();
  }

  async clickLanguageSwitcher() {
    await this.languageSwitcher().click();
  }

  async selectEnglishLanguage() {
    await this.englishLanguageOption().click();
  }

  async selectSpanishLanguage() {
    await this.spanishLanguageOption().click();
  }

  async verifyYodaPilotImageLoaded() {
    const image = this.yodaPilotImage();
    await expect(image).toBeVisible();
    // Ensure the image has loaded from the server successfully
    const naturalWidth = await image.evaluate((img) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  }

  async clickYodaViewBuildButton() {
    await this.yodaViewBuildButton().click();
  }

  async clickSupportMyJourneyLink() {
    await this.supportMyJourneyLink().click();
  }
}
