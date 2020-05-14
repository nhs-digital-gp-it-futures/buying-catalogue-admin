import nock from 'nock';
import { extractInnerText } from 'buying-catalogue-library';
import { Selector, ClientFunction } from 'testcafe';
import content from './manifest.json';
import mockOrg from '../../../test-utils/fixtures/organisationDetails.json';
import { extractObjectValuesToArray } from '../../../helpers/contextCreatorHelper';
import { organisationsApiLocalhost } from '../../../test-utils/config';

const pageUrl = `http://localhost:1234/admin/organisations/find/select?ods=${mockOrg.odsCode}`;

const setCookies = ClientFunction(() => {
  const cookieValue = JSON.stringify({
    id: '88421113', name: 'Cool Dude', organisation: 'view',
  });

  document.cookie = `fakeToken=${cookieValue}`;
});

const mocks = () => {
  nock(organisationsApiLocalhost)
    .get(`/api/v1/ods/${mockOrg.odsCode}`)
    .reply(200, mockOrg);
};

const pageSetup = async (t, withAuth = false) => {
  if (withAuth) {
    mocks();
    await setCookies();
  }
};

const getLocation = ClientFunction(() => document.location.href);

fixture('find Org Page')
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

  await t
    .expect(getLocation()).eql('http://identity-server/login');
});

test('should render Select Organisation page', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const page = Selector('[data-test-id="select-org-page"]');

  await t
    .expect(page.exists).ok();
});

test('should navigate to /admin/organisations/find when click on Back', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const goBackLink = Selector('[data-test-id="go-back-link"] a');

  await t
    .expect(goBackLink.exists).ok()
    .click(goBackLink)
    .expect(getLocation()).eql(`http://localhost:1234/admin/organisations/find?ods=${mockOrg.odsCode}`);
});

test('should render the title', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const title = Selector('h1[data-test-id="select-org-page-title"]');

  await t
    .expect(title.exists).ok()
    .expect(await extractInnerText(title)).eql(content.title);
});

test('should render the description', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const description = Selector('h2[data-test-id="select-org-page-description"]');

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
    .expect(await extractInnerText(odsCode)).eql(mockOrg.odsCode);
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
    .expect(await extractInnerText(orgName)).eql(mockOrg.organisationName);
});

test('should render business address', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const address = extractObjectValuesToArray(mockOrg.address);

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
    .expect(await extractInnerText(primaryRoleId)).eql(mockOrg.primaryRoleId);
});

test('should render select org button', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const button = Selector('[data-test-id="select-org-button"] button');

  await t
    .expect(button.exists).ok()
    .expect(await extractInnerText(button)).eql(content.selectOrgButtonText)
    .expect(button.hasClass('nhsuk-u-margin-bottom-9')).ok();
});

test('should navigate to create organisation page when select button is pressed and no errors', async (t) => {
  await pageSetup(t, true);
  await t.navigateTo(pageUrl);

  const button = Selector('[data-test-id="select-org-button"] button');

  await t
    .expect(button.exists).ok()
    .click(button)
    .expect(getLocation()).eql(`http://localhost:1234/admin/organisations/find/select/create?ods=${mockOrg.odsCode}`);
});
