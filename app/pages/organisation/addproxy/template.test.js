import { componentTester, snapshotTest } from '../../../test-utils/componentTester';
import { organisation, unrelatedOrgsRadio, errors } from './mockData';

const setup = {
  template: {
    path: 'pages/organisation/addproxy/template.njk',
  },
};

describe('add proxy for organisation', () => {
  it('the page should render', componentTester(setup, (harness) => {
    harness.request({ organisation, unrelatedOrgsRadio }, ($) => {
      const snapshot = snapshotTest($, '[data-test-id="main-content"]');
      expect(snapshot).toMatchSnapshot();
    });
  }));

  it('the page should render with errors', componentTester(setup, (harness) => {
    harness.request({ organisation, unrelatedOrgsRadio, errors }, ($) => {
      const snapshot = snapshotTest($, '[data-test-id="main-content"]');
      expect(snapshot).toMatchSnapshot();
    });
  }));
});
