import { componentTester } from '../../test-utils/componentTester';
import manifest from './manifest.json';

const setup = {
  template: {
    path: 'pages/organisation/template.njk',
  },
};
const mockData = {
  organisationId: 'org1',
  organisationName: 'Greater Manchester CCG',
  odsCode: 'X01',
  primaryRoleId: 'ID123',
  address: ['12 Station Road', 'Leeds', 'West Yorkshire', 'LS15 5FG'],
  agreementSigned: true,
  addUserButtonHref: '/organisations/org1/adduser',
  users: [
    [{
      data: 'John Smith',
      href: '/organisations/org1/user1',
      dataTestId: 'user-name-user1',
    }, {
      data: '07777777777',
      dataTestId: 'user-phone-user1',
    }, {
      data: 'john.smith@email.com',
      dataTestId: 'user-email-user1',
    }, {
      tag: false,
    }],
    [{
      data: 'Daisy Chain',
      href: '/organisations/org1/user2',
      dataTestId: 'user-name-user2',
    }, {
      data: '07777777778',
      dataTestId: 'user-phone-user2',
    }, {
      data: 'daisy.chain@email.com',
      dataTestId: 'user-email-user2',
    }, {
      tag: {
        dataTestId: 'account-disabled-tag-user2',
        classes: 'bc-c-tag-outline nhsuk-u-font-size-16',
        text: 'ACCOUNT DISABLED',
      },
    }],
  ],
  editOrgButtonHref: '/organisations/org1/edit',
};

const mockContext = {
  ...manifest,
  ...mockData,
  backLinkHref: '/organisations',
};

describe('organisations dashboard page', () => {
  it('should render a backLink to the dashboard page', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const homepageBackLink = $('[data-test-id="go-back-link"]');
      expect(homepageBackLink.length).toEqual(1);
      expect(homepageBackLink.text().trim()).toEqual('Back');
      expect($(homepageBackLink).find('a').attr('href')).toEqual('/organisations');
    });
  }));

  it('should render a title', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const title = $('h1[data-test-id="org-page-title"]');
      expect(title.length).toEqual(1);
      expect(title.text().trim()).toEqual(mockContext.organisationName);
    });
  }));

  it('should render a description', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const description = $('[data-test-id="org-page-description"]');
      expect(description.length).toEqual(1);
      expect(description.text().trim()).toEqual(mockContext.description);
    });
  }));

  it('should render a organisation details subheading', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const subheading = $('h3[data-test-id="organisation-details-subheading"]');
      expect(subheading.length).toEqual(1);
      expect(subheading.text().trim()).toEqual(mockContext.orgSubheading);
    });
  }));

  it('should render an edit organisation button', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const editOrgButton = $('[data-test-id="edit-org-button"] a');
      expect(editOrgButton.length).toEqual(1);
      expect(editOrgButton.text().trim()).toEqual(mockContext.editOrgButtonText);
      expect(editOrgButton.attr('href')).toEqual('/organisations/org1/edit');
    });
  }));

  it('should render ods code', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const odsCodeHeading = $('[data-test-id="org-page-ods-code-heading"]');
      const odsCode = $('[data-test-id="org-page-ods-code"]');
      expect(odsCodeHeading.length).toEqual(1);
      expect(odsCodeHeading.text().trim()).toEqual(mockContext.odsCodeHeading);
      expect(odsCode.length).toEqual(1);
      expect(odsCode.text().trim()).toEqual(mockContext.odsCode);
    });
  }));

  it('should render primary role id', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const primaryRoleIdHeading = $('[data-test-id="org-page-primary-role-id-heading"]');
      const primaryRoleId = $('[data-test-id="org-page-primary-role-id"]');
      expect(primaryRoleIdHeading.length).toEqual(1);
      expect(primaryRoleIdHeading.text().trim()).toEqual(mockContext.primaryRoleIdHeading);
      expect(primaryRoleId.length).toEqual(1);
      expect(primaryRoleId.text().trim()).toEqual(mockContext.primaryRoleId);
    });
  }));

  it('should render address', componentTester(setup, (harness) => {
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

  it('should render a agreement signed checked statement', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const agreementSigned = $('[data-test-id="agreement-signed-checked-statement"]');
      expect(agreementSigned.length).toEqual(1);
      expect(agreementSigned.text().trim()).toEqual(mockContext.agreementSignedText);
    });
  }));

  it('should render an accounts subheading with org name', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const subheading = $('h3[data-test-id="accounts-subheading"]');
      expect(subheading.length).toEqual(1);
      expect(subheading.text().trim()).toEqual(`${mockContext.accountsSubheading} ${mockContext.organisationName}`);
    });
  }));

  it('should render an add user button', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const button = $('[data-test-id="add-user-button"] a');
      expect(button.length).toEqual(1);
      expect(button.text().trim()).toEqual(mockContext.addUserButtonText);
      expect(button.attr('href')).toEqual(`/organisations/${mockContext.organisationId}/adduser`);
    });
  }));

  it('should render an add organisation button', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const button = $('[data-test-id="add-organisation-button"] a');
      expect(button.length).toEqual(1);
    });
  }));

  it('should render the table component with data', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const userTable = $('[data-test-id="user-table"]');
      const columnHeading1 = userTable.find('[data-test-id="column-heading-0"]');
      const columnHeading2 = userTable.find('[data-test-id="column-heading-1"]');
      const columnHeading3 = userTable.find('[data-test-id="column-heading-2"]');
      const columnHeading4 = userTable.find('[data-test-id="column-heading-3"]');
      const row1 = $('[data-test-id="table-row-0"]');
      const row1Name = row1.find('a');
      const row1Phone = row1.find('[data-test-id="user-phone-user1"]');
      const row1Email = row1.find('[data-test-id="user-email-user1"]');
      const row1Tag = row1.find('[data-test-id="account-disabled-tag-user1"]');
      const row2 = $('[data-test-id="table-row-1"]');
      const row2Name = row2.find('a');
      const row2Phone = row2.find('[data-test-id="user-phone-user2"]');
      const row2Email = row2.find('[data-test-id="user-email-user2"]');
      const row2Tag = row2.find('[data-test-id="account-disabled-tag-user2"]');

      expect(userTable.length).toEqual(1);
      expect(userTable.find('[data-test-id="table"]').length).toEqual(1);
      expect(userTable.find('[data-test-id="table-headings"]').length).toEqual(1);
      expect(columnHeading1.length).toEqual(1);
      expect(columnHeading1.text().trim()).toEqual(manifest.columnInfo[0].data);
      expect(columnHeading2.length).toEqual(1);
      expect(columnHeading2.text().trim()).toEqual(manifest.columnInfo[1].data);
      expect(columnHeading3.length).toEqual(1);
      expect(columnHeading3.text().trim()).toEqual(manifest.columnInfo[2].data);
      expect(columnHeading4.length).toEqual(1);
      expect(columnHeading4.text().trim()).toEqual('');
      expect(row1Name.length).toEqual(1);
      expect(row1Name.text().trim()).toEqual('John Smith');
      expect(row1Name.attr('href')).toEqual('/organisations/org1/user1');
      expect(row1Phone.length).toEqual(1);
      expect(row1Phone.text().trim()).toEqual('07777777777');
      expect(row1Email.length).toEqual(1);
      expect(row1Email.text().trim()).toEqual('john.smith@email.com');
      expect(row1Tag.length).toEqual(0);
      expect(row2Name.length).toEqual(1);
      expect(row2Name.text().trim()).toEqual('Daisy Chain');
      expect(row2Name.attr('href')).toEqual('/organisations/org1/user2');
      expect(row2Phone.length).toEqual(1);
      expect(row2Phone.text().trim()).toEqual('07777777778');
      expect(row2Email.length).toEqual(1);
      expect(row2Email.text().trim()).toEqual('daisy.chain@email.com');
      expect(row2Tag.length).toEqual(1);
      expect(row2Tag.text().trim()).toEqual('ACCOUNT DISABLED');
    });
  }));
});
