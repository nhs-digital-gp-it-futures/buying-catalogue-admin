import manifest from './manifest.json';
import { getContext } from './contextCreator';

const mockData = {
  organisationId: 'org1',
  name: 'Greater Manchester CCG',
  odsCode: 'X01',
  primaryRoleId: 'ID123',
  address: {
    line1: 'C/O NHS ENGLAND, 1W09, 1ST FLOOR',
    line2: 'QUARRY HOUSE',
    line3: 'QUARRY HILL',
    line4: null,
    town: 'LEEDS',
    county: 'WEST YORKSHIRE',
    postcode: 'LS2 7UE',
    country: 'ENGLAND',
  },
  catalogueAgreementSigned: true,
};

describe('getEditOrganisationContext', () => {
  it('should return the contents of the manfest', () => {
    const context = getContext({ organisation: {} });
    expect(context.description).toEqual(manifest.description);
    expect(context.orgSubheading).toEqual(manifest.orgSubheading);
    expect(context.editOrgButtonText).toEqual(manifest.editOrgButtonText);
    expect(context.odsCodeHeading).toEqual(manifest.odsCodeHeading);
    expect(context.primaryRoleIdHeading).toEqual(manifest.primaryRoleIdHeading);
    expect(context.addressHeading).toEqual(manifest.addressHeading);
    expect(context.catalogueAgreementCheckboxText).toEqual(manifest.catalogueAgreementCheckboxText);
    expect(context.saveButtonText).toEqual(manifest.saveButtonText);
  });

  it('should add organisationName, odsCode, primaryRoleId, agreementSigned to the context if provided', () => {
    const context = getContext({ organisation: mockData });
    expect(context.organisationName).toEqual(mockData.name);
    expect(context.odsCode).toEqual(mockData.odsCode);
    expect(context.primaryRoleId).toEqual(mockData.primaryRoleId);
    expect(context.agreementSigned).toEqual(mockData.catalogueAgreementSigned);
  });


  it('should add backLinkHref', () => {
    const { backLinkHref } = getContext({ organisation: mockData });
    expect(backLinkHref).toEqual(`/organisations/${mockData.organisationId}`);
  });

  it('should transform address object into array of data strings if provided', () => {
    const { address } = getContext({ organisation: mockData });
    expect(address).toEqual([
      'C/O NHS ENGLAND, 1W09, 1ST FLOOR',
      'QUARRY HOUSE',
      'QUARRY HILL',
      'LEEDS',
      'WEST YORKSHIRE',
      'LS2 7UE',
      'ENGLAND',
    ]);
  });

  it('should return empty array if address not provided', () => {
    const { address } = getContext({ organisation: {} });
    expect(address).toEqual([]);
  });

  it('should construct saveCatalogueAgreementPostAction', () => {
    const context = getContext({ organisation: mockData });
    expect(context.saveCatalogueAgreementPostAction).toEqual(`/organisations/${mockData.organisationId}/edit`);
  });
});
