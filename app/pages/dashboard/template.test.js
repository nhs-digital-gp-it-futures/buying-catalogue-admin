import { createTestHarness } from '../../test-utils/testHarness';
import context from './manifest.json';

context.backLinkHref = '/';

const setup = {
  template: {
    path: 'pages/dashboard/template.njk',
  },
};

describe('organisations dashboard page', () => {
  it('should render a backLink to the home page', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const homepageBackLink = $('[data-test-id="go-back-link"]');
      expect(homepageBackLink.length).toEqual(1);
      expect(homepageBackLink.text().trim()).toEqual('Go back to previous page');
      expect($(homepageBackLink).find('a').attr('href')).toEqual('/');
    });
  }));

  it('should render a title', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const title = $('h1[data-test-id="org-dashboard-title"]');
      expect(title.length).toEqual(1);
      expect(title.text().trim()).toEqual(context.title);
    });
  }));

  it('should render a description', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const description = $('[data-test-id="org-dashboard-description"]');
      expect(description.length).toEqual(1);
      expect(description.text().trim()).toEqual(context.description);
    });
  }));

  it('should render a add organisation button', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const addOrgButton = $('[data-test-id="add-org-button"] a');
      expect(addOrgButton.length).toEqual(1);
      expect(addOrgButton.text().trim()).toEqual(context.addOrgButtonText);
      expect(addOrgButton.attr('href')).toEqual('#');
    });
  }));

  it('should render the table component', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const orgTable = $('[data-test-id="org-table"]');
      expect(orgTable.length).toEqual(1);
      expect(orgTable.find('[data-test-id="table"]').length).toEqual(1);
      expect(orgTable.find('[data-test-id="table-headings"]').length).toEqual(1);
      expect(orgTable.find('[data-test-id="column-heading"]').length).toEqual(2);
      // TODO: Add tests to check the organisations data comes through
    });
  }));
});
