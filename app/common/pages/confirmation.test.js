import { createTestHarness } from '../../test-utils/testHarness';

const setup = {
  template: {
    path: 'common/pages/confirmation.njk',
  },
};

const context = {
  backLinkText: 'Back to dashboard',
  title: 'John Smith account added',
  description: 'The user has been sent an email so they can set their password.',
  dataTestId: 'add-user-confirmation',
  backLinkHref: '/organisations/org1',
};


describe('confirmation page', () => {
  it('should render a backLink', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const addUserConfirmationBackLink = $('[data-test-id="go-back-link"]');
      expect(addUserConfirmationBackLink.length).toEqual(1);
      expect(addUserConfirmationBackLink.text().trim()).toEqual(context.backLinkText);
      expect($(addUserConfirmationBackLink).find('a').attr('href')).toEqual('/organisations/org1');
    });
  }));

  it('should render a title', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const addUserConfirmationTitle = $('h1[data-test-id="add-user-confirmation-page-title"]');
      expect(addUserConfirmationTitle.length).toEqual(1);
      expect(addUserConfirmationTitle.text().trim()).toEqual(context.title);
    });
  }));

  it('should render a description', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const addUserConfirmationDescription = $('[data-test-id="add-user-confirmation-page-description"]');
      expect(addUserConfirmationDescription.length).toEqual(1);
      expect(addUserConfirmationDescription.text().trim()).toEqual(context.description);
    });
  }));
});
