import { expect } from '@playwright/test';

export class Dashboard {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/admin');
  }

  //Locators
  // Navigation Header
  adminPanelLink = () =>
    this.page.getByRole('link', { name: /.*Admin Panel/i });
  dashboardNavLink = () =>
    this.page.getByRole('link', { name: /.*Dashboard/i });
  postsNavLink = () => this.page.getByRole('link', { name: /^.*Posts$/i });
  userSiteNavLink = () =>
    this.page.getByRole('link', { name: /To User Site.*/i });
  logoutButton = () => this.page.getByRole('button', { name: /Logout/i });

  // Body Header
  welcomeHeading = () =>
    this.page.getByRole('heading', { name: /Welcome Back/i });
  overviewDescription = () =>
    this.page.getByText(/overview of your Lego creations/i);
  newBuildButton = () =>
    this.page.getByRole('button', { name: 'New Build', exact: true });

  // Stats
  totalBuildsCard = () => this.page.getByText(/Total Builds/i);
  publishedCard = () => this.page.getByText(/Published/i);
  draftsCard = () => this.page.getByText(/Drafts/i);

  // Quick Actions
  quickActionsHeading = () =>
    this.page.getByRole('heading', { name: /Quick Actions/i });
  createNewBuildQuickAction = () =>
    this.page.getByRole('button', {
      name: /Create New Build/i
    }).filter({ hasText: 'Add a new creation' });
  managePostsQuickAction = () =>
    this.page.getByRole('link', {
      name: /Manage Posts/i
    }).filter({ hasText: 'Manage posts' });
  userSiteQuickAction = () =>
    this.page.getByRole('link', { name: /User Site/i }).filter({
      hasText: 'Open public gallery',
    });

  // Storage Usage
  storageUsageHeading = () =>
    this.page.getByRole('heading', { name: /Storage Usage/i });
  storageUsageInfo = () =>
    this.page.getByText(/Supabase free tier provides 1GB of storage/i);

  //Actions
  async waitForLoad() {
    await expect(this.welcomeHeading()).toBeVisible();
    await expect(this.quickActionsHeading()).toBeVisible();
  }

  async clickNewBuildButton() {
    await this.newBuildButton().click();
  }

  async clickCreateNewBuildQuickAction() {
    await this.createNewBuildQuickAction().click();
  }

  async clickManagePostsQuickAction() {
    await this.managePostsQuickAction().click();
  }

  async clickUserSiteQuickAction() {
    await this.userSiteQuickAction().click();
  }

  async clickPostsNavLink() {
    await this.postsNavLink().click();
  }
}
