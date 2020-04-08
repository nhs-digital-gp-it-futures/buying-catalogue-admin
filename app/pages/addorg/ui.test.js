import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import content from './manifest.json';
import { extractInnerText } from '../../test-utils/helper';
import { organisationsApiLocalhost } from '../../test-utils/config';

const pageUrl = 'http://localhost:1234/organisations/addorganisation';

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

fixture('Add Org Page')
  .page('http://localhost:1234/some-fake-page')
  .afterEach(async (t) => {
    const isDone = nock.isDone();
    if (!isDone) {
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

test('should render Add Org page', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const orgPage = Selector('[data-test-id="add-org-page"]');

  await t
    .expect(orgPage.exists).ok();
});

test('should navigate to /organisations when click on Back', async (t) => {
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations')
    .reply(200, {});

  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const goBackLink = Selector('[data-test-id="go-back-link"] a');

  await t
    .expect(goBackLink.exists).ok()
    .click(goBackLink)
    .expect(getLocation()).eql('http://localhost:1234/organisations');
});

test('should render the title', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const title = Selector('h1[data-test-id="add-org-page-title"]');

  await t
    .expect(title.exists).ok()
    .expect(await extractInnerText(title)).eql(content.title);
});

test('should render the description', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const description = Selector('h2[data-test-id="add-org-page-description"]');

  await t
    .expect(description.exists).ok()
    .expect(await extractInnerText(description)).eql(content.description);
});

test('should render a text field for ods code', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const odsCode = Selector('[data-test-id="question-odsCode"]');
  const odsCodeLabel = odsCode.find('label.nhsuk-label');

  await t
    .expect(odsCode.exists).ok()
    .expect(await extractInnerText(odsCodeLabel)).eql(content.questions[0].mainAdvice)
    .expect(odsCode.find('input').count).eql(1);
});

test('should render continue button', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const button = Selector('[data-test-id="continue-button"] button');

  await t
    .expect(button.exists).ok()
    .expect(await extractInnerText(button)).eql(content.continueButtonText)
    .expect(button.hasClass('nhsuk-u-margin-bottom-9')).ok();
});
