import { componentTester, snapshotTest } from '../../test-utils/componentTester';
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
  it('the page should render', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const snapshot = snapshotTest($, '[data-test-id="main-content"]');
      expect(snapshot).toMatchSnapshot();
    });
  }));

  it('should render a backLink to the organisation page', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const homepageBackLink = $('[data-test-id="go-back-link"]');
      expect(homepageBackLink.length).toEqual(1);
      expect(homepageBackLink.text().trim()).toEqual('Go back');
      expect($(homepageBackLink).find('a').attr('href')).toEqual(mockContext.backLinkHref);
    });
  }));

  it('should render a change account status button', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const changeAccountStatusButton = $('[data-test-id="change-account-status-button"] button');
      expect(changeAccountStatusButton.length).toEqual(1);
      expect(changeAccountStatusButton.text().trim())
        .toEqual(mockContext.changeAccountStatusButtonText);
    });
  }));

  it('should create form element with correct action', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const formElement = $('form');
      expect(formElement.length).toEqual(1);
      expect(formElement.attr('action')).toEqual(mockContext.changeAccountStatusFormAction);
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
});
