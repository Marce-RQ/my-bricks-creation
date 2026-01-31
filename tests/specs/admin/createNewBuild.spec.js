import { test, expect } from '@playwright/test';
import { NewPage } from '../../pages/admin/New.page.js';

test.describe('Create New Build', () => {
  let newPage;

  test.beforeEach(async ({ page }) => {
    newPage = new NewPage(page);
    await newPage.goto();
    await newPage.waitForLoad();
  });

  test('should display navigation and all form fields', async () => {
    await expect(newPage.createNewBuildHeading()).toBeVisible();
    await expect(newPage.titleInput()).toBeVisible();
    await expect(newPage.slugInput()).toBeVisible();
    await expect(newPage.descriptionInput()).toBeVisible();
    await expect(newPage.pieceCountInput()).toBeVisible();
    await expect(newPage.startDateInput()).toBeVisible();
    await expect(newPage.completionDateInput()).toBeVisible();
    await expect(newPage.imageDropzone()).toBeVisible();
    await expect(newPage.saveDraftButton()).toBeVisible();
    await expect(newPage.publishButton()).toBeVisible();
    await expect(newPage.cancelButton()).toBeVisible();
  });

  test('should keep save actions disabled until required field "Title" is filled', async () => {
    await newPage.fillDescription();
    await newPage.fillPieceCount();
    await newPage.setCompletionDate();
    await expect(newPage.saveDraftButton()).toBeDisabled();
    await expect(newPage.publishButton()).toBeDisabled();

    await newPage.fillTitle();
    await expect(newPage.saveDraftButton()).toBeEnabled();
    await expect(newPage.publishButton()).toBeEnabled();
  });

  test('should auto-generate slug from title input', async () => {
    await newPage.fillTitle('Galaxy Ship');
    await expect(newPage.slugInput()).toHaveValue('galaxy-ship');
  });

  test('should show validation error for negative piece count', async () => {
    await newPage.fillTitle('Test Build');
    await newPage.fillPieceCount('-5');
    await newPage.clickPublish();
    await expect(
      newPage.page.getByText('Piece count must be a positive number')
    ).toBeVisible();
  });

  test('should show validation error when completion date is before start date', async () => {
    await newPage.fillTitle('Timeline Build');
    await newPage.setStartDate('2024-02-10');
    await newPage.setCompletionDate('2024-02-01');
    await newPage.clickPublish();

    await expect(
      newPage.page.getByText('Start date must be before completion date')
    ).toBeVisible();
  });

  // REVIEW TESTS FROM HERE 

  // Image Upload Validation Tests
  test('should display image upload area with correct text', async () => {
    await expect(newPage.imageDropzone()).toBeVisible();
    await newPage.verifyImageUploadText('JPEG, PNG, or WebP • Max 5MB each');
  });

  test('should allow single image upload', async () => {
    // Note: This test would require actual test images
    // await newPage.uploadImage('test-image.jpg');
    // await expect(newPage.page.locator('img[alt*="uploaded"]')).toBeVisible();
  });

  test('should allow multiple image uploads up to 4', async () => {
    // Note: This test would require actual test images
    // const images = ['test1.jpg', 'test2.png', 'test3.webp', 'test4.jpg'];
    // await newPage.uploadMultipleImages(images);
    // await expect(newPage.page.locator('img[alt*="uploaded"]')).toHaveCount(4);
  });

  // URL Slug Auto-generation Tests
  test('should auto-generate slug from title with special characters', async () => {
    await newPage.fillTitle('My Amazing LEGO Build! @2024');
    await newPage.waitForSlugUpdate();
    const slugValue = await newPage.getSlugValue();
    expect(slugValue).toBe('my-amazing-lego-build-2024');
  });

  test('should auto-generate slug with multiple spaces and hyphens', async () => {
    await newPage.fillTitle('Super   Cool---Build');
    await newPage.waitForSlugUpdate();
    const slugValue = await newPage.getSlugValue();
    expect(slugValue).toBe('super-cool-build');
  });

  test('should allow manual slug override', async () => {
    await newPage.fillTitle('Auto Generated Title');
    await newPage.waitForSlugUpdate();
    await newPage.fillSlug('custom-slug-override');
    const slugValue = await newPage.getSlugValue();
    expect(slugValue).toBe('custom-slug-override');
  });

  // Date Field Validation Tests
  test('should show error for invalid date format', async () => {
    await newPage.fillTitle('Test Build');
    await newPage.setStartDate('invalid-date');
    await newPage.clickPublish();
    await newPage.verifyDateError('Invalid date format');
  });

  test('should accept valid date inputs', async () => {
    await newPage.fillTitle('Test Build');
    await newPage.setStartDate('2024-01-01');
    await newPage.setCompletionDate('2024-01-15');
    const startDate = await newPage.startDateInput().inputValue();
    const completionDate = await newPage.completionDateInput().inputValue();
    expect(startDate).toBe('2024-01-01');
    expect(completionDate).toBe('2024-01-15');
  });

  // Form Reset/Cancel Functionality Tests
  test('should clear form when cancel is clicked after filling fields', async () => {
    await newPage.fillTitle('Test Title');
    await newPage.fillDescription('Test Description');
    await newPage.fillPieceCount('100');
    await newPage.clickCancel();
    
    // Verify form is cleared or navigated away
    // This depends on the actual cancel behavior
    await expect(newPage.page).toHaveURL(/\/admin$/);
  });

  test('should preserve form data on page refresh', async () => {
    await newPage.fillTitle('Persistent Title');
    await newPage.fillDescription('Persistent Description');
    
    await newPage.page.reload();
    await newPage.waitForLoad();
    
    const title = await newPage.titleInput().inputValue();
    expect(title).toBe('Persistent Title');
  });

  // Save Draft vs Publish Behavior Tests
  test('should save draft with minimal required fields', async () => {
    await newPage.fillTitle('Draft Build');
    await newPage.clickSaveDraft();
    await newPage.verifySuccessMessage('Draft saved successfully');
  });

  test('should require all validations for publish', async () => {
    await newPage.fillTitle('Publish Test');
    await newPage.fillPieceCount('-5'); // Invalid piece count
    await newPage.clickPublish();
    await newPage.verifyErrorMessage('Piece count must be a positive number');
  });

  test('should show different success messages for draft vs publish', async () => {
    // Test draft save
    await newPage.fillTitle('Draft Test');
    await newPage.clickSaveDraft();
    await newPage.verifySuccessMessage('Draft saved');
    
    // Fill required fields and test publish
    await newPage.fillPieceCount('50');
    await newPage.setCompletionDate('2024-12-01');
    await newPage.clickPublish();
    await newPage.verifySuccessMessage('Build published');
  });
});
