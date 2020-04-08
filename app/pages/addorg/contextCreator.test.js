import manifest from './manifest.json';
import { getContext } from './contextCreator';

describe('addorg contextCreator', () => {
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

    it('should construct backLinkHref', () => {
      const context = getContext();
      expect(context.backLinkHref).toEqual('/organisations');
    });
  });
});
