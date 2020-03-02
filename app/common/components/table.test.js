import { createTestHarness } from '../../test-utils/testHarness';

const setup = {
  component: {
    name: 'table',
    path: 'common/components/table.njk',
  },
};

const mockContext = {
  params: {
    title: 'Manage organisations and users',
    description: 'Edit existing account information or add new user to an organisation.',
    columnInfo: [
      { data: 'Organisation name' },
      { data: 'ODS code' },
    ],
    columnClass: 'nhsuk-grid-column-one-half',
    data: [
      [{ data: 'Greater Manchester CCG' }, { data: 'X01' }],
      [{ data: 'Hampshire CCG' }, { data: 'X02' }]],
  },
};

describe('table', () => {
  it('should render the table', createTestHarness(setup, (harness) => {
    harness.request(mockContext, ($) => {
      expect($('[data-test-id="table"]').length).toEqual(1);
    });
  }));

  it('should render the table headings with correct classes if columnInfo is passed in', createTestHarness(setup, (harness) => {
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

  it('should render the table rows with text and classes if data is passed in', createTestHarness(setup, (harness) => {
    const context = { params: { ...mockContext.params } };
    harness.request(context, ($) => {
      context.params.data.forEach((row, rowIndex) => {
        row.forEach((dataPoint, i) => {
          expect($(`[data-test-id="table-row-${rowIndex}"] div:nth-child(${i + 1})`).text().trim()).toEqual(dataPoint.data);
          expect($(`[data-test-id="table-row-${rowIndex}"] div:nth-child(${i + 1})`).hasClass(mockContext.params.columnClass)).toEqual(true);
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

  it('should render <a> for data with link property', createTestHarness(setup, (harness) => {
    const context = { params: { ...mockContext.params } };
    context.params.data[0][0].href = 'organisations/org1';
    context.params.data[0][1].href = 'ods/X01';
    context.params.data[1][0].href = 'organisations/org1';
    context.params.data[1][1].href = 'ods/X02';
    harness.request(context, ($) => {
      context.params.data.forEach((row, rowIndex) => {
        row.forEach((dataPoint, i) => {
          const aTag = $(`[data-test-id="table-row-${rowIndex}"] a:nth-child(${i + 1})`);
          expect(aTag.text().trim()).toEqual(dataPoint.data);
          expect(aTag.hasClass(mockContext.params.columnClass)).toEqual(true);
          expect(aTag.attr('href')).toEqual(dataPoint.href);
          expect($(`[data-test-id="table-row-${rowIndex}"] div`).length).toEqual(0);
        });
      });
    });
  }));

  it('should render <div> for data with no link property', createTestHarness(setup, (harness) => {
    const context = { params: { ...mockContext.params } };
    delete context.params.data[0][0].href;
    delete context.params.data[0][1].href;
    delete context.params.data[1][0].href;
    delete context.params.data[1][1].href;
    harness.request(context, ($) => {
      context.params.data.forEach((row, rowIndex) => {
        row.forEach((dataPoint, i) => {
          const divTag = $(`[data-test-id="table-row-${rowIndex}"] div:nth-child(${i + 1})`);
          expect(divTag.text().trim()).toEqual(dataPoint.data);
          expect(divTag.hasClass(mockContext.params.columnClass)).toEqual(true);
          expect($(`[data-test-id="table-row-${rowIndex}"] a`).length).toEqual(0);
        });
      });
    });
  }));

  it('should render tag component for columns with tag property', createTestHarness(setup, (harness) => {
    const context = { params: { ...mockContext.params } };
    delete context.params.data[0][0].href;
    delete context.params.data[0][1].href;
    delete context.params.data[1][0].href;
    delete context.params.data[1][1].href;
    context.params.data[0][0].tag = {
      dataTestId: 'a-tag-id-1',
      text: 'tag text',
      classes: 'a-class',
    };
    harness.request(context, ($) => {
      expect($('[data-test-id="a-tag-id-1"]').text().trim()).toEqual(context.params.data[0][0].tag.text);
      expect($('[data-test-id="a-tag-id-1"]').hasClass(context.params.data[0][0].tag.classes)).toEqual(true);
    });
  }));
});
