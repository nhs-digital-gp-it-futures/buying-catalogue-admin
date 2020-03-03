import manifest from './manifest.json';
import { getContext } from './contextCreator';

describe('getContext', () => {
  it('should return the contents of the manfest', () => {
    const context = getContext({});
    expect(context.title).toEqual(manifest.title);
    expect(context.description).toEqual(manifest.description);
    expect(context.columnInfo).toEqual(manifest.columnInfo);
    expect(context.columnClass).toEqual(manifest.columnClass);
  });

  it('should return an empty array for organisations key if no data provided', () => {
    const context = getContext({});
    expect(context.organisations).toEqual([]);
  });

  it('should transform data into correct format if all data provided', () => {
    const mockData = [{ name: 'Greater Manchester CCG', odsCode: 'X01', orgId: 'org1' }, { name: 'Hampshire CCG', odsCode: 'X02', orgId: 'org2' }];
    const { organisations } = getContext({ data: mockData });
    expect(organisations[0][0].data).toEqual(mockData[0].name);
    expect(organisations[0][0].href).toEqual(`organisations/${mockData[0].orgId}`);
    expect(organisations[0][1].data).toEqual(mockData[0].odsCode);
    expect(organisations[1][0].data).toEqual(mockData[1].name);
    expect(organisations[1][0].href).toEqual(`organisations/${mockData[1].orgId}`);
    expect(organisations[1][1].data).toEqual(mockData[1].odsCode);
  });

  it('should transform data into correct format if data provided has missing fields', () => {
    const mockData = [
      { odsCode: 'X01', orgId: 'org2' },
      { name: 'Hampshire CCG', orgId: 'org2' },
      { name: 'Somerset CCG', odsCode: 'X01' },
    ];
    const { organisations } = getContext({ data: mockData });
    expect(organisations[0][0].data).toEqual('');
    expect(organisations[0][0].href).toEqual(`organisations/${mockData[0].orgId}`);
    expect(organisations[0][1].data).toEqual(mockData[0].odsCode);
    expect(organisations[1][0].data).toEqual(mockData[1].name);
    expect(organisations[1][0].href).toEqual(`organisations/${mockData[1].orgId}`);
    expect(organisations[1][1].data).toEqual('');
    expect(organisations[2][0].data).toEqual(mockData[2].name);
    expect(organisations[2][0].href).toEqual('#');
    expect(organisations[2][1].data).toEqual(mockData[2].odsCode);
  });
});
