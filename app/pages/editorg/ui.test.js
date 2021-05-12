import nock from 'nock';
import { extractInnerText } from 'buying-catalogue-library';
import { Selector, ClientFunction } from 'testcafe';
import confirmationContent from './confirmation/manifest.json';
import { organisationsApiLocalhost, identityApiLocalhost } from '../../test-utils/config';
import organisationDetails from '../../test-utils/fixtures/organisationDetails.json';

const pageUrl = 'http://localhost:1234/admin/organisations/org1/edit';

const setCookies = ClientFunction(() => {
  const cookieValue = JSON.stringify({
    id: '88421113', name: 'Cool Dude', organisation: 'manage',
  });

  document.cookie = `fakeToken=${cookieValue}`;
});

const mocks = () => {
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org1')
    .reply(200, organisationDetails);
};

const pageSetup = async (t, withAuth = false) => {
  if (withAuth) {
    mocks();
    await setCookies();
  }
};

const getLocation = ClientFunction(() => document.location.href);

fixture('Edit Organisation Page')
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

test('should render Edit Organisation page', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const editOrgPage = Selector('[data-test-id="edit-organisation-page"]');

  await t
    .expect(editOrgPage.exists).ok();
});

test('should navigate to /admin/organisations/org1 when click on Back', async (t) => {
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org1')
    .reply(200, organisationDetails);
  nock(identityApiLocalhost)
    .get('/api/v1/Organisations/org1/Users')
    .reply(200, organisationDetails);

  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const goBackLink = Selector('[data-test-id="go-back-link"] a');

  await t
    .expect(goBackLink.exists).ok()
    .click(goBackLink)
    .expect(getLocation()).eql('http://localhost:1234/admin/organisations/org1');
});

test('should navigate to confirmation page when save button is clicked', async (t) => {
  nock(organisationsApiLocalhost)
    .put('/api/v1/Organisations/org1')
    .reply(200, {});

  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const saveButton = Selector('[data-test-id="save-button"] button');

  await t
    .expect(saveButton.exists).ok()
    .click(saveButton)
    .expect(getLocation()).eql(`${pageUrl}/confirmation`);
});

fixture('Edit Organisation Confirmation Page')
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

  await t.navigateTo(`${pageUrl}/confirmation`);

  await t
    .expect(getLocation()).eql('http://identity-server/login');
});

test('should render Edit Organisation Confirmation page', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(`${pageUrl}/confirmation`);

  const editOrgComfirmationPage = Selector('[data-test-id="edit-organisation-confirmation-page"]');

  await t
    .expect(editOrgComfirmationPage.exists).ok();
});

test('should navigate to /admin/organisations/org1 when click on Back', async (t) => {
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org1')
    .reply(200, organisationDetails);
  nock(identityApiLocalhost)
    .get('/api/v1/Organisations/org1/Users')
    .reply(200, {});
  await pageSetup(t, true);
  await t.navigateTo(`${pageUrl}/confirmation`);

  const goBackLink = Selector('[data-test-id="go-back-link"] a');

  await t
    .expect(goBackLink.exists).ok()
    .click(goBackLink)
    .expect(getLocation()).eql('http://localhost:1234/admin/organisations/org1');
});

test('should render the title', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(`${pageUrl}/confirmation`);

  const title = Selector('h1[data-test-id="edit-organisation-confirmation-page-title"]');

  await t
    .expect(title.exists).ok()
    .expect(await extractInnerText(title)).eql(`${organisationDetails.name} updated`);
});

test('should render the description', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(`${pageUrl}/confirmation`);

  const description = Selector('p[data-test-id="edit-organisation-confirmation-page-description"]');

  await t
    .expect(description.exists).ok()
    .expect(await extractInnerText(description)).eql(confirmationContent.description);
});
