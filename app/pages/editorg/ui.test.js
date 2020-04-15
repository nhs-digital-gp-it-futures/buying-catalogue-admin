import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import content from './manifest.json';
import confirmationContent from './confirmation/manifest.json';
import { extractInnerText } from '../../test-utils/helper';
import { organisationsApiLocalhost } from '../../test-utils/config';
import organisationDetails from '../../test-utils/fixtures/organisationDetails.json';
import { extractObjectValuesToArray } from '../../helpers/contextCreatorHelper';

const pageUrl = 'http://localhost:1234/admin/organisations/org1/edit';

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

fixture('Edit Organisation Page')
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

test('should render Edit Organisation page', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const editOrgPage = Selector('[data-test-id="edit-organisation-page"]');

  await t
    .expect(editOrgPage.exists).ok();
});

test('should navigate to /admin/organisations/org1 when click on Back', async (t) => {
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org1')
    .reply(200, organisationDetails);
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org1/Users')
    .reply(200, organisationDetails);

  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const goBackLink = Selector('[data-test-id="go-back-link"] a');

  await t
    .expect(goBackLink.exists).ok()
    .click(goBackLink)
    .expect(getLocation()).eql('http://localhost:1234/admin/organisations/org1');
});

test('should render the title', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const title = Selector('h1[data-test-id="edit-org-page-title"]');

  await t
    .expect(title.exists).ok()
    .expect(await extractInnerText(title)).eql(`Edit ${organisationDetails.name}`);
});

test('should render the description', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const description = Selector('h2[data-test-id="edit-org-page-description"]');

  await t
    .expect(description.exists).ok()
    .expect(await extractInnerText(description)).eql(content.description);
});

test('should render organisation ods code', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const odsCodeHeading = Selector('h3[data-test-id="organisation-ods-code-heading"]');
  const odsCode = Selector('div[data-test-id="organisation-ods-code"]');

  await t
    .expect(odsCodeHeading.exists).ok()
    .expect(await extractInnerText(odsCodeHeading)).eql(content.odsCodeHeading)
    .expect(odsCode.exists).ok()
    .expect(await extractInnerText(odsCode)).eql(organisationDetails.odsCode);
});

test('should render organisation name', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const orgNameHeading = Selector('h3[data-test-id="organisation-name-heading"]');
  const orgName = Selector('div[data-test-id="organisation-name"]');

  await t
    .expect(orgNameHeading.exists).ok()
    .expect(await extractInnerText(orgNameHeading)).eql(content.organisationNameHeading)
    .expect(orgName.exists).ok()
    .expect(await extractInnerText(orgName)).eql(organisationDetails.name);
});

test('should render business address', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const address = extractObjectValuesToArray(organisationDetails.address);

  const addressHeading = Selector('[data-test-id="organisation-address-heading"]');
  const addressTextLine1 = Selector('[data-test-id="organisation-address-1"]');
  const addressTextLine2 = Selector('[data-test-id="organisation-address-2"]');
  const addressTextLine3 = Selector('[data-test-id="organisation-address-3"]');
  const addressTextLine4 = Selector('[data-test-id="organisation-address-4"]');
  const addressTextLine5 = Selector('[data-test-id="organisation-address-5"]');
  const addressTextLine6 = Selector('[data-test-id="organisation-address-6"]');
  const addressTextLine7 = Selector('[data-test-id="organisation-address-7"]');

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

test('should render primary role id', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const primaryRoleIdHeading = Selector('h3[data-test-id="organisation-primary-role-id-heading"]');
  const primaryRoleId = Selector('div[data-test-id="organisation-primary-role-id"]');

  await t
    .expect(primaryRoleIdHeading.exists).ok()
    .expect(await extractInnerText(primaryRoleIdHeading)).eql(content.primaryRoleIdHeading)
    .expect(primaryRoleId.exists).ok()
    .expect(await extractInnerText(primaryRoleId)).eql(organisationDetails.primaryRoleId);
});

test('should catalogue agreement signed checkbox', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const catalogueAgreementCheckboxInput = Selector('[data-test-id="catalogue-agreement-checkbox"] input');
  const catalogueAgreementCheckboxLabel = Selector('[data-test-id="catalogue-agreement-checkbox"] label');

  await t
    .expect(catalogueAgreementCheckboxInput.exists).ok()
    .expect(catalogueAgreementCheckboxInput.getAttribute('name')).eql('catalogueAgreementSigned')
    .expect(catalogueAgreementCheckboxInput.getAttribute('id')).eql('catalogue-agreement-checkbox')
    .expect(catalogueAgreementCheckboxInput.getAttribute('type')).eql('checkbox')
    .expect(catalogueAgreementCheckboxLabel.exists).ok()
    .expect(await extractInnerText(catalogueAgreementCheckboxLabel)).eql(content.catalogueAgreementCheckboxText)
    .expect(catalogueAgreementCheckboxLabel.getAttribute('for')).eql('catalogue-agreement-checkbox');
});

test('should render save button', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const saveButton = Selector('[data-test-id="save-button"] button');

  await t
    .expect(saveButton.exists).ok()
    .expect(await extractInnerText(saveButton)).eql(content.saveButtonText)
    .expect(saveButton.hasClass('nhsuk-u-margin-bottom-9')).ok();
});

test('should navigate to confirmation page when save button is clicked', async (t) => {
  nock(organisationsApiLocalhost)
    .put('/api/v1/Organisations/org1')
    .reply(200, {});

  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const saveButton = Selector('[data-test-id="save-button"] button');

  await t
    .expect(saveButton.exists).ok()
    .click(saveButton)
    .expect(getLocation()).eql(`${pageUrl}/confirmation`);
});

fixture('Edit Organisation Confirmation Page')
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

  await t.navigateTo(`${pageUrl}/confirmation`);

  await t
    .expect(getLocation()).eql('http://identity-server/login');
});

test('should render Edit Organisation Confirmation page', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(`${pageUrl}/confirmation`);

  const editOrgComfirmationPage = Selector('[data-test-id="edit-organisation-confirmation-page"]');

  await t
    .expect(editOrgComfirmationPage.exists).ok();
});

test('should navigate to /admin/organisations/org1 when click on Back', async (t) => {
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org1')
    .reply(200, organisationDetails);
  nock(organisationsApiLocalhost)
    .get('/api/v1/Organisations/org1/Users')
    .reply(200, {});
  await pageSetup(t, true);
  await t.navigateTo(`${pageUrl}/confirmation`);

  const goBackLink = Selector('[data-test-id="go-back-link"] a');

  await t
    .expect(goBackLink.exists).ok()
    .click(goBackLink)
    .expect(getLocation()).eql('http://localhost:1234/admin/organisations/org1');
});

test('should render the title', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(`${pageUrl}/confirmation`);

  const title = Selector('h1[data-test-id="edit-organisation-confirmation-page-title"]');

  await t
    .expect(title.exists).ok()
    .expect(await extractInnerText(title)).eql(`${organisationDetails.name} updated`);
});

test('should render the description', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(`${pageUrl}/confirmation`);

  const description = Selector('h2[data-test-id="edit-organisation-confirmation-page-description"]');

  await t
    .expect(description.exists).ok()
    .expect(await extractInnerText(description)).eql(confirmationContent.description);
});
