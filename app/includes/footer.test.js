import { componentTester, snapshotTest } from '../test-utils/componentTester';
import manifest from './manifest.json';

const setup = {
  template: {
    path: 'includes/footer.njk',
  },
};

describe('footer', () => {
  it('should render the footer', componentTester(setup, (harness) => {
    harness.request(manifest, ($) => {
      const snapshot = snapshotTest($, '[data-test-id="footer"]');
      expect(snapshot).toMatchSnapshot();
    });
  }));
});
