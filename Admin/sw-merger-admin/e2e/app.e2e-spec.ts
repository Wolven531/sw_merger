import { SwMergerAdminPage } from './app.po';

describe('sw-merger-admin App', () => {
  let page: SwMergerAdminPage;

  beforeEach(() => {
    page = new SwMergerAdminPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
