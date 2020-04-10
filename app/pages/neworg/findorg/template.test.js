import { createTestHarness } from '../../../test-utils/testHarness';
import context from './manifest.json';

context.backLinkHref = '/organisations';

const setup = {
  template: {
    path: 'pages/neworg/findorg/template.njk',
  },
};

const mockContext = {
  ...context,
  csrfToken: 'mock-csrf-token',
};

describe('add org page', () => {
  it('should render a backLink', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const backLink = $('[data-test-id="go-back-link"]');
      expect(backLink.length).toEqual(1);
      expect(backLink.text().trim()).toEqual('Back');
      expect($(backLink).find('a').attr('href')).toEqual('/organisations');
    });
  }));

  it('should render a title', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const title = $('h1[data-test-id="find-org-page-title"]');
      expect(title.length).toEqual(1);
      expect(title.text().trim()).toEqual(mockContext.title);
    });
  }));

  it('should render a description', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const description = $('[data-test-id="find-org-page-description"]');
      expect(description.length).toEqual(1);
      expect(description.text().trim()).toEqual(mockContext.description);
    });
  }));

  describe('form field', () => {
    it('should render a label', createTestHarness(setup, (harness) => {
      harness.request(mockContext, ($) => {
        const label = $('label');
        expect(label[0].attribs.for).toEqual(mockContext.questions[0].id);
        expect(label[0].children[0].data.trim()).toEqual(mockContext.questions[0].mainAdvice);
      });
    }));

    it('should render a textField', createTestHarness(setup, (harness) => {
      harness.request(mockContext, ($) => {
        const input = $('input:not([name=_csrf])');
        expect(input[0].attribs.id).toEqual(mockContext.questions[0].id);
        expect(input[0].attribs.name).toEqual(mockContext.questions[0].id);
        expect(input[0].attribs.type).toEqual('text');
      });
    }));
  });

  it('should render hidden input with csrf token', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const formElement = $('input[name=_csrf]');
      expect(formElement.length).toEqual(1);
      expect(formElement.attr('type')).toEqual('hidden');
      expect(formElement.attr('value')).toEqual(mockContext.csrfToken);
    });
  }));

  it('should render a continue button', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      const button = $('[data-test-id="continue-button"] button');
      expect(button.length).toEqual(1);
      expect(button.text().trim()).toEqual(mockContext.continueButtonText);
    });
  }));
});
