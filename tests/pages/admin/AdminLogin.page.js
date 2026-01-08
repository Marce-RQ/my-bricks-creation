// tests/pages/AdminLoginPage.js
export class AdminLoginPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/admin');
  }

  //Locators
  // Admin Login Form
  adminLoginTitle = () =>
    this.page.getByRole('heading', { name: 'Admin Login' });
  adminLoginTitleSpanish = () =>
    this.page.getByRole('heading', { name: 'Acceso Admin' });
  emailInput = () => this.page.getByPlaceholder('admin@example.com');
  passwordInput = () => this.page.getByPlaceholder('your password here');
  signInButton = () => this.page.getByRole('button', { name: 'Sign In' });

  // Toast Notifications
  validCredentialsNotification = () =>
    this.page.locator('div[role="status"]', { hasText: 'Welcome back!' });
  invalidCredentialsNotification = () =>
    this.page.locator('div[role="status"]', {
      hasText: 'Invalid login credentials',
    });

  dashboardWelcomeHeader = () =>
    this.page.getByRole('heading', { name: 'Welcome back!' });

  //Actions
  async fillEmail(email) {
    await this.emailInput().fill(email);
  }

  async fillPassword(password) {
    await this.passwordInput().fill(password);
  }

  async clickSignIn() {
    await this.signInButton().click();
  }
}
