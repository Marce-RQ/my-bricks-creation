export class MyStory {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/my-story');
  }

  //Locators : To be implemented after page developement
  //Actions : To be implemented after page developement
}
