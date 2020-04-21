import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import content from './manifest.json';
import { extractInnerText } from '../../../test-utils/helper';
import { organisationsApiLocalhost, identityApiLocalhost } from '../../../test-utils/config';
import userData from '../../../test-utils/fixtures/userData.json';
import organisationData from '../../../test-utils/fixtures/organisationDetails.json';

const enablePageUrl = 'http://localhost:1234/admin/organisations/org1/user1/enable';
const disablePageUrl = 'http://localhost:1234/admin/organisations/org1/user1/disable';

const setCookies = ClientFunction(() => {
  const cookieValue = JSON.stringify({
    id: '88421113', name: 'Cool Dude', organisation: 'view',
  });

  document.cookie = `fakeToken=${cookieValue}`;
});

const mocks = () => {
  nock(identityApiLocalhost)
    .get('/api/v1/Users/user1')
    .reply(200, userData);
};

const pageSetup = async (t, withAuth = false) => {
  if (withAuth) {
    mocks();
    await setCookies();
  }
};

const getLocation = ClientFunction(() => document.location.href);

fixture('Enable user confirmation page')
  .page('http://localhost:1234/some-fake-page')
  .afterEach(async (t) => {
    const isDone = nock.isDone();
    if (!isDone) {
      // eslint-disable-next-line no-console
      console.log(`pending mocks: ${nock.pendingMocks()}`);
      nock.cleanAll();
    }

    await t.expect(isDone).ok('Not all nock interceptors were used!');
  });

test('when user is not authenticated - should navigate to the identity server login page', async (t) => {
  await pageSetup(t);
  nock('http://identity-server')
    .get('/login')
    .reply(200);

  await t.navigateTo(enablePageUrl);

  await t
    .expect(getLocation()).eql('http://identity-server/login');
});

test('should render enable user confirmation page', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(enablePageUrl);

  const page = Selector('[data-test-id="enable-user-confirmation-page"]');

  await t
    .expect(page.exists).ok();
});

test('should navigate to user page when click on Back', async (t) => {
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org1')
    .reply(200, organisationData);
  nock(identityApiLocalhost)
    .get('/api/v1/Users/user1')
    .reply(200, userData);

  await pageSetup(t, true);
  await t.navigateTo(enablePageUrl);

  const goBackLink = Selector('[data-test-id="go-back-link"] a');

  await t
    .expect(goBackLink.exists).ok()
    .click(goBackLink)
    .expect(getLocation()).eql('http://localhost:1234/admin/organisations/org1/user1');
});

test('should render the title', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(enablePageUrl);

  const title = Selector('h1[data-test-id="enable-user-confirmation-page-title"]');

  await t
    .expect(title.exists).ok()
    .expect(await extractInnerText(title)).eql('John Smith account re-enabled');
});

test('should render the description', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(enablePageUrl);

  const description = Selector('h2[data-test-id="enable-user-confirmation-page-description"]');

  await t
    .expect(description.exists).ok()
    .expect(await extractInnerText(description)).eql(content.enable.description);
});

fixture('Disable user confirmation page')
  .page('http://localhost:1234/some-fake-page')
  .afterEach(async (t) => {
    const isDone = nock.isDone();
    if (!isDone) {
      // eslint-disable-next-line no-console
      console.log(`pending mocks: ${nock.pendingMocks()}`);
      nock.cleanAll();
    }

    await t.expect(isDone).ok('Not all nock interceptors were used!');
  });

test('when user is not authenticated - should navigate to the identity server login page', async (t) => {
  await pageSetup(t);
  nock('http://identity-server')
    .get('/login')
    .reply(200);

  await t.navigateTo(disablePageUrl);

  await t
    .expect(getLocation()).eql('http://identity-server/login');
});

test('should render disable user confirmation page', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(disablePageUrl);

  const page = Selector('[data-test-id="disable-user-confirmation-page"]');

  await t
    .expect(page.exists).ok();
});

test('should navigate to user page when click on Back', async (t) => {
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org1')
    .reply(200, organisationData);
  nock(identityApiLocalhost)
    .get('/api/v1/Users/user1')
    .reply(200, userData);

  await pageSetup(t, true);
  await t.navigateTo(disablePageUrl);

  const goBackLink = Selector('[data-test-id="go-back-link"] a');

  await t
    .expect(goBackLink.exists).ok()
    .click(goBackLink)
    .expect(getLocation()).eql('http://localhost:1234/admin/organisations/org1/user1');
});

test('should render the title', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(disablePageUrl);

  const title = Selector('h1[data-test-id="disable-user-confirmation-page-title"]');

  await t
    .expect(title.exists).ok()
    .expect(await extractInnerText(title)).eql('John Smith account disabled');
});

test('should render the description', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(disablePageUrl);

  const description = Selector('h2[data-test-id="disable-user-confirmation-page-description"]');

  await t
    .expect(description.exists).ok()
    .expect(await extractInnerText(description)).eql(content.disable.description);
});
