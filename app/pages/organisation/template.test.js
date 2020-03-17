import { createTestHarness } from '../../test-utils/testHarness';
import manifest from './manifest.json';

const setup = {
  template: {
    path: 'pages/organisation/template.njk',
  },
};
const mockData = {
  organisationId: 'org1',
  orgName: 'Greater Manchester CCG',
  odsCode: 'X01',
  primaryRoleId: 'ID123',
  address: ['12 Station Road', 'Leeds', 'West Yorkshire', 'LS15 5FG'],
  isCatalogueAgreementSigned: true,
  agreementSigned: true,
  addUserButtonHref: '/organisations/org1/adduser',
  users: [
    [{
      data: 'John Smith',
    }, {
      data: '07777777777',
    }, {
      data: 'john.smith@email.com',
    }, {
      tag: false,
    }],
    [{
      userId: 'user2',
    }, {
      data: 'Daisy Chain',
    }, {
      data: '07777777778',
    }, {
      data: 'daisy.chain@email.com',
    }, {
      tag: {
        dataTestId: 'account-disabled-tag-user2',
        classes: 'bc-c-tag-outline nhsuk-u-font-size-16',
        text: 'ACCOUNT DISABLED',
      },
    }],
  ],
};

const mockContext = {
  ...manifest,
  ...mockData,
};

describe('organisations dashboard page', () => {
  it('should render a backLink to the dashboard page', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const homepageBackLink = $('[data-test-id="go-back-link"]');
      expect(homepageBackLink.length).toEqual(1);
      expect(homepageBackLink.text().trim()).toEqual('Back');
      expect($(homepageBackLink).find('a').attr('href')).toEqual('/organisations');
    });
  }));

  it('should render a title', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const title = $('h1[data-test-id="org-page-title"]');
      expect(title.length).toEqual(1);
      expect(title.text().trim()).toEqual(mockContext.orgName);
    });
  }));

  it('should render a description', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const description = $('[data-test-id="org-page-description"]');
      expect(description.length).toEqual(1);
      expect(description.text().trim()).toEqual(mockContext.description);
    });
  }));

  it('should render a organisation details subheading', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const subheading = $('h3[data-test-id="organisation-details-subheading"]');
      expect(subheading.length).toEqual(1);
      expect(subheading.text().trim()).toEqual(mockContext.orgSubheading);
    });
  }));

  it('should render a edit organisation button', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const addOrgButton = $('[data-test-id="edit-org-button"] a');
      expect(addOrgButton.length).toEqual(1);
      expect(addOrgButton.text().trim()).toEqual(mockContext.editOrgButtonText);
      expect(addOrgButton.attr('href')).toEqual('#');
    });
  }));

  it('should render ods code', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const odsCodeHeading = $('[data-test-id="org-page-ods-code-heading"]');
      const odsCode = $('[data-test-id="org-page-ods-code"]');
      expect(odsCodeHeading.length).toEqual(1);
      expect(odsCodeHeading.text().trim()).toEqual(mockContext.odsCodeHeading);
      expect(odsCode.length).toEqual(1);
      expect(odsCode.text().trim()).toEqual(mockContext.odsCode);
    });
  }));

  it('should render primary role id', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const primaryRoleIdHeading = $('[data-test-id="org-page-primary-role-id-heading"]');
      const primaryRoleId = $('[data-test-id="org-page-primary-role-id"]');
      expect(primaryRoleIdHeading.length).toEqual(1);
      expect(primaryRoleIdHeading.text().trim()).toEqual(mockContext.primaryRoleIdHeading);
      expect(primaryRoleId.length).toEqual(1);
      expect(primaryRoleId.text().trim()).toEqual(mockContext.primaryRoleId);
    });
  }));

  it('should render address', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const addressHeading = $('[data-test-id="org-page-address-heading"]');
      const address1 = $('[data-test-id="org-page-address-1"]');
      const address2 = $('[data-test-id="org-page-address-2"]');
      const address3 = $('[data-test-id="org-page-address-3"]');
      const address4 = $('[data-test-id="org-page-address-4"]');
      expect(addressHeading.length).toEqual(1);
      expect(addressHeading.text().trim()).toEqual(mockContext.addressHeading);
      expect(address1.length).toEqual(1);
      expect(address1.text().trim()).toEqual(mockContext.address[0]);
      expect(address2.length).toEqual(1);
      expect(address2.text().trim()).toEqual(mockContext.address[1]);
      expect(address3.length).toEqual(1);
      expect(address3.text().trim()).toEqual(mockContext.address[2]);
      expect(address4.length).toEqual(1);
      expect(address4.text().trim()).toEqual(mockContext.address[3]);
    });
  }));

  it('should render a agreement signed checked statement', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const agreementSigned = $('[data-test-id="agreement-signed-checked-statement"]');
      expect(agreementSigned.length).toEqual(1);
      expect(agreementSigned.text().trim()).toEqual(mockContext.agreementSignedText);
    });
  }));

  it('should render an accounts subheading with org name', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const subheading = $('h3[data-test-id="accounts-subheading"]');
      expect(subheading.length).toEqual(1);
      expect(subheading.text().trim()).toEqual(`${mockContext.accountsSubheading} ${mockContext.orgName}`);
    });
  }));

  it('should render an add user button', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const addOrgButton = $('[data-test-id="add-user-button"] a');
      expect(addOrgButton.length).toEqual(1);
      expect(addOrgButton.text().trim()).toEqual(mockContext.addUserButtonText);
      expect(addOrgButton.attr('href')).toEqual(`/organisations/${mockContext.organisationId}/adduser`);
    });
  }));

  it('should render the table component', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const orgTable = $('[data-test-id="user-table"]');
      expect(orgTable.length).toEqual(1);
      expect(orgTable.find('[data-test-id="table"]').length).toEqual(1);
      expect(orgTable.find('[data-test-id="table-headings"]').length).toEqual(1);
      expect(orgTable.find('[data-test-id="column-heading"]').length).toEqual(mockContext.columnInfo.length);
    });
  }));
});
