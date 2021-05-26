import { componentTester, snapshotTest } from '../../test-utils/componentTester';

const setup = {
  template: {
    path: 'pages/editorg/template.njk',
  },
};

const mockData = {
  odsCode: 'X01',
  primaryRoleId: 'ID123',
  address: ['12 Station Road', 'Leeds', 'West Yorkshire', 'LS15 5FG'],
  agreementSigned: false,
  saveCatalogueAgreementPostAction: '/organisations/org1',
};

const mockContext = {
  ...mockData,
  backLinkHref: '/organisations/org1',
  csrfToken: 'mockCsrfToken',
};

describe('editorg page', () => {
  it('the page should render', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const snapshot = snapshotTest($, '[data-test-id="main-content"]');
      expect(snapshot).toMatchSnapshot();
    });
  }));

  describe('catalogue agreement signed checkbox', () => {
    it('should render a checkbox input for catalogue agreement signed', componentTester(setup, (harness) => {
      harness.request(mockContext, ($) => {
        const checkboxInput = $('[data-test-id="catalogue-agreement-checkbox"] input');
        expect(checkboxInput.length).toEqual(1);
        expect(checkboxInput.attr('id')).toEqual('catalogue-agreement-checkbox');
        expect(checkboxInput.attr('name')).toEqual('catalogueAgreementSigned');
        expect(checkboxInput.attr('type')).toEqual('checkbox');
        expect(checkboxInput.attr('checked')).toEqual(undefined);
        expect(checkboxInput.attr('value')).toEqual('catalogueAgreementSigned');
      });
    }));

    it('should render a checkbox label for catalogue agreement signed', componentTester(setup, (harness) => {
      harness.request(mockContext, ($) => {
        const checkboxLabel = $('[data-test-id="catalogue-agreement-checkbox"] label');
        expect(checkboxLabel.length).toEqual(1);
        expect(checkboxLabel.attr('for')).toEqual('catalogue-agreement-checkbox');
      });
    }));

    it('should check the checkbox if agreementSigned is true', componentTester(setup, (harness) => {
      const agreementSignedMockContext = { ...mockContext, agreementSigned: true };
      harness.request(agreementSignedMockContext, ($) => {
        const checkboxInput = $('[data-test-id="catalogue-agreement-checkbox"] input');
        expect(checkboxInput.length).toEqual(1);
        expect(checkboxInput.attr('value')).toEqual('catalogueAgreementSigned');
      });
    }));
  });
});
