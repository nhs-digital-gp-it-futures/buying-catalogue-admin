import { getContext } from './contextCreator';
import manifest from './manifest.json';
import { baseUrl } from '../../../config';

const odsCode = 'abc';

describe('getContext for create org comfirmation', () => {
  it('should add manifest with parameters', () => {
    const context = getContext({ errors: 'OrganisationAlreadyExists+AnotherError', odsCode });
    expect(context.backLinkText).toEqual(manifest.backLinkText);
    expect(context.dataTestId).toEqual(manifest.dataTestId);
  });

  it('should construct backLink', () => {
    const context = getContext({ errors: 'OrganisationAlreadyExists+AnotherError', odsCode });
    expect(context.backLinkHref).toEqual(`${baseUrl}/organisations/find`);
  });

  describe('errorMessage', () => {
    it('should construct correct errorMessage when only error is OrganisationAlreadyExists', () => {
      const context = getContext({ errors: 'OrganisationAlreadyExists', odsCode });
      expect(context.errorMessage).toEqual(`The organisation with ODS code ${odsCode} already exists.`);
    });

    it('should construct correct errorMessage when errors includes OrganisationAlreadyExists', () => {
      const context = getContext({ errors: 'OrganisationAlreadyExists+AnotherError', odsCode });
      expect(context.errorMessage).toEqual(`The organisation with ODS code ${odsCode} already exists.`);
    });

    it('should construct correct errorMessage when only error is not OrganisationAlreadyExists', () => {
      const context = getContext({ errors: 'OneError', odsCode });
      expect(context.errorMessage).toEqual('Something went wrong.');
    });

    it('should construct correct errorMessage when errors do not include OrganisationAlreadyExists', () => {
      const context = getContext({ errors: 'OneError+AnotherError', odsCode });
      expect(context.errorMessage).toEqual('Something went wrong.');
    });
  });
});
