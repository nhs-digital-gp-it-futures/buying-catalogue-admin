import nock from 'nock';
import { extractInnerText } from 'buying-catalogue-library';
import { Selector, ClientFunction } from 'testcafe';
import content from './manifest.json';
import { organisationsApiLocalhost } from '../../../test-utils/config';
import mockOrg from '../../../test-utils/fixtures/organisationDetails.json';
import mockOrgList from '../../../test-utils/fixtures/organisationsList.json';

const path = `http://localhost:1234/admin/organisations/find/select/create/confirmation?id=${mockOrg.organisationId}`;

const setCookies = ClientFunction(() => {
  const cookieValue = JSON.stringify({
    id: '88421113', name: 'Cool Dude', organisation: 'manage',
  });

  document.cookie = `fakeToken=${cookieValue}`;
});

const mocks = () => {
  nock(organisationsApiLocalhost)
    .get(`/api/v1/Organisations/${mockOrg.organisationId}`)
    .reply(200, mockOrg);
};

const pageSetup = async (t, withAuth = false) => {
  if (withAuth) {
    mocks();
    await setCookies();
  }
};

const getLocation = ClientFunction(() => document.location.href);

fixture('Create Organisation Confirmation Page')
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

test('should navigate to /admin/organisations when click on Back to dashboard', async (t) => {
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations')
    .reply(200, mockOrgList);

  await pageSetup(t, true);
  await t.navigateTo(path);

  const goBackLink = Selector('[data-test-id="go-back-link"] a');

  await t
    .expect(goBackLink.exists).ok()
    .click(goBackLink)
    .expect(getLocation()).eql('http://localhost:1234/admin/organisations');
});

test('should render the title', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(path);

  const title = Selector('h1[data-test-id="create-org-confirmation-page-title"]');

  await t
    .expect(title.exists).ok()
    .expect(await extractInnerText(title)).eql(`${mockOrg.organisationName} created`);
});

test('should render the description', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(path);

  const description = Selector('h2[data-test-id="create-org-confirmation-page-description"]');

  await t
    .expect(description.exists).ok()
    .expect(await extractInnerText(description)).eql(content.description);
});
