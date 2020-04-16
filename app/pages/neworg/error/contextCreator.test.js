import { getContext } from './contextCreator';
import manifest from './manifest.json';
import { baseUrl } from '../../../config';

const odsCode = 'abc';

describe('getContext for create org comfirmation', () => {
  it('should add manifest with parameters', () => {
    const context = getContext({ errorsString: 'OrganisationAlreadyExists+AnotherError', odsCode });
    expect(context.backLinkText).toEqual(manifest.backLinkText);
    expect(context.dataTestId).toEqual(manifest.dataTestId);
  });

  it('should construct backLink', () => {
    const context = getContext({ errorsString: 'OrganisationAlreadyExists+AnotherError', odsCode });
    expect(context.backLinkHref).toEqual(`${baseUrl}/organisations/find`);
  });

  describe('description', () => {
    it('should construct correct description when only error is OrganisationAlreadyExists', () => {
      const context = getContext({ errorsString: 'OrganisationAlreadyExists', odsCode });
      expect(context.description).toEqual(`The organisation with ODS code ${odsCode} already exists.`);
    });

    it('should construct correct description when errors includes OrganisationAlreadyExists', () => {
      const context = getContext({ errorsString: 'OrganisationAlreadyExists+AnotherError', odsCode });
      expect(context.description).toEqual(`The organisation with ODS code ${odsCode} already exists.`);
    });

    it('should construct correct description when only error is not OrganisationAlreadyExists', () => {
      const context = getContext({ errorsString: 'OneError', odsCode });
      expect(context.description).toEqual('Something went wrong.');
    });

    it('should construct correct description when errors do not include OrganisationAlreadyExists', () => {
      const context = getContext({ errorsString: 'OneError+AnotherError', odsCode });
      expect(context.description).toEqual('Something went wrong.');
    });
  });
});
