import manifest from './manifest.json';
import { getContext } from './contextCreator';

// TODO: amend tests when api is hooked up to test for org details added
describe('selectorg contextCreator', () => {
  describe('getContext', () => {
    it('should return the contents of the manifest', () => {
      const context = getContext({});
      expect(context.title).toEqual(manifest.title);
      expect(context.description).toEqual(manifest.description);
      expect(context.organisationNameHeading).toEqual(manifest.organisationNameHeading);
      expect(context.odsCodeHeading).toEqual(manifest.odsCodeHeading);
      expect(context.addressHeading).toEqual(manifest.addressHeading);
      expect(context.primaryRoleIdHeading).toEqual(manifest.primaryRoleIdHeading);
      expect(context.selectOrgButtonText).toEqual(manifest.selectOrgButtonText);
    });

    it('should construct backLinkHref', () => {
      const context = getContext();
      expect(context.backLinkHref).toEqual('/organisations/find?ods=X01');
    });
  });
});
