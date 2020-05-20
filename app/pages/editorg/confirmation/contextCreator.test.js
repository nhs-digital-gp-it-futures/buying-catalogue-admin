import { getContext } from './contextCreator';
import { baseUrl } from '../../../config';
import manifest from './manifest.json';

describe('getContext', () => {
  it('should add manifest with parameters', () => {
    const context = getContext({ organisationName: 'A lovely organisation', organisationId: 'org1' });
    expect(context.backLinkText).toEqual(manifest.backLinkText);
    expect(context.description).toEqual(manifest.description);
    expect(context.dataTestId).toEqual(manifest.dataTestId);
    expect(context.title).toEqual('A lovely organisation updated');
  });

  it('should construct backLink', () => {
    const context = getContext({ orgName: 'A lovely organisation', organisationId: 'org1' });
    expect(context.backLinkHref).toEqual(`${baseUrl}/organisations/org1`);
  });
});
