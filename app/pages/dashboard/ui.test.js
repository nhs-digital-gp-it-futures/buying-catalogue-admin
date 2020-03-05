import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import content from './manifest.json';
import { extractInnerText } from '../../test-utils/helper';
// import { apiLocalhost } from '../../test-utils/config';
// import organisationsList from '../../test-utils/fixtures/organisationsList.json';

// const mocks = () => {
//   nock(apiLocalhost)
//     .get('/api/v1/Organisations')
//     .reply(200, organisationsList);
// };

const pageSetup = async (t) => {
  // await mocks();
  await t.navigateTo('http://localhost:1234/organisations');
};

const getLocation = ClientFunction(() => document.location.href);

fixture('Organisation Dashboard Page')
  .afterEach(async (t) => {
    const isDone = nock.isDone();
    if (!isDone) {
      nock.cleanAll();
    }

    await t.expect(isDone).ok('Not all nock interceptors were used!');
  });

test('should render Organisations dashboard page', async (t) => {
  await pageSetup(t);

  const orgDashboardPage = Selector('[data-test-id="organisations"]');

  await t
    .expect(orgDashboardPage.exists).ok();
});

test('should navigate to / when click Back', async (t) => {
  await pageSetup(t);

  const goBackLink = Selector('[data-test-id="go-back-link"] a');

  await t
    .expect(goBackLink.exists).ok()
    .click(goBackLink)
    .expect(getLocation()).eql('http://localhost:1234/');
});

test('should render the title', async (t) => {
  await pageSetup(t);

  const title = Selector('h1[data-test-id="org-dashboard-title"]');

  await t
    .expect(title.exists).ok()
    .expect(await extractInnerText(title)).eql(content.title);
});

test('should render the description', async (t) => {
  await pageSetup(t);

  const description = Selector('h2[data-test-id="org-dashboard-description"]');

  await t
    .expect(description.exists).ok()
    .expect(await extractInnerText(description)).eql(content.description);
});

test('should render add org button', async (t) => {
  await pageSetup(t);

  const addOrgButton = Selector('[data-test-id="add-org-button"] a');

  await t
    .expect(addOrgButton.exists).ok()
    .expect(await extractInnerText(addOrgButton)).eql(content.addOrgButtonText)
    .expect(addOrgButton.hasClass('nhsuk-u-margin-bottom-9')).ok()
    // TODO: Change when add organisation implemented
    .expect(addOrgButton.getAttribute('href')).eql('#');
});

test('should render the table', async (t) => {
  await pageSetup(t);

  const table = Selector('div[data-test-id="org-table"]');
  const tableHeadings = Selector('[data-test-id="table-headings"]');
  const columnHeading1 = tableHeadings.find('[data-test-id="column-heading"]:nth-child(1)');
  const columnHeading2 = tableHeadings.find('[data-test-id="column-heading"]:nth-child(2)');

  await t
    .expect(table.exists).ok()
    .expect(tableHeadings.exists).ok()
    .expect(columnHeading1.exists).ok()
    .expect(await extractInnerText(columnHeading1)).eql(content.columnInfo[0].data)
    .expect(await extractInnerText(columnHeading2)).eql(content.columnInfo[1].data);
  // TODO: Add tests for column data once API is ready
});
