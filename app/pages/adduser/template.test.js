import { componentTester, snapshotTest } from '../../test-utils/componentTester';
import context from './manifest.json';

context.backLinkHref = '/organisations/org1';

const setup = {
  template: {
    path: 'pages/adduser/template.njk',
  },
};

const questionsWithErrors = {
  questions: [
    {
      id: 'firstName',
      mainAdvice: 'First name',
      error: [{ message: 'First name is required, First name is too long' }],
    },
    {
      id: 'lastName',
      mainAdvice: 'Last name',
      error: [{ message: 'Last name is required, Last name is too long' }],
    },
    {
      id: 'phoneNumber',
      mainAdvice: 'Telephone number',
      error: [{ message: 'Telephone is required' }],
    },
    {
      id: 'emailAddress',
      mainAdvice: 'Email address',
      error: [{ message: 'Email address is required, Email address is too long, Email address already exists' }],
    },
  ],
  errors: [
    { text: 'First name is required', href: '#firstname' },
    { text: 'First name is too long', href: '#firstname' },
    { text: 'Last name is required', href: '#lastname' },
    { text: 'Last name is too long', href: '#lastname' },
    { text: 'Email is required', href: '#emailaddress' },
    { text: 'Email address is too long', href: '#emailaddress' },
    { text: 'Email address already exists', href: '#emailaddress' },
    { text: 'Telephone number is required', href: '#phonenumber' },
  ],
};

const contextWithErrors = {
  ...context,
  ...questionsWithErrors,
};

describe('organisations add user page', () => {
  it('the page should render', componentTester(setup, (harness) => {
    harness.request(context, ($) => {
      const snapshot = snapshotTest($, '[data-test-id="main-content"]');
      expect(snapshot).toMatchSnapshot();
    });
  }));

  it('the page should render with errors', componentTester(setup, (harness) => {
    harness.request(contextWithErrors, ($) => {
      const snapshot = snapshotTest($, '[data-test-id="main-content"]');
      expect(snapshot).toMatchSnapshot();
    });
  }));

  it('should render a backLink', componentTester(setup, (harness) => {
    harness.request(context, ($) => {
      const backLink = $('[data-test-id="go-back-link"]');
      expect(backLink.length).toEqual(1);
      expect(backLink.text().trim()).toEqual('Go back');
      expect($(backLink).find('a').attr('href')).toEqual('/organisations/org1');
    });
  }));

  it('should render error summary with correct error text and hrefs if there are errors', componentTester(setup, (harness) => {
    harness.request(contextWithErrors, ($) => {
      const errorSummary = $('[data-test-id="error-summary"]');
      const errorArray = $('[data-test-id="error-summary"] li a');
      expect(errorSummary.length).toEqual(1);
      expect(errorArray.length).toEqual(contextWithErrors.errors.length);
      contextWithErrors.errors.forEach((error, i) => {
        expect(errorArray[i].attribs.href).toEqual(error.href);
        expect(errorArray[i].children[0].data.trim()).toEqual(error.text);
      });
    });
  }));

  it('should render a title', componentTester(setup, (harness) => {
    harness.request(context, ($) => {
      const title = $('h1[data-test-id="add-user-page-title"]');
      expect(title.length).toEqual(1);
      expect(title.text().trim()).toEqual(context.title);
    });
  }));

  it('should render a description', componentTester(setup, (harness) => {
    harness.request(context, ($) => {
      const description = $('[data-test-id="add-user-page-description"]');
      expect(description.length).toEqual(1);
      expect(description.text().trim()).toEqual(context.description);
    });
  }));

  it('should render a organisation name subheading', componentTester(setup, (harness) => {
    harness.request(context, ($) => {
      const subheading = $('h2[data-test-id="org-name-subheading"]');
      expect(subheading.length).toEqual(1);
      expect(subheading.text().trim()).toEqual(context.orgNameSubheading);
    });
  }));

  it('should render the organisation name', componentTester(setup, (harness) => {
    const modifiedContext = { ...context, organisationName: 'a lovely org name' };
    harness.request(modifiedContext, ($) => {
      const organisationName = $('[data-test-id="org-name"]');
      expect(organisationName.length).toEqual(1);
      expect(organisationName.text().trim()).toEqual(modifiedContext.organisationName);
    });
  }));

  describe('form fields', () => {
    it('should render a label for each question', componentTester(setup, (harness) => {
      harness.request(context, ($) => {
        const labels = $('label');
        expect(labels.length).toEqual(context.questions.length);
        context.questions.forEach((question, i) => {
          expect(labels[i].attribs.for).toEqual(question.id);
          expect(labels[i].children[0].data.trim()).toEqual(question.mainAdvice);
        });
      });
    }));

    it('should render a textField for each question', componentTester(setup, (harness) => {
      harness.request(context, ($) => {
        const inputs = $('input:not([name=_csrf])');
        expect(inputs.length).toEqual(context.questions.length);
        context.questions.forEach((question, i) => {
          expect(inputs[i].attribs.id).toEqual(question.id);
          expect(inputs[i].attribs.name).toEqual(question.id);
          expect(inputs[i].attribs.type).toEqual('text');
        });
      });
    }));

    it('should render errors for each question if there are errors', componentTester(setup, (harness) => {
      harness.request(contextWithErrors, ($) => {
        contextWithErrors.questions.forEach((question) => {
          const renderedQuestion = $(`div[data-test-id="question-${question.id}"]`);
          expect(renderedQuestion.find('div[data-test-id="text-field-input-error"]').length).toEqual(1);
          expect(renderedQuestion.find('.nhsuk-error-message').text().trim()).toEqual('Error:');
        });
      });
    }));
  });

  it('should render a add user button', componentTester(setup, (harness) => {
    harness.request(context, ($) => {
      const button = $('[data-test-id="add-user-button"] button');
      expect(button.length).toEqual(1);
      expect(button.text().trim()).toEqual(context.addUserButtonText);
    });
  }));
});
