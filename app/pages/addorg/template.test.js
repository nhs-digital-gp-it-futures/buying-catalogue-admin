import { createTestHarness } from '../../test-utils/testHarness';
import context from './manifest.json';

context.backLinkHref = '/organisations';

const setup = {
  template: {
    path: 'pages/addorg/template.njk',
  },
};

describe('add org page', () => {
  it('should render a backLink', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const backLink = $('[data-test-id="go-back-link"]');
      expect(backLink.length).toEqual(1);
      expect(backLink.text().trim()).toEqual('Back');
      expect($(backLink).find('a').attr('href')).toEqual('/organisations');
    });
  }));

  it('should render a title', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const title = $('h1[data-test-id="add-org-page-title"]');
      expect(title.length).toEqual(1);
      expect(title.text().trim()).toEqual(context.title);
    });
  }));

  it('should render a description', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const description = $('[data-test-id="add-org-page-description"]');
      expect(description.length).toEqual(1);
      expect(description.text().trim()).toEqual(context.description);
    });
  }));

  describe('form field', () => {
    it('should render a label', createTestHarness(setup, (harness) => {
      harness.request(context, ($) => {
        const label = $('label');
        expect(label[0].attribs.for).toEqual(context.questions[0].id);
        expect(label[0].children[0].data.trim()).toEqual(context.questions[0].mainAdvice);
      });
    }));

    it('should render a textField', createTestHarness(setup, (harness) => {
      harness.request(context, ($) => {
        const input = $('input:not([name=_csrf])');
        expect(input[0].attribs.id).toEqual(context.questions[0].id);
        expect(input[0].attribs.name).toEqual(context.questions[0].id);
        expect(input[0].attribs.type).toEqual('text');
      });
    }));
  });

  it('should render a continue button', createTestHarness(setup, (harness) => {
    harness.request(context, ($) => {
      const button = $('[data-test-id="continue-button"] button');
      expect(button.length).toEqual(1);
      expect(button.text().trim()).toEqual(context.continueButtonText);
    });
  }));
});
