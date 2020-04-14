import { getContext } from './contextCreator';
import { baseUrl } from '../../../config';
import manifest from './manifest.json';

describe('getAddUserConfirmationContext', () => {
  it('should add manifest with parameters', () => {
    const context = getContext({ userAdded: 'John Smith', organisationId: 'org1' });
    expect(context.backLinkText).toEqual(manifest.backLinkText);
    expect(context.description).toEqual(manifest.description);
    expect(context.dataTestId).toEqual(manifest.dataTestId);
    expect(context.title).toEqual('John Smith account added');
  });

  it('should construct backLink', () => {
    const context = getContext({ userAdded: 'John Smith', organisationId: 'org1' });
    expect(context.backLinkHref).toEqual(`${baseUrl}/organisations/org1`);
  });
});
