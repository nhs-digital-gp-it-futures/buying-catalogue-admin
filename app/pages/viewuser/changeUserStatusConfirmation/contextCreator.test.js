import { getContext } from './contextCreator';
import manifest from './manifest.json';

describe('get Enable/Disable User Confirmation Context', () => {
  describe('enable', () => {
    it('should add manifest with parameters', () => {
      const context = getContext({ user: { name: 'John Smith', userId: 'user2' }, organisationId: 'org1', status: 'enable' });
      expect(context.backLinkText).toEqual(manifest.enable.backLinkText);
      expect(context.description).toEqual(manifest.enable.description);
      expect(context.dataTestId).toEqual(manifest.enable.dataTestId);
      expect(context.title).toEqual('John Smith account re-enabled');
    });

    it('should construct backLink', () => {
      const context = getContext({ user: { name: 'John Smith', userId: 'user2' }, organisationId: 'org1', status: 'enable' });
      expect(context.backLinkHref).toEqual('/organisations/org1/user2');
    });
  });

  describe('disable', () => {
    it('should add manifest with parameters', () => {
      const context = getContext({ user: { name: 'John Smith', userId: 'user2' }, organisationId: 'org1', status: 'disable' });
      expect(context.backLinkText).toEqual(manifest.disable.backLinkText);
      expect(context.description).toEqual(manifest.disable.description);
      expect(context.dataTestId).toEqual(manifest.disable.dataTestId);
      expect(context.title).toEqual('John Smith account disabled');
    });

    it('should construct backLink', () => {
      const context = getContext({ user: { name: 'John Smith', userId: 'user2' }, organisationId: 'org1', status: 'disable' });
      expect(context.backLinkHref).toEqual('/organisations/org1/user2');
    });
  });
});
