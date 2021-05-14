import nock from 'nock';
import { extractInnerText } from 'buying-catalogue-library';
import { Selector, ClientFunction } from 'testcafe';
import content from './manifest.json';
import { organisationsApiLocalhost, identityApiLocalhost } from '../../test-utils/config';
import organisationsList from '../../test-utils/fixtures/organisationsList.json';

const pageUrl = 'http://localhost:1234/admin/organisations';

const setCookies = ClientFunction(() => {
  const cookieValue = JSON.stringify({
    id: '88421113', name: 'Cool Dude', organisation: 'manage',
  });

  document.cookie = `fakeToken=${cookieValue}`;
});

const mocks = () => {
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations')
    .reply(200, organisationsList);
};

const pageSetup = async (t, withAuth = false) => {
  if (withAuth) {
    mocks();
    await setCookies();
  }
};

fixture('Header')
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

  const getLocation = ClientFunction(() => document.location.href);
  await t
    .expect(getLocation()).eql('http://identity-server/login');
});

test('when user is authenticated - should display the logout link', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const logoutComponent = Selector('[data-test-id="login-logout-component"] a');
  await t
    .expect(await extractInnerText(logoutComponent)).eql('Log out');
});

const getLocation = ClientFunction(() => document.location.href);

fixture('Organisation Dashboard Page')
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

test('should render Organisations dashboard page', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const orgDashboardPage = Selector('[data-test-id="organisations"]');

  await t
    .expect(orgDashboardPage.exists).ok();
});

test('should navigate to /back-from-admin when click Back', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const goBackLink = Selector('[data-test-id="go-back-link"] a');

  await t
    .expect(goBackLink.exists).ok()
    .expect(goBackLink.getAttribute('href')).eql('http://localhost:3000/re-login');
});

test('should render the title', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const title = Selector('h1[data-test-id="org-dashboard-title"]');

  await t
    .expect(title.exists).ok()
    .expect(await extractInnerText(title)).eql(content.title);
});

test('should render the description', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const description = Selector('p[data-test-id="org-dashboard-description"]');

  await t
    .expect(description.exists).ok()
    .expect(await extractInnerText(description)).eql(content.description);
});

test('should render add org button', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const addOrgButton = Selector('[data-test-id="add-org-button"] a');

  await t
    .expect(addOrgButton.exists).ok()
    .expect(await extractInnerText(addOrgButton)).eql(content.addOrgButtonText)
    .expect(addOrgButton.hasClass('nhsuk-u-margin-bottom-9')).ok()
    .expect(addOrgButton.getAttribute('href')).eql('/admin/organisations/find');
});

test('should render the table', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const table = Selector('div[data-test-id="org-table"]');
  const tableHeadings = Selector('[data-test-id="table-headings"]');
  const columnHeading1 = tableHeadings.find('[data-test-id="column-heading-0"]');
  const columnHeading2 = tableHeadings.find('[data-test-id="column-heading-1"]');

  await t
    .expect(table.exists).ok()
    .expect(tableHeadings.exists).ok()
    .expect(columnHeading1.exists).ok()
    .expect(await extractInnerText(columnHeading1)).eql(content.columnInfo[0].data)
    .expect(await extractInnerText(columnHeading2)).eql(content.columnInfo[1].data);
});

test('should render the table content', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const row0 = Selector('tr[data-test-id="table-row-0"]');
  const row0Name = row0.find('a[data-test-id="org-name-org-001"]');
  const row0Ods = row0.find('div[data-test-id="ods-code-org-001"]');
  const row1 = Selector('tr[data-test-id="table-row-1"]');
  const row1Name = row1.find('a[data-test-id="org-name-org-002"]');
  const row1Ods = row1.find('div[data-test-id="ods-code-org-002"]');

  await t
    .expect(row0.exists).ok()
    .expect(row0Name.exists).ok()
    .expect(row0Ods.exists).ok()
    .expect(await extractInnerText(row0Name)).eql(organisationsList.organisations[0].name)
    .expect(await extractInnerText(row0Ods)).eql(organisationsList.organisations[0].odsCode)
    .expect(row1.exists).ok()
    .expect(row1Name.exists).ok()
    .expect(row1Ods.exists).ok()
    .expect(await extractInnerText(row1Name)).eql(organisationsList.organisations[1].name)
    .expect(await extractInnerText(row1Ods)).eql(organisationsList.organisations[1].odsCode);
});

test('should navigate to the organisation page when an organisation name is clicked', async (t) => {
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org-001')
    .reply(200, {});
  nock(identityApiLocalhost)
    .get('/api/v1/Organisations/org-001/Users')
    .reply(200, {});

  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const row0Name = Selector('tr[data-test-id="table-row-0"] a');
  const orgId = organisationsList.organisations[0].organisationId;
  await t
    .expect(row0Name.exists).ok()
    .click(row0Name)
    .expect(getLocation()).eql(`http://localhost:1234/admin/organisations/${orgId}`);
});
