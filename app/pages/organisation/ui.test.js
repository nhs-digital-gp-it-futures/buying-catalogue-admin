import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import { organisationsApiLocalhost } from '../../test-utils/config';
import { extractInnerText } from '../../test-utils/helper';
import { extractObjectValuesToArray } from '../../helpers/contextCreatorHelper';
import organisationDetails from '../../test-utils/fixtures/organisationDetails.json';
import usersData from '../../test-utils/fixtures/users.json';
import content from './manifest.json';

const pageUrl = 'http://localhost:1234/admin/organisations/org1';

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
  nock(organisationsApiLocalhost)
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

test('should render the title', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const title = Selector('h1[data-test-id="org-page-title"]');

  await t
    .expect(title.exists).ok()
    .expect(await extractInnerText(title)).eql(organisationDetails.name);
});

test('should render the description', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const description = Selector('h2[data-test-id="org-page-description"]');

  await t
    .expect(description.exists).ok()
    .expect(await extractInnerText(description)).eql(content.description);
});

test('should render organisation details subheading', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const orgDetailsSubheading = Selector('h3[data-test-id="organisation-details-subheading"]');

  await t
    .expect(orgDetailsSubheading.exists).ok()
    .expect(await extractInnerText(orgDetailsSubheading)).eql(content.orgSubheading);
});

test('should render edit org button', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const editOrgButton = Selector('[data-test-id="edit-org-button"] a');

  await t
    .expect(editOrgButton.exists).ok()
    .expect(await extractInnerText(editOrgButton)).eql(content.editOrgButtonText)
    .expect(editOrgButton.hasClass('nhsuk-u-margin-bottom-9')).ok()
    .expect(editOrgButton.getAttribute('href')).eql('/admin/organisations/org1/edit');
});

test('should navigate to edit org page when add edit org button is clicked', async (t) => {
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org1')
    .reply(200, organisationDetails);

  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const editOrgButton = Selector('[data-test-id="edit-org-button"] a');
  const orgId = organisationDetails.organisationId;

  await t
    .expect(editOrgButton.exists).ok()
    .click(editOrgButton)
    .expect(getLocation()).eql(`http://localhost:1234/admin/organisations/${orgId}/edit`);
});

test('should render organisation ods code', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const odsCodeHeading = Selector('[data-test-id="org-page-ods-code-heading"]');
  const odsCodeText = Selector('[data-test-id="org-page-ods-code"]');

  await t
    .expect(odsCodeHeading.exists).ok()
    .expect(await extractInnerText(odsCodeHeading)).eql(content.odsCodeHeading)
    .expect(odsCodeText.exists).ok()
    .expect(await extractInnerText(odsCodeText)).eql(organisationDetails.odsCode);
});

test('should render organisation primary role id', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const primaryRoleIdHeading = Selector('[data-test-id="org-page-primary-role-id-heading"]');
  const primaryRoleId = Selector('[data-test-id="org-page-primary-role-id"]');

  await t
    .expect(primaryRoleIdHeading.exists).ok()
    .expect(await extractInnerText(primaryRoleIdHeading)).eql(content.primaryRoleIdHeading)
    .expect(primaryRoleId.exists).ok()
    .expect(await extractInnerText(primaryRoleId)).eql(organisationDetails.primaryRoleId);
});

test('should render address', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const address = extractObjectValuesToArray(organisationDetails.address);

  const addressHeading = Selector('[data-test-id="org-page-address-heading"]');
  const addressTextLine1 = Selector('[data-test-id="org-page-address-1"]');
  const addressTextLine2 = Selector('[data-test-id="org-page-address-2"]');
  const addressTextLine3 = Selector('[data-test-id="org-page-address-3"]');
  const addressTextLine4 = Selector('[data-test-id="org-page-address-4"]');
  const addressTextLine5 = Selector('[data-test-id="org-page-address-5"]');
  const addressTextLine6 = Selector('[data-test-id="org-page-address-6"]');
  const addressTextLine7 = Selector('[data-test-id="org-page-address-7"]');

  await t
    .expect(addressHeading.exists).ok()
    .expect(await extractInnerText(addressHeading)).eql(content.addressHeading)
    .expect(addressTextLine1.exists).ok()
    .expect(await extractInnerText(addressTextLine1)).eql(address[0])
    .expect(addressTextLine2.exists).ok()
    .expect(await extractInnerText(addressTextLine2)).eql(address[1])
    .expect(addressTextLine3.exists).ok()
    .expect(await extractInnerText(addressTextLine3)).eql(address[2])
    .expect(addressTextLine4.exists).ok()
    .expect(await extractInnerText(addressTextLine4)).eql(address[3])
    .expect(addressTextLine5.exists).ok()
    .expect(await extractInnerText(addressTextLine5)).eql(address[4])
    .expect(addressTextLine6.exists).ok()
    .expect(await extractInnerText(addressTextLine6)).eql(address[5])
    .expect(addressTextLine7.exists).ok()
    .expect(await extractInnerText(addressTextLine7)).eql(address[6]);
});

test('should render the agreement signed checked statement', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const agreementSignedCheckedStatement = Selector('[data-test-id="agreement-signed-checked-statement"]');

  await t
    .expect(agreementSignedCheckedStatement.exists).ok()
    .expect(await extractInnerText(agreementSignedCheckedStatement)).eql(content.agreementSignedText);
});

test('should render user accounts subheading', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const accountsSubheading = Selector('h3[data-test-id="accounts-subheading"]');

  await t
    .expect(accountsSubheading.exists).ok()
    .expect(await extractInnerText(accountsSubheading)).eql(`${content.accountsSubheading} ${organisationDetails.name}`);
});

test('should render add user button', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const addUserButton = Selector('[data-test-id="add-user-button"] a');
  const orgId = organisationDetails.organisationId;

  await t
    .expect(addUserButton.exists).ok()
    .expect(await extractInnerText(addUserButton)).eql(content.addUserButtonText)
    .expect(addUserButton.hasClass('nhsuk-u-margin-bottom-9')).ok()
    .expect(addUserButton.getAttribute('href')).eql(`/admin/organisations/${orgId}/adduser`);
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

test('should render the table with users', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const table = Selector('div[data-test-id="user-table"]');
  const tableHeadings = Selector('[data-test-id="table-headings"]');
  const columnHeading1 = tableHeadings.find('[data-test-id="column-heading-0"]');
  const columnHeading2 = tableHeadings.find('[data-test-id="column-heading-1"]');
  const columnHeading3 = tableHeadings.find('[data-test-id="column-heading-2"]');

  const user1Row = Selector('div[data-test-id="table-row-0"]');
  const user1Name = user1Row.find('a');
  const user1Phone = user1Row.find('div');
  const user1Email = Selector('div[data-test-id="table-row-0"] div:nth-child(3)');
  const user1DisabledTag = user1Row.find('div').withText('ACCOUNT DISABLED');

  const user2Row = Selector('div[data-test-id="table-row-1"]');
  const user2Name = user2Row.find('a');
  const user2Phone = user2Row.find('div');
  const user2Email = Selector('div[data-test-id="table-row-1"] div:nth-child(3)');
  const user2DisabledTag = user2Row.find('div').withText('ACCOUNT DISABLED');

  await t
    .expect(table.exists).ok()
    .expect(tableHeadings.exists).ok()
    .expect(columnHeading1.exists).ok()
    .expect(await extractInnerText(columnHeading1)).eql(content.columnInfo[0].data)
    .expect(await extractInnerText(columnHeading2)).eql(content.columnInfo[1].data)
    .expect(await extractInnerText(columnHeading3)).eql(content.columnInfo[2].data)
    .expect(await extractInnerText(user1Name)).eql(`${usersData.users[0].firstName} ${usersData.users[0].lastName}`)
    .expect(await extractInnerText(user1Phone)).eql(usersData.users[0].phoneNumber)
    .expect(await extractInnerText(user1Email)).eql(usersData.users[0].emailAddress)
    .expect(user1DisabledTag.exists).notOk()
    .expect(await extractInnerText(user2Name)).eql(`${usersData.users[1].firstName} ${usersData.users[1].lastName}`)
    .expect(await extractInnerText(user2Phone)).eql(usersData.users[1].phoneNumber)
    .expect(await extractInnerText(user2Email)).eql(usersData.users[1].emailAddress)
    .expect(user2DisabledTag.exists).ok();
});

test('should navigate to view user page when user name is clicked', async (t) => {
  nock(organisationsApiLocalhost)
    .get(`/api/v1/Users/${usersData.users[0].userId}`)
    .reply(200, organisationDetails);
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org1')
    .reply(200, organisationDetails);

  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const orgId = organisationDetails.organisationId;

  const user1Row = Selector('div[data-test-id="table-row-0"]');
  const user1Name = user1Row.find('a');

  await t
    .expect(user1Name.exists).ok()
    .click(user1Name)
    .expect(getLocation()).eql(`http://localhost:1234/admin/organisations/${orgId}/${usersData.users[0].userId}`);
});
