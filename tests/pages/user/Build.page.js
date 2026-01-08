import { expect } from '@playwright/test';

export class BuildPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/builds/yoda-pilot');
  }

  //Locators
  //Back to Gallery
  backToGalleryLink = () => this.page.getByRole('link', { name: 'Back to Gallery' });

  //Main Image
  mainImageContainer = () => this.page.locator('.aspect-square.rounded-2xl');
  principalImage = () => this.mainImageContainer().locator('img[alt]');
  nextImageButton = () =>
    this.mainImageContainer().getByLabel('Next image', { exact: true });
  prevImageButton = () =>
    this.mainImageContainer().getByLabel('Previous image', { exact: true });
  imageDisplayOrder = () =>
    this.mainImageContainer().locator('.absolute.bottom-4');

  // Build details
  publishedDate = () => this.page.locator('div.hidden.lg\\:block', {hasText: 'Published December 5, 2025'});
  buildTitle = () => this.page.getByRole('heading', { name: 'Yoda Pilot' }).filter({ visible: true });
  storyHeader = () => this.page.getByRole('heading', { name: 'The Story' });
  storyBody = () => this.page.getByText('Helicopter with baby Yoda');
  piecesCount = () => this.page.getByText('255pieces');
  startedDate = () => this.page.getByText('December 3, 2025Started');
  completedDate = () => this.page.getByText('December 4, 2025Completed');

  supportMeLink = () => this.page.getByRole('link', { name: 'Support Me' });

  //Actions
  // Main Image Carousel
  async verifyPrincipalImageLoaded() {
    const image = this.principalImage();
    await expect(image).toBeVisible();
    const naturalWidth = await image.evaluate((img) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  }
  async clickNextImage() {
    await this.nextImageButton().click();
  }
  async clickPrevImage() {
    await this.prevImageButton().click();
  }

  // Build details (Data pulled from Supabase)
  async verifyBuildDetails() {
    await expect(this.publishedDate()).toBeVisible();
    await expect(this.buildTitle()).toBeVisible();
    await expect(this.storyHeader()).toBeVisible();
    await expect(this.storyBody()).toBeVisible();
    await expect(this.piecesCount()).toBeVisible();
    await expect(this.startedDate()).toBeVisible();
    await expect(this.completedDate()).toBeVisible();
  }

  // Links
  async clickSupportMeLink() {
    await this.supportMeLink().click();
  }

  async clickBackToGalleryLink() {
    await this.backToGalleryLink().click();
  }

}
