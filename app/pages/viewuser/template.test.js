import { createTestHarness } from '../../test-utils/testHarness';
import manifest from './manifest.json';

const setup = {
  template: {
    path: 'pages/viewuser/template.njk',
  },
};

const mockData = {
  organisationId: 'org1',
  organisationName: 'Greater Manchester CCG',
  userName: 'John Smith',
  phoneNumber: '07777777777',
  emailAddress: 'John@Smith.com',
  accountDisabled: false,
  editUserButtonHref: '#',
  changeAccountStatusButtonText: 'Disable account',
  changeAccountStatusFormAction: '/organisations/org1/user2/disable',
};

const mockContext = {
  ...manifest,
  ...mockData,
  backLinkHref: '/organisations/org1',
  csrfToken: 'mockCsrfToken',
};

describe('viewuser page', () => {
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
      const title = $('h1[data-test-id="view-user-page-title"]');
      expect(title.length).toEqual(1);
      expect(title.text().trim()).toEqual(`${mockContext.userName} ${mockContext.title}`);
    });
  }));

  it('should render organisation name', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const heading = $('h2[data-test-id="organisation-name-heading"]');
      const orgName = $('div[data-test-id="organisation-name"]');
      expect(heading.length).toEqual(1);
      expect(heading.text().trim()).toEqual(mockContext.orgHeading);
      expect(orgName.length).toEqual(1);
      expect(orgName.text().trim()).toEqual(mockContext.organisationName);
    });
  }));

  it('should render user name', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const heading = $('h2[data-test-id="user-name-heading"]');
      const userName = $('div[data-test-id="user-name"]');
      expect(heading.length).toEqual(1);
      expect(heading.text().trim()).toEqual(mockContext.nameHeading);
      expect(userName.length).toEqual(1);
      expect(userName.text().trim()).toEqual(mockContext.userName);
    });
  }));

  it('should render contact details', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const heading = $('h2[data-test-id="user-contact-details-heading"]');
      const contactDetails = $('div[data-test-id="user-contact-details"]');
      expect(heading.length).toEqual(1);
      expect(heading.text().trim()).toEqual(mockContext.phoneNumberHeading);
      expect(contactDetails.length).toEqual(1);
      expect(contactDetails.text().trim()).toEqual(mockContext.phoneNumber);
    });
  }));

  it('should render contact details', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const heading = $('h2[data-test-id="user-email-heading"]');
      const emailAddress = $('div[data-test-id="user-email"]');
      expect(heading.length).toEqual(1);
      expect(heading.text().trim()).toEqual(mockContext.emailAddressHeading);
      expect(emailAddress.length).toEqual(1);
      expect(emailAddress.text().trim()).toEqual(mockContext.emailAddress);
    });
  }));

  it('should render an edit user button', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const editUserButton = $('[data-test-id="edit-user-button"] a');
      expect(editUserButton.length).toEqual(1);
      expect(editUserButton.text().trim()).toEqual(mockContext.editUserButtonText);
      expect(editUserButton.attr('href')).toEqual('#');
    });
  }));

  it('should render a disable account button', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const disableAccountButton = $('[data-test-id="disable-account-button"]');
      expect(disableAccountButton.length).toEqual(1);
      expect(disableAccountButton.text().trim()).toEqual(mockContext.changeAccountStatusButtonText);
    });
  }));

  it('should create form element with correct action', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const formElement = $('form');
      expect(formElement.length).toEqual(1);
      expect(formElement.attr('action')).toEqual(mockContext.changeAccountStatusFormAction);
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
