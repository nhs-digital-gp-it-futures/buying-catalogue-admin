import { componentTester } from '../../../test-utils/componentTester';
import context from './manifest.json';
import mockOrgDetails from '../../../test-utils/fixtures/organisationDetails.json';
import { extractObjectValuesToArray } from '../../../helpers/contextCreatorHelper';

context.backLinkHref = '/organisations/find?ods=ABC1';

const setup = {
  template: {
    path: 'pages/neworg/selectorg/template.njk',
  },
};

const mockContext = {
  ...context,
  ...mockOrgDetails,
  address: extractObjectValuesToArray(mockOrgDetails.address),
  csrfToken: 'mockCsrfToken',
};

describe('select org page', () => {
  it('should render a backLink', componentTester(setup, (harness) => {
    harness.request(context, ($) => {
      const backLink = $('[data-test-id="go-back-link"]');
      expect(backLink.length).toEqual(1);
      expect(backLink.text().trim()).toEqual('Back');
      expect($(backLink).find('a').attr('href')).toEqual('/organisations/find?ods=ABC1');
    });
  }));

  it('should render a title', componentTester(setup, (harness) => {
    harness.request(context, ($) => {
      const title = $('h1[data-test-id="select-org-page-title"]');
      expect(title.length).toEqual(1);
      expect(title.text().trim()).toEqual(context.title);
    });
  }));

  it('should render a description', componentTester(setup, (harness) => {
    harness.request(context, ($) => {
      const description = $('[data-test-id="select-org-page-description"]');
      expect(description.length).toEqual(1);
      expect(description.text().trim()).toEqual(context.description);
    });
  }));

  it('should render organisation ods code', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const heading = $('h3[data-test-id="organisation-ods-code-heading"]');
      const odsCode = $('div[data-test-id="organisation-ods-code"]');
      expect(heading.length).toEqual(1);
      expect(heading.text().trim()).toEqual(mockContext.odsCodeHeading);
      expect(odsCode.length).toEqual(1);
      expect(odsCode.text().trim()).toEqual(mockContext.odsCode);
    });
  }));

  it('should render organisation name', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const heading = $('h3[data-test-id="organisation-name-heading"]');
      const orgName = $('div[data-test-id="organisation-name"]');
      expect(heading.length).toEqual(1);
      expect(heading.text().trim()).toEqual(mockContext.organisationNameHeading);
      expect(orgName.length).toEqual(1);
      expect(orgName.text().trim()).toEqual(mockContext.organisationName);
    });
  }));

  it('should render address', componentTester(setup, (harness) => {
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

  it('should render organisation primary role id', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const heading = $('h3[data-test-id="organisation-primary-role-id-heading"]');
      const primaryRoleID = $('div[data-test-id="organisation-primary-role-id"]');
      expect(heading.length).toEqual(1);
      expect(heading.text().trim()).toEqual(mockContext.primaryRoleIdHeading);
      expect(primaryRoleID.length).toEqual(1);
      expect(primaryRoleID.text().trim()).toEqual(mockContext.primaryRoleId);
    });
  }));

  it('should render hidden input with csrf token', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const formElement = $('input[name=_csrf]');
      expect(formElement.length).toEqual(1);
      expect(formElement.attr('type')).toEqual('hidden');
      expect(formElement.attr('value')).toEqual(mockContext.csrfToken);
    });
  }));

  it('should render hidden input with odsCode', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const formElement = $('input[name=odsCode]');
      expect(formElement.length).toEqual(1);
      expect(formElement.attr('type')).toEqual('hidden');
      expect(formElement.attr('value')).toEqual(mockContext.odsCode);
    });
  }));

  it('should render a select org button', componentTester(setup, (harness) => {
    harness.request(context, ($) => {
      const button = $('[data-test-id="select-org-button"] button');
      expect(button.length).toEqual(1);
      expect(button.text().trim()).toEqual(context.selectOrgButtonText);
    });
  }));
});
