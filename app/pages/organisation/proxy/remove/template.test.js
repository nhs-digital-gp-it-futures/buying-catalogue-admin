import { componentTester, snapshotTest } from '../../../../test-utils/componentTester';
import { organisation } from '../mockData';

const setup = {
  template: {
    path: 'pages/organisation/proxy/remove/template.njk',
  },
};

describe('add proxy for organisation', () => {
  it('the page should render', componentTester(setup, (harness) => {
    harness.request({ organisation }, ($) => {
      const snapshot = snapshotTest($, '[data-test-id="main-content"]');
      expect(snapshot).toMatchSnapshot();
    });
  }));
});
