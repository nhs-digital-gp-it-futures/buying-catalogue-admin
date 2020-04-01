import { createTestHarness } from '../../test-utils/testHarness';
import manifest from './manifest.json';

const setup = {
  template: {
    path: 'pages/editorg/template.njk',
  },
};

const mockData = {
  organisationName: 'Greater Manchester CCG',
  odsCode: 'X01',
  primaryRoleId: 'ID123',
  address: ['12 Station Road', 'Leeds', 'West Yorkshire', 'LS15 5FG'],
  agreementSigned: false,
  saveCatalogueAgreementPostAction: '/organisations/org1',
};

const mockContext = {
  ...manifest,
  ...mockData,
  backLinkHref: '/organisations/org1',
  csrfToken: 'mockCsrfToken',
};

describe('editorg page', () => {
  it('should render a backLink to the organisation page', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const homepageBackLink = $('[data-test-id="go-back-link"]');
      expect(homepageBackLink.length).toEqual(1);
      expect(homepageBackLink.text().trim()).toEqual('Back');
      expect($(homepageBackLink).find('a').attr('href')).toEqual(mockContext.backLinkHref);
    });
  }));

  it('should render a title', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const title = $('h1[data-test-id="edit-org-page-title"]');
      expect(title.length).toEqual(1);
      expect(title.text().trim()).toEqual(`Edit ${mockContext.organisationName}`);
    });
  }));

  it('should render a description', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const description = $('h2[data-test-id="edit-org-page-description"]');
      expect(description.length).toEqual(1);
      expect(description.text().trim()).toEqual(mockContext.description);
    });
  }));

  it('should render organisation ods code', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const heading = $('h3[data-test-id="organisation-ods-code-heading"]');
      const odsCode = $('div[data-test-id="organisation-ods-code"]');
      expect(heading.length).toEqual(1);
      expect(heading.text().trim()).toEqual(mockContext.odsCodeHeading);
      expect(odsCode.length).toEqual(1);
      expect(odsCode.text().trim()).toEqual(mockContext.odsCode);
    });
  }));

  it('should render organisation name', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const heading = $('h3[data-test-id="organisation-name-heading"]');
      const orgName = $('div[data-test-id="organisation-name"]');
      expect(heading.length).toEqual(1);
      expect(heading.text().trim()).toEqual(mockContext.organisationNameHeading);
      expect(orgName.length).toEqual(1);
      expect(orgName.text().trim()).toEqual(mockContext.organisationName);
    });
  }));

  it('should render address', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const heading = $('h3[data-test-id="organisation-address-heading"]');
      const address = $('div[data-test-id="organisation-address"]');
      const addressLines = address.find('div');
      const address1 = $('[data-test-id="organisation-address-1"]');
      const address2 = $('[data-test-id="organisation-address-2"]');
      const address3 = $('[data-test-id="organisation-address-3"]');
      const address4 = $('[data-test-id="organisation-address-4"]');

      expect(heading.length).toEqual(1);
      expect(heading.text().trim()).toEqual(mockContext.addressHeading);
      expect(address.length).toEqual(1);
      expect(addressLines.length).toEqual(mockContext.address.length);
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

  it('should render organisation primary role id', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const heading = $('h3[data-test-id="organisation-primary-role-id-heading"]');
      const primaryRoleID = $('div[data-test-id="organisation-primary-role-id"]');
      expect(heading.length).toEqual(1);
      expect(heading.text().trim()).toEqual(mockContext.primaryRoleIdHeading);
      expect(primaryRoleID.length).toEqual(1);
      expect(primaryRoleID.text().trim()).toEqual(mockContext.primaryRoleId);
    });
  }));

  describe('catalogue agreement signed checkbox', () => {
    it('should render a checkbox input for catalogue agreement signed', createTestHarness(setup, (harness) => {
      harness.request(mockContext, ($) => {
        const checkboxInput = $('input[data-test-id="catalogue-agreement-signed-checkbox"]');
        expect(checkboxInput.length).toEqual(1);
        expect(checkboxInput.attr('id')).toEqual('catalogue-agreement-checkbox');
        expect(checkboxInput.attr('name')).toEqual('catalogueagreementsigned');
        expect(checkboxInput.attr('type')).toEqual('checkbox');
        expect(checkboxInput.attr('checked')).toEqual(undefined);
        expect(checkboxInput.attr('value')).toEqual('false');
      });
    }));

    it('should render a checkbox label for catalogue agreement signed', createTestHarness(setup, (harness) => {
      harness.request(mockContext, ($) => {
        const checkboxLabel = $('label[data-test-id="catalogue-agreement-signed-label"]');
        expect(checkboxLabel.length).toEqual(1);
        expect(checkboxLabel.attr('for')).toEqual('catalogue-agreement-checkbox');
        expect(checkboxLabel.text().trim()).toEqual(mockContext.catalogueAgreementCheckboxText);
      });
    }));

    it('should check the checkbox if agreementSigned is true', createTestHarness(setup, (harness) => {
      const agreementSignedMockContext = { ...mockContext, agreementSigned: true };
      harness.request(agreementSignedMockContext, ($) => {
        const checkboxInput = $('input[data-test-id="catalogue-agreement-signed-checkbox"]');
        expect(checkboxInput.length).toEqual(1);
        expect(checkboxInput.attr('value')).toEqual('true');
      });
    }));
  });

  it('should render save button', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const saveButton = $('[data-test-id="save-button"] button');
      expect(saveButton.length).toEqual(1);
      expect(saveButton.text().trim())
        .toEqual(mockContext.saveButtonText);
    });
  }));

  it('should create form element with correct action', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const formElement = $('form');
      expect(formElement.length).toEqual(1);
      expect(formElement.attr('action')).toEqual(mockContext.saveCatalogueAgreementPostAction);
    });
  }));

  it('should render hidden input with csrf token', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const formElement = $('input[name=_csrf]');
      expect(formElement.length).toEqual(1);
      expect(formElement.attr('type')).toEqual('hidden');
      expect(formElement.attr('value')).toEqual(mockContext.csrfToken);
    });
  }));
});
