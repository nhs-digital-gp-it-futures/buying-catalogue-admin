import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import content from './manifest.json';
import { extractInnerText } from '../../test-utils/helper';
// import { apiLocalhost } from '../../test-utils/config';
// import organisationDetails from '../../test-utils/fixtures/organisationDetails.json';

const setCookies = ClientFunction(() => {
  const cookieValue = JSON.stringify({
    id: '88421113', name: 'Cool Dude', organisation: 'view',
  });

  document.cookie = `fakeToken=${cookieValue}`;
});

// const mocks = () => {
//   nock(apiLocalhost)
//     .get('/api/v1/Organisations/org1')
//     .reply(200, organisationDetails);
// };

const pageSetup = async (t, withAuth = false) => {
  if (withAuth) {
    await setCookies();
  }
};

const getLocation = ClientFunction(() => document.location.href);

fixture('Organisation Page')
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

  await t.navigateTo('http://localhost:1234/organisations/org1');

  await t
    .expect(getLocation()).eql('http://identity-server/login');
});

test('should render Organisation page', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1');

  const orgPage = Selector('[data-test-id="organisation"]');

  await t
    .expect(orgPage.exists).ok();
});

test('should navigate to /organisations when click on Back', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1');

  const goBackLink = Selector('[data-test-id="go-back-link"] a');

  await t
    .expect(goBackLink.exists).ok()
    .click(goBackLink)
    .expect(getLocation()).eql('http://localhost:1234/organisations');
});

// TODO: Uncomment when API returns organisation details
// test('should render the title', async (t) => {
//   await pageSetup(t);

//   const title = Selector('h1[data-test-id="org-page-title"]');

//   await t
//     .expect(title.exists).ok()
//     .expect(await extractInnerText(title)).eql(organisationDetails.name);
// });

test('should render the description', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1');

  const description = Selector('h2[data-test-id="org-page-description"]');

  await t
    .expect(description.exists).ok()
    .expect(await extractInnerText(description)).eql(content.description);
});

test('should render organisation details subheading', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1');

  const orgDetailsSubheading = Selector('h3[data-test-id="organisation-details-subheading"]');

  await t
    .expect(orgDetailsSubheading.exists).ok()
    .expect(await extractInnerText(orgDetailsSubheading)).eql(content.orgSubheading);
});

test('should render edit org button', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1');

  const editOrgButton = Selector('[data-test-id="edit-org-button"] a');

  await t
    .expect(editOrgButton.exists).ok()
    .expect(await extractInnerText(editOrgButton)).eql(content.editOrgButtonText)
    .expect(editOrgButton.hasClass('nhsuk-u-margin-bottom-9')).ok()
    // TODO: Change when edit organisation implemented
    .expect(editOrgButton.getAttribute('href')).eql('#');
  // .click()
});

test('should render organisation ods code', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1');

  const odsCodeHeading = Selector('[data-test-id="org-page-ods-code-heading"]');
  // TODO: Uncomment when API returns organisation details
  // const odsCodeText = Selector('[data-test-id="org-page-ods-code"]');

  await t
    .expect(odsCodeHeading.exists).ok()
    .expect(await extractInnerText(odsCodeHeading)).eql(content.odsCodeHeading);
  // TODO: Uncomment when API returns organisation details
  // .expect(odsCodeText.exists).ok()
  // .expect(await extractInnerText(odsCodeText)).eql(organisationDetails.odsCode);
});

test('should render organisation ods code', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1');

  const primaryRoleIdHeading = Selector('[data-test-id="org-page-primary-role-id-heading"]');
  // TODO: Uncomment when API returns organisation details
  // const primaryRoleId = Selector('[data-test-id="org-page-primary-role-id-heading"]');

  await t
    .expect(primaryRoleIdHeading.exists).ok()
    .expect(await extractInnerText(primaryRoleIdHeading)).eql(content.primaryRoleIdHeading);
  // TODO: Uncomment when API returns organisation details
  // .expect(primaryRoleId.exists).ok()
  // .expect(await extractInnerText(primaryRoleId)).eql(organisationDetails.primaryRoleId);
});

test('should render address', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1');

  // TODO: Uncomment when API returns organisation details
  // const address = organisationDetails.address.split(',');

  const addressHeading = Selector('[data-test-id="org-page-address-heading"]');
  // TODO: Uncomment when API returns organisation details
  // const addressTextLine1 = Selector('[data-test-id="org-page-address-0"]');
  // const addressTextLine2 = Selector('[data-test-id="org-page-address-1"]');
  // const addressTextLine3 = Selector('[data-test-id="org-page-address-2"]');
  // const addressTextLine4 = Selector('[data-test-id="org-page-address-3"]');

  await t
    .expect(addressHeading.exists).ok()
    .expect(await extractInnerText(addressHeading)).eql(content.addressHeading);
  // TODO: Uncomment when API returns organisation details
  // .expect(addressTextLine1.exists).ok()
  // .expect(await extractInnerText(addressTextLine1)).eql(address[0]);
  // .expect(addressTextLine2.exists).ok()
  // .expect(await extractInnerText(addressTextLine2)).eql(address[1]);
  // .expect(addressTextLine3.exists).ok()
  // .expect(await extractInnerText(addressTextLine3)).eql(address[2]);
  // .expect(addressTextLine4.exists).ok()
  // .expect(await extractInnerText(addressTextLine4)).eql(address[3]);
});

// TODO: Uncomment when API returns organisation details
// test('should render the agreement signed checked statement', async (t) => {
//   await pageSetup(t);

//   const agreementSignedCheckedStatement = Selector('[data-test-id="agreement-signed-checked-statement"]');

//   await t
//     .expect(agreementSignedCheckedStatement.exists).ok()
//     .expect(await extractInnerText(agreementSignedCheckedStatement)).eql(content.agreementSignedText);
// });

test('should render user accounts subheading', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1');

  const accountsSubheading = Selector('h3[data-test-id="accounts-subheading"]');

  await t
    .expect(accountsSubheading.exists).ok()
    .expect(await extractInnerText(accountsSubheading)).eql(content.accountsSubheading);
});

test('should render add user button', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo('http://localhost:1234/organisations/org1');

  const addUserButton = Selector('[data-test-id="add-user-button"] a');

  await t
    .expect(addUserButton.exists).ok()
    .expect(await extractInnerText(addUserButton)).eql(content.addUserButtonText)
    .expect(addUserButton.hasClass('nhsuk-u-margin-bottom-9')).ok();
  // TODO: Uncomment when API returns organisation details
  // .expect(addUserButton.getAttribute('href')).eql(`/organisations/${organisationDetails.organisationId}/adduser`);
  // .click()
});

test('should render the table with users', async (t) => {
  await pageSetup(t, true);  
  await t.navigateTo('http://localhost:1234/organisations/org1');

  const table = Selector('div[data-test-id="user-table"]');
  const tableHeadings = Selector('[data-test-id="table-headings"]');
  const columnHeading1 = tableHeadings.find('[data-test-id="column-heading"]:nth-child(1)');
  const columnHeading2 = tableHeadings.find('[data-test-id="column-heading"]:nth-child(2)');
  const columnHeading3 = tableHeadings.find('[data-test-id="column-heading"]:nth-child(3)');

  await t
    .expect(table.exists).ok()
    .expect(tableHeadings.exists).ok()
    .expect(columnHeading1.exists).ok()
    .expect(await extractInnerText(columnHeading1)).eql(content.columnInfo[0].data)
    .expect(await extractInnerText(columnHeading2)).eql(content.columnInfo[1].data)
    .expect(await extractInnerText(columnHeading3)).eql(content.columnInfo[2].data);
  // TODO: Add tests when API returns organisation users
  // .click()
});
