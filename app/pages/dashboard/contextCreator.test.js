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
    const mockOrganisations = [{ name: 'Greater Manchester CCG', odsCode: 'X01', organisationId: 'org1' }, { name: 'Hampshire CCG', odsCode: 'X02', organisationId: 'org2' }];
    const { organisations } = getContext({ organisations: mockOrganisations });
    expect(organisations[0][0].data).toEqual(mockOrganisations[0].name);
    expect(organisations[0][0].href).toEqual(`organisations/${mockOrganisations[0].organisationId}`);
    expect(organisations[0][1].data).toEqual(mockOrganisations[0].odsCode);
    expect(organisations[1][0].data).toEqual(mockOrganisations[1].name);
    expect(organisations[1][0].href).toEqual(`organisations/${mockOrganisations[1].organisationId}`);
    expect(organisations[1][1].data).toEqual(mockOrganisations[1].odsCode);
  });

  it('should transform data into correct format if data provided has missing fields', () => {
    const mockOrganisations = [
      { odsCode: 'X01', organisationId: 'org2' },
      { name: 'Hampshire CCG', organisationId: 'org2' },
      { name: 'Somerset CCG', odsCode: 'X01' },
    ];

    const { organisations } = getContext({ organisations: mockOrganisations });
    expect(organisations[0][0].data).toEqual('');
    expect(organisations[0][0].href).toEqual(`organisations/${mockOrganisations[0].organisationId}`);
    expect(organisations[0][1].data).toEqual(mockOrganisations[0].odsCode);
    expect(organisations[1][0].data).toEqual(mockOrganisations[1].name);
    expect(organisations[1][0].href).toEqual(`organisations/${mockOrganisations[1].organisationId}`);
    expect(organisations[1][1].data).toEqual('');
    expect(organisations[2][0].data).toEqual(mockOrganisations[2].name);
    expect(organisations[2][0].href).toEqual('#');
    expect(organisations[2][1].data).toEqual(mockOrganisations[2].odsCode);
  });
});
