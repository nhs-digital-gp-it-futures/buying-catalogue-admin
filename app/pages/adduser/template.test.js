import { createTestHarness } from '../../test-utils/testHarness';
import context from './manifest.json';

const setup = {
  template: {
    path: 'pages/adduser/template.njk',
  },
};

describe('organisations add user page', () => {
  it('should render a backLink', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const backLink = $('[data-test-id="go-back-link"]');
      expect(backLink.length).toEqual(1);
      expect(backLink.text().trim()).toEqual('Back');
      expect($(backLink).find('a').attr('href')).toEqual('./');
    });
  }));

  it('should render a title', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const title = $('h1[data-test-id="add-user-page-title"]');
      expect(title.length).toEqual(1);
      expect(title.text().trim()).toEqual(context.title);
    });
  }));

  it('should render a description', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const description = $('[data-test-id="add-user-page-description"]');
      expect(description.length).toEqual(1);
      expect(description.text().trim()).toEqual(context.description);
    });
  }));

  it('should render a organisation name subheading', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const subheading = $('h3[data-test-id="org-name-subheading"]');
      expect(subheading.length).toEqual(1);
      expect(subheading.text().trim()).toEqual(context.orgNameSubheading);
    });
  }));

  it('should render the organisation name', createTestHarness(setup, (harness) => {
    const modifiedContext = { ...context, orgName: 'a lovely org name' };
    harness.request(modifiedContext, ($) => {
      const orgName = $('[data-test-id="org-name"]');
      expect(orgName.length).toEqual(1);
      expect(orgName.text().trim()).toEqual(modifiedContext.orgName);
    });
  }));

  describe('form fields', () => {
    it('should render a label for each question', createTestHarness(setup, (harness) => {
      harness.request(context, ($) => {
        const labels = $('label');
        expect(labels.length).toEqual(context.questions.length);
        context.questions.forEach((question, i) => {
          expect(labels[i].attribs.for).toEqual(question.id);
          expect(labels[i].children[0].data.trim()).toEqual(question.mainAdvice);
        });
      });
    }));

    it('should render a textField for each question', createTestHarness(setup, (harness) => {
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
  });

  it('should render a add user button', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const addOrgButton = $('[data-test-id="add-user-button"] button');
      expect(addOrgButton.length).toEqual(1);
      expect(addOrgButton.text().trim()).toEqual(context.addUserButtonText);
    });
  }));
});
