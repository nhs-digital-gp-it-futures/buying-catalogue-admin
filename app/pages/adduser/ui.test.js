import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import content from './manifest.json';
import { extractInnerText } from '../../test-utils/helper';
// import { apiLocalhost } from '../../test-utils/config';
// import organisationDetails from '../../test-utils/fixtures/organisationDetails.json';

// const mocks = () => {
//   nock(apiLocalhost)
//     .get('/api/v1/Organisations/org1')
//     .reply(200, organisationDetails);
// };

const pageSetup = async (t) => {
  // await mocks();
  await t.navigateTo('http://localhost:1234/organisations/org1/adduser');
};

const getLocation = ClientFunction(() => document.location.href);

fixture('Add User Page')
  .afterEach(async (t) => {
    const isDone = nock.isDone();
    if (!isDone) {
      nock.cleanAll();
    }

    await t.expect(isDone).ok('Not all nock interceptors were used!');
  });

test('should render Add User page', async (t) => {
  await pageSetup(t);

  const orgPage = Selector('[data-test-id="add-user-page"]');

  await t
    .expect(orgPage.exists).ok();
});

test('should navigate to /organisations/org when click on Back', async (t) => {
  await pageSetup(t);

  const goBackLink = Selector('[data-test-id="go-back-link"] a');

  await t
    .expect(goBackLink.exists).ok()
    .click(goBackLink)
    .expect(getLocation()).eql('http://localhost:1234/organisations/org1/');
});

test('should render the title', async (t) => {
  await pageSetup(t);

  const title = Selector('h1[data-test-id="add-user-page-title"]');

  await t
    .expect(title.exists).ok()
    .expect(await extractInnerText(title)).eql(content.title);
});

test('should render the description', async (t) => {
  await pageSetup(t);

  const description = Selector('h2[data-test-id="add-user-page-description"]');

  await t
    .expect(description.exists).ok()
    .expect(await extractInnerText(description)).eql(content.description);
});

test('should render organisation name subheading', async (t) => {
  await pageSetup(t);

  const orgDetailsSubheading = Selector('h3[data-test-id="org-name-subheading"]');

  await t
    .expect(orgDetailsSubheading.exists).ok()
    .expect(await extractInnerText(orgDetailsSubheading)).eql(content.orgNameSubheading);
});

// TODO: Uncomment when API returns organisation details
// test('should render organisation name', async (t) => {
//   await pageSetup(t);

//   const orgName = Selector('[data-test-id="org-name"]');

//   await t
//     .expect(orgName.exists).ok()
//     .expect(await extractInnerText(orgName)).eql(organisationDetails.name);
// });

test('should render a text field for each question', async (t) => {
  await pageSetup(t);

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
  await pageSetup(t);

  const addUserButton = Selector('[data-test-id="add-user-button"] button');

  await t
    .expect(addUserButton.exists).ok()
    .expect(await extractInnerText(addUserButton)).eql(content.addUserButtonText)
    .expect(addUserButton.hasClass('nhsuk-u-margin-bottom-9')).ok();
  // TODO: Uncomment when API allows users to be added
  // .expect(addUserButton.getAttribute('href')).eql(`/organisations/${organisationDetails.organisationId}/adduser`);
  // .click()
  // Add tests for confirmation page for success
  // Add tests for validation
});
