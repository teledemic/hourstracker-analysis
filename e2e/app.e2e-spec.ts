import { HourstrackerAnalysisPage } from './app.po';

describe('hourstracker-analysis App', function() {
  let page: HourstrackerAnalysisPage;

  beforeEach(() => {
    page = new HourstrackerAnalysisPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
