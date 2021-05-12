import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import { organisationsApiLocalhost, identityApiLocalhost } from '../../test-utils/config';
import organisationDetails from '../../test-utils/fixtures/organisationDetails.json';
import usersData from '../../test-utils/fixtures/users.json';
import { relatedOrgs } from './proxy/mockData';

const pageUrl = 'http://localhost:1234/admin/organisations/org1';

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
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org1/related-organisations')
    .reply(200, relatedOrgs);
  nock(identityApiLocalhost)
    .get('/api/v1/Organisations/org1/Users')
    .reply(200, usersData);
};

const pageSetup = async (t, withAuth = false) => {
  if (withAuth) {
    mocks();
    await setCookies();
  }
};

const getLocation = ClientFunction(() => document.location.href);

fixture('Organisation Page')
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

test('should render Organisation page', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const orgPage = Selector('[data-test-id="organisation-page"]');

  await t
    .expect(orgPage.exists).ok();
});

test('should navigate to /admin/organisations when click on Back', async (t) => {
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations')
    .reply(200, {});

  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const goBackLink = Selector('[data-test-id="go-back-link"] a');

  await t
    .expect(goBackLink.exists).ok()
    .click(goBackLink)
    .expect(getLocation()).eql('http://localhost:1234/admin/organisations');
});

test('should navigate to edit org page when add edit org button is clicked', async (t) => {
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org1')
    .reply(200, organisationDetails);

  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const editOrgButton = Selector('[data-test-id="edit-org-button"]');
  const orgId = organisationDetails.organisationId;

  await t
    .expect(editOrgButton.exists).ok()
    .click(editOrgButton)
    .expect(getLocation()).eql(`http://localhost:1234/admin/organisations/${orgId}/edit`);
});

test('should navigate to add user page when add user button is clicked', async (t) => {
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org1')
    .reply(200, organisationDetails);

  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const addUserButton = Selector('[data-test-id="add-user-button"] a');
  const orgId = organisationDetails.organisationId;

  await t
    .expect(addUserButton.exists).ok()
    .click(addUserButton)
    .expect(getLocation()).eql(`http://localhost:1234/admin/organisations/${orgId}/adduser`);
});

test('should navigate to add related organisation page when add organisation button is clicked', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const addOrgButton = Selector('[data-test-id="add-organisation-button"] a');
  const orgId = organisationDetails.organisationId;

  await t
    .expect(addOrgButton.exists).ok()
    .click(addOrgButton)
    .expect(getLocation()).eql(`http://localhost:1234/admin/organisations/proxy/${orgId}`);
});

test('should navigate to view user page when user name is clicked', async (t) => {
  nock(identityApiLocalhost)
    .get(`/api/v1/Users/${usersData.users[0].userId}`)
    .reply(200, organisationDetails);
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org1')
    .reply(200, organisationDetails);

  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const orgId = organisationDetails.organisationId;

  const user1Row = Selector('tr[data-test-id="table-row-0"]');
  const user1Name = user1Row.find('a');

  await t
    .expect(user1Name.exists).ok()
    .click(user1Name)
    .expect(getLocation()).eql(`http://localhost:1234/admin/organisations/${orgId}/${usersData.users[0].userId}`);
});
