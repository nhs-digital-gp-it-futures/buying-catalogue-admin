import manifest from './manifest.json';
import { baseUrl } from '../../../config';
import { getContext } from './contextCreator';

describe('findorg contextCreator', () => {
  describe('getContext', () => {
    it('should return the contents of the manifest', () => {
      const context = getContext({});
      expect(context.title).toEqual(manifest.title);
      expect(context.description).toEqual(manifest.description);
      expect(context.questions.length).toEqual(manifest.questions.length);
      expect(context.questions[0].id).toEqual(manifest.questions[0].id);
      expect(context.questions[0].mainAdvice).toEqual(manifest.questions[0].mainAdvice);
      expect(context.continueButtonText).toEqual(manifest.continueButtonText);
    });

    it('should add data to the question if odsCode is provided', () => {
      const context = getContext({ odsCode: 'ABC1' });
      expect(context.questions[0].data).toEqual('ABC1');
    });

    it('should not add data to the question if odsCode is not provided', () => {
      const context = getContext({});
      expect(context.questions[0].data).toEqual(undefined);
    });

    it('should not add error to the question if error is not provided', () => {
      const context = getContext({});
      expect(context.questions[0].error).toEqual(undefined);
    });

    it('should not add errors key to the context if error is not provided', () => {
      const context = getContext({});
      expect(context.errors).toEqual(undefined);
    });

    it('should construct backLinkHref', () => {
      const context = getContext({});
      expect(context.backLinkHref).toEqual(`${baseUrl}/organisations`);
    });

    describe('with Errors', () => {
      it('should add correct error to the question if 404 error is provided', () => {
        const context = getContext({ errorCode: '404' });
        expect(context.questions[0].error.message).toEqual('Organisation not found');
      });

      it('should add errors to the context if error if 404 error is provided', () => {
        const context = getContext({ errorCode: '404' });
        expect(context.errors).toEqual([{ href: '#odsCode', text: 'Organisation not found' }]);
      });

      it('should add correct error to the question if 406 error is provided', () => {
        const context = getContext({ errorCode: '406' });
        expect(context.questions[0].error.message).toEqual('Not a buyer organisation');
      });

      it('should add errors to the context if error if 406 error is provided', () => {
        const context = getContext({ errorCode: '406' });
        expect(context.errors).toEqual([{ href: '#odsCode', text: 'Not a buyer organisation' }]);
      });
    });
  });
});
