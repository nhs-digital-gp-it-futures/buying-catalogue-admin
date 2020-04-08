import { createTestHarness } from '../../test-utils/testHarness';
import content from './manifest.json';
import { publicBrowseBaseUrl } from '../../config';

const setup = {
  template: {
    path: 'pages/dashboard/template.njk',
  },
};

const context = {
  ...content,
  organisations: [
    [{
      data: 'A lovely organisation',
      href: '/organisations/org1',
      dataTestId: 'org-name-org1',
    },
    {
      data: 'ODS1',
      dataTestId: 'ods-code-org1',
    }],
    [{
      data: 'Another lovely organisation',
      href: '/organisations/org2',
      dataTestId: 'org-name-org2',
    },
    {
      data: 'ODS2',
      dataTestId: 'ods-code-org2',
    }],
  ],
  addOrgButtonHref: '/organisations/find',
};

describe('organisations dashboard page', () => {
  it('should render a backLink to public browse', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const homepageBackLink = $('[data-test-id="go-back-link"]');
      expect(homepageBackLink.length).toEqual(1);
      expect(homepageBackLink.text().trim()).toEqual('Go back to previous page');
      expect($(homepageBackLink).find('a').attr('href')).toEqual(`${publicBrowseBaseUrl}back-from-admin`);
    });
  }));

  it('should render a title', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const title = $('h1[data-test-id="org-dashboard-title"]');
      expect(title.length).toEqual(1);
      expect(title.text().trim()).toEqual(content.title);
    });
  }));

  it('should render a description', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const description = $('[data-test-id="org-dashboard-description"]');
      expect(description.length).toEqual(1);
      expect(description.text().trim()).toEqual(content.description);
    });
  }));

  it('should render a add organisation button', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const button = $('[data-test-id="add-org-button"] a');
      expect(button.length).toEqual(1);
      expect(button.text().trim()).toEqual(content.addOrgButtonText);
      expect(button.attr('href')).toEqual(context.addOrgButtonHref);
    });
  }));

  it('should render the table component with data', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const orgTable = $('[data-test-id="org-table"]');
      const columnHeading1 = orgTable.find('[data-test-id="column-heading-0"]');
      const columnHeading2 = orgTable.find('[data-test-id="column-heading-1"]');
      const row1 = $('[data-test-id="table-row-0"]');
      const row1OrgName = row1.find('a[data-test-id="org-name-org1"]');
      const row1OdsCode = row1.find('div[data-test-id="ods-code-org1"]');
      const row2 = $('[data-test-id="table-row-1"]');
      const row2OrgName = row2.find('a[data-test-id="org-name-org2"]');
      const row2OdsCode = row2.find('div[data-test-id="ods-code-org2"]');

      expect(orgTable.length).toEqual(1);
      expect(orgTable.find('[data-test-id="table"]').length).toEqual(1);
      expect(orgTable.find('[data-test-id="table-headings"]').length).toEqual(1);
      expect(columnHeading1.length).toEqual(1);
      expect(columnHeading1.text().trim()).toEqual(content.columnInfo[0].data);
      expect(columnHeading2.length).toEqual(1);
      expect(columnHeading2.text().trim()).toEqual(content.columnInfo[1].data);
      expect(row1.length).toEqual(1);
      expect(row1OrgName.length).toEqual(1);
      expect(row1OrgName.text().trim()).toEqual('A lovely organisation');
      expect(row1OrgName.attr('href')).toEqual('/organisations/org1');
      expect(row1OdsCode.length).toEqual(1);
      expect(row1OdsCode.text().trim()).toEqual('ODS1');
      expect(row2.length).toEqual(1);
      expect(row2OrgName.length).toEqual(1);
      expect(row2OrgName.text().trim()).toEqual('Another lovely organisation');
      expect(row2OrgName.attr('href')).toEqual('/organisations/org2');
      expect(row2OdsCode.length).toEqual(1);
      expect(row2OdsCode.text().trim()).toEqual('ODS2');
    });
  }));
});
