import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import content from './manifest.json';
import { extractInnerText } from '../../test-utils/helper';
import { organisationsApiLocalhost } from '../../test-utils/config';
import organisationDetails from '../../test-utils/fixtures/organisationDetails.json';

const setCookies = ClientFunction(() => {
  const cookieValue = JSON.stringify({
    id: '88421113', name: 'Cool Dude', organisation: 'view',
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

fixture('Add User Page')
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

  await t.navigateTo('http://localhost:1234/organisations/org1/adduser');

  await t
    .expect(getLocation()).eql('http://identity-server/login');
});

test('should render Add User page', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1/adduser');

  const orgPage = Selector('[data-test-id="add-user-page"]');

  await t
    .expect(orgPage.exists).ok();
});

test('should navigate to /organisations/org when click on Back', async (t) => {
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org1')
    .reply(200, organisationDetails);
  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1/adduser');

  const goBackLink = Selector('[data-test-id="go-back-link"] a');

  await t
    .expect(goBackLink.exists).ok()
    .click(goBackLink)
    .expect(getLocation()).eql('http://localhost:1234/organisations/org1/');
});

test('should render the title', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1/adduser');

  const title = Selector('h1[data-test-id="add-user-page-title"]');

  await t
    .expect(title.exists).ok()
    .expect(await extractInnerText(title)).eql(content.title);
});

test('should render the description', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1/adduser');

  const description = Selector('h2[data-test-id="add-user-page-description"]');

  await t
    .expect(description.exists).ok()
    .expect(await extractInnerText(description)).eql(content.description);
});

test('should render organisation name subheading', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1/adduser');

  const orgDetailsSubheading = Selector('h3[data-test-id="org-name-subheading"]');

  await t
    .expect(orgDetailsSubheading.exists).ok()
    .expect(await extractInnerText(orgDetailsSubheading)).eql(content.orgNameSubheading);
});

test('should render organisation name', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1/adduser');

  const organisationName = Selector('[data-test-id="org-name"]');

  await t
    .expect(organisationName.exists).ok()
    .expect(await extractInnerText(organisationName)).eql(organisationDetails.name);
});

test('should render a text field for each question', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1/adduser');

  const firstName = Selector('[data-test-id="question-firstName"]');
  const lastName = Selector('[data-test-id="question-lastName"]');
  const phoneNumber = Selector('[data-test-id="question-phoneNumber"]');
  const emailAddress = Selector('[data-test-id="question-emailAddress"]');

  const firstNameLabel = firstName.find('label.nhsuk-label');
  const lastNameLabel = lastName.find('label.nhsuk-label');
  const phoneNumberLabel = phoneNumber.find('label.nhsuk-label');
  const emailAddressLabel = emailAddress.find('label.nhsuk-label');


  await t
    .expect(firstName.exists).ok()
    .expect(await extractInnerText(firstNameLabel)).eql(content.questions[0].mainAdvice)
    .expect(firstName.find('input').count).eql(1)
    .expect(lastName.exists).ok()
    .expect(await extractInnerText(lastNameLabel)).eql(content.questions[1].mainAdvice)
    .expect(lastName.find('input').count).eql(1)
    .expect(phoneNumber.exists).ok()
    .expect(await extractInnerText(phoneNumberLabel)).eql(content.questions[2].mainAdvice)
    .expect(phoneNumber.find('input').count).eql(1)
    .expect(emailAddress.exists).ok()
    .expect(await extractInnerText(emailAddressLabel)).eql(content.questions[3].mainAdvice)
    .expect(emailAddress.find('input').count).eql(1);
});

test('should render add user button', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1/adduser');

  const addUserButton = Selector('[data-test-id="add-user-button"] button');

  await t
    .expect(addUserButton.exists).ok()
    .expect(await extractInnerText(addUserButton)).eql(content.addUserButtonText)
    .expect(addUserButton.hasClass('nhsuk-u-margin-bottom-9')).ok();
});

test('should navigate to confirmation page when form is filled out and addUser button is clicked', async (t) => {
  nock(organisationsApiLocalhost)
    .post('/api/v1/Organisations/org1/Users')
    .reply(200);

  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1/adduser');

  const firstName = Selector('[data-test-id="question-firstName"] input');
  const lastName = Selector('[data-test-id="question-lastName"] input');
  const phoneNumber = Selector('[data-test-id="question-phoneNumber"] input');
  const emailAddress = Selector('[data-test-id="question-emailAddress"] input');
  const addUserButton = Selector('[data-test-id="add-user-button"] button');

  await t
    .expect(addUserButton.exists).ok()
    .typeText(firstName, 'Peter')
    .typeText(lastName, 'Parker')
    .typeText(phoneNumber, '07777777777')
    .typeText(emailAddress, 'Peter@Parker.com')
    .click(addUserButton)
    .expect(getLocation()).eql('http://localhost:1234/organisations/org1/adduser/confirmation?userAdded=Peter%20Parker');
  // Add tests for validation
});
