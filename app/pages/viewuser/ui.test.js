import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import content from './manifest.json';
import { extractInnerText } from '../../test-utils/helper';
import { organisationsApiLocalhost } from '../../test-utils/config';
import userData from '../../test-utils/fixtures/userData.json';
import organisationData from '../../test-utils/fixtures/organisationDetails.json';

const pageUrl = 'http://localhost:1234/organisations/org1/user1';

const setCookies = ClientFunction(() => {
  const cookieValue = JSON.stringify({
    id: '88421113', name: 'Cool Dude', organisation: 'view',
  });

  document.cookie = `fakeToken=${cookieValue}`;
});

const mocks = () => {
  nock(organisationsApiLocalhost)
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

  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const goBackLink = Selector('[data-test-id="go-back-link"] a');

  await t
    .expect(goBackLink.exists).ok()
    .click(goBackLink)
    .expect(getLocation()).eql('http://localhost:1234/organisations/org1');
});

test('should render the title', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const title = Selector('h1[data-test-id="view-user-page-title"]');

  await t
    .expect(title.exists).ok()
    .expect(await extractInnerText(title)).eql(`${userData.name} ${content.title}`);
});

test('should render organisation name heading', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const orgNameHeading = Selector('h2[data-test-id="organisation-name-heading"]');
  const orgName = Selector('div[data-test-id="organisation-name"]');

  await t
    .expect(orgNameHeading.exists).ok()
    .expect(await extractInnerText(orgNameHeading)).eql(content.orgHeading)
    .expect(orgName.exists).ok()
    .expect(await extractInnerText(orgName)).eql(organisationData.name);
});

test('should render user name heading', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const userNameHeading = Selector('h2[data-test-id="user-name-heading"]');
  const userName = Selector('div[data-test-id="user-name"]');

  await t
    .expect(userNameHeading.exists).ok()
    .expect(await extractInnerText(userNameHeading)).eql(content.nameHeading)
    .expect(userName.exists).ok()
    .expect(await extractInnerText(userName)).eql(userData.name);
});

test('should render contact details heading', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const contactDetailsHeading = Selector('h2[data-test-id="user-contact-details-heading"]');
  const contactDetails = Selector('div[data-test-id="user-contact-details"]');

  await t
    .expect(contactDetailsHeading.exists).ok()
    .expect(await extractInnerText(contactDetailsHeading)).eql(content.phoneNumberHeading)
    .expect(contactDetailsHeading.exists).ok()
    .expect(await extractInnerText(contactDetails)).eql(userData.phonenumber);
});

test('should render email address heading', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const emailHeading = Selector('h2[data-test-id="user-email-heading"]');
  const email = Selector('div[data-test-id="user-email"]');

  await t
    .expect(emailHeading.exists).ok()
    .expect(await extractInnerText(emailHeading)).eql(content.emailAddressHeading)
    .expect(email.exists).ok()
    .expect(await extractInnerText(email)).eql(userData.emailaddress);
});

test('should render edit user button', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const editUserButton = Selector('[data-test-id="edit-user-button"] a');

  await t
    .expect(editUserButton.exists).ok()
    .expect(await extractInnerText(editUserButton)).eql(content.editUserButtonText)
    .expect(editUserButton.hasClass('nhsuk-u-margin-bottom-9')).ok()
    .expect(editUserButton.getAttribute('href')).eql('#');
});

test('should navigate to edit user page when edit user button is clicked', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const editUserButton = Selector('[data-test-id="edit-user-button"] a');

  await t
    .expect(editUserButton.exists).ok()
    .click(editUserButton)
    .expect(getLocation()).eql(`${pageUrl}#`);
});

test('should render disable account button', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const disableAccountButton = Selector('[data-test-id="disable-account-button"] a');

  await t
    .expect(disableAccountButton.exists).ok()
    .expect(await extractInnerText(disableAccountButton)).eql(content.disableAccountButtonText)
    .expect(disableAccountButton.hasClass('nhsuk-u-margin-bottom-9')).ok()
    .expect(disableAccountButton.getAttribute('href')).eql('#');
});

test('should navigate to the confirmation page when edit disable account button is clicked', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const disableAccountButton = Selector('[data-test-id="disable-account-button"] a');

  await t
    .expect(disableAccountButton.exists).ok()
    .click(disableAccountButton)
    .expect(getLocation()).eql(`${pageUrl}#`);
});