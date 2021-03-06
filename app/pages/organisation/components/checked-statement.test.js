import { componentTester } from '../../../test-utils/componentTester';

const setup = {
  component: {
    name: 'checkedStatement',
    path: 'pages/organisation/components/checked-statement.njk',
  },
};

const mockContext = {
  params: {
    dataTestId: 'some-test-id',
    text: 'some text for the statement',
  },
};

describe('checked-statement', () => {
  it('should render the checked-statement', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      expect($('[data-test-id="some-test-id"]').length).toEqual(1);
    });
  }));

  it('should render the svg', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      expect($('svg').length).toEqual(1);
    });
  }));

  it('should render the text passed in', componentTester(setup, (harness) => {
    harness.request(mockContext, ($) => {
      expect($('[data-test-id="some-test-id"] div').length).toEqual(1);
      expect($('[data-test-id="some-test-id"] div').text().trim()).toEqual(mockContext.params.text);
    });
  }));
});
