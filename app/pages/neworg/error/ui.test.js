import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import content from './manifest.json';
import { extractInnerText } from '../../../test-utils/helper';

const path = 'http://localhost:1234/organisations/find/select/create/error?ods=abc&errors=OrganisationAlreadyExists';
const setCookies = ClientFunction(() => {
  const cookieValue = JSON.stringify({
    id: '88421113', name: 'Cool Dude', organisation: 'view',
  });

  document.cookie = `fakeToken=${cookieValue}`;
});

const pageSetup = async (t, withAuth = false) => {
  if (withAuth) {
    await setCookies();
  }
};

const getLocation = ClientFunction(() => document.location.href);

fixture('Create Organisation Error Page')
  .page('http://localhost:1234/some-fake-page')
  .afterEach(async (t) => {
    const isDone = nock.isDone();
    if (!isDone) {
      nock.cleanAll();
    }

    await t.expect(isDone).ok('Not all nock interceptors were used!');
  });

test('should navigate to /organisations/find when click on Back to dashboard', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(path);

  const goBackLink = Selector('[data-test-id="go-back-link"] a');

  await t
    .expect(goBackLink.exists).ok()
    .expect(await extractInnerText(goBackLink)).eql(content.backLinkText)
    .click(goBackLink)
    .expect(getLocation()).eql('http://localhost:1234/organisations/find');
});

test('should render the title', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(path);

  const title = Selector('h1[data-test-id="create-org-error-page-title"]');

  await t
    .expect(title.exists).ok()
    .expect(await extractInnerText(title)).eql(content.title);
});

test('should render the description', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(path);

  const description = Selector('h2[data-test-id="create-org-error-page-description"]');

  await t
    .expect(description.exists).ok()
    .expect(await extractInnerText(description)).eql('The organisation with ODS code abc already exists.');
});
