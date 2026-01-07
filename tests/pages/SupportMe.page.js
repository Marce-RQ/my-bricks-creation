export class SupportMe {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/support');
  }

  //Locators : To be implemented after page developement
  //Actions : To be implemented after page developement
}
