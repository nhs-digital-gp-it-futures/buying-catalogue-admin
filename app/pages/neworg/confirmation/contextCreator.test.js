import { getContext } from './contextCreator';
import { baseUrl } from '../../../config';
import manifest from './manifest.json';

describe('getContext for create org comfirmation', () => {
  it('should add manifest with parameters', () => {
    const context = getContext({ orgName: 'An org name' });
    expect(context.backLinkText).toEqual(manifest.backLinkText);
    expect(context.description).toEqual(manifest.description);
    expect(context.dataTestId).toEqual(manifest.dataTestId);
    expect(context.title).toEqual('An org name created');
  });

  it('should construct backLink', () => {
    const context = getContext({ orgName: 'An org name' });
    expect(context.backLinkHref).toEqual(`${baseUrl}/organisations`);
  });
});
