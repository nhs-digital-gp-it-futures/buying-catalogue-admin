import { componentTester, snapshotTest } from '../../test-utils/componentTester';

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
  relatedOrgs: [
    [
      {
        data: 'Yorkshire and Humber – H&J Commissioning Hub',
        dataTestId: 'related-org-name-348a04d0-1f3e-49d5-b652-2e9db4c2d423',
      },
      {
        data: '14N',
        dataTestId: 'related-org-odsCode-348a04d0-1f3e-49d5-b652-2e9db4c2d423',
      },
      {
        href: '/admin/organisations/removeproxy/b7ee5261-43e7-4589-907b-5eef5e98c085/348a04d0-1f3e-49d5-b652-2e9db4c2d423',
        data: 'Remove',
        dataTestId: 'related-org-remove-348a04d0-1f3e-49d5-b652-2e9db4c2d423',
      },
    ],
    [
      {
        data: 'Yorkshire and Humber Commissioning Hub',
        dataTestId: 'related-org-name-2459261a-d8f0-464a-bff7-45b2d7adb1ef',
      },
      {
        data: '13V',
        dataTestId: 'related-org-odsCode-2459261a-d8f0-464a-bff7-45b2d7adb1ef',
      },
      {
        href: '/admin/organisations/removeproxy/b7ee5261-43e7-4589-907b-5eef5e98c085/2459261a-d8f0-464a-bff7-45b2d7adb1ef',
        data: 'Remove',
        dataTestId: 'related-org-remove-2459261a-d8f0-464a-bff7-45b2d7adb1ef',
      },
    ],
  ],
  editOrgButtonHref: '/organisations/org1/edit',
};

const mockContext = {
  ...mockData,
  backLinkHref: '/organisations',
};

describe('organisations dashboard page', () => {
  it('the page should render', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const snapshot = snapshotTest($, '[data-test-id="main-content"]');
      expect(snapshot).toMatchSnapshot();
    });
  }));

  it('should render the agreement signed statement', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const agreementSigned = $('[data-test-id="agreement-signed-statement"]');
      expect(agreementSigned.text().trim()).toEqual('Organisation End User Agreement has been signed');
    });
  }));

  it('should render the agreement not signed statement', componentTester(setup, (harness) => {
    harness.request({ ...mockContext, agreementSigned: false }, ($) => {
      const agreementSigned = $('[data-test-id="agreement-signed-statement"]');
      expect(agreementSigned.text().trim()).toEqual('Organisation End User Agreement has not been signed');
    });
  }));
});
