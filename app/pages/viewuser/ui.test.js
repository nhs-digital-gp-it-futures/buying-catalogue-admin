import nock from 'nock';
import { extractInnerText } from 'buying-catalogue-library';
import { Selector, ClientFunction } from 'testcafe';
import content from './manifest.json';
import { organisationsApiLocalhost, identityApiLocalhost } from '../../test-utils/config';
import userData from '../../test-utils/fixtures/userData.json';
import organisationData from '../../test-utils/fixtures/organisationDetails.json';

const pageUrl = 'http://localhost:1234/admin/organisations/org1/user1';

const setCookies = ClientFunction(() => {
  const cookieValue = JSON.stringify({
    id: '88421113', name: 'Cool Dude', organisation: 'manage',
  });

  document.cookie = `fakeToken=${cookieValue}`;
});

const mocks = () => {
  nock(identityApiLocalhost)
    .get('/api/v1/Users/user1')
    .reply(200, userData);
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org1')
    .reply(200, organisationData);
};

const pageSetup = async (t, withAuth = false) => {
  if (withAuth) {
    mocks();
    await setCookies();
  }
};

const getLocation = ClientFunction(() => document.location.href);

fixture('View user Page')
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

  await t.navigateTo(pageUrl);

  await t
    .expect(getLocation()).eql('http://identity-server/login');
});

test('should render view user page', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const page = Selector('[data-test-id="view-user-page"]');

  await t
    .expect(page.exists).ok();
});

test('should navigate to organisation page when click on Back', async (t) => {
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org1')
    .reply(200, {});
  nock(identityApiLocalhost)
    .get('/api/v1/Organisations/org1/Users')
    .reply(200, {});

  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const goBackLink = Selector('[data-test-id="go-back-link"] a');

  await t
    .expect(goBackLink.exists).ok()
    .click(goBackLink)
    .expect(getLocation()).eql('http://localhost:1234/admin/organisations/org1');
});

test('should render the title', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const title = Selector('h1[data-test-id="view-user-page-title"]');

  await t
    .expect(title.exists).ok()
    .expect(await extractInnerText(title)).eql(`${userData.name} ${content.title}`);
});

test('should render change account status button', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const changeAccountStatusButton = Selector('[data-test-id="change-account-status-button"] button');

  await t
    .expect(changeAccountStatusButton.exists).ok()
    .expect(await extractInnerText(changeAccountStatusButton)).eql('Disable account');
});

test('should navigate to the confirmation page when edit change account status button is clicked', async (t) => {
  nock(identityApiLocalhost)
    .post('/api/v1/Users/user1/disable')
    .reply(200, {});
  nock(identityApiLocalhost)
    .get('/api/v1/Users/user1')
    .reply(200, {});

  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const changeAccountStatusButton = Selector('[data-test-id="change-account-status-button"] button');

  await t
    .expect(changeAccountStatusButton.exists).ok()
    .click(changeAccountStatusButton)
    .expect(getLocation()).eql(`${pageUrl}/disable`);
});
