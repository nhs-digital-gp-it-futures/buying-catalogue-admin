import { createTestHarness } from '../../../test-utils/testHarness';

const setup = {
  component: {
    name: 'table',
    path: 'pages/dashboard/components/table.njk',
  },
};

const mockContext = {
  params: {
    title: 'Manage organisations and users',
    description: 'Edit existing account information or add new user to an organisation.',
    columnInfo: [
      { data: 'Organisation name', link: true },
      { data: 'ODS code', link: false },
    ],
    columnClass: 'nhsuk-grid-column-one-half',
    data: [['Greater Manchester CCG', 'X01'], ['Hampshire CCG', 'X02']],
  },
};

describe('table', () => {
  it('should render the table', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      expect($('[data-test-id="table"]').length).toEqual(1);
    });
  }));

  it('should render the table headings if columnInfo is passed in', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      expect($('[data-test-id="table-headings"]').length).toEqual(1);
      expect($('[data-test-id="column-heading"]').length).toEqual(mockContext.params.columnInfo.length);
      mockContext.params.columnInfo.forEach((heading, i) => {
        expect($(`[data-test-id="column-heading"]:nth-child(${i + 1})`).text().trim()).toEqual(heading.data);
        expect($(`[data-test-id="column-heading"]:nth-child(${i + 1})`).hasClass(mockContext.params.columnClass)).toEqual(true);
      });
    });
  }));

  it('should not render the table headings if no data is passed in', createTestHarness(setup, (harness) => {
    const context = { params: { ...mockContext.params } };
    delete context.params.columnInfo;

    harness.request(context, ($) => {
      expect($('[data-test-id="table-headings"]').length).toEqual(0);
      expect($('[data-test-id="column-heading"]').length).toEqual(0);
    });
  }));
  it('should render the table rows if data is passed in', createTestHarness(setup, (harness) => {
    const context = { params: { ...mockContext.params } };
    // context.params.data = [['Greater Manchester CCG', 'X01']];
    context.params.columnInfo[0].link = false;
    harness.request(context, ($) => {
      context.params.data.forEach((row, rowIndex) => {
        row.forEach((dataPoint, i) => {
          expect($(`[data-test-id="table-row-${rowIndex}"] div:nth-child(${i + 1})`).text().trim()).toEqual(dataPoint);
        });
      });
    });
  }));

  it('should not render the table rows if no data is passed in', createTestHarness(setup, (harness) => {
    const context = { params: { ...mockContext.params } };
    delete context.params.data;

    harness.request(context, ($) => {
      expect($('[data-test-id="table-rows"]').length).toEqual(0);
    });
  }));
});
