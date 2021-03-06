import createTestcafe from 'testcafe';
import { FakeAuthProvider } from 'buying-catalogue-library';
import { App } from './app/app';
import { routes } from './app/routes';
import { env, baseUrl } from './app/config';

let testcafe;

const authProvider = new FakeAuthProvider();
const app = new App(authProvider).createApp();
app.use(baseUrl, routes(authProvider));
const server = app.listen('1234');

const browserFromArgs = process.argv.slice(2, 3);
const browserToRun = browserFromArgs.length > 0 ? browserFromArgs : 'chrome:headless';

const testFromArgs = process.argv.slice(3, 4);
const testsToRun = testFromArgs ? `**/*${testFromArgs}*/ui.test.js` : '**/*ui.test.js';

let concurrency = 1;
let stopOnFirstFail = true;
let quarantineMode = true;
if (env === 'pipeline' || browserFromArgs.length > 0) {
  concurrency = 1;
  stopOnFirstFail = false;
  quarantineMode = false;
}

// eslint-disable-next-line no-console
console.log(`Running tests in ${concurrency} threads\nstopOnFirstFail is ${stopOnFirstFail}\nquarantineMode is ${quarantineMode}`);

createTestcafe('localhost')
  .then((tc) => {
    testcafe = tc;

    return testcafe.createRunner()
      .src(testsToRun)
      .browsers(browserToRun)
      .concurrency(concurrency)
      .reporter(['spec', {
        name: 'nunit',
        output: 'integration-test-report.xml',
      }])
      .run({
        selectorTimeout: 3000,
        assertionTimeout: 1000,
        pageLoadTimeout: 5000,
        speed: 1,
        quarantineMode,
        stopOnFirstFail,
      });
  })
  .then(() => {
    server.close();
    testcafe.close();
    process.exit();
  });
