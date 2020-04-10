import manifest from './manifest.json';
import { getContext } from './contextCreator';
import { extractObjectValuesToArray } from '../../../helpers/contextCreatorHelper';

const mockOrgData = {
  organisationId: 'org1',
  organisationName: 'Greater Manchester CCG',
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

describe('createorg contextCreator', () => {
  describe('getContext', () => {
    it('should return the contents of the manifest', () => {
      const context = getContext({ orgData: mockOrgData });
      expect(context.title).toEqual(manifest.title);
      expect(context.description).toEqual(manifest.description);
      expect(context.organisationNameHeading).toEqual(manifest.organisationNameHeading);
      expect(context.odsCodeHeading).toEqual(manifest.odsCodeHeading);
      expect(context.addressHeading).toEqual(manifest.addressHeading);
      expect(context.primaryRoleIdHeading).toEqual(manifest.primaryRoleIdHeading);
      expect(context.selectOrgButtonText).toEqual(manifest.selectOrgButtonText);
    });

    it('should format the address', () => {
      const formattedAddress = extractObjectValuesToArray(mockOrgData.address);
      const context = getContext({ orgData: mockOrgData });
      expect(context.address).toEqual(formattedAddress);
    });

    it('should construct backLinkHref', () => {
      const context = getContext({ orgData: mockOrgData });
      expect(context.backLinkHref).toEqual('/organisations/find/select?ods=X01');
    });
  });
});
